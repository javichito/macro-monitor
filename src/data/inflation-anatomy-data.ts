import {
  InflationComponentYear,
  InflationRegimeTag,
  SovereignInflationProfile,
} from '../lib/types';

/**
 * Standard BLS US Consumer Price Index relative importance weights (2024–2026 reference basket).
 * Crucial macroeconomic reality: Shelter alone represents >34% of the US CPI, but its survey methodology
 * introduces a 12-18 month lag relative to spot market asking rents (Zillow/Apartment List).
 */
export const US_CPI_BASKET_WEIGHTS = {
  shelterWeight: 34.5,
  supercoreWeight: 27.2, // Core services excluding shelter (the Powell labor-push metric)
  coreGoodsWeight: 18.8, // Durable & non-durable goods excluding food & energy
  foodWeight: 13.4,
  energyWeight: 6.1,
};

/**
 * Historical US Inflation Component Decomposition (1980–2026).
 * Compiled from Bureau of Labor Statistics (BLS) and Federal Reserve Economic Data (FRED).
 */
export const US_INFLATION_HISTORY: InflationComponentYear[] = [
  {
    year: 1980,
    headlineCpi: 13.5,
    coreCpi: 12.4,
    supercoreCpi: 11.2,
    shelterOer: 15.6,
    coreGoods: 9.8,
    energy: 30.9,
    food: 10.4,
    ppiFinalDemand: 14.1,
    ppiCpiSpread: 0.6,
  },
  {
    year: 1982,
    headlineCpi: 6.2,
    coreCpi: 7.4,
    supercoreCpi: 8.1,
    shelterOer: 7.2,
    coreGoods: 5.5,
    energy: 1.5,
    food: 4.0,
    ppiFinalDemand: 4.1,
    ppiCpiSpread: -2.1,
  },
  {
    year: 1985,
    headlineCpi: 3.6,
    coreCpi: 4.4,
    supercoreCpi: 5.0,
    shelterOer: 5.8,
    coreGoods: 2.5,
    energy: -0.8,
    food: 2.3,
    ppiFinalDemand: 0.9,
    ppiCpiSpread: -2.7,
  },
  {
    year: 1990,
    headlineCpi: 5.4,
    coreCpi: 5.2,
    supercoreCpi: 5.8,
    shelterOer: 5.3,
    coreGoods: 3.5,
    energy: 8.4,
    food: 5.8,
    ppiFinalDemand: 5.7,
    ppiCpiSpread: 0.3,
  },
  {
    year: 1995,
    headlineCpi: 2.8,
    coreCpi: 3.0,
    supercoreCpi: 3.4,
    shelterOer: 3.3,
    coreGoods: 1.7,
    energy: -1.5,
    food: 2.8,
    ppiFinalDemand: 1.9,
    ppiCpiSpread: -0.9,
  },
  {
    year: 2000,
    headlineCpi: 3.4,
    coreCpi: 2.6,
    supercoreCpi: 3.1,
    shelterOer: 3.2,
    coreGoods: 0.6,
    energy: 17.1,
    food: 2.3,
    ppiFinalDemand: 3.8,
    ppiCpiSpread: 0.4,
  },
  {
    year: 2005,
    headlineCpi: 3.4,
    coreCpi: 2.2,
    supercoreCpi: 2.8,
    shelterOer: 2.6,
    coreGoods: 0.2,
    energy: 17.1,
    food: 2.4,
    ppiFinalDemand: 4.2,
    ppiCpiSpread: 0.8,
  },
  {
    year: 2008,
    headlineCpi: 3.8,
    coreCpi: 2.3,
    supercoreCpi: 2.9,
    shelterOer: 2.4,
    coreGoods: 0.8,
    energy: 17.4,
    food: 5.5,
    ppiFinalDemand: 6.3,
    ppiCpiSpread: 2.5,
  },
  {
    year: 2009,
    headlineCpi: -0.4,
    coreCpi: 1.7,
    supercoreCpi: 2.1,
    shelterOer: 1.1,
    coreGoods: 0.2,
    energy: -19.4,
    food: 1.8,
    ppiFinalDemand: -3.6,
    ppiCpiSpread: -3.2,
  },
  {
    year: 2015,
    headlineCpi: 0.1,
    coreCpi: 1.8,
    supercoreCpi: 2.4,
    shelterOer: 3.0,
    coreGoods: -0.5,
    energy: -19.7,
    food: 1.9,
    ppiFinalDemand: -1.0,
    ppiCpiSpread: -1.1,
  },
  {
    year: 2019,
    headlineCpi: 1.8,
    coreCpi: 2.2,
    supercoreCpi: 2.3,
    shelterOer: 3.4,
    coreGoods: 0.1,
    energy: -1.5,
    food: 1.9,
    ppiFinalDemand: 1.4,
    ppiCpiSpread: -0.4,
  },
  {
    year: 2020,
    headlineCpi: 1.2,
    coreCpi: 1.6,
    supercoreCpi: 1.8,
    shelterOer: 2.1,
    coreGoods: -0.4,
    energy: -7.0,
    food: 3.9,
    ppiFinalDemand: 0.2,
    ppiCpiSpread: -1.0,
  },
  {
    year: 2021,
    headlineCpi: 4.7,
    coreCpi: 3.6,
    supercoreCpi: 3.2,
    shelterOer: 2.5,
    coreGoods: 6.0,
    energy: 25.6,
    food: 3.9,
    ppiFinalDemand: 7.0,
    ppiCpiSpread: 2.3,
  },
  {
    year: 2022,
    headlineCpi: 8.0,
    coreCpi: 6.2,
    supercoreCpi: 5.9,
    shelterOer: 5.9,
    coreGoods: 9.8,
    energy: 25.2,
    food: 9.9,
    ppiFinalDemand: 10.5,
    ppiCpiSpread: 2.5,
  },
  {
    year: 2023,
    headlineCpi: 4.1,
    coreCpi: 4.8,
    supercoreCpi: 4.9,
    shelterOer: 7.6,
    coreGoods: 1.1,
    energy: -2.3,
    food: 5.8,
    ppiFinalDemand: 2.1,
    ppiCpiSpread: -2.0,
  },
  {
    year: 2024,
    headlineCpi: 2.9,
    coreCpi: 3.3,
    supercoreCpi: 3.9,
    shelterOer: 5.1,
    coreGoods: -1.2,
    energy: -1.1,
    food: 2.2,
    ppiFinalDemand: 1.8,
    ppiCpiSpread: -1.1,
  },
  {
    year: 2025,
    headlineCpi: 2.5,
    coreCpi: 2.7,
    supercoreCpi: 3.2,
    shelterOer: 3.8,
    coreGoods: -0.4,
    energy: 0.8,
    food: 1.9,
    ppiFinalDemand: 2.0,
    ppiCpiSpread: -0.5,
  },
  {
    year: 2026,
    headlineCpi: 2.3,
    coreCpi: 2.4,
    supercoreCpi: 2.7,
    shelterOer: 3.0,
    coreGoods: 0.2,
    energy: 1.2,
    food: 2.0,
    ppiFinalDemand: 2.2,
    ppiCpiSpread: -0.1,
  },
];

export const SOVEREIGN_INFLATION_PROFILES: SovereignInflationProfile[] = [
  {
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    headlineYoY: 2.3,
    coreYoY: 2.4,
    supercoreYoY: 2.7,
    shelterYoY: 3.0,
    coreGoodsYoY: 0.2,
    ppiYoY: 2.2,
    regime: 'target-equilibrium',
    basketWeights: US_CPI_BASKET_WEIGHTS,
    historicalSeries: US_INFLATION_HISTORY,
  },
  {
    countryCode: 'DEU',
    countryName: 'Eurozone (Germany proxy)',
    flag: '🇪🇺',
    currency: 'EUR',
    headlineYoY: 2.1,
    coreYoY: 2.4,
    supercoreYoY: 2.8,
    shelterYoY: 1.8,
    coreGoodsYoY: 0.4,
    ppiYoY: 1.4,
    regime: 'goods-disinflation',
    // Eurostat HICP uses actual rent without OER imputations, giving shelter a much lower direct weight
    basketWeights: {
      shelterWeight: 10.5,
      supercoreWeight: 34.2,
      coreGoodsWeight: 26.5,
      foodWeight: 19.8,
      energyWeight: 9.0,
    },
    historicalSeries: [
      { year: 2020, headlineCpi: 0.3, coreCpi: 0.7, supercoreCpi: 1.2, shelterOer: 1.4, coreGoods: -0.2, energy: -6.8, food: 2.4, ppiFinalDemand: -1.2, ppiCpiSpread: -1.5 },
      { year: 2021, headlineCpi: 2.6, coreCpi: 1.5, supercoreCpi: 1.5, shelterOer: 1.5, coreGoods: 1.8, energy: 13.0, food: 1.9, ppiFinalDemand: 12.2, ppiCpiSpread: 9.6 },
      { year: 2022, headlineCpi: 8.4, coreCpi: 3.9, supercoreCpi: 3.5, shelterOer: 1.7, coreGoods: 5.6, energy: 37.0, food: 11.9, ppiFinalDemand: 29.5, ppiCpiSpread: 21.1 },
      { year: 2023, headlineCpi: 5.4, coreCpi: 4.9, supercoreCpi: 4.8, shelterOer: 2.1, coreGoods: 3.2, energy: -2.3, food: 10.9, ppiFinalDemand: -1.0, ppiCpiSpread: -6.4 },
      { year: 2024, headlineCpi: 2.4, coreCpi: 2.8, supercoreCpi: 3.7, shelterOer: 2.0, coreGoods: 0.6, energy: -3.2, food: 2.5, ppiFinalDemand: 0.8, ppiCpiSpread: -1.6 },
      { year: 2026, headlineCpi: 2.1, coreCpi: 2.4, supercoreCpi: 2.8, shelterOer: 1.8, coreGoods: 0.4, energy: 0.5, food: 1.8, ppiFinalDemand: 1.4, ppiCpiSpread: -0.7 },
    ],
  },
  {
    countryCode: 'GBR',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    headlineYoY: 2.6,
    coreYoY: 3.1,
    supercoreYoY: 3.8,
    shelterYoY: 3.5,
    coreGoodsYoY: 0.1,
    ppiYoY: 2.0,
    regime: 'sticky-supercore',
    basketWeights: {
      shelterWeight: 15.2,
      supercoreWeight: 32.5,
      coreGoodsWeight: 28.1,
      foodWeight: 14.8,
      energyWeight: 9.4,
    },
    historicalSeries: [
      { year: 2020, headlineCpi: 0.9, coreCpi: 1.4, supercoreCpi: 1.6, shelterOer: 1.3, coreGoods: 0.5, energy: -6.5, food: 0.8, ppiFinalDemand: -0.5, ppiCpiSpread: -1.4 },
      { year: 2021, headlineCpi: 2.6, coreCpi: 2.3, supercoreCpi: 2.2, shelterOer: 1.5, coreGoods: 2.9, energy: 9.2, food: 1.3, ppiFinalDemand: 6.8, ppiCpiSpread: 4.2 },
      { year: 2022, headlineCpi: 9.1, coreCpi: 5.9, supercoreCpi: 5.4, shelterOer: 2.8, coreGoods: 7.8, energy: 48.0, food: 13.1, ppiFinalDemand: 17.5, ppiCpiSpread: 8.4 },
      { year: 2023, headlineCpi: 7.3, coreCpi: 6.2, supercoreCpi: 6.5, shelterOer: 4.8, coreGoods: 4.2, energy: 12.0, food: 14.8, ppiFinalDemand: 0.5, ppiCpiSpread: -6.8 },
      { year: 2024, headlineCpi: 3.2, coreCpi: 3.8, supercoreCpi: 4.9, shelterOer: 4.2, coreGoods: -0.5, energy: -7.5, food: 3.1, ppiFinalDemand: 1.2, ppiCpiSpread: -2.0 },
      { year: 2026, headlineCpi: 2.6, coreCpi: 3.1, supercoreCpi: 3.8, shelterOer: 3.5, coreGoods: 0.1, energy: -0.2, food: 2.2, ppiFinalDemand: 2.0, ppiCpiSpread: -0.6 },
    ],
  },
  {
    countryCode: 'JPN',
    countryName: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    headlineYoY: 2.5,
    coreYoY: 2.3,
    supercoreYoY: 2.1,
    shelterYoY: 0.8,
    coreGoodsYoY: 2.9,
    ppiYoY: 2.8,
    regime: 'target-equilibrium',
    basketWeights: {
      shelterWeight: 16.5,
      supercoreWeight: 26.8,
      coreGoodsWeight: 29.2,
      foodWeight: 20.3,
      energyWeight: 7.2,
    },
    historicalSeries: [
      { year: 2020, headlineCpi: 0.0, coreCpi: 0.2, supercoreCpi: 0.4, shelterOer: 0.2, coreGoods: -0.1, energy: -4.2, food: 1.1, ppiFinalDemand: -1.2, ppiCpiSpread: -1.2 },
      { year: 2021, headlineCpi: -0.2, coreCpi: -0.5, supercoreCpi: -0.8, shelterOer: 0.2, coreGoods: 0.4, energy: 6.8, food: -0.3, ppiFinalDemand: 4.8, ppiCpiSpread: 5.0 },
      { year: 2022, headlineCpi: 2.5, coreCpi: 1.5, supercoreCpi: 1.1, shelterOer: 0.4, coreGoods: 3.8, energy: 17.5, food: 4.5, ppiFinalDemand: 9.7, ppiCpiSpread: 7.2 },
      { year: 2023, headlineCpi: 3.2, coreCpi: 3.1, supercoreCpi: 2.2, shelterOer: 0.5, coreGoods: 4.5, energy: -5.2, food: 7.8, ppiFinalDemand: 4.1, ppiCpiSpread: 0.9 },
      { year: 2024, headlineCpi: 2.8, coreCpi: 2.5, supercoreCpi: 2.2, shelterOer: 0.6, coreGoods: 3.2, energy: 2.1, food: 4.2, ppiFinalDemand: 3.0, ppiCpiSpread: 0.2 },
      { year: 2026, headlineCpi: 2.5, coreCpi: 2.3, supercoreCpi: 2.1, shelterOer: 0.8, coreGoods: 2.9, energy: 1.8, food: 3.1, ppiFinalDemand: 2.8, ppiCpiSpread: 0.3 },
    ],
  },
];

/**
 * Calculates the exact weighted contribution (in percentage points) of a component to the overall headline CPI.
 * Formula: C_i = (Weight_i / 100) * YoY_i
 */
export function calculateComponentContribution(weightPercent: number, componentYoY: number): number {
  return Number(((weightPercent / 100) * componentYoY).toFixed(2));
}

/**
 * Categorizes the active inflationary regime based on core components and upstream pipeline momentum.
 */
export function classifyInflationRegime(
  headline: number,
  core: number,
  supercore: number,
  ppi: number
): InflationRegimeTag {
  if (headline < 0.5) return 'deflationary';
  if (supercore >= 3.5 && headline >= 3.0) return 'broad-stagflationary';
  if (supercore >= 3.0 && core > 2.5) return 'sticky-supercore';
  if (core <= 2.5 && ppi <= 1.5) return 'goods-disinflation';
  return 'target-equilibrium';
}

/**
 * Interprets the PPI - CPI upstream spread to forecast supply chain margin pressure or impending retail disinflation.
 */
export function getPipelinePressureSignal(spread: number): {
  status: 'upstream-squeeze' | 'upstream-disinflation' | 'neutral';
  headline: string;
  explanation: string;
} {
  if (spread >= 1.5) {
    return {
      status: 'upstream-squeeze',
      headline: 'Upstream Pipeline Inflation Squeeze (PPI > CPI)',
      explanation: 'Factory-gate production costs are accelerating faster than consumer retail prices. Firms face margin compression or will pass rising input costs down to consumers over the next 3 to 6 months.',
    };
  }

  if (spread <= -1.5) {
    return {
      status: 'upstream-disinflation',
      headline: 'Upstream Disinflation Wave (PPI < CPI)',
      explanation: 'Wholesale and producer prices have collapsed below retail CPI. This pipeline deflation typically translates into lower shelf prices and cooling headline inflation within 1 to 2 quarters.',
    };
  }

  return {
    status: 'neutral',
    headline: 'Balanced Pipeline Transmission (PPI ≈ CPI)',
    explanation: 'Upstream wholesale prices and final consumer goods are moving in sync without severe margin pressures or sudden supply chain shocks.',
  };
}
