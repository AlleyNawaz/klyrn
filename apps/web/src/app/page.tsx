"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import HowItWorksSection from "@/components/landing/HowItWorks";
import AIJudgeSection from "@/components/landing/AIJudgeSection";
import PricingSection from "@/components/landing/PricingSection";
import SocialProofSection from "@/components/landing/SocialProof";
import CTASection, { Footer } from "@/components/landing/CTASection";

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} className="cursor-glow hidden md:block" />;
}

export default function LandingPage() {
  return (
    <main className="page-bg page-entrance">
      {/* Atmospheric layers */}
      <div className="grid-bg" />
      <div className="noise-bg" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />
      <div className="glow-orb glow-orb-4" />
      <CursorGlow />

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
