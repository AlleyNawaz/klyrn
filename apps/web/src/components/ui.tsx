"use client";
import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* ---- SectionFadeIn ---- */
export function SectionFadeIn({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduced ? {} : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---- GradientText ---- */
export function GradientText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`gradient-text ${className}`}>{children}</span>;
}

/* ---- Counter ---- */
export function Counter({ target, suffix = "", prefix = "", duration = 1.5, className = "" }: {
  target: number; suffix?: string; prefix?: string; duration?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return <span ref={ref} className={className}>{prefix}{val.toLocaleString()}{suffix}</span>;
}
