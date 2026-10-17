'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { COUNTRIES_DATA, ECONOMIC_BLOCS } from '../../data/country-metrics';
import { WORLD_COUNTRIES_PATHS, SPHERE_PATH, GRATICULE_PATH } from './world-paths';
import { CountryProfile, Granularity, CurrencyPerspective } from '../../lib/types';
import { formatCurrency, formatPercent, adjustValue } from '../../lib/formatters';
import { MapPin, Search, Info, Globe, Plus, Minus, RotateCcw, ArrowLeftRight, Share2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type MapMetricType =
  | 'wealthPerAdult'
  | 'medianWealth'
  | 'totalWealth'
  | 'gdp'
  | 'gdpPerCapita'
  | 'realGdpGrowth'
  | 'inflation'
  | 'policyRate'
  | 'bondYield10Y'
  | 'debtToGdp'
  | 'fiscalBalance'
  | 'currentAccount'
  | 'unemployment'
  | 'oldAgeDependency'
  | 'gini';

export const VALID_MAP_METRICS: MapMetricType[] = [
  'wealthPerAdult',
  'medianWealth',
  'totalWealth',
  'gdp',
  'gdpPerCapita',
  'realGdpGrowth',
  'inflation',
  'policyRate',
  'bondYield10Y',
  'debtToGdp',
  'fiscalBalance',
  'currentAccount',
  'unemployment',
  'oldAgeDependency',
  'gini',
];

interface WorldMapProps {
  selectedYear: number;
  currencyPerspective: CurrencyPerspective;
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
  onCompareCountry?: (countryCode: string) => void;
  activeMetric?: MapMetricType;
  onMetricChange?: (metric: MapMetricType) => void;
  selectedCountryCode?: string;
  onSelectCountryChange?: (code: string) => void;
  selectedBlocId?: string;
  onSelectBlocChange?: (blocId: string) => void;
  activeRegion?: string;
  onRegionChange?: (regionKey: string) => void;
}

interface RegionPreset {
  name: string;
  zoom: number;
  pan: { x: number; y: number };
}

/*
 * Regional presets focus on continent and economic bloc centroid clusters.
 * The SVG viewBox is 960x500 (center point 480, 250).
 * With transform `translate(pan.x, pan.y) scale(zoom)`, screen coordinate (Sx, Sy)
 * maps to: Sx = zoom * X + pan.x, Sy = zoom * Y + pan.y.
 * To center focus coordinate (TargetX, TargetY) at (480, 250):
 * pan.x = 480 - zoom * TargetX
 * pan.y = 250 - zoom * TargetY
 */
export const REGION_PRESETS: Record<string, RegionPreset> = {
  global: { name: 'World', zoom: 1, pan: { x: 0, y: 0 } },
  americas: { name: 'Americas', zoom: 1.45, pan: { x: 74, y: -90 } },
  europe: { name: 'Europe', zoom: 2.7, pan: { x: -885, y: 20 } },
  asia: { name: 'Asia-Pacific', zoom: 1.55, pan: { x: -710, y: -115 } },
  africa: { name: 'Africa', zoom: 1.85, pan: { x: -500, y: -205 } },
  mea: { name: 'Middle East & Africa', zoom: 1.65, pan: { x: -430, y: -120 } },
};

export function WorldMap({
  selectedYear,
  currencyPerspective,
  granularity,
  onGranularityChange,
  onCompareCountry,
  activeMetric: controlledMetric,
  onMetricChange,
  selectedCountryCode: controlledCountryCode,
  onSelectCountryChange,
  selectedBlocId: controlledBlocId,
  onSelectBlocChange,
  activeRegion: controlledRegion,
  onRegionChange,
}: WorldMapProps) {
  const [internalMetric, setInternalMetric] = useState<MapMetricType>('wealthPerAdult');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalCountryCode, setInternalCountryCode] = useState<string>('USA');
  const [internalBlocId, setInternalBlocId] = useState<string>('g7');
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [hasCopiedMapLink, setHasCopiedMapLink] = useState(false);
  const { resolvedTheme } = useApp();
  const isLight = resolvedTheme === 'light';

  const activeMetric = controlledMetric ?? internalMetric;
  const selectedCountryCode = controlledCountryCode ?? internalCountryCode;
  const selectedBlocId = controlledBlocId ?? internalBlocId;

  const handleSetMetric = (m: MapMetricType) => {
    setInternalMetric(m);
    onMetricChange?.(m);
  };

  const handleSetCountry = (code: string) => {
    setInternalCountryCode(code);
    onSelectCountryChange?.(code);
  };

  const handleSetBloc = (id: string) => {
    setInternalBlocId(id);
    onSelectBlocChange?.(id);
  };

  const countryByCode = useMemo(() => {
    const map = new Map<string, CountryProfile>();
    for (const c of COUNTRIES_DATA) {
      map.set(c.code, c);
    }
    return map;
  }, []);

  const selectedCountry = countryByCode.get(selectedCountryCode) || COUNTRIES_DATA[0];
  const selectedBloc = ECONOMIC_BLOCS.find((b) => b.id === selectedBlocId) || ECONOMIC_BLOCS[0];

  const filteredCountries = useMemo(() => {
    return COUNTRIES_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const metricLabels: Record<MapMetricType, string> = {
    wealthPerAdult: 'Wealth per Adult ($)',
    medianWealth: 'Median Wealth ($)',
    totalWealth: 'Total Wealth ($T)',
    gdp: 'Gross GDP ($T)',
    gdpPerCapita: 'GDP per Capita ($)',
    realGdpGrowth: 'Real GDP Growth (%)',
    inflation: 'Inflation Rate (%)',
    policyRate: 'Central Bank Rate (%)',
    bondYield10Y: '10Y Bond Yield (%)',
    debtToGdp: 'Sovereign Debt (% GDP)',
    fiscalBalance: 'Fiscal Balance (% GDP)',
    currentAccount: 'Current Account (% GDP)',
    unemployment: 'Unemployment Rate (%)',
    oldAgeDependency: 'Old-Age Dependency (%)',
    gini: 'Wealth Gini Index',
  };

  const getRawMetricValue = (country: CountryProfile, metric: MapMetricType): number => {
    const historyData = country.history[selectedYear] || country.history[2026] || country.history[2025];
    switch (metric) {
      case 'totalWealth':
        return historyData.totalWealthTrillion;
      case 'wealthPerAdult':
        return historyData.wealthPerAdultUSD;
      case 'medianWealth':
        return historyData.medianWealthUSD;
      case 'gdp':
        return historyData.gdpTrillionUSD;
      case 'gdpPerCapita':
        return historyData.gdpPerCapitaUSD;
      case 'realGdpGrowth':
        return historyData.realGdpGrowth;
      case 'inflation':
        return historyData.inflationRate;
      case 'policyRate':
        return historyData.policyRate;
      case 'bondYield10Y':
        return historyData.bondYield10Y;
      case 'debtToGdp':
        return historyData.debtToGdp;
      case 'fiscalBalance':
        return historyData.fiscalBalancePercentGdp;
      case 'currentAccount':
        return historyData.currentAccountPercentGdp;
      case 'unemployment':
        return historyData.labor?.unemploymentRate ?? 0;
      case 'oldAgeDependency':
        return historyData.oldAgeDependencyRatio;
      case 'gini':
        return historyData.gini;
    }
  };

  const { minVal, maxVal } = useMemo(() => {
    const values = COUNTRIES_DATA.map((c) => getRawMetricValue(c, activeMetric));
    return {
      minVal: Math.min(...values),
      maxVal: Math.max(...values),
    };
  }, [activeMetric, selectedYear]);

  const formatMetricScaleValue = (rawVal: number, metric: MapMetricType): string => {
    switch (metric) {
      case 'totalWealth':
      case 'gdp':
        return formatCurrency(adjustValue(rawVal, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true });
      case 'wealthPerAdult':
      case 'medianWealth':
      case 'gdpPerCapita':
        return formatCurrency(adjustValue(rawVal, selectedYear, currencyPerspective), { compact: true });
      case 'realGdpGrowth':
      case 'fiscalBalance':
      case 'currentAccount':
        return `${rawVal > 0 ? '+' : ''}${rawVal.toFixed(1)}%`;
      case 'inflation':
      case 'policyRate':
      case 'bondYield10Y':
      case 'debtToGdp':
      case 'unemployment':
      case 'oldAgeDependency':
        return formatPercent(rawVal);
      case 'gini':
        return rawVal.toFixed(2);
    }
  };

  const getCountryMetricDisplay = (country: CountryProfile, metric: MapMetricType) => {
    return formatMetricScaleValue(getRawMetricValue(country, metric), metric);
  };

  /*
   * Normalized choropleth shading for modeled sovereign entities.
   * Maps metric values across an accessible emerald-to-cyan gradient.
   */
  const getFeatureFill = (code: string): string => {
    const country = countryByCode.get(code);
    if (!country) return '#151b27';

    if (granularity === 'bloc') {
      const isMember = selectedBloc.memberCodes.includes(code);
      if (isMember) return selectedBloc.color;
      return '#1c2433';
    }

    const val = getRawMetricValue(country, activeMetric);
    const range = maxVal - minVal;
    const ratio = range > 0 ? (val - minVal) / range : 0.5;

    if (ratio < 0.15) return '#132c2c';
    if (ratio < 0.35) return '#0d4a46';
    if (ratio < 0.60) return '#056b5e';
    if (ratio < 0.85) return '#0f9f80';
    return '#10b981';
  };

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [internalRegion, setInternalRegion] = useState<string>('global');
  const [isDragging, setIsDragging] = useState(false);
  const [isMapTouchActive, setIsMapTouchActive] = useState(false);

  const activeRegion = controlledRegion !== undefined ? controlledRegion : internalRegion;

  useEffect(() => {
    if (controlledRegion && REGION_PRESETS[controlledRegion]) {
      setInternalRegion(controlledRegion);
      setZoom(REGION_PRESETS[controlledRegion].zoom);
      setPan(REGION_PRESETS[controlledRegion].pan);
    }
  }, [controlledRegion]);

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const isDraggingRef = React.useRef(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const hasMovedRef = React.useRef(false);

  /*
   * Zooms in or out while anchoring the viewpoint at the center of the viewport (480, 250),
   * preventing the map from drifting toward the top-left origin (0, 0) during zoom.
   */
  const handleZoom = (delta: number) => {
    setZoom((prevZoom) => {
      const nextZoom = Math.min(4.5, Math.max(1, Math.round((prevZoom + delta) * 10) / 10));
      if (nextZoom === prevZoom) return prevZoom;
      if (nextZoom === 1) {
        setPan({ x: 0, y: 0 });
        setInternalRegion('global');
        onRegionChange?.('global');
      } else {
        setInternalRegion('');
        setPan((prevPan) => {
          const ratio = nextZoom / prevZoom;
          const nextPanX = 480 - ratio * (480 - prevPan.x);
          const nextPanY = 250 - ratio * (250 - prevPan.y);
          const maxPanX = Math.max(300, (nextZoom - 1) * 480 + 300);
          const maxPanY = Math.max(200, (nextZoom - 1) * 250 + 200);
          return {
            x: Math.max(-maxPanX, Math.min(maxPanX, Math.round(nextPanX))),
            y: Math.max(-maxPanY, Math.min(maxPanY, Math.round(nextPanY))),
          };
        });
      }
      return nextZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setInternalRegion('global');
    onRegionChange?.('global');
  };

  const handleCopyMapLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setHasCopiedMapLink(true);
      setTimeout(() => setHasCopiedMapLink(false), 2000);
    });
  };

  /*
   * Captures pointer coordinates for fluid 60fps drag navigation.
   * On mobile touch screens, we verify touch pan mode is active so users can
   * scroll down the page naturally without getting trapped in the map viewport.
   */
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.pointerType === 'touch' && !isMapTouchActive) {
      return;
    }
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMovedRef.current = true;
      setInternalRegion('');
    }

    dragStartRef.current = { x: e.clientX, y: e.clientY };

    const svgRect = svgRef.current?.getBoundingClientRect();
    const scaleFactor = svgRect ? 960 / svgRect.width : 1;
    const svgDx = dx * scaleFactor;
    const svgDy = dy * scaleFactor;

    setPan((prev) => {
      const maxPanX = Math.max(300, (zoom - 1) * 480 + 300);
      const maxPanY = Math.max(200, (zoom - 1) * 250 + 200);
      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, prev.x + svgDx)),
        y: Math.max(-maxPanY, Math.min(maxPanY, prev.y + svgDy)),
      };
    });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Fail gracefully if pointer capture was already released by browser
    }
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    handleZoom(delta);
  };

  const hoveredPath = WORLD_COUNTRIES_PATHS.find((p) => p.id === hoveredCountryId || p.code === hoveredCountryId);
  const hoveredProfile = hoveredPath?.code ? countryByCode.get(hoveredPath.code) : null;
  const activeCountryMetrics =
    selectedCountry.history[selectedYear] ||
    selectedCountry.history[2026] ||
    selectedCountry.history[2025];

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="apple-card p-4 flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Granularity switch */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Granularity:
            </span>
            <div className="flex rounded-full p-1 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] shadow-inner text-xs">
              <button
                type="button"
                onClick={() => onGranularityChange('country')}
                className={`rounded-full px-3.5 py-1 font-semibold transition-all duration-200 cursor-pointer ${
                  granularity === 'country'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                By Country
              </button>
              <button
                type="button"
                onClick={() => onGranularityChange('bloc')}
                className={`rounded-full px-3.5 py-1 font-semibold transition-all duration-200 cursor-pointer ${
                  granularity === 'bloc'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                By Economic Bloc (G7, BRICS+)
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyMapLink}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border shadow-sm cursor-pointer active:scale-95 ${
              hasCopiedMapLink
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/[0.12]'
            }`}
            title="Copy shareable link to this map metric & country selection"
          >
            {hasCopiedMapLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Map Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                <span>Share Map View</span>
              </>
            )}
          </button>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(Object.keys(metricLabels) as MapMetricType[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleSetMetric(m)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-all duration-150 cursor-pointer ${
                activeMetric === m
                  ? 'bg-sky-500/20 text-sky-800 dark:text-sky-200 border-sky-500/40 dark:border-sky-400/40 shadow-sm font-semibold'
                  : 'border-slate-200 dark:border-white/[0.08] bg-slate-100/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/[0.08]'
              }`}
            >
              {metricLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Geographic Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-8 apple-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-500 dark:text-sky-400" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Global Equal Earth Cartography ({selectedYear})
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-white/[0.08]">
                <Globe className="h-3 w-3" /> 178 Territories ({COUNTRIES_DATA.length} Modeled)
              </span>
            </div>

            {/* Regional Focus Quick Jumps */}
            <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto no-scrollbar max-w-full py-0.5">
              {Object.entries(REGION_PRESETS).map(([key, preset]) => {
                const isActive = activeRegion === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setInternalRegion(key);
                      onRegionChange?.(key);
                      setZoom(preset.zoom);
                      setPan(preset.pan);
                    }}
                    className={`rounded-full px-2.5 py-1 border transition-all duration-150 cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${
                      isActive
                        ? isLight
                          ? 'border-sky-500 bg-sky-500 text-white font-semibold shadow-sm'
                          : 'border-sky-400/50 bg-sky-500/20 text-sky-200 font-semibold shadow-sm'
                        : isLight
                        ? 'border-slate-300 bg-white/70 text-slate-700 hover:text-slate-900 hover:bg-white'
                        : 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.10]'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG Map Canvas with Equal Earth projection */}
          <div
            className={`relative aspect-[16/9] w-full rounded-2xl border transition-colors duration-200 overflow-hidden flex items-center justify-center shadow-inner ${
              isLight
                ? 'border-slate-300/80 bg-[#eef2f6]'
                : 'border-white/[0.08] bg-[#06080e]'
            }`}
          >
            {/* Zoom Controls with touch-friendly 38px tap boundaries */}
            <div
              className={`absolute top-3 right-3 z-10 flex flex-col items-center gap-1 rounded-full border p-1 shadow-lg backdrop-blur-xl ${
                isLight
                  ? 'border-slate-300 bg-white/90 text-slate-700'
                  : 'border-white/[0.12] bg-black/60 text-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  handleZoom(0.5);
                  setIsMapTouchActive(true);
                }}
                className={`rounded-full p-2 sm:p-1.5 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center active:scale-95 ${
                  isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-white/20 text-slate-200'
                }`}
                title="Zoom In"
              >
                <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  handleZoom(-0.5);
                  setIsMapTouchActive(true);
                }}
                className={`rounded-full p-2 sm:p-1.5 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center active:scale-95 ${
                  isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-white/20 text-slate-200'
                }`}
                title="Zoom Out"
              >
                <Minus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className={`rounded-full p-2 sm:p-1.5 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center active:scale-95 ${
                  isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-white/20 text-slate-200'
                }`}
                title="Reset View"
              >
                <RotateCcw className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </button>
              <span
                className={`text-[9px] font-mono border-t pt-1 px-1 ${
                  isLight ? 'text-slate-500 border-slate-300' : 'text-slate-500 border-slate-800'
                }`}
              >
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Desktop Drag & zoom guidance badge */}
            <div
              className={`absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] backdrop-blur pointer-events-none shadow-sm ${
                isLight
                  ? 'border-slate-300 bg-white/90 text-slate-700'
                  : 'border-slate-800/80 bg-[#121622]/80 text-slate-400'
              }`}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>Drag canvas to pan • Scroll or buttons to zoom</span>
            </div>

            {/* Mobile Touch Map Pan vs Page Scroll toggle */}
            <button
              type="button"
              onClick={() => setIsMapTouchActive((prev) => !prev)}
              className={`absolute bottom-3 left-3 z-10 flex sm:hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-xl border shadow-md transition-all active:scale-95 ${
                isMapTouchActive
                  ? 'bg-sky-500 text-white border-sky-400'
                  : isLight
                  ? 'bg-white/90 text-slate-800 border-slate-300'
                  : 'bg-black/75 text-slate-200 border-white/20'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isMapTouchActive ? 'bg-white animate-pulse' : 'bg-emerald-400'}`} />
              <span>{isMapTouchActive ? 'Lock to Scroll Page' : 'Tap to Pan Map'}</span>
            </button>

            <svg
              ref={svgRef}
              viewBox="0 0 960 500"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
              className={`w-full h-full select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{
                filter: isLight ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
                touchAction: isMapTouchActive ? 'none' : 'pan-y',
              }}
            >
              <defs>
                <filter id="glow-selected" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g
                transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                className={isDragging ? '' : 'transition-transform duration-300 ease-out'}
              >
                {/* Global sphere ocean boundary */}
                <path
                  d={SPHERE_PATH}
                  fill={isLight ? '#e2e8f0' : '#080a12'}
                  stroke={isLight ? '#cbd5e1' : '#1c2538'}
                  strokeWidth="1"
                />

                {/* Graticule lines (latitude & longitude parallels) */}
                <path
                  d={GRATICULE_PATH}
                  fill="none"
                  stroke={isLight ? '#cbd5e1' : '#121826'}
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                  opacity={isLight ? 0.7 : 1}
                />

                {/* All world country polygons */}
                {WORLD_COUNTRIES_PATHS.map((country, idx) => {
                  const isModeled = country.code !== '' && countryByCode.has(country.code);
                  const isSelected = selectedCountryCode === country.code && granularity === 'country';
                  const isBlocMember = granularity === 'bloc' && country.code !== '' && selectedBloc.memberCodes.includes(country.code);
                  const isHovered = hoveredCountryId === country.id || (country.code !== '' && hoveredCountryId === country.code);

                  const fillColor = isModeled
                    ? getFeatureFill(country.code)
                    : isLight
                    ? '#cbd5e1'
                    : '#141a26';

                  return (
                    <path
                      key={country.id || country.code || `country-${idx}`}
                      d={country.path}
                      fill={fillColor}
                      stroke={
                        isSelected
                          ? isLight ? '#0f172a' : '#ffffff'
                          : isBlocMember
                          ? selectedBloc.color
                          : isHovered
                          ? '#0284c7'
                          : isLight
                          ? '#94a3b8'
                          : '#1e283b'
                      }
                      strokeWidth={isSelected ? 1.8 : isBlocMember ? 1.4 : isHovered ? 1.2 : 0.6}
                      className="cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        if (hasMovedRef.current) return;
                        if (isModeled) {
                          handleSetCountry(country.code);
                          if (granularity === 'bloc') onGranularityChange('country');
                        }
                      }}
                      onMouseEnter={() => setHoveredCountryId(country.code || country.id)}
                      onMouseLeave={() => setHoveredCountryId(null)}
                      style={{
                        filter: isSelected || isBlocMember ? 'url(#glow-selected)' : undefined,
                      }}
                    />
                  );
                })}

                {/* Centroid beacons and markers for selected and bloc-active nations */}
                {WORLD_COUNTRIES_PATHS.filter((p) => p.code !== '').map((p) => {
                  const country = countryByCode.get(p.code);
                  if (!country) return null;

                  const isSelected = selectedCountryCode === p.code && granularity === 'country';
                  const isBlocMember = granularity === 'bloc' && selectedBloc.memberCodes.includes(p.code);
                  const isHovered = hoveredCountryId === p.code || hoveredCountryId === p.id;
                  const isProminent = isSelected || isBlocMember || isHovered;

                  if (!isProminent) return null;

                  const [cx, cy] = p.centroid;

                  return (
                    <g key={`beacon-${p.code}`} className="pointer-events-none select-none">
                      {/* Outer pulse */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="none"
                        stroke={isBlocMember ? selectedBloc.color : '#10b981'}
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                        className="animate-spin-slow"
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={isBlocMember ? selectedBloc.color : '#ffffff'}
                        stroke="#090a0f"
                        strokeWidth="1"
                      />
                      {/* Country Flag & Code label badge */}
                      <g transform={`translate(${cx}, ${cy - 14})`}>
                        <rect
                          x={-22}
                          y={-9}
                          width={44}
                          height={14}
                          rx={3}
                          fill={isLight ? '#ffffff' : '#090b10'}
                          stroke={isBlocMember ? selectedBloc.color : isLight ? '#059669' : '#10b981'}
                          strokeWidth="0.8"
                          opacity="0.95"
                        />
                        <text
                          x={0}
                          y={2}
                          textAnchor="middle"
                          fill={isLight ? '#0f172a' : '#ffffff'}
                          fontSize="8.5"
                          fontWeight="bold"
                        >
                          {country.flag} {p.code}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Floating Tooltip in SVG */}
              {hoveredPath && (
                <g
                  className="pointer-events-none select-none"
                  transform={`translate(${Math.min(780, Math.max(180, hoveredPath.centroid[0]))}, ${
                    hoveredPath.centroid[1] > 380
                      ? hoveredPath.centroid[1] - 42
                      : hoveredPath.centroid[1] + 28
                  })`}
                >
                  <rect
                    x={-105}
                    y={-18}
                    width={210}
                    height={36}
                    rx={6}
                    fill={isLight ? '#ffffff' : '#0e121d'}
                    stroke={isLight ? '#0284c7' : '#38bdf8'}
                    strokeWidth="1.2"
                    filter="url(#glow-selected)"
                    opacity="0.96"
                  />
                  <text
                    x={0}
                    y={-4}
                    textAnchor="middle"
                    fill={isLight ? '#0f172a' : '#ffffff'}
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {hoveredProfile ? `${hoveredProfile.flag} ${hoveredProfile.name}` : hoveredPath.name}
                  </text>
                  <text
                    x={0}
                    y={9}
                    textAnchor="middle"
                    fill={isLight ? '#0284c7' : '#38bdf8'}
                    fontSize="9"
                    fontWeight="600"
                  >
                    {hoveredProfile
                      ? `${metricLabels[activeMetric]}: ${getCountryMetricDisplay(hoveredProfile, activeMetric)}`
                      : 'Global Baseline / Unmodeled'}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Choropleth Heatmap Legend */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Scale:</span>
              <span className="font-mono-tabular text-[11px] text-slate-500 dark:text-slate-400">
                {formatMetricScaleValue(minVal, activeMetric)}
              </span>
              <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-[#132c2c] via-[#056b5e] to-[#10b981] border border-slate-300 dark:border-slate-700/60" />
              <span className="font-mono-tabular text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {formatMetricScaleValue(maxVal, activeMetric)}
              </span>
            </div>

            <span className="flex items-center gap-1 text-slate-500 text-[11px]">
              <Info className="h-3 w-3" /> Equal Earth area-preserving projection
            </span>
          </div>
        </div>

        {/* Country or Bloc Detail Inspector Card */}
        <div className="lg:col-span-4 space-y-4">
          {granularity === 'country' ? (
            <div className="apple-card p-5 sm:p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">{selectedCountry.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-300 font-medium">
                      {selectedCountry.region} • {activeCountryMetrics.populationMillion}M Pop.
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-white/[0.08] px-2.5 py-0.5 text-xs font-mono-tabular text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/[0.12]">
                  {selectedCountry.code}
                </span>
              </div>

              {/* 01 / Household Wealth & Distribution */}
              <div className="space-y-1.5 border-t border-slate-200/80 dark:border-white/[0.08] pt-3 text-xs">
                <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                  01 / Household Wealth &amp; Inequality
                </span>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-slate-600 dark:text-slate-300">Total Net Wealth:</span>
                  <span className="font-mono-tabular font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(adjustValue(activeCountryMetrics.totalWealthTrillion, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-slate-600 dark:text-slate-300">Wealth per Adult (Mean):</span>
                  <span className="font-mono-tabular font-bold text-slate-900 dark:text-white">
                    {formatCurrency(adjustValue(activeCountryMetrics.wealthPerAdultUSD, selectedYear, currencyPerspective), { compact: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-slate-600 dark:text-slate-300">Median Wealth (50th %):</span>
                  <span className="font-mono-tabular font-bold text-sky-600 dark:text-sky-400">
                    {formatCurrency(adjustValue(activeCountryMetrics.medianWealthUSD, selectedYear, currencyPerspective), { compact: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-300">Wealth Gini Index:</span>
                  <span className="font-mono-tabular font-semibold text-amber-600 dark:text-amber-300">
                    {activeCountryMetrics.gini.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 02 / Growth, Output & Monetary Policy */}
              <div className="space-y-1.5 border-t border-slate-200/80 dark:border-white/[0.08] pt-3 mt-3 text-xs">
                <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
                  02 / Output, Growth &amp; Monetary Stance
                </span>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-slate-600 dark:text-slate-300">Annual Gross GDP / Per Cap:</span>
                  <span className="font-mono-tabular font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(adjustValue(activeCountryMetrics.gdpTrillionUSD, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true })} • {formatCurrency(adjustValue(activeCountryMetrics.gdpPerCapitaUSD, selectedYear, currencyPerspective), { compact: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-slate-600 dark:text-slate-300">Real GDP Growth (YoY):</span>
                  <span className={`font-mono-tabular font-bold ${activeCountryMetrics.realGdpGrowth >= 2.5 ? 'text-emerald-600 dark:text-emerald-400' : activeCountryMetrics.realGdpGrowth < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {activeCountryMetrics.realGdpGrowth > 0 ? '+' : ''}{activeCountryMetrics.realGdpGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-slate-600 dark:text-slate-300">CPI Inflation / Policy Rate:</span>
                  <span className="font-mono-tabular font-semibold text-slate-800 dark:text-slate-200">
                    {formatPercent(activeCountryMetrics.inflationRate)} • CB {formatPercent(activeCountryMetrics.policyRate)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-300">10Y Sovereign Bond Yield:</span>
                  <span className="font-mono-tabular font-semibold text-slate-800 dark:text-slate-200">
                    {formatPercent(activeCountryMetrics.bondYield10Y)}
                  </span>
                </div>
              </div>

              {/* 03 / Fiscal, External & Demographics */}
              <div className="space-y-1.5 border-t border-slate-200/80 dark:border-white/[0.08] pt-3 mt-3 text-xs">
                <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  03 / Fiscal, External &amp; Demographics
                </span>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-slate-600 dark:text-slate-300">Debt-to-GDP / Fiscal Bal:</span>
                  <span className="font-mono-tabular font-semibold text-slate-800 dark:text-slate-200">
                    {formatPercent(activeCountryMetrics.debtToGdp)} • {activeCountryMetrics.fiscalBalancePercentGdp > 0 ? '+' : ''}{activeCountryMetrics.fiscalBalancePercentGdp.toFixed(1)}% GDP
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/[0.05]">
                  <span className="text-slate-600 dark:text-slate-300">Current Account / FX Res:</span>
                  <span className="font-mono-tabular font-semibold text-slate-800 dark:text-slate-200">
                    {activeCountryMetrics.currentAccountPercentGdp > 0 ? '+' : ''}{activeCountryMetrics.currentAccountPercentGdp.toFixed(1)}% GDP • ${activeCountryMetrics.fxReservesBillionUSD}B
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600 dark:text-slate-300">Unemployment / Old-Age Dep:</span>
                  <span className="font-mono-tabular font-semibold text-slate-800 dark:text-slate-200">
                    {formatPercent(activeCountryMetrics.labor?.unemploymentRate ?? 0)} • {activeCountryMetrics.oldAgeDependencyRatio.toFixed(1)}% (65+/WA)
                  </span>
                </div>
              </div>

              {/* Asset Mix Breakdown */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
                <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
                  04 / Household Asset Mix
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-100/80 dark:bg-white/[0.04] p-2.5 border border-slate-200/80 dark:border-white/[0.08]">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Financial Assets</span>
                    <span className="font-mono-tabular font-bold text-sky-600 dark:text-sky-400">
                      {formatPercent(activeCountryMetrics.assetMix.financialShare)}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-100/80 dark:bg-white/[0.04] p-2.5 border border-slate-200/80 dark:border-white/[0.08]">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Real Estate / Land</span>
                    <span className="font-mono-tabular font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPercent(activeCountryMetrics.assetMix.nonFinancialShare)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Compare in Duel */}
              <a
                href="#country-comparison"
                onClick={() => {
                  onCompareCountry?.(selectedCountry.code);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/15 px-4 py-2.5 text-xs font-semibold text-sky-700 dark:text-sky-200 hover:bg-sky-500/25 hover:text-sky-900 dark:hover:text-white transition-all shadow-sm"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span>Compare {selectedCountry.name} in Macro Duel</span>
              </a>
            </div>
          ) : (
            <div className="apple-card p-5 sm:p-6 transition-all duration-300">
              <div className="mb-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Economic Bloc Profile
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-1">{selectedBloc.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-normal">
                  {selectedBloc.description}
                </p>
              </div>

              {/* Bloc selector */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {ECONOMIC_BLOCS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSetBloc(b.id)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all duration-150 cursor-pointer ${
                      selectedBlocId === b.id
                        ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 dark:border-amber-400/40 font-semibold shadow-sm'
                        : 'border-slate-200/80 dark:border-white/[0.08] bg-slate-100/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    {b.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Bloc Metrics */}
              {(() => {
                const blocMetric = selectedBloc.history[selectedYear] || selectedBloc.history[2026] || selectedBloc.history[2025];
                return (
                  <div className="space-y-2 border-t border-slate-200/80 dark:border-white/[0.08] pt-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/[0.05]">
                      <span className="text-slate-600 dark:text-slate-300">Total Bloc Wealth:</span>
                      <span className="font-mono-tabular font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(adjustValue(blocMetric.totalWealthTrillion, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/[0.05]">
                      <span className="text-slate-600 dark:text-slate-300">Global Wealth Share:</span>
                      <span className="font-mono-tabular font-bold text-slate-900 dark:text-white">
                        {formatPercent(blocMetric.globalWealthShare)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/[0.05]">
                      <span className="text-slate-600 dark:text-slate-300">Global GDP Share:</span>
                      <span className="font-mono-tabular font-bold text-sky-600 dark:text-sky-400">
                        {formatPercent(blocMetric.globalGdpShare)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-white/[0.05]">
                      <span className="text-slate-600 dark:text-slate-300">Bloc Population:</span>
                      <span className="font-mono-tabular font-semibold text-slate-800 dark:text-slate-200">
                        {(blocMetric.populationMillion / 1000).toFixed(2)} Billion
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-600 dark:text-slate-300">Average Wealth / Adult:</span>
                      <span className="font-mono-tabular font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(adjustValue(blocMetric.wealthPerAdultUSD, selectedYear, currencyPerspective), { compact: true })}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick country search filter list */}
          <div className="apple-card p-4">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search sovereign economy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-white/[0.04] pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-colors"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    handleSetCountry(c.code);
                    if (granularity === 'bloc') onGranularityChange('country');
                  }}
                  onMouseEnter={() => setHoveredCountryId(c.code)}
                  onMouseLeave={() => setHoveredCountryId(null)}
                  className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedCountryCode === c.code && granularity === 'country'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/25'
                      : hoveredCountryId === c.code
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-sky-600 dark:text-sky-400 font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  <span className="font-mono-tabular text-[11px] text-slate-400 dark:text-slate-500">
                    {getCountryMetricDisplay(c, activeMetric)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
