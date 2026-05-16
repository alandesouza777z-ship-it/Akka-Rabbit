"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, CheckCircle2, QrCode, Loader2 } from "lucide-react";

interface PixCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeImage: string;
  qrCodePayload: string;
  value: number;
}

export default function PixCheckoutModal({ isOpen, onClose, qrCodeImage, qrCodePayload, value }: PixCheckoutModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCodePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-neon/50 shadow-[0_0_30px_rgba(0,255,65,0.15)] p-1 rounded-sm pointer-events-auto"
            >
              <div className="relative p-6 sm:p-8 bg-black">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-neon" />
                    <h3 className="font-mono text-white text-lg tracking-wider">PAGAMENTO <span className="text-neon">PIX</span></h3>
                  </div>
                  <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* QR Code Container */}
                <div className="flex justify-center mb-8">
                  <div className="relative p-3 bg-white rounded-sm">
                    {/* Corner Cyberpunk Details */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-neon" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-neon" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-neon" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-neon" />
                    
                    {qrCodeImage ? (
                      <img src={`data:image/png;base64,${qrCodeImage}`} alt="QR Code PIX" className="w-48 h-48 object-contain" />
                    ) : (
                      <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mb-8">
                  <p className="text-text-muted font-mono text-sm mb-1">Total a pagar:</p>
                  <p className="text-3xl font-bold text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  </p>
                </div>

                {/* Copia e Cola */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neon uppercase tracking-widest">PIX Copia e Cola</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={qrCodePayload} 
                      readOnly 
                      className="w-full bg-black border border-border-neon text-text-muted text-xs p-3 font-mono focus:outline-none focus:border-neon truncate"
                    />
                    <button 
                      onClick={handleCopy}
                      className="shrink-0 p-3 bg-neon/10 hover:bg-neon/20 border border-neon/50 text-neon transition-colors flex items-center justify-center"
                      title="Copiar código"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs text-text-secondary font-mono animate-pulse">
                    &gt; Aguardando confirmação do pagamento...
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
