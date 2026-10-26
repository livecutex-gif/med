"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarX2,
  ClipboardList,
  Cross,
  Database,
  Inbox,
  Loader2,
  LogOut,
  MailOpen,
  RotateCcw,
  Search,
  ShieldAlert,
} from "lucide-react";
import {
  APPOINTMENT_STATUSES,
  formatDateHuman,
  timeLabel,
} from "@/lib/booking";

interface ClientAppointment {
  id: number;
  reference: string | null;
  name: string;
  phone: string;
  doctorId: string;
  departmentId: string;
  doctorName: string;
  departmentName: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface ClientEnquiry {
  id: number;
  reference: string | null;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

type Tab = "appointments" | "enquiries";

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("appointments");
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [enquiries, setEnquiries] = useState<ClientEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [resetting, setResetting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshedAt, setRefreshedAt] = useState("");

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const response = await fetch("/api/admin/data", { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!response.ok) throw new Error("request failed");
      const data = (await response.json()) as {
        appointments: ClientAppointment[];
        enquiries: ClientEnquiry[];
      };
      setAppointments(data.appointments);
      setEnquiries(data.enquiries);
      setRefreshedAt(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    } catch {
      setLoadError("Could not load demo records. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const count = (status: string) =>
      appointments.filter((a) => a.status === status).length;
    return {
      total: appointments.length,
      pending: count("Pending"),
      confirmed: count("Confirmed"),
      cancelled: count("Cancelled"),
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return appointments.filter((a) => {
      const haystack = [
        a.reference ?? "",
        a.name,
        a.phone,
        a.doctorName,
        a.departmentName,
      ]
        .join(" ")
        .toLowerCase();
      return (
        haystack.includes(query) &&
        (statusFilter === "all" || a.status === statusFilter)
      );
    });
  }, [appointments, search, statusFilter]);

  async function patchJson(url: string, body: unknown): Promise<string | null> {
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      return response.ok && data.ok ? null : data.message ?? "Action failed.";
    } catch {
      return "Network error. Please try again.";
    }
  }

  async function updateAppointmentStatus(id: number, status: string) {
    setActionError("");
    setUpdatingId(id);
    const error = await patchJson(`/api/admin/appointments/${id}`, { status });
    setUpdatingId(null);
    if (error) {
      setActionError(error);
    }
    await load();
  }

  async function toggleEnquiry(enquiry: ClientEnquiry) {
    setActionError("");
    setUpdatingId(enquiry.id);
    const next = enquiry.status === "New" ? "Resolved" : "New";
    const error = await patchJson(`/api/admin/enquiries/${enquiry.id}`, {
      status: next,
    });
    setUpdatingId(null);
    if (error) {
      setActionError(error);
    }
    await load();
  }

  async function resetDemo() {
    if (!window.confirm("This will delete all records. Continue?")) {
      return;
    }
    setActionError("");
    setResetting(true);
    try {
      const response = await fetch("/api/admin/reset", { method: "POST" });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
      } | null;
      if (!response.ok || !data?.ok) {
        if (response.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        setActionError(data?.message ?? "Could not reset the demo data.");
      }
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setResetting(false);
    }
    setSearch("");
    setStatusFilter("all");
    await load();
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/admin/login";
    }
  }

  return (
    <div className="admin-layout overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_30px_70px_-35px_rgba(12,43,68,0.35)] lg:grid lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="grain relative bg-navy p-5 text-white lg:min-h-[640px]">
        <p className="mb-6 flex items-center gap-2.5 px-2 font-display text-[1rem] font-extrabold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal">
            <Cross className="h-4 w-4" strokeWidth={2.5} />
          </span>
          MediCare Admin
        </p>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {(
            [
              { key: "appointments", label: "Appointments", icon: Inbox },
              { key: "enquiries", label: "Enquiries", icon: MailOpen },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-[0.82rem] font-bold transition-colors lg:w-full ${
                tab === item.key
                  ? "bg-teal text-white"
                  : "text-[#d5e3ec] hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.key === "appointments" && stats.pending > 0 ? (
                <span className="ml-auto rounded-full bg-amber-300/90 px-2 py-0.5 text-[0.64rem] font-extrabold text-navy">
                  {stats.pending}
                </span>
              ) : null}
              {item.key === "enquiries" &&
              enquiries.some((e) => e.status === "New") ? (
                <span className="ml-auto rounded-full bg-amber-300/90 px-2 py-0.5 text-[0.64rem] font-extrabold text-navy">
                  {enquiries.filter((e) => e.status === "New").length}
                </span>
              ) : null}
            </button>
          ))}
          <button
            type="button"
            onClick={resetDemo}
            disabled={resetting}
            className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-[0.82rem] font-bold text-[#d5e3ec] transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 lg:w-full"
          >
            {resetting ? (
              <Loader2 className="animate-spin-slow h-4 w-4" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Reset Demo Data
          </button>
        </div>
        <p className="mt-8 hidden items-start gap-2 rounded-xl bg-white/5 px-4 py-3.5 text-[0.68rem] leading-relaxed text-white/50 lg:flex">
          <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Records persist in the shared PostgreSQL demo database — visible from
          any device.
        </p>
      </aside>

      {/* Content */}
      <div className="min-w-0 bg-paper p-5 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[1.35rem] font-extrabold text-navy">
              Dashboard Overview
            </h2>
            <p className="text-[0.74rem] text-ink">
              Fictional demo records
              {refreshedAt ? ` • refreshed ${refreshedAt}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void load();
              }}
              className="btn btn-outline btn-small"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline btn-small text-red-600 hover:border-red-600 hover:bg-red-50"
              title="Logout from admin session"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>

        {actionError ? (
          <div className="notice notice-error mt-5 flex items-start gap-2.5" role="alert">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {actionError}
          </div>
        ) : null}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3.5 xl:grid-cols-4">
          {[
            { label: "Total Requests", value: stats.total, tone: "text-navy" },
            { label: "Pending", value: stats.pending, tone: "text-[#b07d10]" },
            { label: "Confirmed", value: stats.confirmed, tone: "text-[#157a4b]" },
            { label: "Cancelled", value: stats.cancelled, tone: "text-[#b44141]" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-ink">
                {stat.label}
              </span>
              <strong
                className={`mt-1 block font-display text-[1.9rem] font-extrabold ${stat.tone}`}
              >
                {loading ? "–" : stat.value}
              </strong>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-line bg-white px-6 py-12 text-[0.85rem] text-ink">
            <Loader2 className="animate-spin-slow h-5 w-5 text-teal" />
            Loading demo records…
          </div>
        ) : loadError ? (
          <div className="notice notice-error mt-7">{loadError}</div>
        ) : tab === "appointments" ? (
          <div className="mt-7">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9db0bd]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search ref, patient, doctor…"
                  aria-label="Search appointments"
                  className="field !pl-10"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter appointment status"
                className="field sm:max-w-[200px]"
              >
                <option value="all">All Statuses</option>
                {APPOINTMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line bg-white">
              {filteredAppointments.length > 0 ? (
                <table className="table-shell">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date &amp; Time</th>
                      <th>Status</th>
                      <th>Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="font-bold text-teal">
                          {appointment.reference ?? `#${appointment.id}`}
                        </td>
                        <td>
                          <strong className="text-navy">
                            {appointment.name}
                          </strong>
                          <br />
                          <span className="text-[0.72rem] text-ink">
                            {appointment.phone}
                          </span>
                        </td>
                        <td>
                          {appointment.doctorName}
                          <br />
                          <span className="text-[0.72rem] text-ink">
                            {appointment.departmentName}
                          </span>
                        </td>
                        <td>
                          {formatDateHuman(appointment.date)}
                          <br />
                          <span className="text-[0.72rem] text-ink">
                            {timeLabel(appointment.time)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status status-${appointment.status.toLowerCase()}`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="field !w-[138px] !px-2.5 !py-1.5 !text-[0.76rem]"
                            value={appointment.status}
                            disabled={updatingId === appointment.id}
                            aria-label={`Update status for ${appointment.reference ?? appointment.id}`}
                            onChange={(event) =>
                              void updateAppointmentStatus(
                                appointment.id,
                                event.target.value,
                              )
                            }
                          >
                            {APPOINTMENT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-14 text-center">
                  <CalendarX2 className="mx-auto h-9 w-9 text-teal/40" />
                  <h3 className="mt-3 font-display text-[1rem] font-bold text-navy">
                    No matching appointments
                  </h3>
                  <p className="mt-1 text-[0.8rem]">
                    Try another search term or status filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-7">
            <div className="overflow-x-auto rounded-2xl border border-line bg-white">
              {enquiries.length > 0 ? (
                <table className="table-shell">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enquiry) => (
                      <tr key={enquiry.id}>
                        <td className="font-bold text-teal">
                          {enquiry.reference ?? `#${enquiry.id}`}
                        </td>
                        <td className="font-bold text-navy">{enquiry.name}</td>
                        <td>
                          {enquiry.phone}
                          <br />
                          <span className="text-[0.72rem] text-ink">
                            {enquiry.email}
                          </span>
                        </td>
                        <td className="max-w-[280px]">{enquiry.message}</td>
                        <td>
                          <span
                            className={`status ${
                              enquiry.status === "New"
                                ? "status-pending"
                                : "status-confirmed"
                            }`}
                          >
                            {enquiry.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline btn-small"
                            disabled={updatingId === enquiry.id}
                            onClick={() => void toggleEnquiry(enquiry)}
                          >
                            {updatingId === enquiry.id ? (
                              <Loader2 className="animate-spin-slow h-3.5 w-3.5" />
                            ) : null}
                            {enquiry.status === "New"
                              ? "Mark Resolved"
                              : "Reopen"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-14 text-center">
                  <ClipboardList className="mx-auto h-9 w-9 text-teal/40" />
                  <h3 className="mt-3 font-display text-[1rem] font-bold text-navy">
                    No enquiries yet
                  </h3>
                  <p className="mt-1 text-[0.8rem]">
                    New fictional enquiries will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
