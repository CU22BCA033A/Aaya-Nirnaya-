import { useState } from "react";
import { MandalaMotif } from "./TempleArt";

const LINKS = [
  { href: "#calculator", label: "Calculator" },
  { href: "#history", label: "History" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-swarna/20 bg-limewash/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <a href="#top" className="flex items-center gap-2">
          <MandalaMotif size={28} />
          <span className="font-display text-lg font-semibold text-ink">Aaya Nirṇaya</span>
        </a>

        <nav className="hidden items-center gap-8 sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-swarna-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-neela/20 text-neela sm:hidden"
        >
          <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
            {open ? (
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-swarna/15 bg-limewash px-4 py-3 sm:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-ink/75 hover:bg-swarna-soft/60"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
