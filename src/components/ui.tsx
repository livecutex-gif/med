import type { ReactNode } from "react";
import { Cross } from "lucide-react";
import { Reveal } from "@/components/reveal";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal text-white shadow-[0_10px_24px_-8px_rgba(10,126,130,0.7)]">
        <Cross className="h-6 w-6" strokeWidth={2.5} />
      </span>
      <span
        className={`font-display text-[1.35rem] font-extrabold leading-none tracking-tight ${
          light ? "text-white" : "text-navy"
        }`}
      >
        MediCare
        <span className="mt-0.5 block text-[0.55rem] font-bold tracking-[0.32em] text-teal">
          HOSPITAL
        </span>
      </span>
    </span>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
}: {
  badge: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal>
      <div
        className={
          align === "center"
            ? "mx-auto mb-14 max-w-[44rem] text-center"
            : "mb-12 max-w-[44rem]"
        }
      >
        <Badge>{badge}</Badge>
        <h2 className="display mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold">
          {title}
        </h2>
        {description ? <p className="mt-4 text-[0.95rem]">{description}</p> : null}
      </div>
    </Reveal>
  );
}

export function PageHero({
  badge,
  title,
  description,
  children,
}: {
  badge: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero-mesh relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="container-site relative pb-16 pt-20">
        <span className="badge">{badge}</span>
        <h1 className="display mt-5 max-w-[46rem] text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-[40rem] text-[0.95rem]">{description}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
