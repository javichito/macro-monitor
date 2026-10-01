import { describe, it, expect } from 'vitest';
import {
  calculateSahmIndicator,
  classifySahmStatus,
  US_LABOR_HISTORY,
  SOVEREIGN_LABOR_PROFILES,
  HISTORICAL_PHILLIPS_CURVE_POINTS,
  getLaborMetricsForCountry,
} from '../labor-market-data';

describe('Labor Market Dynamics & Claudia Sahm Rule Dataset', () => {
  it('correctly calculates the Sahm Rule indicator formula: SMA3 - min(trailing 12 SMA)', () => {
    // Synthetic unemployment series where minimum SMA was 3.5%, and recent 3 months are 4.1%, 4.2%, 4.3% (avg 4.2%)
    // Sahm value should be 4.20 - 3.50 = 0.70 (Triggered recession)
    const baseRates = [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 4.1, 4.2, 4.3];
    const sahm = calculateSahmIndicator(baseRates);
    expect(sahm).toBe(0.7);
    expect(classifySahmStatus(sahm)).toBe('triggered');
  });

  it('classifies Sahm thresholds into tranquil, elevated, and triggered categories', () => {
    expect(classifySahmStatus(0.15)).toBe('tranquil');
    expect(classifySahmStatus(0.29)).toBe('tranquil');
    expect(classifySahmStatus(0.30)).toBe('elevated');
    expect(classifySahmStatus(0.49)).toBe('elevated');
    expect(classifySahmStatus(0.50)).toBe('triggered');
    expect(classifySahmStatus(0.85)).toBe('triggered');
  });

  it('throws an informative error if fewer than 15 monthly observations are provided', () => {
    expect(() => calculateSahmIndicator([4.0, 4.1, 4.2])).toThrow();
  });

  it('validates that all historical US recession years triggered the Sahm rule', () => {
    // 1980, 1982, 1990, 2001, 2008, 2020 are known recession years
    const recessionYears = [1980, 1982, 1990, 2001, 2008, 2020];
    for (const yr of recessionYears) {
      const record = US_LABOR_HISTORY.find((r) => r.year === yr);
      expect(record).toBeDefined();
      expect(record!.sahmTriggered).toBe(true);
      expect(record!.sahmIndicatorValue).toBeGreaterThanOrEqual(0.50);
    }
  });

  it('contains multi-country labor profiles with complete historical series for 13 global economies', () => {
    expect(SOVEREIGN_LABOR_PROFILES.length).toBeGreaterThanOrEqual(13);
    const expectedCountries = ['USA', 'DEU', 'GBR', 'JPN', 'CAN', 'FRA', 'AUS', 'CHE', 'KOR', 'ITA', 'ESP', 'BRA', 'CHN'];
    for (const code of expectedCountries) {
      const profile = SOVEREIGN_LABOR_PROFILES.find((p) => p.countryCode === code);
      expect(profile).toBeDefined();
      expect(profile!.currentUnemployment).toBeGreaterThan(0);
      expect(profile!.unemployment12mLow).toBeLessThanOrEqual(profile!.currentUnemployment);
      expect(profile!.historicalSeries.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('resolves labor metrics by country and optional year using getLaborMetricsForCountry', () => {
    const us2022 = getLaborMetricsForCountry('USA', 2022);
    expect(us2022).not.toBeNull();
    expect(us2022!.unemploymentRate).toBe(3.6);
    expect(us2022!.wageGrowthYoy).toBe(5.4);

    const ausCurrent = getLaborMetricsForCountry('AUS');
    expect(ausCurrent).not.toBeNull();
    expect(ausCurrent!.unemploymentRate).toBe(4.1);

    const unknown = getLaborMetricsForCountry('XYZ');
    expect(unknown).toBeNull();
  });

  it('contains historical Phillips curve observations spanning all 5 eras', () => {
    const eras = ['1980s', '1990s', '2000s', '2010s', '2020s'];
    for (const era of eras) {
      const eraPoints = HISTORICAL_PHILLIPS_CURVE_POINTS.filter((p) => p.era === era);
      expect(eraPoints.length).toBeGreaterThanOrEqual(3);
    }
  });
});

