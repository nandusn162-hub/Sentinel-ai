"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Settings, Bell, Volume2, Shield, Sliders, Moon, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [voiceAlerts, setVoiceAlerts] = useState(true);
  const [sensitivity, setSensitivity] = useState(75);
  const [autoFlag, setAutoFlag] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved", { description: "Configuration updated successfully." });
    setTimeout(() => setSaved(false), 2000);
  };

  const testVoice = () => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance("Warning. Suspicious review behavior detected. Threat level elevated.");
      u.rate = 0.9; u.pitch = 0.8; u.volume = 0.8;
      window.speechSynthesis.speak(u);
    } else {
      toast.error("Web Speech API not supported in this browser");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-lg font-bold text-white tracking-wider">SETTINGS</h2>
        <p className="font-mono text-xs text-slate-500 mt-0.5">Detection configuration and platform preferences</p>
      </div>

      {/* Detection Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 corner-cut space-y-5">
        <div className="font-display text-xs font-bold text-white tracking-wider flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-cyber-electric" /> DETECTION ENGINE
        </div>

        {/* Sensitivity slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-mono text-xs text-slate-300">Detection Sensitivity</div>
              <div className="font-mono text-[10px] text-slate-600 mt-0.5">Higher = more flags, lower = fewer false positives</div>
            </div>
            <div className={`font-display text-base font-bold ${sensitivity >= 80 ? "text-red-400" : sensitivity >= 60 ? "text-amber-400" : "text-emerald-400"}`}>
              {sensitivity}%
            </div>
          </div>
          <div className="relative">
            <input type="range" min={0} max={100} value={sensitivity} onChange={e => setSensitivity(+e.target.value)}
              className="w-full h-1.5 appearance-none bg-white/10 outline-none cursor-pointer"
              style={{ accentColor: sensitivity >= 80 ? "#ef4444" : sensitivity >= 60 ? "#f59e0b" : "#10b981" }} />
            <div className="flex justify-between mt-1 font-mono text-[9px] text-slate-600">
              <span>LOW</span><span>MEDIUM</span><span>HIGH</span><span>MAX</span>
            </div>
          </div>
        </div>

        {/* Auto flag toggle */}
        <div className="flex items-center justify-between py-3 border-t border-white/5">
          <div>
            <div className="font-mono text-xs text-slate-300">Auto-Flag Suspicious Reviews</div>
            <div className="font-mono text-[10px] text-slate-600 mt-0.5">Automatically flag without manual review</div>
          </div>
          <button onClick={() => setAutoFlag(!autoFlag)}
            className={`w-11 h-6 rounded-sm relative transition-all ${autoFlag ? "bg-cyber-electric/30 border border-cyber-electric/50" : "bg-white/5 border border-white/10"}`}>
            <div className={`absolute top-0.5 w-5 h-5 transition-all ${autoFlag ? "right-0.5 bg-cyber-electric" : "left-0.5 bg-slate-600"}`} />
          </button>
        </div>
      </motion.div>

      {/* Voice Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 corner-cut space-y-4">
        <div className="font-display text-xs font-bold text-white tracking-wider flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-cyber-violet" /> VOICE ALERTS
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-xs text-slate-300">Enable Voice Alerts</div>
            <div className="font-mono text-[10px] text-slate-600 mt-0.5">Web Speech API narration on threat detection</div>
          </div>
          <button onClick={() => setVoiceAlerts(!voiceAlerts)}
            className={`w-11 h-6 rounded-sm relative transition-all ${voiceAlerts ? "bg-cyber-violet/30 border border-cyber-violet/50" : "bg-white/5 border border-white/10"}`}>
            <div className={`absolute top-0.5 w-5 h-5 transition-all ${voiceAlerts ? "right-0.5 bg-cyber-violet" : "left-0.5 bg-slate-600"}`} />
          </button>
        </div>

        <button onClick={testVoice}
          className="btn-cyber flex items-center gap-2 text-xs py-2 px-5 border-cyber-violet/40 text-cyber-violet hover:border-cyber-violet/80">
          <Volume2 className="w-3.5 h-3.5" /> TEST VOICE ALERT
        </button>
        <div className="font-mono text-[10px] text-slate-600">
          Triggers: "Warning. Suspicious review behavior detected. Threat level elevated."
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 corner-cut space-y-4">
        <div className="font-display text-xs font-bold text-white tracking-wider flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-amber-400" /> NOTIFICATIONS
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="font-mono text-xs text-slate-300">Email Alerts</div>
            <div className="font-mono text-[10px] text-slate-600 mt-0.5">Send email on critical threat detection</div>
          </div>
          <button onClick={() => setNotifyEmail(!notifyEmail)}
            className={`w-11 h-6 rounded-sm relative transition-all ${notifyEmail ? "bg-amber-500/30 border border-amber-500/50" : "bg-white/5 border border-white/10"}`}>
            <div className={`absolute top-0.5 w-5 h-5 transition-all ${notifyEmail ? "right-0.5 bg-amber-500" : "left-0.5 bg-slate-600"}`} />
          </button>
        </div>
      </motion.div>

      {/* Save */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        onClick={handleSave}
        className={`btn-cyber flex items-center gap-2 py-3 px-8 text-sm transition-all ${saved ? "border-emerald-500/60 text-emerald-400" : "btn-cyber-primary"}`}>
        <Save className="w-4 h-4" />
        {saved ? "SAVED ✓" : "SAVE SETTINGS"}
      </motion.button>
    </div>
  );
}
