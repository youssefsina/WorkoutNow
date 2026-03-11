import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Exercise {
  id: string;
  name: string;
  videoUrl: string | null;
  imageUrl?: string | null;
  difficultyLevel: string;
  instructions: string | null;
  instructionsList?: string[];
  exerciseTips?: string[];
  overview?: string;
  equipment: Array<{ id: string; name: string; iconUrl: string | null }>;
  muscles: Array<{ id: string; name: string; bodyPart: string }>;
  targetMuscles?: string[];
  secondaryMuscles?: string[];
  sets?: number;
  repRange?: string;
  restSeconds?: number;
}

interface WorkoutState {
  selectedEquipment: string[];
  selectedMuscles: string[];
  generatedExercises: Exercise[];
  currentStep: number;

  // Actions
  toggleEquipment: (id: string) => void;
  setSelectedEquipment: (ids: string[]) => void;
  toggleMuscle: (id: string) => void;
  setSelectedMuscles: (ids: string[]) => void;
  setGeneratedExercises: (exercises: Exercise[]) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (id: string) => void;
  replaceExercise: (oldId: string, newExercise: Exercise) => void;
  shuffleExercises: () => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

const initialState = {
  selectedEquipment: [] as string[],
  selectedMuscles: [] as string[],
  generatedExercises: [] as Exercise[],
  currentStep: 0,
};

export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        toggleEquipment: (id) =>
          set((s) => ({
            selectedEquipment: s.selectedEquipment.includes(id)
              ? s.selectedEquipment.filter((x) => x !== id)
              : [...s.selectedEquipment, id],
          })),

        setSelectedEquipment: (ids) => set({ selectedEquipment: ids }),

        toggleMuscle: (id) =>
          set((s) => ({
            selectedMuscles: s.selectedMuscles.includes(id)
              ? s.selectedMuscles.filter((x) => x !== id)
              : [...s.selectedMuscles, id],
          })),

        setSelectedMuscles: (ids) => set({ selectedMuscles: ids }),

        setGeneratedExercises: (exercises) => set({ generatedExercises: exercises }),

        addExercise: (exercise) =>
          set((s) => ({
            generatedExercises: [...s.generatedExercises, exercise],
          })),

        removeExercise: (id) =>
          set((s) => ({
            generatedExercises: s.generatedExercises.filter((ex) => ex.id !== id),
          })),

        replaceExercise: (oldId, newExercise) =>
          set((s) => ({
            generatedExercises: s.generatedExercises.map((ex) =>
              ex.id === oldId ? newExercise : ex
            ),
          })),

        shuffleExercises: () =>
          set((s) => ({
            generatedExercises: [...s.generatedExercises].sort(
              () => Math.random() - 0.5
            ),
          })),

        setCurrentStep: (step) => set({ currentStep: step }),
        nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 2) })),
        prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
        previousStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
        reset: () => set(initialState),
      }),
      {
        name: "workout-wizard-v2",
        partialize: (s) => ({
          selectedEquipment: s.selectedEquipment,
          selectedMuscles: s.selectedMuscles,
          generatedExercises: s.generatedExercises,
          currentStep: s.currentStep,
        }),
      }
    ),
    { name: "WorkoutStore" }
  )
);
