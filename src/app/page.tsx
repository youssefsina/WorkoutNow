"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ColorBends = dynamic(() => import("@/components/ui/ColorBends"), { ssr: false });

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f] text-white">
      {/* ── ColorBends shader background ───────────── */}
      <div className="fixed inset-0 z-0">
        <ColorBends
          rotation={0}
          speed={0.2}
          colors={["#2866eb", "#7c3aed", "#06b6d4", "#1e40af"]}
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

      {/* ── Nav bar ────────────────────────────────── */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-lg text-white">fitness_center</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight">WorkoutNow</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pb-16 pt-12 sm:pt-20">
        {/* Pill badge */}
        <div
          className={`mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <span className="material-symbols-outlined text-base text-primary">bolt</span>
          <span className="text-xs font-semibold text-slate-300 sm:text-sm">AI-Powered Fitness Platform</span>
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
          className={`mb-10 max-w-2xl text-center text-base leading-relaxed text-slate-400 transition-all duration-700 delay-200 sm:text-lg md:text-xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
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
            className="min-w-[200px] rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div
          className={`grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 transition-all duration-700 delay-[400ms] ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition hover:-translate-y-1 hover:border-primary/30 hover:bg-white/10 md:p-7"
            >
              <span className="material-symbols-outlined mb-2 text-2xl text-primary/70 transition group-hover:text-primary">
                {stat.icon}
              </span>
              <p className="mb-0.5 text-2xl font-extrabold md:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 md:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-24">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Why WorkoutNow</p>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">Everything you need to get fit</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.06] md:p-8"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
                <span className="material-symbols-outlined text-xl text-white">{f.icon}</span>
              </div>
              <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-20 text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-white/5 to-violet-500/10 p-8 backdrop-blur-sm md:p-12">
          <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">Ready to start?</h2>
          <p className="mb-6 text-sm text-slate-400 sm:text-base">Join thousands of athletes already transforming their fitness.</p>
          <button
            onClick={() => router.push("/signup")}
            className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:brightness-110"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} WorkoutNow. All rights reserved.
      </footer>
    </div>
  );
}
