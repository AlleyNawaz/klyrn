import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Klyrn",
  description: "Klyrn Terms of Service. Acceptable use, fees, dispute process, liability, and governing law.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-xs text-[#71717A] mb-10">Last updated: May 7, 2026</p>

        <div className="space-y-8 text-sm text-[#A1A1AA] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Acceptable Use</h2>
            <p>By using Klyrn, you agree to create, fund, and participate in escrow contracts in good faith. You will not use the platform for money laundering, fraud, or any activity that violates applicable law. Klyrn reserves the right to suspend accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Fees</h2>
            <p>Klyrn charges a 1% fee on each contract, capped at $50 USDC. This fee is deducted at the time of fund release. There are no hidden charges, subscription fees, or withdrawal fees. AI arbitration is included at no additional cost. Human jury appeals cost $25 USDC, refundable if the appeal is successful.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Dispute Process</h2>
            <p>When a client disputes a milestone, both parties submit written statements. Klyrn&apos;s AI arbitrator analyzes the contract brief, delivered work, and both statements to render a verdict. Either party may appeal the AI verdict to a panel of 3 staked human jurors for a $25 fee. The juror majority rules. All dispute outcomes are final once the appeal window closes (72 hours).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Liability</h2>
            <p>Klyrn provides escrow and arbitration services on an &ldquo;as is&rdquo; basis. We are not liable for losses arising from smart contract bugs, network congestion, or third-party service failures. Our total liability is limited to the fees collected on the relevant transaction. We strongly recommend all users review the brief carefully before funding.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law provisions. Any disputes arising from these Terms shall be resolved through binding arbitration in Delaware.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Changes to Terms</h2>
            <p>Klyrn may update these Terms at any time. We will notify users via email and a banner on the platform at least 14 days before changes take effect. Continued use of the platform constitutes acceptance of the updated Terms.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
