/**
 * Seed the fictional demo database.
 * Usage: npx tsx scripts/seed.ts
 */
import { config } from "dotenv";

config(); // load .env so DATABASE_URL is available

async function main() {
  const { resetAndSeed } = await import("../src/lib/seed-data");
  await resetAndSeed();
  console.log("Seeded fictional MediCare demo data.");

  const { pool } = await import("../src/db");
  await pool.end();
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
