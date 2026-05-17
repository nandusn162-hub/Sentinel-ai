"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Eye, EyeOff, ArrowRight, Lock, User, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

const AuthScene = dynamic(() => import("@/components/three/AuthScene"), { ssr: false, loading: () => null });

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { toast.error("All fields required"); return; }
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Authentication successful", { description: "Welcome back, Operator." });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Authentication failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cyber-black flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 cyber-grid-bg opacity-60" />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(124,58,237,0.08) 0%, rgba(0,212,255,0.05) 40%, transparent 100%)" }} />
      <AuthScene />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-cyber-electric transition-colors">
          <Shield className="w-3.5 h-3.5" /> SENTINEL AI
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="glass-card corner-cut p-8 relative overflow-hidden" style={{ boxShadow: "0 0 40px rgba(0,212,255,0.15), 0 0 80px rgba(0,212,255,0.05)" }}>
          <div className="scan-overlay absolute inset-0 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-electric/60 to-transparent" />
          <div className="absolute inset-0 holo-shimmer pointer-events-none" />

          <div className="flex flex-col items-center mb-8">
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="relative mb-4">
              <div className="w-16 h-16 flex items-center justify-center border-2 border-cyber-electric/50 bg-cyber-electric/10"
                style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
                <Shield className="w-7 h-7 text-cyber-electric" />
              </div>
              <div className="absolute inset-0 border-2 border-cyber-electric/20 animate-ping"
                style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }} />
            </motion.div>
            <h1 className="font-display text-xl font-bold text-white tracking-widest text-glow-cyan">SENTINEL AI</h1>
            <p className="font-mono text-xs text-slate-500 mt-1 tracking-widest">SECURE OPERATOR ACCESS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-slate-500 tracking-widest">USERNAME</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-electric/50" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="input-cyber pl-9" placeholder="operator_id" autoComplete="username" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-slate-500 tracking-widest">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-electric/50" />
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  className="input-cyber pl-9 pr-10" placeholder="••••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyber-electric transition-colors">
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="btn-cyber btn-cyber-primary w-full py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-cyber-electric/30 border-t-cyber-electric rounded-full animate-spin" /><span className="text-xs">AUTHENTICATING...</span></>
              ) : (
                <><Lock className="w-4 h-4" /><span>ACCESS SYSTEM</span><ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-mono text-xs text-slate-600">
              No account?{" "}
              <Link href="/register" className="text-cyber-electric hover:text-white transition-colors">Request Access</Link>
            </p>
          </div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyber-electric/30" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-cyber-electric/30" />
        </div>
      </motion.div>
    </div>
  );
}
