import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Clock,
  Minus,
  TrendingUp,
  Users,
} from "lucide-react";

import type { IncomeDeckView, Lens, Movement } from "@/lib/income";
import type { Tier } from "@/lib/meta";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";
import {
  CAPITAL_LABEL,
  DATA_QUALITY,
  categoryMeta,
  timeLabel,
} from "@/components/income/income-meta";

function MovementChip({
  movement,
  delta,
}: {
  movement: Movement;
  delta: number;
}) {
  if (movement === "new") {
    return (
      <span
        className="inline-flex items-center rounded bg-sky-400/15 px-1 py-0.5 font-mono text-[10px] font-bold text-sky-300 ring-1 ring-sky-400/30"
        title="New on the board this report"
      >
        NEW
      </span>
    );
  }
  if (movement === "up") {
    return (
      <span
        className="inline-flex items-center gap-0.5 rounded bg-emerald-400/15 px-1 py-0.5 font-mono text-[10px] font-bold tabular-nums text-emerald-400 ring-1 ring-emerald-400/30"
        title={`Up ${delta} vs prior report`}
      >
        <ArrowUp className="h-3 w-3" aria-hidden />
        {delta > 0 ? `+${delta}` : delta}
      </span>
    );
  }
  if (movement === "down") {
    return (
      <span
        className="inline-flex items-center gap-0.5 rounded bg-rose-400/15 px-1 py-0.5 font-mono text-[10px] font-bold tabular-nums text-rose-400 ring-1 ring-rose-400/30"
        title={`Down ${delta} vs prior report`}
      >
        <ArrowDown className="h-3 w-3" aria-hidden />
        {delta}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded bg-secondary px-1 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
      title="Unchanged vs prior report"
    >
      <Minus className="h-3 w-3" aria-hidden />
    </span>
  );
}

export function IncomeCard({ deck, lens }: { deck: IncomeDeckView; lens: Lens }) {
  const score = lens === "ceiling" ? deck.ceilingScore : deck.startNowScore;
  const tier: Tier = lens === "ceiling" ? deck.ceilingTier : deck.startNowTier;
  const movement = lens === "ceiling" ? deck.movementCeiling : deck.movementStartNow;
  const delta = lens === "ceiling" ? deck.deltaCeiling : deck.deltaStartNow;
  const style = TIER_STYLES[tier];
  const cat = categoryMeta(deck.category);
  const CatIcon = cat.icon;
  const dq = DATA_QUALITY[deck.dataQuality];
  const cap = CAPITAL_LABEL[deck.capitalTier];

  return (
    <div
      className={cn(
        "group flex flex-col gap-2.5 rounded-xl border border-border/70 bg-card/80 p-3.5",
        "ring-1 ring-transparent backdrop-blur-sm transition-all duration-200",
        "hover:-translate-y-1 hover:border-border hover:bg-card",
        style.ring,
        style.glow,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/deck/${deck.slug}`}
            className="group/link inline-flex max-w-full items-center gap-1 rounded text-sm font-semibold leading-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            title={`${deck.name} playbook`}
          >
            <span className="truncate">{deck.name}</span>
            <BookOpen className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-60" aria-hidden />
          </Link>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            <CatIcon className="h-3 w-3" aria-hidden />
            {cat.label}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums ring-1",
              style.score,
            )}
            title={`${lens === "ceiling" ? "Ceiling" : "Start-now"} score: ${score}/100`}
          >
            {score}
          </span>
          <MovementChip movement={movement} delta={delta} />
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="font-mono text-xl font-bold leading-none tracking-tight tabular-nums text-foreground">
          {formatUsd(deck.median)}
          <span className="ml-1 font-sans text-[10px] font-medium text-muted-foreground">
            median
          </span>
        </div>
        {deck.growthPct > 0 ? (
          <div className="flex items-center gap-0.5 rounded-md bg-emerald-400/10 px-1.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />+{deck.growthPct}%
          </div>
        ) : null}
      </div>

      {/* VS-style quantity (play) × quality (livable / win rate) */}
      <div className="grid grid-cols-2 gap-1.5">
        <div
          className="rounded-md bg-secondary/80 px-1.5 py-1"
          title="Relative play rate: how crowded this path is"
        >
          <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Play
          </div>
          <div className="font-mono text-xs font-bold tabular-nums text-foreground">
            {deck.playRate}
            <span className="text-[10px] font-medium text-muted-foreground">/100</span>
          </div>
        </div>
        <div
          className="rounded-md bg-secondary/80 px-1.5 py-1"
          title="Estimated livable full-time rate (win rate proxy)"
        >
          <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Win
          </div>
          <div
            className={cn(
              "font-mono text-xs font-bold tabular-nums",
              deck.livablePct >= 20
                ? "text-emerald-400"
                : deck.livablePct >= 8
                  ? "text-amber-300"
                  : "text-rose-300",
            )}
          >
            {deck.livablePct}
            <span className="text-[10px] font-medium text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium">
        <span
          className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-muted-foreground"
          title="Time to first income"
        >
          <Clock className="h-3 w-3" aria-hidden />
          {timeLabel(deck.timeToFirstIncomeYears)}
        </span>
        <span
          className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 font-mono text-muted-foreground"
          title={cap.full}
        >
          {cap.short}
        </span>
        <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 ring-1", dq.className)}>
          {dq.label}
        </span>
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {deck.whatYouDo}
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={`/deck/${deck.slug}`}
          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/25 transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BookOpen className="h-3 w-3" aria-hidden />
          Playbook
        </Link>
        <a
          href={deck.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Source <ArrowUpRight className="h-3 w-3" aria-hidden />
        </a>
      </div>

      {deck.exemplars.length > 0 ? (
        <div className="mt-0.5 border-t border-border/70 pt-2">
          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <Users className="h-3 w-3" aria-hidden />
            Who&apos;s winning it
          </div>
          <div className="flex flex-wrap gap-1">
            {deck.exemplars.slice(0, 4).map((ex) => (
              <a
                key={ex.handle}
                href={ex.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${ex.name}: ${ex.note} (${ex.rev})`}
                className="inline-flex items-center gap-1 rounded-md bg-accent/60 px-1.5 py-0.5 text-[11px] font-medium text-foreground/90 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              >
                {ex.name}
                <span className="font-mono text-[10px] text-primary">{ex.rev}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
