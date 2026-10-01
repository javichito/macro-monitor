import { describe, it, expect } from 'vitest';
import {
  US_INFLATION_HISTORY,
  SOVEREIGN_INFLATION_PROFILES,
  US_CPI_BASKET_WEIGHTS,
  calculateComponentContribution,
  classifyInflationRegime,
  getPipelinePressureSignal,
} from '../inflation-anatomy-data';

describe('Inflation Anatomy & Granular Decomposition Dataset', () => {
  it('contains historical US inflation decomposition series spanning 1980 through 2026', () => {
    expect(US_INFLATION_HISTORY.length).toBeGreaterThanOrEqual(15);

    const first = US_INFLATION_HISTORY[0];
    expect(first.year).toBe(1980);
    expect(first.headlineCpi).toBe(13.5);
    expect(first.coreCpi).toBe(12.4);
    expect(first.supercoreCpi).toBe(11.2);

    const latest = US_INFLATION_HISTORY[US_INFLATION_HISTORY.length - 1];
    expect(latest.year).toBe(2026);
    expect(latest.headlineCpi).toBe(2.3);
    expect(latest.coreCpi).toBe(2.4);
  });

  it('validates that US CPI relative importance basket weights sum to 100%', () => {
    const totalWeight =
      US_CPI_BASKET_WEIGHTS.shelterWeight +
      US_CPI_BASKET_WEIGHTS.supercoreWeight +
      US_CPI_BASKET_WEIGHTS.coreGoodsWeight +
      US_CPI_BASKET_WEIGHTS.foodWeight +
      US_CPI_BASKET_WEIGHTS.energyWeight;

    expect(Math.round(totalWeight)).toBe(100);
  });

  it('accurately computes component contributions in percentage points to headline CPI', () => {
    // Shelter at 34.5% weight with 5.0% YoY contributes +1.72 percentage points
    const contribution = calculateComponentContribution(34.5, 5.0);
    expect(contribution).toBe(1.72);

    // Negative goods inflation (-2.0%) with 18.8% weight contributes -0.38 percentage points
    const disinflationContribution = calculateComponentContribution(18.8, -2.0);
    expect(disinflationContribution).toBe(-0.38);
  });

  it('accurately identifies upstream pipeline pressure signals from the PPI - CPI spread', () => {
    const squeeze = getPipelinePressureSignal(2.5);
    expect(squeeze.status).toBe('upstream-squeeze');
    expect(squeeze.headline).toContain('Upstream Pipeline Inflation Squeeze');

    const disinflation = getPipelinePressureSignal(-2.0);
    expect(disinflation.status).toBe('upstream-disinflation');
    expect(disinflation.headline).toContain('Upstream Disinflation Wave');

    const neutral = getPipelinePressureSignal(0.2);
    expect(neutral.status).toBe('neutral');
  });

  it('correctly classifies economic inflation regimes based on core and supercore momentum', () => {
    expect(classifyInflationRegime(0.2, 0.4, 0.5, -1.0)).toBe('deflationary');
    expect(classifyInflationRegime(3.5, 3.8, 4.2, 2.0)).toBe('broad-stagflationary');
    expect(classifyInflationRegime(2.6, 2.8, 3.2, 1.8)).toBe('sticky-supercore');
    expect(classifyInflationRegime(2.2, 2.3, 2.5, 1.0)).toBe('goods-disinflation');
    expect(classifyInflationRegime(2.3, 2.4, 2.7, 2.2)).toBe('target-equilibrium');
  });

  it('includes multi-sovereign inflation profiles with complete series and regional basket weights', () => {
    expect(SOVEREIGN_INFLATION_PROFILES.length).toBeGreaterThanOrEqual(4);
    const expectedCodes = ['USA', 'DEU', 'GBR', 'JPN'];

    for (const code of expectedCodes) {
      const profile = SOVEREIGN_INFLATION_PROFILES.find((p) => p.countryCode === code);
      expect(profile).toBeDefined();
      expect(profile!.headlineYoY).toBeGreaterThan(0);
      expect(profile!.historicalSeries.length).toBeGreaterThanOrEqual(5);

      const totalWeight =
        profile!.basketWeights.shelterWeight +
        profile!.basketWeights.supercoreWeight +
        profile!.basketWeights.coreGoodsWeight +
        profile!.basketWeights.foodWeight +
        profile!.basketWeights.energyWeight;
      expect(Math.round(totalWeight)).toBe(100);
    }
  });
});
