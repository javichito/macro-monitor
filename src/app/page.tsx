'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { TimelineControls } from '../components/layout/TimelineControls';
import { GLOBAL_WEALTH_HISTORY } from '../data/global-wealth';
import { MACRO_TRENDS_HISTORY } from '../data/macro-trends';
import { WealthPyramid } from '../components/wealth/WealthPyramid';
import { AssetEvolutionChart } from '../components/assets/AssetEvolutionChart';
import { PlainEnglishCard } from '../components/explainers/PlainEnglishCard';
import { formatCurrency, formatPercent, adjustValue } from '../lib/formatters';
import {
  Globe2,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Coins,
  Scale,
} from 'lucide-react';

export default function OverviewPage() {
  const { selectedYear, currencyPerspective } = useApp();

  const currentWealth =
    GLOBAL_WEALTH_HISTORY.find((w) => w.year === selectedYear) ||
    GLOBAL_WEALTH_HISTORY[GLOBAL_WEALTH_HISTORY.length - 1];

  const currentMacro =
    MACRO_TRENDS_HISTORY.find((m) => m.year === selectedYear) ||
    MACRO_TRENDS_HISTORY[MACRO_TRENDS_HISTORY.length - 1];

  const adjustedWealthTrillion = adjustValue(
    currentWealth.totalWealthTrillion,
    selectedYear,
    currencyPerspective
  );
  const adjustedGdpTrillion = adjustValue(
    currentMacro.globalGdpTrillion,
    selectedYear,
    currencyPerspective
  );
  const adjustedMedian = adjustValue(
    currentWealth.medianWealthPerAdult,
    selectedYear,
    currencyPerspective
  );

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#242b3d] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <Globe2 className="h-3.5 w-3.5" />
            <span>Macroeconomic & Wealth Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            The Financial State of Planet Earth
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A minimalist observatory designed to help everyday citizens understand global wealth accumulation, asset concentration, and macroeconomic cycles over time.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Viewing Perspective:{' '}
          <span className="font-bold text-emerald-400 uppercase">
            {currencyPerspective} USD
          </span>
        </div>
      </div>

      {/* Global Timeline Controller */}
      <TimelineControls />

      {/* Primary KPI Indicator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Wealth Card */}
        <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">Total Global Wealth</span>
            <Coins className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Combined net worth of all {currentWealth.adultPopulationBillions.toFixed(2)}B adults on Earth.
          </p>
        </div>

        {/* Global GDP Card */}
        <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">World Annual GDP</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {formatCurrency(adjustedGdpTrillion * 1_000_000_000_000, { compact: true })}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Annual economic production of goods and services worldwide.
          </p>
        </div>

        {/* Median Adult Wealth */}
        <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">Median Adult Wealth</span>
            <Scale className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {formatCurrency(adjustedMedian, { compact: true })}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            50% of the world owns less than this, 50% owns more.
          </p>
        </div>

        {/* Global Debt Load */}
        <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">Global Debt Ratio</span>
            <ShieldCheck className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {formatPercent(currentMacro.globalDebtToGdp)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Total debt ({formatCurrency(currentMacro.globalDebtTrillion * 1_000_000_000_000, { compact: true })}) relative to world GDP.
          </p>
        </div>
      </div>

      {/* Plain English Guide */}
      <PlainEnglishCard
        title="Why does the 'Median' wealth tell the true human story?"
        summary="If a billionaire walks into a room of 100 people with $0, the 'average' wealth suddenly becomes $10,000,000—even though 99 people remain broke. The 'Median' is the exact person in the middle."
        detail="Worldwide in 2026, the average wealth per adult is ~$98,200, but the median is only ~$9,750. That means the typical global citizen owns roughly one-tenth of the statistical average, because high-net-worth individuals at the top pull up the mean significantly."
        takeaway="Always evaluate median wealth to understand standard of living; use average wealth only to gauge aggregate capital capacity."
        defaultExpanded={true}
      />

      {/* Wealth Pyramid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Global Wealth Concentration ({selectedYear})
          </h2>
          <Link
            href="/wealth"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Explore Inequality & Calculator <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <WealthPyramid data={currentWealth} currencyPerspective={currencyPerspective} />
      </div>

      {/* Asset Stack Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Asset Class Breakdown
          </h2>
          <Link
            href="/assets"
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Deep Dive Assets <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <AssetEvolutionChart
          currencyPerspective={currencyPerspective}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}
