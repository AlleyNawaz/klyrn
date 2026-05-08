"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertTriangle, ExternalLink, Shield } from "lucide-react";

const DEMO_MILESTONE = {
  contractId: "demo-logo-contract",
  contractTitle: "Logo Design for Klyrn MVP",
  index: 0,
  title: "Final Logo Delivery",
  description: "Complete logo package: SVG, PNG exports, and mini style guide",
  amount: "$500",
  status: "DISPUTED" as "PENDING" | "SUBMITTED" | "APPROVED" | "DISPUTED",
  submittedAt: "2025-06-04T14:00:00Z",
  submissionNotes: "Here's the final logo! Clean, modern wordmark with a subtle shield element integrated into the 'K'. Delivered in SVG + PNG. Also included a quick style guide.",
  submissionFiles: [
    { name: "klyrn-logo.svg", size: "12.1 KB" },
    { name: "klyrn-logo-1x.png", size: "44.5 KB" },
    { name: "style-guide.pdf", size: "228 KB" },
  ],
  externalLinks: ["https://figma.com/file/example-logo-design"],
};

export default function MilestoneDetailPage() {
  const m = DEMO_MILESTONE;
  const [notes, setNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING: { color: "#F59E0B", label: "Pending" },
    SUBMITTED: { color: "#3B82F6", label: "Submitted" },
    APPROVED: { color: "#00D395", label: "Approved" },
    DISPUTED: { color: "#EF4444", label: "Disputed" },
  };

  const sc = statusConfig[m.status] || statusConfig.PENDING;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[#27272A] bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href={`/contracts/${m.contractId}`} className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Contract
          </Link>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase"
            style={{ color: sc.color, backgroundColor: `${sc.color}15`, border: `1px solid ${sc.color}30` }}
          >
            {sc.label}
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-[#71717A] mb-1">{m.contractTitle} · Milestone {m.index + 1}</p>
          <h1 className="text-2xl font-bold mb-1">{m.title}</h1>
          <p className="text-sm text-[#A1A1AA]">{m.description}</p>
          <p className="text-lg font-bold text-[#00D395] mt-2">{m.amount}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Existing submission */}
            {m.submissionNotes && (
              <div className="glass-card p-5">
                <h2 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Submission</h2>
                <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4">{m.submissionNotes}</p>

                <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Files</h3>
                <div className="space-y-2">
                  {m.submissionFiles.map((f) => (
                    <div key={f.name} className="flex items-center gap-3 bg-[#111113] rounded-lg px-4 py-3 border border-[#27272A] hover:border-[#3F3F46] transition-colors cursor-pointer">
                      <FileText className="w-4 h-4 text-[#71717A]" />
                      <span className="text-sm text-[#A1A1AA] flex-1">{f.name}</span>
                      <span className="text-xs text-[#3F3F46]">{f.size}</span>
                      <ExternalLink className="w-3 h-3 text-[#3F3F46]" />
                    </div>
                  ))}
                </div>

                {m.externalLinks && m.externalLinks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">External Links</h3>
                    {m.externalLinks.map((link) => (
                      <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#00D395] hover:underline">
                        <ExternalLink className="w-3 h-3" /> {link}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Upload form (for freelancer view if status is PENDING) */}
            {m.status === "PENDING" && (
              <div className="glass-card p-5 space-y-4">
                <h2 className="text-sm font-semibold">Submit Deliverable</h2>

                {/* Drag-drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragging ? "border-[#00D395] bg-[#00D395]/5" : "border-[#27272A] hover:border-[#3F3F46]"
                  }`}
                >
                  <Upload className="w-8 h-8 text-[#3F3F46] mx-auto mb-3" />
                  <p className="text-sm text-[#A1A1AA]">Drag & drop files here</p>
                  <p className="text-xs text-[#3F3F46] mt-1">or click to browse</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#A1A1AA] block mb-2">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe what you're submitting..."
                    rows={4}
                    className="w-full bg-[#111113] border border-[#27272A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50 resize-none"
                  />
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black font-semibold py-3 rounded-xl transition-all text-sm">
                  <Upload className="w-4 h-4" /> Submit Deliverable
                </button>
              </div>
            )}

            {/* Client review actions */}
            {m.status === "SUBMITTED" && (
              <div className="glass-card p-5">
                <h2 className="text-sm font-semibold mb-4">Review Submission</h2>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black font-semibold py-3 rounded-xl transition-all text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Approve & Release
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border border-[#EF4444]/30 text-[#EF4444] font-medium py-3 rounded-xl hover:bg-[#EF4444]/5 transition-all text-sm">
                    <AlertTriangle className="w-4 h-4" /> Dispute
                  </button>
                </div>
              </div>
            )}

            {/* Dispute alert */}
            {m.status === "DISPUTED" && (
              <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  <span className="text-sm font-semibold text-[#EF4444]">This milestone is disputed</span>
                </div>
                <p className="text-xs text-[#A1A1AA] mb-3">The client has filed a dispute. Both statements are being reviewed.</p>
                <Link href="/disputes/d1" className="inline-flex items-center gap-1 text-xs text-[#EF4444] hover:underline">
                  View dispute details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Details</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[#71717A]">Amount</span><span className="font-medium">{m.amount}</span></div>
                <div className="flex justify-between"><span className="text-[#71717A]">Status</span><span style={{ color: sc.color }}>{sc.label}</span></div>
                {m.submittedAt && <div className="flex justify-between"><span className="text-[#71717A]">Submitted</span><span>{new Date(m.submittedAt).toLocaleDateString()}</span></div>}
              </div>
            </div>

            <div className="glass-card p-4 border-dashed opacity-60">
              <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> On-Chain Proof
              </h3>
              <p className="text-[10px] text-[#3F3F46]">File hashes are sealed on Solana at submission time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
