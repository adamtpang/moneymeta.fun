import type { VehicleView } from "@/lib/data";
import type { Tier } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";
import { VehicleCard } from "@/components/vehicle-card";

export function TierRow({
  tier,
  vehicles,
  index = 0,
}: {
  tier: Tier;
  vehicles: VehicleView[];
  index?: number;
}) {
  const style = TIER_STYLES[tier];

  return (
    <section
      aria-labelledby={`tier-${tier}-heading`}
      style={{ animationDelay: `${index * 70}ms` }}
      className={cn(
        "flex animate-rise flex-col gap-3 rounded-2xl border border-l-[3px] bg-gradient-to-r to-transparent p-3 sm:flex-row sm:gap-4 sm:p-4",
        style.border,
        style.tint,
      )}
    >
      <h2 id={`tier-${tier}-heading`} className="sr-only">
        {tier} tier, {style.label} ({vehicles.length}{" "}
        {vehicles.length === 1 ? "deck" : "decks"})
      </h2>
      <div className="flex shrink-0 items-center gap-3 sm:w-28 sm:flex-col sm:items-start sm:justify-start sm:gap-2.5 sm:pt-1">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl font-mono text-3xl font-black",
            style.chip,
          )}
        >
          {tier}
        </div>
        <div className="flex flex-col leading-tight">
          <span className={cn("text-xs font-semibold", style.text)}>
            {style.label}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {vehicles.length} {vehicles.length === 1 ? "deck" : "decks"}
          </span>
        </div>
      </div>

      <div className="flex-1">
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {vehicles.map((v) => (
              <VehicleCard key={v.slug} v={v} />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[72px] items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground">
            No decks in this tier this snapshot
          </div>
        )}
      </div>
    </section>
  );
}
