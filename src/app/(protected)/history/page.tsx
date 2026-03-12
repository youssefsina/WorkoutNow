"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { workoutAPI } from "@/lib/api";

interface WorkoutSession {
  id: string;
  exercisesCount: number;
  exerciseNames: string[];
  durationMinutes: number;
  completedAt: string;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const fetchHistory = async (pageNum: number) => {
    try {
      const res = await workoutAPI.getHistory(PAGE_SIZE, pageNum * PAGE_SIZE);
      const data: WorkoutSession[] = res.data;
      if (pageNum === 0) setSessions(data);
      else setSessions((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(0);
  }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchHistory(next);
  };

  const grouped = sessions.reduce(
    (acc, s) => {
      const date = new Date(s.completedAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(s);
      return acc;
    },
    {} as Record<string, WorkoutSession[]>,
  );

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div className="animate-fadeUp space-y-6">
      {/* ── Header Banner ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-100 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-16 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary">history</span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Activity Log</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl md:text-4xl">
            Workout <span className="text-primary">History</span>
          </h1>
          <p className="mt-1 text-slate-500">All your completed workout sessions</p>

          {!loading && sessions.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <span className="material-symbols-outlined text-lg text-primary">fitness_center</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Sessions</p>
                  <p className="text-lg font-extrabold text-slate-900">{sessions.length}</p>
                </div>
              </div>
              {totalMinutes > 0 && (
                <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                    <span className="material-symbols-outlined text-lg text-indigo-500">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Time</p>
                    <p className="text-lg font-extrabold text-slate-900">
                      {totalMinutes >= 60
                        ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
                        : `${totalMinutes}m`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <span className="material-symbols-outlined text-4xl text-slate-300">fitness_center</span>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-700">No workouts yet</p>
            <p className="mt-1 text-sm text-slate-400">Complete a workout to start tracking your progress</p>
          </div>
          <Link
            href="/workout-generator"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            Generate your first workout
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, workouts]) => (
            <div key={date}>
              {/* Date header */}
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  {date}
                </span>
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs text-slate-400">{workouts.length} session{workouts.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="space-y-2.5">
                {workouts.map((session, idx) => (
                  <div
                    key={session.id}
                    className="animate-fadeUp overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:border-primary/20 hover:shadow-md"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                        <span className="material-symbols-outlined text-primary">fitness_center</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">
                          {session.exercisesCount} Exercise{session.exercisesCount !== 1 ? "s" : ""}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {session.exerciseNames.slice(0, 3).join(" · ")}
                          {session.exerciseNames.length > 3 && ` +${session.exerciseNames.length - 3} more`}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {session.durationMinutes > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {session.durationMinutes} min
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          {new Date(session.completedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Load more sessions
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
