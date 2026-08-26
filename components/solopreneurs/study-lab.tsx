"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Info,
  RotateCcw,
  SearchCheck,
  ShieldX,
  Target,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TIER_STYLES } from "@/components/tier-styles";
import type { SoloPlaybook } from "@/lib/solo-playbooks";
import type { RankedSolopreneur } from "@/lib/solopreneurs";
import { cn } from "@/lib/utils";

type BusinessShape = "service" | "data" | "network" | "portfolio";
type Acquisition = "none" | "manual" | "borrowed" | "owned";

interface Profile {
  shape: BusinessShape;
  monthlyRevenue: string;
  years: string;
  products: string;
  detachedRevenuePct: string;
  automationPct: string;
  supportHours: string;
  acquisition: Acquisition;
}

interface GapResult {
  overall: number;
  closestSlug: SoloPlaybook["slug"];
  dimensions: Array<{ label: string; score: number; detail: string }>;
  gaps: Array<{ label: string; action: string; model: string; severity: number }>;
}

const INITIAL_PROFILE: Profile = {
  shape: "service",
  monthlyRevenue: "",
  years: "",
  products: "",
  detachedRevenuePct: "",
  automationPct: "",
  supportHours: "",
  acquisition: "none",
};

const SHAPES: Array<{ value: BusinessShape; label: string; detail: string }> = [
  { value: "service", label: "Service", detail: "You sell your work or a packaged outcome" },
  { value: "data", label: "Tool / data", detail: "You sell software, research, or workflow data" },
  { value: "network", label: "Network", detail: "Users, listings, or transactions create the inventory" },
  { value: "portfolio", label: "Portfolio", detail: "Several products share an audience or operating stack" },
];

const ACQUISITION: Array<{ value: Acquisition; label: string; score: number }> = [
  { value: "none", label: "None yet", score: 5 },
  { value: "manual", label: "Outbound", score: 30 },
  { value: "borrowed", label: "Platforms", score: 55 },
  { value: "owned", label: "Owned loop", score: 90 },
];

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

function numeric(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function revenueScore(monthlyRevenue: number): number {
  if (monthlyRevenue <= 0) return 0;
  return clamp((Math.log10(monthlyRevenue + 1) / Math.log10(250_001)) * 100);
}

function analyzeProfile(profile: Profile): GapResult {
  const monthlyRevenue = numeric(profile.monthlyRevenue);
  const years = numeric(profile.years);
  const products = numeric(profile.products);
  const detachedRevenuePct = clamp(numeric(profile.detachedRevenuePct));
  const automationPct = clamp(numeric(profile.automationPct));
  const supportHours = numeric(profile.supportHours);
  const acquisitionScore = ACQUISITION.find((item) => item.value === profile.acquisition)?.score ?? 0;

  const revenue = revenueScore(monthlyRevenue);
  const distribution = acquisitionScore;
  const ownership = detachedRevenuePct;
  const operations = clamp(automationPct - Math.min(supportHours * 1.5, 35));
  const compounding = clamp((Math.min(years, 10) / 10) * 75 + (Math.min(products, 3) / 3) * 25);

  const dimensions = [
    { label: "Paid proof", score: revenue, detail: `$${monthlyRevenue.toLocaleString("en-US")} monthly revenue` },
    { label: "Distribution", score: distribution, detail: ACQUISITION.find((item) => item.value === profile.acquisition)?.label ?? "None" },
    { label: "Revenue ownership", score: ownership, detail: `${Math.round(detachedRevenuePct)}% not tied to your hours` },
    { label: "Operational leverage", score: operations, detail: `${Math.round(automationPct)}% automated, ${supportHours} support hrs/wk` },
    { label: "Compounding", score: compounding, detail: `${years} years, ${products} active product${products === 1 ? "" : "s"}` },
  ];

  const gaps = [
    {
      label: "Paid proof",
      severity: 100 - revenue,
      model: "Pieter Levels",
      action:
        monthlyRevenue < 1_000
          ? "Put a buy button on one narrow paid result and get five real purchases before expanding the product."
          : "Raise the value of the winning offer before adding another product. Track conversion and retention by cohort.",
    },
    {
      label: "Owned distribution",
      severity: 100 - distribution,
      model: profile.shape === "network" ? "Markus Frind" : "Pieter Levels",
      action:
        profile.shape === "network"
          ? "Create one user-generated inventory loop where every successful contribution makes the next visit more useful."
          : "Turn every launch or platform impression into an owned email, search, referral, or product-to-product return path.",
    },
    {
      label: "Revenue detached from hours",
      severity: 100 - ownership,
      model: profile.shape === "service" ? "Gary Brewer" : "Markus Frind",
      action:
        profile.shape === "service"
          ? "Extract the repeated diagnosis, data, or deliverable from the service and sell it as a self-serve utility or subscription."
          : "Move the payer to the side receiving measurable business value and preserve low friction for the growth side.",
    },
    {
      label: "Operational leverage",
      severity: 100 - operations,
      model: supportHours > 8 ? "Gary Brewer" : "Pieter Levels",
      action:
        supportHours > 8
          ? "Tag every support request for two weeks, then eliminate the highest-frequency category with onboarding, defaults, or searchable answers."
          : "Automate the next recurring task only after writing its trigger, expected output, and failure alert in plain language.",
    },
    {
      label: "Focused compounding",
      severity: 100 - compounding,
      model: products > 1 && monthlyRevenue < 10_000 ? "Gary Brewer" : "Pieter Levels",
      action:
        products > 1 && monthlyRevenue < 10_000
          ? "Pause the weakest products and concentrate distribution on the one with the clearest paid pull."
          : "Keep a dated operating log so distribution, data, and automation accumulate instead of resetting with each launch.",
    },
  ]
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);

  const closestSlug: GapResult["closestSlug"] =
    profile.shape === "network"
      ? "markus-frind"
      : profile.shape === "portfolio"
        ? "pieter-levels"
        : "gary-brewer";

  return {
    overall: Math.round(dimensions.reduce((sum, item) => sum + item.score, 0) / dimensions.length),
    closestSlug,
    dimensions: dimensions.map((item) => ({ ...item, score: Math.round(item.score) })),
    gaps,
  };
}

function sourceFor(playbook: SoloPlaybook, sourceId: string) {
  return playbook.sources.find((source) => source.id === sourceId);
}

export function SoloStudyLab({
  playbooks,
  operators,
}: {
  playbooks: SoloPlaybook[];
  operators: RankedSolopreneur[];
}) {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [result, setResult] = useState<GapResult | null>(null);

  const setField = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tabs defaultValue={playbooks[0]?.slug} className="w-full">
        <div className="scrollbar-none mb-4 overflow-x-auto pb-1">
          <TabsList className="h-10 w-max border bg-card p-1">
            {playbooks.map((playbook) => {
              const operator = operators.find((item) => item.slug === playbook.slug);
              return (
                <TabsTrigger key={playbook.slug} value={playbook.slug} className="h-8 gap-2 px-3 text-xs">
                  {operator?.name}
                  <span className="font-mono text-micro text-muted-foreground">{operator?.score}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {playbooks.map((playbook) => {
          const operator = operators.find((item) => item.slug === playbook.slug);
          if (!operator) return null;
          const tierStyle = TIER_STYLES[operator.tier];

          return (
            <TabsContent key={playbook.slug} value={playbook.slug} className="mt-0 space-y-5">
              <section className={cn("border-l-2 bg-card/45 px-4 py-5 sm:px-5", tierStyle.border)}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-4xl">
                    <p className={cn("font-mono text-xs font-bold", tierStyle.text)}>{playbook.archetype}</p>
                    <h2 className="mt-1 text-xl font-black sm:text-2xl">{operator.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-foreground/85">{playbook.thesis}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{playbook.summary}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                    <span className={cn("inline-flex min-w-14 justify-center rounded-md px-3 py-2 font-mono text-xl font-black ring-1", tierStyle.score)}>
                      {operator.score}
                    </span>
                    <div className="text-right font-mono text-micro text-muted-foreground">
                      #{operator.rank} index<br />{operator.metricLabel}
                    </div>
                  </div>
                </div>
              </section>

              <section aria-labelledby={`${playbook.slug}-loop`}>
                <div className="mb-3 flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-primary" aria-hidden />
                  <h3 id={`${playbook.slug}-loop`} className="text-sm font-bold">The operating loop</h3>
                </div>
                <ol className="grid overflow-hidden rounded-lg border bg-card/35 sm:grid-cols-5">
                  {playbook.loop.map((step, index) => (
                    <li key={step.label} className="relative border-b p-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-micro font-bold text-primary">0{index + 1}</span>
                        {index < playbook.loop.length - 1 ? <ArrowRight className="hidden h-3.5 w-3.5 text-muted-foreground/50 sm:block" aria-hidden /> : null}
                      </div>
                      <p className="mt-2 text-xs font-bold text-foreground">{step.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.value}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby={`${playbook.slug}-numbers`}>
                <div className="mb-3 flex items-center gap-2">
                  <SearchCheck className="h-4 w-4 text-primary" aria-hidden />
                  <h3 id={`${playbook.slug}-numbers`} className="text-sm font-bold">Numbers that matter</h3>
                </div>
                <div className="grid overflow-hidden rounded-lg border bg-card/35 sm:grid-cols-2 lg:grid-cols-4">
                  {playbook.numbers.map((number, index) => {
                    const source = sourceFor(playbook, number.sourceId);
                    return (
                      <div key={`${number.value}-${number.label}`} className={cn("p-3.5", index < playbook.numbers.length - 1 && "border-b sm:border-b-0 sm:border-r")}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-mono text-lg font-black tabular-nums">{number.value}</p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Evidence: ${number.confidence}`}>
                                <Info className="h-3.5 w-3.5" aria-hidden />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>{number.confidence}</TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="mt-1 text-xs font-semibold">{number.label}</p>
                        <p className="mt-1 text-micro leading-relaxed text-muted-foreground">{number.context}</p>
                        {source ? (
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-micro font-semibold text-primary hover:text-primary/80">
                            Source <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>

              <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
                <section aria-labelledby={`${playbook.slug}-timeline`}>
                  <h3 id={`${playbook.slug}-timeline`} className="mb-3 text-sm font-bold">What happened, in order</h3>
                  <ol className="border-l border-border pl-4">
                    {playbook.timeline.map((item) => {
                      const source = sourceFor(playbook, item.sourceId);
                      return (
                        <li key={`${item.period}-${item.event}`} className="relative pb-4 last:pb-0">
                          <span className="absolute -left-[1.19rem] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                          <p className="font-mono text-micro font-bold text-primary">{item.period}</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.event}</p>
                          {source ? (
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-micro text-foreground/70 hover:text-foreground">
                              {source.label} <ExternalLink className="h-3 w-3" aria-hidden />
                            </a>
                          ) : null}
                        </li>
                      );
                    })}
                  </ol>
                </section>

                <section aria-labelledby={`${playbook.slug}-sources`}>
                  <h3 id={`${playbook.slug}-sources`} className="mb-3 text-sm font-bold">Evidence ledger</h3>
                  <div className="overflow-hidden rounded-lg border">
                    {playbook.sources.map((source, index) => (
                      <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center justify-between gap-3 bg-card/35 px-3 py-2.5 transition-colors hover:bg-accent/60", index < playbook.sources.length - 1 && "border-b")}>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-foreground">{source.label}</span>
                          <span className="font-mono text-micro text-muted-foreground">{source.type}</span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                      </a>
                    ))}
                  </div>
                </section>
              </div>

              <section className="grid overflow-hidden rounded-lg border bg-card/35 md:grid-cols-3" aria-label={`${operator.name} gap analysis`}>
                <AnalysisColumn icon={CheckCircle2} title="Copy this" items={playbook.copyable} tone="text-emerald-400" />
                <AnalysisColumn icon={ShieldX} title="Cannot copy" items={playbook.nonCopyable} tone="text-violet-300" />
                <AnalysisColumn icon={AlertTriangle} title="Failure modes" items={playbook.failureModes} tone="text-amber-300" last />
              </section>
            </TabsContent>
          );
        })}
      </Tabs>

      <Separator className="my-8" />

      <section aria-labelledby="s-tier-matrix-title">
        <p className="font-mono text-micro font-bold text-primary">SIDE BY SIDE</p>
        <h2 id="s-tier-matrix-title" className="mt-1 text-xl font-black">The common pattern and the real differences</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          All three used free utility for discovery, sold a higher-value outcome, and automated recurring work. Their defensibility came from different assets: network density, historical data, or owned audience.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead className="bg-muted/55 text-muted-foreground">
              <tr>
                <th className="w-32 px-3 py-2.5 font-mono text-micro">LAYER</th>
                {playbooks.map((playbook) => {
                  const operator = operators.find((item) => item.slug === playbook.slug);
                  return <th key={playbook.slug} className="px-3 py-2.5 text-sm font-bold text-foreground">{operator?.name}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {["Wedge", "Distribution", "Monetization", "Automation", "Moat"].map((label, rowIndex) => (
                <tr key={label} className={rowIndex < 4 ? "border-b" : undefined}>
                  <th className="bg-card/45 px-3 py-3 font-mono text-micro font-bold text-primary">{label.toUpperCase()}</th>
                  {playbooks.map((playbook) => (
                    <td key={playbook.slug} className="max-w-xs px-3 py-3 leading-relaxed text-muted-foreground">
                      {playbook.loop.find((item) => item.label === label)?.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator className="my-8" />

      <section id="gap-analyzer" aria-labelledby="gap-analyzer-title" className="overflow-hidden rounded-lg border bg-card/45">
        <div className="border-b px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-micro font-bold text-primary">PRIVATE WORKBENCH</p>
              <h2 id="gap-analyzer-title" className="mt-1 text-xl font-black">Compare your current operating system</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                This is a directional diagnostic, not a public score. It runs only in this browser tab. Nothing is saved or added to the index.
              </p>
            </div>
            <Target className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          </div>
        </div>

        <form
          className="grid lg:grid-cols-[1.05fr_0.95fr]"
          onSubmit={(event) => {
            event.preventDefault();
            setResult(analyzeProfile(profile));
          }}
        >
          <div className="space-y-5 border-b p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <fieldset>
              <legend className="text-xs font-bold">What are you operating?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.value}
                    type="button"
                    onClick={() => setField("shape", shape.value)}
                    aria-pressed={profile.shape === shape.value}
                    className={cn(
                      "min-h-16 rounded-md border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      profile.shape === shape.value ? "border-primary/60 bg-primary/10" : "bg-background/35 hover:bg-accent/40",
                    )}
                  >
                    <span className="block text-xs font-bold text-foreground">{shape.label}</span>
                    <span className="mt-0.5 block text-micro leading-relaxed text-muted-foreground">{shape.detail}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <NumberField id="monthly-revenue" label="Monthly revenue" prefix="$" value={profile.monthlyRevenue} onChange={(value) => setField("monthlyRevenue", value)} />
              <NumberField id="years-operating" label="Years operating" value={profile.years} onChange={(value) => setField("years", value)} step="0.5" />
              <NumberField id="active-products" label="Active products" value={profile.products} onChange={(value) => setField("products", value)} />
              <NumberField id="detached-revenue" label="Revenue not tied to hours" suffix="%" value={profile.detachedRevenuePct} onChange={(value) => setField("detachedRevenuePct", value)} max={100} />
              <NumberField id="automation" label="Recurring ops automated" suffix="%" value={profile.automationPct} onChange={(value) => setField("automationPct", value)} max={100} />
              <NumberField id="support-hours" label="Support hours / week" value={profile.supportHours} onChange={(value) => setField("supportHours", value)} step="0.5" />
            </div>

            <fieldset>
              <legend className="text-xs font-bold">How do new customers find you?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ACQUISITION.map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    size="sm"
                    variant={profile.acquisition === item.value ? "secondary" : "outline"}
                    onClick={() => setField("acquisition", item.value)}
                    aria-pressed={profile.acquisition === item.value}
                    className="w-full px-2"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-2">
              <Button type="submit">
                <Target className="h-4 w-4" aria-hidden />
                Run gap analysis
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setProfile(INITIAL_PROFILE);
                  setResult(null);
                }}
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Reset
              </Button>
            </div>
          </div>

          <div className="min-h-[420px] p-4 sm:p-5" aria-live="polite">
            {result ? (
              <GapResults result={result} playbooks={playbooks} operators={operators} />
            ) : (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <div className="grid h-10 w-10 place-items-center rounded-md border bg-background/50 text-primary">
                  <Target className="h-4 w-4" aria-hidden />
                </div>
                <p className="mt-3 text-sm font-bold">Your comparison will appear here</p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Enter honest current-state numbers. The useful output is the three largest operating gaps, not the score.
                </p>
              </div>
            )}
          </div>
        </form>
      </section>
    </TooltipProvider>
  );
}

function AnalysisColumn({
  icon: Icon,
  title,
  items,
  tone,
  last = false,
}: {
  icon: typeof CheckCircle2;
  title: string;
  items: string[];
  tone: string;
  last?: boolean;
}) {
  return (
    <div className={cn("p-4", !last && "border-b md:border-b-0 md:border-r")}>
      <h3 className={cn("flex items-center gap-2 text-xs font-bold", tone)}>
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-xs leading-relaxed text-muted-foreground">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  max,
  step = "1",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  max?: number;
  step?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-micro leading-tight text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">{prefix}</span> : null}
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
          className={cn("font-mono tabular-nums", prefix && "pl-7", suffix && "pr-8")}
        />
        {suffix ? <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">{suffix}</span> : null}
      </div>
    </div>
  );
}

function GapResults({
  result,
  playbooks,
  operators,
}: {
  result: GapResult;
  playbooks: SoloPlaybook[];
  operators: RankedSolopreneur[];
}) {
  const playbook = playbooks.find((item) => item.slug === result.closestSlug);
  const operator = operators.find((item) => item.slug === result.closestSlug);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-micro font-bold text-primary">OPERATING READINESS</p>
          <p className="mt-1 font-mono text-3xl font-black tabular-nums">{result.overall}<span className="text-sm text-muted-foreground">/100</span></p>
        </div>
        <div className="max-w-[15rem] text-right">
          <p className="text-micro text-muted-foreground">Closest S-tier pattern</p>
          <p className="mt-0.5 text-sm font-bold">{operator?.name}</p>
          <p className="text-micro text-muted-foreground">{playbook?.archetype}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {result.dimensions.map((dimension) => (
          <div key={dimension.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold">{dimension.label}</p>
                <p className="truncate text-micro text-muted-foreground">{dimension.detail}</p>
              </div>
              <span className="font-mono text-xs font-bold tabular-nums">{dimension.score}</span>
            </div>
            <Progress value={dimension.score} className="h-1.5 bg-secondary" />
          </div>
        ))}
      </div>

      <Separator className="my-5" />

      <h3 className="text-sm font-bold">Your three largest gaps</h3>
      <ol className="mt-3 space-y-3">
        {result.gaps.map((gap, index) => (
          <li key={gap.label} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-micro font-black text-primary">{index + 1}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold">{gap.label}</p>
                <span className="font-mono text-micro text-muted-foreground">Study {gap.model}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{gap.action}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
