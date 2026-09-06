'use client';

import React, { useState } from 'react';
import { GlobalWealthYear, CurrencyPerspective } from '../../lib/types';
import { formatCurrency, formatPercent, formatNumber, adjustValue } from '../../lib/formatters';
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
    <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Global Wealth Pyramid ({data.year})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparing the share of world adult population against the share of world wealth held.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
            <span>% of Adults</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            <span>% of Total Wealth</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {displayTiers.map((tier) => {
          const isSelected = activeBracket === tier.bracket;
          const adjustedWealthTrillion = adjustValue(tier.wealthTrillion, data.year, currencyPerspective);

          return (
            <div
              key={tier.bracket}
              onMouseEnter={() => setActiveBracket(tier.bracket)}
              onMouseLeave={() => setActiveBracket(null)}
              className={`rounded-lg border p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500/60 bg-slate-800/80 shadow-lg shadow-emerald-950/20'
                  : 'border-[#242b3d] bg-[#181c27]/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      tier.bracket === '> $100M'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {tier.bracket}
                  </span>
                  {tier.bracket === '> $100M' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      Apex
                    </span>
                  )}
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    ({tier.adultsMillion < 1
                      ? `${formatNumber(Math.round(tier.adultsMillion * 1_000_000))} adults`
                      : `${formatNumber(tier.adultsMillion)}M adults`})
                  </span>
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}
                </span>
              </div>

              {/* Comparative Dual Bar Chart */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2 border-t border-slate-800/80">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-cyan-400" /> Population Share
                    </span>
                    <span className="font-medium text-slate-200">
                      {tier.adultsShare < 0.01 ? '< 0.01%' : formatPercent(tier.adultsShare)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${Math.max(1, tier.adultsShare)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-emerald-400" /> Wealth Share
                    </span>
                    <span className="font-medium text-slate-200">{formatPercent(tier.wealthShare)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.max(1, tier.wealthShare)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Explanatory footer for the bracket */}
              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/60 text-xs text-slate-300 animate-in fade-in duration-150">
                  {tier.bracket === '> $100M' && (
                    <p>
                      <strong>Ultra-High-Net-Worth (Centi-Millionaires &amp; Billionaires):</strong> An ultra-exclusive apex group of roughly {formatNumber(Math.round(tier.adultsMillion * 1_000_000))} individuals (&lt; 0.01% of global adults) controlling {formatPercent(tier.wealthShare)} of all private net wealth on Earth (${formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}). This tier encompasses sovereign-scale holdings, listed tech equity, and private conglomerates.
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
