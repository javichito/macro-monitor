'use client';

import React from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function TimelineControls() {
  const {
    selectedYear,
    setSelectedYear,
    isPlayingTimeline,
    setIsPlayingTimeline,
    availableYears,
  } = useApp();

  const getEraLabel = (year: number) => {
    if (year <= 1985) return 'Late Cold War & Volcker Anti-Inflation Tightening';
    if (year <= 1995) return 'Fall of Iron Curtain & Globalization Acceleration';
    if (year <= 2005) return 'Dot-Com Expansion & Pre-2008 Housing Cycle';
    if (year <= 2015) return 'Great Financial Crisis & Quantitative Easing (QE)';
    if (year <= 2022) return 'Pandemic Fiscal Surge & Global Inflation Shock';
    return 'Present Day (2024–2026): Post-Tightening Easing & Tech Cycle';
  };

  const currentIndex = availableYears.indexOf(selectedYear);
  const progressPercent = (currentIndex / (availableYears.length - 1)) * 100;

  return (
    <div className="apple-card p-4 sm:p-5 relative overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] shadow-inner">
            <Clock className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Timeline Scrubber
            </span>
          </div>
          <span className="text-sm font-bold px-3 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 text-sky-800 dark:text-sky-200 shadow-sm">
            {selectedYear}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {getEraLabel(selectedYear)}
        </p>
      </div>

      <div className="flex items-center gap-3.5">
        {/* Apple Music style tactile playback button */}
        <button
          onClick={() => setIsPlayingTimeline((prev) => !prev)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200 shadow-md active:scale-95 ${
            isPlayingTimeline
              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
              : 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-105'
          }`}
          title={isPlayingTimeline ? 'Pause timeline playback' : 'Play historical evolution'}
          aria-label={isPlayingTimeline ? 'Pause playback' : 'Play playback'}
        >
          {isPlayingTimeline ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5 fill-current" />}
        </button>

        {/* Custom Apple-styled range scrubber with generous touch targets */}
        <div className="relative flex-1 py-2 sm:py-1">
          <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
            {/* Active progress fill */}
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-150 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Expanded 40px touch hit-box to ensure thumbs scrub smoothly on mobile without mis-taps */}
          <input
            type="range"
            min={0}
            max={availableYears.length - 1}
            value={currentIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedYear(availableYears[idx]);
            }}
            className="absolute inset-x-0 -top-2.5 -bottom-2.5 h-10 w-full opacity-0 cursor-pointer touch-none"
            aria-label="Select timeline year"
          />

          {/* Year ticks: condensed on mobile to prevent overlapping */}
          <div className="flex justify-between text-[11px] font-medium mt-2 px-1">
            {availableYears.map((yr, idx) => {
              const isSelected = yr === selectedYear;
              // On small screens, hide dense interim years unless currently selected
              const isPrimaryYear = yr === 1980 || yr === 2000 || yr === 2010 || yr === 2020 || yr === 2026;
              const hideOnMobile = !isPrimaryYear && !isSelected;

              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`transition-all duration-150 py-1 px-0.5 ${
                    hideOnMobile ? 'hidden sm:inline-block' : 'inline-block'
                  } ${
                    isSelected ? 'font-bold text-sky-600 dark:text-sky-400 scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset to present button: Apple glass pill with mobile-responsive label */}
        <button
          onClick={() => {
            setIsPlayingTimeline(false);
            setSelectedYear(2026);
          }}
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 sm:px-3.5 py-2 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.10] hover:border-slate-300 dark:hover:border-white/[0.20] transition-all shadow-sm active:scale-95 shrink-0"
          title="Reset to 2026"
          aria-label="Reset to 2026"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden sm:inline">Latest (2026)</span>
          <span className="sm:hidden text-[10px] font-semibold">2026</span>
        </button>
      </div>
    </div>
  );
}
