import type { Metadata } from "next";
import { ArrowUpRight, Check, Clock, Hammer, Mail, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Build Sprint, shipped in 7 days | moneymeta.fun",
  description:
    "One painful thing in your business, or one feature or tool you have wanted, shipped working in about 7 days. Flat price. First three at half price for case studies.",
};

const MAILTO =
  "mailto:adamtpang@gmail.com?subject=sprint&body=The%20one%20thing%20I%20want%20built%3A%20";
const DEPOSIT_LINK = "https://buy.stripe.com/bJe6oH6UW68BaEwgl3aMU0p";

const DELIVERABLES = [
  "A working AI feature, internal tool, automation, or MVP, live at a URL you own",
  "You own the code, the repo, and the deploy",
  "Built in public-grade quality: tested, deployed, documented",
  "Daily progress notes, no meetings required",
];

const FITS = [
  "Founders who need an MVP or a feature shipped without hiring",
  "SMBs with a painful manual workflow (quotes, intake, follow-ups, reports)",
  "Funded teams with a backlog their first hire cannot clear",
];

export default function SprintPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[860px] px-4 py-6 sm:py-10">
        <header className="mb-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <a
              href="/"
              className="rounded font-mono text-2xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-3xl"
            >
              moneymeta<span className="text-primary">.fun</span>
            </a>
            <a
              href="/"
              className="rounded font-mono text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ← the money meta
            </a>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/[0.08] to-transparent p-5 sm:p-7">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-primary/15 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary ring-1 ring-primary/30">
              <Hammer className="h-3 w-3" aria-hidden /> AI Build Sprint
            </div>
            <h2 className="max-w-xl text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              One thing you have wanted built. Shipped working in ~7 days.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              You describe the outcome. I build it with AI-grade speed and senior-grade
              taste, and you own everything. Flat{" "}
              <span className="font-mono font-bold text-foreground">$1,500</span> per sprint.
              First three clients at{" "}
              <span className="font-mono font-bold text-primary">$750</span> in exchange for
              a case study.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={MAILTO}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Book a sprint: tell me the one thing
              </a>
              <a
                href={DEPOSIT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Ready now? Pay the $750 deposit
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden /> scoped same day, shipped in ~7
              </span>
            </div>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2" aria-label="What you get and who it fits">
          <div className="rounded-xl border bg-card/70 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              What you get
            </div>
            <ul className="flex flex-col gap-1.5">
              {DELIVERABLES.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card/70 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Built for
            </div>
            <ul className="flex flex-col gap-1.5">
              {FITS.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-6 rounded-xl border bg-card/70 p-4" aria-label="Proof">
          <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Shield className="h-4 w-4 text-primary" aria-hidden /> Proof, not promises
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This site is the portfolio. The{" "}
            <a href="/" className="font-medium text-primary hover:underline">
              money meta
            </a>
            , a live, data-ranked tier list of every way to make money, designed, built, and
            shipped to production in days, solo. Your sprint gets the same speed and the same bar.
          </p>
        </section>

        <section className="rounded-xl border bg-card/40 p-4" aria-label="How it works">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">How it works.</span> Email the one
            thing you want built. I reply same day with a fixed scope and a yes or no. The{" "}
            <a
              href={DEPOSIT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              $750 deposit
            </a>{" "}
            books the slot, the remainder is due on delivery, and if I miss the scope we agreed,
            you do not pay the remainder. Card via Stripe, or invoice.{" "}
            <a href={MAILTO} className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline">
              Start now <ArrowUpRight className="h-3 w-3" aria-hidden />
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
