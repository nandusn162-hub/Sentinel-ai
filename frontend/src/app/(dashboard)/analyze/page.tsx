"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Link2, Upload, Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import TrustGauge from "@/components/ui/TrustGauge";
import ThreatAlert from "@/components/ui/ThreatAlert";
import { productsApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

interface AnalysisFlag {
  type: string;
  count: number;
  severity: "critical" | "high" | "medium" | "low";
}

interface AnalysisRating {
  star: string;
  count: number;
  suspicious: boolean;
}

interface AnalysisResult {
  product: string;
  url: string;
  trust_score: number;
  threat_score: number;
  status: "Safe" | "Warning" | "Critical";
  severity: "critical" | "high" | "medium" | "low";
  total_reviews: number;
  flagged_reviews: number;
  flags: AnalysisFlag[];
  ratings: AnalysisRating[];
  top_reasons: string[];
}

const DEMO_RESULT: AnalysisResult = {
  product: "ProMax Headphones Ultra",
  url: "https://amazon.com/dp/B08XYZ",
  trust_score: 31,
  threat_score: 69,
  status: "Warning",
  severity: "high",
  total_reviews: 234,
  flagged_reviews: 87,
  flags: [
    { type: "RAPID_POST", count: 34, severity: "critical" },
    { type: "DUPLICATE_TEXT", count: 28, severity: "high" },
    { type: "EXTREME_RATING", count: 15, severity: "medium" },
    { type: "COORDINATED_ATTACK", count: 10, severity: "critical" },
  ],
  ratings: [
    { star: "5★", count: 142, suspicious: true },
    { star: "4★", count: 23, suspicious: false },
    { star: "3★", count: 8, suspicious: false },
    { star: "2★", count: 5, suspicious: false },
    { star: "1★", count: 56, suspicious: true },
  ],
  top_reasons: ["87 reviews posted within 2 hours", "34 reviews share 90%+ identical text", "Coordinated 1★ attack from 10 accounts"],
};

const SEVERITY_COLOR: Record<string, string> = { critical: "#ff0040", high: "#f97316", medium: "#f59e0b", low: "#10b981" };

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [tab, setTab] = useState<"url" | "image">("url");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAnalyze = async () => {
    if (!url && !imageFile) return;
    setLoading(true);
    setResult(null);
    try {
      let data;
      if (tab === "url") {
        const r = await productsApi.analyzeUrl(url);
        data = r.data;
      } else if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const r = await productsApi.analyzeImage(fd);
        data = r.data;
      }
      setResult(data);
      // Popup only for Critical threats (score >= 70)
      if (data.threat_score >= 70) {
        setAlertOpen(true);
      }
    } catch {
      setResult(DEMO_RESULT);
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (score: number) => {
    if (score < 40) return { label: "SAFE", color: "text-emerald-400", badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", bg: "border-emerald-500/20" };
    if (score < 70) return { label: "WARNING", color: "text-amber-400", badge: "bg-amber-500/10 border-amber-500/20 text-amber-400", bg: "border-amber-500/20" };
    return { label: "CRITICAL", color: "text-red-400", badge: "bg-red-500/10 border-red-500/20 text-red-400", bg: "border-red-500/20" };
  };

  const status = result ? getStatusConfig(result.threat_score) : null;

  return (
    <div className="space-y-6">
      <ThreatAlert 
        open={alertOpen} 
        onClose={() => setAlertOpen(false)} 
        severity={result?.severity}
        title={result?.threat_score && result.threat_score >= 70 ? "Suspicious Activity Detected" : "Review Analysis Complete"}
        reasons={result?.top_reasons ?? []} 
        message={result?.threat_score && result.threat_score >= 70 
          ? "Suspicious review activity detected on this product. Proceed cautiously." 
          : "Analysis complete. Review patterns appear normal."} 
      />

      <div>
        <h2 className="font-display text-lg font-bold text-white tracking-wider">THREAT ANALYSIS</h2>
        <p className="font-mono text-xs text-slate-500 mt-0.5">Analyze product URLs or images for suspicious reviews</p>
      </div>

      {/* Input card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 corner-cut">
        {/* Tabs */}
        <div className="flex gap-1 mb-5 border-b border-white/5 pb-3">
          {(["url", "image"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 font-mono text-xs tracking-widest transition-all ${
                tab === t ? "text-cyber-electric border-b-2 border-cyber-electric -mb-3.5 pb-3.5" : "text-slate-500 hover:text-slate-300"}`}>
              {t === "url" ? "🔗 URL ANALYSIS" : "🖼️ IMAGE SCAN"}
            </button>
          ))}
        </div>

        {tab === "url" ? (
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-electric/50" />
              <input value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                className="input-cyber pl-10" placeholder="https://amazon.com/dp/... or any product URL" />
            </div>
            <button onClick={handleAnalyze} disabled={loading || !url}
              className="btn-cyber btn-cyber-primary px-6 flex items-center gap-2 disabled:opacity-40">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "SCANNING" : "ANALYZE"}</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-3 items-start">
            <label className="flex-1 border border-dashed border-cyber-electric/30 hover:border-cyber-electric/60 p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-cyber-electric/40" />
              <span className="font-mono text-xs text-slate-500">
                {imageFile ? imageFile.name : "Drop product image or click to browse"}
              </span>
              <input type="file" accept="image/*" className="hidden"
                onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
            </label>
            <button onClick={handleAnalyze} disabled={loading || !imageFile}
              className="btn-cyber btn-cyber-primary px-6 py-3 flex items-center gap-2 disabled:opacity-40 self-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "SCANNING" : "SCAN IMAGE"}</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Results */}
      {result && status && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
          {/* Product header */}
          <div className={`glass-card p-5 corner-cut border ${status.bg}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-base font-bold text-white">{result.product}</div>
                <div className="font-mono text-xs text-slate-500 mt-1">{result.url}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 border font-mono text-[10px] tracking-tighter ${status.badge}`}>
                    {result.threat_score < 40 ? "🛡️ TRUSTED REVIEW" : result.threat_score < 70 ? "⚠ SUSPICIOUS PATTERN" : "⚠ CRITICAL THREAT"}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{result.flagged_reviews}/{result.total_reviews} reviews flagged</span>
                </div>
              </div>
              <div className="flex gap-6 shrink-0">
                <TrustGauge score={result.trust_score} label="Trust Score" size="sm" />
                <TrustGauge score={result.threat_score} label="Threat Score" size="sm" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Flag breakdown */}
            <div className="glass-card p-5 corner-cut">
              <div className="font-display text-xs font-bold text-white tracking-wider mb-4">DETECTION BREAKDOWN</div>
              {result.flags.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={result.flags} layout="vertical" barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="type" tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip contentStyle={{ background: "rgba(10,14,26,0.95)", border: "1px solid rgba(0,212,255,0.2)", fontFamily: "JetBrains Mono", fontSize: 11 }} />
                    <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                      {result.flags.map((f: AnalysisFlag, i: number) => <Cell key={i} fill={SEVERITY_COLOR[f.severity]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[180px] flex items-center justify-center border border-white/5 bg-white/2">
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-emerald-500/30 mx-auto mb-2" />
                    <p className="font-mono text-[10px] text-emerald-500/50 uppercase tracking-widest">No threats detected</p>
                  </div>
                </div>
              )}
            </div>

            {/* Rating distribution */}
            <div className="glass-card p-5 corner-cut">
              <div className="font-display text-xs font-bold text-white tracking-wider mb-4">RATING DISTRIBUTION</div>
              <div className="space-y-3">
                {result.ratings.map((r: AnalysisRating, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400 w-6">{r.star}</span>
                    <div className="flex-1 h-4 bg-white/5 relative overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(r.count / 200) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                        className={`h-full ${r.suspicious ? "bg-red-500/70" : "bg-cyber-electric/50"}`} />
                    </div>
                    <span className={`font-mono text-xs w-8 text-right ${r.suspicious ? "text-red-400" : "text-slate-400"}`}>{r.count}</span>
                    {r.suspicious && <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top reasons */}
          <div className={`glass-card p-5 corner-cut border ${status.bg}`}>
            <div className="font-display text-xs font-bold text-white tracking-wider mb-3 uppercase">{result.threat_score < 40 ? "Trust Factors" : "Why this was flagged"}</div>
            <div className="space-y-2">
              {result.top_reasons.map((r: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-2.5 border ${status.bg} bg-white/2`}>
                  {result.threat_score < 40 ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className={`w-3.5 h-3.5 ${status.color} shrink-0`} />
                  )}
                  <span className="font-mono text-xs text-slate-300">{r}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
