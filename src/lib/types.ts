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
