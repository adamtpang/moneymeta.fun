# moneymeta.fun — Claude Code Project Brief

> Status: **Phase 1 is built.** Static tier list renders from `seed/vehicles.json`
> (no DB needed) via `lib/meta.ts` + `lib/data.ts`. Drizzle schema + Neon seed
> script exist for Phase 2. Next up: deploy to Vercel, then Phase 2 (movement
> arrows + snapshot history).

---

## What we're building

**moneymeta.fun is Vicious Syndicate for capitalism.** A data-driven tier list
of wealth vehicles ("income decks"), ranked by a **meta score** computed from
public, verifiable market-cap data. The user checks it like a Hearthstone meta
report: what's strong right now, what's rising, what's falling, what should I be
allocating into.

This is a **personal daily allocation instrument**, not financial advice and not
a social/self-report app. Every number on the page traces back to a public source.

### The one idea that makes this work

Vicious Syndicate's meta score ≈ **popularity × win rate**. We map that directly
onto capital:

| Hearthstone (VS)                 | moneymeta.fun                                |
| -------------------------------- | -------------------------------------------- |
| How much a deck is played        | **Market cap** of the vehicle                |
| How often it wins (win rate)     | **Growth rate** (recent % change)            |
| Meta score                       | `meta_score = f(market_cap, growth_rate)`    |
| Tier (S/A/B/C/D)                 | Derived from meta score                      |
| Week-over-week meta shift        | Snapshot diff → movement arrows (↑ ↓ →)      |
| Deck archetype                   | Wealth vehicle (equities, real estate, etc.) |

This works *because the inputs are public and verifiable* — unlike self-reported
income, which is gameable and anti-inductive. Do not add self-reported data.

---

## Tech stack (non-negotiable)

- **Next.js 14**, App Router, **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Neon** (serverless Postgres) + **Drizzle ORM**
- Deploy to **Vercel**
- `pnpm`

---

## Data model

Two tables (`db/schema.ts`). Keep it this simple until it hurts.

- **vehicles** — the "decks": `id, slug, name, category, description, source_url, created_at`
- **snapshots** — time series: `id, vehicle_id, market_cap, captured_at`

Growth = `(latest_cap - prior_cap) / prior_cap`. Meta score and tier are computed
in a pure function from `market_cap` + `growth_rate` (`lib/meta.ts`) — never
stored as raw columns.

### Meta formula (tunable — `lib/meta.ts`)

```
meta_score = 0.5 * normSize(market_cap)   // log scale, $100B→0 … $500T→100
           + 0.5 * normGrowth(growth)     // linear, clamped ±12%
tiers: S ≥ 80 · A ≥ 65 · B ≥ 50 · C ≥ 35 · D < 35
```

Weights and thresholds are exported constants — trivial to retune.

---

## Phases — ship Phase 1 before touching Phase 3

### Phase 1 — Static tier list, live on Vercel ✅ built

- Next.js + Tailwind + shadcn + Drizzle + Neon scaffold.
- Seed from committed `seed/vehicles.json` (18 vehicles across asset_class /
  crypto / company / person). **No scrapers.**
- Meta score + tier in `lib/meta.ts`.
- Tier-list page: S→D rows, card tiles (name, humanized cap, growth %, score badge).
- Deploy to Vercel. **Shippable v1.**

### Phase 2 — Movement + snapshots

- Real snapshot history (already two dated snapshots per vehicle in seed).
- Movement arrows (↑/↓/→) and tier-change indicators vs. previous snapshot.
- `/methodology` page in plain language.

### Phase 3 — Automated ingestion (isolate it)

- One ingestion module per source → `snapshots`, on a Vercel cron (weekly).
  - **CoinMarketCap** API (free tier) for crypto.
  - **companiesmarketcap.com**, **8marketcap/assetmarketcap**, **countriesmarketcap.com** — scrape, cache, fail soft.
  - **Forbes real-time billionaires** for the person category.
- Every row keeps `source_url`. Source down → show "stale", don't disappear.

### Phase 4 — Daily/weekly meta report view

- Dated "this week's meta": biggest risers/fallers, new S-tier, tier drops.

---

## Aesthetic

VS meta report × Hearthstone tier list. Dark, dense, data-forward. Tier rows
with S→D color coding (amber/violet/sky/emerald/slate heat ramp). Vehicles as
compact card tiles. Meta score as a prominent badge. Movement in green/red.
Mobile-first — it has to read well on a phone.

---

## Guardrails — do NOT do these

- **No scrapers in Phase 1.** Seeded JSON only. Ship first.
- **No self-reported or user-submitted data, ever.** Verifiable public sources only.
- **No auth, accounts, or payments** until there's a live tier list someone would use.
- **No new data sources** beyond the listed ones without a clear reason.
- **Don't store computed values** (growth, meta score, tier) as raw columns — derive them.
