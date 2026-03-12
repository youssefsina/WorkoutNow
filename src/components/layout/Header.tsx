"use client";

import { usePathname } from "next/navigation";

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
      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-xl lg:hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-primary via-indigo-500 to-violet-500 opacity-40" />
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md shadow-primary/25">
              <span className="material-symbols-outlined filled text-base">bolt</span>
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900">
                Workout<span className="text-primary">Now</span>
              </span>
              {title && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{title}</p>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
