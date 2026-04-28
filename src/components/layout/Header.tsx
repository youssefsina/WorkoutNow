"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workout-generator": "Generator",
  "/favorites": "Favorites",
  "/history": "History",
  "/profile": "Profile",
  "/workout/active": "Active Workout",
};

export default function Header() {
  const pathname = usePathname();
  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname.startsWith(path)
  )?.[1];

  return (
    <>
      {/* Desktop floating theme toggle */}
      <div className="pointer-events-none fixed right-6 top-5 z-40 hidden lg:block">
        <div className="pointer-events-auto">
          <ThemeToggle className="h-11 w-11 rounded-full border-border/70 bg-background/75 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur-xl hover:bg-background" />
        </div>
      </div>

      {/* Mobile header — logo left, theme toggle right, NO hamburger */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl lg:hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-primary to-violet-500 opacity-80" />
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Logo + page title */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-md shadow-primary/25 overflow-hidden">
              <Image src="/logo.png" alt="WorkoutNow" width={32} height={32} className="object-contain" priority />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Workout<span className="text-primary">Now</span>
              </span>
              {title && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none mt-0.5">
                  {title}
                </p>
              )}
            </div>
          </div>

          {/* Theme toggle only — no hamburger */}
          <ThemeToggle className="h-9 w-9 rounded-xl" />
        </div>
      </header>
    </>
  );
}
