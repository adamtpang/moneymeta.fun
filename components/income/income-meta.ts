import {
  Briefcase,
  Building2,
  Code,
  Globe,
  HeartPulse,
  Landmark,
  Laptop,
  Phone,
  Store,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { CapitalTier, DataQuality } from "@/lib/income";

export const CATEGORY_META: Record<string, { label: string; icon: LucideIcon }> = {
  profession: { label: "Profession", icon: Briefcase },
  trade: { label: "Trade", icon: Wrench },
  owner_operator: { label: "Owner / operator", icon: Store },
  sales: { label: "Sales", icon: Phone },
  finance: { label: "Finance", icon: Landmark },
  tech: { label: "Tech", icon: Code },
  healthcare: { label: "Healthcare", icon: HeartPulse },
  internet_creator: { label: "Internet", icon: Globe },
  gig: { label: "Gig", icon: Laptop },
  other: { label: "Other", icon: Building2 },
};

export function categoryMeta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META.other;
}

export const DATA_QUALITY: Record<
  DataQuality,
  { label: string; className: string }
> = {
  verifiable: {
    label: "BLS-verified",
    className: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  },
  partial: {
    label: "Partial data",
    className: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  },
  self_reported: {
    label: "Self-reported",
    className: "bg-rose-400/15 text-rose-300 ring-rose-400/30",
  },
};

/** Humanize years-to-first-income: 0.25 -> "weeks", 0.5 -> "months", 3 -> "3 yr". */
export function timeLabel(years: number): string {
  if (years <= 0.3) return "weeks";
  if (years < 1) return "months";
  if (years < 1.5) return "~1 yr";
  return `${Math.round(years)} yr`;
}

export const CAPITAL_LABEL: Record<CapitalTier, { short: string; full: string }> = {
  none: { short: "$0", full: "no capital to start" },
  low: { short: "$", full: "low capital" },
  med: { short: "$$", full: "mid capital" },
  high: { short: "$$$", full: "high capital" },
};
