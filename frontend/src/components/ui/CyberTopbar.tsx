"use client";
import { motion } from "framer-motion";
import { Bell, Search, Shield, Wifi, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export default function CyberTopbar({ title }: { title?: string }) {
  const { user } = useAuthStore();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-cyber-electric/10 bg-cyber-navy/50 backdrop-blur-md flex-shrink-0 relative">
      {/* Left: top line glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-electric/30 to-transparent" />

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-5 bg-cyber-electric mr-1" />
        <h1 className="font-display text-sm font-semibold tracking-wider text-white">
          {title ?? "SENTINEL AI"}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Status dot */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-cyber-neon" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyber-neon animate-ping opacity-60" />
          </div>
          <span className="font-mono text-[11px] text-cyber-neon tracking-wider">ONLINE</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 border-l border-white/10 pl-4">
          <Clock className="w-3 h-3" />
          {time}
        </div>

        {/* Bell */}
        <button className="relative w-8 h-8 flex items-center justify-center border border-white/10 hover:border-cyber-electric/40 transition-colors">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-threat-critical" />
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-7 h-7 flex items-center justify-center bg-cyber-electric/10 border border-cyber-electric/30">
            <span className="font-display text-xs text-cyber-electric">
              {user?.username?.[0]?.toUpperCase() ?? "S"}
            </span>
          </div>
          <span className="font-mono text-xs text-slate-300 hidden sm:block">{user?.username ?? "SENTINEL"}</span>
        </div>
      </div>
    </header>
  );
}
