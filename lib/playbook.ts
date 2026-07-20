/**
 * Per-deck playbooks: how to actually play the money deck.
 * Curated guides in seed/playbooks.json override a category-aware default
 * built from the deck seed fields. Nothing computed is stored on the deck.
 */
import playbooks from "@/seed/playbooks.json";
import { getIncomeDecks, type IncomeDeckView } from "@/lib/income";
import { resolveMatchups } from "@/lib/meta-report";
import { CAPITAL_LABEL, categoryMeta, timeLabel } from "@/components/income/income-meta";

export interface PlaybookStep {
  title: string;
  body: string;
}

export interface PlaybookOverride {
  headline?: string;
  whoItsFor?: string;
  firstDollar?: string;
  steps?: PlaybookStep[];
  tools?: string[];
  pitfalls?: string[];
  /** Slugs of natural ladder-up decks. */
  nextDecks?: string[];
}

export interface PlaybookView {
  deck: IncomeDeckView;
  headline: string;
  whoItsFor: string;
  firstDollar: string;
  steps: PlaybookStep[];
  tools: string[];
  pitfalls: string[];
  nextDecks: IncomeDeckView[];
  curated: boolean;
}

const overrides = playbooks as Record<string, PlaybookOverride>;

const CATEGORY_TOOLS: Record<string, string[]> = {
  profession: ["BLS OEH profile", "LinkedIn", "state license board", "resume + referrals"],
  trade: ["Trade school / apprenticeship board", "state license lookup", "van + tools budget", "Google Business Profile"],
  owner_operator: ["Entity formation", "bookkeeping (Wave/QBO)", "local SEO", "insurance broker"],
  sales: ["CRM (HubSpot free / Attio)", "LinkedIn", "call scripts", "pipeline tracker"],
  finance: ["CFA/CPA track materials", "Excel / Python", "SEC filings practice", "industry network"],
  tech: ["Laptop", "GitHub", "Cursor / Claude Code", "Stripe", "Vercel / Railway"],
  healthcare: ["Accredited program list", "state board", "clinical hours log", "malpractice insurance path"],
  internet_creator: ["Phone + mic", "Notion", "email ESP", "analytics", "payment link (Stripe/Gumroad)"],
  gig: ["Platform profile", "portfolio site", "calendar", "invoice template"],
  other: ["Notebook", "bank account", "simple budget"],
};

export function getDeckBySlug(slug: string): IncomeDeckView | undefined {
  return getIncomeDecks().find((d) => d.slug === slug);
}

export function getAllDeckSlugs(): string[] {
  return getIncomeDecks().map((d) => d.slug);
}

export function getPlaybook(slug: string): PlaybookView | null {
  const deck = getDeckBySlug(slug);
  if (!deck) return null;

  const override = overrides[slug];
  const base = buildDefault(deck);
  const nextSlugs =
    override?.nextDecks && override.nextDecks.length > 0
      ? override.nextDecks
      : base.nextSlugHints;
  const deckMap = new Map(getIncomeDecks().map((d) => [d.slug, d]));
  const nextDecks = nextSlugs
    .map((s) => deckMap.get(s))
    .filter((d): d is IncomeDeckView => Boolean(d))
    .slice(0, 4);

  return {
    deck,
    headline: override?.headline ?? base.headline,
    whoItsFor: override?.whoItsFor ?? base.whoItsFor,
    firstDollar: override?.firstDollar ?? base.firstDollar,
    steps: override?.steps?.length ? override.steps : base.steps,
    tools: override?.tools?.length ? override.tools : base.tools,
    pitfalls: override?.pitfalls?.length ? override.pitfalls : base.pitfalls,
    nextDecks,
    curated: Boolean(override),
  };
}

function buildDefault(deck: IncomeDeckView): {
  headline: string;
  whoItsFor: string;
  firstDollar: string;
  steps: PlaybookStep[];
  tools: string[];
  pitfalls: string[];
  nextSlugHints: string[];
} {
  const cat = categoryMeta(deck.category);
  const cap = CAPITAL_LABEL[deck.capitalTier];
  const time = timeLabel(deck.timeToFirstIncomeYears);

  const nextSlugHints = ladderHints(deck.slug);

  return {
    headline: `How to play ${deck.name}`,
    whoItsFor: `Someone willing to clear this gate: ${deck.barrierToEntry} Capital tier: ${cap.full}.`,
    firstDollar: `Typical time-to-first-income on this board: ${time}. That is a planning number, not a promise.`,
    steps: [
      {
        title: "1. Learn the real game",
        body: deck.whatYouDo,
      },
      {
        title: "2. Clear the barrier",
        body: `Do the minimum that makes you legal and sellable: ${deck.barrierToEntry}. Do not gold-plate this step.`,
      },
      {
        title: "3. Ship one unit of value",
        body:
          deck.category === "internet_creator" || deck.category === "tech"
            ? "Publish or productize the smallest offer someone will pay for. One client, one listing, one paid user."
            : deck.category === "trade" || deck.category === "owner_operator"
              ? "Complete training/license requirements, then land the first paid job or account. Proof beats planning."
              : "Get into the role, seat, or offer. First paycheck or first invoice is the only milestone that counts.",
      },
      {
        title: "4. Get paid once, then again",
        body: "Repeat the smallest sale until the motion is boring. Track hours, CAC, and close rate. Kill vanity work.",
      },
      {
        title: "5. Systemize or ladder up",
        body:
          nextSlugHints.length > 0
            ? "If it works, templatize delivery and price. If the ceiling is low, ladder into a related deck on this board."
            : "If it works, templatize. If not, exit early. Do not romanticize a dead deck.",
      },
    ],
    tools: CATEGORY_TOOLS[deck.category] ?? CATEGORY_TOOLS.other,
    pitfalls: [
      deck.incomeRangeNote,
      deck.dataQuality === "self_reported"
        ? "Data quality is self-reported. Exemplars are legend-rate outcomes, not the median."
        : deck.dataQuality === "partial"
          ? "Data quality is partial. Cross-check the source before you treat the median as destiny."
          : "Even with BLS medians, your market, city, and skill can land far from the middle.",
      `Class on this board: ${cat.label}. Frequency context: ${deck.frequency}`,
    ],
    nextSlugHints,
  };
}

/** Prefer matchup ladders; fall back to category cousins. */
function ladderHints(slug: string): string[] {
  const decks = getIncomeDecks();
  const matchups = resolveMatchups(decks);
  const found = new Set<string>();

  for (const m of matchups) {
    const chain = [m.opener?.slug, m.midgame?.slug, m.wincon?.slug].filter(
      Boolean,
    ) as string[];
    const idx = chain.indexOf(slug);
    if (idx >= 0) {
      for (let i = idx + 1; i < chain.length; i++) found.add(chain[i]);
    }
  }

  if (found.size > 0) return [...found].slice(0, 3);

  const deck = decks.find((d) => d.slug === slug);
  if (!deck) return [];
  return decks
    .filter((d) => d.category === deck.category && d.slug !== slug)
    .sort((a, b) => b.ceilingScore - a.ceilingScore)
    .slice(0, 3)
    .map((d) => d.slug);
}
