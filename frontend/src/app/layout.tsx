import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SENTINEL AI – Intelligent Fraud Detection System",
  description:
    "AI-powered suspicious review detection and cyber threat intelligence platform. Detect fraud before it manipulates trust.",
  keywords: ["fraud detection", "AI", "cybersecurity", "review analysis", "threat intelligence"],
  openGraph: {
    title: "SENTINEL AI",
    description: "Detect Fraud Before It Manipulates Trust.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#010409" />
      </head>
      <body className="bg-cyber-black text-white antialiased font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(10,14,26,0.95)",
              border: "1px solid rgba(0,212,255,0.3)",
              color: "#e2e8f0",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
