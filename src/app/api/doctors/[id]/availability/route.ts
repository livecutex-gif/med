import { NextRequest, NextResponse } from "next/server";
import { getAvailability } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const date = request.nextUrl.searchParams.get("date") ?? "";
  const result = await getAvailability(id, date);
  return NextResponse.json(result);
}
