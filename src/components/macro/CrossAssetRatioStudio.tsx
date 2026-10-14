'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  CROSS_ASSET_RATIOS,
  CrossAssetRatioModel,
  calculateImpliedRatio,
  evaluateRatioRegime,
  calculatePercentileRank,
  getCombinedCrossAssetExportData,
} from '../../data/cross-asset-ratios-data';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import { ShareDeepLinkMenu } from '../common/ShareDeepLinkMenu';
import { deserializeCrossAssetRatio, useDeepLinkSync } from '../../lib/deep-link';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
  Sliders,
  Sparkles,
  RotateCcw,
  Info,
  CheckCircle2,
  BarChart2,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

type RatioKey = 'copper-gold' | 'sp500-m2' | 'gold-oil';
type ChartViewMode = 'ratio' | 'normalized';
type TimeWindow = 'all' | '15y' | '5y';

export function CrossAssetRatioStudio() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [activeRatioKey, setActiveRatioKey] = useState<RatioKey>('copper-gold');
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>('ratio');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');

  const activeModel: CrossAssetRatioModel = CROSS_ASSET_RATIOS[activeRatioKey];

  // Interactive Sandbox state: user can simulate custom numerator and denominator values
  const [simNumerator, setSimNumerator] = useState<number>(activeModel.numerator.currentValue);
  const [simDenominator, setSimDenominator] = useState<number>(activeModel.denominator.currentValue);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  /*
   * Hydrate Cross-Asset Ratio Studio state from deep-link URL hashes or query strings
   * so custom market sandbox configurations can be circulated among macro analysts.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const restored = deserializeCrossAssetRatio();
    if (restored) {
      setActiveRatioKey(restored.ratio);
      setSimNumerator(restored.numerator);
      setSimDenominator(restored.denominator);
      if (restored.viewMode) setChartViewMode(restored.viewMode);
      if (restored.timeWindow) setTimeWindow(restored.timeWindow);
    }
    setIsInitialized(true);
  }, []);

  /*
   * Keep browser address bar in sync with active ratio sandbox modifications
   * so copying the address bar URL shares the exact state.
   */
  useDeepLinkSync(
    'ratios',
    {
      ratio: activeRatioKey,
      numerator: simNumerator,
      denominator: simDenominator,
      viewMode: chartViewMode,
      timeWindow,
    },
    isInitialized
  );

  // Sync simulator sliders whenever switching between ratios
  const handleRatioSwitch = (newKey: RatioKey) => {
    setActiveRatioKey(newKey);
    const model = CROSS_ASSET_RATIOS[newKey];
    setSimNumerator(model.numerator.currentValue);
    setSimDenominator(model.denominator.currentValue);
  };

  // Filter history based on selected time window
  const filteredHistory = useMemo(() => {
    const raw = activeModel.history;
    if (timeWindow === '5y') {
      return raw.filter((d) => d.year >= 2021);
    }
    if (timeWindow === '15y') {
      return raw.filter((d) => d.year >= 2011);
    }
    return raw;
  }, [activeModel.history, timeWindow]);

  // Compute normalized series (Base 100 at the first visible point) for dual comparison
  const normalizedHistory = useMemo(() => {
    if (filteredHistory.length === 0) return [];
    const baseNumerator = filteredHistory[0].numeratorValue || 1;
    const baseDenominator = filteredHistory[0].denominatorValue || 1;

    return filteredHistory.map((d) => ({
      ...d,
      normNumerator: Number(((d.numeratorValue / baseNumerator) * 100).toFixed(1)),
      normDenominator: Number(((d.denominatorValue / baseDenominator) * 100).toFixed(1)),
    }));
  }, [filteredHistory]);

  // Real-time calculations for the interactive sandbox
  const simulatedRatio = useMemo(() => {
    return calculateImpliedRatio(activeRatioKey, simNumerator, simDenominator);
  }, [activeRatioKey, simNumerator, simDenominator]);

  const simulatedRegime = useMemo(() => {
    return evaluateRatioRegime(activeRatioKey, simulatedRatio);
  }, [activeRatioKey, simulatedRatio]);

  const simulatedPercentile = useMemo(() => {
    return calculatePercentileRank(activeRatioKey, simulatedRatio);
  }, [activeRatioKey, simulatedRatio]);

  const ratioDeltaPct = useMemo(() => {
    if (activeModel.currentValue === 0) return 0;
    return Number(
      (((simulatedRatio - activeModel.currentValue) / activeModel.currentValue) * 100).toFixed(1)
    );
  }, [simulatedRatio, activeModel.currentValue]);

  const isSimulated =
    simNumerator !== activeModel.numerator.currentValue ||
    simDenominator !== activeModel.denominator.currentValue;

  const handleResetSandbox = () => {
    setSimNumerator(activeModel.numerator.currentValue);
    setSimDenominator(activeModel.denominator.currentValue);
  };

  const handleApplyScenario = (num: number, den: number) => {
    setSimNumerator(num);
    setSimDenominator(den);
  };

  // Pre-compiled dataset for combined multi-ratio CSV/JSON export
  const combinedExportData = useMemo(() => {
    return getCombinedCrossAssetExportData();
  }, []);

  return (
    <section id="ratio-studio" className="space-y-6">
      {/* Studio Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-600 dark:text-sky-300">
            <Scale className="h-3.5 w-3.5" />
            <span>Analytical Cross-Asset Ratio Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Macro Relative-Price Barometers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Evaluate cyclical growth, monetary debasement, and geopolitical distress through structural ratios rather than nominal price illusions.
          </p>
        </div>

        {/* Global Data Portability & Deep Link Sharing */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <ShareDeepLinkMenu
            simulator="ratios"
            state={{
              ratio: activeRatioKey,
              numerator: simNumerator,
              denominator: simDenominator,
              viewMode: chartViewMode,
              timeWindow,
            }}
            label="Share Ratio Studio"
          />
          <DataExportMenu
            filename={`cross-asset-ratios-${activeRatioKey}`}
            title={`${activeModel.name} Historical Dataset`}
            data={activeModel.history}
            columns={[
              { key: 'date', label: 'Period' },
              { key: 'year', label: 'Year' },
              { key: 'ratio', label: `${activeModel.name} (${activeModel.unit})` },
              { key: 'numeratorValue', label: `${activeModel.numerator.name} (${activeModel.numerator.unit})` },
              { key: 'denominatorValue', label: `${activeModel.denominator.name} (${activeModel.denominator.unit})` },
              { key: 'eventNote', label: 'Historical Milestone' },
            ]}
            metadata={{
              source: 'MacroMonitor Cross-Asset Relative Value Engine (1990–2026)',
              methodology: activeModel.formula,
              perspective: 'Relative Cross-Asset Pricing',
              category: activeModel.category,
            }}
          />
        </div>
      </div>

      {/* Primary Ratio Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.keys(CROSS_ASSET_RATIOS) as RatioKey[]).map((key) => {
          const m = CROSS_ASSET_RATIOS[key];
          const isSelected = activeRatioKey === key;

          return (
            <button
              key={key}
              onClick={() => handleRatioSwitch(key)}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-500/10 dark:bg-white/[0.08] border-sky-500/50 dark:border-sky-400 shadow-md ring-1 ring-sky-500/30'
                  : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {m.symbol}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {m.name}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    m.regimeBadgeColor === 'emerald'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : m.regimeBadgeColor === 'amber'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : m.regimeBadgeColor === 'purple'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  }`}
                >
                  {m.percentileRank}th %ile
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {m.currentValue}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">
                    {m.unit}
                  </span>
                </div>
                <div
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                    m.change24hPct >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {m.change24hPct >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {m.change24hPct >= 0 ? '+' : ''}
                    {m.change24hPct}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Model Deep Dive & Regime Summary Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tracking-wide uppercase">
                {activeModel.category}
              </span>
              <span className="text-slate-300 dark:text-white/20">•</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Formula: {activeModel.formula}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {activeModel.tagline}
            </h3>
          </div>

          {/* Regime Badge & Percentile */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-right">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Historical Percentile
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {activeModel.percentileRank}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Active Macro Regime
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {activeModel.regimeStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Analytical Regime Narrative */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.04]">
          {activeModel.regimeAnalysis}
        </p>

        {/* Live Numerator & Denominator Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Numerator */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Numerator Asset ({activeModel.numerator.symbol})
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {activeModel.numerator.name}
              </span>
              <span className="text-sm font-mono font-semibold text-sky-600 dark:text-sky-400">
                {activeModel.numerator.prefix}
                {activeModel.numerator.currentValue.toLocaleString('en-US')}
                {activeModel.numerator.suffix}
              </span>
            </div>
          </div>

          {/* Denominator */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Denominator Asset ({activeModel.denominator.symbol})
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {activeModel.denominator.name}
              </span>
              <span className="text-sm font-mono font-semibold text-amber-600 dark:text-amber-400">
                {activeModel.denominator.prefix}
                {activeModel.denominator.currentValue.toLocaleString('en-US')}
                {activeModel.denominator.suffix}
              </span>
            </div>
          </div>

          {/* Historical Median */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Historical 35Y Median
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {activeModel.historicalMedian}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Mean: {activeModel.historicalMean}
              </span>
            </div>
          </div>

          {/* Historical Range */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              All-Time Cycle Range
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Min: {activeModel.historicalMin}
              </span>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Max: {activeModel.historicalMax}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Time Series Chart Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-500" />
              <span>Multi-Decade Valuation Trajectory (1990–2026)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive timeline with turning point annotations and median equilibrium band.
            </p>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle: Ratio vs Normalized Overlay */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs">
              <button
                onClick={() => setChartViewMode('ratio')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  chartViewMode === 'ratio'
                    ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Ratio Trend
              </button>
              <button
                onClick={() => setChartViewMode('normalized')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  chartViewMode === 'normalized'
                    ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Numerator vs Denominator
              </button>
            </div>

            {/* Time Window Switcher */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs">
              {(['all', '15y', '5y'] as TimeWindow[]).map((tw) => (
                <button
                  key={tw}
                  onClick={() => setTimeWindow(tw)}
                  className={`px-2.5 py-1 rounded-lg font-semibold uppercase transition-all cursor-pointer ${
                    timeWindow === tw
                      ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tw}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'ratio' ? (
              <LineChart
                data={filteredHistory}
                margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl bg-slate-950/95 p-3 text-xs text-white shadow-xl border border-white/10 space-y-1.5 backdrop-blur-md max-w-xs">
                        <div className="font-semibold text-slate-200 border-b border-white/10 pb-1 flex justify-between">
                          <span>Period: {data.date}</span>
                          <span className="font-mono text-sky-400">
                            {data.ratio} {activeModel.unit}
                          </span>
                        </div>
                        <div className="space-y-0.5 text-[11px] text-slate-300">
                          <div>
                            {activeModel.numerator.name}:{' '}
                            <span className="font-mono text-white">
                              {activeModel.numerator.prefix}
                              {data.numeratorValue.toLocaleString('en-US')}
                              {activeModel.numerator.suffix}
                            </span>
                          </div>
                          <div>
                            {activeModel.denominator.name}:{' '}
                            <span className="font-mono text-white">
                              {activeModel.denominator.prefix}
                              {data.denominatorValue.toLocaleString('en-US')}
                              {activeModel.denominator.suffix}
                            </span>
                          </div>
                        </div>
                        {data.eventNote && (
                          <div className="text-[10px] text-amber-300/90 pt-1 border-t border-white/10">
                            📍 {data.eventNote}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={activeModel.historicalMedian}
                  stroke="#38bdf8"
                  strokeDasharray="4 4"
                  label={{
                    value: `Median: ${activeModel.historicalMedian}`,
                    position: 'insideTopRight',
                    fill: '#38bdf8',
                    fontSize: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ratio"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#0ea5e9', stroke: '#0284c7' }}
                  activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <LineChart
                data={normalizedHistory}
                margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                  label={{
                    value: 'Base 100',
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 10,
                    fill: isDark ? '#94a3b8' : '#64748b',
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl bg-slate-950/95 p-3 text-xs text-white shadow-xl border border-white/10 space-y-1.5 backdrop-blur-md max-w-xs">
                        <div className="font-semibold text-slate-200 border-b border-white/10 pb-1">
                          Period: {data.date} (Base 100)
                        </div>
                        <div className="space-y-0.5 text-[11px]">
                          <div className="text-sky-400">
                            {activeModel.numerator.name}: {data.normNumerator} pts (
                            {activeModel.numerator.prefix}
                            {data.numeratorValue.toLocaleString('en-US')}
                            {activeModel.numerator.suffix})
                          </div>
                          <div className="text-amber-400">
                            {activeModel.denominator.name}: {data.normDenominator} pts (
                            {activeModel.denominator.prefix}
                            {data.denominatorValue.toLocaleString('en-US')}
                            {activeModel.denominator.suffix})
                          </div>
                        </div>
                        {data.eventNote && (
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10">
                            📍 {data.eventNote}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="normNumerator"
                  name={activeModel.numerator.name}
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="normDenominator"
                  name={activeModel.denominator.name}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macro Ratio Sandbox: Interactive What-If Scenario Simulator */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Sliders className="h-3.5 w-3.5" />
              <span>Interactive Macro Ratio Sandbox</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Simulate Shocks &amp; What-If Cross-Asset Pricing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              Adjust numerator and denominator variables to test how hypothetical price shocks alter relative valuation regimes and historical percentiles.
            </p>
          </div>

          {isSimulated && (
            <button
              onClick={handleResetSandbox}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.1] hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
              <span>Reset to Baseline</span>
            </button>
          )}
        </div>

        {/* Presets Quick Scenario Buttons */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Institutional Stress Scenarios:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {activeModel.quickScenarios.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyScenario(sc.numeratorValue, sc.denominatorValue)}
                className="p-3 rounded-xl text-left bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] hover:border-sky-500/40 hover:bg-sky-500/[0.03] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400">
                  <Sparkles className="h-3 w-3 text-sky-500 shrink-0" />
                  <span>{sc.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {sc.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders & Numeric Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
          {/* Numerator Slider */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeModel.numerator.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Numerator ({activeModel.numerator.unit})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeModel.numerator.prefix}
                </span>
                <input
                  type="number"
                  step={activeModel.numerator.stepSlider}
                  value={simNumerator}
                  onChange={(e) => setSimNumerator(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-sm font-mono font-bold rounded-lg bg-white dark:bg-white/[0.08] border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white text-right focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeModel.numerator.suffix}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={activeModel.numerator.minSlider}
              max={activeModel.numerator.maxSlider}
              step={activeModel.numerator.stepSlider}
              value={simNumerator}
              onChange={(e) => setSimNumerator(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>
                {activeModel.numerator.prefix}
                {activeModel.numerator.minSlider}
                {activeModel.numerator.suffix}
              </span>
              <span>
                Baseline: {activeModel.numerator.prefix}
                {activeModel.numerator.currentValue}
                {activeModel.numerator.suffix}
              </span>
              <span>
                {activeModel.numerator.prefix}
                {activeModel.numerator.maxSlider}
                {activeModel.numerator.suffix}
              </span>
            </div>
          </div>

          {/* Denominator Slider */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeModel.denominator.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Denominator ({activeModel.denominator.unit})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeModel.denominator.prefix}
                </span>
                <input
                  type="number"
                  step={activeModel.denominator.stepSlider}
                  value={simDenominator}
                  onChange={(e) => setSimDenominator(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-sm font-mono font-bold rounded-lg bg-white dark:bg-white/[0.08] border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeModel.denominator.suffix}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={activeModel.denominator.minSlider}
              max={activeModel.denominator.maxSlider}
              step={activeModel.denominator.stepSlider}
              value={simDenominator}
              onChange={(e) => setSimDenominator(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>
                {activeModel.denominator.prefix}
                {activeModel.denominator.minSlider}
                {activeModel.denominator.suffix}
              </span>
              <span>
                Baseline: {activeModel.denominator.prefix}
                {activeModel.denominator.currentValue}
                {activeModel.denominator.suffix}
              </span>
              <span>
                {activeModel.denominator.prefix}
                {activeModel.denominator.maxSlider}
                {activeModel.denominator.suffix}
              </span>
            </div>
          </div>
        </div>

        {/* Simulation Output Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-sky-500/[0.06] to-purple-500/[0.06] border border-sky-500/20 dark:border-white/[0.1] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Simulated Scenario Outcome
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {simulatedRatio}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {activeModel.unit}
              </span>
              {isSimulated && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    ratioDeltaPct >= 0
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {ratioDeltaPct >= 0 ? '+' : ''}
                  {ratioDeltaPct}% vs baseline
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2.5 rounded-lg bg-white/60 dark:bg-black/30 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Implied Historical Rank
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {simulatedPercentile}th Percentile
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white/60 dark:bg-black/30 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Implied Regime
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {simulatedRegime.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calibrated Regime Thresholds Matrix */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-sky-500" />
          <span>Calibrated Historical Regime Thresholds</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {activeModel.thresholds.map((th, idx) => {
            const isCurrentlyActive =
              activeModel.currentValue >= th.min && activeModel.currentValue <= th.max;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrentlyActive
                    ? 'bg-sky-500/10 dark:bg-white/[0.08] border-sky-500/50 shadow-sm ring-1 ring-sky-500/30'
                    : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {th.label}
                  </span>
                  {isCurrentlyActive && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-500 text-white">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block mb-1.5">
                  Range: {th.min} – {th.max} {activeModel.unit}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                  {th.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Explainer & Institutional Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
            <Info className="h-4 w-4" />
            <span>Macro Transmission Mechanism</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Why Allocators Monitor {activeModel.name}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeModel.macroSignificance}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Institutional Asset Allocation Playbook</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Actionable Signal Interpretation
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeModel.institutionalTakeaway}
          </p>
        </div>
      </div>
    </section>
  );
}
