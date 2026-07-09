import { TrendingDown, TrendingUp, Trophy } from "lucide-react";

import { captureDateOf, getTierList, groupByTier } from "@/lib/data";
import { TIER_ORDER } from "@/lib/meta";
import { formatDate, formatPercent } from "@/lib/format";
import { TIER_STYLES } from "@/components/tier-styles";
import { TierRow } from "@/components/tier-row";
import { BoardTabs } from "@/components/board-tabs";
import { LiveBets } from "@/components/live-bets";

export default function Home() {
  const list = getTierList();
  const tiers = groupByTier(list);
  const capturedAt = captureDateOf(list);

  const top = list[0];
  const riser = [...list].sort((a, b) => b.growth - a.growth)[0];
  const faller = [...list].sort((a, b) => a.growth - b.growth)[0];

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:py-10">
        {/* Masthead */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  The capitalism meta report
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Live
                </span>
              </div>
              <h1 className="font-mono text-3xl font-black tracking-tight sm:text-4xl">
                moneymeta<span className="text-primary">.fun</span>
              </h1>
            </div>
            <BoardTabs />
          </div>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The meta report for making money. Find where the capital is, where it is
            going, and the plays winning right now. Then go run them.
          </p>
          <div className="mt-4 h-px w-full bg-gradient-to-r from-primary/40 via-border to-transparent" />
        </header>

        {/* The meta, in action */}
        <LiveBets />

        {/* Capital board header */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Capital board
            </div>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Wealth vehicles ranked{" "}
              <span className="font-semibold text-foreground">S to D</span> by
              market cap × momentum.
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Meta snapshot
            </div>
            <div className="font-mono text-sm font-semibold text-foreground">
              {capturedAt ? formatDate(capturedAt) : "n/a"}
            </div>
          </div>
        </div>

        {/* Snapshot summary strip */}
        <div
          className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3"
          aria-label="This snapshot's headline movers"
        >
            <SummaryStat
              icon={<Trophy className="h-4 w-4 text-amber-300" aria-hidden />}
              label="Top of the meta"
              name={top.name}
              value={`${top.score} score`}
              tone="neutral"
            />
            <SummaryStat
              icon={
                <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden />
              }
              label="Biggest riser"
              name={riser.name}
              value={formatPercent(riser.growth)}
              tone="up"
            />
            <SummaryStat
              icon={
                <TrendingDown className="h-4 w-4 text-rose-400" aria-hidden />
              }
              label="Biggest faller"
              name={faller.name}
              value={formatPercent(faller.growth)}
              tone="down"
            />
        </div>

        {/* Tier list */}
        <main className="flex flex-col gap-3" aria-label="Wealth vehicle tier list">
          {TIER_ORDER.map((tier, i) => (
            <TierRow key={tier} tier={tier} vehicles={tiers[tier]} index={i} />
          ))}
        </main>

        {/* Legend + methodology */}
        <section
          className="mt-8 rounded-xl border bg-card/40 p-4"
          aria-label="How the meta score works"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              How to read this
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {TIER_ORDER.map((tier) => (
                <span
                  key={tier}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded text-[10px] font-black ${TIER_STYLES[tier].chip}`}
                  >
                    {tier}
                  </span>
                  {TIER_STYLES[tier].label}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Meta score</span>{" "}
            (0–100) = 50% normalized market cap (log scale) + 50% normalized
            30-day growth. The <span className="font-mono">number</span> on each
            card is the score; the percentage is the trailing 30-day change.
            Bigger pools of capital and faster momentum rank higher, the same
            popularity × win-rate idea Vicious Syndicate uses for decks, applied
            to capital. Tap any card to open its public source.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex flex-col gap-2 border-t pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Every number traces to a public source.{" "}
            <span className="text-foreground/70">
              Not financial advice. No self-reported data, ever.
            </span>
          </p>
          <p className="flex flex-wrap items-center gap-x-3">
            <a
              href="https://github.com/adamtpang/moneymeta.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              github.com/adamtpang/moneymeta.fun
            </a>
            <a
              href="https://adampang.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              built by Adam Pangelinan
            </a>
          </p>
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
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  tone: "up" | "down" | "neutral";
}) {
  const toneClass =
    tone === "up"
      ? "text-emerald-400"
      : tone === "down"
        ? "text-rose-400"
        : "text-foreground";
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card/60 px-3.5 py-3">
      <div className="flex items-center gap-2.5">
        {icon}
        <div className="leading-tight">
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
        </div>
      </div>
      <div className={`font-mono text-sm font-bold tabular-nums ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}
