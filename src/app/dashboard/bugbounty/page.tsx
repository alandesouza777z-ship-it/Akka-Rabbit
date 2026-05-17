"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bug,
  ShieldAlert,
  Terminal,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Cpu,
} from "lucide-react";

interface BountyTier {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  reward: string;
  color: string;
  bgGlow: string;
  borderColor: string;
  description: string;
  targets: string[];
}

const bountyTiers: BountyTier[] = [
  {
    severity: "CRITICAL",
    reward: "R$ 5.000,00+",
    color: "text-red-500",
    bgGlow: "rgba(239, 68, 68, 0.15)",
    borderColor: "border-red-500/30",
    description: "Bypass absoluto de cloaking de tráfego que exponha a VSL/Checkout para crawlers oficiais (Googlebot/Meta Crawler) sem disparar detecção.",
    targets: ["Vulnerabilidade de dia-zero (0-day) no Fingerprinting de GPU", "Exploits de injeção de scripts na API de Cloaking Core"],
  },
  {
    severity: "HIGH",
    reward: "R$ 2.500,00",
    color: "text-amber-500",
    bgGlow: "rgba(245, 158, 11, 0.15)",
    borderColor: "border-amber-500/30",
    description: "Métodos consistentes de decodificação da Lavanderia de Criativos (reverter o ruído esteganográfico ou identificar o padrão de cintilação).",
    targets: ["Algoritmo de Visão Computacional capaz de ler 100% dos metadados blindados", "Bypass na Biometria Comportamental v3.0 em emuladores móveis"],
  },
  {
    severity: "MEDIUM",
    reward: "R$ 1.000,00",
    color: "text-neon",
    bgGlow: "rgba(0, 255, 65, 0.15)",
    borderColor: "border-neon/30",
    description: "Vazamento de logs de segurança parciais, manipulação de API keys de outros usuários ou spoofing de domínios cadastrados.",
    targets: ["Inconsistências no cálculo de requests de segurança", "Falsificação de assinaturas JWT em requisições de cloak"],
  },
  {
    severity: "LOW",
    reward: "R$ 300,00",
    color: "text-blue-400",
    bgGlow: "rgba(96, 165, 250, 0.15)",
    borderColor: "border-blue-400/30",
    description: "Vulnerabilidades visuais no painel, bugs de interface (UI/UX) que comprometam a usabilidade ou problemas de carregamento secundários.",
    targets: ["Erros de console no SDK de integração", "Bugs de layout no dashboard mobile"],
  },
];

const hallOfFame = [
  { rank: 1, handle: "0x_rabbit_killer", bounty: "R$ 5.000,00", bugs: 1, date: "12 Mai 2026" },
  { rank: 2, handle: "cyber_sentinel", bounty: "R$ 2.500,00", bugs: 1, date: "09 Mai 2026" },
  { rank: 3, handle: "whitehat_jhonny", bounty: "R$ 1.300,00", bugs: 2, date: "02 Mai 2026" },
];

export default function BugBountyPage() {
  const [activeTab, setActiveTab] = useState<"rewards" | "submit" | "hall">("rewards");
  const [formData, setFormData] = useState({
    title: "",
    severity: "LOW",
    description: "",
    steps: "",
    pocUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const simulateLogs = () => {
    setTerminalLogs([]);
    const logs = [
      "INICIANDO MÓDULO DE TRANSMISSÃO DE VULNERABILIDADE...",
      "ESTABELECENDO CANAL SEGURO SSL/TLS...",
      "CRIPTOGRAFANDO DADOS COM ALGORITMO AES-256...",
      "VERIFICANDO INTEGRIDADE DA PROVA DE CONCEITO (PoC)...",
      "GRAVANDO ENVELOPE CRIPTOGRÁFICO NO COFRE DE SEGURANÇA...",
      "RELATÓRIO ENVIADO COM SUCESSO! CÓDIGO DA SUBMISSÃO: AKKA-BB-" + Math.floor(100000 + Math.random() * 900000),
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setIsSubmitting(false);
          setSubmitted(true);
        }
      }, (index + 1) * 800);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }
    setIsSubmitting(true);
    simulateLogs();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      severity: "LOW",
      description: "",
      steps: "",
      pocUrl: "",
    });
    setSubmitted(false);
    setTerminalLogs([]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white flex items-center gap-3">
            <Bug className="w-8 h-8 text-red-500 animate-pulse" />
            AkkaRabbit Bug Bounty
          </h1>
          <p className="text-text-muted mt-2 text-sm max-w-2xl">
            Nós confiamos blindadamente na nossa segurança. Desafiamos pesquisadores de segurança e hackers éticos do mundo inteiro a encontrar brechas no nosso motor de Cloaking Core v3.0 e Lavanderia.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg shrink-0">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">Desafio Ativo</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.04] pb-px">
        <button
          onClick={() => setActiveTab("rewards")}
          className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 transition-all duration-200 ${
            activeTab === "rewards"
              ? "border-red-500 text-red-400 bg-red-500/[0.02]"
              : "border-transparent text-text-muted hover:text-white"
          }`}
        >
          Recompensas & Regras
        </button>
        <button
          onClick={() => setActiveTab("submit")}
          className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 transition-all duration-200 ${
            activeTab === "submit"
              ? "border-red-500 text-red-400 bg-red-500/[0.02]"
              : "border-transparent text-text-muted hover:text-white"
          }`}
        >
          Submeter Vulnerabilidade
        </button>
        <button
          onClick={() => setActiveTab("hall")}
          className={`px-4 py-2.5 font-mono text-xs font-bold uppercase border-b-2 transition-all duration-200 ${
            activeTab === "hall"
              ? "border-red-500 text-red-400 bg-red-500/[0.02]"
              : "border-transparent text-text-muted hover:text-white"
          }`}
        >
          Hall of Fame
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "rewards" && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Disclaimer */}
            <div className="glass-card rounded-xl p-6 border-l-2 border-l-red-500 bg-red-500/[0.02] flex items-start gap-4">
              <ShieldAlert className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="text-white font-mono font-bold text-sm">Política de Divulgação Responsável</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Para se qualificar para as recompensas, você deve relatar a vulnerabilidade de forma privada para nossa equipe e nos dar um prazo razoável de correção antes de qualquer divulgação pública. Testes de engenharia social (phishing), DDoS ou ataques físicos contra nossa infraestrutura estão estritamente fora do escopo.
                </p>
              </div>
            </div>

            {/* Bounty Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bountyTiers.map((tier) => (
                <div
                  key={tier.severity}
                  className={`glass-card rounded-xl p-6 border relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${tier.borderColor}`}
                  style={{
                    boxShadow: `inset 0 0 20px ${tier.bgGlow}, 0 4px 6px -1px rgba(0,0,0,0.1)`,
                  }}
                >
                  {/* Top Header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 ${tier.color}`}>
                      {tier.severity}
                    </span>
                    <span className="font-mono text-lg font-extrabold text-white tracking-tight">
                      {tier.reward}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  {/* Targets list */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-text-muted flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> Vetores de Ataque Comuns:
                    </span>
                    <ul className="space-y-1.5 text-xs text-text-secondary">
                      {tier.targets.map((target, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
                          <span>{target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Scope info */}
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="text-white font-mono font-bold text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-neon" /> Diretrizes de Escopo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-text-secondary leading-relaxed">
                <div className="space-y-2 bg-black/30 p-4 rounded-lg border border-white/5">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-neon">✓ Dentro de Escopo</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Script de Proteção de Tráfego (`src/app/dashboard/domains/page.tsx`)</li>
                    <li>Lavanderia de Criativos (processamento e masking de metadados)</li>
                    <li>Sistemas de detecção de Biometria Comportamental v3.0</li>
                    <li>Endpoints de validação `/api/v1/shield`</li>
                  </ul>
                </div>
                <div className="space-y-2 bg-black/30 p-4 rounded-lg border border-white/5">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-red-400">✗ Fora de Escopo</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Spam em formulários de suporte ou e-mails da equipe</li>
                    <li>Ataques de negação de serviço (DDoS/DDoS Volumétrico)</li>
                    <li>Comprometer contas de outros clientes de forma invasiva</li>
                    <li>Vulnerabilidades em bibliotecas de terceiros não-customizadas</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "submit" && (
          <motion.div
            key="submit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-xl p-8 border border-white/[0.04]"
          >
            {!submitted && !isSubmitting && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-mono font-bold text-white uppercase">Título do Report *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ex: Bypass de Biometria Comportamental via emulação de TouchEvents"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-all font-mono"
                    />
                  </div>

                  {/* Severity */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-white uppercase">Severidade Estimada</label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-all font-mono"
                    >
                      <option value="LOW">LOW (UI/UX / R$ 300)</option>
                      <option value="MEDIUM">MEDIUM (API / R$ 1.000)</option>
                      <option value="HIGH">HIGH (Crypto/Anti-IA / R$ 2.500)</option>
                      <option value="CRITICAL">CRITICAL (Total Bypass / R$ 5.000+)</option>
                    </select>
                  </div>
                </div>

                {/* PoC URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-white uppercase">URL de Prova de Conceito ou Repositório (Opcional)</label>
                  <input
                    type="url"
                    name="pocUrl"
                    value={formData.pocUrl}
                    onChange={handleInputChange}
                    placeholder="Ex: https://github.com/hacker/poc-bypass-akkarabbit"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-all font-mono"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-white uppercase">Descrição Detalhada *</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Explique detalhadamente o comportamento inesperado e o impacto dele na segurança."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-all leading-relaxed"
                  />
                </div>

                {/* Steps to reproduce */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-white uppercase">Passos para Reproduzir</label>
                  <textarea
                    name="steps"
                    rows={4}
                    value={formData.steps}
                    onChange={handleInputChange}
                    placeholder="1. Instalar o script AkkaRabbit em um site local&#10;2. Enviar um payload customizado via Postman&#10;3. Executar..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-all leading-relaxed font-mono"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-red-filled px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border border-red-500 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Enviar Report Criptografado
                  </button>
                </div>
              </form>
            )}

            {/* Terminal Submission Console */}
            {isSubmitting && (
              <div className="bg-[#030303] border border-red-500/20 rounded-lg p-6 font-mono text-xs text-red-500 space-y-2 min-h-[250px]">
                <div className="flex items-center gap-2 mb-4 border-b border-red-500/10 pb-2">
                  <Terminal className="w-4 h-4 animate-spin" />
                  <span className="font-bold">AKKARABBIT ENCRYPTION TERMINAL v1.0.4</span>
                </div>
                <div className="space-y-1">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-red-500/50">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Successful Submission */}
            {submitted && (
              <div className="text-center py-12 max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mx-auto">
                  <ShieldCheck className="w-8 h-8 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-mono font-bold text-lg">Report Recebido com Sucesso!</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Agradecemos seu compromisso com a segurança do AkkaRabbit. Nosso comitê de segurança analisará seu relatório em até **48 horas**. Se confirmado, entraremos em contato para a emissão do seu pagamento.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-white/10 hover:border-white/20 text-xs text-text-secondary hover:text-white rounded-lg transition-colors font-mono uppercase"
                >
                  Enviar Outro Report
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "hall" && (
          <motion.div
            key="hall"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-text-muted uppercase font-bold">Total Pago em Prêmios</span>
                <p className="text-xl font-mono font-bold text-white">R$ 8.800,00</p>
              </div>
              <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-text-muted uppercase font-bold">Bugs Mitigados</span>
                <p className="text-xl font-mono font-bold text-white">4</p>
              </div>
              <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-text-muted uppercase font-bold">Tempo Médio de Fix</span>
                <p className="text-xl font-mono font-bold text-neon">4.2 horas</p>
              </div>
            </div>

            {/* Leaderboard table */}
            <div className="glass-card rounded-xl border border-white/[0.04] overflow-hidden">
              <div className="p-5 border-b border-white/[0.04] bg-white/[0.01]">
                <h3 className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-neon" /> Whitehat Elite (Mural da Fama)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04] text-[10px] font-mono uppercase text-text-muted bg-black/40">
                      <th className="py-3.5 px-6 font-bold">Rank</th>
                      <th className="py-3.5 px-6 font-bold">Pseudônimo</th>
                      <th className="py-3.5 px-6 font-bold">Total Premiado</th>
                      <th className="py-3.5 px-6 font-bold">Bugs Validados</th>
                      <th className="py-3.5 px-6 font-bold">Último Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02] text-xs text-text-secondary">
                    {hallOfFame.map((hunter) => (
                      <tr key={hunter.rank} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-white">#{hunter.rank}</td>
                        <td className="py-4 px-6 font-mono font-bold text-red-400">{hunter.handle}</td>
                        <td className="py-4 px-6 font-mono font-bold text-white">{hunter.bounty}</td>
                        <td className="py-4 px-6">{hunter.bugs}</td>
                        <td className="py-4 px-6 text-text-muted font-mono">{hunter.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
