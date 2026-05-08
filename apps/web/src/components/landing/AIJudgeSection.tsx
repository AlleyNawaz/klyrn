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
  const [phase, setPhase] = useState(0); // 0=typing1, 1=msg1, 2=typing2, 3=msg2, 4=verdict, 5=reasoning, 6=hold
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!inView) return;
    let t: NodeJS.Timeout;
    const seq = [600, 800, 600, 800, 1000, 2000, 4000];
    let p = 0;
    const next = () => {
      if (p < 7) { p++; setPhase(p); t = setTimeout(next, seq[p - 1] || 1000); }
      else { setPhase(0); p = 0; t = setTimeout(next, 1000); }
    };
    t = setTimeout(next, 500);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div ref={ref} className="glass-card overflow-hidden glow relative">
      {/* Terminal bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
        <div className="traffic-light traffic-red" />
        <div className="traffic-light traffic-yellow" />
        <div className="traffic-light traffic-green" />
        <span className="text-[10px] font-mono text-[#6F767E] ml-2">klyrn-arbitrator-v1.0</span>
      </div>
      <div className="p-5 space-y-4">
        {/* Keith's message */}
        {phase >= 0 && phase < 1 && <div className="text-xs text-[#6F767E] font-mono animate-pulse">typing...</div>}
        {phase >= 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0E1418] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">K</div>
              <span className="text-xs font-medium">Keith (Client)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF5C5C]/10 text-[#FF5C5C]">DISPUTED</span>
            </div>
            <p className="text-xs text-[#9BA1A6]">&ldquo;This isn&apos;t what I asked for. I wanted a mascot logo.&rdquo;</p>
          </motion.div>
        )}
        {/* Ahmad's message */}
        {phase >= 2 && phase < 3 && <div className="text-xs text-[#6F767E] font-mono animate-pulse">typing...</div>}
        {phase >= 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0E1418] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">A</div>
              <span className="text-xs font-medium">Ahmad (Freelancer)</span>
            </div>
            <p className="text-xs text-[#9BA1A6]">&ldquo;The brief says &lsquo;avoid stock-style mascots.&rsquo; I delivered a minimalist wordmark as specified.&rdquo;</p>
          </motion.div>
        )}
        {/* Verdict */}
        {phase >= 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-[rgba(255,255,255,0.06)] pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#00D6A4]" />
              <span className="text-xs font-bold text-[#00D6A4] font-mono">AI VERDICT: APPROVED (Freelancer)</span>
            </div>
            {phase >= 5 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-[11px] text-[#9BA1A6] leading-relaxed">
                The brief explicitly requires &ldquo;modern, minimalist, vector format&rdquo; and states to &ldquo;avoid stock-style mascots.&rdquo; The freelancer&apos;s delivery aligns with every requirement. The client&apos;s request contradicts their own brief.
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
            <span className="inline-flex items-center gap-2 text-xs font-medium text-[#00D6A4] bg-[rgba(0,214,164,0.08)] border border-[rgba(0,214,164,0.15)] rounded-full px-3 py-1.5 mb-6">
              <Scale className="w-3 h-3" /> AI-Powered Arbitration
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4 leading-[0.95]">
              The AI Judge reads the brief. <GradientText>Not the emotions.</GradientText>
            </h2>
            <p className="text-[#9BA1A6] leading-relaxed mb-6">
              Our AI arbitrator analyzes the contract brief, delivered work, and both sides&apos; statements. It cites specific evidence from your agreement, not vibes.
            </p>
            <ul className="space-y-3">
              {principles.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#9BA1A6]">
                  <CheckCircle2 className="w-4 h-4 text-[#00D6A4] mt-0.5 flex-shrink-0" />
                  {item}
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
