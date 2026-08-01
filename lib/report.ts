/**
 * Weekly report issues: dated periodicals under seed/reports/, one JSON per
 * week, written by scripts/build-report.mjs. Read at build time only; the
 * report routes are statically generated.
 */
import fs from "node:fs";
import path from "node:path";

export interface ReportDeckRef {
  slug: string;
  name: string;
  score: number;
  tier: string;
  median: number;
}

export interface ReportMover {
  slug: string;
  name: string;
  dStartNow: number;
  dCeiling: number;
  dMedian: number | null;
}

export interface ReportIssue {
  week: string;
  baseline: string;
  title: string;
  deckCount: number;
  sTierCount: number;
  pick: { startNow: ReportDeckRef; ceiling: ReportDeckRef };
  breaker: { slug: string; headline: string };
  risers: ReportMover[];
  fallers: ReportMover[];
  newDecks: string[];
  curation: string;
}

const DIR = path.join(process.cwd(), "seed", "reports");

/** All issues, newest first. Empty array when none have been published. */
export function listIssues(): ReportIssue[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")) as ReportIssue)
    .sort((a, b) => (a.week < b.week ? 1 : -1));
}

export function getIssue(week: string): ReportIssue | null {
  // week comes from the URL; resolve against the directory listing rather
  // than joining user input into a path.
  return listIssues().find((i) => i.week === week) ?? null;
}
