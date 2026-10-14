'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  HISTORICAL_HOUSING_SERIES,
  REGIONAL_HOUSING_PROFILES,
  AFFORDABILITY_REGIME_CONFIG,
  calculateHousingAffordabilityIndex,
  getHousingOverview,
  getLatestHousingState,
  getCombinedHousingExportData,
} from '../../data/housing-macro-data';
import {
  HousingRegionId,
  HousingAffordabilityRegime,
  RealHomePriceSeriesPoint,
} from '../../lib/types';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import { ShareDeepLinkMenu } from '../common/ShareDeepLinkMenu';
import {
  deserializeHousingMacro,
  useDeepLinkSync,
  HousingMacroState,
} from '../../lib/deep-link';
import {
  Home,
  Percent,
  TrendingUp,
  TrendingDown,
  Building2,
  Lock,
  Unlock,
  Sliders,
  RotateCcw,
  Globe2,
  AlertTriangle,
  Info,
  CheckCircle2,
  Layers,
  Scale,
  Sparkles,
  ShieldAlert,
  Landmark,
} from 'lucide-react';

type HousingView = 'affordability' | 'rates' | 'real_prices' | 'global';
type TimeWindow = 'all' | '10y' | '5y';

export function HousingMacroRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const overview = useMemo(() => getHousingOverview(), []);
  const latestHistorical = overview.historicalSeries[overview.historicalSeries.length - 1];

  // Primary navigation and filtering states
  const [activeView, setActiveView] = useState<HousingView>('affordability');
  const [selectedCountry, setSelectedCountry] = useState<HousingRegionId>('USA');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Interactive Affordability Simulator (Sandbox) state
  const [simRate, setSimRate] = useState<number>(latestHistorical.mortgageRate30Y);
  const [simPrice, setSimPrice] = useState<number>(latestHistorical.medianHomePriceUsd);
  const [simIncome, setSimIncome] = useState<number>(latestHistorical.medianFamilyIncomeUsd);

  /*
   * Hydrates simulator state from URL parameters or hash fragments on initial client mount,
   * enabling shared bookmarks and research links to reproduce exact affordability scenarios.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const restored = deserializeHousingMacro();
    if (restored) {
      if (restored.view) setActiveView(restored.view);
      if (restored.region) setSelectedCountry(restored.region);
      if (restored.timeWindow) setTimeWindow(restored.timeWindow);
      if (restored.simRate !== undefined) setSimRate(restored.simRate);
      if (restored.simPrice !== undefined) setSimPrice(restored.simPrice);
      if (restored.simIncome !== undefined) setSimIncome(restored.simIncome);
    }
    setIsInitialized(true);
  }, []);

  /*
   * Synchronizes active state back to the browser's address bar without reloading,
   * allowing users to copy direct URLs for specific views or customized sandbox parameters.
   */
  const deepLinkState: HousingMacroState = useMemo(
    () => ({
      view: activeView,
      region: selectedCountry,
      timeWindow,
      simRate,
      simPrice,
      simIncome,
    }),
    [activeView, selectedCountry, timeWindow, simRate, simPrice, simIncome]
  );

  useDeepLinkSync('housing', deepLinkState, isInitialized);

  // Evaluate simulated affordability dynamically based on sandbox slider adjustments
  const simEvaluation = useMemo(() => {
    return calculateHousingAffordabilityIndex(simIncome, simPrice, simRate);
  }, [simIncome, simPrice, simRate]);

  // Filter historical series according to the selected time horizon
  const filteredSeries = useMemo(() => {
    if (timeWindow === '5y') {
      return HISTORICAL_HOUSING_SERIES.filter((p) => p.year >= 2021);
    }
    if (timeWindow === '10y') {
      return HISTORICAL_HOUSING_SERIES.filter((p) => p.year >= 2016);
    }
    return HISTORICAL_HOUSING_SERIES;
  }, [timeWindow]);

  const activeProfile = REGIONAL_HOUSING_PROFILES[selectedCountry];
  const telemetry = useMemo(() => getLatestHousingState(), []);

  // Format data for CSV/JSON export menu
  const exportColumns = useMemo(
    () => [
      { key: 'date', label: 'Date' },
      { key: 'year', label: 'Year' },
      { key: 'nominalCaseShiller', label: 'Nominal Case-Shiller' },
      { key: 'realCaseShiller', label: 'Real Case-Shiller (Deflated by CPI)' },
      { key: 'cpiIndex', label: 'CPI Index (2000=100)' },
      { key: 'medianHomePriceUsd', label: 'Median Home Price ($)' },
      { key: 'medianFamilyIncomeUsd', label: 'Median Family Income ($)' },
      { key: 'mortgageRate30YPercent', label: '30Y Mortgage Rate (%)' },
      { key: 'treasury10YPercent', label: '10Y Treasury Yield (%)' },
      { key: 'mortgageSpreadBps', label: 'Mortgage Spread (bps)' },
      { key: 'effectiveExistingMortgageRatePercent', label: 'Effective Locked-in Rate (%)' },
      { key: 'housingAffordabilityIndex', label: 'Housing Affordability Index (HAI)' },
      { key: 'monthlyPaymentUsd', label: 'Monthly Payment P&I ($)' },
      { key: 'qualifyingIncomeUsd', label: 'Qualifying Annual Income ($)' },
      { key: 'paymentShareOfIncomePercent', label: 'Payment Share of Income (%)' },
      { key: 'eventAnnotation', label: 'Macro Event / Regime' },
    ],
    []
  );

  const resetSandbox = () => {
    setSimRate(latestHistorical.mortgageRate30Y);
    setSimPrice(latestHistorical.medianHomePriceUsd);
    setSimIncome(latestHistorical.medianFamilyIncomeUsd);
  };

  // Reusable custom chart tooltip for smooth dark/light mode rendering
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const dataPoint: RealHomePriceSeriesPoint = payload[0]?.payload;

    return (
      <div className="rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl text-xs space-y-2 max-w-xs">
        <div className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/[0.08] pb-1.5 flex justify-between items-center">
          <span>Year: {label}</span>
          {dataPoint?.hai && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                AFFORDABILITY_REGIME_CONFIG[dataPoint.hai < 85 ? 'severely_unaffordable' : dataPoint.hai < 100 ? 'unaffordable' : dataPoint.hai < 130 ? 'fairly_affordable' : 'highly_affordable'].bgClass
              } ${
                AFFORDABILITY_REGIME_CONFIG[dataPoint.hai < 85 ? 'severely_unaffordable' : dataPoint.hai < 100 ? 'unaffordable' : dataPoint.hai < 130 ? 'fairly_affordable' : 'highly_affordable'].textClass
              }`}
            >
              HAI: {dataPoint.hai.toFixed(1)}
            </span>
          )}
        </div>
        <div className="space-y-1">
          {payload.map((entry: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                {entry.name.includes('Rate') || entry.name.includes('Yield') ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
        {dataPoint?.eventNote && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/[0.08] pt-1.5 leading-tight italic">
            {dataPoint.eventNote}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="housing-radar" className="space-y-6">
      {/* Top Banner & Header */}
      <div className="apple-card p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Home className="h-3.5 w-3.5" />
              <span>Global Real Estate &amp; Monetary Transmission</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>Housing Macro &amp; Affordability Dynamics</span>
              <span className="text-xl sm:text-2xl">{activeProfile.flag}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Tracking the National Association of Realtors Housing Affordability Index (HAI), 30-Year Fixed mortgage rate transmission channels, and Real (CPI-deflated) Case-Shiller property purchasing power across systemic economies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* Deep-Link Sharing Menu */}
            <ShareDeepLinkMenu
              simulator="housing"
              state={deepLinkState}
              label="Share Housing State"
              variant="compact"
            />

            {/* CSV / JSON Dataset Export */}
            <DataExportMenu
              title="Housing Affordability & Real Estate Macro Dynamics"
              data={getCombinedHousingExportData()}
              columns={exportColumns}
              filename="housing-macro-affordability"
            />
          </div>
        </div>

        {/* Global Asset Year Context Banner */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <Building2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              Real Estate Valuation in <span className="font-bold">GlobalAssetYear</span>:{' '}
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ${overview.totalGlobalRealEstateWealthTrillion.toFixed(1)}T
              </span>{' '}
              (World's Largest Asset Class, 47.6% of Global Gross Wealth)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
            <Landmark className="h-3.5 w-3.5 text-sky-500" />
            <span>Primary transmission vector for central bank interest rate policy into household cash flow</span>
          </div>
        </div>
      </div>

      {/* Navigation View Tabs & Time Window Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* View Switcher */}
        <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] text-xs shadow-inner">
          <button
            onClick={() => setActiveView('affordability')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeView === 'affordability'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Scale className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Affordability Index (HAI)</span>
          </button>
          <button
            onClick={() => setActiveView('rates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeView === 'rates'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Percent className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            <span>30Y Benchmark &amp; Spread</span>
          </button>
          <button
            onClick={() => setActiveView('real_prices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeView === 'real_prices'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Real Home Prices (Deflated)</span>
          </button>
          <button
            onClick={() => setActiveView('global')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeView === 'global'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Global Transmission</span>
          </button>
        </div>

        {/* Time Window Switcher */}
        {activeView !== 'global' && (
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] text-xs self-end sm:self-auto">
            {(['all', '10y', '5y'] as TimeWindow[]).map((w) => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeWindow === w
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {w === 'all' ? 'All (1980+)' : w.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: Housing Affordability Index (HAI) & Interactive Sandbox Simulator */}
      {activeView === 'affordability' && (
        <div className="space-y-6">
          {/* Key Affordability Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Housing Affordability (HAI)</span>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Parity = 100</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {simEvaluation.hai.toFixed(1)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    AFFORDABILITY_REGIME_CONFIG[simEvaluation.regime].bgClass
                  } ${AFFORDABILITY_REGIME_CONFIG[simEvaluation.regime].textClass}`}
                >
                  {AFFORDABILITY_REGIME_CONFIG[simEvaluation.regime].label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {simEvaluation.hai < 100
                  ? `Median family earns ${simEvaluation.hai.toFixed(1)}% of qualifying threshold`
                  : `Median family earns ${(simEvaluation.hai - 100).toFixed(1)}% above qualifying income`}
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Monthly Payment (P&amp;I)</span>
                <Percent className="h-3.5 w-3.5 text-sky-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  ${simEvaluation.monthlyPayment.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ month</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Based on 20% down payment on ${simPrice.toLocaleString()} home at {simRate.toFixed(2)}%
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Qualifying Household Income</span>
                <Scale className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  ${simEvaluation.qualifyingIncome.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ year</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Required gross earnings under 25% debt-to-income underwriting standard
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Mortgage Payment Share</span>
                <Building2 className="h-3.5 w-3.5 text-purple-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {((simEvaluation.monthlyPayment * 12) / simIncome * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">of income</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {((simEvaluation.monthlyPayment * 12) / simIncome * 100) > 25
                  ? 'Exceeds recommended 25% prudent debt threshold'
                  : 'Well within sustainable consumer credit parameters'}
              </p>
            </div>
          </div>

          {/* Interactive Affordability Simulator Sandbox */}
          <div className="apple-card p-6 space-y-5 border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.03] to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Interactive Affordability Sandbox
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simulate central bank rate cuts, home price contractions, or wage growth to see when affordability parity (100) is regained.
                </p>
              </div>

              <button
                onClick={resetSandbox}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] transition-all cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to Benchmark</span>
              </button>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1: Mortgage Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    30-Year Mortgage Rate
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {simRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="12.0"
                  step="0.05"
                  value={simRate}
                  onChange={(e) => setSimRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>2.50% (ZIRP)</span>
                  <span>6.45% (Now)</span>
                  <span>12.00%</span>
                </div>
              </div>

              {/* Slider 2: Median Home Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Median Home Price
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ${simPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="800000"
                  step="5000"
                  value={simPrice}
                  onChange={(e) => setSimPrice(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$200k</span>
                  <span>$428k (Now)</span>
                  <span>$800k</span>
                </div>
              </div>

              {/* Slider 3: Median Household Income */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Median Household Income
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ${simIncome.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="40000"
                  max="180000"
                  step="1000"
                  value={simIncome}
                  onChange={(e) => setSimIncome(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$40k</span>
                  <span>$104.5k (Now)</span>
                  <span>$180k</span>
                </div>
              </div>
            </div>

            {/* Affordability Meter Visual */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Affordability Spectrum</span>
                <span className="font-mono">
                  {simEvaluation.hai < 100
                    ? `Deficit: ${(100 - simEvaluation.hai).toFixed(1)} pts below parity`
                    : `Surplus: +${(simEvaluation.hai - 100).toFixed(1)} pts above parity`}
                </span>
              </div>
              <div className="relative h-3 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden flex">
                <div className="h-full bg-rose-500" style={{ width: '35%' }} title="Severely Unaffordable (<85)" />
                <div className="h-full bg-amber-500" style={{ width: '15%' }} title="Unaffordable (85-100)" />
                <div className="h-full bg-sky-500" style={{ width: '25%' }} title="Fairly Affordable (100-130)" />
                <div className="h-full bg-emerald-500" style={{ width: '25%' }} title="Highly Affordable (>130)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                <span>0 (Crisis)</span>
                <span className="text-rose-500 font-bold">85 (Severe)</span>
                <span className="text-amber-500 font-bold">100 (Parity Line)</span>
                <span className="text-sky-500 font-bold">130 (Comfortable)</span>
                <span className="text-emerald-500 font-bold">200+ (Boom)</span>
              </div>
            </div>
          </div>

          {/* Historical Affordability Index (HAI) Chart */}
          <div className="apple-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Historical US Housing Affordability Index (1980–2026)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Values below 100 indicate that median household earnings are insufficient to service a median-priced home.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>HAI Index</span>
                </span>
                <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                  <span className="w-2.5 h-0.5 bg-rose-500" />
                  <span>100 Parity Threshold</span>
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredSeries} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                  <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickLine={false} />
                  <YAxis
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                    domain={[50, 210]}
                    ticks={[60, 80, 100, 120, 140, 160, 180, 200]}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <ReferenceLine
                    y={100}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{
                      value: '100 Parity Line',
                      position: 'insideBottomRight',
                      fill: '#ef4444',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hai"
                    name="Housing Affordability Index"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10b981' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 30-Year Mortgage Benchmark, Spread & Rate Lock-in Mechanism */}
      {activeView === 'rates' && (
        <div className="space-y-6">
          {/* Key Rates Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>30Y Fixed Mortgage Benchmark</span>
                <Percent className="h-3.5 w-3.5 text-sky-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {latestHistorical.mortgageRate30Y.toFixed(2)}%
                </span>
                <span className="text-xs text-rose-500 font-semibold font-mono">
                  +{(latestHistorical.mortgageRate30Y - 3.11).toFixed(2)}% vs 2020
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Benchmark rate for new primary residence originations
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>10-Year Treasury Yield</span>
                <Landmark className="h-3.5 w-3.5 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {latestHistorical.treasury10Y.toFixed(2)}%
                </span>
                <span className="text-xs text-slate-400 font-medium">Risk-Free Base</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Foundational sovereign discount rate setting the baseline for mortgages
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Mortgage Basis Spread</span>
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {latestHistorical.mortgageSpreadBps} bps
                </span>
                <span className="text-xs text-amber-500 font-semibold font-mono">+70 bps vs norm</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Spread over 10Y Treasuries elevated by Fed MBS runoff and volatility
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Lock-in "Golden Handcuffs"</span>
                <Lock className="h-3.5 w-3.5 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  +{overview.lockInSpreadPct.toFixed(2)}%
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (Eff: {latestHistorical.effectiveMortgageRate.toFixed(2)}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Spread between new market rate and effective rate on existing debt
              </p>
            </div>
          </div>

          {/* Mortgage Rate vs 10Y Treasury & Mortgage Spread Chart */}
          <div className="apple-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  30-Year Mortgage Rate vs 10-Year Treasury &amp; Basis Spread
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Illustrates the primary transmission mechanism of bond yields into real borrowing costs and the MBS spread blowout.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>30Y Mortgage Rate (%)</span>
                </span>
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>10Y Treasury Yield (%)</span>
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredSeries} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                  <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickLine={false} />
                  <YAxis
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                    domain={[0, 18]}
                    ticks={[2, 4, 6, 8, 10, 12, 14, 16, 18]}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="mortgageRate30Y"
                    name="30Y Mortgage Rate"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#0284c7' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="treasury10Y"
                    name="10Y Treasury Yield"
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rate Lock-in Mechanism Deep Dive */}
          <div className="apple-card p-6 space-y-4 border border-rose-500/20 bg-gradient-to-r from-rose-500/[0.02] to-transparent">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                The "Golden Handcuffs" Supply Freeze: Anatomy of the Rate Lock-in
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-white/[0.08] space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Existing Locked-in Cohort</span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {latestHistorical.effectiveMortgageRate.toFixed(2)}%
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Average rate on existing outstanding US residential debt. Over 82% of existing mortgages are locked below 5.0%, with tens of millions locked in at sub-3.5% from 2020–2021.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-white/[0.08] space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>New Origination Rate</span>
                </div>
                <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                  {latestHistorical.mortgageRate30Y.toFixed(2)}%
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Prevailing market rate for buyers today. Moving to a new home at the same price results in an immediate +70% surge in monthly debt servicing obligations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-white/[0.08] space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Macroeconomic Distortion</span>
                </div>
                <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                  +{overview.lockInSpreadPct.toFixed(2)}%
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  The rate differential discourages homeowners from listing their properties. This artificial secondary inventory shortage holds nominal home prices high despite high mortgage rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Real Home Price Indices (Case-Shiller Deflated by CPI) */}
      {activeView === 'real_prices' && (
        <div className="space-y-6">
          {/* Key Inflation & Real Price Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Nominal Case-Shiller Index</span>
                <TrendingUp className="h-3.5 w-3.5 text-sky-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {latestHistorical.nominalCaseShiller.toFixed(1)}
                </span>
                <span className="text-xs text-emerald-500 font-semibold font-mono">
                  All-Time High
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Nominal home prices up +236.5% since Jan 2000 base (100)
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Consumer Price Index (CPI)</span>
                <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {latestHistorical.cpiIndex.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-mono">+92.1% Inflation</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Cumulative general consumer inflation deflating property purchasing power
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Real Case-Shiller (Deflated)</span>
                <ShieldAlert className="h-3.5 w-3.5 text-purple-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {latestHistorical.realCaseShiller.toFixed(1)}
                </span>
                <span className="text-xs text-purple-500 font-semibold font-mono">
                  +75.2% Real Gain
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                True purchasing power after stripping out 25 years of fiat currency debasement
              </p>
            </div>

            <div className="apple-card p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Real Delta from 2024 ATH</span>
                <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                  {overview.realPriceAllTimeHighDeltaPct.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400 font-mono">Plateauing</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Real property appreciation has stalled as cumulative inflation eroded purchasing power
              </p>
            </div>
          </div>

          {/* Nominal vs Real Home Price Chart */}
          <div className="apple-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Nominal Case-Shiller vs Real (CPI-Deflated) Home Prices (2000 = 100)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Disentangling genuine property purchasing power gains from monetary fiat dilution.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>Nominal Case-Shiller</span>
                </span>
                <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>CPI Index (Inflation)</span>
                </span>
                <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Real Case-Shiller</span>
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredSeries} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                  <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickLine={false} />
                  <YAxis
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                    domain={[40, 360]}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <ReferenceLine
                    y={100}
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    strokeDasharray="3 3"
                    label={{
                      value: '2000 Baseline (100)',
                      position: 'insideBottomLeft',
                      fill: isDark ? '#94a3b8' : '#64748b',
                      fontSize: 10,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="nominalCaseShiller"
                    name="Nominal Case-Shiller"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#0284c7' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cpiIndex"
                    name="CPI Inflation Index"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2, fill: '#f43f5e' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="realCaseShiller"
                    name="Real Case-Shiller (Deflated)"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#a855f7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: Cross-Country Global Real Estate Dynamics */}
      {activeView === 'global' && (
        <div className="space-y-6">
          {/* Country Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
            {(Object.keys(REGIONAL_HOUSING_PROFILES) as HousingRegionId[]).map((regId) => {
              const reg = REGIONAL_HOUSING_PROFILES[regId];
              const isSelected = selectedCountry === regId;

              return (
                <button
                  key={regId}
                  onClick={() => setSelectedCountry(regId)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{reg.flag}</span>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {reg.regionId}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {reg.name}
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {reg.benchmarkMortgageRate.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Price/Inc: {reg.priceToIncomeRatio.toFixed(1)}x
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Country Profile Card */}
          <div className="apple-card p-6 space-y-5 border border-slate-200 dark:border-white/[0.10]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeProfile.flag}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeProfile.name} Real Estate Profile
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Structure: <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{activeProfile.mortgageStructure.replace('_', ' ')}</span></span>
                    <span>•</span>
                    <span>Transmission Speed: <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{activeProfile.rateTransmissionSpeed.replace('_', ' ')}</span></span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-xs font-semibold">
                <span>Benchmark:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {activeProfile.benchmarkMortgageRate.toFixed(2)}%
                </span>
                <span className="text-slate-400">({activeProfile.benchmarkRateLabel})</span>
              </div>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05] space-y-1">
                <span className="text-slate-500 dark:text-slate-400">Price-to-Income Ratio</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {activeProfile.priceToIncomeRatio.toFixed(2)}x
                </div>
                <span className="text-[10px] text-slate-400">Years of median gross income</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05] space-y-1">
                <span className="text-slate-500 dark:text-slate-400">Housing Affordability (HAI)</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {activeProfile.hai.toFixed(1)}
                </div>
                <span className={`text-[10px] font-bold ${activeProfile.hai < 100 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {activeProfile.hai < 100 ? 'Deficit territory' : 'Affordable equilibrium'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05] space-y-1">
                <span className="text-slate-500 dark:text-slate-400">Household Debt to GDP</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {activeProfile.householdDebtToGdpPct.toFixed(1)}%
                </div>
                <span className="text-[10px] text-slate-400">Consumer leverage burden</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05] space-y-1">
                <span className="text-slate-500 dark:text-slate-400">Homeownership Rate</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {activeProfile.homeownershipRatePct.toFixed(1)}%
                </div>
                <span className="text-[10px] text-slate-400">Owner-occupied share</span>
              </div>
            </div>

            {/* Macro Transmission Mechanism Deep Dive */}
            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                <Info className="h-4 w-4 text-sky-500" />
                <span>Central Bank Policy Transmission Mechanism</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {activeProfile.macroTransmissionNote}
              </p>
            </div>
          </div>

          {/* Cross-Country Comparison Table */}
          <div className="apple-card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              G7 &amp; Developed Market Housing Comparison Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 font-semibold">Country</th>
                    <th className="py-2.5 px-3 font-semibold">Benchmark Rate</th>
                    <th className="py-2.5 px-3 font-semibold">Rate Structure</th>
                    <th className="py-2.5 px-3 font-semibold">Transmission Speed</th>
                    <th className="py-2.5 px-3 font-semibold">Price-to-Income</th>
                    <th className="py-2.5 px-3 font-semibold">HAI</th>
                    <th className="py-2.5 px-3 font-semibold">Household Debt/GDP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {Object.values(REGIONAL_HOUSING_PROFILES).map((prof) => (
                    <tr
                      key={prof.regionId}
                      onClick={() => setSelectedCountry(prof.regionId)}
                      className={`hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer transition-colors ${
                        selectedCountry === prof.regionId ? 'bg-emerald-500/[0.06] font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 flex items-center gap-2 text-slate-900 dark:text-white">
                        <span>{prof.flag}</span>
                        <span>{prof.name}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {prof.benchmarkMortgageRate.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 capitalize">
                        {prof.benchmarkRateLabel}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prof.rateTransmissionSpeed === 'rapid'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : prof.rateTransmissionSpeed === 'moderate'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          }`}
                        >
                          {prof.rateTransmissionSpeed.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {prof.priceToIncomeRatio.toFixed(1)}x
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">
                        <span className={prof.hai < 85 ? 'text-rose-500' : prof.hai < 100 ? 'text-amber-500' : 'text-emerald-500'}>
                          {prof.hai.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {prof.householdDebtToGdpPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Active Macro Alerts & Institutional Intelligence Strip */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          <span>Active Real Estate &amp; Mortgage Regime Alerts</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {telemetry.activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                alert.level === 'CRITICAL'
                  ? 'border-rose-500/30 bg-rose-500/[0.06] text-rose-900 dark:text-rose-200'
                  : alert.level === 'WARNING'
                  ? 'border-amber-500/30 bg-amber-500/[0.06] text-amber-900 dark:text-amber-200'
                  : alert.level === 'BENIGN'
                  ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-900 dark:text-emerald-200'
                  : 'border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] text-slate-800 dark:text-slate-300'
              }`}
            >
              <div className="font-bold">{alert.headline}</div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                {alert.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
