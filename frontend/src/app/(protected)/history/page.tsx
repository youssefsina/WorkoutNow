"use client";

import { useEffect, useState } from "react";
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

  return (
    <div>
      <h1 className="mb-0.5 text-3xl font-extrabold">
        Workout <span className="text-primary">History</span>
      </h1>
      <p className="mb-6 text-slate-500">Your completed workout sessions</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined mb-3 text-5xl text-slate-300">
            fitness_center
          </span>
          <p className="text-lg font-semibold text-slate-500">
            No workouts completed yet
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Generate and complete your first workout to see it here
          </p>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([date, workouts]) => (
            <div key={date} className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">
                  calendar_month
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {date}
                </span>
              </div>

              <div className="space-y-2">
                {workouts.map((session, idx) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm animate-fadeUp"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">
                        {session.exercisesCount} exercises
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {session.exerciseNames.slice(0, 3).join(", ")}
                        {session.exerciseNames.length > 3 && "..."}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {session.durationMinutes > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600">
                          <span className="material-symbols-outlined text-sm">
                            schedule
                          </span>
                          {session.durationMinutes} min
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
                        {new Date(session.completedAt).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Load More
                <span className="material-symbols-outlined text-lg">
                  expand_more
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
