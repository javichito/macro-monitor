'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe2, TrendingUp, Layers, MapPin, BarChart3, Sun, Moon, Monitor, Compass, Award } from 'lucide-react';
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
    completedChallenges,
    unlockedEras,
    discoveryScore,
    explorerRank,
  } = useApp();

  const navLinks = [
    { href: '/', label: 'Earth Pulse', icon: Globe2 },
    { href: '/wealth', label: 'Who Owns What?', icon: TrendingUp },
    { href: '/assets', label: 'Where Wealth Lives', icon: Layers },
    { href: '/geography', label: 'Country Arena', icon: MapPin },
    { href: '/macro', label: 'Economic Engine', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.09] bg-[#090d16]/85 backdrop-blur-2xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Brand identity & Interactive Field Guide Rank */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Custom tactile compass/prism emblem instead of generic SaaS box */}
            <div className="tactile-button flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-400 shadow-sm group-hover:bg-amber-500/25">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-white">
                  MacroMonitor
                </span>
                <span
                  title={`Field Mastery: ${completedChallenges.length} concept challenges solved, ${unlockedEras.length} historical eras explored`}
                  className="hidden lg:inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30"
                >
                  <Award className="h-3 w-3 text-amber-400" />
                  <span>{explorerRank}</span>
                  <span className="font-mono-tabular text-amber-200/90 border-l border-amber-400/30 pl-1.5">
                    {discoveryScore} XP
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-normal">
                Interactive Field Guide to the World Economy
              </p>
            </div>
          </Link>
        </div>

        {/* Primary navigation: Tactile chapter tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.09]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm border-b-2 border-sky-700'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Lens Switcher & Appearance Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Currency Perspective Switcher */}
          <div
            role="radiogroup"
            aria-label="Currency valuation perspective"
            className="flex items-center rounded-xl p-0.5 sm:p-1 bg-white/[0.05] border border-white/[0.09] text-xs"
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
                    ? 'Nominal USD: Raw sticker price in that year'
                    : mode === 'real'
                    ? 'Real USD: Adjusted for inflation (2026 buying power)'
                    : 'PPP: Adjusted for what local prices actually buy'
                }
                className={`rounded-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono-tabular font-bold transition-all duration-150 uppercase tracking-wider min-h-[34px] min-w-[34px] sm:min-h-[30px] sm:min-w-0 flex items-center justify-center cursor-pointer ${
                  currencyPerspective === mode
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="sm:hidden">{mode === 'nominal' ? 'Nom' : mode.toUpperCase()}</span>
                <span className="hidden sm:inline">{mode}</span>
              </button>
            ))}
          </div>

          {/* Theme Mode Switcher: System / Light / Dark */}
          <div
            role="radiogroup"
            aria-label="Appearance Mode"
            className="flex items-center rounded-xl p-0.5 sm:p-1 bg-white/[0.05] border border-white/[0.09] text-xs shrink-0"
          >
            <button
              type="button"
              role="radio"
              aria-checked={themePreference === 'system'}
              onClick={() => setThemePreference('system')}
              aria-label="Auto System Theme"
              title="System: Follow device settings automatically"
              className={`rounded-lg p-1.5 min-h-[34px] min-w-[34px] sm:min-h-[30px] sm:min-w-[30px] flex items-center justify-center transition-all duration-150 cursor-pointer ${
                themePreference === 'system'
                  ? 'bg-white text-slate-950 shadow-sm'
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
              title="Light Mode (Editorial Paper)"
              className={`rounded-lg p-1.5 min-h-[34px] min-w-[34px] sm:min-h-[30px] sm:min-w-[30px] flex items-center justify-center transition-all duration-150 cursor-pointer ${
                themePreference === 'light'
                  ? 'bg-white text-slate-950 shadow-sm'
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
              title="Dark Mode (Warm Ink Studio)"
              className={`rounded-lg p-1.5 min-h-[34px] min-w-[34px] sm:min-h-[30px] sm:min-w-[30px] flex items-center justify-center transition-all duration-150 cursor-pointer ${
                themePreference === 'dark'
                  ? 'bg-white text-slate-950 shadow-sm'
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
