/* ------------------------------------------------------------------ */
/*  Shared appointment scheduling rules (pure, no DB)                  */
/* ------------------------------------------------------------------ */

export const APPOINTMENT_STATUSES = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
] as const;

export type AppointmentStatusName = (typeof APPOINTMENT_STATUSES)[number];

export interface DoctorSchedule {
  days: number[];
  startHour: number;
  endHour: number;
}

export function dateLocal(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function today(): string {
  return dateLocal(new Date());
}

export function datePlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return dateLocal(d);
}

/** Parse "YYYY-MM-DD" at local noon so weekday math is timezone safe. */
export function parseDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

export function weekdayOf(date: string): number {
  return parseDate(date).getDay();
}

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** 30 minute OPD slots inside [startHour, endHour). */
export function getSlotTimes(schedule: DoctorSchedule): string[] {
  const slots: string[] = [];
  for (let h = schedule.startHour; h < schedule.endHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

export function timeLabel(value: string): string {
  const [hRaw, mRaw] = value.split(":");
  const h = Number(hRaw);
  return `${h % 12 || 12}:${mRaw} ${h >= 12 ? "PM" : "AM"}`;
}

export function formatDateHuman(value: string): string {
  const d = parseDate(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type ScheduleDateStatus = "ok" | "out-of-range" | "off-day" | "invalid";

/** Whether a doctor even has an OPD session on a given date. */
export function scheduleDateStatus(
  schedule: DoctorSchedule,
  date: string,
): ScheduleDateStatus {
  if (!date || Number.isNaN(parseDate(date).getTime())) return "invalid";
  if (date < today() || date > datePlus(60)) return "out-of-range";
  if (!schedule.days.includes(weekdayOf(date))) return "off-day";
  return "ok";
}

/** Full validation that a date + time belongs to a doctor's schedule. */
export function isValidSchedule(
  schedule: DoctorSchedule,
  date: string,
  time: string,
): boolean {
  if (scheduleDateStatus(schedule, date) !== "ok") return false;
  return getSlotTimes(schedule).includes(time);
}

export const PHONE_PATTERN = /^[0-9]{10,15}$/;
