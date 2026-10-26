import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDepartments, getDoctors } from "@/lib/queries";
import { DepartmentIcon } from "@/components/department-icon";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Departments",
  description:
    "Find the right department and explore available specialists and their OPD schedules.",
};

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const [departments, doctors] = await Promise.all([
    getDepartments(),
    getDoctors(),
  ]);

  const doctorCount = new Map<string, number>();
  for (const doctor of doctors) {
    doctorCount.set(
      doctor.departmentId,
      (doctorCount.get(doctor.departmentId) ?? 0) + 1,
    );
  }

  return (
    <>
      <PageHero
        badge="Medical Specialties"
        title="Our Medical Departments"
        description="Find the right department, meet its specialists, and request an appointment that fits their real OPD schedule."
      />

      <section className="section bg-paper">
        <div className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((department, index) => (
            <Reveal key={department.id} delay={(index % 3) * 80}>
              <article className="card group flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <div className="icon-tile">
                    <DepartmentIcon icon={department.icon} className="h-6 w-6" />
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-all group-hover:border-teal group-hover:bg-teal group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[1.15rem] font-extrabold text-navy">
                  {department.name}
                </h3>
                <p className="mt-2 flex-1 text-[0.84rem]">
                  {department.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-[0.74rem] font-bold uppercase tracking-[0.08em] text-teal">
                    {`${doctorCount.get(department.id) ?? 0} ${(doctorCount.get(department.id) ?? 0) === 1 ? "Specialist" : "Specialists"}`}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/doctors?department=${department.id}`}
                      className="btn btn-outline btn-small"
                    >
                      Doctors
                    </Link>
                    <Link
                      href={`/appointment?department=${department.id}`}
                      className="btn btn-primary btn-small"
                    >
                      Book
                      <ArrowRight className="btn-arrow h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
