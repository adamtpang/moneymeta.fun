import { ShieldCheck } from "lucide-react";

import { getIncomeDecks } from "@/lib/income";
import { getMetaReport } from "@/lib/meta-report";
import { ReportMasthead } from "@/components/report-masthead";
import { SiteFooter } from "@/components/site-footer";
import { IncomeBoard } from "@/components/income/income-board";
import { FoundingLicenseLink } from "@/components/founding-license-link";

export default function Home() {
  const decks = getIncomeDecks();
  const report = getMetaReport();
  const verified = decks.filter((d) => d.dataQuality === "verifiable").length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:py-10">
        <ReportMasthead titleAs="h1" />

        {/* Founding license */}
        <div className="mb-6">
          <FoundingLicenseLink />
        </div>

        {/* The money meta */}
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            The money meta
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every way to make money as a &ldquo;deck,&rdquo; scored on{" "}
            <span className="font-semibold text-foreground">
              income × win rate × growth ÷ barrier
            </span>
            . Win rate is the share of players who clear a livable income, so a $240k median that
            88% of players never reach does not outrank a $130k median that 99% do. Occupations are
            anchored on{" "}
            <span className="font-semibold text-foreground">BLS</span> data; internet paths show
            the brutal median and a self-reported badge. The Pick, Meta Breaker, and matchup chart
            sit above the S-D board, like a Data Reaper report.
          </p>
        </div>

        <div
          className="mb-6 flex items-center justify-between gap-3 rounded-lg border bg-card/60 px-3.5 py-3"
          aria-label="Board coverage"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
            <div className="leading-tight">
              <div className="text-micro font-medium uppercase tracking-[0.08em] text-muted-foreground">
                BLS-verified decks
              </div>
              <div className="text-sm font-semibold text-foreground">
                of {decks.length} total on the board
              </div>
            </div>
          </div>
          <div className="font-mono text-lg font-bold tabular-nums text-foreground">
            {verified}
          </div>
        </div>

        <IncomeBoard decks={decks} report={report} />

        {/* Methodology */}
        <section
          className="mt-8 rounded-xl border bg-card/40 p-4"
          aria-label="How the money meta works"
        >
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">The two lenses.</span>{" "}
            <span className="font-semibold text-foreground">Start now</span> = 40% income + 20%
            growth + 40% reachability (time-to-first-income and capital needed), it rewards
            $0-capital, fast, skill-gated paths, the best deck to open with today.{" "}
            <span className="font-semibold text-foreground">Highest ceiling</span> = 70% income +
            30% growth, terminal pay wins, so decade-long moats rise. The same deck tiers
            differently under each.{" "}
            <span className="font-semibold text-foreground">The Pick</span> is #1 under the active
            lens.{" "}
            <span className="font-semibold text-foreground">Meta Breaker</span> is the curated
            rising internet deck this report.{" "}
            <span className="font-semibold text-foreground">Matchups</span> are hybrid stacks
            (opener → midgame → wincon), because pure attention decks rarely clear cash alone.
            Median is deliberately brutal: most internet paths show a near-$0 median because
            that&apos;s the real survivorship-adjusted truth, the exemplars on those cards are the
            rare winners, not the typical outcome. Every occupation number traces to BLS; tap any
            card for its source.
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
