/**
 * Curated "Data Reaper" layer for the money meta: Meta Breaker + matchup
 * stacks. Decks are still scored in lib/income.ts; this file only resolves
 * editorial report data from seed/meta-report.json onto those decks.
 */
import report from "@/seed/meta-report.json";
import type { IncomeDeckView, Lens } from "@/lib/income";
import type { Tier } from "@/lib/meta";

export interface MetaReportSeed {
  reportId: string;
  title: string;
  asOf: string;
  lede: string;
  metaBreaker: {
    slug: string;
    headline: string;
    lede: string;
    bullets: string[];
  };
  matchups: {
    id: string;
    name: string;
    role: string;
    note: string;
    opener: string;
    midgame: string;
    wincon: string;
  }[];
}

export interface ResolvedMatchup {
  id: string;
  name: string;
  role: string;
  note: string;
  opener: IncomeDeckView | null;
  midgame: IncomeDeckView | null;
  wincon: IncomeDeckView | null;
}

export interface MetaBreakerView {
  deck: IncomeDeckView | null;
  headline: string;
  lede: string;
  bullets: string[];
}

export interface ThePickView {
  deck: IncomeDeckView;
  lens: Lens;
  score: number;
  tier: Tier;
  reasons: string[];
}

const seed = report as MetaReportSeed;

export function getMetaReport(): MetaReportSeed {
  return seed;
}

function bySlug(decks: IncomeDeckView[]): Map<string, IncomeDeckView> {
  return new Map(decks.map((d) => [d.slug, d]));
}

export function resolveMetaBreaker(decks: IncomeDeckView[]): MetaBreakerView {
  const map = bySlug(decks);
  const mb = seed.metaBreaker;
  return {
    deck: map.get(mb.slug) ?? null,
    headline: mb.headline,
    lede: mb.lede,
    bullets: mb.bullets,
  };
}

export function resolveMatchups(decks: IncomeDeckView[]): ResolvedMatchup[] {
  const map = bySlug(decks);
  return seed.matchups.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    note: m.note,
    opener: map.get(m.opener) ?? null,
    midgame: map.get(m.midgame) ?? null,
    wincon: map.get(m.wincon) ?? null,
  }));
}

/** #1 deck under the active lens, with short VS-style why bullets. */
export function getThePick(decks: IncomeDeckView[], lens: Lens): ThePickView | null {
  if (decks.length === 0) return null;
  const scoreKey = lens === "ceiling" ? "ceilingScore" : "startNowScore";
  const tierKey = lens === "ceiling" ? "ceilingTier" : "startNowTier";
  const ranked = [...decks].sort((a, b) => b[scoreKey] - a[scoreKey]);
  const deck = ranked[0];
  const score = deck[scoreKey];
  const tier = deck[tierKey];
  const reasons = pickReasons(deck, lens);
  return { deck, lens, score, tier, reasons };
}

function pickReasons(deck: IncomeDeckView, lens: Lens): string[] {
  const reasons: string[] = [];
  if (lens === "startNow") {
    if (deck.capitalTier === "none" || deck.capitalTier === "low") {
      reasons.push(
        deck.capitalTier === "none"
          ? "Zero hard capital to open"
          : "Low capital gate relative to the rest of the board",
      );
    }
    if (deck.timeToFirstIncomeYears <= 1) {
      reasons.push("Fast path to first income under this lens");
    }
    if (deck.median >= 100000) {
      reasons.push(`Strong median pay (${formatRough(deck.median)}) even before trajectory`);
    }
  } else {
    if (deck.median >= 150000) {
      reasons.push(`Terminal pay is elite (${formatRough(deck.median)} median)`);
    } else if (deck.median >= 80000) {
      reasons.push(`Solid terminal pay (${formatRough(deck.median)} median)`);
    }
    if (deck.growthPct >= 10) {
      reasons.push(`Trajectory is hot (+${deck.growthPct}% growth input)`);
    } else if (deck.growthPct > 0) {
      reasons.push(`Positive trajectory (+${deck.growthPct}%)`);
    }
  }
  if (deck.dataQuality === "verifiable") {
    reasons.push("BLS-verified, not a guru screenshot");
  } else if (deck.dataQuality === "partial") {
    reasons.push("Partial public data, treat the edges carefully");
  }
  if (reasons.length < 2) {
    reasons.push(deck.whatYouDo.split(".")[0] + ".");
  }
  return reasons.slice(0, 3);
}

function formatRough(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}
