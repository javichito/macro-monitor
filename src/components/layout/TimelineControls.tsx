'use client';

import React from 'react';
import { Play, Pause, RotateCcw, Clock, CheckCircle2, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HistoricalFlashpoint {
  year: number;
  tag: string;
  headline: string;
  lesson: string;
}

const HISTORICAL_FLASHPOINTS: HistoricalFlashpoint[] = [
  {
    year: 1980,
    tag: '1980 • Volcker Shock',
    headline: '20% Interest Rates Crush Runaway Inflation',
    lesson: 'Fed Chair Paul Volcker hiked rates to 20% to break double-digit 1970s stagflation—intentionally triggering a sharp recession to save the dollar.',
  },
  {
    year: 2000,
    tag: '2000 • Dot-Com Peak',
    headline: 'The First Internet Mania & Equity Bubble',
    lesson: 'Household stock ownership surged to record highs before the NASDAQ lost 78%, prompting the Fed to cut rates to 1% and inadvertently fuel the 2000s housing boom.',
  },
  {
    year: 2010,
    tag: '2010 • Post-GFC QE',
    headline: 'Zero Rates & Quantitative Easing Begin',
    lesson: 'After the 2008 Lehman collapse, central banks printed trillions in reserves. Asset owners recovered rapidly while median wage earners lagged behind.',
  },
  {
    year: 2020,
    tag: '2020 • Pandemic Surge',
    headline: '$10T+ Global Fiscal & Monetary Rescue',
    lesson: 'Lockdowns met unprecedented direct stimulus checks and 0% rates—sending M2 money supply up 27% and igniting a global home and stock boom.',
  },
  {
    year: 2022,
    tag: '2022 • Inflation Shock',
    headline: '40-Year Inflation Highs & Fastest Rate Hikes',
    lesson: 'Supply bottlenecks and stimulus collided with an energy shock, forcing central banks into their steepest rate-hiking cycle since 1981.',
  },
  {
    year: 2026,
    tag: '2026 • AI & Reflation',
    headline: 'Yield Curve Un-Inversion & Sovereign Debt Era',
    lesson: 'Today: Trillion-dollar sovereign deficits meet AI capex boom. Yield curves have un-inverted while the top 1% vs. median wealth gap remains near historic highs.',
  },
];

export function TimelineControls() {
  const {
    selectedYear,
    setSelectedYear,
    isPlayingTimeline,
    setIsPlayingTimeline,
    availableYears,
    unlockedEras,
  } = useApp();

  const getEraStory = (year: number): { title: string; takeaway: string } => {
    const exact = HISTORICAL_FLASHPOINTS.find((f) => f.year === year);
    if (exact) {
      return { title: exact.headline, takeaway: exact.lesson };
    }
    if (year <= 1995) {
      return {
        title: 'Fall of the Iron Curtain & Globalization Wave',
        takeaway: 'Billions of workers integrated into global trade, structurally lowering goods inflation for three decades.',
      };
    }
    if (year === 2005) {
      return {
        title: 'Peak Global Subprime Leverage',
        takeaway: 'Global real estate values soared on adjustable-rate mortgages just three years before the 2008 financial crisis.',
      };
    }
    if (year === 2015) {
      return {
        title: 'Zero-Interest-Rate World & Negative Sovereign Yields',
        takeaway: 'Over $10T of European and Japanese bonds traded at negative yields, pushing investors into equities and property.',
      };
    }
    return {
      title: 'Post-Tightening Soft Landing & Fiscal Dominance',
      takeaway: 'Central banks paused hikes as headline inflation cooled, even while sovereign debt service reached multidecade highs.',
    };
  };

  const currentIndex = availableYears.indexOf(selectedYear);
  const progressPercent = (currentIndex / (availableYears.length - 1)) * 100;
  const activeStory = getEraStory(selectedYear);

  return (
    <div className="apple-card p-4 sm:p-5 relative overflow-hidden transition-all duration-300">
      {/* Top Row: Time Machine Header + Era Story */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Time Machine
            </span>
          </div>
          <span className="font-mono-tabular text-sm font-extrabold px-3 py-0.5 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-200">
            {selectedYear}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
            {activeStory.title}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono-tabular text-slate-500 dark:text-slate-400">
          <Compass className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>
            Eras Explored: <strong className="text-slate-800 dark:text-slate-200">{unlockedEras.length}/{availableYears.length}</strong>
          </span>
        </div>
      </div>

      {/* Historical Flashpoint Quick-Jump Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-2 border-b border-slate-200/70 dark:border-white/[0.07]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
          Jump to Crisis / Boom:
        </span>
        {HISTORICAL_FLASHPOINTS.map((fp) => {
          const isSelected = fp.year === selectedYear;
          const isVisited = unlockedEras.includes(fp.year);
          return (
            <button
              key={fp.year}
              type="button"
              onClick={() => {
                setIsPlayingTimeline(false);
                setSelectedYear(fp.year);
              }}
              className={`tactile-button inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-amber-600 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/[0.10] hover:bg-slate-200 dark:hover:bg-white/[0.09]'
              }`}
            >
              {isVisited && !isSelected && (
                <CheckCircle2 className="h-3 w-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
              )}
              <span>{fp.tag}</span>
            </button>
          );
        })}
      </div>

      {/* Scrubber Controls */}
      <div className="flex items-center gap-3.5 mt-3">
        <button
          onClick={() => setIsPlayingTimeline((prev) => !prev)}
          className={`tactile-button flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 shadow-sm cursor-pointer ${
            isPlayingTimeline
              ? 'bg-amber-500 text-slate-950 border-amber-700'
              : 'bg-sky-500 text-white border-sky-700 hover:bg-sky-400'
          }`}
          title={isPlayingTimeline ? 'Pause timeline playback' : 'Play 46-year history'}
          aria-label={isPlayingTimeline ? 'Pause playback' : 'Play playback'}
        >
          {isPlayingTimeline ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5 fill-current" />}
        </button>

        {/* Range Scrubber */}
        <div className="relative flex-1 py-2 sm:py-1">
          <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 transition-all duration-150 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

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

          <div className="flex justify-between text-[11px] font-mono-tabular font-medium mt-2 px-1">
            {availableYears.map((yr) => {
              const isSelected = yr === selectedYear;
              const isPrimaryYear = yr === 1980 || yr === 2000 || yr === 2010 || yr === 2020 || yr === 2026;
              const hideOnMobile = !isPrimaryYear && !isSelected;

              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`transition-all duration-150 py-1 px-0.5 cursor-pointer ${
                    hideOnMobile ? 'hidden sm:inline-block' : 'inline-block'
                  } ${
                    isSelected
                      ? 'font-extrabold text-amber-600 dark:text-amber-400 scale-110 underline decoration-2 underline-offset-4'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsPlayingTimeline(false);
            setSelectedYear(2026);
          }}
          className="tactile-button flex items-center gap-1.5 text-xs font-mono-tabular font-semibold text-slate-700 dark:text-slate-200 px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-300 dark:border-white/[0.14] shrink-0 cursor-pointer"
          title="Reset to 2026"
          aria-label="Reset to 2026"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden sm:inline">Latest (2026)</span>
          <span className="sm:hidden text-[10px] font-semibold">2026</span>
        </button>
      </div>

      {/* Field Note Callout for Active Era */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/[0.06] flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-mono-tabular font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/25 shrink-0 mt-0.5">
          What Changed
        </span>
        <p className="leading-relaxed">{activeStory.takeaway}</p>
      </div>
    </div>
  );
}
