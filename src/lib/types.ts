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

export interface LaborMarketMetrics {
  unemploymentRate: number;
  underemploymentRate?: number;
  laborForceParticipation?: number;
  sahmIndicatorValue?: number;
  sahmStatus?: 'tranquil' | 'elevated' | 'triggered';
  jobOpeningsPerUnemployed?: number;
  wageGrowthYoy?: number;
  productivityGrowthYoy?: number;
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
  labor?: LaborMarketMetrics;
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

export interface InflationComponentYear {
  year: number;
  headlineCpi: number;
  coreCpi: number;
  supercoreCpi: number;
  shelterOer: number;
  coreGoods: number;
  energy: number;
  food: number;
  ppiFinalDemand: number;
  ppiCpiSpread: number;
}

export type InflationRegimeTag =
  | 'deflationary'
  | 'goods-disinflation'
  | 'sticky-supercore'
  | 'broad-stagflationary'
  | 'target-equilibrium';

export interface SovereignInflationProfile {
  countryCode: string;
  countryName: string;
  flag: string;
  currency: string;
  headlineYoY: number;
  coreYoY: number;
  supercoreYoY: number;
  shelterYoY: number;
  coreGoodsYoY: number;
  ppiYoY: number;
  regime: InflationRegimeTag;
  basketWeights: {
    shelterWeight: number;
    supercoreWeight: number;
    coreGoodsWeight: number;
    foodWeight: number;
    energyWeight: number;
  };
  historicalSeries: InflationComponentYear[];
}

/* =========================================================================
 * Tier 2: Leading Indicators & High-Frequency Nowcasting Types
 * ========================================================================= */

export type PmiExpansionStatus = 'expansion' | 'contraction' | 'stagnation';

export interface PmiHistoricalPoint {
  period: string; // ISO year-quarter or year-month e.g. '2024-Q3'
  manufacturing: number;
  services: number;
  composite: number;
  newOrders?: number;
  inventories?: number;
}

export interface SovereignPmiProfile {
  economyCode: 'GLOBAL' | 'USA' | 'EA' | 'CHN' | 'GBR' | 'JPN';
  name: string;
  flag: string;
  surveyProvider: string;
  currentManufacturing: number;
  currentServices: number;
  currentComposite: number;
  momChangeManufacturing: number;
  momChangeServices: number;
  manufacturingStatus: PmiExpansionStatus;
  servicesStatus: PmiExpansionStatus;
  compositeStatus: PmiExpansionStatus;
  newOrdersToInventoryRatio: number; // Backlog acceleration proxy
  subIndices: {
    newOrders: number;
    output: number;
    employment: number;
    supplierDeliveries: number;
    inputPrices: number;
  };
  historicalSeries: PmiHistoricalPoint[];
  macroNote: string;
}

export type LeiSignalStatus = 'expansion' | 'warning' | 'recession_signal';

export interface LeiComponent {
  id: string;
  name: string;
  category: 'financial' | 'expectations' | 'labor_manufacturing' | 'housing_orders';
  latestValue: string;
  sixMonthChangePct: number;
  netContribution: 'positive' | 'negative' | 'neutral';
  weightPct: number;
  description: string;
  leadingMechanism: string;
}

export interface LeiHistoricalPoint {
  date: string;
  indexLevel: number;
  sixMonthAnnualizedGrowth: number;
  isRecessionSignal: boolean;
  diffusionIndex: number;
}

export interface ConferenceBoardLeiProfile {
  currentIndexLevel: number;
  momChangePct: number;
  sixMonthAnnualizedGrowthPct: number;
  signalStatus: LeiSignalStatus;
  diffusionIndex: number;
  components: LeiComponent[];
  historicalSeries: LeiHistoricalPoint[];
  threeDRuleNote: string;
}

export interface GdpNowcastSectorContribution {
  personalConsumption: number;
  privateInvestment: number;
  governmentSpending: number;
  netExports: number;
}

export interface GdpNowcastEvolutionPoint {
  date: string;
  estimate: number;
  catalyst: string;
  impact: number;
}

export interface GdpNowcastQuarterSeries {
  quarter: string;
  atlantaFedGdpNow: number;
  nyFedNowcast: number;
  blueChipConsensus: number;
  officialBeaGdp: number | null;
  isQuarterClosed: boolean;
}

export interface GdpNowcastingProfile {
  currentQuarter: string;
  gdpNowEstimate: number;
  nyFedEstimate: number;
  blueChipConsensus: number;
  trailingOfficialGdp: number;
  trailingOfficialQuarter: string;
  officialReleaseLagDays: number;
  lastNowcastUpdate: string;
  sectorContributions: GdpNowcastSectorContribution;
  revisionEvolution: GdpNowcastEvolutionPoint[];
  quarterlyComparison: GdpNowcastQuarterSeries[];
  methodologyNote: string;
}

/* =========================================================================
 * Tier 3: External Sector, Balance of Payments & FX Strength Types
 * ========================================================================= */

export type EconomyBlocId = 'g7' | 'brics' | 'other' | 'financial_center';

export interface CurrentAccountProfile {
  countryCode: string;
  countryName: string;
  flag: string;
  bloc: EconomyBlocId;
  currentAccountPercentGdp: number;
  currentAccountBillionUSD: number;
  tradeBalanceBillionUSD: number;
  tradeBalancePercentGdp: number;
  goodsBalanceBillionUSD: number;
  servicesBalanceBillionUSD: number;
  fiscalBalancePercentGdp: number;
  externalDebtToGdp: number;
  fxReservesBillionUSD: number;
  importCoverMonths: number;
  twinDeficitWarning: boolean;
  solvencyRiskLevel: 'low' | 'moderate' | 'elevated' | 'critical';
  historicalSeries: Array<{
    year: number;
    currentAccountPercentGdp: number;
    tradeBalanceBillionUSD: number;
    fxReservesBillionUSD: number;
    externalDebtToGdp: number;
  }>;
  macroNote: string;
}

export interface DxyComponent {
  currencyCode: 'EUR' | 'JPY' | 'GBP' | 'CAD' | 'SEK' | 'CHF';
  currencyName: string;
  weightPercent: number;
  spotRate: number;
  ytdChangePct: number;
  description: string;
}

export interface DxyHistoricalPoint {
  date: string;
  dxyLevel: number;
  reerUsd: number;
  regime: string;
}

export interface DxyProfile {
  currentIndex: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  ytdChangePct: number;
  dollarRegime: 'smile_flight_to_safety' | 'rate_differential_driven' | 'twin_deficit_headwind' | 'neutral';
  regimeDescription: string;
  components: DxyComponent[];
  historicalSeries: DxyHistoricalPoint[];
}

export type ReerValuationStatus =
  | 'deeply_overvalued'
  | 'moderately_overvalued'
  | 'fairly_valued'
  | 'moderately_undervalued'
  | 'deeply_undervalued';

export interface ReerCurrencyProfile {
  currencyCode: string;
  currencyName: string;
  countryName: string;
  flag: string;
  bloc: EconomyBlocId;
  currentReer: number;
  tenYearAverageReer: number;
  valuationDeviationPct: number;
  valuationStatus: ReerValuationStatus;
  devaluationRiskScore: number;
  devaluationRiskCategory: 'low' | 'moderate' | 'elevated' | 'severe';
  historicalSeries: Array<{
    year: number;
    reer: number;
    valuationDeviation: number;
  }>;
  keyDriver: string;
}

export interface GscpiComponent {
  id: string;
  name: string;
  category: 'shipping_rates' | 'air_freight' | 'delivery_times' | 'backlogs_inventories';
  currentValueStdDev: number;
  trend: 'tightening' | 'easing' | 'neutral';
  weightDescription: string;
  description: string;
}

export interface GscpiHistoricalPoint {
  period: string;
  stdDevLevel: number;
  headlineCpiLaggedLead: number;
  eventAnnotation?: string;
}

export interface GscpiProfile {
  currentStdDev: number;
  status: 'extreme_stress' | 'elevated_pressure' | 'normal' | 'expansionary_slack';
  statusDescription: string;
  historicalPercentile: number;
  inflationTransmissionHorizonMonths: number;
  components: GscpiComponent[];
  historicalSeries: GscpiHistoricalPoint[];
  methodologyNote: string;
}

export interface TicHolderProfile {
  countryCode: string;
  countryName: string;
  flag: string;
  bloc: EconomyBlocId;
  holdingsBillionUSD: number;
  twelveMonthChangeBillionUSD: number;
  shareOfForeignHoldingsPct: number;
  shareOfTotalUsDebtPct: number;
  dominantHolderType: 'foreign_official_reserve' | 'private_offshore_custody' | 'institutional';
  strategicDirection: 'accumulating' | 'stable' | 'divesting';
  rationale: string;
}

export interface ForeignDebtHoldingsSeries {
  year: number;
  totalMarketableDebtTrillion: number;
  totalForeignHoldingsTrillion: number;
  foreignSharePct: number;
  foreignOfficialHoldingsTrillion: number;
  foreignPrivateHoldingsTrillion: number;
  foreignOfficialSharePct: number;
  chinaHoldingsBillion: number;
  japanHoldingsBillion: number;
}

export interface ReserveDiversificationSeries {
  year: number;
  usdSharePct: number;
  eurSharePct: number;
  goldSharePct: number;
  otherCurrenciesPct: number;
}

export interface CapitalFlowsProfile {
  totalForeignHoldingsBillion: number;
  latestNetForeignFlowMonthlyBillion: number;
  foreignShareOfUsDebtPct: number;
  foreignOfficialSharePct: number;
  chinaHoldingsBillion: number;
  japanHoldingsBillion: number;
  holders: TicHolderProfile[];
  historicalOwnership: ForeignDebtHoldingsSeries[];
  reserveDiversification: ReserveDiversificationSeries[];
  deDollarizationInsight: string;
}

export interface EvaluatedExternalSectorState {
  timestamp: string;
  dxySummary: {
    currentIndex: number;
    regime: string;
    ytdChangePct: number;
  };
  gscpiSummary: {
    currentStdDev: number;
    status: string;
    historicalPercentile: number;
  };
  currentAccountAlerts: Array<{
    id: string;
    countryCode: string;
    level: 'CRITICAL' | 'WARNING' | 'SURPLUS';
    headline: string;
    body: string;
  }>;
  reerExtremeAlerts: Array<{
    id: string;
    currencyCode: string;
    level: 'OVERVALUED' | 'UNDERVALUED';
    headline: string;
    body: string;
  }>;
  ticFlowAlerts: Array<{
    id: string;
    level: 'DIVERSIFICATION' | 'FLOW_SURGE';
    headline: string;
    body: string;
  }>;
}

export type EconomicReleaseCategory = 'central_bank' | 'inflation' | 'labor' | 'growth' | 'activity';
export type ReleaseImportance = 'tier1' | 'tier2' | 'tier3';
export type SurpriseDirection = 'beat' | 'miss' | 'in_line';
export type EconomicEventStatus = 'scheduled' | 'released';

export interface HistoricalReleaseCheckpoint {
  date: string;
  period: string;
  actual: number;
  consensus: number;
  surpriseDelta: number;
  direction: SurpriseDirection;
}

export interface EconomicReleaseEvent {
  id: string;
  title: string;
  countryCode: 'USA' | 'EMU' | 'GBR' | 'JPN' | 'CHN';
  countryName: string;
  flag: string;
  category: EconomicReleaseCategory;
  importance: ReleaseImportance;
  scheduledDate: string;
  period: string;
  status: EconomicEventStatus;
  previous: number | string | null;
  consensus: number | string | null;
  actual: number | string | null;
  unit: string;
  surpriseDelta: number | null;
  surpriseNormalized: number | null;
  direction: SurpriseDirection | null;
  marketImpactSummary: string;
  description: string;
  frequency: string;
  source: string;
  historicalTrackRecord?: HistoricalReleaseCheckpoint[];
}

export interface SurpriseIndexHistoricalPoint {
  date: string;
  usSurprise: number;
  eurozoneSurprise: number;
  globalSurprise: number;
}

export interface SurpriseCategoryBreakdown {
  category: EconomicReleaseCategory;
  categoryLabel: string;
  netScore: number;
  beatCount: number;
  missCount: number;
  inLineCount: number;
}

export interface SurpriseIndexProfile {
  region: 'US' | 'Eurozone' | 'Global';
  currentIndex: number;
  previousIndex: number;
  oneMonthChange: number;
  status: 'strong_positive' | 'moderate_positive' | 'neutral' | 'moderate_negative' | 'strong_negative';
  statusLabel: string;
  interpretation: string;
  beatRatioPct: number;
  topPositiveDrivers: string[];
  topNegativeDrags: string[];
  categoryBreakdown: SurpriseCategoryBreakdown[];
  history: SurpriseIndexHistoricalPoint[];
}

export interface CentralBankMeeting {
  id: string;
  institution: 'Federal Reserve' | 'European Central Bank' | 'Bank of England' | 'Bank of Japan';
  code: 'FOMC' | 'ECB' | 'BOE' | 'BOJ';
  flag: string;
  date: string;
  policyRateCurrent: number;
  expectedAction: 'hold' | 'cut_25' | 'cut_50' | 'hike_25';
  marketPricedProbabilities: {
    cut: number;
    hold: number;
    hike: number;
  };
  isBlackoutActive: boolean;
  blackoutStart: string;
  blackoutEnd: string;
  significance: string;
}

export interface CalendarFilterOptions {
  countryCode?: 'ALL' | 'USA' | 'EMU' | 'GBR' | 'JPN' | 'CHN';
  category?: 'ALL' | EconomicReleaseCategory;
  importance?: 'ALL' | ReleaseImportance;
  status?: 'ALL' | EconomicEventStatus;
  searchQuery?: string;
}

export interface EvaluatedCalendarState {
  timestamp: string;
  totalEventsTracked: number;
  upcomingEventsCount: number;
  releasedEventsCount: number;
  beatCount: number;
  missCount: number;
  inLineCount: number;
  beatRatioPct: number;
  cesiSummary: {
    usIndex: number;
    eurozoneIndex: number;
    globalIndex: number;
  };
  nextHighImpactRelease: {
    id: string;
    title: string;
    flag: string;
    scheduledDate: string;
    category: EconomicReleaseCategory;
  } | null;
  activeBlackoutAlerts: Array<{
    institution: string;
    headline: string;
    body: string;
    endDate: string;
  }>;
}

