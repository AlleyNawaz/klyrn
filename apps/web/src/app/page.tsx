"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Shield, Zap, Scale, ArrowRight, CheckCircle2, 
  Clock, DollarSign, AlertTriangle, ChevronDown,
  Globe, Star, TrendingUp
} from "lucide-react";

// ---- AI Demo Simulation Data ----
const DEMO_STEPS = [
  { label: "Analyzing contract brief...", delay: 800 },
  { label: "Reviewing submitted deliverables...", delay: 1200 },
  { label: "Comparing against specifications...", delay: 1000 },
  { label: "Evaluating dispute statements...", delay: 900 },
  { label: "Rendering verdict...", delay: 600 },
];

const DEMO_VERDICT = {
  verdict: "APPROVED" as string,
  confidence: 94,
  reasoning: `The brief explicitly states: "Modern, minimalist, vector format, must include a custom wordmark. Avoid stock-style mascots." The freelancer delivered exactly what was specified, a clean SVG logo with a custom wordmark. The client's dispute requesting a mascot directly contradicts their own brief. Funds released to freelancer.`,
};

// ---- Navbar ----
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function smoothScroll(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // sticky nav height
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#09090B]/80 backdrop-blur-xl border-b border-[#27272A]" : ""
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Klyrn home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center">
            <Shield className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight">klyrn</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#A1A1AA]">
          <button onClick={() => smoothScroll("how-it-works")} className="hover:text-white transition-colors cursor-pointer" aria-label="Scroll to How it works">How it works</button>
          <button onClick={() => smoothScroll("pricing")} className="hover:text-white transition-colors cursor-pointer" aria-label="Scroll to Pricing">Pricing</button>
          <button onClick={() => smoothScroll("ai-judge")} className="hover:text-white transition-colors cursor-pointer" aria-label="Scroll to AI Judge">AI Judge</button>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#A1A1AA] hover:text-white transition-colors px-4 py-2" aria-label="Log in">
            Log in
          </Link>
          <Link href="/contracts/new" className="text-sm font-medium bg-[#00D395] hover:bg-[#00B37E] text-black px-5 py-2 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,211,149,0.3)]" aria-label="Start a contract">
            Start a contract
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ---- AI Demo Widget ----
function AIDemoWidget() {
  const [step, setStep] = useState(0);
  const [showVerdict, setShowVerdict] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const runDemo = () => {
      setStep(0);
      setShowVerdict(false);
      setConfidence(0);
      let currentStep = 0;

      const advance = () => {
        if (currentStep < DEMO_STEPS.length) {
          setStep(currentStep + 1);
          currentStep++;
          setTimeout(advance, DEMO_STEPS[currentStep - 1]?.delay || 1000);
        } else {
          setShowVerdict(true);
          let c = 0;
          const ci = setInterval(() => {
            c += 2;
            if (c >= DEMO_VERDICT.confidence) {
              c = DEMO_VERDICT.confidence;
              clearInterval(ci);
            }
            setConfidence(c);
          }, 20);
        }
      };
      setTimeout(advance, 500);
    };

    runDemo();
    intervalRef.current = setInterval(runDemo, 12000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="glass-card p-5 w-full max-w-md glow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#00D395] pulse-dot" />
        <span className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
          Live AI Arbitration
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {DEMO_STEPS.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs transition-all duration-300 ${
            i < step ? "text-[#00D395]" : i === step ? "text-white" : "text-[#3F3F46]"
          }`}>
            {i < step ? (
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            ) : i === step ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00D395] border-t-transparent animate-spin flex-shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-[#3F3F46] flex-shrink-0" />
            )}
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {showVerdict && (
        <div className="animate-fade-in-up">
          <div className="border-t border-[#27272A] pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00D395]/15 text-[#00D395] border border-[#00D395]/30">
                ✓ APPROVED (Freelancer)
              </span>
              <span className="text-xs text-[#A1A1AA]">{confidence}% confidence</span>
            </div>
            <div className="w-full h-1.5 bg-[#18181B] rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-[#00D395] to-[#33DFAB] rounded-full transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <p className="text-[10px] text-[#71717A] leading-relaxed line-clamp-3">
              {DEMO_VERDICT.reasoning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Hero Section (devnet pill REMOVED per Section 2) ----
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 radial-fade" />
      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-balance">
            Get paid.{" "}
            <span className="gradient-text">No middlemen.</span>{" "}
            No 8-week disputes.
          </h1>
          <p className="text-lg md:text-xl text-[#A1A1AA] leading-relaxed mb-8 max-w-xl">
            Klyrn is escrow for freelancers, with AI that resolves disputes 
            in <span className="text-white font-semibold">8 seconds</span>, not 8 weeks. 
            Your money is safe in code, not in someone&apos;s bank account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/signup?role=client" className="group flex items-center justify-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(0,211,149,0.3)] text-base" aria-label="Sign up as a client">
              I&apos;m hiring
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/signup?role=freelancer" className="flex items-center justify-center gap-2 border border-[#27272A] hover:border-[#3F3F46] text-white font-medium px-8 py-3.5 rounded-xl transition-all hover:bg-[#111113] text-base" aria-label="Sign up as a freelancer">
              I&apos;m freelancing
            </Link>
          </div>
          <div className="flex items-center gap-6 mt-8 text-xs text-[#71717A]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D395]" /> 1% fee, capped at $50</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D395]" /> Instant payouts</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00D395]" /> No chargebacks</span>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <AIDemoWidget />
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-[#3F3F46]" />
      </div>
    </section>
  );
}

// ---- Pain Section ----
function PainSection() {
  const pains = [
    { icon: DollarSign, platform: "Upwork", pain: "Takes 20% of your earnings", stat: "20%", statLabel: "platform fee" },
    { icon: Clock, platform: "Stripe", pain: "Holds your money for 7 days", stat: "7 days", statLabel: "payment hold" },
    { icon: AlertTriangle, platform: "PayPal", pain: "Reverses payments at any time", stat: "∞", statLabel: "chargeback risk" },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">
          The system is <span className="text-[#EF4444]">broken</span>
        </h2>
        <p className="text-center text-[#A1A1AA] mb-16 max-w-2xl mx-auto">
          50 million freelancers lose $11 billion a year to platform fees, chargebacks, and unfair disputes.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((p) => (
            <div key={p.platform} className="glass-card p-6 hover:border-[#3F3F46] transition-all group">
              <p.icon className="w-10 h-10 text-[#EF4444] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2">{p.platform}</h3>
              <p className="text-[#A1A1AA] text-sm mb-4">{p.pain}</p>
              <div className="border-t border-[#27272A] pt-4">
                <span className="text-3xl font-bold text-[#EF4444]">{p.stat}</span>
                <span className="text-xs text-[#71717A] ml-2">{p.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- How It Works ----
function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Create a contract", desc: "Define the scope, milestones, and budget. Your brief becomes the ground truth for any dispute.", icon: "📝" },
    { num: "02", title: "Fund the escrow", desc: "Deposit funds into a smart contract. Neither party can touch them until work is approved.", icon: "🔒" },
    { num: "03", title: "Deliver & review", desc: "Submit work against each milestone. Files are hashed and sealed on-chain as proof.", icon: "📦" },
    { num: "04", title: "Get paid instantly", desc: "Approve the work and funds release immediately. Disputes? AI resolves them in 8 seconds.", icon: "⚡" },
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">
          How it <span className="gradient-text">works</span>
        </h2>
        <p className="text-center text-[#A1A1AA] mb-16 max-w-2xl mx-auto">
          Four steps. No blockchain knowledge required. No crypto jargon.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="relative group">
              <div className="glass-card p-6 h-full hover:border-[#00D395]/30 transition-all">
                <span className="text-5xl mb-4 block">{s.icon}</span>
                <span className="text-xs font-mono text-[#00D395] mb-2 block">{s.num}</span>
                <h3 className="text-base font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- AI Judge Section (Section 3: Keith + Ahmad) ----
function AIJudgeSection() {
  return (
    <section id="ai-judge" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-[#00D395] bg-[#00D395]/10 border border-[#00D395]/20 rounded-full px-3 py-1.5 mb-6">
              <Scale className="w-3 h-3" /> AI-Powered Arbitration
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The AI Judge reads the brief.{" "}
              <span className="gradient-text">Not the emotions.</span>
            </h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-6">
              Our AI arbitrator analyzes the contract brief, delivered work, and both sides&apos; 
              statements. It cites specific evidence from your agreement, not vibes. If either 
              party disagrees, they can appeal to human jurors.
            </p>
            <ul className="space-y-3">
              {[
                "Brief is the contract. Ambiguity is the client's risk",
                "Quality judged against price paid, not perfection",
                "Partial releases for work that mostly meets spec",
                "Always escalates suspected plagiarism to humans",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                  <CheckCircle2 className="w-4 h-4 text-[#00D395] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-6 glow">
            <div className="text-xs font-mono text-[#71717A] mb-3">SAMPLE DISPUTE RESOLUTION</div>
            <div className="space-y-4">
              <div className="bg-[#111113] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">K</div>
                  <span className="text-xs font-medium">Keith (Client)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">DISPUTED</span>
                </div>
                <p className="text-xs text-[#A1A1AA]">&ldquo;This isn&apos;t what I asked for. I wanted a mascot logo.&rdquo;</p>
              </div>
              <div className="bg-[#111113] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">A</div>
                  <span className="text-xs font-medium">Ahmad (Freelancer)</span>
                </div>
                <p className="text-xs text-[#A1A1AA]">&ldquo;The brief says &lsquo;avoid stock-style mascots.&rsquo; I delivered a minimalist wordmark as specified.&rdquo;</p>
              </div>
              <div className="border-t border-[#27272A] pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[#00D395]" />
                  <span className="text-xs font-bold text-[#00D395]">AI VERDICT: APPROVED (Freelancer)</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  The brief explicitly requires &ldquo;modern, minimalist, vector format&rdquo; and states to 
                  &ldquo;avoid stock-style mascots.&rdquo; The freelancer&apos;s delivery aligns with every specified 
                  requirement. The client&apos;s request for a mascot contradicts their own brief.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Pricing Section ----
function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Simple, <span className="gradient-text">honest</span> pricing
        </h2>
        <p className="text-[#A1A1AA] mb-12 max-w-xl mx-auto">
          1% per contract, capped at $50. Compare that to Upwork&apos;s 10% + Stripe&apos;s 2.9%.
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Klyrn", fee: "1%", cap: "Capped at $50", highlight: true },
            { name: "Upwork", fee: "10%", cap: "No cap", highlight: false },
            { name: "Stripe + PayPal", fee: "2.9% + 30¢", cap: "+ chargeback risk", highlight: false },
          ].map((p) => (
            <div key={p.name} className={`glass-card p-6 ${p.highlight ? "border-[#00D395]/40 glow" : ""}`}>
              <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
              <div className={`text-4xl font-bold mb-1 ${p.highlight ? "text-[#00D395]" : "text-[#EF4444]"}`}>
                {p.fee}
              </div>
              <p className="text-sm text-[#71717A]">{p.cap}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Social Proof (Section 7: pilot disclaimer added) ----
function SocialProofSection() {
  const testimonials = [
    { name: "Aisha K.", country: "🇵🇰 Pakistan", role: "UI/UX Designer", quote: "I got paid in 3 seconds after approval. No more waiting 14 days for Upwork to process." },
    { name: "David O.", country: "🇳🇬 Nigeria", role: "Frontend Developer", quote: "A client tried to scam me. The AI read the brief, sided with me in 10 seconds. Life-changing." },
    { name: "Maria S.", country: "🇧🇷 Brazil", role: "Content Writer", quote: "1% fee vs 20%? That's an extra $400/month in my pocket. Klyrn is a no-brainer." },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">
          Trusted by freelancers <span className="gradient-text">worldwide</span>
        </h2>
        <div className="flex justify-center gap-4 text-2xl mb-12">
          {["🇵🇰", "🇳🇬", "🇵🇭", "🇧🇷", "🇮🇳", "🇰🇪", "🇺🇦", "🇲🇽"].map((flag) => (
            <span key={flag} className="hover:scale-125 transition-transform cursor-default">{flag}</span>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-6">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-sm text-[#A1A1AA] mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-[#71717A]">{t.role} · {t.country}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-[#3F3F46] mt-6">* Pilot users</p>
      </div>
    </section>
  );
}

// ---- CTA Section ----
function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="glass-card p-12 glow relative overflow-hidden">
          <div className="absolute inset-0 radial-fade" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get paid <span className="gradient-text">fairly</span>?
            </h2>
            <p className="text-[#A1A1AA] mb-8 max-w-xl mx-auto">
              Join thousands of freelancers who&apos;ve ditched unfair platforms. 
              Create your first contract in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contracts/new" className="group flex items-center justify-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(0,211,149,0.3)]" aria-label="Start a contract">
                Start a contract
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Footer (Section 4: all links wired) ----
function Footer() {
  return (
    <footer className="border-t border-[#27272A] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Klyrn home">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center">
              <Shield className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-semibold">klyrn</span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-[#71717A]">
            <Link href="/terms" className="hover:text-white transition-colors" aria-label="Terms of Service">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors" aria-label="Privacy Policy">Privacy</Link>
            <Link href="/docs" className="hover:text-white transition-colors" aria-label="Documentation">Docs</Link>
            <a href="https://github.com/klyrn" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Klyrn GitHub">GitHub</a>
          </div>
          <p className="text-xs text-[#3F3F46]">© 2026 Klyrn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ---- Landing Page ----
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <PainSection />
      <HowItWorksSection />
      <AIJudgeSection />
      <PricingSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </main>
  );
}
