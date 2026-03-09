"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { workoutAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface FavoriteExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseImage: string | null;
  exerciseBodyPart: string | null;
  createdAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await workoutAPI.getFavorites();
        setFavorites(res.data || []);
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
        fav.exerciseImage || "",
        fav.exerciseBodyPart || "",
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
    <div>
      <h1 className="mb-1 text-3xl font-extrabold text-primary">
        Favorite Exercises
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        {favorites.length} saved exercise{favorites.length !== 1 ? "s" : ""}
      </p>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 py-16 text-center">
          <span className="material-symbols-outlined mb-3 text-5xl text-slate-300">
            fitness_center
          </span>
          <p className="text-lg font-semibold text-slate-500">
            No favorites yet
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Tap the heart icon during a workout to save exercises here
          </p>
          <Link
            href="/workout-generator"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110"
          >
            <span className="material-symbols-outlined text-lg">
              auto_awesome
            </span>
            Generate Workout
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav, i) => (
            <div
              key={fav.id}
              className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md animate-fadeUp"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {fav.exerciseImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={fav.exerciseImage}
                  alt={fav.exerciseName}
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold capitalize text-slate-900">
                    {fav.exerciseName}
                  </p>
                  {fav.exerciseBodyPart && (
                    <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium capitalize text-green-600">
                      {fav.exerciseBodyPart}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeFavorite(fav)}
                  className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-red-50"
                >
                  <span className="material-symbols-outlined filled text-xl text-red-500">
                    favorite
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
