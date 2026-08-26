import type { Tier } from "@/lib/meta";

/**
 * Per-tier visual language. Strings are full literal class names so Tailwind's
 * scanner picks them up (never build class names by concatenation).
 * Heat ramp: S amber, A violet, B cyan, C teal, D slate.
 *
 * C was emerald until 2026-08-08. Emerald is already this app's primary/
 * positive-signal color (growth %, "up" movement, "verifiable" data quality,
 * the brand mark itself), so a fringe C-tier deck rendered in the same hue as
 * "growing" and "trustworthy" was a real collision, not a stylistic choice.
 * Teal keeps the same cool, muted, middling read without doubling as brand.
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
  /** Card hover glow (colored drop shadow). */
  glow: string;
  /** Rail letter text glow. */
  text: string;
  label: string;
}

export const TIER_STYLES: Record<Tier, TierStyle> = {
  S: {
    chip: "bg-amber-400 text-amber-950",
    border: "border-l-amber-400/80",
    tint: "from-amber-500/[0.09]",
    score: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
    ring: "hover:ring-amber-400/50",
    glow: "",
    text: "text-amber-300",
    label: "Top of the meta",
  },
  A: {
    chip: "bg-violet-400 text-violet-950",
    border: "border-l-violet-400/80",
    tint: "from-violet-500/[0.08]",
    score: "bg-violet-400/15 text-violet-300 ring-violet-400/30",
    ring: "hover:ring-violet-400/50",
    glow: "",
    text: "text-violet-300",
    label: "Strong",
  },
  B: {
    chip: "bg-cyan-400 text-cyan-950",
    border: "border-l-cyan-400/80",
    tint: "from-cyan-500/[0.07]",
    score: "bg-cyan-400/15 text-cyan-300 ring-cyan-400/30",
    ring: "hover:ring-cyan-400/50",
    glow: "",
    text: "text-cyan-300",
    label: "Playable",
  },
  C: {
    chip: "bg-teal-400 text-teal-950",
    border: "border-l-teal-400/80",
    tint: "from-teal-500/[0.06]",
    score: "bg-teal-400/15 text-teal-300 ring-teal-400/30",
    ring: "hover:ring-teal-400/50",
    glow: "",
    text: "text-teal-300",
    label: "Fringe",
  },
  D: {
    chip: "bg-slate-500 text-slate-50",
    border: "border-l-slate-500/70",
    tint: "from-slate-500/[0.05]",
    score: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
    ring: "hover:ring-slate-400/40",
    glow: "",
    text: "text-slate-300",
    label: "Falling off",
  },
};
