"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Activity,
  TrendingUp,
  Eye,
  Cpu,
  Clock,
  Copy,
  Check,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [apiKey, setApiKey] = useState("Carregando...");
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
      setRecentThreats(logs.slice(0, 5));
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

  const statCards = [
    {
      label: "Ameaças Bloqueadas",
      value: stats.blocked,
      icon: Shield,
      color: "text-danger",
      bgColor: "bg-danger/10",
      borderColor: "border-danger/30",
    },
    {
      label: "Acessos Legítimos",
      value: stats.allowed,
      icon: CheckCircle2,
      color: "text-neon",
      bgColor: "bg-neon/10",
      borderColor: "border-neon/30",
    },
    {
      label: "Domínios Ativos",
      value: stats.domains,
      icon: Globe,
      color: "text-neon",
      bgColor: "bg-neon/10",
      borderColor: "border-neon/30",
    },
    {
      label: "Uptime",
      value: stats.uptime,
      icon: Activity,
      color: "text-neon",
      bgColor: "bg-neon/10",
      borderColor: "border-neon/30",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-neon animate-spin" />
      </div>
    );
  }

  // Format date helper
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seg atrás`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} horas atrás`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl font-bold text-white">
            <span className="text-neon">&gt;</span> Shield Overview
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Monitoramento em tempo real da sua proteção
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot status-active animate-pulse-neon" />
          <span className="font-mono text-neon text-xs">LIVE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-5 rounded-sm border ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${stat.bgColor} flex items-center justify-center rounded-sm`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-text-muted text-xs mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Threats */}
        <div className="lg:col-span-2 glass-card rounded-sm">
          <div className="p-4 border-b border-border-neon flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <span className="font-mono text-sm font-semibold text-white">
              Ameaças Recentes
            </span>
            <span className="ml-auto font-mono text-[10px] text-text-muted">
              Últimos Logs
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="table-neon">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Tipo</th>
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="text-text-secondary">{threat.ip_address}</td>
                      <td>
                        <span
                          className={
                            threat.threat_type === "Bot" || threat.threat_type === "Crawler Bypass" || threat.action === "allowed"
                              ? "text-neon"
                              : "text-danger"
                          }
                        >
                          {threat.threat_type || "Acesso Direto"}
                        </span>
                      </td>
                      <td className="text-text-muted">{threat.domains?.domain_url || "Desconhecido"}</td>
                      <td>
                        <span className="flex items-center gap-1 text-text-muted">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(threat.created_at)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold font-mono uppercase ${
                            threat.action === "blocked"
                              ? "bg-danger/20 text-danger"
                              : "bg-neon/20 text-neon"
                          }`}
                        >
                          {threat.action}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-text-muted font-mono text-xs">
                      Nenhuma ameaça registrada ainda. Seu escudo está limpo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-6">
          {/* Status Panel */}
          <div className="glass-card rounded-sm">
            <div className="p-4 border-b border-border-neon flex items-center gap-2">
              <Eye className="w-4 h-4 text-neon" />
              <span className="font-mono text-sm font-semibold text-white">
                Status do Sistema
              </span>
            </div>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon/10 border border-neon/30 mb-4">
                <Shield className="w-8 h-8 text-neon" />
              </div>
              <h3 className="font-mono font-bold text-white mb-1">Proteção Ativa</h3>
              <p className="text-xs text-text-muted">
                Seus funis estão blindados contra tráfego fraudulento.
              </p>
            </div>
          </div>

          {/* Quick API Key */}
          <div className="glass-card rounded-sm">
            <div className="p-4 border-b border-border-neon flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neon" />
              <span className="font-mono text-sm font-semibold text-white">
                Sua API Key
              </span>
            </div>
            <div className="p-4">
              <p className="text-xs text-text-muted mb-3">
                Use esta chave para autenticar suas integrações e webhooks.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-bg-secondary p-2 font-mono text-[10px] sm:text-xs text-text-secondary truncate border border-border-neon">
                  {apiKey}
                </code>
                <button
                  onClick={copyApiKey}
                  className="p-2 border border-border-neon hover:border-neon transition-colors shrink-0"
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
          </div>
        </div>
      </div>
    </div>
  );
}
