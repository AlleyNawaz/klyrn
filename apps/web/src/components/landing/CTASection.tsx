"use client";
import Link from "next/link";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { SectionFadeIn, GradientText } from "@/components/ui";

export default function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="max-w-4xl mx-auto px-6 text-center">
        <SectionFadeIn>
          <div className="relative glass-card p-12 overflow-hidden" style={{ background: "radial-gradient(ellipse at center, rgba(0,214,164,0.06) 0%, rgba(11,15,18,0.8) 70%)" }}>
            {/* Floating mock contract */}
            <div className="absolute -right-4 top-8 opacity-20 pointer-events-none float-card hidden lg:block">
              <div className="glass-card p-4 w-48 rotate-6">
                <p className="text-[10px] font-mono text-[#00D6A4] mb-1">CONTRACT</p>
                <p className="text-xs font-medium">Logo design</p>
                <p className="text-xs text-[#9BA1A6]">$500</p>
                <p className="text-[10px] text-[#00D6A4] mt-1">Funded ✓</p>
              </div>
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-4">
                Ready to get paid <GradientText>fairly</GradientText>?
              </h2>
              <p className="text-[#9BA1A6] mb-8 max-w-xl mx-auto">
                Join thousands of freelancers who&apos;ve ditched unfair platforms. Create your first contract in under 60 seconds.
              </p>
              <Link href="/contracts/new" className="group relative inline-flex items-center justify-center gap-2 bg-[#00D6A4] hover:bg-[#00B88A] text-black font-semibold px-10 py-5 rounded-xl transition-all hover:shadow-[0_0_40px_rgba(0,214,164,0.3)] hover:scale-[1.04] text-base overflow-hidden">
                <span className="absolute inset-0 btn-shimmer" />
                <span className="relative flex items-center gap-2">
                  Start a contract <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <div className="flex items-center justify-center gap-6 mt-6 text-xs text-[#6F767E]">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#00D6A4]" /> 1% fee</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#00D6A4]" /> Funds auditable on-chain</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#00D6A4]" /> No account needed</span>
              </div>
            </div>
          </div>
        </SectionFadeIn>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Klyrn home">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00D6A4] to-[#00B37E] flex items-center justify-center">
              <Shield className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-semibold">klyrn</span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-[#6F767E]">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <a href="https://github.com/klyrn" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-[#6F767E]">© 2026 Klyrn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
