import { COUNTRIES_DATA } from './country-metrics';
import {
  SovereignLaborProfile,
  LaborMetricsYear,
  PhillipsCurvePoint,
  LaborMarketMetrics,
} from '../lib/types';

/**
 * Calculates the Claudia Sahm Rule Recession Indicator:
 * S_t = SMA_3(U_t) - min_{k in [1, 12]}(SMA_3(U_{t-k}))
 * Where U_t is the monthly civilian unemployment rate.
 *
 * When S_t >= 0.50 percentage points, an economic recession has begun with
 * zero historical false positives across all post-WWII US cycles.
 */
export function calculateSahmIndicator(monthlyUnemploymentRates: number[]): number {
  if (monthlyUnemploymentRates.length < 15) {
    throw new Error('Calculating the Sahm Rule requires at least 15 monthly observations (3-month SMA + 12-month trailing window).');
  }

  // Calculate 3-month moving averages for all available windows
  const smas: number[] = [];
  for (let i = 2; i < monthlyUnemploymentRates.length; i++) {
    const avg = (monthlyUnemploymentRates[i] + monthlyUnemploymentRates[i - 1] + monthlyUnemploymentRates[i - 2]) / 3;
    smas.push(avg);
  }

  const currentSma = smas[smas.length - 1];
  // Look back over the preceding 12 monthly SMAs
  const trailing12 = smas.slice(Math.max(0, smas.length - 13), smas.length - 1);
  const minTrailingSma = Math.min(...trailing12);

  return Number((currentSma - minTrailingSma).toFixed(2));
}

export function classifySahmStatus(sahmValue: number): 'tranquil' | 'elevated' | 'triggered' {
  if (sahmValue >= 0.50) return 'triggered';
  if (sahmValue >= 0.30) return 'elevated';
  return 'tranquil';
}

export const US_LABOR_HISTORY: LaborMetricsYear[] = [
  { year: 1980, unemploymentRate: 7.1, underemploymentRate: 10.4, laborForceParticipation: 63.8, sahmIndicatorValue: 1.15, sahmTriggered: true, jobOpeningsPerUnemployed: 0.55, wageGrowthYoy: 9.2, productivityGrowthYoy: -0.3 },
  { year: 1982, unemploymentRate: 10.8, underemploymentRate: 15.2, laborForceParticipation: 64.0, sahmIndicatorValue: 2.30, sahmTriggered: true, jobOpeningsPerUnemployed: 0.35, wageGrowthYoy: 6.8, productivityGrowthYoy: 1.4 },
  { year: 1985, unemploymentRate: 7.2, underemploymentRate: 10.2, laborForceParticipation: 64.8, sahmIndicatorValue: 0.10, sahmTriggered: false, jobOpeningsPerUnemployed: 0.72, wageGrowthYoy: 4.1, productivityGrowthYoy: 2.1 },
  { year: 1990, unemploymentRate: 5.6, underemploymentRate: 8.5, laborForceParticipation: 66.5, sahmIndicatorValue: 0.55, sahmTriggered: true, jobOpeningsPerUnemployed: 0.78, wageGrowthYoy: 4.6, productivityGrowthYoy: 1.8 },
  { year: 1992, unemploymentRate: 7.5, underemploymentRate: 11.0, laborForceParticipation: 66.4, sahmIndicatorValue: 0.65, sahmTriggered: true, jobOpeningsPerUnemployed: 0.52, wageGrowthYoy: 2.7, productivityGrowthYoy: 4.1 },
  { year: 1995, unemploymentRate: 5.6, underemploymentRate: 8.8, laborForceParticipation: 66.6, sahmIndicatorValue: 0.05, sahmTriggered: false, jobOpeningsPerUnemployed: 0.95, wageGrowthYoy: 3.2, productivityGrowthYoy: 1.2 },
  { year: 2000, unemploymentRate: 4.0, underemploymentRate: 7.0, laborForceParticipation: 67.1, sahmIndicatorValue: 0.05, sahmTriggered: false, jobOpeningsPerUnemployed: 1.18, wageGrowthYoy: 4.2, productivityGrowthYoy: 3.4 },
  { year: 2001, unemploymentRate: 4.7, underemploymentRate: 8.2, laborForceParticipation: 66.8, sahmIndicatorValue: 0.72, sahmTriggered: true, jobOpeningsPerUnemployed: 0.82, wageGrowthYoy: 3.8, productivityGrowthYoy: 2.6 },
  { year: 2007, unemploymentRate: 4.6, underemploymentRate: 8.3, laborForceParticipation: 66.0, sahmIndicatorValue: 0.22, sahmTriggered: false, jobOpeningsPerUnemployed: 0.88, wageGrowthYoy: 3.7, productivityGrowthYoy: 1.6 },
  { year: 2008, unemploymentRate: 5.8, underemploymentRate: 10.5, laborForceParticipation: 66.0, sahmIndicatorValue: 0.85, sahmTriggered: true, jobOpeningsPerUnemployed: 0.54, wageGrowthYoy: 3.6, productivityGrowthYoy: 1.1 },
  { year: 2009, unemploymentRate: 9.3, underemploymentRate: 16.2, laborForceParticipation: 65.4, sahmIndicatorValue: 2.65, sahmTriggered: true, jobOpeningsPerUnemployed: 0.22, wageGrowthYoy: 2.1, productivityGrowthYoy: 3.6 },
  { year: 2015, unemploymentRate: 5.3, underemploymentRate: 10.4, laborForceParticipation: 62.6, sahmIndicatorValue: 0.02, sahmTriggered: false, jobOpeningsPerUnemployed: 0.68, wageGrowthYoy: 2.4, productivityGrowthYoy: 1.3 },
  { year: 2019, unemploymentRate: 3.7, underemploymentRate: 6.9, laborForceParticipation: 63.1, sahmIndicatorValue: 0.08, sahmTriggered: false, jobOpeningsPerUnemployed: 1.15, wageGrowthYoy: 3.4, productivityGrowthYoy: 1.7 },
  { year: 2020, unemploymentRate: 8.1, underemploymentRate: 14.9, laborForceParticipation: 61.7, sahmIndicatorValue: 8.42, sahmTriggered: true, jobOpeningsPerUnemployed: 0.75, wageGrowthYoy: 5.2, productivityGrowthYoy: 2.4 },
  { year: 2021, unemploymentRate: 5.4, underemploymentRate: 9.4, laborForceParticipation: 61.7, sahmIndicatorValue: 0.15, sahmTriggered: false, jobOpeningsPerUnemployed: 1.55, wageGrowthYoy: 4.8, productivityGrowthYoy: 1.6 },
  { year: 2022, unemploymentRate: 3.6, underemploymentRate: 6.9, laborForceParticipation: 62.2, sahmIndicatorValue: 0.05, sahmTriggered: false, jobOpeningsPerUnemployed: 1.95, wageGrowthYoy: 5.4, productivityGrowthYoy: -1.2 },
  { year: 2023, unemploymentRate: 3.7, underemploymentRate: 7.1, laborForceParticipation: 62.6, sahmIndicatorValue: 0.18, sahmTriggered: false, jobOpeningsPerUnemployed: 1.38, wageGrowthYoy: 4.3, productivityGrowthYoy: 2.6 },
  { year: 2024, unemploymentRate: 4.1, underemploymentRate: 7.8, laborForceParticipation: 62.7, sahmIndicatorValue: 0.43, sahmTriggered: false, jobOpeningsPerUnemployed: 1.15, wageGrowthYoy: 3.9, productivityGrowthYoy: 2.4 },
  { year: 2025, unemploymentRate: 4.1, underemploymentRate: 7.7, laborForceParticipation: 62.6, sahmIndicatorValue: 0.28, sahmTriggered: false, jobOpeningsPerUnemployed: 1.12, wageGrowthYoy: 3.6, productivityGrowthYoy: 2.2 },
  { year: 2026, unemploymentRate: 4.0, underemploymentRate: 7.5, laborForceParticipation: 62.6, sahmIndicatorValue: 0.20, sahmTriggered: false, jobOpeningsPerUnemployed: 1.10, wageGrowthYoy: 3.5, productivityGrowthYoy: 2.1 },
];

export const SOVEREIGN_LABOR_PROFILES: SovereignLaborProfile[] = [
  {
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    currentUnemployment: 4.0,
    unemployment12mLow: 3.8,
    sahmValue: 0.20,
    sahmStatus: 'tranquil',
    laborTightness: 'balanced',
    historicalSeries: US_LABOR_HISTORY,
  },
  {
    countryCode: 'DEU',
    countryName: 'Germany',
    flag: '🇩🇪',
    currentUnemployment: 6.1,
    unemployment12mLow: 5.7,
    sahmValue: 0.38,
    sahmStatus: 'elevated',
    laborTightness: 'slack',
    historicalSeries: [
      { year: 2021, unemploymentRate: 5.7, underemploymentRate: 8.2, laborForceParticipation: 78.5, sahmIndicatorValue: 0.12, sahmTriggered: false, jobOpeningsPerUnemployed: 0.85, wageGrowthYoy: 2.8, productivityGrowthYoy: 0.8 },
      { year: 2022, unemploymentRate: 5.3, underemploymentRate: 7.8, laborForceParticipation: 79.2, sahmIndicatorValue: 0.05, sahmTriggered: false, jobOpeningsPerUnemployed: 0.98, wageGrowthYoy: 4.5, productivityGrowthYoy: 0.2 },
      { year: 2023, unemploymentRate: 5.7, underemploymentRate: 8.4, laborForceParticipation: 79.5, sahmIndicatorValue: 0.28, sahmTriggered: false, jobOpeningsPerUnemployed: 0.78, wageGrowthYoy: 5.8, productivityGrowthYoy: -0.6 },
      { year: 2024, unemploymentRate: 6.0, underemploymentRate: 8.8, laborForceParticipation: 79.4, sahmIndicatorValue: 0.35, sahmTriggered: false, jobOpeningsPerUnemployed: 0.65, wageGrowthYoy: 4.2, productivityGrowthYoy: -0.2 },
      { year: 2026, unemploymentRate: 6.1, underemploymentRate: 9.0, laborForceParticipation: 79.2, sahmIndicatorValue: 0.38, sahmTriggered: false, jobOpeningsPerUnemployed: 0.60, wageGrowthYoy: 3.4, productivityGrowthYoy: 0.4 },
    ],
  },
  {
    countryCode: 'GBR',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    currentUnemployment: 4.2,
    unemployment12mLow: 3.9,
    sahmValue: 0.28,
    sahmStatus: 'tranquil',
    laborTightness: 'balanced',
    historicalSeries: [
      { year: 2021, unemploymentRate: 4.5, underemploymentRate: 7.8, laborForceParticipation: 78.6, sahmIndicatorValue: 0.22, sahmTriggered: false, jobOpeningsPerUnemployed: 0.92, wageGrowthYoy: 5.1, productivityGrowthYoy: 1.0 },
      { year: 2022, unemploymentRate: 3.7, underemploymentRate: 6.8, laborForceParticipation: 78.8, sahmIndicatorValue: 0.08, sahmTriggered: false, jobOpeningsPerUnemployed: 1.15, wageGrowthYoy: 6.2, productivityGrowthYoy: 0.5 },
      { year: 2023, unemploymentRate: 4.0, underemploymentRate: 7.2, laborForceParticipation: 78.4, sahmIndicatorValue: 0.25, sahmTriggered: false, jobOpeningsPerUnemployed: 0.88, wageGrowthYoy: 6.8, productivityGrowthYoy: 0.1 },
      { year: 2024, unemploymentRate: 4.3, underemploymentRate: 7.6, laborForceParticipation: 78.2, sahmIndicatorValue: 0.32, sahmTriggered: false, jobOpeningsPerUnemployed: 0.76, wageGrowthYoy: 5.0, productivityGrowthYoy: 0.6 },
      { year: 2026, unemploymentRate: 4.2, underemploymentRate: 7.4, laborForceParticipation: 78.4, sahmIndicatorValue: 0.28, sahmTriggered: false, jobOpeningsPerUnemployed: 0.74, wageGrowthYoy: 4.0, productivityGrowthYoy: 0.9 },
    ],
  },
  {
    countryCode: 'JPN',
    countryName: 'Japan',
    flag: '🇯🇵',
    currentUnemployment: 2.5,
    unemployment12mLow: 2.4,
    sahmValue: 0.08,
    sahmStatus: 'tranquil',
    laborTightness: 'tight',
    historicalSeries: [
      { year: 2021, unemploymentRate: 2.8, underemploymentRate: 4.2, laborForceParticipation: 80.2, sahmIndicatorValue: 0.15, sahmTriggered: false, jobOpeningsPerUnemployed: 1.12, wageGrowthYoy: 0.8, productivityGrowthYoy: 0.6 },
      { year: 2022, unemploymentRate: 2.6, underemploymentRate: 3.9, laborForceParticipation: 80.8, sahmIndicatorValue: 0.06, sahmTriggered: false, jobOpeningsPerUnemployed: 1.28, wageGrowthYoy: 1.8, productivityGrowthYoy: 0.4 },
      { year: 2023, unemploymentRate: 2.6, underemploymentRate: 3.8, laborForceParticipation: 81.2, sahmIndicatorValue: 0.10, sahmTriggered: false, jobOpeningsPerUnemployed: 1.30, wageGrowthYoy: 3.6, productivityGrowthYoy: 0.7 },
      { year: 2024, unemploymentRate: 2.5, underemploymentRate: 3.7, laborForceParticipation: 81.6, sahmIndicatorValue: 0.08, sahmTriggered: false, jobOpeningsPerUnemployed: 1.25, wageGrowthYoy: 5.1, productivityGrowthYoy: 0.8 },
      { year: 2026, unemploymentRate: 2.5, underemploymentRate: 3.6, laborForceParticipation: 81.9, sahmIndicatorValue: 0.08, sahmTriggered: false, jobOpeningsPerUnemployed: 1.26, wageGrowthYoy: 4.8, productivityGrowthYoy: 1.0 },
    ],
  },
  {
    countryCode: 'CAN',
    countryName: 'Canada',
    flag: '🇨🇦',
    currentUnemployment: 6.4,
    unemployment12mLow: 6.1,
    sahmValue: 0.30,
    sahmStatus: 'elevated',
    laborTightness: 'slack',
    historicalSeries: [
      { year: 2021, unemploymentRate: 7.5, underemploymentRate: 9.8, laborForceParticipation: 65.1, sahmIndicatorValue: 0.18, sahmTriggered: false, jobOpeningsPerUnemployed: 0.85, wageGrowthYoy: 2.7, productivityGrowthYoy: -0.5 },
      { year: 2022, unemploymentRate: 5.3, underemploymentRate: 7.2, laborForceParticipation: 65.4, sahmIndicatorValue: 0.05, sahmTriggered: false, jobOpeningsPerUnemployed: 1.12, wageGrowthYoy: 4.8, productivityGrowthYoy: -1.2 },
      { year: 2023, unemploymentRate: 5.4, underemploymentRate: 7.4, laborForceParticipation: 65.6, sahmIndicatorValue: 0.15, sahmTriggered: false, jobOpeningsPerUnemployed: 0.82, wageGrowthYoy: 5.1, productivityGrowthYoy: -0.8 },
      { year: 2024, unemploymentRate: 6.2, underemploymentRate: 8.5, laborForceParticipation: 65.3, sahmIndicatorValue: 0.38, sahmTriggered: false, jobOpeningsPerUnemployed: 0.68, wageGrowthYoy: 4.9, productivityGrowthYoy: 0.4 },
      { year: 2026, unemploymentRate: 6.4, underemploymentRate: 8.6, laborForceParticipation: 65.2, sahmIndicatorValue: 0.30, sahmTriggered: false, jobOpeningsPerUnemployed: 0.65, wageGrowthYoy: 4.2, productivityGrowthYoy: 0.7 },
    ],
  },
  {
    countryCode: 'FRA',
    countryName: 'France',
    flag: '🇫🇷',
    currentUnemployment: 7.4,
    unemployment12mLow: 7.1,
    sahmValue: 0.28,
    sahmStatus: 'tranquil',
    laborTightness: 'balanced',
    historicalSeries: [
      { year: 2021, unemploymentRate: 7.9, underemploymentRate: 11.2, laborForceParticipation: 73.1, sahmIndicatorValue: 0.20, sahmTriggered: false, jobOpeningsPerUnemployed: 0.55, wageGrowthYoy: 2.2, productivityGrowthYoy: 0.8 },
      { year: 2022, unemploymentRate: 7.3, underemploymentRate: 10.4, laborForceParticipation: 73.6, sahmIndicatorValue: 0.06, sahmTriggered: false, jobOpeningsPerUnemployed: 0.72, wageGrowthYoy: 4.0, productivityGrowthYoy: -0.2 },
      { year: 2023, unemploymentRate: 7.3, underemploymentRate: 10.5, laborForceParticipation: 74.0, sahmIndicatorValue: 0.12, sahmTriggered: false, jobOpeningsPerUnemployed: 0.68, wageGrowthYoy: 4.5, productivityGrowthYoy: -0.4 },
      { year: 2024, unemploymentRate: 7.5, underemploymentRate: 10.8, laborForceParticipation: 74.1, sahmIndicatorValue: 0.25, sahmTriggered: false, jobOpeningsPerUnemployed: 0.60, wageGrowthYoy: 3.6, productivityGrowthYoy: 0.2 },
      { year: 2026, unemploymentRate: 7.4, underemploymentRate: 10.6, laborForceParticipation: 74.2, sahmIndicatorValue: 0.28, sahmTriggered: false, jobOpeningsPerUnemployed: 0.58, wageGrowthYoy: 3.2, productivityGrowthYoy: 0.5 },
    ],
  },
  {
    countryCode: 'AUS',
    countryName: 'Australia',
    flag: '🇦🇺',
    currentUnemployment: 4.1,
    unemployment12mLow: 3.9,
    sahmValue: 0.18,
    sahmStatus: 'tranquil',
    laborTightness: 'tight',
    historicalSeries: [
      { year: 2021, unemploymentRate: 5.1, underemploymentRate: 8.5, laborForceParticipation: 66.2, sahmIndicatorValue: 0.16, sahmTriggered: false, jobOpeningsPerUnemployed: 0.95, wageGrowthYoy: 2.3, productivityGrowthYoy: 1.0 },
      { year: 2022, unemploymentRate: 3.7, underemploymentRate: 6.2, laborForceParticipation: 66.8, sahmIndicatorValue: 0.04, sahmTriggered: false, jobOpeningsPerUnemployed: 1.35, wageGrowthYoy: 3.4, productivityGrowthYoy: -1.0 },
      { year: 2023, unemploymentRate: 3.7, underemploymentRate: 6.4, laborForceParticipation: 66.9, sahmIndicatorValue: 0.10, sahmTriggered: false, jobOpeningsPerUnemployed: 1.25, wageGrowthYoy: 4.2, productivityGrowthYoy: -0.3 },
      { year: 2024, unemploymentRate: 4.0, underemploymentRate: 6.8, laborForceParticipation: 67.0, sahmIndicatorValue: 0.22, sahmTriggered: false, jobOpeningsPerUnemployed: 1.15, wageGrowthYoy: 4.1, productivityGrowthYoy: 0.8 },
      { year: 2026, unemploymentRate: 4.1, underemploymentRate: 6.9, laborForceParticipation: 67.1, sahmIndicatorValue: 0.18, sahmTriggered: false, jobOpeningsPerUnemployed: 1.10, wageGrowthYoy: 3.8, productivityGrowthYoy: 1.1 },
    ],
  },
  {
    countryCode: 'CHE',
    countryName: 'Switzerland',
    flag: '🇨🇭',
    currentUnemployment: 2.3,
    unemployment12mLow: 2.1,
    sahmValue: 0.15,
    sahmStatus: 'tranquil',
    laborTightness: 'tight',
    historicalSeries: [
      { year: 2021, unemploymentRate: 3.0, underemploymentRate: 4.5, laborForceParticipation: 83.5, sahmIndicatorValue: 0.18, sahmTriggered: false, jobOpeningsPerUnemployed: 1.10, wageGrowthYoy: 1.2, productivityGrowthYoy: 1.4 },
      { year: 2022, unemploymentRate: 2.2, underemploymentRate: 3.8, laborForceParticipation: 83.8, sahmIndicatorValue: 0.05, sahmTriggered: false, jobOpeningsPerUnemployed: 1.45, wageGrowthYoy: 1.8, productivityGrowthYoy: 0.9 },
      { year: 2023, unemploymentRate: 2.0, underemploymentRate: 3.6, laborForceParticipation: 84.0, sahmIndicatorValue: 0.04, sahmTriggered: false, jobOpeningsPerUnemployed: 1.40, wageGrowthYoy: 2.2, productivityGrowthYoy: 0.8 },
      { year: 2024, unemploymentRate: 2.3, underemploymentRate: 3.9, laborForceParticipation: 84.1, sahmIndicatorValue: 0.18, sahmTriggered: false, jobOpeningsPerUnemployed: 1.30, wageGrowthYoy: 2.0, productivityGrowthYoy: 1.0 },
      { year: 2026, unemploymentRate: 2.3, underemploymentRate: 3.8, laborForceParticipation: 84.2, sahmIndicatorValue: 0.15, sahmTriggered: false, jobOpeningsPerUnemployed: 1.25, wageGrowthYoy: 2.1, productivityGrowthYoy: 1.2 },
    ],
  },
  {
    countryCode: 'KOR',
    countryName: 'South Korea',
    flag: '🇰🇷',
    currentUnemployment: 2.7,
    unemployment12mLow: 2.6,
    sahmValue: 0.10,
    sahmStatus: 'tranquil',
    laborTightness: 'balanced',
    historicalSeries: [
      { year: 2021, unemploymentRate: 3.7, underemploymentRate: 5.6, laborForceParticipation: 62.8, sahmIndicatorValue: 0.20, sahmTriggered: false, jobOpeningsPerUnemployed: 0.80, wageGrowthYoy: 3.1, productivityGrowthYoy: 2.6 },
      { year: 2022, unemploymentRate: 2.9, underemploymentRate: 4.8, laborForceParticipation: 63.9, sahmIndicatorValue: 0.06, sahmTriggered: false, jobOpeningsPerUnemployed: 1.05, wageGrowthYoy: 4.9, productivityGrowthYoy: 1.8 },
      { year: 2023, unemploymentRate: 2.7, underemploymentRate: 4.5, laborForceParticipation: 64.3, sahmIndicatorValue: 0.08, sahmTriggered: false, jobOpeningsPerUnemployed: 1.02, wageGrowthYoy: 3.8, productivityGrowthYoy: 2.0 },
      { year: 2024, unemploymentRate: 2.8, underemploymentRate: 4.6, laborForceParticipation: 64.4, sahmIndicatorValue: 0.12, sahmTriggered: false, jobOpeningsPerUnemployed: 0.98, wageGrowthYoy: 3.5, productivityGrowthYoy: 2.2 },
      { year: 2026, unemploymentRate: 2.7, underemploymentRate: 4.5, laborForceParticipation: 64.5, sahmIndicatorValue: 0.10, sahmTriggered: false, jobOpeningsPerUnemployed: 0.95, wageGrowthYoy: 3.4, productivityGrowthYoy: 2.3 },
    ],
  },
  {
    countryCode: 'ITA',
    countryName: 'Italy',
    flag: '🇮🇹',
    currentUnemployment: 6.8,
    unemployment12mLow: 6.5,
    sahmValue: 0.25,
    sahmStatus: 'tranquil',
    laborTightness: 'slack',
    historicalSeries: [
      { year: 2021, unemploymentRate: 9.5, underemploymentRate: 14.8, laborForceParticipation: 64.2, sahmIndicatorValue: 0.22, sahmTriggered: false, jobOpeningsPerUnemployed: 0.42, wageGrowthYoy: 1.6, productivityGrowthYoy: 0.9 },
      { year: 2022, unemploymentRate: 8.1, underemploymentRate: 13.0, laborForceParticipation: 65.5, sahmIndicatorValue: 0.08, sahmTriggered: false, jobOpeningsPerUnemployed: 0.58, wageGrowthYoy: 2.8, productivityGrowthYoy: -0.4 },
      { year: 2023, unemploymentRate: 7.7, underemploymentRate: 12.2, laborForceParticipation: 66.1, sahmIndicatorValue: 0.15, sahmTriggered: false, jobOpeningsPerUnemployed: 0.56, wageGrowthYoy: 3.2, productivityGrowthYoy: -0.2 },
      { year: 2024, unemploymentRate: 7.0, underemploymentRate: 11.4, laborForceParticipation: 66.5, sahmIndicatorValue: 0.20, sahmTriggered: false, jobOpeningsPerUnemployed: 0.54, wageGrowthYoy: 3.0, productivityGrowthYoy: 0.1 },
      { year: 2026, unemploymentRate: 6.8, underemploymentRate: 11.0, laborForceParticipation: 66.8, sahmIndicatorValue: 0.25, sahmTriggered: false, jobOpeningsPerUnemployed: 0.52, wageGrowthYoy: 2.9, productivityGrowthYoy: 0.3 },
    ],
  },
  {
    countryCode: 'ESP',
    countryName: 'Spain',
    flag: '🇪🇸',
    currentUnemployment: 11.2,
    unemployment12mLow: 11.2,
    sahmValue: 0.05,
    sahmStatus: 'tranquil',
    laborTightness: 'slack',
    historicalSeries: [
      { year: 2021, unemploymentRate: 14.8, underemploymentRate: 20.5, laborForceParticipation: 57.8, sahmIndicatorValue: 0.25, sahmTriggered: false, jobOpeningsPerUnemployed: 0.30, wageGrowthYoy: 2.1, productivityGrowthYoy: 0.5 },
      { year: 2022, unemploymentRate: 12.9, underemploymentRate: 18.2, laborForceParticipation: 58.5, sahmIndicatorValue: 0.08, sahmTriggered: false, jobOpeningsPerUnemployed: 0.40, wageGrowthYoy: 3.4, productivityGrowthYoy: 0.2 },
      { year: 2023, unemploymentRate: 12.1, underemploymentRate: 17.0, laborForceParticipation: 59.0, sahmIndicatorValue: 0.12, sahmTriggered: false, jobOpeningsPerUnemployed: 0.42, wageGrowthYoy: 4.8, productivityGrowthYoy: 0.6 },
      { year: 2024, unemploymentRate: 11.5, underemploymentRate: 16.2, laborForceParticipation: 59.2, sahmIndicatorValue: 0.08, sahmTriggered: false, jobOpeningsPerUnemployed: 0.44, wageGrowthYoy: 4.2, productivityGrowthYoy: 0.8 },
      { year: 2026, unemploymentRate: 11.2, underemploymentRate: 15.8, laborForceParticipation: 59.4, sahmIndicatorValue: 0.05, sahmTriggered: false, jobOpeningsPerUnemployed: 0.42, wageGrowthYoy: 3.8, productivityGrowthYoy: 0.9 },
    ],
  },
  {
    countryCode: 'BRA',
    countryName: 'Brazil',
    flag: '🇧🇷',
    currentUnemployment: 6.9,
    unemployment12mLow: 6.6,
    sahmValue: 0.22,
    sahmStatus: 'tranquil',
    laborTightness: 'balanced',
    historicalSeries: [
      { year: 2021, unemploymentRate: 13.2, underemploymentRate: 24.5, laborForceParticipation: 61.2, sahmIndicatorValue: 0.35, sahmTriggered: false, jobOpeningsPerUnemployed: 0.32, wageGrowthYoy: 4.5, productivityGrowthYoy: 0.8 },
      { year: 2022, unemploymentRate: 9.3, underemploymentRate: 19.2, laborForceParticipation: 62.0, sahmIndicatorValue: 0.06, sahmTriggered: false, jobOpeningsPerUnemployed: 0.45, wageGrowthYoy: 7.8, productivityGrowthYoy: 1.2 },
      { year: 2023, unemploymentRate: 7.8, underemploymentRate: 17.5, laborForceParticipation: 62.1, sahmIndicatorValue: 0.15, sahmTriggered: false, jobOpeningsPerUnemployed: 0.46, wageGrowthYoy: 6.8, productivityGrowthYoy: 1.4 },
      { year: 2024, unemploymentRate: 7.1, underemploymentRate: 16.8, laborForceParticipation: 62.2, sahmIndicatorValue: 0.18, sahmTriggered: false, jobOpeningsPerUnemployed: 0.48, wageGrowthYoy: 6.5, productivityGrowthYoy: 1.6 },
      { year: 2026, unemploymentRate: 6.9, underemploymentRate: 16.4, laborForceParticipation: 62.3, sahmIndicatorValue: 0.22, sahmTriggered: false, jobOpeningsPerUnemployed: 0.48, wageGrowthYoy: 6.2, productivityGrowthYoy: 1.5 },
    ],
  },
  {
    countryCode: 'CHN',
    countryName: 'China',
    flag: '🇨🇳',
    currentUnemployment: 5.1,
    unemployment12mLow: 5.0,
    sahmValue: 0.10,
    sahmStatus: 'tranquil',
    laborTightness: 'slack',
    historicalSeries: [
      { year: 2021, unemploymentRate: 5.1, underemploymentRate: 7.2, laborForceParticipation: 68.2, sahmIndicatorValue: 0.12, sahmTriggered: false, jobOpeningsPerUnemployed: 0.95, wageGrowthYoy: 6.5, productivityGrowthYoy: 5.8 },
      { year: 2022, unemploymentRate: 5.5, underemploymentRate: 8.0, laborForceParticipation: 67.9, sahmIndicatorValue: 0.25, sahmTriggered: false, jobOpeningsPerUnemployed: 0.85, wageGrowthYoy: 5.2, productivityGrowthYoy: 3.5 },
      { year: 2023, unemploymentRate: 5.2, underemploymentRate: 7.6, laborForceParticipation: 68.0, sahmIndicatorValue: 0.15, sahmTriggered: false, jobOpeningsPerUnemployed: 0.84, wageGrowthYoy: 5.0, productivityGrowthYoy: 4.8 },
      { year: 2024, unemploymentRate: 5.1, underemploymentRate: 7.5, laborForceParticipation: 67.9, sahmIndicatorValue: 0.10, sahmTriggered: false, jobOpeningsPerUnemployed: 0.83, wageGrowthYoy: 4.6, productivityGrowthYoy: 4.4 },
      { year: 2026, unemploymentRate: 5.1, underemploymentRate: 7.4, laborForceParticipation: 67.8, sahmIndicatorValue: 0.10, sahmTriggered: false, jobOpeningsPerUnemployed: 0.82, wageGrowthYoy: 4.5, productivityGrowthYoy: 4.2 },
    ],
  },
  {
    "countryCode": "IND",
    "countryName": "India",
    "flag": "🇮🇳",
    "currentUnemployment": 4.9,
    "unemployment12mLow": 4.8,
    "sahmValue": 0.12,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 5.7,
        "underemploymentRate": 10.3,
        "laborForceParticipation": 55.2,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.69,
        "wageGrowthYoy": 9.4,
        "productivityGrowthYoy": 4.5
      },
      {
        "year": 2022,
        "unemploymentRate": 4.6,
        "underemploymentRate": 8.8,
        "laborForceParticipation": 55.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.82,
        "wageGrowthYoy": 9.5,
        "productivityGrowthYoy": 5.6
      },
      {
        "year": 2023,
        "unemploymentRate": 4.8,
        "underemploymentRate": 9.1,
        "laborForceParticipation": 55.5,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.8,
        "wageGrowthYoy": 9.1,
        "productivityGrowthYoy": 5.5
      },
      {
        "year": 2024,
        "unemploymentRate": 5,
        "underemploymentRate": 9.3,
        "laborForceParticipation": 55.4,
        "sahmIndicatorValue": 0.17,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.77,
        "wageGrowthYoy": 8.7,
        "productivityGrowthYoy": 5.4
      },
      {
        "year": 2025,
        "unemploymentRate": 5,
        "underemploymentRate": 9.3,
        "laborForceParticipation": 55.4,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.77,
        "wageGrowthYoy": 8.3,
        "productivityGrowthYoy": 5.4
      },
      {
        "year": 2026,
        "unemploymentRate": 4.9,
        "underemploymentRate": 9.2,
        "laborForceParticipation": 55.4,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.78,
        "wageGrowthYoy": 8.1,
        "productivityGrowthYoy": 5.4
      }
    ]
  },
  {
    "countryCode": "ZAF",
    "countryName": "South Africa",
    "flag": "🇿🇦",
    "currentUnemployment": 31.8,
    "unemployment12mLow": 31.6,
    "sahmValue": 0.24,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 32.6,
        "underemploymentRate": 42.6,
        "laborForceParticipation": 59.6,
        "sahmIndicatorValue": 0.3,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.19,
        "wageGrowthYoy": 6.2,
        "productivityGrowthYoy": -0.3
      },
      {
        "year": 2022,
        "unemploymentRate": 31.5,
        "underemploymentRate": 41.1,
        "laborForceParticipation": 59.9,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.22,
        "wageGrowthYoy": 7.2,
        "productivityGrowthYoy": 0.8
      },
      {
        "year": 2023,
        "unemploymentRate": 31.7,
        "underemploymentRate": 41.4,
        "laborForceParticipation": 59.9,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.2,
        "wageGrowthYoy": 6.8,
        "productivityGrowthYoy": 0.7
      },
      {
        "year": 2024,
        "unemploymentRate": 31.9,
        "underemploymentRate": 41.6,
        "laborForceParticipation": 59.8,
        "sahmIndicatorValue": 0.29,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.17,
        "wageGrowthYoy": 6.3,
        "productivityGrowthYoy": 0.6
      },
      {
        "year": 2025,
        "unemploymentRate": 31.9,
        "underemploymentRate": 41.6,
        "laborForceParticipation": 59.8,
        "sahmIndicatorValue": 0.26,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.17,
        "wageGrowthYoy": 5.8,
        "productivityGrowthYoy": 0.6
      },
      {
        "year": 2026,
        "unemploymentRate": 31.8,
        "underemploymentRate": 41.5,
        "laborForceParticipation": 59.8,
        "sahmIndicatorValue": 0.24,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.18,
        "wageGrowthYoy": 5.7,
        "productivityGrowthYoy": 0.6
      }
    ]
  },
  {
    "countryCode": "NLD",
    "countryName": "Netherlands",
    "flag": "🇳🇱",
    "currentUnemployment": 3.7,
    "unemployment12mLow": 3.6,
    "sahmValue": 0.14,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 4.5,
        "underemploymentRate": 7.2,
        "laborForceParticipation": 82.2,
        "sahmIndicatorValue": 0.2,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.09,
        "wageGrowthYoy": 6.2,
        "productivityGrowthYoy": 0.1
      },
      {
        "year": 2022,
        "unemploymentRate": 3.4,
        "underemploymentRate": 5.7,
        "laborForceParticipation": 82.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.22,
        "wageGrowthYoy": 9.1,
        "productivityGrowthYoy": 1.2
      },
      {
        "year": 2023,
        "unemploymentRate": 3.6,
        "underemploymentRate": 6,
        "laborForceParticipation": 82.5,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.19,
        "wageGrowthYoy": 6.8,
        "productivityGrowthYoy": 1.1
      },
      {
        "year": 2024,
        "unemploymentRate": 3.8,
        "underemploymentRate": 6.2,
        "laborForceParticipation": 82.4,
        "sahmIndicatorValue": 0.19,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.17,
        "wageGrowthYoy": 4.4,
        "productivityGrowthYoy": 1
      },
      {
        "year": 2025,
        "unemploymentRate": 3.8,
        "underemploymentRate": 6.2,
        "laborForceParticipation": 82.4,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.17,
        "wageGrowthYoy": 4.2,
        "productivityGrowthYoy": 1
      },
      {
        "year": 2026,
        "unemploymentRate": 3.7,
        "underemploymentRate": 6.1,
        "laborForceParticipation": 82.4,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.18,
        "wageGrowthYoy": 4,
        "productivityGrowthYoy": 1
      }
    ]
  },
  {
    "countryCode": "SWE",
    "countryName": "Sweden",
    "flag": "🇸🇪",
    "currentUnemployment": 8.1,
    "unemployment12mLow": 7.8,
    "sahmValue": 0.32,
    "sahmStatus": "elevated",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 8.9,
        "underemploymentRate": 12.5,
        "laborForceParticipation": 81.3,
        "sahmIndicatorValue": 0.38,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.55,
        "wageGrowthYoy": 4.7,
        "productivityGrowthYoy": 0.4
      },
      {
        "year": 2022,
        "unemploymentRate": 7.8,
        "underemploymentRate": 11,
        "laborForceParticipation": 81.6,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.68,
        "wageGrowthYoy": 6.8,
        "productivityGrowthYoy": 1.5
      },
      {
        "year": 2023,
        "unemploymentRate": 8,
        "underemploymentRate": 11.3,
        "laborForceParticipation": 81.6,
        "sahmIndicatorValue": 0.22,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.66,
        "wageGrowthYoy": 5.3,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2024,
        "unemploymentRate": 8.2,
        "underemploymentRate": 11.5,
        "laborForceParticipation": 81.5,
        "sahmIndicatorValue": 0.37,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.63,
        "wageGrowthYoy": 3.8,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2025,
        "unemploymentRate": 8.2,
        "underemploymentRate": 11.5,
        "laborForceParticipation": 81.5,
        "sahmIndicatorValue": 0.34,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.63,
        "wageGrowthYoy": 3.4,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2026,
        "unemploymentRate": 8.1,
        "underemploymentRate": 11.4,
        "laborForceParticipation": 81.5,
        "sahmIndicatorValue": 0.32,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.64,
        "wageGrowthYoy": 3.2,
        "productivityGrowthYoy": 1.3
      }
    ]
  },
  {
    "countryCode": "POL",
    "countryName": "Poland",
    "flag": "🇵🇱",
    "currentUnemployment": 2.9,
    "unemployment12mLow": 2.8,
    "sahmValue": 0.08,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 3.7,
        "underemploymentRate": 5.6,
        "laborForceParticipation": 74,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.83,
        "wageGrowthYoy": 10.9,
        "productivityGrowthYoy": 1.9
      },
      {
        "year": 2022,
        "unemploymentRate": 2.6,
        "underemploymentRate": 4.1,
        "laborForceParticipation": 74.3,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.96,
        "wageGrowthYoy": 13.9,
        "productivityGrowthYoy": 3
      },
      {
        "year": 2023,
        "unemploymentRate": 2.8,
        "underemploymentRate": 4.4,
        "laborForceParticipation": 74.3,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.94,
        "wageGrowthYoy": 11.1,
        "productivityGrowthYoy": 2.9
      },
      {
        "year": 2024,
        "unemploymentRate": 3,
        "underemploymentRate": 4.6,
        "laborForceParticipation": 74.2,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.91,
        "wageGrowthYoy": 8.3,
        "productivityGrowthYoy": 2.8
      },
      {
        "year": 2025,
        "unemploymentRate": 2.9,
        "underemploymentRate": 4.6,
        "laborForceParticipation": 74.2,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.91,
        "wageGrowthYoy": 8,
        "productivityGrowthYoy": 2.8
      },
      {
        "year": 2026,
        "unemploymentRate": 2.9,
        "underemploymentRate": 4.5,
        "laborForceParticipation": 74.2,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.92,
        "wageGrowthYoy": 7.8,
        "productivityGrowthYoy": 2.8
      }
    ]
  },
  {
    "countryCode": "RUS",
    "countryName": "Russia",
    "flag": "🇷🇺",
    "currentUnemployment": 2.6,
    "unemployment12mLow": 2.5,
    "sahmValue": 0.06,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 3.4,
        "underemploymentRate": 5.3,
        "laborForceParticipation": 62.6,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.36,
        "wageGrowthYoy": 12.9,
        "productivityGrowthYoy": 0.5
      },
      {
        "year": 2022,
        "unemploymentRate": 2.3,
        "underemploymentRate": 3.8,
        "laborForceParticipation": 62.9,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.49,
        "wageGrowthYoy": 15.7,
        "productivityGrowthYoy": 1.6
      },
      {
        "year": 2023,
        "unemploymentRate": 2.5,
        "underemploymentRate": 4.1,
        "laborForceParticipation": 62.9,
        "sahmIndicatorValue": 0.09,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.47,
        "wageGrowthYoy": 14.3,
        "productivityGrowthYoy": 1.5
      },
      {
        "year": 2024,
        "unemploymentRate": 2.7,
        "underemploymentRate": 4.3,
        "laborForceParticipation": 62.8,
        "sahmIndicatorValue": 0.11,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.44,
        "wageGrowthYoy": 12.9,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2025,
        "unemploymentRate": 2.7,
        "underemploymentRate": 4.3,
        "laborForceParticipation": 62.8,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.44,
        "wageGrowthYoy": 12.2,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2026,
        "unemploymentRate": 2.6,
        "underemploymentRate": 4.2,
        "laborForceParticipation": 62.8,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.45,
        "wageGrowthYoy": 11.9,
        "productivityGrowthYoy": 1.4
      }
    ]
  },
  {
    "countryCode": "TWN",
    "countryName": "Taiwan",
    "flag": "🇹🇼",
    "currentUnemployment": 3.4,
    "unemployment12mLow": 3.3,
    "sahmValue": 0.08,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 4.2,
        "underemploymentRate": 6.1,
        "laborForceParticipation": 59.1,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.02,
        "wageGrowthYoy": 2.6,
        "productivityGrowthYoy": 2
      },
      {
        "year": 2022,
        "unemploymentRate": 3.1,
        "underemploymentRate": 4.6,
        "laborForceParticipation": 59.4,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.16,
        "wageGrowthYoy": 3.4,
        "productivityGrowthYoy": 3.1
      },
      {
        "year": 2023,
        "unemploymentRate": 3.3,
        "underemploymentRate": 4.9,
        "laborForceParticipation": 59.4,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.14,
        "wageGrowthYoy": 3.2,
        "productivityGrowthYoy": 3
      },
      {
        "year": 2024,
        "unemploymentRate": 3.5,
        "underemploymentRate": 5.1,
        "laborForceParticipation": 59.3,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.11,
        "wageGrowthYoy": 3,
        "productivityGrowthYoy": 2.9
      },
      {
        "year": 2025,
        "unemploymentRate": 3.5,
        "underemploymentRate": 5.1,
        "laborForceParticipation": 59.3,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.11,
        "wageGrowthYoy": 2.9,
        "productivityGrowthYoy": 2.9
      },
      {
        "year": 2026,
        "unemploymentRate": 3.4,
        "underemploymentRate": 5,
        "laborForceParticipation": 59.3,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.12,
        "wageGrowthYoy": 2.8,
        "productivityGrowthYoy": 2.9
      }
    ]
  },
  {
    "countryCode": "IDN",
    "countryName": "Indonesia",
    "flag": "🇮🇩",
    "currentUnemployment": 4.8,
    "unemployment12mLow": 4.7,
    "sahmValue": 0.1,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 5.6,
        "underemploymentRate": 9.6,
        "laborForceParticipation": 69.2,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.63,
        "wageGrowthYoy": 5.7,
        "productivityGrowthYoy": 2.7
      },
      {
        "year": 2022,
        "unemploymentRate": 4.5,
        "underemploymentRate": 8.1,
        "laborForceParticipation": 69.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.76,
        "wageGrowthYoy": 6.3,
        "productivityGrowthYoy": 3.8
      },
      {
        "year": 2023,
        "unemploymentRate": 4.7,
        "underemploymentRate": 8.4,
        "laborForceParticipation": 69.5,
        "sahmIndicatorValue": 0.11,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.74,
        "wageGrowthYoy": 5.9,
        "productivityGrowthYoy": 3.7
      },
      {
        "year": 2024,
        "unemploymentRate": 4.9,
        "underemploymentRate": 8.6,
        "laborForceParticipation": 69.4,
        "sahmIndicatorValue": 0.15,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.71,
        "wageGrowthYoy": 5.6,
        "productivityGrowthYoy": 3.6
      },
      {
        "year": 2025,
        "unemploymentRate": 4.9,
        "underemploymentRate": 8.6,
        "laborForceParticipation": 69.4,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.71,
        "wageGrowthYoy": 5.5,
        "productivityGrowthYoy": 3.6
      },
      {
        "year": 2026,
        "unemploymentRate": 4.8,
        "underemploymentRate": 8.5,
        "laborForceParticipation": 69.4,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.72,
        "wageGrowthYoy": 5.5,
        "productivityGrowthYoy": 3.6
      }
    ]
  },
  {
    "countryCode": "SGP",
    "countryName": "Singapore",
    "flag": "🇸🇬",
    "currentUnemployment": 2,
    "unemployment12mLow": 1.9,
    "sahmValue": 0.06,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 2.8,
        "underemploymentRate": 4.3,
        "laborForceParticipation": 70.3,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.29,
        "wageGrowthYoy": 4.5,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2022,
        "unemploymentRate": 1.7,
        "underemploymentRate": 2.8,
        "laborForceParticipation": 70.6,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.42,
        "wageGrowthYoy": 6.2,
        "productivityGrowthYoy": 2.4
      },
      {
        "year": 2023,
        "unemploymentRate": 1.9,
        "underemploymentRate": 3.1,
        "laborForceParticipation": 70.6,
        "sahmIndicatorValue": 0.09,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.4,
        "wageGrowthYoy": 5.2,
        "productivityGrowthYoy": 2.3
      },
      {
        "year": 2024,
        "unemploymentRate": 2.1,
        "underemploymentRate": 3.3,
        "laborForceParticipation": 70.5,
        "sahmIndicatorValue": 0.11,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.37,
        "wageGrowthYoy": 4.1,
        "productivityGrowthYoy": 2.2
      },
      {
        "year": 2025,
        "unemploymentRate": 2.1,
        "underemploymentRate": 3.3,
        "laborForceParticipation": 70.5,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.37,
        "wageGrowthYoy": 4,
        "productivityGrowthYoy": 2.2
      },
      {
        "year": 2026,
        "unemploymentRate": 2,
        "underemploymentRate": 3.2,
        "laborForceParticipation": 70.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.38,
        "wageGrowthYoy": 3.9,
        "productivityGrowthYoy": 2.2
      }
    ]
  },
  {
    "countryCode": "SAU",
    "countryName": "Saudi Arabia",
    "flag": "🇸🇦",
    "currentUnemployment": 3.7,
    "unemployment12mLow": 3.6,
    "sahmValue": 0.08,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 4.5,
        "underemploymentRate": 7.5,
        "laborForceParticipation": 61.3,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.87,
        "wageGrowthYoy": 4.2,
        "productivityGrowthYoy": 1.2
      },
      {
        "year": 2022,
        "unemploymentRate": 3.4,
        "underemploymentRate": 6,
        "laborForceParticipation": 61.6,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1,
        "wageGrowthYoy": 3.9,
        "productivityGrowthYoy": 2.3
      },
      {
        "year": 2023,
        "unemploymentRate": 3.6,
        "underemploymentRate": 6.3,
        "laborForceParticipation": 61.6,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.98,
        "wageGrowthYoy": 3.7,
        "productivityGrowthYoy": 2.2
      },
      {
        "year": 2024,
        "unemploymentRate": 3.8,
        "underemploymentRate": 6.5,
        "laborForceParticipation": 61.5,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.95,
        "wageGrowthYoy": 3.5,
        "productivityGrowthYoy": 2.1
      },
      {
        "year": 2025,
        "unemploymentRate": 3.8,
        "underemploymentRate": 6.5,
        "laborForceParticipation": 61.5,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.95,
        "wageGrowthYoy": 3.5,
        "productivityGrowthYoy": 2.1
      },
      {
        "year": 2026,
        "unemploymentRate": 3.7,
        "underemploymentRate": 6.4,
        "laborForceParticipation": 61.5,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.96,
        "wageGrowthYoy": 3.5,
        "productivityGrowthYoy": 2.1
      }
    ]
  },
  {
    "countryCode": "ARE",
    "countryName": "United Arab Emirates",
    "flag": "🇦🇪",
    "currentUnemployment": 2.7,
    "unemployment12mLow": 2.6,
    "sahmValue": 0.06,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 3.5,
        "underemploymentRate": 5.5,
        "laborForceParticipation": 81.9,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.15,
        "wageGrowthYoy": 3.8,
        "productivityGrowthYoy": 1.6
      },
      {
        "year": 2022,
        "unemploymentRate": 2.4,
        "underemploymentRate": 4,
        "laborForceParticipation": 82.2,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.28,
        "wageGrowthYoy": 5.7,
        "productivityGrowthYoy": 2.7
      },
      {
        "year": 2023,
        "unemploymentRate": 2.6,
        "underemploymentRate": 4.3,
        "laborForceParticipation": 82.2,
        "sahmIndicatorValue": 0.09,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.25,
        "wageGrowthYoy": 5,
        "productivityGrowthYoy": 2.6
      },
      {
        "year": 2024,
        "unemploymentRate": 2.8,
        "underemploymentRate": 4.5,
        "laborForceParticipation": 82.1,
        "sahmIndicatorValue": 0.11,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.23,
        "wageGrowthYoy": 4.3,
        "productivityGrowthYoy": 2.5
      },
      {
        "year": 2025,
        "unemploymentRate": 2.8,
        "underemploymentRate": 4.5,
        "laborForceParticipation": 82.1,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.23,
        "wageGrowthYoy": 4.2,
        "productivityGrowthYoy": 2.5
      },
      {
        "year": 2026,
        "unemploymentRate": 2.7,
        "underemploymentRate": 4.4,
        "laborForceParticipation": 82.1,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.24,
        "wageGrowthYoy": 4.1,
        "productivityGrowthYoy": 2.5
      }
    ]
  },
  {
    "countryCode": "TUR",
    "countryName": "Turkey",
    "flag": "🇹🇷",
    "currentUnemployment": 8.6,
    "unemployment12mLow": 8.4,
    "sahmValue": 0.18,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 9.4,
        "underemploymentRate": 15.3,
        "laborForceParticipation": 54,
        "sahmIndicatorValue": 0.24,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.44,
        "wageGrowthYoy": 55.9,
        "productivityGrowthYoy": 1.2
      },
      {
        "year": 2022,
        "unemploymentRate": 8.3,
        "underemploymentRate": 13.8,
        "laborForceParticipation": 54.3,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.58,
        "wageGrowthYoy": 72.4,
        "productivityGrowthYoy": 2.3
      },
      {
        "year": 2023,
        "unemploymentRate": 8.5,
        "underemploymentRate": 14.1,
        "laborForceParticipation": 54.3,
        "sahmIndicatorValue": 0.15,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.55,
        "wageGrowthYoy": 67.3,
        "productivityGrowthYoy": 2.2
      },
      {
        "year": 2024,
        "unemploymentRate": 8.7,
        "underemploymentRate": 14.3,
        "laborForceParticipation": 54.2,
        "sahmIndicatorValue": 0.23,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.53,
        "wageGrowthYoy": 62.2,
        "productivityGrowthYoy": 2.1
      },
      {
        "year": 2025,
        "unemploymentRate": 8.7,
        "underemploymentRate": 14.3,
        "laborForceParticipation": 54.2,
        "sahmIndicatorValue": 0.2,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.53,
        "wageGrowthYoy": 53.8,
        "productivityGrowthYoy": 2.1
      },
      {
        "year": 2026,
        "unemploymentRate": 8.6,
        "underemploymentRate": 14.2,
        "laborForceParticipation": 54.2,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.54,
        "wageGrowthYoy": 48.9,
        "productivityGrowthYoy": 2.1
      }
    ]
  },
  {
    "countryCode": "MEX",
    "countryName": "Mexico",
    "flag": "🇲🇽",
    "currentUnemployment": 2.8,
    "unemployment12mLow": 2.7,
    "sahmValue": 0.12,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 3.6,
        "underemploymentRate": 8.7,
        "laborForceParticipation": 60.2,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.75,
        "wageGrowthYoy": 8.2,
        "productivityGrowthYoy": 0.2
      },
      {
        "year": 2022,
        "unemploymentRate": 2.5,
        "underemploymentRate": 7.2,
        "laborForceParticipation": 60.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.88,
        "wageGrowthYoy": 9.4,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2023,
        "unemploymentRate": 2.7,
        "underemploymentRate": 7.5,
        "laborForceParticipation": 60.5,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.86,
        "wageGrowthYoy": 8.5,
        "productivityGrowthYoy": 1.2
      },
      {
        "year": 2024,
        "unemploymentRate": 2.9,
        "underemploymentRate": 7.7,
        "laborForceParticipation": 60.4,
        "sahmIndicatorValue": 0.17,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.83,
        "wageGrowthYoy": 7.6,
        "productivityGrowthYoy": 1.1
      },
      {
        "year": 2025,
        "unemploymentRate": 2.8,
        "underemploymentRate": 7.7,
        "laborForceParticipation": 60.4,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.83,
        "wageGrowthYoy": 7.3,
        "productivityGrowthYoy": 1.1
      },
      {
        "year": 2026,
        "unemploymentRate": 2.8,
        "underemploymentRate": 7.6,
        "laborForceParticipation": 60.4,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.84,
        "wageGrowthYoy": 7.1,
        "productivityGrowthYoy": 1.1
      }
    ]
  },
  {
    "countryCode": "ARG",
    "countryName": "Argentina",
    "flag": "🇦🇷",
    "currentUnemployment": 7.2,
    "unemployment12mLow": 6.9,
    "sahmValue": 0.34,
    "sahmStatus": "elevated",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 8,
        "underemploymentRate": 16.9,
        "laborForceParticipation": 62.9,
        "sahmIndicatorValue": 0.4,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.36,
        "wageGrowthYoy": 75.1,
        "productivityGrowthYoy": 0.7
      },
      {
        "year": 2022,
        "unemploymentRate": 6.9,
        "underemploymentRate": 15.4,
        "laborForceParticipation": 63.2,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.49,
        "wageGrowthYoy": 83.4,
        "productivityGrowthYoy": 1.8
      },
      {
        "year": 2023,
        "unemploymentRate": 7.1,
        "underemploymentRate": 15.7,
        "laborForceParticipation": 63.2,
        "sahmIndicatorValue": 0.23,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.47,
        "wageGrowthYoy": 102,
        "productivityGrowthYoy": 1.7
      },
      {
        "year": 2024,
        "unemploymentRate": 7.3,
        "underemploymentRate": 15.9,
        "laborForceParticipation": 63.1,
        "sahmIndicatorValue": 0.39,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.44,
        "wageGrowthYoy": 120.6,
        "productivityGrowthYoy": 1.6
      },
      {
        "year": 2025,
        "unemploymentRate": 7.3,
        "underemploymentRate": 15.9,
        "laborForceParticipation": 63.1,
        "sahmIndicatorValue": 0.36,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.44,
        "wageGrowthYoy": 79.4,
        "productivityGrowthYoy": 1.6
      },
      {
        "year": 2026,
        "unemploymentRate": 7.2,
        "underemploymentRate": 15.8,
        "laborForceParticipation": 63.1,
        "sahmIndicatorValue": 0.34,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.45,
        "wageGrowthYoy": 66.7,
        "productivityGrowthYoy": 1.6
      }
    ]
  },
  {
    "countryCode": "CHL",
    "countryName": "Chile",
    "flag": "🇨🇱",
    "currentUnemployment": 8.2,
    "unemployment12mLow": 8,
    "sahmValue": 0.22,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 9,
        "underemploymentRate": 14.5,
        "laborForceParticipation": 61.9,
        "sahmIndicatorValue": 0.28,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.43,
        "wageGrowthYoy": 7.8,
        "productivityGrowthYoy": 0.5
      },
      {
        "year": 2022,
        "unemploymentRate": 7.9,
        "underemploymentRate": 13,
        "laborForceParticipation": 62.2,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.56,
        "wageGrowthYoy": 10.1,
        "productivityGrowthYoy": 1.6
      },
      {
        "year": 2023,
        "unemploymentRate": 8.1,
        "underemploymentRate": 13.3,
        "laborForceParticipation": 62.2,
        "sahmIndicatorValue": 0.17,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.54,
        "wageGrowthYoy": 8.2,
        "productivityGrowthYoy": 1.5
      },
      {
        "year": 2024,
        "unemploymentRate": 8.3,
        "underemploymentRate": 13.5,
        "laborForceParticipation": 62.1,
        "sahmIndicatorValue": 0.27,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.51,
        "wageGrowthYoy": 6.2,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2025,
        "unemploymentRate": 8.3,
        "underemploymentRate": 13.5,
        "laborForceParticipation": 62.1,
        "sahmIndicatorValue": 0.24,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.51,
        "wageGrowthYoy": 5.7,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2026,
        "unemploymentRate": 8.2,
        "underemploymentRate": 13.4,
        "laborForceParticipation": 62.1,
        "sahmIndicatorValue": 0.22,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.52,
        "wageGrowthYoy": 5.5,
        "productivityGrowthYoy": 1.4
      }
    ]
  },
  {
    "countryCode": "COL",
    "countryName": "Colombia",
    "flag": "🇨🇴",
    "currentUnemployment": 9.6,
    "unemployment12mLow": 9.4,
    "sahmValue": 0.2,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 10.4,
        "underemploymentRate": 17.3,
        "laborForceParticipation": 63.8,
        "sahmIndicatorValue": 0.26,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.37,
        "wageGrowthYoy": 8.9,
        "productivityGrowthYoy": 0.3
      },
      {
        "year": 2022,
        "unemploymentRate": 9.3,
        "underemploymentRate": 15.8,
        "laborForceParticipation": 64.1,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.5,
        "wageGrowthYoy": 11,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2023,
        "unemploymentRate": 9.5,
        "underemploymentRate": 16.1,
        "laborForceParticipation": 64.1,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.48,
        "wageGrowthYoy": 10.1,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2024,
        "unemploymentRate": 9.7,
        "underemploymentRate": 16.3,
        "laborForceParticipation": 64,
        "sahmIndicatorValue": 0.25,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.45,
        "wageGrowthYoy": 9.2,
        "productivityGrowthYoy": 1.2
      },
      {
        "year": 2025,
        "unemploymentRate": 9.7,
        "underemploymentRate": 16.3,
        "laborForceParticipation": 64,
        "sahmIndicatorValue": 0.22,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.45,
        "wageGrowthYoy": 8.4,
        "productivityGrowthYoy": 1.2
      },
      {
        "year": 2026,
        "unemploymentRate": 9.6,
        "underemploymentRate": 16.2,
        "laborForceParticipation": 64,
        "sahmIndicatorValue": 0.2,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.46,
        "wageGrowthYoy": 8,
        "productivityGrowthYoy": 1.2
      }
    ]
  },
  {
    "countryCode": "EGY",
    "countryName": "Egypt",
    "flag": "🇪🇬",
    "currentUnemployment": 6.7,
    "unemployment12mLow": 6.6,
    "sahmValue": 0.14,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 7.5,
        "underemploymentRate": 13.9,
        "laborForceParticipation": 44.3,
        "sahmIndicatorValue": 0.2,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.39,
        "wageGrowthYoy": 22.6,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2022,
        "unemploymentRate": 6.4,
        "underemploymentRate": 12.4,
        "laborForceParticipation": 44.6,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.52,
        "wageGrowthYoy": 24.8,
        "productivityGrowthYoy": 2.4
      },
      {
        "year": 2023,
        "unemploymentRate": 6.6,
        "underemploymentRate": 12.7,
        "laborForceParticipation": 44.6,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.5,
        "wageGrowthYoy": 30.2,
        "productivityGrowthYoy": 2.3
      },
      {
        "year": 2024,
        "unemploymentRate": 6.8,
        "underemploymentRate": 12.9,
        "laborForceParticipation": 44.5,
        "sahmIndicatorValue": 0.19,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.47,
        "wageGrowthYoy": 35.6,
        "productivityGrowthYoy": 2.2
      },
      {
        "year": 2025,
        "unemploymentRate": 6.8,
        "underemploymentRate": 12.9,
        "laborForceParticipation": 44.5,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.47,
        "wageGrowthYoy": 30.3,
        "productivityGrowthYoy": 2.2
      },
      {
        "year": 2026,
        "unemploymentRate": 6.7,
        "underemploymentRate": 12.8,
        "laborForceParticipation": 44.5,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.48,
        "wageGrowthYoy": 26.8,
        "productivityGrowthYoy": 2.2
      }
    ]
  },
  {
    "countryCode": "NGA",
    "countryName": "Nigeria",
    "flag": "🇳🇬",
    "currentUnemployment": 5.4,
    "unemployment12mLow": 5.2,
    "sahmValue": 0.16,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 6.2,
        "underemploymentRate": 19.6,
        "laborForceParticipation": 59,
        "sahmIndicatorValue": 0.22,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.27,
        "wageGrowthYoy": 23.5,
        "productivityGrowthYoy": 0.6
      },
      {
        "year": 2022,
        "unemploymentRate": 5.1,
        "underemploymentRate": 18.1,
        "laborForceParticipation": 59.3,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.39,
        "wageGrowthYoy": 25,
        "productivityGrowthYoy": 1.7
      },
      {
        "year": 2023,
        "unemploymentRate": 5.3,
        "underemploymentRate": 18.4,
        "laborForceParticipation": 59.3,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.37,
        "wageGrowthYoy": 28.6,
        "productivityGrowthYoy": 1.6
      },
      {
        "year": 2024,
        "unemploymentRate": 5.5,
        "underemploymentRate": 18.6,
        "laborForceParticipation": 59.2,
        "sahmIndicatorValue": 0.21,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.34,
        "wageGrowthYoy": 32.1,
        "productivityGrowthYoy": 1.5
      },
      {
        "year": 2025,
        "unemploymentRate": 5.5,
        "underemploymentRate": 18.6,
        "laborForceParticipation": 59.2,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.34,
        "wageGrowthYoy": 28.1,
        "productivityGrowthYoy": 1.5
      },
      {
        "year": 2026,
        "unemploymentRate": 5.4,
        "underemploymentRate": 18.5,
        "laborForceParticipation": 59.2,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.35,
        "wageGrowthYoy": 24.6,
        "productivityGrowthYoy": 1.5
      }
    ]
  },
  {
    "countryCode": "NOR",
    "countryName": "Norway",
    "flag": "🇳🇴",
    "currentUnemployment": 3.9,
    "unemployment12mLow": 3.7,
    "sahmValue": 0.16,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 4.7,
        "underemploymentRate": 6.9,
        "laborForceParticipation": 79.2,
        "sahmIndicatorValue": 0.22,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.99,
        "wageGrowthYoy": 5,
        "productivityGrowthYoy": 0.3
      },
      {
        "year": 2022,
        "unemploymentRate": 3.6,
        "underemploymentRate": 5.4,
        "laborForceParticipation": 79.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.12,
        "wageGrowthYoy": 6.2,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2023,
        "unemploymentRate": 3.8,
        "underemploymentRate": 5.7,
        "laborForceParticipation": 79.5,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.1,
        "wageGrowthYoy": 5.5,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2024,
        "unemploymentRate": 4,
        "underemploymentRate": 5.9,
        "laborForceParticipation": 79.4,
        "sahmIndicatorValue": 0.21,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.07,
        "wageGrowthYoy": 4.8,
        "productivityGrowthYoy": 1.2
      },
      {
        "year": 2025,
        "unemploymentRate": 4,
        "underemploymentRate": 5.9,
        "laborForceParticipation": 79.4,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.07,
        "wageGrowthYoy": 4.6,
        "productivityGrowthYoy": 1.2
      },
      {
        "year": 2026,
        "unemploymentRate": 3.9,
        "underemploymentRate": 5.8,
        "laborForceParticipation": 79.4,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.08,
        "wageGrowthYoy": 4.6,
        "productivityGrowthYoy": 1.2
      }
    ]
  },
  {
    "countryCode": "IRL",
    "countryName": "Ireland",
    "flag": "🇮🇪",
    "currentUnemployment": 4.3,
    "unemployment12mLow": 4.2,
    "sahmValue": 0.14,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 5.1,
        "underemploymentRate": 7.9,
        "laborForceParticipation": 75.6,
        "sahmIndicatorValue": 0.2,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.93,
        "wageGrowthYoy": 5,
        "productivityGrowthYoy": 1.7
      },
      {
        "year": 2022,
        "unemploymentRate": 4,
        "underemploymentRate": 6.4,
        "laborForceParticipation": 75.9,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.06,
        "wageGrowthYoy": 7.2,
        "productivityGrowthYoy": 2.8
      },
      {
        "year": 2023,
        "unemploymentRate": 4.2,
        "underemploymentRate": 6.7,
        "laborForceParticipation": 75.9,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.04,
        "wageGrowthYoy": 5.7,
        "productivityGrowthYoy": 2.7
      },
      {
        "year": 2024,
        "unemploymentRate": 4.4,
        "underemploymentRate": 6.9,
        "laborForceParticipation": 75.8,
        "sahmIndicatorValue": 0.19,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.01,
        "wageGrowthYoy": 4.2,
        "productivityGrowthYoy": 2.6
      },
      {
        "year": 2025,
        "unemploymentRate": 4.4,
        "underemploymentRate": 6.9,
        "laborForceParticipation": 75.8,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.01,
        "wageGrowthYoy": 4.1,
        "productivityGrowthYoy": 2.6
      },
      {
        "year": 2026,
        "unemploymentRate": 4.3,
        "underemploymentRate": 6.8,
        "laborForceParticipation": 75.8,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.02,
        "wageGrowthYoy": 4.1,
        "productivityGrowthYoy": 2.6
      }
    ]
  },
  {
    "countryCode": "BEL",
    "countryName": "Belgium",
    "flag": "🇧🇪",
    "currentUnemployment": 5.6,
    "unemployment12mLow": 5.4,
    "sahmValue": 0.18,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 6.4,
        "underemploymentRate": 9.5,
        "laborForceParticipation": 70.4,
        "sahmIndicatorValue": 0.24,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.77,
        "wageGrowthYoy": 4.8,
        "productivityGrowthYoy": -0.1
      },
      {
        "year": 2022,
        "unemploymentRate": 5.3,
        "underemploymentRate": 8,
        "laborForceParticipation": 70.7,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.9,
        "wageGrowthYoy": 7.2,
        "productivityGrowthYoy": 1
      },
      {
        "year": 2023,
        "unemploymentRate": 5.5,
        "underemploymentRate": 8.3,
        "laborForceParticipation": 70.7,
        "sahmIndicatorValue": 0.15,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.88,
        "wageGrowthYoy": 5.4,
        "productivityGrowthYoy": 0.9
      },
      {
        "year": 2024,
        "unemploymentRate": 5.7,
        "underemploymentRate": 8.5,
        "laborForceParticipation": 70.6,
        "sahmIndicatorValue": 0.23,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.85,
        "wageGrowthYoy": 3.5,
        "productivityGrowthYoy": 0.8
      },
      {
        "year": 2025,
        "unemploymentRate": 5.6,
        "underemploymentRate": 8.5,
        "laborForceParticipation": 70.6,
        "sahmIndicatorValue": 0.2,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.85,
        "wageGrowthYoy": 3.3,
        "productivityGrowthYoy": 0.8
      },
      {
        "year": 2026,
        "unemploymentRate": 5.6,
        "underemploymentRate": 8.4,
        "laborForceParticipation": 70.6,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.86,
        "wageGrowthYoy": 3.2,
        "productivityGrowthYoy": 0.8
      }
    ]
  },
  {
    "countryCode": "AUT",
    "countryName": "Austria",
    "flag": "🇦🇹",
    "currentUnemployment": 5.2,
    "unemployment12mLow": 5,
    "sahmValue": 0.22,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 6,
        "underemploymentRate": 9,
        "laborForceParticipation": 77.2,
        "sahmIndicatorValue": 0.28,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.79,
        "wageGrowthYoy": 5.1,
        "productivityGrowthYoy": -0.2
      },
      {
        "year": 2022,
        "unemploymentRate": 4.9,
        "underemploymentRate": 7.5,
        "laborForceParticipation": 77.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.92,
        "wageGrowthYoy": 7.1,
        "productivityGrowthYoy": 0.9
      },
      {
        "year": 2023,
        "unemploymentRate": 5.1,
        "underemploymentRate": 7.8,
        "laborForceParticipation": 77.5,
        "sahmIndicatorValue": 0.17,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.9,
        "wageGrowthYoy": 5.5,
        "productivityGrowthYoy": 0.8
      },
      {
        "year": 2024,
        "unemploymentRate": 5.3,
        "underemploymentRate": 8,
        "laborForceParticipation": 77.4,
        "sahmIndicatorValue": 0.27,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.87,
        "wageGrowthYoy": 3.9,
        "productivityGrowthYoy": 0.7
      },
      {
        "year": 2025,
        "unemploymentRate": 5.3,
        "underemploymentRate": 8,
        "laborForceParticipation": 77.4,
        "sahmIndicatorValue": 0.24,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.87,
        "wageGrowthYoy": 3.8,
        "productivityGrowthYoy": 0.7
      },
      {
        "year": 2026,
        "unemploymentRate": 5.2,
        "underemploymentRate": 7.9,
        "laborForceParticipation": 77.4,
        "sahmIndicatorValue": 0.22,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.88,
        "wageGrowthYoy": 3.8,
        "productivityGrowthYoy": 0.7
      }
    ]
  },
  {
    "countryCode": "DNK",
    "countryName": "Denmark",
    "flag": "🇩🇰",
    "currentUnemployment": 2.9,
    "unemployment12mLow": 2.8,
    "sahmValue": 0.12,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 3.7,
        "underemploymentRate": 5.9,
        "laborForceParticipation": 80.4,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.05,
        "wageGrowthYoy": 4.8,
        "productivityGrowthYoy": 0.9
      },
      {
        "year": 2022,
        "unemploymentRate": 2.6,
        "underemploymentRate": 4.4,
        "laborForceParticipation": 80.7,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.18,
        "wageGrowthYoy": 6.8,
        "productivityGrowthYoy": 2
      },
      {
        "year": 2023,
        "unemploymentRate": 2.8,
        "underemploymentRate": 4.7,
        "laborForceParticipation": 80.7,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.15,
        "wageGrowthYoy": 5.3,
        "productivityGrowthYoy": 1.9
      },
      {
        "year": 2024,
        "unemploymentRate": 3,
        "underemploymentRate": 4.9,
        "laborForceParticipation": 80.6,
        "sahmIndicatorValue": 0.17,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.13,
        "wageGrowthYoy": 3.7,
        "productivityGrowthYoy": 1.8
      },
      {
        "year": 2025,
        "unemploymentRate": 2.9,
        "underemploymentRate": 4.9,
        "laborForceParticipation": 80.6,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.13,
        "wageGrowthYoy": 3.6,
        "productivityGrowthYoy": 1.8
      },
      {
        "year": 2026,
        "unemploymentRate": 2.9,
        "underemploymentRate": 4.8,
        "laborForceParticipation": 80.6,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.14,
        "wageGrowthYoy": 3.6,
        "productivityGrowthYoy": 1.8
      }
    ]
  },
  {
    "countryCode": "ISR",
    "countryName": "Israel",
    "flag": "🇮🇱",
    "currentUnemployment": 3.2,
    "unemployment12mLow": 3.1,
    "sahmValue": 0.14,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 4,
        "underemploymentRate": 6.2,
        "laborForceParticipation": 63.2,
        "sahmIndicatorValue": 0.2,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.97,
        "wageGrowthYoy": 4.3,
        "productivityGrowthYoy": 1.1
      },
      {
        "year": 2022,
        "unemploymentRate": 2.9,
        "underemploymentRate": 4.7,
        "laborForceParticipation": 63.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.1,
        "wageGrowthYoy": 5.6,
        "productivityGrowthYoy": 2.2
      },
      {
        "year": 2023,
        "unemploymentRate": 3.1,
        "underemploymentRate": 5,
        "laborForceParticipation": 63.5,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.08,
        "wageGrowthYoy": 5.3,
        "productivityGrowthYoy": 2.1
      },
      {
        "year": 2024,
        "unemploymentRate": 3.3,
        "underemploymentRate": 5.2,
        "laborForceParticipation": 63.4,
        "sahmIndicatorValue": 0.19,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.05,
        "wageGrowthYoy": 5,
        "productivityGrowthYoy": 2
      },
      {
        "year": 2025,
        "unemploymentRate": 3.3,
        "underemploymentRate": 5.2,
        "laborForceParticipation": 63.4,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.05,
        "wageGrowthYoy": 5,
        "productivityGrowthYoy": 2
      },
      {
        "year": 2026,
        "unemploymentRate": 3.2,
        "underemploymentRate": 5.1,
        "laborForceParticipation": 63.4,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.06,
        "wageGrowthYoy": 4.9,
        "productivityGrowthYoy": 2
      }
    ]
  },
  {
    "countryCode": "VNM",
    "countryName": "Vietnam",
    "flag": "🇻🇳",
    "currentUnemployment": 2.2,
    "unemployment12mLow": 2.1,
    "sahmValue": 0.06,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 3,
        "underemploymentRate": 5.7,
        "laborForceParticipation": 74.6,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.06,
        "wageGrowthYoy": 7.2,
        "productivityGrowthYoy": 4.2
      },
      {
        "year": 2022,
        "unemploymentRate": 1.9,
        "underemploymentRate": 4.2,
        "laborForceParticipation": 74.9,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.19,
        "wageGrowthYoy": 7.2,
        "productivityGrowthYoy": 5.3
      },
      {
        "year": 2023,
        "unemploymentRate": 2.1,
        "underemploymentRate": 4.5,
        "laborForceParticipation": 74.9,
        "sahmIndicatorValue": 0.09,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.17,
        "wageGrowthYoy": 7.4,
        "productivityGrowthYoy": 5.2
      },
      {
        "year": 2024,
        "unemploymentRate": 2.3,
        "underemploymentRate": 4.7,
        "laborForceParticipation": 74.8,
        "sahmIndicatorValue": 0.11,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.14,
        "wageGrowthYoy": 7.5,
        "productivityGrowthYoy": 5.1
      },
      {
        "year": 2025,
        "unemploymentRate": 2.3,
        "underemploymentRate": 4.7,
        "laborForceParticipation": 74.8,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.14,
        "wageGrowthYoy": 7.5,
        "productivityGrowthYoy": 5.1
      },
      {
        "year": 2026,
        "unemploymentRate": 2.2,
        "underemploymentRate": 4.6,
        "laborForceParticipation": 74.8,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.15,
        "wageGrowthYoy": 7.5,
        "productivityGrowthYoy": 5.1
      }
    ]
  },
  {
    "countryCode": "MYS",
    "countryName": "Malaysia",
    "flag": "🇲🇾",
    "currentUnemployment": 3.3,
    "unemployment12mLow": 3.2,
    "sahmValue": 0.08,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 4.1,
        "underemploymentRate": 6.5,
        "laborForceParticipation": 70,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.85,
        "wageGrowthYoy": 3.8,
        "productivityGrowthYoy": 2.3
      },
      {
        "year": 2022,
        "unemploymentRate": 3,
        "underemploymentRate": 5,
        "laborForceParticipation": 70.3,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.98,
        "wageGrowthYoy": 5,
        "productivityGrowthYoy": 3.4
      },
      {
        "year": 2023,
        "unemploymentRate": 3.2,
        "underemploymentRate": 5.3,
        "laborForceParticipation": 70.3,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.96,
        "wageGrowthYoy": 4.7,
        "productivityGrowthYoy": 3.3
      },
      {
        "year": 2024,
        "unemploymentRate": 3.4,
        "underemploymentRate": 5.5,
        "laborForceParticipation": 70.2,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.93,
        "wageGrowthYoy": 4.3,
        "productivityGrowthYoy": 3.2
      },
      {
        "year": 2025,
        "unemploymentRate": 3.4,
        "underemploymentRate": 5.5,
        "laborForceParticipation": 70.2,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.93,
        "wageGrowthYoy": 4.3,
        "productivityGrowthYoy": 3.2
      },
      {
        "year": 2026,
        "unemploymentRate": 3.3,
        "underemploymentRate": 5.4,
        "laborForceParticipation": 70.2,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.94,
        "wageGrowthYoy": 4.3,
        "productivityGrowthYoy": 3.2
      }
    ]
  },
  {
    "countryCode": "PHL",
    "countryName": "Philippines",
    "flag": "🇵🇭",
    "currentUnemployment": 4.1,
    "unemployment12mLow": 4,
    "sahmValue": 0.1,
    "sahmStatus": "tranquil",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 4.9,
        "underemploymentRate": 12.9,
        "laborForceParticipation": 64.4,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.67,
        "wageGrowthYoy": 6.6,
        "productivityGrowthYoy": 3.2
      },
      {
        "year": 2022,
        "unemploymentRate": 3.8,
        "underemploymentRate": 11.4,
        "laborForceParticipation": 64.7,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.8,
        "wageGrowthYoy": 7.4,
        "productivityGrowthYoy": 4.3
      },
      {
        "year": 2023,
        "unemploymentRate": 4,
        "underemploymentRate": 11.7,
        "laborForceParticipation": 64.7,
        "sahmIndicatorValue": 0.11,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.78,
        "wageGrowthYoy": 6.8,
        "productivityGrowthYoy": 4.2
      },
      {
        "year": 2024,
        "unemploymentRate": 4.2,
        "underemploymentRate": 11.9,
        "laborForceParticipation": 64.6,
        "sahmIndicatorValue": 0.15,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.75,
        "wageGrowthYoy": 6.1,
        "productivityGrowthYoy": 4.1
      },
      {
        "year": 2025,
        "unemploymentRate": 4.1,
        "underemploymentRate": 11.9,
        "laborForceParticipation": 64.6,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.75,
        "wageGrowthYoy": 6.2,
        "productivityGrowthYoy": 4.1
      },
      {
        "year": 2026,
        "unemploymentRate": 4.1,
        "underemploymentRate": 11.8,
        "laborForceParticipation": 64.6,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.76,
        "wageGrowthYoy": 6.2,
        "productivityGrowthYoy": 4.1
      }
    ]
  },
  {
    "countryCode": "NZL",
    "countryName": "New Zealand",
    "flag": "🇳🇿",
    "currentUnemployment": 4.8,
    "unemployment12mLow": 4.5,
    "sahmValue": 0.34,
    "sahmStatus": "elevated",
    "laborTightness": "balanced",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 5.6,
        "underemploymentRate": 9,
        "laborForceParticipation": 71,
        "sahmIndicatorValue": 0.4,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.59,
        "wageGrowthYoy": 4.8,
        "productivityGrowthYoy": -0.1
      },
      {
        "year": 2022,
        "unemploymentRate": 4.5,
        "underemploymentRate": 7.5,
        "laborForceParticipation": 71.3,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.72,
        "wageGrowthYoy": 6.3,
        "productivityGrowthYoy": 1
      },
      {
        "year": 2023,
        "unemploymentRate": 4.7,
        "underemploymentRate": 7.8,
        "laborForceParticipation": 71.3,
        "sahmIndicatorValue": 0.23,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.7,
        "wageGrowthYoy": 5.1,
        "productivityGrowthYoy": 0.9
      },
      {
        "year": 2024,
        "unemploymentRate": 4.9,
        "underemploymentRate": 8,
        "laborForceParticipation": 71.2,
        "sahmIndicatorValue": 0.39,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.67,
        "wageGrowthYoy": 3.9,
        "productivityGrowthYoy": 0.8
      },
      {
        "year": 2025,
        "unemploymentRate": 4.9,
        "underemploymentRate": 8,
        "laborForceParticipation": 71.2,
        "sahmIndicatorValue": 0.36,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.67,
        "wageGrowthYoy": 3.8,
        "productivityGrowthYoy": 0.8
      },
      {
        "year": 2026,
        "unemploymentRate": 4.8,
        "underemploymentRate": 7.9,
        "laborForceParticipation": 71.2,
        "sahmIndicatorValue": 0.34,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.68,
        "wageGrowthYoy": 3.7,
        "productivityGrowthYoy": 0.8
      }
    ]
  },
  {
    "countryCode": "PRT",
    "countryName": "Portugal",
    "flag": "🇵🇹",
    "currentUnemployment": 6.3,
    "unemployment12mLow": 6.1,
    "sahmValue": 0.16,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 7.1,
        "underemploymentRate": 10.9,
        "laborForceParticipation": 76,
        "sahmIndicatorValue": 0.22,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.53,
        "wageGrowthYoy": 5.1,
        "productivityGrowthYoy": 0.4
      },
      {
        "year": 2022,
        "unemploymentRate": 6,
        "underemploymentRate": 9.4,
        "laborForceParticipation": 76.3,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.66,
        "wageGrowthYoy": 7.3,
        "productivityGrowthYoy": 1.5
      },
      {
        "year": 2023,
        "unemploymentRate": 6.2,
        "underemploymentRate": 9.7,
        "laborForceParticipation": 76.3,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.64,
        "wageGrowthYoy": 5.8,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2024,
        "unemploymentRate": 6.4,
        "underemploymentRate": 9.9,
        "laborForceParticipation": 76.2,
        "sahmIndicatorValue": 0.21,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.61,
        "wageGrowthYoy": 4.3,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2025,
        "unemploymentRate": 6.4,
        "underemploymentRate": 9.9,
        "laborForceParticipation": 76.2,
        "sahmIndicatorValue": 0.18,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.61,
        "wageGrowthYoy": 4.1,
        "productivityGrowthYoy": 1.3
      },
      {
        "year": 2026,
        "unemploymentRate": 6.3,
        "underemploymentRate": 9.8,
        "laborForceParticipation": 76.2,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.62,
        "wageGrowthYoy": 4.1,
        "productivityGrowthYoy": 1.3
      }
    ]
  },
  {
    "countryCode": "GRC",
    "countryName": "Greece",
    "flag": "🇬🇷",
    "currentUnemployment": 9.4,
    "unemployment12mLow": 9.3,
    "sahmValue": 0.06,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 10.2,
        "underemploymentRate": 15.6,
        "laborForceParticipation": 69.6,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.39,
        "wageGrowthYoy": 5.3,
        "productivityGrowthYoy": 0.5
      },
      {
        "year": 2022,
        "unemploymentRate": 9.1,
        "underemploymentRate": 14.1,
        "laborForceParticipation": 69.9,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.52,
        "wageGrowthYoy": 8.2,
        "productivityGrowthYoy": 1.6
      },
      {
        "year": 2023,
        "unemploymentRate": 9.3,
        "underemploymentRate": 14.4,
        "laborForceParticipation": 69.9,
        "sahmIndicatorValue": 0.09,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.5,
        "wageGrowthYoy": 6.5,
        "productivityGrowthYoy": 1.5
      },
      {
        "year": 2024,
        "unemploymentRate": 9.5,
        "underemploymentRate": 14.6,
        "laborForceParticipation": 69.8,
        "sahmIndicatorValue": 0.11,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.47,
        "wageGrowthYoy": 4.7,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2025,
        "unemploymentRate": 9.5,
        "underemploymentRate": 14.6,
        "laborForceParticipation": 69.8,
        "sahmIndicatorValue": 0.08,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.47,
        "wageGrowthYoy": 4.6,
        "productivityGrowthYoy": 1.4
      },
      {
        "year": 2026,
        "unemploymentRate": 9.4,
        "underemploymentRate": 14.5,
        "laborForceParticipation": 69.8,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.48,
        "wageGrowthYoy": 4.5,
        "productivityGrowthYoy": 1.4
      }
    ]
  },
  {
    "countryCode": "PER",
    "countryName": "Peru",
    "flag": "🇵🇪",
    "currentUnemployment": 6.2,
    "unemployment12mLow": 6.1,
    "sahmValue": 0.14,
    "sahmStatus": "tranquil",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 7,
        "underemploymentRate": 16.3,
        "laborForceParticipation": 71.2,
        "sahmIndicatorValue": 0.2,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.47,
        "wageGrowthYoy": 5.9,
        "productivityGrowthYoy": 0.9
      },
      {
        "year": 2022,
        "unemploymentRate": 5.9,
        "underemploymentRate": 14.8,
        "laborForceParticipation": 71.5,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.6,
        "wageGrowthYoy": 7.7,
        "productivityGrowthYoy": 2
      },
      {
        "year": 2023,
        "unemploymentRate": 6.1,
        "underemploymentRate": 15.1,
        "laborForceParticipation": 71.5,
        "sahmIndicatorValue": 0.13,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.57,
        "wageGrowthYoy": 6.1,
        "productivityGrowthYoy": 1.9
      },
      {
        "year": 2024,
        "unemploymentRate": 6.3,
        "underemploymentRate": 15.3,
        "laborForceParticipation": 71.4,
        "sahmIndicatorValue": 0.19,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.55,
        "wageGrowthYoy": 4.5,
        "productivityGrowthYoy": 1.8
      },
      {
        "year": 2025,
        "unemploymentRate": 6.3,
        "underemploymentRate": 15.3,
        "laborForceParticipation": 71.4,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.55,
        "wageGrowthYoy": 4.4,
        "productivityGrowthYoy": 1.8
      },
      {
        "year": 2026,
        "unemploymentRate": 6.2,
        "underemploymentRate": 15.2,
        "laborForceParticipation": 71.4,
        "sahmIndicatorValue": 0.14,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.56,
        "wageGrowthYoy": 4.3,
        "productivityGrowthYoy": 1.8
      }
    ]
  },
  {
    "countryCode": "CZE",
    "countryName": "Czech Republic",
    "flag": "🇨🇿",
    "currentUnemployment": 2.8,
    "unemployment12mLow": 2.7,
    "sahmValue": 0.1,
    "sahmStatus": "tranquil",
    "laborTightness": "tight",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 3.6,
        "underemploymentRate": 5.3,
        "laborForceParticipation": 77.4,
        "sahmIndicatorValue": 0.16,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.97,
        "wageGrowthYoy": 8.9,
        "productivityGrowthYoy": 1
      },
      {
        "year": 2022,
        "unemploymentRate": 2.5,
        "underemploymentRate": 3.8,
        "laborForceParticipation": 77.7,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.1,
        "wageGrowthYoy": 12.1,
        "productivityGrowthYoy": 2.1
      },
      {
        "year": 2023,
        "unemploymentRate": 2.7,
        "underemploymentRate": 4.1,
        "laborForceParticipation": 77.7,
        "sahmIndicatorValue": 0.11,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.08,
        "wageGrowthYoy": 8.7,
        "productivityGrowthYoy": 2
      },
      {
        "year": 2024,
        "unemploymentRate": 2.9,
        "underemploymentRate": 4.3,
        "laborForceParticipation": 77.6,
        "sahmIndicatorValue": 0.15,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.05,
        "wageGrowthYoy": 5.3,
        "productivityGrowthYoy": 1.9
      },
      {
        "year": 2025,
        "unemploymentRate": 2.8,
        "underemploymentRate": 4.3,
        "laborForceParticipation": 77.6,
        "sahmIndicatorValue": 0.12,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.05,
        "wageGrowthYoy": 5.3,
        "productivityGrowthYoy": 1.9
      },
      {
        "year": 2026,
        "unemploymentRate": 2.8,
        "underemploymentRate": 4.2,
        "laborForceParticipation": 77.6,
        "sahmIndicatorValue": 0.1,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 1.06,
        "wageGrowthYoy": 5.3,
        "productivityGrowthYoy": 1.9
      }
    ]
  },
  {
    "countryCode": "FIN",
    "countryName": "Finland",
    "flag": "🇫🇮",
    "currentUnemployment": 7.8,
    "unemployment12mLow": 7.5,
    "sahmValue": 0.32,
    "sahmStatus": "elevated",
    "laborTightness": "slack",
    "historicalSeries": [
      {
        "year": 2021,
        "unemploymentRate": 8.6,
        "underemploymentRate": 12.3,
        "laborForceParticipation": 78.6,
        "sahmIndicatorValue": 0.38,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.49,
        "wageGrowthYoy": 3.8,
        "productivityGrowthYoy": -0.3
      },
      {
        "year": 2022,
        "unemploymentRate": 7.5,
        "underemploymentRate": 10.8,
        "laborForceParticipation": 78.9,
        "sahmIndicatorValue": 0.06,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.62,
        "wageGrowthYoy": 5.6,
        "productivityGrowthYoy": 0.8
      },
      {
        "year": 2023,
        "unemploymentRate": 7.7,
        "underemploymentRate": 11.1,
        "laborForceParticipation": 78.9,
        "sahmIndicatorValue": 0.22,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.6,
        "wageGrowthYoy": 4.2,
        "productivityGrowthYoy": 0.7
      },
      {
        "year": 2024,
        "unemploymentRate": 7.9,
        "underemploymentRate": 11.3,
        "laborForceParticipation": 78.8,
        "sahmIndicatorValue": 0.37,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.57,
        "wageGrowthYoy": 2.8,
        "productivityGrowthYoy": 0.6
      },
      {
        "year": 2025,
        "unemploymentRate": 7.9,
        "underemploymentRate": 11.3,
        "laborForceParticipation": 78.8,
        "sahmIndicatorValue": 0.34,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.57,
        "wageGrowthYoy": 2.8,
        "productivityGrowthYoy": 0.6
      },
      {
        "year": 2026,
        "unemploymentRate": 7.8,
        "underemploymentRate": 11.2,
        "laborForceParticipation": 78.8,
        "sahmIndicatorValue": 0.32,
        "sahmTriggered": false,
        "jobOpeningsPerUnemployed": 0.58,
        "wageGrowthYoy": 2.7,
        "productivityGrowthYoy": 0.6
      }
    ]
  },
];

/**
 * Resolves standard labor metrics for a country code in a given year.
 * If year is omitted or no exact match is found, the latest profile metrics are returned.
 */
export function getLaborMetricsForCountry(countryCode: string, year?: number): LaborMarketMetrics | null {
  const profile = SOVEREIGN_LABOR_PROFILES.find((p) => p.countryCode === countryCode);
  if (!profile) return null;

  if (year !== undefined) {
    const countryHistoryLabor = COUNTRIES_DATA.find((c) => c.code === countryCode)?.history[year]?.labor;
    const historical = profile.historicalSeries.find((h) => h.year === year);
    if (!historical && countryHistoryLabor) {
      return countryHistoryLabor;
    }
    if (historical) {
      return {
        unemploymentRate: historical.unemploymentRate,
        underemploymentRate: historical.underemploymentRate,
        laborForceParticipation: historical.laborForceParticipation,
        sahmIndicatorValue: historical.sahmIndicatorValue,
        sahmStatus: classifySahmStatus(historical.sahmIndicatorValue),
        jobOpeningsPerUnemployed: historical.jobOpeningsPerUnemployed,
        wageGrowthYoy: historical.wageGrowthYoy,
        productivityGrowthYoy: historical.productivityGrowthYoy,
      };
    }
  }

  // Fallback to latest available observation
  const latest = profile.historicalSeries[profile.historicalSeries.length - 1];
  return {
    unemploymentRate: profile.currentUnemployment,
    underemploymentRate: latest?.underemploymentRate,
    laborForceParticipation: latest?.laborForceParticipation,
    sahmIndicatorValue: profile.sahmValue,
    sahmStatus: profile.sahmStatus,
    jobOpeningsPerUnemployed: latest?.jobOpeningsPerUnemployed,
    wageGrowthYoy: latest?.wageGrowthYoy,
    productivityGrowthYoy: latest?.productivityGrowthYoy,
  };
}

/**
 * Historical Phillips Curve Coordinates (Unemployment Rate vs CPI Inflation Rate)
 * Demonstrates how structural shifts (globalization, supply chain breakdowns, and energy shocks)
 * alter the trade-off between domestic employment and price stability over distinct eras.
 */
export const HISTORICAL_PHILLIPS_CURVE_POINTS: PhillipsCurvePoint[] = [
  // 1980s Stagflation & Volcker Disinflation
  { era: '1980s', year: 1980, unemployment: 7.1, inflation: 13.5, note: 'Peak stagflation: double-digit inflation with high unemployment' },
  { era: '1980s', year: 1982, unemployment: 10.8, inflation: 6.2, note: 'Volcker rate shock creates deep recession to break inflation psychology' },
  { era: '1980s', year: 1986, unemployment: 7.0, inflation: 1.9, note: 'Oil price collapse anchors disinflation' },
  { era: '1980s', year: 1989, unemployment: 5.3, inflation: 4.8, note: 'Late-cycle labor tightening rebuilds price pressures' },

  // 1990s Great Moderation
  { era: '1990s', year: 1992, unemployment: 7.5, inflation: 3.0, note: 'Post-Gulf War jobless recovery' },
  { era: '1990s', year: 1995, unemployment: 5.6, inflation: 2.8, note: 'Greenspan pre-emptive soft landing' },
  { era: '1990s', year: 1998, unemployment: 4.5, inflation: 1.6, note: 'Asian financial crisis exports disinflation to the West' },
  { era: '1990s', year: 1999, unemployment: 4.2, inflation: 2.2, note: 'Dot-com productivity boom: 4% unemployment with 2% inflation' },

  // 2000s Housing Boom & GFC
  { era: '2000s', year: 2001, unemployment: 4.7, inflation: 2.8, note: 'Tech bust recession and Fed emergency rate cuts' },
  { era: '2000s', year: 2006, unemployment: 4.6, inflation: 3.2, note: 'Housing bubble peak and commodity demand from China' },
  { era: '2000s', year: 2008, unemployment: 5.8, inflation: 3.8, note: 'Crude oil spikes to $147 before subprime credit freeze' },
  { era: '2000s', year: 2009, unemployment: 9.3, inflation: -0.4, note: 'GFC balance sheet deflation and massive labor shed' },

  // 2010s Secular Stagnation / ZIRP
  { era: '2010s', year: 2011, unemployment: 8.9, inflation: 3.2, note: 'Slow recovery despite quantitative easing' },
  { era: '2010s', year: 2015, unemployment: 5.3, inflation: 0.1, note: 'US shale revolution crashes oil to $30' },
  { era: '2010s', year: 2018, unemployment: 3.9, inflation: 2.4, note: 'Unemployment hits 50-year lows without igniting inflation (flat Phillips curve)' },
  { era: '2010s', year: 2019, unemployment: 3.7, inflation: 1.8, note: 'Pre-pandemic optimal equilibrium' },

  // 2020s Supply Shocks & Normalization
  { era: '2020s', year: 2020, unemployment: 8.1, inflation: 1.2, note: 'Pandemic lockdown shock and emergency stimulus' },
  { era: '2020s', year: 2021, unemployment: 5.4, inflation: 4.7, note: 'Reopening supply bottlenecks and stimulus-fueled demand' },
  { era: '2020s', year: 2022, unemployment: 3.6, inflation: 8.0, note: 'Steepest Phillips curve shift in 40 years as CPI hits 9.1%' },
  { era: '2020s', year: 2023, unemployment: 3.7, inflation: 4.1, note: 'Disinflation begins while unemployment stays sub-4%' },
  { era: '2020s', year: 2024, unemployment: 4.1, inflation: 2.9, note: 'Labor supply surge from immigration moderates wage pressure' },
  { era: '2020s', year: 2026, unemployment: 4.0, inflation: 2.4, note: 'Return toward 2% target with balanced labor tightness' },
];
