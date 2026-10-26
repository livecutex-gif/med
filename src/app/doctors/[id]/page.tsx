import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarCheck2,
  Clock3,
  GraduationCap,
  Languages,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import {
  getDepartments,
  getDoctorById,
  getDoctors,
  getNextAvailableSlot,
} from "@/lib/queries";
import { DoctorCard } from "@/components/doctor-card";
import { Reveal } from "@/components/reveal";
import { PageHero, SectionHeading } from "@/components/ui";
import { WEEKDAY_LABELS } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) {
    return {
      title: "Doctor Not Found | MediCare Hospital",
      description:
        "The requested fictional specialist profile could not be found.",
    };
  }

  return {
    title: `${doctor.name} - ${doctor.role} | MediCare Hospital`,
    description: doctor.metaDescription,
    openGraph: {
      title: `${doctor.name} - ${doctor.role} | MediCare Hospital`,
      description: doctor.metaDescription,
      images: [
        {
          url: doctor.image,
          width: 800,
          height: 1200,
          alt: doctor.name,
        },
      ],
    },
  };
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await getDoctorById(id);

  if (!doctor) notFound();

  const [departments, doctors, nextSlot] = await Promise.all([
    getDepartments(),
    getDoctors(),
    getNextAvailableSlot(doctor),
  ]);

  const departmentNames = new Map(departments.map((d) => [d.id, d.name]));
  const departmentName = departmentNames.get(doctor.departmentId) ?? "";
  const colleagues = doctors
    .filter((d) => d.departmentId === doctor.departmentId && d.id !== doctor.id)
    .slice(0, 3);

  const availableDays = [...doctor.days]
    .sort((a, b) => a - b)
    .map((day) => WEEKDAY_LABELS[day].slice(0, 3))
    .join(" · ");

  return (
    <>
      <PageHero
        badge="Specialist Profile"
        title={doctor.name}
        description={doctor.role}
      />

      <section className="section bg-paper">
        <div className="container-site grid items-start gap-12 lg:grid-cols-[360px_1fr]">
          <Reveal className="relative">
            <Image
              src={doctor.image}
              alt={`Portrait of ${doctor.name}`}
              width={800}
              height={1200}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 360px"
              className="w-full rounded-[1.6rem] object-cover shadow-[0_35px_70px_-25px_rgba(12,43,68,0.35)]"
            />
            <span className="badge absolute left-5 top-5 !border-white/60 bg-white/90 backdrop-blur">
              {departmentName}
            </span>
          </Reveal>

          <div>
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="display text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold text-navy">
                  About {doctor.name}
                </h2>
              </div>
              <p className="mt-4 max-w-[46rem] text-[0.95rem] leading-relaxed">
                {doctor.bio}
              </p>
            </Reveal>

            {/* Next available slot highlight */}
            <Reveal delay={80}>
              <div className="mt-6 flex items-center gap-3.5 rounded-2xl border border-teal/25 bg-mint px-5 py-4 text-teal-dark shadow-sm">
                <CalendarCheck2 className="h-5 w-5 shrink-0 text-teal" />
                <div className="text-[0.84rem]">
                  <span className="block text-[0.7rem] font-bold uppercase tracking-[0.08em] text-teal/80">
                    Next Available Slot
                  </span>
                  <span className="font-display font-extrabold text-navy">
                    {nextSlot
                      ? `${nextSlot.dateFormatted} at ${nextSlot.timeFormatted}`
                      : "No open slots found in the next 30 days"}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Summary statistics grid */}
            <Reveal delay={120}>
              <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                {[
                  {
                    icon: Award,
                    label: "Department",
                    value: departmentName,
                  },
                  {
                    icon: Award,
                    label: "Clinical Experience",
                    value: `${doctor.experience} years`,
                  },
                  {
                    icon: Clock3,
                    label: "OPD Schedule",
                    value: doctor.timing,
                  },
                  {
                    icon: CalendarCheck2,
                    label: "Consulting Days",
                    value: availableDays,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-line bg-white p-5"
                  >
                    <p className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-ink">
                      <item.icon className="h-3.5 w-3.5 text-teal" />
                      {item.label}
                    </p>
                    <p className="mt-1.5 font-display text-[0.95rem] font-bold text-navy">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Detailed sections: Qualifications, Languages, Areas of Focus */}
            <Reveal delay={160}>
              <div className="mt-6 space-y-4">
                {/* Qualifications & Education */}
                <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                  <h3 className="flex items-center gap-2 font-display text-[0.95rem] font-extrabold text-navy">
                    <GraduationCap className="h-4 w-4 text-teal" />
                    Qualifications &amp; Education
                  </h3>
                  <div className="mt-3 space-y-1.5 text-[0.85rem]">
                    <p>
                      <strong className="text-navy">Credentials: </strong>
                      {doctor.qualifications}
                    </p>
                    <p>
                      <strong className="text-navy">Medical Education: </strong>
                      {doctor.education}
                    </p>
                  </div>
                </div>

                {/* Languages Spoken */}
                <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                  <h3 className="flex items-center gap-2 font-display text-[0.95rem] font-extrabold text-navy">
                    <Languages className="h-4 w-4 text-teal" />
                    Languages Spoken
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {doctor.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded-lg border border-line bg-paper px-3 py-1 text-[0.78rem] font-semibold text-navy"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Areas of Focus */}
                <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                  <h3 className="flex items-center gap-2 font-display text-[0.95rem] font-extrabold text-navy">
                    <Sparkles className="h-4 w-4 text-teal" />
                    Areas of Focus
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {doctor.areasOfFocus.map((focus) => (
                      <span
                        key={focus}
                        className="rounded-full border border-teal/20 bg-mint px-3.5 py-1 text-[0.78rem] font-semibold text-teal-dark"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Illustrative Notice */}
              <div className="notice notice-warning mt-5 flex items-start gap-2.5">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Doctor profile, credentials, and portrait are illustrative demo representations.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/appointment?doctor=${doctor.id}`}
                  className="btn btn-primary"
                >
                  Request Appointment
                  <ArrowRight className="btn-arrow h-4 w-4" />
                </Link>
                <Link href="/doctors" className="btn btn-outline">
                  <ArrowLeft className="h-4 w-4" />
                  All Doctors
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {colleagues.length > 0 ? (
        <section className="section">
          <div className="container-site">
            <SectionHeading
              badge={departmentName}
              title="More Specialists in This Department"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {colleagues.map((colleague) => (
                <Reveal key={colleague.id}>
                  <DoctorCard
                    doctor={colleague}
                    departmentName={departmentName}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
