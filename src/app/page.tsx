import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Cross,
  HeartHandshake,
  HeartPulse,
  Quote,
  Star,
} from "lucide-react";
import { getDepartments, getDoctors } from "@/lib/queries";
import { DepartmentIcon } from "@/components/department-icon";
import { DoctorCard } from "@/components/doctor-card";
import { Counter, Reveal } from "@/components/reveal";
import { Badge, SectionHeading } from "@/components/ui";
import { HOSPITAL_METRICS } from "@/lib/constants";
import { OpdStatusBadge } from "@/components/opd-badge";

export const dynamic = "force-dynamic";

const HERO_IMAGE = "/images/hero.jpg";
const ABOUT_IMAGE = "/images/corridor.jpg";

const ABOUT_POINTS = [
  "Modern outpatient consultation facilities",
  "Experienced healthcare specialists",
  "Streamlined appointment request management",
  "Convenient patient enquiry support",
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Cardiology Patient",
    quote:
      "The specialist consultation was prompt and thorough. Scheduling an OPD slot online and receiving a reference code made the clinic visit seamless.",
  },
  {
    name: "David M.",
    role: "Orthopedics Patient",
    quote:
      "Clear communication about treatment options and transparent clinic hours. Knowing exactly when the doctor was available saved our family hours of waiting.",
  },
  {
    name: "Amina K.",
    role: "Pediatrics Parent",
    quote:
      "Compassionate care for my daughter. The digital request system was simple to use, and the clinic staff confirmed our appointment time quickly.",
  },
];

const WHY_CHOOSE = [
  {
    icon: CalendarCheck2,
    title: "Easy Appointments",
    text: "Request your preferred specialist, date, and consultation time through one simple online flow.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    text: "Patient-centered design built around clear information and effortless communication.",
  },
  {
    icon: Clock3,
    title: "Convenient OPD Hours",
    text: "Browse real availability, see eligible sessions, and pick a time that genuinely works.",
  },
];

export default async function HomePage() {
  const [departments, doctors] = await Promise.all([
    getDepartments(),
    getDoctors(),
  ]);
  const departmentNames = new Map(departments.map((d) => [d.id, d.name]));

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="hero-mesh grain relative overflow-hidden">
        <div
          className="dot-grid absolute inset-x-0 bottom-0 h-44 opacity-50"
          aria-hidden="true"
        />
        <div className="container-site relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:gap-10 lg:py-24">
          <div>
            <Reveal>
              <Badge>
                <Cross className="h-3 w-3" /> Your Health, Our Priority
              </Badge>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="display mt-7 text-[clamp(2.9rem,6vw,4.9rem)] font-extrabold">
                Better Health.
                <br />
                <span className="text-teal">Better Tomorrow.</span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 max-w-[30rem] text-[1rem] leading-relaxed">
                Compassionate healthcare meets modern medicine. Discover an
                easier way to connect with specialists, explore our services,
                and request appointments in minutes.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-9 flex flex-wrap gap-3.5">
                <Link href="/appointment" className="btn btn-primary !px-7 !py-4">
                  Book an Appointment
                  <ArrowRight className="btn-arrow h-4 w-4" />
                </Link>
                <Link href="/doctors" className="btn btn-outline !px-7 !py-4">
                  Find a Doctor
                </Link>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[0.8rem] font-semibold text-navy/80">
                {[
                  "Experienced specialists",
                  "Patient-first approach",
                  "Real slot availability",
                ].map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="relative">
              <div
                className="absolute -inset-5 rounded-[8rem_2rem_8rem_2rem] bg-gradient-to-br from-teal/20 via-transparent to-navy/10"
                aria-hidden="true"
              />
              <Image
                src={HERO_IMAGE}
                alt="Healthcare professionals collaborating in a bright hospital corridor"
                width={960}
                height={1150}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                className="relative h-[340px] w-full rounded-[7rem_1.6rem_7rem_1.6rem] object-cover shadow-[0_40px_90px_-30px_rgba(12,43,68,0.4)] sm:h-[440px] lg:h-[500px]"
              />

              <div className="animate-float absolute -bottom-6 left-3 flex items-center gap-3.5 rounded-2xl bg-white/95 p-4 pr-6 shadow-[0_20px_50px_-15px_rgba(12,43,68,0.3)] ring-1 ring-line backdrop-blur sm:-left-8">
                <span className="icon-tile">
                  <HeartPulse className="h-5 w-5" />
                </span>
                <span>
                  <strong className="block font-display text-[0.9rem] font-bold text-navy">
                    Care You Can Trust
                  </strong>
                  <small className="text-[0.72rem]">
                    Modern, patient-focused services
                  </small>
                </span>
              </div>

              <OpdStatusBadge />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ STATS ------------------------------ */}
      <div className="container-site">
        <Reveal>
          <div className="grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4">
            {[
              { value: departments.length, suffix: "", label: "Specialist Departments" },
              { value: doctors.length, suffix: "", label: "Featured Doctors" },
              { value: HOSPITAL_METRICS.weeklyOpdDays, suffix: " Days", label: "Weekly OPD Services" },
              { value: HOSPITAL_METRICS.onlineRequests, suffix: "", label: "Online Requests" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center [&:nth-child(2)]:border-r [&:nth-child(1)]:border-r border-line lg:[&:nth-child(2)]:border-r lg:[&:nth-child(3)]:border-r"
              >
                <strong className="block font-display text-[2rem] font-extrabold text-navy">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </strong>
                <span className="text-[0.76rem] font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* --------------------------- DEPARTMENTS --------------------------- */}
      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading
            badge="Our Specialties"
            title="Comprehensive Care, All Under One Roof"
            description="Explore our specialist departments, each with named consultants, transparent OPD schedules, and online request booking."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department, index) => (
              <Reveal key={department.id} delay={(index % 3) * 90}>
                <article className="card h-full">
                  <div className="icon-tile">
                    <DepartmentIcon icon={department.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-[1.05rem] font-extrabold text-navy">
                    {department.name}
                  </h3>
                  <p className="mt-2 text-[0.84rem]">{department.description}</p>
                  <Link
                    href={`/doctors?department=${department.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-extrabold text-teal transition-transform hover:translate-x-0.5"
                  >
                    Find a Specialist <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ ABOUT ------------------------------ */}
      <section className="section">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div
              className="dot-grid absolute -left-8 -top-8 h-40 w-40 rounded-3xl"
              aria-hidden="true"
            />
            <Image
              src={ABOUT_IMAGE}
              alt="Bright, modern hospital corridor with staff"
              width={1000}
              height={830}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="relative h-[320px] w-full rounded-[1.6rem] object-cover shadow-[0_35px_70px_-25px_rgba(12,43,68,0.35)] sm:h-[420px]"
            />
            <div className="animate-float absolute -bottom-6 right-6 rounded-2xl bg-navy px-6 py-5 text-white shadow-xl">
              <strong className="block font-display text-2xl font-extrabold">
                <Counter value={HOSPITAL_METRICS.weeklyOpdDays} /> Days
              </strong>
              <span className="text-[0.72rem] text-white/70">
                a week, at your service
              </span>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Badge>About MediCare</Badge>
              <h2 className="display mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)] font-extrabold">
                Healthcare Built Around You
              </h2>
              <p className="mt-5 text-[0.95rem]">
                At MediCare Hospital, our mission is simple: make
                quality healthcare feel more personal, accessible, and organized.
              </p>
              <p className="mt-3 text-[0.95rem]">
                From finding the right specialist to requesting an appointment,
                every digital touchpoint is designed to make each interaction
                calmer and clearer.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ul className="mt-7 space-y-3.5">
                {ABOUT_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-[0.88rem] font-semibold text-navy"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn btn-primary mt-9">
                Discover Our Hospital
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------ DOCTORS ----------------------------- */}
      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading
            badge="Our Medical Team"
            title="Meet Our Featured Specialists"
            description="Browse our directory of medical specialists and their consultation schedules."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 3).map((doctor, index) => (
              <Reveal key={doctor.id} delay={(index % 3) * 90}>
                <DoctorCard
                  doctor={doctor}
                  departmentName={departmentNames.get(doctor.departmentId) ?? ""}
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/doctors" className="btn btn-outline">
              View All Doctors
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- WHY CHOOSE ---------------------------- */}
      <section className="section">
        <div className="container-site">
          <SectionHeading
            badge="Why Choose MediCare"
            title="Thoughtful Services for Every Patient"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE.map((item, index) => (
              <Reveal key={item.title} delay={(index % 3) * 90}>
                <article className="card h-full">
                  <div className="icon-tile">
                    <item.icon className="h-6 w-6" strokeWidth={1.9} />
                  </div>
                  <h3 className="mt-5 font-display text-[1.05rem] font-extrabold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.84rem]">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- TESTIMONIALS ------------------------- */}
      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading
            badge="Patient Experiences"
            title="What Our Patients Say"
            description="Recent feedback from our outpatient community. Illustrative testimonials."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, index) => (
              <Reveal key={t.name} delay={(index % 3) * 90}>
                <article className="card flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="mt-4 text-[0.88rem] leading-relaxed text-navy">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 border-t border-line pt-4">
                    <p className="font-display text-[0.92rem] font-bold text-navy">
                      {t.name}
                    </p>
                    <span className="text-[0.74rem] font-medium text-ink">
                      {t.role}
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-[0.74rem] text-ink">
            Illustrative testimonials
          </p>
        </div>
      </section>

      {/* ------------------------------- CTA -------------------------------- */}
      <section className="section bg-paper">
        <div className="container-site">
          <Reveal>
            <div className="grain relative overflow-hidden rounded-[1.8rem] bg-navy px-8 py-14 sm:px-14">
              <div
                className="pointer-events-none absolute -right-32 -top-40 h-[26rem] w-[26rem] rounded-full bg-teal/25 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="dot-grid pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20"
                aria-hidden="true"
              />
              <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div>
                  <h2 className="display !text-white text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold">
                    Take the First Step Toward Better Care
                  </h2>
                  <p className="mt-3 max-w-[34rem] text-[0.9rem] text-[#cadae5]">
                    Find your specialist and submit an appointment request in
                    minutes — reviewed by the demo administration team.
                  </p>
                </div>
                <Link
                  href="/appointment"
                  className="btn btn-light shrink-0 !px-7 !py-4"
                >
                  Request Appointment
                  <ArrowRight className="btn-arrow h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
