import { motion, useReducedMotion } from "framer-motion";
import type { Verdict } from "../lib/calculations";
import { VERDICT_COLOR_VAR } from "../lib/verdict";

interface CycleWheelProps {
  modulus: number;
  landingSegment: number;
  verdict: Verdict;
  size?: number;
  delay?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeAnnularSegment(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
) {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export function CycleWheel({ modulus, landingSegment, verdict, size = 96, delay = 0 }: CycleWheelProps) {
  const prefersReducedMotion = useReducedMotion();
  const cx = 50;
  const cy = 50;
  const innerR = 25;
  const outerR = 46;
  const outerRHighlight = 49;
  const gapDeg = modulus > 20 ? 0.6 : modulus > 10 ? 1.4 : 3;
  const step = 360 / modulus;
  const color = VERDICT_COLOR_VAR[verdict];

  const segments = Array.from({ length: modulus }, (_, i) => {
    const start = i * step + gapDeg / 2;
    const end = (i + 1) * step - gapDeg / 2;
    const isLanding = i === landingSegment;
    return { i, start, end, isLanding };
  });

  const segmentCenterAngle = landingSegment * step + step / 2;
  const spins = prefersReducedMotion ? 0 : 2;
  const pointerTarget = spins * 360 + segmentCenterAngle;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        {segments.map((seg) => (
          <motion.path
            key={seg.i}
            d={describeAnnularSegment(cx, cy, innerR, seg.isLanding ? outerRHighlight : outerR, seg.start, seg.end)}
            fill={seg.isLanding ? color : "var(--color-neela)"}
            fillOpacity={seg.isLanding ? 1 : 0.22}
            stroke="var(--color-limewash-raised)"
            strokeWidth={0.6}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.5, delay: delay + (seg.isLanding ? 1.0 : 0.05 * (seg.i % 6)) }
            }
          />
        ))}
        <motion.g
          initial={prefersReducedMotion ? false : { rotate: 0 }}
          animate={{ rotate: pointerTarget }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }
          }
          style={{ originX: "50px", originY: "50px" }}
        >
          <circle cx={50} cy={50 - outerRHighlight - 3} r={2.6} fill="var(--color-ink)" />
        </motion.g>
        <circle cx={cx} cy={cy} r={innerR - 2} fill="var(--color-limewash-raised)" stroke="var(--color-neela-soft)" strokeWidth={0.5} />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold leading-none text-ink">{landingSegment}</span>
        <span className="mt-0.5 text-[9px] uppercase tracking-wide text-ink/50">of {modulus}</span>
      </div>
    </div>
  );
}
