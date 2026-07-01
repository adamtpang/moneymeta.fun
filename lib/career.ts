/**
 * The Career engine, moneymeta's third map: reverse-engineer a real job
 * description from a top company into a course that meets an applicant where
 * they are, ending in the proof that gets them placed. Seeded from
 * seed/roles.json. Same "meet demand where it already is" idea as the other
 * boards, applied to hiring.
 */
import roles from "@/seed/roles.json";
import type { Tier } from "@/lib/meta";

export interface Competency {
  name: string;
  category: string;
  jdQuote: string;
  proof: string;
}

export interface Role {
  slug: string;
  company: string;
  title: string;
  location: string;
  type: string;
  desirability: Tier;
  featured: boolean;
  hook: string;
  applyUrl: string;
  apply: { email: string; subject: string; includes: string[] };
  unfairGate: { title: string; detail: string };
  competencies: Competency[];
  capstone: { title: string; detail: string; proves: string[] };
  onRamps: { from: string; plan: string }[];
  applicationKit: string[];
}

export function getRoles(): Role[] {
  return roles as Role[];
}

export function getFeaturedRole(): Role | null {
  return (roles as Role[]).find((r) => r.featured) ?? null;
}

export function getOtherRoles(): Role[] {
  return (roles as Role[]).filter((r) => !r.featured);
}
