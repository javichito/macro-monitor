'use client';

import React, { useState } from 'react';
import { MacroSectionTab } from '../navigation/macro-taxonomy';
import {
  Compass,
  Activity,
  ShieldAlert,
  Home,
  Globe2,
  ArrowRight,
  Flame,
  Zap,
  Layers,
  ChevronRight,
  Gauge,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

import latestYieldStatus from '../../../data/latest-yield-status.json';
import latestVolStatus from '../../../data/latest-volatility-status.json';
import latestPhysicalStatus from '../../../data/latest-physical-economy-status.json';

interface MacroExecutiveBriefingProps {
  onSelectTab: (tab: MacroSectionTab) => void;
}

interface MacroScenario {
  id: string;
  label: string;
  trigger: string;
  step1Rates: string;
  step2Economy: string;
  step3Winner: string;
  targetTab: MacroSectionTab;
  targetLabel: string;
}

const MACRO_SCENARIOS: MacroScenario[] = [
  {
    id: 'rate-cut-150',
    label: 'Fed Slashes Rates -150 bps',
    trigger: 'Central bank panics over rising layoffs and cuts short-term rates fast.',
    step1Rates: '2Y Treasury yield plunges faster than 10Y — the yield curve rapidly steepens.',
    step2Economy: '30Y mortgage rates ease toward 5.2%, unlocking frozen housing inventory.',
    step3Winner: 'Gold, small-cap equities, and existing homeowners refinancing debt.',
    targetTab: 'yields',
    targetLabel: 'Inspect Yield Curve Un-Inversion',
  },
  {
    id: 'oil-shock-130',
    label: 'Oil Spikes to $130/bbl',
    trigger: 'Geopolitical supply chokepoint sends Brent crude from $74 to $130.',
    step1Rates: 'Primary energy burden crosses the 8.5% of World GDP recession danger line.',
    step2Economy: 'Households pay a regressive "energy tax" at the pump, cutting discretionary spending.',
    step3Winner: 'Energy producers, commodity exporters, and inflation-protected bonds (TIPS).',
    targetTab: 'physical',
    targetLabel: 'Inspect Energy Burden Radar',
  },
  {
    id: 'bond-vigilantes',
    label: 'Treasury Auction Buyer Strike',
    trigger: 'Trillion-dollar fiscal deficits spook bond buyers during a 10Y Treasury auction.',
    step1Rates: 'ICE BofA MOVE bond volatility spikes above 135; repo collateral haircuts rise.',
    step2Economy: 'Hedge funds unwind leveraged basis trades, forcing emergency Fed liquidity.',
    step3Winner: 'Short-term T-Bills and cash buffers (until the Fed steps in with QE).',
    targetTab: 'volatility',
    targetLabel: 'Inspect Bond Volatility & Plumbing',
  },
  {
    id: 'ai-goldilocks',
    label: 'AI Productivity Surge',
    trigger: 'Output per worker jumps +3.5%/yr while unit labor costs cool down.',
    step1Rates: 'Economy enters the "Goldilocks" quadrant (Growth Accelerating, Inflation Falling).',
    step2Economy: 'Corporate profit margins expand without forcing the Fed to hike rates.',
    step3Winner: 'Growth equities, semiconductor capex, and industrial copper.',
    targetTab: 'regimes',
    targetLabel: 'Inspect 4-Quadrant Regime Clock',
  },
];

/*
 * Interactive Macro Briefing & Cause-and-Effect Flight Simulator.
 * Replaces static jargon walls with human-first questions and hands-on scenario testing.
 */
export function MacroExecutiveBriefing({ onSelectTab }: MacroExecutiveBriefingProps) {
  const yieldData = latestYieldStatus;
  const volData = latestVolStatus;
  const physData = latestPhysicalStatus;

  const [activeScenarioId, setActiveScenarioId] = useState<string>('rate-cut-150');

  let completedChallenges: string[] = [];
  let markChallengeCompleted: ((id: string) => void) | undefined;
  try {
    const app = useApp();
    completedChallenges = app.completedChallenges;
    markChallengeCompleted = app.markChallengeCompleted;
  } catch {
    // Standalone unit test fallback
  }

  const activeScenario =
    MACRO_SCENARIOS.find((s) => s.id === activeScenarioId) || MACRO_SCENARIOS[0];
  const simChallengeId = `macro-sim-${activeScenario.id}`;
  const isScenarioTested = completedChallenges.includes(simChallengeId);

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    if (markChallengeCompleted) {
      markChallengeCompleted(`macro-sim-${id}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Hero Status Card */}
      <div className="apple-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-400" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-300">
              <span className="px-2.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">
                Executive Briefing &amp; Global Macro Pulse
              </span>
              <span>•</span>
              <span>2026 Cycle Weather Report</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Where Are We in the Economic Cycle Right Now?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Think of the global economy as a giant engine: right now, the yield curve has just un-inverted (<strong>+{yieldData.spread10Y2Y.toFixed(2)}%</strong>), bond market nerves are elevated (<strong>MOVE {volData.moveIndex.toFixed(1)}</strong>), and energy costs remain calm at <strong>{physData.energyMetrics.latestEnergyBurdenPctGdp.toFixed(1)}%</strong> of world GDP.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => onSelectTab('all')}
              className="tactile-button inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] border border-slate-300 dark:border-white/[0.15] cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Full Dossier View</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('regimes')}
              className="tactile-button inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border-amber-600 shadow-sm cursor-pointer"
            >
              <span>Explore Regimes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Cause-and-Effect Flight Simulator ("What Happens If...") */}
      <div className="apple-card p-5 sm:p-7 border-amber-500/30 dark:border-amber-400/25 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 mb-1">
              <Sliders className="h-3.5 w-3.5" />
              <span>Interactive Cause &amp; Effect Simulator • +15 XP per Shock</span>
            </div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Pull a Macro Lever: See How One Shock Ripples Through the World
            </h3>
          </div>
          {isScenarioTested && (
            <span className="inline-flex items-center gap-1 font-mono-tabular text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Scenario Simulated (+15 XP)
            </span>
          )}
        </div>

        {/* 4 Tactile Scenario Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {MACRO_SCENARIOS.map((scen, idx) => {
            const isSelected = scen.id === activeScenarioId;
            return (
              <button
                key={scen.id}
                type="button"
                onClick={() => handleSelectScenario(scen.id)}
                className={`tactile-button text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-600 font-bold shadow-sm'
                    : 'bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/[0.10] hover:bg-slate-200/70 dark:hover:bg-white/[0.08]'
                }`}
              >
                <div className="font-mono-tabular text-[10px] uppercase tracking-wider opacity-75">
                  Shock 0{idx + 1}
                </div>
                <div className="text-xs sm:text-sm font-bold mt-0.5">{scen.label}</div>
              </button>
            );
          })}
        </div>

        {/* Ripple Chain Reaction Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="rounded-xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] p-4 space-y-1.5">
            <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              1. Immediate Plumbing Reaction
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {activeScenario.step1Rates}
            </p>
          </div>

          <div className="rounded-xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] p-4 space-y-1.5">
            <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              2. Real-World Household Impact
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {activeScenario.step2Economy}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-4 space-y-1.5 flex flex-col justify-between">
            <div>
              <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                3. Who Wins &amp; Where to Look
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed mt-1">
                {activeScenario.step3Winner}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab(activeScenario.targetTab)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
            >
              <span>{activeScenario.targetLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Pulse Radars (Dial Gauges) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Radar 1: Yield Curve Status */}
        <div
          onClick={() => onSelectTab('yields')}
          className="apple-card apple-card-hover cursor-pointer p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              10Y–2Y Sovereign Spread
            </span>
            <Activity className="h-4 w-4 text-sky-500" />
          </div>
          <div className="font-mono-tabular text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            +{yieldData.spread10Y2Y.toFixed(2)}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Curve un-inverted (Re-steepening)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Historically, curve un-inversion precedes recessions as rate cuts begin. 12M probability at {yieldData.recessionProbability12M}%.
          </p>
        </div>

        {/* Radar 2: Bond Volatility (MOVE) */}
        <div
          onClick={() => onSelectTab('volatility')}
          className="apple-card apple-card-hover cursor-pointer p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              ICE BofA MOVE Index
            </span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="font-mono-tabular text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {volData.moveIndex.toFixed(1)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <span>Elevated bond volatility</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            The &ldquo;VIX of the bond market.&rdquo; VIX/MOVE ratio at {volData.vixMoveRatio.toFixed(2)} shows stocks are calmer than bonds.
          </p>
        </div>

        {/* Radar 3: Claudia Sahm Labor Indicator */}
        <div
          onClick={() => onSelectTab('labor')}
          className="apple-card apple-card-hover cursor-pointer p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Sahm Rule Delta
            </span>
            <Gauge className="h-4 w-4 text-rose-500" />
          </div>
          <div className="font-mono-tabular text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            +0.43%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            <span>Recession Trigger: +0.50% (7 bps away)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            When the 3-month unemployment average rises 0.50% above its 12-month low, a recession has always started.
          </p>
        </div>

        {/* Radar 4: Physical Energy Burden */}
        <div
          onClick={() => onSelectTab('physical')}
          className="apple-card apple-card-hover cursor-pointer p-5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Energy % World GDP
            </span>
            <Zap className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="font-mono-tabular text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {physData.energyMetrics.latestEnergyBurdenPctGdp.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Benign (Danger Zone: &gt;8.0%)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Brent crude at ${physData.energyMetrics.brentCrudeUsd}/bbl keeps global energy costs below the 8% recession tax line.
          </p>
        </div>
      </div>

      {/* 5 Story-Driven Analytical Missions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Choose a Guided Investigation
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              5 Big Questions That Drive the Global Economy
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click any investigation to open its interactive radar suite
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pillar 1 */}
          <div
            onClick={() => onSelectTab('regimes')}
            className="apple-card apple-card-hover group cursor-pointer p-5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  Mission 01 • 3 Models
                </span>
                <Compass className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="font-editorial text-lg font-bold text-emerald-600 dark:text-emerald-300">
                &ldquo;Are we heading into a boom or a recession?&rdquo;
              </p>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Regimes &amp; Business Cycle
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Explore Ray Dalio&apos;s 4-quadrant growth vs. inflation clock, real-time GDPNow, factory PMI orders, and the Sahm unemployment trigger.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 gap-1">
              <span>Launch Cycle Intelligence</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => onSelectTab('yields')}
            className="apple-card apple-card-hover group cursor-pointer p-5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30">
                  Mission 02 • 4 Models
                </span>
                <Activity className="h-4 w-4 text-sky-500" />
              </div>
              <p className="font-editorial text-lg font-bold text-sky-600 dark:text-sky-300">
                &ldquo;How do central banks create and drain money?&rdquo;
              </p>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Rates, Liquidity &amp; Debt
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  See why yield curves invert, how 3D interest rate surfaces evolve over 46 years, and how Fed liquidity drives markets.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 gap-1">
              <span>Launch Rates &amp; Plumbing</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => onSelectTab('credit')}
            className="apple-card apple-card-hover group cursor-pointer p-5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                  Mission 03 • 2 Models
                </span>
                <ShieldAlert className="h-4 w-4 text-rose-500" />
              </div>
              <p className="font-editorial text-lg font-bold text-rose-600 dark:text-rose-300">
                &ldquo;Are banks lending or slamming the brakes?&rdquo;
              </p>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Credit &amp; Market Structure
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Track corporate junk-bond spreads, bank loan officer tightening, and price assets in Gold or M2 instead of paper dollars.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 gap-1">
              <span>Launch Credit &amp; Ratios</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pillar 4 */}
          <div
            onClick={() => onSelectTab('housing')}
            className="apple-card apple-card-hover group cursor-pointer p-5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  Mission 04 • 3 Models
                </span>
                <Home className="h-4 w-4 text-amber-500" />
              </div>
              <p className="font-editorial text-lg font-bold text-amber-600 dark:text-amber-300">
                &ldquo;Why do houses and everyday life cost so much?&rdquo;
              </p>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Physical Economy &amp; Inflation
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Uncover the 30-year mortgage &ldquo;golden handcuffs&rdquo; lock-in effect, global oil burden, supply chains, and sticky shelter inflation.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 gap-1">
              <span>Launch Physical &amp; Inflation</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pillar 5 */}
          <div
            onClick={() => onSelectTab('external')}
            className="apple-card apple-card-hover group cursor-pointer p-5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                  Mission 05 • 2 Models
                </span>
                <Globe2 className="h-4 w-4 text-cyan-500" />
              </div>
              <p className="font-editorial text-lg font-bold text-cyan-600 dark:text-cyan-300">
                &ldquo;Is the US Dollar losing its global crown?&rdquo;
              </p>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  External Sector &amp; Events
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Inspect who buys US debt (TIC flows), currency overvaluation (BIS REER), and how economic data surprises move markets.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 gap-1">
              <span>Launch External &amp; Calendar</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
