import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of service for the MediCare Hospital demonstration application. Outlines educational usage rules, demo limitations, and liability disclaimers for visitors.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        badge="Legal & Safety"
        title="Terms of Use"
        description="Terms and conditions governing the access and exploration of this demonstration healthcare web application."
      />

      <section className="section bg-paper">
        <div className="container-site max-w-[800px]">
          <div className="notice notice-warning mb-8 flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <strong className="block text-amber-950">
                Demonstration Site Notice
              </strong>
              <span className="mt-1 block text-amber-900 leading-relaxed text-[0.85rem]">
                MediCare Hospital is a non-commercial software simulation and
                portfolio demonstration. It does not provide medical services,
                licensed consultations, or emergency care under any circumstances.
              </span>
            </div>
          </div>

          <div className="card space-y-8 p-8 sm:p-12">
            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                1. Educational &amp; Portfolio Use Only
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                This web application is provided solely for educational, portfolio,
                and technical evaluation purposes. All doctor profiles, specialty
                listings, clinic hours, appointment slots, and patient feedback
                are illustrative demonstration assets.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                2. No Medical Advice or Emergency Care
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                Nothing on this site, including automated assistant responses,
                constitutes medical advice, diagnosis, triage, or clinical
                guidance. For medical emergencies, always dial your local emergency
                number immediately. Never rely on this demo website for healthcare
                decisions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                3. Demonstration Appointment Requests
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                Submitting an appointment request generates a demonstration
                reference number and stores the request as &quot;Pending&quot; in a
                shared database. These entries do not represent real-world medical
                bookings or contractual commitments of any kind.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                4. Acceptable Conduct
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                Visitors agree not to submit offensive, illegal, or malicious
                content, nor attempt to disrupt or abuse database endpoints or
                administrative routes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                5. Limitation of Liability &amp; Disclaimers
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                This website is provided on an &quot;as is&quot; and &quot;as
                available&quot; basis without warranties of any kind. The creators
                expressly disclaim all liability for any direct, indirect, or
                consequential damages arising from the use or inability to use this
                demonstration site.
              </p>
            </section>

            <div className="border-t border-line pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-bold text-teal hover:underline text-[0.86rem]"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
