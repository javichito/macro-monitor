import { describe, it, expect } from 'vitest';
import {
  REGIONAL_MONETARY_PROFILES,
  HISTORICAL_VELOCITY_SERIES,
  HISTORICAL_TREASURY_ISSUANCE_SERIES,
  MONETARY_MECHANICS_OVERVIEW,
  getLatestMonetaryMechanicsState,
  getVelocityRegimeLabel,
  getIssuanceRegimeLabel,
  simulateMonetaryMechanics,
} from '../monetary-mechanics-data';

describe('Monetary Velocity & Sovereign Debt Issuance Mechanics', () => {
  describe('Regional Monetary Profiles & Global Coverage', () => {
    it('covers all major currency blocs and global aggregates', () => {
      const regions = ['USA', 'EUR', 'GBR', 'JPN', 'CHN', 'GLOBAL'];
      for (const r of regions) {
        const profile = REGIONAL_MONETARY_PROFILES[r as keyof typeof REGIONAL_MONETARY_PROFILES];
        expect(profile).toBeDefined();
        expect(profile.nominalGdpTrillion).toBeGreaterThan(0);
        expect(profile.m2MoneySupplyTrillion).toBeGreaterThan(0);
        expect(profile.currentVelocity).toBeGreaterThan(0.2);
        expect(profile.currentVelocity).toBeLessThan(3.0);
        expect(profile.totalDebtTrillion).toBeGreaterThan(0);
        expect(profile.shortTermBillsPct).toBeGreaterThan(0);
        expect(profile.mediumLongCouponsPct).toBeGreaterThan(0);
        expect(profile.shortTermBillsPct + profile.mediumLongCouponsPct).toBeCloseTo(100, 1);
      }
    });

    it('captures known structural velocity differences across regions', () => {
      // US velocity is higher than Eurozone, which is higher than cash-hoarding Japan and debt-heavy China
      const usa = REGIONAL_MONETARY_PROFILES.USA;
      const eur = REGIONAL_MONETARY_PROFILES.EUR;
      const jpn = REGIONAL_MONETARY_PROFILES.JPN;
      const chn = REGIONAL_MONETARY_PROFILES.CHN;

      expect(usa.currentVelocity).toBeGreaterThan(eur.currentVelocity);
      expect(eur.currentVelocity).toBeGreaterThan(jpn.currentVelocity);
      expect(jpn.currentVelocity).toBeLessThan(0.7); // Chronic disinflation & high cash preference
      expect(chn.currentVelocity).toBeLessThan(0.6); // Massive $42T M2 base relative to GDP
    });
  });

  describe('Historical Monetary Velocity (V = GDP / M2)', () => {
    it('satisfies the accounting identity V = Nominal GDP / M2 across all periods', () => {
      for (const point of HISTORICAL_VELOCITY_SERIES) {
        const calculatedV = point.nominalGdpTrillionUsd / point.m2MoneySupplyTrillionUsd;
        expect(Math.abs(point.velocity - calculatedV)).toBeLessThanOrEqual(0.015);
      }
    });

    it('reflects the 2010s QE disinflation paradox where velocity collapsed', () => {
      const gfc2008 = HISTORICAL_VELOCITY_SERIES.find((p) => p.date === '2008-Q3');
      const qe2016 = HISTORICAL_VELOCITY_SERIES.find((p) => p.date === '2016-Q1');
      const qe2019 = HISTORICAL_VELOCITY_SERIES.find((p) => p.date === '2019-Q4');

      expect(gfc2008).toBeDefined();
      expect(qe2016).toBeDefined();
      expect(qe2019).toBeDefined();

      // Velocity collapsed from ~1.91 in 2008 down to ~1.42 by 2019 despite massive QE
      expect(gfc2008!.velocity).toBeGreaterThan(1.85);
      expect(qe2016!.velocity).toBeLessThan(1.50);
      expect(qe2019!.velocity).toBeLessThan(1.45);
      expect(qe2016!.cpiInflationYoY).toBeLessThan(2.0); // Inflation languished below Fed target
    });

    it('records the all-time historic velocity trough in Q2 2020 lockdowns', () => {
      const covidTrough = HISTORICAL_VELOCITY_SERIES.find((p) => p.date === '2020-Q2');
      expect(covidTrough).toBeDefined();
      expect(covidTrough!.velocity).toBeCloseTo(1.121, 2);
      expect(covidTrough!.m2GrowthYoYPct).toBeGreaterThan(20); // Emergency M2 expansion
    });

    it('demonstrates the 2021-2023 stimulus rebound where velocity and inflation surged together', () => {
      const covidTrough = HISTORICAL_VELOCITY_SERIES.find((p) => p.date === '2020-Q2');
      const peakInflation = HISTORICAL_VELOCITY_SERIES.find((p) => p.date === '2022-Q2');
      const lateRebound = HISTORICAL_VELOCITY_SERIES.find((p) => p.date === '2023-Q4');

      expect(peakInflation).toBeDefined();
      expect(lateRebound).toBeDefined();

      // Velocity rose from 1.12 to over 1.33
      expect(peakInflation!.velocity).toBeGreaterThan(covidTrough!.velocity);
      expect(lateRebound!.velocity).toBeGreaterThan(1.30);
      expect(peakInflation!.cpiInflationYoY).toBe(9.1); // Peak headline CPI
    });
  });

  describe('Treasury Issuance Maturity Profile & Shadow QE', () => {
    it('verifies that T-Bills and Coupons sum to Total Marketable Debt', () => {
      for (const point of HISTORICAL_TREASURY_ISSUANCE_SERIES) {
        const sum = point.tBillsOutstandingTrillionUsd + point.couponsOutstandingTrillionUsd;
        expect(sum).toBeCloseTo(point.totalMarketableDebtTrillionUsd, 1);

        const calculatedShare = (point.tBillsOutstandingTrillionUsd / point.totalMarketableDebtTrillionUsd) * 100;
        expect(point.tBillSharePct).toBeCloseTo(calculatedShare, 1);
      }
    });

    it('identifies the Yellen Pivot (Shadow QE) in late 2023 where T-Bills breached TBAC 20% cap', () => {
      const q42023 = HISTORICAL_TREASURY_ISSUANCE_SERIES.find((p) => p.date === '2023-Q4');
      expect(q42023).toBeDefined();

      // T-Bills exceeded 20% and gross issuance bill share topped 65%
      expect(q42023!.tBillSharePct).toBeGreaterThan(20.0);
      expect(q42023!.grossIssuanceBillSharePct).toBeGreaterThan(65.0);
      expect(q42023!.estimatedTermPremiumSuppressionBps).toBeLessThan(-30); // At least 30 bps suppression
      expect(q42023!.regime).toBe('heavy_tbill_shadow_qe');
    });

    it('tracks the multi-trillion drawdown of the Fed ON RRP cash buffer', () => {
      const peakRrp = HISTORICAL_TREASURY_ISSUANCE_SERIES.find((p) => p.date === '2022-Q4');
      const currentRrp = HISTORICAL_TREASURY_ISSUANCE_SERIES.find((p) => p.date === '2026-Q1');

      expect(peakRrp).toBeDefined();
      expect(currentRrp).toBeDefined();

      // Dropped from >$2.5T to under $0.2T
      expect(peakRrp!.onRrpBalanceTrillionUsd).toBeGreaterThan(2.5);
      expect(currentRrp!.onRrpBalanceTrillionUsd).toBeLessThan(0.2);
    });
  });

  describe('Econometric Simulator: Equation of Exchange & Term Premium', () => {
    it('simulates negative term premium suppression when T-Bill share exceeds 20%', () => {
      // 25% bill share -> expect ~ -11 bps suppression
      const res = simulateMonetaryMechanics({
        billSharePct: 25.0,
        velocityDeltaPct: 0.0,
        m2GrowthPct: 0.0,
      });

      expect(res.termPremiumSuppressionBps).toBeLessThan(0);
      expect(res.issuanceRegime).toBe('heavy_tbill_shadow_qe');
      expect(res.simulated10YYield).toBeLessThan(4.08);
    });

    it('simulates term premium expansion when T-Bill share drops below 15% (coupon flood)', () => {
      // 12% bill share -> coupons flood market, term premium rises
      const res = simulateMonetaryMechanics({
        billSharePct: 12.0,
        velocityDeltaPct: 0.0,
        m2GrowthPct: 0.0,
      });

      expect(res.termPremiumSuppressionBps).toBeGreaterThan(0);
      expect(res.issuanceRegime).toBe('coupon_heavy_duration_shock');
      expect(res.simulated10YYield).toBeGreaterThan(4.08);
    });

    it('simulates the 2010s QE trap: High M2 growth + negative velocity delta yields low inflation', () => {
      const res = simulateMonetaryMechanics({
        billSharePct: 16.0,
        velocityDeltaPct: -5.0, // Velocity collapsing
        m2GrowthPct: 8.0,       // Central bank expanding M2
      });

      // Implied nominal GDP = (1.08 * 0.95) - 1 = +2.6%
      // Implied CPI = 2.6% - 2.0% real trend = ~0.6%
      expect(res.impliedNominalGdpGrowthPct).toBeLessThan(3.5);
      expect(res.impliedCpiInflationPct).toBeLessThan(1.5);
      expect(res.velocityRegime).toBe('qe_disinflation_trap');
    });

    it('simulates the 2021-2022 stimulus wave: High M2 growth + positive velocity delta yields inflation surge', () => {
      const res = simulateMonetaryMechanics({
        billSharePct: 22.0,
        velocityDeltaPct: 6.0, // Velocity accelerating
        m2GrowthPct: 12.0,     // High M2 growth
      });

      // Implied nominal GDP = (1.12 * 1.06) - 1 = +18.7%
      expect(res.impliedNominalGdpGrowthPct).toBeGreaterThan(15.0);
      expect(res.impliedCpiInflationPct).toBeGreaterThan(10.0);
      expect(res.monetaryImpulseCategory).toBe('High Inflationary Surge');
    });

    it('escalates bank reserve drain risk score when T-Bill share exceeds 25%', () => {
      const benign = simulateMonetaryMechanics({ billSharePct: 18.0, velocityDeltaPct: 0, m2GrowthPct: 0 });
      const critical = simulateMonetaryMechanics({ billSharePct: 28.0, velocityDeltaPct: 0, m2GrowthPct: 0 });

      expect(critical.reserveDrainRiskScore).toBeGreaterThan(benign.reserveDrainRiskScore);
      expect(critical.reserveDrainRiskScore).toBeGreaterThan(80);
      expect(critical.reserveDrainPaceDescription).toContain('Critical');
    });
  });

  describe('Regime Classifications & Live Telemetry', () => {
    it('returns valid descriptive labels and styling for all velocity regimes', () => {
      const regimes = [
        'qe_disinflation_trap',
        'stimulus_rebound',
        'normalization',
        'overheated_velocity',
        'deflationary_stall',
      ] as const;

      for (const r of regimes) {
        const info = getVelocityRegimeLabel(r);
        expect(info.label).toBeDefined();
        expect(info.badgeClass).toBeDefined();
        expect(info.description.length).toBeGreaterThan(20);
      }
    });

    it('returns valid descriptive labels and styling for all issuance regimes', () => {
      const regimes = ['heavy_tbill_shadow_qe', 'tbac_neutral_balance', 'coupon_heavy_duration_shock'] as const;

      for (const r of regimes) {
        const info = getIssuanceRegimeLabel(r);
        expect(info.label).toBeDefined();
        expect(info.badgeClass).toBeDefined();
        expect(info.description.length).toBeGreaterThan(20);
      }
    });

    it('evaluates current monetary state and active alerts without throwing', () => {
      const state = getLatestMonetaryMechanicsState();
      expect(state.timestamp).toBeDefined();
      expect(state.usVelocity).toBeCloseTo(1.368, 2);
      expect(state.tBillSharePct).toBeGreaterThan(20.0);
      expect(state.activeAlerts.length).toBeGreaterThan(0);
    });
  });
});
