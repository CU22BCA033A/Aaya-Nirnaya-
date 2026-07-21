/**
 * Aaya Nirṇaya calculation engine.
 *
 * Pure, dependency-free module — no React/DOM. Implements the eleven
 * traditional numerological factors derived from a house/plot's Udda
 * (height/length) and Agala (width) dimensions, per the source tables
 * and verdict rules of the Aaya Nirṇaya system.
 */

export type Verdict = "auspicious" | "inauspicious" | "context" | "neutral";

export interface RawDimensions {
  uddaFeet: number;
  uddaInches: number;
  agalaFeet: number;
  agalaInches: number;
}

export interface NormalizedValue {
  feet: number;
  inches: number;
  adjusted: boolean;
}

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function toDecimalFeet(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return totalInches / 12;
}

/** Carries inches ≥ 12 (or < 0) over into feet, flagging when it adjusted the value. */
export function normalizeFeetInches(feet: number, inches: number): NormalizedValue {
  const totalInches = feet * 12 + inches;
  const newFeet = Math.floor(totalInches / 12);
  const newInches = mod(totalInches, 12);
  return {
    feet: newFeet,
    inches: newInches,
    adjusted: newFeet !== feet || newInches !== inches,
  };
}

export function computeKshetraphala(
  uddaFeet: number,
  uddaInches: number,
  agalaFeet: number,
  agalaInches: number,
): number {
  const udda = toDecimalFeet(uddaFeet, uddaInches);
  const agala = toDecimalFeet(agalaFeet, agalaInches);
  const areaSqFt = udda * agala;
  return Math.round(areaSqFt);
}

// ---------------------------------------------------------------------------
// Lookup tables (§3.4) — kept as data, not inlined magic numbers.
// ---------------------------------------------------------------------------

export interface AayaType {
  name: string;
  verdict: Verdict;
  note: string;
}

export const AAYA_TYPES: Record<number, AayaType> = {
  1: { name: "Dhwajaya", verdict: "auspicious", note: "Auspicious for house & commercial buildings." },
  2: { name: "Dhumraya", verdict: "inauspicious", note: "Not auspicious for house & commercial buildings." },
  3: {
    name: "Simha",
    verdict: "context",
    note: "Auspicious for temples & convention halls specifically — not classed auspicious for standard house/commercial use.",
  },
  4: { name: "Shwana", verdict: "inauspicious", note: "Not auspicious for house & commercial buildings." },
  5: { name: "Vrushabhaya", verdict: "auspicious", note: "Auspicious for house & commercial buildings." },
  6: { name: "Khara", verdict: "inauspicious", note: "Not auspicious for house & commercial buildings." },
  7: { name: "Ghajaya", verdict: "auspicious", note: "Auspicious for house & commercial buildings." },
  0: { name: "Kaka", verdict: "inauspicious", note: "Not auspicious for house & commercial buildings." },
};

export const THITHI_NAMES: Record<number, string> = {
  1: "Pratipada (Prathama)", 2: "Dwitiya", 3: "Tritiya", 4: "Chaturthi",
  5: "Panchami", 6: "Shashthi", 7: "Saptami", 8: "Ashtami", 9: "Navami",
  10: "Dashami", 11: "Ekadashi", 12: "Dwadashi", 13: "Trayodashi",
  14: "Chaturdashi", 0: "Purnima (Shukla Paksha) / Amavasya (Krishna Paksha)",
};
export const THITHI_INAUSPICIOUS = new Set([0, 1, 4, 8, 9, 14]);

export interface VaaraEntry {
  name: string;
  day: string;
  effect: string;
}

export const VAARA: Record<number, VaaraEntry> = {
  1: { name: "Bhanuvara (ಭಾನುವಾರ)", day: "Sunday", effect: "Agni Bhaya — fear of fire / fire-related risk" },
  2: { name: "Somavara (ಸೋಮವಾರ)", day: "Monday", effect: "Vṛddhi — growth, development, prosperity" },
  3: { name: "Mangalavara (ಮಂಗಳವಾರ)", day: "Tuesday", effect: "Naṣṭa — loss, obstacles, setbacks" },
  4: { name: "Budhavara (ಬುಧವಾರ)", day: "Wednesday", effect: "Aiśwarya Prāpti — gain of wealth, prosperity" },
  5: { name: "Guruvara (ಗುರುವಾರ)", day: "Thursday", effect: "Most auspicious — favorable for all activities" },
  6: { name: "Shukravara (ಶುಕ್ರವಾರ)", day: "Friday", effect: "Santāna Vṛddhi — growth of family, progeny" },
  0: { name: "Shanivara (ಶನಿವಾರ)", day: "Saturday", effect: "Neutral" },
};
export const VAARA_INAUSPICIOUS = new Set([0, 1, 3]);

export const NAKSHATRA_NAMES: Record<number, string> = {
  1: "Ashwini", 2: "Bharani", 3: "Krittika", 4: "Rohini", 5: "Mrigashira", 6: "Ardra",
  7: "Punarvasu", 8: "Pushya", 9: "Ashlesha", 10: "Magha", 11: "Purva Phalguni",
  12: "Uttara Phalguni", 13: "Hasta", 14: "Chitra", 15: "Swati", 16: "Vishakha",
  17: "Anuradha", 18: "Jyeshtha", 19: "Mula", 20: "Purva Ashadha", 21: "Uttara Ashadha",
  22: "Shravana", 23: "Dhanishta", 24: "Shatabhisha", 25: "Purva Bhadrapada",
  26: "Uttara Bhadrapada", 0: "Revati",
};
export const NAKSHATRA_AUSPICIOUS = new Set([4, 5, 8, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 0]);

export const YOGA_NAMES: Record<number, string> = {
  1: "Vishkambha", 2: "Priti", 3: "Ayushman", 4: "Saubhagya", 5: "Shobhana",
  6: "Atiganda", 7: "Sukarma", 8: "Dhriti", 9: "Shoola", 10: "Ganda", 11: "Vriddhi",
  12: "Dhruva", 13: "Vyaghata", 14: "Harshana", 15: "Vajra", 16: "Siddhi",
  17: "Vyatipata", 18: "Variyana", 19: "Parigha", 20: "Shiva", 21: "Siddha",
  22: "Sadhya", 23: "Shubha", 24: "Shukla", 25: "Brahma", 26: "Indra", 0: "Vaidhriti",
};
export const YOGA_INAUSPICIOUS = new Set([1, 6, 9, 10, 13, 15, 17, 19, 0]);

export const KARANA_NAMES: Record<number, string> = {
  1: "Bava", 2: "Balava", 3: "Kaulava", 4: "Taitila", 5: "Gara", 6: "Vanija",
  7: "Vishti (Bhadra)", 8: "Shakuni", 9: "Chatushpada", 10: "Naga", 0: "Kimstughna",
};
export const KARANA_AUSPICIOUS = new Set([1, 2, 3, 4, 5]);

export interface AmshaEntry {
  name: string;
  effect: string;
}

export const AMSHA: Record<number, AmshaEntry> = {
  1: { name: "Nasha", effect: "Loss" },
  2: { name: "Vṛddhi", effect: "Development / Growth" },
  3: { name: "Sampath", effect: "Wealth / Prosperity" },
  4: { name: "Dukha", effect: "Sorrow" },
  5: { name: "Marana", effect: "Death" },
  6: { name: "Chora", effect: "Theft / Loss by theft" },
  7: { name: "Santanabhivrudhi", effect: "Progeny development / growth of family" },
  8: { name: "Pashu Abhivrudhi", effect: "Livestock development / increase in cattle" },
  0: { name: "Santosha", effect: "Happiness / Joy" },
};
export const AMSHA_INAUSPICIOUS = new Set([1, 4, 5, 6]);

export interface DikpalakaEntry {
  name: string;
  effect: string;
}

export const DIKPALAKA: Record<number, DikpalakaEntry> = {
  1: { name: "Indra", effect: "Sowbhagya (luck)" },
  2: { name: "Agni", effect: "Fear of fire" },
  3: { name: "Yama", effect: "Arishta (bad luck)" },
  4: { name: "Nairuthya", effect: "Fear of enemies" },
  5: { name: "Varuna", effect: "Increase in livestock" },
  6: { name: "Vayuvya", effect: "Brashta (corrupt)" },
  7: { name: "Kubera", effect: "Wealth and treasure" },
  0: { name: "Ishanya", effect: "Mahashubha (most blessed)" },
};
export const DIKPALAKA_INAUSPICIOUS = new Set([2, 3, 4, 6]);

// ---------------------------------------------------------------------------
// Per-factor result shapes
// ---------------------------------------------------------------------------

export interface DhanaRunaResult {
  dhana: number;
  runa: number;
  favorable: boolean; // Dhana > Runa
}

export interface AayaResult {
  remainder: number;
  name: string;
  verdict: Verdict;
  note: string;
}

export interface ThithiResult {
  remainder: number;
  name: string;
  verdict: Verdict;
}

export interface VaaraResult {
  remainder: number;
  name: string;
  day: string;
  effect: string;
  verdict: Verdict;
}

export interface NakshatraResult {
  remainder: number;
  name: string;
  verdict: Verdict;
}

export interface YogaResult {
  remainder: number;
  name: string;
  verdict: Verdict;
}

export interface KaranaResult {
  remainder: number;
  name: string;
  verdict: Verdict;
}

export interface AmshaResult {
  remainder: number;
  name: string;
  effect: string;
  verdict: Verdict;
}

export interface AyushyaResult {
  value: number;
  verdict: Verdict;
}

export interface DikpalakaResult {
  remainder: number;
  name: string;
  effect: string;
  verdict: Verdict;
}

export interface SummaryFactor {
  key: string;
  label: string;
  verdict: Verdict;
}

export interface AayaNirnayaResult {
  kshetraphala: number;
  dhanaRuna: DhanaRunaResult;
  aaya: AayaResult;
  thithi: ThithiResult;
  vaara: VaaraResult;
  nakshatra: NakshatraResult;
  yoga: YogaResult;
  karana: KaranaResult;
  amsha: AmshaResult;
  ayushya: AyushyaResult;
  dikpalaka: DikpalakaResult;
  summary: {
    factors: SummaryFactor[];
    favorableCount: number;
    totalCount: number;
    aayaIsContext: boolean;
  };
}

export function computeAayaNirnaya(dimensions: RawDimensions): AayaNirnayaResult {
  const { uddaFeet, uddaInches, agalaFeet, agalaInches } = dimensions;
  const K = computeKshetraphala(uddaFeet, uddaInches, agalaFeet, agalaInches);

  const dhana = mod(K * 8, 12);
  const runa = mod(K * 3, 8);
  const aayaRemainder = mod(K * 9, 8);
  const thithiRemainder = mod(K * 8, 15);
  const vaaraRemainder = mod(K * 9, 7);
  const nakshatraRemainder = mod(K * 8, 27);
  const yogaRemainder = mod(K * 4, 27);
  const karanaRemainder = mod(K * 5, 11);
  const amshaRemainder = mod(K * 6, 9);
  const ayushyaValue = mod(K * 9, 120);
  const dikpalakaRemainder = mod(ayushyaValue, 8);

  const dhanaRuna: DhanaRunaResult = {
    dhana,
    runa,
    favorable: dhana > runa,
  };

  const aayaType = AAYA_TYPES[aayaRemainder];
  const aaya: AayaResult = {
    remainder: aayaRemainder,
    name: aayaType.name,
    verdict: aayaType.verdict,
    note: aayaType.note,
  };

  const thithi: ThithiResult = {
    remainder: thithiRemainder,
    name: THITHI_NAMES[thithiRemainder],
    verdict: THITHI_INAUSPICIOUS.has(thithiRemainder) ? "inauspicious" : "auspicious",
  };

  const vaaraEntry = VAARA[vaaraRemainder];
  const vaara: VaaraResult = {
    remainder: vaaraRemainder,
    name: vaaraEntry.name,
    day: vaaraEntry.day,
    effect: vaaraEntry.effect,
    verdict: VAARA_INAUSPICIOUS.has(vaaraRemainder) ? "inauspicious" : "auspicious",
  };

  const nakshatra: NakshatraResult = {
    remainder: nakshatraRemainder,
    name: NAKSHATRA_NAMES[nakshatraRemainder],
    verdict: NAKSHATRA_AUSPICIOUS.has(nakshatraRemainder) ? "auspicious" : "inauspicious",
  };

  const yoga: YogaResult = {
    remainder: yogaRemainder,
    name: YOGA_NAMES[yogaRemainder],
    verdict: YOGA_INAUSPICIOUS.has(yogaRemainder) ? "inauspicious" : "auspicious",
  };

  const karana: KaranaResult = {
    remainder: karanaRemainder,
    name: KARANA_NAMES[karanaRemainder],
    verdict: KARANA_AUSPICIOUS.has(karanaRemainder) ? "auspicious" : "inauspicious",
  };

  const amshaEntry = AMSHA[amshaRemainder];
  const amsha: AmshaResult = {
    remainder: amshaRemainder,
    name: amshaEntry.name,
    effect: amshaEntry.effect,
    verdict: AMSHA_INAUSPICIOUS.has(amshaRemainder) ? "inauspicious" : "auspicious",
  };

  const ayushya: AyushyaResult = {
    value: ayushyaValue,
    verdict: ayushyaValue > 60 ? "auspicious" : "inauspicious",
  };

  const dikpalakaEntry = DIKPALAKA[dikpalakaRemainder];
  const dikpalaka: DikpalakaResult = {
    remainder: dikpalakaRemainder,
    name: dikpalakaEntry.name,
    effect: dikpalakaEntry.effect,
    verdict: DIKPALAKA_INAUSPICIOUS.has(dikpalakaRemainder) ? "inauspicious" : "auspicious",
  };

  // Dhana and Runa share one comparative verdict (§3.5 rule 1); both of the
  // 11 named factors carry that same verdict into the favorable count.
  const dhanaRunaVerdict: Verdict = dhanaRuna.favorable ? "auspicious" : "inauspicious";

  const factors: SummaryFactor[] = [
    { key: "dhana", label: "Dhana", verdict: dhanaRunaVerdict },
    { key: "runa", label: "Runa", verdict: dhanaRunaVerdict },
    { key: "aaya", label: "Aaya", verdict: aaya.verdict },
    { key: "thithi", label: "Thithi", verdict: thithi.verdict },
    { key: "vaara", label: "Vaara", verdict: vaara.verdict },
    { key: "nakshatra", label: "Nakshatra", verdict: nakshatra.verdict },
    { key: "yoga", label: "Yoga", verdict: yoga.verdict },
    { key: "karana", label: "Karana", verdict: karana.verdict },
    { key: "amsha", label: "Amsha", verdict: amsha.verdict },
    { key: "ayushya", label: "Ayushya", verdict: ayushya.verdict },
    { key: "dikpalaka", label: "Dikpalaka", verdict: dikpalaka.verdict },
  ];

  const countable = factors.filter((f) => f.verdict !== "context");
  const favorableCount = countable.filter((f) => f.verdict === "auspicious").length;

  return {
    kshetraphala: K,
    dhanaRuna,
    aaya,
    thithi,
    vaara,
    nakshatra,
    yoga,
    karana,
    amsha,
    ayushya,
    dikpalaka,
    summary: {
      factors,
      favorableCount,
      totalCount: countable.length,
      aayaIsContext: aaya.verdict === "context",
    },
  };
}
