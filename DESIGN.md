# moneymeta.fun Design Notes

## Reference

The Solo Operator Index follows shadcn `dashboard-01`: a dense ranked data table,
compact metric summaries, evidence badges, and muted secondary detail. It keeps
the existing moneymeta dark game-meta language instead of introducing a separate
visual brand.

## Tokens

| Role | Token | Current value | Use |
| --- | --- | --- | --- |
| Page | `background` | `hsl(200 32% 4%)` | App background |
| Surface | `card` | `hsl(200 24% 7%)` | Index rows and stat band |
| Text | `foreground` | `hsl(200 14% 92%)` | Names, ranks, primary metrics |
| Muted text | `muted-foreground` | `hsl(200 11% 57%)` | Sources, dates, notes |
| Action | `primary` | `hsl(152 76% 46%)` | Links and key labels |
| Border | `border` | `hsl(200 16% 14%)` | Row and section separation |
| Focus | `ring` | `hsl(152 76% 46%)` | Keyboard focus visibility |
| Radius | `radius` | `0.7rem` | Existing compact surface radius |
| Display type | `font-sans` | Hanken Grotesk | Headings and readable detail |
| Data type | `font-mono` | JetBrains Mono | Scores, ranks, metrics, labels |

Tier color remains the existing amber, violet, cyan, teal, and slate ramp. The
evidence system uses emerald for corroborated, amber for founder disclosed, and
slate for reported estimates.

## Solo Operator Index

- A single bordered list is the primary surface. Rows are not nested in cards.
- Desktop shows seven scan columns. Mobile reflows each row into stable rank,
  operator, score, metric, and badge regions.
- The formula bar is a direct visual encoding of the 60/20/10/10 score weights.
- External source links are icon controls with visible focus states and titles.
- Revenue, exits, cumulative sales, and copies sold stay on separate boards so
  incomparable units never create a false ranking.

## Verification

- Lint: passed with no warnings or errors on 2026-08-26
- Production build: passed, `/solopreneurs` prerenders as static content
- Desktop layout: inspected at 1440 x 1000 and 1440 x 2400
- Mobile layout: inspected at the compact breakpoint at 500 x 915
- Source-link and route checks: 13 HTTPS sources, no duplicate slugs, local route returned 200
