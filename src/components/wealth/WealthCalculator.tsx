'use client';

import React, { useState } from 'react';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import { calculateWealthPercentile } from '../../lib/calculations';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { UserCheck, Compass, Sparkles, DollarSign } from 'lucide-react';

export function WealthCalculator() {
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
    <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-[#121824] to-[#0d1017] p-5 sm:p-6 shadow-xl">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Compass className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Where Do You Stand? (Personal Wealth Positioner)
          </h3>
          <p className="text-xs text-slate-400">
            Discover your exact percentile standing nationally and globally based on 2026 wealth data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Input panel */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Your Country
            </label>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full rounded-lg border border-[#242b3d] bg-[#181c27] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              {COUNTRIES_DATA.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your Estimated Net Worth (USD)
              </label>
              <span className="text-xs text-slate-500">Assets minus all debts</span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <DollarSign className="h-4 w-4" />
              </div>
              <input
                type="number"
                min="0"
                step="1000"
                value={netWorth}
                onChange={(e) => setNetWorth(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[#242b3d] bg-[#181c27] pl-9 pr-4 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1.5">
              Quick Test Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setNetWorth(val)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    netWorth === val
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {formatCurrency(val, { compact: true })}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results display panel */}
        <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-[#161a26]/80 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                National Standing in {selectedCountry.name}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {result.bracketName}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {formatPercent(result.percentile, 1)}
              </span>
              <span className="text-sm font-medium text-slate-400">percentile</span>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Comparative metrics */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800">
            <div className="rounded border border-slate-800/80 bg-slate-900/50 p-2.5">
              <span className="text-[11px] text-slate-400 block">vs National Median</span>
              <span className="text-sm font-bold text-white">
                {result.countryMedianRatio}x
              </span>
              <span className="text-[10px] text-slate-500 block">
                Median: {formatCurrency(latestMetric.medianWealthUSD, { compact: true })}
              </span>
            </div>

            <div className="rounded border border-slate-800/80 bg-slate-900/50 p-2.5">
              <span className="text-[11px] text-slate-400 block">vs Global Median</span>
              <span className="text-sm font-bold text-emerald-400">
                {result.globalMedianRatio}x
              </span>
              <span className="text-[10px] text-slate-500 block">
                Global: $9,450
              </span>
            </div>
          </div>

          {/* Benchmark thresholds */}
          <div className="mt-3 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Top 10% in {selectedCountry.name} begins at:</span>
              <span className="font-semibold text-slate-200">
                {formatCurrency(result.thresholds.top10Percent, { compact: true })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Top 1% in {selectedCountry.name} begins at:</span>
              <span className="font-semibold text-slate-200">
                {formatCurrency(result.thresholds.top1Percent, { compact: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
