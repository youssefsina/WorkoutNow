import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { exerciseDBClient } from "@/lib/exercisedb";

// Hardcoded fallback equipment list
const FALLBACK_EQUIPMENT = [
  { id: "barbell", name: "Barbell", iconUrl: null },
  { id: "dumbbell", name: "Dumbbell", iconUrl: null },
  { id: "cable", name: "Cable", iconUrl: null },
  { id: "body_weight", name: "Body Weight", iconUrl: null },
  { id: "machine", name: "Machine", iconUrl: null },
  { id: "kettlebell", name: "Kettlebell", iconUrl: null },
  { id: "band", name: "Band", iconUrl: null },
  { id: "ez_barbell", name: "EZ Barbell", iconUrl: null },
  { id: "smith_machine", name: "Smith Machine", iconUrl: null },
  { id: "stability_ball", name: "Stability Ball", iconUrl: null },
];

// In-memory cache
let equipmentCache: { data: any; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

export async function GET() {
  try {
    // Check cache
    if (equipmentCache && Date.now() - equipmentCache.ts < CACHE_TTL) {
      return NextResponse.json({ data: equipmentCache.data });
    }

    // Try DB first
    let equipment = await prisma.equipment.findMany({
      select: { id: true, name: true, iconUrl: true },
      orderBy: { name: "asc" },
    });

    // Fallback to ExerciseDB API if DB is empty
    if (equipment.length === 0) {
      try {
        const apiEquipments = await exerciseDBClient.getAllEquipments();
        equipment = apiEquipments.map((name: string) => ({
          id: name.toLowerCase().replace(/\s+/g, "_"),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          iconUrl: null,
        }));
      } catch {
        equipment = FALLBACK_EQUIPMENT as any;
      }
    }

    equipmentCache = { data: equipment, ts: Date.now() };
    return NextResponse.json({ data: equipment });
  } catch (error) {
    console.error("Get equipment error:", error);
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
  }
}
