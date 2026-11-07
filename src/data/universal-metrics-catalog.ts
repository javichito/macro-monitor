import { GLOBAL_WEALTH_HISTORY } from './global-wealth';
import { GLOBAL_ASSET_HISTORY } from './asset-breakdown';
import { REGIONAL_ASSET_HISTORY } from './regional-asset-breakdown';
import { MACRO_TRENDS_HISTORY } from './macro-trends';
import { GLOBAL_LIQUIDITY_HISTORY } from './central-bank-liquidity-data';
import { COUNTRIES_DATA, ECONOMIC_BLOCS } from './country-metrics';
import { getLaborMetricsForCountry, US_LABOR_HISTORY } from './labor-market-data';
import { HISTORICAL_YIELD_SPREADS } from './yield-curve-data';
import {
  HISTORICAL_VELOCITY_SERIES,
  HISTORICAL_TREASURY_ISSUANCE_SERIES,
} from './monetary-mechanics-data';
import { HISTORICAL_BOND_VOLATILITY_SERIES } from './bond-volatility-data';
import { HISTORICAL_CREDIT_SERIES } from './credit-market-data';
import { CROSS_ASSET_RATIOS } from './cross-asset-ratios-data';
import { DXY_PROFILE_DATA, CAPITAL_FLOWS_TIC_DATA } from './external-sector-data';
import { HISTORICAL_HOUSING_SERIES } from './housing-macro-data';
import { HISTORICAL_PHYSICAL_ECONOMY_SERIES } from './physical-economy-data';
import { US_INFLATION_HISTORY } from './inflation-anatomy-data';
import { HISTORICAL_CONSUMER_SERIES } from './consumer-vulnerability-data';
import { adjustValue } from '../lib/formatters';
import { CurrencyPerspective, CountryYearMetric } from '../lib/types';

export type MetricPillarId =
  | 'wealth-distribution'
  | 'asset-classes'
  | 'macro-liquidity'
  | 'sovereign-economies'
  | 'rates-plumbing'
  | 'credit-ratios'
  | 'real-economy';

export type CustomChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'composed'
  | 'scatter'
  | 'stacked-area';

export type DataTransformMode = 'raw' | 'indexed100' | 'pctChange' | 'zScore';

export type CustomFormulaMode = 'none' | 'ratio' | 'spread' | 'sum';

export interface MetricPillarMeta {
  id: MetricPillarId;
  indexLabel: string;
  name: string;
  shortName: string;
  description: string;
}

export interface UniversalMetricDefinition {
  id: string;
  name: string;
  shortName: string;
  pillarId: MetricPillarId;
  unit: string;
  description: string;
  benchmarkNote: string;
  source: string;
  defaultColor: string;
  isCountryScoped?: boolean;
  isMonetaryCurrency?: boolean;
  extractRawSeries: (scopeCode?: string) => Array<{ year: number; value: number; note?: string }>;
}

export interface CustomGraphSeriesSpec {
  key: string;
  metricId: string;
  scopeCode?: string;
  color: string;
  yAxisId: 'left' | 'right';
  chartStyle: 'line' | 'area' | 'bar';
}

export interface ResolvedSeriesPoint {
  year: number;
  value: number;
  note?: string;
  isInterpolated?: boolean;
}

export interface ResolvedSeriesMetadata {
  key: string;
  metricId: string;
  scopeCode?: string;
  displayName: string;
  shortLabel: string;
  unit: string;
  pillarId: MetricPillarId;
  description: string;
  benchmarkNote: string;
  source: string;
  color: string;
  yAxisId: 'left' | 'right';
  chartStyle: 'line' | 'area' | 'bar';
  latestValue: number;
  latestYear: number;
  earliestValue: number;
  earliestYear: number;
  minValue: number;
  maxValue: number;
  meanValue: number;
  periodChangePct: number;
}

export interface CorrelationStats {
  pearsonR: number;
  rSquared: number;
  sampleSize: number;
  slope: number;
  intercept: number;
  strengthLabel: string;
  directionLabel: 'Positive Co-Movement' | 'Inverse Divergence' | 'Uncorrelated Noise';
  interpretation: string;
}

export interface AlignedGraphRow {
  year: number;
  [seriesKey: string]: number | string | null | undefined;
  formulaValue?: number | null;
  note?: string;
}

export interface AlignedGraphDataset {
  rows: AlignedGraphRow[];
  seriesMeta: ResolvedSeriesMetadata[];
  correlation: CorrelationStats | null;
  formulaLabel: string | null;
  formulaUnit: string | null;
}

export interface CrossCountrySnapshotPoint {
  code: string;
  name: string;
  flag: string;
  region: string;
  valueX: number;
  valueY: number;
  populationMillion: number;
}

export interface SavedCustomGraph {
  id: string;
  title: string;
  curiosityQuestion: string;
  chartType: CustomChartType;
  transformMode: DataTransformMode;
  formulaMode: CustomFormulaMode;
  leadLagYears: number;
  startYear: number;
  endYear: number;
  interpolateGaps: boolean;
  series: CustomGraphSeriesSpec[];
  createdAt: string;
}

/*
 * Organizing all 75+ metrics into 7 numbered field-guide pillars prevents dropdown fatigue
 * while giving users complete access to every dataset in the application.
 */
export const UNIVERSAL_METRIC_PILLARS: MetricPillarMeta[] = [
  {
    id: 'wealth-distribution',
    indexLabel: '01 / WEALTH & INEQUALITY',
    name: 'Global Wealth & Pyramid Shares',
    shortName: 'Global Wealth',
    description: 'Aggregate household net worth, median vs. mean adult wealth, Gini, and top/bottom decile shares.',
  },
  {
    id: 'asset-classes',
    indexLabel: '02 / ASSET CLASSES',
    name: 'Global & Regional Asset Breakdown',
    shortName: 'Asset Classes',
    description: 'Real estate, equities, bonds, cash, monetary gold, crypto, liabilities, and regional balance sheets.',
  },
  {
    id: 'macro-liquidity',
    indexLabel: '03 / MACRO & LIQUIDITY',
    name: 'Global Macro & Central Bank Plumbing',
    shortName: 'Macro & CBs',
    description: 'World GDP, global debt, central bank policy rates, FX reserves, Big 4 liquidity, Gold, and S&P 500.',
  },
  {
    id: 'sovereign-economies',
    indexLabel: '04 / SOVEREIGN ARENA',
    name: 'Country & Economic Bloc Metrics',
    shortName: 'By Country / Bloc',
    description: 'Compare any of 20 sovereign metrics across 26 individual countries or 5 economic blocs.',
  },
  {
    id: 'rates-plumbing',
    indexLabel: '05 / YIELDS & VELOCITY',
    name: 'Yield Curves, Volatility & Money Velocity',
    shortName: 'Yields & Velocity',
    description: '10Y-2Y/3M yield curve spreads, TIPS real yields, M2 money velocity, T-bill share, MOVE, and VIX.',
  },
  {
    id: 'credit-ratios',
    indexLabel: '06 / CREDIT & RATIOS',
    name: 'Corporate Credit Spreads & Macro Ratios',
    shortName: 'Credit & Ratios',
    description: 'High-Yield & IG OAS spreads, Chicago Fed NFCI, SLOOS bank lending, Copper/Gold, S&P/M2, and DXY.',
  },
  {
    id: 'real-economy',
    indexLabel: '07 / REAL ECONOMY',
    name: 'Housing, Energy, Inflation, Labor & Consumer',
    shortName: 'Real Economy',
    description: 'Housing Affordability (HAI), energy burden % GDP, CPI anatomy, Sahm Rule labor, and credit card stress.',
  },
];

export const SERIES_PALETTE = [
  '#38bdf8', // Sky Blue
  '#f59e0b', // Amber Gold
  '#34d399', // Emerald Green
  '#fb7185', // Rose Coral
  '#c084fc', // Violet Purple
  '#2dd4bf', // Teal Mint
];

/**
 * Extracts a 4-digit calendar year from heterogeneous date strings ("2020-01", "2022-Q3", "1985 (Plaza Accord)")
 * so quarterly and monthly series can be plotted on a unified timeline alongside annual datasets.
 */
function parseYearFromDateString(dateStr: string): number {
  const match = dateStr.match(/\b(19\d{2}|20\d{2})\b/);
  return match ? Number(match[1]) : 2026;
}

/**
 * Collapses multiple intra-year observations (e.g. Q1 and Q3 in the same calendar year)
 * by retaining the latest observation for each year so annual time-series joins remain 1-to-1.
 */
function deduplicateByYear(
  points: Array<{ year: number; value: number; note?: string }>
): Array<{ year: number; value: number; note?: string }> {
  const byYear = new Map<number, { year: number; value: number; note?: string }>();
  for (const pt of points) {
    if (Number.isFinite(pt.year) && Number.isFinite(pt.value)) {
      byYear.set(pt.year, {
        year: pt.year,
        value: Number(pt.value.toFixed(4)),
        note: pt.note,
      });
    }
  }
  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

/**
 * Helper to extract a specific asset category's value or share from GLOBAL_ASSET_HISTORY.
 */
function extractAssetCategoryMetric(
  categoryId: string,
  field: 'valueTrillion' | 'sharePercent'
): Array<{ year: number; value: number }> {
  return deduplicateByYear(
    GLOBAL_ASSET_HISTORY.map((entry) => {
      const cat = entry.categories.find((c) => c.id === categoryId);
      return {
        year: entry.year,
        value: cat ? cat[field] : 0,
      };
    })
  );
}

/**
 * Helper to extract a sovereign country or economic bloc metric across all available years.
 * Falls back gracefully to USA if a scope code is omitted.
 */
function extractSovereignMetricSeries(
  scopeCode: string = 'USA',
  extractor: (m: CountryYearMetric, year: number, code: string) => number | undefined,
  blocExtractor?: (b: any) => number | undefined
): Array<{ year: number; value: number }> {
  const normalizedCode = scopeCode.toUpperCase();

  // Check if the user selected an Economic Bloc (e.g. 'G7', 'BRICS', 'EU')
  const bloc = ECONOMIC_BLOCS.find((b) => b.id.toUpperCase() === normalizedCode);
  if (bloc && blocExtractor) {
    const pts: Array<{ year: number; value: number }> = [];
    for (const [yrStr, metric] of Object.entries(bloc.history)) {
      const val = blocExtractor(metric);
      if (val !== undefined && Number.isFinite(val)) {
        pts.push({ year: Number(yrStr), value: val });
      }
    }
    if (pts.length > 0) return deduplicateByYear(pts);
  }

  const country =
    COUNTRIES_DATA.find((c) => c.code.toUpperCase() === normalizedCode) || COUNTRIES_DATA[0];

  const points: Array<{ year: number; value: number }> = [];
  for (const [yrStr, metric] of Object.entries(country.history)) {
    const year = Number(yrStr);
    const val = extractor(metric, year, country.code);
    if (val !== undefined && Number.isFinite(val)) {
      points.push({ year, value: val });
    }
  }

  return deduplicateByYear(points);
}

export const UNIVERSAL_METRICS_CATALOG: UniversalMetricDefinition[] = [
  // =========================================================================
  // PILLAR 01: Global Wealth & Inequality
  // =========================================================================
  {
    id: 'gw_total_wealth',
    name: 'Total Global Private Wealth',
    shortName: 'Global Net Wealth',
    pillarId: 'wealth-distribution',
    unit: '$T',
    description: 'Aggregate net worth (financial + real assets minus household debt) of all adults on Earth.',
    benchmarkNote: '2026 reach: $478T (~3.9x annual world GDP)',
    source: 'UBS Global Wealth Databook / WID.world',
    defaultColor: '#34d399',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.totalWealthTrillion,
        }))
      ),
  },
  {
    id: 'gw_median_wealth',
    name: 'Global Median Wealth per Adult',
    shortName: 'Global Median Wealth',
    pillarId: 'wealth-distribution',
    unit: '$',
    description: 'Net worth of the exact middle (50th percentile) adult citizen on Planet Earth.',
    benchmarkNote: 'Middle human benchmark: ~$9,750 vs. ~$98,200 mean',
    source: 'UBS Global Wealth Databook',
    defaultColor: '#f59e0b',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.medianWealthPerAdult,
        }))
      ),
  },
  {
    id: 'gw_mean_wealth',
    name: 'Global Mean (Average) Wealth per Adult',
    shortName: 'Global Mean Wealth',
    pillarId: 'wealth-distribution',
    unit: '$',
    description: 'Total global household wealth divided equally by the global adult population.',
    benchmarkNote: 'Pulled 10x above median by top 1% asset holders',
    source: 'UBS Global Wealth Databook',
    defaultColor: '#38bdf8',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.meanWealthPerAdult,
        }))
      ),
  },
  {
    id: 'gw_gini',
    name: 'Global Wealth Gini Coefficient',
    shortName: 'Global Gini Index',
    pillarId: 'wealth-distribution',
    unit: 'index',
    description: 'Measures global wealth inequality from 0 (perfect equality) to 1 (single person owns everything).',
    benchmarkNote: '<0.70 moderate | >0.85 extreme global concentration',
    source: 'World Inequality Database (WID)',
    defaultColor: '#fb7185',
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.giniCoefficient,
        }))
      ),
  },
  {
    id: 'gw_top1_share',
    name: 'Top 1% Global Wealth Share',
    shortName: 'Top 1% Share',
    pillarId: 'wealth-distribution',
    unit: '%',
    description: 'Percentage of total global private wealth owned by the richest 1% of adults.',
    benchmarkNote: 'Top 1% holds ~44% of all global household net worth',
    source: 'WID.world / UBS Global Wealth Report',
    defaultColor: '#c084fc',
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.shares.top1Percent,
        }))
      ),
  },
  {
    id: 'gw_top10_share',
    name: 'Top 10% Global Wealth Share',
    shortName: 'Top 10% Share',
    pillarId: 'wealth-distribution',
    unit: '%',
    description: 'Percentage of total global private wealth owned by the richest 10% of adults.',
    benchmarkNote: 'Top decile commands >82% of global private capital',
    source: 'WID.world / UBS Global Wealth Report',
    defaultColor: '#818cf8',
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.shares.top10Percent,
        }))
      ),
  },
  {
    id: 'gw_middle40_share',
    name: 'Middle 40% Global Wealth Share',
    shortName: 'Middle 40% Share',
    pillarId: 'wealth-distribution',
    unit: '%',
    description: 'Share of global wealth held by the global middle class (50th to 90th percentiles).',
    benchmarkNote: 'Surged from 11.9% (1980) to >15.5% with Asian rise',
    source: 'WID.world / UBS Global Wealth Report',
    defaultColor: '#2dd4bf',
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.shares.middle40Percent,
        }))
      ),
  },
  {
    id: 'gw_bottom50_share',
    name: 'Bottom 50% Global Wealth Share',
    shortName: 'Bottom 50% Share',
    pillarId: 'wealth-distribution',
    unit: '%',
    description: 'Share of global private wealth owned by the poorer half of humanity combined.',
    benchmarkNote: 'Half of all adults collectively hold <2% of world wealth',
    source: 'WID.world / UBS Global Wealth Report',
    defaultColor: '#f97316',
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.shares.bottom50Percent,
        }))
      ),
  },
  {
    id: 'gw_adult_pop',
    name: 'Global Adult Population',
    shortName: 'Adult Population',
    pillarId: 'wealth-distribution',
    unit: 'B',
    description: 'Total global adult population (aged 20+) included in household balance sheet surveys.',
    benchmarkNote: 'Expanded from 2.8B (1980) to 5.45B (2026)',
    source: 'UN Population Division / UBS',
    defaultColor: '#94a3b8',
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_WEALTH_HISTORY.map((w) => ({
          year: w.year,
          value: w.adultPopulationBillions,
        }))
      ),
  },

  // =========================================================================
  // PILLAR 02: Global & Regional Asset Classes
  // =========================================================================
  {
    id: 'ga_gross_assets',
    name: 'Global Gross Assets (Before Debt)',
    shortName: 'Gross Assets',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Combined market value of all global real estate, equities, bonds, cash, gold, and alternatives before subtracting liabilities.',
    benchmarkNote: '2026 total: $542T gross assets across all asset classes',
    source: 'Savills / SIFMA / BIS / Federal Reserve',
    defaultColor: '#38bdf8',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_ASSET_HISTORY.map((a) => ({
          year: a.year,
          value: a.totalGrossAssetsTrillion,
        }))
      ),
  },
  {
    id: 'ga_liabilities',
    name: 'Global Household Liabilities & Debt',
    shortName: 'Household Debt',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Total household mortgages, consumer credit, and personal loans subtracted from gross assets.',
    benchmarkNote: 'Mortgages account for >72% of household liabilities',
    source: 'BIS / Federal Reserve Z.1',
    defaultColor: '#fb7185',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_ASSET_HISTORY.map((a) => ({
          year: a.year,
          value: a.totalLiabilitiesTrillion,
        }))
      ),
  },
  {
    id: 'ga_real_estate_val',
    name: 'Global Real Estate & Land Value',
    shortName: 'Real Estate ($T)',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Aggregate value of residential homes, commercial property, and agricultural farmland worldwide.',
    benchmarkNote: 'World’s largest store of wealth (~$200T+)',
    source: 'Savills World Research / OECD',
    defaultColor: '#10b981',
    isMonetaryCurrency: true,
    extractRawSeries: () => extractAssetCategoryMetric('real-estate', 'valueTrillion'),
  },
  {
    id: 'ga_real_estate_share',
    name: 'Real Estate Share of Global Assets',
    shortName: 'Real Estate Share (%)',
    pillarId: 'asset-classes',
    unit: '%',
    description: 'Percentage of global gross assets stored in physical property and land.',
    benchmarkNote: 'Shifted from 58% (1980) toward ~37% as financial assets grew',
    source: 'Savills / UBS',
    defaultColor: '#34d399',
    extractRawSeries: () => extractAssetCategoryMetric('real-estate', 'sharePercent'),
  },
  {
    id: 'ga_equities_val',
    name: 'Global Public & Private Equities Value',
    shortName: 'Equities ($T)',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Market capitalization of global listed corporate stocks, index funds, and private equity.',
    benchmarkNote: 'Compounded >20x since 1980 via corporate profit & multiple expansion',
    source: 'World Federation of Exchanges / SIFMA',
    defaultColor: '#06b6d4',
    isMonetaryCurrency: true,
    extractRawSeries: () => extractAssetCategoryMetric('equities', 'valueTrillion'),
  },
  {
    id: 'ga_equities_share',
    name: 'Equities Share of Global Assets',
    shortName: 'Equities Share (%)',
    pillarId: 'asset-classes',
    unit: '%',
    description: 'Percentage of global gross assets allocated to corporate equities.',
    benchmarkNote: 'Expanded from 17% (1980) to ~27% in 2026',
    source: 'SIFMA / UBS',
    defaultColor: '#38bdf8',
    extractRawSeries: () => extractAssetCategoryMetric('equities', 'sharePercent'),
  },
  {
    id: 'ga_bonds_val',
    name: 'Global Bonds & Pension Reserves Value',
    shortName: 'Bonds & Pensions ($T)',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Sovereign government bonds, corporate debt securities, and institutional pension reserves.',
    benchmarkNote: 'Foundational institutional collateral pool',
    source: 'BIS / SIFMA Capital Markets Fact Book',
    defaultColor: '#6366f1',
    isMonetaryCurrency: true,
    extractRawSeries: () => extractAssetCategoryMetric('bonds-pensions', 'valueTrillion'),
  },
  {
    id: 'ga_cash_val',
    name: 'Global Cash, Checking & Bank Deposits',
    shortName: 'Cash & Deposits ($T)',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Physical currency, commercial bank checking/savings accounts, and money market funds.',
    benchmarkNote: 'Liquid dry powder across global households',
    source: 'IMF / Central Bank Monetary Aggregates',
    defaultColor: '#f59e0b',
    isMonetaryCurrency: true,
    extractRawSeries: () => extractAssetCategoryMetric('cash-deposits', 'valueTrillion'),
  },
  {
    id: 'ga_gold_val',
    name: 'Global Monetary Gold & Precious Metals',
    shortName: 'Gold Reserves ($T)',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Above-ground central bank gold bullion, investment bars, coins, and jewelry.',
    benchmarkNote: 'Zero-counterparty-risk monetary anchor',
    source: 'World Gold Council',
    defaultColor: '#eab308',
    isMonetaryCurrency: true,
    extractRawSeries: () => extractAssetCategoryMetric('gold-metals', 'valueTrillion'),
  },
  {
    id: 'ga_crypto_val',
    name: 'Global Crypto, Art & Alternative Assets',
    shortName: 'Crypto & Alts ($T)',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Digital assets (Bitcoin, Ethereum, tokenized assets), fine art, and collectibles.',
    benchmarkNote: 'Fastest-growing high-beta alternative asset cohort',
    source: 'CoinGecko / Art Basel UBS Report',
    defaultColor: '#a855f7',
    isMonetaryCurrency: true,
    extractRawSeries: () => extractAssetCategoryMetric('crypto-alternatives', 'valueTrillion'),
  },
  {
    id: 'ra_na_wealth',
    name: 'North America Net Wealth',
    shortName: 'North America Wealth',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Net household wealth held across the United States and Canada.',
    benchmarkNote: 'Equity-heavy balance sheet (~$168T in 2026)',
    source: 'Federal Reserve Z.1 / Statistics Canada',
    defaultColor: '#38bdf8',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        REGIONAL_ASSET_HISTORY.map((r) => ({
          year: r.year,
          value: r.regions['north-america'].netWealthTrillion,
        }))
      ),
  },
  {
    id: 'ra_eu_wealth',
    name: 'Europe Net Wealth',
    shortName: 'Europe Wealth',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Net household wealth across the European Union, UK, Switzerland, and Norway.',
    benchmarkNote: 'Balanced property and pension wealth (~$115T in 2026)',
    source: 'ECB / Eurostat / ONS',
    defaultColor: '#818cf8',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        REGIONAL_ASSET_HISTORY.map((r) => ({
          year: r.year,
          value: r.regions['europe'].netWealthTrillion,
        }))
      ),
  },
  {
    id: 'ra_apac_wealth',
    name: 'Asia-Pacific Net Wealth',
    shortName: 'Asia-Pacific Wealth',
    pillarId: 'asset-classes',
    unit: '$T',
    description: 'Net household wealth across China, Japan, India, Australia, South Korea, and ASEAN.',
    benchmarkNote: 'Expanded from $6.8T (1980) to $156T (2026)',
    source: 'UBS / PBOC / Bank of Japan',
    defaultColor: '#10b981',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        REGIONAL_ASSET_HISTORY.map((r) => ({
          year: r.year,
          value: r.regions['asia-pacific'].netWealthTrillion,
        }))
      ),
  },

  // =========================================================================
  // PILLAR 03: Global Macro & Central Bank Liquidity
  // =========================================================================
  {
    id: 'mt_global_gdp',
    name: 'World Annual GDP (Economic Output)',
    shortName: 'World GDP',
    pillarId: 'macro-liquidity',
    unit: '$T',
    description: 'Total annual value of all goods and services produced across the world economy.',
    benchmarkNote: '2026 output: $122.4T annual global income flow',
    source: 'IMF World Economic Outlook / World Bank',
    defaultColor: '#10b981',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.globalGdpTrillion,
        }))
      ),
  },
  {
    id: 'mt_global_debt',
    name: 'Total Global Debt (Sovereign + Corporate + Household)',
    shortName: 'Global Debt ($T)',
    pillarId: 'macro-liquidity',
    unit: '$T',
    description: 'Combined government, non-financial corporate, financial, and household debt worldwide.',
    benchmarkNote: 'Reached $334T in 2026 (up from $19.5T in 1980)',
    source: 'Institute of International Finance (IIF) / BIS',
    defaultColor: '#f43f5e',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.globalDebtTrillion,
        }))
      ),
  },
  {
    id: 'mt_debt_to_gdp',
    name: 'Global Debt-to-GDP Ratio',
    shortName: 'Global Debt/GDP (%)',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'Total global debt expressed as a percentage of annual world economic output.',
    benchmarkNote: 'Peaked at 341% in 2020; stands at ~273% in 2026',
    source: 'IIF / IMF Global Debt Monitor',
    defaultColor: '#fb7185',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.globalDebtToGdp,
        }))
      ),
  },
  {
    id: 'mt_global_inflation',
    name: 'Global Headline CPI Inflation Rate',
    shortName: 'Global Inflation (%)',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'World GDP-weighted annual consumer price inflation rate.',
    benchmarkNote: '1980 peak: 13.5% | 2022 shock: 8.7% | 2026: 3.1%',
    source: 'IMF World Economic Outlook',
    defaultColor: '#f59e0b',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.globalInflationRate,
        }))
      ),
  },
  {
    id: 'mt_us_cpi_index',
    name: 'Cumulative CPI Price Level Index (Base 2000 = 100)',
    shortName: 'CPI Price Index',
    pillarId: 'macro-liquidity',
    unit: 'index',
    description: 'Tracks cumulative purchasing power erosion since 1980 (indexed to 100 in the year 2000).',
    benchmarkNote: '$100 in 2000 requires ~$189.50 in 2026',
    source: 'US Bureau of Labor Statistics (BLS)',
    defaultColor: '#fbbf24',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.usCpiIndex,
        }))
      ),
  },
  {
    id: 'mt_rate_fed',
    name: 'US Federal Reserve Policy Rate',
    shortName: 'Fed Funds Rate',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'Federal Open Market Committee (FOMC) benchmark overnight target interest rate.',
    benchmarkNote: 'Anchor price of global US Dollar credit',
    source: 'Federal Reserve Board (FRED)',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.centralBankRates.fed,
        }))
      ),
  },
  {
    id: 'mt_rate_ecb',
    name: 'European Central Bank (ECB) Policy Rate',
    shortName: 'ECB Policy Rate',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'Eurosystem deposit facility / main refinancing benchmark rate.',
    benchmarkNote: 'Exited negative rates in 2022; calibrated easing in 2026',
    source: 'European Central Bank',
    defaultColor: '#818cf8',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.centralBankRates.ecb,
        }))
      ),
  },
  {
    id: 'mt_rate_boj',
    name: 'Bank of Japan (BoJ) Policy Rate',
    shortName: 'BoJ Policy Rate',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'Uncollateralized overnight call rate set by the Bank of Japan.',
    benchmarkNote: 'Global yen carry trade funding anchor (0.75% in 2026)',
    source: 'Bank of Japan',
    defaultColor: '#10b981',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.centralBankRates.boj,
        }))
      ),
  },
  {
    id: 'mt_rate_pboc',
    name: 'People’s Bank of China (PBoC) Policy Rate',
    shortName: 'PBoC Policy Rate',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'Benchmark lending / LPR policy rate of the People’s Bank of China.',
    benchmarkNote: 'Secular easing trajectory to counter property deflation',
    source: 'People’s Bank of China',
    defaultColor: '#f43f5e',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.centralBankRates.pboc,
        }))
      ),
  },
  {
    id: 'mt_rate_boe',
    name: 'Bank of England (BoE) Base Rate',
    shortName: 'BoE Base Rate',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'Official Bank Rate set by the Bank of England Monetary Policy Committee.',
    benchmarkNote: '2026 rate: 3.75% amid sticky UK services inflation',
    source: 'Bank of England',
    defaultColor: '#f59e0b',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.centralBankRates.boe,
        }))
      ),
  },
  {
    id: 'mt_res_usd',
    name: 'US Dollar Share of Global FX Reserves',
    shortName: 'USD Reserve Share (%)',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'Percentage of allocated official central bank foreign exchange reserves held in USD.',
    benchmarkNote: 'Gradual slide from 71.2% (2000) to 56.4% (2026)',
    source: 'IMF COFER Database',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.currencyReserves.usd,
        }))
      ),
  },
  {
    id: 'mt_res_gold',
    name: 'Gold & Non-Traditional Share of Global Reserves',
    shortName: 'Gold Reserve Share (%)',
    pillarId: 'macro-liquidity',
    unit: '%',
    description: 'Share of sovereign central bank reserves held in monetary gold and non-traditional reserve currencies.',
    benchmarkNote: 'Quadrupled from 2.8% (2000) to 11.5% (2026)',
    source: 'IMF COFER / World Gold Council',
    defaultColor: '#eab308',
    extractRawSeries: () =>
      deduplicateByYear(
        MACRO_TRENDS_HISTORY.map((m) => ({
          year: m.year,
          value: m.currencyReserves.goldAndOther,
        }))
      ),
  },
  {
    id: 'cbl_big4_total',
    name: 'Big 4 Central Bank Total Balance Sheet (Fed+ECB+PBoC+BoJ)',
    shortName: 'Big 4 CB Assets ($T)',
    pillarId: 'macro-liquidity',
    unit: '$T',
    description: 'Combined balance sheet assets of the Federal Reserve, ECB, People’s Bank of China, and Bank of Japan.',
    benchmarkNote: 'Primary global liquidity tide (~$25T–$30T)',
    source: 'Fed / ECB / PBoC / BoJ',
    defaultColor: '#38bdf8',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_LIQUIDITY_HISTORY.map((pt) => ({
          year: parseYearFromDateString(pt.date),
          value: pt.totalBig4Usd,
          note: pt.label,
        }))
      ),
  },
  {
    id: 'cbl_us_net_liq',
    name: 'US Net Liquidity (Fed Assets − TGA − ON RRP)',
    shortName: 'US Net Liquidity ($T)',
    pillarId: 'macro-liquidity',
    unit: '$T',
    description: 'Effective US dollar liquidity available to commercial banks and financial markets after subtracting Treasury cash (TGA) and Reverse Repo (ON RRP).',
    benchmarkNote: 'High correlation (r > 0.85) with S&P 500 & risk assets',
    source: 'Federal Reserve H.4.1 / US Treasury',
    defaultColor: '#2dd4bf',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_LIQUIDITY_HISTORY.map((pt) => ({
          year: parseYearFromDateString(pt.date),
          value: pt.usNetLiquidityUsd,
          note: pt.label,
        }))
      ),
  },
  {
    id: 'cbl_sp500',
    name: 'S&P 500 Equity Index',
    shortName: 'S&P 500 (pts)',
    pillarId: 'macro-liquidity',
    unit: 'pts',
    description: 'US large-cap equity benchmark index across historical monetary regimes.',
    benchmarkNote: 'Global risk-asset bellwether',
    source: 'S&P Dow Jones Indices',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        CROSS_ASSET_RATIOS['sp500-m2'].history.map((pt) => ({
          year: pt.year,
          value: pt.numeratorValue,
          note: pt.eventNote,
        }))
      ),
  },
  {
    id: 'cbl_gold_price',
    name: 'Spot Gold Price (USD / oz)',
    shortName: 'Gold Price ($/oz)',
    pillarId: 'macro-liquidity',
    unit: '$/oz',
    description: ' Spot price per troy ounce of monetary gold in US Dollars.',
    benchmarkNote: 'Surged from $279/oz (2000) to $2,650+/oz (2026)',
    source: 'LBMA / COMEX',
    defaultColor: '#f59e0b',
    extractRawSeries: () =>
      deduplicateByYear(
        CROSS_ASSET_RATIOS['copper-gold'].history.map((pt) => ({
          year: pt.year,
          value: pt.denominatorValue,
          note: pt.eventNote,
        }))
      ),
  },
  {
    id: 'cbl_bitcoin',
    name: 'Bitcoin Spot Price (USD)',
    shortName: 'Bitcoin ($)',
    pillarId: 'macro-liquidity',
    unit: '$',
    description: 'Spot market price of Bitcoin (BTC) in USD across recent liquidity cycles (2020–2026).',
    benchmarkNote: 'Highest-beta global liquidity barometer',
    source: 'CoinMetrics / Bloomberg',
    defaultColor: '#f97316',
    extractRawSeries: () =>
      deduplicateByYear(
        GLOBAL_LIQUIDITY_HISTORY.map((pt) => ({
          year: parseYearFromDateString(pt.date),
          value: pt.bitcoinPrice,
          note: pt.label,
        }))
      ),
  },

  // =========================================================================
  // PILLAR 04: Sovereign Country & Bloc Metrics (Parameterized by Country/Bloc)
  // =========================================================================
  {
    id: 'country:gdpTrillionUSD',
    name: 'Sovereign Annual GDP',
    shortName: 'GDP ($T)',
    pillarId: 'sovereign-economies',
    unit: '$T',
    description: 'Annual gross domestic product of the selected country or economic bloc.',
    benchmarkNote: 'Select any country or bloc to compare output trajectories',
    source: 'IMF WEO / World Bank',
    defaultColor: '#38bdf8',
    isCountryScoped: true,
    isMonetaryCurrency: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(
        code,
        (m) => m.gdpTrillionUSD,
        (b) => b.gdpTrillionUSD
      ),
  },
  {
    id: 'country:gdpPerCapitaUSD',
    name: 'Sovereign GDP per Capita',
    shortName: 'GDP per Capita ($)',
    pillarId: 'sovereign-economies',
    unit: '$',
    description: 'Annual economic output divided by total population for the selected sovereign or bloc.',
    benchmarkNote: 'Standard proxy for average national productivity & income',
    source: 'IMF WEO / World Bank',
    defaultColor: '#06b6d4',
    isCountryScoped: true,
    isMonetaryCurrency: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(
        code,
        (m) => m.gdpPerCapitaUSD,
        (b) => b.gdpPerCapitaUSD
      ),
  },
  {
    id: 'country:totalWealthTrillion',
    name: 'Sovereign Total Private Wealth',
    shortName: 'Total Wealth ($T)',
    pillarId: 'sovereign-economies',
    unit: '$T',
    description: 'Aggregate private household net worth in the selected country or economic bloc.',
    benchmarkNote: 'National household balance sheet stock',
    source: 'UBS Global Wealth Databook',
    defaultColor: '#34d399',
    isCountryScoped: true,
    isMonetaryCurrency: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(
        code,
        (m) => m.totalWealthTrillion,
        (b) => b.totalWealthTrillion
      ),
  },
  {
    id: 'country:medianWealthUSD',
    name: 'Sovereign Median Wealth per Adult',
    shortName: 'Median Wealth ($)',
    pillarId: 'sovereign-economies',
    unit: '$',
    description: 'Net worth of the 50th-percentile middle adult citizen in the selected country or bloc.',
    benchmarkNote: 'True middle-class prosperity barometer',
    source: 'UBS Global Wealth Databook',
    defaultColor: '#f59e0b',
    isCountryScoped: true,
    isMonetaryCurrency: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(
        code,
        (m) => m.medianWealthUSD,
        (b) => b.medianWealthUSD
      ),
  },
  {
    id: 'country:wealthPerAdultUSD',
    name: 'Sovereign Mean (Average) Wealth per Adult',
    shortName: 'Mean Wealth ($)',
    pillarId: 'sovereign-economies',
    unit: '$',
    description: 'Average private net worth per adult citizen in the selected country or bloc.',
    benchmarkNote: 'Compare against Median Wealth to see national wealth skew',
    source: 'UBS Global Wealth Databook',
    defaultColor: '#818cf8',
    isCountryScoped: true,
    isMonetaryCurrency: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(
        code,
        (m) => m.wealthPerAdultUSD,
        (b) => b.wealthPerAdultUSD
      ),
  },
  {
    id: 'country:realGdpGrowth',
    name: 'Sovereign Real GDP Growth Rate',
    shortName: 'Real GDP Growth (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Inflation-adjusted annual economic growth rate of the selected country.',
    benchmarkNote: 'Developed norm: 1.5–2.5% | Emerging growth: 4.0–7.0%',
    source: 'IMF World Economic Outlook',
    defaultColor: '#10b981',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.realGdpGrowth),
  },
  {
    id: 'country:inflationRate',
    name: 'Sovereign CPI Inflation Rate',
    shortName: 'CPI Inflation (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Annual consumer price index inflation rate in the selected country.',
    benchmarkNote: 'Central bank target anchor: ~2.0%',
    source: 'National Statistical Offices / IMF',
    defaultColor: '#f97316',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.inflationRate),
  },
  {
    id: 'country:debtToGdp',
    name: 'Sovereign Government Debt-to-GDP',
    shortName: 'Debt-to-GDP (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Gross general government debt as a percentage of nominal GDP.',
    benchmarkNote: 'Maastricht ceiling: 60% | >100% high fiscal leverage',
    source: 'IMF Fiscal Monitor / BIS',
    defaultColor: '#fb7185',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.debtToGdp),
  },
  {
    id: 'country:policyRate',
    name: 'Sovereign Central Bank Policy Rate',
    shortName: 'Policy Rate (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Benchmark short-term policy interest rate set by the country’s central bank.',
    benchmarkNote: 'Compare with CPI Inflation to gauge Real Policy Rate (r − π)',
    source: 'BIS Central Bank Policy Rate Database',
    defaultColor: '#38bdf8',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.policyRate),
  },
  {
    id: 'country:bondYield10Y',
    name: 'Sovereign 10-Year Government Bond Yield',
    shortName: '10Y Bond Yield (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Market yield on the sovereign nation’s 10-year benchmark government bond.',
    benchmarkNote: 'Reflects long-term growth, inflation, and fiscal risk premium',
    source: 'Bloomberg / TradingEconomics / Central Banks',
    defaultColor: '#c084fc',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.bondYield10Y),
  },
  {
    id: 'country:currentAccountPercentGdp',
    name: 'Sovereign Current Account Balance (% GDP)',
    shortName: 'Current Account (% GDP)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Net trade in goods/services plus cross-border income flows as a % of GDP.',
    benchmarkNote: '>0% net exporter/creditor | <-3% external funding reliance',
    source: 'IMF Balance of Payments Statistics',
    defaultColor: '#2dd4bf',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.currentAccountPercentGdp),
  },
  {
    id: 'country:fiscalBalancePercentGdp',
    name: 'Sovereign Government Fiscal Balance (% GDP)',
    shortName: 'Fiscal Balance (% GDP)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Annual government tax revenues minus public spending as a percentage of GDP.',
    benchmarkNote: '<-3% structural deficit warning; <-6% fiscal dominance risk',
    source: 'IMF Fiscal Monitor',
    defaultColor: '#f43f5e',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.fiscalBalancePercentGdp),
  },
  {
    id: 'country:fxReservesBillionUSD',
    name: 'Sovereign FX & Gold Reserves',
    shortName: 'FX Reserves ($B)',
    pillarId: 'sovereign-economies',
    unit: '$B',
    description: 'Official central bank foreign currency and monetary gold reserves in billions USD.',
    benchmarkNote: 'External currency defense war chest',
    source: 'IMF International Financial Statistics',
    defaultColor: '#eab308',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.fxReservesBillionUSD),
  },
  {
    id: 'country:gini',
    name: 'Sovereign Wealth Gini Coefficient',
    shortName: 'Wealth Gini (0–1)',
    pillarId: 'sovereign-economies',
    unit: 'index',
    description: 'Internal household wealth inequality index (0 = equal, 1 = total concentration).',
    benchmarkNote: '<0.65 egalitarian | >0.80 highly concentrated',
    source: 'UBS Global Wealth Databook / WID',
    defaultColor: '#fb7185',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.gini),
  },
  {
    id: 'country:oldAgeDependencyRatio',
    name: 'Sovereign Old-Age Dependency Ratio',
    shortName: 'Old-Age Dependency (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Number of retirees (65+) per 100 working-age citizens (15–64).',
    benchmarkNote: '>35% severe pension & healthcare fiscal pressure',
    source: 'UN World Population Prospects / World Bank',
    defaultColor: '#a855f7',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.oldAgeDependencyRatio),
  },
  {
    id: 'country:populationMillion',
    name: 'Sovereign Total Population',
    shortName: 'Population (M)',
    pillarId: 'sovereign-economies',
    unit: 'M',
    description: 'Total resident population in millions for the selected country or bloc.',
    benchmarkNote: 'Demographic scale foundation',
    source: 'UN Population Division',
    defaultColor: '#94a3b8',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(
        code,
        (m) => m.populationMillion,
        (b) => b.populationMillion
      ),
  },
  {
    id: 'country:financialShare',
    name: 'Sovereign Household Financial Asset Share',
    shortName: 'Financial Asset Share (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Share of gross household assets held in financial securities (stocks, bonds, pensions, cash).',
    benchmarkNote: 'US >68% financialized vs. Europe/Asia property-heavy',
    source: 'OECD / UBS Global Wealth Report',
    defaultColor: '#38bdf8',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.assetMix.financialShare),
  },
  {
    id: 'country:nonFinancialShare',
    name: 'Sovereign Household Real Estate & Tangible Share',
    shortName: 'Property Asset Share (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Share of gross household assets held in physical property, housing, and land.',
    benchmarkNote: 'High property share amplifies mortgage rate sensitivity',
    source: 'OECD / UBS Global Wealth Report',
    defaultColor: '#10b981',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m) => m.assetMix.nonFinancialShare),
  },
  {
    id: 'country:unemploymentRate',
    name: 'Sovereign Civilian Unemployment Rate',
    shortName: 'Unemployment (%)',
    pillarId: 'sovereign-economies',
    unit: '%',
    description: 'Headline civilian unemployment rate (U-3 equivalent) for the selected country.',
    benchmarkNote: '<4.5% tight labor market | >7.0% recessionary slack',
    source: 'ILO / OECD / BLS',
    defaultColor: '#f59e0b',
    isCountryScoped: true,
    extractRawSeries: (code = 'USA') =>
      extractSovereignMetricSeries(code, (m, yr, c) => {
        const lab = m.labor || getLaborMetricsForCountry(c, yr);
        return lab?.unemploymentRate;
      }),
  },

  // =========================================================================
  // PILLAR 05: Yield Curves, Volatility & Monetary Plumbing
  // =========================================================================
  {
    id: 'yc_10y2y_spread',
    name: 'US 10Y-2Y Treasury Yield Curve Spread',
    shortName: 'US 10Y-2Y Spread (%)',
    pillarId: 'rates-plumbing',
    unit: '%',
    description: 'Yield difference between 10-Year and 2-Year US Treasury notes. Negative values indicate yield curve inversion.',
    benchmarkNote: '<0.00% inverted warning; un-inversion often precedes recessions',
    source: 'Federal Reserve FRED (T10Y2Y)',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_YIELD_SPREADS.map((y) => ({
          year: y.year,
          value: y.us10Y2YSpread,
        }))
      ),
  },
  {
    id: 'yc_10y3m_spread',
    name: 'US 10Y-3M Treasury Yield Curve Spread (NY Fed Model)',
    shortName: 'US 10Y-3M Spread (%)',
    pillarId: 'rates-plumbing',
    unit: '%',
    description: 'Yield difference between 10-Year Treasury notes and 3-Month Treasury bills used in the NY Fed recession probit model.',
    benchmarkNote: 'Single most accurate 12-month recession predictor since 1955',
    source: 'Federal Reserve Bank of New York / FRED',
    defaultColor: '#818cf8',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_YIELD_SPREADS.map((y) => ({
          year: y.year,
          value: y.us10Y3MSpread,
        }))
      ),
  },
  {
    id: 'yc_10y_nominal',
    name: 'US 10-Year Nominal Treasury Yield',
    shortName: 'US 10Y Nominal (%)',
    pillarId: 'rates-plumbing',
    unit: '%',
    description: 'Benchmark 10-Year US Treasury yield used to discount global equities and price 30-year mortgages.',
    benchmarkNote: '40-year bull market bottomed at 0.89% (2020); ~4.19% in 2026',
    source: 'US Department of the Treasury',
    defaultColor: '#06b6d4',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_YIELD_SPREADS.map((y) => ({
          year: y.year,
          value: y.us10YNominal,
        }))
      ),
  },
  {
    id: 'yc_10y_real_tips',
    name: 'US 10-Year Real TIPS Yield (Inflation-Protected)',
    shortName: 'US 10Y Real Yield (%)',
    pillarId: 'rates-plumbing',
    unit: '%',
    description: 'Real return on 10-Year Treasury Inflation-Protected Securities after stripping out breakeven inflation.',
    benchmarkNote: '>2.0% tightens financial conditions & pressures P/E multiples',
    source: 'Federal Reserve FRED (DFII10)',
    defaultColor: '#f59e0b',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_YIELD_SPREADS.map((y) => ({
          year: y.year,
          value: y.us10YRealTIPS,
        }))
      ),
  },
  {
    id: 'mm_m2_supply',
    name: 'US M2 Money Supply',
    shortName: 'US M2 Supply ($T)',
    pillarId: 'rates-plumbing',
    unit: '$T',
    description: 'Broad US money stock including currency, checking deposits, savings deposits, and retail money market funds.',
    benchmarkNote: 'Expanded from $4.7T (2000) to $21.6T (2026)',
    source: 'Federal Reserve H.6 Release',
    defaultColor: '#34d399',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_VELOCITY_SERIES.map((v) => ({
          year: v.year,
          value: v.m2MoneySupplyTrillionUsd,
          note: v.historicalContext,
        }))
      ),
  },
  {
    id: 'mm_m2_velocity',
    name: 'US M2 Monetary Velocity (GDP ÷ M2)',
    shortName: 'M2 Velocity (x)',
    pillarId: 'rates-plumbing',
    unit: 'x',
    description: 'Frequency at which one unit of M2 currency is spent on domestic goods and services per year.',
    benchmarkNote: 'Plunged from 2.14x (2000) to 1.12x (2020); rebounded to ~1.39x',
    source: 'Federal Reserve FRED (M2V)',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_VELOCITY_SERIES.map((v) => ({
          year: v.year,
          value: v.velocity,
          note: v.historicalContext,
        }))
      ),
  },
  {
    id: 'mm_tbill_share',
    name: 'US Treasury T-Bill Share of Marketable Debt',
    shortName: 'T-Bill Share (%)',
    pillarId: 'rates-plumbing',
    unit: '%',
    description: 'Percentage of marketable US Treasury debt funded via short-term T-Bills (<1Y maturity) vs. long coupons.',
    benchmarkNote: 'TBAC recommended band: 15%–20% (>21% acts as "Shadow QE")',
    source: 'US Treasury TBAC / Monthly Statement of Public Debt',
    defaultColor: '#c084fc',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_TREASURY_ISSUANCE_SERIES.map((t) => ({
          year: t.year,
          value: t.tBillSharePct,
          note: t.policyNote,
        }))
      ),
  },
  {
    id: 'bvp_move_index',
    name: 'ICE BofA MOVE Index (Treasury Bond Volatility)',
    shortName: 'MOVE Index (pts)',
    pillarId: 'rates-plumbing',
    unit: 'pts',
    description: 'Implied yield volatility across 2Y, 5Y, 10Y, and 30Y US Treasury options — the "VIX of Bonds".',
    benchmarkNote: '<80 benign | >120 dealer repo stress | >140 collateral crisis',
    source: 'ICE BofA / Bloomberg',
    defaultColor: '#fb7185',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_BOND_VOLATILITY_SERIES.map((b) => ({
          year: parseYearFromDateString(b.date),
          value: b.moveIndex,
          note: b.notableEvent,
        }))
      ),
  },
  {
    id: 'bvp_vix_index',
    name: 'CBOE VIX Index (S&P 500 Equity Volatility)',
    shortName: 'VIX Index (pts)',
    pillarId: 'rates-plumbing',
    unit: 'pts',
    description: '30-day implied volatility of S&P 500 index options.',
    benchmarkNote: '<15 complacency | >30 equity fear | >50 systemic panic',
    source: 'CBOE Global Markets',
    defaultColor: '#f59e0b',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_BOND_VOLATILITY_SERIES.map((b) => ({
          year: parseYearFromDateString(b.date),
          value: b.vixIndex,
          note: b.notableEvent,
        }))
      ),
  },

  // =========================================================================
  // PILLAR 06: Corporate Credit & Cross-Asset Ratios
  // =========================================================================
  {
    id: 'cm_us_hy_oas',
    name: 'US High-Yield Corporate Bond Spread (OAS)',
    shortName: 'US High-Yield OAS (bps)',
    pillarId: 'credit-ratios',
    unit: 'bps',
    description: 'Option-adjusted credit spread paid by below-investment-grade corporate borrowers over US Treasuries.',
    benchmarkNote: '<330 bps compressed | >550 bps credit crunch & default wave',
    source: 'ICE BofA US High Yield Index (BAMLH0A0HYM2)',
    defaultColor: '#fb7185',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_CREDIT_SERIES.map((c) => ({
          year: c.year,
          value: c.usHighYieldOasBps,
          note: c.eventAnnotation,
        }))
      ),
  },
  {
    id: 'cm_us_ig_oas',
    name: 'US Investment Grade Corporate Spread (OAS)',
    shortName: 'US IG Spread (bps)',
    pillarId: 'credit-ratios',
    unit: 'bps',
    description: 'Option-adjusted spread on AAA-to-BBB investment-grade US corporate bonds.',
    benchmarkNote: 'Normal band: 90–130 bps | Crisis >250 bps',
    source: 'ICE BofA US Corporate Index',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_CREDIT_SERIES.map((c) => ({
          year: c.year,
          value: c.usInvestmentGradeOasBps,
          note: c.eventAnnotation,
        }))
      ),
  },
  {
    id: 'cm_nfci',
    name: 'Chicago Fed National Financial Conditions Index (NFCI)',
    shortName: 'Chicago Fed NFCI',
    pillarId: 'credit-ratios',
    unit: 'index',
    description: 'Composite index of 105 money market, debt, equity, and banking indicators. Zero is the historical average.',
    benchmarkNote: '<0.00 loose/accommodative | >0.00 tight financial conditions',
    source: 'Federal Reserve Bank of Chicago',
    defaultColor: '#2dd4bf',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_CREDIT_SERIES.map((c) => ({
          year: c.year,
          value: c.chicagoFedNfci,
          note: c.eventAnnotation,
        }))
      ),
  },
  {
    id: 'cm_sloos_tightening',
    name: 'Fed SLOOS Bank Lending Standards (Net Tightening %)',
    shortName: 'SLOOS Tightening (%)',
    pillarId: 'credit-ratios',
    unit: '%',
    description: 'Net percentage of US domestic commercial banks tightening Commercial & Industrial (C&I) loan standards.',
    benchmarkNote: '>20% tightening leads corporate default spikes by 6–9 months',
    source: 'Federal Reserve Senior Loan Officer Opinion Survey',
    defaultColor: '#f59e0b',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_CREDIT_SERIES.map((c) => ({
          year: c.year,
          value: c.sloosNetTighteningPct,
          note: c.eventAnnotation,
        }))
      ),
  },
  {
    id: 'car_copper_gold',
    name: 'Copper-to-Gold Ratio (Cyclical Industrial Pulse)',
    shortName: 'Copper/Gold Ratio',
    pillarId: 'credit-ratios',
    unit: 'x1000',
    description: 'Ratio of industrial Dr. Copper ($/lb) to monetary safe-haven Gold ($/oz), scaled by 1,000.',
    benchmarkNote: 'Leading barometer for global manufacturing & 10Y Treasury yields',
    source: 'COMEX / LBMA / MacroMonitor',
    defaultColor: '#f97316',
    extractRawSeries: () =>
      deduplicateByYear(
        CROSS_ASSET_RATIOS['copper-gold'].history.map((pt) => ({
          year: pt.year,
          value: pt.ratio,
          note: pt.eventNote,
        }))
      ),
  },
  {
    id: 'car_sp500_m2',
    name: 'S&P 500 to US M2 Money Supply Ratio',
    shortName: 'S&P 500 / M2 Ratio',
    pillarId: 'credit-ratios',
    unit: 'pts/$B',
    description: 'Measures US equity prices deflated by the broad M2 money supply to strip out fiat liquidity expansion.',
    benchmarkNote: 'Reveals real equity valuation vs. monetary debasement',
    source: 'S&P Dow Jones / Federal Reserve',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        CROSS_ASSET_RATIOS['sp500-m2'].history.map((pt) => ({
          year: pt.year,
          value: pt.ratio,
          note: pt.eventNote,
        }))
      ),
  },
  {
    id: 'car_gold_oil',
    name: 'Gold-to-WTI Crude Oil Purchasing Power Ratio',
    shortName: 'Gold/Oil (bbl/oz)',
    pillarId: 'credit-ratios',
    unit: 'bbl/oz',
    description: 'Barrels of WTI crude oil purchasable with one troy ounce of gold.',
    benchmarkNote: '35Y median: ~16.8 bbl/oz | >25 signals deflation shock or central bank gold hoarding',
    source: 'LBMA / NYMEX',
    defaultColor: '#eab308',
    extractRawSeries: () =>
      deduplicateByYear(
        CROSS_ASSET_RATIOS['gold-oil'].history.map((pt) => ({
          year: pt.year,
          value: pt.ratio,
          note: pt.eventNote,
        }))
      ),
  },
  {
    id: 'ext_dxy',
    name: 'US Dollar Index (DXY)',
    shortName: 'DXY Dollar Index',
    pillarId: 'credit-ratios',
    unit: 'index',
    description: 'Trade-weighted value of the US Dollar against a basket of 6 major currencies (EUR, JPY, GBP, CAD, SEK, CHF).',
    benchmarkNote: '>105 tightens global emerging-market dollar debt servicing',
    source: 'ICE / Federal Reserve',
    defaultColor: '#34d399',
    extractRawSeries: () =>
      deduplicateByYear(
        DXY_PROFILE_DATA.historicalSeries.map((d) => ({
          year: parseYearFromDateString(d.date),
          value: d.dxyLevel,
          note: d.regime,
        }))
      ),
  },
  {
    id: 'ext_foreign_debt_share',
    name: 'Foreign Ownership Share of US Treasury Debt',
    shortName: 'Foreign US Debt Share (%)',
    pillarId: 'credit-ratios',
    unit: '%',
    description: 'Percentage of marketable US Treasury debt held by foreign central banks and offshore private investors.',
    benchmarkNote: 'Declined from 53.4% (2008) to 23.4% (2026) as domestic buyers absorbed issuance',
    source: 'US Treasury TIC System',
    defaultColor: '#c084fc',
    extractRawSeries: () =>
      deduplicateByYear(
        CAPITAL_FLOWS_TIC_DATA.historicalOwnership.map((h) => ({
          year: h.year,
          value: h.foreignSharePct,
        }))
      ),
  },

  // =========================================================================
  // PILLAR 07: Real Economy: Housing, Energy, Inflation, Labor & Consumer
  // =========================================================================
  {
    id: 'hm_hai',
    name: 'US Housing Affordability Index (NAR HAI)',
    shortName: 'Housing Affordability (HAI)',
    pillarId: 'real-economy',
    unit: 'index',
    description: 'Measures whether a median-income family can qualify for a mortgage on a median-priced home (100 = exact qualification equilibrium).',
    benchmarkNote: '<100 unaffordable lock-out | >130 highly affordable',
    source: 'National Association of Realtors / MacroMonitor',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_HOUSING_SERIES.map((h) => ({
          year: h.year,
          value: h.hai,
          note: h.eventNote,
        }))
      ),
  },
  {
    id: 'hm_mortgage_30y',
    name: 'US 30-Year Fixed Mortgage Rate',
    shortName: '30Y Mortgage Rate (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Average interest rate on a 30-year fixed-rate residential mortgage in the United States.',
    benchmarkNote: '2.65% pandemic low created "Golden Handcuffs" lock-in vs. >6% rates',
    source: 'Freddie Mac Primary Mortgage Market Survey',
    defaultColor: '#fb7185',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_HOUSING_SERIES.map((h) => ({
          year: h.year,
          value: h.mortgageRate30Y,
          note: h.eventNote,
        }))
      ),
  },
  {
    id: 'hm_real_case_shiller',
    name: 'US Real Case-Shiller Home Price Index (Inflation-Adjusted)',
    shortName: 'Real Home Price Index',
    pillarId: 'real-economy',
    unit: 'index',
    description: 'S&P CoreLogic Case-Shiller National Home Price Index deflated by CPI to show real purchasing-power home prices.',
    benchmarkNote: 'Surpassed 2006 subprime bubble peak in real terms',
    source: 'S&P Dow Jones / BLS',
    defaultColor: '#10b981',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_HOUSING_SERIES.map((h) => ({
          year: h.year,
          value: h.realCaseShiller,
          note: h.eventNote,
        }))
      ),
  },
  {
    id: 'hm_median_home_price',
    name: 'US Median Existing Home Sales Price',
    shortName: 'Median Home Price ($)',
    pillarId: 'real-economy',
    unit: '$',
    description: 'Nominal median price of existing single-family homes in the United States.',
    benchmarkNote: 'Compare with Median Household Income to see price-to-income stretch',
    source: 'NAR / US Census Bureau',
    defaultColor: '#f59e0b',
    isMonetaryCurrency: true,
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_HOUSING_SERIES.map((h) => ({
          year: h.year,
          value: h.medianHomePriceUsd,
          note: h.eventNote,
        }))
      ),
  },
  {
    id: 'pe_energy_pct_gdp',
    name: 'Global Primary Energy Burden (% of World GDP)',
    shortName: 'Energy Burden (% GDP)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Share of world GDP spent on primary energy (crude oil, natural gas, coal, power).',
    benchmarkNote: '>8.0% warning zone | >10.0% recessionary energy tax',
    source: 'IEA / Energy Institute / IMF',
    defaultColor: '#f97316',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_PHYSICAL_ECONOMY_SERIES.map((p) => ({
          year: p.year,
          value: p.globalEnergyExpenditurePctGdp,
          note: p.eventNote,
        }))
      ),
  },
  {
    id: 'pe_brent_crude',
    name: 'Brent Crude Oil Benchmark Price',
    shortName: 'Brent Crude ($/bbl)',
    pillarId: 'real-economy',
    unit: '$/bbl',
    description: 'Annual average spot price per barrel of North Sea Brent crude oil.',
    benchmarkNote: ' Global physical inflation & transport cost driver',
    source: 'ICE / EIA',
    defaultColor: '#eab308',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_PHYSICAL_ECONOMY_SERIES.map((p) => ({
          year: p.year,
          value: p.brentCrudeUsd,
          note: p.eventNote,
        }))
      ),
  },
  {
    id: 'pe_world_trade_pct_gdp',
    name: 'Global Merchandise & Services Trade (% of World GDP)',
    shortName: 'World Trade (% GDP)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Sum of global exports and imports as a share of world GDP, tracking hyperglobalization vs. friendshoring.',
    benchmarkNote: 'Peaked at 61.0% in 2008; plateaued in geoeconomic fragmentation era',
    source: 'World Bank / WTO',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_PHYSICAL_ECONOMY_SERIES.map((p) => ({
          year: p.year,
          value: p.worldTradeToGdpPct,
          note: p.eventNote,
        }))
      ),
  },
  {
    id: 'pe_fragmentation_index',
    name: 'Geoeconomic Fragmentation & Tariff Friction Index',
    shortName: 'Fragmentation Index',
    pillarId: 'real-economy',
    unit: 'index',
    description: 'Composite index (0–100) measuring trade restrictions, export controls, sanctions, and supply-chain reshoring.',
    benchmarkNote: 'Low <25 in 2000s WTO era; >65 in 2026 friendshoring regime',
    source: 'IMF Geoeconomic Fragmentation Tracker / WTO',
    defaultColor: '#fb7185',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_PHYSICAL_ECONOMY_SERIES.map((p) => ({
          year: p.year,
          value: p.geoeconomicFragmentationIndex,
          note: p.eventNote,
        }))
      ),
  },
  {
    id: 'inf_headline_cpi',
    name: 'US Headline CPI Inflation',
    shortName: 'US Headline CPI (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'All-items Consumer Price Index year-over-year inflation rate in the United States.',
    benchmarkNote: 'Includes volatile food and energy components',
    source: 'US Bureau of Labor Statistics',
    defaultColor: '#f59e0b',
    extractRawSeries: () =>
      deduplicateByYear(
        US_INFLATION_HISTORY.map((i) => ({
          year: i.year,
          value: i.headlineCpi,
        }))
      ),
  },
  {
    id: 'inf_supercore_cpi',
    name: 'US Supercore Services CPI (Core Services ex-Housing)',
    shortName: 'Supercore CPI (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Core services inflation excluding shelter — the Federal Reserve’s preferred gauge of wage-driven sticky inflation.',
    benchmarkNote: 'Directly tied to domestic wage growth',
    source: 'BLS / Federal Reserve',
    defaultColor: '#fb7185',
    extractRawSeries: () =>
      deduplicateByYear(
        US_INFLATION_HISTORY.map((i) => ({
          year: i.year,
          value: i.supercoreCpi,
        }))
      ),
  },
  {
    id: 'inf_shelter_oer',
    name: 'US Shelter & Owners’ Equivalent Rent (OER) Inflation',
    shortName: 'Shelter OER CPI (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Housing shelter component of CPI (>34% basket weight), which lags spot market rents by 12–18 months.',
    benchmarkNote: 'Slowest-moving sticky component of consumer inflation',
    source: 'US Bureau of Labor Statistics',
    defaultColor: '#c084fc',
    extractRawSeries: () =>
      deduplicateByYear(
        US_INFLATION_HISTORY.map((i) => ({
          year: i.year,
          value: i.shelterOer,
        }))
      ),
  },
  {
    id: 'lab_unemployment_u3',
    name: 'US Civilian Unemployment Rate (U-3)',
    shortName: 'US Unemployment U-3 (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Headline percentage of the US labor force actively seeking work.',
    benchmarkNote: 'Full employment ~4.0% | Recession spikes >6.5%',
    source: 'US Bureau of Labor Statistics',
    defaultColor: '#38bdf8',
    extractRawSeries: () =>
      deduplicateByYear(
        US_LABOR_HISTORY.map((l) => ({
          year: l.year,
          value: l.unemploymentRate,
        }))
      ),
  },
  {
    id: 'lab_sahm',
    name: 'US Claudia Sahm Rule Recession Indicator',
    shortName: 'Sahm Rule (pts)',
    pillarId: 'real-economy',
    unit: 'pts',
    description: '3-month moving average of U-3 unemployment minus its 12-month low.',
    benchmarkNote: '≥0.50 pts triggers recession signal with 100% post-WWII accuracy',
    source: 'Federal Reserve FRED (SAHMREALTIME)',
    defaultColor: '#f43f5e',
    extractRawSeries: () =>
      deduplicateByYear(
        US_LABOR_HISTORY.map((l) => ({
          year: l.year,
          value: l.sahmIndicatorValue,
        }))
      ),
  },
  {
    id: 'lab_wage_growth',
    name: 'US Average Hourly Wage Growth (% YoY)',
    shortName: 'US Wage Growth (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Year-over-year percentage growth in average hourly earnings of private nonfarm employees.',
    benchmarkNote: '3.0–3.5% aligns with 2% inflation target + 1.5% productivity',
    source: 'US Bureau of Labor Statistics',
    defaultColor: '#34d399',
    extractRawSeries: () =>
      deduplicateByYear(
        US_LABOR_HISTORY.map((l) => ({
          year: l.year,
          value: l.wageGrowthYoy,
        }))
      ),
  },
  {
    id: 'cv_dsr_total',
    name: 'US Household Debt Service Ratio (% of Disposable Income)',
    shortName: 'Debt Service Ratio (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Share of disposable personal income required to make minimum scheduled mortgage and consumer debt payments.',
    benchmarkNote: '2007 peak: 13.2% | 2026: ~11.6%',
    source: 'Federal Reserve Board (FOR / DSR)',
    defaultColor: '#f59e0b',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_CONSUMER_SERIES.map((c) => ({
          year: c.year,
          value: c.debtServiceRatioTotal,
          note: c.eventNote,
        }))
      ),
  },
  {
    id: 'cv_savings_rate',
    name: 'US Personal Savings Rate (% of Disposable Income)',
    shortName: 'Personal Savings Rate (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Percentage of disposable personal income saved by households after taxes and consumption.',
    benchmarkNote: 'Historical norm: ~6.5% | <4.5% signals stretched household cash flow',
    source: 'Bureau of Economic Analysis (BEA)',
    defaultColor: '#2dd4bf',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_CONSUMER_SERIES.map((c) => ({
          year: c.year,
          value: c.personalSavingsRate,
          note: c.eventNote,
        }))
      ),
  },
  {
    id: 'cv_cc_delinquency',
    name: 'US Credit Card Delinquency Rate (30+ Days)',
    shortName: 'Credit Card Delinquency (%)',
    pillarId: 'real-economy',
    unit: '%',
    description: 'Percentage of commercial bank credit card balances 30+ days past due.',
    benchmarkNote: 'Early canary in the coal mine for consumer financial distress',
    source: 'Federal Reserve / NY Fed Household Debt Report',
    defaultColor: '#fb7185',
    extractRawSeries: () =>
      deduplicateByYear(
        HISTORICAL_CONSUMER_SERIES.map((c) => ({
          year: c.year,
          value: c.delinquencyCreditCards,
          note: c.eventNote,
        }))
      ),
  },
];

/**
 * Looks up a metric definition by ID, falling back to Total Global Private Wealth if an unknown ID is passed.
 */
export function getMetricDefinition(metricId: string): UniversalMetricDefinition {
  return (
    UNIVERSAL_METRICS_CATALOG.find((m) => m.id === metricId) || UNIVERSAL_METRICS_CATALOG[0]
  );
}

/**
 * Formats a human-readable display title for a series specification, incorporating country/bloc flags and codes
 * when a country-scoped metric is active.
 */
export function getSeriesDisplayName(
  spec: Pick<CustomGraphSeriesSpec, 'metricId' | 'scopeCode'>
): { displayName: string; shortLabel: string; def: UniversalMetricDefinition } {
  const def = getMetricDefinition(spec.metricId);
  if (!def.isCountryScoped) {
    return {
      displayName: def.name,
      shortLabel: def.shortName,
      def,
    };
  }

  const code = (spec.scopeCode || 'USA').toUpperCase();
  const country = COUNTRIES_DATA.find((c) => c.code === code);
  if (country) {
    return {
      displayName: `${country.flag} ${country.name}: ${def.shortName}`,
      shortLabel: `${country.code} ${def.shortName}`,
      def,
    };
  }

  const bloc = ECONOMIC_BLOCS.find((b) => b.id.toUpperCase() === code);
  if (bloc) {
    return {
      displayName: `🌐 ${bloc.name}: ${def.shortName}`,
      shortLabel: `${bloc.id.toUpperCase()} ${def.shortName}`,
      def,
    };
  }

  return {
    displayName: `${code}: ${def.shortName}`,
    shortLabel: `${code} ${def.shortName}`,
    def,
  };
}

/**
 * Resolves the historical time series for a given metric and scope, applying currency perspective
 * adjustments (nominal vs. real 2026 USD vs. PPP) when the metric represents a monetary dollar figure.
 */
export function resolveMetricTimeSeries(
  spec: Pick<CustomGraphSeriesSpec, 'metricId' | 'scopeCode'>,
  currencyPerspective: CurrencyPerspective = 'nominal'
): ResolvedSeriesPoint[] {
  const def = getMetricDefinition(spec.metricId);
  const raw = def.extractRawSeries(spec.scopeCode);

  return raw.map((pt) => {
    const val = def.isMonetaryCurrency
      ? adjustValue(pt.value, pt.year, currencyPerspective, spec.scopeCode)
      : pt.value;
    return {
      year: pt.year,
      value: Number(val.toFixed(4)),
      note: pt.note,
    };
  });
}

/**
 * Linearly interpolates intermediate calendar years strictly within a series' own [minYear, maxYear] bounds.
 * This allows decadal series (e.g. 1980, 1990, 1995...) and annual series (2019, 2020, 2021...) to join
 * without artificial gaps during scatter regressions or custom ratio calculations, while never extrapolating
 * beyond known start or end dates.
 */
function interpolateSeriesToTargetYears(
  points: ResolvedSeriesPoint[],
  targetYears: number[],
  allowInterpolation: boolean
): Map<number, ResolvedSeriesPoint> {
  const exactMap = new Map<number, ResolvedSeriesPoint>();
  for (const p of points) {
    exactMap.set(p.year, p);
  }

  if (!allowInterpolation || points.length < 2) {
    return exactMap;
  }

  const minYear = points[0].year;
  const maxYear = points[points.length - 1].year;
  const result = new Map<number, ResolvedSeriesPoint>(exactMap);

  for (const yr of targetYears) {
    if (result.has(yr) || yr < minYear || yr > maxYear) continue;

    // Find immediate bounding points
    let prev = points[0];
    let next = points[points.length - 1];
    for (let i = 0; i < points.length - 1; i++) {
      if (points[i].year <= yr && points[i + 1].year >= yr) {
        prev = points[i];
        next = points[i + 1];
        break;
      }
    }

    const span = next.year - prev.year;
    if (span > 0) {
      const ratio = (yr - prev.year) / span;
      const interpVal = prev.value + ratio * (next.value - prev.value);
      result.set(yr, {
        year: yr,
        value: Number(interpVal.toFixed(4)),
        isInterpolated: true,
      });
    }
  }

  return result;
}

/**
 * Computes Pearson correlation coefficient (r), R-squared, and linear regression slope/intercept
 * between two aligned numeric vectors so users can test cause-and-effect hypotheses quantitatively.
 */
export function calculateSeriesCorrelation(
  pairs: Array<{ x: number; y: number }>,
  labelA: string,
  labelB: string,
  leadLagYears: number = 0
): CorrelationStats | null {
  if (pairs.length < 3) return null;

  const n = pairs.length;
  const meanX = pairs.reduce((acc, p) => acc + p.x, 0) / n;
  const meanY = pairs.reduce((acc, p) => acc + p.y, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (const p of pairs) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const denom = Math.sqrt(denX * denY);
  const rawR = denom === 0 ? 0 : num / denom;
  const pearsonR = Number(Math.max(-1, Math.min(1, rawR)).toFixed(2));
  const rSquared = Number((pearsonR * pearsonR).toFixed(2));

  const slope = denX === 0 ? 0 : Number((num / denX).toFixed(4));
  const intercept = Number((meanY - slope * meanX).toFixed(4));

  const absR = Math.abs(pearsonR);
  const strengthLabel =
    absR >= 0.75
      ? 'Strong Structural Link'
      : absR >= 0.45
      ? 'Moderate Cyclical Link'
      : absR >= 0.25
      ? 'Weak / Regime-Dependent'
      : 'No Linear Relationship';

  const directionLabel =
    pearsonR >= 0.2
      ? 'Positive Co-Movement'
      : pearsonR <= -0.2
      ? 'Inverse Divergence'
      : 'Uncorrelated Noise';

  const lagNote =
    leadLagYears > 0
      ? ` (when ${labelB} is shifted forward by +${leadLagYears}Y)`
      : leadLagYears < 0
      ? ` (when ${labelB} leads by ${Math.abs(leadLagYears)}Y)`
      : '';

  const interpretation =
    pearsonR >= 0.65
      ? `${labelA} and ${labelB} move strongly in tandem (r = +${pearsonR.toFixed(2)})${lagNote}, explaining ${(rSquared * 100).toFixed(0)}% of shared historical variance.`
      : pearsonR <= -0.65
      ? `${labelA} and ${labelB} exhibit a powerful inverse tug-of-war (r = ${pearsonR.toFixed(2)})${lagNote}: when one rises, the other systematically compresses.`
      : absR >= 0.3
      ? `${labelA} and ${labelB} show a moderate ${pearsonR > 0 ? 'positive' : 'inverse'} relationship (r = ${pearsonR > 0 ? '+' : ''}${pearsonR.toFixed(2)})${lagNote} that strengthens during macro regime shifts.`
      : `${labelA} and ${labelB} have moved largely independently across the full window (r = ${pearsonR.toFixed(2)})${lagNote}. Try adjusting the Lead/Lag slider to test if one leads the other!`;

  return {
    pearsonR,
    rSquared,
    sampleSize: n,
    slope,
    intercept,
    strengthLabel,
    directionLabel,
    interpretation,
  };
}

/**
 * Builds a unified, aligned multi-series dataset ready for Recharts rendering, statistical correlation,
 * custom formula derivation (Ratio / Spread / Sum), and CSV/JSON export.
 */
export function buildAlignedGraphDataset(options: {
  series: CustomGraphSeriesSpec[];
  startYear?: number;
  endYear?: number;
  transformMode?: DataTransformMode;
  formulaMode?: CustomFormulaMode;
  leadLagYears?: number;
  interpolateGaps?: boolean;
  currencyPerspective?: CurrencyPerspective;
}): AlignedGraphDataset {
  const {
    series,
    startYear = 1980,
    endYear = 2026,
    transformMode = 'raw',
    formulaMode = 'none',
    leadLagYears = 0,
    interpolateGaps = true,
    currencyPerspective = 'nominal',
  } = options;

  if (series.length === 0) {
    return {
      rows: [],
      seriesMeta: [],
      correlation: null,
      formulaLabel: null,
      formulaUnit: null,
    };
  }

  // 1. Resolve raw points for each requested series
  const rawSeriesList = series.map((spec, idx) => {
    const { displayName, shortLabel, def } = getSeriesDisplayName(spec);
    let points = resolveMetricTimeSeries(spec, currencyPerspective);

    // Apply lead/lag shift to the second series (index 1) when user tests lead-lag transmission
    if (idx === 1 && leadLagYears !== 0) {
      points = points.map((pt) => ({
        ...pt,
        year: pt.year + leadLagYears,
      }));
    }

    return {
      spec,
      displayName,
      shortLabel:
        idx === 1 && leadLagYears !== 0
          ? `${shortLabel} (${leadLagYears > 0 ? `+${leadLagYears}Y` : `${leadLagYears}Y`})`
          : shortLabel,
      def,
      points,
    };
  });

  // 2. Collect all candidate years within [startYear, endYear]
  const yearSet = new Set<number>();
  for (const s of rawSeriesList) {
    for (const pt of s.points) {
      if (pt.year >= startYear && pt.year <= endYear) {
        yearSet.add(pt.year);
      }
    }
  }
  const sortedYears = Array.from(yearSet).sort((a, b) => a - b);

  // 3. Interpolate internal gaps if enabled
  const alignedMaps = rawSeriesList.map((s) =>
    interpolateSeriesToTargetYears(s.points, sortedYears, interpolateGaps)
  );

  // 4. Compute per-series summary statistics on raw bounded values and prepare transformed values
  const transformedMaps = alignedMaps.map((map) => {
    const validEntries = sortedYears
      .map((yr) => map.get(yr))
      .filter((p): p is ResolvedSeriesPoint => p !== undefined);

    const out = new Map<number, number>();
    if (validEntries.length === 0) return out;

    if (transformMode === 'raw') {
      for (const e of validEntries) {
        out.set(e.year, Number(e.value.toFixed(2)));
      }
    } else if (transformMode === 'indexed100') {
      const baseVal = validEntries.find((e) => e.value !== 0)?.value || 1;
      for (const e of validEntries) {
        out.set(e.year, Number(((e.value / Math.abs(baseVal)) * 100).toFixed(1)));
      }
    } else if (transformMode === 'pctChange') {
      for (let i = 0; i < validEntries.length; i++) {
        if (i === 0) {
          out.set(validEntries[i].year, 0);
        } else {
          const prev = validEntries[i - 1].value;
          const curr = validEntries[i].value;
          const pct = prev !== 0 ? ((curr - prev) / Math.abs(prev)) * 100 : 0;
          out.set(validEntries[i].year, Number(pct.toFixed(2)));
        }
      }
    } else if (transformMode === 'zScore') {
      const mean = validEntries.reduce((acc, e) => acc + e.value, 0) / validEntries.length;
      const variance =
        validEntries.reduce((acc, e) => acc + Math.pow(e.value - mean, 2), 0) /
        Math.max(1, validEntries.length);
      const stdDev = Math.sqrt(variance) || 1;
      for (const e of validEntries) {
        out.set(e.year, Number(((e.value - mean) / stdDev).toFixed(2)));
      }
    }

    return out;
  });

  // 5. Build metadata for each series
  const seriesMeta: ResolvedSeriesMetadata[] = rawSeriesList.map((s, idx) => {
    const boundedRaw = sortedYears
      .map((yr) => alignedMaps[idx].get(yr))
      .filter((p): p is ResolvedSeriesPoint => p !== undefined);

    const values = boundedRaw.map((p) => p.value);
    const earliest = boundedRaw[0] || { year: startYear, value: 0 };
    const latest = boundedRaw[boundedRaw.length - 1] || { year: endYear, value: 0 };
    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    const meanValue =
      values.length > 0
        ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
        : 0;
    const periodChangePct =
      earliest.value !== 0
        ? Number((((latest.value - earliest.value) / Math.abs(earliest.value)) * 100).toFixed(1))
        : 0;

    const effectiveUnit =
      transformMode === 'indexed100'
        ? 'Idx (100)'
        : transformMode === 'pctChange'
        ? '% Δ'
        : transformMode === 'zScore'
        ? 'σ (Z)'
        : s.def.unit;

    return {
      key: s.spec.key,
      metricId: s.spec.metricId,
      scopeCode: s.spec.scopeCode,
      displayName: s.displayName,
      shortLabel: s.shortLabel,
      unit: effectiveUnit,
      pillarId: s.def.pillarId,
      description: s.def.description,
      benchmarkNote: s.def.benchmarkNote,
      source: s.def.source,
      color: s.spec.color,
      yAxisId: s.spec.yAxisId,
      chartStyle: s.spec.chartStyle,
      latestValue: Number(latest.value.toFixed(2)),
      latestYear: latest.year,
      earliestValue: Number(earliest.value.toFixed(2)),
      earliestYear: earliest.year,
      minValue: Number(minValue.toFixed(2)),
      maxValue: Number(maxValue.toFixed(2)),
      meanValue,
      periodChangePct,
    };
  });

  // 6. Construct aligned rows & optional custom formula (Series 0 vs Series 1)
  let formulaLabel: string | null = null;
  let formulaUnit: string | null = null;

  if (formulaMode !== 'none' && seriesMeta.length >= 2) {
    const a = seriesMeta[0].shortLabel;
    const b = seriesMeta[1].shortLabel;
    if (formulaMode === 'ratio') {
      formulaLabel = `Ratio (${a} ÷ ${b})`;
      formulaUnit = 'ratio';
    } else if (formulaMode === 'spread') {
      formulaLabel = `Spread (${a} − ${b})`;
      formulaUnit = seriesMeta[0].unit === seriesMeta[1].unit ? seriesMeta[0].unit : 'pts';
    } else if (formulaMode === 'sum') {
      formulaLabel = `Combined (${a} + ${b})`;
      formulaUnit = seriesMeta[0].unit;
    }
  }

  const rows: AlignedGraphRow[] = sortedYears.map((yr) => {
    const row: AlignedGraphRow = { year: yr };
    let noteForYear: string | undefined;

    series.forEach((spec, idx) => {
      const val = transformedMaps[idx].get(yr);
      row[spec.key] = val !== undefined ? val : null;
      const rawPt = alignedMaps[idx].get(yr);
      if (rawPt?.note && !noteForYear) {
        noteForYear = rawPt.note;
      }
    });

    if (noteForYear) {
      row.note = noteForYear;
    }

    if (formulaMode !== 'none' && series.length >= 2) {
      const valA = row[series[0].key];
      const valB = row[series[1].key];
      if (typeof valA === 'number' && typeof valB === 'number') {
        if (formulaMode === 'ratio') {
          row.formulaValue = valB !== 0 ? Number((valA / valB).toFixed(3)) : null;
        } else if (formulaMode === 'spread') {
          row.formulaValue = Number((valA - valB).toFixed(2));
        } else if (formulaMode === 'sum') {
          row.formulaValue = Number((valA + valB).toFixed(2));
        }
      } else {
        row.formulaValue = null;
      }
    }

    return row;
  });

  // 7. Compute statistical correlation between first two series
  let correlation: CorrelationStats | null = null;
  if (series.length >= 2) {
    const pairs: Array<{ x: number; y: number }> = [];
    for (const r of rows) {
      const vx = r[series[0].key];
      const vy = r[series[1].key];
      if (typeof vx === 'number' && typeof vy === 'number') {
        pairs.push({ x: vx, y: vy });
      }
    }
    correlation = calculateSeriesCorrelation(
      pairs,
      seriesMeta[0].shortLabel,
      seriesMeta[1].shortLabel,
      leadLagYears
    );
  }

  return {
    rows,
    seriesMeta,
    correlation,
    formulaLabel,
    formulaUnit,
  };
}

/**
 * Builds a cross-sectional snapshot across all 26 sovereign countries for any pair of country-scoped metrics
 * in a selected year, enabling instant cross-country bar rankings and X-vs-Y scatter plots.
 */
export function buildCrossCountrySnapshotDataset(options: {
  metricIdX: string;
  metricIdY: string;
  year: number;
  currencyPerspective?: CurrencyPerspective;
}): {
  points: CrossCountrySnapshotPoint[];
  defX: UniversalMetricDefinition;
  defY: UniversalMetricDefinition;
  correlation: CorrelationStats | null;
} {
  const { metricIdX, metricIdY, year, currencyPerspective = 'nominal' } = options;
  const defX = getMetricDefinition(metricIdX.startsWith('country:') ? metricIdX : 'country:gdpPerCapitaUSD');
  const defY = getMetricDefinition(metricIdY.startsWith('country:') ? metricIdY : 'country:medianWealthUSD');

  const points: CrossCountrySnapshotPoint[] = COUNTRIES_DATA.map((c) => {
    const seriesX = resolveMetricTimeSeries({ metricId: defX.id, scopeCode: c.code }, currencyPerspective);
    const seriesY = resolveMetricTimeSeries({ metricId: defY.id, scopeCode: c.code }, currencyPerspective);

    const ptX = seriesX.find((p) => p.year === year) || seriesX[seriesX.length - 1];
    const ptY = seriesY.find((p) => p.year === year) || seriesY[seriesY.length - 1];
    const metricYear = c.history[year] || c.history[2026];

    return {
      code: c.code,
      name: c.name,
      flag: c.flag,
      region: c.region,
      valueX: ptX ? Number(ptX.value.toFixed(2)) : 0,
      valueY: ptY ? Number(ptY.value.toFixed(2)) : 0,
      populationMillion: metricYear?.populationMillion || 10,
    };
  }).sort((a, b) => b.valueX - a.valueX);

  const correlation = calculateSeriesCorrelation(
    points.map((p) => ({ x: p.valueX, y: p.valueY })),
    defX.shortName,
    defY.shortName,
    0
  );

  return {
    points,
    defX,
    defY,
    correlation,
  };
}

/*
 * Curated field-guide graph recipes that answer high-curiosity economic questions
 * with a single click and demonstrate multi-axis, ratio, and sovereign comparisons.
 */
export const CURATED_GRAPH_RECIPES: SavedCustomGraph[] = [
  {
    id: 'recipe-liquidity-vs-housing',
    title: 'Money Supply vs. Home Prices',
    curiosityQuestion: 'Does printing M2 money inflate residential house prices?',
    chartType: 'composed',
    transformMode: 'indexed100',
    formulaMode: 'none',
    leadLagYears: 0,
    startYear: 2000,
    endYear: 2026,
    interpolateGaps: true,
    createdAt: '2026-01-01',
    series: [
      {
        key: 's1',
        metricId: 'mm_m2_supply',
        color: '#38bdf8',
        yAxisId: 'left',
        chartStyle: 'area',
      },
      {
        key: 's2',
        metricId: 'hm_median_home_price',
        color: '#f59e0b',
        yAxisId: 'left',
        chartStyle: 'line',
      },
      {
        key: 's3',
        metricId: 'gw_median_wealth',
        color: '#34d399',
        yAxisId: 'left',
        chartStyle: 'line',
      },
    ],
  },
  {
    id: 'recipe-us-china-deu-gdp',
    title: 'Superpower GDP Trajectory',
    curiosityQuestion: 'How fast did China close the economic output gap with the US and Germany?',
    chartType: 'line',
    transformMode: 'raw',
    formulaMode: 'ratio',
    leadLagYears: 0,
    startYear: 1980,
    endYear: 2026,
    interpolateGaps: true,
    createdAt: '2026-01-01',
    series: [
      {
        key: 's1',
        metricId: 'country:gdpTrillionUSD',
        scopeCode: 'USA',
        color: '#38bdf8',
        yAxisId: 'left',
        chartStyle: 'line',
      },
      {
        key: 's2',
        metricId: 'country:gdpTrillionUSD',
        scopeCode: 'CHN',
        color: '#f43f5e',
        yAxisId: 'left',
        chartStyle: 'line',
      },
      {
        key: 's3',
        metricId: 'country:gdpTrillionUSD',
        scopeCode: 'DEU',
        color: '#f59e0b',
        yAxisId: 'left',
        chartStyle: 'line',
      },
    ],
  },
  {
    id: 'recipe-yield-curve-vs-sahm',
    title: 'Yield Curve Inversion vs. Unemployment',
    curiosityQuestion: 'Why does an inverted 10Y-2Y yield curve precede Sahm Rule job losses?',
    chartType: 'composed',
    transformMode: 'raw',
    formulaMode: 'none',
    leadLagYears: -1,
    startYear: 1980,
    endYear: 2026,
    interpolateGaps: true,
    createdAt: '2026-01-01',
    series: [
      {
        key: 's1',
        metricId: 'yc_10y2y_spread',
        color: '#38bdf8',
        yAxisId: 'left',
        chartStyle: 'bar',
      },
      {
        key: 's2',
        metricId: 'lab_sahm',
        color: '#fb7185',
        yAxisId: 'right',
        chartStyle: 'line',
      },
    ],
  },
  {
    id: 'recipe-energy-tax-inflation',
    title: 'Energy Burden vs. Global Inflation',
    curiosityQuestion: 'What happens to consumer inflation when global energy costs breach 8% of GDP?',
    chartType: 'area',
    transformMode: 'raw',
    formulaMode: 'spread',
    leadLagYears: 0,
    startYear: 1980,
    endYear: 2026,
    interpolateGaps: true,
    createdAt: '2026-01-01',
    series: [
      {
        key: 's1',
        metricId: 'pe_energy_pct_gdp',
        color: '#f97316',
        yAxisId: 'left',
        chartStyle: 'area',
      },
      {
        key: 's2',
        metricId: 'mt_global_inflation',
        color: '#eab308',
        yAxisId: 'right',
        chartStyle: 'line',
      },
    ],
  },
  {
    id: 'recipe-gold-reserves-dedollarization',
    title: 'De-Dollarization & Central Bank Gold',
    curiosityQuestion: 'Are central banks swapping US Dollar reserves for physical Gold?',
    chartType: 'composed',
    transformMode: 'raw',
    formulaMode: 'none',
    leadLagYears: 0,
    startYear: 1990,
    endYear: 2026,
    interpolateGaps: true,
    createdAt: '2026-01-01',
    series: [
      {
        key: 's1',
        metricId: 'mt_res_usd',
        color: '#38bdf8',
        yAxisId: 'left',
        chartStyle: 'line',
      },
      {
        key: 's2',
        metricId: 'mt_res_gold',
        color: '#eab308',
        yAxisId: 'right',
        chartStyle: 'bar',
      },
    ],
  },
  {
    id: 'recipe-mortgage-rates-affordability',
    title: 'The Golden Handcuffs Housing Freeze',
    curiosityQuestion: 'How did 30-year mortgage rate spikes crush US housing affordability?',
    chartType: 'scatter',
    transformMode: 'raw',
    formulaMode: 'none',
    leadLagYears: 0,
    startYear: 1990,
    endYear: 2026,
    interpolateGaps: true,
    createdAt: '2026-01-01',
    series: [
      {
        key: 's1',
        metricId: 'hm_mortgage_30y',
        color: '#fb7185',
        yAxisId: 'left',
        chartStyle: 'line',
      },
      {
        key: 's2',
        metricId: 'hm_hai',
        color: '#34d399',
        yAxisId: 'right',
        chartStyle: 'line',
      },
    ],
  },
];
