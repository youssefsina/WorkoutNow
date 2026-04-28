"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { exerciseAPI, workoutAPI } from "@/lib/api";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import ExerciseCard, { Exercise } from "@/components/workout/ExerciseCard";
import ExerciseDetailsModal from "@/components/workout/ExerciseDetailsModal";
import BodyMap from "@/components/workout/BodyMap";

const steps = ["Equipment", "Muscles", "Workout"];

type OptionItem = string | { id: string; name: string };

const EQUIPMENT_ICONS: Record<string, string> = {
  barbell: "fitness_center",
  dumbbell: "sports_gymnastics",
  cable: "anchor",
  body_weight: "accessibility_new",
  bodyweight: "accessibility_new",
  machine: "precision_manufacturing",
  kettlebell: "sports_martial_arts",
  band: "expand",
  resistance_band: "expand",
  ez_barbell: "linear_scale",
  smith_machine: "straighten",
  stability_ball: "circle",
};

function getEquipmentIcon(id: string): string {
  return EQUIPMENT_ICONS[id.toLowerCase().replace(/\s+/g, "_")] ?? "fitness_center";
}

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
    removeExercise,
    replaceExercise,
    nextStep,
    prevStep,
  } = useWorkoutStore();

  const [equipmentList, setEquipmentList] = useState<OptionItem[]>([]);
  const [muscleList, setMuscleList] = useState<{ id: string; name: string }[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  // track which exercise id is currently being replaced
  const [replacingId, setReplacingId] = useState<string | null>(null);

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
    exerciseTips: Array.isArray(exercise.exerciseTips) ? exercise.exerciseTips : [],
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
        setMuscleList(
          (muRes.data || []).map((m: any) =>
            typeof m === "string" ? { id: m, name: m } : { id: m.id, name: m.name }
          )
        );
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
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate workout");
    } finally {
      setGenerating(false);
    }
  }, [selectedEquipment, selectedMuscles, setGeneratedExercises, nextStep]);

  const handleRemoveExercise = (id: string) => {
    removeExercise(id);
    toast.success("Exercise removed");
  };

  const handleReplaceExercise = async (exercise: Exercise) => {
    setReplacingId(exercise.id);
    try {
      const bodyPart = exercise.target;
      const excludeIds = generatedExercises.map((e: any) => e.id);
      const res = await workoutAPI.replaceExercise(bodyPart, selectedEquipment, excludeIds);
      if (res.data) {
        replaceExercise(exercise.id, res.data as any);
        toast.success("Exercise replaced");
      } else {
        toast.error("No alternative found for this exercise");
      }
    } catch {
      toast.error("Could not replace exercise");
    } finally {
      setReplacingId(null);
    }
  };

  const handleStartWorkout = () => router.push("/workout/active");

  const canProceed =
    currentStep === 0
      ? selectedEquipment.length > 0
      : currentStep === 1
        ? selectedMuscles.length > 0
        : generatedExercises.length > 0;

  return (
    <div>
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Workout <span className="text-primary">Generator</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Customize your perfect workout in 3 steps</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    done
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                      : active
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg shadow-primary/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {done ? <span className="material-symbols-outlined text-lg">check</span> : i + 1}
                </div>
                <span className={`hidden text-xs font-semibold sm:block ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded-full transition-all duration-500 ${done ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 0: Equipment ── */}
      {currentStep === 0 && (
        <div className="animate-fade-up">
          <h2 className="mb-1 text-xl font-bold text-foreground sm:text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            What equipment do you have?
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">Select all that apply.</p>

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
                    className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                      active
                        ? "border-primary bg-primary/8 shadow-md shadow-primary/15"
                        : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
                    }`}
                  >
                    {active && (
                      <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <span className="material-symbols-outlined text-sm">check</span>
                      </span>
                    )}
                    <div className={`mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl ${active ? "bg-primary/15" : "bg-muted"}`}>
                      <span className={`material-symbols-outlined text-2xl ${active ? "text-primary" : "text-muted-foreground"}`}>
                        {getEquipmentIcon(eqId)}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {eqName}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Step 1: Muscles ── */}
      {currentStep === 1 && (
        <div className="animate-fade-up">
          <h2 className="mb-1 text-xl font-bold text-foreground sm:text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Which muscles do you want to target?
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">Click on the body map or list to select muscle groups.</p>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <BodyMap muscleList={muscleList} selectedMuscles={selectedMuscles} onToggleMuscle={toggleMuscle} />
          )}
        </div>
      )}

      {/* ── Step 2: Preview ── */}
      {currentStep === 2 && (
        <div className="animate-fade-up">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="material-symbols-outlined filled text-2xl text-emerald-500">check_circle</span>
            <div>
              <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Workout Preview
              </h2>
              <p className="text-sm text-muted-foreground">
                {generatedExercises.length} exercise{generatedExercises.length !== 1 ? "s" : ""} — use Replace or Remove per card
              </p>
            </div>
          </div>

          {generatedExercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-muted-foreground/40">fitness_center</span>
              <p className="mt-3 text-sm font-semibold text-muted-foreground">All exercises removed</p>
              <button
                type="button"
                onClick={() => prevStep()}
                className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 hover:brightness-110 transition"
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {generatedExercises.map((exercise: any, index: number) => (
                <div key={exercise.id || index} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ExerciseCard
                    exercise={normalizeExercise(exercise)}
                    onViewDetails={handleViewDetails}
                    onRemove={handleRemoveExercise}
                    onReplace={handleReplaceExercise}
                    replacing={replacingId === exercise.id}
                    showWorkoutInfo
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          disabled={currentStep === 0}
          onClick={() => currentStep > 0 && prevStep()}
          className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </button>

        {currentStep < 2 ? (
          <button
            type="button"
            disabled={!canProceed || generating}
            onClick={() => { if (currentStep === 1) void handleGenerate(); else nextStep(); }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:brightness-110 disabled:opacity-40"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {currentStep === 1 ? (
              generating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined filled text-lg">bolt</span>
                  Generate Workout
                </>
              )
            ) : (
              <>
                Next Step
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            disabled={generatedExercises.length === 0}
            onClick={handleStartWorkout}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:brightness-110 disabled:opacity-40"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="material-symbols-outlined filled text-lg">fitness_center</span>
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
