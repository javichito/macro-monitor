import { YieldCurveSurfaceDataset, YieldCurveSurfacePoint, YieldCurveSurfaceSlice } from '../lib/types';

export const STANDARD_SURFACE_TENORS = [
  '1M',
  '3M',
  '6M',
  '1Y',
  '2Y',
  '3Y',
  '5Y',
  '7Y',
  '10Y',
  '20Y',
  '30Y',
];

export const STANDARD_SURFACE_TENOR_MONTHS = [1, 3, 6, 12, 24, 36, 60, 84, 120, 240, 360];

// Helper to construct structured surface slices while preserving term spread calculations
function createSlice(
  dateLabel: string,
  year: number,
  yields: number[],
  macroEvent?: string,
  quarter?: string
): YieldCurveSurfaceSlice {
  const curve: YieldCurveSurfacePoint[] = STANDARD_SURFACE_TENORS.map((tenor, i) => ({
    tenor,
    tenorMonths: STANDARD_SURFACE_TENOR_MONTHS[i],
    yieldPercent: yields[i],
  }));

  // Indices: 3M is index 1, 2Y is index 4, 10Y is index 8
  const y10 = yields[8];
  const y2 = yields[4];
  const y3m = yields[1];
  const spread10Y2Y = Number((y10 - y2).toFixed(2));
  const spread10Y3M = Number((y10 - y3m).toFixed(2));

  return {
    dateLabel,
    year,
    quarter,
    curve,
    spread10Y2Y,
    spread10Y3M,
    isInverted: spread10Y2Y < 0 || spread10Y3M < 0,
    macroEvent,
  };
}

// Multi-decade US Treasury term structure evolution (1990 - 2026)
export const US_TREASURY_SURFACE_LONGTERM: YieldCurveSurfaceSlice[] = [
  createSlice('1990', 1990, [8.05, 8.20, 8.25, 8.35, 8.42, 8.48, 8.52, 8.58, 8.55, 8.70, 8.65], 'Early 90s recession; S&L clean-up and Gulf War oil shock'),
  createSlice('1992', 1992, [3.80, 4.05, 4.35, 4.90, 5.80, 6.30, 6.85, 7.15, 7.35, 7.75, 7.70], 'Aggressive Fed easing produces classic steep bull-steepening recovery'),
  createSlice('1994', 1994, [3.65, 4.25, 4.90, 5.65, 6.45, 6.80, 7.20, 7.45, 7.55, 7.85, 7.80], 'The "Great Bond Massacre": Greenspan surprises market with 300 bps of rate hikes'),
  createSlice('1996', 1996, [5.10, 5.25, 5.40, 5.65, 6.00, 6.20, 6.45, 6.60, 6.70, 7.00, 6.95], 'Goldilocks US productivity expansion and stabilizing term premia'),
  createSlice('1998', 1998, [4.85, 4.95, 5.05, 5.15, 5.20, 5.25, 5.30, 5.40, 5.45, 5.75, 5.65], 'Asian Financial Crisis and LTCM hedge fund liquidation rescue cuts'),
  createSlice('2000', 2000, [5.85, 6.10, 6.25, 6.15, 6.40, 6.42, 6.35, 6.25, 6.03, 6.15, 5.90], 'Dot-com bubble apex; curve inverts across 2Y-10Y and 3M-10Y'),
  createSlice('2001', 2001, [3.20, 3.45, 3.55, 3.65, 4.10, 4.40, 4.75, 5.00, 5.10, 5.65, 5.55], 'Post-9/11 aggressive rate reductions; steepening cycle commences'),
  createSlice('2003', 2003, [1.05, 1.12, 1.18, 1.30, 1.85, 2.35, 3.15, 3.75, 4.15, 5.05, 4.95], 'ZIRP-era predecessor with 1% Fed Funds rate battling deflation fears'),
  createSlice('2005', 2005, [2.85, 3.15, 3.40, 3.75, 4.05, 4.15, 4.25, 4.35, 4.40, 4.65, 4.58], 'Greenspan "conundrum": long-term yields remain anchored despite 25 bps hikes'),
  createSlice('2006', 2006, [4.85, 4.95, 5.10, 5.15, 4.98, 4.92, 4.88, 4.85, 4.82, 4.95, 4.90], 'Full curve inversion ahead of the housing market collapse and subprime bust'),
  createSlice('2007', 2007, [4.45, 4.55, 4.65, 4.60, 4.45, 4.45, 4.50, 4.55, 4.63, 4.85, 4.80], 'BNP Paribas freezes mortgage funds; interbank liquidity freezes'),
  createSlice('2008', 2008, [0.45, 0.95, 1.45, 1.70, 2.10, 2.50, 3.10, 3.50, 3.66, 4.30, 4.20], 'Lehman Brothers bankruptcy; emergency rate cuts drive front-end yields to zero'),
  createSlice('2009', 2009, [0.08, 0.16, 0.28, 0.45, 0.95, 1.45, 2.30, 2.90, 3.26, 4.15, 4.10], 'Steepest yield curve in modern history (+230 bps) via ZIRP and QE1 rollout'),
  createSlice('2011', 2011, [0.02, 0.05, 0.09, 0.12, 0.26, 0.42, 0.95, 1.50, 2.05, 2.85, 3.05], 'S&P downgrades US credit rating to AA+; Euro sovereign debt contagion'),
  createSlice('2013', 2013, [0.04, 0.06, 0.09, 0.13, 0.38, 0.75, 1.65, 2.25, 2.85, 3.65, 3.80], 'Ben Bernanke hints at tapering bond purchases ("Taper Tantrum" yield surge)'),
  createSlice('2015', 2015, [0.12, 0.22, 0.45, 0.65, 0.95, 1.25, 1.65, 2.00, 2.15, 2.70, 2.95], 'Janet Yellen engineers the first post-crisis interest rate liftoff (+25 bps)'),
  createSlice('2017', 2017, [1.05, 1.20, 1.35, 1.55, 1.85, 2.00, 2.20, 2.35, 2.45, 2.75, 2.80], 'Tax Cuts and Jobs Act; synchronized global economic expansion'),
  createSlice('2018', 2018, [2.15, 2.38, 2.50, 2.65, 2.75, 2.80, 2.85, 2.90, 2.95, 3.10, 3.15], 'Quantitative Tightening ($50B/mo runoff) and Fed hikes push curves to flat'),
  createSlice('2019', 2019, [1.75, 1.85, 1.82, 1.78, 1.72, 1.70, 1.75, 1.80, 1.85, 2.15, 2.30], 'Pre-COVID yield curve inversion; Fed executes three "insurance rate cuts"'),
  createSlice('2020', 2020, [0.08, 0.11, 0.14, 0.15, 0.15, 0.20, 0.40, 0.65, 0.89, 1.45, 1.65], 'COVID-19 pandemic shock; Jerome Powell slashes rates to 0% with unlimited QE'),
  createSlice('2021', 2021, [0.05, 0.06, 0.08, 0.25, 0.68, 0.95, 1.25, 1.42, 1.50, 1.95, 2.05], 'Vaccine reopening and trillion-dollar fiscal stimulus ignite initial inflation'),
  createSlice('2022', 2022, [3.85, 4.25, 4.55, 4.70, 4.40, 4.25, 4.00, 3.92, 3.85, 4.15, 3.95], 'Historic rate hiking blitz (four consecutive 75 bps hikes) triggers deep inversion'),
  createSlice('2023', 2023, [5.40, 5.48, 5.50, 5.35, 4.90, 4.60, 4.35, 4.28, 4.15, 4.45, 4.30], 'Silicon Valley Bank failure; peak inversion depth reaches -108 bps on 10Y-2Y'),
  createSlice('2024', 2024, [4.90, 4.80, 4.65, 4.30, 3.95, 3.85, 3.90, 4.00, 4.12, 4.45, 4.40], 'Fed begins easing with 50 bps jumbo rate cut; 10Y-2Y curve un-inverts'),
  createSlice('2025', 2025, [4.80, 4.68, 4.52, 4.25, 4.05, 4.00, 4.08, 4.15, 4.18, 4.48, 4.42], 'Global disinflation consolidates; neutral policy rate recalibration'),
  createSlice('2026', 2026, [4.82, 4.65, 4.48, 4.22, 4.02, 3.98, 4.05, 4.12, 4.19, 4.46, 4.41], 'Current par curve: dis-inversion on 10Y-2Y with persistent short-end term premium'),
];

// High-resolution quarterly snapshots capturing the full 2020-2026 inflation and easing cycle
export const US_TREASURY_SURFACE_MODERN: YieldCurveSurfaceSlice[] = [
  createSlice('2020 Q1', 2020, [0.08, 0.11, 0.14, 0.15, 0.25, 0.32, 0.45, 0.60, 0.70, 1.15, 1.35], 'COVID outbreak emergency cuts', 'Q1'),
  createSlice('2020 Q3', 2020, [0.08, 0.10, 0.12, 0.13, 0.14, 0.17, 0.28, 0.48, 0.68, 1.20, 1.45], 'Zero Lower Bound firmly anchored by Fed forward guidance', 'Q3'),
  createSlice('2021 Q1', 2021, [0.03, 0.04, 0.06, 0.08, 0.16, 0.35, 0.85, 1.25, 1.65, 2.25, 2.35], 'Reflation trade accelerates; long bond yields reprice higher', 'Q1'),
  createSlice('2021 Q3', 2021, [0.05, 0.05, 0.07, 0.09, 0.28, 0.55, 1.00, 1.35, 1.52, 1.98, 2.05], '"Transitory" inflation consensus begins showing cracks', 'Q3'),
  createSlice('2022 Q1', 2022, [0.35, 0.65, 1.15, 1.70, 2.30, 2.50, 2.55, 2.50, 2.35, 2.65, 2.55], 'Fed rate hike liftoff (+25 bps) amid Ukraine commodity shock', 'Q1'),
  createSlice('2022 Q3', 2022, [2.85, 3.35, 3.90, 4.15, 4.25, 4.20, 4.05, 3.90, 3.80, 4.00, 3.75], 'Rapid 75 bps hiking pace triggers severe 10Y-2Y curve inversion', 'Q3'),
  createSlice('2023 Q1', 2023, [4.75, 4.85, 4.95, 4.65, 4.10, 3.85, 3.65, 3.60, 3.50, 3.80, 3.70], 'SVB banking panic spurs massive flight-to-safety duration bids', 'Q1'),
  createSlice('2023 Q3', 2023, [5.55, 5.60, 5.55, 5.48, 5.05, 4.80, 4.65, 4.65, 4.60, 4.90, 4.75], '"Higher for longer" regime; 10Y Treasury yield tests 5.0% threshold', 'Q3'),
  createSlice('2024 Q1', 2024, [5.48, 5.45, 5.35, 5.05, 4.60, 4.40, 4.22, 4.22, 4.20, 4.45, 4.35], 'Soft-landing expectations solidify as US core CPI moderates', 'Q1'),
  createSlice('2024 Q3', 2024, [4.85, 4.65, 4.40, 4.00, 3.60, 3.55, 3.55, 3.65, 3.75, 4.10, 4.15], 'FOMC executes 50 bps jumbo easing step; 10Y-2Y officially dis-inverts', 'Q3'),
  createSlice('2025 Q1', 2025, [4.65, 4.50, 4.35, 4.15, 3.95, 3.90, 3.95, 4.05, 4.15, 4.42, 4.38], 'Gradual easing cadence while term premium returns to the long end', 'Q1'),
  createSlice('2025 Q3', 2025, [4.70, 4.58, 4.42, 4.18, 4.00, 3.95, 4.02, 4.10, 4.18, 4.45, 4.40], 'Neutral rate debate; balance sheet runoff approaches conclusion', 'Q3'),
  createSlice('2026 Q1', 2026, [4.80, 4.64, 4.47, 4.21, 4.01, 3.97, 4.04, 4.11, 4.18, 4.45, 4.41], 'Sovereign supply concessions sustain positive 10Y-2Y slope', 'Q1'),
  createSlice('2026 Now', 2026, [4.82, 4.65, 4.48, 4.22, 4.02, 3.98, 4.05, 4.12, 4.19, 4.46, 4.41], 'Live par sovereign benchmark curve with mild 10Y-3M inversion', 'Now'),
];

// German Bund term structure historical evolution (EUR)
export const GERMAN_BUND_SURFACE_LONGTERM: YieldCurveSurfaceSlice[] = [
  createSlice('1998', 1998, [3.35, 3.45, 3.55, 3.75, 4.00, 4.20, 4.50, 4.75, 4.90, 5.25, 5.30], 'Pre-Euro convergence across founding European member states'),
  createSlice('2002', 2002, [3.20, 3.30, 3.45, 3.65, 4.00, 4.30, 4.65, 4.90, 5.05, 5.40, 5.45], 'Physical Euro notes debut; ECB maintains steady monetary stability'),
  createSlice('2006', 2006, [3.40, 3.55, 3.70, 3.85, 3.95, 4.00, 4.05, 4.10, 4.15, 4.30, 4.35], 'European economic expansion leads ECB to hike policy rates'),
  createSlice('2008', 2008, [2.50, 2.75, 3.00, 3.20, 3.40, 3.60, 3.90, 4.10, 4.25, 4.50, 4.55], 'GFC spillover; flight to pristine German paper begins'),
  createSlice('2011', 2011, [1.10, 1.25, 1.40, 1.65, 1.85, 2.10, 2.50, 2.80, 2.95, 3.25, 3.30], 'Eurozone debt crisis intensifies; Bund yields plunge as safe haven'),
  createSlice('2014', 2014, [0.05, 0.08, 0.12, 0.18, 0.25, 0.40, 0.80, 1.15, 1.40, 1.85, 2.00], 'Mario Draghi introduces negative deposit rates (-0.10%) to defeat deflation'),
  createSlice('2016', 2016, [-0.60, -0.55, -0.50, -0.45, -0.35, -0.25, -0.10, 0.05, 0.20, 0.65, 0.85], 'Deep negative interest rate policy across Bund maturities up to 7 Years'),
  createSlice('2019', 2019, [-0.75, -0.70, -0.68, -0.65, -0.62, -0.58, -0.50, -0.40, -0.30, 0.15, 0.35], 'All German Bund yields turn negative out to 30 Years (record low -0.70%)'),
  createSlice('2020', 2020, [-0.65, -0.62, -0.60, -0.58, -0.55, -0.50, -0.42, -0.35, -0.25, 0.10, 0.25], 'ECB deploys PEPP (Pandemic Emergency Purchase Programme) of €1.85T'),
  createSlice('2022', 2022, [1.25, 1.50, 1.80, 2.10, 2.30, 2.35, 2.38, 2.40, 2.45, 2.65, 2.60], 'European energy crisis and ECB rate hiking exit 8 years of negative rates'),
  createSlice('2023', 2023, [3.60, 3.65, 3.55, 3.40, 3.20, 3.05, 2.85, 2.80, 2.85, 3.05, 3.00], 'Peak ECB deposit rate at 4.0%; German 10Y-2Y inverts heavily'),
  createSlice('2024', 2024, [3.85, 3.80, 3.65, 3.35, 2.95, 2.70, 2.52, 2.50, 2.55, 2.75, 2.70], 'ECB initiates rate cuts as Eurozone manufacturing growth contracts'),
  createSlice('2025', 2025, [3.20, 3.05, 2.85, 2.60, 2.35, 2.25, 2.30, 2.35, 2.45, 2.65, 2.60], 'Disinflation reaches 2% target; Bund term premium normalizes'),
  createSlice('2026', 2026, [2.85, 2.70, 2.50, 2.32, 2.15, 2.10, 2.18, 2.25, 2.38, 2.58, 2.55], 'Current Bund curve reflects neutral ECB policy setting with mild upward slope'),
];

// Japanese Government Bond (JGB) term structure evolution (JPY)
export const JPN_JGB_SURFACE_LONGTERM: YieldCurveSurfaceSlice[] = [
  createSlice('1990', 1990, [7.20, 7.35, 7.50, 7.65, 7.80, 7.90, 8.00, 8.10, 8.15, 8.35, 8.40], 'Bubble economy peak before historic asset-price collapse in Tokyo'),
  createSlice('1995', 1995, [1.80, 1.95, 2.15, 2.40, 2.80, 3.10, 3.50, 3.80, 4.00, 4.45, 4.55], 'Post-bubble deflation begins; Bank of Japan commences rate reductions'),
  createSlice('1999', 1999, [0.05, 0.10, 0.15, 0.25, 0.45, 0.70, 1.15, 1.45, 1.75, 2.35, 2.50], 'Bank of Japan pioneers the world first Zero Interest Rate Policy (ZIRP)'),
  createSlice('2003', 2003, [0.02, 0.03, 0.05, 0.08, 0.15, 0.25, 0.55, 0.85, 1.15, 1.85, 2.05], 'Quantitative Easing expansion targeting bank excess reserve balances'),
  createSlice('2007', 2007, [0.55, 0.65, 0.75, 0.85, 1.05, 1.20, 1.45, 1.65, 1.80, 2.35, 2.45], 'Brief normalization attempt prior to the 2008 global financial panic'),
  createSlice('2013', 2013, [0.10, 0.12, 0.14, 0.18, 0.25, 0.35, 0.55, 0.75, 0.90, 1.65, 1.85], 'Haruhiko Kuroda launches Quantitative and Qualitative Monetary Easing (QQE)'),
  createSlice('2016', 2016, [-0.15, -0.12, -0.10, -0.08, -0.05, -0.02, 0.00, 0.05, 0.10, 0.55, 0.75], 'BOJ adopts Yield Curve Control (YCC) pegging 10Y yields near 0.00%'),
  createSlice('2019', 2019, [-0.18, -0.15, -0.12, -0.10, -0.08, -0.05, -0.02, 0.02, 0.05, 0.42, 0.60], 'Extremely suppressed volatility under the strict ±0.20% YCC corridor'),
  createSlice('2021', 2021, [-0.10, -0.08, -0.05, -0.02, 0.00, 0.02, 0.05, 0.08, 0.10, 0.48, 0.68], 'Global yields lift off but BOJ maintains unlimited bond purchases at 0.25%'),
  createSlice('2023', 2023, [-0.05, -0.02, 0.02, 0.08, 0.15, 0.22, 0.35, 0.50, 0.65, 1.35, 1.65], 'Kazuo Ueda widens YCC tolerance band to 1.0% as core inflation exceeds 3%'),
  createSlice('2024', 2024, [-0.05, -0.02, 0.05, 0.12, 0.24, 0.32, 0.45, 0.62, 0.78, 1.50, 1.82], 'BOJ officially terminates negative interest rates and abolishes YCC'),
  createSlice('2025', 2025, [0.08, 0.15, 0.25, 0.38, 0.48, 0.55, 0.68, 0.80, 0.95, 1.60, 2.00], 'Policy rate lifted to 0.50%; Japanese yields reach multi-decade highs'),
  createSlice('2026', 2026, [0.15, 0.22, 0.35, 0.48, 0.58, 0.65, 0.78, 0.92, 1.08, 1.72, 2.14], 'Restored market price discovery yields steepest term premium in 15 years'),
];

// UK Gilt term structure evolution (GBP)
export const UK_GILT_SURFACE_LONGTERM: YieldCurveSurfaceSlice[] = [
  createSlice('1997', 1997, [6.50, 6.70, 6.85, 7.00, 7.20, 7.30, 7.40, 7.50, 7.60, 7.80, 7.85], 'Gordon Brown grants operational independence to the Bank of England'),
  createSlice('2003', 2003, [3.55, 3.65, 3.75, 3.90, 4.15, 4.35, 4.60, 4.80, 4.95, 5.20, 5.15], 'Global post-dotcom easing supports sustained British consumer growth'),
  createSlice('2007', 2007, [5.75, 5.85, 5.90, 5.85, 5.60, 5.45, 5.30, 5.20, 5.15, 5.10, 4.95], 'Northern Rock bank run triggers first UK lender collapse in 150 years'),
  createSlice('2009', 2009, [0.60, 0.85, 1.15, 1.45, 2.05, 2.55, 3.10, 3.45, 3.75, 4.25, 4.35], 'BoE slashes Bank Rate to 0.5% and rolls out initial Gilt Quantitative Easing'),
  createSlice('2016', 2016, [0.25, 0.30, 0.38, 0.45, 0.55, 0.68, 0.95, 1.20, 1.45, 2.00, 2.15], 'Brexit referendum shock prompts emergency 25 bps rate cut and asset purchase bump'),
  createSlice('2020', 2020, [0.05, 0.08, 0.12, 0.15, 0.18, 0.22, 0.35, 0.50, 0.70, 1.15, 1.30], 'Emergency COVID interventions reduce BoE Bank Rate to record low 0.10%'),
  createSlice('2022', 2022, [4.85, 4.95, 4.80, 4.55, 4.40, 4.30, 4.35, 4.45, 4.55, 4.90, 5.10], 'Truss-Kwarteng "mini-budget" triggers catastrophic LDI pension fund gilt crisis'),
  createSlice('2023', 2023, [5.35, 5.40, 5.30, 5.10, 4.80, 4.60, 4.50, 4.55, 4.60, 4.95, 5.00], 'Persistent UK services inflation forces Bank Rate to peak 5.25%'),
  createSlice('2024', 2024, [5.25, 5.20, 5.08, 4.85, 4.55, 4.40, 4.32, 4.38, 4.45, 4.90, 4.95], 'BoE commences measured easing cycle as inflation prints pull back toward 2%'),
  createSlice('2025', 2025, [4.85, 4.75, 4.60, 4.45, 4.25, 4.18, 4.20, 4.30, 4.40, 4.80, 4.85], 'Structural fiscal deficit risk premia keep UK long-end yields elevated'),
  createSlice('2026', 2026, [4.65, 4.52, 4.38, 4.25, 4.12, 4.08, 4.15, 4.28, 4.38, 4.78, 4.82], 'Current par UK Gilt curve displaying steepening at the super-long end'),
];

export const SOVEREIGN_SURFACES: Record<'USA' | 'DEU' | 'JPN' | 'GBR', {
  longterm: YieldCurveSurfaceDataset;
  modern?: YieldCurveSurfaceDataset;
}> = {
  USA: {
    longterm: {
      sovereignCode: 'USA',
      name: 'United States Treasury',
      flag: '🇺🇸',
      currency: 'USD',
      tenors: STANDARD_SURFACE_TENORS,
      tenorMonths: STANDARD_SURFACE_TENOR_MONTHS,
      slices: US_TREASURY_SURFACE_LONGTERM,
      minYield: 0.0,
      maxYield: 9.0,
      description: 'Historical US Treasury yield curve term structure spanning 1990 to 2026 across 1M to 30Y tenors.',
    },
    modern: {
      sovereignCode: 'USA',
      name: 'United States Treasury (Modern Cycle)',
      flag: '🇺🇸',
      currency: 'USD',
      tenors: STANDARD_SURFACE_TENORS,
      tenorMonths: STANDARD_SURFACE_TENOR_MONTHS,
      slices: US_TREASURY_SURFACE_MODERN,
      minYield: 0.0,
      maxYield: 6.0,
      description: 'High-frequency quarterly term structure evolution from 2020 COVID ZIRP through the 2022-2024 tightening and 2026 un-inversion.',
    },
  },
  DEU: {
    longterm: {
      sovereignCode: 'DEU',
      name: 'German Bund',
      flag: '🇩🇪',
      currency: 'EUR',
      tenors: STANDARD_SURFACE_TENORS,
      tenorMonths: STANDARD_SURFACE_TENOR_MONTHS,
      slices: GERMAN_BUND_SURFACE_LONGTERM,
      minYield: -1.0,
      maxYield: 6.0,
      description: 'Eurozone benchmark German Bund evolution through the European Sovereign Debt Crisis, negative rate era, and 2022-2026 normalization.',
    },
  },
  JPN: {
    longterm: {
      sovereignCode: 'JPN',
      name: 'Japanese Government Bond (JGB)',
      flag: '🇯🇵',
      currency: 'JPY',
      tenors: STANDARD_SURFACE_TENORS,
      tenorMonths: STANDARD_SURFACE_TENOR_MONTHS,
      slices: JPN_JGB_SURFACE_LONGTERM,
      minYield: -0.5,
      maxYield: 9.0,
      description: 'Japanese Government Bond term structure from the 1990 asset bubble, through 25 years of ZIRP/NIRP/YCC, to the historic 2024-2026 exit.',
    },
  },
  GBR: {
    longterm: {
      sovereignCode: 'GBR',
      name: 'UK Gilt',
      flag: '🇬🇧',
      currency: 'GBP',
      tenors: STANDARD_SURFACE_TENORS,
      tenorMonths: STANDARD_SURFACE_TENOR_MONTHS,
      slices: UK_GILT_SURFACE_LONGTERM,
      minYield: 0.0,
      maxYield: 8.5,
      description: 'UK sovereign Gilt curve evolution from Bank of England independence through the 2022 mini-budget LDI crisis to current fiscal consolidations.',
    },
  },
};

export type SurfaceColorPalette = 'thermal' | 'viridis' | 'spectral' | 'cyberpunk';

// Helper to linearly interpolate between color stops in RGB space
function interpolateRgb(c1: [number, number, number], c2: [number, number, number], factor: number): [number, number, number] {
  const f = Math.max(0, Math.min(1, factor));
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * f),
    Math.round(c1[1] + (c2[1] - c1[1]) * f),
    Math.round(c1[2] + (c2[2] - c1[2]) * f),
  ];
}

// Converts normalized value [0, 1] to RGB tuple based on chosen financial palette
export function getSurfaceColor(normalizedValue: number, palette: SurfaceColorPalette = 'thermal'): [number, number, number] {
  const v = Math.max(0, Math.min(1, normalizedValue));

  if (palette === 'viridis') {
    // Perceptually uniform Viridis palette for clear depth perception without colorblind bias
    const stops: Array<{ pos: number; rgb: [number, number, number] }> = [
      { pos: 0.0, rgb: [68, 1, 84] },
      { pos: 0.25, rgb: [59, 82, 139] },
      { pos: 0.5, rgb: [33, 145, 140] },
      { pos: 0.75, rgb: [94, 201, 98] },
      { pos: 1.0, rgb: [253, 231, 37] },
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      if (v <= stops[i + 1].pos) {
        const factor = (v - stops[i].pos) / (stops[i + 1].pos - stops[i].pos);
        return interpolateRgb(stops[i].rgb, stops[i + 1].rgb, factor);
      }
    }
    return stops[stops.length - 1].rgb;
  }

  if (palette === 'spectral') {
    // Traditional spectral palette matching financial terminal yield surface heatmaps
    const stops: Array<{ pos: number; rgb: [number, number, number] }> = [
      { pos: 0.0, rgb: [43, 131, 186] },
      { pos: 0.25, rgb: [171, 221, 164] },
      { pos: 0.5, rgb: [255, 255, 191] },
      { pos: 0.75, rgb: [253, 174, 97] },
      { pos: 1.0, rgb: [215, 25, 28] },
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      if (v <= stops[i + 1].pos) {
        const factor = (v - stops[i].pos) / (stops[i + 1].pos - stops[i].pos);
        return interpolateRgb(stops[i].rgb, stops[i + 1].rgb, factor);
      }
    }
    return stops[stops.length - 1].rgb;
  }

  if (palette === 'cyberpunk') {
    // High-contrast futuristic theme for dark mode visualization
    const stops: Array<{ pos: number; rgb: [number, number, number] }> = [
      { pos: 0.0, rgb: [13, 27, 42] },
      { pos: 0.3, rgb: [0, 180, 216] },
      { pos: 0.6, rgb: [114, 9, 183] },
      { pos: 0.85, rgb: [247, 37, 133] },
      { pos: 1.0, rgb: [255, 183, 3] },
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      if (v <= stops[i + 1].pos) {
        const factor = (v - stops[i].pos) / (stops[i + 1].pos - stops[i].pos);
        return interpolateRgb(stops[i].rgb, stops[i + 1].rgb, factor);
      }
    }
    return stops[stops.length - 1].rgb;
  }

  // Default: Thermal Heatmap (Indigo -> Deep Blue -> Cyan -> Emerald -> Amber -> Crimson)
  const stops: Array<{ pos: number; rgb: [number, number, number] }> = [
    { pos: 0.0, rgb: [30, 58, 138] },
    { pos: 0.2, rgb: [2, 132, 199] },
    { pos: 0.4, rgb: [16, 185, 129] },
    { pos: 0.65, rgb: [234, 179, 8] },
    { pos: 0.85, rgb: [249, 115, 22] },
    { pos: 1.0, rgb: [225, 29, 72] },
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    if (v <= stops[i + 1].pos) {
      const factor = (v - stops[i].pos) / (stops[i + 1].pos - stops[i].pos);
      return interpolateRgb(stops[i].rgb, stops[i + 1].rgb, factor);
    }
  }
  return stops[stops.length - 1].rgb;
}
