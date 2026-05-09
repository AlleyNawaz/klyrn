"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Shield, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "How it works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
  { label: "AI Judge", id: "ai-judge" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    let lastY = 0;
    const fn = () => {
      setScrolled(window.scrollY > 100);
      lastY = window.scrollY;
      // detect active section
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < 200 && rect.bottom > 200) {
            setActive(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function scroll(id: string) {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  // Magnetic button effect
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const handleMouse = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const pull = (80 - dist) / 80;
        btn.style.transform = `translate(${dx * pull * 0.15}px, ${dy * pull * 0.15}px)`;
      } else {
        btn.style.transform = "";
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled ? "max-w-3xl" : "max-w-5xl"
        } w-[calc(100%-2rem)]`}
        style={{
          background: "rgba(14,26,34,0.65)",
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          boxShadow: "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 8px 32px 0 rgba(0,0,0,0.4)",
        }}
      >
        <div className="h-16 px-4 md:px-5 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Klyrn home">
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,214,164,0.10)] flex items-center justify-center group-hover:[&>svg]:rotate-[360deg]">
              <Shield className="w-4 h-4 text-[#00D6A4] transition-transform duration-[600ms]" />
            </div>
            <span className="text-[18px] font-semibold tracking-[-0.02em]">klyrn</span>
          </Link>

          {/* Center: Nav items (desktop) */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scroll(item.id)}
                className={`relative px-4 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer ${
                  active === item.id ? "text-[#ECEEF0]" : "text-[#98A2AE] hover:text-[#ECEEF0] hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                {item.label}
                {active === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00D6A4]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right: CTA */}
          <div className="flex items-center gap-2">
            {status === "authenticated" ? (
              <Link
                ref={btnRef}
                href="/dashboard"
                className="text-sm font-medium bg-[#00D6A4] text-[#0A1218] px-[18px] py-[10px] rounded-[10px] transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                style={{ boxShadow: "0 4px 16px rgba(0,214,164,0.25), 0 0 0 1px rgba(0,214,164,0.4) inset" }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-sm text-[#98A2AE] hover:text-[#ECEEF0] transition-colors px-3 py-2">
                  Log in
                </Link>
                <Link
                  ref={btnRef}
                  href="/login"
                  className="text-sm font-medium bg-[#00D6A4] text-[#0A1218] px-[18px] py-[10px] rounded-[10px] transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                  style={{ boxShadow: "0 4px 16px rgba(0,214,164,0.25), 0 0 0 1px rgba(0,214,164,0.4) inset" }}
                >
                  Start a contract
                </Link>
              </>
            )}
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#98A2AE] hover:text-white p-2">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0A1218]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scroll(item.id)}
                className="text-2xl font-medium text-[#ECEEF0] hover:text-[#00D6A4] transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {status === "authenticated" ? (
                <Link href="/dashboard" className="text-lg text-[#00D6A4]" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              ) : (
                <Link href="/login" className="text-lg text-[#98A2AE]" onClick={() => setMobileOpen(false)}>Log in</Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
