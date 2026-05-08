"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import HowItWorksSection from "@/components/landing/HowItWorks";
import AIJudgeSection from "@/components/landing/AIJudgeSection";
import PricingSection from "@/components/landing/PricingSection";
import SocialProofSection from "@/components/landing/SocialProof";
import CTASection, { Footer } from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <main className="page-bg page-entrance">
      {/* Atmospheric layers */}
      <div className="grid-bg" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <PainSection />
        <HowItWorksSection />
        <AIJudgeSection />
        <PricingSection />
        <SocialProofSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
