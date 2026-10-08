'use client';

import React, { useState, useMemo } from 'react';
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
  SOVEREIGN_INFLATION_PROFILES,
  US_INFLATION_HISTORY,
  calculateComponentContribution,
  getPipelinePressureSignal,
} from '../../data/inflation-anatomy-data';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import {
  TrendingUp,
  Layers,
  Home,
  Package,
  Activity,
  Zap,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { formatPercent } from '../../lib/formatters';

type InflationViewTab = 'decomposition' | 'supercore-radar' | 'pipeline-ppi';

export function InflationAnatomyRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('USA');
  const [activeTab, setActiveTab] = useState<InflationViewTab>('decomposition');

  // Series visibility toggles for the decomposition chart
  const [showHeadline, setShowHeadline] = useState(true);
  const [showCore, setShowCore] = useState(true);
  const [showSupercore, setShowSupercore] = useState(true);
  const [showShelter, setShowShelter] = useState(true);
  const [showCoreGoods, setShowCoreGoods] = useState(true);
  const [showEnergy, setShowEnergy] = useState(false);
  const [showFood, setShowFood] = useState(false);

  const profile =
    SOVEREIGN_INFLATION_PROFILES.find((p) => p.countryCode === selectedCountryCode) ||
    SOVEREIGN_INFLATION_PROFILES[0];

  const latestData = profile.historicalSeries[profile.historicalSeries.length - 1];
  const pipelineSignal = getPipelinePressureSignal(latestData.ppiCpiSpread);

  const tooltipStyle = {
    backgroundColor: isDark ? '#0f131c' : '#ffffff',
    borderColor: isDark ? '#242b3d' : '#e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '12px',
    color: isDark ? '#f8fafc' : '#0f172a',
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
  };

  const gridStroke = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const axisStroke = isDark ? '#64748b' : '#94a3b8';

  const getRegimeBadge = (regime: string) => {
    switch (regime) {
      case 'sticky-supercore':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
          text: 'Sticky Supercore (Services Inflation Intractable)',
        };
      case 'goods-disinflation':
        return {
          bg: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
          text: 'Goods-Led Disinflation (Supply Chain Cooling)',
        };
      case 'broad-stagflationary':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
          text: 'Stagflationary Pressure (Pervasive Cost-Push)',
        };
      case 'deflationary':
        return {
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
          text: 'Deflationary Contraction (Demand Deficiency)',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
          text: 'Target Equilibrium (~2% Central Bank Anchor)',
        };
    }
  };

  const regimeBadge = getRegimeBadge(profile.regime);

  // Calculate weighted contributions to headline CPI
  const contributions = useMemo(() => {
    const w = profile.basketWeights;
    return [
      {
        name: 'Shelter / OER',
        weight: w.shelterWeight,
        yoy: latestData.shelterOer,
        contribution: calculateComponentContribution(w.shelterWeight, latestData.shelterOer),
        color: '#f59e0b',
      },
      {
        name: 'Supercore (Services ex-Shelter)',
        weight: w.supercoreWeight,
        yoy: latestData.supercoreCpi,
        contribution: calculateComponentContribution(w.supercoreWeight, latestData.supercoreCpi),
        color: '#ec4899',
      },
      {
        name: 'Core Goods',
        weight: w.coreGoodsWeight,
        yoy: latestData.coreGoods,
        contribution: calculateComponentContribution(w.coreGoodsWeight, latestData.coreGoods),
        color: '#06b6d4',
      },
      {
        name: 'Food & Groceries',
        weight: w.foodWeight,
        yoy: latestData.food,
        contribution: calculateComponentContribution(w.foodWeight, latestData.food),
        color: '#10b981',
      },
      {
        name: 'Energy & Fuels',
        weight: w.energyWeight,
        yoy: latestData.energy,
        contribution: calculateComponentContribution(w.energyWeight, latestData.energy),
        color: '#ef4444',
      },
    ];
  }, [profile, latestData]);

  return (
    <div className="apple-card p-5 sm:p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Inflation Anatomy: Beyond Headline CPI
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${regimeBadge.bg}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {regimeBadge.text}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
            Central banks look past headline price spikes to target Core and Supercore inflation. Decompose price pressures across housing (Shelter / OER), labor-intensive services, deflating manufactured goods, and upstream wholesale PPI.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Sovereign Pills */}
          <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs max-w-xl">
            {SOVEREIGN_INFLATION_PROFILES.map((p) => (
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
              onClick={() => setActiveTab('decomposition')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeTab === 'decomposition'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Decomposition Stack
            </button>
            <button
              onClick={() => setActiveTab('supercore-radar')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeTab === 'supercore-radar'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Supercore &amp; Services
            </button>
            <button
              onClick={() => setActiveTab('pipeline-ppi')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeTab === 'pipeline-ppi'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Upstream PPI vs. CPI
            </button>
          </div>

          {/* One-click Data Export for Researchers & Journalists */}
          <DataExportMenu
            title={`Inflation Anatomy [${profile.countryName} - ${
              activeTab === 'decomposition'
                ? 'Component Decomposition'
                : activeTab === 'supercore-radar'
                ? 'Cross-Country Supercore Comparison'
                : 'Upstream PPI vs Headline CPI'
            }]`}
            filename={`inflation-anatomy-${profile.countryCode.toLowerCase()}-${activeTab}`}
            data={() =>
              activeTab === 'decomposition'
                ? US_INFLATION_HISTORY.map((h) => ({
                    year: h.year,
                    headlineCpiPercent: h.headlineCpi,
                    coreCpiPercent: h.coreCpi,
                    supercoreCpiPercent: h.supercoreCpi,
                    shelterOerPercent: h.shelterOer,
                    coreGoodsPercent: h.coreGoods,
                    energyPercent: h.energy,
                    foodPercent: h.food,
                  }))
                : activeTab === 'supercore-radar'
                ? SOVEREIGN_INFLATION_PROFILES.map((p) => ({
                    countryCode: p.countryCode,
                    countryName: p.countryName,
                    headlineCpiPercent: p.headlineYoY,
                    coreCpiPercent: p.coreYoY,
                    supercoreCpiPercent: p.supercoreYoY,
                    shelterOerPercent: p.shelterYoY,
                    goodsInflationPercent: p.coreGoodsYoY,
                    ppiPercent: p.ppiYoY,
                    regime: p.regime,
                  }))
                : US_INFLATION_HISTORY.map((h) => ({
                    year: h.year,
                    headlineCpiPercent: h.headlineCpi,
                    ppiFinalDemandPercent: h.ppiFinalDemand,
                    pipelinePressureSpreadPercent: h.ppiCpiSpread,
                  }))
            }
            columns={
              activeTab === 'decomposition'
                ? [
                    { key: 'year', label: 'Year' },
                    { key: 'headlineCpiPercent', label: 'Headline CPI (%)' },
                    { key: 'coreCpiPercent', label: 'Core CPI (%)' },
                    { key: 'supercoreCpiPercent', label: 'Supercore CPI (%)' },
                    { key: 'shelterOerPercent', label: 'Shelter / OER (%)' },
                    { key: 'coreGoodsPercent', label: 'Core Goods (%)' },
                    { key: 'energyPercent', label: 'Energy (%)' },
                    { key: 'foodPercent', label: 'Food (%)' },
                  ]
                : activeTab === 'supercore-radar'
                ? [
                    { key: 'countryCode', label: 'Country Code' },
                    { key: 'countryName', label: 'Economy' },
                    { key: 'headlineCpiPercent', label: 'Headline CPI (%)' },
                    { key: 'coreCpiPercent', label: 'Core CPI (%)' },
                    { key: 'supercoreCpiPercent', label: 'Supercore CPI (%)' },
                    { key: 'shelterOerPercent', label: 'Shelter (%)' },
                    { key: 'goodsInflationPercent', label: 'Goods (%)' },
                    { key: 'ppiPercent', label: 'PPI Final Demand (%)' },
                    { key: 'regime', label: 'Inflation Regime' },
                  ]
                : [
                    { key: 'year', label: 'Year' },
                    { key: 'headlineCpiPercent', label: 'Headline CPI (%)' },
                    { key: 'ppiFinalDemandPercent', label: 'Producer Price PPI Final Demand (%)' },
                    { key: 'pipelinePressureSpreadPercent', label: 'Pipeline Spread (PPI - CPI %)' },
                  ]
            }
            metadata={{
              description:
                activeTab === 'decomposition'
                  ? 'Historical breakdown of consumer price index inflation into shelter, services, goods, and commodities.'
                  : activeTab === 'supercore-radar'
                  ? 'Comparative cross-country inflation metrics and services supercore stickiness.'
                  : 'Upstream wholesale producer prices leading consumer inflation.',
              source: 'Bureau of Labor Statistics (BLS), Eurostat, Statistics Bureau Japan, ONS UK',
              country: profile.countryName,
              activeTab,
              unit: 'Year-over-Year Percentage Change (%)',
            }}
          />
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08]">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Headline CPI</span>
            <span className="h-2 w-2 rounded-full bg-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatPercent(latestData.headlineCpi)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Total consumer basket</div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-500/5 border border-sky-400/20">
          <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 flex items-center justify-between">
            <span>Core CPI</span>
            <span className="h-2 w-2 rounded-full bg-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-950 dark:text-sky-200 mt-1">
            {formatPercent(latestData.coreCpi)}
          </div>
          <div className="text-[10px] text-sky-700/80 dark:text-sky-300/80 mt-0.5">Ex-Food &amp; Energy</div>
        </div>

        <div className="p-3.5 rounded-xl bg-pink-500/5 border border-pink-400/20">
          <div className="text-[11px] font-semibold text-pink-700 dark:text-pink-300 flex items-center justify-between">
            <span>Supercore</span>
            <span className="h-2 w-2 rounded-full bg-pink-400" />
          </div>
          <div className="text-xl font-bold font-mono text-pink-950 dark:text-pink-200 mt-1">
            {formatPercent(latestData.supercoreCpi)}
          </div>
          <div className="text-[10px] text-pink-700/80 dark:text-pink-300/80 mt-0.5">Services ex-Shelter</div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-400/20">
          <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center justify-between">
            <span>Shelter / OER</span>
            <span className="h-2 w-2 rounded-full bg-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-950 dark:text-amber-200 mt-1">
            {formatPercent(latestData.shelterOer)}
          </div>
          <div className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">{profile.basketWeights.shelterWeight}% of basket</div>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-400/20">
          <div className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 flex items-center justify-between">
            <span>Core Goods</span>
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-950 dark:text-cyan-200 mt-1">
            {formatPercent(latestData.coreGoods)}
          </div>
          <div className="text-[10px] text-cyan-700/80 dark:text-cyan-300/80 mt-0.5">Factory &amp; imports</div>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-400/20">
          <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 flex items-center justify-between">
            <span>PPI Final Demand</span>
            <span className="h-2 w-2 rounded-full bg-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-950 dark:text-purple-200 mt-1">
            {formatPercent(latestData.ppiFinalDemand)}
          </div>
          <div className="text-[10px] text-purple-700/80 dark:text-purple-300/80 mt-0.5">Upstream wholesale</div>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'decomposition' && (
        <div className="space-y-4">
          {/* Component Visibility Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Toggle Series:
            </span>

            <button
              onClick={() => setShowHeadline(!showHeadline)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                showHeadline
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 opacity-50'
              }`}
            >
              Headline CPI
            </button>

            <button
              onClick={() => setShowCore(!showCore)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                showCore
                  ? 'bg-sky-600 text-white border-transparent shadow-sm'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 opacity-50'
              }`}
            >
              Core (ex-Food/Energy)
            </button>

            <button
              onClick={() => setShowSupercore(!showSupercore)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                showSupercore
                  ? 'bg-pink-600 text-white border-transparent shadow-sm'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 opacity-50'
              }`}
            >
              Supercore (Services ex-Shelter)
            </button>

            <button
              onClick={() => setShowShelter(!showShelter)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                showShelter
                  ? 'bg-amber-600 text-white border-transparent shadow-sm'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 opacity-50'
              }`}
            >
              Shelter / OER
            </button>

            <button
              onClick={() => setShowCoreGoods(!showCoreGoods)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                showCoreGoods
                  ? 'bg-cyan-600 text-white border-transparent shadow-sm'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 opacity-50'
              }`}
            >
              Core Goods
            </button>

            <button
              onClick={() => setShowEnergy(!showEnergy)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                showEnergy
                  ? 'bg-rose-600 text-white border-transparent shadow-sm'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 opacity-50'
              }`}
            >
              Energy
            </button>

            <button
              onClick={() => setShowFood(!showFood)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-all cursor-pointer ${
                showFood
                  ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 opacity-50'
              }`}
            >
              Food
            </button>
          </div>

          {/* Line Chart */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profile.historicalSeries} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: any, name: any) => [`${Number(val).toFixed(1)}%`, name]}
                />
                <ReferenceLine y={2.0} stroke="#10b981" strokeDasharray="3 3" label={{ value: '2% Policy Target', fill: '#10b981', fontSize: 10, position: 'right' }} />

                {showHeadline && (
                  <Line type="monotone" dataKey="headlineCpi" name="Headline CPI" stroke={isDark ? '#e2e8f0' : '#1e293b'} strokeWidth={2.5} dot={{ r: 2 }} />
                )}
                {showCore && (
                  <Line type="monotone" dataKey="coreCpi" name="Core CPI" stroke="#38bdf8" strokeWidth={2} dot={{ r: 2 }} />
                )}
                {showSupercore && (
                  <Line type="monotone" dataKey="supercoreCpi" name="Supercore Services" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 2 }} />
                )}
                {showShelter && (
                  <Line type="monotone" dataKey="shelterOer" name="Shelter / OER" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                )}
                {showCoreGoods && (
                  <Line type="monotone" dataKey="coreGoods" name="Core Goods" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} />
                )}
                {showEnergy && (
                  <Line type="monotone" dataKey="energy" name="Energy" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                )}
                {showFood && (
                  <Line type="monotone" dataKey="food" name="Food" stroke="#10b981" strokeWidth={1.5} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Contribution Waterfall Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-sky-500" />
                Latest Basket Contribution Breakdown ({latestData.year})
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">
                Summed Drag/Push: {contributions.reduce((acc, c) => acc + c.contribution, 0).toFixed(2)} pts
              </span>
            </div>

            <div className="space-y-2">
              {contributions.map((c) => (
                <div key={c.name} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{c.name}</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      YoY: <strong className="text-slate-900 dark:text-white">{formatPercent(c.yoy)}</strong> × Weight: {c.weight}% ={' '}
                      <span className={c.contribution >= 0 ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                        {c.contribution >= 0 ? `+${c.contribution.toFixed(2)}` : c.contribution.toFixed(2)} pts
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(Math.max(Math.abs(c.contribution) * 25, 2), 100)}%`,
                        backgroundColor: c.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Supercore & Services Tab */}
      {activeTab === 'supercore-radar' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10 border border-pink-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-pink-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                The Powell Doctrine: Why Core Services ex-Shelter Determines Interest Rates
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Federal Reserve Chair Jerome Powell identified <strong>Supercore Inflation</strong> (services excluding housing) as the purest barometer of domestic wage-push inflation. Because housing has long contractual leases and goods prices are dominated by global supply chains, service sector prices reflect domestic wages directly. If Supercore stays above 3.0%, central banks cannot safely declare victory over inflation.
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profile.historicalSeries} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: any, name: any) => [`${Number(val).toFixed(1)}%`, name]}
                />
                <ReferenceLine y={2.0} stroke="#10b981" strokeDasharray="3 3" label={{ value: '2.0% Fed Target', fill: '#10b981', fontSize: 10, position: 'right' }} />
                <Line type="monotone" dataKey="supercoreCpi" name="Supercore (Services ex-Shelter)" stroke="#ec4899" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="coreCpi" name="Core CPI" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="shelterOer" name="Shelter / Housing" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Upstream Pipeline Indicator Tab */}
      {activeTab === 'pipeline-ppi' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {pipelineSignal.headline}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {pipelineSignal.explanation}
            </p>
            <div className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-300 pt-1">
              Active Pipeline Spread: Δ = {latestData.ppiFinalDemand.toFixed(1)}% (PPI) - {latestData.headlineCpi.toFixed(1)}% (CPI) ={' '}
              <span className={latestData.ppiCpiSpread >= 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                {latestData.ppiCpiSpread >= 0 ? `+${latestData.ppiCpiSpread.toFixed(1)}%` : `${latestData.ppiCpiSpread.toFixed(1)}%`}
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profile.historicalSeries} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: any, name: any) => [`${Number(val).toFixed(1)}%`, name]}
                />
                <ReferenceLine y={0} stroke={axisStroke} />
                <Bar dataKey="ppiFinalDemand" name="Producer Price Index (PPI Final Demand)" fill="#a855f7" radius={[3, 3, 0, 0]} />
                <Bar dataKey="headlineCpi" name="Consumer Price Index (CPI Retail)" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Educational Explainer Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08] text-xs text-slate-600 dark:text-slate-400 leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <strong className="text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-amber-500" /> The Shelter Lag Trap
          </strong>
          Shelter constitutes ~34% of US CPI, measured via survey-based Owners&apos; Equivalent Rent (OER). Because lease agreements reset every 12 months, CPI shelter lags spot rental price collapses by up to 18 months.
        </div>
        <div>
          <strong className="text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-cyan-500" /> Core Goods Disinflation
          </strong>
          Physical goods (appliances, vehicles, furniture) surged during pandemic supply bottlenecks, then experienced negative YoY deflation as container freight rates collapsed back to pre-2020 levels.
        </div>
        <div>
          <strong className="text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-pink-500" /> Wage-Price Stickiness
          </strong>
          Unlike goods that can be imported cheaply from emerging markets, domestic haircuts, dining, healthcare, and repairs depend entirely on local labor. Supercore tracks this wage spiral.
        </div>
      </div>
    </div>
  );
}
