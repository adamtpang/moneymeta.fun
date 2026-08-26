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
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-8">
        <ReportMasthead />

        <header className="mb-5 border-b pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-micro font-bold text-primary">THE MONEY META</p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">The best money decks to play now</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Every path is scored on income, win rate, growth, and the barrier to starting.
                Occupations use BLS data. Internet paths keep their brutal median and carry an
                evidence badge instead of borrowing exceptional founder outcomes.
              </p>
            </div>
            <FoundingLicenseLink />
          </div>
        </header>

        <div
          className="mb-5 grid overflow-hidden rounded-lg border bg-card/45 sm:grid-cols-[1fr_auto]"
          aria-label="Board coverage"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
            <div className="leading-tight">
              <div className="text-micro font-medium text-muted-foreground">BLS-VERIFIED COVERAGE</div>
              <div className="text-sm font-semibold text-foreground">{verified} of {decks.length} decks</div>
            </div>
          </div>
          <div className="border-t px-3.5 py-3 sm:border-l sm:border-t-0">
            <p className="text-micro text-muted-foreground">SCORING MODEL</p>
            <p className="mt-0.5 font-mono text-xs font-bold text-foreground">payoff × odds + growth + reach</p>
          </div>
        </div>

        <IncomeBoard decks={decks} report={report} />

        {/* Methodology */}
        <section
          className="mt-8 border-t pt-5"
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
