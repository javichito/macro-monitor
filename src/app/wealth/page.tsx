'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { GLOBAL_WEALTH_HISTORY } from '../../data/global-wealth';
import { WealthPyramid } from '../../components/wealth/WealthPyramid';
import { InequalityTrends } from '../../components/wealth/InequalityTrends';
import { WealthCalculator } from '../../components/wealth/WealthCalculator';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { TrendingUp, Scale, Award } from 'lucide-react';

export default function WealthPage() {
  const { selectedYear, currencyPerspective } = useApp();

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

      {/* Where Do You Stand? Personal Calculator */}
      <div className="pt-4">
        <WealthCalculator />
      </div>
    </div>
  );
}
