import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface AuthUser {
  userId: string;
  userEmail?: string;
}

// Admin client — used only to verify tokens server-side
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase env vars not configured");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/**
 * Verify Supabase JWT from the Authorization header via supabase.auth.getUser().
 * Returns the user info or a 401 NextResponse.
 */
export async function requireAuth(
  request: NextRequest
): Promise<AuthUser | NextResponse> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const supabase = getAdminClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: error?.message || "Invalid token" },
        { status: 401 }
      );
    }

    return { userId: user.id, userEmail: user.email };
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Authentication failed" },
      { status: 500 }
    );
  }
}

/**
 * Type guard: check if requireAuth returned a user or an error response
 */
export function isAuthUser(result: AuthUser | NextResponse): result is AuthUser {
  return "userId" in result;
}
