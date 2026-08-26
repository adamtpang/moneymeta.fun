"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BriefcaseBusiness, Landmark, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Money", icon: BriefcaseBusiness },
  { href: "/capital", label: "Capital", icon: Landmark },
  { href: "/solopreneurs", label: "Solo", icon: BarChart3 },
  { href: "/report", label: "Weekly", icon: Newspaper },
];

export function ReportMasthead() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 -mx-4 mb-6 border-b border-border/80 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-3">
        <Link
          href="/"
          className="shrink-0 rounded-sm font-mono text-base font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="moneymeta.fun home"
        >
          moneymeta<span className="text-primary">.fun</span>
        </Link>

        <nav className="min-w-0 flex-1 overflow-hidden" aria-label="Primary navigation">
          <div className="flex items-center gap-0.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Button
                  key={href}
                  asChild
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 px-0 text-xs text-muted-foreground shadow-none sm:w-auto sm:px-2.5",
                    active && "bg-secondary text-foreground",
                  )}
                >
                  <Link href={href} aria-current={active ? "page" : undefined} aria-label={label}>
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </nav>

        <span className="hidden shrink-0 items-center gap-1.5 font-mono text-micro font-semibold text-primary sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          LIVE DATA
        </span>
      </div>
    </header>
  );
}
