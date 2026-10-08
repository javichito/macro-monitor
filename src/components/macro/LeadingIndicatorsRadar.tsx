'use client';

import React, { useState } from 'react';
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
  SOVEREIGN_PMI_PROFILES,
  CONFERENCE_BOARD_LEI_DATA,
  LEI_TEN_COMPONENTS,
  GDP_NOWCAST_DATA,
  calculateNowcastSurprise,
} from '../../data/leading-indicators-data';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import {
  Gauge,
  Zap,
  TrendingUp,
  TrendingDown,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Building2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Sparkles,
} from 'lucide-react';

type RadarView = 'overview' | 'pmi' | 'lei' | 'nowcast';

export function LeadingIndicatorsRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState<RadarView>('pmi');
  const [selectedEconomyCode, setSelectedEconomyCode] = useState<string>('GLOBAL');
  const [leiCategoryFilter, setLeiCategoryFilter] = useState<'all' | 'financial' | 'expectations' | 'labor_manufacturing' | 'housing_orders'>('all');

  const pmiProfile =
    SOVEREIGN_PMI_PROFILES.find((p) => p.economyCode === selectedEconomyCode) ||
    SOVEREIGN_PMI_PROFILES[0];

  const filteredLeiComponents =
    leiCategoryFilter === 'all'
      ? LEI_TEN_COMPONENTS
      : LEI_TEN_COMPONENTS.filter((c) => c.category === leiCategoryFilter);

  const nowcastSurprise = calculateNowcastSurprise(
    GDP_NOWCAST_DATA.gdpNowEstimate,
    GDP_NOWCAST_DATA.blueChipConsensus
  );

  // Formats quarterly sector contribution breakdown for Recharts Bar visualization
  const sectorBarData = [
    {
      sector: 'PCE (Consumer)',
      contribution: GDP_NOWCAST_DATA.sectorContributions.personalConsumption,
      fill: '#38bdf8',
    },
    {
      sector: 'Private Investment',
      contribution: GDP_NOWCAST_DATA.sectorContributions.privateInvestment,
      fill: '#a855f7',
    },
    {
      sector: 'Government Spending',
      contribution: GDP_NOWCAST_DATA.sectorContributions.governmentSpending,
      fill: '#10b981',
    },
    {
      sector: 'Net Exports',
      contribution: GDP_NOWCAST_DATA.sectorContributions.netExports,
      fill: GDP_NOWCAST_DATA.sectorContributions.netExports >= 0 ? '#10b981' : '#f43f5e',
    },
  ];

  const getPmiBadge = (status: 'expansion' | 'contraction' | 'stagnation') => {
    switch (status) {
      case 'expansion':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
          text: 'Expansion (> 50.0)',
        };
      case 'contraction':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
          text: 'Contraction (< 50.0)',
        };
      default:
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
          text: 'Neutral (50.0 Stagnation)',
        };
    }
  };

  const getLeiSignalBadge = (status: 'expansion' | 'warning' | 'recession_signal') => {
    switch (status) {
      case 'recession_signal':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
          text: '3D Recession Rule Triggered',
        };
      case 'warning':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
          text: 'Warning Corridor (Contracting)',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
          text: 'Expansionary Momentum',
        };
    }
  };

  const currentLeiSignal = getLeiSignalBadge(CONFERENCE_BOARD_LEI_DATA.signalStatus);

  return (
    <div className="apple-card p-5 sm:p-6 space-y-6">
      {/* Header and Telemetry Mode Nav */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Leading Indicators &amp; High-Frequency Nowcasting
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
            Official GDP releases lag by 30 to 90 days. High-frequency Purchasing Managers&apos; Surveys (PMI), the Conference Board 10-component LEI, and Atlanta Fed GDPNow provide real-time economic telemetry.
          </p>
        </div>

        {/* Navigation View Switcher & Data Export */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
          <div className="flex flex-wrap items-center rounded-full p-1 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] shadow-inner text-xs">
            <button
              onClick={() => setActiveView('pmi')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeView === 'pmi'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Gauge className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>PMI Radar (50-Mark)</span>
            </button>
            <button
              onClick={() => setActiveView('lei')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeView === 'lei'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Conference Board LEI</span>
            </button>
            <button
              onClick={() => setActiveView('nowcast')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeView === 'nowcast'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Atlanta Fed GDPNow</span>
            </button>
            <button
              onClick={() => setActiveView('overview')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeView === 'overview'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Summary Synthesis</span>
            </button>
          </div>

          {/* One-click Data Export for Researchers & Journalists */}
          <DataExportMenu
            title={`Leading Indicators Radar [${
              activeView === 'pmi'
                ? `PMI Diffusion Radar (${pmiProfile.name})`
                : activeView === 'lei'
                ? 'Conference Board 10-Component LEI'
                : activeView === 'nowcast'
                ? 'Atlanta Fed GDPNow vs Consensus Tracker'
                : 'Global Leading Indicators Synthesis'
            }]`}
            filename={`leading-indicators-${activeView}`}
            data={() =>
              activeView === 'pmi'
                ? pmiProfile.historicalSeries.map((h) => ({
                    period: h.period,
                    manufacturingPmi: h.manufacturing,
                    servicesPmi: h.services,
                    compositePmi: h.composite,
                    newOrdersIndex: h.newOrders ?? '',
                    inventoriesIndex: h.inventories ?? '',
                  }))
                : activeView === 'lei'
                ? LEI_TEN_COMPONENTS.map((c) => ({
                    id: c.id,
                    name: c.name,
                    category: c.category,
                    latestValue: c.latestValue,
                    sixMonthChangePct: c.sixMonthChangePct,
                    netContribution: c.netContribution,
                    weightPct: c.weightPct,
                    leadingMechanism: c.leadingMechanism,
                  }))
                : activeView === 'nowcast'
                ? GDP_NOWCAST_DATA.quarterlyComparison.map((q) => ({
                    quarter: q.quarter,
                    atlantaFedGdpNowPercent: q.atlantaFedGdpNow,
                    nyFedNowcastPercent: q.nyFedNowcast,
                    blueChipConsensusPercent: q.blueChipConsensus,
                    officialBeaGdpPercent: q.officialBeaGdp ?? '',
                  }))
                : SOVEREIGN_PMI_PROFILES.map((p) => ({
                    economyCode: p.economyCode,
                    economyName: p.name,
                    manufacturingPmi: p.currentManufacturing,
                    servicesPmi: p.currentServices,
                    compositePmi: p.currentComposite,
                    manufacturingStatus: p.manufacturingStatus,
                    servicesStatus: p.servicesStatus,
                    compositeStatus: p.compositeStatus,
                  }))
            }
            columns={
              activeView === 'pmi'
                ? [
                    { key: 'period', label: 'Period' },
                    { key: 'manufacturingPmi', label: 'Manufacturing PMI (Diffusion 50)' },
                    { key: 'servicesPmi', label: 'Services PMI (Diffusion 50)' },
                    { key: 'compositePmi', label: 'Composite PMI (Diffusion 50)' },
                    { key: 'newOrdersIndex', label: 'New Orders Sub-Index' },
                    { key: 'inventoriesIndex', label: 'Inventories Sub-Index' },
                  ]
                : activeView === 'lei'
                ? [
                    { key: 'name', label: 'Component Name' },
                    { key: 'category', label: 'Category' },
                    { key: 'latestValue', label: 'Latest Print' },
                    { key: 'sixMonthChangePct', label: '6-Month Annualized Growth (%)' },
                    { key: 'netContribution', label: 'Net Contribution' },
                    { key: 'weightPct', label: 'Basket Weight (%)' },
                    { key: 'leadingMechanism', label: 'Leading Mechanism' },
                  ]
                : activeView === 'nowcast'
                ? [
                    { key: 'quarter', label: 'Quarter' },
                    { key: 'atlantaFedGdpNowPercent', label: 'Atlanta Fed GDPNow Estimate (%)' },
                    { key: 'nyFedNowcastPercent', label: 'NY Fed Staff Nowcast (%)' },
                    { key: 'blueChipConsensusPercent', label: 'Blue Chip Consensus Survey (%)' },
                    { key: 'officialBeaGdpPercent', label: 'BEA Final Reported Print (%)' },
                  ]
                : [
                    { key: 'economyCode', label: 'Code' },
                    { key: 'economyName', label: 'Economy' },
                    { key: 'manufacturingPmi', label: 'Manufacturing PMI' },
                    { key: 'servicesPmi', label: 'Services PMI' },
                    { key: 'compositePmi', label: 'Composite PMI' },
                    { key: 'manufacturingStatus', label: 'Manufacturing Status' },
                    { key: 'servicesStatus', label: 'Services Status' },
                    { key: 'compositeStatus', label: 'Composite Status' },
                  ]
            }
            metadata={{
              description:
                activeView === 'pmi'
                  ? `S&P Global / ISM Purchasing Managers' Index (PMI) surveys for ${pmiProfile.name}.`
                  : activeView === 'lei'
                  ? 'The Conference Board Leading Economic Index (LEI) 10 forward-looking cyclical components.'
                  : activeView === 'nowcast'
                  ? 'Federal Reserve Bank of Atlanta GDPNow mathematical real-time GDP estimate vs consensus.'
                  : 'Synthesized global leading indicators overview across major trading economies.',
              source: 'S&P Global / ISM, The Conference Board, Federal Reserve Bank of Atlanta',
              activeView,
            }}
          />
        </div>
      </div>

      {/* -------------------------------------------------------------
          VIEW 1: PURCHASING MANAGERS' INDEX (PMI)
         ------------------------------------------------------------- */}
      {activeView === 'pmi' && (
        <div className="space-y-6">
          {/* Economy Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Select sovereign or global economic zone:
            </span>
            <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
              {SOVEREIGN_PMI_PROFILES.map((p) => (
                <button
                  key={p.economyCode}
                  onClick={() => setSelectedEconomyCode(p.economyCode)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                    selectedEconomyCode === p.economyCode
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                  }`}
                >
                  <span>{p.flag}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 50-Threshold Gauge & Primary Scorecards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Manufacturing PMI Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Manufacturing PMI
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPmiBadge(pmiProfile.manufacturingStatus).bg}`}>
                  {getPmiBadge(pmiProfile.manufacturingStatus).text}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {pmiProfile.currentManufacturing.toFixed(1)}
                </span>
                <span className={`text-xs font-semibold ${pmiProfile.momChangeManufacturing >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {pmiProfile.momChangeManufacturing >= 0 ? `+${pmiProfile.momChangeManufacturing.toFixed(1)}` : pmiProfile.momChangeManufacturing.toFixed(1)} MoM
                </span>
              </div>
              {/* Threshold Meter Bar */}
              <div className="space-y-1 pt-1">
                <div className="relative w-full h-3 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-900 dark:bg-white z-10" />
                  <div
                    style={{ width: `${Math.min(Math.max(((pmiProfile.currentManufacturing - 40) / 20) * 100, 2), 98)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      pmiProfile.currentManufacturing >= 50.0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>40 (Severe Contraction)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">50 Neutral</span>
                  <span>60 (Surge)</span>
                </div>
              </div>
            </div>

            {/* Services PMI Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Services PMI
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPmiBadge(pmiProfile.servicesStatus).bg}`}>
                  {getPmiBadge(pmiProfile.servicesStatus).text}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {pmiProfile.currentServices.toFixed(1)}
                </span>
                <span className={`text-xs font-semibold ${pmiProfile.momChangeServices >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {pmiProfile.momChangeServices >= 0 ? `+${pmiProfile.momChangeServices.toFixed(1)}` : pmiProfile.momChangeServices.toFixed(1)} MoM
                </span>
              </div>
              {/* Threshold Meter Bar */}
              <div className="space-y-1 pt-1">
                <div className="relative w-full h-3 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-900 dark:bg-white z-10" />
                  <div
                    style={{ width: `${Math.min(Math.max(((pmiProfile.currentServices - 40) / 20) * 100, 2), 98)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      pmiProfile.currentServices >= 50.0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>40 (Severe Contraction)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">50 Neutral</span>
                  <span>60 (Surge)</span>
                </div>
              </div>
            </div>

            {/* Composite Output & Order-to-Inventory Ratio */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Composite &amp; Forward Orders
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {pmiProfile.surveyProvider}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-sky-600 dark:text-sky-400">
                    {pmiProfile.currentComposite.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Composite Output</span>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {pmiProfile.newOrdersToInventoryRatio.toFixed(2)}x
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Orders / Inventories Ratio
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/[0.06]">
                Ratio &gt; 1.0 indicates order books outpace warehouse inventories, anticipating manufacturing acceleration.
              </p>
            </div>
          </div>

          {/* Granular Sub-Indices Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">New Orders</span>
              <span className={`text-lg font-bold ${pmiProfile.subIndices.newOrders >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {pmiProfile.subIndices.newOrders.toFixed(1)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Production Output</span>
              <span className={`text-lg font-bold ${pmiProfile.subIndices.output >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {pmiProfile.subIndices.output.toFixed(1)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Employment</span>
              <span className={`text-lg font-bold ${pmiProfile.subIndices.employment >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {pmiProfile.subIndices.employment.toFixed(1)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Supplier Deliveries</span>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {pmiProfile.subIndices.supplierDeliveries.toFixed(1)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Input Cost Prices</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {pmiProfile.subIndices.inputPrices.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Historical Dual-Speed PMI Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Historical Diffusion Trajectory vs. 50.0 Neutral Threshold:
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {pmiProfile.name} Multi-Year Trend
              </span>
            </div>
            <div className="h-64 sm:h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={pmiProfile.historicalSeries}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis
                    dataKey="period"
                    stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                    fontSize={11}
                    domain={[40, 68]}
                    tickLine={false}
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
                    formatter={(val: any) => [`${Number(val).toFixed(1)} pts`]}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(val) => (
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                    )}
                  />
                  <ReferenceLine
                    y={50.0}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: '50.0 Expansion / Contraction Line',
                      position: 'insideBottomRight',
                      fill: '#f59e0b',
                      fontSize: 10,
                    }}
                  />
                  <Line
                    name="Services PMI"
                    type="monotone"
                    dataKey="services"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 2.5 }}
                  />
                  <Line
                    name="Manufacturing PMI"
                    type="monotone"
                    dataKey="manufacturing"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={{ r: 2.5 }}
                  />
                  <Line
                    name="Composite Output"
                    type="monotone"
                    dataKey="composite"
                    stroke="#a855f7"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Dynamic Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                Macro Cycle Diagnosis:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {pmiProfile.macroNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 2: CONFERENCE BOARD LEADING ECONOMIC INDEX (LEI)
         ------------------------------------------------------------- */}
      {activeView === 'lei' && (
        <div className="space-y-6">
          {/* Master LEI Health Status & 3D Rule Meter */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Conference Board LEI 6-Month Annualized Growth
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentLeiSignal.bg}`}>
                    {currentLeiSignal.text}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {CONFERENCE_BOARD_LEI_DATA.sixMonthAnnualizedGrowthPct.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Index Level: {CONFERENCE_BOARD_LEI_DATA.currentIndexLevel.toFixed(1)} (MoM: {CONFERENCE_BOARD_LEI_DATA.momChangePct}%)
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">3D Rule Recession Trigger Threshold</span>
                <span className="text-lg font-bold text-rose-600 dark:text-rose-400">-4.0% Annualized</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Component Diffusion: {CONFERENCE_BOARD_LEI_DATA.diffusionIndex.toFixed(0)}% expanding
                </span>
              </div>
            </div>

            {/* 3D Rule Visual Bar */}
            <div className="space-y-1">
              <div className="relative w-full h-4 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden border border-slate-300 dark:border-white/[0.10]">
                {/* Recession trigger line placed at -4.0% mark (mapped from -15% to +10% domain) */}
                <div className="absolute left-[44%] top-0 bottom-0 w-[2px] bg-rose-500 z-10" />
                {/* 0.0% Stagnation line */}
                <div className="absolute left-[60%] top-0 bottom-0 w-[2px] bg-slate-700 dark:bg-slate-300 z-10" />

                <div
                  style={{
                    width: `${Math.min(Math.max(((CONFERENCE_BOARD_LEI_DATA.sixMonthAnnualizedGrowthPct + 15) / 25) * 100, 2), 98)}%`,
                  }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    CONFERENCE_BOARD_LEI_DATA.sixMonthAnnualizedGrowthPct <= -4.0
                      ? 'bg-rose-500'
                      : CONFERENCE_BOARD_LEI_DATA.sixMonthAnnualizedGrowthPct < 0
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>-15% (Severe Contraction)</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">-4.0% (3D Recession Trigger)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">0.0% Neutral</span>
                <span>+10% (Boom)</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-white/[0.06] pt-3">
              {CONFERENCE_BOARD_LEI_DATA.threeDRuleNote}
            </p>
          </div>

          {/* Interactive 10-Component Matrix */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                The 10 Forward-Looking Components Breakdown:
              </span>
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
                {(['all', 'financial', 'labor_manufacturing', 'housing_orders', 'expectations'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLeiCategoryFilter(cat)}
                    className={`rounded-xl px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                      leiCategoryFilter === cat
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-bold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                    }`}
                  >
                    {cat === 'all'
                      ? 'All 10'
                      : cat === 'financial'
                      ? 'Financial (3)'
                      : cat === 'labor_manufacturing'
                      ? 'Labor & Mfg (2)'
                      : cat === 'housing_orders'
                      ? 'Housing & Orders (4)'
                      : 'Expectations (1)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {filteredLeiComponents.map((component) => {
                const isPos = component.netContribution === 'positive';
                return (
                  <div
                    key={component.id}
                    className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                          {component.weightPct}% Weight
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isPos
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400'
                          }`}
                        >
                          {isPos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {component.sixMonthChangePct >= 0 ? `+${component.sixMonthChangePct}%` : `${component.sixMonthChangePct}%`}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {component.name}
                      </h4>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                        Latest: {component.latestValue}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Why Leading: </span>
                        {component.leadingMechanism}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical LEI 6M Annualized Growth Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Multi-Cycle LEI Trajectory &amp; Recession Triggers (2007 - 2026):
              </span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                -4.0% Threshold identifies 100% of historical recessions
              </span>
            </div>
            <div className="h-64 sm:h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={CONFERENCE_BOARD_LEI_DATA.historicalSeries}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis
                    dataKey="date"
                    stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                    fontSize={11}
                    domain={[-16, 10]}
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
                  <ReferenceLine
                    y={0}
                    stroke={isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}
                    strokeWidth={1}
                  />
                  <ReferenceLine
                    y={-4.0}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: '-4.0% 3D Recession Trigger',
                      position: 'insideBottomRight',
                      fill: '#f43f5e',
                      fontSize: 10,
                    }}
                  />
                  <Line
                    name="6M Annualized Growth"
                    type="monotone"
                    dataKey="sixMonthAnnualizedGrowth"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 3: HIGH-FREQUENCY GDP NOWCASTING (ATLANTA FED)
         ------------------------------------------------------------- */}
      {activeView === 'nowcast' && (
        <div className="space-y-6">
          {/* Active Nowcast Scorecard */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                  Current Quarter Output Tracker ({GDP_NOWCAST_DATA.currentQuarter})
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400">
                    +{GDP_NOWCAST_DATA.gdpNowEstimate.toFixed(1)}%
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    +{nowcastSurprise.toFixed(2)}% vs. Blue Chip Survey
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                  Atlanta Fed GDPNow mathematical run updated {GDP_NOWCAST_DATA.lastNowcastUpdate}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">NY Fed Nowcast</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    +{GDP_NOWCAST_DATA.nyFedEstimate.toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Blue Chip Consensus</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    +{GDP_NOWCAST_DATA.blueChipConsensus.toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Trailing Official BEA</span>
                  <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                    +{GDP_NOWCAST_DATA.trailingOfficialGdp.toFixed(1)}% ({GDP_NOWCAST_DATA.trailingOfficialQuarter})
                  </span>
                </div>
              </div>
            </div>

            {/* Publication Lag Alert */}
            <div className="rounded-xl p-3 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">The Statistical Lag Reality:</span>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                  The Bureau of Economic Analysis (BEA) releases official GDP 30 days after quarter-end (Advance), followed by revisions at 60 and 90 days. GDPNow provides immediate visibility by modeling granular incoming reports daily.
                </p>
              </div>
            </div>
          </div>

          {/* Sector Decomposition & High-Frequency Revision Evolution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sector Contribution Bar Chart */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Q3 GDP Contribution Breakdown (Percentage Points):
              </span>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorBarData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                    <XAxis
                      dataKey="sector"
                      stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                      fontSize={11}
                      domain={[-0.5, 2.5]}
                      tickLine={false}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? 'rgba(10, 10, 15, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${Number(val).toFixed(2)} pts`]}
                    />
                    <ReferenceLine y={0} stroke={isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'} />
                    <Bar dataKey="contribution" radius={[4, 4, 0, 0]}>
                      {sectorBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revision Evolution Timeline */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                How Incoming Macro Data Revised the Estimate (Jul - Sep):
              </span>
              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={GDP_NOWCAST_DATA.revisionEvolution}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                    <XAxis
                      dataKey="date"
                      stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                      fontSize={11}
                      domain={[1.5, 3.2]}
                      tickLine={false}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || !payload[0]) return null;
                        const data = payload[0].payload as (typeof GDP_NOWCAST_DATA.revisionEvolution)[0];
                        return (
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 text-xs shadow-xl space-y-1">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {data.date}: {data.estimate.toFixed(1)}%
                            </span>
                            <p className="text-slate-600 dark:text-slate-300 max-w-xs">{data.catalyst}</p>
                            <span className={`text-[11px] font-semibold ${data.impact >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              Net Impact: {data.impact >= 0 ? `+${data.impact.toFixed(1)}` : data.impact.toFixed(1)}%
                            </span>
                          </div>
                        );
                      }}
                    />
                    <Line
                      name="Nowcast Evolution"
                      type="stepAfter"
                      dataKey="estimate"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quarterly Nowcast vs Official BEA Tracking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Atlanta Fed GDPNow vs. Official BEA Final GDP (Quarterly Track Record):
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                11-Quarter Accuracy Comparison
              </span>
            </div>
            <div className="h-64 sm:h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={GDP_NOWCAST_DATA.quarterlyComparison}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
                  <XAxis
                    dataKey="quarter"
                    stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={isDark ? 'rgba(255,255,255,0.4)' : '#64748b'}
                    fontSize={11}
                    domain={[0, 4.0]}
                    tickLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? 'rgba(10, 10, 15, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [val === null ? 'Pending Release' : `${Number(val).toFixed(1)}%`]}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(val) => (
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                    )}
                  />
                  <Bar name="Atlanta Fed GDPNow" dataKey="atlantaFedGdpNow" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                  <Bar name="Official BEA Real GDP" dataKey="officialBeaGdp" fill="#a855f7" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          VIEW 4: OVERVIEW SYNTHESIS DASHBOARD
         ------------------------------------------------------------- */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: PMI Heatmap */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">1. Global PMI Matrix</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 font-semibold">
                  Dual-Speed
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {SOVEREIGN_PMI_PROFILES.map((p) => (
                  <div key={p.economyCode} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {p.flag} {p.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${p.currentManufacturing >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        M: {p.currentManufacturing.toFixed(1)}
                      </span>
                      <span className={`font-semibold ${p.currentServices >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        S: {p.currentServices.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar 2: LEI 3D Rule Balance */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">2. Conference Board LEI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 font-semibold">
                  Warning Zone
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">6M Annualized Growth:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{CONFERENCE_BOARD_LEI_DATA.sixMonthAnnualizedGrowthPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Recession Threshold:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">-4.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Expanding Components:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">5 of 10 (50%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Top Headwind:</span>
                  <span className="font-medium text-rose-500 dark:text-rose-400">Inverted Yield Spread</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Top Tailwinds:</span>
                  <span className="font-medium text-emerald-500 dark:text-emerald-400">S&amp;P 500 &amp; Low Claims</span>
                </div>
              </div>
            </div>

            {/* Pillar 3: GDP Nowcast Snapshot */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">3. Real-Time GDPNow</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 font-semibold">
                  Solid Output
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Q3 GDPNow Run:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">+{GDP_NOWCAST_DATA.gdpNowEstimate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Consensus Gap:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+{nowcastSurprise}% Upside</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Consumer Driver (PCE):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">+{GDP_NOWCAST_DATA.sectorContributions.personalConsumption} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Official BEA Advance Lag:</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">~{GDP_NOWCAST_DATA.officialReleaseLagDays} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explainer Footer */}
      <div className="rounded-xl p-3.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900 dark:text-white">
            Why Leading Survey Telemetry &amp; Nowcasting Outperform Official GDP:
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Official government GDP figures reflect what happened several months ago and undergo massive subsequent revisions. In contrast, Purchasing Managers&apos; diffusion indices (PMI) sample purchasing directors with real-time purchasing order books, the 10-component LEI tracks financial conditions and building permits 6 to 9 months ahead, and Atlanta Fed GDPNow continuously aggregates daily high-frequency hard data (retail sales, durable goods, auto production).
          </p>
        </div>
      </div>
    </div>
  );
}
