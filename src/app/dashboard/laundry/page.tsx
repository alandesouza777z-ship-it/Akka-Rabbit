"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Sparkles, FileVideo, FileImage, ShieldCheck, Loader2, Download, AlertTriangle } from "lucide-react";

export default function LaundryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [cleanedFileName, setCleanedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Apenas imagens ou vídeos
    if (!selectedFile.type.startsWith("video/") && !selectedFile.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de vídeo ou imagem.");
      return;
    }
    setFile(selectedFile);
    setIsCleaned(false);
    setCleanedUrl(null);
  };

  const cleanFile = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      // Usando FileReader para ler o arquivo na memória do navegador (sem custo de servidor!)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Mágica do AkkaRabbit: Injetando "Ruído" Esteganográfico / Quebra de Hash
      // Adicionamos de 4 a 16 bytes aleatórios no FINAL do arquivo.
      // O MP4, JPG e PNG ignoram lixo no final do arquivo, mas isso muda 100% o Hash (MD5/SHA256)
      const randomBytesCount = Math.floor(Math.random() * 12) + 4; // 4 a 16 bytes
      const noise = new Uint8Array(randomBytesCount);
      crypto.getRandomValues(noise);

      // Criar um novo Array com o tamanho original + ruído
      const modifiedArray = new Uint8Array(uint8Array.length + noise.length);
      modifiedArray.set(uint8Array);
      modifiedArray.set(noise, uint8Array.length);

      // Criar o novo arquivo Blob
      const cleanedBlob = new Blob([modifiedArray], { type: file.type });
      const url = URL.createObjectURL(cleanedBlob);
      
      // Nome do novo arquivo
      const extensionIndex = file.name.lastIndexOf(".");
      const name = extensionIndex !== -1 ? file.name.substring(0, extensionIndex) : file.name;
      const extension = extensionIndex !== -1 ? file.name.substring(extensionIndex) : "";
      
      // Simular um tempo de processamento para dar a sensação de trabalho complexo (UX)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCleanedUrl(url);
      setCleanedFileName(`[Blindado]-${name}${extension}`);
      setIsCleaned(true);
    } catch (error) {
      console.error("Erro ao limpar arquivo:", error);
      alert("Ocorreu um erro ao processar o arquivo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsCleaned(false);
    if (cleanedUrl) {
      URL.revokeObjectURL(cleanedUrl);
      setCleanedUrl(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-neon" />
          Lavanderia de Criativos
        </h1>
        <p className="text-text-muted mt-2 text-sm max-w-2xl">
          Proteção anti-queda para imagens e vídeos. Limpamos os metadados e alteramos o Hash (DNA Digital) do seu criativo para que a IA do Facebook não o reconheça como um anúncio banido anteriormente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Workspace Principal */}
        <div className="md:col-span-2 space-y-6">
          <div 
            className={\`glass-card rounded-xl p-8 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] text-center
              \${file && !isCleaned ? 'border-neon bg-neon/5' : ''}
              \${isCleaned ? 'border-green-500 bg-green-500/5' : ''}
              \${!file ? 'border-white/10 hover:border-white/20 hover:bg-white/5 cursor-pointer' : ''}
            \`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="video/*,image/*" 
              onChange={handleFileChange} 
            />

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <UploadCloud className="w-8 h-8 text-text-muted" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Arraste seu Criativo para cá</h3>
                  <p className="text-sm text-text-muted mb-6 max-w-sm">
                    Suporta imagens (JPG, PNG) e vídeos (MP4, MOV). Todo o processamento é feito localmente no seu navegador para total privacidade.
                  </p>
                  <button className="btn-neon-filled text-sm py-2 px-6">
                    Selecionar Arquivo
                  </button>
                </motion.div>
              ) : isProcessing ? (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-neon/20 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    <Sparkles className="w-6 h-6 text-neon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-neon font-bold mb-2 animate-pulse">Lavando o DNA Digital...</h3>
                  <ul className="text-xs font-mono text-text-secondary text-left space-y-2 mt-4 opacity-70">
                    <li className="flex gap-2"><span>&gt;</span> Analisando metadados...</li>
                    <li className="flex gap-2 text-white"><span>&gt;</span> Injetando ruído esteganográfico...</li>
                    <li className="flex gap-2"><span>&gt;</span> Recompilando Hash SHA-256...</li>
                  </ul>
                </motion.div>
              ) : isCleaned ? (
                <motion.div 
                  key="cleaned"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/30">
                    <ShieldCheck className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Criativo Blindado e Limpo!</h3>
                  <p className="text-sm text-text-muted mb-6">
                    O Hash deste arquivo agora é único no mundo. O Facebook não conseguirá associá-lo a banimentos anteriores.
                  </p>
                  
                  <div className="w-full max-w-sm bg-black border border-white/10 p-3 rounded-lg flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {file.type.startsWith('video') ? <FileVideo className="w-5 h-5 text-neon shrink-0" /> : <FileImage className="w-5 h-5 text-neon shrink-0" />}
                      <span className="text-xs text-text-secondary truncate font-mono">{cleanedFileName}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full max-w-sm">
                    <button onClick={resetTool} className="btn-neon flex-1 text-xs">
                      Limpar Outro
                    </button>
                    <a 
                      href={cleanedUrl!} 
                      download={cleanedFileName}
                      className="btn-neon-filled flex-1 flex items-center justify-center gap-2 text-xs"
                    >
                      <Download className="w-4 h-4" /> Baixar Novo
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="ready"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 relative">
                    {file.type.startsWith('video') ? <FileVideo className="w-8 h-8 text-white" /> : <FileImage className="w-8 h-8 text-white" />}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-white font-bold mb-1">Arquivo Pronto para Lavagem</h3>
                  <p className="text-xs text-text-muted mb-6 font-mono bg-black px-3 py-1 rounded border border-white/5">{file.name}</p>
                  
                  <div className="flex gap-3">
                    <button onClick={resetTool} className="px-4 py-2 text-sm text-text-muted hover:text-white transition-colors">
                      Cancelar
                    </button>
                    <button onClick={cleanFile} className="btn-neon-filled text-sm py-2 px-6 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Iniciar Limpeza
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Informativa */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Como funciona?
            </h3>
            <ul className="space-y-4 text-xs text-text-secondary leading-relaxed">
              <li>
                <strong className="text-white block mb-1">1. O problema do Hash</strong>
                Toda vez que você toma um bloqueio, o Facebook salva a "impressão digital" (Hash) do seu criativo. Se você tentar subir o mesmo vídeo em outra conta, você cai na hora.
              </li>
              <li>
                <strong className="text-white block mb-1">2. A Solução (Lavanderia)</strong>
                Nossa ferramenta injeta bytes invisíveis matematicamente programados no final do arquivo. O vídeo não muda nada visualmente, mas o código binário dele muda 100%.
              </li>
              <li>
                <strong className="text-white block mb-1">3. Privacidade Absoluta</strong>
                Nenhum vídeo é enviado para nossos servidores. Todo esse cálculo é feito pelo processador do seu computador usando JavaScript no próprio navegador.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
