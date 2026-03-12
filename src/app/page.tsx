"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/ThemeProvider";

const ColorBends = dynamic(() => import("@/components/ui/ColorBends"), { ssr: false });
const FlowingMenu = dynamic(() => import("@/components/ui/FlowingMenu"), { ssr: false });

const stats = [
  { value: "10K+", label: "Active Users", icon: "group" },
  { value: "50K+", label: "Workouts Generated", icon: "fitness_center" },
  { value: "1000+", label: "Exercises", icon: "exercise" },
  { value: "99%", label: "Satisfaction", icon: "thumb_up" },
];

const features = [
  {
    icon: "smart_toy",
    title: "AI-Powered Plans",
    desc: "Intelligent workout generation based on your goals, equipment and fitness level.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: "timer",
    title: "Track Progress",
    desc: "Log every set, rep and workout. Watch your streak grow and earn badges.",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: "play_circle",
    title: "Video Demos",
    desc: "HD exercise videos and step-by-step instructions for perfect form.",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: "emoji_events",
    title: "Achievements",
    desc: "Unlock badges as you hit milestones — stay motivated and consistent.",
    color: "from-amber-500 to-yellow-400",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  const menuItems = [
    { link: "/signup", text: "Get Started", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80" },
    { link: "/login", text: "Sign In", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80" },
    { link: "#features", text: "Features", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=80" },
    { link: "#stats", text: "Our Stats", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&q=80" },
  ];

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#0a0a0f] text-white" : "bg-[#f8fafc] text-slate-900"}`}>
      {/* ── ColorBends shader background ───────────── */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-500 ${isDark ? "opacity-100" : "opacity-30"}`}>
        <ColorBends
          rotation={0}
          speed={0.2}
          colors={isDark ? ["#2866eb", "#7c3aed", "#06b6d4", "#1e40af"] : ["#93c5fd", "#c4b5fd", "#67e8f9", "#60a5fa"]}
          transparent={false}
          autoRotate={5}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
        />
      </div>

      {/* ── Full-screen FlowingMenu overlay ────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-5 top-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <FlowingMenu
            items={menuItems}
            speed={15}
            textColor="#fff"
            bgColor={isDark ? "#060010" : "#0f172a"}
            marqueeBgColor={isDark ? "#2866eb" : "#2866eb"}
            marqueeTextColor="#fff"
            borderColor="rgba(255,255,255,0.15)"
          />
        </div>
      )}

      {/* ── Nav bar ────────────────────────────────── */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-lg text-white">fitness_center</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight">WorkoutNow</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Dark / Light toggle */}
          <button
            onClick={toggle}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm transition ${
              isDark
                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white"
                : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm"
            }`}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-lg">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>
          {/* Desktop nav links */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => router.push("/login")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold backdrop-blur-sm transition ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-primary text-white shadow-md shadow-primary/25 hover:brightness-110"}`}
            >
              Get Started
            </button>
          </div>
          {/* Hamburger — opens FlowingMenu */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm transition ${
              isDark
                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white"
                : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm"
            }`}
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pb-16 pt-12 sm:pt-20">
        {/* Pill badge */}
        <div
          className={`mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm transition-all duration-700 ${
            isDark ? "border-white/10 bg-white/5" : "border-primary/20 bg-primary/5"
          } ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <span className="material-symbols-outlined text-base text-primary">bolt</span>
          <span className={`text-xs font-semibold sm:text-sm ${isDark ? "text-slate-300" : "text-primary"}`}>AI-Powered Fitness Platform</span>
        </div>

        {/* Main heading */}
        <h1
          className={`mb-6 text-center text-4xl font-black leading-[1.1] tracking-tight transition-all duration-700 delay-100 sm:text-5xl md:text-6xl lg:text-7xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          Transform Your
          <br />
          <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Fitness Journey
          </span>
        </h1>

        <p
          className={`mb-10 max-w-2xl text-center text-base leading-relaxed transition-all duration-700 delay-200 sm:text-lg md:text-xl ${
            isDark ? "text-slate-400" : "text-slate-500"
          } ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          Create custom workout plans tailored to your equipment and goals.
          Track progress, watch exercise demos, and earn achievements.
        </p>

        {/* CTA */}
        <div
          className={`mb-20 flex w-full flex-col gap-3 sm:w-auto sm:flex-row transition-all duration-700 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <button
            onClick={() => router.push("/signup")}
            className="group relative min-w-[200px] overflow-hidden rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:shadow-primary/50 hover:brightness-110"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>
          <button
            onClick={() => router.push("/login")}
            className={`min-w-[200px] rounded-xl border px-8 py-3.5 text-sm font-bold backdrop-blur-sm transition ${
              isDark
                ? "border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-primary/40 hover:text-primary"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div
          id="stats"
          className={`grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 transition-all duration-700 delay-[400ms] ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group cursor-default rounded-2xl border p-5 text-center backdrop-blur-sm transition hover:-translate-y-1 md:p-7 ${
                isDark
                  ? "border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10"
                  : "border-slate-200/80 bg-white/60 shadow-sm hover:border-primary/30 hover:bg-white/80 hover:shadow-md"
              }`}
            >
              <span className="material-symbols-outlined mb-2 text-2xl text-primary/70 transition group-hover:text-primary">
                {stat.icon}
              </span>
              <p className="mb-0.5 text-2xl font-extrabold md:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className={`text-[11px] font-medium uppercase tracking-wider md:text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section id="features" className="relative z-10 mx-auto max-w-5xl px-5 pb-24">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Why WorkoutNow</p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">Everything you need to get fit</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group rounded-2xl border p-6 backdrop-blur-sm transition md:p-8 ${
                isDark
                  ? "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  : "border-slate-200/80 bg-white/60 shadow-sm hover:border-primary/20 hover:bg-white/80 hover:shadow-md"
              }`}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
                <span className="material-symbols-outlined text-xl text-white">{f.icon}</span>
              </div>
              <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-20 text-center">
        <div className={`rounded-3xl border p-8 backdrop-blur-sm md:p-12 ${
          isDark
            ? "border-white/10 bg-gradient-to-br from-primary/10 via-white/5 to-violet-500/10"
            : "border-primary/10 bg-gradient-to-br from-primary/5 via-white/80 to-violet-100/50 shadow-lg"
        }`}>
          <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">Ready to start?</h2>
          <p className={`mb-6 text-sm sm:text-base ${isDark ? "text-slate-400" : "text-slate-500"}`}>Join thousands of athletes already transforming their fitness.</p>
          <button
            onClick={() => router.push("/signup")}
            className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:brightness-110"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className={`relative z-10 border-t py-6 text-center text-xs ${isDark ? "border-white/5 text-slate-600" : "border-slate-200 text-slate-400"}`}>
        &copy; {new Date().getFullYear()} WorkoutNow. All rights reserved.
      </footer>
    </div>
  );
}
