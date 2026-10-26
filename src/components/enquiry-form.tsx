"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Loader2 } from "lucide-react";

type Result =
  | { kind: "success"; reference: string }
  | { kind: "error"; message: string }
  | null;

export function EnquiryForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [websiteHoneypot, setWebsiteHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setResult(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message, website: websiteHoneypot }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        reference?: string;
        message?: string;
      };
      if (!response.ok || !data.ok) {
        setResult({
          kind: "error",
          message: data.message ?? "Could not send the enquiry.",
        });
        return;
      }
      setResult({ kind: "success", reference: data.reference ?? "ENQ-????" });
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setWebsiteHoneypot("");
    } catch {
      setResult({ kind: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <h3 className="font-display text-[1.15rem] font-extrabold text-navy">
        Send an Enquiry
      </h3>
      <p className="mb-7 mt-1.5 text-[0.8rem] text-ink">
        Administrative enquiries only — please use invented information.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="enq-name" className="field-label">
              Your Name *
            </label>
            <input
              id="enq-name"
              className="field"
              required
              maxLength={80}
              placeholder="Example: Demo Visitor"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="enq-phone" className="field-label">
              Contact Number *
            </label>
            <input
              id="enq-phone"
              type="tel"
              className="field"
              required
              inputMode="numeric"
              pattern="[0-9]{10,15}"
              maxLength={15}
              placeholder="5550101234"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="enq-email" className="field-label">
            Email Address *
          </label>
          <input
            id="enq-email"
            type="email"
            className="field"
            required
            maxLength={120}
            placeholder="visitor@example.test"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mt-5">
          <label htmlFor="enq-message" className="field-label">
            Your Enquiry *
          </label>
          <textarea
            id="enq-message"
            className="field"
            required
            maxLength={1000}
            placeholder="Ask about hospital administration or services."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>

        {/* Hidden honeypot field to trap spam bots */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="enq-website">Website</label>
          <input
            id="enq-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={websiteHoneypot}
            onChange={(e) => setWebsiteHoneypot(e.target.value)}
          />
        </div>

        {result?.kind === "success" ? (
          <div className="notice mt-6 flex items-start gap-3" role="status">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              Enquiry <strong>{result.reference}</strong> saved to the demo
              database. View and manage it under{" "}
              <Link href="/admin" className="font-bold underline">
                Admin Demo → Enquiries
              </Link>
              .
            </span>
          </div>
        ) : null}

        {result?.kind === "error" ? (
          <div
            className="notice notice-error mt-6 flex items-start gap-3"
            role="alert"
          >
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{result.message}</span>
          </div>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary mt-7"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin-slow h-4 w-4" />
              Sending…
            </>
          ) : (
            <>
              Submit Enquiry
              <ArrowRight className="btn-arrow h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
