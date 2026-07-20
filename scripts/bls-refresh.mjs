/**
 * BLS OEWS median refresh.
 *
 * Series ID (25 chars):
 *   OE + U + N + 0000000 + 000000 + {SOC6} + 13
 *   datatype 13 = annual median wage (national, all industries)
 *
 * Usage:
 *   node scripts/bls-refresh.mjs              # fetch + print diff
 *   node scripts/bls-refresh.mjs --apply      # write medians into seed
 *   node scripts/bls-refresh.mjs --dry-run    # same as default
 *
 * Optional: BLS_API_KEY for higher daily limits (v2 registration).
 * Docs: https://www.bls.gov/developers/
 * OEWS format: https://github.com/govex/bls-oews-api-tutorial
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const decksPath = path.join(root, "seed", "income-decks.json");
const apply = process.argv.includes("--apply");
const key = process.env.BLS_API_KEY || "";

/** SOC with dash → series for national annual median wage. */
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

function seriesIdForSoc(soc) {
  const soc6 = soc.replace(/-/g, "");
  if (soc6.length !== 6) throw new Error(`Bad SOC ${soc}`);
  // OE U N 0000000 000000 {soc6} 13
  return `OEUN0000000000000${soc6}13`;
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
  // Prefer latest annual
  const annual = data.filter((d) => d.period === "A01" || d.periodName === "Annual");
  const row = (annual[0] || data[0]);
  const n = Number(String(row.value).replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return { median: Math.round(n), year: row.year };
}

async function main() {
  const decks = JSON.parse(fs.readFileSync(decksPath, "utf8"));
  const mapped = SOC_MAP.map((m) => ({
    ...m,
    seriesId: seriesIdForSoc(m.soc),
  }));

  console.log("BLS OEWS refresh");
  console.log("================");
  console.log(`Mapped occupations: ${mapped.length}`);
  console.log(`BLS_API_KEY: ${key ? "set" : "not set (public limits)"}`);
  console.log("");

  // Batch in chunks of 20 (under 50 limit)
  const chunks = [];
  for (let i = 0; i < mapped.length; i += 20) chunks.push(mapped.slice(i, i + 20));

  const bySeries = new Map();
  for (const chunk of chunks) {
    const ids = chunk.map((m) => m.seriesId);
    const json = await fetchSeries(ids);
    if (json.status !== "REQUEST_SUCCEEDED") {
      console.error("BLS error:", json.status, json.message);
      continue;
    }
    for (const s of json.Results?.series || []) {
      bySeries.set(s.seriesID, s);
    }
  }

  const updates = [];
  for (const m of mapped) {
    const deck = decks.find((d) => d.slug === m.slug);
    const fetched = latestAnnualValue(bySeries.get(m.seriesId));
    const prev = deck?.median ?? null;
    const next = fetched?.median ?? null;
    const delta = prev != null && next != null ? next - prev : null;
    console.log(
      `${m.slug.padEnd(40)} ${String(prev).padStart(8)} → ${String(next ?? "n/a").padStart(8)}` +
        (delta != null ? `  (${delta >= 0 ? "+" : ""}${delta})` : "") +
        (fetched?.year ? `  [${fetched.year}]` : "") +
        `  ${m.seriesId}`,
    );
    if (deck && next != null && next !== prev) {
      updates.push({ slug: m.slug, from: prev, to: next, year: fetched.year });
      if (apply) {
        deck.median = next;
        if (deck.dataQuality === "self_reported") deck.dataQuality = "verifiable";
        // keep source pointing at BLS
        if (!deck.sourceUrl?.includes("bls.gov")) {
          deck.sourceUrl = "https://www.bls.gov/oes/";
        }
      }
    }
  }

  console.log("");
  console.log(`Would update ${updates.length} medians${apply ? " (APPLIED)" : " (dry-run)"}`);
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
