"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FoundingLicenseLink() {
  return (
    <Button asChild size="sm" className="shrink-0">
      <a
        href="https://buy.stripe.com/dRmbJ1eno9kNfYQfgZaMU0y"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => (window as any).posthog?.capture("checkout_click", { plan: "founding_license", price: 29 })}
      >
        Founding license $29 <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    </Button>
  );
}
