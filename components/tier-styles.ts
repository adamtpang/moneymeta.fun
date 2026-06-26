import { Bitcoin, Building2, Landmark, User, type LucideIcon } from "lucide-react";

import type { Tier } from "@/lib/meta";
import type { Category } from "@/lib/data";

/**
 * Per-tier visual language. Strings are full literal class names so Tailwind's
 * scanner picks them up (never build class names by concatenation).
 * Heat ramp: S amber → A violet → B sky → C emerald → D slate.
 */
export interface TierStyle {
  /** Big tier letter chip on the rail. */
  chip: string;
  /** Left border accent on the row. */
  border: string;
  /** Subtle row background tint. */
  tint: string;
  /** Meta-score badge on each card. */
  score: string;
  /** Card hover ring. */
  ring: string;
  label: string;
}

export const TIER_STYLES: Record<Tier, TierStyle> = {
  S: {
    chip: "bg-amber-400 text-amber-950 shadow-[0_0_24px_-4px] shadow-amber-400/50",
    border: "border-l-amber-400/70",
    tint: "from-amber-500/[0.08]",
    score: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
    ring: "hover:ring-amber-400/40",
    label: "Top of the meta",
  },
  A: {
    chip: "bg-violet-400 text-violet-950 shadow-[0_0_20px_-6px] shadow-violet-400/50",
    border: "border-l-violet-400/70",
    tint: "from-violet-500/[0.07]",
    score: "bg-violet-400/15 text-violet-300 ring-violet-400/30",
    ring: "hover:ring-violet-400/40",
    label: "Strong",
  },
  B: {
    chip: "bg-sky-400 text-sky-950",
    border: "border-l-sky-400/70",
    tint: "from-sky-500/[0.06]",
    score: "bg-sky-400/15 text-sky-300 ring-sky-400/30",
    ring: "hover:ring-sky-400/40",
    label: "Playable",
  },
  C: {
    chip: "bg-emerald-400 text-emerald-950",
    border: "border-l-emerald-400/70",
    tint: "from-emerald-500/[0.06]",
    score: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
    ring: "hover:ring-emerald-400/40",
    label: "Fringe",
  },
  D: {
    chip: "bg-slate-500 text-slate-50",
    border: "border-l-slate-500/70",
    tint: "from-slate-500/[0.05]",
    score: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
    ring: "hover:ring-slate-500/40",
    label: "Falling off",
  },
};

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: LucideIcon }
> = {
  asset_class: { label: "Asset Class", icon: Landmark },
  crypto: { label: "Crypto", icon: Bitcoin },
  company: { label: "Company", icon: Building2 },
  person: { label: "Person", icon: User },
};
