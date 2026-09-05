'use client';

import React, { useState } from 'react';
import { COUNTRIES_DATA, ECONOMIC_BLOCS } from '../../data/country-metrics';
import { CountryProfile, EconomicBloc, Granularity, CurrencyPerspective } from '../../lib/types';
import { formatCurrency, formatPercent, adjustValue } from '../../lib/formatters';
import { MapPin, Search, Layers, TrendingUp, Info } from 'lucide-react';

interface WorldMapProps {
  selectedYear: number;
  currencyPerspective: CurrencyPerspective;
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
}

type MetricType =
  | 'totalWealth'
  | 'wealthPerAdult'
  | 'medianWealth'
  | 'gdp'
  | 'inflation'
  | 'debtToGdp'
  | 'gini';

/*
 * Country coordinate projection to standard SVG canvas (800x420)
 * Uses Equirectangular projection coordinates mapped directly to SVG pixel space.
 */
function projectToSvg([lon, lat]: [number, number]): [number, number] {
  const x = ((lon + 180) * (800 / 360));
  const y = ((90 - lat) * (420 / 180));
  return [Math.round(x), Math.round(y)];
}

export function WorldMap({
  selectedYear,
  currencyPerspective,
  granularity,
  onGranularityChange,
}: WorldMapProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>('wealthPerAdult');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('USA');
  const [selectedBlocId, setSelectedBlocId] = useState<string>('g7');

  const selectedCountry = COUNTRIES_DATA.find((c) => c.code === selectedCountryCode) || COUNTRIES_DATA[0];
  const selectedBloc = ECONOMIC_BLOCS.find((b) => b.id === selectedBlocId) || ECONOMIC_BLOCS[0];

  const filteredCountries = COUNTRIES_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const metricLabels: Record<MetricType, string> = {
    totalWealth: 'Total Wealth ($T)',
    wealthPerAdult: 'Wealth per Adult ($)',
    medianWealth: 'Median Wealth ($)',
    gdp: 'Gross Domestic Product ($T)',
    inflation: 'Inflation Rate (%)',
    debtToGdp: 'Sovereign Debt (% of GDP)',
    gini: 'Wealth Gini Index',
  };

  const getCountryMetricDisplay = (country: CountryProfile, metric: MetricType) => {
    const historyData = country.history[selectedYear] || country.history[2025];
    switch (metric) {
      case 'totalWealth':
        return formatCurrency(adjustValue(historyData.totalWealthTrillion, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true });
      case 'wealthPerAdult':
        return formatCurrency(adjustValue(historyData.wealthPerAdultUSD, selectedYear, currencyPerspective), { compact: true });
      case 'medianWealth':
        return formatCurrency(adjustValue(historyData.medianWealthUSD, selectedYear, currencyPerspective), { compact: true });
      case 'gdp':
        return formatCurrency(adjustValue(historyData.gdpTrillionUSD, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true });
      case 'inflation':
        return formatPercent(historyData.inflationRate);
      case 'debtToGdp':
        return formatPercent(historyData.debtToGdp);
      case 'gini':
        return historyData.gini.toFixed(2);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-[#242b3d] bg-[#12151e] p-4">
        {/* Granularity switch */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Granularity:
          </span>
          <div className="flex rounded-lg border border-[#242b3d] bg-[#181c27] p-0.5 text-xs">
            <button
              onClick={() => onGranularityChange('country')}
              className={`rounded px-3 py-1 font-medium transition-colors ${
                granularity === 'country'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              By Country
            </button>
            <button
              onClick={() => onGranularityChange('bloc')}
              className={`rounded px-3 py-1 font-medium transition-colors ${
                granularity === 'bloc'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              By Economic Bloc (G7, BRICS+)
            </button>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {(Object.keys(metricLabels) as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                activeMetric === m
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'border-slate-800 bg-[#161a26] text-slate-400 hover:text-slate-200'
              }`}
            >
              {metricLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Geographic Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-8 rounded-xl border border-[#242b3d] bg-[#12151e] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              Global Distribution Map ({selectedYear})
            </h4>
            <span className="text-xs text-slate-400">
              Metric: <strong className="text-slate-200">{metricLabels[activeMetric]}</strong>
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative aspect-[16/9] w-full rounded-lg border border-slate-800/80 bg-[#0c0e14] overflow-hidden flex items-center justify-center p-2">
            <svg
              viewBox="0 0 800 420"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
            >
              {/* World outline grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#181e2b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="800" height="420" fill="url(#grid)" />

              {/* Equator & Prime Meridian markers */}
              <line x1="0" y1="210" x2="800" y2="210" stroke="#1f2738" strokeWidth="0.8" strokeDasharray="4 4" />
              <line x1="400" y1="0" x2="400" y2="420" stroke="#1f2738" strokeWidth="0.8" strokeDasharray="4 4" />

              {/* Render country nodes with interactive pulse & sizing */}
              {COUNTRIES_DATA.map((c) => {
                const [cx, cy] = projectToSvg(c.coordinates);
                const isSelected = selectedCountryCode === c.code;
                const isMemberOfSelectedBloc = selectedBloc.memberCodes.includes(c.code);

                const highlight = granularity === 'country' ? isSelected : isMemberOfSelectedBloc;

                return (
                  <g
                    key={c.code}
                    className="cursor-pointer group"
                    onClick={() => setSelectedCountryCode(c.code)}
                  >
                    {/* Outer glow ring for active selection */}
                    {highlight && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={18}
                        fill="none"
                        stroke={granularity === 'bloc' ? selectedBloc.color : '#10b981'}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-spin-slow"
                      />
                    )}
                    {/* Geographic bubble */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={highlight ? 10 : 7}
                      fill={highlight ? (granularity === 'bloc' ? selectedBloc.color : '#10b981') : '#242b3d'}
                      stroke="#090a0f"
                      strokeWidth="1.5"
                      className="transition-all group-hover:scale-125"
                    />
                    {/* Country Code Label */}
                    <text
                      x={cx}
                      y={cy - 12}
                      textAnchor="middle"
                      fill={highlight ? '#ffffff' : '#64748b'}
                      fontSize="10"
                      fontWeight={highlight ? 'bold' : 'normal'}
                      className="pointer-events-none select-none"
                    >
                      {c.flag} {c.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map legend and guidance */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Click any territory beacon to inspect economic health</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Info className="h-3.5 w-3.5" /> Equirectangular projection
            </span>
          </div>
        </div>

        {/* Country or Bloc Detail Inspector Card */}
        <div className="lg:col-span-4 space-y-4">
          {granularity === 'country' ? (
            <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedCountry.name}</h3>
                    <span className="text-xs text-slate-400">{selectedCountry.region}</span>
                  </div>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300 border border-slate-700">
                  {selectedCountry.code}
                </span>
              </div>

              {/* Metrics list */}
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Total Net Wealth:</span>
                  <span className="font-bold text-emerald-400">
                    {getCountryMetricDisplay(selectedCountry, 'totalWealth')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Wealth per Adult (Mean):</span>
                  <span className="font-bold text-white">
                    {getCountryMetricDisplay(selectedCountry, 'wealthPerAdult')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Median Wealth (Middle Person):</span>
                  <span className="font-bold text-cyan-400">
                    {getCountryMetricDisplay(selectedCountry, 'medianWealth')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Gross Domestic Product (GDP):</span>
                  <span className="font-semibold text-slate-200">
                    {getCountryMetricDisplay(selectedCountry, 'gdp')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Inflation Rate (CPI):</span>
                  <span className="font-semibold text-amber-400">
                    {getCountryMetricDisplay(selectedCountry, 'inflation')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Sovereign Debt / GDP:</span>
                  <span className="font-semibold text-slate-200">
                    {getCountryMetricDisplay(selectedCountry, 'debtToGdp')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5">
                  <span className="text-slate-400">Wealth Gini Inequality:</span>
                  <span className="font-semibold text-slate-200">
                    {getCountryMetricDisplay(selectedCountry, 'gini')}
                  </span>
                </div>
              </div>

              {/* National Asset Portfolio Mix */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Household Asset Mix ({selectedYear})
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Financial Assets</span>
                    <span className="font-bold text-cyan-400">
                      {formatPercent(selectedCountry.history[selectedYear]?.assetMix.financialShare ?? 50)}
                    </span>
                  </div>
                  <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Real Estate / Land</span>
                    <span className="font-bold text-emerald-400">
                      {formatPercent(selectedCountry.history[selectedYear]?.assetMix.nonFinancialShare ?? 50)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
              <div className="mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Economic Bloc Profile
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedBloc.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedBloc.description}
                </p>
              </div>

              {/* Bloc selector */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {ECONOMIC_BLOCS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBlocId(b.id)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      selectedBlocId === b.id
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {b.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Bloc Metrics */}
              {(() => {
                const blocMetric = selectedBloc.history[selectedYear] || selectedBloc.history[2025];
                return (
                  <div className="space-y-3 border-t border-slate-800 pt-3 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Total Bloc Wealth:</span>
                      <span className="font-bold text-emerald-400">
                        {formatCurrency(adjustValue(blocMetric.totalWealthTrillion, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Global Wealth Share:</span>
                      <span className="font-bold text-white">
                        {formatPercent(blocMetric.globalWealthShare)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Global GDP Share:</span>
                      <span className="font-bold text-cyan-400">
                        {formatPercent(blocMetric.globalGdpShare)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Bloc Population:</span>
                      <span className="font-semibold text-slate-200">
                        {(blocMetric.populationMillion / 1000).toFixed(2)} Billion
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Average Wealth / Adult:</span>
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(adjustValue(blocMetric.wealthPerAdultUSD, selectedYear, currencyPerspective), { compact: true })}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick country search filter list */}
          <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-4">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-[#161a26] pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setSelectedCountryCode(c.code);
                    if (granularity === 'bloc') onGranularityChange('country');
                  }}
                  className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                    selectedCountryCode === c.code && granularity === 'country'
                      ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {getCountryMetricDisplay(c, activeMetric)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
