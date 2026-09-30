import {
  SovereignLaborProfile,
  LaborMetricsYear,
  PhillipsCurvePoint,
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
];

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
