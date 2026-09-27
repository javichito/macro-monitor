'use client';

import React, { useEffect } from 'react';
import { AssetCategory, CurrencyPerspective, SubAssetCategory } from '../../lib/types';
import { adjustValue, formatCurrency, formatPercent } from '../../lib/formatters';
import { X, PieChart, Layers, ArrowRight, ShieldCheck } from 'lucide-react';

interface SubAssetDetailModalProps {
  category: AssetCategory | null;
  selectedYear: number;
  currencyPerspective: CurrencyPerspective;
  onClose: () => void;
}

export function SubAssetDetailModal({
  category,
  selectedYear,
  currencyPerspective,
  onClose,
}: SubAssetDetailModalProps) {
  /*
   * Traps escape key presses to ensure accessibility standards for modal dialogs.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!category) return null;

  const totalAdjustedVal = adjustValue(category.valueTrillion, selectedYear, currencyPerspective);
  const subCategories = category.subCategories || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal dialog box — Apple frosted sheet design */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/[0.14] bg-[#0c1017]/90 backdrop-blur-3xl p-6 sm:p-7 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: category.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{category.name}</h3>
                <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-slate-200 border border-white/[0.12]">
                  {formatPercent(category.sharePercent)} of World Wealth
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-normal">
                Sub-sector composition &amp; capital distribution ({selectedYear})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto space-y-5 pt-5 pr-1 flex-1">
          {/* Key figure banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/[0.10] bg-white/[0.04] p-4.5">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Total Asset Class Valuation</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-0.5 block">
                {formatCurrency(totalAdjustedVal * 1_000_000_000_000, { compact: true })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.10] text-slate-200 font-medium">
                {category.isTangible ? 'Tangible Physical Property' : 'Contractual Financial Capital'}
              </span>
            </div>
          </div>

          {/* Sub-sector proportional distribution bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <PieChart className="h-3.5 w-3.5 text-sky-400" />
                Sub-Asset Proportional Allocation
              </span>
              <span className="text-slate-400 font-medium">100% of Asset Class</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/[0.08] overflow-hidden flex shadow-inner">
              {subCategories.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    width: `${sub.shareOfParentPercent}%`,
                    backgroundColor: sub.color,
                  }}
                  title={`${sub.name}: ${sub.shareOfParentPercent}%`}
                  className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                />
              ))}
            </div>
          </div>

          {/* Sub-categories detailed list */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Granular Sector Breakdown
            </h4>
            {subCategories.map((sub) => {
              const subAdjustedVal = adjustValue(sub.valueTrillion, selectedYear, currencyPerspective);
              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 hover:border-white/[0.15] hover:bg-white/[0.06] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: sub.color }}
                      />
                      <span className="font-semibold text-sm text-white">{sub.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-emerald-400">
                        {formatCurrency(subAdjustedVal * 1_000_000_000_000, { compact: true })}
                      </span>
                      <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-xs font-mono font-medium text-slate-200 border border-white/[0.10]">
                        {formatPercent(sub.shareOfParentPercent)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal pl-5">
                    {sub.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contextual institutional note */}
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.06] p-4 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white block">Macroeconomic Behavior</span>
              <p className="leading-relaxed text-slate-300 font-normal">
                Sub-sectors often decouple during monetary transitions. For example, commercial property yields diverge from residential shelter demand during rate tightening cycles, while public equities concentrate into top tech firms during productivity expansions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-slate-200 transition-colors shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
