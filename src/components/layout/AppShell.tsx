"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const initialized = useAuthStore((s) => s.initialized);
  const [ready, setReady] = useState(false);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    if (initialized && !ready) setReady(true);
  }, [initialized, ready]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar only */}
      <Sidebar />

      <main className="min-h-screen flex-1 bg-background lg:ml-[92px]">
        <Header />
        {/* Extra bottom padding on mobile so content clears the bottom nav */}
        <div className="animate-fade-up mx-auto w-full max-w-7xl px-3 py-4 pb-28 sm:p-6 md:p-8 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav />
    </div>
  );
}
