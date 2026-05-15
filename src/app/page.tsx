"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Zap, Eye, Lock, BarChart3, Globe, ChevronRight,
  Terminal, Cpu, Fingerprint, AlertTriangle, CheckCircle2,
  ArrowRight, Menu, X, Rabbit,
} from "lucide-react";
import Link from "next/link";
import MatrixRain from "@/components/MatrixRain";

const features = [
  { icon: Eye, title: "Anti-Spy Shield", description: "Detecta e bloqueia ferramentas de espionagem como AdSpy, BigSpy e SimilarWeb em tempo real." },
  { icon: Fingerprint, title: "Fingerprint Engine", description: "Identificação avançada de bots, webdrivers e tráfego automatizado via fingerprinting de navegador." },
  { icon: Shield, title: "Turnstile Attestation", description: "Validação via Cloudflare Turnstile para garantir que apenas humanos reais acessem seu funil." },
  { icon: Globe, title: "DNS Reverse Lookup", description: "Verificação de crawlers legítimos (Google, Facebook) via DNS reverso, permitindo SEO sem brechas." },
  { icon: Zap, title: "JWT Token Gate", description: "Tokens JWT de 15 segundos para controle granular de sessão e acesso ao conteúdo protegido." },
  { icon: BarChart3, title: "Security Dashboard", description: "Painel em tempo real com logs de ameaças, IPs bloqueados e métricas de proteção por domínio." },
];

const plans = {
  semanal: [
    { name: "Starter", price: "R$ 27", period: "/semana", features: ["1 domínio protegido", "1.250 verificações/sem", "Logs de segurança (7 dias)", "Proteção Anti-Spy básica", "Suporte via email"], cta: "Começar Agora", popular: false },
    { name: "Pro", price: "R$ 57", period: "/semana", features: ["5 domínios protegidos", "12.500 verificações/sem", "Logs de segurança (30 dias)", "Fingerprint Engine completo", "DNS Reverse Lookup", "Suporte prioritário"], cta: "Escolher Pro", popular: true },
    { name: "Enterprise", price: "R$ 147", period: "/semana", features: ["Domínios ilimitados", "Verificações ilimitadas", "Logs permanentes", "API dedicada", "IP Whitelist/Blacklist", "Regras customizadas", "Onboarding dedicado", "SLA 99.9%"], cta: "Falar com Vendas", popular: false },
  ],
  mensal: [
    { name: "Starter", price: "R$ 97", period: "/mês", features: ["1 domínio protegido", "5.000 verificações/mês", "Logs de segurança (7 dias)", "Proteção Anti-Spy básica", "Suporte via email"], cta: "Começar Agora", popular: false },
    { name: "Pro", price: "R$ 197", period: "/mês", features: ["5 domínios protegidos", "50.000 verificações/mês", "Logs de segurança (30 dias)", "Fingerprint Engine completo", "DNS Reverse Lookup", "Webhooks customizados", "Suporte prioritário"], cta: "Escolher Pro", popular: true },
    { name: "Enterprise", price: "R$ 497", period: "/mês", features: ["Domínios ilimitados", "Verificações ilimitadas", "Logs permanentes", "API dedicada", "IP Whitelist/Blacklist", "Regras customizadas", "Onboarding dedicado", "SLA 99.9%"], cta: "Falar com Vendas", popular: false },
  ],
  trimestral: [
    { name: "Starter", price: "R$ 247", period: "/trimestre", features: ["1 domínio protegido", "15.000 verificações/tri", "Logs de segurança (7 dias)", "Proteção Anti-Spy básica", "Suporte via email"], cta: "Começar Agora", popular: false },
    { name: "Pro", price: "R$ 497", period: "/trimestre", features: ["5 domínios protegidos", "150.000 verificações/tri", "Logs de segurança (30 dias)", "Fingerprint Engine completo", "DNS Reverse Lookup", "Webhooks customizados", "Suporte prioritário"], cta: "Escolher Pro", popular: true },
    { name: "Enterprise", price: "R$ 1.297", period: "/trimestre", features: ["Domínios ilimitados", "Verificações ilimitadas", "Logs permanentes", "API dedicada", "IP Whitelist/Blacklist", "Regras customizadas", "Onboarding dedicado", "SLA 99.9%"], cta: "Falar com Vendas", popular: false },
  ]
};

const threatLog = [
  { ip: "185.220.101.***", type: "Spy Tool", action: "BLOCKED", time: "0.3s" },
  { ip: "104.248.50.***", type: "Data Center", action: "BLOCKED", time: "1.2s" },
  { ip: "23.105.170.***", type: "Webdriver", action: "BLOCKED", time: "2.8s" },
  { ip: "66.249.66.***", type: "Googlebot", action: "ALLOWED", time: "3.1s" },
  { ip: "91.108.4.***", type: "Turnstile Fail", action: "BLOCKED", time: "4.5s" },
  { ip: "157.240.1.***", type: "Facebook Bot", action: "ALLOWED", time: "5.0s" },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [currentLog, setCurrentLog] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [billingCycle, setBillingCycle] = useState<"semanal" | "mensal" | "trimestral">("mensal");
  const fullText = "akkarabbit --shield --mode=enterprise";

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [typedText, fullText]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLog((prev) => (prev + 1) % threatLog.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <MatrixRain />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-black/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Rabbit className="w-7 h-7 sm:w-8 sm:h-8 text-emerald" />
              <span className="font-display text-white font-bold text-lg sm:text-xl tracking-tight">
                akka<span className="text-emerald">rabbit</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-text-secondary hover:text-emerald transition-colors text-sm">Recursos</a>
              <a href="#how-it-works" className="text-text-secondary hover:text-emerald transition-colors text-sm">Como Funciona</a>
              <a href="#pricing" className="text-text-secondary hover:text-emerald transition-colors text-sm">Planos</a>
              <Link href="/login" className="text-text-secondary hover:text-emerald transition-colors text-sm">Entrar</Link>
              <Link href="/register" className="btn-neon-filled text-sm py-2.5 px-5">Começar Agora</Link>
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-emerald p-1" id="mobile-menu-btn">
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border-neon bg-black/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                <a href="#features" onClick={() => setMobileMenu(false)} className="text-text-secondary text-sm py-3 px-2 hover:text-emerald border-b border-white/5">Recursos</a>
                <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="text-text-secondary text-sm py-3 px-2 hover:text-emerald border-b border-white/5">Como Funciona</a>
                <a href="#pricing" onClick={() => setMobileMenu(false)} className="text-text-secondary text-sm py-3 px-2 hover:text-emerald border-b border-white/5">Planos</a>
                <Link href="/login" onClick={() => setMobileMenu(false)} className="text-text-secondary text-sm py-3 px-2 hover:text-emerald border-b border-white/5">Entrar</Link>
                <Link href="/register" onClick={() => setMobileMenu(false)} className="btn-neon-filled text-center text-sm py-3 px-4 mt-3">Começar Agora</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-emerald/20 bg-emerald/5 rounded-full mb-6">
                <span className="status-dot status-active" />
                <span className="text-emerald text-xs font-medium">Proteção ativa em tempo real</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6">
                <span className="text-white">Seus funis.</span><br />
                <span className="text-emerald">Blindados.</span>
              </h1>

              <p className="text-text-secondary text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                Faça seus espiões e clonadores trabalharem <em>para você</em>. O AkkaRabbit transforma tentativas de pirataria em receita.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                <Link href="/register" className="btn-neon-filled" id="hero-cta">
                  <Lock className="w-4 h-4" />
                  Ativar Proteção
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works" className="btn-neon">
                  Como Funciona
                </a>
              </div>

              {/* Terminal */}
              <div className="bg-[#0a0f0a] border border-emerald/10 p-4 rounded-xl font-mono text-xs sm:text-sm max-w-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald" />
                  <span className="text-text-muted text-[10px] ml-2">akkarabbit.sh</span>
                </div>
                <div className="text-text-secondary overflow-hidden">
                  <span className="text-emerald">$</span>{" "}
                  <span className="text-white break-all">{typedText}</span>
                  <span className="cursor-blink text-emerald">█</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Video Browser Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full relative"
            >
              {/* Browser Window Frame */}
              <div className="rounded-t-lg bg-[#1c1c1c] border border-b-0 border-[#333] p-3 flex items-center shadow-2xl relative z-20">
                {/* Traffic Lights */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                {/* URL Bar */}
                <div className="mx-auto bg-black/50 border border-[#333] rounded px-4 py-1 flex items-center justify-center font-mono text-[9px] sm:text-[10px] text-text-muted/70 w-full max-w-[200px] truncate">
                  app.akkarabbit.com/security
                </div>
              </div>
              
              {/* Video Content */}
              <div className="rounded-2xl border border-emerald/10 bg-black overflow-hidden relative shadow-[0_8px_64px_rgba(52,211,153,0.1)] z-20">
                <video 
                  src="/akkarabit.mp4" 
                  autoPlay loop muted playsInline controls={false}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-emerald/8 blur-[120px] rounded-full z-0 pointer-events-none" />
            </motion.div>

            {/* Mobile-only mini threat feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full lg:hidden"
            >
               <div className="glass-card p-3 sm:p-4 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-emerald shrink-0" />
                  <span className="text-emerald text-[10px] sm:text-xs font-semibold">Ameaças detectadas</span>
                  <span className="ml-auto status-dot status-active animate-pulse-neon" />
                </div>
                <div className="space-y-1.5">
                  {threatLog.slice(0, 3).map((log, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 font-mono text-[10px] border overflow-hidden ${i === 0 ? "border-border-neon-strong bg-neon-glow" : "border-transparent opacity-50"}`}>
                      <span className="text-text-secondary truncate min-w-0 shrink">{log.ip}</span>
                      <span className={`shrink-0 ${log.action === "BLOCKED" ? "text-danger" : "text-neon"}`}>{log.type}</span>
                      <span className={`shrink-0 px-1.5 py-0.5 text-[9px] font-bold ${log.action === "BLOCKED" ? "bg-danger/20 text-danger" : "bg-neon/20 text-neon"}`}>{log.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative z-10 border-y border-border-subtle bg-[#030503]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<50ms", label: "Latência Média" },
            { value: "2M+", label: "Ameaças Bloqueadas" },
            { value: "500+", label: "Funis Protegidos" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-emerald">{stat.value}</div>
              <div className="text-text-muted text-xs sm:text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-20">
            <span className="text-emerald text-xs sm:text-sm font-medium tracking-widest uppercase">Recursos</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 text-white">
              Cada camada, uma <span className="text-emerald">fortaleza</span>
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Seis módulos de proteção que trabalham em conjunto para blindar seus funis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-6 sm:p-7 rounded-xl group cursor-default">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald/10 border border-emerald/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald/15 transition-all">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-20">
            <span className="text-emerald text-xs sm:text-sm font-medium tracking-widest uppercase">Como Funciona</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 text-white">
              4 passos para <span className="text-emerald">blindar</span> tudo
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              { step: "01", title: "Requisição", description: "Visitante acessa sua Landing Page ou VSL protegida.", icon: Globe },
              { step: "02", title: "Análise", description: "Motor verifica IP, User-Agent, fingerprint e Turnstile.", icon: Cpu },
              { step: "03", title: "Decisão", description: "IA classifica: humano legítimo, bot ou espião.", icon: Shield },
              { step: "04", title: "Ação", description: "Humanos recebem JWT de acesso. Bots são bloqueados.", icon: Lock },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-emerald/10 border border-emerald/15 rounded-2xl flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald" />
                </div>
                <div className="text-emerald text-xs mb-2 font-mono">{step.step}</div>
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">{step.title}</h3>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">{step.description}</p>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-6 -right-4 lg:-right-5 w-5 h-5 lg:w-6 lg:h-6 text-border-neon-strong" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS CAROUSEL ── */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 border-t border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-20">
            <span className="text-emerald text-xs sm:text-sm font-medium tracking-widest uppercase">Reconhecimento</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 text-white">
              Marcos de <span className="text-emerald">Elite</span>
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Nossos clientes mais bem-sucedidos recebem placas exclusivas de reconhecimento.
            </p>
          </motion.div>

          <div className="relative w-full overflow-hidden flex items-center">
            {/* Left and Right Gradients to fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div className="flex animate-carousel gap-6 sm:gap-10 w-max pr-6 sm:pr-10">
              {/* We render 12 sets of plaques to ensure it covers even ultra-wide monitors, translating -50% seamlessly */}
              {[...Array(12)].map((_, loopIndex) => (
                <div key={loopIndex} className="flex gap-6 sm:gap-10">
                  {[
                    { title: "Membro Esmerald", color: "text-[#00FF41]", glow: "shadow-[0_0_30px_rgba(0,255,65,0.3)]", bgPos: "left center" },
                    { title: "Membro Ruby", color: "text-[#FF1133]", glow: "shadow-[0_0_30px_rgba(255,17,51,0.3)]", bgPos: "center center" },
                    { title: "Membro Gold Rabbit", color: "text-[#FFD700]", glow: "shadow-[0_0_30px_rgba(255,215,0,0.3)]", bgPos: "right center" }
                  ].map((award, i) => (
                    <div 
                      key={i}
                      className="group relative w-[200px] h-[300px] sm:w-[280px] sm:h-[420px] shrink-0 cursor-pointer rounded-md overflow-hidden transition-all duration-500 hover:-translate-y-4"
                    >
                      {/* Image slice */}
                      <div 
                        className={`absolute inset-0 bg-[url('/awards.jpg')] bg-no-repeat transition-all duration-500 group-hover:${award.glow}`}
                        style={{ backgroundSize: '300% 100%', backgroundPosition: award.bgPos }}
                      />
                      
                      {/* Dark overlay that disappears on hover */}
                      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0" />
                      
                      {/* Hover text block */}
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end">
                        <Shield className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 ${award.color}`} />
                        <h3 className={`font-mono font-bold text-sm sm:text-lg uppercase tracking-widest text-center ${award.color}`}>
                          {award.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <span className="text-emerald text-xs sm:text-sm font-medium tracking-widest uppercase">Planos</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 text-white">
              Invista na <span className="text-emerald">segurança</span>
            </h2>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-[#0a0f0a] border border-border-subtle rounded-xl p-1">
              {(["semanal", "mensal", "trimestral"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-5 py-2.5 text-sm capitalize transition-all rounded-lg ${
                    billingCycle === cycle ? "bg-emerald/15 text-emerald font-semibold" : "text-text-muted hover:text-white"
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {plans[billingCycle].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`glass-card p-7 sm:p-8 rounded-2xl relative ${
                  plan.popular ? "border-emerald/40 shadow-[0_0_40px_rgba(52,211,153,0.1)]" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald to-neon text-black text-[10px] px-4 py-1 font-bold rounded-full whitespace-nowrap">
                    MAIS POPULAR
                  </div>
                )}

                <div className="text-text-muted text-xs tracking-widest uppercase mb-4">{plan.name}</div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl sm:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-text-muted text-sm">{plan.period}</span>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-sm leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/register"
                  className={`block text-center w-full ${plan.popular ? "btn-neon-filled" : "btn-neon"}`}
                  id={`pricing-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-border-subtle py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2.5">
            <Rabbit className="w-6 h-6 text-emerald" />
            <span className="font-display text-white font-bold tracking-tight text-base">
              akka<span className="text-emerald">rabbit</span>
            </span>
          </div>
          <div className="text-text-muted text-xs text-center">
            © 2026 AkkaRabbit. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-text-muted hover:text-emerald transition-colors text-xs">Termos</a>
            <a href="#" className="text-text-muted hover:text-emerald transition-colors text-xs">Privacidade</a>
            <a href="#" className="text-text-muted hover:text-emerald transition-colors text-xs">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
