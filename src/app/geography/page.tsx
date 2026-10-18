'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { WorldMap, MapMetricType, VALID_MAP_METRICS, REGION_PRESETS } from '../../components/map/WorldMap';
import { CountryComparison, DuelLens, VALID_DUEL_LENSES } from '../../components/geography/CountryComparison';
import {
  CountryRankingsTable,
  LeagueSortField,
  VALID_LEAGUE_SORT_FIELDS,
  LeagueTableLens,
  VALID_LEAGUE_TABLE_LENSES,
  SortDirection,
} from '../../components/geography/CountryRankingsTable';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { Trophy, GitCompare } from 'lucide-react';
import { COUNTRIES_DATA, ECONOMIC_BLOCS } from '../../data/country-metrics';

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
  const [duelLens, setDuelLens] = useState<DuelLens>('all');

  const [mapMetric, setMapMetric] = useState<MapMetricType>('wealthPerAdult');
  const [mapCountryCode, setMapCountryCode] = useState<string>('USA');
  const [mapBlocId, setMapBlocId] = useState<string>('g7');
  const [mapRegion, setMapRegion] = useState<string>('global');

  const [leagueSortField, setLeagueSortField] = useState<LeagueSortField>('medianWealth');
  const [leagueSortDir, setLeagueSortDir] = useState<SortDirection>('desc');
  const [leagueRegionFilter, setLeagueRegionFilter] = useState<string>('all');
  const [leagueTableLens, setLeagueTableLens] = useState<LeagueTableLens>('overview');
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate deep link params from URL if present on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const validCountryCodes = new Set(COUNTRIES_DATA.map((c) => c.code));
    const validBlocIds = new Set(ECONOMIC_BLOCS.map((b) => b.id));

    const countryA = params.get('a')?.toUpperCase();
    const countryB = params.get('b')?.toUpperCase();
    const tabParam = params.get('tab');
    const lensParam = params.get('lens') as DuelLens | null;
    const metricParam = params.get('metric') as MapMetricType | null;
    const countryParam = params.get('country')?.toUpperCase();
    const blocParam = params.get('bloc')?.toLowerCase();
    const regionParam = params.get('region')?.toLowerCase();
    const sortParam = params.get('sort') as LeagueSortField | null;
    const dirParam = params.get('dir') as SortDirection | null;
    const filterRegionParam = params.get('filterRegion');
    const tableLensParam = params.get('tableLens') as LeagueTableLens | null;

    if (countryA && validCountryCodes.has(countryA)) setDuelCountryA(countryA);
    if (countryB && validCountryCodes.has(countryB)) setDuelCountryB(countryB);
    if (tabParam === 'rankings' || tabParam === 'league-table') {
      setActiveTab('league-table');
    } else if (tabParam === 'map-duel') {
      setActiveTab('map-duel');
    }

    if (lensParam && VALID_DUEL_LENSES.includes(lensParam)) {
      setDuelLens(lensParam);
    }
    if (metricParam && VALID_MAP_METRICS.includes(metricParam)) {
      setMapMetric(metricParam);
    }
    if (countryParam && validCountryCodes.has(countryParam)) {
      setMapCountryCode(countryParam);
    }
    if (blocParam && validBlocIds.has(blocParam)) {
      setMapBlocId(blocParam);
    }
    if (regionParam && REGION_PRESETS[regionParam]) {
      setMapRegion(regionParam);
    }
    if (sortParam && VALID_LEAGUE_SORT_FIELDS.includes(sortParam)) {
      setLeagueSortField(sortParam);
    }
    if (dirParam === 'asc' || dirParam === 'desc') {
      setLeagueSortDir(dirParam);
    }
    if (filterRegionParam) {
      setLeagueRegionFilter(filterRegionParam);
    }
    if (tableLensParam && VALID_LEAGUE_TABLE_LENSES.includes(tableLensParam)) {
      setLeagueTableLens(tableLensParam);
    }

    setIsHydrated(true);
  }, []);

  /*
   * Continuously synchronize interactive Geography state into the browser URL query parameters
   * so any clickable tab, map metric, country selection, duel matchup, analytical lens,
   * or league table sort/filter is immediately shareable from the address bar.
   */
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', activeTab);
      url.searchParams.set('year', String(selectedYear));
      url.searchParams.set('currency', currencyPerspective);
      url.searchParams.set('granularity', granularity);

      if (activeTab === 'map-duel') {
        url.searchParams.set('a', duelCountryA);
        url.searchParams.set('b', duelCountryB);
        url.searchParams.set('lens', duelLens);
        url.searchParams.set('metric', mapMetric);
        url.searchParams.set('country', mapCountryCode);
        if (granularity === 'bloc') {
          url.searchParams.set('bloc', mapBlocId);
        } else {
          url.searchParams.delete('bloc');
        }
        if (mapRegion && mapRegion !== 'global') {
          url.searchParams.set('region', mapRegion);
        } else {
          url.searchParams.delete('region');
        }
      } else {
        url.searchParams.set('tableLens', leagueTableLens);
        url.searchParams.set('sort', leagueSortField);
        url.searchParams.set('dir', leagueSortDir);
        if (leagueRegionFilter !== 'all') {
          url.searchParams.set('filterRegion', leagueRegionFilter);
        } else {
          url.searchParams.delete('filterRegion');
        }
      }

      if (window.location.href !== url.toString()) {
        window.history.replaceState(window.history.state, '', url.toString());
      }
    } catch {
      // Fail gracefully in restricted webviews
    }
  }, [
    isHydrated,
    activeTab,
    selectedYear,
    currencyPerspective,
    granularity,
    duelCountryA,
    duelCountryB,
    duelLens,
    mapMetric,
    mapCountryCode,
    mapBlocId,
    mapRegion,
    leagueTableLens,
    leagueSortField,
    leagueSortDir,
    leagueRegionFilter,
  ]);

  const handleSelectForDuel = (code: string) => {
    if (code === duelCountryB) {
      setDuelCountryB(duelCountryA);
    }
    setDuelCountryA(code);
    setMapCountryCode(code);
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
            Click any nation on the map to inspect its balance sheet across 15 macro layers, pit two superpowers head-to-head across 22 indicators in the duel arena, or sort the 71-country global league table.
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
            activeMetric={mapMetric}
            onMetricChange={setMapMetric}
            selectedCountryCode={mapCountryCode}
            onSelectCountryChange={setMapCountryCode}
            selectedBlocId={mapBlocId}
            onSelectBlocChange={setMapBlocId}
            activeRegion={mapRegion}
            onRegionChange={setMapRegion}
            onCompareCountry={(code) => {
              if (code === duelCountryB) {
                setDuelCountryB(duelCountryA);
              }
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
            onCountriesChange={(codeA, codeB) => {
              setDuelCountryA(codeA);
              setDuelCountryB(codeB);
            }}
            activeLens={duelLens}
            onLensChange={setDuelLens}
          />
        </>
      ) : (
        /* Global Sovereign Rankings / League Table */
        <CountryRankingsTable
          selectedYear={selectedYear}
          currencyPerspective={currencyPerspective}
          onSelectCountryForDuel={handleSelectForDuel}
          sortField={leagueSortField}
          sortDirection={leagueSortDir}
          onSortChange={(field, dir) => {
            setLeagueSortField(field);
            setLeagueSortDir(dir);
          }}
          selectedRegion={leagueRegionFilter}
          onRegionFilterChange={setLeagueRegionFilter}
          activeTableLens={leagueTableLens}
          onTableLensChange={setLeagueTableLens}
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
