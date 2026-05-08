"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Chrome } from "lucide-react";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAuth(method: string) {
    setLoading(method);
    await new Promise((r) => setTimeout(r, 1200));
    // Persist demo user session
    loginUser({
      email: email || "demo@klyrn.xyz",
      name: method === "google" ? "Demo User" : (email ? email.split("@")[0] : "Demo User"),
      handle: method === "google" ? "demo_user" : (email ? email.split("@")[0] : "demo_user"),
    });
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
          <h1 className="text-xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-sm text-[#A1A1AA] text-center mb-8">Log in to manage your contracts and payments.</p>

          <div className="space-y-3">
            <button
              onClick={() => handleAuth("google")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-60 text-black font-medium py-3 px-4 rounded-xl transition-all text-sm"
              aria-label="Continue with Google"
            >
              {loading === "google" ? (
                <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><Chrome className="w-4 h-4" /> Continue with Google</>
              )}
            </button>
            <button
              onClick={() => handleAuth("email-btn")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 bg-[#18181B] hover:bg-[#27272A] disabled:opacity-60 border border-[#27272A] text-white font-medium py-3 px-4 rounded-xl transition-all text-sm"
              aria-label="Continue with email"
            >
              {loading === "email-btn" ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><Mail className="w-4 h-4" /> Continue with email</>
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
              className="w-full bg-[#111113] border border-[#27272A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50 transition-colors"
            />
            <button
              onClick={() => handleAuth("email")}
              disabled={loading !== null}
              className="w-full bg-[#00D395] hover:bg-[#00B37E] disabled:opacity-60 text-black font-semibold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,211,149,0.3)] text-sm"
              aria-label="Sign in"
            >
              {loading === "email" ? (
                <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Signing in...</span>
              ) : "Sign in"}
            </button>
          </div>

          <p className="text-xs text-[#3F3F46] text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#00D395] hover:underline">Sign up</Link>
          </p>
        </div>

        <Link href="/" className="flex items-center justify-center gap-1 text-xs text-[#71717A] hover:text-white transition-colors mt-6" aria-label="Back to home">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
