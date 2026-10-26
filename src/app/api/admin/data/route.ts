import { NextRequest, NextResponse } from "next/server";
import { getAppointments, getEnquiries } from "@/lib/queries";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized. Admin session required." },
      { status: 401 },
    );
  }

  const [appointmentsResult, enquiriesResult] = await Promise.all([
    getAppointments(),
    getEnquiries(),
  ]);

  return NextResponse.json({
    appointments: appointmentsResult,
    enquiries: enquiriesResult,
  });
}
