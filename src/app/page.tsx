'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { TimelineControls } from '../components/layout/TimelineControls';
import { GLOBAL_WEALTH_HISTORY } from '../data/global-wealth';
import { MACRO_TRENDS_HISTORY } from '../data/macro-trends';
import { WealthPyramid } from '../components/wealth/WealthPyramid';
import { WealthIntuitionLab } from '../components/wealth/WealthIntuitionLab';
import { AssetEvolutionChart } from '../components/assets/AssetEvolutionChart';
import { PlainEnglishCard } from '../components/explainers/PlainEnglishCard';
import { formatCurrency, formatPercent, adjustValue } from '../lib/formatters';
import { ArrowRight } from 'lucide-react';

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
  const adjustedMean = adjustValue(
    currentWealth.meanWealthPerAdult,
    selectedYear,
    currencyPerspective
  );

  const wealthToGdpMultiple = (adjustedWealthTrillion / Math.max(1, adjustedGdpTrillion)).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Editorial Chapter Header — human, warm, and curiosity-led */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-white/[0.09]">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
              Field Guide • Chapter 01
            </span>
            <span>•</span>
            <span>Earth&apos;s Financial Balance Sheet</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            How Much Money &amp; Wealth Exists on Planet Earth?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 max-w-2xl font-normal leading-relaxed">
            If you sold every house, stock, factory, and gold bar in the world—and paid off every debt—what would be left? Scrub the time machine below or test your intuition to see how the global pie is baked and sliced.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] text-xs text-slate-600 dark:text-slate-300 self-start md:self-auto font-mono-tabular">
          <span>Valuation Lens:</span>
          <span className="font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider">
            {currencyPerspective} USD
          </span>
        </div>
      </div>

      {/* Interactive Economic Time Machine */}
      <TimelineControls />

      {/* Numbered Field-Guide Metrics (Replaces repetitive AI icon-in-a-box grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Metric 01: Total Net Worth */}
        <div className="apple-card apple-card-hover p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Total Global Wealth
            </span>
            <span className="font-mono-tabular text-xs font-extrabold text-emerald-500 dark:text-emerald-400">
              01 / NET WORTH
            </span>
          </div>
          <div className="font-mono-tabular text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            {formatCurrency(adjustedWealthTrillion * 1_000_000_000_000, { compact: true })}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
            Everything humanity owns minus debts across{' '}
            <strong className="font-mono-tabular text-slate-700 dark:text-slate-200">
              {currentWealth.adultPopulationBillions.toFixed(2)}B
            </strong>{' '}
            adults ({wealthToGdpMultiple}x annual world output).
          </p>
        </div>

        {/* Metric 02: Annual Economic Output */}
        <div className="apple-card apple-card-hover p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              World Annual GDP
            </span>
            <span className="font-mono-tabular text-xs font-extrabold text-sky-500 dark:text-sky-400">
              02 / INCOME FLOW
            </span>
          </div>
          <div className="font-mono-tabular text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            {formatCurrency(adjustedGdpTrillion * 1_000_000_000_000, { compact: true })}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
            Think of Wealth as the <em>water in the bathtub</em>, and GDP as the <em>faucet pouring in</em> over 12 months.
          </p>
        </div>

        {/* Metric 03: The Typical Human */}
        <div className="apple-card apple-card-hover p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Median Adult Wealth
            </span>
            <span className="font-mono-tabular text-xs font-extrabold text-amber-500 dark:text-amber-400">
              03 / MIDDLE HUMAN
            </span>
          </div>
          <div className="font-mono-tabular text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            {formatCurrency(adjustedMedian, { compact: true })}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
            Half of all adults on Earth own less than this, and half own more. Contrast with the{' '}
            <strong className="font-mono-tabular text-slate-700 dark:text-slate-200">
              {formatCurrency(adjustedMean, { compact: true })}
            </strong>{' '}
            average.
          </p>
        </div>

        {/* Metric 04: Global Debt Tab */}
        <div className="apple-card apple-card-hover p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Global Debt Ratio
            </span>
            <span className="font-mono-tabular text-xs font-extrabold text-rose-500 dark:text-rose-400">
              04 / LEVERAGE
            </span>
          </div>
          <div className="font-mono-tabular text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            {formatPercent(currentMacro.globalDebtToGdp)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
            Combined government, corporate, and household IOUs ({formatCurrency(currentMacro.globalDebtTrillion * 1_000_000_000_000, { compact: true })}) vs. world GDP.
          </p>
        </div>
      </div>

      {/* Predict-First Interactive Learning Lab */}
      <WealthIntuitionLab
        selectedYear={selectedYear}
        medianWealthUsd={adjustedMedian}
        meanWealthUsd={adjustedMean}
        adultPopulationBillions={currentWealth.adultPopulationBillions}
      />

      {/* Interactive Concept Card with Built-in Intuition Quiz */}
      <PlainEnglishCard
        id="overview-median-vs-mean"
        title="Why does the 'Median' wealth tell the true human story?"
        summary="If a billionaire walks into a room of 100 people with $0, the 'average' wealth suddenly becomes $10,000,000—even though 99 people remain broke. The 'Median' is the exact person in the middle."
        detail="Worldwide in 2026, the average wealth per adult is ~$98,200, but the median is only ~$9,750. That means the typical global citizen owns roughly one-tenth of the statistical average, because high-net-worth individuals at the top pull up the mean significantly."
        takeaway="Always evaluate median wealth to understand standard of living; use average wealth only to gauge aggregate capital capacity."
        defaultExpanded={true}
        quiz={{
          question: 'If the top 1% of stock owners double their fortune tomorrow while everyone else stays flat, what happens to the global Median vs. Average wealth?',
          options: [
            'Both Median and Average double',
            'Average jumps higher, while Median barely moves',
            'Median jumps higher, while Average drops',
            'Neither number changes',
          ],
          correctIndex: 1,
          feedback:
            'Because the 50th-percentile person in the middle didn’t gain anything, the Median stays flat—while the billionaire-heavy Average surges upward!',
        }}
      />

      {/* Wealth Pyramid Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              Visualizing the Pyramid
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Global Wealth Concentration ({selectedYear})
            </h2>
          </div>
          <Link
            href="/wealth"
            className="tactile-button inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-700 text-xs font-bold transition-all self-start sm:self-auto"
          >
            <span>Test Where You Rank Globally</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <WealthPyramid data={currentWealth} currencyPerspective={currencyPerspective} />
      </div>

      {/* Asset Stack Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-sky-400">
              Follow the Money
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Asset Class Breakdown
            </h2>
          </div>
          <Link
            href="/assets"
            className="tactile-button inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white border-sky-700 text-xs font-bold transition-all self-start sm:self-auto"
          >
            <span>Explore Houses vs. Stocks vs. Gold</span>
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
