import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ─── GET /api/v1/user/profile ───────────────────────────────
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        weightKg: true,
        heightCm: true,
        fitnessGoal: true,
        currentStreak: true,
        longestStreak: true,
        lastWorkoutAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// ─── PUT /api/v1/user/profile ───────────────────────────────
export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const { displayName, avatarUrl, weightKg, heightCm, fitnessGoal } = await request.json();

    const user = await prisma.user.upsert({
      where: { id: auth.userId },
      update: {
        displayName,
        avatarUrl,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        heightCm: heightCm ? parseFloat(heightCm) : undefined,
        fitnessGoal,
      },
      create: {
        id: auth.userId,
        email: auth.userEmail || "",
        displayName,
        avatarUrl,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        heightCm: heightCm ? parseFloat(heightCm) : undefined,
        fitnessGoal,
      },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
