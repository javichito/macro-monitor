import {
  MacroQuadrant,
  RegimeCoordinates,
  EconomyRegimePoint,
  MacroRegimeMilestone,
} from '../lib/types';

/**
 * Classifies an economy into one of the four classic Ray Dalio / Bridgewater
 * business cycle quadrants based on relative momentum:
 * Quadrant 1 (Goldilocks): Growth Accelerating (+), Inflation Decelerating (-)
 * Quadrant 2 (Reflation): Growth Accelerating (+), Inflation Accelerating (+)
 * Quadrant 3 (Stagflation): Growth Decelerating (-), Inflation Accelerating (+)
 * Quadrant 4 (Deflation): Growth Decelerating (-), Inflation Decelerating (-)
 */
export function classifyRegime(growthMomentum: number, inflationMomentum: number): MacroQuadrant {
  if (growthMomentum >= 0 && inflationMomentum < 0) return 'goldilocks';
  if (growthMomentum >= 0 && inflationMomentum >= 0) return 'reflation';
  if (growthMomentum < 0 && inflationMomentum >= 0) return 'stagflation';
  return 'deflation';
}

export const REGIME_PLAYBOOKS: Record<
  MacroQuadrant,
  {
    label: string;
    description: string;
    macroEnvironment: string;
    favorableAssetClasses: string[];
    headwindAssetClasses: string[];
    color: string;
    bgColor: string;
    borderColor: string;
    themeClasses: {
      badge: string;
      panel: string;
      title: string;
      favorableText: string;
      headwindText: string;
      bullet: string;
    };
  }
> = {
  goldilocks: {
    label: 'Goldilocks / Disinflationary Boom',
    description: 'Growth is accelerating above trend while inflation is cooling down toward central bank targets.',
    macroEnvironment: 'Monetary policy is neutral or easing while productivity expands profit margins without wage-price spirals.',
    favorableAssetClasses: ['Public Equities (Tech, Growth)', 'High-Yield & Corporate Credit', 'Emerging Market Equities'],
    headwindAssetClasses: ['Cash & Money Market Funds', 'Physical Commodities', 'Defensive Utilities'],
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.12)',
    borderColor: 'rgba(52, 211, 153, 0.35)',
    themeClasses: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
      panel: 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-500/[0.10] dark:border-emerald-500/30',
      title: 'text-emerald-700 dark:text-emerald-400',
      favorableText: 'text-emerald-700 dark:text-emerald-300',
      headwindText: 'text-rose-700 dark:text-rose-300',
      bullet: 'bg-emerald-600 dark:bg-emerald-400',
    },
  },
  reflation: {
    label: 'Reflation / Overheating Expansion',
    description: 'Economic growth is robust and above capacity, fueling upward pricing power and resource bottlenecks.',
    macroEnvironment: 'Demand pulls commodity and energy costs higher; central banks begin or sustain tightening cycles.',
    favorableAssetClasses: ['Commodities (Energy, Copper)', 'Real Estate & Farmland', 'TIPS & Inflation-Linked Bonds', 'Value Equities'],
    headwindAssetClasses: ['Long-Duration Sovereign Bonds', 'Speculative High-Multiple Tech', 'Nominal Cash'],
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.35)',
    themeClasses: {
      badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
      panel: 'bg-amber-50/70 border-amber-200 dark:bg-amber-500/[0.10] dark:border-amber-500/30',
      title: 'text-amber-700 dark:text-amber-300',
      favorableText: 'text-emerald-700 dark:text-emerald-300',
      headwindText: 'text-rose-700 dark:text-rose-300',
      bullet: 'bg-amber-600 dark:bg-amber-400',
    },
  },
  stagflation: {
    label: 'Stagflation / Supply Crunch',
    description: 'Economic output is stagnating or slowing while cost-push inflation remains persistently elevated.',
    macroEnvironment: 'The worst environment for balanced 60/40 portfolios; central banks face conflicting mandates between recession and price stability.',
    favorableAssetClasses: ['Physical Gold & Bullion', 'Short-Term T-Bills / Cash', 'Energy & Agriculture Producers'],
    headwindAssetClasses: ['Broad Equities (Multiple Compression)', 'Fixed-Coupon Long Bonds', 'Real Estate Development'],
    color: '#f87171',
    bgColor: 'rgba(248, 113, 113, 0.12)',
    borderColor: 'rgba(248, 113, 113, 0.35)',
    themeClasses: {
      badge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
      panel: 'bg-rose-50/70 border-rose-200 dark:bg-rose-500/[0.10] dark:border-rose-500/30',
      title: 'text-rose-700 dark:text-rose-400',
      favorableText: 'text-emerald-700 dark:text-emerald-300',
      headwindText: 'text-rose-700 dark:text-rose-300',
      bullet: 'bg-rose-600 dark:bg-rose-400',
    },
  },
  deflation: {
    label: 'Deflation / Contraction',
    description: 'Aggregate demand shrinks alongside falling general price levels and widening output gaps.',
    macroEnvironment: 'Credit destruction, consumer retrenchment, and aggressive central bank emergency quantitative easing and rate cuts.',
    favorableAssetClasses: ['Long-Term Sovereign Treasuries', 'Defensive Dividend Equities (Healthcare, Staples)', 'US Dollar (Cash Hoarding)'],
    headwindAssetClasses: ['Cyclical Equities', 'Industrial Commodities', 'High-Yield Credit & Distressed Debt'],
    color: '#818cf8',
    bgColor: 'rgba(129, 140, 248, 0.12)',
    borderColor: 'rgba(129, 140, 248, 0.35)',
    themeClasses: {
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
      panel: 'bg-indigo-50/70 border-indigo-200 dark:bg-indigo-500/[0.10] dark:border-indigo-500/30',
      title: 'text-indigo-700 dark:text-indigo-400',
      favorableText: 'text-emerald-700 dark:text-emerald-300',
      headwindText: 'text-rose-700 dark:text-rose-300',
      bullet: 'bg-indigo-600 dark:bg-indigo-400',
    },
  },
};

export const ECONOMY_REGIME_POINTS: EconomyRegimePoint[] = [
  {
    code: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    currentCoordinates: {
      growthMomentum: 22,
      inflationMomentum: -18,
      quadrant: 'goldilocks',
      label: 'Goldilocks / Resilient Expansion',
      description: 'US GDP growth outpaces developed peers fueled by AI capex and fiscal momentum, while shelter and core services inflation trend downward.',
      favorableAssetClasses: REGIME_PLAYBOOKS.goldilocks.favorableAssetClasses,
      headwindAssetClasses: REGIME_PLAYBOOKS.goldilocks.headwindAssetClasses,
    },
    historicalTrail: [
      {
        year: 2021,
        coordinates: {
          growthMomentum: 65,
          inflationMomentum: 48,
          quadrant: 'reflation',
          label: 'Post-Pandemic Stimulus Boom',
          description: 'Emergency monetary expansion drove rapid growth and sparked commodity inflation.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
      {
        year: 2022,
        coordinates: {
          growthMomentum: -28,
          inflationMomentum: 72,
          quadrant: 'stagflation',
          label: 'Supply Chain & Rate Shock',
          description: 'Global inflation hit 9.1% while Fed aggressive tightening crushed stock and bond multiples simultaneously.',
          favorableAssetClasses: REGIME_PLAYBOOKS.stagflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.stagflation.headwindAssetClasses,
        },
      },
      {
        year: 2023,
        coordinates: {
          growthMomentum: 15,
          inflationMomentum: 25,
          quadrant: 'reflation',
          label: 'Higher-for-Longer Resilience',
          description: 'US growth proved surprisingly immune to 5.25% rates while inflation remained sticky above 3%.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
      {
        year: 2024,
        coordinates: {
          growthMomentum: 18,
          inflationMomentum: -8,
          quadrant: 'goldilocks',
          label: 'Disinflation Soft Landing',
          description: 'Labor market balanced without recession as the Fed began its rate normalization campaign.',
          favorableAssetClasses: REGIME_PLAYBOOKS.goldilocks.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.goldilocks.headwindAssetClasses,
        },
      },
      {
        year: 2025,
        coordinates: {
          growthMomentum: 20,
          inflationMomentum: -14,
          quadrant: 'goldilocks',
          label: 'Productivity Acceleration',
          description: 'Automation and enterprise efficiency gains supported earnings margins as inflation approached 2.3%.',
          favorableAssetClasses: REGIME_PLAYBOOKS.goldilocks.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.goldilocks.headwindAssetClasses,
        },
      },
      {
        year: 2026,
        coordinates: {
          growthMomentum: 22,
          inflationMomentum: -18,
          quadrant: 'goldilocks',
          label: 'Goldilocks Maturation',
          description: 'Sustainable trend growth accompanied by stabilized terminal policy rates.',
          favorableAssetClasses: REGIME_PLAYBOOKS.goldilocks.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.goldilocks.headwindAssetClasses,
        },
      },
    ],
  },
  {
    code: 'EUR',
    name: 'Eurozone',
    flag: '🇪🇺',
    currentCoordinates: {
      growthMomentum: -12,
      inflationMomentum: -24,
      quadrant: 'deflation',
      label: 'Stagnant Disinflation',
      description: 'Sluggish industrial output in Germany and Italy pushes ECB deposit rates downward to avert persistent deflation.',
      favorableAssetClasses: REGIME_PLAYBOOKS.deflation.favorableAssetClasses,
      headwindAssetClasses: REGIME_PLAYBOOKS.deflation.headwindAssetClasses,
    },
    historicalTrail: [
      {
        year: 2021,
        coordinates: {
          growthMomentum: 50,
          inflationMomentum: 32,
          quadrant: 'reflation',
          label: 'Reopening Recovery',
          description: 'European service rebound after lockdown restrictions.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
      {
        year: 2022,
        coordinates: {
          growthMomentum: -45,
          inflationMomentum: 85,
          quadrant: 'stagflation',
          label: 'European Energy Crisis',
          description: 'Natural gas price explosion sent Eurozone inflation past 10% while heavy industry idled.',
          favorableAssetClasses: REGIME_PLAYBOOKS.stagflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.stagflation.headwindAssetClasses,
        },
      },
      {
        year: 2023,
        coordinates: {
          growthMomentum: -15,
          inflationMomentum: 12,
          quadrant: 'stagflation',
          label: 'Lingering Malaise',
          description: 'Weak manufacturing and German recession pressures.',
          favorableAssetClasses: REGIME_PLAYBOOKS.stagflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.stagflation.headwindAssetClasses,
        },
      },
      {
        year: 2024,
        coordinates: {
          growthMomentum: -8,
          inflationMomentum: -16,
          quadrant: 'deflation',
          label: 'Rapid CPI Normalization',
          description: 'Headline inflation drops below 2.2%, triggering consecutive ECB cuts.',
          favorableAssetClasses: REGIME_PLAYBOOKS.deflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.deflation.headwindAssetClasses,
        },
      },
      {
        year: 2026,
        coordinates: {
          growthMomentum: -12,
          inflationMomentum: -24,
          quadrant: 'deflation',
          label: 'Stagnant Disinflation',
          description: 'Structural energy costs and demographic drag keep European growth subdued.',
          favorableAssetClasses: REGIME_PLAYBOOKS.deflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.deflation.headwindAssetClasses,
        },
      },
    ],
  },
  {
    code: 'CHN',
    name: 'China',
    flag: '🇨🇳',
    currentCoordinates: {
      growthMomentum: -8,
      inflationMomentum: -42,
      quadrant: 'deflation',
      label: 'Balance Sheet Deleveraging / Deflationary Drag',
      description: 'Persistent property sector restructuring and consumer caution keep CPI near 0.5% and PPI negative.',
      favorableAssetClasses: REGIME_PLAYBOOKS.deflation.favorableAssetClasses,
      headwindAssetClasses: REGIME_PLAYBOOKS.deflation.headwindAssetClasses,
    },
    historicalTrail: [
      {
        year: 2021,
        coordinates: {
          growthMomentum: 40,
          inflationMomentum: 10,
          quadrant: 'reflation',
          label: 'Export Engine Peak',
          description: 'Global goods demand buoyed Chinese manufacturing.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
      {
        year: 2022,
        coordinates: {
          growthMomentum: -35,
          inflationMomentum: -15,
          quadrant: 'deflation',
          label: 'Zero-COVID Restraints',
          description: 'Lockdowns curtailed domestic demand and slowed construction.',
          favorableAssetClasses: REGIME_PLAYBOOKS.deflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.deflation.headwindAssetClasses,
        },
      },
      {
        year: 2024,
        coordinates: {
          growthMomentum: 5,
          inflationMomentum: -38,
          quadrant: 'deflation',
          label: 'Supply Expansion vs Domestic Deflation',
          description: 'High-tech manufacturing export surge offset by domestic real estate contraction.',
          favorableAssetClasses: REGIME_PLAYBOOKS.deflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.deflation.headwindAssetClasses,
        },
      },
      {
        year: 2026,
        coordinates: {
          growthMomentum: -8,
          inflationMomentum: -42,
          quadrant: 'deflation',
          label: 'Structural Transition',
          description: 'Transition toward green energy and semiconductors amid managed debt consolidation.',
          favorableAssetClasses: REGIME_PLAYBOOKS.deflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.deflation.headwindAssetClasses,
        },
      },
    ],
  },
  {
    code: 'JPN',
    name: 'Japan',
    flag: '🇯🇵',
    currentCoordinates: {
      growthMomentum: 12,
      inflationMomentum: 15,
      quadrant: 'reflation',
      label: 'Virtuous Wage-Price Cycle (Exiting Deflation)',
      description: 'Sustained wage gains in annual Shunto rounds firmly anchor inflation around 2%, enabling BOJ monetary policy normalization.',
      favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
      headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
    },
    historicalTrail: [
      {
        year: 2021,
        coordinates: {
          growthMomentum: -10,
          inflationMomentum: -45,
          quadrant: 'deflation',
          label: 'Decades of Deflationary Habit',
          description: 'Core CPI stayed negative despite global price surges.',
          favorableAssetClasses: REGIME_PLAYBOOKS.deflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.deflation.headwindAssetClasses,
        },
      },
      {
        year: 2023,
        coordinates: {
          growthMomentum: 14,
          inflationMomentum: 35,
          quadrant: 'reflation',
          label: 'Imported Cost-Push Inflection',
          description: 'Yen depreciation propelled headline CPI to 4-decade highs.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
      {
        year: 2026,
        coordinates: {
          growthMomentum: 12,
          inflationMomentum: 15,
          quadrant: 'reflation',
          label: 'Sustainable Price Discovery',
          description: 'Positive real interest rate transition and corporate governance reform.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
    ],
  },
  {
    code: 'IND',
    name: 'India',
    flag: '🇮🇳',
    currentCoordinates: {
      growthMomentum: 48,
      inflationMomentum: 8,
      quadrant: 'reflation',
      label: 'High-Growth Industrial Expansion',
      description: 'World-leading GDP growth (>6.5%) powered by infrastructure capex and global supply chain diversification.',
      favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
      headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
    },
    historicalTrail: [
      {
        year: 2022,
        coordinates: {
          growthMomentum: 42,
          inflationMomentum: 38,
          quadrant: 'reflation',
          label: 'Post-Pandemic Surge',
          description: 'Rapid recovery coupled with food and crude oil price pressures.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
      {
        year: 2024,
        coordinates: {
          growthMomentum: 45,
          inflationMomentum: 14,
          quadrant: 'reflation',
          label: 'CapEx Boom',
          description: 'Corporate balance sheets clean, fueling sustained capital formation.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
      {
        year: 2026,
        coordinates: {
          growthMomentum: 48,
          inflationMomentum: 8,
          quadrant: 'reflation',
          label: 'Demographic Dividend',
          description: 'Expansion supported by digital public infrastructure and manufacturing incentives.',
          favorableAssetClasses: REGIME_PLAYBOOKS.reflation.favorableAssetClasses,
          headwindAssetClasses: REGIME_PLAYBOOKS.reflation.headwindAssetClasses,
        },
      },
    ],
  },
];

export const MACRO_REGIME_MILESTONES: MacroRegimeMilestone[] = [
  {
    year: 1980,
    title: 'The Volcker Stagflation Cleansing',
    quadrant: 'stagflation',
    catalyst: 'Double-digit CPI with stagnant output broken by 20% Fed funds policy rate.',
    assetLeader: 'Physical Gold ($850 peak) and Cash',
  },
  {
    year: 1995,
    title: 'The Great Disinflationary Technology Boom',
    quadrant: 'goldilocks',
    catalyst: 'Productivity revolution from commercial internet alongside Greenspan soft landing.',
    assetLeader: 'Public Equities (Nasdaq & S&P 500)',
  },
  {
    year: 2008,
    title: 'The Great Financial Crisis Liquidity Freeze',
    quadrant: 'deflation',
    catalyst: 'Systemic banking collapse and debt liquidation across subprime mortgages.',
    assetLeader: 'Long-Term US Treasuries & Cash',
  },
  {
    year: 2021,
    title: 'Unprecedented Stimulus & Reflation Wave',
    quadrant: 'reflation',
    catalyst: 'Coordinated global fiscal checks and central bank quantitative easing.',
    assetLeader: 'Commodities, Real Estate & Crypto',
  },
  {
    year: 2022,
    title: 'The War & Supply Chain Inflation Shock',
    quadrant: 'stagflation',
    catalyst: 'Ukraine war energy embargoes and Chinese zero-COVID bottlenecks spiked CPI to 9.1%.',
    assetLeader: 'Crude Oil, Gold & 3-Month T-Bills',
  },
  {
    year: 2026,
    title: 'AI Productivity & Normalization Horizon',
    quadrant: 'goldilocks',
    catalyst: 'Efficiency gains offset aging demographics while central banks maintain terminal rates.',
    assetLeader: 'Productive Tech Equities & Sovereign Bullion',
  },
];
