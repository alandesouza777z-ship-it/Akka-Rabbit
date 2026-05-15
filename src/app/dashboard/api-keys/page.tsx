"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Key, Copy, Check, RefreshCw, Shield, Code, Loader2, AlertTriangle } from "lucide-react";
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 text-neon animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-[800px]">
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2.5">
          <Key className="w-5 h-5 text-neon" />
          API Keys
        </h1>
        <p className="text-text-muted text-sm mt-1.5">Gerencie suas chaves de API para integração do Shield</p>
      </div>

      {/* Primary Key */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/15">
            <Key className="w-4 h-4 text-neon" />
          </div>
          <span className="text-sm font-semibold text-white">Chave de API Principal</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
          <code className="flex-1 bg-white/[0.02] px-4 py-3 font-mono text-[13px] text-neon border border-white/[0.06] rounded-lg truncate">
            {apiKey}
          </code>
          <div className="flex gap-2">
            <button onClick={copyKey} className="btn-neon flex items-center gap-2 text-[13px]" id="copy-api-key">
              {copied ? <><Check className="w-3.5 h-3.5" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
            </button>
            <button
              onClick={regenerateKey}
              disabled={regenerating}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg border border-danger/30 text-danger hover:bg-danger/[0.06] transition-all disabled:opacity-50"
              id="regenerate-key"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
              Regenerar
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-amber-400/80 leading-relaxed">
            Mantenha sua API Key em segredo. Use variáveis de ambiente no servidor — nunca exponha no frontend.
          </p>
        </div>
      </motion.div>

      {/* Integration Code */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/15">
            <Code className="w-4 h-4 text-neon" />
          </div>
          <span className="text-sm font-semibold text-white">Código de Integração</span>
        </div>

        <p className="text-text-muted text-[13px] mb-4 leading-relaxed">
          Cole este script no <code className="text-neon bg-neon/10 px-1.5 py-0.5 rounded text-[11px] font-mono">&lt;head&gt;</code> da sua Landing Page para ativar a proteção.
        </p>

        <pre className="bg-white/[0.02] border border-white/[0.05] p-5 overflow-x-auto font-mono text-[12px] text-text-secondary leading-relaxed rounded-xl whitespace-pre-wrap custom-scrollbar">{`<script>
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
