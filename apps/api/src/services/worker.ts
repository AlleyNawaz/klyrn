/**
 * Klyrn Background Job Worker
 * Uses BullMQ with Redis for async job processing
 *
 * Jobs:
 * 1. auto-approve-milestone — Fires when auto-approval deadline passes
 * 2. run-arbitration — Sends dispute to AI arbiter service
 * 3. send-email — Sends transactional emails via Resend
 */

import { Worker, Queue, Job } from "bullmq";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const ARBITER_URL = process.env.ARBITER_URL || "http://localhost:8000";

const connection = {
  host: new URL(REDIS_URL).hostname,
  port: parseInt(new URL(REDIS_URL).port || "6379"),
};

// ---- Queues ----

export const autoApprovalQueue = new Queue("auto-approve-milestone", { connection });
export const arbitrationQueue = new Queue("run-arbitration", { connection });
export const emailQueue = new Queue("send-email", { connection });

// ---- Auto-Approval Worker ----

const autoApprovalWorker = new Worker(
  "auto-approve-milestone",
  async (job: Job) => {
    const { milestoneId, contractId } = job.data;
    console.log(`[auto-approve] Processing milestone ${milestoneId}`);

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: true },
    });

    if (!milestone) {
      console.log(`[auto-approve] Milestone ${milestoneId} not found, skipping`);
      return;
    }

    // Only auto-approve if still in SUBMITTED status
    if (milestone.status !== "SUBMITTED") {
      console.log(`[auto-approve] Milestone ${milestoneId} is ${milestone.status}, skipping`);
      return;
    }

    // Update milestone to APPROVED
    await prisma.$transaction([
      prisma.milestone.update({
        where: { id: milestoneId },
        data: {
          status: "APPROVED",
          decidedAt: new Date(),
          decidedBy: "AUTO_TIMEOUT",
          decision: "APPROVED",
        },
      }),
      prisma.contractEvent.create({
        data: {
          contractId,
          type: "MILESTONE_AUTO_APPROVED",
          payload: { milestoneId, milestoneIndex: milestone.index },
        },
      }),
    ]);

    console.log(`[auto-approve] Milestone ${milestoneId} auto-approved ✓`);

    // TODO: Send on-chain approve_milestone instruction
    // TODO: Send payment release email
  },
  { connection, concurrency: 5 }
);

// ---- Arbitration Worker ----

const arbitrationWorker = new Worker(
  "run-arbitration",
  async (job: Job) => {
    const { disputeId } = job.data;
    console.log(`[arbitration] Processing dispute ${disputeId}`);

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        milestone: {
          include: {
            contract: {
              include: {
                client: true,
                freelancer: true,
              },
            },
          },
        },
      },
    });

    if (!dispute) {
      throw new Error(`Dispute ${disputeId} not found`);
    }

    if (dispute.status !== "AWAITING_RESPONSES" && dispute.status !== "AI_REVIEW") {
      console.log(`[arbitration] Dispute ${disputeId} is ${dispute.status}, skipping`);
      return;
    }

    // Mark as AI_REVIEW
    await prisma.dispute.update({
      where: { id: disputeId },
      data: { status: "AI_REVIEW" },
    });

    // Build request payload
    const contract = dispute.milestone.contract;
    const milestone = dispute.milestone;

    const arbitrationPayload = {
      dispute_id: disputeId,
      contract: {
        title: contract.title,
        brief_markdown: contract.briefMarkdown,
        brief_attachments: contract.briefAttachments || [],
      },
      milestone: {
        index: milestone.index,
        title: milestone.title,
        description: milestone.description,
        amount_usdc: Number(milestone.amountUsdcCents) / 100,
        due_date: milestone.dueDate?.toISOString() || null,
        submitted_at: milestone.submittedAt?.toISOString() || "",
      },
      submission: {
        notes: milestone.submissionNotes || "",
        files: milestone.submissionFiles || [],
        external_links: milestone.submissionExternalLinks || [],
        screencast_url: milestone.submissionScreencastUrl || null,
      },
      dispute: {
        reason_category: dispute.reasonCategory,
        client_statement: dispute.clientStatement || "",
        client_files: dispute.clientFiles || [],
        freelancer_statement: dispute.freelancerStatement || "",
        freelancer_files: dispute.freelancerFiles || [],
      },
    };

    // Call arbiter service
    const response = await fetch(`${ARBITER_URL}/arbitrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arbitrationPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Arbiter returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    // Save result
    await prisma.$transaction([
      prisma.dispute.update({
        where: { id: disputeId },
        data: {
          status: result.should_escalate ? "ESCALATED_TO_JURY" : "AI_DECIDED",
          aiVerdict: result.verdict,
          aiConfidence: result.confidence,
          aiReasoning: result.reasoning,
          aiPartialPercent: result.partial_percent,
        },
      }),
      prisma.arbitrationLog.create({
        data: {
          disputeId,
          model: result.model,
          tokensIn: result.tokens_used.input,
          tokensOut: result.tokens_used.output,
          costUsd: result.cost_usd,
          verdict: result.verdict,
          confidence: result.confidence,
          reasoning: result.reasoning,
          evidenceCited: result.evidence_cited,
          shouldEscalate: result.should_escalate,
          escalationReason: result.escalation_reason,
        },
      }),
      prisma.contractEvent.create({
        data: {
          contractId: contract.id,
          type: result.should_escalate ? "DISPUTE_ESCALATED" : "AI_VERDICT_RENDERED",
          payload: {
            disputeId,
            verdict: result.verdict,
            confidence: result.confidence,
          },
        },
      }),
    ]);

    console.log(
      `[arbitration] Dispute ${disputeId}: ${result.verdict} (${result.confidence}%) ${
        result.should_escalate ? "→ ESCALATED" : "✓"
      }`
    );

    // If not escalated and verdict is final, apply on-chain
    if (!result.should_escalate) {
      // TODO: Send resolve_dispute on-chain instruction
      // TODO: Send verdict email to both parties
    }
  },
  { connection, concurrency: 2 }
);

// ---- Email Worker ----

const emailWorker = new Worker(
  "send-email",
  async (job: Job) => {
    const { type, data } = job.data;
    console.log(`[email] Sending ${type} email`);

    // Dynamic import to keep worker lightweight
    const emailService = await import("./email");

    switch (type) {
      case "contract-invite":
        await emailService.sendContractInvite(data);
        break;
      case "milestone-submitted":
        await emailService.sendMilestoneSubmitted(data);
        break;
      case "dispute-filed":
        await emailService.sendDisputeFiled(data);
        break;
      case "verdict-rendered":
        await emailService.sendVerdictRendered(data);
        break;
      case "payment-released":
        await emailService.sendPaymentReleased(data);
        break;
      default:
        console.warn(`[email] Unknown email type: ${type}`);
    }

    console.log(`[email] ${type} sent ✓`);
  },
  { connection, concurrency: 10 }
);

// ---- Graceful Shutdown ----

async function shutdown() {
  console.log("[worker] Shutting down...");
  await autoApprovalWorker.close();
  await arbitrationWorker.close();
  await emailWorker.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// ---- Startup ----

console.log("🚀 Klyrn workers started");
console.log("  → auto-approve-milestone (concurrency: 5)");
console.log("  → run-arbitration (concurrency: 2)");
console.log("  → send-email (concurrency: 10)");

// ---- Queue Helpers (exported for API to enqueue jobs) ----

export async function scheduleAutoApproval(milestoneId: string, contractId: string, delayMs: number) {
  await autoApprovalQueue.add(
    "auto-approve",
    { milestoneId, contractId },
    { delay: delayMs, jobId: `auto-approve-${milestoneId}` }
  );
  console.log(`[queue] Scheduled auto-approval for milestone ${milestoneId} in ${delayMs}ms`);
}

export async function enqueueArbitration(disputeId: string) {
  await arbitrationQueue.add(
    "run-arbitration",
    { disputeId },
    { jobId: `arbitrate-${disputeId}` }
  );
  console.log(`[queue] Enqueued arbitration for dispute ${disputeId}`);
}

export async function enqueueEmail(type: string, data: Record<string, unknown>) {
  await emailQueue.add("send-email", { type, data });
}
