"use client";
import { useState } from "react";
import { SectionFadeIn, GradientText } from "@/components/ui";

const plans = [
  { name: "Klyrn", fee: "1%", feeNum: 1, cap: "Capped at $50", highlight: true },
  { name: "Upwork", fee: "10%", feeNum: 10, cap: "No cap", highlight: false },
  { name: "Stripe + PayPal", fee: "2.9% + 30¢", feeNum: 2.9, cap: "+ chargeback risk", highlight: false },
];

export default function PricingSection() {
  const [contractSize, setContractSize] = useState(2000);
  const klyrn = Math.min(contractSize * 0.01, 50);
  const upwork = contractSize * 0.10;
  const stripe = contractSize * 0.029 + 0.30;
  const saved = Math.round(upwork - klyrn);

  return (
    <section id="pricing" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6 text-center">
        <SectionFadeIn>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4">
            Simple, <GradientText>honest</GradientText> pricing
          </h2>
          <p className="text-[#9BA1A6] mb-12 max-w-xl mx-auto">
            1% per contract, capped at $50. Compare that.
          </p>
        </SectionFadeIn>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {plans.map((p, i) => (
            <SectionFadeIn key={p.name} delay={i * 0.1}>
              <div className={`glass-card p-6 transition-all duration-300 relative ${
                p.highlight
                  ? "border-[rgba(0,214,164,0.4)] bg-[rgba(0,214,164,0.03)] scale-105 shadow-[0_0_60px_rgba(0,214,164,0.08)]"
                  : "hover:opacity-70"
              }`}>
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#00D6A4] text-black">
                    Recommended
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                <div className={`text-4xl md:text-5xl font-bold mb-1 ${p.highlight ? "" : "text-[#FF5C5C]"}`}>
                  {p.highlight ? <span className="gradient-text">{p.fee}</span> : p.fee}
                </div>
                <p className="text-sm text-[#6F767E]">{p.cap}</p>
              </div>
            </SectionFadeIn>
          ))}
        </div>

        {/* Savings Calculator */}
        <SectionFadeIn delay={0.3}>
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold text-[#9BA1A6] uppercase tracking-wider mb-6">Savings Calculator</h3>
            <div className="mb-6">
              <label className="text-sm text-[#6F767E] mb-2 block">Average contract size</label>
              <div className="flex items-center gap-4">
                <input
                  type="range" min={100} max={10000} step={100}
                  value={contractSize}
                  onChange={(e) => setContractSize(Number(e.target.value))}
                  className="flex-1 accent-[#00D6A4] h-1.5 bg-[#161C23] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00D6A4] [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,214,164,0.4)]"
                />
                <span className="text-xl font-bold font-mono w-28 text-right">${contractSize.toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <p className="text-xs text-[#6F767E] mb-1">Klyrn</p>
                <p className="text-xl font-bold gradient-text">${klyrn.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6F767E] mb-1">Upwork</p>
                <p className="text-xl font-bold text-[#FF5C5C]">${upwork.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6F767E] mb-1">Stripe + PayPal</p>
                <p className="text-xl font-bold text-[#FF5C5C]">${stripe.toFixed(0)}</p>
              </div>
            </div>
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
              <p className="text-sm text-[#9BA1A6]">You save <span className="text-2xl font-bold gradient-text">${saved}</span> per contract with Klyrn</p>
            </div>
          </div>
        </SectionFadeIn>
      </div>
    </section>
  );
}
