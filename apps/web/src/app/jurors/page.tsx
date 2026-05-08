"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Scale, Wallet, TrendingUp, CheckCircle2, Clock, ArrowRight } from "lucide-react";

const JUROR_STATS = {
  stakeBalance: "250 SOL",
  activeAssignments: 1,
  totalVotes: 14,
  accuracy: 92,
  totalEarnings: "$420",
};

const ASSIGNMENTS = [
  {
    id: "jd1",
    contractTitle: "Mobile App UI Design",
    milestoneTitle: "Wireframes",
    amount: "$1,600",
    aiVerdict: "REJECTED",
    status: "AWAITING_VOTE",
    deadline: "2025-06-12",
  },
];

const VOTE_HISTORY = [
  { disputeId: "d-old-1", title: "Logo Design for Klyrn MVP", vote: "APPROVED", aiAgreed: true, earned: "$15" },
  { disputeId: "d-old-2", title: "Website Copy Rewrite", vote: "REJECTED", aiAgreed: true, earned: "$15" },
  { disputeId: "d-old-3", title: "3D Character Modeling", vote: "APPROVED", aiAgreed: false, earned: "$0" },
];

export default function JurorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Juror Dashboard</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">Review disputes, earn fees, build your reputation.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="glass-card p-4 text-center">
            <Wallet className="w-4 h-4 text-[#71717A] mx-auto mb-2" />
            <p className="text-lg font-bold">{JUROR_STATS.stakeBalance}</p>
            <p className="text-[10px] text-[#71717A]">Stake Balance</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Scale className="w-4 h-4 text-[#F59E0B] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#F59E0B]">{JUROR_STATS.activeAssignments}</p>
            <p className="text-[10px] text-[#71717A]">Active</p>
          </div>
          <div className="glass-card p-4 text-center">
            <CheckCircle2 className="w-4 h-4 text-[#71717A] mx-auto mb-2" />
            <p className="text-lg font-bold">{JUROR_STATS.totalVotes}</p>
            <p className="text-[10px] text-[#71717A]">Total Votes</p>
          </div>
          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-4 h-4 text-[#00D395] mx-auto mb-2" />
            <p className="text-lg font-bold text-[#00D395]">{JUROR_STATS.accuracy}%</p>
            <p className="text-[10px] text-[#71717A]">Accuracy</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-lg font-bold">{JUROR_STATS.totalEarnings}</p>
            <p className="text-[10px] text-[#71717A]">Earnings</p>
          </div>
        </div>

        {/* Active Assignments */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Active Assignments</h2>
          {ASSIGNMENTS.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Scale className="w-8 h-8 text-[#3F3F46] mx-auto mb-3" />
              <p className="text-sm text-[#71717A]">No active assignments. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ASSIGNMENTS.map((a) => (
                <Link key={a.id} href={`/jurors/disputes/${a.id}`}>
                  <div className="glass-card p-5 hover:border-[#3F3F46] transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{a.milestoneTitle}</h3>
                        <p className="text-xs text-[#71717A]">{a.contractTitle} · {a.amount}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 font-semibold">
                            AWAITING YOUR VOTE
                          </span>
                          <span className="text-[10px] text-[#71717A] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Due {a.deadline}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#3F3F46]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Vote History */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Vote History</h2>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#27272A] text-xs text-[#71717A]">
                  <th className="text-left py-3 px-4 font-medium">Dispute</th>
                  <th className="text-left py-3 px-4 font-medium">Your Vote</th>
                  <th className="text-left py-3 px-4 font-medium">AI Agreed</th>
                  <th className="text-left py-3 px-4 font-medium">Earned</th>
                </tr>
              </thead>
              <tbody>
                {VOTE_HISTORY.map((v) => (
                  <tr key={v.disputeId} className="border-b border-[#27272A] last:border-0">
                    <td className="py-3 px-4 text-sm">{v.title}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        v.vote === "APPROVED" ? "bg-[#00D395]/10 text-[#00D395]" : "bg-[#EF4444]/10 text-[#EF4444]"
                      }`}>{v.vote}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">{v.aiAgreed ? "✅" : "❌"}</td>
                    <td className="py-3 px-4 text-sm font-medium">{v.earned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
