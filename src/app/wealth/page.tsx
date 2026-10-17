'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { GLOBAL_WEALTH_HISTORY } from '../../data/global-wealth';
import { WealthPyramid } from '../../components/wealth/WealthPyramid';
import { InequalityTrends } from '../../components/wealth/InequalityTrends';
import { WealthCalculator } from '../../components/wealth/WealthCalculator';
import { PppConverter } from '../../components/wealth/PppConverter';
import { HouseholdVulnerabilityRadar } from '../../components/wealth/HouseholdVulnerabilityRadar';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { TrendingUp, Scale, Compass, Globe2 } from 'lucide-react';
import { extractParamsFromUrl } from '../../lib/deep-link';

export default function WealthPage() {
  const { selectedYear, currencyPerspective } = useApp();
  const [calculatorView, setCalculatorView] = useState<'percentile' | 'ppp'>('percentile');

  /*
   * Hydrate calculator view from URL query parameters or hash anchors
   * so users clicking a shared PPP or percentile link land directly on the relevant tool.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = extractParamsFromUrl();
    const hash = window.location.hash;
    const calcParam = params.get('calc');

    if (calcParam === 'ppp' || hash.includes('ppp') || params.has('ppp_f') || params.has('ppp_amount')) {
      setCalculatorView('ppp');
    } else if (calcParam === 'percentile' || hash.includes('wealth') || params.has('wc_c') || params.has('wc_nw')) {
      setCalculatorView('percentile');
    }
  }, []);

  const currentWealth =
    GLOBAL_WEALTH_HISTORY.find((w) => w.year === selectedYear) ||
    GLOBAL_WEALTH_HISTORY[GLOBAL_WEALTH_HISTORY.length - 1];

  return (
    <div className="space-y-8">
      {/* Chapter 02 Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-6">
        <div className="inline-flex items-center gap-2 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
            Field Guide • Chapter 02
          </span>
          <span>•</span>
          <span>Wealth Distribution &amp; Inequality</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Who Holds the Wealth of the World?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 max-w-2xl font-normal leading-relaxed">
          Explore how private wealth is stacked across population tiers, why $100,000 buys wildly different lives in Zurich vs. Madrid, and where your household ranks on Earth.
        </p>
      </div>

      <TimelineControls />

      {/* Wealth Pyramid */}
      <WealthPyramid data={currentWealth} currencyPerspective={currencyPerspective} />

      {/* Inequality Trends Chart */}
      <InequalityTrends />

      {/* Interactive Concept Lessons */}
      <PlainEnglishCard
        id="wealth-gini-coefficient"
        title="What is the Gini Coefficient, and why should regular people care?"
        summary="The Gini Coefficient is a single number between 0 (everyone owns exactly the same) and 1 (one single person owns everything on Earth). It measures how evenly economic wealth is spread."
        detail="Global wealth inequality has a Gini around 0.88—far higher than income inequality (~0.65). This occurs because wealth accumulates exponentially through compound growth, property appreciation, and equity ownership, while labor wages grow linearly."
        takeaway="Even though wealth inequality within some Western countries increased recently, global inequality between countries actually decreased slightly since 2000 as hundreds of millions in Asia and Latin America joined the middle class."
        defaultExpanded={true}
        quiz={{
          question: 'Why is wealth inequality (Gini ~0.88) so much higher than income inequality (Gini ~0.65)?',
          options: [
            'Because salaries are taxed less than capital gains',
            'Because assets compound exponentially while wages grow linearly',
            'Because everyone saves the exact same percentage of their paycheck',
            'Because inflation hurts stock owners more than renters',
          ],
          correctIndex: 1,
          feedback:
            'Spot on! Once capital is accumulated, it compounds on itself via equities and real estate, whereas hourly labor scales linearly.',
        }}
      />

      <PlainEnglishCard
        id="wealth-ppp-arbitrage"
        title="What is Purchasing Power Parity (PPP), and how does geo-arbitrage work?"
        summary="PPP measures what money can actually buy in goods and services inside a specific country, eliminating artificial currency exchange rate distortions."
        detail="Under the Balassa-Samuelson effect, non-tradable services like housing rent, healthcare, transport, and dining out are drastically cheaper in developing or lower-cost economies because local wages are lower. Tradable electronics or cars, however, cost almost the same globally."
        takeaway="A household with $150,000 has middle-class purchasing power in high-cost hubs like Zurich or San Francisco, but upper-echelon purchasing power in Spain, Japan, or India. True economic freedom is a function of both your capital and where you spend it."
        defaultExpanded={false}
        quiz={{
          question: 'Which item changes price the MOST when you move from San Francisco to Valencia or Tokyo?',
          options: [
            'A brand-new iPhone or MacBook',
            'An ounce of physical gold',
            'Local rent, haircuts, and dining out (non-tradable services)',
            'A barrel of Brent crude oil',
          ],
          correctIndex: 2,
          feedback:
            'Non-tradable local services depend on local labor and land costs, which is why PPP purchasing power varies dramatically across borders.',
        }}
      />

      <PlainEnglishCard
        id="wealth-cashflow-vulnerability"
        title="Why does top-level median wealth mask dangerous consumer cash-flow vulnerability?"
        summary="Median wealth measures the static stock of accumulated assets (e.g. illiquid home equity or locked pensions), but cannot pay monthly credit card bills or auto loan payments when cash flow is exhausted."
        detail="Over 60% of US mortgage holders locked in sub-4% rates during 2020-21, keeping aggregate mortgage debt service low. However, the bottom 50% wealth tier holds only 2.6% of national wealth, has completely depleted post-pandemic excess savings buffers, and is now burdened by 22%+ credit card APRs—pushing bottom-tier delinquency to 8.4%."
        takeaway="Macroeconomic solvency requires both asset wealth and monthly cash-flow cushion. Tracking the Debt Service Ratio (DSR), savings rate, and delinquency canary in the bottom 50% gives the earliest signal of credit cycle contractions."
        defaultExpanded={false}
      />

      {/* Household Balance Sheets & Consumer Vulnerability Radar */}
      <HouseholdVulnerabilityRadar />

      {/* Interactive Personal Sandbox */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] p-1.5 gap-1">
            <button
              type="button"
              onClick={() => setCalculatorView('percentile')}
              className={`tactile-button flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                calculatorView === 'percentile'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-700 shadow-sm'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.06] border-transparent'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Where Do I Rank? (Percentile Lab)</span>
            </button>
            <button
              type="button"
              onClick={() => setCalculatorView('ppp')}
              className={`tactile-button flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                calculatorView === 'ppp'
                  ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.06] border-transparent'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>How Far Does My Money Go? (PPP Lab)</span>
            </button>
          </div>

          <span className="font-mono-tabular text-xs text-slate-500 dark:text-white/50 hidden sm:inline-block">
            {calculatorView === 'percentile'
              ? 'Personal Lab 01: Domestic & Global Wealth Percentile'
              : 'Personal Lab 02: Real Buying Power Across 31 Economies'}
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
