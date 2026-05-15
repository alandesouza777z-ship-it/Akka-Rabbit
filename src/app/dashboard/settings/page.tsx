"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Settings, User, Shield, Save, Loader2, CheckCircle2, Zap, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("starter");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setEmail(user.email || "");
    const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
    if (data) {
      setFullName(data.full_name || "");
      setPlan(data.plan_tier || "starter");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("users").update({ full_name: fullName }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 text-neon animate-spin" />
    </div>
  );

  const planInfo: Record<string, { domains: number; requests: string; color: string; bg: string }> = {
    starter: { domains: 1, requests: "5.000/mês", color: "text-text-secondary", bg: "bg-white/[0.04]" },
    pro: { domains: 5, requests: "50.000/mês", color: "text-neon", bg: "bg-neon/[0.06]" },
    enterprise: { domains: 999, requests: "Ilimitado", color: "text-amber-400", bg: "bg-amber-400/[0.06]" },
  };

  const currentPlan = planInfo[plan] || planInfo.starter;

  return (
    <div className="space-y-6 max-w-[700px]">
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-neon" />
          Configurações
        </h1>
        <p className="text-text-muted text-sm mt-1.5">Gerencie seu perfil e configurações da conta</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-6">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/15">
            <User className="w-4 h-4 text-neon" />
          </div>
          <span className="text-sm font-semibold text-white">Perfil</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[13px] text-text-muted font-medium mb-2 block">Nome Completo</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-neon" id="settings-name" />
          </div>
          <div>
            <label className="text-[13px] text-text-muted font-medium mb-2 block">Email</label>
            <input type="email" value={email} disabled className="input-neon opacity-40 cursor-not-allowed" />
          </div>
          <button onClick={saveProfile} disabled={saving} className="btn-neon-filled flex items-center gap-2 disabled:opacity-50" id="save-settings">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><CheckCircle2 className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
          </button>
        </div>
      </motion.div>

      {/* Plan */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-6">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/15">
            <Shield className="w-4 h-4 text-neon" />
          </div>
          <span className="text-sm font-semibold text-white">Plano Atual</span>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className={`inline-flex items-center gap-1.5 text-lg font-bold uppercase ${currentPlan.color}`}>
            <Zap className="w-4 h-4" />
            {plan}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-[12px] text-text-muted font-medium mb-1">Domínios</div>
            <div className="font-mono text-xl font-bold text-white">{planInfo[plan]?.domains || 1}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-[12px] text-text-muted font-medium mb-1">Requisições</div>
            <div className="font-mono text-xl font-bold text-white">{planInfo[plan]?.requests || "5.000/mês"}</div>
          </div>
        </div>

        <button className="btn-neon flex items-center gap-2 text-[13px]">
          <ArrowUpRight className="w-3.5 h-3.5" />
          Upgrade de Plano
        </button>
      </motion.div>
    </div>
  );
}
