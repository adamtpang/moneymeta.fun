import Link from "next/link";
import { GitBranch, ArrowRight } from "lucide-react";

import type { IncomeDeckView, Lens } from "@/lib/income";
import type { ResolvedMatchup } from "@/lib/meta-report";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";

export function MatchupChart({
  matchups,
  lens,
}: {
  matchups: ResolvedMatchup[];
  lens: Lens;
}) {
  return (
    <section aria-label="Matchup chart, hybrid money stacks" className="rounded-2xl border bg-card/40 p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
            <GitBranch className="h-3 w-3" aria-hidden />
            Matchup chart
          </div>
          <h2 className="font-mono text-base font-bold tracking-tight text-foreground">
            Hybrid stacks beat pure single-class decks
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Opener discovers or funds. Midgame owns the relationship. Wincon is where the
            cash actually clears. Scores follow the active lens.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {matchups.map((m) => (
          <article
            key={m.id}
            className="flex flex-col gap-2.5 rounded-xl border border-border/70 bg-background/40 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-foreground">{m.name}</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {m.role}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <PhaseChip label="Open" deck={m.opener} lens={lens} />
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/60" aria-hidden />
              <PhaseChip label="Mid" deck={m.midgame} lens={lens} />
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/60" aria-hidden />
              <PhaseChip label="Win" deck={m.wincon} lens={lens} highlight />
            </div>

            <p className="text-[11px] leading-snug text-muted-foreground">{m.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PhaseChip({
  label,
  deck,
  lens,
  highlight = false,
}: {
  label: string;
  deck: IncomeDeckView | null;
  lens: Lens;
  highlight?: boolean;
}) {
  if (!deck) {
    return (
      <span className="rounded-md border border-dashed border-border/70 px-2 py-1 text-[10px] text-muted-foreground">
        {label}: missing
      </span>
    );
  }
  const score = lens === "ceiling" ? deck.ceilingScore : deck.startNowScore;
  const tier = lens === "ceiling" ? deck.ceilingTier : deck.startNowTier;
  const style = TIER_STYLES[tier];

  return (
    <Link
      href={`/deck/${deck.slug}`}
      title={`${deck.name} · score ${score}`}
      className={cn(
        "inline-flex max-w-[9.5rem] flex-col rounded-md border px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        highlight
          ? "border-primary/40 bg-primary/10 hover:bg-primary/15"
          : "border-border/70 bg-card/70 hover:border-border",
      )}
    >
      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="truncate text-[11px] font-semibold leading-tight text-foreground">
        {deck.name}
      </span>
      <span className={cn("font-mono text-[10px] font-bold tabular-nums", style.text)}>
        {tier} · {score}
      </span>
    </Link>
  );
}
