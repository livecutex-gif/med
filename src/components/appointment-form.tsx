"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleAlert,
  Copy,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import type { Doctor } from "@/db/schema";
import {
  datePlus,
  formatDateHuman,
  today,
  WEEKDAY_LABELS,
} from "@/lib/booking";

interface Slot {
  time: string;
  label: string;
  taken: boolean;
}

type Result =
  | { kind: "success"; reference: string; summary: string }
  | { kind: "error"; message: string }
  | null;

export function AppointmentForm({
  departments,
  doctors,
  initialDepartmentId = "",
  initialDoctorId = "",
}: {
  departments: { id: string; name: string }[];
  doctors: Doctor[];
  initialDepartmentId?: string;
  initialDoctorId?: string;
}) {
  const minDate = today();
  const maxDate = datePlus(60);

  const [departmentId, setDepartmentId] = useState(initialDepartmentId);
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotNote, setSlotNote] = useState(
    "Select a doctor and date to view live availability.",
  );
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [websiteHoneypot, setWebsiteHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [copied, setCopied] = useState(false);

  const departmentDoctors = useMemo(
    () => doctors.filter((d) => d.departmentId === departmentId),
    [doctors, departmentId],
  );
  const doctor = doctors.find((d) => d.id === doctorId);

  const loadAvailability = useCallback(
    async (docId: string, selectedDate: string) => {
      setSelectedSlot("");
      setSlots([]);
      if (!docId || !selectedDate) {
        setSlotNote("Select a doctor and date to view live availability.");
        return;
      }
      setLoadingSlots(true);
      try {
        const response = await fetch(
          `/api/doctors/${docId}/availability?date=${selectedDate}`,
          { cache: "no-store" },
        );
        const data = (await response.json()) as {
          status: string;
          slots: Slot[];
        };
        if (data.status === "ok") {
          const available = data.slots.filter((s) => !s.taken);
          setSlots(data.slots);
          setSlotNote(
            available.length > 0
              ? `${available.length} of ${data.slots.length} slots available — shared in real time.`
              : "All slots are reserved for this date. Try another day.",
          );
        } else if (data.status === "off-day") {
          const doc = doctors.find((d) => d.id === docId);
          const days = doc
            ? [...doc.days]
                .sort((a, b) => a - b)
                .map((day) => WEEKDAY_LABELS[day])
                .join(", ")
            : "";
          setSlotNote(
            `No OPD session on this day. Consulting days: ${days}.`,
          );
        } else if (data.status === "out-of-range") {
          setSlotNote("Choose a date within the next 60 days.");
        } else {
          setSlotNote("Select a doctor and date to view live availability.");
        }
      } catch {
        setSlotNote("Could not load availability. Please try again.");
      } finally {
        setLoadingSlots(false);
      }
    },
    [doctors],
  );

  useEffect(() => {
    void loadAvailability(doctorId, date);
  }, [doctorId, date, loadAvailability]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setResult(null);

    if (!departmentId || !doctorId) {
      setResult({
        kind: "error",
        message: "Please select a department and doctor.",
      });
      return;
    }
    if (!selectedSlot) {
      setResult({
        kind: "error",
        message:
          "Please select an available appointment time slot.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId,
          doctorId,
          date,
          time: selectedSlot,
          name,
          phone,
          email: email.trim(),
          reason,
          website: websiteHoneypot,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        reference?: string;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        setResult({
          kind: "error",
          message:
            data.message ?? "Could not submit the request. Please try again.",
        });
        // Slot may have just been taken by someone else — refresh.
        void loadAvailability(doctorId, date);
        return;
      }

      const doctorName = doctor?.name ?? "your doctor";
      setResult({
        kind: "success",
        reference: data.reference ?? "MC-????",
        summary: `${doctorName} • ${formatDateHuman(date)} • ${slots.find((s) => s.time === selectedSlot)?.label ?? selectedSlot}`,
      });
      setName("");
      setPhone("");
      setEmail("");
      setReason("");
      setSelectedSlot("");
      void loadAvailability(doctorId, date);
    } catch {
      setResult({
        kind: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-3.5 text-[0.82rem]">
        <span className="text-ink">Already submitted an appointment request?</span>
        <Link
          href="/appointment/status"
          className="inline-flex items-center gap-1.5 font-bold text-teal hover:underline"
        >
          Check Request Status
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="notice notice-warning mb-8 flex items-start gap-2.5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <strong>Fictional demo only.</strong> Do not enter real patient
          details. An appointment request is{" "}
          <strong>not a confirmed appointment</strong> — records are stored in
          the shared demo database and reviewed by an administrator.
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate={false}>
        {/* Step 1 */}
        <div className="mb-7">
          <h3 className="mb-4 flex items-center gap-3 font-display text-[1rem] font-extrabold text-navy">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal text-[0.78rem] font-extrabold text-white">
              01
            </span>
            Choose Your Specialist
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="appt-department" className="field-label">
                Department *
              </label>
              <select
                id="appt-department"
                className="field"
                required
                value={departmentId}
                onChange={(event) => {
                  setDepartmentId(event.target.value);
                  setDoctorId("");
                }}
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="appt-doctor" className="field-label">
                Doctor *
              </label>
              <select
                id="appt-doctor"
                className="field"
                required
                value={doctorId}
                onChange={(event) => setDoctorId(event.target.value)}
                disabled={!departmentId}
              >
                <option value="">
                  {departmentId ? "Select doctor" : "Select department first"}
                </option>
                {departmentDoctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {doctor ? (
                <p className="mt-2 text-[0.72rem] text-ink">
                  OPD: {doctor.timing}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-7">
          <h3 className="mb-4 flex items-center gap-3 font-display text-[1rem] font-extrabold text-navy">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal text-[0.78rem] font-extrabold text-white">
              02
            </span>
            Select Preferred Date &amp; Time
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="appt-date" className="field-label">
                Preferred Date *
              </label>
              <input
                id="appt-date"
                type="date"
                className="field"
                required
                min={minDate}
                max={maxDate}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
              <p className="mt-2 text-[0.72rem] text-ink">
                Bookable up to 60 days ahead.
              </p>
            </div>
            <div>
              <p className="field-label flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-teal" />
                Available OPD Slots *
              </p>
              {loadingSlots ? (
                <p className="flex items-center gap-2 rounded-xl border border-line bg-paper px-4 py-3.5 text-[0.78rem] text-ink">
                  <Loader2 className="animate-spin-slow h-4 w-4 text-teal" />
                  Checking live availability…
                </p>
              ) : slots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.taken}
                      aria-pressed={selectedSlot === slot.time}
                      className={`slot ${
                        selectedSlot === slot.time ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSlot(slot.time)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-line bg-paper px-4 py-3.5 text-[0.78rem] text-ink">
                  {slotNote}
                </p>
              )}
              {slots.length > 0 ? (
                <p className="mt-2 text-[0.72rem] text-ink">{slotNote}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-3 font-display text-[1rem] font-extrabold text-navy">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal text-[0.78rem] font-extrabold text-white">
              03
            </span>
            Patient Details
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="appt-name" className="field-label">
                Patient Name *
              </label>
              <input
                id="appt-name"
                className="field"
                required
                maxLength={80}
                placeholder="Example: Demo Patient"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="appt-phone" className="field-label">
                Contact Number *
              </label>
              <input
                id="appt-phone"
                type="tel"
                className="field"
                required
                inputMode="numeric"
                pattern="[0-9]{10,15}"
                maxLength={15}
                placeholder="Example: 5550101234"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="appt-email" className="field-label">
              Email Address <span className="text-[0.74rem] font-normal text-ink">(Optional)</span>
            </label>
            <input
              id="appt-email"
              type="email"
              className="field"
              maxLength={120}
              placeholder="Example: patient@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="appt-reason" className="field-label">
              Appointment Reason *
            </label>
            <textarea
              id="appt-reason"
              className="field"
              required
              maxLength={500}
              placeholder="Example: Routine consultation. Do not provide actual medical information."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>
        </div>

        {/* Hidden honeypot field to trap spam bots */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="appt-website">Website</label>
          <input
            id="appt-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={websiteHoneypot}
            onChange={(e) => setWebsiteHoneypot(e.target.value)}
          />
        </div>

        {result?.kind === "success" ? (
          <div
            className="notice mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/90 p-5 text-emerald-950 sm:p-6"
            role="status"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div className="flex-1">
                <span className="text-[0.74rem] font-bold uppercase tracking-[0.08em] text-emerald-800">
                  Appointment Request Received
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="font-display text-2xl font-black tracking-wide text-navy">
                    {result.reference}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(result.reference);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2500);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1 text-[0.75rem] font-bold text-navy transition-colors hover:bg-paper"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-teal" />
                        Copy Reference ID
                      </>
                    )}
                  </button>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[0.72rem] font-bold text-amber-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Status: Pending
                  </span>
                </div>
                <p className="mt-3 text-[0.84rem] text-navy/85">
                  {result.summary}
                </p>
                <p className="mt-2.5 border-t border-emerald-200/70 pt-2 text-[0.8rem] font-medium text-emerald-900">
                  Status: Pending means your request has been received and is awaiting staff confirmation in the hospital system.
                </p>
                <div className="mt-3.5">
                  <Link
                    href="/appointment/status"
                    className="inline-flex items-center gap-1.5 text-[0.82rem] font-bold text-teal hover:underline"
                  >
                    Check Request Status with Reference ID
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {result?.kind === "error" ? (
          <div
            className="notice notice-error mb-6 flex items-start gap-3"
            role="alert"
          >
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{result.message}</span>
          </div>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary !px-8 !py-4"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin-slow h-4 w-4" />
              Submitting Request…
            </>
          ) : (
            <>
              Submit Appointment Request
              <ArrowRight className="btn-arrow h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
