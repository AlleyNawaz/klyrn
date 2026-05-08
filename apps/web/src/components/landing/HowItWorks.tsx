"use client";
import { useState } from "react";
import { SectionFadeIn, GradientText } from "@/components/ui";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", title: "Create a contract", desc: "Define scope, milestones, and budget. Your brief becomes ground truth." },
  { num: "02", title: "Fund the escrow", desc: "USDC deposits into a smart contract. Neither party can touch it." },
  { num: "03", title: "Deliver & review", desc: "Submit work per milestone. Files are hashed and sealed on-chain." },
  { num: "04", title: "Get paid instantly", desc: "Approve work, funds release. Disputes? AI resolves in 8 seconds." },
];

function StepIcon({ num, active }: { num: string; active: boolean }) {
  const color = active ? "#00D6A4" : "#6F767E";
  if (num === "01") return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.5">
      <rect x="10" y="6" width="28" height="36" rx="3" /><line x1="16" y1="16" x2="32" y2="16" opacity={active ? 1 : 0.4} /><line x1="16" y1="22" x2="28" y2="22" opacity={active ? 1 : 0.4} /><line x1="16" y1="28" x2="24" y2="28" opacity={active ? 1 : 0.4} />
    </svg>
  );
  if (num === "02") return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.5">
      <rect x="12" y="14" width="24" height="22" rx="3" /><path d="M18 14V10a6 6 0 0112 0v4" /><circle cx="24" cy="27" r="3" fill={active ? color : "none"} />
    </svg>
  );
  if (num === "03") return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M14 30V10a2 2 0 012-2h12l8 8v14" /><polyline points="28,8 28,16 36,16" /><path d="M14 36h20" strokeDasharray={active ? "0" : "3 3"} />
    </svg>
  );
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="24" cy="24" r="14" /><path d="M18 24l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
      {active && <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1" opacity="0.3"><animate attributeName="r" from="14" to="20" dur="1.5s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" /></circle>}
    </svg>
  );
}

export default function HowItWorksSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6">
        <SectionFadeIn>
          <h2 className="text-center text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4">
            How it <GradientText>works</GradientText>
          </h2>
          <p className="text-center text-[#9BA1A6] mb-16 max-w-2xl mx-auto">
            Four steps. No blockchain knowledge required. No crypto jargon.
          </p>
        </SectionFadeIn>

        <div ref={ref} className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[60px] left-[12.5%] right-[12.5%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-[rgba(0,214,164,0.15)] via-[rgba(0,214,164,0.3)] to-[rgba(0,214,164,0.15)] origin-left"
            />
            {/* Traveling dot */}
            {inView && (
              <div className="absolute top-[-3px] w-2 h-2 rounded-full bg-[#00D6A4] shadow-[0_0_8px_rgba(0,214,164,0.6)]" style={{ animation: "dotTravel 8s linear infinite" }} />
            )}
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <SectionFadeIn key={s.num} delay={0.1 * i}>
                <div
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative glass-card p-6 h-full transition-all duration-300 cursor-default overflow-hidden ${hovered === i ? "border-[rgba(0,214,164,0.4)] -translate-y-1 shadow-[0_0_30px_rgba(0,214,164,0.1)]" : ""}`}
                >
                  {/* Background number */}
                  <span className="absolute -right-2 -top-4 text-[5rem] font-bold font-mono text-[rgba(0,214,164,0.06)] leading-none select-none pointer-events-none">{s.num}</span>
                  
                  <div className="relative">
                    <div className="mb-4">
                      <StepIcon num={s.num} active={hovered === i || hovered === null} />
                    </div>
                    <span className="text-xs font-mono text-[#00D6A4] mb-2 block tracking-wider">{s.num}</span>
                    <h3 className="text-base font-semibold mb-2 tracking-[-0.01em]">{s.title}</h3>
                    <p className="text-sm text-[#9BA1A6] leading-relaxed">{s.desc}</p>
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
