"use client";
import { SectionFadeIn, Counter } from "@/components/ui";
import { DollarSign, Clock, AlertTriangle, Shield } from "lucide-react";

const pains = [
  { icon: DollarSign, platform: "Upwork", pain: "Takes 20% of your earnings", stat: 20, suffix: "%", label: "platform fee" },
  { icon: Clock, platform: "Stripe", pain: "Holds your money for 7 days", stat: 7, suffix: " days", label: "payment hold" },
  { icon: AlertTriangle, platform: "PayPal", pain: "Reverses payments at any time", stat: 0, suffix: "∞", label: "chargeback risk" },
];

export default function PainSection() {
  return (
    <section className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6">
        <SectionFadeIn>
          <h2 className="text-center text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[0.92] mb-4">
            The system is <span className="text-[#FF6B6B] glitch-text inline-block">broken</span>
          </h2>
          <p className="text-center text-[#98A2AE] mb-16 max-w-2xl mx-auto">
            <Counter target={50} suffix=" million" className="font-semibold text-[#ECEEF0]" /> freelancers lose <Counter target={11} prefix="$" suffix=" billion" className="font-semibold text-[#ECEEF0]" /> a year to platform fees, chargebacks, and unfair disputes.
          </p>
        </SectionFadeIn>
        <div className="grid md:grid-cols-4 gap-5">
          {pains.map((p, i) => (
            <SectionFadeIn key={p.platform} delay={i * 0.1}>
              <div className="glass-card p-6 group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,107,0.1)] h-full" style={{ borderColor: "rgba(255,107,107,0.12)" }}>
                <p.icon className="w-9 h-9 text-[#FF6B6B] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-semibold mb-1">{p.platform}</h3>
                <p className="text-[#98A2AE] text-sm mb-4">{p.pain}</p>
                <div className="border-t border-[rgba(255,255,255,0.05)] pt-3">
                  <span className="text-3xl font-bold text-[#FF6B6B]">
                    {p.stat > 0 ? <Counter target={p.stat} suffix={p.suffix} /> : p.suffix}
                  </span>
                  <span className="text-xs text-[#6B7682] ml-2">{p.label}</span>
                </div>
              </div>
            </SectionFadeIn>
          ))}
          {/* Klyrn card — dominates */}
          <SectionFadeIn delay={0.3}>
            <div className="glass-card p-6 h-full border-[rgba(0,214,164,0.3)] bg-[rgba(0,214,164,0.03)] hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,214,164,0.1)] relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[rgba(0,214,164,0.06)] blur-2xl" />
              <Shield className="w-9 h-9 text-[#00D6A4] mb-4" />
              <h3 className="text-base font-semibold mb-1">Klyrn</h3>
              <p className="text-sm text-[#98A2AE] mb-4">Fair to both sides</p>
              <div className="border-t border-[rgba(0,214,164,0.15)] pt-3">
                <span className="text-4xl font-bold gradient-text">1%</span>
                <span className="text-xs text-[#6B7682] ml-2">capped at $50</span>
              </div>
            </div>
          </SectionFadeIn>
        </div>
      </div>
    </section>
  );
}
