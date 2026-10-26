import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck2,
  CheckCircle2,
  Cross,
  Eye,
  HeartHandshake,
  HeartPulse,
  HelpCircle,
  History,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Counter, Reveal } from "@/components/reveal";
import { Badge, PageHero, SectionHeading } from "@/components/ui";
import { getDepartments, getDoctors } from "@/lib/queries";
import { HOSPITAL_METRICS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Explore the facilities, clinical philosophy, and specialist outpatient services of MediCare Hospital.",
};

export const dynamic = "force-dynamic";

const ABOUT_IMAGE = "/images/corridor.jpg";
const TEAM_IMAGE = "/images/team.jpg";
const HERO_IMAGE = "/images/hero.jpg";

const VALUES_SUMMARY = [
  "Easy-to-navigate medical departments",
  "Transparent specialist OPD schedules",
  "Responsive patient communication",
  "Digital appointment request management",
];

const FACILITIES = [
  {
    icon: Cross,
    title: "Specialist OPD",
    text: "Dedicated outpatient sessions across six departments, each with named consultants and weekly schedules.",
  },
  {
    icon: CalendarCheck2,
    title: "Digital Reception",
    text: "Organized appointment requests, slot availability checks, and administrative enquiry handling.",
  },
  {
    icon: HeartPulse,
    title: "Patient Support",
    text: "Clear contact channels and an administrative assistant for everyday information — never medical advice.",
  },
];

const MILESTONES = [
  {
    year: "2018",
    title: "Foundation & Clinical Campus",
    text: "Established with core general medicine consultations and dedicated outpatient triage.",
  },
  {
    year: "2020",
    title: "Specialist OPD Launch",
    text: "Introduced dedicated specialty consulting sessions across cardiology, pediatrics, and orthopedics.",
  },
  {
    year: "2022",
    title: "Expanded to 6 Departments",
    text: "Added neurology and dermatology departments to provide comprehensive multidisciplinary care.",
  },
  {
    year: "2024",
    title: "Modern Consultation Suites",
    text: "Upgraded clinical consultation rooms with modern diagnostic equipment and patient-friendly suites.",
  },
  {
    year: "2026",
    title: "Digital Appointment Platform",
    text: "Launched real-time OPD slot checks and transparent request status tracking for patients.",
  },
];

const CORE_VALUES = [
  {
    icon: HeartHandshake,
    title: "Compassion",
    text: "Listening with empathy and prioritizing human comfort and dignity at every stage of care.",
  },
  {
    icon: Eye,
    title: "Clinical Clarity",
    text: "Explaining schedules, diagnoses, and care pathways in plain, transparent language.",
  },
  {
    icon: Sparkles,
    title: "Accessibility",
    text: "Transparent consultation hours, live slot availability, and simple digital booking.",
  },
  {
    icon: ShieldCheck,
    title: "Patient Privacy",
    text: "Respecting patient confidentiality and ensuring reliable, responsible records management.",
  },
];

const GALLERY = [
  {
    src: HERO_IMAGE,
    alt: "MediCare Hospital reception and patient welcome area",
    title: "Reception & Consultation Lounge",
    subtitle: "Welcoming patient arrival and check-in",
    width: 960,
    height: 1150,
  },
  {
    src: ABOUT_IMAGE,
    alt: "Bright hospital corridor and specialist outpatient suites",
    title: "Outpatient Clinic Suites",
    subtitle: "Calm, organized specialist consulting wings",
    width: 1000,
    height: 830,
  },
  {
    src: TEAM_IMAGE,
    alt: "Healthcare professionals collaborating in hospital",
    title: "Multidisciplinary Care Team",
    subtitle: "Coordinated consultations across departments",
    width: 1000,
    height: 560,
  },
];

const FAQ_PREVIEW = [
  {
    q: "How do I request an appointment with a specialist?",
    a: "Select your preferred department and doctor, pick a bookable date from their real OPD schedule, and submit your contact details.",
  },
  {
    q: "What does a 'Pending' status mean after booking?",
    a: "Status: Pending means your request has been logged in the hospital queue and is awaiting staff confirmation in the demo system.",
  },
  {
    q: "Can I check my request status online?",
    a: "Yes. Use your booking Reference ID (e.g. MC-1001) and contact number on our Check Status page to view live updates.",
  },
];

export default async function AboutPage() {
  const [departments, doctors] = await Promise.all([
    getDepartments(),
    getDoctors(),
  ]);

  return (
    <>
      <PageHero
        badge="Our Hospital"
        title="Committed to Compassionate Care"
        description="Explore our facilities, clinical philosophy, and specialist outpatient services."
      />

      {/* -------------------- WHO WE ARE -------------------- */}
      <section className="section">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div
              className="absolute -inset-4 rounded-[1.8rem] bg-gradient-to-br from-teal/15 to-transparent"
              aria-hidden="true"
            />
            <Image
              src={ABOUT_IMAGE}
              alt="Hospital facility corridor with consultation rooms"
              width={1000}
              height={830}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="relative h-[320px] w-full rounded-[1.6rem] object-cover shadow-[0_35px_70px_-25px_rgba(12,43,68,0.35)] sm:h-[430px]"
            />
          </Reveal>

          <div>
            <Reveal>
              <Badge>Who We Are</Badge>
              <h2 className="display mt-5 text-[clamp(1.9rem,3.4vw,2.7rem)] font-extrabold text-navy">
                A Modern Approach to Patient Experience
              </h2>
              <p className="mt-5 text-[0.95rem] leading-relaxed">
                MediCare Hospital is designed to demonstrate what a professional
                hospital website and modern appointment management platform can look
                like in practice.
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed">
                Our digital experience emphasizes accessible information,
                convenient appointment requests, and organized administrative
                workflows — the same experience a leading healthcare institution
                aims to offer its community.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ul className="mt-7 space-y-3.5">
                {VALUES_SUMMARY.map((value) => (
                  <li
                    key={value}
                    className="flex items-center gap-3 text-[0.88rem] font-semibold text-navy"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal" />
                    {value}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------- OUR JOURNEY (TIMELINE) -------------------- */}
      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading
            badge="Milestones"
            title="Our Healthcare Journey"
            description="From founding foundations to modern digital patient scheduling."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {MILESTONES.map((item, index) => (
              <Reveal key={item.year} delay={index * 80}>
                <div className="card relative flex h-full flex-col border-t-4 border-t-teal p-6">
                  <span className="font-display text-2xl font-black text-teal">
                    {item.year}
                  </span>
                  <h3 className="mt-2 font-display text-[0.98rem] font-bold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-ink">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- OUR CORE VALUES -------------------- */}
      <section className="section">
        <div className="container-site">
          <SectionHeading
            badge="Guiding Principles"
            title="Values That Shape Every Interaction"
            description="Four fundamental commitments that guide our doctors, staff, and digital systems."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((v, index) => (
              <Reveal key={v.title} delay={index * 80}>
                <article className="card h-full">
                  <div className="icon-tile">
                    <v.icon className="h-6 w-6" strokeWidth={1.9} />
                  </div>
                  <h3 className="mt-5 font-display text-[1.1rem] font-extrabold text-navy">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-ink">
                    {v.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- FACILITIES & METRICS BANNER -------------------- */}
      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading
            badge="Our Facilities"
            title="Designed for Comfort and Convenience"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((facility, index) => (
              <Reveal key={facility.title} delay={(index % 3) * 90}>
                <article className="card h-full">
                  <div className="icon-tile">
                    <facility.icon className="h-6 w-6" strokeWidth={1.9} />
                  </div>
                  <h3 className="mt-5 font-display text-[1.05rem] font-extrabold text-navy">
                    {facility.title}
                  </h3>
                  <p className="mt-2 text-[0.84rem]">{facility.text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <div className="relative overflow-hidden rounded-[1.8rem]">
              <Image
                src={TEAM_IMAGE}
                alt="A diverse team of healthcare professionals"
                width={1000}
                height={560}
                loading="lazy"
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="h-[280px] w-full object-cover sm:h-[340px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-8 sm:flex-row sm:items-end sm:justify-between sm:p-12">
                <div>
                  <Badge>
                    <BedDouble className="h-3 w-3" /> The Experience
                  </Badge>
                  <h2 className="display mt-3 max-w-[30rem] !text-white text-[clamp(1.5rem,3vw,2.3rem)] font-extrabold">
                    Every detail built to make care feel effortless
                  </h2>
                </div>
                <div className="flex gap-10 text-white">
                  <div>
                    <strong className="block font-display text-3xl font-extrabold">
                      <Counter value={departments.length} />
                    </strong>
                    <span className="text-[0.72rem] text-white/70">
                      Departments
                    </span>
                  </div>
                  <div>
                    <strong className="block font-display text-3xl font-extrabold">
                      <Counter value={doctors.length} />
                    </strong>
                    <span className="text-[0.72rem] text-white/70">
                      Specialists
                    </span>
                  </div>
                  <div>
                    <strong className="block font-display text-3xl font-extrabold">
                      <Counter value={HOSPITAL_METRICS.weeklyOpdDays} suffix="d" />
                    </strong>
                    <span className="text-[0.72rem] text-white/70">
                      Weekly OPD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------- FACILITIES GALLERY -------------------- */}
      <section className="section">
        <div className="container-site">
          <SectionHeading
            badge="Inside Our Campus"
            title="Facilities Gallery"
            description="Explore our outpatient reception, specialist wings, and multidisciplinary clinical areas."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((g, index) => (
              <Reveal key={g.title} delay={index * 90}>
                <div className="group overflow-hidden rounded-[1.4rem] border border-line bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="relative h-[240px] overflow-hidden bg-paper">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={g.width}
                      height={g.height}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[1rem] font-bold text-navy">
                      {g.title}
                    </h3>
                    <p className="mt-1 text-[0.8rem] text-ink">{g.subtitle}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- FAQ PREVIEW -------------------- */}
      <section className="section bg-paper">
        <div className="container-site max-w-[880px]">
          <SectionHeading
            badge="Got Questions?"
            title="Frequently Asked Questions"
            description="Quick answers about how our outpatient appointment scheduling and status tracking work."
          />
          <div className="mt-10 space-y-4">
            {FAQ_PREVIEW.map((item, index) => (
              <Reveal key={item.q} delay={index * 80}>
                <div className="card p-6">
                  <h3 className="flex items-center gap-2.5 font-display text-[1rem] font-bold text-navy">
                    <HelpCircle className="h-4 w-4 shrink-0 text-teal" />
                    {item.q}
                  </h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ink">
                    {item.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/faq" className="btn btn-outline">
              View All Frequently Asked Questions
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* -------------------- BOTTOM CTA -------------------- */}
      <section className="section">
        <div className="container-site text-center">
          <Reveal>
            <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold text-navy">
              Ready to Book Your Specialist Visit?
            </h2>
            <p className="mx-auto mt-3 max-w-[28rem] text-[0.92rem]">
              Select your doctor and choose a live outpatient slot in minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/appointment" className="btn btn-primary !px-7 !py-4">
                Request an Appointment
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
              <Link href="/doctors" className="btn btn-outline !px-7 !py-4">
                Meet All Specialists
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
