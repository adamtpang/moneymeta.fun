import playbookData from "@/seed/solo-playbooks.json";

export interface SoloPlaybookSource {
  id: string;
  label: string;
  url: string;
  type: string;
}

export interface SoloPlaybook {
  slug: "markus-frind" | "gary-brewer" | "pieter-levels";
  archetype: string;
  thesis: string;
  summary: string;
  loop: Array<{ label: string; value: string }>;
  timeline: Array<{ period: string; event: string; sourceId: string }>;
  numbers: Array<{
    value: string;
    label: string;
    context: string;
    confidence: string;
    sourceId: string;
  }>;
  copyable: string[];
  nonCopyable: string[];
  failureModes: string[];
  sources: SoloPlaybookSource[];
}

export function getSoloPlaybooks(): SoloPlaybook[] {
  return playbookData.operators as SoloPlaybook[];
}

export function getSoloPlaybookAsOf(): string {
  return playbookData.asOf;
}
