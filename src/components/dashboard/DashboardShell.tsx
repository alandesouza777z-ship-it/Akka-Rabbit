"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  LayoutDashboard,
  Globe,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Key,
  ChevronDown,
  User,
  Zap,
  Trophy,
  Headset,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MatrixRain from "@/components/MatrixRain";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  plan_tier: string;
  api_key: string;
  domains_limit: number;
  requests_limit: number;
}

interface DashboardShellProps {
  user: UserProfile;
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/domains", label: "Domínios", icon: Globe },
  { href: "/dashboard/logs", label: "Security Logs", icon: FileText },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/rewards", label: "Premiações", icon: Trophy },
  { href: "/dashboard/support", label: "Suporte", icon: Headset },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export default function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const planBadge: Record<string, { label: string; color: string; bg: string }> = {
    starter: { label: "Starter", color: "text-text-secondary", bg: "bg-white/5" },
    pro: { label: "Pro", color: "text-neon", bg: "bg-neon/10" },
    enterprise: { label: "Enterprise", color: "text-warning", bg: "bg-warning/10" },
  };

  const currentPlan = planBadge[user.plan_tier] || planBadge.starter;

  return (
    <div className="min-h-screen bg-black relative">
      <MatrixRain />

      {/* === SIDEBAR === */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-[#030303]/95 backdrop-blur-2xl border-r border-white/[0.04] z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.04]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/20">
              <Shield className="w-4 h-4 text-neon" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              <span className="text-neon">Akka</span>
              <span className="text-white">Rabbit</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all duration-200 rounded-lg relative ${
                  isActive
                    ? "bg-neon/[0.08] text-neon"
                    : "text-text-secondary hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-neon rounded-r-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] transition-colors ${isActive ? "text-neon" : "text-text-muted group-hover:text-text-secondary"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Plan Badge (Bottom) */}
        <div className="p-3 border-t border-white/[0.04]">
          <div className="glass-card-static p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">Plano</span>
              <Zap className="w-3 h-3 text-neon" />
            </div>
            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md ${currentPlan.color} ${currentPlan.bg}`}>
              {currentPlan.label}
            </span>
          </div>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <div className="lg:ml-[260px] relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/[0.04] bg-black/60 backdrop-blur-xl flex items-center px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-muted hover:text-white mr-4 transition-colors"
            id="sidebar-toggle"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="text-[13px] text-text-muted font-medium">
            <span className="text-text-secondary">Dashboard</span>
            {pathname !== "/dashboard" && (
              <>
                <span className="mx-2 text-text-muted/50">/</span>
                <span className="text-white capitalize">
                  {pathname.split("/").pop()?.replace(/-/g, " ")}
                </span>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {/* Shield Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon/[0.06] border border-neon/10">
              <span className="status-dot status-active animate-pulse-neon" />
              <span className="text-neon text-[11px] font-semibold tracking-wide">SHIELD ACTIVE</span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.03] transition-all"
                id="user-menu-btn"
              >
                <div className="w-7 h-7 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/15">
                  <User className="w-3.5 h-3.5 text-neon" />
                </div>
                <span className="hidden sm:block text-[13px] text-text-secondary font-medium">
                  {user.full_name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 glass-card-static border border-white/[0.06] overflow-hidden shadow-2xl"
                  >
                    <div className="p-3.5 border-b border-white/[0.04]">
                      <p className="text-sm font-medium text-white">{user.full_name}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-text-secondary hover:text-white hover:bg-white/[0.03] transition-colors rounded-lg"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Configurações
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-danger hover:bg-danger/[0.06] transition-colors rounded-lg"
                        id="logout-btn"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sair
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
