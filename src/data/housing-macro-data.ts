import {
  HousingRegionId,
  HousingAffordabilityRegime,
  RealHomePriceSeriesPoint,
  RegionalHousingProfile,
  HousingMacroOverview,
  EvaluatedHousingState,
} from '../lib/types';
import { GLOBAL_ASSET_HISTORY } from './asset-breakdown';

/*
 * Calculates standard monthly mortgage payment (Principal & Interest) using
 * standard amortization mathematics. Used by institutional underwriting to gauge
 * the exact dollar cash outflow required to service a residential mortgage.
 */
export function calculateMonthlyMortgagePayment(
  loanAmount: number,
  annualRatePercent: number,
  termYears: number = 30
): number {
  if (loanAmount <= 0) return 0;
  if (annualRatePercent <= 0) return loanAmount / (termYears * 12);

  const monthlyRate = annualRatePercent / 100 / 12;
  const numPayments = termYears * 12;

  // Standard annuity discounting formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  const factor = Math.pow(1 + monthlyRate, numPayments);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

/*
 * Evaluates the National Association of Realtors (NAR) Housing Affordability Index (HAI).
 * An index value of 100 represents exact equilibrium where a median-income household
 * earns precisely 100% of the qualifying income required to service a median-priced home
 * at prevailing benchmark mortgage rates (assuming a 20% down payment and 25% debt-to-income threshold).
 */
export function calculateHousingAffordabilityIndex(
  medianIncome: number,
  homePrice: number,
  mortgageRate: number,
  downPaymentPct: number = 0.20,
  qualifyingRatio: number = 0.25
): {
  hai: number;
  monthlyPayment: number;
  qualifyingIncome: number;
  regime: HousingAffordabilityRegime;
} {
  const loanAmount = Math.max(0, homePrice * (1 - downPaymentPct));
  const monthlyPayment = calculateMonthlyMortgagePayment(loanAmount, mortgageRate, 30);

  // Qualifying income is calculated based on the regulatory rule that P&I must not exceed the target ratio of gross earnings
  const monthlyQualifying = monthlyPayment / qualifyingRatio;
  const annualQualifying = monthlyQualifying * 12;

  const hai = annualQualifying > 0 ? (medianIncome / annualQualifying) * 100 : 0;

  return {
    hai: Math.round(hai * 10) / 10,
    monthlyPayment: Math.round(monthlyPayment),
    qualifyingIncome: Math.round(annualQualifying),
    regime: getAffordabilityRegime(hai),
  };
}

/*
 * Assigns qualitative risk tier based on historical consumer debt absorption capacity.
 * Levels below 85 reflect severe credit stress historically accompanied by housing transaction freezes.
 */
export function getAffordabilityRegime(hai: number): HousingAffordabilityRegime {
  if (hai < 85) return 'severely_unaffordable';
  if (hai < 100) return 'unaffordable';
  if (hai < 130) return 'fairly_affordable';
  return 'highly_affordable';
}

/*
 * Human-readable analytical descriptions and color codings for each affordability regime
 * to guide non-specialist users through macro housing constraints.
 */
export const AFFORDABILITY_REGIME_CONFIG: Record<
  HousingAffordabilityRegime,
  {
    label: string;
    description: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  severely_unaffordable: {
    label: 'Severely Unaffordable',
    description: 'Median household income falls >15% short of qualification requirements. First-time buyers are largely locked out, compressing transaction volumes.',
    color: '#ef4444',
    bgClass: 'bg-rose-500/10 dark:bg-rose-500/20',
    textClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-500/30',
  },
  unaffordable: {
    label: 'Unaffordable Deficit',
    description: 'Median family earns below the standard 25% debt-service threshold. Housing demand relies on equity-rich repeat buyers and cash transactions.',
    color: '#f97316',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  fairly_affordable: {
    label: 'Fairly Affordable',
    description: 'Median income comfortably services median mortgage debt. Balanced market conditions allowing steady household formation without excessive leverage.',
    color: '#0ea5e9',
    bgClass: 'bg-sky-500/10 dark:bg-sky-500/20',
    textClass: 'text-sky-600 dark:text-sky-400',
    borderClass: 'border-sky-500/30',
  },
  highly_affordable: {
    label: 'Highly Affordable',
    description: 'Incomes significantly exceed borrowing requirements (typical of post-bust cyclical bottoms or low-rate eras), creating strong tailwinds for real estate compounding.',
    color: '#10b981',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
};

/*
 * Regional institutional housing profiles comparing monetary transmission mechanics,
 * mortgage debt structures, and consumer balance sheet leverage across the G7 economies.
 */
export const REGIONAL_HOUSING_PROFILES: Record<HousingRegionId, RegionalHousingProfile> = {
  USA: {
    regionId: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    currencySymbol: '$',
    benchmarkMortgageRate: 6.65,
    benchmarkRateLabel: '30-Year Fixed Benchmark',
    mortgageStructure: 'fixed_long',
    rateTransmissionSpeed: 'delayed_slow',
    medianHomePriceLocal: 418000,
    medianHouseholdIncomeLocal: 80610,
    priceToIncomeRatio: 5.18,
    hai: 92.4,
    householdDebtToGdpPct: 74.2,
    realPriceChange5YPct: 18.4,
    homeownershipRatePct: 65.6,
    macroTransmissionNote:
      'Because >85% of existing US mortgages are fixed for 30 years at sub-4% rates, Fed rate hikes do not impair current owners directly; instead, transmission occurs via the "Lock-in Effect" (golden handcuffs) which chokes secondary supply and crushes existing home sales.',
  },
  GBR: {
    regionId: 'GBR',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencySymbol: '£',
    benchmarkMortgageRate: 4.85,
    benchmarkRateLabel: '5-Year Fixed Reset',
    mortgageStructure: 'fixed_medium_reset',
    rateTransmissionSpeed: 'rapid',
    medianHomePriceLocal: 285000,
    medianHouseholdIncomeLocal: 36500,
    priceToIncomeRatio: 7.81,
    hai: 79.5,
    householdDebtToGdpPct: 81.5,
    realPriceChange5YPct: 4.2,
    homeownershipRatePct: 64.8,
    macroTransmissionNote:
      'UK mortgages reset every 2 to 5 years, forcing ~1.5 million households annually through the "mortgage cliff", directly transmitting Bank of England policy tightening into disposable discretionary income within 24 months.',
  },
  CAN: {
    regionId: 'CAN',
    name: 'Canada',
    flag: '🇨🇦',
    currencySymbol: 'C$',
    benchmarkMortgageRate: 5.15,
    benchmarkRateLabel: '5-Year Fixed / Variable Reset',
    mortgageStructure: 'fixed_medium_reset',
    rateTransmissionSpeed: 'rapid',
    medianHomePriceLocal: 669000,
    medianHouseholdIncomeLocal: 78000,
    priceToIncomeRatio: 8.58,
    hai: 71.2,
    householdDebtToGdpPct: 102.1,
    realPriceChange5YPct: 11.8,
    homeownershipRatePct: 66.5,
    macroTransmissionNote:
      'Extreme household debt-to-GDP (>100%) and five-year fixed renewal schedules make Canadian consumers exceptionally rate-sensitive, requiring the Bank of Canada to ease monetary policy ahead of the Fed to prevent severe mortgage delinquency cascades.',
  },
  AUS: {
    regionId: 'AUS',
    name: 'Australia',
    flag: '🇦🇺',
    currencySymbol: 'A$',
    benchmarkMortgageRate: 6.25,
    benchmarkRateLabel: 'Standard Variable Rate (SVR)',
    mortgageStructure: 'variable',
    rateTransmissionSpeed: 'rapid',
    medianHomePriceLocal: 790000,
    medianHouseholdIncomeLocal: 98000,
    priceToIncomeRatio: 8.06,
    hai: 74.8,
    householdDebtToGdpPct: 111.4,
    realPriceChange5YPct: 22.1,
    homeownershipRatePct: 66.0,
    macroTransmissionNote:
      'Over 70% of Australian mortgages are variable-rate, providing instantaneous monetary policy transmission: RBA cash rate shifts directly alter monthly mortgage debits from consumer bank accounts within 30 days.',
  },
  EUR: {
    regionId: 'EUR',
    name: 'Eurozone (Core)',
    flag: '🇪🇺',
    currencySymbol: '€',
    benchmarkMortgageRate: 3.60,
    benchmarkRateLabel: '15-Year Fixed Benchmark',
    mortgageStructure: 'fixed_long',
    rateTransmissionSpeed: 'moderate',
    medianHomePriceLocal: 310000,
    medianHouseholdIncomeLocal: 44500,
    priceToIncomeRatio: 6.97,
    hai: 96.1,
    householdDebtToGdpPct: 53.4,
    realPriceChange5YPct: 5.8,
    homeownershipRatePct: 69.1,
    macroTransmissionNote:
      'Eurozone real estate is bifurcated: France and Germany utilize long-term fixed borrowing with disciplined loan-to-value limits, while Southern Europe has higher homeownership but lower total mortgage debt leverage.',
  },
  JPN: {
    regionId: 'JPN',
    name: 'Japan',
    flag: '🇯🇵',
    currencySymbol: '¥',
    benchmarkMortgageRate: 1.35,
    benchmarkRateLabel: 'Variable / Flat 35 Blend',
    mortgageStructure: 'variable',
    rateTransmissionSpeed: 'moderate',
    medianHomePriceLocal: 42000000,
    medianHouseholdIncomeLocal: 5600000,
    priceToIncomeRatio: 7.50,
    hai: 104.2,
    householdDebtToGdpPct: 68.2,
    realPriceChange5YPct: 16.5,
    homeownershipRatePct: 61.2,
    macroTransmissionNote:
      'Over 75% of new Japanese mortgages are pegged to short-term TIBOR variable rates. As the Bank of Japan exits negative interest rate policy (NIRP), domestic households face rising mortgage payments for the first time in three decades.',
  },
};

/*
 * Multi-decade historical series tracking Case-Shiller Home Price Index,
 * Consumer Price Index (CPI), Real (inflation-deflated) Home Prices,
 * 30-Year Mortgage Rates, 10Y Treasury Spreads, and Housing Affordability (HAI).
 * Base Year: 2000 = 100 for nominal indices to facilitate transparent cross-cycle comparison.
 */
export const HISTORICAL_HOUSING_SERIES: RealHomePriceSeriesPoint[] = [
  {
    date: '1980',
    year: 1980,
    nominalCaseShiller: 41.2,
    nominalFhfa: 38.6,
    cpiIndex: 48.9,
    realCaseShiller: 84.3,
    realFhfa: 78.9,
    medianHomePriceUsd: 64600,
    medianFamilyIncomeUsd: 21020,
    mortgageRate30Y: 13.74,
    treasury10Y: 11.46,
    mortgageSpreadBps: 228,
    effectiveMortgageRate: 9.80,
    hai: 69.5,
    monthlyMortgagePayment: 601,
    qualifyingIncome: 28848,
    housingPaymentShareOfIncome: 34.3,
    eventNote: 'Volcker inflation squeeze; 30Y mortgage crosses 13%, causing severe housing contraction',
  },
  {
    date: '1981',
    year: 1981,
    nominalCaseShiller: 43.8,
    nominalFhfa: 41.1,
    cpiIndex: 54.0,
    realCaseShiller: 81.1,
    realFhfa: 76.1,
    medianHomePriceUsd: 68900,
    medianFamilyIncomeUsd: 22390,
    mortgageRate30Y: 16.63,
    treasury10Y: 13.91,
    mortgageSpreadBps: 272,
    effectiveMortgageRate: 11.50,
    hai: 61.8,
    monthlyMortgagePayment: 769,
    qualifyingIncome: 36912,
    housingPaymentShareOfIncome: 41.2,
    eventNote: 'All-time peak in US mortgage borrowing costs (30Y touches 18.6% peak in October)',
  },
  {
    date: '1985',
    year: 1985,
    nominalCaseShiller: 52.8,
    nominalFhfa: 50.2,
    cpiIndex: 62.9,
    realCaseShiller: 83.9,
    realFhfa: 79.8,
    medianHomePriceUsd: 84300,
    medianFamilyIncomeUsd: 27740,
    mortgageRate30Y: 12.43,
    treasury10Y: 10.62,
    mortgageSpreadBps: 181,
    effectiveMortgageRate: 11.10,
    hai: 80.2,
    monthlyMortgagePayment: 721,
    qualifyingIncome: 34608,
    housingPaymentShareOfIncome: 31.2,
    eventNote: 'Disinflation eases mortgage rates back to 12%, beginning cyclical housing recovery',
  },
  {
    date: '1990',
    year: 1990,
    nominalCaseShiller: 76.8,
    nominalFhfa: 73.4,
    cpiIndex: 76.7,
    realCaseShiller: 100.1,
    realFhfa: 95.7,
    medianHomePriceUsd: 122900,
    medianFamilyIncomeUsd: 35350,
    mortgageRate30Y: 10.13,
    treasury10Y: 8.55,
    mortgageSpreadBps: 158,
    effectiveMortgageRate: 9.60,
    hai: 93.4,
    monthlyMortgagePayment: 873,
    qualifyingIncome: 41904,
    housingPaymentShareOfIncome: 29.6,
    eventNote: 'Savings and Loan crisis headwinds; commercial real estate distress',
  },
  {
    date: '1995',
    year: 1995,
    nominalCaseShiller: 83.2,
    nominalFhfa: 82.5,
    cpiIndex: 89.1,
    realCaseShiller: 93.4,
    realFhfa: 92.6,
    medianHomePriceUsd: 133900,
    medianFamilyIncomeUsd: 40610,
    mortgageRate30Y: 7.93,
    treasury10Y: 6.57,
    mortgageSpreadBps: 136,
    effectiveMortgageRate: 8.10,
    hai: 113.6,
    monthlyMortgagePayment: 780,
    qualifyingIncome: 37440,
    housingPaymentShareOfIncome: 23.1,
    eventNote: 'Productivity boom and stable inflation lift affordability well above 100 parity',
  },
  {
    date: '2000',
    year: 2000,
    nominalCaseShiller: 100.0,
    nominalFhfa: 100.0,
    cpiIndex: 100.0,
    realCaseShiller: 100.0,
    realFhfa: 100.0,
    medianHomePriceUsd: 169000,
    medianFamilyIncomeUsd: 50730,
    mortgageRate30Y: 8.05,
    treasury10Y: 6.03,
    mortgageSpreadBps: 202,
    effectiveMortgageRate: 7.60,
    hai: 122.5,
    monthlyMortgagePayment: 997,
    qualifyingIncome: 47856,
    housingPaymentShareOfIncome: 23.6,
    eventNote: 'Dot-com burst prompts capital rotation into residential property; benchmark index base',
  },
  {
    date: '2002',
    year: 2002,
    nominalCaseShiller: 121.5,
    nominalFhfa: 118.2,
    cpiIndex: 104.5,
    realCaseShiller: 116.3,
    realFhfa: 113.1,
    medianHomePriceUsd: 187600,
    medianFamilyIncomeUsd: 51680,
    mortgageRate30Y: 6.54,
    treasury10Y: 4.61,
    mortgageSpreadBps: 193,
    effectiveMortgageRate: 6.90,
    hai: 131.8,
    monthlyMortgagePayment: 953,
    qualifyingIncome: 45744,
    housingPaymentShareOfIncome: 22.1,
    eventNote: 'Fed cuts policy rate to 1.0%; mortgage securitization and non-conforming lending accelerates',
  },
  {
    date: '2004',
    year: 2004,
    nominalCaseShiller: 153.2,
    nominalFhfa: 142.1,
    cpiIndex: 109.8,
    realCaseShiller: 139.5,
    realFhfa: 129.4,
    medianHomePriceUsd: 221000,
    medianFamilyIncomeUsd: 54060,
    mortgageRate30Y: 5.84,
    treasury10Y: 4.27,
    mortgageSpreadBps: 157,
    effectiveMortgageRate: 6.10,
    hai: 124.6,
    monthlyMortgagePayment: 1041,
    qualifyingIncome: 49968,
    housingPaymentShareOfIncome: 23.1,
    eventNote: 'Subprime, option-ARM, and zero-down mortgage products inflate nationwide demand',
  },
  {
    date: '2006',
    year: 2006,
    nominalCaseShiller: 184.6,
    nominalFhfa: 164.8,
    cpiIndex: 117.8,
    realCaseShiller: 156.7,
    realFhfa: 139.9,
    medianHomePriceUsd: 246500,
    medianFamilyIncomeUsd: 58410,
    mortgageRate30Y: 6.41,
    treasury10Y: 4.80,
    mortgageSpreadBps: 161,
    effectiveMortgageRate: 6.20,
    hai: 106.8,
    monthlyMortgagePayment: 1235,
    qualifyingIncome: 59280,
    housingPaymentShareOfIncome: 25.4,
    eventNote: 'Peak of 2000s Housing Bubble; real home price purchasing power reaches historic high',
  },
  {
    date: '2008',
    year: 2008,
    nominalCaseShiller: 151.2,
    nominalFhfa: 152.0,
    cpiIndex: 125.7,
    realCaseShiller: 120.3,
    realFhfa: 120.9,
    medianHomePriceUsd: 232100,
    medianFamilyIncomeUsd: 61520,
    mortgageRate30Y: 6.03,
    treasury10Y: 3.66,
    mortgageSpreadBps: 237,
    effectiveMortgageRate: 6.00,
    hai: 128.4,
    monthlyMortgagePayment: 1118,
    qualifyingIncome: 53664,
    housingPaymentShareOfIncome: 21.8,
    eventNote: 'Lehman Brothers insolvency; Fannie Mae & Freddie Mac placed into federal conservatorship',
  },
  {
    date: '2010',
    year: 2010,
    nominalCaseShiller: 142.0,
    nominalFhfa: 143.5,
    cpiIndex: 127.8,
    realCaseShiller: 111.1,
    realFhfa: 112.3,
    medianHomePriceUsd: 221800,
    medianFamilyIncomeUsd: 60390,
    mortgageRate30Y: 4.69,
    treasury10Y: 3.22,
    mortgageSpreadBps: 147,
    effectiveMortgageRate: 5.30,
    hai: 164.2,
    monthlyMortgagePayment: 920,
    qualifyingIncome: 44160,
    housingPaymentShareOfIncome: 18.3,
    eventNote: 'Fed Quantitative Easing (QE1) purchases $1.25T in Agency Mortgage-Backed Securities',
  },
  {
    date: '2012',
    year: 2012,
    nominalCaseShiller: 136.6,
    nominalFhfa: 141.2,
    cpiIndex: 134.1,
    realCaseShiller: 101.9,
    realFhfa: 105.3,
    medianHomePriceUsd: 245200,
    medianFamilyIncomeUsd: 61400,
    mortgageRate30Y: 3.66,
    treasury10Y: 1.80,
    mortgageSpreadBps: 186,
    effectiveMortgageRate: 4.80,
    hai: 197.8,
    monthlyMortgagePayment: 899,
    qualifyingIncome: 43152,
    housingPaymentShareOfIncome: 17.6,
    eventNote: 'Post-GFC affordability peak (HAI touches 197.8), the most affordable housing market in 50 years',
  },
  {
    date: '2015',
    year: 2015,
    nominalCaseShiller: 171.4,
    nominalFhfa: 165.2,
    cpiIndex: 138.8,
    realCaseShiller: 123.5,
    realFhfa: 119.0,
    medianHomePriceUsd: 296400,
    medianFamilyIncomeUsd: 68260,
    mortgageRate30Y: 3.85,
    treasury10Y: 2.14,
    mortgageSpreadBps: 171,
    effectiveMortgageRate: 4.30,
    hai: 168.3,
    monthlyMortgagePayment: 1112,
    qualifyingIncome: 53376,
    housingPaymentShareOfIncome: 19.5,
    eventNote: 'Institutional single-family rental (SFR) aggregators emerge to purchase foreclosure inventory',
  },
  {
    date: '2018',
    year: 2018,
    nominalCaseShiller: 202.8,
    nominalFhfa: 198.5,
    cpiIndex: 147.2,
    realCaseShiller: 137.8,
    realFhfa: 134.9,
    medianHomePriceUsd: 326400,
    medianFamilyIncomeUsd: 78650,
    mortgageRate30Y: 4.54,
    treasury10Y: 2.91,
    mortgageSpreadBps: 163,
    effectiveMortgageRate: 4.10,
    hai: 153.2,
    monthlyMortgagePayment: 1329,
    qualifyingIncome: 63792,
    housingPaymentShareOfIncome: 20.3,
    eventNote: 'Fed quantitative tightening lifts mortgage rates above 4.5%, cooling annual price appreciation',
  },
  {
    date: '2020',
    year: 2020,
    nominalCaseShiller: 222.4,
    nominalFhfa: 221.8,
    cpiIndex: 152.0,
    realCaseShiller: 146.3,
    realFhfa: 145.9,
    medianHomePriceUsd: 336900,
    medianFamilyIncomeUsd: 84390,
    mortgageRate30Y: 3.11,
    treasury10Y: 0.89,
    mortgageSpreadBps: 222,
    effectiveMortgageRate: 3.75,
    hai: 174.6,
    monthlyMortgagePayment: 1152,
    qualifyingIncome: 55296,
    housingPaymentShareOfIncome: 16.4,
    eventNote: 'Emergency pandemic monetary stimulus; mortgage rates plummet to historical record lows',
  },
  {
    date: '2021',
    year: 2021,
    nominalCaseShiller: 260.1,
    nominalFhfa: 259.4,
    cpiIndex: 159.2,
    realCaseShiller: 163.4,
    realFhfa: 162.9,
    medianHomePriceUsd: 396800,
    medianFamilyIncomeUsd: 85020,
    mortgageRate30Y: 2.96,
    treasury10Y: 1.45,
    mortgageSpreadBps: 151,
    effectiveMortgageRate: 3.35,
    hai: 158.4,
    monthlyMortgagePayment: 1332,
    qualifyingIncome: 63936,
    housingPaymentShareOfIncome: 18.8,
    eventNote: '30Y mortgage hits 2.65% record all-time low in Jan 2021; generational refinancing wave locks in sub-3% debt',
  },
  {
    date: '2022',
    year: 2022,
    nominalCaseShiller: 298.5,
    nominalFhfa: 296.8,
    cpiIndex: 171.8,
    realCaseShiller: 173.7,
    realFhfa: 172.8,
    medianHomePriceUsd: 435800,
    medianFamilyIncomeUsd: 89100,
    mortgageRate30Y: 5.34,
    treasury10Y: 2.95,
    mortgageSpreadBps: 239,
    effectiveMortgageRate: 3.50,
    hai: 114.5,
    monthlyMortgagePayment: 1946,
    qualifyingIncome: 93408,
    housingPaymentShareOfIncome: 26.2,
    eventNote: 'Fed launches fastest rate-hiking cycle in 40 years; mortgage rates experience violent upward repricing',
  },
  {
    date: '2023',
    year: 2023,
    nominalCaseShiller: 312.4,
    nominalFhfa: 314.2,
    cpiIndex: 179.0,
    realCaseShiller: 174.5,
    realFhfa: 175.5,
    medianHomePriceUsd: 429000,
    medianFamilyIncomeUsd: 92400,
    mortgageRate30Y: 6.81,
    treasury10Y: 3.88,
    mortgageSpreadBps: 293,
    effectiveMortgageRate: 3.75,
    hai: 93.8,
    monthlyMortgagePayment: 2240,
    qualifyingIncome: 107520,
    housingPaymentShareOfIncome: 29.1,
    eventNote: 'Mortgage rates spike to 7.79% in Oct 2023; secondary home inventory freezes as owners cling to locked-in rates',
  },
  {
    date: '2024',
    year: 2024,
    nominalCaseShiller: 326.8,
    nominalFhfa: 331.0,
    cpiIndex: 184.5,
    realCaseShiller: 177.1,
    realFhfa: 179.4,
    medianHomePriceUsd: 422000,
    medianFamilyIncomeUsd: 96500,
    mortgageRate30Y: 6.72,
    treasury10Y: 4.22,
    mortgageSpreadBps: 250,
    effectiveMortgageRate: 3.85,
    hai: 92.1,
    monthlyMortgagePayment: 2182,
    qualifyingIncome: 104736,
    housingPaymentShareOfIncome: 27.1,
    eventNote: 'Mortgage basis spread over 10Y Treasuries remains historically wide (~250-290 bps) due to Fed MBS balance sheet runoff',
  },
  {
    date: '2025',
    year: 2025,
    nominalCaseShiller: 332.1,
    nominalFhfa: 338.4,
    cpiIndex: 188.4,
    realCaseShiller: 176.3,
    realFhfa: 179.6,
    medianHomePriceUsd: 424500,
    medianFamilyIncomeUsd: 100200,
    mortgageRate30Y: 6.58,
    treasury10Y: 4.15,
    mortgageSpreadBps: 243,
    effectiveMortgageRate: 3.88,
    hai: 95.7,
    monthlyMortgagePayment: 2163,
    qualifyingIncome: 103824,
    housingPaymentShareOfIncome: 25.9,
    eventNote: 'Fed easing cycle commences; mortgage spreads compress modestly but structural lock-in effect persists',
  },
  {
    date: '2026',
    year: 2026,
    nominalCaseShiller: 336.5,
    nominalFhfa: 343.2,
    cpiIndex: 192.1,
    realCaseShiller: 175.2,
    realFhfa: 178.7,
    medianHomePriceUsd: 428000,
    medianFamilyIncomeUsd: 104500,
    mortgageRate30Y: 6.45,
    treasury10Y: 4.05,
    mortgageSpreadBps: 240,
    effectiveMortgageRate: 3.92,
    hai: 99.2,
    monthlyMortgagePayment: 2151,
    qualifyingIncome: 103248,
    housingPaymentShareOfIncome: 24.7,
    eventNote: 'Gradual wage growth and rate stabilization guide HAI back toward 100 parity; real home prices stabilize after plateauing',
  },
];

/*
 * Returns the latest verified macro state of housing affordability,
 * 30-year fixed mortgage rates, and real estate purchasing power dynamics.
 */
export function getHousingOverview(): HousingMacroOverview {
  const latestHistorical = HISTORICAL_HOUSING_SERIES[HISTORICAL_HOUSING_SERIES.length - 1];

  // Derive global real estate asset valuation from institutional balance sheet history
  const latestAssetYear = GLOBAL_ASSET_HISTORY[GLOBAL_ASSET_HISTORY.length - 1];
  const realEstateCategory = latestAssetYear?.categories.find((c) => c.id === 'real-estate');
  const totalGlobalRealEstateWealthTrillion = realEstateCategory ? realEstateCategory.valueTrillion : 332.8;

  const haiEval = calculateHousingAffordabilityIndex(
    latestHistorical.medianFamilyIncomeUsd,
    latestHistorical.medianHomePriceUsd,
    latestHistorical.mortgageRate30Y
  );

  // Peak real price was achieved in 2024 at 177.1
  const peakRealCaseShiller = Math.max(...HISTORICAL_HOUSING_SERIES.map((p) => p.realCaseShiller));
  const peakPoint = HISTORICAL_HOUSING_SERIES.find((p) => p.realCaseShiller === peakRealCaseShiller);
  const deltaFromAthPct = Math.round(((latestHistorical.realCaseShiller - peakRealCaseShiller) / peakRealCaseShiller) * 1000) / 10;

  return {
    currentDate: latestHistorical.date,
    currentHai: haiEval.hai,
    haiRegime: haiEval.regime,
    currentMortgage30Y: latestHistorical.mortgageRate30Y,
    mortgageSpreadBps: latestHistorical.mortgageSpreadBps,
    treasury10Y: latestHistorical.treasury10Y,
    effectiveExistingMortgageRate: latestHistorical.effectiveMortgageRate,
    lockInSpreadPct: Math.round((latestHistorical.mortgageRate30Y - latestHistorical.effectiveMortgageRate) * 100) / 100,
    currentNominalCaseShiller: latestHistorical.nominalCaseShiller,
    currentRealCaseShiller: latestHistorical.realCaseShiller,
    realCaseShillerPeakYear: peakPoint ? peakPoint.year : 2024,
    realPriceAllTimeHighDeltaPct: deltaFromAthPct,
    totalGlobalRealEstateWealthTrillion,
    regions: REGIONAL_HOUSING_PROFILES,
    historicalSeries: HISTORICAL_HOUSING_SERIES,
  };
}

/*
 * Evaluates live alert telemetry to flag actionable regime dislocations
 * (e.g. golden handcuffs inventory paralysis, mortgage spread blowout, or affordability crisis).
 */
export function getLatestHousingState(): EvaluatedHousingState {
  const overview = getHousingOverview();
  const alerts: EvaluatedHousingState['activeAlerts'] = [];

  // Flag 1: Golden Handcuffs / Rate Lock-in spread exceeding 200 bps
  if (overview.lockInSpreadPct > 2.0) {
    alerts.push({
      id: 'lock-in-freeze',
      level: 'CRITICAL',
      headline: `🔒 "Golden Handcuffs" Supply Freeze: +${overview.lockInSpreadPct}% Rate Disconnect`,
      body: `New 30Y mortgage originations (${overview.currentMortgage30Y}%) exceed effective locked-in rates on outstanding debt (${overview.effectiveExistingMortgageRate}%) by ${overview.lockInSpreadPct} percentage points. Existing homeowners cannot move without forfeiting low-rate debt, paralyzing housing inventory.`,
    });
  }

  // Flag 2: Housing Affordability Deficit below 100
  if (overview.currentHai < 100) {
    alerts.push({
      id: 'hai-deficit',
      level: overview.currentHai < 85 ? 'CRITICAL' : 'WARNING',
      headline: `📉 Affordability Parity Deficit: HAI at ${overview.currentHai} (${AFFORDABILITY_REGIME_CONFIG[overview.haiRegime].label})`,
      body: `The median household earns only ${overview.currentHai}% of the annual income needed to service a median-priced home at prevailing mortgage rates, shifting new demand toward cash investors and higher-income cohorts.`,
    });
  } else {
    alerts.push({
      id: 'hai-benign',
      level: 'BENIGN',
      headline: `✅ Affordability Normalized: HAI at ${overview.currentHai}`,
      body: `Median household purchasing power is aligned with or exceeds conventional qualifying income thresholds for median-priced housing.`,
    });
  }

  // Flag 3: Mortgage Spread / Basis Over 10Y Treasuries
  if (overview.mortgageSpreadBps > 230) {
    alerts.push({
      id: 'mbs-spread-blowout',
      level: 'WARNING',
      headline: `⚡ Mortgage Basis Dislocation: ${overview.mortgageSpreadBps} bps Spread over 10Y Treasury`,
      body: `The spread between 30Y fixed mortgages and 10Y Treasuries (${overview.mortgageSpreadBps} bps vs historical ~170 bps norm) remains elevated due to Fed MBS balance sheet runoff (QT) and prepayment volatility risk.`,
    });
  }

  // Flag 4: Real vs Nominal Divergence
  alerts.push({
    id: 'real-vs-nominal',
    level: 'INFO',
    headline: `📊 Real vs Nominal Divergence: Real Home Prices ${overview.realPriceAllTimeHighDeltaPct}% vs Peak`,
    body: `While nominal Case-Shiller sits near all-time records (${overview.currentNominalCaseShiller}), deflating property by cumulative CPI inflation reveals real purchasing power has plateaued at ${overview.currentRealCaseShiller}.`,
  });

  return {
    timestamp: new Date().toISOString(),
    hai: overview.currentHai,
    haiRegime: overview.haiRegime,
    mortgageRate30Y: overview.currentMortgage30Y,
    mortgageSpreadBps: overview.mortgageSpreadBps,
    lockInSpreadPct: overview.lockInSpreadPct,
    realCaseShiller: overview.currentRealCaseShiller,
    nominalCaseShiller: overview.currentNominalCaseShiller,
    activeAlerts: alerts,
  };
}

/*
 * Provides structured tabular data export for CSV and JSON consumers,
 * standardizing decimal formatting and cross-series identifiers.
 */
export function getCombinedHousingExportData(): Array<Record<string, any>> {
  return HISTORICAL_HOUSING_SERIES.map((p) => ({
    date: p.date,
    year: p.year,
    nominalCaseShiller: p.nominalCaseShiller,
    nominalFhfa: p.nominalFhfa,
    cpiIndex: p.cpiIndex,
    realCaseShiller: p.realCaseShiller,
    realFhfa: p.realFhfa,
    medianHomePriceUsd: p.medianHomePriceUsd,
    medianFamilyIncomeUsd: p.medianFamilyIncomeUsd,
    mortgageRate30YPercent: p.mortgageRate30Y,
    treasury10YPercent: p.treasury10Y,
    mortgageSpreadBps: p.mortgageSpreadBps,
    effectiveExistingMortgageRatePercent: p.effectiveMortgageRate,
    housingAffordabilityIndex: p.hai,
    monthlyPaymentUsd: p.monthlyMortgagePayment,
    qualifyingIncomeUsd: p.qualifyingIncome,
    paymentShareOfIncomePercent: p.housingPaymentShareOfIncome,
    eventAnnotation: p.eventNote || '',
  }));
}
