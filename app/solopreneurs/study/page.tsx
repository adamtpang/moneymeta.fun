import { ArrowLeft, FlaskConical } from "lucide-react";
import Link from "next/link";

import { ReportMasthead } from "@/components/report-masthead";
import { SiteFooter } from "@/components/site-footer";
import { SoloStudyLab } from "@/components/solopreneurs/study-lab";
import { Button } from "@/components/ui/button";
import { getSoloPlaybookAsOf, getSoloPlaybooks } from "@/lib/solo-playbooks";
import { getSolopreneurIndex } from "@/lib/solopreneurs";

export const metadata = {
  title: "S-tier Solo Operator Study | moneymeta.fun",
  description:
    "Source-linked operating playbooks for Markus Frind, Gary Brewer, and Pieter Levels, plus a private gap diagnostic.",
};

export default function SolopreneurStudyPage() {
  const playbooks = getSoloPlaybooks();
  const operators = getSolopreneurIndex().filter((operator) =>
    playbooks.some((playbook) => playbook.slug === operator.slug),
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-8">
        <ReportMasthead />

        <div className="mb-4">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <Link href="/solopreneurs">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Solo Operator Index
            </Link>
          </Button>
        </div>

        <header className="mb-6 border-b pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 font-mono text-micro font-bold text-primary">
                <FlaskConical className="h-3.5 w-3.5" aria-hidden />
                S-TIER STUDY LAB
              </p>
              <h1 className="mt-2 max-w-3xl text-2xl font-black sm:text-3xl">
                Exactly what the top solo operators did
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Three source-linked operating systems, decomposed into wedge, distribution,
                monetization, automation, and moat. Then compare your current business against
                the pattern without publishing your numbers.
              </p>
            </div>
            <p className="shrink-0 font-mono text-micro text-muted-foreground">
              Research snapshot {getSoloPlaybookAsOf()}
            </p>
          </div>
        </header>

        <SoloStudyLab playbooks={playbooks} operators={operators} />

        <SiteFooter />
      </div>
    </div>
  );
}
