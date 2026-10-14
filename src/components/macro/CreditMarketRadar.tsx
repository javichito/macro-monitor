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
  REGIONAL_CREDIT_PROFILES,
  HISTORICAL_CREDIT_SERIES,
  getCreditStressLabel,
  getNfciRegimeLabel,
  getLatestCreditState,
} from '../../data/credit-market-data';
import { CreditRegionId } from '../../lib/types';
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
  Globe2,
} from 'lucide-react';

type CreditRadarView = 'oas' | 'nfci' | 'sloos' | 'tiers';

export function CreditMarketRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState<CreditRadarView>('oas');
  const [selectedRegion, setSelectedRegion] = useState<CreditRegionId>('GLOBAL');
  const [compareGlobalRegions, setCompareGlobalRegions] = useState<boolean>(true);
  const [seriesVisibility, setSeriesVisibility] = useState({
    usHy: true,
    euroHy: true,
    emCorp: true,
    globalAgg: true,
    usIg: false,
  });

  // Sync initial tab and region state from URL parameters to support deep links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('credit_view') as CreditRadarView;
    const regionParam = params.get('credit_region')?.toUpperCase() as CreditRegionId;

    if (viewParam && ['oas', 'nfci', 'sloos', 'tiers'].includes(viewParam)) {
      setActiveView(viewParam);
    }
    if (regionParam && ['GLOBAL', 'USA', 'EUR', 'EM'].includes(regionParam)) {
      setSelectedRegion(regionParam);
    }
  }, []);

  const latestState = useMemo(() => getLatestCreditState(), []);
  const activeProfile = REGIONAL_CREDIT_PROFILES[selectedRegion];

  const regionStress = useMemo(
    () => getCreditStressLabel(activeProfile.highYieldOasBps),
    [activeProfile.highYieldOasBps]
  );

  const regionNfciRegime = useMemo(
    () => getNfciRegimeLabel(activeProfile.fciIndex),
    [activeProfile.fciIndex]
  );

  // Filter live alerts for the selected region or global scope
  const visibleAlerts = useMemo(() => {
    return latestState.activeAlerts.filter(
      (alert) => selectedRegion === 'GLOBAL' || alert.regionId === selectedRegion || alert.regionId === 'GLOBAL'
    );
  }, [latestState.activeAlerts, selectedRegion]);

  // Format historical series for CSV/JSON exports
  const exportColumns = useMemo(
    () => [
      { key: 'date', label: 'Date' },
      { key: 'year', label: 'Year' },
      { key: 'globalCorporateOasBps', label: 'Global Corporate OAS (bps)' },
      { key: 'usHighYieldOasBps', label: 'US High Yield OAS (bps)' },
      { key: 'euroHighYieldOasBps', label: 'Euro High Yield OAS (bps)' },
      { key: 'emCorporateOasBps', label: 'EM Corporate OAS (bps)' },
      { key: 'usInvestmentGradeOasBps', label: 'US IG OAS (bps)' },
      { key: 'euroInvestmentGradeOasBps', label: 'Euro IG OAS (bps)' },
      { key: 'us10YYieldPercent', label: 'US 10Y Yield (%)' },
      { key: 'chicagoFedNfci', label: 'Chicago Fed NFCI' },
      { key: 'euroCiss', label: 'ECB CISS Index' },
      { key: 'globalFci', label: 'Global FCI Index' },
      { key: 'sloosNetTighteningPct', label: 'Fed SLOOS Net Tightening (%)' },
      { key: 'ecbBlsNetTighteningPct', label: 'ECB BLS Net Tightening (%)' },
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
              <span>Global Credit &amp; Solvency Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>Corporate Credit Spreads &amp; Financial Conditions</span>
              <span className="text-xl sm:text-2xl">{activeProfile.flag}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Cross-border tracking of Option-Adjusted Spreads (OAS) across the US, Eurozone, and Emerging Markets, alongside the Chicago Fed NFCI, ECB Systemic Stress (CISS), and Bank Lending Surveys (SLOOS &amp; BLS).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            {/* Region Selector Switcher */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] text-xs">
              {(['GLOBAL', 'USA', 'EUR', 'EM'] as CreditRegionId[]).map((regId) => {
                const reg = REGIONAL_CREDIT_PROFILES[regId];
                const isSelected = selectedRegion === regId;
                return (
                  <button
                    key={regId}
                    onClick={() => setSelectedRegion(regId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    <span>{reg.flag}</span>
                    <span className="hidden sm:inline">{reg.shortName}</span>
                  </button>
                );
              })}
            </div>

            <DataExportMenu
              data={HISTORICAL_CREDIT_SERIES}
              columns={exportColumns}
              filename="global-credit-spreads-financial-conditions"
              title="Global Corporate Credit Spreads & Financial Conditions History (2000-2026)"
              metadata={{
                source: 'ICE BofA (US & Euro OAS), J.P. Morgan (CEMBI), Federal Reserve (SLOOS & NFCI), European Central Bank (BLS & CISS)',
                methodology: 'Option-Adjusted Spreads isolate pure default risk premiums across sovereign benchmark curves.',
              }}
            />
          </div>
        </div>

        {/* Live Evaluated Telemetry Alerts Banner */}
        {visibleAlerts.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Automated Telemetry Alerts ({latestState.timestamp.slice(0, 10)})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    alert.level === 'CRITICAL'
                      ? 'bg-rose-500/[0.08] border-rose-500/30 text-rose-900 dark:text-rose-200'
                      : alert.level === 'WARNING'
                      ? 'bg-amber-500/[0.08] border-amber-500/30 text-amber-900 dark:text-amber-200'
                      : alert.level === 'COMPRESSED'
                      ? 'bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                      : 'bg-sky-500/[0.08] border-sky-500/30 text-sky-900 dark:text-sky-200'
                  }`}
                >
                  <div className="font-bold">{alert.headline}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed opacity-90">
                    {alert.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4 Primary Hero KPI Cards (Dynamically Adapting to Selected Region) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.08]">
          {/* Card 1: Regional High Yield OAS */}
          <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] relative group">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {activeProfile.shortName} High Yield OAS
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${regionStress.badgeClass}`}>
                {regionStress.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeProfile.highYieldOasBps}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">bps</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Yield: {activeProfile.effectiveHighYieldPct}%</span>
              <span>{activeProfile.historicalPercentile}th Percentile</span>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {activeProfile.benchmarkTenor}
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
                {activeProfile.investmentGradeOasBps}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">bps</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Effective Yield: {activeProfile.effectiveIgYieldPct}%</span>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              BBB Frontier: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeProfile.bbbSpreadBps} bps</span>
            </div>
          </div>

          {/* Card 3: Regional Financial Conditions Index */}
          <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] relative group">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {selectedRegion === 'USA' ? 'Chicago Fed NFCI' : selectedRegion === 'EUR' ? 'ECB CISS Index' : 'Financial Conditions'}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${regionNfciRegime.badgeClass}`}>
                {regionNfciRegime.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {activeProfile.fciIndex > 0 ? `+${activeProfile.fciIndex.toFixed(2)}` : activeProfile.fciIndex.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedRegion === 'EUR' ? '(0 to 1 scale)' : '(0.0 = Avg)'}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Regime: <strong className="text-slate-700 dark:text-slate-300 capitalize">{activeProfile.fciRegime.replace('_', ' ')}</strong></span>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {selectedRegion === 'USA' ? '105 Financial Indicators' : selectedRegion === 'EUR' ? 'Euro Systemic Stress Gauge' : 'Cross-border Aggregate'}
            </div>
          </div>

          {/* Card 4: Bank Lending Standards */}
          <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] relative group">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Bank Tightening</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                Stabilized
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                +{activeProfile.bankLendingNetTighteningPct}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Net %</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              <span>{activeProfile.surveyName}</span>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 truncate">
              Corporate &amp; Enterprise Underwriting
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
            <span>Financial Conditions (FCI)</span>
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
            <span>Bank Lending Standards</span>
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

        {activeView === 'oas' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextCompare = !compareGlobalRegions;
                setCompareGlobalRegions(nextCompare);
                if (nextCompare) {
                  // In multi-region comparison mode, make all primary regional curves visible
                  setSeriesVisibility((prev) => ({
                    ...prev,
                    usHy: true,
                    euroHy: true,
                    emCorp: true,
                    globalAgg: true,
                  }));
                } else {
                  // In single-region focus mode, isolate the currently selected regional benchmark
                  setSeriesVisibility({
                    usHy: selectedRegion === 'USA',
                    euroHy: selectedRegion === 'EUR',
                    emCorp: selectedRegion === 'EM',
                    globalAgg: selectedRegion === 'GLOBAL',
                    usIg: false,
                  });
                }
              }}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                compareGlobalRegions
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                  : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>{compareGlobalRegions ? 'Comparing All Regions' : 'Focus Active Region'}</span>
            </button>
          </div>
        )}
      </div>

      {/* View 1: Credit Spreads (OAS) */}
      {activeView === 'oas' && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Multi-Decade Option-Adjusted Spread Trajectory</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {compareGlobalRegions
                  ? 'Cross-border comparison: US High Yield, Euro High Yield, Emerging Markets, and Global Corporate OAS.'
                  : `Focused view on ${activeProfile.name} corporate credit risk premium.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSeriesVisibility((prev) => ({ ...prev, usHy: !prev.usHy }))}
                aria-label="Toggle US High Yield series"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                  seriesVisibility.usHy
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/[0.06] line-through opacity-60'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${seriesVisibility.usHy ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                <span>US High Yield</span>
              </button>
              <button
                type="button"
                onClick={() => setSeriesVisibility((prev) => ({ ...prev, euroHy: !prev.euroHy }))}
                aria-label="Toggle Euro High Yield series"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                  seriesVisibility.euroHy
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/[0.06] line-through opacity-60'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${seriesVisibility.euroHy ? 'bg-sky-500' : 'bg-slate-400'}`}></span>
                <span>Euro High Yield</span>
              </button>
              <button
                type="button"
                onClick={() => setSeriesVisibility((prev) => ({ ...prev, emCorp: !prev.emCorp }))}
                aria-label="Toggle EM Corporate series"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                  seriesVisibility.emCorp
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/[0.06] line-through opacity-60'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${seriesVisibility.emCorp ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                <span>EM Corporate</span>
              </button>
              <button
                type="button"
                onClick={() => setSeriesVisibility((prev) => ({ ...prev, globalAgg: !prev.globalAgg }))}
                aria-label="Toggle Global Corporate OAS series"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                  seriesVisibility.globalAgg
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/[0.06] line-through opacity-60'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${seriesVisibility.globalAgg ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                <span>Global Agg</span>
              </button>
              <button
                type="button"
                onClick={() => setSeriesVisibility((prev) => ({ ...prev, usIg: !prev.usIg }))}
                aria-label="Toggle US Investment Grade series"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                  seriesVisibility.usIg
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/[0.06] opacity-60'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${seriesVisibility.usIg ? 'bg-purple-500' : 'bg-slate-400'}`}></span>
                <span>US IG</span>
              </button>
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
                            {seriesVisibility.usHy && (
                              <div className="flex justify-between text-rose-500 font-semibold">
                                <span>US High Yield:</span>
                                <span>{data.usHighYieldOasBps} bps</span>
                              </div>
                            )}
                            {seriesVisibility.euroHy && (
                              <div className="flex justify-between text-sky-500 font-semibold">
                                <span>Euro High Yield:</span>
                                <span>{data.euroHighYieldOasBps} bps</span>
                              </div>
                            )}
                            {seriesVisibility.emCorp && (
                              <div className="flex justify-between text-amber-500 font-semibold">
                                <span>EM Corporate:</span>
                                <span>{data.emCorporateOasBps} bps</span>
                              </div>
                            )}
                            {seriesVisibility.globalAgg && (
                              <div className="flex justify-between text-emerald-500 font-semibold">
                                <span>Global Agg:</span>
                                <span>{data.globalCorporateOasBps} bps</span>
                              </div>
                            )}
                            {seriesVisibility.usIg && (
                              <div className="flex justify-between text-purple-500 font-semibold">
                                <span>US Inv. Grade:</span>
                                <span>{data.usInvestmentGradeOasBps} bps</span>
                              </div>
                            )}
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

                {/* Recharts React 19 compatibility: Direct children without JSX fragment wrappers to allow internal toArray() discovery */}
                {seriesVisibility.usHy && (
                  <Line
                    type="monotone"
                    dataKey="usHighYieldOasBps"
                    name="US High Yield"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: '#f43f5e' }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {seriesVisibility.euroHy && (
                  <Line
                    type="monotone"
                    dataKey="euroHighYieldOasBps"
                    name="Euro High Yield"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#0ea5e9' }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {seriesVisibility.emCorp && (
                  <Line
                    type="monotone"
                    dataKey="emCorporateOasBps"
                    name="EM Corporate"
                    stroke="#f59e0b"
                    strokeWidth={1.75}
                    strokeDasharray="3 3"
                    dot={{ r: 2.5, fill: '#f59e0b' }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {seriesVisibility.globalAgg && (
                  <Line
                    type="monotone"
                    dataKey="globalCorporateOasBps"
                    name="Global Agg"
                    stroke="#10b981"
                    strokeWidth={1.75}
                    dot={{ r: 2.5, fill: '#10b981' }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {seriesVisibility.usIg && (
                  <Line
                    type="monotone"
                    dataKey="usInvestmentGradeOasBps"
                    name="US Inv. Grade"
                    stroke="#a855f7"
                    strokeWidth={1.75}
                    strokeDasharray="4 4"
                    dot={{ r: 2, fill: '#a855f7' }}
                    activeDot={{ r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Contextual Guidance Callout */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="h-4 w-4 text-sky-500" />
              <span>Cross-Border Dynamic: {activeProfile.name}</span>
            </div>
            <p>{activeProfile.macroNote}</p>
          </div>
        </div>
      )}

      {/* View 2: Financial Conditions (FCI & CISS) */}
      {activeView === 'nfci' && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Global Financial Conditions &amp; Systemic Stress Indices</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparing Chicago Fed NFCI (US), ECB Composite Indicator of Systemic Stress (CISS), and the Global Financial Conditions Index.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Chicago Fed NFCI
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-sky-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span> ECB CISS (x5)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-purple-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span> Global FCI
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
                              <span>Chicago Fed NFCI:</span>
                              <span>{data.chicagoFedNfci.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sky-500 font-semibold">
                              <span>Eurozone ECB CISS:</span>
                              <span>{data.euroCiss.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-purple-500 font-semibold">
                              <span>Global FCI:</span>
                              <span>{data.globalFci.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

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
                  name="US NFCI"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#10b981' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="euroCiss"
                  name="Euro CISS"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="globalFci"
                  name="Global FCI"
                  stroke="#a855f7"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Indicator Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                US Chicago Fed NFCI
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                {CREDIT_MARKET_OVERVIEW.financialConditions.currentNfci}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Aggregates 105 indicators spanning money markets, equity multiple expansion, and shadow banking repo leverage.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-500 block">
                Eurozone ECB CISS
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                {REGIONAL_CREDIT_PROFILES.EUR.fciIndex}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                European Central Bank Composite Indicator of Systemic Stress (0 to 1). Readings below 0.25 indicate orderly financial market transmission.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-500 block">
                Global Aggregate FCI
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                {REGIONAL_CREDIT_PROFILES.GLOBAL.fciIndex}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Weighted composite reflecting multi-lateral exchange rates, cross-border corporate OAS, and central bank liquidity easing cycles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Bank Lending Standards (SLOOS & BLS) */}
      {activeView === 'sloos' && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>International Bank Lending Surveys: US SLOOS vs. Eurozone BLS</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Net percentage of commercial banks tightening underwriting standards for enterprise loans across major global jurisdictions.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span> US Fed SLOOS (%)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-sky-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span> Eurozone ECB BLS (%)
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
                              <span>US SLOOS Net:</span>
                              <span>{data.sloosNetTighteningPct > 0 ? `+${data.sloosNetTighteningPct}%` : `${data.sloosNetTighteningPct}%`}</span>
                            </div>
                            <div className="flex justify-between text-sky-500 font-semibold">
                              <span>Eurozone BLS Net:</span>
                              <span>{data.ecbBlsNetTighteningPct > 0 ? `+${data.ecbBlsNetTighteningPct}%` : `${data.ecbBlsNetTighteningPct}%`}</span>
                            </div>
                          </div>
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
                <Bar dataKey="sloosNetTighteningPct" name="US SLOOS Net (%)" fill="#f59e0b" />
                <Bar dataKey="ecbBlsNetTighteningPct" name="Eurozone BLS Net (%)" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Granular Sector Breakdown List for Selected Region */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lending Standards by Sector ({activeProfile.name})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeProfile.lendingSectors.map((sec) => (
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

      {/* View 4: Corporate Rating Tier Matrix */}
      {activeView === 'tiers' && (
        <div className="apple-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Corporate Credit Rating Spread &amp; Default Matrix: {activeProfile.name}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current Option-Adjusted Spreads (OAS), effective yields, 12-month default rates, and debt market shares across credit rating tiers.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Benchmark: {activeProfile.benchmarkTenor}</span>
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
                  <th className="py-3 px-3 text-right">Delta vs Gov</th>
                  <th className="py-3 px-3 text-right">Default Rate (12M)</th>
                  <th className="py-3 px-3 text-right">Market Share</th>
                  <th className="py-3 px-4">Credit Profile &amp; Risk Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {activeProfile.ratingTiers.map((tier) => {
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
              BBB-rated corporate bonds represent <strong>over 45% to 51% of all corporate investment-grade debt worldwide</strong> ($8.5T+ globally). When institutional pension mandates, insurance funds, and sovereign reserve managers are legally restricted to Investment Grade, a downgrade across the BBB/BB boundary forces non-discretionary liquidation, inducing steep price gaps in secondary debt markets.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
