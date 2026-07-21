import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { AayaNirnayaResult } from "../lib/calculations";
import { VERDICT_COLOR_VAR } from "../lib/verdict";
import { MandalaMotif } from "./TempleArt";

interface SummaryCardProps {
  result: AayaNirnayaResult;
  actions?: ReactNode;
}

export function SummaryCard({ result, actions }: SummaryCardProps) {
  const { kshetraphala, summary } = result;
  const ratio = summary.favorableCount / summary.totalCount;
  const tone = ratio >= 0.6 ? "auspicious" : ratio <= 0.4 ? "inauspicious" : "context";
  const toneColor = VERDICT_COLOR_VAR[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-swarna/30 bg-ink-deep p-5 text-limewash shadow-lg shadow-black/10 sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 0%, var(--color-swarna) 0%, transparent 45%), radial-gradient(circle at 0% 100%, var(--color-pachila) 0%, transparent 45%)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-swarna-soft">Your reading</p>
        <MandalaMotif size={30} color="var(--color-swarna-soft)" />
      </div>

      <div className="relative mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-limewash/50">Kshetraphala (area)</p>
          <p className="font-display text-3xl font-semibold text-limewash sm:text-4xl">
            {kshetraphala.toLocaleString()} <span className="text-lg font-normal text-limewash/50">sq ft</span>
          </p>
        </div>

        <div className="h-px w-full bg-limewash/15 sm:h-14 sm:w-px" />

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-limewash/50">Overall reading</p>
          <p className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: toneColor }}>
            {summary.favorableCount} of {summary.totalCount}{" "}
            <span className="text-lg font-normal text-limewash/50">factors favorable</span>
          </p>
          {summary.aayaIsContext && (
            <p className="mt-1 text-xs text-limewash/60">
              Aaya landed on <span className="font-semibold text-manayola">Simha</span> — context-specific
              (auspicious for temples/halls, not counted here) — kept out of the {summary.totalCount}-factor tally above.
            </p>
          )}
        </div>
      </div>

      {actions && <div className="relative mt-6 flex flex-wrap gap-3 border-t border-limewash/10 pt-5">{actions}</div>}
    </motion.div>
  );
}
