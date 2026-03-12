"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

const fitnessGoals = [
  { value: "BUILD_MUSCLE", label: "Build Muscle" },
  { value: "LOSE_WEIGHT", label: "Lose Weight" },
  { value: "GET_FIT", label: "General Fitness" },
  { value: "INCREASE_STRENGTH", label: "Increase Strength" },
  { value: "IMPROVE_ENDURANCE", label: "Improve Endurance" },
];

interface ProfileData {
  displayName: string;
  weightKg: number | "";
  heightCm: number | "";
  fitnessGoal: string;
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [form, setForm] = useState<ProfileData>({
    displayName: "",
    weightKg: "",
    heightCm: "",
    fitnessGoal: "GET_FIT",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await userAPI.getProfile();
        const p = res.data;
        setForm({
          displayName: p.displayName || "",
          weightKg: p.weightKg || "",
          heightCm: p.heightCm || "",
          fitnessGoal: p.fitnessGoal || "GET_FIT",
        });
      } catch {
        setForm((prev) => ({
          ...prev,
          displayName:
            user?.user_metadata?.display_name ||
            user?.email?.split("@")[0] ||
            "",
        }));
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({
        displayName: form.displayName,
        weightKg: form.weightKg === "" ? undefined : Number(form.weightKg),
        heightCm: form.heightCm === "" ? undefined : Number(form.heightCm),
        fitnessGoal: form.fitnessGoal,
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const bmi =
    form.weightKg && form.heightCm
      ? Number(form.weightKg) / Math.pow(Number(form.heightCm) / 100, 2)
      : null;
  const bmiLabel =
    bmi === null
      ? null
      : bmi < 18.5
        ? "Underweight"
        : bmi < 25
          ? "Healthy"
          : bmi < 30
            ? "Overweight"
            : "Obese";

  return (
    <div className="animate-fadeUp space-y-6">
      {/* ── Profile Banner ────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-100 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-24 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-3xl font-extrabold text-white shadow-lg shadow-primary/30">
              {(form.displayName || "U").charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow">
              <span className="material-symbols-outlined text-xs text-white">check</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl md:text-3xl">
              {form.displayName || "User"}
            </h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              <span className="material-symbols-outlined text-xs">verified</span>
              Active member
            </span>
          </div>
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form — 2/3 width on large */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <span className="material-symbols-outlined text-lg text-primary">manage_accounts</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Personal Info</h2>
                <p className="text-xs text-slate-400">Update your profile details</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
          {/* Display Name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Display Name
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              placeholder="Your display name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Weight (kg)
              </label>
              <input
                type="number"
                min={20}
                max={300}
                value={form.weightKg}
                placeholder="75"
                onChange={(e) =>
                  setForm({
                    ...form,
                    weightKg:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Height (cm)
              </label>
              <input
                type="number"
                min={100}
                max={250}
                value={form.heightCm}
                placeholder="175"
                onChange={(e) =>
                  setForm({
                    ...form,
                    heightCm:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Fitness Goal
            </label>
            <select
              value={form.fitnessGoal}
              onChange={(e) =>
                setForm({ ...form, fitnessGoal: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              {fitnessGoals.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span className="material-symbols-outlined text-lg">save</span>
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
          </div>
        </div>

        {/* ── Side panel ──────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Account card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <span className="material-symbols-outlined text-lg text-slate-500">shield_person</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Account</h2>
                <p className="text-xs text-slate-400">Security &amp; access</p>
              </div>
            </div>
            <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400">Email address</p>
              <p className="truncate text-sm font-semibold text-slate-700">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Sign Out
            </button>
          </div>

          {/* BMI card */}
          {bmi !== null && (
            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-indigo-100 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <span className="material-symbols-outlined text-lg text-primary">monitor_weight</span>
                </div>
                <p className="text-sm font-bold text-slate-700">BMI Estimate</p>
              </div>
              <p className="text-4xl font-extrabold text-slate-900">{bmi.toFixed(1)}</p>
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  bmiLabel === "Healthy"
                    ? "bg-green-100 text-green-700"
                    : bmiLabel === "Underweight"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                }`}
              >
                {bmiLabel === "Healthy" && (
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                )}
                {bmiLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
