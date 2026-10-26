import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown, HelpCircle, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Frequently asked questions about MediCare Hospital outpatient timings, specialist consultations, and appointment requests. View our comprehensive patient guide.",
};

const FAQS = [
  {
    q: "How do I request an appointment with a specialist?",
    a: "Navigate to the Book Appointment page, select your preferred department and doctor, pick an available date and time slot from their live OPD schedule, and submit your contact details. You will receive an immediate reference ID (e.g. MC-1001).",
  },
  {
    q: "What does a 'Pending' status mean after submitting a request?",
    a: "Status: Pending means your request has been logged into the hospital system and is awaiting review and confirmation by administrative staff. It is not an automatically confirmed booking until approved.",
  },
  {
    q: "How can I check my appointment request status?",
    a: "You can check your status anytime on the Check Request Status page by entering your Reference ID and the contact phone number used during booking. Both fields are verified before displaying your scheduled details.",
  },
  {
    q: "What are the hospital's outpatient (OPD) consultation timings?",
    a: "MediCare Hospital OPD services operate Monday through Saturday from 8:00 AM to 8:00 PM. On Sundays, the outpatient department is closed. Each specialist maintains specific consultation hours within these operating days.",
  },
  {
    q: "How can I cancel or reschedule an existing appointment?",
    a: "To cancel or request a reschedule, you can contact hospital administration using our Contact enquiry form or phone line with your Reference ID. An administrator will update or release your slot in the system.",
  },
  {
    q: "What should I bring to my scheduled hospital consultation?",
    a: "Please arrive 15 minutes prior to your allocated slot with your Reference ID, government-issued photo identification, existing medical records or lab reports, and a list of current medications.",
  },
  {
    q: "Does this website or digital assistant provide medical advice?",
    a: "No. This website and its automated assistant provide only administrative assistance regarding schedules, departments, and booking requests. We never provide medical diagnoses, treatment plans, or emergency care.",
  },
  {
    q: "How is my personal information handled on this demonstration site?",
    a: "This is an educational demo website. Records entered into forms are stored in a shared demonstration PostgreSQL database and can be reviewed or reset at any time. Never enter real, confidential, or sensitive personal medical records.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        badge="Help & Guidance"
        title="Frequently Asked Questions"
        description="Clear answers to common questions about booking outpatient specialist visits, schedule timings, and request tracking."
      />

      <section className="section bg-paper">
        <div className="container-site max-w-[840px]">
          <div className="notice notice-warning mb-8 flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>Demonstration Notice:</strong> MediCare Hospital is a
              fictional showcase website. In a genuine medical emergency, please
              contact your local emergency services immediately.
            </span>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-line bg-white p-5 transition-all duration-200 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[1rem] font-bold text-navy select-none">
                  <span className="flex items-center gap-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-teal/10 text-[0.72rem] font-extrabold text-teal">
                      0{index + 1}
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-teal transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-3.5 border-t border-line pt-3.5 pl-9 text-[0.88rem] leading-relaxed text-ink">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-[1.6rem] border border-line bg-white p-8 text-center sm:p-10">
            <HelpCircle className="mx-auto h-10 w-10 text-teal" />
            <h3 className="mt-4 font-display text-xl font-extrabold text-navy">
              Have More Questions?
            </h3>
            <p className="mx-auto mt-2 max-w-[28rem] text-[0.86rem] text-ink">
              Our administrative reception team is here to assist with department
              details, consultation schedules, and enquiry follow-ups.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/appointment" className="btn btn-primary btn-small">
                Request an Appointment
                <ArrowRight className="btn-arrow h-3.5 w-3.5" />
              </Link>
              <Link href="/contact" className="btn btn-outline btn-small">
                Contact Reception
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
