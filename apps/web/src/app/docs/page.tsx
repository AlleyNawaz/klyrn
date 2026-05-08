"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Zap, BookOpen, Scale, Users, Code2, ChevronDown, ArrowLeft } from "lucide-react";

const sections = [
  {
    id: "quickstart",
    title: "Quickstart",
    icon: Zap,
    content: [
      { heading: "Create your first contract", body: "Sign up at klyrn.xyz, click \"Start a contract\", and fill in the project title, brief, and budget. Your brief is the ground truth for any dispute, so be specific about what you expect." },
      { heading: "Add milestones", body: "Break the project into milestones. Each milestone has a title, description, and amount in USDC. Funds are locked per-milestone, so the freelancer gets paid as they deliver." },
      { heading: "Invite your freelancer", body: "Enter the freelancer's email. They'll receive an invite to review and accept the contract. Once accepted, the escrow is live." },
      { heading: "Fund the escrow", body: "Deposit USDC into the on-chain escrow. The funds are locked in a Solana smart contract. Neither party can withdraw until work is approved or a dispute is resolved." },
      { heading: "Approve and release", body: "When the freelancer submits work, review it against the brief. Approve to release funds instantly. If you don't respond within the auto-approval window (default: 5 days), funds release automatically." },
    ],
  },
  {
    id: "escrow",
    title: "How Escrow Works",
    icon: BookOpen,
    content: [
      { heading: "Milestone-based escrow", body: "Each contract is split into milestones. The client funds all milestones upfront, but funds are released one at a time as each milestone is approved. This protects both sides: the freelancer knows the money exists, and the client only pays for completed work." },
      { heading: "On-chain smart contract", body: "The escrow lives on Solana as a program-derived account (PDA). The program enforces all rules: only the client can approve, only the freelancer can submit, and only the AI/jurors can resolve disputes. No human admin can move funds." },
      { heading: "Auto-approval", body: "If the client doesn't review a submission within the auto-approval window (configurable, default 5 days), funds are released automatically. This prevents clients from ghosting freelancers." },
      { heading: "Partial releases", body: "If work partially meets the spec, the AI or juror panel can order a partial release (e.g., 70% to freelancer, 30% refunded to client). This is fairer than all-or-nothing." },
    ],
  },
  {
    id: "arbitration",
    title: "AI Arbitration",
    icon: Scale,
    content: [
      { heading: "How the AI Judge works", body: "When a dispute is filed, both parties submit their statements and evidence. The AI reads the original contract brief, the submitted deliverables, and both statements. It then renders a verdict based purely on what was agreed in the brief." },
      { heading: "Evidence-based reasoning", body: "The AI cites specific clauses from the brief in its reasoning. For example: \"The brief states 'modern, minimalist design' but the client is requesting a mascot, which contradicts the brief.\" This transparency builds trust in the verdict." },
      { heading: "Confidence score", body: "Each verdict includes a confidence score (0-100%). If confidence is below 70%, the dispute is automatically escalated to a human juror panel. This ensures edge cases get human judgment." },
      { heading: "Speed", body: "The AI renders a verdict in under 8 seconds. Compare this to Upwork's 7-14 day dispute process or PayPal's 30-day resolution window." },
    ],
  },
  {
    id: "disputes",
    title: "Disputes",
    icon: Scale,
    content: [
      { heading: "Filing a dispute", body: "Either party can dispute a milestone after submission. The disputing party selects a reason (incomplete, off-spec, low quality, plagiarism, late, or other) and writes a statement with optional file evidence." },
      { heading: "Response window", body: "The other party has 72 hours to submit their counter-statement and evidence. If they don't respond, the dispute is decided based on available evidence." },
      { heading: "AI verdict", body: "The AI reviews all evidence and renders a verdict: approved (freelancer gets paid), rejected (client gets refund), or partial (split). Both parties can see the full reasoning." },
      { heading: "Appeal to jurors", body: "If either party disagrees with the AI verdict, they can appeal to a human juror panel. Three jurors review the case independently and vote. Majority wins. Juror decisions are final." },
    ],
  },
  {
    id: "jurors",
    title: "Become a Juror",
    icon: Users,
    content: [
      { heading: "Requirements", body: "Jurors must stake a minimum amount of SOL to participate. This ensures jurors have skin in the game and discourages frivolous voting." },
      { heading: "How cases are assigned", body: "When a dispute is escalated, three jurors are randomly selected from the pool. Jurors have 48 hours to review the case and submit their vote." },
      { heading: "Voting", body: "Each juror independently reviews the brief, deliverables, statements, and AI reasoning. They vote: approve, reject, or partial. Majority wins." },
      { heading: "Earning fees", body: "Jurors earn a fee for each case they review. Fees come from the dispute resolution fee (included in the 1% platform fee). Jurors who vote with the majority earn more than those who dissent." },
    ],
  },
  {
    id: "api",
    title: "API Reference",
    icon: Code2,
    content: [
      { heading: "Base URL", body: "All API requests go to https://api.klyrn.xyz/v1. Authentication is via Bearer token in the Authorization header." },
      { heading: "POST /contracts", body: "Create a new contract. Required fields: title (string), briefMarkdown (string), totalAmountUsdc (number), milestones (array of {title, description, amountUsdc}), freelancerEmail (string)." },
      { heading: "GET /contracts/:id", body: "Retrieve a contract by ID. Returns full contract details including milestones, status, client/freelancer profiles, and any active disputes." },
      { heading: "POST /milestones/:id/submit", body: "Submit deliverables for a milestone. Accepts multipart form data with files and a notes field. File hashes are computed and sealed on-chain." },
      { heading: "POST /disputes", body: "File a dispute on a milestone. Required fields: milestoneId (string), reasonCategory (enum), statement (string). Optional: files (array)." },
      { heading: "Rate limits", body: "API is rate-limited to 100 requests per minute per API key. Webhooks are available for real-time event notifications (contract.accepted, milestone.submitted, dispute.resolved, etc.)." },
    ],
  },
];

export default function DocsPage() {
  const [openSection, setOpenSection] = useState<string>("quickstart");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[rgba(255,255,255,0.06)] sticky top-0 bg-[#0B0F12]/90 backdrop-blur-xl z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00D6A4] to-[#00B37E] flex items-center justify-center">
              <Shield className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-bold">klyrn</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#6F767E]">Documentation</span>
            <Link href="/" className="text-xs text-[#6F767E] hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-[220px_1fr] gap-10">
        {/* Sidebar nav */}
        <nav className="hidden md:block">
          <div className="sticky top-20 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setOpenSection(s.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  openSection === s.id
                    ? "bg-[rgba(0,214,164,0.08)] text-[#00D6A4] font-medium"
                    : "text-[#9BA1A6] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                <s.icon className="w-4 h-4 flex-shrink-0" />
                {s.title}
              </button>
            ))}
          </div>
        </nav>

        {/* Content area */}
        <main>
          <h1 className="text-3xl font-bold mb-2 tracking-[-0.02em]">Documentation</h1>
          <p className="text-[#9BA1A6] mb-10">Everything you need to know about Klyrn.</p>

          {/* Mobile accordion */}
          <div className="md:hidden space-y-3 mb-8">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setOpenSection(openSection === s.id ? "" : s.id)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-sm transition-all ${
                  openSection === s.id
                    ? "border-[rgba(0,214,164,0.3)] bg-[rgba(0,214,164,0.05)] text-[#00D6A4]"
                    : "border-[rgba(255,255,255,0.06)] text-[#9BA1A6]"
                }`}
              >
                <span className="flex items-center gap-2"><s.icon className="w-4 h-4" /> {s.title}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSection === s.id ? "rotate-180" : ""}`} />
              </button>
            ))}
          </div>

          {/* Active section content */}
          {sections.filter(s => s.id === openSection).map((s) => (
            <div key={s.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,214,164,0.1)] flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-[#00D6A4]" />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">{s.title}</h2>
              </div>
              <div className="space-y-8">
                {s.content.map((item) => (
                  <div key={item.heading} className="group">
                    <h3 className="text-base font-semibold mb-2 text-[#ECEDEE]">{item.heading}</h3>
                    <p className="text-sm text-[#9BA1A6] leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
