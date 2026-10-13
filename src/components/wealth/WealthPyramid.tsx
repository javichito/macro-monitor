'use client';

import React, { useState } from 'react';
import { GlobalWealthYear, CurrencyPerspective } from '../../lib/types';
import { formatCurrency, formatPercent, formatNumber, adjustValue } from '../../lib/formatters';
import { DataExportMenu } from '../common/DataExportMenu';
import { Users, DollarSign, Layers } from 'lucide-react';

interface WealthPyramidProps {
  data: GlobalWealthYear;
  currencyPerspective: CurrencyPerspective;
}

export function WealthPyramid({ data, currencyPerspective }: WealthPyramidProps) {
  const [activeBracket, setActiveBracket] = useState<string | null>(null);

  /*
   * Tiers are reversed so the highest net worth bracket sits at the top of the pyramid
   * mimicking traditional wealth pyramid infographics.
   */
  const displayTiers = [...data.tiers].reverse();

  return (
    <div className="apple-card p-5 sm:p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <Layers className="h-4 w-4" />
            </div>
            Global Wealth Pyramid ({data.year})
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-normal">
            Comparing the share of world adult population against the share of world wealth held.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400"></span>
            <span>% of Adults</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            <span>% of Total Wealth</span>
          </div>

          {/* One-click Data Export for Researchers & Journalists */}
          <DataExportMenu
            title={`Global Wealth Pyramid (${data.year})`}
            filename={`global-wealth-pyramid-${data.year}`}
            data={() =>
              data.tiers.map((t) => ({
                bracket: t.bracket,
                adultsMillion: t.adultsMillion,
                adultsSharePercent: Number((t.adultsShare * 100).toFixed(2)),
                wealthTrillion: adjustValue(t.wealthTrillion, data.year, currencyPerspective),
                wealthSharePercent: Number((t.wealthShare * 100).toFixed(2)),
                averageWealthPerAdult: Math.round(
                  (adjustValue(t.wealthTrillion, data.year, currencyPerspective) * 1_000_000_000_000) /
                    (t.adultsMillion * 1_000_000)
                ),
              }))
            }
            columns={[
              { key: 'bracket', label: 'Wealth Bracket Tier' },
              { key: 'adultsMillion', label: 'Adults (Millions)' },
              { key: 'adultsSharePercent', label: 'Share of Adult Population (%)' },
              { key: 'wealthTrillion', label: `Aggregate Wealth ($T ${currencyPerspective.toUpperCase()})` },
              { key: 'wealthSharePercent', label: 'Share of Global Wealth (%)' },
              { key: 'averageWealthPerAdult', label: 'Average Wealth per Adult ($)' },
            ]}
            metadata={{
              description: `Distribution of global private net worth across wealth tiers in ${data.year}.`,
              source: 'UBS Global Wealth Databook, Credit Suisse',
              perspective: `${currencyPerspective.toUpperCase()} USD`,
              year: data.year,
              totalWealthTrillion: adjustValue(data.totalWealthTrillion, data.year, currencyPerspective),
              adultPopulationBillions: data.adultPopulationBillions,
            }}
          />
        </div>
      </div>

      <div className="space-y-3.5">
        {displayTiers.map((tier) => {
          const isSelected = activeBracket === tier.bracket;
          const adjustedWealthTrillion = adjustValue(tier.wealthTrillion, data.year, currencyPerspective);

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
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
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
                  <span className="text-xs text-slate-500 dark:text-slate-300 hidden sm:inline font-medium">
                    ({tier.adultsMillion < 1
                      ? `${formatNumber(Math.round(tier.adultsMillion * 1_000_000))} adults`
                      : `${formatNumber(tier.adultsMillion)}M adults`})
                  </span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}
                </span>
              </div>

              {/* Comparative Dual Bar Chart with Apple high-contrast pill meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-white/[0.06]">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Users className="h-3 w-3 text-sky-500 dark:text-sky-400" /> Population Share
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {tier.adultsShare < 0.01 ? '< 0.01%' : formatPercent(tier.adultsShare)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                      style={{ width: `${Math.max(1, tier.adultsShare)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Wealth Share
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatPercent(tier.wealthShare)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.max(1, tier.wealthShare)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Explanatory footer for the bracket */}
              {isSelected && (
                <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-white/[0.08] text-xs sm:text-sm text-slate-600 dark:text-slate-300 animate-in fade-in duration-150 leading-relaxed font-normal">
                  {tier.bracket === '> $100M' && (
                    <p>
                      <strong>Ultra-High-Net-Worth (Centi-Millionaires &amp; Billionaires):</strong> An ultra-exclusive apex group of roughly {formatNumber(Math.round(tier.adultsMillion * 1_000_000))} individuals (&lt; 0.01% of global adults) controlling {formatPercent(tier.wealthShare)} of all private net wealth on Earth (${formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}). This tier encompasses sovereign-scale holdings, listed tech equity, and private conglomerates.
                    </p>
                  )}
                  {tier.bracket === '$10M - $100M' && (
                    <p>
                      <strong>Very-High-Net-Worth (Multi-Millionaires &amp; Family Offices):</strong> Comprises only {formatPercent(tier.adultsShare)} of global adults ({formatNumber(tier.adultsMillion)}M individuals), commanding {formatPercent(tier.wealthShare)} of global wealth (${formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}). Represents owners of mid-sized private corporations, principal real estate portfolios, family offices, and private equity partners.
                    </p>
                  )}
                  {tier.bracket === '$1M - $10M' && (
                    <p>
                      <strong>High-Net-Worth Individuals (Millionaires):</strong> Comprises {formatPercent(tier.adultsShare)} of global adults ({formatNumber(tier.adultsMillion)}M individuals) controlling {formatPercent(tier.wealthShare)} of global wealth (${formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}). Represents senior executives, successful entrepreneurs, specialized professionals, and substantial prime real estate owners.
                    </p>
                  )}
                  {tier.bracket === '$1M - $100M' && (
                    <p>
                      <strong>High-Net-Worth Individuals:</strong> Comprises {formatPercent(tier.adultsShare)} of global adults ({formatNumber(tier.adultsMillion)}M individuals), representing established entrepreneurs, corporate executives, and substantial real estate portfolios controlling {formatPercent(tier.wealthShare)} of global wealth.
                    </p>
                  )}
                  {tier.bracket === '> $1M' && (
                    <p>
                      <strong>The Top Tier:</strong> Comprises only {formatPercent(tier.adultsShare)} of global adults ({formatNumber(tier.adultsMillion)}M individuals), yet commands {formatPercent(tier.wealthShare)} of all private net wealth on Earth.
                    </p>
                  )}
                  {tier.bracket === '$100k - $1M' && (
                    <p>
                      <strong>Upper Middle Class:</strong> Typically homeowners and pension holders in North America, Western Europe, and coastal East Asia, holding {formatPercent(tier.wealthShare)} of global wealth.
                    </p>
                  )}
                  {tier.bracket === '$10k - $100k' && (
                    <p>
                      <strong>The Global Engine:</strong> The fastest expanding demographic tier over the past 20 years, driven heavily by urbanization and property equity across China, Southeast Asia, and Latin America.
                    </p>
                  )}
                  {tier.bracket === '< $10k' && (
                    <p>
                      <strong>Base of the Pyramid:</strong> Represents nearly half the planet ({formatNumber(tier.adultsMillion)}M adults), but accounts for merely {formatPercent(tier.wealthShare)} of global net wealth due to limited asset ownership and debt burdens.
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
