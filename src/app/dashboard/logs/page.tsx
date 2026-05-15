"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Ban,
  ShieldCheck,
  ArrowDownUp,
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

/* ==================== SKELETON ==================== */
function LogsSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="skeleton w-16 h-5 rounded-md" />
          <div className="skeleton w-28 h-4 rounded" />
          <div className="skeleton w-24 h-4 rounded" />
          <div className="skeleton flex-1 h-4 rounded" />
          <div className="skeleton w-20 h-4 rounded" />
        </div>
      ))}
    </div>
  );
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

  const blockedCount = logs.filter((l) => l.action === "blocked").length;
  const allowedCount = logs.filter((l) => l.action === "allowed" || l.action === "bypassed").length;

  const filters = [
    { key: "all", label: "Todos", count: logs.length },
    { key: "blocked", label: "Bloqueados", count: blockedCount },
    { key: "allowed", label: "Permitidos", count: allowedCount },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-neon" />
            Security Logs
          </h1>
          <p className="text-text-muted text-sm mt-1.5">
            Histórico de todas as verificações de segurança
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="btn-neon flex items-center gap-2 text-[13px]"
          id="refresh-logs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </button>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-4 text-center">
          <div className="font-mono text-2xl font-bold text-white">{logs.length}</div>
          <div className="text-text-muted text-[12px] font-medium mt-1">Total</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card-static p-4 text-center">
          <div className="font-mono text-2xl font-bold text-danger">{blockedCount}</div>
          <div className="text-text-muted text-[12px] font-medium mt-1">Bloqueados</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-4 text-center">
          <div className="font-mono text-2xl font-bold text-neon">{allowedCount}</div>
          <div className="text-text-muted text-[12px] font-medium mt-1">Permitidos</div>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all ${
              filter === f.key
                ? "bg-neon/10 text-neon border border-neon/20"
                : "text-text-muted hover:text-white hover:bg-white/[0.03] border border-transparent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="glass-card-static overflow-hidden">
          <LogsSkeleton />
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-card-static p-16 text-center">
          <FileText className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold text-white mb-2">Nenhum log encontrado</h3>
          <p className="text-text-muted text-sm">
            Os logs aparecerão aqui quando o Shield processar requisições.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card-static overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="table-neon">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Ameaça</th>
                  <th>Domínio</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.015 }}
                  >
                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                          log.action === "blocked"
                            ? "bg-danger/10 text-danger"
                            : "bg-neon/10 text-neon"
                        }`}
                      >
                        {log.action === "blocked" ? (
                          <Ban className="w-3 h-3" />
                        ) : (
                          <ShieldCheck className="w-3 h-3" />
                        )}
                        {log.action === "blocked" ? "Blocked" : "Allowed"}
                      </span>
                    </td>
                    <td className="font-mono text-[12px]">{log.ip_address}</td>
                    <td>
                      <span className={`text-[12px] font-medium ${log.action === "blocked" ? "text-danger" : "text-neon"}`}>
                        {log.threat_type || "—"}
                      </span>
                    </td>
                    <td className="text-text-muted text-[12px]">
                      {log.domains?.domain_url || "—"}
                    </td>
                    <td>
                      <span className="text-text-muted text-[12px] font-mono">
                        {formatDate(log.created_at)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
