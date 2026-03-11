"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useWorkoutStore } from "@/store/useWorkoutStore";
import { workoutAPI } from "@/lib/api";

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const { generatedExercises, reset } = useWorkoutStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set(),
  );
  const [elapsed, setElapsed] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [completing, setCompleting] = useState(false);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (generatedExercises.length === 0) {
      router.push("/workout-generator");
    }
  }, [generatedExercises, router]);

  if (generatedExercises.length === 0) return null;

  const exercise = generatedExercises[currentIndex];
  const progress = (completedExercises.size / generatedExercises.length) * 100;
  const allDone = completedExercises.size === generatedExercises.length;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const markDone = () => {
    setCompletedExercises((prev) => new Set(prev).add(currentIndex));
    if (currentIndex < generatedExercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const durationMinutes = Math.round(elapsed / 60);
      await workoutAPI.complete({
        exercisesCount: generatedExercises.length,
        exerciseNames: generatedExercises.map((e: any) => e.name),
        durationMinutes,
      });
      toast.success("Workout completed! Great job! 🎉");
      reset();
      router.push("/dashboard");
    } catch {
      toast.error("Failed to save workout");
    } finally {
      setCompleting(false);
    }
  };

  const toggleFav = async (ex: any) => {
    try {
      await workoutAPI.toggleFavorite(
        ex.id,
        ex.name,
        ex.imageUrl || ex.videoUrl || "",
        ex.muscles?.[0]?.name || ex.targetMuscles?.[0] || "",
      );
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(ex.id)) next.delete(ex.id);
        else next.add(ex.id);
        return next;
      });
    } catch {
      /* silent */
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* timer + quit */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-primary">
            timer
          </span>
          <span className="font-mono text-2xl font-extrabold text-slate-900">
            {fmt(elapsed)}
          </span>
        </div>
        <button
          onClick={() => setShowQuitDialog(true)}
          className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <span className="material-symbols-outlined text-lg">close</span>
          Quit
        </button>
      </div>

      {/* progress bar */}
      <div className="mb-6">
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-700">
            {completedExercises.size} / {generatedExercises.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* current exercise card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm animate-fadeUp">
        {/* media */}
        {(exercise.videoUrl || exercise.imageUrl) && (
          <div className="flex max-h-[300px] justify-center bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(exercise.videoUrl || exercise.imageUrl) as string}
              alt={exercise.name}
              className="max-h-[300px] w-full object-contain"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Exercise {currentIndex + 1} of {generatedExercises.length}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                {exercise.name}
              </h2>
              <p className="mt-0.5 text-sm capitalize text-slate-500">
                {exercise.muscles?.[0]?.name ||
                  exercise.targetMuscles?.[0] ||
                  ""}{" "}
                • {exercise.equipment?.[0]?.name || ""}
              </p>
            </div>
            <button
              onClick={() => toggleFav(exercise)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
            >
              <span
                className={`material-symbols-outlined text-2xl ${
                  favorites.has(exercise.id)
                    ? "filled text-red-500"
                    : "text-slate-400"
                }`}
              >
                favorite
              </span>
            </button>
          </div>

          {/* sets / reps */}
          <div className="mt-5 rounded-xl bg-primary/5 py-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {exercise.sets || 3} Sets ×{" "}
              {exercise.repRange || "10-12"} Reps
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {exercise.restSeconds || 60}s rest between sets
            </p>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <span className="material-symbols-outlined">skip_previous</span>
        </button>

        {allDone ? (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-green-600/25 transition hover:brightness-110 disabled:opacity-60"
          >
            {completing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                Complete Workout
              </>
            )}
          </button>
        ) : (
          <button
            onClick={markDone}
            className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-md shadow-primary/25 transition hover:brightness-110"
          >
            <span className="material-symbols-outlined text-lg">
              check_circle
            </span>
            {completedExercises.has(currentIndex) ? "Done ✓" : "Mark Done"}
          </button>
        )}

        <button
          disabled={currentIndex === generatedExercises.length - 1}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <span className="material-symbols-outlined">skip_next</span>
        </button>
      </div>

      {/* exercise queue */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
          Workout Queue
        </h3>
        <div className="space-y-2">
          {generatedExercises.map((ex: any, i: number) => {
            const done = completedExercises.has(i);
            const active = i === currentIndex;
            return (
              <button
                key={ex.id || i}
                onClick={() => setCurrentIndex(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                  active
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-slate-100 bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-green-100 text-green-600"
                      : active
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? (
                    <span className="material-symbols-outlined text-base">
                      check
                    </span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`truncate text-sm font-medium ${
                    done
                      ? "text-slate-400 line-through"
                      : active
                        ? "text-primary"
                        : "text-slate-700"
                  }`}
                >
                  {ex.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* quit dialog */}
      {showQuitDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowQuitDialog(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900">
              Quit Workout?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Your progress will be lost. Are you sure you want to quit?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowQuitDialog(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  reset();
                  router.push("/dashboard");
                }}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
