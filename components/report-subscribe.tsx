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
      className="mt-8 rounded-lg border border-primary/30 bg-primary/[0.05] p-4"
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
          <Input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="min-w-0 flex-1 bg-card/80"
          />
          <Button type="submit" size="sm"><Mail className="h-4 w-4" aria-hidden />Subscribe</Button>
        </form>
      ) : (
        <Button asChild size="sm" className="mt-3">
          <a href={MAILTO}><Mail className="h-4 w-4" aria-hidden />Get it by email</a>
        </Button>
      )}
    </section>
  );
}
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
