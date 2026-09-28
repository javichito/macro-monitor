'use client';

import React, { useState, useEffect } from 'react';
import {
  MARKET_BENCHMARKS,
  MarketBenchmark,
} from '../../data/market-pulse';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

/*
 * Renders an inline SVG sparkline so users immediately perceive
 * recent price momentum without requiring heavy charting library dependencies.
 */
function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 42;
  const height = 18;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#30d158' : '#ff453a';

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible shrink-0 opacity-80"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function MarketPulseTicker() {
  const [selectedBenchmark, setSelectedBenchmark] =
    useState<MarketBenchmark | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  /*
   * Handle ESC key navigation for the detail modal to conform to accessible modal UX.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedBenchmark) {
        setSelectedBenchmark(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBenchmark]);

  const formatPrice = (b: MarketBenchmark) => {
    const formatted = b.price.toLocaleString('en-US', {
      minimumFractionDigits: b.decimals,
      maximumFractionDigits: b.decimals,
    });
    return `${b.prefix}${formatted}${b.suffix}`;
  };

  return (
    <>
      {/* Ticker Bar */}
      <div
        className="border-b border-white/[0.06] bg-black/50 backdrop-blur-md relative z-40 transition-all duration-300"
        data-testid="market-pulse-ticker"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-1.5 gap-2 text-xs">
          {/* Status Label */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/10 px-2.5 py-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                Live Pulse
              </span>
            </div>
            <span className="text-[10px] text-white/40 hidden xl:inline-block font-mono">
              2026 Macro Proxies
            </span>
          </div>

          {/* Marquee / Scrollable Benchmarks Container */}
          {!isCollapsed && (
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-4 py-0.5 px-1 scroll-smooth">
              {MARKET_BENCHMARKS.map((b) => {
                const isPositive = b.changePercent >= 0;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBenchmark(b)}
                    className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-xs hover:bg-white/[0.08] transition-colors group cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
                    title={`Click to view macro intelligence for ${b.name}`}
                  >
                    <span className="font-semibold text-white/90 group-hover:text-white transition-colors">
                      {b.symbol}
                    </span>
                    <span className="font-mono font-medium text-white/80">
                      {formatPrice(b)}
                    </span>
                    <div
                      className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold ${
                        isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {b.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="hidden lg:block ml-0.5">
                      <MiniSparkline data={b.sparkline} isPositive={isPositive} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
            title={isCollapsed ? 'Show live benchmarks' : 'Hide live benchmarks'}
            aria-label={isCollapsed ? 'Expand market ticker' : 'Collapse market ticker'}
          >
            {isCollapsed ? (
              <>
                <Eye className="h-3 w-3" />
                <span className="hidden sm:inline">Show Pulse</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3" />
                <span className="hidden sm:inline">Hide</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBenchmark && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-benchmark-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
          onClick={() => setSelectedBenchmark(null)}
        >
          <div
            className="apple-card max-w-lg w-full p-6 sm:p-7 relative border border-white/15 shadow-2xl bg-[#0b0e17]/95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedBenchmark(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.12] transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-white/70">
                {selectedBenchmark.category}
              </span>
              <span className="text-xs text-white/40 font-mono">
                {selectedBenchmark.symbol}
              </span>
            </div>

            <h3
              id="modal-benchmark-title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {selectedBenchmark.name}
            </h3>

            {/* Price display & 24h change */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {formatPrice(selectedBenchmark)}
              </span>
              <div
                className={`inline-flex items-center gap-1 font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg ${
                  selectedBenchmark.changePercent >= 0
                    ? 'bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30'
                    : 'bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/30'
                }`}
              >
                {selectedBenchmark.changePercent >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {selectedBenchmark.changePercent >= 0 ? '+' : ''}
                  {selectedBenchmark.changePercent.toFixed(2)}%
                </span>
                <span className="text-xs opacity-75">
                  ({selectedBenchmark.changeAbsolute >= 0 ? '+' : ''}
                  {selectedBenchmark.changeAbsolute.toFixed(selectedBenchmark.decimals)})
                </span>
              </div>
            </div>

            {/* 52-Week Range Bar */}
            <div className="mt-6 pt-4 border-t border-white/[0.08]">
              <div className="flex justify-between items-center text-xs text-white/60 mb-1.5 font-mono">
                <span>52W Low: {selectedBenchmark.prefix}{selectedBenchmark.low52w.toLocaleString()}{selectedBenchmark.suffix}</span>
                <span>52W High: {selectedBenchmark.prefix}{selectedBenchmark.high52w.toLocaleString()}{selectedBenchmark.suffix}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.08] relative overflow-hidden">
                {(() => {
                  const range =
                    selectedBenchmark.high52w - selectedBenchmark.low52w || 1;
                  const pct = Math.min(
                    100,
                    Math.max(
                      0,
                      ((selectedBenchmark.price - selectedBenchmark.low52w) / range) *
                        100
                    )
                  );
                  return (
                    <div
                      className="h-full bg-gradient-to-r from-[#0a84ff] to-[#30d158] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  );
                })()}
              </div>
            </div>

            {/* Macro Intelligence Explainer */}
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#ffd60a]" />
                <span>Macro Significance</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-normal">
                {selectedBenchmark.macroSignificance}
              </p>

              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block mb-1">
                  Cross-Asset Correlation
                </span>
                <p className="text-xs text-white/70 leading-relaxed">
                  {selectedBenchmark.correlationNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
