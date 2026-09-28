/**
 * Global Central Bank Liquidity Radar Data & Analytics Engine
 *
 * Tracks the "Big 4" monetary authorities:
 * - Federal Reserve (Fed, United States)
 * - European Central Bank (ECB, Eurozone)
 * - People's Bank of China (PBOC, China)
 * - Bank of Japan (BOJ, Japan)
 *
 * Rationale:
 * Total aggregate fiat liquidity ($25T+ across the Big 4) and US Net Liquidity
 * (Fed Assets - TGA - Reverse Repo) are the single highest-correlation macro drivers
 * of global asset prices (equities, real estate, commodities, and digital assets).
 * Changes in central bank balance sheets typically lead risk asset price action
 * by 4 to 8 weeks.
 */

export interface CentralBankProfile {
  id: 'fed' | 'ecb' | 'pboc' | 'boj';
  name: string;
  shortName: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  assetsUsdTrillion: number;
  assetsLocalTrillion: number;
  policyRate: number; // in percent
  rateDescription: string;
  policyStance: 'easing' | 'neutral' | 'tightening';
  balanceSheetTrajectory: 'expanding' | 'flat' | 'shrinking';
  monthlyRunoffRateUsdBillions: number; // Quantitative tightening or easing pace (+/-)
  headlineProgram: string;
  nextMeetingDate: string;
  summary: string;
  transmissionMechanism: string;
  color: string;
}

export interface UsNetLiquidityBreakdown {
  fedTotalAssetsTrillion: number;
  tgaBalanceTrillion: number; // Treasury General Account (cash drain from private banks)
  reverseRepoTrillion: number; // Overnight Reverse Repo / ON RRP (parked liquidity)
  usNetLiquidityTrillion: number; // Assets - TGA - ON RRP
  bankReservesTrillion: number;
}

export interface LiquidityHistoricalPoint {
  date: string; // e.g. "2020-01", "2021-06", "2026-03"
  label: string;
  fedAssetsUsd: number;
  ecbAssetsUsd: number;
  pbocAssetsUsd: number;
  bojAssetsUsd: number;
  totalBig4Usd: number;
  usNetLiquidityUsd: number;
  // Normalized asset benchmarks (100 baseline at start of period)
  sp500Price: number;
  bitcoinPrice: number;
  goldPriceUsd: number;
  impulse30dPercent: number; // Annualized rate-of-change
  regime: 'expansion' | 'neutral' | 'contraction';
}

export interface AssetCorrelationLeadLag {
  assetName: string;
  correlationCoeff: number; // Pearson r (0 to 1)
  averageLagWeeks: number; // Historical lead time of liquidity impulse
  sensitivityBeta: number; // % move in asset per 1% change in Global Liquidity
  commentary: string;
}

export const CENTRAL_BANK_PROFILES: CentralBankProfile[] = [
  {
    id: 'fed',
    name: 'Federal Reserve',
    shortName: 'Fed',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    assetsUsdTrillion: 6.82,
    assetsLocalTrillion: 6.82,
    policyRate: 4.375, // midpoint of 4.25%-4.50% corridor
    rateDescription: 'Fed Funds Target Range (4.25% - 4.50%)',
    policyStance: 'tightening',
    balanceSheetTrajectory: 'shrinking',
    monthlyRunoffRateUsdBillions: -60.0, // Cap on Treasuries + MBS passive redemption
    headlineProgram: 'Quantitative Tightening (QT)',
    nextMeetingDate: 'May 6, 2026',
    summary:
      'The Fed continues passive balance sheet roll-off while monitoring bank reserve sufficiency above the Lowest Comfortable Level of Reserves (LCLOR).',
    transmissionMechanism:
      'Treasury balances (TGA) and Reverse Repo (ON RRP) fluctuations dictate dollar liquidity availability in global shadow banking and repo markets.',
    color: '#0284c7', // Sky Blue
  },
  {
    id: 'ecb',
    name: 'European Central Bank',
    shortName: 'ECB',
    flag: '🇪🇺',
    currencyCode: 'EUR',
    currencySymbol: '€',
    assetsUsdTrillion: 6.94,
    assetsLocalTrillion: 6.37, // €6.37T at ~1.09 EUR/USD
    policyRate: 2.65,
    rateDescription: 'Deposit Facility Rate (2.65%)',
    policyStance: 'neutral',
    balanceSheetTrajectory: 'shrinking',
    monthlyRunoffRateUsdBillions: -38.0,
    headlineProgram: 'PEPP & APP Passive Run-off',
    nextMeetingDate: 'April 30, 2026',
    summary:
      'The ECB is normalizing its pandemic asset purchases (PEPP) while keeping the Transmission Protection Instrument (TPI) on standby to prevent sovereign spread blowout.',
    transmissionMechanism:
      'Directly influences Eurozone corporate lending conditions and sovereign yield differentials between German Bunds and Southern European BTPs.',
    color: '#818cf8', // Indigo
  },
  {
    id: 'pboc',
    name: 'People’s Bank of China',
    shortName: 'PBOC',
    flag: '🇨🇳',
    currencyCode: 'CNY',
    currencySymbol: '¥',
    assetsUsdTrillion: 6.25,
    assetsLocalTrillion: 45.1, // ¥45.1T at ~7.21 CNY/USD
    policyRate: 1.50,
    rateDescription: '7-Day Reverse Repo Rate (1.50%)',
    policyStance: 'easing',
    balanceSheetTrajectory: 'expanding',
    monthlyRunoffRateUsdBillions: 45.0, // Active monthly net injection
    headlineProgram: 'Targeted RRR Cuts & Sovereign Bond Operations',
    nextMeetingDate: 'April 20, 2026 (LPR Fix)',
    summary:
      'China is aggressively countering domestic property deflation and local government debt restructuring through targeted liquidity injections and secondary bond buying.',
    transmissionMechanism:
      'Liquidity feeds directly into state-owned commercial bank credit quotas, stimulating global industrial commodities and manufacturing supply chains.',
    color: '#f43f5e', // Rose
  },
  {
    id: 'boj',
    name: 'Bank of Japan',
    shortName: 'BOJ',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    assetsUsdTrillion: 5.02,
    assetsLocalTrillion: 752.0, // ¥752T at ~150 JPY/USD
    policyRate: 0.50,
    rateDescription: 'Uncollateralized Overnight Call Rate (0.50%)',
    policyStance: 'tightening',
    balanceSheetTrajectory: 'flat',
    monthlyRunoffRateUsdBillions: -15.0,
    headlineProgram: 'YCC Sunset & JGB Purchase Tapering',
    nextMeetingDate: 'April 28, 2026',
    summary:
      'After decades of negative rates, the BOJ is gradually dialing back its colossal JGB footprint, triggering global yen carry trade unwinding waves.',
    transmissionMechanism:
      'The Japanese Yen is the primary global funding currency for cross-border carry trades; BOJ rate shifts reverberate through US Treasuries and global equities.',
    color: '#10b981', // Emerald
  },
];

export const CURRENT_US_NET_LIQUIDITY: UsNetLiquidityBreakdown = {
  fedTotalAssetsTrillion: 6.82,
  tgaBalanceTrillion: 0.82,
  reverseRepoTrillion: 0.28,
  usNetLiquidityTrillion: 5.72, // 6.82 - 0.82 - 0.28
  bankReservesTrillion: 3.25,
};

/*
 * Monthly historical liquidity time series (2020 - 2026)
 * Maps major inflection points: March 2020 COVID QE bazooka, 2021 liquidity peak,
 * 2022 QT tightening shock, 2023 SVB BTFP injection, 2024 PBOC stimulus pivot, and 2026 current conditions.
 */
export const GLOBAL_LIQUIDITY_HISTORY: LiquidityHistoricalPoint[] = [
  {
    date: '2020-01',
    label: 'Jan 2020 (Pre-COVID)',
    fedAssetsUsd: 4.17,
    ecbAssetsUsd: 5.25,
    pbocAssetsUsd: 5.22,
    bojAssetsUsd: 5.31,
    totalBig4Usd: 19.95,
    usNetLiquidityUsd: 3.75,
    sp500Price: 3225,
    bitcoinPrice: 7200,
    goldPriceUsd: 1520,
    impulse30dPercent: 2.1,
    regime: 'neutral',
  },
  {
    date: '2020-06',
    label: 'Jun 2020 (QE Bazooka)',
    fedAssetsUsd: 7.08,
    ecbAssetsUsd: 7.02,
    pbocAssetsUsd: 5.18,
    bojAssetsUsd: 6.12,
    totalBig4Usd: 25.40,
    usNetLiquidityUsd: 5.42,
    sp500Price: 3100,
    bitcoinPrice: 9140,
    goldPriceUsd: 1770,
    impulse30dPercent: 27.5,
    regime: 'expansion',
  },
  {
    date: '2020-12',
    label: 'Dec 2020 (Stimulus Wave)',
    fedAssetsUsd: 7.36,
    ecbAssetsUsd: 8.52,
    pbocAssetsUsd: 5.85,
    bojAssetsUsd: 6.78,
    totalBig4Usd: 28.51,
    usNetLiquidityUsd: 5.65,
    sp500Price: 3756,
    bitcoinPrice: 28990,
    goldPriceUsd: 1898,
    impulse30dPercent: 12.2,
    regime: 'expansion',
  },
  {
    date: '2021-06',
    label: 'Jun 2021 (Peak Global Liquidity)',
    fedAssetsUsd: 8.08,
    ecbAssetsUsd: 9.38,
    pbocAssetsUsd: 5.92,
    bojAssetsUsd: 6.55,
    totalBig4Usd: 29.93,
    usNetLiquidityUsd: 6.12,
    sp500Price: 4297,
    bitcoinPrice: 35040,
    goldPriceUsd: 1770,
    impulse30dPercent: 5.0,
    regime: 'expansion',
  },
  {
    date: '2021-11',
    label: 'Nov 2021 (All-Time Asset Highs)',
    fedAssetsUsd: 8.67,
    ecbAssetsUsd: 9.61,
    pbocAssetsUsd: 6.15,
    bojAssetsUsd: 6.42,
    totalBig4Usd: 30.85,
    usNetLiquidityUsd: 6.45,
    sp500Price: 4697,
    bitcoinPrice: 64800,
    goldPriceUsd: 1826,
    impulse30dPercent: 3.1,
    regime: 'neutral',
  },
  {
    date: '2022-06',
    label: 'Jun 2022 (Aggressive QT Begins)',
    fedAssetsUsd: 8.91,
    ecbAssetsUsd: 9.24,
    pbocAssetsUsd: 5.88,
    bojAssetsUsd: 5.45,
    totalBig4Usd: 29.48,
    usNetLiquidityUsd: 5.95,
    sp500Price: 3785,
    bitcoinPrice: 19900,
    goldPriceUsd: 1807,
    impulse30dPercent: -4.4,
    regime: 'contraction',
  },
  {
    date: '2022-10',
    label: 'Oct 2022 (Market Bottom / Peak Drain)',
    fedAssetsUsd: 8.78,
    ecbAssetsUsd: 8.65,
    pbocAssetsUsd: 5.68,
    bojAssetsUsd: 4.88,
    totalBig4Usd: 27.99,
    usNetLiquidityUsd: 5.48,
    sp500Price: 3583,
    bitcoinPrice: 19200,
    goldPriceUsd: 1633,
    impulse30dPercent: -5.1,
    regime: 'contraction',
  },
  {
    date: '2023-03',
    label: 'Mar 2023 (SVB Crisis & Fed BTFP)',
    fedAssetsUsd: 8.73,
    ecbAssetsUsd: 8.35,
    pbocAssetsUsd: 6.05,
    bojAssetsUsd: 5.52,
    totalBig4Usd: 28.65,
    usNetLiquidityUsd: 5.88,
    sp500Price: 4109,
    bitcoinPrice: 28400,
    goldPriceUsd: 1969,
    impulse30dPercent: 2.4,
    regime: 'neutral',
  },
  {
    date: '2023-12',
    label: 'Dec 2023 (RRP Draining Tailwinds)',
    fedAssetsUsd: 7.71,
    ecbAssetsUsd: 7.55,
    pbocAssetsUsd: 6.32,
    bojAssetsUsd: 5.35,
    totalBig4Usd: 26.93,
    usNetLiquidityUsd: 6.05,
    sp500Price: 4769,
    bitcoinPrice: 42200,
    goldPriceUsd: 2062,
    impulse30dPercent: 1.8,
    regime: 'neutral',
  },
  {
    date: '2024-09',
    label: 'Sep 2024 (Global Easing Cycle Launch)',
    fedAssetsUsd: 7.15,
    ecbAssetsUsd: 7.12,
    pbocAssetsUsd: 6.18,
    bojAssetsUsd: 5.12,
    totalBig4Usd: 25.57,
    usNetLiquidityUsd: 5.82,
    sp500Price: 5751,
    bitcoinPrice: 63300,
    goldPriceUsd: 2658,
    impulse30dPercent: 2.2,
    regime: 'neutral',
  },
  {
    date: '2025-06',
    label: 'Jun 2025 (China Fiscal Bazooka)',
    fedAssetsUsd: 6.95,
    ecbAssetsUsd: 7.01,
    pbocAssetsUsd: 6.22,
    bojAssetsUsd: 5.08,
    totalBig4Usd: 25.26,
    usNetLiquidityUsd: 5.75,
    sp500Price: 5920,
    bitcoinPrice: 71200,
    goldPriceUsd: 2715,
    impulse30dPercent: 3.1,
    regime: 'neutral',
  },
  {
    date: '2026-03',
    label: 'Current 2026 (Radar Baseline)',
    fedAssetsUsd: 6.82,
    ecbAssetsUsd: 6.94,
    pbocAssetsUsd: 6.25,
    bojAssetsUsd: 5.02,
    totalBig4Usd: 25.03,
    usNetLiquidityUsd: 5.72,
    sp500Price: 5864,
    bitcoinPrice: 68450,
    goldPriceUsd: 2742,
    impulse30dPercent: 3.4,
    regime: 'expansion',
  },
];

export const ASSET_LIQUIDITY_CORRELATIONS: AssetCorrelationLeadLag[] = [
  {
    assetName: 'Bitcoin (BTC)',
    correlationCoeff: 0.88,
    averageLagWeeks: 4,
    sensitivityBeta: 2.8,
    commentary:
      'The pure liquidity canary. Because Bitcoin has no sovereign cash flows, sovereign credit ratings, or price-to-earnings anchor, it responds almost instantly as high-beta global fiat debasement insurance.',
  },
  {
    assetName: 'S&P 500 Equities',
    correlationCoeff: 0.82,
    averageLagWeeks: 6,
    sensitivityBeta: 1.1,
    commentary:
      'Corporate earnings set the long-run baseline, but multiples (P/E) expand and contract in lockstep with the US Net Liquidity metric. Dips in Fed Net Liquidity reliably precede 5%-10% equity corrections.',
  },
  {
    assetName: 'Gold (XAU)',
    correlationCoeff: 0.76,
    averageLagWeeks: 8,
    sensitivityBeta: 0.9,
    commentary:
      'Physical gold moves with negative real yields and global central bank balance sheet expansion. Sovereign central banks themselves have accumulated record gold reserves since 2022 to diversify out of G7 fiat debt.',
  },
];

/**
 * Calculates current aggregate liquidity statistics, 30-day and 90-day momentum,
 * and the prevailing monetary regime across the Big 4 central banks.
 */
export function getCentralBankLiquiditySummary() {
  const current = GLOBAL_LIQUIDITY_HISTORY[GLOBAL_LIQUIDITY_HISTORY.length - 1];
  const prevPoint = GLOBAL_LIQUIDITY_HISTORY[GLOBAL_LIQUIDITY_HISTORY.length - 2];

  const totalLiquidityUsd = current.totalBig4Usd;
  const netLiquidityChangeUsd = Number((current.totalBig4Usd - prevPoint.totalBig4Usd).toFixed(2));
  const usNetLiquidity = current.usNetLiquidityUsd;
  const impulseAnnualized = current.impulse30dPercent;

  let regimeLabel: string;
  let regimeColor: 'emerald' | 'amber' | 'rose';
  let regimeDescription: string;

  if (impulseAnnualized > 2.5) {
    regimeLabel = 'Liquidity Expansion (Tailwind)';
    regimeColor = 'emerald';
    regimeDescription =
      'Aggregate central bank balance sheets are expanding net of sterilizations. Financial conditions are easing, providing constructive tailwinds for risk assets and credit markets.';
  } else if (impulseAnnualized >= -1.0) {
    regimeLabel = 'Neutral Drift (Selective)';
    regimeColor = 'amber';
    regimeDescription =
      'Central bank liquidity is broadly flat. Asset performance is dictated primarily by organic earnings and idiosyncratic macro events rather than monetary injections.';
  } else {
    regimeLabel = 'Liquidity Contraction (Headwind)';
    regimeColor = 'rose';
    regimeDescription =
      'Central banks are actively draining reserves or sterilizing collateral. Heightened volatility and refinancing friction across corporate credit and equities.';
  }

  return {
    totalLiquidityUsd,
    netLiquidityChangeUsd,
    usNetLiquidity,
    impulseAnnualized,
    regimeLabel,
    regimeColor,
    regimeDescription,
  };
}
