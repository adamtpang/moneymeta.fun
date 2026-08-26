# Launch drafts: moneymeta.fun

**STATUS: DRAFTS. NOTHING HAS BEEN SENT OR POSTED.** Adam posts these himself.

Updated 2026-08-26 for scoring formula v2 and the 98-deck board. Every ranking
below was recomputed from `seed/income-decks.json` through `lib/income.ts`.

## 1. LinkedIn draft

I built a tier list for 98 ways to make money, scored like a game meta.

The first version made a basic mistake: it treated income as win rate. A path
could look S tier because the winners earned a lot, even when very few people
actually reached a livable income.

The new model separates the size of the win from the odds of winning.

That changes the answer depending on the question:

- Airline pilots share the highest Start now score at 67. The public-data
  inputs are a $232,140 median, a 99% livable-income proxy, and 4% projected
  growth.
- Forward deployed engineer has the highest ceiling score at 100, using a
  partial-data $385,000 compensation estimate and 35% growth proxy. But its 20%
  livable-income proxy discounts the Start now result to 67.
- Air traffic controllers score 66 for Start now: $148,080 median, 99%
  livable-income proxy, and a much shorter path to first income.

One ranking cannot honestly answer both "what can pay the most?" and "what is
the strongest path to start from here?" So the board has two lenses, visible
data-confidence labels, and a public source on every deck.

The board, methodology, weekly reports, and Capital Map are live:

https://moneymeta.fun/?utm_source=linkedin&utm_medium=social&utm_campaign=scoring_v2

## 2. Short draft for X or Threads

I rebuilt the scoring for a tier list of 98 ways to make money.

Income is the size of the win. It is not the win rate.

Highest ceiling: forward deployed engineer, 100.
Strongest Start now score: airline pilots, 67.
Air traffic controllers: 66.

Two lenses, confidence labels, and a public source on every deck:

https://moneymeta.fun/?utm_source=x&utm_medium=social&utm_campaign=scoring_v2

## 3. Measurement protocol

Vercel Web Analytics was enabled on 2026-08-26. The app already emits the
`checkout_click` event from the $29 founding-license link.

Record results 24 hours and 7 days after Adam posts:

| Window | Platform | Post impressions | Site visits | Checkout clicks | Stranger sales |
| --- | --- | ---: | ---: | ---: | ---: |
| 24 hours | pending | pending | pending | pending | pending |
| 7 days | pending | pending | pending | pending | pending |

Log zero as zero. Do not infer old traffic because collection only began on
2026-08-26.

## Sources and caveats

| Claim | Evidence |
| --- | --- |
| 98 decks | `seed/income-decks.json` count, verified 2026-08-26 |
| Airline pilots: Start now 67, ceiling 74, $232,140 median, 99% livable proxy, 4% growth | Current `lib/income.ts` output and the deck's [BLS source](https://www.bls.gov/ooh/transportation-and-material-moving/airline-and-commercial-pilots.htm) |
| Air traffic controllers: Start now 66, $148,080 median, 99% livable proxy | Current `lib/income.ts` output and the deck's [BLS source](https://www.bls.gov/ooh/transportation-and-material-moving/air-traffic-controllers.htm) |
| Forward deployed engineer: Start now 67, ceiling 100, $385,000 estimate, 20% livable proxy, 35% growth proxy | Current `lib/income.ts` output. The deck is visibly labeled `partial`, not BLS-verifiable, and links to its source |

Do not call the FDE compensation estimate a verified median. Do not claim
customers or subscribers. Revenue and active customers remain zero until a
stranger purchase proves otherwise.

## PPLX solopreneur thread: product implication

The conversation identifies a useful future category, but not a trustworthy
dataset yet. There is no canonical, consistently verified leaderboard for
solo operators. Existing lists mix founder interviews, self-reported revenue,
acquisition disclosures, and estimates.

The defensible product version would be a **Solo Operator Meta** with four
separate fields: annual revenue, owner earnings, duration, and verification
confidence. Pieter Levels, Eric Barone, Markus Frind, Justin Welsh, and the
other names in the conversation are research candidates, not seed truth.
Nothing from that list should enter the live score until every claim has a
dated primary source or a visible partial-data label.
