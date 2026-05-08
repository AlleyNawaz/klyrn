import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@klyrn/db";
import crypto from "crypto";

const contracts = new Hono();

// Zod schemas
const milestoneInputSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  amountUsdc: z.number().positive(),
  dueDate: z.string().datetime().optional(),
});

const createContractSchema = z.object({
  freelancerEmail: z.string().email(),
  title: z.string().min(1).max(200),
  briefMarkdown: z.string().min(200).max(5000),
  totalAmountUsdc: z.number().min(20).max(50000),
  milestones: z.array(milestoneInputSchema).min(1).max(10),
  autoApprovalDays: z.number().min(1).max(30).optional().default(5),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    hash: z.string(),
    size: z.number(),
  })).optional().default([]),
});

// POST /api/v1/contracts
contracts.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = createContractSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        ok: false,
        error: { code: "VALIDATION_ERROR", message: parsed.error.message },
      }, 400);
    }

    const data = parsed.data;

    // Validate milestone sum equals total
    const milestoneSum = data.milestones.reduce((sum, m) => sum + m.amountUsdc, 0);
    if (Math.abs(milestoneSum - data.totalAmountUsdc) > 0.01) {
      return c.json({
        ok: false,
        error: { code: "INVALID_MILESTONE_SUM", message: "Sum of milestone amounts must equal total budget" },
      }, 400);
    }

    // Convert to cents
    const totalCents = BigInt(Math.round(data.totalAmountUsdc * 100));

    // Compute brief hash
    const briefHash = crypto
      .createHash("sha256")
      .update(data.briefMarkdown + JSON.stringify(data.attachments))
      .digest("hex");

    // Generate contract ID (16 bytes)
    const contractIdBytes = crypto.randomBytes(16);
    const contractId = contractIdBytes.toString("hex");

    // Find or create freelancer
    let freelancer = await prisma.user.findUnique({
      where: { email: data.freelancerEmail },
    });

    if (!freelancer) {
      // Create placeholder user
      const handle = `@${data.freelancerEmail.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "_") || "user"}_${crypto.randomBytes(3).toString("hex")}`;
      freelancer = await prisma.user.create({
        data: {
          email: data.freelancerEmail,
          handle,
          displayName: data.freelancerEmail.split("@")[0] || "Freelancer",
          privyDid: `placeholder_${crypto.randomUUID()}`,
          walletAddress: `placeholder_${crypto.randomBytes(32).toString("base58") || crypto.randomUUID()}`,
          role: "FREELANCER",
        },
      });
      // TODO: Send invite email via Resend
    }

    // Get client from auth context (placeholder for now)
    // In production: extract from Privy JWT
    const clientId = c.req.header("x-user-id") || "";

    // Create contract with milestones
    const contract = await prisma.contract.create({
      data: {
        clientId,
        freelancerId: freelancer.id,
        title: data.title,
        briefMarkdown: data.briefMarkdown,
        briefAttachments: data.attachments,
        totalAmountUsdcCents: totalCents,
        autoApprovalDays: data.autoApprovalDays,
        status: "PENDING_ACCEPTANCE",
        milestones: {
          create: data.milestones.map((m, index) => ({
            index,
            title: m.title,
            description: m.description,
            amountUsdcCents: BigInt(Math.round(m.amountUsdc * 100)),
            dueDate: m.dueDate ? new Date(m.dueDate) : null,
            status: "PENDING",
          })),
        },
        events: {
          create: {
            type: "CREATED",
            payload: {
              briefHash,
              contractIdHex: contractId,
              totalAmountUsdc: data.totalAmountUsdc,
              milestoneCount: data.milestones.length,
            },
          },
        },
      },
      include: { milestones: true },
    });

    return c.json({
      ok: true,
      data: {
        contractId: contract.id,
        contractIdHex: contractId,
        briefHash,
        contract,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[contracts/create] Error:", message);
    return c.json({
      ok: false,
      error: { code: "INTERNAL_ERROR", message },
    }, 500);
  }
});

// GET /api/v1/contracts
contracts.get("/", async (c) => {
  try {
    const userId = c.req.header("x-user-id") || "";
    const status = c.req.query("status");
    const page = parseInt(c.req.query("page") || "1", 10);
    const pageSize = parseInt(c.req.query("pageSize") || "20", 10);

    const where = {
      OR: [
        { clientId: userId },
        { freelancerId: userId },
      ],
      ...(status ? { status: status as "PENDING_ACCEPTANCE" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "REFUNDED" } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        include: {
          client: { select: { handle: true, displayName: true, avatarUrl: true } },
          freelancer: { select: { handle: true, displayName: true, avatarUrl: true } },
          milestones: { select: { status: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contract.count({ where }),
    ]);

    return c.json({
      ok: true,
      data: {
        items,
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[contracts/list] Error:", message);
    return c.json({
      ok: false,
      error: { code: "INTERNAL_ERROR", message },
    }, 500);
  }
});

// GET /api/v1/contracts/:id
contracts.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        client: true,
        freelancer: true,
        milestones: {
          include: { dispute: true },
          orderBy: { index: "asc" },
        },
        events: { orderBy: { createdAt: "desc" }, take: 20 },
        ratings: true,
      },
    });

    if (!contract) {
      return c.json({
        ok: false,
        error: { code: "NOT_FOUND", message: "Contract not found" },
      }, 404);
    }

    return c.json({ ok: true, data: contract });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[contracts/get] Error:", message);
    return c.json({
      ok: false,
      error: { code: "INTERNAL_ERROR", message },
    }, 500);
  }
});

export default contracts;
