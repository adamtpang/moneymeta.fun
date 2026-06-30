"use client";

import { useMemo, useState } from "react";
import { Rocket, Trophy } from "lucide-react";

import type { IncomeDeckView, Lens } from "@/lib/income";
import { TIER_ORDER, type Tier } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";
import { IncomeCard } from "@/components/income/income-card";

const LENS_COPY: Record<Lens, { label: string; icon: typeof Rocket; blurb: string }> = {
  startNow: {
    label: "Best to start now",
    icon: Rocket,
    blurb:
      "Ranked by income ÷ barrier ÷ time — what a high-agency person with little capital can reach fastest.",
  },
  ceiling: {
    label: "Highest ceiling",
    icon: Trophy,
    blurb:
      "Ranked by terminal pay and trajectory — the biggest outcomes if you have the years and capital to climb.",
  },
};

export function IncomeBoard({ decks }: { decks: IncomeDeckView[] }) {
  const [lens, setLens] = useState<Lens>("startNow");
  const scoreKey = lens === "ceiling" ? "ceilingScore" : "startNowScore";
  const tierKey = lens === "ceiling" ? "ceilingTier" : "startNowTier";

  const grouped = useMemo(() => {
    const b: Record<Tier, IncomeDeckView[]> = { S: [], A: [], B: [], C: [], D: [] };
    for (const d of decks) b[d[tierKey]].push(d);
    for (const t of TIER_ORDER) b[t].sort((a, c) => c[scoreKey] - a[scoreKey]);
    return b;
  }, [decks, scoreKey, tierKey]);

  return (
    <div>
      {/* Lens toggle */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="inline-flex rounded-lg border bg-card p-0.5"
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
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary text-primary-foreground"
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

      {/* Tier rows */}
      <div className="flex flex-col gap-3">
        {TIER_ORDER.map((tier) => {
          const style = TIER_STYLES[tier];
          const items = grouped[tier];
          return (
            <section
              key={tier}
              aria-label={`Tier ${tier}: ${style.label}`}
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-l-4 bg-gradient-to-r to-transparent p-3 sm:flex-row sm:gap-4 sm:p-4",
                style.border,
                style.tint,
              )}
            >
              <div className="flex shrink-0 items-center gap-3 sm:w-28 sm:flex-col sm:items-start sm:gap-2 sm:pt-1">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg text-2xl font-black",
                    style.chip,
                  )}
                >
                  {tier}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-foreground">{style.label}</span>
                  <span className="text-[11px] text-muted-foreground">
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
                  <div className="flex h-full min-h-[64px] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
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
