"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Lock,
  CheckCircle2,
  Loader2,
  Shield,
  Star,
  Gem,
  Crown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Milestone {
  id: string;
  tier: number;
  label: string;
  sublabel: string;
  target: number;
  icon: React.ElementType;
  color: string;
  glowColor: string;
  bgGradient: string;
  borderColor: string;
}

const milestones: Milestone[] = [
  {
    id: "emerald",
    tier: 1,
    label: "Membro Emerald",
    sublabel: "10 Milhões de ameaças mitigadas",
    target: 10_000_000,
    icon: Shield,
    color: "text-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.4)",
    bgGradient: "from-emerald-500/10 to-emerald-500/5",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "ruby",
    tier: 2,
    label: "Membro Ruby",
    sublabel: "25 Milhões de ameaças mitigadas",
    target: 25_000_000,
    icon: Gem,
    color: "text-red-400",
    glowColor: "rgba(248, 113, 113, 0.4)",
    bgGradient: "from-red-500/10 to-red-500/5",
    borderColor: "border-red-500/20",
  },
  {
    id: "gold",
    tier: 3,
    label: "Membro Gold Rabbit",
    sublabel: "50 Milhões de ameaças mitigadas — Apex Tier",
    target: 50_000_000,
    icon: Crown,
    color: "text-amber-400",
    glowColor: "rgba(251, 191, 36, 0.4)",
    bgGradient: "from-amber-500/10 to-amber-500/5",
    borderColor: "border-amber-500/20",
  },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function RewardsPage() {
  const [totalMitigated, setTotalMitigated] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { count } = await supabase
      .from("security_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("action", "blocked");

    setTotalMitigated(count || 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Find the next milestone
  const nextMilestone = milestones.find((m) => totalMitigated < m.target) || milestones[milestones.length - 1];
  const overallProgress = Math.min((totalMitigated / nextMilestone.target) * 100, 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-neon animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1100px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-amber-400" />
          Milestones & Enterprise Rewards
        </h1>
        <p className="text-text-muted text-sm mt-1.5">
          Acompanhe seu progresso e desbloqueie recompensas exclusivas baseadas em ameaças mitigadas.
        </p>
      </div>

      {/* Progress Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-static p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white">Progresso Global</p>
            <p className="text-[13px] text-text-muted mt-0.5">
              <span className="font-mono text-neon font-semibold">{formatNumber(totalMitigated)}</span>
              {" "}de{" "}
              <span className="font-mono font-medium text-text-secondary">{formatNumber(nextMilestone.target)}</span>
              {" "}ameaças mitigadas
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-white">{overallProgress.toFixed(1)}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.04]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, rgba(0,255,65,0.15) 0%, rgba(0,255,65,0.8) 100%)",
            }}
          />
          {/* Glowing leading edge */}
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: `${Math.max(overallProgress - 1, 0)}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="absolute top-0 bottom-0 w-4 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0,255,65,0.9) 0%, transparent 70%)",
              filter: "blur(2px)",
            }}
          />
        </div>

        {/* Milestone markers on the bar */}
        <div className="flex items-center justify-between mt-3">
          {milestones.map((m) => {
            const unlocked = totalMitigated >= m.target;
            return (
              <div key={m.id} className="flex items-center gap-1.5">
                {unlocked ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${m.color}`} />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-white/10" />
                )}
                <span className={`text-[11px] font-medium ${unlocked ? m.color : "text-text-muted"}`}>
                  {formatNumber(m.target)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Milestone Cards Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {milestones.map((milestone, i) => {
          const unlocked = totalMitigated >= milestone.target;
          const inProgress = !unlocked && (i === 0 || totalMitigated >= milestones[i - 1].target);
          const locked = !unlocked && !inProgress;
          const progress = inProgress
            ? Math.min((totalMitigated / milestone.target) * 100, 100)
            : unlocked
            ? 100
            : 0;

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-xl border transition-all duration-500 ${
                unlocked
                  ? `${milestone.borderColor} bg-gradient-to-b ${milestone.bgGradient}`
                  : locked
                  ? "border-white/[0.04] bg-white/[0.01] opacity-40 grayscale"
                  : `border-white/[0.06] bg-white/[0.02]`
              }`}
              style={
                unlocked
                  ? { boxShadow: `0 0 40px ${milestone.glowColor.replace("0.4", "0.12")}, 0 0 80px ${milestone.glowColor.replace("0.4", "0.06")}` }
                  : undefined
              }
            >
              {/* Lock overlay */}
              {locked && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <Lock className="w-8 h-8 text-white/20" />
                </div>
              )}

              <div className="p-6">
                {/* Tier label */}
                <div className="flex items-center justify-between mb-5">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${unlocked ? milestone.color : "text-text-muted"}`}>
                    Tier {milestone.tier}
                  </span>
                  {unlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neon/10 text-neon">
                      <Sparkles className="w-3 h-3" />
                      UNLOCKED
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                  unlocked ? `bg-gradient-to-b ${milestone.bgGradient}` : "bg-white/[0.03]"
                } border ${unlocked ? milestone.borderColor : "border-white/[0.06]"}`}>
                  <milestone.icon className={`w-7 h-7 ${unlocked ? milestone.color : "text-text-muted"}`} />
                </div>

                {/* Info */}
                <h3 className={`text-lg font-semibold mb-1.5 ${unlocked ? "text-white" : "text-text-secondary"}`}>
                  {milestone.label}
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed mb-5">
                  {milestone.sublabel}
                </p>

                {/* Progress bar for in-progress milestone */}
                {inProgress && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-text-muted">
                        {formatNumber(totalMitigated)} / {formatNumber(milestone.target)}
                      </span>
                      <span className="text-[11px] font-mono text-neon font-semibold">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                        className="h-full bg-gradient-to-r from-neon/30 to-neon rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Unlocked badge */}
                {unlocked && (
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className={`w-4 h-4 ${milestone.color}`} />
                    <span className={`text-[13px] font-medium ${milestone.color}`}>
                      Plaquinha Desbloqueada
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
