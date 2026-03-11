import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import { exerciseDBClient, mapBodyPartToExerciseDB, mapEquipmentToExerciseDB, ExerciseDBExercise } from "@/lib/exercisedb";

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

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const { bodyPart, equipmentIds = [], excludeIds = [] } = await request.json();

    const mappedBodyPart = mapBodyPartToExerciseDB(bodyPart);
    const mappedEquipment = [...new Set(equipmentIds.map(mapEquipmentToExerciseDB))] as string[];

    const exercises = await exerciseDBClient.getExercises({
      bodyParts: [mappedBodyPart],
      equipments: mappedEquipment.length ? mappedEquipment : undefined,
      limit: 20,
    });

    const available = exercises.filter(
      (ex) => !excludeIds.includes(ex.exerciseId)
    );

    if (available.length === 0) {
      return NextResponse.json({ data: null });
    }

    const picked = available[Math.floor(Math.random() * available.length)];
    return NextResponse.json({ data: transformExerciseDB(picked) });
  } catch (error) {
    console.error("Replace exercise error:", error);
    return NextResponse.json({ error: "Failed to replace exercise" }, { status: 500 });
  }
}
