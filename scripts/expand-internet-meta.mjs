/**
 * One-shot expander: add high-signal internet decks + VS-style playRate/livablePct
 * fields across the board. Run: node scripts/expand-internet-meta.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const decksPath = path.join(root, "seed", "income-decks.json");

/** @type {any[]} */
const decks = JSON.parse(fs.readFileSync(decksPath, "utf8"));
const bySlug = new Map(decks.map((d) => [d.slug, d]));

/**
 * New internet / online decks (archetypes, not 98 micro-hustles).
 * medians stay brutal; playRate = popularity, livablePct = "win rate".
 */
const NEW = [
  {
    slug: "ghostwriting-copywriting",
    name: "Ghostwriting / copywriting",
    category: "internet_creator",
    metaClass: "service",
    whatYouDo:
      "Write for others under their name or brand: books, newsletters, LinkedIn, sales pages, ads. Pure skill trade with high rates when you niche (SaaS, finance, health).",
    median: 0,
    incomeRangeNote:
      "No public median. Strong freelancers clear 50k-150k+; most marketplace writers earn little. Self-reported.",
    frequency: "Large freelance writing pool; full-time ghostwriters are a smaller skilled slice",
    frequencyCount: 800000,
    playRate: 55,
    livablePct: 8,
    growthPct: 10,
    barrierToEntry: "Writing skill + samples; zero capital; niche proof is the gate",
    timeToFirstIncomeYears: 0.25,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "virtual-assistant",
    name: "Virtual assistant",
    category: "gig",
    metaClass: "service",
    whatYouDo:
      "Remote admin, inbox, calendar, research, light ops for founders and creators. Classic ladder into specialized ops or an agency.",
    median: 0,
    incomeRangeNote:
      "Often 15-40 USD/hr online; full-time retainers exist but median platform income is low. Self-reported.",
    frequency: "Millions of VA profiles globally; livable retainers are a thin slice",
    frequencyCount: 2000000,
    playRate: 70,
    livablePct: 6,
    growthPct: 8,
    barrierToEntry: "Organization + tools fluency; zero capital; portfolio and reliability win",
    timeToFirstIncomeYears: 0.15,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "social-media-management",
    name: "Social media management",
    category: "internet_creator",
    metaClass: "service",
    whatYouDo:
      "Plan, create, schedule, and report social content for brands. Retainer-friendly if you productize a niche.",
    median: 0,
    incomeRangeNote:
      "Agency and freelance rates vary; many underprice. No BLS series for solo SMMs. Self-reported.",
    frequency: "Very common side and full-time offer; high competition",
    frequencyCount: 1500000,
    playRate: 65,
    livablePct: 7,
    growthPct: 10,
    barrierToEntry: "Platform skill + samples; zero capital; client acquisition is the hard part",
    timeToFirstIncomeYears: 0.25,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://www.networksolutions.com/blog/online-business-ideas/",
  },
  {
    slug: "seo-freelance",
    name: "SEO specialist (freelance)",
    category: "internet_creator",
    metaClass: "service",
    whatYouDo:
      "Rank sites via technical SEO, content, and links. B2B retainers; AI search is changing tactics but demand remains.",
    median: 0,
    incomeRangeNote:
      "Specialists with proof clear strong retainers; beginners struggle. Self-reported.",
    frequency: "Crowded service niche; competent operators scarcer than profiles",
    frequencyCount: 400000,
    playRate: 48,
    livablePct: 12,
    growthPct: 12,
    barrierToEntry: "SEO skill + case studies; tools budget optional; results proof is the gate",
    timeToFirstIncomeYears: 0.4,
    capitalTier: "low",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "no-code-web-agency",
    name: "No-code / AI web builds",
    category: "tech",
    metaClass: "service",
    whatYouDo:
      "Ship client sites and light apps with Webflow, Framer, Bubble, or AI builders. Fast delivery, fixed packages.",
    median: 0,
    incomeRangeNote:
      "Project fees 1k-15k+ common in marketing; race-to-bottom on Fiverr. Self-reported.",
    frequency: "Fast-growing service offer post-AI builders",
    frequencyCount: 300000,
    playRate: 52,
    livablePct: 10,
    growthPct: 18,
    barrierToEntry: "Tool fluency + taste; zero capital; sales and revisions management matter",
    timeToFirstIncomeYears: 0.2,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "amazon-kdp-self-publishing",
    name: "Amazon KDP / self-publishing",
    category: "internet_creator",
    metaClass: "digital_product",
    whatYouDo:
      "Publish ebooks or paperbacks on Amazon KDP (fiction, nonfiction, low-content). Ads and catalog size drive outcomes.",
    median: 0,
    incomeRangeNote:
      "Power law: most titles earn near zero; a thin top slice lives on catalogs + ads. Self-reported.",
    frequency: "Millions of KDP titles; full-time authors are rare",
    frequencyCount: 5000000,
    playRate: 58,
    livablePct: 3,
    growthPct: 5,
    barrierToEntry: "Writing or outsourcing; low cash; advertising skill separates winners",
    timeToFirstIncomeYears: 0.5,
    capitalTier: "low",
    dataQuality: "self_reported",
    sourceUrl: "https://kdp.amazon.com/",
  },
  {
    slug: "tiktok-shop-social-commerce",
    name: "TikTok Shop / social commerce",
    category: "internet_creator",
    metaClass: "commerce",
    whatYouDo:
      "Sell products in-feed via TikTok Shop or similar social commerce. Content is the storefront; margins and returns matter.",
    median: 0,
    incomeRangeNote:
      "Viral outliers dominate narratives; most sellers do not clear full-time income. Self-reported / platform opaque.",
    frequency: "Large and growing seller base on social commerce platforms",
    frequencyCount: 2000000,
    playRate: 60,
    livablePct: 4,
    growthPct: 20,
    barrierToEntry: "Content skill + product source; ad/sample budget helps; algorithm risk is real",
    timeToFirstIncomeYears: 0.5,
    capitalTier: "low",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "online-reselling-arbitrage",
    name: "Online reselling / retail arbitrage",
    category: "owner_operator",
    metaClass: "commerce",
    whatYouDo:
      "Buy underpriced goods (retail, thrift, clearance, wholesale) and resell on Amazon, eBay, or Poshmark. Ops-heavy.",
    median: 0,
    incomeRangeNote:
      "Part-time side income common; full-time needs capital velocity and discipline. Self-reported.",
    frequency: "Very large long tail of resellers",
    frequencyCount: 3000000,
    playRate: 62,
    livablePct: 5,
    growthPct: 3,
    barrierToEntry: "Working capital for inventory; sourcing skill; platform account risk",
    timeToFirstIncomeYears: 0.25,
    capitalTier: "med",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "domain-flipping",
    name: "Domain flipping",
    category: "internet_creator",
    metaClass: "arbitrage",
    whatYouDo:
      "Buy brandable or aged domains and resell via marketplaces. Illiquid, knowledge-heavy, lottery-like tops.",
    median: 0,
    incomeRangeNote:
      "Most portfolios sit unsold; a few sales can make a year. Not a reliable salary path. Self-reported.",
    frequency: "Thousands of active flippers; many hobbyists",
    frequencyCount: 150000,
    playRate: 25,
    livablePct: 2,
    growthPct: 0,
    barrierToEntry: "Capital for names + market taste; patience for sales cycles",
    timeToFirstIncomeYears: 1,
    capitalTier: "med",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "online-tutoring",
    name: "Online tutoring",
    category: "gig",
    metaClass: "service",
    whatYouDo:
      "Teach subjects or test prep over Zoom (platforms or direct). Time-for-money with high hourly when credentialed.",
    median: 0,
    incomeRangeNote:
      "Platform rates often modest; private tutoring higher. Partial public data by subject. Self-reported overall.",
    frequency: "Large global tutoring marketplace",
    frequencyCount: 1000000,
    playRate: 50,
    livablePct: 15,
    growthPct: 8,
    barrierToEntry: "Subject mastery + teaching skill; zero capital; credentials help premium rates",
    timeToFirstIncomeYears: 0.15,
    capitalTier: "none",
    dataQuality: "partial",
    sourceUrl: "https://www.bls.gov/ooh/",
  },
  {
    slug: "bug-bounty-security",
    name: "Bug bounty / security research",
    category: "tech",
    metaClass: "service",
    whatYouDo:
      "Find vulnerabilities for bounty platforms (HackerOne, Bugcrowd) or contract pentests. Skill-gated, variable payouts.",
    median: 0,
    incomeRangeNote:
      "Top hunters earn a lot; most accounts earn little or nothing. Extreme power law. Self-reported.",
    frequency: "Tens of thousands of researchers; few full-time on bounties alone",
    frequencyCount: 80000,
    playRate: 18,
    livablePct: 5,
    growthPct: 15,
    barrierToEntry: "Deep security skill; zero capital; reputation and methodology matter",
    timeToFirstIncomeYears: 1,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://www.hackerone.com/",
  },
  {
    slug: "faceless-content-automation",
    name: "Faceless content channels",
    category: "internet_creator",
    metaClass: "attention",
    whatYouDo:
      "Run YouTube/TikTok channels without showing your face (narration, compilations, AI-assisted). Still needs distribution craft.",
    median: 0,
    incomeRangeNote:
      "Hyped path; CPM and copyright risks; median near zero like other attention decks. Self-reported.",
    frequency: "Crowded post-AI; many abandoned channels",
    frequencyCount: 2500000,
    playRate: 64,
    livablePct: 2,
    growthPct: 8,
    barrierToEntry: "Editing + niche selection; low capital; originality and rights issues are the trap",
    timeToFirstIncomeYears: 1.5,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "paid-surveys-microtasks",
    name: "Surveys / microtasks",
    category: "gig",
    metaClass: "gig",
    whatYouDo:
      "Complete surveys, user tests, or microtasks (mTurk-class). Pocket money, not a career. On the board for honesty.",
    median: 0,
    incomeRangeNote:
      "Typical earnings are a few dollars per hour. Not a livable path for almost anyone. Verifiable via platform economics.",
    frequency: "Tens of millions try; almost none live on it",
    frequencyCount: 20000000,
    playRate: 90,
    livablePct: 0.5,
    growthPct: -5,
    barrierToEntry: "Account + internet; zero skill gate; the win rate is the problem",
    timeToFirstIncomeYears: 0.01,
    capitalTier: "none",
    dataQuality: "partial",
    sourceUrl: "https://www.bls.gov/careeroutlook/",
  },
  {
    slug: "email-marketing-service",
    name: "Email marketing (service)",
    category: "internet_creator",
    metaClass: "service",
    whatYouDo:
      "Write and run email for brands: flows, campaigns, list growth. High ROI channel; retainer-friendly when productized.",
    median: 0,
    incomeRangeNote:
      "Specialists with ecom/SaaS case studies price well; generalists compete down. Self-reported.",
    frequency: "Growing service niche tied to ecommerce and creators",
    frequencyCount: 250000,
    playRate: 40,
    livablePct: 14,
    growthPct: 12,
    barrierToEntry: "Copy + ESP fluency; zero capital; proof of lifts is the sales weapon",
    timeToFirstIncomeYears: 0.3,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "stock-media-assets",
    name: "Stock media / asset sales",
    category: "internet_creator",
    metaClass: "digital_product",
    whatYouDo:
      "Sell photos, video clips, audio, LUTs, or 3D assets on stock marketplaces. Volume + niches.",
    median: 0,
    incomeRangeNote:
      "Long tail near zero; catalogs compound slowly. Self-reported.",
    frequency: "Millions of contributors across stock platforms",
    frequencyCount: 4000000,
    playRate: 45,
    livablePct: 2,
    growthPct: 2,
    barrierToEntry: "Gear or skill; low capital on phone photography; volume required",
    timeToFirstIncomeYears: 1,
    capitalTier: "low",
    dataQuality: "self_reported",
    sourceUrl: "https://whop.com/blog/online-business-ideas/",
  },
  {
    slug: "online-bookkeeping-remote",
    name: "Remote bookkeeping",
    category: "gig",
    metaClass: "service",
    whatYouDo:
      "Books for small businesses remotely (QBO/Xero). Close cousin to fractional CFO with lower barrier.",
    median: 45000,
    incomeRangeNote:
      "Many bookkeepers land 40-70k equivalent via clients; partial BLS adjacency to bookkeeping occupations.",
    frequency: "Large small-business demand; many solo practitioners",
    frequencyCount: 500000,
    playRate: 35,
    livablePct: 25,
    growthPct: 6,
    barrierToEntry: "Bookkeeping skill; software certs help; zero capital; recurring clients are the prize",
    timeToFirstIncomeYears: 0.4,
    capitalTier: "none",
    dataQuality: "partial",
    sourceUrl: "https://www.bls.gov/ooh/business-and-financial/bookkeeping-accounting-and-auditing-clerks.htm",
  },
  {
    slug: "web-dev-freelance",
    name: "Freelance web development",
    category: "tech",
    metaClass: "service",
    whatYouDo:
      "Build sites and web apps for clients as a solo dev or tiny studio. Distinct from productized no-code and full-time SWE.",
    median: 0,
    incomeRangeNote:
      "Rates span 30-200+ USD/hr by skill. Strong operators clear six figures; marketplaces compress juniors. Self-reported.",
    frequency: "Huge freelance dev market globally",
    frequencyCount: 3000000,
    playRate: 55,
    livablePct: 12,
    growthPct: 10,
    barrierToEntry: "Coding skill; zero capital; portfolio and sales beat credentials",
    timeToFirstIncomeYears: 0.3,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://www.networksolutions.com/blog/online-business-ideas/",
  },
  {
    slug: "influencer-brand-deals",
    name: "Influencer / brand deals",
    category: "internet_creator",
    metaClass: "attention",
    whatYouDo:
      "Monetize an audience via sponsorships and brand deals across IG/TikTok/YouTube. Reach engine with uneven payouts.",
    median: 0,
    incomeRangeNote:
      "Most creators earn little from deals; mid-tier can work; mega outliers dominate press. Self-reported surveys.",
    frequency: "Hundreds of millions identify as creators; paid influencers are a tiny fraction",
    frequencyCount: 50000000,
    playRate: 85,
    livablePct: 2,
    growthPct: 10,
    barrierToEntry: "Audience first; zero capital; authenticity and niche brand fit matter",
    timeToFirstIncomeYears: 2,
    capitalTier: "none",
    dataQuality: "self_reported",
    sourceUrl: "https://www.forbes.com/sites/meggenharris/2026/03/25/7-of-the-most-profitable-platforms-for-creators-in-2026--how-they-pay/",
  },
];

// --- defaults for existing decks by category / known slug ---
const CLASS_BY_CAT = {
  internet_creator: "attention",
  gig: "gig",
  tech: "software",
  owner_operator: "commerce",
  sales: "service",
  profession: "career",
  trade: "career",
  healthcare: "career",
  finance: "career",
};

const SLUG_CLASS = {
  "indie-micro-saas": "software",
  "chrome-extension-tools": "software",
  "app-development": "software",
  "service-as-software": "software",
  "ai-automation-agency": "service",
  "productized-service": "service",
  freelancing: "service",
  "marketing-agency": "service",
  "lead-generation-sites": "arbitrage",
  "affiliate-seo-content-sites": "arbitrage",
  "digital-products-templates": "digital_product",
  "online-courses-cohorts": "digital_product",
  "email-list-funnel": "owned",
  "newsletter-substack": "owned",
  "community-membership": "owned",
  "high-ticket-consulting": "service",
  "amazon-fba-e-commerce-store": "commerce",
  dropshipping: "commerce",
  "print-on-demand": "commerce",
  "youtube-channel": "attention",
  "short-form-content-funnel": "attention",
  "ugc-clipping": "service",
  podcasting: "attention",
  "twitch-live-streaming": "attention",
  "b2b-saas-sales": "career",
  "software-developers": "career",
  "big-tech-swe-equity": "career",
};

/** Heuristic play/livable for decks that do not have explicit values yet. */
function defaultsFor(d) {
  const metaClass = SLUG_CLASS[d.slug] || CLASS_BY_CAT[d.category] || "other";
  let playRate = 30;
  let livablePct = 10;

  if (d.dataQuality === "verifiable" && d.median >= 80000) {
    playRate = 20;
    livablePct = 55;
  } else if (d.dataQuality === "verifiable" && d.median >= 50000) {
    playRate = 28;
    livablePct = 45;
  } else if (d.category === "trade") {
    playRate = 25;
    livablePct = 40;
  } else if (d.category === "owner_operator") {
    playRate = 22;
    livablePct = d.capitalTier === "high" ? 15 : 12;
  } else if (d.category === "internet_creator") {
    playRate = 60;
    livablePct = d.median > 0 ? 8 : 3;
  } else if (d.category === "gig") {
    playRate = 70;
    livablePct = 5;
  } else if (d.category === "tech") {
    playRate = d.median > 100000 ? 25 : 40;
    livablePct = d.median > 100000 ? 50 : 8;
  }

  // known overrides for existing internet decks
  const KNOWN = {
    "youtube-channel": { playRate: 75, livablePct: 2, metaClass: "attention" },
    "short-form-content-funnel": { playRate: 80, livablePct: 1.5, metaClass: "attention" },
    "twitch-live-streaming": { playRate: 55, livablePct: 1, metaClass: "attention" },
    podcasting: { playRate: 50, livablePct: 2, metaClass: "attention" },
    "newsletter-substack": { playRate: 40, livablePct: 5, metaClass: "owned" },
    "indie-micro-saas": { playRate: 45, livablePct: 5, metaClass: "software" },
    freelancing: { playRate: 72, livablePct: 10, metaClass: "service" },
    dropshipping: { playRate: 68, livablePct: 2, metaClass: "commerce" },
    "print-on-demand": { playRate: 55, livablePct: 2, metaClass: "commerce" },
    "amazon-fba-e-commerce-store": { playRate: 50, livablePct: 8, metaClass: "commerce" },
    "online-courses-cohorts": { playRate: 48, livablePct: 4, metaClass: "digital_product" },
    "affiliate-seo-content-sites": { playRate: 55, livablePct: 4, metaClass: "arbitrage" },
    "service-as-software": { playRate: 35, livablePct: 8, metaClass: "software" },
    "productized-service": { playRate: 30, livablePct: 12, metaClass: "service" },
    "ai-automation-agency": { playRate: 42, livablePct: 7, metaClass: "service" },
    "ugc-clipping": { playRate: 58, livablePct: 6, metaClass: "service" },
    "paid-surveys-microtasks": { playRate: 90, livablePct: 0.5, metaClass: "gig" },
    "software-developers": { playRate: 30, livablePct: 60, metaClass: "career" },
    "big-tech-swe-equity": { playRate: 12, livablePct: 35, metaClass: "career" },
    "b2b-saas-sales": { playRate: 28, livablePct: 40, metaClass: "career" },
  };

  if (KNOWN[d.slug]) {
    return { metaClass: KNOWN[d.slug].metaClass, playRate: KNOWN[d.slug].playRate, livablePct: KNOWN[d.slug].livablePct };
  }
  return { metaClass, playRate, livablePct };
}

let added = 0;
for (const n of NEW) {
  if (bySlug.has(n.slug)) continue;
  decks.push(n);
  bySlug.set(n.slug, n);
  added++;
}

for (const d of decks) {
  const def = defaultsFor(d);
  if (d.metaClass == null) d.metaClass = def.metaClass;
  if (d.playRate == null) d.playRate = def.playRate;
  if (d.livablePct == null) d.livablePct = def.livablePct;
}

fs.writeFileSync(decksPath, JSON.stringify(decks, null, 2) + "\n");
console.log(JSON.stringify({ total: decks.length, added, sample: decks.slice(-3).map((d) => d.slug) }));
