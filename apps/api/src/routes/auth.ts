import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@klyrn/db";

const auth = new Hono();

// POST /api/v1/auth/sync
// Called by frontend after Privy login
const syncSchema = z.object({
  privyDid: z.string().min(1),
  email: z.string().email(),
  walletAddress: z.string().min(32).max(44),
  displayName: z.string().optional(),
  country: z.string().length(2).optional(),
});

auth.post("/sync", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = syncSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        ok: false,
        error: { code: "VALIDATION_ERROR", message: parsed.error.message },
      }, 400);
    }

    const { privyDid, email, walletAddress, displayName, country } = parsed.data;

    // Generate handle from email
    const emailPrefix = email.split("@")[0] || "user";
    const handle = `@${emailPrefix.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`;

    // Upsert user
    const user = await prisma.user.upsert({
      where: { privyDid },
      update: {
        email,
        walletAddress,
        ...(displayName && { displayName }),
        ...(country && { country }),
      },
      create: {
        privyDid,
        email,
        walletAddress,
        handle,
        displayName: displayName || emailPrefix,
        country,
        role: "BOTH",
      },
    });

    return c.json({ ok: true, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[auth/sync] Error:", message);
    return c.json({
      ok: false,
      error: { code: "INTERNAL_ERROR", message },
    }, 500);
  }
});

export default auth;
