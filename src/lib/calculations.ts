/*
 * We fit wealth distributions with a piecewise log-normal lower distribution
 * and Pareto upper tail because wealth inequality has an extreme power-law tail
 * that simple normal distributions fail to capture accurately.
 */
export interface PercentileResult {
  percentile: number; // 0 to 99.99
  bracketName: string;
  globalMedianRatio: number;
  countryMedianRatio: number;
  thresholds: {
    median: number;
    top10Percent: number;
    top1Percent: number;
  };
  summary: string;
}

export function calculateWealthPercentile(
  netWorthUSD: number,
  countryMedianUSD: number,
  countryMeanUSD: number
): PercentileResult {
  const safeWorth = Math.max(0, netWorthUSD);
  const globalMedianUSD = 9200;
  const globalTop10Threshold = 145000;
  const globalTop1Threshold = 1120000;

  /*
   * Estimate country-level top 10% and top 1% thresholds
   * based on the typical Gini relationship where top 10% begins near 3.2x mean
   * and top 1% begins near 11.5x mean in market economies.
   */
  const countryTop10 = countryMeanUSD * 2.8;
  const countryTop1 = countryMeanUSD * 9.5;

  let percentile = 0;

  if (safeWorth <= 0) {
    percentile = 5;
  } else if (safeWorth < countryMedianUSD) {
    /*
     * Quadratic interpolation from 0 to 50th percentile to reflect the rapid
     * accumulation curve below median wealth.
     */
    const ratio = safeWorth / countryMedianUSD;
    percentile = 5 + 45 * Math.pow(ratio, 0.75);
  } else if (safeWorth < countryTop10) {
    /*
     * Logarithmic scaling from median (50%) to the 90th percentile.
     */
    const progress = Math.log(safeWorth / countryMedianUSD) / Math.log(countryTop10 / countryMedianUSD);
    percentile = 50 + 40 * Math.min(1, Math.max(0, progress));
  } else if (safeWorth < countryTop1) {
    /*
     * Power interpolation between 90th percentile and 99th percentile.
     */
    const progress = Math.log(safeWorth / countryTop10) / Math.log(countryTop1 / countryTop10);
    percentile = 90 + 9 * Math.min(1, Math.max(0, progress));
  } else {
    /*
     * Pareto tail above top 1% approaching 99.99%.
     */
    const excessRatio = safeWorth / countryTop1;
    const tailExponent = 1.4;
    const unreachedFraction = 1 / Math.pow(excessRatio, tailExponent);
    percentile = 99 + (1 - Math.min(1, unreachedFraction)) * 0.99;
  }

  percentile = Math.min(99.99, Math.max(1, Number(percentile.toFixed(1))));

  let bracketName = 'Lower Global Deciles (<$10k)';
  if (safeWorth >= 1_000_000) {
    bracketName = 'Global High Net Worth (> $1M)';
  } else if (safeWorth >= 100_000) {
    bracketName = 'Global Upper Middle ($100k - $1M)';
  } else if (safeWorth >= 10_000) {
    bracketName = 'Global Emerging Middle ($10k - $100k)';
  }

  const globalMedianRatio = Number((safeWorth / globalMedianUSD).toFixed(1));
  const countryMedianRatio = Number((safeWorth / (countryMedianUSD || 1)).toFixed(1));

  let summary = '';
  if (percentile >= 99) {
    summary = `You are in the top 1% tier of your country and among the wealthiest fraction of the global population.`;
  } else if (percentile >= 90) {
    summary = `You sit within the top 10% bracket in your country, holding significantly more capital than the average global citizen.`;
  } else if (percentile >= 50) {
    summary = `You are above the median in your country, meaning your net worth surpasses at least half of the adult population.`;
  } else {
    summary = `You are building net worth relative to your national median; you are part of the broader wealth-building demographic.`;
  }

  return {
    percentile,
    bracketName,
    globalMedianRatio,
    countryMedianRatio,
    thresholds: {
      median: countryMedianUSD,
      top10Percent: Math.round(countryTop10),
      top1Percent: Math.round(countryTop1),
    },
    summary,
  };
}

/*
 * We compile empirical World Bank International Comparison Program (ICP) Price Level Ratios (PLR)
 * and sectoral cost multipliers relative to the United States (base = 1.00) across all 71 tracked nations.
 * These metrics capture the Balassa-Samuelson effect where non-tradable services and housing
 * are dramatically cheaper in developing nations while tradable goods remain closer in parity.
 */
export interface CountryPppMetric {
  code: string;
  priceLevelRatio: number;
  housingFactor: number;
  goodsFactor: number;
  servicesFactor: number;
  currencyCode: string;
  currencySymbol: string;
}

export const COUNTRY_PPP_METRICS: Record<string, CountryPppMetric> = {
  USA: { code: 'USA', priceLevelRatio: 1.00, housingFactor: 1.00, goodsFactor: 1.00, servicesFactor: 1.00, currencyCode: 'USD', currencySymbol: '$' },
  CHE: { code: 'CHE', priceLevelRatio: 1.36, housingFactor: 1.48, goodsFactor: 1.32, servicesFactor: 1.42, currencyCode: 'CHF', currencySymbol: 'CHF' },
  AUS: { code: 'AUS', priceLevelRatio: 1.08, housingFactor: 1.15, goodsFactor: 1.05, servicesFactor: 1.10, currencyCode: 'AUD', currencySymbol: 'A$' },
  CAN: { code: 'CAN', priceLevelRatio: 0.98, housingFactor: 0.96, goodsFactor: 0.99, servicesFactor: 0.97, currencyCode: 'CAD', currencySymbol: 'CA$' },
  GBR: { code: 'GBR', priceLevelRatio: 0.96, housingFactor: 0.98, goodsFactor: 0.95, servicesFactor: 0.96, currencyCode: 'GBP', currencySymbol: '£' },
  SGP: { code: 'SGP', priceLevelRatio: 0.94, housingFactor: 1.35, goodsFactor: 0.88, servicesFactor: 0.82, currencyCode: 'SGD', currencySymbol: 'S$' },
  SWE: { code: 'SWE', priceLevelRatio: 0.92, housingFactor: 0.88, goodsFactor: 0.94, servicesFactor: 0.93, currencyCode: 'SEK', currencySymbol: 'kr' },
  NLD: { code: 'NLD', priceLevelRatio: 0.91, housingFactor: 0.92, goodsFactor: 0.91, servicesFactor: 0.90, currencyCode: 'EUR', currencySymbol: '€' },
  FRA: { code: 'FRA', priceLevelRatio: 0.89, housingFactor: 0.85, goodsFactor: 0.92, servicesFactor: 0.88, currencyCode: 'EUR', currencySymbol: '€' },
  DEU: { code: 'DEU', priceLevelRatio: 0.87, housingFactor: 0.82, goodsFactor: 0.90, servicesFactor: 0.87, currencyCode: 'EUR', currencySymbol: '€' },
  ITA: { code: 'ITA', priceLevelRatio: 0.76, housingFactor: 0.68, goodsFactor: 0.82, servicesFactor: 0.74, currencyCode: 'EUR', currencySymbol: '€' },
  KOR: { code: 'KOR', priceLevelRatio: 0.72, housingFactor: 0.70, goodsFactor: 0.84, servicesFactor: 0.65, currencyCode: 'KRW', currencySymbol: '₩' },
  ESP: { code: 'ESP', priceLevelRatio: 0.70, housingFactor: 0.58, goodsFactor: 0.78, servicesFactor: 0.68, currencyCode: 'EUR', currencySymbol: '€' },
  JPN: { code: 'JPN', priceLevelRatio: 0.67, housingFactor: 0.62, goodsFactor: 0.75, servicesFactor: 0.62, currencyCode: 'JPY', currencySymbol: '¥' },
  ARE: { code: 'ARE', priceLevelRatio: 0.65, housingFactor: 0.78, goodsFactor: 0.68, servicesFactor: 0.58, currencyCode: 'AED', currencySymbol: 'AED' },
  TWN: { code: 'TWN', priceLevelRatio: 0.58, housingFactor: 0.54, goodsFactor: 0.66, servicesFactor: 0.52, currencyCode: 'TWD', currencySymbol: 'NT$' },
  SAU: { code: 'SAU', priceLevelRatio: 0.56, housingFactor: 0.48, goodsFactor: 0.64, servicesFactor: 0.54, currencyCode: 'SAR', currencySymbol: 'SAR' },
  POL: { code: 'POL', priceLevelRatio: 0.53, housingFactor: 0.45, goodsFactor: 0.60, servicesFactor: 0.50, currencyCode: 'PLN', currencySymbol: 'zł' },
  CHL: { code: 'CHL', priceLevelRatio: 0.52, housingFactor: 0.46, goodsFactor: 0.58, servicesFactor: 0.48, currencyCode: 'CLP', currencySymbol: 'CLP$' },
  MEX: { code: 'MEX', priceLevelRatio: 0.50, housingFactor: 0.38, goodsFactor: 0.56, servicesFactor: 0.45, currencyCode: 'MXN', currencySymbol: 'MX$' },
  CHN: { code: 'CHN', priceLevelRatio: 0.46, housingFactor: 0.42, goodsFactor: 0.52, servicesFactor: 0.40, currencyCode: 'CNY', currencySymbol: '¥' },
  BRA: { code: 'BRA', priceLevelRatio: 0.44, housingFactor: 0.36, goodsFactor: 0.50, servicesFactor: 0.42, currencyCode: 'BRL', currencySymbol: 'R$' },
  ARG: { code: 'ARG', priceLevelRatio: 0.42, housingFactor: 0.32, goodsFactor: 0.48, servicesFactor: 0.38, currencyCode: 'ARS', currencySymbol: 'AR$' },
  ZAF: { code: 'ZAF', priceLevelRatio: 0.39, housingFactor: 0.34, goodsFactor: 0.44, servicesFactor: 0.36, currencyCode: 'ZAR', currencySymbol: 'R' },
  TUR: { code: 'TUR', priceLevelRatio: 0.37, housingFactor: 0.30, goodsFactor: 0.42, servicesFactor: 0.34, currencyCode: 'TRY', currencySymbol: '₺' },
  RUS: { code: 'RUS', priceLevelRatio: 0.36, housingFactor: 0.28, goodsFactor: 0.44, servicesFactor: 0.32, currencyCode: 'RUB', currencySymbol: '₽' },
  COL: { code: 'COL', priceLevelRatio: 0.35, housingFactor: 0.26, goodsFactor: 0.41, servicesFactor: 0.32, currencyCode: 'COP', currencySymbol: 'COL$' },
  IDN: { code: 'IDN', priceLevelRatio: 0.32, housingFactor: 0.25, goodsFactor: 0.38, servicesFactor: 0.29, currencyCode: 'IDR', currencySymbol: 'Rp' },
  IND: { code: 'IND', priceLevelRatio: 0.28, housingFactor: 0.20, goodsFactor: 0.35, servicesFactor: 0.24, currencyCode: 'INR', currencySymbol: '₹' },
  NGA: { code: 'NGA', priceLevelRatio: 0.26, housingFactor: 0.22, goodsFactor: 0.32, servicesFactor: 0.22, currencyCode: 'NGN', currencySymbol: '₦' },
  EGY: { code: 'EGY', priceLevelRatio: 0.24, housingFactor: 0.18, goodsFactor: 0.30, servicesFactor: 0.20, currencyCode: 'EGP', currencySymbol: 'E£' },
  NOR: { code: 'NOR', priceLevelRatio: 1.14, housingFactor: 1.12, goodsFactor: 1.15, servicesFactor: 1.16, currencyCode: 'NOK', currencySymbol: 'kr' },
  IRL: { code: 'IRL', priceLevelRatio: 1.05, housingFactor: 1.24, goodsFactor: 1.01, servicesFactor: 0.99, currencyCode: 'EUR', currencySymbol: '€' },
  BEL: { code: 'BEL', priceLevelRatio: 0.88, housingFactor: 0.84, goodsFactor: 0.90, servicesFactor: 0.89, currencyCode: 'EUR', currencySymbol: '€' },
  AUT: { code: 'AUT', priceLevelRatio: 0.89, housingFactor: 0.86, goodsFactor: 0.91, servicesFactor: 0.89, currencyCode: 'EUR', currencySymbol: '€' },
  DNK: { code: 'DNK', priceLevelRatio: 1.09, housingFactor: 1.06, goodsFactor: 1.10, servicesFactor: 1.11, currencyCode: 'DKK', currencySymbol: 'kr' },
  ISR: { code: 'ISR', priceLevelRatio: 1.04, housingFactor: 1.18, goodsFactor: 1.02, servicesFactor: 0.98, currencyCode: 'ILS', currencySymbol: '₪' },
  VNM: { code: 'VNM', priceLevelRatio: 0.31, housingFactor: 0.24, goodsFactor: 0.37, servicesFactor: 0.27, currencyCode: 'VND', currencySymbol: '₫' },
  MYS: { code: 'MYS', priceLevelRatio: 0.38, housingFactor: 0.31, goodsFactor: 0.45, servicesFactor: 0.34, currencyCode: 'MYR', currencySymbol: 'RM' },
  PHL: { code: 'PHL', priceLevelRatio: 0.34, housingFactor: 0.27, goodsFactor: 0.41, servicesFactor: 0.30, currencyCode: 'PHP', currencySymbol: '₱' },
  NZL: { code: 'NZL', priceLevelRatio: 0.97, housingFactor: 1.04, goodsFactor: 0.96, servicesFactor: 0.94, currencyCode: 'NZD', currencySymbol: 'NZ$' },
  PRT: { code: 'PRT', priceLevelRatio: 0.66, housingFactor: 0.58, goodsFactor: 0.74, servicesFactor: 0.62, currencyCode: 'EUR', currencySymbol: '€' },
  GRC: { code: 'GRC', priceLevelRatio: 0.64, housingFactor: 0.52, goodsFactor: 0.73, servicesFactor: 0.60, currencyCode: 'EUR', currencySymbol: '€' },
  PER: { code: 'PER', priceLevelRatio: 0.39, housingFactor: 0.31, goodsFactor: 0.45, servicesFactor: 0.35, currencyCode: 'PEN', currencySymbol: 'S/' },
  CZE: { code: 'CZE', priceLevelRatio: 0.63, housingFactor: 0.56, goodsFactor: 0.69, servicesFactor: 0.59, currencyCode: 'CZK', currencySymbol: 'Kč' },
  FIN: { code: 'FIN', priceLevelRatio: 0.95, housingFactor: 0.91, goodsFactor: 0.97, servicesFactor: 0.96, currencyCode: 'EUR', currencySymbol: '€' },
  THA: { code: 'THA', priceLevelRatio: 0.36, housingFactor: 0.29, goodsFactor: 0.43, servicesFactor: 0.32, currencyCode: 'THB', currencySymbol: '฿' },
  BGD: { code: 'BGD', priceLevelRatio: 0.27, housingFactor: 0.19, goodsFactor: 0.34, servicesFactor: 0.23, currencyCode: 'BDT', currencySymbol: '৳' },
  PAK: { code: 'PAK', priceLevelRatio: 0.25, housingFactor: 0.17, goodsFactor: 0.32, servicesFactor: 0.21, currencyCode: 'PKR', currencySymbol: '₨' },
  KAZ: { code: 'KAZ', priceLevelRatio: 0.38, housingFactor: 0.31, goodsFactor: 0.44, servicesFactor: 0.34, currencyCode: 'KZT', currencySymbol: '₸' },
  UZB: { code: 'UZB', priceLevelRatio: 0.29, housingFactor: 0.22, goodsFactor: 0.36, servicesFactor: 0.25, currencyCode: 'UZS', currencySymbol: 'soʻm' },
  QAT: { code: 'QAT', priceLevelRatio: 0.68, housingFactor: 0.84, goodsFactor: 0.70, servicesFactor: 0.60, currencyCode: 'QAR', currencySymbol: 'QR' },
  KWT: { code: 'KWT', priceLevelRatio: 0.62, housingFactor: 0.72, goodsFactor: 0.65, servicesFactor: 0.55, currencyCode: 'KWD', currencySymbol: 'KD' },
  OMN: { code: 'OMN', priceLevelRatio: 0.52, housingFactor: 0.45, goodsFactor: 0.58, servicesFactor: 0.49, currencyCode: 'OMR', currencySymbol: 'OMR' },
  UKR: { code: 'UKR', priceLevelRatio: 0.33, housingFactor: 0.25, goodsFactor: 0.40, servicesFactor: 0.29, currencyCode: 'UAH', currencySymbol: '₴' },
  ROU: { code: 'ROU', priceLevelRatio: 0.51, housingFactor: 0.41, goodsFactor: 0.59, servicesFactor: 0.47, currencyCode: 'RON', currencySymbol: 'lei' },
  HUN: { code: 'HUN', priceLevelRatio: 0.55, housingFactor: 0.46, goodsFactor: 0.63, servicesFactor: 0.51, currencyCode: 'HUF', currencySymbol: 'Ft' },
  LUX: { code: 'LUX', priceLevelRatio: 1.12, housingFactor: 1.38, goodsFactor: 1.04, servicesFactor: 1.08, currencyCode: 'EUR', currencySymbol: '€' },
  SVK: { code: 'SVK', priceLevelRatio: 0.64, housingFactor: 0.54, goodsFactor: 0.71, servicesFactor: 0.60, currencyCode: 'EUR', currencySymbol: '€' },
  BGR: { code: 'BGR', priceLevelRatio: 0.49, housingFactor: 0.38, goodsFactor: 0.58, servicesFactor: 0.44, currencyCode: 'EUR', currencySymbol: '€' },
  HRV: { code: 'HRV', priceLevelRatio: 0.60, housingFactor: 0.50, goodsFactor: 0.68, servicesFactor: 0.56, currencyCode: 'EUR', currencySymbol: '€' },
  MAR: { code: 'MAR', priceLevelRatio: 0.36, housingFactor: 0.28, goodsFactor: 0.43, servicesFactor: 0.32, currencyCode: 'MAD', currencySymbol: 'DH' },
  DZA: { code: 'DZA', priceLevelRatio: 0.31, housingFactor: 0.23, goodsFactor: 0.38, servicesFactor: 0.27, currencyCode: 'DZD', currencySymbol: 'DA' },
  KEN: { code: 'KEN', priceLevelRatio: 0.30, housingFactor: 0.23, goodsFactor: 0.37, servicesFactor: 0.26, currencyCode: 'KES', currencySymbol: 'KSh' },
  ETH: { code: 'ETH', priceLevelRatio: 0.26, housingFactor: 0.18, goodsFactor: 0.33, servicesFactor: 0.22, currencyCode: 'ETB', currencySymbol: 'Br' },
  GHA: { code: 'GHA', priceLevelRatio: 0.28, housingFactor: 0.20, goodsFactor: 0.35, servicesFactor: 0.24, currencyCode: 'GHS', currencySymbol: 'GH₵' },
  URY: { code: 'URY', priceLevelRatio: 0.64, housingFactor: 0.54, goodsFactor: 0.72, servicesFactor: 0.60, currencyCode: 'UYU', currencySymbol: '$U' },
  ECU: { code: 'ECU', priceLevelRatio: 0.44, housingFactor: 0.35, goodsFactor: 0.51, servicesFactor: 0.40, currencyCode: 'USD', currencySymbol: '$' },
  CRI: { code: 'CRI', priceLevelRatio: 0.56, housingFactor: 0.45, goodsFactor: 0.64, servicesFactor: 0.52, currencyCode: 'CRC', currencySymbol: '₡' },
  PAN: { code: 'PAN', priceLevelRatio: 0.52, housingFactor: 0.44, goodsFactor: 0.58, servicesFactor: 0.48, currencyCode: 'USD', currencySymbol: '$' },
  DOM: { code: 'DOM', priceLevelRatio: 0.43, housingFactor: 0.34, goodsFactor: 0.50, servicesFactor: 0.39, currencyCode: 'DOP', currencySymbol: 'RD$' },
};

export interface PppConversionResult {
  amount: number;
  fromCountryCode: string;
  toCountryCode: string;
  equivalentAmount: number;
  purchasingMultiplier: number;
  costOfLivingRatio: number;
  costDifferencePercent: number;
  baskets: {
    housingMultiplier: number;
    goodsMultiplier: number;
    servicesMultiplier: number;
  };
  summary: string;
}

export function calculatePppConversion(
  amount: number,
  fromCountryCode: string,
  toCountryCode: string
): PppConversionResult {
  const safeAmount = Math.max(0, amount);
  const fromMetric = COUNTRY_PPP_METRICS[fromCountryCode] || COUNTRY_PPP_METRICS.USA;
  const toMetric = COUNTRY_PPP_METRICS[toCountryCode] || COUNTRY_PPP_METRICS.USA;

  /*
   * The purchasing multiplier is inversely proportional to the price level ratio:
   * lower local price levels amplify the real purchasing power of each nominal dollar.
   */
  const purchasingMultiplier = Number((fromMetric.priceLevelRatio / toMetric.priceLevelRatio).toFixed(2));
  const equivalentAmount = Math.round(safeAmount * purchasingMultiplier);
  const costOfLivingRatio = Number((toMetric.priceLevelRatio / fromMetric.priceLevelRatio).toFixed(2));
  const costDifferencePercent = Number(((costOfLivingRatio - 1) * 100).toFixed(1));

  const housingMultiplier = Number((fromMetric.housingFactor / toMetric.housingFactor).toFixed(2));
  const goodsMultiplier = Number((fromMetric.goodsFactor / toMetric.goodsFactor).toFixed(2));
  const servicesMultiplier = Number((fromMetric.servicesFactor / toMetric.servicesFactor).toFixed(2));

  let summary = '';
  if (fromCountryCode === toCountryCode) {
    summary = 'Baseline domestic purchasing parity (1.00x).';
  } else if (costDifferencePercent < 0) {
    const savings = Math.abs(costDifferencePercent);
    summary = `Consumer prices are ${savings}% lower. Your capital stretches ${purchasingMultiplier}x further, commanding the equivalent of a $${equivalentAmount.toLocaleString('en-US')} local lifestyle.`;
  } else {
    summary = `Consumer prices are ${costDifferencePercent}% higher. Maintaining an equivalent standard of living requires approximately ${costOfLivingRatio}x your current capital allocation.`;
  }

  return {
    amount: safeAmount,
    fromCountryCode,
    toCountryCode,
    equivalentAmount,
    purchasingMultiplier,
    costOfLivingRatio,
    costDifferencePercent,
    baskets: {
      housingMultiplier,
      goodsMultiplier,
      servicesMultiplier,
    },
    summary,
  };
}

