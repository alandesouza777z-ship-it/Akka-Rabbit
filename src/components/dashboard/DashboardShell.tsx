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

  const planColors: Record<string, string> = {
    starter: "text-text-secondary border-text-secondary",
    pro: "text-neon border-neon",
    enterprise: "text-warning border-warning",
  };

  return (
    <div className="min-h-screen bg-black relative">
      <MatrixRain />

      {/* === SIDEBAR === */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-bg-secondary/95 backdrop-blur-xl border-r border-border-neon z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border-neon">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-neon" />
            <span className="font-mono text-neon font-bold tracking-wider text-sm">
              AKKA<span className="text-white">RABBIT</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-text-muted hover:text-neon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition-all rounded-sm ${
                  isActive
                    ? "bg-neon-glow text-neon border-l-2 border-neon"
                    : "text-text-secondary hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Plan Badge */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-card p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-neon" />
              <span className="font-mono text-xs text-text-muted uppercase">Plano Atual</span>
            </div>
            <span
              className={`font-mono text-sm font-bold uppercase border px-2 py-0.5 ${
                planColors[user.plan_tier] || planColors.starter
              }`}
            >
              {user.plan_tier}
            </span>
          </div>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <div className="lg:ml-64 relative z-10">
        {/* Top Bar */}
        <header className="h-16 border-b border-border-neon bg-black/80 backdrop-blur-xl flex items-center px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-muted hover:text-neon mr-4"
            id="sidebar-toggle"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="font-mono text-xs text-text-muted">
            <span className="text-neon">~</span>
            <span>/dashboard</span>
            {pathname !== "/dashboard" && (
              <span className="text-neon">
                /{pathname.split("/").pop()}
              </span>
            )}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-4">
            {/* Status */}
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
              <span className="status-dot status-active" />
              <span className="text-neon">SHIELD ACTIVE</span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border-neon hover:border-border-neon-strong transition-colors"
                id="user-menu-btn"
              >
                <div className="w-6 h-6 bg-neon/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-neon" />
                </div>
                <span className="hidden sm:block font-mono text-xs text-text-secondary">
                  {user.full_name}
                </span>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-56 glass-card rounded-sm border border-border-neon overflow-hidden"
                  >
                    <div className="p-3 border-b border-border-neon">
                      <p className="font-mono text-xs text-white">{user.full_name}</p>
                      <p className="font-mono text-[10px] text-text-muted">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-text-secondary hover:text-neon hover:bg-neon-glow transition-colors rounded-sm"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-3 h-3" />
                        Configurações
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 font-mono text-xs text-danger hover:bg-danger/10 transition-colors rounded-sm"
                        id="logout-btn"
                      >
                        <LogOut className="w-3 h-3" />
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
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
