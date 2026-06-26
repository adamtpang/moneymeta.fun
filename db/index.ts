import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Lazily construct the Drizzle client. Phase 1 never calls this — the tier list
 * renders from seed/vehicles.json — so a missing DATABASE_URL is fine until the
 * Phase 2+ ingestion/seed work needs it.
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. It is only required for DB seeding/ingestion (Phase 2+).",
    );
  }
  return drizzle(neon(url), { schema });
}

export { schema };
