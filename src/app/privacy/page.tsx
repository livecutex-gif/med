import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy notice for the MediCare Hospital demonstration website. Learn how demo form data is stored in PostgreSQL and why real patient data must not be submitted.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        badge="Legal & Safety"
        title="Privacy Policy"
        description="Important privacy disclosure and data handling information for visitors to this demonstration hospital web application."
      />

      <section className="section bg-paper">
        <div className="container-site max-w-[800px]">
          <div className="notice notice-warning mb-8 flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <strong className="block text-amber-950">
                Demonstration Website Notice
              </strong>
              <span className="mt-1 block text-amber-900 leading-relaxed text-[0.85rem]">
                This is an illustrative demonstration website built for portfolio
                and technical evaluation purposes. It is not an operational
                healthcare provider or medical facility. Do not submit genuine,
                confidential, or personal medical information anywhere on this site.
              </span>
            </div>
          </div>

          <div className="card space-y-8 p-8 sm:p-12">
            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                1. What Information This Application Collects
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                When you interact with the interactive demo features (such as
                submitting an appointment request or contact enquiry), the
                application accepts text inputs including names, phone numbers,
                optional email addresses, preferred dates, times, and message
                reasons.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                2. How Data Is Stored &amp; Shared
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                All form submissions are stored in a shared demonstration
                PostgreSQL database. Because this is a public demonstration,
                records submitted through the forms are visible to anyone viewing
                the administrative dashboard demo. While endpoints are rate-limited
                and protected against basic spam bots, the database is intentionally
                a shared sandbox.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                3. Data Deletion and Database Resets
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                All submitted records may be reset, deleted, or purged at any time
                without notice via the administrative demo reset button or automated
                maintenance procedures. We do not maintain backups of submitted
                demo entries.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                4. Cookies &amp; Local Storage
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                The application sets essential session cookies strictly for
                authenticated administrative demonstration access (e.g. the admin
                session token). No third-party tracking, advertising, or cross-site
                analytics cookies are used.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-extrabold text-navy">
                5. Limitation of Liability
              </h2>
              <p className="text-[0.9rem] leading-relaxed text-ink">
                The authors and operators of this demonstration project accept no
                liability for any unintended disclosure or loss of information
                submitted to this application in contravention of these stated demo
                guidelines.
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
