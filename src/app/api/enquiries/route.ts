import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { PHONE_PATTERN } from "@/lib/booking";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(80, "Name must not exceed 80 characters."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Please provide a valid 10-15 digit phone number."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(120, "Email must not exceed 120 characters."),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(1000, "Message must not exceed 1000 characters."),
  website: z.string().optional(), // Honeypot field for spam bots
});

export async function POST(request: NextRequest) {
  // 1. Rate limiting: 5 submissions per 10 minutes
  const rate = checkRateLimit(request, "enquiries", 5, 10 * 60 * 1000);
  if (!rate.allowed) {
    return fail(
      "Too many enquiries submitted. Please wait a few minutes before trying again.",
      429,
    );
  }

  // 2. Parse request JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.");
  }

  // 3. Schema validation with Zod
  const validation = enquirySchema.safeParse(body);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message ?? "Invalid form input.";
    return fail(firstError);
  }

  const { name, phone, email, message, website } = validation.data;

  // 4. Honeypot check: silently return fake success if bot filled the hidden input
  if (website && website.trim().length > 0) {
    const fakeRef = `ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    return NextResponse.json({ ok: true, id: 999999, reference: fakeRef }, { status: 201 });
  }

  // 5. Save enquiry in database
  try {
    const [row] = await db
      .insert(enquiries)
      .values({ name, phone, email, message, status: "New" })
      .returning({ id: enquiries.id });

    const reference = `ENQ-${1000 + row.id}`;
    await db.execute(
      sql`UPDATE enquiries SET reference = ${reference} WHERE id = ${row.id}`,
    );

    return NextResponse.json({ ok: true, id: row.id, reference }, { status: 201 });
  } catch (error) {
    console.error("Enquiry submission failed:", error);
    return fail("Could not save the enquiry. Please try again later.", 500);
  }
}
