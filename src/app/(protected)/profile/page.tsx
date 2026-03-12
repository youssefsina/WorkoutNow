"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { userAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";

const fitnessGoals = [
  { value: "BUILD_MUSCLE", label: "Build Muscle", icon: "fitness_center", color: "text-rose-500" },
  { value: "LOSE_WEIGHT", label: "Lose Weight", icon: "monitor_weight", color: "text-amber-500" },
  { value: "GET_FIT", label: "General Fitness", icon: "self_improvement", color: "text-primary" },
  { value: "INCREASE_STRENGTH", label: "Increase Strength", icon: "bolt", color: "text-red-500" },
  { value: "IMPROVE_ENDURANCE", label: "Improve Endurance", icon: "directions_run", color: "text-emerald-500" },
];

// ── Badge definitions (earned from real stats) ──────────────
const BADGES = [
  { id: "first_workout", label: "First Step", desc: "Complete your first workout", icon: "rocket_launch", color: "from-blue-500 to-cyan-400", check: (s: any) => s.totalWorkouts >= 1 },
  { id: "five_workouts", label: "Getting Started", desc: "Complete 5 workouts", icon: "trending_up", color: "from-green-500 to-emerald-400", check: (s: any) => s.totalWorkouts >= 5 },
  { id: "ten_workouts", label: "Committed", desc: "Complete 10 workouts", icon: "workspace_premium", color: "from-amber-500 to-yellow-400", check: (s: any) => s.totalWorkouts >= 10 },
  { id: "twenty_five", label: "Dedicated", desc: "Complete 25 workouts", icon: "military_tech", color: "from-purple-500 to-violet-400", check: (s: any) => s.totalWorkouts >= 25 },
  { id: "fifty", label: "Beast Mode", desc: "Complete 50 workouts", icon: "diamond", color: "from-rose-500 to-pink-400", check: (s: any) => s.totalWorkouts >= 50 },
  { id: "streak_3", label: "On Fire", desc: "3-day workout streak", icon: "local_fire_department", color: "from-orange-500 to-red-400", check: (s: any) => s.longestStreak >= 3 },
  { id: "streak_7", label: "Week Warrior", desc: "7-day workout streak", icon: "whatshot", color: "from-red-500 to-orange-400", check: (s: any) => s.longestStreak >= 7 },
  { id: "streak_30", label: "Unstoppable", desc: "30-day workout streak", icon: "emoji_events", color: "from-yellow-500 to-amber-400", check: (s: any) => s.longestStreak >= 30 },
  { id: "hour_grinder", label: "Hour Grinder", desc: "60+ min in a month", icon: "schedule", color: "from-indigo-500 to-blue-400", check: (s: any) => s.monthlyDuration >= 60 },
  { id: "weekly_regular", label: "Regular", desc: "4 workouts in a week", icon: "calendar_month", color: "from-teal-500 to-cyan-400", check: (s: any) => s.weeklyWorkouts >= 4 },
];

interface ProfileData {
  displayName: string;
  avatarUrl: string;
  weightKg: number | "";
  heightCm: number | "";
  fitnessGoal: string;
}

interface Stats {
  totalWorkouts: number;
  weeklyWorkouts: number;
  monthlyDuration: number;
  currentStreak: number;
  longestStreak: number;
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileData>({
    displayName: "",
    avatarUrl: "",
    weightKg: "",
    heightCm: "",
    fitnessGoal: "GET_FIT",
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, statsRes] = await Promise.allSettled([
          userAPI.getProfile(),
          userAPI.getStats(),
        ]);
        if (profileRes.status === "fulfilled") {
          const p = profileRes.value.data;
          setForm({
            displayName: p.displayName || "",
            avatarUrl: p.avatarUrl || "",
            weightKg: p.weightKg || "",
            heightCm: p.heightCm || "",
            fitnessGoal: p.fitnessGoal || "GET_FIT",
          });
        } else {
          setForm((prev) => ({
            ...prev,
            displayName:
              user?.user_metadata?.display_name ||
              user?.email?.split("@")[0] ||
              "",
          }));
        }
        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data);
        }
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const fileName = `${user?.id || "user"}-${Date.now()}.${ext}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;
      setForm((prev) => ({ ...prev, avatarUrl }));

      await userAPI.updateProfile({ avatarUrl });
      toast.success("Profile photo updated!");
    } catch {
      toast.error("Failed to upload photo. Make sure the 'avatars' storage bucket exists in Supabase.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({
        displayName: form.displayName,
        avatarUrl: form.avatarUrl || undefined,
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

  const earnedBadges = stats ? BADGES.filter((b) => b.check(stats)) : [];
  const lockedBadges = stats ? BADGES.filter((b) => !b.check(stats)) : BADGES;
  const currentGoal = fitnessGoals.find((g) => g.value === form.fitnessGoal);

  return (
    <div className="animate-fadeUp space-y-6">
      {/* ── Profile Banner ────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-100 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-24 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
          {/* Avatar with upload */}
          <div className="relative shrink-0 group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {form.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={form.avatarUrl}
                alt="Profile"
                className="h-20 w-20 rounded-2xl object-cover shadow-lg shadow-primary/30 sm:h-24 sm:w-24"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-3xl font-extrabold text-white shadow-lg shadow-primary/30 sm:h-24 sm:w-24 sm:text-4xl">
                {(form.displayName || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 transition hover:bg-primary hover:text-white hover:border-primary group-hover:scale-110"
            >
              {uploading ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              )}
            </button>
            <div className="absolute -bottom-1.5 -left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow">
              <span className="material-symbols-outlined text-xs text-white">check</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl md:text-3xl">
              {form.displayName || "User"}
            </h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                <span className="material-symbols-outlined text-xs">verified</span>
                Active member
              </span>
              {stats && stats.totalWorkouts > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <span className="material-symbols-outlined text-xs">fitness_center</span>
                  {stats.totalWorkouts} workouts
                </span>
              )}
              {earnedBadges.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  <span className="material-symbols-outlined text-xs">emoji_events</span>
                  {earnedBadges.length} badge{earnedBadges.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form — 2/3 width on large */}
        <div className="lg:col-span-2 space-y-6">
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

          {/* Fitness Goal — interactive cards */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Fitness Goal
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {fitnessGoals.map((g) => {
                const selected = form.fitnessGoal === g.value;
                return (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setForm({ ...form, fitnessGoal: g.value })}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition hover:-translate-y-0.5 ${
                      selected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-100 bg-white hover:border-primary/30"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${selected ? "text-primary" : g.color}`}>
                      {g.icon}
                    </span>
                    <span className={`text-[11px] font-bold leading-tight ${selected ? "text-primary" : "text-slate-600"}`}>
                      {g.label}
                    </span>
                  </button>
                );
              })}
            </div>
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

          {/* ── Badges Section ────────────────────────── */}
          {stats && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <span className="material-symbols-outlined text-lg text-amber-600">emoji_events</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Achievements</h2>
                    <p className="text-xs text-slate-400">
                      {earnedBadges.length}/{BADGES.length} unlocked
                    </p>
                  </div>
                </div>
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(earnedBadges.length / BADGES.length) * 88} 88`}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-slate-700">
                    {Math.round((earnedBadges.length / BADGES.length) * 100)}%
                  </span>
                </div>
              </div>

              {earnedBadges.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">Earned</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                    {earnedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="group relative flex flex-col items-center rounded-xl border border-slate-100 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md cursor-default"
                        onMouseEnter={() => setActiveGoal(badge.id)}
                        onMouseLeave={() => setActiveGoal(null)}
                      >
                        <div className={`mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${badge.color} shadow-sm sm:h-11 sm:w-11`}>
                          <span className="material-symbols-outlined filled text-lg text-white sm:text-xl">{badge.icon}</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-800 sm:text-xs">{badge.label}</p>
                        {activeGoal === badge.id && (
                          <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg animate-fadeIn">
                            {badge.desc}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lockedBadges.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Locked</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                    {lockedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="group relative flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3 text-center cursor-default"
                        onMouseEnter={() => setActiveGoal(badge.id)}
                        onMouseLeave={() => setActiveGoal(null)}
                      >
                        <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 sm:h-11 sm:w-11">
                          <span className="material-symbols-outlined text-lg text-slate-300 sm:text-xl">{badge.icon}</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 sm:text-xs">{badge.label}</p>
                        {activeGoal === badge.id && (
                          <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg animate-fadeIn">
                            {badge.desc}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats bar */}
          {stats && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total", value: stats.totalWorkouts, icon: "fitness_center", bg: "bg-primary/10", ic: "text-primary" },
                { label: "This Week", value: stats.weeklyWorkouts, icon: "date_range", bg: "bg-green-50", ic: "text-green-600" },
                { label: "Streak", value: `${stats.currentStreak}d`, icon: "local_fire_department", bg: "bg-orange-50", ic: "text-orange-500" },
                { label: "Monthly", value: `${Math.round(stats.monthlyDuration / 60)}h`, icon: "schedule", bg: "bg-violet-50", ic: "text-violet-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                    <span className={`material-symbols-outlined text-base ${s.ic}`}>{s.icon}</span>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-slate-900 leading-tight">{s.value}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            {currentGoal && (
              <div className="mb-4 rounded-xl bg-primary/5 px-4 py-3">
                <p className="text-xs text-slate-400">Current goal</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`material-symbols-outlined text-base ${currentGoal.color}`}>{currentGoal.icon}</span>
                  <p className="text-sm font-semibold text-slate-700">{currentGoal.label}</p>
                </div>
              </div>
            )}
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
              {/* BMI scale bar */}
              <div className="mt-3 mb-1.5">
                <div className="flex h-2 overflow-hidden rounded-full">
                  <div className="w-[22%] bg-blue-400" />
                  <div className="w-[30%] bg-green-400" />
                  <div className="w-[25%] bg-amber-400" />
                  <div className="w-[23%] bg-red-400" />
                </div>
                <div
                  className="relative -mt-1"
                  style={{ left: `${Math.min(Math.max(((bmi - 14) / 26) * 100, 0), 100)}%` }}
                >
                  <div className="h-3 w-0.5 bg-slate-800 rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-medium text-slate-400">
                <span>Under</span>
                <span>Normal</span>
                <span>Over</span>
                <span>Obese</span>
              </div>
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

          {/* Member Since card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                <span className="material-symbols-outlined text-lg text-indigo-500">calendar_today</span>
              </div>
              <div>
                <p className="text-xs text-slate-400">Member since</p>
                <p className="text-sm font-bold text-slate-700">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
