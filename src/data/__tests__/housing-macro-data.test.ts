import { describe, it, expect } from 'vitest';
import {
  calculateHousingAffordabilityIndex,
  calculateMonthlyMortgagePayment,
  getAffordabilityRegime,
  getHousingOverview,
  getLatestHousingState,
  getCombinedHousingExportData,
  HISTORICAL_HOUSING_SERIES,
  REGIONAL_HOUSING_PROFILES,
} from '../housing-macro-data';

describe('Housing Macro & Affordability Dynamics Dataset', () => {
  describe('Mathematical Formulas & Accounting Identities', () => {
    it('calculates monthly mortgage principal and interest payments accurately', () => {
      // $400,000 loan at 6.0% for 30 years -> expect ~$2,398.20
      const payment = calculateMonthlyMortgagePayment(400000, 6.0, 30);
      expect(payment).toBeGreaterThan(2395);
      expect(payment).toBeLessThan(2405);

      // Edge case: zero loan amount
      expect(calculateMonthlyMortgagePayment(0, 6.0, 30)).toBe(0);

      // Edge case: zero interest rate (pure principal amortization)
      expect(calculateMonthlyMortgagePayment(360000, 0, 30)).toBe(1000);
    });

    it('calculates Housing Affordability Index (HAI) according to NAR specifications', () => {
      // Home price $400,000, 20% down ($320,000 loan), rate 6.0%, median income $115,114
      // Monthly payment ~$1,918.56. Qualifying monthly income = $1,918.56 / 0.25 = $7,674.24.
      // Qualifying annual income = $92,091.
      // HAI = ($115,114 / $92,091) * 100 = 125.0
      const evalResult = calculateHousingAffordabilityIndex(115114, 400000, 6.0);
      expect(evalResult.hai).toBeGreaterThan(120);
      expect(evalResult.hai).toBeLessThan(130);
      expect(evalResult.regime).toBe('fairly_affordable');
    });

    it('properly categorizes affordability risk regimes based on index thresholds', () => {
      expect(getAffordabilityRegime(75)).toBe('severely_unaffordable');
      expect(getAffordabilityRegime(92)).toBe('unaffordable');
      expect(getAffordabilityRegime(115)).toBe('fairly_affordable');
      expect(getAffordabilityRegime(145)).toBe('highly_affordable');
    });

    it('validates that real Case-Shiller equals nominal Case-Shiller deflated by CPI', () => {
      // In base year 2000, nominal index is 100 and CPI is 100 -> real index must be 100
      const year2000 = HISTORICAL_HOUSING_SERIES.find((p) => p.year === 2000);
      expect(year2000).toBeDefined();
      if (year2000) {
        expect(year2000.nominalCaseShiller).toBe(100);
        expect(year2000.cpiIndex).toBe(100);
        expect(year2000.realCaseShiller).toBe(100);
      }

      // Across all historical series points, real index must mathematically equal nominal / (cpi / 100)
      for (const p of HISTORICAL_HOUSING_SERIES) {
        const expectedReal = Math.round((p.nominalCaseShiller / (p.cpiIndex / 100)) * 10) / 10;
        expect(Math.abs(p.realCaseShiller - expectedReal)).toBeLessThanOrEqual(0.2);
      }
    });

    it('confirms 30-year fixed mortgage rates exceed 10-year Treasury yields across all historical periods', () => {
      for (const p of HISTORICAL_HOUSING_SERIES) {
        expect(p.mortgageRate30Y).toBeGreaterThan(p.treasury10Y);
        expect(p.mortgageSpreadBps).toBeGreaterThan(0);
        expect(p.mortgageSpreadBps).toBe(Math.round((p.mortgageRate30Y - p.treasury10Y) * 100));
      }
    });
  });

  describe('Macro Overview & Alert Telemetry', () => {
    it('produces a complete institutional overview with global real estate context', () => {
      const overview = getHousingOverview();
      expect(overview.totalGlobalRealEstateWealthTrillion).toBeGreaterThan(250);
      expect(overview.currentHai).toBeGreaterThan(50);
      expect(overview.currentMortgage30Y).toBeGreaterThan(4.0);
      expect(overview.lockInSpreadPct).toBeGreaterThan(1.0);
      expect(overview.regions.USA).toBeDefined();
      expect(overview.regions.GBR).toBeDefined();
      expect(overview.regions.CAN).toBeDefined();
      expect(overview.regions.AUS).toBeDefined();
      expect(overview.regions.EUR).toBeDefined();
      expect(overview.regions.JPN).toBeDefined();
    });

    it('generates active alerts for mortgage rate lock-in and affordability deficits', () => {
      const state = getLatestHousingState();
      expect(state.activeAlerts.length).toBeGreaterThanOrEqual(3);

      const lockInAlert = state.activeAlerts.find((a) => a.id === 'lock-in-freeze');
      expect(lockInAlert).toBeDefined();
      expect(lockInAlert?.level).toBe('CRITICAL');

      const realVsNominalAlert = state.activeAlerts.find((a) => a.id === 'real-vs-nominal');
      expect(realVsNominalAlert).toBeDefined();
    });

    it('formats export dataset with standardized keys for CSV/JSON generation', () => {
      const exports = getCombinedHousingExportData();
      expect(exports.length).toBe(HISTORICAL_HOUSING_SERIES.length);

      const firstRow = exports[0];
      expect(firstRow.date).toBeDefined();
      expect(firstRow.nominalCaseShiller).toBeDefined();
      expect(firstRow.realCaseShiller).toBeDefined();
      expect(firstRow.housingAffordabilityIndex).toBeDefined();
      expect(firstRow.mortgageRate30YPercent).toBeDefined();
    });
  });

  describe('Cross-Country Regional Profiles', () => {
    it('contains valid structural configurations for all 6 target economies', () => {
      const countries: (keyof typeof REGIONAL_HOUSING_PROFILES)[] = [
        'USA',
        'GBR',
        'CAN',
        'AUS',
        'EUR',
        'JPN',
      ];

      for (const country of countries) {
        const profile = REGIONAL_HOUSING_PROFILES[country];
        expect(profile.name).toBeDefined();
        expect(profile.benchmarkMortgageRate).toBeGreaterThan(0);
        expect(profile.priceToIncomeRatio).toBeGreaterThan(3);
        expect(profile.householdDebtToGdpPct).toBeGreaterThan(30);
        expect(profile.homeownershipRatePct).toBeGreaterThan(50);
        expect(profile.macroTransmissionNote.length).toBeGreaterThan(20);
      }
    });
  });
});
