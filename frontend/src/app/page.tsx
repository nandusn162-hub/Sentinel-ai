"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, ArrowRight, Zap, Eye, AlertTriangle, Activity, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const CyberScene = dynamic(() => import("@/components/three/CyberScene"), {
  ssr: false,
  loading: () => null,
});

const STATS = [
  { value: "2.4M+", label: "Reviews Analyzed" },
  { value: "98.7%", label: "Detection Accuracy" },
  { value: "14K+", label: "Threats Neutralized" },
  { value: "<0.3s", label: "Response Time" },
];

const FEATURES = [
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    desc: "Continuous AI-powered surveillance of review ecosystems with sub-second threat identification.",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Rapid Attack Detection",
    desc: "Identify coordinated fake review campaigns and bot swarms the moment they emerge.",
    color: "purple",
  },
  {
    icon: AlertTriangle,
    title: "Behavioral Analytics",
    desc: "Deep pattern recognition across user history, timing, and semantic fingerprints.",
    color: "amber",
  },
  {
    icon: Activity,
    title: "Trust Score Engine",
    desc: "Quantify product and reviewer credibility using multi-dimensional fraud scoring.",
    color: "green",
  },
];

const colorMap: Record<string, string> = {
  cyan: "border-cyber-electric/30 hover:border-cyber-electric/60 text-cyber-electric",
  purple: "border-cyber-purple/30 hover:border-cyber-purple/60 text-cyber-violet",
  amber: "border-amber-500/30 hover:border-amber-500/60 text-amber-400",
  green: "border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400",
};

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / 80;
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [end]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen bg-cyber-black overflow-x-hidden">
      {/* Cyber grid background */}
      <div className="fixed inset-0 cyber-grid-bg opacity-100 pointer-events-none" />

      {/* Radial hero glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,212,255,0.07) 0%, rgba(124,58,237,0.04) 50%, transparent 100%)" }} />

      {/* Three.js scene */}
      {mounted && <CyberScene />}

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-9 h-9 flex items-center justify-center border border-cyber-electric/60 bg-cyber-electric/10"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
              <Shield className="w-4 h-4 text-cyber-electric" />
            </div>
            <div className="absolute inset-0 animate-ping border border-cyber-electric/20 rounded-full" />
          </div>
          <div>
            <div className="font-display text-base font-bold text-cyber-electric tracking-widest text-glow-cyan">
              SENTINEL
            </div>
            <div className="font-mono text-[9px] text-slate-500 tracking-[0.3em]">AI DEFENSE SYSTEM</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link href="/login">
            <button className="btn-cyber text-[11px] py-2 px-5">Login</button>
          </Link>
          <Link href="/register">
            <button className="btn-cyber btn-cyber-primary text-[11px] py-2 px-5">Register</button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-8 pb-20">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-4 py-1.5 mb-8 border border-cyber-electric/30 bg-cyber-electric/5 backdrop-blur-sm"
        >
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon" />
            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-cyber-neon animate-ping" />
          </div>
          <span className="font-mono text-[11px] text-cyber-electric tracking-widest">
            THREAT MONITORING ACTIVE • 2,847 REVIEWS SCANNED TODAY
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-4"
        >
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none">
            <span className="block text-white">SENTINEL</span>
            <span className="block text-cyber-electric text-glow-cyan mt-1">AI</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-slate-300 text-lg md:text-2xl max-w-2xl mx-auto mb-3 font-light leading-relaxed"
        >
          Detect Fraud Before It{" "}
          <span className="text-cyber-electric font-semibold">Manipulates Trust.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-slate-500 text-sm max-w-lg mx-auto mb-10 font-mono"
        >
          AI-powered suspicious review detection, coordinated attack identification,
          and real-time fraud intelligence for the modern digital economy.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/register">
            <button className="btn-cyber btn-cyber-primary flex items-center gap-2 py-3 px-8 text-sm">
              <Shield className="w-4 h-4" />
              Start Threat Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/login">
            <button className="btn-cyber flex items-center gap-2 py-3 px-8 text-sm">
              Access Dashboard
            </button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="font-mono text-[10px] text-slate-600 tracking-widest">SCROLL</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-4 h-4 text-slate-600" />
          </motion.div>
        </motion.div>
      </main>

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-cyber-black p-8 text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-cyber-electric text-glow-cyan mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-slate-500 tracking-widest uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="font-mono text-xs text-cyber-electric tracking-[0.3em] mb-3">CAPABILITIES</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Intelligence-Grade Fraud Detection
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`glass-card p-6 corner-cut border transition-all duration-300 ${colorMap[f.color]}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center border ${colorMap[f.color]} flex-shrink-0`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white tracking-wide mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-xs text-slate-600 tracking-widest">
            SENTINEL AI © 2024 — FRAUD DETECTION SYSTEM
          </div>
          <div className="font-mono text-xs text-slate-600">
            v2.4.1 • PRODUCTION BUILD • ALL SYSTEMS NOMINAL
          </div>
        </div>
      </footer>
    </div>
  );
}
