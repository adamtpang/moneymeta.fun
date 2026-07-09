/**
 * The Phase 1 data layer. Reads the committed seed snapshots and derives the
 * tier list in a pure function, no database. Growth, meta score, and tier are
 * all computed (never stored). In Phase 3 the only change here is swapping the
 * seed import for a Drizzle query that returns the same VehicleView shape.
 */
import seed from "@/seed/vehicles.json";
import { growthRate, metaScore, tierFor, type Tier } from "@/lib/meta";

export type Category = "asset_class" | "crypto" | "company" | "person";

export interface VehicleView {
  slug: string;
  name: string;
  category: Category;
  description: string | null;
  sourceUrl: string;
  marketCap: number;
  priorCap: number;
  growth: number;
  score: number;
  tier: Tier;
  capturedAt: string;
  priorAt: string;
  rank: number;
}

interface SeedSnapshot {
  market_cap: number;
  captured_at: string;
}

interface SeedVehicle {
  slug: string;
  name: string;
  category: Category;
  description?: string | null;
  source_url: string;
  snapshots: SeedSnapshot[];
}

/** Compute a vehicle's derived view from its two most recent snapshots.
 *  Returns null for a vehicle with no snapshots (skipped, never crashes). */
function toView(v: SeedVehicle): VehicleView | null {
  const snaps = [...v.snapshots].sort((a, b) =>
    a.captured_at.localeCompare(b.captured_at),
  );
  const latest = snaps[snaps.length - 1];
  if (!latest) return null;
  const prior = snaps[snaps.length - 2] ?? latest;
  const growth = growthRate(latest.market_cap, prior.market_cap);
  const score = metaScore(latest.market_cap, growth);
  return {
    slug: v.slug,
    name: v.name,
    category: v.category,
    description: v.description ?? null,
    sourceUrl: v.source_url,
    marketCap: latest.market_cap,
    priorCap: prior.market_cap,
    growth,
    score,
    tier: tierFor(score),
    capturedAt: latest.captured_at,
    priorAt: prior.captured_at,
    rank: 0,
  };
}

/** All vehicles, computed and sorted by meta score (highest first). Ties break
 *  by market cap then name so ordering is deterministic, not seed-order. */
export function getTierList(): VehicleView[] {
  return (seed as SeedVehicle[])
    .map(toView)
    .filter((v): v is VehicleView => v !== null)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.marketCap - a.marketCap ||
        a.name.localeCompare(b.name),
    )
    .map((v, i) => ({ ...v, rank: i + 1 }));
}

/** Group an already-computed list into tier buckets, preserving order. */
export function groupByTier(list: VehicleView[]): Record<Tier, VehicleView[]> {
  const buckets: Record<Tier, VehicleView[]> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  };
  for (const v of list) buckets[v.tier].push(v);
  return buckets;
}

/** The date of the most recent snapshot in an already-computed list. */
export function captureDateOf(list: VehicleView[]): string {
  return list.reduce((max, v) => (v.capturedAt > max ? v.capturedAt : max), "");
}
