'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { GLOBAL_WEALTH_HISTORY } from '../../data/global-wealth';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import {
  calculateCountryWealthDistribution,
  toGlobalWealthDistribution,
} from '../../lib/calculations';
import { WealthPyramid } from '../../components/wealth/WealthPyramid';
import { InequalityTrends } from '../../components/wealth/InequalityTrends';
import { WealthCalculator } from '../../components/wealth/WealthCalculator';
import { PppConverter } from '../../components/wealth/PppConverter';
import { HouseholdVulnerabilityRadar } from '../../components/wealth/HouseholdVulnerabilityRadar';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { Compass, Globe2, CheckCircle2, RotateCcw, Share2, Check } from 'lucide-react';
import { extractParamsFromUrl } from '../../lib/deep-link';

const FEATURED_SOVEREIGN_SCOPES = [
  { code: 'GLOBAL', label: 'Global World', flag: '🌍' },
  { code: 'USA', label: 'United States', flag: '🇺🇸' },
  { code: 'AUS', label: 'Australia', flag: '🇦🇺' },
  { code: 'CHE', label: 'Switzerland', flag: '🇨🇭' },
  { code: 'CHN', label: 'China', flag: '🇨🇳' },
  { code: 'DEU', label: 'Germany', flag: '🇩🇪' },
  { code: 'JPN', label: 'Japan', flag: '🇯🇵' },
  { code: 'IND', label: 'India', flag: '🇮🇳' },
  { code: 'BRA', label: 'Brazil', flag: '🇧🇷' },
];

export default function WealthPage() {
  const { selectedYear, currencyPerspective, markChallengeCompleted, completedChallenges } = useApp();
  const [calculatorView, setCalculatorView] = useState<'percentile' | 'ppp'>('percentile');
  const [scopeCode, setScopeCode] = useState<string>('GLOBAL');
  const [predictedTop1Share, setPredictedTop1Share] = useState<number>(30);
  const [isPredictionRevealed, setIsPredictionRevealed] = useState<boolean>(false);
  const [hasCopiedScopeLink, setHasCopiedScopeLink] = useState<boolean>(false);

  /*
   * Hydrate sovereign scope and calculator view from URL query parameters or hash anchors
   * so users clicking a shared link from /geography or social channels land directly on that country's pyramid.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = extractParamsFromUrl();
    const hash = window.location.hash;
    const calcParam = params.get('calc');
    const scopeParam = (params.get('scope') || params.get('country') || params.get('wc_c'))?.toUpperCase();

    if (scopeParam) {
      if (scopeParam === 'GLOBAL' || COUNTRIES_DATA.some((c) => c.code === scopeParam)) {
        setScopeCode(scopeParam);
      }
    }

    if (calcParam === 'ppp' || hash.includes('ppp') || params.has('ppp_f') || params.has('ppp_amount')) {
      setCalculatorView('ppp');
    } else if (calcParam === 'percentile' || hash.includes('wealth') || params.has('wc_c') || params.has('wc_nw')) {
      setCalculatorView('percentile');
    }
  }, []);

  const handleSelectScope = (nextCode: string) => {
    setScopeCode(nextCode);
    setIsPredictionRevealed(false);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (nextCode === 'GLOBAL') {
          url.searchParams.delete('scope');
        } else {
          url.searchParams.set('scope', nextCode);
        }
        window.history.replaceState(window.history.state, '', url.toString());
      } catch {
        // Ignore in restricted webviews
      }
    }
  };

  const handleCopyScopeLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (scopeCode === 'GLOBAL') {
      url.searchParams.delete('scope');
    } else {
      url.searchParams.set('scope', scopeCode);
    }
    url.searchParams.set('year', String(selectedYear));
    navigator.clipboard?.writeText(url.toString()).then(() => {
      setHasCopiedScopeLink(true);
      setTimeout(() => setHasCopiedScopeLink(false), 2000);
    });
  };

  const globalBaseline =
    GLOBAL_WEALTH_HISTORY.find((w) => w.year === selectedYear) ||
    GLOBAL_WEALTH_HISTORY[GLOBAL_WEALTH_HISTORY.length - 1];

  const activeDistribution = useMemo(() => {
    if (scopeCode === 'GLOBAL') {
      return toGlobalWealthDistribution(globalBaseline);
    }
    const country = COUNTRIES_DATA.find((c) => c.code === scopeCode);
    if (!country) {
      return toGlobalWealthDistribution(globalBaseline);
    }
    return calculateCountryWealthDistribution(country, selectedYear);
  }, [scopeCode, selectedYear, globalBaseline]);

  const actualTop1Share = activeDistribution.shares.top1Percent;
  const predictionDelta = Math.abs(predictedTop1Share - actualTop1Share);
  const challengeId = `wealth-predict-top1-${scopeCode.toLowerCase()}`;
  const hasEarnedXp = completedChallenges.includes(challengeId);

  const handleRevealPrediction = () => {
    setIsPredictionRevealed(true);
    markChallengeCompleted(challengeId);
  };

  return (
    <div className="space-y-8">
      {/* Chapter 02 Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-6">
        <div className="inline-flex items-center gap-2 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
            Field Guide • Chapter 02
          </span>
          <span>•</span>
          <span>Wealth Distribution &amp; Sovereign Inequality</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Who Holds the Wealth of the World—and Inside Each Nation?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 max-w-2xl font-normal leading-relaxed">
          Explore how private wealth is stacked across population tiers globally or inside any of 71 sovereign economies, why $100,000 buys wildly different lives in Zurich vs. Madrid, and where your household ranks.
        </p>
      </div>

      <TimelineControls />

      {/* Sovereign Wealth Scope Selector + Predict-First Active Learning Hook */}
      <div className="apple-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-4">
          <div>
            <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              00 / SOVEREIGN WEALTH DISTRIBUTION LENS (71 ECONOMIES)
            </span>
            <h2 className="font-editorial text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
              Inspect Global or Country-Specific Wealth Pyramids
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Switch between the aggregate planetary wealth pyramid and individual national distributions across all 71 tracked countries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label htmlFor="wealth-scope-select" className="sr-only">
              Select Country or Global Scope
            </label>
            <select
              id="wealth-scope-select"
              value={scopeCode}
              onChange={(e) => handleSelectScope(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c1017] px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="GLOBAL">🌍 Global World Total (All 71 Economies)</option>
              {COUNTRIES_DATA.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code}) — {c.region}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleCopyScopeLink}
              className={`tactile-button inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                hasCopiedScopeLink
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                  : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/[0.12]'
              }`}
            >
              {hasCopiedScopeLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                  <span>Share Scope</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Featured Quick-Switch Country Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Quick Compare:
          </span>
          {FEATURED_SOVEREIGN_SCOPES.map((item) => {
            const isActive = scopeCode === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelectScope(item.code)}
                className={`tactile-button inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-700 shadow-sm'
                    : 'bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:bg-slate-200/70 dark:hover:bg-white/[0.09]'
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Learning Predict-First Intuition Slider */}
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] dark:bg-emerald-500/[0.04] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Intuition Lab • +15 XP
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Predict Before Reading: How much of {activeDistribution.scopeName}&apos;s wealth is held by the Top 1%?
              </span>
            </div>
            {hasEarnedXp && (
              <span className="inline-flex items-center gap-1 font-mono-tabular text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> +15 XP Earned
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex justify-between text-xs font-mono-tabular">
                <span className="text-slate-600 dark:text-slate-300">
                  Your Guess for {activeDistribution.flag} {activeDistribution.scopeName} ({selectedYear}):{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{predictedTop1Share}%</strong>
                </span>
                <span className="text-slate-500 dark:text-slate-400">Scale: 5% (Egalitarian) → 60% (Oligarchic)</span>
              </div>
              <input
                type="range"
                aria-label={`Predict Top 1% wealth share in ${activeDistribution.scopeName}`}
                min={5}
                max={60}
                step={1}
                value={predictedTop1Share}
                onChange={(e) => setPredictedTop1Share(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-2">
              {!isPredictionRevealed ? (
                <button
                  type="button"
                  onClick={handleRevealPrediction}
                  className="tactile-button w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 border-emerald-700 text-xs font-bold cursor-pointer shadow-sm"
                >
                  Lock Guess &amp; Reveal Reality
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPredictionRevealed(false)}
                  className="tactile-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/[0.08] text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/[0.15] text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {isPredictionRevealed && (
            <div className="mt-3.5 pt-3 border-t border-emerald-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono-tabular font-bold text-emerald-600 dark:text-emerald-400">
                  Actual Top 1% Share: {actualTop1Share.toFixed(1)}%
                </span>{' '}
                (Your guess was off by <span className="font-mono-tabular font-semibold">{predictionDelta.toFixed(1)} percentage points</span>).{' '}
                The Bottom 50% of adults in {activeDistribution.scopeName} hold{' '}
                <span className="font-mono-tabular font-semibold">{activeDistribution.shares.bottom50Percent.toFixed(1)}%</span>, while the Middle 40% hold{' '}
                <span className="font-mono-tabular font-semibold">{activeDistribution.shares.middle40Percent.toFixed(1)}%</span>.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wealth Pyramid (Supports Global or Any Country + Global Benchmark Ghost) */}
      <WealthPyramid
        data={activeDistribution}
        globalBaseline={globalBaseline}
        currencyPerspective={currencyPerspective}
      />

      {/* Inequality Trends Chart (Dynamically tracks selected country or Global) */}
      <InequalityTrends scopeCode={scopeCode} />

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
