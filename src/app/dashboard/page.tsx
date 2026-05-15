"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

// ============================================
// Dashboard Overview — Mock Data for MVP
// ============================================

const stats = [
  {
    label: "Ameaças Bloqueadas",
    value: "2,847",
    change: "+12.5%",
    icon: Shield,
    color: "text-danger",
    bgColor: "bg-danger/10",
    borderColor: "border-danger/30",
  },
  {
    label: "Acessos Legítimos",
    value: "14,392",
    change: "+8.3%",
    icon: CheckCircle2,
    color: "text-neon",
    bgColor: "bg-neon/10",
    borderColor: "border-neon/30",
  },
  {
    label: "Domínios Ativos",
    value: "3",
    change: "",
    icon: Globe,
    color: "text-neon",
    bgColor: "bg-neon/10",
    borderColor: "border-neon/30",
  },
  {
    label: "Uptime",
    value: "99.97%",
    change: "",
    icon: Activity,
    color: "text-neon",
    bgColor: "bg-neon/10",
    borderColor: "border-neon/30",
  },
];

const recentThreats = [
  {
    ip: "185.220.101.45",
    type: "Spy Tool",
    domain: "oferta.exemplo.com",
    time: "2 min atrás",
    action: "blocked",
  },
  {
    ip: "104.248.50.123",
    type: "Data Center",
    domain: "vsl.exemplo.com",
    time: "5 min atrás",
    action: "blocked",
  },
  {
    ip: "23.105.170.89",
    type: "Webdriver",
    domain: "oferta.exemplo.com",
    time: "8 min atrás",
    action: "blocked",
  },
  {
    ip: "66.249.66.200",
    type: "Googlebot",
    domain: "oferta.exemplo.com",
    time: "12 min atrás",
    action: "allowed",
  },
  {
    ip: "91.108.4.15",
    type: "Turnstile Fail",
    domain: "checkout.exemplo.com",
    time: "15 min atrás",
    action: "blocked",
  },
];

const threatDistribution = [
  { type: "Spy Tools", count: 1240, percentage: 43 },
  { type: "Data Center", count: 890, percentage: 31 },
  { type: "Webdriver/Bot", count: 450, percentage: 16 },
  { type: "Turnstile Fail", count: 267, percentage: 10 },
];

export default function DashboardPage() {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [liveCounter, setLiveCounter] = useState(2847);

  // Simulate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText("ak_live_xxxxxxxxxxxxxxxxxxxx");
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
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
        {stats.map((stat, i) => (
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
              {stat.change && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-neon">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              {i === 0 ? liveCounter.toLocaleString() : stat.value}
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
              Últimas 24h
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
                {recentThreats.map((threat, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="text-text-secondary">{threat.ip}</td>
                    <td>
                      <span
                        className={
                          threat.type === "Googlebot"
                            ? "text-neon"
                            : "text-danger"
                        }
                      >
                        {threat.type}
                      </span>
                    </td>
                    <td className="text-text-muted">{threat.domain}</td>
                    <td>
                      <span className="flex items-center gap-1 text-text-muted">
                        <Clock className="w-3 h-3" />
                        {threat.time}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Threat Distribution */}
        <div className="glass-card rounded-sm">
          <div className="p-4 border-b border-border-neon flex items-center gap-2">
            <Eye className="w-4 h-4 text-neon" />
            <span className="font-mono text-sm font-semibold text-white">
              Distribuição
            </span>
          </div>
          <div className="p-4 space-y-4">
            {threatDistribution.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-text-secondary">
                    {item.type}
                  </span>
                  <span className="font-mono text-xs text-text-muted">
                    {item.count}
                  </span>
                </div>
                <div className="w-full h-2 bg-bg-secondary rounded-sm overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-full bg-neon/60"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick API Key */}
          <div className="p-4 border-t border-border-neon">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-3 h-3 text-neon" />
              <span className="font-mono text-[10px] text-text-muted uppercase">
                API Key
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-bg-secondary p-2 font-mono text-[10px] text-text-secondary truncate border border-border-neon">
                ak_live_xxxxxxxxxxxxxxxxxxxx
              </code>
              <button
                onClick={copyApiKey}
                className="p-2 border border-border-neon hover:border-neon transition-colors"
                title="Copiar API Key"
                id="copy-api-key"
              >
                {apiKeyCopied ? (
                  <Check className="w-3 h-3 text-neon" />
                ) : (
                  <Copy className="w-3 h-3 text-text-muted" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
