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

// 3D Yield Curve Surface definitions for mapping time vs maturity vs yield
export interface YieldCurveSurfacePoint {
  tenor: string;
  tenorMonths: number;
  yieldPercent: number;
}

export interface YieldCurveSurfaceSlice {
  dateLabel: string;
  year: number;
  month?: number;
  quarter?: string;
  curve: YieldCurveSurfacePoint[];
  spread10Y2Y: number;
  spread10Y3M: number;
  isInverted: boolean;
  macroEvent?: string;
}

export interface YieldCurveSurfaceDataset {
  sovereignCode: 'USA' | 'DEU' | 'JPN' | 'GBR';
  name: string;
  flag: string;
  currency: string;
  tenors: string[];
  tenorMonths: number[];
  slices: YieldCurveSurfaceSlice[];
  minYield: number;
  maxYield: number;
  description: string;
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

/* =========================================================================
 * Tier 4: Corporate Credit Spreads, Financial Conditions & Bank Lending
 * ========================================================================= */

export type CreditStressLevel = 'compressed' | 'normal' | 'elevated' | 'distress' | 'crisis';
export type FinancialConditionsRegime = 'extremely_loose' | 'loose' | 'neutral' | 'tight' | 'restrictive';
export type CreditRatingTier = 'AAA_AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC_LOWER';
export type CreditRegionId = 'GLOBAL' | 'USA' | 'EUR' | 'EM';

export interface CreditRatingSpread {
  tier: CreditRatingTier;
  label: string;
  category: 'Investment Grade' | 'High Yield' | 'Distressed';
  oasBps: number;
  effectiveYieldPercent: number;
  benchmarkSpreadVs10Y: number;
  historicalPercentile: number;
  defaultRate12mPct: number;
  marketShareDebtPct: number;
  riskDescription: string;
}

export interface SloosSectorBreakdown {
  sectorId: string;
  sectorName: string;
  category: 'commercial' | 'real_estate' | 'consumer';
  netTighteningPct: number;
  loanDemandNetPct: number;
  status: 'easing' | 'neutral' | 'tightening' | 'severe_tightening';
  commentary: string;
}

export interface RegionalCreditProfile {
  regionId: CreditRegionId;
  name: string;
  shortName: string;
  flag: string;
  currency: string;
  benchmarkTenor: string;
  highYieldOasBps: number;
  investmentGradeOasBps: number;
  bbbSpreadBps: number;
  effectiveHighYieldPct: number;
  effectiveIgYieldPct: number;
  stressLevel: CreditStressLevel;
  historicalPercentile: number;
  fciIndex: number;
  fciRegime: FinancialConditionsRegime;
  bankLendingNetTighteningPct: number;
  surveyName: string;
  ratingTiers: CreditRatingSpread[];
  lendingSectors: SloosSectorBreakdown[];
  macroNote: string;
}

export interface CreditMarketHistoricalPoint {
  date: string;
  year: number;
  usHighYieldOasBps: number;
  usInvestmentGradeOasBps: number;
  usBbbOasBps: number;
  us10YYieldPercent: number;
  euroHighYieldOasBps: number;
  euroInvestmentGradeOasBps: number;
  emCorporateOasBps: number;
  globalCorporateOasBps: number;
  chicagoFedNfci: number;
  euroCiss: number;
  globalFci: number;
  nfciRiskSubindex: number;
  nfciCreditSubindex: number;
  nfciLeverageSubindex: number;
  sloosNetTighteningPct: number;
  ecbBlsNetTighteningPct: number;
  sloosLoanDemandPct: number;
  isRecession: boolean;
  eventAnnotation?: string;
}

export interface EvaluatedCreditState {
  timestamp: string;
  globalSummary: {
    globalCorporateOasBps: number;
    globalFciIndex: number;
    creditCyclePhase: string;
    stressLevel: CreditStressLevel;
  };
  regions: Record<
    CreditRegionId,
    {
      highYieldOasBps: number;
      investmentGradeOasBps: number;
      fciIndex: number;
      bankLendingTighteningPct: number;
      stressLevel: CreditStressLevel;
    }
  >;
  activeAlerts: Array<{
    id: string;
    regionId: CreditRegionId;
    level: 'CRITICAL' | 'WARNING' | 'BENIGN' | 'COMPRESSED';
    headline: string;
    body: string;
  }>;
}

export interface CreditMarketOverview {
  currentDate: string;
  regions: Record<CreditRegionId, RegionalCreditProfile>;
  globalAggregate: {
    globalCorporateOasBps: number;
    globalHighYieldOasBps: number;
    globalFciIndex: number;
    stressLevel: CreditStressLevel;
    effectiveYieldPct: number;
    summary: string;
  };
  highYieldOas: {
    currentBps: number;
    fiftyTwoWeekHighBps: number;
    fiftyTwoWeekLowBps: number;
    historicalPercentile: number;
    stressLevel: CreditStressLevel;
    effectiveYieldPct: number;
    summary: string;
  };
  investmentGradeOas: {
    currentBps: number;
    bbbFallenAngelSpreadBps: number;
    stressLevel: CreditStressLevel;
    effectiveYieldPct: number;
    summary: string;
  };
  financialConditions: {
    currentNfci: number;
    regime: FinancialConditionsRegime;
    adjustedNfci: number;
    riskSubindex: number;
    creditSubindex: number;
    leverageSubindex: number;
    trend3Month: 'easing' | 'tightening' | 'stable';
    summary: string;
  };
  bankLending: {
    currentNetTighteningPct: number;
    cAndIDemandNetPct: number;
    creTighteningPct: number;
    cyclePhase: 'expansionary_credit' | 'selective_lending' | 'credit_crunch';
    summary: string;
  };
  ratingTiers: CreditRatingSpread[];
  sloosBreakdown: SloosSectorBreakdown[];
  historicalSeries: CreditMarketHistoricalPoint[];
}

// -----------------------------------------------------------------------------
// Bond Market Volatility & Collateral Plumbing Types
// -----------------------------------------------------------------------------

export type BondVolatilityRegionId = 'GLOBAL' | 'USA' | 'EUR' | 'GBR' | 'JPN';

export type MoveStressLevel = 'compressed' | 'normal' | 'elevated' | 'severe' | 'crisis';

export type VixMoveRegime =
  | 'extreme_complacency'
  | 'moderate_complacency'
  | 'balanced'
  | 'bond_calm_equity_fear'
  | 'systemic_panic';

export interface EquityVolTermStructurePoint {
  tenor: '9D' | '30D' | '3M' | '6M' | '1Y';
  label: string;
  symbol: string;
  value: number;
  impliedDailyMovePct: number;
  regime: 'contango' | 'backwardation';
}

export interface HistoricalCrisisCase {
  id: string;
  title: string;
  date: string;
  peakMove: number;
  peakVix: number;
  vixMoveRatio: number;
  summary: string;
  collateralMechanism: string;
  policyIntervention: string;
}

export interface RegionalCollateralProfile {
  regionId: BondVolatilityRegionId;
  name: string;
  sovereignBondBenchmark: string;
  sovereignVolIndex: number;
  volatilityLabel: string;
  repoRatePct: number;
  policyRatePct: number;
  repoSpreadBps: number;
  primaryDealerHaircutPct: number;
  collateralVelocityMultiplier: number;
  collateralScarcityBps: number;
  failsToDeliverBillion: number;
  healthScore: number;
  stressLevel: MoveStressLevel;
  keyVulnerabilityNote: string;
}

export interface HistoricalBondVolatilityPoint {
  date: string;
  moveIndex: number;
  vixIndex: number;
  vixMoveRatio: number;
  euroSovVol: number;
  giltSovVol: number;
  jgbSovVol: number;
  repoHaircutPct: number;
  collateralStressIndex: number;
  notableEvent?: string;
}

export interface EvaluatedBondVolatilityState {
  timestamp: string;
  moveIndex: number;
  vixIndex: number;
  vixMoveRatio: number;
  vixMoveRegime: VixMoveRegime;
  moveStressLevel: MoveStressLevel;
  collateralHealthScore: number;
  termStructureSlope: 'contango' | 'backwardation' | 'flat';
  regions: Record<
    BondVolatilityRegionId,
    {
      sovereignVolIndex: number;
      repoSpreadBps: number;
      primaryDealerHaircutPct: number;
      healthScore: number;
      stressLevel: MoveStressLevel;
    }
  >;
  activeAlerts: Array<{
    id: string;
    level: 'CRITICAL' | 'WARNING' | 'COMPLACENCY' | 'INFO';
    headline: string;
    body: string;
  }>;
}

export interface BondVolatilityOverview {
  currentDate: string;
  latestMove: number;
  move52wHigh: number;
  move52wLow: number;
  latestVix: number;
  vix52wHigh: number;
  vix52wLow: number;
  vixMoveRatio: number;
  regime: VixMoveRegime;
  stressLevel: MoveStressLevel;
  globalCollateralHealthScore: number;
  termStructure: EquityVolTermStructurePoint[];
  regions: Record<BondVolatilityRegionId, RegionalCollateralProfile>;
  crises: HistoricalCrisisCase[];
  historicalSeries: HistoricalBondVolatilityPoint[];
}

// -----------------------------------------------------------------------------
// Housing Macro & Affordability Dynamics Types
// -----------------------------------------------------------------------------

export type HousingRegionId =
  | 'USA'
  | 'EUR'
  | 'GBR'
  | 'CAN'
  | 'AUS'
  | 'JPN'
  | 'CHN'
  | 'DEU'
  | 'FRA'
  | 'KOR'
  | 'SWE'
  | 'NZL'
  | 'CHE'
  | 'SGP'
  | 'ESP'
  | 'NLD';

export type HousingAffordabilityRegime =
  | 'severely_unaffordable'
  | 'unaffordable'
  | 'fairly_affordable'
  | 'highly_affordable';

export type MortgageTransmissionType = 'fixed_long' | 'fixed_medium_reset' | 'variable';

export interface RealHomePriceSeriesPoint {
  date: string;
  year: number;
  nominalCaseShiller: number;
  nominalFhfa: number;
  cpiIndex: number;
  realCaseShiller: number;
  realFhfa: number;
  medianHomePriceUsd: number;
  medianFamilyIncomeUsd: number;
  mortgageRate30Y: number;
  treasury10Y: number;
  mortgageSpreadBps: number;
  effectiveMortgageRate: number;
  hai: number;
  monthlyMortgagePayment: number;
  qualifyingIncome: number;
  housingPaymentShareOfIncome: number;
  eventNote?: string;
}

export interface RegionalHousingProfile {
  regionId: HousingRegionId;
  name: string;
  flag: string;
  currencySymbol: string;
  benchmarkMortgageRate: number;
  benchmarkRateLabel: string;
  mortgageStructure: MortgageTransmissionType;
  rateTransmissionSpeed: 'rapid' | 'moderate' | 'delayed_slow';
  medianHomePriceLocal: number;
  medianHouseholdIncomeLocal: number;
  priceToIncomeRatio: number;
  hai: number;
  householdDebtToGdpPct: number;
  realPriceChange5YPct: number;
  homeownershipRatePct: number;
  macroTransmissionNote: string;
}

export interface HousingMacroOverview {
  currentDate: string;
  currentHai: number;
  haiRegime: HousingAffordabilityRegime;
  currentMortgage30Y: number;
  mortgageSpreadBps: number;
  treasury10Y: number;
  effectiveExistingMortgageRate: number;
  lockInSpreadPct: number;
  currentNominalCaseShiller: number;
  currentRealCaseShiller: number;
  realCaseShillerPeakYear: number;
  realPriceAllTimeHighDeltaPct: number;
  totalGlobalRealEstateWealthTrillion: number;
  regions: Record<HousingRegionId, RegionalHousingProfile>;
  historicalSeries: RealHomePriceSeriesPoint[];
}

export interface EvaluatedHousingState {
  timestamp: string;
  hai: number;
  haiRegime: HousingAffordabilityRegime;
  mortgageRate30Y: number;
  mortgageSpreadBps: number;
  lockInSpreadPct: number;
  realCaseShiller: number;
  nominalCaseShiller: number;
  activeAlerts: Array<{
    id: string;
    level: 'CRITICAL' | 'WARNING' | 'BENIGN' | 'INFO';
    headline: string;
    body: string;
  }>;
}




