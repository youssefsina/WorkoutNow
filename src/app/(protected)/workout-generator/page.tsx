"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { exerciseAPI, workoutAPI } from "@/lib/api";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import ExerciseCard, { Exercise } from "@/components/workout/ExerciseCard";
import ExerciseDetailsModal from "@/components/workout/ExerciseDetailsModal";

const steps = ["Equipment", "Muscles", "Workout"];

type OptionItem = string | { id: string; name: string };

export default function WorkoutGeneratorPage() {
  const router = useRouter();
  const {
    currentStep,
    selectedEquipment,
    selectedMuscles,
    generatedExercises,
    toggleEquipment,
    toggleMuscle,
    setGeneratedExercises,
    nextStep,
    prevStep,
  } = useWorkoutStore();

  const [equipmentList, setEquipmentList] = useState<OptionItem[]>([]);
  const [muscleList, setMuscleList] = useState<OptionItem[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleViewDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setDetailsModalOpen(true);
  };

  const normalizeExercise = (exercise: any): Exercise => ({
    id: exercise.id,
    name: exercise.name,
    target:
      exercise.target ||
      exercise.targetMuscles?.[0] ||
      exercise.muscles?.[0]?.name ||
      "Unknown",
    equipment:
      exercise.equipment?.[0]?.name ||
      (typeof exercise.equipment === "string" ? exercise.equipment : null) ||
      "Unknown",
    imageUrl: exercise.imageUrl || "",
    videoUrl: exercise.videoUrl || undefined,
    instructions: Array.isArray(exercise.instructions)
      ? exercise.instructions
      : Array.isArray(exercise.instructionsList)
        ? exercise.instructionsList
        : [],
    exerciseTips: Array.isArray(exercise.exerciseTips)
      ? exercise.exerciseTips
      : [],
    overview: exercise.overview || "",
    sets: exercise.sets,
    reps: exercise.reps || exercise.repRange,
    restSeconds: exercise.restSeconds,
  });

  useEffect(() => {
    async function load() {
      try {
        const [eqRes, muRes] = await Promise.all([
          exerciseAPI.getEquipment(),
          exerciseAPI.getMuscles(),
        ]);
        setEquipmentList(eqRes.data || []);
        setMuscleList(muRes.data || []);
      } catch {
        toast.error("Failed to load options");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await workoutAPI.generate({
        equipment: selectedEquipment,
        muscles: selectedMuscles,
      });
      setGeneratedExercises(res.data || []);
      nextStep();
    } catch {
      toast.error("Failed to generate workout");
    } finally {
      setGenerating(false);
    }
  }, [selectedEquipment, selectedMuscles, setGeneratedExercises, nextStep]);

  const handleStartWorkout = () => {
    router.push("/workout/active");
  };

  const canProceed =
    currentStep === 0
      ? selectedEquipment.length > 0
      : currentStep === 1
        ? selectedMuscles.length > 0
        : generatedExercises.length > 0;

  return (
    <div>
      {/* title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Workout <span className="text-primary">Generator</span>
        </h1>
        <p className="mt-1 text-slate-500">
          Customize your perfect workout in 3 steps
        </p>
      </div>

      {/* stepper */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                    done
                      ? "bg-primary text-white"
                      : active
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? (
                    <span className="material-symbols-outlined text-lg">
                      check
                    </span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${active ? "text-primary" : "text-slate-400"}`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded ${done ? "bg-primary" : "bg-slate-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 0: Equipment ─────────────────────── */}
      {currentStep === 0 && (
        <div className="animate-fadeUp">
          <h2 className="mb-1 text-2xl font-extrabold text-slate-900">
            What equipment do you have?
          </h2>
          <p className="mb-6 text-slate-500">
            Select all that apply to help us customize your plan.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {equipmentList.map((eq) => {
                const eqId = typeof eq === "string" ? eq : eq.id;
                const eqName = typeof eq === "string" ? eq : eq.name;
                const active = selectedEquipment.includes(eqId);

                return (
                  <button
                    key={eqId}
                    type="button"
                    onClick={() => toggleEquipment(eqId)}
                    className={`relative rounded-xl border-2 p-4 text-left transition hover:-translate-y-0.5 ${
                      active
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-200 bg-white hover:border-primary/30"
                    }`}
                  >
                    {active && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                        ✓
                      </span>
                    )}
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <span className="material-symbols-outlined text-2xl text-primary">
                        fitness_center
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{eqName}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Step 1: Muscles ──────────────────────── */}
      {currentStep === 1 && (
        <div className="animate-fadeUp">
          <h2 className="mb-1 text-2xl font-extrabold text-slate-900">
            Which muscles do you want to target?
          </h2>
          <p className="mb-6 text-slate-500">
            Select all that apply to customize your workout plan.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {muscleList.map((muscle) => {
                const mId = typeof muscle === "string" ? muscle : muscle.id;
                const mName = typeof muscle === "string" ? muscle : muscle.name;
                const active = selectedMuscles.includes(mId);

                return (
                  <button
                    key={mId}
                    type="button"
                    onClick={() => toggleMuscle(mId)}
                    className={`relative rounded-xl border-2 p-4 text-left transition hover:-translate-y-0.5 ${
                      active
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-200 bg-white hover:border-primary/30"
                    }`}
                  >
                    {active && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                        ✓
                      </span>
                    )}
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <span className="material-symbols-outlined text-2xl text-primary">
                        accessibility_new
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{mName}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Preview ─────────────────────── */}
      {currentStep === 2 && (
        <div className="animate-fadeUp">
          <div className="mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-green-500">
              auto_awesome
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Workout Preview
            </h2>
          </div>
          <p className="mb-5 text-sm text-slate-500">
            {generatedExercises.length} exercises selected. Click &quot;View
            Details&quot; for instructions.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {generatedExercises.map((exercise: any, index: number) => (
              <div
                key={exercise.id || index}
                className="animate-fadeUp"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <ExerciseCard
                  exercise={normalizeExercise(exercise)}
                  onViewDetails={handleViewDetails}
                  showWorkoutInfo
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Navigation Buttons ─────────────────── */}
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          disabled={currentStep === 0}
          onClick={() => currentStep > 0 && prevStep()}
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-lg">
            arrow_back
          </span>
          Back
        </button>

        {currentStep < 2 ? (
          <button
            type="button"
            disabled={!canProceed || generating}
            onClick={() => {
              if (currentStep === 1) {
                void handleGenerate();
              } else {
                nextStep();
              }
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/25 transition hover:brightness-110 disabled:opacity-40"
          >
            {currentStep === 1 ? (
              generating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Workout
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </>
              )
            ) : (
              <>
                Next Step
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartWorkout}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/25 transition hover:brightness-110"
          >
            <span className="material-symbols-outlined text-lg">
              fitness_center
            </span>
            Start Workout
          </button>
        )}
      </div>

      <ExerciseDetailsModal
        exercise={selectedExercise}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />
    </div>
  );
}
