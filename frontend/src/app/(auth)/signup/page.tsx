"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignUpPage() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const loading = useAuthStore((s) => s.loading);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await signUp(email, password, displayName || undefined);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Account created successfully!");
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md animate-fadeUp">
        <div className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-md sm:p-10">
          {/* logo */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <span className="material-symbols-outlined text-3xl text-white">
                fitness_center
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Create Account
            </h1>
            <p className="text-sm text-slate-500">
              Start your fitness journey today
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Display Name{" "}
                <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
