'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyPerspective, Granularity } from '../lib/types';

export type ThemePreference = 'system' | 'dark' | 'light';

interface AppContextValue {
  currencyPerspective: CurrencyPerspective;
  setCurrencyPerspective: (val: CurrencyPerspective) => void;
  granularity: Granularity;
  setGranularity: (val: Granularity) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  isPlayingTimeline: boolean;
  setIsPlayingTimeline: (playing: boolean | ((prev: boolean) => boolean)) => void;
  availableYears: number[];
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  resolvedTheme: 'dark' | 'light';
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const AVAILABLE_YEARS = [1980, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2022, 2024, 2025, 2026];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currencyPerspective, setCurrencyPerspective] = useState<CurrencyPerspective>('nominal');
  const [granularity, setGranularity] = useState<Granularity>('country');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  /*
   * Synchronize active theme with DOM root attributes and PWA meta theme-color.
   * This ensures iOS Safari status bars and desktop window chrome immediately match.
   */
  const applyResolvedTheme = (resolved: 'dark' | 'light') => {
    setResolvedTheme(resolved);
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(resolved);
    root.setAttribute('data-theme', resolved);

    // Update dynamic PWA theme-color tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const colorHex = resolved === 'dark' ? '#05070c' : '#f8fafc';
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colorHex);
    }
  };

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    try {
      localStorage.setItem('macro_theme', pref);
    } catch (e) {
      // LocalStorage might be restricted in private browsing
    }

    if (pref === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      applyResolvedTheme(pref);
    }
  };

  /*
   * Initialize theme from localStorage or system device settings on client mount,
   * and bind a live mediaQuery listener for when device shifts between light and dark.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedPref: ThemePreference = 'system';
    try {
      const stored = localStorage.getItem('macro_theme');
      if (stored === 'system' || stored === 'dark' || stored === 'light') {
        savedPref = stored;
      }
    } catch (e) {}

    setThemePreferenceState(savedPref);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const computeResolved = (pref: ThemePreference) => {
      if (pref === 'system') {
        return mediaQuery.matches ? 'dark' : 'light';
      }
      return pref;
    };

    applyResolvedTheme(computeResolved(savedPref));

    const handleSystemChange = (e: MediaQueryListEvent) => {
      setThemePreferenceState((currentPref) => {
        if (currentPref === 'system') {
          applyResolvedTheme(e.matches ? 'dark' : 'light');
        }
        return currentPref;
      });
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  /*
   * Hydrate state from deep link URL query params on initial mount
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const yr = Number(params.get('year'));
    if (yr && AVAILABLE_YEARS.includes(yr)) {
      setSelectedYear(yr);
    }
    const curr = params.get('currency')?.toLowerCase();
    if (curr === 'nominal' || curr === 'real' || curr === 'ppp') {
      setCurrencyPerspective(curr as CurrencyPerspective);
    }
    const gran = params.get('granularity')?.toLowerCase();
    if (gran === 'country' || gran === 'bloc' || gran === 'continent') {
      setGranularity(gran as Granularity);
    }
  }, []);

  /*
   * Automated timeline playback allows non-expert users to visually witness
   * macroeconomic cycles unfold over time without manual dragging.
   */
  useEffect(() => {
    if (!isPlayingTimeline) return;

    const interval = setInterval(() => {
      setSelectedYear((current) => {
        const currentIndex = AVAILABLE_YEARS.indexOf(current);
        if (currentIndex === -1 || currentIndex === AVAILABLE_YEARS.length - 1) {
          return AVAILABLE_YEARS[0];
        }
        return AVAILABLE_YEARS[currentIndex + 1];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  return (
    <AppContext.Provider
      value={{
        currencyPerspective,
        setCurrencyPerspective,
        granularity,
        setGranularity,
        selectedYear,
        setSelectedYear,
        isPlayingTimeline,
        setIsPlayingTimeline,
        availableYears: AVAILABLE_YEARS,
        themePreference,
        setThemePreference,
        resolvedTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useThemeMode(): 'dark' | 'light' {
  const context = useContext(AppContext);
  if (!context) {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('light')) {
      return 'light';
    }
    return 'dark';
  }
  return context.resolvedTheme;
}

