/*
 * Institutional macro hedge funds and sovereign wealth allocators evaluate relative price
 * relationships rather than isolated nominal prices to separate real productivity growth
 * from monetary currency debasement and geopolitical dislocations.
 */

export interface RatioThreshold {
  label: string;
  min: number;
  max: number;
  color: 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  description: string;
}

export interface RatioDataPoint {
  date: string;
  year: number;
  ratio: number;
  numeratorValue: number;
  denominatorValue: number;
  eventNote?: string;
}

export interface QuickScenario {
  title: string;
  description: string;
  numeratorValue: number;
  denominatorValue: number;
}

export interface CrossAssetRatioModel {
  id: 'copper-gold' | 'sp500-m2' | 'gold-oil';
  name: string;
  symbol: string;
  category: string;
  tagline: string;
  formula: string;
  unit: string;
  currentValue: number;
  change24hPct: number;
  numerator: {
    name: string;
    symbol: string;
    unit: string;
    currentValue: number;
    prefix: string;
    suffix: string;
    decimals: number;
    minSlider: number;
    maxSlider: number;
    stepSlider: number;
  };
  denominator: {
    name: string;
    symbol: string;
    unit: string;
    currentValue: number;
    prefix: string;
    suffix: string;
    decimals: number;
    minSlider: number;
    maxSlider: number;
    stepSlider: number;
  };
  historicalMean: number;
  historicalMedian: number;
  historicalMin: number;
  historicalMax: number;
  percentileRank: number;
  regimeStatus: string;
  regimeBadgeColor: 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  regimeAnalysis: string;
  macroSignificance: string;
  institutionalTakeaway: string;
  thresholds: RatioThreshold[];
  quickScenarios: QuickScenario[];
  history: RatioDataPoint[];
}

export const CROSS_ASSET_RATIOS: Record<'copper-gold' | 'sp500-m2' | 'gold-oil', CrossAssetRatioModel> = {
  'copper-gold': {
    id: 'copper-gold',
    name: 'Copper / Gold Ratio',
    symbol: 'HG1! / XAU',
    category: 'Cyclical Growth vs. Safety Barometer',
    tagline: 'Global Industrial Expansion vs. Monetary Safe-Haven Flight',
    formula: '(Copper Price [$ / lb] / Gold Price [$ / oz]) × 1,000',
    unit: 'ratio pts',
    currentValue: 1.61,
    change24hPct: -0.42,
    numerator: {
      name: 'High-Grade Copper',
      symbol: 'HG1!',
      unit: '$/lb',
      currentValue: 4.42,
      prefix: '$',
      suffix: '/lb',
      decimals: 2,
      minSlider: 1.0,
      maxSlider: 8.0,
      stepSlider: 0.05,
    },
    denominator: {
      name: 'Spot Gold',
      symbol: 'XAU/USD',
      unit: '$/troy oz',
      currentValue: 2742.80,
      prefix: '$',
      suffix: '/oz',
      decimals: 2,
      minSlider: 1000,
      maxSlider: 4500,
      stepSlider: 25,
    },
    historicalMean: 2.65,
    historicalMedian: 2.55,
    historicalMin: 1.30,
    historicalMax: 5.06,
    percentileRank: 18,
    regimeStatus: 'Defensive Late-Cycle / Flight to Reserve Safety',
    regimeBadgeColor: 'amber',
    regimeAnalysis:
      'The Copper/Gold ratio sits in the 18th historical percentile despite robust copper demand from grid electrification. Record central bank bullion accumulation and fiscal deficit hedging have propelled gold to historic highs, keeping this ratio compressed and signaling macroeconomic caution rather than roaring cyclical boom.',
    macroSignificance:
      'Doctor Copper has a PhD in economics due to ubiquitous demand in power grids, machinery, and construction. Gold, conversely, produces no industrial yield but acts as the supreme store of monetary value against sovereign debt default and currency debasement. A surging ratio signals reflation and rising 10-year Treasury yields; a collapsing ratio warns of growth slowdowns and flight to safety.',
    institutionalTakeaway:
      'Historically exhibits an ~80% rolling directional correlation with US 10-Year Treasury yields. Bond managers monitor divergence between 10Y yields and Copper/Gold to identify sovereign debt market mispricings.',
    thresholds: [
      {
        label: 'Reflationary Boom',
        min: 3.2,
        max: 6.0,
        color: 'emerald',
        description: 'Synchronized worldwide manufacturing expansion, aggressive capital expenditures, and accelerating sovereign yields.',
      },
      {
        label: 'Moderate Cyclical Growth',
        min: 2.2,
        max: 3.2,
        color: 'sky',
        description: 'Sustainable economic expansion where industrial raw material demand outpaces bullion hedge allocations.',
      },
      {
        label: 'Growth Deceleration & Hedging',
        min: 1.5,
        max: 2.2,
        color: 'amber',
        description: 'Industrial order books soften while institutional reserves and sovereign wealth funds allocate defensively to bullion.',
      },
      {
        label: 'Recession Shock / Crisis Haven',
        min: 0.0,
        max: 1.5,
        color: 'rose',
        description: 'Severe manufacturing contraction, factory curtailments, and acute geopolitical or liquidity flight to gold.',
      },
    ],
    quickScenarios: [
      {
        title: 'Global Electrification Super-Cycle',
        description: 'Power grid upgrades and AI data center demand push copper to $6.50/lb while gold consolidates at $2,500/oz.',
        numeratorValue: 6.50,
        denominatorValue: 2500,
      },
      {
        title: 'Global Manufacturing Recession',
        description: 'Factory order books crash pulling copper to $2.80/lb while flight-to-safety sends gold to $3,100/oz.',
        numeratorValue: 2.80,
        denominatorValue: 3100,
      },
      {
        title: 'Central Bank Gold Acceleration',
        description: 'Copper stays resilient at $4.50/lb but foreign reserve de-dollarization propels gold to $3,500/oz.',
        numeratorValue: 4.50,
        denominatorValue: 3500,
      },
    ],
    history: [
      { date: '1990', year: 1990, ratio: 3.12, numeratorValue: 1.20, denominatorValue: 385.0, eventNote: 'Gulf War & US recession' },
      { date: '1992', year: 1992, ratio: 3.11, numeratorValue: 1.07, denominatorValue: 344.0, eventNote: 'Post-Cold War reorganization' },
      { date: '1995', year: 1995, ratio: 3.57, numeratorValue: 1.38, denominatorValue: 387.0, eventNote: 'US productivity boom kickoff' },
      { date: '1998', year: 1998, ratio: 2.55, numeratorValue: 0.75, denominatorValue: 294.0, eventNote: 'Asian Financial Crisis & LTCM collapse' },
      { date: '2000', year: 2000, ratio: 3.01, numeratorValue: 0.84, denominatorValue: 279.0, eventNote: 'Dot-Com tech bubble peak' },
      { date: '2002', year: 2002, ratio: 2.06, numeratorValue: 0.72, denominatorValue: 348.0, eventNote: 'Post-tech bust bottom' },
      { date: '2004', year: 2004, ratio: 3.23, numeratorValue: 1.42, denominatorValue: 439.0, eventNote: 'China joins WTO / Commodity supercycle launch' },
      { date: '2006', year: 2006, ratio: 5.06, numeratorValue: 3.05, denominatorValue: 603.0, eventNote: 'Peak global industrial demand exuberance' },
      { date: '2007', year: 2007, ratio: 3.96, numeratorValue: 3.30, denominatorValue: 833.0, eventNote: 'Subprime mortgage tremors emerge' },
      { date: '2008-Q3', year: 2008, ratio: 4.14, numeratorValue: 3.60, denominatorValue: 870.0, eventNote: 'Pre-Lehman oil & commodity peak' },
      { date: '2008-Q4', year: 2008, ratio: 1.55, numeratorValue: 1.32, denominatorValue: 850.0, eventNote: 'Lehman collapse & global credit freeze' },
      { date: '2009', year: 2009, ratio: 3.04, numeratorValue: 3.32, denominatorValue: 1090.0, eventNote: 'China ¥4T fiscal stimulus & recovery' },
      { date: '2011', year: 2011, ratio: 2.55, numeratorValue: 4.00, denominatorValue: 1570.0, eventNote: 'Eurozone debt crisis & US debt downgrade' },
      { date: '2013', year: 2013, ratio: 2.80, numeratorValue: 3.36, denominatorValue: 1200.0, eventNote: 'Bernanke Taper Tantrum shock' },
      { date: '2015', year: 2015, ratio: 2.03, numeratorValue: 2.15, denominatorValue: 1060.0, eventNote: 'China currency devaluation & commodity slump' },
      { date: '2017', year: 2017, ratio: 2.54, numeratorValue: 3.30, denominatorValue: 1300.0, eventNote: 'Synchronized global economic expansion' },
      { date: '2019', year: 2019, ratio: 1.83, numeratorValue: 2.80, denominatorValue: 1530.0, eventNote: 'US-China trade war & Fed insurance cuts' },
      { date: '2020-Q1', year: 2020, ratio: 1.30, numeratorValue: 2.15, denominatorValue: 1650.0, eventNote: 'COVID-19 worldwide pandemic shutdowns' },
      { date: '2021', year: 2021, ratio: 2.36, numeratorValue: 4.25, denominatorValue: 1800.0, eventNote: 'Post-pandemic fiscal reopening boom' },
      { date: '2022', year: 2022, ratio: 2.09, numeratorValue: 3.80, denominatorValue: 1820.0, eventNote: 'Global inflation & aggressive Fed tightening' },
      { date: '2023', year: 2023, ratio: 1.98, numeratorValue: 3.85, denominatorValue: 1940.0, eventNote: 'US regional banking crisis (SVB) & tech rebound' },
      { date: '2024', year: 2024, ratio: 1.74, numeratorValue: 4.15, denominatorValue: 2380.0, eventNote: 'Electrification surge vs central bank bullion accumulation' },
      { date: '2025', year: 2025, ratio: 1.64, numeratorValue: 4.35, denominatorValue: 2650.0, eventNote: 'Global policy easing & geopolitical de-dollarization' },
      { date: '2026', year: 2026, ratio: 1.61, numeratorValue: 4.42, denominatorValue: 2742.80, eventNote: 'Current 2026 baseline: elevated bullion holding' },
    ],
  },

  'sp500-m2': {
    id: 'sp500-m2',
    name: 'S&P 500 / M2 Money Supply',
    symbol: 'SPX / M2',
    category: 'Asset Valuation vs. Monetary Debasement',
    tagline: 'Real Corporate Productivity vs. Fiat Currency Expansion',
    formula: 'S&P 500 Index / US M2 Money Supply [$ Billions]',
    unit: 'pts / $B',
    currentValue: 0.274,
    change24hPct: 0.14,
    numerator: {
      name: 'S&P 500 Index',
      symbol: 'SPX',
      unit: 'index pts',
      currentValue: 5864.50,
      prefix: '',
      suffix: ' pts',
      decimals: 2,
      minSlider: 1000,
      maxSlider: 9000,
      stepSlider: 25,
    },
    denominator: {
      name: 'US M2 Money Supply',
      symbol: 'M2SL',
      unit: '$ Billions',
      currentValue: 21410,
      prefix: '$',
      suffix: 'B',
      decimals: 0,
      minSlider: 10000,
      maxSlider: 35000,
      stepSlider: 100,
    },
    historicalMean: 0.178,
    historicalMedian: 0.169,
    historicalMin: 0.081,
    historicalMax: 0.299,
    percentileRank: 92,
    regimeStatus: 'Elevated Valuation Multiple / High Liquidity Concentration',
    regimeBadgeColor: 'purple',
    regimeAnalysis:
      'At 0.274 pts per $B of M2, the S&P 500 trades in its 92nd historical percentile. This indicates equity index gains are no longer merely tracking money printing; valuation multiples and AI corporate productivity expectations are expanding faster than broad liquidity growth, approaching levels previously seen during the 2000 Dot-Com peak.',
    macroSignificance:
      'A rising stock market can be an optical illusion caused by the depreciation of fiat purchasing power. Dividing the S&P 500 by M2 reveals whether equity portfolios are growing due to genuine corporate earnings creation and capital efficiency, or simply riding the tide of central bank balance sheet inflation.',
    institutionalTakeaway:
      'Macro hedge funds use this ratio to detect equity bubbles unmasked by monetary tides. When the ratio exceeds 0.26, historical 10-year forward annualized equity returns compress, while readings under 0.12 present generational buying opportunities.',
    thresholds: [
      {
        label: 'Historical Bubble Territory',
        min: 0.28,
        max: 0.40,
        color: 'rose',
        description: 'Equity prices outstrip monetary base expansion to an extreme degree; extreme multiple compression risk.',
      },
      {
        label: 'Elevated Multiple Expansion',
        min: 0.22,
        max: 0.28,
        color: 'purple',
        description: 'Equities benefit from high return on invested capital and earnings productivity ahead of money creation.',
      },
      {
        label: 'Historical Fair-Value Corridor',
        min: 0.14,
        max: 0.22,
        color: 'sky',
        description: 'Equity asset values expand sustainably in tandem with broader commercial banking credit and fiat supply.',
      },
      {
        label: 'Deep Value / Monetary Undervaluation',
        min: 0.0,
        max: 0.14,
        color: 'emerald',
        description: 'Equities trade cheaply relative to existing system liquidity; major post-crisis accumulation zone.',
      },
    ],
    quickScenarios: [
      {
        title: 'Dot-Com Multiples Re-test',
        description: 'S&P 500 reaches 6,400 while M2 remains constrained at $21,400B during quantitative tightening.',
        numeratorValue: 6400,
        denominatorValue: 21410,
      },
      {
        title: 'Aggressive Fed QE Return',
        description: 'Central bank resumes quantitative easing, expanding M2 to $25,000B while equities consolidate at 5,500.',
        numeratorValue: 5500,
        denominatorValue: 25000,
      },
      {
        title: 'Severe Equity Multiple Compression',
        description: 'A 25% equity drawdown pulls S&P 500 down to 4,400 against an unchanged $21,410B M2 money supply.',
        numeratorValue: 4400,
        denominatorValue: 21410,
      },
    ],
    history: [
      { date: '1990', year: 1990, ratio: 0.104, numeratorValue: 330.2, denominatorValue: 3165, eventNote: 'Savings & loan crisis low' },
      { date: '1993', year: 1993, ratio: 0.133, numeratorValue: 466.5, denominatorValue: 3498, eventNote: 'Early Clinton economic expansion' },
      { date: '1995', year: 1995, ratio: 0.169, numeratorValue: 615.9, denominatorValue: 3640, eventNote: 'Internet commercialization takeoff' },
      { date: '1998', year: 1998, ratio: 0.278, numeratorValue: 1229.2, denominatorValue: 4420, eventNote: 'Tech bubble parabolic acceleration' },
      { date: '2000', year: 2000, ratio: 0.299, numeratorValue: 1469.3, denominatorValue: 4917, eventNote: 'All-time Dot-Com bubble peak' },
      { date: '2002', year: 2002, ratio: 0.152, numeratorValue: 879.8, denominatorValue: 5780, eventNote: 'Telecom & tech crash bottom' },
      { date: '2005', year: 2005, ratio: 0.187, numeratorValue: 1248.3, denominatorValue: 6680, eventNote: 'Housing & mortgage credit expansion' },
      { date: '2007', year: 2007, ratio: 0.197, numeratorValue: 1468.4, denominatorValue: 7440, eventNote: 'Pre-GFC equity market crest' },
      { date: '2009', year: 2009, ratio: 0.081, numeratorValue: 676.5, denominatorValue: 8370, eventNote: 'Generational GFC March 2009 low' },
      { date: '2011', year: 2011, ratio: 0.130, numeratorValue: 1257.6, denominatorValue: 9640, eventNote: 'Fed QE2 active liquidity support' },
      { date: '2013', year: 2013, ratio: 0.168, numeratorValue: 1848.4, denominatorValue: 11020, eventNote: 'Post-crisis bull market confirmation' },
      { date: '2016', year: 2016, ratio: 0.170, numeratorValue: 2238.8, denominatorValue: 13180, eventNote: 'Global reflation trade & US election' },
      { date: '2018', year: 2018, ratio: 0.175, numeratorValue: 2506.9, denominatorValue: 14350, eventNote: 'Fed Quantitative Tightening (QT) peak' },
      { date: '2019', year: 2019, ratio: 0.210, numeratorValue: 3230.8, denominatorValue: 15410, eventNote: 'Fed repo market intervention pivot' },
      { date: '2020-Q1', year: 2020, ratio: 0.160, numeratorValue: 2584.6, denominatorValue: 16100, eventNote: 'COVID liquidity freeze shock' },
      { date: '2021', year: 2021, ratio: 0.223, numeratorValue: 4766.2, denominatorValue: 21398, eventNote: 'Historic $5T pandemic M2 stimulus surge' },
      { date: '2022', year: 2022, ratio: 0.181, numeratorValue: 3839.5, denominatorValue: 21210, eventNote: 'Aggressive Fed rate hikes & M2 contraction' },
      { date: '2023', year: 2023, ratio: 0.229, numeratorValue: 4769.8, denominatorValue: 20870, eventNote: 'Generative AI surge with shrinking M2' },
      { date: '2024', year: 2024, ratio: 0.259, numeratorValue: 5450.0, denominatorValue: 21050, eventNote: 'Mega-cap tech rally outpaces money supply' },
      { date: '2025', year: 2025, ratio: 0.269, numeratorValue: 5720.0, denominatorValue: 21240, eventNote: 'US productivity gains & soft landing' },
      { date: '2026', year: 2026, ratio: 0.274, numeratorValue: 5864.5, denominatorValue: 21410, eventNote: 'Current 2026 baseline: stretched multiple' },
    ],
  },

  'gold-oil': {
    id: 'gold-oil',
    name: 'Gold / Oil Ratio',
    symbol: 'XAU / BRENT',
    category: 'Geopolitical Risk vs. Industrial Demand',
    tagline: 'Safe-Haven Bullion Premium vs. Global Energy Cost of Production',
    formula: 'Gold Price [$ / troy oz] / Brent Crude Oil Price [$ / barrel]',
    unit: 'barrels / oz',
    currentValue: 36.6,
    change24hPct: -0.16,
    numerator: {
      name: 'Spot Gold',
      symbol: 'XAU/USD',
      unit: '$/troy oz',
      currentValue: 2742.80,
      prefix: '$',
      suffix: '/oz',
      decimals: 2,
      minSlider: 1000,
      maxSlider: 4500,
      stepSlider: 25,
    },
    denominator: {
      name: 'Brent Crude Oil',
      symbol: 'BRENT',
      unit: '$/barrel',
      currentValue: 74.85,
      prefix: '$',
      suffix: '/bbl',
      decimals: 2,
      minSlider: 20,
      maxSlider: 160,
      stepSlider: 1,
    },
    historicalMean: 19.8,
    historicalMedian: 18.2,
    historicalMin: 6.5,
    historicalMax: 75.0,
    percentileRank: 89,
    regimeStatus: 'Severe Geopolitical Stress & Energy Weakness',
    regimeBadgeColor: 'rose',
    regimeAnalysis:
      'Trading at 36.6 barrels of oil per ounce of gold, the ratio is near the 89th historical percentile. This massive divergence highlights that gold is being aggressively accumulated as a geopolitical hedge and reserve currency alternative, while crude oil is restrained by US shale abundance, sluggish manufacturing growth, and clean energy transition headwinds.',
    macroSignificance:
      'Gold and crude oil are the twin anchor commodities of modern capitalism. Gold represents monetary reserve stability, while oil represents physical energy consumption. A high ratio indicates that fear and geopolitical fragmentation dominate, whereas a low ratio indicates that energy scarcity and industrial consumption are driving cost-push inflation.',
    institutionalTakeaway:
      'Whenever the Gold/Oil ratio crosses above 30, it has historically coincided with major macroeconomic stress (1998 Asian crisis, 2016 commodity collapse, 2020 COVID lockdowns). Conversely, readings below 12 indicate energy-driven stagflation where oil producers capture disproportionate global GDP.',
    thresholds: [
      {
        label: 'Severe Geopolitical / Macro Crisis',
        min: 32.0,
        max: 80.0,
        color: 'rose',
        description: 'Precious metal hoarding reaches fever pitch while industrial energy demand slumps amid recession or sovereign friction.',
      },
      {
        label: 'Elevated Risk Aversion',
        min: 22.0,
        max: 32.0,
        color: 'amber',
        description: 'Gold outperforms energy as central banks diversify reserves and investors guard against macro instability.',
      },
      {
        label: 'Historical Normalcy Corridor',
        min: 14.0,
        max: 22.0,
        color: 'emerald',
        description: 'Healthy balance between real industrial fuel consumption and baseline safe-haven precious metals exposure.',
      },
      {
        label: 'Energy Super-Spike / Cost-Push Inflation',
        min: 0.0,
        max: 14.0,
        color: 'sky',
        description: 'Crude supply bottlenecks or embargoes drive energy costs skyward relative to bullion.',
      },
    ],
    quickScenarios: [
      {
        title: 'Middle East Energy Supply Shock',
        description: 'Strait of Hormuz disruptions send Brent crude to $120/bbl while gold stays at $2,700/oz.',
        numeratorValue: 2700,
        denominatorValue: 120,
      },
      {
        title: 'Safe Haven Flight Surge',
        description: 'Sovereign debt instability drives gold to $3,400/oz while oil cools to $68/bbl on slowing trade.',
        numeratorValue: 3400,
        denominatorValue: 68,
      },
      {
        title: 'Historical Equilibrium Mean Reversion',
        description: 'Markets return to historical 18x median: gold at $2,200/oz and oil at $80/bbl.',
        numeratorValue: 2200,
        denominatorValue: 80,
      },
    ],
    history: [
      { date: '1990', year: 1990, ratio: 16.4, numeratorValue: 385.0, denominatorValue: 23.5, eventNote: 'Gulf War Iraqi invasion of Kuwait' },
      { date: '1993', year: 1993, ratio: 22.4, numeratorValue: 359.0, denominatorValue: 16.0, eventNote: 'OPEC production quota disputes' },
      { date: '1998', year: 1998, ratio: 23.1, numeratorValue: 294.0, denominatorValue: 12.7, eventNote: 'Asian crisis collapses Asian oil demand' },
      { date: '2000', year: 2000, ratio: 9.8, numeratorValue: 279.0, denominatorValue: 28.5, eventNote: 'Post-recession oil demand re-acceleration' },
      { date: '2003', year: 2003, ratio: 12.8, numeratorValue: 363.0, denominatorValue: 28.4, eventNote: 'US invasion of Iraq' },
      { date: '2005', year: 2005, ratio: 8.2, numeratorValue: 445.0, denominatorValue: 54.5, eventNote: 'China-driven oil supercycle gathers pace' },
      { date: '2008-Q2', year: 2008, ratio: 6.5, numeratorValue: 870.0, denominatorValue: 133.0, eventNote: 'Historical all-time low: crude oil hits $140/bbl' },
      { date: '2008-Q4', year: 2008, ratio: 21.3, numeratorValue: 850.0, denominatorValue: 40.0, eventNote: 'Post-Lehman oil demand crash' },
      { date: '2011', year: 2011, ratio: 14.1, numeratorValue: 1570.0, denominatorValue: 111.0, eventNote: 'Arab Spring oil spikes alongside gold record' },
      { date: '2014', year: 2014, ratio: 12.8, numeratorValue: 1266.0, denominatorValue: 99.0, eventNote: 'US shale revolution reaches critical mass' },
      { date: '2016', year: 2016, ratio: 32.2, numeratorValue: 1160.0, denominatorValue: 36.0, eventNote: 'OPEC price war slashes oil to $30/bbl' },
      { date: '2018', year: 2018, ratio: 17.6, numeratorValue: 1268.0, denominatorValue: 72.0, eventNote: 'OPEC+ production management agreement' },
      { date: '2020-Q2', year: 2020, ratio: 75.0, numeratorValue: 1650.0, denominatorValue: 22.0, eventNote: 'COVID shutdowns: storage fills, oil collapses' },
      { date: '2021', year: 2021, ratio: 25.4, numeratorValue: 1800.0, denominatorValue: 71.0, eventNote: 'Global reopening and travel recovery' },
      { date: '2022-Q1', year: 2022, ratio: 18.4, numeratorValue: 1820.0, denominatorValue: 99.0, eventNote: 'Russia-Ukraine war creates energy premium' },
      { date: '2023', year: 2023, ratio: 23.7, numeratorValue: 1940.0, denominatorValue: 82.0, eventNote: 'Global inflation peak and energy cooldown' },
      { date: '2024', year: 2024, ratio: 30.5, numeratorValue: 2380.0, denominatorValue: 78.0, eventNote: 'Gold rallies on sovereign reserve de-dollarization' },
      { date: '2025', year: 2025, ratio: 34.9, numeratorValue: 2650.0, denominatorValue: 76.0, eventNote: 'Central bank bullion buying outpaces soft oil' },
      { date: '2026', year: 2026, ratio: 36.6, numeratorValue: 2742.80, denominatorValue: 74.85, eventNote: 'Current 2026 baseline: heightened bullion premium' },
    ],
  },
};

/*
 * Calculates the exact mathematical ratio based on user-supplied numerator and denominator
 * respecting the unit multiplier convention of each individual macroeconomic ratio model.
 */
export function calculateImpliedRatio(
  ratioId: 'copper-gold' | 'sp500-m2' | 'gold-oil',
  numerator: number,
  denominator: number
): number {
  if (denominator <= 0) return 0;
  if (ratioId === 'copper-gold') {
    // Copper ($/lb) / Gold ($/oz) multiplied by 1,000 to keep the points readable
    return Number(((numerator / denominator) * 1000).toFixed(2));
  }
  if (ratioId === 'sp500-m2') {
    // S&P 500 Index / US M2 ($ Billions)
    return Number((numerator / denominator).toFixed(3));
  }
  // Gold ($/oz) / Oil ($/bbl)
  return Number((numerator / denominator).toFixed(1));
}

/*
 * Determines the macroeconomic regime label, description, and UI color
 * for any simulated or current ratio value by matching against calibrated historical thresholds.
 */
export function evaluateRatioRegime(
  ratioId: 'copper-gold' | 'sp500-m2' | 'gold-oil',
  ratioValue: number
): {
  label: string;
  color: 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  description: string;
} {
  const model = CROSS_ASSET_RATIOS[ratioId];
  for (const t of model.thresholds) {
    if (ratioValue >= t.min && ratioValue <= t.max) {
      return {
        label: t.label,
        color: t.color,
        description: t.description,
      };
    }
  }

  // Handle boundary edge cases above or below threshold ranges
  if (ratioValue < model.thresholds[model.thresholds.length - 1].min) {
    const last = model.thresholds[model.thresholds.length - 1];
    return {
      label: last.label,
      color: last.color,
      description: last.description,
    };
  }

  const first = model.thresholds[0];
  return {
    label: first.label,
    color: first.color,
    description: first.description,
  };
}

/*
 * Computes the empirical percentile rank of a ratio value against the multi-decade history
 * to establish where it ranks in 1990–2026 distribution.
 */
export function calculatePercentileRank(
  ratioId: 'copper-gold' | 'sp500-m2' | 'gold-oil',
  ratioValue: number
): number {
  const model = CROSS_ASSET_RATIOS[ratioId];
  const sorted = model.history.map((h) => h.ratio).sort((a, b) => a - b);
  if (sorted.length === 0) return 50;

  const countBelow = sorted.filter((v) => v < ratioValue).length;
  const percentile = Math.round((countBelow / sorted.length) * 100);
  return Math.min(100, Math.max(0, percentile));
}

/*
 * Aggregates all three ratio models into a unified historical cross-sectional table
 * enabling researchers and analysts to export a single consolidated multi-asset CSV/JSON dataset.
 */
export function getCombinedCrossAssetExportData() {
  const years = Array.from(
    new Set(
      Object.values(CROSS_ASSET_RATIOS).flatMap((m) =>
        m.history.map((h) => h.date)
      )
    )
  );

  return years.map((date) => {
    const cg = CROSS_ASSET_RATIOS['copper-gold'].history.find((h) => h.date === date);
    const sm = CROSS_ASSET_RATIOS['sp500-m2'].history.find((h) => h.date === date);
    const go = CROSS_ASSET_RATIOS['gold-oil'].history.find((h) => h.date === date);

    return {
      date,
      copperPriceUsdPerLb: cg?.numeratorValue ?? null,
      goldPriceUsdPerOz: cg?.denominatorValue ?? go?.numeratorValue ?? null,
      copperGoldRatio: cg?.ratio ?? null,
      sp500Index: sm?.numeratorValue ?? null,
      usM2MoneySupplyBillions: sm?.denominatorValue ?? null,
      sp500ToM2Ratio: sm?.ratio ?? null,
      brentCrudeUsdPerBbl: go?.denominatorValue ?? null,
      goldOilRatio: go?.ratio ?? null,
      historicalMilestone: cg?.eventNote || sm?.eventNote || go?.eventNote || '',
    };
  });
}
