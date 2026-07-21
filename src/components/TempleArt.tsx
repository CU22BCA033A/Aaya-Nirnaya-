/**
 * Original, license-free architectural ornament — a stylized South Indian
 * gopuram (temple gateway tower) silhouette and companion mandala/divider
 * motifs. Drawn as parametric SVG rather than a photograph so it always
 * matches the palette exactly and never depends on an external asset.
 */

interface TempleSilhouetteProps {
  className?: string;
  color?: string;
}

export function TempleSilhouette({ className = "", color = "var(--color-neela)" }: TempleSilhouetteProps) {
  const tiers = 8;
  const baseWidth = 360;
  const topWidth = 70;
  const tierHeight = 24;
  const baseY = 300;
  const cx = 200;

  const tierShapes = Array.from({ length: tiers }, (_, i) => {
    const t = i / (tiers - 1);
    const width = baseWidth - (baseWidth - topWidth) * t;
    const nextWidth = baseWidth - (baseWidth - topWidth) * Math.min(1, (i + 1) / (tiers - 1));
    const y = baseY - i * tierHeight;
    const yTop = y - tierHeight;
    const halfW = width / 2;
    const halfNextW = nextWidth / 2;
    const finials = i < tiers - 1 ? Math.max(2, tiers - i) : 0;

    return (
      <g key={i}>
        <polygon
          points={`${cx - halfW},${y} ${cx + halfW},${y} ${cx + halfNextW},${yTop} ${cx - halfNextW},${yTop}`}
          fill={color}
          opacity={0.9 - i * 0.02}
        />
        <rect x={cx - halfW} y={y - 3} width={width} height={2} fill={color} opacity={0.35} />
        {finials > 0 &&
          Array.from({ length: finials }, (_, f) => {
            const spread = halfW - 8;
            const fx = finials === 1 ? cx : cx - spread + (f * (2 * spread)) / (finials - 1);
            return <polygon key={f} points={`${fx - 5},${y} ${fx + 5},${y} ${fx},${y - 9}`} fill={color} opacity={0.9} />;
          })}
      </g>
    );
  });

  const topY = baseY - tiers * tierHeight;

  return (
    <svg viewBox="0 0 400 320" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect x={10} y={baseY} width={380} height={10} fill={color} opacity={0.5} />
      {tierShapes}
      <path d={`M ${cx - 14} ${topY} Q ${cx} ${topY - 26} ${cx + 14} ${topY} Z`} fill={color} opacity={0.9} />
      <circle cx={cx} cy={topY - 30} r={4} fill={color} opacity={0.9} />
      <line x1={cx} y1={topY - 30} x2={cx} y2={topY - 42} stroke={color} strokeWidth={2} opacity={0.9} />
    </svg>
  );
}

interface MandalaMotifProps {
  className?: string;
  color?: string;
  size?: number;
}

export function MandalaMotif({ className = "", color = "var(--color-swarna)", size = 48 }: MandalaMotifProps) {
  const petals = 12;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx={50} cy={50} r={46} fill="none" stroke={color} strokeWidth={1} opacity={0.5} />
      <circle cx={50} cy={50} r={36} fill="none" stroke={color} strokeWidth={1} opacity={0.6} />
      {Array.from({ length: petals }, (_, i) => {
        const angle = (i * 360) / petals;
        return (
          <ellipse
            key={i}
            cx={50}
            cy={22}
            rx={5}
            ry={11}
            fill={color}
            opacity={0.7}
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      <circle cx={50} cy={50} r={8} fill={color} opacity={0.85} />
    </svg>
  );
}

export function OrnamentalDivider({ className = "", color = "var(--color-swarna)" }: { className?: string; color?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 sm:w-24" style={{ backgroundColor: color, opacity: 0.4 }} />
      <svg viewBox="0 0 24 24" width={14} height={14} style={{ color }}>
        <path d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z" fill="currentColor" opacity={0.8} />
      </svg>
      <span className="h-px w-16 sm:w-24" style={{ backgroundColor: color, opacity: 0.4 }} />
    </div>
  );
}
