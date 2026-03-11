// ─── Types ──────────────────────────────────────────────────

export interface ExerciseDBExercise {
  exerciseId: string;
  name: string;
  imageUrl: string;
  equipments: string[];
  bodyParts: string[];
  gender: "male" | "female";
  exerciseType: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  videoUrl: string;
  keywords: string[];
  overview: string;
  instructions: string[];
  exerciseTips: string[];
  variations: string[];
  relatedExerciseIds: string[];
}

export interface ExerciseDBFilters {
  bodyParts?: string[];
  equipments?: string[];
  targetMuscles?: string[];
  limit?: number;
}

// ─── Mapping Helpers ────────────────────────────────────────

export function mapBodyPartToExerciseDB(bodyPart: string): string {
  const mapping: Record<string, string> = {
    // uppercase keys (legacy)
    CHEST: "CHEST",
    BACK: "BACK",
    SHOULDERS: "SHOULDERS",
    BICEPS: "UPPER ARMS",
    TRICEPS: "UPPER ARMS",
    FOREARMS: "LOWER ARMS",
    ABDOMINALS: "WAIST",
    ABS: "WAIST",
    OBLIQUES: "WAIST",
    CORE: "WAIST",
    QUADRICEPS: "UPPER LEGS",
    QUADS: "UPPER LEGS",
    HAMSTRINGS: "UPPER LEGS",
    GLUTES: "UPPER LEGS",
    CALVES: "LOWER LEGS",
    TRAPS: "BACK",
    LATS: "BACK",
    // lowercase keys (actual API IDs)
    chest: "CHEST",
    back: "BACK",
    shoulders: "SHOULDERS",
    biceps: "UPPER ARMS",
    triceps: "UPPER ARMS",
    forearms: "LOWER ARMS",
    abs: "WAIST",
    abdominals: "WAIST",
    obliques: "WAIST",
    core: "WAIST",
    quads: "UPPER LEGS",
    quadriceps: "UPPER LEGS",
    hamstrings: "UPPER LEGS",
    glutes: "UPPER LEGS",
    calves: "LOWER LEGS",
    traps: "BACK",
    lats: "BACK",
    // API-returned body part names
    waist: "WAIST",
    "upper arms": "UPPER ARMS",
    "lower arms": "LOWER ARMS",
    "upper legs": "UPPER LEGS",
    "lower legs": "LOWER LEGS",
    "upper body": "CHEST",
  };
  const key = bodyPart.toLowerCase();
  return mapping[key] || mapping[bodyPart] || bodyPart.toUpperCase();
}

export function mapEquipmentToExerciseDB(equipment: string): string {
  const mapping: Record<string, string> = {
    // uppercase keys (legacy)
    BARBELL: "BARBELL",
    DUMBBELL: "DUMBBELL",
    KETTLEBELL: "KETTLEBELL",
    CABLE: "CABLE",
    MACHINE: "LEVERAGE MACHINE",
    BODYWEIGHT: "BODY WEIGHT",
    BODY_WEIGHT: "BODY WEIGHT",
    RESISTANCE_BAND: "RESISTANCE BAND",
    NONE: "BODY WEIGHT",
    // lowercase keys (actual API IDs)
    barbell: "BARBELL",
    dumbbell: "DUMBBELL",
    kettlebell: "KETTLEBELL",
    cable: "CABLE",
    machine: "LEVERAGE MACHINE",
    bodyweight: "BODY WEIGHT",
    body_weight: "BODY WEIGHT",
    band: "RESISTANCE BAND",
    resistance_band: "RESISTANCE BAND",
    ez_barbell: "BARBELL",
    smith_machine: "LEVERAGE MACHINE",
    stability_ball: "STABILITY BALL",
    // API-returned names
    "body weight": "BODY WEIGHT",
    "leverage machine": "LEVERAGE MACHINE",
    "resistance band": "RESISTANCE BAND",
    "stability ball": "STABILITY BALL",
  };
  const key = equipment.toLowerCase();
  return mapping[key] || mapping[equipment] || equipment.toUpperCase();
}

// ─── ExerciseDB Client ─────────────────────────────────────

class ExerciseDBClient {
  private get apiKey() {
    return process.env.EXERCISEDB_API_KEY || "";
  }
  private get apiUrl() {
    return process.env.EXERCISEDB_API_URL || "https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com";
  }
  private get apiHost() {
    return process.env.EXERCISEDB_API_HOST || "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com";
  }

  private async fetchAPI(endpoint: string): Promise<any> {
    const url = `${this.apiUrl}${endpoint}`;

    if (!this.apiKey) {
      throw new Error("ExerciseDB API key is not configured");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": this.apiHost,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ExerciseDB API error: ${response.status} — ${errorText}`);
    }

    return response.json();
  }

  async getExercises(filters: ExerciseDBFilters = {}): Promise<ExerciseDBExercise[]> {
    try {
      const limit = filters.limit || 20;
      const params = new URLSearchParams();
      params.set("limit", String(limit));

      if (filters.bodyParts?.length) {
        params.set("bodyParts", filters.bodyParts.join(","));
      }
      if (filters.equipments?.length) {
        params.set("equipments", filters.equipments.join(","));
      }

      const endpoint = `/api/v1/exercises?${params.toString()}`;
      const response = await this.fetchAPI(endpoint);

      let exercises: ExerciseDBExercise[] = [];
      if (response?.success && Array.isArray(response.data)) {
        exercises = response.data;
      } else if (Array.isArray(response)) {
        exercises = response;
      } else if (response?.data) {
        exercises = response.data;
      }

      // Client-side filtering fallback (case-insensitive)
      if (exercises.length > 0 && filters.bodyParts?.length) {
        const filterParts = filters.bodyParts.map((b) => b.toUpperCase());
        exercises = exercises.filter((ex) =>
          ex.bodyParts?.some((bp) => filterParts.includes(bp.toUpperCase()))
        );
      }
      if (exercises.length > 0 && filters.equipments?.length) {
        const filterEqs = filters.equipments.map((e) => e.toUpperCase());
        exercises = exercises.filter((ex) =>
          ex.equipments?.some((eq) => filterEqs.includes(eq.toUpperCase()))
        );
      }

      return exercises.slice(0, limit);
    } catch (error) {
      console.error("ExerciseDB fetch error:", error);
      return [];
    }
  }

  async getExerciseById(id: string): Promise<ExerciseDBExercise | null> {
    try {
      const result = await this.fetchAPI(`/api/v1/exercises/${id}`);
      if (result?.success && result.data) {
        return result.data;
      }
      return result || null;
    } catch (error) {
      console.error(`Failed to fetch exercise ${id}:`, error);
      return null;
    }
  }

  async searchExercises(query: string, limit = 10): Promise<ExerciseDBExercise[]> {
    try {
      const result = await this.fetchAPI(
        `/api/v1/exercises/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      if (result?.success && Array.isArray(result.data)) {
        return result.data;
      }
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Failed to search exercises:", error);
      return [];
    }
  }

  async getAllBodyParts(): Promise<string[]> {
    try {
      const response = await this.fetchAPI("/api/v1/bodyparts");
      if (response?.success && Array.isArray(response.data)) {
        return response.data.map((item: any) => item.name || item);
      }
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Failed to fetch body parts:", error);
      return [];
    }
  }

  async getAllEquipments(): Promise<string[]> {
    try {
      const response = await this.fetchAPI("/api/v1/equipments");
      if (response?.success && Array.isArray(response.data)) {
        return response.data.map((item: any) => item.name || item);
      }
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Failed to fetch equipments:", error);
      return [];
    }
  }
}

export const exerciseDBClient = new ExerciseDBClient();
