import type { Tier } from "@/lib/meta";
import solopreneurData from "@/seed/solopreneurs.json";

export type SolopreneurEvidence =
  | "corroborated"
  | "founder_disclosed"
  | "reported_estimate";
export type SoloStatus = "current_solo" | "solo_at_metric" | "effectively_solo";

interface SeedSolopreneur {
  slug: string;
  name: string;
  business: string;
  category: string;
  annualRevenueUsd: number;
  metricLabel: string;
  metricYear: number;
  metricNote: string;
  evidence: SolopreneurEvidence;
  soloStatus: SoloStatus;
  soloYears: number;
  sourceUrl: string;
}

export interface SolopreneurScoreBreakdown {
  scale: number;
  evidence: number;
  soloPurity: number;
  duration: number;
}

export interface RankedSolopreneur extends SeedSolopreneur {
  rank: number;
  score: number;
  tier: Tier;
  breakdown: SolopreneurScoreBreakdown;
}

export interface SolopreneurRecord {
  label: string;
  name: string;
  business: string;
  metric: string;
  asOf: string;
  note: string;
  sourceUrl: string;
}

export const SOLO_SCORE_WEIGHTS = {
  revenueScale: 60,
  evidence: 20,
  soloPurity: 10,
  duration: 10,
} as const;

export const SOLO_REVENUE_FLOOR_USD = 100_000;
export const SOLO_REVENUE_CEILING_USD = 15_000_000;
export const SOLO_DURATION_CEILING_YEARS = 10;

const EVIDENCE_POINTS: Record<SolopreneurEvidence, number> = {
  corroborated: 20,
  founder_disclosed: 14,
  reported_estimate: 8,
};

const SOLO_STATUS_POINTS: Record<SoloStatus, number> = {
  current_solo: 10,
  solo_at_metric: 8,
  effectively_solo: 5,
};

export const EVIDENCE_LABELS: Record<SolopreneurEvidence, string> = {
  corroborated: "Corroborated",
  founder_disclosed: "Founder disclosed",
  reported_estimate: "Reported estimate",
};

export const SOLO_STATUS_LABELS: Record<SoloStatus, string> = {
  current_solo: "Solo now",
  solo_at_metric: "Solo at metric",
  effectively_solo: "Near-solo core",
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function tierFor(score: number): Tier {
  if (score >= 80) return "S";
  if (score >= 65) return "A";
  if (score >= 50) return "B";
  if (score >= 35) return "C";
  return "D";
}

/**
 * Solo score rewards proven economic scale without letting weak evidence or a
 * loose definition of "solo" dominate the leaderboard.
 */
export function scoreSolopreneur(
  operator: Pick<
    SeedSolopreneur,
    "annualRevenueUsd" | "evidence" | "soloStatus" | "soloYears"
  >,
): { score: number; tier: Tier; breakdown: SolopreneurScoreBreakdown } {
  const revenue = clamp(
    operator.annualRevenueUsd,
    SOLO_REVENUE_FLOOR_USD,
    SOLO_REVENUE_CEILING_USD,
  );
  const logFloor = Math.log10(SOLO_REVENUE_FLOOR_USD);
  const logCeiling = Math.log10(SOLO_REVENUE_CEILING_USD);
  const scale = Math.round(
    ((Math.log10(revenue) - logFloor) / (logCeiling - logFloor)) *
      SOLO_SCORE_WEIGHTS.revenueScale,
  );
  const evidence = EVIDENCE_POINTS[operator.evidence];
  const soloPurity = SOLO_STATUS_POINTS[operator.soloStatus];
  const duration = Math.round(
    (clamp(operator.soloYears, 0, SOLO_DURATION_CEILING_YEARS) /
      SOLO_DURATION_CEILING_YEARS) *
      SOLO_SCORE_WEIGHTS.duration,
  );
  const breakdown = { scale, evidence, soloPurity, duration };
  const score = scale + evidence + soloPurity + duration;

  return { score, tier: tierFor(score), breakdown };
}

export function getSolopreneurIndex(): RankedSolopreneur[] {
  const ranked = (solopreneurData.operators as SeedSolopreneur[])
    .map((operator) => ({ ...operator, ...scoreSolopreneur(operator) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.annualRevenueUsd - a.annualRevenueUsd ||
        a.name.localeCompare(b.name),
    );

  return ranked.map((operator, index) => ({ ...operator, rank: index + 1 }));
}

export function getSolopreneurRecords(): SolopreneurRecord[] {
  return solopreneurData.recordBook as SolopreneurRecord[];
}

export function getSolopreneurAsOf(): string {
  return solopreneurData.asOf;
}

export function getSolopreneurNote(): string {
  return solopreneurData.note;
}

export function formatSoloRevenue(value: number): string {
  if (value >= 10_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions >= 3 ? millions.toFixed(1) : millions.toFixed(2)}M`;
  }
  return `$${Math.round(value / 1_000).toLocaleString("en-US")}K`;
}
