"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Bell, Wallet, ShieldCheck } from "lucide-react";

const TABS = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "wallet", label: "Wallet (Pro)", icon: Wallet },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-[#A1A1AA] mb-8">Manage your account and preferences.</p>

        <div className="flex gap-1 mb-8 bg-[#111113] rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-md transition-all ${
                activeTab === tab.id ? "bg-[#18181B] text-white" : "text-[#71717A] hover:text-white"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "account" && (
          <div className="glass-card p-6 space-y-6">
            <div>
              <label className="text-xs font-medium text-[#A1A1AA] block mb-2">Display Name</label>
              <input type="text" defaultValue="Keith Thompson" className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D395]/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#A1A1AA] block mb-2">Handle</label>
              <input type="text" defaultValue="@keith_t" className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D395]/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#A1A1AA] block mb-2">Email</label>
              <input type="email" defaultValue="keith@example.com" className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D395]/50" />
            </div>
            <button className="bg-[#00D395] hover:bg-[#00B37E] text-black text-sm font-medium px-6 py-2.5 rounded-lg transition-all">Save Changes</button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="glass-card p-6 space-y-4">
            {["Contract invites", "Milestone submissions", "Dispute alerts", "AI verdicts", "Payment releases"].map((item) => (
              <div key={item} className="flex items-center justify-between py-2">
                <span className="text-sm">{item}</span>
                <div className="w-10 h-5 bg-[#00D395] rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-black rounded-full transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold mb-4">Pro Mode</h3>
            <div className="flex items-center justify-between py-3 border-b border-[#27272A]">
              <div>
                <p className="text-sm">Show on-chain details</p>
                <p className="text-xs text-[#71717A]">Display PDAs, tx signatures, and program accounts</p>
              </div>
              <div className="w-10 h-5 bg-[#27272A] rounded-full relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-[#71717A] rounded-full transition-all" />
              </div>
            </div>
            <div className="mt-4 bg-[#111113] rounded-lg p-4 text-xs text-[#71717A]">
              <p>Connected wallet: Not connected</p>
              <button className="mt-3 text-[#00D395] hover:underline text-xs">Connect wallet via Privy</button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#27272A]">
              <div>
                <p className="text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-[#71717A]">Add an extra layer of security</p>
              </div>
              <button className="text-xs text-[#00D395] hover:underline">Enable</button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm">Active Sessions</p>
                <p className="text-xs text-[#71717A]">1 active session (this device)</p>
              </div>
              <button className="text-xs text-[#EF4444] hover:underline">Revoke all</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
