'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
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
  MONETARY_MECHANICS_OVERVIEW,
  REGIONAL_MONETARY_PROFILES,
  HISTORICAL_VELOCITY_SERIES,
  HISTORICAL_TREASURY_ISSUANCE_SERIES,
  getLatestMonetaryMechanicsState,
  getVelocityRegimeLabel,
  getIssuanceRegimeLabel,
  simulateMonetaryMechanics,
} from '../../data/monetary-mechanics-data';
import {
  MonetaryMechanicsRegionId,
  VelocityRegimeType,
  IssuanceTiltRegime,
} from '../../lib/types';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import { ShareDeepLinkMenu } from '../common/ShareDeepLinkMenu';
import {
  deserializeMonetaryMechanics,
  useDeepLinkSync,
  MonetaryMechanicsState,
} from '../../lib/deep-link';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Layers,
  Landmark,
  ShieldAlert,
  Scale,
  Percent,
  Zap,
  Clock,
  Sliders,
  Info,
  RotateCcw,
  AlertTriangle,
  Flame,
  Globe2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

type RadarTab = 'velocity' | 'issuance' | 'regimes' | 'simulation';
type TimeWindow = 'all' | '10y' | '5y' | '3y';

export function MonetaryMechanicsRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<RadarTab>('velocity');
  const [selectedRegion, setSelectedRegion] = useState<MonetaryMechanicsRegionId>('USA');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');

  // Interactive Simulator Sliders
  const [simBillShare, setSimBillShare] = useState<number>(21.6);
  const [simVelocityDelta, setSimVelocityDelta] = useState<number>(0.0);
  const [simM2Growth, setSimM2Growth] = useState<number>(1.2);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  /*
   * Hydrate monetary mechanics state from URL parameters or hash anchors
   * to guarantee that shared bookmark links immediately restore exact inspection states.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const restored = deserializeMonetaryMechanics();
    if (restored) {
      setActiveTab(restored.view);
      setSelectedRegion(restored.region);
      if (restored.timeWindow) setTimeWindow(restored.timeWindow);
      if (restored.simBillShare !== undefined) setSimBillShare(restored.simBillShare);
      if (restored.simVelocityDelta !== undefined) setSimVelocityDelta(restored.simVelocityDelta);
      if (restored.simM2Growth !== undefined) setSimM2Growth(restored.simM2Growth);
    }
    setIsInitialized(true);
  }, []);

  /*
   * Continuously synchronize active UI selections into the browser URL bar
   * so copying the link or sharing via browser context preserves the current simulation.
   */
  const deepLinkState: MonetaryMechanicsState = useMemo(
    () => ({
      view: activeTab,
      region: selectedRegion,
      timeWindow,
      simBillShare,
      simVelocityDelta,
      simM2Growth,
    }),
    [activeTab, selectedRegion, timeWindow, simBillShare, simVelocityDelta, simM2Growth]
  );

  useDeepLinkSync('mechanics', deepLinkState, isInitialized);

  const latestStatus = useMemo(() => getLatestMonetaryMechanicsState(), []);
  const activeProfile = REGIONAL_MONETARY_PROFILES[selectedRegion];

  // Filter velocity history by time window
  const filteredVelocitySeries = useMemo(() => {
    if (timeWindow === '3y') return HISTORICAL_VELOCITY_SERIES.slice(-7);
    if (timeWindow === '5y') return HISTORICAL_VELOCITY_SERIES.slice(-11);
    if (timeWindow === '10y') return HISTORICAL_VELOCITY_SERIES.slice(-15);
    return HISTORICAL_VELOCITY_SERIES;
  }, [timeWindow]);

  // Filter issuance history by time window
  const filteredIssuanceSeries = useMemo(() => {
    if (timeWindow === '3y') return HISTORICAL_TREASURY_ISSUANCE_SERIES.slice(-6);
    if (timeWindow === '5y') return HISTORICAL_TREASURY_ISSUANCE_SERIES.slice(-9);
    return HISTORICAL_TREASURY_ISSUANCE_SERIES;
  }, [timeWindow]);

  // Dynamic simulation computation based on user slider adjustments
  const simResult = useMemo(
    () =>
      simulateMonetaryMechanics({
        billSharePct: simBillShare,
        velocityDeltaPct: simVelocityDelta,
        m2GrowthPct: simM2Growth,
      }),
    [simBillShare, simVelocityDelta, simM2Growth]
  );

  const activeVelocityRegime = useMemo(
    () => getVelocityRegimeLabel(latestStatus.usVelocityRegime),
    [latestStatus.usVelocityRegime]
  );

  const activeIssuanceRegime = useMemo(
    () => getIssuanceRegimeLabel(latestStatus.issuanceRegime),
    [latestStatus.issuanceRegime]
  );

  // Export column mapping for CSV/JSON download
  const exportVelocityColumns = useMemo(
    () => [
      { key: 'date', label: 'Quarter' },
      { key: 'nominalGdpTrillionUsd', label: 'Nominal GDP ($T)' },
      { key: 'm2MoneySupplyTrillionUsd', label: 'M2 Money Supply ($T)' },
      { key: 'velocity', label: 'M2 Velocity (V=GDP/M2)' },
      { key: 'velocityYoYPct', label: 'Velocity YoY (%)' },
      { key: 'm2GrowthYoYPct', label: 'M2 Growth YoY (%)' },
      { key: 'cpiInflationYoY', label: 'CPI Inflation YoY (%)' },
      { key: 'historicalContext', label: 'Macroeconomic Era' },
    ],
    []
  );

  const exportIssuanceColumns = useMemo(
    () => [
      { key: 'date', label: 'Quarter' },
      { key: 'tBillsOutstandingTrillionUsd', label: 'T-Bills Outstanding ($T)' },
      { key: 'couponsOutstandingTrillionUsd', label: 'Coupons Outstanding ($T)' },
      { key: 'totalMarketableDebtTrillionUsd', label: 'Total Marketable Debt ($T)' },
      { key: 'tBillSharePct', label: 'T-Bill Share (%)' },
      { key: 'tbacTargetMaxPct', label: 'TBAC Max Guideline (%)' },
      { key: 'grossIssuanceBillSharePct', label: 'Gross Issuance Bill Share (%)' },
      { key: 'estimatedTermPremiumSuppressionBps', label: 'Term Premium Suppression (bps)' },
      { key: 'tenYearYield', label: '10Y Treasury Yield (%)' },
      { key: 'onRrpBalanceTrillionUsd', label: 'ON RRP Balance ($T)' },
      { key: 'policyNote', label: 'Policy Note' },
    ],
    []
  );

  // Preset Scenario Handlers
  const applyPreset = useCallback((preset: 'qe_trap' | 'stimulus_rebound' | 'yellen_pivot' | 'coupon_wall') => {
    if (preset === 'qe_trap') {
      // 2010s QE: High M2 growth with collapsing velocity produces muted inflation
      setSimM2Growth(8.5);
      setSimVelocityDelta(-4.5);
      setSimBillShare(15.5);
    } else if (preset === 'stimulus_rebound') {
      // 2021-2022: Massive M2 growth combined with velocity acceleration unleashes high inflation
      setSimM2Growth(14.0);
      setSimVelocityDelta(5.5);
      setSimBillShare(24.0);
    } else if (preset === 'yellen_pivot') {
      // Late 2023-2024: Frontloading T-Bills to suppress 10Y term premiums
      setSimBillShare(23.5);
      setSimVelocityDelta(0.5);
      setSimM2Growth(1.5);
    } else if (preset === 'coupon_wall') {
      // Treasury forced to issue heavy 10Y-30Y coupons as RRP runs dry
      setSimBillShare(13.5);
      setSimVelocityDelta(1.0);
      setSimM2Growth(1.0);
    }
  }, []);

  return (
    <div id="monetary-mechanics" className="space-y-6">
      {/* Header Container */}
      <div className="apple-card p-6 border-l-4 border-l-purple-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              <Landmark className="h-3.5 w-3.5" />
              <span>Equation of Exchange &amp; Sovereign Issuance Plumbing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Monetary Velocity &amp; Debt Issuance Mechanics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Analyze the turnover of broad money (V = GDP / M2) to explain why trillions in central bank QE did not generate consumer inflation in the 2010s but ignited prices in 2021–2023. Track the Treasury debt maturity profile (T-Bills vs. Coupons) to evaluate Janet Yellen &apos;Shadow QE&apos; term premium suppression on 10-year sovereign bonds.
            </p>
          </div>

          {/* Action Bar: Export & Deep-Link Sharing */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <ShareDeepLinkMenu
              simulator="mechanics"
              state={deepLinkState}
              label="Share Simulation"
              variant="compact"
            />
            <DataExportMenu
              title={`Monetary Mechanics - ${activeTab === 'issuance' ? 'Treasury Issuance' : 'M2 Velocity'}`}
              filename={`monetary-${activeTab}-series`}
              data={activeTab === 'issuance' ? filteredIssuanceSeries : filteredVelocitySeries}
              columns={activeTab === 'issuance' ? exportIssuanceColumns : exportVelocityColumns}
              variant="compact"
            />
          </div>
        </div>

        {/* Vital KPI Metrics Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">M2 Velocity (V = GDP / M2):</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                {MONETARY_MECHANICS_OVERVIEW.latestUsVelocity.toFixed(3)}
              </span>
              <span className="text-[10px] font-semibold text-emerald-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                +{MONETARY_MECHANICS_OVERVIEW.usVelocityYoYDelta.toFixed(3)} YoY
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Rebounded from 1.121 Covid low
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">T-Bill Share of Marketable Debt:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400 font-mono">
                {MONETARY_MECHANICS_OVERVIEW.currentTBillSharePct.toFixed(1)}%
              </span>
              <span className="text-[10px] font-semibold text-amber-500">
                Above TBAC 20% cap
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Target Range: 15.0% – 20.0%
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Estimated Term Premium Suppression:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {MONETARY_MECHANICS_OVERVIEW.estimatedTermPremiumSuppressionBps} bps
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                on 10Y Yield
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Shadow QE via bill duration absorption
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Fed ON RRP Cash Cushion:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 font-mono">
                ${MONETARY_MECHANICS_OVERVIEW.onRrpBalanceBillion}B
              </span>
              <span className="text-[10px] font-semibold text-rose-500 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-0.5" />
                Drained 94%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Peak: $2,553B in Dec 2022
            </span>
          </div>
        </div>

        {/* Live Macro Alerts Banner */}
        {latestStatus.activeAlerts.length > 0 && (
          <div className="mt-5 space-y-2">
            {latestStatus.activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  alert.level === 'CRITICAL' || alert.level === 'WARNING'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
                    : alert.level === 'OPPORTUNITY'
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-800 dark:text-purple-300'
                      : 'bg-sky-500/10 border-sky-500/20 text-sky-800 dark:text-sky-300'
                }`}
              >
                <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold">{alert.headline}</span>
                  <p className="mt-0.5 opacity-90 leading-relaxed">{alert.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
          <button
            onClick={() => setActiveTab('velocity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'velocity'
                ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-sky-500" />
            <span>M2 Velocity &amp; Inflation (V = GDP / M2)</span>
          </button>
          <button
            onClick={() => setActiveTab('issuance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'issuance'
                ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-purple-500" />
            <span>Treasury Maturity Tilt (Shadow QE)</span>
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'simulation'
                ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-emerald-500" />
            <span>Interactive Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('regimes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'regimes'
                ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5 text-cyan-500" />
            <span>Global Sovereign Matrix</span>
          </button>
        </div>

        {/* Time Window Selector (visible on time series tabs) */}
        {(activeTab === 'velocity' || activeTab === 'issuance') && (
          <div className="flex items-center gap-1 text-xs self-start sm:self-auto">
            <span className="text-slate-500 dark:text-slate-400 mr-1 font-medium">Window:</span>
            {(['3y', '5y', '10y', 'all'] as TimeWindow[]).map((w) => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-2.5 py-1 rounded-md font-mono uppercase text-[11px] transition-all cursor-pointer ${
                  timeWindow === w
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.08]'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: M2 Velocity & Inflation Dynamics */}
      {activeTab === 'velocity' && (
        <div className="space-y-6">
          <div className="apple-card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>The Velocity Disinflation Paradox &amp; Fiscal Awakening</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${activeVelocityRegime.badgeClass}`}>
                    {activeVelocityRegime.label}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Comparing M2 Velocity turnover (V = Nominal GDP / M2) against YoY CPI inflation. Velocity explains why $3.5T+ in post-2008 QE was disinflationary (trapped in bank excess reserves), whereas 2021 direct fiscal stimulus ignited broad consumer inflation.
                </p>
              </div>
            </div>

            {/* Recharts Chart: Velocity vs CPI Inflation */}
            <div className="h-[340px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredVelocitySeries} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                  <XAxis
                    dataKey="date"
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                  />
                  {/* Left Axis: M2 Velocity */}
                  <YAxis
                    yAxisId="velocity"
                    domain={[1.0, 2.3]}
                    stroke="#8b5cf6"
                    fontSize={11}
                    tickFormatter={(v) => v.toFixed(2)}
                    label={{
                      value: 'M2 Velocity (V = GDP / M2)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#8b5cf6',
                      fontSize: 10,
                    }}
                  />
                  {/* Right Axis: CPI YoY % */}
                  <YAxis
                    yAxisId="inflation"
                    orientation="right"
                    domain={[-2, 11]}
                    stroke="#f43f5e"
                    fontSize={11}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: 'CPI YoY Inflation (%)',
                      angle: 90,
                      position: 'insideRight',
                      fill: '#f43f5e',
                      fontSize: 10,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: isDark ? '#f8fafc' : '#0f172a',
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === 'M2 Velocity') return [Number(value).toFixed(3), 'M2 Velocity (Turnover)'];
                      if (name === 'CPI Inflation') return [`${value}%`, 'Headline CPI YoY'];
                      if (name === 'Nominal GDP') return [`$${value}T`, 'Nominal GDP'];
                      if (name === 'M2 Money Supply') return [`$${value}T`, 'M2 Money Supply'];
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      const point = payload?.[0]?.payload as (typeof filteredVelocitySeries)[0];
                      return point ? `${label} — ${point.historicalContext}` : label;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mr-2">
                        {value}
                      </span>
                    )}
                  />
                  <ReferenceLine
                    yAxisId="inflation"
                    y={2.0}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{ value: 'Fed 2% Target', fill: '#10b981', fontSize: 10, position: 'right' }}
                  />
                  <ReferenceLine
                    yAxisId="velocity"
                    y={1.43}
                    stroke="#94a3b8"
                    strokeDasharray="3 3"
                    label={{ value: '2010s QE Floor (~1.43)', fill: '#94a3b8', fontSize: 9, position: 'insideTopLeft' }}
                  />
                  <Line
                    yAxisId="velocity"
                    type="monotone"
                    dataKey="velocity"
                    name="M2 Velocity"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#8b5cf6' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="inflation"
                    type="monotone"
                    dataKey="cpiInflationYoY"
                    name="CPI Inflation"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Economic Historical Narrative Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.08]">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  <Clock className="h-4 w-4" />
                  <span>2008–2019: The QE Disinflation Trap</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  The Fed expanded base money by trillions, but M2 velocity plummeted from 1.95 to 1.43. Because commercial banks parked newly minted liquidity into Interest on Reserve Balances (IORB) at the Fed, new money never entered consumer circulation, driving asset price inflation while CPI stayed sub-2%.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <Flame className="h-4 w-4" />
                  <span>2021–2023: The Fiscal Monetization Spike</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  Unlike post-GFC QE, COVID stimulus checks bypassed the banking intermediary to land directly in consumer checking accounts. As reopening unleashed rapid turnover, velocity rebounded from 1.12 to 1.34+, driving peak CPI to 9.1% via the classic Equation of Exchange ($M \times V$).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <Scale className="h-4 w-4" />
                  <span>2024–2026: Normalization &amp; Floor</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  Even as quantitative tightening (QT) trimmed broad M2 money supply, velocity consolidated firmly around 1.37. This durable floor in transaction velocity prevents a return to post-2010 zero-interest deflationary stagnation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Treasury Issuance Maturity Profile (T-Bills vs Coupons) */}
      {activeTab === 'issuance' && (
        <div className="space-y-6">
          <div className="apple-card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Treasury Debt Maturity Profile: T-Bills vs. Coupons</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${activeIssuanceRegime.badgeClass}`}>
                    {activeIssuanceRegime.label}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Tracking the ratio of short-term Treasury Bills (&lt; 1 year) vs. long-duration Notes &amp; Bonds. When the Treasury heavily tilts issuance toward short bills, it pulls idle cash from the Fed Overnight Reverse Repo Facility (ON RRP), keeping 10-year term premiums suppressed by 30–50+ bps (&apos;Shadow QE&apos;).
                </p>
              </div>
            </div>

            {/* Recharts Stacked Area Chart: Debt Breakdown */}
            <div className="h-[340px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredIssuanceSeries} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                  <XAxis
                    dataKey="date"
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                  />
                  {/* Left Axis: Debt ($T) */}
                  <YAxis
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickFormatter={(v) => `$${v}T`}
                    label={{
                      value: 'Marketable Sovereign Debt ($ Trillion)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: isDark ? '#94a3b8' : '#64748b',
                      fontSize: 10,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: isDark ? '#f8fafc' : '#0f172a',
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Treasury Bills (<1Y)') return [`$${value}T`, name];
                      if (name === 'Coupons (Notes & Bonds >=2Y)') return [`$${value}T`, name];
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      const point = payload?.[0]?.payload as (typeof filteredIssuanceSeries)[0];
                      return point
                        ? `${label} | T-Bill Share: ${point.tBillSharePct}% (Term Premium: ${point.estimatedTermPremiumSuppressionBps} bps)`
                        : label;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mr-2">
                        {value}
                      </span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="couponsOutstandingTrillionUsd"
                    name="Coupons (Notes & Bonds >=2Y)"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="tBillsOutstandingTrillionUsd"
                    name="Treasury Bills (<1Y)"
                    stackId="1"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Mechanics Explainer Cards: Why Shadow QE Works */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.08]">
              <div className="p-4 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
                  <Zap className="h-4 w-4" />
                  <span>The TBAC Guideline &amp; &apos;Shadow QE&apos; Mechanism</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  The Treasury Borrowing Advisory Committee (TBAC) recommends that Treasury Bills represent <strong>15% to 20%</strong> of marketable debt to balance rollover risk. In late 2023, faced with 10Y yields surging past 5.0%, the Treasury shifted gross issuance heavily to T-Bills (&gt;65% of auctions), pushing bill share to 21.6%. Because Money Market Funds absorbed this paper by drawing cash out of the Fed&apos;s Overnight Reverse Repo Facility (ON RRP), commercial bank reserves were insulated and term premiums on 10Y bonds were suppressed by an estimated <strong>34 to 48 bps</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  <AlertTriangle className="h-4 w-4" />
                  <span>The ON RRP Exhaustion Threshold</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  Between Dec 2022 and early 2026, the ON RRP facility collapsed from <strong>$2,553B down to ~$142B</strong>. As this buffer nears depletion, Money Market Funds can no longer finance new T-Bills by pulling idle cash from the Fed. Future bill issuance must now compete directly with commercial bank deposits, raising funding costs and shifting liquidity risk onto repo and short-term debt markets.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Interactive Monetary Mechanics Simulator */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="apple-card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-purple-500" />
                  <span>Interactive Monetary Mechanics &amp; Issuance Sandbox</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Adjust sovereign debt maturity tilts and monetary turnover parameters to calculate implied 10-Year yield term premiums, reserve drainage risks, and Equation of Exchange (M * V = P * Y) inflation pass-through.
                </p>
              </div>

              {/* Reset to baseline button */}
              <button
                onClick={() => {
                  setSimBillShare(21.6);
                  setSimVelocityDelta(0.0);
                  setSimM2Growth(1.2);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer self-start"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Baseline</span>
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="mb-6 pb-5 border-b border-slate-200 dark:border-white/[0.08]">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2 uppercase tracking-wider text-[10px]">
                Historical &amp; Macroeconomic Scenarios:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => applyPreset('qe_trap')}
                  className="px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium transition-all cursor-pointer"
                >
                  2010s QE Disinflation Trap (High M2, Collapsing Velocity)
                </button>
                <button
                  onClick={() => applyPreset('stimulus_rebound')}
                  className="px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium transition-all cursor-pointer"
                >
                  2021–2022 Fiscal Reopening (M2 Spike + Velocity Surge)
                </button>
                <button
                  onClick={() => applyPreset('yellen_pivot')}
                  className="px-3 py-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium transition-all cursor-pointer"
                >
                  The Yellen Pivot (T-Bills &gt;23%, -40 bps Term Premium)
                </button>
                <button
                  onClick={() => applyPreset('coupon_wall')}
                  className="px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium transition-all cursor-pointer"
                >
                  Coupon Duration Wall (T-Bills &lt;14%, Term Premium Spikes)
                </button>
              </div>
            </div>

            {/* Interactive Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1: T-Bill Issuance Tilt */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    T-Bill Share of Total Debt:
                  </span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    {simBillShare.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10.0"
                  max="45.0"
                  step="0.5"
                  value={simBillShare}
                  aria-label="T-Bill Share of Total Debt"
                  onChange={(e) => setSimBillShare(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10.0% (Coupon Flood)</span>
                  <span className="text-purple-500 font-bold">TBAC 15-20%</span>
                  <span>45.0% (Shadow QE)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Share of short-term bills vs. 10Y-30Y duration bonds issued by Treasury.
                </p>
              </div>

              {/* Slider 2: M2 Money Supply YoY Growth */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    M2 Money Supply Growth (YoY):
                  </span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                    {simM2Growth >= 0 ? `+${simM2Growth.toFixed(1)}%` : `${simM2Growth.toFixed(1)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-8.0"
                  max="25.0"
                  step="0.5"
                  value={simM2Growth}
                  aria-label="M2 Money Supply Growth YoY"
                  onChange={(e) => setSimM2Growth(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-8.0% (Severe QT)</span>
                  <span className="text-sky-500 font-bold">0%</span>
                  <span>+25.0% (Stimulus Surge)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Rate of expansion or contraction in commercial bank deposits &amp; currency.
                </p>
              </div>

              {/* Slider 3: Velocity YoY Change */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Velocity YoY Delta (V = GDP / M2):
                  </span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    {simVelocityDelta >= 0 ? `+${simVelocityDelta.toFixed(1)}%` : `${simVelocityDelta.toFixed(1)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-15.0"
                  max="15.0"
                  step="0.5"
                  value={simVelocityDelta}
                  aria-label="Velocity YoY Delta"
                  onChange={(e) => setSimVelocityDelta(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-15.0% (Lockdown Drop)</span>
                  <span className="text-rose-500 font-bold">0% (Stable)</span>
                  <span>+15.0% (Rapid Turnover)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Rate at which money circulates across physical purchases in the real economy.
                </p>
              </div>
            </div>

            {/* Simulation Diagnostic Output Cards */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 block">
                  Term Premium Effect
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-purple-700 dark:text-purple-300 mt-1 block">
                  {simResult.termPremiumSuppressionBps >= 0 ? `+${simResult.termPremiumSuppressionBps}` : simResult.termPremiumSuppressionBps} bps
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
                  Simulated 10Y Yield: <strong className="text-slate-900 dark:text-white">{simResult.simulated10YYield.toFixed(2)}%</strong>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 block">
                  Implied Nominal GDP Growth
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-sky-700 dark:text-sky-300 mt-1 block">
                  {simResult.impliedNominalGdpGrowthPct >= 0 ? `+${simResult.impliedNominalGdpGrowthPct.toFixed(1)}%` : `${simResult.impliedNominalGdpGrowthPct.toFixed(1)}%`}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
                  Via Equation of Exchange (M * V = P * Y)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400 block">
                  Implied CPI Inflation
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-rose-700 dark:text-rose-300 mt-1 block">
                  {simResult.impliedCpiInflationPct >= 0 ? `+${simResult.impliedCpiInflationPct.toFixed(1)}%` : `${simResult.impliedCpiInflationPct.toFixed(1)}%`}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
                  Regime: <strong className="text-slate-900 dark:text-white">{simResult.monetaryImpulseCategory}</strong>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block">
                  Bank Reserve Drain Risk
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-amber-700 dark:text-amber-300 mt-1 block">
                  {simResult.reserveDrainRiskScore} / 100
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1 leading-tight">
                  {simResult.reserveDrainPaceDescription}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Global Sovereign Comparison Matrix */}
      {activeTab === 'regimes' && (
        <div className="space-y-6">
          <div className="apple-card p-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-cyan-500" />
              <span>Cross-Sovereign Monetary Velocity &amp; Debt Issuance Profiles</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              Compare monetary turnover and debt management office (DMO) issuance strategies across the United States, Eurozone, United Kingdom, Japan, China, and the Global aggregate.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(REGIONAL_MONETARY_PROFILES) as MonetaryMechanicsRegionId[]).map((regId) => {
                const profile = REGIONAL_MONETARY_PROFILES[regId];
                const isSelected = selectedRegion === regId;
                return (
                  <div
                    key={regId}
                    onClick={() => setSelectedRegion(regId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 shadow-md ring-1 ring-purple-500/40'
                        : 'border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{profile.flag}</span>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-sm block">
                            {profile.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {profile.currencyCode} ({profile.currencySymbol})
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                        V = {profile.currentVelocity.toFixed(3)}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.08] space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Nominal GDP:</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          ${profile.nominalGdpTrillion.toFixed(2)}T
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>M2 Money Stock:</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          ${profile.m2MoneySupplyTrillion.toFixed(2)}T
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Short-Term Bills Share:</span>
                        <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                          {profile.shortTermBillsPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Shadow QE Impact:</span>
                        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {profile.shadowQeEstimatedBps} bps
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-white/[0.08] pt-2">
                      {profile.monetaryTransmissionNote}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
