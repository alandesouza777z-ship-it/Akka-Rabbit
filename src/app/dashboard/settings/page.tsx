"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Settings, User, Shield, Save, Loader2, CheckCircle2 } from "lucide-react";
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

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-neon animate-spin" /></div>;

  const planInfo: Record<string, { domains: number; requests: string }> = {
    starter: { domains: 1, requests: "5.000/mês" },
    pro: { domains: 5, requests: "50.000/mês" },
    enterprise: { domains: 999, requests: "Ilimitado" },
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-mono text-xl font-bold text-white"><span className="text-neon">&gt;</span> Configurações</h1>
        <p className="text-text-muted text-sm mt-1">Gerencie seu perfil e configurações da conta</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-4 h-4 text-neon" />
          <span className="font-mono text-sm font-semibold text-white">Perfil</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="font-mono text-text-muted text-xs uppercase tracking-wider mb-2 block">Nome</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-neon" id="settings-name" />
          </div>
          <div>
            <label className="font-mono text-text-muted text-xs uppercase tracking-wider mb-2 block">Email</label>
            <input type="email" value={email} disabled className="input-neon opacity-50 cursor-not-allowed" />
          </div>
          <button onClick={saveProfile} disabled={saving} className="btn-neon-filled flex items-center gap-2 disabled:opacity-50" id="save-settings">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><CheckCircle2 className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
          </button>
        </div>
      </motion.div>

      {/* Plan */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-4 h-4 text-neon" />
          <span className="font-mono text-sm font-semibold text-white">Plano Atual</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-2xl font-bold text-neon uppercase">{plan}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 border border-border-neon">
            <div className="font-mono text-xs text-text-muted mb-1">Domínios</div>
            <div className="font-mono text-lg text-white">{planInfo[plan]?.domains || 1}</div>
          </div>
          <div className="p-3 border border-border-neon">
            <div className="font-mono text-xs text-text-muted mb-1">Requisições</div>
            <div className="font-mono text-lg text-white">{planInfo[plan]?.requests || "5.000/mês"}</div>
          </div>
        </div>
        <button className="btn-neon flex items-center gap-2 text-xs">
          <Settings className="w-3 h-3" /> Upgrade de Plano
        </button>
      </motion.div>
    </div>
  );
}
