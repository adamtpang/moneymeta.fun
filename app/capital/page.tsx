import { Bitcoin, Building2, Landmark, Users } from "lucide-react";

import { CapitalBoard } from "@/components/capital/capital-board";
import { ReportMasthead } from "@/components/report-masthead";
import { SiteFooter } from "@/components/site-footer";
import {
  getCapitalAsOf,
  getCapitalNote,
  getCapitalVehicles,
  groupCapitalByTier,
} from "@/lib/capital";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Capital Map | moneymeta.fun",
  description: "A source-linked map of capitalism: crypto, public companies, billionaires, and country GDP ranked by size and recent momentum.",
};

const universes = [
  { label: "Crypto", detail: "CoinMarketCap", icon: Bitcoin },
  { label: "Companies", detail: "CompaniesMarketCap", icon: Building2 },
  { label: "People", detail: "Forbes", icon: Users },
  { label: "Countries", detail: "World Population Review", icon: Landmark },
];

export default function CapitalPage() {
  const vehicles = getCapitalVehicles();
  const groups = groupCapitalByTier(vehicles);
  const asOf = getCapitalAsOf();

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-8">
        <ReportMasthead />

        <section className="mb-5 border-b pb-5" aria-labelledby="capital-map-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-micro font-semibold uppercase tracking-[0.12em] text-primary">The capital map</p>
              <h1 id="capital-map-title" className="mt-1 text-2xl font-black sm:text-3xl">Where capitalism concentrates</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Crypto, companies, billionaires, and nations ranked by capital gravity and recent movement. Tap a card to inspect the source.
              </p>
            </div>
            <p className="font-mono text-xs text-muted-foreground">Snapshot: {formatDate(asOf)}</p>
          </div>
        </section>

        <section className="mb-5 grid grid-cols-2 overflow-hidden rounded-lg border bg-card/45 sm:grid-cols-4" aria-label="Capital map sources">
          {universes.map(({ label, detail, icon: Icon }) => (
            <div key={label} className="flex min-h-16 items-center gap-2 border-b border-r p-3 even:border-r-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{label}</p>
                <p className="truncate font-mono text-micro text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </section>

        <CapitalBoard groups={groups} />

        <section className="mt-8 border-t pt-5" aria-label="Capital map methodology">
          <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Method.</span> Meta score = 50% normalized log-size + 50% recent growth, with growth clamped at plus or minus 12% to limit outliers. Values span fundamentally different things: market capitalization for crypto and public companies, Forbes-estimated net worth for people, and nominal GDP for countries. The tier list is a comparative map of capital concentration, not an investability or financial-advice ranking. {getCapitalNote()}
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
