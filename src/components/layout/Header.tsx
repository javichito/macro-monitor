'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe2,
  TrendingUp,
  Layers,
  MapPin,
  BarChart3,
  Sliders,
  Sun,
  Moon,
  Monitor,
  Compass,
  Award,
  Check,
} from 'lucide-react';
import { useApp, ThemePreference } from '../../context/AppContext';
import { MarketPulseTicker } from './MarketPulseTicker';

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  sublabel: string;
  ariaLabel: string;
  icon: typeof Monitor;
}[] = [
  {
    value: 'system',
    label: 'System',
    sublabel: 'Follow device setting',
    ariaLabel: 'Auto System Theme',
    icon: Monitor,
  },
  {
    value: 'light',
    label: 'Light',
    sublabel: 'Editorial Paper',
    ariaLabel: 'Light Mode',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    sublabel: 'Warm Ink Studio',
    ariaLabel: 'Dark Mode',
    icon: Moon,
  },
];

export function Header() {
  const pathname = usePathname();
  const {
    themePreference,
    setThemePreference,
    completedChallenges,
    unlockedEras,
    discoveryScore,
    explorerRank,
  } = useApp();

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const activeThemeOption =
    THEME_OPTIONS.find((opt) => opt.value === themePreference) ?? THEME_OPTIONS[0];
  const ActiveThemeIcon = activeThemeOption.icon;

  /*
   * Dismiss appearance popover on outside pointer interaction or Escape key so
   * the selector behaves like a native disclosure overlay without trapping focus.
   */
  useEffect(() => {
    if (!isThemeMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        themeMenuRef.current &&
        event.target instanceof Node &&
        !themeMenuRef.current.contains(event.target)
      ) {
        setIsThemeMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isThemeMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Earth Pulse', icon: Globe2 },
    { href: '/wealth', label: 'Who Owns What?', icon: TrendingUp },
    { href: '/assets', label: 'Where Wealth Lives', icon: Layers },
    { href: '/geography', label: 'Country Arena', icon: MapPin },
    { href: '/macro', label: 'Economic Engine', icon: BarChart3 },
    { href: '/studio', label: 'Graph Studio', icon: Sliders },
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

        {/* Action Controls: Appearance Mode Popover Selector */}
        <div ref={themeMenuRef} className="relative flex items-center shrink-0">
          <button
            type="button"
            aria-expanded={isThemeMenuOpen}
            aria-label={`Appearance theme: ${activeThemeOption.label}`}
            title={`Theme: ${activeThemeOption.label} (${activeThemeOption.sublabel})`}
            onClick={() => setIsThemeMenuOpen((prev) => !prev)}
            className="tactile-button flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] text-slate-200 transition-colors cursor-pointer"
          >
            <ActiveThemeIcon className="h-4 w-4 text-amber-400 shrink-0" />
          </button>

          {isThemeMenuOpen && (
            <div
              role="radiogroup"
              aria-label="Appearance Mode"
              className="apple-card absolute right-0 top-full mt-2 w-52 p-1.5 z-50 shadow-2xl"
            >
              <div className="px-2.5 py-1 text-[10px] font-mono-tabular uppercase tracking-wider text-slate-400">
                Appearance · Device Saved
              </div>
              {THEME_OPTIONS.map((option) => {
                const OptionIcon = option.icon;
                const isSelected = themePreference === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={option.ariaLabel}
                    onClick={() => {
                      setThemePreference(option.value);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <OptionIcon
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isSelected ? 'text-sky-400' : 'text-slate-400'
                        }`}
                      />
                      <div>
                        <div className="leading-tight">{option.label}</div>
                        <div className="text-[10px] font-normal text-slate-400 leading-tight mt-0.5">
                          {option.sublabel}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-sky-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Global Live Market Pulse Ticker */}
      <MarketPulseTicker />
    </header>
  );
}
