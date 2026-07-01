import {
  ArrowUpRight,
  CircleCheck,
  Mail,
  Rocket,
  Target,
  Trophy,
} from "lucide-react";

import type { Role } from "@/lib/career";
import { cn } from "@/lib/utils";

const CATEGORY_STYLE: Record<string, string> = {
  Core: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  Web: "bg-cyan-400/15 text-cyan-300 ring-cyan-400/30",
  Data: "bg-violet-400/15 text-violet-300 ring-violet-400/30",
  Analytics: "bg-sky-400/15 text-sky-300 ring-sky-400/30",
  Craft: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  Domain: "bg-rose-400/15 text-rose-300 ring-rose-400/30",
  Logistics: "bg-slate-400/15 text-slate-300 ring-slate-400/30",
};

export function FeaturedRole({ role }: { role: Role }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Role header */}
      <div className="rounded-2xl border bg-card/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <span className="rounded bg-secondary px-1.5 py-0.5 text-foreground">
                {role.company}
              </span>
              <span>{role.type}</span>
              <span>{role.location}</span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-foreground sm:text-xl">
              {role.title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{role.hook}</p>
          </div>
          <a
            href={role.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View role <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>

      {/* The unfair gate */}
      <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/[0.08] to-transparent p-4 sm:p-5">
        <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-amber-300">
          <Trophy className="h-4 w-4" aria-hidden />
          {role.unfairGate.title}
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {role.unfairGate.detail}
        </p>
      </div>

      {/* Competency map */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <Target className="h-3.5 w-3.5" aria-hidden />
          The JD, reverse-engineered into proof
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {role.competencies.map((c) => (
            <div key={c.name} className="rounded-xl border bg-card/70 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{c.name}</span>
                <span
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1",
                    CATEGORY_STYLE[c.category] ?? CATEGORY_STYLE.Logistics,
                  )}
                >
                  {c.category}
                </span>
              </div>
              <p className="mt-1.5 border-l-2 border-border pl-2 text-xs italic leading-relaxed text-muted-foreground">
                {c.jdQuote}
              </p>
              <div className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-foreground/90">
                <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                <span>
                  <span className="font-semibold text-primary">Proof: </span>
                  {c.proof}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capstone */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/[0.08] to-transparent p-4 sm:p-5">
        <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-primary">
          <Rocket className="h-4 w-4" aria-hidden />
          The one capstone that proves all of it: {role.capstone.title}
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {role.capstone.detail}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {role.capstone.proves.map((p) => (
            <span
              key={p}
              className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground/80"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* On-ramps */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Meet yourself where you are
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {role.onRamps.map((r) => (
            <div key={r.from} className="rounded-xl border bg-card/70 p-3.5">
              <div className="text-sm font-semibold text-foreground">{r.from}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.plan}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Application kit */}
      <div className="rounded-2xl border bg-card/70 p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="h-4 w-4 text-primary" aria-hidden />
          The application kit
        </div>
        <ul className="flex flex-col gap-1.5">
          {role.applicationKit.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 font-mono text-xs font-bold text-primary">{i + 1}</span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
