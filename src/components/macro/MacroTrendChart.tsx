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

type TabType = 'debt-gdp' | 'rates' | 'reserves' | 'inflation';

export function MacroTrendChart() {
  const [activeTab, setActiveTab] = useState<TabType>('debt-gdp');

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              Global Macroeconomic Engine (1980–2026)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Long-run historical trends of global debt, interest rates, inflation, and sovereign reserves.
            </p>
          </div>

          {/* Metric tabs */}
          <div className="flex flex-wrap gap-1 rounded-lg border border-[#242b3d] bg-[#181c27] p-0.5 text-xs">
            <button
              onClick={() => setActiveTab('debt-gdp')}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                activeTab === 'debt-gdp' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Debt vs GDP
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                activeTab === 'rates' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Central Bank Rates
            </button>
            <button
              onClick={() => setActiveTab('reserves')}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                activeTab === 'reserves' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              FX & Gold Reserves
            </button>
            <button
              onClick={() => setActiveTab('inflation')}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                activeTab === 'inflation' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Global Inflation
            </button>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f131c',
                    borderColor: '#242b3d',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f131c',
                    borderColor: '#242b3d',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(v: any, name: any) => [`${Number(v).toFixed(2)}%`, name.toUpperCase()]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f131c',
                    borderColor: '#242b3d',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(v: any, name: any) => [`${Number(v).toFixed(1)}%`, name.toUpperCase()]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f131c',
                    borderColor: '#242b3d',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Global Inflation (CPI)']}
                />
                <Bar dataKey="globalInflationRate" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Dynamic footer contextual note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          {activeTab === 'debt-gdp' && (
            <p>
              Total global debt (government, corporate, and household) reached <strong>$334 Trillion</strong> in 2026,
              standing at <strong>273%</strong> of world GDP. Debt expansion outpacing economic production remains the primary structural macro trend of the modern era.
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
      <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-amber-400" />
          Critical Macroeconomic Turning Points
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ECONOMIC_MILESTONES.map((m) => (
            <div
              key={m.year}
              className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-3.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-amber-400">{m.year}</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 uppercase">
                  {m.impactCategory}
                </span>
              </div>
              <h5 className="text-xs font-semibold text-white">{m.title}</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
