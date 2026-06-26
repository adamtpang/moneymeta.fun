// Standalone sanity check of the meta formula + tier distribution.
// Re-implements lib/meta.ts in plain JS (no TS/path-alias deps) and prints the
// computed tier list from seed/vehicles.json. Run: node scripts/check-meta.mjs
import { readFileSync } from "node:fs";

const SIZE_LOG_MIN = 11;
const SIZE_LOG_MAX = 14.7;
const GROWTH_CLAMP_LO = -0.12;
const GROWTH_CLAMP_HI = 0.12;
const W = { size: 0.5, growth: 0.5 };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const normSize = (c) =>
  c <= 0 ? 0 : clamp(((Math.log10(c) - SIZE_LOG_MIN) / (SIZE_LOG_MAX - SIZE_LOG_MIN)) * 100, 0, 100);
const normGrowth = (g) =>
  clamp(((g - GROWTH_CLAMP_LO) / (GROWTH_CLAMP_HI - GROWTH_CLAMP_LO)) * 100, 0, 100);
const score = (c, g) => Math.round(W.size * normSize(c) + W.growth * normGrowth(g));
const tierFor = (s) => (s >= 80 ? "S" : s >= 65 ? "A" : s >= 50 ? "B" : s >= 35 ? "C" : "D");

const data = JSON.parse(readFileSync(new URL("../seed/vehicles.json", import.meta.url)));
const rows = data
  .map((v) => {
    const s = [...v.snapshots].sort((a, b) => a.captured_at.localeCompare(b.captured_at));
    const latest = s[s.length - 1].market_cap;
    const prior = s[s.length - 2].market_cap;
    const g = (latest - prior) / prior;
    const sc = score(latest, g);
    return { name: v.name, cap: latest, g, sc, tier: tierFor(sc) };
  })
  .sort((a, b) => b.sc - a.sc);

const counts = { S: 0, A: 0, B: 0, C: 0, D: 0 };
for (const r of rows) {
  counts[r.tier]++;
  console.log(
    `${r.tier}  ${String(r.sc).padStart(3)}  ${r.name.padEnd(18)} ` +
      `cap=$${(r.cap / 1e12).toFixed(2)}T  g=${(r.g * 100 >= 0 ? "+" : "")}${(r.g * 100).toFixed(1)}%`,
  );
}
console.log("\ndistribution:", JSON.stringify(counts), "total:", rows.length);
