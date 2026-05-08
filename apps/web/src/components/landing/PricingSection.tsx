"use client";
import { useState } from "react";
import { SectionFadeIn, GradientText } from "@/components/ui";

export default function PricingSection() {
  const [size, setSize] = useState(2000);
  const klyrn = Math.min(size * 0.01, 50);
  const upwork = size * 0.10;
  const stripe = size * 0.029 + 0.30;
  const saved = Math.round(upwork - klyrn);

  return (
    <section id="pricing" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6 text-center">
        <SectionFadeIn>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[0.92] mb-4">
            Simple, <GradientText>honest</GradientText> pricing
          </h2>
          <p className="text-[#98A2AE] mb-12 max-w-xl mx-auto">1% per contract, capped at $50. Compare that.</p>
        </SectionFadeIn>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-14 items-end">
          {/* Upwork */}
          <SectionFadeIn delay={0.1}>
            <div className="glass-card p-6 transition-all duration-300 hover:opacity-70" style={{ filter: "saturate(0.85)" }}>
              <h3 className="text-base font-semibold mb-2 text-[#98A2AE]">Upwork</h3>
              <div className="text-4xl font-bold text-[#FF6B6B] mb-1">10%</div>
              <p className="text-sm text-[#6B7682]">No cap</p>
            </div>
          </SectionFadeIn>

          {/* Klyrn — dominates */}
          <SectionFadeIn delay={0}>
            <div className="relative glass-card p-8 border-[rgba(0,214,164,0.35)] scale-[1.08] origin-bottom" style={{ background: "linear-gradient(180deg, rgba(0,214,164,0.04) 0%, rgba(18,32,41,0.65) 100%)", boxShadow: "0 0 80px rgba(0,214,164,0.08), 0 12px 40px rgba(0,0,0,0.3)" }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#00D6A4] text-[#0A1218] font-mono">
                Recommended
              </span>
              <h3 className="text-base font-semibold mb-2">Klyrn</h3>
              <div className="text-[72px] md:text-[96px] font-bold leading-none mb-1 gradient-text">1%</div>
              <p className="text-sm text-[#98A2AE]">Capped at $50</p>
            </div>
          </SectionFadeIn>

          {/* Stripe */}
          <SectionFadeIn delay={0.1}>
            <div className="glass-card p-6 transition-all duration-300 hover:opacity-70" style={{ filter: "saturate(0.85)" }}>
              <h3 className="text-base font-semibold mb-2 text-[#98A2AE]">Stripe + PayPal</h3>
              <div className="text-4xl font-bold text-[#FF6B6B] mb-1">2.9% + 30¢</div>
              <p className="text-sm text-[#6B7682]">+ chargeback risk</p>
            </div>
          </SectionFadeIn>
        </div>

        {/* Savings Calculator */}
        <SectionFadeIn delay={0.3}>
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-xs font-semibold text-[#98A2AE] uppercase tracking-widest mb-6 font-mono">Savings Calculator</h3>
            <div className="mb-8">
              <label className="text-sm text-[#6B7682] mb-3 block">Average contract size</label>
              <div className="flex items-center gap-5">
                <div className="flex-1 relative">
                  <input
                    type="range" min={100} max={25000} step={100}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[#16262F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(0,214,164,0.3)] [&::-webkit-slider-thumb]:hover:shadow-[0_0_0_5px_rgba(0,214,164,0.4)] [&::-webkit-slider-thumb]:transition-shadow"
                  />
                  <div className="flex justify-between text-[10px] text-[#6B7682] font-mono mt-2">
                    <span>$500</span><span>$2K</span><span>$5K</span><span>$10K</span><span>$25K</span>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono w-32 text-right">${size.toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div><p className="text-[10px] text-[#6B7682] mb-1 font-mono uppercase tracking-wider">Klyrn</p><p className="text-2xl font-bold gradient-text">${klyrn.toFixed(0)}</p></div>
              <div><p className="text-[10px] text-[#6B7682] mb-1 font-mono uppercase tracking-wider">Upwork</p><p className="text-2xl font-bold text-[#FF6B6B]">${upwork.toFixed(0)}</p></div>
              <div><p className="text-[10px] text-[#6B7682] mb-1 font-mono uppercase tracking-wider">Stripe + PayPal</p><p className="text-2xl font-bold text-[#FF6B6B]">${stripe.toFixed(0)}</p></div>
            </div>
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-5">
              <p className="text-sm text-[#98A2AE]">You save</p>
              <p className="text-5xl md:text-[64px] font-bold gradient-text leading-none my-2">${saved.toLocaleString()}</p>
              <p className="text-sm text-[#6B7682]">per contract with Klyrn</p>
            </div>
          </div>
        </SectionFadeIn>
      </div>
    </section>
  );
}
