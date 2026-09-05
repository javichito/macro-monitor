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

  return (
    <div className="rounded-xl border border-[#242b3d] bg-[#12151e]/80 p-3.5 sm:p-4 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Timeline Engine
          </span>
          <span className="text-sm font-bold text-white px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {selectedYear}
          </span>
        </div>
        <p className="text-xs text-slate-400 italic">
          {getEraLabel(selectedYear)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Playback trigger */}
        <button
          onClick={() => setIsPlayingTimeline((prev) => !prev)}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            isPlayingTimeline
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
          }`}
          title={isPlayingTimeline ? 'Pause timeline playback' : 'Play historical evolution'}
          aria-label={isPlayingTimeline ? 'Pause playback' : 'Play playback'}
        >
          {isPlayingTimeline ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
        </button>

        {/* Range slider */}
        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={availableYears.length - 1}
            value={availableYears.indexOf(selectedYear)}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedYear(availableYears[idx]);
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400 focus:outline-none"
            aria-label="Select timeline year"
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1 px-1">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`transition-colors hover:text-white ${
                  yr === selectedYear ? 'font-bold text-emerald-400' : ''
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Reset to present */}
        <button
          onClick={() => {
            setIsPlayingTimeline(false);
            setSelectedYear(2026);
          }}
          className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50"
          title="Reset to 2026"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Latest (2026)</span>
        </button>
      </div>
    </div>
  );
}
