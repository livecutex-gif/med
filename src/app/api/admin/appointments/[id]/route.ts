import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import {
  APPOINTMENT_STATUSES,
  isValidSchedule,
  today,
  type AppointmentStatusName,
} from "@/lib/booking";
import { isUniqueViolation } from "@/lib/pg-errors";
import { getDoctorById } from "@/lib/queries";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated(request))) {
    return fail("Unauthorized. Admin session required.", 401);
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return fail("Invalid appointment id.");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.");
  }

  const status = String(body.status ?? "") as AppointmentStatusName;
  if (!APPOINTMENT_STATUSES.includes(status)) {
    return fail("Invalid status value.");
  }

  const [appointment] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id));
  if (!appointment) return fail("Appointment not found.", 404);

  if (status === "Confirmed") {
    if (appointment.date < today()) {
      return fail("Cannot confirm an appointment in the past.", 409);
    }
    const doctor = await getDoctorById(appointment.doctorId);
    if (
      !doctor ||
      !isValidSchedule(doctor, appointment.date, appointment.time)
    ) {
      return fail(
        "Cannot confirm: this slot is outside the doctor's valid OPD schedule.",
        409,
      );
    }
  }

  try {
    await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return fail(
        "Cannot confirm: another request already holds this slot.",
        409,
      );
    }
    throw error;
  }

  return NextResponse.json({ ok: true, id, status });
}
