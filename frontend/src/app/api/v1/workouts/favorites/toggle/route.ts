import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const { exerciseId, exerciseName, imageUrl, bodyPart } = await request.json();

    const existing = await prisma.favoriteExercise.findUnique({
      where: { userId_exerciseId: { userId: auth.userId, exerciseId } },
    });

    if (existing) {
      await prisma.favoriteExercise.delete({ where: { id: existing.id } });
      return NextResponse.json({ data: { isFavorite: false } });
    }

    await prisma.favoriteExercise.create({
      data: { userId: auth.userId, exerciseId, exerciseName, imageUrl, bodyPart },
    });

    return NextResponse.json({ data: { isFavorite: true } });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
  }
}
