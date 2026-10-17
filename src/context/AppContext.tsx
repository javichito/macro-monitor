'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyPerspective, Granularity } from '../lib/types';

export type ThemePreference = 'system' | 'dark' | 'light';

export interface AppContextValue {
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
  completedChallenges: string[];
  markChallengeCompleted: (challengeId: string) => void;
  unlockedEras: number[];
  markEraUnlocked: (year: number) => void;
  discoveryScore: number;
  explorerRank: string;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const AVAILABLE_YEARS = [1980, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2022, 2024, 2025, 2026];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currencyPerspective, setCurrencyPerspective] = useState<CurrencyPerspective>('nominal');
  const [granularity, setGranularity] = useState<Granularity>('country');
  const [selectedYear, setSelectedYearState] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [unlockedEras, setUnlockedEras] = useState<number[]>([2026]);

  const markEraUnlocked = (year: number) => {
    setUnlockedEras((prev) => {
      if (prev.includes(year)) return prev;
      const next = [...prev, year];
      try {
        localStorage.setItem('macro_unlocked_eras', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const setSelectedYear = (year: number) => {
    setSelectedYearState(year);
    markEraUnlocked(year);
  };

  const markChallengeCompleted = (challengeId: string) => {
    setCompletedChallenges((prev) => {
      if (prev.includes(challengeId)) return prev;
      const next = [...prev, challengeId];
      try {
        localStorage.setItem('macro_completed_challenges', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

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
    const colorHex = resolved === 'dark' ? '#090d16' : '#faf8f5';
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
      const isDark =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      applyResolvedTheme(pref);
    }
  };

  /*
   * Initialize theme and learning progression from localStorage on client mount,
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
      const storedChallenges = localStorage.getItem('macro_completed_challenges');
      if (storedChallenges) {
        const parsed = JSON.parse(storedChallenges);
        if (Array.isArray(parsed)) setCompletedChallenges(parsed);
      }
      const storedEras = localStorage.getItem('macro_unlocked_eras');
      if (storedEras) {
        const parsedEras = JSON.parse(storedEras);
        if (Array.isArray(parsedEras)) setUnlockedEras(parsedEras);
      }
    } catch (e) {}

    setThemePreferenceState(savedPref);

    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
    const computeResolved = (pref: ThemePreference) => {
      if (pref === 'system') {
        return mediaQuery ? (mediaQuery.matches ? 'dark' : 'light') : 'dark';
      }
      return pref;
    };

    applyResolvedTheme(computeResolved(savedPref));

    if (!mediaQuery) return;

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
      setSelectedYearState(yr);
      markEraUnlocked(yr);
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
      setSelectedYearState((current) => {
        const currentIndex = AVAILABLE_YEARS.indexOf(current);
        const nextYear =
          currentIndex === -1 || currentIndex === AVAILABLE_YEARS.length - 1
            ? AVAILABLE_YEARS[0]
            : AVAILABLE_YEARS[currentIndex + 1];
        markEraUnlocked(nextYear);
        return nextYear;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Compute gamified learning progression so curiosity is visibly rewarded
  const discoveryScore = completedChallenges.length * 15 + unlockedEras.length * 5;
  const explorerRank =
    discoveryScore >= 120
      ? 'Central Bank Fellow'
      : discoveryScore >= 65
      ? 'Macro Strategist'
      : discoveryScore >= 30
      ? 'Cycle Detective'
      : 'Curious Citizen';

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
        completedChallenges,
        markChallengeCompleted,
        unlockedEras,
        markEraUnlocked,
        discoveryScore,
        explorerRank,
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

