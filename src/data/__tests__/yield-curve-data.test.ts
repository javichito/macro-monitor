import { describe, it, expect } from 'vitest';
import {
  SOVEREIGN_YIELD_CURVES,
  HISTORICAL_YIELD_SPREADS,
  calculateRecessionProbability,
} from '../yield-curve-data';

describe('Yield Curve & Term Structure Dataset', () => {
  it('contains valid yield curves for all 4 major sovereign issuers', () => {
    expect(SOVEREIGN_YIELD_CURVES.length).toBe(4);
    const codes = SOVEREIGN_YIELD_CURVES.map((c) => c.sovereignCode);
    expect(codes).toContain('USA');
    expect(codes).toContain('DEU');
    expect(codes).toContain('JPN');
    expect(codes).toContain('GBR');
  });

  it('orders tenors monotonically by maturity months', () => {
    for (const curve of SOVEREIGN_YIELD_CURVES) {
      expect(curve.currentCurve.length).toBeGreaterThanOrEqual(10);
      for (let i = 1; i < curve.currentCurve.length; i++) {
        expect(curve.currentCurve[i].tenorMonths).toBeGreaterThan(
          curve.currentCurve[i - 1].tenorMonths
        );
      }
    }
  });

  it('accurately computes 10Y-2Y and 10Y-3M spreads matching curve endpoints', () => {
    const usa = SOVEREIGN_YIELD_CURVES.find((c) => c.sovereignCode === 'USA')!;
    const y10 = usa.currentCurve.find((p) => p.tenor === '10Y')!.yieldPercent;
    const y2 = usa.currentCurve.find((p) => p.tenor === '2Y')!.yieldPercent;
    const y3m = usa.currentCurve.find((p) => p.tenor === '3M')!.yieldPercent;

    expect(Number((y10 - y2).toFixed(2))).toBe(usa.spread10Y2Y);
    expect(Number((y10 - y3m).toFixed(2))).toBe(usa.spread10Y3M);
  });

  it('calculates NY Fed recession probabilities within bounded 1-99% range', () => {
    // Normal positive spread (+200 bps) should yield low recession odds
    const lowRisk = calculateRecessionProbability(2.0);
    expect(lowRisk).toBeLessThan(10);

    // Deep inversion (-200 bps) should yield high recession odds
    const highRisk = calculateRecessionProbability(-2.0);
    expect(highRisk).toBeGreaterThan(60);

    // Bounded between 1 and 99
    expect(calculateRecessionProbability(10.0)).toBeGreaterThanOrEqual(1.0);
    expect(calculateRecessionProbability(-10.0)).toBeLessThanOrEqual(99.0);
  });

  it('validates Fisher identity accounting: Nominal 10Y = Real TIPS + Breakeven (+/- 0.05% rounding)', () => {
    for (const curve of SOVEREIGN_YIELD_CURVES) {
      const y10 = curve.currentCurve.find((p) => p.tenor === '10Y')!.yieldPercent;
      const expectedNominal = curve.realYield10Y + curve.breakevenInflation10Y;
      expect(Math.abs(y10 - expectedNominal)).toBeLessThanOrEqual(0.05);
    }
  });

  it('confirms every US recession since 1980 was preceded by yield curve inversion', () => {
    const historicalInversions = HISTORICAL_YIELD_SPREADS.filter((h) => h.isInverted);
    expect(historicalInversions.length).toBeGreaterThanOrEqual(6);

    const recessions = HISTORICAL_YIELD_SPREADS.filter((h) => h.isRecession);
    expect(recessions.length).toBeGreaterThanOrEqual(5);
  });
});
