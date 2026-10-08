'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  CURRENT_ACCOUNT_PROFILES,
  DXY_PROFILE_DATA,
  REER_CURRENCY_PROFILES,
  GSCPI_PROFILE_DATA,
  CAPITAL_FLOWS_TIC_DATA,
  calculateTwinDeficitGap,
} from '../../data/external-sector-data';
import latestExternalStatus from '../../data/latest-external-status.json';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import {
  Globe2,
  Ship,
  Coins,
  TrendingUp,
  TrendingDown,
  Layers,
  Landmark,
  Scale,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Info,
  Calendar,
  DollarSign,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

type ExternalTab = 'overview' | 'bop' | 'fx-reer' | 'gscpi' | 'capital-flows';
type BlocFilter = 'all' | 'g7' | 'brics' | 'surplus' | 'deficit';

export function ExternalSectorRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<ExternalTab>('overview');
  const [blocFilter, setBlocFilter] = useState<BlocFilter>('all');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('USA');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');

  // Filter balance of payments country list according to selected economic coalition
  const filteredBopProfiles = useMemo(() => {
    return CURRENT_ACCOUNT_PROFILES.filter((profile) => {
      if (blocFilter === 'all') return true;
      if (blocFilter === 'g7') return profile.bloc === 'g7';
      if (blocFilter === 'brics') return profile.bloc === 'brics';
      if (blocFilter === 'surplus') return profile.currentAccountPercentGdp > 0;
      if (blocFilter === 'deficit') return profile.currentAccountPercentGdp < 0;
      return true;
    });
  }, [blocFilter]);

  // Selected country profile for deep dive panel
  const selectedCountry = useMemo(() => {
    return (
      CURRENT_ACCOUNT_PROFILES.find((p) => p.countryCode === selectedCountryCode) ||
      CURRENT_ACCOUNT_PROFILES[0]
    );
  }, [selectedCountryCode]);

  // Selected REER currency profile
  const selectedReerProfile = useMemo(() => {
    return (
      REER_CURRENCY_PROFILES.find((p) => p.currencyCode === selectedCurrencyCode) ||
      REER_CURRENCY_PROFILES[0]
    );
  }, [selectedCurrencyCode]);

  // Prepare Recharts bar series for Current Account % of GDP ranking
  const bopRankingChartData = useMemo(() => {
    return [...filteredBopProfiles]
      .sort((a, b) => b.currentAccountPercentGdp - a.currentAccountPercentGdp)
      .map((p) => ({
        country: `${p.flag} ${p.countryCode}`,
        name: p.countryName,
        caGdp: p.currentAccountPercentGdp,
        tradeBalance: p.tradeBalanceBillionUSD,
        fiscalBalance: p.fiscalBalancePercentGdp,
        twinDeficit: calculateTwinDeficitGap(p.fiscalBalancePercentGdp, p.currentAccountPercentGdp),
        isSurplus: p.currentAccountPercentGdp >= 0,
      }));
  }, [filteredBopProfiles]);

  // Prepare REER valuation deviation series
  const reerDeviationChartData = useMemo(() => {
    return [...REER_CURRENCY_PROFILES]
      .sort((a, b) => b.valuationDeviationPct - a.valuationDeviationPct)
      .map((r) => ({
        currency: `${r.flag} ${r.currencyCode}`,
        name: r.currencyName,
        deviation: r.valuationDeviationPct,
        currentReer: r.currentReer,
        riskScore: r.devaluationRiskScore,
        fill:
          r.valuationDeviationPct >= 10
            ? '#38bdf8' // Overvalued USD/allied
            : r.valuationDeviationPct <= -15
            ? '#f43f5e' // Deeply undervalued JPY
            : r.valuationDeviationPct < 0
            ? '#fbbf24'
            : '#10b981',
      }));
  }, []);

  // Format GSCPI timeline for Recharts Line visualization
  const gscpiTimelineData = useMemo(() => {
    return GSCPI_PROFILE_DATA.historicalSeries.map((pt) => ({
      period: pt.period,
      stdDev: pt.stdDevLevel,
      cpiInflation: pt.headlineCpiLaggedLead,
      annotation: pt.eventAnnotation,
    }));
  }, []);

  // Format TIC foreign debt ownership evolution
  const foreignOwnershipData = useMemo(() => {
    return CAPITAL_FLOWS_TIC_DATA.historicalOwnership.map((row) => ({
      year: row.year.toString(),
      totalDebt: row.totalMarketableDebtTrillion,
      foreignHoldings: row.totalForeignHoldingsTrillion,
      foreignSharePct: row.foreignSharePct,
      officialHoldings: row.foreignOfficialHoldingsTrillion,
      privateHoldings: row.foreignPrivateHoldingsTrillion,
    }));
  }, []);

  // Format Central Bank Reserve Diversification data
  const reserveDiversificationData = useMemo(() => {
    return CAPITAL_FLOWS_TIC_DATA.reserveDiversification.map((row) => ({
      year: row.year.toString(),
      usd: row.usdSharePct,
      eur: row.eurSharePct,
      gold: row.goldSharePct,
      other: row.otherCurrenciesPct,
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <Globe2 className="h-3.5 w-3.5" />
              <span>External Sector, Balance of Payments &amp; FX Strength</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Global External Solvency &amp; Currency Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Track Current Account &amp; trade surpluses/deficits as % of GDP, US Dollar Index (DXY) and Real Effective Exchange Rates (REER), NY Fed Global Supply Chain Pressure (GSCPI), and US Treasury sovereign capital flows (TIC).
            </p>
          </div>

          {/* Tab Navigation Controls & Data Export */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] p-1 border border-slate-200 dark:border-white/[0.08] text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('bop')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'bop'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Scale className="h-3.5 w-3.5" />
                <span>Current Account &amp; BoP</span>
              </button>
              <button
                onClick={() => setActiveTab('fx-reer')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'fx-reer'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Coins className="h-3.5 w-3.5" />
                <span>DXY &amp; REER FX</span>
              </button>
              <button
                onClick={() => setActiveTab('gscpi')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'gscpi'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Ship className="h-3.5 w-3.5" />
                <span>GSCPI Supply Chain</span>
              </button>
              <button
                onClick={() => setActiveTab('capital-flows')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                  activeTab === 'capital-flows'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Landmark className="h-3.5 w-3.5" />
                <span>TIC Capital Flows</span>
              </button>
            </div>

            {/* One-click Data Export for Researchers & Journalists */}
            <DataExportMenu
              title={`External Sector Radar [${
                activeTab === 'overview' || activeTab === 'bop'
                  ? 'Current Account & Balance of Payments'
                  : activeTab === 'fx-reer'
                  ? 'REER Real Effective Exchange Rates'
                  : activeTab === 'gscpi'
                  ? 'NY Fed Global Supply Chain Pressure Index'
                  : 'US TIC Foreign Treasury Capital Flows'
              }]`}
              filename={`external-sector-${activeTab}`}
              data={() =>
                activeTab === 'overview' || activeTab === 'bop'
                  ? CURRENT_ACCOUNT_PROFILES.map((p) => ({
                      countryCode: p.countryCode,
                      countryName: p.countryName,
                      bloc: p.bloc,
                      currentAccountPercentGdp: p.currentAccountPercentGdp,
                      fiscalBalancePercentGdp: p.fiscalBalancePercentGdp,
                      twinDeficitGapPercent: calculateTwinDeficitGap(p.fiscalBalancePercentGdp, p.currentAccountPercentGdp),
                      tradeBalanceBillionUSD: p.tradeBalanceBillionUSD,
                      fxReservesBillionUSD: p.fxReservesBillionUSD,
                      externalDebtToGdp: p.externalDebtToGdp,
                      solvencyRiskLevel: p.solvencyRiskLevel,
                    }))
                  : activeTab === 'fx-reer'
                  ? REER_CURRENCY_PROFILES.map((r) => ({
                      currencyCode: r.currencyCode,
                      currencyName: r.currencyName,
                      countryName: r.countryName,
                      currentReer: r.currentReer,
                      tenYearAverageReer: r.tenYearAverageReer,
                      valuationDeviationPct: r.valuationDeviationPct,
                      valuationStatus: r.valuationStatus,
                      devaluationRiskScore: r.devaluationRiskScore,
                      keyDriver: r.keyDriver,
                    }))
                  : activeTab === 'gscpi'
                  ? GSCPI_PROFILE_DATA.historicalSeries.map((g) => ({
                      period: g.period,
                      stdDevLevel: g.stdDevLevel,
                      headlineCpiLaggedLead: g.headlineCpiLaggedLead,
                      eventAnnotation: g.eventAnnotation ?? '',
                    }))
                  : CAPITAL_FLOWS_TIC_DATA.holders.map((h) => ({
                      countryCode: h.countryCode,
                      countryName: h.countryName,
                      holdingsBillionUSD: h.holdingsBillionUSD,
                      twelveMonthChangeBillionUSD: h.twelveMonthChangeBillionUSD,
                      shareOfForeignHoldingsPct: h.shareOfForeignHoldingsPct,
                      shareOfTotalUsDebtPct: h.shareOfTotalUsDebtPct,
                      dominantHolderType: h.dominantHolderType,
                      strategicDirection: h.strategicDirection,
                    }))
              }
              columns={
                activeTab === 'overview' || activeTab === 'bop'
                  ? [
                      { key: 'countryCode', label: 'Country Code' },
                      { key: 'countryName', label: 'Country' },
                      { key: 'bloc', label: 'Coalition Bloc' },
                      { key: 'currentAccountPercentGdp', label: 'Current Account (% of GDP)' },
                      { key: 'fiscalBalancePercentGdp', label: 'Fiscal Balance (% of GDP)' },
                      { key: 'twinDeficitGapPercent', label: 'Twin Deficit Gap (% of GDP)' },
                      { key: 'tradeBalanceBillionUSD', label: 'Trade Balance ($B USD)' },
                      { key: 'fxReservesBillionUSD', label: 'Foreign FX Reserves ($B USD)' },
                      { key: 'externalDebtToGdp', label: 'External Debt (% of GDP)' },
                      { key: 'solvencyRiskLevel', label: 'Solvency Risk Level' },
                    ]
                  : activeTab === 'fx-reer'
                  ? [
                      { key: 'currencyCode', label: 'Currency Code' },
                      { key: 'currencyName', label: 'Currency' },
                      { key: 'countryName', label: 'Country' },
                      { key: 'currentReer', label: 'Current REER Index' },
                      { key: 'tenYearAverageReer', label: '10-Year Mean Baseline' },
                      { key: 'valuationDeviationPct', label: 'Valuation Gap (%)' },
                      { key: 'valuationStatus', label: 'Valuation Regime' },
                      { key: 'devaluationRiskScore', label: 'Devaluation Risk Score (0-100)' },
                      { key: 'keyDriver', label: 'Key Driver' },
                    ]
                  : activeTab === 'gscpi'
                  ? [
                      { key: 'period', label: 'Period' },
                      { key: 'stdDevLevel', label: 'GSCPI (Standard Deviations)' },
                      { key: 'headlineCpiLaggedLead', label: 'Lagged Inflation Transmission (%)' },
                      { key: 'eventAnnotation', label: 'Macro Event' },
                    ]
                  : [
                      { key: 'countryCode', label: 'Country Code' },
                      { key: 'countryName', label: 'Foreign Sovereign / Jurisdiction' },
                      { key: 'holdingsBillionUSD', label: 'US Treasuries Held ($B USD)' },
                      { key: 'twelveMonthChangeBillionUSD', label: '12-Month Net Change ($B USD)' },
                      { key: 'shareOfForeignHoldingsPct', label: 'Share of Foreign Total (%)' },
                      { key: 'shareOfTotalUsDebtPct', label: 'Share of Total US Debt (%)' },
                      { key: 'dominantHolderType', label: 'Holder Classification' },
                      { key: 'strategicDirection', label: 'Strategic Trajectory' },
                    ]
              }
              metadata={{
                description:
                  activeTab === 'overview' || activeTab === 'bop'
                    ? 'Current Account and Balance of Payments data including trade surpluses and twin deficits.'
                    : activeTab === 'fx-reer'
                    ? 'BIS Real Effective Exchange Rates adjusted for multilateral inflation differentials.'
                    : activeTab === 'gscpi'
                    ? 'Federal Reserve Bank of New York Global Supply Chain Pressure Index.'
                    : 'US Treasury International Capital (TIC) foreign sovereign debt ownership statistics.',
                source: 'Bank for International Settlements (BIS), IMF BoP, NY Fed, US Treasury TIC',
                activeTab,
              }}
            />
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-5">
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">US Dollar Index (DXY)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{DXY_PROFILE_DATA.currentIndex}</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+{DXY_PROFILE_DATA.ytdChangePct}% YTD</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Rate differential driven</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">NY Fed GSCPI (Supply Stress)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">+{GSCPI_PROFILE_DATA.currentStdDev}σ</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Normal</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">58th percentile historical</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">US Twin Deficit Gap</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400">-9.8%</span>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">of GDP</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">-$1.85T combined deficit</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">China Trade Surplus</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">+$915B</span>
              <span className="text-xs font-semibold text-slate-500">+2.3% GDP</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Goods surplus: $1,080B</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Foreign Share of US Debt</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{CAPITAL_FLOWS_TIC_DATA.foreignShareOfUsDebtPct}%</span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Diluting</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Down from 43% peak in 2012</p>
          </div>
        </div>
      </div>

      {/* Active Alerts Banner */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <Activity className="h-3.5 w-3.5 text-sky-500" />
          <span>Active External Sector &amp; Sovereign Capital Alerts</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {latestExternalStatus.currentAccountAlerts.slice(0, 1).map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  {alert.headline}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{alert.body}</p>
            </div>
          ))}

          {latestExternalStatus.reerExtremeAlerts.slice(0, 1).map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {alert.headline}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{alert.body}</p>
            </div>
          ))}

          {latestExternalStatus.ticFlowAlerts.slice(0, 1).map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-sky-500/20 bg-sky-50/50 dark:bg-sky-950/20 p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                  <Coins className="h-4 w-4 shrink-0" />
                  {alert.headline}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{alert.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW 1: OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Cross-Economy Twin Deficits vs Surpluses Overview */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="h-5 w-5 text-sky-500" />
                  <span>Current Account Balance (% of GDP) Across Major Economies</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Surpluses (&gt;0%) indicate net capital exporters; deficits (&lt;0%) denote economies dependent on foreign capital inflows.
                </p>
              </div>

              {/* Bloc filters */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.06] p-1 rounded-xl text-xs">
                {(['all', 'g7', 'brics', 'surplus', 'deficit'] as BlocFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setBlocFilter(f)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer uppercase text-[10px] ${
                      blocFilter === f
                        ? 'bg-white dark:bg-white dark:text-black text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bopRankingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                  <XAxis
                    dataKey="country"
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#cbd5e1',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val}% of GDP (Trade: $${item.payload.tradeBalance}B)`,
                      'Current Account',
                    ]}
                  />
                  <ReferenceLine y={0} stroke={isDark ? '#cbd5e1' : '#475569'} strokeWidth={1.5} />
                  <Bar dataKey="caGdp" radius={[4, 4, 0, 0]}>
                    {bopRankingChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isSurplus ? '#10b981' : '#f43f5e'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Explanatory annotation banner */}
            <div className="mt-4 p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Info className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Structural Polarization: </span>
                Germany (+6.8%), Japan (+3.8%), and China (+2.3%) run persistent current account surpluses, accumulating foreign claims. Conversely, the US (-3.4%) and UK (-3.2%) run structural twin deficits, relying on foreign institutional demand to finance national debt issuance.
              </div>
            </div>
          </div>

          {/* Dual Columns: REER Misalignments + GSCPI Supply Pressure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real Effective Exchange Rate (REER) Highlights */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Coins className="h-4 w-4 text-amber-500" />
                    <span>Real Effective Exchange Rate (REER) Misalignment</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    % deviation from 10-year trade-weighted purchasing power equilibrium.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('fx-reer')}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View Full FX Matrix <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reerDeviationChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                    <XAxis
                      dataKey="currency"
                      stroke={isDark ? '#94a3b8' : '#64748b'}
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke={isDark ? '#94a3b8' : '#64748b'}
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val}% vs 10Y Mean`, 'REER Deviation']}
                    />
                    <ReferenceLine y={0} stroke={isDark ? '#94a3b8' : '#64748b'} />
                    <Bar dataKey="deviation" radius={[4, 4, 0, 0]}>
                      {reerDeviationChartData.map((entry, index) => (
                        <Cell key={`reer-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                USD trades at +13.0% overvaluation (anchored by real rate differentials), while JPY remains deeply depressed at -22.9% below its 10-year mean.
              </div>
            </div>

            {/* NY Fed GSCPI Highlights */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Ship className="h-4 w-4 text-sky-500" />
                    <span>NY Fed Global Supply Chain Pressure (GSCPI)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Standard deviations from historical average (0 = neutral supply fluidity).
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('gscpi')}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View GSCPI Detail <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gscpiTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                    <XAxis
                      dataKey="period"
                      stroke={isDark ? '#94a3b8' : '#64748b'}
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke={isDark ? '#94a3b8' : '#64748b'}
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => `${v}σ`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: any, item: any) => [
                        `${val}σ (${item.payload.annotation || 'Checkpoint'})`,
                        'GSCPI',
                      ]}
                    />
                    <ReferenceLine y={2.0} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Extreme Bottleneck', fill: '#f43f5e', fontSize: 10 }} />
                    <ReferenceLine y={0.0} stroke={isDark ? '#94a3b8' : '#64748b'} />
                    <Line
                      type="monotone"
                      dataKey="stdDev"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#0284c7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                Logistics pressures peaked at +4.32σ during the December 2021 pandemic peak, currently standing at +0.28σ (equilibrium baseline).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CURRENT ACCOUNT & BALANCE OF PAYMENTS */}
      {activeTab === 'bop' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-sky-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Coalition &amp; Deficit Filter:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(['all', 'g7', 'brics', 'surplus', 'deficit'] as BlocFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setBlocFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer uppercase text-xs ${
                    blocFilter === f
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                      : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'All Economies' : f === 'g7' ? 'G7 Advanced' : f === 'brics' ? 'BRICS+ Coalition' : f === 'surplus' ? 'Surplus Economies' : 'Deficit Economies'}
                </button>
              ))}
            </div>
          </div>

          {/* Balance of Payments Ledger Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 dark:border-white/[0.08]">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Balance of Payments &amp; External Solvency Ledger (2026 Baseline)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Click any country row to inspect its historical current account trajectory, import coverage, and twin-deficit transmission.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Economy</th>
                    <th className="py-3 px-3 font-semibold text-right">CA % of GDP</th>
                    <th className="py-3 px-3 font-semibold text-right">Current Account ($B)</th>
                    <th className="py-3 px-3 font-semibold text-right">Trade Balance ($B)</th>
                    <th className="py-3 px-3 font-semibold text-right">Fiscal Deficit %</th>
                    <th className="py-3 px-3 font-semibold text-right">Twin Deficit %</th>
                    <th className="py-3 px-3 font-semibold text-right">FX Reserves ($B)</th>
                    <th className="py-3 px-3 font-semibold text-right">Import Cover</th>
                    <th className="py-3 px-4 font-semibold text-center">Solvency Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {filteredBopProfiles.map((p) => {
                    const twinDeficit = calculateTwinDeficitGap(p.fiscalBalancePercentGdp, p.currentAccountPercentGdp);
                    const isSelected = p.countryCode === selectedCountryCode;
                    return (
                      <tr
                        key={p.countryCode}
                        onClick={() => setSelectedCountryCode(p.countryCode)}
                        className={`transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.04] ${
                          isSelected ? 'bg-sky-500/10 dark:bg-sky-500/15' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="text-base">{p.flag}</span>
                          <div>
                            <div>{p.countryName}</div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">{p.bloc}</span>
                          </div>
                        </td>
                        <td className={`py-3 px-3 text-right font-semibold ${
                          p.currentAccountPercentGdp >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {p.currentAccountPercentGdp > 0 ? '+' : ''}{p.currentAccountPercentGdp}%
                        </td>
                        <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300 font-mono">
                          {p.currentAccountBillionUSD > 0 ? '+' : ''}${p.currentAccountBillionUSD}B
                        </td>
                        <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300 font-mono">
                          {p.tradeBalanceBillionUSD > 0 ? '+' : ''}${p.tradeBalanceBillionUSD}B
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 font-mono">
                          {p.fiscalBalancePercentGdp}%
                        </td>
                        <td className={`py-3 px-3 text-right font-mono font-semibold ${
                          twinDeficit <= -6.0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {twinDeficit}%
                        </td>
                        <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300 font-mono">
                          ${p.fxReservesBillionUSD}B
                        </td>
                        <td className={`py-3 px-3 text-right font-mono ${
                          p.importCoverMonths < 3.0 ? 'text-rose-500 font-bold' : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {p.importCoverMonths} mo
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.solvencyRiskLevel === 'critical'
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                              : p.solvencyRiskLevel === 'elevated'
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : p.solvencyRiskLevel === 'moderate'
                              ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400'
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {p.solvencyRiskLevel.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deep-Dive Inspection Card for Selected Country */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCountry.flag}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{selectedCountry.countryName} ({selectedCountry.countryCode})</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 uppercase font-mono">
                      {selectedCountry.bloc}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    External balance sheet profile &amp; structural balance of payments transmission
                  </p>
                </div>
              </div>

              {selectedCountry.twinDeficitWarning && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Active Twin Deficit Vulnerability</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-500">Current Account (% GDP)</span>
                <p className={`text-xl font-bold ${
                  selectedCountry.currentAccountPercentGdp >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {selectedCountry.currentAccountPercentGdp > 0 ? '+' : ''}{selectedCountry.currentAccountPercentGdp}%
                </p>
                <span className="text-[10px] text-slate-400 font-mono">${selectedCountry.currentAccountBillionUSD}B total</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-500">Goods vs Services Balance</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Goods: ${selectedCountry.goodsBalanceBillionUSD}B
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Services: ${selectedCountry.servicesBalanceBillionUSD}B</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-500">FX Reserves &amp; Import Cover</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  ${selectedCountry.fxReservesBillionUSD}B
                </p>
                <span className="text-[10px] text-slate-400 font-mono">{selectedCountry.importCoverMonths} months of import cover</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[11px] text-slate-500">External Debt (% GDP)</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedCountry.externalDebtToGdp}%
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Gross cross-border liabilities</span>
              </div>
            </div>

            {/* Historical Series Chart */}
            <div className="mt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                Historical Current Account (% GDP) Evolution (2000–2026)
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedCountry.historicalSeries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                    <XAxis dataKey="year" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                    <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val}% of GDP`, 'Current Account']}
                    />
                    <ReferenceLine y={0} stroke={isDark ? '#94a3b8' : '#64748b'} />
                    <Line
                      type="monotone"
                      dataKey="currentAccountPercentGdp"
                      stroke="#0284c7"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#0284c7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Macro Transmission Note: </span>
              {selectedCountry.macroNote}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DXY & REAL EFFECTIVE EXCHANGE RATES (REER) */}
      {activeTab === 'fx-reer' && (
        <div className="space-y-6">
          {/* US Dollar Index (DXY) Composition & Mechanism */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4 mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-sky-500" />
                  <span>US Dollar Index (DXY) Basket Composition &amp; Regime</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Established in 1973; geometrically weighted against 6 major trade counterparties.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{DXY_PROFILE_DATA.currentIndex}</span>
                <span className="text-xs font-semibold text-emerald-500 block">+{DXY_PROFILE_DATA.ytdChangePct}% YTD (Range: {DXY_PROFILE_DATA.fiftyTwoWeekLow} - {DXY_PROFILE_DATA.fiftyTwoWeekHigh})</span>
              </div>
            </div>

            {/* DXY Components Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {DXY_PROFILE_DATA.components.map((c) => (
                <div
                  key={c.currencyCode}
                  className="p-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{c.currencyCode}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-500 font-semibold">{c.weightPercent}%</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">{c.spotRate}</div>
                  <span className={`text-[10px] font-semibold block ${
                    c.ytdChangePct >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {c.ytdChangePct > 0 ? '+' : ''}{c.ytdChangePct}% YTD
                  </span>
                  <p className="text-[9px] text-slate-400 line-clamp-2">{c.description}</p>
                </div>
              ))}
            </div>

            {/* Multi-decade DXY Historical Series */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Multi-Decade DXY Index &amp; Structural Dollar Regimes (1985–2026)
              </span>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DXY_PROFILE_DATA.historicalSeries} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                    <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} angle={-20} textAnchor="end" />
                    <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} domain={[60, 160]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: any, item: any) => [
                        `${val} (${item.payload.regime})`,
                        name === 'dxyLevel' ? 'DXY Index' : 'US REER',
                      ]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="dxyLevel" name="DXY Index" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="reerUsd" name="US Real Effective (REER)" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Real Effective Exchange Rate (REER) Matrix & Devaluation Scorecard */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="h-5 w-5 text-amber-500" />
                <span>Multi-Lateral Real Effective Exchange Rate (REER) &amp; Devaluation Risk</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                REER adjusts nominal exchange rates for inflation differentials against primary trade partners. Deviations above +10% indicate real overvaluation; below -10% represent currency undervaluation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {REER_CURRENCY_PROFILES.map((cur) => {
                const isOvervalued = cur.valuationDeviationPct > 0;
                return (
                  <button
                    key={cur.currencyCode}
                    type="button"
                    aria-pressed={selectedCurrencyCode === cur.currencyCode}
                    onClick={() => setSelectedCurrencyCode(cur.currencyCode)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left w-full ${
                      selectedCurrencyCode === cur.currencyCode
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        <span>{cur.flag}</span> {cur.currencyCode}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        cur.devaluationRiskCategory === 'low'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : cur.devaluationRiskCategory === 'moderate'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                        Risk: {cur.devaluationRiskScore}/100
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">REER Level:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cur.currentReer}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">10Y Mean:</span>
                        <span className="font-mono text-slate-600 dark:text-slate-400">{cur.tenYearAverageReer}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Valuation:</span>
                        <span className={isOvervalued ? 'text-sky-500' : 'text-rose-500'}>
                          {isOvervalued ? '+' : ''}{cur.valuationDeviationPct}% ({cur.valuationStatus.replace('_', ' ')})
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {cur.keyDriver}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: GLOBAL SUPPLY CHAIN PRESSURE INDEX (GSCPI) */}
      {activeTab === 'gscpi' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4 mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Ship className="h-5 w-5 text-sky-500" />
                  <span>Federal Reserve Bank of New York: GSCPI Supply Pressure</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aggregates 27 cross-border maritime, air cargo, and PMI vendor delivery variables, isolated from demand shocks.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">+{GSCPI_PROFILE_DATA.currentStdDev}σ</span>
                <span className="text-xs font-semibold text-emerald-500 block">Status: {GSCPI_PROFILE_DATA.status.toUpperCase()}</span>
              </div>
            </div>

            {/* Historical Evolution Chart with Inflation Lead Reference */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gscpiTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                  <XAxis dataKey="period" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} angle={-25} textAnchor="end" />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#cbd5e1',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val}${name === 'stdDev' ? 'σ' : '%'} (${item.payload.annotation || 'Recorded'})`,
                      name === 'stdDev' ? 'GSCPI (Supply Friction)' : 'Trailing CPI Lead',
                    ]}
                  />
                  <Legend />
                  <ReferenceLine y={2.0} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Severe Friction (+2.0σ)', fill: '#f43f5e', fontSize: 10 }} />
                  <ReferenceLine y={-0.5} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'High Fluidity (-0.5σ)', fill: '#10b981', fontSize: 10 }} />
                  <ReferenceLine y={0.0} stroke={isDark ? '#cbd5e1' : '#475569'} />
                  <Line type="monotone" dataKey="stdDev" name="GSCPI (Std Dev)" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="cpiInflation" name="Headline CPI YoY (%)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sub-component Cards */}
            <div className="mt-6 space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Underlying Supply Chain Sub-Indices:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GSCPI_PROFILE_DATA.components.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white text-xs">{comp.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        comp.currentValueStdDev > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {comp.currentValueStdDev > 0 ? '+' : ''}{comp.currentValueStdDev}σ
                      </span>
                    </div>
                    <span className="text-[10px] text-sky-500 font-semibold uppercase">{comp.category.replace('_', ' ')}</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{comp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transmission Mechanism Explainer */}
            <div className="mt-5 p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-sky-500" />
                Inflation Transmission Horizon: 3 to 6 Month Lead on Goods PPI
              </span>
              <p>
                {GSCPI_PROFILE_DATA.methodologyNote} When GSCPI surges above +1.0σ (as in 2021-2022 and early 2024 Red Sea container diversions), producer input prices elevate within 90 days, transmitting directly into core consumer goods inflation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: CAPITAL FLOWS & SOVEREIGN TREASURY HOLDINGS (TIC) */}
      {activeTab === 'capital-flows' && (
        <div className="space-y-6">
          {/* Sovereign Creditor Holdings Leaderboard */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4 mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-purple-500" />
                  <span>US Treasury International Capital (TIC): Top Foreign Sovereign Holders</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total Foreign Holdings: ${CAPITAL_FLOWS_TIC_DATA.totalForeignHoldingsBillion}B | Foreign Share of US Debt: {CAPITAL_FLOWS_TIC_DATA.foreignShareOfUsDebtPct}%
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Monthly Net Inflow</span>
                <span className="text-lg font-bold text-emerald-500">+${CAPITAL_FLOWS_TIC_DATA.latestNetForeignFlowMonthlyBillion}B</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAPITAL_FLOWS_TIC_DATA.holders.map((holder) => {
                const isDivesting = holder.strategicDirection === 'divesting';
                const isAccumulating = holder.strategicDirection === 'accumulating';
                return (
                  <div
                    key={holder.countryCode}
                    className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <span className="text-base">{holder.flag}</span>
                        {holder.countryName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        isDivesting
                          ? 'bg-rose-500/20 text-rose-500'
                          : isAccumulating
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-slate-200 dark:bg-white/[0.1] text-slate-600 dark:text-slate-300'
                      }`}>
                        {holder.strategicDirection}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                          ${holder.holdingsBillionUSD}B
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {holder.shareOfForeignHoldingsPct}% of all foreign holdings
                        </span>
                      </div>
                      <span className={`text-xs font-semibold font-mono ${
                        holder.twelveMonthChangeBillionUSD >= 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {holder.twelveMonthChangeBillionUSD >= 0 ? '+' : ''}${holder.twelveMonthChangeBillionUSD}B (12M)
                      </span>
                    </div>

                    <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Type: </span>
                      {holder.dominantHolderType.replace(/_/g, ' ')}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">{holder.rationale}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dual Charts: Foreign Debt Share Dilution & Central Bank Reserve Diversification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart A: Foreign Ownership Share Dilution */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Foreign Share of US Marketable Public Debt (% of Total)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Secular decline from 53.4% (2008) to 23.4% (2026), shifting debt absorption onto domestic institutions.
              </p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={foreignOwnershipData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                    <XAxis dataKey="year" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                    <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickFormatter={(v) => `${v}%`} domain={[15, 60]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val}% of Total US Debt`, 'Foreign Share']}
                    />
                    <Line type="monotone" dataKey="foreignSharePct" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart B: IMF COFER Global Central Bank Reserve Currency Mix */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm">
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Central Bank FX Reserve Diversification &amp; Gold Pivot (% Share)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                US Dollar share of allocated foreign exchange reserves dropped from 71.1% (2000) to 57.6% (2026).
              </p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reserveDiversificationData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
                    <XAxis dataKey="year" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                    <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} tickFormatter={(v) => `${v}%`} domain={[0, 80]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: any) => [`${val}%`, name.toUpperCase()]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="usd" name="USD Share" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="gold" name="Physical Gold" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="eur" name="Euro" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Deep Insight Box */}
          <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="h-4 w-4 text-purple-500" />
              <span>Sovereign Debt Sustainability &amp; BRICS+ De-Dollarization Synthesis</span>
            </span>
            <p>
              {CAPITAL_FLOWS_TIC_DATA.deDollarizationInsight} With total marketable Treasuries crossing $36.4T and foreign sovereign official buying plateauing, the US external balance sheet relies increasingly on private offshore wealth intermediaries (Luxembourg, Cayman Islands, London) rather than sovereign central bank reserve recycling.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
