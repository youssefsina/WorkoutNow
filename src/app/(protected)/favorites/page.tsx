"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { workoutAPI, exerciseAPI } from "@/lib/api";
import toast from "react-hot-toast";
import ExerciseDetailsModal from "@/components/workout/ExerciseDetailsModal";
import { Exercise } from "@/components/workout/ExerciseCard";

interface FavoriteExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  imageUrl: string | null;
  bodyPart: string | null;
  createdAt: string;
}

function mapExerciseDetails(data: any, favorite: FavoriteExercise): Exercise {
  return {
    id: favorite.exerciseId,
    name: data?.name || favorite.exerciseName,
    target: data?.target || favorite.bodyPart || "Full body",
    equipment: data?.equipment || "Equipment varies",
    imageUrl: data?.imageUrl || favorite.imageUrl || "",
    videoUrl: data?.videoUrl || undefined,
    instructions: Array.isArray(data?.instructions) ? data.instructions : [],
    exerciseTips: Array.isArray(data?.exerciseTips) ? data.exerciseTips : [],
    overview: data?.overview || undefined,
    sets: data?.sets || undefined,
    reps: data?.reps || undefined,
    restSeconds: data?.restSeconds || undefined,
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await workoutAPI.getFavorites();
        const favs: FavoriteExercise[] = res.data || [];
        setFavorites(favs);

        // Fetch images for favorites that are missing image URLs
        const missing = favs.filter((f) => !f.imageUrl);
        if (missing.length > 0) {
          const results = await Promise.allSettled(
            missing.map((f) => exerciseAPI.getDetails(f.exerciseId)),
          );
          const cache: Record<string, string> = {};
          results.forEach((r, i) => {
            if (r.status === "fulfilled" && r.value.data) {
              const d = r.value.data as any;
              const url = d.imageUrl;
              if (url) cache[missing[i].exerciseId] = url;
            }
          });
          setImageCache(cache);
        }
      } catch {
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const removeFavorite = async (fav: FavoriteExercise) => {
    try {
      await workoutAPI.toggleFavorite(
        fav.exerciseId,
        fav.exerciseName,
        fav.imageUrl || "",
        fav.bodyPart || "",
      );
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
      toast.success("Removed from favorites");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const openDetails = async (fav: FavoriteExercise) => {
    setLoadingDetailsId(fav.id);
    try {
      const res = await exerciseAPI.getDetails(fav.exerciseId);
      setSelectedExercise(mapExerciseDetails(res.data, fav));
    } catch {
      setSelectedExercise(mapExerciseDetails({ imageUrl: fav.imageUrl }, fav));
      toast.error("Could not load full exercise details");
    } finally {
      setLoadingDetailsId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fadeUp space-y-6">
      {/* ── Header Banner ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-red-500/10 border border-rose-500/20 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-20 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined filled text-base text-rose-500">favorite</span>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Saved Collection</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">Favorite Exercises</h1>
          <p className="mt-1 text-muted-foreground">
            {favorites.length > 0
              ? `${favorites.length} exercise${favorites.length !== 1 ? "s" : ""} in your collection`
              : "Your saved exercises will appear here"}
          </p>
        </div>
      </div>

      {/* ── Content ───────────────────────────────── */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10">
            <span className="material-symbols-outlined text-4xl text-rose-500/50">favorite</span>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">No favorites yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Tap the heart icon during a workout to save exercises here</p>
          </div>
          <Link
            href="/workout-generator"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            Generate Workout
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav, i) => (
            <div
              key={fav.id}
              className="group animate-fadeUp overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Image area */}
              <div className="relative h-48 overflow-hidden bg-muted">
                {(fav.imageUrl || imageCache[fav.exerciseId]) ? (
                  <img
                    src={(fav.imageUrl || imageCache[fav.exerciseId]) as string}
                    alt={fav.exerciseName}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-muted-foreground">fitness_center</span>
                  </div>
                )}

                {/* Remove heart button */}
                <button
                  onClick={() => removeFavorite(fav)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-background/90 shadow-md backdrop-blur transition hover:bg-rose-500/10"
                >
                  <span className="material-symbols-outlined filled text-xl text-rose-500">favorite</span>
                </button>

                {/* Body part badge */}
                {fav.bodyPart && (
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-lg bg-black/50 px-2.5 py-1 text-xs font-bold capitalize text-white backdrop-blur">
                      {fav.bodyPart}
                    </span>
                  </div>
                )}
              </div>

              {/* Info footer */}
              <div className="p-4">
                <p className="line-clamp-1 font-bold capitalize text-foreground">{fav.exerciseName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Saved {new Date(fav.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <button
                  onClick={() => openDetails(fav)}
                  disabled={loadingDetailsId === fav.id}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-base">
                    {loadingDetailsId === fav.id ? "progress_activity" : "info"}
                  </span>
                  {loadingDetailsId === fav.id ? "Loading details..." : "View Details"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ExerciseDetailsModal
        exercise={selectedExercise}
        open={Boolean(selectedExercise)}
        onClose={() => setSelectedExercise(null)}
        onToggleFavorite={(exerciseId) => {
          const favorite = favorites.find((item) => item.exerciseId === exerciseId);
          if (favorite) {
            removeFavorite(favorite);
            setSelectedExercise(null);
          }
        }}
        isFavorite={Boolean(selectedExercise && favorites.some((item) => item.exerciseId === selectedExercise.id))}
      />
    </div>
  );
}
