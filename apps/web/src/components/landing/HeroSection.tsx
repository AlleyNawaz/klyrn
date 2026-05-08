"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  { label: "Analyzing contract brief...", delay: 800 },
  { label: "Reviewing submitted deliverables...", delay: 1200 },
  { label: "Comparing against specifications...", delay: 1000 },
  { label: "Evaluating dispute statements...", delay: 900 },
  { label: "Rendering verdict...", delay: 600 },
];

function AIDemoWidget() {
  const [step, setStep] = useState(0);
  const [showVerdict, setShowVerdict] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const run = () => {
      setStep(0); setShowVerdict(false); setConfidence(0);
      let cur = 0;
      const advance = () => {
        if (cur < STEPS.length) {
          setStep(cur + 1); cur++;
          setTimeout(advance, STEPS[cur - 1]?.delay || 1000);
        } else {
          setShowVerdict(true);
          let c = 0;
          const ci = setInterval(() => {
            c += 2; if (c >= 94) { c = 94; clearInterval(ci); }
            setConfidence(c);
          }, 20);
        }
      };
      setTimeout(advance, 500);
    };
    run();
    const iv = setInterval(run, 12000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="glass-card p-5 w-full max-w-md glow relative overflow-hidden">
      {/* Scan line */}
      {!showVerdict && (
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D6A4]/40 to-transparent pointer-events-none" style={{ animation: "scanLine 2s linear infinite" }} />
      )}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#00D6A4] pulse-dot" />
        <span className="text-xs font-medium text-[#9BA1A6] uppercase tracking-wider font-mono">Live AI Arbitration</span>
      </div>
      <div className="space-y-2 mb-4">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs transition-all duration-300 ${i < step ? "text-[#00D6A4]" : i === step ? "text-white" : "text-[#6F767E]"}`}>
            {i < step ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : i === step ? <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00D6A4] border-t-transparent animate-spin flex-shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-[#6F767E] flex-shrink-0" />}
            <span className="font-mono">{s.label}</span>
          </div>
        ))}
      </div>
      {showVerdict && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
            <div className="flex items-center justify-between mb-3">
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="text-xs font-bold px-2.5 py-1 rounded-full bg-[rgba(0,214,164,0.12)] text-[#00D6A4] border border-[rgba(0,214,164,0.2)]">
                APPROVED (Freelancer)
              </motion.span>
              <span className="text-xs text-[#9BA1A6] font-mono">{confidence}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#161C23] rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-[#00D6A4] to-[#5BFFD0] rounded-full transition-all duration-500" style={{ width: `${confidence}%` }} />
            </div>
            <p className="text-[10px] text-[#6F767E] leading-relaxed line-clamp-3">
              The brief requires &ldquo;modern, minimalist, vector format.&rdquo; The freelancer delivered exactly what was specified. Funds released.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

const phrases = ["Get paid.", "No middlemen.", "No 8-week disputes."];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Particles */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="absolute w-[3px] h-[3px] rounded-full bg-[#00D6A4]" style={{
          top: `${20 + i * 15}%`, left: `${10 + i * 18}%`, opacity: 0.08,
          animation: `drift ${8 + i * 3}s linear infinite`, animationDelay: `${i * 1.5}s`
        }} />
      ))}

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-semibold tracking-[-0.03em] leading-[0.95] mb-6 text-balance">
            {phrases.map((phrase, pi) => (
              <span key={pi}>
                {pi === 1 ? (
                  <span className="gradient-text">{phrase}</span>
                ) : (
                  <span>{phrase}</span>
                )}
                {pi < phrases.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-lg md:text-xl text-[#9BA1A6] leading-relaxed mb-8 max-w-xl">
            Klyrn is escrow for freelancers, with AI that resolves disputes in <span className="text-[#ECEDEE] font-semibold">8 seconds</span>, not 8 weeks. Your money is safe in code, not in someone&apos;s bank account.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-3">
            <Link href="/signup?role=client" className="group relative flex items-center justify-center gap-2 bg-[#00D6A4] hover:bg-[#00B88A] text-black font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(0,214,164,0.3)] hover:-translate-y-0.5 text-base overflow-hidden">
              <span className="absolute inset-0 btn-shimmer" />
              <span className="relative flex items-center gap-2">I&apos;m hiring <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <Link href="/signup?role=freelancer" className="flex items-center justify-center gap-2 border border-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.20)] text-white font-medium px-8 py-3.5 rounded-xl transition-all hover:bg-[#11161B] text-base">
              I&apos;m freelancing
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-center gap-6 mt-8 text-xs text-[#6F767E]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D6A4]" /> 1% fee, capped at $50</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D6A4]" /> Instant payouts</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D6A4]" /> No chargebacks</span>
          </motion.div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <AIDemoWidget />
        </div>
      </div>
    </section>
  );
}
