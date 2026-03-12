"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", color: "text-blue-500" },
  { label: "Generator", href: "/workout-generator", icon: "auto_awesome", color: "text-amber-500" },
  { label: "Favorites", href: "/favorites", icon: "favorite", color: "text-rose-500" },
  { label: "History", href: "/history", icon: "history", color: "text-indigo-500" },
  { label: "Profile", href: "/profile", icon: "person", color: "text-emerald-500" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[260px] flex-col bg-white lg:flex">
      {/* Decorative top gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-indigo-500 to-violet-500" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined filled text-xl">bolt</span>
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
            Workout<span className="text-primary">Now</span>
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Fitness Tracker</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Menu</p>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 font-semibold text-primary shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-primary text-white shadow-md shadow-primary/30" : `bg-slate-100 ${item.color} group-hover:bg-slate-200`
              }`}>
                <span className={`material-symbols-outlined text-[18px] ${isActive ? "filled" : ""}`}>
                  {item.icon}
                </span>
              </div>
              <span className="text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* User section */}
      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-sm font-bold text-white shadow-md shadow-primary/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
              <p className="truncate text-[11px] text-slate-400">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
