"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Generator", href: "/workout-generator", icon: "auto_awesome" },
  { label: "Favorites", href: "/favorites", icon: "favorite" },
  { label: "History", href: "/history", icon: "history" },
  { label: "Profile", href: "/profile", icon: "person" },
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
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[260px] flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-100 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
          <span className="material-symbols-outlined filled">bolt</span>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          WorkoutNow
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                isActive
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${isActive ? "filled" : ""}`}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-slate-500">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
