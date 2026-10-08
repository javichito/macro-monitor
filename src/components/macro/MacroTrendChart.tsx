'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MACRO_TRENDS_HISTORY, ECONOMIC_MILESTONES } from '../../data/macro-trends';
import { BarChart3, Landmark, Percent, DollarSign, Award } from 'lucide-react';
import { formatPercent } from '../../lib/formatters';
import { useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';

type TabType = 'debt-gdp' | 'rates' | 'reserves' | 'inflation';

export function MacroTrendChart() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('debt-gdp');

  const tooltipStyle = {
    backgroundColor: isDark ? '#0f131c' : '#ffffff',
    borderColor: isDark ? '#242b3d' : '#e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '12px',
    color: isDark ? '#f8fafc' : '#0f172a',
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
  };

  const gridStroke = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const axisStroke = isDark ? '#64748b' : '#94a3b8';

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#30d158]" />
              Global Macroeconomic Engine (1980–2026)
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
              Long-run historical trends of global debt, interest rates, inflation, and sovereign reserves.
            </p>
          </div>

          {/* Metric tabs & Data Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex flex-wrap gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
              <button
                onClick={() => setActiveTab('debt-gdp')}
                className={`rounded-full px-3 py-1 font-medium transition-all cursor-pointer ${
                  activeTab === 'debt-gdp'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                Debt vs GDP
              </button>
              <button
                onClick={() => setActiveTab('rates')}
                className={`rounded-full px-3 py-1 font-medium transition-all cursor-pointer ${
                  activeTab === 'rates'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                Central Bank Rates
              </button>
              <button
                onClick={() => setActiveTab('reserves')}
                className={`rounded-full px-3 py-1 font-medium transition-all cursor-pointer ${
                  activeTab === 'reserves'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                FX & Gold Reserves
              </button>
              <button
                onClick={() => setActiveTab('inflation')}
                className={`rounded-full px-3 py-1 font-medium transition-all cursor-pointer ${
                  activeTab === 'inflation'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white/20 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                Global Inflation
              </button>
            </div>

            {/* One-click Data Export for Researchers & Journalists */}
            <DataExportMenu
              title={`Global Macro Engine (1980–2026) [${
                activeTab === 'debt-gdp'
                  ? 'Debt vs GDP'
                  : activeTab === 'rates'
                  ? 'Central Bank Rates'
                  : activeTab === 'reserves'
                  ? 'FX & Gold Reserves'
                  : 'Global Inflation'
              }]`}
              filename={`macro-trends-${activeTab}`}
              data={() =>
                MACRO_TRENDS_HISTORY.map((m) => ({
                  year: m.year,
                  globalDebtTrillionUsd: m.globalDebtTrillion,
                  globalGdpTrillionUsd: m.globalGdpTrillion,
                  globalDebtToGdpPercent: m.globalDebtToGdp,
                  fedRatePercent: m.centralBankRates.fed,
                  ecbRatePercent: m.centralBankRates.ecb,
                  bojRatePercent: m.centralBankRates.boj,
                  pbocRatePercent: m.centralBankRates.pboc,
                  boeRatePercent: m.centralBankRates.boe,
                  usdReserveSharePercent: m.currencyReserves.usd,
                  eurReserveSharePercent: m.currencyReserves.eur,
                  cnyReserveSharePercent: m.currencyReserves.cny,
                  jpyReserveSharePercent: m.currencyReserves.jpy,
                  goldAndOtherReserveSharePercent: m.currencyReserves.goldAndOther,
                  globalInflationRatePercent: m.globalInflationRate,
                  usCpiIndexBase100: m.usCpiIndex,
                }))
              }
              columns={
                activeTab === 'debt-gdp'
                  ? [
                      { key: 'year', label: 'Year' },
                      { key: 'globalDebtTrillionUsd', label: 'Total Global Debt ($T)' },
                      { key: 'globalGdpTrillionUsd', label: 'World Annual GDP ($T)' },
                      { key: 'globalDebtToGdpPercent', label: 'Debt-to-GDP Ratio (%)' },
                    ]
                  : activeTab === 'rates'
                  ? [
                      { key: 'year', label: 'Year' },
                      { key: 'fedRatePercent', label: 'Federal Reserve Policy Rate (%)' },
                      { key: 'ecbRatePercent', label: 'ECB Policy Rate (%)' },
                      { key: 'bojRatePercent', label: 'Bank of Japan Policy Rate (%)' },
                      { key: 'pbocRatePercent', label: 'People’s Bank of China Rate (%)' },
                      { key: 'boeRatePercent', label: 'Bank of England Rate (%)' },
                    ]
                  : activeTab === 'reserves'
                  ? [
                      { key: 'year', label: 'Year' },
                      { key: 'usdReserveSharePercent', label: 'USD Reserve Share (%)' },
                      { key: 'eurReserveSharePercent', label: 'EUR Reserve Share (%)' },
                      { key: 'goldAndOtherReserveSharePercent', label: 'Gold & Others Share (%)' },
                      { key: 'jpyReserveSharePercent', label: 'JPY Reserve Share (%)' },
                      { key: 'cnyReserveSharePercent', label: 'CNY Reserve Share (%)' },
                    ]
                  : [
                      { key: 'year', label: 'Year' },
                      { key: 'globalInflationRatePercent', label: 'Global Inflation Rate (%)' },
                      { key: 'usCpiIndexBase100', label: 'US CPI Index (Base 100 in 2000)' },
                    ]
              }
              metadata={{
                description: 'Historical macroeconomic time series tracking debt, monetary policy, reserves, and inflation cycles.',
                source: 'IMF World Economic Outlook, BIS, Federal Reserve, World Gold Council',
                activeTab,
              }}
            />
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'debt-gdp' ? (
              <AreaChart
                data={MACRO_TRENDS_HISTORY}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: any, name: any) => [
                    `$${Number(val).toFixed(1)} Trillion`,
                    name === 'globalDebtTrillion' ? 'Total Global Debt' : 'World GDP',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="globalDebtTrillion"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDebt)"
                />
                <Area
                  type="monotone"
                  dataKey="globalGdpTrillion"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGdp)"
                />
              </AreaChart>
            ) : activeTab === 'rates' ? (
              <LineChart
                data={MACRO_TRENDS_HISTORY.map((m) => ({
                  year: m.year,
                  fed: m.centralBankRates.fed,
                  ecb: m.centralBankRates.ecb,
                  boj: m.centralBankRates.boj,
                  pboc: m.centralBankRates.pboc,
                  boe: m.centralBankRates.boe,
                }))}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: any, name: any) => [`${Number(v).toFixed(2)}%`, name.toUpperCase()]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: isDark ? '#cbd5e1' : '#475569' }} />
                <Line type="monotone" dataKey="fed" name="US Fed" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ecb" name="ECB" stroke="#818cf8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pboc" name="PBOC" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="boe" name="Bank of England" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="boj" name="Bank of Japan" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2 }} />
              </LineChart>
            ) : activeTab === 'reserves' ? (
              <AreaChart
                data={MACRO_TRENDS_HISTORY.map((m) => ({
                  year: m.year,
                  usd: m.currencyReserves.usd,
                  eur: m.currencyReserves.eur,
                  cny: m.currencyReserves.cny,
                  jpy: m.currencyReserves.jpy,
                  gold: m.currencyReserves.goldAndOther,
                }))}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: any, name: any) => [`${Number(v).toFixed(1)}%`, name.toUpperCase()]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: isDark ? '#cbd5e1' : '#475569' }} />
                <Area type="monotone" dataKey="usd" name="USD Share" stackId="1" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.8} />
                <Area type="monotone" dataKey="eur" name="EUR Share" stackId="1" stroke="#818cf8" fill="#818cf8" fillOpacity={0.8} />
                <Area type="monotone" dataKey="gold" name="Gold & Others" stackId="1" stroke="#eab308" fill="#eab308" fillOpacity={0.8} />
                <Area type="monotone" dataKey="jpy" name="JPY Share" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                <Area type="monotone" dataKey="cny" name="CNY Share" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.8} />
              </AreaChart>
            ) : (
              <BarChart
                data={MACRO_TRENDS_HISTORY}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="year" stroke={axisStroke} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisStroke} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Global Inflation (CPI)']}
                />
                <Bar dataKey="globalInflationRate" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Dynamic footer contextual note */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.08] text-xs text-slate-600 dark:text-white/60 leading-relaxed">
          {activeTab === 'debt-gdp' && (
            <p>
              Total global debt (government, corporate, and household) reached <strong className="text-slate-900 dark:text-white">\$334 Trillion</strong> in 2026,
              standing at <strong className="text-slate-900 dark:text-white">273%</strong> of world GDP. Debt expansion outpacing economic production remains the primary structural macro trend of the modern era.
            </p>
          )}
          {activeTab === 'rates' && (
            <p>
              From the 16%+ Volcker shock in 1980 through 15 years of zero rates post-2008 and the rapid 2022-2023 tightening, global central banks now operate in a calibrated easing cycle through 2026.
            </p>
          )}
          {activeTab === 'reserves' && (
            <p>
              The US Dollar remains the leading global reserve currency (56.4% in 2026), but central bank allocations into physical gold and diversified sovereign holdings have reached a multi-decade high of 11.5%.
            </p>
          )}
          {activeTab === 'inflation' && (
            <p>
              Global inflation spiked above 13% in 1980 and 8.7% in 2022, before moderating to 3.1% in 2026 amid normalized supply chains.
            </p>
          )}
        </div>
      </div>

      {/* Historical Milestones Timeline */}
      <div className="apple-card p-6">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-[#ff9f0a]" />
          Critical Macroeconomic Turning Points
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ECONOMIC_MILESTONES.map((m) => (
            <div
              key={m.year}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-4 hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-[#ff9f0a]">{m.year}</span>
                <span className="rounded-full bg-slate-200/80 dark:bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-white/70 uppercase">
                  {m.impactCategory}
                </span>
              </div>
              <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{m.title}</h5>
              <p className="text-[11px] text-slate-500 dark:text-white/60 mt-1.5 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
