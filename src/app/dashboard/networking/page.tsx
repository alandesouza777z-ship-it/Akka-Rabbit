"use client";

import { motion } from "framer-motion";
import { Users, ExternalLink, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NetworkingPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-neon" />
          Networking VIP
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          Acesso exclusivo ao grupo da elite do mercado digital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-8 relative overflow-hidden group"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Users className="w-64 h-64" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-neon/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Mascot Icon */}
              <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 relative rounded-full overflow-hidden border-4 border-neon/20 shadow-[0_0_30px_rgba(0,255,65,0.2)] bg-black/50 p-2">
                <div className="absolute inset-0 bg-neon/10 animate-pulse-neon rounded-full" />
                <img 
                  src="/donkey-mascot.png" 
                  alt="AkkaRabbit VIP" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]" 
                />
              </div>

              {/* Copy & CTA */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-xs font-mono mb-4">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Acesso Liberado - Nível VIP</span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">
                  O Segredo dos Tubarões Não Está Apenas no Cloaking...
                </h2>
                
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Ter a melhor tecnologia é apenas 50% do jogo. Os outros 50% são as <strong>conexões</strong>. 
                  Você agora tem acesso direto ao nosso QG Secreto: um grupo onde os maiores players do mercado de tráfego, 
                  afiliados milionários e produtores trocam estratégias, ferramentas e ofertas validadas que não estão 
                  abertas ao público comum.
                </p>

                <Link
                  href="https://chat.whatsapp.com/C6RTRUu4AozHcadvKjsy3k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-neon text-black px-6 py-3 rounded-lg font-semibold hover:bg-neon-hover transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] group/btn w-full md:w-auto justify-center"
                >
                  <Users className="w-5 h-5" />
                  Entrar no Grupo VIP
                  <ExternalLink className="w-4 h-4 ml-1 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="glass-card rounded-xl p-5 border-l-2 border-l-neon">
              <Zap className="w-5 h-5 text-neon mb-3" />
              <h3 className="text-white font-medium mb-1">Estratégias Vazadas</h3>
              <p className="text-xs text-text-muted">
                Discussões avançadas sobre VSLs, criativos virais e funis de alta conversão direto do campo de batalha.
              </p>
            </div>
            <div className="glass-card rounded-xl p-5 border-l-2 border-l-neon">
              <ShieldCheck className="w-5 h-5 text-neon mb-3" />
              <h3 className="text-white font-medium mb-1">Networking de Elite</h3>
              <p className="text-xs text-text-muted">
                Faça parcerias, encontre sócios, coprodutores ou simplesmente absorva o conhecimento de quem faz +7 dígitos.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Rules */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-warning" />
              Regras do QG
            </h3>
            
            <ul className="space-y-4 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-neon shrink-0 mt-0.5" />
                <span><strong className="text-white">Proibido Spam:</strong> Zero tolerância para links de afiliados ou autopromoção sem contexto.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-neon shrink-0 mt-0.5" />
                <span><strong className="text-white">Transparência:</strong> Troque conhecimento real. Se você pede ajuda, esteja disposto a ajudar.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-neon shrink-0 mt-0.5" />
                <span><strong className="text-white">Sigilo:</strong> As estratégias compartilhadas no grupo ficam no grupo. Não vaze métodos de outros membros.</span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-xs text-warning leading-relaxed">
                A quebra dessas regras resultará no banimento imediato do grupo e revogação do acesso ao benefício Networking VIP, independentemente do seu plano ativo.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
