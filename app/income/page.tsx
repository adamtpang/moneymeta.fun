import type { Metadata } from "next";
import { Rocket, ShieldCheck, Trophy } from "lucide-react";

import { getIncomeDecks } from "@/lib/income";
import { BoardTabs } from "@/components/board-tabs";
import { IncomeBoard } from "@/components/income/income-board";

export const metadata: Metadata = {
  title: "moneymeta.fun — the income board",
  description:
    "Income paths ranked S→D by median income, growth, and barrier-to-entry. Anchored on BLS data; the 'where to walk' map for income-maxxing.",
};

export default function IncomePage() {
  const decks = getIncomeDecks();
  const topStartNow = [...decks].sort((a, b) => b.startNowScore - a.startNowScore)[0];
  const topCeiling = [...decks].sort((a, b) => b.ceilingScore - a.ceilingScore)[0];
  const verified = decks.filter((d) => d.dataQuality === "verifiable").length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="font-mono text-2xl font-black tracking-tight sm:text-3xl">
              moneymeta<span className="text-primary">.fun</span>
            </h1>
            <BoardTabs />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The <span className="font-semibold text-foreground">income board</span> — how to
            make the money, ranked. Income paths as &ldquo;decks,&rdquo; scored on{" "}
            <span className="font-semibold text-foreground">median income × growth ÷ barrier</span>.
            Occupations are anchored on{" "}
            <span className="font-semibold text-foreground">BLS</span> data; internet paths show
            the brutal median and a self-reported badge. This is the &ldquo;where to walk&rdquo; map.
          </p>

          {/* Summary strip */}
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <SummaryStat
              icon={<Rocket className="h-4 w-4 text-primary" aria-hidden />}
              label="Top — start now"
              name={topStartNow.name}
              value={`${topStartNow.startNowScore}`}
            />
            <SummaryStat
              icon={<Trophy className="h-4 w-4 text-amber-300" aria-hidden />}
              label="Top — highest ceiling"
              name={topCeiling.name}
              value={`${topCeiling.ceilingScore}`}
            />
            <SummaryStat
              icon={<ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />}
              label="BLS-verified decks"
              name={`of ${decks.length} total`}
              value={`${verified}`}
            />
          </div>
        </header>

        <IncomeBoard decks={decks} />

        {/* Methodology */}
        <section
          className="mt-8 rounded-xl border bg-card/40 p-4"
          aria-label="How the income score works"
        >
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">The two lenses.</span>{" "}
            <span className="font-semibold text-foreground">Start now</span> = 40% income + 20%
            growth + 40% reachability (time-to-first-income and capital needed) — it rewards $0-capital,
            fast, skill-gated paths. <span className="font-semibold text-foreground">Highest ceiling</span>{" "}
            = 70% income + 30% growth — terminal pay wins, so decade-long moats rise. The same path
            tiers differently under each. Median is deliberately brutal: most internet paths show a
            near-$0 median because that&apos;s the real survivorship-adjusted truth — the exemplars
            on those cards are the rare winners, not the typical outcome. Every occupation number
            traces to BLS; tap any card for its source.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex flex-col gap-2 border-t pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Not career or financial advice.{" "}
            <span className="text-foreground/70">
              Medians hide variance; your starting position changes everything.
            </span>
          </p>
          <a
            href="https://github.com/adamtpang/moneymeta.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            github.com/adamtpang/moneymeta.fun
          </a>
        </footer>
      </div>
    </div>
  );
}

function SummaryStat({
  icon,
  label,
  name,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card/60 px-3.5 py-3">
      <div className="flex items-center gap-2.5">
        {icon}
        <div className="leading-tight">
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="truncate text-sm font-semibold text-foreground">{name}</div>
        </div>
      </div>
      <div className="font-mono text-lg font-bold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
