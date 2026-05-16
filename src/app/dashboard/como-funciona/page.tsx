"use client";

import { motion } from "framer-motion";
import { 
  Shield, AlertTriangle, Eye, Server, Lock, Cpu, Globe, 
  Terminal, Fingerprint, Bug, Zap, ExternalLink 
} from "lucide-react";

export default function DashboardComoFunciona() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-neon" />
          Central de Inteligência AkkaRabbit
        </h1>
        <p className="text-text-muted mt-2 text-sm max-w-2xl">
          Você tem em mãos a infraestrutura de cloaking e proteção mais avançada do mercado. 
          Entenda exatamente como cada engrenagem militar do nosso sistema funciona para esmagar seus concorrentes.
        </p>
      </div>

      {/* Visão Geral do Sistema */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-8"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <Server className="text-neon" /> O Motor de Edge Computing
        </h2>
        <div className="prose prose-invert max-w-none text-text-secondary text-sm leading-relaxed space-y-4">
          <p>
            O AkkaRabbit não é apenas um "camuflador de links". Ferramentas antigas fazem você criar um link novo e redirecionar o usuário. Isso é lento e facilmente rastreável pelo Google e Facebook.
          </p>
          <p>
            Nós usamos <strong>Edge Computing</strong> e <strong>Scripts de Injeção Direta</strong>. Você instala o nosso pequeno código <code>&lt;script&gt;</code> direto na sua Landing Page original. Assim que qualquer pessoa, robô ou espião acessa o seu site, o nosso script paralisa o carregamento da página por alguns milissegundos e envia a impressão digital daquele acesso para a nossa API.
          </p>
          <p>
            Se a nossa API responder <code>blocked: false</code>, a página termina de carregar. Se responder <code>blocked: true</code>, o visitante é arremessado para fora antes mesmo de conseguir ler o título da sua copy.
          </p>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* A Página do Burro */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-8 border border-warning/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <AlertTriangle className="w-32 h-32 text-warning" />
          </div>
          <h2 className="text-lg font-bold text-warning mb-4 flex items-center gap-2">
            <AlertTriangle /> A "Página do Burro"
          </h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <div className="bg-black/40 p-4 rounded-lg flex items-center gap-4">
              <img src="/donkey-mascot.png" alt="Mascote" className="w-16 h-16 object-contain" />
              <p className="text-xs">
                Esta é a página de humilhação oficial do AkkaRabbit. Ela fica hospedada em um servidor secreto.
              </p>
            </div>
            <p>
              <strong>O que é?</strong> É uma tela de bloqueio com a imagem do nosso mascote (o Burro).
            </p>
            <p>
              <strong>Quando aparece?</strong> Quando o sistema detecta que o acesso veio de um IP de Data Center (onde as ferramentas de AdSpy rodam), ou quando detecta um VPN, ou quando tentam abrir o seu site com o Chrome em modo "Headless" (Invisível, típico de programadores tentando raspar seus dados).
            </p>
            <p>
              <strong>O resultado:</strong> O espião não consegue nem ver a cor do botão da sua Landing Page.
            </p>
          </div>
        </motion.section>

        {/* Cloak Bots (Safe Page) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-8"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-neon" /> Cloaking para Robôs Oficiais
          </h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <p>
              Os robôs oficiais do <strong>Google (Googlebot)</strong> e <strong>Facebook (Meta Crawler)</strong> não são espiões comuns. Eles definem se o seu anúncio vai ser aprovado ou tomar bloqueio na conta.
            </p>
            <p>
              <strong>Como lidamos com eles:</strong>
              No painel "Domínios", você pode ativar a chave <em>"Ativar Cloak (Redirecionar Robôs Oficiais)"</em> e colocar o link de uma <strong>Safe Page</strong> (Uma página limpa, como um blog de saúde genérico).
            </p>
            <p>
              Quando o sistema identifica (via DNS Reverse Lookup) que quem está acessando é o robô oficial do Mark Zuckerberg, nós sorrimos, abrimos a porta e dizemos: <em>"Pode entrar, senhor"</em>, mas o enviamos direto para a Safe Page. Ele aprova o anúncio, e o cliente humano real que vier depois verá a sua oferta agressiva (VSL).
            </p>
          </div>
        </motion.section>

        {/* O Cavalo de Tróia (Enterprise) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-8 border border-red-500/20 md:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-red-500 flex items-center gap-2">
              <Bug /> O Cavalo de Tróia (Retaliação Enterprise)
            </h2>
            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] uppercase font-mono rounded-sm border border-red-500/20">Exclusivo Enterprise</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-text-secondary">
            <div className="space-y-4">
              <p>
                O mercado está cheio de "clonadores de página". Eles usam ferramentas como o HTTrack para baixar o código fonte do seu site e hospedam em um domínio deles (ex: <code>oferta-milionaria.com</code>). Se ele copiar o seu HTML bruto, o nosso script de proteção vai colado junto.
              </p>
              <p>
                Quando o clonador coloca o site dele no ar, o nosso script verifica: <em>"Ei, eu estou rodando no domínio oferta-milionaria.com, mas o meu dono (Você) só me autorizou a rodar no domínio oferta-oficial.com"</em>.
              </p>
              <p>
                No plano Starter/Pro, nós bloqueamos e mostramos a página do Burro. Mas se você é <strong>Enterprise</strong>, nós fazemos algo muito pior:
              </p>
            </div>
            <div className="bg-red-500/5 p-5 rounded-lg border border-red-500/10 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-500" /> A Retaliação
              </h3>
              <p>
                Nós deixamos a página clonada funcionar perfeitamente. O espião vai achar que conseguiu e vai começar a subir campanhas de Facebook Ads pagando do próprio bolso.
              </p>
              <p>
                Porém, nosso script invisível vai caçar todos os botões de Checkout do site clonado e vai <strong>substituir o link de afiliado dele pelo SEU link de Checkout</strong> que você configurou no painel.
              </p>
              <p className="text-red-400 font-bold">
                Resultado: O clonador gasta o orçamento de tráfego dele para fazer vendas que vão cair direto na sua conta bancária.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Módulo Fingerprint e VSL Dinâmico */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-8"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Fingerprint className="text-neon" /> Fingerprint de Canvas
          </h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <p>
              Nós desenhamos uma imagem invisível usando a Placa de Vídeo (GPU) do usuário quando ele acessa a página. Celulares e computadores reais geram assinaturas matemáticas únicas ao renderizar gráficos. 
            </p>
            <p>
              Robôs emuladores não têm placa de vídeo física. O desenho gerado por eles sai sem a assinatura correta (ou dá erro). Essa é a nossa armadilha de hardware: se o Canvas Fingerprint falhar, é robô, e ele vai direto pro burro.
            </p>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-8"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="text-neon" /> Injeção de VSL Dinâmico
          </h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <p>
              Você pode esconder o código do seu vídeo (do VTurb, Vimeo, YouTube) no nosso painel do AkkaRabbit. No código HTML da sua página, você deixa o espaço do vídeo vazio, apenas com <code>data-akka="vsl"</code>.
            </p>
            <p>
              Se a nossa API confirmar que é um visitante humano legítimo, ela injeta o iframe do vídeo magicamente na tela. Se o espião baixar o seu site com ferramentas de raspagem (scraper), ele vai levar um site sem vídeo nenhum, com um buraco na página.
            </p>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
