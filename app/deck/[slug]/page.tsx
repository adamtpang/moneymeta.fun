import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  Crosshair,
  ShieldAlert,
  Wrench,
} from "lucide-react";

import { getAllDeckSlugs, getPlaybook } from "@/lib/playbook";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";
import {
  CAPITAL_LABEL,
  DATA_QUALITY,
  categoryMeta,
  timeLabel,
} from "@/components/income/income-meta";
import { SiteFooter } from "@/components/site-footer";

export function generateStaticParams() {
  return getAllDeckSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const pb = getPlaybook(params.slug);
  if (!pb) return { title: "Deck not found · moneymeta.fun" };
  return {
    title: `${pb.deck.name} playbook · moneymeta.fun`,
    description: pb.headline,
    openGraph: {
      title: `${pb.deck.name} playbook`,
      description: pb.headline,
      url: `https://moneymeta.fun/deck/${pb.deck.slug}`,
    },
  };
}

export default function DeckPlaybookPage({
  params,
}: {
  params: { slug: string };
}) {
  const pb = getPlaybook(params.slug);
  if (!pb) notFound();

  const { deck } = pb;
  const style = TIER_STYLES[deck.startNowTier];
  const ceilingStyle = TIER_STYLES[deck.ceilingTier];
  const cat = categoryMeta(deck.category);
  const CatIcon = cat.icon;
  const dq = DATA_QUALITY[deck.dataQuality];
  const cap = CAPITAL_LABEL[deck.capitalTier];

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[900px] px-4 py-6 sm:py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 rounded text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to the money meta
        </Link>

        <header className="mb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary ring-1 ring-primary/35">
              <BookOpen className="h-3 w-3" aria-hidden />
              Deck playbook
            </span>
            {pb.curated ? (
              <span className="rounded-md bg-amber-400/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/30">
                Curated guide
              </span>
            ) : (
              <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Auto playbook
              </span>
            )}
          </div>

          <h1 className="font-mono text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {deck.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {pb.headline}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">
              <CatIcon className="h-3 w-3" aria-hidden />
              {cat.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden />
              {timeLabel(deck.timeToFirstIncomeYears)} to first $
            </span>
            <span className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 font-mono text-muted-foreground">
              {cap.short}
            </span>
            <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 ring-1", dq.className)}>
              {dq.label}
            </span>
            <a
              href={deck.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 rounded text-primary hover:underline"
            >
              Source <ArrowUpRight className="h-3 w-3" aria-hidden />
            </a>
          </div>
        </header>

        {/* Score strip */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Median" value={formatUsd(deck.median)} />
          <Stat
            label="Start-now"
            value={`${deck.startNowScore}`}
            badge={
              <span className={cn("rounded px-1 font-mono text-xs font-bold ring-1", style.score)}>
                {deck.startNowTier}
              </span>
            }
          />
          <Stat
            label="Ceiling"
            value={`${deck.ceilingScore}`}
            badge={
              <span
                className={cn(
                  "rounded px-1 font-mono text-xs font-bold ring-1",
                  ceilingStyle.score,
                )}
              >
                {deck.ceilingTier}
              </span>
            }
          />
          <Stat
            label="Growth input"
            value={deck.growthPct > 0 ? `+${deck.growthPct}%` : `${deck.growthPct}%`}
          />
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border bg-card/50 p-4 sm:p-5">
            <h2 className="mb-2 flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Crosshair className="h-3.5 w-3.5" aria-hidden />
              Who this deck is for
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{pb.whoItsFor}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              <span className="font-semibold text-foreground">First dollar: </span>
              {pb.firstDollar}
            </p>
          </section>

          <section className="rounded-2xl border bg-card/50 p-4 sm:p-5">
            <h2 className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.14em] text-foreground">
              How to play it
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Exact steps. Ship the smallest unit of paid value before you gold-plate.
            </p>
            <ol className="flex flex-col gap-3">
              {pb.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-border/70 bg-background/40 p-3.5"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 font-mono text-[11px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {step.title.replace(/^\d+\.\s*/, "")}
                    </h3>
                  </div>
                  <p className="pl-8 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <section className="rounded-2xl border bg-card/50 p-4 sm:p-5">
              <h2 className="mb-3 flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
                <Wrench className="h-3.5 w-3.5" aria-hidden />
                Tools
              </h2>
              <ul className="flex flex-wrap gap-1.5">
                {pb.tools.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-border/70 bg-background/50 px-2 py-1 text-[11px] text-foreground/90"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border bg-card/50 p-4 sm:p-5">
              <h2 className="mb-3 flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-rose-300">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                Pitfalls
              </h2>
              <ul className="space-y-2">
                {pb.pitfalls.map((p) => (
                  <li key={p} className="text-xs leading-relaxed text-muted-foreground">
                    <span className="mr-1.5 text-rose-400/80">·</span>
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {deck.exemplars.length > 0 ? (
            <section className="rounded-2xl border bg-card/50 p-4 sm:p-5">
              <h2 className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.14em] text-foreground">
                Legend-rate exemplars
              </h2>
              <p className="mb-3 text-xs text-muted-foreground">
                Not the median. These are rare winners so you can study a real decklist.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {deck.exemplars.map((ex) => (
                  <a
                    key={ex.handle}
                    href={ex.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-border/70 bg-background/40 p-3 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{ex.name}</span>
                      <span className="font-mono text-[11px] font-bold text-primary">{ex.rev}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{ex.note}</p>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {pb.nextDecks.length > 0 ? (
            <section className="rounded-2xl border bg-card/50 p-4 sm:p-5">
              <h2 className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.14em] text-foreground">
                Ladder up
              </h2>
              <p className="mb-3 text-xs text-muted-foreground">
                Related decks if this one is working or if you need a stronger wincon.
              </p>
              <div className="flex flex-col gap-2">
                {pb.nextDecks.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/deck/${d.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/40 px-3 py-2.5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                        {d.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        start {d.startNowScore} · ceiling {d.ceilingScore}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-xl border border-border/60 bg-background/30 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">What you do on paper: </span>
              {deck.whatYouDo}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Frequency: </span>
              {deck.frequency}
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Full tier list
          </Link>
          <a
            href={deck.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            Open source <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card/60 px-3 py-2.5">
      <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="font-mono text-lg font-bold tabular-nums text-foreground">{value}</span>
        {badge}
      </div>
    </div>
  );
}
