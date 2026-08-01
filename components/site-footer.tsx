/** Hub + sister links, the fleet ring (Aether/DISTRIBUTION.md part 2). */
const FLEET = [
  { name: "adam.gives", href: "https://adam.gives", label: "the fleet" },
  { name: "deathmoney.fyi", href: "https://deathmoney.fyi", label: "cut your burn" },
  { name: "skill.supply", href: "https://skill.supply", label: "get hired" },
];

/** The shared footer for every board. */
export function SiteFooter() {
  return (
    <footer className="mt-8 flex flex-col gap-3 border-t pt-5 text-xs text-muted-foreground">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-foreground/70">Part of the adam.inc fleet:</span>
        {FLEET.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.label}
            className="rounded font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {s.name}
          </a>
        ))}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p>
        The Vicious Syndicate of moneymaking.{" "}
        <span className="text-foreground/70">
          Not financial advice. Every number traces to a source.
        </span>
      </p>
      <p className="flex flex-wrap items-center gap-x-3">
        <a
          href="https://github.com/adamtpang/moneymeta.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          github.com/adamtpang/moneymeta.fun
        </a>
        <a
          href="https://adampang.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          built by Adam Pangelinan
        </a>
      </p>
      </div>
    </footer>
  );
}
