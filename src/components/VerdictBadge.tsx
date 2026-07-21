import type { Verdict } from "../lib/calculations";
import { VERDICT_CLASS, VERDICT_LABEL } from "../lib/verdict";

function VerdictIcon({ verdict }: { verdict: Verdict }) {
  const common = { width: 12, height: 12, viewBox: "0 0 12 12", "aria-hidden": true } as const;
  switch (verdict) {
    case "auspicious":
      return (
        <svg {...common}>
          <path d="M2 6.2 5 9l5-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "inauspicious":
      return (
        <svg {...common}>
          <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      );
    case "context":
      return (
        <svg {...common}>
          <path d="M6 1v10M1 6h10M2.5 2.5l7 7M9.5 2.5l-7 7" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M2 6h8" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      );
  }
}

export function VerdictBadge({ verdict, className = "" }: { verdict: Verdict; className?: string }) {
  const cls = VERDICT_CLASS[verdict];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${cls.text} ${cls.bg} ${cls.border} ${className}`}
    >
      <VerdictIcon verdict={verdict} />
      {VERDICT_LABEL[verdict]}
    </span>
  );
}
