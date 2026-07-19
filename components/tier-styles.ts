import type { Tier } from "@/lib/meta";

/**
 * Per-tier visual language. Strings are full literal class names so Tailwind's
 * scanner picks them up (never build class names by concatenation).
 * Heat ramp: S amber, A violet, B cyan, C emerald, D slate.
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
    chip: "bg-amber-400 text-amber-950 shadow-[0_0_28px_-2px] shadow-amber-400/60",
    border: "border-l-amber-400/80",
    tint: "from-amber-500/[0.09]",
    score: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
    ring: "hover:ring-amber-400/50",
    glow: "hover:shadow-xl hover:shadow-amber-400/20",
    text: "text-amber-300",
    label: "Top of the meta",
  },
  A: {
    chip: "bg-violet-400 text-violet-950 shadow-[0_0_24px_-4px] shadow-violet-400/55",
    border: "border-l-violet-400/80",
    tint: "from-violet-500/[0.08]",
    score: "bg-violet-400/15 text-violet-300 ring-violet-400/30",
    ring: "hover:ring-violet-400/50",
    glow: "hover:shadow-xl hover:shadow-violet-400/20",
    text: "text-violet-300",
    label: "Strong",
  },
  B: {
    chip: "bg-cyan-400 text-cyan-950 shadow-[0_0_22px_-6px] shadow-cyan-400/50",
    border: "border-l-cyan-400/80",
    tint: "from-cyan-500/[0.07]",
    score: "bg-cyan-400/15 text-cyan-300 ring-cyan-400/30",
    ring: "hover:ring-cyan-400/50",
    glow: "hover:shadow-xl hover:shadow-cyan-400/15",
    text: "text-cyan-300",
    label: "Playable",
  },
  C: {
    chip: "bg-emerald-400 text-emerald-950 shadow-[0_0_22px_-6px] shadow-emerald-400/50",
    border: "border-l-emerald-400/80",
    tint: "from-emerald-500/[0.06]",
    score: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
    ring: "hover:ring-emerald-400/50",
    glow: "hover:shadow-xl hover:shadow-emerald-400/15",
    text: "text-emerald-300",
    label: "Fringe",
  },
  D: {
    chip: "bg-slate-500 text-slate-50 shadow-[0_0_18px_-8px] shadow-slate-400/40",
    border: "border-l-slate-500/70",
    tint: "from-slate-500/[0.05]",
    score: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
    ring: "hover:ring-slate-400/40",
    glow: "hover:shadow-xl hover:shadow-slate-400/10",
    text: "text-slate-300",
    label: "Falling off",
  },
};
