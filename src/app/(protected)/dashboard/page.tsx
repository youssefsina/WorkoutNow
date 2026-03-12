"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { userAPI, workoutAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

interface DashboardStats {
  totalWorkouts: number;
  weeklyWorkouts: number;
  monthlyDuration: number;
  currentStreak: number;
  longestStreak: number;
}

interface WorkoutSession {
  id: string;
  exercisesCount: number;
  exerciseNames: string[];
  durationMinutes: number;
  completedAt: string;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, historyRes] = await Promise.all([
          userAPI.getStats(),
          workoutAPI.getHistory(5),
        ]);
        setStats(statsRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "there";
  const weeklyWorkouts = stats?.weeklyWorkouts ?? 0;
  const weeklyGoal = 4;
  const weeklyProgress = Math.min((weeklyWorkouts / weeklyGoal) * 100, 100);
  const monthlyHours = Math.round((stats?.monthlyDuration ?? 0) / 60);
  const remainingSessions = Math.max(weeklyGoal - weeklyWorkouts, 0);

  /* ── Skeleton placeholder ───────────────────── */
  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
  );

  return (
    <div className="space-y-6">
      {/* ── Hero ────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h1 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">
              Welcome back, {displayName}&nbsp;👋
            </h1>
            <p className="mb-5 text-slate-500">
              Keep your momentum! You&apos;re doing great with your fitness goals
              this month.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/workout-generator"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110"
              >
                <span className="material-symbols-outlined text-xl">
                  add_circle
                </span>
                Generate Workout
              </Link>
              <Link
                href="/history"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View History
              </Link>
            </div>
          </div>

          {/* decorative icon */}
          <div className="hidden shrink-0 md:block">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-primary/5">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-dashed border-primary/20 [animation-duration:10s]" />
              <span className="material-symbols-outlined text-6xl text-primary">
                fitness_center
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat Cards ──────────────────────────── */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {loading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            {/* Total Workouts */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-primary/30 sm:gap-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-14 sm:w-14">
                <span className="material-symbols-outlined text-2xl text-primary sm:text-3xl">
                  calendar_today
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  Total Workouts
                </p>
                <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {stats?.totalWorkouts ?? 0}
                </p>
              </div>
            </div>

            {/* This Week */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-green-300 sm:gap-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 sm:h-14 sm:w-14">
                <span className="material-symbols-outlined text-2xl text-green-600 sm:text-3xl">
                  trending_up
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 sm:text-sm">This Week</p>
                <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {weeklyWorkouts}
                </p>
              </div>
            </div>

            {/* Monthly Hours */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-violet-300 sm:gap-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 sm:h-14 sm:w-14">
                <span className="material-symbols-outlined text-2xl text-violet-600 sm:text-3xl">
                  schedule
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  Monthly Hours
                </p>
                <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {monthlyHours}h
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Weekly Progress + Streak Row ─────────── */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Weekly Progress */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Weekly Progress
              </h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-primary">
                Active Goal
              </span>
            </div>

            <div className="mb-2 flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-slate-900">
                  {Math.round(weeklyProgress)}%
                </p>
                <p className="text-sm text-slate-500">of weekly goal reached</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">
                  {weeklyWorkouts}/{weeklyGoal}
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Sessions
                </p>
              </div>
            </div>

            {/* progress bar */}
            <div className="mb-4 h-4 overflow-hidden rounded-full bg-primary/10">
              <div
                className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(40,102,235,.5)] transition-all duration-500"
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-3">
              <span className="material-symbols-outlined mt-0.5 text-xl text-primary">
                emoji_events
              </span>
              <div>
                <p className="text-sm font-bold text-primary">
                  {remainingSessions === 0 ? "Goal reached!" : "Almost there!"}
                </p>
                <p className="text-sm text-slate-500">
                  {remainingSessions === 0
                    ? "You've hit your weekly target. Keep it up!"
                    : `Just ${remainingSessions} more session${remainingSessions === 1 ? "" : "s"} to hit your weekly target.`}
                </p>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-sm">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined filled text-2xl">
                  local_fire_department
                </span>
                <h2 className="text-lg font-bold">Current Streak</h2>
              </div>
              <p className="text-5xl font-extrabold">
                {stats?.currentStreak ?? 0}
                <span className="ml-1 text-lg font-semibold opacity-80">
                  days
                </span>
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 backdrop-blur-sm">
              <span className="material-symbols-outlined text-xl">
                military_tech
              </span>
              <span className="text-sm font-medium">
                Longest streak: {stats?.longestStreak ?? 0} days
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Recent Activity ─────────────────────── */}
      <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <Link
            href="/history"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View All
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-3xl text-primary">
                fitness_center
              </span>
            </div>
            <p className="mb-1 font-bold text-slate-900">
              No workouts logged yet
            </p>
            <p className="mb-4 text-sm text-slate-500">
              Start with a generated plan and your recent sessions will appear
              here.
            </p>
            <Link
              href="/workout-generator"
              className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              <span className="material-symbols-outlined text-lg">
                auto_awesome
              </span>
              Create First Workout
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {history.map((session, index) => {
              const d = new Date(session.completedAt);
              const label =
                session.exerciseNames?.length > 0
                  ? session.exerciseNames[0]
                  : `${session.exercisesCount} exercises`;
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-slate-50"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      index === 0
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      fitness_center
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {label}
                    </p>
                    <p className="text-xs text-slate-400">
                      {d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {", "}
                      {d.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <span className="hidden text-sm font-medium text-slate-700 sm:block">
                    {session.durationMinutes > 0
                      ? `${session.durationMinutes} min`
                      : "—"}
                  </span>

                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Completed
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
