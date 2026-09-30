'use client';

import React, { useState } from 'react';
import {
  ECONOMY_REGIME_POINTS,
  REGIME_PLAYBOOKS,
} from '../../data/macro-regimes-data';
import { MacroQuadrant } from '../../lib/types';
import {
  Compass,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export function MacroRegimeClock() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('USA');
  const [showHistoricalTrail, setShowHistoricalTrail] = useState<boolean>(true);
  const [activeQuadrantTab, setActiveQuadrantTab] = useState<MacroQuadrant>('goldilocks');

  const selectedEconomy =
    ECONOMY_REGIME_POINTS.find((e) => e.code === selectedCountryCode) ||
    ECONOMY_REGIME_POINTS[0];

  // Helper to convert -100..+100 momentum coordinates to 0..100% CSS positioning
  const coordToPercent = (val: number) => {
    // 0 is centered at 50%, -100 is 6%, +100 is 94%
    return 50 + (val / 100) * 44;
  };

  const activePlaybook = REGIME_PLAYBOOKS[activeQuadrantTab];

  return (
    <div className="apple-card p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <Compass className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Macro Regime Matrix &amp; Business Cycle Clock
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] text-slate-700 dark:text-slate-200">
              Dalio / 4-Quadrant Framework
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
            Macro returns are dictated by two fundamental forces: growth relative to expectations and inflation relative to expectations. Track where major global economies sit on the growth-inflation matrix.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Economy Selector */}
          <div className="flex rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] p-1 text-xs">
            {ECONOMY_REGIME_POINTS.map((e) => (
              <button
                key={e.code}
                onClick={() => {
                  setSelectedCountryCode(e.code);
                  setActiveQuadrantTab(e.currentCoordinates.quadrant);
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                  selectedCountryCode === e.code
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <span>{e.flag}</span>
                <span>{e.code}</span>
              </button>
            ))}
          </div>

          {/* Historical Trail Toggle */}
          <button
            onClick={() => setShowHistoricalTrail(!showHistoricalTrail)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              showHistoricalTrail
                ? 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/10 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Trail {showHistoricalTrail ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Main 2D Matrix Canvas with high-contrast light and dark palettes */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[460px] rounded-2xl bg-slate-50/90 dark:bg-black/40 border border-slate-200 dark:border-white/[0.10] overflow-hidden p-4 sm:p-6 select-none shadow-sm dark:shadow-inner">
        {/* Quadrant Background Panels */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {/* Top Left: Stagflation */}
          <div
            onClick={() => setActiveQuadrantTab('stagflation')}
            className={`border-r border-b border-slate-200/80 dark:border-white/[0.08] transition-all p-3 sm:p-4 cursor-pointer flex flex-col justify-start items-start ${
              activeQuadrantTab === 'stagflation'
                ? 'bg-rose-100/70 dark:bg-rose-500/[0.14] ring-1 ring-inset ring-rose-400/40'
                : 'bg-rose-50/40 dark:bg-rose-500/[0.03] hover:bg-rose-100/50 dark:hover:bg-white/[0.02]'
            }`}
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Quadrant 3: Stagflation
            </span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 hidden sm:inline">
              Growth Decelerating (▼) • Inflation Accelerating (▲)
            </span>
          </div>

          {/* Top Right: Reflation */}
          <div
            onClick={() => setActiveQuadrantTab('reflation')}
            className={`border-b border-slate-200/80 dark:border-white/[0.08] transition-all p-3 sm:p-4 cursor-pointer flex flex-col justify-start items-end text-right ${
              activeQuadrantTab === 'reflation'
                ? 'bg-amber-100/70 dark:bg-amber-500/[0.14] ring-1 ring-inset ring-amber-400/40'
                : 'bg-amber-50/40 dark:bg-amber-500/[0.03] hover:bg-amber-100/50 dark:hover:bg-white/[0.02]'
            }`}
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Quadrant 2: Reflation
            </span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 hidden sm:inline">
              Growth Accelerating (▲) • Inflation Accelerating (▲)
            </span>
          </div>

          {/* Bottom Left: Deflation */}
          <div
            onClick={() => setActiveQuadrantTab('deflation')}
            className={`border-r border-slate-200/80 dark:border-white/[0.08] transition-all p-3 sm:p-4 cursor-pointer flex flex-col justify-end items-start ${
              activeQuadrantTab === 'deflation'
                ? 'bg-indigo-100/70 dark:bg-indigo-500/[0.14] ring-1 ring-inset ring-indigo-400/40'
                : 'bg-indigo-50/40 dark:bg-indigo-500/[0.03] hover:bg-indigo-100/50 dark:hover:bg-white/[0.02]'
            }`}
          >
            <span className="text-[10px] text-slate-600 dark:text-slate-400 hidden sm:inline">
              Growth Decelerating (▼) • Inflation Decelerating (▼)
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Quadrant 4: Deflation
            </span>
          </div>

          {/* Bottom Right: Goldilocks */}
          <div
            onClick={() => setActiveQuadrantTab('goldilocks')}
            className={`transition-all p-3 sm:p-4 cursor-pointer flex flex-col justify-end items-end text-right ${
              activeQuadrantTab === 'goldilocks'
                ? 'bg-emerald-100/70 dark:bg-emerald-500/[0.14] ring-1 ring-inset ring-emerald-400/40'
                : 'bg-emerald-50/40 dark:bg-emerald-500/[0.03] hover:bg-emerald-100/50 dark:hover:bg-white/[0.02]'
            }`}
          >
            <span className="text-[10px] text-slate-600 dark:text-slate-400 hidden sm:inline">
              Growth Accelerating (▲) • Inflation Decelerating (▼)
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Quadrant 1: Goldilocks
            </span>
          </div>
        </div>

        {/* Center Crosshairs */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-300 dark:bg-white/[0.18] pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-300 dark:bg-white/[0.18] pointer-events-none" />

        {/* Axis Labels */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-black/75 border border-slate-300/80 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm pointer-events-none z-10 backdrop-blur-md">
          ▲ Inflation Accelerating
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-black/75 border border-slate-300/80 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm pointer-events-none z-10 backdrop-blur-md">
          ▼ Inflation Decelerating
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-white/95 dark:bg-black/75 border border-slate-300/80 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm pointer-events-none z-10 backdrop-blur-md">
          ◄ Growth Slowing
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-white/95 dark:bg-black/75 border border-slate-300/80 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm pointer-events-none z-10 backdrop-blur-md">
          Growth Expanding ►
        </div>

        {/* SVG Historical Trajectory Paths */}
        {showHistoricalTrail && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {ECONOMY_REGIME_POINTS.map((economy) => {
              const isSelected = economy.code === selectedCountryCode;
              const points = economy.historicalTrail.map((h) => ({
                x: `${coordToPercent(h.coordinates.growthMomentum)}%`,
                y: `${100 - coordToPercent(h.coordinates.inflationMomentum)}%`,
                year: h.year,
              }));

              return (
                <g key={`trail-${economy.code}`} opacity={isSelected ? 1 : 0.25}>
                  {points.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 4 : 2}
                      className={
                        isSelected
                          ? 'fill-sky-600 dark:fill-sky-400'
                          : 'fill-slate-400/60 dark:fill-white/30'
                      }
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        )}

        {/* Active Economy Pucks */}
        {ECONOMY_REGIME_POINTS.map((economy) => {
          const isSelected = economy.code === selectedCountryCode;
          const leftPercent = coordToPercent(economy.currentCoordinates.growthMomentum);
          const topPercent = 100 - coordToPercent(economy.currentCoordinates.inflationMomentum);

          return (
            <button
              key={economy.code}
              onClick={() => {
                setSelectedCountryCode(economy.code);
                setActiveQuadrantTab(economy.currentCoordinates.quadrant);
              }}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-sky-600 text-white ring-4 ring-sky-400/40 shadow-lg scale-110 z-30 dark:bg-white dark:text-black dark:ring-sky-400/40'
                  : 'bg-white/95 text-slate-800 border border-slate-300 shadow-sm hover:scale-105 opacity-95 hover:opacity-100 dark:bg-slate-900/90 dark:text-white dark:border-white/20'
              }`}
            >
              <span>{economy.flag}</span>
              <span className="text-[11px] font-extrabold">{economy.code}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Economy Detail & Asset Class Playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Country Status Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedEconomy.flag}</span>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {selectedEconomy.name} Macro Posture
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedEconomy.currentCoordinates.label}
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                REGIME_PLAYBOOKS[selectedEconomy.currentCoordinates.quadrant].themeClasses.badge
              }`}
            >
              {selectedEconomy.currentCoordinates.quadrant}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedEconomy.currentCoordinates.description}
          </p>

          <div className="flex items-center gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/[0.06]">
            <div>
              Growth Momentum:{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedEconomy.currentCoordinates.growthMomentum > 0 ? '+' : ''}
                {selectedEconomy.currentCoordinates.growthMomentum}
              </span>
            </div>
            <div>
              Inflation Momentum:{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedEconomy.currentCoordinates.inflationMomentum > 0 ? '+' : ''}
                {selectedEconomy.currentCoordinates.inflationMomentum}
              </span>
            </div>
          </div>
        </div>

        {/* Asset Class Playbook Card */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-colors ${activePlaybook.themeClasses.panel}`}
        >
          <div className="flex items-center justify-between">
            <h4
              className={`text-base font-bold tracking-tight flex items-center gap-2 ${activePlaybook.themeClasses.title}`}
            >
              <Layers className="h-4 w-4" />
              <span>{activePlaybook.label} Playbook</span>
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Historical Asset Matrix
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {activePlaybook.macroEnvironment}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Favorable Assets */}
            <div className="space-y-1.5">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${activePlaybook.themeClasses.favorableText}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Favorable Assets
              </span>
              <ul className="space-y-1">
                {activePlaybook.favorableAssetClasses.map((asset, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${activePlaybook.themeClasses.bullet}`}
                    />
                    {asset}
                  </li>
                ))}
              </ul>
            </div>

            {/* Headwind Assets */}
            <div className="space-y-1.5">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${activePlaybook.themeClasses.headwindText}`}
              >
                <XCircle className="h-3.5 w-3.5" /> Macro Headwinds
              </span>
              <ul className="space-y-1">
                {activePlaybook.headwindAssetClasses.map((asset, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    {asset}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
