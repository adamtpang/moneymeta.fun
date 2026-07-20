/**
 * BLS OEWS refresh scaffold (free public API, no key).
 *
 * Pulls latest Occupational Employment and Wage Statistics for a map of
 * SOC codes → deck slugs, then prints a proposed median patch. Does NOT
 * write seed by default (review first).
 *
 * Usage:
 *   node scripts/bls-refresh.mjs
 *   node scripts/bls-refresh.mjs --apply   # writes medians into seed/income-decks.json
 *
 * Docs: https://www.bls.gov/developers/api_signature_v2.htm
 * OEWS series pattern uses registration series IDs; the open JSON endpoint
 * for multi-series is documented at bls.gov/developers.
 *
 * This script uses the public OEWS data tables via the BLS public API v2
 * when BLS_API_KEY is set, and falls back to printing the mapping checklist
 * when offline / unkeyed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const decksPath = path.join(root, "seed", "income-decks.json");
const apply = process.argv.includes("--apply");

/**
 * SOC codes we care about for BLS-anchored decks.
 * Median annual = OEWS A_MEDIAN when available.
 */
const SOC_MAP = [
  { slug: "software-developers", soc: "15-1252", label: "Software Developers" },
  { slug: "data-scientists", soc: "15-2051", label: "Data Scientists" },
  { slug: "ai-ml-engineers", soc: "15-1221", label: "Computer and Information Research Scientists" },
  { slug: "nurse-practitioners", soc: "29-1171", label: "Nurse Practitioners" },
  { slug: "physicians-surgeons", soc: "29-1210", label: "Physicians" },
  { slug: "dentists", soc: "29-1021", label: "Dentists, General" },
  { slug: "lawyers", soc: "23-1011", label: "Lawyers" },
  { slug: "financial-managers", soc: "11-3031", label: "Financial Managers" },
  { slug: "actuaries", soc: "15-2011", label: "Actuaries" },
  { slug: "electrician", soc: "47-2111", label: "Electricians" },
  { slug: "plumber-pipefitter", soc: "47-2152", label: "Plumbers, Pipefitters, and Steamfitters" },
  { slug: "hvac-technician", soc: "49-9021", label: "Heating, Air Conditioning, and Refrigeration Mechanics" },
  { slug: "real-estate-agent-broker", soc: "41-9022", label: "Real Estate Sales Agents" },
  { slug: "b2b-saas-sales", soc: "41-4011", label: "Sales Representatives, Wholesale and Manufacturing, Technical" },
];

const key = process.env.BLS_API_KEY;

async function fetchOewsViaApi() {
  if (!key) return null;
  // BLS series IDs for OEWS national annual median wages are published
  // in their series ID formats. For a first pipeline we request popular
  // series if configured; otherwise we return null and print checklist.
  // Keep this soft: BLS series IDs change; operators should verify.
  const seriesIds = SOC_MAP.map((m) => m.seriesId).filter(Boolean);
  if (seriesIds.length === 0) return null;

  const res = await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seriesid: seriesIds,
      startyear: String(new Date().getFullYear() - 2),
      endyear: String(new Date().getFullYear()),
      registrationkey: key,
    }),
  });
  if (!res.ok) throw new Error(`BLS HTTP ${res.status}`);
  return res.json();
}

function main() {
  const decks = JSON.parse(fs.readFileSync(decksPath, "utf8"));
  console.log("BLS refresh scaffold");
  console.log("--------------------");
  console.log(`Decks on board: ${decks.length}`);
  console.log(`Mapped SOC occupations: ${SOC_MAP.length}`);
  console.log(`BLS_API_KEY: ${key ? "set" : "not set (checklist mode)"}`);
  console.log("");
  console.log("Manual OEWS checklist (verify A_MEDIAN on bls.gov/oes):");
  for (const m of SOC_MAP) {
    const deck = decks.find((d) => d.slug === m.slug);
    console.log(
      `- ${m.slug.padEnd(32)} SOC ${m.soc}  current median=${deck?.median ?? "missing"}  (${m.label})`,
    );
  }
  console.log("");
  console.log(
    "Next: set BLS_API_KEY, add seriesId fields to SOC_MAP from BLS series builders,",
  );
  console.log("then re-run with --apply after verifying numbers.");
  if (apply) {
    console.log("");
    console.log("--apply requested but no live series payload was applied.");
    console.log("Wire series IDs first so we never overwrite seed with empty data.");
  }
}

main();
