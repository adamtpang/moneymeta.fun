# Scripts

## `expand-internet-meta.mjs`

Adds high-signal internet decks and fills VS-style `playRate` / `livablePct` /
`metaClass` fields.

```bash
node scripts/expand-internet-meta.mjs
```

## `bls-refresh.mjs`

Scaffold for refreshing BLS-anchored medians.

```bash
# Checklist mode (no key required)
node scripts/bls-refresh.mjs

# Later, with a free BLS API key + series IDs wired in the script:
# set BLS_API_KEY=...
# node scripts/bls-refresh.mjs --apply
```

Register free at https://www.bls.gov/developers/

**Rule:** never auto-write medians without reviewing OEWS `A_MEDIAN` against
the published table. Internet decks stay self-reported with near-zero medians.
