"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  CheckCircle2,
  Loader2,
  Zap,
  ArrowRight,
  Shield,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PixCheckoutModal from "@/components/dashboard/PixCheckoutModal";

interface PlanDetails {
  name: "starter" | "pro" | "enterprise";
  label: string;
  price: Record<string, string>;
  numericPrice: Record<string, number>;
  features: string[];
  color: string;
  borderColor: string;
  bgGlow: string;
  badge?: string;
}

const plansData: PlanDetails[] = [
  {
    name: "starter",
    label: "Starter",
    price: {
      diario: "R$ 9",
      semanal: "R$ 47",
      mensal: "R$ 147",
      trimestral: "R$ 397",
    },
    numericPrice: {
      diario: 9,
      semanal: 47,
      mensal: 147,
      trimestral: 397,
    },
    features: [
      "1 domínio protegido",
      "Ideal para iniciantes no tráfego",
      "Sistema de Cloaking Completo",
      "Logs de segurança (7 dias)",
      "Suporte via e-mail",
    ],
    color: "text-text-secondary",
    borderColor: "border-white/10",
    bgGlow: "rgba(255, 255, 255, 0.01)",
  },
  {
    name: "pro",
    label: "Pro",
    price: {
      diario: "R$ 19",
      semanal: "R$ 97",
      mensal: "R$ 297",
      trimestral: "R$ 797",
    },
    numericPrice: {
      diario: 19,
      semanal: 97,
      mensal: 297,
      trimestral: 797,
    },
    features: [
      "5 domínios protegidos",
      "Biometria Comportamental v3.0",
      "Logs estendidos (30 dias)",
      "Fingerprint Engine por GPU",
      "Acesso VIP no Grupo de Networking",
      "Suporte prioritário",
    ],
    color: "text-neon",
    borderColor: "border-neon/30",
    bgGlow: "rgba(0, 255, 65, 0.04)",
    badge: "Mais Vendido",
  },
  {
    name: "enterprise",
    label: "Enterprise",
    price: {
      diario: "R$ 49",
      semanal: "R$ 247",
      mensal: "R$ 697",
      trimestral: "R$ 1.997",
    },
    numericPrice: {
      diario: 49,
      semanal: 247,
      mensal: 697,
      trimestral: 1997,
    },
    features: [
      "Domínios ilimitados",
      "Lavanderia de Criativos (Imagem/Vídeo EXIF)",
      "Função Retaliação contra Clonadores",
      "Redirecionamento de Safe Page",
      "Armadilha Honeypot Ativa",
      "Webhooks customizados",
      "API dedicada",
      "Suporte VIP 24/7 com Onboarding",
    ],
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgGlow: "rgba(251, 191, 36, 0.04)",
    badge: "Arsenal Completo",
  },
];

export default function PlanosPage() {
  const [currentPlan, setCurrentPlan] = useState<"starter" | "pro" | "enterprise">("starter");
  const [billingCycle, setBillingCycle] = useState<"diario" | "semanal" | "mensal" | "trimestral">("mensal");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  // Pix Checkout State
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [generatingPix, setGeneratingPix] = useState(false);
  const [qrCodeData, setQrCodeData] = useState({ image: "", payload: "", value: 0 });

  const fetchProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserEmail(user.email || "");

    const { data } = await supabase
      .from("users")
      .select("plan_tier, full_name")
      .eq("id", user.id)
      .single();

    if (data) {
      setCurrentPlan((data.plan_tier as any) || "starter");
      setUserName(data.full_name || "Usuário AkkaRabbit");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpgrade = async (targetPlan: "starter" | "pro" | "enterprise") => {
    setGeneratingPix(true);
    try {
      const res = await fetch("/api/checkout/asaas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          planTier: targetPlan, 
          email: userEmail, 
          name: userName 
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setQrCodeData({
          image: data.qrCodeImage,
          payload: data.qrCodePayload,
          value: data.value
        });
        setPixModalOpen(true);
      } else {
        alert(data.error || "Erro ao gerar PIX");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar checkout de pagamento.");
    } finally {
      setGeneratingPix(false);
    }
  };

  const getPlanRank = (plan: "starter" | "pro" | "enterprise") => {
    if (plan === "starter") return 1;
    if (plan === "pro") return 2;
    return 3;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-28">
        <Loader2 className="w-6 h-6 text-neon animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-500 animate-pulse" />
            Planos & Assinaturas
          </h1>
          <p className="text-text-muted mt-2 text-sm max-w-xl">
            Melhore o seu plano e tenha acesso aos recursos militares de contingência, cloaking e a nossa exclusiva Lavanderia de Criativos.
          </p>
        </div>

        {/* Current Plan Indicator */}
        <div className="flex items-center gap-3 bg-neon/10 border border-neon/20 px-4 py-2.5 rounded-xl shrink-0">
          <Zap className="w-4 h-4 text-neon" />
          <div>
            <span className="text-[10px] font-mono uppercase text-text-muted block leading-none">Seu Plano Atual</span>
            <span className="text-xs font-mono font-bold text-neon uppercase tracking-wide mt-1 block">
              {currentPlan}
            </span>
          </div>
        </div>
      </div>

      {/* Stateful Switch Switcher (Diário, Semanal, Mensal, Trimestral) */}
      <div className="flex justify-center">
        <div className="bg-[#07060E] border border-white/5 p-1 rounded-xl flex gap-1">
          {[
            { id: "diario", label: "Diário" },
            { id: "semanal", label: "Semanal" },
            { id: "mensal", label: "Mensal" },
            { id: "trimestral", label: "Trimestral" },
          ].map((cycle) => (
            <button
              key={cycle.id}
              onClick={() => setBillingCycle(cycle.id as any)}
              className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-lg transition-all cursor-pointer
                ${billingCycle === cycle.id
                  ? "bg-neon/10 border border-neon/20 text-neon font-bold"
                  : "text-text-muted hover:text-white border border-transparent"
                }`}
            >
              {cycle.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansData.map((plan) => {
          const isCurrent = currentPlan === plan.name;
          const isLower = getPlanRank(currentPlan) > getPlanRank(plan.name);
          const isUpgrade = getPlanRank(plan.name) > getPlanRank(currentPlan);

          return (
            <div
              key={plan.name}
              className={`glass-card rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${plan.borderColor}`}
              style={{
                boxShadow: `inset 0 0 20px ${plan.bgGlow}, 0 4px 6px -1px rgba(0,0,0,0.1)`,
              }}
            >
              {/* Corner Badge */}
              {plan.badge && (
                <div className="absolute top-3 right-3">
                  <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/50 border border-white/10 ${plan.color}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Title & Price */}
              <div className="space-y-4">
                <span className={`font-mono text-xs font-bold uppercase tracking-wider block ${plan.color}`}>
                  {plan.label}
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    {plan.price[billingCycle]}
                  </span>
                  <span className="text-xs font-mono text-text-muted lowercase">
                    /{billingCycle === "diario" ? "dia" : billingCycle === "semanal" ? "semana" : billingCycle === "mensal" ? "mês" : "tri"}
                  </span>
                </div>

                <p className="text-[11px] text-text-muted leading-relaxed font-mono">
                  {plan.name === "starter" && "Perfeito para afiliados iniciantes testando os primeiros criativos."}
                  {plan.name === "pro" && "Para players em escala que rodam múltiplos domínios e exigem biometria."}
                  {plan.name === "enterprise" && "Para estruturas profissionais e agências de alta performance."}
                </p>

                {/* Features List */}
                <div className="pt-6 border-t border-white/5 space-y-3">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-neon shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-auto">
                {isCurrent && (
                  <div className="w-full text-center py-3 bg-neon/15 border border-neon/30 text-neon font-mono text-xs font-bold rounded-xl uppercase tracking-wider">
                    Seu Plano Atual
                  </div>
                )}

                {isLower && (
                  <div className="w-full text-center py-3 bg-white/[0.02] border border-white/5 text-text-muted font-mono text-xs rounded-xl uppercase tracking-wider opacity-50 cursor-not-allowed">
                    Plano Anterior
                  </div>
                )}

                {isUpgrade && (
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={generatingPix}
                    className="w-full btn-neon-filled py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                  >
                    {generatingPix ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processando...
                      </>
                    ) : (
                      <>
                        Upgrade Agora <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.04] bg-[#07060E] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-neon/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-neon shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Transações 100% Seguras via Criptografia Militar</h4>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
              Seu upgrade é processado em ambiente blindado. A liberação de recursos adicionais é automática e instantânea assim que o Pix é compensado.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-l border-white/5 pl-0 md:pl-6">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-text-muted uppercase font-bold block leading-none">Dúvidas?</span>
            <span className="text-xs text-white block mt-1 font-mono">Fale com o suporte 24/7</span>
          </div>
        </div>
      </div>

      {/* Pix Modal popup for instant checkout in dashboard */}
      <PixCheckoutModal
        isOpen={pixModalOpen}
        onClose={() => setPixModalOpen(false)}
        qrCodeImage={qrCodeData.image}
        qrCodePayload={qrCodeData.payload}
        value={qrCodeData.value}
      />
    </div>
  );
}
