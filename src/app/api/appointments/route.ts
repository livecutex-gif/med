import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { isValidSchedule, PHONE_PATTERN } from "@/lib/booking";
import { isUniqueViolation } from "@/lib/pg-errors";
import { getDoctorById, getDepartments, hasActiveSlotConflict } from "@/lib/queries";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

const appointmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(80, "Name must not exceed 80 characters."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Please provide a valid 10-15 digit phone number."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .optional()
    .or(z.literal("")),
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required.")
    .max(500, "Reason must not exceed 500 characters."),
  departmentId: z
    .string()
    .trim()
    .min(1, "Department is required."),
  doctorId: z
    .string()
    .trim()
    .min(1, "Doctor is required."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date (YYYY-MM-DD)."),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Please select a valid time slot (HH:MM)."),
  website: z.string().optional(), // Honeypot field for spam bots
});

export async function POST(request: NextRequest) {
  // 1. Per-IP rate limiting: max 5 submissions per 10 minutes
  const rate = checkRateLimit(request, "appointments", 5, 10 * 60 * 1000);
  if (!rate.allowed) {
    return fail(
      "Too many appointment requests submitted. Please wait a few minutes before trying again.",
      429,
    );
  }

  // 2. Parse request JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.");
  }

  // 3. Schema validation with Zod
  const validation = appointmentSchema.safeParse(body);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message ?? "Invalid form input.";
    return fail(firstError);
  }

  const { name, phone, email, reason, departmentId, doctorId, date, time, website } =
    validation.data;

  // 4. Honeypot check: silently return fake success if bot filled the hidden input
  if (website && website.trim().length > 0) {
    const fakeRef = `MC-${Math.floor(1000 + Math.random() * 9000)}`;
    return NextResponse.json({ ok: true, id: 999999, reference: fakeRef }, { status: 201 });
  }

  // 5. Verify department exists
  const departmentIds = (await getDepartments()).map((d) => d.id);
  if (!departmentIds.includes(departmentId)) {
    return fail("Please select a valid department.");
  }

  // 6. Verify doctor exists and belongs to selected department
  const doctor = await getDoctorById(doctorId);
  if (!doctor || doctor.departmentId !== departmentId) {
    return fail("Please select a valid doctor for that department.");
  }

  // 7. Verify time fits doctor's schedule
  if (!isValidSchedule(doctor, date, time)) {
    return fail("That time falls outside the doctor's OPD schedule.", 409);
  }

  // 8. Prevent double booking: check if this slot already has Pending or Confirmed
  if (await hasActiveSlotConflict(doctorId, date, time)) {
    return fail(
      "This time slot already has an appointment requested or confirmed. Please select another time.",
      409,
    );
  }

  // 9. Save appointment in database
  try {
    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(appointments)
        .values({
          name,
          phone,
          email: email && email.trim().length > 0 ? email.trim() : null,
          reason,
          departmentId,
          doctorId,
          date,
          time,
          status: "Pending",
        })
        .returning({ id: appointments.id });

      const reference = `MC-${1000 + row.id}`;
      await tx.execute(
        sql`UPDATE appointments SET reference = ${reference} WHERE id = ${row.id}`,
      );
      return { id: row.id, reference };
    });

    return NextResponse.json({ ok: true, ...created }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return fail(
        "This time slot already has an appointment requested or confirmed. Please select another time.",
        409,
      );
    }
    console.error("Appointment creation failed:", error);
    return fail("Could not save the appointment request. Please try again later.", 500);
  }
}
