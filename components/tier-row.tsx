import type { VehicleView } from "@/lib/data";
import type { Tier } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { TIER_STYLES } from "@/components/tier-styles";
import { VehicleCard } from "@/components/vehicle-card";

export function TierRow({
  tier,
  vehicles,
}: {
  tier: Tier;
  vehicles: VehicleView[];
}) {
  const style = TIER_STYLES[tier];

  return (
    <section
      aria-labelledby={`tier-${tier}-heading`}
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-l-4 bg-gradient-to-r to-transparent p-3 sm:flex-row sm:gap-4 sm:p-4",
        style.border,
        style.tint,
      )}
    >
      <h2 id={`tier-${tier}-heading`} className="sr-only">
        {tier} tier — {style.label} ({vehicles.length}{" "}
        {vehicles.length === 1 ? "deck" : "decks"})
      </h2>
      <div className="flex shrink-0 items-center gap-3 sm:w-28 sm:flex-col sm:items-start sm:justify-start sm:gap-2 sm:pt-1">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg text-2xl font-black",
            style.chip,
          )}
        >
          {tier}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-foreground">
            {style.label}
          </span>
          <span className="text-[11px] text-muted-foreground">
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
          <div className="flex h-full min-h-[64px] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
            No decks in this tier this week
          </div>
        )}
      </div>
    </section>
  );
}
