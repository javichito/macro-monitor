'use client';

import React from 'react';
import { MacroSectionTab } from '../navigation/macro-taxonomy';
import {
  Compass,
  Activity,
  ShieldAlert,
  Home,
  Globe2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Zap,
  Layers,
  ChevronRight,
  Gauge,
  Sparkles,
} from 'lucide-react';

import latestYieldStatus from '../../../data/latest-yield-status.json';
import latestVolStatus from '../../../data/latest-volatility-status.json';
import latestPhysicalStatus from '../../../data/latest-physical-economy-status.json';
import latestCalendarStatus from '../../../data/latest-calendar-status.json';
import latestCreditStatus from '../../../data/latest-credit-status.json';

interface MacroExecutiveBriefingProps {
  onSelectTab: (tab: MacroSectionTab) => void;
}

/*
 * High-altitude operational briefing synthesizing the 5 macro pillars.
 * Solves cognitive overload by providing an immediate holistic pulse before
 * users drill down into specialized quantitative models.
 */
export function MacroExecutiveBriefing({ onSelectTab }: MacroExecutiveBriefingProps) {
  const yieldData = latestYieldStatus;
  const volData = latestVolStatus;
  const physData = latestPhysicalStatus;
  const calData = latestCalendarStatus;
  const creditData = latestCreditStatus;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome / System Status */}
      <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.08] via-slate-900/[0.02] to-transparent p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Executive Briefing &amp; Global Macro Pulse</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Current Macroeconomic State: Late-Cycle Reflation &amp; Dis-Inversion
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Sovereign yield curves have dis-inverted (+17 bps), bond market volatility is elevated (MOVE 108.5), while primary energy expenditures remain benign at 6.1% of global GDP. Explore the 5 institutional pillars below.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => onSelectTab('all')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] border border-slate-300 dark:border-white/[0.12] transition-all cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Full Dossier View</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('regimes')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 shadow-md transition-all cursor-pointer"
            >
              <span>Explore Regimes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Pulse Radars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Radar 1: Yield Curve Status */}
        <div 
          onClick={() => onSelectTab('yields')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03] p-5 shadow-sm hover:border-sky-500/50 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">10Y–2Y Sovereign Spread</span>
            <Activity className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            +{yieldData.spread10Y2Y.toFixed(2)}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Curve un-inverted (Re-steepening)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            Historically, curve un-inversion precedes recessions as rate cuts begin. 12M probability at {yieldData.recessionProbability12M}%.
          </p>
        </div>

        {/* Radar 2: Bond Volatility (MOVE) */}
        <div 
          onClick={() => onSelectTab('volatility')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03] p-5 shadow-sm hover:border-amber-500/50 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">ICE BofA MOVE Index</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {volData.moveIndex.toFixed(1)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <span>Elevated bond volatility</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            VIX/MOVE ratio at {volData.vixMoveRatio.toFixed(2)} reflects equity complacency relative to sovereign debt turbulence.
          </p>
        </div>

        {/* Radar 3: Claudia Sahm Labor Indicator */}
        <div 
          onClick={() => onSelectTab('labor')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03] p-5 shadow-sm hover:border-rose-500/50 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Sahm Rule Delta</span>
            <Gauge className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            +0.43%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <span>Threshold: 0.50% (7 bps away)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            3-month moving average of US unemployment is approaching the historical recession threshold with zero false positives.
          </p>
        </div>

        {/* Radar 4: Physical Energy Burden */}
        <div 
          onClick={() => onSelectTab('physical')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03] p-5 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Energy % World GDP</span>
            <Zap className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {physData.energyMetrics.latestEnergyBurdenPctGdp.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Benign (Danger: &gt;8.0%)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            Brent crude at ${physData.energyMetrics.brentCrudeUsd}/bbl keeps aggregate energy drag below historical contraction thresholds.
          </p>
        </div>
      </div>

      {/* Thematic Pillars Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Analytical Domains</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400 font-normal">
              5 Pillars
            </span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click any domain to enter deep-dive model suite
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pillar 1 */}
          <div
            onClick={() => onSelectTab('regimes')}
            className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-5 hover:bg-white dark:hover:bg-white/[0.05] hover:border-sky-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">3 Models</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Regimes &amp; Business Cycle
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Dalio 4-quadrant growth vs inflation clock, Atlanta Fed GDPNow, ISM Manufacturing PMI diffusion, and Sahm rule triggers.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Cycle Intelligence</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => onSelectTab('yields')}
            className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-5 hover:bg-white dark:hover:bg-white/[0.05] hover:border-sky-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">4 Models</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Rates, Liquidity &amp; Debt
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Sovereign yield curve inversions, 3D term structure surfaces, ICE BofA MOVE bond volatility, central bank net liquidity, and T-bill issuance.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Rates &amp; Plumbing</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => onSelectTab('credit')}
            className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-5 hover:bg-white dark:hover:bg-white/[0.05] hover:border-sky-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">2 Models</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Credit &amp; Market Structure
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  High-yield corporate OAS credit spreads, Chicago Fed NFCI, Fed SLOOS lending standards, and cross-asset relative valuation ratios.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Credit &amp; Ratios</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pillar 4 */}
          <div
            onClick={() => onSelectTab('housing')}
            className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-5 hover:bg-white dark:hover:bg-white/[0.05] hover:border-sky-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                  <Home className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">3 Models</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Physical Economy &amp; Inflation
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Housing Affordability Index (HAI), mortgage rate lock-in effect, global energy expenditure % GDP, friendshoring, and supercore CPI inflation.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Physical &amp; Inflation</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pillar 5 */}
          <div
            onClick={() => onSelectTab('external')}
            className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-5 hover:bg-white dark:hover:bg-white/[0.05] hover:border-sky-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
                  <Globe2 className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">2 Models</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  External Sector &amp; Events
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Balance of Payments twin deficits, US TIC foreign central bank holdings, BIS REER overvaluation, and Citi Economic Surprise Index.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch External &amp; Calendar</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
