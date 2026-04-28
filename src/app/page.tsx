"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

const LiquidChrome = dynamic(() => import("@/components/ui/LiquidChrome"), { ssr: false });

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#tracking", label: "Tracking" },
];

const featureCards = [
  {
    icon: "auto_awesome",
    label: "Generator",
    title: "Smart Workout Generator",
    body: "Pick your equipment and target muscles — get a ready-to-go workout in seconds, no planning required.",
  },
  {
    icon: "history",
    label: "History",
    title: "History & Favorites",
    body: "Every session is logged automatically. Star exercises you love and revisit them any time.",
  },
  {
    icon: "monitoring",
    label: "Progress",
    title: "Progress Dashboard",
    body: "Track streaks, weekly goals, total workouts, and monthly training hours from one clean dashboard.",
  },
];

const workflowSteps = [
  {
    num: "01",
    icon: "fitness_center",
    title: "Choose Your Equipment",
    body: "Select the machines, free weights, or bodyweight setup available to you today.",
  },
  {
    num: "02",
    icon: "accessibility_new",
    title: "Pick Target Muscles",
    body: "Focus the session on specific muscle groups instead of following a generic routine.",
  },
  {
    num: "03",
    icon: "play_circle",
    title: "Generate & Train",
    body: "Review exercises, read instructions, start the timer, and log the completed session.",
  },
];

const trustStats = [
  { value: "3", unit: "steps", label: "to generate a workout" },
  { value: "∞", unit: "", label: "sessions tracked" },
  { value: "100%", unit: "", label: "free to use" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={1}
          amplitude={0.6}
          interactive
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.04),rgba(8,8,8,0.4)_48%,rgba(8,8,8,0.82)_100%)]" />

      <div className="relative z-10">
        {/* ── Navbar ── */}
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-lg shadow-white/10 overflow-hidden">
              <Image src="/logo.png" alt="WorkoutNow" width={40} height={40} className="object-contain" priority />
            </div>
            <span className="text-base font-black tracking-tight">WorkoutNow</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/65 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden rounded-full border border-white/12 bg-white/[0.05] px-5 py-2 text-sm font-semibold text-white/75 backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.09] hover:text-white sm:inline-flex"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#0b1020] transition hover:bg-[#e8efff]"
            >
              Get Started
              <span className="material-symbols-outlined text-base leading-none">north_east</span>
            </Link>
            <ThemeToggle className="border-white/12 bg-white/[0.08] text-white shadow-none backdrop-blur-xl hover:bg-white/[0.14] hover:text-white" />
          </div>
        </header>

        <main>
          {/* ── Hero ── */}
          <section className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-6 pb-20 pt-8 lg:px-10">
            <div className="relative flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
              {/* Glow */}
              <div className="pointer-events-none absolute left-1/2 top-[15%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),rgba(99,102,241,0.06)_42%,transparent_70%)] blur-3xl" />

              <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
                {/* Badge */}
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70 backdrop-blur-xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  Adaptive Fitness Platform
                </div>

                {/* Headline */}
                <h1 className="max-w-4xl text-[clamp(3.2rem,9vw,6.8rem)] font-black leading-[0.88] tracking-[-0.08em] text-white">
                  Your workout,
                  <br />
                  <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
                    built for you.
                  </span>
                </h1>

                {/* Sub */}
                <p className="mt-7 max-w-2xl text-lg leading-8 text-white/58 sm:text-xl">
                  Generate sessions from your equipment and target muscles. Track favorites, history, streaks, and goals — all in one place.
                </p>

                {/* CTAs */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-8 py-3.5 text-base font-bold text-white shadow-[0_16px_40px_rgba(99,102,241,0.35)] transition hover:bg-indigo-400"
                  >
                    Start for Free
                    <span className="material-symbols-outlined text-[1.05rem]">north_east</span>
                  </Link>
                  <a
                    href="https://github.com/youssefsina/WorkoutNow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-8 py-3.5 text-base font-semibold text-white/85 backdrop-blur-xl transition hover:border-white/28 hover:bg-white/[0.1]"
                  >
                    <span className="material-symbols-outlined filled text-[1.05rem]">star</span>
                    Star on GitHub
                  </a>
                </div>

                <p className="mt-4 text-xs text-white/36">Free and open source.</p>

                {/* Trust strip */}
                <div className="mt-14 flex w-full max-w-xl items-center justify-center gap-0 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl divide-x divide-white/10">
                  {trustStats.map((s) => (
                    <div key={s.label} className="flex-1 px-5 py-4 text-center">
                      <p className="text-2xl font-black tracking-tight text-white">
                        {s.value}
                        {s.unit && <span className="ml-0.5 text-base font-semibold text-white/60">{s.unit}</span>}
                      </p>
                      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Features ── */}
          <section id="features" className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/40">Features</p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Everything you need to train smarter
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => (
                <article
                  key={card.title}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.14)] backdrop-blur-2xl transition hover:border-white/18"
                >
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-indigo-500/20 text-indigo-300">
                    <span className="material-symbols-outlined filled text-xl">{card.icon}</span>
                  </div>
                  <p className="mb-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-white/38">{card.label}</p>
                  <h3 className="mb-3 text-xl font-bold text-white">{card.title}</h3>
                  <p className="text-sm leading-7 text-white/55">{card.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── How It Works ── */}
          <section id="how-it-works" className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/40">How It Works</p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Three steps to your next session
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {workflowSteps.map((step, i) => (
                <article
                  key={step.num}
                  className="relative rounded-[1.8rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(0,0,0,0.18))] p-7 backdrop-blur-2xl"
                >
                  {i < workflowSteps.length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/14 bg-[#090f1e] text-white/40">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </div>
                    </div>
                  )}
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-[0.64rem] font-bold uppercase tracking-[0.32em] text-white/28">{step.num}</span>
                    <div className="h-px flex-1 bg-white/10" />
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] text-white/70">
                      <span className="material-symbols-outlined text-lg">{step.icon}</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-7 text-white/52">{step.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Tracking / Results ── */}
          <section id="tracking" className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
            <div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.06)_50%,rgba(255,255,255,0.04))] p-8 backdrop-blur-3xl lg:p-12">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/40">Progress Tracking</p>
                  <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                    See every rep of your progress
                  </h2>
                  <p className="mt-5 text-base leading-7 text-white/55">
                    The dashboard shows your current streak, weekly goals, total sessions, and monthly hours — so you always know where you stand.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-7 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(99,102,241,0.3)] transition hover:bg-indigo-400"
                    >
                      Start Tracking Free
                      <span className="material-symbols-outlined text-base">north_east</span>
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.05] px-7 py-3 text-sm font-semibold text-white/80 backdrop-blur-xl transition hover:border-white/28 hover:bg-white/[0.09]"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>

                <div className="grid shrink-0 grid-cols-2 gap-3 lg:w-[22rem]">
                  {[
                    { icon: "local_fire_department", label: "Current Streak", value: "Track it" },
                    { icon: "emoji_events", label: "Weekly Goal", value: "4 sessions" },
                    { icon: "history", label: "All Sessions", value: "Every log" },
                    { icon: "favorite", label: "Favorites", value: "Save any" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4"
                    >
                      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                        <span className="material-symbols-outlined filled text-base">{item.icon}</span>
                      </div>
                      <p className="text-xs font-medium text-white/38">{item.label}</p>
                      <p className="mt-1 text-sm font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-8 sm:flex-row lg:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white overflow-hidden">
              <Image src="/logo.png" alt="WorkoutNow" width={28} height={28} className="object-contain" />
            </div>
            <span className="text-sm font-bold text-white/60">WorkoutNow</span>
          </div>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/28">
            &copy; {new Date().getFullYear()} — Workout generator &amp; tracker
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs text-white/38 hover:text-white/70 transition">Sign In</Link>
            <Link href="/signup" className="text-xs text-white/38 hover:text-white/70 transition">Sign Up</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
