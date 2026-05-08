"use client";
import { useState, useRef } from "react";
import { SectionFadeIn, GradientText } from "@/components/ui";
import { motion, useInView } from "framer-motion";

const steps = [
  { num: "01", title: "Create a contract", desc: "Define scope, milestones, and budget. Your brief becomes ground truth." },
  { num: "02", title: "Fund the escrow", desc: "USDC deposits into a smart contract. Neither party can touch it." },
  { num: "03", title: "Deliver & review", desc: "Submit work per milestone. Files hashed and sealed on-chain." },
  { num: "04", title: "Get paid instantly", desc: "Approve work, funds release. Disputes? AI resolves in 8 seconds." },
];

function StepIcon({ num, active }: { num: string; active: boolean }) {
  const c = active ? "#00D6A4" : "#6B7682";
  if (num === "01") return (<svg width="52" height="52" viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth="1.5"><rect x="10" y="6" width="28" height="36" rx="4"/>{active && <><line x1="16" y1="16" x2="32" y2="16" strokeOpacity="0.7"><animate attributeName="x2" from="16" to="32" dur="0.5s" fill="freeze"/></line><line x1="16" y1="22" x2="28" y2="22" strokeOpacity="0.5"><animate attributeName="x2" from="16" to="28" dur="0.5s" begin="0.2s" fill="freeze"/></line><line x1="16" y1="28" x2="24" y2="28" strokeOpacity="0.3"><animate attributeName="x2" from="16" to="24" dur="0.5s" begin="0.4s" fill="freeze"/></line></>}</svg>);
  if (num === "02") return (<svg width="52" height="52" viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth="1.5"><rect x="12" y="14" width="24" height="22" rx="4"/><path d="M18 14V10a6 6 0 0112 0v4"/><circle cx="24" cy="27" r="3" fill={active ? c : "none"} stroke={c}>{active && <animate attributeName="r" from="0" to="3" dur="0.4s" fill="freeze"/>}</circle></svg>);
  if (num === "03") return (<svg width="52" height="52" viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth="1.5"><path d="M14 30V10a3 3 0 013-3h10l10 10v13"/><polyline points="27,7 27,17 37,17"/>{active && <text x="14" y="40" fill={c} fontSize="7" fontFamily="monospace" opacity="0.6">0xa3f..8c2</text>}</svg>);
  return (<svg width="52" height="52" viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth="1.5"><circle cx="24" cy="24" r="14"/><path d="M18 24l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>{active && <circle cx="24" cy="24" r="14" stroke={c} strokeWidth="0.8" opacity="0.3"><animate attributeName="r" from="14" to="22" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite"/></circle>}</svg>);
}

export default function HowItWorksSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-24 relative" style={{ background: "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-tint) 50%, var(--bg-base) 100%)" }}>
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6">
        <SectionFadeIn>
          <h2 className="text-center text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[0.92] mb-4">
            How it <GradientText>works</GradientText>
          </h2>
          <p className="text-center text-[#98A2AE] mb-16 max-w-2xl mx-auto">Four steps. No blockchain knowledge required.</p>
        </SectionFadeIn>

        <div ref={ref} className="relative">
          {/* Connecting track */}
          <div className="hidden md:block absolute top-[65px] left-[12.5%] right-[12.5%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full origin-left"
              style={{ background: "linear-gradient(90deg, rgba(0,214,164,0.08), rgba(0,214,164,0.25), rgba(99,102,241,0.15), rgba(0,214,164,0.08))" }}
            />
            {inView && (
              <div className="absolute top-[-4px] w-2.5 h-2.5 rounded-full bg-[#00D6A4]" style={{ animation: "dotTravel 8s linear infinite", boxShadow: "0 0 12px rgba(0,214,164,0.6)" }} />
            )}
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <SectionFadeIn key={s.num} delay={0.1 * i}>
                <div
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative glass-card p-6 h-full transition-all duration-300 cursor-default overflow-hidden ${hovered === i ? "border-[rgba(0,214,164,0.35)] -translate-y-2 shadow-[0_0_40px_rgba(0,214,164,0.08)]" : ""}`}
                >
                  <span className="absolute -right-1 -top-3 text-[4.5rem] font-bold font-mono leading-none select-none pointer-events-none" style={{ color: "rgba(0,214,164,0.04)" }}>{s.num}</span>
                  <div className="relative">
                    <div className="mb-4"><StepIcon num={s.num} active={hovered === i || hovered === null} /></div>
                    <span className="text-xs font-mono text-[#00D6A4] mb-2 block tracking-wider opacity-80">{s.num}</span>
                    <h3 className="text-[15px] font-semibold mb-1.5 tracking-[-0.01em]">{s.title}</h3>
                    <p className="text-sm text-[#98A2AE] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </SectionFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
