/**
 * The meta score, moneymeta.fun's single source of truth for ranking.
 *
 * Vicious Syndicate's meta score ≈ popularity × win rate. We map that onto
 * capital: market cap (where capital lives) × growth rate (recent performance).
 *
 *   meta_score = WEIGHT.size * normSize(market_cap)
 *              + WEIGHT.growth * normGrowth(growth_rate)
 *
 * Every constant below is exposed so the formula stays trivially tunable.
 * Nothing here is stored in the database, score and tier are always derived.
 */

export type Tier = "S" | "A" | "B" | "C" | "D";

export const TIER_ORDER: readonly Tier[] = ["S", "A", "B", "C", "D"];

/** Size and growth weighted equally to start. Must sum to 1. */
export const META_WEIGHTS = { size: 0.5, growth: 0.5 } as const;

/**
 * Market cap is normalized on a log10 scale because caps span orders of
 * magnitude (a single person ≈ $200B, all global real estate ≈ $380T).
 *   log10($100B) ≈ 11.0  -> 0
 *   log10($500T) ≈ 14.7  -> 100
 */
export const SIZE_LOG_MIN = 11;
export const SIZE_LOG_MAX = 14.7;

/**
 * Growth is normalized linearly and clamped so a single ripping vehicle can't
 * dominate. ±12% is a strong-but-real monthly move for a major asset.
 *   -12% -> 0,  0% -> 50,  +12% -> 100
 */
export const GROWTH_CLAMP_LO = -0.12;
export const GROWTH_CLAMP_HI = 0.12;

/** meta_score thresholds. Anything below C is D. */
export const TIER_THRESHOLDS: Record<Exclude<Tier, "D">, number> = {
  S: 80,
  A: 65,
  B: 50,
  C: 35,
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** 0..100, bigger pool of capital scores higher. */
export function normalizeSize(marketCap: number): number {
  if (marketCap <= 0) return 0;
  const log = Math.log10(marketCap);
  return clamp(
    ((log - SIZE_LOG_MIN) / (SIZE_LOG_MAX - SIZE_LOG_MIN)) * 100,
    0,
    100,
  );
}

/** 0..100, faster recent growth scores higher; 0% growth maps to 50. */
export function normalizeGrowth(growthRate: number): number {
  return clamp(
    ((growthRate - GROWTH_CLAMP_LO) / (GROWTH_CLAMP_HI - GROWTH_CLAMP_LO)) * 100,
    0,
    100,
  );
}

/** Period-over-period growth as a fraction, e.g. 0.065 = +6.5%. */
export function growthRate(latest: number, prior: number): number {
  if (!prior) return 0;
  return (latest - prior) / prior;
}

/** The meta score, 0..100, rounded to a whole number. */
export function metaScore(marketCap: number, growth: number): number {
  const size = normalizeSize(marketCap);
  const grow = normalizeGrowth(growth);
  return Math.round(META_WEIGHTS.size * size + META_WEIGHTS.growth * grow);
}

/** Map a meta score to a tier. */
export function tierFor(score: number): Tier {
  if (score >= TIER_THRESHOLDS.S) return "S";
  if (score >= TIER_THRESHOLDS.A) return "A";
  if (score >= TIER_THRESHOLDS.B) return "B";
  if (score >= TIER_THRESHOLDS.C) return "C";
  return "D";
}
