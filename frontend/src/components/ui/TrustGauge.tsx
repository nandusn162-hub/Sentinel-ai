"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TrustGaugeProps {
  score: number;        // 0-100
  label?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

function getColor(score: number) {
  if (score >= 75) return { stroke: "#10b981", text: "text-emerald-400", label: "TRUSTED" };
  if (score >= 50) return { stroke: "#f59e0b", text: "text-amber-400", label: "MODERATE" };
  if (score >= 25) return { stroke: "#ef4444", text: "text-red-400", label: "SUSPICIOUS" };
  return { stroke: "#ff0040", text: "text-red-500", label: "CRITICAL" };
}

export default function TrustGauge({ score, label = "Trust Score", size = "md", animate = true }: TrustGaugeProps) {
  const [displayed, setDisplayed] = useState(0);
  const dims = { sm: 80, md: 120, lg: 160 };
  const strokes = { sm: 6, md: 8, lg: 10 };
  const dim = dims[size];
  const strokeW = strokes[size];
  const r = (dim - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;
  const { stroke, text, label: statusLabel } = getColor(score);

  useEffect(() => {
    if (!animate) { setDisplayed(score); return; }
    let start = 0;
    const step = score / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayed(score); clearInterval(id); }
      else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [score, animate]);

  const cx = dim / 2;
  const cy = dim / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          {/* Background track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
          {/* Progress */}
          <motion.circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${stroke})` }}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-display font-bold ${text} ${size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-base"}`}>
            {displayed}
          </div>
          {size !== "sm" && (
            <div className="font-mono text-[9px] text-slate-500 tracking-widest mt-0.5">{statusLabel}</div>
          )}
        </div>
      </div>
      <div className="font-mono text-xs text-slate-400 tracking-wide text-center">{label}</div>
    </div>
  );
}
