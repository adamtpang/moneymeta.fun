import Link from "next/link";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import type { IncomeDeckView, Lens } from "@/lib/income";
import { getMovers, getHistoryAsOf } from "@/lib/income";
import { cn } from "@/lib/utils";

export function MoversStrip({
  decks,
  lens,
}: {
  decks: IncomeDeckView[];
  lens: Lens;
}) {
  const { risers, fallers } = getMovers(decks, lens, 5);
  const asOf = getHistoryAsOf();
  if (risers.length === 0 && fallers.length === 0) return null;

  return (
    <section
      aria-label="Week over week movers"
      className="rounded-2xl border bg-card/40 p-4 sm:p-5"
    >
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Meta movement
        </span>
        {asOf ? (
          <span className="font-mono text-[10px] text-muted-foreground">
            vs {asOf}
          </span>
        ) : null}
      </div>
      <h2 className="font-mono text-base font-bold tracking-tight text-foreground">
        Biggest risers and fallers
      </h2>
      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Score delta under the active lens vs the prior report snapshot. After each OEWS or
        seed refresh, run <span className="font-mono text-foreground">node scripts/snapshot-scores.mjs</span>{" "}
        to lock the next baseline.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MoverCol
          title="Risers"
          icon={<ArrowUp className="h-3.5 w-3.5 text-emerald-400" aria-hidden />}
          items={risers}
          lens={lens}
          tone="up"
        />
        <MoverCol
          title="Fallers"
          icon={<ArrowDown className="h-3.5 w-3.5 text-rose-400" aria-hidden />}
          items={fallers}
          lens={lens}
          tone="down"
        />
      </div>
    </section>
  );
}

function MoverCol({
  title,
  icon,
  items,
  lens,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: IncomeDeckView[];
  lens: Lens;
  tone: "up" | "down";
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
        {icon}
        {title}
      </div>
      {items.length === 0 ? (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Minus className="h-3 w-3" aria-hidden />
          No moves this period
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((d) => {
            const delta = lens === "ceiling" ? d.deltaCeiling : d.deltaStartNow;
            return (
              <li key={d.slug}>
                <Link
                  href={`/deck/${d.slug}`}
                  className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-xs transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="truncate font-medium text-foreground">{d.name}</span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[11px] font-bold tabular-nums",
                      tone === "up" ? "text-emerald-400" : "text-rose-400",
                    )}
                  >
                    {delta > 0 ? "+" : ""}
                    {delta}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
