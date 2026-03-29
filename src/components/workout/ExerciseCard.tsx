"use client";

import Image from "next/image";
import { useState } from "react";

export interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  imageUrl: string;
  videoUrl?: string;
  instructions?: string[];
  exerciseTips?: string[];
  overview?: string;
  sets?: number;
  reps?: string;
  restSeconds?: number;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onViewDetails: (exercise: Exercise) => void;
  onToggleFavorite?: (exerciseId: string) => void;
  isFavorite?: boolean;
  showWorkoutInfo?: boolean;
}

export default function ExerciseCard({
  exercise,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
  showWorkoutInfo = false,
}: ExerciseCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      onClick={() => onViewDetails(exercise)}
    >
      {/* image */}
      <div className="relative aspect-[4/3] bg-slate-100">
        {!imageError && exercise.imageUrl ? (
          <Image
            src={exercise.imageUrl}
            alt={exercise.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-sm text-slate-400">
            No preview
          </div>
        )}

        {onToggleFavorite && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(exercise.id); }}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
          >
            <span
              className={`material-symbols-outlined text-lg ${
                isFavorite ? "filled text-red-500" : "text-slate-400"
              }`}
            >
              favorite
            </span>
          </button>
        )}
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900">
          {exercise.name}
        </h3>

        <div className="mb-3 flex flex-wrap gap-1">
          <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
            {exercise.target}
          </span>
          <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
            {exercise.equipment}
          </span>
        </div>

        {showWorkoutInfo && (exercise.sets || exercise.reps || exercise.restSeconds) && (
          <div className="mb-3 flex justify-around rounded-lg bg-slate-50 px-2 py-2">
            {exercise.sets && (
              <div className="text-center">
                <p className="text-[10px] uppercase text-slate-400">Sets</p>
                <p className="text-sm font-semibold text-slate-800">{exercise.sets}</p>
              </div>
            )}
            {exercise.reps && (
              <div className="text-center">
                <p className="text-[10px] uppercase text-slate-400">Reps</p>
                <p className="text-sm font-semibold text-slate-800">{exercise.reps}</p>
              </div>
            )}
            {exercise.restSeconds && (
              <div className="text-center">
                <p className="text-[10px] uppercase text-slate-400">Rest</p>
                <p className="text-sm font-semibold text-slate-800">{exercise.restSeconds}s</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-500 transition group-hover:border-primary group-hover:text-primary">
          <span className="material-symbols-outlined text-base">info</span>
          View Details
        </div>
      </div>
    </div>
  );
}
