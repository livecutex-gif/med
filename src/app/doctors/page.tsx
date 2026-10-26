import type { Metadata } from "next";
import { getDepartments, getDoctors } from "@/lib/queries";
import { DoctorsDirectory } from "@/components/doctors-directory";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Doctors",
  description:
    "Explore fictional specialist profiles, experience, and consultation schedules.",
};

export const dynamic = "force-dynamic";

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>;
}) {
  const { department } = await searchParams;
  const [departments, doctors] = await Promise.all([
    getDepartments(),
    getDoctors(),
  ]);

  const initialFilter = departments.some((d) => d.id === department)
    ? department!
    : "all";

  return (
    <>
      <PageHero
        badge="Meet Our Specialists"
        title="Find Your Doctor"
        description="Explore specialist profiles, experience, and consultation schedules — then request an appointment in one click."
      />
      <section className="section bg-paper">
        <div className="container-site">
          <DoctorsDirectory
            key={initialFilter}
            departments={departments}
            doctors={doctors}
            initialFilter={initialFilter}
          />
        </div>
      </section>
    </>
  );
}
