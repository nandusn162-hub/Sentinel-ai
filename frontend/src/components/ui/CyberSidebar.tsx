"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield, LayoutDashboard, Search, AlertTriangle,
  Users, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
  Activity, Terminal, Bell
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
  { href: "/analyze", icon: Search, label: "Threat Analysis", badge: null },
  { href: "/monitor", icon: AlertTriangle, label: "Suspicious Monitor", badge: "LIVE" },
  { href: "/user-risk", icon: Users, label: "User Risk", badge: null },
  { href: "/fraud-analytics", icon: BarChart3, label: "Fraud Analytics", badge: null },
  { href: "/admin", icon: Terminal, label: "Admin Panel", badge: null },
  { href: "/settings", icon: Settings, label: "Settings", badge: null },
];

export default function CyberSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Session terminated", { description: "Logged out securely." });
    router.push("/");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-cyber-navy border-r border-cyber-electric/10 overflow-hidden z-40 flex-shrink-0"
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-electric/50 to-transparent" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center border border-cyber-electric/50 bg-cyber-electric/10"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            <Shield className="w-4 h-4 text-cyber-electric" />
          </div>
          <div className="absolute inset-0 animate-ping border border-cyber-electric/20"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="font-display text-sm font-bold text-cyber-electric tracking-widest">SENTINEL</div>
            <div className="font-mono text-[10px] text-slate-500 tracking-widest">AI v2.4.1</div>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`nav-item ${active ? "active" : ""}`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-cyber-electric" : ""}`} />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="badge-threat badge-safe text-[9px] px-1.5 py-0">{item.badge}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-white/5 px-2 py-3 space-y-1">
        <div className={`flex items-center gap-3 px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-cyber-electric/30 to-cyber-purple/30 border border-cyber-electric/30 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-xs text-cyber-electric">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">{user?.username ?? "Operator"}</div>
              <div className="text-[10px] text-slate-500 truncate font-mono">{user?.role ?? "analyst"}</div>
            </div>
          )}
        </div>
        <button onClick={handleLogout}
          className={`nav-item w-full text-left hover:!text-red-400 hover:!border-red-500/20 hover:!bg-red-500/5 ${collapsed ? "justify-center" : ""}`}>
          <LogOut className="w-4 h-4 flex-shrink-0 text-red-400/60" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cyber-navy border border-cyber-electric/30 flex items-center justify-center hover:border-cyber-electric/60 transition-colors z-50"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-cyber-electric" />
          : <ChevronLeft className="w-3 h-3 text-cyber-electric" />}
      </button>
    </motion.aside>
  );
}
