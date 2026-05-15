"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, User, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MatrixRain from "@/components/MatrixRain";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
      // Auto-redirect after 2 seconds if email confirmation is disabled
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center px-4 py-8 sm:p-4 overflow-x-hidden">
      <MatrixRain />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="w-8 h-8 text-neon" />
            <span className="font-mono text-neon font-bold text-xl tracking-wider">
              AKKA<span className="text-white">RABBIT</span>
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="glass-card p-5 sm:p-8 rounded-sm">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto border border-neon flex items-center justify-center mb-4 glow-neon">
                <Shield className="w-8 h-8 text-neon" />
              </div>
              <h2 className="font-mono text-neon text-lg font-bold mb-2">
                Conta Criada com Sucesso
              </h2>
              <p className="text-text-muted text-sm">
                Redirecionando para o painel de controle...
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-mono text-white text-xl font-bold mb-2">
                  <span className="text-neon">&gt;</span> Criar Terminal
                </h1>
                <p className="text-text-muted text-sm">
                  Registre-se para ativar a proteção nos seus funis.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 mb-4 border border-danger/30 bg-danger/10 text-danger text-sm font-mono"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="font-mono text-text-muted text-xs uppercase tracking-wider mb-2 block">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome"
                      className="input-neon pl-10"
                      required
                      id="register-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-text-muted text-xs uppercase tracking-wider mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@akkarabbit.io"
                      className="input-neon pl-10"
                      required
                      id="register-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-text-muted text-xs uppercase tracking-wider mb-2 block">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="input-neon pl-10"
                      required
                      minLength={6}
                      id="register-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-neon-filled w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                  id="register-submit"
                >
                  {loading ? (
                    <span className="animate-pulse">Criando Acesso...</span>
                  ) : (
                    <>
                      Ativar Shield
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-text-muted text-sm">
                  Já tem conta?{" "}
                  <Link href="/login" className="text-neon hover:underline font-mono">
                    Fazer Login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-center font-mono text-text-muted text-[10px] tracking-widest uppercase">
          Conexão segura • TLS 1.3 • E2E Encrypted
        </div>
      </motion.div>
    </div>
  );
}
