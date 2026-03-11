import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ─── GET /api/v1/user/stats ─────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const userId = auth.userId;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalWorkouts, weeklyWorkouts, monthlySessions, user] =
      await Promise.all([
        prisma.workoutSession.count({ where: { userId } }),
        prisma.workoutSession.count({
          where: { userId, completedAt: { gte: weekAgo } },
        }),
        prisma.workoutSession.findMany({
          where: { userId, completedAt: { gte: monthAgo } },
          select: { durationMinutes: true },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { currentStreak: true, longestStreak: true },
        }),
      ]);

    const monthlyDuration = monthlySessions.reduce(
      (sum: number, s: { durationMinutes: number | null }) => sum + (s.durationMinutes || 0),
      0
    );

    return NextResponse.json({
      data: {
        totalWorkouts,
        weeklyWorkouts,
        monthlyDuration,
        currentStreak: user?.currentStreak ?? 0,
        longestStreak: user?.longestStreak ?? 0,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
