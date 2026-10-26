/**
 * Shared hospital demonstration constants and operational hours
 */

export const HOSPITAL_TIMEZONE =
  process.env.HOSPITAL_TIMEZONE || "Asia/Kolkata";

export const HOSPITAL_HOURS = {
  openDays: [1, 2, 3, 4, 5, 6], // Monday (1) through Saturday (6)
  closedDays: [0], // Sunday (0)
  startHour: 8, // 8:00 AM
  endHour: 20, // 8:00 PM (20:00)
  label: "Mon–Sat: 8:00 AM – 8:00 PM",
  shortLabel: "Mon–Sat: 8 AM – 8 PM",
  sundayLabel: "Sunday: Closed",
} as const;

export const HOSPITAL_METRICS = {
  weeklyOpdDays: 6,
  onlineRequests: "24/7",
} as const;

export interface OpdStatus {
  isOpen: boolean;
  statusText: string;
  badgeDetail: string;
}

/**
 * Returns the current hospital OPD state in the hospital timezone
 */
export function getHospitalOpdStatus(date = new Date()): OpdStatus {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: HOSPITAL_TIMEZONE,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const weekday = parts.find((p) => p.type === "weekday")?.value; // "Mon", "Tue", ... "Sun"
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const totalMinutes = hour * 60 + minute;

  const openMinutes = HOSPITAL_HOURS.startHour * 60; // 8:00 AM = 480
  const closeMinutes = HOSPITAL_HOURS.endHour * 60; // 8:00 PM = 1200

  const NEXT_OPEN_DAY: Record<string, string> = {
    Mon: "Tuesday",
    Tue: "Wednesday",
    Wed: "Thursday",
    Thu: "Friday",
    Fri: "Saturday",
    Sat: "Monday",
    Sun: "Monday",
  };

  // 1. Sunday: Hospital OPD is closed
  if (weekday === "Sun") {
    return {
      isOpen: false,
      statusText: "Closed today · opens Monday 8 AM",
      badgeDetail: "OPD Closed",
    };
  }

  // 2. Before 8:00 AM on Monday-Saturday
  if (totalMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: "Opens today at 8 AM",
      badgeDetail: "OPD Closed",
    };
  }

  // 3. After 8:00 PM on Monday-Saturday
  if (totalMinutes >= closeMinutes) {
    const nextDay = (weekday && NEXT_OPEN_DAY[weekday]) || "tomorrow";
    return {
      isOpen: false,
      statusText: `Closed today · opens ${nextDay} 8 AM`,
      badgeDetail: "OPD Closed",
    };
  }

  // 4. Currently open (8:00 AM - 8:00 PM Mon-Sat)
  return {
    isOpen: true,
    statusText: "Open now · closes 8 PM",
    badgeDetail: "OPD Open Today",
  };
}

export interface DepartmentItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  position: number;
  description: string;
}

/**
 * Single shared list of departments across home, departments page, footer,
 * doctors filter tabs, and appointment booking form.
 * Slugs match: cardiology, neurology, orthopedics, pediatrics, general, dermatology.
 */
export const DEPARTMENTS: DepartmentItem[] = [
  {
    id: "cardiology",
    slug: "cardiology",
    name: "Cardiology",
    icon: "heart-pulse",
    position: 1,
    description:
      "Comprehensive heart health consultations and coordinated cardiovascular care pathways.",
  },
  {
    id: "neurology",
    slug: "neurology",
    name: "Neurology",
    icon: "brain",
    position: 2,
    description:
      "Specialist consultations for the brain, spine, and nervous system.",
  },
  {
    id: "orthopedics",
    slug: "orthopedics",
    name: "Orthopedics",
    icon: "bone",
    position: 3,
    description:
      "Bone, joint, and mobility consultations with structured follow-up plans.",
  },
  {
    id: "pediatrics",
    slug: "pediatrics",
    name: "Pediatrics",
    icon: "baby",
    position: 4,
    description:
      "Dedicated, family-focused healthcare consultations for infants and children.",
  },
  {
    id: "general",
    slug: "general",
    name: "General Medicine",
    icon: "stethoscope",
    position: 5,
    description:
      "Primary care consultations, preventive health checks, and everyday medicine.",
  },
  {
    id: "dermatology",
    slug: "dermatology",
    name: "Dermatology",
    icon: "sparkles",
    position: 6,
    description:
      "Outpatient consultations for skin, hair, and related concerns.",
  },
];
