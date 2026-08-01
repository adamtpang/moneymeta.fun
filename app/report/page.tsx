import type { Metadata } from "next";
import Link from "next/link";

import { listIssues } from "@/lib/report";
import { ReportMasthead } from "@/components/report-masthead";
import { SiteFooter } from "@/components/site-footer";
import { ReportSubscribe } from "@/components/report-subscribe";
import { IssueBody } from "./[week]/issue-body";

export const metadata: Metadata = {
  title: "The weekly money meta | moneymeta.fun",
  description:
    "The weekly meta report for making money: movers, The Pick under both lenses, and what actually changed in the data. Published Mondays.",
};

export default function ReportIndexPage() {
  const issues = listIssues();
  const latest = issues[0] ?? null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[860px] px-4 py-6 sm:py-10">
        <ReportMasthead />

        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            The weekly report
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            The board is the live state; this is the periodical. Every Monday:
            what moved, The Pick under both lenses, and the honest note when
            nothing moved at all.
          </p>
        </div>

        {latest ? (
          <IssueBody issue={latest} latest />
        ) : (
          <p className="text-sm text-muted-foreground">
            No issues published yet. The first one ships Monday.
          </p>
        )}

        {issues.length > 1 && (
          <section className="mt-8" aria-label="Report archive">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Archive
            </div>
            <ul className="space-y-1">
              {issues.slice(1).map((i) => (
                <li key={i.week}>
                  <Link
                    href={`/report/${i.week}`}
                    className="rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {i.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ReportSubscribe />
        <SiteFooter />
      </div>
    </div>
  );
}
