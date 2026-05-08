/**
 * Klyrn Demo Seed Script
 * Section 13 — Creates demo data for the presentation
 * 
 * Run: pnpm seed:demo
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Klyrn demo data...\n");

  // ---- 1. Create 6 demo users ----
  console.log("👤 Creating demo users...");

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "mike@example.com" },
      update: {},
      create: {
        email: "mike@example.com",
        handle: "@keith_t",
        displayName: "Keith Thompson",
        privyDid: "did:privy:demo_mike",
        walletAddress: "DemoMikeWa11et111111111111111111111111111",
        role: "CLIENT",
        country: "US",
        timezone: "America/Chicago",
        totalContractsCompleted: 12,
        totalVolumeUsdCents: 2450000,
        disputeRate: 0.08,
        avgRating: 4.7,
        onTimePaymentRate: 0.95,
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah@example.com" },
      update: {},
      create: {
        email: "sarah@example.com",
        handle: "@ahmad_designs",
        displayName: "Ahmad Hassan",
        privyDid: "did:privy:demo_sarah",
        walletAddress: "DemoSarahWa11et11111111111111111111111111",
        role: "FREELANCER",
        country: "PK",
        timezone: "Asia/Karachi",
        totalContractsCompleted: 28,
        totalVolumeUsdCents: 4200000,
        disputeRate: 0.04,
        avgRating: 4.9,
        onTimeDeliveryRate: 0.96,
      },
    }),
    prisma.user.upsert({
      where: { email: "alex@example.com" },
      update: {},
      create: {
        email: "alex@example.com",
        handle: "@alex_dev",
        displayName: "Alex Kim",
        privyDid: "did:privy:demo_alex",
        walletAddress: "DemoAlexWa11et111111111111111111111111111",
        role: "BOTH",
        country: "KR",
        timezone: "Asia/Seoul",
        totalContractsCompleted: 45,
        totalVolumeUsdCents: 8900000,
        disputeRate: 0.02,
        avgRating: 4.8,
        onTimeDeliveryRate: 0.98,
      },
    }),
    prisma.user.upsert({
      where: { email: "lisa@example.com" },
      update: {},
      create: {
        email: "lisa@example.com",
        handle: "@lisa_writes",
        displayName: "Lisa Morales",
        privyDid: "did:privy:demo_lisa",
        walletAddress: "DemoLisaWa11et111111111111111111111111111",
        role: "FREELANCER",
        country: "BR",
        timezone: "America/Sao_Paulo",
        totalContractsCompleted: 18,
        totalVolumeUsdCents: 2100000,
        disputeRate: 0.06,
        avgRating: 4.6,
        onTimeDeliveryRate: 0.89,
      },
    }),
    prisma.user.upsert({
      where: { email: "david@example.com" },
      update: {},
      create: {
        email: "david@example.com",
        handle: "@david_pm",
        displayName: "David Okafor",
        privyDid: "did:privy:demo_david",
        walletAddress: "DemoDavidWa11et11111111111111111111111111",
        role: "CLIENT",
        country: "NG",
        timezone: "Africa/Lagos",
        totalContractsCompleted: 8,
        totalVolumeUsdCents: 1500000,
        disputeRate: 0.12,
        avgRating: 4.3,
        onTimePaymentRate: 0.88,
      },
    }),
    prisma.user.upsert({
      where: { email: "emma@example.com" },
      update: {},
      create: {
        email: "emma@example.com",
        handle: "@emma_motion",
        displayName: "Emma Chen",
        privyDid: "did:privy:demo_emma",
        walletAddress: "DemoEmmaWa11et111111111111111111111111111",
        role: "FREELANCER",
        country: "PH",
        timezone: "Asia/Manila",
        totalContractsCompleted: 35,
        totalVolumeUsdCents: 5600000,
        disputeRate: 0.03,
        avgRating: 4.9,
        onTimeDeliveryRate: 0.97,
      },
    }),
  ]);

  const [mike, sarah, alex, lisa, david, emma] = users;
  console.log(`  ✅ Created ${users.length} users\n`);

  // ---- 2. Create contracts in different states ----
  console.log("📄 Creating demo contracts...");

  // Contract 1: Active, 2/4 milestones done
  const contract1 = await prisma.contract.create({
    data: {
      clientId: mike.id,
      freelancerId: sarah.id,
      title: "Brand Identity Redesign",
      briefMarkdown: "Complete brand identity redesign including logo, color palette, typography guide, and business card design. Modern minimalist aesthetic preferred.",
      briefAttachments: [],
      totalAmountUsdcCents: BigInt(250000),
      status: "ACTIVE",
      autoApprovalDays: 5,
      acceptedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      milestones: {
        create: [
          { index: 0, title: "Logo Concepts", description: "3 logo concepts", amountUsdcCents: BigInt(75000), status: "APPROVED", decidedBy: "CLIENT", decision: "APPROVED" },
          { index: 1, title: "Color & Typography", description: "Color palette and type guide", amountUsdcCents: BigInt(50000), status: "APPROVED", decidedBy: "CLIENT", decision: "APPROVED" },
          { index: 2, title: "Business Cards", description: "Business card designs", amountUsdcCents: BigInt(50000), status: "SUBMITTED", submittedAt: new Date() },
          { index: 3, title: "Brand Guidelines", description: "Full brand guidelines PDF", amountUsdcCents: BigInt(75000), status: "PENDING" },
        ],
      },
    },
  });

  // Contract 2: Active, 1/3 milestones done
  await prisma.contract.create({
    data: {
      clientId: david.id,
      freelancerId: alex.id,
      title: "Mobile App UI Design",
      briefMarkdown: "Design the complete UI for a fitness tracking mobile app. Must include onboarding, dashboard, workout tracking, and social features.",
      briefAttachments: [],
      totalAmountUsdcCents: BigInt(480000),
      status: "ACTIVE",
      autoApprovalDays: 7,
      acceptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      milestones: {
        create: [
          { index: 0, title: "Wireframes", description: "Low-fi wireframes", amountUsdcCents: BigInt(120000), status: "APPROVED", decidedBy: "CLIENT", decision: "APPROVED" },
          { index: 1, title: "High-fi Designs", description: "High-fidelity mockups", amountUsdcCents: BigInt(200000), status: "PENDING" },
          { index: 2, title: "Prototype", description: "Interactive Figma prototype", amountUsdcCents: BigInt(160000), status: "PENDING" },
        ],
      },
    },
  });

  // Contract 3: COMPLETED
  await prisma.contract.create({
    data: {
      clientId: mike.id,
      freelancerId: lisa.id,
      title: "Website Copy Rewrite",
      briefMarkdown: "Rewrite all website copy for a SaaS landing page. Must be SEO-optimized and conversion-focused.",
      briefAttachments: [],
      totalAmountUsdcCents: BigInt(120000),
      status: "COMPLETED",
      autoApprovalDays: 5,
      acceptedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      milestones: {
        create: [
          { index: 0, title: "Homepage", description: "Homepage copy", amountUsdcCents: BigInt(60000), status: "APPROVED", decidedBy: "CLIENT", decision: "APPROVED" },
          { index: 1, title: "Inner Pages", description: "About, pricing, features", amountUsdcCents: BigInt(60000), status: "APPROVED", decidedBy: "CLIENT", decision: "APPROVED" },
        ],
      },
    },
  });

  // Contract 4: PENDING ACCEPTANCE
  await prisma.contract.create({
    data: {
      clientId: david.id,
      freelancerId: emma.id,
      title: "Product Video Animation",
      briefMarkdown: "Create a 60-second product explainer video with 2D animation and voiceover.",
      briefAttachments: [],
      totalAmountUsdcCents: BigInt(350000),
      status: "PENDING_ACCEPTANCE",
      autoApprovalDays: 5,
      milestones: {
        create: [
          { index: 0, title: "Storyboard", description: "Storyboard + script", amountUsdcCents: BigInt(100000), status: "PENDING" },
          { index: 1, title: "Animation", description: "Full animation", amountUsdcCents: BigInt(200000), status: "PENDING" },
          { index: 2, title: "Final Edit", description: "Voiceover + final edit", amountUsdcCents: BigInt(50000), status: "PENDING" },
        ],
      },
    },
  });

  // ---- 3. THE DEMO STAR CONTRACT — Logo dispute ----
  console.log("⭐ Creating the demo star contract (Logo dispute)...");

  const demoContract = await prisma.contract.create({
    data: {
      clientId: mike.id,
      freelancerId: sarah.id,
      title: "Logo Design — Klyrn MVP",
      briefMarkdown: `## Logo Design Brief

Design a logo for Klyrn, a modern fintech escrow platform.

### Requirements:
- **Modern, minimalist** design language
- **Vector format** (SVG required, plus PNG exports at 1x, 2x, 4x)
- Must include a **custom wordmark** (the company name in a custom typeface or modified font)
- Color: Primary green (#00D395) on dark backgrounds
- Must work at small sizes (16x16 favicon) and large (billboard)

### What to avoid:
- **Avoid stock-style mascots** — no cartoon characters, no shields with padlocks, no generic crypto imagery
- No gradients that don't work in single-color reproduction
- No overly complex illustrations that lose detail at small sizes

### Deliverables:
1. Logo in SVG format
2. PNG exports (1x, 2x, 4x)
3. Brief style guide showing usage on light/dark backgrounds

### Budget: $500
### Deadline: No hard deadline, but prefer within 5 business days`,
      briefAttachments: [],
      totalAmountUsdcCents: BigInt(50000),
      status: "ACTIVE",
      autoApprovalDays: 5,
      acceptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      milestones: {
        create: [
          {
            index: 0,
            title: "Final Logo Delivery",
            description: "Complete logo package: SVG, PNG exports, and mini style guide",
            amountUsdcCents: BigInt(50000),
            status: "DISPUTED",
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            submissionNotes: "Here's the final logo! Clean, modern wordmark with a subtle shield element integrated into the 'P'. Delivered in SVG + PNG (1x, 2x, 4x). Also included a quick style guide showing it on dark and light backgrounds. The design is minimalist and works great at all sizes including favicon.",
            submissionFiles: [
              { name: "klyrn-logo.svg", url: "https://example.com/klyrn-logo.svg", hash: "abc123", size: 12400, mime: "image/svg+xml" },
              { name: "klyrn-logo-1x.png", url: "https://example.com/klyrn-logo-1x.png", hash: "def456", size: 45600, mime: "image/png" },
              { name: "style-guide.pdf", url: "https://example.com/style-guide.pdf", hash: "ghi789", size: 234000, mime: "application/pdf" },
            ],
            submissionExternalLinks: [{ label: "Figma File", url: "https://figma.com/file/example" }],
          },
        ],
      },
    },
    include: { milestones: true },
  });

  // Create the dispute
  const milestone = demoContract.milestones[0];
  if (milestone) {
    await prisma.dispute.create({
      data: {
        milestoneId: milestone.id,
        openedById: mike.id,
        reasonCategory: "OFF_SPEC",
        clientStatement: "This is not what I asked for at all. I specifically wanted a mascot logo — something friendly and approachable with a character that represents trust and security. What Sarah delivered is just a boring wordmark with a tiny shield. I need a full mascot character, not this minimalist stuff. I want a complete redo.",
        clientFiles: [],
        freelancerStatement: "The brief explicitly says 'Avoid stock-style mascots — no cartoon characters, no shields with padlocks.' Mike is now asking for exactly what the brief told me NOT to do. I delivered a modern, minimalist wordmark with a custom typeface, exactly as specified. The SVG is clean, works at all sizes, and includes the style guide. This matches every single requirement in the brief.",
        freelancerFiles: [],
        status: "AWAITING_RESPONSES",
        responseDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });
  }

  console.log("  ✅ Demo star contract created with dispute\n");

  // ---- 4. Create juror profiles ----
  console.log("⚖️ Creating juror profiles...");

  const jurorUsers = [alex, lisa, emma];
  for (const user of jurorUsers) {
    await prisma.jurorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        stakeAmount: BigInt(50000000), // 50 USDC
        stakeTxSig: `demo_stake_${user.handle}`,
        expertise: user.handle === "@alex_dev" ? ["frontend", "backend", "design"]
          : user.handle === "@lisa_writes" ? ["writing", "marketing", "design"]
          : ["design", "video", "animation"],
        totalVotes: Math.floor(Math.random() * 20) + 5,
        correctVotes: Math.floor(Math.random() * 15) + 5,
        isActive: true,
      },
    });
  }

  console.log(`  ✅ Created ${jurorUsers.length} juror profiles\n`);

  console.log("✨ Demo seed complete! Run the app with GOD_MODE=true\n");
  console.log("Demo scenario:");
  console.log("  1. Log in as Mike (@keith_t) — view the disputed logo contract");
  console.log("  2. Click 'Run AI Arbitration' on the dispute");
  console.log("  3. Watch AI side with Sarah, citing the brief's 'avoid mascots' line");
  console.log(`  4. Demo contract ID: ${demoContract.id}\n`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
