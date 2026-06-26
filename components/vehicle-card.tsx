import { ExternalLink, TrendingDown, TrendingUp } from "lucide-react";

import type { VehicleView } from "@/lib/data";
import { formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CATEGORY_META, TIER_STYLES } from "@/components/tier-styles";

export function VehicleCard({ v }: { v: VehicleView }) {
  const style = TIER_STYLES[v.tier];
  const category = CATEGORY_META[v.category];
  const CategoryIcon = category.icon;

  const up = v.growth > 0.0005;
  const down = v.growth < -0.0005;
  const TrendIcon = up ? TrendingUp : down ? TrendingDown : null;
  const host = new URL(v.sourceUrl).hostname.replace(/^www\./, "");

  return (
    <a
      href={v.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`${v.name} — source: ${host}`}
      aria-label={`${v.name}: ${formatUsd(v.marketCap)}, ${formatPercent(v.growth)} 30-day, meta score ${v.score}. Opens source at ${host} in a new tab.`}
      className={cn(
        "group relative flex flex-col justify-between gap-2.5 rounded-lg border bg-card p-3",
        "ring-1 ring-transparent transition-all duration-150 hover:-translate-y-0.5 hover:bg-accent/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        style.ring,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold leading-tight text-foreground">
            {v.name}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            <CategoryIcon className="h-3 w-3" aria-hidden />
            {category.label}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums ring-1",
            style.score,
          )}
          title={`Meta score: ${v.score}/100`}
        >
          {v.score}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="font-mono text-lg font-bold leading-none tabular-nums text-foreground">
          {formatUsd(v.marketCap)}
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 font-mono text-xs font-semibold tabular-nums",
            up && "text-emerald-400",
            down && "text-rose-400",
            !up && !down && "text-muted-foreground",
          )}
        >
          {TrendIcon ? <TrendIcon className="h-3.5 w-3.5" aria-hidden /> : null}
          {formatPercent(v.growth)}
        </div>
      </div>

      <ExternalLink
        className="absolute right-2 top-2 h-3 w-3 text-muted-foreground opacity-40 transition-opacity sm:opacity-0 sm:group-hover:opacity-60"
        aria-hidden
      />
    </a>
  );
}
