import { describe, it, expect } from 'vitest';
import { GLOBAL_WEALTH_HISTORY } from '../global-wealth';

describe('Global Wealth Data Pipeline', () => {
  it('contains valid data for all 14 historical intervals', () => {
    expect(GLOBAL_WEALTH_HISTORY.length).toBe(14);
  });

  it('includes the > $100M apex tier and $10M - $100M VHNW tier across all historical years with consistent 6-tier structure', () => {
    const expectedBrackets = ['< $10k', '$10k - $100k', '$100k - $1M', '$1M - $10M', '$10M - $100M', '> $100M'];

    for (const yearData of GLOBAL_WEALTH_HISTORY) {
      const brackets = yearData.tiers.map((t) => t.bracket);
      expect(brackets).toEqual(expectedBrackets);

      // Adult population sum check
      const totalAdultsMillion = yearData.tiers.reduce((acc, t) => acc + t.adultsMillion, 0);
      expect(Math.abs(totalAdultsMillion / 1000 - yearData.adultPopulationBillions)).toBeLessThan(0.05);

      // Wealth sum check
      const totalWealthTrillion = yearData.tiers.reduce((acc, t) => acc + t.wealthTrillion, 0);
      expect(Math.abs(totalWealthTrillion - yearData.totalWealthTrillion)).toBeLessThan(0.15);

      // Wealth share sum check
      const totalWealthShare = yearData.tiers.reduce((acc, t) => acc + t.wealthShare, 0);
      expect(Math.abs(totalWealthShare - 100)).toBeLessThan(0.3);

      // VHNW tier specifics ($10M - $100M)
      const vhnwTier = yearData.tiers.find((t) => t.bracket === '$10M - $100M')!;
      expect(vhnwTier.minWealth).toBe(10000000);
      expect(vhnwTier.maxWealth).toBe(100000000);
      expect(vhnwTier.adultsMillion).toBeGreaterThan(0);
      expect(vhnwTier.wealthTrillion).toBeGreaterThan(0);
      expect(vhnwTier.wealthShare).toBeGreaterThan(0);

      // Apex tier specifics (> $100M)
      const apexTier = yearData.tiers.find((t) => t.bracket === '> $100M')!;
      expect(apexTier.minWealth).toBe(100000000);
      expect(apexTier.maxWealth).toBeNull();
      expect(apexTier.adultsMillion).toBeGreaterThan(0);
      expect(apexTier.wealthTrillion).toBeGreaterThan(0);
      expect(apexTier.wealthShare).toBeGreaterThan(0);
    }
  });

  it('verifies chronological expansion of the $10M - $100M VHNW and > $100M centi-millionaire cohorts', () => {
    // Verifies that multi-millionaire and centi-millionaire populations and wealth expanded over the decades
    const year1980 = GLOBAL_WEALTH_HISTORY.find((w) => w.year === 1980)!;
    const year2000 = GLOBAL_WEALTH_HISTORY.find((w) => w.year === 2000)!;
    const year2026 = GLOBAL_WEALTH_HISTORY.find((w) => w.year === 2026)!;

    const vhnw1980 = year1980.tiers.find((t) => t.bracket === '$10M - $100M')!;
    const vhnw2000 = year2000.tiers.find((t) => t.bracket === '$10M - $100M')!;
    const vhnw2026 = year2026.tiers.find((t) => t.bracket === '$10M - $100M')!;

    expect(vhnw1980.wealthTrillion).toBeLessThan(vhnw2000.wealthTrillion);
    expect(vhnw2000.wealthTrillion).toBeLessThan(vhnw2026.wealthTrillion);
    expect(vhnw1980.adultsMillion).toBeLessThan(vhnw2000.adultsMillion);
    expect(vhnw2000.adultsMillion).toBeLessThan(vhnw2026.adultsMillion);

    const apex1980 = year1980.tiers.find((t) => t.bracket === '> $100M')!;
    const apex2000 = year2000.tiers.find((t) => t.bracket === '> $100M')!;
    const apex2026 = year2026.tiers.find((t) => t.bracket === '> $100M')!;

    expect(apex1980.wealthTrillion).toBeLessThan(apex2000.wealthTrillion);
    expect(apex2000.wealthTrillion).toBeLessThan(apex2026.wealthTrillion);
    expect(apex1980.adultsMillion).toBeLessThan(apex2000.adultsMillion);
    expect(apex2000.adultsMillion).toBeLessThan(apex2026.adultsMillion);
  });
});
