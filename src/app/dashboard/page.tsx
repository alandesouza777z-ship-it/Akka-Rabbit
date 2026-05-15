"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Activity,
  Clock,
  Copy,
  Check,
  Loader2,
  TrendingUp,
  Eye,
  Cpu,
  ArrowUpRight,
  Ban,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ==================== SKELETON LOADERS ==================== */
function MetricSkeleton() {
  return (
    <div className="glass-card-static p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton w-9 h-9 rounded-lg" />
        <div className="skeleton w-14 h-4 rounded" />
      </div>
      <div className="skeleton w-20 h-8 rounded mb-2" />
      <div className="skeleton w-28 h-3 rounded" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="skeleton w-28 h-4 rounded" />
          <div className="skeleton w-20 h-4 rounded" />
          <div className="skeleton flex-1 h-4 rounded" />
          <div className="skeleton w-16 h-4 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ==================== MAIN PAGE ==================== */
export default function DashboardPage() {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    blocked: 0,
    allowed: 0,
    domains: 0,
    uptime: "100%",
  });

  const [recentThreats, setRecentThreats] = useState<any[]>([]);

  const fetchDashboardData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch user profile (API Key)
    const { data: profile } = await supabase
      .from("users")
      .select("api_key")
      .eq("id", user.id)
      .single();

    if (profile) {
      setApiKey(profile.api_key);
    }

    // Fetch domains count
    const { count: domainsCount } = await supabase
      .from("domains")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active");

    // Fetch logs (last 100)
    const { data: logs } = await supabase
      .from("security_logs")
      .select(`
        *,
        domains ( domain_url )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    let blocked = 0;
    let allowed = 0;

    if (logs) {
      logs.forEach(log => {
        if (log.action === "blocked") blocked++;
        if (log.action === "allowed" || log.action === "bypassed") allowed++;
      });
      setRecentThreats(logs.slice(0, 6));
    }

    setStats({
      blocked,
      allowed,
      domains: domainsCount || 0,
      uptime: "100%",
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const blockRate = stats.blocked + stats.allowed > 0
    ? Math.round((stats.blocked / (stats.blocked + stats.allowed)) * 100)
    : 0;

  const statCards = [
    {
      label: "Ameaças Bloqueadas",
      value: stats.blocked,
      icon: Ban,
      accentColor: "text-danger",
      accentBg: "bg-danger/8",
      change: `${blockRate}% taxa`,
    },
    {
      label: "Acessos Legítimos",
      value: stats.allowed,
      icon: CheckCircle2,
      accentColor: "text-neon",
      accentBg: "bg-neon/8",
      change: "verificados",
    },
    {
      label: "Domínios Ativos",
      value: stats.domains,
      icon: Globe,
      accentColor: "text-blue-400",
      accentBg: "bg-blue-400/8",
      change: "protegidos",
    },
    {
      label: "Uptime",
      value: stats.uptime,
      icon: Activity,
      accentColor: "text-neon",
      accentBg: "bg-neon/8",
      change: "operacional",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Shield Overview
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Monitoramento em tempo real da sua proteção
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon/[0.05] border border-neon/10">
          <span className="status-dot status-active animate-pulse-neon" />
          <span className="text-neon text-[11px] font-semibold tracking-wide font-mono">LIVE</span>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <MetricSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 ${stat.accentBg} flex items-center justify-center rounded-lg`}>
                  <stat.icon className={`w-[18px] h-[18px] ${stat.accentColor}`} />
                </div>
                <span className="text-[11px] text-text-muted font-medium">{stat.change}</span>
              </div>
              <div className="font-mono text-2xl font-bold text-white tracking-tight">
                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="text-text-muted text-[13px] mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Threats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card-static overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <span className="text-sm font-semibold text-white">Ameaças Recentes</span>
            </div>
            <span className="text-[11px] text-text-muted font-medium">Últimos eventos</span>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-neon">
                <thead>
                  <tr>
                    <th>IP</th>
                    <th>Ameaça</th>
                    <th>Domínio</th>
                    <th>Tempo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentThreats.length > 0 ? (
                    recentThreats.map((threat, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 + i * 0.04 }}
                      >
                        <td className="font-mono text-[12px]">{threat.ip_address}</td>
                        <td>
                          <span
                            className={`text-[12px] font-medium ${
                              threat.action === "blocked" ? "text-danger" : "text-neon"
                            }`}
                          >
                            {threat.threat_type || "Direto"}
                          </span>
                        </td>
                        <td className="text-text-muted text-[12px]">
                          {threat.domains?.domain_url || "—"}
                        </td>
                        <td>
                          <span className="text-text-muted text-[12px] font-mono">
                            {formatTimeAgo(threat.created_at)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                              threat.action === "blocked"
                                ? "bg-danger/10 text-danger"
                                : "bg-neon/10 text-neon"
                            }`}
                          >
                            {threat.action === "blocked" ? "Blocked" : "Allowed"}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-text-muted text-sm">
                        Nenhuma ameaça registrada. Seu escudo está limpo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Info Column */}
        <div className="flex flex-col gap-5">
          {/* Status Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card-static overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-neon" />
              <span className="text-sm font-semibold text-white">Status do Sistema</span>
            </div>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon/[0.06] border border-neon/15 mb-4 animate-glow-pulse">
                <Shield className="w-7 h-7 text-neon" />
              </div>
              <h3 className="font-semibold text-white mb-1.5">Proteção Ativa</h3>
              <p className="text-[13px] text-text-muted leading-relaxed">
                Seus funis estão blindados contra tráfego fraudulento e espionagem.
              </p>
            </div>
          </motion.div>

          {/* Quick API Key */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card-static overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-neon" />
              <span className="text-sm font-semibold text-white">Sua API Key</span>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-text-muted mb-3.5 leading-relaxed">
                Use esta chave para autenticar suas integrações.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white/[0.02] px-3 py-2.5 font-mono text-[11px] text-text-secondary truncate border border-white/[0.06] rounded-lg">
                  {apiKey || "Carregando..."}
                </code>
                <button
                  onClick={copyApiKey}
                  className="p-2.5 rounded-lg border border-white/[0.06] hover:border-neon/20 hover:bg-neon/[0.04] transition-all shrink-0"
                  title="Copiar API Key"
                  id="copy-api-key"
                >
                  {apiKeyCopied ? (
                    <Check className="w-4 h-4 text-neon" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-muted" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
