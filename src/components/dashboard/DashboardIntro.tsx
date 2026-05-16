"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasPlayed = sessionStorage.getItem("akka_intro_played");
    if (!hasPlayed) {
      setShowIntro(true);
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("akka_intro_played", "true");
      }, 7500); // Intro duration: 7.5 seconds total
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Grid Background Effect */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              transform: "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Step 1: Text */}
            <motion.p
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="font-mono text-text-muted text-sm tracking-[0.2em] uppercase mb-16 text-center"
            >
              Bem vindo ao submundo do mercado digital
            </motion.p>

            {/* Step 2: Rabbit SVG Drawing */}
            <motion.svg
              viewBox="0 0 100 100"
              className="w-40 h-40 overflow-visible"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.5 }}
            >
              {/* Outer Rabbit Silhouette */}
              <motion.path
                d="M 50 90 L 25 60 L 15 10 L 35 30 L 50 40 L 65 30 L 85 10 L 75 60 Z"
                fill="transparent"
                stroke="#00FF41"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 2.5 }}
                style={{ filter: "drop-shadow(0 0 10px rgba(0,255,65,0.8))" }}
              />
              
              {/* Inner geometric details */}
              <motion.path
                d="M 25 60 L 50 70 L 75 60 M 35 30 L 50 70 L 65 30 M 50 40 L 50 70"
                fill="transparent"
                stroke="#00FF41"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 3.5 }}
              />

              {/* Glowing Eyes */}
              <motion.circle
                cx="38"
                cy="50"
                r="2"
                fill="#00FF41"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 4.5 }}
                style={{ filter: "drop-shadow(0 0 5px #00FF41)" }}
              />
              <motion.circle
                cx="62"
                cy="50"
                r="2"
                fill="#00FF41"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 4.5 }}
                style={{ filter: "drop-shadow(0 0 5px #00FF41)" }}
              />
            </motion.svg>

            {/* Step 3: Brand Name Pulsing */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 5.5 }}
              className="mt-12 text-4xl font-bold font-mono text-neon uppercase tracking-[0.3em]"
              style={{ textShadow: "0 0 20px rgba(0,255,65,0.6)" }}
            >
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Akka Rabbit
              </motion.span>
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
