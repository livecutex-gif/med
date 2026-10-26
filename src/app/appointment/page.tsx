import type { Metadata } from "next";
import { getDepartments, getDoctors } from "@/lib/queries";
import { AppointmentForm } from "@/components/appointment-form";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Select your doctor and preferred time. Requests remain pending until reviewed by hospital administration.",
};

export const dynamic = "force-dynamic";

export default async function AppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ doctor?: string; department?: string }>;
}) {
  const { doctor: doctorParam, department: departmentParam } =
    await searchParams;
  const [departments, doctors] = await Promise.all([
    getDepartments(),
    getDoctors(),
  ]);

  const initialDoctor = doctors.find((d) => d.id === doctorParam);
  const initialDepartment = departments.find(
    (d) => d.id === (initialDoctor?.departmentId ?? departmentParam),
  );

  return (
    <>
      <PageHero
        badge="Online Appointment"
        title="Request an Appointment"
        description="Select your doctor and preferred time slot from live availability. Requests remain Pending until reviewed by the demo administration team."
      />
      <section className="section bg-paper">
        <div className="container-site max-w-[880px]">
          <AppointmentForm
            departments={departments.map((d) => ({ id: d.id, name: d.name }))}
            doctors={doctors}
            initialDoctorId={initialDoctor?.id ?? ""}
            initialDepartmentId={initialDepartment?.id ?? ""}
          />
        </div>
      </section>
    </>
  );
}
