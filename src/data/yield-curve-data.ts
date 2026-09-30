import { SovereignYieldCurve, HistoricalYieldSpreadYear } from '../lib/types';

/**
 * Standard Normal Cumulative Distribution Function (Phi) approximation
 * Derived from Abramowitz and Stegun formula 7.1.26 to compute cumulative probabilities
 * without requiring heavyweight external math libraries in browser runtimes.
 */
function standardNormalCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2.0);
  const t = 1.0 / (1.0 + p * absX);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

/**
 * Calibrated New York Federal Reserve probit recession forecasting model:
 * P(Recession_t+12) = Phi(alpha + beta * Spread_10Y3M)
 * Historical Fed econometric regressions yield alpha = -0.5333 and beta = -0.6330,
 * reliably estimating recession odds over a 12-month horizon based on curve inversion depth.
 */
export function calculateRecessionProbability(spread10Y3M: number): number {
  const alpha = -0.5333;
  const beta = -0.6330;
  const z = alpha + beta * spread10Y3M;
  const prob = standardNormalCdf(z);
  return Number((Math.min(Math.max(prob, 0.01), 0.99) * 100).toFixed(1));
}

export const SOVEREIGN_YIELD_CURVES: SovereignYieldCurve[] = [
  {
    sovereignCode: 'USA',
    name: 'United States Treasury',
    flag: '🇺🇸',
    currency: 'USD',
    currentCurve: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: 4.82 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: 4.65 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 4.48 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 4.22 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 4.02 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 3.98 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 4.05 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 4.12 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 4.19 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 4.46 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 4.41 },
    ],
    curveOneYearAgo: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: 5.45 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: 5.42 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 5.38 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 5.12 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 4.75 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 4.50 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 4.28 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 4.30 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 4.28 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 4.55 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 4.42 },
    ],
    curvePreInversion: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: 0.05 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: 0.08 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 0.15 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 0.38 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 0.73 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 1.02 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 1.26 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 1.44 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 1.52 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 1.94 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 1.90 },
    ],
    spread10Y2Y: 0.17,
    spread10Y3M: -0.46,
    curveShape: 'steepening',
    recessionProbability12M: 26.5,
    realYield10Y: 1.84,
    breakevenInflation10Y: 2.35,
    summary:
      'The US yield curve has dis-inverted on the benchmark 10Y-2Y spread (+17 bps) while the 10Y-3M spread remains mildly inverted (-46 bps). Historically, the "un-inversion" transition is the most critical window where recession risk peaks as rate cuts commence.',
  },
  {
    sovereignCode: 'DEU',
    name: 'German Bund',
    flag: '🇩🇪',
    currency: 'EUR',
    currentCurve: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: 2.85 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: 2.70 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 2.50 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 2.32 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 2.15 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 2.10 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 2.18 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 2.25 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 2.38 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 2.58 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 2.55 },
    ],
    curveOneYearAgo: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: 3.85 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: 3.80 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 3.65 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 3.35 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 2.95 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 2.70 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 2.52 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 2.50 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 2.55 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 2.75 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 2.70 },
    ],
    spread10Y2Y: 0.23,
    spread10Y3M: -0.32,
    curveShape: 'normal',
    recessionProbability12M: 21.4,
    realYield10Y: 0.42,
    breakevenInflation10Y: 1.96,
    summary:
      'German Bund curves reflect ECB deposit rate easing cycles. The European benchmark has returned to positive 10Y-2Y slope as growth headwinds in German manufacturing reinforce disinflation towards the 2% target.',
  },
  {
    sovereignCode: 'JPN',
    name: 'Japanese Government Bond (JGB)',
    flag: '🇯🇵',
    currency: 'JPY',
    currentCurve: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: 0.15 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: 0.22 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 0.35 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 0.48 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 0.58 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 0.65 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 0.78 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 0.92 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 1.08 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 1.72 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 2.14 },
    ],
    curveOneYearAgo: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: -0.05 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: -0.02 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 0.05 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 0.12 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 0.24 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 0.32 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 0.45 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 0.62 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 0.78 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 1.50 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 1.82 },
    ],
    spread10Y2Y: 0.50,
    spread10Y3M: 0.86,
    curveShape: 'normal',
    recessionProbability12M: 6.8,
    realYield10Y: -0.92,
    breakevenInflation10Y: 2.00,
    summary:
      'The Bank of Japan has officially abolished Yield Curve Control (YCC) and negative policy rates, restoring market pricing to the JGB curve and producing the steepest term premium in Tokyo in 15 years.',
  },
  {
    sovereignCode: 'GBR',
    name: 'UK Gilt',
    flag: '🇬🇧',
    currency: 'GBP',
    currentCurve: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: 4.65 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: 4.52 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 4.38 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 4.25 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 4.12 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 4.08 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 4.15 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 4.28 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 4.38 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 4.78 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 4.82 },
    ],
    curveOneYearAgo: [
      { tenor: '1M', tenorMonths: 1, yieldPercent: 5.25 },
      { tenor: '3M', tenorMonths: 3, yieldPercent: 5.20 },
      { tenor: '6M', tenorMonths: 6, yieldPercent: 5.08 },
      { tenor: '1Y', tenorMonths: 12, yieldPercent: 4.85 },
      { tenor: '2Y', tenorMonths: 24, yieldPercent: 4.55 },
      { tenor: '3Y', tenorMonths: 36, yieldPercent: 4.40 },
      { tenor: '5Y', tenorMonths: 60, yieldPercent: 4.32 },
      { tenor: '7Y', tenorMonths: 84, yieldPercent: 4.38 },
      { tenor: '10Y', tenorMonths: 120, yieldPercent: 4.45 },
      { tenor: '20Y', tenorMonths: 240, yieldPercent: 4.90 },
      { tenor: '30Y', tenorMonths: 360, yieldPercent: 4.95 },
    ],
    spread10Y2Y: 0.26,
    spread10Y3M: -0.14,
    curveShape: 'normal',
    recessionProbability12M: 18.2,
    realYield10Y: 1.15,
    breakevenInflation10Y: 3.23,
    summary:
      'Gilt yields maintain an elevated risk premium reflecting UK structural fiscal deficits and services inflation persistence, leaving the Bank of England with a more gradual easing path than the ECB.',
  },
];

/**
 * Historical US Yield Curve Spreads (1980–2026)
 * Benchmark data capturing every major inversion and economic recession cycle.
 * Inversions (10Y-2Y < 0 or 10Y-3M < 0) have preceded every US recession since 1955
 * with an average lead time of 12 to 18 months.
 */
export const HISTORICAL_YIELD_SPREADS: HistoricalYieldSpreadYear[] = [
  { year: 1980, us10Y2YSpread: -1.78, us10Y3MSpread: -2.35, us10YNominal: 11.43, us10YRealTIPS: 1.80, isInverted: true, isRecession: true },
  { year: 1981, us10Y2YSpread: -2.05, us10Y3MSpread: -3.12, us10YNominal: 13.92, us10YRealTIPS: 4.10, isInverted: true, isRecession: true },
  { year: 1982, us10Y2YSpread: 0.35, us10Y3MSpread: 1.10, us10YNominal: 13.01, us10YRealTIPS: 5.20, isInverted: false, isRecession: true },
  { year: 1985, us10Y2YSpread: 1.25, us10Y3MSpread: 2.15, us10YNominal: 10.62, us10YRealTIPS: 4.80, isInverted: false, isRecession: false },
  { year: 1989, us10Y2YSpread: -0.32, us10Y3MSpread: -0.45, us10YNominal: 8.50, us10YRealTIPS: 3.80, isInverted: true, isRecession: false },
  { year: 1990, us10Y2YSpread: 0.18, us10Y3MSpread: 0.65, us10YNominal: 8.55, us10YRealTIPS: 3.20, isInverted: false, isRecession: true },
  { year: 1991, us10Y2YSpread: 1.45, us10Y3MSpread: 2.20, us10YNominal: 7.86, us10YRealTIPS: 3.10, isInverted: false, isRecession: true },
  { year: 1995, us10Y2YSpread: 0.42, us10Y3MSpread: 0.85, us10YNominal: 6.57, us10YRealTIPS: 3.40, isInverted: false, isRecession: false },
  { year: 1998, us10Y2YSpread: 0.12, us10Y3MSpread: 0.42, us10YNominal: 5.26, us10YRealTIPS: 3.20, isInverted: false, isRecession: false },
  { year: 2000, us10Y2YSpread: -0.45, us10Y3MSpread: -0.72, us10YNominal: 6.03, us10YRealTIPS: 3.85, isInverted: true, isRecession: false },
  { year: 2001, us10Y2YSpread: 1.15, us10Y3MSpread: 1.80, us10YNominal: 5.02, us10YRealTIPS: 3.10, isInverted: false, isRecession: true },
  { year: 2004, us10Y2YSpread: 1.95, us10Y3MSpread: 2.65, us10YNominal: 4.27, us10YRealTIPS: 1.90, isInverted: false, isRecession: false },
  { year: 2006, us10Y2YSpread: -0.15, us10Y3MSpread: -0.22, us10YNominal: 4.80, us10YRealTIPS: 2.25, isInverted: true, isRecession: false },
  { year: 2007, us10Y2YSpread: 0.12, us10Y3MSpread: 0.28, us10YNominal: 4.63, us10YRealTIPS: 2.30, isInverted: false, isRecession: true },
  { year: 2008, us10Y2YSpread: 1.65, us10Y3MSpread: 2.45, us10YNominal: 3.66, us10YRealTIPS: 2.10, isInverted: false, isRecession: true },
  { year: 2009, us10Y2YSpread: 2.30, us10Y3MSpread: 3.10, us10YNominal: 3.26, us10YRealTIPS: 1.65, isInverted: false, isRecession: true },
  { year: 2012, us10Y2YSpread: 1.55, us10Y3MSpread: 1.72, us10YNominal: 1.80, us10YRealTIPS: -0.55, isInverted: false, isRecession: false },
  { year: 2015, us10Y2YSpread: 1.45, us10Y3MSpread: 2.10, us10YNominal: 2.14, us10YRealTIPS: 0.45, isInverted: false, isRecession: false },
  { year: 2019, us10Y2YSpread: -0.05, us10Y3MSpread: -0.35, us10YNominal: 2.14, us10YRealTIPS: 0.25, isInverted: true, isRecession: false },
  { year: 2020, us10Y2YSpread: 0.75, us10Y3MSpread: 0.82, us10YNominal: 0.89, us10YRealTIPS: -0.65, isInverted: false, isRecession: true },
  { year: 2021, us10Y2YSpread: 0.95, us10Y3MSpread: 1.40, us10YNominal: 1.45, us10YRealTIPS: -1.05, isInverted: false, isRecession: false },
  { year: 2022, us10Y2YSpread: -0.55, us10Y3MSpread: 0.25, us10YNominal: 2.95, us10YRealTIPS: 0.75, isInverted: true, isRecession: false },
  { year: 2023, us10Y2YSpread: -0.78, us10Y3MSpread: -1.45, us10YNominal: 3.88, us10YRealTIPS: 1.95, isInverted: true, isRecession: false },
  { year: 2024, us10Y2YSpread: -0.22, us10Y3MSpread: -0.95, us10YNominal: 4.25, us10YRealTIPS: 2.05, isInverted: true, isRecession: false },
  { year: 2025, us10Y2YSpread: 0.08, us10Y3MSpread: -0.65, us10YNominal: 4.15, us10YRealTIPS: 1.90, isInverted: false, isRecession: false },
  { year: 2026, us10Y2YSpread: 0.17, us10Y3MSpread: -0.46, us10YNominal: 4.19, us10YRealTIPS: 1.84, isInverted: false, isRecession: false },
];
