/* ------------------------------------------------------------------ */
/*  MediCare administrative assistant — deterministic rule engine      */
/*  Administrative information only. Never medical advice.             */
/* ------------------------------------------------------------------ */

const CLINICAL_PATTERN =
  /diagnos|symptom|prescri|medicin|medication|treatment|dosage|\bpain\b|disease|rash|fever|injur|emergency|urgent|chest\s?pain|what should i take|what do i have|covid|vaccine|x-?ray|scan|therapy|surgery/i;

export function assistantReply(question: string): string {
  const q = question.toLowerCase();

  if (CLINICAL_PATTERN.test(q)) {
    return [
      "I can only provide administrative information. I cannot assess symptoms, diagnose conditions, recommend medicines, or suggest treatments.",
      "For medical concerns, please contact a qualified healthcare professional. For an emergency, use your local emergency services.",
    ].join("\n\n");
  }

  if (/appointment|booking|\bbook\b|slot|schedule|request/.test(q)) {
    return [
      "To request an appointment:",
      "1. Open Book Appointment in the menu.",
      "2. Select a department, then a doctor.",
      "3. Choose an eligible OPD date and an available time slot.",
      "4. Enter patient details (demo use only).",
      "5. Submit — you will receive a request reference like MC-1042.",
      "Requests stay PENDING until the demo administrator reviews them. A request is not a confirmed appointment.",
    ].join("\n");
  }

  if (/pending|confirm|cancel|status/.test(q)) {
    return [
      "Appointment request statuses:",
      "• Pending — received, awaiting admin review.",
      "• Confirmed — approved by the demo administrator.",
      "• Cancelled — released; the slot becomes available again.",
      "• Completed — the consultation has taken place.",
      "Submitting a request never guarantees an appointment.",
    ].join("\n");
  }

  if (/doctor|specialist|consultant|physician/.test(q)) {
    return "Our specialists and their individual OPD schedules are listed in the Doctors Directory. You can filter by department, open any profile, and start a booking straight from a doctor's page.";
  }

  if (
    /department|specialt|service|cardiology|neurology|pediatric|orthopedic|dermatology|general medicine/.test(
      q,
    )
  ) {
    return [
      "The demo hospital has six departments:",
      "Cardiology, Neurology, Orthopedics, Pediatrics, General Medicine, and Dermatology.",
      "Visit the Departments page to explore each service and its specialists.",
    ].join("\n");
  }

  if (/time|hour|\bopen\b|\bclose\b|opd|sunday|saturday|monday|when/.test(q)) {
    return [
      "Hospital opening hours:",
      "Monday – Saturday: 8:00 AM – 8:00 PM",
      "Sunday: Closed",
      "Each doctor keeps their own OPD sessions within these hours — see the Doctors Directory for individual schedules.",
    ].join("\n");
  }

  if (/phone|call|contact|address|location|email|whatsapp|reach/.test(q)) {
    return [
      "Hospital contact details (demonstration):",
      "Phone: +1 (555) 010-2020",
      "Email: hello@medicare.example",
      "Address: 125 Wellness Avenue, Demo City, DC 00000",
    ].join("\n");
  }

  if (/admin|dashboard|manage/.test(q)) {
    return "The Admin Demo page shows how staff would review requests: dashboard statistics, appointment search and status management, and patient enquiry handling. It is intentionally unprotected for demonstration purposes — a real deployment would require authenticated access.";
  }

  if (/demo|real|data|storage|database/.test(q)) {
    return "This website is a fictional demonstration. Every doctor, patient, and record is invented. Unlike the earlier localStorage version, this demo now persists records in a real PostgreSQL database, so submissions are shared across devices. Please never enter genuine patient information.";
  }

  if (/hello|^hi\b|hey|thanks|thank/.test(q)) {
    return "Hello! I'm happy to help with administrative questions — departments, doctors, OPD hours, appointment requests, or contact details. What would you like to know?";
  }

  return [
    "I can help with administrative questions about:",
    "• Departments and services",
    "• Doctors and their OPD schedules",
    "• How appointment requests work",
    "• Opening hours and contact details",
    "Try asking: “How do I book an appointment?”",
  ].join("\n");
}

export const ASSISTANT_OPENING =
  "Hello! I'm the MediCare administrative assistant.\nI can help with departments, OPD timings, appointment requests, and contact details.\nI cannot provide medical advice, diagnoses, or treatment recommendations.";

export const ASSISTANT_SUGGESTIONS = [
  "How do I book an appointment?",
  "What are the opening hours?",
  "Which departments are available?",
  "What does Pending mean?",
];
