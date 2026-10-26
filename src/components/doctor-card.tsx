import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Clock3 } from "lucide-react";
import type { Doctor } from "@/db/schema";

export function DoctorCard({
  doctor,
  departmentName,
}: {
  doctor: Doctor;
  departmentName: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_-20px_rgba(12,43,68,0.25)]">
      <div className="relative h-[250px] overflow-hidden bg-[#e9f1f2]">
        <Image
          src={doctor.image}
          alt={`Portrait of ${doctor.name}`}
          width={800}
          height={1200}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="badge absolute left-4 top-4 !border-white/60 bg-white/90 backdrop-blur">
          {departmentName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[1.1rem] font-extrabold text-navy">
          {doctor.name}
        </h3>
        <p className="mt-0.5 text-[0.8rem] font-medium">{doctor.role}</p>

        <div className="mt-4 space-y-2 border-t border-line pt-4 text-[0.76rem]">
          <p className="flex items-center gap-2.5">
            <Award className="h-3.5 w-3.5 text-teal" />
            {doctor.experience} years experience
          </p>
          <p className="flex items-center gap-2.5">
            <Clock3 className="h-3.5 w-3.5 text-teal" />
            {doctor.timing}
          </p>
        </div>

        <div className="mt-5 flex gap-2.5 pt-1">
          <Link
            href={`/appointment?doctor=${doctor.id}`}
            className="btn btn-primary btn-small flex-1"
          >
            Book
            <ArrowRight className="btn-arrow h-3.5 w-3.5" />
          </Link>
          <Link href={`/doctors/${doctor.id}`} className="btn btn-outline btn-small">
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
