# moneymeta.fun. Claude Code Project Brief

> Status: **Live on moneymeta.fun (Vercel).** ONE board: the money meta.
> The whole site is the income board, served at the root (`/`, `app/page.tsx`).
> It answers one question: the best money deck to play in life. Income *paths*
> ("decks") come from `seed/income-decks.json` (BLS-anchored, 90 decks) via
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
| How often a deck wins         | **Median income** (BLS wage) = win rate         |
| Deck trajectory               | **Growth** (BLS 10-year projection)             |
| Barrier to play the deck      | time-to-first-income + capital needed           |
| Meta score                    | `income × growth ÷ barrier` → 0..100            |
| Tier (S/A/B/C/D)              | Derived from the meta score                     |
| Deck archetype                | Income path (profession, trade, owner, internet)|

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

- `seed/income-decks.json` — 90 decks: slug, name, category, metaClass, playRate
  (0-100 crowdedness), livablePct (win-rate proxy), whatYouDo, median,
  incomeRangeNote, frequency, frequencyCount, growthPct, barrierToEntry,
  timeToFirstIncomeYears, capitalTier, dataQuality, sourceUrl.
- `seed/exemplars.json` — real people wired onto internet decks, keyed by slug.
- `seed/meta-report.json` — curated Data Reaper layer: Meta Breaker + hybrid
  matchup stacks (opener → midgame → wincon).
- `seed/playbooks.json` — curated how-to guides for high-leverage decks; all
  other decks get a category-aware default playbook from `lib/playbook.ts`.

Scores and tiers are computed in a pure function in `lib/income.ts`, never stored.

### Meta formula (tunable, `lib/income.ts`)

```
startNow = 0.4*income + 0.2*growth + 0.4*reach   (reach = 0.6*time + 0.4*capital)
ceiling  = 0.7*income + 0.3*growth
income normalized $30k->0 .. $250k->100 ; growth on the BLS 10-year projection
tiers: S >= 70 · A >= 58 · B >= 46 · C >= 34 · D < 34
```

Weights and thresholds are exported constants, trivial to retune.

---

## Where things live

- `app/page.tsx` — the board (masthead + lens + The Pick/breaker/matchups + tiers).
- `app/deck/[slug]/page.tsx` — per-deck playbook (steps, tools, pitfalls, ladder).
- `app/layout.tsx`, `app/globals.css` — shell, fonts, the atmosphere layer.
- `app/opengraph-image.tsx` — edge OG image. `app/sprint/page.tsx` — offer page.
- `components/income/*` — income-board, income-card, income-meta, the-pick,
  meta-breaker, matchup-chart, class-frequency.
- `components/report-masthead.tsx`, `components/site-footer.tsx` — shared chrome.
- `components/tier-styles.ts` — the S..D visual language.
- `lib/income.ts` — scoring · `lib/meta-report.ts` — The Pick / breaker / matchups
  · `lib/playbook.ts` — playbook resolve · `lib/meta.ts` · `lib/format.ts`.

---

## Roadmap

- **Now (done):** single income board, live, static JSON, two lenses, badges,
  The Pick, Meta Breaker, class frequency, movers strip, matchup chart, 90
  decks with playRate/livablePct, per-deck playbooks (curated owner-ops too),
  live BLS OEWS refresh (`scripts/bls-refresh.mjs --apply`), score snapshots
  for movement (`seed/score-history.json`).
- **Next:** push weekly cadence (BLS refresh → ship → snapshot); more curated
  playbooks for remaining profession/healthcare decks; optional public BLS
  key in CI for scheduled refresh.

---

## Aesthetic

VS meta report x Hearthstone tier list. Dark, dense, data-forward. Tier rows with
S..D color coding (amber/violet/cyan/emerald/slate heat ramp). Decks as compact
card tiles, score as a prominent badge. Mobile-first, it has to read well on a
phone.

---

## Guardrails, do NOT do these

- **No self-reported or user-submitted data as truth, ever.** Public, verifiable
  sources only; flag anything softer with a data-confidence badge.
- **One board.** Do not re-add the Capital or Career boards without a clear
  decision; the refocus to solely the money meta was deliberate.
- **Don't store computed values** (score, tier) as raw columns, derive them.
- **No em-dashes** anywhere, in product copy or in replies.
