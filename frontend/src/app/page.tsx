"use client";

import { useRouter } from "next/navigation";

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50K+", label: "Workouts Generated" },
  { value: "1000+", label: "Exercises" },
  { value: "99%", label: "Satisfaction" },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f9fafb]">
      {/* Subtle gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-16">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 animate-fadeUp">
          <span className="material-symbols-outlined text-lg text-primary">
            bolt
          </span>
          <span className="text-sm font-semibold text-primary">
            AI-Powered Fitness Platform
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fadeUp">
          Transform Your
          <br />
          <span className="text-primary">Fitness Journey</span>
        </h1>

        {/* Subheading */}
        <p className="mb-10 max-w-2xl text-center text-lg leading-relaxed text-slate-500 sm:text-xl animate-fadeUp" style={{ animationDelay: "80ms" }}>
          Create custom workout plans tailored to your equipment and goals.
          Start your transformation today with WorkoutNow.
        </p>

        {/* CTA */}
        <div className="mb-16 flex w-full flex-col gap-3 sm:w-auto sm:flex-row animate-fadeUp" style={{ animationDelay: "120ms" }}>
          <button
            onClick={() => router.push("/signup")}
            className="min-w-[200px] rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:brightness-110"
          >
            Get Started Free
          </button>
          <button
            onClick={() => router.push("/login")}
            className="min-w-[200px] rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 transition hover:border-primary/40 hover:text-primary"
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 animate-fadeUp" style={{ animationDelay: "160ms" }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="cursor-default rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md md:p-8 animate-scaleIn"
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              <p className="mb-1 text-3xl font-extrabold text-primary md:text-4xl lg:text-5xl">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-slate-400 md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
