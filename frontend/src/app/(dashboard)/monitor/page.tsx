"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AlertTriangle, Filter, RefreshCw, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { reviewsApi } from "@/lib/api";

const SEVERITY_OPTS = ["all", "critical", "high", "medium", "low"] as const;
type Sev = typeof SEVERITY_OPTS[number];

const MOCK_FLAGS = [
  { id: 1, user: "usr_4421", product: "ProMax Headphones", comment: "Amazing product! Best I ever bought! Five stars all day!", type: "RAPID_POST", severity: "critical", confidence: 94, time: "2026-05-16 14:23", rating: 5, reasons: ["Posted 8 reviews in 12 min", "New account (2 days old)", "Linked to usr_5503"] },
  { id: 2, user: "usr_8834", product: "SmartWatch X9", comment: "Great watch great watch great watch. Very good. Great.", type: "DUPLICATE_TEXT", severity: "high", confidence: 78, time: "2026-05-16 14:18", rating: 5, reasons: ["92% text similarity to 5 other reviews", "Repeated phrase pattern"] },
  { id: 3, user: "usr_2291", product: "GamingChair Pro", comment: "Terrible. Worst purchase ever. Do not buy this garbage.", type: "EXTREME_RATING", severity: "medium", confidence: 61, time: "2026-05-16 14:07", rating: 1, reasons: ["Only 1-star reviews in history", "Account used exclusively for 1-star ratings"] },
  { id: 4, user: "usr_5503", product: "ProMax Headphones", comment: "Perfect quality!! Outstanding!!! Buy buy buy!!!", type: "COORDINATED", severity: "critical", confidence: 97, time: "2026-05-16 14:01", rating: 5, reasons: ["Part of 10-account coordinated campaign", "IP subnet match with usr_4421", "Posted within 2-min window"] },
  { id: 5, user: "usr_7712", product: "UltraBook 15", comment: "Good laptop. It works well. The keyboard is nice.", type: "SPAM_TEXT", severity: "low", confidence: 41, time: "2026-05-16 13:44", rating: 4, reasons: ["Generic template language", "Low specificity score"] },
  { id: 6, user: "usr_3310", product: "NovaCam 4K", comment: "Best camera!! 5 stars!! Amazing!! Wow!! Must buy!!", type: "RAPID_POST", severity: "high", confidence: 82, time: "2026-05-16 13:31", rating: 5, reasons: ["Posted 6 reviews in 8 minutes", "All 5-star, all exclamation-heavy"] },
];

const SEV_BADGE: Record<string, string> = {
  critical: "badge-threat badge-critical",
  high: "badge-threat badge-high",
  medium: "badge-threat badge-medium",
  low: "badge-threat badge-low",
};
const SEV_BORDER: Record<string, string> = {
  critical: "border-red-500/30 hover:border-red-500/50",
  high: "border-orange-500/20 hover:border-orange-500/40",
  medium: "border-amber-500/20 hover:border-amber-500/40",
  low: "border-emerald-500/20 hover:border-emerald-500/40",
};

export default function MonitorPage() {
  const [filter, setFilter] = useState<Sev>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [flags, setFlags] = useState(MOCK_FLAGS);
  const [loading, setLoading] = useState(false);

  const filtered = filter === "all" ? flags : flags.filter(f => f.severity === filter);

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await reviewsApi.getSuspicious({ severity: filter === "all" ? undefined : filter });
      setFlags(r.data.length ? r.data : MOCK_FLAGS);
    } catch { setFlags(MOCK_FLAGS); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-white tracking-wider">SUSPICIOUS MONITOR</h2>
          <p className="font-mono text-xs text-slate-500 mt-0.5">Live flagged review feed with detection details</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {SEVERITY_OPTS.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 font-mono text-[10px] tracking-widest border transition-all ${
                  filter === s ? "border-cyber-electric/60 text-cyber-electric bg-cyber-electric/10" : "border-white/10 text-slate-500 hover:border-white/20"}`}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={refresh} disabled={loading}
            className="btn-cyber px-3 py-1.5 flex items-center gap-1.5 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> REFRESH
          </button>
        </div>
      </div>

      {/* Count bar */}
      <div className="flex items-center gap-4 font-mono text-xs text-slate-500">
        <span>Showing <span className="text-white">{filtered.length}</span> flagged reviews</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-pulse" />
          <span className="text-cyber-neon">LIVE MONITORING</span>
        </div>
      </div>

      {/* Flag list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((flag, i) => (
            <motion.div key={flag.id}
              layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: i * 0.04 }}
              className={`glass-dark border ${SEV_BORDER[flag.severity]} transition-all cursor-pointer`}
              onClick={() => setExpanded(expanded === flag.id ? null : flag.id)}>

              <div className="flex items-center gap-4 p-4">
                {/* Confidence score circle */}
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border font-display font-bold text-sm ${
                  flag.severity === "critical" ? "border-red-500/40 text-red-400 bg-red-500/10"
                  : flag.severity === "high" ? "border-orange-500/40 text-orange-400 bg-orange-500/10"
                  : flag.severity === "medium" ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                  : "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"}`}>
                  {flag.confidence}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm text-white font-semibold">{flag.user}</span>
                    <span className={`badge-threat ${SEV_BADGE[flag.severity]}`}>{flag.type.replace(/_/g, " ")}</span>
                    <span className="font-mono text-[10px] text-slate-600">Rating: {flag.rating}★</span>
                  </div>
                  <div className="font-mono text-xs text-slate-500 mt-0.5 truncate">
                    {flag.product} • {flag.time}
                  </div>
                  <div className="font-mono text-xs text-slate-400 mt-1 italic truncate">"{flag.comment}"</div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="font-mono text-xs text-slate-500">Confidence</div>
                    <div className={`font-display font-bold text-sm ${
                      flag.severity === "critical" ? "text-red-400" : flag.severity === "high" ? "text-orange-400"
                      : flag.severity === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                      {flag.confidence}%
                    </div>
                  </div>
                  {expanded === flag.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {expanded === flag.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5">
                    <div className="p-4 space-y-3">
                      <div className="font-mono text-[10px] text-slate-500 tracking-widest">DETECTION REASONS</div>
                      {flag.reasons.map((r, j) => (
                        <div key={j} className="flex items-center gap-2 font-mono text-xs text-slate-300">
                          <AlertTriangle className={`w-3 h-3 flex-shrink-0 ${
                            flag.severity === "critical" ? "text-red-400" : "text-amber-400"}`} />
                          {r}
                        </div>
                      ))}
                      <div className="flex gap-2 pt-2">
                        <button className="btn-cyber btn-cyber-danger text-xs py-1.5 px-4">Confirm Flag</button>
                        <button className="btn-cyber text-xs py-1.5 px-4">Dismiss</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
