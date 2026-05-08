"use client";

import { FileText, DollarSign, Clock, CheckCircle2, AlertTriangle, TrendingUp, ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

// Demo data
const stats = [
  { label: "Active Contracts", value: "4", icon: FileText, trend: "+2 this month", color: "#00D395" },
  { label: "Total Earned", value: "$12,450", icon: DollarSign, trend: "+$3,200 this month", color: "#00D395" },
  { label: "Pending Review", value: "2", icon: Clock, trend: "1 due tomorrow", color: "#F59E0B" },
  { label: "Dispute Rate", value: "4%", icon: AlertTriangle, trend: "Below avg", color: "#00D395" },
];

const contracts = [
  { id: "1", title: "Brand Identity Redesign", client: "Keith T.", amount: "$2,500", status: "ACTIVE", milestones: "2/4", statusColor: "#00D395", href: "/contracts/1" },
  { id: "2", title: "Mobile App UI Design", client: "Alex K.", amount: "$4,800", status: "ACTIVE", milestones: "1/3", statusColor: "#00D395", href: "/contracts/2" },
  { id: "demo-logo-contract", title: "Logo Design", client: "Keith T.", amount: "$500", status: "DISPUTED", milestones: "0/1", statusColor: "#EF4444", href: "/contracts/demo-logo-contract" },
  { id: "4", title: "Website Redesign", client: "Lisa M.", amount: "$3,200", status: "COMPLETED", milestones: "5/5", statusColor: "#71717A", href: "/contracts/4" },
  { id: "5", title: "Marketing Illustrations", client: "David R.", amount: "$1,450", status: "PENDING", milestones: "0/3", statusColor: "#F59E0B", href: "/contracts/5" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[#A1A1AA] mt-1">Welcome back. Here&apos;s your overview.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5 hover:border-[#3F3F46] transition-all">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-4 h-4 text-[#71717A]" />
              <TrendingUp className="w-3 h-3" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-[#71717A] mt-1">{stat.label}</p>
            <p className="text-[10px] mt-2" style={{ color: stat.color }}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Contracts table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#27272A]">
          <h2 className="text-sm font-semibold">Recent Contracts</h2>
          <button className="text-xs text-[#00D395] hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#27272A] text-xs text-[#71717A]">
                <th className="text-left py-3 px-5 font-medium">Contract</th>
                <th className="text-left py-3 px-5 font-medium">Client</th>
                <th className="text-left py-3 px-5 font-medium">Amount</th>
                <th className="text-left py-3 px-5 font-medium">Milestones</th>
                <th className="text-left py-3 px-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b border-[#27272A] hover:bg-[#111113] transition-colors cursor-pointer" onClick={() => window.location.href = c.href}>
                  <td className="py-3 px-5">
                    <Link href={c.href} className="text-sm font-medium hover:text-[#00D395] transition-colors">{c.title}</Link>
                  </td>
                  <td className="py-3 px-5 text-sm text-[#A1A1AA]">{c.client}</td>
                  <td className="py-3 px-5 text-sm font-medium">{c.amount}</td>
                  <td className="py-3 px-5 text-sm text-[#A1A1AA]">{c.milestones}</td>
                  <td className="py-3 px-5">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        color: c.statusColor,
                        backgroundColor: `${c.statusColor}15`,
                        border: `1px solid ${c.statusColor}30`,
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
