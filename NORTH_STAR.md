# North star: the platonic ideal version of moneymeta.fun

One sentence (updated 2026-08-10, personalization framing): a tool for you, specifically, to maximize your income, not a generic tier list to browse, but the single best real deck for your capital, time, and skills, backed by public data, not vibes.

Prior framing, still true of the current build, kept for traceability: "the Hearthstone meta report for making money, every real income path scored and tiered S to D from public, verifiable data, so anyone can see the strongest deck to play right now."

## The offer
- Who it's for: anyone deciding how to make money next: career changers, side-hustlers, people comparing a trade vs a profession vs an internet path.
- What they get: a data-driven S-D tier list of 98 income paths (BLS-anchored), a two-lens toggle (start now vs highest ceiling), The Pick, Meta Breaker, a matchup chart, and per-deck playbooks. The board itself is free to browse; a $29 one-time founding license is the paid tier for early supporters.
- What it costs: free to browse the full board. $29 one-time for the founding license.

## Gap between the new one-sentence and the real build (2026-08-10)

The "for you" framing is a real product claim the current build does not back up yet.
Today the board takes zero input and shows the identical 98-deck ranking to every
visitor, that is a reference, not personalization. Making the one-sentence true
requires an actual mechanism (capital/time/skills input, re-scored or re-sorted
output). This is a real gap, not solved by rewording alone, and not something to
silently claim as done. Log it here rather than let the doc overstate the product.

## What this is NOT (scope guard)
- Not financial or career advice: a decision instrument, not a guarantee.
- Not self-reported or crowd-sourced data as truth: occupations are BLS-anchored; anything softer (internet paths) carries a visible data-confidence badge.
- Not a return to the old Capital or Career boards: the 2026-07-20 refocus to one board (the money meta) was deliberate; don't re-add them without a clear decision.

## Progress ladder (fact-based, not vibes)
- [x] 0. Core loop works: the actual product function runs end to end for a real user
- [x] 1. Discoverable: sitemap, robots, meta description
- [x] 2. Tracked: analytics wired in code AND confirmed live
- [x] 3. Instrumented: named funnel events beyond raw pageviews
- [x] 4. Payable: real automated checkout, not mailto or invoice-only
- [ ] 5. Converted: at least one verified stranger sale

**Progress: 5/6 (83%)**

Notes: stage 0 confirmed by reading `app/page.tsx`: the board renders directly from committed seed JSON, no backend dependency, works for any visitor with zero input. Stage 3 landed this session: `checkout_click` (Vercel `track()`) now fires on the founding-license CTA via `components/founding-license-link.tsx` (commit adcb8df/365dbf4, deployed). Stage 4 is a real live Stripe price (`price_1TsG2uFL7C10dNyGCA847rpF`, $29 one-time, verified active). Stage 5 confirmed NO via a live Stripe query: zero customers ever on this price.

## Next milestone
Drive real traffic to the board (the highest-leverage lever left, since every mechanical stage through checkout is done) and get the first stranger to click through to the $29 founding license.

**Sequencing decision, 2026-08-10: REACH first, personalization later.** The "for you"
one-sentence above is the platonic ideal, not the current build order. Do not start
building the capital/time/skills input mechanism until a real stranger has actually
seen the board at least once. Building personalization on a board nobody has visited
yet is spread, not progress, per this workspace's own standing concentration rule.
