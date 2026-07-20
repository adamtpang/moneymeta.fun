# moneymeta.fun

**The Vicious Syndicate of moneymaking.** A data-driven tier list of every way to
make money, ranked S to D by a **meta score** from public, verifiable data. Check
it like a Hearthstone meta report: the best money deck to play in life right now.

Not financial or career advice. Every number traces to a public source, and
internet paths carry a data-confidence badge because most real medians are brutal.

## The idea

Vicious Syndicate's meta score ≈ **popularity × win rate**, mapped onto income:

| Hearthstone (VS)   | moneymeta.fun                                   |
| ------------------ | ----------------------------------------------- |
| Deck win rate      | **Median income** (BLS wage)                    |
| Deck trajectory    | **Growth** (BLS 10-year projection)             |
| Barrier            | time-to-first-income + capital needed           |
| Meta score         | `income × growth ÷ barrier` → 0–100             |
| Tier (S/A/B/C/D)   | Derived from the meta score                     |

Two lenses, each with its own tiering: **start now** (income ÷ barrier ÷ time,
what a high-agency person with little capital can reach fastest) and **highest
ceiling** (terminal pay and trajectory, the long climb).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind + shadcn-style primitives ·
deployed on Vercel · pnpm. No database: the board renders from committed JSON.

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

The board renders directly from
[`seed/income-decks.json`](seed/income-decks.json) (BLS-anchored, 62 decks) plus
real exemplars in [`seed/exemplars.json`](seed/exemplars.json). Scores and tiers
are computed in [`lib/income.ts`](lib/income.ts) and never stored.

## The meta formula

All tunable constants live in [`lib/income.ts`](lib/income.ts):

```
startNow = 0.4*income + 0.2*growth + 0.4*reach   (reach = 0.6*time + 0.4*capital)
ceiling  = 0.7*income + 0.3*growth
income normalized $30k→0 … $250k→100 · growth on the BLS 10-year projection
tiers: S ≥ 70 · A ≥ 58 · B ≥ 46 · C ≥ 34 · D < 34
```

Scores and tiers are always derived, never stored.

## Also here

- [`/sprint`](https://moneymeta.fun/sprint) — the AI Build Sprint offer page (the cash floor).

The Capital and Career boards were removed in the 2026-07-20 refocus to make the
site solely the money meta; `/income` and `/career` redirect to `/`.
