import { ExternalLink } from "lucide-react";

import { TIER_STYLES } from "@/components/tier-styles";
import { cn } from "@/lib/utils";
import {
  EVIDENCE_LABELS,
  SOLO_STATUS_LABELS,
  formatSoloRevenue,
  type RankedSolopreneur,
  type SoloStatus,
  type SolopreneurEvidence,
} from "@/lib/solopreneurs";

const evidenceStyles: Record<SolopreneurEvidence, string> = {
  corroborated: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
  founder_disclosed: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
  reported_estimate: "bg-slate-400/10 text-slate-300 ring-slate-400/25",
};

const statusStyles: Record<SoloStatus, string> = {
  current_solo: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/25",
  solo_at_metric: "bg-violet-400/10 text-violet-300 ring-violet-400/25",
  effectively_solo: "bg-slate-400/10 text-slate-300 ring-slate-400/25",
};

function EvidenceBadge({ evidence }: { evidence: SolopreneurEvidence }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-micro font-semibold ring-1",
        evidenceStyles[evidence],
      )}
    >
      {EVIDENCE_LABELS[evidence]}
    </span>
  );
}

function StatusBadge({ status }: { status: SoloStatus }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-micro font-semibold ring-1",
        statusStyles[status],
      )}
    >
      {SOLO_STATUS_LABELS[status]}
    </span>
  );
}

function Score({ operator }: { operator: RankedSolopreneur }) {
  const style = TIER_STYLES[operator.tier];
  const { scale, evidence, soloPurity, duration } = operator.breakdown;

  return (
    <div className="text-right">
      <span
        className={cn(
          "inline-flex min-w-11 justify-center rounded px-2 py-1 font-mono text-base font-black tabular-nums ring-1",
          style.score,
        )}
        aria-label={`${operator.score} index points, ${scale} scale, ${evidence} evidence, ${soloPurity} solo purity, ${duration} duration`}
      >
        {operator.score}
      </span>
      <p className="mt-1 whitespace-nowrap font-mono text-[9px] tabular-nums text-muted-foreground">
        {scale}+{evidence}+{soloPurity}+{duration}
      </p>
    </div>
  );
}

export function SolopreneurIndex({ operators }: { operators: RankedSolopreneur[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card/45">
      <div className="hidden grid-cols-[3.25rem_minmax(170px,1.4fr)_minmax(155px,1fr)_5rem_9.25rem_9.25rem_2.5rem] items-center gap-3 border-b bg-muted/35 px-3 py-2 font-mono text-micro font-semibold uppercase tracking-[0.08em] text-muted-foreground lg:grid">
        <span>Rank</span>
        <span>Operator</span>
        <span>Peak solo revenue</span>
        <span className="text-right">Score</span>
        <span>Status</span>
        <span>Evidence</span>
        <span className="sr-only">Source</span>
      </div>

      <ol>
        {operators.map((operator) => {
          const style = TIER_STYLES[operator.tier];
          return (
            <li
              key={operator.slug}
              className={cn(
                "border-b border-l-2 transition-colors last:border-b-0 hover:bg-accent/35",
                style.border,
              )}
            >
              <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_4.25rem] gap-x-3 gap-y-2 p-3 lg:hidden">
                <div className="row-span-3 pt-0.5 text-center">
                  <p className="font-mono text-lg font-black tabular-nums text-foreground">
                    {operator.rank}
                  </p>
                  <span
                    className={cn(
                      "mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded px-1 font-mono text-micro font-black ring-1",
                      style.score,
                    )}
                  >
                    {operator.tier}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{operator.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {operator.business} · {operator.category}
                  </p>
                </div>
                <Score operator={operator} />

                <div className="col-span-2 col-start-2 flex min-w-0 items-baseline justify-between gap-3 border-t border-border/70 pt-2">
                  <div className="min-w-0" title={operator.metricNote}>
                    <p className="font-mono text-sm font-bold tabular-nums text-foreground">
                      {formatSoloRevenue(operator.annualRevenueUsd)}
                    </p>
                    <p className="truncate text-micro text-muted-foreground">
                      {operator.metricLabel}, {operator.metricYear}
                    </p>
                  </div>
                  <a
                    href={operator.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open source for ${operator.name}`}
                    aria-label={`Open source for ${operator.name} in a new tab`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>

                <div className="col-span-2 col-start-2 flex flex-wrap gap-1.5">
                  <StatusBadge status={operator.soloStatus} />
                  <EvidenceBadge evidence={operator.evidence} />
                </div>
              </div>

              <div className="hidden grid-cols-[3.25rem_minmax(170px,1.4fr)_minmax(155px,1fr)_5rem_9.25rem_9.25rem_2.5rem] items-center gap-3 px-3 py-3 lg:grid">
                <div>
                  <span className="font-mono text-lg font-black tabular-nums text-foreground">
                    {operator.rank}
                  </span>
                  <span
                    className={cn(
                      "ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded px-1 font-mono text-micro font-black ring-1",
                      style.score,
                    )}
                  >
                    {operator.tier}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{operator.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {operator.business} · {operator.category}
                  </p>
                </div>
                <div className="min-w-0" title={operator.metricNote}>
                  <p className="font-mono text-sm font-bold tabular-nums text-foreground">
                    {formatSoloRevenue(operator.annualRevenueUsd)}
                  </p>
                  <p className="mt-0.5 truncate text-micro text-muted-foreground">
                    {operator.metricLabel}, {operator.metricYear}
                  </p>
                </div>
                <Score operator={operator} />
                <StatusBadge status={operator.soloStatus} />
                <EvidenceBadge evidence={operator.evidence} />
                <a
                  href={operator.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open source for ${operator.name}`}
                  aria-label={`Open source for ${operator.name} in a new tab`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded border bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
