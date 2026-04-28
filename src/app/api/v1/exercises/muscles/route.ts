import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { exerciseDBClient } from "@/lib/exercisedb";

// Hardcoded fallback muscle list
const FALLBACK_MUSCLES = [
  { id: "chest", name: "Chest", bodyPart: "Upper Body" },
  { id: "back", name: "Back", bodyPart: "Upper Body" },
  { id: "shoulders", name: "Shoulders", bodyPart: "Upper Body" },
  { id: "biceps", name: "Biceps", bodyPart: "Arms" },
  { id: "triceps", name: "Triceps", bodyPart: "Arms" },
  { id: "forearms", name: "Forearms", bodyPart: "Arms" },
  { id: "abs", name: "Abs", bodyPart: "Core" },
  { id: "quads", name: "Quads", bodyPart: "Lower Body" },
  { id: "hamstrings", name: "Hamstrings", bodyPart: "Lower Body" },
  { id: "glutes", name: "Glutes", bodyPart: "Lower Body" },
  { id: "calves", name: "Calves", bodyPart: "Lower Body" },
  { id: "traps", name: "Traps", bodyPart: "Upper Body" },
  { id: "lats", name: "Lats", bodyPart: "Upper Body" },
];

// In-memory cache
let musclesCache: { data: any; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  try {
    if (musclesCache && Date.now() - musclesCache.ts < CACHE_TTL) {
      return NextResponse.json({ data: musclesCache.data });
    }

    const muscles = await prisma.muscle.findMany({
      select: { id: true, name: true, group: true },
      orderBy: [{ group: "asc" }, { name: "asc" }],
    });

    let mapped: any[];

    if (muscles.length > 0) {
      // Use the lowercase name as ID so mapBodyPartToExerciseDB works correctly
      mapped = muscles.map((m: { id: string; name: string; group: string }) => ({
        id: m.name.toLowerCase().replace(/\s+/g, "_"),
        name: m.name,
        bodyPart: m.group,
      }));
    } else {
      try {
        const bodyParts = await exerciseDBClient.getAllBodyParts();
        mapped = bodyParts.map((bp: string) => ({
          id: bp.toLowerCase().replace(/\s+/g, "_"),
          name: bp.charAt(0).toUpperCase() + bp.slice(1),
          bodyPart: "General",
        }));
      } catch {
        mapped = FALLBACK_MUSCLES;
      }
    }

    musclesCache = { data: mapped, ts: Date.now() };
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error("Get muscles error:", error);
    return NextResponse.json({ error: "Failed to fetch muscles" }, { status: 500 });
  }
}
