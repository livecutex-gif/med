import Link from "next/link";
import { AlertOctagon, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui";
import { DEPARTMENTS, HOSPITAL_HOURS } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Hospital" },
  { href: "/doctors", label: "Find a Doctor" },
  { href: "/appointment", label: "Appointments" },
  { href: "/appointment/status", label: "Check Request Status" },
  { href: "/faq", label: "FAQ" },
  { href: "/admin", label: "Admin Demo" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep pb-8 pt-20 text-[#b7cbd6]">
      <div className="container-site">
        {/* Emergency Information Strip */}
        <div className="mb-14 flex items-center gap-3 rounded-2xl border border-rose-900/60 bg-rose-950/40 px-5 py-3.5 text-[0.82rem] text-rose-200/90">
          <AlertOctagon className="h-4 w-4 shrink-0 text-rose-400" />
          <span>
            For medical emergencies, call your local emergency number immediately. This website is not for emergency use.
          </span>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">
          <div>
            <Link href="/" aria-label="MediCare Hospital home">
              <Logo light />
            </Link>
            <p className="mt-6 max-w-[26rem] text-[0.85rem] leading-relaxed">
              A fictional hospital demonstrating how thoughtful technology can
              make healthcare administration simpler, calmer, and more
              accessible.
            </p>
            <p className="mt-3 text-[0.85rem] font-semibold text-white/80">
              Compassionate care. Modern medicine.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h3 className="mb-6 font-display text-[0.95rem] font-bold text-white">
              Quick Links
            </h3>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="mb-3 block w-fit text-[0.82rem] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Departments">
            <h3 className="mb-6 font-display text-[0.95rem] font-bold text-white">
              Departments
            </h3>
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.slug}
                href={`/doctors?department=${dept.slug}`}
                className="mb-3 block w-fit text-[0.82rem] transition-colors hover:text-white"
              >
                {dept.name}
              </Link>
            ))}
          </nav>

          <div>
            <h3 className="mb-6 font-display text-[0.95rem] font-bold text-white">
              Get In Touch
            </h3>
            <p className="mb-4 flex items-start gap-3 text-[0.82rem]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              125 Wellness Avenue, Demo City, DC 00000
            </p>
            <p className="mb-4 flex items-center gap-3 text-[0.82rem]">
              <Phone className="h-4 w-4 shrink-0 text-teal" /> +1 (555) 010-2020
            </p>
            <p className="mb-4 flex items-center gap-3 text-[0.82rem]">
              <Mail className="h-4 w-4 shrink-0 text-teal" />
              hello@medicare.example
            </p>
            <p className="flex items-start gap-3 text-[0.82rem]">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              <span>
                {HOSPITAL_HOURS.label}
                <br />
                {HOSPITAL_HOURS.sundayLabel}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.75rem] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>© 2026 MediCare Hospital. Fictional demonstration · Photos by Pexels.</span>
            <Link href="/privacy" className="text-white/70 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/70 transition-colors hover:text-white">
              Terms of Use
            </Link>
          </div>
          <span className="text-white/60">
            Every doctor, patient, and record shown here is invented. Portfolio
            demo — not a medical service.
          </span>
        </div>
      </div>
    </footer>
  );
}
