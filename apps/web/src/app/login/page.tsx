"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Shield, Mail, Chrome, ArrowLeft, Loader2 } from "lucide-react";

type Phase = "choose" | "email-input" | "otp-verify";

export default function LoginPage() {
  const [phase, setPhase] = useState<Phase>("choose");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState(""); // Show OTP in dev mode

  // ─── Google OAuth ───
  async function handleGoogle() {
    setLoading("google");
    setError("");
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  // ─── Send OTP to email ───
  async function handleSendOTP() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setLoading("send-otp");
    setError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // In dev, the API returns the code for easy testing
      if (data.code) setDevCode(data.code);
      
      setPhase("otp-verify");
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setLoading(null);
    }
  }

  // ─── Verify OTP ───
  async function handleVerifyOTP() {
    if (otp.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setLoading("verify");
    setError("");
    const result = await signIn("email-otp", {
      email,
      otp,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid or expired code. Try again.");
      setLoading(null);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8" aria-label="Back to home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D6A4] to-[#00B37E] flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold">klyrn</span>
        </Link>

        <div className="glass-card p-8">
          {/* ─── Phase 1: Choose method ─── */}
          {phase === "choose" && (
            <>
              <h1 className="text-xl font-bold text-center mb-2">Welcome back</h1>
              <p className="text-sm text-[#98A2AE] text-center mb-8">Log in to manage your contracts and payments.</p>

              <div className="space-y-3">
                <button
                  onClick={handleGoogle}
                  disabled={loading !== null}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-60 text-black font-medium py-3 px-4 rounded-xl transition-all text-sm"
                >
                  {loading === "google" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Google...</>
                  ) : (
                    <><Chrome className="w-4 h-4" /> Continue with Google</>
                  )}
                </button>

                <button
                  onClick={() => { setPhase("email-input"); setError(""); }}
                  disabled={loading !== null}
                  className="w-full flex items-center justify-center gap-3 bg-[#16262F] hover:bg-[#1C2E38] disabled:opacity-60 border border-[rgba(255,255,255,0.08)] text-white font-medium py-3 px-4 rounded-xl transition-all text-sm"
                >
                  <Mail className="w-4 h-4" /> Continue with email
                </button>
              </div>
            </>
          )}

          {/* ─── Phase 2: Enter email ─── */}
          {phase === "email-input" && (
            <>
              <button onClick={() => { setPhase("choose"); setError(""); }} className="flex items-center gap-1 text-xs text-[#6B7682] hover:text-white transition-colors mb-4">
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
              <h1 className="text-xl font-bold text-center mb-2">Enter your email</h1>
              <p className="text-sm text-[#98A2AE] text-center mb-6">We&apos;ll send a 6-digit verification code.</p>

              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#0E1A22] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#6B7682] focus:outline-none focus:border-[#00D6A4]/50 transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  autoFocus
                />
                <button
                  onClick={handleSendOTP}
                  disabled={loading !== null}
                  className="w-full bg-[#00D6A4] hover:bg-[#00B37E] disabled:opacity-60 text-[#0A1218] font-semibold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,214,164,0.3)] text-sm flex items-center justify-center gap-2"
                >
                  {loading === "send-otp" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending code...</>
                  ) : "Send verification code"}
                </button>
              </div>
            </>
          )}

          {/* ─── Phase 3: Enter OTP ─── */}
          {phase === "otp-verify" && (
            <>
              <button onClick={() => { setPhase("email-input"); setError(""); setOtp(""); }} className="flex items-center gap-1 text-xs text-[#6B7682] hover:text-white transition-colors mb-4">
                <ArrowLeft className="w-3 h-3" /> Change email
              </button>
              <h1 className="text-xl font-bold text-center mb-2">Check your email</h1>
              <p className="text-sm text-[#98A2AE] text-center mb-2">
                We sent a code to <span className="text-white font-medium">{email}</span>
              </p>
              
              {devCode && (
                <div className="bg-[rgba(0,214,164,0.06)] border border-[rgba(0,214,164,0.15)] rounded-lg px-3 py-2 mb-4 text-center">
                  <p className="text-[10px] text-[#6B7682] mb-0.5">DEV MODE — Your code:</p>
                  <p className="text-lg font-bold font-mono text-[#00D6A4] tracking-[0.3em]">{devCode}</p>
                </div>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-[#0E1A22] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder:text-[#6B7682] focus:outline-none focus:border-[#00D6A4]/50 transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                  autoFocus
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading !== null || otp.length !== 6}
                  className="w-full bg-[#00D6A4] hover:bg-[#00B37E] disabled:opacity-60 text-[#0A1218] font-semibold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,214,164,0.3)] text-sm flex items-center justify-center gap-2"
                >
                  {loading === "verify" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                  ) : "Verify & sign in"}
                </button>
                <button onClick={handleSendOTP} className="w-full text-xs text-[#6B7682] hover:text-[#00D6A4] transition-colors py-2">
                  Didn&apos;t receive it? Resend code
                </button>
              </div>
            </>
          )}

          {/* Error display */}
          {error && (
            <div className="mt-4 bg-[rgba(255,107,107,0.06)] border border-[rgba(255,107,107,0.15)] rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-[#FF6B6B]">{error}</p>
            </div>
          )}

          <p className="text-xs text-[#6B7682] text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#00D6A4] hover:underline">Sign up</Link>
          </p>
        </div>

        <Link href="/" className="flex items-center justify-center gap-1 text-xs text-[#6B7682] hover:text-white transition-colors mt-6">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
