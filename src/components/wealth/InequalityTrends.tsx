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
  LineChart,
  Line,
} from 'recharts';
import { GLOBAL_WEALTH_HISTORY } from '../../data/global-wealth';
import { formatPercent } from '../../lib/formatters';
import { TrendingUp, ShieldAlert } from 'lucide-react';

export function InequalityTrends() {
  const [viewMode, setViewMode] = useState<'shares' | 'gini'>('shares');

  const chartData = GLOBAL_WEALTH_HISTORY.map((item) => ({
    year: item.year,
    top1: item.shares.top1Percent,
    top10: item.shares.top10Percent,
    middle40: item.shares.middle40Percent,
    bottom50: item.shares.bottom50Percent,
    gini: item.giniCoefficient,
  }));

  return (
    <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Wealth Inequality Trajectory (1980–2026)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracking how wealth concentration shifted between the Top 1%, Middle 40%, and Bottom 50%.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-[#242b3d] bg-[#181c27] p-0.5 text-xs">
          <button
            onClick={() => setViewMode('shares')}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              viewMode === 'shares'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tier Shares (%)
          </button>
          <button
            onClick={() => setViewMode('gini')}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              viewMode === 'gini'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gini Coefficient
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'shares' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTop1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTop10" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMiddle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={[0, 90]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f131c',
                  borderColor: '#242b3d',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                formatter={(value: any, name: any) => {
                  const labels: Record<string, string> = {
                    top1: 'Top 1% Share',
                    top10: 'Top 10% Share',
                    middle40: 'Middle 40% Share',
                    bottom50: 'Bottom 50% Share',
                  };
                  return [`${Number(value).toFixed(1)}%`, labels[name] || name];
                }}
              />
              <Area
                type="monotone"
                dataKey="top10"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTop10)"
              />
              <Area
                type="monotone"
                dataKey="top1"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTop1)"
              />
              <Area
                type="monotone"
                dataKey="middle40"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMiddle)"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={[0.85, 0.92]}
                tickFormatter={(v) => v.toFixed(3)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f131c',
                  borderColor: '#242b3d',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [Number(val).toFixed(3), 'Global Wealth Gini']}
              />
              <Line
                type="monotone"
                dataKey="gini"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800/80 pt-3">
        {viewMode === 'shares' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">Top 10% Share (~83.7%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span className="text-slate-300">Top 1% Share (~45.4%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
              <span className="text-slate-300">Middle 40% Share (~14.8%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-500"></span>
              <span className="text-slate-300">Bottom 50% Share (~1.5%)</span>
            </div>
          </>
        ) : (
          <div className="text-slate-400">
            A Gini coefficient of 1.0 represents total inequality (one person holding all wealth).
            Global wealth Gini softened from 0.912 in 1980 to 0.877 in 2026 as emerging markets expanded their asset base.
          </div>
        )}
      </div>
    </div>
  );
}
