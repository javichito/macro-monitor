import { describe, it, expect } from 'vitest';
import { COUNTRIES_DATA, ECONOMIC_BLOCS } from '../country-metrics';
import { getLaborMetricsForCountry, SOVEREIGN_LABOR_PROFILES } from '../labor-market-data';

const EXPECTED_YEARS = [1980, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2022, 2024, 2025, 2026];

describe('Sovereign Geography Macro & Balance Sheet Dataset (country-metrics.ts)', () => {
  it('models all 46 sovereign economies across all 12 historical eras (1980–2026)', () => {
    expect(COUNTRIES_DATA.length).toBe(46);
    for (const country of COUNTRIES_DATA) {
      for (const yr of EXPECTED_YEARS) {
        const metrics = country.history[yr];
        expect(metrics, `Missing year ${yr} for ${country.code}`).toBeDefined();
        expect(metrics.totalWealthTrillion).toBeGreaterThan(0);
        expect(metrics.wealthPerAdultUSD).toBeGreaterThan(0);
        expect(metrics.medianWealthUSD).toBeGreaterThan(0);
        expect(metrics.gdpTrillionUSD).toBeGreaterThan(0);
        expect(metrics.gdpPerCapitaUSD).toBeGreaterThan(0);
      }
    }
  });

  it('populates all 8 critical sovereign macroeconomic and demographic metrics within valid bounds', () => {
    for (const country of COUNTRIES_DATA) {
      for (const yr of EXPECTED_YEARS) {
        const m = country.history[yr];
        expect(Number.isFinite(m.realGdpGrowth)).toBe(true);
        expect(m.realGdpGrowth).toBeGreaterThanOrEqual(-30);
        expect(m.realGdpGrowth).toBeLessThanOrEqual(30);

        expect(Number.isFinite(m.policyRate)).toBe(true);
        expect(m.policyRate).toBeGreaterThanOrEqual(0);
        expect(m.policyRate).toBeLessThanOrEqual(100);

        expect(Number.isFinite(m.bondYield10Y)).toBe(true);
        expect(m.bondYield10Y).toBeGreaterThan(0);
        expect(m.bondYield10Y).toBeLessThanOrEqual(100);

        expect(Number.isFinite(m.currentAccountPercentGdp)).toBe(true);
        expect(m.currentAccountPercentGdp).toBeGreaterThanOrEqual(-35);
        expect(m.currentAccountPercentGdp).toBeLessThanOrEqual(45);

        expect(Number.isFinite(m.fiscalBalancePercentGdp)).toBe(true);
        expect(m.fiscalBalancePercentGdp).toBeGreaterThanOrEqual(-30);
        expect(m.fiscalBalancePercentGdp).toBeLessThanOrEqual(35);

        expect(Number.isFinite(m.fxReservesBillionUSD)).toBe(true);
        expect(m.fxReservesBillionUSD).toBeGreaterThan(0);

        expect(Number.isFinite(m.populationMillion)).toBe(true);
        expect(m.populationMillion).toBeGreaterThan(0);

        expect(Number.isFinite(m.oldAgeDependencyRatio)).toBe(true);
        expect(m.oldAgeDependencyRatio).toBeGreaterThanOrEqual(2);
        expect(m.oldAgeDependencyRatio).toBeLessThanOrEqual(75);
      }
    }
  });

  it('maintains 100% labor market & Sahm Rule parity across all 46 countries (including IND and NOR)', () => {
    expect(SOVEREIGN_LABOR_PROFILES.length).toBe(COUNTRIES_DATA.length);
    for (const country of COUNTRIES_DATA) {
      const labor2026 = getLaborMetricsForCountry(country.code, 2026);
      expect(labor2026, `Missing 2026 labor metrics for ${country.code}`).not.toBeNull();
      expect(labor2026!.unemploymentRate).toBeGreaterThan(0);
      expect(labor2026!.laborForceParticipation).toBeGreaterThan(30);

      const labor1990 = getLaborMetricsForCountry(country.code, 1990);
      expect(labor1990, `Missing 1990 labor metrics for ${country.code}`).not.toBeNull();
      expect(labor1990!.unemploymentRate).toBeGreaterThan(0);
    }
  });

  it('models all economic blocs across all 12 historical checkpoints', () => {
    expect(ECONOMIC_BLOCS.length).toBeGreaterThanOrEqual(3);
    for (const bloc of ECONOMIC_BLOCS) {
      for (const yr of EXPECTED_YEARS) {
        expect(bloc.history[yr], `Missing year ${yr} for bloc ${bloc.id}`).toBeDefined();
      }
    }
  });
});
