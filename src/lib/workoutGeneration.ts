import {
  exerciseDBClient,
  ExerciseDBExercise,
  ExerciseDBFilters,
  mapBodyPartToExerciseDB,
  mapEquipmentToExerciseDB,
} from "./exercisedb";

// ─── In-memory cache (server-side only) ─────────────────────
const exerciseCache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCached<T>(key: string): T | null {
  const entry = exerciseCache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
  exerciseCache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  exerciseCache.set(key, { data, ts: Date.now() });
}

// ─── Types ──────────────────────────────────────────────────

export interface GeneratedExercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  imageUrl: string;
  videoUrl?: string;
  instructions: string[];
  exerciseTips?: string[];
  overview?: string;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface WorkoutGenerationParams {
  equipment: string[];
  muscles: string[];
  exerciseCount?: number;
}

// ─── Helper Functions ───────────────────────────────────────

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateCacheKey(filters: ExerciseDBFilters): string {
  const parts = [
    filters.bodyParts?.sort().join(",") || "all",
    filters.equipments?.sort().join(",") || "all",
    filters.limit || "20",
  ];
  return `exercises:${parts.join(":")}`;
}

function transformToGeneratedExercise(exercise: ExerciseDBExercise): GeneratedExercise {
  const isCompound = exercise.targetMuscles?.length > 1;
  const sets = isCompound ? 4 : 3;
  const reps = isCompound ? "6-8" : "10-12";
  const restSeconds = isCompound ? 120 : 90;

  return {
    id: exercise.exerciseId,
    name: exercise.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
    target: exercise.targetMuscles?.[0] || exercise.bodyParts?.[0] || "Full Body",
    equipment: exercise.equipments?.[0] || "Bodyweight",
    imageUrl: exercise.imageUrl || "",
    videoUrl: exercise.videoUrl,
    instructions: exercise.instructions || [],
    exerciseTips: exercise.exerciseTips || [],
    overview: exercise.overview || "",
    sets,
    reps,
    restSeconds,
  };
}

// ─── Cached Exercise Fetching ───────────────────────────────

async function getCachedExercises(
  filters: ExerciseDBFilters
): Promise<ExerciseDBExercise[]> {
  const cacheKey = generateCacheKey(filters);

  const cached = getCached<ExerciseDBExercise[]>(cacheKey);
  if (cached) {
    console.log(`✓ Cache hit for: ${cacheKey}`);
    return cached;
  }

  console.log(`⚠ Cache miss for: ${cacheKey} - fetching from API`);
  const exercises = await exerciseDBClient.getExercises(filters);

  if (exercises.length > 0) {
    setCache(cacheKey, exercises);
  }

  return exercises;
}

// ─── Workout Generation Service ─────────────────────────────

class WorkoutGenerationService {
  async generateWorkout(params: WorkoutGenerationParams): Promise<GeneratedExercise[]> {
    const { equipment = [], muscles = [], exerciseCount = 8 } = params;

    const mappedEquipment = equipment.map(mapEquipmentToExerciseDB);
    // Deduplicate mapped muscles (biceps+triceps both → UPPER ARMS → only need one)
    const mappedMuscles = [...new Set(muscles.map(mapBodyPartToExerciseDB))];

    // Strategy 1: exact match — selected muscles AND selected equipment
    let exercises = await this.fetchWithFallback(mappedMuscles, mappedEquipment);

    // Strategy 2: muscles only — if equipment filter is too restrictive but STILL only selected muscles
    if (exercises.length < Math.min(exerciseCount, 3) && mappedEquipment.length > 0) {
      const muscleOnly = await this.fetchWithFallback(mappedMuscles, []);
      exercises = this.deduplicateExercises([...exercises, ...muscleOnly]);
    }

    // Never pad with unrelated exercises — return exactly what matched the user's selection
    if (exercises.length === 0) {
      throw new Error("No exercises found for selected muscles and equipment. Try different selections.");
    }

    const shuffled = shuffleArray(exercises);
    return shuffled.slice(0, exerciseCount).map(transformToGeneratedExercise);
  }

  /** Fetch exercises for each unique muscle group and merge results */
  private async fetchWithFallback(
    muscles: string[],
    equipment: string[]
  ): Promise<ExerciseDBExercise[]> {
    if (muscles.length === 0) {
      return getCachedExercises({
        equipments: equipment.length > 0 ? equipment : undefined,
        limit: 50,
      });
    }

    const promises = muscles.map((muscle) =>
      getCachedExercises({
        bodyParts: [muscle],
        equipments: equipment.length > 0 ? equipment : undefined,
        limit: 20,
      }).catch(() => [] as ExerciseDBExercise[])
    );

    const results = await Promise.all(promises);
    return this.deduplicateExercises(results.flat());
  }

  private deduplicateExercises(exercises: ExerciseDBExercise[]): ExerciseDBExercise[] {
    const seen = new Set<string>();
    return exercises.filter((ex) => {
      if (seen.has(ex.exerciseId)) return false;
      seen.add(ex.exerciseId);
      return true;
    });
  }

  private selectBalancedExercises(
    exercises: ExerciseDBExercise[],
    targetMuscles: string[],
    count: number
  ): ExerciseDBExercise[] {
    const selected: ExerciseDBExercise[] = [];
    const usedIds = new Set<string>();

    for (const muscle of targetMuscles) {
      const exercise = exercises.find((ex) =>
        ex.bodyParts?.some((bp) => bp.toUpperCase() === muscle.toUpperCase())
      );
      if (exercise && !usedIds.has(exercise.exerciseId)) {
        selected.push(exercise);
        usedIds.add(exercise.exerciseId);
      }
      if (selected.length >= count) break;
    }

    const remaining = exercises.filter((ex) => !usedIds.has(ex.exerciseId));
    const shuffled = shuffleArray(remaining);
    for (const exercise of shuffled) {
      if (selected.length >= count) break;
      selected.push(exercise);
    }

    return selected;
  }

  private getFallbackWorkout(): GeneratedExercise[] {
    for (const [, entry] of exerciseCache) {
      if (Array.isArray(entry.data) && entry.data.length > 0) {
        return entry.data.slice(0, 8).map(transformToGeneratedExercise);
      }
    }
    return [];
  }

  async getExerciseDetails(exerciseId: string): Promise<GeneratedExercise | null> {
    const cacheKey = `exercise:${exerciseId}`;
    const cached = getCached<ExerciseDBExercise>(cacheKey);
    if (cached) {
      return transformToGeneratedExercise(cached);
    }

    const exercise = await exerciseDBClient.getExerciseById(exerciseId);
    if (!exercise) return null;

    setCache(cacheKey, exercise);
    return transformToGeneratedExercise(exercise);
  }

  getCacheStats() {
    return {
      keys: exerciseCache.size,
      size: exerciseCache.size,
    };
  }
}

export const workoutGenerationService = new WorkoutGenerationService();
