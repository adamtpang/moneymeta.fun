import capitalMap from "@/seed/capital-map.json";
import type { Tier } from "@/lib/meta";

export type CapitalUniverse = "crypto" | "company" | "person" | "country";

interface SeedCapitalVehicle {
  slug: string;
  name: string;
  universe: CapitalUniverse;
  metricLabel: string;
  sourceUrl: string;
  priorValue: number;
  latestValue: number;
}

export interface CapitalVehicle extends SeedCapitalVehicle {
  growthRate: number;
  metaScore: number;
  tier: Tier;
}

export const CAPITAL_SIZE_WEIGHT = 0.5;
export const CAPITAL_GROWTH_WEIGHT = 0.5;
export const CAPITAL_GROWTH_MIN = -0.12;
export const CAPITAL_GROWTH_MAX = 0.12;

const tiers: Record<Exclude<Tier, "D">, number> = { S: 80, A: 65, B: 50, C: 35 };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function tierFor(score: number): Tier {
  if (score >= tiers.S) return "S";
  if (score >= tiers.A) return "A";
  if (score >= tiers.B) return "B";
  if (score >= tiers.C) return "C";
  return "D";
}

/** Capital meta = equal-weight log-size and recent growth, normalized across this snapshot. */
export function getCapitalVehicles(): CapitalVehicle[] {
  const seed = capitalMap.vehicles as SeedCapitalVehicle[];
  const logs = seed.map((vehicle) => Math.log10(vehicle.latestValue));
  const minLog = Math.min(...logs);
  const maxLog = Math.max(...logs);

  return seed.map((vehicle) => {
    const growthRate = vehicle.priorValue > 0
      ? (vehicle.latestValue - vehicle.priorValue) / vehicle.priorValue
      : 0;
    const sizeScore = ((Math.log10(vehicle.latestValue) - minLog) / (maxLog - minLog)) * 100;
    const growthScore = ((clamp(growthRate, CAPITAL_GROWTH_MIN, CAPITAL_GROWTH_MAX) - CAPITAL_GROWTH_MIN) /
      (CAPITAL_GROWTH_MAX - CAPITAL_GROWTH_MIN)) * 100;
    const metaScore = Math.round(CAPITAL_SIZE_WEIGHT * sizeScore + CAPITAL_GROWTH_WEIGHT * growthScore);
    return { ...vehicle, growthRate, metaScore, tier: tierFor(metaScore) };
  });
}

export function groupCapitalByTier(list: CapitalVehicle[]): Record<Tier, CapitalVehicle[]> {
  const groups: Record<Tier, CapitalVehicle[]> = { S: [], A: [], B: [], C: [], D: [] };
  for (const vehicle of list) groups[vehicle.tier].push(vehicle);
  for (const tier of Object.keys(groups) as Tier[]) {
    groups[tier].sort((a, b) => b.metaScore - a.metaScore || a.name.localeCompare(b.name));
  }
  return groups;
}

export function getCapitalAsOf(): string {
  return capitalMap.asOf;
}

export function getCapitalNote(): string {
  return capitalMap.note;
}

export const CAPITAL_UNIVERSE_LABEL: Record<CapitalUniverse, string> = {
  crypto: "Crypto",
  company: "Public company",
  person: "Billionaire",
  country: "Country GDP",
};
