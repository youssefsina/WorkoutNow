import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [sessions, total] = await Promise.all([
      prisma.workoutSession.findMany({
        where: { userId: auth.userId },
        orderBy: { completedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.workoutSession.count({ where: { userId: auth.userId } }),
    ]);

    return NextResponse.json({ data: sessions, total, limit, offset });
  } catch (error) {
    console.error("Get history error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
