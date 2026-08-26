/**
 * The Income board, moneymeta's second map: income *paths* ("decks") ranked by
 * the same popularity x win-rate idea Vicious Syndicate uses for Hearthstone.
 * Two lenses, and they deliberately treat the odds differently:
 *   - startNow  : EXPECTED value. Payoff is discounted by livablePct, the real
 *                 win rate (what share of players clear a livable income), then
 *                 weighted by reachability. This is "what happens if you start
 *                 this today", so the odds of losing belong in the number.
 *   - ceiling   : CONDITIONAL value. Terminal pay x trajectory, win rate
 *                 deliberately excluded, because this lens already means "if
 *                 you make it, how high". Applying win rate here would
 *                 double-count the same risk the startNow lens already prices.
 *
 * Why win rate entered the score (2026-08-23): it was in the seed data,
 * BLS-derived for the 26 SOC-mapped decks, rendered on every card, and absent
 * from scoreFor() entirely. The board was ranking decks by payoff alone, which
 * put a 12%-win-rate franchise in S tier next to a 99%-win-rate profession.
 * That is the Hearthstone equivalent of ranking decks by average damage dealt.
 * All scores are derived here from seed/income-decks.json (BLS-anchored). Nothing
 * computed is stored. Constants are exported so the formula stays tunable.
 */
import decks from "@/seed/income-decks.json";
import exemplarMap from "@/seed/exemplars.json";
import scoreHistory from "@/seed/score-history.json";
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

/**
 * The grading rubric. Tiers are RELATIVE to the current board, not absolute
 * score cutoffs, because this is a meta report: it describes the field as it
 * stands, the same way a Vicious Syndicate Tier 1 deck is Tier 1 relative to
 * the current meta rather than against a fixed standard.
 *
 * Each value is the cumulative share of the board at or above that tier.
 *   S = top 10%   "take it seriously as a plan"
 *   A = next 15%  "strong, but one thing costs you: years, credential, capital, or odds"
 *   B = next 30%  "a real living for most who stick with it"
 *   C = next 30%  "works for a minority, most who try don't clear a living"
 *   D = bottom 15% "median outcome near zero, or the barrier eats the payoff"
 *
 * Replaced fixed cutoffs (S>=70 A>=58 B>=46 C>=34) on 2026-08-23. Those were
 * calibrated to the v1 formula's distribution and were never moved when v2's
 * win-rate multiplier compressed the scale, which left S permanently empty and
 * made every "should S be 58 or 63" argument unanswerable. Percentile bands
 * self-correct on every formula change and every seed refresh, so this class
 * of recalibration debt cannot recur.
 */
export const TIER_BANDS: Record<Exclude<Tier, "D">, number> = {
  S: 0.10,
  A: 0.25,
  B: 0.55,
  C: 0.85,
};

/**
 * The one absolute guard on an otherwise relative rubric: no deck is called
 * S just for topping a bad field. If nothing clears this, S is empty and that
 * emptiness is a real statement about the world rather than a scaling bug.
 * Currently dormant, the 10th-ranked deck scores comfortably above it.
 */
export const TIER_FLOOR_S = 55;

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

/**
 * Score formula version. Bump this whenever scoreFor() changes shape, and
 * re-run scripts/snapshot-scores.mjs to lock a fresh baseline.
 *
 * Movement arrows compare a deck's score against seed/score-history.json. If
 * the formula changed since that snapshot, every delta is an artifact of the
 * new ruler, not of the economy moving. Rather than publish a -34 "faller"
 * that nothing real caused, toView() reports movement as "rebased" whenever
 * the snapshot's formulaVersion does not match this constant.
 *
 * v1: 0.4*income + 0.2*growth + 0.4*reach, win rate unused.
 * v2: income replaced by expected payoff (income x livablePct) on startNow.
 */
export const SCORE_FORMULA_VERSION = 2;

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
   * For the 26 SOC-mapped decks in scripts/bls-refresh.mjs, this is derived
   * from real BLS OEWS national employment counts on a fixed log scale, not
   * a guess. Every other deck is still an editorial estimate for meta
   * context, not a scientific census, until it gets a real source.
   */
  playRate?: number;
  /**
   * Estimated % of players who clear a livable full-time income (VS "win rate").
   * For the 26 SOC-mapped decks in scripts/bls-refresh.mjs, this is derived
   * from real BLS OEWS wage percentiles (10/25/50/75/90) against a $50,000/yr
   * livable-wage threshold, see that file's header for the exact method and
   * the threshold's source. Every other deck, mostly internet/gig/owner-
   * operator paths with no BLS equivalent, is still an editorial estimate,
   * brutal and uncertain by design rather than dressed up as research.
   */
  livablePct?: number;
  /**
   * BLS OEWS 10th/90th percentile annual wage, written by
   * scripts/bls-refresh.mjs --apply for the SOC-mapped decks only. p90 is the
   * real tail: what this deck pays someone in its top decile. Absent on every
   * internet/owner-operator deck, because BLS has no equivalent series for
   * them, which is exactly why no lens may treat a missing p90 as a low one.
   */
  p10?: number;
  p90?: number;
}

/**
 * "rebased" is not a movement, it is the honest absence of one: the scoring
 * formula changed since the last snapshot, so no comparison is meaningful
 * until scripts/snapshot-scores.mjs runs again.
 */
export type Movement = "up" | "down" | "flat" | "new" | "rebased";

export interface IncomeDeckView extends SeedDeck {
  startNowScore: number;
  startNowTier: Tier;
  ceilingScore: number;
  ceilingTier: Tier;
  exemplars: Exemplar[];
  metaClass: MetaClass | string;
  playRate: number;
  livablePct: number;
  /** Score delta vs prior report under the active lens (startNow used for default). */
  movementStartNow: Movement;
  movementCeiling: Movement;
  deltaStartNow: number;
  deltaCeiling: number;
}

interface ScoreHistoryFile {
  asOf: string;
  note?: string;
  /** Which SCORE_FORMULA_VERSION produced these scores. Absent means v1. */
  formulaVersion?: number;
  scores: Record<
    string,
    { startNow: number; ceiling: number; median?: number; playRate?: number; livablePct?: number }
  >;
}

const history = scoreHistory as ScoreHistoryFile;

export function getHistoryAsOf(): string {
  return history.asOf ?? "";
}

function movementFromDelta(delta: number): Movement {
  if (delta >= 1) return "up";
  if (delta <= -1) return "down";
  return "flat";
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

/**
 * Assign exact percentile bands by rank across the whole board under one lens.
 * Ranking uses the unrounded score, so display rounding does not collapse a
 * large set of distinct decks onto one tier boundary. Exact raw-score ties are
 * broken by slug, a stable policy that cannot drift with seed order.
 */
function tiersByRank(all: SeedDeck[], lens: Lens): Map<string, Tier> {
  const ranked = all
    .map((deck) => ({ deck, rawScore: rawScoreFor(deck, lens) }))
    .sort((a, b) => b.rawScore - a.rawScore || a.deck.slug.localeCompare(b.deck.slug));
  const n = ranked.length;
  const endS = Math.round(n * TIER_BANDS.S);
  const endA = Math.round(n * TIER_BANDS.A);
  const endB = Math.round(n * TIER_BANDS.B);
  const endC = Math.round(n * TIER_BANDS.C);
  const result = new Map<string, Tier>();
  ranked.forEach(({ deck, rawScore }, index) => {
    const score = Math.round(rawScore);
    const tier: Tier =
      index < endS && score >= TIER_FLOOR_S
        ? "S"
        : index < endA
          ? "A"
          : index < endB
            ? "B"
            : index < endC
              ? "C"
              : "D";
    result.set(deck.slug, tier);
  });
  return result;
}

/**
 * Win rate, 0..1. livablePct is the share of players who clear a livable
 * full-time income, BLS wage-percentile derived for the SOC-mapped decks and
 * an explicit editorial estimate elsewhere (see the seed field's own comment).
 * Guarded rather than defaulted to 0, because a missing win rate should not
 * silently zero a deck's payoff.
 */
function winRate(livablePct: number | undefined): number {
  if (typeof livablePct !== "number" || Number.isNaN(livablePct)) return 1;
  return clamp(livablePct, 0, 100) / 100;
}

/**
 * Expected payoff: what the median player actually takes home from this deck,
 * not what the deck pays the people who survive it. A $240,000 median at a 12%
 * win rate is not the same object as a $240,000 median at 99%, and until
 * 2026-08-23 this board scored them identically.
 */
function expectedPayoff(deck: SeedDeck): number {
  return incomeScore(deck.median) * winRate(deck.livablePct);
}

function rawScoreFor(deck: SeedDeck, lens: Lens): number {
  const gro = growthScore(deck.growthPct);
  if (lens === "ceiling") {
    // Conditional on winning by definition, so no win-rate discount here.
    const w = LENS_WEIGHTS.ceiling;
    return w.income * incomeScore(deck.median) + w.growth * gro;
  }
  const w = LENS_WEIGHTS.startNow;
  const reach = reachScore(deck.timeToFirstIncomeYears, deck.capitalTier);
  return w.income * expectedPayoff(deck) + w.growth * gro + w.reach * reach;
}

export function scoreFor(deck: SeedDeck, lens: Lens): number {
  return Math.round(rawScoreFor(deck, lens));
}

function toView(
  deck: SeedDeck,
  startNowTiers: Map<string, Tier>,
  ceilingTiers: Map<string, Tier>,
): IncomeDeckView {
  const startNowScore = scoreFor(deck, "startNow");
  const ceilingScore = scoreFor(deck, "ceiling");
  const exemplars =
    (exemplarMap as Record<string, Exemplar[]>)[deck.slug] ?? [];
  const prior = history.scores?.[deck.slug];
  // A snapshot taken under a different formula cannot be compared: the deltas
  // would describe the ruler changing, not the economy. Report "rebased" and
  // zero the delta so the movers strip stays empty until the next snapshot.
  const comparable = (history.formulaVersion ?? 1) === SCORE_FORMULA_VERSION;
  const deltaStartNow = prior && comparable ? startNowScore - prior.startNow : 0;
  const deltaCeiling = prior && comparable ? ceilingScore - prior.ceiling : 0;
  const movementFor = (delta: number): Movement => {
    if (!prior) return "new";
    if (!comparable) return "rebased";
    return movementFromDelta(delta);
  };
  const movementStartNow: Movement = movementFor(deltaStartNow);
  const movementCeiling: Movement = movementFor(deltaCeiling);
  return {
    ...deck,
    metaClass: deck.metaClass ?? "other",
    playRate: deck.playRate ?? 0,
    livablePct: deck.livablePct ?? 0,
    startNowScore,
    startNowTier: startNowTiers.get(deck.slug) ?? "D",
    ceilingScore,
    ceilingTier: ceilingTiers.get(deck.slug) ?? "D",
    exemplars,
    movementStartNow,
    movementCeiling,
    deltaStartNow,
    deltaCeiling,
  };
}

/** Biggest risers / fallers under a lens for the weekly meta strip. */
export function getMovers(
  list: IncomeDeckView[],
  lens: Lens,
  limit = 5,
): { risers: IncomeDeckView[]; fallers: IncomeDeckView[] } {
  const deltaKey = lens === "ceiling" ? "deltaCeiling" : "deltaStartNow";
  const withPrior = list.filter(
    (d) => (lens === "ceiling" ? d.movementCeiling : d.movementStartNow) !== "new",
  );
  const risers = [...withPrior]
    .filter((d) => d[deltaKey] > 0)
    .sort((a, b) => b[deltaKey] - a[deltaKey])
    .slice(0, limit);
  const fallers = [...withPrior]
    .filter((d) => d[deltaKey] < 0)
    .sort((a, b) => a[deltaKey] - b[deltaKey])
    .slice(0, limit);
  return { risers, fallers };
}

/** All income decks with both lenses scored and exemplars attached. */
export function getIncomeDecks(): IncomeDeckView[] {
  const all = decks as SeedDeck[];
  // Tiers are relative, so both lenses need the full score distribution before
  // any single deck can be graded. Score the board first, then band it.
  const startNowTiers = tiersByRank(all, "startNow");
  const ceilingTiers = tiersByRank(all, "ceiling");
  return all.map((d) => toView(d, startNowTiers, ceilingTiers));
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
    buckets[t].sort((a, b) => b[scoreKey] - a[scoreKey] || a.slug.localeCompare(b.slug));
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
