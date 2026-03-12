"use client";

import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: "dashboard", activeColor: "text-blue-500", activeBg: "bg-blue-50" },
  { label: "Generate", href: "/workout-generator", icon: "auto_awesome", activeColor: "text-amber-500", activeBg: "bg-amber-50" },
  { label: "Favs", href: "/favorites", icon: "favorite", activeColor: "text-rose-500", activeBg: "bg-rose-50" },
  { label: "History", href: "/history", icon: "history", activeColor: "text-indigo-500", activeBg: "bg-indigo-50" },
  { label: "Profile", href: "/profile", icon: "person", activeColor: "text-emerald-500", activeBg: "bg-emerald-50" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-100 bg-white/95 backdrop-blur-xl pb-[max(4px,env(safe-area-inset-bottom))] lg:hidden">
      {/* Top gradient accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-primary via-indigo-500 to-violet-500 opacity-50" />
      <div className="flex items-center justify-around px-1 pt-1.5 pb-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`relative flex flex-col items-center rounded-xl px-3 py-1.5 transition-all duration-200 ${
                isActive ? item.activeBg : "hover:bg-slate-50"
              }`}
            >
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -top-1 h-1 w-6 rounded-full bg-gradient-to-r from-primary to-indigo-500" />
              )}
              <span
                className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${
                  isActive ? `${item.activeColor} filled scale-110` : "text-slate-400"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`mt-0.5 text-[10px] transition-colors ${
                  isActive ? `font-bold ${item.activeColor}` : "font-medium text-slate-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
