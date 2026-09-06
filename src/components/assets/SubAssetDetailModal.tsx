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

      {/* Modal dialog box */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#242b3d] bg-[#0e111a] p-6 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
                <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-semibold text-slate-300 border border-slate-700">
                  {formatPercent(category.sharePercent)} of World Wealth
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sub-sector composition & capital distribution ({selectedYear})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto space-y-6 pt-5 pr-1 flex-1">
          {/* Key figure banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-[#141824] p-4">
            <div>
              <span className="text-xs text-slate-400 block">Total Asset Class Valuation</span>
              <span className="text-2xl font-extrabold text-white">
                {formatCurrency(totalAdjustedVal * 1_000_000_000_000, { compact: true })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 text-slate-300">
                {category.isTangible ? 'Tangible Physical Property' : 'Contractual Financial Capital'}
              </span>
            </div>
          </div>

          {/* Sub-sector proportional distribution bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <PieChart className="h-3.5 w-3.5 text-cyan-400" />
                Sub-Asset Proportional Allocation
              </span>
              <span>100% of Asset Class</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Granular Sector Breakdown
            </h4>
            {subCategories.map((sub) => {
              const subAdjustedVal = adjustValue(sub.valueTrillion, selectedYear, currencyPerspective);
              return (
                <div
                  key={sub.id}
                  className="rounded-xl border border-slate-800 bg-[#121622] p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: sub.color }}
                      />
                      <span className="font-bold text-sm text-white">{sub.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-emerald-400">
                        {formatCurrency(subAdjustedVal * 1_000_000_000_000, { compact: true })}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono font-semibold text-slate-300 border border-slate-700">
                        {formatPercent(sub.shareOfParentPercent)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pl-5.5">
                    {sub.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contextual institutional note */}
          <div className="rounded-xl border border-slate-800 bg-[#111624] p-4 text-xs text-slate-400 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-200 block">Macroeconomic Behavior</span>
              <p className="leading-relaxed text-slate-400">
                Sub-sectors often decouple during monetary transitions. For example, commercial property yields diverge from residential shelter demand during rate tightening cycles, while public equities concentrate into top tech firms during productivity expansions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
