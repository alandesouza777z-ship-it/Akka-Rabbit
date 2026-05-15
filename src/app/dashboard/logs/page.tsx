"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SecurityLog {
  id: string;
  ip_address: string;
  user_agent: string | null;
  action: string;
  threat_type: string | null;
  country: string | null;
  created_at: string;
  domains?: { domain_url: string } | null;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("security_logs")
      .select("*, domains(domain_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (filter === "blocked") {
      query = query.eq("action", "blocked");
    } else if (filter === "allowed") {
      query = query.eq("action", "allowed");
    }

    const { data } = await query;
    setLogs(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const actionIcons: Record<string, typeof Shield> = {
    blocked: AlertTriangle,
    allowed: CheckCircle2,
    bypassed: Shield,
  };

  const actionColors: Record<string, string> = {
    blocked: "text-danger bg-danger/10",
    allowed: "text-neon bg-neon/10",
    bypassed: "text-neon bg-neon/10",
  };

  // Stats calculation
  const blockedCount = logs.filter((l) => l.action === "blocked").length;
  const allowedCount = logs.filter((l) => l.action === "allowed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl font-bold text-white">
            <span className="text-neon">&gt;</span> Security Logs
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Histórico detalhado de todas as verificações de segurança
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="btn-neon flex items-center gap-2 text-xs"
          id="refresh-logs"
        >
          <RefreshCw className="w-3 h-3" />
          Atualizar
        </button>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-sm text-center">
          <div className="font-mono text-xl font-bold text-white">{logs.length}</div>
          <div className="text-text-muted text-xs">Total</div>
        </div>
        <div className="glass-card p-4 rounded-sm text-center border-danger/20">
          <div className="font-mono text-xl font-bold text-danger">{blockedCount}</div>
          <div className="text-text-muted text-xs">Bloqueados</div>
        </div>
        <div className="glass-card p-4 rounded-sm text-center border-neon/20">
          <div className="font-mono text-xl font-bold text-neon">{allowedCount}</div>
          <div className="text-text-muted text-xs">Permitidos</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-text-muted" />
        {["all", "blocked", "allowed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 font-mono text-xs border transition-all ${
              filter === f
                ? "border-neon text-neon bg-neon/10"
                : "border-border-neon text-text-muted hover:text-white"
            }`}
          >
            {f === "all" ? "Todos" : f === "blocked" ? "Bloqueados" : "Permitidos"}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-neon animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-card rounded-sm p-12 text-center">
          <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="font-mono text-white font-semibold mb-2">Nenhum log encontrado</h3>
          <p className="text-text-muted text-sm">
            Os logs aparecerão aqui quando o Shield processar requisições.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-neon">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Threat Type</th>
                  <th>Domínio</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const Icon = actionIcons[log.action] || Shield;
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold font-mono uppercase ${
                            actionColors[log.action] || ""
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {log.action}
                        </span>
                      </td>
                      <td className="text-text-secondary">{log.ip_address}</td>
                      <td>
                        <span className={log.action === "blocked" ? "text-danger" : "text-neon"}>
                          {log.threat_type || "—"}
                        </span>
                      </td>
                      <td className="text-text-muted">
                        {log.domains?.domain_url || "—"}
                      </td>
                      <td>
                        <span className="flex items-center gap-1 text-text-muted">
                          <Clock className="w-3 h-3" />
                          {formatDate(log.created_at)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
