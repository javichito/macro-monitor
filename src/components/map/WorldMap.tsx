'use client';

import React, { useState, useMemo } from 'react';
import { COUNTRIES_DATA, ECONOMIC_BLOCS } from '../../data/country-metrics';
import { WORLD_COUNTRIES_PATHS, SPHERE_PATH, GRATICULE_PATH } from './world-paths';
import { CountryProfile, EconomicBloc, Granularity, CurrencyPerspective } from '../../lib/types';
import { formatCurrency, formatPercent, adjustValue } from '../../lib/formatters';
import { MapPin, Search, Info, Globe, Plus, Minus, RotateCcw } from 'lucide-react';

interface WorldMapProps {
  selectedYear: number;
  currencyPerspective: CurrencyPerspective;
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
}

type MetricType =
  | 'totalWealth'
  | 'wealthPerAdult'
  | 'medianWealth'
  | 'gdp'
  | 'inflation'
  | 'debtToGdp'
  | 'gini';

interface RegionPreset {
  name: string;
  zoom: number;
  pan: { x: number; y: number };
}

const REGION_PRESETS: Record<string, RegionPreset> = {
  global: { name: 'World', zoom: 1, pan: { x: 0, y: 0 } },
  americas: { name: 'Americas', zoom: 1.8, pan: { x: 300, y: -20 } },
  europe: { name: 'Europe', zoom: 2.8, pan: { x: -380, y: 150 } },
  asia: { name: 'Asia-Pacific', zoom: 2.0, pan: { x: -500, y: 0 } },
  mea: { name: 'Middle East & Africa', zoom: 2.2, pan: { x: -280, y: -50 } },
};

export function WorldMap({
  selectedYear,
  currencyPerspective,
  granularity,
  onGranularityChange,
}: WorldMapProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>('wealthPerAdult');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('USA');
  const [selectedBlocId, setSelectedBlocId] = useState<string>('g7');
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

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

  const metricLabels: Record<MetricType, string> = {
    totalWealth: 'Total Wealth ($T)',
    wealthPerAdult: 'Wealth per Adult ($)',
    medianWealth: 'Median Wealth ($)',
    gdp: 'Gross Domestic Product ($T)',
    inflation: 'Inflation Rate (%)',
    debtToGdp: 'Sovereign Debt (% of GDP)',
    gini: 'Wealth Gini Index',
  };

  const getRawMetricValue = (country: CountryProfile, metric: MetricType): number => {
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
      case 'inflation':
        return historyData.inflationRate;
      case 'debtToGdp':
        return historyData.debtToGdp;
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

  const getCountryMetricDisplay = (country: CountryProfile, metric: MetricType) => {
    const historyData = country.history[selectedYear] || country.history[2026] || country.history[2025];
    switch (metric) {
      case 'totalWealth':
        return formatCurrency(adjustValue(historyData.totalWealthTrillion, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true });
      case 'wealthPerAdult':
        return formatCurrency(adjustValue(historyData.wealthPerAdultUSD, selectedYear, currencyPerspective), { compact: true });
      case 'medianWealth':
        return formatCurrency(adjustValue(historyData.medianWealthUSD, selectedYear, currencyPerspective), { compact: true });
      case 'gdp':
        return formatCurrency(adjustValue(historyData.gdpTrillionUSD, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true });
      case 'inflation':
        return formatPercent(historyData.inflationRate);
      case 'debtToGdp':
        return formatPercent(historyData.debtToGdp);
      case 'gini':
        return historyData.gini.toFixed(2);
    }
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

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(4, Math.max(1, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const hoveredPath = WORLD_COUNTRIES_PATHS.find((p) => p.id === hoveredCountryId || p.code === hoveredCountryId);
  const hoveredProfile = hoveredPath?.code ? countryByCode.get(hoveredPath.code) : null;

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-[#242b3d] bg-[#12151e] p-4">
        {/* Granularity switch */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Granularity:
          </span>
          <div className="flex rounded-lg border border-[#242b3d] bg-[#181c27] p-0.5 text-xs">
            <button
              onClick={() => onGranularityChange('country')}
              className={`rounded px-3 py-1 font-medium transition-colors ${
                granularity === 'country'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              By Country
            </button>
            <button
              onClick={() => onGranularityChange('bloc')}
              className={`rounded px-3 py-1 font-medium transition-colors ${
                granularity === 'bloc'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              By Economic Bloc (G7, BRICS+)
            </button>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {(Object.keys(metricLabels) as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                activeMetric === m
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'border-slate-800 bg-[#161a26] text-slate-400 hover:text-slate-200'
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
        <div className="lg:col-span-8 rounded-xl border border-[#242b3d] bg-[#12151e] p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">
                Global Equal Earth Cartography ({selectedYear})
              </h4>
              <span className="inline-flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-slate-700/60">
                <Globe className="h-3 w-3" /> 178 Territories (31 Modeled)
              </span>
            </div>

            {/* Regional Focus Quick Jumps */}
            <div className="flex items-center gap-1 text-[11px]">
              {Object.entries(REGION_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => {
                    setZoom(preset.zoom);
                    setPan(preset.pan);
                  }}
                  className="rounded px-2 py-0.5 border border-slate-800 bg-[#161a26] text-slate-400 hover:text-white transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Map Canvas with Equal Earth projection */}
          <div className="relative aspect-[16/9] w-full rounded-lg border border-slate-800/80 bg-[#090b11] overflow-hidden flex items-center justify-center">
            {/* Zoom Controls */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 rounded-md border border-slate-800 bg-[#121622]/90 p-1 shadow-lg backdrop-blur">
              <button
                onClick={() => handleZoom(0.5)}
                className="rounded p-1 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Zoom In"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleZoom(-0.5)}
                className="rounded p-1 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="rounded p-1 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Reset View"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <svg
              viewBox="0 0 960 500"
              className="w-full h-full select-none cursor-grab active:cursor-grabbing"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}
            >
              <defs>
                <filter id="glow-selected" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="transition-transform duration-300">
                {/* Global sphere ocean boundary */}
                <path d={SPHERE_PATH} fill="#080a12" stroke="#1c2538" strokeWidth="1" />

                {/* Graticule lines (latitude & longitude parallels) */}
                <path d={GRATICULE_PATH} fill="none" stroke="#121826" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* All world country polygons */}
                {WORLD_COUNTRIES_PATHS.map((country, idx) => {
                  const isModeled = country.code !== '' && countryByCode.has(country.code);
                  const isSelected = selectedCountryCode === country.code && granularity === 'country';
                  const isBlocMember = granularity === 'bloc' && country.code !== '' && selectedBloc.memberCodes.includes(country.code);
                  const isHovered = hoveredCountryId === country.id || (country.code !== '' && hoveredCountryId === country.code);

                  const fillColor = isModeled ? getFeatureFill(country.code) : '#141a26';

                  return (
                    <path
                      key={country.id || country.code || `country-${idx}`}
                      d={country.path}
                      fill={fillColor}
                      stroke={
                        isSelected
                          ? '#ffffff'
                          : isBlocMember
                          ? selectedBloc.color
                          : isHovered
                          ? '#38bdf8'
                          : '#1e283b'
                      }
                      strokeWidth={isSelected ? 1.8 : isBlocMember ? 1.4 : isHovered ? 1.2 : 0.6}
                      className="cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        if (isModeled) {
                          setSelectedCountryCode(country.code);
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
                          fill="#090b10"
                          stroke={isBlocMember ? selectedBloc.color : '#10b981'}
                          strokeWidth="0.8"
                          opacity="0.95"
                        />
                        <text
                          x={0}
                          y={2}
                          textAnchor="middle"
                          fill="#ffffff"
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
                    x={-90}
                    y={-18}
                    width={180}
                    height={36}
                    rx={5}
                    fill="#0e121d"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    filter="url(#glow-selected)"
                    opacity="0.96"
                  />
                  <text x={0} y={-4} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                    {hoveredProfile ? `${hoveredProfile.flag} ${hoveredProfile.name}` : hoveredPath.name}
                  </text>
                  <text x={0} y={9} textAnchor="middle" fill="#38bdf8" fontSize="9">
                    {hoveredProfile
                      ? `${metricLabels[activeMetric]}: ${getCountryMetricDisplay(hoveredProfile, activeMetric)}`
                      : 'Global Baseline / Unmodeled'}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Choropleth Heatmap Legend */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Scale:</span>
              <span className="font-mono text-[11px] text-slate-400">
                {formatCurrency(adjustValue(minVal, selectedYear, currencyPerspective), { compact: true })}
              </span>
              <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-[#132c2c] via-[#056b5e] to-[#10b981] border border-slate-700/60" />
              <span className="font-mono text-[11px] text-emerald-400 font-bold">
                {formatCurrency(adjustValue(maxVal, selectedYear, currencyPerspective), { compact: true })}
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
            <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedCountry.name}</h3>
                    <span className="text-xs text-slate-400">{selectedCountry.region}</span>
                  </div>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300 border border-slate-700">
                  {selectedCountry.code}
                </span>
              </div>

              {/* Metrics list */}
              <div className="space-y-2.5 border-t border-slate-800 pt-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Net Wealth:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(adjustValue(selectedCountry.history[selectedYear]?.totalWealthTrillion ?? 0, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Wealth per Adult:</span>
                  <span className="font-bold text-white">
                    {formatCurrency(adjustValue(selectedCountry.history[selectedYear]?.wealthPerAdultUSD ?? 0, selectedYear, currencyPerspective), { compact: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Median Wealth:</span>
                  <span className="font-bold text-cyan-400">
                    {formatCurrency(adjustValue(selectedCountry.history[selectedYear]?.medianWealthUSD ?? 0, selectedYear, currencyPerspective), { compact: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Annual Gross GDP:</span>
                  <span className="font-semibold text-slate-200">
                    {formatCurrency(adjustValue(selectedCountry.history[selectedYear]?.gdpTrillionUSD ?? 0, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Debt-to-GDP Ratio:</span>
                  <span className="font-semibold text-slate-200">
                    {formatPercent(selectedCountry.history[selectedYear]?.debtToGdp ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Wealth Gini Index:</span>
                  <span className="font-semibold text-amber-400 font-mono">
                    {(selectedCountry.history[selectedYear]?.gini ?? 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Annual Inflation:</span>
                  <span className="font-semibold text-slate-200">
                    {formatPercent(selectedCountry.history[selectedYear]?.inflationRate ?? 0)}
                  </span>
                </div>
              </div>

              {/* Asset Mix Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Balance Sheet Composition
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Financial Assets</span>
                    <span className="font-bold text-cyan-400">
                      {formatPercent(selectedCountry.history[selectedYear]?.assetMix.financialShare ?? 50)}
                    </span>
                  </div>
                  <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Real Estate / Land</span>
                    <span className="font-bold text-emerald-400">
                      {formatPercent(selectedCountry.history[selectedYear]?.assetMix.nonFinancialShare ?? 50)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-5">
              <div className="mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Economic Bloc Profile
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedBloc.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedBloc.description}
                </p>
              </div>

              {/* Bloc selector */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {ECONOMIC_BLOCS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBlocId(b.id)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      selectedBlocId === b.id
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
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
                  <div className="space-y-3 border-t border-slate-800 pt-3 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Total Bloc Wealth:</span>
                      <span className="font-bold text-emerald-400">
                        {formatCurrency(adjustValue(blocMetric.totalWealthTrillion, selectedYear, currencyPerspective) * 1_000_000_000_000, { compact: true })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Global Wealth Share:</span>
                      <span className="font-bold text-white">
                        {formatPercent(blocMetric.globalWealthShare)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Global GDP Share:</span>
                      <span className="font-bold text-cyan-400">
                        {formatPercent(blocMetric.globalGdpShare)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800">
                      <span className="text-slate-400">Bloc Population:</span>
                      <span className="font-semibold text-slate-200">
                        {(blocMetric.populationMillion / 1000).toFixed(2)} Billion
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Average Wealth / Adult:</span>
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(adjustValue(blocMetric.wealthPerAdultUSD, selectedYear, currencyPerspective), { compact: true })}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick country search filter list */}
          <div className="rounded-xl border border-[#242b3d] bg-[#12151e] p-4">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search sovereign economy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-[#161a26] pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setSelectedCountryCode(c.code);
                    if (granularity === 'bloc') onGranularityChange('country');
                  }}
                  onMouseEnter={() => setHoveredCountryId(c.code)}
                  onMouseLeave={() => setHoveredCountryId(null)}
                  className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                    selectedCountryCode === c.code && granularity === 'country'
                      ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                      : hoveredCountryId === c.code
                      ? 'bg-slate-800 text-sky-400 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
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
