import Link from "next/link";
import { Crosshair, ArrowRight } from "lucide-react";

import type { ThePickView } from "@/lib/meta-report";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";
import { CAPITAL_LABEL, categoryMeta, timeLabel } from "@/components/income/income-meta";

export function ThePick({ pick }: { pick: ThePickView }) {
  const { deck, lens, score, tier, reasons } = pick;
  const style = TIER_STYLES[tier];
  const cat = categoryMeta(deck.category);
  const cap = CAPITAL_LABEL[deck.capitalTier];
  const lensLabel = lens === "ceiling" ? "Highest ceiling" : "Best to start now";

  return (
    <section
      aria-label={`The pick under ${lensLabel}`}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-l-[3px] bg-gradient-to-br to-transparent p-4 sm:p-5",
        style.border,
        style.tint,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary ring-1 ring-primary/35">
              <Crosshair className="h-3 w-3" aria-hidden />
              The pick
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {lensLabel}
            </span>
          </div>

          <Link
            href={`/deck/${deck.slug}`}
            className="group/link inline-flex max-w-full items-center gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h2 className="truncate font-mono text-xl font-black tracking-tight text-foreground sm:text-2xl">
              {deck.name}
            </h2>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover/link:opacity-100"
              aria-hidden
            />
          </Link>

          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="uppercase tracking-[0.12em]">{cat.label}</span>
            <span className="text-border">·</span>
            <span className="font-mono tabular-nums">{formatUsd(deck.median)} median</span>
            <span className="text-border">·</span>
            <span>{timeLabel(deck.timeToFirstIncomeYears)} to first $</span>
            <span className="text-border">·</span>
            <span className="font-mono">{cap.short}</span>
          </div>

          <ul className="mt-3 space-y-1.5">
            {reasons.map((r) => (
              <li
                key={r}
                className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
              >
                <span className={cn("mt-1.5 h-1 w-1 shrink-0 rounded-full", style.chip.split(" ")[0])} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl font-mono text-3xl font-black",
              style.chip,
            )}
            title={`Tier ${tier}`}
          >
            {tier}
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Meta score
            </div>
            <div
              className={cn(
                "font-mono text-3xl font-black tabular-nums leading-none",
                style.text,
              )}
            >
              {score}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
