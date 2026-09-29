'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { MacroTrendChart } from '../../components/macro/MacroTrendChart';
import { CentralBankLiquidityRadar } from '../../components/macro/CentralBankLiquidityRadar';
import { LiquidityAlertsCenter } from '../../components/macro/LiquidityAlertsCenter';
import { FiscalDominanceSimulator } from '../../components/macro/FiscalDominanceSimulator';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { BarChart3 } from 'lucide-react';

export default function MacroPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1 text-xs font-medium text-slate-200 mb-3 shadow-inner">
          <BarChart3 className="h-3.5 w-3.5 text-sky-400" />
          <span>Macroeconomic Cycles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          The Global Economic Engine
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
          Observe how the world's debt burden expanded to $324 Trillion, how central bank interest rate decisions ripple across the globe, and how sovereign currency reserves are shifting.
        </p>
      </div>

      <TimelineControls />

      {/* Main Macro Trend Visualizer */}
      <MacroTrendChart />

      {/* Global Central Bank Liquidity Radar */}
      <CentralBankLiquidityRadar />

      {/* Live Liquidity Alerts & Fed Triggers Center */}
      <LiquidityAlertsCenter />

      {/* Sovereign Fiscal Dominance & Debt Spiral Simulator */}
      <FiscalDominanceSimulator />

      {/* Plain English Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlainEnglishCard
          title="What is the Debt Supercycle?"
          summary="In 1980, world debt was $19.5 Trillion. By 2026, it crossed $334 Trillion. Debt grew over 17x while real economic production only grew ~10.9x."
          detail="Debt allows governments, companies, and people to pull future consumption into the present. However, as debt-to-GDP levels climb beyond 250%, more income must be spent simply servicing interest payments rather than investing in new infrastructure or productivity."
          takeaway="Global debt cannot be eliminated quickly without severe deflation; instead, economies attempt to 'inflate away' the real burden over decades."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="Why do Central Bank interest rates affect every household?"
          summary="The Federal Reserve and European Central Bank set the 'wholesale price of money'. When benchmark rates go up, mortgages, car loans, and credit card rates rise immediately."
          detail="Higher rates make borrowing more expensive, which slows spending and forces inflation down. Lower rates encourage businesses to hire and consumers to buy homes, but risk sparking asset bubbles and inflation."
          takeaway="Tracking central bank interest rates gives everyday citizens early foresight into job security, mortgage affordability, and stock market trajectories."
          defaultExpanded={false}
        />
      </div>
    </div>
  );
}
