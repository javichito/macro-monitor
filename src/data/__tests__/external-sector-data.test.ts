import { describe, it, expect } from 'vitest';
import {
  CURRENT_ACCOUNT_PROFILES,
  DXY_PROFILE_DATA,
  REER_CURRENCY_PROFILES,
  GSCPI_PROFILE_DATA,
  CAPITAL_FLOWS_TIC_DATA,
  classifyReerValuation,
  classifySolvencyRisk,
  calculateTwinDeficitGap,
  calculateDevaluationRiskScore,
  classifyGscpiStatus,
} from '../external-sector-data';
import {
  validateExternalBounds,
  evaluateExternalSectorStatus,
} from '../../../scripts/sync-external-sector';

describe('External Sector, Balance of Payments & FX Strength Dataset', () => {
  describe('Current Account & Balance of Payments Accounting', () => {
    it('contains profiles for all critical G7 and BRICS+ anchor economies', () => {
      const codes = CURRENT_ACCOUNT_PROFILES.map((p) => p.countryCode);
      expect(codes).toContain('USA');
      expect(codes).toContain('CHN');
      expect(codes).toContain('DEU');
      expect(codes).toContain('JPN');
      expect(codes).toContain('GBR');
      expect(codes).toContain('IND');
      expect(codes).toContain('BRA');
      expect(codes).toContain('SAU');
      expect(codes).toContain('RUS');
    });

    it('verifies Current Account % of GDP and macro variables lie within realistic economic bounds', () => {
      for (const profile of CURRENT_ACCOUNT_PROFILES) {
        expect(profile.currentAccountPercentGdp).toBeGreaterThan(-15);
        expect(profile.currentAccountPercentGdp).toBeLessThan(30);
        expect(profile.externalDebtToGdp).toBeGreaterThan(0);
        expect(profile.fxReservesBillionUSD).toBeGreaterThan(0);
        expect(profile.importCoverMonths).toBeGreaterThan(0);
        expect(profile.historicalSeries.length).toBeGreaterThanOrEqual(4);

        for (const pt of profile.historicalSeries) {
          expect(pt.currentAccountPercentGdp).toBeGreaterThan(-20);
          expect(pt.currentAccountPercentGdp).toBeLessThan(35);
          expect(pt.fxReservesBillionUSD).toBeGreaterThan(0);
        }
      }
    });

    it('correctly calculates the twin deficit burden gap', () => {
      const gap = calculateTwinDeficitGap(-6.4, -3.4);
      expect(gap).toBe(-9.8);

      const surplusGap = calculateTwinDeficitGap(-1.8, 6.8);
      expect(surplusGap).toBe(5.0);
    });

    it('identifies twin deficit warning for economies with high dual shortfalls', () => {
      const us = CURRENT_ACCOUNT_PROFILES.find((p) => p.countryCode === 'USA');
      expect(us).toBeDefined();
      expect(us!.twinDeficitWarning).toBe(true);
      expect(us!.currentAccountPercentGdp).toBeLessThan(0);
      expect(us!.fiscalBalancePercentGdp).toBeLessThan(0);

      const china = CURRENT_ACCOUNT_PROFILES.find((p) => p.countryCode === 'CHN');
      expect(china).toBeDefined();
      expect(china!.twinDeficitWarning).toBe(false);
      expect(china!.currentAccountPercentGdp).toBeGreaterThan(0);
    });

    it('evaluates external solvency risk levels correctly based on import cover and deficit depth', () => {
      expect(classifySolvencyRisk(-1.0, 30, 12)).toBe('low');
      expect(classifySolvencyRisk(-2.5, 55, 6)).toBe('moderate');
      expect(classifySolvencyRisk(-4.0, 70, 4.0)).toBe('elevated');
      expect(classifySolvencyRisk(-6.0, 90, 2.5)).toBe('critical');
    });
  });

  describe('US Dollar Index (DXY) & Real Effective Exchange Rates (REER)', () => {
    it('verifies DXY component weights sum to 100% within floating point tolerance', () => {
      const totalWeight = DXY_PROFILE_DATA.components.reduce((acc, c) => acc + c.weightPercent, 0);
      expect(totalWeight).toBeCloseTo(100, 1);
      expect(DXY_PROFILE_DATA.components.find((c) => c.currencyCode === 'EUR')?.weightPercent).toBe(57.6);
      expect(DXY_PROFILE_DATA.components.find((c) => c.currencyCode === 'JPY')?.weightPercent).toBe(13.6);
    });

    it('classifies REER valuation status according to deviation thresholds', () => {
      expect(classifyReerValuation(18)).toBe('deeply_overvalued');
      expect(classifyReerValuation(8)).toBe('moderately_overvalued');
      expect(classifyReerValuation(2)).toBe('fairly_valued');
      expect(classifyReerValuation(-8)).toBe('moderately_undervalued');
      expect(classifyReerValuation(-22)).toBe('deeply_undervalued');
    });

    it('calculates devaluation risk scores within valid 1 to 100 range', () => {
      for (const cur of REER_CURRENCY_PROFILES) {
        expect(cur.devaluationRiskScore).toBeGreaterThanOrEqual(1);
        expect(cur.devaluationRiskScore).toBeLessThanOrEqual(100);
        expect(cur.currentReer).toBeGreaterThan(40);
        expect(cur.currentReer).toBeLessThan(160);
      }
    });

    it('flags JPY as deeply undervalued and USD as moderately overvalued', () => {
      const jpy = REER_CURRENCY_PROFILES.find((c) => c.currencyCode === 'JPY');
      expect(jpy).toBeDefined();
      expect(jpy!.valuationStatus).toBe('deeply_undervalued');
      expect(jpy!.valuationDeviationPct).toBeLessThan(-15);

      const usd = REER_CURRENCY_PROFILES.find((c) => c.currencyCode === 'USD');
      expect(usd).toBeDefined();
      expect(usd!.valuationStatus).toBe('moderately_overvalued');
      expect(usd!.valuationDeviationPct).toBeGreaterThan(10);
    });
  });

  describe('NY Fed Global Supply Chain Pressure Index (GSCPI)', () => {
    it('confirms the historical 2021 pandemic peak reached severe stress (> +4.0σ)', () => {
      const peak = GSCPI_PROFILE_DATA.historicalSeries.find((pt) => pt.period === '2021-12');
      expect(peak).toBeDefined();
      expect(peak!.stdDevLevel).toBeGreaterThan(4.0);
    });

    it('verifies all component sub-indices are defined with realistic standard deviations', () => {
      expect(GSCPI_PROFILE_DATA.components.length).toBeGreaterThanOrEqual(5);
      for (const comp of GSCPI_PROFILE_DATA.components) {
        expect(comp.currentValueStdDev).toBeGreaterThan(-3.0);
        expect(comp.currentValueStdDev).toBeLessThan(5.0);
      }
    });

    it('correctly maps standard deviations to supply chain status classes', () => {
      expect(classifyGscpiStatus(2.5)).toBe('extreme_stress');
      expect(classifyGscpiStatus(1.1)).toBe('elevated_pressure');
      expect(classifyGscpiStatus(0.2)).toBe('normal');
      expect(classifyGscpiStatus(-0.8)).toBe('expansionary_slack');
    });
  });

  describe('Treasury International Capital (TIC) & Sovereign Debt Holdings', () => {
    it('verifies Japan is the largest foreign sovereign creditor followed by China', () => {
      const holders = CAPITAL_FLOWS_TIC_DATA.holders;
      expect(holders[0].countryCode).toBe('JPN');
      expect(holders[0].holdingsBillionUSD).toBeGreaterThan(1000);
      expect(holders[1].countryCode).toBe('CHN');
      expect(holders[1].holdingsBillionUSD).toBeGreaterThan(700);
    });

    it('confirms China is actively divesting US Treasuries in its strategic direction', () => {
      const china = CAPITAL_FLOWS_TIC_DATA.holders.find((h) => h.countryCode === 'CHN');
      expect(china).toBeDefined();
      expect(china!.strategicDirection).toBe('divesting');
      expect(china!.twelveMonthChangeBillionUSD).toBeLessThan(0);
    });

    it('validates the secular dilution in foreign share of US debt (below 25%)', () => {
      expect(CAPITAL_FLOWS_TIC_DATA.foreignShareOfUsDebtPct).toBeLessThan(30);
      expect(CAPITAL_FLOWS_TIC_DATA.foreignShareOfUsDebtPct).toBeGreaterThan(15);

      const latestHistory = CAPITAL_FLOWS_TIC_DATA.historicalOwnership[CAPITAL_FLOWS_TIC_DATA.historicalOwnership.length - 1];
      expect(latestHistory.foreignSharePct).toBeLessThan(25);
    });

    it('reflects gold accumulation and US Dollar share erosion in central bank reserves', () => {
      const reserves = CAPITAL_FLOWS_TIC_DATA.reserveDiversification;
      const initial = reserves[0];
      const latest = reserves[reserves.length - 1];

      expect(latest.usdSharePct).toBeLessThan(initial.usdSharePct);
      expect(latest.goldSharePct).toBeGreaterThan(initial.goldSharePct);
    });
  });

  describe('Automated Sync & Evaluator Engine', () => {
    it('validates econometric bounds reject impossible values', () => {
      expect(() =>
        validateExternalBounds({ dxyIndex: 30, gscpiStdDev: 0, foreignSharePct: 20 })
      ).toThrow();

      expect(() =>
        validateExternalBounds({ dxyIndex: 100, gscpiStdDev: 12, foreignSharePct: 20 })
      ).toThrow();

      expect(() =>
        validateExternalBounds({ dxyIndex: 100, gscpiStdDev: 0, foreignSharePct: 95 })
      ).toThrow();
    });

    it('evaluates external sector status and generates appropriate alerts', () => {
      const state = evaluateExternalSectorStatus();
      expect(state.dxySummary.currentIndex).toBeGreaterThan(80);
      expect(state.gscpiSummary.currentStdDev).toBeDefined();
      expect(state.currentAccountAlerts.length).toBeGreaterThan(0);
      expect(state.reerExtremeAlerts.length).toBeGreaterThan(0);
      expect(state.ticFlowAlerts.length).toBeGreaterThan(0);
    });
  });
});
