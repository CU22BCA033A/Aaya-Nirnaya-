import { describe, expect, it } from "vitest";
import {
  AAYA_TYPES,
  AMSHA,
  AMSHA_INAUSPICIOUS,
  DIKPALAKA,
  DIKPALAKA_INAUSPICIOUS,
  KARANA_AUSPICIOUS,
  KARANA_NAMES,
  NAKSHATRA_AUSPICIOUS,
  NAKSHATRA_NAMES,
  THITHI_INAUSPICIOUS,
  THITHI_NAMES,
  VAARA,
  VAARA_INAUSPICIOUS,
  YOGA_INAUSPICIOUS,
  YOGA_NAMES,
  computeAayaNirnaya,
  computeKshetraphala,
  mod,
  normalizeFeetInches,
  toDecimalFeet,
} from "./calculations";

/** Builds dimensions whose Kshetraphala rounds to exactly K (K ft x 1 ft). */
function dimsForK(K: number): { uddaFeet: number; uddaInches: number; agalaFeet: number; agalaInches: number } {
  return { uddaFeet: K, uddaInches: 0, agalaFeet: 1, agalaInches: 0 };
}

describe("mod", () => {
  it("behaves like standard remainder for positive inputs", () => {
    expect(mod(10, 3)).toBe(1);
    expect(mod(9, 3)).toBe(0);
  });

  it("never returns negative results for negative dividends", () => {
    expect(mod(-1, 8)).toBe(7);
    expect(mod(-8, 8)).toBe(0);
  });
});

describe("toDecimalFeet / computeKshetraphala", () => {
  it("converts feet+inches to decimal feet", () => {
    expect(toDecimalFeet(10, 6)).toBeCloseTo(10.5);
    expect(toDecimalFeet(5, 0)).toBe(5);
  });

  it("computes exact area for whole-foot dimensions", () => {
    expect(computeKshetraphala(10, 0, 20, 0)).toBe(200);
  });

  it("rounds fractional area to the nearest integer", () => {
    // 10 ft 7 in x 20 ft 0 in = 10.58333.. x 20 = 211.666.. -> 212
    expect(computeKshetraphala(10, 7, 20, 0)).toBe(212);
  });
});

describe("normalizeFeetInches", () => {
  it("leaves valid values untouched", () => {
    expect(normalizeFeetInches(41, 6)).toEqual({ feet: 41, inches: 6, adjusted: false });
  });

  it("carries inches >= 12 over into feet", () => {
    expect(normalizeFeetInches(40, 12)).toEqual({ feet: 41, inches: 0, adjusted: true });
    expect(normalizeFeetInches(40, 25)).toEqual({ feet: 42, inches: 1, adjusted: true });
  });
});

describe("computeAayaNirnaya — worked example (Kshetraphala = 1247)", () => {
  const result = computeAayaNirnaya(dimsForK(1247));

  it("computes Kshetraphala", () => {
    expect(result.kshetraphala).toBe(1247);
  });

  it("Dhana/Runa: 4 vs 5 -> not favorable", () => {
    expect(result.dhanaRuna).toEqual({ dhana: 4, runa: 5, favorable: false });
  });

  it("Aaya: remainder 7 -> Ghajaya, auspicious", () => {
    expect(result.aaya.remainder).toBe(7);
    expect(result.aaya.name).toBe("Ghajaya");
    expect(result.aaya.verdict).toBe("auspicious");
  });

  it("Thithi: remainder 1 -> Pratipada, inauspicious", () => {
    expect(result.thithi.remainder).toBe(1);
    expect(result.thithi.name).toBe("Pratipada (Prathama)");
    expect(result.thithi.verdict).toBe("inauspicious");
  });

  it("Vaara: remainder 2 -> Somavara, auspicious", () => {
    expect(result.vaara.remainder).toBe(2);
    expect(result.vaara.name).toBe("Somavara (ಸೋಮವಾರ)");
    expect(result.vaara.day).toBe("Monday");
    expect(result.vaara.verdict).toBe("auspicious");
  });

  it("Nakshatra: remainder 13 -> Hasta, auspicious", () => {
    expect(result.nakshatra.remainder).toBe(13);
    expect(result.nakshatra.name).toBe("Hasta");
    expect(result.nakshatra.verdict).toBe("auspicious");
  });

  it("Yoga: remainder 20 -> Shiva, auspicious", () => {
    expect(result.yoga.remainder).toBe(20);
    expect(result.yoga.name).toBe("Shiva");
    expect(result.yoga.verdict).toBe("auspicious");
  });

  it("Karana: remainder 9 -> Chatushpada, inauspicious", () => {
    expect(result.karana.remainder).toBe(9);
    expect(result.karana.name).toBe("Chatushpada");
    expect(result.karana.verdict).toBe("inauspicious");
  });

  it("Amsha: remainder 3 -> Sampath, auspicious", () => {
    expect(result.amsha.remainder).toBe(3);
    expect(result.amsha.name).toBe("Sampath");
    expect(result.amsha.verdict).toBe("auspicious");
  });

  it("Ayushya: 63 -> beneficial (>60)", () => {
    expect(result.ayushya.value).toBe(63);
    expect(result.ayushya.verdict).toBe("auspicious");
  });

  it("Dikpalaka: derived from Ayushya (63 mod 8 = 7) -> Kubera, auspicious", () => {
    expect(result.dikpalaka.remainder).toBe(7);
    expect(result.dikpalaka.name).toBe("Kubera");
    expect(result.dikpalaka.verdict).toBe("auspicious");
  });

  it("summary counts favorable factors out of 11 (Aaya is not the context case here)", () => {
    expect(result.summary.totalCount).toBe(11);
    expect(result.summary.aayaIsContext).toBe(false);
    // favorable: aaya, vaara, nakshatra, yoga, amsha, ayushya, dikpalaka = 7
    // unfavorable: dhana, runa, thithi, karana = 4
    expect(result.summary.favorableCount).toBe(7);
  });
});

describe("Dikpalaka depends on Ayushya, not directly on Kshetraphala", () => {
  it("uses the Ayushya value as the mod-8 input", () => {
    const result = computeAayaNirnaya(dimsForK(50));
    expect(result.ayushya.value).toBe(90);
    expect(result.dikpalaka.remainder).toBe(mod(result.ayushya.value, 8));
    expect(result.dikpalaka.remainder).toBe(2);
    expect(result.dikpalaka.name).toBe("Agni");
    expect(result.dikpalaka.verdict).toBe("inauspicious");
  });

  it("boundary: Ayushya exactly 60 is NOT beneficial (rule is strictly > 60)", () => {
    const result = computeAayaNirnaya(dimsForK(100));
    expect(result.ayushya.value).toBe(60);
    expect(result.ayushya.verdict).toBe("inauspicious");
  });
});

describe("Aaya context case (Simha)", () => {
  it("K=27 -> aaya remainder 3 -> Simha, context verdict excluded from favorable denominator", () => {
    const result = computeAayaNirnaya(dimsForK(27));
    expect(result.aaya.remainder).toBe(3);
    expect(result.aaya.name).toBe("Simha");
    expect(result.aaya.verdict).toBe("context");
    expect(result.summary.aayaIsContext).toBe(true);
    expect(result.summary.totalCount).toBe(10);
  });
});

describe("remainder-0 edge cases for every modulus", () => {
  it("Dhana mod 12 = 0 (K=12)", () => {
    expect(computeAayaNirnaya(dimsForK(12)).dhanaRuna.dhana).toBe(0);
  });

  it("Runa mod 8 = 0 (K=8)", () => {
    expect(computeAayaNirnaya(dimsForK(8)).dhanaRuna.runa).toBe(0);
  });

  it("Aaya mod 8 = 0 (K=8) -> Kaka, inauspicious", () => {
    const result = computeAayaNirnaya(dimsForK(8));
    expect(result.aaya.remainder).toBe(0);
    expect(result.aaya.name).toBe(AAYA_TYPES[0].name);
    expect(result.aaya.name).toBe("Kaka");
    expect(result.aaya.verdict).toBe("inauspicious");
  });

  it("Thithi mod 15 = 0 (K=15) -> Purnima/Amavasya, inauspicious", () => {
    const result = computeAayaNirnaya(dimsForK(15));
    expect(result.thithi.remainder).toBe(0);
    expect(result.thithi.name).toBe(THITHI_NAMES[0]);
    expect(THITHI_INAUSPICIOUS.has(0)).toBe(true);
    expect(result.thithi.verdict).toBe("inauspicious");
  });

  it("Vaara mod 7 = 0 (K=7) -> Shanivara, inauspicious", () => {
    const result = computeAayaNirnaya(dimsForK(7));
    expect(result.vaara.remainder).toBe(0);
    expect(result.vaara.name).toBe(VAARA[0].name);
    expect(result.vaara.day).toBe("Saturday");
    expect(VAARA_INAUSPICIOUS.has(0)).toBe(true);
    expect(result.vaara.verdict).toBe("inauspicious");
  });

  it("Nakshatra mod 27 = 0 (K=27) -> Revati, auspicious", () => {
    const result = computeAayaNirnaya(dimsForK(27));
    expect(result.nakshatra.remainder).toBe(0);
    expect(result.nakshatra.name).toBe(NAKSHATRA_NAMES[0]);
    expect(result.nakshatra.name).toBe("Revati");
    expect(NAKSHATRA_AUSPICIOUS.has(0)).toBe(true);
    expect(result.nakshatra.verdict).toBe("auspicious");
  });

  it("Yoga mod 27 = 0 (K=27) -> Vaidhriti, inauspicious", () => {
    const result = computeAayaNirnaya(dimsForK(27));
    expect(result.yoga.remainder).toBe(0);
    expect(result.yoga.name).toBe(YOGA_NAMES[0]);
    expect(result.yoga.name).toBe("Vaidhriti");
    expect(YOGA_INAUSPICIOUS.has(0)).toBe(true);
    expect(result.yoga.verdict).toBe("inauspicious");
  });

  it("Karana mod 11 = 0 (K=11) -> Kimstughna, inauspicious", () => {
    const result = computeAayaNirnaya(dimsForK(11));
    expect(result.karana.remainder).toBe(0);
    expect(result.karana.name).toBe(KARANA_NAMES[0]);
    expect(result.karana.name).toBe("Kimstughna");
    expect(KARANA_AUSPICIOUS.has(0)).toBe(false);
    expect(result.karana.verdict).toBe("inauspicious");
  });

  it("Amsha mod 9 = 0 (K=9) -> Santosha, auspicious", () => {
    const result = computeAayaNirnaya(dimsForK(9));
    expect(result.amsha.remainder).toBe(0);
    expect(result.amsha.name).toBe(AMSHA[0].name);
    expect(result.amsha.name).toBe("Santosha");
    expect(AMSHA_INAUSPICIOUS.has(0)).toBe(false);
    expect(result.amsha.verdict).toBe("auspicious");
  });

  it("Ayushya mod 120 = 0 (K=120) -> not beneficial", () => {
    const result = computeAayaNirnaya(dimsForK(120));
    expect(result.ayushya.value).toBe(0);
    expect(result.ayushya.verdict).toBe("inauspicious");
  });

  it("Dikpalaka mod 8 = 0 (Ayushya=0 at K=120) -> Ishanya, auspicious", () => {
    const result = computeAayaNirnaya(dimsForK(120));
    expect(result.dikpalaka.remainder).toBe(0);
    expect(result.dikpalaka.name).toBe(DIKPALAKA[0].name);
    expect(result.dikpalaka.name).toBe("Ishanya");
    expect(DIKPALAKA_INAUSPICIOUS.has(0)).toBe(false);
    expect(result.dikpalaka.verdict).toBe("auspicious");
  });
});
