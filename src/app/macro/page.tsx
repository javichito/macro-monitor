'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { MacroTrendChart } from '../../components/macro/MacroTrendChart';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { BarChart3 } from 'lucide-react';

export default function MacroPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#242b3d] pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Macroeconomic Cycles</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          The Global Economic Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Observe how the world's debt burden expanded to $324 Trillion, how central bank interest rate decisions ripple across the globe, and how sovereign currency reserves are shifting.
        </p>
      </div>

      <TimelineControls />

      {/* Main Macro Trend Visualizer */}
      <MacroTrendChart />

      {/* Plain English Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlainEnglishCard
          title="What is the Debt Supercycle?"
          summary="In 2000, world debt was $84 Trillion. By 2025, it crossed $324 Trillion. Debt grew nearly 4x while real economic production only grew ~3.4x."
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
