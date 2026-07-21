import type { Verdict } from "./calculations";

export const VERDICT_LABEL: Record<Verdict, string> = {
  auspicious: "Auspicious",
  inauspicious: "Not auspicious",
  context: "Context-specific",
  neutral: "Neutral",
};

export const VERDICT_COLOR_VAR: Record<Verdict, string> = {
  auspicious: "var(--color-pachila)",
  inauspicious: "var(--color-kavi)",
  context: "var(--color-manayola)",
  neutral: "var(--color-neela)",
};

export const VERDICT_CLASS: Record<Verdict, { text: string; bg: string; border: string; ring: string }> = {
  auspicious: { text: "text-pachila", bg: "bg-pachila-soft", border: "border-pachila/25", ring: "hover:shadow-pachila/20" },
  inauspicious: { text: "text-kavi", bg: "bg-kavi-soft", border: "border-kavi/25", ring: "hover:shadow-kavi/20" },
  context: { text: "text-manayola", bg: "bg-manayola-soft", border: "border-manayola/25", ring: "hover:shadow-manayola/20" },
  neutral: { text: "text-neela", bg: "bg-neela-soft", border: "border-neela/25", ring: "hover:shadow-neela/20" },
};
