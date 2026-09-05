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
import { CurrencyPerspective } from '../../lib/types';
import { adjustValue, formatCurrency, formatPercent } from '../../lib/formatters';
import { Layers, PieChart, ShieldAlert } from 'lucide-react';

interface AssetEvolutionChartProps {
  currencyPerspective: CurrencyPerspective;
  selectedYear: number;
}

export function AssetEvolutionChart({
  currencyPerspective,
  selectedYear,
}: AssetEvolutionChartProps) {
  const [viewType, setViewType] = useState<'trillion' | 'share'>('trillion');

  const activeYearData =
    GLOBAL_ASSET_HISTORY.find((y) => y.year === selectedYear) ||
    GLOBAL_ASSET_HISTORY[GLOBAL_ASSET_HISTORY.length - 1];

  const chartData = GLOBAL_ASSET_HISTORY.map((item) => {
    const realEstate = item.categories.find((c) => c.id === 'real-estate')?.valueTrillion || 0;
    const equities = item.categories.find((c) => c.id === 'equities')?.valueTrillion || 0;
    const bonds = item.categories.find((c) => c.id === 'bonds-pensions')?.valueTrillion || 0;
    const cash = item.categories.find((c) => c.id === 'cash-deposits')?.valueTrillion || 0;
    const gold = item.categories.find((c) => c.id === 'gold-commodities')?.valueTrillion || 0;
    const crypto = item.categories.find((c) => c.id === 'crypto-digital')?.valueTrillion || 0;

    if (viewType === 'share') {
      const gross = item.totalGrossAssetsTrillion;
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              Global Asset Class Stack (1980–2026)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizing how the world stores its wealth across tangible property and financial capital.
            </p>
          </div>

          <div className="flex items-center rounded-lg border border-[#242b3d] bg-[#181c27] p-0.5 text-xs">
            <button
              onClick={() => setViewType('trillion')}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                viewType === 'trillion'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Absolute Value ($T)
            </button>
            <button
              onClick={() => setViewType('share')}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                viewType === 'share'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Percentage Share (%)
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
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
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => (viewType === 'share' ? `${v}%` : `$${v}T`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f131c',
                  borderColor: '#242b3d',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                formatter={(val: any, name: any) => {
                  const labels: Record<string, string> = {
                    realEstate: 'Real Estate & Land',
                    equities: 'Public Equities',
                    bonds: 'Bonds & Pensions',
                    cash: 'Cash & Deposits',
                    gold: 'Gold & Metals',
                    crypto: 'Crypto & Digital',
                  };
                  return [
                    viewType === 'share' ? `${Number(val).toFixed(1)}%` : `$${Number(val).toFixed(1)}T`,
                    labels[name] || name,
                  ];
                }}
              />
              <Area
                type="monotone"
                dataKey="realEstate"
                stackId="1"
                stroke="#10b981"
                fill="url(#colorRealEstate)"
              />
              <Area
                type="monotone"
                dataKey="equities"
                stackId="1"
                stroke="#06b6d4"
                fill="url(#colorEquities)"
              />
              <Area
                type="monotone"
                dataKey="bonds"
                stackId="1"
                stroke="#6366f1"
                fill="url(#colorBonds)"
              />
              <Area
                type="monotone"
                dataKey="cash"
                stackId="1"
                stroke="#f59e0b"
                fill="url(#colorCash)"
              />
              <Area
                type="monotone"
                dataKey="gold"
                stackId="1"
                stroke="#eab308"
                fill="url(#colorGold)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown cards for the selected year */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeYearData.categories.map((cat) => {
          const adjustedVal = adjustValue(cat.valueTrillion, activeYearData.year, currencyPerspective);
          return (
            <div
              key={cat.id}
              className="rounded-xl border border-[#242b3d] bg-[#12151e] p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-bold text-sm text-white">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  {cat.name}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {formatPercent(cat.sharePercent)}
                </span>
              </div>

              <div className="text-xl font-extrabold text-white mt-2">
                {formatCurrency(adjustedVal * 1_000_000_000_000, { compact: true })}
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
