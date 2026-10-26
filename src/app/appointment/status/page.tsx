"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Loader2,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { Badge, PageHero } from "@/components/ui";

interface AppointmentResult {
  reference: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  date: string;
  dateFormatted: string;
  time: string;
  timeFormatted: string;
  doctorName: string;
  departmentName: string;
  createdAt: string;
}

export default function AppointmentStatusPage() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<AppointmentResult | null>(null);

  async function handleLookup(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setAppointment(null);

    const ref = reference.trim();
    const ph = phone.trim();

    if (!ref || !ph) {
      setError("Please enter both Reference ID and contact number.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/appointments/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref, phone: ph }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message || "No matching request found.");
      } else {
        setAppointment(data.appointment);
      }
    } catch {
      setError("No matching request found.");
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: AppointmentResult["status"]) {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-[0.75rem] font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Confirmed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1 text-[0.75rem] font-bold text-rose-800">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Cancelled
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 px-3.5 py-1 text-[0.75rem] font-bold text-sky-800">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Completed
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-[0.75rem] font-bold text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        );
    }
  }

  return (
    <>
      <PageHero
        badge="Track Request"
        title="Check Appointment Status"
        description="Enter your booking Reference ID and the phone number used during registration to verify your appointment status."
      />

      <section className="section bg-paper">
        <div className="container-site max-w-[680px]">
          <div className="card p-7 sm:p-10">
            <form onSubmit={handleLookup} className="space-y-6">
              <div>
                <label htmlFor="status-ref" className="field-label">
                  Reference ID *
                </label>
                <input
                  id="status-ref"
                  type="text"
                  required
                  placeholder="e.g. MC-1001"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="field uppercase tracking-wider"
                />
                <p className="mt-1.5 text-[0.74rem] text-ink">
                  Found on your booking confirmation screen (e.g. MC-1001).
                </p>
              </div>

              <div>
                <label htmlFor="status-phone" className="field-label">
                  Contact Phone Number *
                </label>
                <input
                  id="status-phone"
                  type="tel"
                  required
                  placeholder="e.g. 5550101234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field"
                />
                <p className="mt-1.5 text-[0.74rem] text-ink">
                  The exact phone number entered during booking (verification check).
                </p>
              </div>

              {error ? (
                <div
                  className="notice notice-error flex items-start gap-3"
                  role="alert"
                >
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center !py-3.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin-slow h-4 w-4" />
                    Checking Status…
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Check Request Status
                  </>
                )}
              </button>
            </form>

            {appointment ? (
              <div className="mt-8 border-t border-line pt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[0.74rem] font-bold uppercase tracking-[0.08em] text-ink">
                      Reference Code
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-navy">
                      {appointment.reference}
                    </h3>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-paper p-4">
                    <p className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-ink">
                      <User className="h-3.5 w-3.5 text-teal" />
                      Consulting Doctor
                    </p>
                    <p className="mt-1 font-display text-[0.95rem] font-bold text-navy">
                      {appointment.doctorName}
                    </p>
                    <p className="text-[0.78rem] text-ink">
                      {appointment.departmentName}
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-paper p-4">
                    <p className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-ink">
                      <CalendarDays className="h-3.5 w-3.5 text-teal" />
                      Scheduled Slot
                    </p>
                    <p className="mt-1 font-display text-[0.95rem] font-bold text-navy">
                      {appointment.dateFormatted}
                    </p>
                    <p className="flex items-center gap-1.5 text-[0.78rem] text-ink">
                      <Clock3 className="h-3 w-3 text-teal" />
                      {appointment.timeFormatted}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-teal/20 bg-mint p-4 text-[0.82rem] text-teal-dark">
                  <p className="font-semibold">
                    {appointment.status === "Pending"
                      ? "What does Pending mean?"
                      : appointment.status === "Confirmed"
                        ? "What does Confirmed mean?"
                        : "Appointment Notice"}
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {appointment.status === "Pending" &&
                      "Status: Pending means your request has been received and is currently in the hospital queue awaiting administrator review and confirmation."}
                    {appointment.status === "Confirmed" &&
                      "Your request has been approved by the hospital department. Please arrive 15 minutes before your scheduled slot."}
                    {appointment.status === "Cancelled" &&
                      "This appointment request has been cancelled. Please book another slot or contact reception for assistance."}
                    {appointment.status === "Completed" &&
                      "This consultation has been marked completed by hospital administration."}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between border-t border-line pt-6 text-[0.82rem]">
              <Link
                href="/appointment"
                className="flex items-center gap-1.5 font-semibold text-teal hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Book another appointment
              </Link>
              <Link
                href="/contact"
                className="text-ink hover:text-navy hover:underline"
              >
                Need help? Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
