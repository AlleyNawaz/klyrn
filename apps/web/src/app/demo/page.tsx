"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play, Pause, ChevronRight, Shield, Zap, Scale,
  CheckCircle2, AlertTriangle, Clock, DollarSign,
  ArrowRight, Globe, Quote
} from "lucide-react";

interface DemoStep {
  time: string;
  title: string;
  narration: string;
  visual: "story" | "create" | "submit" | "dispute" | "verdict" | "closing";
}

const DEMO_SCRIPT: DemoStep[] = [
  {
    time: "0:00",
    title: "Ahmad's Story",
    narration: "Ahmad is a designer in Lahore. Last month, a client claimed his logo wasn't 'what they wanted' and disappeared with the files. Upwork took 6 weeks to side with the client. Ahmad lost $800.",
    visual: "story",
  },
  {
    time: "0:20",
    title: "The Problem",
    narration: "Today there are 50 million freelancers like Ahmad. They lose $11 billion a year to platform fees, chargebacks, and unfair disputes. The system is broken because the same company that takes the fee also judges the dispute.",
    visual: "story",
  },
  {
    time: "0:40",
    title: "The Solution",
    narration: "We built Klyrn. Watch.",
    visual: "story",
  },
  {
    time: "0:50",
    title: "Contract Creation",
    narration: "Keith creates a $500 logo contract in 30 seconds. Brief is clear: minimalist, custom wordmark, avoid mascots. Funds deposit into on-chain escrow. No one can touch them.",
    visual: "create",
  },
  {
    time: "1:20",
    title: "Delivery",
    narration: "Ahmad accepts. He submits the deliverable, a clean SVG logo matching every requirement. Files are hashed and sealed on-chain as proof of what was delivered.",
    visual: "submit",
  },
  {
    time: "1:50",
    title: "The Dispute",
    narration: 'Keith disputes: "Not what I asked for, I want a mascot." But his own brief says "avoid stock-style mascots." The evidence is on-chain.',
    visual: "dispute",
  },
  {
    time: "2:00",
    title: "AI Arbitration",
    narration: "Click 'Run AI Arbitration.' The AI reads the brief, compares the delivery, analyzes both statements. Ten seconds. It cites the brief's own words. Verdict: APPROVED (Freelancer). USDC releases to Ahmad instantly.",
    visual: "verdict",
  },
  {
    time: "2:30",
    title: "The Future",
    narration: "If either party disagrees, they appeal to 3 staked human jurors. Reputation lives on Solana, portable across every platform. No more platform lock-in.",
    visual: "closing",
  },
  {
    time: "2:45",
    title: "The Opportunity",
    narration: "Upwork is a $4 billion company that abuses 50 million freelancers. Klyrn is what replaces them. We're live on devnet today, mainnet in 30 days.",
    visual: "closing",
  },
];

function StoryVisual() {
  return (
    <div className="glass-card p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
        👩‍💻
      </div>
      <h3 className="text-lg font-bold mb-2">Ahmad Hassan</h3>
      <p className="text-sm text-[#A1A1AA]">UI/UX Designer · Lahore, Pakistan</p>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#71717A]">
        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> 28 contracts</span>
        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> $42k earned</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#00D395]" /> 4.9★</span>
      </div>
      <div className="mt-6 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-4">
        <p className="text-xs text-[#EF4444]">Lost $800 to an unfair dispute on Upwork. Resolution took 6 weeks.</p>
      </div>
    </div>
  );
}

function CreateVisual() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">K</div>
        <span className="text-xs font-medium">Keith Thompson</span>
        <span className="text-[10px] text-[#71717A]">creating contract...</span>
      </div>
      <div className="bg-[#111113] rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-xs"><span className="text-[#71717A]">Title</span><span>Logo Design</span></div>
        <div className="flex justify-between text-xs"><span className="text-[#71717A]">Amount</span><span className="text-[#00D395] font-semibold">$500</span></div>
        <div className="flex justify-between text-xs"><span className="text-[#71717A]">Brief</span><span>Modern, minimalist, custom wordmark</span></div>
        <div className="flex justify-between text-xs"><span className="text-[#71717A]">Avoid</span><span className="text-[#EF4444]">Stock-style mascots</span></div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-[#00D395]">
        <CheckCircle2 className="w-3 h-3" /> $500 deposited to escrow
      </div>
    </div>
  );
}

function SubmitVisual() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400">A</div>
        <span className="text-xs font-medium">Ahmad Hassan</span>
        <span className="text-[10px] text-[#71717A]">submitting deliverable...</span>
      </div>
      <div className="space-y-2">
        {["klyrn-logo.svg", "klyrn-logo-1x.png", "style-guide.pdf"].map((f) => (
          <div key={f} className="flex items-center gap-2 bg-[#111113] rounded px-3 py-2 text-xs">
            <CheckCircle2 className="w-3 h-3 text-[#00D395]" />
            <span className="text-[#A1A1AA]">{f}</span>
          </div>
        ))}
      </div>
      <div className="text-[10px] font-mono text-[#3F3F46] bg-[#111113] rounded px-3 py-2">
        SHA-256: 4f2a8b...c9d1e3 <span className="text-[#00D395]">✓ sealed on-chain</span>
      </div>
    </div>
  );
}

function DisputeVisual() {
  return (
    <div className="space-y-3">
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">K</div>
          <span className="text-xs font-medium">Keith</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">DISPUTED</span>
        </div>
        <p className="text-xs text-[#A1A1AA]">&ldquo;This isn&apos;t what I asked for. I wanted a mascot logo.&rdquo;</p>
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">A</div>
          <span className="text-xs font-medium">Ahmad</span>
        </div>
        <p className="text-xs text-[#A1A1AA]">&ldquo;The brief says &lsquo;avoid stock-style mascots.&rsquo; I delivered a minimalist wordmark as specified.&rdquo;</p>
      </div>
    </div>
  );
}

function VerdictVisual() {
  const [step, setStep] = useState(0);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const steps = [
      { delay: 500, fn: () => setStep(1) },
      { delay: 1500, fn: () => setStep(2) },
      { delay: 2500, fn: () => setStep(3) },
      { delay: 3500, fn: () => setStep(4) },
      { delay: 4500, fn: () => setStep(5) },
    ];
    const timers = steps.map((s) => setTimeout(s.fn, s.delay));

    setTimeout(() => {
      let c = 0;
      const interval = setInterval(() => {
        c += 3;
        if (c >= 94) { c = 94; clearInterval(interval); }
        setConfidence(c);
      }, 20);
    }, 5000);

    return () => timers.forEach(clearTimeout);
  }, []);

  const stages = [
    "Analyzing contract brief...",
    "Reviewing submitted deliverables...",
    "Comparing against specifications...",
    "Evaluating dispute statements...",
    "Rendering verdict...",
  ];

  return (
    <div className="glass-card p-5 glow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#00D395] pulse-dot" />
        <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">AI Arbitration</span>
      </div>

      <div className="space-y-2 mb-4">
        {stages.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs transition-all duration-300 ${
            i < step ? "text-[#00D395]" : i === step ? "text-white" : "text-[#3F3F46]"
          }`}>
            {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> :
             i === step ? <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00D395] border-t-transparent animate-spin" /> :
             <div className="w-3.5 h-3.5 rounded-full border border-[#3F3F46]" />}
            <span>{s}</span>
          </div>
        ))}
      </div>

      {step >= 5 && (
        <div className="animate-fade-in-up border-t border-[#27272A] pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00D395]/15 text-[#00D395] border border-[#00D395]/30">
              ✓ APPROVED (Freelancer)
            </span>
            <span className="text-sm font-bold text-[#00D395]">{confidence}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#18181B] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-[#00D395] to-[#33DFAB] rounded-full transition-all" style={{ width: `${confidence}%` }} />
          </div>
          <p className="text-[10px] text-[#A1A1AA] leading-relaxed">
            The brief explicitly states: &ldquo;Avoid stock-style mascots.&rdquo; The freelancer delivered a modern, minimalist
            wordmark exactly as specified. The client&apos;s request for a mascot contradicts their own brief.
            <span className="text-[#00D395] font-medium"> USDC released to freelancer.</span>
          </p>
        </div>
      )}
    </div>
  );
}

function ClosingVisual() {
  return (
    <div className="glass-card p-8 text-center glow">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center mx-auto mb-4">
        <Shield className="w-6 h-6 text-black" />
      </div>
      <h3 className="text-xl font-bold gradient-text mb-2">Klyrn</h3>
      <p className="text-sm text-[#A1A1AA] mb-4">
        Get paid. No middlemen. No 8-week disputes.
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div><p className="text-xl font-bold">1%</p><p className="text-[10px] text-[#71717A]">Platform fee</p></div>
        <div><p className="text-xl font-bold text-[#00D395]">8s</p><p className="text-[10px] text-[#71717A]">Dispute resolution</p></div>
        <div><p className="text-xl font-bold">0</p><p className="text-[10px] text-[#71717A]">Chargebacks</p></div>
      </div>
    </div>
  );
}

const VISUAL_MAP: Record<string, React.ComponentType> = {
  story: StoryVisual,
  create: CreateVisual,
  submit: SubmitVisual,
  dispute: DisputeVisual,
  verdict: VerdictVisual,
  closing: ClosingVisual,
};

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStep < DEMO_SCRIPT.length - 1) {
      timerRef.current = setTimeout(() => setCurrentStep((s) => s + 1), 8000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
    if (currentStep >= DEMO_SCRIPT.length - 1) setIsPlaying(false);
  }, [isPlaying, currentStep]);

  const step = DEMO_SCRIPT[currentStep];
  if (!step) return null;
  const Visual = VISUAL_MAP[step.visual] || StoryVisual;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#27272A] flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm font-bold">Klyrn Demo</span>
          </div>
          <span className="text-xs text-[#71717A]">3-Minute Pitch · {step.time}</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Narration */}
        <div className="animate-fade-in-up" key={currentStep}>
          <span className="text-xs font-mono text-[#00D395] mb-2 block">{step.time}</span>
          <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
          <p className="text-lg text-[#A1A1AA] leading-relaxed">{step.narration}</p>
        </div>

        {/* Right: Visual */}
        <div className="animate-fade-in-up" key={`visual-${currentStep}`}>
          <Visual />
        </div>
      </div>

      {/* Controls */}
      <footer className="border-t border-[#27272A] flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Progress */}
          <div className="flex gap-1 mb-4">
            {DEMO_SCRIPT.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStep ? "bg-[#00D395]" : "bg-[#27272A]"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setIsPlaying(!isPlaying); }}
                className="w-10 h-10 rounded-full bg-[#00D395] hover:bg-[#00B37E] flex items-center justify-center transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black ml-0.5" />}
              </button>
              <span className="text-xs text-[#71717A]">
                {currentStep + 1} / {DEMO_SCRIPT.length}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setIsPlaying(false); }}
                disabled={currentStep === 0}
                className="text-xs text-[#A1A1AA] hover:text-white disabled:opacity-30 px-3 py-1.5"
              >
                Previous
              </button>
              <button
                onClick={() => { setCurrentStep(Math.min(DEMO_SCRIPT.length - 1, currentStep + 1)); setIsPlaying(false); }}
                disabled={currentStep >= DEMO_SCRIPT.length - 1}
                className="flex items-center gap-1 text-xs bg-[#18181B] hover:bg-[#27272A] text-white disabled:opacity-30 px-3 py-1.5 rounded-lg transition-colors"
              >
                Next <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
