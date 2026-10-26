import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePgLite } from "drizzle-orm/pglite";
import { Pool, type PoolConfig } from "pg";
import type { PgDatabase } from "drizzle-orm/pg-core";
import { PGlite } from "@electric-sql/pglite";
import * as fs from "fs";
import * as path from "path";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDb?: any;
};

/**
 * Managed Postgres providers (Neon, Supabase, RDS, Aiven, …) require TLS.
 * Local development databases do not. Detect the right behavior from the
 * connection string so the same code works in both places.
 */
function resolveSsl(url: string): PoolConfig["ssl"] {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      parsed.searchParams.has("sslmode")
    ) {
      return undefined; // local DB, or sslmode already controls TLS
    }
    return { rejectUnauthorized: false };
  } catch {
    return undefined;
  }
}

let poolInstance: any = null;
let dbInstance: any = null;

if (databaseUrl) {
  poolInstance =
    globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
      ssl: resolveSsl(databaseUrl),
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = poolInstance;
  }

  dbInstance = drizzleNodePg(poolInstance);
} else {
  // Local embedded fallback: in-memory PGlite prevents file-lock corruption across server restarts
  if (!globalForDb.__arenaNextJsDb) {
    const client = new PGlite();

    const schemaFile = path.join(
      process.cwd(),
      "drizzle",
      "0000_exotic_gwen_stacy.sql",
    );
    if (fs.existsSync(schemaFile)) {
      const ddl = fs.readFileSync(schemaFile, "utf-8");
      client.exec(ddl).catch(() => {});
    }

    const migrationFile = path.join(
      process.cwd(),
      "drizzle",
      "0001_add_appointment_email.sql",
    );
    if (fs.existsSync(migrationFile)) {
      const ddl = fs.readFileSync(migrationFile, "utf-8");
      client.exec(ddl).catch(() => {});
    }

    globalForDb.__arenaNextJsDb = drizzlePgLite(client);
  }
  dbInstance = globalForDb.__arenaNextJsDb;
}

export const pool = poolInstance ?? { end: async () => {} };
export const db: PgDatabase<any, any, any> = dbInstance;
