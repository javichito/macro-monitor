/*
 * Real-time asset proxies complement annual wealth reports by capturing
 * immediate shifts in monetary liquidity, cost-push inflation, and sovereign risk premia.
 * Values reflect the 2026 macroeconomic regime of elevated fiscal debt, normalized policy rates,
 * and high central bank bullion accumulation.
 */

export interface MarketBenchmark {
  id: string;
  symbol: string;
  name: string;
  category: 'commodity' | 'rates' | 'equity' | 'crypto' | 'fx' | 'liquidity';
  price: number;
  changePercent: number;
  changeAbsolute: number;
  prefix: string;
  suffix: string;
  decimals: number;
  high52w: number;
  low52w: number;
  macroSignificance: string;
  correlationNote: string;
  sparkline: number[];
}

export const MARKET_BENCHMARKS: MarketBenchmark[] = [
  {
    id: 'gold',
    symbol: 'XAU/USD',
    name: 'Spot Gold',
    category: 'commodity',
    price: 2742.80,
    changePercent: 0.65,
    changeAbsolute: 17.70,
    prefix: '$',
    suffix: '/oz',
    decimals: 2,
    high52w: 2790.15,
    low52w: 2015.40,
    macroSignificance:
      'Gold serves as the ultimate counterparty-free reserve asset. Central banks in China, Poland, India, and Singapore aggressively accumulate bullion to diversify away from weaponized US dollar FX reserves.',
    correlationNote:
      'Historically inversely correlated with real 10-year US Treasury yields, but decoupling higher due to de-dollarization and structural fiscal deficits.',
    sparkline: [2680, 2695, 2710, 2705, 2728, 2735, 2742.8],
  },
  {
    id: 'us10y',
    symbol: 'US10Y',
    name: 'US 10Y Yield',
    category: 'rates',
    price: 4.19,
    changePercent: -0.71,
    changeAbsolute: -0.03,
    prefix: '',
    suffix: '%',
    decimals: 2,
    high52w: 4.74,
    low52w: 3.62,
    macroSignificance:
      'The foundational discount rate for global capitalism. Ten-year US Treasury yields dictate borrowing costs for sovereign governments, 30-year mortgages, corporate debt, and equity hurdle valuations.',
    correlationNote:
      'Rising yields compress equity price-to-earnings multiples and elevate debt refinancing burdens for developing and highly leveraged nations.',
    sparkline: [4.28, 4.25, 4.22, 4.24, 4.21, 4.20, 4.19],
  },
  {
    id: 'sp500',
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    category: 'equity',
    price: 5864.50,
    changePercent: 0.42,
    changeAbsolute: 24.50,
    prefix: '',
    suffix: ' pts',
    decimals: 2,
    high52w: 5920.00,
    low52w: 4950.25,
    macroSignificance:
      'The benchmark for global equity capital and household financial net worth. Represents over 50% of the world’s liquid public equity valuation, heavily weighted towards technological productivity leaders.',
    correlationNote:
      'Directly impacts the top 10% wealth bracket, which holds over 85% of all publicly traded equity shares.',
    sparkline: [5810, 5825, 5840, 5830, 5850, 5855, 5864.5],
  },
  {
    id: 'btc',
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    price: 68450.00,
    changePercent: 1.84,
    changeAbsolute: 1235.00,
    prefix: '$',
    suffix: '',
    decimals: 0,
    high52w: 73750.00,
    low52w: 41200.00,
    macroSignificance:
      'Digital store-of-value proxy sensitive to global central bank balance sheet expansion, institutional spot ETF flows, and cross-border capital flight.',
    correlationNote:
      'Trades as a high-beta liquidity barometer correlated with global M2 growth and real fiat interest rate expectations.',
    sparkline: [66200, 66800, 67400, 67100, 67900, 68100, 68450],
  },
  {
    id: 'dxy',
    symbol: 'DXY',
    name: 'US Dollar Index',
    category: 'fx',
    price: 103.65,
    changePercent: -0.18,
    changeAbsolute: -0.19,
    prefix: '',
    suffix: ' pts',
    decimals: 2,
    high52w: 106.50,
    low52w: 100.15,
    macroSignificance:
      'Measures the relative strength of the US dollar against a basket of 6 major trade partners (Euro, Yen, Pound, Canadian Dollar, Krona, Swiss Franc). Dictates global debt servicing costs for dollar borrowers.',
    correlationNote:
      'A surging DXY drains liquidity from emerging markets and tightens global financial conditions, while a softer dollar spurs global capital investment.',
    sparkline: [104.10, 103.95, 103.80, 103.90, 103.75, 103.70, 103.65],
  },
  {
    id: 'brent',
    symbol: 'BRENT',
    name: 'Brent Crude Oil',
    category: 'commodity',
    price: 74.85,
    changePercent: 0.82,
    changeAbsolute: 0.61,
    prefix: '$',
    suffix: '/bbl',
    decimals: 2,
    high52w: 92.40,
    low52w: 69.10,
    macroSignificance:
      'The lifeblood of industrial civilization and the leading cost-push driver of headline CPI inflation and petrochemical supply chains worldwide.',
    correlationNote:
      'Oil spikes act as a direct consumption tax on importing households while transferring wealth to sovereign petro-states in the Gulf, Norway, and the Americas.',
    sparkline: [73.8, 74.0, 74.3, 74.1, 74.5, 74.6, 74.85],
  },
  {
    id: 'm2',
    symbol: 'GLOBAL M2',
    name: 'Global Money Supply',
    category: 'liquidity',
    price: 104.40,
    changePercent: 0.28,
    changeAbsolute: 0.29,
    prefix: '$',
    suffix: 'T',
    decimals: 1,
    high52w: 105.10,
    low52w: 98.20,
    macroSignificance:
      'Aggregated broad money supply across the Federal Reserve, ECB, PBoC, and Bank of Japan. Broad money growth precedes asset valuation cycles by 6 to 12 months.',
    correlationNote:
      'Historically, total global financial asset valuations expand in tandem with broad M2 fiat credit creation.',
    sparkline: [103.5, 103.8, 104.0, 103.9, 104.1, 104.2, 104.4],
  },
];
