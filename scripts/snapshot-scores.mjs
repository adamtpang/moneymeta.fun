/**
 * Snapshot current startNow/ceiling scores for next week's movement arrows.
 *
 *   node scripts/snapshot-scores.mjs
 *
 * Writes seed/score-history.json with asOf date. Movement is computed live
 * by comparing current derived scores to this snapshot.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// Pure scoring (duplicate of lib/income.ts constants so we can run without TS)
const require = createRequire(import.meta.url);
const decks = require("../seed/income-decks.json");

const INCOME_MIN = 30000;
const INCOME_MAX = 250000;
const GROWTH_LO = -10;
const GROWTH_HI = 35;
const TIME_MAX = 11;
const CAP = { none: 100, low: 75, med: 45, high: 15 };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const inc = (m) => clamp(((m - INCOME_MIN) / (INCOME_MAX - INCOME_MIN)) * 100, 0, 100);
const gro = (p) => clamp(((p - GROWTH_LO) / (GROWTH_HI - GROWTH_LO)) * 100, 0, 100);
const reach = (y, c) => {
  const t = clamp(((TIME_MAX - y) / TIME_MAX) * 100, 0, 100);
  return 0.6 * t + 0.4 * (CAP[c] ?? 50);
};
const startNow = (d) =>
  Math.round(0.4 * inc(d.median) + 0.2 * gro(d.growthPct) + 0.4 * reach(d.timeToFirstIncomeYears, d.capitalTier));
const ceiling = (d) => Math.round(0.7 * inc(d.median) + 0.3 * gro(d.growthPct));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "seed", "score-history.json");

const asOf = new Date().toISOString().slice(0, 10);
const scores = {};
for (const d of decks) {
  scores[d.slug] = {
    startNow: startNow(d),
    ceiling: ceiling(d),
    median: d.median,
    playRate: d.playRate ?? 0,
    livablePct: d.livablePct ?? 0,
  };
}

const payload = {
  asOf,
  note: "Prior period scores for movement arrows. Re-run snapshot-scores.mjs after each meta report.",
  scores,
};

fs.writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
console.log(`Wrote ${Object.keys(scores).length} scores → ${out} (asOf ${asOf})`);
