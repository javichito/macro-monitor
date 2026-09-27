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
      {/* Hero header with Apple high-contrast clarity */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1 text-xs font-medium text-slate-200 mb-3 shadow-inner">
            <Globe2 className="h-3.5 w-3.5 text-sky-400" />
            <span>Macroeconomic &amp; Wealth Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            The Financial State of Planet Earth
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
            A minimalist observatory designed to help everyday citizens understand global wealth accumulation, asset concentration, and macroeconomic cycles over time.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-slate-300 self-start md:self-auto">
          <span>Perspective:</span>
          <span className="font-semibold text-white uppercase tracking-wider">
            {currencyPerspective} USD
          </span>
        </div>
      </div>

      {/* Global Timeline Controller */}
      <TimelineControls />

      {/* Primary KPI Indicator Grid — Apple Health/Stocks aesthetic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Wealth Card */}
        <div className="apple-card apple-card-hover p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-slate-300">Total Global Wealth</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 shadow-sm">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            {formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            Combined net worth of all {currentWealth.adultPopulationBillions.toFixed(2)}B adults on Earth.
          </p>
        </div>

        {/* Global GDP Card */}
        <div className="apple-card apple-card-hover p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-slate-300">World Annual GDP</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300 border border-sky-500/25 shadow-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            {formatCurrency(adjustedGdpTrillion * 1_000_000_000_000, { compact: true })}
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            Annual economic production of goods and services worldwide.
          </p>
        </div>

        {/* Median Adult Wealth */}
        <div className="apple-card apple-card-hover p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-slate-300">Median Adult Wealth</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25 shadow-sm">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            {formatCurrency(adjustedMedian, { compact: true })}
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            50% of the world owns less than this, 50% owns more.
          </p>
        </div>

        {/* Global Debt Load */}
        <div className="apple-card apple-card-hover p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-slate-300">Global Debt Ratio</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/25 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            {formatPercent(currentMacro.globalDebtToGdp)}
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
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
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Global Wealth Concentration ({selectedYear})
          </h2>
          <Link
            href="/wealth"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <span>Explore Inequality &amp; Calculator</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <WealthPyramid data={currentWealth} currencyPerspective={currencyPerspective} />
      </div>

      {/* Asset Stack Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-sky-400" />
            Asset Class Breakdown
          </h2>
          <Link
            href="/assets"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <span>Deep Dive Assets</span>
            <ArrowRight className="h-3.5 w-3.5" />
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
