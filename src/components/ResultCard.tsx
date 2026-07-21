import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { Verdict } from "../lib/calculations";
import { VERDICT_CLASS, VERDICT_COLOR_VAR } from "../lib/verdict";
import { CycleWheel } from "./CycleWheel";
import { VerdictBadge } from "./VerdictBadge";

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

interface ResultCardProps {
  index: number;
  name: string;
  gloss?: string;
  modulus: number;
  remainder: number;
  resultName?: string;
  verdict: Verdict;
  description: string;
  meta?: string;
}

function CardShell({
  index,
  verdict,
  children,
}: {
  index: number;
  verdict: Verdict;
  children: ReactNode;
}) {
  const cls = VERDICT_CLASS[verdict];
  const color = VERDICT_COLOR_VAR[verdict];
  return (
    <motion.div
      variants={cardVariants}
      style={{ "--glow": color } as CSSProperties}
      className={`group relative flex gap-4 rounded-2xl border ${cls.border} bg-limewash-raised p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_var(--glow),0_14px_32px_-16px_var(--glow)] sm:p-5`}
    >
      <span className="absolute -left-2.5 -top-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-neela/20 bg-limewash font-display text-[11px] font-semibold text-neela">
        {index}
      </span>
      {children}
    </motion.div>
  );
}

export function ResultCard({ index, name, gloss, modulus, remainder, resultName, verdict, description, meta }: ResultCardProps) {
  return (
    <CardShell index={index} verdict={verdict}>
      <CycleWheel modulus={modulus} landingSegment={remainder} verdict={verdict} size={84} delay={0.15 + index * 0.09} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
          {gloss && <span className="text-xs text-ink/45">{gloss}</span>}
          {resultName && <span className="font-display text-base italic text-neela">{resultName}</span>}
        </div>
        <p className="text-sm leading-snug text-ink/75">{description}</p>
        {meta && <p className="text-xs italic text-ink/45">{meta}</p>}
        <VerdictBadge verdict={verdict} className="mt-1 self-start" />
      </div>
    </CardShell>
  );
}

interface DhanaRunaCardProps {
  index: number;
  dhana: number;
  runa: number;
  favorable: boolean;
}

export function DhanaRunaCard({ index, dhana, runa, favorable }: DhanaRunaCardProps) {
  const verdict: Verdict = favorable ? "auspicious" : "inauspicious";
  return (
    <CardShell index={index} verdict={verdict}>
      <div className="flex shrink-0 gap-2">
        <CycleWheel modulus={12} landingSegment={dhana} verdict={verdict} size={68} delay={0.15 + index * 0.09} />
        <CycleWheel modulus={8} landingSegment={runa} verdict={verdict} size={68} delay={0.2 + index * 0.09} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="font-display text-lg font-semibold text-ink">Dhana &amp; Runa</h3>
        <p className="text-sm leading-snug text-ink/75">
          Dhana <span className="font-semibold text-ink">{dhana}</span> vs. Runa{" "}
          <span className="font-semibold text-ink">{runa}</span> — read together, comparatively:{" "}
          {favorable ? "Dhana exceeds Runa, which is beneficial." : "Dhana does not exceed Runa, which is not beneficial."}
        </p>
        <VerdictBadge verdict={verdict} className="mt-1 self-start" />
      </div>
    </CardShell>
  );
}
