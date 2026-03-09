"use client";

import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: "dashboard" },
  { label: "Generate", href: "/workout-generator", icon: "auto_awesome" },
  { label: "Favs", href: "/favorites", icon: "favorite" },
  { label: "History", href: "/history", icon: "history" },
  { label: "Profile", href: "/profile", icon: "person" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white px-1 py-1 pb-[max(8px,env(safe-area-inset-bottom))] lg:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center rounded-lg px-3 py-1.5 transition-colors ${
              isActive ? "bg-primary/10" : ""
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                isActive ? "text-primary filled" : "text-slate-400"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`mt-0.5 text-[10px] ${
                isActive ? "font-bold text-primary" : "font-medium text-slate-400"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
