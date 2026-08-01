/**
 * Email capture for the weekly report, feeding the single fleet list
 * (Aether/DISTRIBUTION.md part 4). Until the fleet list endpoint exists
 * (NEXT_PUBLIC_FLEET_SUBSCRIBE_URL), this renders a working mailto CTA so the
 * capture channel is real on day one instead of a dead form.
 */
const SUBSCRIBE_URL = process.env.NEXT_PUBLIC_FLEET_SUBSCRIBE_URL;

const MAILTO =
  "mailto:adamtpang@gmail.com?subject=" +
  encodeURIComponent("subscribe: the weekly money meta") +
  "&body=" +
  encodeURIComponent("Send me the money meta every Monday. (Just hit send.)");

export function ReportSubscribe() {
  return (
    <section
      className="mt-8 rounded-xl border border-primary/30 bg-primary/[0.06] p-4"
      aria-label="Subscribe to the weekly report"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        The weekly money meta, every Monday
      </div>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
        One email when the new report ships: movers, The Pick under both
        lenses, and what actually changed in the data. No noise.
      </p>
      {SUBSCRIBE_URL ? (
        <form
          action={SUBSCRIBE_URL}
          method="post"
          className="mt-3 flex max-w-md flex-wrap gap-2"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-lg border border-border/70 bg-card/80 px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Subscribe
          </button>
        </form>
      ) : (
        <a
          href={MAILTO}
          className="mt-3 inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Get it by email
        </a>
      )}
    </section>
  );
}
