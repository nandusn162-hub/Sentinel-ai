"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Users, Shield, AlertTriangle, Terminal, Eye, Trash2, Check, X } from "lucide-react";
import { adminApi, usersApi } from "@/lib/api";
import { toast } from "sonner";

const MOCK_USERS = [
  { id: 1, username: "admin", email: "admin@sentinel.ai", role: "admin", risk_score: 0, is_suspicious: false, created_at: "2026-01-01" },
  { id: 2, username: "usr_4421", email: "u4421@mail.com", role: "user", risk_score: 89, is_suspicious: true, created_at: "2026-05-14" },
  { id: 3, username: "usr_8834", email: "u8834@mail.com", role: "user", risk_score: 71, is_suspicious: true, created_at: "2026-05-10" },
  { id: 4, username: "usr_2291", email: "u2291@mail.com", role: "user", risk_score: 58, is_suspicious: false, created_at: "2026-04-22" },
  { id: 5, username: "usr_1100", email: "u1100@mail.com", role: "user", risk_score: 22, is_suspicious: false, created_at: "2025-11-02" },
];

const MOCK_LOGS = [
  { id: 1, event: "RAPID_POST_DETECTED", user: "usr_4421", detail: "8 reviews in 12 minutes", ts: "14:23:11" },
  { id: 2, event: "DUPLICATE_TEXT_FOUND", user: "usr_8834", detail: "92% similarity with 5 reviews", ts: "14:18:04" },
  { id: 3, event: "COORDINATED_ATTACK", user: "usr_5503", detail: "10-account campaign on ProMax", ts: "14:01:37" },
  { id: 4, event: "EXTREME_RATING_FLAG", user: "usr_2291", detail: "Only 1-star reviews in history", ts: "13:55:22" },
  { id: 5, event: "USER_SUSPENDED", user: "admin", detail: "usr_4421 suspended by admin", ts: "13:30:00" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "system">("users");
  const [users, setUsers] = useState(MOCK_USERS);

  const handleSuspend = async (userId: number) => {
    toast.success("User suspended", { description: `usr_${userId} access revoked` });
    setUsers(u => u.map(x => x.id === userId ? { ...x, is_suspicious: true } : x));
  };

  const handleClear = async (userId: number) => {
    toast.success("User cleared", { description: `Risk flags removed for usr_${userId}` });
    setUsers(u => u.map(x => x.id === userId ? { ...x, is_suspicious: false, risk_score: 0 } : x));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-white tracking-wider">ADMIN CONTROL PANEL</h2>
          <p className="font-mono text-xs text-slate-500 mt-0.5">System management and database operations</p>
        </div>
        <div className="badge-threat badge-safe font-mono text-[10px] px-3 py-1.5">ADMIN ACCESS</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/5">
        {([["users", Users, "User Management"], ["logs", Terminal, "Detection Logs"], ["system", Shield, "System"]] as const).map(([tab, Icon, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs tracking-wide border-b-2 transition-all ${
              activeTab === tab ? "border-cyber-electric text-cyber-electric" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {activeTab === "users" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-3 px-4 py-2 font-mono text-[10px] text-slate-600 tracking-widest border-b border-white/5">
            <span className="col-span-2">USER</span><span>ROLE</span><span>RISK</span><span>STATUS</span><span>ACTIONS</span>
          </div>
          {users.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="grid grid-cols-6 gap-3 items-center px-4 py-3 glass-dark border border-white/5 hover:border-white/10 transition-colors">
              <div className="col-span-2">
                <div className="font-mono text-xs text-white">{u.username}</div>
                <div className="font-mono text-[10px] text-slate-600 truncate">{u.email}</div>
              </div>
              <span className={`font-mono text-xs ${u.role === "admin" ? "text-cyber-violet" : "text-slate-400"}`}>{u.role}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 bg-white/5">
                  <div className="h-full" style={{
                    width: `${u.risk_score}%`,
                    background: u.risk_score >= 75 ? "#ef4444" : u.risk_score >= 50 ? "#f59e0b" : "#10b981"
                  }} />
                </div>
                <span className={`font-mono text-xs ${u.risk_score >= 75 ? "text-red-400" : u.risk_score >= 50 ? "text-amber-400" : "text-emerald-400"}`}>
                  {u.risk_score}
                </span>
              </div>
              <span className={`font-mono text-[10px] ${u.is_suspicious ? "text-red-400" : "text-emerald-400"}`}>
                {u.is_suspicious ? "⚠ FLAGGED" : "✓ CLEAR"}
              </span>
              <div className="flex items-center gap-1.5">
                {u.role !== "admin" && (
                  <>
                    <button onClick={() => handleSuspend(u.id)}
                      className="w-6 h-6 flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors" title="Suspend">
                      <X className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleClear(u.id)}
                      className="w-6 h-6 flex items-center justify-center border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Clear">
                      <Check className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Logs tab */}
      {activeTab === "logs" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {MOCK_LOGS.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-start gap-4 p-3.5 glass-dark border border-white/5 font-mono">
              <span className="text-slate-600 text-xs flex-shrink-0">{log.ts}</span>
              <span className={`text-xs flex-shrink-0 ${
                log.event.includes("ATTACK") || log.event.includes("SUSPEND") ? "text-red-400"
                : log.event.includes("DETECTED") || log.event.includes("FOUND") ? "text-amber-400"
                : "text-cyber-electric"}`}>{log.event}</span>
              <span className="text-slate-400 text-xs flex-shrink-0">{log.user}</span>
              <span className="text-slate-500 text-xs">{log.detail}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* System tab */}
      {activeTab === "system" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
          {[
            { label: "Database", value: "SQLite (dev) / PostgreSQL-ready", status: "online" },
            { label: "Detection Engine", value: "Active — 5 rules loaded", status: "online" },
            { label: "API Server", value: "FastAPI · localhost:8000", status: "online" },
            { label: "Voice Alerts", value: "Web Speech API", status: "online" },
          ].map(({ label, value, status }, i) => (
            <div key={label} className="glass-card p-4 corner-cut">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs font-bold text-white tracking-wide">{label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-pulse" />
                  <span className="font-mono text-[10px] text-cyber-neon">{status.toUpperCase()}</span>
                </div>
              </div>
              <div className="font-mono text-xs text-slate-500">{value}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
