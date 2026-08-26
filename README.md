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
| Deck win rate      | **Livable-income rate** (`livablePct`)          |
| Size of the win    | **Median income** (BLS wage)                    |
| Deck trajectory    | **Growth** (BLS 10-year projection)             |
| Barrier            | time-to-first-income + capital needed           |
| Meta score         | win-rate-adjusted payoff + growth + reach       |
| Tier (S/A/B/C/D)   | Derived from the meta score                     |

Two lenses, each with its own tiering: **start now** (expected payoff, growth,
and reachability) and **highest ceiling** (terminal pay and trajectory,
conditional on making it).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind + shadcn-style primitives ·
deployed on Vercel · pnpm. No database: the board renders from committed JSON.

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

The board renders directly from
[`seed/income-decks.json`](seed/income-decks.json) (BLS-anchored, 98 decks) plus
real exemplars in [`seed/exemplars.json`](seed/exemplars.json). Scores and tiers
are computed in [`lib/income.ts`](lib/income.ts) and never stored.

## The meta formula

All tunable constants live in [`lib/income.ts`](lib/income.ts):

```
payoff   = income * (livablePct / 100)
startNow = 0.4*payoff + 0.2*growth + 0.4*reach  (reach = 0.6*time + 0.4*capital)
ceiling  = 0.7*income + 0.3*growth
income normalized $30k->0 .. $250k->100; growth uses the BLS 10-year projection
tiers: exact relative bands, top 10% S, next 15% A, next 30% B,
       next 30% C, bottom 15% D; S also requires score >= 55
```

Scores and tiers are always derived, never stored.

## Also here

- [`/capital`](https://moneymeta.fun/capital): the source-linked Map of Capitalism.
- [`/sprint`](https://moneymeta.fun/sprint): the AI Build Sprint offer page.

The old scored Capital and Career boards were removed in the 2026-07-20
refocus. `/income` and `/career` redirect to `/`; `/capital` is a source map,
not a second scored board.
