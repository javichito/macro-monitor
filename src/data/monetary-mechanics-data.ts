/*
 * Canonical Data Model & Econometric Engine for Monetary Velocity & Debt Issuance Mechanics
 *
 * Implements telemetry for:
 * 1. Velocity of M2 Money Supply (V = GDP / M2) across major currency blocs,
 *    explaining why central bank balance sheet expansions create disinflationary asset booms
 *    when velocity collapses (the 2010s post-GFC QE trap) versus rapid consumer inflation
 *    when velocity rebounds (2021-2023 fiscal monetization).
 * 2. Treasury Issuance Maturity Profile (T-Bills vs. Long-Duration Coupons),
 *    modeling the "Shadow QE" transmission mechanism where frontloaded short-term bill issuance
 *    absorbs idle cash from the Fed's Overnight Reverse Repo Facility (ON RRP) and suppresses
 *    the 10-Year Treasury term premium.
 */

import {
  MonetaryMechanicsRegionId,
  VelocityRegimeType,
  IssuanceTiltRegime,
  MonetaryVelocitySeriesPoint,
  TreasuryIssuanceSeriesPoint,
  RegionalMonetaryProfile,
  MonetaryMechanicsOverview,
  EvaluatedMonetaryMechanicsState,
} from '../lib/types';
import latestStatusRaw from './latest-monetary-mechanics-status.json';

export const REGIONAL_MONETARY_PROFILES: Record<MonetaryMechanicsRegionId, RegionalMonetaryProfile> = {
  USA: {
    regionId: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    nominalGdpTrillion: 29.35,
    m2MoneySupplyTrillion: 21.45,
    currentVelocity: 1.368,
    velocity3YTrendPct: 9.4,
    velocityAllTimePeak: 2.19, // Reached in 1997 during dot-com expansion
    velocityAllTimeLow: 1.121, // Covid lockdown trough in Q2 2020
    totalDebtTrillion: 28.20,
    shortTermBillsPct: 21.56,
    mediumLongCouponsPct: 78.44,
    tbillTargetOptimalRange: [15.0, 20.0],
    shadowQeEstimatedBps: -34,
    monetaryTransmissionNote:
      'The US Treasury relies heavily on short-term T-Bills to finance deficits without overwhelming long-duration primary dealer balance sheets, while M2 velocity is normalizing around 1.37 after its generational Covid low.',
  },
  EUR: {
    regionId: 'EUR',
    name: 'Eurozone',
    flag: '🇪🇺',
    currencyCode: 'EUR',
    currencySymbol: '€',
    nominalGdpTrillion: 16.52,
    m2MoneySupplyTrillion: 17.15,
    currentVelocity: 0.963,
    velocity3YTrendPct: 3.2,
    velocityAllTimePeak: 1.38,
    velocityAllTimeLow: 0.88,
    totalDebtTrillion: 14.10,
    shortTermBillsPct: 12.40,
    mediumLongCouponsPct: 87.60,
    tbillTargetOptimalRange: [10.0, 15.0],
    shadowQeEstimatedBps: -10,
    monetaryTransmissionNote:
      'Eurozone sovereigns maintain conservative issuance profiles (Germany Bubills ~12%), leading to minimal shadow duration manipulation; velocity remains structurally below 1.0 due to fragmented cross-border banking.',
  },
  GBR: {
    regionId: 'GBR',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    nominalGdpTrillion: 3.48,
    m2MoneySupplyTrillion: 3.88,
    currentVelocity: 0.897,
    velocity3YTrendPct: 1.8,
    velocityAllTimePeak: 1.62,
    velocityAllTimeLow: 0.82,
    totalDebtTrillion: 3.32,
    shortTermBillsPct: 4.80,
    mediumLongCouponsPct: 95.20,
    tbillTargetOptimalRange: [5.0, 10.0],
    shadowQeEstimatedBps: 5,
    monetaryTransmissionNote:
      'The UK Debt Management Office (DMO) issues almost entirely medium and long-dated Gilts to satisfy domestic pension demand, leaving UK long yields highly vulnerable to duration supply spikes without T-bill shock absorbers.',
  },
  JPN: {
    regionId: 'JPN',
    name: 'Japan',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    nominalGdpTrillion: 4.02,
    m2MoneySupplyTrillion: 8.35,
    currentVelocity: 0.481,
    velocity3YTrendPct: 4.1,
    velocityAllTimePeak: 0.98,
    velocityAllTimeLow: 0.44,
    totalDebtTrillion: 10.45,
    shortTermBillsPct: 16.20,
    mediumLongCouponsPct: 83.80,
    tbillTargetOptimalRange: [12.0, 18.0],
    shadowQeEstimatedBps: -15,
    monetaryTransmissionNote:
      'Persistent cash preference and three decades of deflationary conditioning anchor Japan velocity below 0.50; Financing Bills (FBs) are actively absorbed by domestic financial institutions and the Bank of Japan.',
  },
  CHN: {
    regionId: 'CHN',
    name: 'China',
    flag: '🇨🇳',
    currencyCode: 'CNY',
    currencySymbol: '¥',
    nominalGdpTrillion: 18.25,
    m2MoneySupplyTrillion: 42.45,
    currentVelocity: 0.430,
    velocity3YTrendPct: -5.4,
    velocityAllTimePeak: 0.82,
    velocityAllTimeLow: 0.42,
    totalDebtTrillion: 15.60,
    shortTermBillsPct: 14.00,
    mediumLongCouponsPct: 86.00,
    tbillTargetOptimalRange: [10.0, 16.0],
    shadowQeEstimatedBps: -8,
    monetaryTransmissionNote:
      'China possesses the world largest M2 money supply ($42T+), but velocity continues to grind downward due to high household precautionary savings, property sector deleveraging, and state bank loan rollover friction.',
  },
  GLOBAL: {
    regionId: 'GLOBAL',
    name: 'Global Aggregate (G10 + China)',
    flag: '🌐',
    currencyCode: 'USD',
    currencySymbol: '$',
    nominalGdpTrillion: 112.50,
    m2MoneySupplyTrillion: 134.20,
    currentVelocity: 0.838,
    velocity3YTrendPct: 4.6,
    velocityAllTimePeak: 1.35,
    velocityAllTimeLow: 0.76,
    totalDebtTrillion: 98.40,
    shortTermBillsPct: 17.80,
    mediumLongCouponsPct: 82.20,
    tbillTargetOptimalRange: [12.0, 18.0],
    shadowQeEstimatedBps: -22,
    monetaryTransmissionNote:
      'Global monetary velocity is experiencing a cyclical rebound from pandemic lows, while sovereign debt managers globally struggle to issue record duration without destabilizing term premiums.',
  },
};

/**
 * Historical US M2 Velocity and Inflation Series (2000 to 2026)
 * Demonstrates the structural collapse during the 2010s QE era and the rapid 2021-2023 rebound.
 */
export const HISTORICAL_VELOCITY_SERIES: MonetaryVelocitySeriesPoint[] = [
  {
    date: '2000-Q1',
    year: 2000,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 10.00,
    m2MoneySupplyTrillionUsd: 4.68,
    velocity: 2.137,
    velocityYoYPct: 0.5,
    m2GrowthYoYPct: 5.8,
    cpiInflationYoY: 3.4,
    regime: 'normalization',
    historicalContext: 'Dot-com peak: High velocity and brisk commercial transactions before the tech unwind.',
  },
  {
    date: '2003-Q1',
    year: 2003,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 11.17,
    m2MoneySupplyTrillionUsd: 5.85,
    velocity: 1.909,
    velocityYoYPct: -3.8,
    m2GrowthYoYPct: 7.2,
    cpiInflationYoY: 2.3,
    regime: 'normalization',
    historicalContext: 'Post-2001 easing cycle: Rate cuts stimulate housing credit as velocity moderates below 2.0.',
  },
  {
    date: '2006-Q1',
    year: 2006,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 13.60,
    m2MoneySupplyTrillionUsd: 6.74,
    velocity: 2.018,
    velocityYoYPct: 1.8,
    m2GrowthYoYPct: 5.1,
    cpiInflationYoY: 3.6,
    regime: 'normalization',
    historicalContext: 'Pre-GFC housing and credit boom: Commercial bank lending fuels robust money turnover.',
  },
  {
    date: '2008-Q3',
    year: 2008,
    quarter: 'Q3',
    nominalGdpTrillionUsd: 14.84,
    m2MoneySupplyTrillionUsd: 7.78,
    velocity: 1.907,
    velocityYoYPct: -2.1,
    m2GrowthYoYPct: 6.4,
    cpiInflationYoY: 5.4,
    regime: 'deflationary_stall',
    historicalContext: 'Lehman Brothers collapse: Interbank lending freezes and velocity initiates a secular plunge.',
  },
  {
    date: '2010-Q1',
    year: 2010,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 14.72,
    m2MoneySupplyTrillionUsd: 8.52,
    velocity: 1.728,
    velocityYoYPct: -5.2,
    m2GrowthYoYPct: 2.1,
    cpiInflationYoY: 2.1,
    regime: 'qe_disinflation_trap',
    historicalContext:
      'QE1 Launch: Trillions injected into base money fail to spur consumer inflation because velocity drops sharply.',
  },
  {
    date: '2012-Q1',
    year: 2012,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 16.02,
    m2MoneySupplyTrillionUsd: 9.81,
    velocity: 1.633,
    velocityYoYPct: -4.8,
    m2GrowthYoYPct: 9.7,
    cpiInflationYoY: 2.7,
    regime: 'qe_disinflation_trap',
    historicalContext:
      'QE2 & Operation Twist: Banks hoard reserves at the Fed under IORB, depressing velocity rather than lending.',
  },
  {
    date: '2014-Q1',
    year: 2014,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 17.14,
    m2MoneySupplyTrillionUsd: 11.13,
    velocity: 1.540,
    velocityYoYPct: -3.5,
    m2GrowthYoYPct: 6.3,
    cpiInflationYoY: 1.5,
    regime: 'qe_disinflation_trap',
    historicalContext:
      'Taper Tantrum aftermath: Broad liquidity swells equity multiples while consumer CPI languishes under 2%.',
  },
  {
    date: '2016-Q1',
    year: 2016,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 18.41,
    m2MoneySupplyTrillionUsd: 12.56,
    velocity: 1.466,
    velocityYoYPct: -3.1,
    m2GrowthYoYPct: 6.8,
    cpiInflationYoY: 1.4,
    regime: 'qe_disinflation_trap',
    historicalContext:
      'Global deflation scare: Commodity collapse and European negative rates pull US velocity down below 1.47.',
  },
  {
    date: '2018-Q1',
    year: 2018,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 20.33,
    m2MoneySupplyTrillionUsd: 13.91,
    velocity: 1.462,
    velocityYoYPct: -0.2,
    m2GrowthYoYPct: 4.4,
    cpiInflationYoY: 2.4,
    regime: 'normalization',
    historicalContext:
      'Fed QT balance sheet runoff: Velocity stabilizes as rate hikes trim reserve excess without boosting turnover.',
  },
  {
    date: '2019-Q4',
    year: 2019,
    quarter: 'Q4',
    nominalGdpTrillionUsd: 21.69,
    m2MoneySupplyTrillionUsd: 15.24,
    velocity: 1.423,
    velocityYoYPct: -1.8,
    m2GrowthYoYPct: 6.7,
    cpiInflationYoY: 2.3,
    regime: 'qe_disinflation_trap',
    historicalContext:
      'Repo plumbing spike: Pre-pandemic monetary conditions are characterized by record-low money turnover.',
  },
  {
    date: '2020-Q2',
    year: 2020,
    quarter: 'Q2',
    nominalGdpTrillionUsd: 19.64,
    m2MoneySupplyTrillionUsd: 17.52,
    velocity: 1.121,
    velocityYoYPct: -21.4,
    m2GrowthYoYPct: 23.4,
    cpiInflationYoY: 0.6,
    regime: 'deflationary_stall',
    historicalContext:
      'Covid Lockdowns: M2 surges at fastest pace in modern history while physical economy halts, plunging velocity to all-time low (1.121).',
  },
  {
    date: '2021-Q1',
    year: 2021,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 22.31,
    m2MoneySupplyTrillionUsd: 19.65,
    velocity: 1.135,
    velocityYoYPct: -18.2,
    m2GrowthYoYPct: 26.9,
    cpiInflationYoY: 2.6,
    regime: 'stimulus_rebound',
    historicalContext:
      'Direct stimulus checks ($5T fiscal transfers): Money enters real consumer checking accounts rather than bank reserves.',
  },
  {
    date: '2021-Q4',
    year: 2021,
    quarter: 'Q4',
    nominalGdpTrillionUsd: 24.35,
    m2MoneySupplyTrillionUsd: 21.40,
    velocity: 1.138,
    velocityYoYPct: -1.2,
    m2GrowthYoYPct: 12.8,
    cpiInflationYoY: 7.0,
    regime: 'stimulus_rebound',
    historicalContext:
      'Reopening demand meets supply bottlenecks: Unlike the 2010s, fiscal monetization ignites broad CPI inflation.',
  },
  {
    date: '2022-Q2',
    year: 2022,
    quarter: 'Q2',
    nominalGdpTrillionUsd: 25.54,
    m2MoneySupplyTrillionUsd: 21.72,
    velocity: 1.176,
    velocityYoYPct: 4.8,
    m2GrowthYoYPct: 5.6,
    cpiInflationYoY: 9.1,
    regime: 'overheated_velocity',
    historicalContext:
      'Peak Inflation (9.1% CPI): Velocity starts a rapid upward climb as households accelerate purchases before prices rise.',
  },
  {
    date: '2022-Q4',
    year: 2022,
    quarter: 'Q4',
    nominalGdpTrillionUsd: 26.41,
    m2MoneySupplyTrillionUsd: 21.37,
    velocity: 1.236,
    velocityYoYPct: 8.6,
    m2GrowthYoYPct: -1.3,
    cpiInflationYoY: 6.5,
    regime: 'overheated_velocity',
    historicalContext:
      'Negative M2 growth accompanied by accelerating velocity: Proves inflation can persist even as money supply contracts.',
  },
  {
    date: '2023-Q2',
    year: 2023,
    quarter: 'Q2',
    nominalGdpTrillionUsd: 27.06,
    m2MoneySupplyTrillionUsd: 20.89,
    velocity: 1.295,
    velocityYoYPct: 10.1,
    m2GrowthYoYPct: -3.8,
    cpiInflationYoY: 3.0,
    regime: 'stimulus_rebound',
    historicalContext:
      'Regional banking crisis (SVB): BTFP liquidity injection prevents credit freeze, maintaining economic turnover.',
  },
  {
    date: '2023-Q4',
    year: 2023,
    quarter: 'Q4',
    nominalGdpTrillionUsd: 27.94,
    m2MoneySupplyTrillionUsd: 20.92,
    velocity: 1.336,
    velocityYoYPct: 8.1,
    m2GrowthYoYPct: -2.1,
    cpiInflationYoY: 3.4,
    regime: 'normalization',
    historicalContext:
      'Strong GDP expansion (4.9% annualized): Consumer spending velocity breaks above 1.33 for first time since 2019.',
  },
  {
    date: '2024-Q2',
    year: 2024,
    quarter: 'Q2',
    nominalGdpTrillionUsd: 28.65,
    m2MoneySupplyTrillionUsd: 21.05,
    velocity: 1.361,
    velocityYoYPct: 5.1,
    m2GrowthYoYPct: 0.8,
    cpiInflationYoY: 3.0,
    regime: 'normalization',
    historicalContext:
      'M2 growth turns positive while velocity stabilizes above 1.36: Soft landing narrative gains traction.',
  },
  {
    date: '2024-Q4',
    year: 2024,
    quarter: 'Q4',
    nominalGdpTrillionUsd: 29.12,
    m2MoneySupplyTrillionUsd: 21.32,
    velocity: 1.366,
    velocityYoYPct: 2.2,
    m2GrowthYoYPct: 1.9,
    cpiInflationYoY: 2.7,
    regime: 'normalization',
    historicalContext:
      'Fed begins rate cutting cycle: Velocity consolidates near 1.37, preventing a return to 2010s disinflation trap.',
  },
  {
    date: '2025-Q2',
    year: 2025,
    quarter: 'Q2',
    nominalGdpTrillionUsd: 29.28,
    m2MoneySupplyTrillionUsd: 21.40,
    velocity: 1.368,
    velocityYoYPct: 0.5,
    m2GrowthYoYPct: 1.7,
    cpiInflationYoY: 2.6,
    regime: 'normalization',
    historicalContext:
      'Balanced monetary state: Money supply and velocity grow in tandem with real productive capacity.',
  },
  {
    date: '2026-Q1',
    year: 2026,
    quarter: 'Q1',
    nominalGdpTrillionUsd: 29.35,
    m2MoneySupplyTrillionUsd: 21.45,
    velocity: 1.368,
    velocityYoYPct: 0.1,
    m2GrowthYoYPct: 0.6,
    cpiInflationYoY: 2.6,
    regime: 'normalization',
    historicalContext:
      'Current regime: Velocity remains anchored around 1.37, providing an enduring floor against deflationary collapse.',
  },
];

/**
 * Historical US Treasury Issuance & Maturity Breakdown Series (2018 to 2026)
 * Quantifies T-Bills vs. Coupons and the "Shadow QE" term premium suppression mechanism.
 */
export const HISTORICAL_TREASURY_ISSUANCE_SERIES: TreasuryIssuanceSeriesPoint[] = [
  {
    date: '2018-Q4',
    year: 2018,
    quarter: 'Q4',
    tBillsOutstandingTrillionUsd: 2.45,
    couponsOutstandingTrillionUsd: 13.15,
    totalMarketableDebtTrillionUsd: 15.60,
    tBillSharePct: 15.71,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 35.2,
    estimatedTermPremiumSuppressionBps: 0,
    tenYearYield: 2.69,
    onRrpBalanceTrillionUsd: 0.05,
    regime: 'tbac_neutral_balance',
    policyNote: 'TBAC guidelines strictly respected: T-Bills at 15.7% of total debt; neutral duration profile.',
  },
  {
    date: '2019-Q4',
    year: 2019,
    quarter: 'Q4',
    tBillsOutstandingTrillionUsd: 2.65,
    couponsOutstandingTrillionUsd: 14.05,
    totalMarketableDebtTrillionUsd: 16.70,
    tBillSharePct: 15.87,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 38.0,
    estimatedTermPremiumSuppressionBps: 0,
    tenYearYield: 1.92,
    onRrpBalanceTrillionUsd: 0.08,
    regime: 'tbac_neutral_balance',
    policyNote: 'Standard debt management: Regular predictable coupon auctions satisfy private institutional demand.',
  },
  {
    date: '2020-Q2',
    year: 2020,
    quarter: 'Q2',
    tBillsOutstandingTrillionUsd: 5.05,
    couponsOutstandingTrillionUsd: 14.95,
    totalMarketableDebtTrillionUsd: 20.00,
    tBillSharePct: 25.25,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 74.5,
    estimatedTermPremiumSuppressionBps: -48,
    tenYearYield: 0.66,
    onRrpBalanceTrillionUsd: 0.01,
    regime: 'heavy_tbill_shadow_qe',
    policyNote: 'CARES Act Emergency Funding: Treasury prints $2.4T in short-term bills to deliver immediate stimulus checks.',
  },
  {
    date: '2021-Q4',
    year: 2021,
    quarter: 'Q4',
    tBillsOutstandingTrillionUsd: 3.75,
    couponsOutstandingTrillionUsd: 18.85,
    totalMarketableDebtTrillionUsd: 22.60,
    tBillSharePct: 16.59,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 32.1,
    estimatedTermPremiumSuppressionBps: -5,
    tenYearYield: 1.52,
    onRrpBalanceTrillionUsd: 1.90,
    regime: 'tbac_neutral_balance',
    policyNote: 'Treasury normalizes bill share toward 16.6%; cash deluge drives Money Market Funds into Fed ON RRP ($1.9T).',
  },
  {
    date: '2022-Q4',
    year: 2022,
    quarter: 'Q4',
    tBillsOutstandingTrillionUsd: 3.95,
    couponsOutstandingTrillionUsd: 20.25,
    totalMarketableDebtTrillionUsd: 24.20,
    tBillSharePct: 16.32,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 34.0,
    estimatedTermPremiumSuppressionBps: -4,
    tenYearYield: 3.88,
    onRrpBalanceTrillionUsd: 2.55,
    regime: 'tbac_neutral_balance',
    policyNote: 'Peak ON RRP ($2.55T): Money markets park excess cash at the Fed overnight; coupon auctions expand.',
  },
  {
    date: '2023-Q3',
    year: 2023,
    quarter: 'Q3',
    tBillsOutstandingTrillionUsd: 4.85,
    couponsOutstandingTrillionUsd: 21.05,
    totalMarketableDebtTrillionUsd: 25.90,
    tBillSharePct: 18.73,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 62.0,
    estimatedTermPremiumSuppressionBps: -18,
    tenYearYield: 4.59,
    onRrpBalanceTrillionUsd: 1.45,
    regime: 'heavy_tbill_shadow_qe',
    policyNote: 'August 2023 Refunding Shock: 10Y yields surge toward 5%; Treasury signals impending pivot to bills.',
  },
  {
    date: '2023-Q4',
    year: 2023,
    quarter: 'Q4',
    tBillsOutstandingTrillionUsd: 5.68,
    couponsOutstandingTrillionUsd: 21.22,
    totalMarketableDebtTrillionUsd: 26.90,
    tBillSharePct: 21.12,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 68.5,
    estimatedTermPremiumSuppressionBps: -42,
    tenYearYield: 3.88,
    onRrpBalanceTrillionUsd: 0.85,
    regime: 'heavy_tbill_shadow_qe',
    policyNote:
      'The "Yellen Pivot": Treasury frontloads 68% of gross issuance into T-Bills, pulling $600B out of ON RRP and cooling 10Y yield from 5.02% to 3.88%.',
  },
  {
    date: '2024-Q2',
    year: 2024,
    quarter: 'Q2',
    tBillsOutstandingTrillionUsd: 5.92,
    couponsOutstandingTrillionUsd: 21.58,
    totalMarketableDebtTrillionUsd: 27.50,
    tBillSharePct: 21.53,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 65.0,
    estimatedTermPremiumSuppressionBps: -38,
    tenYearYield: 4.36,
    onRrpBalanceTrillionUsd: 0.42,
    regime: 'heavy_tbill_shadow_qe',
    policyNote:
      'Sustained Shadow QE: T-Bills remain above TBAC 20% cap; RRP falls under $500B as MMFs absorb short-end paper.',
  },
  {
    date: '2024-Q4',
    year: 2024,
    quarter: 'Q4',
    tBillsOutstandingTrillionUsd: 6.02,
    couponsOutstandingTrillionUsd: 21.98,
    totalMarketableDebtTrillionUsd: 28.00,
    tBillSharePct: 21.50,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 64.0,
    estimatedTermPremiumSuppressionBps: -35,
    tenYearYield: 4.18,
    onRrpBalanceTrillionUsd: 0.22,
    regime: 'heavy_tbill_shadow_qe',
    policyNote:
      'RRP buffer approaches depletion (<$250B): TBAC flags that bill reliance must moderate to avoid commercial bank reserve drainage.',
  },
  {
    date: '2025-Q2',
    year: 2025,
    quarter: 'Q2',
    tBillsOutstandingTrillionUsd: 6.06,
    couponsOutstandingTrillionUsd: 22.04,
    totalMarketableDebtTrillionUsd: 28.10,
    tBillSharePct: 21.57,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 64.5,
    estimatedTermPremiumSuppressionBps: -34,
    tenYearYield: 4.12,
    onRrpBalanceTrillionUsd: 0.16,
    regime: 'heavy_tbill_shadow_qe',
    policyNote:
      'Term premium suppression calculated at -34 bps: Long yields stay insulated, but repo market sensitivity to bill issuance rises.',
  },
  {
    date: '2026-Q1',
    year: 2026,
    quarter: 'Q1',
    tBillsOutstandingTrillionUsd: 6.08,
    couponsOutstandingTrillionUsd: 22.12,
    totalMarketableDebtTrillionUsd: 28.20,
    tBillSharePct: 21.56,
    tbacTargetMinPct: 15.0,
    tbacTargetMaxPct: 20.0,
    grossIssuanceBillSharePct: 64.2,
    estimatedTermPremiumSuppressionBps: -34,
    tenYearYield: 4.08,
    onRrpBalanceTrillionUsd: 0.14,
    regime: 'heavy_tbill_shadow_qe',
    policyNote:
      'Current State: Marketable debt reaches $28.2T with 21.6% in bills. With ON RRP near $140B, future bill expansion will begin directly draining bank reserves.',
  },
];

/**
 * Overview statistics and regional benchmarks
 */
export const MONETARY_MECHANICS_OVERVIEW: MonetaryMechanicsOverview = {
  currentDate: '2026-Q1',
  latestUsVelocity: 1.368,
  usVelocityYoYDelta: 0.028,
  latestUsM2Trillion: 21.45,
  latestUsNominalGdpTrillion: 29.35,
  currentTBillSharePct: 21.56,
  tbacGuidelineRange: [15.0, 20.0],
  estimatedTermPremiumSuppressionBps: -34,
  onRrpBalanceBillion: 142.5,
  rrpDepletedRiskScore: 82,
  regions: REGIONAL_MONETARY_PROFILES,
  velocityHistory: HISTORICAL_VELOCITY_SERIES,
  issuanceHistory: HISTORICAL_TREASURY_ISSUANCE_SERIES,
};

/**
 * Returns latest evaluated state including active alerts and system diagnostics
 */
export function getLatestMonetaryMechanicsState(): EvaluatedMonetaryMechanicsState {
  return {
    timestamp: latestStatusRaw.timestamp,
    usVelocity: latestStatusRaw.metrics.usVelocity,
    usVelocityRegime: latestStatusRaw.metrics.usVelocityRegime as VelocityRegimeType,
    tBillSharePct: latestStatusRaw.metrics.tBillSharePct,
    issuanceRegime: (latestStatusRaw.metrics.tBillSharePct > 20.0
      ? 'heavy_tbill_shadow_qe'
      : latestStatusRaw.metrics.tBillSharePct < 15.0
        ? 'coupon_heavy_duration_shock'
        : 'tbac_neutral_balance') as IssuanceTiltRegime,
    termPremiumSuppressionBps: latestStatusRaw.metrics.estimatedTermPremiumSuppressionBps,
    activeAlerts: latestStatusRaw.activeAlerts as EvaluatedMonetaryMechanicsState['activeAlerts'],
  };
}

/**
 * Classifies velocity regimes into clear economic descriptions and styling
 */
export function getVelocityRegimeLabel(regime: VelocityRegimeType): {
  label: string;
  badgeClass: string;
  description: string;
} {
  switch (regime) {
    case 'qe_disinflation_trap':
      return {
        label: 'QE Disinflation Trap (2010s)',
        badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        description:
          'Base money expands dramatically via central bank asset purchases, but velocity collapses as reserves stay trapped on commercial bank balance sheets. Consumer CPI inflation fails to ignite.',
      };
    case 'stimulus_rebound':
      return {
        label: 'Fiscal Stimulus Rebound (2021-2023)',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        description:
          'Direct transfer payments bypass bank reserve hoarding and land in household accounts. Velocity accelerates from historic troughs, multiplying broad money and sparking rapid consumer inflation.',
      };
    case 'overheated_velocity':
      return {
        label: 'Overheated Velocity',
        badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        description:
          'Rapid money turnover exceeds productive supply capacity. Even if broad money supply contracts, accelerating velocity sustains elevated inflation expectations.',
      };
    case 'deflationary_stall':
      return {
        label: 'Deflationary Stall / Lockdown Shock',
        badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        description:
          'Sharp decline in economic transactions freezes monetary circulation. Money demand skyrockets into cash hoard equivalents, requiring aggressive liquidity backstops.',
      };
    case 'normalization':
    default:
      return {
        label: 'Monetary Normalization',
        badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        description:
          'Velocity stabilizes around historical trend (1.35-1.40 in the US), restoring classical relationship where GDP growth matches productive capacity expansion and steady monetary expansion.',
      };
  }
}

/**
 * Classifies Treasury issuance maturity profiles into actionable tiers
 */
export function getIssuanceRegimeLabel(regime: IssuanceTiltRegime): {
  label: string;
  badgeClass: string;
  description: string;
} {
  switch (regime) {
    case 'heavy_tbill_shadow_qe':
      return {
        label: 'Heavy T-Bill Tilt ("Shadow QE")',
        badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        description:
          'Short-term bills exceed the TBAC 20% cap. By withholding long duration coupon supply and drawing down ON RRP cash, the Treasury actively suppresses 10Y term premiums by 25 to 55+ bps.',
      };
    case 'coupon_heavy_duration_shock':
      return {
        label: 'Coupon-Heavy Duration Shock',
        badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        description:
          'Treasury tilts heavily into 10Y-30Y Notes and Bonds (<15% bills). Primary dealer absorption limits are tested, driving term premiums higher and sparking bond auction tail concessions.',
      };
    case 'tbac_neutral_balance':
    default:
      return {
        label: 'TBAC Neutral Target (15% - 20%)',
        badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        description:
          'Balanced issuance matching TBAC historical recommendations. Sufficient liquidity is maintained across both cash bills and duration coupons with minimal artificial yield distortion.',
      };
  }
}

export interface SimulationInputs {
  billSharePct: number; // 10% to 50%
  velocityDeltaPct: number; // -15% to +15%
  m2GrowthPct: number; // -10% to +25%
}

export interface SimulationResult {
  termPremiumSuppressionBps: number;
  implied10YYieldDeflectionBps: number;
  simulated10YYield: number;
  reserveDrainRiskScore: number; // 0 to 100
  reserveDrainPaceDescription: string;
  impliedNominalGdpGrowthPct: number;
  impliedCpiInflationPct: number;
  monetaryImpulseCategory: string;
  issuanceRegime: IssuanceTiltRegime;
  velocityRegime: VelocityRegimeType;
}

/**
 * Simulates the dual impacts of:
 * 1. Treasury debt maturity tilting (Shadow QE vs. Duration Shock)
 * 2. Equation of Exchange (M * V = P * Y) to compute implied inflation and GDP growth
 */
export function simulateMonetaryMechanics(inputs: SimulationInputs): SimulationResult {
  const { billSharePct, velocityDeltaPct, m2GrowthPct } = inputs;
  const base10YYield = 4.08;

  /*
   * TBAC benchmark recommends 15% to 20% in T-Bills.
   * Every 1% of total debt tilted into bills above 20% removes approximately $280B of duration supply,
   * depressing the 10Y term premium by ~2.2 bps when money market funds absorb it via RRP.
   * Conversely, when bill share drops below 15%, primary dealers must absorb excess coupon supply,
   * widening term premiums by ~2.5 bps per 1% deficit.
   */
  let termPremiumSuppressionBps = 0;
  if (billSharePct > 20.0) {
    termPremiumSuppressionBps = -Math.round((billSharePct - 20.0) * 2.2 * 10) / 10;
  } else if (billSharePct < 15.0) {
    termPremiumSuppressionBps = Math.round((15.0 - billSharePct) * 2.5 * 10) / 10;
  }

  const implied10YYieldDeflectionBps = termPremiumSuppressionBps;
  const simulated10YYield = Math.round((base10YYield + implied10YYieldDeflectionBps / 100) * 100) / 100;

  /*
   * Evaluate reserve drain risk score (0 to 100):
   * With ON RRP near $140B, high bill share (>22%) forces money market funds to draw cash from
   * commercial bank deposits once RRP hits zero, creating liquidity stress in fed funds & repo.
   */
  let reserveDrainRiskScore = Math.round(Math.min(100, Math.max(10, (billSharePct / 25) * 80)));
  let reserveDrainPaceDescription = 'Benign: ON RRP and money funds absorb issuance without straining commercial bank reserves.';
  if (billSharePct >= 25.0) {
    reserveDrainRiskScore = Math.min(100, 85 + Math.round((billSharePct - 25) * 3));
    reserveDrainPaceDescription = 'Critical: ON RRP buffer exhausted; bill auctions drain bank reserves directly, tightening financial conditions.';
  } else if (billSharePct > 20.0) {
    reserveDrainRiskScore = Math.round(60 + (billSharePct - 20) * 5);
    reserveDrainPaceDescription = 'Elevated: Approaching RRP exhaustion; primary dealers rely increasingly on bank cash.';
  }

  /*
   * Equation of Exchange: (1 + g_M) * (1 + g_V) = 1 + g_NominalGDP
   * Assuming real potential GDP growth rate is ~2.0% (trend potential):
   * Implied CPI Inflation = Implied Nominal GDP Growth - Real Potential GDP
   */
  const mFactor = 1 + m2GrowthPct / 100;
  const vFactor = 1 + velocityDeltaPct / 100;
  const nominalGdpFactor = mFactor * vFactor;
  const impliedNominalGdpGrowthPct = Math.round((nominalGdpFactor - 1) * 1000) / 10;

  const realTrendGrowth = 2.0;
  const impliedCpiInflationPct = Math.round(Math.max(-4.0, impliedNominalGdpGrowthPct - realTrendGrowth) * 10) / 10;

  let monetaryImpulseCategory = 'Balanced Growth';
  if (impliedCpiInflationPct > 5.0) {
    monetaryImpulseCategory = 'High Inflationary Surge';
  } else if (impliedCpiInflationPct > 3.0) {
    monetaryImpulseCategory = 'Reflationary Acceleration';
  } else if (impliedCpiInflationPct < 0.0) {
    monetaryImpulseCategory = 'Deflationary Contraction';
  } else if (impliedNominalGdpGrowthPct > 4.5 && impliedCpiInflationPct <= 2.5) {
    monetaryImpulseCategory = 'Goldilocks Expansion';
  }

  let issuanceRegime: IssuanceTiltRegime = 'tbac_neutral_balance';
  if (billSharePct > 20.0) {
    issuanceRegime = 'heavy_tbill_shadow_qe';
  } else if (billSharePct < 15.0) {
    issuanceRegime = 'coupon_heavy_duration_shock';
  }

  let velocityRegime: VelocityRegimeType = 'normalization';
  if (m2GrowthPct >= 6.0 && velocityDeltaPct <= -3.0) {
    velocityRegime = 'qe_disinflation_trap';
  } else if (velocityDeltaPct > 5.0) {
    velocityRegime = 'overheated_velocity';
  } else if (m2GrowthPct > 5.0 && velocityDeltaPct > 2.0) {
    velocityRegime = 'stimulus_rebound';
  } else if (impliedNominalGdpGrowthPct < 0) {
    velocityRegime = 'deflationary_stall';
  }

  return {
    termPremiumSuppressionBps,
    implied10YYieldDeflectionBps,
    simulated10YYield,
    reserveDrainRiskScore,
    reserveDrainPaceDescription,
    impliedNominalGdpGrowthPct,
    impliedCpiInflationPct,
    monetaryImpulseCategory,
    issuanceRegime,
    velocityRegime,
  };
}
