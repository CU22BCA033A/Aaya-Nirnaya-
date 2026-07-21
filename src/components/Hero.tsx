import { motion } from "framer-motion";
import { TempleSilhouette } from "./TempleArt";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-ink-deep via-maroon/95 to-neela px-4 pb-20 pt-16 text-limewash sm:px-6 sm:pb-28 sm:pt-24 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] opacity-[0.16]">
        <TempleSilhouette className="h-full w-full" color="var(--color-swarna-soft)" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(169,123,47,0.25), transparent 45%), radial-gradient(circle at 85% 0%, rgba(63,92,90,0.2), transparent 40%)",
        }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-swarna-soft"
        >
          ಆಯ ನಿರ್ಣಯ · A Karnataka Vaastu tradition
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
        >
          Aaya Nirṇaya Calculator
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl text-balance text-base text-limewash/80 sm:text-lg"
        >
          Enter a house or plot's Udda (ಉದ್ದ) and Agala (ಅಗಲ) and receive the full eleven-factor
          reading — Dhana, Runa, Aaya, Thithi, Vaara, Nakshatra, Yoga, Karana, Amsha, Ayushya and
          Dikpalaka — before you break ground.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#calculator"
            className="rounded-full bg-swarna px-7 py-3 font-display text-base font-semibold text-ink-deep shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 hover:bg-swarna-soft"
          >
            Begin your reading
          </a>
          <a
            href="#history"
            className="rounded-full border border-limewash/30 px-7 py-3 font-display text-base font-medium text-limewash/90 transition-colors hover:border-limewash/60"
          >
            The tradition
          </a>
        </motion.div>
      </div>
    </section>
  );
}
