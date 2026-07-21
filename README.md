# Aaya Nirṇaya Calculator

A single-page calculator for the traditional Aaya Nirṇaya reading: enter a
house/plot's Udda (ಉದ್ದ, height/length) and Agala (ಅಗಲ, width) in feet and
inches, and get the eleven numerological factors — Dhana, Runa, Aaya, Thithi,
Vaara, Nakshatra, Yoga, Karana, Amsha, Ayushya, and Dikpalaka — with verdicts
and a scannable summary.

## Stack

React + Vite + TypeScript, Tailwind CSS, Framer Motion. All calculation logic
lives in `src/lib/calculations.ts`, a pure module with no UI dependencies,
covered by unit tests in `src/lib/calculations.test.ts`.

## Development

```sh
npm install
npm run dev      # start the dev server
npm test         # run the calculation unit tests
npm run build    # type-check and build for production
```

## Structure

```
src/
  lib/calculations.ts       calculation engine + lookup tables
  lib/calculations.test.ts  unit tests
  lib/verdict.ts            shared verdict → color/label/icon mapping
  components/InputPanel.tsx   Udda/Agala inputs with steppers
  components/SummaryCard.tsx  Kshetraphala + favorable-count headline
  components/ResultCard.tsx   per-factor result card
  components/CycleWheel.tsx   SVG cycle-dial visualization
  App.tsx
```
