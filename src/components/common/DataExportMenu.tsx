'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  DatasetColumn,
  DatasetMetadata,
  downloadDatasetCsv,
  downloadDatasetJson,
  generateJson,
} from '../../lib/export-dataset';

export interface DataExportMenuProps {
  /**
   * Title of the dataset used in JSON metadata and download filename.
   */
  title: string;
  /**
   * Filename slug without extension (e.g., 'yield-curve-us').
   */
  filename: string;
  /**
   * The dataset records or a lazy generator returning the dataset array.
   */
  data: any[] | (() => any[]);
  /**
   * Optional custom column configuration for CSV export.
   */
  columns?: DatasetColumn<any>[];
  /**
   * Optional metadata describing source, perspective, units, or methodology.
   */
  metadata?: Partial<DatasetMetadata>;
  /**
   * Dropdown menu alignment relative to the trigger button.
   */
  align?: 'left' | 'right';
  /**
   * Visual variant: 'default' | 'compact' | 'subtle'
   */
  variant?: 'default' | 'compact' | 'subtle';
  /**
   * Optional additional className for trigger button.
   */
  className?: string;
}

export function DataExportMenu({
  title,
  filename,
  data,
  columns,
  metadata,
  align = 'right',
  variant = 'default',
  className = '',
}: DataExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastAction, setLastAction] = useState<'csv' | 'json' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Resolves dataset dynamically to avoid allocating memory for large export arrays
   * until the researcher actively invokes the download menu.
   */
  const resolveData = useCallback((): any[] => {
    return typeof data === 'function' ? data() : data;
  }, [data]);

  // Close dropdown when user clicks outside the menu container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDownloadCsv = () => {
    const resolved = resolveData();
    downloadDatasetCsv({
      title,
      filename,
      data: resolved,
      columns,
      metadata,
    });
    setLastAction('csv');
    setTimeout(() => {
      setLastAction(null);
      setIsOpen(false);
    }, 600);
  };

  const handleDownloadJson = () => {
    const resolved = resolveData();
    downloadDatasetJson({
      title,
      filename,
      data: resolved,
      metadata,
    });
    setLastAction('json');
    setTimeout(() => {
      setLastAction(null);
      setIsOpen(false);
    }, 600);
  };

  const handleCopyJson = async () => {
    try {
      const resolved = resolveData();
      const jsonString = generateJson(resolved, {
        title,
        ...metadata,
      });
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1000);
    } catch {
      // Fallback silently if clipboard access is restricted
      setCopied(false);
    }
  };

  const buttonSizeClasses =
    variant === 'compact'
      ? 'px-2.5 py-1 text-xs gap-1.5'
      : variant === 'subtle'
      ? 'px-2.5 py-1 text-xs gap-1 bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/[0.06]'
      : 'px-3 py-1.5 text-xs gap-2';

  return (
    <div ref={containerRef} className="relative inline-block text-left z-20">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Export dataset"
        title={`Export dataset for ${title}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center rounded-full font-semibold transition-all duration-200 cursor-pointer ${
          variant !== 'subtle'
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-white/[0.10] shadow-sm'
            : ''
        } ${buttonSizeClasses} ${className}`}
      >
        <Download className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
        <span className="hidden sm:inline">Export Dataset</span>
        <span className="sm:hidden">Export</span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute mt-2 w-72 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 py-2 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          {/* Header */}
          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-white/[0.08] mb-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Data Reproducibility
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <Sparkles className="h-2.5 w-2.5" />
                Raw Data
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
              {title}
            </p>
          </div>

          {/* Action 1: Download CSV */}
          <button
            type="button"
            role="menuitem"
            onClick={handleDownloadCsv}
            className="w-full flex items-start gap-3 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-slate-100/80 dark:hover:bg-white/[0.06] cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              {lastAction === 'csv' ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Download CSV (.csv)</span>
                {lastAction === 'csv' && (
                  <span className="text-[10px] font-normal text-emerald-500">Downloaded</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Formatted for Excel, Google Sheets, R, &amp; Python Pandas
              </p>
            </div>
          </button>

          {/* Action 2: Download JSON */}
          <button
            type="button"
            role="menuitem"
            onClick={handleDownloadJson}
            className="w-full flex items-start gap-3 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-slate-100/80 dark:hover:bg-white/[0.06] cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0 mt-0.5">
              {lastAction === 'json' ? (
                <Check className="h-4 w-4 text-sky-500" />
              ) : (
                <FileCode className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Download JSON (.json)</span>
                {lastAction === 'json' && (
                  <span className="text-[10px] font-normal text-sky-500">Downloaded</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                With citation metadata, units, and nested schemas
              </p>
            </div>
          </button>

          {/* Action 3: Copy JSON to Clipboard */}
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyJson}
            className="w-full flex items-start gap-3 px-3.5 py-2 text-left text-xs transition-colors hover:bg-slate-100/80 dark:hover:bg-white/[0.06] cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
              {copied ? (
                <Check className="h-4 w-4 text-purple-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Copy JSON to Clipboard</span>
                {copied && (
                  <span className="text-[10px] font-normal text-purple-500">Copied!</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Quick paste into notebooks, LLMs, or scripts
              </p>
            </div>
          </button>

          {/* Footer note for journalists and students */}
          <div className="px-3.5 pt-2 pb-1 mt-1 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-[10px] text-slate-400">
            <span>Citations: BIS • IMF • FRED</span>
            <span>Open Access (CC BY 4.0)</span>
          </div>
        </div>
      )}
    </div>
  );
}
