'use client';

import React, { useState } from 'react';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import { calculateWealthPercentile } from '../../lib/calculations';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { UserCheck, Compass, Sparkles, DollarSign, Globe2 } from 'lucide-react';

interface WealthCalculatorProps {
  onSwitchToPpp?: () => void;
}

export function WealthCalculator({ onSwitchToPpp }: WealthCalculatorProps = {}) {
  const [netWorth, setNetWorth] = useState<number>(65000);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('USA');

  const selectedCountry = COUNTRIES_DATA.find((c) => c.code === selectedCountryCode) || COUNTRIES_DATA[0];
  const latestMetric = selectedCountry.history[2026] || selectedCountry.history[2025];

  const result = calculateWealthPercentile(
    netWorth,
    latestMetric.medianWealthUSD,
    latestMetric.wealthPerAdultUSD
  );

  const quickPresets = [5000, 25000, 75000, 200000, 500000, 1200000];

  return (
    <div className="apple-card p-6 sm:p-7 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30 shadow-sm">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Where Do You Stand? (Personal Wealth Positioner)
          </h3>
          <p className="text-xs text-white/60">
            Discover your exact percentile standing nationally and globally based on 2026 wealth data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Select Your Country
            </label>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm font-medium text-white focus:border-[#0a84ff] focus:outline-none transition-colors"
            >
              {COUNTRIES_DATA.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#12141c] text-white">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Your Estimated Net Worth (USD)
              </label>
              <span className="text-xs text-white/40">Assets minus all debts</span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                <DollarSign className="h-4 w-4" />
              </div>
              <input
                type="number"
                min="0"
                step="1000"
                value={netWorth}
                onChange={(e) => setNetWorth(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-9 pr-4 py-2.5 text-sm text-white font-mono font-medium focus:border-[#0a84ff] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-2">
              Quick Test Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setNetWorth(val)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                    netWorth === val
                      ? 'bg-[#30d158]/20 text-[#30d158] border-[#30d158]/40 shadow-sm'
                      : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {formatCurrency(val, { compact: true })}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results display panel */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                National Standing in {selectedCountry.name}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30">
                {result.bracketName}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {formatPercent(result.percentile, 1)}
              </span>
              <span className="text-sm font-medium text-white/50">percentile</span>
            </div>

            <p className="text-xs text-white/75 mt-2.5 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Comparative metrics */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/[0.08]">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <span className="text-[11px] font-medium text-white/50 block">vs National Median</span>
              <span className="text-base font-bold text-white tracking-tight mt-0.5 block">
                {result.countryMedianRatio}x
              </span>
              <span className="text-[10px] text-white/40 block mt-0.5">
                Median: {formatCurrency(latestMetric.medianWealthUSD, { compact: true })}
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <span className="text-[11px] font-medium text-white/50 block">vs Global Median</span>
              <span className="text-base font-bold text-[#30d158] tracking-tight mt-0.5 block">
                {result.globalMedianRatio}x
              </span>
              <span className="text-[10px] text-white/40 block mt-0.5">
                Global: $9,450
              </span>
            </div>
          </div>

          {/* Benchmark thresholds */}
          <div className="mt-4 text-[11px] text-white/60 space-y-1.5">
            <div className="flex justify-between">
              <span>Top 10% in {selectedCountry.name} begins at:</span>
              <span className="font-semibold text-white">
                {formatCurrency(result.thresholds.top10Percent, { compact: true })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Top 1% in {selectedCountry.name} begins at:</span>
              <span className="font-semibold text-white">
                {formatCurrency(result.thresholds.top1Percent, { compact: true })}
              </span>
            </div>
          </div>

          {onSwitchToPpp && (
            <button
              type="button"
              onClick={onSwitchToPpp}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              <Globe2 className="h-3.5 w-3.5 text-[#0a84ff]" />
              <span>Compare what this buys abroad (PPP Converter) &rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
