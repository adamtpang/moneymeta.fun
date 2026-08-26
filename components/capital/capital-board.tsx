import { ExternalLink } from "lucide-react";

import { TIER_STYLES } from "@/components/tier-styles";
import { formatPercent, formatUsd } from "@/lib/format";
import {
  CAPITAL_UNIVERSE_LABEL,
  type CapitalVehicle,
  type CapitalUniverse,
} from "@/lib/capital";
import type { Tier } from "@/lib/meta";

const TIER_ORDER: Tier[] = ["S", "A", "B", "C", "D"];

function CapitalCard({ vehicle }: { vehicle: CapitalVehicle }) {
  const style = TIER_STYLES[vehicle.tier];
  return (
    <a
      href={vehicle.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${vehicle.name}, ${vehicle.metricLabel} ${formatUsd(vehicle.latestValue)}, opens source in a new tab`}
      className={`group relative flex min-h-32 flex-col justify-between rounded-lg border bg-card/65 p-3 ring-1 ring-transparent transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${style.ring}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold leading-tight text-foreground">{vehicle.name}</p>
          <p className="mt-1 font-mono text-micro uppercase tracking-[0.08em] text-muted-foreground">
            {CAPITAL_UNIVERSE_LABEL[vehicle.universe]}
          </p>
        </div>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/45 transition-opacity group-hover:text-foreground/80" aria-hidden />
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="font-mono text-lg font-bold tabular-nums text-foreground">{formatUsd(vehicle.latestValue)}</p>
          <p className="mt-0.5 text-micro text-muted-foreground">{vehicle.metricLabel}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex rounded px-1.5 py-0.5 font-mono text-xs font-bold ring-1 ${style.score}`}>
            {vehicle.metaScore}
          </span>
          <p className={`mt-1 font-mono text-xs font-semibold tabular-nums ${vehicle.growthRate >= 0 ? "text-primary" : "text-rose-400"}`}>
            {formatPercent(vehicle.growthRate)}
          </p>
        </div>
      </div>
    </a>
  );
}

export function CapitalBoard({ groups }: { groups: Record<Tier, CapitalVehicle[]> }) {
  return (
    <section aria-labelledby="capital-tier-list-heading">
      <h2 id="capital-tier-list-heading" className="sr-only">Capital map tier list</h2>
      <div className="space-y-4">
        {TIER_ORDER.map((tier) => {
          const vehicles = groups[tier];
          const style = TIER_STYLES[tier];
          return (
            <section
              key={tier}
              aria-label={`${tier} tier, ${style.label}`}
              className={`grid overflow-hidden rounded-lg border border-l-2 bg-card/30 sm:grid-cols-[7rem_1fr] ${style.border}`}
            >
              <div className="flex items-center gap-3 border-b bg-background/25 px-3 py-3 sm:flex-col sm:items-start sm:border-b-0 sm:border-r">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded font-mono text-2xl font-black ${style.chip}`} aria-hidden>
                  {tier}
                </div>
                <div className="min-w-0">
                  <h3 className={`font-mono text-sm font-bold uppercase tracking-[0.1em] ${style.text}`}>{style.label}</h3>
                  <p className="text-xs text-muted-foreground">{vehicles.length} vehicles</p>
                </div>
              </div>
              <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => <CapitalCard key={vehicle.slug} vehicle={vehicle} />)}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
