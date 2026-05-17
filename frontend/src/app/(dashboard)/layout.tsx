"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import CyberSidebar from "@/components/ui/CyberSidebar";
import CyberTopbar from "@/components/ui/CyberTopbar";
import { useAuthStore } from "@/lib/store";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "THREAT DASHBOARD",
  "/analyze": "THREAT ANALYSIS",
  "/monitor": "SUSPICIOUS MONITOR",
  "/user-risk": "USER RISK ANALYSIS",
  "/fraud-analytics": "FRAUD ANALYTICS",
  "/admin": "ADMIN PANEL",
  "/settings": "SETTINGS",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, fetchMe } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "SENTINEL AI";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      fetchMe();
    }
  }, [isAuthenticated, router, fetchMe]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-cyber-black overflow-hidden">
      <CyberSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <CyberTopbar title={title} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="fixed inset-0 cyber-grid-bg opacity-40 pointer-events-none" />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
