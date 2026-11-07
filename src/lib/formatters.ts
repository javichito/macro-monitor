import { CurrencyPerspective } from './types';
import { COUNTRY_PPP_METRICS } from './calculations';

/* 
 * The base year 2000 has a CPI benchmark of 100.
 * These factors translate nominal figures into constant real 2026 purchasing power
 * so everyday users can see if wealth actually bought more or simply inflated.
 */
const CPI_FACTORS_TO_2026: Record<number, number> = {
  1980: 3.82,
  1990: 2.45,
  1995: 2.11,
  2000: 1.88,
  2005: 1.66,
  2010: 1.48,
  2015: 1.37,
  2020: 1.26,
  2021: 1.20,
  2022: 1.11,
  2023: 1.07,
  2024: 1.04,
  2025: 1.02,
  2026: 1.00,
};

export function getCpiFactorTo2026(year: number): number {
  return CPI_FACTORS_TO_2026[year] ?? 1.0;
}

/*
 * Purchasing Power Parity (PPP) multipliers are inversely proportional to local price levels
 * relative to the US benchmark (priceLevelRatio = 1.00), so lower domestic costs amplify
 * the local buying power of a nominal dollar while expensive economies compress it.
 */
export function getCountryPppFactor(countryCode?: string): number {
  if (!countryCode || countryCode === 'GLOBAL') return 1.0;
  const metric = COUNTRY_PPP_METRICS[countryCode.toUpperCase()];
  if (!metric || metric.priceLevelRatio <= 0) return 1.0;
  return Number((1 / metric.priceLevelRatio).toFixed(4));
}

export function getBlocPppFactor(memberCodes: string[]): number {
  if (!memberCodes.length) return 1.0;
  const sum = memberCodes.reduce((acc, code) => acc + getCountryPppFactor(code), 0);
  return Number((sum / memberCodes.length).toFixed(4));
}

/*
 * PPP conversion factors reflect relative price level differences
 * across developing vs developed nations to avoid understating living standards.
 */
export function adjustValue(
  value: number,
  year: number,
  perspective: CurrencyPerspective,
  countryPppOrCode: number | string = 1.0
): number {
  if (perspective === 'nominal') {
    return value;
  }
  if (perspective === 'real') {
    const factor = getCpiFactorTo2026(year);
    return value * factor;
  }
  if (perspective === 'ppp') {
    const factor =
      typeof countryPppOrCode === 'string'
        ? getCountryPppFactor(countryPppOrCode)
        : countryPppOrCode;
    return value * factor;
  }
  return value;
}

export function formatCurrency(
  value: number,
  options?: {
    compact?: boolean;
    decimals?: number;
    showSign?: boolean;
  }
): string {
  const { compact = false, decimals = 1, showSign = false } = options || {};

  if (compact) {
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : showSign && value > 0 ? '+' : '';

    if (absVal >= 1_000_000_000_000) {
      return `${sign}$${(absVal / 1_000_000_000_000).toFixed(decimals)}T`;
    }
    if (absVal >= 1_000_000_000) {
      return `${sign}$${(absVal / 1_000_000_000).toFixed(decimals)}B`;
    }
    if (absVal >= 1_000_000) {
      return `${sign}$${(absVal / 1_000_000).toFixed(decimals)}M`;
    }
    if (absVal >= 1_000) {
      return `${sign}$${(absVal / 1_000).toFixed(decimals)}k`;
    }
    return `${sign}$${absVal.toFixed(0)}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
    signDisplay: showSign ? 'always' : 'auto',
  }).format(value);
}

export function formatTrillionUSD(value: number, decimals: number = 1): string {
  return `$${value.toFixed(decimals)}T`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
  }).format(value);
}
