# Scripts

## The Monday ritual (15 minutes, in this exact order)

```bash
# 1. Refresh medians from BLS (review the git diff after)
node scripts/bls-refresh.mjs --apply

# 2. Build this week's issue (movement vs the committed baseline)
node scripts/build-report.mjs

# 3. Open seed/reports/<today>.json, read the auto-drafted "curation",
#    edit it into your own voice (or leave it, it is honest as generated)

# 4. Commit + deploy (deploys are Adam's)
git add seed && git commit -m "Weekly meta report" && vercel deploy --prod

# 5. ONLY AFTER the deploy: baseline next week's movement
node scripts/snapshot-scores.mjs
```

Order matters: build-report reads movement against the OLD baseline, so
snapshot-scores must run last. The $9/mo subscriber price is gated on three
consecutive shipped issues (see EVIDENCE.md); do not mint it early.

## `build-report.mjs`

Writes `seed/reports/<date>.json`: picks under both lenses, risers, fallers,
new decks, and ~300 words of auto-drafted curation to edit before shipping.
Rendered at `/report` (latest + archive) and `/report/[week]`. Refuses to
overwrite an existing same-day issue without `--force`.

## `expand-internet-meta.mjs`

Adds high-signal internet decks and fills VS-style `playRate` / `livablePct` /
`metaClass` fields.

```bash
node scripts/expand-internet-meta.mjs
```

## `bls-refresh.mjs`

Fetches national OEWS **annual median wages** (datatype `13`) for mapped SOC
codes via the BLS Public API and optionally writes them into
`seed/income-decks.json`.

Series ID pattern:

```text
OEUN0000000000000{SOC6}13
```

```bash
# Dry-run: print old → new medians
node scripts/bls-refresh.mjs

# Write medians into seed (review git diff after)
node scripts/bls-refresh.mjs --apply

# Optional higher limits:
# set BLS_API_KEY=...
```

Register free at https://data.bls.gov/registrationEngine/

**Rule:** review the git diff after `--apply`. Internet decks stay self-reported
with near-zero medians and are not in the SOC map.

## `snapshot-scores.mjs`

Locks current start-now / ceiling scores into `seed/score-history.json` so the
next report can show movement arrows (risers / fallers).

```bash
# After a BLS refresh or seed retune you are happy with:
node scripts/snapshot-scores.mjs
```

Workflow for a weekly meta:

1. `node scripts/bls-refresh.mjs --apply` (optional)
2. Review and commit median changes
3. Ship the report (movement uses the *previous* snapshot)
4. `node scripts/snapshot-scores.mjs` to baseline the next week
