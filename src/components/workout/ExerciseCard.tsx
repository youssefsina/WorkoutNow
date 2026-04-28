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
  onRemove?: (exerciseId: string) => void;
  onReplace?: (exercise: Exercise) => void;
  isFavorite?: boolean;
  showWorkoutInfo?: boolean;
  replacing?: boolean;
}

export default function ExerciseCard({
  exercise,
  onViewDetails,
  onToggleFavorite,
  onRemove,
  onReplace,
  isFavorite = false,
  showWorkoutInfo = false,
  replacing = false,
}: ExerciseCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/25">
      {/* image — clickable */}
      <div
        className="relative aspect-[4/3] bg-muted overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(exercise)}
      >
        {!imageError && exercise.imageUrl ? (
          <Image
            src={exercise.imageUrl}
            alt={exercise.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
            <span className="material-symbols-outlined text-3xl text-muted-foreground/30">fitness_center</span>
          </div>
        )}

        {/* hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* favorite button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(exercise.id); }}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white hover:scale-110"
          >
            <span className={`material-symbols-outlined text-[18px] ${isFavorite ? "filled text-red-500" : "text-slate-400"}`}>
              favorite
            </span>
          </button>
        )}
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="mb-2 line-clamp-2 text-sm font-bold text-foreground leading-snug cursor-pointer hover:text-primary transition-colors"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          onClick={() => onViewDetails(exercise)}
        >
          {exercise.name}
        </h3>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-primary/25 bg-primary/8 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            {exercise.target}
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {exercise.equipment}
          </span>
        </div>

        {showWorkoutInfo && (exercise.sets || exercise.reps || exercise.restSeconds) && (
          <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-muted/60 px-2 py-2.5">
            {exercise.sets && (
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Sets</p>
                <p className="text-sm font-bold text-foreground">{exercise.sets}</p>
              </div>
            )}
            {exercise.reps && (
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Reps</p>
                <p className="text-sm font-bold text-foreground">{exercise.reps}</p>
              </div>
            )}
            {exercise.restSeconds && (
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Rest</p>
                <p className="text-sm font-bold text-foreground">{exercise.restSeconds}s</p>
              </div>
            )}
          </div>
        )}

        {/* View details link */}
        <button
          onClick={() => onViewDetails(exercise)}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <span className="material-symbols-outlined text-base">info</span>
          View Details
        </button>

        {/* Per-card Replace & Remove (only in preview/showWorkoutInfo mode) */}
        {showWorkoutInfo && (onReplace || onRemove) && (
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {onReplace && (
              <button
                onClick={(e) => { e.stopPropagation(); onReplace(exercise); }}
                disabled={replacing}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-50"
              >
                {replacing ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <span className="material-symbols-outlined text-base">swap_horiz</span>
                )}
                Replace
              </button>
            )}
            {onRemove && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(exercise.id); }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
