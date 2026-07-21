import { MandalaMotif } from "./TempleArt";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-swarna/20 bg-ink-deep text-limewash/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <MandalaMotif size={24} color="var(--color-swarna-soft)" />
            <span className="font-display text-base font-semibold text-limewash">Aaya Nirṇaya Calculator</span>
          </div>
          <nav className="flex gap-6 text-sm">
            <a href="#calculator" className="hover:text-swarna-soft">Calculator</a>
            <a href="#history" className="hover:text-swarna-soft">History</a>
            <a href="#about" className="hover:text-swarna-soft">About</a>
          </nav>
        </div>

        <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-limewash/50 sm:mx-0 sm:text-left">
          This tool follows a traditional numerological method used ahead of construction in parts
          of Karnataka. It is offered as a calculation aid alongside — not a replacement for —
          guidance from a qualified Vaastu consultant, architect, or structural engineer.
        </p>

        <p className="text-center text-xs text-limewash/40 sm:text-left">
          © {year} Aaya Nirṇaya Calculator. Built to honor the tradition it calculates.
        </p>
      </div>
    </footer>
  );
}
