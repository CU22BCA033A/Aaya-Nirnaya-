import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InputPanel } from "./components/InputPanel";
import { SummaryCard } from "./components/SummaryCard";
import { DhanaRunaCard, ResultCard } from "./components/ResultCard";
import { computeAayaNirnaya, type AayaNirnayaResult, type RawDimensions } from "./lib/calculations";

const STORAGE_KEY = "aaya-nirnaya:dimensions";

const DEFAULT_DIMENSIONS: RawDimensions = { uddaFeet: 0, uddaInches: 0, agalaFeet: 0, agalaInches: 0 };

function loadStoredDimensions(): RawDimensions {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DIMENSIONS;
    const parsed = JSON.parse(raw) as Partial<RawDimensions>;
    if (
      typeof parsed.uddaFeet === "number" &&
      typeof parsed.uddaInches === "number" &&
      typeof parsed.agalaFeet === "number" &&
      typeof parsed.agalaInches === "number"
    ) {
      return parsed as RawDimensions;
    }
  } catch {
    // malformed storage — fall through to defaults
  }
  return DEFAULT_DIMENSIONS;
}

function isValid(d: RawDimensions): boolean {
  return (d.uddaFeet > 0 || d.uddaInches > 0) && (d.agalaFeet > 0 || d.agalaInches > 0);
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function thithiDescription(verdict: string): string {
  return verdict === "inauspicious"
    ? "Falls on an inauspicious thithi for starting construction."
    : "Falls on a favorable thithi for starting construction.";
}

function nakshatraDescription(verdict: string): string {
  return verdict === "auspicious"
    ? "A favorable nakshatra for construction timing."
    : "Not counted among the favorable nakshatras for construction timing.";
}

function yogaDescription(verdict: string): string {
  return verdict === "auspicious" ? "A favorable yoga." : "Falls among the inauspicious yogas.";
}

function karanaDescription(verdict: string): string {
  return verdict === "auspicious"
    ? "Falls among the first five, favorable karanas."
    : "Falls outside the favorable karanas.";
}

export default function App() {
  const [initialDimensions] = useState<RawDimensions>(loadStoredDimensions);
  const [result, setResult] = useState<AayaNirnayaResult | null>(() =>
    isValid(initialDimensions) ? computeAayaNirnaya(initialDimensions) : null,
  );
  const [revealKey, setRevealKey] = useState(0);

  function handleChange(dimensions: RawDimensions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dimensions));
  }

  function handleCalculate(dimensions: RawDimensions) {
    if (!isValid(dimensions)) {
      setResult(null);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dimensions));
    setResult(computeAayaNirnaya(dimensions));
    setRevealKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-limewash px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neela/70">Aaya Nirṇaya</p>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Aaya Nirṇaya calculator</h1>
          <p className="max-w-2xl text-sm text-ink/60">
            Enter Udda and Agala in feet and inches to work out the eleven traditional factors before construction.
          </p>
        </header>

        <section className="rounded-2xl border border-neela/15 bg-limewash-raised p-5 shadow-sm sm:p-7">
          <InputPanel defaultValues={initialDimensions} onChange={handleChange} onCalculate={handleCalculate} />
        </section>

        <AnimatePresence mode="wait">
          {result && (
            <motion.section
              key={revealKey}
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="flex flex-col gap-6"
              aria-label="Aaya Nirṇaya results"
            >
              <SummaryCard result={result} />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <DhanaRunaCard
                    index={1}
                    dhana={result.dhanaRuna.dhana}
                    runa={result.dhanaRuna.runa}
                    favorable={result.dhanaRuna.favorable}
                  />
                </div>

                <ResultCard
                  index={2}
                  name="Aaya"
                  modulus={8}
                  remainder={result.aaya.remainder}
                  resultName={result.aaya.name}
                  verdict={result.aaya.verdict}
                  description={result.aaya.note}
                />

                <ResultCard
                  index={3}
                  name="Thithi"
                  modulus={15}
                  remainder={result.thithi.remainder}
                  resultName={result.thithi.name}
                  verdict={result.thithi.verdict}
                  description={thithiDescription(result.thithi.verdict)}
                />

                <ResultCard
                  index={4}
                  name="Vaara"
                  gloss={result.vaara.day}
                  modulus={7}
                  remainder={result.vaara.remainder}
                  resultName={result.vaara.name}
                  verdict={result.vaara.verdict}
                  description={result.vaara.effect}
                />

                <ResultCard
                  index={5}
                  name="Nakshatra"
                  modulus={27}
                  remainder={result.nakshatra.remainder}
                  resultName={result.nakshatra.name}
                  verdict={result.nakshatra.verdict}
                  description={nakshatraDescription(result.nakshatra.verdict)}
                />

                <ResultCard
                  index={6}
                  name="Yoga"
                  modulus={27}
                  remainder={result.yoga.remainder}
                  resultName={result.yoga.name}
                  verdict={result.yoga.verdict}
                  description={yogaDescription(result.yoga.verdict)}
                />

                <ResultCard
                  index={7}
                  name="Karana"
                  modulus={11}
                  remainder={result.karana.remainder}
                  resultName={result.karana.name}
                  verdict={result.karana.verdict}
                  description={karanaDescription(result.karana.verdict)}
                />

                <ResultCard
                  index={8}
                  name="Amsha"
                  modulus={9}
                  remainder={result.amsha.remainder}
                  resultName={result.amsha.name}
                  verdict={result.amsha.verdict}
                  description={result.amsha.effect}
                />

                <ResultCard
                  index={9}
                  name="Ayushya"
                  gloss="lifespan score"
                  modulus={120}
                  remainder={result.ayushya.value}
                  verdict={result.ayushya.verdict}
                  description={`Score of ${result.ayushya.value} out of 120. Above 60 is considered beneficial.`}
                />

                <ResultCard
                  index={10}
                  name="Dikpalaka"
                  modulus={8}
                  remainder={result.dikpalaka.remainder}
                  resultName={result.dikpalaka.name}
                  verdict={result.dikpalaka.verdict}
                  description={result.dikpalaka.effect}
                  meta="Derived from Ayushya (mod 8), not directly from Kshetraphala."
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
