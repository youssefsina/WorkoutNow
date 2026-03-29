"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Generator", href: "/workout-generator", icon: "auto_awesome" },
  { label: "Favorites", href: "/favorites", icon: "favorite" },
  { label: "History", href: "/history", icon: "history" },
  { label: "Profile", href: "/profile", icon: "person" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-border bg-card py-5 lg:flex w-[72px] hover:w-[220px] transition-all duration-300 ease-in-out overflow-hidden group/sidebar">
      {/* Vertical gradient accent */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-indigo-500 to-violet-500 opacity-40" />

      {/* Logo */}
      <Link
        href="/dashboard"
        title="WorkoutNow"
        className="mb-5 mx-auto ml-3.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition hover:brightness-110 group-hover/sidebar:ml-5 group-hover/sidebar:w-auto group-hover/sidebar:px-4 group-hover/sidebar:justify-start group-hover/sidebar:gap-3"
      >
        <span className="material-symbols-outlined filled text-xl shrink-0">bolt</span>
        <span className="font-bold tracking-wide hidden opacity-0 group-hover/sidebar:inline-block group-hover/sidebar:opacity-100 transition-opacity whitespace-nowrap">WorkoutNow</span>
      </Link>

      <div className="mx-auto mb-4 h-px w-9 bg-border opacity-60 group-hover/sidebar:w-[180px] transition-all" />

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 w-full">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`group relative flex h-11 w-11 group-hover/sidebar:w-full items-center justify-center group-hover/sidebar:justify-start group-hover/sidebar:px-3 mx-auto group-hover/sidebar:mx-0 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-primary" />
              )}

              <span
                className={`material-symbols-outlined text-xl shrink-0 transition-transform duration-200 ${
                  isActive ? "filled scale-110" : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </span>

              {/* Text label */}
              <span className="ml-3 hidden opacity-0 whitespace-nowrap transition-opacity group-hover/sidebar:inline-block group-hover/sidebar:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: theme toggle */}
      <div className="mt-auto px-4 flex justify-center group-hover/sidebar:justify-start">
        <ThemeToggle className="h-9 w-9 group-hover/sidebar:w-full group-hover/sidebar:justify-start group-hover/sidebar:px-3 rounded-xl border-border/60 bg-muted text-muted-foreground hover:bg-accent hover:text-foreground" />
      </div>
    </aside>
  );
}
