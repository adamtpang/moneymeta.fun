/**
 * BLS OEWS refresh: median wage, employment, and wage-percentile spread.
 *
 * Series ID (25 chars):
 *   OE + U + N + 0000000 + 000000 + {SOC6} + {datatype}
 * Datatype codes used here (verified against
 * github.com/govex/bls-oews-api-tutorial reference/series_id_codes.json):
 *   01 = employment            11 = annual 10th pct wage
 *   12 = annual 25th pct wage  13 = annual median wage
 *   14 = annual 75th pct wage  15 = annual 90th pct wage
 *
 * Usage:
 *   node scripts/bls-refresh.mjs              # fetch + print diff
 *   node scripts/bls-refresh.mjs --apply      # write medians + real playRate/livablePct into seed
 *   node scripts/bls-refresh.mjs --dry-run    # same as default
 *
 * Optional: BLS_API_KEY for higher daily limits (v2 registration).
 * Docs: https://www.bls.gov/developers/
 * OEWS format: https://github.com/govex/bls-oews-api-tutorial
 *
 * What "real" means here: for the 23 SOC-mapped decks below, playRate and
 * livablePct stop being editorial estimates and become derived from actual
 * BLS OEWS employment counts and wage-percentile spread. Every other deck on
 * the board keeps its editorial estimate untouched, this script only ever
 * writes to the decks listed in SOC_MAP.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const decksPath = path.join(root, "seed", "income-decks.json");
const apply = process.argv.includes("--apply");
const key = process.env.BLS_API_KEY || "";

/**
 * Livable-wage threshold used to derive livablePct from the real percentile
 * spread. $50,000/yr approximates MIT Living Wage Calculator's national
 * single-adult, full-time living wage figure, rounded for a single national
 * threshold rather than 3,000+ county-specific ones. This is a deliberate
 * simplification, not a per-market number, documented here so the
 * assumption is auditable rather than buried in a formula.
 */
const LIVABLE_WAGE_THRESHOLD = 50000;

/** Employment count mapped to playRate 0-100 on a log scale. Bounds are
 * fixed reference points (a niche occupation to one of the largest BLS
 * tracks), not min/max of the current sample, so playRate stays comparable
 * if more SOC-mapped decks are added later. */
const PLAYRATE_EMP_MIN = 1000;
const PLAYRATE_EMP_MAX = 3000000;

/** SOC with dash → series for national annual wage stats. */
const SOC_MAP = [
  { slug: "software-developers", soc: "15-1252", label: "Software Developers" },
  { slug: "data-scientists", soc: "15-2051", label: "Data Scientists" },
  { slug: "ai-ml-engineers", soc: "15-1221", label: "Computer and Information Research Scientists" },
  { slug: "nurse-practitioners", soc: "29-1171", label: "Nurse Practitioners" },
  { slug: "dentists", soc: "29-1021", label: "Dentists, General" },
  { slug: "lawyers", soc: "23-1011", label: "Lawyers" },
  { slug: "financial-managers", soc: "11-3031", label: "Financial Managers" },
  { slug: "actuaries", soc: "15-2011", label: "Actuaries" },
  { slug: "electrician", soc: "47-2111", label: "Electricians" },
  { slug: "plumber-pipefitter", soc: "47-2152", label: "Plumbers, Pipefitters, and Steamfitters" },
  { slug: "hvac-technician", soc: "49-9021", label: "Heating, Air Conditioning, and Refrigeration Mechanics" },
  { slug: "real-estate-agent-broker", soc: "41-9022", label: "Real Estate Sales Agents" },
  { slug: "b2b-saas-sales", soc: "41-4011", label: "Sales Reps, Wholesale/Mfg, Technical" },
  { slug: "physician-assistants", soc: "29-1071", label: "Physician Assistants" },
  { slug: "pharmacists", soc: "29-1051", label: "Pharmacists" },
  { slug: "dental-hygienist", soc: "29-1292", label: "Dental Hygienists" },
  { slug: "welder-fabricator", soc: "51-4121", label: "Welders, Cutters, Solderers, and Brazers" },
  { slug: "commercial-driver-trucking-owner-operator", soc: "53-3032", label: "Heavy and Tractor-Trailer Truck Drivers" },
  { slug: "construction-manager-general-contractor", soc: "11-9021", label: "Construction Managers" },
  { slug: "financial-investment-analysts", soc: "13-2051", label: "Financial and Investment Analysts" },
  { slug: "petroleum-engineers", soc: "17-2171", label: "Petroleum Engineers" },
  { slug: "aerospace-engineers", soc: "17-2011", label: "Aerospace Engineers" },
  { slug: "airline-pilots", soc: "53-2011", label: "Airline Pilots, Copilots, and Flight Engineers" },
];

const DATATYPES = { employment: "01", p10: "11", p25: "12", median: "13", p75: "14", p90: "15" };

function seriesId(soc, datatype) {
  const soc6 = soc.replace(/-/g, "");
  if (soc6.length !== 6) throw new Error(`Bad SOC ${soc}`);
  return `OEUN0000000000000${soc6}${datatype}`;
}

async function fetchSeries(seriesIds) {
  const body = {
    seriesid: seriesIds,
    startyear: String(new Date().getFullYear() - 1),
    endyear: String(new Date().getFullYear()),
  };
  if (key) body.registrationkey = key;

  const res = await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`BLS HTTP ${res.status}`);
  return res.json();
}

function latestAnnualValue(seriesPayload) {
  const data = seriesPayload?.data;
  if (!data?.length) return null;
  const annual = data.filter((d) => d.period === "A01" || d.periodName === "Annual");
  const row = annual[0] || data[0];
  const n = Number(String(row.value).replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return { value: n, year: row.year };
}

/** Piecewise-linear percentile rank of `threshold` against known BLS
 * percentile points, linearly extrapolated past p10/p90 and clamped. */
function percentileRankOf(threshold, points) {
  const pts = points.filter((p) => p.wage != null).sort((a, b) => a.pct - b.pct);
  if (pts.length < 2) return null;
  if (threshold <= pts[0].wage) {
    const slope = (pts[1].pct - pts[0].pct) / (pts[1].wage - pts[0].wage);
    return Math.max(1, pts[0].pct - slope * (pts[0].wage - threshold));
  }
  if (threshold >= pts[pts.length - 1].wage) {
    const a = pts[pts.length - 2], b = pts[pts.length - 1];
    const slope = (b.pct - a.pct) / (b.wage - a.wage);
    return Math.min(99, b.pct + slope * (threshold - b.wage));
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (threshold >= a.wage && threshold <= b.wage) {
      const t = (threshold - a.wage) / (b.wage - a.wage);
      return a.pct + t * (b.pct - a.pct);
    }
  }
  return null;
}

function playRateFromEmployment(emp) {
  if (!emp || emp <= 0) return null;
  const lo = Math.log10(PLAYRATE_EMP_MIN);
  const hi = Math.log10(PLAYRATE_EMP_MAX);
  const v = (Math.log10(emp) - lo) / (hi - lo);
  return Math.round(Math.max(0, Math.min(100, v * 100)));
}

function livablePctFromPercentiles(p10, p25, median, p75, p90) {
  const rank = percentileRankOf(LIVABLE_WAGE_THRESHOLD, [
    { pct: 10, wage: p10 },
    { pct: 25, wage: p25 },
    { pct: 50, wage: median },
    { pct: 75, wage: p75 },
    { pct: 90, wage: p90 },
  ]);
  if (rank == null) return null;
  return Math.round(Math.max(1, Math.min(99, 100 - rank)));
}

async function main() {
  const decks = JSON.parse(fs.readFileSync(decksPath, "utf8"));

  console.log("BLS OEWS refresh (median + employment + percentiles)");
  console.log("======================================================");
  console.log(`Mapped occupations: ${SOC_MAP.length}`);
  console.log(`BLS_API_KEY: ${key ? "set" : "not set (public limits)"}`);
  console.log(`Livable-wage threshold: $${LIVABLE_WAGE_THRESHOLD.toLocaleString()}/yr (see file header)`);
  console.log("");

  const allSeriesIds = [];
  for (const m of SOC_MAP) {
    for (const dt of Object.values(DATATYPES)) allSeriesIds.push(seriesId(m.soc, dt));
  }
  const chunks = [];
  for (let i = 0; i < allSeriesIds.length; i += 20) chunks.push(allSeriesIds.slice(i, i + 20));

  const bySeries = new Map();
  for (const [idx, chunk] of chunks.entries()) {
    const json = await fetchSeries(chunk);
    if (json.status !== "REQUEST_SUCCEEDED") {
      console.error(`BLS error (chunk ${idx + 1}/${chunks.length}):`, json.status, json.message);
      continue;
    }
    for (const s of json.Results?.series || []) bySeries.set(s.seriesID, s);
  }

  const updates = [];
  for (const m of SOC_MAP) {
    const deck = decks.find((d) => d.slug === m.slug);
    if (!deck) {
      console.log(`${m.slug.padEnd(45)} SKIPPED, no matching deck in seed`);
      continue;
    }

    const emp = latestAnnualValue(bySeries.get(seriesId(m.soc, DATATYPES.employment)))?.value ?? null;
    const p10 = latestAnnualValue(bySeries.get(seriesId(m.soc, DATATYPES.p10)))?.value ?? null;
    const p25 = latestAnnualValue(bySeries.get(seriesId(m.soc, DATATYPES.p25)))?.value ?? null;
    const medianRow = latestAnnualValue(bySeries.get(seriesId(m.soc, DATATYPES.median)));
    const median = medianRow?.value ?? null;
    const p75 = latestAnnualValue(bySeries.get(seriesId(m.soc, DATATYPES.p75)))?.value ?? null;
    const p90 = latestAnnualValue(bySeries.get(seriesId(m.soc, DATATYPES.p90)))?.value ?? null;

    const newPlayRate = playRateFromEmployment(emp);
    const newLivablePct = livablePctFromPercentiles(p10, p25, median, p75, p90);

    const prevMedian = deck.median ?? null;
    const prevPlayRate = deck.playRate ?? null;
    const prevLivable = deck.livablePct ?? null;

    console.log(
      `${m.slug.padEnd(45)} median ${String(prevMedian).padStart(7)}→${String(median ?? "n/a").padStart(7)}` +
        `  playRate ${String(prevPlayRate).padStart(3)}→${String(newPlayRate ?? "n/a").padStart(3)}` +
        `  livable% ${String(prevLivable).padStart(3)}→${String(newLivablePct ?? "n/a").padStart(3)}` +
        `  emp=${emp ? emp.toLocaleString() : "n/a"}${medianRow?.year ? `  [${medianRow.year}]` : ""}`,
    );

    if (median == null && newPlayRate == null && newLivablePct == null) continue;

    updates.push({ slug: m.slug, median, emp, newPlayRate, newLivablePct });

    if (apply) {
      if (median != null) deck.median = median;
      if (emp != null) {
        deck.frequencyCount = emp;
        deck.frequency = `~${emp.toLocaleString()} employed (BLS OEWS, ${medianRow?.year ?? "latest"})`;
      }
      if (newPlayRate != null) deck.playRate = newPlayRate;
      if (newLivablePct != null) deck.livablePct = newLivablePct;
      if (deck.dataQuality !== "verifiable") deck.dataQuality = "verifiable";
      if (!deck.sourceUrl?.includes("bls.gov")) deck.sourceUrl = "https://www.bls.gov/oes/";
    }
  }

  console.log("");
  console.log(`Would update ${updates.length} decks${apply ? " (APPLIED)" : " (dry-run)"}`);
  if (apply && updates.length) {
    fs.writeFileSync(decksPath, JSON.stringify(decks, null, 2) + "\n");
    console.log(`Wrote ${decksPath}`);
  } else if (!apply) {
    console.log("Re-run with --apply to write seed/income-decks.json");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
