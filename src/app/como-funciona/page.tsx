"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Lock, Globe, Server, UserCheck, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import MatrixRain from "@/components/MatrixRain";

export default function ComoFuncionaPublic() {
  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <MatrixRain />

      {/* Navbar Minimalista */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-neon bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-neon" />
            <span className="font-mono text-neon font-bold text-lg tracking-wider">
              AKKA<span className="text-white">RABBIT</span>
            </span>
          </Link>
          <Link href="/" className="text-text-secondary hover:text-neon text-sm font-mono transition-colors">
            &lt; Voltar para o início
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              A Engenharia do <span className="text-neon glow-neon-text">AkkaRabbit</span>
            </h1>
            <p className="text-text-secondary md:text-lg max-w-2xl mx-auto">
              Como construímos o sistema de cloaking e proteção de infraestrutura mais avançado do mercado para afiliados e produtores de elite.
            </p>
          </div>

          {/* O Sistema */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Server className="text-neon w-6 h-6" />
              1. Como o Escudo Funciona na Prática
            </h2>
            <div className="glass-card p-6 md:p-8 rounded-xl border-l-2 border-l-neon">
              <p className="text-text-secondary leading-relaxed mb-6">
                O AkkaRabbit não é apenas um redirecionador de links. Ele é um <strong>Motor de Fingerprinting em Tempo Real</strong> (Edge Computing). Quando você instala o nosso script na sua Landing Page, VSL ou Checkout, nós assumimos o controle da renderização da página. 
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/30">
                    <UserCheck className="w-5 h-5 text-neon" />
                  </div>
                  <h3 className="text-white font-medium">Tráfego Legítimo (Seu Cliente)</h3>
                  <p className="text-sm text-text-muted">
                    Quando um humano real clica no seu anúncio, nós analisamos a velocidade de renderização, o hardware (GPU/Canvas) e o IP. Em milissegundos, a página é liberada e o cliente compra seu produto.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/30">
                    <Eye className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-white font-medium">Espiões e Ferramentas (AdSpy)</h3>
                  <p className="text-sm text-text-muted">
                    Se um Data Center, VPN, ou ferramenta de espionagem (BigSpy, SimilarWeb) tenta ler sua página, a impressão digital falha. Eles são bloqueados instantaneamente e ejetados da sua oferta.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* A Página do Burro */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-warning w-6 h-6" />
              2. O Redirecionamento da "Página do Burro"
            </h2>
            <div className="glass-card p-6 md:p-8 rounded-xl bg-gradient-to-br from-warning/5 to-transparent">
              <p className="text-text-secondary leading-relaxed mb-6">
                Nós levamos a proteção contra clonadores para o lado pessoal. Se um concorrente tentar acessar seu código fonte usando um IP camuflado ou se ele clonar o seu HTML e tentar rodar no servidor dele, o AkkaRabbit ativa a defesa máxima.
              </p>
              <div className="flex flex-col md:flex-row gap-6 items-center bg-black/50 p-4 rounded-lg border border-warning/20">
                <img src="/donkey-mascot.png" alt="Burro AkkaRabbit" className="w-24 h-24 object-contain filter drop-shadow-[0_0_15px_rgba(255,165,0,0.3)]" />
                <div>
                  <h3 className="text-warning font-bold mb-2">A Humilhação do Espião</h3>
                  <p className="text-sm text-text-muted">
                    Qualquer acesso não autorizado não apenas é bloqueado. O espião é redirecionado forçadamente para a nossa "Página do Burro". Ele perde acesso à sua copy, ao seu VSL e fica impossibilitado de copiar o seu funil de vendas. 
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Comparativo de Planos */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Lock className="text-neon w-6 h-6" />
              3. O Arsenal de Cada Plano
            </h2>
            
            <div className="space-y-6">
              {/* STARTER */}
              <div className="glass-card p-6 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-white">Starter</h3>
                  <span className="px-2 py-1 bg-white/10 text-white text-[10px] uppercase font-mono rounded-sm">O Básico Essencial</span>
                </div>
                <p className="text-sm text-text-muted mb-4">
                  Proteção padrão para quem está começando e quer parar de tomar banimento do Facebook bloqueando robôs básicos.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> 1 Domínio Protegido</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Limite de requisições mensal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Sistema de Cloaking Ativo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Logs de ameaças (7 dias)</li>
                </ul>
              </div>

              {/* PRO */}
              <div className="glass-card p-6 rounded-xl border border-neon/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Zap className="w-24 h-24 text-neon" /></div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-neon">Pro</h3>
                  <span className="px-2 py-1 bg-neon/10 text-neon text-[10px] uppercase font-mono rounded-sm border border-neon/20">A Escolha dos Profissionais</span>
                </div>
                <p className="text-sm text-text-muted mb-4">
                  Fingerprinting avançado de Hardware. Capaz de identificar os rastros invisíveis que as ferramentas gringas de AdSpy deixam ao tentar emular celulares e computadores.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> 5 Domínios Protegidos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Alto Volume de Requisições</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Fingerprint Engine Completo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Logs Retidos por 30 dias</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-neon" /> Webhooks Customizados</li>
                  <li className="flex items-center gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-neon" /> Grupo VIP de Networking</li>
                </ul>
              </div>

              {/* ENTERPRISE */}
              <div className="glass-card p-6 rounded-xl border border-warning/30 bg-warning/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Shield className="w-24 h-24 text-warning" /></div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-warning">Enterprise</h3>
                  <span className="px-2 py-1 bg-warning/10 text-warning text-[10px] uppercase font-mono rounded-sm border border-warning/20">A Máquina de Guerra</span>
                </div>
                <p className="text-sm text-text-muted mb-4">
                  Tudo que os planos anteriores têm, sem limites, mais a função de "Cavalo de Tróia" (Retaliação de clonadores) e acesso exclusivo à Lavanderia de Criativos.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-warning" /> Domínios Ilimitados</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-warning" /> Volume Ilimitado</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-warning" /> Função "Retaliação" Ativa</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-warning" /> <strong>Lavanderia de Criativos</strong></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-warning" /> Biometria Comportamental v3.0</li>
                  <li className="flex items-center gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-warning" /> Grupo VIP de Networking</li>
                </ul>
                <div className="mt-4 p-3 bg-black/40 border border-warning/10 rounded-lg">
                  <h4 className="text-white text-xs font-bold mb-1">O que é a Lavanderia de Criativos?</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Um sistema nativo de modificação criptográfica de Vídeos e Imagens. O AkkaRabbit destrói metadados antigos, aplica cintilação imperceptível para quebrar a Visão Computacional do Facebook e forja um novo "DNA Digital" para seus anúncios. Seu criativo se torna "invisível" para a Inteligência Artificial bloqueadora das plataformas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center pt-8 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Pronto para blindar sua operação?</h3>
            <Link href="/register" className="btn-neon-filled text-lg py-4 px-8 inline-flex items-center gap-2 shadow-[0_0_30px_rgba(0,255,65,0.3)]">
              Começar a Usar Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
