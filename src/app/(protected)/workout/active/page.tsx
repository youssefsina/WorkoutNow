"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useWorkoutStore } from "@/store/useWorkoutStore";
import { workoutAPI, exerciseAPI } from "@/lib/api";

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const { generatedExercises, replaceExercise, removeExercise, reset } =
    useWorkoutStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set(),
  );
  const [skippedExercises, setSkippedExercises] = useState<Set<number>>(
    new Set(),
  );
  const [elapsed, setElapsed] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  // Rest timer
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const restTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Set tracking
  const [currentSet, setCurrentSet] = useState(1);

  // Swipe support
  const touchStartX = useRef(0);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Full details cache (for video URLs)
  const [detailsCache, setDetailsCache] = useState<Record<string, any>>({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Workout timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Redirect if no exercises
  useEffect(() => {
    if (generatedExercises.length === 0) {
      router.push("/workout-generator");
    }
  }, [generatedExercises, router]);

  // Fetch full details (with video) for current exercise
  const fetchDetails = useCallback(
    async (exerciseId: string) => {
      if (detailsCache[exerciseId]) return;
      setLoadingDetails(true);
      try {
        const res = await exerciseAPI.getDetails(exerciseId);
        if (res.data) {
          setDetailsCache((prev) => ({ ...prev, [exerciseId]: res.data }));
        }
      } catch {
        /* silent */
      } finally {
        setLoadingDetails(false);
      }
    },
    [detailsCache],
  );

  useEffect(() => {
    if (generatedExercises.length > 0 && generatedExercises[currentIndex]) {
      fetchDetails(generatedExercises[currentIndex].id);
    }
  }, [currentIndex, generatedExercises, fetchDetails]);

  // Reset state when switching exercises
  useEffect(() => {
    setCurrentSet(1);
    setShowInstructions(false);
    setMediaError(false);
    stopRest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  if (generatedExercises.length === 0) return null;

  const exercise = generatedExercises[currentIndex];
  const details = detailsCache[exercise.id];
  const videoUrl = details?.videoUrl || exercise.videoUrl;
  const imageUrl = details?.imageUrl || exercise.imageUrl;
  const instructions =
    details?.instructionsList ||
    exercise.instructionsList ||
    (details?.instructions
      ? typeof details.instructions === "string"
        ? [details.instructions]
        : details.instructions
      : exercise.instructions
        ? typeof exercise.instructions === "string"
          ? [exercise.instructions]
          : []
        : []);
  const tips = details?.exerciseTips || exercise.exerciseTips || [];
  const overview = details?.overview || exercise.overview || "";
  const totalSets = exercise.sets || 3;
  const restSeconds = exercise.restSeconds || 60;

  const doneCount = completedExercises.size + skippedExercises.size;
  const progress = (doneCount / generatedExercises.length) * 100;
  const allDone = doneCount === generatedExercises.length;

  const isGif =
    videoUrl?.toLowerCase().endsWith(".gif") ||
    videoUrl?.toLowerCase().includes("gif");
  const isMp4 =
    videoUrl?.toLowerCase().endsWith(".mp4") ||
    videoUrl?.toLowerCase().includes(".mp4");

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // ── Rest Timer ────────────────────────────────
  const startRest = () => {
    setResting(true);
    setRestTime(restSeconds);
    restTimerRef.current = setInterval(() => {
      setRestTime((prev) => {
        if (prev <= 1) {
          stopRest();
          toast("Rest over — let's go!", { icon: "💪" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRest = () => {
    setResting(false);
    setRestTime(0);
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }
  };

  // ── Actions ───────────────────────────────────
  const completeSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet((s) => s + 1);
      startRest();
    } else {
      // All sets done → mark exercise complete
      setCompletedExercises((prev) => new Set(prev).add(currentIndex));
      toast.success(`${exercise.name} complete!`);
      if (currentIndex < generatedExercises.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    }
  };

  const skipExercise = () => {
    setSkippedExercises((prev) => new Set(prev).add(currentIndex));
    toast("Exercise skipped", { icon: "⏭️" });
    if (currentIndex < generatedExercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < generatedExercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const durationMinutes = Math.round(elapsed / 60);
      const completedNames = generatedExercises
        .filter((_: any, i: number) => completedExercises.has(i))
        .map((e: any) => e.name);
      await workoutAPI.complete({
        exercisesCount: completedExercises.size,
        exerciseNames: completedNames,
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
      const det = detailsCache[ex.id];
      const imgUrl = det?.videoUrl || det?.imageUrl || ex.videoUrl || ex.imageUrl || "";
      await workoutAPI.toggleFavorite(
        ex.id,
        ex.name,
        imgUrl,
        ex.muscles?.[0]?.name || ex.targetMuscles?.[0] || "",
      );
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(ex.id)) next.delete(ex.id);
        else next.add(ex.id);
        return next;
      });
      toast.success(
        favorites.has(ex.id) ? "Removed from favorites" : "Saved to favorites!",
      );
    } catch {
      /* silent */
    }
  };

  // ── Swipe handlers ────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-24 sm:pb-4">
      {/* ── Top Bar: Timer + Progress + Quit ─────── */}
      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
        {/* Timer */}
        <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-100 sm:gap-2 sm:px-4">
          <span className="material-symbols-outlined text-lg text-primary sm:text-xl">
            timer
          </span>
          <span className="font-mono text-lg font-extrabold text-slate-900 sm:text-2xl">
            {fmt(elapsed)}
          </span>
        </div>

        {/* Quick stats */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {completedExercises.size} done
          </div>
          {skippedExercises.size > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600">
              <span className="material-symbols-outlined text-sm">skip_next</span>
              {skippedExercises.size} skipped
            </div>
          )}
        </div>

        <button
          onClick={() => setShowQuitDialog(true)}
          className="flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-500 shadow-sm transition hover:bg-red-50"
        >
          <span className="material-symbols-outlined text-lg">close</span>
          <span className="hidden sm:inline">Quit</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4 sm:mb-6">
        <div className="mb-1 flex justify-between text-xs sm:text-sm">
          <span className="text-slate-500">
            Exercise {currentIndex + 1} of {generatedExercises.length}
          </span>
          <span className="font-semibold text-slate-700">
            {doneCount}/{generatedExercises.length} complete
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 sm:h-2.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 shadow-[0_0_8px_rgba(40,102,235,.4)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Exercise Card (swipeable on mobile) ──── */}
      <div
        className="mb-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm animate-fadeUp sm:mb-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Video / GIF / Image */}
        <div className="relative bg-slate-900">
          {loadingDetails && !videoUrl && !imageUrl ? (
            <div className="flex aspect-video items-center justify-center bg-slate-100">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : !mediaError && isMp4 && videoUrl ? (
            <video
              key={videoUrl}
              loop
              autoPlay
              muted
              playsInline
              className="aspect-video w-full object-contain bg-slate-50"
              onError={() => setMediaError(true)}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : !mediaError && isGif && videoUrl ? (
            <div className="aspect-video w-full bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={videoUrl}
                alt={exercise.name}
                className="h-full w-full object-contain"
                onError={() => setMediaError(true)}
              />
            </div>
          ) : !mediaError && imageUrl ? (
            <div className="aspect-video w-full bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={exercise.name}
                className="h-full w-full object-contain"
                onError={() => setMediaError(true)}
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-slate-100">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  fitness_center
                </span>
                <p className="mt-1 text-xs text-slate-400">No preview</p>
              </div>
            </div>
          )}

          {/* Floating badges on video */}
          <div className="absolute left-2 top-2 flex gap-1.5 sm:left-3 sm:top-3">
            {(exercise.muscles?.[0]?.name || exercise.targetMuscles?.[0]) && (
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:text-xs">
                {exercise.muscles?.[0]?.name || exercise.targetMuscles?.[0]}
              </span>
            )}
            {exercise.equipment?.[0]?.name && (
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:text-xs">
                {exercise.equipment[0].name}
              </span>
            )}
          </div>
        </div>

        {/* Exercise info */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold leading-tight text-slate-900 sm:text-2xl">
                {exercise.name}
              </h2>
              {overview && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500 sm:text-sm">
                  {overview}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => toggleFav(exercise)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-slate-100 sm:h-10 sm:w-10"
                title="Save to favorites"
              >
                <span
                  className={`material-symbols-outlined text-xl sm:text-2xl ${
                    favorites.has(exercise.id)
                      ? "filled text-red-500"
                      : "text-slate-400"
                  }`}
                >
                  favorite
                </span>
              </button>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-slate-100 sm:h-10 sm:w-10 ${
                  showInstructions ? "bg-primary/10" : ""
                }`}
                title="Show instructions"
              >
                <span
                  className={`material-symbols-outlined text-xl sm:text-2xl ${
                    showInstructions ? "text-primary" : "text-slate-400"
                  }`}
                >
                  info
                </span>
              </button>
            </div>
          </div>

          {/* Sets / Reps / Rest row */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl bg-primary/5 p-2.5 text-center sm:p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60 sm:text-xs">
                Sets
              </p>
              <p className="text-xl font-extrabold text-primary sm:text-2xl">
                {currentSet}/{totalSets}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-center sm:p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 sm:text-xs">
                Reps
              </p>
              <p className="text-xl font-extrabold text-indigo-600 sm:text-2xl">
                {exercise.repRange || "10-12"}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-center sm:p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 sm:text-xs">
                Rest
              </p>
              <p className="text-xl font-extrabold text-emerald-600 sm:text-2xl">
                {restSeconds}s
              </p>
            </div>
          </div>

          {/* Rest Timer Overlay */}
          {resting && (
            <div className="mt-4 animate-scaleIn rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-center text-white shadow-lg sm:p-5">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                Rest Timer
              </p>
              <p className="my-1 font-mono text-4xl font-black sm:text-5xl">
                {fmt(restTime)}
              </p>
              <button
                onClick={stopRest}
                className="mt-2 rounded-lg bg-white/20 px-5 py-2 text-sm font-bold backdrop-blur-sm transition hover:bg-white/30"
              >
                Skip Rest
              </button>
            </div>
          )}

          {/* Instructions Panel */}
          {showInstructions && (
            <div className="mt-4 animate-fadeUp rounded-xl border border-slate-100 bg-slate-50 p-4">
              {instructions.length > 0 ? (
                <div className="mb-3">
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
                    <span className="material-symbols-outlined text-sm text-primary">
                      format_list_numbered
                    </span>
                    How to Perform
                  </h4>
                  <ol className="list-decimal space-y-1 pl-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {instructions.map((inst: string, i: number) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No instructions available for this exercise.
                </p>
              )}
              {tips.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary sm:text-sm">
                    <span className="material-symbols-outlined text-sm">
                      lightbulb
                    </span>
                    Pro Tips
                  </h4>
                  <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {tips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Action Buttons ───────────────────────── */}
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
        {/* Navigation row */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button
            disabled={currentIndex === 0}
            onClick={goToPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 disabled:opacity-30 sm:h-11 sm:w-11"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">
              skip_previous
            </span>
          </button>

          {allDone ? (
            <button
              onClick={handleComplete}
              disabled={completing}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition hover:brightness-110 disabled:opacity-60 sm:px-8"
            >
              {completing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    emoji_events
                  </span>
                  Complete Workout
                </>
              )}
            </button>
          ) : !resting ? (
            <button
              onClick={completeSet}
              disabled={
                completedExercises.has(currentIndex) ||
                skippedExercises.has(currentIndex)
              }
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:opacity-40 sm:px-8"
            >
              <span className="material-symbols-outlined text-lg">
                check_circle
              </span>
              {completedExercises.has(currentIndex)
                ? "Completed ✓"
                : skippedExercises.has(currentIndex)
                  ? "Skipped"
                  : currentSet < totalSets
                    ? `Done Set ${currentSet}`
                    : "Finish Exercise"}
            </button>
          ) : null}

          <button
            disabled={currentIndex === generatedExercises.length - 1}
            onClick={goToNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 disabled:opacity-30 sm:h-11 sm:w-11"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">
              skip_next
            </span>
          </button>
        </div>

        {/* Secondary actions */}
        {!allDone &&
          !completedExercises.has(currentIndex) &&
          !skippedExercises.has(currentIndex) && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={skipExercise}
                className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 sm:px-4 sm:text-sm"
              >
                <span className="material-symbols-outlined text-sm sm:text-base">
                  fast_forward
                </span>
                Skip
              </button>
              <button
                onClick={() => toggleFav(exercise)}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 sm:px-4 sm:text-sm"
              >
                <span
                  className={`material-symbols-outlined text-sm sm:text-base ${
                    favorites.has(exercise.id) ? "filled" : ""
                  }`}
                >
                  favorite
                </span>
                {favorites.has(exercise.id) ? "Saved" : "Save"}
              </button>
            </div>
          )}
      </div>

      {/* ── Workout Queue ────────────────────────── */}
      <div className="mt-2 sm:mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 sm:text-sm">
            Workout Queue
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            <span>{completedExercises.size} done</span>
            {skippedExercises.size > 0 && (
              <>
                <span className="inline-flex h-2.5 w-2.5 ml-2 rounded-full bg-amber-400" />
                <span>{skippedExercises.size} skipped</span>
              </>
            )}
          </div>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          {generatedExercises.map((ex: any, i: number) => {
            const done = completedExercises.has(i);
            const skipped = skippedExercises.has(i);
            const active = i === currentIndex;
            return (
              <button
                key={ex.id || i}
                onClick={() => setCurrentIndex(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition sm:px-4 sm:py-3 ${
                  active
                    ? "border-2 border-primary bg-primary/5 shadow-sm"
                    : "border border-slate-100 bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm ${
                    done
                      ? "bg-green-100 text-green-600"
                      : skipped
                        ? "bg-amber-100 text-amber-600"
                        : active
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? (
                    <span className="material-symbols-outlined text-sm">
                      check
                    </span>
                  ) : skipped ? (
                    <span className="material-symbols-outlined text-sm">
                      fast_forward
                    </span>
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-xs font-medium sm:text-sm ${
                      done
                        ? "text-slate-400 line-through"
                        : skipped
                          ? "text-amber-500 line-through"
                          : active
                            ? "text-primary font-semibold"
                            : "text-slate-700"
                    }`}
                  >
                    {ex.name}
                  </span>
                </div>
                {active && !done && !skipped && (
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-primary">
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Quit Dialog ──────────────────────────── */}
      {showQuitDialog && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setShowQuitDialog(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-2xl bg-white p-6 shadow-2xl animate-scaleIn sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 sm:h-14 sm:w-14">
              <span className="material-symbols-outlined text-2xl text-red-500 sm:text-3xl">
                warning
              </span>
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">
              Quit Workout?
            </h3>
            <p className="mt-2 text-center text-sm text-slate-500">
              You&apos;ve been working out for {fmt(elapsed)}. Your progress
              will be lost.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowQuitDialog(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Keep Going
              </button>
              <button
                onClick={() => {
                  reset();
                  router.push("/dashboard");
                }}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
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
