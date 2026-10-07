import type {
  SovereignPmiProfile,
  ConferenceBoardLeiProfile,
  GdpNowcastingProfile,
  PmiExpansionStatus,
  LeiSignalStatus,
  LeiComponent,
} from '../lib/types';

/**
 * Evaluates whether a Purchasing Managers' Index reading represents business expansion or contraction.
 * The 50.0 neutral benchmark separates accelerating activity from contracting order books.
 */
export function classifyPmiStatus(value: number): PmiExpansionStatus {
  if (value > 50.0) return 'expansion';
  if (value < 50.0) return 'contraction';
  return 'stagnation';
}

/**
 * Evaluates the Conference Board Leading Economic Index using the 3D Rule (Duration, Depth, and Diffusion).
 * A 6-month annualized decline steeper than -4.0% accompanied by majority component deterioration
 * historically triggers a formal recession warning with high predictive reliability.
 */
export function classifyLeiSignal(
  sixMonthAnnualizedGrowthPct: number,
  diffusionIndex: number
): LeiSignalStatus {
  if (sixMonthAnnualizedGrowthPct <= -4.0 && diffusionIndex < 50) {
    return 'recession_signal';
  }
  if (sixMonthAnnualizedGrowthPct < 0.0) {
    return 'warning';
  }
  return 'expansion';
}

/**
 * Calculates diffusion across the 10 components to assess whether momentum is broad-based or isolated.
 */
export function calculateLeiDiffusionIndex(
  components: Array<{ netContribution: 'positive' | 'negative' | 'neutral' }>
): number {
  if (components.length === 0) return 0;
  const positiveCount = components.filter((c) => c.netContribution === 'positive').length;
  const neutralCount = components.filter((c) => c.netContribution === 'neutral').length;
  return Number((((positiveCount + 0.5 * neutralCount) / components.length) * 100).toFixed(1));
}

/**
 * Measures the high-frequency divergence between algorithmic nowcasts and consensus surveyor sentiment.
 * Positive divergence indicates incoming hard data is surprising economist surveys to the upside.
 */
export function calculateNowcastSurprise(nowcast: number, consensus: number): number {
  return Number((nowcast - consensus).toFixed(2));
}

/* =========================================================================
 * 1. Purchasing Managers' Index (PMI) Profiles
 * Global, US, Eurozone, China, UK, and Japan
 * ========================================================================= */

export const SOVEREIGN_PMI_PROFILES: SovereignPmiProfile[] = [
  {
    economyCode: 'GLOBAL',
    name: 'Global Aggregate',
    flag: '🌐',
    surveyProvider: 'J.P. Morgan / S&P Global',
    currentManufacturing: 50.5,
    currentServices: 53.2,
    currentComposite: 52.6,
    momChangeManufacturing: 0.3,
    momChangeServices: 0.4,
    manufacturingStatus: 'expansion',
    servicesStatus: 'expansion',
    compositeStatus: 'expansion',
    newOrdersToInventoryRatio: 1.06,
    subIndices: {
      newOrders: 52.1,
      output: 52.8,
      employment: 50.6,
      supplierDeliveries: 49.6,
      inputPrices: 54.3,
    },
    macroNote:
      'Global activity is anchored by persistent consumer service resilience, while manufacturing exits a 16-month destocking cycle driven by tech supply chain restocking and emerging market demand.',
    historicalSeries: [
      { period: '2021-Q1', manufacturing: 55.0, services: 54.7, composite: 54.8, newOrders: 56.2, inventories: 48.0 },
      { period: '2021-Q2', manufacturing: 56.0, services: 57.5, composite: 57.1, newOrders: 58.1, inventories: 49.2 },
      { period: '2021-Q3', manufacturing: 54.1, services: 53.8, composite: 53.9, newOrders: 54.5, inventories: 50.5 },
      { period: '2021-Q4', manufacturing: 54.2, services: 54.8, composite: 54.7, newOrders: 55.0, inventories: 51.0 },
      { period: '2022-Q1', manufacturing: 53.0, services: 53.4, composite: 53.3, newOrders: 52.8, inventories: 52.1 },
      { period: '2022-Q2', manufacturing: 52.4, services: 53.9, composite: 53.5, newOrders: 51.9, inventories: 52.4 },
      { period: '2022-Q3', manufacturing: 49.8, services: 50.0, composite: 49.9, newOrders: 48.7, inventories: 52.0 },
      { period: '2022-Q4', manufacturing: 48.6, services: 48.1, composite: 48.2, newOrders: 47.1, inventories: 51.8 },
      { period: '2023-Q1', manufacturing: 49.6, services: 54.4, composite: 53.4, newOrders: 51.2, inventories: 49.5 },
      { period: '2023-Q2', manufacturing: 48.8, services: 53.9, composite: 52.7, newOrders: 50.1, inventories: 48.9 },
      { period: '2023-Q3', manufacturing: 49.1, services: 50.8, composite: 50.5, newOrders: 49.6, inventories: 48.5 },
      { period: '2023-Q4', manufacturing: 49.0, services: 51.0, composite: 50.6, newOrders: 49.8, inventories: 48.2 },
      { period: '2024-Q1', manufacturing: 50.3, services: 52.5, composite: 52.1, newOrders: 51.4, inventories: 48.6 },
      { period: '2024-Q2', manufacturing: 50.9, services: 53.1, composite: 52.7, newOrders: 52.0, inventories: 49.0 },
      { period: '2024-Q3', manufacturing: 49.8, services: 52.9, composite: 52.3, newOrders: 51.0, inventories: 49.2 },
      { period: '2024-Q4', manufacturing: 50.1, services: 53.0, composite: 52.4, newOrders: 51.5, inventories: 49.1 },
      { period: '2025-Q1', manufacturing: 50.2, services: 52.8, composite: 52.3, newOrders: 51.6, inventories: 49.0 },
      { period: '2025-Q2', manufacturing: 50.4, services: 53.0, composite: 52.5, newOrders: 51.9, inventories: 48.9 },
      { period: '2025-Q3', manufacturing: 50.3, services: 53.1, composite: 52.5, newOrders: 51.8, inventories: 48.8 },
      { period: '2025-Q4', manufacturing: 50.4, services: 53.1, composite: 52.5, newOrders: 51.9, inventories: 48.9 },
      { period: '2026-Q1', manufacturing: 50.3, services: 53.0, composite: 52.4, newOrders: 51.8, inventories: 49.0 },
      { period: '2026-Q2', manufacturing: 50.4, services: 53.1, composite: 52.5, newOrders: 52.0, inventories: 48.9 },
      { period: '2026-Q3', manufacturing: 50.5, services: 53.2, composite: 52.6, newOrders: 52.1, inventories: 48.8 },
    ],
  },
  {
    economyCode: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    surveyProvider: 'ISM / S&P Global',
    currentManufacturing: 49.4,
    currentServices: 54.9,
    currentComposite: 53.8,
    momChangeManufacturing: 0.6,
    momChangeServices: 0.5,
    manufacturingStatus: 'contraction',
    servicesStatus: 'expansion',
    compositeStatus: 'expansion',
    newOrdersToInventoryRatio: 1.11,
    subIndices: {
      newOrders: 51.2,
      output: 53.4,
      employment: 49.8,
      supplierDeliveries: 51.4,
      inputPrices: 57.2,
    },
    macroNote:
      'A pronounced dual-speed economy: services expansion remains robust on stable household incomes, while capital-goods manufacturing oscillates near the 50 neutral mark amid elevated borrowing rates.',
    historicalSeries: [
      { period: '2021-Q1', manufacturing: 61.2, services: 60.1, composite: 60.3, newOrders: 64.2, inventories: 50.8 },
      { period: '2021-Q2', manufacturing: 61.5, services: 64.6, composite: 63.8, newOrders: 65.5, inventories: 51.2 },
      { period: '2021-Q3', manufacturing: 60.2, services: 61.7, composite: 61.4, newOrders: 62.0, inventories: 53.5 },
      { period: '2021-Q4', manufacturing: 59.8, services: 67.0, composite: 65.3, newOrders: 61.5, inventories: 54.2 },
      { period: '2022-Q1', manufacturing: 57.6, services: 58.3, composite: 58.1, newOrders: 57.0, inventories: 54.0 },
      { period: '2022-Q2', manufacturing: 53.0, services: 55.3, composite: 54.8, newOrders: 51.2, inventories: 54.5 },
      { period: '2022-Q3', manufacturing: 51.0, services: 56.7, composite: 55.4, newOrders: 49.2, inventories: 53.8 },
      { period: '2022-Q4', manufacturing: 48.4, services: 49.6, composite: 49.3, newOrders: 45.2, inventories: 51.8 },
      { period: '2023-Q1', manufacturing: 47.4, services: 55.1, composite: 53.3, newOrders: 46.5, inventories: 48.2 },
      { period: '2023-Q2', manufacturing: 46.9, services: 53.9, composite: 52.3, newOrders: 46.0, inventories: 46.8 },
      { period: '2023-Q3', manufacturing: 47.6, services: 53.6, composite: 52.2, newOrders: 47.2, inventories: 46.2 },
      { period: '2023-Q4', manufacturing: 47.4, services: 52.7, composite: 51.5, newOrders: 47.5, inventories: 45.5 },
      { period: '2024-Q1', manufacturing: 50.3, services: 51.4, composite: 51.1, newOrders: 51.4, inventories: 48.2 },
      { period: '2024-Q2', manufacturing: 48.7, services: 53.8, composite: 52.6, newOrders: 49.3, inventories: 47.5 },
      { period: '2024-Q3', manufacturing: 47.2, services: 54.9, composite: 53.2, newOrders: 47.8, inventories: 47.0 },
      { period: '2024-Q4', manufacturing: 48.4, services: 54.5, composite: 53.1, newOrders: 49.5, inventories: 46.8 },
      { period: '2025-Q1', manufacturing: 48.8, services: 54.4, composite: 53.2, newOrders: 50.1, inventories: 46.5 },
      { period: '2025-Q2', manufacturing: 49.1, services: 54.7, composite: 53.5, newOrders: 50.5, inventories: 46.2 },
      { period: '2025-Q3', manufacturing: 49.2, services: 54.8, composite: 53.6, newOrders: 50.8, inventories: 46.0 },
      { period: '2025-Q4', manufacturing: 49.3, services: 54.8, composite: 53.6, newOrders: 51.0, inventories: 45.9 },
      { period: '2026-Q1', manufacturing: 49.1, services: 54.6, composite: 53.4, newOrders: 50.9, inventories: 46.1 },
      { period: '2026-Q2', manufacturing: 49.2, services: 54.7, composite: 53.5, newOrders: 51.0, inventories: 46.0 },
      { period: '2026-Q3', manufacturing: 49.4, services: 54.9, composite: 53.8, newOrders: 51.2, inventories: 45.8 },
    ],
  },
  {
    economyCode: 'EA',
    name: 'Eurozone',
    flag: '🇪🇺',
    surveyProvider: 'HCOB / S&P Global',
    currentManufacturing: 46.2,
    currentServices: 51.8,
    currentComposite: 50.4,
    momChangeManufacturing: 0.4,
    momChangeServices: 0.2,
    manufacturingStatus: 'contraction',
    servicesStatus: 'expansion',
    compositeStatus: 'expansion',
    newOrdersToInventoryRatio: 0.95,
    subIndices: {
      newOrders: 48.0,
      output: 49.2,
      employment: 49.1,
      supplierDeliveries: 49.8,
      inputPrices: 52.4,
    },
    macroNote:
      'German industrial stagnation and high structural energy costs restrain Eurozone manufacturing below the 50 threshold, though Southern European services (Spain, Italy) sustain aggregate output.',
    historicalSeries: [
      { period: '2021-Q1', manufacturing: 57.9, services: 49.6, composite: 51.1, newOrders: 60.1, inventories: 47.0 },
      { period: '2021-Q2', manufacturing: 63.1, services: 58.3, composite: 59.5, newOrders: 64.5, inventories: 48.2 },
      { period: '2021-Q3', manufacturing: 60.5, services: 56.4, composite: 57.4, newOrders: 59.8, inventories: 50.1 },
      { period: '2021-Q4', manufacturing: 58.0, services: 53.1, composite: 54.3, newOrders: 56.2, inventories: 51.5 },
      { period: '2022-Q1', manufacturing: 56.5, services: 55.6, composite: 55.8, newOrders: 54.2, inventories: 52.8 },
      { period: '2022-Q2', manufacturing: 52.1, services: 53.0, composite: 52.8, newOrders: 49.5, inventories: 53.4 },
      { period: '2022-Q3', manufacturing: 48.4, services: 48.8, composite: 48.7, newOrders: 45.1, inventories: 53.0 },
      { period: '2022-Q4', manufacturing: 47.1, services: 49.8, composite: 49.3, newOrders: 44.0, inventories: 52.5 },
      { period: '2023-Q1', manufacturing: 47.3, services: 55.0, composite: 53.7, newOrders: 46.2, inventories: 50.1 },
      { period: '2023-Q2', manufacturing: 43.4, services: 52.0, composite: 49.9, newOrders: 42.1, inventories: 48.8 },
      { period: '2023-Q3', manufacturing: 43.1, services: 48.7, composite: 47.2, newOrders: 41.5, inventories: 47.9 },
      { period: '2023-Q4', manufacturing: 44.4, services: 48.8, composite: 47.6, newOrders: 43.0, inventories: 47.0 },
      { period: '2024-Q1', manufacturing: 46.1, services: 51.5, composite: 50.3, newOrders: 45.8, inventories: 47.2 },
      { period: '2024-Q2', manufacturing: 45.8, services: 52.8, composite: 51.3, newOrders: 46.2, inventories: 47.8 },
      { period: '2024-Q3', manufacturing: 45.0, services: 51.4, composite: 49.6, newOrders: 45.1, inventories: 48.0 },
      { period: '2024-Q4', manufacturing: 45.5, services: 51.5, composite: 49.9, newOrders: 46.5, inventories: 48.1 },
      { period: '2025-Q1', manufacturing: 45.8, services: 51.6, composite: 50.1, newOrders: 47.0, inventories: 48.2 },
      { period: '2025-Q2', manufacturing: 46.0, services: 51.7, composite: 50.2, newOrders: 47.4, inventories: 48.3 },
      { period: '2025-Q3', manufacturing: 46.1, services: 51.7, composite: 50.3, newOrders: 47.8, inventories: 48.2 },
      { period: '2025-Q4', manufacturing: 46.0, services: 51.7, composite: 50.3, newOrders: 47.7, inventories: 48.2 },
      { period: '2026-Q1', manufacturing: 46.1, services: 51.7, composite: 50.3, newOrders: 47.9, inventories: 48.1 },
      { period: '2026-Q2', manufacturing: 46.1, services: 51.8, composite: 50.4, newOrders: 48.0, inventories: 48.0 },
      { period: '2026-Q3', manufacturing: 46.2, services: 51.8, composite: 50.4, newOrders: 48.0, inventories: 48.0 },
    ],
  },
  {
    economyCode: 'CHN',
    name: 'China',
    flag: '🇨🇳',
    surveyProvider: 'NBS / Caixin',
    currentManufacturing: 51.2,
    currentServices: 52.0,
    currentComposite: 51.8,
    momChangeManufacturing: 0.5,
    momChangeServices: 0.3,
    manufacturingStatus: 'expansion',
    servicesStatus: 'expansion',
    compositeStatus: 'expansion',
    newOrdersToInventoryRatio: 1.04,
    subIndices: {
      newOrders: 51.8,
      output: 52.4,
      employment: 49.5,
      supplierDeliveries: 50.3,
      inputPrices: 49.8,
    },
    macroNote:
      'Targeted monetary easing and infrastructure bond issuance stabilize private export manufacturing (Caixin), overcoming domestic real estate property headwinds.',
    historicalSeries: [
      { period: '2021-Q1', manufacturing: 50.6, services: 54.3, composite: 53.1, newOrders: 51.5, inventories: 48.5 },
      { period: '2021-Q2', manufacturing: 50.9, services: 53.5, composite: 52.8, newOrders: 51.8, inventories: 49.0 },
      { period: '2021-Q3', manufacturing: 49.6, services: 50.0, composite: 49.9, newOrders: 49.5, inventories: 49.5 },
      { period: '2021-Q4', manufacturing: 50.3, services: 52.7, composite: 52.2, newOrders: 50.4, inventories: 49.2 },
      { period: '2022-Q1', manufacturing: 49.5, services: 48.4, composite: 48.8, newOrders: 48.8, inventories: 49.8 },
      { period: '2022-Q2', manufacturing: 50.2, services: 54.7, composite: 53.4, newOrders: 50.4, inventories: 49.4 },
      { period: '2022-Q3', manufacturing: 49.4, services: 50.6, composite: 50.4, newOrders: 49.2, inventories: 49.6 },
      { period: '2022-Q4', manufacturing: 47.0, services: 41.6, composite: 42.6, newOrders: 43.9, inventories: 48.2 },
      { period: '2023-Q1', manufacturing: 51.9, services: 58.2, composite: 57.0, newOrders: 53.6, inventories: 48.0 },
      { period: '2023-Q2', manufacturing: 49.0, services: 53.2, composite: 52.3, newOrders: 48.6, inventories: 49.2 },
      { period: '2023-Q3', manufacturing: 50.2, services: 50.9, composite: 50.9, newOrders: 50.5, inventories: 49.0 },
      { period: '2023-Q4', manufacturing: 49.0, services: 50.4, composite: 50.3, newOrders: 48.7, inventories: 49.5 },
      { period: '2024-Q1', manufacturing: 50.8, services: 53.0, composite: 52.7, newOrders: 51.1, inventories: 48.9 },
      { period: '2024-Q2', manufacturing: 49.5, services: 50.5, composite: 50.5, newOrders: 49.5, inventories: 49.2 },
      { period: '2024-Q3', manufacturing: 49.8, services: 50.3, composite: 50.3, newOrders: 49.9, inventories: 49.4 },
      { period: '2024-Q4', manufacturing: 50.3, services: 51.2, composite: 51.0, newOrders: 50.8, inventories: 49.1 },
      { period: '2025-Q1', manufacturing: 50.7, services: 51.5, composite: 51.3, newOrders: 51.2, inventories: 49.0 },
      { period: '2025-Q2', manufacturing: 51.0, services: 51.8, composite: 51.6, newOrders: 51.5, inventories: 48.8 },
      { period: '2025-Q3', manufacturing: 51.1, services: 51.9, composite: 51.7, newOrders: 51.6, inventories: 48.7 },
      { period: '2025-Q4', manufacturing: 51.1, services: 51.9, composite: 51.7, newOrders: 51.7, inventories: 48.6 },
      { period: '2026-Q1', manufacturing: 51.0, services: 51.8, composite: 51.6, newOrders: 51.6, inventories: 48.7 },
      { period: '2026-Q2', manufacturing: 51.1, services: 51.9, composite: 51.7, newOrders: 51.7, inventories: 48.6 },
      { period: '2026-Q3', manufacturing: 51.2, services: 52.0, composite: 51.8, newOrders: 51.8, inventories: 48.5 },
    ],
  },
  {
    economyCode: 'GBR',
    name: 'United Kingdom',
    flag: '🇬🇧',
    surveyProvider: 'S&P Global',
    currentManufacturing: 51.5,
    currentServices: 52.8,
    currentComposite: 52.5,
    momChangeManufacturing: 0.2,
    momChangeServices: 0.3,
    manufacturingStatus: 'expansion',
    servicesStatus: 'expansion',
    compositeStatus: 'expansion',
    newOrdersToInventoryRatio: 1.08,
    subIndices: {
      newOrders: 52.2,
      output: 52.6,
      employment: 50.2,
      supplierDeliveries: 49.4,
      inputPrices: 56.1,
    },
    macroNote:
      'UK private sector activity is expanding steadily, driven by resilient domestic service consumption and export order re-acceleration.',
    historicalSeries: [
      { period: '2023-Q1', manufacturing: 47.9, services: 52.9, composite: 52.2, newOrders: 48.5, inventories: 49.0 },
      { period: '2023-Q2', manufacturing: 46.5, services: 53.7, composite: 52.8, newOrders: 47.0, inventories: 48.5 },
      { period: '2023-Q3', manufacturing: 44.3, services: 49.3, composite: 48.5, newOrders: 44.5, inventories: 48.0 },
      { period: '2023-Q4', manufacturing: 46.2, services: 53.4, composite: 52.1, newOrders: 46.8, inventories: 47.5 },
      { period: '2024-Q1', manufacturing: 50.3, services: 53.1, composite: 52.8, newOrders: 50.8, inventories: 47.8 },
      { period: '2024-Q2', manufacturing: 50.9, services: 52.1, composite: 52.3, newOrders: 51.2, inventories: 48.0 },
      { period: '2024-Q3', manufacturing: 51.5, services: 52.4, composite: 52.6, newOrders: 51.8, inventories: 48.2 },
      { period: '2025-Q2', manufacturing: 51.4, services: 52.6, composite: 52.4, newOrders: 52.0, inventories: 48.1 },
      { period: '2026-Q3', manufacturing: 51.5, services: 52.8, composite: 52.5, newOrders: 52.2, inventories: 48.0 },
    ],
  },
  {
    economyCode: 'JPN',
    name: 'Japan',
    flag: '🇯🇵',
    surveyProvider: 'au Jibun Bank / S&P Global',
    currentManufacturing: 49.8,
    currentServices: 53.5,
    currentComposite: 52.4,
    momChangeManufacturing: 0.1,
    momChangeServices: 0.4,
    manufacturingStatus: 'contraction',
    servicesStatus: 'expansion',
    compositeStatus: 'expansion',
    newOrdersToInventoryRatio: 1.02,
    subIndices: {
      newOrders: 50.6,
      output: 51.5,
      employment: 51.0,
      supplierDeliveries: 49.1,
      inputPrices: 58.2,
    },
    macroNote:
      'Services benefit from robust inbound tourism and solid wage renegotiations (Shunto), while manufacturing hovers just below 50 due to auto safety certification halts and raw material costs.',
    historicalSeries: [
      { period: '2023-Q1', manufacturing: 49.2, services: 55.0, composite: 52.9, newOrders: 48.5, inventories: 50.2 },
      { period: '2023-Q2', manufacturing: 49.8, services: 54.0, composite: 52.1, newOrders: 49.2, inventories: 50.0 },
      { period: '2023-Q3', manufacturing: 48.5, services: 53.8, composite: 52.1, newOrders: 47.8, inventories: 49.8 },
      { period: '2023-Q4', manufacturing: 47.9, services: 51.5, composite: 50.0, newOrders: 47.2, inventories: 49.5 },
      { period: '2024-Q1', manufacturing: 48.2, services: 54.1, composite: 51.7, newOrders: 48.0, inventories: 49.2 },
      { period: '2024-Q2', manufacturing: 50.0, services: 53.8, composite: 52.6, newOrders: 49.8, inventories: 49.0 },
      { period: '2024-Q3', manufacturing: 49.7, services: 53.7, composite: 52.0, newOrders: 49.5, inventories: 48.9 },
      { period: '2025-Q2', manufacturing: 49.7, services: 53.4, composite: 52.2, newOrders: 50.1, inventories: 48.8 },
      { period: '2026-Q3', manufacturing: 49.8, services: 53.5, composite: 52.4, newOrders: 50.6, inventories: 48.7 },
    ],
  },
];

/* =========================================================================
 * 2. Conference Board Leading Economic Index (LEI) Profile
 * Tracks the 10 forward-looking components and the 3D Rule
 * ========================================================================= */

export const LEI_TEN_COMPONENTS: LeiComponent[] = [
  {
    id: 'mfg_hours',
    name: 'Avg Weekly Hours, Manufacturing',
    category: 'labor_manufacturing',
    latestValue: '40.1 hrs',
    sixMonthChangePct: -0.4,
    netContribution: 'negative',
    weightPct: 27.8,
    description: 'Firms cut worker hours before executing expensive layoffs when orders soften.',
    leadingMechanism: 'Leading indicator of factory production and initial labor market adjustments.',
  },
  {
    id: 'initial_claims',
    name: 'Avg Weekly Initial Unemployment Claims',
    category: 'labor_manufacturing',
    latestValue: '218k/wk (Inverted)',
    sixMonthChangePct: 1.8,
    netContribution: 'positive',
    weightPct: 3.3,
    description: 'Weekly jobless claims reflect immediate corporate layoff decisions nationwide.',
    leadingMechanism: 'Inverted series; subdued claims signal ongoing employer labor hoarding.',
  },
  {
    id: 'consumer_orders',
    name: 'Mfrs New Orders, Consumer Goods',
    category: 'housing_orders',
    latestValue: '$162.4B',
    sixMonthChangePct: -1.2,
    netContribution: 'negative',
    weightPct: 8.1,
    description: 'Wholesalers and retailers order goods months in advance of actual retail sales.',
    leadingMechanism: 'Direct precursor to assembly line throughput and freight freight volume.',
  },
  {
    id: 'ism_new_orders',
    name: 'ISM New Orders Index',
    category: 'housing_orders',
    latestValue: '51.2 pts',
    sixMonthChangePct: 3.4,
    netContribution: 'positive',
    weightPct: 16.5,
    description: 'Purchasing managers survey measuring future demand pipeline vs prior month.',
    leadingMechanism: 'Crosses above 50, signifying order book expansion after prior contraction.',
  },
  {
    id: 'capex_orders',
    name: 'Mfrs New Orders, Nondefense CapEx (ex-Aircraft)',
    category: 'housing_orders',
    latestValue: '$74.1B',
    sixMonthChangePct: 0.9,
    netContribution: 'positive',
    weightPct: 4.0,
    description: 'Core capital goods orders measure corporate appetite for long-term investments.',
    leadingMechanism: 'Serves as the cleanest proxy for business expansion and machine tooling.',
  },
  {
    id: 'building_permits',
    name: 'Building Permits for New Private Housing',
    category: 'housing_orders',
    latestValue: '1.42M annualized',
    sixMonthChangePct: -2.6,
    netContribution: 'negative',
    weightPct: 2.7,
    description: 'Permits precede residential ground-breakings, construction hiring, and appliance demand.',
    leadingMechanism: 'High mortgage rates slow permit filings, creating a medium-term construction drag.',
  },
  {
    id: 'sp500',
    name: 'S&P 500 Stock Price Index',
    category: 'financial',
    latestValue: '5,865 pts',
    sixMonthChangePct: 11.2,
    netContribution: 'positive',
    weightPct: 3.9,
    description: 'Equity prices discount forward corporate earnings, cash flows, and liquidity conditions.',
    leadingMechanism: 'Strong market returns bolster consumer balance sheets via wealth effects.',
  },
  {
    id: 'credit_index',
    name: 'Leading Credit Index (LCI)',
    category: 'financial',
    latestValue: '-0.38 (Inverted)',
    sixMonthChangePct: 2.1,
    netContribution: 'positive',
    weightPct: 8.3,
    description: 'Aggregates commercial paper spreads, interbank lending, and bank loan officer surveys.',
    leadingMechanism: 'Credit conditions dictate business borrowing capacity before economic slowdowns manifest.',
  },
  {
    id: 'yield_spread',
    name: 'Interest Rate Spread (10Y minus Fed Funds)',
    category: 'financial',
    latestValue: '-0.42% (Un-inverting)',
    sixMonthChangePct: -1.8,
    netContribution: 'negative',
    weightPct: 10.7,
    description: 'The sovereign yield curve term premium historically inverts prior to recessions.',
    leadingMechanism: 'Restricted term spread continues to drag the composite index until full re-steepening.',
  },
  {
    id: 'consumer_expectations',
    name: 'Consumer Expectations for Business Conditions',
    category: 'expectations',
    latestValue: '74.2 pts',
    sixMonthChangePct: -3.5,
    netContribution: 'negative',
    weightPct: 14.7,
    description: 'University of Michigan survey tracking household expectations over the next 6-12 months.',
    leadingMechanism: 'Pessimistic future expectations foreshadow defensive household precautionary saving.',
  },
];

export const CONFERENCE_BOARD_LEI_DATA: ConferenceBoardLeiProfile = {
  currentIndexLevel: 100.4,
  momChangePct: -0.2,
  sixMonthAnnualizedGrowthPct: -2.8,
  signalStatus: 'warning',
  diffusionIndex: 50.0,
  components: LEI_TEN_COMPONENTS,
  threeDRuleNote:
    'The Conference Board 3D Rule evaluates Duration (months of decline), Depth (annualized rate <= -4.0%), and Diffusion (percent of contracting components). At -2.8% annualized, the index has exited the formal recession signal zone but remains in the warning corridor.',
  historicalSeries: [
    { date: '2007-06', indexLevel: 108.5, sixMonthAnnualizedGrowth: -1.2, isRecessionSignal: false, diffusionIndex: 60.0 },
    { date: '2007-12', indexLevel: 105.2, sixMonthAnnualizedGrowth: -4.8, isRecessionSignal: true, diffusionIndex: 30.0 },
    { date: '2008-06', indexLevel: 100.1, sixMonthAnnualizedGrowth: -7.5, isRecessionSignal: true, diffusionIndex: 20.0 },
    { date: '2008-12', indexLevel: 93.0, sixMonthAnnualizedGrowth: -12.4, isRecessionSignal: true, diffusionIndex: 10.0 },
    { date: '2009-06', indexLevel: 94.8, sixMonthAnnualizedGrowth: 3.5, isRecessionSignal: false, diffusionIndex: 70.0 },
    { date: '2019-12', indexLevel: 111.4, sixMonthAnnualizedGrowth: 0.8, isRecessionSignal: false, diffusionIndex: 65.0 },
    { date: '2020-03', indexLevel: 103.8, sixMonthAnnualizedGrowth: -14.2, isRecessionSignal: true, diffusionIndex: 10.0 },
    { date: '2020-06', indexLevel: 106.2, sixMonthAnnualizedGrowth: 4.8, isRecessionSignal: false, diffusionIndex: 80.0 },
    { date: '2021-12', indexLevel: 119.5, sixMonthAnnualizedGrowth: 7.2, isRecessionSignal: false, diffusionIndex: 90.0 },
    { date: '2022-06', indexLevel: 115.8, sixMonthAnnualizedGrowth: -2.2, isRecessionSignal: false, diffusionIndex: 45.0 },
    { date: '2022-12', indexLevel: 111.0, sixMonthAnnualizedGrowth: -6.4, isRecessionSignal: true, diffusionIndex: 25.0 },
    { date: '2023-06', indexLevel: 106.5, sixMonthAnnualizedGrowth: -7.8, isRecessionSignal: true, diffusionIndex: 20.0 },
    { date: '2023-12', indexLevel: 103.2, sixMonthAnnualizedGrowth: -5.4, isRecessionSignal: true, diffusionIndex: 30.0 },
    { date: '2024-06', indexLevel: 101.5, sixMonthAnnualizedGrowth: -4.1, isRecessionSignal: true, diffusionIndex: 35.0 },
    { date: '2024-12', indexLevel: 100.8, sixMonthAnnualizedGrowth: -3.5, isRecessionSignal: false, diffusionIndex: 45.0 },
    { date: '2025-06', indexLevel: 100.6, sixMonthAnnualizedGrowth: -3.1, isRecessionSignal: false, diffusionIndex: 45.0 },
    { date: '2025-12', indexLevel: 100.5, sixMonthAnnualizedGrowth: -2.9, isRecessionSignal: false, diffusionIndex: 50.0 },
    { date: '2026-06', indexLevel: 100.4, sixMonthAnnualizedGrowth: -2.8, isRecessionSignal: false, diffusionIndex: 50.0 },
  ],
};

/* =========================================================================
 * 3. High-Frequency GDP Nowcasting
 * Atlanta Fed GDPNow, NY Fed Nowcast, Consensus, & Official BEA Releases
 * ========================================================================= */

export const GDP_NOWCAST_DATA: GdpNowcastingProfile = {
  currentQuarter: '2026-Q3',
  gdpNowEstimate: 2.7,
  nyFedEstimate: 2.3,
  blueChipConsensus: 1.9,
  trailingOfficialGdp: 3.0,
  trailingOfficialQuarter: '2026-Q2',
  officialReleaseLagDays: 75,
  lastNowcastUpdate: '2026-09-27',
  sectorContributions: {
    personalConsumption: 1.85,
    privateInvestment: 0.45,
    governmentSpending: 0.55,
    netExports: -0.15,
  },
  revisionEvolution: [
    { date: '07/15', estimate: 1.9, catalyst: 'Initial Baseline Nowcast model initiation', impact: 0.0 },
    { date: '07/26', estimate: 2.2, catalyst: 'Advance Durable Goods & Nondefense CapEx Shipments', impact: 0.3 },
    { date: '08/02', estimate: 2.1, catalyst: 'Bureau of Labor Statistics Employment Situation (Payroll hours)', impact: -0.1 },
    { date: '08/15', estimate: 2.6, catalyst: 'US Census Bureau Retail Sales & Food Services Outperformance', impact: 0.5 },
    { date: '08/20', estimate: 2.5, catalyst: 'Housing Starts & Residential Construction Permitting softening', impact: -0.1 },
    { date: '09/04', estimate: 2.4, catalyst: 'ISM Manufacturing & Services Activity Indices', impact: -0.1 },
    { date: '09/18', estimate: 2.6, catalyst: 'Federal Reserve Industrial Production & Capacity Utilization', impact: 0.2 },
    { date: '09/27', estimate: 2.7, catalyst: 'BEA Personal Income and Outlays (Real Consumer Spending)', impact: 0.1 },
  ],
  quarterlyComparison: [
    { quarter: '2024-Q1', atlantaFedGdpNow: 2.8, nyFedNowcast: 2.4, blueChipConsensus: 1.5, officialBeaGdp: 1.6, isQuarterClosed: true },
    { quarter: '2024-Q2', atlantaFedGdpNow: 3.1, nyFedNowcast: 2.9, blueChipConsensus: 2.2, officialBeaGdp: 3.0, isQuarterClosed: true },
    { quarter: '2024-Q3', atlantaFedGdpNow: 2.7, nyFedNowcast: 2.5, blueChipConsensus: 2.0, officialBeaGdp: 2.8, isQuarterClosed: true },
    { quarter: '2024-Q4', atlantaFedGdpNow: 2.3, nyFedNowcast: 2.1, blueChipConsensus: 1.9, officialBeaGdp: 2.3, isQuarterClosed: true },
    { quarter: '2025-Q1', atlantaFedGdpNow: 2.2, nyFedNowcast: 2.0, blueChipConsensus: 1.7, officialBeaGdp: 2.1, isQuarterClosed: true },
    { quarter: '2025-Q2', atlantaFedGdpNow: 2.6, nyFedNowcast: 2.4, blueChipConsensus: 2.0, officialBeaGdp: 2.7, isQuarterClosed: true },
    { quarter: '2025-Q3', atlantaFedGdpNow: 2.8, nyFedNowcast: 2.5, blueChipConsensus: 2.1, officialBeaGdp: 2.9, isQuarterClosed: true },
    { quarter: '2025-Q4', atlantaFedGdpNow: 2.4, nyFedNowcast: 2.2, blueChipConsensus: 1.8, officialBeaGdp: 2.5, isQuarterClosed: true },
    { quarter: '2026-Q1', atlantaFedGdpNow: 2.5, nyFedNowcast: 2.3, blueChipConsensus: 1.8, officialBeaGdp: 2.6, isQuarterClosed: true },
    { quarter: '2026-Q2', atlantaFedGdpNow: 3.0, nyFedNowcast: 2.8, blueChipConsensus: 2.3, officialBeaGdp: 3.0, isQuarterClosed: true },
    { quarter: '2026-Q3', atlantaFedGdpNow: 2.7, nyFedNowcast: 2.3, blueChipConsensus: 1.9, officialBeaGdp: null, isQuarterClosed: false },
  ],
  methodologyNote:
    'Atlanta Fed GDPNow is a purely mathematical, subjective-forecast-free model that aggregates dozens of high-frequency sub-reports as they are published by the US Census Bureau, BLS, and Fed. It updates continuously up to the official BEA Advance release date.',
};
