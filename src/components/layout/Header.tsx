"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import StaggeredMenu from "@/components/ui/StaggeredMenu";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workout-generator": "Generator",
  "/favorites": "Favorites",
  "/history": "History",
  "/profile": "Profile",
  "/workout/active": "Active Workout",
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Generator", href: "/workout-generator" },
  { label: "Favorites", href: "/favorites" },
  { label: "History", href: "/history" },
  { label: "Profile", href: "/profile" },
];

const SECONDARY_LINKS = [
  { href: "/workout-generator", label: "New Workout" },
  { href: "/favorites", label: "Favorites" },
  { href: "/history", label: "History" },
];

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

      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl lg:hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-primary via-indigo-500 to-violet-500 opacity-50" />
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Logo + page title */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/25">
              <span className="material-symbols-outlined filled text-base">bolt</span>
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight">
                Workout<span className="text-primary">Now</span>
              </span>
              {title && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none mt-0.5">
                  {title}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle className="h-9 w-9 rounded-xl" />
            <StaggeredMenu
              side="right"
              buttonClassName="h-9 rounded-xl border-border bg-muted px-3 text-[0.6rem] tracking-[0.22em] text-foreground shadow-none backdrop-blur-none hover:bg-accent"
              brand={
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                    WorkoutNow
                  </p>
                  <p className="text-sm font-medium text-white/85">Navigation</p>
                </div>
              }
              items={NAV_ITEMS.map((item) => ({
                href: item.href,
                label: item.label,
                eyebrow:
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "Current"
                    : "Open",
              }))}
              secondaryLinks={SECONDARY_LINKS}
            />
          </div>
        </div>
      </header>
    </>
  );
}
