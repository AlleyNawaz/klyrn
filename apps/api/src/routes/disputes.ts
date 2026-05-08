import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@klyrn/db";

const disputes = new Hono();

// POST /api/v1/disputes/:id/respond
disputes.post("/:id/respond", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const schema = z.object({
      statement: z.string().min(100).max(2000),
      files: z.array(z.object({
        name: z.string(), url: z.string(), hash: z.string(), size: z.number(),
      })).optional().default([]),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return c.json({ ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } }, 400);
    }

    const dispute = await prisma.dispute.findUnique({ where: { id }, include: { milestone: { include: { contract: true } } } });
    if (!dispute) {
      return c.json({ ok: false, error: { code: "NOT_FOUND", message: "Dispute not found" } }, 404);
    }

    const userId = c.req.header("x-user-id") || "";
    const isClient = dispute.milestone.contract.clientId === userId;
    const isFreelancer = dispute.milestone.contract.freelancerId === userId;

    if (!isClient && !isFreelancer) {
      return c.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Not a party to this dispute" } }, 403);
    }

    // Update the appropriate side
    const update = isClient
      ? { clientStatement: parsed.data.statement, clientFiles: parsed.data.files }
      : { freelancerStatement: parsed.data.statement, freelancerFiles: parsed.data.files };

    const updated = await prisma.dispute.update({ where: { id }, data: update });

    // Check if both sides have responded — if so, trigger AI review
    if (updated.clientStatement && updated.freelancerStatement) {
      await prisma.dispute.update({ where: { id }, data: { status: "AI_REVIEW" } });
      // TODO: Queue BullMQ job for run-ai-arbitration
    }

    return c.json({ ok: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[disputes/respond] Error:", message);
    return c.json({ ok: false, error: { code: "INTERNAL_ERROR", message } }, 500);
  }
});

// GET /api/v1/disputes/:id
disputes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        milestone: { include: { contract: { include: { client: true, freelancer: true } } } },
        jurorVotes: { include: { juror: { select: { handle: true } } } },
      },
    });

    if (!dispute) {
      return c.json({ ok: false, error: { code: "NOT_FOUND", message: "Dispute not found" } }, 404);
    }

    return c.json({ ok: true, data: dispute });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[disputes/get] Error:", message);
    return c.json({ ok: false, error: { code: "INTERNAL_ERROR", message } }, 500);
  }
});

export default disputes;
