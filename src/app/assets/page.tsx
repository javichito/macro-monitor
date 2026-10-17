'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { AssetEvolutionChart } from '../../components/assets/AssetEvolutionChart';
import { RegionalAssetBreakdown } from '../../components/assets/RegionalAssetBreakdown';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { Layers, Globe2 } from 'lucide-react';

export default function AssetsPage() {
  const { selectedYear, currencyPerspective } = useApp();
  const [activeTab, setActiveTab] = useState<'global' | 'regional'>('global');

  // Deep link hydration for direct navigation from external links or bookmarks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'regional' || tabParam === 'region') {
      setActiveTab('regional');
    } else if (tabParam === 'global') {
      setActiveTab('global');
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Chapter 03 Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-6">
        <div className="inline-flex items-center gap-2 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
          <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">
            Field Guide • Chapter 03
          </span>
          <span>•</span>
          <span>Global Asset Allocation</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Where is the World&apos;s Wealth Stored?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 max-w-2xl font-normal leading-relaxed">
          Follow the world&apos;s capital across homes, stocks, bonds, government debt, and physical gold from 1980 to 2026—and see why different eras reward tangible bricks over paper claims.
        </p>

        {/* Tactile View Switcher Tabs */}
        <div className="mt-5 inline-flex p-1.5 gap-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09]">
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`tactile-button inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'global'
                ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Global Asset Stack</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('regional')}
            className={`tactile-button inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'regional'
                ? 'bg-emerald-500 text-slate-950 border-emerald-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
            }`}
          >
            <Globe2 className="h-4 w-4" />
            <span>Regional Shift (East vs. West)</span>
          </button>
        </div>
      </div>

      <TimelineControls />

      {/* Conditional Active View */}
      {activeTab === 'global' ? (
        <>
          {/* Primary Asset Class Chart & Category Cards */}
          <AssetEvolutionChart
            currencyPerspective={currencyPerspective}
            selectedYear={selectedYear}
          />

          {/* Educational Explainers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlainEnglishCard
              id="assets-real-estate-dominance"
              title="Why is Real Estate consistently the largest asset class on Earth?"
              summary="Real estate accounts for nearly half of all global private wealth ($297T+ in 2026). Unlike paper securities, real estate fulfills a universal physical need: shelter."
              detail="Governments and central banks historically protect and subsidize mortgages through 30-year fixed loans, tax deductions, and zoning limits that constrain supply. As populations grow and urbanize, finite land values systematically compound."
              takeaway="For the bottom 90% of households, the primary residence represents over 70% of total family net worth."
              defaultExpanded={true}
              quiz={{
                question: 'For a typical middle-class household, which asset represents the vast majority of their net worth?',
                options: [
                  'Corporate stocks & index funds',
                  'Their primary home (residential real estate)',
                  'Physical gold and commodities',
                  'Government treasury bonds',
                ],
                correctIndex: 1,
                feedback:
                  'Over 70% of middle-class wealth is tied up in residential property—while the top 1% holds most of their wealth in corporate equities and private businesses.',
              }}
            />

            <PlainEnglishCard
              id="assets-tangible-vs-paper"
              title="Tangible Assets vs Paper Financial Claims"
              summary="Tangible assets (land, buildings, gold) exist physically in the real world. Financial assets (stocks, bonds, cash) are contractual claims on future earnings."
              detail="During high-inflation eras (such as 2022-2023), tangible assets often retain purchasing power better because their replacement costs rise. During zero-interest-rate bull markets (such as 2010-2021), financial equities explode in valuation as borrowing costs hit floor levels."
              takeaway="A balanced civilization requires both productive physical land and fluid financial markets to allocate capital to innovations."
              defaultExpanded={true}
              quiz={{
                question: 'When inflation spikes and interest rates surge, which asset class typically suffers the most immediate valuation drop?',
                options: [
                  'Long-term fixed-rate paper bonds & high-multiple tech stocks',
                  'Productive farmland and commodities',
                  'Energy infrastructure',
                  'Physical gold reserves',
                ],
                correctIndex: 0,
                feedback:
                  'Paper claims locked into low fixed yields lose real purchasing power when inflation and discount rates rise!',
              }}
            />
          </div>
        </>
      ) : (
        <RegionalAssetBreakdown
          currencyPerspective={currencyPerspective}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
}
