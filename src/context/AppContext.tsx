'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyPerspective, Granularity } from '../lib/types';

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
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const AVAILABLE_YEARS = [2000, 2005, 2010, 2015, 2020, 2021, 2022, 2023, 2024, 2025];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currencyPerspective, setCurrencyPerspective] = useState<CurrencyPerspective>('nominal');
  const [granularity, setGranularity] = useState<Granularity>('country');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

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
