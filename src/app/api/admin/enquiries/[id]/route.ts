import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized. Admin session required." },
      { status: 401 },
    );
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { ok: false, message: "Invalid enquiry id." },
      { status: 400 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const status = String(body.status ?? "");
  if (status !== "New" && status !== "Resolved") {
    return NextResponse.json(
      { ok: false, message: "Invalid status value." },
      { status: 400 },
    );
  }

  const [existing] = await db
    .select({ id: enquiries.id })
    .from(enquiries)
    .where(eq(enquiries.id, id));
  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Enquiry not found." },
      { status: 404 },
    );
  }

  await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));

  return NextResponse.json({ ok: true, id, status });
}
