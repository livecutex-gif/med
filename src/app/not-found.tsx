import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass, Stethoscope, UserRound } from "lucide-react";

export default function NotFound() {
  return (
    <section className="page-hero-mesh relative overflow-hidden py-24 sm:py-32">
      <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="container-site relative flex flex-col items-center justify-center text-center">
        <span className="icon-tile mx-auto !h-20 !w-20 !rounded-3xl shadow-sm">
          <Compass className="h-9 w-9 text-teal" />
        </span>
        <span className="badge mt-6 !border-teal/20 bg-mint text-teal-dark">
          Error 404
        </span>
        <h1 className="display mt-4 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold text-navy">
          Page Not Found
        </h1>
        <p className="mt-3 max-w-[30rem] text-[0.98rem] leading-relaxed text-ink">
          The page or specialist profile you are looking for doesn&apos;t exist,
          has been moved, or the link is outdated.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary !px-6 !py-3.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link href="/doctors" className="btn btn-outline !px-6 !py-3.5">
            <UserRound className="h-4 w-4" />
            Our Doctors
          </Link>
          <Link href="/appointment" className="btn btn-outline !px-6 !py-3.5">
            <Stethoscope className="h-4 w-4" />
            Book Appointment
            <ArrowRight className="btn-arrow h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
