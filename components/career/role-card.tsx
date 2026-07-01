import { ArrowUpRight } from "lucide-react";

import type { Role } from "@/lib/career";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";

export function RoleCard({ role }: { role: Role }) {
  const style = TIER_STYLES[role.desirability];
  return (
    <a
      href={role.applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col gap-2 rounded-xl border border-border/70 bg-card/70 p-3.5 ring-1 ring-transparent transition-all duration-200 hover:-translate-y-1 hover:border-border",
        style.ring,
        style.glow,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">{role.title}</div>
          <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {role.company}
          </div>
        </div>
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-xs font-black",
            style.chip,
          )}
        >
          {role.desirability}
        </span>
      </div>
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{role.hook}</p>
      <div className="mt-auto inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Reverse-engineer <ArrowUpRight className="h-3 w-3" aria-hidden />
      </div>
    </a>
  );
}
