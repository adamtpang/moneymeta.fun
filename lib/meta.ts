/**
 * The tier vocabulary, S through D. Nothing else.
 *
 * This file used to hold the Capital board's scoring (market cap x growth,
 * its own TIER_THRESHOLDS with S >= 80, normalizeSize, metaScore, tierFor) and
 * a docblock calling itself "the single source of truth for ranking". The
 * Capital board was removed in the 2026-07-20 refocus and none of that had
 * been imported since: every consumer only ever took the `Tier` type and
 * `TIER_ORDER`. Deleted 2026-08-23, because a repo with two competing sets of
 * tier thresholds, the dead one sounding more authoritative than the live one,
 * is a trap for whoever reads it next.
 *
 * The live ranking lives in lib/income.ts: scoreFor() for the score, and
 * TIER_BANDS / TIER_FLOOR_S for the grading rubric.
 */

export type Tier = "S" | "A" | "B" | "C" | "D";

export const TIER_ORDER: readonly Tier[] = ["S", "A", "B", "C", "D"];
