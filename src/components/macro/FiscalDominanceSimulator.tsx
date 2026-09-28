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
  ReferenceLine,
} from 'recharts';
import {
  SOVEREIGN_FISCAL_PROFILES,
  FISCAL_SCENARIOS,
  SovereignFiscalProfile,
  FiscalSimulationParams,
  simulateFiscalTrajectory,
  calculateFinancialRepressionMetrics,
} from '../../data/fiscal-dominance-data';
import {
  Scale,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Flame,
  ShieldAlert,
  RotateCcw,
  Zap,
  Building2,
  Anchor,
  Scissors,
  DollarSign,
  Percent,
  CheckCircle2,
  Info,
} from 'lucide-react';

/*
 * Icon resolver mapping scenario definitions to Lucide SVG components
 * to visually communicate macroeconomic regime shifts without external icon bundles.
 */
function getScenarioIcon(iconName: string) {
  switch (iconName) {
    case 'Zap':
      return <Zap className="h-4 w-4 text-amber-400" />;
    case 'Flame':
      return <Flame className="h-4 w-4 text-rose-400" />;
    case 'Anchor':
      return <Anchor className="h-4 w-4 text-indigo-400" />;
    case 'Scissors':
      return <Scissors className="h-4 w-4 text-emerald-400" />;
    default:
      return <Building2 className="h-4 w-4 text-sky-400" />;
  }
}

export function FiscalDominanceSimulator() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('USA');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('baseline');
  const [activeMetricTab, setActiveMetricTab] = useState<'debt' | 'interest'>('debt');

  // Active sovereign baseline configuration
  const currentProfile = useMemo(() => {
    return (
      SOVEREIGN_FISCAL_PROFILES.find((p) => p.code === selectedCountryCode) ??
      SOVEREIGN_FISCAL_PROFILES[0]
    );
  }, [selectedCountryCode]);

  // Current interactive simulation input parameters
  const [params, setParams] = useState<FiscalSimulationParams>({
    bondYield: currentProfile.benchmark10YYield,
    primaryDeficit: currentProfile.primaryDeficitPercent,
    realGrowth: currentProfile.realGdpGrowth,
    inflation: currentProfile.inflationRate,
  });

  // Switch sovereign country profile and reset parameters to its baseline
  const handleSelectCountry = (country: SovereignFiscalProfile) => {
    setSelectedCountryCode(country.code);
    setActiveScenarioId('baseline');
    setParams({
      bondYield: country.benchmark10YYield,
      primaryDeficit: country.primaryDeficitPercent,
      realGrowth: country.realGdpGrowth,
      inflation: country.inflationRate,
    });
  };

  // Apply macroeconomic scenario preset modifications
  const handleSelectScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    const scenario = FISCAL_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setParams({
      bondYield: Math.max(0.1, Number((currentProfile.benchmark10YYield + scenario.yieldMod).toFixed(2))),
      primaryDeficit: Number((currentProfile.primaryDeficitPercent + scenario.deficitMod).toFixed(2)),
      realGrowth: Number((currentProfile.realGdpGrowth + scenario.growthMod).toFixed(2)),
      inflation: Math.max(0.0, Number((currentProfile.inflationRate + scenario.inflationMod).toFixed(2))),
    });
  };

  // Modify individual parameters via sliders
  const handleParamChange = (field: keyof FiscalSimulationParams, value: number) => {
    setActiveScenarioId('custom');
    setParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset to original country baseline
  const handleResetToBaseline = () => {
    setActiveScenarioId('baseline');
    setParams({
      bondYield: currentProfile.benchmark10YYield,
      primaryDeficit: currentProfile.primaryDeficitPercent,
      realGrowth: currentProfile.realGdpGrowth,
      inflation: currentProfile.inflationRate,
    });
  };

  // Compute 10-year dynamic debt & interest projection
  const trajectory = useMemo(() => {
    return simulateFiscalTrajectory(currentProfile, params, 10);
  }, [currentProfile, params]);

  // Compute Financial Repression Tax metrics
  const repression = useMemo(() => {
    return calculateFinancialRepressionMetrics(currentProfile, params);
  }, [currentProfile, params]);

  // Identify tipping point year when interest outstrips discretionary budget
  const tippingPointYear = useMemo(() => {
    const point = trajectory.find((t) => t.isTippingPoint);
    return point ? point.year : null;
  }, [trajectory]);

  // Terminal stats in year 2036
  const terminalPoint = trajectory[trajectory.length - 1];
  const initialPoint = trajectory[0];
  const debtDelta = Number((terminalPoint.debtToGdp - initialPoint.debtToGdp).toFixed(1));

  // Determine current overall risk zone of the terminal projection
  const terminalZone = terminalPoint.zone;

  return (
    <div id="fiscal-simulator" className="space-y-6">
      {/* Header Container */}
      <div className="apple-card p-6 border-l-4 border-l-sky-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 mb-2">
              <Scale className="h-3.5 w-3.5" />
              <span>Sovereign Solvency & Debt Dynamics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Fiscal Dominance & Debt Spiral Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Model real-world sovereign debt rollover dynamics, test bond market yield shocks, and discover the exact "Tipping Point" where sovereign interest obligations crowd out essential national public outlays.
            </p>
          </div>

          <button
            onClick={handleResetToBaseline}
            className="inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 transition-colors shadow-sm"
            title="Reset parameters to official baseline"
          >
            <RotateCcw className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* Sovereign Profile Selector Strip */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.08]">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Select Sovereign Economy:
          </div>
          <div className="flex flex-wrap gap-2">
            {SOVEREIGN_FISCAL_PROFILES.map((profile) => {
              const isSelected = profile.code === selectedCountryCode;
              return (
                <button
                  key={profile.code}
                  onClick={() => handleSelectCountry(profile)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-1 ring-white/20'
                      : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10'
                  }`}
                >
                  <span className="text-sm">{profile.flag}</span>
                  <span className="font-semibold">{profile.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected
                        ? 'bg-sky-600/60 text-white'
                        : 'bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {profile.debtToGdp2026}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Sovereign Profile Metadata */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Total Public Debt:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ${currentProfile.totalDebtTrillion}T ({currentProfile.debtToGdp2026}% GDP)
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Blended Debt Duration:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentProfile.avgDebtMaturityYears} Years avg maturity
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Tax Collection Capacity:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentProfile.taxRevenuePercentGdp}% of GDP
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Central Bank Debt Share:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentProfile.centralBankBalanceSheetGdp}% of GDP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Scenario Presets */}
      <div className="apple-card p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Macroeconomic Stress Scenarios</span>
          <span className="text-[11px] font-normal lowercase text-slate-400">
            {activeScenarioId === 'custom' ? '(Custom Slider Adjustments Active)' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {FISCAL_SCENARIOS.map((scenario) => {
            const isActive = activeScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario.id)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isActive
                    ? 'bg-sky-500/15 border-sky-400 shadow-sm ring-1 ring-sky-400/30'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {getScenarioIcon(scenario.iconName)}
                  <span className="text-xs font-bold text-white tracking-tight">
                    {scenario.name}
                  </span>
                </div>
                <div className="text-[11px] text-sky-400 font-medium mb-1.5">
                  {scenario.subtitle}
                </div>
                <p className="text-[11px] text-slate-300 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator Sliders & Key Vital Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Parameter Control Sliders */}
        <div className="lg:col-span-5 apple-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="h-4 w-4 text-sky-400" />
              Sovereign Policy Levers
            </h3>
            <span className="text-xs text-slate-400">Real-time dynamic feed</span>
          </div>

          {/* Slider 1: 10Y Bond Yield (Marginal Refinancing Rate r) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-amber-400" />
                10Y Sovereign Yield (r)
              </span>
              <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {params.bondYield.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="12.0"
              step="0.05"
              value={params.bondYield}
              aria-label="10Y Sovereign Yield (r)"
              onChange={(e) => handleParamChange('bondYield', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.0% (Zero Bound)</span>
              <span>Baseline: {currentProfile.benchmark10YYield}%</span>
              <span>12.0% (Crushing Crisis)</span>
            </div>
          </div>

          {/* Slider 2: Primary Budget Deficit (% of GDP) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-rose-400" />
                Primary Deficit (% of GDP)
              </span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded border ${
                  params.primaryDeficit <= 0
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                    : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
                }`}
              >
                {params.primaryDeficit > 0 ? `+${params.primaryDeficit.toFixed(2)}%` : `${params.primaryDeficit.toFixed(2)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="10.0"
              step="0.1"
              value={params.primaryDeficit}
              aria-label="Primary Deficit (% of GDP)"
              onChange={(e) => handleParamChange('primaryDeficit', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-4.0% (Surplus)</span>
              <span>Baseline: +{currentProfile.primaryDeficitPercent}%</span>
              <span>+10.0% (Runaway)</span>
            </div>
          </div>

          {/* Slider 3: Real GDP Growth Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                Real GDP Growth Rate
              </span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded border ${
                  params.realGrowth >= 2.0
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                    : params.realGrowth >= 0
                    ? 'text-sky-400 bg-sky-400/10 border-sky-400/20'
                    : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
                }`}
              >
                {params.realGrowth >= 0 ? `+${params.realGrowth.toFixed(2)}%` : `${params.realGrowth.toFixed(2)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-3.0"
              max="8.0"
              step="0.1"
              value={params.realGrowth}
              aria-label="Real GDP Growth Rate"
              onChange={(e) => handleParamChange('realGrowth', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-3.0% (Recession)</span>
              <span>Baseline: +{currentProfile.realGdpGrowth}%</span>
              <span>+8.0% (Boom)</span>
            </div>
          </div>

          {/* Slider 4: Inflation Rate (GDP Deflator) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                Inflation Rate (GDP Deflator)
              </span>
              <span className="font-mono font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">
                {params.inflation.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="15.0"
              step="0.1"
              value={params.inflation}
              aria-label="Inflation Rate (GDP Deflator)"
              onChange={(e) => handleParamChange('inflation', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.0% (Deflation risk)</span>
              <span>Baseline: {currentProfile.inflationRate}%</span>
              <span>15.0% (Debasement)</span>
            </div>
          </div>

          {/* Theoretical Rule Explainer */}
          <div className="text-[11px] text-slate-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] leading-relaxed">
            <span className="font-semibold text-slate-300">The Compounding Law:</span> When sovereign yields exceed nominal growth (<code className="text-amber-300">r &gt; g</code>), debt grows exponentially even with zero new program spending. Maturing bonds roll over annually at 1/{currentProfile.avgDebtMaturityYears}th per year.
          </div>
        </div>

        {/* 4 Macro Solvency Metric Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Tipping Point Gauge */}
          <div className="apple-card p-5 flex flex-col justify-between border-t-2 border-t-rose-500">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  Budget Tipping Point
                </span>
                <span className="text-[11px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono font-medium">
                  Net Interest &gt; Discretionary
                </span>
              </div>
              <div className="mt-1">
                {tippingPointYear ? (
                  <div className="text-2xl font-bold text-rose-400 tracking-tight flex items-baseline gap-2">
                    <span>Year {tippingPointYear}</span>
                    <span className="text-xs font-normal text-rose-300">
                      ({tippingPointYear - 2026} years away)
                    </span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-emerald-400 tracking-tight flex items-baseline gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Solvency Safe</span>
                  </div>
                )}
                <p className="text-xs text-slate-300 dark:text-slate-400 mt-2 leading-relaxed">
                  {tippingPointYear
                    ? `By ${tippingPointYear}, interest on public debt eclipses ${currentProfile.name}'s entire discretionary and defense baseline (${currentProfile.defenseAndDiscretionaryPercentGdp}% of GDP).`
                    : `Debt service obligations remain within national revenue boundaries through 2036.`}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] text-slate-400">
              Discretionary Budget Cap: <span className="text-white font-medium">{currentProfile.defenseAndDiscretionaryPercentGdp}% of GDP</span>
            </div>
          </div>

          {/* Card 2: Interest to Tax Revenue Absorption */}
          <div className="apple-card p-5 flex flex-col justify-between border-t-2 border-t-amber-500">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5 text-amber-400" />
                  Interest-to-Tax Ratio
                </span>
                <span className="text-[11px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-medium">
                  2036 Horizon
                </span>
              </div>
              <div className="mt-1">
                <div className="text-2xl font-bold text-amber-400 tracking-tight flex items-baseline gap-2">
                  <span>{terminalPoint.interestToTaxRevenuePercent}%</span>
                  <span className="text-xs font-normal text-slate-400">
                    (from {initialPoint.interestToTaxRevenuePercent}%)
                  </span>
                </div>
                <p className="text-xs text-slate-300 dark:text-slate-400 mt-2 leading-relaxed">
                  Percentage of every tax dollar collected consumed exclusively to pay interest to bondholders by 2036.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.08]">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    terminalPoint.interestToTaxRevenuePercent > 35
                      ? 'bg-rose-500'
                      : terminalPoint.interestToTaxRevenuePercent > 20
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (terminalPoint.interestToTaxRevenuePercent / 50) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Healthy (&lt;15%)</span>
                <span>Critical (&gt;25%)</span>
                <span>Dominance (&gt;35%)</span>
              </div>
            </div>
          </div>

          {/* Card 3: The r - g Compounding Differential */}
          <div className="apple-card p-5 flex flex-col justify-between border-t-2 border-t-sky-500">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5 text-sky-400" />
                  r − g Snowball Spread
                </span>
                <span className="text-[11px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-mono font-medium">
                  {terminalPoint.rMinusG > 0 ? 'Compounding' : 'Deleveraging'}
                </span>
              </div>
              <div className="mt-1">
                <div
                  className={`text-2xl font-bold tracking-tight ${
                    terminalPoint.rMinusG > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {terminalPoint.rMinusG > 0 ? `+${terminalPoint.rMinusG}%` : `${terminalPoint.rMinusG}%`}
                </div>
                <p className="text-xs text-slate-300 dark:text-slate-400 mt-2 leading-relaxed">
                  {terminalPoint.rMinusG > 0
                    ? `Effective debt interest (${terminalPoint.effectiveInterestRate}%) exceeds nominal GDP expansion. Debt expands organically without fresh borrowing.`
                    : `Nominal economic growth outpaces sovereign borrowing costs, allowing the debt-to-GDP burden to naturally melt down.`}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] text-slate-400">
              Terminal Effective Coupon: <span className="text-white font-medium">{terminalPoint.effectiveInterestRate}%</span>
            </div>
          </div>

          {/* Card 4: Financial Repression Tax */}
          <div className="apple-card p-5 flex flex-col justify-between border-t-2 border-t-purple-500">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
                  Repression Tax on Savers
                </span>
                <span className="text-[11px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono font-medium">
                  Required Stealth Haircut
                </span>
              </div>
              <div className="mt-1">
                <div className="text-2xl font-bold text-purple-400 tracking-tight flex items-baseline gap-2">
                  <span>${repression.annualWealthTransferTrillion}T / yr</span>
                </div>
                <p className="text-xs text-slate-300 dark:text-slate-400 mt-2 leading-relaxed">
                  {repression.yieldPenalty > 0
                    ? `To stabilize debt without cutting deficits, central banks must suppress yields to ${repression.stabilizingYield}% (a -${repression.yieldPenalty}% negative real rate haircut).`
                    : `Primary balance is sound; no synthetic rate suppression or bondholder expropriation required.`}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] text-slate-400">
              Required Stabilizing Yield: <span className="text-white font-medium">{repression.stabilizingYield}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Trajectory Projection Chart */}
      <div className="apple-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                {currentProfile.name} 10-Year Solvency Trajectory (2026–2036)
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  terminalZone === 'dominance'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : terminalZone === 'critical'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : terminalZone === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {terminalZone === 'dominance'
                  ? 'FISCAL DOMINANCE'
                  : terminalZone === 'critical'
                  ? 'CRITICAL REFINANCING RISK'
                  : terminalZone === 'warning'
                  ? 'ELEVATED VULNERABILITY'
                  : 'SUSTAINABLE TRAJECTORY'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Starting from {initialPoint.debtToGdp}% in 2026 to {terminalPoint.debtToGdp}% in 2036 (
              <span className={debtDelta > 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                {debtDelta > 0 ? `+${debtDelta}%` : `${debtDelta}%`}
              </span>{' '}
              net movement).
            </p>
          </div>

          {/* Metric View Tabs */}
          <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
            <button
              onClick={() => setActiveMetricTab('debt')}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                activeMetricTab === 'debt'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Debt-to-GDP (%)
            </button>
            <button
              onClick={() => setActiveMetricTab('interest')}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                activeMetricTab === 'interest'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Annual Interest Outlays ($T)
            </button>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricTab === 'debt' ? (
              <AreaChart data={trajectory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDebtTrajectory" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={terminalZone === 'dominance' ? '#f43f5e' : terminalZone === 'critical' ? '#f97316' : '#0284c7'}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={terminalZone === 'dominance' ? '#f43f5e' : terminalZone === 'critical' ? '#f97316' : '#0284c7'}
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, (dataMax: number) => Math.max(160, Math.ceil((dataMax + 20) / 20) * 20)]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="apple-card p-3 shadow-xl border border-white/20 text-xs space-y-1.5 min-w-[200px]">
                          <div className="font-bold text-white border-b border-white/10 pb-1 flex justify-between">
                            <span>Year {data.year}</span>
                            <span className="uppercase text-[10px] text-sky-400 font-semibold">{data.zone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Debt to GDP:</span>
                            <span className="font-bold text-white">{data.debtToGdp}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Debt Stock:</span>
                            <span className="font-medium text-white">${data.totalDebtTrillion}T</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Net Interest Outlay:</span>
                            <span className="font-medium text-amber-400">
                              ${data.netInterestExpenseTrillion}T ({data.netInterestExpensePercentGdp}% GDP)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Interest / Tax Revenue:</span>
                            <span className="font-medium text-rose-400">{data.interestToTaxRevenuePercent}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">r - g Spread:</span>
                            <span className="font-medium text-white">{data.rMinusG}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={60}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: '60% Maastricht Safe Limit', fill: '#10b981', fontSize: 10, position: 'insideTopLeft' }}
                />
                <ReferenceLine
                  y={90}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: '90% Growth Drag Threshold', fill: '#f59e0b', fontSize: 10, position: 'insideTopLeft' }}
                />
                <ReferenceLine
                  y={120}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: '120% Fiscal Dominance Tipping Line', fill: '#ef4444', fontSize: 10, position: 'insideTopLeft' }}
                />
                <Area
                  type="monotone"
                  dataKey="debtToGdp"
                  name="Debt to GDP (%)"
                  stroke={terminalZone === 'dominance' ? '#f43f5e' : terminalZone === 'critical' ? '#f97316' : '#38bdf8'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorDebtTrajectory)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : (
              <AreaChart data={trajectory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInterestOutlays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}T`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="apple-card p-3 shadow-xl border border-white/20 text-xs space-y-1.5 min-w-[200px]">
                          <div className="font-bold text-white border-b border-white/10 pb-1">
                            Year {data.year} Interest Burden
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Annual Net Interest:</span>
                            <span className="font-bold text-amber-400">${data.netInterestExpenseTrillion} Trillion</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Share of National GDP:</span>
                            <span className="font-medium text-white">{data.netInterestExpensePercentGdp}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Share of Tax Receipts:</span>
                            <span className="font-medium text-rose-400">{data.interestToTaxRevenuePercent}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="netInterestExpenseTrillion"
                  name="Annual Net Interest ($T)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorInterestOutlays)"
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Macro Strategic Diagnosis Brief */}
      <div className="apple-card p-6 border-l-4 border-l-amber-500">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-amber-400" />
          Autonomous Macro Diagnosis & Strategy Brief
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300 dark:text-slate-400 leading-relaxed">
          <div className="space-y-1.5">
            <span className="font-semibold text-white block">1. Solvency Verdict & Central Bank Independence:</span>
            <p>
              {terminalZone === 'dominance'
                ? `With debt projected to reach ${terminalPoint.debtToGdp}% of GDP, ${currentProfile.name} enters full Fiscal Dominance. The central bank loses monetary independence; raising rates to combat inflation becomes impossible without causing sovereign default. Yield Curve Control (YCC) becomes mandatory.`
                : terminalZone === 'critical'
                ? `${currentProfile.name}'s fiscal headroom is critically impaired. The Treasury must rely heavily on short-dated T-Bills to avoid locking in high coupon yields, leaving the sovereign exposed to violent rollover refinancing shocks.`
                : `Solvency metrics remain stabilized under current parameters. The sovereign retains monetary autonomy and can adjust interest rates without immediate debt spiral contagion.`}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-white block">2. Transmission Channel to Everyday Citizens:</span>
            <p>
              When interest payments consume <span className="text-amber-400 font-semibold">{terminalPoint.interestToTaxRevenuePercent}%</span> of all tax revenue, governments face a trilemma: (a) severe austerity gutting pensions and public infrastructure, (b) aggressive wealth and capital gains tax hikes, or (c) debasing the currency via negative real rates.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-white block">3. Capital Preservation & Investor Playbook:</span>
            <p>
              Under fiscal dominance and a <span className="text-purple-400 font-semibold">${repression.annualWealthTransferTrillion}T/year</span> financial repression tax, fixed-rate sovereign bonds produce negative real yields. Institutional capital historically reallocates toward scarce real estate, gold reserves, commodities, and high-pricing-power global equities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
