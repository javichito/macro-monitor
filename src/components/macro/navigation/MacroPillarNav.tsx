'use client';

import React from 'react';
import {
  MACRO_PILLARS,
  MacroPillarId,
  MacroSectionTab,
  getPillarForSubTab,
} from './macro-taxonomy';
import { Layers } from 'lucide-react';

interface MacroPillarNavProps {
  activeTab: MacroSectionTab;
  onTabChange: (tab: MacroSectionTab) => void;
}

/*
 * Provides a 2-tier hierarchical navigation structure for the Macro Observatory.
 * Tier 1 clusters analytical concepts into 5 institutional pillars (Miller's 7±2 rule),
 * while Tier 2 reveals the specific quantitative radars within that domain.
 */
export function MacroPillarNav({ activeTab, onTabChange }: MacroPillarNavProps) {
  const activePillarId = getPillarForSubTab(activeTab);
  const currentPillar = MACRO_PILLARS.find((p) => p.id === activePillarId);

  const handlePillarSelect = (pillarId: MacroPillarId) => {
    if (pillarId === 'briefing') {
      onTabChange('briefing');
      return;
    }
    if (pillarId === 'all') {
      onTabChange('all');
      return;
    }

    const pillar = MACRO_PILLARS.find((p) => p.id === pillarId);
    if (pillar && pillar.subTabs.length > 0) {
      // Default to the first sub-tab of the selected pillar
      onTabChange(pillar.subTabs[0].id);
    }
  };

  return (
    <div className="space-y-3">
      {/* Tier 1: Primary Macro Pillars */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar scroll-mask-x sm:[mask-image:none] -mx-4 px-4 sm:mx-0 sm:px-0 pt-1">
        <div className="inline-flex items-center gap-1.5 rounded-2xl p-1.5 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] shadow-inner text-xs whitespace-nowrap">
          {MACRO_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activePillarId === pillar.id && activeTab !== 'all';

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => handlePillarSelect(pillar.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                }`}
                title={pillar.description}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-sky-500 dark:text-sky-600' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="hidden sm:inline">{pillar.label}</span>
                <span className="sm:hidden">{pillar.shortLabel}</span>
              </button>
            );
          })}

          {/* Explicit "All Intelligence" Dossier Option */}
          <div className="h-4 w-px bg-slate-300 dark:bg-white/10 mx-1" />
          <button
            type="button"
            onClick={() => onTabChange('all')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-medium transition-all cursor-pointer text-xs ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
            }`}
            title="Comprehensive Dossier: Render all models simultaneously for complete cross-section export"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All</span>
          </button>
        </div>
      </div>

      {/* Tier 2: Contextual Sub-metrics for the active pillar */}
      {currentPillar && currentPillar.subTabs.length > 0 && activeTab !== 'all' && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1">
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider shrink-0 pl-1">
            Focus:
          </span>
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] text-xs">
            {currentPillar.subTabs.map((subTab) => {
              const SubIcon = subTab.icon;
              const isSubActive = activeTab === subTab.id;

              return (
                <button
                  key={subTab.id}
                  type="button"
                  onClick={() => onTabChange(subTab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-white/[0.03]'
                  }`}
                  title={subTab.description}
                >
                  <SubIcon className="h-3 w-3" />
                  <span>{subTab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
