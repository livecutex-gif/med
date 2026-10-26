import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  MediCare Hospital — fictional demo schema                          */
/*  All records are fictional. Not suitable for real patient data.     */
/* ------------------------------------------------------------------ */

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
]);

export const enquiryStatusEnum = pgEnum("enquiry_status", ["New", "Resolved"]);

export const departments = pgTable("departments", {
  id: text("id").primaryKey(), // slug, e.g. "cardiology"
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // lucide icon key
  position: smallint("position").notNull().default(0),
});

export const doctors = pgTable("doctors", {
  id: text("id").primaryKey(), // e.g. "d1"
  name: text("name").notNull(),
  departmentId: text("department_id")
    .notNull()
    .references(() => departments.id),
  role: text("role").notNull(),
  experience: smallint("experience").notNull(),
  timing: text("timing").notNull(), // human readable OPD schedule label
  days: smallint("days").array().notNull(), // 0 = Sunday … 6 = Saturday
  startHour: smallint("start_hour").notNull(), // first OPD hour (24h)
  endHour: smallint("end_hour").notNull(), // OPD end hour (exclusive)
  image: text("image").notNull(),
  bio: text("bio").notNull(),
});

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    reference: text("reference").unique(), // assigned post-insert: MC-{1000+id}
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    departmentId: text("department_id")
      .notNull()
      .references(() => departments.id),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id),
    date: text("date").notNull(), // YYYY-MM-DD
    time: text("time").notNull(), // HH:MM (24h)
    reason: text("reason").notNull(),
    status: appointmentStatusEnum("status").notNull().default("Pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // An active request (Pending / Confirmed / Completed) claims the slot.
    // This partial unique index prevents two browsers claiming the same slot
    // at the same time — something localStorage could never guarantee.
    uniqueIndex("appointments_active_slot_uq")
      .on(t.doctorId, t.date, t.time)
      .where(sql`status IN ('Pending', 'Confirmed', 'Completed')`),
  ],
);

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  reference: text("reference").unique(), // assigned post-insert: ENQ-{1000+id}
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: enquiryStatusEnum("status").notNull().default("New"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Department = typeof departments.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type AppointmentStatus = Appointment["status"];
export type EnquiryStatus = Enquiry["status"];
