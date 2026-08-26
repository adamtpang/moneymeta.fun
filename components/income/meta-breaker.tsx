import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";

import type { MetaBreakerView } from "@/lib/meta-report";
import type { Lens } from "@/lib/income";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";

export function MetaBreaker({
  breaker,
  lens,
}: {
  breaker: MetaBreakerView;
  lens: Lens;
}) {
  const { deck, headline, lede, bullets } = breaker;
  const score = deck
    ? lens === "ceiling"
      ? deck.ceilingScore
      : deck.startNowScore
    : null;
  const tier = deck
    ? lens === "ceiling"
      ? deck.ceilingTier
      : deck.startNowTier
    : null;
  const style = tier ? TIER_STYLES[tier] : null;

  return (
    <section
      aria-label="Meta breaker of the week"
      className="h-full min-w-0 rounded-lg border border-amber-400/25 bg-card/45 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-amber-400/15 px-2 py-0.5 font-mono text-micro font-bold uppercase tracking-[0.08em] text-amber-300 ring-1 ring-amber-400/35">
            <Flame className="h-3 w-3" aria-hidden />
            Meta breaker
          </div>
          <h2 className="font-mono text-base font-bold text-foreground sm:text-lg">
            {headline}
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            {lede}
          </p>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
            {bullets.map((b) => (
              <li
                key={b}
                className="border-l border-amber-400/35 pl-2.5 text-label leading-snug text-muted-foreground"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>

        {deck ? (
          <Link
            href={`/deck/${deck.slug}`}
            className={cn(
              "group flex w-full shrink-0 flex-col items-start gap-3 rounded-md border border-border/70 bg-background/35 px-3 py-2.5 transition-colors hover:border-amber-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto sm:min-w-[190px]",
            )}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-micro font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Open playbook
                </div>
                <div className="truncate text-sm font-semibold text-foreground group-hover:text-amber-200">
                  {deck.name}
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            </div>
            <div className="flex w-full items-center gap-2">
              {tier && style ? (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 font-mono text-xs font-bold ring-1",
                    style.score,
                  )}
                >
                  {tier}
                </span>
              ) : null}
              {score != null ? (
                <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                  {score}
                </span>
              ) : null}
              <span className="ml-auto font-mono text-label text-muted-foreground">
                {formatUsd(deck.median)} med
              </span>
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
