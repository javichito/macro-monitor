'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { WorldMap } from '../../components/map/WorldMap';
import { CountryComparison } from '../../components/geography/CountryComparison';
import { CountryRankingsTable } from '../../components/geography/CountryRankingsTable';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { MapPin, Globe, Trophy, GitCompare } from 'lucide-react';

export default function GeographyPage() {
  const {
    selectedYear,
    currencyPerspective,
    granularity,
    setGranularity,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'map-duel' | 'league-table'>('map-duel');
  const [duelCountryA, setDuelCountryA] = useState('USA');
  const [duelCountryB, setDuelCountryB] = useState('CHN');

  // Hydrate deep link params from URL if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const countryA = params.get('a');
    const countryB = params.get('b');
    const tabParam = params.get('tab');

    if (countryA) setDuelCountryA(countryA.toUpperCase());
    if (countryB) setDuelCountryB(countryB.toUpperCase());
    if (tabParam === 'rankings' || tabParam === 'league-table') {
      setActiveTab('league-table');
    }
  }, []);

  const handleSelectForDuel = (code: string) => {
    setDuelCountryA(code);
    setActiveTab('map-duel');
    // Smooth scroll down to the duel arena
    setTimeout(() => {
      const el = document.getElementById('country-comparison');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1 text-xs font-medium text-slate-200 mb-3 shadow-inner">
            <MapPin className="h-3.5 w-3.5 text-sky-400" />
            <span>Geographic &amp; Coalition Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            World Wealth &amp; Sovereign Comparison
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
            Interact with global heatmaps, rank economies in the sovereign league table, and run head-to-head macro balance sheet duels.
          </p>
        </div>

        {/* Apple Segmented View Switcher */}
        <div className="flex items-center rounded-full p-1 bg-white/[0.06] border border-white/[0.10] shadow-inner text-xs self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('map-duel')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'map-duel'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Map &amp; Duel</span>
          </button>
          <button
            onClick={() => setActiveTab('league-table')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'league-table'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>League Table</span>
          </button>
        </div>
      </div>

      <TimelineControls />

      {activeTab === 'map-duel' ? (
        <>
          {/* Interactive Map & Inspector */}
          <WorldMap
            selectedYear={selectedYear}
            currencyPerspective={currencyPerspective}
            granularity={granularity}
            onGranularityChange={setGranularity}
            onCompareCountry={(code) => {
              setDuelCountryA(code);
              const el = document.getElementById('country-comparison');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Head-to-Head Country Comparison Duel */}
          <CountryComparison
            selectedYear={selectedYear}
            currencyPerspective={currencyPerspective}
            initialCountryCodeA={duelCountryA}
            initialCountryCodeB={duelCountryB}
          />
        </>
      ) : (
        /* Global Sovereign Rankings / League Table */
        <CountryRankingsTable
          selectedYear={selectedYear}
          currencyPerspective={currencyPerspective}
          onSelectCountryForDuel={handleSelectForDuel}
        />
      )}

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
