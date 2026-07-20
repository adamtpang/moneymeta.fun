# Scripts

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
