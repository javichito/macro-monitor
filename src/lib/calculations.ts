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
