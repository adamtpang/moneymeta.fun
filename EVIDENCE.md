# EVIDENCE: moneymeta.fun

Numbers only. A zero is data and gets logged as a zero. No gate passes without a
number or a dated receipt.

## Baseline (as of 2026-08-06, from live Stripe, Vercel, and HTTP reads)

| Metric | Value | Source | As-of |
| --- | --- | --- | --- |
| Revenue (stranger $) | **$0** on the $29 founding license, ever | Stripe API | 2026-08-06 |
| MRR | **$0** (lifetime license is structurally non-recurring by design) | Stripe API | 2026-08-06 |
| Active customers | **0** | Stripe API | 2026-08-06 |
| Weekly report issues shipped | **2** (2026-08-01, 2026-08-06) | seed/reports/, this file | 2026-08-06 |
| Weekly active usage | Unknown. Vercel Web Analytics is NOT actually enabled, see below | Vercel API | 2026-08-06 |
| Time to first value | Instant, the board renders with no signup | product | 2026-08-06 |
| Top risk | Zero distribution. Traffic is the experiment; the report and the launch post are the instrument, and neither has reached a stranger yet | this file | 2026-08-06 |

## Correction: Vercel Web Analytics is not enabled

The 2026-08-01 baseline in this file claimed "Vercel Analytics enabled
2026-07-31, first beacons verified 200." That claim was checked against the
wrong signal. Re-verified 2026-08-06:

- The client script **is** correctly wired in code (`app/layout.tsx` imports
  `Analytics` from `@vercel/analytics/next` and renders it) and **does**
  inject client-side: confirmed in a real browser, `window.va` is a function
  and `https://moneymeta.fun/_vercel/insights/script.js` loads.
- But calling the Web Analytics data API directly
  (`get_web_analytics`, mode count) returns **`404 Web Analytics not found`**
  for this project. That is not "no data yet," it is the feature itself not
  provisioned. The `/_vercel/insights/script.js` endpoint returning HTTP 200
  is a platform-wide route that exists regardless of whether the product is
  turned on, so it proves nothing about collection.
- **Nothing has been measured.** Zero weekly counts can be logged this week,
  not because traffic is zero, but because the instrument was never actually
  turned on. Fix: enable Web Analytics at
  vercel.com/adamtpangs-projects/moneymeta.fun, Analytics tab. This is a
  dashboard toggle, same as the beware.dog and summon.company gap.

## The $9/mo gate: 2 of 3

A "Meta Report subscriber" price may exist only after **3 consecutive weekly
issues have actually shipped**. Progress:

| Issue | Week | Shipped | Baseline used | Movement |
| --- | --- | --- | --- | --- |
| 1 | 2026-08-01 | yes, deployed to production | 2026-07-29 | flat (0 risers, 0 fallers) |
| 2 | 2026-08-06 | **yes, deployed to production** (`dpl_7zj6iyWJz6fTKEGeCRXsPgYDQwFK`, verified live) | 2026-07-29 (unchanged, BLS dry-run confirmed 0 median moves) | flat (0 risers, 0 fallers) |
| 3 | pending | not yet built | 2026-08-06 (fresh, snapshotted post-deploy) | n/a |

**2 of 3, both now genuinely shipped.** Do not mint the $9/mo price yet.
Ship issue 3 to clear the gate.

Ritual note: `scripts/snapshot-scores.mjs` ran immediately after the
2026-08-06 deploy was verified live, per `scripts/README.md`'s stated order
(build before snapshot, snapshot only after deploy). `seed/score-history.json`
now reads `asOf: 2026-08-06`, scores unchanged (nothing moved), so issue 3
will compare against a fresh baseline instead of citing 2026-07-29 a third
time.

## The rail, verified 2026-08-06

| Object | ID | State |
| --- | --- | --- |
| Product | `prod_Us03rMzUYph1ty` | active, "moneymeta.fun founding lifetime license" |
| Price | `price_1TsG2uFL7C10dNyGCA847rpF` | active, $29 one-time, nickname "moneymeta.fun Founding License - $29 one-time" |
| Payment link | `plink_1TsG4pFL7C10dNyG03ZmtvWO` | active |
| Buy URL | https://buy.stripe.com/dRmbJ1eno9kNfYQfgZaMU0y | renders "moneymeta.fun founding lifetime license", SGD 38.64 at 1 USD = 1.3324 SGD |

One price, as required. No changes made; correctly untouched pending the
3-issue gate.

## Verified results log

| Date | Change | Before | After | Evidence |
| --- | --- | --- | --- | --- |
| 2026-07-26 | Fleet bootstrap created this baseline | n/a | file exists | this file |
| 2026-08-01 | First weekly report issue: /report + /report/2026-08-01, builder script, Monday ritual, subscribe capture, fleet footer | no recurring artifact | issue 1 of 3, deployed to production | seed/reports/2026-08-01.json, scripts/build-report.mjs, live at moneymeta.fun/report |
| 2026-08-06 | BLS dry-run checked before shipping issue 2 | assumed no changes | confirmed: 0 of 23 mapped occupation medians moved since last refresh | `node scripts/bls-refresh.mjs` output, this file |
| 2026-08-06 | Second weekly report issue built, proving the cadence actually recurs | 1 of 3, single data point | 2 of 3, curation hand-edited (not a copy of issue 1) to surface the real service-as-software Meta Breaker content and explain why an annual-data board reads flat between BLS releases | seed/reports/2026-08-06.json |
| 2026-08-06 | Vercel Web Analytics claim corrected | believed enabled and collecting | verified NOT enabled: API returns 404; client script confirmed wired and injecting, but the product itself was never turned on | Vercel API, browser check |
| 2026-08-06 | OFFER.md filled for real, no brackets | template with `[buyer]` | real buyer, pain, cure, alternative, proof, price, risk reversal noted as incomplete (no refund policy stated) | OFFER.md |
| 2026-08-06 | Launch post drafted from a real, verified counterintuitive finding | none | LinkedIn/X drafts citing the Chick-fil-A operator #2 ranking and its 0.25% acceptance rate (verified fresh via QSR Pro), unsent | launch/LAUNCH_DRAFTS.md |
| 2026-08-06 | Fleet footer and fleet.json re-checked | assumed correct | confirmed already correct from the 2026-08-01 session: footer carries adam.gives, deathmoney.fyi, skill.supply; fleet.json status is "live", tier 1 | components/site-footer.tsx, Aether/fleet.json |
| 2026-08-06 | Deployed to production on Adam's instruction | issue 2 built and committed, not yet live | verified live: /, /report, /report/2026-08-06, /report/2026-08-01, /sprint, /deck/dentists all 200, issue 2 curation confirmed present in the served HTML | deploy `dpl_7zj6iyWJz6fTKEGeCRXsPgYDQwFK`, Ready |
| 2026-08-06 | Post-deploy baseline snapshot, per the ritual's stated order | score-history.json still read 2026-07-29 (used by both issues 1 and 2) | `asOf: 2026-08-06`, scores unchanged (nothing moved), issue 3 gets a fresh baseline | seed/score-history.json |

## What changes the zero

1. ~~Deploy issue 2~~ done 2026-08-06.
2. ~~Snapshot the new baseline~~ done 2026-08-06.
3. Enable Vercel Web Analytics in the dashboard so traffic can actually be
   measured, not assumed. Still open.
4. Post the launch draft (or an edited version of it). Still open.
5. Ship issue 3 next week to clear the $9/mo gate, if the cadence holds.

## Rules

- A gate is not PASS without a number or a dated receipt.
- Self-payments and test charges do not count as stranger revenue.
- After every meaningful ship, add one row to the results log.
- Log zeros. Zero is the true number here and hiding it is lying.
