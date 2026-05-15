"use client";

import { motion } from "framer-motion";
import {
  Headset,
  Mail,
  MessageSquare,
  FileText,
  ExternalLink,
  Clock,
  Shield,
} from "lucide-react";

const channels = [
  {
    icon: MessageSquare,
    title: "Chat ao Vivo",
    description: "Fale com nosso time de suporte em tempo real.",
    action: "Iniciar Chat",
    available: true,
    color: "text-neon",
    bg: "bg-neon/8",
  },
  {
    icon: Mail,
    title: "Email",
    description: "Envie sua dúvida para suporte@akkarabbit.com",
    action: "Enviar Email",
    available: true,
    color: "text-blue-400",
    bg: "bg-blue-400/8",
  },
  {
    icon: FileText,
    title: "Documentação",
    description: "Guias completos de instalação, API e configuração.",
    action: "Acessar Docs",
    available: true,
    color: "text-amber-400",
    bg: "bg-amber-400/8",
  },
];

const faqs = [
  {
    q: "Como instalo o script de proteção?",
    a: "Vá em Domínios → Adicione seu domínio → Clique em 'Copiar Script' e cole dentro da tag <head> da sua página.",
  },
  {
    q: "Quanto tempo leva para ativar a proteção?",
    a: "A ativação é instantânea. Assim que o script for detectado no seu domínio, o status muda para 'Active' automaticamente.",
  },
  {
    q: "O que acontece se eu exceder o limite de requisições?",
    a: "As requisições excedentes retornarão um status 429 (Rate Limit). Considere fazer upgrade do seu plano para limites maiores.",
  },
  {
    q: "Meu site vai ficar lento com o AkkaRabbit?",
    a: "Não. O script executa em menos de 50ms e roda de forma assíncrona. Não bloqueia o carregamento da sua página.",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-8 max-w-[1000px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2.5">
          <Headset className="w-5 h-5 text-neon" />
          Central de Suporte
        </h1>
        <p className="text-text-muted text-sm mt-1.5">
          Precisa de ajuda? Escolha um canal de atendimento ou consulte a documentação.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid md:grid-cols-3 gap-4">
        {channels.map((channel, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 group cursor-pointer"
          >
            <div className={`w-10 h-10 ${channel.bg} flex items-center justify-center rounded-xl mb-4`}>
              <channel.icon className={`w-5 h-5 ${channel.color}`} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">{channel.title}</h3>
            <p className="text-[13px] text-text-muted leading-relaxed mb-4">
              {channel.description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neon group-hover:gap-2.5 transition-all">
              {channel.action}
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </motion.div>
        ))}
      </div>

      {/* Response Time */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-static p-5 flex items-center gap-4"
      >
        <div className="w-10 h-10 bg-neon/[0.06] flex items-center justify-center rounded-xl border border-neon/10">
          <Clock className="w-5 h-5 text-neon" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Tempo Médio de Resposta</p>
          <p className="text-[13px] text-text-muted">
            <span className="font-mono text-neon font-semibold">&lt; 2 horas</span> durante horário comercial (Seg-Sex, 9h-18h BRT)
          </p>
        </div>
      </motion.div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="glass-card-static p-5"
            >
              <h4 className="text-sm font-semibold text-white mb-2">{faq.q}</h4>
              <p className="text-[13px] text-text-muted leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
