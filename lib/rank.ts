// The money rank ladder, the shared vocabulary between deathmoney.fyi (defense,
// what you burn) and moneymeta.fun (offense, what you play). Pure functions, no
// imports, no side effects: this file is meant to be copied verbatim into any
// repo that needs to speak the same language.
//
// Rank is monthly recurring income. Legend is banked net worth, because income
// alone never made anyone free. Both are needed; they are tracked separately on
// purpose.

export type TierName = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Legend";

export interface Tier {
  name: TierName;
  /** Monthly income floor, USD. */
  lo: number;
  /** Monthly income ceiling, USD. null means open-ended. */
  hi: number | null;
  note: string;
}

/** Each tier holds 10 floors, counted down: 10 on entry, 1 just before promotion. */
export const FLOORS_PER_TIER = 10;

/** Legend is banked money, not income. Adam's number. */
export const LEGEND_NET_WORTH = 5_000_000;

/** The income floor Adam wants to clear, annualized. */
export const INCOME_FLOOR_ANNUAL = 300_000;

export const TIERS: Tier[] = [
  { name: "Bronze", lo: 0, hi: 2_500, note: "Survival to breakeven" },
  { name: "Silver", lo: 2_500, hi: 5_000, note: "Clearing the debt" },
  { name: "Gold", lo: 5_000, hi: 10_000, note: "Stable, $60k to $120k a year" },
  { name: "Platinum", lo: 10_000, hi: 25_000, note: "Tops out at $300k a year" },
  { name: "Diamond", lo: 25_000, hi: 85_000, note: "$300k to $1M a year" },
  { name: "Legend", lo: 85_000, hi: null, note: "$1M+ a year, $5M banked" },
];

export interface Rank {
  tier: Tier;
  /** 10 down to 1 within the tier. Legend has no floors, so 0. */
  floor: number;
  /** "Bronze 8", "Legend". */
  label: string;
  /** 0..1 progress through the current tier. */
  pctThroughTier: number;
  /** True only when net worth clears LEGEND_NET_WORTH. */
  isLegend: boolean;
  /** Income qualifies for Legend but the bank account does not. */
  legendPending: boolean;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * Rank from monthly income. Legend additionally requires banked net worth, so a
 * high earner with nothing saved caps at "Diamond 1 (Legend pending)".
 */
export function rankFor(monthlyIncome: number, netWorth = 0): Rank {
  const mrr = Math.max(0, monthlyIncome);
  const isLegend = netWorth >= LEGEND_NET_WORTH;

  const idx = TIERS.findIndex((t) => t.hi === null || mrr < t.hi);
  const tier = TIERS[idx === -1 ? TIERS.length - 1 : idx];

  if (tier.name === "Legend") {
    if (isLegend) {
      return { tier, floor: 0, label: "Legend", pctThroughTier: 1, isLegend: true, legendPending: false };
    }
    // Income is there, the balance is not. Hold at the top of Diamond.
    const diamond = TIERS[TIERS.length - 2];
    return {
      tier: diamond,
      floor: 1,
      label: `${diamond.name} 1`,
      pctThroughTier: 1,
      isLegend: false,
      legendPending: true,
    };
  }

  const span = (tier.hi as number) - tier.lo;
  const pct = span > 0 ? clamp((mrr - tier.lo) / span, 0, 0.999) : 0;
  const floor = clamp(FLOORS_PER_TIER - Math.floor(pct * FLOORS_PER_TIER), 1, FLOORS_PER_TIER);

  return {
    tier,
    floor,
    label: `${tier.name} ${floor}`,
    pctThroughTier: pct,
    isLegend,
    legendPending: false,
  };
}

/** Extra monthly income needed to gain one floor. 0 if already at the top. */
export function toNextFloor(monthlyIncome: number): number {
  const r = rankFor(monthlyIncome);
  if (r.tier.hi === null || r.legendPending) return 0;
  const span = r.tier.hi - r.tier.lo;
  const step = span / FLOORS_PER_TIER;
  const floorsCleared = FLOORS_PER_TIER - r.floor;
  const nextEdge = r.tier.lo + (floorsCleared + 1) * step;
  return Math.max(0, Math.ceil(nextEdge - monthlyIncome));
}

/** Extra monthly income needed to promote to the next tier. */
export function toNextTier(monthlyIncome: number): number {
  const r = rankFor(monthlyIncome);
  if (r.tier.hi === null) return 0;
  return Math.max(0, Math.ceil(r.tier.hi - monthlyIncome));
}

/** How many units of a recurring offer close a given monthly gap. */
export function unitsToClose(gap: number, unitPrice: number): number {
  if (unitPrice <= 0) return 0;
  return Math.max(0, Math.ceil(gap / unitPrice));
}

/** 0..1 progress toward the Legend bank balance. */
export function legendProgress(netWorth: number): number {
  return clamp(netWorth / LEGEND_NET_WORTH, 0, 1);
}

/**
 * Runway is the health bar: months of burn covered by liquid cash. null when
 * there is no burn to divide by.
 */
export function runwayMonths(liquid: number, monthlyBurn: number): number | null {
  if (monthlyBurn <= 0) return null;
  return Math.round((liquid / monthlyBurn) * 10) / 10;
}
