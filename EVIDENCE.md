# EVIDENCE: moneymeta.fun

Numbers only. A zero is data and gets logged as a zero. No gate passes without a
number or a dated receipt.

## Baseline (latest verified value by metric)

| Metric | Value | Source | As-of |
| --- | --- | --- | --- |
| Revenue (stranger $) | **$0** on the $29 founding license, ever | Stripe API | 2026-08-06 |
| MRR | **$0** (lifetime license is structurally non-recurring by design) | Stripe API | 2026-08-06 |
| Active customers | **0** | Stripe API | 2026-08-06 |
| Weekly report issues shipped | **3** (2026-08-01, 2026-08-06, 2026-08-14) | seed/reports/, live HTTP verification | 2026-08-26 |
| Weekly active usage | Unknown before 2026-08-26. Collection is now enabled; first measured window is pending | Vercel CLI | 2026-08-26 |
| Time to first value | Instant, the board renders with no signup | product | 2026-08-06 |
| Top risk | Zero distribution. Traffic is the experiment; the report and the launch post are the instrument, and neither has reached a stranger yet | this file | 2026-08-06 |

## Vercel Web Analytics: enabled 2026-08-26

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
- **Nothing before 2026-08-26 was measured.** Zero weekly counts can be logged,
  not because traffic is zero, but because the instrument was never actually
  turned on.
- Resolved 2026-08-26 with `vercel project web-analytics --format json` against
  the linked production project. Vercel returned `enabled: true` for
  `prj_pxbXCiitdt39fVNNlgwLP7Fj8NCB`. The analytics component was already in
  the app, so collection can begin without another code deploy.

## The $9/mo gate: 3 of 3 deployed, gate cleared

A "Meta Report subscriber" price may exist only after **3 consecutive weekly
issues have actually shipped**, meaning deployed to production, not just
built and committed. Progress:

| Issue | Week | Shipped | Baseline used | Movement |
| --- | --- | --- | --- | --- |
| 1 | 2026-08-01 | yes, deployed to production | 2026-07-29 | flat (0 risers, 0 fallers) |
| 2 | 2026-08-06 | yes, deployed to production (`dpl_7zj6iyWJz6fTKEGeCRXsPgYDQwFK`, verified live) | 2026-07-29 (unchanged, BLS dry-run confirmed 0 median moves) | flat (0 risers, 0 fallers) |
| 3 | 2026-08-14 | yes, deployed to production (`dpl_3fL3XLLSVE2U2x5aYnbE8BcWJNbY`, verified live 2026-08-26) | 2026-08-06 | flat (0 risers, 0 fallers; BLS dry-run confirmed 0 of 23 medians moved) |

**3 of 3 actually shipped.** The report cadence gate now passes. This permits a
$9/mo Meta Report subscriber price to be created, but no such price was created
in this task. The existing $29 founding license remains the only live price.

Ritual note: `scripts/snapshot-scores.mjs` ran immediately after the
2026-08-06 deploy was verified live, per `scripts/README.md`'s stated order
(build before snapshot, snapshot only after deploy). `seed/score-history.json`
was refreshed again after the issue 3 deployment. It now reads
`asOf: 2026-08-26`, carries `formulaVersion: 2`, and contains all 98 current
deck scores. This is the clean baseline for the next report after the scoring
rebase.

## The rail, verified 2026-08-06

| Object | ID | State |
| --- | --- | --- |
| Product | `prod_Us03rMzUYph1ty` | active, "moneymeta.fun founding lifetime license" |
| Price | `price_1TsG2uFL7C10dNyGCA847rpF` | active, $29 one-time, nickname "moneymeta.fun Founding License - $29 one-time" |
| Payment link | `plink_1TsG4pFL7C10dNyG03ZmtvWO` | active |
| Buy URL | https://buy.stripe.com/dRmbJ1eno9kNfYQfgZaMU0y | renders "moneymeta.fun founding lifetime license", SGD 38.64 at 1 USD = 1.3324 SGD |

One price is still live. The 3-issue gate is cleared, but no new price has been
created yet.

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
| 2026-08-14 | BLS dry-run checked before building issue 3 | assumed no changes | confirmed: 0 of 23 mapped occupation medians moved since 2026-08-06 | `node scripts/bls-refresh.mjs` output |
| 2026-08-14 | Third weekly report issue built and committed | 2 of 3, gate still open | issue 3 written to seed/reports/2026-08-14.json, auto-drafted curation left as generated (already honest, correctly reports the flat week), committed as `74f5707`. NOT yet deployed, gate stays at 2 of 3 real until it's live | seed/reports/2026-08-14.json, commit 74f5707 |
| 2026-08-26 | Scoring v2, issue 3, and the Capital Map deployed together | issue 3 committed but not live; local and remote branches diverged | reconciled commit `cb19c81` deployed to production; `/`, `/report/2026-08-14`, `/capital`, and `/deck/air-traffic-controllers` all returned HTTP 200 with expected content; no Vercel runtime errors in the verification window | deploy `dpl_3fL3XLLSVE2U2x5aYnbE8BcWJNbY`, Ready |
| 2026-08-26 | Post-deploy scoring baseline refreshed | v1 cadence baseline and formula rebase | `asOf: 2026-08-26`, `formulaVersion: 2`, 98 current scores; future movement compares like with like | seed/score-history.json |
| 2026-08-26 | Vercel Web Analytics enabled on the production project | client component present but analytics product not provisioned | Vercel CLI returned `enabled: true` for project `prj_pxbXCiitdt39fVNNlgwLP7Fj8NCB`; first measured window pending | `vercel project web-analytics --format json` |
| 2026-08-26 | Scoring v2 verification fixes deployed | report builder could publish false movers after a formula change; integer ties distorted tier sizes; README and one launch citation were stale | report movement now rebases by formula version; both lenses have exact `10/15/29/29/15` S/A/B/C/D counts; 26 BLS-mapped decks carry direct OEWS series links; `/`, issue 3, `/capital`, and the ATC deck all returned HTTP 200 with corrected content | commit `62a8d81`, deploy `dpl_5fGnHs3gJt1PeRGn9dp32vXMeKfn`, Ready |
| 2026-08-26 | Corrected post-deploy baseline snapshot | BLS refresh changed ATC popularity plus nuclear-operator and sales-engineer inputs | 98 scores stamped at formula v2 after the corrected deployment; sales engineer is now 63/40 and nuclear operator 60/38 | seed/score-history.json |

## What changes the zero

1. ~~Deploy issue 2~~ done 2026-08-06.
2. ~~Snapshot the new baseline~~ done 2026-08-06.
3. ~~Enable Vercel Web Analytics so traffic can actually be measured~~ done
   2026-08-26.
4. Post the launch draft (or an edited version of it). Still open.
5. ~~Ship issue 3 and clear the $9/mo gate~~ done 2026-08-26.

## Rules

- A gate is not PASS without a number or a dated receipt.
- Self-payments and test charges do not count as stranger revenue.
- After every meaningful ship, add one row to the results log.
- Log zeros. Zero is the true number here and hiding it is lying.
