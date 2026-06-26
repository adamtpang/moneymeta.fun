# moneymeta.fun

**Vicious Syndicate for capitalism.** A data-driven tier list of wealth vehicles
("income decks"), ranked by a **meta score** computed from public, verifiable
market-cap data. Check it like a Hearthstone meta report: what's strong right
now, what's rising, what's falling.

This is a personal daily allocation instrument — **not financial advice**, and
**never** built on self-reported data. Every number traces to a public source.

## The idea

Vicious Syndicate's meta score ≈ **popularity × win rate**. We map that onto
capital:

| Hearthstone (VS)          | moneymeta.fun                          |
| ------------------------- | -------------------------------------- |
| Deck popularity           | **Market cap** (where capital lives)   |
| Deck win rate             | **Growth rate** (recent % change)      |
| Meta score                | `f(market_cap, growth_rate)` → 0–100   |
| Tier (S/A/B/C/D)          | Derived from the meta score            |

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind + shadcn/ui · Drizzle ORM ·
Neon (Postgres) · deployed on Vercel · pnpm.

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

**Phase 1 needs no database.** The tier list renders directly from
[`seed/vehicles.json`](seed/vehicles.json); the meta score and tier are computed
in [`lib/meta.ts`](lib/meta.ts) and read by [`lib/data.ts`](lib/data.ts).

## The meta formula

All tunable constants live in [`lib/meta.ts`](lib/meta.ts):

```
meta_score = 0.5 * normSize(market_cap)   // log scale, $100B→0 … $500T→100
           + 0.5 * normGrowth(growth)     // linear, clamped ±12%
tiers: S ≥ 80 · A ≥ 65 · B ≥ 50 · C ≥ 35 · D < 35
```

Growth, score, and tier are **always derived**, never stored as columns — the
formula stays a single source of truth.

## Roadmap

- **Phase 1 (done):** static tier list from seed JSON, live on Vercel.
- **Phase 2:** real snapshot history, movement arrows vs. previous snapshot,
  `/methodology` page.
- **Phase 3:** automated weekly ingestion (CoinMarketCap API, companies/assets
  scrapers, Forbes) → `snapshots`. Fail soft: keep last good snapshot.
- **Phase 4:** dated "this week's meta" report — biggest risers/fallers, new
  S-tier, tier drops.

## Database (Phase 2+)

The Drizzle schema ([`db/schema.ts`](db/schema.ts)) and seed script
([`db/seed.ts`](db/seed.ts)) are ready. To wire Neon:

```bash
cp .env.example .env      # set DATABASE_URL
pnpm db:push              # create tables
pnpm db:seed              # load seed/vehicles.json
```
