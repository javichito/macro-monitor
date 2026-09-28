'use client';

import React, { useState, useMemo } from 'react';
import { COUNTRIES_DATA } from '../../data/country-metrics';
import {
  calculatePppConversion,
  COUNTRY_PPP_METRICS,
  CountryPppMetric,
} from '../../lib/calculations';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import {
  ArrowRightLeft,
  Building2,
  ShoppingBag,
  HeartPulse,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Globe2,
  Sparkles,
} from 'lucide-react';

export function PppConverter() {
  const [netWorth, setNetWorth] = useState<number>(100000);
  const [fromCountryCode, setFromCountryCode] = useState<string>('USA');
  const [toCountryCode, setToCountryCode] = useState<string>('ESP');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const fromCountry =
    COUNTRIES_DATA.find((c) => c.code === fromCountryCode) || COUNTRIES_DATA[0];
  const toCountry =
    COUNTRIES_DATA.find((c) => c.code === toCountryCode) || COUNTRIES_DATA[1];

  const conversion = useMemo(
    () => calculatePppConversion(netWorth, fromCountryCode, toCountryCode),
    [netWorth, fromCountryCode, toCountryCode]
  );

  const quickPresets = [25000, 75000, 150000, 300000, 500000, 1000000];

  /*
   * We swap origin and destination countries so users can instantly evaluate
   * both outbound geo-arbitrage and inbound capital requirements.
   */
  const handleSwap = () => {
    setFromCountryCode(toCountryCode);
    setToCountryCode(fromCountryCode);
  };

  const regions = useMemo(() => {
    const list = Array.from(new Set(COUNTRIES_DATA.map((c) => c.region)));
    return ['all', ...list];
  }, []);

  /*
   * Compute relative purchasing power rankings across all 31 tracked nations
   * relative to the currently chosen origin country.
   */
  const sovereignRankings = useMemo(() => {
    const fromPpp =
      COUNTRY_PPP_METRICS[fromCountryCode]?.priceLevelRatio || 1.0;

    return COUNTRIES_DATA.map((c) => {
      const targetPpp =
        COUNTRY_PPP_METRICS[c.code]?.priceLevelRatio || 1.0;
      const multiplier = Number((fromPpp / targetPpp).toFixed(2));
      const equivalent = Math.round(netWorth * multiplier);
      const costRatio = Number((targetPpp / fromPpp).toFixed(2));
      const costDiff = Number(((costRatio - 1) * 100).toFixed(1));

      return {
        code: c.code,
        name: c.name,
        flag: c.flag,
        region: c.region,
        multiplier,
        equivalent,
        costDiff,
      };
    })
      .filter((item) => {
        const matchesQuery =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion =
          selectedRegion === 'all' || item.region === selectedRegion;
        return matchesQuery && matchesRegion;
      })
      .sort((a, b) =>
        sortOrder === 'desc'
          ? b.multiplier - a.multiplier
          : a.multiplier - b.multiplier
      );
  }, [fromCountryCode, netWorth, searchQuery, selectedRegion, sortOrder]);

  const isCheaper = conversion.costDifferencePercent < 0;

  return (
    <div className="apple-card p-6 sm:p-7 relative overflow-hidden" data-testid="ppp-converter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30 shadow-sm">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Purchasing Power Parity (PPP) &amp; Cost-of-Living Converter
            </h3>
            <p className="text-xs text-white/60">
              Calculate what your wealth buys in local real-world goods, housing, and healthcare worldwide.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-white/[0.05] border border-white/10 px-3 py-1 text-xs text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-[#ffd60a]" />
          <span>World Bank ICP 2026 Model</span>
        </div>
      </div>

      {/* Main Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Origin Country */}
        <div className="lg:col-span-4 space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
            Origin Country (Base)
          </label>
          <select
            aria-label="Origin Country"
            value={fromCountryCode}
            onChange={(e) => setFromCountryCode(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm font-medium text-white focus:border-[#0a84ff] focus:outline-none transition-colors"
          >
            {COUNTRIES_DATA.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#12141c] text-white">
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-1 flex items-end justify-center pb-1">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap origin and target countries"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white transition-all active:scale-95"
            title="Swap origin and destination countries"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Destination Country */}
        <div className="lg:col-span-4 space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
            Destination Country (Target)
          </label>
          <select
            aria-label="Destination Country"
            value={toCountryCode}
            onChange={(e) => setToCountryCode(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm font-medium text-white focus:border-[#0a84ff] focus:outline-none transition-colors"
          >
            {COUNTRIES_DATA.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#12141c] text-white">
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
            Capital / Net Worth (USD)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
              <DollarSign className="h-4 w-4" />
            </div>
            <input
              type="number"
              min="0"
              step="5000"
              aria-label="Capital or Net Worth in USD"
              value={netWorth}
              onChange={(e) => setNetWorth(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-9 pr-3.5 py-2.5 text-sm font-mono font-medium text-white focus:border-[#0a84ff] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="mb-7">
        <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-2">
          Quick Capital Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPresets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setNetWorth(val)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                netWorth === val
                  ? 'bg-[#0a84ff]/20 text-[#0a84ff] border-[#0a84ff]/40 shadow-sm'
                  : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {formatCurrency(val, { compact: true })}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Comparison Result Card */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 sm:p-6 backdrop-blur-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Purchasing Equivalence
            </span>
            <div className="mt-1 flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {formatCurrency(conversion.equivalentAmount)}
              </span>
              <span className="text-sm font-medium text-white/60">
                in {toCountry.flag} {toCountry.name}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Equivalent living standard value for {formatCurrency(conversion.amount)} originating in {fromCountry.flag} {fromCountry.name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                isCheaper
                  ? 'bg-[#30d158]/15 border-[#30d158]/30 text-[#30d158]'
                  : 'bg-[#ff453a]/15 border-[#ff453a]/30 text-[#ff453a]'
              }`}
            >
              {isCheaper ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              <span>
                {isCheaper
                  ? `${Math.abs(conversion.costDifferencePercent)}% Cheaper`
                  : `${conversion.costDifferencePercent}% Pricier`}
              </span>
            </div>

            <div className="inline-flex items-center px-3 py-1.5 rounded-xl border border-[#0a84ff]/30 bg-[#0a84ff]/15 text-[#0a84ff] text-xs font-bold">
              {conversion.purchasingMultiplier}x Multiplier
            </div>
          </div>
        </div>

        {/* Narrative Summary */}
        <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-normal">
          {conversion.summary}
        </p>

        {/* 3 Sectoral Basket Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
          {/* Housing */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <Building2 className="h-4 w-4 text-[#ffd60a]" />
              <span className="text-xs font-semibold">Housing &amp; Rent</span>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              {conversion.baskets.housingMultiplier}x
            </div>
            <span className="text-[11px] text-white/50 block mt-1">
              {conversion.baskets.housingMultiplier >= 1.0
                ? `${Math.round((conversion.baskets.housingMultiplier - 1) * 100)}% more living space`
                : `${Math.round((1 - conversion.baskets.housingMultiplier) * 100)}% higher real estate costs`}
            </span>
          </div>

          {/* Groceries & Goods */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <ShoppingBag className="h-4 w-4 text-[#30d158]" />
              <span className="text-xs font-semibold">Food &amp; Groceries</span>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              {conversion.baskets.goodsMultiplier}x
            </div>
            <span className="text-[11px] text-white/50 block mt-1">
              {conversion.baskets.goodsMultiplier >= 1.0
                ? `${Math.round((conversion.baskets.goodsMultiplier - 1) * 100)}% more dining & basket volume`
                : `${Math.round((1 - conversion.baskets.goodsMultiplier) * 100)}% pricier groceries`}
            </span>
          </div>

          {/* Healthcare & Services */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <HeartPulse className="h-4 w-4 text-[#ff375f]" />
              <span className="text-xs font-semibold">Healthcare &amp; Labor</span>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              {conversion.baskets.servicesMultiplier}x
            </div>
            <span className="text-[11px] text-white/50 block mt-1">
              {conversion.baskets.servicesMultiplier >= 1.0
                ? `${Math.round((conversion.baskets.servicesMultiplier - 1) * 100)}% higher service affordability`
                : `${Math.round((1 - conversion.baskets.servicesMultiplier) * 100)}% more costly private services`}
            </span>
          </div>
        </div>
      </div>

      {/* Global Geo-Arbitrage Leaderboard */}
      <div className="mt-8 pt-6 border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Global Purchasing Power Leaderboard
            </h4>
            <p className="text-xs text-white/50">
              Where does your {formatCurrency(netWorth, { compact: true })} stretch furthest relative to {fromCountry.flag} {fromCountry.name}?
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
              <input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.05] pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-[#0a84ff] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/[0.1] hover:text-white transition-colors"
            >
              Sort: {sortOrder === 'desc' ? 'Highest Multiplier ↓' : 'Lowest Multiplier ↑'}
            </button>
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all capitalize ${
                selectedRegion === reg
                  ? 'bg-white/[0.15] text-white border-white/30 shadow-sm'
                  : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              {reg === 'all' ? 'All Continents (31)' : reg}
            </button>
          ))}
        </div>

        {/* Sovereign Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wider text-white/50 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-semibold">Rank</th>
                <th className="px-4 py-3 font-semibold">Country</th>
                <th className="px-4 py-3 font-semibold text-right">Cost Variance</th>
                <th className="px-4 py-3 font-semibold text-right">Purchasing Multiplier</th>
                <th className="px-4 py-3 font-semibold text-right">Local Equivalent</th>
                <th className="px-4 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {sovereignRankings.map((item, idx) => {
                const isItemCheaper = item.costDiff < 0;
                const isSelected = item.code === toCountryCode;

                return (
                  <tr
                    key={item.code}
                    className={`transition-colors hover:bg-white/[0.03] ${
                      isSelected ? 'bg-[#0a84ff]/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-white/40">
                      #{idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.flag}</span>
                        <span className="font-medium text-white">{item.name}</span>
                        <span className="text-[10px] text-white/40 font-mono">
                          {item.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-semibold ${
                          item.costDiff === 0
                            ? 'text-white/50'
                            : isItemCheaper
                            ? 'text-[#30d158]'
                            : 'text-[#ff453a]'
                        }`}
                      >
                        {item.costDiff === 0
                          ? 'Baseline'
                          : item.costDiff > 0
                          ? `+${item.costDiff}%`
                          : `${item.costDiff}%`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white">
                      {item.multiplier}x
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#30d158]">
                      {formatCurrency(item.equivalent, { compact: true })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setToCountryCode(item.code)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#0a84ff] text-white shadow-sm'
                            : 'bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white border border-white/10'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Compare'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
