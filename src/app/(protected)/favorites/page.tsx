"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { workoutAPI, exerciseAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface FavoriteExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  imageUrl: string | null;
  bodyPart: string | null;
  createdAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

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
              const url = d.videoUrl || d.imageUrl;
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fadeUp space-y-6">
      {/* ── Header Banner ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-20 h-32 w-32 rounded-full bg-pink-200/30 blur-2xl" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined filled text-base text-rose-500">favorite</span>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Saved Collection</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl md:text-4xl">Favorite Exercises</h1>
          <p className="mt-1 text-slate-500">
            {favorites.length > 0
              ? `${favorites.length} exercise${favorites.length !== 1 ? "s" : ""} in your collection`
              : "Your saved exercises will appear here"}
          </p>
        </div>
      </div>

      {/* ── Content ───────────────────────────────── */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50">
            <span className="material-symbols-outlined text-4xl text-rose-300">favorite</span>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-700">No favorites yet</p>
            <p className="mt-1 text-sm text-slate-400">Tap the heart icon during a workout to save exercises here</p>
          </div>
          <Link
            href="/workout-generator"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110"
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
              className="group animate-fadeUp overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Image area */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {(fav.imageUrl || imageCache[fav.exerciseId]) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={(fav.imageUrl || imageCache[fav.exerciseId]) as string}
                    alt={fav.exerciseName}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300">fitness_center</span>
                  </div>
                )}

                {/* Remove heart button */}
                <button
                  onClick={() => removeFavorite(fav)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur transition hover:bg-red-50"
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
                <p className="line-clamp-1 font-bold capitalize text-slate-900">{fav.exerciseName}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Saved {new Date(fav.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
