export type CurrencyPerspective = 'nominal' | 'real' | 'ppp';
export type Granularity = 'country' | 'bloc';

export interface WealthTier {
  bracket: string;
  minWealth: number;
  maxWealth: number | null;
  adultsMillion: number;
  adultsShare: number;
  wealthTrillion: number;
  wealthShare: number;
}

export interface GlobalWealthYear {
  year: number;
  totalWealthTrillion: number;
  adultPopulationBillions: number;
  meanWealthPerAdult: number;
  medianWealthPerAdult: number;
  giniCoefficient: number;
  shares: {
    top1Percent: number;
    top10Percent: number;
    middle40Percent: number;
    bottom50Percent: number;
  };
  tiers: WealthTier[];
}

export interface SubAssetCategory {
  id: string;
  name: string;
  shareOfParentPercent: number;
  valueTrillion: number;
  description: string;
  color: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  sharePercent: number;
  valueTrillion: number;
  description: string;
  color: string;
  isTangible: boolean;
  subCategories?: SubAssetCategory[];
}

export interface GlobalAssetYear {
  year: number;
  totalGrossAssetsTrillion: number;
  totalLiabilitiesTrillion: number;
  netWealthTrillion: number;
  categories: AssetCategory[];
  liabilityBreakdown?: SubAssetCategory[];
}

export interface CountryYearMetric {
  totalWealthTrillion: number;
  wealthPerAdultUSD: number;
  medianWealthUSD: number;
  gdpTrillionUSD: number;
  gdpPerCapitaUSD: number;
  inflationRate: number;
  debtToGdp: number;
  gini: number;
  assetMix: {
    financialShare: number;
    nonFinancialShare: number;
    debtShareOfGross: number;
  };
}

export interface CountryProfile {
  code: string;
  name: string;
  region: string;
  blocs: string[];
  flag: string;
  coordinates: [number, number]; // [longitude, latitude] for mapping
  history: Record<number, CountryYearMetric>;
}

export interface BlocYearMetric {
  totalWealthTrillion: number;
  wealthPerAdultUSD: number;
  medianWealthUSD: number;
  gdpTrillionUSD: number;
  gdpPerCapitaUSD: number;
  populationMillion: number;
  globalWealthShare: number;
  globalGdpShare: number;
}

export interface EconomicBloc {
  id: string;
  name: string;
  description: string;
  memberCodes: string[];
  color: string;
  history: Record<number, BlocYearMetric>;
}

export interface CentralBankRates {
  fed: number;
  ecb: number;
  boj: number;
  pboc: number;
  boe: number;
}

export interface CurrencyReserves {
  usd: number;
  eur: number;
  cny: number;
  jpy: number;
  gbp: number;
  goldAndOther: number;
}

export interface MacroIndicatorYear {
  year: number;
  globalGdpTrillion: number;
  globalDebtTrillion: number;
  globalDebtToGdp: number;
  globalInflationRate: number;
  usCpiIndex: number; // Base 100 in 2000 for inflation adjustments
  centralBankRates: CentralBankRates;
  currencyReserves: CurrencyReserves;
}

export type MacroRegionId =
  | 'north-america'
  | 'europe'
  | 'asia-pacific'
  | 'latin-america'
  | 'middle-east-africa';

export interface RegionalAssetMix {
  realEstate: number;
  equities: number;
  bonds: number;
  cash: number;
  alternatives: number;
}

export interface RegionMeta {
  id: MacroRegionId;
  name: string;
  shortName: string;
  flag: string;
  color: string;
  secondaryColor: string;
  keyEconomies: string;
  macroProfile: string;
}

export interface RegionYearMetric {
  regionId: MacroRegionId;
  name: string;
  totalGrossAssetsTrillion: number;
  totalLiabilitiesTrillion: number;
  netWealthTrillion: number;
  shareOfGlobalGrossPercent: number;
  assets: RegionalAssetMix;
  macroHighlight: string;
}

export interface RegionalAssetYear {
  year: number;
  totalGlobalGrossTrillion: number;
  totalGlobalLiabilitiesTrillion: number;
  totalGlobalNetWealthTrillion: number;
  regions: Record<MacroRegionId, RegionYearMetric>;
}

/* =========================================================================
 * Tier 1: High-Impact Macro Essentials Types
 * ========================================================================= */

export type YieldTenor = '1M' | '3M' | '6M' | '1Y' | '2Y' | '3Y' | '5Y' | '7Y' | '10Y' | '20Y' | '30Y';
export type CurveShape = 'normal' | 'flat' | 'inverted' | 'steepening';

export interface YieldPoint {
  tenor: YieldTenor;
  tenorMonths: number;
  yieldPercent: number;
}

export interface SovereignYieldCurve {
  sovereignCode: 'USA' | 'DEU' | 'JPN' | 'GBR';
  name: string;
  flag: string;
  currency: string;
  currentCurve: YieldPoint[];
  curveOneYearAgo: YieldPoint[];
  curvePreInversion?: YieldPoint[];
  spread10Y2Y: number;
  spread10Y3M: number;
  curveShape: CurveShape;
  recessionProbability12M: number; // In percent (e.g. 18.5)
  realYield10Y: number; // 10Y TIPS in %
  breakevenInflation10Y: number; // Breakeven inflation in %
  summary: string;
}

export interface HistoricalYieldSpreadYear {
  year: number;
  us10Y2YSpread: number;
  us10Y3MSpread: number;
  us10YNominal: number;
  us10YRealTIPS: number;
  isInverted: boolean;
  isRecession: boolean;
}

export type MacroQuadrant = 'goldilocks' | 'reflation' | 'stagflation' | 'deflation';

export interface RegimeCoordinates {
  growthMomentum: number; // -100 (severe contraction) to +100 (rapid acceleration)
  inflationMomentum: number; // -100 (severe disinflation) to +100 (rapid inflation acceleration)
  quadrant: MacroQuadrant;
  label: string;
  description: string;
  favorableAssetClasses: string[];
  headwindAssetClasses: string[];
}

export interface EconomyRegimePoint {
  code: string;
  name: string;
  flag: string;
  currentCoordinates: RegimeCoordinates;
  historicalTrail: Array<{
    year: number;
    coordinates: RegimeCoordinates;
  }>;
}

export interface MacroRegimeMilestone {
  year: number;
  title: string;
  quadrant: MacroQuadrant;
  catalyst: string;
  assetLeader: string;
}

export interface LaborMetricsYear {
  year: number;
  unemploymentRate: number; // U-3 headline %
  underemploymentRate: number; // U-6 broad %
  laborForceParticipation: number; // LFPR %
  sahmIndicatorValue: number; // Percentage point delta vs 12m low
  sahmTriggered: boolean; // True if >= 0.50%
  jobOpeningsPerUnemployed: number; // JOLTS V/U ratio
  wageGrowthYoy: number; // Average hourly earnings % YoY
  productivityGrowthYoy: number; // Output per worker-hour % YoY
}

export interface SovereignLaborProfile {
  countryCode: string;
  countryName: string;
  flag: string;
  currentUnemployment: number;
  unemployment12mLow: number;
  sahmValue: number;
  sahmStatus: 'tranquil' | 'elevated' | 'triggered';
  laborTightness: 'tight' | 'balanced' | 'slack';
  historicalSeries: LaborMetricsYear[];
}

export interface PhillipsCurvePoint {
  era: '1980s' | '1990s' | '2000s' | '2010s' | '2020s';
  year: number;
  unemployment: number;
  inflation: number;
  note: string;
}

