'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { MacroTrendChart } from '../../components/macro/MacroTrendChart';
import { CentralBankLiquidityRadar } from '../../components/macro/CentralBankLiquidityRadar';
import { LiquidityAlertsCenter } from '../../components/macro/LiquidityAlertsCenter';
import { FiscalDominanceSimulator } from '../../components/macro/FiscalDominanceSimulator';
import { YieldCurveMonitor } from '../../components/macro/YieldCurveMonitor';
import { MacroRegimeClock } from '../../components/macro/MacroRegimeClock';
import { SahmRuleLaborRadar } from '../../components/macro/SahmRuleLaborRadar';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import {
  BarChart3,
  Compass,
  Activity,
  Users,
  Landmark,
  Layers,
} from 'lucide-react';

type MacroSectionTab = 'all' | 'regimes' | 'yields' | 'labor' | 'liquidity';

export default function MacroPage() {
  const [activeTab, setActiveTab] = useState<MacroSectionTab>('all');

  // Deep-link hydration from query parameters for external bookmarking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as MacroSectionTab;
    if (tabParam && ['all', 'regimes', 'yields', 'labor', 'liquidity'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.12] bg-slate-100 dark:bg-white/[0.05] px-3.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 mb-3 shadow-inner">
            <BarChart3 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            <span>State-of-the-Art Macro Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            The Global Economic Engine
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
            Monitor sovereign yield curve inversions, real-time macro regimes (Dalio growth-inflation clock), Claudia Sahm labor recession triggers, and central bank liquidity mechanics.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center rounded-full p-1 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] shadow-inner text-xs self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <span>All Intelligence</span>
          </button>
          <button
            onClick={() => setActiveTab('regimes')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'regimes'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Regimes</span>
          </button>
          <button
            onClick={() => setActiveTab('yields')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'yields'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            <span>Yield Curves</span>
          </button>
          <button
            onClick={() => setActiveTab('labor')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'labor'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Sahm &amp; Labor</span>
          </button>
          <button
            onClick={() => setActiveTab('liquidity')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'liquidity'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Landmark className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Liquidity &amp; Fiscal</span>
          </button>
        </div>
      </div>

      <TimelineControls />

      {/* 4-Quadrant Macro Regime Matrix & Business Cycle Clock */}
      {(activeTab === 'all' || activeTab === 'regimes') && <MacroRegimeClock />}

      {/* Sovereign Yield Curve Monitor & Inversion Tracker */}
      {(activeTab === 'all' || activeTab === 'yields') && <YieldCurveMonitor />}

      {/* Labor Market Dynamics & Claudia Sahm Recession Radar */}
      {(activeTab === 'all' || activeTab === 'labor') && <SahmRuleLaborRadar />}

      {/* Central Bank Liquidity Radar */}
      {(activeTab === 'all' || activeTab === 'liquidity') && (
        <>
          <CentralBankLiquidityRadar />
          <LiquidityAlertsCenter />
          <FiscalDominanceSimulator />
        </>
      )}

      {/* Historical Macro Trend Visualizer */}
      {(activeTab === 'all' || activeTab === 'liquidity') && <MacroTrendChart />}

      {/* Plain English Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlainEnglishCard
          title="Why does an Inverted Yield Curve predict recessions?"
          summary="Normally, investors demand higher interest to lock up money for 10 years than for 3 months. When this flips, the curve 'inverts'."
          detail="Yield curve inversions happen when central banks tighten short-term interest rates aggressively to break inflation, while bond investors foresee growth stalling and buy long bonds to lock in safe yields. Every US recession since 1955 was preceded by an inversion."
          takeaway="Pay closest attention when the curve 'un-inverts' (re-steepens), as that transition historically marks the onset of recessions as rate cuts begin."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="How does the 4-Quadrant Regime dictate asset returns?"
          summary="Asset prices are discounted claims on future cash flows. Their performance depends on whether Growth and Inflation are accelerating or decelerating."
          detail="In Goldilocks (Growth Up, Inflation Down), equities and tech surge. In Reflation (Growth Up, Inflation Up), commodities and real estate lead. In Stagflation (Growth Down, Inflation Up), physical gold and cash outperform. In Deflation (Growth Down, Inflation Down), long Treasuries protect capital."
          takeaway="Identifying an economy's active quadrant provides immediate clarity on why specific asset classes are winning or losing."
          defaultExpanded={false}
        />

        <PlainEnglishCard
          title="What is the Claudia Sahm Rule, and why is 0.50% the golden threshold?"
          summary="Invented by Federal Reserve economist Claudia Sahm, this rule identifies the precise moment a cooling labor market turns into a recessionary cascade."
          detail="When the 3-month average unemployment rate rises +0.50% above its minimum over the prior 12 months, a recession has begun. It works because job cuts cause workers to cut spending, reducing revenues for businesses who then lay off more workers in a self-reinforcing cycle."
          takeaway="Unlike GDP which is reported months late with major revisions, the Sahm Rule relies on immediate monthly payroll data with zero historical false alarms."
          defaultExpanded={false}
        />
      </div>
    </div>
  );
}
