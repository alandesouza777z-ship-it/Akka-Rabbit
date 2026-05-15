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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Domain {
  id: string;
  domain_url: string;
  verification_token: string;
  status: string;
  shield_enabled: boolean;
  created_at: string;
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [showScriptForDomain, setShowScriptForDomain] = useState<string | null>(null);

  const fetchDomains = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("domains")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setDomains(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const addDomain = async () => {
    if (!newDomain.trim()) return;
    setAdding(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: insertError } = await supabase.from("domains").insert({
        user_id: user.id,
        domain_url: newDomain.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""),
        status: "pending",
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setNewDomain("");
      setShowAddModal(false);
      fetchDomains();
    } catch {
      setError("Erro ao adicionar domínio.");
    } finally {
      setAdding(false);
    }
  };

  const deleteDomain = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este domínio?")) return;

    const supabase = createClient();
    await supabase.from("domains").delete().eq("id", id);
    fetchDomains();
  };

  const toggleShield = async (id: string, enabled: boolean) => {
    const supabase = createClient();
    await supabase
      .from("domains")
      .update({ shield_enabled: !enabled })
      .eq("id", id);
    fetchDomains();
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setShowScriptForDomain(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const statusColors: Record<string, string> = {
    active: "text-neon bg-neon/10",
    inactive: "text-text-muted bg-white/5",
    pending: "text-warning bg-warning/10",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl font-bold text-white">
            <span className="text-neon">&gt;</span> Domínios Protegidos
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Gerencie os domínios sob proteção do Shield
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-neon-filled flex items-center gap-2 text-xs"
          id="add-domain-btn"
        >
          <Plus className="w-4 h-4" />
          Adicionar Domínio
        </button>
      </div>

      {/* Tutorial Banner with Premium Illustrations */}
      <div className="glass-card rounded-sm p-6 mb-6">
        <h3 className="font-mono text-white text-lg font-bold flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-neon" />
          Guia de Integração Rápida
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="flex flex-col relative">
            <div className="absolute top-4 left-1/2 w-full h-[1px] bg-border-neon/30 hidden md:block" style={{ transform: 'translateX(50%)' }}></div>
            <div className="w-12 h-12 rounded-sm bg-black border border-neon/50 flex items-center justify-center mb-4 z-10 relative shadow-[0_0_15px_rgba(0,255,65,0.15)] mx-auto md:mx-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
                <circle cx="12" cy="10" r="3"></circle>
                <line x1="12" y1="7" x2="12" y2="13"></line>
                <line x1="9" y1="10" x2="15" y2="10"></line>
              </svg>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-neon text-black rounded-full text-[10px] font-bold flex items-center justify-center font-mono">1</div>
            </div>
            <h4 className="font-mono text-sm text-white font-bold mb-2 text-center md:text-left">Cadastre o Domínio</h4>
            <p className="text-text-muted text-xs leading-relaxed text-center md:text-left">
              Clique em <span className="text-neon">Adicionar Domínio</span> e insira a URL do seu funil (ex: sua-oferta.com).
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col relative">
            <div className="absolute top-4 left-1/2 w-full h-[1px] bg-border-neon/30 hidden md:block" style={{ transform: 'translateX(50%)' }}></div>
            <div className="w-12 h-12 rounded-sm bg-black border border-neon/50 flex items-center justify-center mb-4 z-10 relative shadow-[0_0_15px_rgba(0,255,65,0.15)] mx-auto md:mx-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                <polyline points="13 13 15 15 19 11"></polyline>
              </svg>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-neon text-black rounded-full text-[10px] font-bold flex items-center justify-center font-mono">2</div>
            </div>
            <h4 className="font-mono text-sm text-white font-bold mb-2 text-center md:text-left">Copie o Script</h4>
            <p className="text-text-muted text-xs leading-relaxed text-center md:text-left">
              Clique no ícone de cópia ao lado do Token para revelar seu código de proteção exclusivo.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col relative">
            <div className="w-12 h-12 rounded-sm bg-black border border-neon/50 flex items-center justify-center mb-4 z-10 relative shadow-[0_0_15px_rgba(0,255,65,0.15)] mx-auto md:mx-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
                <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="4 4"></line>
              </svg>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-neon text-black rounded-full text-[10px] font-bold flex items-center justify-center font-mono">3</div>
            </div>
            <h4 className="font-mono text-sm text-white font-bold mb-2 text-center md:text-left">Injete na Página</h4>
            <p className="text-text-muted text-xs leading-relaxed text-center md:text-left">
              Cole no <code className="text-neon text-[10px]">&lt;head&gt;</code> do site. O status mudará para <span className="text-neon">Active</span> no 1º acesso!
            </p>
          </div>

        </div>
      </div>

      {/* Domain List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-neon animate-spin" />
        </div>
      ) : domains.length === 0 ? (
        <div className="glass-card rounded-sm p-12 text-center">
          <Globe className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="font-mono text-white font-semibold mb-2">
            Nenhum domínio registrado
          </h3>
          <p className="text-text-muted text-sm mb-6">
            Adicione seu primeiro domínio para ativar a proteção Shield.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-neon-filled inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Domínio
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {domains.map((domain, i) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-sm p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Domain Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-4 h-4 text-neon" />
                    <span className="font-mono text-white font-semibold">
                      {domain.domain_url}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded-sm ${
                        statusColors[domain.status] || statusColors.pending
                      }`}
                    >
                      {domain.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-text-muted">
                      TOKEN:
                    </span>
                    <code className="font-mono text-[10px] text-text-secondary bg-bg-secondary px-2 py-0.5 border border-border-neon">
                      {domain.verification_token.slice(0, 16)}...
                    </code>
                    <button
                      onClick={() => copyToken(domain.verification_token)}
                      className="p-1 hover:text-neon transition-colors"
                      title="Copiar token"
                    >
                      {copiedToken === domain.verification_token ? (
                        <Check className="w-3 h-3 text-neon" />
                      ) : (
                        <Copy className="w-3 h-3 text-text-muted" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleShield(domain.id, domain.shield_enabled)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-mono border transition-all ${
                      domain.shield_enabled
                        ? "border-neon text-neon bg-neon/10"
                        : "border-text-muted text-text-muted"
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    {domain.shield_enabled ? "Shield ON" : "Shield OFF"}
                  </button>
                  <button
                    onClick={() => deleteDomain(domain.id)}
                    className="p-2 border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
                    title="Remover domínio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Domain Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-sm p-6 w-full max-w-md border border-border-neon-strong"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-mono text-white font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-neon" />
                  Adicionar Domínio
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-text-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 border border-danger/30 bg-danger/10 text-danger text-sm font-mono">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="font-mono text-text-muted text-xs uppercase tracking-wider mb-2 block">
                  URL do Domínio
                </label>
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="exemplo.com"
                  className="input-neon"
                  id="domain-input"
                />
                <p className="font-mono text-text-muted text-[10px] mt-2">
                  Insira apenas o domínio sem http:// ou https://
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-neon flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={addDomain}
                  disabled={adding || !newDomain.trim()}
                  className="btn-neon-filled flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  id="confirm-add-domain"
                >
                  {adding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Adicionar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Script Installation Modal */}
      <AnimatePresence>
        {showScriptForDomain && domains.some(d => d.verification_token === showScriptForDomain) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-sm p-6 w-full max-w-2xl border border-border-neon-strong relative"
            >
              <button
                onClick={() => setShowScriptForDomain(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-neon" />
                <h2 className="font-mono text-white font-bold text-lg">
                  Como Instalar a Proteção
                </h2>
              </div>
              
              <p className="text-text-secondary text-sm mb-4">
                Copie o script abaixo e cole-o dentro da tag <code className="text-neon">&lt;head&gt;</code> da sua página (Landing Page, VSL, etc).
                Ele já está configurado com a sua API Key e URL do domínio.
              </p>
              
              <div className="relative">
                <pre className="bg-black border border-border-neon p-4 rounded-sm overflow-x-auto text-[11px] font-mono text-text-muted leading-relaxed">
{`<script>
  (async function() {
    try {
      const res = await fetch('https://${typeof window !== 'undefined' ? window.location.host : 'seusite.com'}/api/v1/shield', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'COLE_SUA_API_KEY_AQUI' 
        },
        body: JSON.stringify({ domain: window.location.hostname })
      });
      const data = await res.json();
      if (data.blocked) {
        // Redireciona bots e espiões para a página de bloqueio
        window.location.href = 'https://ta-indo-aonde-show.vercel.app/'; 
      }
    } catch(e) {}
  })();
</script>`}
                </pre>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowScriptForDomain(null)}
                  className="btn-neon-filled"
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
