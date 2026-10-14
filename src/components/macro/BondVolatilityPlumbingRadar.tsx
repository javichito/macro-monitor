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
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  BOND_VOLATILITY_OVERVIEW,
  REGIONAL_COLLATERAL_PROFILES,
  EQUITY_VOL_TERM_STRUCTURE,
  HISTORICAL_CRISIS_CASES,
  HISTORICAL_BOND_VOLATILITY_SERIES,
  getMoveStressLabel,
  getVixMoveRegimeLabel,
  simulateCollateralPlumbing,
  getLatestBondVolatilityState,
  getBondVolatilityExportData,
} from '../../data/bond-volatility-data';
import { BondVolatilityRegionId } from '../../lib/types';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import { ShareDeepLinkMenu } from '../common/ShareDeepLinkMenu';
import { deserializeBondVolatility, useDeepLinkSync } from '../../lib/deep-link';
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Layers,
  Scale,
  Sparkles,
  Globe2,
  Sliders,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  Compass,
} from 'lucide-react';

type BondRadarView = 'move' | 'vix_move' | 'plumbing' | 'crises';
type TimeWindow = '1y' | '3y' | '5y' | 'all';

export function BondVolatilityPlumbingRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState<BondRadarView>('move');
  const [selectedRegion, setSelectedRegion] = useState<BondVolatilityRegionId>('USA');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');

  // Interactive Sandbox state: user can simulate custom MOVE and VIX values
  const [simMove, setSimMove] = useState<number>(BOND_VOLATILITY_OVERVIEW.latestMove);
  const [simVix, setSimVix] = useState<number>(BOND_VOLATILITY_OVERVIEW.latestVix);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  /*
   * Hydrate Bond Volatility Radar state from deep-link URL hashes or query strings
   * so custom risk configurations and specific views can be bookmarked and shared.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const restored = deserializeBondVolatility();
    if (restored) {
      setActiveView(restored.view);
      setSelectedRegion(restored.region);
      if (restored.timeWindow) setTimeWindow(restored.timeWindow);
      if (restored.simMove !== undefined) setSimMove(restored.simMove);
      if (restored.simVix !== undefined) setSimVix(restored.simVix);
    }
    setIsInitialized(true);
  }, []);

  /*
   * Keep browser address bar synchronized with active radar selections
   * so copying the address bar URL preserves the exact inspection state.
   */
  useDeepLinkSync(
    'volatility',
    {
      view: activeView,
      region: selectedRegion,
      timeWindow,
      simMove,
      simVix,
    },
    isInitialized
  );

  const latestState = useMemo(() => getLatestBondVolatilityState(), []);
  const activeProfile = REGIONAL_COLLATERAL_PROFILES[selectedRegion];

  // Dynamic simulation results reflecting user slider adjustments
  const simResult = useMemo(
    () => simulateCollateralPlumbing(simMove, simVix, selectedRegion),
    [simMove, simVix, selectedRegion]
  );

  const activeStress = useMemo(() => getMoveStressLabel(simMove), [simMove]);
  const activeRegime = useMemo(() => getVixMoveRegimeLabel(simVix, simMove), [simVix, simMove]);

  // Filter historical series by selected time window
  const filteredHistoricalSeries = useMemo(() => {
    if (timeWindow === '1y') return HISTORICAL_BOND_VOLATILITY_SERIES.slice(-4);
    if (timeWindow === '3y') return HISTORICAL_BOND_VOLATILITY_SERIES.slice(-8);
    if (timeWindow === '5y') return HISTORICAL_BOND_VOLATILITY_SERIES.slice(-12);
    return HISTORICAL_BOND_VOLATILITY_SERIES;
  }, [timeWindow]);

  // Format historical series for CSV/JSON exports
  const exportColumns = useMemo(
    () => [
      { key: 'date', label: 'Quarter' },
      { key: 'moveIndex', label: 'ICE BofA MOVE Index' },
      { key: 'vixIndex', label: 'Cboe VIX Index' },
      { key: 'vixMoveRatio', label: 'VIX/MOVE Scaled Ratio' },
      { key: 'euroSovVol', label: 'Euro Sovereign Vol' },
      { key: 'giltSovVol', label: 'UK Gilt Vol' },
      { key: 'jgbSovVol', label: 'JGB Vol' },
      { key: 'repoHaircutPct', label: 'Primary Dealer Repo Haircut (%)' },
      { key: 'collateralStressIndex', label: 'Collateral Stress Index' },
      { key: 'notableEvent', label: 'Historical Macro Event' },
    ],
    []
  );

  const resetSimulator = () => {
    setSimMove(BOND_VOLATILITY_OVERVIEW.latestMove);
    setSimVix(BOND_VOLATILITY_OVERVIEW.latestVix);
  };

  return (
    <div className="space-y-6" id="bond-volatility-radar">
      {/* Header Container */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-5 sm:p-7 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <ShieldAlert className="h-3 w-3" />
                Collateral Plumbing &amp; Liquidity
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
                ICE BofA MOVE &amp; VIX Ratio
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bond Market Volatility &amp; Collateral Plumbing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Track sovereign bond volatility (MOVE), cross-market complacency (VIX/MOVE ratio), equity volatility term structures, and repo collateral mechanics across the United States, Eurozone, United Kingdom, and Japan.
            </p>
          </div>

          {/* Action Menus */}
          <div className="flex items-center gap-2 shrink-0">
            <ShareDeepLinkMenu
              simulator="volatility"
              state={{
                view: activeView,
                region: selectedRegion,
                timeWindow,
                simMove,
                simVix,
              }}
              variant="compact"
            />
            <DataExportMenu
              title="Bond Volatility & Collateral Plumbing Dataset"
              filename="bond-volatility-collateral"
              data={getBondVolatilityExportData}
              columns={exportColumns}
              variant="compact"
            />
          </div>
        </div>

        {/* Global Overview Ticker Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5">
          {/* MOVE Index */}
          <div className="rounded-2xl p-3.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              <span>ICE BofA MOVE</span>
              <span className="text-[10px] text-amber-500 font-semibold uppercase">Treasury Vol</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {BOND_VOLATILITY_OVERVIEW.latestMove.toFixed(1)} <span className="text-xs font-normal text-slate-500">pts</span>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block"></span>
              Elevated Stress (52w: {BOND_VOLATILITY_OVERVIEW.move52wLow} - {BOND_VOLATILITY_OVERVIEW.move52wHigh})
            </div>
          </div>

          {/* Cboe VIX */}
          <div className="rounded-2xl p-3.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              <span>Cboe VIX</span>
              <span className="text-[10px] text-emerald-500 font-semibold uppercase">Equity Vol</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {BOND_VOLATILITY_OVERVIEW.latestVix.toFixed(1)} <span className="text-xs font-normal text-slate-500">pts</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Tranquil Norm (52w: {BOND_VOLATILITY_OVERVIEW.vix52wLow} - {BOND_VOLATILITY_OVERVIEW.vix52wHigh})
            </div>
          </div>

          {/* VIX/MOVE Ratio */}
          <div className="rounded-2xl p-3.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              <span>VIX / MOVE Ratio</span>
              <span className="text-[10px] text-rose-500 font-semibold uppercase">Complacency</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {BOND_VOLATILITY_OVERVIEW.vixMoveRatio.toFixed(2)} <span className="text-xs font-normal text-slate-500">(scaled)</span>
            </div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block"></span>
              Moderate Equity Complacency
            </div>
          </div>

          {/* Collateral Health */}
          <div className="rounded-2xl p-3.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              <span>Collateral Health</span>
              <span className="text-[10px] text-sky-500 font-semibold uppercase">Global Index</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {BOND_VOLATILITY_OVERVIEW.globalCollateralHealthScore.toFixed(1)} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </div>
            <div className="text-[11px] text-sky-600 dark:text-sky-400 mt-1 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500 inline-block"></span>
              Normal Velocity (Haircut: 2.0%)
            </div>
          </div>
        </div>

        {/* View Switcher Tabs & Region Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-white/[0.06]">
          {/* Sub-view navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-2xl border border-slate-200 dark:border-white/[0.08]">
            <button
              onClick={() => setActiveView('move')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'move'
                  ? 'bg-white text-slate-900 dark:bg-white dark:text-black shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              MOVE &amp; Treasury Vol
            </button>
            <button
              onClick={() => setActiveView('vix_move')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'vix_move'
                  ? 'bg-white text-slate-900 dark:bg-white dark:text-black shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              VIX / MOVE &amp; Term Structure
            </button>
            <button
              onClick={() => setActiveView('plumbing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'plumbing'
                  ? 'bg-white text-slate-900 dark:bg-white dark:text-black shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Collateral Plumbing &amp; Repo
            </button>
            <button
              onClick={() => setActiveView('crises')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'crises'
                  ? 'bg-white text-slate-900 dark:bg-white dark:text-black shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Historical Crises
            </button>
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Jurisdiction:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08]">
              {(['GLOBAL', 'USA', 'EUR', 'GBR', 'JPN'] as BondVolatilityRegionId[]).map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-white text-slate-900 dark:bg-white dark:text-black shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts Banner */}
      {latestState.activeAlerts.length > 0 && (
        <div className="space-y-2">
          {latestState.activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl p-4 border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                alert.level === 'CRITICAL'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  : alert.level === 'WARNING'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
                  : alert.level === 'COMPLACENCY'
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-800 dark:text-purple-200'
                  : 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-200'
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold">{alert.headline}</div>
                <div className="text-xs opacity-90 leading-relaxed">{alert.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 1: MOVE & TREASURY VOLATILITY */}
      {/* ===================================================================== */}
      {activeView === 'move' && (
        <div className="space-y-6">
          {/* MOVE Stress Threshold Spectrum */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  ICE BofA MOVE Index Operational Stress Gauge
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  The foundational discount rate for global capitalism. Spikes above 120 signal primary dealer balance sheet strain; above 140 signal systemic collateral dislocation.
                </p>
              </div>
              <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${activeStress.badgeClass}`}>
                {activeStress.label} ({simMove.toFixed(1)} pts)
              </span>
            </div>

            {/* Threshold Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden flex relative">
                <div className="w-[40%] bg-emerald-500/70 h-full border-r border-white/20" title="Tranquil (<80)"></div>
                <div className="w-[12.5%] bg-sky-500/70 h-full border-r border-white/20" title="Normal (80-105)"></div>
                <div className="w-[7.5%] bg-amber-500/70 h-full border-r border-white/20" title="Elevated (105-120)"></div>
                <div className="w-[10%] bg-orange-500/70 h-full border-r border-white/20" title="Severe Illiquidity (120-140)"></div>
                <div className="w-[30%] bg-rose-500/70 h-full" title="Crisis (>140)"></div>

                {/* Marker pointer */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-black dark:bg-white shadow-lg transition-all duration-300"
                  style={{
                    left: `${Math.min(99, Math.max(1, (simMove / 200) * 100))}%`,
                  }}
                >
                  <div className="absolute -top-6 -left-3 px-1.5 py-0.5 bg-black dark:bg-white text-white dark:text-black rounded text-[10px] font-bold shadow-md whitespace-nowrap">
                    {simMove.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Threshold Labels */}
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium px-1">
                <span>40 (Ultra Low)</span>
                <span>80 (Tranquil)</span>
                <span>105 (Normal)</span>
                <span className="text-amber-500 font-bold">120 (Strain)</span>
                <span className="text-rose-500 font-bold">140 (Crisis Intervention)</span>
                <span>200+</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200/60 dark:border-white/[0.05]">
              {activeStress.description}
            </p>
          </div>

          {/* Historical MOVE Chart */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Historical Treasury Volatility Evolution (2019 – 2026)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Historical cycle peaks highlight the March 2020 cash-futures basis dislocation, 2022 UK Gilt crisis, and March 2023 SVB run.
                </p>
              </div>

              {/* Time window toggles */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] self-start sm:self-auto">
                {(['1y', '3y', '5y', 'all'] as TimeWindow[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setTimeWindow(w)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                      timeWindow === w
                        ? 'bg-white text-slate-900 dark:bg-white dark:text-black shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredHistoricalSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                  <XAxis dataKey="date" stroke={isDark ? '#888888' : '#666666'} fontSize={11} tickLine={false} />
                  <YAxis domain={[30, 220]} stroke={isDark ? '#888888' : '#666666'} fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const pt = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
                            <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-1">
                              {label}
                            </div>
                            <div className="space-y-1 pt-0.5">
                              <div className="flex justify-between text-sky-500 font-semibold">
                                <span>ICE BofA MOVE:</span>
                                <span>{pt.moveIndex} pts</span>
                              </div>
                              <div className="flex justify-between text-rose-500 font-semibold">
                                <span>UK Gilt Vol:</span>
                                <span>{pt.giltSovVol} pts</span>
                              </div>
                              <div className="flex justify-between text-emerald-500 font-semibold">
                                <span>Euro Sovereign Vol:</span>
                                <span>{pt.euroSovVol} pts</span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>Repo Haircut:</span>
                                <span>{pt.repoHaircutPct}%</span>
                              </div>
                            </div>
                            {pt.notableEvent && (
                              <div className="text-[10px] text-amber-500 font-medium pt-1 border-t border-slate-200 dark:border-white/10">
                                {pt.notableEvent}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={120}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{
                      value: '120 Strain Threshold',
                      fill: '#f59e0b',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  <ReferenceLine
                    y={140}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: '140 Crisis / Intervention',
                      fill: '#ef4444',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moveIndex"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#0ea5e9' }}
                    activeDot={{ r: 6 }}
                    name="moveIndex"
                  />
                  <Line
                    type="monotone"
                    dataKey="giltSovVol"
                    stroke="#f43f5e"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="giltSovVol"
                  />
                  <Line
                    type="monotone"
                    dataKey="euroSovVol"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="euroSovVol"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500 inline-block"></span>
                <span>US MOVE Index</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span>UK Gilt Vol (LDI Sensitivity)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Euro Sovereign Vol</span>
              </div>
            </div>
          </div>

          {/* Interactive MOVE Simulator Sandbox */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-sky-500" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Sovereign Volatility Simulation Sandbox
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Simulate custom MOVE shocks to observe mechanical reactions across primary dealer repo haircuts, dealer capacity, and margin call frequency.
                </p>
              </div>

              <button
                onClick={resetSimulator}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-all cursor-pointer self-start sm:self-auto border border-slate-200 dark:border-white/[0.08]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Slider Controls */}
              <div className="space-y-4 lg:col-span-1 bg-white dark:bg-[#121316] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08]">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Simulate MOVE Index:</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">{simMove.toFixed(1)} pts</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="220"
                    step="1"
                    value={simMove}
                    aria-label="Simulate ICE BofA MOVE Index"
                    onChange={(e) => setSimMove(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400">
                    <span>50 (Benign)</span>
                    <span>120 (Strain)</span>
                    <span>140 (Crisis)</span>
                    <span>220 (Extreme)</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Simulate S&amp;P 500 VIX:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{simVix.toFixed(1)} pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="65"
                    step="0.5"
                    value={simVix}
                    aria-label="Simulate Cboe VIX Index"
                    onChange={(e) => setSimVix(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400">
                    <span>10 (Tranquil)</span>
                    <span>20 (Normal)</span>
                    <span>35 (Fear)</span>
                    <span>65 (Panic)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Output Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl p-4 bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/[0.08] space-y-1">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Implied Dealer Repo Haircut</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {simResult.impliedRepoHaircutPct.toFixed(2)}%
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Normal baseline is 1.5–2.0%. Spikes above 4.0% force hedge funds to rapidly de-lever basis trades.
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/[0.08] space-y-1">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Primary Dealer Balance Sheet Capacity</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {simResult.dealerBalanceSheetCapacityPct}%
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Internal VaR limits force dealers to curb inventory absorption once capacity drops below 50%.
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/[0.08] space-y-1">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Basis Trade Margin Strain Multiplier</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {simResult.basisTradeMarginStrainMultiplier.toFixed(2)}x
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Relative cash margin requirements demanded by clearinghouses on Treasury basis positions.
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/[0.08] space-y-1">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Systemic Collateral Fragility Index</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {simResult.systemicFragilityIndex} / 100
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Synthesizes bond volatility, repo haircuts, and cross-market complacency into a single fragility score.
                  </div>
                </div>

                <div className="sm:col-span-2 rounded-2xl p-4 bg-sky-500/10 border border-sky-500/20 text-xs text-sky-900 dark:text-sky-200 font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-sky-500" />
                  <span><strong>Operational Guidance:</strong> {simResult.recommendedAction}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: VIX / MOVE COMPLACENCY & VOLATILITY TERM STRUCTURE */}
      {/* ===================================================================== */}
      {activeView === 'vix_move' && (
        <div className="space-y-6">
          {/* VIX / MOVE Cross-Asset Complacency Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  The VIX / MOVE Cross-Asset Complacency Radar
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Illuminates whether equity investors are dangerously complacent relative to bond market turbulence.
                </p>
              </div>

              <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${activeRegime.badgeClass}`}>
                {activeRegime.label} (Ratio: {activeRegime.scaledRatio.toFixed(2)})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
              <div className="space-y-3">
                <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  The Mathematical Ratio
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {activeRegime.scaledRatio.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-500">(Raw: {activeRegime.rawRatio.toFixed(3)})</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Calculated as <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-sky-500 font-mono">(VIX / MOVE) × 10</code>. Because sovereign bonds represent the foundational collateral for equity valuations, a depressed ratio indicates stock markets are ignoring bond market tremors.
                </p>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  Historical Complacency Regimes
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className={`p-3 rounded-xl border ${activeRegime.scaledRatio < 1.20 ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-200 dark:border-white/[0.06] opacity-60'}`}>
                    <div className="font-bold text-rose-600 dark:text-rose-400">&lt; 1.20: Extreme Complacency</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Equities blind to bond crisis. Precedes sharp equity re-pricing (e.g. Feb 2020, Fall 2022).</div>
                  </div>

                  <div className={`p-3 rounded-xl border ${activeRegime.scaledRatio >= 1.20 && activeRegime.scaledRatio < 1.55 ? 'border-amber-500/50 bg-amber-500/10' : 'border-slate-200 dark:border-white/[0.06] opacity-60'}`}>
                    <div className="font-bold text-amber-600 dark:text-amber-400">1.20 – 1.55: Moderate Complacency</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Bond rate uncertainty outpaces equity options. Recommend tactical risk trimming.</div>
                  </div>

                  <div className={`p-3 rounded-xl border ${activeRegime.scaledRatio >= 1.55 && activeRegime.scaledRatio < 2.20 ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-200 dark:border-white/[0.06] opacity-60'}`}>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">1.55 – 2.20: Balanced Equilibrium</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Standard cross-market pricing. Normal risk premiums in equities and Treasuries.</div>
                  </div>

                  <div className={`p-3 rounded-xl border ${activeRegime.scaledRatio >= 2.20 ? 'border-sky-500/50 bg-sky-500/10' : 'border-slate-200 dark:border-white/[0.06] opacity-60'}`}>
                    <div className="font-bold text-sky-600 dark:text-sky-400">&gt; 2.20: Equity Fear / Bond Refuge</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Equities sell off while sovereign bonds act as safe-haven collateral refuge.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equity Volatility Term Structure */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Equity Volatility Term Structure (Contango vs. Backwardation)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Term structure is in normal upward-sloping contango (30D VIX &lt; 3M VIX). Backwardation inversions indicate near-term hedging scrambles.
                </p>
              </div>

              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Healthy Contango (+3.3 pts slope)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EQUITY_VOL_TERM_STRUCTURE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                  <XAxis dataKey="symbol" stroke={isDark ? '#888888' : '#666666'} fontSize={11} tickLine={false} />
                  <YAxis domain={[10, 25]} stroke={isDark ? '#888888' : '#666666'} fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {label} ({item.label})
                            </div>
                            <div className="text-sky-500 font-semibold">
                              Implied Vol: {item.value} pts
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Implied Daily Move: ±{item.impliedDailyMovePct}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {EQUITY_VOL_TERM_STRUCTURE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? '#0ea5e9' : isDark ? '#38bdf8' : '#0284c7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
              {EQUITY_VOL_TERM_STRUCTURE.map((item) => (
                <div key={item.tenor} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05] text-center">
                  <div className="text-[11px] text-slate-500 font-semibold">{item.symbol} ({item.tenor})</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{item.value.toFixed(1)}</div>
                  <div className="text-[10px] text-sky-500 font-medium">±{item.impliedDailyMovePct}% / day</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 3: COLLATERAL PLUMBING & REPO MECHANICS */}
      {/* ===================================================================== */}
      {activeView === 'plumbing' && (
        <div className="space-y-6">
          {/* Active Jurisdiction Spotlight Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-sky-500" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {activeProfile.name} Sovereign Collateral Mechanics
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Benchmark: {activeProfile.sovereignBondBenchmark} | Implied Vol: {activeProfile.sovereignVolIndex} pts
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Health Score:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {activeProfile.healthScore} / 100
                </span>
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]">
                <div className="text-[11px] text-slate-500 font-medium">Repo Spread</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {activeProfile.repoSpreadBps > 0 ? `+${activeProfile.repoSpreadBps}` : activeProfile.repoSpreadBps} bps
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">vs Policy Rate</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]">
                <div className="text-[11px] text-slate-500 font-medium">Dealer Haircut</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {activeProfile.primaryDealerHaircutPct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Floor Margin</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]">
                <div className="text-[11px] text-slate-500 font-medium">Collateral Velocity</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {activeProfile.collateralVelocityMultiplier.toFixed(1)}x
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Rehypothecation</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]">
                <div className="text-[11px] text-slate-500 font-medium">Scarcity Premium</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {activeProfile.collateralScarcityBps} bps
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Specialness</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]">
                <div className="text-[11px] text-slate-500 font-medium">Fails to Deliver</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  ${activeProfile.failsToDeliverBillion}B
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Settlement Friction</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]">
                <div className="text-[11px] text-slate-500 font-medium">Repo Policy Rate</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {activeProfile.repoRatePct.toFixed(2)}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Target: {activeProfile.policyRatePct.toFixed(2)}%</div>
              </div>
            </div>

            {/* Jurisdiction Vulnerability Callout */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05] space-y-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-sky-500" />
                Structural Collateral Vulnerability:
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeProfile.keyVulnerabilityNote}
              </div>
            </div>
          </div>

          {/* Diagram of Collateral Flow */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              How Sovereign Collateral Flows Through Financial Plumbing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The four stages of modern repo and collateral rehypothecation that determine systemic market stability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2">
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400">1. Sovereign Issuance</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Treasury Debt Auction</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Governments issue sovereign bonds to finance fiscal deficits. Primary dealers commit to underwrite and absorb massive bond auctions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2">
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400">2. Repo Financing</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Overnight &amp; Term Repo</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Dealers pledge acquired bonds to Money Market Funds (MMFs) and corporate treasuries in exchange for cash at SOFR/ESTER rates.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2">
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400">3. Leverage Overlay</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Cash-Futures Basis Trades</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Relative-value hedge funds borrow collateral via bilateral repo at 30x–50x leverage to arbitrage tiny price differentials with futures contracts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2">
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400">4. Margin Fragility</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">VaR Shocks &amp; Haircut Spikes</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  When MOVE spikes &gt;120, clearinghouses hike variation margins. If repo lenders widen haircuts, levered funds must liquidate collateral for cash.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 4: HISTORICAL CRISES CASE STUDIES */}
      {/* ===================================================================== */}
      {activeView === 'crises' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121316] p-5 sm:p-7 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Sovereign Collateral Crises Case Studies
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Analyzing how sovereign debt dislocations freeze repo markets, shatter dealer balance sheets, and force emergency central bank intervention.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {HISTORICAL_CRISIS_CASES.map((crisis) => (
                <div
                  key={crisis.id}
                  className="rounded-2xl p-5 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">{crisis.date}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{crisis.title}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold text-rose-500">MOVE: {crisis.peakMove}</div>
                      <div className="text-[10px] text-slate-400">VIX: {crisis.peakVix}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {crisis.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#16171b] border border-slate-200/60 dark:border-white/[0.06] space-y-1">
                    <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                      Collateral Plumbing Failure:
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {crisis.collateralMechanism}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                      Central Bank Policy Intervention:
                    </div>
                    <div className="text-[11px] text-sky-900 dark:text-sky-200 leading-relaxed">
                      {crisis.policyIntervention}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
