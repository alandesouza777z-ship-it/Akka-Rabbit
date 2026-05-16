"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Shield,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Mail,
  QrCode,
  Banknote,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MatrixRain from "@/components/MatrixRain";

/* ==================== STEP COMPONENT ==================== */
function Step({
  number,
  title,
  description,
  icon: Icon,
  active,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <div className={`flex gap-4 ${active ? "opacity-100" : "opacity-40"}`}>
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            active
              ? "bg-neon/10 border-neon/20 text-neon"
              : "bg-white/[0.02] border-white/[0.06] text-text-muted"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {number < 3 && (
          <div className={`w-px h-8 mt-2 ${active ? "bg-neon/20" : "bg-white/[0.04]"}`} />
        )}
      </div>
      <div className="pb-6">
        <p className={`text-sm font-semibold ${active ? "text-white" : "text-text-muted"}`}>
          {title}
        </p>
        <p className="text-[13px] text-text-muted mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ==================== INNER CONTENT (needs searchParams) ==================== */
function PendingContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";
  const method = searchParams.get("method") || "boleto";
  const [dots, setDots] = useState("");

  // Animated dots for "Aguardando..."
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const planLabels: Record<string, string> = {
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  const planColors: Record<string, string> = {
    starter: "text-text-secondary",
    pro: "text-neon",
    enterprise: "text-amber-400",
  };

  const methodInfo: Record<string, { label: string; icon: React.ElementType; time: string }> = {
    boleto: {
      label: "Boleto Bancário",
      icon: Banknote,
      time: "até 2 dias úteis",
    },
    pix: {
      label: "PIX",
      icon: QrCode,
      time: "até 15 minutos",
    },
  };

  const currentMethod = methodInfo[method] || methodInfo.boleto;

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-4">
      <MatrixRain />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Card */}
        <div className="glass-card-static border border-white/[0.06] overflow-hidden">
          {/* Header with pulsing glow */}
          <div className="relative px-8 pt-10 pb-8 text-center border-b border-white/[0.04]">
            {/* Animated background ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full bg-neon/[0.03] animate-ping" style={{ animationDuration: "3s" }} />
            </div>

            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-neon/[0.06] border border-neon/15 flex items-center justify-center mx-auto mb-5 animate-glow-pulse">
                <Clock className="w-9 h-9 text-neon" />
              </div>

              <h1 className="text-xl font-semibold text-white mb-2">
                Pagamento em Análise{dots}
              </h1>
              <p className="text-[14px] text-text-muted leading-relaxed max-w-sm mx-auto">
                Seu pagamento via <span className="text-white font-medium">{currentMethod.label}</span> foi
                registrado e está sendo processado.
              </p>
            </div>
          </div>

          {/* Plan Info */}
          <div className="px-8 py-5 border-b border-white/[0.04] bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-text-muted font-medium uppercase tracking-wider">Plano selecionado</p>
                <p className={`text-lg font-bold mt-0.5 ${planColors[plan] || "text-neon"}`}>
                  AkkaRabbit {planLabels[plan] || "Pro"}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/15">
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-[11px] font-semibold text-amber-400">PENDENTE</span>
              </div>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="px-8 py-6">
            <p className="text-[12px] text-text-muted font-medium uppercase tracking-wider mb-5">
              Próximos passos
            </p>

            <Step
              number={1}
              title="Pagamento registrado"
              description={`Seu ${currentMethod.label} foi gerado com sucesso.`}
              icon={CheckCircle2}
              active={true}
            />
            <Step
              number={2}
              title="Confirmação do banco"
              description={`Tempo estimado: ${currentMethod.time}. Você receberá um email quando confirmar.`}
              icon={Clock}
              active={true}
            />
            <Step
              number={3}
              title="Plano liberado automaticamente"
              description="Assim que o pagamento for confirmado, seu plano será ativado instantaneamente."
              icon={Sparkles}
              active={false}
            />
          </div>

          {/* Info Box */}
          <div className="px-8 pb-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-neon/[0.03] border border-neon/10">
              <Mail className="w-4 h-4 text-neon flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Enviaremos um <span className="text-white font-medium">email de confirmação</span> assim
                que o pagamento for processado. Verifique também sua caixa de spam.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="btn-neon-filled flex-1 flex items-center justify-center gap-2 text-[13px]"
            >
              Ir para o Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="btn-neon flex-1 flex items-center justify-center gap-2 text-[13px]"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-text-muted mt-6">
          Dúvidas? Entre em contato pelo chat no{" "}
          <Link href="/dashboard/support" className="text-neon hover:underline">
            Suporte
          </Link>
          {" "}ou envie um email para{" "}
          <span className="text-text-secondary">suporte@akkarabbit.com</span>
        </p>
      </motion.div>
    </div>
  );
}

/* ==================== PAGE WRAPPER (Suspense for searchParams) ==================== */
export default function PaymentPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-neon animate-spin" />
        </div>
      }
    >
      <PendingContent />
    </Suspense>
  );
}
