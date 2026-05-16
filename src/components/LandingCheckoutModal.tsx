"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, CheckCircle2, QrCode, Loader2, Shield, Lock, Mail, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface LandingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planTier: "starter" | "pro" | "enterprise" | "trial";
}

export default function LandingCheckoutModal({ isOpen, onClose, planTier }: LandingCheckoutModalProps) {
  const router = useRouter();
  
  // Step 1: Registration Form
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Step 2: PIX Data
  const [qrCodeData, setQrCodeData] = useState({ image: "", payload: "", value: 0 });

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCodeData.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegisterAndCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      
      // 1. Registrar o usuário no Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            plan_tier: planTier === "trial" ? "trial" : "starter", // Se não pagar, fica como starter ou trial
          }
        }
      });

      if (authError) throw new Error(authError.message);

      // 2. Se for Trial, apenas redireciona para o dashboard
      if (planTier === "trial") {
        router.push("/dashboard");
        return;
      }

      // 3. Se for plano pago, chama a API do Asaas para gerar o PIX
      const res = await fetch("/api/checkout/asaas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          planTier, 
          email, 
          name,
          cpfCnpj: cpf // Opcional, mas recomendado para evitar erros do Asaas
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setQrCodeData({
          image: data.qrCodeImage,
          payload: data.qrCodePayload,
          value: data.value
        });
        setStep(2); // Muda para a tela do QR Code
      } else {
        throw new Error(data.error || "Erro ao gerar PIX");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
            onClick={loading ? undefined : onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-black border border-neon/50 shadow-[0_0_30px_rgba(0,255,65,0.15)] rounded-sm pointer-events-auto overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-neon/20">
                <motion.div 
                  className="h-full bg-neon" 
                  initial={{ width: "0%" }} 
                  animate={{ width: step === 1 ? "50%" : "100%" }} 
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-neon" />
                    <h3 className="font-mono text-white text-lg tracking-wider uppercase">
                      {planTier === "trial" ? "Ativar Teste" : `Plano ${planTier}`}
                    </h3>
                  </div>
                  {!loading && (
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-mono rounded-sm">
                    &gt; {error}
                  </div>
                )}

                {step === 1 ? (
                  <form onSubmit={handleRegisterAndCheckout} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-bg-secondary border border-border-neon text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors" placeholder="Seu nome" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-muted uppercase tracking-wider">E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-bg-secondary border border-border-neon text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors" placeholder="seu@email.com" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Senha</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-bg-secondary border border-border-neon text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors" placeholder="••••••••" />
                      </div>
                    </div>

                    {planTier !== "trial" && (
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-text-muted uppercase tracking-wider">CPF/CNPJ (Opcional)</label>
                        <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} className="w-full bg-bg-secondary border border-border-neon text-white px-4 py-2.5 text-sm focus:outline-none focus:border-neon transition-colors" placeholder="Somente números" />
                        <p className="text-[10px] text-text-muted">Apenas se tiver problemas com a cobrança Asaas.</p>
                      </div>
                    )}

                    <button disabled={loading} type="submit" className="w-full btn-neon-filled mt-6 py-3 flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (planTier === "trial" ? "Criar Conta Grátis" : "Prosseguir para Pagamento")}
                    </button>
                  </form>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* QR Code Container */}
                    <div className="flex justify-center mb-6">
                      <div className="relative p-3 bg-white rounded-sm">
                        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-neon" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-neon" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-neon" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-neon" />
                        
                        {qrCodeData.image ? (
                          <img src={`data:image/png;base64,${qrCodeData.image}`} alt="QR Code PIX" className="w-48 h-48 object-contain" />
                        ) : (
                          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <p className="text-text-muted font-mono text-sm mb-1">Total a pagar:</p>
                      <p className="text-3xl font-bold text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(qrCodeData.value)}
                      </p>
                    </div>

                    {/* Copia e Cola */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-neon uppercase tracking-widest">PIX Copia e Cola</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={qrCodeData.payload} 
                          readOnly 
                          className="w-full bg-black border border-border-neon text-text-muted text-xs p-3 font-mono focus:outline-none focus:border-neon truncate"
                        />
                        <button 
                          onClick={handleCopy}
                          className="shrink-0 p-3 bg-neon/10 hover:bg-neon/20 border border-neon/50 text-neon transition-colors flex items-center justify-center"
                        >
                          {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 text-center space-y-4">
                      <p className="text-xs text-text-secondary font-mono animate-pulse">
                        &gt; Aguardando confirmação do pagamento...
                      </p>
                      <button onClick={() => router.push("/dashboard")} className="text-xs font-mono text-neon underline hover:text-white transition-colors">
                        Já paguei, ir para o Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
