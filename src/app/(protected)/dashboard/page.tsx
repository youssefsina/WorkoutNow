"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion, type Variants } from "framer-motion";
import { userAPI, workoutAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "@/components/ThemeProvider";

/* ─── Types ─────────────────────────────────────────────── */
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

/* ─── Helpers ────────────────────────────────────────────── */
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

/* ─── Motion variants ───────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

/* ─── Sub-components ─────────────────────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted ${className}`} />;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-foreground">{label}</p>
      <p className="text-muted-foreground">
        {payload[0].value} session{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  color,
  index,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: `${color}18` }}
      >
        <span
          className="material-symbols-outlined filled text-xl"
          style={{ color }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-extrabold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
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

  /* bar colors */
  const barActive = "hsl(243,72%,60%)";
  const barHas = isDark ? "rgba(99,88,217,0.55)" : "rgba(80,71,193,0.45)";
  const barEmpty = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const axisColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";

  return (
    <div className="space-y-4">

      {/* ── Welcome ──────────────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-violet-700 p-5 text-white shadow-lg shadow-primary/25"
      >
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-6 left-0 h-32 w-32 rounded-full bg-violet-300/10 blur-2xl" />

        <div className="relative">
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-white/60">
            Welcome back
          </p>
          <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Keep your momentum going strong!
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/workout-generator"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary shadow-md transition hover:brightness-95"
            >
              <span className="material-symbols-outlined filled text-base">
                add_circle
              </span>
              Generate Workout
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <span className="material-symbols-outlined text-base">
                history
              </span>
              View History
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Stat Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {loading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <StatCard
              index={1}
              icon="calendar_today"
              label="Total"
              value={String(stats?.totalWorkouts ?? 0)}
              color="#3b82f6"
            />
            <StatCard
              index={2}
              icon="trending_up"
              label="This Week"
              value={String(weeklyWorkouts)}
              color="#10b981"
            />
            <StatCard
              index={3}
              icon="schedule"
              label="Mo. Hours"
              value={`${monthlyHours}h`}
              color="#8b5cf6"
            />
          </>
        )}
      </div>

      {/* ── Chart + Streak row ────────────────────────────── */}
      {!loading && (
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="grid grid-cols-5 gap-3"
        >
          {/* Bar chart — takes 3 cols */}
          <div className="col-span-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Activity</p>
                <p className="text-[11px] text-muted-foreground">Last 7 days</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                7 days
              </span>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weekData}
                  barSize={18}
                  margin={{ top: 4, right: 0, bottom: 0, left: -28 }}
                >
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: axisColor }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: axisColor }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar dataKey="workouts" radius={[6, 6, 2, 2]}>
                    {weekData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.isToday
                            ? barActive
                            : entry.workouts > 0
                            ? barHas
                            : barEmpty
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Streak card — takes 2 cols */}
          <div className="col-span-2 flex flex-col rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-4 text-white shadow-sm">
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <span className="material-symbols-outlined filled text-xl">
                local_fire_department
              </span>
              Streak
            </div>
            <p className="mt-auto text-5xl font-extrabold leading-none">
              {stats?.currentStreak ?? 0}
            </p>
            <p className="mt-0.5 text-sm font-semibold opacity-75">days</p>
            <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-medium">
              <span className="material-symbols-outlined text-sm">
                military_tech
              </span>
              Best: {stats?.longestStreak ?? 0}d
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Weekly Goal ───────────────────────────────────── */}
      {!loading && (
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">Weekly Goal</p>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              {Math.round(weeklyProgress)}% done
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(var(--primary)), #f97316)",
                boxShadow: "0 0 12px hsl(var(--primary) / 0.4)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${weeklyProgress}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{weeklyWorkouts} sessions</span>
            <span className="font-semibold text-foreground">
              {weeklyWorkouts}
              <span className="font-normal text-muted-foreground">
                /{weeklyGoal}
              </span>
            </span>
          </div>

          {remainingSessions > 0 ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/8 px-3 py-2.5 text-xs">
              <span className="material-symbols-outlined text-base text-primary">
                emoji_events
              </span>
              <span className="text-foreground">
                <span className="font-bold text-primary">
                  {remainingSessions} more session
                  {remainingSessions !== 1 ? "s" : ""}
                </span>{" "}
                to hit your weekly target
              </span>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-xs">
              <span className="material-symbols-outlined filled text-base text-emerald-500">
                check_circle
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Weekly goal reached!
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Recent Activity ────────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        custom={6}
        initial="hidden"
        animate="show"
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <p className="text-sm font-bold text-foreground">Recent Activity</p>
          <Link
            href="/history"
            className="flex items-center gap-0.5 text-xs font-semibold text-primary"
          >
            View All
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined filled text-2xl text-primary">
                fitness_center
              </span>
            </div>
            <p className="mb-1 text-sm font-bold text-foreground">
              No workouts yet
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              Generate your first session to get started.
            </p>
            <Link
              href="/workout-generator"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary"
            >
              <span className="material-symbols-outlined filled text-base">
                auto_awesome
              </span>
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
                <motion.div
                  key={session.id}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      index === 0
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="material-symbols-outlined filled text-lg">
                      fitness_center
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {d.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {session.durationMinutes > 0 && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {session.durationMinutes}m
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Done
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>
    </div>
  );
}
