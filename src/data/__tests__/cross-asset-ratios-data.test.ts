import { describe, it, expect } from 'vitest';
import {
  CROSS_ASSET_RATIOS,
  calculateImpliedRatio,
  evaluateRatioRegime,
  calculatePercentileRank,
  getCombinedCrossAssetExportData,
} from '../cross-asset-ratios-data';

/*
 * Validates cross-asset ratio historical models, mathematical formulas,
 * threshold categorizations, percentile distributions, and data aggregation integrity.
 */

describe('Cross-Asset Ratios Dataset & Calculations', () => {
  it('contains the three required macroeconomic ratio models with non-empty histories', () => {
    expect(CROSS_ASSET_RATIOS['copper-gold']).toBeDefined();
    expect(CROSS_ASSET_RATIOS['sp500-m2']).toBeDefined();
    expect(CROSS_ASSET_RATIOS['gold-oil']).toBeDefined();

    expect(CROSS_ASSET_RATIOS['copper-gold'].history.length).toBeGreaterThan(15);
    expect(CROSS_ASSET_RATIOS['sp500-m2'].history.length).toBeGreaterThan(15);
    expect(CROSS_ASSET_RATIOS['gold-oil'].history.length).toBeGreaterThan(15);
  });

  it('correctly calculates the implied ratio for all three models', () => {
    // Copper ($4.42/lb) / Gold ($2742.80/oz) * 1000 = 1.61
    const cgRatio = calculateImpliedRatio('copper-gold', 4.42, 2742.80);
    expect(cgRatio).toBe(1.61);

    // S&P 500 (5864.50) / M2 ($21410B) = 0.274
    const smRatio = calculateImpliedRatio('sp500-m2', 5864.50, 21410);
    expect(smRatio).toBe(0.274);

    // Gold ($2742.80/oz) / Oil ($74.85/bbl) = 36.6
    const goRatio = calculateImpliedRatio('gold-oil', 2742.80, 74.85);
    expect(goRatio).toBe(36.6);

    // Zero denominator safety guard
    expect(calculateImpliedRatio('copper-gold', 4.0, 0)).toBe(0);
  });

  it('evaluates macroeconomic regime correctly across calibrated thresholds', () => {
    // Copper/Gold thresholds
    const cgBoom = evaluateRatioRegime('copper-gold', 3.5);
    expect(cgBoom.label).toBe('Reflationary Boom');
    expect(cgBoom.color).toBe('emerald');

    const cgCrisis = evaluateRatioRegime('copper-gold', 1.2);
    expect(cgCrisis.label).toBe('Recession Shock / Crisis Haven');
    expect(cgCrisis.color).toBe('rose');

    // S&P 500 / M2 thresholds
    const smBubble = evaluateRatioRegime('sp500-m2', 0.31);
    expect(smBubble.label).toBe('Historical Bubble Territory');
    expect(smBubble.color).toBe('rose');

    const smValue = evaluateRatioRegime('sp500-m2', 0.10);
    expect(smValue.label).toBe('Deep Value / Monetary Undervaluation');
    expect(smValue.color).toBe('emerald');

    // Gold / Oil thresholds
    const goStress = evaluateRatioRegime('gold-oil', 40.0);
    expect(goStress.label).toBe('Severe Geopolitical / Macro Crisis');
    expect(goStress.color).toBe('rose');

    const goOilSpike = evaluateRatioRegime('gold-oil', 10.0);
    expect(goOilSpike.label).toBe('Energy Super-Spike / Cost-Push Inflation');
    expect(goOilSpike.color).toBe('sky');
  });

  it('calculates historical percentile ranks accurately within bounded [0, 100]', () => {
    const cgPercentile = calculatePercentileRank('copper-gold', 1.61);
    expect(cgPercentile).toBeGreaterThanOrEqual(0);
    expect(cgPercentile).toBeLessThanOrEqual(100);

    const smPercentile = calculatePercentileRank('sp500-m2', 0.274);
    expect(smPercentile).toBeGreaterThan(80);

    const goPercentile = calculatePercentileRank('gold-oil', 36.6);
    expect(goPercentile).toBeGreaterThan(70);
  });

  it('generates a consistent cross-sectional export table with unified date alignment', () => {
    const combinedData = getCombinedCrossAssetExportData();
    expect(combinedData.length).toBeGreaterThan(15);

    const record2026 = combinedData.find((d) => d.date === '2026');
    expect(record2026).toBeDefined();
    expect(record2026?.copperPriceUsdPerLb).toBe(4.42);
    expect(record2026?.goldPriceUsdPerOz).toBe(2742.80);
    expect(record2026?.sp500Index).toBe(5864.50);
    expect(record2026?.usM2MoneySupplyBillions).toBe(21410);
    expect(record2026?.brentCrudeUsdPerBbl).toBe(74.85);
  });
});
