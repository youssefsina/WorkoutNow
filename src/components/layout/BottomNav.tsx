"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home",     href: "/dashboard",        icon: "home",         iconFilled: "home" },
  { label: "Generate", href: "/workout-generator", icon: "auto_awesome", iconFilled: "auto_awesome" },
  { label: "History",  href: "/history",           icon: "history",      iconFilled: "history" },
  { label: "Favorites",href: "/favorites",         icon: "favorite",     iconFilled: "favorite" },
  { label: "Profile",  href: "/profile",           icon: "person",       iconFilled: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Glass bar */}
      <div
        className="mx-3 mb-3 rounded-2xl px-2 py-2"
        style={{
          background: "rgba(15, 15, 15, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-1 flex-col items-center gap-0.5 py-1"
              >
                {/* Active pill background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: "rgba(99,88,217,0.18)" }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <motion.div
                  className="relative z-10 flex h-8 w-8 items-center justify-center"
                  animate={isActive ? { y: -1 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                >
                  {isActive ? (
                    <span
                      className="material-symbols-outlined filled text-[22px]"
                      style={{ color: "hsl(243,72%,64%)" }}
                    >
                      {item.iconFilled}
                    </span>
                  ) : (
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={{ color: "rgba(255,255,255,0.38)" }}
                    >
                      {item.icon}
                    </span>
                  )}
                </motion.div>

                {/* Label */}
                <motion.span
                  className="relative z-10 text-[10px] font-semibold leading-none"
                  animate={isActive ? { color: "hsl(243,72%,64%)" } : { color: "rgba(255,255,255,0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>

                {/* Active dot */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-0.5 h-1 w-1 rounded-full"
                    style={{ backgroundColor: "hsl(243,72%,64%)" }}
                    layoutId="bottom-nav-dot"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
