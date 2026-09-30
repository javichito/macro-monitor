'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  REGIONAL_ASSET_HISTORY,
  REGIONAL_METADATA,
  ASSET_CLASS_META,
  getRegionalDataForYear,
  getHistoricalAssetClassByRegion,
} from '../../data/regional-asset-breakdown';
import {
  MacroRegionId,
  RegionalAssetMix,
  CurrencyPerspective,
} from '../../lib/types';
import {
  adjustValue,
  formatPercent,
  formatTrillionUSD,
} from '../../lib/formatters';
import {
  Globe2,
  PieChart,
  TrendingUp,
  Landmark,
  Building,
  Coins,
  ShieldCheck,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';

interface RegionalAssetBreakdownProps {
  currencyPerspective: CurrencyPerspective;
  selectedYear: number;
}

type ViewMode = 'by-region' | 'by-asset-class';
type UnitType = 'trillion' | 'share';

const REGION_IDS: MacroRegionId[] = [
  'north-america',
  'asia-pacific',
  'europe',
  'latin-america',
  'middle-east-africa',
];

const ASSET_CLASS_KEYS: (keyof RegionalAssetMix)[] = [
  'realEstate',
  'equities',
  'bonds',
  'cash',
  'alternatives',
];

export function RegionalAssetBreakdown({
  currencyPerspective,
  selectedYear,
}: RegionalAssetBreakdownProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('by-region');
  const [selectedRegion, setSelectedRegion] = useState<MacroRegionId | 'all'>('all');
  const [selectedAssetClass, setSelectedAssetClass] = useState<keyof RegionalAssetMix>('equities');
  const [unitType, setUnitType] = useState<UnitType>('trillion');

  const activeYearData = useMemo(() => {
    return getRegionalDataForYear(selectedYear);
  }, [selectedYear]);

  /*
   * Construct longitudinal series dynamically based on viewMode and unitType.
   * If viewMode is 'by-region' and 'all' is selected:
   *   Stacked areas show the 5 regions' contribution to global gross assets.
   * If a specific region is selected:
   *   Stacked areas show that specific region's asset class portfolio over time.
   * If viewMode is 'by-asset-class':
   *   Stacked areas show the geographic distribution of that asset class across regions.
   */
  const chartData = useMemo(() => {
    if (viewMode === 'by-asset-class') {
      const series = getHistoricalAssetClassByRegion(selectedAssetClass);
      return series.map((row) => {
        if (unitType === 'share') {
          return {
            year: row.year,
            'north-america': row['north-america-pct'],
            'asia-pacific': row['asia-pacific-pct'],
            'europe': row['europe-pct'],
            'latin-america': row['latin-america-pct'],
            'middle-east-africa': row['middle-east-africa-pct'],
          };
        }

        // Apply inflation adjustment when viewing in real dollars
        return {
          year: row.year,
          'north-america': adjustValue(row['north-america'], row.year, currencyPerspective),
          'asia-pacific': adjustValue(row['asia-pacific'], row.year, currencyPerspective),
          'europe': adjustValue(row['europe'], row.year, currencyPerspective),
          'latin-america': adjustValue(row['latin-america'], row.year, currencyPerspective),
          'middle-east-africa': adjustValue(row['middle-east-africa'], row.year, currencyPerspective),
        };
      });
    }

    // View mode: 'by-region'
    return REGIONAL_ASSET_HISTORY.map((item) => {
      const year = item.year;

      if (selectedRegion === 'all') {
        const total = item.totalGlobalGrossTrillion;
        if (unitType === 'share') {
          return {
            year,
            'north-america': item.regions['north-america'].shareOfGlobalGrossPercent,
            'asia-pacific': item.regions['asia-pacific'].shareOfGlobalGrossPercent,
            'europe': item.regions['europe'].shareOfGlobalGrossPercent,
            'latin-america': item.regions['latin-america'].shareOfGlobalGrossPercent,
            'middle-east-africa': item.regions['middle-east-africa'].shareOfGlobalGrossPercent,
          };
        }

        return {
          year,
          'north-america': adjustValue(item.regions['north-america'].totalGrossAssetsTrillion, year, currencyPerspective),
          'asia-pacific': adjustValue(item.regions['asia-pacific'].totalGrossAssetsTrillion, year, currencyPerspective),
          'europe': adjustValue(item.regions['europe'].totalGrossAssetsTrillion, year, currencyPerspective),
          'latin-america': adjustValue(item.regions['latin-america'].totalGrossAssetsTrillion, year, currencyPerspective),
          'middle-east-africa': adjustValue(item.regions['middle-east-africa'].totalGrossAssetsTrillion, year, currencyPerspective),
        };
      }

      // Single selected region: show its internal asset class mix over time
      const regData = item.regions[selectedRegion];
      const regGross = regData.totalGrossAssetsTrillion;

      if (unitType === 'share') {
        return {
          year,
          realEstate: (regData.assets.realEstate / regGross) * 100,
          equities: (regData.assets.equities / regGross) * 100,
          bonds: (regData.assets.bonds / regGross) * 100,
          cash: (regData.assets.cash / regGross) * 100,
          alternatives: (regData.assets.alternatives / regGross) * 100,
        };
      }

      return {
        year,
        realEstate: adjustValue(regData.assets.realEstate, year, currencyPerspective),
        equities: adjustValue(regData.assets.equities, year, currencyPerspective),
        bonds: adjustValue(regData.assets.bonds, year, currencyPerspective),
        cash: adjustValue(regData.assets.cash, year, currencyPerspective),
        alternatives: adjustValue(regData.assets.alternatives, year, currencyPerspective),
      };
    });
  }, [viewMode, selectedRegion, selectedAssetClass, unitType, currencyPerspective]);

  /*
   * Custom Tooltip honoring Apple HIG design with dark/light background transparency,
   * subtle borders, and precise numerical readouts.
   */
  const renderTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const totalVal = payload.reduce(
      (acc: number, curr: any) => acc + (typeof curr.value === 'number' ? curr.value : 0),
      0
    );

    return (
      <div className="rounded-xl border border-white/15 bg-slate-950/90 p-3.5 shadow-2xl backdrop-blur-md text-xs text-white max-w-xs sm:max-w-sm">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 font-semibold">
          <span className="text-sky-300">Year {label}</span>
          <span className="text-slate-400">
            Total:{' '}
            {unitType === 'share'
              ? '100%'
              : formatTrillionUSD(totalVal)}
          </span>
        </div>
        <div className="space-y-1.5">
          {payload
            .slice()
            .reverse()
            .map((entry: any) => {
              const val = entry.value;
              const formatted =
                unitType === 'share'
                  ? formatPercent(val, 1)
                  : formatTrillionUSD(val, 1);

              return (
                <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-200 truncate">{entry.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-white shrink-0">
                    {formatted}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="apple-card p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-400 mb-2">
              <Globe2 className="h-3.5 w-3.5" />
              <span>Regional Wealth Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Asset Allocation &amp; Balance Sheets by Region ({selectedYear})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Explore how global assets are divided across continents. Compare internal portfolio allocations
              or trace the multi-decade geographic migration of corporate equities, residential property, and sovereign credit.
            </p>
          </div>

          {/* Quick Global Context Stat Pills */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
            <div className="bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] px-3 py-2 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                APAC Gross Assets
              </span>
              <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400 font-mono">
                $227.4T (36.4%)
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] px-3 py-2 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                N. America Equities
              </span>
              <span className="text-sm font-bold text-sky-500 dark:text-sky-400 font-mono">
                $93.5T (56.5%)
              </span>
            </div>
          </div>
        </div>

        {/* View Mode & Unit Controls Bar */}
        <div className="pt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-white/[0.05] p-1 border border-slate-200 dark:border-white/[0.08] text-xs font-medium">
              <button
                onClick={() => setViewMode('by-region')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'by-region'
                    ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                By Region Portfolio
              </button>
              <button
                onClick={() => setViewMode('by-asset-class')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'by-asset-class'
                    ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                By Asset Class Distribution
              </button>
            </div>

            {/* Units Toggle ($T vs %) */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-white/[0.05] p-1 border border-slate-200 dark:border-white/[0.08] text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setUnitType('trillion')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  unitType === 'trillion'
                    ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Total Value ($T)
              </button>
              <button
                onClick={() => setUnitType('share')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  unitType === 'share'
                    ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Share of Total (%)
              </button>
            </div>
          </div>

          {/* Sub-Filters: Regions or Asset Classes */}
          {viewMode === 'by-region' ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-3 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                  selectedRegion === 'all'
                    ? 'bg-sky-500 text-white border-sky-400 font-semibold shadow-sm'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:border-sky-400/40'
                }`}
              >
                🌐 All Regions (Global Gross Matrix)
              </button>
              {REGION_IDS.map((regId) => {
                const meta = REGIONAL_METADATA[regId];
                const isSelected = selectedRegion === regId;
                return (
                  <button
                    key={regId}
                    onClick={() => setSelectedRegion(regId)}
                    className={`px-3 py-1.5 rounded-full border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-400 font-semibold shadow-sm'
                        : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:border-sky-400/40'
                    }`}
                  >
                    <span>{meta.flag}</span>
                    <span>{meta.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {ASSET_CLASS_KEYS.map((key) => {
                const meta = ASSET_CLASS_META[key];
                const isSelected = selectedAssetClass === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAssetClass(key)}
                    className={`px-3 py-1.5 rounded-full border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-400 font-semibold shadow-sm'
                        : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:border-sky-400/40'
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span>{meta.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Chart */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {viewMode === 'by-asset-class'
                ? `Geographic Ownership Evolution of ${ASSET_CLASS_META[selectedAssetClass].name}`
                : selectedRegion === 'all'
                ? 'Global Gross Asset Distribution Across 5 Continents (1980–2026)'
                : `${REGIONAL_METADATA[selectedRegion].name}: Internal Asset Portfolio Evolution (1980–2026)`}
            </span>
            <span className="font-mono text-[11px] text-sky-500 dark:text-sky-400">
              {currencyPerspective === 'real' && unitType === 'trillion'
                ? 'Constant 2026 USD'
                : unitType === 'share'
                ? '% of Category'
                : 'Nominal USD'}
            </span>
          </div>

          <div className="h-[320px] sm:h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  {/* Region gradients */}
                  {REGION_IDS.map((rId) => {
                    const color = REGIONAL_METADATA[rId].color;
                    return (
                      <linearGradient key={rId} id={`grad-${rId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.7} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                      </linearGradient>
                    );
                  })}
                  {/* Asset class gradients */}
                  {ASSET_CLASS_KEYS.map((cKey) => {
                    const color = ASSET_CLASS_META[cKey].color;
                    return (
                      <linearGradient key={cKey} id={`grad-cat-${cKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.7} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) =>
                    unitType === 'share' ? `${val}%` : `$${val}T`
                  }
                  domain={unitType === 'share' ? [0, 100] : ['auto', 'auto']}
                />
                <Tooltip content={renderTooltip} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                />

                {/* Render Areas */}
                {viewMode === 'by-asset-class' || selectedRegion === 'all'
                  ? REGION_IDS.map((regId) => {
                      const meta = REGIONAL_METADATA[regId];
                      return (
                        <Area
                          key={regId}
                          type="monotone"
                          dataKey={regId}
                          name={meta.name}
                          stackId="1"
                          stroke={meta.color}
                          fill={`url(#grad-${regId})`}
                          fillOpacity={1}
                        />
                      );
                    })
                  : ASSET_CLASS_KEYS.map((catKey) => {
                      const meta = ASSET_CLASS_META[catKey];
                      return (
                        <Area
                          key={catKey}
                          type="monotone"
                          dataKey={catKey}
                          name={meta.name}
                          stackId="1"
                          stroke={meta.color}
                          fill={`url(#grad-cat-${catKey})`}
                          fillOpacity={1}
                        />
                      );
                    })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Year Regional Snapshots Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Regional Balance Sheet Snapshots ({selectedYear})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Click any region to inspect its asset class mix above
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REGION_IDS.map((regId) => {
            const meta = REGIONAL_METADATA[regId];
            const data = activeYearData.regions[regId];
            const grossAdjusted = adjustValue(
              data.totalGrossAssetsTrillion,
              selectedYear,
              currencyPerspective
            );
            const netAdjusted = adjustValue(
              data.netWealthTrillion,
              selectedYear,
              currencyPerspective
            );
            const liabAdjusted = adjustValue(
              data.totalLiabilitiesTrillion,
              selectedYear,
              currencyPerspective
            );

            // Asset class percentage mix
            const rePct = (data.assets.realEstate / data.totalGrossAssetsTrillion) * 100;
            const eqPct = (data.assets.equities / data.totalGrossAssetsTrillion) * 100;
            const boPct = (data.assets.bonds / data.totalGrossAssetsTrillion) * 100;
            const caPct = (data.assets.cash / data.totalGrossAssetsTrillion) * 100;
            const alPct = (data.assets.alternatives / data.totalGrossAssetsTrillion) * 100;

            const isSelected = selectedRegion === regId;

            return (
              <div
                key={regId}
                onClick={() => {
                  setSelectedRegion(regId);
                  setViewMode('by-region');
                }}
                className={`apple-card p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border ${
                  isSelected
                    ? 'border-sky-400/80 ring-2 ring-sky-400/20'
                    : 'border-slate-200 dark:border-white/[0.08] hover:border-sky-400/30'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{meta.flag}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {meta.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        {meta.keyEconomies}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-400/20">
                      {formatPercent(data.shareOfGlobalGrossPercent, 1)} global
                    </span>
                  </div>
                </div>

                {/* Key Balance Sheet Figures */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-white/[0.03] p-2.5 rounded-xl text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Gross Assets
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {formatTrillionUSD(grossAdjusted)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Net Wealth
                    </span>
                    <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400 text-sm">
                      {formatTrillionUSD(netAdjusted)}
                    </span>
                  </div>
                </div>

                {/* Stacked Mini Bar for Asset Mix */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Portfolio Asset Mix</span>
                    <span className="font-mono text-[10px]">
                      Liabilities: {formatTrillionUSD(liabAdjusted)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex">
                    <div
                      style={{ width: `${rePct}%`, backgroundColor: ASSET_CLASS_META.realEstate.color }}
                      title={`Real Estate: ${formatPercent(rePct, 1)}`}
                    />
                    <div
                      style={{ width: `${eqPct}%`, backgroundColor: ASSET_CLASS_META.equities.color }}
                      title={`Equities: ${formatPercent(eqPct, 1)}`}
                    />
                    <div
                      style={{ width: `${boPct}%`, backgroundColor: ASSET_CLASS_META.bonds.color }}
                      title={`Bonds: ${formatPercent(boPct, 1)}`}
                    />
                    <div
                      style={{ width: `${caPct}%`, backgroundColor: ASSET_CLASS_META.cash.color }}
                      title={`Cash: ${formatPercent(caPct, 1)}`}
                    />
                    <div
                      style={{ width: `${alPct}%`, backgroundColor: ASSET_CLASS_META.alternatives.color }}
                      title={`Alternatives: ${formatPercent(alPct, 1)}`}
                    />
                  </div>

                  {/* Micro Legend */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                      Real Estate ({formatPercent(rePct, 0)})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4]" />
                      Equities ({formatPercent(eqPct, 0)})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8]" />
                      Bonds ({formatPercent(boPct, 0)})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                      Cash ({formatPercent(caPct, 0)})
                    </span>
                  </div>
                </div>

                {/* Macro Context Note */}
                <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.02] p-2.5 rounded-lg leading-relaxed border border-slate-200/50 dark:border-white/[0.04]">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedYear} Era:{' '}
                  </span>
                  {data.macroHighlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structural Macro Narratives Card */}
      <div className="apple-card p-5 sm:p-6 bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-white/10">
        <div className="flex items-center gap-2 mb-3 text-sky-400 font-semibold text-xs">
          <Info className="h-4 w-4" />
          <span>Macroeconomic Structural Dynamics (1980–2026)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
            <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>The Transpacific Wealth Shift</span>
            </h5>
            <p className="leading-relaxed text-slate-300 font-normal">
              In 1980, North America and Western Europe controlled <strong>75.4%</strong> of global assets.
              By 2026, Asia-Pacific has grown from $6.5T to over <strong>$227.4T</strong> (a 35-fold expansion),
              becoming the single largest physical wealth repository on Earth.
            </p>
          </div>

          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
            <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>Wall Street's Equity Primacy</span>
            </h5>
            <p className="leading-relaxed text-slate-300 font-normal">
              Despite having only 4.8% of the world's population, North America commands <strong>56.5%</strong> ($93.5T)
              of all global public and private equity valuations. This stems from deep capital markets, tech clustering,
              and 401(k) retirement indexing.
            </p>
          </div>

          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
            <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>Tangible Real Asset Moats</span>
            </h5>
            <p className="leading-relaxed text-slate-300 font-normal">
              In emerging economies across Latin America and the Middle East &amp; Africa, real estate, arable farmland,
              and gold account for over <strong>65%</strong> of household assets, acting as a historical defensive hedge
              against domestic currency depreciation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
