"use client";

import { useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Header } from "@/components/layout/header";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (url) {
      setConvex(new ConvexReactClient(url));
    }
  }, []);

  if (!convex) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1E1E1E]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <div className="flex h-screen overflow-hidden bg-[#1E1E1E]">
          <aside className="hidden md:flex md:w-[280px] md:flex-shrink-0">
            <div className="w-full">
              <Sidebar />
            </div>
          </aside>

          <MobileSidebar
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />

          <div className="flex flex-col flex-1 min-w-0">
            <Header onMenuClick={() => setMobileOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </ConvexProvider>
  );
}
