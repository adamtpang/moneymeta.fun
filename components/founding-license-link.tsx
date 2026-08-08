"use client";

import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";

export function FoundingLicenseLink() {
  return (
    <a
      href="https://buy.stripe.com/dRmbJ1eno9kNfYQfgZaMU0y"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("checkout_click", { plan: "founding_license", price: 29 })}
      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Founding license · $29 <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </a>
  );
}
