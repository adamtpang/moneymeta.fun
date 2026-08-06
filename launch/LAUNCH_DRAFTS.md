# Launch drafts: moneymeta.fun

**STATUS: DRAFTS. NOTHING HAS BEEN SENT OR POSTED.** Adam posts these himself.

Drafted 2026-08-06, sourced from the live board and the 2026-08-06 report
issue. Every number below is computed live in `seed/income-decks.json` via the
formula in `lib/income.ts`, reproduced independently in this file's sources
section. Do not edit a number without recomputing it.

---

## 1. LinkedIn / X post

> Angle: the counterintuitive finding, S-tier chart as the visual. The hook
> has to survive the "see more" cut, so it leads with the surprise, not the
> methodology.

---

I built a tier list for every way to make money, scored the way Hearthstone
players score a deck: income times growth divided by how hard it is to start.
90 paths, all anchored to public data.

The number two spot, right behind Big Tech engineer with equity, on both start
now and highest ceiling:

Chick-fil-A franchise operator. Median take home around $240,000. Ahead of
physicians, financial managers, data scientists, AI engineers.

Here is the catch, and it is the whole point of the board: acceptance rate is
about 0.25 percent. Roughly 60,000 people apply a year, 100 to 150 get chosen.
That is a lower acceptance rate than Harvard. The score says S tier. The play
rate says almost nobody gets to play this deck.

That is exactly why the board shows both numbers. A high score with a brutal
win rate is a real category, not a contradiction, the same way a powerful but
rarely-drafted card reads in an actual meta report.

Second finding, quieter but sharper: a dentist who owns their practice
outranks a physician on lifetime ceiling. Not because dentistry pays more
(physicians still win on raw median), but because a physician's path takes 15
years to first income against a practice owner's 4. Time eats ceiling.

Board, method, and the weekly report: moneymeta.fun

[Attach: screenshot of the S-tier rows from the live board, or link directly
so the auto-generated tier-chart preview image renders]

---

## 2. Shorter version (X / Threads character limits)

---

Tier list for every way to make money, scored like a game meta: income x
growth / barrier to start.

#2 spot on the whole board, ahead of physicians, data scientists, and AI
engineers: Chick-fil-A franchise operator, ~$240k median.

Catch: about 0.25% acceptance rate, lower than Harvard's. High score, brutal
win rate. That tension is the whole point of showing both numbers.

moneymeta.fun

---

## Sources

Recomputed independently for this draft. If a number here does not match a
fresh run of `lib/income.ts` against current `seed/income-decks.json`, trust
the live computation and fix this file.

| Claim | Source |
| --- | --- |
| Chick-fil-A operator: ceiling score 73, start-now score 72, both #2 on the board behind Big-Tech SWE (77/77) | Computed 2026-08-06 from `seed/income-decks.json` via the formula in `lib/income.ts` |
| Chick-fil-A operator median ~$240k | `seed/income-decks.json`, sourced to [FDD Item 19 analysis, franchisechatter.com, 2024](https://www.franchisechatter.com/2024/09/19/fdd-talk-chick-fil-a-franchise-costs-fees-average-revenues-and-or-profits-2024-review/). Deck's own `dataQuality` field is "partial": Item 19 discloses revenue, not profit, so income is a third-party estimate. State this caveat if asked, do not drop it. |
| Chick-fil-A operator livablePct 12 (proxy for the acceptance-rate framing); ~60,000 applicants a year, 100 to 150 selected, ~0.25% acceptance rate, lower than Harvard's 3.4% | `seed/income-decks.json` frequency field ("acceptance rate well under 1%") plus [QSR Pro, Chick-fil-A operator selection process](https://qsr.pro/articles/chick-fil-a-operator-selection-process), verified 2026-08-06. This figure is NOT in the repo's seed data; it is sourced fresh for this post only. |
| Dental Practice Owner ceiling score 77 ($258,260 median, 4yr time to first income) vs Physicians & Surgeons ceiling score 75 ($239,200 median, 15yr time to first income) | Computed 2026-08-06 from `seed/income-decks.json` |
| Big-Tech SWE (equity comp) is #1 on both lenses at score 77 | Computed 2026-08-06 from `seed/income-decks.json` |

## Claims deliberately NOT made

- No claim that moneymeta.fun has paying customers or subscribers. As of
  2026-08-06: $0 revenue, 0 customers, verified against Stripe.
- No claim that the $240k Chick-fil-A figure is confirmed profit. It is a
  disclosed-revenue-based third-party estimate, and the post should not
  imply otherwise if a reader pushes back in replies.
- No specific "X slots per year" Chick-fil-A franchise figure unless verified
  fresh; it is not in this repo's sourced seed data.

## After posting

Log in EVIDENCE.md: date posted, platform, impressions, replies, and any
traffic delta visible once Vercel Web Analytics is actually enabled (it is
not, as of 2026-08-06; see EVIDENCE.md). A zero is a real result and gets
logged as one.
