# moneymeta.fun brand.md

Structure inherited from Aether/brand.md; this project's accent is emerald
(`hsl(152 76% 46%)`), chosen because it's the shared money-OS green with
deathmoney.fyi — money reads the same green on both sides of the OS, this
project's own dark blue-black canvas is its half of "similar but different."

## Why emerald

`repos.yaml` on both sides declares deathmoney.fyi and moneymeta.fun kin:
they share `lib/rank.ts` as canon and are described as one money OS split in
two ("moneymeta is the income side... deathmoney is the expense/debt side...
together they're the command center"). Aether/brand.md's sentiment-color
rule says money-positive green should read the same everywhere Adam looks
at money, not be re-invented per app.

moneymeta.fun got there first and on its own: `hsl(152 76% 46%)` has been
`--primary` since this app's build, already carrying the "positive signal"
meaning inside its own tier system — on 2026-08-08 the S-D tier ramp's `C`
grade was deliberately moved off emerald specifically to keep emerald free
as the primary/positive-signal color, not a rank color. That was moneymeta
choosing "emerald means money/good here" before the two-app decision existed
formally.

On 2026-08-11, deathmoney.fyi (which had been using Tailwind's stock
`green-400`, a different, more lime/mint green family, by inertia rather
than choice) converged onto this same emerald family so the two apps read
as one system. **No code changed on moneymeta.fun's side** — this file only
formalizes a decision moneymeta had already made correctly. See
`deathmoney.fyi/brand.md` for the matching record and the full rationale.

## Current tokens (as shipped, `app/globals.css`)

HSL triples, shadcn-style custom properties:

- `--background: 200 32% 4%` — a dark, cool blue-black canvas. Distinct on
  purpose from deathmoney.fyi's true neutral black (`#0a0a0a`): moneymeta's
  mood is a data-terminal/financial-instrument feel (per its own CLAUDE.md,
  "VS meta report x Hearthstone tier list... dark, dense, data-forward"),
  deathmoney's is literal death-black. Aether/brand.md's "what should NOT be
  shared" explicitly leaves canvas mood to each product.
- `--primary: 152 76% 46%` — the shared money-OS emerald.
- `--card: 200 24% 7%`, `--secondary`/`--muted`/`--accent`: `200 16% 13%` /
  `200 16% 13%` / `200 18% 16%` — all keyed to the same cool hue-200 base as
  the canvas, not neutral gray, which is what gives the "financial terminal"
  read its consistency.
- `--border`/`--input`: `200 16% 14%`, `--ring`: `152 76% 46%` (ring matches
  primary, standard focus-state convention).

## What's deliberately NOT shared with deathmoney.fyi

- The canvas hue (cool blue-black here vs true black there).
- The S–D tier-rank heat ramp (amber/violet/cyan/teal/slate) — this is
  moneymeta's own domain-specific semantic system for ranking income decks,
  unrelated to the shared money/positive sentiment color. Emerald is
  deliberately excluded from that ramp (see above) so it stays legible as
  "positive signal," not overloaded as a rank tier too.
- Typography: moneymeta uses a named micro-type scale (`text-micro`/
  `text-label`) for chips and category tags, its own choice for a
  dense data-forward surface; not claimed here as a portfolio-wide pattern.

## Next step

None outstanding. If deathmoney.fyi's structural token layering (primitives
-> semantic surfaces -> sentiment, per Aether/brand.md) is ever wanted here
too, moneymeta.fun currently uses the shadcn/Tailwind default shape instead
(`--background`/`--primary`/etc. directly, no separate primitive ramp) —
that would be a real restructure, not a color change, and isn't needed
today.
