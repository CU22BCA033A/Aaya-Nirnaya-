import { CycleWheel } from "./CycleWheel";
import { OrnamentalDivider } from "./TempleArt";

const ILLUSTRATIVE_CYCLES = [
  { modulus: 7, segment: 4, label: "Vaara", note: "the 7-day week" },
  { modulus: 9, segment: 2, label: "Amsha", note: "a 9-part cycle" },
  { modulus: 27, segment: 13, label: "Nakshatra", note: "the 27 lunar houses" },
];

export function HistorySection() {
  return (
    <section id="history" className="bg-limewash-raised bg-noise-plaster px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-swarna-deep">
          History &amp; method
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-semibold text-ink sm:text-4xl">
          The tradition behind Aaya Nirṇaya
        </h2>
        <OrnamentalDivider className="my-6" />

        <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-ink/80">
          <p>
            Aaya Nirṇaya belongs to the broader lineage of <em>Vaastu Shastra</em> — India's
            traditional architectural science — which sits alongside classical treatises such as
            the <em>Mānasāra</em> and <em>Bṛhat Saṃhitā</em> that lay out how a site should be
            read, proportioned, and oriented before construction begins. Within that lineage, this
            particular method is practiced in parts of Karnataka, which is why its two core
            measurements keep their Kannada names: <strong>Udda (ಉದ್ದ)</strong>, the length, and{" "}
            <strong>Agala (ಅಗಲ)</strong>, the width.
          </p>
          <p>
            Its logic borrows directly from the <em>Pañcāṅga</em>, the traditional Hindu almanac,
            whose five limbs — <em>Thithi</em>, <em>Vaara</em>, <em>Nakshatra</em>, <em>Yoga</em>{" "}
            and <em>Karana</em> — are the same five factors consulted to fix an auspicious moment
            (<em>muhūrta</em>) for a wedding or a housewarming. Aaya Nirṇaya applies that same
            reasoning to a plot rather than a moment: a building's area, or{" "}
            <em>Kshetraphala</em>, is treated as a number and passed through a sequence of
            fixed-length cycles, much as a date is reduced to a weekday or a lunar mansion.
          </p>

          <div className="my-4 flex items-center justify-center gap-6 rounded-2xl border border-swarna/15 bg-limewash py-6 sm:gap-10">
            {ILLUSTRATIVE_CYCLES.map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2">
                <CycleWheel modulus={c.modulus} landingSegment={c.segment} verdict="neutral" size={64} />
                <span className="text-xs font-medium text-ink/60">
                  {c.label} <span className="text-ink/40">— {c.note}</span>
                </span>
              </div>
            ))}
          </div>

          <p>
            In practice, Vaastu consultants and site owners have long treated the result as a
            check rather than a verdict handed down once: if a dimension lands on an unfavorable
            factor, the convention is simply to nudge the length or width by an inch and read the
            wheel again — the same iterative habit this calculator's steppers are built around.
          </p>
          <p>
            That habit is also why we show the working, not just the outcome. The Kshetraphala and
            every intermediate remainder stay visible on screen, so the reading can be checked by
            hand against the same tables a traditional consultant would use.
          </p>
        </div>
      </div>
    </section>
  );
}
