"use client";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, Legend
} from "recharts";

const TIMELINE_DATA = [
  { date: "May 10", attacks: 3, reviews: 180 }, { date: "May 11", attacks: 7, reviews: 220 },
  { date: "May 12", attacks: 4, reviews: 195 }, { date: "May 13", attacks: 19, reviews: 410 },
  { date: "May 14", attacks: 28, reviews: 580 }, { date: "May 15", attacks: 15, reviews: 320 },
  { date: "May 16", attacks: 34, reviews: 490 },
];

const PIE_DATA = [
  { name: "Rapid Post", value: 34, color: "#ef4444" },
  { name: "Duplicate", value: 28, color: "#f97316" },
  { name: "Extreme Rating", value: 22, color: "#f59e0b" },
  { name: "Coordinated", value: 11, color: "#8b5cf6" },
  { name: "Spam Text", value: 5, color: "#06b6d4" },
];

const ATTACK_EVENTS = [
  { id: "ATK-001", product: "ProMax Headphones", accounts: 10, duration: "2h 14m", severity: "critical", date: "May 16", impact: 94 },
  { id: "ATK-002", product: "SmartWatch X9", accounts: 6, duration: "45m", severity: "high", date: "May 15", impact: 72 },
  { id: "ATK-003", product: "GamingChair Pro", accounts: 4, duration: "1h 30m", severity: "medium", date: "May 14", impact: 55 },
  { id: "ATK-004", product: "NovaCam 4K", accounts: 8, duration: "3h", severity: "critical", date: "May 13", impact: 89 },
];

const SEV_COLOR: Record<string, string> = { critical: "#ef4444", high: "#f97316", medium: "#f59e0b", low: "#10b981" };

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dark border border-cyber-electric/20 px-3 py-2 text-xs font-mono">
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function FraudAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-white tracking-wider">FRAUD ANALYTICS</h2>
        <p className="font-mono text-xs text-slate-500 mt-0.5">Attack timelines, patterns, and coordinated campaign intelligence</p>
      </div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 corner-cut">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-display text-xs font-bold text-white tracking-wider">FRAUD ATTACK TIMELINE</div>
            <div className="font-mono text-[10px] text-slate-500">7-day detection history</div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Attacks</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyber-electric inline-block" /> Reviews</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={TIMELINE_DATA}>
            <defs>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.15} /><stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="reviews" name="Reviews" stroke="#00d4ff" strokeWidth={1} fill="url(#gr)" />
            <Area type="monotone" dataKey="attacks" name="Attacks" stroke="#ef4444" strokeWidth={2} fill="url(#ga)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 corner-cut">
          <div className="font-display text-xs font-bold text-white tracking-wider mb-4">FRAUD TYPE DISTRIBUTION</div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(10,14,26,0.95)", border: "1px solid rgba(0,212,255,0.2)", fontFamily: "JetBrains Mono", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {PIE_DATA.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                    <span className="font-mono text-[10px] text-slate-400">{d.name}</span>
                  </div>
                  <span className="font-mono text-xs font-bold" style={{ color: d.color }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Coordinated attacks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 corner-cut">
          <div className="font-display text-xs font-bold text-white tracking-wider mb-4">COORDINATED ATTACKS</div>
          <div className="space-y-3">
            {ATTACK_EVENTS.map((atk, i) => (
              <motion.div key={atk.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-display text-xs font-bold"
                  style={{ color: SEV_COLOR[atk.severity], border: `1px solid ${SEV_COLOR[atk.severity]}40`, background: `${SEV_COLOR[atk.severity]}10` }}>
                  {atk.impact}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-white truncate">{atk.product}</div>
                  <div className="font-mono text-[10px] text-slate-600">{atk.accounts} accounts · {atk.duration} · {atk.date}</div>
                </div>
                <div className="font-mono text-[10px] flex-shrink-0" style={{ color: SEV_COLOR[atk.severity] }}>
                  {atk.severity.toUpperCase()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
