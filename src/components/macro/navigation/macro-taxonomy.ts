import {
  Compass,
  Activity,
  ShieldAlert,
  Flame,
  Home,
  Zap,
  Users,
  TrendingUp,
  Globe2,
  Calendar,
  Landmark,
  Layers,
  Scale,
  LayoutDashboard,
  LucideIcon,
} from 'lucide-react';

export type MacroPillarId =
  | 'briefing'
  | 'regimes'
  | 'rates-liquidity'
  | 'credit-markets'
  | 'real-economy'
  | 'events-external'
  | 'all';

export type MacroSectionTab =
  | 'briefing'
  | 'all'
  | 'regimes'
  | 'ratios'
  | 'yields'
  | 'credit'
  | 'volatility'
  | 'housing'
  | 'physical'
  | 'leading'
  | 'labor'
  | 'inflation'
  | 'external'
  | 'calendar'
  | 'liquidity'
  | 'mechanics';

export interface MacroSubTab {
  id: MacroSectionTab;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  badge?: string;
  description: string;
}

export interface MacroPillar {
  id: MacroPillarId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  description: string;
  subTabs: MacroSubTab[];
}

/*
 * Grouping 15 micro-tabs into 5 intuitive analytical pillars aligns with institutional macro mental models
 * (Regime Clock -> Monetary Plumbing -> Credit Spreads -> Physical Fundamentals -> Catalysts).
 */
export const MACRO_PILLARS: MacroPillar[] = [
  {
    id: 'briefing',
    label: 'Executive Briefing',
    shortLabel: 'Briefing',
    icon: LayoutDashboard,
    description: 'High-altitude signal matrix, active macro regime, and key stress radars.',
    subTabs: [],
  },
  {
    id: 'regimes',
    label: 'Regimes & Business Cycle',
    shortLabel: 'Cycle',
    icon: Compass,
    description: 'Dalio growth-inflation clock, leading indicators, GDP nowcasting, and Sahm rule.',
    subTabs: [
      {
        id: 'regimes',
        label: 'Macro Regime Clock',
        shortLabel: 'Regime Clock',
        icon: Compass,
        description: 'Ray Dalio 4-quadrant growth vs inflation asset allocation matrix.',
      },
      {
        id: 'leading',
        label: 'Leading Indicators & Nowcast',
        shortLabel: 'Nowcast & PMI',
        icon: Zap,
        description: 'Atlanta Fed GDPNow, ISM Manufacturing PMI diffusion, and Conference Board LEI.',
      },
      {
        id: 'labor',
        label: 'Sahm Rule & Labor Dynamics',
        shortLabel: 'Sahm & Labor',
        icon: Users,
        description: 'Claudia Sahm 0.50% recession threshold and Beveridge curve dynamics.',
      },
    ],
  },
  {
    id: 'rates-liquidity',
    label: 'Rates, Liquidity & Debt',
    shortLabel: 'Plumbing',
    icon: Activity,
    description: 'Sovereign yield curve term structures, MOVE index, T-bill issuance, and central bank balance sheets.',
    subTabs: [
      {
        id: 'yields',
        label: 'Sovereign Yield Curves & 3D',
        shortLabel: 'Yield Curves',
        icon: Activity,
        description: '2Y/10Y inversion monitoring and 3D term structure evolution surface.',
      },
      {
        id: 'volatility',
        label: 'Bond Volatility & Collateral',
        shortLabel: 'MOVE & Collateral',
        icon: Flame,
        description: 'ICE BofA MOVE index, repo haircuts, and Treasury basis trade dynamics.',
      },
      {
        id: 'liquidity',
        label: 'Central Bank Liquidity & Fiscal',
        shortLabel: 'CB Liquidity',
        icon: Landmark,
        description: 'Global net liquidity (Fed, ECB, BoJ, PBoC) and fiscal dominance simulation.',
      },
      {
        id: 'mechanics',
        label: 'Money Velocity & Issuance',
        shortLabel: 'Velocity & Bills',
        icon: Layers,
        description: 'M2 velocity collapse, Treasury bill bias, and Fed ON RRP cash buffers.',
      },
    ],
  },
  {
    id: 'credit-markets',
    label: 'Credit & Market Structure',
    shortLabel: 'Credit & Ratios',
    icon: ShieldAlert,
    description: 'High-yield corporate spreads, Chicago Fed NFCI, SLOOS tightening, and cross-asset valuation ratios.',
    subTabs: [
      {
        id: 'credit',
        label: 'Corporate Credit & Financial Conditions',
        shortLabel: 'Credit & NFCI',
        icon: ShieldAlert,
        description: 'High-Yield OAS spreads, Chicago Fed NFCI, and Fed SLOOS lending standards.',
      },
      {
        id: 'ratios',
        label: 'Cross-Asset Ratio Studio',
        shortLabel: 'Macro Ratios',
        icon: Scale,
        description: 'Copper/Gold industrial pulse, S&P 500/M2 fiat debasement, and Gold/Oil energy ratios.',
      },
    ],
  },
  {
    id: 'real-economy',
    label: 'Physical Economy & Inflation',
    shortLabel: 'Physical Economy',
    icon: Home,
    description: 'Residential housing lock-in, global energy burden (% GDP), supply chain bottlenecks, and inflation anatomy.',
    subTabs: [
      {
        id: 'housing',
        label: 'Housing & Affordability',
        shortLabel: 'Housing & Mortgages',
        icon: Home,
        description: 'Housing Affordability Index (HAI), 30Y mortgage golden handcuffs, and real prices.',
      },
      {
        id: 'physical',
        label: 'Energy, Deglobalization & Demographics',
        shortLabel: 'Energy & Deglob',
        icon: Zap,
        description: 'Primary energy expenditure % of GDP, trade friendshoring, and secular demographic cliffs.',
      },
      {
        id: 'inflation',
        label: 'Inflation Anatomy & Components',
        shortLabel: 'Inflation Anatomy',
        icon: TrendingUp,
        description: 'Supercore services, shelter lag, Cleveland Fed median CPI, and GSCPI bottlenecks.',
      },
    ],
  },
  {
    id: 'events-external',
    label: 'External Sector & Calendar',
    shortLabel: 'External & Events',
    icon: Globe2,
    description: 'Balance of Payments, US TIC de-dollarization, BIS REER, and Citi Economic Surprise Index.',
    subTabs: [
      {
        id: 'external',
        label: 'External Sector, FX & TIC',
        shortLabel: 'External & FX',
        icon: Globe2,
        description: 'Current Account twin deficits, BIS Real Effective Exchange Rates, and foreign TIC holdings.',
      },
      {
        id: 'calendar',
        label: 'Macro Calendar & Surprise Index',
        shortLabel: 'Calendar & CESI',
        icon: Calendar,
        description: 'Citi Economic Surprise Index (CESI), central bank blackout tracker, and consensus expectation deltas.',
      },
    ],
  },
];

/*
 * Maps any valid subtab ID back to its parent pillar to allow seamless deep-linking
 * and preserve backwards compatibility with existing bookmarks and URL parameters.
 */
export function getPillarForSubTab(tab: MacroSectionTab): MacroPillarId {
  if (tab === 'briefing') return 'briefing';
  if (tab === 'all') return 'all';

  for (const pillar of MACRO_PILLARS) {
    if (pillar.subTabs.some((sub) => sub.id === tab)) {
      return pillar.id;
    }
  }

  return 'briefing';
}
