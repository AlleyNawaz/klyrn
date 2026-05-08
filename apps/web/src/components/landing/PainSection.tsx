"use client";
import { SectionFadeIn, Counter } from "@/components/ui";
import { DollarSign, Clock, AlertTriangle, Shield } from "lucide-react";

const pains = [
  { icon: DollarSign, platform: "Upwork", pain: "Takes 20% of your earnings", stat: 20, statSuffix: "%", statLabel: "platform fee" },
  { icon: Clock, platform: "Stripe", pain: "Holds your money for 7 days", stat: 7, statSuffix: " days", statLabel: "payment hold" },
  { icon: AlertTriangle, platform: "PayPal", pain: "Reverses payments at any time", stat: 0, statSuffix: "∞", statLabel: "chargeback risk" },
];

export default function PainSection() {
  return (
    <section className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6">
        <SectionFadeIn>
          <h2 className="text-center text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4">
            The system is <span className="text-[#FF5C5C] glitch-text">broken</span>
          </h2>
          <p className="text-center text-[#9BA1A6] mb-16 max-w-2xl mx-auto">
            <Counter target={50} suffix=" million" className="font-semibold text-[#ECEDEE]" /> freelancers lose <Counter target={11} prefix="$" suffix=" billion" className="font-semibold text-[#ECEDEE]" /> a year to platform fees, chargebacks, and unfair disputes.
          </p>
        </SectionFadeIn>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {pains.map((p, i) => (
            <SectionFadeIn key={p.platform} delay={i * 0.1}>
              <div className="glass-card p-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,92,92,0.08)]">
                <p.icon className="w-10 h-10 text-[#FF5C5C] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{p.platform}</h3>
                <p className="text-[#9BA1A6] text-sm mb-4">{p.pain}</p>
                <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
                  <span className="text-3xl font-bold text-[#FF5C5C]">
                    {p.stat > 0 ? <Counter target={p.stat} suffix={p.statSuffix} /> : p.statSuffix}
                  </span>
                  <span className="text-xs text-[#6F767E] ml-2">{p.statLabel}</span>
                </div>
              </div>
            </SectionFadeIn>
          ))}
        </div>
        {/* Klyrn contrast card */}
        <SectionFadeIn delay={0.3}>
          <div className="glass-card p-6 border-[rgba(0,214,164,0.3)] bg-[rgba(0,214,164,0.03)] max-w-sm mx-auto text-center hover:-translate-y-1 transition-all duration-300">
            <Shield className="w-8 h-8 text-[#00D6A4] mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Klyrn</h3>
            <p className="text-sm text-[#9BA1A6] mb-3">Fair to both sides</p>
            <span className="text-3xl font-bold gradient-text">1%</span>
            <span className="text-xs text-[#6F767E] ml-2">capped at $50</span>
          </div>
        </SectionFadeIn>
      </div>
    </section>
  );
}
