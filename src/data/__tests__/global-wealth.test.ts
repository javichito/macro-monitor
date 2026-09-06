import { describe, it, expect } from 'vitest';
import { GLOBAL_WEALTH_HISTORY } from '../global-wealth';

describe('Global Wealth Data Pipeline', () => {
  it('contains valid data for all 14 historical intervals', () => {
    expect(GLOBAL_WEALTH_HISTORY.length).toBe(14);
  });

  it('includes the > $100M apex tier in 2026 with mathematically reconciled sums', () => {
    const year2026 = GLOBAL_WEALTH_HISTORY.find((w) => w.year === 2026)!;
    expect(year2026).toBeDefined();

    const brackets = year2026.tiers.map((t) => t.bracket);
    expect(brackets).toEqual(['< $10k', '$10k - $100k', '$100k - $1M', '$1M - $100M', '> $100M']);

    // Adult population sum check
    const totalAdultsMillion = year2026.tiers.reduce((acc, t) => acc + t.adultsMillion, 0);
    expect(Math.abs(totalAdultsMillion / 1000 - year2026.adultPopulationBillions)).toBeLessThan(0.05);

    // Wealth sum check
    const totalWealthTrillion = year2026.tiers.reduce((acc, t) => acc + t.wealthTrillion, 0);
    expect(Math.abs(totalWealthTrillion - year2026.totalWealthTrillion)).toBeLessThan(0.1);

    // Wealth share sum check
    const totalWealthShare = year2026.tiers.reduce((acc, t) => acc + t.wealthShare, 0);
    expect(Math.abs(totalWealthShare - 100)).toBeLessThan(0.2);

    // Apex tier specifics
    const apexTier = year2026.tiers.find((t) => t.bracket === '> $100M')!;
    expect(apexTier.adultsMillion).toBe(0.031);
    expect(apexTier.wealthTrillion).toBe(43.5);
    expect(apexTier.wealthShare).toBe(8.0);
    expect(apexTier.minWealth).toBe(100000000);
    expect(apexTier.maxWealth).toBeNull();
  });
});
