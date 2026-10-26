"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock3,
  Menu,
  Phone,
  ShieldAlert,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui";
import { HOSPITAL_HOURS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/departments", label: "Departments" },
  { href: "/doctors", label: "Our Doctors" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="bg-navy-deep text-[0.72rem] text-[#cfdee7]">
        <div className="container-site flex items-center justify-between gap-4 py-2">
          <span className="inline-flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-teal" />
            Fictional healthcare demonstration — not a real medical facility
          </span>
          <span className="hidden items-center gap-5 min-[560px]:inline-flex">
            <span className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> +1 (555) 010-2020
            </span>
            <span className="hidden items-center gap-2 min-[820px]:inline-flex">
              <Clock3 className="h-3.5 w-3.5" /> {HOSPITAL_HOURS.shortLabel}
            </span>
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="container-site relative flex min-h-[76px] items-center justify-between gap-6">
          <Link href="/" aria-label="MediCare Hospital home">
            <Logo />
          </Link>

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/appointment" className="btn btn-primary">
              Book Appointment
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
          </nav>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-line text-navy lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            className={`absolute inset-x-0 top-full z-50 origin-top border-b border-line bg-white shadow-[0_30px_60px_-20px_rgba(12,43,68,0.25)] transition-all duration-300 lg:hidden ${
              open
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <nav
              className="flex flex-col gap-1 px-6 py-5"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
                    isActive(item.href)
                      ? "bg-mint text-teal"
                      : "text-navy hover:bg-paper"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/appointment"
                className="btn btn-primary mt-3 justify-center"
              >
                Book Appointment
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
