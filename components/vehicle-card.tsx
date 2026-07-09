import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import type { VehicleView } from "@/lib/data";
import { formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CATEGORY_META, TIER_STYLES } from "@/components/tier-styles";

export function VehicleCard({ v }: { v: VehicleView }) {
  const style = TIER_STYLES[v.tier];
  const category = CATEGORY_META[v.category];
  const CategoryIcon = category.icon;
  const host = new URL(v.sourceUrl).hostname.replace(/^www\./, "");

  const up = v.growth > 0.0005;
  const down = v.growth < -0.0005;
  const TrendIcon = up ? TrendingUp : down ? TrendingDown : null;

  return (
    <a
      href={v.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`${v.name}, source: ${host}`}
      aria-label={`Rank ${v.rank}. ${v.name}: ${formatUsd(v.marketCap)}, ${formatPercent(v.growth)}, meta score ${v.score}. Opens source at ${host}.`}
      className={cn(
        "group relative flex flex-col justify-between gap-3 rounded-lg border border-l-2 border-border/70 bg-card/80 p-3.5",
        "ring-1 ring-transparent backdrop-blur-sm transition-all duration-200",
        "hover:-translate-y-1 hover:border-border hover:bg-card",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        category.accent,
        style.ring,
        style.glow,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-semibold tabular-nums text-muted-foreground">
              #{v.rank}
            </span>
            <span className="truncate text-sm font-semibold leading-tight text-foreground">
              {v.name}
            </span>
          </div>
          <div
            className={cn(
              "mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]",
              category.chip,
            )}
          >
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
        <div className="font-mono text-xl font-bold leading-none tracking-tight tabular-nums text-foreground">
          {formatUsd(v.marketCap)}
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold tabular-nums",
            up && "bg-emerald-400/10 text-emerald-400",
            down && "bg-rose-400/10 text-rose-400",
            !up && !down && "text-muted-foreground",
          )}
        >
          {TrendIcon ? <TrendIcon className="h-3.5 w-3.5" aria-hidden /> : null}
          {formatPercent(v.growth)}
        </div>
      </div>

      <ArrowUpRight
        className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-60"
        aria-hidden
      />
    </a>
  );
}
