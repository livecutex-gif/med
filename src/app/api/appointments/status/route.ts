import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { appointments, departments, doctors } from "@/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { ensureSeeded } from "@/lib/queries";
import { formatDateHuman, timeLabel } from "@/lib/booking";

export const dynamic = "force-dynamic";

const lookupSchema = z.object({
  reference: z.string().trim().min(1, "Reference ID is required."),
  phone: z.string().trim().min(1, "Phone number is required."),
});

export async function POST(request: NextRequest) {
  // Rate limit: 10 attempts per 10 minutes per IP
  const rate = checkRateLimit(request, "status-lookup", 10, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Too many lookup attempts. Please wait a few minutes before trying again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "No matching request found." },
      { status: 400 },
    );
  }

  const validation = lookupSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { ok: false, message: "No matching request found." },
      { status: 400 },
    );
  }

  const { reference, phone } = validation.data;
  await ensureSeeded();

  // Normalize reference code format (e.g. "mc-1001" -> "MC-1001")
  const normalizedRef = reference.toUpperCase();

  const rows = await db
    .select({
      reference: appointments.reference,
      status: appointments.status,
      date: appointments.date,
      time: appointments.time,
      createdAt: appointments.createdAt,
      doctorName: doctors.name,
      departmentName: departments.name,
    })
    .from(appointments)
    .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
    .innerJoin(departments, eq(appointments.departmentId, departments.id))
    .where(
      and(
        eq(appointments.reference, normalizedRef),
        eq(appointments.phone, phone),
      ),
    )
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json(
      { ok: false, message: "No matching request found." },
      { status: 404 },
    );
  }

  const match = rows[0];

  return NextResponse.json({
    ok: true,
    appointment: {
      reference: match.reference,
      status: match.status,
      date: match.date,
      dateFormatted: formatDateHuman(match.date),
      time: match.time,
      timeFormatted: timeLabel(match.time),
      doctorName: match.doctorName,
      departmentName: match.departmentName,
      createdAt: match.createdAt,
    },
  });
}
