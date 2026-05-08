import Link from "next/link";
import { Shield, BookOpen, Zap, Scale, Users, Code2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs | Klyrn",
  description: "Klyrn documentation. Learn how escrow, AI arbitration, and dispute resolution work.",
};

const sections = [
  { title: "Quickstart", desc: "Create your first contract in 60 seconds.", icon: Zap, href: "/docs" },
  { title: "How Escrow Works", desc: "Milestone-based escrow, auto-approval, fund release.", icon: BookOpen, href: "/docs" },
  { title: "AI Arbitration", desc: "How the AI Judge reads briefs and renders verdicts.", icon: Scale, href: "/docs" },
  { title: "Disputes", desc: "Filing, AI verdict, appeal, and resolution.", icon: Scale, href: "/docs" },
  { title: "Become a Juror", desc: "Stake SOL, review disputes, earn fees.", icon: Users, href: "/docs" },
  { title: "API Reference", desc: "REST API for contracts, milestones, disputes.", icon: Code2, href: "/docs" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[#27272A]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center">
              <Shield className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-bold">klyrn</span>
          </Link>
          <span className="text-xs text-[#71717A]">Documentation</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-3">Documentation</h1>
        <p className="text-[#A1A1AA] mb-12 max-w-2xl">Everything you need to know about Klyrn.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <Link key={s.title} href={s.href}>
              <div className="glass-card p-6 hover:border-[#3F3F46] transition-all group h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00D395]/10 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5 text-[#00D395]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold mb-1 group-hover:text-[#00D395] transition-colors flex items-center gap-1">
                      {s.title} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </h2>
                    <p className="text-xs text-[#71717A]">{s.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
