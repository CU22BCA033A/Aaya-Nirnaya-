import { MandalaMotif, OrnamentalDivider } from "./TempleArt";

const POINTS = [
  {
    title: "Exact, not approximate",
    body: "Every formula and lookup table is implemented to the source specification and checked by unit tests — including the remainder-0 edge case for every cycle.",
  },
  {
    title: "Nothing hidden",
    body: "The Kshetraphala and every intermediate remainder are shown plainly, so a reading can always be audited by hand against the same tables a consultant would use.",
  },
  {
    title: "Built for iteration",
    body: "Dimensions get adjusted by an inch at a time in real use. The steppers recompute instantly so you can test a few candidate sizes before settling on one.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-limewash px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <MandalaMotif size={40} />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-swarna-deep">About this tool</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            A calculator built to be trusted before you build
          </h2>
          <OrnamentalDivider className="my-6" />
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink/75">
            Aaya Nirṇaya is a real calculation people use before finalizing a house or plot's
            dimensions. We built this so that calculation could be done in seconds instead of by
            hand from paper tables — without changing a single rule of how it's read.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-neela/15 bg-limewash-raised p-6 shadow-sm"
            >
              <h3 className="font-display text-lg font-semibold text-neela">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-kavi/25 bg-kavi-soft/60 p-5 text-sm leading-relaxed text-ink/80">
          <strong className="text-kavi">A note before you rely on a reading:</strong> this
          calculator is a traditional aid, not professional advice. For a decision as significant
          as construction, use it alongside — not instead of — a qualified Vaastu consultant,
          architect, or structural engineer.
        </div>
      </div>
    </section>
  );
}
