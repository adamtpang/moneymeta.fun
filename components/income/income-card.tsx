import { ArrowUpRight, Clock, TrendingUp, Users } from "lucide-react";

import type { IncomeDeckView, Lens } from "@/lib/income";
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

export function IncomeCard({ deck, lens }: { deck: IncomeDeckView; lens: Lens }) {
  const score = lens === "ceiling" ? deck.ceilingScore : deck.startNowScore;
  const tier: Tier = lens === "ceiling" ? deck.ceilingTier : deck.startNowTier;
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
          <a
            href={deck.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex max-w-full items-center gap-1 rounded text-sm font-semibold leading-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            title={`${deck.name}, source`}
          >
            <span className="truncate">{deck.name}</span>
            <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-60" aria-hidden />
          </a>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            <CatIcon className="h-3 w-3" aria-hidden />
            {cat.label}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums ring-1",
            style.score,
          )}
          title={`${lens === "ceiling" ? "Ceiling" : "Start-now"} score: ${score}/100`}
        >
          {score}
        </span>
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
