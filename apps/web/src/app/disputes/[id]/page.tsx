"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Zap, Scale, AlertTriangle, CheckCircle2,
  Quote, ChevronDown, ChevronUp, Shield, Clock,
  FileText, User, DollarSign, ExternalLink, Gavel
} from "lucide-react";

// ---- Demo data ----
const DEMO_DISPUTE = {
  id: "d1",
  reasonCategory: "OFF_SPEC",
  status: "AI_DECIDED" as const,
  milestoneTitle: "Final Logo Delivery",
  milestoneAmount: "$500",
  contractTitle: "Logo Design for Klyrn MVP",
  contractId: "demo-logo-contract",
  client: { name: "Keith Thompson", handle: "@keith_t" },
  freelancer: { name: "Ahmad Hassan", handle: "@ahmad_designs" },
  clientStatement: "This is not what I asked for at all. I specifically wanted a mascot logo, something friendly and approachable with a character that represents trust and security. What Ahmad delivered is just a boring wordmark with a tiny shield. I need a full mascot character, not this minimalist stuff. I want a complete redo.",
  freelancerStatement: "The brief explicitly says 'Avoid stock-style mascots, no cartoon characters, no shields with padlocks.' Keith is now asking for exactly what the brief told me NOT to do. I delivered a modern, minimalist wordmark with a custom typeface, exactly as specified. The SVG is clean, works at all sizes, and includes the style guide. This matches every single requirement in the brief.",
  aiVerdict: {
    verdict: "APPROVED" as const,
    confidence: 94,
    reasoning: `Analysis

What the Brief Required
The contract brief clearly states the following requirements:
1. Modern, minimalist design language
2. Vector format (SVG required, plus PNG exports)
3. Must include a custom wordmark
4. Primary color: #00D395 on dark backgrounds

The brief also explicitly states what to avoid:
"Avoid stock-style mascots, no cartoon characters, no shields with padlocks, no generic crypto imagery"

What Was Delivered
Ahmad delivered:
A clean SVG wordmark logo ✅
PNG exports at 1x, 2x, 4x ✅
A style guide showing usage on light/dark backgrounds ✅
Modern, minimalist aesthetic ✅

Where They Match or Diverge
The delivered work aligns with every requirement listed in the brief. The client's dispute claims he wanted a "mascot logo," but this directly contradicts his own brief, which explicitly instructs the freelancer to "avoid stock-style mascots."

Verdict Justification
Per Klyrn arbitration principle #1: "The brief is the contract. The delivered work is judged against what the brief actually said, NOT against what either party now wishes it had said."

Per principle #2: "Ambiguity in the brief is the CLIENT's risk." In this case, there is no ambiguity. The brief is unambiguous in its rejection of mascot-style logos.

The freelancer delivered exactly what was specified. Full payment should be released.`,
    evidence: [
      { source: "brief", quote: "Avoid stock-style mascots, no cartoon characters, no shields with padlocks", weight: 0.95 },
      { source: "brief", quote: "Modern, minimalist design language", weight: 0.85 },
      { source: "brief", quote: "Must include a custom wordmark", weight: 0.80 },
      { source: "submission_file:klyrn-logo.svg", quote: "Clean vector logo with integrated shield element in custom wordmark typography", weight: 0.75 },
      { source: "client_statement", quote: "I specifically wanted a mascot logo", weight: 0.90 },
    ],
  },
  responseDeadline: "2025-06-06T14:00:00Z",
  openedAt: "2025-06-04T16:00:00Z",
};

// ---- AI Verdict Card (the hero component) ----
function AIVerdictCard({ verdict, onAnimate }: {
  verdict: typeof DEMO_DISPUTE.aiVerdict;
  onAnimate?: boolean;
}) {
  const [confidence, setConfidence] = useState(onAnimate ? 0 : verdict.confidence);
  const [showReasoning, setShowReasoning] = useState(!onAnimate);
  const [showEvidence, setShowEvidence] = useState(false);
  const [activeTab, setActiveTab] = useState<"reasoning" | "evidence">("reasoning");

  useEffect(() => {
    if (!onAnimate) return;
    const timer = setTimeout(() => {
      let c = 0;
      const interval = setInterval(() => {
        c += 2;
        if (c >= verdict.confidence) {
          c = verdict.confidence;
          clearInterval(interval);
          setTimeout(() => setShowReasoning(true), 300);
        }
        setConfidence(c);
      }, 15);
    }, 500);
    return () => clearTimeout(timer);
  }, [onAnimate, verdict.confidence]);

  const verdictColor = verdict.verdict === "APPROVED" ? "#00D395"
    : verdict.verdict === "REJECTED" ? "#EF4444" : "#F59E0B";

  const verdictLabel = verdict.verdict === "APPROVED" ? "Approved (Freelancer)"
    : verdict.verdict === "REJECTED" ? "Rejected (Client)" : "Partial Release";

  return (
    <div className="glass-card overflow-hidden glow">
      {/* Header */}
      <div className="p-5 border-b border-[#27272A]">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-[#00D395]" />
          <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">AI Arbitration Verdict</span>
        </div>

        {/* Verdict badge */}
        <div className="flex items-center justify-between">
          <span
            className="text-sm font-bold px-3 py-1.5 rounded-lg"
            style={{
              color: verdictColor,
              backgroundColor: `${verdictColor}15`,
              border: `1px solid ${verdictColor}30`,
            }}
          >
            ✓ {verdictLabel.toUpperCase()}
          </span>
          <div className="text-right">
            <span className="text-2xl font-bold" style={{ color: verdictColor }}>{confidence}%</span>
            <p className="text-[10px] text-[#71717A]">confidence</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="w-full h-2 bg-[#18181B] rounded-full overflow-hidden mt-3">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${confidence}%`,
              background: `linear-gradient(90deg, ${verdictColor}, ${verdictColor}AA)`,
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      {showReasoning && (
        <div className="animate-fade-in-up">
          <div className="flex border-b border-[#27272A]">
            <button
              onClick={() => setActiveTab("reasoning")}
              className={`flex-1 text-xs font-medium py-3 transition-colors ${
                activeTab === "reasoning"
                  ? "text-white border-b-2 border-[#00D395]"
                  : "text-[#71717A] hover:text-white"
              }`}
            >
              Reasoning
            </button>
            <button
              onClick={() => setActiveTab("evidence")}
              className={`flex-1 text-xs font-medium py-3 transition-colors ${
                activeTab === "evidence"
                  ? "text-white border-b-2 border-[#00D395]"
                  : "text-[#71717A] hover:text-white"
              }`}
            >
              Evidence ({verdict.evidence.length})
            </button>
          </div>

          <div className="p-5 max-h-96 overflow-y-auto">
            {activeTab === "reasoning" && (
              <div className="prose prose-sm prose-invert max-w-none">
                {verdict.reasoning.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i} className="text-base font-bold text-white mt-4 mb-2">{line.replace("## ", "")}</h2>;
                  if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold text-white mt-3 mb-1">{line.replace("### ", "")}</h3>;
                  if (line.startsWith("- ")) return <li key={i} className="text-xs text-[#A1A1AA] ml-4">{line.replace("- ", "")}</li>;
                  if (line.match(/^\d+\./)) return <li key={i} className="text-xs text-[#A1A1AA] ml-4 list-decimal">{line.replace(/^\d+\.\s*/, "")}</li>;
                  if (line.startsWith("")) return <p key={i} className="text-xs text-white font-semibold mt-2">{line.replace(/\*\*/g, "")}</p>;
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i} className="text-xs text-[#A1A1AA] leading-relaxed">{line}</p>;
                })}
              </div>
            )}

            {activeTab === "evidence" && (
              <div className="space-y-3">
                {verdict.evidence.map((e, i) => (
                  <div key={i} className="bg-[#111113] rounded-lg p-3 border border-[#27272A]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-[#00D395] uppercase tracking-wider">
                        {e.source.replace("_", " ")}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="h-1 rounded-full bg-[#18181B] w-12 overflow-hidden">
                          <div
                            className="h-full bg-[#00D395] rounded-full"
                            style={{ width: `${e.weight * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#71717A]">{Math.round(e.weight * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Quote className="w-3 h-3 text-[#3F3F46] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[#A1A1AA] italic leading-relaxed">&ldquo;{e.quote}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appeal CTA */}
          <div className="border-t border-[#27272A] p-4">
            <button className="w-full flex items-center justify-center gap-2 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#F59E0B]/5 transition-all">
              <Gavel className="w-3.5 h-3.5" />
              Appeal to human jurors ($25 fee)
            </button>
            <p className="text-[10px] text-[#3F3F46] text-center mt-2">
              Fee refunded if you win the appeal
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Statement Card ----
function StatementCard({ party, name, handle, statement, color }: {
  party: "client" | "freelancer";
  name: string;
  handle: string;
  statement: string;
  color: string;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {name[0]}
        </div>
        <div>
          <p className="text-xs font-medium">{name}</p>
          <p className="text-[10px] text-[#71717A]">{party === "client" ? "Client" : "Freelancer"} · {handle}</p>
        </div>
        {party === "client" && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
            OPENED DISPUTE
          </span>
        )}
      </div>
      <p className="text-xs text-[#A1A1AA] leading-relaxed">&ldquo;{statement}&rdquo;</p>
    </div>
  );
}

// ---- Dispute Detail Page ----
export default function DisputeDetailPage() {
  const d = DEMO_DISPUTE;
  const [animateVerdict, setAnimateVerdict] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[#27272A] bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href={`/contracts/${d.contractId}`} className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Contract
          </Link>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 uppercase">
            {d.status.replace(/_/g, " ")}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-[#EF4444]" />
            <h1 className="text-xl font-bold">Dispute: {d.milestoneTitle}</h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#71717A]">
            <span>Contract: {d.contractTitle}</span>
            <span>·</span>
            <span>Milestone amount: {d.milestoneAmount}</span>
            <span>·</span>
            <span>Reason: {d.reasonCategory.replace("_", " ")}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Statements + AI Verdict */}
          <div className="lg:col-span-3 space-y-6">
            {/* Client statement */}
            <StatementCard
              party="client"
              name={d.client.name}
              handle={d.client.handle}
              statement={d.clientStatement}
              color="#3B82F6"
            />

            {/* Freelancer statement */}
            <StatementCard
              party="freelancer"
              name={d.freelancer.name}
              handle={d.freelancer.handle}
              statement={d.freelancerStatement}
              color="#A855F7"
            />

            {/* Animate button (GOD_MODE) */}
            {!animateVerdict && (
              <button
                onClick={() => setAnimateVerdict(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00D395] to-[#00B37E] text-black font-semibold py-3 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(0,211,149,0.3)] text-sm"
              >
                <Zap className="w-4 h-4" /> Run AI Arbitration
              </button>
            )}

            {/* AI Verdict Card */}
            {animateVerdict && (
              <AIVerdictCard verdict={d.aiVerdict} onAnimate={true} />
            )}

            {/* Always-visible verdict (non-animated) */}
            {!animateVerdict && d.status === "AI_DECIDED" && (
              <AIVerdictCard verdict={d.aiVerdict} onAnimate={false} />
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Timeline */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Timeline</h3>
              <div className="space-y-3">
                {[
                  { time: d.openedAt, label: "Dispute opened by client", icon: AlertTriangle, color: "#EF4444" },
                  { time: d.openedAt, label: "Client submitted statement", icon: FileText, color: "#3B82F6" },
                  { time: d.openedAt, label: "Freelancer responded", icon: FileText, color: "#A855F7" },
                  ...(animateVerdict || d.status === "AI_DECIDED" ? [
                    { time: d.openedAt, label: "AI verdict rendered", icon: Zap, color: "#00D395" },
                  ] : []),
                ].map((event, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <event.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: event.color }} />
                    <div>
                      <p className="text-xs text-[#A1A1AA]">{event.label}</p>
                      <p className="text-[10px] text-[#3F3F46]">{new Date(event.time).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submitted files */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">Submitted Files</h3>
              <div className="space-y-2">
                {["klyrn-logo.svg", "klyrn-logo-1x.png", "style-guide.pdf"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">
                    <FileText className="w-3 h-3 text-[#71717A]" />
                    <span>{f}</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-[#3F3F46]" />
                  </div>
                ))}
              </div>
            </div>

            {/* On-chain info */}
            <div className="glass-card p-4 border-dashed opacity-60">
              <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Verifiable on-chain
              </h3>
              <p className="text-[10px] text-[#3F3F46]">
                Deliverable hash and dispute outcome are permanently recorded on Solana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
