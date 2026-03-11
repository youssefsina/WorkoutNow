import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ─── POST /api/v1/user/ensure ───────────────────────────────
// Called on first login to ensure a User row exists
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!isAuthUser(auth)) return auth;

  try {
    const user = await prisma.user.upsert({
      where: { id: auth.userId },
      update: {},
      create: {
        id: auth.userId,
        email: auth.userEmail || "",
      },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Ensure user error:", error);
    return NextResponse.json({ error: "Failed to ensure user" }, { status: 500 });
  }
}
