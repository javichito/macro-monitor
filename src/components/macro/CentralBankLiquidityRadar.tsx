'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CENTRAL_BANK_PROFILES,
  GLOBAL_LIQUIDITY_HISTORY,
  CURRENT_US_NET_LIQUIDITY,
  ASSET_LIQUIDITY_CORRELATIONS,
  getCentralBankLiquiditySummary,
  CentralBankProfile,
} from '../../data/central-bank-liquidity-data';
import { useThemeMode } from '../../context/AppContext';
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  Layers,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Clock,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
} from 'lucide-react';

type RadarChartTab = 'stack' | 'lead-lag' | 'us-net';
type LeadLagAsset = 'btc' | 'sp500' | 'gold';

export function CentralBankLiquidityRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<RadarChartTab>('stack');
  const [selectedAsset, setSelectedAsset] = useState<LeadLagAsset>('btc');
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  const summary = useMemo(() => getCentralBankLiquiditySummary(), []);

  // Filter or highlight selected central bank
  const activeBankProfile = useMemo(() => {
    return CENTRAL_BANK_PROFILES.find((b) => b.id === selectedBankId) ?? null;
  }, [selectedBankId]);

  // Compute normalized series for Lead-Lag comparison (Base 100 at Jan 2020)
  const normalizedLeadLagData = useMemo(() => {
    const basePoint = GLOBAL_LIQUIDITY_HISTORY[0];
    return GLOBAL_LIQUIDITY_HISTORY.map((point) => {
      const normalizedLiquidity = (point.totalBig4Usd / basePoint.totalBig4Usd) * 100;
      const normalizedSp500 = (point.sp500Price / basePoint.sp500Price) * 100;
      const normalizedBtc = (point.bitcoinPrice / basePoint.bitcoinPrice) * 100;
      const normalizedGold = (point.goldPriceUsd / basePoint.goldPriceUsd) * 100;

      let selectedAssetValue = normalizedBtc;
      let rawAssetPrice = `$${point.bitcoinPrice.toLocaleString()}`;
      if (selectedAsset === 'sp500') {
        selectedAssetValue = normalizedSp500;
        rawAssetPrice = `${point.sp500Price.toLocaleString()} pts`;
      } else if (selectedAsset === 'gold') {
        selectedAssetValue = normalizedGold;
        rawAssetPrice = `$${point.goldPriceUsd.toLocaleString()}/oz`;
      }

      return {
        date: point.date,
        label: point.label,
        totalBig4Usd: point.totalBig4Usd,
        normalizedLiquidity: Math.round(normalizedLiquidity * 10) / 10,
        selectedAssetValue: Math.round(selectedAssetValue * 10) / 10,
        rawAssetPrice,
      };
    });
  }, [selectedAsset]);

  return (
    <div id="liquidity-radar" className="space-y-6">
      {/* Header Container */}
      <div className="apple-card p-6 border-l-4 border-l-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <Activity className="h-3.5 w-3.5" />
              <span>Global Monetary Base & Shadow Liquidity</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              The Global Central Bank Liquidity Radar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Track the aggregated balance sheet velocity across the Federal Reserve, ECB, PBOC, and Bank of Japan ($25T+). Discover the US Net Liquidity transmission formula and the 4–8 week empirical lead-lag correlation with global risk assets.
            </p>
          </div>

          {/* Regime Badge */}
          <div className="self-start sm:self-center px-4 py-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Global Liquidity Regime
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-end mt-0.5">
              <Zap className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>{summary.regimeLabel}</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
              Impulse: +{summary.impulseAnnualized}% (90-day annualized)
            </span>
          </div>
        </div>

        {/* Aggregate Vital Metrics Banner */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Big 4 Aggregate Assets:</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              ${summary.totalLiquidityUsd} Trillion
            </span>
            <span
              className={`text-[10px] font-medium block mt-0.5 ${
                summary.netLiquidityChangeUsd >= 0
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : 'text-rose-500 dark:text-rose-400'
              }`}
            >
              {summary.netLiquidityChangeUsd >= 0
                ? `+${summary.netLiquidityChangeUsd}`
                : `${summary.netLiquidityChangeUsd}`}T vs prior inflection
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">US Net Liquidity:</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              ${CURRENT_US_NET_LIQUIDITY.usNetLiquidityTrillion} Trillion
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-mono">
              Fed Assets − TGA − Reverse Repo
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Monetary Policy Divergence:</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              1 Easing / 3 Cautious
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              PBOC stimulus vs Fed/BOJ normalization
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Asset Lead Time:</span>
            <span className="text-base sm:text-lg font-bold text-emerald-500 dark:text-emerald-400">
              4 to 8 Weeks
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Liquidity leads equities & crypto
            </span>
          </div>
        </div>
      </div>

      {/* Central Bank Selector Cards */}
      <div className="apple-card p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
          <span>Global Central Bank Stance Matrix (Click to inspect transmission mechanism)</span>
          {selectedBankId && (
            <button
              onClick={() => setSelectedBankId(null)}
              className="text-[11px] text-sky-500 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Clear Selection
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CENTRAL_BANK_PROFILES.map((bank) => {
            const isSelected = selectedBankId === bank.id;
            return (
              <button
                key={bank.id}
                onClick={() => setSelectedBankId(isSelected ? null : bank.id)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-400 shadow-md ring-1 ring-sky-400/30'
                    : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{bank.flag}</span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {bank.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {bank.shortName} ({bank.currencyCode})
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      bank.policyStance === 'easing'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : bank.policyStance === 'tightening'
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {bank.policyStance}
                  </span>
                </div>

                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-200 dark:border-white/[0.08] text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Assets:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${bank.assetsUsdTrillion}T{' '}
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({bank.currencySymbol}{bank.assetsLocalTrillion}T)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Policy Benchmark:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {bank.policyRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Monthly Runoff:</span>
                    <span
                      className={`font-mono font-medium ${
                        bank.monthlyRunoffRateUsdBillions > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : bank.monthlyRunoffRateUsdBillions < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {bank.monthlyRunoffRateUsdBillions > 0 ? `+` : ''}
                      {bank.monthlyRunoffRateUsdBillions}B/mo
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {bank.headlineProgram}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Central Bank Transmission Spotlight */}
        {activeBankProfile && (
          <div className="mt-4 p-4 rounded-xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Info className="h-4 w-4 text-sky-500" />
              <span>
                {activeBankProfile.flag} {activeBankProfile.name} Transmission Spotlight
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Current Strategy: </span>
              {activeBankProfile.summary}
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Transmission Channel: </span>
              {activeBankProfile.transmissionMechanism}
            </p>
          </div>
        )}
      </div>

      {/* Main Interactive Radar Chart Container */}
      <div className="apple-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              {activeTab === 'stack'
                ? 'Aggregate Big 4 Balance Sheet Evolution ($25T+ Stack)'
                : activeTab === 'lead-lag'
                ? 'Liquidity Lead-Lag Visualizer (Global Net Liquidity vs Assets)'
                : 'US Net Liquidity Anatomy (Fed Assets − TGA − Reverse Repo)'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {activeTab === 'stack'
                ? 'Historical expansion and contraction cycles of the world’s four primary fiat monetary engines (2020–2026).'
                : activeTab === 'lead-lag'
                ? 'Normalized performance (Base 100) showing how central bank liquidity expansion reliably precedes asset rallies by 4–8 weeks.'
                : 'The critical plumbing metric driving Wall Street financial conditions: Fed balance sheet adjusted for Treasury cash and RRP sterilization.'}
            </p>
          </div>

          {/* Metric View Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
            <button
              onClick={() => setActiveTab('stack')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeTab === 'stack'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Big 4 Stack ($T)
            </button>
            <button
              onClick={() => setActiveTab('lead-lag')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeTab === 'lead-lag'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lead-Lag vs Assets
            </button>
            <button
              onClick={() => setActiveTab('us-net')}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                activeTab === 'us-net'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              US Net Liquidity
            </button>
          </div>
        </div>

        {/* Asset Sub-selector for Lead-Lag View */}
        {activeTab === 'lead-lag' && (
          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Compare Overlay:</span>
            <div className="inline-flex gap-1 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 p-0.5 rounded-lg">
              <button
                onClick={() => setSelectedAsset('btc')}
                className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                  selectedAsset === 'btc'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Bitcoin (BTC)
              </button>
              <button
                onClick={() => setSelectedAsset('sp500')}
                className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                  selectedAsset === 'sp500'
                    ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                S&P 500 Equities
              </button>
              <button
                onClick={() => setSelectedAsset('gold')}
                className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                  selectedAsset === 'gold'
                    ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/40'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Gold (XAU)
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Recharts Visualization */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'stack' ? (
              <AreaChart data={GLOBAL_LIQUIDITY_HISTORY} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorEcb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorPboc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorBoj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 text-xs shadow-xl space-y-1.5 min-w-[200px]">
                          <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-1 flex justify-between">
                            <span>{data.label}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">${data.totalBig4Usd}T Total</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sky-600 dark:text-sky-400">🇺🇸 Federal Reserve:</span>
                            <span className="font-medium text-slate-900 dark:text-white">${data.fedAssetsUsd}T</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-indigo-600 dark:text-indigo-400">🇪🇺 ECB:</span>
                            <span className="font-medium text-slate-900 dark:text-white">${data.ecbAssetsUsd}T</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-rose-600 dark:text-rose-400">🇨🇳 PBOC:</span>
                            <span className="font-medium text-slate-900 dark:text-white">${data.pbocAssetsUsd}T</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-600 dark:text-emerald-400">🇯🇵 Bank of Japan:</span>
                            <span className="font-medium text-slate-900 dark:text-white">${data.bojAssetsUsd}T</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="fedAssetsUsd"
                  name="Federal Reserve (Fed)"
                  stackId="1"
                  stroke="#0284c7"
                  fill="url(#colorFed)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="ecbAssetsUsd"
                  name="European Central Bank (ECB)"
                  stackId="1"
                  stroke="#818cf8"
                  fill="url(#colorEcb)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="pbocAssetsUsd"
                  name="People’s Bank of China (PBOC)"
                  stackId="1"
                  stroke="#f43f5e"
                  fill="url(#colorPboc)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="bojAssetsUsd"
                  name="Bank of Japan (BOJ)"
                  stackId="1"
                  stroke="#10b981"
                  fill="url(#colorBoj)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : activeTab === 'lead-lag' ? (
              <LineChart data={normalizedLeadLagData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 text-xs shadow-xl space-y-1.5 min-w-[210px]">
                          <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-1">
                            {data.label}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-600 dark:text-emerald-400">Big 4 Liquidity Index:</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {data.normalizedLiquidity} (${data.totalBig4Usd}T)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              {selectedAsset === 'btc' ? 'Bitcoin (BTC)' : selectedAsset === 'sp500' ? 'S&P 500' : 'Gold (XAU)'}:
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {data.selectedAssetValue} ({data.rawAssetPrice})
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="normalizedLiquidity"
                  name="Global Big 4 Liquidity (Base 100)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="selectedAssetValue"
                  name={
                    selectedAsset === 'btc'
                      ? 'Bitcoin Index (Base 100)'
                      : selectedAsset === 'sp500'
                      ? 'S&P 500 Index (Base 100)'
                      : 'Gold Index (Base 100)'
                  }
                  stroke={selectedAsset === 'btc' ? '#f59e0b' : selectedAsset === 'sp500' ? '#38bdf8' : '#eab308'}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : (
              <AreaChart data={GLOBAL_LIQUIDITY_HISTORY} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 text-xs space-y-1.5 min-w-[200px]">
                          <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-1">
                            {data.label}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Fed Total Assets:</span>
                            <span className="font-medium text-slate-900 dark:text-white">${data.fedAssetsUsd}T</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sky-600 dark:text-sky-400">US Net Liquidity:</span>
                            <span className="font-bold text-slate-900 dark:text-white">${data.usNetLiquidityUsd}T</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">30d Liquidity Impulse:</span>
                            <span className={data.impulse30dPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                              {data.impulse30dPercent >= 0 ? `+${data.impulse30dPercent}%` : `${data.impulse30dPercent}%`}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="usNetLiquidityUsd"
                  name="US Net Liquidity (Assets − TGA − RRP)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorUsNet)"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="fedAssetsUsd"
                  name="Fed Gross Balance Sheet"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Lead-Lag Empirical Correlation Matrix */}
      <div className="apple-card p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          Empirical Lead-Lag Correlation Matrix (Liquidity vs Risk Assets)
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Central bank balance sheet expansion and contraction does not hit asset prices simultaneously. The capital rotates through banking reserves, prime brokerage repo, and global risk markets over a measurable 4 to 8-week transmission window.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ASSET_LIQUIDITY_CORRELATIONS.map((asset) => (
            <div
              key={asset.assetName}
              className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {asset.assetName}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  r = {asset.correlationCoeff}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Average Lead Time:</span>
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    <Clock className="h-3 w-3 text-sky-500" />
                    {asset.averageLagWeeks} Weeks Lag
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Liquidity Beta:</span>
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    {asset.sensitivityBeta}x Multiplier
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                {asset.commentary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Autonomous Macro Playbook Brief */}
      <div className="apple-card p-6 border-l-4 border-l-sky-500">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-sky-500 dark:text-sky-400" />
          The Institutional Liquidity Playbook: Why Plumbing Trumps Headlines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-900 dark:text-white block">1. The TGA Drain Mechanic:</span>
            <p>
              When the US Treasury issues debt and refills its checking account (Treasury General Account), it withdraws commercial bank reserves from the private financial system. Even if the Fed holds rates constant, a surging TGA drains private collateral, elevating repo spreads and triggering equity multiple compression.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-slate-900 dark:text-white block">2. The Reverse Repo (ON RRP) Cushion:</span>
            <p>
              From 2022 to 2024, more than $2 Trillion in cash parked at the Fed's Reverse Repo facility was absorbed into newly issued Treasury bills. This acted as a synthetic stealth QE program, neutralizing the Fed's Quantitative Tightening and powering the massive bull market in tech and digital assets.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-slate-900 dark:text-white block">3. The Cross-Border Carry Trade Canal:</span>
            <p>
              With the Bank of Japan beginning its historical tightening cycle and China's PBOC stepping up stimulus, cross-border liquidity vectors are diverging. Japanese capital repatriation forces higher yields across Western sovereign bonds, while Chinese liquidity acts as a deflationary buffer for industrial commodities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
