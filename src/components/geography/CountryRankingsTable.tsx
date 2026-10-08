'use client';

import React, { useState, useMemo } from 'react';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import { CountryProfile, CurrencyPerspective } from '../../lib/types';
import { adjustValue, formatCurrency, formatPercent } from '../../lib/formatters';
import { DataExportMenu } from '../common/DataExportMenu';
import {
  ArrowUpDown,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Scale,
  Building2,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface CountryRankingsTableProps {
  selectedYear: number;
  currencyPerspective: CurrencyPerspective;
  onSelectCountryForDuel?: (code: string) => void;
}

type SortField =
  | 'name'
  | 'meanWealth'
  | 'medianWealth'
  | 'skew'
  | 'totalWealth'
  | 'debtToGdp'
  | 'gini';

type SortDirection = 'asc' | 'desc';

export function CountryRankingsTable({
  selectedYear,
  currencyPerspective,
  onSelectCountryForDuel,
}: CountryRankingsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('medianWealth');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const regions = useMemo(() => {
    const set = new Set<string>();
    COUNTRIES_DATA.forEach((c) => set.add(c.region));
    return ['all', ...Array.from(set).sort()];
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Default to descending for numeric metrics, ascending for name
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  const processedData = useMemo(() => {
    return COUNTRIES_DATA.map((country) => {
      const metrics =
        country.history[selectedYear] ||
        country.history[2026] ||
        country.history[2025];

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
      const skew = adjMedian > 0 ? adjMean / adjMedian : 0;

      return {
        country,
        metrics,
        adjMean,
        adjMedian,
        adjTotal,
        skew,
        debtToGdp: metrics.debtToGdp,
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
          case 'debtToGdp':
            diff = a.debtToGdp - b.debtToGdp;
            break;
          case 'gini':
            diff = a.gini - b.gini;
            break;
        }
        return sortDirection === 'desc' ? -diff : diff;
      });
  }, [processedData, searchQuery, selectedRegion, sortField, sortDirection]);

  return (
    <div className="apple-card p-5 sm:p-6 space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Scale className="h-5 w-5 text-sky-400" />
            Global Sovereign League Table ({selectedYear})
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-normal">
            Ranked macro comparison of {COUNTRIES_DATA.length} major economies across average, median, debt, and inequality metrics.
          </p>
        </div>

        {/* Search & Region Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 text-xs rounded-full bg-white/[0.06] border border-white/[0.10] text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors w-36 sm:w-48"
            />
          </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-full bg-white/[0.06] border border-white/[0.10] text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="all" className="bg-[#121622] text-white">All Regions</option>
              {regions.filter((r) => r !== 'all').map((r) => (
                <option key={r} value={r} className="bg-[#121622] text-white">
                  {r}
                </option>
              ))}
            </select>

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
                  meanWealthPerAdultUsd: Math.round(row.adjMean),
                  medianWealthPerAdultUsd: Math.round(row.adjMedian),
                  totalWealthTrillionUsd: Number(row.adjTotal.toFixed(2)),
                  debtToGdpPercent: Number(row.debtToGdp.toFixed(1)),
                  giniCoefficient: Number(row.gini.toFixed(3)),
                  gdpTrillionUsd: row.metrics?.gdpTrillionUSD || 0,
                  inflationRatePercent: row.metrics?.inflationRate || 0,
                }))
              }
              columns={[
                { key: 'rank', label: 'Rank #' },
                { key: 'code', label: 'Country Code' },
                { key: 'name', label: 'Country Name' },
                { key: 'region', label: 'Region' },
                { key: 'meanWealthPerAdultUsd', label: `Mean Wealth per Adult ($ ${currencyPerspective.toUpperCase()})` },
                { key: 'medianWealthPerAdultUsd', label: `Median Wealth per Adult ($ ${currencyPerspective.toUpperCase()})` },
                { key: 'totalWealthTrillionUsd', label: `Total Private Wealth ($T ${currencyPerspective.toUpperCase()})` },
                { key: 'debtToGdpPercent', label: 'Debt-to-GDP (%)' },
                { key: 'giniCoefficient', label: 'Gini Coefficient (0–1)' },
                { key: 'gdpTrillionUsd', label: 'GDP ($ Trillion)' },
                { key: 'inflationRatePercent', label: 'Inflation Rate (%)' },
              ]}
              metadata={{
                description: `Cross-country macro rankings across ${filteredAndSortedData.length} sovereign economies.`,
                source: 'UBS Global Wealth Databook, IMF, World Bank, Federal Reserve',
                year: selectedYear,
                perspective: `${currencyPerspective.toUpperCase()} USD`,
                totalCountries: filteredAndSortedData.length,
              }}
            />
          </div>
        </div>

      {/* Responsive Sortable Table */}
      <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/[0.08]">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.04] border-b border-white/[0.08] text-slate-300 font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3 px-3.5 text-center w-12">#</th>
              <th
                scope="col"
                aria-sort={sortField === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                onClick={() => handleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Country</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th
                scope="col"
                aria-sort={sortField === 'medianWealth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                onClick={() => handleSort('medianWealth')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Median Wealth</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th
                scope="col"
                aria-sort={sortField === 'meanWealth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                onClick={() => handleSort('meanWealth')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Mean Wealth</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th
                scope="col"
                aria-sort={sortField === 'skew' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                onClick={() => handleSort('skew')}
                className="py-3 px-3 cursor-pointer hover:text-white transition-colors text-right hidden md:table-cell"
                title="Inequality Skew = Mean Wealth / Median Wealth"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Skew</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th
                scope="col"
                aria-sort={sortField === 'totalWealth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                onClick={() => handleSort('totalWealth')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Total ($T)</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th
                scope="col"
                aria-sort={sortField === 'debtToGdp' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                onClick={() => handleSort('debtToGdp')}
                className="py-3 px-3.5 cursor-pointer hover:text-white transition-colors text-right hidden lg:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Debt/GDP</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              <th
                scope="col"
                aria-sort={sortField === 'gini' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                onClick={() => handleSort('gini')}
                className="py-3 px-3.5 cursor-pointer hover:text-white transition-colors text-right hidden lg:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Gini</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              {onSelectCountryForDuel && (
                <th scope="col" className="py-3 px-4 text-center">Duel</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filteredAndSortedData.map((row, index) => (
              <tr
                key={row.country.code}
                className="hover:bg-white/[0.04] transition-colors group"
              >
                <td className="py-3 px-3.5 text-center font-mono text-slate-400 text-[11px]">
                  {index + 1}
                </td>
                <td className="py-3 px-4 font-medium text-white">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0">{row.country.flag}</span>
                    <div>
                      <span className="font-semibold block tracking-tight">
                        {row.country.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {row.country.region}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-bold text-emerald-400">
                  {formatCurrency(row.adjMedian, { compact: true })}
                </td>
                <td className="py-3 px-4 text-right font-medium text-slate-200 hidden sm:table-cell">
                  {formatCurrency(row.adjMean, { compact: true })}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-300 hidden md:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.skew > 3.5
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : row.skew > 2.0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {row.skew.toFixed(2)}x
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono text-white font-semibold">
                  ${row.adjTotal.toFixed(1)}T
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-slate-300 hidden lg:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.debtToGdp > 150
                        ? 'bg-rose-500/20 text-rose-300'
                        : row.debtToGdp > 80
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {row.debtToGdp}%
                  </span>
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-slate-300 hidden lg:table-cell">
                  {row.gini.toFixed(2)}
                </td>
                {onSelectCountryForDuel && (
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectCountryForDuel(row.country.code)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white/[0.06] hover:bg-sky-500/20 hover:text-sky-300 border border-white/[0.10] hover:border-sky-400/40 transition-all cursor-pointer inline-flex items-center gap-1 active:scale-95"
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
