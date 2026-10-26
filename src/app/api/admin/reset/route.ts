import { NextRequest, NextResponse } from "next/server";
import { resetAndSeed } from "@/lib/seed-data";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Reset all demo records and re-seed the fictional samples.
 * Requires authenticated admin session.
 */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized. Admin session required to reset data." },
      { status: 401 },
    );
  }

  try {
    await resetAndSeed();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Demo reset failed:", error);
    return NextResponse.json(
      { ok: false, message: "Could not reset the demo data." },
      { status: 500 },
    );
  }
}
