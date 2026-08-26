"use client";

import { useMemo, useState } from "react";
import { Rocket, Trophy } from "lucide-react";

import { getMovers, type IncomeDeckView, type Lens } from "@/lib/income";
import {
  getThePick,
  resolveMatchups,
  resolveMetaBreaker,
  type MetaReportSeed,
} from "@/lib/meta-report";
import { TIER_ORDER, type Tier } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";
import { IncomeCard } from "@/components/income/income-card";
import { ThePick } from "@/components/income/the-pick";
import { MetaBreaker } from "@/components/income/meta-breaker";
import { MatchupChart } from "@/components/income/matchup-chart";
import { ClassFrequency } from "@/components/income/class-frequency";
import { MoversStrip } from "@/components/income/movers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LENS_COPY: Record<Lens, { label: string; icon: typeof Rocket; blurb: string }> = {
  startNow: {
    label: "Best to start now",
    icon: Rocket,
    blurb:
      "Ranked by win-rate-adjusted payoff, growth, and reachability: the strongest path to open today.",
  },
  ceiling: {
    label: "Highest ceiling",
    icon: Trophy,
    blurb:
      "Ranked by terminal pay and trajectory, the biggest outcomes if you have the years and capital to climb.",
  },
};

export function IncomeBoard({
  decks,
  report,
}: {
  decks: IncomeDeckView[];
  report: MetaReportSeed;
}) {
  const [lens, setLens] = useState<Lens>("startNow");
  const scoreKey = lens === "ceiling" ? "ceilingScore" : "startNowScore";
  const tierKey = lens === "ceiling" ? "ceilingTier" : "startNowTier";

  const grouped = useMemo(() => {
    const b: Record<Tier, IncomeDeckView[]> = { S: [], A: [], B: [], C: [], D: [] };
    for (const d of decks) b[d[tierKey]].push(d);
    for (const t of TIER_ORDER) {
      b[t].sort((a, c) => c[scoreKey] - a[scoreKey] || a.slug.localeCompare(c.slug));
    }
    return b;
  }, [decks, scoreKey, tierKey]);

  const pick = useMemo(() => getThePick(decks, lens), [decks, lens]);
  const breaker = useMemo(() => resolveMetaBreaker(decks), [decks]);
  const matchups = useMemo(() => resolveMatchups(decks), [decks]);
  const hasMovers = useMemo(() => {
    const { risers, fallers } = getMovers(decks, lens, 5);
    return risers.length > 0 || fallers.length > 0;
  }, [decks, lens]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={lens} onValueChange={(value) => setLens(value as Lens)}>
          <TabsList className="h-10 border bg-card p-1" aria-label="Ranking lens">
            {(Object.keys(LENS_COPY) as Lens[]).map((key) => {
              const Icon = LENS_COPY[key].icon;
              return (
                <TabsTrigger key={key} value={key} className="h-8 gap-1.5 px-3 text-xs">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {LENS_COPY[key].label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          {LENS_COPY[lens].blurb}
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3">
        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
          {pick ? <ThePick pick={pick} /> : null}
          <MetaBreaker breaker={breaker} lens={lens} />
        </div>
        <div className="rounded-lg border border-border/50 bg-background/30 px-3 py-2 text-label leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">{report.title}</span>
          <span className="mx-1.5 text-border">·</span>
          <span className="font-mono">{report.asOf}</span>
          <span className="mx-1.5 text-border">·</span>
          {report.lede}
          <span className="mx-1.5 text-border">·</span>
          <span className="font-mono text-foreground">{decks.length} decks</span>
        </div>
        <div className={cn("grid min-w-0 grid-cols-1 gap-3", hasMovers && "lg:grid-cols-2")}>
          <ClassFrequency decks={decks} />
          {hasMovers ? <MoversStrip decks={decks} lens={lens} /> : null}
        </div>
        <MatchupChart matchups={matchups} lens={lens} />
      </div>

      <div className="flex flex-col gap-3">
        {TIER_ORDER.map((tier) => {
          const style = TIER_STYLES[tier];
          const items = grouped[tier];
          return (
            <section
              key={tier}
              aria-label={`Tier ${tier}: ${style.label}`}
              className={cn(
                "grid overflow-hidden rounded-lg border border-l-2 bg-card/30 sm:grid-cols-[6.5rem_1fr]",
                style.border,
              )}
            >
              <div className="flex items-center gap-3 border-b bg-background/25 p-3 sm:flex-col sm:items-start sm:justify-start sm:border-b-0 sm:border-r">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-md font-mono text-2xl font-black",
                    style.chip,
                  )}
                >
                  {tier}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className={cn("text-xs font-semibold", style.text)}>
                    {style.label}
                  </span>
                  <span className="font-mono text-label text-muted-foreground">
                    {items.length} {items.length === 1 ? "deck" : "decks"}
                  </span>
                </div>
              </div>

              <div className="p-3">
                {items.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((deck) => (
                      <IncomeCard key={deck.slug} deck={deck} lens={lens} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[72px] items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                    No decks in this tier under this lens
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
