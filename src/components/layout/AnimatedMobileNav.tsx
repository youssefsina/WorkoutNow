"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", color: "from-blue-500 to-blue-600" },
  { label: "Generate", href: "/workout-generator", icon: "auto_awesome", color: "from-amber-500 to-orange-500" },
  { label: "Favorites", href: "/favorites", icon: "favorite", color: "from-rose-500 to-pink-500" },
  { label: "History", href: "/history", icon: "history", color: "from-indigo-500 to-violet-500" },
  { label: "Profile", href: "/profile", icon: "person", color: "from-emerald-500 to-teal-500" },
];

export default function AnimatedMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLButtonElement[]>([]);

  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(!isOpen);
  }, [isOpen, isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      itemsRef.current.forEach((item, index) => {
        if (item) {
          item.style.opacity = "0";
          item.style.transform = "translateY(30px)";
          setTimeout(() => {
            item.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, 100 + index * 80);
        }
      });
    } else {
      document.body.style.overflow = "";
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [isOpen]);

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    document.body.style.overflow = "";
    router.push(href);
  };

  const isDark = theme === "dark";

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 lg:hidden"
        style={{
          background: isDark 
            ? "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
            : "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
          boxShadow: "0 8px 32px rgba(37, 99, 235, 0.4)",
        }}
      >
        <div className="relative flex h-6 w-6 items-center justify-center">
          <span
            className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? "rotate-45 top-3" : "-top-2"}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}
          />
          <span
            className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -bottom-1" : "-bottom-2"}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}
          />
        </div>
      </button>

      {/* Full Screen Menu Overlay */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          background: isDark 
            ? "linear-gradient(180deg, #09090b 0%, #18181b 50%, #27272a 100%)"
            : "linear-gradient(180deg, #fafafa 0%, #f4f4f5 50%, #e4e4e7 100%)",
        }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 h-full w-full animate-pulse opacity-30" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-1/2 -right-1/2 h-full w-full animate-pulse opacity-30" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", animationDelay: "1s" }} />
        </div>

        {/* Menu Items */}
        <nav className="relative z-10 flex flex-col items-center gap-4">
          {NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <button
                key={item.href}
                ref={(el) => { if (el) itemsRef.current[index] = el; }}
                onClick={() => handleNavigate(item.href)}
                className={`group relative flex h-16 w-64 items-center gap-4 overflow-hidden rounded-2xl px-6 transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : isDark
                      ? "bg-zinc-900/80 text-zinc-100 hover:bg-zinc-800"
                      : "bg-white/80 text-zinc-900 hover:bg-white"
                }`}
                style={{
                  boxShadow: isActive ? "0 8px 32px rgba(37, 99, 235, 0.3)" : "0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r ${item.color}`} />
                
                {/* Icon */}
                <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-white/20 text-white" 
                    : isDark
                      ? "bg-zinc-800 text-zinc-400 group-hover:bg-white/10 group-hover:text-white"
                      : "bg-zinc-100 text-zinc-600 group-hover:bg-primary/10 group-hover:text-primary"
                }`}>
                  <span className={`material-symbols-outlined text-xl ${isActive ? "filled" : ""}`}>{item.icon}</span>
                </div>

                {/* Label */}
                <span className="relative text-lg font-semibold">
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute right-4 material-symbols-outlined text-lg text-white/80">check_circle</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            WorkoutNow
          </p>
          <div className="flex items-center gap-1">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-violet-500" />
            <div className="h-1 w-4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />
          </div>
        </div>
      </div>
    </>
  );
}