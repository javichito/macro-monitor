import {
  CreditMarketOverview,
  CreditRatingSpread,
  CreditMarketHistoricalPoint,
  SloosSectorBreakdown,
  CreditStressLevel,
  FinancialConditionsRegime,
} from '../lib/types';

/**
 * Categorizes High-Yield Option-Adjusted Spread into historical stress regimes.
 * Spreads under 350 bps represent late-cycle complacency, while spreads crossing
 * 550 to 600 bps signal an impending corporate default cascade and credit freeze.
 */
export function getCreditStressLabel(bps: number): {
  level: CreditStressLevel;
  label: string;
  color: string;
  badgeClass: string;
} {
  if (bps < 330) {
    return {
      level: 'compressed',
      label: 'Ultra Compressed',
      color: '#10b981', // emerald
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };
  }
  if (bps < 450) {
    return {
      level: 'normal',
      label: 'Benign / Normal',
      color: '#0ea5e9', // sky
      badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    };
  }
  if (bps < 600) {
    return {
      level: 'elevated',
      label: 'Elevated Risk',
      color: '#f59e0b', // amber
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
  }
  if (bps < 850) {
    return {
      level: 'distress',
      label: 'Severe Distress',
      color: '#f97316', // orange
      badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    };
  }
  return {
    level: 'crisis',
    label: 'Credit Crunch / Crisis',
    color: '#ef4444', // red
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };
}

/**
 * Evaluates the Chicago Fed National Financial Conditions Index (NFCI).
 * Zero represents the multi-decade historical average since 1971.
 * Negative values denote looser than average financial conditions;
 * positive values denote tighter than average financial conditions.
 */
export function getNfciRegimeLabel(nfci: number): {
  regime: FinancialConditionsRegime;
  label: string;
  color: string;
  badgeClass: string;
} {
  if (nfci < -0.50) {
    return {
      regime: 'extremely_loose',
      label: 'Highly Accommodative',
      color: '#10b981',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };
  }
  if (nfci < 0.0) {
    return {
      regime: 'loose',
      label: 'Loose / Favorable',
      color: '#06b6d4',
      badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    };
  }
  if (nfci < 0.25) {
    return {
      regime: 'neutral',
      label: 'Neutral',
      color: '#64748b',
      badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    };
  }
  if (nfci < 0.75) {
    return {
      regime: 'tight',
      label: 'Tightening Conditions',
      color: '#f59e0b',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
  }
  return {
    regime: 'restrictive',
    label: 'Severe Financial Stress',
    color: '#ef4444',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };
}

export const CREDIT_RATING_SPREADS: CreditRatingSpread[] = [
  {
    tier: 'AAA_AA',
    label: 'AAA / AA Tier',
    category: 'Investment Grade',
    oasBps: 45,
    effectiveYieldPercent: 4.64,
    benchmarkSpreadVs10Y: 0.45,
    historicalPercentile: 14,
    defaultRate12mPct: 0.0,
    marketShareDebtPct: 14.5,
    riskDescription: 'Pristine sovereign-grade multinational balance sheets with near-zero historical default probability.',
  },
  {
    tier: 'A',
    label: 'A-Rated Corporates',
    category: 'Investment Grade',
    oasBps: 76,
    effectiveYieldPercent: 4.95,
    benchmarkSpreadVs10Y: 0.76,
    historicalPercentile: 18,
    defaultRate12mPct: 0.06,
    marketShareDebtPct: 34.2,
    riskDescription: 'Solid balance sheets with strong cash flow coverage, resilient across interest rate cycles.',
  },
  {
    tier: 'BBB',
    label: 'BBB (Fallen Angel Frontier)',
    category: 'Investment Grade',
    oasBps: 118,
    effectiveYieldPercent: 5.37,
    benchmarkSpreadVs10Y: 1.18,
    historicalPercentile: 22,
    defaultRate12mPct: 0.24,
    marketShareDebtPct: 51.3,
    riskDescription: 'The largest segment of the corporate bond market. A downgrade across this border triggers forced institutional selling into junk territory.',
  },
  {
    tier: 'BB',
    label: 'BB (High-Quality Speculative)',
    category: 'High Yield',
    oasBps: 215,
    effectiveYieldPercent: 6.34,
    benchmarkSpreadVs10Y: 2.15,
    historicalPercentile: 17,
    defaultRate12mPct: 0.88,
    marketShareDebtPct: 46.8,
    riskDescription: 'Rising Stars territory. Companies with adequate operational cash flow that can refinance via private credit or syndicated debt.',
  },
  {
    tier: 'B',
    label: 'B-Rated Speculative',
    category: 'High Yield',
    oasBps: 338,
    effectiveYieldPercent: 7.57,
    benchmarkSpreadVs10Y: 3.38,
    historicalPercentile: 24,
    defaultRate12mPct: 2.85,
    marketShareDebtPct: 39.4,
    riskDescription: 'Highly sensitive to floating rate debt interest burdens and macroeconomic growth deceleration.',
  },
  {
    tier: 'CCC_LOWER',
    label: 'CCC & Lower (Distress)',
    category: 'Distressed',
    oasBps: 842,
    effectiveYieldPercent: 12.61,
    benchmarkSpreadVs10Y: 8.42,
    historicalPercentile: 38,
    defaultRate12mPct: 15.2,
    marketShareDebtPct: 13.8,
    riskDescription: 'Vulnerable to imminent restructuring or default. Capital structures that cannot sustain normalized cost-of-capital refinancing.',
  },
];

export const SLOOS_SECTOR_BREAKDOWNS: SloosSectorBreakdown[] = [
  {
    sectorId: 'ci_large',
    sectorName: 'C&I Loans: Large & Mid Firms',
    category: 'commercial',
    netTighteningPct: 2.1,
    loanDemandNetPct: 6.4,
    status: 'neutral',
    commentary: 'Standards have normalized following the 2023 regional banking turbulence; large balance-sheet borrowers retain ample alternative access to private credit.',
  },
  {
    sectorId: 'ci_small',
    sectorName: 'C&I Loans: Small Businesses',
    category: 'commercial',
    netTighteningPct: 7.8,
    loanDemandNetPct: -2.3,
    status: 'tightening',
    commentary: 'Smaller domestic regional banks maintain conservative underwriting and collateral requirements for non-syndicated commercial loans.',
  },
  {
    sectorId: 'cre_office',
    sectorName: 'Commercial Real Estate: Office & Retail',
    category: 'real_estate',
    netTighteningPct: 28.6,
    loanDemandNetPct: -22.4,
    status: 'severe_tightening',
    commentary: 'Structural work-from-home vacancies and falling property appraisals force banks to demand steep equity infusions before refinancing maturing loans.',
  },
  {
    sectorId: 'cre_industrial',
    sectorName: 'Commercial Real Estate: Industrial & Logistics',
    category: 'real_estate',
    netTighteningPct: 8.3,
    loanDemandNetPct: 4.1,
    status: 'neutral',
    commentary: 'Supported by secular e-commerce logistics, reshoring of supply chains, and domestic manufacturing plant construction.',
  },
  {
    sectorId: 'consumer_cards',
    sectorName: 'Consumer Credit Cards & Auto Lending',
    category: 'consumer',
    netTighteningPct: 12.5,
    loanDemandNetPct: -4.8,
    status: 'tightening',
    commentary: 'Banks raised minimum FICO cutoffs and lowered credit limits in response to subprime credit card and auto loan charge-off normalization.',
  },
];

export const HISTORICAL_CREDIT_SERIES: CreditMarketHistoricalPoint[] = [
  {
    date: '2000-06',
    year: 2000,
    usHighYieldOasBps: 585,
    usInvestmentGradeOasBps: 152,
    usBbbOasBps: 188,
    us10YYieldPercent: 6.03,
    chicagoFedNfci: -0.15,
    nfciRiskSubindex: 0.05,
    nfciCreditSubindex: -0.12,
    nfciLeverageSubindex: -0.08,
    sloosNetTighteningPct: 24.2,
    sloosLoanDemandPct: -8.5,
    isRecession: false,
    eventAnnotation: 'Dot-Com equity bubble deflation begins; Fed funds rate at 6.50%',
  },
  {
    date: '2001-09',
    year: 2001,
    usHighYieldOasBps: 942,
    usInvestmentGradeOasBps: 228,
    usBbbOasBps: 275,
    us10YYieldPercent: 4.73,
    chicagoFedNfci: 0.48,
    nfciRiskSubindex: 0.62,
    nfciCreditSubindex: 0.28,
    nfciLeverageSubindex: -0.18,
    sloosNetTighteningPct: 59.6,
    sloosLoanDemandPct: -38.2,
    isRecession: true,
    eventAnnotation: '2001 Recession & Telecom capital expenditure collapse',
  },
  {
    date: '2002-10',
    year: 2002,
    usHighYieldOasBps: 1045,
    usInvestmentGradeOasBps: 268,
    usBbbOasBps: 335,
    us10YYieldPercent: 3.94,
    chicagoFedNfci: 0.52,
    nfciRiskSubindex: 0.78,
    nfciCreditSubindex: 0.22,
    nfciLeverageSubindex: -0.15,
    sloosNetTighteningPct: 41.5,
    sloosLoanDemandPct: -25.0,
    isRecession: false,
    eventAnnotation: 'WorldCom and Enron corporate fraud bankruptcies peak spread widening',
  },
  {
    date: '2004-06',
    year: 2004,
    usHighYieldOasBps: 372,
    usInvestmentGradeOasBps: 96,
    usBbbOasBps: 122,
    us10YYieldPercent: 4.73,
    chicagoFedNfci: -0.62,
    nfciRiskSubindex: -0.38,
    nfciCreditSubindex: -0.18,
    nfciLeverageSubindex: -0.12,
    sloosNetTighteningPct: -18.4,
    sloosLoanDemandPct: 22.8,
    isRecession: false,
    eventAnnotation: 'Greenspan 1% rate era; credit expansion and bank lending acceleration',
  },
  {
    date: '2007-06',
    year: 2007,
    usHighYieldOasBps: 264,
    usInvestmentGradeOasBps: 88,
    usBbbOasBps: 112,
    us10YYieldPercent: 5.10,
    chicagoFedNfci: -0.74,
    nfciRiskSubindex: -0.42,
    nfciCreditSubindex: -0.22,
    nfciLeverageSubindex: -0.10,
    sloosNetTighteningPct: -1.8,
    sloosLoanDemandPct: 14.5,
    isRecession: false,
    eventAnnotation: 'All-time low credit spreads; peak pre-crisis covenant-lite debt issuance',
  },
  {
    date: '2008-11',
    year: 2008,
    usHighYieldOasBps: 2182,
    usInvestmentGradeOasBps: 648,
    usBbbOasBps: 792,
    us10YYieldPercent: 3.65,
    chicagoFedNfci: 3.82,
    nfciRiskSubindex: 3.12,
    nfciCreditSubindex: 1.84,
    nfciLeverageSubindex: 0.45,
    sloosNetTighteningPct: 83.6,
    sloosLoanDemandPct: -56.4,
    isRecession: true,
    eventAnnotation: 'Lehman Brothers bankruptcy; systemic credit freeze and all-time record OAS',
  },
  {
    date: '2009-12',
    year: 2009,
    usHighYieldOasBps: 642,
    usInvestmentGradeOasBps: 178,
    usBbbOasBps: 224,
    us10YYieldPercent: 3.59,
    chicagoFedNfci: -0.12,
    nfciRiskSubindex: 0.08,
    nfciCreditSubindex: 0.14,
    nfciLeverageSubindex: -0.18,
    sloosNetTighteningPct: 14.3,
    sloosLoanDemandPct: -15.2,
    isRecession: false,
    eventAnnotation: 'Fed ZIRP and QE1 liquidity injection catalyzes rapid credit spread compression',
  },
  {
    date: '2011-09',
    year: 2011,
    usHighYieldOasBps: 785,
    usInvestmentGradeOasBps: 232,
    usBbbOasBps: 295,
    us10YYieldPercent: 1.98,
    chicagoFedNfci: 0.18,
    nfciRiskSubindex: 0.38,
    nfciCreditSubindex: 0.05,
    nfciLeverageSubindex: -0.15,
    sloosNetTighteningPct: -6.8,
    sloosLoanDemandPct: 8.2,
    isRecession: false,
    eventAnnotation: 'US sovereign credit downgrade by S&P and European sovereign debt crisis',
  },
  {
    date: '2014-06',
    year: 2014,
    usHighYieldOasBps: 342,
    usInvestmentGradeOasBps: 104,
    usBbbOasBps: 132,
    us10YYieldPercent: 2.53,
    chicagoFedNfci: -0.71,
    nfciRiskSubindex: -0.44,
    nfciCreditSubindex: -0.18,
    nfciLeverageSubindex: -0.12,
    sloosNetTighteningPct: -14.2,
    sloosLoanDemandPct: 18.6,
    isRecession: false,
    eventAnnotation: 'Prolonged zero-rate environment drives search-for-yield and private credit inception',
  },
  {
    date: '2016-02',
    year: 2016,
    usHighYieldOasBps: 839,
    usInvestmentGradeOasBps: 215,
    usBbbOasBps: 268,
    us10YYieldPercent: 1.78,
    chicagoFedNfci: -0.05,
    nfciRiskSubindex: 0.28,
    nfciCreditSubindex: 0.04,
    nfciLeverageSubindex: -0.16,
    sloosNetTighteningPct: 12.8,
    sloosLoanDemandPct: -4.5,
    isRecession: false,
    eventAnnotation: 'Crude oil collapses to $26/bbl; massive distress across US shale energy junk bonds',
  },
  {
    date: '2018-12',
    year: 2018,
    usHighYieldOasBps: 533,
    usInvestmentGradeOasBps: 159,
    usBbbOasBps: 198,
    us10YYieldPercent: 2.83,
    chicagoFedNfci: -0.32,
    nfciRiskSubindex: 0.12,
    nfciCreditSubindex: -0.14,
    nfciLeverageSubindex: -0.14,
    sloosNetTighteningPct: -2.3,
    sloosLoanDemandPct: 6.8,
    isRecession: false,
    eventAnnotation: 'Fed quantitative tightening & "autopilot" balance sheet runoff triggers equity correction',
  },
  {
    date: '2020-03',
    year: 2020,
    usHighYieldOasBps: 1087,
    usInvestmentGradeOasBps: 373,
    usBbbOasBps: 442,
    us10YYieldPercent: 0.87,
    chicagoFedNfci: 1.45,
    nfciRiskSubindex: 1.88,
    nfciCreditSubindex: 0.72,
    nfciLeverageSubindex: 0.05,
    sloosNetTighteningPct: 42.1,
    sloosLoanDemandPct: 24.3,
    isRecession: true,
    eventAnnotation: 'Global COVID lockdowns; unprecedented liquidity run halted by Fed corporate bond buying',
  },
  {
    date: '2021-06',
    year: 2021,
    usHighYieldOasBps: 298,
    usInvestmentGradeOasBps: 84,
    usBbbOasBps: 106,
    us10YYieldPercent: 1.52,
    chicagoFedNfci: -0.68,
    nfciRiskSubindex: -0.42,
    nfciCreditSubindex: -0.19,
    nfciLeverageSubindex: -0.11,
    sloosNetTighteningPct: -31.3,
    sloosLoanDemandPct: 28.5,
    isRecession: false,
    eventAnnotation: 'Post-pandemic fiscal stimulus and ultra-low rates create historic corporate refinancing window',
  },
  {
    date: '2022-10',
    year: 2022,
    usHighYieldOasBps: 582,
    usInvestmentGradeOasBps: 168,
    usBbbOasBps: 215,
    us10YYieldPercent: 3.98,
    chicagoFedNfci: -0.12,
    nfciRiskSubindex: 0.18,
    nfciCreditSubindex: -0.08,
    nfciLeverageSubindex: -0.14,
    sloosNetTighteningPct: 38.9,
    sloosLoanDemandPct: -22.4,
    isRecession: false,
    eventAnnotation: 'Aggressive Fed 75 bps rate hikes; terminal rate repricing pushes yields higher',
  },
  {
    date: '2023-03',
    year: 2023,
    usHighYieldOasBps: 486,
    usInvestmentGradeOasBps: 148,
    usBbbOasBps: 185,
    us10YYieldPercent: 3.52,
    chicagoFedNfci: 0.05,
    nfciRiskSubindex: 0.42,
    nfciCreditSubindex: 0.08,
    nfciLeverageSubindex: -0.15,
    sloosNetTighteningPct: 50.8,
    sloosLoanDemandPct: -35.2,
    isRecession: false,
    eventAnnotation: 'Silicon Valley Bank & Signature Bank collapse; sharp spike in bank lending caution',
  },
  {
    date: '2024-06',
    year: 2024,
    usHighYieldOasBps: 342,
    usInvestmentGradeOasBps: 98,
    usBbbOasBps: 124,
    us10YYieldPercent: 4.28,
    chicagoFedNfci: -0.54,
    nfciRiskSubindex: -0.32,
    nfciCreditSubindex: -0.15,
    nfciLeverageSubindex: -0.11,
    sloosNetTighteningPct: 15.2,
    sloosLoanDemandPct: -5.4,
    isRecession: false,
    eventAnnotation: 'US economic soft-landing narrative; high cash reserves cushion corporate interest expenses',
  },
  {
    date: '2025-06',
    year: 2025,
    usHighYieldOasBps: 322,
    usInvestmentGradeOasBps: 94,
    usBbbOasBps: 120,
    us10YYieldPercent: 4.22,
    chicagoFedNfci: -0.51,
    nfciRiskSubindex: -0.30,
    nfciCreditSubindex: -0.14,
    nfciLeverageSubindex: -0.10,
    sloosNetTighteningPct: 4.8,
    sloosLoanDemandPct: 2.1,
    isRecession: false,
    eventAnnotation: 'Central bank easing cycle underway; $1.7T private credit market absorbs leveraged loans',
  },
  {
    date: '2026-03',
    year: 2026,
    usHighYieldOasBps: 318,
    usInvestmentGradeOasBps: 92,
    usBbbOasBps: 118,
    us10YYieldPercent: 4.19,
    chicagoFedNfci: -0.52,
    nfciRiskSubindex: -0.28,
    nfciCreditSubindex: -0.14,
    nfciLeverageSubindex: -0.10,
    sloosNetTighteningPct: 2.1,
    sloosLoanDemandPct: 6.4,
    isRecession: false,
    eventAnnotation: 'Current Regime: Spreads compressed near historical 15th percentile despite 4.2% base rates',
  },
];

export const CREDIT_MARKET_OVERVIEW: CreditMarketOverview = {
  currentDate: '2026-Q3',
  highYieldOas: {
    currentBps: 318,
    fiftyTwoWeekHighBps: 412,
    fiftyTwoWeekLowBps: 295,
    historicalPercentile: 16,
    stressLevel: 'compressed',
    effectiveYieldPct: 7.37,
    summary:
      'High-Yield credit spreads are compressed at 318 bps (16th historical percentile). Despite base policy rates above 4%, strong corporate earnings, multi-year debt maturity extensions, and $1.7T in alternative private credit dry powder prevent systemic refinancing defaults.',
  },
  investmentGradeOas: {
    currentBps: 92,
    bbbFallenAngelSpreadBps: 118,
    stressLevel: 'compressed',
    effectiveYieldPct: 5.11,
    summary:
      'Investment-Grade spreads trade at a benign 92 bps over Treasuries. BBB-rated debt (51.3% of the IG market) shows minimal "Fallen Angel" downgrade contagion risk into speculative junk status.',
  },
  financialConditions: {
    currentNfci: -0.52,
    regime: 'extremely_loose',
    adjustedNfci: -0.38,
    riskSubindex: -0.28,
    creditSubindex: -0.14,
    leverageSubindex: -0.10,
    trend3Month: 'easing',
    summary:
      'The Chicago Fed NFCI stands at -0.52, signaling financial conditions that are substantially looser than the multi-decade historical average. Record equity valuations, narrow credit risk premia, and tight sovereign spreads offset high base borrowing costs.',
  },
  bankLending: {
    currentNetTighteningPct: 2.1,
    cAndIDemandNetPct: 6.4,
    creTighteningPct: 28.6,
    cyclePhase: 'selective_lending',
    summary:
      'The Federal Reserve Senior Loan Officer Opinion Survey (SLOOS) reveals credit availability has broadly normalized from the 2023 regional banking shock (+50.8%), but banks remain deeply defensive on Commercial Real Estate (Office & Retail at +28.6% net tightening).',
  },
  ratingTiers: CREDIT_RATING_SPREADS,
  sloosBreakdown: SLOOS_SECTOR_BREAKDOWNS,
  historicalSeries: HISTORICAL_CREDIT_SERIES,
};
