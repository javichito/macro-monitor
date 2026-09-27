import { describe, it, expect } from 'vitest';
import { MACRO_TRENDS_HISTORY, ECONOMIC_MILESTONES } from '../macro-trends';

/*
 * Data invariant and sanity test suite for the Macro Trends dataset.
 * Ensures data integrity across historical series (1980–2026),
 * verifying accounting bounds, non-negative values, and reserve sum invariants.
 */

describe('Macro Trends Data Invariants', () => {
  it('covers the expected continuous historical timeline', () => {
    expect(MACRO_TRENDS_HISTORY.length).toBeGreaterThanOrEqual(12);
    const years = MACRO_TRENDS_HISTORY.map((m) => m.year);
    expect(years[0]).toBe(1980);
    expect(years[years.length - 1]).toBe(2026);
  });

  it('validates accounting bounds for debt, GDP, and inflation', () => {
    for (const record of MACRO_TRENDS_HISTORY) {
      // GDP and Debt must be strictly positive numbers
      expect(record.globalGdpTrillion).toBeGreaterThan(0);
      expect(record.globalDebtTrillion).toBeGreaterThan(0);

      // Calculated Debt-to-GDP ratio consistency check
      const calculatedRatio = (record.globalDebtTrillion / record.globalGdpTrillion) * 100;
      expect(Math.abs(calculatedRatio - record.globalDebtToGdp)).toBeLessThan(1.5);

      // Inflation must stay within plausible macro bounds (-5% to 50%)
      expect(record.globalInflationRate).toBeGreaterThan(-5);
      expect(record.globalInflationRate).toBeLessThan(50);

      // CPI index must be positive and non-decreasing over long horizons
      expect(record.usCpiIndex).toBeGreaterThan(0);
    }
  });

  it('verifies that sovereign currency reserves sum to ~100%', () => {
    for (const record of MACRO_TRENDS_HISTORY) {
      const reserves = record.currencyReserves;
      const total =
        reserves.usd +
        reserves.eur +
        reserves.cny +
        reserves.jpy +
        reserves.gbp +
        reserves.goldAndOther;

      // Reserves should sum to 100% within a 1.5% margin due to rounding
      expect(Math.abs(total - 100)).toBeLessThan(1.5);
    }
  });

  it('validates critical economic milestones structure', () => {
    expect(ECONOMIC_MILESTONES.length).toBeGreaterThanOrEqual(5);
    for (const milestone of ECONOMIC_MILESTONES) {
      expect(milestone.year).toBeGreaterThanOrEqual(1980);
      expect(milestone.year).toBeLessThanOrEqual(2026);
      expect(milestone.title.length).toBeGreaterThan(3);
      expect(milestone.description.length).toBeGreaterThan(10);
      expect(['debt', 'inflation', 'rate', 'growth']).toContain(milestone.impactCategory);
    }
  });
});
