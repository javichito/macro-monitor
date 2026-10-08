'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe2, TrendingUp, Layers, MapPin, BarChart3, Sun, Moon, Monitor } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CurrencyPerspective } from '../../lib/types';
import { MarketPulseTicker } from './MarketPulseTicker';

export function Header() {
  const pathname = usePathname();
  const {
    currencyPerspective,
    setCurrencyPerspective,
    themePreference,
    setThemePreference,
  } = useApp();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Globe2 },
    { href: '/wealth', label: 'Wealth & Inequality', icon: TrendingUp },
    { href: '/assets', label: 'Asset Classes', icon: Layers },
    { href: '/geography', label: 'Geographies', icon: MapPin },
    { href: '/macro', label: 'Macro Trends', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/65 backdrop-blur-2xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-b from-white/10 to-white/[0.03] border border-white/[0.12] text-sky-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] group-hover:border-sky-400/40 group-hover:scale-[1.03] transition-all">
              <Globe2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-semibold tracking-tight text-white flex items-center gap-2">
                MacroMonitor
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  2026
                </span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block font-normal">
                Global Wealth &amp; Macro Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Primary navigation: Apple-style segmented glass capsule */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Currency Perspective & Appearance Mode */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Currency Perspective Switcher: Apple segmented control */}
          <div
            role="radiogroup"
            aria-label="Currency valuation perspective"
            className="flex items-center rounded-full p-0.5 sm:p-1 bg-white/[0.05] border border-white/[0.08] shadow-inner text-xs"
          >
            {(['nominal', 'real', 'ppp'] as CurrencyPerspective[]).map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={currencyPerspective === mode}
                onClick={() => setCurrencyPerspective(mode)}
                title={
                  mode === 'nominal'
                    ? 'Nominal USD: Current unadjusted market values'
                    : mode === 'real'
                    ? 'Real USD: Inflation-adjusted to constant 2026 purchasing power'
                    : 'PPP: Purchasing Power Parity adjusted for local basket costs'
                }
                className={`rounded-full px-2 sm:px-3 py-1 sm:py-1 text-[10px] sm:text-[11px] font-semibold transition-all duration-200 uppercase tracking-wider min-h-[32px] flex items-center justify-center ${
                  currencyPerspective === mode
                    ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.35)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="sm:hidden">{mode === 'nominal' ? 'Nom' : mode.toUpperCase()}</span>
                <span className="hidden sm:inline">{mode}</span>
              </button>
            ))}
          </div>

          {/* Theme Mode Switcher: Apple segmented control (System / Light / Dark) */}
          <div
            role="radiogroup"
            aria-label="Appearance Mode"
            className="flex items-center rounded-full p-0.5 sm:p-1 bg-white/[0.05] border border-white/[0.08] shadow-inner text-xs shrink-0"
          >
            <button
              type="button"
              role="radio"
              aria-checked={themePreference === 'system'}
              onClick={() => setThemePreference('system')}
              aria-label="Auto System Theme"
              title="System: Follow device settings automatically"
              className={`rounded-full p-1.5 sm:p-2 min-h-[32px] min-w-[32px] flex items-center justify-center transition-all duration-200 ${
                themePreference === 'system'
                  ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.35)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={themePreference === 'light'}
              onClick={() => setThemePreference('light')}
              aria-label="Light Mode"
              title="Light Mode"
              className={`rounded-full p-1.5 sm:p-2 min-h-[32px] min-w-[32px] flex items-center justify-center transition-all duration-200 ${
                themePreference === 'light'
                  ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.35)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={themePreference === 'dark'}
              onClick={() => setThemePreference('dark')}
              aria-label="Dark Mode"
              title="Dark Mode"
              className={`rounded-full p-1.5 sm:p-2 min-h-[32px] min-w-[32px] flex items-center justify-center transition-all duration-200 ${
                themePreference === 'dark'
                  ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.35)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Live Market Pulse Ticker */}
      <MarketPulseTicker />
    </header>
  );
}
