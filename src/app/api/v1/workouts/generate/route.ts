import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import { workoutGenerationService } from "@/lib/workoutGeneration";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const { equipmentIds = [], muscleIds = [], exerciseCount = 8 } = await request.json();

    const workout = await workoutGenerationService.generateWorkout({
      equipment: equipmentIds,
      muscles: muscleIds,
      exerciseCount,
    });

    if (workout.length === 0) {
      return NextResponse.json(
        { error: "No exercises found", message: "Try adjusting your equipment or muscle group selections" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: workout });
  } catch (error) {
    console.error("Generate workout error:", error);
    return NextResponse.json(
      { error: "Failed to generate workout", message: "Please try again later" },
      { status: 500 }
    );
  }
}
