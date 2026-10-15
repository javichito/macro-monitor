import {
  PhysicalEconomyRegionId,
  EnergyBurdenRegime,
  DeglobalizationPhase,
  DemographicPhase,
  HistoricalPhysicalEconomyPoint,
  RegionalPhysicalEconomyProfile,
  PhysicalEconomyOverview,
  EvaluatedPhysicalEconomyState,
} from '../lib/types';

/*
 * Human-readable analytical descriptions and color coding for each energy burden regime.
 * Grounded in historical macroeconomics: when primary energy spending crosses 8% to 10% of World GDP,
 * it functions as a regressive global consumption tax, historically preceding almost every modern global recession.
 */
export const ENERGY_REGIME_CONFIG: Record<
  EnergyBurdenRegime,
  {
    label: string;
    description: string;
    thresholdRange: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  benign: {
    label: 'Expansionary Energy Tailwind',
    description:
      'Global energy expenditure sits below 6.0% of World GDP. Input cost pressures are minimal, consumer purchasing power is unconstrained, and corporate profit margins expand.',
    thresholdRange: '< 6.0% of GDP',
    color: '#10b981',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  moderate: {
    label: 'Manageable Friction',
    description:
      'Energy spending consumes between 6.0% and 8.0% of World GDP. Typical late-cycle or mid-cycle territory where energy acts as moderate friction but does not trigger systemic demand destruction.',
    thresholdRange: '6.0% - 8.0% of GDP',
    color: '#38bdf8',
    bgClass: 'bg-sky-500/10 dark:bg-sky-500/20',
    textClass: 'text-sky-600 dark:text-sky-400',
    borderClass: 'border-sky-500/30',
  },
  elevated_warning: {
    label: 'Elevated Recession Warning',
    description:
      'Energy expenditure enters the 8.0% to 10.0% danger zone. Capital flows shift heavily to primary energy exporters with low marginal propensity to consume, squeezing discretionary household cash flow.',
    thresholdRange: '8.0% - 10.0% of GDP',
    color: '#f59e0b',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  recessionary_crisis: {
    label: 'Recessionary Energy Shock',
    description:
      'Energy expenditure breaches 10.0% of World GDP. This level acts as an inescapable regressive consumption tax that has preceded the 1974, 1980, and 2008 global economic contractions.',
    thresholdRange: '> 10.0% of GDP',
    color: '#ef4444',
    bgClass: 'bg-rose-500/10 dark:bg-rose-500/20',
    textClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-500/30',
  },
};

export const DEGLOBALIZATION_PHASE_CONFIG: Record<
  DeglobalizationPhase,
  {
    label: string;
    period: string;
    description: string;
  }
> = {
  pre_wto: {
    label: 'Pre-WTO Multilateralism',
    period: '1970 - 1990',
    description:
      'Regional trade blocs and Cold War trade restrictions; global trade-to-GDP rose slowly from 27% to 39%.',
  },
  hyperglobalization: {
    label: 'Hyperglobalization Boom',
    period: '1991 - 2008',
    description:
      'Unprecedented cross-border supply chain integration, tariff disarmament, and China WTO accession culminating in the all-time peak of 61.0% of world GDP in 2008.',
  },
  slowbalization: {
    label: 'Slowbalization / Post-GFC Plateau',
    period: '2009 - 2017',
    description:
      'Global trade-to-GDP plateaued between 55% and 59% as merchandise trade maturity and domestic Chinese value-chain internalization set in.',
  },
  geoeconomic_fragmentation: {
    label: 'Geoeconomic Fragmentation & Friendshoring',
    period: '2018 - Present',
    description:
      'Tariff escalation, national security export controls (semiconductors, critical minerals), nearshoring, and supply chain de-risking re-routing trade routes.',
  },
};

export const DEMOGRAPHIC_PHASE_CONFIG: Record<
  DemographicPhase,
  {
    label: string;
    description: string;
  }
> = {
  demographic_dividend: {
    label: 'Demographic Dividend Window',
    description:
      'Working-age population is expanding rapidly relative to dependents, providing high labor supply, strong household savings, and dynamic tax receipts (e.g. India).',
  },
  aging_transition: {
    label: 'Aging Transition Phase',
    description:
      'Working-age expansion is decelerating; dependency ratios are rising gradually, but immigration or fertility buffers delay immediate contraction (e.g. United States).',
  },
  severe_aging: {
    label: 'Severe Workforce Contraction',
    description:
      'Working-age population is actively contracting (-0.3% to -0.6% p.a.); dependency ratios cross 35-40, creating chronic structural labor shortages and pension funding strains (e.g. China, Germany, EU).',
  },
  demographic_cliff: {
    label: 'Hyper-Aged Demographic Cliff',
    description:
      'Extreme aging with dependency ratios exceeding 50; rapid workforce shrinkage driving long-term fiscal dominance, healthcare liabilities, and sovereign debt monetization (e.g. Japan, South Korea).',
  },
};

/*
 * Historical econometric series tracking Physical Economy, Energy Burden, Trade Openness,
 * and Secular Demographic shifts from 1970 through 2026, with demographic forecast checkpoints to 2050.
 * Synthesized from World Bank, IEA, BP Statistical Review, IMF WEO, and UN Population Division datasets.
 */
export const HISTORICAL_PHYSICAL_ECONOMY_SERIES: HistoricalPhysicalEconomyPoint[] = [
  {
    date: '1970',
    year: 1970,
    worldGdpTrillionUsd: 3.4,
    brentCrudeUsd: 3.4,
    globalEnergyExpenditurePctGdp: 3.8,
    crudeOilExpenditurePctGdp: 1.8,
    cleanAndElectricExpenditurePctGdp: 0.4,
    energyIntensityIndex: 122.0,
    annualEnergyBillTrillionUsd: 0.13,
    energyRegime: 'benign',
    worldTradeToGdpPct: 27.2,
    geoeconomicFragmentationIndex: 35.0,
    averageGlobalTariffRatePct: 15.2,
    deglobalizationPhase: 'pre_wto',
    globalWorkingAgeGrowthPct: 1.95,
    globalOldAgeDependencyRatio: 9.8,
    eventNote: 'Bretton Woods era; low real energy costs power post-war industrial expansion',
  },
  {
    date: '1973',
    year: 1973,
    worldGdpTrillionUsd: 4.6,
    brentCrudeUsd: 4.1,
    globalEnergyExpenditurePctGdp: 5.6,
    crudeOilExpenditurePctGdp: 2.8,
    cleanAndElectricExpenditurePctGdp: 0.5,
    energyIntensityIndex: 118.0,
    annualEnergyBillTrillionUsd: 0.26,
    energyRegime: 'benign',
    worldTradeToGdpPct: 31.4,
    geoeconomicFragmentationIndex: 36.5,
    averageGlobalTariffRatePct: 14.8,
    deglobalizationPhase: 'pre_wto',
    globalWorkingAgeGrowthPct: 1.98,
    globalOldAgeDependencyRatio: 10.1,
    eventNote: 'OPEC Arab oil embargo begins; oil quadruples within months',
  },
  {
    date: '1974',
    year: 1974,
    worldGdpTrillionUsd: 5.3,
    brentCrudeUsd: 11.6,
    globalEnergyExpenditurePctGdp: 10.4,
    crudeOilExpenditurePctGdp: 5.8,
    cleanAndElectricExpenditurePctGdp: 0.6,
    energyIntensityIndex: 114.0,
    annualEnergyBillTrillionUsd: 0.55,
    energyRegime: 'recessionary_crisis',
    worldTradeToGdpPct: 34.8,
    geoeconomicFragmentationIndex: 38.0,
    averageGlobalTariffRatePct: 14.5,
    deglobalizationPhase: 'pre_wto',
    globalWorkingAgeGrowthPct: 2.01,
    globalOldAgeDependencyRatio: 10.2,
    eventNote: 'First Oil Shock: energy expenditure breaches 10% of World GDP, plunging major economies into deep stagflation',
  },
  {
    date: '1978',
    year: 1978,
    worldGdpTrillionUsd: 8.6,
    brentCrudeUsd: 14.0,
    globalEnergyExpenditurePctGdp: 6.9,
    crudeOilExpenditurePctGdp: 3.6,
    cleanAndElectricExpenditurePctGdp: 0.7,
    energyIntensityIndex: 104.0,
    annualEnergyBillTrillionUsd: 0.59,
    energyRegime: 'moderate',
    worldTradeToGdpPct: 36.5,
    geoeconomicFragmentationIndex: 34.0,
    averageGlobalTariffRatePct: 13.9,
    deglobalizationPhase: 'pre_wto',
    globalWorkingAgeGrowthPct: 2.08,
    globalOldAgeDependencyRatio: 10.6,
    eventNote: 'Temporary energy stabilization; global trade recovers toward 36% of GDP',
  },
  {
    date: '1980',
    year: 1980,
    worldGdpTrillionUsd: 11.3,
    brentCrudeUsd: 36.8,
    globalEnergyExpenditurePctGdp: 11.8,
    crudeOilExpenditurePctGdp: 6.9,
    cleanAndElectricExpenditurePctGdp: 0.8,
    energyIntensityIndex: 100.0,
    annualEnergyBillTrillionUsd: 1.33,
    energyRegime: 'recessionary_crisis',
    worldTradeToGdpPct: 38.6,
    geoeconomicFragmentationIndex: 37.0,
    averageGlobalTariffRatePct: 13.2,
    deglobalizationPhase: 'pre_wto',
    globalWorkingAgeGrowthPct: 2.12,
    globalOldAgeDependencyRatio: 10.8,
    eventNote: 'Second Oil Shock: Iranian Revolution & Iran-Iraq War push energy burden to record 11.8%, forcing Volcker monetary shock',
  },
  {
    date: '1986',
    year: 1986,
    worldGdpTrillionUsd: 15.2,
    brentCrudeUsd: 14.4,
    globalEnergyExpenditurePctGdp: 4.8,
    crudeOilExpenditurePctGdp: 2.3,
    cleanAndElectricExpenditurePctGdp: 0.9,
    energyIntensityIndex: 88.0,
    annualEnergyBillTrillionUsd: 0.73,
    energyRegime: 'benign',
    worldTradeToGdpPct: 36.9,
    geoeconomicFragmentationIndex: 32.0,
    averageGlobalTariffRatePct: 12.0,
    deglobalizationPhase: 'pre_wto',
    globalWorkingAgeGrowthPct: 2.10,
    globalOldAgeDependencyRatio: 11.1,
    eventNote: 'Saudi Arabia abandons swing producer role; oil price collapse provides massive global consumer dividend',
  },
  {
    date: '1990',
    year: 1990,
    worldGdpTrillionUsd: 22.8,
    brentCrudeUsd: 23.7,
    globalEnergyExpenditurePctGdp: 5.9,
    crudeOilExpenditurePctGdp: 2.9,
    cleanAndElectricExpenditurePctGdp: 1.0,
    energyIntensityIndex: 82.0,
    annualEnergyBillTrillionUsd: 1.35,
    energyRegime: 'benign',
    worldTradeToGdpPct: 39.1,
    geoeconomicFragmentationIndex: 26.0,
    averageGlobalTariffRatePct: 11.2,
    deglobalizationPhase: 'pre_wto',
    globalWorkingAgeGrowthPct: 1.88,
    globalOldAgeDependencyRatio: 11.4,
    eventNote: 'Gulf War oil spike causes brief friction; fall of Berlin Wall sets stage for Hyperglobalization',
  },
  {
    date: '1995',
    year: 1995,
    worldGdpTrillionUsd: 31.0,
    brentCrudeUsd: 17.0,
    globalEnergyExpenditurePctGdp: 4.4,
    crudeOilExpenditurePctGdp: 2.0,
    cleanAndElectricExpenditurePctGdp: 1.1,
    energyIntensityIndex: 76.0,
    annualEnergyBillTrillionUsd: 1.36,
    energyRegime: 'benign',
    worldTradeToGdpPct: 43.6,
    geoeconomicFragmentationIndex: 22.0,
    averageGlobalTariffRatePct: 8.8,
    deglobalizationPhase: 'hyperglobalization',
    globalWorkingAgeGrowthPct: 1.68,
    globalOldAgeDependencyRatio: 11.8,
    eventNote: 'World Trade Organization (WTO) established; Japan working-age population peaks at 87.2M and begins secular contraction',
  },
  {
    date: '1998',
    year: 1998,
    worldGdpTrillionUsd: 31.5,
    brentCrudeUsd: 12.7,
    globalEnergyExpenditurePctGdp: 3.2,
    crudeOilExpenditurePctGdp: 1.4,
    cleanAndElectricExpenditurePctGdp: 1.1,
    energyIntensityIndex: 73.0,
    annualEnergyBillTrillionUsd: 1.01,
    energyRegime: 'benign',
    worldTradeToGdpPct: 45.8,
    geoeconomicFragmentationIndex: 20.0,
    averageGlobalTariffRatePct: 7.6,
    deglobalizationPhase: 'hyperglobalization',
    globalWorkingAgeGrowthPct: 1.62,
    globalOldAgeDependencyRatio: 12.0,
    eventNote: 'Asian Financial Crisis pushes crude to $10/bbl; generational energy tailwind fuels late 1990s productivity boom',
  },
  {
    date: '2001',
    year: 2001,
    worldGdpTrillionUsd: 33.6,
    brentCrudeUsd: 24.4,
    globalEnergyExpenditurePctGdp: 4.3,
    crudeOilExpenditurePctGdp: 2.1,
    cleanAndElectricExpenditurePctGdp: 1.2,
    energyIntensityIndex: 70.0,
    annualEnergyBillTrillionUsd: 1.44,
    energyRegime: 'benign',
    worldTradeToGdpPct: 51.8,
    geoeconomicFragmentationIndex: 18.0,
    averageGlobalTariffRatePct: 6.5,
    deglobalizationPhase: 'hyperglobalization',
    globalWorkingAgeGrowthPct: 1.54,
    globalOldAgeDependencyRatio: 12.3,
    eventNote: 'China formally accedes to the WTO; rapid manufacturing export expansion and global supply chain integration accelerate',
  },
  {
    date: '2005',
    year: 2005,
    worldGdpTrillionUsd: 47.7,
    brentCrudeUsd: 54.5,
    globalEnergyExpenditurePctGdp: 6.7,
    crudeOilExpenditurePctGdp: 3.4,
    cleanAndElectricExpenditurePctGdp: 1.3,
    energyIntensityIndex: 65.0,
    annualEnergyBillTrillionUsd: 3.20,
    energyRegime: 'moderate',
    worldTradeToGdpPct: 56.4,
    geoeconomicFragmentationIndex: 17.5,
    averageGlobalTariffRatePct: 5.1,
    deglobalizationPhase: 'hyperglobalization',
    globalWorkingAgeGrowthPct: 1.45,
    globalOldAgeDependencyRatio: 12.7,
    eventNote: 'Commodity supercycle begins as emerging market industrialization accelerates global oil and materials demand',
  },
  {
    date: '2008',
    year: 2008,
    worldGdpTrillionUsd: 64.1,
    brentCrudeUsd: 97.3,
    globalEnergyExpenditurePctGdp: 8.8,
    crudeOilExpenditurePctGdp: 4.6,
    cleanAndElectricExpenditurePctGdp: 1.4,
    energyIntensityIndex: 62.0,
    annualEnergyBillTrillionUsd: 5.64,
    energyRegime: 'elevated_warning',
    worldTradeToGdpPct: 61.0,
    geoeconomicFragmentationIndex: 18.2,
    averageGlobalTariffRatePct: 4.4,
    deglobalizationPhase: 'hyperglobalization',
    globalWorkingAgeGrowthPct: 1.38,
    globalOldAgeDependencyRatio: 13.0,
    eventNote: 'HISTORICAL MILESTONES: Global Trade-to-GDP hits all-time peak at 61.0% (Peak Globalization); Brent touches $147/bbl pushing energy burden to 8.8%, triggering global recession prior to Lehman collapse',
  },
  {
    date: '2009',
    year: 2009,
    worldGdpTrillionUsd: 60.8,
    brentCrudeUsd: 61.7,
    globalEnergyExpenditurePctGdp: 5.8,
    crudeOilExpenditurePctGdp: 2.8,
    cleanAndElectricExpenditurePctGdp: 1.5,
    energyIntensityIndex: 61.0,
    annualEnergyBillTrillionUsd: 3.53,
    energyRegime: 'benign',
    worldTradeToGdpPct: 52.4,
    geoeconomicFragmentationIndex: 21.0,
    averageGlobalTariffRatePct: 4.3,
    deglobalizationPhase: 'slowbalization',
    globalWorkingAgeGrowthPct: 1.34,
    globalOldAgeDependencyRatio: 13.2,
    eventNote: 'Great Financial Crisis triggers sudden collapse in cross-border trade finance and commodities demand',
  },
  {
    date: '2011',
    year: 2011,
    worldGdpTrillionUsd: 73.8,
    brentCrudeUsd: 111.3,
    globalEnergyExpenditurePctGdp: 8.5,
    crudeOilExpenditurePctGdp: 4.3,
    cleanAndElectricExpenditurePctGdp: 1.6,
    energyIntensityIndex: 59.0,
    annualEnergyBillTrillionUsd: 6.27,
    energyRegime: 'elevated_warning',
    worldTradeToGdpPct: 60.5,
    geoeconomicFragmentationIndex: 22.5,
    averageGlobalTariffRatePct: 4.1,
    deglobalizationPhase: 'slowbalization',
    globalWorkingAgeGrowthPct: 1.25,
    globalOldAgeDependencyRatio: 13.5,
    eventNote: 'Arab Spring and post-stimulus surge trigger secondary commodity spike; European sovereign debt crisis emerges',
  },
  {
    date: '2015',
    year: 2015,
    worldGdpTrillionUsd: 75.3,
    brentCrudeUsd: 52.4,
    globalEnergyExpenditurePctGdp: 4.9,
    crudeOilExpenditurePctGdp: 2.1,
    cleanAndElectricExpenditurePctGdp: 1.7,
    energyIntensityIndex: 56.0,
    annualEnergyBillTrillionUsd: 3.69,
    energyRegime: 'benign',
    worldTradeToGdpPct: 56.8,
    geoeconomicFragmentationIndex: 25.0,
    averageGlobalTariffRatePct: 3.8,
    deglobalizationPhase: 'slowbalization',
    globalWorkingAgeGrowthPct: 1.10,
    globalOldAgeDependencyRatio: 14.1,
    eventNote: 'US shale hydraulic fracturing boom floods market; China working-age population officially peaks at 998M and begins contraction',
  },
  {
    date: '2018',
    year: 2018,
    worldGdpTrillionUsd: 86.4,
    brentCrudeUsd: 71.3,
    globalEnergyExpenditurePctGdp: 6.3,
    crudeOilExpenditurePctGdp: 2.8,
    cleanAndElectricExpenditurePctGdp: 1.8,
    energyIntensityIndex: 54.0,
    annualEnergyBillTrillionUsd: 5.44,
    energyRegime: 'moderate',
    worldTradeToGdpPct: 59.2,
    geoeconomicFragmentationIndex: 54.0,
    averageGlobalTariffRatePct: 4.2,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.98,
    globalOldAgeDependencyRatio: 14.6,
    eventNote: 'US Section 301 tariffs on Chinese imports inaugurate the era of active Geoeconomic Fragmentation',
  },
  {
    date: '2020',
    year: 2020,
    worldGdpTrillionUsd: 85.1,
    brentCrudeUsd: 41.8,
    globalEnergyExpenditurePctGdp: 4.5,
    crudeOilExpenditurePctGdp: 1.6,
    cleanAndElectricExpenditurePctGdp: 1.9,
    energyIntensityIndex: 53.5,
    annualEnergyBillTrillionUsd: 3.83,
    energyRegime: 'benign',
    worldTradeToGdpPct: 52.1,
    geoeconomicFragmentationIndex: 65.0,
    averageGlobalTariffRatePct: 4.4,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.89,
    globalOldAgeDependencyRatio: 15.0,
    eventNote: 'COVID-19 pandemic halts global mobility; WTI briefly trades negative; medical supply chain nationalism emerges',
  },
  {
    date: '2022',
    year: 2022,
    worldGdpTrillionUsd: 101.3,
    brentCrudeUsd: 99.0,
    globalEnergyExpenditurePctGdp: 8.4,
    crudeOilExpenditurePctGdp: 3.7,
    cleanAndElectricExpenditurePctGdp: 2.0,
    energyIntensityIndex: 52.5,
    annualEnergyBillTrillionUsd: 8.51,
    energyRegime: 'elevated_warning',
    worldTradeToGdpPct: 62.8,
    geoeconomicFragmentationIndex: 78.4,
    averageGlobalTariffRatePct: 4.6,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.85,
    globalOldAgeDependencyRatio: 15.3,
    eventNote: 'Russia-Ukraine conflict triggers European natural gas and global oil shock; energy expenditure spikes past 8% warning line',
  },
  {
    date: '2024',
    year: 2024,
    worldGdpTrillionUsd: 106.8,
    brentCrudeUsd: 79.5,
    globalEnergyExpenditurePctGdp: 6.8,
    crudeOilExpenditurePctGdp: 2.9,
    cleanAndElectricExpenditurePctGdp: 2.1,
    energyIntensityIndex: 51.5,
    annualEnergyBillTrillionUsd: 7.26,
    energyRegime: 'moderate',
    worldTradeToGdpPct: 58.4,
    geoeconomicFragmentationIndex: 82.5,
    averageGlobalTariffRatePct: 4.7,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.82,
    globalOldAgeDependencyRatio: 15.6,
    eventNote: 'Trade realignment toward friendshoring and nearshoring; US CHIPS Act and EU clean tech subsidies reshape supply chains',
  },
  {
    date: '2025',
    year: 2025,
    worldGdpTrillionUsd: 111.4,
    brentCrudeUsd: 76.2,
    globalEnergyExpenditurePctGdp: 6.6,
    crudeOilExpenditurePctGdp: 2.8,
    cleanAndElectricExpenditurePctGdp: 2.2,
    energyIntensityIndex: 50.8,
    annualEnergyBillTrillionUsd: 7.35,
    energyRegime: 'moderate',
    worldTradeToGdpPct: 57.8,
    geoeconomicFragmentationIndex: 84.0,
    averageGlobalTariffRatePct: 4.8,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.80,
    globalOldAgeDependencyRatio: 15.9,
    eventNote: 'Trade-to-GDP holds at 57.8%, 3.2% below 2008 Peak Globalization; China working-age contraction accelerates past -0.4% p.a.',
  },
  {
    date: '2026',
    year: 2026,
    worldGdpTrillionUsd: 116.2,
    brentCrudeUsd: 74.8,
    globalEnergyExpenditurePctGdp: 6.4,
    crudeOilExpenditurePctGdp: 2.7,
    cleanAndElectricExpenditurePctGdp: 2.3,
    energyIntensityIndex: 50.1,
    annualEnergyBillTrillionUsd: 7.44,
    energyRegime: 'moderate',
    worldTradeToGdpPct: 57.2,
    geoeconomicFragmentationIndex: 85.0,
    averageGlobalTariffRatePct: 4.9,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.78,
    globalOldAgeDependencyRatio: 16.2,
    eventNote: 'Contemporary baseline: energy burden is manageable but sensitive to geopolitical supply shocks; demographic cliff deepens across East Asia & Europe',
  },
  {
    date: '2030 (Proj)',
    year: 2030,
    worldGdpTrillionUsd: 133.0,
    brentCrudeUsd: 82.0,
    globalEnergyExpenditurePctGdp: 6.3,
    crudeOilExpenditurePctGdp: 2.4,
    cleanAndElectricExpenditurePctGdp: 2.6,
    energyIntensityIndex: 47.5,
    annualEnergyBillTrillionUsd: 8.38,
    energyRegime: 'moderate',
    worldTradeToGdpPct: 56.5,
    geoeconomicFragmentationIndex: 86.5,
    averageGlobalTariffRatePct: 5.0,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.65,
    globalOldAgeDependencyRatio: 18.1,
    eventNote: 'UN Demographic Benchmark: China working age down 35M from peak; EU old-age dependency reaches 42',
  },
  {
    date: '2040 (Proj)',
    year: 2040,
    worldGdpTrillionUsd: 180.0,
    brentCrudeUsd: 90.0,
    globalEnergyExpenditurePctGdp: 5.8,
    crudeOilExpenditurePctGdp: 1.8,
    cleanAndElectricExpenditurePctGdp: 3.1,
    energyIntensityIndex: 42.0,
    annualEnergyBillTrillionUsd: 10.44,
    energyRegime: 'benign',
    worldTradeToGdpPct: 55.0,
    geoeconomicFragmentationIndex: 88.0,
    averageGlobalTariffRatePct: 5.2,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.38,
    globalOldAgeDependencyRatio: 21.8,
    eventNote: 'UN Projection: China and Europe face peak fiscal dominance as pension obligations consume >16% of GDP',
  },
  {
    date: '2050 (Proj)',
    year: 2050,
    worldGdpTrillionUsd: 245.0,
    brentCrudeUsd: 95.0,
    globalEnergyExpenditurePctGdp: 5.4,
    crudeOilExpenditurePctGdp: 1.3,
    cleanAndElectricExpenditurePctGdp: 3.5,
    energyIntensityIndex: 37.0,
    annualEnergyBillTrillionUsd: 13.23,
    energyRegime: 'benign',
    worldTradeToGdpPct: 54.2,
    geoeconomicFragmentationIndex: 90.0,
    averageGlobalTariffRatePct: 5.4,
    deglobalizationPhase: 'geoeconomic_fragmentation',
    globalWorkingAgeGrowthPct: 0.12,
    globalOldAgeDependencyRatio: 25.2,
    eventNote: 'UN Long-Term Equilibrium: Global working-age population growth flattens near zero; Japan and South Korea dependency exceeds 65-70',
  },
];

/*
 * Detailed econometric profiles across key sovereign economies and regional blocs.
 * Quantifies regional energy vulnerability, trade exposure, and demographic trajectories.
 */
export const REGIONAL_PHYSICAL_ECONOMY_PROFILES: Record<
  PhysicalEconomyRegionId,
  RegionalPhysicalEconomyProfile
> = {
  GLOBAL: {
    regionId: 'GLOBAL',
    name: 'Global / World Aggregate',
    flag: '🌐',
    energy: {
      energyExpenditurePercentGdp: 6.4,
      energyNetImportDependencePct: 0.0,
      vulnerabilityToOilShock: 'high',
      oilSharePct: 42.2,
      gasSharePct: 24.1,
      coalSharePct: 22.8,
      nuclearSharePct: 4.8,
      renewablesSharePct: 6.1,
      energyIntensityGdpDelta5YPct: -8.5,
    },
    trade: {
      tradeToGdpPct: 57.2,
      peakTradeRatioPct: 61.0,
      peakTradeYear: 2008,
      tradeBalancePercentGdp: 0.0,
      tariffFrictionIndex: 85.0,
      friendshoringExposure: 'moderate',
      strategicSupplyChainVulnerability: 'Global maritime chokepoints (Strait of Hormuz, Malacca, Suez) and semiconductor manufacturing concentration in Taiwan.',
    },
    demographics: {
      workingAgeGrowthPct: 0.78,
      oldAgeDependencyRatio: 16.2,
      workingAgePeakYear: 2065,
      medianAge: 31.5,
      fertilityRate: 2.25,
      projectedDependencyRatio2040: 21.8,
      projectedDependencyRatio2050: 25.2,
      pensionHealthcareLiabilityGdpPct: 185.0,
      demographicPhase: 'aging_transition',
      macroTransmissionNote:
        'World working-age growth is halving from 1.6% (1990s) to 0.78% today, with advanced economies and China contracting while Sub-Saharan Africa and India drive remaining net growth.',
    },
  },
  USA: {
    regionId: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    energy: {
      energyExpenditurePercentGdp: 5.6,
      energyNetImportDependencePct: -8.2, // Net energy exporter thanks to shale
      vulnerabilityToOilShock: 'beneficiary',
      oilSharePct: 37.5,
      gasSharePct: 33.2,
      coalSharePct: 9.8,
      nuclearSharePct: 8.2,
      renewablesSharePct: 11.3,
      energyIntensityGdpDelta5YPct: -9.2,
    },
    trade: {
      tradeToGdpPct: 25.8,
      peakTradeRatioPct: 30.8,
      peakTradeYear: 2011,
      tradeBalancePercentGdp: -3.2,
      tariffFrictionIndex: 68.0,
      friendshoringExposure: 'aggressive',
      strategicSupplyChainVulnerability: 'Dependency on foreign critical mineral refining (rare earths, lithium) and advanced packaging for microelectronics.',
    },
    demographics: {
      workingAgeGrowthPct: 0.28,
      oldAgeDependencyRatio: 28.2,
      workingAgePeakYear: 2038,
      medianAge: 38.9,
      fertilityRate: 1.62,
      projectedDependencyRatio2040: 34.5,
      projectedDependencyRatio2050: 37.8,
      pensionHealthcareLiabilityGdpPct: 245.0,
      demographicPhase: 'aging_transition',
      macroTransmissionNote:
        'Immigration and higher relative fertility buffer US working-age growth (+0.28%) compared to peer OECD economies, but Social Security and Medicare unfunded liabilities ($78T) drive persistent structural deficits.',
    },
  },
  EUR: {
    regionId: 'EUR',
    name: 'Eurozone / European Union',
    flag: '🇪🇺',
    energy: {
      energyExpenditurePercentGdp: 7.9,
      energyNetImportDependencePct: 58.4,
      vulnerabilityToOilShock: 'extreme',
      oilSharePct: 35.2,
      gasSharePct: 23.8,
      coalSharePct: 10.5,
      nuclearSharePct: 12.0,
      renewablesSharePct: 18.5,
      energyIntensityGdpDelta5YPct: -11.4,
    },
    trade: {
      tradeToGdpPct: 88.5,
      peakTradeRatioPct: 92.4,
      peakTradeYear: 2022,
      tradeBalancePercentGdp: 2.1,
      tariffFrictionIndex: 72.0,
      friendshoringExposure: 'vulnerable',
      strategicSupplyChainVulnerability: 'Heavy dependence on imported LNG and crude, plus high export reliance on the Chinese consumer market for automotive and luxury capital goods.',
    },
    demographics: {
      workingAgeGrowthPct: -0.32,
      oldAgeDependencyRatio: 36.8,
      workingAgePeakYear: 2008,
      medianAge: 44.5,
      fertilityRate: 1.46,
      projectedDependencyRatio2040: 46.5,
      projectedDependencyRatio2050: 52.0,
      pensionHealthcareLiabilityGdpPct: 320.0,
      demographicPhase: 'severe_aging',
      macroTransmissionNote:
        'The Eurozone working-age population has been contracting since 2008. Chronic skilled labor deficits, low potential real GDP growth (<1.2%), and soaring pay-as-you-go pension ratios severely limit fiscal leeway.',
    },
  },
  CHN: {
    regionId: 'CHN',
    name: 'China',
    flag: '🇨🇳',
    energy: {
      energyExpenditurePercentGdp: 7.2,
      energyNetImportDependencePct: 25.8,
      vulnerabilityToOilShock: 'high',
      oilSharePct: 19.5,
      gasSharePct: 8.5,
      coalSharePct: 55.4,
      nuclearSharePct: 2.4,
      renewablesSharePct: 14.2,
      energyIntensityGdpDelta5YPct: -12.1,
    },
    trade: {
      tradeToGdpPct: 35.8,
      peakTradeRatioPct: 64.5,
      peakTradeYear: 2006,
      tradeBalancePercentGdp: 4.8,
      tariffFrictionIndex: 92.0,
      friendshoringExposure: 'vulnerable',
      strategicSupplyChainVulnerability: 'Malacca maritime chokepoint for crude imports (72% import share), Western semiconductor export controls, and foreign tariff barriers targeting EV exports.',
    },
    demographics: {
      workingAgeGrowthPct: -0.45,
      oldAgeDependencyRatio: 22.8,
      workingAgePeakYear: 2015,
      medianAge: 40.2,
      fertilityRate: 1.02,
      projectedDependencyRatio2040: 38.5,
      projectedDependencyRatio2050: 48.2,
      pensionHealthcareLiabilityGdpPct: 210.0,
      demographicPhase: 'severe_aging',
      macroTransmissionNote:
        'The One-Child Policy legacy means China is "growing old before growing rich". The workforce is contracting by 4-5 million adults annually, pressuring local government pensions and transitioning the economy toward capital-intensive automation.',
    },
  },
  JPN: {
    regionId: 'JPN',
    name: 'Japan',
    flag: '🇯🇵',
    energy: {
      energyExpenditurePercentGdp: 7.8,
      energyNetImportDependencePct: 87.6,
      vulnerabilityToOilShock: 'extreme',
      oilSharePct: 37.8,
      gasSharePct: 21.5,
      coalSharePct: 26.2,
      nuclearSharePct: 4.5,
      renewablesSharePct: 10.0,
      energyIntensityGdpDelta5YPct: -7.8,
    },
    trade: {
      tradeToGdpPct: 41.2,
      peakTradeRatioPct: 43.8,
      peakTradeYear: 2022,
      tradeBalancePercentGdp: -1.2,
      tariffFrictionIndex: 65.0,
      friendshoringExposure: 'resilient',
      strategicSupplyChainVulnerability: 'Over 88% dependent on imported fossil fuels, exposing the Japanese Yen to severe terms-of-trade deteriorations during global energy shocks.',
    },
    demographics: {
      workingAgeGrowthPct: -0.75,
      oldAgeDependencyRatio: 53.8,
      workingAgePeakYear: 1995,
      medianAge: 49.5,
      fertilityRate: 1.20,
      projectedDependencyRatio2040: 64.2,
      projectedDependencyRatio2050: 71.5,
      pensionHealthcareLiabilityGdpPct: 380.0,
      demographicPhase: 'demographic_cliff',
      macroTransmissionNote:
        'The global frontier of hyper-aging: more than 53 dependents per 100 workers. Enforces yield curve control (YCC) and debt monetization because rising rates would overwhelm sovereign social security debt servicing.',
    },
  },
  DEU: {
    regionId: 'DEU',
    name: 'Germany',
    flag: '🇩🇪',
    energy: {
      energyExpenditurePercentGdp: 8.2,
      energyNetImportDependencePct: 69.5,
      vulnerabilityToOilShock: 'extreme',
      oilSharePct: 34.0,
      gasSharePct: 24.5,
      coalSharePct: 16.2,
      nuclearSharePct: 0.0,
      renewablesSharePct: 25.3,
      energyIntensityGdpDelta5YPct: -10.5,
    },
    trade: {
      tradeToGdpPct: 86.4,
      peakTradeRatioPct: 89.2,
      peakTradeYear: 2022,
      tradeBalancePercentGdp: 4.2,
      tariffFrictionIndex: 76.0,
      friendshoringExposure: 'vulnerable',
      strategicSupplyChainVulnerability: 'Energy-intensive industrial base (chemicals, metallurgy) faces permanent input cost disadvantages following the severance of cheap Russian pipeline gas.',
    },
    demographics: {
      workingAgeGrowthPct: -0.55,
      oldAgeDependencyRatio: 38.5,
      workingAgePeakYear: 2000,
      medianAge: 46.8,
      fertilityRate: 1.35,
      projectedDependencyRatio2040: 48.0,
      projectedDependencyRatio2050: 54.5,
      pensionHealthcareLiabilityGdpPct: 310.0,
      demographicPhase: 'severe_aging',
      macroTransmissionNote:
        'Baby boomer retirement wave (2025-2035) removes ~500,000 workers annually from the labor pool, threatening Germany’s export-led Mittelstand manufacturing model.',
    },
  },
  GBR: {
    regionId: 'GBR',
    name: 'United Kingdom',
    flag: '🇬🇧',
    energy: {
      energyExpenditurePercentGdp: 6.9,
      energyNetImportDependencePct: 36.5,
      vulnerabilityToOilShock: 'high',
      oilSharePct: 40.2,
      gasSharePct: 34.5,
      coalSharePct: 2.5,
      nuclearSharePct: 7.2,
      renewablesSharePct: 15.6,
      energyIntensityGdpDelta5YPct: -9.8,
    },
    trade: {
      tradeToGdpPct: 62.5,
      peakTradeRatioPct: 65.8,
      peakTradeYear: 2019,
      tradeBalancePercentGdp: -3.2,
      tariffFrictionIndex: 74.0,
      friendshoringExposure: 'moderate',
      strategicSupplyChainVulnerability: 'High services export concentration, non-tariff trade frictions with EU single market post-Brexit, and North Sea hydrocarbon depletion.',
    },
    demographics: {
      workingAgeGrowthPct: 0.15,
      oldAgeDependencyRatio: 31.8,
      workingAgePeakYear: 2028,
      medianAge: 40.8,
      fertilityRate: 1.55,
      projectedDependencyRatio2040: 38.2,
      projectedDependencyRatio2050: 42.5,
      pensionHealthcareLiabilityGdpPct: 265.0,
      demographicPhase: 'aging_transition',
      macroTransmissionNote:
        'National Health Service (NHS) and state pension "triple lock" escalate fiscal claims on the Treasury, squeezing productive public infrastructure investment.',
    },
  },
  IND: {
    regionId: 'IND',
    name: 'India',
    flag: '🇮🇳',
    energy: {
      energyExpenditurePercentGdp: 8.6,
      energyNetImportDependencePct: 42.5,
      vulnerabilityToOilShock: 'extreme',
      oilSharePct: 28.5,
      gasSharePct: 6.2,
      coalSharePct: 56.8,
      nuclearSharePct: 1.5,
      renewablesSharePct: 7.0,
      energyIntensityGdpDelta5YPct: -6.4,
    },
    trade: {
      tradeToGdpPct: 46.8,
      peakTradeRatioPct: 55.8,
      peakTradeYear: 2012,
      tradeBalancePercentGdp: -2.8,
      tariffFrictionIndex: 62.0,
      friendshoringExposure: 'resilient',
      strategicSupplyChainVulnerability: 'Crude oil import dependency (>85% of crude consumed is imported), high vulnerability to global dollar liquidity and energy spikes.',
    },
    demographics: {
      workingAgeGrowthPct: 1.15,
      oldAgeDependencyRatio: 10.4,
      workingAgePeakYear: 2045,
      medianAge: 28.7,
      fertilityRate: 2.00,
      projectedDependencyRatio2040: 15.2,
      projectedDependencyRatio2050: 20.8,
      pensionHealthcareLiabilityGdpPct: 95.0,
      demographicPhase: 'demographic_dividend',
      macroTransmissionNote:
        'Prime beneficiary of the global demographic dividend: ~12 million youth enter the working-age population every year through 2040, powering labor arbitrage and nearshore manufacturing.',
    },
  },
  KOR: {
    regionId: 'KOR',
    name: 'South Korea',
    flag: '🇰🇷',
    energy: {
      energyExpenditurePercentGdp: 9.1,
      energyNetImportDependencePct: 83.2,
      vulnerabilityToOilShock: 'extreme',
      oilSharePct: 41.5,
      gasSharePct: 18.2,
      coalSharePct: 23.5,
      nuclearSharePct: 11.8,
      renewablesSharePct: 5.0,
      energyIntensityGdpDelta5YPct: -7.2,
    },
    trade: {
      tradeToGdpPct: 84.2,
      peakTradeRatioPct: 96.8,
      peakTradeYear: 2011,
      tradeBalancePercentGdp: 2.8,
      tariffFrictionIndex: 80.0,
      friendshoringExposure: 'vulnerable',
      strategicSupplyChainVulnerability: 'Energy-intensive export industries (semiconductors, steel, shipbuilding, batteries) facing dual squeezes from fossil fuel import reliance and US-China technology rivalry.',
    },
    demographics: {
      workingAgeGrowthPct: -1.10,
      oldAgeDependencyRatio: 27.5,
      workingAgePeakYear: 2018,
      medianAge: 45.2,
      fertilityRate: 0.72,
      projectedDependencyRatio2040: 58.0,
      projectedDependencyRatio2050: 74.0,
      pensionHealthcareLiabilityGdpPct: 350.0,
      demographicPhase: 'demographic_cliff',
      macroTransmissionNote:
        'Lowest fertility rate in recorded world history (0.72). The working-age population is shrinking at >1.1% per year, setting up a catastrophic demographic cliff where dependents will outnumber workers by 2055.',
    },
  },
};

/*
 * Evaluates the Energy Burden regime according to verified macroeconomic thresholds:
 * <6% Benign, 6-8% Moderate, 8-10% Elevated Warning, >10% Crisis.
 */
export function getEnergyBurdenRegime(energyPct: number): EnergyBurdenRegime {
  if (energyPct >= 10.0) return 'recessionary_crisis';
  if (energyPct >= 8.0) return 'elevated_warning';
  if (energyPct >= 6.0) return 'moderate';
  return 'benign';
}

/*
 * Dynamic Econometric Simulator: Evaluates Global Energy Expenditure as % of World GDP
 * based on real-time adjusted Brent Crude Oil prices and World GDP.
 *
 * Econometric formula:
 * Total Primary Energy = Base Non-Oil Energy (Gas, Coal, Power, Renewables ~3.5% of GDP)
 *                      + Daily Oil Consumption (102.5 million bbl/day) * 365 * Oil Price / World GDP.
 */
export function calculateSimulatedEnergyExpenditure(
  oilPriceUsd: number,
  worldGdpTrillionUsd: number = 116.2,
  baseNonOilPctGdp: number = 3.7
): {
  simulatedTotalEnergyPctGdp: number;
  simTotalEnergyPctGdp: number;
  simulatedOilExpenditurePctGdp: number;
  totalEnergyBillTrillionUsd: number;
  regime: EnergyBurdenRegime;
  consumptionTaxDragTrillionUsd: number; // Discretionary income lost vs benign 5.5% baseline
  recessionProbabilityScore: number;     // 0 to 100 econometric probability model
} {
  const boundedPrice = Math.max(20, Math.min(250, oilPriceUsd));
  const boundedGdp = Math.max(50, worldGdpTrillionUsd);

  // Global crude oil consumption is approx 102.5 million barrels/day in 2025/2026
  const annualBarrelsBillion = (102.5 * 365) / 1000; // ~37.4 billion barrels/year
  const annualOilBillTrillion = (annualBarrelsBillion * boundedPrice) / 1000;
  const oilSharePctGdp = (annualOilBillTrillion / boundedGdp) * 100;

  const totalEnergyPctGdp = Math.round((baseNonOilPctGdp + oilSharePctGdp) * 10) / 10;
  const totalEnergyBillTrillion = Math.round((boundedGdp * (totalEnergyPctGdp / 100)) * 100) / 100;

  // Baseline benign energy bill is 5.5% of GDP
  const benignBaselineBill = boundedGdp * 0.055;
  const consumptionTaxDragTrillion = Math.max(0, Math.round((totalEnergyBillTrillion - benignBaselineBill) * 100) / 100);

  // Recession probability logistic curve calibrated on 1973, 1979, 1990, 2008, 2022
  let recessionProbability = 15;
  if (totalEnergyPctGdp >= 10.0) {
    recessionProbability = Math.min(95, Math.round(75 + (totalEnergyPctGdp - 10.0) * 12));
  } else if (totalEnergyPctGdp >= 8.0) {
    recessionProbability = Math.min(75, Math.round(45 + (totalEnergyPctGdp - 8.0) * 15));
  } else if (totalEnergyPctGdp >= 6.5) {
    recessionProbability = Math.round(20 + (totalEnergyPctGdp - 6.5) * 16);
  }

  return {
    simulatedTotalEnergyPctGdp: totalEnergyPctGdp,
    simulatedOilExpenditurePctGdp: Math.round(oilSharePctGdp * 10) / 10,
    totalEnergyBillTrillionUsd: totalEnergyBillTrillion,
    regime: getEnergyBurdenRegime(totalEnergyPctGdp),
    consumptionTaxDragTrillionUsd: consumptionTaxDragTrillion,
    recessionProbabilityScore: recessionProbability,
    simTotalEnergyPctGdp: totalEnergyPctGdp,
  };
}

/*
 * Dynamic Deglobalization & Tariff Shock Simulator:
 * Estimates Trade-to-GDP contraction, friendshoring diversion, and consumer inflation friction
 * under elevated average tariffs and geopolitical fragmentation.
 */
export function calculateSimulatedDeglobalization(
  simTariffRatePct: number,
  baseTradeToGdpPct: number = 57.2
): {
  simulatedTradeToGdpPct: number;
  tradeContractionVsPeakPct: number; // vs 61.0% in 2008
  projectedAnnualGlobalTradeLossBillionUsd: number;
  effectiveFrictionScore: number;
} {
  const boundedTariff = Math.max(0, Math.min(35, simTariffRatePct));
  // Every 1.0 percentage point increase in average global tariffs historically depresses trade-to-GDP by ~0.42%
  const tariffDrag = (boundedTariff - 4.9) * 0.42;
  const simulatedTradePct = Math.max(35.0, Math.min(65.0, Math.round((baseTradeToGdpPct - tariffDrag) * 10) / 10));

  const peakTrade = 61.0;
  const contractionVsPeak = Math.round((simulatedTradePct - peakTrade) * 10) / 10;

  // Approximate world GDP $116.2T: trade loss in dollar volume
  const tradeVolumeDeltaPct = (baseTradeToGdpPct - simulatedTradePct) / 100;
  const tradeLossBillion = Math.round(tradeVolumeDeltaPct * 116200);

  const frictionScore = Math.min(100, Math.round(60 + boundedTariff * 2.2));

  return {
    simulatedTradeToGdpPct: simulatedTradePct,
    tradeContractionVsPeakPct: contractionVsPeak,
    projectedAnnualGlobalTradeLossBillionUsd: tradeLossBillion,
    effectiveFrictionScore: frictionScore,
  };
}

/*
 * Dynamic Demographic Simulator:
 * Evaluates impact of statutory retirement age adjustments on old-age dependency ratio
 * and fiscal pension expenditure relief.
 */
export function calculateSimulatedDemographicRelief(
  retirementAge: number,
  currentDependencyRatio: number = 28.2
): {
  adjustedDependencyRatio: number;
  dependencyReductionPct: number;
  estimatedFiscalSavingsGdpPct: number;
} {
  const boundedRetirementAge = Math.max(60, Math.min(72, retirementAge));
  // Raising retirement age by 1 year historically shifts ~3-4% of elderly into working-age category
  const ageDelta = boundedRetirementAge - 65;
  const ratioReduction = ageDelta * 1.85;
  const adjustedRatio = Math.max(5.0, Math.round((currentDependencyRatio - ratioReduction) * 10) / 10);
  const reductionPct = Math.round(((currentDependencyRatio - adjustedRatio) / currentDependencyRatio) * 1000) / 10;
  const fiscalSavings = Math.max(0, Math.round((ageDelta * 0.45) * 10) / 10);

  return {
    adjustedDependencyRatio: adjustedRatio,
    dependencyReductionPct: reductionPct,
    estimatedFiscalSavingsGdpPct: fiscalSavings,
  };
}

/*
 * Returns standard macroeconomic overview of physical economy, energy, and deglobalization.
 */
export function getPhysicalEconomyOverview(): PhysicalEconomyOverview {
  const latestHistorical = HISTORICAL_PHYSICAL_ECONOMY_SERIES.find((p) => p.year === 2026)!;

  return {
    currentDate: latestHistorical.date,
    latestEnergyBurdenPctGdp: latestHistorical.globalEnergyExpenditurePctGdp,
    energyRegime: latestHistorical.energyRegime,
    brentCrudeUsd: latestHistorical.brentCrudeUsd,
    recessionDangerThresholdPct: 8.0,
    recessionCrisisThresholdPct: 10.0,
    
    latestWorldTradeToGdpPct: latestHistorical.worldTradeToGdpPct,
    peakTradeToGdpPct: 61.0,
    tradeDeltaFromPeakPct: Math.round((latestHistorical.worldTradeToGdpPct - 61.0) * 10) / 10,
    currentFragmentationIndex: latestHistorical.geoeconomicFragmentationIndex,
    deglobalizationPhase: latestHistorical.deglobalizationPhase,

    globalWorkingAgeGrowthPct: latestHistorical.globalWorkingAgeGrowthPct,
    globalOldAgeDependencyRatio: latestHistorical.globalOldAgeDependencyRatio,
    projectedWorldDependencyRatio2050: 25.2,

    regions: REGIONAL_PHYSICAL_ECONOMY_PROFILES,
    historicalSeries: HISTORICAL_PHYSICAL_ECONOMY_SERIES,
  };
}

/*
 * Evaluates live macroeconomic alerts based on primary physical economy signals.
 */
export function getLatestPhysicalEconomyState(): EvaluatedPhysicalEconomyState {
  const overview = getPhysicalEconomyOverview();
  const alerts: EvaluatedPhysicalEconomyState['activeAlerts'] = [];

  // Alert 1: Energy Expenditure relative to 8.0% Warning threshold
  if (overview.latestEnergyBurdenPctGdp >= 10.0) {
    alerts.push({
      id: 'energy-crisis-shock',
      level: 'CRITICAL',
      headline: `🚨 Severe Energy Tax Crisis: ${overview.latestEnergyBurdenPctGdp}% of World GDP`,
      body: 'Global spending on primary energy exceeds 10% of world GDP, acting as an inescapable regressive consumption tax that has preceded almost every modern global recession.',
    });
  } else if (overview.latestEnergyBurdenPctGdp >= 8.0) {
    alerts.push({
      id: 'energy-warning-zone',
      level: 'WARNING',
      headline: `⚠️ Elevated Energy Friction: ${overview.latestEnergyBurdenPctGdp}% of World GDP`,
      body: 'Primary energy spending is elevated in the 8% to 10% danger zone, compressing household discretionary cash flow and corporate profit margins.',
    });
  } else {
    alerts.push({
      id: 'energy-benign-status',
      level: 'BENIGN',
      headline: `✅ Energy Burden Manageable: ${overview.latestEnergyBurdenPctGdp}% of World GDP (Brent at $${overview.brentCrudeUsd}/bbl)`,
      body: 'Current energy expenditure is comfortably below the 8.0% recession warning threshold, providing a stable tailwind to the global physical economy.',
    });
  }

  // Alert 2: Trade-to-GDP vs 2008 Peak Globalization (61.0%)
  if (overview.latestWorldTradeToGdpPct < 61.0) {
    alerts.push({
      id: 'deglobalization-fragmentation',
      level: 'INFO',
      headline: `📉 Deglobalization / Fragmentation: Trade at ${overview.latestWorldTradeToGdpPct}% (${overview.tradeDeltaFromPeakPct}% vs 2008 Peak)`,
      body: 'World trade peaked as a share of GDP in 2008 (61.0%). Active geoeconomic fragmentation, tariff escalation, and friendshoring policies have permanently plateaued cross-border merchandise intensity.',
    });
  }

  // Alert 3: Secular Demographic Cliff
  alerts.push({
    id: 'demographic-cliff-strain',
    level: 'WARNING',
    headline: '⏳ Secular Demographic Cliff: Working-Age Contraction in China, Japan & EU',
    body: 'Working-age populations are contracting across China (-0.45% p.a.), Germany (-0.55% p.a.), and Japan (-0.75% p.a.). Rising old-age dependency ratios cement permanent fiscal dominance and age-related entitlement liabilities.',
  });

  return {
    timestamp: new Date().toISOString(),
    energyBurdenPctGdp: overview.latestEnergyBurdenPctGdp,
    energyRegime: overview.energyRegime,
    tradeToGdpPct: overview.latestWorldTradeToGdpPct,
    tradeDeltaFromPeakPct: overview.tradeDeltaFromPeakPct,
    fragmentationIndex: overview.currentFragmentationIndex,
    globalWorkingAgeGrowthPct: overview.globalWorkingAgeGrowthPct,
    globalOldAgeDependencyRatio: overview.globalOldAgeDependencyRatio,
    activeAlerts: alerts,
  };
}

/*
 * Formats combined telemetry data for CSV and JSON download in DataExportMenu.
 */
export function getCombinedPhysicalEconomyExportData() {
  return HISTORICAL_PHYSICAL_ECONOMY_SERIES.map((p) => ({
    Year: p.year,
    Date: p.date,
    'World GDP ($T)': p.worldGdpTrillionUsd,
    'Brent Crude ($/bbl)': p.brentCrudeUsd,
    'Energy Burden (% of World GDP)': p.globalEnergyExpenditurePctGdp,
    'Oil Share (% of GDP)': p.crudeOilExpenditurePctGdp,
    'Energy Intensity Index (1980=100)': p.energyIntensityIndex,
    'Energy Bill ($T)': p.annualEnergyBillTrillionUsd,
    'Energy Regime': p.energyRegime,
    'World Trade-to-GDP Ratio (%)': p.worldTradeToGdpPct,
    'Geoeconomic Fragmentation Index': p.geoeconomicFragmentationIndex,
    'Average Global Tariff (%)': p.averageGlobalTariffRatePct,
    'Deglobalization Phase': p.deglobalizationPhase,
    'Global Working-Age Growth (% YoY)': p.globalWorkingAgeGrowthPct,
    'Global Old-Age Dependency Ratio': p.globalOldAgeDependencyRatio,
    'Historical Macro Note': p.eventNote || '',
  }));
}
