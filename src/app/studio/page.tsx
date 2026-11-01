'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { CustomGraphBuilderStudio } from '../../components/studio/CustomGraphBuilderStudio';
import { UNIVERSAL_METRICS_CATALOG } from '../../data/universal-metrics-catalog';
import { COUNTRIES_DATA } from '../../data/country-metrics';

export default function GraphStudioPage() {
  const { currencyPerspective } = useApp();

  return (
    <div className="space-y-8">
      {/* Chapter 06 Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-slate-200 dark:border-white/[0.09]">
        <div className="flex-1 min-w-0">
          <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono-tabular text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">
              Field Guide • Chapter 06
            </span>
            <span aria-hidden="true">•</span>
            <span>Universal Metric &amp; Custom Graph Lab</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Can You Connect the Dots Across the World Economy?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 max-w-3xl font-normal leading-relaxed">
            Combine any of the{' '}
            <strong className="font-mono-tabular text-slate-900 dark:text-white">
              {UNIVERSAL_METRICS_CATALOG.length} core indicators
            </strong>{' '}
            and{' '}
            <strong className="font-mono-tabular text-slate-900 dark:text-white">
              {COUNTRIES_DATA.length} sovereign economies
            </strong>{' '}
            into your own custom multi-axis charts, ratios, and scatter plots. Test lead-lag transmission, check Pearson correlations, and pin your discoveries to your personal graph board.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] text-xs text-slate-600 dark:text-slate-300 self-start md:self-auto font-mono-tabular">
          <span>Valuation Lens:</span>
          <span className="font-bold text-sky-600 dark:text-sky-300 uppercase tracking-wider">
            {currencyPerspective} USD
          </span>
        </div>
      </div>

      {/* Interactive Economic Time Machine */}
      <TimelineControls />

      {/* Universal Metric & Custom Graph Builder Studio */}
      <CustomGraphBuilderStudio />
    </div>
  );
}
