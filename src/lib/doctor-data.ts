/* ------------------------------------------------------------------ */
/*  Doctor enrichment data for MediCare Hospital demo                */
/* ------------------------------------------------------------------ */

export interface DoctorDetails {
  id: string;
  name: string;
  departmentId: string;
  role: string;
  experience: number;
  timing: string;
  days: number[];
  startHour: number;
  endHour: number;
  image: string;
  qualifications: string;
  education: string;
  languages: string[];
  areasOfFocus: string[];
  bio: string;
  metaDescription: string;
}

export const DOCTORS_DATA: Record<string, DoctorDetails> = {
  // ---------------- Cardiology ----------------
  d1: {
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
    qualifications: "MD (Cardiology), FACC, MBBS",
    education: "Johns Hopkins University School of Medicine",
    languages: ["English", "Hindi", "Bengali"],
    areasOfFocus: [
      "Preventive Cardiology",
      "Heart Failure Management",
      "Lipid Disorders",
      "Echocardiography",
    ],
    bio: "Dr. Olivia Bennett is a senior cardiologist with extensive clinical experience in outpatient cardiovascular assessments. She leads structured consultations focused on risk evaluation, heart wellness, and personalized lifestyle interventions. Patients appreciate her collaborative approach and thorough diagnostic reviews. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Olivia Bennett, Senior Consultant Cardiologist with 14 years experience. OPD on Mon, Wed, Fri from 9 AM to 1 PM. Request a clinic appointment online.",
  },
  d7: {
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
    qualifications: "MD (Cardiology), DM, FSCAI, MBBS",
    education: "Harvard Medical School",
    languages: ["English", "Spanish", "Telugu"],
    areasOfFocus: [
      "Coronary Angioplasty",
      "Structural Heart Disease",
      "Hypertension Management",
      "Cardiac Rehabilitation",
    ],
    bio: "Dr. Marcus Vance brings over a decade of clinical experience in interventional cardiology and cardiovascular disease management. He emphasizes early diagnostic screening, evidence-backed therapies, and comprehensive post-procedure rehabilitation. His outpatient practice is dedicated to helping patients maintain long-term cardiac health. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Marcus Vance, Consultant Interventional Cardiologist with 11 years experience. OPD Tue, Thu, Sat from 2 PM to 6 PM. Request an appointment online.",
  },

  // ---------------- Neurology ----------------
  d2: {
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
    qualifications: "MD (Neurology), DM, MBBS",
    education: "Edinburgh Medical School",
    languages: ["English", "Spanish", "Hindi"],
    areasOfFocus: [
      "Headache & Migraine Care",
      "Epilepsy Management",
      "Neuropathic Pain",
      "Cognitive Health",
    ],
    bio: "Dr. James Wilson specializes in comprehensive clinical neurology and outpatient nervous system consultations. He emphasizes patient-centered diagnostics and thorough, jargon-free explanations for complex neurological symptoms. His structured consultations provide patients and families with actionable care plans. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. James Wilson, Consultant Neurologist with 12 years of clinical experience. OPD Tue, Thu, Sat from 10 AM to 2 PM. Request an outpatient appointment online.",
  },
  d8: {
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
    qualifications: "MD (Neurology), PhD (Neuroscience), MBBS",
    education: "Oxford University Clinical School of Medicine",
    languages: ["English", "Russian", "German"],
    areasOfFocus: [
      "Neuromuscular Disorders",
      "EEG & Nerve Conduction",
      "Movement Disorders",
      "Stroke Prevention",
    ],
    bio: "Dr. Elena Rostova is an experienced neurologist dedicated to diagnosing complex central and peripheral nervous system conditions. Her clinical practice integrates thorough electrophysiological diagnostics with individualized therapeutic treatment pathways. She works closely with patients to deliver transparent neurological guidance. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Elena Rostova, Senior Neurologist with 15 years of clinical experience. OPD sessions Mon, Wed, Fri from 9 AM to 1 PM. Request an appointment online.",
  },

  // ---------------- Pediatrics ----------------
  d3: {
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
    qualifications: "MD (Pediatrics), DCH, MBBS",
    education: "Stanford University School of Medicine",
    languages: ["English", "Spanish", "Marathi"],
    areasOfFocus: [
      "Child Growth & Nutrition",
      "Pediatric Immunization",
      "Developmental Milestones",
      "Allergy Management",
    ],
    bio: "Dr. Sophia Martinez provides compassionate, family-oriented pediatric care across daily outpatient consultation hours. Her clinical approach centers on positive doctor-child interactions and proactive developmental tracking. She works alongside parents to build sustained health foundations from infancy through adolescence. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Sophia Martinez, Senior Pediatrician with 10 years experience. OPD runs Mon–Sat from 9:00 AM to 1:00 PM. Request an outpatient pediatric appointment online.",
  },
  d9: {
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
    qualifications: "MD (Pediatrics), DNB (Neonatology), MBBS",
    education: "All India Institute of Medical Sciences (AIIMS)",
    languages: ["English", "Malayalam", "Hindi"],
    areasOfFocus: [
      "Newborn & Infant Care",
      "Pediatric Infectious Illnesses",
      "Asthma & Respiratory Care",
      "Childhood Development",
    ],
    bio: "Dr. Rajesh Nair is a consultant pediatrician with over 13 years of clinical dedication to neonatal and pediatric medicine. He specializes in newborn wellness, preventive immunization programs, and managing chronic childhood respiratory conditions. Parents value his approachable communication style and compassionate approach to child care. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Rajesh Nair, Consultant Pediatrician with 13 years of pediatric experience. OPD Mon, Wed, Fri from 2 PM to 6 PM. Request your child's appointment online.",
  },

  // ---------------- Orthopedics ----------------
  d4: {
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
    qualifications: "MS (Orthopedics), MCh, MBBS",
    education: "University of Toronto Faculty of Medicine",
    languages: ["English", "Hindi", "Punjabi"],
    areasOfFocus: [
      "Joint Preservation",
      "Sports Injury Rehabilitation",
      "Arthritis Care",
      "Spine Ergonomics",
    ],
    bio: "Dr. Ethan Carter has over 16 years of expertise guiding patients through musculoskeletal consultations and rehabilitation planning. He focuses on restoring mobility, functional strength, and personalized recovery milestones. His consultations emphasize practical lifestyle adjustments alongside evidence-based orthopedic interventions. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Ethan Carter, Orthopedic Consultant with 16 years of expertise. OPD sessions Mon, Wed, Fri from 2 PM to 6 PM. Request your specialty appointment online.",
  },
  d10: {
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
    qualifications: "MS (Orthopedic Surgery), FRCS, MBBS",
    education: "McGill University Faculty of Medicine",
    languages: ["English", "French", "American Sign Language"],
    areasOfFocus: [
      "Knee & Hip Arthroplasty",
      "Sports Ligament Reconstruction",
      "Osteoporosis Care",
      "Musculoskeletal Trauma",
    ],
    bio: "Dr. Sarah Jenkins has twelve years of specialized orthopedic surgery experience helping patients overcome mobility limitations and joint pain. Her practice centers on joint restoration, modern ligament reconstruction, and progressive post-surgical rehabilitation plans. She focuses on clear pre-treatment consultations so patients understand every phase of care. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Sarah Jenkins, Orthopedic Surgeon with 12 years surgical experience. OPD sessions Tue, Thu, Sat from 9 AM to 1 PM. Request your consultation online.",
  },

  // ---------------- General Medicine ----------------
  d5: {
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
    qualifications: "MD (Internal Medicine), MRCGP, MBBS",
    education: "King's College London School of Medicine",
    languages: ["English", "Tamil", "Hindi"],
    areasOfFocus: [
      "Preventive Health Screenings",
      "Hypertension & Diabetes",
      "Adult Immunizations",
      "Holistic Wellness",
    ],
    bio: "Dr. Amelia Foster delivers accessible primary care, preventive screenings, and chronic illness management for adult patients. She advocates for active patient participation and evidence-based preventive lifestyle medicine. Her practice provides thorough first-contact assessments and coordinated referrals across medical specialties. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Amelia Foster, General Physician with 9 years of comprehensive experience. OPD Mon–Sat from 10 AM to 2 PM. Request your primary care appointment online.",
  },
  d11: {
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
    qualifications: "MD (Internal Medicine), FACP, MBBS",
    education: "Seoul National University College of Medicine",
    languages: ["English", "Korean", "Mandarin"],
    areasOfFocus: [
      "Multisystem Chronic Disease",
      "Geriatric Care Pathways",
      "Diagnostic Dilemmas",
      "Metabolic Syndrome",
    ],
    bio: "Dr. David Kim is a senior internal medicine consultant with 17 years of experience managing complex multi-condition adult patients. He focuses on comprehensive health evaluations, medication reconciliation, and evidence-based preventive screenings. He is recognized for patient advocacy and structured long-term disease management plans. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. David Kim, Senior Internal Medicine Consultant with 17 years experience. OPD Mon, Wed, Fri from 3 PM to 7 PM. Request a clinic appointment online.",
  },

  // ---------------- Dermatology ----------------
  d6: {
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
    qualifications: "MD (Dermatology, Venereology & Leprosy), MBBS",
    education: "Melbourne Medical School",
    languages: ["English", "French", "Gujarati"],
    areasOfFocus: [
      "Clinical Dermatology",
      "Acne & Rosacea Management",
      "Eczema & Psoriasis Care",
      "Scalp & Hair Health",
    ],
    bio: "Dr. Noah Anderson specializes in diagnostic dermatology, chronic skin conditions, and targeted outpatient skincare regimens. He emphasizes careful clinical examination and practical therapeutic regimens tailored to individual patient needs. His outpatient clinics offer structured follow-up care for dermatological recovery. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Noah Anderson, Consultant Dermatologist with 11 years of experience. OPD on Tue, Thu, Sat from 2 PM to 6 PM. Request a clinical skin appointment online.",
  },
  d12: {
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
    qualifications: "MD (Dermatology), DVD, MBBS",
    education: "Grant Government Medical College, Mumbai",
    languages: ["English", "Gujarati", "Hindi"],
    areasOfFocus: [
      "Pediatric & Adult Eczema",
      "Psoriasis Therapies",
      "Hair & Scalp Disorders",
      "Pigmentary Conditions",
    ],
    bio: "Dr. Maya Patel brings a decade of specialized clinical dermatology and trichology experience to her outpatient practice. She provides evidence-based evaluations for complex skin conditions, inflammatory dermatoses, and specialized hair thinning concerns. Her approach emphasizes gentle, sustainable regimens and thorough patient education. This profile and portrait are illustrative demo representations.",
    metaDescription:
      "Dr. Maya Patel, Consultant Dermatologist with 10 years clinical experience. OPD runs Mon, Wed, Fri from 9 AM to 1 PM. Request a skin appointment online.",
  },
};

export function getDoctorDetails(id: string): DoctorDetails | undefined {
  return DOCTORS_DATA[id];
}
