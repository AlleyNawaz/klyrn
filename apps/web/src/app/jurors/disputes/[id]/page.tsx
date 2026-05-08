"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Zap, CheckCircle2, XCircle, Quote, Shield } from "lucide-react";

const DISPUTE_DATA = {
  contractTitle: "Mobile App UI Design",
  milestoneTitle: "Wireframes",
  amount: "$1,600",
  clientStatement: "The wireframes are missing 3 of the 5 screens I specified in the brief. Only the login and dashboard screens were delivered. I need all 5 screens: login, dashboard, profile, settings, and notifications.",
  freelancerStatement: "The brief says 'Start with core screens, login and dashboard, then iterate.' I delivered exactly what the first milestone covers. The remaining 3 screens are for milestone 2. The client is confusing the scope of milestone 1 with the full project.",
  aiVerdict: {
    verdict: "REJECTED",
    confidence: 78,
    reasoning: "The milestone description states 'All 5 wireframe screens' but the brief's phased approach says 'Start with core screens.' There is genuine ambiguity. The AI recommends partial release (40%) for the 2 completed screens.",
  },
  evidence: [
    { source: "milestone_description", quote: "All 5 wireframe screens: login, dashboard, profile, settings, notifications", weight: 0.90 },
    { source: "brief", quote: "Start with core screens, login and dashboard, then iterate", weight: 0.85 },
    { source: "submission", quote: "2 of 5 screens delivered (login, dashboard)", weight: 0.70 },
  ],
};

export default function JurorVotePage() {
  const [vote, setVote] = useState<"APPROVE" | "REJECT" | "PARTIAL" | null>(null);
  const [reasoning, setReasoning] = useState("");
  const d = DISPUTE_DATA;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[#27272A] bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/jurors" className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Juror Dashboard
          </Link>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
            AWAITING YOUR VOTE
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-[#F59E0B]" />
            <h1 className="text-xl font-bold">Juror Review: {d.milestoneTitle}</h1>
          </div>
          <p className="text-xs text-[#71717A]">{d.contractTitle} · {d.amount}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Client Statement */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">C</div>
                <span className="text-xs font-medium">Client</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">DISPUTED</span>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">&ldquo;{d.clientStatement}&rdquo;</p>
            </div>

            {/* Freelancer Statement */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400">F</div>
                <span className="text-xs font-medium">Freelancer</span>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">&ldquo;{d.freelancerStatement}&rdquo;</p>
            </div>

            {/* AI Verdict (for reference) */}
            <div className="glass-card p-4 border-dashed">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">AI Verdict (Escalated)</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                d.aiVerdict.verdict === "APPROVED" ? "bg-[#00D395]/10 text-[#00D395]" : "bg-[#EF4444]/10 text-[#EF4444]"
              }`}>
                {d.aiVerdict.verdict} ({d.aiVerdict.confidence}% confidence)
              </span>
              <p className="text-xs text-[#71717A] mt-2 leading-relaxed">{d.aiVerdict.reasoning}</p>
            </div>

            {/* Vote Buttons */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold mb-4">Cast Your Vote</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => setVote("APPROVE")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    vote === "APPROVE" ? "border-[#00D395] bg-[#00D395]/5" : "border-[#27272A] hover:border-[#3F3F46]"
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 mx-auto mb-1 ${vote === "APPROVE" ? "text-[#00D395]" : "text-[#71717A]"}`} />
                  <p className="text-xs font-medium">Approve</p>
                  <p className="text-[10px] text-[#71717A]">Full release</p>
                </button>
                <button
                  onClick={() => setVote("PARTIAL")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    vote === "PARTIAL" ? "border-[#F59E0B] bg-[#F59E0B]/5" : "border-[#27272A] hover:border-[#3F3F46]"
                  }`}
                >
                  <Scale className={`w-5 h-5 mx-auto mb-1 ${vote === "PARTIAL" ? "text-[#F59E0B]" : "text-[#71717A]"}`} />
                  <p className="text-xs font-medium">Partial</p>
                  <p className="text-[10px] text-[#71717A]">Split funds</p>
                </button>
                <button
                  onClick={() => setVote("REJECT")}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    vote === "REJECT" ? "border-[#EF4444] bg-[#EF4444]/5" : "border-[#27272A] hover:border-[#3F3F46]"
                  }`}
                >
                  <XCircle className={`w-5 h-5 mx-auto mb-1 ${vote === "REJECT" ? "text-[#EF4444]" : "text-[#71717A]"}`} />
                  <p className="text-xs font-medium">Reject</p>
                  <p className="text-[10px] text-[#71717A]">Refund client</p>
                </button>
              </div>

              <label className="text-xs font-medium text-[#A1A1AA] block mb-2">Your Reasoning</label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Explain your vote. Cite specific evidence from the brief and submission..."
                rows={4}
                className="w-full bg-[#111113] border border-[#27272A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50 resize-none"
              />

              <button
                disabled={!vote || reasoning.length < 20}
                className="w-full mt-4 bg-[#00D395] hover:bg-[#00B37E] disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-all text-sm"
              >
                Submit Vote
              </button>
            </div>
          </div>

          {/* Sidebar: Evidence */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Evidence</h3>
              <div className="space-y-3">
                {d.evidence.map((e, i) => (
                  <div key={i} className="bg-[#111113] rounded-lg p-3 border border-[#27272A]">
                    <span className="text-[10px] font-medium text-[#00D395] uppercase tracking-wider">{e.source.replace("_", " ")}</span>
                    <div className="flex gap-2 mt-1">
                      <Quote className="w-3 h-3 text-[#3F3F46] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[#A1A1AA] italic">&ldquo;{e.quote}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 border-dashed opacity-60">
              <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Juror Guidelines
              </h3>
              <ul className="text-[10px] text-[#3F3F46] space-y-1">
                <li>• The brief is the contract</li>
                <li>• Judge quality vs price paid, not perfection</li>
                <li>• Ambiguity = client&apos;s risk</li>
                <li>• Your stake is slashed for inaccurate votes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
