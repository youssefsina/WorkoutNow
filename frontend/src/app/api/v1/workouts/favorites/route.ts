import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const favorites = await prisma.favoriteExercise.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: favorites });
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}
