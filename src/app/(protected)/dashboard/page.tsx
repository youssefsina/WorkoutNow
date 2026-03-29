"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { userAPI, workoutAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "@/components/ThemeProvider";

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

/* ── helpers ── */
function buildWeekData(history: WorkoutSession[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const count = history.filter((s) => {
      const sd = new Date(s.completedAt);
      return sd.toDateString() === d.toDateString();
    }).length;
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      workouts: count,
      isToday: i === 6,
    };
  });
}

/* ── Custom tooltip ── */
function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">
        {payload[0].value} session{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

/* ── Skeleton ── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />;
}

/* ── Stat card ── */
function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  borderHover,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  borderHover: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md ${borderHover}`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <span className={`material-symbols-outlined filled text-2xl ${iconColor}`}>
          {icon}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { theme } = useTheme();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, historyRes] = await Promise.all([
          userAPI.getStats(),
          workoutAPI.getHistory(7),
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
  const weekData = buildWeekData(history);

  const isDark = theme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  return (
    <div className="space-y-5">
      {/* ── Welcome Banner ── */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h1 className="mb-1.5 text-xl font-bold text-foreground sm:text-2xl">
              Welcome back, {displayName} 👋
            </h1>
            <p className="mb-5 text-sm text-muted-foreground">
              Keep your momentum! You&apos;re doing great with your fitness goals this month.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/workout-generator"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:brightness-110"
              >
                <span className="material-symbols-outlined filled text-lg">add_circle</span>
                Generate Workout
              </Link>
              <Link
                href="/history"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                <span className="material-symbols-outlined text-lg">history</span>
                View History
              </Link>
            </div>
          </div>

          <div className="hidden shrink-0 md:block">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-border bg-muted/50">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-primary/25 [animation-duration:12s]" />
              <span className="material-symbols-outlined filled text-5xl text-primary">
                fitness_center
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {loading ? (
          <>
            <Skeleton className="h-[76px]" />
            <Skeleton className="h-[76px]" />
            <Skeleton className="h-[76px]" />
          </>
        ) : (
          <>
            <StatCard
              icon="calendar_today"
              iconBg="bg-primary/10"
              iconColor="text-primary"
              label="Total Workouts"
              value={String(stats?.totalWorkouts ?? 0)}
              borderHover="hover:border-primary/30"
            />
            <StatCard
              icon="trending_up"
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-500"
              label="This Week"
              value={String(weeklyWorkouts)}
              borderHover="hover:border-emerald-500/30"
            />
            <StatCard
              icon="schedule"
              iconBg="bg-violet-500/10"
              iconColor="text-violet-500"
              label="Monthly Hours"
              value={`${monthlyHours}h`}
              borderHover="hover:border-violet-500/30"
            />
          </>
        )}
      </div>

      {/* ── Charts + Streak row ── */}
      {!loading && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Weekly Activity Chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Weekly Activity</h2>
                <p className="text-xs text-muted-foreground">Sessions logged last 7 days</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                7 days
              </span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="4 4" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: axisColor }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: axisColor }}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "transparent" }} />
                  <Bar dataKey="workouts" radius={[6, 6, 0, 0]}>
                    {weekData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.isToday
                            ? "hsl(var(--primary))"
                            : entry.workouts > 0
                            ? isDark
                              ? "rgba(99,102,241,0.45)"
                              : "rgba(99,102,241,0.3)"
                            : isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.06)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Streak */}
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-5 text-white shadow-sm">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined filled text-2xl">local_fire_department</span>
                <h2 className="text-base font-bold">Current Streak</h2>
              </div>
              <p className="mt-2 text-5xl font-extrabold leading-none">
                {stats?.currentStreak ?? 0}
                <span className="ml-1.5 text-lg font-semibold opacity-75">days</span>
              </p>
            </div>
            <div>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-sm">
                <span className="material-symbols-outlined text-lg">military_tech</span>
                <span className="text-sm font-medium">
                  Best: {stats?.longestStreak ?? 0} days
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Weekly Progress ── */}
      {!loading && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Weekly Goal</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              {Math.round(weeklyProgress)}% complete
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-2 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.4)] transition-all duration-700"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0 sessions</span>
                <span>{weeklyGoal} sessions goal</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xl font-bold text-foreground">
                {weeklyWorkouts}
                <span className="text-base font-medium text-muted-foreground">/{weeklyGoal}</span>
              </p>
            </div>
          </div>

          {remainingSessions > 0 ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary/8 px-4 py-3">
              <span className="material-symbols-outlined text-xl text-primary">emoji_events</span>
              <p className="text-sm text-foreground">
                <span className="font-bold text-primary">
                  {remainingSessions} more session{remainingSessions !== 1 ? "s" : ""}
                </span>{" "}
                to hit your weekly target.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-3">
              <span className="material-symbols-outlined filled text-xl text-emerald-500">check_circle</span>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Weekly goal reached! Keep it up.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Recent Activity ── */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">Recent Activity</h2>
          <Link
            href="/history"
            className="flex items-center gap-1 text-sm font-semibold text-primary transition hover:underline"
          >
            View All
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-14 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined filled text-3xl text-primary">
                fitness_center
              </span>
            </div>
            <p className="mb-1 font-bold text-foreground">No workouts logged yet</p>
            <p className="mb-5 text-sm text-muted-foreground">
              Generate your first session and it will appear here.
            </p>
            <Link
              href="/workout-generator"
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/8"
            >
              <span className="material-symbols-outlined filled text-lg">auto_awesome</span>
              Create First Workout
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {history.slice(0, 5).map((session, index) => {
              const d = new Date(session.completedAt);
              const label =
                session.exerciseNames?.length > 0
                  ? session.exerciseNames[0]
                  : `${session.exercisesCount} exercises`;
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      index === 0
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="material-symbols-outlined filled text-xl">fitness_center</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })},{" "}
                      {d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>

                  <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                    {session.durationMinutes > 0 ? `${session.durationMinutes} min` : "—"}
                  </span>

                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Done
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
