'use client';

import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface PlainEnglishCardProps {
  title: string;
  summary: string;
  detail?: string;
  takeaway?: string;
  defaultExpanded?: boolean;
}

export function PlainEnglishCard({
  title,
  summary,
  detail,
  takeaway,
  defaultExpanded = false,
}: PlainEnglishCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-purple-950/20 p-4 transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start justify-between text-left gap-3 focus:outline-none"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mt-0.5">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                In Plain English
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-0.5">{title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{summary}</p>
          </div>
        </div>
        <div className="text-slate-400 mt-1">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3.5 pt-3.5 border-t border-indigo-500/20 pl-10 space-y-2 text-xs text-slate-300 leading-relaxed animate-in fade-in duration-200">
          {detail && <p>{detail}</p>}
          {takeaway && (
            <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 p-2.5 text-indigo-200">
              <span className="font-semibold text-indigo-300">Key Takeaway: </span>
              {takeaway}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
