import {
  CurrentAccountProfile,
  DxyProfile,
  ReerCurrencyProfile,
  GscpiProfile,
  CapitalFlowsProfile,
  ReerValuationStatus,
} from '../lib/types';

/**
 * Normalizes multi-lateral currency deviations into discrete analytical tranches
 * because non-linear macro risks accelerate once real currency misalignments exceed ±10%.
 */
export function classifyReerValuation(deviationPct: number): ReerValuationStatus {
  if (deviationPct >= 15) return 'deeply_overvalued';
  if (deviationPct >= 5) return 'moderately_overvalued';
  if (deviationPct <= -15) return 'deeply_undervalued';
  if (deviationPct <= -5) return 'moderately_undervalued';
  return 'fairly_valued';
}

/**
 * Assesses sovereign external balance sheet fragility using the Greenspan-Guidotti rule
 * and current account sustainability thresholds, identifying when an economy faces
 * sudden-stop currency depreciation and rollover vulnerability.
 */
export function classifySolvencyRisk(
  currentAccountPct: number,
  externalDebtToGdp: number,
  importCoverMonths: number
): 'low' | 'moderate' | 'elevated' | 'critical' {
  if (importCoverMonths < 3.0 || (currentAccountPct < -5.0 && externalDebtToGdp > 80)) {
    return 'critical';
  }
  if (importCoverMonths < 5.0 || (currentAccountPct < -3.0 && externalDebtToGdp > 60)) {
    return 'elevated';
  }
  if (currentAccountPct < -1.5 || externalDebtToGdp > 50) {
    return 'moderate';
  }
  return 'low';
}

/**
 * Computes the combined twin deficit burden (Fiscal Balance + Current Account Balance)
 * because economies running deficits on both balances depend entirely on foreign capital absorption,
 * forcing upward pressure on domestic real interest rates or currency depreciation.
 */
export function calculateTwinDeficitGap(fiscalBalancePct: number, currentAccountPct: number): number {
  return Number((fiscalBalancePct + currentAccountPct).toFixed(2));
}

/**
 * Synthesizes multi-factor foreign exchange vulnerability into a 1-100 normalized score
 * to quantify how susceptible a sovereign currency is to speculative runs or rapid devaluation.
 */
export function calculateDevaluationRiskScore(
  reerDeviationPct: number,
  currentAccountPct: number,
  externalDebtToGdp: number,
  importCoverMonths: number
): number {
  let score = 20;

  // Overvalued currencies face mechanical mean-reverting downward repricing pressure
  if (reerDeviationPct > 10) score += Math.min(25, (reerDeviationPct - 10) * 1.5);
  // Deeply undervalued currencies with structural imbalances can also suffer flight
  if (reerDeviationPct < -20 && currentAccountPct < 0) score += 15;

  // External funding deficits necessitate foreign capital recycling
  if (currentAccountPct < 0) {
    score += Math.min(25, Math.abs(currentAccountPct) * 4);
  } else {
    score -= Math.min(15, currentAccountPct * 2.5);
  }

  // High external debt ratios amplify foreign-currency refinancing risks
  if (externalDebtToGdp > 50) {
    score += Math.min(20, (externalDebtToGdp - 50) * 0.4);
  }

  // Thin FX reserve buffers prevent central banks from defending against speculative capital outflows
  if (importCoverMonths < 3.0) {
    score += 25;
  } else if (importCoverMonths < 6.0) {
    score += 12;
  } else if (importCoverMonths > 12.0) {
    score -= 10;
  }

  return Math.min(100, Math.max(1, Math.round(score)));
}

/**
 * Categorizes supply chain friction to determine whether logistics bottlenecks
 * are creating cost-push inflationary impulses across tradable goods.
 */
export function classifyGscpiStatus(
  stdDev: number
): 'extreme_stress' | 'elevated_pressure' | 'normal' | 'expansionary_slack' {
  if (stdDev >= 2.0) return 'extreme_stress';
  if (stdDev >= 0.75) return 'elevated_pressure';
  if (stdDev <= -0.5) return 'expansionary_slack';
  return 'normal';
}

/* =========================================================================
 * 1. Current Account & Balance of Payments Profiles
 * Curated from IMF Balance of Payments Statistics (BOPS), World Bank WDI,
 * and national central bank statistical bulletins (2000-2026).
 * ========================================================================= */
export const CURRENT_ACCOUNT_PROFILES: CurrentAccountProfile[] = [
  {
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    bloc: 'g7',
    currentAccountPercentGdp: -3.4,
    currentAccountBillionUSD: -985.2,
    tradeBalanceBillionUSD: -1062.4,
    tradeBalancePercentGdp: -3.7,
    goodsBalanceBillionUSD: -1210.5,
    servicesBalanceBillionUSD: 148.1,
    fiscalBalancePercentGdp: -6.4,
    externalDebtToGdp: 98.5,
    fxReservesBillionUSD: 242.0,
    importCoverMonths: 0.8, // The US relies on dollar reserve currency status rather than foreign FX buffers
    twinDeficitWarning: true,
    solvencyRiskLevel: 'moderate',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: -3.9, tradeBalanceBillionUSD: -379.8, fxReservesBillionUSD: 67.6, externalDebtToGdp: 64.2 },
      { year: 2006, currentAccountPercentGdp: -5.8, tradeBalanceBillionUSD: -763.5, fxReservesBillionUSD: 65.9, externalDebtToGdp: 78.4 },
      { year: 2012, currentAccountPercentGdp: -2.6, tradeBalanceBillionUSD: -536.8, fxReservesBillionUSD: 150.2, externalDebtToGdp: 95.1 },
      { year: 2018, currentAccountPercentGdp: -2.1, tradeBalanceBillionUSD: -622.1, fxReservesBillionUSD: 125.7, externalDebtToGdp: 96.0 },
      { year: 2021, currentAccountPercentGdp: -3.6, tradeBalanceBillionUSD: -845.0, fxReservesBillionUSD: 238.1, externalDebtToGdp: 102.3 },
      { year: 2024, currentAccountPercentGdp: -3.3, tradeBalanceBillionUSD: -990.2, fxReservesBillionUSD: 240.5, externalDebtToGdp: 99.1 },
      { year: 2026, currentAccountPercentGdp: -3.4, tradeBalanceBillionUSD: -1062.4, fxReservesBillionUSD: 242.0, externalDebtToGdp: 98.5 },
    ],
    macroNote: 'Persistent twin deficits (-9.8% combined) require absorbing ~$1T in foreign capital annually, placing structural reliance on foreign Treasury buyers and dollar reserve recycling.',
  },
  {
    countryCode: 'CHN',
    countryName: 'China',
    flag: '🇨🇳',
    bloc: 'brics',
    currentAccountPercentGdp: 2.3,
    currentAccountBillionUSD: 432.8,
    tradeBalanceBillionUSD: 915.2,
    tradeBalancePercentGdp: 4.8,
    goodsBalanceBillionUSD: 1080.0,
    servicesBalanceBillionUSD: -164.8,
    fiscalBalancePercentGdp: -3.8,
    externalDebtToGdp: 13.8,
    fxReservesBillionUSD: 3260.0,
    importCoverMonths: 14.8,
    twinDeficitWarning: false,
    solvencyRiskLevel: 'low',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: 1.7, tradeBalanceBillionUSD: 24.1, fxReservesBillionUSD: 168.3, externalDebtToGdp: 12.1 },
      { year: 2007, currentAccountPercentGdp: 9.9, tradeBalanceBillionUSD: 262.2, fxReservesBillionUSD: 1530.0, externalDebtToGdp: 10.5 },
      { year: 2012, currentAccountPercentGdp: 2.5, tradeBalanceBillionUSD: 231.1, fxReservesBillionUSD: 3311.6, externalDebtToGdp: 8.6 },
      { year: 2018, currentAccountPercentGdp: 0.2, tradeBalanceBillionUSD: 351.8, fxReservesBillionUSD: 3072.7, externalDebtToGdp: 14.3 },
      { year: 2021, currentAccountPercentGdp: 1.8, tradeBalanceBillionUSD: 676.4, fxReservesBillionUSD: 3250.2, externalDebtToGdp: 15.4 },
      { year: 2024, currentAccountPercentGdp: 2.2, tradeBalanceBillionUSD: 885.0, fxReservesBillionUSD: 3245.0, externalDebtToGdp: 14.1 },
      { year: 2026, currentAccountPercentGdp: 2.3, tradeBalanceBillionUSD: 915.2, fxReservesBillionUSD: 3260.0, externalDebtToGdp: 13.8 },
    ],
    macroNote: 'Massive manufacturing trade surplus generates over $900B net annually; capital controls and sovereign reserve diversification increasingly funnel surplus proceeds into gold and Belt-and-Road assets.',
  },
  {
    countryCode: 'DEU',
    countryName: 'Germany',
    flag: '🇩🇪',
    bloc: 'g7',
    currentAccountPercentGdp: 6.8,
    currentAccountBillionUSD: 312.4,
    tradeBalanceBillionUSD: 248.5,
    tradeBalancePercentGdp: 5.4,
    goodsBalanceBillionUSD: 285.2,
    servicesBalanceBillionUSD: -36.7,
    fiscalBalancePercentGdp: -1.8,
    externalDebtToGdp: 148.0, // High gross banking center external liabilities offset by massive net international investment position
    fxReservesBillionUSD: 320.0,
    importCoverMonths: 2.4,
    twinDeficitWarning: false,
    solvencyRiskLevel: 'low',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: -1.7, tradeBalanceBillionUSD: 54.8, fxReservesBillionUSD: 90.3, externalDebtToGdp: 115.0 },
      { year: 2007, currentAccountPercentGdp: 6.9, tradeBalanceBillionUSD: 265.4, fxReservesBillionUSD: 136.5, externalDebtToGdp: 140.2 },
      { year: 2015, currentAccountPercentGdp: 8.6, tradeBalanceBillionUSD: 280.2, fxReservesBillionUSD: 174.0, externalDebtToGdp: 155.0 },
      { year: 2020, currentAccountPercentGdp: 7.1, tradeBalanceBillionUSD: 210.4, fxReservesBillionUSD: 268.0, externalDebtToGdp: 162.0 },
      { year: 2022, currentAccountPercentGdp: 4.2, tradeBalanceBillionUSD: 90.1, fxReservesBillionUSD: 295.0, externalDebtToGdp: 152.0 },
      { year: 2024, currentAccountPercentGdp: 6.4, tradeBalanceBillionUSD: 232.0, fxReservesBillionUSD: 315.0, externalDebtToGdp: 149.0 },
      { year: 2026, currentAccountPercentGdp: 6.8, tradeBalanceBillionUSD: 248.5, fxReservesBillionUSD: 320.0, externalDebtToGdp: 148.0 },
    ],
    macroNote: 'Europe’s core exporter sustains structural current account surpluses (>6% of GDP) via high domestic savings, though post-2022 energy cost shifts have compressed industrial margins.',
  },
  {
    countryCode: 'JPN',
    countryName: 'Japan',
    flag: '🇯🇵',
    bloc: 'g7',
    currentAccountPercentGdp: 3.8,
    currentAccountBillionUSD: 162.5,
    tradeBalanceBillionUSD: -22.4,
    tradeBalancePercentGdp: -0.5,
    goodsBalanceBillionUSD: -48.2,
    servicesBalanceBillionUSD: 25.8,
    fiscalBalancePercentGdp: -3.4,
    externalDebtToGdp: 104.2,
    fxReservesBillionUSD: 1250.0,
    importCoverMonths: 16.2,
    twinDeficitWarning: false,
    solvencyRiskLevel: 'low',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: 2.8, tradeBalanceBillionUSD: 116.4, fxReservesBillionUSD: 361.6, externalDebtToGdp: 30.2 },
      { year: 2007, currentAccountPercentGdp: 4.8, tradeBalanceBillionUSD: 107.8, fxReservesBillionUSD: 973.4, externalDebtToGdp: 48.5 },
      { year: 2014, currentAccountPercentGdp: 0.8, tradeBalanceBillionUSD: -101.5, fxReservesBillionUSD: 1260.5, externalDebtToGdp: 62.0 },
      { year: 2020, currentAccountPercentGdp: 2.9, tradeBalanceBillionUSD: 28.5, fxReservesBillionUSD: 1394.7, externalDebtToGdp: 98.4 },
      { year: 2022, currentAccountPercentGdp: 2.1, tradeBalanceBillionUSD: -120.2, fxReservesBillionUSD: 1227.6, externalDebtToGdp: 106.0 },
      { year: 2024, currentAccountPercentGdp: 3.5, tradeBalanceBillionUSD: -35.0, fxReservesBillionUSD: 1240.0, externalDebtToGdp: 105.0 },
      { year: 2026, currentAccountPercentGdp: 3.8, tradeBalanceBillionUSD: -22.4, fxReservesBillionUSD: 1250.0, externalDebtToGdp: 104.2 },
    ],
    macroNote: 'Massive net foreign asset returns (primary income surplus of ~$200B/yr) fully counterbalance merchandise trade deficits caused by imported energy costs.',
  },
  {
    countryCode: 'GBR',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    bloc: 'g7',
    currentAccountPercentGdp: -3.2,
    currentAccountBillionUSD: -112.5,
    tradeBalanceBillionUSD: -62.8,
    tradeBalancePercentGdp: -1.8,
    goodsBalanceBillionUSD: -245.0,
    servicesBalanceBillionUSD: 182.2,
    fiscalBalancePercentGdp: -4.3,
    externalDebtToGdp: 285.0, // High financial center intermediation footprint
    fxReservesBillionUSD: 185.0,
    importCoverMonths: 2.2,
    twinDeficitWarning: true,
    solvencyRiskLevel: 'moderate',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: -2.4, tradeBalanceBillionUSD: -42.1, fxReservesBillionUSD: 48.5, externalDebtToGdp: 180.0 },
      { year: 2008, currentAccountPercentGdp: -3.8, tradeBalanceBillionUSD: -75.4, fxReservesBillionUSD: 62.3, externalDebtToGdp: 340.0 },
      { year: 2016, currentAccountPercentGdp: -5.3, tradeBalanceBillionUSD: -52.0, fxReservesBillionUSD: 135.0, externalDebtToGdp: 310.0 },
      { year: 2020, currentAccountPercentGdp: -3.2, tradeBalanceBillionUSD: -34.8, fxReservesBillionUSD: 180.5, externalDebtToGdp: 320.0 },
      { year: 2022, currentAccountPercentGdp: -3.8, tradeBalanceBillionUSD: -108.5, fxReservesBillionUSD: 178.0, externalDebtToGdp: 295.0 },
      { year: 2024, currentAccountPercentGdp: -3.3, tradeBalanceBillionUSD: -68.0, fxReservesBillionUSD: 182.0, externalDebtToGdp: 288.0 },
      { year: 2026, currentAccountPercentGdp: -3.2, tradeBalanceBillionUSD: -62.8, fxReservesBillionUSD: 185.0, externalDebtToGdp: 285.0 },
    ],
    macroNote: 'Classic Mark Carney "kindness of strangers" dynamic: structural services exports partially cushion merchandise deficit, but twin deficit creates vulnerability to sterling risk premiums.',
  },
  {
    countryCode: 'IND',
    countryName: 'India',
    flag: '🇮🇳',
    bloc: 'brics',
    currentAccountPercentGdp: -1.2,
    currentAccountBillionUSD: -48.5,
    tradeBalanceBillionUSD: -95.0,
    tradeBalancePercentGdp: -2.4,
    goodsBalanceBillionUSD: -275.0,
    servicesBalanceBillionUSD: 180.0,
    fiscalBalancePercentGdp: -5.1,
    externalDebtToGdp: 18.7,
    fxReservesBillionUSD: 705.0,
    importCoverMonths: 11.5,
    twinDeficitWarning: false,
    solvencyRiskLevel: 'low',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: -0.6, tradeBalanceBillionUSD: -12.5, fxReservesBillionUSD: 40.0, externalDebtToGdp: 21.0 },
      { year: 2008, currentAccountPercentGdp: -2.3, tradeBalanceBillionUSD: -89.0, fxReservesBillionUSD: 256.0, externalDebtToGdp: 19.5 },
      { year: 2013, currentAccountPercentGdp: -4.8, tradeBalanceBillionUSD: -148.0, fxReservesBillionUSD: 295.0, externalDebtToGdp: 23.6 },
      { year: 2020, currentAccountPercentGdp: 0.9, tradeBalanceBillionUSD: -42.0, fxReservesBillionUSD: 585.0, externalDebtToGdp: 21.2 },
      { year: 2022, currentAccountPercentGdp: -2.0, tradeBalanceBillionUSD: -122.0, fxReservesBillionUSD: 563.0, externalDebtToGdp: 19.8 },
      { year: 2024, currentAccountPercentGdp: -1.3, tradeBalanceBillionUSD: -98.0, fxReservesBillionUSD: 685.0, externalDebtToGdp: 18.9 },
      { year: 2026, currentAccountPercentGdp: -1.2, tradeBalanceBillionUSD: -95.0, fxReservesBillionUSD: 705.0, externalDebtToGdp: 18.7 },
    ],
    macroNote: 'Rapid IT & GCC service exports combined with $120B annual overseas remittances offset high crude oil imports; RBI war-chest of >$700B reserves ensures robust external solvency.',
  },
  {
    countryCode: 'BRA',
    countryName: 'Brazil',
    flag: '🇧🇷',
    bloc: 'brics',
    currentAccountPercentGdp: -1.6,
    currentAccountBillionUSD: -36.2,
    tradeBalanceBillionUSD: 78.4,
    tradeBalancePercentGdp: 3.5,
    goodsBalanceBillionUSD: 92.0,
    servicesBalanceBillionUSD: -48.0,
    fiscalBalancePercentGdp: -7.2,
    externalDebtToGdp: 32.5,
    fxReservesBillionUSD: 362.0,
    importCoverMonths: 14.2,
    twinDeficitWarning: false,
    solvencyRiskLevel: 'moderate',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: -3.8, tradeBalanceBillionUSD: -0.7, fxReservesBillionUSD: 33.0, externalDebtToGdp: 37.0 },
      { year: 2006, currentAccountPercentGdp: 1.2, tradeBalanceBillionUSD: 46.5, fxReservesBillionUSD: 85.8, externalDebtToGdp: 22.0 },
      { year: 2014, currentAccountPercentGdp: -4.2, tradeBalanceBillionUSD: -4.0, fxReservesBillionUSD: 374.0, externalDebtToGdp: 28.5 },
      { year: 2020, currentAccountPercentGdp: -1.9, tradeBalanceBillionUSD: 32.0, fxReservesBillionUSD: 355.6, externalDebtToGdp: 39.0 },
      { year: 2022, currentAccountPercentGdp: -2.8, tradeBalanceBillionUSD: 44.2, fxReservesBillionUSD: 324.7, externalDebtToGdp: 35.0 },
      { year: 2024, currentAccountPercentGdp: -1.8, tradeBalanceBillionUSD: 74.0, fxReservesBillionUSD: 358.0, externalDebtToGdp: 33.0 },
      { year: 2026, currentAccountPercentGdp: -1.6, tradeBalanceBillionUSD: 78.4, fxReservesBillionUSD: 362.0, externalDebtToGdp: 32.5 },
    ],
    macroNote: 'Agricultural and commodity export dominance generates record merchandise trade surpluses, buffering substantial profit remittances and fiscal deficit pressures.',
  },
  {
    countryCode: 'SAU',
    countryName: 'Saudi Arabia',
    flag: '🇸🇦',
    bloc: 'brics',
    currentAccountPercentGdp: 3.2,
    currentAccountBillionUSD: 35.8,
    tradeBalanceBillionUSD: 118.0,
    tradeBalancePercentGdp: 10.6,
    goodsBalanceBillionUSD: 142.0,
    servicesBalanceBillionUSD: -44.0,
    fiscalBalancePercentGdp: -2.8,
    externalDebtToGdp: 26.5,
    fxReservesBillionUSD: 440.0,
    importCoverMonths: 22.5,
    twinDeficitWarning: false,
    solvencyRiskLevel: 'low',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: 7.5, tradeBalanceBillionUSD: 47.0, fxReservesBillionUSD: 20.5, externalDebtToGdp: 18.0 },
      { year: 2008, currentAccountPercentGdp: 25.1, tradeBalanceBillionUSD: 212.0, fxReservesBillionUSD: 442.0, externalDebtToGdp: 12.0 },
      { year: 2015, currentAccountPercentGdp: -8.7, tradeBalanceBillionUSD: 38.0, fxReservesBillionUSD: 616.0, externalDebtToGdp: 14.5 },
      { year: 2020, currentAccountPercentGdp: -3.2, tradeBalanceBillionUSD: 44.0, fxReservesBillionUSD: 453.0, externalDebtToGdp: 29.0 },
      { year: 2022, currentAccountPercentGdp: 13.8, tradeBalanceBillionUSD: 221.0, fxReservesBillionUSD: 460.0, externalDebtToGdp: 24.0 },
      { year: 2024, currentAccountPercentGdp: 3.5, tradeBalanceBillionUSD: 124.0, fxReservesBillionUSD: 445.0, externalDebtToGdp: 26.0 },
      { year: 2026, currentAccountPercentGdp: 3.2, tradeBalanceBillionUSD: 118.0, fxReservesBillionUSD: 440.0, externalDebtToGdp: 26.5 },
    ],
    macroNote: 'Current account remains structurally positive driven by hydrocarbon receipts; sovereign wealth fund (PIF) channels surplus capital into domestic Vision 2030 industrial transformations.',
  },
  {
    countryCode: 'CAN',
    countryName: 'Canada',
    flag: '🇨🇦',
    bloc: 'g7',
    currentAccountPercentGdp: -0.6,
    currentAccountBillionUSD: -13.5,
    tradeBalanceBillionUSD: 8.5,
    tradeBalancePercentGdp: 0.4,
    goodsBalanceBillionUSD: 18.2,
    servicesBalanceBillionUSD: -9.7,
    fiscalBalancePercentGdp: -1.9,
    externalDebtToGdp: 124.0,
    fxReservesBillionUSD: 120.0,
    importCoverMonths: 2.3,
    twinDeficitWarning: false,
    solvencyRiskLevel: 'low',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: 2.7, tradeBalanceBillionUSD: 41.5, fxReservesBillionUSD: 32.4, externalDebtToGdp: 68.0 },
      { year: 2008, currentAccountPercentGdp: 0.5, tradeBalanceBillionUSD: 38.0, fxReservesBillionUSD: 43.8, externalDebtToGdp: 72.0 },
      { year: 2016, currentAccountPercentGdp: -3.2, tradeBalanceBillionUSD: -26.0, fxReservesBillionUSD: 82.7, externalDebtToGdp: 112.0 },
      { year: 2020, currentAccountPercentGdp: -1.7, tradeBalanceBillionUSD: -28.5, fxReservesBillionUSD: 90.4, externalDebtToGdp: 135.0 },
      { year: 2022, currentAccountPercentGdp: -0.4, tradeBalanceBillionUSD: 19.5, fxReservesBillionUSD: 107.0, externalDebtToGdp: 128.0 },
      { year: 2024, currentAccountPercentGdp: -0.8, tradeBalanceBillionUSD: 6.0, fxReservesBillionUSD: 118.0, externalDebtToGdp: 125.0 },
      { year: 2026, currentAccountPercentGdp: -0.6, tradeBalanceBillionUSD: 8.5, fxReservesBillionUSD: 120.0, externalDebtToGdp: 124.0 },
    ],
    macroNote: 'Energy exports to the US anchor merchandise balance, while cross-border investment income flows keep the current account near balance.',
  },
  {
    countryCode: 'FRA',
    countryName: 'France',
    flag: '🇫🇷',
    bloc: 'g7',
    currentAccountPercentGdp: -1.1,
    currentAccountBillionUSD: -34.8,
    tradeBalanceBillionUSD: -64.2,
    tradeBalancePercentGdp: -2.1,
    goodsBalanceBillionUSD: -98.0,
    servicesBalanceBillionUSD: 33.8,
    fiscalBalancePercentGdp: -5.5,
    externalDebtToGdp: 220.0,
    fxReservesBillionUSD: 255.0,
    importCoverMonths: 2.8,
    twinDeficitWarning: true,
    solvencyRiskLevel: 'moderate',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: 1.3, tradeBalanceBillionUSD: 5.2, fxReservesBillionUSD: 37.0, externalDebtToGdp: 118.0 },
      { year: 2008, currentAccountPercentGdp: -1.0, tradeBalanceBillionUSD: -68.0, fxReservesBillionUSD: 98.0, externalDebtToGdp: 175.0 },
      { year: 2016, currentAccountPercentGdp: -0.6, tradeBalanceBillionUSD: -48.0, fxReservesBillionUSD: 154.0, externalDebtToGdp: 215.0 },
      { year: 2020, currentAccountPercentGdp: -1.8, tradeBalanceBillionUSD: -76.0, fxReservesBillionUSD: 224.0, externalDebtToGdp: 245.0 },
      { year: 2022, currentAccountPercentGdp: -2.1, tradeBalanceBillionUSD: -110.0, fxReservesBillionUSD: 242.0, externalDebtToGdp: 230.0 },
      { year: 2024, currentAccountPercentGdp: -1.2, tradeBalanceBillionUSD: -72.0, fxReservesBillionUSD: 252.0, externalDebtToGdp: 222.0 },
      { year: 2026, currentAccountPercentGdp: -1.1, tradeBalanceBillionUSD: -64.2, fxReservesBillionUSD: 255.0, externalDebtToGdp: 220.0 },
    ],
    macroNote: 'Strong tourism and aerospace services partially mitigate energy-driven merchandise deficits, though a -5.5% fiscal shortfall fuels twin-deficit scrutiny within the Eurozone.',
  },
  {
    countryCode: 'RUS',
    countryName: 'Russia',
    flag: '🇷🇺',
    bloc: 'brics',
    currentAccountPercentGdp: 3.4,
    currentAccountBillionUSD: 68.5,
    tradeBalanceBillionUSD: 125.0,
    tradeBalancePercentGdp: 6.2,
    goodsBalanceBillionUSD: 145.0,
    servicesBalanceBillionUSD: -32.0,
    fiscalBalancePercentGdp: -1.8,
    externalDebtToGdp: 15.2,
    fxReservesBillionUSD: 605.0, // Includes frozen Western custody reserves and actively accumulating Yuan/Gold tranches
    importCoverMonths: 20.5,
    twinDeficitWarning: false,
    solvencyRiskLevel: 'low',
    historicalSeries: [
      { year: 2000, currentAccountPercentGdp: 18.0, tradeBalanceBillionUSD: 60.0, fxReservesBillionUSD: 28.0, externalDebtToGdp: 60.0 },
      { year: 2008, currentAccountPercentGdp: 6.2, tradeBalanceBillionUSD: 180.0, fxReservesBillionUSD: 426.0, externalDebtToGdp: 29.0 },
      { year: 2016, currentAccountPercentGdp: 1.9, tradeBalanceBillionUSD: 90.0, fxReservesBillionUSD: 377.0, externalDebtToGdp: 39.0 },
      { year: 2020, currentAccountPercentGdp: 2.4, tradeBalanceBillionUSD: 94.0, fxReservesBillionUSD: 595.0, externalDebtToGdp: 31.0 },
      { year: 2022, currentAccountPercentGdp: 10.5, tradeBalanceBillionUSD: 315.0, fxReservesBillionUSD: 582.0, externalDebtToGdp: 17.0 },
      { year: 2024, currentAccountPercentGdp: 3.8, tradeBalanceBillionUSD: 130.0, fxReservesBillionUSD: 600.0, externalDebtToGdp: 15.5 },
      { year: 2026, currentAccountPercentGdp: 3.4, tradeBalanceBillionUSD: 125.0, fxReservesBillionUSD: 605.0, externalDebtToGdp: 15.2 },
    ],
    macroNote: 'Hydrocarbon export redirection to Asian economies sustains large current account surpluses; external debt has dropped to historic lows (<16% of GDP) following Western decoupling.',
  },
];

/* =========================================================================
 * 2. US Dollar Index (DXY) & Real Effective Exchange Rate (REER) Data
 * Base weights established in 1973 by the Federal Reserve; REER base 100
 * curated from the Bank for International Settlements (BIS) Narrow/Broad series.
 * ========================================================================= */
export const DXY_PROFILE_DATA: DxyProfile = {
  currentIndex: 103.8,
  fiftyTwoWeekHigh: 106.5,
  fiftyTwoWeekLow: 99.8,
  ytdChangePct: 2.4,
  dollarRegime: 'rate_differential_driven',
  regimeDescription: 'US growth exceptionalism and prolonged higher-for-longer policy rates support the Dollar, offsetting medium-term fiscal deficit drag.',
  components: [
    {
      currencyCode: 'EUR',
      currencyName: 'Euro',
      weightPercent: 57.6,
      spotRate: 1.082,
      ytdChangePct: -2.1,
      description: 'Heaviest component; mirrors Eurozone growth softness and ECB rate cuts relative to the Fed.',
    },
    {
      currencyCode: 'JPY',
      currencyName: 'Japanese Yen',
      weightPercent: 13.6,
      spotRate: 152.4,
      ytdChangePct: -6.8,
      description: 'Second largest weight; historically high interest rate divergence and carry trade dynamics drive yen softness.',
    },
    {
      currencyCode: 'GBP',
      currencyName: 'British Pound',
      weightPercent: 11.9,
      spotRate: 1.295,
      ytdChangePct: -1.2,
      description: 'UK sticky services inflation balances growth headwinds, keeping spot levels in a multi-year consolidation range.',
    },
    {
      currencyCode: 'CAD',
      currencyName: 'Canadian Dollar',
      weightPercent: 9.1,
      spotRate: 1.385,
      ytdChangePct: -3.0,
      description: 'High household debt leverage drove earlier Bank of Canada rate cuts, widening the negative yield spread vs US Treasuries.',
    },
    {
      currencyCode: 'SEK',
      currencyName: 'Swedish Krona',
      weightPercent: 4.2,
      spotRate: 10.65,
      ytdChangePct: -4.5,
      description: 'Highly cyclical small open economy currency sensitive to global manufacturing momentum and real estate refinancing.',
    },
    {
      currencyCode: 'CHF',
      currencyName: 'Swiss Franc',
      weightPercent: 3.6,
      spotRate: 0.865,
      ytdChangePct: -2.8,
      description: 'Traditional European safe-haven; SNB pre-emptive rate cuts have capped structural franc appreciation.',
    },
  ],
  historicalSeries: [
    { date: '1985 (Plaza Accord)', dxyLevel: 155.0, reerUsd: 136.2, regime: 'Plaza Accord peak and coordinated intervention' },
    { date: '1995 (Reverse Plaza)', dxyLevel: 82.5, reerUsd: 88.4, regime: 'Historic dollar low prior to US tech boom' },
    { date: '2001 (Dot-com Peak)', dxyLevel: 118.5, reerUsd: 122.5, regime: 'US productivity boom and capital surge' },
    { date: '2008 (GFC Low)', dxyLevel: 71.3, reerUsd: 82.0, regime: 'Subprime crisis and emergency Fed easing' },
    { date: '2014 (Taper Tantrum)', dxyLevel: 89.0, reerUsd: 94.5, regime: 'Fed taper start and divergent global central bank paths' },
    { date: '2016 (Hike Cycle)', dxyLevel: 102.2, reerUsd: 108.2, regime: 'First Fed rate hikes and Trump corporate tax stimulus' },
    { date: '2020 (Pandemic Dash)', dxyLevel: 102.8, reerUsd: 112.0, regime: 'Global liquidity scramble followed by massive QE' },
    { date: '2022 (Fastest Hikes)', dxyLevel: 114.2, reerUsd: 128.5, regime: 'Aggressive 75bps Fed rate hikes and European energy crisis' },
    { date: '2024 (Consolidation)', dxyLevel: 104.2, reerUsd: 116.4, regime: 'Soft landing resilience and prolonged rate normalization' },
    { date: '2026 (Current Base)', dxyLevel: 103.8, reerUsd: 115.8, regime: 'Bilateral trade realignment and multi-polar currency invoicing' },
  ],
};

/* =========================================================================
 * Real Effective Exchange Rates (REER) Across G7 and BRICS+
 * 10-year mean anchored to capture structural purchasing power parity misalignment.
 * ========================================================================= */
export const REER_CURRENCY_PROFILES: ReerCurrencyProfile[] = [
  {
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    countryName: 'United States',
    flag: '🇺🇸',
    bloc: 'g7',
    currentReer: 115.8,
    tenYearAverageReer: 102.5,
    valuationDeviationPct: 13.0,
    valuationStatus: 'moderately_overvalued',
    devaluationRiskScore: 38,
    devaluationRiskCategory: 'moderate',
    keyDriver: 'US economic exceptionalism and high real yields attract structural inflows despite twin deficits.',
    historicalSeries: [
      { year: 2010, reer: 88.5, valuationDeviation: -13.7 },
      { year: 2014, reer: 94.2, valuationDeviation: -8.1 },
      { year: 2018, reer: 107.4, valuationDeviation: 4.8 },
      { year: 2021, reer: 111.2, valuationDeviation: 8.5 },
      { year: 2022, reer: 128.5, valuationDeviation: 25.4 },
      { year: 2024, reer: 116.4, valuationDeviation: 13.6 },
      { year: 2026, reer: 115.8, valuationDeviation: 13.0 },
    ],
  },
  {
    currencyCode: 'EUR',
    currencyName: 'Euro',
    countryName: 'Eurozone',
    flag: '🇪🇺',
    bloc: 'g7',
    currentReer: 96.4,
    tenYearAverageReer: 97.8,
    valuationDeviationPct: -1.4,
    valuationStatus: 'fairly_valued',
    devaluationRiskScore: 24,
    devaluationRiskCategory: 'low',
    keyDriver: 'Modest industrial activity and structural energy adjustments offset by consistent external trade surplus.',
    historicalSeries: [
      { year: 2010, reer: 104.2, valuationDeviation: 6.5 },
      { year: 2014, reer: 98.5, valuationDeviation: 0.7 },
      { year: 2018, reer: 101.2, valuationDeviation: 3.5 },
      { year: 2021, reer: 99.0, valuationDeviation: 1.2 },
      { year: 2022, reer: 91.5, valuationDeviation: -6.4 },
      { year: 2024, reer: 96.8, valuationDeviation: -1.0 },
      { year: 2026, reer: 96.4, valuationDeviation: -1.4 },
    ],
  },
  {
    currencyCode: 'CNY',
    currencyName: 'Chinese Yuan',
    countryName: 'China',
    flag: '🇨🇳',
    bloc: 'brics',
    currentReer: 92.5,
    tenYearAverageReer: 101.4,
    valuationDeviationPct: -8.8,
    valuationStatus: 'moderately_undervalued',
    devaluationRiskScore: 28,
    devaluationRiskCategory: 'low',
    keyDriver: 'Low domestic consumer inflation relative to trading partners enhances export competitiveness.',
    historicalSeries: [
      { year: 2010, reer: 84.0, valuationDeviation: -17.2 },
      { year: 2015, reer: 107.8, valuationDeviation: 6.3 },
      { year: 2019, reer: 98.2, valuationDeviation: -3.2 },
      { year: 2021, reer: 106.5, valuationDeviation: 5.0 },
      { year: 2023, reer: 94.2, valuationDeviation: -7.1 },
      { year: 2025, reer: 93.0, valuationDeviation: -8.3 },
      { year: 2026, reer: 92.5, valuationDeviation: -8.8 },
    ],
  },
  {
    currencyCode: 'JPY',
    currencyName: 'Japanese Yen',
    countryName: 'Japan',
    flag: '🇯🇵',
    bloc: 'g7',
    currentReer: 68.2,
    tenYearAverageReer: 88.5,
    valuationDeviationPct: -22.9,
    valuationStatus: 'deeply_undervalued',
    devaluationRiskScore: 32,
    devaluationRiskCategory: 'moderate',
    keyDriver: 'Decades of ultra-loose monetary policy and global rate differentials compressed real effective yen to multi-decade lows.',
    historicalSeries: [
      { year: 2010, reer: 112.5, valuationDeviation: 27.1 },
      { year: 2015, reer: 84.0, valuationDeviation: -5.1 },
      { year: 2018, reer: 86.8, valuationDeviation: -1.9 },
      { year: 2021, reer: 78.4, valuationDeviation: -11.4 },
      { year: 2023, reer: 70.1, valuationDeviation: -20.8 },
      { year: 2024, reer: 67.5, valuationDeviation: -23.7 },
      { year: 2026, reer: 68.2, valuationDeviation: -22.9 },
    ],
  },
  {
    currencyCode: 'GBP',
    currencyName: 'British Pound',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    bloc: 'g7',
    currentReer: 95.8,
    tenYearAverageReer: 94.2,
    valuationDeviationPct: 1.7,
    valuationStatus: 'fairly_valued',
    devaluationRiskScore: 42,
    devaluationRiskCategory: 'moderate',
    keyDriver: 'Persistent domestic inflation offsets structural trade and current account deficits.',
    historicalSeries: [
      { year: 2010, reer: 96.0, valuationDeviation: 1.9 },
      { year: 2015, reer: 108.5, valuationDeviation: 15.2 },
      { year: 2017, reer: 91.2, valuationDeviation: -3.2 },
      { year: 2021, reer: 95.0, valuationDeviation: 0.9 },
      { year: 2022, reer: 90.4, valuationDeviation: -4.0 },
      { year: 2024, reer: 95.2, valuationDeviation: 1.1 },
      { year: 2026, reer: 95.8, valuationDeviation: 1.7 },
    ],
  },
  {
    currencyCode: 'BRL',
    currencyName: 'Brazilian Real',
    countryName: 'Brazil',
    flag: '🇧🇷',
    bloc: 'brics',
    currentReer: 88.4,
    tenYearAverageReer: 92.0,
    valuationDeviationPct: -3.9,
    valuationStatus: 'fairly_valued',
    devaluationRiskScore: 48,
    devaluationRiskCategory: 'moderate',
    keyDriver: 'Attractive double-digit nominal Selic carry trade balances elevated sovereign fiscal deficit worries.',
    historicalSeries: [
      { year: 2010, reer: 125.0, valuationDeviation: 35.9 },
      { year: 2015, reer: 95.0, valuationDeviation: 3.3 },
      { year: 2019, reer: 91.0, valuationDeviation: -1.1 },
      { year: 2021, reer: 82.5, valuationDeviation: -10.3 },
      { year: 2023, reer: 91.2, valuationDeviation: -0.9 },
      { year: 2024, reer: 87.0, valuationDeviation: -5.4 },
      { year: 2026, reer: 88.4, valuationDeviation: -3.9 },
    ],
  },
  {
    currencyCode: 'INR',
    currencyName: 'Indian Rupee',
    countryName: 'India',
    flag: '🇮🇳',
    bloc: 'brics',
    currentReer: 104.2,
    tenYearAverageReer: 99.5,
    valuationDeviationPct: 4.7,
    valuationStatus: 'fairly_valued',
    devaluationRiskScore: 22,
    devaluationRiskCategory: 'low',
    keyDriver: 'Active RBI FX market interventions contain nominal volatility, while robust GDP growth anchors confidence.',
    historicalSeries: [
      { year: 2010, reer: 98.0, valuationDeviation: -1.5 },
      { year: 2014, reer: 95.5, valuationDeviation: -4.0 },
      { year: 2018, reer: 99.8, valuationDeviation: 0.3 },
      { year: 2021, reer: 102.5, valuationDeviation: 3.0 },
      { year: 2023, reer: 103.8, valuationDeviation: 4.3 },
      { year: 2025, reer: 104.0, valuationDeviation: 4.5 },
      { year: 2026, reer: 104.2, valuationDeviation: 4.7 },
    ],
  },
  {
    currencyCode: 'SAR',
    currencyName: 'Saudi Riyal',
    countryName: 'Saudi Arabia',
    flag: '🇸🇦',
    bloc: 'brics',
    currentReer: 108.6,
    tenYearAverageReer: 101.2,
    valuationDeviationPct: 7.3,
    valuationStatus: 'moderately_overvalued',
    devaluationRiskScore: 18,
    devaluationRiskCategory: 'low',
    keyDriver: 'Conventional dollar peg (3.75 SAR/USD) transmits US Dollar strength directly into higher effective domestic purchasing power.',
    historicalSeries: [
      { year: 2010, reer: 92.0, valuationDeviation: -9.1 },
      { year: 2015, reer: 104.5, valuationDeviation: 3.3 },
      { year: 2019, reer: 103.0, valuationDeviation: 1.8 },
      { year: 2021, reer: 105.0, valuationDeviation: 3.8 },
      { year: 2022, reer: 114.2, valuationDeviation: 12.8 },
      { year: 2024, reer: 109.2, valuationDeviation: 7.9 },
      { year: 2026, reer: 108.6, valuationDeviation: 7.3 },
    ],
  },
];

/* =========================================================================
 * 3. Global Supply Chain Pressure Index (GSCPI) Data
 * Developed by the Federal Reserve Bank of New York (NY Fed).
 * Normalized to standard deviations from historical average (0 = neutral).
 * Combines 27 maritime, air, and PMI delivery variables.
 * ========================================================================= */
export const GSCPI_PROFILE_DATA: GscpiProfile = {
  currentStdDev: 0.28,
  status: 'normal',
  statusDescription: 'Supply chain friction has returned to historical equilibrium following post-pandemic logjam clearance and Cape of Good Hope rerouting adaptations.',
  historicalPercentile: 58.4,
  inflationTransmissionHorizonMonths: 4,
  components: [
    {
      id: 'maritime-container',
      name: 'Ocean Container Rates (Harpex / SCFI)',
      category: 'shipping_rates',
      currentValueStdDev: 0.45,
      trend: 'neutral',
      weightDescription: 'Primary maritime container transport cost index',
      description: 'Reflects 40ft container spot rates on major East-West corridors; elevated slightly by Red Sea bypassing around Africa.',
    },
    {
      id: 'baltic-dry',
      name: 'Baltic Dry Bulk Index',
      category: 'shipping_rates',
      currentValueStdDev: -0.15,
      trend: 'easing',
      weightDescription: 'Raw commodities (iron ore, coal, grain) shipping costs',
      description: 'Subdued Chinese real estate construction demand keeps iron ore capesize vessel demand modest.',
    },
    {
      id: 'air-freight',
      name: 'Global Air Cargo Yield Index',
      category: 'air_freight',
      currentValueStdDev: 0.32,
      trend: 'tightening',
      weightDescription: 'Cross-border high-value air logistics',
      description: 'E-commerce direct-from-factory demand from Asia to North America and Europe sustains firm cargo floor.',
    },
    {
      id: 'delivery-times',
      name: 'PMI Supplier Delivery Times (Global)',
      category: 'delivery_times',
      currentValueStdDev: 0.18,
      trend: 'neutral',
      weightDescription: 'Vendor performance diffusion metric across 7 economies',
      description: 'Delivery times have normalized near standard levels as factory lead-times stabilized across industrial hubs.',
    },
    {
      id: 'order-backlogs',
      name: 'PMI Backlogs of Work & Unfilled Orders',
      category: 'backlogs_inventories',
      currentValueStdDev: -0.22,
      trend: 'easing',
      weightDescription: 'Manufacturing order book excess capacity measure',
      description: 'Absence of order backlogs indicates suppliers have ample capacity to meet current durable goods demand.',
    },
  ],
  historicalSeries: [
    { period: '2019-06', stdDevLevel: -0.12, headlineCpiLaggedLead: 1.8, eventAnnotation: 'Pre-pandemic trade equilibrium' },
    { period: '2020-04', stdDevLevel: 1.95, headlineCpiLaggedLead: 0.3, eventAnnotation: 'COVID-19 global factory lockdowns' },
    { period: '2020-11', stdDevLevel: 0.85, headlineCpiLaggedLead: 1.2, eventAnnotation: 'Vaccine announcements & goods demand surge' },
    { period: '2021-06', stdDevLevel: 2.84, headlineCpiLaggedLead: 5.4, eventAnnotation: 'Severe port congestion in Los Angeles & Long Beach' },
    { period: '2021-12', stdDevLevel: 4.32, headlineCpiLaggedLead: 7.0, eventAnnotation: 'All-time GSCPI peak; global container shortage' },
    { period: '2022-06', stdDevLevel: 2.68, headlineCpiLaggedLead: 9.1, eventAnnotation: 'Supply bottlenecks peak; CPI headline reaches 9.1%' },
    { period: '2022-12', stdDevLevel: 1.05, headlineCpiLaggedLead: 6.5, eventAnnotation: 'Aggressive central bank rate hikes dampen goods demand' },
    { period: '2023-05', stdDevLevel: -1.28, headlineCpiLaggedLead: 4.0, eventAnnotation: 'Negative supply chain whiplash; inventory destocking' },
    { period: '2023-11', stdDevLevel: -0.42, headlineCpiLaggedLead: 3.1, eventAnnotation: 'Supply chain fluidity supports goods disinflation' },
    { period: '2024-02', stdDevLevel: 0.72, headlineCpiLaggedLead: 3.2, eventAnnotation: 'Houthi Red Sea vessel attacks force Cape detour' },
    { period: '2024-09', stdDevLevel: 0.35, headlineCpiLaggedLead: 2.4, eventAnnotation: 'Shipping lanes absorb extended transit schedules' },
    { period: '2025-06', stdDevLevel: 0.22, headlineCpiLaggedLead: 2.6, eventAnnotation: 'Nearshoring and bilateral trade route adjustments' },
    { period: '2026-03', stdDevLevel: 0.28, headlineCpiLaggedLead: 2.7, eventAnnotation: 'Current stabilized supply-side baseline' },
  ],
  methodologyNote: 'The NY Fed GSCPI strips out demand shocks using vector autoregressions (VAR) on manufacturing PMI surveys, isolating genuine supply disruptions that lead goods inflation by 3 to 6 months.',
};

/* =========================================================================
 * 4. Sovereign Capital Flow & US Treasury Holdings (TIC Data)
 * Source: US Department of the Treasury International Capital (TIC) System,
 * Federal Reserve Board Flow of Funds (Z.1), and IMF COFER database.
 * ========================================================================= */
export const CAPITAL_FLOWS_TIC_DATA: CapitalFlowsProfile = {
  totalForeignHoldingsBillion: 8520.0,
  latestNetForeignFlowMonthlyBillion: 38.4,
  foreignShareOfUsDebtPct: 23.4,
  foreignOfficialSharePct: 44.5,
  chinaHoldingsBillion: 768.5,
  japanHoldingsBillion: 1128.0,
  deDollarizationInsight: 'Foreign central banks own 44.5% of foreign Treasury holdings (down from >75% in 2010), with private institutional buyers from allied jurisdictions absorbing the gap as sovereign reserve managers diversify into physical gold.',
  holders: [
    {
      countryCode: 'JPN',
      countryName: 'Japan',
      flag: '🇯🇵',
      bloc: 'g7',
      holdingsBillionUSD: 1128.0,
      twelveMonthChangeBillionUSD: 15.4,
      shareOfForeignHoldingsPct: 13.2,
      shareOfTotalUsDebtPct: 3.1,
      dominantHolderType: 'foreign_official_reserve',
      strategicDirection: 'stable',
      rationale: 'Largest sovereign foreign creditor; Bank of Japan and Ministry of Finance hold Treasuries as primary FX intervention liquidity reserve.',
    },
    {
      countryCode: 'CHN',
      countryName: 'China',
      flag: '🇨🇳',
      bloc: 'brics',
      holdingsBillionUSD: 768.5,
      twelveMonthChangeBillionUSD: -48.2,
      shareOfForeignHoldingsPct: 9.0,
      shareOfTotalUsDebtPct: 2.1,
      dominantHolderType: 'foreign_official_reserve',
      strategicDirection: 'divesting',
      rationale: 'Structural multi-year reduction from >$1.3T peak (2013); State Administration of Foreign Exchange (SAFE) reallocates proceeds into physical gold and non-dollar sovereign infrastructure debt.',
    },
    {
      countryCode: 'GBR',
      countryName: 'United Kingdom',
      flag: '🇬🇧',
      bloc: 'g7',
      holdingsBillionUSD: 742.0,
      twelveMonthChangeBillionUSD: 68.5,
      shareOfForeignHoldingsPct: 8.7,
      shareOfTotalUsDebtPct: 2.0,
      dominantHolderType: 'private_offshore_custody',
      strategicDirection: 'accumulating',
      rationale: 'City of London serves as global Eurodollar capital and offshore hedge fund custody hub, intermediating international institutional flows.',
    },
    {
      countryCode: 'LUX',
      countryName: 'Luxembourg',
      flag: '🇱🇺',
      bloc: 'financial_center',
      holdingsBillionUSD: 395.0,
      twelveMonthChangeBillionUSD: 32.0,
      shareOfForeignHoldingsPct: 4.6,
      shareOfTotalUsDebtPct: 1.1,
      dominantHolderType: 'private_offshore_custody',
      strategicDirection: 'accumulating',
      rationale: 'Primary European cross-border investment fund center (UCITS), acting as clearinghouse for institutional asset managers worldwide.',
    },
    {
      countryCode: 'CAN',
      countryName: 'Canada',
      flag: '🇨🇦',
      bloc: 'g7',
      holdingsBillionUSD: 365.0,
      twelveMonthChangeBillionUSD: 24.5,
      shareOfForeignHoldingsPct: 4.3,
      shareOfTotalUsDebtPct: 1.0,
      dominantHolderType: 'institutional',
      strategicDirection: 'accumulating',
      rationale: 'Canadian pension funds (CPPIB, CDPQ) and banks maintain heavy allocations to high-yielding dollar sovereign paper.',
    },
    {
      countryCode: 'CYM',
      countryName: 'Cayman Islands',
      flag: '🇰🇾',
      bloc: 'financial_center',
      holdingsBillionUSD: 335.0,
      twelveMonthChangeBillionUSD: 18.2,
      shareOfForeignHoldingsPct: 3.9,
      shareOfTotalUsDebtPct: 0.9,
      dominantHolderType: 'private_offshore_custody',
      strategicDirection: 'accumulating',
      rationale: 'Domicile for international private equity, macro hedge funds, and sovereign wealth offshore subsidiary accounts.',
    },
    {
      countryCode: 'BEL',
      countryName: 'Belgium',
      flag: '🇧🇪',
      bloc: 'other',
      holdingsBillionUSD: 325.0,
      twelveMonthChangeBillionUSD: 12.0,
      shareOfForeignHoldingsPct: 3.8,
      shareOfTotalUsDebtPct: 0.9,
      dominantHolderType: 'private_offshore_custody',
      strategicDirection: 'stable',
      rationale: 'Home to Euroclear, the international central securities depository holding custodial sovereign assets for global central banks.',
    },
    {
      countryCode: 'CHE',
      countryName: 'Switzerland',
      flag: '🇨🇭',
      bloc: 'other',
      holdingsBillionUSD: 305.0,
      twelveMonthChangeBillionUSD: 8.5,
      shareOfForeignHoldingsPct: 3.6,
      shareOfTotalUsDebtPct: 0.8,
      dominantHolderType: 'foreign_official_reserve',
      strategicDirection: 'stable',
      rationale: 'Swiss National Bank (SNB) maintains extensive dollar bond holdings acquired during foreign exchange intervention operations.',
    },
    {
      countryCode: 'IND',
      countryName: 'India',
      flag: '🇮🇳',
      bloc: 'brics',
      holdingsBillionUSD: 242.0,
      twelveMonthChangeBillionUSD: 14.8,
      shareOfForeignHoldingsPct: 2.8,
      shareOfTotalUsDebtPct: 0.7,
      dominantHolderType: 'foreign_official_reserve',
      strategicDirection: 'accumulating',
      rationale: 'Reserve Bank of India expands foreign reserves in tandem with economic growth, maintaining diversified liquid Treasury holdings.',
    },
    {
      countryCode: 'BRA',
      countryName: 'Brazil',
      flag: '🇧🇷',
      bloc: 'brics',
      holdingsBillionUSD: 232.0,
      twelveMonthChangeBillionUSD: 5.2,
      shareOfForeignHoldingsPct: 2.7,
      shareOfTotalUsDebtPct: 0.6,
      dominantHolderType: 'foreign_official_reserve',
      strategicDirection: 'stable',
      rationale: 'Central Bank of Brazil stores the bulk of its external liquidity safety buffer in short- and medium-duration US Treasuries.',
    },
    {
      countryCode: 'SAU',
      countryName: 'Saudi Arabia',
      flag: '🇸🇦',
      bloc: 'brics',
      holdingsBillionUSD: 142.0,
      twelveMonthChangeBillionUSD: 11.2,
      shareOfForeignHoldingsPct: 1.7,
      shareOfTotalUsDebtPct: 0.4,
      dominantHolderType: 'foreign_official_reserve',
      strategicDirection: 'stable',
      rationale: 'Saudi Central Bank (SAMA) invests petrodollar proceeds directly into US debt to anchor the long-standing currency peg.',
    },
  ],
  historicalOwnership: [
    {
      year: 2000,
      totalMarketableDebtTrillion: 3.3,
      totalForeignHoldingsTrillion: 1.0,
      foreignSharePct: 30.3,
      foreignOfficialHoldingsTrillion: 0.75,
      foreignPrivateHoldingsTrillion: 0.25,
      foreignOfficialSharePct: 75.0,
      chinaHoldingsBillion: 60.0,
      japanHoldingsBillion: 320.0,
    },
    {
      year: 2008,
      totalMarketableDebtTrillion: 5.8,
      totalForeignHoldingsTrillion: 3.1,
      foreignSharePct: 53.4,
      foreignOfficialHoldingsTrillion: 2.25,
      foreignPrivateHoldingsTrillion: 0.85,
      foreignOfficialSharePct: 72.6,
      chinaHoldingsBillion: 727.0,
      japanHoldingsBillion: 626.0,
    },
    {
      year: 2013,
      totalMarketableDebtTrillion: 11.9,
      totalForeignHoldingsTrillion: 5.8,
      foreignSharePct: 48.7,
      foreignOfficialHoldingsTrillion: 4.10,
      foreignPrivateHoldingsTrillion: 1.70,
      foreignOfficialSharePct: 70.7,
      chinaHoldingsBillion: 1270.0,
      japanHoldingsBillion: 1180.0,
    },
    {
      year: 2018,
      totalMarketableDebtTrillion: 15.6,
      totalForeignHoldingsTrillion: 6.3,
      foreignSharePct: 40.4,
      foreignOfficialHoldingsTrillion: 3.90,
      foreignPrivateHoldingsTrillion: 2.40,
      foreignOfficialSharePct: 61.9,
      chinaHoldingsBillion: 1120.0,
      japanHoldingsBillion: 1040.0,
    },
    {
      year: 2021,
      totalMarketableDebtTrillion: 22.6,
      totalForeignHoldingsTrillion: 7.7,
      foreignSharePct: 34.1,
      foreignOfficialHoldingsTrillion: 4.15,
      foreignPrivateHoldingsTrillion: 3.55,
      foreignOfficialSharePct: 53.9,
      chinaHoldingsBillion: 1040.0,
      japanHoldingsBillion: 1300.0,
    },
    {
      year: 2024,
      totalMarketableDebtTrillion: 31.0,
      totalForeignHoldingsTrillion: 8.2,
      foreignSharePct: 26.5,
      foreignOfficialHoldingsTrillion: 3.80,
      foreignPrivateHoldingsTrillion: 4.40,
      foreignOfficialSharePct: 46.3,
      chinaHoldingsBillion: 780.0,
      japanHoldingsBillion: 1135.0,
    },
    {
      year: 2026,
      totalMarketableDebtTrillion: 36.4,
      totalForeignHoldingsTrillion: 8.52,
      foreignSharePct: 23.4,
      foreignOfficialHoldingsTrillion: 3.79,
      foreignPrivateHoldingsTrillion: 4.73,
      foreignOfficialSharePct: 44.5,
      chinaHoldingsBillion: 768.5,
      japanHoldingsBillion: 1128.0,
    },
  ],
  reserveDiversification: [
    { year: 2000, usdSharePct: 71.1, eurSharePct: 18.3, goldSharePct: 10.2, otherCurrenciesPct: 10.6 },
    { year: 2008, usdSharePct: 63.8, eurSharePct: 26.4, goldSharePct: 10.8, otherCurrenciesPct: 9.8 },
    { year: 2015, usdSharePct: 65.7, eurSharePct: 19.1, goldSharePct: 11.4, otherCurrenciesPct: 15.2 },
    { year: 2020, usdSharePct: 58.9, eurSharePct: 20.6, goldSharePct: 14.5, otherCurrenciesPct: 20.5 },
    { year: 2022, usdSharePct: 58.4, eurSharePct: 20.5, goldSharePct: 15.1, otherCurrenciesPct: 21.1 },
    { year: 2024, usdSharePct: 58.2, eurSharePct: 20.0, goldSharePct: 17.2, otherCurrenciesPct: 21.8 },
    { year: 2026, usdSharePct: 57.6, eurSharePct: 19.8, goldSharePct: 18.4, otherCurrenciesPct: 22.6 },
  ],
};
