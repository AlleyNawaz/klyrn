"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, Clock, AlertTriangle, FileText,
  Upload, ExternalLink, ChevronDown, ChevronUp, Shield,
  DollarSign, Calendar, User, Zap, Scale
} from "lucide-react";

// ---- Demo data (replaced by API in production) ----
const DEMO_CONTRACT = {
  id: "demo-logo-contract",
  title: "Logo Design for Klyrn MVP",
  status: "ACTIVE" as string,
  totalAmountUsdcCents: "50000",
  autoApprovalDays: 5,
  createdAt: "2025-06-01T00:00:00Z",
  acceptedAt: "2025-06-02T00:00:00Z",
  briefMarkdown: `Logo Design Brief\n\nDesign a logo for Klyrn, a modern fintech escrow platform.\n\nRequirements:\nModern, minimalist design language\nVector format (SVG required)\nMust include a custom wordmark\nColor: Primary green (#00D395)\n\nWhat to avoid:\nAvoid stock-style mascots, no cartoon characters\nNo gradients that don't work in single-color reproduction`,
  client: { handle: "@keith_t", displayName: "Keith Thompson", avatarUrl: null },
  freelancer: { handle: "@ahmad_designs", displayName: "Ahmad Hassan", avatarUrl: null },
  milestones: [
    {
      id: "m1",
      index: 0,
      title: "Final Logo Delivery",
      description: "Complete logo package: SVG, PNG exports, and mini style guide",
      amountUsdcCents: "50000",
      status: "DISPUTED" as string,
      submittedAt: "2025-06-04T14:00:00Z",
      submissionNotes: "Here's the final logo! Clean, modern wordmark with a subtle shield element integrated into the 'P'. Delivered in SVG + PNG. Also included a quick style guide.",
      submissionFiles: [
        { name: "klyrn-logo.svg", size: 12400 },
        { name: "klyrn-logo-1x.png", size: 45600 },
        { name: "style-guide.pdf", size: 234000 },
      ],
      autoApprovalAt: "2025-06-09T14:00:00Z",
      dispute: {
        id: "d1",
        reasonCategory: "OFF_SPEC",
        status: "AWAITING_RESPONSES",
        aiVerdict: null,
        aiConfidence: null,
      },
    },
  ],
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  PENDING: { color: "#F59E0B", bg: "#F59E0B15", label: "Pending" },
  SUBMITTED: { color: "#3B82F6", bg: "#3B82F615", label: "Submitted" },
  APPROVED: { color: "#00D395", bg: "#00D39515", label: "Approved" },
  DISPUTED: { color: "#EF4444", bg: "#EF444415", label: "Disputed" },
  PARTIALLY_RELEASED: { color: "#F59E0B", bg: "#F59E0B15", label: "Partial" },
  REJECTED: { color: "#EF4444", bg: "#EF444415", label: "Rejected" },
  ACTIVE: { color: "#00D395", bg: "#00D39515", label: "Active" },
  COMPLETED: { color: "#71717A", bg: "#71717A15", label: "Completed" },
  PENDING_ACCEPTANCE: { color: "#F59E0B", bg: "#F59E0B15", label: "Pending Acceptance" },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span
      className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
      style={{ color: config.color, backgroundColor: config.bg, border: `1px solid ${config.color}30` }}
    >
      {config.label}
    </span>
  );
}

function formatUsd(cents: string): string {
  return `$${(parseInt(cents, 10) / 100).toLocaleString()}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ---- Milestone Timeline ----
function MilestoneTimeline({ milestones }: { milestones: typeof DEMO_CONTRACT.milestones }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {milestones.map((m, i) => {
        const isExpanded = expanded === i;
        const isLast = i === milestones.length - 1;

        return (
          <div key={m.id} className="relative">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-4 top-12 bottom-0 w-px bg-[#27272A]" />
            )}

            <div className="glass-card overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : i)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#111113] transition-colors"
              >
                {/* Status dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: (STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING).bg,
                      color: (STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING).color,
                    }}
                  >
                    {m.status === "APPROVED" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : m.status === "DISPUTED" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : m.status === "SUBMITTED" ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold truncate">{m.title}</h3>
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="text-xs text-[#71717A] mt-0.5">{m.description}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">{formatUsd(m.amountUsdcCents)}</p>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#71717A] ml-auto mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#71717A] ml-auto mt-1" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-[#27272A] p-4 space-y-4 animate-fade-in-up">
                  {/* Submission */}
                  {m.submissionNotes && (
                    <div>
                      <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
                        Submission
                      </h4>
                      <p className="text-sm text-[#A1A1AA] leading-relaxed">{m.submissionNotes}</p>

                      {m.submissionFiles && m.submissionFiles.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.submissionFiles.map((f) => (
                            <div
                              key={f.name}
                              className="flex items-center gap-2 bg-[#111113] rounded-lg px-3 py-2 text-xs border border-[#27272A] hover:border-[#3F3F46] transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#71717A]" />
                              <span className="text-[#A1A1AA]">{f.name}</span>
                              <span className="text-[#3F3F46]">{formatFileSize(f.size)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Auto-approval timer */}
                  {m.status === "SUBMITTED" && m.autoApprovalAt && (
                    <div className="flex items-center gap-2 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg p-3">
                      <Clock className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                      <p className="text-xs text-[#F59E0B]">
                        Auto-approves if not reviewed by {new Date(m.autoApprovalAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Dispute alert */}
                  {m.dispute && (
                    <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                        <span className="text-xs font-semibold text-[#EF4444] uppercase">
                          Dispute: {m.dispute.reasonCategory.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-[#A1A1AA]">
                        Status: <StatusBadge status={m.dispute.status} />
                      </p>
                      <Link
                        href={`/disputes/${m.dispute.id}`}
                        className="mt-3 inline-flex items-center gap-1 text-xs text-[#EF4444] hover:underline"
                      >
                        View dispute details <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {m.status === "PENDING" && (
                      <button className="flex items-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black text-xs font-medium px-4 py-2 rounded-lg transition-all">
                        <Upload className="w-3.5 h-3.5" /> Submit Deliverable
                      </button>
                    )}
                    {m.status === "SUBMITTED" && (
                      <>
                        <button className="flex items-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black text-xs font-medium px-4 py-2 rounded-lg transition-all">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Release
                        </button>
                        <button className="flex items-center gap-2 border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#EF4444]/5 transition-all">
                          <AlertTriangle className="w-3.5 h-3.5" /> Dispute
                        </button>
                      </>
                    )}
                    {m.status === "DISPUTED" && (
                      <button className="flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#F59E0B]/20 transition-all">
                        <Scale className="w-3.5 h-3.5" /> Run AI Arbitration
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Contract Detail Page ----
export default function ContractDetailPage() {
  const c = DEMO_CONTRACT;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Top nav bar */}
      <header className="border-b border-[#27272A] bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <StatusBadge status={c.status} />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Contract header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{c.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {c.client.displayName} → {c.freelancer.displayName}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              {formatUsd(c.totalAmountUsdcCents)}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created {new Date(c.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Milestones */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00D395]" /> Milestones
              </h2>
              <MilestoneTimeline milestones={c.milestones} />
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Brief */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Contract Brief</h3>
              <div className="text-xs text-[#A1A1AA] leading-relaxed space-y-2 max-h-64 overflow-y-auto pr-2">
                {c.briefMarkdown.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i} className="text-sm font-bold text-white mt-3">{line.replace("## ", "")}</h2>;
                  if (line.startsWith("### ")) return <h3 key={i} className="text-xs font-semibold text-white mt-2">{line.replace("### ", "")}</h3>;
                  if (line.startsWith("- ")) return <li key={i} className="ml-3">{line.replace("- ", "")}</li>;
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>

            {/* Parties */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Parties</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">K</div>
                  <div>
                    <p className="text-xs font-medium">{c.client.displayName}</p>
                    <p className="text-[10px] text-[#71717A]">Client · {c.client.handle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">A</div>
                  <div>
                    <p className="text-xs font-medium">{c.freelancer.displayName}</p>
                    <p className="text-[10px] text-[#71717A]">Freelancer · {c.freelancer.handle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow info */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Escrow</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717A]">Total</span>
                  <span className="font-medium">{formatUsd(c.totalAmountUsdcCents)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717A]">Released</span>
                  <span className="font-medium text-[#00D395]">$0</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717A]">In escrow</span>
                  <span className="font-medium">{formatUsd(c.totalAmountUsdcCents)}</span>
                </div>
                <div className="w-full h-1.5 bg-[#18181B] rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-[#00D395] rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </div>

            {/* On-chain (Pro mode) */}
            <div className="glass-card p-4 border-dashed opacity-60">
              <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Pro Mode
              </h3>
              <p className="text-[10px] text-[#3F3F46]">Enable in settings to view on-chain details, PDAs, and transaction signatures.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
