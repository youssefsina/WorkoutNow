import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import { exerciseDBClient, ExerciseDBExercise } from "@/lib/exercisedb";

function transformExerciseDB(exercise: ExerciseDBExercise) {
  const difficultyLevel =
    exercise.exerciseType === "STRENGTH" ? "INTERMEDIATE" : "BEGINNER";
  return {
    id: exercise.exerciseId,
    name: exercise.name,
    videoUrl: exercise.videoUrl || null,
    imageUrl: exercise.imageUrl || null,
    difficultyLevel,
    instructions: exercise.instructions?.join("\n\n") ?? null,
    instructionsList: exercise.instructions ?? [],
    exerciseTips: exercise.exerciseTips ?? [],
    overview: exercise.overview ?? "",
    equipment: exercise.equipments.map((eq, i) => ({
      id: `eq-${i}`,
      name: eq,
      iconUrl: null,
    })),
    muscles: exercise.bodyParts.map((bp, i) => ({
      id: `muscle-${i}`,
      name: bp,
      bodyPart: bp,
    })),
    targetMuscles: exercise.targetMuscles ?? [],
    secondaryMuscles: exercise.secondaryMuscles ?? [],
    sets: 3,
    repRange: difficultyLevel === "BEGINNER" ? "10-15" : "8-12",
    restSeconds: difficultyLevel === "BEGINNER" ? 90 : 60,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    if (!query) return NextResponse.json({ data: [] });

    const exercises = await exerciseDBClient.searchExercises(query, 10);
    return NextResponse.json({ data: exercises.map(transformExerciseDB) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
