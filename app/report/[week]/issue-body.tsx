import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { ReportIssue, ReportDeckRef, ReportMover } from "@/lib/report";
import type { Tier } from "@/lib/meta";
import { TIER_STYLES } from "@/components/tier-styles";
import { cn } from "@/lib/utils";

const usd = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);

function PickCard({ label, pick, blurb }: { label: string; pick: ReportDeckRef; blurb: string }) {
  const style = TIER_STYLES[(pick.tier as Tier) ?? "D"];
  return (
    <Link
      href={`/deck/${pick.slug}`}
      className={cn(
        "group flex flex-col gap-2 rounded-xl border border-l-2 bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:bg-card",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        style.border,
      )}
    >
      <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-semibold text-foreground">{pick.name}</span>
        <span
          className={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums ring-1",
            style.score,
          )}
        >
          {pick.score}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        {pick.tier} tier · {usd(pick.median)} median · {blurb}
      </div>
    </Link>
  );
}

function MoverRow({ m, up }: { m: ReportMover; up: boolean }) {
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <Icon
        className={cn("h-3.5 w-3.5 shrink-0", up ? "text-emerald-400" : "text-rose-400")}
        aria-hidden
      />
      <Link
        href={`/deck/${m.slug}`}
        className="rounded font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {m.name}
      </Link>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {m.dStartNow >= 0 ? "+" : ""}
        {m.dStartNow} start-now · {m.dCeiling >= 0 ? "+" : ""}
        {m.dCeiling} ceiling
      </span>
    </li>
  );
}

export function IssueBody({ issue, latest = false }: { issue: ReportIssue; latest?: boolean }) {
  return (
    <article aria-label={issue.title}>
      <header className="mb-5">
        <h1 className="font-mono text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {issue.title}
        </h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {issue.deckCount} decks · {issue.sTierCount} in S tier (start now) · movement vs{" "}
          {issue.baseline}
          {latest ? " · latest issue" : ""}
        </p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <PickCard label="The Pick · start now" pick={issue.pick.startNow} blurb="best deck to open with today" />
        <PickCard label="The Pick · highest ceiling" pick={issue.pick.ceiling} blurb="the long climb" />
      </div>

      {(issue.risers.length > 0 || issue.fallers.length > 0) && (
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Movers">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Risers
            </div>
            <ul className="space-y-1.5">
              {issue.risers.map((m) => (
                <MoverRow key={m.slug} m={m} up />
              ))}
              {issue.risers.length === 0 && (
                <li className="text-sm text-muted-foreground">None this week.</li>
              )}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-400">
              Fallers
            </div>
            <ul className="space-y-1.5">
              {issue.fallers.map((m) => (
                <MoverRow key={m.slug} m={m} up={false} />
              ))}
              {issue.fallers.length === 0 && (
                <li className="text-sm text-muted-foreground">None this week.</li>
              )}
            </ul>
          </div>
        </section>
      )}

      <section className="rounded-xl border bg-card/40 p-4" aria-label="This week's read">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          This week&apos;s read
        </div>
        <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          {issue.curation.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Full board:{" "}
        <Link
          href="/"
          className="rounded font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          the live money meta
        </Link>
        {" · "}Meta Breaker this report:{" "}
        <Link
          href={`/deck/${issue.breaker.slug}`}
          className="rounded font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {issue.breaker.slug}
        </Link>
      </p>
    </article>
  );
}
