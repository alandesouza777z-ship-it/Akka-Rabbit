"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Zap, Eye, Lock, BarChart3, Globe, ChevronRight,
  Terminal, Cpu, Fingerprint, AlertTriangle, CheckCircle2,
  ArrowRight, Menu, X,
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

const plans = [
  { name: "Starter", price: "R$ 97", period: "/mês", features: ["1 domínio protegido", "5.000 verificações/mês", "Logs de segurança (7 dias)", "Proteção Anti-Spy básica", "Suporte via email"], cta: "Começar Agora", popular: false },
  { name: "Pro", price: "R$ 197", period: "/mês", features: ["5 domínios protegidos", "50.000 verificações/mês", "Logs de segurança (30 dias)", "Fingerprint Engine completo", "DNS Reverse Lookup", "Webhooks customizados", "Suporte prioritário"], cta: "Escolher Pro", popular: true },
  { name: "Enterprise", price: "R$ 497", period: "/mês", features: ["Domínios ilimitados", "Verificações ilimitadas", "Logs permanentes", "API dedicada", "IP Whitelist/Blacklist", "Regras customizadas", "Onboarding dedicado", "SLA 99.9%"], cta: "Falar com Vendas", popular: false },
];

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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-neon bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-neon" />
              <span className="font-mono text-neon font-bold text-base sm:text-lg tracking-wider">
                AKKA<span className="text-white">RABBIT</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-text-secondary hover:text-neon transition-colors font-mono text-sm">Features</a>
              <a href="#how-it-works" className="text-text-secondary hover:text-neon transition-colors font-mono text-sm">Como Funciona</a>
              <a href="#pricing" className="text-text-secondary hover:text-neon transition-colors font-mono text-sm">Preços</a>
              <Link href="/login" className="text-text-secondary hover:text-neon transition-colors font-mono text-sm">Login</Link>
              <Link href="/register" className="btn-neon-filled text-xs py-2 px-4">Começar Grátis</Link>
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-neon p-1" id="mobile-menu-btn">
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
                <a href="#features" onClick={() => setMobileMenu(false)} className="text-text-secondary font-mono text-sm py-3 px-2 hover:text-neon border-b border-white/5">Features</a>
                <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="text-text-secondary font-mono text-sm py-3 px-2 hover:text-neon border-b border-white/5">Como Funciona</a>
                <a href="#pricing" onClick={() => setMobileMenu(false)} className="text-text-secondary font-mono text-sm py-3 px-2 hover:text-neon border-b border-white/5">Preços</a>
                <Link href="/login" onClick={() => setMobileMenu(false)} className="text-text-secondary font-mono text-sm py-3 px-2 hover:text-neon border-b border-white/5">Login</Link>
                <Link href="/register" onClick={() => setMobileMenu(false)} className="btn-neon-filled text-center text-xs py-3 px-4 mt-3">Começar Grátis</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-border-neon bg-neon-glow rounded-sm mb-4 sm:mb-6">
                <span className="status-dot status-active" />
                <span className="font-mono text-neon text-[10px] sm:text-xs">SHIELD ATIVO — v2.0</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                <span className="text-white">Blindagem</span>{" "}
                <span className="text-neon glow-neon-text">Enterprise</span>
                <br />
                <span className="text-text-secondary">para seus Funis</span>
              </h1>

              <p className="text-text-secondary text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-xl leading-relaxed">
                Proteja suas Landing Pages, VSLs e ofertas contra{" "}
                <span className="text-neon">espiões</span>,{" "}
                <span className="text-neon">clonadores</span> e{" "}
                <span className="text-neon">tráfego fraudulento</span>.
                Motor de segurança com verificação em tempo real.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link href="/register" className="btn-neon-filled gap-2" id="hero-cta">
                  <Lock className="w-4 h-4" />
                  Ativar Proteção
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works" className="btn-neon gap-2">
                  <Terminal className="w-4 h-4" />
                  Ver Demo
                </a>
              </div>

              {/* Terminal */}
              <div className="bg-bg-secondary border border-border-neon p-3 sm:p-4 font-mono text-xs sm:text-sm max-w-lg">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-danger" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-warning" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-success" />
                  <span className="text-text-muted text-[10px] sm:text-xs ml-1 sm:ml-2">terminal</span>
                </div>
                <div className="text-text-secondary overflow-hidden">
                  <span className="text-neon">$</span>{" "}
                  <span className="text-white break-all">{typedText}</span>
                  <span className="cursor-blink text-neon">█</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Threat Feed */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full lg:block hidden"
            >
              <div className="glass-card p-4 lg:p-6 rounded-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-neon shrink-0" />
                  <span className="font-mono text-neon text-xs sm:text-sm font-semibold">THREAT MONITOR — LIVE</span>
                  <span className="ml-auto status-dot status-active animate-pulse-neon" />
                </div>

                <div className="space-y-1.5">
                  {threatLog.map((log, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: i === currentLog ? 1 : 0.35,
                        scale: i === currentLog ? 1.01 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 lg:gap-3 p-2 lg:p-3 border font-mono text-[10px] lg:text-xs ${
                        i === currentLog ? "border-border-neon-strong bg-neon-glow" : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-text-muted shrink-0" />
                        <span className="text-text-secondary">{log.ip}</span>
                      </div>
                      <span className={`text-right ${log.type === "Googlebot" || log.type === "Facebook Bot" ? "text-neon" : "text-danger"}`}>
                        {log.type}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] lg:text-[10px] font-bold ${log.action === "BLOCKED" ? "bg-danger/20 text-danger" : "bg-neon/20 text-neon"}`}>
                        {log.action}
                      </span>
                      <span className="text-text-muted text-right">{log.time}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-border-neon flex items-center justify-between">
                  <div className="font-mono text-[10px] lg:text-xs">
                    <span className="text-text-muted">Blocked:</span>{" "}
                    <span className="text-danger font-bold">2,847</span>
                  </div>
                  <div className="font-mono text-[10px] lg:text-xs">
                    <span className="text-text-muted">Uptime:</span>{" "}
                    <span className="text-neon font-bold">99.97%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile-only mini threat feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full lg:hidden"
            >
              <div className="glass-card p-3 sm:p-4 rounded-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-neon shrink-0" />
                  <span className="font-mono text-neon text-[10px] sm:text-xs font-semibold">THREAT MONITOR</span>
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
      <section className="relative z-10 border-y border-border-neon bg-bg-secondary/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<50ms", label: "Latência Média" },
            { value: "2M+", label: "Ameaças Bloqueadas" },
            { value: "500+", label: "Funis Protegidos" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-neon glow-neon-text">{stat.value}</div>
              <div className="text-text-muted text-[10px] sm:text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <span className="font-mono text-neon text-[10px] sm:text-sm tracking-widest uppercase">// MÓDULOS DE PROTEÇÃO</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 text-white">
              Arsenal de Segurança <span className="text-neon">Completo</span>
            </h2>
            <p className="text-text-secondary mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Cada camada de proteção trabalha em conjunto para criar uma fortaleza digital impenetrável para seus funis de venda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card p-5 sm:p-6 rounded-sm group cursor-default">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border border-border-neon flex items-center justify-center mb-3 sm:mb-4 group-hover:glow-neon transition-all">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-neon" />
                </div>
                <h3 className="font-mono text-white font-semibold mb-2 text-base sm:text-lg">{feature.title}</h3>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 border-t border-border-neon">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <span className="font-mono text-neon text-[10px] sm:text-sm tracking-widest uppercase">// FLUXO DE EXECUÇÃO</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 text-white">
              Como o <span className="text-neon">Shield</span> Funciona
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
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto border border-border-neon-strong flex items-center justify-center mb-3 sm:mb-4 glow-neon">
                  <step.icon className="w-5 h-5 sm:w-7 sm:h-7 text-neon" />
                </div>
                <div className="font-mono text-neon text-[10px] sm:text-xs mb-1 sm:mb-2">[{step.step}]</div>
                <h3 className="font-mono text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{step.title}</h3>
                <p className="text-text-secondary text-[10px] sm:text-sm leading-relaxed">{step.description}</p>
                {i < 3 && <ChevronRight className="hidden md:block absolute top-6 -right-4 lg:-right-5 w-5 h-5 lg:w-6 lg:h-6 text-border-neon-strong" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 border-t border-border-neon">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <span className="font-mono text-neon text-[10px] sm:text-sm tracking-widest uppercase">// PLANOS DE ACESSO</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 text-white">
              Escolha seu Nível de <span className="text-neon">Proteção</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`glass-card p-6 sm:p-8 rounded-sm relative ${plan.popular ? "border-neon glow-neon" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon text-black font-mono text-[9px] sm:text-[10px] px-3 sm:px-4 py-1 font-bold tracking-wider whitespace-nowrap">
                    MAIS POPULAR
                  </div>
                )}

                <div className="font-mono text-text-muted text-[10px] sm:text-xs tracking-widest uppercase mb-3 sm:mb-4">{plan.name}</div>

                <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-text-muted font-mono text-xs sm:text-sm">{plan.period}</span>
                </div>

                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-xs sm:text-sm leading-snug">{feature}</span>
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
      <footer className="relative z-10 border-t border-border-neon py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neon" />
            <span className="font-mono text-neon font-bold tracking-wider text-sm">
              AKKA<span className="text-white">RABBIT</span>
            </span>
          </div>

          <div className="font-mono text-text-muted text-[10px] sm:text-xs text-center">
            © 2026 AkkaRabbit. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="text-text-muted hover:text-neon transition-colors font-mono text-[10px] sm:text-xs">Termos</a>
            <a href="#" className="text-text-muted hover:text-neon transition-colors font-mono text-[10px] sm:text-xs">Privacidade</a>
            <a href="#" className="text-text-muted hover:text-neon transition-colors font-mono text-[10px] sm:text-xs">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
