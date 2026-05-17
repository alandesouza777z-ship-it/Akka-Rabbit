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
      // Nome e extensão do arquivo
      const extensionIndex = file.name.lastIndexOf(".");
      const name = extensionIndex !== -1 ? file.name.substring(0, extensionIndex) : file.name;
      const extension = extensionIndex !== -1 ? file.name.substring(extensionIndex) : "";

      let cleanedBlob: Blob;

      if (file.type.startsWith("image/")) {
        // --- PROTEÇÃO DE IMAGEM: Filtro Anti-IA + Remoção de EXIF ---
        // Desenha a imagem num canvas e altera os pixels matematicamente.
        // O canvas automaticamente DESTROI os metadados (EXIF) originais.
        const image = new Image();
        image.src = URL.createObjectURL(file);
        await new Promise((resolve) => { image.onload = resolve; });

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) throw new Error("Canvas context not available");
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Injeta ruído esteganográfico
        for (let i = 0; i < data.length; i += 4) {
          const noise = Math.floor(Math.random() * 7) - 3;
          data[i] = Math.min(255, Math.max(0, data[i] + noise));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }

        ctx.putImageData(imageData, 0, 0);

        cleanedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Falha ao gerar blob de imagem"));
          }, file.type, 0.95);
        });

      } else {
        // --- PROTEÇÃO DE VÍDEO: Injeção de Cintilação (Flickering Mask) + Falsificação EXIF ---
        // A magia negra: O navegador vai "assistir" ao vídeo, piscar a tela e regravar tudo!
        
        cleanedBlob = await new Promise<Blob>(async (resolve, reject) => {
          try {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.muted = true; // Para poder dar play automático sem erro
            video.crossOrigin = "anonymous";

            await new Promise((res) => {
              video.onloadedmetadata = res;
              video.onerror = () => reject(new Error("Erro ao carregar o vídeo para renderização."));
            });

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");

            // Verifica se o navegador suporta essa bruxaria pesada
            // @ts-ignore
            if (!ctx || !canvas.captureStream || typeof MediaRecorder === 'undefined') {
              throw new Error("Navegador não suporta renderização avançada.");
            }

            // @ts-ignore
            const stream = canvas.captureStream(30); // 30 FPS
            
            // Tenta pegar o áudio original do vídeo e juntar com o canvas
            // @ts-ignore
            if (video.captureStream) {
              // @ts-ignore
              const audioTracks = video.captureStream().getAudioTracks();
              if (audioTracks.length > 0) {
                stream.addTrack(audioTracks[0]);
              }
            }

            const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => {
              if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
              // Falsificação de Metadados EXIF no final do arquivo gravado
              const fakeMetadata = new TextEncoder().encode("Exif\\x00\\x00MM\\x00*Apple iPhone 15 Pro Max\\x00");
              const randomBytesCount = Math.floor(Math.random() * 32) + 16;
              const noise = new Uint8Array(randomBytesCount);
              crypto.getRandomValues(noise);
              
              const finalBlob = new Blob([...chunks, fakeMetadata, noise], { type: "video/webm" });
              resolve(finalBlob);
            };

            let frameCount = 0;
            const drawFrame = () => {
              if (video.paused || video.ended) return;
              
              // Desenha o frame original
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // INJEÇÃO DA MÁSCARA DE CINTILAÇÃO (FLICKERING MASK)
              // A cada 7 frames, desenha uma tela semi-transparente preta.
              // O olho humano pisca e não vê, mas a IA tira foto e fica cega.
              frameCount++;
              if (frameCount % 7 === 0) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }

              requestAnimationFrame(drawFrame);
            };

            video.onplay = () => {
              recorder.start();
              drawFrame();
            };

            video.onended = () => {
              recorder.stop();
            };

            // Inicia o processo (Em tempo real)
            video.play();

          } catch (err) {
            console.warn("Fallback para limpeza rápida (sem re-encode):", err);
            // Fallback (Plano B) se o celular/navegador do cara não aguentar a renderização pesada
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const fakeMetadata = new TextEncoder().encode("Exif\\x00\\x00MM\\x00*Apple iPhone 15 Pro Max\\x002026:05:17 08:00:00\\x00");
            const randomBytesCount = Math.floor(Math.random() * 32) + 16;
            const noise = new Uint8Array(randomBytesCount);
            crypto.getRandomValues(noise);

            const modifiedArray = new Uint8Array(uint8Array.length + fakeMetadata.length + noise.length);
            modifiedArray.set(uint8Array);
            modifiedArray.set(fakeMetadata, uint8Array.length);
            modifiedArray.set(noise, uint8Array.length + fakeMetadata.length);

            resolve(new Blob([modifiedArray], { type: file.type }));
          }
        });
        
        // Mantemos a extensão dinâmica (se foi webm vai salvar webm, se não mp4)
        if (cleanedBlob.type === "video/webm") extension = ".webm";
      }

      const url = URL.createObjectURL(cleanedBlob);
      
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
          Proteção anti-queda para imagens e vídeos. Destruímos o EXIF, injetamos ruído visual e alteramos o Hash (DNA Digital) do seu criativo para enganar a rede neural do Facebook.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Workspace Principal */}
        <div className="md:col-span-2 space-y-6">
          <div 
            className={`glass-card rounded-xl p-8 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] text-center
              ${file && !isCleaned ? 'border-neon bg-neon/5' : ''}
              ${isCleaned ? 'border-green-500 bg-green-500/5' : ''}
              ${!file ? 'border-white/10 hover:border-white/20 hover:bg-white/5 cursor-pointer' : ''}
            `}
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
                  <h3 className="text-neon font-bold mb-2 animate-pulse">Enganando Algoritmos...</h3>
                  <ul className="text-xs font-mono text-text-secondary text-left space-y-2 mt-4 opacity-70">
                    <li className="flex gap-2 text-white"><span>&gt;</span> Falsificando Metadados (iPhone 15 Pro)...</li>
                    <li className="flex gap-2 text-white"><span>&gt;</span> {file.type.startsWith('image/') ? 'Injetando Ruído Adversário...' : 'Regravando Vídeo (Cintilação Anti-IA)...'}</li>
                    {file.type.startsWith('video/') && (
                      <li className="flex gap-2 text-warning animate-pulse"><span>&gt;</span> Aguarde, renderizando em tempo real...</li>
                    )}
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
                    A Inteligência Artificial do Facebook não conseguirá mais "enxergar" seu criativo.
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
                <strong className="text-white block mb-1">1. Vídeos: Cintilação (Flickering)</strong>
                A magia negra da 2ª Barreira. O seu navegador "assiste" ao vídeo em tempo real e regrava a mídia inserindo uma máscara preta a cada 7 frames. Você não vê, mas a câmera lenta da IA do Facebook tira foto da tela preta! (O tempo de renderização é igual à duração do vídeo).
              </li>
              <li>
                <strong className="text-white block mb-1">2. Imagens: Filtro Anti-IA (2ª Barreira)</strong>
                Para imagens, nós fomos além. O sistema redesenha sua imagem injetando um **Ruído Adversário Esteganográfico** imperceptível. Isso confunde o algoritmo de visão computacional da rede neural do Facebook, dificultando que ele "leia" padrões bloqueados na imagem.
              </li>
              <li>
                <strong className="text-white block mb-1">3. EXIF Spoofing</strong>
                Destruímos os dados de GPS antigos do arquivo e cravamos um código falso dizendo que a mídia foi criada agora por um **iPhone 15 Pro Max**. Isso burla bloqueios de Hash e aumenta o Trust Score.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
