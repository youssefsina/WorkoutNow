"use client";

import Image from "next/image";
import { Exercise } from "./ExerciseCard";
import { useState, useEffect } from "react";
import { exerciseAPI } from "@/lib/api";

interface ExerciseDetailsModalProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite?: (exerciseId: string) => void;
  isFavorite?: boolean;
}

export default function ExerciseDetailsModal({
  exercise,
  open,
  onClose,
  onToggleFavorite,
  isFavorite = false,
}: ExerciseDetailsModalProps) {
  const [fullDetails, setFullDetails] = useState<Exercise | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    if (!exercise || !open) return;
    setFullDetails(null);
    setMediaError(false);
    setLoadingDetails(true);
    exerciseAPI
      .getDetails(exercise.id)
      .then((res) => { if (res.data) setFullDetails(res.data as Exercise); })
      .catch(() => {})
      .finally(() => setLoadingDetails(false));
  }, [exercise?.id, open]);

  if (!exercise || !open) return null;

  const data: Exercise = fullDetails ?? exercise;
  const videoUrl = data.videoUrl;
  const imageUrl = data.imageUrl;
  const isGif = videoUrl?.toLowerCase().endsWith(".gif") || videoUrl?.toLowerCase().includes("gif");
  const isMp4 = videoUrl?.toLowerCase().endsWith(".mp4") || videoUrl?.toLowerCase().includes(".mp4");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">{data.name}</h2>
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(exercise.id)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-slate-100"
              >
                <span className={`material-symbols-outlined ${isFavorite ? "filled text-red-500" : "text-slate-400"}`}>
                  favorite
                </span>
              </button>
            )}
            <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-slate-100">
              <span className="material-symbols-outlined text-slate-500">close</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* media */}
          <div className="relative mb-5 overflow-hidden rounded-xl bg-slate-100">
            {loadingDetails ? (
              <div className="flex aspect-video items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : !mediaError && isMp4 && videoUrl ? (
              <video
                key={videoUrl}
                controls loop autoPlay muted playsInline
                className="aspect-video w-full object-contain"
                onError={() => setMediaError(true)}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : !mediaError && isGif && videoUrl ? (
              <div className="aspect-video w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={videoUrl} alt={data.name} className="h-full w-full object-contain" onError={() => setMediaError(true)} />
              </div>
            ) : !mediaError && imageUrl ? (
              <div className="relative aspect-video w-full">
                <Image src={imageUrl} alt={data.name} fill className="object-contain" onError={() => setMediaError(true)} unoptimized priority />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-slate-200 text-sm text-slate-400">
                Media not available
              </div>
            )}
          </div>

          {data.overview && (
            <p className="mb-4 text-sm leading-relaxed text-slate-600">{data.overview}</p>
          )}

          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Target: {data.target}</span>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">Equipment: {data.equipment}</span>
          </div>

          {(data.sets || data.reps || data.restSeconds) && (
            <div className="mb-5 rounded-xl bg-primary/5 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Workout Parameters</p>
              <div className="flex gap-8">
                {data.sets && <div><p className="text-xs text-slate-500">Sets</p><p className="text-lg font-bold text-slate-900">{data.sets}</p></div>}
                {data.reps && <div><p className="text-xs text-slate-500">Reps</p><p className="text-lg font-bold text-slate-900">{data.reps}</p></div>}
                {data.restSeconds && <div><p className="text-xs text-slate-500">Rest Time</p><p className="text-lg font-bold text-slate-900">{data.restSeconds}s</p></div>}
              </div>
            </div>
          )}

          {data.instructions && data.instructions.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-2 text-sm font-bold text-slate-900">How to Perform</h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
                {data.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
              </ol>
            </div>
          )}

          {data.exerciseTips && data.exerciseTips.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-bold text-primary">💡 Pro Tips</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                {data.exerciseTips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-4">
          <button onClick={onClose} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}