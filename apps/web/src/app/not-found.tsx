import Link from "next/link";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-[#A1A1AA] mb-8">This page doesn&apos;t exist. Maybe it was never funded.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,211,149,0.3)]">
          Back to home
        </Link>
      </div>
    </div>
  );
}
