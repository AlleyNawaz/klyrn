"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Shield, Mail, Chrome, ArrowRight } from "lucide-react";

function SignupContent() {
  const params = useSearchParams();
  const router = useRouter();
  const role = params.get("role") || "freelancer";
  const isClient = role === "client";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAuth(method: string) {
    setLoading(method);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8" aria-label="Back to home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold">klyrn</span>
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-xl font-bold text-center mb-2">Create your account</h1>
          <p className="text-sm text-[#A1A1AA] text-center mb-2">
            {isClient
              ? "Hire freelancers without losing 20% to Upwork."
              : "Get paid instantly. No more 6-week disputes."}
          </p>

          {/* Role toggle */}
          <div className="flex bg-[#111113] rounded-lg p-1 mb-6">
            <Link href="/signup?role=client" className={`flex-1 text-center text-xs font-medium py-2 rounded-md transition-all ${isClient ? "bg-[#18181B] text-white" : "text-[#71717A] hover:text-white"}`}>
              I&apos;m hiring
            </Link>
            <Link href="/signup?role=freelancer" className={`flex-1 text-center text-xs font-medium py-2 rounded-md transition-all ${!isClient ? "bg-[#18181B] text-white" : "text-[#71717A] hover:text-white"}`}>
              I&apos;m freelancing
            </Link>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleAuth("google")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-60 text-black font-medium py-3 px-4 rounded-xl transition-all text-sm"
              aria-label="Sign up with Google"
            >
              {loading === "google" ? (
                <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><Chrome className="w-4 h-4" /> Sign up with Google</>
              )}
            </button>
            <button
              onClick={() => handleAuth("email-btn")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 bg-[#18181B] hover:bg-[#27272A] disabled:opacity-60 border border-[#27272A] text-white font-medium py-3 px-4 rounded-xl transition-all text-sm"
              aria-label="Sign up with email"
            >
              {loading === "email-btn" ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><Mail className="w-4 h-4" /> Sign up with email</>
              )}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#27272A]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-[#18181B] px-3 text-[#71717A]">or enter your email</span></div>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#111113] border border-[#27272A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50"
            />
            <button
              onClick={() => handleAuth("email")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 bg-[#00D395] hover:bg-[#00B37E] disabled:opacity-60 text-black font-semibold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,211,149,0.3)] text-sm"
              aria-label="Create account"
            >
              {loading === "email" ? (
                <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Creating account...</>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          <p className="text-xs text-[#3F3F46] text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#00D395] hover:underline">Log in</Link>
          </p>
        </div>

        <Link href="/" className="flex items-center justify-center gap-1 text-xs text-[#71717A] hover:text-white transition-colors mt-6" aria-label="Back to home">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
      <SignupContent />
    </Suspense>
  );
}
