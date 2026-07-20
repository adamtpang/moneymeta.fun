import type { IncomeDeckView } from "@/lib/income";
import { classFrequency } from "@/lib/income";
import { cn } from "@/lib/utils";

const BAR: Record<string, string> = {
  attention: "bg-rose-400",
  owned: "bg-violet-400",
  digital_product: "bg-fuchsia-400",
  commerce: "bg-amber-400",
  software: "bg-cyan-400",
  service: "bg-emerald-400",
  arbitrage: "bg-sky-400",
  gig: "bg-orange-400",
  career: "bg-primary",
  other: "bg-slate-400",
};

/**
 * VS-style class frequency strip: how much of the "ladder" each class is
 * (weighted by playRate) and average livable % (win-rate proxy).
 */
export function ClassFrequency({ decks }: { decks: IncomeDeckView[] }) {
  const rows = classFrequency(decks);
  const maxShare = Math.max(...rows.map((r) => r.share), 1);

  return (
    <section
      aria-label="Class frequency, play rate by meta class"
      className="rounded-2xl border bg-card/40 p-4 sm:p-5"
    >
      <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Class frequency
      </div>
      <h2 className="font-mono text-base font-bold tracking-tight text-foreground">
        What is being played
      </h2>
      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Play rate is relative ladder traffic (how crowded the path is). Livable % is the
        estimated win rate: share of players who clear a full-time income. High play + low
        livable = overplayed bait. Estimates, not a census.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.metaClass} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-2 sm:grid-cols-[9rem_1fr_auto]">
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-foreground">{r.label}</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {r.count} decks
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full", BAR[r.metaClass] ?? BAR.other)}
                style={{ width: `${(r.share / maxShare) * 100}%` }}
              />
            </div>
            <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] tabular-nums">
              <span className="w-10 text-right text-foreground">{r.share}%</span>
              <span
                className={cn(
                  "w-14 text-right",
                  r.avgLivable >= 20
                    ? "text-emerald-400"
                    : r.avgLivable >= 8
                      ? "text-amber-300"
                      : "text-rose-300",
                )}
                title="Average livable % (win rate proxy)"
              >
                {r.avgLivable}% wr
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
