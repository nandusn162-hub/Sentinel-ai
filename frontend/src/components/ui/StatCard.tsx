"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "cyan" | "purple" | "red" | "green" | "amber";
  delay?: number;
}

const variantStyles = {
  cyan: {
    border: "border-cyber-electric/20 hover:border-cyber-electric/40",
    icon: "bg-cyber-electric/10 border-cyber-electric/20",
    iconColor: "text-cyber-electric",
    glow: "hover:shadow-cyber",
    bar: "bg-cyber-electric",
    value: "text-cyber-electric",
  },
  purple: {
    border: "border-cyber-purple/20 hover:border-cyber-purple/40",
    icon: "bg-cyber-purple/10 border-cyber-purple/20",
    iconColor: "text-cyber-violet",
    glow: "hover:shadow-cyber-purple",
    bar: "bg-cyber-purple",
    value: "text-cyber-violet",
  },
  red: {
    border: "border-red-500/20 hover:border-red-500/40",
    icon: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-400",
    glow: "hover:shadow-threat",
    bar: "bg-red-500",
    value: "text-red-400",
  },
  green: {
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    icon: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    glow: "hover:shadow-neon",
    bar: "bg-emerald-400",
    value: "text-emerald-400",
  },
  amber: {
    border: "border-amber-500/20 hover:border-amber-500/40",
    icon: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    glow: "",
    bar: "bg-amber-400",
    value: "text-amber-400",
  },
};

export default function StatCard({
  title, value, subtitle, icon, trend, trendValue, variant = "cyan", delay = 0,
}: StatCardProps) {
  const v = variantStyles[variant];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`stat-card ${v.border} ${v.glow} transition-all duration-300 cursor-default`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 w-12 h-0.5 ${v.bar}`} />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 flex items-center justify-center border ${v.icon}`}>
          <div className={v.iconColor}>{icon}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-mono ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </div>
        )}
      </div>

      <div className={`text-2xl font-display font-bold ${v.value} tracking-wide mb-0.5`}>
        {value}
      </div>
      <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">{title}</div>
      {subtitle && (
        <div className="text-[11px] text-slate-500 mt-1 font-mono">{subtitle}</div>
      )}
    </motion.div>
  );
}
