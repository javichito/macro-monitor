/*
 * Canonical Data Model & Econometric Engine for Bond Market Volatility & Collateral Plumbing
 *
 * Implements telemetry for the ICE BofA MOVE Index (implied Treasury volatility),
 * the VIX & equity volatility term structure, the VIX/MOVE cross-market complacency ratio,
 * and global sovereign collateral mechanics (repo spreads, dealer haircuts, collateral velocity).
 */

import {
  BondVolatilityRegionId,
  MoveStressLevel,
  VixMoveRegime,
  EquityVolTermStructurePoint,
  HistoricalCrisisCase,
  RegionalCollateralProfile,
  HistoricalBondVolatilityPoint,
  BondVolatilityOverview,
  EvaluatedBondVolatilityState,
} from '../lib/types';
import latestVolatilityStatusRaw from './latest-volatility-status.json';

/**
 * Classifies ICE BofA MOVE Index readings into operational stress tiers.
 * Primary dealer balance sheet capacity contracts sharply once MOVE crosses 120,
 * while levels above 140 historically necessitate emergency central bank repo interventions.
 */
export function getMoveStressLabel(move: number): {
  level: MoveStressLevel;
  label: string;
  color: string;
  badgeClass: string;
  description: string;
} {
  if (move < 80) {
    return {
      level: 'compressed',
      label: 'Ultra Low / Benign',
      color: '#10b981',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      description: 'Sovereign bond options price negligible interest rate volatility. Collateral velocity is frictionless and repo haircuts remain at floor levels.',
    };
  }
  if (move < 105) {
    return {
      level: 'normal',
      label: 'Normal / Rangebound',
      color: '#0ea5e9',
      badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      description: 'Healthy Treasury market liquidity with standard dealer intermediation and stable primary dealer repo financing spreads.',
    };
  }
  if (move < 120) {
    return {
      level: 'elevated',
      label: 'Elevated Stress',
      color: '#f59e0b',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      description: 'Heightened rate path uncertainty. Repo desks begin tightening financing terms on relative-value cash-futures basis trades.',
    };
  }
  if (move < 140) {
    return {
      level: 'severe',
      label: 'Severe Illiquidity (>120)',
      color: '#f97316',
      badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      description: 'Critical liquidity strain. Dealer VaR limits trigger forced balance sheet reductions, widening secondary Treasury bid-ask spreads.',
    };
  }
  return {
    level: 'crisis',
    label: 'Systemic Crisis (>140)',
    color: '#ef4444',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    description: 'Acute sovereign collateral dislocation. Disrupted repo mechanics threaten foundational debt rollover (e.g. March 2020 basis crisis or 2022 UK Gilt crisis).',
  };
}

/**
 * Evaluates the VIX/MOVE ratio to detect cross-asset complacency divergences.
 * Equity markets often trade under an illusion of calm (suppressed VIX) while Treasury markets
 * experience severe turbulence, signaling impending equity multiple compression or margin contagion.
 */
export function getVixMoveRegimeLabel(
  vix: number,
  move: number
): {
  regime: VixMoveRegime;
  scaledRatio: number;
  rawRatio: number;
  label: string;
  color: string;
  badgeClass: string;
  description: string;
  complacencyRisk: 'EXTREME' | 'HIGH' | 'BALANCED' | 'EQUITY_PANIC';
} {
  const rawRatio = Number((vix / move).toFixed(3));
  const scaledRatio = Number(((vix / move) * 10).toFixed(2));

  if (scaledRatio < 1.20) {
    return {
      regime: 'extreme_complacency',
      scaledRatio,
      rawRatio,
      label: 'Dangerous Equity Complacency',
      color: '#ef4444',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      description: 'Equities completely ignore deep bond market collateral friction. Historically, such extreme divergence precedes sharp equity drawdowns.',
      complacencyRisk: 'EXTREME',
    };
  }
  if (scaledRatio < 1.55) {
    return {
      regime: 'moderate_complacency',
      scaledRatio,
      rawRatio,
      label: 'Moderate Complacency',
      color: '#f59e0b',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      description: 'Bond volatility is pacing significantly ahead of equity option pricing, warranting tactical risk reduction in high-beta equities.',
      complacencyRisk: 'HIGH',
    };
  }
  if (scaledRatio < 2.20) {
    return {
      regime: 'balanced',
      scaledRatio,
      rawRatio,
      label: 'Balanced Cross-Asset Pricing',
      color: '#10b981',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      description: 'Normal equilibrium between sovereign debt uncertainty and corporate equity risk premiums.',
      complacencyRisk: 'BALANCED',
    };
  }
  return {
    regime: 'systemic_panic',
    scaledRatio,
    rawRatio,
    label: 'Equity Fear / Sovereign Refuge',
    color: '#0ea5e9',
    badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    description: 'Equities sell off violently while sovereign debt acts as a pristine flight-to-safety collateral haven.',
    complacencyRisk: 'EQUITY_PANIC',
  };
}

/**
 * Calculates a consolidated 0-100 Collateral Plumbing Health Score.
 * Penalizes spikes in bond volatility, widening repo spreads vs policy rates, and elevated haircuts.
 */
export function calculateCollateralHealthScore(
  move: number,
  repoSpreadBps: number,
  haircutPct: number
): number {
  let score = 100;

  // Move index penalty: baseline tranquil level is 75
  if (move > 75) {
    score -= Math.min(45, (move - 75) * 0.6);
  }

  // Repo spread penalty: widening spread signals bank balance sheet friction
  const absSpread = Math.abs(repoSpreadBps);
  if (absSpread > 10) {
    score -= Math.min(25, (absSpread - 10) * 0.8);
  }

  // Haircut penalty: base haircut is 1.5-2.0%
  if (haircutPct > 2.0) {
    score -= Math.min(30, (haircutPct - 2.0) * 7.5);
  }

  return Math.max(10, Math.min(100, Number(score.toFixed(1))));
}

/**
 * Returns latest evaluated state from synced JSON telemetry.
 */
export function getLatestBondVolatilityState(): EvaluatedBondVolatilityState {
  return latestVolatilityStatusRaw as EvaluatedBondVolatilityState;
}

// -----------------------------------------------------------------------------
// Regional Sovereign Collateral Profiles
// -----------------------------------------------------------------------------

export const REGIONAL_COLLATERAL_PROFILES: Record<BondVolatilityRegionId, RegionalCollateralProfile> = {
  GLOBAL: {
    regionId: 'GLOBAL',
    name: 'Global Sovereign Aggregate',
    sovereignBondBenchmark: 'Global Weighted Sovereign Index',
    sovereignVolIndex: 101.3,
    volatilityLabel: 'Moderate Global Stress',
    repoRatePct: 4.15,
    policyRatePct: 4.03,
    repoSpreadBps: 12,
    primaryDealerHaircutPct: 2.5,
    collateralVelocityMultiplier: 1.9,
    collateralScarcityBps: 6,
    failsToDeliverBillion: 145.0,
    healthScore: 74.2,
    stressLevel: 'normal',
    keyVulnerabilityNote:
      'Cross-border rehypothecation friction: differing clearinghouse margin rules and FX basis swaps restrict seamless collateral mobility between New York, London, Frankfurt, and Tokyo.',
  },
  USA: {
    regionId: 'USA',
    name: 'United States (US Treasuries)',
    sovereignBondBenchmark: 'ICE BofA MOVE Index',
    sovereignVolIndex: 108.5,
    volatilityLabel: 'Elevated Treasury Volatility',
    repoRatePct: 4.88,
    policyRatePct: 4.80,
    repoSpreadBps: 8,
    primaryDealerHaircutPct: 2.0,
    collateralVelocityMultiplier: 2.1,
    collateralScarcityBps: 2,
    failsToDeliverBillion: 64.2,
    healthScore: 76.0,
    stressLevel: 'elevated',
    keyVulnerabilityNote:
      'The $28T Treasury cash-futures basis trade: hedge funds utilize 30x-50x repo leverage to arbitrage minor basis discrepancies. Spikes in MOVE over 120 force dealer haircut increases and rapid basis liquidations.',
  },
  EUR: {
    regionId: 'EUR',
    name: 'Eurozone (German Bunds & OATs)',
    sovereignBondBenchmark: 'EuroMOVE Sovereign Proxy',
    sovereignVolIndex: 84.2,
    volatilityLabel: 'Contained / Bund Specialness',
    repoRatePct: 3.07,
    policyRatePct: 3.25,
    repoSpreadBps: -18,
    primaryDealerHaircutPct: 2.0,
    collateralVelocityMultiplier: 1.8,
    collateralScarcityBps: 18,
    failsToDeliverBillion: 38.5,
    healthScore: 82.0,
    stressLevel: 'normal',
    keyVulnerabilityNote:
      'Severe collateral scarcity (specialness): AAA German Bund repo trades significantly below ESTER because commercial banks and CCPs hoard pristine Bund paper to meet European regulatory liquidity quotas.',
  },
  GBR: {
    regionId: 'GBR',
    name: 'United Kingdom (UK Gilts)',
    sovereignBondBenchmark: 'UK Gilt Implied Volatility Index',
    sovereignVolIndex: 114.5,
    volatilityLabel: 'Elevated Gilt Sensitivity',
    repoRatePct: 4.89,
    policyRatePct: 4.75,
    repoSpreadBps: 14,
    primaryDealerHaircutPct: 3.0,
    collateralVelocityMultiplier: 1.6,
    collateralScarcityBps: 4,
    failsToDeliverBillion: 18.2,
    healthScore: 68.0,
    stressLevel: 'elevated',
    keyVulnerabilityNote:
      'LDI (Liability-Driven Investment) pension sensitivity: Defined-benefit pensions hold levered derivative overlay portfolios. When 30Y Gilt yields spike rapidly, margin calls require immediate cash liquidity, risking recursive Gilt selling.',
  },
  JPN: {
    regionId: 'JPN',
    name: 'Japan (JGBs & BOJ Policy)',
    sovereignBondBenchmark: 'JGB Volatility Index',
    sovereignVolIndex: 78.6,
    volatilityLabel: 'Tranquil / BOJ Transition',
    repoRatePct: 0.31,
    policyRatePct: 0.25,
    repoSpreadBps: 6,
    primaryDealerHaircutPct: 1.5,
    collateralVelocityMultiplier: 1.4,
    collateralScarcityBps: 8,
    failsToDeliverBillion: 28.1,
    healthScore: 85.0,
    stressLevel: 'compressed',
    keyVulnerabilityNote:
      'Bank of Japan YCC exit & cross-currency basis: As the BOJ normalizes rates away from zero, yen repo markets re-awaken, tightening dollar funding premiums paid by Japanese institutional life insurers.',
  },
};

// -----------------------------------------------------------------------------
// Equity Volatility Term Structure
// -----------------------------------------------------------------------------

export const EQUITY_VOL_TERM_STRUCTURE: EquityVolTermStructurePoint[] = [
  {
    tenor: '9D',
    label: '9-Day Short-Dated',
    symbol: 'VIX9D',
    value: 13.9,
    impliedDailyMovePct: 0.87,
    regime: 'contango',
  },
  {
    tenor: '30D',
    label: '30-Day Benchmark',
    symbol: 'VIX',
    value: 15.8,
    impliedDailyMovePct: 0.99,
    regime: 'contango',
  },
  {
    tenor: '3M',
    label: '3-Month Forward',
    symbol: 'VIX3M',
    value: 17.2,
    impliedDailyMovePct: 1.08,
    regime: 'contango',
  },
  {
    tenor: '6M',
    label: '6-Month Mid-Curve',
    symbol: 'VIX6M',
    value: 18.5,
    impliedDailyMovePct: 1.16,
    regime: 'contango',
  },
  {
    tenor: '1Y',
    label: '1-Year Long-Dated',
    symbol: 'VIX1Y',
    value: 19.8,
    impliedDailyMovePct: 1.24,
    regime: 'contango',
  },
];

// -----------------------------------------------------------------------------
// Historical Crisis Case Studies
// -----------------------------------------------------------------------------

export const HISTORICAL_CRISIS_CASES: HistoricalCrisisCase[] = [
  {
    id: 'march-2020-basis',
    title: 'March 2020 US Treasury Basis Dislocation',
    date: 'March 2020',
    peakMove: 163.7,
    peakVix: 82.7,
    vixMoveRatio: 5.05,
    summary:
      'Hedge funds holding highly levered Treasury cash-futures basis positions faced catastrophic margin calls as futures and cash prices decoupled, sparking forced liquidations in the world’s benchmark collateral.',
    collateralMechanism:
      'Primary dealers reached regulatory balance sheet capacity and stopped absorbing Treasury selling. Bid-ask spreads on 30-year Treasuries blew out by over 1000%, and Treasury market liquidity completely evaporated.',
    policyIntervention:
      'The Federal Reserve initiated unlimited Quantitative Easing (purchasing over $1M of Treasuries per minute), established emergency repo lines exceeding $1T, and temporarily exempted Treasuries from the Supplementary Leverage Ratio (SLR).',
  },
  {
    id: 'sept-2022-gilt-crisis',
    title: 'September-October 2022 UK Gilt & LDI Crisis',
    date: 'Sept - Oct 2022',
    peakMove: 158.5,
    peakVix: 33.5,
    vixMoveRatio: 2.11,
    summary:
      'The UK mini-budget fiscal announcement triggered an unprecedented 130 bps spike in long-dated Gilt yields within days, triggering recursive margin calls across £1.5T of Liability-Driven Investment (LDI) pension funds.',
    collateralMechanism:
      'Pensions used interest-rate swaps to hedge future pension liabilities. As yields surged, clearinghouses demanded immediate cash variation margin. To raise cash, pensions were forced to fire-sell Gilts into an illiquid market, creating an existential doom loop.',
    policyIntervention:
      'The Bank of England intervened with a temporary emergency purchase facility of up to £65B in long-dated Gilts, directly stepping into the market as the buyer of last resort to halt the self-reinforcing collateral liquidation cascade.',
  },
  {
    id: 'march-2023-svb-bank-run',
    title: 'March 2023 US Regional Bank Run & Collateral Parity',
    date: 'March 2023',
    peakMove: 198.7,
    peakVix: 26.5,
    vixMoveRatio: 1.33,
    summary:
      'Aggressive Federal Reserve rate hikes created deep unrealized losses on held-to-maturity Treasury and agency debt. Silicon Valley Bank suffered a $42B digital deposit run in 24 hours, driving MOVE to 198.7—its highest level since the 2008 Lehman crisis.',
    collateralMechanism:
      'While Treasuries had zero default credit risk, their mark-to-market market value had degraded by 15-25%. Banks could not liquidate long bonds without realizing insolvency-inducing capital losses.',
    policyIntervention:
      'The Federal Reserve created the Bank Term Funding Program (BTFP), allowing depository institutions to pledge US Treasuries and Agency debt as collateral at PAR (100 cents on the dollar) rather than market value, eliminating the need to fire-sell bonds.',
  },
  {
    id: 'august-2024-carry-unwind',
    title: 'August 2024 Yen Carry Trade & Cross-Asset Vol Shock',
    date: 'August 2024',
    peakMove: 138.2,
    peakVix: 65.7,
    vixMoveRatio: 4.75,
    summary:
      'A surprise Bank of Japan interest rate increase combined with weaker US payroll data triggered rapid yen appreciation, forcing global multi-strategy macro funds to violently unwind multi-hundred-billion-dollar yen carry trades.',
    collateralMechanism:
      'Sudden foreign exchange moves triggered collateral margin adjustments across global clearinghouses. Multi-asset portfolios suffered simultaneous margin calls across equities, Japanese equities, and currency hedges.',
    policyIntervention:
      'The Bank of Japan publicly clarified that it would refrain from raising interest rates during volatile market regimes, arresting the currency dislocation and stabilizing collateral funding costs.',
  },
];

// -----------------------------------------------------------------------------
// Multi-Year Historical Volatility Time Series (2019 - 2026)
// -----------------------------------------------------------------------------

export const HISTORICAL_BOND_VOLATILITY_SERIES: HistoricalBondVolatilityPoint[] = [
  {
    date: '2019-Q1',
    moveIndex: 58.4,
    vixIndex: 13.7,
    vixMoveRatio: 2.35,
    euroSovVol: 48.2,
    giltSovVol: 62.1,
    jgbSovVol: 45.0,
    repoHaircutPct: 1.5,
    collateralStressIndex: 22.0,
    notableEvent: 'Pre-pandemic quantitative tightening pause (Fed Pivot)',
  },
  {
    date: '2019-Q3',
    moveIndex: 68.2,
    vixIndex: 15.2,
    vixMoveRatio: 2.23,
    euroSovVol: 52.4,
    giltSovVol: 74.5,
    jgbSovVol: 48.1,
    repoHaircutPct: 2.2,
    collateralStressIndex: 48.0,
    notableEvent: 'September 2019 US Repo Market Spike (SOFR jumped to 10%)',
  },
  {
    date: '2020-Q1',
    moveIndex: 163.7,
    vixIndex: 82.7,
    vixMoveRatio: 5.05,
    euroSovVol: 118.5,
    giltSovVol: 142.0,
    jgbSovVol: 88.4,
    repoHaircutPct: 6.5,
    collateralStressIndex: 96.5,
    notableEvent: 'March 2020 COVID panic & Treasury Cash-Futures Basis Fracture',
  },
  {
    date: '2020-Q3',
    moveIndex: 42.1,
    vixIndex: 26.4,
    vixMoveRatio: 6.27,
    euroSovVol: 38.6,
    giltSovVol: 51.2,
    jgbSovVol: 34.0,
    repoHaircutPct: 1.5,
    collateralStressIndex: 18.0,
    notableEvent: 'Unlimited QE & Fed repo liquidity saturation',
  },
  {
    date: '2021-Q2',
    moveIndex: 62.8,
    vixIndex: 16.5,
    vixMoveRatio: 2.63,
    euroSovVol: 46.2,
    giltSovVol: 58.4,
    jgbSovVol: 39.2,
    repoHaircutPct: 1.5,
    collateralStressIndex: 24.0,
    notableEvent: 'Reverse Repo (ON RRP) facility begins massive balance sheet drain',
  },
  {
    date: '2022-Q1',
    moveIndex: 112.4,
    vixIndex: 28.5,
    vixMoveRatio: 2.54,
    euroSovVol: 92.1,
    giltSovVol: 118.0,
    jgbSovVol: 54.0,
    repoHaircutPct: 2.8,
    collateralStressIndex: 68.0,
    notableEvent: 'Russia-Ukraine invasion & rapid Fed rate hike commencement',
  },
  {
    date: '2022-Q3',
    moveIndex: 158.5,
    vixIndex: 33.5,
    vixMoveRatio: 2.11,
    euroSovVol: 124.6,
    giltSovVol: 218.4,
    jgbSovVol: 68.5,
    repoHaircutPct: 5.0,
    collateralStressIndex: 91.0,
    notableEvent: 'UK Gilt mini-budget collapse & LDI collateral margin spiral',
  },
  {
    date: '2023-Q1',
    moveIndex: 198.7,
    vixIndex: 26.5,
    vixMoveRatio: 1.33,
    euroSovVol: 114.2,
    giltSovVol: 135.0,
    jgbSovVol: 82.0,
    repoHaircutPct: 4.5,
    collateralStressIndex: 88.5,
    notableEvent: 'Silicon Valley Bank failure; MOVE hits highest level since 2008',
  },
  {
    date: '2023-Q3',
    moveIndex: 138.5,
    vixIndex: 17.5,
    vixMoveRatio: 1.26,
    euroSovVol: 88.5,
    giltSovVol: 104.2,
    jgbSovVol: 64.0,
    repoHaircutPct: 2.8,
    collateralStressIndex: 62.0,
    notableEvent: 'US 10-Year yield surges to 5.0%; Treasury refunding shock',
  },
  {
    date: '2024-Q1',
    moveIndex: 94.2,
    vixIndex: 13.8,
    vixMoveRatio: 1.46,
    euroSovVol: 72.4,
    giltSovVol: 89.1,
    jgbSovVol: 58.2,
    repoHaircutPct: 1.8,
    collateralStressIndex: 38.0,
    notableEvent: 'Fed pivot expectations & soft landing narrative dominance',
  },
  {
    date: '2024-Q3',
    moveIndex: 138.2,
    vixIndex: 65.7,
    vixMoveRatio: 4.75,
    euroSovVol: 98.6,
    giltSovVol: 112.0,
    jgbSovVol: 124.5,
    repoHaircutPct: 4.2,
    collateralStressIndex: 84.0,
    notableEvent: 'August 5 Global carry trade liquidation & Nikkei historic drop',
  },
  {
    date: '2025-Q2',
    moveIndex: 102.8,
    vixIndex: 15.2,
    vixMoveRatio: 1.48,
    euroSovVol: 81.0,
    giltSovVol: 106.5,
    jgbSovVol: 72.0,
    repoHaircutPct: 2.0,
    collateralStressIndex: 44.0,
    notableEvent: 'Structural fiscal deficits absorb high Treasury bill issuance',
  },
  {
    date: '2026-Q1',
    moveIndex: 106.2,
    vixIndex: 15.4,
    vixMoveRatio: 1.45,
    euroSovVol: 83.5,
    giltSovVol: 112.0,
    jgbSovVol: 76.5,
    repoHaircutPct: 2.0,
    collateralStressIndex: 46.0,
    notableEvent: 'Policy rates normalized; central banks navigate quantitative tapering',
  },
  {
    date: '2026-Q4',
    moveIndex: 108.5,
    vixIndex: 15.8,
    vixMoveRatio: 1.46,
    euroSovVol: 84.2,
    giltSovVol: 114.5,
    jgbSovVol: 78.6,
    repoHaircutPct: 2.0,
    collateralStressIndex: 47.5,
    notableEvent: 'Current baseline: elevated Treasury supply and steady equity valuations',
  },
];

// -----------------------------------------------------------------------------
// Interactive Sandbox Simulation Engine
// -----------------------------------------------------------------------------

export interface SimulatedCollateralPlumbingResult {
  simulatedMove: number;
  simulatedVix: number;
  simulatedVixMoveRatio: number;
  regime: ReturnType<typeof getVixMoveRegimeLabel>;
  stress: ReturnType<typeof getMoveStressLabel>;
  impliedRepoHaircutPct: number;
  dealerBalanceSheetCapacityPct: number;
  systemicFragilityIndex: number;
  basisTradeMarginStrainMultiplier: number;
  recommendedAction: string;
}

/**
 * Simulates real-time mechanical adjustments across dealer repo haircuts,
 * margin call frequency, and cross-asset complacency when analysts adjust MOVE or VIX.
 */
export function simulateCollateralPlumbing(
  simMove: number,
  simVix: number,
  region: BondVolatilityRegionId = 'USA'
): SimulatedCollateralPlumbingResult {
  const profile = REGIONAL_COLLATERAL_PROFILES[region];
  const regime = getVixMoveRegimeLabel(simVix, simMove);
  const stress = getMoveStressLabel(simMove);

  // Haircut dynamics: standard floor is ~1.5%. When MOVE spikes over 120, haircuts surge exponentially
  let impliedHaircut = 1.5;
  if (simMove > 80) {
    impliedHaircut += (simMove - 80) * 0.045;
  }
  if (simMove > 120) {
    impliedHaircut += (simMove - 120) * 0.08;
  }
  impliedHaircut = Number(Math.min(18.0, Math.max(1.0, impliedHaircut)).toFixed(2));

  // Dealer capacity: 100% capacity in tranquil markets (<80 MOVE); drops below 40% when MOVE > 140
  const capacityPct = Math.max(
    15,
    Math.min(100, Math.round(100 - Math.max(0, simMove - 75) * 0.85))
  );

  // Systemic fragility index: composite of high MOVE, tight haircuts, and low complacency ratio
  let fragility = (simMove / 200) * 55;
  if (regime.scaledRatio < 1.20) {
    fragility += 25; // Complacency gap adds systemic shock vulnerability
  }
  fragility += (impliedHaircut / 10) * 20;
  const systemicFragilityIndex = Math.min(100, Math.max(5, Math.round(fragility)));

  // Leverage strain multiplier for relative-value cash-futures basis trades
  const basisStrain = Number(
    Math.max(1.0, 1.0 + Math.max(0, simMove - 90) * 0.035).toFixed(2)
  );

  let recommendedAction = 'Collateral conditions are benign. Standard repo terms apply.';
  if (simMove >= 140) {
    recommendedAction =
      'CRITICAL: Acute collateral seizure risk. Central bank liquidity backstops and repo facilities required.';
  } else if (simMove >= 120) {
    recommendedAction =
      'WARNING: Restrict leverage on sovereign basis trades. Expect widening bid-ask spreads and haircut increases.';
  } else if (regime.complacencyRisk === 'EXTREME') {
    recommendedAction =
      'TACTICAL: Hedge equity risk via index put options. Bond volatility signals elevated downside contagion risk.';
  }

  return {
    simulatedMove: simMove,
    simulatedVix: simVix,
    simulatedVixMoveRatio: regime.scaledRatio,
    regime,
    stress,
    impliedRepoHaircutPct: impliedHaircut,
    dealerBalanceSheetCapacityPct: capacityPct,
    systemicFragilityIndex,
    basisTradeMarginStrainMultiplier: basisStrain,
    recommendedAction,
  };
}

// -----------------------------------------------------------------------------
// Canonical Dataset Aggregation
// -----------------------------------------------------------------------------

export const BOND_VOLATILITY_OVERVIEW: BondVolatilityOverview = {
  currentDate: '2026-10-14',
  latestMove: 108.5,
  move52wHigh: 142.8,
  move52wLow: 88.5,
  latestVix: 15.8,
  vix52wHigh: 65.7,
  vix52wLow: 11.8,
  vixMoveRatio: 1.46,
  regime: 'moderate_complacency',
  stressLevel: 'elevated',
  globalCollateralHealthScore: 74.2,
  termStructure: EQUITY_VOL_TERM_STRUCTURE,
  regions: REGIONAL_COLLATERAL_PROFILES,
  crises: HISTORICAL_CRISIS_CASES,
  historicalSeries: HISTORICAL_BOND_VOLATILITY_SERIES,
};

/**
 * Transforms historical time series and regional profiles for standard CSV/JSON export.
 */
export function getBondVolatilityExportData() {
  return HISTORICAL_BOND_VOLATILITY_SERIES.map((pt) => ({
    date: pt.date,
    moveIndex: pt.moveIndex,
    vixIndex: pt.vixIndex,
    vixMoveRatio: pt.vixMoveRatio,
    euroSovVol: pt.euroSovVol,
    giltSovVol: pt.giltSovVol,
    jgbSovVol: pt.jgbSovVol,
    repoHaircutPct: pt.repoHaircutPct,
    collateralStressIndex: pt.collateralStressIndex,
    notableEvent: pt.notableEvent || '',
  }));
}
