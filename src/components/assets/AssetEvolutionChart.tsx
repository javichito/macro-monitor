'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { GLOBAL_ASSET_HISTORY } from '../../data/asset-breakdown';
import { AssetCategory, CurrencyPerspective } from '../../lib/types';
import { adjustValue, formatCurrency, formatPercent } from '../../lib/formatters';
import { SubAssetDetailModal } from './SubAssetDetailModal';
import { Layers, PieChart, ChevronRight, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface AssetEvolutionChartProps {
  currencyPerspective: CurrencyPerspective;
  selectedYear: number;
}

interface AreaConfig {
  key: string;
  name: string;
  stroke: string;
  fill: string;
  fillOpacity?: number;
}

const MACRO_AREAS: AreaConfig[] = [
  { key: 'realEstate', name: 'Real Estate & Land', stroke: '#10b981', fill: 'url(#colorRealEstate)' },
  { key: 'equities', name: 'Public & Private Equities', stroke: '#06b6d4', fill: 'url(#colorEquities)' },
  { key: 'bonds', name: 'Bonds & Pension Reserves', stroke: '#6366f1', fill: 'url(#colorBonds)' },
  { key: 'cash', name: 'Cash & Bank Deposits', stroke: '#f59e0b', fill: 'url(#colorCash)' },
  { key: 'gold', name: 'Gold & Precious Metals', stroke: '#eab308', fill: 'url(#colorGold)' },
  { key: 'crypto', name: 'Digital Assets & Crypto', stroke: '#a855f7', fill: 'url(#colorCrypto)' },
];

const SUB_AREAS: AreaConfig[] = [
  // Real estate sub-sectors
  { key: 'reResidential', name: 'Residential Real Estate', stroke: '#10b981', fill: '#10b981', fillOpacity: 0.85 },
  { key: 'reCommercial', name: 'Commercial Real Estate', stroke: '#34d399', fill: '#34d399', fillOpacity: 0.8 },
  { key: 'reAgricultural', name: 'Agricultural Farmland', stroke: '#6ee7b7', fill: '#6ee7b7', fillOpacity: 0.75 },
  // Equities sub-sectors
  { key: 'eqDeveloped', name: 'Developed Large-Cap Tech', stroke: '#06b6d4', fill: '#06b6d4', fillOpacity: 0.85 },
  { key: 'eqEmerging', name: 'Emerging & Small-Cap', stroke: '#38bdf8', fill: '#38bdf8', fillOpacity: 0.8 },
  { key: 'eqPrivate', name: 'Private Equity & Unlisted', stroke: '#7dd3fc', fill: '#7dd3fc', fillOpacity: 0.75 },
  // Fixed income sub-sectors
  { key: 'bondSovereign', name: 'Sovereign Treasuries', stroke: '#6366f1', fill: '#6366f1', fillOpacity: 0.85 },
  { key: 'bondCorporate', name: 'Corporate Debt', stroke: '#818cf8', fill: '#818cf8', fillOpacity: 0.8 },
  { key: 'bondPension', name: 'Pension Reserves', stroke: '#a5b4fc', fill: '#a5b4fc', fillOpacity: 0.75 },
  // Liquidity sub-sectors
  { key: 'cashBank', name: 'Commercial Bank Deposits', stroke: '#f59e0b', fill: '#f59e0b', fillOpacity: 0.85 },
  { key: 'cashMmf', name: 'Money Market Funds / T-Bills', stroke: '#fbbf24', fill: '#fbbf24', fillOpacity: 0.8 },
  { key: 'cashPhysical', name: 'Physical Banknotes', stroke: '#fde68a', fill: '#fde68a', fillOpacity: 0.75 },
  // Gold sub-sectors
  { key: 'goldJewelry', name: 'Jewelry & Private Gold', stroke: '#eab308', fill: '#eab308', fillOpacity: 0.85 },
  { key: 'goldInvestment', name: 'Bullion Bars & ETFs', stroke: '#facc15', fill: '#facc15', fillOpacity: 0.8 },
  { key: 'goldReserves', name: 'Central Bank Vault Gold', stroke: '#fef08a', fill: '#fef08a', fillOpacity: 0.75 },
  // Crypto sub-sectors
  { key: 'cryptoBtc', name: 'Bitcoin (Digital Gold)', stroke: '#a855f7', fill: '#a855f7', fillOpacity: 0.85 },
  { key: 'cryptoSmart', name: 'Smart Contract Networks', stroke: '#c084fc', fill: '#c084fc', fillOpacity: 0.8 },
  { key: 'cryptoStable', name: 'Stablecoins & Tokenized RWAs', stroke: '#e9d5ff', fill: '#e9d5ff', fillOpacity: 0.75 },
];

export function AssetEvolutionChart({
  currencyPerspective,
  selectedYear,
}: AssetEvolutionChartProps) {
  const [viewType, setViewType] = useState<'trillion' | 'share'>('trillion');
  const [granularity, setGranularity] = useState<'macro' | 'sub'>('macro');
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<AssetCategory | null>(null);

  const activeYearData =
    GLOBAL_ASSET_HISTORY.find((y) => y.year === selectedYear) ||
    GLOBAL_ASSET_HISTORY[GLOBAL_ASSET_HISTORY.length - 1];

  const activeAreas = granularity === 'macro' ? MACRO_AREAS : SUB_AREAS;

  /*
   * Normalizes longitudinal asset data across either 6 high-level classes
   * or 18 institutional sub-sectors, adjusting for inflation & currency perspective.
   */
  const chartData = GLOBAL_ASSET_HISTORY.map((item) => {
    const gross = item.totalGrossAssetsTrillion;

    if (granularity === 'sub') {
      const getSubVal = (catId: string, subId: string) => {
        const cat = item.categories.find((c) => c.id === catId);
        const sub = cat?.subCategories?.find((s) => s.id === subId);
        return sub?.valueTrillion || 0;
      };

      const subs = {
        reResidential: getSubVal('real-estate', 're-residential'),
        reCommercial: getSubVal('real-estate', 're-commercial'),
        reAgricultural: getSubVal('real-estate', 're-agricultural'),
        eqDeveloped: getSubVal('equities', 'eq-developed'),
        eqEmerging: getSubVal('equities', 'eq-emerging'),
        eqPrivate: getSubVal('equities', 'eq-private'),
        bondSovereign: getSubVal('bonds-pensions', 'bond-sovereign'),
        bondCorporate: getSubVal('bonds-pensions', 'bond-corporate'),
        bondPension: getSubVal('bonds-pensions', 'bond-pension'),
        cashBank: getSubVal('cash-deposits', 'cash-bank'),
        cashMmf: getSubVal('cash-deposits', 'cash-mmf'),
        cashPhysical: getSubVal('cash-deposits', 'cash-physical'),
        goldJewelry: getSubVal('gold-commodities', 'gold-jewelry'),
        goldInvestment: getSubVal('gold-commodities', 'gold-investment'),
        goldReserves: getSubVal('gold-commodities', 'gold-reserves'),
        cryptoBtc: getSubVal('crypto-digital', 'crypto-btc'),
        cryptoSmart: getSubVal('crypto-digital', 'crypto-smart'),
        cryptoStable: getSubVal('crypto-digital', 'crypto-stable'),
      };

      if (viewType === 'share') {
        const out: Record<string, number> = { year: item.year };
        for (const [k, v] of Object.entries(subs)) {
          out[k] = Number(((v / gross) * 100).toFixed(1));
        }
        return out;
      }

      const out: Record<string, number> = { year: item.year };
      for (const [k, v] of Object.entries(subs)) {
        out[k] = adjustValue(v, item.year, currencyPerspective);
      }
      return out;
    }

    const realEstate = item.categories.find((c) => c.id === 'real-estate')?.valueTrillion || 0;
    const equities = item.categories.find((c) => c.id === 'equities')?.valueTrillion || 0;
    const bonds = item.categories.find((c) => c.id === 'bonds-pensions')?.valueTrillion || 0;
    const cash = item.categories.find((c) => c.id === 'cash-deposits')?.valueTrillion || 0;
    const gold = item.categories.find((c) => c.id === 'gold-commodities')?.valueTrillion || 0;
    const crypto = item.categories.find((c) => c.id === 'crypto-digital')?.valueTrillion || 0;

    if (viewType === 'share') {
      return {
        year: item.year,
        realEstate: Number(((realEstate / gross) * 100).toFixed(1)),
        equities: Number(((equities / gross) * 100).toFixed(1)),
        bonds: Number(((bonds / gross) * 100).toFixed(1)),
        cash: Number(((cash / gross) * 100).toFixed(1)),
        gold: Number(((gold / gross) * 100).toFixed(1)),
        crypto: Number(((crypto / gross) * 100).toFixed(1)),
      };
    }

    return {
      year: item.year,
      realEstate: adjustValue(realEstate, item.year, currencyPerspective),
      equities: adjustValue(equities, item.year, currencyPerspective),
      bonds: adjustValue(bonds, item.year, currencyPerspective),
      cash: adjustValue(cash, item.year, currencyPerspective),
      gold: adjustValue(gold, item.year, currencyPerspective),
      crypto: adjustValue(crypto, item.year, currencyPerspective),
    };
  });

  return (
    <div className="space-y-6">
      {/* Chart wrapper */}
      <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              Global Asset Allocation Stack (1980–2026)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizing how human wealth is distributed across tangible property and contractual financial claims.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Granularity switch */}
            <div className="flex rounded-lg border border-[#242b3d] bg-[#181c27] p-0.5 text-xs">
              <button
                onClick={() => setGranularity('macro')}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  granularity === 'macro'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Macro Classes (6)
              </button>
              <button
                onClick={() => setGranularity('sub')}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  granularity === 'sub'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sub-Sectors (18)
              </button>
            </div>

            {/* Value vs Share Switch */}
            <div className="flex rounded-lg border border-[#242b3d] bg-[#181c27] p-0.5 text-xs">
              <button
                onClick={() => setViewType('trillion')}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  viewType === 'trillion'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Valuation ($T)
              </button>
              <button
                onClick={() => setViewType('share')}
                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                  viewType === 'share'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Share (%)
              </button>
            </div>
          </div>
        </div>

        <div className="h-80 w-full min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={320}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                {/* Macro Gradients */}
                <linearGradient id="colorRealEstate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorEquities" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorBonds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={viewType === 'share' ? [0, 100] : ['auto', 'auto']}
                tickFormatter={(v) => (viewType === 'share' ? `${v}%` : `$${v}T`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f131c',
                  borderColor: '#242b3d',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(val: any, name: any) => [
                  viewType === 'share' ? `${val}%` : `$${Number(val).toFixed(1)}T`,
                  name,
                ]}
              />

              {/*
               * Recharts uses React.Children.forEach to inspect graphical items. In React 19,
               * react-is cannot recognize React.Fragment, so wrapped elements are omitted.
               * Mapping activeAreas directly provides first-order children that Recharts detects.
               */}
              {activeAreas.map((area) => (
                <Area
                  key={area.key}
                  type="monotone"
                  dataKey={area.key}
                  name={area.name}
                  stackId="1"
                  stroke={area.stroke}
                  fill={area.fill}
                  fillOpacity={area.fillOpacity}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Primary Asset Classes Grid with Sub-Sector Drilldowns */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="h-4 w-4 text-cyan-400" />
            Asset Class Breakdown ({activeYearData.year})
          </h4>
          <span className="text-xs text-slate-400">
            Click any card to inspect its sub-sector composition
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeYearData.categories.map((cat) => {
            const adjustedVal = adjustValue(cat.valueTrillion, activeYearData.year, currencyPerspective);
            const subCategories = cat.subCategories || [];

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategoryForModal(cat)}
                className="group rounded-xl border border-[#242b3d] bg-[#12151e] p-4.5 hover:border-slate-500 hover:bg-[#161a26] transition-all cursor-pointer shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {formatPercent(cat.sharePercent)}
                    </span>
                  </div>

                  <div className="text-xl font-extrabold text-white mt-1">
                    {formatCurrency(adjustedVal * 1_000_000_000_000, { compact: true })}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Sub-sector preview segmented bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Sub-Sectors:</span>
                    <span className="text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Inspect {subCategories.length} sectors <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                    {subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        style={{
                          width: `${sub.shareOfParentPercent}%`,
                          backgroundColor: sub.color,
                        }}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                      />
                    ))}
                  </div>

                  <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
                    {subCategories.slice(0, 3).map((sub) => (
                      <span key={sub.id} className="truncate max-w-[90px]">
                        {sub.name.split(' ')[0]} ({sub.shareOfParentPercent}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Household Liabilities & Net Global Wealth Balance Sheet */}
      <div className="rounded-xl border border-rose-950/40 bg-gradient-to-br from-[#171018] to-[#12151e] p-5 border-l-4 border-l-rose-500">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <h4 className="text-sm font-bold text-white">
                Global Liabilities & Encumbrances ({activeYearData.year})
              </h4>
              <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/30">
                Total: -{formatCurrency(adjustValue(activeYearData.totalLiabilitiesTrillion, activeYearData.year, currencyPerspective) * 1_000_000_000_000, { compact: true })}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Household debt claims offsetting gross assets. Subtracting these contractual liabilities from total gross assets yields Net World Wealth ({formatCurrency(adjustValue(activeYearData.netWealthTrillion, activeYearData.year, currencyPerspective) * 1_000_000_000_000, { compact: true })}).
            </p>
          </div>

          <button
            onClick={() => {
              if (activeYearData.liabilityBreakdown) {
                setSelectedCategoryForModal({
                  id: 'liabilities',
                  name: 'Household Liabilities & Debt',
                  sharePercent: Number(((activeYearData.totalLiabilitiesTrillion / activeYearData.totalGrossAssetsTrillion) * 100).toFixed(1)),
                  valueTrillion: activeYearData.totalLiabilitiesTrillion,
                  description: 'Mortgages, consumer credit, and student debts encumbering household balance sheets.',
                  color: '#f43f5e',
                  isTangible: false,
                  subCategories: activeYearData.liabilityBreakdown,
                });
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors shrink-0"
          >
            Inspect Debt Sub-Sectors <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Liabilities Sub-Sector Preview */}
        {activeYearData.liabilityBreakdown && (
          <div className="mt-4 pt-3 border-t border-rose-900/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {activeYearData.liabilityBreakdown.map((liab) => (
              <div key={liab.id} className="rounded-lg bg-[#14121a] p-2.5 border border-rose-900/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-300">{liab.name}</span>
                  <span className="font-bold text-rose-400">
                    {formatPercent(liab.shareOfParentPercent)}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  -{formatCurrency(adjustValue(liab.valueTrillion, activeYearData.year, currencyPerspective) * 1_000_000_000_000, { compact: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sub-Asset Detail Modal */}
      <SubAssetDetailModal
        category={selectedCategoryForModal}
        selectedYear={activeYearData.year}
        currencyPerspective={currencyPerspective}
        onClose={() => setSelectedCategoryForModal(null)}
      />
    </div>
  );
}
