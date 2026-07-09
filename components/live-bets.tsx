import { ArrowUpRight, Swords } from "lucide-react";

import bets from "@/seed/bets.json";
import type { Tier } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";

interface Bet {
  slug: string;
  domain: string;
  url: string;
  play: string;
  tier: Tier;
  status: string;
  note: string;
}

export function LiveBets() {
  const list = bets as Bet[];
  return (
    <section
      aria-label="The meta in action"
      className="mb-6 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent p-4 sm:mb-8 sm:p-5"
    >
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4 text-primary" aria-hidden />
          <span className="text-sm font-semibold text-foreground">
            The meta, in action
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          S-tier AI plays, in build right now
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((bet) => {
          const style = TIER_STYLES[bet.tier];
          return (
            <a
              key={bet.slug}
              href={bet.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex flex-col gap-2 rounded-xl border border-border/70 bg-card/80 p-3.5",
                "ring-1 ring-transparent backdrop-blur-sm transition-all duration-200",
                "hover:-translate-y-1 hover:border-border hover:bg-card",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                style.ring,
                style.glow,
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-sm font-bold tracking-tight text-foreground">
                  {bet.domain}
                  <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" aria-hidden />
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] font-black ring-1",
                    style.score,
                  )}
                >
                  {bet.tier}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                </span>
                {bet.status}
                <span className="text-border">·</span>
                {bet.play}
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {bet.note}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
