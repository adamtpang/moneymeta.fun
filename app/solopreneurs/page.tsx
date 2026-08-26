import {
  BarChart3,
  ExternalLink,
  History,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";

import { ReportMasthead } from "@/components/report-masthead";
import { SiteFooter } from "@/components/site-footer";
import { SolopreneurIndex } from "@/components/solopreneurs/solopreneur-index";
import { formatDate } from "@/lib/format";
import {
  getSolopreneurAsOf,
  getSolopreneurIndex,
  getSolopreneurNote,
  getSolopreneurRecords,
} from "@/lib/solopreneurs";

export const metadata = {
  title: "Solo Operator Index | moneymeta.fun",
  description:
    "A source-linked ranking of one-person businesses by revenue scale, evidence quality, solo purity, and duration.",
};

export default function SolopreneursPage() {
  const operators = getSolopreneurIndex();
  const records = getSolopreneurRecords();
  const sTier = operators.filter((operator) => operator.tier === "S").length;
  const soloNow = operators.filter(
    (operator) => operator.soloStatus === "current_solo",
  ).length;
  const corroborated = operators.filter(
    (operator) => operator.evidence === "corroborated",
  ).length;

  const stats = [
    { label: "Ranked operators", value: operators.length, icon: BarChart3 },
    { label: "S-tier operators", value: sTier, icon: Trophy },
    { label: "Still solo", value: soloNow, icon: UserRound },
    { label: "Corroborated", value: corroborated, icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:py-10">
        <ReportMasthead />

        <section className="mb-5" aria-labelledby="solo-index-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-micro font-semibold uppercase tracking-[0.12em] text-primary">
                Solo Operator Index
              </p>
              <h1 id="solo-index-title" className="mt-1 text-2xl font-black sm:text-3xl">
                The one-person business leaderboard
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Operators ranked by the best dated annual revenue achieved with zero employees or
                a near-solo core. The score discounts estimates, later team growth, and loose solo
                claims instead of treating every internet number as fact.
              </p>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Research snapshot: {formatDate(getSolopreneurAsOf())}
            </p>
          </div>
        </section>

        <section
          className="mb-5 grid grid-cols-2 overflow-hidden rounded-lg border bg-card/50 sm:grid-cols-4"
          aria-label="Solo operator index coverage"
        >
          {stats.map(({ label, value, icon: Icon }, index) => (
            <div
              key={label}
              className={`p-3 ${index === 0 ? "border-b border-r sm:border-b-0" : ""} ${index === 1 ? "border-b sm:border-b-0 sm:border-r" : ""} ${index === 2 ? "border-r" : ""}`}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                <p className="font-mono text-micro font-semibold uppercase tracking-[0.08em]">
                  {label}
                </p>
              </div>
              <p className="mt-1.5 font-mono text-xl font-black tabular-nums text-foreground">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-6 border-y bg-card/30 px-3 py-3" aria-labelledby="index-math-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 id="index-math-title" className="text-sm font-bold">
                Index math
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Revenue is log-scaled from $100K to $15M so one outlier cannot erase the field.
              </p>
            </div>
            <a
              href="#methodology"
              className="rounded font-mono text-micro font-semibold uppercase tracking-[0.08em] text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Full method
            </a>
          </div>
          <div className="mt-3 grid h-8 grid-cols-[6fr_2fr_1fr_1fr] overflow-hidden rounded">
            <div className="flex items-center bg-emerald-400/80 px-2 font-mono text-micro font-black text-emerald-950">
              60% revenue
            </div>
            <div className="flex items-center justify-center bg-cyan-400/80 px-1 font-mono text-[9px] font-black text-cyan-950">
              20% proof
            </div>
            <div className="flex items-center justify-center bg-violet-400/80 font-mono text-[9px] font-black text-violet-950" title="10% solo purity">
              10%
            </div>
            <div className="flex items-center justify-center bg-amber-400/80 font-mono text-[9px] font-black text-amber-950" title="10% duration">
              10%
            </div>
          </div>
        </section>

        <section id="index" aria-labelledby="rankings-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-mono text-micro font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Ranked index
              </p>
              <h2 id="rankings-title" className="mt-0.5 text-lg font-black">
                Peak solo-scale score
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">Score parts: scale + proof + solo + years</p>
          </div>
          <SolopreneurIndex operators={operators} />
        </section>

        <section className="mt-8" aria-labelledby="record-book-title">
          <div className="mb-3 flex items-center gap-2">
            <History className="h-4 w-4 text-primary" aria-hidden />
            <div>
              <p className="font-mono text-micro font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Different units, separate board
              </p>
              <h2 id="record-book-title" className="mt-0.5 text-lg font-black">
                Solo-origin record book
              </h2>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {records.map((record) => (
              <article key={`${record.name}-${record.metric}`} className="rounded-lg border bg-card/45 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-micro font-semibold uppercase tracking-[0.08em] text-primary">
                      {record.label}
                    </p>
                    <h3 className="mt-1 truncate text-sm font-bold">{record.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{record.business}</p>
                  </div>
                  <a
                    href={record.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open source for ${record.name}`}
                    aria-label={`Open source for ${record.name} in a new tab`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
                <div className="mt-3 flex items-baseline gap-2 border-t pt-3">
                  <p className="font-mono text-xl font-black tabular-nums text-foreground">
                    {record.metric}
                  </p>
                  <p className="font-mono text-micro text-muted-foreground">{record.asOf}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{record.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="methodology"
          className="mt-8 rounded-lg border bg-card/40 p-4"
          aria-label="Solo Operator Index methodology"
        >
          <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Method.</span> The index score is 60
            points for log-normalized annual revenue, 20 for evidence quality, 10 for solo purity,
            and 10 for years sustained. Corroborated figures receive 20 evidence points,
            founder-disclosed figures receive 14, and reported estimates receive 8. Current solo
            operators receive 10 purity points, solo-at-the-metric operators receive 8, and
            near-solo cores receive 5. Annualized MRR and single-month figures are labeled as such.
            {" "}{getSolopreneurNote()} This is a research index, not an audited rich list.
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
