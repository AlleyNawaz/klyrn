"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function scroll(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0B0F12]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Klyrn home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D6A4] to-[#00B37E] flex items-center justify-center">
            <Shield className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-[-0.03em]">klyrn</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#9BA1A6]">
          <button onClick={() => scroll("how-it-works")} className="hover:text-white transition-colors cursor-pointer">How it works</button>
          <button onClick={() => scroll("pricing")} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
          <button onClick={() => scroll("ai-judge")} className="hover:text-white transition-colors cursor-pointer">AI Judge</button>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#9BA1A6] hover:text-white transition-colors px-4 py-2">Log in</Link>
          <Link href="/contracts/new" className="text-sm font-medium bg-[#00D6A4] hover:bg-[#00B88A] text-black px-5 py-2 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,214,164,0.3)]">Start a contract</Link>
        </div>
      </div>
    </nav>
  );
}
