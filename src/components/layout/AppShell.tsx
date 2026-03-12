"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

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
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafb]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-h-screen flex-1 bg-[#f9fafb] pb-24 lg:ml-[260px] lg:pb-4">
        <Header />
        <div className="animate-fadeUp mx-auto w-full max-w-7xl px-3 py-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
