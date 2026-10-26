"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setError(data.message ?? "Invalid administrator password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        badge="Staff Portal"
        title="Admin Dashboard Login"
        description="Enter the administrator password to manage appointments, slot bookings, and patient enquiries."
      />
      <section className="section bg-paper">
        <div className="container-site max-w-md">
          <div className="panel shadow-[0_20px_50px_-20px_rgba(12,43,68,0.2)]">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-[1.15rem] font-extrabold text-navy">
                  Administrator Access
                </h2>
                <p className="text-[0.75rem] text-ink">
                  Authorized hospital demo staff only
                </p>
              </div>
            </div>

            {error ? (
              <div
                className="notice notice-error mb-5 flex items-start gap-2.5 text-[0.8rem]"
                role="alert"
              >
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="admin-password" className="field-label">
                  Admin Password *
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full !py-3.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin-slow h-4 w-4" />
                    Authenticating…
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
