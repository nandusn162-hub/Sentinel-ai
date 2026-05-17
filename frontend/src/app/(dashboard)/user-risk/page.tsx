"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, User, AlertTriangle, Clock, Star, Activity } from "lucide-react";
import TrustGauge from "@/components/ui/TrustGauge";
import { usersApi } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MOCK_USERS = [
  { id: 1, username: "usr_4421", risk_score: 89, reviews: 47, flagged: 31, avg_rating: 4.9, join_date: "2026-05-14", status: "critical" },
  { id: 2, username: "usr_8834", risk_score: 71, reviews: 23, flagged: 14, avg_rating: 5.0, join_date: "2026-05-10", status: "high" },
  { id: 3, username: "usr_2291", risk_score: 58, reviews: 18, flagged: 9, avg_rating: 1.1, join_date: "2026-04-22", status: "medium" },
  { id: 4, username: "usr_5503", risk_score: 95, reviews: 62, flagged: 58, avg_rating: 4.8, join_date: "2026-05-14", status: "critical" },
  { id: 5, username: "usr_1100", risk_score: 22, reviews: 8, flagged: 1, avg_rating: 3.4, join_date: "2025-11-02", status: "low" },
];

const MOCK_TIMELINE = [
  { day: "Mon", reviews: 2 }, { day: "Tue", reviews: 4 }, { day: "Wed", reviews: 1 },
  { day: "Thu", reviews: 18 }, { day: "Fri", reviews: 15 }, { day: "Sat", reviews: 7 }, { day: "Sun", reviews: 0 },
];

const STATUS_BADGE: Record<string, string> = {
  critical: "badge-threat badge-critical", high: "badge-threat badge-high",
  medium: "badge-threat badge-medium", low: "badge-threat badge-low",
};

export default function UserRiskPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof MOCK_USERS[0] | null>(null);

  const filtered = MOCK_USERS.filter(u => u.username.includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-white tracking-wider">USER RISK ANALYSIS</h2>
        <p className="font-mono text-xs text-slate-500 mt-0.5">Behavioral profiling and risk scoring for all users</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* User list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyber-electric/50" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="input-cyber pl-9 text-sm" placeholder="Search user ID..." />
          </div>
          <div className="space-y-2">
            {filtered.map((u, i) => (
              <motion.div key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(u)}
                className={`glass-dark p-3.5 border cursor-pointer transition-all ${
                  selected?.id === u.id ? "border-cyber-electric/40 bg-cyber-electric/5" : "border-white/5 hover:border-white/15"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 font-display text-xs text-slate-300">
                      {u.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-mono text-xs text-white">{u.username}</div>
                      <div className="font-mono text-[10px] text-slate-600">{u.reviews} reviews · {u.flagged} flagged</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-display text-sm font-bold ${
                      u.risk_score >= 75 ? "text-red-400" : u.risk_score >= 50 ? "text-amber-400" : "text-emerald-400"}`}>
                      {u.risk_score}
                    </div>
                    <div className="font-mono text-[9px] text-slate-600">RISK</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* User detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Profile header */}
              <div className="glass-card p-5 corner-cut">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 flex items-center justify-center border border-cyber-electric/30 bg-cyber-electric/10 font-display text-xl text-cyber-electric flex-shrink-0">
                    {selected.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-base text-white font-semibold">{selected.username}</span>
                      <span className={STATUS_BADGE[selected.status]}>{selected.status.toUpperCase()} RISK</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      {[
                        { label: "Total Reviews", value: selected.reviews },
                        { label: "Flagged", value: selected.flagged },
                        { label: "Avg Rating", value: selected.avg_rating.toFixed(1) + "★" },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-2 bg-white/[0.02] border border-white/5">
                          <div className="font-display text-sm font-bold text-white">{value}</div>
                          <div className="font-mono text-[10px] text-slate-500">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <TrustGauge score={100 - selected.risk_score} label="Trust Score" size="md" />
                  </div>
                </div>
              </div>

              {/* Activity timeline */}
              <div className="glass-card p-5 corner-cut">
                <div className="font-display text-xs font-bold text-white tracking-wider mb-4">WEEKLY REVIEW ACTIVITY</div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={MOCK_TIMELINE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "rgba(10,14,26,0.95)", border: "1px solid rgba(0,212,255,0.2)", fontFamily: "JetBrains Mono", fontSize: 11 }} />
                    <Line type="monotone" dataKey="reviews" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-2 font-mono text-[10px] text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> Spike on Thursday: 18 reviews in one day — flagged as suspicious burst
                </div>
              </div>

              {/* Risk factors */}
              <div className="glass-card p-5 corner-cut border border-red-500/10">
                <div className="font-display text-xs font-bold text-white tracking-wider mb-3">RISK FACTORS</div>
                <div className="space-y-2">
                  {[
                    { factor: "Review Velocity", score: 91, desc: "Posts reviews 18x faster than average user" },
                    { factor: "Rating Bias", score: 96, desc: "99.8% of ratings are 4-5 stars" },
                    { factor: "Text Uniqueness", score: 42, desc: "Moderate template reuse detected" },
                    { factor: "Account Age", score: 88, desc: "Account is only 2 days old" },
                  ].map(({ factor, score, desc }) => (
                    <div key={factor} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-slate-300">{factor}</span>
                        <span className={`font-display text-xs font-bold ${score >= 75 ? "text-red-400" : score >= 50 ? "text-amber-400" : "text-emerald-400"}`}>{score}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8 }}
                          className={`h-full ${score >= 75 ? "bg-red-500" : score >= 50 ? "bg-amber-500" : "bg-emerald-500"}`} />
                      </div>
                      <div className="font-mono text-[10px] text-slate-600">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-12 corner-cut flex flex-col items-center justify-center text-center gap-4 h-full min-h-[300px]">
              <User className="w-10 h-10 text-slate-600" />
              <div className="font-mono text-sm text-slate-500">Select a user to view risk profile</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
