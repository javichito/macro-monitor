'use client';

import React, { useState, useMemo } from 'react';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import { getLaborMetricsForCountry } from '../../data/labor-market-data';
import { CurrencyPerspective } from '../../lib/types';
import { calculateCountryWealthDistribution } from '../../lib/calculations';
import { adjustValue, formatCurrency, formatPercent } from '../../lib/formatters';
import { DataExportMenu } from '../common/DataExportMenu';
import {
  ArrowUpDown,
  Search,
  ArrowRight,
  Scale,
  Share2,
  Check,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

export type LeagueSortField =
  | 'name'
  | 'meanWealth'
  | 'medianWealth'
  | 'skew'
  | 'totalWealth'
  | 'top1Share'
  | 'bottom50Share'
  | 'millionaireDensity'
  | 'gdpPerCapita'
  | 'realGdpGrowth'
  | 'inflationRate'
  | 'policyRate'
  | 'bondYield10Y'
  | 'debtToGdp'
  | 'fiscalBalance'
  | 'currentAccount'
  | 'fxReserves'
  | 'unemploymentRate'
  | 'oldAgeDependency'
  | 'population'
  | 'gini';

export const VALID_LEAGUE_SORT_FIELDS: LeagueSortField[] = [
  'name',
  'meanWealth',
  'medianWealth',
  'skew',
  'totalWealth',
  'top1Share',
  'bottom50Share',
  'millionaireDensity',
  'gdpPerCapita',
  'realGdpGrowth',
  'inflationRate',
  'policyRate',
  'bondYield10Y',
  'debtToGdp',
  'fiscalBalance',
  'currentAccount',
  'fxReserves',
  'unemploymentRate',
  'oldAgeDependency',
  'population',
  'gini',
];

export type LeagueTableLens =
  | 'overview'
  | 'wealth'
  | 'macro-rates'
  | 'fiscal-external'
  | 'labor-demographics';

export const VALID_LEAGUE_TABLE_LENSES: LeagueTableLens[] = [
  'overview',
  'wealth',
  'macro-rates',
  'fiscal-external',
  'labor-demographics',
];

export type SortDirection = 'asc' | 'desc';

interface CountryRankingsTableProps {
  selectedYear: number;
  currencyPerspective: CurrencyPerspective;
  onSelectCountryForDuel?: (code: string) => void;
  sortField?: LeagueSortField;
  sortDirection?: SortDirection;
  onSortChange?: (field: LeagueSortField, dir: SortDirection) => void;
  selectedRegion?: string;
  onRegionFilterChange?: (region: string) => void;
  activeTableLens?: LeagueTableLens;
  onTableLensChange?: (lens: LeagueTableLens) => void;
}

const TABLE_LENS_OPTIONS: Array<{ id: LeagueTableLens; label: string; defaultSort: LeagueSortField }> = [
  { id: 'overview', label: 'Core Macro Overview', defaultSort: 'medianWealth' },
  { id: 'wealth', label: '01 / Wealth & Gini', defaultSort: 'medianWealth' },
  { id: 'macro-rates', label: '02 / Growth, CPI & Rates', defaultSort: 'realGdpGrowth' },
  { id: 'fiscal-external', label: '03 / Debt, Fiscal & FX', defaultSort: 'currentAccount' },
  { id: 'labor-demographics', label: '04 / Labor & Demographics', defaultSort: 'unemploymentRate' },
];

export function CountryRankingsTable({
  selectedYear,
  currencyPerspective,
  onSelectCountryForDuel,
  sortField: controlledSortField,
  sortDirection: controlledSortDirection,
  onSortChange,
  selectedRegion: controlledRegion,
  onRegionFilterChange,
  activeTableLens: controlledTableLens,
  onTableLensChange,
}: CountryRankingsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalRegion, setInternalRegion] = useState<string>('all');
  const [internalSortField, setInternalSortField] = useState<LeagueSortField>('medianWealth');
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>('desc');
  const [internalTableLens, setInternalTableLens] = useState<LeagueTableLens>('overview');
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const selectedRegion = controlledRegion ?? internalRegion;
  const sortField = controlledSortField ?? internalSortField;
  const sortDirection = controlledSortDirection ?? internalSortDirection;
  const activeTableLens = controlledTableLens ?? internalTableLens;

  const regions = useMemo(() => {
    const set = new Set<string>();
    COUNTRIES_DATA.forEach((c) => set.add(c.region));
    return ['all', ...Array.from(set).sort()];
  }, []);

  const handleSort = (field: LeagueSortField) => {
    const nextDir: SortDirection =
      sortField === field
        ? sortDirection === 'asc'
          ? 'desc'
          : 'asc'
        : field === 'name' || field === 'unemploymentRate' || field === 'inflationRate'
        ? 'asc'
        : 'desc';

    setInternalSortField(field);
    setInternalSortDirection(nextDir);
    onSortChange?.(field, nextDir);
  };

  const handleRegionChange = (region: string) => {
    setInternalRegion(region);
    onRegionFilterChange?.(region);
  };

  const handleLensChange = (lens: LeagueTableLens) => {
    setInternalTableLens(lens);
    onTableLensChange?.(lens);
  };

  const handleCopyTableLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2000);
    });
  };

  const processedData = useMemo(() => {
    return COUNTRIES_DATA.map((country) => {
      const metrics =
        country.history[selectedYear] ||
        country.history[2026] ||
        country.history[2025];

      const labor = metrics.labor || getLaborMetricsForCountry(country.code, selectedYear);

      const adjMean = adjustValue(
        metrics.wealthPerAdultUSD,
        selectedYear,
        currencyPerspective
      );
      const adjMedian = adjustValue(
        metrics.medianWealthUSD,
        selectedYear,
        currencyPerspective
      );
      const adjTotal = adjustValue(
        metrics.totalWealthTrillion,
        selectedYear,
        currencyPerspective
      );
      const adjGdpPerCap = adjustValue(
        metrics.gdpPerCapitaUSD,
        selectedYear,
        currencyPerspective
      );
      const skew = adjMedian > 0 ? adjMean / adjMedian : 0;
      const wealthDist = calculateCountryWealthDistribution(country, selectedYear);

      return {
        country,
        metrics,
        labor,
        adjMean,
        adjMedian,
        adjTotal,
        adjGdpPerCap,
        skew,
        top1Share: wealthDist.shares.top1Percent,
        bottom50Share: wealthDist.shares.bottom50Percent,
        millionaireDensity: wealthDist.millionaireDensityPercent,
        realGdpGrowth: metrics.realGdpGrowth,
        inflationRate: metrics.inflationRate,
        policyRate: metrics.policyRate,
        bondYield10Y: metrics.bondYield10Y,
        debtToGdp: metrics.debtToGdp,
        fiscalBalance: metrics.fiscalBalancePercentGdp,
        currentAccount: metrics.currentAccountPercentGdp,
        fxReserves: metrics.fxReservesBillionUSD,
        unemploymentRate: labor?.unemploymentRate ?? 0,
        oldAgeDependency: metrics.oldAgeDependencyRatio,
        population: metrics.populationMillion,
        gini: metrics.gini,
      };
    });
  }, [selectedYear, currencyPerspective]);

  const filteredAndSortedData = useMemo(() => {
    return processedData
      .filter((row) => {
        const matchesQuery =
          row.country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.country.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion =
          selectedRegion === 'all' || row.country.region === selectedRegion;
        return matchesQuery && matchesRegion;
      })
      .sort((a, b) => {
        let diff = 0;
        switch (sortField) {
          case 'name':
            diff = a.country.name.localeCompare(b.country.name);
            break;
          case 'meanWealth':
            diff = a.adjMean - b.adjMean;
            break;
          case 'medianWealth':
            diff = a.adjMedian - b.adjMedian;
            break;
          case 'skew':
            diff = a.skew - b.skew;
            break;
          case 'totalWealth':
            diff = a.adjTotal - b.adjTotal;
            break;
          case 'top1Share':
            diff = a.top1Share - b.top1Share;
            break;
          case 'bottom50Share':
            diff = a.bottom50Share - b.bottom50Share;
            break;
          case 'millionaireDensity':
            diff = a.millionaireDensity - b.millionaireDensity;
            break;
          case 'gdpPerCapita':
            diff = a.adjGdpPerCap - b.adjGdpPerCap;
            break;
          case 'realGdpGrowth':
            diff = a.realGdpGrowth - b.realGdpGrowth;
            break;
          case 'inflationRate':
            diff = a.inflationRate - b.inflationRate;
            break;
          case 'policyRate':
            diff = a.policyRate - b.policyRate;
            break;
          case 'bondYield10Y':
            diff = a.bondYield10Y - b.bondYield10Y;
            break;
          case 'debtToGdp':
            diff = a.debtToGdp - b.debtToGdp;
            break;
          case 'fiscalBalance':
            diff = a.fiscalBalance - b.fiscalBalance;
            break;
          case 'currentAccount':
            diff = a.currentAccount - b.currentAccount;
            break;
          case 'fxReserves':
            diff = a.fxReserves - b.fxReserves;
            break;
          case 'unemploymentRate':
            diff = a.unemploymentRate - b.unemploymentRate;
            break;
          case 'oldAgeDependency':
            diff = a.oldAgeDependency - b.oldAgeDependency;
            break;
          case 'population':
            diff = a.population - b.population;
            break;
          case 'gini':
            diff = a.gini - b.gini;
            break;
        }
        return sortDirection === 'desc' ? -diff : diff;
      });
  }, [processedData, searchQuery, selectedRegion, sortField, sortDirection]);

  const showWealthCols = activeTableLens === 'overview' || activeTableLens === 'wealth';
  const showMacroCols = activeTableLens === 'overview' || activeTableLens === 'macro-rates';
  const showFiscalExternalCols = activeTableLens === 'overview' || activeTableLens === 'fiscal-external';
  const showLaborDemoCols = activeTableLens === 'overview' || activeTableLens === 'labor-demographics';

  return (
    <div className="apple-card p-5 sm:p-6 space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Scale className="h-5 w-5 text-sky-500 dark:text-sky-400" />
            Global Sovereign League Table ({selectedYear})
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-normal">
            Ranked macro comparison of {COUNTRIES_DATA.length} sovereign economies across wealth, real GDP growth, policy rates, fiscal/external balances, labor, and demographics.
          </p>
        </div>

        {/* Search, Region Filters & Share/Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 text-base sm:text-xs rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors w-40 sm:w-48"
            />
          </div>

          <select
            aria-label="Filter by region"
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="py-1.5 px-3 text-base sm:text-xs rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-[#121622] text-slate-900 dark:text-white">All Regions</option>
            {regions.filter((r) => r !== 'all').map((r) => (
              <option key={r} value={r} className="bg-white dark:bg-[#121622] text-slate-900 dark:text-white">
                {r}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCopyTableLink}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm cursor-pointer active:scale-95 ${
              hasCopiedLink
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/[0.12]'
            }`}
            title="Copy shareable link to this sorted & filtered league table"
          >
            {hasCopiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                <span>Share Ranking</span>
              </>
            )}
          </button>

          {/* One-click Data Export for Researchers & Journalists */}
          <DataExportMenu
            title={`Global Sovereign Wealth & Macro League Table (${selectedYear})`}
            filename={`sovereign-league-table-${selectedYear}`}
            data={() =>
              filteredAndSortedData.map((row, index) => ({
                rank: index + 1,
                code: row.country.code,
                name: row.country.name,
                region: row.country.region,
                populationMillion: row.population,
                meanWealthPerAdultUsd: Math.round(row.adjMean),
                medianWealthPerAdultUsd: Math.round(row.adjMedian),
                totalWealthTrillionUsd: Number(row.adjTotal.toFixed(2)),
                gdpTrillionUsd: row.metrics.gdpTrillionUSD,
                gdpPerCapitaUsd: Math.round(row.adjGdpPerCap),
                realGdpGrowthPercent: row.realGdpGrowth,
                inflationRatePercent: row.inflationRate,
                policyRatePercent: row.policyRate,
                bondYield10YPercent: row.bondYield10Y,
                debtToGdpPercent: Number(row.debtToGdp.toFixed(1)),
                fiscalBalancePercentGdp: row.fiscalBalance,
                currentAccountPercentGdp: row.currentAccount,
                fxReservesBillionUsd: row.fxReserves,
                unemploymentRatePercent: row.unemploymentRate,
                oldAgeDependencyPercent: row.oldAgeDependency,
                giniCoefficient: Number(row.gini.toFixed(3)),
              }))
            }
            columns={[
              { key: 'rank', label: 'Rank #' },
              { key: 'code', label: 'Country Code' },
              { key: 'name', label: 'Country Name' },
              { key: 'region', label: 'Region' },
              { key: 'populationMillion', label: 'Population (M)' },
              { key: 'meanWealthPerAdultUsd', label: `Mean Wealth per Adult ($ ${currencyPerspective.toUpperCase()})` },
              { key: 'medianWealthPerAdultUsd', label: `Median Wealth per Adult ($ ${currencyPerspective.toUpperCase()})` },
              { key: 'totalWealthTrillionUsd', label: `Total Private Wealth ($T ${currencyPerspective.toUpperCase()})` },
              { key: 'gdpTrillionUsd', label: 'GDP ($ Trillion)' },
              { key: 'gdpPerCapitaUsd', label: `GDP per Capita ($ ${currencyPerspective.toUpperCase()})` },
              { key: 'realGdpGrowthPercent', label: 'Real GDP Growth (%)' },
              { key: 'inflationRatePercent', label: 'Inflation Rate (%)' },
              { key: 'policyRatePercent', label: 'Policy Rate (%)' },
              { key: 'bondYield10YPercent', label: '10Y Bond Yield (%)' },
              { key: 'debtToGdpPercent', label: 'Debt-to-GDP (%)' },
              { key: 'fiscalBalancePercentGdp', label: 'Fiscal Balance (% GDP)' },
              { key: 'currentAccountPercentGdp', label: 'Current Account (% GDP)' },
              { key: 'fxReservesBillionUsd', label: 'FX Reserves ($B)' },
              { key: 'unemploymentRatePercent', label: 'Unemployment Rate (%)' },
              { key: 'oldAgeDependencyPercent', label: 'Old-Age Dependency (%)' },
              { key: 'giniCoefficient', label: 'Gini Coefficient (0–1)' },
            ]}
            metadata={{
              description: `Cross-country macro rankings across ${filteredAndSortedData.length} sovereign economies.`,
              source: 'UBS Global Wealth Databook, IMF WEO, World Bank, Federal Reserve',
              year: selectedYear,
              perspective: `${currencyPerspective.toUpperCase()} USD`,
              totalCountries: filteredAndSortedData.length,
            }}
          />
        </div>
      </div>

      {/* Clickable Column Lens Switcher (URL-Synced) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Column View:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TABLE_LENS_OPTIONS.map((opt) => {
            const isSelected = activeTableLens === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleLensChange(opt.id)}
                className={`tactile-button rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                    : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/[0.08]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile horizontal scroll cue */}
      <div className="sm:hidden flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 -mb-2">
        <span>Showing {filteredAndSortedData.length} economies</span>
        <span>Swipe horizontally &rarr;</span>
      </div>

      {/* Responsive Sortable Table */}
      <div className="overflow-x-auto no-scrollbar scroll-mask-x sm:[mask-image:none] rounded-2xl border border-slate-200 dark:border-white/[0.08]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-white/[0.04] border-b border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3 px-3 text-center w-10 text-slate-500 dark:text-slate-400">#</th>
              <th
                scope="col"
                aria-sort={sortField === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                onClick={() => handleSort('name')}
                className="py-3 px-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Country</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>

              {showWealthCols && (
                <>
                  <th
                    scope="col"
                    aria-sort={sortField === 'medianWealth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('medianWealth')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Median Wealth</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    aria-sort={sortField === 'meanWealth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('meanWealth')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right hidden sm:table-cell"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Mean Wealth</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  {activeTableLens === 'wealth' && (
                    <>
                      <th
                        scope="col"
                        aria-sort={sortField === 'skew' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('skew')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Skew</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortField === 'top1Share' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('top1Share')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Top 1% Share</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortField === 'bottom50Share' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('bottom50Share')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right hidden md:table-cell"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Bottom 50%</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortField === 'millionaireDensity' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('millionaireDensity')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right hidden lg:table-cell"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>&gt;$1M Adults</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortField === 'totalWealth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('totalWealth')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Total ($T)</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortField === 'gini' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('gini')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Gini</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th scope="col" className="py-3 px-3 text-center">
                        Pyramid
                      </th>
                    </>
                  )}
                </>
              )}

              {showMacroCols && (
                <>
                  <th
                    scope="col"
                    aria-sort={sortField === 'gdpPerCapita' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('gdpPerCapita')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>GDP/Cap</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    aria-sort={sortField === 'realGdpGrowth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('realGdpGrowth')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Real GDP YoY</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    aria-sort={sortField === 'inflationRate' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('inflationRate')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right hidden md:table-cell"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>CPI</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    aria-sort={sortField === 'policyRate' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('policyRate')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right hidden lg:table-cell"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Policy Rate</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  {activeTableLens === 'macro-rates' && (
                    <th
                      scope="col"
                      aria-sort={sortField === 'bondYield10Y' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                      onClick={() => handleSort('bondYield10Y')}
                      className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>10Y Yield</span>
                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                      </div>
                    </th>
                  )}
                </>
              )}

              {showFiscalExternalCols && (
                <>
                  <th
                    scope="col"
                    aria-sort={sortField === 'debtToGdp' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('debtToGdp')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right hidden lg:table-cell"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Debt/GDP</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    aria-sort={sortField === 'currentAccount' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('currentAccount')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right hidden xl:table-cell"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Curr. Acct</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  {activeTableLens === 'fiscal-external' && (
                    <>
                      <th
                        scope="col"
                        aria-sort={sortField === 'fiscalBalance' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('fiscalBalance')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Fiscal Bal</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortField === 'fxReserves' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('fxReserves')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>FX Res ($B)</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                    </>
                  )}
                </>
              )}

              {showLaborDemoCols && (
                <>
                  <th
                    scope="col"
                    aria-sort={sortField === 'unemploymentRate' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => handleSort('unemploymentRate')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right hidden xl:table-cell"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Unemp.</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  {activeTableLens === 'labor-demographics' && (
                    <>
                      <th
                        scope="col"
                        aria-sort={sortField === 'oldAgeDependency' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('oldAgeDependency')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Old-Age Dep</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortField === 'population' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                        onClick={() => handleSort('population')}
                        className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Pop (M)</span>
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </th>
                    </>
                  )}
                </>
              )}

              {onSelectCountryForDuel && (
                <th scope="col" className="py-3 px-3.5 text-center">Duel</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/[0.05]">
            {filteredAndSortedData.map((row, index) => (
              <tr
                key={row.country.code}
                className="hover:bg-slate-50/80 dark:hover:bg-white/[0.04] transition-colors group"
              >
                <td className="py-3 px-3 text-center font-mono-tabular text-slate-500 dark:text-slate-400 text-[11px]">
                  {index + 1}
                </td>
                <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white">
                  {onSelectCountryForDuel ? (
                    <button
                      type="button"
                      onClick={() => onSelectCountryForDuel(row.country.code)}
                      className="flex items-center gap-2.5 text-left group/country cursor-pointer"
                      title={`Tap to compare ${row.country.name} in Sovereign Duel`}
                    >
                      <span className="text-xl shrink-0 group-hover/country:scale-110 transition-transform">{row.country.flag}</span>
                      <div>
                        <span className="font-semibold block tracking-tight group-hover/country:text-sky-600 dark:group-hover/country:text-sky-400 transition-colors">
                          {row.country.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-tabular block">
                          {row.country.region} • {row.population}M
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{row.country.flag}</span>
                      <div>
                        <span className="font-semibold block tracking-tight">
                          {row.country.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-tabular block">
                          {row.country.region} • {row.population}M
                        </span>
                      </div>
                    </div>
                  )}
                </td>

                {showWealthCols && (
                  <>
                    <td className="py-3 px-3 text-right font-mono-tabular font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(row.adjMedian, { compact: true })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular font-medium text-slate-700 dark:text-slate-200 hidden sm:table-cell">
                      {formatCurrency(row.adjMean, { compact: true })}
                    </td>
                    {activeTableLens === 'wealth' && (
                      <>
                        <td className="py-3 px-3 text-right font-mono-tabular text-slate-700 dark:text-slate-300">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              row.skew > 3.5
                                ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                                : row.skew > 2.0
                                ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                            }`}
                          >
                            {row.skew.toFixed(2)}x
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tabular text-rose-600 dark:text-rose-400 font-semibold">
                          {row.top1Share.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tabular text-emerald-600 dark:text-emerald-400 font-medium hidden md:table-cell">
                          {row.bottom50Share.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tabular text-sky-600 dark:text-sky-400 font-semibold hidden lg:table-cell">
                          {row.millionaireDensity.toFixed(2)}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tabular text-slate-900 dark:text-white font-semibold">
                          ${row.adjTotal.toFixed(1)}T
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tabular text-slate-700 dark:text-slate-300">
                          {row.gini.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Link
                            href={`/wealth?scope=${row.country.code}&year=${selectedYear}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                            title={`Inspect ${row.country.name}'s 6-Tier Wealth Pyramid`}
                          >
                            <Layers className="h-2.5 w-2.5" />
                            <span>View</span>
                          </Link>
                        </td>
                      </>
                    )}
                  </>
                )}

                {showMacroCols && (
                  <>
                    <td className="py-3 px-3 text-right font-mono-tabular font-medium text-slate-800 dark:text-slate-200">
                      {formatCurrency(row.adjGdpPerCap, { compact: true })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.realGdpGrowth >= 3.0
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : row.realGdpGrowth < 0
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                            : 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300'
                        }`}
                      >
                        {row.realGdpGrowth > 0 ? '+' : ''}{row.realGdpGrowth.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-700 dark:text-slate-300 hidden md:table-cell">
                      {formatPercent(row.inflationRate)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-700 dark:text-slate-300 hidden lg:table-cell">
                      {formatPercent(row.policyRate)}
                    </td>
                    {activeTableLens === 'macro-rates' && (
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-700 dark:text-slate-300">
                        {formatPercent(row.bondYield10Y)}
                      </td>
                    )}
                  </>
                )}

                {showFiscalExternalCols && (
                  <>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-700 dark:text-slate-300 hidden lg:table-cell">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.debtToGdp > 120
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                            : row.debtToGdp > 75
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                        }`}
                      >
                        {row.debtToGdp}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular hidden xl:table-cell">
                      <span className={row.currentAccount >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                        {row.currentAccount > 0 ? '+' : ''}{row.currentAccount.toFixed(1)}%
                      </span>
                    </td>
                    {activeTableLens === 'fiscal-external' && (
                      <>
                        <td className="py-3 px-3 text-right font-mono-tabular">
                          <span className={row.fiscalBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                            {row.fiscalBalance > 0 ? '+' : ''}{row.fiscalBalance.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tabular text-slate-800 dark:text-slate-200 font-semibold">
                          ${row.fxReserves.toFixed(0)}B
                        </td>
                      </>
                    )}
                  </>
                )}

                {showLaborDemoCols && (
                  <>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-700 dark:text-slate-300 hidden xl:table-cell">
                      {formatPercent(row.unemploymentRate)}
                    </td>
                    {activeTableLens === 'labor-demographics' && (
                      <>
                        <td className="py-3 px-3 text-right font-mono-tabular text-slate-700 dark:text-slate-300">
                          {formatPercent(row.oldAgeDependency)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tabular text-slate-800 dark:text-slate-200 font-semibold">
                          {row.population.toFixed(1)}M
                        </td>
                      </>
                    )}
                  </>
                )}

                {onSelectCountryForDuel && (
                  <td className="py-3 px-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectCountryForDuel(row.country.code)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 dark:bg-white/[0.06] dark:hover:bg-sky-500/20 dark:text-slate-200 dark:hover:text-sky-300 border border-slate-200 dark:border-white/[0.10] hover:border-sky-300 dark:hover:border-sky-400/40 transition-all cursor-pointer inline-flex items-center gap-1 active:scale-95"
                      title={`Launch Head-to-Head Duel for ${row.country.name}`}
                    >
                      <span>Duel</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
