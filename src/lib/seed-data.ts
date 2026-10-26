/* ------------------------------------------------------------------ */
/*  Fictional demo data + reset/seed routine                           */
/*  Shared by scripts/seed.ts and POST /api/admin/reset                */
/* ------------------------------------------------------------------ */

import { sql } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { db } from "@/db";
import { appointments, departments, doctors, enquiries } from "@/db/schema";
import { datePlus, weekdayOf } from "@/lib/booking";

/** Accepts the shared pool client or a transaction runner. */
type SeedClient = PgDatabase<any, any, any>;

export const DEPARTMENT_SEED = [
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "heart-pulse",
    position: 1,
    description:
      "Comprehensive heart health consultations and coordinated cardiovascular care pathways.",
  },
  {
    id: "neurology",
    name: "Neurology",
    icon: "brain",
    position: 2,
    description:
      "Specialist consultations for the brain, spine, and nervous system.",
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    icon: "bone",
    position: 3,
    description:
      "Bone, joint, and mobility consultations with structured follow-up plans.",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    icon: "baby",
    position: 4,
    description:
      "Dedicated, family-focused healthcare consultations for infants and children.",
  },
  {
    id: "general",
    name: "General Medicine",
    icon: "stethoscope",
    position: 5,
    description:
      "Primary care consultations, preventive health checks, and everyday medicine.",
  },
  {
    id: "dermatology",
    name: "Dermatology",
    icon: "sparkles",
    position: 6,
    description:
      "Outpatient consultations for skin, hair, and related concerns.",
  },
];

export const DOCTOR_SEED = [
  {
    id: "d1",
    name: "Dr. Olivia Bennett",
    departmentId: "cardiology",
    role: "Senior Consultant Cardiologist",
    experience: 14,
    timing: "Mon, Wed, Fri • 9 AM – 1 PM",
    days: [1, 3, 5],
    startHour: 9,
    endHour: 13,
    image: "/images/doctor-d1.jpg",
    bio: "Dr. Olivia Bennett is a senior cardiologist with extensive experience in outpatient cardiovascular assessments. She leads structured consultations focused on risk evaluation, heart wellness, and personalized lifestyle interventions. Her fictional profile demonstrates the clinic's transparent OPD scheduling and direct request booking flow. All information and credentials shown are illustrative demo data.",
  },
  {
    id: "d2",
    name: "Dr. James Wilson",
    departmentId: "neurology",
    role: "Consultant Neurologist",
    experience: 12,
    timing: "Tue, Thu, Sat • 10 AM – 2 PM",
    days: [2, 4, 6],
    startHour: 10,
    endHour: 14,
    image: "/images/doctor-d2.jpg",
    bio: "Dr. James Wilson specializes in comprehensive clinical neurology and outpatient nervous system consultations. He emphasizes patient-centered diagnostics and thorough, jargon-free explanations for neurological symptoms. His fictional profile illustrates how hospital specialists manage appointment requests and consultation schedules. All medical details and doctor profiles are strictly fictional.",
  },
  {
    id: "d3",
    name: "Dr. Sophia Martinez",
    departmentId: "pediatrics",
    role: "Senior Pediatrician",
    experience: 10,
    timing: "Mon–Sat • 9 AM – 1 PM",
    days: [1, 2, 3, 4, 5, 6],
    startHour: 9,
    endHour: 13,
    image: "/images/doctor-d3.jpg",
    bio: "Dr. Sophia Martinez provides compassionate, family-oriented pediatric care across daily outpatient consultation hours. Her clinical approach centers on positive doctor-child interactions and proactive developmental tracking. This fictional practitioner profile highlights daily pediatric availability and streamlined online booking workflows. All biographical details and imagery are demonstrative.",
  },
  {
    id: "d4",
    name: "Dr. Ethan Carter",
    departmentId: "orthopedics",
    role: "Orthopedic Consultant",
    experience: 16,
    timing: "Mon, Wed, Fri • 2 PM – 6 PM",
    days: [1, 3, 5],
    startHour: 14,
    endHour: 18,
    image: "/images/doctor-d4.jpg",
    bio: "Dr. Ethan Carter has over 16 years of expertise guiding patients through musculoskeletal consultations and rehabilitation planning. He focuses on restoring mobility, functional strength, and personalized recovery milestones. His fictional profile demonstrates how orthopedic outpatient clinic hours are coordinated digitally. Please note that this profile and its services are for demo purposes only.",
  },
  {
    id: "d5",
    name: "Dr. Amelia Foster",
    departmentId: "general",
    role: "General Physician",
    experience: 9,
    timing: "Mon–Sat • 10 AM – 2 PM",
    days: [1, 2, 3, 4, 5, 6],
    startHour: 10,
    endHour: 14,
    image: "/images/doctor-d5.jpg",
    bio: "Dr. Amelia Foster delivers accessible primary care, preventive screenings, and chronic illness management for adult patients. She advocates for active patient participation and evidence-based preventive lifestyle medicine. As part of this demonstration hospital, her fictional profile highlights first-contact primary care scheduling. All credentials, names, and images are fictional representations.",
  },
  {
    id: "d6",
    name: "Dr. Noah Anderson",
    departmentId: "dermatology",
    role: "Consultant Dermatologist",
    experience: 11,
    timing: "Tue, Thu, Sat • 2 PM – 6 PM",
    days: [2, 4, 6],
    startHour: 14,
    endHour: 18,
    image: "/images/doctor-d6.jpg",
    bio: "Dr. Noah Anderson specializes in diagnostic dermatology, chronic skin conditions, and targeted outpatient skincare regimens. He emphasizes careful clinical examination and practical therapeutic regimens tailored to individual patient needs. His outpatient clinics offer structured follow-up care for dermatological recovery. This profile and portrait are illustrative demo representations.",
  },
  {
    id: "d7",
    name: "Dr. Marcus Vance",
    departmentId: "cardiology",
    role: "Consultant Interventional Cardiologist",
    experience: 11,
    timing: "Tue, Thu, Sat • 2 PM – 6 PM",
    days: [2, 4, 6],
    startHour: 14,
    endHour: 18,
    image: "/images/doctor-d7.jpg",
    bio: "Dr. Marcus Vance brings over a decade of clinical experience in interventional cardiology and cardiovascular disease management. He emphasizes early diagnostic screening, evidence-backed therapies, and comprehensive post-procedure rehabilitation. His outpatient practice is dedicated to helping patients maintain long-term cardiac health. This profile and portrait are illustrative demo representations.",
  },
  {
    id: "d8",
    name: "Dr. Elena Rostova",
    departmentId: "neurology",
    role: "Senior Neurologist",
    experience: 15,
    timing: "Mon, Wed, Fri • 9 AM – 1 PM",
    days: [1, 3, 5],
    startHour: 9,
    endHour: 13,
    image: "/images/doctor-d8.jpg",
    bio: "Dr. Elena Rostova is an experienced neurologist dedicated to diagnosing complex central and peripheral nervous system conditions. Her clinical practice integrates thorough electrophysiological diagnostics with individualized therapeutic treatment pathways. She works closely with patients to deliver transparent neurological guidance. This profile and portrait are illustrative demo representations.",
  },
  {
    id: "d9",
    name: "Dr. Rajesh Nair",
    departmentId: "pediatrics",
    role: "Consultant Pediatrician",
    experience: 13,
    timing: "Mon, Wed, Fri • 2 PM – 6 PM",
    days: [1, 3, 5],
    startHour: 14,
    endHour: 18,
    image: "/images/doctor-d9.jpg",
    bio: "Dr. Rajesh Nair is a consultant pediatrician with over 13 years of clinical dedication to neonatal and pediatric medicine. He specializes in newborn wellness, preventive immunization programs, and managing chronic childhood respiratory conditions. Parents value his approachable communication style and compassionate approach to child care. This profile and portrait are illustrative demo representations.",
  },
  {
    id: "d10",
    name: "Dr. Sarah Jenkins",
    departmentId: "orthopedics",
    role: "Consultant Orthopedic Surgeon",
    experience: 12,
    timing: "Tue, Thu, Sat • 9 AM – 1 PM",
    days: [2, 4, 6],
    startHour: 9,
    endHour: 13,
    image: "/images/doctor-d10.jpg",
    bio: "Dr. Sarah Jenkins has twelve years of specialized orthopedic surgery experience helping patients overcome mobility limitations and joint pain. Her practice centers on joint restoration, modern ligament reconstruction, and progressive post-surgical rehabilitation plans. She focuses on clear pre-treatment consultations so patients understand every phase of care. This profile and portrait are illustrative demo representations.",
  },
  {
    id: "d11",
    name: "Dr. David Kim",
    departmentId: "general",
    role: "Senior Consultant Internal Medicine",
    experience: 17,
    timing: "Mon, Wed, Fri • 3 PM – 7 PM",
    days: [1, 3, 5],
    startHour: 15,
    endHour: 19,
    image: "/images/doctor-d11.jpg",
    bio: "Dr. David Kim is a senior internal medicine consultant with 17 years of experience managing complex multi-condition adult patients. He focuses on comprehensive health evaluations, medication reconciliation, and evidence-based preventive screenings. He is recognized for patient advocacy and structured long-term disease management plans. This profile and portrait are illustrative demo representations.",
  },
  {
    id: "d12",
    name: "Dr. Maya Patel",
    departmentId: "dermatology",
    role: "Consultant Dermatologist",
    experience: 10,
    timing: "Mon, Wed, Fri • 9 AM – 1 PM",
    days: [1, 3, 5],
    startHour: 9,
    endHour: 13,
    image: "/images/doctor-d12.jpg",
    bio: "Dr. Maya Patel brings a decade of specialized clinical dermatology and trichology experience to her outpatient practice. She provides evidence-based evaluations for complex skin conditions, inflammatory dermatoses, and specialized hair thinning concerns. Her approach emphasizes gentle, sustainable regimens and thorough patient education. This profile and portrait are illustrative demo representations.",
  },
];

/** Next date (between +2 and +8 days) matching one of the doctor's OPD days. */
function nextOdpDate(days: number[], minOffset = 2): string {
  for (let offset = minOffset; offset <= minOffset + 7; offset++) {
    const candidate = datePlus(offset);
    if (days.includes(weekdayOf(candidate))) return candidate;
  }
  return datePlus(minOffset);
}

/**
 * Wipe all tables and insert the fictional departments, doctors, sample
 * appointments, and enquiries. Can run inside a transaction (used by the
 * concurrency-safe auto-seed on empty databases).
 */
export async function seedWith(client: SeedClient) {
  await client.delete(appointments);
  await client.delete(enquiries);
  await client.delete(doctors);
  await client.delete(departments);

  // Restart serial sequences so references restart at MC-1001 / ENQ-1001.
  await client.execute(sql`ALTER SEQUENCE appointments_id_seq RESTART WITH 1`);
  await client.execute(sql`ALTER SEQUENCE enquiries_id_seq RESTART WITH 1`);

  await client.insert(departments).values(DEPARTMENT_SEED);
  await client.insert(doctors).values(DOCTOR_SEED);

  const sampleAppointments = [
    {
      name: "Alex Morgan",
      phone: "5550101001",
      departmentId: "cardiology",
      doctorId: "d1",
      date: nextOdpDate([1, 3, 5], 2),
      time: "09:00",
      reason: "Fictional routine consultation",
      status: "Pending" as const,
    },
    {
      name: "Taylor Reed",
      phone: "5550101002",
      departmentId: "neurology",
      doctorId: "d2",
      date: nextOdpDate([2, 4, 6], 3),
      time: "10:00",
      reason: "Fictional specialist consultation",
      status: "Confirmed" as const,
    },
    {
      name: "Jordan Lee",
      phone: "5550101003",
      departmentId: "pediatrics",
      doctorId: "d3",
      date: nextOdpDate([1, 2, 3, 4, 5, 6], 4),
      time: "11:00",
      reason: "Fictional pediatric consultation",
      status: "Cancelled" as const,
    },
    {
      name: "Casey Parker",
      phone: "5550101004",
      departmentId: "orthopedics",
      doctorId: "d4",
      date: nextOdpDate([1, 3, 5], 5),
      time: "14:00",
      reason: "Fictional follow-up consultation",
      status: "Pending" as const,
    },
  ];

  for (const record of sampleAppointments) {
    const [row] = await client
      .insert(appointments)
      .values(record)
      .returning({ id: appointments.id });
    await client.execute(
      sql`UPDATE appointments SET reference = ${"MC-" + (1000 + row.id)} WHERE id = ${row.id}`,
    );
  }

  const sampleEnquiries = [
    {
      name: "Jamie Brooks",
      phone: "5550102001",
      email: "jamie@example.test",
      message: "Fictional enquiry about OPD opening hours.",
      status: "New" as const,
    },
    {
      name: "Riley Green",
      phone: "5550102002",
      email: "riley@example.test",
      message: "Fictional enquiry about available departments.",
      status: "Resolved" as const,
    },
  ];

  for (const record of sampleEnquiries) {
    const [row] = await client
      .insert(enquiries)
      .values(record)
      .returning({ id: enquiries.id });
    await client.execute(
      sql`UPDATE enquiries SET reference = ${"ENQ-" + (1000 + row.id)} WHERE id = ${row.id}`,
    );
  }
}

/** Reset the demo database through the shared pool client. */
export async function resetAndSeed() {
  await seedWith(db);
}
