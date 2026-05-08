"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Shield, LayoutDashboard, FileText, Scale, Settings, LogOut, Bell, Search, Plus, Home, Loader2 } from "lucide-react";
import { useAuth, logoutUser } from "@/lib/auth";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Contracts", href: "/contracts/demo-logo-contract" },
  { icon: Scale, label: "Disputes", href: "/disputes" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#00D6A4] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null; // useAuth will redirect

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} border-r border-[#27272A] flex flex-col transition-all duration-200`}>
        <div className="h-16 flex items-center px-4 border-b border-[#27272A]">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="Back to home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D395] to-[#00B37E] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-black" />
            </div>
            {sidebarOpen && <span className="text-sm font-bold">klyrn</span>}
          </Link>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? "text-white bg-[#18181B]"
                  : "text-[#A1A1AA] hover:text-white hover:bg-[#18181B]"
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${pathname === item.href ? "text-[#00D395]" : ""}`} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#27272A] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#18181B] flex items-center justify-center text-xs font-medium">{user?.name?.[0] || "U"}</div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user?.name || "User"}</p>
                <p className="text-[10px] text-[#71717A] truncate">@{user?.handle || "user"}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-[#71717A] hover:text-white transition-colors px-1">
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-[#27272A] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="text"
                placeholder="Search contracts..."
                className="bg-[#111113] border border-[#27272A] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#00D395]/50 w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-[#71717A] hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00D395]" />
            </button>
            <Link href="/contracts/new" className="flex items-center gap-2 bg-[#00D395] hover:bg-[#00B37E] text-black text-sm font-medium px-4 py-2 rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" />
              New Contract
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
