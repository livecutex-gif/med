"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { getHospitalOpdStatus, type OpdStatus } from "@/lib/constants";

export function OpdStatusBadge({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<OpdStatus>(() => getHospitalOpdStatus());

  useEffect(() => {
    setMounted(true);
    setStatus(getHospitalOpdStatus());
    const interval = setInterval(() => {
      setStatus(getHospitalOpdStatus());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const isOpen = mounted ? status.isOpen : true;
  const headline = mounted ? status.badgeDetail : "OPD Schedule";
  const subtitle = mounted ? status.statusText : "Mon–Sat: 8:00 AM – 8:00 PM";

  return (
    <div
      className={`animate-float-slow absolute -right-2 top-8 hidden items-center gap-3 rounded-2xl bg-white/95 p-3.5 pr-5 shadow-[0_20px_50px_-15px_rgba(12,43,68,0.3)] ring-1 ring-line backdrop-blur sm:flex ${className}`}
    >
      <span
        className={`icon-tile !h-10 !w-10 !rounded-xl text-white transition-colors duration-300 ${
          isOpen ? "!bg-teal" : "!bg-navy/70"
        }`}
      >
        <Clock3 className="h-4.5 w-4.5" />
      </span>
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block h-2 w-2 rounded-full transition-colors duration-300 ${
              isOpen
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            }`}
            aria-hidden="true"
          />
          <strong className="block font-display text-[0.82rem] font-bold text-navy">
            {headline}
          </strong>
        </div>
        <small
          className={`block text-[0.68rem] transition-colors duration-300 ${
            isOpen ? "text-ink" : "font-semibold text-amber-700"
          }`}
        >
          {subtitle}
        </small>
      </div>
    </div>
  );
}
