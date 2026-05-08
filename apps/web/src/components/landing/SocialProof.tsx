"use client";
import { SectionFadeIn, GradientText, Counter } from "@/components/ui";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Aisha K.", country: "Pakistan", flag: "🇵🇰", initials: "AK", color: "from-pink-500 to-purple-500", role: "UI/UX Designer", quote: "I got paid in 3 seconds after approval. No more waiting 14 days for Upwork to process." },
  { name: "David O.", country: "Nigeria", flag: "🇳🇬", initials: "DO", color: "from-emerald-500 to-teal-500", role: "Frontend Developer", quote: "A client tried to scam me. The AI read the brief, sided with me in 10 seconds. Life-changing." },
  { name: "Maria S.", country: "Brazil", flag: "🇧🇷", initials: "MS", color: "from-amber-500 to-orange-500", role: "Content Writer", quote: "1% fee vs 20%? That's an extra $400/month in my pocket. Klyrn is a no-brainer." },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6">
        <SectionFadeIn>
          <h2 className="text-center text-3xl md:text-5xl font-semibold tracking-[-0.035em] leading-[0.92] mb-4">
            Trusted by freelancers <GradientText>worldwide</GradientText>
          </h2>
          <div className="flex justify-center gap-10 mt-5 mb-12">
            <div className="text-center">
              <p className="text-2xl font-bold gradient-text font-mono">$<Counter target={47392} /></p>
              <p className="text-[11px] text-[#6B7682] mt-1">paid out this week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold gradient-text font-mono"><Counter target={142} /></p>
              <p className="text-[11px] text-[#6B7682] mt-1">contracts completed today</p>
            </div>
          </div>
        </SectionFadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <SectionFadeIn key={t.name} delay={i * 0.1}>
              <div className="glass-card p-6 hover:-translate-y-1.5 transition-all duration-300 h-full">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-[#FFB547] text-[#FFB547]" />)}
                </div>
                <p className="text-sm text-[#98A2AE] mb-5 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-[#6B7682]">{t.role} · {t.flag} {t.country}</p>
                  </div>
                </div>
              </div>
            </SectionFadeIn>
          ))}
        </div>
        <p className="text-center text-[10px] text-[#6B7682] mt-6">* Pilot users, testimonials reflect early access feedback</p>
      </div>
    </section>
  );
}
