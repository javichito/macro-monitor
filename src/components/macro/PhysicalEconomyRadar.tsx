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
  HISTORICAL_PHYSICAL_ECONOMY_SERIES,
  REGIONAL_PHYSICAL_ECONOMY_PROFILES,
  ENERGY_REGIME_CONFIG,
  DEGLOBALIZATION_PHASE_CONFIG,
  DEMOGRAPHIC_PHASE_CONFIG,
  getPhysicalEconomyOverview,
  getLatestPhysicalEconomyState,
  getCombinedPhysicalEconomyExportData,
  calculateSimulatedEnergyExpenditure,
  calculateSimulatedDeglobalization,
  calculateSimulatedDemographicRelief,
} from '../../data/physical-economy-data';
import {
  PhysicalEconomyRegionId,
  HistoricalPhysicalEconomyPoint,
} from '../../lib/types';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import { ShareDeepLinkMenu } from '../common/ShareDeepLinkMenu';
import {
  deserializePhysicalEconomy,
  useDeepLinkSync,
  PhysicalEconomyState,
} from '../../lib/deep-link';
import {
  Zap,
  Globe2,
  Users,
  AlertTriangle,
  RotateCcw,
  Layers,
  Activity,
  Flame,
  ShieldAlert,
  Sliders,
  Percent,
  CheckCircle2,
  Info,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

type PhysicalView = 'overview' | 'energy' | 'deglobalization' | 'demographics';
type TimeHorizon = 'all' | '20y' | '10y';

export function PhysicalEconomyRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const overview = useMemo(() => getPhysicalEconomyOverview(), []);

  // Primary interactive filter states
  const [activeView, setActiveView] = useState<PhysicalView>('overview');
  const [selectedRegion, setSelectedRegion] = useState<PhysicalEconomyRegionId>('GLOBAL');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('all');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Interactive Simulator parameters (Physical Economy Sandbox)
  const [simOilPrice, setSimOilPrice] = useState<number>(75.0);
  const [simTariffRate, setSimTariffRate] = useState<number>(4.9);
  const [simRetirementAge, setSimRetirementAge] = useState<number>(65);

  /*
   * Hydrates simulator state from URL parameters or hash fragments on initial client mount,
   * enabling shared links and research bookmarks to reproduce exact macroeconomic scenarios.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const restored = deserializePhysicalEconomy();
    if (restored) {
      if (restored.view) setActiveView(restored.view);
      if (restored.region) setSelectedRegion(restored.region);
      if (restored.timeWindow) setTimeHorizon(restored.timeWindow);
      if (restored.simOilPrice !== undefined) setSimOilPrice(restored.simOilPrice);
      if (restored.simTariffRate !== undefined) setSimTariffRate(restored.simTariffRate);
      if (restored.simRetirementAge !== undefined) setSimRetirementAge(restored.simRetirementAge);
    }
    setIsInitialized(true);
  }, []);

  /*
   * Continuously synchronizes state changes back into the URL query parameters or hash fragment,
   * allowing direct copying and bookmarking without reloading the page.
   */
  const deepLinkState: PhysicalEconomyState = useMemo(
    () => ({
      view: activeView,
      region: selectedRegion,
      timeWindow: timeHorizon,
      simOilPrice,
      simTariffRate,
      simRetirementAge,
    }),
    [activeView, selectedRegion, timeHorizon, simOilPrice, simTariffRate, simRetirementAge]
  );

  useDeepLinkSync('physical', deepLinkState, isInitialized);

  // Filter series according to selected time horizon
  const filteredSeries = useMemo(() => {
    if (timeHorizon === '10y') {
      return HISTORICAL_PHYSICAL_ECONOMY_SERIES.filter((p) => p.year >= 2016 && p.year <= 2026);
    }
    if (timeHorizon === '20y') {
      return HISTORICAL_PHYSICAL_ECONOMY_SERIES.filter((p) => p.year >= 2005 && p.year <= 2026);
    }
    return HISTORICAL_PHYSICAL_ECONOMY_SERIES;
  }, [timeHorizon]);

  // Current regional profile
  const activeProfile = REGIONAL_PHYSICAL_ECONOMY_PROFILES[selectedRegion];
  const telemetry = useMemo(() => getLatestPhysicalEconomyState(), []);

  // Simulator evaluations
  const simEnergy = useMemo(
    () => calculateSimulatedEnergyExpenditure(simOilPrice),
    [simOilPrice]
  );

  const simTrade = useMemo(
    () => calculateSimulatedDeglobalization(simTariffRate),
    [simTariffRate]
  );

  const simDemographics = useMemo(
    () => calculateSimulatedDemographicRelief(simRetirementAge, activeProfile.demographics.oldAgeDependencyRatio),
    [simRetirementAge, activeProfile.demographics.oldAgeDependencyRatio]
  );

  // Prepare regional comparison datasets for bar charts
  const regionalEnergyComparison = useMemo(() => {
    const ids: PhysicalEconomyRegionId[] = ['GLOBAL', 'USA', 'EUR', 'CHN', 'JPN', 'DEU', 'GBR', 'IND', 'KOR'];
    return ids.map((id) => ({
      regionId: id,
      name: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].name,
      flag: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].flag,
      energyBurdenPct: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].energy.energyExpenditurePercentGdp,
      oilSharePct: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].energy.oilSharePct,
      netImportPct: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].energy.energyNetImportDependencePct,
    }));
  }, []);

  const regionalTradeComparison = useMemo(() => {
    const ids: PhysicalEconomyRegionId[] = ['GLOBAL', 'USA', 'EUR', 'CHN', 'JPN', 'DEU', 'GBR', 'IND', 'KOR'];
    return ids.map((id) => ({
      regionId: id,
      name: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].name,
      flag: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].flag,
      tradeToGdpPct: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].trade.tradeToGdpPct,
      peakTradePct: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].trade.peakTradeRatioPct,
      tradeBalancePct: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].trade.tradeBalancePercentGdp,
    }));
  }, []);

  const regionalDemographicComparison = useMemo(() => {
    const ids: PhysicalEconomyRegionId[] = ['GLOBAL', 'USA', 'EUR', 'CHN', 'JPN', 'DEU', 'GBR', 'IND', 'KOR'];
    return ids.map((id) => ({
      regionId: id,
      name: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].name,
      flag: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].flag,
      workingAgeGrowthPct: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].demographics.workingAgeGrowthPct,
      dependencyRatio: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].demographics.oldAgeDependencyRatio,
      projectedRatio2050: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].demographics.projectedDependencyRatio2050,
      medianAge: REGIONAL_PHYSICAL_ECONOMY_PROFILES[id].demographics.medianAge,
    }));
  }, []);

  // Format dataset for CSV/JSON export
  const exportData = useMemo(() => getCombinedPhysicalEconomyExportData(), []);
  const exportColumns = useMemo(
    () => [
      { key: 'Year', label: 'Year' },
      { key: 'Date', label: 'Period' },
      { key: 'World GDP ($T)', label: 'World GDP ($T)' },
      { key: 'Brent Crude ($/bbl)', label: 'Brent Crude ($/bbl)' },
      { key: 'Energy Burden (% of World GDP)', label: 'Energy Burden (% GDP)' },
      { key: 'Energy Regime', label: 'Energy Regime' },
      { key: 'World Trade-to-GDP Ratio (%)', label: 'Trade-to-GDP (%)' },
      { key: 'Geoeconomic Fragmentation Index', label: 'Fragmentation Index' },
      { key: 'Average Global Tariff (%)', label: 'Avg Tariff (%)' },
      { key: 'Deglobalization Phase', label: 'Deglobalization Phase' },
      { key: 'Global Working-Age Growth (% YoY)', label: 'Working-Age Growth (%)' },
      { key: 'Global Old-Age Dependency Ratio', label: 'Dependency Ratio' },
      { key: 'Historical Macro Note', label: 'Historical Event' },
    ],
    []
  );

  const resetSimulatorDefaults = () => {
    setSimOilPrice(75.0);
    setSimTariffRate(4.9);
    setSimRetirementAge(65);
  };

  const currentEnergyConfig = ENERGY_REGIME_CONFIG[simEnergy.regime];

  return (
    <div id="physical-radar" className="space-y-6">
      {/* Header Container */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-slate-900/80 p-5 sm:p-7 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Foundational Macro Constraints</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Physical Economy, Energy &amp; Deglobalization
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Track global energy expenditure against the recessionary 8%–10% consumption tax threshold, 
              quantify the post-2008 peak in global trade openness (friendshoring &amp; tariff barriers), 
              and analyze the secular demographic cliff (working-age contraction in China, Japan &amp; Europe) driving permanent fiscal dominance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <ShareDeepLinkMenu simulator="physical" state={deepLinkState} label="Share Analysis" />
            <DataExportMenu
              data={exportData}
              columns={exportColumns}
              filename="physical-economy-energy-deglobalization"
              title="Physical Economy Dataset"
            />
          </div>
        </div>

        {/* Macro Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-200/60 dark:border-white/[0.06]">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] p-3.5">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Energy Burden (% GDP)</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {overview.latestEnergyBurdenPctGdp}%
              </span>
              <span className="text-xs font-semibold text-amber-500">
                8% Warning
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Flame className="h-3 w-3 text-amber-500" />
              <span>Brent: ${overview.brentCrudeUsd}/bbl</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] p-3.5">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">World Trade (% GDP)</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {overview.latestWorldTradeToGdpPct}%
              </span>
              <span className="text-xs font-semibold text-rose-500">
                {overview.tradeDeltaFromPeakPct}%
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Globe2 className="h-3 w-3 text-sky-500" />
              <span>2008 Peak: {overview.peakTradeToGdpPct}%</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] p-3.5">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Working-Age Growth</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                +{overview.globalWorkingAgeGrowthPct}%
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                YoY
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Users className="h-3 w-3 text-purple-500" />
              <span>Halved vs 1980s</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] p-3.5">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Old-Age Dependency</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {overview.globalOldAgeDependencyRatio}
              </span>
              <span className="text-xs font-semibold text-rose-500">
                &rarr; 25.2 (2050)
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-rose-500" />
              <span>Per 100 workers (15-64)</span>
            </div>
          </div>
        </div>

        {/* View Navigation & Region Filters */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-white/[0.06]">
          {/* Analytical Views */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.08] text-xs">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'overview'
                  ? 'bg-white dark:bg-white dark:text-black text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Pillars
            </button>
            <button
              onClick={() => setActiveView('energy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'energy'
                  ? 'bg-white dark:bg-white dark:text-black text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>Energy Expenditure (8%-10% Tax)</span>
            </button>
            <button
              onClick={() => setActiveView('deglobalization')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'deglobalization'
                  ? 'bg-white dark:bg-white dark:text-black text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5 text-sky-500" />
              <span>Deglobalization &amp; Trade</span>
            </button>
            <button
              onClick={() => setActiveView('demographics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'demographics'
                  ? 'bg-white dark:bg-white dark:text-black text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5 text-purple-500" />
              <span>Demographic Cliff &amp; Fiscal Drag</span>
            </button>
          </div>

          {/* Time Window Selectors */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.08] text-xs self-start md:self-auto">
            <button
              onClick={() => setTimeHorizon('all')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                timeHorizon === 'all'
                  ? 'bg-white dark:bg-white dark:text-black text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All (1970-2050)
            </button>
            <button
              onClick={() => setTimeHorizon('20y')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                timeHorizon === '20y'
                  ? 'bg-white dark:bg-white dark:text-black text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              20Y
            </button>
            <button
              onClick={() => setTimeHorizon('10y')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                timeHorizon === '10y'
                  ? 'bg-white dark:bg-white dark:text-black text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              10Y
            </button>
          </div>
        </div>

        {/* Sovereign Region Selector Pills */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {(
            [
              'GLOBAL',
              'USA',
              'EUR',
              'CHN',
              'JPN',
              'DEU',
              'GBR',
              'IND',
              'KOR',
            ] as PhysicalEconomyRegionId[]
          ).map((regId) => {
            const profile = REGIONAL_PHYSICAL_ECONOMY_PROFILES[regId];
            const isSelected = selectedRegion === regId;
            return (
              <button
                key={regId}
                onClick={() => setSelectedRegion(regId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'bg-slate-100/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.08]'
                }`}
              >
                <span>{profile.flag}</span>
                <span>{profile.name.split('/')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Critical Macro Alerts Banner */}
      <div className="space-y-2.5">
        {telemetry.activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl p-4 border backdrop-blur-md transition-all ${
              alert.level === 'CRITICAL'
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-200'
                : alert.level === 'WARNING'
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200'
                : alert.level === 'BENIGN'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                : 'border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {alert.level === 'CRITICAL' || alert.level === 'WARNING' ? (
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400" />
              ) : (
                <Info className="h-5 w-5 shrink-0 mt-0.5 text-sky-500 dark:text-sky-400" />
              )}
              <div className="space-y-1">
                <div className="font-semibold text-sm">{alert.headline}</div>
                <div className="text-xs opacity-90 leading-relaxed">{alert.body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Physical Economy Sandbox / Simulator */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-slate-900/80 p-5 sm:p-7 backdrop-blur-xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/60 dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Physical Economy &amp; Deglobalization Sandbox
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stress-test energy consumption tax triggers, trade fragmentation friction, and retirement age adjustments
              </p>
            </div>
          </div>

          <button
            onClick={resetSimulatorDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* 3 Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Brent Crude Oil Benchmark */}
          <div className="space-y-3 rounded-2xl p-4 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>Brent Crude Oil ($/bbl)</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-white/[0.08] px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/[0.1]">
                ${simOilPrice.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="180"
              step="1"
              value={simOilPrice}
              onChange={(e) => setSimOilPrice(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$30 (Deflation)</span>
              <span>$105 (8% Warning)</span>
              <span>$180 (Shock)</span>
            </div>
            <div className="pt-2 text-xs border-t border-slate-200/60 dark:border-white/[0.06] space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <span>Energy Burden:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {simEnergy.simulatedTotalEnergyPctGdp}% of GDP
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <span>Recession Probability:</span>
                <span className={`font-bold ${simEnergy.recessionProbabilityScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {simEnergy.recessionProbabilityScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Slider 2: Average Tariff & Trade Friction */}
          <div className="space-y-3 rounded-2xl p-4 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-sky-500" />
                <span>Average Global Tariff (%)</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-white/[0.08] px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/[0.1]">
                {simTariffRate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={simTariffRate}
              onChange={(e) => setSimTariffRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Free Trade)</span>
              <span>4.9% (Current)</span>
              <span>25% (Smoot-Hawley)</span>
            </div>
            <div className="pt-2 text-xs border-t border-slate-200/60 dark:border-white/[0.06] space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <span>Projected Trade / GDP:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {simTrade.simulatedTradeToGdpPct}%
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <span>Vs 2008 Peak (61%):</span>
                <span className="font-bold text-rose-500">
                  {simTrade.tradeContractionVsPeakPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Slider 3: Statutory Retirement Age Reform */}
          <div className="space-y-3 rounded-2xl p-4 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-purple-500" />
                <span>Statutory Retirement Age</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-white/[0.08] px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/[0.1]">
                {simRetirementAge} Yrs
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="72"
              step="1"
              value={simRetirementAge}
              onChange={(e) => setSimRetirementAge(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>60 Yrs (Early)</span>
              <span>65 Yrs (OECD Norm)</span>
              <span>72 Yrs (Longevity)</span>
            </div>
            <div className="pt-2 text-xs border-t border-slate-200/60 dark:border-white/[0.06] space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <span>Adjusted Dependency:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {simDemographics.adjustedDependencyRatio}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                <span>Pension Fiscal Savings:</span>
                <span className="font-bold text-emerald-500">
                  +{simDemographics.estimatedFiscalSavingsGdpPct}% of GDP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Evaluation Summary Banner */}
        <div className={`rounded-2xl p-4 border transition-all ${currentEnergyConfig.bgClass} ${currentEnergyConfig.borderClass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: currentEnergyConfig.color }}
              />
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Evaluated Macro Regime
                </div>
                <div className={`text-base font-bold ${currentEnergyConfig.textClass}`}>
                  {currentEnergyConfig.label} ({simEnergy.simulatedTotalEnergyPctGdp}% of GDP)
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {currentEnergyConfig.description}
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1: Global Energy Expenditure as % of World GDP (Recession Tax Radar) */}
      {(activeView === 'overview' || activeView === 'energy') && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-slate-900/80 p-5 sm:p-7 backdrop-blur-xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 dark:border-white/[0.06] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Global Energy Expenditure as % of World GDP
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Primary energy spending breaching 8% to 10% functions as an inescapable regressive consumption tax that precedes modern recessions
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>8% Warning Line</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>10% Crisis Line</span>
              </div>
            </div>
          </div>

          <div className="h-[360px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredSeries} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                <YAxis
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={11}
                  domain={[0, 14]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === 'globalEnergyExpenditurePctGdp'
                      ? 'Total Primary Energy % GDP'
                      : name === 'crudeOilExpenditurePctGdp'
                      ? 'Crude Oil Share % GDP'
                      : 'Energy Intensity (1980=100)',
                  ]}
                  labelFormatter={(lbl, items) => {
                    const pt = items?.[0]?.payload as HistoricalPhysicalEconomyPoint;
                    return pt?.eventNote ? `${lbl} — ${pt.eventNote}` : lbl;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                
                {/* 8% Warning Line */}
                <ReferenceLine
                  y={8.0}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: '8.0% Warning Zone',
                    position: 'top',
                    fill: '#f59e0b',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />

                {/* 10% Crisis Line */}
                <ReferenceLine
                  y={10.0}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: '10.0% Recession Trigger',
                    position: 'top',
                    fill: '#ef4444',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="globalEnergyExpenditurePctGdp"
                  name="Total Energy % GDP"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#f59e0b' }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="crudeOilExpenditurePctGdp"
                  name="Crude Oil % GDP"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="rounded-xl p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05]">
              <span className="font-semibold text-slate-800 dark:text-slate-200">1974 &amp; 1980 Shocks:</span>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Breached 10.4% and 11.8% of GDP respectively, creating historic stagflation and forcing Volcker&apos;s 20% federal funds rate hiking cycle.
              </p>
            </div>
            <div className="rounded-xl p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05]">
              <span className="font-semibold text-slate-800 dark:text-slate-200">2008 Oil Peak ($147/bbl):</span>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Pushed energy expenditure to 8.8% of GDP in mid-2008, draining consumer liquidity and accelerating the Great Financial Crisis.
              </p>
            </div>
            <div className="rounded-xl p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05]">
              <span className="font-semibold text-slate-800 dark:text-slate-200">2022 Russian Gas Dislocation:</span>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Energy burden surged to 8.4% of GDP, sparking the highest global inflation shock in 40 years and rapid central bank monetary tightening.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart 2: Global Trade-to-GDP Ratio (Deglobalization / Fragmentation Index) */}
      {(activeView === 'overview' || activeView === 'deglobalization') && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-slate-900/80 p-5 sm:p-7 backdrop-blur-xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 dark:border-white/[0.06] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-sky-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Global Trade-to-GDP Ratio &amp; Geoeconomic Fragmentation
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                World trade peaked as a share of GDP in 2008 (~61%). Tracking this ratio quantifies friendshoring, nearshoring, and tariff barriers.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold border border-sky-500/20">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>2008 Peak: 61.0%</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Fragmentation Index (0-100)</span>
              </div>
            </div>
          </div>

          <div className="h-[360px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredSeries} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                <YAxis
                  yAxisId="left"
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={11}
                  domain={[20, 75]}
                  unit="%"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={isDark ? '#c084fc' : '#9333ea'}
                  fontSize={11}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(val: any, name: any) => [
                    name === 'worldTradeToGdpPct' ? `${val}%` : `${val} / 100`,
                    name === 'worldTradeToGdpPct' ? 'Trade-to-GDP (%)' : 'Fragmentation Index',
                  ]}
                  labelFormatter={(lbl, items) => {
                    const pt = items?.[0]?.payload as HistoricalPhysicalEconomyPoint;
                    return pt?.eventNote ? `${lbl} — ${pt.eventNote}` : lbl;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                {/* 2008 Peak Globalization Benchmark Reference Line */}
                <ReferenceLine
                  yAxisId="left"
                  y={61.0}
                  stroke="#38bdf8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: '2008 Peak Globalization (61.0%)',
                    position: 'top',
                    fill: '#38bdf8',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="worldTradeToGdpPct"
                  name="World Trade-to-GDP (%)"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#0284c7' }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="geoeconomicFragmentationIndex"
                  name="Geoeconomic Fragmentation Index"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#a855f7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Trade Openness Comparison Bar Chart */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Cross-Country Trade Openness Comparison (% of GDP)
              </span>
              <span className="text-[11px] text-slate-500">
                Exports + Imports relative to Nominal GDP
              </span>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalTradeComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                  <XAxis
                    dataKey="regionId"
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickFormatter={(val) => {
                      const p = REGIONAL_PHYSICAL_ECONOMY_PROFILES[val as PhysicalEconomyRegionId];
                      return `${p.flag} ${val}`;
                    }}
                  />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any) => [
                      `${val}%`,
                      name === 'tradeToGdpPct' ? 'Trade / GDP' : 'Historical Peak Trade / GDP',
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="tradeToGdpPct" name="Current Trade / GDP" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="peakTradePct" name="Peak Trade / GDP" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Chart 3: Old-Age Dependency Ratio & Working-Age Population Cliff */}
      {(activeView === 'overview' || activeView === 'demographics') && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-slate-900/80 p-5 sm:p-7 backdrop-blur-xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 dark:border-white/[0.06] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Old-Age Dependency Ratio &amp; Working-Age Population Cliff
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                The secular demographic cliff (working-age contraction in China, Japan &amp; EU) driving permanent fiscal dominance, pension shortfalls &amp; healthcare liabilities
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Dependency Ratio (Per 100 Workers)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Working-Age Growth (% YoY)</span>
              </div>
            </div>
          </div>

          <div className="h-[360px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_PHYSICAL_ECONOMY_SERIES} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                <YAxis
                  yAxisId="dep"
                  stroke={isDark ? '#c084fc' : '#9333ea'}
                  fontSize={11}
                  domain={[5, 30]}
                />
                <YAxis
                  yAxisId="growth"
                  orientation="right"
                  stroke={isDark ? '#34d399' : '#059669'}
                  fontSize={11}
                  domain={[-0.5, 2.5]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(val: any, name: any) => [
                    name === 'globalWorkingAgeGrowthPct' ? `${val}% YoY` : `${val} per 100`,
                    name === 'globalWorkingAgeGrowthPct' ? 'Working-Age Growth' : 'Dependency Ratio',
                  ]}
                  labelFormatter={(lbl, items) => {
                    const pt = items?.[0]?.payload as HistoricalPhysicalEconomyPoint;
                    return pt?.eventNote ? `${lbl} — ${pt.eventNote}` : lbl;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                {/* 0.0% Zero Growth Line for Working-Age Population */}
                <ReferenceLine
                  yAxisId="growth"
                  y={0.0}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: '0% Net Growth Line',
                    position: 'right',
                    fill: '#ef4444',
                    fontSize: 9,
                  }}
                />

                <Line
                  yAxisId="dep"
                  type="monotone"
                  dataKey="globalOldAgeDependencyRatio"
                  name="Global Old-Age Dependency Ratio"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#a855f7' }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  yAxisId="growth"
                  type="monotone"
                  dataKey="globalWorkingAgeGrowthPct"
                  name="Working-Age Annual Growth (% YoY)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cross-Country Demographic Contraction Table */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-white/[0.06] space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Working-Age Workforce Contraction &amp; Hyper-Aging Trajectories
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {regionalDemographicComparison
                .filter((r) => r.regionId !== 'GLOBAL')
                .map((country) => (
                  <div
                    key={country.regionId}
                    className="rounded-2xl p-3.5 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Med Age: {country.medianAge}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs pt-1">
                      <span className="text-slate-500 dark:text-slate-400">Working-Age Growth:</span>
                      <span
                        className={`font-mono font-bold ${
                          country.workingAgeGrowthPct < 0 ? 'text-rose-500' : 'text-emerald-500'
                        }`}
                      >
                        {country.workingAgeGrowthPct > 0 ? `+${country.workingAgeGrowthPct}%` : `${country.workingAgeGrowthPct}%`}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Dependency (2026):</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {country.dependencyRatio}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Projected (2050):</span>
                      <span className="font-mono font-bold text-purple-500">
                        {country.projectedRatio2050}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Regional Macro Dossier & Transmission Details Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-slate-900/80 p-5 sm:p-7 backdrop-blur-xl shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-200/60 dark:border-white/[0.06] pb-3">
          <Compass className="h-5 w-5 text-sky-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {activeProfile.flag} {activeProfile.name} — Physical Economy Transmission Dossier
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Energy Transmission Channel */}
          <div className="rounded-2xl p-4 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Flame className="h-4 w-4" />
              <span>Energy Vulnerability</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Energy Burden:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeProfile.energy.energyExpenditurePercentGdp}% of GDP</span>
              </div>
              <div className="flex justify-between">
                <span>Net Import Dependence:</span>
                <span className={`font-bold ${activeProfile.energy.energyNetImportDependencePct > 50 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {activeProfile.energy.energyNetImportDependencePct > 0 ? `+${activeProfile.energy.energyNetImportDependencePct}%` : `${activeProfile.energy.energyNetImportDependencePct}% (Exporter)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shock Sensitivity:</span>
                <span className="font-bold capitalize text-amber-500">{activeProfile.energy.vulnerabilityToOilShock}</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-white/[0.06]">
              Oil Share: {activeProfile.energy.oilSharePct}% | Gas: {activeProfile.energy.gasSharePct}% | Renewables: {activeProfile.energy.renewablesSharePct}%
            </div>
          </div>

          {/* Trade Transmission Channel */}
          <div className="rounded-2xl p-4 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Globe2 className="h-4 w-4" />
              <span>Trade &amp; Friendshoring</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Trade Openness:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeProfile.trade.tradeToGdpPct}% of GDP</span>
              </div>
              <div className="flex justify-between">
                <span>Peak Trade Year:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeProfile.trade.peakTradeYear} ({activeProfile.trade.peakTradeRatioPct}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Friendshoring Posture:</span>
                <span className="font-bold capitalize text-sky-500">{activeProfile.trade.friendshoringExposure}</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-white/[0.06] line-clamp-2">
              {activeProfile.trade.strategicSupplyChainVulnerability}
            </div>
          </div>

          {/* Demographic Cliff & Fiscal Dominance */}
          <div className="rounded-2xl p-4 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <Users className="h-4 w-4" />
              <span>Demographic Cliff</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Working-Age Growth:</span>
                <span className={`font-bold ${activeProfile.demographics.workingAgeGrowthPct < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {activeProfile.demographics.workingAgeGrowthPct}% YoY
                </span>
              </div>
              <div className="flex justify-between">
                <span>Old-Age Dependency:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeProfile.demographics.oldAgeDependencyRatio} per 100</span>
              </div>
              <div className="flex justify-between">
                <span>2050 Projected:</span>
                <span className="font-bold text-purple-500">{activeProfile.demographics.projectedDependencyRatio2050} per 100</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-white/[0.06] line-clamp-2">
              {activeProfile.demographics.macroTransmissionNote}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
