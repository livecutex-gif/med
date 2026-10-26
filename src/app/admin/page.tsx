import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Admin Demo",
  description:
    "Manage fictional appointment requests and administrative enquiries in the demo dashboard.",
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <PageHero
        badge="Demo Management Portal"
        title="Hospital Admin Dashboard"
        description="Manage fictional appointment requests, review live slot usage, and respond to patient enquiries."
      />
      <section className="section bg-paper">
        <div className="container-site">
          <Reveal>
            <div className="notice notice-warning mb-7 flex items-start gap-2.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Protected demonstration dashboard.</strong> Password authentication
                is required to access this dashboard and perform administrative actions.
                All records are fictional and stored in PostgreSQL. Server-side authorization
                and secure session cookies are enforced.
              </span>
            </div>
            <AdminDashboard />
          </Reveal>
        </div>
      </section>
    </>
  );
}
