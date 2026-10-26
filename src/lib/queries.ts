/* ------------------------------------------------------------------ */
/*  Server-side data access                                            */
/* ------------------------------------------------------------------ */

import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  appointments,
  departments,
  doctors,
  type Appointment,
  type Department,
  type Doctor,
  type Enquiry,
  enquiries,
} from "@/db/schema";
import {
  datePlus,
  formatDateHuman,
  getSlotTimes,
  scheduleDateStatus,
  timeLabel,
  type ScheduleDateStatus,
  weekdayOf,
} from "@/lib/booking";
import { hasPgCode } from "@/lib/pg-errors";
import { seedWith, DOCTOR_SEED } from "@/lib/seed-data";
import { DOCTORS_DATA, type DoctorDetails } from "@/lib/doctor-data";

/* ------------------------------------------------------------------ */
/*  Auto-seed: on a fresh (empty) managed database, the first read     */
/*  inserts the fictional demo data. An advisory transaction lock      */
/*  prevents concurrent first-requests from double-seeding.            */
/* ------------------------------------------------------------------ */

let seedChecked = false;

export async function ensureSeeded(): Promise<void> {
  if (seedChecked) return;
  try {
    await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(727272)`);
      const result = (await tx.execute(
        sql`SELECT COUNT(*)::int AS count FROM departments`,
      )) as unknown as { rows: { count: number }[] };
      await tx.execute(
        sql`ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "email" text;`,
      );
      if ((result.rows[0]?.count ?? 0) === 0) {
        await seedWith(tx);
      } else {
        for (const doc of DOCTOR_SEED) {
          await tx.insert(doctors).values(doc).onConflictDoNothing();
        }
      }
    });
    seedChecked = true;
  } catch (error) {
    if (hasPgCode(error, "42P01")) {
      console.error(
        "[medicare] Demo tables are missing. Run `npx drizzle-kit push` against your DATABASE_URL.",
      );
      return;
    }
    console.error("[medicare] Auto-seed check failed:", error);
  }
}

export async function getDepartments(): Promise<Department[]> {
  await ensureSeeded();
  return db.select().from(departments).orderBy(departments.position);
}

export interface EnrichedDoctor extends Doctor {
  qualifications: string;
  education: string;
  languages: string[];
  areasOfFocus: string[];
  metaDescription: string;
}

export function enrichDoctor(doctor: Doctor): EnrichedDoctor {
  const details = DOCTORS_DATA[doctor.id];
  return {
    ...doctor,
    image: doctor.image.startsWith("/images")
      ? doctor.image
      : (details?.image ?? doctor.image),
    bio: details?.bio ?? doctor.bio,
    qualifications: details?.qualifications ?? "MD, Specialist",
    education: details?.education ?? "Accredited Medical University",
    languages: details?.languages ?? ["English"],
    areasOfFocus: details?.areasOfFocus ?? ["Specialist Consultations"],
    metaDescription:
      details?.metaDescription ??
      `${doctor.name}, ${doctor.role} with ${doctor.experience} years experience. OPD: ${doctor.timing}. Request an appointment online.`,
  };
}

export async function getDoctors(): Promise<EnrichedDoctor[]> {
  await ensureSeeded();
  const rows = await db.select().from(doctors).orderBy(doctors.id);
  return rows.map(enrichDoctor);
}

export async function getDoctorById(
  id: string,
): Promise<EnrichedDoctor | undefined> {
  await ensureSeeded();
  const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
  return doctor ? enrichDoctor(doctor) : undefined;
}

export interface NextSlotResult {
  date: string;
  dateFormatted: string;
  time: string;
  timeFormatted: string;
}

export async function getNextAvailableSlot(
  doctor: Doctor,
): Promise<NextSlotResult | null> {
  await ensureSeeded();
  for (let offset = 0; offset <= 30; offset++) {
    const candidateDate = datePlus(offset);
    if (!doctor.days.includes(weekdayOf(candidateDate))) {
      continue;
    }

    const avail = await getAvailability(doctor.id, candidateDate);
    if (avail.status === "ok") {
      let freeSlots = avail.slots.filter((s) => !s.taken);
      if (offset === 0) {
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        freeSlots = freeSlots.filter((s) => {
          const [h, m] = s.time.split(":").map(Number);
          return h * 60 + m > currentMins;
        });
      }

      if (freeSlots.length > 0) {
        const first = freeSlots[0];
        return {
          date: candidateDate,
          dateFormatted: formatDateHuman(candidateDate),
          time: first.time,
          timeFormatted: first.label,
        };
      }
    }
  }
  return null;
}

export interface AppointmentView extends Appointment {
  departmentName: string;
  doctorName: string;
}

export async function getAppointments(): Promise<AppointmentView[]> {
  await ensureSeeded();
  const rows = await db
    .select({
      appointment: appointments,
      departmentName: departments.name,
      doctorName: doctors.name,
    })
    .from(appointments)
    .innerJoin(departments, eq(appointments.departmentId, departments.id))
    .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
    .orderBy(desc(appointments.createdAt), desc(appointments.id));

  return rows.map((row) => ({
    ...row.appointment,
    departmentName: row.departmentName,
    doctorName: row.doctorName,
  }));
}

export async function getEnquiries(): Promise<Enquiry[]> {
  await ensureSeeded();
  return db
    .select()
    .from(enquiries)
    .orderBy(desc(enquiries.createdAt), desc(enquiries.id));
}

export interface SlotAvailability {
  time: string;
  label: string;
  taken: boolean;
}

export interface AvailabilityResult {
  status: ScheduleDateStatus | "no-doctor";
  slots: SlotAvailability[];
}

/**
 * Compute the bookable 30-minute slots for a doctor on a given date.
 * A slot is "taken" when an active appointment (Pending / Confirmed /
 * Completed) already claims it — enforced at the database level by a
 * partial unique index, so this read is informational only.
 */
export async function getAvailability(
  doctorId: string,
  date: string,
): Promise<AvailabilityResult> {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) return { status: "no-doctor", slots: [] };

  const status = scheduleDateStatus(doctor, date);
  if (status !== "ok") return { status, slots: [] };

  const takenRows = await db
    .select({ time: appointments.time })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.date, date),
        ne(appointments.status, "Cancelled"),
      ),
    );

  const taken = new Set(takenRows.map((row) => row.time));

  const slots = getSlotTimes(doctor).map((time) => ({
    time,
    label: timeLabel(time),
    taken: taken.has(time),
  }));

  return { status: "ok", slots };
}

/** Active appointments matching a doctor/date/time, excluding one record. */
export async function hasActiveSlotConflict(
  doctorId: string,
  date: string,
  time: string,
  excludeAppointmentId?: number,
): Promise<boolean> {
  const rows = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.date, date),
        eq(appointments.time, time),
        inArray(appointments.status, ["Pending", "Confirmed", "Completed"]),
        ...(excludeAppointmentId
          ? [ne(appointments.id, excludeAppointmentId)]
          : []),
      ),
    )
    .limit(1);
  return rows.length > 0;
}
