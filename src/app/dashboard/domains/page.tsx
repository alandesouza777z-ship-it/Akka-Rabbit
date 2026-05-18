"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Shield,
  X,
  Loader2,
  Zap,
  Link as LinkIcon,
  Crown,
  Share2,
  Code,
  Layers,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Domain {
  id: string;
  domain_url: string;
  verification_token: string;
  status: string;
  shield_enabled: boolean;
  checkout_url: string | null;
  vsl_url: string | null;
  safe_page_url: string | null;
  cloak_bots: boolean;
  honeypot_enabled: boolean;
  canvas_fingerprint: boolean;
  created_at: string;
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>("starter");

  // Form States (Matches the Premium Uploaded Design)
  const [domainUrl, setDomainUrl] = useState("");
  const [trafficSource, setTrafficSource] = useState("Facebook Ads");
  const [offerMethod, setOfferMethod] = useState<"shield" | "safepage">("shield");
  const [blackPageUrl, setBlackPageUrl] = useState("");
  const [safePageUrl, setSafePageUrl] = useState("");
  const [protectionMode, setProtectionMode] = useState<"auto" | "manual">("manual");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [vslUrl, setVslUrl] = useState("");
  const [honeypotEnabled, setHoneypotEnabled] = useState(false);
  const [canvasFingerprint, setCanvasFingerprint] = useState(false);

  const fetchDomains = useCallback(async (selectId?: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch user plan
    const { data: profile } = await supabase
      .from("users")
      .select("plan_tier")
      .eq("id", user.id)
      .single();
    if (profile) setUserPlan(profile.plan_tier);

    const { data } = await supabase
      .from("domains")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const fetchedDomains = data || [];
    setDomains(fetchedDomains);

    if (fetchedDomains.length > 0) {
      // Keep previous selection or select first
      const toSelect = selectId 
        ? fetchedDomains.find(d => d.id === selectId) 
        : fetchedDomains[0];
      handleSelectDomain(toSelect || fetchedDomains[0]);
    } else {
      setSelectedDomain(null);
      resetForm();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const handleSelectDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setDomainUrl(domain.domain_url);
    setBlackPageUrl(domain.checkout_url || "");
    setSafePageUrl(domain.safe_page_url || "");
    setOfferMethod(domain.cloak_bots ? "safepage" : "shield");
    setCheckoutUrl(domain.checkout_url || "");
    setVslUrl(domain.vsl_url || "");
    setHoneypotEnabled(domain.honeypot_enabled);
    setCanvasFingerprint(domain.canvas_fingerprint);
  };

  const resetForm = () => {
    setDomainUrl("");
    setBlackPageUrl("");
    setSafePageUrl("");
    setOfferMethod("shield");
    setCheckoutUrl("");
    setVslUrl("");
    setHoneypotEnabled(false);
    setCanvasFingerprint(false);
  };

  const handleCreateNew = () => {
    setSelectedDomain(null);
    resetForm();
  };

  const saveCampaign = async () => {
    if (!domainUrl.trim()) {
      setError("O nome/URL do domínio é obrigatório.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const formattedDomain = domainUrl.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

      const updateData = {
        domain_url: formattedDomain,
        checkout_url: blackPageUrl.trim() || null,
        safe_page_url: safePageUrl.trim() || null,
        cloak_bots: offerMethod === "safepage",
        honeypot_enabled: honeypotEnabled,
        canvas_fingerprint: canvasFingerprint,
        // Enterprise specific values
        vsl_url: vslUrl.trim() || null,
      };

      if (selectedDomain) {
        // Edit Mode
        const { error: updateError } = await supabase
          .from("domains")
          .update(updateData)
          .eq("id", selectedDomain.id);

        if (updateError) throw updateError;
        await fetchDomains(selectedDomain.id);
      } else {
        // Create Mode
        const { data: inserted, error: insertError } = await supabase
          .from("domains")
          .insert({
            user_id: user.id,
            status: "pending",
            ...updateData
          })
          .select()
          .single();

        if (insertError) throw insertError;
        await fetchDomains(inserted.id);
      }
      alert("Campanha de proteção salva com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar campanha.");
    } finally {
      setSaving(false);
    }
  };

  const deleteDomain = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este domínio?")) return;

    const supabase = createClient();
    await supabase.from("domains").delete().eq("id", id);
    await fetchDomains();
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const trafficSources = [
    { name: "Facebook Ads", icon: "🌐" },
    { name: "Google Ads", icon: "🔍" },
    { name: "TikTok Ads", icon: "🎵" },
    { name: "Kwai Ads", icon: "🧡" },
    { name: "Taboola", icon: "📰" },
    { name: "Outbrain", icon: "💡" },
    { name: "MGID", icon: "📊" },
    { name: "Outro", icon: "🔗" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-neon" />
            Configuração de Campanhas
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Proteja suas ofertas contra espionagem, clonadores e robôs analisadores.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="btn-neon-filled flex items-center gap-2 text-xs py-2.5 px-5"
        >
          <Plus className="w-4 h-4" />
          Nova Campanha
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Active Protections List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" /> Domínios Ativos ({domains.length})
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-neon animate-spin" />
            </div>
          ) : domains.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center border border-white/5 bg-white/[0.01]">
              <p className="text-xs text-text-muted leading-relaxed">Nenhum domínio cadastrado ainda. Use o painel ao lado para criar o seu primeiro!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {domains.map((dom) => (
                <button
                  key={dom.id}
                  onClick={() => handleSelectDomain(dom)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer
                    ${selectedDomain?.id === dom.id 
                      ? 'bg-neon/10 border-neon/50 shadow-[0_0_15px_rgba(0,255,65,0.05)]' 
                      : 'bg-black/40 border-white/5 hover:bg-white/[0.02] hover:border-white/10'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold text-white truncate max-w-[130px]">
                      {dom.domain_url}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded uppercase
                      ${dom.status === 'active' ? 'bg-neon/20 text-neon' : 'bg-warning/20 text-warning'}`}>
                      {dom.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-muted w-full">
                    <span className="font-mono text-[9px] opacity-75">
                      {dom.verification_token.slice(0, 8)}...
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${dom.shield_enabled ? 'bg-neon' : 'bg-red-500'}`} />
                      <span>{dom.shield_enabled ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Premium Campaign Configurator (Panda Style) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/[0.04] bg-[#07060E] relative overflow-hidden">
            
            {/* Dynamic Background Effect */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />

            {error && (
              <div className="flex items-center gap-3 p-4 mb-6 border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono rounded-xl">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              
              {/* 1. Nome da Campanha / Domínio */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-neon">&gt;</span> Nome / URL do Domínio *
                </label>
                <input
                  type="text"
                  value={domainUrl}
                  onChange={(e) => setDomainUrl(e.target.value)}
                  placeholder="Ex: minha-oferta.com"
                  className="w-full bg-[#111019] border border-white/5 hover:border-white/10 focus:border-neon rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all font-mono"
                />
              </div>

              {/* 2. Fonte de Tráfego */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                  🎯 Fonte de Tráfego
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {trafficSources.map((source) => (
                    <button
                      key={source.name}
                      onClick={() => setTrafficSource(source.name)}
                      className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-mono transition-all cursor-pointer
                        ${trafficSource === source.name
                          ? 'border-neon bg-neon/5 text-white font-bold shadow-[0_0_15px_rgba(0,255,65,0.05)]'
                          : 'border-white/5 bg-[#111019] text-text-muted hover:border-white/10 hover:text-white'}`}
                    >
                      <span className="text-sm">{source.icon}</span>
                      <span>{source.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Método de Oferta (Illustrated Cards) */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                  💻 Método de Oferta
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Card A: Proteção Blindada */}
                  <button
                    onClick={() => setOfferMethod("shield")}
                    className={`text-left rounded-2xl border overflow-hidden relative group transition-all duration-300 cursor-pointer flex flex-col h-[180px]
                      ${offerMethod === "shield"
                        ? 'border-neon shadow-[0_0_25px_rgba(0,255,65,0.08)] bg-neon/[0.02]'
                        : 'border-white/5 bg-[#111019] hover:border-white/10 opacity-70 hover:opacity-100'}`}
                  >
                    <div className="flex-1 w-full relative overflow-hidden">
                      <img 
                        src="/akkarabbit_protection_banner.png" 
                        alt="Proteção AkkaRabbit"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-black/10" />
                      
                      {/* Brand logos overlay */}
                      <div className="absolute top-3 left-3 flex gap-1">
                        <span className="text-[9px] bg-black/60 backdrop-blur border border-white/10 px-2 py-0.5 rounded text-white font-mono">Google</span>
                        <span className="text-[9px] bg-black/60 backdrop-blur border border-white/10 px-2 py-0.5 rounded text-white font-mono">TikTok</span>
                        <span className="text-[9px] bg-black/60 backdrop-blur border border-white/10 px-2 py-0.5 rounded text-white font-mono">Kwai</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between w-full">
                      <div>
                        <h4 className="text-xs font-bold text-white">Proteção AkkaRabbit</h4>
                        <p className="text-[9px] text-text-muted mt-0.5">Barrar espionagem e bots em tempo real</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border
                        ${offerMethod === "shield" ? 'border-neon bg-neon text-black' : 'border-white/20'}`}>
                        {offerMethod === "shield" && <Check className="w-2.5 h-2.5 font-bold" />}
                      </div>
                    </div>
                  </button>

                  {/* Card B: Pré-Página */}
                  <button
                    onClick={() => setOfferMethod("safepage")}
                    className={`text-left rounded-2xl border overflow-hidden relative group transition-all duration-300 cursor-pointer flex flex-col h-[180px]
                      ${offerMethod === "safepage"
                        ? 'border-neon shadow-[0_0_25px_rgba(0,255,65,0.08)] bg-neon/[0.02]'
                        : 'border-white/5 bg-[#111019] hover:border-white/10 opacity-70 hover:opacity-100'}`}
                  >
                    <div className="flex-1 w-full relative overflow-hidden">
                      <img 
                        src="/akkarabbit_safepage_banner.png" 
                        alt="Pré-Página"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-black/10" />
                      
                      {/* Brand logos overlay */}
                      <div className="absolute top-3 left-3 flex gap-1">
                        <span className="text-[9px] bg-black/60 backdrop-blur border border-white/10 px-2 py-0.5 rounded text-white font-mono">Facebook</span>
                        <span className="text-[9px] bg-black/60 backdrop-blur border border-white/10 px-2 py-0.5 rounded text-white font-mono">MGID</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between w-full">
                      <div>
                        <h4 className="text-xs font-bold text-white">Pré-Página (Safe Page)</h4>
                        <p className="text-[9px] text-text-muted mt-0.5">Direcionamento inteligente de robôs</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border
                        ${offerMethod === "safepage" ? 'border-neon bg-neon text-black' : 'border-white/20'}`}>
                        {offerMethod === "safepage" && <Check className="w-2.5 h-2.5 font-bold" />}
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* 4. Black Page & Safe Page Inputs (Side-by-side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Black Page Input */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-red-500 rounded-sm" /> Black Page (Oferta) *
                  </label>
                  <input
                    type="url"
                    value={blackPageUrl}
                    onChange={(e) => setBlackPageUrl(e.target.value)}
                    placeholder="https://www.sua-oferta.com/"
                    className="w-full bg-[#111019] border-l-2 border-l-red-500 border-t border-r border-b border-white/5 hover:border-white/10 focus:border-red-500 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                  <p className="text-[9px] text-text-muted">Link de destino final para onde os compradores reais irão.</p>
                </div>

                {/* Safe Page Input */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-neon rounded-sm" /> Safe Page (White) *
                  </label>
                  <input
                    type="url"
                    value={safePageUrl}
                    onChange={(e) => setSafePageUrl(e.target.value)}
                    placeholder="https://www.blog-saude.com/"
                    className="w-full bg-[#111019] border-l-2 border-l-neon border-t border-r border-b border-white/5 hover:border-white/10 focus:border-neon rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                  <p className="text-[9px] text-text-muted">Página limpa de aprovação onde crawlers de revisão e bots ficarão presos.</p>
                </div>

              </div>

              {/* 5. Modo de Proteção */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                  ⚙️ Modo de Proteção
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Option A: Automático */}
                  <button
                    onClick={() => setProtectionMode("auto")}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1
                      ${protectionMode === "auto"
                        ? 'border-neon bg-neon/[0.02] shadow-[0_0_15px_rgba(0,255,65,0.03)]'
                        : 'border-white/5 bg-[#111019] hover:border-white/10'}`}
                  >
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      ⚡ Automático
                    </span>
                    <span className="text-[10px] text-text-muted leading-relaxed">
                      URL fica no domínio do cloaker. Funciona instantaneamente com a maioria das páginas sem alterações.
                    </span>
                  </button>

                  {/* Option B: Manual */}
                  <button
                    onClick={() => setProtectionMode("manual")}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1
                      ${protectionMode === "manual"
                        ? 'border-neon bg-neon/[0.02] shadow-[0_0_15px_rgba(0,255,65,0.03)]'
                        : 'border-white/5 bg-[#111019] hover:border-white/10'}`}
                  >
                    <span className="text-xs font-bold text-neon flex items-center gap-1.5 font-mono">
                      📋 Manual (Código)
                    </span>
                    <span className="text-[10px] text-text-muted leading-relaxed">
                      URL abre direto na blackpage. Você cola o nosso script de proteção no head do site.
                    </span>
                  </button>

                </div>
              </div>

              {/* Enterprise Settings (Toggles) */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="font-mono text-xs text-yellow-500 font-bold uppercase tracking-wider">Arsenal Adicional (Enterprise)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-xl">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-white block">Canvas Fingerprinting</span>
                      <span className="text-[9px] text-text-muted block">Gera assinaturas de GPU para blindar emuladores.</span>
                    </div>
                    <button
                      onClick={() => setCanvasFingerprint(!canvasFingerprint)}
                      className={`w-10 h-5.5 rounded-full relative transition-colors shrink-0 ${canvasFingerprint ? 'bg-neon' : 'bg-black/60 border border-white/10'}`}
                    >
                      <span className={`absolute top-1 left-1 w-3.5 h-3.5 bg-white rounded-full transition-transform ${canvasFingerprint ? 'translate-x-4.5' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-xl">
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-bold text-white block">Honeypot Activo</span>
                      <span className="text-[9px] text-text-muted block">Injeta armadilhas invisíveis de código para pegar scrapers.</span>
                    </div>
                    <button
                      onClick={() => setHoneypotEnabled(!honeypotEnabled)}
                      className={`w-10 h-5.5 rounded-full relative transition-colors shrink-0 ${honeypotEnabled ? 'bg-neon' : 'bg-black/60 border border-white/10'}`}
                    >
                      <span className={`absolute top-1 left-1 w-3.5 h-3.5 bg-white rounded-full transition-transform ${honeypotEnabled ? 'translate-x-4.5' : ''}`} />
                    </button>
                  </div>
                </div>

                {userPlan === "enterprise" && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-yellow-500 uppercase tracking-wider block">Link de Retaliação (Checkout)</label>
                      <input
                        type="text"
                        value={checkoutUrl}
                        onChange={(e) => setCheckoutUrl(e.target.value)}
                        placeholder="Ex: https://pay.hotmart.com/..."
                        className="w-full bg-[#111019] border border-yellow-500/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-500 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-yellow-500 uppercase tracking-wider block">Iframe VSL Oculto (Dinâmico)</label>
                      <input
                        type="text"
                        value={vslUrl}
                        onChange={(e) => setVslUrl(e.target.value)}
                        placeholder="Ex: <iframe src='https://vturb...' />"
                        className="w-full bg-[#111019] border border-yellow-500/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-500 transition-all font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Save Campaign & Delete */}
              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center">
                {selectedDomain ? (
                  <button
                    onClick={() => deleteDomain(selectedDomain.id)}
                    className="text-xs text-red-500 hover:text-red-400 font-mono hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Deletar Campanha
                  </button>
                ) : (
                  <div />
                )}
                
                <button
                  onClick={saveCampaign}
                  disabled={saving || !domainUrl.trim()}
                  className="btn-neon-filled text-xs py-3 px-8 font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Salvar Campanha de Proteção
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* 6. Code Script Generator Box (Panda Style output) */}
          {selectedDomain && protectionMode === "manual" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 md:p-8 border border-white/[0.04] bg-[#07060E] space-y-4"
            >
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-neon" />
                <h3 className="text-white font-mono text-sm font-bold">
                  &lt;&gt; Cole este código no &lt;head&gt; da sua blackpage
                </h3>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                O código inclui: limpeza de URL, detecção de devtools e bloqueio de clique-direito. Clique abaixo para copiar.
              </p>

              <div className="relative">
                <pre className="bg-black/60 border border-white/5 p-4 rounded-xl max-h-60 overflow-y-auto overflow-x-auto text-[11px] font-mono text-text-muted leading-relaxed custom-scrollbar relative">
                  <button
                    onClick={() => copyToken(selectedDomain.verification_token)}
                    className="absolute top-4 right-4 bg-white/5 border border-white/10 hover:border-white/20 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors flex items-center gap-1.5"
                  >
                    {copiedToken === selectedDomain.verification_token ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-neon" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar
                      </>
                    )}
                  </button>
{`<script>
  /* AkkaRabbit Secure Core v3.0 - Behavioral Biometrics */
  (async function(){
    let h=0; let isB=false; let trk=[];
    window.addEventListener('mousemove',(e)=>{
      h++; if(trk.length<10) trk.push(Date.now());
      if(trk.length>3 && (trk[trk.length-1]-trk[trk.length-2] === 0)) isB=true;
    });
    window.addEventListener('touchstart',()=>h++);
    
    let cv="none";
    try{const c=document.createElement('canvas');const ctx=c.getContext('2d');ctx.fillText('AkkaRabbit',-20,0);cv=c.toDataURL().slice(-50);}catch(e){}

    try {
      const res = await fetch('https://${typeof window !== 'undefined' ? window.location.host : 'seusite.com'}/api/v1/shield', {
        method:'POST', headers:{'Content-Type':'application/json','x-api-key':'${selectedDomain.verification_token}'},
        body:JSON.stringify({domain:window.location.hostname, cv:cv, beh: isB})
      });
      const d = await res.json();
      if(d.blocked || isB) { window.location.href = window.location.origin + '/ta-indo-aonde-show'; return; }
      if(d.hijack && d.safe_page) { window.location.replace(d.safe_page); return; }

      if(d.ip) {
        const c=document.createElement('canvas');c.width=200;c.height=100;const ctx=c.getContext('2d');
        ctx.fillStyle='rgba(0,0,0,0.01)';ctx.font='10px Arial';ctx.fillText(d.ip+'|'+window.location.hostname,10,50);
        const st=document.createElement('style');st.innerHTML='body::after{content:"";position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;background-image:url('+c.toDataURL()+');}';
        document.head.appendChild(st);
      }

      if(d.vsl_url) {
        document.querySelectorAll('[data-akka="vsl"]').forEach(el=>el.innerHTML=d.vsl_url);
      }

      if(d.inject_checkout && d.checkout_url) {
        document.querySelectorAll('[data-akka="buy"]').forEach(el=>{
          if(el.tagName==='A') el.href=d.checkout_url;
          el.addEventListener('click',e=>{
            if(h<2){e.preventDefault();alert('Security check failed.');return;}
            if(el.tagName!=='A'){e.preventDefault();window.location.href=d.checkout_url;}
          });
        });
      }

      if(d.hijack && d.checkout_url) {
        document.querySelectorAll('a[href]').forEach(el=>{
          if(/hotmart|kiwify|eduzz|monetizze|pay|checkout|comprar/i.test(el.href)) el.href=d.checkout_url;
        });
        document.addEventListener('click',e=>{
          let t=e.target.closest('button, a, [role="button"]');
          if(!t)return; let txt=(t.innerText||t.id||t.className||'').toLowerCase();
          if(/comprar|pix|checkout|pagar|finalizar|carrinho/i.test(txt)){
            e.preventDefault();e.stopPropagation();window.location.href=d.checkout_url;
          }
        },true);
      }
    }catch(e){}
  })();
</script>`}
                </pre>
              </div>

              {/* Enterprise Dead Button Instructions */}
              {userPlan === "enterprise" && (
                <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="font-mono text-xs text-yellow-500 font-bold uppercase">Técnica Botão Morto (Enterprise)</span>
                  </div>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    Para proteção máxima contra cópias de site, adicione o atributo <code className="text-neon">data-akka=&quot;buy&quot;</code> nos seus botões de compra e <strong className="text-white">NÃO coloque o link de checkout diretamente no HTML</strong>. O AkkaRabbit irá injetar o link automaticamente somente após validar o visitante.
                  </p>
                  <pre className="bg-black/60 border border-white/5 p-3 rounded-lg text-[10px] font-mono text-yellow-500/80 leading-relaxed overflow-x-auto">
{`<!-- Exemplo de Botão Morto -->
<a href="#" data-akka="buy" class="btn-comprar">
  COMPRAR AGORA
</a>

<!-- Ou com botão: -->
<button data-akka="buy" class="btn-comprar">
  GERAR PIX
</button>`}
                  </pre>
                  <p className="text-text-muted text-[9px]">
                    Se o espião apagar o script, os botões ficarão mortos (sem link). Se o espião copiar o script, a retaliação sequestra os botões dele e direciona as comissões para você.
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}
