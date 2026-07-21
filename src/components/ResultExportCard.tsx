import { forwardRef } from "react";
import type { AayaNirnayaResult, RawDimensions } from "../lib/calculations";
import { VERDICT_CLASS, VERDICT_LABEL } from "../lib/verdict";
import { MandalaMotif } from "./TempleArt";

interface ResultExportCardProps {
  dimensions: RawDimensions;
  result: AayaNirnayaResult;
}

function fmt(feet: number, inches: number): string {
  return `${feet} ft ${inches} in`;
}

export const ResultExportCard = forwardRef<HTMLDivElement, ResultExportCardProps>(function ResultExportCard(
  { dimensions, result },
  ref,
) {
  const rows: { label: string; remainder: number; name?: string; verdict: keyof typeof VERDICT_CLASS }[] = [
    { label: "Dhana", remainder: result.dhanaRuna.dhana, verdict: result.dhanaRuna.favorable ? "auspicious" : "inauspicious" },
    { label: "Runa", remainder: result.dhanaRuna.runa, verdict: result.dhanaRuna.favorable ? "auspicious" : "inauspicious" },
    { label: "Aaya", remainder: result.aaya.remainder, name: result.aaya.name, verdict: result.aaya.verdict },
    { label: "Thithi", remainder: result.thithi.remainder, name: result.thithi.name, verdict: result.thithi.verdict },
    { label: "Vaara", remainder: result.vaara.remainder, name: result.vaara.name, verdict: result.vaara.verdict },
    { label: "Nakshatra", remainder: result.nakshatra.remainder, name: result.nakshatra.name, verdict: result.nakshatra.verdict },
    { label: "Yoga", remainder: result.yoga.remainder, name: result.yoga.name, verdict: result.yoga.verdict },
    { label: "Karana", remainder: result.karana.remainder, name: result.karana.name, verdict: result.karana.verdict },
    { label: "Amsha", remainder: result.amsha.remainder, name: result.amsha.name, verdict: result.amsha.verdict },
    { label: "Ayushya", remainder: result.ayushya.value, verdict: result.ayushya.verdict },
    { label: "Dikpalaka", remainder: result.dikpalaka.remainder, name: result.dikpalaka.name, verdict: result.dikpalaka.verdict },
  ];

  return (
    <div style={{ position: "fixed", top: -100000, left: 0, pointerEvents: "none" }} aria-hidden="true">
      <div
        ref={ref}
        style={{
          width: 1000,
          fontFamily: "Inter, 'Noto Sans Kannada', sans-serif",
          backgroundColor: "#ede7d9",
          color: "#26211b",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #16130f 0%, #5c1f1a 60%, #2b3a55 100%)",
            padding: "40px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#f1e4c7" }}>
              Aaya Nirṇaya · Full reading
            </p>
            <h1 style={{ margin: "8px 0 0", fontFamily: "Fraunces, serif", fontSize: 34, fontWeight: 600, color: "#ede7d9" }}>
              Aaya Nirṇaya Calculator
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "#ede7d9cc" }}>
              Udda {fmt(dimensions.uddaFeet, dimensions.uddaInches)} · Agala{" "}
              {fmt(dimensions.agalaFeet, dimensions.agalaInches)}
            </p>
          </div>
          <MandalaMotif size={64} color="#f1e4c7" />
        </div>

        <div style={{ padding: "32px 48px 8px", display: "flex", gap: 40 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#26211b80" }}>
              Kshetraphala (area)
            </p>
            <p style={{ margin: "4px 0 0", fontFamily: "Fraunces, serif", fontSize: 30, fontWeight: 600, color: "#2b3a55" }}>
              {result.kshetraphala.toLocaleString()} sq ft
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#26211b80" }}>
              Overall reading
            </p>
            <p style={{ margin: "4px 0 0", fontFamily: "Fraunces, serif", fontSize: 30, fontWeight: 600, color: "#a97b2f" }}>
              {result.summary.favorableCount} of {result.summary.totalCount} favorable
            </p>
          </div>
        </div>

        <div style={{ padding: "16px 48px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {rows.map((row) => {
              const colorMap: Record<string, string> = {
                auspicious: "#3f5c3b",
                inauspicious: "#a8431c",
                context: "#be8a2e",
                neutral: "#2b3a55",
              };
              const bgMap: Record<string, string> = {
                auspicious: "#e3e9df",
                inauspicious: "#f3e3d8",
                context: "#f2e6cd",
                neutral: "#dfe3ea",
              };
              return (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #2b3a5522",
                    borderRadius: 10,
                    padding: "10px 16px",
                    backgroundColor: "#f4efe4",
                  }}
                >
                  <span>
                    <strong style={{ fontFamily: "Fraunces, serif", fontSize: 15 }}>{row.label}</strong>
                    <span style={{ fontSize: 13, color: "#26211b80" }}>
                      {" "}
                      · {row.remainder}
                      {row.name ? ` · ${row.name}` : ""}
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: colorMap[row.verdict],
                      backgroundColor: bgMap[row.verdict],
                      borderRadius: 999,
                      padding: "3px 10px",
                    }}
                  >
                    {VERDICT_LABEL[row.verdict]}
                  </span>
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: 28, fontSize: 11, color: "#26211b70", lineHeight: 1.6 }}>
            Traditional calculation aid — not a substitute for a qualified Vaastu consultant, architect, or
            structural engineer. Generated {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}.
          </p>
        </div>
      </div>
    </div>
  );
});
