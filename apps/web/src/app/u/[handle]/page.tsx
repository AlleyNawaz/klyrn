"use client";

import {
  Shield, Star, CheckCircle2, FileText, Clock,
  Globe, TrendingUp, Award, ExternalLink
} from "lucide-react";
import Link from "next/link";

const DEMO_PROFILE = {
  handle: "@ahmad_designs",
  displayName: "Ahmad Hassan",
  role: "FREELANCER",
  country: "PK",
  countryName: "Pakistan",
  avatarUrl: null,
  totalContractsCompleted: 28,
  totalVolumeUsdCents: 4200000,
  disputeRate: 0.04,
  avgRating: 4.9,
  onTimeDeliveryRate: 0.96,
  reputationNftMint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  createdAt: "2024-03-15T00:00:00Z",
  badges: [
    { label: "Top Rated", color: "#F59E0B" },
    { label: "On-Time Pro", color: "#00D395" },
    { label: "Dispute-Free", color: "#3B82F6" },
  ],
  recentContracts: [
    { title: "Brand Identity Redesign", amount: "$2,500", status: "ACTIVE", date: "Jun 2025" },
    { title: "Logo Design for Klyrn", amount: "$500", status: "DISPUTED", date: "Jun 2025" },
    { title: "Mobile App UI", amount: "$4,800", status: "COMPLETED", date: "May 2025" },
    { title: "Marketing Website", amount: "$3,200", status: "COMPLETED", date: "Apr 2025" },
  ],
};

function StatCard({ label, value, subtext, icon: Icon }: {
  label: string; value: string; subtext?: string; icon: React.ElementType;
}) {
  return (
    <div className="glass-card p-4 text-center">
      <Icon className="w-4 h-4 text-[#71717A] mx-auto mb-2" />
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] text-[#71717A] mt-0.5">{label}</p>
      {subtext && <p className="text-[10px] text-[#00D395] mt-1">{subtext}</p>}
    </div>
  );
}

export default function PublicProfilePage() {
  const p = DEMO_PROFILE;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Nav */}
      <header className="border-b border-[#27272A]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center">
              <Shield className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-bold">klyrn</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/30 flex items-center justify-center text-2xl font-bold text-purple-400 mx-auto mb-4 ring-2 ring-purple-500/20 ring-offset-2 ring-offset-[#09090B]">
            {p.displayName[0]}
          </div>
          <h1 className="text-2xl font-bold">{p.displayName}</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">{p.handle}</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
              <Globe className="w-3 h-3" /> {p.countryName}
            </span>
            <span className="text-[#27272A]">·</span>
            <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
              <Clock className="w-3 h-3" /> Member since {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {p.badges.map((b) => (
              <span
                key={b.label}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{ color: b.color, backgroundColor: `${b.color}15`, border: `1px solid ${b.color}30` }}
              >
                {b.label}
              </span>
            ))}
          </div>

          {/* Rating stars */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(p.avgRating || 0) ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#27272A]"}`}
              />
            ))}
            <span className="text-sm font-semibold ml-1">{p.avgRating}</span>
            <span className="text-xs text-[#71717A] ml-1">({p.totalContractsCompleted} contracts)</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <StatCard icon={FileText} label="Contracts" value={String(p.totalContractsCompleted)} />
          <StatCard icon={TrendingUp} label="Total Volume" value={`$${(p.totalVolumeUsdCents / 100).toLocaleString()}`} />
          <StatCard icon={CheckCircle2} label="On-Time Rate" value={`${Math.round((p.onTimeDeliveryRate || 0) * 100)}%`} subtext="Above average" />
          <StatCard icon={Shield} label="Dispute Rate" value={`${Math.round(p.disputeRate * 100)}%`} subtext="Excellent" />
        </div>

        {/* Reputation NFT badge */}
        {p.reputationNftMint && (
          <div className="glass-card p-5 mb-10 glow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D395] to-[#7DD3FC] flex items-center justify-center">
                  <Award className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Verified Reputation</p>
                  <p className="text-[10px] text-[#71717A]">This reputation is backed by an on-chain credential (cNFT)</p>
                </div>
              </div>
              <a
                href={`https://solscan.io/token/${p.reputationNftMint}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#00D395] hover:underline"
              >
                Verify on Solana <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Recent contracts */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#27272A]">
            <h2 className="text-sm font-semibold">Recent Contracts</h2>
          </div>
          <div>
            {p.recentContracts.map((c, i) => {
              const statusColor = c.status === "COMPLETED" ? "#71717A"
                : c.status === "ACTIVE" ? "#00D395"
                : c.status === "DISPUTED" ? "#EF4444" : "#F59E0B";
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3 border-b border-[#27272A] last:border-0 hover:bg-[#111113] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-[10px] text-[#71717A]">{c.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{c.amount}</span>
                    <span
                      className="text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase"
                      style={{ color: statusColor, backgroundColor: `${statusColor}15`, border: `1px solid ${statusColor}30` }}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
