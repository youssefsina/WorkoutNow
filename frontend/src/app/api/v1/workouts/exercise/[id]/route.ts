import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import { workoutGenerationService } from "@/lib/workoutGeneration";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const exercise = await workoutGenerationService.getExerciseDetails(params.id);

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found", message: "The requested exercise could not be found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: exercise });
  } catch (error) {
    console.error("Get exercise details error:", error);
    return NextResponse.json({ error: "Failed to fetch exercise details" }, { status: 500 });
  }
}
