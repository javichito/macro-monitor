'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { AssetEvolutionChart } from '../../components/assets/AssetEvolutionChart';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import { Layers, Home, Landmark, Coins } from 'lucide-react';

export default function AssetsPage() {
  const { selectedYear, currencyPerspective } = useApp();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#242b3d] pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 mb-3">
          <Layers className="h-3.5 w-3.5" />
          <span>Global Asset Allocation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Where is the World's Wealth Stored?
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Examine the composition of aggregate global assets across residential real estate, corporate equities, bonds, sovereign debt liabilities, and physical gold from 2000 through 2025.
        </p>
      </div>

      <TimelineControls />

      {/* Primary Asset Class Chart & Category Cards */}
      <AssetEvolutionChart
        currencyPerspective={currencyPerspective}
        selectedYear={selectedYear}
      />

      {/* Educational Explainers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlainEnglishCard
          title="Why is Real Estate consistently the largest asset class on Earth?"
          summary="Real estate accounts for nearly half of all global private wealth ($286T+ in 2025). Unlike paper securities, real estate fulfills a universal physical need: shelter."
          detail="Governments and central banks historically protect and subsidize mortgages through 30-year fixed loans, tax deductions, and zoning limits that constrain supply. As populations grow and urbanize, finite land values systematically compound."
          takeaway="For the bottom 90% of households, the primary residence represents over 70% of total family net worth."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="Tangible Assets vs Paper Financial Claims"
          summary="Tangible assets (land, buildings, gold) exist physically in the real world. Financial assets (stocks, bonds, cash) are contractual claims on future earnings."
          detail="During high-inflation eras (such as 2022-2023), tangible assets often retain purchasing power better because their replacement costs rise. During zero-interest-rate bull markets (such as 2010-2021), financial equities explode in valuation as borrowing costs hit floor levels."
          takeaway="A balanced civilization requires both productive physical land and fluid financial markets to allocate capital to innovations."
          defaultExpanded={false}
        />
      </div>
    </div>
  );
}
