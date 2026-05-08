import { Hono } from "hono";
import { prisma } from "@klyrn/db";

const dev = new Hono();

// Only available when GOD_MODE=true
dev.use("*", async (c, next) => {
  if (process.env.GOD_MODE !== "true") {
    return c.json({ ok: false, error: { code: "FORBIDDEN", message: "GOD_MODE not enabled" } }, 403);
  }
  await next();
});

// POST /api/v1/dev/run-arbitration
// Manually trigger AI arbitration for a dispute
dev.post("/run-arbitration", async (c) => {
  try {
    const { disputeId } = await c.req.json();

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        milestone: {
          include: {
            contract: {
              include: { client: true, freelancer: true },
            },
          },
        },
      },
    });

    if (!dispute) {
      return c.json({ ok: false, error: { code: "NOT_FOUND", message: "Dispute not found" } }, 404);
    }

    const arbiterUrl = process.env.ARBITER_URL || "http://localhost:8000";

    const arbReq = {
      dispute_id: dispute.id,
      contract: {
        title: dispute.milestone.contract.title,
        brief_markdown: dispute.milestone.contract.briefMarkdown,
        brief_attachments: dispute.milestone.contract.briefAttachments as Array<{name: string; url: string; hash: string; size: number}>,
      },
      milestone: {
        index: dispute.milestone.index,
        title: dispute.milestone.title,
        description: dispute.milestone.description,
        amount_usdc: Number(dispute.milestone.amountUsdcCents) / 100,
        due_date: dispute.milestone.dueDate?.toISOString() || null,
        submitted_at: dispute.milestone.submittedAt?.toISOString() || new Date().toISOString(),
      },
      submission: {
        notes: dispute.milestone.submissionNotes || "",
        files: (dispute.milestone.submissionFiles as Array<{name: string; url: string; hash: string; size: number}>) || [],
        external_links: (dispute.milestone.submissionExternalLinks as Array<{label: string; url: string}>) || [],
        screencast_url: dispute.milestone.submissionScreencastUrl || null,
      },
      dispute: {
        reason_category: dispute.reasonCategory,
        client_statement: dispute.clientStatement || "",
        client_files: (dispute.clientFiles as Array<{name: string; url: string; hash: string; size: number}>) || [],
        freelancer_statement: dispute.freelancerStatement || null,
        freelancer_files: (dispute.freelancerFiles as Array<{name: string; url: string; hash: string; size: number}>) || [],
      },
    };

    const resp = await fetch(`${arbiterUrl}/arbitrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arbReq),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return c.json({ ok: false, error: { code: "ARBITER_ERROR", message: errText } }, 502);
    }

    const verdict = await resp.json();

    // Persist AI verdict
    await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        aiVerdict: verdict.verdict,
        aiConfidence: verdict.confidence,
        aiReasoning: verdict.reasoning,
        aiPartialPercent: verdict.partial_percent,
        aiRanAt: new Date(),
        status: verdict.should_escalate ? "ESCALATED_TO_JURY" : "AI_DECIDED",
        ...(!verdict.should_escalate ? {
          finalDecision: verdict.verdict,
          finalPartialPercent: verdict.partial_percent,
          decidedAt: new Date(),
          decidedBy: "AI",
        } : {}),
      },
    });

    return c.json({ ok: true, data: verdict });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[dev/run-arbitration] Error:", message);
    return c.json({ ok: false, error: { code: "INTERNAL_ERROR", message } }, 500);
  }
});

// POST /api/v1/dev/advance-time
dev.post("/advance-time", async (c) => {
  // Placeholder — in production this would advance BullMQ job timestamps
  return c.json({ ok: true, data: { message: "Time advanced by 5 seconds (simulated)" } });
});

export default dev;
