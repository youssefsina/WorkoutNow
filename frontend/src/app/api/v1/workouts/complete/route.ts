import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const now = new Date();
  const lastWorkout = user.lastWorkoutAt;
  let newStreak = 1;

  if (lastWorkout) {
    const diffDays = Math.floor(
      (now.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 1) {
      newStreak = user.currentStreak + (diffDays === 0 ? 0 : 1);
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      lastWorkoutAt: now,
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const { exercises, durationMinutes, notes } = await request.json();

    const session = await prisma.workoutSession.create({
      data: {
        userId: auth.userId,
        exercisesCount: exercises?.length ?? 0,
        exerciseNames: exercises?.map((e: any) => e.name) ?? [],
        durationMinutes: durationMinutes || 0,
        notes: notes || null,
        completedAt: new Date(),
      },
    });

    await updateStreak(auth.userId);

    return NextResponse.json({ data: session });
  } catch (error) {
    console.error("Complete workout error:", error);
    return NextResponse.json({ error: "Failed to save workout" }, { status: 500 });
  }
}
