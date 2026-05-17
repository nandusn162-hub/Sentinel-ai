"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Volume2, CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

interface ThreatAlertProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  severity?: "critical" | "high" | "medium" | "low";
  reasons?: string[];
}

export default function ThreatAlert({
  open, onClose,
  title = "Suspicious Activity Detected",
  message = "Suspicious activity detected. Proceed cautiously.",
  severity = "critical",
  reasons = [],
}: ThreatAlertProps) {
  const spokenRef = useRef(false);

  useEffect(() => {
    if (open && !spokenRef.current && typeof window !== "undefined" && "speechSynthesis" in window) {
      spokenRef.current = true;
      const utterance = new SpeechSynthesisUtterance(
        severity === "critical" || severity === "high"
          ? "Warning. Suspicious review behavior detected. Threat level critical."
          : severity === "medium"
          ? "Alert. Potential fake review attack identified. Threat level medium."
          : "System check complete. No threats detected."
      );
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
    if (!open) spokenRef.current = false;
  }, [open, severity]);

  const config = {
    critical: { border: "border-red-500/60", glow: "rgba(239,68,68,0.4)", text: "text-red-400", label: "CRITICAL", icon: AlertTriangle },
    high: { border: "border-orange-500/60", glow: "rgba(249,115,22,0.4)", text: "text-orange-400", label: "HIGH", icon: AlertTriangle },
    medium: { border: "border-amber-500/60", glow: "rgba(245,158,11,0.4)", text: "text-amber-400", label: "WARNING", icon: AlertTriangle },
    low: { border: "border-emerald-500/60", glow: "rgba(16,185,129,0.4)", text: "text-emerald-400", label: "SAFE", icon: CheckCircle },
  }[severity] || { border: "border-red-500/60", glow: "rgba(239,68,68,0.4)", text: "text-red-400", label: "CRITICAL", icon: AlertTriangle };

  const { border, glow, text, label, icon: Icon } = config;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md`}
          >
            <div
              className={`glass-card ${border} p-6 corner-cut relative overflow-hidden`}
              style={{ boxShadow: `0 0 40px ${glow}, 0 0 80px ${glow}33` }}
            >
              {/* Scan line */}
              <div className="scan-overlay absolute inset-0 pointer-events-none" />

              {/* Pulsing bg */}
              <div
                className="absolute inset-0 opacity-5 animate-pulse-slow"
                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
              />

              {/* Header */}
              <div className="flex items-start gap-3 mb-4 relative">
                <div className={`w-10 h-10 flex items-center justify-center border ${border} ${text} threat-pulse shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className={`font-display text-sm font-bold ${text} tracking-wider uppercase`}>{title}</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest">
                    THREAT LEVEL: <span className={text}>{label}</span>
                  </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-300 text-sm mb-4 font-mono leading-relaxed">{message}</p>

              {reasons.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Detection Reasons:</div>
                  {reasons.map((r, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs font-mono ${text}/80`}>
                      <div className={`w-1 h-1 rounded-full ${text.replace("text-", "bg-")}`} />
                      {r}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={onClose}
                  className={`btn-cyber ${severity === 'low' ? 'btn-cyber-primary' : 'btn-cyber-danger'} flex-1 text-xs py-2 px-4`}>
                  {severity === 'low' ? 'Proceed Safely' : 'Acknowledge Threat'}
                </button>
                <button
                  onClick={() => {
                    if ("speechSynthesis" in window) {
                      const u = new SpeechSynthesisUtterance(severity === 'low' ? "No threats detected." : "Threat level elevated.");
                      u.rate = 0.9; u.pitch = 0.8;
                      window.speechSynthesis.speak(u);
                    }
                  }}
                  className="btn-cyber px-3 py-2">
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
