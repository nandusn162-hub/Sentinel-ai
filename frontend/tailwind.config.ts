import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core cyber palette
        cyber: {
          black: "#010409",
          navy: "#0a0e1a",
          deep: "#0d1229",
          blue: "#0ea5e9",
          cyan: "#06b6d4",
          electric: "#00d4ff",
          purple: "#7c3aed",
          violet: "#8b5cf6",
          neon: "#00ff88",
          red: "#ef4444",
          amber: "#f59e0b",
          glow: "#00d4ff",
        },
        threat: {
          critical: "#ff0040",
          high: "#ff4500",
          medium: "#f59e0b",
          low: "#10b981",
          none: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Orbitron", "sans-serif"],
      },
      backgroundImage: {
        "cyber-grid": `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
        "cyber-gradient": "linear-gradient(135deg, #010409 0%, #0a0e1a 50%, #0d1229 100%)",
        "glow-radial": "radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)",
        "hero-radial": "radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.1) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)",
      },
      backgroundSize: {
        "cyber-grid": "60px 60px",
      },
      boxShadow: {
        "cyber": "0 0 20px rgba(0,212,255,0.3), 0 0 40px rgba(0,212,255,0.1)",
        "cyber-lg": "0 0 40px rgba(0,212,255,0.4), 0 0 80px rgba(0,212,255,0.15)",
        "cyber-purple": "0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.2)",
        "threat": "0 0 20px rgba(255,0,64,0.4), 0 0 40px rgba(255,0,64,0.2)",
        "neon": "0 0 10px rgba(0,255,136,0.5), 0 0 20px rgba(0,255,136,0.2)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite alternate",
        "radar-sweep": "radarSweep 4s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "scan-line": "scanLine 2s linear infinite",
        "threat-blink": "threatBlink 0.8s ease-in-out infinite",
        "matrix": "matrix 20s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        glowPulse: {
          "0%": { boxShadow: "0 0 5px rgba(0,212,255,0.2), 0 0 10px rgba(0,212,255,0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.3)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scanLine: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        threatBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        matrix: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        "cyber": "2px",
      },
    },
  },
  plugins: [],
};

export default config;
