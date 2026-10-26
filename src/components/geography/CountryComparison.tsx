'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import { getLaborMetricsForCountry } from '../../data/labor-market-data';
import { CountryProfile, CountryYearMetric, CurrencyPerspective } from '../../lib/types';
import { calculateCountryWealthDistribution } from '../../lib/calculations';
import { formatCurrency, formatPercent, adjustValue } from '../../lib/formatters';
import {
  ArrowLeftRight,
  Scale,
  Landmark,
  Layers,
  Sparkles,
  CheckCircle2,
  Share2,
  Check,
  Users,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { DataExportMenu } from '../common/DataExportMenu';

export type DuelLens =
  | 'all'
  | 'wealth'
  | 'growth-monetary'
  | 'fiscal-external'
  | 'labor-demographics';

export const VALID_DUEL_LENSES: DuelLens[] = [
  'all',
  'wealth',
  'growth-monetary',
  'fiscal-external',
  'labor-demographics',
];

interface CountryComparisonProps {
  selectedYear: number;
  currencyPerspective: CurrencyPerspective;
  initialCountryCodeA?: string;
  initialCountryCodeB?: string;
  onCountriesChange?: (codeA: string, codeB: string) => void;
  activeLens?: DuelLens;
  onLensChange?: (lens: DuelLens) => void;
}

interface DuelPreset {
  id: string;
  name: string;
  subtitle: string;
  codeA: string;
  codeB: string;
}

const DUEL_PRESETS: DuelPreset[] = [
  {
    id: 'us-cn',
    name: 'US vs. China',
    subtitle: 'The Global Hegemons',
    codeA: 'USA',
    codeB: 'CHN',
  },
  {
    id: 'de-jp',
    name: 'Germany vs. Japan',
    subtitle: 'Industrial Export Powerhouses',
    codeA: 'DEU',
    codeB: 'JPN',
  },
  {
    id: 'au-us',
    name: 'Australia vs. US',
    subtitle: 'High Median vs. Apex Wealth',
    codeA: 'AUS',
    codeB: 'USA',
  },
  {
    id: 'in-br',
    name: 'India vs. Brazil',
    subtitle: 'Emerging Continental Giants',
    codeA: 'IND',
    codeB: 'BRA',
  },
  {
    id: 'ch-no',
    name: 'Switzerland vs. Norway',
    subtitle: 'Private Banking vs. Sovereign Wealth',
    codeA: 'CHE',
    codeB: 'NOR',
  },
  {
    id: 'gb-fr',
    name: 'UK vs. France',
    subtitle: 'Financial Hub vs. State-Led Capital',
    codeA: 'GBR',
    codeB: 'FRA',
  },
];

const DUEL_LENS_OPTIONS: Array<{ id: DuelLens; label: string }> = [
  { id: 'all', label: 'All Macro Pillars (22)' },
  { id: 'wealth', label: '01 / Wealth & Distribution' },
  { id: 'growth-monetary', label: '02 / Growth, Inflation & Rates' },
  { id: 'fiscal-external', label: '03 / Debt, Fiscal & External' },
  { id: 'labor-demographics', label: '04 / Labor, Sahm & Demographics' },
];

export function CountryComparison({
  selectedYear,
  currencyPerspective,
  initialCountryCodeA = 'USA',
  initialCountryCodeB = 'CHN',
  onCountriesChange,
  activeLens: controlledLens,
  onLensChange,
}: CountryComparisonProps) {
  const [countryCodeA, setCountryCodeA] = useState<string>(initialCountryCodeA);
  const [countryCodeB, setCountryCodeB] = useState<string>(initialCountryCodeB);
  const [internalLens, setInternalLens] = useState<DuelLens>('all');
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const activeLens = controlledLens ?? internalLens;

  useEffect(() => {
    if (initialCountryCodeA) {
      setCountryCodeA(initialCountryCodeA);
    }
  }, [initialCountryCodeA]);

  useEffect(() => {
    if (initialCountryCodeB) {
      setCountryCodeB(initialCountryCodeB);
    }
  }, [initialCountryCodeB]);

  const updateCountries = (nextA: string, nextB: string) => {
    setCountryCodeA(nextA);
    setCountryCodeB(nextB);
    onCountriesChange?.(nextA, nextB);
  };

  const handleSetLens = (nextLens: DuelLens) => {
    setInternalLens(nextLens);
    onLensChange?.(nextLens);
  };

  const handleCopyDeepLink = async () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('a', countryCodeA);
    url.searchParams.set('b', countryCodeB);
    url.searchParams.set('lens', activeLens);
    url.searchParams.set('year', String(selectedYear));
    url.searchParams.set('currency', currencyPerspective);

    /*
     * On mobile touch devices, invoke the native OS share sheet for immediate sharing
     * without having to paste into a messaging application.
     */
    if (typeof navigator !== 'undefined' && navigator.share && window.innerWidth < 640) {
      try {
        await navigator.share({
          title: `Macro Duel: ${countryA.name} vs. ${countryB.name}`,
          text: `Compare macroeconomic balance sheets between ${countryA.name} and ${countryB.name} on MacroMonitor:`,
          url: url.toString(),
        });
        setHasCopiedLink(true);
        setTimeout(() => setHasCopiedLink(false), 2200);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    navigator.clipboard.writeText(url.toString()).then(() => {
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2200);
    });
  };

  const countryMap = useMemo(() => {
    const map = new Map<string, CountryProfile>();
    for (const c of COUNTRIES_DATA) {
      map.set(c.code, c);
    }
    return map;
  }, []);

  const countryA = countryMap.get(countryCodeA) || COUNTRIES_DATA[0];
  const countryB = countryMap.get(countryCodeB) || COUNTRIES_DATA[1];

  /*
   * Fallback to closest available data year if a historic year has not yet been modeled.
   */
  const metricsA: CountryYearMetric =
    countryA.history[selectedYear] || countryA.history[2026] || countryA.history[2025];
  const metricsB: CountryYearMetric =
    countryB.history[selectedYear] || countryB.history[2026] || countryB.history[2025];

  const handleSwap = () => {
    updateCountries(countryB.code, countryA.code);
  };

  const handleApplyPreset = (preset: DuelPreset) => {
    updateCountries(preset.codeA, preset.codeB);
  };

  /*
   * Normalize monetary amounts according to user perspective (nominal USD, real 2026 inflation-adjusted, or PPP).
   */
  const adjMeanWealthA = adjustValue(metricsA.wealthPerAdultUSD, selectedYear, currencyPerspective);
  const adjMeanWealthB = adjustValue(metricsB.wealthPerAdultUSD, selectedYear, currencyPerspective);

  const adjMedianWealthA = adjustValue(metricsA.medianWealthUSD, selectedYear, currencyPerspective);
  const adjMedianWealthB = adjustValue(metricsB.medianWealthUSD, selectedYear, currencyPerspective);

  const adjTotalWealthA =
    adjustValue(metricsA.totalWealthTrillion, selectedYear, currencyPerspective) * 1_000_000_000_000;
  const adjTotalWealthB =
    adjustValue(metricsB.totalWealthTrillion, selectedYear, currencyPerspective) * 1_000_000_000_000;

  const adjGdpA =
    adjustValue(metricsA.gdpTrillionUSD, selectedYear, currencyPerspective) * 1_000_000_000_000;
  const adjGdpB =
    adjustValue(metricsB.gdpTrillionUSD, selectedYear, currencyPerspective) * 1_000_000_000_000;

  const adjGdpPerCapA = adjustValue(metricsA.gdpPerCapitaUSD, selectedYear, currencyPerspective);
  const adjGdpPerCapB = adjustValue(metricsB.gdpPerCapitaUSD, selectedYear, currencyPerspective);

  /*
   * The Mean-to-Median Skew ratio quantifies the degree to which national wealth is pulled up
   * by ultra-wealthy outliers versus widely shared across ordinary citizens.
   */
  const skewA = metricsA.medianWealthUSD > 0 ? metricsA.wealthPerAdultUSD / metricsA.medianWealthUSD : 1;
  const skewB = metricsB.medianWealthUSD > 0 ? metricsB.wealthPerAdultUSD / metricsB.medianWealthUSD : 1;

  const wealthDistA = useMemo(
    () => calculateCountryWealthDistribution(countryA, selectedYear),
    [countryA, selectedYear]
  );
  const wealthDistB = useMemo(
    () => calculateCountryWealthDistribution(countryB, selectedYear),
    [countryB, selectedYear]
  );
  const [pyramidDuelMode, setPyramidDuelMode] = useState<'population' | 'wealth'>('population');

  /*
   * Real Policy Rate (r - pi) measures whether the central bank is actively restricting credit (>0%)
   * or running financial repression (<0%).
   */
  const realPolicyRateA = Number((metricsA.policyRate - metricsA.inflationRate).toFixed(2));
  const realPolicyRateB = Number((metricsB.policyRate - metricsB.inflationRate).toFixed(2));

  /*
   * Twin Deficit Balance = Fiscal Balance (% GDP) + Current Account Balance (% GDP).
   */
  const twinBalanceA = Number(
    (metricsA.fiscalBalancePercentGdp + metricsA.currentAccountPercentGdp).toFixed(1)
  );
  const twinBalanceB = Number(
    (metricsB.fiscalBalancePercentGdp + metricsB.currentAccountPercentGdp).toFixed(1)
  );

  /*
   * Resolve high-frequency labor dynamics (U-3, LFPR, Sahm Rule, wage growth) for both sovereigns.
   */
  const laborA = useMemo(
    () => metricsA.labor || getLaborMetricsForCountry(countryA.code, selectedYear),
    [metricsA, countryA.code, selectedYear]
  );
  const laborB = useMemo(
    () => metricsB.labor || getLaborMetricsForCountry(countryB.code, selectedYear),
    [metricsB, countryB.code, selectedYear]
  );

  /*
   * Derive contextual insights automatically so users understand the root causes of divergent living standards and macro regimes.
   */
  const narrative = useMemo(() => {
    const higherMedian = adjMedianWealthA >= adjMedianWealthB ? countryA : countryB;
    const lowerMedian = adjMedianWealthA >= adjMedianWealthB ? countryB : countryA;
    const medianMultiple = (
      Math.max(adjMedianWealthA, adjMedianWealthB) /
      Math.max(1, Math.min(adjMedianWealthA, adjMedianWealthB))
    ).toFixed(1);

    const moreEqual = metricsA.gini <= metricsB.gini ? countryA : countryB;
    const moreUnequal = metricsA.gini <= metricsB.gini ? countryB : countryA;

    const fasterGrowth = metricsA.realGdpGrowth >= metricsB.realGdpGrowth ? countryA : countryB;
    const slowerGrowth = metricsA.realGdpGrowth >= metricsB.realGdpGrowth ? countryB : countryA;
    const highGrowthVal = Math.max(metricsA.realGdpGrowth, metricsB.realGdpGrowth);
    const lowGrowthVal = Math.min(metricsA.realGdpGrowth, metricsB.realGdpGrowth);

    const strongerExternal =
      metricsA.currentAccountPercentGdp >= metricsB.currentAccountPercentGdp ? countryA : countryB;
    const weakerExternal =
      metricsA.currentAccountPercentGdp >= metricsB.currentAccountPercentGdp ? countryB : countryA;
    const highCaVal = Math.max(metricsA.currentAccountPercentGdp, metricsB.currentAccountPercentGdp);
    const lowCaVal = Math.min(metricsA.currentAccountPercentGdp, metricsB.currentAccountPercentGdp);

    let laborSummary = 'Labor dynamics for both sovereigns are currently in line with historical baseline levels.';
    if (laborA && laborB) {
      const lowerUnemp = laborA.unemploymentRate <= laborB.unemploymentRate ? countryA : countryB;
      const lowerRate = Math.min(laborA.unemploymentRate, laborB.unemploymentRate);
      const higherRate = Math.max(laborA.unemploymentRate, laborB.unemploymentRate);
      const sahmRisk =
        laborA.sahmStatus === 'triggered' || laborB.sahmStatus === 'triggered'
          ? 'Sahm Rule recession threshold (≥ 0.50%) has triggered, signaling macroeconomic contraction.'
          : laborA.sahmStatus === 'elevated' || laborB.sahmStatus === 'elevated'
          ? 'Claudia Sahm indicator is elevated (≥ 0.30%), warranting pre-recession vigilance.'
          : 'Both sovereigns exhibit tranquil Sahm Rule indicators (< 0.30%) with expanding employment.';

      laborSummary = `${lowerUnemp.name} enjoys lower headline unemployment (${formatPercent(lowerRate)} vs. ${formatPercent(higherRate)}). ${sahmRisk}`;
    }

    return {
      medianComparison: `${higherMedian.name}'s median citizen owns ${medianMultiple}x more net wealth than ${lowerMedian.name}'s typical adult (${formatCurrency(Math.max(adjMedianWealthA, adjMedianWealthB), { compact: true })} vs. ${formatCurrency(Math.min(adjMedianWealthA, adjMedianWealthB), { compact: true })}), while ${moreEqual.name} has a flatter Gini (${Math.min(metricsA.gini, metricsB.gini).toFixed(2)} vs. ${moreUnequal.name}'s ${Math.max(metricsA.gini, metricsB.gini).toFixed(2)}).`,
      growthMonetary: `${fasterGrowth.name} expands faster in real terms (${highGrowthVal > 0 ? '+' : ''}${highGrowthVal.toFixed(1)}% vs. ${slowerGrowth.name}'s ${lowGrowthVal > 0 ? '+' : ''}${lowGrowthVal.toFixed(1)}% YoY), with central bank policy rates at ${formatPercent(metricsA.policyRate)} (${countryA.code}) and ${formatPercent(metricsB.policyRate)} (${countryB.code}).`,
      externalFiscal: `${strongerExternal.name} posts a stronger external current account (${highCaVal > 0 ? '+' : ''}${highCaVal.toFixed(1)}% vs. ${weakerExternal.name}'s ${lowCaVal > 0 ? '+' : ''}${lowCaVal.toFixed(1)}% of GDP), backed by $${metricsA.fxReservesBillionUSD}B (${countryA.code}) vs. $${metricsB.fxReservesBillionUSD}B (${countryB.code}) in FX & gold reserves.`,
      laborSummary,
    };
  }, [adjMedianWealthA, adjMedianWealthB, countryA, countryB, metricsA, metricsB, laborA, laborB]);

  const showWealth = activeLens === 'all' || activeLens === 'wealth';
  const showGrowthMonetary = activeLens === 'all' || activeLens === 'growth-monetary';
  const showFiscalExternal = activeLens === 'all' || activeLens === 'fiscal-external';
  const showLaborDemographics = activeLens === 'all' || activeLens === 'labor-demographics';

  return (
    <section id="country-comparison" className="space-y-6">
      {/* Header card with presets */}
      <div className="apple-card p-5 sm:p-6 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 mb-2">
              <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">
                Head-to-Head Macro Comparison
              </span>
            </div>
            <h2 className="font-editorial text-xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Sovereign Balance Sheet Duel ({selectedYear})
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-normal leading-relaxed">
              Compare two sovereign nations side-by-side across household wealth, real GDP growth, monetary policy rates, fiscal &amp; external balances, demographics, and Claudia Sahm labor dynamics.
            </p>
          </div>

          {/* Quick Duel Presets & Share Link */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Curated Comparisons:
              </span>
              <button
                type="button"
                onClick={handleCopyDeepLink}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border shadow-sm cursor-pointer active:scale-95 ${
                  hasCopiedLink
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-slate-800 dark:text-white border-slate-200 dark:border-white/[0.15]'
                }`}
                title="Copy shareable link to this sovereign duel"
                aria-label="Copy shareable link"
              >
                {hasCopiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-sky-400" />
                    <span>Share Duel</span>
                  </>
                )}
              </button>

              {/* One-click Data Export for Researchers & Journalists */}
              <DataExportMenu
                title={`Sovereign Duel: ${countryA.name} vs ${countryB.name} (${selectedYear})`}
                filename={`sovereign-duel-${countryA.code.toLowerCase()}-vs-${countryB.code.toLowerCase()}-${selectedYear}`}
                data={() => [
                  {
                    code: countryA.code,
                    name: countryA.name,
                    region: countryA.region,
                    populationMillion: metricsA.populationMillion,
                    meanWealthPerAdultUsd: Math.round(adjMeanWealthA),
                    medianWealthPerAdultUsd: Math.round(adjMedianWealthA),
                    totalWealthTrillionUsd: Number((adjTotalWealthA / 1_000_000_000_000).toFixed(2)),
                    gdpTrillionUsd: Number((adjGdpA / 1_000_000_000_000).toFixed(2)),
                    gdpPerCapitaUsd: Math.round(adjGdpPerCapA),
                    realGdpGrowthPercent: metricsA.realGdpGrowth,
                    inflationRatePercent: metricsA.inflationRate,
                    policyRatePercent: metricsA.policyRate,
                    bondYield10YPercent: metricsA.bondYield10Y,
                    debtToGdpPercent: metricsA.debtToGdp,
                    fiscalBalancePercentGdp: metricsA.fiscalBalancePercentGdp,
                    currentAccountPercentGdp: metricsA.currentAccountPercentGdp,
                    fxReservesBillionUsd: metricsA.fxReservesBillionUSD,
                    giniCoefficient: metricsA.gini,
                    oldAgeDependencyPercent: metricsA.oldAgeDependencyRatio,
                    financialAssetSharePercent: metricsA.assetMix.financialShare,
                    nonFinancialAssetSharePercent: metricsA.assetMix.nonFinancialShare,
                    unemploymentRatePercent: laborA?.unemploymentRate ?? '',
                    sahmIndicatorPercent: laborA?.sahmIndicatorValue ?? '',
                  },
                  {
                    code: countryB.code,
                    name: countryB.name,
                    region: countryB.region,
                    populationMillion: metricsB.populationMillion,
                    meanWealthPerAdultUsd: Math.round(adjMeanWealthB),
                    medianWealthPerAdultUsd: Math.round(adjMedianWealthB),
                    totalWealthTrillionUsd: Number((adjTotalWealthB / 1_000_000_000_000).toFixed(2)),
                    gdpTrillionUsd: Number((adjGdpB / 1_000_000_000_000).toFixed(2)),
                    gdpPerCapitaUsd: Math.round(adjGdpPerCapB),
                    realGdpGrowthPercent: metricsB.realGdpGrowth,
                    inflationRatePercent: metricsB.inflationRate,
                    policyRatePercent: metricsB.policyRate,
                    bondYield10YPercent: metricsB.bondYield10Y,
                    debtToGdpPercent: metricsB.debtToGdp,
                    fiscalBalancePercentGdp: metricsB.fiscalBalancePercentGdp,
                    currentAccountPercentGdp: metricsB.currentAccountPercentGdp,
                    fxReservesBillionUsd: metricsB.fxReservesBillionUSD,
                    giniCoefficient: metricsB.gini,
                    oldAgeDependencyPercent: metricsB.oldAgeDependencyRatio,
                    financialAssetSharePercent: metricsB.assetMix.financialShare,
                    nonFinancialAssetSharePercent: metricsB.assetMix.nonFinancialShare,
                    unemploymentRatePercent: laborB?.unemploymentRate ?? '',
                    sahmIndicatorPercent: laborB?.sahmIndicatorValue ?? '',
                  },
                ]}
                columns={[
                  { key: 'code', label: 'Country Code' },
                  { key: 'name', label: 'Country' },
                  { key: 'region', label: 'Region' },
                  { key: 'populationMillion', label: 'Population (M)' },
                  { key: 'meanWealthPerAdultUsd', label: `Mean Wealth per Adult ($ ${currencyPerspective.toUpperCase()})` },
                  { key: 'medianWealthPerAdultUsd', label: `Median Wealth per Adult ($ ${currencyPerspective.toUpperCase()})` },
                  { key: 'totalWealthTrillionUsd', label: `Total Private Wealth ($T ${currencyPerspective.toUpperCase()})` },
                  { key: 'gdpTrillionUsd', label: `GDP ($T ${currencyPerspective.toUpperCase()})` },
                  { key: 'gdpPerCapitaUsd', label: `GDP per Capita ($ ${currencyPerspective.toUpperCase()})` },
                  { key: 'realGdpGrowthPercent', label: 'Real GDP Growth (%)' },
                  { key: 'inflationRatePercent', label: 'CPI Inflation (%)' },
                  { key: 'policyRatePercent', label: 'Central Bank Policy Rate (%)' },
                  { key: 'bondYield10YPercent', label: '10Y Sovereign Yield (%)' },
                  { key: 'debtToGdpPercent', label: 'Debt-to-GDP (%)' },
                  { key: 'fiscalBalancePercentGdp', label: 'Fiscal Balance (% GDP)' },
                  { key: 'currentAccountPercentGdp', label: 'Current Account (% GDP)' },
                  { key: 'fxReservesBillionUsd', label: 'FX & Gold Reserves ($B)' },
                  { key: 'giniCoefficient', label: 'Gini Coefficient (0–1)' },
                  { key: 'oldAgeDependencyPercent', label: 'Old-Age Dependency (%)' },
                  { key: 'financialAssetSharePercent', label: 'Financial Assets Share (%)' },
                  { key: 'nonFinancialAssetSharePercent', label: 'Real Estate & Physical Assets Share (%)' },
                  { key: 'unemploymentRatePercent', label: 'Unemployment Rate (%)' },
                  { key: 'sahmIndicatorPercent', label: 'Sahm Rule Metric (%)' },
                ]}
                metadata={{
                  description: `Head-to-head macroeconomic balance sheet comparison between ${countryA.name} and ${countryB.name}.`,
                  source: 'UBS Global Wealth Databook, IMF WEO, World Bank, BIS, FRED',
                  year: selectedYear,
                  perspective: `${currencyPerspective.toUpperCase()} USD`,
                }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DUEL_PRESETS.map((p) => {
                const isActive =
                  (countryCodeA === p.codeA && countryCodeB === p.codeB) ||
                  (countryCodeA === p.codeB && countryCodeB === p.codeA);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-md font-semibold'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-white/[0.05] dark:text-slate-300 dark:border-white/[0.08] dark:hover:bg-white/[0.12] dark:hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Country Selectors & Duel Arena Bar */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center pt-6">
          {/* Country A Picker */}
          <div className="md:col-span-5 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/[0.08] via-white/[0.03] to-transparent p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Country A
              </span>
              <span className="text-xs font-mono-tabular text-slate-500 dark:text-slate-300">
                {countryA.region} • {metricsA.populationMillion}M Pop.
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">{countryA.flag}</span>
              <div className="flex-1">
                <select
                  aria-label="Select Country A"
                  value={countryCodeA}
                  onChange={(e) => updateCountries(e.target.value, countryCodeB)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-3.5 py-2.5 text-base sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                >
                  {COUNTRIES_DATA.map((c) => (
                    <option key={`a-${c.code}`} value={c.code} disabled={c.code === countryCodeB}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Swap Button (VS) */}
          <div className="md:col-span-1 flex justify-center py-1">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap countries"
              aria-label="Swap countries"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 dark:border-white/[0.15] bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.18] hover:text-slate-900 dark:hover:text-white hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* Country B Picker */}
          <div className="md:col-span-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] via-white/[0.03] to-transparent p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Country B
              </span>
              <span className="text-xs font-mono-tabular text-slate-500 dark:text-slate-300">
                {countryB.region} • {metricsB.populationMillion}M Pop.
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">{countryB.flag}</span>
              <div className="flex-1">
                <select
                  aria-label="Select Country B"
                  value={countryCodeB}
                  onChange={(e) => updateCountries(countryCodeA, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-3.5 py-2.5 text-base sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
                >
                  {COUNTRIES_DATA.map((c) => (
                    <option key={`b-${c.code}`} value={c.code} disabled={c.code === countryCodeA}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Clickable Macro Pillar Lens Filter Bar (URL-Synced) */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Analytical Lens:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DUEL_LENS_OPTIONS.map((opt) => {
              const isSelected = activeLens === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSetLens(opt.id)}
                  className={`tactile-button rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                      : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/[0.08]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PILLAR 01: Household Wealth, Distribution & Balance Sheet */}
      {showWealth && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              01 / Household Wealth &amp; Inequality Distribution
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Benchmark: Global Median Adult Wealth ~$9,100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricBattleCard
              title="Median Wealth per Adult"
              description="Net worth of the exact middle (50th percentile) adult citizen"
              benchmark="Middle-class prosperity anchor"
              valA={formatCurrency(adjMedianWealthA, { compact: true })}
              valB={formatCurrency(adjMedianWealthB, { compact: true })}
              rawA={adjMedianWealthA}
              rawB={adjMedianWealthB}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Wealth per Adult (Mean)"
              description="Total private household wealth divided by adult population"
              benchmark="Pulled upward by top 1% asset holders"
              valA={formatCurrency(adjMeanWealthA, { compact: true })}
              valB={formatCurrency(adjMeanWealthB, { compact: true })}
              rawA={adjMeanWealthA}
              rawB={adjMeanWealthB}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Total National Wealth"
              description="Aggregate private household balance sheet"
              benchmark="Total household net worth stock"
              valA={formatCurrency(adjTotalWealthA, { compact: true })}
              valB={formatCurrency(adjTotalWealthB, { compact: true })}
              rawA={adjTotalWealthA}
              rawB={adjTotalWealthB}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Inequality Skew (Mean/Median)"
              description="Ratio of average wealth to middle-citizen wealth"
              benchmark="<2.0x broad middle class | >3.5x oligarchic skew"
              valA={`${skewA.toFixed(1)}x`}
              valB={`${skewB.toFixed(1)}x`}
              rawA={skewA}
              rawB={skewB}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />

            <MetricBattleCard
              title="Wealth Gini Index"
              description="0 = perfect equality, 1 = total concentration at the apex"
              benchmark="<0.65 egalitarian | >0.80 extreme concentration"
              valA={metricsA.gini.toFixed(2)}
              valB={metricsB.gini.toFixed(2)}
              rawA={metricsA.gini}
              rawB={metricsB.gini}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />
          </div>

          {/* Household Asset Allocation Comparison */}
          <div className="apple-card p-5 sm:p-6 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
                  01B / Household Asset Mix
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Household Balance Sheet &amp; Asset Allocation Duel
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-normal">
                  How households construct their net worth: Financial market claims (equities, bonds, pensions) vs. Tangible physical real estate vs. Debt encumbrance.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  <span>Financial Assets</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Real Estate</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>Household Debt</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.10] bg-slate-100/70 dark:bg-white/[0.035] p-4 sm:p-5">
                <div className="flex items-center justify-between text-sm mb-2.5 font-semibold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <span>{countryA.flag}</span>
                    <span>{countryA.name} Asset Composition</span>
                  </span>
                  <span className="text-xs font-mono-tabular text-slate-500 dark:text-slate-300 font-medium">
                    Debt Burden: {formatPercent(metricsA.assetMix.debtShareOfGross)} of gross assets
                  </span>
                </div>

                <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden flex shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                    style={{ width: `${metricsA.assetMix.financialShare}%` }}
                    title={`Financial: ${metricsA.assetMix.financialShare}%`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${metricsA.assetMix.nonFinancialShare}%` }}
                    title={`Non-Financial: ${metricsA.assetMix.nonFinancialShare}%`}
                  />
                </div>

                <div className="flex justify-between text-xs mt-2.5 font-mono-tabular font-medium">
                  <span className="text-sky-600 dark:text-sky-300">
                    Financial Assets: {formatPercent(metricsA.assetMix.financialShare)}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-300">
                    Tangible Property: {formatPercent(metricsA.assetMix.nonFinancialShare)}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.10] bg-slate-100/70 dark:bg-white/[0.035] p-4 sm:p-5">
                <div className="flex items-center justify-between text-sm mb-2.5 font-semibold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <span>{countryB.flag}</span>
                    <span>{countryB.name} Asset Composition</span>
                  </span>
                  <span className="text-xs font-mono-tabular text-slate-500 dark:text-slate-300 font-medium">
                    Debt Burden: {formatPercent(metricsB.assetMix.debtShareOfGross)} of gross assets
                  </span>
                </div>

                <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden flex shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                    style={{ width: `${metricsB.assetMix.financialShare}%` }}
                    title={`Financial: ${metricsB.assetMix.financialShare}%`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${metricsB.assetMix.nonFinancialShare}%` }}
                    title={`Non-Financial: ${metricsB.assetMix.nonFinancialShare}%`}
                  />
                </div>

                <div className="flex justify-between text-xs mt-2.5 font-mono-tabular font-medium">
                  <span className="text-sky-600 dark:text-sky-300">
                    Financial Assets: {formatPercent(metricsB.assetMix.financialShare)}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-300">
                    Tangible Property: {formatPercent(metricsB.assetMix.nonFinancialShare)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 01C / Sovereign Wealth Distribution & 6-Tier Pyramid Duel */}
          <div className="apple-card p-5 sm:p-6 transition-all duration-300 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
              <div>
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                  01C / Private Wealth Distribution &amp; Pyramid Duel ({selectedYear})
                </span>
                <h3 className="font-editorial text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Who Holds the Wealth in {countryA.name} vs. {countryB.name}?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-normal">
                  Comparing internal wealth concentration across decile cohorts (Top 1%, Next 9%, Middle 40%, Bottom 50%) and the 6-tier net-worth pyramid.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPyramidDuelMode('population')}
                    className={`tactile-button rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${
                      pyramidDuelMode === 'population'
                        ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
                    }`}
                  >
                    % of Adults by Bracket
                  </button>
                  <button
                    type="button"
                    onClick={() => setPyramidDuelMode('wealth')}
                    className={`tactile-button rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${
                      pyramidDuelMode === 'wealth'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-700 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
                    }`}
                  >
                    % of National Wealth
                  </button>
                </div>
              </div>
            </div>

            {/* Decile Concentration Stacked Bars (Top 1% / Next 9% / Middle 40% / Bottom 50%) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { country: countryA, dist: wealthDistA, accent: 'sky' },
                { country: countryB, dist: wealthDistB, accent: 'emerald' },
              ].map(({ country, dist }) => {
                const next9 = Number(Math.max(0, dist.shares.top10Percent - dist.shares.top1Percent).toFixed(1));
                return (
                  <div
                    key={country.code}
                    className="rounded-2xl border border-slate-200/80 dark:border-white/[0.10] bg-slate-100/70 dark:bg-white/[0.035] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.name} Decile Shares</span>
                      </span>
                      <Link
                        href={`/wealth?scope=${country.code}&year=${selectedYear}`}
                        className="inline-flex items-center gap-1 font-mono-tabular text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                      >
                        <span>Full Pyramid</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <div className="h-3.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden flex">
                      <div
                        className="h-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${dist.shares.top1Percent}%` }}
                        title={`Top 1%: ${dist.shares.top1Percent}%`}
                      />
                      <div
                        className="h-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${next9}%` }}
                        title={`Next 9% (90th-99th): ${next9}%`}
                      />
                      <div
                        className="h-full bg-sky-500 transition-all duration-500"
                        style={{ width: `${dist.shares.middle40Percent}%` }}
                        title={`Middle 40%: ${dist.shares.middle40Percent}%`}
                      />
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${dist.shares.bottom50Percent}%` }}
                        title={`Bottom 50%: ${dist.shares.bottom50Percent}%`}
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono-tabular pt-1">
                      <div>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <span className="h-2 w-2 rounded-full bg-rose-500" /> Top 1%
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                          {dist.shares.top1Percent.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <span className="h-2 w-2 rounded-full bg-amber-500" /> Next 9%
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                          {next9.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <span className="h-2 w-2 rounded-full bg-sky-500" /> Mid 40%
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                          {dist.shares.middle40Percent.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Bot 50%
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                          {dist.shares.bottom50Percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 6-Tier Head-to-Head Butterfly Pyramid */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono-tabular font-semibold text-slate-500 dark:text-slate-400 px-2">
                <span className="text-sky-600 dark:text-sky-400">
                  {countryA.flag} {countryA.name} ({pyramidDuelMode === 'population' ? '% of Adults' : '% of Wealth'})
                </span>
                <span>Net Worth Bracket</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {countryB.flag} {countryB.name} ({pyramidDuelMode === 'population' ? '% of Adults' : '% of Wealth'})
                </span>
              </div>

              {[...wealthDistA.tiers].reverse().map((tierA) => {
                const tierB =
                  wealthDistB.tiers.find((t) => t.bracket === tierA.bracket) || tierA;
                const valA = pyramidDuelMode === 'population' ? tierA.adultsShare : tierA.wealthShare;
                const valB = pyramidDuelMode === 'population' ? tierB.adultsShare : tierB.wealthShare;

                return (
                  <div
                    key={tierA.bracket}
                    className="grid grid-cols-12 items-center gap-2 sm:gap-3 rounded-xl border border-slate-200/70 dark:border-white/[0.07] bg-slate-50/60 dark:bg-white/[0.025] px-3 py-2"
                  >
                    {/* Country A Left Bar */}
                    <div className="col-span-4 sm:col-span-5 flex items-center justify-end gap-2">
                      <span className="font-mono-tabular text-xs font-bold text-slate-900 dark:text-white shrink-0">
                        {valA < 0.01 ? '<0.01%' : `${valA.toFixed(1)}%`}
                      </span>
                      <div className="w-full max-w-[180px] h-2.5 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden flex justify-end">
                        <div
                          className="h-full rounded-full bg-gradient-to-l from-sky-500 to-sky-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(1.5, valA))}%` }}
                        />
                      </div>
                    </div>

                    {/* Center Bracket Label */}
                    <div className="col-span-4 sm:col-span-2 text-center">
                      <span className="font-mono-tabular text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/[0.12] inline-block">
                        {tierA.bracket}
                      </span>
                    </div>

                    {/* Country B Right Bar */}
                    <div className="col-span-4 sm:col-span-5 flex items-center justify-start gap-2">
                      <div className="w-full max-w-[180px] h-2.5 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden flex justify-start">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(1.5, valB))}%` }}
                        />
                      </div>
                      <span className="font-mono-tabular text-xs font-bold text-slate-900 dark:text-white shrink-0">
                        {valB < 0.01 ? '<0.01%' : `${valB.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 02: Economic Output, Real Growth & Monetary Stance */}
      {showGrowthMonetary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              02 / Output, Real Growth &amp; Central Bank Monetary Stance
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Benchmark: 2.0% inflation target • Real rate (r − π) &gt; 0% = restrictive
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricBattleCard
              title="Real GDP Growth Rate (YoY)"
              description="Annual inflation-adjusted economic output expansion"
              benchmark=">3.0% rapid expansion | <0% recession"
              valA={`${metricsA.realGdpGrowth > 0 ? '+' : ''}${metricsA.realGdpGrowth.toFixed(1)}%`}
              valB={`${metricsB.realGdpGrowth > 0 ? '+' : ''}${metricsB.realGdpGrowth.toFixed(1)}%`}
              rawA={metricsA.realGdpGrowth}
              rawB={metricsB.realGdpGrowth}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="GDP per Capita"
              description="Annual economic output generated per resident"
              benchmark=">$45k advanced industrial | ~$13.5k world mean"
              valA={formatCurrency(adjGdpPerCapA, { compact: true })}
              valB={formatCurrency(adjGdpPerCapB, { compact: true })}
              rawA={adjGdpPerCapA}
              rawB={adjGdpPerCapB}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Annual Gross GDP"
              description="Total sovereign annual economic output"
              benchmark="Aggregate geopolitical & market scale"
              valA={formatCurrency(adjGdpA, { compact: true })}
              valB={formatCurrency(adjGdpB, { compact: true })}
              rawA={adjGdpA}
              rawB={adjGdpB}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Annual Inflation Rate"
              description="Consumer price index annual purchasing power erosion"
              benchmark="Target: ~2.0% | >5.0% unanchored price pressure"
              valA={formatPercent(metricsA.inflationRate)}
              valB={formatPercent(metricsB.inflationRate)}
              rawA={metricsA.inflationRate}
              rawB={metricsB.inflationRate}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />

            <MetricBattleCard
              title="Central Bank Policy Rate"
              description="Benchmark overnight monetary policy interest rate"
              benchmark={`Real rate (r - π): ${countryA.code} ${realPolicyRateA > 0 ? '+' : ''}${realPolicyRateA}% vs ${countryB.code} ${realPolicyRateB > 0 ? '+' : ''}${realPolicyRateB}%`}
              valA={formatPercent(metricsA.policyRate)}
              valB={formatPercent(metricsB.policyRate)}
              rawA={metricsA.policyRate}
              rawB={metricsB.policyRate}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />

            <MetricBattleCard
              title="10-Year Sovereign Bond Yield"
              description="Long-term government borrowing cost & risk-free anchor"
              benchmark="Lower yield reduces sovereign debt rollover cost"
              valA={formatPercent(metricsA.bondYield10Y)}
              valB={formatPercent(metricsB.bondYield10Y)}
              rawA={metricsA.bondYield10Y}
              rawB={metricsB.bondYield10Y}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />
          </div>
        </div>
      )}

      {/* PILLAR 03: Sovereign Debt, Fiscal Flow & External Sector */}
      {showFiscalExternal && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              03 / Sovereign Solvency, Fiscal Deficits &amp; External Balance
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Benchmark: Maastricht 60% Debt / -3% Deficit • Current Account &gt; 0% = Net Creditor
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricBattleCard
              title="Debt-to-GDP Ratio"
              description="General government gross public debt relative to GDP"
              benchmark="<60% prudent | >100% fiscal dominance zone"
              valA={formatPercent(metricsA.debtToGdp)}
              valB={formatPercent(metricsB.debtToGdp)}
              rawA={metricsA.debtToGdp}
              rawB={metricsB.debtToGdp}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />

            <MetricBattleCard
              title="Fiscal Balance (% of GDP)"
              description="Annual government budget surplus (+) or deficit (-)"
              benchmark="> -3.0% stable | < -5.0% structural deficit spiral"
              valA={`${metricsA.fiscalBalancePercentGdp > 0 ? '+' : ''}${metricsA.fiscalBalancePercentGdp.toFixed(1)}%`}
              valB={`${metricsB.fiscalBalancePercentGdp > 0 ? '+' : ''}${metricsB.fiscalBalancePercentGdp.toFixed(1)}%`}
              rawA={metricsA.fiscalBalancePercentGdp}
              rawB={metricsB.fiscalBalancePercentGdp}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Current Account (% of GDP)"
              description="Net trade in goods, services & cross-border investment income"
              benchmark={`Twin balance: ${countryA.code} ${twinBalanceA > 0 ? '+' : ''}${twinBalanceA}% vs ${countryB.code} ${twinBalanceB > 0 ? '+' : ''}${twinBalanceB}%`}
              valA={`${metricsA.currentAccountPercentGdp > 0 ? '+' : ''}${metricsA.currentAccountPercentGdp.toFixed(1)}%`}
              valB={`${metricsB.currentAccountPercentGdp > 0 ? '+' : ''}${metricsB.currentAccountPercentGdp.toFixed(1)}%`}
              rawA={metricsA.currentAccountPercentGdp}
              rawB={metricsB.currentAccountPercentGdp}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="FX & Gold Reserves"
              description="Official central bank foreign currency & bullion war-chest"
              benchmark="Shields currency against speculative capital flight"
              valA={`$${metricsA.fxReservesBillionUSD.toFixed(0)}B`}
              valB={`$${metricsB.fxReservesBillionUSD.toFixed(0)}B`}
              rawA={metricsA.fxReservesBillionUSD}
              rawB={metricsB.fxReservesBillionUSD}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />
          </div>
        </div>
      )}

      {/* PILLAR 04: Labor Market Dynamics, Claudia Sahm Rule & Demographics */}
      {showLaborDemographics && (
        <div className="apple-card p-5 sm:p-6 transition-all duration-300 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                04 / Labor Market, Claudia Sahm Rule &amp; Demographic Structure
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Labor Market Health &amp; Claudia Sahm Recession Duel
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-normal">
                Comparing headline unemployment (U-3), labor force participation (LFPR), Sahm Rule recession momentum, wage/productivity growth, and old-age dependency pressure across all 46 economies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricBattleCard
              title="Unemployment Rate (U-3)"
              description="Headline civilian unemployment percentage"
              benchmark="<4.5% full employment | >7.5% structural slack"
              valA={laborA ? formatPercent(laborA.unemploymentRate) : 'N/A'}
              valB={laborB ? formatPercent(laborB.unemploymentRate) : 'N/A'}
              rawA={laborA?.unemploymentRate ?? 99}
              rawB={laborB?.unemploymentRate ?? 99}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />

            <MetricBattleCard
              title="Labor Force Participation (LFPR)"
              description="Active workforce share of working-age population"
              benchmark=">75% high mobilization | <60% demographic drag"
              valA={laborA?.laborForceParticipation ? formatPercent(laborA.laborForceParticipation) : 'N/A'}
              valB={laborB?.laborForceParticipation ? formatPercent(laborB.laborForceParticipation) : 'N/A'}
              rawA={laborA?.laborForceParticipation ?? 0}
              rawB={laborB?.laborForceParticipation ?? 0}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Claudia Sahm Recession Delta"
              description="3M average unemployment rise vs. 12M low"
              benchmark="<0.30% tranquil | ≥0.50% recession triggered"
              valA={laborA?.sahmIndicatorValue !== undefined ? `+${laborA.sahmIndicatorValue.toFixed(2)}%` : 'N/A'}
              valB={laborB?.sahmIndicatorValue !== undefined ? `+${laborB.sahmIndicatorValue.toFixed(2)}%` : 'N/A'}
              rawA={laborA?.sahmIndicatorValue ?? 99}
              rawB={laborB?.sahmIndicatorValue ?? 99}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />

            <MetricBattleCard
              title="Labor Tightness (V/U Ratio)"
              description="Unfilled job vacancies per unemployed worker"
              benchmark=">1.0x tight labor | <0.6x employer market"
              valA={laborA?.jobOpeningsPerUnemployed !== undefined ? `${laborA.jobOpeningsPerUnemployed.toFixed(2)}x` : 'N/A'}
              valB={laborB?.jobOpeningsPerUnemployed !== undefined ? `${laborB.jobOpeningsPerUnemployed.toFixed(2)}x` : 'N/A'}
              rawA={laborA?.jobOpeningsPerUnemployed ?? 0}
              rawB={laborB?.jobOpeningsPerUnemployed ?? 0}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Annual Wage Growth (YoY)"
              description="Nominal hourly/monthly earnings annual growth"
              benchmark="Compare against CPI for real wage gains"
              valA={laborA?.wageGrowthYoy !== undefined ? formatPercent(laborA.wageGrowthYoy) : 'N/A'}
              valB={laborB?.wageGrowthYoy !== undefined ? formatPercent(laborB.wageGrowthYoy) : 'N/A'}
              rawA={laborA?.wageGrowthYoy ?? 0}
              rawB={laborB?.wageGrowthYoy ?? 0}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Labor Productivity Growth (YoY)"
              description="Real economic output gained per worker-hour"
              benchmark=">2.0% strong efficiency | <0.5% stagnation"
              valA={laborA?.productivityGrowthYoy !== undefined ? formatPercent(laborA.productivityGrowthYoy) : 'N/A'}
              valB={laborB?.productivityGrowthYoy !== undefined ? formatPercent(laborB.productivityGrowthYoy) : 'N/A'}
              rawA={laborA?.productivityGrowthYoy ?? 0}
              rawB={laborB?.productivityGrowthYoy ?? 0}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />

            <MetricBattleCard
              title="Old-Age Dependency Ratio"
              description="Retirees (aged 65+) per 100 working-age (15–64) adults"
              benchmark="<15% demographic dividend | >35% severe pension strain"
              valA={formatPercent(metricsA.oldAgeDependencyRatio)}
              valB={formatPercent(metricsB.oldAgeDependencyRatio)}
              rawA={metricsA.oldAgeDependencyRatio}
              rawB={metricsB.oldAgeDependencyRatio}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={false}
            />

            <MetricBattleCard
              title="Total Population Scale"
              description="Total national resident population"
              benchmark="Domestic consumer market & labor pool scale"
              valA={`${metricsA.populationMillion.toFixed(1)}M`}
              valB={`${metricsB.populationMillion.toFixed(1)}M`}
              rawA={metricsA.populationMillion}
              rawB={metricsB.populationMillion}
              flagA={countryA.flag}
              flagB={countryB.flag}
              isHigherBetter={true}
            />
          </div>
        </div>
      )}

      {/* Automated Macro Narrative Synthesis */}
      <div className="apple-card p-5 sm:p-6 shadow-2xl border-slate-200/80 dark:border-white/[0.12] bg-gradient-to-br from-white/80 via-white/50 to-sky-500/[0.05] dark:from-white/[0.05] dark:via-white/[0.02] dark:to-sky-500/[0.04]">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            05 / Automated Synthesis
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Comparative Economic Synthesis: {countryA.name} vs. {countryB.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs sm:text-sm leading-relaxed">
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.035] p-4">
            <div className="font-semibold text-sky-700 dark:text-sky-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Middle-Class Living Standards
            </div>
            <p className="font-normal text-slate-700 dark:text-slate-300">{narrative.medianComparison}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.035] p-4">
            <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Growth &amp; Monetary Stance
            </div>
            <p className="font-normal text-slate-700 dark:text-slate-300">{narrative.growthMonetary}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.035] p-4">
            <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> External &amp; FX Reserves
            </div>
            <p className="font-normal text-slate-700 dark:text-slate-300">{narrative.externalFiscal}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.035] p-4">
            <div className="font-semibold text-rose-700 dark:text-rose-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Labor Market &amp; Sahm Signal
            </div>
            <p className="font-normal text-slate-700 dark:text-slate-300">{narrative.laborSummary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricBattleCardProps {
  title: string;
  description: string;
  benchmark?: string;
  valA: string;
  valB: string;
  rawA: number;
  rawB: number;
  flagA: string;
  flagB: string;
  isHigherBetter: boolean;
}

function MetricBattleCard({
  title,
  description,
  benchmark,
  valA,
  valB,
  rawA,
  rawB,
  flagA,
  flagB,
  isHigherBetter,
}: MetricBattleCardProps) {
  const hasValidComparison = valA !== 'N/A' && valB !== 'N/A';
  const isBetterA = hasValidComparison && (isHigherBetter ? rawA > rawB : rawA < rawB);
  const isBetterB = hasValidComparison && (isHigherBetter ? rawB > rawA : rawB < rawA);

  /*
   * Visual differential proportion (0 to 100).
   * Handles both strictly positive values and signed values (e.g. Current Account or Fiscal Deficit %)
   * by shifting negative ranges above zero before computing relative bar share.
   */
  let percentA = 50;
  if (hasValidComparison) {
    const minFloor = Math.min(rawA, rawB, 0);
    const shift = minFloor < 0 ? Math.abs(minFloor) + 1 : 0;
    const posA = Math.max(0.01, rawA + shift);
    const posB = Math.max(0.01, rawB + shift);
    const total = posA + posB;
    percentA = total > 0 ? Math.min(92, Math.max(8, Math.round((posA / total) * 100))) : 50;
  }
  const percentB = 100 - percentA;

  return (
    <div className="apple-card apple-card-hover p-4.5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h4>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight mb-1.5 font-normal">
          {description}
        </p>
        {benchmark && (
          <p className="font-mono-tabular text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.06] rounded-md px-2 py-0.5 mb-2.5 truncate">
            {benchmark}
          </p>
        )}
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono-tabular mb-2.5">
          <div
            className={`rounded-xl p-2.5 text-left border transition-colors ${
              isBetterA
                ? 'bg-sky-500/15 border-sky-400/50 dark:border-sky-400/40 shadow-sm'
                : 'bg-slate-100/70 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/[0.08]'
            }`}
          >
            <div className="text-[10px] font-sans font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>{flagA}</span>
              {isBetterA && <span className="text-sky-600 dark:text-sky-300 font-semibold">▲ Lead</span>}
            </div>
            <span
              className={`text-xs sm:text-sm font-bold block mt-0.5 ${
                isBetterA ? 'text-sky-950 dark:text-sky-100' : 'text-slate-900 dark:text-slate-200'
              }`}
            >
              {valA}
            </span>
          </div>

          <div
            className={`rounded-xl p-2.5 text-right border transition-colors ${
              isBetterB
                ? 'bg-emerald-500/15 border-emerald-400/50 dark:border-emerald-400/40 shadow-sm'
                : 'bg-slate-100/70 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/[0.08]'
            }`}
          >
            <div className="text-[10px] font-sans font-medium text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
              {isBetterB && <span className="text-emerald-600 dark:text-emerald-300 font-semibold">Lead ▲</span>}
              <span>{flagB}</span>
            </div>
            <span
              className={`text-xs sm:text-sm font-bold block mt-0.5 ${
                isBetterB ? 'text-emerald-950 dark:text-emerald-100' : 'text-slate-900 dark:text-slate-200'
              }`}
            >
              {valB}
            </span>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden flex shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
            style={{ width: `${percentA}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${percentB}%` }}
          />
        </div>
      </div>
    </div>
  );
}
