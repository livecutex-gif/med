import { TriangleAlert } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="border-b border-amber-line bg-amber-soft px-4 py-2.5 text-center text-[0.72rem] font-semibold text-amber-ink">
      <span className="mx-auto inline-flex max-w-[70rem] items-start justify-center gap-2 sm:items-center">
        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0" />
        <span>
          DEMONSTRATION WEBSITE — All doctors, patients, appointments, and
          hospital details are fictional. Records now live in a shared
          PostgreSQL demo database. Never enter real patient information.
        </span>
      </span>
    </div>
  );
}
