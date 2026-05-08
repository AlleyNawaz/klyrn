"use client";
import { useState, useEffect, useRef } from "react";
import { SectionFadeIn, GradientText } from "@/components/ui";
import { Scale, CheckCircle2, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";

const principles = [
  "Brief is the contract. Ambiguity is the client's risk",
  "Quality judged against price paid, not perfection",
  "Partial releases for work that mostly meets spec",
  "Always escalates suspected plagiarism to humans",
];

function TerminalCard() {
  const [phase, setPhase] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    let t: NodeJS.Timeout;
    const seq = [700, 900, 700, 900, 1000, 2000, 4000];
    let p = 0;
    const next = () => {
      if (p < 7) { p++; setPhase(p); t = setTimeout(next, seq[p - 1] || 1000); }
      else { setPhase(0); p = 0; t = setTimeout(next, 1200); }
    };
    t = setTimeout(next, 600);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div ref={ref} className="glass-card overflow-hidden glow relative" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.3), 0 0 60px rgba(0,214,164,0.04)" }}>
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,18,24,0.5)]">
        <div className="traffic-light traffic-red" />
        <div className="traffic-light traffic-yellow" />
        <div className="traffic-light traffic-green" />
        <span className="text-[10px] font-mono text-[#6B7682] ml-auto">klyrn-arbitrator-v1.0</span>
      </div>
      <div className="p-5 space-y-4 min-h-[280px]">
        {phase >= 0 && phase < 1 && <div className="text-xs text-[#6B7682] font-mono"><span className="animate-pulse">typing</span><span className="animate-pulse">...</span></div>}
        {phase >= 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A1218] rounded-lg p-4 border border-[rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold">K</div>
              <span className="text-xs font-medium">Keith (Client)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF6B6B]/10 text-[#FF6B6B] font-mono">DISPUTED</span>
            </div>
            <p className="text-xs text-[#98A2AE]">&ldquo;This isn&apos;t what I asked for. I wanted a mascot logo.&rdquo;</p>
          </motion.div>
        )}
        {phase >= 2 && phase < 3 && <div className="text-xs text-[#6B7682] font-mono"><span className="animate-pulse">typing</span><span className="animate-pulse">...</span></div>}
        {phase >= 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A1218] rounded-lg p-4 border border-[rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold">A</div>
              <span className="text-xs font-medium">Ahmad (Freelancer)</span>
            </div>
            <p className="text-xs text-[#98A2AE]">&ldquo;The brief says &lsquo;avoid stock-style mascots.&rsquo; I delivered a minimalist wordmark as specified.&rdquo;</p>
          </motion.div>
        )}
        {phase >= 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-[rgba(255,255,255,0.06)] pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#00D6A4]" />
              <span className="text-xs font-bold text-[#00D6A4] font-mono">AI VERDICT: <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="inline-block" style={{ textShadow: "0 0 12px rgba(0,214,164,0.4)" }}>APPROVED</motion.span> (Freelancer)</span>
            </div>
            {phase >= 5 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-[11px] text-[#98A2AE] leading-relaxed">
                Brief requires &ldquo;modern, minimalist, vector format&rdquo; and states &ldquo;avoid stock-style mascots.&rdquo; Freelancer&apos;s delivery aligns with every requirement. Client&apos;s request contradicts their own brief.
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AIJudgeSection() {
  return (
    <section id="ai-judge" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <SectionFadeIn>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-[#00D6A4] bg-[rgba(0,214,164,0.06)] border border-[rgba(0,214,164,0.12)] rounded-full px-3 py-1.5 mb-6">
              <Scale className="w-3 h-3" /> AI-Powered Arbitration
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[0.92] mb-4">
              The AI Judge reads the brief. <GradientText>Not the emotions.</GradientText>
            </h2>
            <p className="text-[#98A2AE] leading-[1.65] mb-6">
              Our AI arbitrator analyzes the contract brief, delivered work, and both sides&apos; statements. It cites specific evidence from your agreement, not vibes.
            </p>
            <ul className="space-y-3">
              {principles.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#98A2AE]">
                  <CheckCircle2 className="w-4 h-4 text-[#00D6A4] mt-0.5 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </SectionFadeIn>
          <SectionFadeIn delay={0.2}>
            <TerminalCard />
          </SectionFadeIn>
        </div>
      </div>
    </section>
  );
}
