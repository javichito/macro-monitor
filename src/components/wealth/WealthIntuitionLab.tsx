'use client';

import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Sparkles, Sliders } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { useApp } from '../../context/AppContext';

interface WealthIntuitionLabProps {
  selectedYear: number;
  medianWealthUsd: number;
  meanWealthUsd: number;
  adultPopulationBillions: number;
}

/*
 * Predict-First Interactive Learning Widget (NYT Upshot / Brilliant.org pattern).
 * Asking learners to commit to a prediction before revealing the empirical distribution
 * creates cognitive dissonance that makes the median vs. mean disparity unforgettable.
 */
export function WealthIntuitionLab({
  selectedYear,
  medianWealthUsd,
  meanWealthUsd,
  adultPopulationBillions,
}: WealthIntuitionLabProps) {
  const [guessUsd, setGuessUsd] = useState<number>(45000);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  let completedChallenges: string[] = [];
  let markChallengeCompleted: ((id: string) => void) | undefined;
  try {
    const app = useApp();
    completedChallenges = app.completedChallenges;
    markChallengeCompleted = app.markChallengeCompleted;
  } catch {
    // Standalone test fallback
  }

  const challengeId = 'intuition-median-wealth';
  const isCompleted = completedChallenges.includes(challengeId);

  const handleLockGuess = () => {
    setIsRevealed(true);
    if (markChallengeCompleted) {
      markChallengeCompleted(challengeId);
    }
  };

  const maxScale = Math.max(meanWealthUsd * 1.25, guessUsd * 1.1, 120000);
  const medianPct = Math.min(100, Math.max(3, (medianWealthUsd / maxScale) * 100));
  const meanPct = Math.min(100, Math.max(5, (meanWealthUsd / maxScale) * 100));
  const guessPct = Math.min(100, Math.max(3, (guessUsd / maxScale) * 100));

  const errorRatio = guessUsd / Math.max(1, medianWealthUsd);
  const isClose = Math.abs(guessUsd - medianWealthUsd) <= medianWealthUsd * 0.35;

  return (
    <div className="apple-card p-5 sm:p-7 relative overflow-hidden border-amber-500/30 dark:border-amber-400/25">
      {/* Top interactive laboratory stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400" />

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left column: The Question & Interactive Slider */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-mono-tabular text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              <Sliders className="h-3 w-3" />
              Interactive Intuition Lab
            </span>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 font-mono-tabular text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Completed (+15 XP)
              </span>
            ) : (
              <span className="font-mono-tabular text-[11px] text-slate-400">
                10-Second Experiment • +15 XP
              </span>
            )}
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            If you picked the exact middle person on Earth in {selectedYear}, what is their net worth?
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Imagine lining up all <strong>{adultPopulationBillions.toFixed(2)} billion adults</strong> from poorest to richest. The statistical <em>average</em> wealth is{' '}
            <strong className="font-mono-tabular text-sky-600 dark:text-sky-300">
              {formatCurrency(meanWealthUsd, { compact: false })}
            </strong>
            . Drag the slider to guess what the <strong>50th-percentile human</strong> in the middle actually owns:
          </p>

          {/* Slider Box */}
          <div className="rounded-2xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] p-4 sm:p-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Prediction (Median Adult):
              </span>
              <span className="font-mono-tabular text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-300">
                {formatCurrency(guessUsd, { compact: false })}
              </span>
            </div>

            <input
              type="range"
              min={500}
              max={120000}
              step={500}
              value={guessUsd}
              onChange={(e) => setGuessUsd(Number(e.target.value))}
              aria-label="Guess median global adult wealth"
              className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg"
            />

            <div className="flex justify-between font-mono-tabular text-[11px] text-slate-400">
              <span>$500</span>
              <span>$30,000</span>
              <span>$60,000</span>
              <span>$90,000</span>
              <span>$120,000</span>
            </div>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleLockGuess}
                className="tactile-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-600 font-bold text-xs sm:text-sm cursor-pointer shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isRevealed ? 'Update My Comparison' : 'Reveal the Reality (+15 XP)'}</span>
              </button>

              {isRevealed && (
                <button
                  type="button"
                  onClick={() => setIsRevealed(false)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Hide Answer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Visual Reveal & "Billionaire in the Room" Analogy */}
        <div className="lg:w-[44%] w-full rounded-2xl bg-slate-900/5 dark:bg-black/35 border border-slate-200 dark:border-white/[0.09] p-5 space-y-4 self-stretch flex flex-col justify-between">
          {!isRevealed ? (
            <div className="my-auto text-center py-6 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-mono-tabular font-bold text-amber-400 text-lg">
                ?
              </div>
              <h4 className="font-editorial text-xl font-bold text-slate-900 dark:text-white">
                Why do 9 out of 10 people guess too high?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Lock in your slider prediction on the left to see how extreme wealth at the top skews the global average versus the middle human.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {isClose
                    ? 'Sharp Intuition! You nailed the skew.'
                    : errorRatio > 1
                    ? `You guessed ${errorRatio.toFixed(1)}x higher than reality`
                    : 'You guessed even lower than the true median!'}
                </span>
                <span className="font-mono-tabular text-xs font-bold text-slate-400">
                  {selectedYear} Reality
                </span>
              </div>

              {/* 3-Bar Visual Comparison */}
              <div className="space-y-3">
                {/* Bar 1: Your Guess */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-300">Your Guess</span>
                    <span className="font-mono-tabular font-bold text-amber-500">
                      {formatCurrency(guessUsd, { compact: false })}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${guessPct}%` }}
                    />
                  </div>
                </div>

                {/* Bar 2: True Median */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      True Global Median (50th Percentile)
                    </span>
                    <span className="font-mono-tabular font-extrabold text-emerald-600 dark:text-emerald-300">
                      {formatCurrency(medianWealthUsd, { compact: false })}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${medianPct}%` }}
                    />
                  </div>
                </div>

                {/* Bar 3: Global Mean */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-sky-600 dark:text-sky-400">
                      Statistical Average (Skewed by Top 1%)
                    </span>
                    <span className="font-mono-tabular font-bold text-sky-600 dark:text-sky-300">
                      {formatCurrency(meanWealthUsd, { compact: false })}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all duration-300"
                      style={{ width: `${meanPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                <strong>The Billionaire in the Bar Effect:</strong> If 99 people have $0 and 1 billionaire walks in with $1B, the <em>average</em> person in the room now has $10M—yet 99 people are still broke. In {selectedYear}, the average adult wealth is{' '}
                <strong className="font-mono-tabular">
                  {(meanWealthUsd / Math.max(1, medianWealthUsd)).toFixed(1)}x
                </strong>{' '}
                larger than the median human!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
