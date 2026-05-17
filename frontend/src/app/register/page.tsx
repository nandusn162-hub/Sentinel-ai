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

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) { toast.error("All fields required"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(username, email, password);
      toast.success("Account created", { description: "You can now log in, Operator." });
      router.push("/login");
    } catch (err: any) {
      toast.error("Registration failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cyber-black flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 cyber-grid-bg opacity-60" />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(124,58,237,0.1) 0%, rgba(0,212,255,0.04) 40%, transparent 100%)" }} />
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
        <div className="glass-card corner-cut p-8 relative overflow-hidden" style={{ boxShadow: "0 0 40px rgba(124,58,237,0.2), 0 0 80px rgba(124,58,237,0.06)" }}>
          <div className="scan-overlay absolute inset-0 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-violet/60 to-transparent" />
          <div className="absolute inset-0 holo-shimmer pointer-events-none" />

          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 flex items-center justify-center border-2 border-cyber-purple/50 bg-cyber-purple/10 mb-3"
              style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
              <Shield className="w-6 h-6 text-cyber-violet" />
            </div>
            <h1 className="font-display text-xl font-bold text-white tracking-widest text-glow-purple">REQUEST ACCESS</h1>
            <p className="font-mono text-xs text-slate-500 mt-1 tracking-widest">CREATE OPERATOR ACCOUNT</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: "USERNAME", value: username, set: setUsername, icon: User, type: "text", placeholder: "operator_id" },
              { label: "EMAIL", value: email, set: setEmail, icon: Mail, type: "email", placeholder: "operator@sentinel.ai" },
            ].map(({ label, value, set, icon: Icon, type, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <label className="font-mono text-[10px] text-slate-500 tracking-widest">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-violet/50" />
                  <input type={type} value={value} onChange={e => set(e.target.value)}
                    className="input-cyber pl-9" placeholder={placeholder} style={{ borderColor: "rgba(124,58,237,0.2)" }} />
                </div>
              </div>
            ))}
            {[
              { label: "PASSWORD", value: password, set: setPassword, placeholder: "min. 6 characters" },
              { label: "CONFIRM PASSWORD", value: confirm, set: setConfirm, placeholder: "repeat password" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <label className="font-mono text-[10px] text-slate-500 tracking-widest">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-violet/50" />
                  <input type={showPass ? "text" : "password"} value={value} onChange={e => set(e.target.value)}
                    className="input-cyber pl-9 pr-10" placeholder={placeholder} style={{ borderColor: "rgba(124,58,237,0.2)" }} />
                  {label === "PASSWORD" && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyber-violet transition-colors">
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="btn-cyber w-full py-3 mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ borderColor: "rgba(124,58,237,0.6)", color: "#8b5cf6", background: "rgba(124,58,237,0.1)" }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin" /><span className="text-xs">CREATING ACCOUNT...</span></>
              ) : (
                <><Shield className="w-4 h-4" /><span>REGISTER OPERATOR</span><ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-5 text-center">
            <p className="font-mono text-xs text-slate-600">
              Already have access?{" "}
              <Link href="/login" className="text-cyber-violet hover:text-white transition-colors">Login</Link>
            </p>
          </div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyber-purple/30" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-cyber-purple/30" />
        </div>
      </motion.div>
    </div>
  );
}
