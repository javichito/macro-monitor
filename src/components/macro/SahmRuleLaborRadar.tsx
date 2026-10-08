'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  SOVEREIGN_LABOR_PROFILES,
  HISTORICAL_PHILLIPS_CURVE_POINTS,
  US_LABOR_HISTORY,
  classifySahmStatus,
} from '../../data/labor-market-data';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import {
  Users,
  AlertOctagon,
  TrendingUp,
  Percent,
  Activity,
  Briefcase,
  Scale,
  Info,
} from 'lucide-react';

export function SahmRuleLaborRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('USA');
  const [activeEra, setActiveEra] = useState<'all' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s'>('2020s');
  const [activeView, setActiveView] = useState<'sahm-gauge' | 'phillips-curve'>('sahm-gauge');

  const laborProfile =
    SOVEREIGN_LABOR_PROFILES.find((p) => p.countryCode === selectedCountryCode) ||
    SOVEREIGN_LABOR_PROFILES[0];

  const filteredPhillipsPoints =
    activeEra === 'all'
      ? HISTORICAL_PHILLIPS_CURVE_POINTS
      : HISTORICAL_PHILLIPS_CURVE_POINTS.filter((p) => p.era === activeEra);

  const getStatusBadge = (status: 'tranquil' | 'elevated' | 'triggered') => {
    switch (status) {
      case 'triggered':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
          text: 'Sahm Rule Triggered (Recession Started)',
        };
      case 'elevated':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
          text: 'Elevated (Pre-Recession Warning Zone)',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
          text: 'Tranquil (Labor Market Expanding)',
        };
    }
  };

  const statusBadge = getStatusBadge(laborProfile.sahmStatus);

  // Calculate position percentage for horizontal Sahm Rule gauge (0 to 1.00 scale)
  const gaugePercent = Math.min(Math.max((laborProfile.sahmValue / 1.0) * 100, 2), 98);

  return (
    <div className="apple-card p-5 sm:p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Labor Market Health &amp; Claudia Sahm Recession Radar
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge.bg}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {statusBadge.text}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
            The Claudia Sahm Rule triggers when the 3-month average unemployment rate rises by +0.50% above its 12-month low. It has correctly signaled every US recession since 1950 with zero false positives.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Sovereign Pills */}
          <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs max-w-xl">
            {SOVEREIGN_LABOR_PROFILES.map((p) => (
              <button
                key={p.countryCode}
                onClick={() => setSelectedCountryCode(p.countryCode)}
                title={`${p.countryName} (${p.countryCode})`}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                  selectedCountryCode === p.countryCode
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <span>{p.flag}</span>
                <span>{p.countryCode}</span>
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
            <button
              onClick={() => setActiveView('sahm-gauge')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeView === 'sahm-gauge'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Sahm &amp; Labor Stack
            </button>
            <button
              onClick={() => setActiveView('phillips-curve')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeView === 'phillips-curve'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Phillips Curve
            </button>
          </div>

          {/* One-click Data Export for Researchers & Journalists */}
          <DataExportMenu
            title={`Labor Market & Claudia Sahm Recession Radar [${laborProfile.countryName} - ${
              activeView === 'sahm-gauge' ? 'Sahm Rule Indicator History' : 'Phillips Curve Coordinates'
            }]`}
            filename={`labor-market-sahm-${laborProfile.countryCode.toLowerCase()}-${activeView}`}
            data={() =>
              activeView === 'sahm-gauge'
                ? US_LABOR_HISTORY.map((h) => ({
                    year: h.year,
                    unemploymentRatePercent: h.unemploymentRate,
                    underemploymentRatePercent: h.underemploymentRate,
                    laborForceParticipationPercent: h.laborForceParticipation,
                    sahmIndicatorDeltaPercent: h.sahmIndicatorValue,
                    sahmTriggered: h.sahmTriggered ? 'Yes' : 'No',
                    jobOpeningsPerUnemployedRatio: h.jobOpeningsPerUnemployed,
                    wageGrowthYoyPercent: h.wageGrowthYoy,
                    productivityGrowthYoyPercent: h.productivityGrowthYoy,
                  }))
                : filteredPhillipsPoints.map((p) => ({
                    year: p.year,
                    era: p.era,
                    unemploymentRatePercent: p.unemployment,
                    inflationRatePercent: p.inflation,
                    macroMilestone: p.note,
                  }))
            }
            columns={
              activeView === 'sahm-gauge'
                ? [
                    { key: 'year', label: 'Year' },
                    { key: 'unemploymentRatePercent', label: 'Unemployment Rate (%)' },
                    { key: 'underemploymentRatePercent', label: 'Underemployment U-6 (%)' },
                    { key: 'laborForceParticipationPercent', label: 'Labor Force Participation (%)' },
                    { key: 'sahmIndicatorDeltaPercent', label: 'Claudia Sahm Indicator (% pts)' },
                    { key: 'sahmTriggered', label: 'Sahm Rule Triggered (≥ 0.50%)' },
                    { key: 'jobOpeningsPerUnemployedRatio', label: 'Job Openings per Jobseeker (Ratio)' },
                    { key: 'wageGrowthYoyPercent', label: 'Wage Growth YoY (%)' },
                    { key: 'productivityGrowthYoyPercent', label: 'Labor Productivity YoY (%)' },
                  ]
                : [
                    { key: 'year', label: 'Year' },
                    { key: 'era', label: 'Decade Era' },
                    { key: 'unemploymentRatePercent', label: 'Unemployment Rate (%)' },
                    { key: 'inflationRatePercent', label: 'CPI Inflation Rate (%)' },
                    { key: 'macroMilestone', label: 'Macro Regime Context' },
                  ]
            }
            metadata={{
              description:
                activeView === 'sahm-gauge'
                  ? 'High-frequency labor dynamics and the Claudia Sahm 0.50% recession inflection rule.'
                  : 'Empirical Phillips Curve trade-off between unemployment and inflation across economic eras.',
              source: 'Bureau of Labor Statistics (BLS), Federal Reserve Bank of St. Louis (FRED)',
              country: laborProfile.countryName,
              countryCode: laborProfile.countryCode,
              activeView,
              eraFilter: activeView === 'phillips-curve' ? activeEra : undefined,
            }}
          />
        </div>
      </div>

      {activeView === 'sahm-gauge' ? (
        <>
          {/* Sahm Indicator Meter */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                  Claudia Sahm Recession Threshold Meter
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 block">
                  Current Delta: +{laborProfile.sahmValue.toFixed(2)}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Critical Tipping Point</span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400">+0.50%</span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="relative w-full h-4 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden border border-slate-300 dark:border-white/[0.10]">
              {/* Threshold indicator line at 50% mark */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-rose-500 z-10" />

              {/* Progress Fill */}
              <div
                style={{ width: `${gaugePercent}%` }}
                className={`h-full transition-all duration-500 rounded-full ${
                  laborProfile.sahmValue >= 0.5
                    ? 'bg-rose-500'
                    : laborProfile.sahmValue >= 0.3
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>0.00% (Trough Minimum)</span>
              <span className="text-amber-600 dark:text-amber-300 font-medium">0.30% (Warning)</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">0.50% (Recession Trigger)</span>
              <span>1.00%+</span>
            </div>
          </div>

          {/* Primary Labor Indicator Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Headline Unemployment (U-3) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07]">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
                Headline Unemployment
              </span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {laborProfile.currentUnemployment.toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                12M Low: {laborProfile.unemployment12mLow.toFixed(1)}%
              </span>
            </div>

            {/* Labor Force Participation */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07]">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
                Participation (LFPR)
              </span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {laborProfile.historicalSeries[laborProfile.historicalSeries.length - 1]
                  ?.laborForceParticipation ?? 62.6}%
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Prime-age workforce engagement
              </span>
            </div>

            {/* JOLTS V/U Ratio */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07]">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
                Job Openings per Jobseeker
              </span>
              <div className="text-xl sm:text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {laborProfile.historicalSeries[laborProfile.historicalSeries.length - 1]
                  ?.jobOpeningsPerUnemployed.toFixed(2) ?? '1.10'}x
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Normalized from 2.0x peak
              </span>
            </div>

            {/* Real Wage Growth vs Productivity */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07]">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
                Wage Growth YoY
              </span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                +{laborProfile.historicalSeries[laborProfile.historicalSeries.length - 1]
                  ?.wageGrowthYoy ?? 3.5}%
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Productivity: +{laborProfile.historicalSeries[laborProfile.historicalSeries.length - 1]
                  ?.productivityGrowthYoy ?? 2.1}%
              </span>
            </div>
          </div>

          {/* Historical Labor Chart */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={laborProfile.historicalSeries}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                <XAxis
                  dataKey="year"
                  stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? 'rgba(10, 10, 15, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    color: isDark ? '#fff' : '#0f172a',
                  }}
                  labelStyle={{ color: isDark ? '#fff' : '#0f172a', fontWeight: 'bold' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)}%`]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(val) => (
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                  )}
                />
                <Line
                  name="Unemployment Rate (U-3)"
                  type="monotone"
                  dataKey="unemploymentRate"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  name="Broad Underemployment (U-6)"
                  type="monotone"
                  dataKey="underemploymentRate"
                  stroke={isDark ? 'rgba(255,255,255,0.35)' : '#64748b'}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  name="Sahm Indicator Delta"
                  type="monotone"
                  dataKey="sahmIndicatorValue"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        /* Phillips Curve View */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Filter by historical macroeconomic era:
            </span>
            <div className="flex rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
              {(['all', '1980s', '1990s', '2000s', '2010s', '2020s'] as const).map((era) => (
                <button
                  key={era}
                  onClick={() => setActiveEra(era)}
                  className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                    activeEra === era
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black'
                      : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                  }`}
                >
                  {era === 'all' ? 'All Eras' : era}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                <XAxis
                  type="number"
                  dataKey="unemployment"
                  name="Unemployment Rate"
                  unit="%"
                  domain={[2, 12]}
                  stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                  fontSize={11}
                />
                <YAxis
                  type="number"
                  dataKey="inflation"
                  name="CPI Inflation Rate"
                  unit="%"
                  domain={[-1, 15]}
                  stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                  fontSize={11}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload[0]) return null;
                    const data = payload[0].payload as (typeof HISTORICAL_PHILLIPS_CURVE_POINTS)[0];
                    return (
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 text-xs shadow-xl space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Year {data.year} ({data.era})
                        </span>
                        <div className="text-slate-600 dark:text-slate-300">
                          Unemployment: <span className="font-semibold text-sky-600 dark:text-sky-400">{data.unemployment}%</span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300">
                          Inflation: <span className="font-semibold text-amber-600 dark:text-amber-400">{data.inflation}%</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1 max-w-xs">{data.note}</p>
                      </div>
                    );
                  }}
                />
                <Scatter
                  name="Observations"
                  data={filteredPhillipsPoints}
                  fill="#38bdf8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            * The traditional Phillips Curve posits an inverse trade-off between unemployment and inflation. Notice how supply-side shocks (1980 Volcker era and 2022 pandemic reopening) shift the curve upwards, while supply-chain normalization and technological productivity shift it back toward the bottom-left.
          </p>
        </div>
      )}

      {/* Explainer Footer */}
      <div className="rounded-xl p-3.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900 dark:text-white">
            Why the Claudia Sahm Rule Works:
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Unemployment does not rise linearly during economic contractions—it operates via compounding feedback loops. Once job losses cause consumer spending to contract, businesses cut more workers, turning a minor slowdown into an irreversible cascade. The 0.50% threshold marks the mathematical tipping point where this feedback loop becomes self-sustaining.
          </p>
        </div>
      </div>
    </div>
  );
}
