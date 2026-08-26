# moneymeta.fun. Claude Code Project Brief

> Status: **Live on moneymeta.fun (Vercel).** ONE board: the money meta.
> The whole site is the income board, served at the root (`/`, `app/page.tsx`).
> It answers one question: the best money deck to play in life. Income *paths*
> ("decks") come from `seed/income-decks.json` (BLS-anchored, 98 decks) via
> `lib/income.ts`, with a two-lens toggle (start-now vs highest-ceiling),
> data-confidence badges, and real indie-hacker exemplars (`seed/exemplars.json`)
> on the internet decks. VS-style report layer: **The Pick**, **Meta Breaker**,
> **class frequency** (play rate × livable win %), and **matchup chart** from
> `seed/meta-report.json` via `lib/meta-report.ts`. Per-deck playbooks at
> `/deck/[slug]`.
>
> The Capital board and Career board were removed in the 2026-07-20 refocus;
> `/income` and `/career` 301-redirect to `/`. `/sprint` is a standalone offer
> page (the AI Build Sprint cash floor), not a board. No database is used; the
> board renders directly from committed JSON.
>
> **Added 2026-08-26:** `/solopreneurs` is the source-linked Solo Operator
> Index. It ranks nine current and historic one-person businesses using a
> transparent 60% revenue scale + 20% evidence + 10% solo purity + 10% duration
> score from `seed/solopreneurs.json` and `lib/solopreneurs.ts`. Exits,
> cumulative revenue, and game unit sales live on a separate record board so
> unlike metrics do not distort the annual-revenue ranking.
>
> **Added 2026-08-26:** `/solopreneurs/study` is the S-tier study lab for
> Markus Frind, Gary Brewer, and Pieter Levels. Source-linked operating loops,
> timelines, exact metrics, evidence ledgers, copyable tactics, noncopyable
> advantages, and failure modes come from `seed/solo-playbooks.json` through
> `lib/solo-playbooks.ts`. A private client-only workbench compares the user's
> current operating system without saving or publishing entered numbers.
>
> **Design refresh 2026-08-26:** shared chrome and primary boards now follow
> shadcn `dashboard-01`: compact sticky navigation, neutral graphite surfaces,
> 8px maximum radii, flat data bands, and no atmospheric gradients or glows.
> Active shadcn primitives: Button, Input, Label, Progress, Separator, Tabs,
> and Tooltip. See `DESIGN.md` for the live system.

---

## What we're building

**moneymeta.fun is the Vicious Syndicate of moneymaking.** A data-driven tier
list of every way to make money, ranked S to D by a **meta score** computed from
public, verifiable data. The user checks it like a Hearthstone meta report: which
income deck is strongest to play right now, given where they are.

This is a **personal decision instrument**, not financial or career advice, and
not a social/self-report app. Every number traces to a public source.

### The one idea that makes this work

Vicious Syndicate's meta score ≈ **popularity × win rate**. We map that onto income:

| Hearthstone (VS)              | moneymeta.fun                                   |
| ----------------------------- | ----------------------------------------------- |
| How often a deck wins         | **`livablePct`** = share of players clearing a livable income |
| How big the win is            | **Median income** (BLS wage) = payoff, not win rate |
| How often a deck is played    | **`playRate`** (BLS employment counts) = popularity |
| Deck trajectory               | **Growth** (BLS 10-year projection)             |
| Barrier to play the deck      | time-to-first-income + capital needed           |
| Meta score                    | win-rate-adjusted payoff + growth + reachability -> 0..100 |
| Tier (S/A/B/C/D)              | Derived from the meta score                     |
| Deck archetype                | Income path (profession, trade, owner, internet)|

**Corrected 2026-08-23.** This table used to read "Median income = win rate",
and `lib/income.ts` scored accordingly: `livablePct` and `playRate` were in the
seed, rendered on every card, and absent from `scoreFor()` entirely. Median
income is the size of the win, not the odds of it. Ranking by payoff alone put
a 12%-win-rate franchise in S tier beside a 99%-win-rate profession, which is
the Hearthstone equivalent of ranking decks by average damage dealt. Do not
reintroduce the conflation.

Unlike self-reported income (gameable, survivorship-biased), the BLS anchors are
public and verifiable. Internet/creator paths that lack a public median are shown
with a data-confidence badge and a brutal near-$0 median, never guru claims. How
many people do a path (frequency) is shown as context on each deck, not yet
weighted into the score. Do not add self-reported data as if it were truth.

### The two lenses (the answer to "best deck to play in life")

- **Start now** = 0.4 income + 0.2 growth + 0.4 reachability (reach = 0.6 time +
  0.4 capital gate). The best deck to open with today on little capital.
- **Highest ceiling** = 0.7 income + 0.3 growth. Terminal pay and trajectory.

Each lens derives its own S..D tiering; the same deck can tier differently.

---

## Tech stack

- **Next.js 14**, App Router, **TypeScript**
- **Tailwind CSS** + shadcn-style primitives
- Deploy to **Vercel** (Adam runs `vercel deploy --prod` manually; the agent is
  blocked from prod deploys, so it commits and hands off)
- `pnpm`
- **No database in use.** Static seed JSON only.

---

## Data model (static JSON, nothing computed is stored)

- `seed/income-decks.json`: 98 decks: slug, name, category, metaClass, playRate
  (0-100 crowdedness), livablePct (win-rate proxy), whatYouDo, median,
  incomeRangeNote, frequency, frequencyCount, growthPct, barrierToEntry,
  timeToFirstIncomeYears, capitalTier, dataQuality, sourceUrl.
- `seed/exemplars.json`: real people wired onto internet decks, keyed by slug.
- `seed/meta-report.json`: curated Data Reaper layer: Meta Breaker + hybrid
  matchup stacks (opener → midgame → wincon).
- `seed/playbooks.json`: curated how-to guides for high-leverage decks; all
  other decks get a category-aware default playbook from `lib/playbook.ts`.

Scores and tiers are computed in a pure function in `lib/income.ts`, never stored.

### Meta formula (tunable, `lib/income.ts`)

```
payoff   = income * winRate                      (winRate = livablePct / 100)
startNow = 0.4*payoff + 0.2*growth + 0.4*reach   (reach = 0.6*time + 0.4*capital)
ceiling  = 0.7*income + 0.3*growth               (no win-rate discount, see below)
income normalized $30k->0 .. $250k->100 ; growth on the BLS 10-year projection
tiers: relative bands, top 10% S, next 15% A, next 30% B, next 30% C, bottom 15% D
```

### The grading rubric (what a tier actually means)

Tiers are **relative to the current board**, not absolute score cutoffs. This is
a meta report: a VS Tier 1 deck is Tier 1 relative to the current meta, not
against a fixed standard. Bands live in `TIER_BANDS` (`lib/income.ts`).

| Tier | Band | What it means for the reader |
|---|---|---|
| **S** | top 10% | Take it seriously as a plan. High pay, good odds, reachable without capital. |
| **A** | next 15% | Strong, but one thing costs you: years, a credential, capital, or odds under 90%. |
| **B** | next 30% | A real living for most who stick with it. Ordinary ceiling. |
| **C** | next 30% | Works for a minority. Most who try do not clear a living. |
| **D** | bottom 15% | Median outcome near zero, or the barrier eats the payoff. |

`TIER_FLOOR_S` (55) is the one absolute guard: no deck is called S purely for
topping a bad field. If nothing clears the floor, S is empty and that emptiness
is a real statement, not a scaling bug.

Fixed cutoffs (S>=70 A>=58 B>=46 C>=34) were replaced 2026-08-23. They were
calibrated to the v1 distribution and never moved when v2's win-rate multiplier
compressed the scale, which left S permanently empty and made "should S be 58 or
63" unanswerable, because nothing anywhere in the repo said what S meant.
Percentile bands self-correct on every formula change and seed refresh.
They rank on the unrounded formula result and break exact ties by slug, then
display the rounded score. This keeps the promised band sizes exact without
making seed order an invisible input.

The two lenses treat the odds differently on purpose. **startNow is expected
value**: it answers "what happens if you start this today", so the chance of
losing belongs in the number. **ceiling is conditional value**: it already
means "if you make it, how high", so discounting it by win rate would
double-count the same risk startNow already prices.

`SCORE_FORMULA_VERSION` in `lib/income.ts` is stamped into
`seed/score-history.json`. When they disagree, movement is reported as
`rebased` and deltas are zeroed, so a formula change never publishes fake
risers and fallers. After any formula change, re-run
`node scripts/snapshot-scores.mjs`.

Weights and thresholds are exported constants, trivial to retune. The formula
is duplicated in `scripts/snapshot-scores.mjs` (it runs without TS); keep the
two in lockstep or the baseline drifts from the live board.

---

## Where things live

- `app/page.tsx`: the board (masthead + lens + The Pick/breaker/matchups + tiers).
- `app/deck/[slug]/page.tsx`: per-deck playbook (steps, tools, pitfalls, ladder).
- `app/layout.tsx`, `app/globals.css`: shell, fonts, the atmosphere layer.
- `app/solopreneurs/study/page.tsx`, `components/solopreneurs/study-lab.tsx`:
  S-tier research and private gap workbench.
- `seed/solo-playbooks.json`, `lib/solo-playbooks.ts`: sourced operator
  playbooks and evidence ledgers.
- `app/opengraph-image.tsx`: edge OG image. `app/sprint/page.tsx`: offer page.
- `components/income/*`: income-board, income-card, income-meta, the-pick,
  meta-breaker, matchup-chart, class-frequency.
- `components/report-masthead.tsx`, `components/site-footer.tsx`: shared chrome.
- `components/tier-styles.ts`: the S..D visual language.
- `lib/income.ts`: scoring · `lib/meta-report.ts`: The Pick / breaker / matchups
  · `lib/playbook.ts`: playbook resolve · `lib/meta.ts` · `lib/format.ts`.

---

## Roadmap

- **Now (done):** single income board, live, static JSON, two lenses, badges,
  The Pick, Meta Breaker, class frequency, movers strip, matchup chart, 90
  98 decks with playRate/livablePct, per-deck playbooks (curated owner-ops too),
  live BLS OEWS refresh (`scripts/bls-refresh.mjs --apply`), score snapshots
  for movement (`seed/score-history.json`).
- **Next:** push weekly cadence (BLS refresh → ship → snapshot); more curated
  playbooks for remaining profession/healthcare decks; optional public BLS
  key in CI for scheduled refresh.
- **Next for solo research:** use the private gap workbench with Adam's actual
  baseline, then turn the top three gaps into one dated operating experiment.

---

## Aesthetic

VS meta report x Hearthstone tier list. Dark, dense, data-forward. Tier rows with
S..D color coding (amber/violet/cyan/teal/slate heat ramp; C moved off emerald
2026-08-08, emerald was already the app's primary/positive-signal color, see
`components/tier-styles.ts`). Decks as compact card tiles, score as a
prominent badge. Mobile-first, it has to read well on a phone. Micro-label
type (chips, badges, category tags) uses the named `text-micro` (10px) /
`text-label` (11px) tokens in `tailwind.config.ts`, not ad hoc `text-[Npx]`.
The shared canvas is neutral graphite rather than blue-black. Emerald is limited
to brand, action, positive movement, and focus. Ambient gradients, glow orbs,
and blueprint grids were removed so the board reads as an operating tool.

---

## Guardrails, do NOT do these

- **No self-reported or user-submitted data as truth, ever.** Public, verifiable
  sources only; flag anything softer with a data-confidence badge.
- **One board.** Do not re-add the Capital or Career boards without a clear
  decision; the refocus to solely the money meta was deliberate.
- **Don't store computed values** (score, tier) as raw columns, derive them.
- **No em-dashes** anywhere, in product copy or in replies.
