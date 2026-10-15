/**
 * Deep-Link State Serialization & Deserialization Engine
 *
 * Provides bidirectional synchronization between macroeconomic interactive simulators
 * (e.g. Fiscal Dominance debt spiral parameters, Wealth Calculator assumptions, PPP arbitrage)
 * and shareable URL hashes or query strings.
 */

import { useEffect } from 'react';
import { SOVEREIGN_FISCAL_PROFILES } from '../data/fiscal-dominance-data';
import { COUNTRIES_DATA } from '../data/country-metrics';
import { ConsumerRegionId, WealthTierId, PhysicalEconomyRegionId } from './types';

export type SimulatorDeepLinkType =
  | 'fiscal'
  | 'wealth'
  | 'ppp'
  | 'ratios'
  | 'volatility'
  | 'housing'
  | 'consumer'
  | 'mechanics'
  | 'physical';

export interface PhysicalEconomyState {
  view: 'overview' | 'energy' | 'deglobalization' | 'demographics';
  region?: PhysicalEconomyRegionId;
  timeWindow?: 'all' | '20y' | '10y';
  simOilPrice?: number;
  simTariffRate?: number;
  simRetirementAge?: number;
}

export interface MonetaryMechanicsState {
  view: 'velocity' | 'issuance' | 'regimes' | 'simulation';
  region: 'USA' | 'EUR' | 'GBR' | 'JPN' | 'CHN' | 'GLOBAL';
  timeWindow?: 'all' | '10y' | '5y' | '3y';
  simBillShare?: number;
  simVelocityDelta?: number;
  simM2Growth?: number;
}

export interface ConsumerVulnerabilityState {
  view: 'overview' | 'dsr' | 'savings' | 'delinquency' | 'tiers' | 'global';
  region?: ConsumerRegionId;
  tier?: WealthTierId;
  timeWindow?: 'all' | '10y' | '5y';
  simIncome?: number;
  simRateBps?: number;
  simInflation?: number;
}

export interface FiscalDominanceState {
  country: string;
  scenario: string;
  bondYield: number;
  primaryDeficit: number;
  realGrowth: number;
  inflation: number;
  metricTab?: 'debt' | 'interest';
}

export interface WealthCalculatorState {
  country: string;
  netWorth: number;
}

export interface PppConverterState {
  fromCountry: string;
  toCountry: string;
  netWorth: number;
}

export interface CrossAssetRatioState {
  ratio: 'copper-gold' | 'sp500-m2' | 'gold-oil';
  numerator: number;
  denominator: number;
  viewMode?: 'ratio' | 'normalized';
  timeWindow?: 'all' | '15y' | '5y';
}

export interface BondVolatilityState {
  view: 'move' | 'vix_move' | 'plumbing' | 'crises';
  region: 'GLOBAL' | 'USA' | 'EUR' | 'GBR' | 'JPN';
  timeWindow?: '1y' | '3y' | '5y' | 'all';
  simMove?: number;
  simVix?: number;
}

export interface HousingMacroState {
  view: 'affordability' | 'rates' | 'real_prices' | 'global';
  region?:
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
  timeWindow?: 'all' | '10y' | '5y';
  simRate?: number;
  simPrice?: number;
  simIncome?: number;
}

/**
 * Extracts URLSearchParams across varied deep-linking patterns.
 * Accommodates query strings (?key=val), hash-based query strings (#id?key=val),
 * hash parameter prefixes (#key=val), and semicolon/colon-separated fragments
 * so external link shorteners, markdown renderers, and email clients don't truncate states.
 */
export function extractParamsFromUrl(input?: string): URLSearchParams {
  if (typeof window === 'undefined' && !input) {
    return new URLSearchParams();
  }

  const rawUrl = input || (typeof window !== 'undefined' ? window.location.href : '');
  if (!rawUrl) return new URLSearchParams();

  /*
   * Combine search query and hash fragments into a unified param lookup
   * because social sharing platforms often sanitize question marks into hash paths
   * or strip fragments entirely.
   */
  const combinedParams = new URLSearchParams();

  try {
    // 1. Process standard query string (?...)
    const questionIndex = rawUrl.indexOf('?');
    const hashIndex = rawUrl.indexOf('#');

    if (questionIndex !== -1) {
      const searchPortion = hashIndex > questionIndex
        ? rawUrl.slice(questionIndex + 1, hashIndex)
        : rawUrl.slice(questionIndex + 1);
      const searchParams = new URLSearchParams(searchPortion);
      searchParams.forEach((val, key) => combinedParams.set(key, val));
    }

    // 2. Process hash fragment (#...)
    if (hashIndex !== -1) {
      const hashContent = rawUrl.slice(hashIndex + 1);
      // Hash could be '#anchor?k1=v1&k2=v2' or '#k1=v1&k2=v2' or '#anchor:k1=v1'
      const hashQuestionIndex = hashContent.indexOf('?');
      const hashColonIndex = hashContent.indexOf(':');

      let hashQueryString = '';
      if (hashQuestionIndex !== -1) {
        hashQueryString = hashContent.slice(hashQuestionIndex + 1);
      } else if (hashColonIndex !== -1) {
        hashQueryString = hashContent.slice(hashColonIndex + 1);
      } else if (hashContent.includes('=')) {
        hashQueryString = hashContent;
      }

      if (hashQueryString) {
        const hashParams = new URLSearchParams(hashQueryString);
        hashParams.forEach((val, key) => {
          // Hash params take precedence when both query and hash are populated
          combinedParams.set(key, val);
        });
      }
    }
  } catch {
    /*
     * Graceful fallback when URL malformations occur in untrusted user inputs
     * preventing crash loops during client hydration.
     */
    return new URLSearchParams();
  }

  return combinedParams;
}

/**
 * Validates a numerical parameter within reasonable economic bounds
 * to prevent runaway compound formulas or NaN rendering in chart SVG elements.
 */
function parseBoundedNumber(
  val: string | null | undefined,
  min: number,
  max: number,
  defaultValue: number
): number {
  if (val === null || val === undefined || val.trim() === '') return defaultValue;
  const num = Number(val);
  if (!Number.isFinite(num)) return defaultValue;
  return Math.min(Math.max(num, min), max);
}

// -----------------------------------------------------------------------------
// Fiscal Dominance Simulator Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializeFiscalDominance(
  state: FiscalDominanceState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  // Using concise keys to avoid exceeding maximum URL length limitations in chat/tweet sharing
  if (format === 'hash') {
    p.set('c', state.country);
    p.set('s', state.scenario);
    p.set('y', state.bondYield.toFixed(2));
    p.set('d', state.primaryDeficit.toFixed(2));
    p.set('g', state.realGrowth.toFixed(2));
    p.set('i', state.inflation.toFixed(2));
    if (state.metricTab) p.set('m', state.metricTab);
    return `#fiscal-simulator?${p.toString()}`;
  } else {
    p.set('fds_c', state.country);
    p.set('fds_s', state.scenario);
    p.set('fds_y', state.bondYield.toFixed(2));
    p.set('fds_d', state.primaryDeficit.toFixed(2));
    p.set('fds_g', state.realGrowth.toFixed(2));
    p.set('fds_i', state.inflation.toFixed(2));
    if (state.metricTab) p.set('fds_m', state.metricTab);
    return p.toString();
  }
}

export function deserializeFiscalDominance(input?: string): FiscalDominanceState | null {
  const params = extractParamsFromUrl(input);

  // Check if any fiscal dominance marker is present in parameters
  const countryParam =
    params.get('fds_c') ||
    params.get('fds_country') ||
    params.get('c') ||
    params.get('country');

  const yieldParam =
    params.get('fds_y') ||
    params.get('fds_yield') ||
    params.get('y') ||
    params.get('yield') ||
    params.get('bondYield');

  const deficitParam =
    params.get('fds_d') ||
    params.get('fds_deficit') ||
    params.get('d') ||
    params.get('deficit') ||
    params.get('primaryDeficit');

  // Return null early when the URL doesn't contain fiscal simulator parameters
  if (!countryParam && !yieldParam && !deficitParam) {
    return null;
  }

  // Find sovereign profile or default to USA to maintain data continuity
  const countryCode = (countryParam || 'USA').toUpperCase();
  const matchedProfile =
    SOVEREIGN_FISCAL_PROFILES.find((p) => p.code === countryCode) ||
    SOVEREIGN_FISCAL_PROFILES[0];

  const scenario =
    params.get('fds_s') ||
    params.get('fds_scenario') ||
    params.get('s') ||
    params.get('scenario') ||
    'custom';

  const bondYield = parseBoundedNumber(
    yieldParam,
    0.0,
    50.0,
    matchedProfile.benchmark10YYield
  );

  const primaryDeficit = parseBoundedNumber(
    deficitParam,
    -20.0,
    40.0,
    matchedProfile.primaryDeficitPercent
  );

  const growthParam =
    params.get('fds_g') ||
    params.get('fds_growth') ||
    params.get('g') ||
    params.get('growth') ||
    params.get('realGrowth');

  const realGrowth = parseBoundedNumber(
    growthParam,
    -20.0,
    30.0,
    matchedProfile.realGdpGrowth
  );

  const inflationParam =
    params.get('fds_i') ||
    params.get('fds_inflation') ||
    params.get('i') ||
    params.get('inflation');

  const inflation = parseBoundedNumber(
    inflationParam,
    -5.0,
    100.0,
    matchedProfile.inflationRate
  );

  const metricTabParam =
    params.get('fds_m') ||
    params.get('fds_tab') ||
    params.get('m') ||
    params.get('metricTab');

  const metricTab =
    metricTabParam === 'interest' ? 'interest' : 'debt';

  return {
    country: matchedProfile.code,
    scenario,
    bondYield: Number(bondYield.toFixed(2)),
    primaryDeficit: Number(primaryDeficit.toFixed(2)),
    realGrowth: Number(realGrowth.toFixed(2)),
    inflation: Number(inflation.toFixed(2)),
    metricTab,
  };
}

// -----------------------------------------------------------------------------
// Wealth Calculator Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializeWealthCalculator(
  state: WealthCalculatorState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  if (format === 'hash') {
    p.set('c', state.country);
    p.set('nw', Math.round(state.netWorth).toString());
    return `#wealth-calculator?${p.toString()}`;
  } else {
    p.set('wc_c', state.country);
    p.set('wc_nw', Math.round(state.netWorth).toString());
    return p.toString();
  }
}

export function deserializeWealthCalculator(input?: string): WealthCalculatorState | null {
  const params = extractParamsFromUrl(input);

  const countryParam =
    params.get('wc_c') ||
    params.get('wc_country') ||
    params.get('c') ||
    params.get('country');

  const netWorthParam =
    params.get('wc_nw') ||
    params.get('wc_networth') ||
    params.get('nw') ||
    params.get('netWorth') ||
    params.get('val');

  if (!countryParam && !netWorthParam) {
    return null;
  }

  const countryCode = (countryParam || 'USA').toUpperCase();
  const matchedCountry =
    COUNTRIES_DATA.find((c) => c.code === countryCode) || COUNTRIES_DATA[0];

  const netWorth = parseBoundedNumber(netWorthParam, 0, 100_000_000_000, 65000);

  return {
    country: matchedCountry.code,
    netWorth: Math.round(netWorth),
  };
}

// -----------------------------------------------------------------------------
// Purchasing Power Parity (PPP) Converter Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializePppConverter(
  state: PppConverterState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  if (format === 'hash') {
    p.set('f', state.fromCountry);
    p.set('t', state.toCountry);
    p.set('a', Math.round(state.netWorth).toString());
    return `#ppp-converter?${p.toString()}`;
  } else {
    p.set('ppp_f', state.fromCountry);
    p.set('ppp_t', state.toCountry);
    p.set('ppp_a', Math.round(state.netWorth).toString());
    return p.toString();
  }
}

export function deserializePppConverter(input?: string): PppConverterState | null {
  const params = extractParamsFromUrl(input);

  const fromParam =
    params.get('ppp_f') ||
    params.get('ppp_from') ||
    params.get('f') ||
    params.get('from');

  const toParam =
    params.get('ppp_t') ||
    params.get('ppp_to') ||
    params.get('t') ||
    params.get('to');

  const amountParam =
    params.get('ppp_a') ||
    params.get('ppp_amount') ||
    params.get('a') ||
    params.get('amount') ||
    params.get('netWorth');

  if (!fromParam && !toParam && !amountParam) {
    return null;
  }

  const fromCode = (fromParam || 'USA').toUpperCase();
  const toCode = (toParam || 'ESP').toUpperCase();

  const validFrom = COUNTRIES_DATA.some((c) => c.code === fromCode) ? fromCode : 'USA';
  const validTo = COUNTRIES_DATA.some((c) => c.code === toCode) ? toCode : 'ESP';
  const amount = parseBoundedNumber(amountParam, 0, 100_000_000_000, 100000);

  return {
    fromCountry: validFrom,
    toCountry: validTo,
    netWorth: Math.round(amount),
  };
}

// -----------------------------------------------------------------------------
// Cross-Asset Ratio Studio Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializeCrossAssetRatio(
  state: CrossAssetRatioState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  if (format === 'hash') {
    p.set('r', state.ratio);
    p.set('n', state.numerator.toFixed(2));
    p.set('d', state.denominator.toFixed(2));
    if (state.viewMode) p.set('v', state.viewMode);
    if (state.timeWindow) p.set('w', state.timeWindow);
    return `#ratio-studio?${p.toString()}`;
  } else {
    p.set('car_r', state.ratio);
    p.set('car_n', state.numerator.toFixed(2));
    p.set('car_d', state.denominator.toFixed(2));
    if (state.viewMode) p.set('car_v', state.viewMode);
    if (state.timeWindow) p.set('car_w', state.timeWindow);
    return p.toString();
  }
}

export function deserializeCrossAssetRatio(input?: string): CrossAssetRatioState | null {
  const params = extractParamsFromUrl(input);

  const ratioParam =
    params.get('car_r') ||
    params.get('car_ratio') ||
    params.get('r') ||
    params.get('ratio');

  const numParam =
    params.get('car_n') ||
    params.get('car_num') ||
    params.get('n') ||
    params.get('num') ||
    params.get('numerator');

  const denParam =
    params.get('car_d') ||
    params.get('car_den') ||
    params.get('d') ||
    params.get('den') ||
    params.get('denominator');

  if (!ratioParam && !numParam && !denParam) {
    return null;
  }

  const validRatios: ('copper-gold' | 'sp500-m2' | 'gold-oil')[] = [
    'copper-gold',
    'sp500-m2',
    'gold-oil',
  ];

  const ratio = validRatios.includes(ratioParam as any)
    ? (ratioParam as 'copper-gold' | 'sp500-m2' | 'gold-oil')
    : 'copper-gold';

  const numerator = parseBoundedNumber(numParam, 0.001, 1_000_000, 4.45);
  const denominator = parseBoundedNumber(denParam, 0.001, 1_000_000, 2650);

  const viewMode = (params.get('car_v') || params.get('v') || 'ratio') as 'ratio' | 'normalized';
  const timeWindow = (params.get('car_w') || params.get('w') || 'all') as 'all' | '15y' | '5y';

  return {
    ratio,
    numerator: Number(numerator.toFixed(2)),
    denominator: Number(denominator.toFixed(2)),
    viewMode: viewMode === 'normalized' ? 'normalized' : 'ratio',
    timeWindow: ['all', '15y', '5y'].includes(timeWindow) ? timeWindow : 'all',
  };
}

// -----------------------------------------------------------------------------
// Bond Volatility & Collateral Plumbing Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializeBondVolatility(
  state: BondVolatilityState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  if (format === 'hash') {
    p.set('v', state.view);
    p.set('reg', state.region);
    if (state.timeWindow) p.set('w', state.timeWindow);
    if (state.simMove !== undefined) p.set('m', state.simMove.toFixed(1));
    if (state.simVix !== undefined) p.set('vx', state.simVix.toFixed(1));
    return `#bond-volatility?${p.toString()}`;
  } else {
    p.set('bvp_view', state.view);
    p.set('bvp_region', state.region);
    if (state.timeWindow) p.set('bvp_w', state.timeWindow);
    if (state.simMove !== undefined) p.set('bvp_move', state.simMove.toFixed(1));
    if (state.simVix !== undefined) p.set('bvp_vix', state.simVix.toFixed(1));
    return p.toString();
  }
}

export function deserializeBondVolatility(input?: string): BondVolatilityState | null {
  const params = extractParamsFromUrl(input);

  const viewParam =
    params.get('bvp_view') ||
    params.get('bvp_v') ||
    params.get('v') ||
    params.get('view');

  const regionParam =
    params.get('bvp_region') ||
    params.get('bvp_reg') ||
    params.get('reg') ||
    params.get('region');

  const moveParam =
    params.get('bvp_move') ||
    params.get('bvp_m') ||
    params.get('m') ||
    params.get('move');

  const vixParam =
    params.get('bvp_vix') ||
    params.get('bvp_vx') ||
    params.get('vx') ||
    params.get('vix');

  if (!viewParam && !regionParam && !moveParam && !vixParam) {
    return null;
  }

  const validViews: ('move' | 'vix_move' | 'plumbing' | 'crises')[] = [
    'move',
    'vix_move',
    'plumbing',
    'crises',
  ];
  const view = validViews.includes(viewParam as any)
    ? (viewParam as 'move' | 'vix_move' | 'plumbing' | 'crises')
    : 'move';

  const validRegions: ('GLOBAL' | 'USA' | 'EUR' | 'GBR' | 'JPN')[] = [
    'GLOBAL',
    'USA',
    'EUR',
    'GBR',
    'JPN',
  ];
  const region = validRegions.includes((regionParam || '').toUpperCase() as any)
    ? ((regionParam || '').toUpperCase() as 'GLOBAL' | 'USA' | 'EUR' | 'GBR' | 'JPN')
    : 'USA';

  const timeWindow = (params.get('bvp_w') || params.get('w') || 'all') as '1y' | '3y' | '5y' | 'all';

  const simMove = moveParam ? parseBoundedNumber(moveParam, 40, 300, 108.5) : undefined;
  const simVix = vixParam ? parseBoundedNumber(vixParam, 8, 120, 15.8) : undefined;

  return {
    view,
    region,
    timeWindow,
    simMove: simMove !== undefined ? Number(simMove.toFixed(1)) : undefined,
    simVix: simVix !== undefined ? Number(simVix.toFixed(1)) : undefined,
  };
}

// -----------------------------------------------------------------------------
// Housing Macro & Affordability Dynamics Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializeHousingMacro(
  state: HousingMacroState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  if (format === 'hash') {
    p.set('v', state.view);
    if (state.region) p.set('reg', state.region);
    if (state.timeWindow) p.set('w', state.timeWindow);
    if (state.simRate !== undefined) p.set('r', state.simRate.toFixed(2));
    if (state.simPrice !== undefined) p.set('p', Math.round(state.simPrice).toString());
    if (state.simIncome !== undefined) p.set('inc', Math.round(state.simIncome).toString());
    return `#housing-radar?${p.toString()}`;
  } else {
    p.set('housing_view', state.view);
    if (state.region) p.set('housing_region', state.region);
    if (state.timeWindow) p.set('housing_w', state.timeWindow);
    if (state.simRate !== undefined) p.set('housing_r', state.simRate.toFixed(2));
    if (state.simPrice !== undefined) p.set('housing_p', Math.round(state.simPrice).toString());
    if (state.simIncome !== undefined) p.set('housing_inc', Math.round(state.simIncome).toString());
    return p.toString();
  }
}

export function deserializeHousingMacro(input?: string): HousingMacroState | null {
  const params = extractParamsFromUrl(input);

  const viewParam =
    params.get('housing_view') ||
    params.get('housing_v') ||
    params.get('v') ||
    params.get('view');

  const regionParam =
    params.get('housing_region') ||
    params.get('housing_reg') ||
    params.get('reg') ||
    params.get('region');

  const rateParam =
    params.get('housing_r') ||
    params.get('housing_rate') ||
    params.get('r') ||
    params.get('rate');

  const priceParam =
    params.get('housing_p') ||
    params.get('housing_price') ||
    params.get('p') ||
    params.get('price');

  const incomeParam =
    params.get('housing_inc') ||
    params.get('housing_income') ||
    params.get('inc') ||
    params.get('income');

  if (!viewParam && !regionParam && !rateParam && !priceParam && !incomeParam) {
    return null;
  }

  const validViews: ('affordability' | 'rates' | 'real_prices' | 'global')[] = [
    'affordability',
    'rates',
    'real_prices',
    'global',
  ];
  const view = validViews.includes(viewParam as any)
    ? (viewParam as 'affordability' | 'rates' | 'real_prices' | 'global')
    : 'affordability';

  const validRegions: NonNullable<HousingMacroState['region']>[] = [
    'USA',
    'EUR',
    'GBR',
    'CAN',
    'AUS',
    'JPN',
    'CHN',
    'DEU',
    'FRA',
    'KOR',
    'SWE',
    'NZL',
    'CHE',
    'SGP',
    'ESP',
    'NLD',
  ];
  const region = validRegions.includes((regionParam || '').toUpperCase() as any)
    ? ((regionParam || '').toUpperCase() as NonNullable<HousingMacroState['region']>)
    : 'USA';

  const timeWindow = (params.get('housing_w') || params.get('w') || 'all') as 'all' | '10y' | '5y';

  const simRate = rateParam ? parseBoundedNumber(rateParam, 1.0, 20.0, 6.45) : undefined;
  const simPrice = priceParam ? parseBoundedNumber(priceParam, 50000, 2500000, 428000) : undefined;
  const simIncome = incomeParam ? parseBoundedNumber(incomeParam, 15000, 500000, 104500) : undefined;

  return {
    view,
    region,
    timeWindow,
    simRate: simRate !== undefined ? Number(simRate.toFixed(2)) : undefined,
    simPrice: simPrice !== undefined ? Math.round(simPrice) : undefined,
    simIncome: simIncome !== undefined ? Math.round(simIncome) : undefined,
  };
}

// -----------------------------------------------------------------------------
// Household Balance Sheets & Consumer Vulnerability Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializeConsumerVulnerability(
  state: ConsumerVulnerabilityState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  if (format === 'hash') {
    p.set('v', state.view);
    if (state.region) p.set('reg', state.region);
    if (state.tier) p.set('tier', state.tier);
    if (state.timeWindow) p.set('w', state.timeWindow);
    if (state.simIncome !== undefined) p.set('inc', state.simIncome.toFixed(1));
    if (state.simRateBps !== undefined) p.set('rate', Math.round(state.simRateBps).toString());
    if (state.simInflation !== undefined) p.set('inf', state.simInflation.toFixed(1));
    return `#consumer-radar?${p.toString()}`;
  } else {
    p.set('cvr_view', state.view);
    if (state.region) p.set('cvr_region', state.region);
    if (state.tier) p.set('cvr_tier', state.tier);
    if (state.timeWindow) p.set('cvr_w', state.timeWindow);
    if (state.simIncome !== undefined) p.set('cvr_inc', state.simIncome.toFixed(1));
    if (state.simRateBps !== undefined) p.set('cvr_rate', Math.round(state.simRateBps).toString());
    if (state.simInflation !== undefined) p.set('cvr_inf', state.simInflation.toFixed(1));
    return p.toString();
  }
}

export function deserializeConsumerVulnerability(input?: string): ConsumerVulnerabilityState | null {
  const params = extractParamsFromUrl(input);

  const viewParam =
    params.get('cvr_view') ||
    params.get('cvr_v') ||
    params.get('v') ||
    params.get('view');

  const regionParam =
    params.get('cvr_region') ||
    params.get('cvr_reg') ||
    params.get('reg') ||
    params.get('region');

  const tierParam =
    params.get('cvr_tier') ||
    params.get('cvr_t') ||
    params.get('tier') ||
    params.get('t');

  const incomeParam =
    params.get('cvr_inc') ||
    params.get('cvr_income') ||
    params.get('inc') ||
    params.get('income');

  const rateParam =
    params.get('cvr_rate') ||
    params.get('cvr_r') ||
    params.get('rate') ||
    params.get('rateBps');

  const inflationParam =
    params.get('cvr_inf') ||
    params.get('cvr_inflation') ||
    params.get('inf') ||
    params.get('inflation');

  if (!viewParam && !regionParam && !tierParam && !incomeParam && !rateParam && !inflationParam) {
    return null;
  }

  const validViews: ('overview' | 'dsr' | 'savings' | 'delinquency' | 'tiers' | 'global')[] = [
    'overview',
    'dsr',
    'savings',
    'delinquency',
    'tiers',
    'global',
  ];
  const view = validViews.includes(viewParam as any)
    ? (viewParam as ConsumerVulnerabilityState['view'])
    : 'overview';

  const validRegions: ConsumerRegionId[] = [
    'USA',
    'EUR',
    'GBR',
    'CAN',
    'AUS',
    'JPN',
    'DEU',
    'FRA',
    'KOR',
    'SWE',
    'CHE',
    'CHN',
  ];
  const region = validRegions.includes((regionParam || '').toUpperCase() as any)
    ? ((regionParam || '').toUpperCase() as ConsumerRegionId)
    : 'USA';

  const validTiers: WealthTierId[] = ['all', 'bottom50', 'middle40', 'top10', 'top1'];
  const tier = validTiers.includes(tierParam as any)
    ? (tierParam as WealthTierId)
    : 'bottom50';

  const timeWindow = (params.get('cvr_w') || params.get('w') || 'all') as 'all' | '10y' | '5y';

  const simIncome = incomeParam ? parseBoundedNumber(incomeParam, -20.0, 20.0, 0.0) : undefined;
  const simRateBps = rateParam ? parseBoundedNumber(rateParam, -500, 500, 0) : undefined;
  const simInflation = inflationParam ? parseBoundedNumber(inflationParam, -5.0, 15.0, 0.0) : undefined;

  return {
    view,
    region,
    tier,
    timeWindow,
    simIncome: simIncome !== undefined ? Number(simIncome.toFixed(1)) : undefined,
    simRateBps: simRateBps !== undefined ? Math.round(simRateBps) : undefined,
    simInflation: simInflation !== undefined ? Number(simInflation.toFixed(1)) : undefined,
  };
}

// -----------------------------------------------------------------------------
// Monetary Velocity & Debt Issuance Mechanics Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializeMonetaryMechanics(
  state: MonetaryMechanicsState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  if (format === 'hash') {
    p.set('v', state.view);
    if (state.region) p.set('reg', state.region);
    if (state.timeWindow) p.set('w', state.timeWindow);
    if (state.simBillShare !== undefined) p.set('bill', state.simBillShare.toFixed(1));
    if (state.simVelocityDelta !== undefined) p.set('vdel', state.simVelocityDelta.toFixed(1));
    if (state.simM2Growth !== undefined) p.set('m2', state.simM2Growth.toFixed(1));
    return `#monetary-mechanics?${p.toString()}`;
  } else {
    p.set('mm_view', state.view);
    if (state.region) p.set('mm_reg', state.region);
    if (state.timeWindow) p.set('mm_w', state.timeWindow);
    if (state.simBillShare !== undefined) p.set('mm_bill', state.simBillShare.toFixed(1));
    if (state.simVelocityDelta !== undefined) p.set('mm_vdel', state.simVelocityDelta.toFixed(1));
    if (state.simM2Growth !== undefined) p.set('mm_m2', state.simM2Growth.toFixed(1));
    return p.toString();
  }
}

export function deserializeMonetaryMechanics(input?: string): MonetaryMechanicsState | null {
  const params = extractParamsFromUrl(input);

  const viewParam =
    params.get('mm_view') ||
    params.get('mm_v') ||
    params.get('v') ||
    params.get('view');

  const regionParam =
    params.get('mm_reg') ||
    params.get('mm_region') ||
    params.get('reg') ||
    params.get('region');

  const billParam =
    params.get('mm_bill') ||
    params.get('bill') ||
    params.get('tbill');

  const vdelParam =
    params.get('mm_vdel') ||
    params.get('vdel') ||
    params.get('v_delta');

  const m2Param =
    params.get('mm_m2') ||
    params.get('m2') ||
    params.get('m2_growth');

  if (!viewParam && !regionParam && !billParam && !vdelParam && !m2Param) {
    return null;
  }

  const validViews: ('velocity' | 'issuance' | 'regimes' | 'simulation')[] = [
    'velocity',
    'issuance',
    'regimes',
    'simulation',
  ];
  const view = validViews.includes(viewParam as any)
    ? (viewParam as MonetaryMechanicsState['view'])
    : 'velocity';

  const validRegions: MonetaryMechanicsState['region'][] = [
    'USA',
    'EUR',
    'GBR',
    'JPN',
    'CHN',
    'GLOBAL',
  ];
  const region = validRegions.includes((regionParam || '').toUpperCase() as any)
    ? ((regionParam || '').toUpperCase() as MonetaryMechanicsState['region'])
    : 'USA';

  const timeWindow = (params.get('mm_w') || params.get('w') || 'all') as 'all' | '10y' | '5y' | '3y';

  const simBillShare = billParam ? parseBoundedNumber(billParam, 5.0, 60.0, 21.6) : undefined;
  const simVelocityDelta = vdelParam ? parseBoundedNumber(vdelParam, -20.0, 25.0, 0.0) : undefined;
  const simM2Growth = m2Param ? parseBoundedNumber(m2Param, -15.0, 30.0, 0.6) : undefined;

  return {
    view,
    region,
    timeWindow,
    simBillShare: simBillShare !== undefined ? Number(simBillShare.toFixed(1)) : undefined,
    simVelocityDelta: simVelocityDelta !== undefined ? Number(simVelocityDelta.toFixed(1)) : undefined,
    simM2Growth: simM2Growth !== undefined ? Number(simM2Growth.toFixed(1)) : undefined,
  };
}

// -----------------------------------------------------------------------------
// Physical Economy, Energy & Deglobalization Serialization & Deserialization
// -----------------------------------------------------------------------------

export function serializePhysicalEconomy(
  state: PhysicalEconomyState,
  format: 'hash' | 'query' = 'hash'
): string {
  const p = new URLSearchParams();
  if (format === 'hash') {
    p.set('v', state.view);
    if (state.region) p.set('reg', state.region);
    if (state.timeWindow) p.set('w', state.timeWindow);
    if (state.simOilPrice !== undefined) p.set('oil', state.simOilPrice.toFixed(1));
    if (state.simTariffRate !== undefined) p.set('tf', state.simTariffRate.toFixed(1));
    if (state.simRetirementAge !== undefined) p.set('ret', Math.round(state.simRetirementAge).toString());
    return `#physical-radar?${p.toString()}`;
  } else {
    p.set('pe_view', state.view);
    if (state.region) p.set('pe_region', state.region);
    if (state.timeWindow) p.set('pe_w', state.timeWindow);
    if (state.simOilPrice !== undefined) p.set('pe_oil', state.simOilPrice.toFixed(1));
    if (state.simTariffRate !== undefined) p.set('pe_tf', state.simTariffRate.toFixed(1));
    if (state.simRetirementAge !== undefined) p.set('pe_ret', Math.round(state.simRetirementAge).toString());
    return p.toString();
  }
}

export function deserializePhysicalEconomy(input?: string): PhysicalEconomyState | null {
  const params = extractParamsFromUrl(input);

  const viewParam =
    params.get('pe_view') ||
    params.get('pe_v') ||
    params.get('v') ||
    params.get('view');

  const regionParam =
    params.get('pe_region') ||
    params.get('pe_reg') ||
    params.get('reg') ||
    params.get('region');

  const oilParam =
    params.get('pe_oil') ||
    params.get('oil') ||
    params.get('brent');

  const tariffParam =
    params.get('pe_tf') ||
    params.get('pe_tariff') ||
    params.get('tf') ||
    params.get('tariff');

  const retirementParam =
    params.get('pe_ret') ||
    params.get('pe_retirement') ||
    params.get('ret') ||
    params.get('retirement');

  if (!viewParam && !regionParam && !oilParam && !tariffParam && !retirementParam) {
    return null;
  }

  const validViews: ('overview' | 'energy' | 'deglobalization' | 'demographics')[] = [
    'overview',
    'energy',
    'deglobalization',
    'demographics',
  ];
  const view = validViews.includes(viewParam as any)
    ? (viewParam as 'overview' | 'energy' | 'deglobalization' | 'demographics')
    : 'overview';

  const validRegions: NonNullable<PhysicalEconomyState['region']>[] = [
    'GLOBAL',
    'USA',
    'EUR',
    'CHN',
    'JPN',
    'DEU',
    'GBR',
    'IND',
    'KOR',
  ];
  const region = validRegions.includes((regionParam || '').toUpperCase() as any)
    ? ((regionParam || '').toUpperCase() as NonNullable<PhysicalEconomyState['region']>)
    : 'GLOBAL';

  const timeWindow = (params.get('pe_w') || params.get('w') || 'all') as 'all' | '20y' | '10y';

  const simOilPrice = oilParam ? parseBoundedNumber(oilParam, 20.0, 250.0, 74.8) : undefined;
  const simTariffRate = tariffParam ? parseBoundedNumber(tariffParam, 0.0, 35.0, 4.9) : undefined;
  const simRetirementAge = retirementParam ? parseBoundedNumber(retirementParam, 60, 75, 65) : undefined;

  return {
    view,
    region,
    timeWindow,
    simOilPrice: simOilPrice !== undefined ? Number(simOilPrice.toFixed(1)) : undefined,
    simTariffRate: simTariffRate !== undefined ? Number(simTariffRate.toFixed(1)) : undefined,
    simRetirementAge: simRetirementAge !== undefined ? Math.round(simRetirementAge) : undefined,
  };
}

// -----------------------------------------------------------------------------
// Universal URL Construction & Clipboard Helpers
// -----------------------------------------------------------------------------

export interface BuildUrlOptions {
  simulator: SimulatorDeepLinkType;
  state: any;
  format?: 'hash' | 'query';
  customOrigin?: string;
  customPathname?: string;
}

/**
 * Builds a canonical, shareable deep-link URL for the active simulator state.
 * Preserves page section tabs (e.g. tab=liquidity or calc=percentile)
 * so recipient browsers immediately render the appropriate tab.
 */
export function buildSimulatorUrl({
  simulator,
  state,
  format = 'hash',
  customOrigin,
  customPathname,
}: BuildUrlOptions): string {
  let origin = customOrigin;
  let pathname = customPathname;

  if (typeof window !== 'undefined') {
    if (!origin) origin = window.location.origin;
    if (!pathname) pathname = window.location.pathname;
  } else {
    if (!origin) origin = 'https://macro-monitor.app';
    if (!pathname) {
      pathname =
        simulator === 'fiscal' ||
        simulator === 'ratios' ||
        simulator === 'volatility' ||
        simulator === 'housing' ||
        simulator === 'mechanics' ||
        simulator === 'physical'
          ? '/macro'
          : '/wealth';
    }
  }

  const url = new URL(pathname, origin);

  // Set page tab context so recipient enters with the simulator visible
  if (simulator === 'fiscal') {
    url.searchParams.set('tab', 'liquidity');
    if (format === 'hash') {
      url.hash = serializeFiscalDominance(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializeFiscalDominance(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'fiscal-simulator';
    }
  } else if (simulator === 'wealth') {
    url.searchParams.set('calc', 'percentile');
    if (format === 'hash') {
      url.hash = serializeWealthCalculator(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializeWealthCalculator(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'wealth-calculator';
    }
  } else if (simulator === 'ppp') {
    url.searchParams.set('calc', 'ppp');
    if (format === 'hash') {
      url.hash = serializePppConverter(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializePppConverter(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'ppp-converter';
    }
  } else if (simulator === 'ratios') {
    url.searchParams.set('tab', 'ratios');
    if (format === 'hash') {
      url.hash = serializeCrossAssetRatio(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializeCrossAssetRatio(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'ratio-studio';
    }
  } else if (simulator === 'volatility') {
    url.searchParams.set('tab', 'volatility');
    if (format === 'hash') {
      url.hash = serializeBondVolatility(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializeBondVolatility(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'bond-volatility';
    }
  } else if (simulator === 'housing') {
    url.searchParams.set('tab', 'housing');
    if (format === 'hash') {
      url.hash = serializeHousingMacro(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializeHousingMacro(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'housing-radar';
    }
  } else if (simulator === 'consumer') {
    url.searchParams.set('calc', 'consumer');
    if (format === 'hash') {
      url.hash = serializeConsumerVulnerability(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializeConsumerVulnerability(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'consumer-radar';
    }
  } else if (simulator === 'mechanics') {
    url.searchParams.set('tab', 'mechanics');
    if (format === 'hash') {
      url.hash = serializeMonetaryMechanics(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializeMonetaryMechanics(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'monetary-mechanics';
    }
  } else if (simulator === 'physical') {
    url.searchParams.set('tab', 'physical');
    if (format === 'hash') {
      url.hash = serializePhysicalEconomy(state, 'hash').replace(/^#/, '');
    } else {
      const q = new URLSearchParams(serializePhysicalEconomy(state, 'query'));
      q.forEach((v, k) => url.searchParams.set(k, v));
      url.hash = 'physical-radar';
    }
  }

  return url.toString();
}

/**
 * Copies a serialized deep-link URL to the system clipboard,
 * falling back to document.execCommand when running in restricted iframe contexts.
 */
export async function copySimulatorLinkToClipboard(url: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      /*
       * Fallback to textarea execCommand if Clipboard API permission is denied
       * in sandboxed iframes or non-secure contexts.
       */
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Updates the browser's address bar without reloading or triggering browser history bloat.
 * Uses history.replaceState so copying from the address bar or bookmarking reflects live parameters.
 */
export function updateBrowserUrl(
  simulator: SimulatorDeepLinkType,
  state: any,
  options?: { format?: 'hash' | 'query' }
): void {
  if (typeof window === 'undefined') return;

  try {
    const newUrl = buildSimulatorUrl({
      simulator,
      state,
      format: options?.format ?? 'hash',
    });

    /*
     * Only invoke replaceState if the target URL differs from the current location
     * to avoid redundant DOM history operations during rapid user interactions.
     */
    if (window.location.href !== newUrl) {
      window.history.replaceState(window.history.state, '', newUrl);
    }
  } catch {
    /*
     * Gracefully handle security restrictions in cross-origin sandboxes
     * or third-party embedded webviews.
     */
  }
}

/**
 * React hook that continuously synchronizes simulator state into the browser's URL address bar.
 * Debounces rapid slider adjustments to preserve 60fps rendering performance.
 */
export function useDeepLinkSync<T>(
  simulator: SimulatorDeepLinkType,
  state: T,
  isReady: boolean = true,
  options?: { format?: 'hash' | 'query'; debounceMs?: number }
): void {
  const debounceMs = options?.debounceMs ?? 150;
  const format = options?.format ?? 'hash';

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;

    /*
     * Debounce state synchronization so rapid slider drags (e.g. bond yields or deficits)
     * do not flood the browser history API or cause frame drops during animation.
     */
    const timer = setTimeout(() => {
      updateBrowserUrl(simulator, state, { format });
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [simulator, state, isReady, format, debounceMs]);
}
