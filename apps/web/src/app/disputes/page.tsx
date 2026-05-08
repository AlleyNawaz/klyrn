"use client";

import { Scale, Clock, CheckCircle2, AlertTriangle, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

const disputes = [
  {
    id: "d1",
    contractTitle: "Logo Design for Klyrn MVP",
    milestoneTitle: "Final Logo Delivery",
    reason: "OFF_SPEC",
    status: "AI_DECIDED",
    verdict: "APPROVED",
    confidence: 94,
    amount: "$500",
    openedAt: "2025-06-04",
    statusColor: "#00D395",
  },
  {
    id: "d2",
    contractTitle: "Mobile App UI Design",
    milestoneTitle: "Wireframes",
    reason: "INCOMPLETE",
    status: "AWAITING_RESPONSES",
    verdict: null,
    confidence: null,
    amount: "$1,600",
    openedAt: "2025-06-06",
    statusColor: "#F59E0B",
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  AWAITING_RESPONSES: { label: "Awaiting Responses", color: "#F59E0B", icon: Clock },
  AI_REVIEW: { label: "AI Reviewing", color: "#3B82F6", icon: Zap },
  AI_DECIDED: { label: "AI Decided", color: "#00D395", icon: CheckCircle2 },
  ESCALATED_TO_JURY: { label: "Escalated", color: "#EF4444", icon: AlertTriangle },
  RESOLVED: { label: "Resolved", color: "#71717A", icon: CheckCircle2 },
};

export default function DisputesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Disputes</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">Active and resolved disputes across your contracts.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-[#71717A]">Total Disputes</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[#00D395]">1</p>
            <p className="text-xs text-[#71717A]">Resolved</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[#F59E0B]">1</p>
            <p className="text-xs text-[#71717A]">Pending</p>
          </div>
        </div>

        {/* Dispute cards */}
        <div className="space-y-3">
          {disputes.map((d) => {
            const statusConfig = STATUS_CONFIG[d.status] || STATUS_CONFIG.AWAITING_RESPONSES;
            const StatusIcon = statusConfig.icon;

            return (
              <Link href={`/disputes/${d.id}`} key={d.id}>
                <div className="glass-card p-5 hover:border-[#3F3F46] transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Scale className="w-4 h-4 text-[#EF4444]" />
                        <h3 className="text-sm font-semibold">{d.milestoneTitle}</h3>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color: statusConfig.color,
                            backgroundColor: `${statusConfig.color}15`,
                            border: `1px solid ${statusConfig.color}30`,
                          }}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A] mb-2">{d.contractTitle}</p>

                      <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
                        <span>Reason: {d.reason.replace("_", " ")}</span>
                        <span>Amount: {d.amount}</span>
                        <span>Opened: {d.openedAt}</span>
                      </div>

                      {/* Verdict preview */}
                      {d.verdict && d.confidence && (
                        <div className="mt-3 flex items-center gap-2">
                          <Zap className="w-3 h-3 text-[#00D395]" />
                          <span className="text-xs text-[#00D395] font-medium">
                            AI Verdict: {d.verdict} ({d.confidence}% confidence)
                          </span>
                        </div>
                      )}
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#3F3F46] flex-shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
