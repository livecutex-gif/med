/** Walk an error (and its causes) looking for a specific Postgres error code. */
export function hasPgCode(error: unknown, code: string): boolean {
  let current: unknown = error;
  let depth = 0;
  while (typeof current === "object" && current !== null && depth < 5) {
    if (
      "code" in current &&
      (current as { code?: string }).code === code
    ) {
      return true;
    }
    current = (current as { cause?: unknown }).cause;
    depth += 1;
  }
  return false;
}

/** Whether the error is a Postgres unique constraint violation. */
export function isUniqueViolation(error: unknown): boolean {
  return hasPgCode(error, "23505");
}
