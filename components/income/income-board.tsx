"use client";

import { useMemo, useState } from "react";
import { Rocket, Trophy } from "lucide-react";

import type { IncomeDeckView, Lens } from "@/lib/income";
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

const LENS_COPY: Record<Lens, { label: string; icon: typeof Rocket; blurb: string }> = {
  startNow: {
    label: "Best to start now",
    icon: Rocket,
    blurb:
      "Ranked by income over barrier over time, what a high-agency person with little capital can reach fastest.",
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
    for (const t of TIER_ORDER) b[t].sort((a, c) => c[scoreKey] - a[scoreKey]);
    return b;
  }, [decks, scoreKey, tierKey]);

  const pick = useMemo(() => getThePick(decks, lens), [decks, lens]);
  const breaker = useMemo(() => resolveMetaBreaker(decks), [decks]);
  const matchups = useMemo(() => resolveMatchups(decks), [decks]);

  return (
    <div>
      {/* Lens toggle */}
      <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="inline-flex rounded-lg border border-border/70 bg-card/80 p-1 backdrop-blur-sm"
          role="tablist"
          aria-label="Ranking lens"
        >
          {(Object.keys(LENS_COPY) as Lens[]).map((key) => {
            const Icon = LENS_COPY[key].icon;
            const active = lens === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setLens(key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_-6px] shadow-primary/60"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {LENS_COPY[key].label}
              </button>
            );
          })}
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          {LENS_COPY[lens].blurb}
        </p>
      </div>

      {/* VS report layer: The Pick → Meta Breaker → Class freq → Matchups → tiers */}
      <div className="mb-5 flex flex-col gap-3">
        {pick ? <ThePick pick={pick} /> : null}
        <MetaBreaker breaker={breaker} lens={lens} />
        <div className="rounded-lg border border-border/50 bg-background/30 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">{report.title}</span>
          <span className="mx-1.5 text-border">·</span>
          <span className="font-mono">{report.asOf}</span>
          <span className="mx-1.5 text-border">·</span>
          {report.lede}
          <span className="mx-1.5 text-border">·</span>
          <span className="font-mono text-foreground">{decks.length} decks</span>
        </div>
        <ClassFrequency decks={decks} />
        <MatchupChart matchups={matchups} lens={lens} />
      </div>

      {/* Tier rows */}
      <div className="flex flex-col gap-3">
        {TIER_ORDER.map((tier, i) => {
          const style = TIER_STYLES[tier];
          const items = grouped[tier];
          return (
            <section
              key={tier}
              aria-label={`Tier ${tier}: ${style.label}`}
              style={{ animationDelay: `${i * 70}ms` }}
              className={cn(
                "flex animate-rise flex-col gap-3 rounded-2xl border border-l-[3px] bg-gradient-to-r to-transparent p-3 sm:flex-row sm:gap-4 sm:p-4",
                style.border,
                style.tint,
              )}
            >
              <div className="flex shrink-0 items-center gap-3 sm:w-28 sm:flex-col sm:items-start sm:gap-2.5 sm:pt-1">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl font-mono text-3xl font-black",
                    style.chip,
                  )}
                >
                  {tier}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className={cn("text-xs font-semibold", style.text)}>
                    {style.label}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {items.length} {items.length === 1 ? "deck" : "decks"}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                {items.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((deck) => (
                      <IncomeCard key={deck.slug} deck={deck} lens={lens} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[72px] items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground">
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
