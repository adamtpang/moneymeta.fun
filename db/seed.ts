/**
 * Phase 2+ seed script: loads seed/vehicles.json into Neon.
 * Run with: pnpm db:seed   (requires DATABASE_URL in .env)
 *
 * Phase 1 does not use this — the site renders directly from the JSON.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getDb } from "./index";
import { snapshots, vehicles } from "./schema";

interface SeedSnapshot {
  market_cap: number;
  captured_at: string;
}

interface SeedVehicle {
  slug: string;
  name: string;
  category: string;
  description?: string | null;
  source_url: string;
  snapshots: SeedSnapshot[];
}

async function main() {
  const db = getDb();
  const raw = readFileSync(
    join(process.cwd(), "seed", "vehicles.json"),
    "utf-8",
  );
  const data = JSON.parse(raw) as SeedVehicle[];

  for (const v of data) {
    const [row] = await db
      .insert(vehicles)
      .values({
        slug: v.slug,
        name: v.name,
        category: v.category,
        description: v.description ?? null,
        sourceUrl: v.source_url,
      })
      .onConflictDoUpdate({
        target: vehicles.slug,
        set: {
          name: v.name,
          category: v.category,
          description: v.description ?? null,
          sourceUrl: v.source_url,
        },
      })
      .returning();

    for (const s of v.snapshots) {
      await db.insert(snapshots).values({
        vehicleId: row.id,
        marketCap: String(s.market_cap),
        capturedAt: new Date(`${s.captured_at}T00:00:00Z`),
      });
    }

    console.log(`seeded ${v.slug} (${v.snapshots.length} snapshots)`);
  }

  console.log(`done — ${data.length} vehicles`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
