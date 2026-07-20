/**
 * The Income board, moneymeta's second map: income *paths* ("decks") ranked by
 * the same popularity x win-rate idea, but win-rate = median income and the
 * score is barrier-aware. Two lenses:
 *   - startNow  : reachable + fast (income ÷ barrier ÷ time), for a high-agency
 *                 person starting today with little capital.
 *   - ceiling   : highest expected value (terminal pay x trajectory).
 * All scores are derived here from seed/income-decks.json (BLS-anchored). Nothing
 * computed is stored. Constants are exported so the formula stays tunable.
 */
import decks from "@/seed/income-decks.json";
import exemplarMap from "@/seed/exemplars.json";
import type { Tier } from "@/lib/meta";

export type Lens = "startNow" | "ceiling";
export type DataQuality = "verifiable" | "partial" | "self_reported";
export type CapitalTier = "none" | "low" | "med" | "high";
/** VS-style class for internet capitalism (popularity charts). */
export type MetaClass =
  | "attention"
  | "owned"
  | "digital_product"
  | "commerce"
  | "software"
  | "service"
  | "arbitrage"
  | "gig"
  | "career"
  | "other";

export const INCOME_TIERS: Record<Exclude<Tier, "D">, number> = {
  S: 70,
  A: 58,
  B: 46,
  C: 34,
};

// Income normalized linearly: $30k -> 0, $250k -> 100 (median annual).
export const INCOME_MIN = 30000;
export const INCOME_MAX = 250000;
// Growth (BLS 10-yr projection %): -10% -> 0, +35% -> 100.
export const GROWTH_LO = -10;
export const GROWTH_HI = 35;
// Reachability: years-to-first-income (0 -> 100, 11+ -> 0) and capital gate.
export const TIME_MAX_YEARS = 11;
export const CAPITAL_SCORE: Record<CapitalTier, number> = {
  none: 100,
  low: 75,
  med: 45,
  high: 15,
};

export const LENS_WEIGHTS = {
  startNow: { income: 0.4, growth: 0.2, reach: 0.4 },
  ceiling: { income: 0.7, growth: 0.3 },
} as const;

export interface Exemplar {
  name: string;
  handle: string;
  url: string;
  note: string;
  rev: string;
}

interface SeedDeck {
  slug: string;
  name: string;
  category: string;
  whatYouDo: string;
  median: number;
  incomeRangeNote: string;
  frequency: string;
  frequencyCount: number;
  growthPct: number;
  barrierToEntry: string;
  timeToFirstIncomeYears: number;
  capitalTier: CapitalTier;
  dataQuality: DataQuality;
  sourceUrl: string;
  /** Archetype class (attention, software, service…). */
  metaClass?: MetaClass | string;
  /**
   * Relative play rate 0-100: how crowded the ladder is (VS "popularity").
   * Not a scientific census; editorial estimate for meta context.
   */
  playRate?: number;
  /**
   * Estimated % of players who clear a livable full-time income (VS "win rate").
   * Brutal and uncertain for internet decks; higher for BLS-employed paths.
   */
  livablePct?: number;
}

export interface IncomeDeckView extends SeedDeck {
  startNowScore: number;
  startNowTier: Tier;
  ceilingScore: number;
  ceilingTier: Tier;
  exemplars: Exemplar[];
  metaClass: MetaClass | string;
  playRate: number;
  livablePct: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function incomeScore(median: number): number {
  return clamp(((median - INCOME_MIN) / (INCOME_MAX - INCOME_MIN)) * 100, 0, 100);
}
function growthScore(pct: number): number {
  return clamp(((pct - GROWTH_LO) / (GROWTH_HI - GROWTH_LO)) * 100, 0, 100);
}
function reachScore(years: number, capital: CapitalTier): number {
  const time = clamp(((TIME_MAX_YEARS - years) / TIME_MAX_YEARS) * 100, 0, 100);
  return 0.6 * time + 0.4 * CAPITAL_SCORE[capital];
}

function tierFor(score: number): Tier {
  if (score >= INCOME_TIERS.S) return "S";
  if (score >= INCOME_TIERS.A) return "A";
  if (score >= INCOME_TIERS.B) return "B";
  if (score >= INCOME_TIERS.C) return "C";
  return "D";
}

export function scoreFor(deck: SeedDeck, lens: Lens): number {
  const inc = incomeScore(deck.median);
  const gro = growthScore(deck.growthPct);
  if (lens === "ceiling") {
    const w = LENS_WEIGHTS.ceiling;
    return Math.round(w.income * inc + w.growth * gro);
  }
  const w = LENS_WEIGHTS.startNow;
  const reach = reachScore(deck.timeToFirstIncomeYears, deck.capitalTier);
  return Math.round(w.income * inc + w.growth * gro + w.reach * reach);
}

function toView(deck: SeedDeck): IncomeDeckView {
  const startNowScore = scoreFor(deck, "startNow");
  const ceilingScore = scoreFor(deck, "ceiling");
  const exemplars =
    (exemplarMap as Record<string, Exemplar[]>)[deck.slug] ?? [];
  return {
    ...deck,
    metaClass: deck.metaClass ?? "other",
    playRate: deck.playRate ?? 0,
    livablePct: deck.livablePct ?? 0,
    startNowScore,
    startNowTier: tierFor(startNowScore),
    ceilingScore,
    ceilingTier: tierFor(ceilingScore),
    exemplars,
  };
}

/** All income decks with both lenses scored and exemplars attached. */
export function getIncomeDecks(): IncomeDeckView[] {
  return (decks as SeedDeck[]).map(toView);
}

/** Group decks into S→D buckets for one lens, sorted by that lens's score. */
export function groupByLens(
  list: IncomeDeckView[],
  lens: Lens,
): Record<Tier, IncomeDeckView[]> {
  const scoreKey = lens === "ceiling" ? "ceilingScore" : "startNowScore";
  const tierKey = lens === "ceiling" ? "ceilingTier" : "startNowTier";
  const buckets: Record<Tier, IncomeDeckView[]> = { S: [], A: [], B: [], C: [], D: [] };
  for (const d of list) buckets[d[tierKey]].push(d);
  for (const t of Object.keys(buckets) as Tier[]) {
    buckets[t].sort((a, b) => b[scoreKey] - a[scoreKey]);
  }
  return buckets;
}

export const META_CLASS_LABEL: Record<string, string> = {
  attention: "Attention",
  owned: "Owned media",
  digital_product: "Digital product",
  commerce: "Commerce",
  software: "Software",
  service: "Service",
  arbitrage: "Arbitrage",
  gig: "Gig",
  career: "Career / W2",
  other: "Other",
};

/**
 * Class frequency table (VS distribution strip): share of board "play" by metaClass,
 * weighted by playRate so crowded attention decks show as high frequency.
 */
export function classFrequency(
  list: IncomeDeckView[],
): { metaClass: string; label: string; share: number; count: number; avgLivable: number }[] {
  const totals = new Map<string, { weight: number; count: number; livableSum: number }>();
  let all = 0;
  for (const d of list) {
    const cls = d.metaClass || "other";
    const w = Math.max(d.playRate, 1);
    const cur = totals.get(cls) ?? { weight: 0, count: 0, livableSum: 0 };
    cur.weight += w;
    cur.count += 1;
    cur.livableSum += d.livablePct;
    totals.set(cls, cur);
    all += w;
  }
  return [...totals.entries()]
    .map(([metaClass, v]) => ({
      metaClass,
      label: META_CLASS_LABEL[metaClass] ?? metaClass,
      share: all > 0 ? Math.round((v.weight / all) * 1000) / 10 : 0,
      count: v.count,
      avgLivable: v.count > 0 ? Math.round((v.livableSum / v.count) * 10) / 10 : 0,
    }))
    .sort((a, b) => b.share - a.share);
}
