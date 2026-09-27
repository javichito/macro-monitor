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
    <div className="apple-card p-5 sm:p-6 transition-all duration-300 border-white/[0.10] bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-sky-500/[0.03]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start justify-between text-left gap-4 focus:outline-none group cursor-pointer"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 border border-sky-400/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] mt-0.5 group-hover:scale-105 transition-transform">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                In Plain English
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-white mt-0.5 tracking-tight">{title}</h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-normal">{summary}</p>
          </div>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-slate-300 group-hover:bg-white/[0.12] transition-colors mt-0.5 shrink-0">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/[0.08] sm:pl-11 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed animate-in fade-in duration-200">
          {detail && <p className="text-slate-300">{detail}</p>}
          {takeaway && (
            <div className="rounded-xl bg-sky-500/10 border border-sky-500/25 p-3.5 text-sky-200 shadow-sm">
              <span className="font-semibold text-sky-300">Key Takeaway: </span>
              {takeaway}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
