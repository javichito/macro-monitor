'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface IntuitionQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

interface PlainEnglishCardProps {
  id?: string;
  title: string;
  summary: string;
  detail?: string;
  takeaway?: string;
  defaultExpanded?: boolean;
  quiz?: IntuitionQuiz;
}

export function PlainEnglishCard({
  id,
  title,
  summary,
  detail,
  takeaway,
  defaultExpanded = false,
  quiz,
}: PlainEnglishCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [localMastered, setLocalMastered] = useState(false);

  // Safely access AppContext if mounted inside AppProvider so isolated tests never break
  let completedChallenges: string[] = [];
  let markChallengeCompleted: ((cid: string) => void) | undefined;
  try {
    const app = useApp();
    completedChallenges = app.completedChallenges;
    markChallengeCompleted = app.markChallengeCompleted;
  } catch {
    // Fallback to local state when rendered outside AppProvider in unit tests
  }

  const cardId = id || `concept-${title.slice(0, 28).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const isMastered = localMastered || completedChallenges.includes(cardId);

  const handleMaster = () => {
    setLocalMastered(true);
    if (markChallengeCompleted) {
      markChallengeCompleted(cardId);
    }
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    if (quiz && idx === quiz.correctIndex) {
      handleMaster();
    }
  };

  return (
    <div
      className={`apple-card p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${
        isMastered
          ? 'border-emerald-500/35 dark:border-emerald-400/35'
          : 'border-slate-200 dark:border-white/[0.11]'
      }`}
    >
      {/* Top Editorial Accent Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isMastered
            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
            : 'bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-400'
        }`}
      />

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start justify-between text-left gap-4 focus:outline-none group cursor-pointer"
      >
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              Mental Model
            </span>
            {isMastered ? (
              <span className="inline-flex items-center gap-1 font-mono-tabular text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" />
                Mastered (+15 XP)
              </span>
            ) : (
              <span className="font-mono-tabular text-[10px] text-slate-400">
                +15 XP Insight
              </span>
            )}
          </div>
          <h4 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {summary}
          </p>
        </div>

        <div className="tactile-button flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-300 dark:border-white/[0.12] text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-white/[0.12] transition-colors mt-0.5 shrink-0">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.08] space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Interactive Intuition Quiz if provided */}
          {quiz && (
            <div className="rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Quick Intuition Check</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                {quiz.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quiz.options.map((opt, idx) => {
                  const isPicked = selectedOption === idx;
                  const isCorrect = idx === quiz.correctIndex;
                  let btnStyle =
                    'bg-white dark:bg-white/[0.05] text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/[0.12] hover:border-sky-400';

                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnStyle =
                        'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/50 font-bold';
                    } else if (isPicked) {
                      btnStyle =
                        'bg-rose-500/20 text-rose-800 dark:text-rose-200 border-rose-500/50';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`tactile-button text-left px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {selectedOption !== null && (
                <p
                  className={`text-xs p-2.5 rounded-lg border ${
                    selectedOption === quiz.correctIndex
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-200'
                  }`}
                >
                  {selectedOption === quiz.correctIndex ? 'Spot on! ' : 'Not quite — '}
                  {quiz.feedback}
                </p>
              )}
            </div>
          )}

          {detail && (
            <div className="space-y-1">
              <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-400">
                How the Mechanism Works
              </span>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{detail}</p>
            </div>
          )}

          {takeaway && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-slate-900 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 block mb-0.5">
                  Rule of Thumb
                </span>
                <span>{takeaway}</span>
              </div>

              {!isMastered && (
                <button
                  type="button"
                  onClick={handleMaster}
                  className="tactile-button shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-700 font-bold text-xs cursor-pointer self-start sm:self-center"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Got It (+15 XP)</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
