'use client';

import React, { useState } from 'react';
import { GlobalWealthYear, CurrencyPerspective, SovereignWealthDistribution } from '../../lib/types';
import { formatCurrency, formatPercent, formatNumber, adjustValue } from '../../lib/formatters';
import { toGlobalWealthDistribution } from '../../lib/calculations';
import { DataExportMenu } from '../common/DataExportMenu';
import { Users, DollarSign, Layers, Globe2, Eye, EyeOff, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface WealthPyramidProps {
  data: GlobalWealthYear | SovereignWealthDistribution;
  globalBaseline?: GlobalWealthYear;
  currencyPerspective: CurrencyPerspective;
}

export function WealthPyramid({ data, globalBaseline, currencyPerspective }: WealthPyramidProps) {
  const [activeBracket, setActiveBracket] = useState<string | null>(null);
  const [showGlobalGhost, setShowGlobalGhost] = useState<boolean>(true);

  const dist: SovereignWealthDistribution =
    'scopeCode' in data ? data : toGlobalWealthDistribution(data);

  const isCountryScope = dist.scopeCode !== 'GLOBAL';

  /*
   * Tiers are reversed so the highest net worth bracket sits at the top of the pyramid
   * mimicking traditional wealth pyramid infographics.
   */
  const displayTiers = [...dist.tiers].reverse();

  const adjustedTotalWealth = adjustValue(dist.totalWealthTrillion, dist.year, currencyPerspective);
  const adjustedMeanWealth = adjustValue(dist.meanWealthPerAdult, dist.year, currencyPerspective);
  const adjustedMedianWealth = adjustValue(dist.medianWealthPerAdult, dist.year, currencyPerspective);

  return (
    <div className="apple-card p-5 sm:p-6 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-2 font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>01 / WEALTH PYRAMID ARCHITECTURE</span>
            <span>•</span>
            <span>
              {isCountryScope
                ? `${dist.flag} ${dist.scopeName} Wealth Pyramid (${dist.year})`
                : `Global Wealth Pyramid (${dist.year})`}
            </span>
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>
              {isCountryScope
                ? `How Is Private Wealth Stacked Inside ${dist.scopeName}?`
                : `How Is Global Private Wealth Stacked Across Humanity?`}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-normal">
            {isCountryScope
              ? `Comparing ${dist.scopeName}'s adult population distribution across 6 net-worth brackets against the share of national wealth held.`
              : `Comparing the share of world adult population against the share of world private wealth held across 6 brackets.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs self-start lg:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400"></span>
            <span>% of {isCountryScope ? `${dist.scopeCode} ` : ''}Adults</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            <span>% of {isCountryScope ? `${dist.scopeCode} ` : 'Total '}Wealth</span>
          </div>

          {isCountryScope && globalBaseline && (
            <button
              type="button"
              onClick={() => setShowGlobalGhost((prev) => !prev)}
              aria-pressed={showGlobalGhost}
              className={`tactile-button inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                showGlobalGhost
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35'
                  : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              {showGlobalGhost ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>vs. Global Benchmark</span>
            </button>
          )}

          {/* One-click Data Export for Researchers & Journalists */}
          <DataExportMenu
            title={`${dist.scopeName} Wealth Pyramid (${dist.year})`}
            filename={`wealth-pyramid-${dist.scopeCode.toLowerCase()}-${dist.year}`}
            data={() =>
              dist.tiers.map((t) => ({
                scope: dist.scopeName,
                bracket: t.bracket,
                adultsMillion: t.adultsMillion,
                adultsSharePercent: Number(t.adultsShare.toFixed(2)),
                wealthTrillion: adjustValue(t.wealthTrillion, dist.year, currencyPerspective),
                wealthSharePercent: Number(t.wealthShare.toFixed(2)),
                averageWealthPerAdult:
                  t.adultsMillion > 0
                    ? Math.round(
                        (adjustValue(t.wealthTrillion, dist.year, currencyPerspective) * 1_000_000_000_000) /
                          (t.adultsMillion * 1_000_000)
                      )
                    : 0,
              }))
            }
            columns={[
              { key: 'scope', label: 'Geography Scope' },
              { key: 'bracket', label: 'Wealth Bracket Tier' },
              { key: 'adultsMillion', label: 'Adults (Millions)' },
              { key: 'adultsSharePercent', label: 'Share of Adult Population (%)' },
              { key: 'wealthTrillion', label: `Aggregate Wealth ($T ${currencyPerspective.toUpperCase()})` },
              { key: 'wealthSharePercent', label: 'Share of Total Wealth (%)' },
              { key: 'averageWealthPerAdult', label: 'Average Wealth per Adult ($)' },
            ]}
            metadata={{
              description: `Distribution of private net worth across wealth tiers in ${dist.scopeName} (${dist.year}).`,
              source: 'UBS Global Wealth Databook, Credit Suisse, WID.world',
              perspective: `${currencyPerspective.toUpperCase()} USD`,
              year: dist.year,
              scope: dist.scopeName,
              totalWealthTrillion: adjustedTotalWealth,
            }}
          />
        </div>
      </div>

      {/* Contextual Summary Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            01 / Total Net Wealth
          </span>
          <span className="font-mono-tabular text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            {formatCurrency(adjustedTotalWealth * 1_000_000_000_000, { compact: true })}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            {dist.adultsMillion >= 1000
              ? `${(dist.adultsMillion / 1000).toFixed(2)}B adults`
              : `${formatNumber(dist.adultsMillion, 1)}M adults`}
          </span>
        </div>

        <div>
          <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            02 / Median vs. Mean
          </span>
          <span className="font-mono-tabular text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
            {formatCurrency(adjustedMedianWealth, { compact: true })}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              {' '}/ {formatCurrency(adjustedMeanWealth, { compact: true })}
            </span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Skew: {(dist.meanWealthPerAdult / Math.max(1, dist.medianWealthPerAdult)).toFixed(1)}x mean-to-median
          </span>
        </div>

        <div>
          <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            03 / Middle-Class Core
          </span>
          <span className="font-mono-tabular text-base sm:text-lg font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">
            {formatPercent(dist.middleClassDensityPercent, 1)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Adults in $100k–$1M tier
          </span>
        </div>

        <div>
          <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            04 / Millionaire Density
          </span>
          <span className="font-mono-tabular text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
            {formatPercent(dist.millionaireDensityPercent, 2)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Adults &gt; $1M • Gini {dist.giniCoefficient.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        {displayTiers.map((tier) => {
          const isSelected = activeBracket === tier.bracket;
          const adjustedWealthTrillion = adjustValue(tier.wealthTrillion, dist.year, currencyPerspective);
          const globalTier = globalBaseline?.tiers.find((gt) => gt.bracket === tier.bracket);

          const popDeltaVsGlobal =
            isCountryScope && globalTier ? Number((tier.adultsShare - globalTier.adultsShare).toFixed(1)) : null;

          return (
            <button
              key={tier.bracket}
              type="button"
              aria-expanded={isSelected}
              onClick={() => setActiveBracket((curr) => (curr === tier.bracket ? null : tier.bracket))}
              onMouseEnter={() => setActiveBracket(tier.bracket)}
              onMouseLeave={() => setActiveBracket(null)}
              className={`w-full text-left rounded-2xl border p-4 sm:p-4.5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-slate-300 dark:border-white/25 bg-slate-100/90 dark:bg-white/[0.08] shadow-lg dark:shadow-xl shadow-slate-200/50 dark:shadow-black/40 ring-1 ring-slate-300 dark:ring-white/15'
                  : 'border-slate-200/80 dark:border-white/[0.08] bg-slate-50/60 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/[0.15] hover:bg-slate-100/70 dark:hover:bg-white/[0.055]'
              }`}
            >
              <div className="flex items-center justify-between text-sm mb-2 flex-wrap gap-2">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-mono-tabular text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      tier.bracket === '> $100M'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-400/40 shadow-sm'
                        : tier.bracket === '$10M - $100M'
                        ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-500/20 dark:text-purple-200 dark:border-purple-400/40 shadow-sm'
                        : tier.bracket === '$1M - $10M'
                        ? 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-400/40 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/[0.08] dark:text-slate-200 dark:border-white/[0.12]'
                    }`}
                  >
                    {tier.bracket}
                  </span>
                  {tier.bracket === '> $100M' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/30">
                      Apex
                    </span>
                  )}
                  {tier.bracket === '$10M - $100M' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 dark:border-purple-400/30">
                      VHNW
                    </span>
                  )}
                  {tier.bracket === '$1M - $10M' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 dark:border-sky-400/30">
                      HNW
                    </span>
                  )}
                  <span className="font-mono-tabular text-xs text-slate-500 dark:text-slate-300 hidden sm:inline font-medium">
                    ({tier.adultsMillion < 1
                      ? `${formatNumber(Math.round(tier.adultsMillion * 1_000_000))} adults`
                      : `${formatNumber(tier.adultsMillion, tier.adultsMillion < 10 ? 2 : 1)}M adults`})
                  </span>
                </span>
                <span className="font-mono-tabular text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}
                </span>
              </div>

              {/* Comparative Dual Bar Chart with optional Global Benchmark Ghost Marker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-white/[0.06]">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Users className="h-3 w-3 text-sky-500 dark:text-sky-400" /> Population Share
                    </span>
                    <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{tier.adultsShare < 0.01 ? '< 0.01%' : formatPercent(tier.adultsShare)}</span>
                      {isCountryScope && showGlobalGhost && globalTier && popDeltaVsGlobal !== null && (
                        <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                          (Global: {globalTier.adultsShare < 0.01 ? '<0.01%' : formatPercent(globalTier.adultsShare)})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(1, tier.adultsShare))}%` }}
                    />
                    {isCountryScope && showGlobalGhost && globalTier && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-amber-400 dark:bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]"
                        style={{ left: `${Math.min(99, Math.max(1, globalTier.adultsShare))}%` }}
                        title={`Global Population Benchmark: ${formatPercent(globalTier.adultsShare)}`}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Wealth Share
                    </span>
                    <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{formatPercent(tier.wealthShare)}</span>
                      {isCountryScope && showGlobalGhost && globalTier && (
                        <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                          (Global: {formatPercent(globalTier.wealthShare)})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(1, tier.wealthShare))}%` }}
                    />
                    {isCountryScope && showGlobalGhost && globalTier && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-amber-400 dark:bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]"
                        style={{ left: `${Math.min(99, Math.max(1, globalTier.wealthShare))}%` }}
                        title={`Global Wealth Share Benchmark: ${formatPercent(globalTier.wealthShare)}`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Explanatory footer for the bracket */}
              {isSelected && (
                <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-white/[0.08] text-xs sm:text-sm text-slate-600 dark:text-slate-300 animate-in fade-in duration-150 leading-relaxed font-normal">
                  {tier.bracket === '> $100M' && (
                    <p>
                      <strong>Ultra-High-Net-Worth (Centi-Millionaires &amp; Billionaires):</strong>{' '}
                      {isCountryScope ? (
                        <>
                          In {dist.scopeName}, roughly {formatNumber(Math.round(tier.adultsMillion * 1_000_000))} individuals ({tier.adultsShare < 0.01 ? '< 0.01%' : formatPercent(tier.adultsShare)} of adults) command {formatPercent(tier.wealthShare)} of total private wealth ({formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}). This apex tier holds controlling equity in listed corporations, private conglomerates, and institutional real estate.
                        </>
                      ) : (
                        <>
                          An ultra-exclusive apex group of roughly {formatNumber(Math.round(tier.adultsMillion * 1_000_000))} individuals (&lt; 0.01% of global adults) controlling {formatPercent(tier.wealthShare)} of all private net wealth on Earth ({formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}). This tier encompasses sovereign-scale holdings, listed tech equity, and private conglomerates.
                        </>
                      )}
                    </p>
                  )}
                  {tier.bracket === '$10M - $100M' && (
                    <p>
                      <strong>Very-High-Net-Worth (Multi-Millionaires &amp; Family Offices):</strong> Comprises {formatPercent(tier.adultsShare)} of adults in {dist.scopeName}, commanding{' '}
                      {formatPercent(tier.wealthShare)} of aggregate wealth ({formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}). Represents founders of mid-sized businesses, private equity partners, and multi-property portfolios.
                    </p>
                  )}
                  {tier.bracket === '$1M - $10M' && (
                    <p>
                      <strong>High-Net-Worth Individuals (Everyday Millionaires):</strong> Comprises {formatPercent(tier.adultsShare)} of adults in {dist.scopeName} controlling{' '}
                      {formatPercent(tier.wealthShare)} of private wealth ({formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}). Driven by senior professionals, compounded retirement accounts, and paid-off metropolitan homes.
                    </p>
                  )}
                  {tier.bracket === '$100k - $1M' && (
                    <p>
                      <strong>Broad Property &amp; Pension Middle Class:</strong> Represents {formatPercent(tier.adultsShare)} of adults in {dist.scopeName}, holding{' '}
                      {formatPercent(tier.wealthShare)} of wealth. A thick $100k–$1M band indicates widespread homeownership and funded pension systems (such as Australia&apos;s Superannuation or Western European household equity).
                    </p>
                  )}
                  {tier.bracket === '$10k - $100k' && (
                    <p>
                      <strong>Emerging &amp; Working Asset Builders:</strong> Accounts for {formatPercent(tier.adultsShare)} of adults in {dist.scopeName} and{' '}
                      {formatPercent(tier.wealthShare)} of wealth. Includes early-career savers in advanced economies and the rapidly expanding urban middle class across emerging markets.
                    </p>
                  )}
                  {tier.bracket === '< $10k' && (
                    <p>
                      <strong>Base of the Pyramid:</strong> Represents {formatPercent(tier.adultsShare)} of adults in {dist.scopeName}, holding{' '}
                      {formatPercent(tier.wealthShare)} of net wealth due to limited asset ownership, young demographic profiles, or student/consumer debt burdens offsetting gross savings.
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isCountryScope && (
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Amber tick marks (<span className="inline-block h-2.5 w-0.5 bg-amber-400 align-middle mx-0.5" />) indicate the <strong>Global World Baseline ({dist.year})</strong> for direct structural comparison.
          </span>
          <Link
            href={`/geography?tab=map-duel&country=${dist.scopeCode}&a=${dist.scopeCode}&lens=wealth`}
            className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            <span>Inspect {dist.scopeName} in Country Duel Arena</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
