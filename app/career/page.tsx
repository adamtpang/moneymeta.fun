import type { Metadata } from "next";
import { FileSearch, GraduationCap, Workflow } from "lucide-react";

import { getFeaturedRole, getOtherRoles } from "@/lib/career";
import { BoardTabs } from "@/components/board-tabs";
import { FeaturedRole } from "@/components/career/featured-role";
import { RoleCard } from "@/components/career/role-card";

export const metadata: Metadata = {
  title: "moneymeta.fun, the career engine",
  description:
    "Reverse-engineer real job descriptions from top companies into a course that meets you where you are, ending in the proof that gets you placed.",
};

const STEPS = [
  { icon: FileSearch, title: "Ingest the JD", detail: "Take a real role from a top company's careers page." },
  { icon: Workflow, title: "Reverse-engineer it", detail: "Map every requirement to a skill, a module, and the proof it produces." },
  { icon: GraduationCap, title: "Meet you where you are", detail: "Adaptive on-ramps, one capstone, then placement." },
];

export default function CareerPage() {
  const featured = getFeaturedRole();
  const others = getOtherRoles();

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="font-mono text-2xl font-black tracking-tight sm:text-3xl">
              moneymeta<span className="text-primary">.fun</span>
            </h1>
            <BoardTabs />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The <span className="font-semibold text-foreground">career engine</span>. We take a
            real job description from a top company, reverse-engineer it into a course that meets
            you where you are, and end at the proof that gets you placed. The{" "}
            <span className="font-semibold text-foreground">ikigai</span> board: where your skills
            meet real employer demand.
          </p>

          {/* How it works */}
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="flex items-start gap-3 rounded-lg border bg-card/60 px-3.5 py-3"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-foreground">
                      <span className="font-mono text-xs text-muted-foreground">{i + 1}. </span>
                      {s.title}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{s.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        {/* Featured reverse-engineered role */}
        {featured ? (
          <section aria-label="Featured reverse-engineered role" className="mb-8">
            <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Live example
            </div>
            <FeaturedRole role={featured} />
          </section>
        ) : null}

        {/* Other roles */}
        {others.length > 0 ? (
          <section aria-label="More roles" className="mb-8">
            <div className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Next up, drop a JD and the engine builds the course
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((r) => (
                <RoleCard key={r.slug} role={r} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Roadmap */}
        <section className="rounded-xl border bg-card/40 p-4" aria-label="Where this goes">
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Where this goes.</span> Automate the
            loop: crawl the careers pages of the top companies on earth, ingest every open JD, let
            the model reverse-engineer each into a course and a capstone, verify the proof, and
            route applicants straight to the hiring inbox. Certification comes from shipped proof,
            not a quiz. The business follows myequation: free to learn, and you earn on placement.
            Not career or financial advice.
          </p>
        </section>
      </div>
    </div>
  );
}
