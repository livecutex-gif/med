#!/usr/bin/env bash
# =============================================================================
#  MediCare Hospital (fictional demo) — one-command Vercel deployment
#
#  Usage:
#    1. Create a managed Postgres database (Neon free tier works great) and
#       copy its connection string.
#    2. Run:
#         export DATABASE_URL="postgresql://user:pass@host/dbname"
#         bash scripts/deploy-vercel.sh
#
#       With a token instead of interactive login:
#         export VERCEL_TOKEN="your-token-from-vercel.com/account/tokens"
#         export DATABASE_URL="postgresql://user:pass@host/dbname"
#         bash scripts/deploy-vercel.sh
#
#  The script will create (or reuse) the Vercel project
#  "medicare-hospital-demo", set DATABASE_URL, push the schema, seed the
#  fictional data, and deploy to production.
# =============================================================================
set -euo pipefail

PROJECT_NAME="${VERCEL_PROJECT_NAME:-medicare-hospital-demo}"

echo "── MediCare Hospital demo deployment ─────────────────────────"
echo "   Project: $PROJECT_NAME  →  https://$PROJECT_NAME.vercel.app"
echo

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "Create a managed Postgres database (e.g. Neon free tier) and run:"
  echo "  export DATABASE_URL=\"postgresql://user:pass@host/dbname\""
  exit 1
fi

VT=()
if [ -n "${VERCEL_TOKEN:-}" ]; then
  VT=(--token "$VERCEL_TOKEN")
else
  echo "No VERCEL_TOKEN found — starting interactive Vercel login…"
  npx --yes vercel@latest login
fi

echo "─ 1/4  Creating/linking Vercel project \"$PROJECT_NAME\"…"
npx --yes vercel@latest project add "$PROJECT_NAME" "${VT[@]}" 2>/dev/null || true
npx --yes vercel@latest link --yes --project "$PROJECT_NAME" "${VT[@]}"

echo "─ 2/4  Setting DATABASE_URL on the project…"
printf '%s' "$DATABASE_URL" | npx --yes vercel@latest env add DATABASE_URL production --force "${VT[@]}"
printf '%s' "$DATABASE_URL" | npx --yes vercel@latest env add DATABASE_URL preview --force "${VT[@]}" || true

echo "─ 3/4  Pushing schema + seeding fictional demo data…"
PUSH_URL="$DATABASE_URL"
if [[ "$PUSH_URL" != *sslmode* ]] \
  && [[ "$PUSH_URL" != *localhost* ]] \
  && [[ "$PUSH_URL" != *127.0.0.1* ]]; then
  SEP="?"
  [[ "$PUSH_URL" == *\?* ]] && SEP="&"
  PUSH_URL="${PUSH_URL}${SEP}sslmode=require"
fi
TMP_CONFIG="$(mktemp /tmp/drizzle-prod-XXXXXX.json)"
cat > "$TMP_CONFIG" <<JSON
{"dialect":"postgresql","schema":"./src/db/schema.ts","dbCredentials":{"url":"$PUSH_URL"}}
JSON
npx --yes drizzle-kit push --force --config "$TMP_CONFIG"
rm -f "$TMP_CONFIG"
DATABASE_URL="$DATABASE_URL" npx --yes tsx scripts/seed.ts

echo "─ 4/4  Deploying to production…"
npx --yes vercel@latest deploy --prod --yes "${VT[@]}"

echo
echo "── Done ──────────────────────────────────────────────────────"
echo "   https://$PROJECT_NAME.vercel.app"
echo "   (If Vercel prints a different alias, that URL is authoritative.)"
