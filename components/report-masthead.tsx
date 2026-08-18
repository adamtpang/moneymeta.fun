/**
 * The identity header. moneymeta is one board now: the money meta.
 *
 * `titleAs="h1"` renders the site title as a real <h1> (the page's single
 * top-level heading) with the link nested inside, for pages where this
 * masthead IS the page title (e.g. the homepage). Pages that already have
 * their own <h1> (e.g. a report issue's headline) should omit this prop so
 * the title stays a plain link and the page keeps exactly one <h1>.
 */
export function ReportMasthead({ titleAs = "a" }: { titleAs?: "h1" | "a" }) {
  const titleLink = (
    <a
      href="/"
      className="inline-block rounded font-mono text-3xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-4xl"
    >
      moneymeta<span className="text-primary">.fun</span>
    </a>
  );

  return (
    <header className="mb-6 sm:mb-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-micro font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          The Vicious Syndicate of moneymaking
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 font-mono text-micro font-semibold uppercase tracking-[0.08em] text-primary ring-1 ring-primary/30">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Live
        </span>
      </div>
      {titleAs === "h1" ? <h1>{titleLink}</h1> : titleLink}
      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The best money deck to play in life, ranked. Every way to make money scored
        S to D by the data, so you know exactly where to walk.
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/80 pt-3">
        <nav className="flex items-center gap-1" aria-label="Primary navigation">
          <a href="/" className="rounded px-2 py-1 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Money decks</a>
          <a href="/capital" className="rounded px-2 py-1 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Capital map</a>
        </nav>
        <span className="hidden font-mono text-micro uppercase tracking-[0.08em] text-muted-foreground sm:block">data report</span>
      </div>
    </header>
  );
}
