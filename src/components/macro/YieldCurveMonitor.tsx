'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  SOVEREIGN_YIELD_CURVES,
  HISTORICAL_YIELD_SPREADS,
  calculateRecessionProbability,
} from '../../data/yield-curve-data';
import { formatPercent } from '../../lib/formatters';
import { useThemeMode } from '../../context/AppContext';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Percent,
  TrendingDown,
  Info,
  Calendar,
} from 'lucide-react';

export function YieldCurveMonitor() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [selectedSovereign, setSelectedSovereign] = useState<'USA' | 'DEU' | 'JPN' | 'GBR'>('USA');
  const [activeTab, setActiveTab] = useState<'term-structure' | 'historical-spreads'>('term-structure');

  const curveData =
    SOVEREIGN_YIELD_CURVES.find((c) => c.sovereignCode === selectedSovereign) ||
    SOVEREIGN_YIELD_CURVES[0];

  // Merge current curve, 1Y ago, and pre-inversion into unified data points for Recharts
  const mergedCurveData = curveData.currentCurve.map((point, index) => {
    const oneYearAgo = curveData.curveOneYearAgo[index]?.yieldPercent ?? null;
    const preInversion = curveData.curvePreInversion?.[index]?.yieldPercent ?? null;
    return {
      tenor: point.tenor,
      current: point.yieldPercent,
      oneYearAgo,
      preInversion,
    };
  });

  const getShapeBadge = (shape: string) => {
    switch (shape) {
      case 'inverted':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
          text: 'Inverted (Recession Warning)',
        };
      case 'steepening':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
          text: 'Un-Inverting (Late-Cycle Tipping Point)',
        };
      case 'flat':
        return {
          bg: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/30',
          text: 'Flat Curve (Tightening Momentum)',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
          text: 'Normal Upward Slope',
        };
    }
  };

  const shapeBadge = getShapeBadge(curveData.curveShape);

  return (
    <div className="apple-card p-5 sm:p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/25">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Sovereign Yield Curve &amp; Inversion Monitor
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${shapeBadge.bg}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {shapeBadge.text}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Monitor the benchmark sovereign term structure across maturities from 1 Month to 30 Years. An inverted yield curve (where short-term yields exceed long-term yields) has preceded every modern US recession since 1955.
          </p>
        </div>

        {/* View Switcher and Sovereign Selector */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Sovereign pills */}
          <div className="flex rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
            {SOVEREIGN_YIELD_CURVES.map((s) => (
              <button
                key={s.sovereignCode}
                onClick={() => setSelectedSovereign(s.sovereignCode)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                  selectedSovereign === s.sovereignCode
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <span>{s.flag}</span>
                <span>{s.sovereignCode}</span>
              </button>
            ))}
          </div>

          {/* Mode switch */}
          <div className="flex rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
            <button
              onClick={() => setActiveTab('term-structure')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeTab === 'term-structure'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Term Structure
            </button>
            <button
              onClick={() => setActiveTab('historical-spreads')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeTab === 'historical-spreads'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              1980–2026 Spreads
            </button>
          </div>
        </div>
      </div>

      {/* KPI Status Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* 10Y - 2Y Spread */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07]">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
            10Y – 2Y Spread
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                curveData.spread10Y2Y < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {curveData.spread10Y2Y > 0 ? '+' : ''}
              {curveData.spread10Y2Y.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({(curveData.spread10Y2Y * 100).toFixed(0)} bps)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Classic institutional benchmark
          </span>
        </div>

        {/* 10Y - 3M Spread */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07]">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
            10Y – 3M Spread
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                curveData.spread10Y3M < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {curveData.spread10Y3M > 0 ? '+' : ''}
              {curveData.spread10Y3M.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({(curveData.spread10Y3M * 100).toFixed(0)} bps)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Fed preferred recession metric
          </span>
        </div>

        {/* NY Fed 12M Recession Probability */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07]">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
            12M Recession Odds (NY Fed)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                curveData.recessionProbability12M > 35
                  ? 'text-rose-600 dark:text-rose-400'
                  : curveData.recessionProbability12M > 20
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {curveData.recessionProbability12M.toFixed(1)}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Calibrated probit model estimate
          </span>
        </div>

        {/* Real Rate & Breakeven decomposition */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07]">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
            10Y Real vs Breakeven
          </span>
          <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5 flex items-center justify-between">
            <span className="text-sky-700 dark:text-sky-300">TIPS: {curveData.realYield10Y.toFixed(2)}%</span>
            <span className="text-slate-400 font-light">+</span>
            <span className="text-amber-700 dark:text-amber-300">CPI: {curveData.breakevenInflation10Y.toFixed(2)}%</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Fisher nominal yield decomposition
          </span>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'term-structure' ? (
            <LineChart
              data={mergedCurveData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'}
              />
              <XAxis
                dataKey="tenor"
                stroke={isDark ? 'rgba(255,255,255,0.45)' : '#64748b'}
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke={isDark ? 'rgba(255,255,255,0.45)' : '#64748b'}
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(10, 10, 15, 0.95)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(15, 23, 42, 0.12)',
                  borderRadius: '12px',
                  boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(15, 23, 42, 0.08)',
                  fontSize: '12px',
                  color: isDark ? '#ffffff' : '#0f172a',
                }}
                formatter={(val: any) => [`${Number(val).toFixed(2)}%`]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(val) => (
                  <span className="text-xs text-slate-600 dark:text-slate-300 capitalize font-medium">{val}</span>
                )}
              />
              <Line
                name="Current Par Curve (2026)"
                type="monotone"
                dataKey="current"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0284c7' }}
                activeDot={{ r: 6 }}
              />
              <Line
                name="One Year Ago"
                type="monotone"
                dataKey="oneYearAgo"
                stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              {curveData.curvePreInversion && (
                <Line
                  name="Pre-Tightening (ZIRP Baseline)"
                  type="monotone"
                  dataKey="preInversion"
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                />
              )}
            </LineChart>
          ) : (
            <LineChart
              data={HISTORICAL_YIELD_SPREADS}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'}
              />
              <XAxis
                dataKey="year"
                stroke={isDark ? 'rgba(255,255,255,0.45)' : '#64748b'}
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke={isDark ? 'rgba(255,255,255,0.45)' : '#64748b'}
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(10, 10, 15, 0.95)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(15, 23, 42, 0.12)',
                  borderRadius: '12px',
                  boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(15, 23, 42, 0.08)',
                  fontSize: '12px',
                  color: isDark ? '#ffffff' : '#0f172a',
                }}
                formatter={(val: any) => [`${Number(val).toFixed(2)}%`]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(val) => (
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{val}</span>
                )}
              />
              <ReferenceLine
                y={0}
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{
                  value: 'Inversion Threshold (0.0%)',
                  fill: '#f43f5e',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Line
                name="10Y – 2Y Spread"
                type="monotone"
                dataKey="us10Y2YSpread"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                name="10Y – 3M Spread"
                type="monotone"
                dataKey="us10Y3MSpread"
                stroke="#d97706"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 2 }}
              />
              <Line
                name="10Y Real TIPS Yield"
                type="monotone"
                dataKey="us10YRealTIPS"
                stroke="#059669"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Sovereign Context Footer */}
      <div className="rounded-xl p-3.5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900 dark:text-white">
            {curveData.flag} {curveData.name} Macro Transmission:
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{curveData.summary}</p>
        </div>
      </div>
    </div>
  );
}
