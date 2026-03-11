import { createClient } from "./supabase/client";

// ─── Auth Token Helper ──────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
  } catch {
    // Silently continue without token
  }
  return headers;
}

// ─── Fetch Wrapper ──────────────────────────────────────────

interface ApiResponse<T = any> {
  data: T;
  error?: string;
}

async function request<T = any>(
  method: string,
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`/api/v1${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        console.warn("API returned 401 — session may be expired");
      }
      throw Object.assign(new Error(json.error || json.message || `HTTP ${res.status}`), {
        status: res.status,
        data: json,
      });
    }

    // API routes return { data: ... }, so unwrap it
    return { data: json.data ?? json };
  } finally {
    clearTimeout(timeout);
  }
}

const api = {
  get: <T = any>(path: string) => request<T>("GET", path),
  post: <T = any>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T = any>(path: string, body?: unknown) => request<T>("PUT", path, body),
};

export default api;

// ─── Typed API Helpers ──────────────────────────────────────

export const workoutAPI = {
  generate: (data: { equipment?: string[]; muscles?: string[]; equipmentIds?: string[]; muscleIds?: string[] }) =>
    api.post("/workouts/generate", {
      equipmentIds: data.equipmentIds || data.equipment || [],
      muscleIds: data.muscleIds || data.muscles || [],
    }),

  replaceExercise: (bodyPart: string, equipmentIds: string[], excludeIds: string[]) =>
    api.post("/workouts/replace-exercise", { bodyPart, equipmentIds, excludeIds }),

  complete: (data: { exercises?: any[]; exercisesCount?: number; exerciseNames?: string[]; durationMinutes: number; notes?: string }) =>
    api.post("/workouts/complete", {
      exercises: data.exercises || (data.exerciseNames ? data.exerciseNames.map((name: string) => ({ name })) : []),
      durationMinutes: data.durationMinutes,
      notes: data.notes,
    }),

  getHistory: (limit = 20, offset = 0) =>
    api.get(`/workouts/history?limit=${limit}&offset=${offset}`),

  getFavorites: () => api.get("/workouts/favorites"),

  toggleFavorite: (exerciseId: string, exerciseName: string, imageUrl?: string, bodyPart?: string) =>
    api.post("/workouts/favorites/toggle", { exerciseId, exerciseName, imageUrl, bodyPart }),

  search: (query: string) => api.get(`/workouts/search?q=${encodeURIComponent(query)}`),
};

export const userAPI = {
  ensure: () => api.post("/user/ensure"),

  getProfile: () => api.get("/user/profile"),

  updateProfile: (data: {
    displayName?: string;
    avatarUrl?: string;
    weightKg?: number;
    heightCm?: number;
    fitnessGoal?: string;
  }) => api.put("/user/profile", data),

  getStats: () => api.get("/user/stats"),
};

export const exerciseAPI = {
  getEquipment: () => api.get("/exercises/equipment"),
  getMuscles: () => api.get("/exercises/muscles"),
  getDetails: (id: string) => api.get(`/workouts/exercise/${id}`),
};
