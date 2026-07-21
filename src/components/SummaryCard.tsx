import { motion } from "framer-motion";
import type { AayaNirnayaResult } from "../lib/calculations";
import { VERDICT_COLOR_VAR } from "../lib/verdict";

interface SummaryCardProps {
  result: AayaNirnayaResult;
}

export function SummaryCard({ result }: SummaryCardProps) {
  const { kshetraphala, summary } = result;
  const ratio = summary.favorableCount / summary.totalCount;
  const tone = ratio >= 0.6 ? "auspicious" : ratio <= 0.4 ? "inauspicious" : "context";
  const toneColor = VERDICT_COLOR_VAR[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 rounded-2xl border border-neela/15 bg-limewash-raised p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Kshetraphala (area)</p>
        <p className="font-display text-3xl font-semibold text-neela sm:text-4xl">
          {kshetraphala.toLocaleString()} <span className="text-lg font-normal text-ink/50">sq ft</span>
        </p>
      </div>

      <div className="h-px w-full bg-neela/10 sm:h-14 sm:w-px" />

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Overall reading</p>
        <p className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: toneColor }}>
          {summary.favorableCount} of {summary.totalCount}{" "}
          <span className="text-lg font-normal text-ink/50">factors favorable</span>
        </p>
        {summary.aayaIsContext && (
          <p className="mt-1 text-xs text-ink/55">
            Aaya landed on <span className="font-semibold text-manayola">Simha</span> — context-specific
            (auspicious for temples/halls, not counted here) — kept out of the {summary.totalCount}-factor tally above.
          </p>
        )}
      </div>
    </motion.div>
  );
}
