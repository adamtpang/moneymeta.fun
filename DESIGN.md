# moneymeta.fun Design System

## Reference

The shared product shell follows shadcn `dashboard-01`: compact app chrome,
clear page hierarchy, restrained metric summaries, data-first surfaces, and
muted secondary detail. moneymeta keeps its emerald identity and amber, violet,
cyan, teal, and slate tier ramp.

## Principles

- The data is the visual center of gravity. Page identity stays compact.
- Sections are flat bands or unframed layouts. Cards are reserved for repeated
  records, tools, and true framed controls.
- Controls use shadcn primitives and Lucide icons. Keyboard focus is always
  visible.
- Mobile is a first-class board view. Fixed-format controls use stable sizing,
  long names truncate, and deliberate comparison tables scroll inside their
  own container instead of widening the page.
- Color communicates tier, evidence, movement, or action. It is not decoration.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Page | `background` | `hsl(220 8% 5%)` | Neutral graphite canvas |
| Surface | `card` | `hsl(220 7% 8%)` | Data bands and tools |
| Text | `foreground` | `hsl(45 8% 92%)` | Primary copy and metrics |
| Muted text | `muted-foreground` | `hsl(220 5% 61%)` | Sources, dates, notes |
| Action | `primary` | `hsl(156 72% 45%)` | Links, focus, and commands |
| Border | `border` | `hsl(220 6% 18%)` | Section and row separation |
| Focus | `ring` | `hsl(156 72% 45%)` | Keyboard focus visibility |
| Radius | `radius` | `0.5rem` | 8px maximum surface radius |
| Display type | `font-sans` | Hanken Grotesk | Headings and prose |
| Data type | `font-mono` | JetBrains Mono | Scores, ranks, dates, labels |

There are no ambient gradients, glow orbs, blueprint grids, or colored card
shadows. Tier color remains semantic and local to the relevant row or score.

## App Chrome

- The 56px sticky header holds the brand, four primary routes, and live status.
- Mobile navigation uses icon controls with accessible labels so all routes fit
  without a page-level horizontal scroll.
- Every route owns its descriptive `h1`; the shared header never competes with
  page content.

## Money Board

- The active lens uses shadcn Tabs.
- The Pick and Meta Breaker share the first analytics row on desktop and stack
  on mobile.
- Class frequency expands to full width when no movement report exists.
- Tier rows are bordered data bands with a fixed tier rail and compact repeated
  deck cards. Long deck names cannot widen the grid.

## Solo Operator Study

- `/solopreneurs/study` compares Markus Frind, Gary Brewer, and Pieter Levels.
- Each operator has one evidence-backed operating loop: wedge, distribution,
  monetization, automation, and moat.
- Exact numbers and timeline claims link to their source. Copyable tactics,
  noncopyable advantages, and failure modes are visibly separate analysis.
- The private workbench runs entirely in client state. It does not save or add
  user-entered data to the public index.
- The comparison matrix has contained horizontal scrolling on small screens.

## shadcn Components

Installed and in active use: `Button`, `Input`, `Label`, `Progress`,
`Separator`, `Tabs`, and `Tooltip`. Existing `Card` and `Badge` primitives stay
available for framed tools and repeated records.

## Verification

- Lint: passed with no warnings or errors on 2026-08-26.
- Production build: passed with 114 static pages and the new study route.
- Interaction: operator tabs and gap analyzer submission verified in a hydrated
  browser session.
- Mobile: inspected at a 390 x 844 CSS viewport with no page-level overflow on
  the money board or S-tier study.
- Desktop: inspected at 1440 x 1000 for both routes.
- Data: all three playbook slugs resolve to ranked operators and every timeline
  or metric source reference resolves inside its evidence ledger.
