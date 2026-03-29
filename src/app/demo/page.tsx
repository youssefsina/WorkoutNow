"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const equipmentOptions = [
  "Dumbbells",
  "Bench",
  "Pull-up Bar",
  "Cable Machine",
  "Bodyweight",
  "Kettlebell",
];

const muscleOptions = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
];

const demoExercises = [
  {
    name: "Incline Dumbbell Press",
    target: "Chest",
    equipment: "Dumbbells, Bench",
    sets: "4",
    reps: "8-10",
    rest: "75 sec",
  },
  {
    name: "Pull-Ups",
    target: "Back",
    equipment: "Pull-up Bar",
    sets: "4",
    reps: "6-10",
    rest: "90 sec",
  },
  {
    name: "Cable Lateral Raise",
    target: "Shoulders",
    equipment: "Cable Machine",
    sets: "3",
    reps: "12-15",
    rest: "45 sec",
  },
  {
    name: "Bulgarian Split Squat",
    target: "Legs",
    equipment: "Bench, Dumbbells",
    sets: "3",
    reps: "10 each side",
    rest: "60 sec",
  },
  {
    name: "Hammer Curl",
    target: "Arms",
    equipment: "Dumbbells",
    sets: "3",
    reps: "10-12",
    rest: "45 sec",
  },
  {
    name: "Dead Bug",
    target: "Core",
    equipment: "Bodyweight",
    sets: "3",
    reps: "12 each side",
    rest: "30 sec",
  },
];

export default function DemoPage() {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(["Dumbbells", "Bench"]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(["Chest", "Shoulders"]);
  const [generated, setGenerated] = useState(false);

  const preview = useMemo(() => {
    const matching = demoExercises.filter((exercise) => {
      const matchesMuscle = selectedMuscles.length === 0 || selectedMuscles.includes(exercise.target);
      const matchesEquipment =
        selectedEquipment.length === 0 ||
        selectedEquipment.some((equipment) => exercise.equipment.includes(equipment));
      return matchesMuscle && matchesEquipment;
    });

    return matching.length > 0 ? matching.slice(0, 4) : demoExercises.slice(0, 4);
  }, [selectedEquipment, selectedMuscles]);

  const toggleSelection = (
    value: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-6 lg:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined filled text-xl">fitness_center</span>
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">WorkoutNow</p>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Free trial demo</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:border-slate-300 hover:bg-white md:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Sign Up
            </Link>
            <ThemeToggle className="rounded-full border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl hover:bg-white" />
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_22rem]">
          <section className="rounded-[2rem] border border-white/70 bg-white/72 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:p-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Test the app without an account
              </div>

              <h1 className="mt-6 text-[clamp(2.8rem,7vw,4.8rem)] font-black leading-[0.9] tracking-[-0.07em] text-slate-950">
                Free trial preview
                <span className="block text-slate-600">of the workout generator</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                This demo lets you test the main generator flow with sample data. Create an account when you want favorites, history, streaks, and saved progress.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Step 1</p>
                    <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950">Select equipment</h2>
                  </div>
                  <span className="material-symbols-outlined text-2xl text-primary">fitness_center</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {equipmentOptions.map((option) => {
                    const active = selectedEquipment.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleSelection(option, selectedEquipment, setSelectedEquipment)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Step 2</p>
                    <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950">Choose target muscles</h2>
                  </div>
                  <span className="material-symbols-outlined text-2xl text-primary">accessibility_new</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {muscleOptions.map((option) => {
                    const active = selectedMuscles.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleSelection(option, selectedMuscles, setSelectedMuscles)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setGenerated(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6a1c] px-7 py-3.5 text-sm font-bold text-white shadow-[0_16px_36px_rgba(255,106,28,0.28)] transition hover:bg-[#ff7a33]"
              >
                Generate Demo Workout
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </button>
              <p className="text-sm text-slate-500">No account required for this preview.</p>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/40">Step 3</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.05em]">Demo workout preview</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  {generated ? "Ready" : "Waiting"}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {preview.map((exercise) => (
                  <article
                    key={exercise.name}
                    className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">{exercise.name}</h3>
                        <p className="mt-1 text-sm text-white/60">{exercise.target}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                        Demo
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-xl bg-white/[0.04] px-3 py-2">
                        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/38">Sets</p>
                        <p className="mt-1 font-semibold">{exercise.sets}</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.04] px-3 py-2">
                        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/38">Reps</p>
                        <p className="mt-1 font-semibold">{exercise.reps}</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.04] px-3 py-2">
                        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/38">Rest</p>
                        <p className="mt-1 font-semibold">{exercise.rest}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-white/58">{exercise.equipment}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[1.8rem] border border-white/70 bg-white/72 p-5 shadow-[0_24px_64px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">What unlocks with an account</p>
              <div className="mt-5 space-y-3">
                {[
                  "Save favorite exercises",
                  "Track workout history",
                  "See weekly streaks and stats",
                  "Manage your training profile",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <p className="text-sm font-medium text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-primary/15 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(255,255,255,0.9))] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Next step</p>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-slate-950">Turn the preview into a real account</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use the demo now, then create an account when you want your workouts and progress saved.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  Create Account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
