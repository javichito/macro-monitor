'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Share2, Check, ChevronDown, Link as LinkIcon, Hash, Copy } from 'lucide-react';
import {
  SimulatorDeepLinkType,
  buildSimulatorUrl,
  copySimulatorLinkToClipboard,
} from '../../lib/deep-link';

export interface ShareDeepLinkMenuProps {
  simulator: SimulatorDeepLinkType;
  state: any;
  label?: string;
  variant?: 'default' | 'compact' | 'pill';
  className?: string;
}

export function ShareDeepLinkMenu({
  simulator,
  state,
  label = 'Share Simulation',
  variant = 'default',
  className = '',
}: ShareDeepLinkMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<'hash' | 'query' | 'direct' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Close menu when user taps anywhere outside the component bounding box
   * to preserve clean viewport interactions on mobile devices.
   */
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

  // Handle keyboard navigation dismissal
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopy = useCallback(
    async (format: 'hash' | 'query' = 'hash') => {
      const url = buildSimulatorUrl({
        simulator,
        state,
        format,
      });

      const success = await copySimulatorLinkToClipboard(url);
      if (success) {
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 2200);
      }
    },
    [simulator, state]
  );

  const hashUrlPreview = buildSimulatorUrl({ simulator, state, format: 'hash' });
  const queryUrlPreview = buildSimulatorUrl({ simulator, state, format: 'query' });

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      {/* Primary Trigger Button Group */}
      <div className="inline-flex rounded-full shadow-sm bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 p-0.5">
        <button
          type="button"
          onClick={() => handleCopy('hash')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
            copiedFormat
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.10]'
          }`}
          title="Copy direct shareable deep link"
          aria-label={label}
        >
          {copiedFormat ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
              <span>{label}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`px-1.5 py-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.10] transition-colors cursor-pointer ${
            isOpen ? 'bg-slate-200/80 dark:bg-white/[0.15]' : ''
          }`}
          title="Choose link format (Hash vs Query String)"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Format Selection Dropdown Popover */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 z-50 w-80 rounded-2xl border border-slate-200 dark:border-white/[0.15] bg-white/95 dark:bg-[#12141c]/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/50 mb-2 px-1">
            Shareable Deep-Link Formats
          </div>

          <div className="space-y-1.5">
            {/* Hash Option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                handleCopy('hash');
                setIsOpen(false);
              }}
              className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400 mt-0.5">
                <Hash className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>URL Hash Link</span>
                  {copiedFormat === 'hash' && (
                    <span className="text-[10px] text-emerald-500 font-bold">Copied</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-white/60 truncate mt-0.5">
                  #fiscal-simulator?... (client-side anchor)
                </p>
              </div>
            </button>

            {/* Query String Option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                handleCopy('query');
                setIsOpen(false);
              }}
              className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mt-0.5">
                <LinkIcon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Query String Link</span>
                  {copiedFormat === 'query' && (
                    <span className="text-[10px] text-emerald-500 font-bold">Copied</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-white/60 truncate mt-0.5">
                  ?tab=liquidity&fds_c=... (classic query params)
                </p>
              </div>
            </button>
          </div>

          {/* Quick Preview URL */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.08]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 dark:text-white/40">URL Preview:</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.05] p-1.5 rounded-lg border border-slate-200 dark:border-white/10 font-mono text-[10px] text-slate-600 dark:text-slate-300 overflow-x-auto no-scrollbar">
              <span className="truncate flex-1 select-all">{hashUrlPreview}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
