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
      {/* Chapter 04 Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
              Field Guide • Chapter 04
            </span>
            <span>•</span>
            <span>Country Arena &amp; Sovereign Duels</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            How Do Nations Stack Up Against Each Other?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 max-w-2xl font-normal leading-relaxed">
            Click any nation on the map to inspect its balance sheet, pit two superpowers head-to-head in the duel arena, or sort the global league table.
          </p>
        </div>

        {/* Tactile View Switcher */}
        <div className="flex items-center rounded-2xl p-1.5 gap-1.5 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] text-xs self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('map-duel')}
            className={`tactile-button flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold transition-all cursor-pointer ${
              activeTab === 'map-duel'
                ? 'bg-amber-400 text-slate-950 border-amber-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>World Map &amp; Country Duel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('league-table')}
            className={`tactile-button flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold transition-all cursor-pointer ${
              activeTab === 'league-table'
                ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Sovereign League Table</span>
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
        id="geography-australia-vs-us"
        title="Why does Australia have a higher median wealth than the United States, despite the US having more mega-billionaires?"
        summary="In the US, total wealth is immense, but heavily concentrated at the very top (the top 1% owns over 30% of national assets), which lowers the median for the middle person ($118k)."
        detail="In Australia, compulsory superannuation (retirement pensions) and widespread homeownership are distributed more uniformly across the population, resulting in a world-leading median wealth of over $275,000 per adult."
        takeaway="A nation can be exceptionally wealthy on average while its typical middle-class citizen possesses less than peers in countries with flatter wealth distributions."
        defaultExpanded={true}
        quiz={{
          question: 'Which two policy drivers give Australia a higher median adult net worth than the United States?',
          options: [
            'Mandatory retirement savings (Superannuation) + broad homeownership',
            'Zero income taxes + higher billionaire count',
            'Higher technology stock valuations',
            'Lower national minimum wage',
          ],
          correctIndex: 0,
          feedback:
            'Mandatory employer retirement contributions (Superannuation) and high homeownership ensure the middle 50% of Australians compound wealth automatically.',
        }}
      />
    </div>
  );
}
