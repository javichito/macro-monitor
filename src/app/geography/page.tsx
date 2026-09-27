'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { WorldMap } from '../../components/map/WorldMap';
import { CountryComparison } from '../../components/geography/CountryComparison';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { MapPin, Globe } from 'lucide-react';

export default function GeographyPage() {
  const {
    selectedYear,
    currencyPerspective,
    granularity,
    setGranularity,
  } = useApp();

  /*
   * Allow interactive jump from map inspector into the duel comparison.
   */
  const [duelCountryA, setDuelCountryA] = useState('USA');
  const [duelCountryB, setDuelCountryB] = useState('CHN');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1 text-xs font-medium text-slate-200 mb-3 shadow-inner">
          <MapPin className="h-3.5 w-3.5 text-sky-400" />
          <span>Geographic &amp; Coalition Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          World Wealth &amp; Macro Heatmap
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
          Interact with global territories and major economic coalitions (G7, BRICS+, Eurozone). Toggle granularity to compare sovereign nations against global geopolitical blocs over time.
        </p>
      </div>

      <TimelineControls />

      {/* Interactive Map & Inspector */}
      <WorldMap
        selectedYear={selectedYear}
        currencyPerspective={currencyPerspective}
        granularity={granularity}
        onGranularityChange={setGranularity}
        onCompareCountry={(code) => {
          setDuelCountryA(code);
        }}
      />

      {/* Head-to-Head Country Comparison Duel */}
      <CountryComparison
        selectedYear={selectedYear}
        currencyPerspective={currencyPerspective}
        initialCountryCodeA={duelCountryA}
        initialCountryCodeB={duelCountryB}
      />

      {/* Educational Explainer */}
      <PlainEnglishCard
        title="Why does Australia have a higher median wealth than the United States, despite the US having more mega-billionaires?"
        summary="In the US, total wealth is immense, but heavily concentrated at the very top (the top 1% owns over 30% of national assets), which lowers the median for the middle person ($118k)."
        detail="In Australia, compulsory superannuation (retirement pensions) and widespread homeownership are distributed more uniformly across the population, resulting in a world-leading median wealth of over $275,000 per adult."
        takeaway="A nation can be exceptionally wealthy on average while its typical middle-class citizen possesses less than peers in countries with flatter wealth distributions."
        defaultExpanded={true}
      />
    </div>
  );
}
