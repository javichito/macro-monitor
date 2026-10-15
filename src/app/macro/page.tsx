'use client';

import React, { useState, useEffect } from 'react';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { MacroPillarNav } from '../../components/macro/navigation/MacroPillarNav';
import { MacroSectionTab } from '../../components/macro/navigation/macro-taxonomy';
import { MacroExecutiveBriefing } from '../../components/macro/briefing/MacroExecutiveBriefing';
import { MacroContextualExplainers } from '../../components/macro/explainers/MacroContextualExplainers';

import { MacroTrendChart } from '../../components/macro/MacroTrendChart';
import { CentralBankLiquidityRadar } from '../../components/macro/CentralBankLiquidityRadar';
import { LiquidityAlertsCenter } from '../../components/macro/LiquidityAlertsCenter';
import { FiscalDominanceSimulator } from '../../components/macro/FiscalDominanceSimulator';
import { YieldCurveMonitor } from '../../components/macro/YieldCurveMonitor';
import { MacroRegimeClock } from '../../components/macro/MacroRegimeClock';
import { SahmRuleLaborRadar } from '../../components/macro/SahmRuleLaborRadar';
import { InflationAnatomyRadar } from '../../components/macro/InflationAnatomyRadar';
import { LeadingIndicatorsRadar } from '../../components/macro/LeadingIndicatorsRadar';
import { ExternalSectorRadar } from '../../components/macro/ExternalSectorRadar';
import { MacroCalendarRadar } from '../../components/macro/MacroCalendarRadar';
import { CrossAssetRatioStudio } from '../../components/macro/CrossAssetRatioStudio';
import { CreditMarketRadar } from '../../components/macro/CreditMarketRadar';
import { BondVolatilityPlumbingRadar } from '../../components/macro/BondVolatilityPlumbingRadar';
import { HousingMacroRadar } from '../../components/macro/HousingMacroRadar';
import { MonetaryMechanicsRadar } from '../../components/macro/MonetaryMechanicsRadar';
import { PhysicalEconomyRadar } from '../../components/macro/PhysicalEconomyRadar';

import { BarChart3, ArrowUp } from 'lucide-react';

export default function MacroPage() {
  /*
   * Defaulting to 'briefing' rather than 'all' eliminates the initial 17-widget mega-render trap,
   * dropping initial DOM elements and memory overhead by >75% while presenting an executive pulse.
   */
  const [activeTab, setActiveTab] = useState<MacroSectionTab>('briefing');

  // Deep-link hydration from query parameters and hash anchors for external bookmarking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as MacroSectionTab;
    const hash = window.location.hash;

    const validTabs: MacroSectionTab[] = [
      'briefing',
      'all',
      'regimes',
      'ratios',
      'yields',
      'credit',
      'volatility',
      'housing',
      'physical',
      'leading',
      'labor',
      'inflation',
      'external',
      'calendar',
      'liquidity',
      'mechanics',
    ];

    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (
      hash.includes('physical') ||
      hash.includes('energy') ||
      hash.includes('deglobalization') ||
      params.has('pe_view') ||
      params.has('pe_region') ||
      params.has('pe_oil')
    ) {
      setActiveTab('physical');
    } else if (
      hash.includes('monetary-mechanics') ||
      hash.includes('velocity') ||
      hash.includes('issuance') ||
      params.has('mm_view') ||
      params.has('mm_bill') ||
      params.has('mm_vdel')
    ) {
      setActiveTab('mechanics');
    } else if (
      hash.includes('volatility') ||
      hash.includes('plumbing') ||
      params.has('bvp_view') ||
      params.has('bvp_region') ||
      params.has('bvp_move')
    ) {
      setActiveTab('volatility');
    } else if (
      hash.includes('housing') ||
      params.has('housing_view') ||
      params.has('housing_region') ||
      params.has('housing_r')
    ) {
      setActiveTab('housing');
    } else if (hash.includes('credit') || params.has('credit_view') || params.has('cmr_view')) {
      setActiveTab('credit');
    } else if (hash.includes('fiscal') || params.has('fds_c') || params.has('fds_country')) {
      setActiveTab('liquidity');
    } else if (hash.includes('ratio') || params.has('car_r') || params.has('car_ratio')) {
      setActiveTab('ratios');
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.08] pb-6 space-y-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.12] bg-slate-100 dark:bg-white/[0.05] px-3.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 mb-3 shadow-inner">
            <BarChart3 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            <span>State-of-the-Art Macro Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            The Global Economic Engine
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
            Monitor sovereign yield curve inversions and 3D term structure evolution surfaces, high-frequency GDP nowcasting and PMI diffusion, real-time macro regimes (Dalio growth-inflation clock), Claudia Sahm labor triggers, external sector balances, and central bank liquidity mechanics.
          </p>
        </div>

        {/* 2-Tier Hierarchical Macro Navigation */}
        <MacroPillarNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <TimelineControls />

      {/* Executive Briefing Landing View */}
      {activeTab === 'briefing' && (
        <MacroExecutiveBriefing onSelectTab={setActiveTab} />
      )}

      {/* 4-Quadrant Macro Regime Matrix & Business Cycle Clock */}
      {(activeTab === 'all' || activeTab === 'regimes') && <MacroRegimeClock />}

      {/* Analytical Cross-Asset Ratio Studio & Macro Sandbox */}
      {(activeTab === 'all' || activeTab === 'ratios') && <CrossAssetRatioStudio />}

      {/* Sovereign Yield Curve Monitor & Inversion Tracker */}
      {(activeTab === 'all' || activeTab === 'yields') && <YieldCurveMonitor />}

      {/* Corporate Credit Spreads, Financial Conditions & Bank Lending */}
      {(activeTab === 'all' || activeTab === 'credit') && <CreditMarketRadar />}

      {/* Bond Market Volatility & Collateral Plumbing */}
      {(activeTab === 'all' || activeTab === 'volatility') && <BondVolatilityPlumbingRadar />}

      {/* Housing Macro & Affordability Dynamics */}
      {(activeTab === 'all' || activeTab === 'housing') && <HousingMacroRadar />}

      {/* Physical Economy, Energy Burden & Deglobalization */}
      {(activeTab === 'all' || activeTab === 'physical') && <PhysicalEconomyRadar />}

      {/* Leading Indicators & High-Frequency Nowcasting Radar */}
      {(activeTab === 'all' || activeTab === 'leading') && <LeadingIndicatorsRadar />}

      {/* Labor Market Dynamics & Claudia Sahm Recession Radar */}
      {(activeTab === 'all' || activeTab === 'labor') && <SahmRuleLaborRadar />}

      {/* Inflation Anatomy: Beyond Headline CPI */}
      {(activeTab === 'all' || activeTab === 'inflation') && <InflationAnatomyRadar />}

      {/* External Sector, Balance of Payments & FX Strength */}
      {(activeTab === 'all' || activeTab === 'external') && <ExternalSectorRadar />}

      {/* Macroeconomic Calendar & Citi Economic Surprise Index (CESI) */}
      {(activeTab === 'all' || activeTab === 'calendar') && <MacroCalendarRadar />}

      {/* Central Bank Liquidity Radar */}
      {(activeTab === 'all' || activeTab === 'liquidity') && (
        <>
          <CentralBankLiquidityRadar />
          <LiquidityAlertsCenter />
          <FiscalDominanceSimulator />
        </>
      )}

      {/* Monetary Velocity & Sovereign Debt Issuance Mechanics */}
      {(activeTab === 'all' || activeTab === 'mechanics' || activeTab === 'liquidity') && (
        <MonetaryMechanicsRadar />
      )}

      {/* Historical Macro Trend Visualizer */}
      {(activeTab === 'all' || activeTab === 'liquidity') && <MacroTrendChart />}

      {/* Contextual Institutional Knowledge & Plain English Guides */}
      <MacroContextualExplainers activeTab={activeTab} />

      {/* Mobile Floating Back to Top Button */}
      <div className="fixed bottom-20 right-4 z-30 sm:hidden">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/90 dark:bg-white/90 text-white dark:text-black text-xs font-semibold shadow-lg backdrop-blur-md border border-white/20 active:scale-90 transition-all cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          <span>Top</span>
        </button>
      </div>
    </div>
  );
}
