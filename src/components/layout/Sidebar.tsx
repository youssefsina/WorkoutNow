"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/dashboard",        icon: "home" },
  { label: "Generator",  href: "/workout-generator", icon: "auto_awesome" },
  { label: "Favorites",  href: "/favorites",         icon: "favorite" },
  { label: "History",    href: "/history",           icon: "history" },
  { label: "Profile",    href: "/profile",           icon: "person" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "fixed left-3 top-3 bottom-3 z-50 hidden lg:flex flex-col",
        "rounded-3xl overflow-hidden",
        "w-[68px] hover:w-[220px]",
        "transition-[width] duration-300 ease-in-out",
        "group/sidebar",
        "shadow-2xl",
        /* indigo in light, deep navy in dark */
        "bg-primary dark:bg-[hsl(238,22%,10%)]",
        "shadow-primary/25 dark:shadow-black/50",
      ].join(" ")}
    >
      {/* subtle inner highlight ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

      {/* New Workout button */}
      <Link
        href="/workout-generator"
        title="New Workout"
        className="mt-5 mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 hover:bg-white/25 transition-all duration-200 group-hover/sidebar:mx-4 group-hover/sidebar:w-[calc(100%-2rem)] group-hover/sidebar:justify-start group-hover/sidebar:px-3 group-hover/sidebar:gap-3 overflow-hidden"
      >
        <span className="material-symbols-outlined filled text-2xl text-white shrink-0">
          add_circle
        </span>
        <span className="hidden text-white font-bold text-sm whitespace-nowrap opacity-0 group-hover/sidebar:flex group-hover/sidebar:opacity-100 transition-opacity duration-200">
          New Workout
        </span>
      </Link>

      <div className="mx-auto mt-4 mb-2 h-px w-8 bg-white/15 group-hover/sidebar:w-[calc(100%-2rem)] transition-all duration-300" />

      {/* Branding — visible when expanded */}
      <div className="mx-4 mb-3 hidden group-hover/sidebar:flex items-center gap-2.5 overflow-hidden">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-md">
          <Image src="/logo.png" alt="WorkoutNow" width={22} height={22} className="object-contain" />
        </div>
        <span className="text-white font-bold text-sm tracking-tight whitespace-nowrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          WorkoutNow
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={[
                "group relative flex h-11 items-center rounded-2xl px-2.5",
                "transition-all duration-200",
                "group-hover/sidebar:px-3",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:bg-white/12 hover:text-white",
              ].join(" ")}
            >
              {isActive && (
                <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-white" />
              )}

              <span
                className={[
                  "material-symbols-outlined text-[22px] shrink-0 transition-transform duration-200",
                  isActive ? "filled scale-110" : "group-hover:scale-110",
                ].join(" ")}
              >
                {item.icon}
              </span>

              <span className="ml-3 hidden text-sm font-semibold whitespace-nowrap opacity-0 group-hover/sidebar:inline group-hover/sidebar:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: theme toggle */}
      <div className="px-2 mb-5 mt-auto">
        <div className="relative flex h-11 items-center rounded-2xl px-2.5 text-white/60 hover:bg-white/12 hover:text-white transition-all duration-200 group-hover/sidebar:px-3">
          <ThemeToggle className="text-white/70 hover:text-white bg-transparent border-0 hover:bg-transparent h-auto w-auto p-0 shrink-0" />
          <span className="ml-3 hidden text-sm font-semibold whitespace-nowrap opacity-0 group-hover/sidebar:inline group-hover/sidebar:opacity-100 transition-opacity duration-200">
            Theme
          </span>
        </div>
      </div>
    </aside>
  );
}
