/**
 * Build this week's meta report issue: seed/reports/<asOf>.json
 *
 *   node scripts/build-report.mjs          # write the issue from current data
 *   node scripts/build-report.mjs --force  # overwrite an existing same-day issue
 *
 * Derives everything from current seed data vs the prior baseline
 * (seed/score-history.json), then auto-drafts ~300 words of curation you can
 * edit in the JSON before shipping. Publication order (see scripts/README.md):
 * bls-refresh --apply, build-report, review curation, commit + deploy, THEN
 * snapshot-scores to baseline next week.
 *
 * An issue file is a dated periodical, the same class of artifact as
 * seed/score-history.json: a historical record, not a computed-value cache.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const unknownArgs = args.filter((arg) => !["--force", "--dry-run"].includes(arg));
if (unknownArgs.length > 0) {
  console.error("Usage: node scripts/build-report.mjs [--force] [--dry-run]");
  process.exit(1);
}
const dryRun = args.includes("--dry-run");

const require = createRequire(import.meta.url);
const decks = require("../seed/income-decks.json");
const history = require("../seed/score-history.json");
const metaReport = require("../seed/meta-report.json");

// Pure scoring (duplicate of lib/income.ts constants, same as snapshot-scores.mjs)
const INCOME_MIN = 30000;
const INCOME_MAX = 250000;
const GROWTH_LO = -10;
const GROWTH_HI = 35;
const TIME_MAX = 11;
const CAP = { none: 100, low: 75, med: 45, high: 15 };
// Keep in lockstep with lib/income.ts: TIER_BANDS, TIER_FLOOR_S, scoreFor().
const TIER_BANDS = { S: 0.1, A: 0.25, B: 0.55, C: 0.85 };
const TIER_FLOOR_S = 55;
const SCORE_FORMULA_VERSION = 2;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const inc = (m) => clamp(((m - INCOME_MIN) / (INCOME_MAX - INCOME_MIN)) * 100, 0, 100);
const gro = (p) => clamp(((p - GROWTH_LO) / (GROWTH_HI - GROWTH_LO)) * 100, 0, 100);
const reach = (y, c) => {
  const t = clamp(((TIME_MAX - y) / TIME_MAX) * 100, 0, 100);
  return 0.6 * t + 0.4 * (CAP[c] ?? 50);
};
const winRate = (p) => (typeof p === "number" && !Number.isNaN(p) ? clamp(p, 0, 100) / 100 : 1);
const payoff = (d) => inc(d.median) * winRate(d.livablePct);
const rawStartNow = (d) =>
  0.4 * payoff(d) + 0.2 * gro(d.growthPct) + 0.4 * reach(d.timeToFirstIncomeYears, d.capitalTier);
const rawCeiling = (d) => 0.7 * inc(d.median) + 0.3 * gro(d.growthPct);
const startNow = (d) => Math.round(rawStartNow(d));
const ceiling = (d) => Math.round(rawCeiling(d));

/** Exact percentile bands, mirroring tiersByRank in lib/income.ts. */
const tierAssignments = (rawScore) => {
  const ranked = decks
    .map((deck) => ({ deck, rawScore: rawScore(deck) }))
    .sort((a, b) => b.rawScore - a.rawScore || a.deck.slug.localeCompare(b.deck.slug));
  const n = ranked.length;
  const endS = Math.round(n * TIER_BANDS.S);
  const endA = Math.round(n * TIER_BANDS.A);
  const endB = Math.round(n * TIER_BANDS.B);
  const endC = Math.round(n * TIER_BANDS.C);
  return new Map(ranked.map(({ deck, rawScore: score }, index) => [
    deck.slug,
    index < endS && Math.round(score) >= TIER_FLOOR_S
      ? "S"
      : index < endA
        ? "A"
        : index < endB
          ? "B"
          : index < endC
            ? "C"
            : "D",
  ]));
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "seed", "reports");
fs.mkdirSync(outDir, { recursive: true });

const asOf = new Date().toISOString().slice(0, 10);
const outFile = path.join(outDir, `${asOf}.json`);
if (fs.existsSync(outFile) && !args.includes("--force") && !dryRun) {
  console.error(`Issue ${asOf} already exists. Re-run with --force to overwrite.`);
  process.exit(1);
}
if (history.asOf === asOf) {
  console.warn(
    `WARNING: baseline asOf (${history.asOf}) is today. Confirm the snapshot was ` +
      `taken before the current data changes; normal order is build-report BEFORE snapshot-scores.`,
  );
}

// Tiers are relative, so grade the whole board before grading any one deck.
const startNowTiers = tierAssignments(rawStartNow);
const ceilingTiers = tierAssignments(rawCeiling);
const comparableHistory = (history.formulaVersion ?? 1) === SCORE_FORMULA_VERSION;

// Current scores + movement vs the baseline
const rows = decks.map((d) => {
  const startNowRaw = rawStartNow(d);
  const ceilingRaw = rawCeiling(d);
  const sn = Math.round(startNowRaw);
  const ce = Math.round(ceilingRaw);
  const prior = history.scores?.[d.slug];
  return {
    slug: d.slug,
    name: d.name,
    metaClass: d.metaClass ?? d.category,
    startNow: sn,
    startNowRaw,
    startNowTier: startNowTiers.get(d.slug) ?? "D",
    ceiling: ce,
    ceilingRaw,
    ceilingTier: ceilingTiers.get(d.slug) ?? "D",
    median: d.median,
    dStartNow: prior && comparableHistory ? sn - prior.startNow : null,
    dCeiling: prior && comparableHistory ? ce - prior.ceiling : null,
    dMedian: prior && typeof prior.median === "number" ? d.median - prior.median : null,
    isNew: !prior,
  };
});

const moved = rows.filter((r) => r.dStartNow !== null && (r.dStartNow !== 0 || r.dCeiling !== 0));
const risers = [...moved].sort((a, b) => b.dStartNow + b.dCeiling - (a.dStartNow + a.dCeiling)).slice(0, 5)
  .filter((r) => r.dStartNow + r.dCeiling > 0);
const fallers = [...moved].sort((a, b) => a.dStartNow + a.dCeiling - (b.dStartNow + b.dCeiling)).slice(0, 5)
  .filter((r) => r.dStartNow + r.dCeiling < 0);
const newDecks = rows.filter((r) => r.isNew).map((r) => r.slug);

const byStartNow = [...rows].sort((a, b) => b.startNowRaw - a.startNowRaw || a.slug.localeCompare(b.slug));
const byCeiling = [...rows].sort((a, b) => b.ceilingRaw - a.ceilingRaw || a.slug.localeCompare(b.slug));
const pickStartNow = byStartNow[0];
const pickCeiling = byCeiling[0];
const sCount = rows.filter((r) => r.startNowTier === "S").length;

const fmtK = (n) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);

// Auto-drafted curation, ~300 words, honest and data-derived. Edit before shipping.
const curation = [
  `Board state, ${asOf}: ${rows.length} decks scored, ${sCount} in S tier under the start-now lens, baseline ${history.asOf}.`,
  !comparableHistory
    ? `The scoring formula changed from v${history.formulaVersion ?? 1} to v${SCORE_FORMULA_VERSION}. This issue is rebased: no risers or fallers are published because a ruler change is not market movement.`
    : moved.length === 0
    ? `No score moved since ${history.asOf}. A flat week is a finding: the medians underneath this board only move when the data does, and this week the data held. Flat weeks are what an honest baseline looks like; distrust boards that wobble weekly on vibes.`
    : `${moved.length} deck${moved.length === 1 ? "" : "s"} moved since ${history.asOf}. ` +
      (risers[0]
        ? `Biggest riser: ${risers[0].name} (+${risers[0].dStartNow} start-now, +${risers[0].dCeiling} ceiling${risers[0].dMedian ? `, median ${risers[0].dMedian > 0 ? "up" : "down"} ${fmtK(Math.abs(risers[0].dMedian))}` : ""}). `
        : "") +
      (fallers[0]
        ? `Biggest faller: ${fallers[0].name} (${fallers[0].dStartNow} start-now, ${fallers[0].dCeiling} ceiling).`
        : ""),
  `The Pick, start now: ${pickStartNow.name} at ${pickStartNow.startNow} (${pickStartNow.startNowTier} tier, ${fmtK(pickStartNow.median)} median). The start-now lens rewards win-rate-adjusted payoff, growth, and reachability, so the top of this ladder is the best deck to open with today on little capital, not the biggest terminal number.`,
  `The Pick, highest ceiling: ${pickCeiling.name} at ${pickCeiling.ceiling} (${pickCeiling.ceilingTier} tier, ${fmtK(pickCeiling.median)} median). Ceiling weighs terminal pay and trajectory, which is why decade-moat decks rise here that the start-now lens correctly discounts.`,
  `Meta Breaker on the current report: ${metaReport.metaBreaker.headline.replace(/^Meta Breaker:\s*/i, "")} (${metaReport.metaBreaker.slug}).`,
  newDecks.length > 0 ? `New to the board since the last baseline: ${newDecks.join(", ")}.` : null,
  `Method note: occupation medians trace to BLS OEWS, internet decks carry the brutal survivorship-adjusted median and a data-confidence badge. Movement is published only when the committed baseline uses scoring formula v${SCORE_FORMULA_VERSION}.`,
]
  .filter(Boolean)
  .join("\n\n");

const issue = {
  week: asOf,
  baseline: history.asOf,
  formulaVersion: SCORE_FORMULA_VERSION,
  baselineFormulaVersion: history.formulaVersion ?? 1,
  title: `The money meta, week of ${asOf}`,
  deckCount: rows.length,
  sTierCount: sCount,
  pick: {
    startNow: { slug: pickStartNow.slug, name: pickStartNow.name, score: pickStartNow.startNow, tier: pickStartNow.startNowTier, median: pickStartNow.median },
    ceiling: { slug: pickCeiling.slug, name: pickCeiling.name, score: pickCeiling.ceiling, tier: pickCeiling.ceilingTier, median: pickCeiling.median },
  },
  breaker: {
    slug: metaReport.metaBreaker.slug,
    headline: metaReport.metaBreaker.headline,
  },
  risers: risers.map((r) => ({ slug: r.slug, name: r.name, dStartNow: r.dStartNow, dCeiling: r.dCeiling, dMedian: r.dMedian })),
  fallers: fallers.map((r) => ({ slug: r.slug, name: r.name, dStartNow: r.dStartNow, dCeiling: r.dCeiling, dMedian: r.dMedian })),
  newDecks,
  curation,
};

if (dryRun) {
  console.log(JSON.stringify(issue, null, 2));
  console.log(`Dry run only; no issue written to ${outFile}`);
} else {
  fs.writeFileSync(outFile, JSON.stringify(issue, null, 2) + "\n");
  console.log(`Wrote issue → ${outFile}`);
}
console.log(`  movers: ${moved.length} (risers ${risers.length}, fallers ${fallers.length}), new decks: ${newDecks.length}`);
console.log(`  Review the "curation" field, edit freely, then commit + deploy, then run snapshot-scores.mjs.`);
