import { describe, it, expect } from 'vitest';
import { GLOBAL_ASSET_HISTORY } from '../asset-breakdown';
import { adjustValue } from '../../lib/formatters';

/*
 * Unit tests validating asset breakdown mathematical integrity,
 * sub-sector reconciliations, zero-NaN normalizations, and currency calculations.
 */

describe('Asset Breakdown Longitudinal Data Pipeline', () => {
  it('defines all 12 timeline intervals in chronological order', () => {
    expect(GLOBAL_ASSET_HISTORY.length).toBe(12);
    const expectedYears = [1980, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2022, 2024, 2025, 2026];
    const actualYears = GLOBAL_ASSET_HISTORY.map((entry) => entry.year);
    expect(actualYears).toEqual(expectedYears);
  });

  it('contains expected category counts (5 pre-crypto, 6 modern) and positive valuations', () => {
    for (const yearData of GLOBAL_ASSET_HISTORY) {
      const expectedCount = yearData.year >= 2015 ? 6 : 5;
      expect(yearData.categories.length).toBe(expectedCount);

      let calculatedGross = 0;
      for (const cat of yearData.categories) {
        expect(Number.isFinite(cat.valueTrillion)).toBe(true);
        expect(cat.valueTrillion).toBeGreaterThanOrEqual(0);
        calculatedGross += cat.valueTrillion;
      }

      expect(Math.abs(calculatedGross - yearData.totalGrossAssetsTrillion)).toBeLessThan(0.2);
    }
  });

  it('reconciles every sub-category to its parent category value and 100% share', () => {
    for (const yearData of GLOBAL_ASSET_HISTORY) {
      for (const cat of yearData.categories) {
        expect(Array.isArray(cat.subCategories)).toBe(true);
        expect(cat.subCategories?.length).toBe(3);

        let subSum = 0;
        let percentSum = 0;
        for (const sub of cat.subCategories || []) {
          expect(sub.id).toBeTruthy();
          expect(sub.name).toBeTruthy();
          expect(Number.isFinite(sub.valueTrillion)).toBe(true);
          expect(sub.valueTrillion).toBeGreaterThanOrEqual(0);
          expect(Number.isFinite(sub.shareOfParentPercent)).toBe(true);

          subSum += sub.valueTrillion;
          percentSum += sub.shareOfParentPercent;
        }

        expect(Math.abs(subSum - cat.valueTrillion)).toBeLessThan(0.15);

        if (cat.valueTrillion > 0) {
          expect(Math.abs(percentSum - 100)).toBeLessThan(0.5);
        }
      }
    }
  });

  it('ensures liability breakdowns match total liabilities', () => {
    for (const yearData of GLOBAL_ASSET_HISTORY) {
      expect(Array.isArray(yearData.liabilityBreakdown)).toBe(true);
      expect(yearData.liabilityBreakdown?.length).toBe(3);

      let liabilitySum = 0;
      for (const liab of yearData.liabilityBreakdown || []) {
        expect(Number.isFinite(liab.valueTrillion)).toBe(true);
        expect(liab.valueTrillion).toBeGreaterThanOrEqual(0);
        liabilitySum += liab.valueTrillion;
      }

      expect(Math.abs(liabilitySum - yearData.totalLiabilitiesTrillion)).toBeLessThan(0.2);
    }
  });

  it('ensures normalized Share (%) mode always totals ~100% with no NaN or undefined', () => {
    for (const yearData of GLOBAL_ASSET_HISTORY) {
      const gross = yearData.totalGrossAssetsTrillion;
      expect(gross).toBeGreaterThan(0);

      // Macro shares
      const macroShares = yearData.categories.map((c) =>
        Number(((c.valueTrillion / gross) * 100).toFixed(1))
      );

      for (const val of macroShares) {
        expect(Number.isNaN(val)).toBe(false);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      }

      const macroTotal = macroShares.reduce((a, b) => a + b, 0);
      expect(Math.abs(macroTotal - 100)).toBeLessThan(0.5);

      // Sub-sector shares
      const allSubs = yearData.categories.flatMap((c) => c.subCategories || []);
      const subShares = allSubs.map((s) =>
        Number(((s.valueTrillion / gross) * 100).toFixed(1))
      );

      for (const val of subShares) {
        expect(Number.isNaN(val)).toBe(false);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      }

      const subTotal = subShares.reduce((a, b) => a + b, 0);
      expect(Math.abs(subTotal - 100)).toBeLessThan(0.8);
    }
  });

  it('ensures currency adjustments yield finite non-negative values across all perspectives', () => {
    const perspectives: Array<'nominal' | 'real' | 'ppp'> = ['nominal', 'real', 'ppp'];

    for (const p of perspectives) {
      for (const item of GLOBAL_ASSET_HISTORY) {
        for (const cat of item.categories) {
          const adjusted = adjustValue(cat.valueTrillion, item.year, p);
          expect(Number.isFinite(adjusted)).toBe(true);
          expect(adjusted).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
