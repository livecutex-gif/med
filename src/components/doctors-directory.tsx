"use client";

import { useMemo, useState } from "react";
import { Search, UserRoundSearch } from "lucide-react";
import type { Department, Doctor } from "@/db/schema";
import { DoctorCard } from "@/components/doctor-card";

export function DoctorsDirectory({
  departments,
  doctors,
  initialFilter = "all",
}: {
  departments: Department[];
  doctors: Doctor[];
  initialFilter?: string;
}) {
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState("");

  const departmentNames = useMemo(
    () => new Map(departments.map((d) => [d.id, d.name])),
    [departments],
  );

  const filtered = doctors.filter((doctor) => {
    const matchesDepartment =
      filter === "all" || doctor.departmentId === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      doctor.name.toLowerCase().includes(query) ||
      doctor.role.toLowerCase().includes(query) ||
      (departmentNames.get(doctor.departmentId) ?? "")
        .toLowerCase()
        .includes(query);
    return matchesDepartment && matchesSearch;
  });

  return (
    <>
      <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Doctors
          </button>
          {departments.map((department) => (
            <button
              key={department.id}
              type="button"
              className={`filter-btn ${filter === department.id ? "active" : ""}`}
              onClick={() => setFilter(department.id)}
            >
              {department.name}
            </button>
          ))}
        </div>

        <label className="relative block lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9db0bd]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or specialty…"
            aria-label="Search doctors"
            className="field !pl-10"
          />
        </label>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              departmentName={departmentNames.get(doctor.departmentId) ?? ""}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.4rem] border border-dashed border-line bg-white px-6 py-16 text-center">
          <UserRoundSearch className="mx-auto h-10 w-10 text-teal/40" />
          <h3 className="mt-4 font-display text-lg font-bold text-navy">
            No doctors match your search
          </h3>
          <p className="mt-1 text-[0.84rem]">
            Try a different name, specialty, or department filter.
          </p>
        </div>
      )}
    </>
  );
}
