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

  return (
    <div className="animate-fadeUp">
      <h1 className="mb-0.5 text-3xl font-extrabold">
        Profile <span className="text-primary">Settings</span>
      </h1>
      <p className="mb-6 text-slate-500">
        Manage your account and preferences
      </p>

      <div className="max-w-xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {/* Avatar header */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-white">
            {(form.displayName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">
              {form.displayName || "User"}
            </p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <hr className="mb-5 border-slate-100" />

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          {/* Display Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Display Name
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Weight (kg)
              </label>
              <input
                type="number"
                min={20}
                max={300}
                value={form.weightKg}
                onChange={(e) =>
                  setForm({
                    ...form,
                    weightKg:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Height (cm)
              </label>
              <input
                type="number"
                min={100}
                max={250}
                value={form.heightCm}
                onChange={(e) =>
                  setForm({
                    ...form,
                    heightCm:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Fitness Goal
            </label>
            <select
              value={form.fitnessGoal}
              onChange={(e) =>
                setForm({ ...form, fitnessGoal: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span className="material-symbols-outlined text-lg">save</span>
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <hr className="my-5 border-slate-100" />

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </div>
  );
}
