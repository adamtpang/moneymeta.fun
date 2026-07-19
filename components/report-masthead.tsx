/** The identity header. moneymeta is one board now: the money meta. */
export function ReportMasthead() {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          The Vicious Syndicate of moneymaking
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/30">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Live
        </span>
      </div>
      <a
        href="/"
        className="inline-block rounded font-mono text-3xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-4xl"
      >
        moneymeta<span className="text-primary">.fun</span>
      </a>
      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The best money deck to play in life, ranked. Every way to make money scored
        S to D by the data, so you know exactly where to walk.
      </p>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-primary/40 via-border to-transparent" />
    </header>
  );
}
