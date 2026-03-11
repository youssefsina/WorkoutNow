import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import { workoutGenerationService } from "@/lib/workoutGeneration";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const stats = workoutGenerationService.getCacheStats();
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Get cache stats error:", error);
    return NextResponse.json({ error: "Failed to fetch cache statistics" }, { status: 500 });
  }
}
