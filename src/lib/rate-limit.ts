/**
 * In-memory sliding-window rate limiter fallback.
 *
 * NOTE ON SERVERLESS (e.g., Vercel):
 * In a serverless environment like Vercel, each lambda instance runs in its own memory
 * space, and containers may spin up or shut down dynamically. In-memory state is maintained
 * per instance. For strict global rate limiting across all distributed lambda invocations,
 * an external distributed store like Upstash Redis (@upstash/ratelimit) or a database table
 * should be used. This in-memory implementation provides an immediate, zero-dependency
 * protection layer against high-frequency single-instance floods and bot abuse.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  request: Request,
  formKey: string,
  maxRequests = 5,
  windowMs = 10 * 60 * 1000, // 10 minutes
): { allowed: boolean; remaining: number; resetAt: number } {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");
  const ip = xForwardedFor
    ? xForwardedFor.split(",")[0].trim()
    : xRealIp || "127.0.0.1";

  const key = `${formKey}:${ip}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);

    // Cleanup expired entries periodically (10% chance per call)
    if (Math.random() < 0.1) {
      for (const [k, v] of rateLimitStore.entries()) {
        if (now > v.resetAt) {
          rateLimitStore.delete(k);
        }
      }
    }

    return { allowed: true, remaining: maxRequests - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}
