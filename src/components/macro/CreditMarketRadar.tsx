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
  Cell,
} from 'recharts';
import {
  CREDIT_MARKET_OVERVIEW,
  CREDIT_RATING_SPREADS,
  HISTORICAL_CREDIT_SERIES,
  SLOOS_SECTOR_BREAKDOWNS,
  getCreditStressLabel,
  getNfciRegimeLabel,
} from '../../data/credit-market-data';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import {
  ShieldAlert,
  Activity,
  TrendingDown,
  TrendingUp,
  Percent,
  Building2,
  AlertTriangle,
  Info,
  CheckCircle2,
  Layers,
  BarChart3,
  Scale,
  Sparkles,
} from 'lucide-react';

type CreditRadarView = 'oas' | 'nfci' | 'sloos' | 'tiers';

export function CreditMarketRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState<CreditRadarView>('oas');
  const [selectedRatingTier, setSelectedRatingTier] = useState<string | null>(null);

  // Sync initial tab state from URL parameters to support deep links and shared references
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('credit_view') as CreditRadarView;
    if (viewParam && ['oas', 'nfci', 'sloos', 'tiers'].includes(viewParam)) {
      setActiveView(viewParam);
    }
  }, []);

  const hyStress = useMemo(
    () => getCreditStressLabel(CREDIT_MARKET_OVERVIEW.highYieldOas.currentBps),
    []
  );

  const nfciRegime = useMemo(
    () => getNfciRegimeLabel(CREDIT_MARKET_OVERVIEW.financialConditions.currentNfci),
    []
  );

  // Format historical series for CSV/JSON exports
  const exportColumns = useMemo(
    () => [
      { key: 'date', label: 'Date' },
      { key: 'year', label: 'Year' },
      { key: 'usHighYieldOasBps', label: 'US High Yield OAS (bps)' },
      { key: 'usInvestmentGradeOasBps', label: 'US Investment Grade OAS (bps)' },
      { key: 'usBbbOasBps', label: 'US BBB OAS (bps)' },
      { key: 'us10YYieldPercent', label: 'US 10Y Treasury Yield (%)' },
      { key: 'chicagoFedNfci', label: 'Chicago Fed NFCI' },
      { key: 'nfciRiskSubindex', label: 'NFCI Risk Sub-Index' },
      { key: 'nfciCreditSubindex', label: 'NFCI Credit Sub-Index' },
      { key: 'nfciLeverageSubindex', label: 'NFCI Leverage Sub-Index' },
      { key: 'sloosNetTighteningPct', label: 'Fed SLOOS C&I Net Tightening (%)' },
      { key: 'sloosLoanDemandPct', label: 'Fed SLOOS C&I Loan Demand (%)' },
      { key: 'eventAnnotation', label: 'Macro Event / Regime' },
    ],
    []
  );

  return (
    <div id="credit-market-radar" className="space-y-6">
      {/* Top Banner & Header */}
      <div className="apple-card p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Credit &amp; Solvency Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Corporate Credit Spreads &amp; Financial Conditions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Track Option-Adjusted Spreads (OAS) across corporate credit tiers, the Chicago Fed National Financial Conditions Index (NFCI), and Federal Reserve Senior Loan Officer bank lending standards (SLOOS).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <DataExportMenu
              data={HISTORICAL_CREDIT_SERIES}
              columns={exportColumns}
              filename="credit-spreads-financial-conditions-history"
              title="Corporate Credit Spreads & Financial Conditions History (2000-2026)"
              metadata={{
                source: 'Federal Reserve Board (SLOOS), Federal Reserve Bank of Chicago (NFCI), ICE BofA (OAS)',
                methodology: 'Option-Adjusted Spreads remove embedded call option distortions to measure pure corporate default risk premiums against duration-matched Treasuries.',
              }}
            />
          </div>
        </div>

        {/* 4 Primary Hero KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.08]">
          {/* Card 1: High-Yield OAS */}
          <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] relative group">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px]">US High Yield OAS</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${hyStress.badgeClass}`}>
                {hyStress.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {CREDIT_MARKET_OVERVIEW.highYieldOas.currentBps}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">bps</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Yield: {CREDIT_MARKET_OVERVIEW.highYieldOas.effectiveYieldPct}%</span>
              <span>{CREDIT_MARKET_OVERVIEW.highYieldOas.historicalPercentile}th Percentile</span>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">
              52W Range: {CREDIT_MARKET_OVERVIEW.highYieldOas.fiftyTwoWeekLowBps} – {CREDIT_MARKET_OVERVIEW.highYieldOas.fiftyTwoWeekHighBps} bps
            </div>
          </div>

          {/* Card 2: Investment Grade & BBB Frontier */}
          <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] relative group">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Investment Grade OAS</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20">
                Tight
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {CREDIT_MARKET_OVERVIEW.investmentGradeOas.currentBps}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">bps</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Effective Yield: {CREDIT_MARKET_OVERVIEW.investmentGradeOas.effectiveYieldPct}%</span>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              BBB Frontier: <span className="font-semibold text-slate-700 dark:text-slate-300">{CREDIT_MARKET_OVERVIEW.investmentGradeOas.bbbFallenAngelSpreadBps} bps</span>
            </div>
          </div>

          {/* Card 3: Chicago Fed NFCI */}
          <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] relative group">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Chicago Fed NFCI</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${nfciRegime.badgeClass}`}>
                {nfciRegime.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {CREDIT_MARKET_OVERVIEW.financialConditions.currentNfci > 0 ? `+${CREDIT_MARKET_OVERVIEW.financialConditions.currentNfci.toFixed(2)}` : CREDIT_MARKET_OVERVIEW.financialConditions.currentNfci.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">(0.0 = Avg)</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Risk: {CREDIT_MARKET_OVERVIEW.financialConditions.riskSubindex}</span>
              <span>Credit: {CREDIT_MARKET_OVERVIEW.financialConditions.creditSubindex}</span>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">
              Adjusted NFCI: {CREDIT_MARKET_OVERVIEW.financialConditions.adjustedNfci.toFixed(2)}
            </div>
          </div>

          {/* Card 4: Fed SLOOS Bank Tightening */}
          <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] relative group">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Fed SLOOS Net Tightening</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                Neutralizing
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                +{CREDIT_MARKET_OVERVIEW.bankLending.currentNetTighteningPct}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">C&amp;I Net</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Loan Demand: +{CREDIT_MARKET_OVERVIEW.bankLending.cAndIDemandNetPct}%</span>
            </div>
            <div className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              CRE Tightening: +{CREDIT_MARKET_OVERVIEW.bankLending.creTighteningPct}%
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar pb-1">
        <div className="inline-flex items-center gap-1.5 rounded-2xl p-1.5 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] shadow-inner text-xs">
          <button
            onClick={() => setActiveView('oas')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-semibold transition-all cursor-pointer ${
              activeView === 'oas'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-rose-500" />
            <span>Credit Spreads (OAS)</span>
          </button>
          <button
            onClick={() => setActiveView('nfci')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-semibold transition-all cursor-pointer ${
              activeView === 'nfci'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-cyan-500" />
            <span>Financial Conditions (NFCI)</span>
          </button>
          <button
            onClick={() => setActiveView('sloos')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-semibold transition-all cursor-pointer ${
              activeView === 'sloos'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-amber-500" />
            <span>Bank Lending (SLOOS)</span>
          </button>
          <button
            onClick={() => setActiveView('tiers')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-semibold transition-all cursor-pointer ${
              activeView === 'tiers'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-purple-500" />
            <span>Rating Tier Matrix</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>Range: 2000–2026</span>
        </div>
      </div>

      {/* View 1: Credit Spreads (OAS vs Treasuries) */}
      {activeView === 'oas' && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Multi-Decade Option-Adjusted Spread Trajectory</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparing High Yield risk premium (ICE BofA US HY OAS) vs. Investment Grade and US 10-Year Treasury Yields.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] text-rose-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span> High Yield OAS
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-sky-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span> IG OAS
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span> 10Y Yield (x100)
              </span>
            </div>
          </div>

          <div className="h-80 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_CREDIT_SERIES} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  unit=" bps"
                  domain={[0, 2400]}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const stress = getCreditStressLabel(data.usHighYieldOasBps);
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[220px]">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">{label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stress.badgeClass}`}>
                              {stress.label}
                            </span>
                          </div>
                          <div className="space-y-1 pt-1 font-mono">
                            <div className="flex justify-between text-rose-500 font-semibold">
                              <span>US High Yield OAS:</span>
                              <span>{data.usHighYieldOasBps} bps</span>
                            </div>
                            <div className="flex justify-between text-sky-500 font-semibold">
                              <span>US Investment Grade:</span>
                              <span>{data.usInvestmentGradeOasBps} bps</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-300">
                              <span>BBB Spread:</span>
                              <span>{data.usBbbOasBps} bps</span>
                            </div>
                            <div className="flex justify-between text-amber-500 font-semibold">
                              <span>US 10Y Benchmark:</span>
                              <span>{data.us10YYieldPercent}%</span>
                            </div>
                          </div>
                          {data.eventAnnotation && (
                            <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 italic font-sans">
                              {data.eventAnnotation}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Critical Stress Thresholds */}
                <ReferenceLine
                  y={550}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Elevated Distress (550 bps)',
                    fill: '#f59e0b',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />
                <ReferenceLine
                  y={800}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Systemic Crisis (800 bps)',
                    fill: '#ef4444',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="usHighYieldOasBps"
                  name="High Yield OAS"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f43f5e' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="usInvestmentGradeOasBps"
                  name="Investment Grade OAS"
                  stroke="#0ea5e9"
                  strokeWidth={1.75}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Contextual Guidance Callout */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="h-4 w-4 text-sky-500" />
              <span>Macro Signal: Why is High Yield OAS compressed while Policy Rates remain high?</span>
            </div>
            <p>
              In historical tightening cycles, Fed rate hikes typically force corporate credit spreads wider as debt service ratios escalate. In the 2024–2026 regime, US High Yield OAS compressed to ~318 bps because corporations aggressively termed out their debt in 2020–2021 at sub-4% fixed coupons, corporate cash balances remain elevated, and the surge of institutional <strong>Private Credit ($1.7T+)</strong> has absorbed riskier middle-market refinancings that previously triggered public bond sell-offs.
            </p>
          </div>
        </div>
      )}

      {/* View 2: Financial Conditions (Chicago Fed NFCI) */}
      {activeView === 'nfci' && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Chicago Fed National Financial Conditions Index (NFCI)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Synthesizes 105 indicators of financial activity across money markets, debt, equity, and banking. 0.0 is the long-term baseline.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Headline NFCI
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-rose-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span> Risk Sub-Index
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-sky-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span> Credit Sub-Index
              </span>
            </div>
          </div>

          <div className="h-80 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_CREDIT_SERIES} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  domain={[-1.2, 4.0]}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const regime = getNfciRegimeLabel(data.chicagoFedNfci);
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[220px]">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">{label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${regime.badgeClass}`}>
                              {regime.label}
                            </span>
                          </div>
                          <div className="space-y-1 pt-1 font-mono">
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                              <span>Headline NFCI:</span>
                              <span>{data.chicagoFedNfci.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-rose-500 font-semibold">
                              <span>Risk Sub-Index:</span>
                              <span>{data.nfciRiskSubindex.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sky-500 font-semibold">
                              <span>Credit Sub-Index:</span>
                              <span>{data.nfciCreditSubindex.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-purple-500 font-semibold">
                              <span>Leverage Sub-Index:</span>
                              <span>{data.nfciLeverageSubindex.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* 0.0 Equilibrium Baseline */}
                <ReferenceLine
                  y={0.0}
                  stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}
                  strokeWidth={1.5}
                  label={{
                    value: 'Historical Average Equilibrium (0.0)',
                    fill: isDark ? '#cbd5e1' : '#475569',
                    fontSize: 10,
                    position: 'insideBottomRight',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="chicagoFedNfci"
                  name="Headline NFCI"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="nfciRiskSubindex"
                  name="Risk Sub-Index"
                  stroke="#f43f5e"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="nfciCreditSubindex"
                  name="Credit Sub-Index"
                  stroke="#0ea5e9"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sub-Index Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 block">Risk Sub-Index</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                {CREDIT_MARKET_OVERVIEW.financialConditions.riskSubindex}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Gauges volatility and funding risk across equities and interbank markets. Deep negative reading signals placid market liquidity.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-500 block">Credit Sub-Index</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                {CREDIT_MARKET_OVERVIEW.financialConditions.creditSubindex}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Measures availability and borrowing constraints across commercial paper, municipal debt, and syndicated loans.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-500 block">Leverage Sub-Index</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                {CREDIT_MARKET_OVERVIEW.financialConditions.leverageSubindex}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Captures debt relative to equity valuations. Rising equity market capitalizations mechanically lower financial leverage ratios.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Bank Lending Standards (Fed SLOOS) */}
      {activeView === 'sloos' && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Federal Reserve SLOOS: Bank Underwriting &amp; Credit Demand</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Senior Loan Officer Opinion Survey net percentage of domestic banks tightening standards vs. reporting stronger loan demand.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span> Net Tightening Standards (%)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-sky-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span> Net Loan Demand (%)
              </span>
            </div>
          </div>

          <div className="h-80 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HISTORICAL_CREDIT_SERIES} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  unit="%"
                  domain={[-60, 100]}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
                          <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-1.5">
                            {label}
                          </div>
                          <div className="space-y-1 pt-1 font-mono">
                            <div className="flex justify-between text-amber-500 font-semibold">
                              <span>Net Tightening:</span>
                              <span>{data.sloosNetTighteningPct > 0 ? `+${data.sloosNetTighteningPct}%` : `${data.sloosNetTighteningPct}%`}</span>
                            </div>
                            <div className="flex justify-between text-sky-500 font-semibold">
                              <span>Loan Demand:</span>
                              <span>{data.sloosLoanDemandPct > 0 ? `+${data.sloosLoanDemandPct}%` : `${data.sloosLoanDemandPct}%`}</span>
                            </div>
                          </div>
                          {data.eventAnnotation && (
                            <div className="mt-2 pt-1 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                              {data.eventAnnotation}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={0}
                  stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                  strokeWidth={1.5}
                />
                <ReferenceLine
                  y={40}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Recessionary Credit Freeze Threshold (+40%)',
                    fill: '#ef4444',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />
                <Bar dataKey="sloosNetTighteningPct" name="Net Tightening Standards (%)">
                  {HISTORICAL_CREDIT_SERIES.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.sloosNetTighteningPct > 35 ? '#ef4444' : entry.sloosNetTighteningPct > 10 ? '#f59e0b' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Granular Sector Breakdown List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Lending Conditions by Asset Class
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {SLOOS_SECTOR_BREAKDOWNS.map((sec) => (
                <div
                  key={sec.sectorId}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">{sec.sectorName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        sec.status === 'severe_tightening'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          : sec.status === 'tightening'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {sec.status === 'severe_tightening' ? 'Severe Defense' : sec.status === 'tightening' ? 'Tightening' : 'Neutral / Liquid'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-300">
                      Tightening: <strong className="text-slate-900 dark:text-white">+{sec.netTighteningPct}%</strong>
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Demand: <strong className="text-slate-900 dark:text-white">{sec.loanDemandNetPct > 0 ? `+${sec.loanDemandNetPct}%` : `${sec.loanDemandNetPct}%`}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {sec.commentary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 4: Corporate Rating Tier Matrix & Default Risk */}
      {activeView === 'tiers' && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Corporate Credit Rating Spread &amp; Default Matrix</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current Option-Adjusted Spreads (OAS), effective yields, 12-month default rates, and debt market shares across credit rating tiers.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Benchmark: US 10Y Yield at 4.19%</span>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Rating Tier</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">OAS (bps)</th>
                  <th className="py-3 px-3 text-right">Yield (%)</th>
                  <th className="py-3 px-3 text-right">10Y Delta</th>
                  <th className="py-3 px-3 text-right">Default Rate (12M)</th>
                  <th className="py-3 px-3 text-right">Market Share</th>
                  <th className="py-3 px-4">Credit Profile &amp; Risk Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {CREDIT_RATING_SPREADS.map((tier) => {
                  const isBbb = tier.tier === 'BBB';
                  const isCcc = tier.tier === 'CCC_LOWER';
                  return (
                    <tr
                      key={tier.tier}
                      className={`transition-colors ${
                        isBbb
                          ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.06]'
                          : isCcc
                          ? 'bg-rose-500/[0.04] dark:bg-rose-500/[0.06]'
                          : 'hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{tier.label}</span>
                        {isBbb && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold uppercase">
                            Fallen Angel Border
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            tier.category === 'Investment Grade'
                              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
                              : tier.category === 'High Yield'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {tier.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {tier.oasBps}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                        {tier.effectiveYieldPercent.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                        +{tier.benchmarkSpreadVs10Y.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {tier.defaultRate12mPct.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                        {tier.marketShareDebtPct}%
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed max-w-xs">
                        {tier.riskDescription}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>The "Fallen Angel" Mechanism Explained</span>
            </span>
            <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-300">
              BBB-rated corporate bonds represent <strong>51.3% of the entire US Investment Grade corporate bond universe</strong> ($4.2T+). Many institutional pension funds, insurance companies, and sovereign wealth mandates are legally prohibited from holding speculative-grade (High Yield) debt. If a macroeconomic downturn triggers mass credit downgrades from BBB to BB ("Fallen Angels"), these institutions are forced to liquidate immediately, causing massive secondary market price dislocations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
