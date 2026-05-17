"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Eye, Activity, Users } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import TrustGauge from "@/components/ui/TrustGauge";
import ThreatAlert from "@/components/ui/ThreatAlert";
import { analyticsApi } from "@/lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const MOCK_AREA = [
  { time: "00:00", threats: 4, reviews: 120 },
  { time: "04:00", threats: 7, reviews: 89 },
  { time: "08:00", threats: 12, reviews: 340 },
  { time: "12:00", threats: 28, reviews: 510 },
  { time: "16:00", threats: 19, reviews: 430 },
  { time: "20:00", threats: 34, reviews: 280 },
  { time: "23:59", threats: 15, reviews: 190 },
];

const MOCK_RADAR = [
  { subject: "Rapid Posts", A: 82 }, { subject: "Duplicates", A: 67 },
  { subject: "Extreme Rating", A: 91 }, { subject: "Coordinated", A: 45 },
  { subject: "Fake Accounts", A: 73 }, { subject: "Spam Text", A: 58 },
];

const MOCK_FEED = [
  { id: 1, user: "usr_4421", product: "ProMax Headphones", type: "RAPID_POST", severity: "critical", time: "2m ago", score: 94 },
  { id: 2, user: "usr_8834", product: "SmartWatch X9", type: "DUPLICATE", severity: "high", time: "5m ago", score: 78 },
  { id: 3, user: "usr_2291", product: "GamingChair Pro", type: "SPIKE_DETECTED", severity: "medium", time: "11m ago", score: 55 },
  { id: 4, user: "usr_5503", product: "ProMax Headphones", type: "COORDINATED", severity: "critical", time: "14m ago", score: 97 },
  { id: 5, user: "usr_7712", product: "UltraBook 15", type: "NORMAL_PATTERN", severity: "low", time: "22m ago", score: 18 },
];

const SEVERITY_BADGE: Record<string, string> = {
  critical: "badge-threat badge-critical",
  high: "badge-threat badge-high",
  medium: "badge-threat badge-medium",
  low: "badge-threat badge-low",
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { name: string, value: string | number, color: string }[], label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dark border border-cyber-electric/20 px-3 py-2 text-xs font-mono">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"critical" | "medium">("critical");
  const [stats, setStats] = useState({ total: 0, flagged: 0, products: 0, users: 0 });

  useEffect(() => {
    analyticsApi.getDashboard()
      .then(r => setStats(r.data))
      .catch(() => setStats({ total: 2847, flagged: 143, products: 87, users: 1204 }));
  }, []);

  return (
    <div className="space-y-6">
      <ThreatAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
        title={alertSeverity === "critical" ? "Suspicious Activity Detected" : "Potential Fraud Warning"}
        reasons={alertSeverity === "critical" 
          ? ["Rapid posting: 8 reviews in 12 minutes", "Duplicate text detected", "Coordinated bot network"]
          : ["Atypical review growth", "Moderate 5-star bias", "New account activity spike"]}
      />

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-white tracking-wider">THREAT DASHBOARD</h2>
          <p className="font-mono text-xs text-slate-500 mt-0.5">Real-time fraud detection & analytics</p>
        </div>
        <button onClick={() => { setAlertSeverity("critical"); setAlertOpen(true); }}
          className="btn-cyber btn-cyber-danger text-xs py-2 px-4 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" /> Simulate Alert
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Reviews Analyzed" value={stats.total.toLocaleString()} icon={<Eye className="w-4 h-4" />}
          trend="up" trendValue="+12%" subtitle="Last 24 hours" variant="cyan" delay={0} />
        <StatCard title="Threats Flagged" value={stats.flagged} icon={<AlertTriangle className="w-4 h-4" />}
          trend="up" trendValue="+5%" subtitle="Needs attention" variant="red" delay={0.1} />
        <StatCard title="Products Scanned" value={stats.products} icon={<Shield className="w-4 h-4" />}
          trend="neutral" trendValue="stable" subtitle="Active monitoring" variant="purple" delay={0.2} />
        <StatCard title="Active Users" value={stats.users.toLocaleString()} icon={<Users className="w-4 h-4" />}
          trend="down" trendValue="-2%" subtitle="Under watch: 34" variant="amber" delay={0.3} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-5 corner-cut">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-display text-xs font-bold text-white tracking-wider">THREAT TIMELINE</div>
              <div className="font-mono text-[10px] text-slate-500">24-hour detection activity</div>
            </div>
            <Activity className="w-4 h-4 text-cyber-electric" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_AREA}>
              <defs>
                <linearGradient id="threats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="reviews" name="Reviews" stroke="#00d4ff" fill="url(#reviews)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="threats" name="Threats" stroke="#ef4444" fill="url(#threats)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Trust gauges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5 corner-cut flex flex-col gap-4">
          <div className="font-display text-xs font-bold text-white tracking-wider">SYSTEM SCORES</div>
          <div className="flex flex-col items-center gap-6 flex-1 justify-center">
            <TrustGauge score={72} label="Platform Trust" size="md" />
            <div className="w-full grid grid-cols-2 gap-4">
              <TrustGauge score={38} label="Threat Index" size="sm" />
              <TrustGauge score={85} label="DB Health" size="sm" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Radar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card p-5 corner-cut">
          <div className="font-display text-xs font-bold text-white tracking-wider mb-4">ATTACK PATTERN RADAR</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={MOCK_RADAR}>
              <PolarGrid stroke="rgba(0,212,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <Radar name="Threat" dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.12} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Live feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="glass-card p-5 corner-cut">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display text-xs font-bold text-white tracking-wider">LIVE THREAT FEED</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-pulse" />
              <span className="font-mono text-[10px] text-cyber-neon">LIVE</span>
            </div>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[220px]">
            {MOCK_FEED.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-2.5 bg-white/2 border border-white/5 hover:border-cyber-electric/20 transition-colors cursor-pointer">
                <div className={`w-6 h-6 flex items-center justify-center border text-[10px] font-bold font-mono shrink-0 ${
                  item.severity === "critical" ? "border-red-500/40 text-red-400 bg-red-500/10"
                  : item.severity === "high" ? "border-orange-500/40 text-orange-400 bg-orange-500/10"
                  : item.severity === "medium" ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                  : "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"}`}>
                  {item.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-slate-300 truncate">{item.user}</span>
                    <span className={`badge-threat ${SEVERITY_BADGE[item.severity]}`}>{item.type.replace("_", " ")}</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 truncate">{item.product}</div>
                </div>
                <span className="font-mono text-[10px] text-slate-600 shrink-0">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
