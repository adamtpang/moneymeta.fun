import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getIssue, listIssues } from "@/lib/report";
import { ReportMasthead } from "@/components/report-masthead";
import { SiteFooter } from "@/components/site-footer";
import { ReportSubscribe } from "@/components/report-subscribe";
import { IssueBody } from "./issue-body";

export function generateStaticParams() {
  return listIssues().map((i) => ({ week: i.week }));
}

export function generateMetadata({ params }: { params: { week: string } }): Metadata {
  const issue = getIssue(params.week);
  if (!issue) return { title: "Report not found | moneymeta.fun" };
  return {
    title: `${issue.title} | moneymeta.fun`,
    description: `Movers, The Pick under both lenses, and what changed vs ${issue.baseline}. ${issue.deckCount} decks, ${issue.sTierCount} S tier.`,
  };
}

export default function ReportIssuePage({ params }: { params: { week: string } }) {
  const issue = getIssue(params.week);
  if (!issue) notFound();

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[860px] px-4 pb-8">
        <ReportMasthead />
        <IssueBody issue={issue} />
        <ReportSubscribe />
        <SiteFooter />
      </div>
    </div>
  );
}
