import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "medicare_admin_session";
const TOKEN_EXPIRY = "8h";

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    console.warn("[auth] Warning: ADMIN_PASSWORD environment variable is not defined!");
  }
  return new TextEncoder().encode(secret || "insecure_fallback_secret_do_not_use_in_prod");
}

/** Generate a signed session JWT token using jose */
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecretKey());
}

/** Verify a session JWT token */
export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Check if the incoming request (or Server Component context) is authenticated */
export async function isAuthenticated(request?: NextRequest | Request): Promise<boolean> {
  let token: string | undefined;

  if (request && "cookies" in request && typeof (request as NextRequest).cookies?.get === "function") {
    token = (request as NextRequest).cookies.get(ADMIN_COOKIE_NAME)?.value;
  } else if (request && request.headers) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${ADMIN_COOKIE_NAME}=`));
    if (match) {
      token = match.substring(`${ADMIN_COOKIE_NAME}=`.length);
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    } catch {
      // Outside Next.js server context
    }
  }

  if (!token) return false;
  return verifySessionToken(token);
}
