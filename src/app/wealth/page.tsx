'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { GLOBAL_WEALTH_HISTORY } from '../../data/global-wealth';
import { WealthPyramid } from '../../components/wealth/WealthPyramid';
import { InequalityTrends } from '../../components/wealth/InequalityTrends';
import { WealthCalculator } from '../../components/wealth/WealthCalculator';
import { PppConverter } from '../../components/wealth/PppConverter';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { TrendingUp, Scale, Compass, Globe2 } from 'lucide-react';

export default function WealthPage() {
  const { selectedYear, currencyPerspective } = useApp();
  const [calculatorView, setCalculatorView] = useState<'percentile' | 'ppp'>('percentile');

  const currentWealth =
    GLOBAL_WEALTH_HISTORY.find((w) => w.year === selectedYear) ||
    GLOBAL_WEALTH_HISTORY[GLOBAL_WEALTH_HISTORY.length - 1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1 text-xs font-medium text-slate-200 mb-3 shadow-inner">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span>Wealth Distribution &amp; Inequality</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Who Holds the Wealth of the World?
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
          Track the distribution of private wealth across population tiers, understand the historical evolution of the wealth gap, and discover where your household sits on the global and national spectrum.
        </p>
      </div>

      <TimelineControls />

      {/* Wealth Pyramid */}
      <WealthPyramid data={currentWealth} currencyPerspective={currencyPerspective} />

      {/* Inequality Trends Chart */}
      <InequalityTrends />

      {/* Plain English Guide */}
      <PlainEnglishCard
        title="What is the Gini Coefficient, and why should regular people care?"
        summary="The Gini Coefficient is a single number between 0 (everyone owns exactly the same) and 1 (one single person owns everything on Earth). It measures how evenly economic wealth is spread."
        detail="Global wealth inequality has a Gini around 0.88—far higher than income inequality (~0.65). This occurs because wealth accumulates exponentially through compound growth, property appreciation, and equity ownership, while labor wages grow linearly."
        takeaway="Even though wealth inequality within some Western countries increased recently, global inequality between countries actually decreased slightly since 2000 as hundreds of millions in Asia and Latin America joined the middle class."
        defaultExpanded={false}
      />

      <PlainEnglishCard
        title="What is Purchasing Power Parity (PPP), and how does geo-arbitrage work?"
        summary="PPP measures what money can actually buy in goods and services inside a specific country, eliminating artificial currency exchange rate distortions."
        detail="Under the Balassa-Samuelson effect, non-tradable services like housing rent, healthcare, transport, and dining out are drastically cheaper in developing or lower-cost economies because local wages are lower. Tradable electronics or cars, however, cost almost the same globally."
        takeaway="A household with $150,000 has middle-class purchasing power in high-cost hubs like Zurich or San Francisco, but upper-echelon purchasing power in Spain, Japan, or India. True economic freedom is a function of both your capital and where you spend it."
        defaultExpanded={false}
      />

      {/* Interactive Tool Suite */}
      <div className="pt-4 space-y-4">
        {/* Segmented Pill Selector */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setCalculatorView('percentile')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                calculatorView === 'percentile'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Percentile Positioner</span>
            </button>
            <button
              type="button"
              onClick={() => setCalculatorView('ppp')}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                calculatorView === 'ppp'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>PPP Cost-of-Living Converter</span>
            </button>
          </div>

          <span className="text-xs text-white/50 hidden sm:inline-block">
            {calculatorView === 'percentile'
              ? 'Calculate domestic & global wealth percentile'
              : 'Calculate real purchasing power across 31 economies'}
          </span>
        </div>

        {/* View Switcher */}
        {calculatorView === 'percentile' ? (
          <WealthCalculator onSwitchToPpp={() => setCalculatorView('ppp')} />
        ) : (
          <PppConverter />
        )}
      </div>
    </div>
  );
}
