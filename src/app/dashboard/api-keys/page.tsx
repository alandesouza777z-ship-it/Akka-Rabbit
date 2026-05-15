"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Key, Copy, Check, RefreshCw, Shield, Code, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const fetchApiKey = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("users").select("api_key").eq("id", user.id).single();
    setApiKey(data?.api_key || "");
    setLoading(false);
  }, []);

  useEffect(() => { fetchApiKey(); }, [fetchApiKey]);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateKey = async () => {
    if (!confirm("Regenerar a API Key? A anterior será invalidada.")) return;
    setRegenerating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const newKey = crypto.randomUUID();
    await supabase.from("users").update({ api_key: newKey }).eq("id", user.id);
    setApiKey(newKey);
    setRegenerating(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-neon animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-xl font-bold text-white"><span className="text-neon">&gt;</span> API Keys</h1>
        <p className="text-text-muted text-sm mt-1">Gerencie suas chaves de API para integração do Shield</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-neon" />
          <span className="font-mono text-sm font-semibold text-white">Chave de API Principal</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <code className="flex-1 bg-bg-secondary p-3 font-mono text-sm text-neon border border-border-neon truncate">{apiKey}</code>
          <div className="flex gap-2">
            <button onClick={copyKey} className="btn-neon flex items-center gap-2 text-xs" id="copy-api-key">
              {copied ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
            </button>
            <button onClick={regenerateKey} disabled={regenerating} className="btn-neon flex items-center gap-2 text-xs border-danger/50 text-danger hover:bg-danger/10 disabled:opacity-50" id="regenerate-key">
              <RefreshCw className={`w-3 h-3 ${regenerating ? "animate-spin" : ""}`} /> Regenerar
            </button>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 border border-warning/20 bg-warning/5">
          <Shield className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <p className="font-mono text-[11px] text-warning/80">Mantenha sua API Key em segredo. Use variáveis de ambiente no servidor.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-4 h-4 text-neon" />
          <span className="font-mono text-sm font-semibold text-white">Código de Integração</span>
        </div>
        <p className="text-text-muted text-sm mb-4">Cole este script no head da sua Landing Page para ativar a proteção.</p>
        <pre className="bg-bg-secondary border border-border-neon p-4 overflow-x-auto font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{`<script>
(function(){
  fetch('/api/v1/shield',{
    method:'POST',
    headers:{'Content-Type':'application/json','X-API-Key':'${apiKey}'},
    body:JSON.stringify({domain:location.hostname})
  }).then(r=>r.json()).then(d=>{
    if(d.blocked) document.body.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#00FF41;font-family:monospace"><h1>Access Denied</h1></div>';
    if(d.token) sessionStorage.setItem('akka_token',d.token);
  });
})();
</script>`}</pre>
      </motion.div>
    </div>
  );
}
