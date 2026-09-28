/**
 * Sovereign Fiscal Dominance & Debt Spiral Simulator Data
 *
 * Models the fundamental macro dynamics of sovereign solvency:
 * Delta d_t = (r_t - g_t) * d_{t-1} + p_t
 * Where:
 *   d_t = Debt-to-GDP ratio
 *   r_t = Effective nominal interest rate on public debt
 *   g_t = Nominal GDP growth rate (Real GDP + Inflation)
 *   p_t = Primary deficit (% of GDP, excluding debt interest)
 *
 * When r > g, debt compounds exponentially even with a primary balance.
 * When debt-to-GDP crosses structural thresholds (100%-120%), central banks
 * enter "Fiscal Dominance", where interest rate hikes risk sovereign insolvency,
 * forcing yield curve control and negative real rates (Financial Repression).
 */

export interface SovereignFiscalProfile {
  code: string;
  name: string;
  flag: string;
  currencyName: string;
  debtToGdp2026: number; // in percent (e.g. 124.0)
  totalDebtTrillion: number; // in USD trillions (or local currency baseline)
  gdpTrillion: number; // in USD trillions
  effectiveInterestRate: number; // blended coupon on existing debt stock (%)
  benchmark10YYield: number; // market marginal refinancing cost (%)
  primaryDeficitPercent: number; // primary deficit excluding interest as % of GDP
  realGdpGrowth: number; // real economic expansion rate (%)
  inflationRate: number; // GDP deflator / CPI inflation (%)
  avgDebtMaturityYears: number; // weighted average duration of national debt
  taxRevenuePercentGdp: number; // general government revenue as % of GDP
  defenseAndDiscretionaryPercentGdp: number; // essential discretionary spending benchmark
  centralBankBalanceSheetGdp: number; // % of GDP held by central bank
  historicalPeakDebtPercent: number; // historical high (e.g. WWII peak)
  macroSummary: string;
}

export interface FiscalSimulationParams {
  bondYield: number; // Marginal yield on sovereign debt (%)
  primaryDeficit: number; // Primary deficit as % of GDP (%)
  realGrowth: number; // Real GDP growth (%)
  inflation: number; // Inflation rate (%)
}

export interface TrajectoryYearPoint {
  year: number;
  debtToGdp: number;
  totalDebtTrillion: number;
  gdpTrillion: number;
  effectiveInterestRate: number;
  netInterestExpensePercentGdp: number;
  netInterestExpenseTrillion: number;
  interestToTaxRevenuePercent: number;
  rMinusG: number;
  isTippingPoint: boolean; // Interest exceeds defense/discretionary baseline
  zone: 'safe' | 'warning' | 'critical' | 'dominance';
}

export interface FiscalScenarioPreset {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  description: string;
  yieldMod: number; // absolute override or offset
  deficitMod: number;
  growthMod: number;
  inflationMod: number;
  historicalPrecedent: string;
}

export const SOVEREIGN_FISCAL_PROFILES: SovereignFiscalProfile[] = [
  {
    code: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    currencyName: 'US Dollar (USD)',
    debtToGdp2026: 124.2,
    totalDebtTrillion: 36.4,
    gdpTrillion: 29.3,
    effectiveInterestRate: 3.45,
    benchmark10YYield: 4.25,
    primaryDeficitPercent: 3.8,
    realGdpGrowth: 2.1,
    inflationRate: 2.5,
    avgDebtMaturityYears: 6.2,
    taxRevenuePercentGdp: 18.2,
    defenseAndDiscretionaryPercentGdp: 6.4,
    centralBankBalanceSheetGdp: 24.5,
    historicalPeakDebtPercent: 119.0, // WWII peak 1946
    macroSummary:
      'The global reserve issuer faces persistent structural primary deficits driven by entitlement spending and defense, combined with rolling short debt maturities (1/3 of debt matures in <12 months).',
  },
  {
    code: 'JPN',
    name: 'Japan',
    flag: '🇯🇵',
    currencyName: 'Japanese Yen (JPY)',
    debtToGdp2026: 256.0,
    totalDebtTrillion: 10.8,
    gdpTrillion: 4.22,
    effectiveInterestRate: 0.85,
    benchmark10YYield: 1.15,
    primaryDeficitPercent: 2.2,
    realGdpGrowth: 0.8,
    inflationRate: 2.1,
    avgDebtMaturityYears: 9.1,
    taxRevenuePercentGdp: 34.0,
    defenseAndDiscretionaryPercentGdp: 5.2,
    centralBankBalanceSheetGdp: 128.0, // Bank of Japan owns >50% of JGB market
    historicalPeakDebtPercent: 260.0,
    macroSummary:
      'The world pioneer of quantitative easing and yield curve control. Because debt-to-GDP is 256%, every 100 bps rise in interest rates eventually consumes over 25% of national tax receipts.',
  },
  {
    code: 'GBR',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencyName: 'British Pound (GBP)',
    debtToGdp2026: 101.5,
    totalDebtTrillion: 3.65,
    gdpTrillion: 3.6,
    effectiveInterestRate: 3.65,
    benchmark10YYield: 4.2,
    primaryDeficitPercent: 2.4,
    realGdpGrowth: 1.2,
    inflationRate: 2.4,
    avgDebtMaturityYears: 14.2, // Unusually long debt maturity profile
    taxRevenuePercentGdp: 37.0,
    defenseAndDiscretionaryPercentGdp: 7.0,
    centralBankBalanceSheetGdp: 32.0,
    historicalPeakDebtPercent: 250.0, // Post-Napoleonic & WWII peaks
    macroSummary:
      'Long-dated gilt maturities provide temporary insulation, but high inflation and sluggish productivity growth keep fiscal headroom tight following the 2022 liability-driven investment (LDI) crisis.',
  },
  {
    code: 'FRA',
    name: 'France',
    flag: '🇫🇷',
    currencyName: 'Euro (EUR)',
    debtToGdp2026: 112.8,
    totalDebtTrillion: 3.61,
    gdpTrillion: 3.2,
    effectiveInterestRate: 2.85,
    benchmark10YYield: 3.35,
    primaryDeficitPercent: 3.4,
    realGdpGrowth: 1.1,
    inflationRate: 2.0,
    avgDebtMaturityYears: 8.5,
    taxRevenuePercentGdp: 52.0, // High baseline tax capture limit
    defenseAndDiscretionaryPercentGdp: 7.8,
    centralBankBalanceSheetGdp: 30.0,
    historicalPeakDebtPercent: 115.0,
    macroSummary:
      'Constrained by Eurozone fiscal pacts without sovereign monetary printing authority. High government spending (>56% of GDP) leaves virtually no room for tax hikes to offset surging borrowing yields.',
  },
  {
    code: 'ITA',
    name: 'Italy',
    flag: '🇮🇹',
    currencyName: 'Euro (EUR)',
    debtToGdp2026: 139.5,
    totalDebtTrillion: 3.28,
    gdpTrillion: 2.35,
    effectiveInterestRate: 3.3,
    benchmark10YYield: 3.85,
    primaryDeficitPercent: 1.2, // Runs near primary balance, but crushed by interest
    realGdpGrowth: 0.7,
    inflationRate: 1.8,
    avgDebtMaturityYears: 7.2,
    taxRevenuePercentGdp: 47.0,
    defenseAndDiscretionaryPercentGdp: 6.2,
    centralBankBalanceSheetGdp: 35.0,
    historicalPeakDebtPercent: 160.0, // Post-WWI peak
    macroSummary:
      'Maintains disciplined primary balances, yet the colossal debt legacy makes debt service the largest single annual budget item, highly reliant on ECB anti-fragmentation backstops (TPI).',
  },
  {
    code: 'DEU',
    name: 'Germany',
    flag: '🇩🇪',
    currencyName: 'Euro (EUR)',
    debtToGdp2026: 62.8,
    totalDebtTrillion: 2.95,
    gdpTrillion: 4.7,
    effectiveInterestRate: 2.2,
    benchmark10YYield: 2.45,
    primaryDeficitPercent: 0.9,
    realGdpGrowth: 0.6,
    inflationRate: 2.1,
    avgDebtMaturityYears: 7.8,
    taxRevenuePercentGdp: 46.5,
    defenseAndDiscretionaryPercentGdp: 5.8,
    centralBankBalanceSheetGdp: 26.0,
    historicalPeakDebtPercent: 82.0,
    macroSummary:
      'The fiscal anchor of Europe. Constrained by the constitutional debt brake ("Schuldenbremse"), preserving fiscal capacity but constraining public capital investment in energy transition and infrastructure.',
  },
  {
    code: 'CHN',
    name: 'China',
    flag: '🇨🇳',
    currencyName: 'Chinese Yuan (CNY)',
    debtToGdp2026: 114.5, // Augmented debt including Local Government Financing Vehicles (LGFVs)
    totalDebtTrillion: 21.8,
    gdpTrillion: 19.04,
    effectiveInterestRate: 2.65,
    benchmark10YYield: 2.15,
    primaryDeficitPercent: 3.6,
    realGdpGrowth: 4.5,
    inflationRate: 1.0,
    avgDebtMaturityYears: 7.5,
    taxRevenuePercentGdp: 21.0,
    defenseAndDiscretionaryPercentGdp: 7.2,
    centralBankBalanceSheetGdp: 33.0,
    historicalPeakDebtPercent: 116.0,
    macroSummary:
      'High growth mitigates debt ratios, but local government debt (LGFVs) and property sector contraction require state-backed debt swap programs to prevent regional banking balance sheet stress.',
  },
  {
    code: 'ESP',
    name: 'Spain',
    flag: '🇪🇸',
    currencyName: 'Euro (EUR)',
    debtToGdp2026: 104.8,
    totalDebtTrillion: 1.82,
    gdpTrillion: 1.74,
    effectiveInterestRate: 2.75,
    benchmark10YYield: 3.15,
    primaryDeficitPercent: 1.8,
    realGdpGrowth: 2.3,
    inflationRate: 2.2,
    avgDebtMaturityYears: 7.9,
    taxRevenuePercentGdp: 42.5,
    defenseAndDiscretionaryPercentGdp: 5.4,
    centralBankBalanceSheetGdp: 32.0,
    historicalPeakDebtPercent: 125.0, // Post-pandemic & Spanish-American War peaks
    macroSummary:
      'Dynamic post-pandemic tourism, service exports, and demographic migration bolster GDP growth, but structural regional deficits keep public debt above the 100% Maastricht threshold.',
  },
  {
    code: 'CAN',
    name: 'Canada',
    flag: '🇨🇦',
    currencyName: 'Canadian Dollar (CAD)',
    debtToGdp2026: 107.2, // General government including provincial debt
    totalDebtTrillion: 2.41,
    gdpTrillion: 2.25,
    effectiveInterestRate: 3.1,
    benchmark10YYield: 3.3,
    primaryDeficitPercent: 1.4,
    realGdpGrowth: 1.4,
    inflationRate: 2.4,
    avgDebtMaturityYears: 6.5,
    taxRevenuePercentGdp: 41.2,
    defenseAndDiscretionaryPercentGdp: 6.2,
    centralBankBalanceSheetGdp: 16.5,
    historicalPeakDebtPercent: 118.0,
    macroSummary:
      'Resource-rich G7 economy constrained by elevated household debt service ratios and provincial borrowing needs, narrowing federal fiscal flexibility as mortgages reset.',
  },
  {
    code: 'AUS',
    name: 'Australia',
    flag: '🇦🇺',
    currencyName: 'Australian Dollar (AUD)',
    debtToGdp2026: 49.5,
    totalDebtTrillion: 0.88,
    gdpTrillion: 1.78,
    effectiveInterestRate: 3.85,
    benchmark10YYield: 4.15,
    primaryDeficitPercent: 0.8,
    realGdpGrowth: 1.6,
    inflationRate: 2.8,
    avgDebtMaturityYears: 7.1,
    taxRevenuePercentGdp: 29.5,
    defenseAndDiscretionaryPercentGdp: 5.8,
    centralBankBalanceSheetGdp: 18.0,
    historicalPeakDebtPercent: 140.0, // WWII peak
    macroSummary:
      'Low sovereign leverage anchored by iron ore, LNG, and critical minerals exports. One of the few developed sovereigns with vast balance sheet headroom against fiscal dominance.',
  },
  {
    code: 'IND',
    name: 'India',
    flag: '🇮🇳',
    currencyName: 'Indian Rupee (INR)',
    debtToGdp2026: 81.5,
    totalDebtTrillion: 3.38,
    gdpTrillion: 4.15,
    effectiveInterestRate: 7.1,
    benchmark10YYield: 6.85,
    primaryDeficitPercent: 3.2,
    realGdpGrowth: 6.8,
    inflationRate: 4.5,
    avgDebtMaturityYears: 11.2,
    taxRevenuePercentGdp: 19.5,
    defenseAndDiscretionaryPercentGdp: 6.0,
    centralBankBalanceSheetGdp: 22.0,
    historicalPeakDebtPercent: 88.0,
    macroSummary:
      'Blistering nominal GDP expansion (g > 11%) easily outpaces borrowing yields (r = 6.85%), allowing India to sustain persistent primary deficits while organically stabilizing its debt ratio.',
  },
  {
    code: 'BRA',
    name: 'Brazil',
    flag: '🇧🇷',
    currencyName: 'Brazilian Real (BRL)',
    debtToGdp2026: 78.4,
    totalDebtTrillion: 1.82,
    gdpTrillion: 2.32,
    effectiveInterestRate: 11.8,
    benchmark10YYield: 12.2,
    primaryDeficitPercent: 0.6,
    realGdpGrowth: 2.2,
    inflationRate: 4.2,
    avgDebtMaturityYears: 4.2,
    taxRevenuePercentGdp: 33.5,
    defenseAndDiscretionaryPercentGdp: 4.8,
    centralBankBalanceSheetGdp: 28.0,
    historicalPeakDebtPercent: 89.0,
    macroSummary:
      'Short debt duration (4.2 years) and high real interest rates (SELIC) make annual debt service Brazil’s heaviest fiscal burden, demanding constant primary surplus discipline.',
  },
  {
    code: 'CHE',
    name: 'Switzerland',
    flag: '🇨🇭',
    currencyName: 'Swiss Franc (CHF)',
    debtToGdp2026: 38.2,
    totalDebtTrillion: 0.36,
    gdpTrillion: 0.94,
    effectiveInterestRate: 0.75,
    benchmark10YYield: 0.65,
    primaryDeficitPercent: -0.4, // Running primary surplus
    realGdpGrowth: 1.3,
    inflationRate: 1.2,
    avgDebtMaturityYears: 9.8,
    taxRevenuePercentGdp: 28.0,
    defenseAndDiscretionaryPercentGdp: 4.2,
    centralBankBalanceSheetGdp: 92.0,
    historicalPeakDebtPercent: 55.0,
    macroSummary:
      'The gold standard of sovereign solvency. Constrained by the constitutional debt brake ("Schuldenbremse"), Switzerland runs structural primary surpluses with negligible interest crowd-out.',
  },
  {
    code: 'MEX',
    name: 'Mexico',
    flag: '🇲🇽',
    currencyName: 'Mexican Peso (MXN)',
    debtToGdp2026: 52.1,
    totalDebtTrillion: 1.02,
    gdpTrillion: 1.95,
    effectiveInterestRate: 8.9,
    benchmark10YYield: 9.55,
    primaryDeficitPercent: 1.1,
    realGdpGrowth: 1.8,
    inflationRate: 4.4,
    avgDebtMaturityYears: 7.5,
    taxRevenuePercentGdp: 17.5,
    defenseAndDiscretionaryPercentGdp: 4.5,
    centralBankBalanceSheetGdp: 15.0,
    historicalPeakDebtPercent: 85.0,
    macroSummary:
      'Disciplined sovereign leverage under the fiscal responsibility law, benefiting from North American nearshoring FDI, but challenged by state energy enterprise (Pemex) debt guarantees.',
  },
];

export const FISCAL_SCENARIOS: FiscalScenarioPreset[] = [
  {
    id: 'baseline',
    name: 'CBO / IMF Baseline',
    subtitle: 'Current Law & Status Quo',
    iconName: 'Building2',
    description:
      'Reflects official baseline projections: moderate growth, anchored central bank target inflation, and current legislated primary deficit tracks.',
    yieldMod: 0,
    deficitMod: 0,
    growthMod: 0,
    inflationMod: 0,
    historicalPrecedent: 'Standard peacetime macroeconomic trend line.',
  },
  {
    id: 'bond_vigilantes',
    name: 'Bond Vigilante Shock',
    subtitle: 'Surging Refinancing Yields (+200 bps)',
    iconName: 'Zap',
    description:
      'Investors demand higher term premia due to supply indigestion. 10-year yields jump 200 bps while fiscal deficits remain stubborn, rapidly steepening interest costs.',
    yieldMod: 2.0,
    deficitMod: 0.5,
    growthMod: -0.5,
    inflationMod: 0,
    historicalPrecedent: '1993-1994 Bond Market Rebellion; 2022 Gilt Crisis.',
  },
  {
    id: 'stagflation',
    name: '1970s Great Stagflation',
    subtitle: 'Persistent Inflation & Stagnant Growth',
    iconName: 'Flame',
    description:
      'Commodity spikes and wage pressures push inflation to 5%, forcing yields up to 5.5% while real GDP stalls at zero.',
    yieldMod: 1.5,
    deficitMod: 1.2,
    growthMod: -1.5,
    inflationMod: 2.5,
    historicalPrecedent: '1973-1979 Oil Embargo and Volcker transition.',
  },
  {
    id: 'financial_repression',
    name: 'Financial Repression Playbook',
    subtitle: 'Yield Caps with Negative Real Rates',
    iconName: 'Anchor',
    description:
      'The post-WWII liquidation playbook: The central bank caps bond yields while inflation runs higher, generating negative real rates that quietly burn debt off private bondholders.',
    yieldMod: -1.5,
    deficitMod: -1.0,
    growthMod: 0.2,
    inflationMod: 2.0,
    historicalPrecedent: '1942-1951 US Fed-Treasury Accord and UK post-war debt run-off.',
  },
  {
    id: 'fiscal_austerity',
    name: 'Austerity & Reform',
    subtitle: 'Primary Budget Consolidation',
    iconName: 'Scissors',
    description:
      'Governments implement aggressive budget cuts, shrinking primary deficits near zero. Yields ease as solvency risk diminishes, but real economic growth cools.',
    yieldMod: -1.0,
    deficitMod: -2.5,
    growthMod: -0.8,
    inflationMod: -0.8,
    historicalPrecedent: '1990s US Clinton-Gingrich surplus era; 2012 Eurozone fiscal consolidation.',
  },
];

/**
 * Calculates a 10-year dynamic fiscal projection taking into account the gradual
 * rollover of maturing debt at new market yields.
 *
 * Rationale:
 * A sovereign does not refinance all debt immediately. If average maturity is 6 years,
 * roughly 1/6th of debt rolls over annually to the new marginal market yield, while the
 * remaining 5/6th retains the historical legacy coupon.
 */
export function simulateFiscalTrajectory(
  profile: SovereignFiscalProfile,
  params: FiscalSimulationParams,
  horizonYears: number = 10
): TrajectoryYearPoint[] {
  const trajectory: TrajectoryYearPoint[] = [];

  let currentDebtToGdp = profile.debtToGdp2026;
  let currentNominalGdp = profile.gdpTrillion;
  let currentTotalDebt = profile.totalDebtTrillion;
  let effectiveRate = profile.effectiveInterestRate;

  const targetMarketYield = params.bondYield;
  const annualRolloverFraction = 1 / Math.max(2, profile.avgDebtMaturityYears);

  for (let t = 0; t <= horizonYears; t++) {
    const year = 2026 + t;

    // Nominal GDP growth: (1 + realGrowth) * (1 + inflation) - 1
    const nominalGdpGrowth =
      (1 + params.realGrowth / 100) * (1 + params.inflation / 100) - 1;

    // As old bonds mature, the effective interest rate shifts toward current market yields
    if (t > 0) {
      effectiveRate =
        effectiveRate * (1 - annualRolloverFraction) +
        targetMarketYield * annualRolloverFraction;
    }

    // Net interest cost on public debt
    const netInterestPercentGdp = (effectiveRate / 100) * currentDebtToGdp;
    const netInterestTrillion = (netInterestPercentGdp / 100) * currentNominalGdp;

    // Share of tax revenue absorbed by debt interest payments
    const interestToTaxPercent =
      profile.taxRevenuePercentGdp > 0
        ? (netInterestPercentGdp / profile.taxRevenuePercentGdp) * 100
        : 0;

    // r minus g spread (The fundamental debt compounding differential)
    const rMinusG = effectiveRate - nominalGdpGrowth * 100;

    // Tipping point: does annual interest payment exceed total defense + discretionary outlays?
    const isTippingPoint =
      netInterestPercentGdp > profile.defenseAndDiscretionaryPercentGdp;

    // Solvency Risk Classification Zone
    let zone: TrajectoryYearPoint['zone'] = 'safe';
    if (currentDebtToGdp > 140 || interestToTaxPercent > 35) {
      zone = 'dominance';
    } else if (currentDebtToGdp > 110 || interestToTaxPercent > 22) {
      zone = 'critical';
    } else if (currentDebtToGdp > 80 || interestToTaxPercent > 14) {
      zone = 'warning';
    }

    trajectory.push({
      year,
      debtToGdp: Math.round(currentDebtToGdp * 10) / 10,
      totalDebtTrillion: Math.round(currentTotalDebt * 10) / 10,
      gdpTrillion: Math.round(currentNominalGdp * 10) / 10,
      effectiveInterestRate: Math.round(effectiveRate * 100) / 100,
      netInterestExpensePercentGdp: Math.round(netInterestPercentGdp * 10) / 10,
      netInterestExpenseTrillion: Math.round(netInterestTrillion * 100) / 100,
      interestToTaxRevenuePercent: Math.round(interestToTaxPercent * 10) / 10,
      rMinusG: Math.round(rMinusG * 10) / 10,
      isTippingPoint,
      zone,
    });

    // Advance to next period
    if (t < horizonYears) {
      // Sovereign debt dynamics equation:
      // Delta d = ( (r - g) / (1 + g) ) * d + primaryDeficit
      const deltaDebtToGdp =
        ((rMinusG / 100) / (1 + nominalGdpGrowth)) * currentDebtToGdp +
        params.primaryDeficit;

      currentDebtToGdp = Math.max(10, currentDebtToGdp + deltaDebtToGdp);
      currentNominalGdp = currentNominalGdp * (1 + nominalGdpGrowth);
      currentTotalDebt = (currentDebtToGdp / 100) * currentNominalGdp;
    }
  }

  return trajectory;
}

/**
 * Calculates the required negative real yield (the "Financial Repression Tax")
 * necessary to stabilize sovereign debt at current levels without fiscal austerity.
 *
 * Rationale:
 * If a sovereign cannot or will not cut its primary deficit (p > 0), the only way
 * to prevent the debt ratio from compounding to infinity is to force nominal GDP growth (g)
 * to exceed sovereign interest rates (r) such that (r - g) * d = -p.
 */
export function calculateFinancialRepressionMetrics(
  profile: SovereignFiscalProfile,
  params: FiscalSimulationParams
) {
  // Required r - g to stabilize debt: (r - g) * d/100 + p = 0 => (r - g) = -p / (d/100)
  const debtFraction = profile.debtToGdp2026 / 100;
  const requiredRMinusG = -params.primaryDeficit / debtFraction;

  // With current nominal growth, what yield is required?
  const nominalGrowth =
    (1 + params.realGrowth / 100) * (1 + params.inflation / 100) - 1;
  const stabilizingYield = nominalGrowth * 100 + requiredRMinusG;

  // Hidden stealth transfer from savers: difference between market yield and stabilizing yield
  const yieldPenalty = Math.max(0, params.bondYield - stabilizingYield);
  const annualWealthTransferTrillion = (yieldPenalty / 100) * profile.totalDebtTrillion;

  return {
    requiredRMinusG: Math.round(requiredRMinusG * 10) / 10,
    stabilizingYield: Math.round(stabilizingYield * 10) / 10,
    yieldPenalty: Math.round(yieldPenalty * 10) / 10,
    annualWealthTransferTrillion: Math.round(annualWealthTransferTrillion * 100) / 100,
    isRepressionRequired: params.primaryDeficit > 0,
  };
}
