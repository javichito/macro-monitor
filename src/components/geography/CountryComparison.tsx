'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import { CountryProfile, CountryYearMetric, CurrencyPerspective } from '../../lib/types';
import { formatCurrency, formatPercent, adjustValue } from '../../lib/formatters';
import {
  ArrowLeftRight,
  TrendingUp,
  Scale,
  Building2,
  DollarSign,
  Landmark,
  Layers,
  Sparkles,
  ShieldCheck,
  Percent,
  CheckCircle2,
} from 'lucide-react';

interface CountryComparisonProps {
  selectedYear: number;
  currencyPerspective: CurrencyPerspective;
  initialCountryCodeA?: string;
  initialCountryCodeB?: string;
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

export function CountryComparison({
  selectedYear,
  currencyPerspective,
  initialCountryCodeA = 'USA',
  initialCountryCodeB = 'CHN',
}: CountryComparisonProps) {
  const [countryCodeA, setCountryCodeA] = useState<string>(initialCountryCodeA);
  const [countryCodeB, setCountryCodeB] = useState<string>(initialCountryCodeB);

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
    setCountryCodeA(countryB.code);
    setCountryCodeB(countryA.code);
  };

  const handleApplyPreset = (preset: DuelPreset) => {
    setCountryCodeA(preset.codeA);
    setCountryCodeB(preset.codeB);
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

  const adjGdpPerCapA = adjustValue(metricsA.gdpPerCapitaUSD, selectedYear, currencyPerspective);
  const adjGdpPerCapB = adjustValue(metricsB.gdpPerCapitaUSD, selectedYear, currencyPerspective);

  /*
   * The Mean-to-Median Skew ratio quantifies the degree to which national wealth is pulled up
   * by ultra-wealthy outliers versus widely shared across ordinary citizens.
   */
  const skewA = metricsA.medianWealthUSD > 0 ? metricsA.wealthPerAdultUSD / metricsA.medianWealthUSD : 1;
  const skewB = metricsB.medianWealthUSD > 0 ? metricsB.wealthPerAdultUSD / metricsB.medianWealthUSD : 1;

  /*
   * Derive contextual insights automatically so users understand the root causes of divergent living standards.
   */
  const narrative = useMemo(() => {
    const higherMedian = adjMedianWealthA >= adjMedianWealthB ? countryA : countryB;
    const lowerMedian = adjMedianWealthA >= adjMedianWealthB ? countryB : countryA;
    const medianMultiple = (
      Math.max(adjMedianWealthA, adjMedianWealthB) /
      Math.max(1, Math.min(adjMedianWealthA, adjMedianWealthB))
    ).toFixed(1);

    const higherMean = adjMeanWealthA >= adjMeanWealthB ? countryA : countryB;
    const lowerMean = adjMeanWealthA >= adjMeanWealthB ? countryB : countryA;

    const moreEqual = metricsA.gini <= metricsB.gini ? countryA : countryB;
    const moreUnequal = metricsA.gini <= metricsB.gini ? countryB : countryA;

    const moreFinancialized =
      metricsA.assetMix.financialShare >= metricsB.assetMix.financialShare ? countryA : countryB;
    const morePropertyCentric =
      metricsA.assetMix.nonFinancialShare >= metricsB.assetMix.nonFinancialShare ? countryA : countryB;

    return {
      medianComparison: `${higherMedian.name}'s median citizen owns ${medianMultiple}x more net wealth than ${lowerMedian.name}'s typical adult (${formatCurrency(Math.max(adjMedianWealthA, adjMedianWealthB), { compact: true })} vs. ${formatCurrency(Math.min(adjMedianWealthA, adjMedianWealthB), { compact: true })}).`,
      inequalityComparison: `${moreEqual.name} exhibits a flatter wealth distribution (Gini ${metricsA.gini <= metricsB.gini ? metricsA.gini.toFixed(2) : metricsB.gini.toFixed(2)} vs. ${metricsA.gini <= metricsB.gini ? metricsB.gini.toFixed(2) : metricsA.gini.toFixed(2)}), whereas ${moreUnequal.name} exhibits stronger capital concentration at the apex.`,
      assetStructure: `${moreFinancialized.name} households lean heavily toward financial assets (${Math.round(Math.max(metricsA.assetMix.financialShare, metricsB.assetMix.financialShare))}% of gross wealth in stocks, bonds & pensions), while ${morePropertyCentric.name} wealth is predominantly anchored in physical real estate & land (${Math.round(Math.max(metricsA.assetMix.nonFinancialShare, metricsB.assetMix.nonFinancialShare))}%).`,
    };
  }, [adjMeanWealthA, adjMeanWealthB, adjMedianWealthA, adjMedianWealthB, countryA, countryB, metricsA, metricsB]);

  return (
    <section id="country-comparison" className="space-y-6">
      {/* Header card with presets */}
      <div className="apple-card p-5 sm:p-6 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300 mb-2 shadow-inner">
              <Scale className="h-3.5 w-3.5" />
              <span>Head-to-Head Macro Comparison</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Sovereign Balance Sheet Duel ({selectedYear})
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal leading-relaxed">
              Compare two sovereign nations side-by-side across wealth per adult, median distribution, debt solvency, and household asset allocations.
            </p>
          </div>

          {/* Quick Duel Presets */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Curated Comparisons:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DUEL_PRESETS.map((p) => {
                const isActive =
                  (countryCodeA === p.codeA && countryCodeB === p.codeB) ||
                  (countryCodeA === p.codeB && countryCodeB === p.codeA);

                return (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white text-black border-white shadow-md font-semibold'
                        : 'bg-white/[0.05] text-slate-300 border-white/[0.08] hover:bg-white/[0.12] hover:text-white'
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                Country A
              </span>
              <span className="text-xs font-mono text-slate-300">{countryA.region}</span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">{countryA.flag}</span>
              <div className="flex-1">
                <select
                  value={countryCodeA}
                  onChange={(e) => setCountryCodeA(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.12] bg-[#0c1017] px-3.5 py-2.5 text-sm font-semibold text-white focus:border-sky-400 focus:outline-none cursor-pointer"
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
              onClick={handleSwap}
              title="Swap countries"
              aria-label="Swap countries"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.08] text-slate-200 hover:bg-white/[0.18] hover:text-white hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* Country B Picker */}
          <div className="md:col-span-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] via-white/[0.03] to-transparent p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Country B
              </span>
              <span className="text-xs font-mono text-slate-300">{countryB.region}</span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">{countryB.flag}</span>
              <div className="flex-1">
                <select
                  value={countryCodeB}
                  onChange={(e) => setCountryCodeB(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.12] bg-[#0c1017] px-3.5 py-2.5 text-sm font-semibold text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
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
      </div>

      {/* Tale of the Tape: Side-by-Side Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricBattleCard
          title="Wealth per Adult (Mean)"
          description="Total private wealth divided by adult population"
          valA={formatCurrency(adjMeanWealthA, { compact: true })}
          valB={formatCurrency(adjMeanWealthB, { compact: true })}
          rawA={adjMeanWealthA}
          rawB={adjMeanWealthB}
          flagA={countryA.flag}
          flagB={countryB.flag}
          isHigherBetter={true}
        />

        <MetricBattleCard
          title="Median Wealth per Adult"
          description="Net worth of the exact middle (50th percentile) adult"
          valA={formatCurrency(adjMedianWealthA, { compact: true })}
          valB={formatCurrency(adjMedianWealthB, { compact: true })}
          rawA={adjMedianWealthA}
          rawB={adjMedianWealthB}
          flagA={countryA.flag}
          flagB={countryB.flag}
          isHigherBetter={true}
        />

        <MetricBattleCard
          title="Inequality Skew (Mean/Median)"
          description="High skew indicates wealth pulled up by extreme apex billionaires"
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
          description="0 = perfectly equal, 1 = complete concentration"
          valA={metricsA.gini.toFixed(2)}
          valB={metricsB.gini.toFixed(2)}
          rawA={metricsA.gini}
          rawB={metricsB.gini}
          flagA={countryA.flag}
          flagB={countryB.flag}
          isHigherBetter={false}
        />

        <MetricBattleCard
          title="Total National Wealth"
          description="Aggregate private household balance sheet"
          valA={formatCurrency(adjTotalWealthA, { compact: true })}
          valB={formatCurrency(adjTotalWealthB, { compact: true })}
          rawA={adjTotalWealthA}
          rawB={adjTotalWealthB}
          flagA={countryA.flag}
          flagB={countryB.flag}
          isHigherBetter={true}
        />

        <MetricBattleCard
          title="GDP per Capita"
          description="Annual economic production per resident"
          valA={formatCurrency(adjGdpPerCapA, { compact: true })}
          valB={formatCurrency(adjGdpPerCapB, { compact: true })}
          rawA={adjGdpPerCapA}
          rawB={adjGdpPerCapB}
          flagA={countryA.flag}
          flagB={countryB.flag}
          isHigherBetter={true}
        />

        <MetricBattleCard
          title="Debt-to-GDP Ratio"
          description="General sovereign government debt relative to economic size"
          valA={formatPercent(metricsA.debtToGdp)}
          valB={formatPercent(metricsB.debtToGdp)}
          rawA={metricsA.debtToGdp}
          rawB={metricsB.debtToGdp}
          flagA={countryA.flag}
          flagB={countryB.flag}
          isHigherBetter={false}
        />

        <MetricBattleCard
          title="Annual Inflation Rate"
          description="Consumer price index annual change"
          valA={formatPercent(metricsA.inflationRate)}
          valB={formatPercent(metricsB.inflationRate)}
          rawA={metricsA.inflationRate}
          rawB={metricsB.inflationRate}
          flagA={countryA.flag}
          flagB={countryB.flag}
          isHigherBetter={false}
        />
      </div>

      {/* Household Asset Allocation Comparison */}
      <div className="apple-card p-5 sm:p-6 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/25">
                <Layers className="h-4 w-4" />
              </div>
              Household Balance Sheet &amp; Asset Allocation Duel
            </h3>
            <p className="text-xs text-slate-300 mt-1 font-normal">
              How households construct their net worth: Financial market claims vs. Tangible physical real estate vs. Debt encumbrance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span>Financial Assets</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Real Estate</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span>Household Debt</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.10] bg-white/[0.035] p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm mb-2.5 font-semibold text-white">
              <span className="flex items-center gap-2">
                <span>{countryA.flag}</span>
                <span>{countryA.name} Asset Composition</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Debt Burden: {formatPercent(metricsA.assetMix.debtShareOfGross)} of gross assets
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-white/[0.08] overflow-hidden flex shadow-inner">
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

            <div className="flex justify-between text-xs text-slate-300 mt-2.5 font-medium">
              <span className="text-sky-300">
                Financial Assets: {formatPercent(metricsA.assetMix.financialShare)}
              </span>
              <span className="text-emerald-300">
                Tangible Property: {formatPercent(metricsA.assetMix.nonFinancialShare)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.10] bg-white/[0.035] p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm mb-2.5 font-semibold text-white">
              <span className="flex items-center gap-2">
                <span>{countryB.flag}</span>
                <span>{countryB.name} Asset Composition</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Debt Burden: {formatPercent(metricsB.assetMix.debtShareOfGross)} of gross assets
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-white/[0.08] overflow-hidden flex shadow-inner">
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

            <div className="flex justify-between text-xs text-slate-300 mt-2.5 font-medium">
              <span className="text-sky-300">
                Financial Assets: {formatPercent(metricsB.assetMix.financialShare)}
              </span>
              <span className="text-emerald-300">
                Tangible Property: {formatPercent(metricsB.assetMix.nonFinancialShare)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Macro Narrative Synthesis */}
      <div className="apple-card p-5 sm:p-6 shadow-2xl border-white/[0.12] bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-sky-500/[0.04]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/25 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Comparative Economic Synthesis: {countryA.name} vs. {countryB.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <div className="font-semibold text-sky-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Middle-Class Living Standards
            </div>
            <p className="font-normal text-slate-300">{narrative.medianComparison}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <div className="font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Distribution &amp; Concentration
            </div>
            <p className="font-normal text-slate-300">{narrative.inequalityComparison}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <div className="font-semibold text-emerald-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Balance Sheet Composition
            </div>
            <p className="font-normal text-slate-300">{narrative.assetStructure}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricBattleCardProps {
  title: string;
  description: string;
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
  valA,
  valB,
  rawA,
  rawB,
  flagA,
  flagB,
  isHigherBetter,
}: MetricBattleCardProps) {
  const isBetterA = isHigherBetter ? rawA > rawB : rawA < rawB;
  const isBetterB = isHigherBetter ? rawB > rawA : rawB < rawA;
  const isTie = rawA === rawB;

  /*
   * Visual differential proportion (0 to 100).
   * Calculates normalized ratio to display on the comparative duel meter.
   */
  const total = rawA + rawB;
  const percentA = total > 0 ? Math.round((rawA / total) * 100) : 50;
  const percentB = 100 - percentA;

  return (
    <div className="apple-card apple-card-hover p-4.5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">{title}</h4>
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight mb-3 font-normal">
          {description}
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono mb-2.5">
          <div
            className={`rounded-xl p-2.5 text-left border transition-colors ${
              isBetterA
                ? 'bg-sky-500/15 border-sky-400/40 text-sky-200 font-bold shadow-sm'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-300'
            }`}
          >
            <div className="text-[10px] font-sans font-medium text-slate-400 flex items-center gap-1">
              <span>{flagA}</span>
              {isBetterA && <span className="text-sky-300 font-semibold">▲ Lead</span>}
            </div>
            <span className="text-xs sm:text-sm font-semibold">{valA}</span>
          </div>

          <div
            className={`rounded-xl p-2.5 text-right border transition-colors ${
              isBetterB
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200 font-bold shadow-sm'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-300'
            }`}
          >
            <div className="text-[10px] font-sans font-medium text-slate-400 flex items-center justify-end gap-1">
              {isBetterB && <span className="text-emerald-300 font-semibold">Lead ▲</span>}
              <span>{flagB}</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold">{valB}</span>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden flex shadow-inner">
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
