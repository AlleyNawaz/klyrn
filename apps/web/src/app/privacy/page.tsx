import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Klyrn",
  description: "Klyrn Privacy Policy. How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[#27272A]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Back to home">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center">
              <Shield className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-bold">klyrn</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-xs text-[#71717A] hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-xs text-[#71717A] mb-10">Last updated: May 7, 2026</p>

        <div className="space-y-8 text-sm text-[#A1A1AA] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Data We Collect</h2>
            <p>We collect the minimum data necessary to operate the platform: email address (via Privy authentication), wallet addresses, contract details, uploaded deliverables, and dispute statements. We also collect basic analytics data (page views, session duration) via privacy-respecting analytics.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Your Data</h2>
            <p>Your data is used to: facilitate escrow contracts, process AI arbitration, send transactional notifications (email), display your public profile and reputation, and improve the platform. We never sell your data to advertisers or third-party data brokers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Third-Party Services</h2>
            <p>Klyrn integrates with the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-white">Privy</strong>: Authentication and wallet management</li>
              <li><strong className="text-white">Helius</strong>: Solana RPC and indexing</li>
              <li><strong className="text-white">Cloudflare R2</strong>: File storage for deliverables</li>
              <li><strong className="text-white">Resend</strong>: Transactional email delivery</li>
              <li><strong className="text-white">Anthropic</strong>: AI arbitration (dispute data is processed securely)</li>
            </ul>
            <p className="mt-2">Each service has its own privacy policy. We share only the minimum data required for each service to function.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. User Rights</h2>
            <p>You have the right to: access your data, request deletion of your account and data, export your contract history, and opt out of non-essential communications. To exercise these rights, email privacy@klyrn.xyz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Security</h2>
            <p>All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Deliverable files are stored in private R2 buckets with signed access URLs. We conduct regular security audits and follow industry best practices.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Contact</h2>
            <p>For privacy inquiries, contact us at <a href="mailto:privacy@klyrn.xyz" className="text-[#00D395] hover:underline">privacy@klyrn.xyz</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
