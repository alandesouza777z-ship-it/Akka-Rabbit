"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headset,
  Mail,
  FileText,
  ExternalLink,
  Clock,
  Send,
  Bot,
  User,
  Sparkles,
  X,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

/* ==================== AI KNOWLEDGE BASE ==================== */
interface KBEntry {
  keywords: string[];
  answer: string;
}

const knowledgeBase: KBEntry[] = [
  {
    keywords: ["instalar", "script", "instalação", "colocar", "colar", "head", "como usar"],
    answer: "Para instalar a proteção:\n\n1. Vá em **Domínios** no menu lateral\n2. Clique em **Adicionar Domínio** e insira sua URL\n3. Clique no ícone de **Copiar Script**\n4. Cole o script dentro da tag `<head>` da sua página\n\nO script ativa automaticamente assim que detectar o primeiro acesso.",
  },
  {
    keywords: ["preço", "plano", "valor", "quanto custa", "starter", "pro", "enterprise", "upgrade", "assinatura"],
    answer: "Oferecemos 3 planos:\n\n• **Starter** — 1 domínio, 5.000 req/mês\n• **Pro** — 5 domínios, 50.000 req/mês\n• **Enterprise** — Domínios ilimitados, requisições ilimitadas + Cloaking + Hijacking\n\nVocê pode fazer upgrade na aba **Configurações**.",
  },
  {
    keywords: ["cloaking", "cloak", "blackhat", "safe page", "página branca", "aprovação", "facebook", "meta", "google ads"],
    answer: "O sistema de **Cloaking** está disponível no plano Enterprise. Ele funciona assim:\n\n1. Ative o toggle **Ativar Redirecionamento de Bots** no domínio\n2. Insira a URL da sua **Página Safe** (página branca/limpa)\n3. Quando um bot do Facebook ou Google acessar sua página, ele verá apenas a página safe\n4. Visitantes reais verão sua oferta original\n\nIsso garante aprovação automática dos seus anúncios.",
  },
  {
    keywords: ["api", "key", "chave", "integração", "webhook"],
    answer: "Sua **API Key** pode ser encontrada em **API Keys** no menu lateral. Use ela no header `X-API-Key` de todas as requisições ao Shield.\n\n⚠️ Nunca exponha sua chave no frontend. Use variáveis de ambiente no servidor.",
  },
  {
    keywords: ["bloqueio", "bloqueado", "spy", "espião", "adspy", "dropispy", "bigspy"],
    answer: "O AkkaRabbit bloqueia automaticamente:\n\n• **Spy Tools** — AdSpy, BigSpy, Dropispy, SimilarWeb\n• **Bots/Webdrivers** — Selenium, Puppeteer, Playwright\n• **Data Centers** — IPs de servidores AWS, Google Cloud\n• **VPNs/Proxies** — Conexões suspeitas\n• **Canvas Emulation** — Navegadores sem GPU real\n\nTudo é registrado na aba **Security Logs**.",
  },
  {
    keywords: ["lento", "velocidade", "performance", "pesado", "demora"],
    answer: "Não se preocupe! O script do AkkaRabbit executa em **menos de 50ms** e roda de forma **assíncrona**. Ele nunca bloqueia o carregamento da sua página.\n\nA verificação acontece em background via Edge Computing (Vercel), garantindo latência mínima.",
  },
  {
    keywords: ["hijack", "retaliação", "checkout", "vsl", "trocar link", "injeção"],
    answer: "O **Hijacking de Funil** (Enterprise) permite:\n\n• Trocar a **URL do Checkout** remotamente pelo painel\n• Injetar **VSL dinâmica** sem mexer no código do site\n• **Retaliação contra clones** — se alguém copiar sua página, os botões de compra redirecionam para o SEU checkout\n\nConfigure tudo na aba **Domínios** → Arsenal Enterprise.",
  },
  {
    keywords: ["premiação", "plaquinha", "milestone", "recompensa", "emerald", "ruby", "gold"],
    answer: "O sistema de **Premiações** recompensa você por ameaças mitigadas:\n\n🟢 **Emerald** — 10 milhões de bloqueios\n🔴 **Ruby** — 25 milhões de bloqueios\n🟡 **Gold Rabbit** — 50 milhões de bloqueios (Apex Tier)\n\nAcompanhe seu progresso na aba **Premiações** no menu lateral.",
  },
  {
    keywords: ["honeypot", "armadilha", "invisível", "trap"],
    answer: "O **Honeypot** é uma armadilha invisível que inserimos na sua página. São links com tamanho 0x0 pixels — invisíveis para humanos, mas que robôs tentam clicar.\n\nQuando um bot clica na armadilha, ele é **banido permanentemente**. Ative na aba Domínios → Cloaking (BlackHat).",
  },
  {
    keywords: ["canvas", "fingerprint", "gpu", "placa de vídeo"],
    answer: "O **Canvas Fingerprinting** analisa a placa de vídeo do visitante. Servidores de Data Center não têm GPUs reais, então a assinatura gráfica deles é diferente.\n\nQuando ativado, o AkkaRabbit bloqueia automaticamente navegadores sem hardware gráfico real.",
  },
  {
    keywords: ["domínio", "adicionar domínio", "registrar", "site"],
    answer: "Para adicionar um domínio:\n\n1. Acesse **Domínios** no menu lateral\n2. Clique em **Adicionar Domínio**\n3. Insira apenas o domínio (ex: `meusite.com`)\n4. O sistema gerará um token e script únicos\n5. O status muda para **Active** no primeiro ping\n\nO limite de domínios depende do seu plano.",
  },
  {
    keywords: ["suporte", "ajuda", "contato", "email", "humano", "atendente"],
    answer: "Você pode falar comigo (IA) aqui no chat para respostas instantâneas! 🤖\n\nPara suporte humano:\n• **Email:** suporte@akkarabbit.com\n• **Tempo de resposta:** < 2 horas (horário comercial)\n\nEstou disponível 24/7 para tirar dúvidas técnicas.",
  },
];

function getAIResponse(message: string): string {
  const lower = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (const entry of knowledgeBase) {
    const match = entry.keywords.some((kw) => lower.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
    if (match) return entry.answer;
  }

  // Greetings
  if (/^(oi|olá|ola|hey|hello|boa tarde|bom dia|boa noite|eae|e ai)/i.test(lower)) {
    return "Olá! 👋 Sou a **AkkaBot**, assistente virtual do AkkaRabbit.\n\nComo posso te ajudar hoje? Pode me perguntar sobre:\n• Instalação do script\n• Planos e preços\n• Cloaking e BlackHat\n• Segurança e bloqueios\n• Ou qualquer outra dúvida!";
  }

  if (/obrigad|valeu|thanks|vlw/i.test(lower)) {
    return "De nada! 😊 Se precisar de mais alguma coisa, estou por aqui 24/7. Proteger seus funis é a minha missão! 🛡️";
  }

  return "Não encontrei uma resposta específica para essa pergunta. 🤔\n\nTente reformular ou pergunte sobre:\n• **Instalação** do script\n• **Planos** e preços\n• **Cloaking** e aprovação de anúncios\n• **Segurança** e bloqueios\n\nOu entre em contato com nosso time humano em **suporte@akkarabbit.com**";
}

/* ==================== CHAT INTERFACE ==================== */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function AIChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! 👋 Sou a **AkkaBot**, sua assistente de suporte com IA.\n\nDigite sua dúvida e eu te ajudo na hora — disponível 24/7!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI "thinking" delay (400-1200ms)
    const delay = 400 + Math.random() * 800;
    setTimeout(() => {
      const response = getAIResponse(trimmed);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Bold
      let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      // Inline code
      processed = processed.replace(/`(.+?)`/g, '<code class="text-neon bg-neon/10 px-1.5 py-0.5 rounded text-[11px] font-mono">$1</code>');
      // Bullet points
      if (processed.startsWith("• ") || processed.startsWith("- ")) {
        processed = `<span class="text-neon mr-1.5">›</span>${processed.slice(2)}`;
      }
      // Numbered lists
      const numMatch = processed.match(/^(\d+)\.\s/);
      if (numMatch) {
        processed = `<span class="text-neon font-mono mr-1.5">${numMatch[1]}.</span>${processed.slice(numMatch[0].length)}`;
      }

      return (
        <span key={i} className="block" dangerouslySetInnerHTML={{ __html: processed || "&nbsp;" }} />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card-static border border-white/[0.06] overflow-hidden flex flex-col h-[600px] max-h-[70vh]"
    >
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/20">
            <Bot className="w-4 h-4 text-neon" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              AkkaBot
              <Sparkles className="w-3 h-3 text-amber-400" />
            </p>
            <p className="text-[11px] text-neon font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-neon" />
              Online — IA Assistente
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors text-text-muted hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/15 shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-neon" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-neon/10 text-white border border-neon/15"
                  : "bg-white/[0.03] text-text-secondary border border-white/[0.04]"
              }`}
            >
              {renderContent(msg.content)}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/[0.06] shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-text-secondary" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-neon/10 flex items-center justify-center border border-neon/15 shrink-0">
              <Bot className="w-3.5 h-3.5 text-neon" />
            </div>
            <div className="bg-white/[0.03] border border-white/[0.04] rounded-xl px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/[0.04] bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida..."
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-[13px] text-white placeholder-text-muted outline-none focus:border-neon/30 focus:ring-1 focus:ring-neon/10 transition-all"
            id="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-lg bg-neon/10 border border-neon/20 text-neon hover:bg-neon/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            id="chat-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-text-muted mt-2 text-center">
          Powered by AkkaBot AI — respostas instantâneas 24/7
        </p>
      </div>
    </motion.div>
  );
}

/* ==================== MAIN SUPPORT PAGE ==================== */
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
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-[1100px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2.5">
          <Headset className="w-5 h-5 text-neon" />
          Central de Suporte
        </h1>
        <p className="text-text-muted text-sm mt-1.5">
          Precisa de ajuda? Converse com nossa IA ou consulte a documentação.
        </p>
      </div>

      {/* Layout: Chat + Sidebar */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left: AI Chat (takes 3 cols) */}
        <div className="lg:col-span-3">
          {chatOpen ? (
            <AIChatWindow onClose={() => setChatOpen(false)} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card group cursor-pointer p-8 text-center"
              onClick={() => setChatOpen(true)}
            >
              <div className="w-16 h-16 rounded-2xl bg-neon/[0.06] border border-neon/15 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform animate-glow-pulse">
                <Bot className="w-8 h-8 text-neon" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center justify-center gap-2">
                AkkaBot
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-[13px] text-text-muted leading-relaxed mb-5 max-w-sm mx-auto">
                Assistente com IA treinada em toda a documentação do AkkaRabbit.
                Respostas instantâneas, 24 horas por dia.
              </p>
              <span className="btn-neon-filled inline-flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4" />
                Iniciar Conversa
              </span>
            </motion.div>
          )}
        </div>

        {/* Right: Contact channels (takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="glass-card p-5 group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-400/8 flex items-center justify-center rounded-xl">
                <Mail className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Email</h3>
                <p className="text-[11px] text-text-muted">suporte@akkarabbit.com</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-400 group-hover:gap-2 transition-all">
              Enviar Email <ExternalLink className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Docs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="glass-card p-5 group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-amber-400/8 flex items-center justify-center rounded-xl">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Documentação</h3>
                <p className="text-[11px] text-text-muted">Guias de instalação e API</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-400 group-hover:gap-2 transition-all">
              Acessar Docs <ExternalLink className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="glass-card-static p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-neon/[0.06] flex items-center justify-center rounded-xl border border-neon/10">
                <Clock className="w-4 h-4 text-neon" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Resposta Humana</p>
                <p className="text-[11px] text-text-muted">
                  <span className="font-mono text-neon font-semibold">&lt; 2h</span> — Seg a Sex, 9h-18h
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Perguntas Frequentes</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
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
