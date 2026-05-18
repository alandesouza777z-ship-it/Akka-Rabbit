"use client";

import { motion } from "framer-motion";
import { Skull, ArrowRight } from "lucide-react";
import MatrixRain from "@/components/MatrixRain";

export default function TaIndoAondeShow() {
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden select-none">
      
      {/* Immersive Matrix Rain Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <MatrixRain />
      </div>

      {/* Cyber Security Retro Scanlines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10" />

      {/* Main Troll Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative z-20 w-full max-w-xl bg-black/90 border-2 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)] p-1 rounded-2xl overflow-hidden"
      >
        {/* Glowing Red Border Glow */}
        <div className="absolute -inset-px bg-gradient-to-r from-red-500 to-amber-500 rounded-2xl blur opacity-30 animate-pulse pointer-events-none" />

        <div className="relative bg-black/95 rounded-2xl p-6 sm:p-10 flex flex-col items-center text-center space-y-8">
          
          {/* Animated Skull/Lock Emblem */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1], 
              rotate: [0, -5, 5, 0] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "easeInOut" 
            }}
            className="w-20 h-20 rounded-full border-2 border-red-500 bg-red-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          >
            <Skull className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </motion.div>

          {/* Heading (Meme phrase) */}
          <div className="space-y-3">
            <h1 className="font-mono text-3xl sm:text-4xl font-black text-red-500 tracking-wider uppercase animate-pulse">
              TÁ INDO AONDE, SHOW? 🐴
            </h1>
            <p className="font-mono text-xs text-red-400 font-bold uppercase tracking-widest border-y border-red-500/20 py-2">
              [ DETECÇÃO DE ESPIONAGEM / CLONE BLOQUEADA ]
            </p>
          </div>

          {/* User Troll Phrase */}
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl max-w-md">
            <p className="font-mono text-sm sm:text-base text-white font-bold leading-relaxed">
              &quot;pensou que o era o espertão né? seu trouxa, clona ai agora&quot;
            </p>
          </div>

          {/* Interactive Creators Section */}
          <div className="w-full space-y-4 pt-4 border-t border-white/5">
            <span className="font-mono text-[10px] sm:text-xs text-text-muted uppercase tracking-widest block font-bold">
              —— criadores do cloaker ——
            </span>

            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md mx-auto">
              
              {/* Instagram Sócio 1: Alan */}
              <a
                href="https://www.instagram.com/aland.iwnl/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2.5 py-3 px-5 bg-white/5 border border-white/10 hover:border-neon hover:bg-neon/5 hover:text-white rounded-xl text-xs font-mono text-text-secondary transition-all group cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neon group-hover:scale-110 transition-transform">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>@aland.iwnl</span>
                <ArrowRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Instagram Sócio 2: Mateus (Teteu) */}
              <a
                href="https://www.instagram.com/teteu.iwnl/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2.5 py-3 px-5 bg-white/5 border border-white/10 hover:border-neon hover:bg-neon/5 hover:text-white rounded-xl text-xs font-mono text-text-secondary transition-all group cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neon group-hover:scale-110 transition-transform">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>@teteu.iwnl</span>
                <ArrowRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
              </a>

            </div>
          </div>

          {/* Hacker Terminal Details */}
          <div className="w-full font-mono text-[9px] text-red-500/60 flex flex-wrap justify-between gap-2 pt-2">
            <span>DEFENSE: AkkaRabbit v3.0</span>
            <span>STATUS: TARGET_BLACKLISTED</span>
            <span>SYSTEM: SECURE_EDGE_SHIELD</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
