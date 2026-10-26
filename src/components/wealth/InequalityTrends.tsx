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
  LineChart,
  Line,
} from 'recharts';
import { GLOBAL_WEALTH_HISTORY } from '../../data/global-wealth';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import { calculateCountryWealthShares } from '../../lib/calculations';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';

interface InequalityTrendsProps {
  scopeCode?: string; // 'GLOBAL' or ISO 3-letter country code
}

export function InequalityTrends({ scopeCode = 'GLOBAL' }: InequalityTrendsProps) {
  const theme = useThemeMode();
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'shares' | 'gini'>('shares');

  const tooltipStyle = {
    backgroundColor: isDark ? '#0f131c' : '#ffffff',
    borderColor: isDark ? '#242b3d' : '#e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '12px',
    color: isDark ? '#f8fafc' : '#0f172a',
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
  };

  const gridStroke = isDark ? '#1e2433' : 'rgba(0, 0, 0, 0.08)';
  const axisStroke = isDark ? '#64748b' : '#94a3b8';

  const selectedCountry = useMemo(() => {
    if (scopeCode === 'GLOBAL') return null;
    return COUNTRIES_DATA.find((c) => c.code === scopeCode) || null;
  }, [scopeCode]);

  const chartData = useMemo(() => {
    if (!selectedCountry) {
      return GLOBAL_WEALTH_HISTORY.map((item) => {
        const next9 = Number((item.shares.top10Percent - item.shares.top1Percent).toFixed(1));
        return {
          year: item.year,
          top1: item.shares.top1Percent,
          next9,
          top10: item.shares.top10Percent,
          middle40: item.shares.middle40Percent,
          bottom50: item.shares.bottom50Percent,
          gini: item.giniCoefficient,
          globalGini: item.giniCoefficient,
        };
      });
    }

    const years = Object.keys(selectedCountry.history)
      .map(Number)
      .sort((a, b) => a - b);

    return years.map((yr) => {
      const metric = selectedCountry.history[yr];
      const shares = calculateCountryWealthShares(metric);
      const next9 = Number((shares.top10Percent - shares.top1Percent).toFixed(1));
      const globalMatch =
        GLOBAL_WEALTH_HISTORY.find((g) => g.year === yr) ||
        GLOBAL_WEALTH_HISTORY[GLOBAL_WEALTH_HISTORY.length - 1];

      return {
        year: yr,
        top1: shares.top1Percent,
        next9,
        top10: shares.top10Percent,
        middle40: shares.middle40Percent,
        bottom50: shares.bottom50Percent,
        gini: metric.gini,
        globalGini: globalMatch.giniCoefficient,
      };
    });
  }, [selectedCountry]);

  const latestPoint = chartData[chartData.length - 1] || {
    year: 2026,
    top1: 45.3,
    next9: 38.2,
    top10: 83.5,
    middle40: 15.0,
    bottom50: 1.5,
    gini: 0.877,
    globalGini: 0.877,
  };

  const firstPoint = chartData[0] || latestPoint;
  const scopeLabel = selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : '🌍 Global World';

  return (
    <div className="apple-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1.5">
            <span>02 / HISTORICAL CONCENTRATION TRAJECTORY (1980–2026)</span>
            <span>•</span>
            <span>{scopeLabel.toUpperCase()}</span>
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {selectedCountry
              ? `Has Wealth In ${selectedCountry.name} Grown More Concentrated Since 1980?`
              : `How Has Global Wealth Concentration Shifted Since 1980?`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Tracking how private net worth shifted between the Top 1%, Top 10%, Middle 40%, and Bottom 50% in{' '}
            {selectedCountry ? selectedCountry.name : 'the global economy'}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('shares')}
              className={`tactile-button rounded-lg px-3 py-1 font-bold transition-all cursor-pointer ${
                viewMode === 'shares'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-700 shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              Tier Shares (%)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('gini')}
              className={`tactile-button rounded-lg px-3 py-1 font-bold transition-all cursor-pointer ${
                viewMode === 'gini'
                  ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              Gini Coefficient
            </button>
          </div>

          {/* One-click Data Export for Researchers & Journalists */}
          <DataExportMenu
            title={`${selectedCountry ? selectedCountry.name : 'Global'} Wealth Inequality Trajectory (1980–2026)`}
            filename={`wealth-inequality-trajectory-${(selectedCountry?.code || 'global').toLowerCase()}-1980-2026`}
            data={chartData}
            columns={[
              { key: 'year', label: 'Year' },
              { key: 'top1', label: 'Top 1% Wealth Share (%)' },
              { key: 'top10', label: 'Top 10% Wealth Share (%)' },
              { key: 'middle40', label: 'Middle 40% Wealth Share (%)' },
              { key: 'bottom50', label: 'Bottom 50% Wealth Share (%)' },
              { key: 'gini', label: 'Gini Coefficient (0–1)' },
            ]}
            metadata={{
              description: `Historical wealth concentration across population tiers and Gini coefficient for ${selectedCountry ? selectedCountry.name : 'Global World'}.`,
              source: 'Credit Suisse / UBS Global Wealth Databook, World Inequality Database (WID)',
              unit: 'Percentage of total wealth (%) and Gini coefficient (0-1)',
            }}
          />
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'shares' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTop1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.35} />
                </linearGradient>
                <linearGradient id="colorNext9" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.35} />
                </linearGradient>
                <linearGradient id="colorMiddle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.35} />
                </linearGradient>
                <linearGradient id="colorBottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
              <YAxis
                stroke={axisStroke}
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: any, name: any, item: any) => {
                  const payload = item?.payload;
                  if (name === 'next9' && payload) {
                    return [
                      `${Number(value).toFixed(1)}% (Top 10% Combined: ${Number(payload.top10).toFixed(1)}%)`,
                      'Next 9% (P90–P99) Share',
                    ];
                  }
                  const labels: Record<string, string> = {
                    top1: 'Top 1% Share',
                    next9: 'Next 9% (P90–P99) Share',
                    middle40: 'Middle 40% Share',
                    bottom50: 'Bottom 50% Share',
                  };
                  return [`${Number(value).toFixed(1)}%`, labels[name] || name];
                }}
              />
              <Area
                type="monotone"
                dataKey="top1"
                stackId="wealth"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTop1)"
              />
              <Area
                type="monotone"
                dataKey="next9"
                stackId="wealth"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNext9)"
              />
              <Area
                type="monotone"
                dataKey="middle40"
                stackId="wealth"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMiddle)"
              />
              <Area
                type="monotone"
                dataKey="bottom50"
                stackId="wealth"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBottom)"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
              <YAxis
                stroke={axisStroke}
                tick={{ fontSize: 11 }}
                domain={[0.5, 1.0]}
                ticks={[0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: any, name: any) => [
                  Number(val).toFixed(3),
                  name === 'globalGini' ? 'Global Benchmark Gini' : `${selectedCountry ? selectedCountry.name : 'Global'} Wealth Gini`,
                ]}
              />
              <Line
                type="monotone"
                dataKey="gini"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
              {selectedCountry && (
                <Line
                  type="monotone"
                  dataKey="globalGini"
                  stroke="#f59e0b"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200 dark:border-white/[0.08] pt-4 font-mono-tabular">
        {viewMode === 'shares' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f43f5e]"></span>
              <span className="text-slate-600 dark:text-white/70">
                Top 1% Share ({latestPoint.top1.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]"></span>
              <span className="text-slate-600 dark:text-white/70">
                Next 9% Share ({latestPoint.next9.toFixed(1)}% • Top 10%: {latestPoint.top10.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#06b6d4]"></span>
              <span className="text-slate-600 dark:text-white/70">
                Middle 40% Share ({latestPoint.middle40.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]"></span>
              <span className="text-slate-600 dark:text-white/70">
                Bottom 50% Share ({latestPoint.bottom50.toFixed(1)}%)
              </span>
            </div>
          </>
        ) : (
          <div className="text-slate-600 dark:text-white/60 font-sans">
            {selectedCountry ? (
              <span>
                <strong>{selectedCountry.name}</strong> shifted from a wealth Gini of{' '}
                <span className="font-mono-tabular font-semibold">{firstPoint.gini.toFixed(2)}</span> in {firstPoint.year} to{' '}
                <span className="font-mono-tabular font-semibold">{latestPoint.gini.toFixed(2)}</span> in {latestPoint.year} (dashed amber line shows the Global World Gini at{' '}
                <span className="font-mono-tabular font-semibold">{latestPoint.globalGini.toFixed(3)}</span>).
              </span>
            ) : (
              <span>
                A Gini coefficient of 1.0 represents total inequality (one person holding all wealth). Global wealth Gini softened from 0.912 in 1980 to 0.877 in 2026 as emerging markets expanded their middle-class asset base.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
