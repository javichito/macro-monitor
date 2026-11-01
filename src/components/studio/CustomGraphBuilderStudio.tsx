'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposedChart,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Cell,
} from 'recharts';
import {
  UNIVERSAL_METRIC_PILLARS,
  UNIVERSAL_METRICS_CATALOG,
  SERIES_PALETTE,
  CURATED_GRAPH_RECIPES,
  MetricPillarId,
  CustomChartType,
  DataTransformMode,
  CustomFormulaMode,
  CustomGraphSeriesSpec,
  SavedCustomGraph,
  buildAlignedGraphDataset,
  buildCrossCountrySnapshotDataset,
  getMetricDefinition,
  getSeriesDisplayName,
} from '../../data/universal-metrics-catalog';
import { COUNTRIES_DATA, ECONOMIC_BLOCS } from '../../data/country-metrics';
import { useApp, useThemeMode } from '../../context/AppContext';
import { DataExportMenu } from '../common/DataExportMenu';
import { ShareDeepLinkMenu } from '../common/ShareDeepLinkMenu';
import { PlainEnglishCard } from '../explainers/PlainEnglishCard';
import {
  deserializeCustomGraphStudio,
  useDeepLinkSync,
} from '../../lib/deep-link';
import {
  Plus,
  Trash2,
  Search,
  Sliders,
  BookmarkPlus,
  CheckCircle2,
  RotateCcw,
  Table as TableIcon,
  BarChart3,
  Globe2,
  ArrowRight,
  Copy,
  Sparkles,
} from 'lucide-react';

type StudioMode = 'timeseries' | 'cross-country';
type CanvasViewMode = 'chart' | 'table';
type CrossCountryChartMode = 'scatter' | 'bar';

const STORAGE_KEY_SAVED_GRAPHS = 'macro_custom_graphs_v1';

function serializeSeriesCompact(series: CustomGraphSeriesSpec[]): string {
  return series
    .map(
      (s) =>
        `${s.metricId}|${s.scopeCode || ''}|${s.yAxisId}|${s.chartStyle}|${encodeURIComponent(
          s.color
        )}`
    )
    .join(',');
}

function parseSeriesCompact(compact: string): CustomGraphSeriesSpec[] {
  if (!compact || !compact.trim()) return [];
  const parts = compact.split(',').slice(0, 4);
  const parsed: CustomGraphSeriesSpec[] = [];

  parts.forEach((raw, idx) => {
    const [metricId, scopeCode, yAxisId, chartStyle, rawColor] = raw.split('|');
    if (!metricId) return;
    const def = getMetricDefinition(metricId);
    parsed.push({
      key: `s${idx + 1}`,
      metricId: def.id,
      scopeCode: scopeCode ? scopeCode.toUpperCase() : def.isCountryScoped ? 'USA' : undefined,
      yAxisId: yAxisId === 'right' ? 'right' : 'left',
      chartStyle:
        chartStyle === 'area' || chartStyle === 'bar' || chartStyle === 'line'
          ? chartStyle
          : 'line',
      color: rawColor ? decodeURIComponent(rawColor) : SERIES_PALETTE[idx % SERIES_PALETTE.length],
    });
  });

  return parsed;
}

export function CustomGraphBuilderStudio() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const {
    selectedYear,
    currencyPerspective,
    completedChallenges,
    markChallengeCompleted,
  } = useApp();

  // Primary Studio Mode: Multi-Metric Time Series (1980–2026) vs. Cross-Country Arena
  const [studioMode, setStudioMode] = useState<StudioMode>('timeseries');
  const [canvasViewMode, setCanvasViewMode] = useState<CanvasViewMode>('chart');

  // Active Custom Graph Configuration
  const [graphTitle, setGraphTitle] = useState<string>('Money Supply vs. Home Prices');
  const [curiosityQuestion, setCuriosityQuestion] = useState<string>(
    'Does printing M2 money inflate residential house prices and household wealth?'
  );
  const [chartType, setChartType] = useState<CustomChartType>('composed');
  const [transformMode, setTransformMode] = useState<DataTransformMode>('indexed100');
  const [formulaMode, setFormulaMode] = useState<CustomFormulaMode>('none');
  const [leadLagYears, setLeadLagYears] = useState<number>(0);
  const [startYear, setStartYear] = useState<number>(2000);
  const [endYear, setEndYear] = useState<number>(2026);
  const [interpolateGaps, setInterpolateGaps] = useState<boolean>(true);

  const [series, setSeries] = useState<CustomGraphSeriesSpec[]>(
    CURATED_GRAPH_RECIPES[0].series
  );

  // Metric Catalog Browser Filter & Search State
  const [selectedPillar, setSelectedPillar] = useState<MetricPillarId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTargetSeriesIdx, setActiveTargetSeriesIdx] = useState<number>(0);

  // Cross-Country Snapshot Builder State
  const [countryMetricX, setCountryMetricX] = useState<string>('country:gdpPerCapitaUSD');
  const [countryMetricY, setCountryMetricY] = useState<string>('country:medianWealthUSD');
  const [crossCountryChartMode, setCrossCountryChartMode] =
    useState<CrossCountryChartMode>('scatter');

  // Predict-First Correlation Intuition Lab State
  const [predictedR, setPredictedR] = useState<number>(0.5);
  const [hasRevealedCorrelation, setHasRevealedCorrelation] = useState<boolean>(false);

  // User's Saved Custom Graphs Board (persisted in localStorage)
  const [savedGraphs, setSavedGraphs] = useState<SavedCustomGraph[]>(
    CURATED_GRAPH_RECIPES.slice(0, 3)
  );
  const [justPinnedBanner, setJustPinnedBanner] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  /*
   * Hydrate saved custom graphs from localStorage and restore deep-linked graph parameters
   * from URL query strings or hash fragments on initial mount.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const rawSaved = localStorage.getItem(STORAGE_KEY_SAVED_GRAPHS);
      if (rawSaved) {
        const parsed = JSON.parse(rawSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedGraphs(parsed);
        }
      }
    } catch {
      // Ignore storage access errors in private browsing
    }

    const restored = deserializeCustomGraphStudio();
    if (restored) {
      setChartType(restored.chartType);
      setTransformMode(restored.transformMode);
      setFormulaMode(restored.formulaMode);
      setLeadLagYears(restored.leadLagYears);
      setStartYear(restored.startYear);
      setEndYear(restored.endYear);
      const parsedSeries = parseSeriesCompact(restored.seriesCompact);
      if (parsedSeries.length > 0) {
        setSeries(parsedSeries);
      }
    }

    setIsHydrated(true);
  }, []);

  const deepLinkState = useMemo(
    () => ({
      chartType,
      transformMode,
      formulaMode,
      leadLagYears,
      startYear,
      endYear,
      seriesCompact: serializeSeriesCompact(series),
    }),
    [chartType, transformMode, formulaMode, leadLagYears, startYear, endYear, series]
  );

  useDeepLinkSync('studio', deepLinkState, isHydrated);

  // Compute aligned time-series dataset
  const alignedDataset = useMemo(() => {
    return buildAlignedGraphDataset({
      series,
      startYear,
      endYear,
      transformMode,
      formulaMode,
      leadLagYears,
      interpolateGaps,
      currencyPerspective,
    });
  }, [
    series,
    startYear,
    endYear,
    transformMode,
    formulaMode,
    leadLagYears,
    interpolateGaps,
    currencyPerspective,
  ]);

  // Compute cross-country snapshot dataset
  const crossCountryDataset = useMemo(() => {
    return buildCrossCountrySnapshotDataset({
      metricIdX: countryMetricX,
      metricIdY: countryMetricY,
      year: selectedYear,
      currencyPerspective,
    });
  }, [countryMetricX, countryMetricY, selectedYear, currencyPerspective]);

  // Filtered catalog for the interactive metric picker
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return UNIVERSAL_METRICS_CATALOG.filter((m) => {
      const matchesPillar = selectedPillar === 'all' || m.pillarId === selectedPillar;
      if (!matchesPillar) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.shortName.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.unit.toLowerCase().includes(q)
      );
    });
  }, [selectedPillar, searchQuery]);

  const countryScopedMetrics = useMemo(
    () => UNIVERSAL_METRICS_CATALOG.filter((m) => m.isCountryScoped),
    []
  );

  // Series manipulation handlers
  const handleAddSeries = (metricId?: string, scopeCode?: string) => {
    if (series.length >= 4) return;
    const nextIdx = series.length;
    const chosenId =
      metricId ||
      UNIVERSAL_METRICS_CATALOG[(nextIdx * 7) % UNIVERSAL_METRICS_CATALOG.length].id;
    const def = getMetricDefinition(chosenId);

    const newSpec: CustomGraphSeriesSpec = {
      key: `s${Date.now().toString(36).slice(-4)}${nextIdx + 1}`,
      metricId: def.id,
      scopeCode: scopeCode || (def.isCountryScoped ? 'USA' : undefined),
      color: SERIES_PALETTE[nextIdx % SERIES_PALETTE.length],
      yAxisId: nextIdx === 1 && transformMode === 'raw' ? 'right' : 'left',
      chartStyle: nextIdx === 0 ? 'area' : 'line',
    };

    const next = [...series, newSpec];
    setSeries(next);
    setActiveTargetSeriesIdx(next.length - 1);
  };

  const handleRemoveSeries = (idx: number) => {
    if (series.length <= 1) return;
    const next = series.filter((_, i) => i !== idx);
    setSeries(next);
    if (activeTargetSeriesIdx >= next.length) {
      setActiveTargetSeriesIdx(Math.max(0, next.length - 1));
    }
  };

  const handleUpdateSeries = (idx: number, patch: Partial<CustomGraphSeriesSpec>) => {
    setSeries((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const updated = { ...item, ...patch };
        if (patch.metricId) {
          const def = getMetricDefinition(patch.metricId);
          if (def.isCountryScoped && !updated.scopeCode) {
            updated.scopeCode = 'USA';
          } else if (!def.isCountryScoped) {
            updated.scopeCode = undefined;
          }
        }
        return updated;
      })
    );
  };

  const handleSelectMetricFromCatalog = (metricId: string) => {
    const targetIdx = Math.min(activeTargetSeriesIdx, series.length - 1);
    handleUpdateSeries(targetIdx, { metricId });
  };

  const handleCompareAnotherCountry = (baseSpec: CustomGraphSeriesSpec) => {
    if (series.length >= 4) return;
    const usedCodes = new Set(series.map((s) => s.scopeCode).filter(Boolean));
    const fallbackCountry =
      COUNTRIES_DATA.find((c) => !usedCodes.has(c.code)) || COUNTRIES_DATA[1];
    handleAddSeries(baseSpec.metricId, fallbackCountry.code);
  };

  const handleApplyRecipe = (recipe: SavedCustomGraph) => {
    setStudioMode('timeseries');
    setGraphTitle(recipe.title);
    setCuriosityQuestion(recipe.curiosityQuestion);
    setChartType(recipe.chartType);
    setTransformMode(recipe.transformMode);
    setFormulaMode(recipe.formulaMode);
    setLeadLagYears(recipe.leadLagYears);
    setStartYear(recipe.startYear);
    setEndYear(recipe.endYear);
    setInterpolateGaps(recipe.interpolateGaps);
    setSeries(recipe.series.map((s, idx) => ({ ...s, key: `s${idx + 1}` })));
    setHasRevealedCorrelation(false);
  };

  const handlePinCurrentGraph = () => {
    const newGraph: SavedCustomGraph = {
      id: `custom-${Date.now()}`,
      title:
        graphTitle.trim() ||
        alignedDataset.seriesMeta.map((m) => m.shortLabel).join(' vs. '),
      curiosityQuestion:
        curiosityQuestion.trim() ||
        `How does ${alignedDataset.seriesMeta[0]?.shortLabel || 'Series A'} interact with ${
          alignedDataset.seriesMeta[1]?.shortLabel || 'Series B'
        }?`,
      chartType,
      transformMode,
      formulaMode,
      leadLagYears,
      startYear,
      endYear,
      interpolateGaps,
      series: series.map((s, idx) => ({ ...s, key: `s${idx + 1}` })),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const nextSaved = [newGraph, ...savedGraphs].slice(0, 12);
    setSavedGraphs(nextSaved);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_GRAPHS, JSON.stringify(nextSaved));
    } catch {}

    markChallengeCompleted('studio-custom-graph-builder');
    setJustPinnedBanner(true);
    setTimeout(() => setJustPinnedBanner(false), 3000);
  };

  const handleDeleteSavedGraph = (id: string) => {
    const next = savedGraphs.filter((g) => g.id !== id);
    setSavedGraphs(next);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_GRAPHS, JSON.stringify(next));
    } catch {}
  };

  const handleRevealCorrelationCheck = () => {
    setHasRevealedCorrelation(true);
    markChallengeCompleted('studio-correlation-intuition');
  };

  const hasRightAxisSeries = useMemo(
    () =>
      transformMode === 'raw' &&
      (series.some((s) => s.yAxisId === 'right') || formulaMode !== 'none'),
    [series, transformMode, formulaMode]
  );

  // Scatter data for time-series X vs Y mode
  const scatterPairs = useMemo(() => {
    if (series.length < 2) return [];
    const keyX = series[0].key;
    const keyY = series[1].key;
    return alignedDataset.rows
      .filter((r) => typeof r[keyX] === 'number' && typeof r[keyY] === 'number')
      .map((r) => ({
        year: r.year,
        x: r[keyX] as number,
        y: r[keyY] as number,
        note: r.note,
      }));
  }, [alignedDataset.rows, series]);

  // Export columns for DataExportMenu
  const exportColumns = useMemo(() => {
    if (studioMode === 'cross-country') {
      return [
        { key: 'code', label: 'ISO Code' },
        { key: 'name', label: 'Country' },
        { key: 'region', label: 'Region' },
        {
          key: 'valueX',
          label: `${crossCountryDataset.defX.name} (${crossCountryDataset.defX.unit})`,
        },
        {
          key: 'valueY',
          label: `${crossCountryDataset.defY.name} (${crossCountryDataset.defY.unit})`,
        },
        { key: 'populationMillion', label: 'Population (M)' },
      ];
    }

    const cols = [{ key: 'year', label: 'Year' }];
    for (const meta of alignedDataset.seriesMeta) {
      cols.push({
        key: meta.key,
        label: `${meta.displayName} (${meta.unit})`,
      });
    }
    if (formulaMode !== 'none' && alignedDataset.formulaLabel) {
      cols.push({
        key: 'formulaValue',
        label: `${alignedDataset.formulaLabel} (${alignedDataset.formulaUnit})`,
      });
    }
    return cols;
  }, [studioMode, crossCountryDataset, alignedDataset, formulaMode]);

  const gridStroke = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.07)';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const isIntuitionMastered = completedChallenges.includes('studio-correlation-intuition');

  return (
    <div id="graph-studio" className="space-y-8">
      {/* Curated Discovery Recipes Strip */}
      <div className="apple-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
          <div>
            <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              01 / GRAPH WORKBENCH &amp; FIELD RECIPES ({UNIVERSAL_METRICS_CATALOG.length} CORE METRICS • 26 COUNTRIES)
            </span>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              What Happens When You Plot Any Two Economic Forces Together?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Pick a one-click investigation recipe below, or mix and match any metric from across the entire application—wealth pyramids, sovereign debt, central bank liquidity, mortgage rates, or energy burdens—to build your own custom graph.
            </p>
          </div>

          {/* Studio Mode Switcher: Time-Series vs. Cross-Country */}
          <div
            role="radiogroup"
            aria-label="Graph Builder Mode"
            className="grid grid-cols-1 sm:inline-flex w-full sm:w-auto rounded-2xl p-1 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] self-start lg:self-auto shrink-0 gap-1 sm:gap-0"
          >
            <button
              type="button"
              role="radio"
              aria-checked={studioMode === 'timeseries'}
              onClick={() => setStudioMode('timeseries')}
              className={`tactile-button flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-2.5 sm:py-2 min-h-[42px] sm:min-h-0 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                studioMode === 'timeseries'
                  ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 shrink-0" />
              <span>Time-Series Builder (1980–2026)</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={studioMode === 'cross-country'}
              onClick={() => setStudioMode('cross-country')}
              className={`tactile-button flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-2.5 sm:py-2 min-h-[42px] sm:min-h-0 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                studioMode === 'cross-country'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-700 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5 shrink-0" />
              <span>26-Country Snapshot ({selectedYear})</span>
            </button>
          </div>
        </div>

        {/* One-Click Curated Graph Recipes: Swipeable Snap Ribbon on Mobile, Grid on Tablet/Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
          {CURATED_GRAPH_RECIPES.map((recipe, idx) => {
            const isCurrent = graphTitle === recipe.title && studioMode === 'timeseries';
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => handleApplyRecipe(recipe)}
                className={`tactile-button min-w-[265px] max-w-[290px] sm:min-w-0 sm:max-w-none snap-start shrink-0 text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-sky-500/15 border-sky-500/50 dark:border-sky-400 shadow-sm'
                    : 'bg-slate-50/80 dark:bg-white/[0.025] border-slate-200 dark:border-white/[0.08] hover:border-sky-400/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      RECIPE 0{idx + 1} • {recipe.chartType.toUpperCase()}
                    </span>
                    <span className="font-mono-tabular text-[10px] px-2 py-0.5 rounded bg-slate-200/70 dark:bg-white/[0.07] text-slate-700 dark:text-slate-300">
                      {recipe.startYear}–{recipe.endYear}
                    </span>
                  </div>
                  <h3 className="font-editorial text-base font-bold text-slate-900 dark:text-white">
                    {recipe.curiosityQuestion}
                  </h3>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {recipe.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold shrink-0">
                    Plot <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {studioMode === 'timeseries' ? (
        <div className="flex flex-col gap-8">
          {/* Builder Controls: Series Slots + Universal Metric Catalog (ordered right below the live graph canvas on all viewports) */}
          <div id="studio-series-configurator" className="order-2 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 cols): Active Graph Series Slots & Formula Controls */}
            <div className="lg:col-span-5 apple-card p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3.5">
                <div>
                  <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-sky-500 block">
                    02 / ACTIVE GRAPH LAYERS ({series.length} OF 4)
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Configure Plotted Metrics
                  </h3>
                </div>

                {series.length < 4 && (
                  <button
                    type="button"
                    onClick={() => handleAddSeries()}
                    className="tactile-button inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-xl bg-sky-500 hover:bg-sky-400 text-white border-sky-700 text-xs font-bold cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Metric Layer</span>
                  </button>
                )}
              </div>

              {/* Series Cards */}
              <div className="space-y-3">
                {series.map((spec, idx) => {
                  const { displayName, def } = getSeriesDisplayName(spec);
                  const isTarget = activeTargetSeriesIdx === idx;

                  return (
                    <div
                      key={spec.key}
                      onClick={() => setActiveTargetSeriesIdx(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isTarget
                          ? 'bg-sky-500/[0.07] border-sky-500/50 dark:border-sky-400/60 ring-1 ring-sky-500/30'
                          : 'bg-slate-50/70 dark:bg-white/[0.025] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: spec.color }}
                          />
                          <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            0{idx + 1} / SERIES {String.fromCharCode(65 + idx)}
                          </span>
                          {isTarget && (
                            <span className="font-mono-tabular text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold">
                              Editing
                            </span>
                          )}
                        </div>

                        {series.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSeries(idx);
                            }}
                            aria-label={`Remove Series ${idx + 1}`}
                            title="Remove this series"
                            className="min-w-[34px] min-h-[34px] inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Metric Dropdown Selector */}
                      <div>
                        <label
                          htmlFor={`metric-select-${idx}`}
                          className="sr-only"
                        >
                          Select Metric for Series {idx + 1}
                        </label>
                        <select
                          id={`metric-select-${idx}`}
                          aria-label={`Select Metric for Series ${idx + 1}`}
                          value={spec.metricId}
                          onChange={(e) =>
                            handleUpdateSeries(idx, { metricId: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                        >
                          {UNIVERSAL_METRIC_PILLARS.map((pillar) => (
                            <optgroup key={pillar.id} label={pillar.indexLabel}>
                              {UNIVERSAL_METRICS_CATALOG.filter(
                                (m) => m.pillarId === pillar.id
                              ).map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.unit})
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      {/* Country / Economic Bloc Selector when a Sovereign Metric is selected */}
                      {def.isCountryScoped && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <div className="flex-1 min-w-[160px]">
                            <label
                              htmlFor={`country-select-${idx}`}
                              className="text-[10px] font-mono-tabular uppercase text-slate-500 dark:text-slate-400 block mb-1"
                            >
                              Sovereign Country / Bloc:
                            </label>
                            <select
                              id={`country-select-${idx}`}
                              aria-label={`Select Country or Bloc for Series ${idx + 1}`}
                              value={spec.scopeCode || 'USA'}
                              onChange={(e) =>
                                handleUpdateSeries(idx, { scopeCode: e.target.value })
                              }
                              className="w-full rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                            >
                              <optgroup label="Sovereign Countries (26)">
                                {COUNTRIES_DATA.map((c) => (
                                  <option key={c.code} value={c.code}>
                                    {c.flag} {c.name} ({c.code})
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="Economic Blocs (5)">
                                {ECONOMIC_BLOCS.map((b) => (
                                  <option key={b.id} value={b.id.toUpperCase()}>
                                    🌐 {b.name} ({b.id.toUpperCase()})
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>

                          {series.length < 4 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompareAnotherCountry(spec);
                              }}
                              className="tactile-button self-end px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                            >
                              + Compare Country
                            </button>
                          )}
                        </div>
                      )}

                      {/* Style, Axis & Color Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-200/60 dark:border-white/[0.06] text-[11px]">
                        {/* Style Selector (Line / Area / Bar) */}
                        <div className="inline-flex rounded-lg bg-slate-200/70 dark:bg-white/[0.06] p-0.5">
                          {(['line', 'area', 'bar'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateSeries(idx, { chartStyle: st });
                              }}
                              className={`min-h-[30px] px-2.5 py-1 rounded-md font-mono-tabular text-[10px] font-bold uppercase cursor-pointer ${
                                spec.chartStyle === st
                                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        {/* Left vs Right Y-Axis Toggle */}
                        <div className="inline-flex rounded-lg bg-slate-200/70 dark:bg-white/[0.06] p-0.5">
                          {(['left', 'right'] as const).map((ax) => (
                            <button
                              key={ax}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateSeries(idx, { yAxisId: ax });
                              }}
                              className={`min-h-[30px] px-2.5 py-1 rounded-md font-mono-tabular text-[10px] font-bold uppercase cursor-pointer ${
                                spec.yAxisId === ax
                                  ? 'bg-sky-500 text-white'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {ax} Axis
                            </button>
                          ))}
                        </div>

                        {/* Color Swatches (WCAG 2.5.8 28x28px hit target wrapping 16x16px visual dot) */}
                        <div className="flex items-center gap-0.5">
                          {SERIES_PALETTE.map((hex) => (
                            <button
                              key={hex}
                              type="button"
                              aria-label={`Set series ${idx + 1} color to ${hex}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateSeries(idx, { color: hex });
                              }}
                              className="min-w-[28px] min-h-[28px] p-1 inline-flex items-center justify-center rounded-full cursor-pointer"
                            >
                              <span
                                className={`h-4 w-4 rounded-full transition-transform ${
                                  spec.color === hex
                                    ? 'scale-125 ring-2 ring-white dark:ring-slate-200'
                                    : 'opacity-70 hover:opacity-100'
                                }`}
                                style={{ backgroundColor: hex }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        <strong className="text-slate-700 dark:text-slate-200">
                          {displayName}:
                        </strong>{' '}
                        {def.benchmarkNote}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (7 cols): Searchable Universal Metric Catalog Browser */}
            <div className="lg:col-span-7 apple-card p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-3.5">
                  <div className="space-y-1.5">
                    <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">
                      03 / UNIVERSAL METRIC CATALOG (ASSIGNING TO SERIES{' '}
                      {String.fromCharCode(65 + activeTargetSeriesIdx)})
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        Browse All {UNIVERSAL_METRICS_CATALOG.length} Supported Metrics
                      </h3>
                      {/* Quick Target Series Slot Switcher for Desktop Ergonomics */}
                      <div
                        role="group"
                        aria-label="Target Series Slot"
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-white/[0.05] p-1 border border-slate-200 dark:border-white/[0.08]"
                      >
                        {series.map((s, idx) => (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => setActiveTargetSeriesIdx(idx)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-mono-tabular text-[10px] font-bold transition-all cursor-pointer ${
                              activeTargetSeriesIdx === idx
                                ? 'bg-sky-500 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: s.color }}
                            />
                            <span>Slot {String.fromCharCode(65 + idx)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      aria-label="Search metrics by name, unit, or topic"
                      placeholder="Search GDP, Gold, Sahm, M2..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 min-h-[38px] rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] text-xs text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pillar Filter Pills: Single-Row Swipeable Ribbon on Mobile, Wrapped on Tablet/Desktop */}
                <div className="flex sm:flex-wrap gap-1.5 overflow-x-auto sm:overflow-visible pb-1.5 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                  <button
                    type="button"
                    onClick={() => setSelectedPillar('all')}
                    className={`tactile-button shrink-0 min-h-[34px] px-3 py-1 rounded-xl font-mono-tabular text-[11px] font-bold cursor-pointer ${
                      selectedPillar === 'all'
                        ? 'bg-sky-500 text-white border-sky-700'
                        : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    All Pillars ({UNIVERSAL_METRICS_CATALOG.length})
                  </button>
                  {UNIVERSAL_METRIC_PILLARS.map((p) => {
                    const count = UNIVERSAL_METRICS_CATALOG.filter(
                      (m) => m.pillarId === p.id
                    ).length;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPillar(p.id)}
                        className={`tactile-button shrink-0 min-h-[34px] px-3 py-1 rounded-xl font-mono-tabular text-[11px] font-bold cursor-pointer ${
                          selectedPillar === p.id
                            ? 'bg-sky-500 text-white border-sky-700'
                            : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/[0.08]'
                        }`}
                      >
                        {p.shortName} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] sm:max-h-[390px] overflow-y-auto pr-1">
                  {filteredCatalog.map((m) => {
                    const isPlotted = series.some((s) => s.metricId === m.id);
                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                          isPlotted
                            ? 'bg-sky-500/10 border-sky-500/40 dark:border-sky-400/50'
                            : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.07] hover:border-sky-400/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-mono-tabular text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300">
                              {m.unit}
                            </span>
                            {m.isCountryScoped && (
                              <span className="font-mono-tabular text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                26 Countries / 5 Blocs
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                            {m.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {m.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-white/[0.05]">
                          <span className="text-[10px] font-mono-tabular text-slate-400 truncate">
                            {m.benchmarkNote}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSelectMetricFromCatalog(m.id)}
                              className="tactile-button min-h-[30px] px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500 text-sky-600 dark:text-sky-300 hover:text-white border border-sky-500/30 font-mono-tabular text-[10px] font-bold cursor-pointer"
                            >
                              Set Series {String.fromCharCode(65 + activeTargetSeriesIdx)}
                            </button>
                            {series.length < 4 && !isPlotted && (
                              <button
                                type="button"
                                onClick={() => handleAddSeries(m.id)}
                                title="Add as new series layer"
                                aria-label={`Add ${m.name} as new series`}
                                className="tactile-button min-h-[30px] px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-300 hover:text-slate-950 border border-emerald-500/30 font-mono-tabular text-[10px] font-bold cursor-pointer"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mathematical Transformations, Custom Formula & Lead/Lag Controls */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Scale / Transformation */}
                <div>
                  <label
                    htmlFor="transform-mode-select"
                    className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1"
                  >
                    Data Transformation:
                  </label>
                  <select
                    id="transform-mode-select"
                    value={transformMode}
                    onChange={(e) => setTransformMode(e.target.value as DataTransformMode)}
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                  >
                    <option value="raw">Raw Units (Dual Axis Support)</option>
                    <option value="indexed100">Indexed Growth (Base 100 at Start)</option>
                    <option value="pctChange">Period % Rate of Change</option>
                    <option value="zScore">Z-Score (Std Deviations from Mean)</option>
                  </select>
                </div>

                {/* Derived Formula Line */}
                <div>
                  <label
                    htmlFor="formula-mode-select"
                    className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1"
                  >
                    Derived Formula (A vs B):
                  </label>
                  <select
                    id="formula-mode-select"
                    value={formulaMode}
                    onChange={(e) => setFormulaMode(e.target.value as CustomFormulaMode)}
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none cursor-pointer"
                  >
                    <option value="none">None (Plot Selected Series Only)</option>
                    <option value="ratio">Ratio (Series A ÷ Series B)</option>
                    <option value="spread">Spread / Gap (Series A − Series B)</option>
                    <option value="sum">Combined Sum (Series A + Series B)</option>
                  </select>
                </div>

                {/* Time Range Window */}
                <div>
                  <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Time Horizon ({startYear}–{endYear}):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <select
                      aria-label="Start Year"
                      value={startYear}
                      onChange={(e) =>
                        setStartYear(Math.min(Number(e.target.value), endYear - 2))
                      }
                      className="w-1/2 min-h-[38px] rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-2 py-2 text-xs font-mono-tabular font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      {[1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020].map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-slate-400">to</span>
                    <select
                      aria-label="End Year"
                      value={endYear}
                      onChange={(e) =>
                        setEndYear(Math.max(Number(e.target.value), startYear + 2))
                      }
                      className="w-1/2 min-h-[38px] rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-2 py-2 text-xs font-mono-tabular font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      {[2000, 2008, 2015, 2020, 2022, 2024, 2025, 2026].map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Graph Canvas & Toolbar (Visual-First order-1 so chart is immediately visible on both Desktop & Mobile) */}
          <div id="studio-graph-canvas" className="order-1 apple-card p-4 sm:p-6 space-y-5">
            {/* Graph Header, Custom Title Input, Chart Type Switcher & Export/Share */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30">
                    04 / INTERACTIVE GRAPH CANVAS
                  </span>
                  <span className="font-mono-tabular text-[11px] text-slate-500 dark:text-slate-400">
                    {startYear}–{endYear} • {currencyPerspective.toUpperCase()} USD Lens
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label htmlFor="custom-graph-question" className="sr-only">
                      Curiosity Question Headline
                    </label>
                    <input
                      id="custom-graph-question"
                      type="text"
                      value={curiosityQuestion}
                      onChange={(e) => setCuriosityQuestion(e.target.value)}
                      placeholder="Write your curiosity question..."
                      className="w-full font-editorial text-lg sm:text-2xl font-bold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-white/20 focus:border-sky-400 focus:outline-none pb-0.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="custom-graph-title" className="sr-only">
                      Short Graph Title
                    </label>
                    <input
                      id="custom-graph-title"
                      type="text"
                      value={graphTitle}
                      onChange={(e) => setGraphTitle(e.target.value)}
                      placeholder="Graph title for saving..."
                      className="w-full text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 bg-transparent border-b border-dashed border-slate-200 dark:border-white/15 focus:border-sky-400 focus:outline-none pb-1 mt-1 sm:mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Action Bar: Chart Type, Table Toggle, Pin to Board, Share & Export */}
              <div className="flex flex-wrap items-center gap-2 max-w-full">
                {/* Chart Type Selector: Horizontally Scrollable on Narrow Mobile Viewports */}
                <div
                  role="radiogroup"
                  aria-label="Chart Visualization Type"
                  className="flex overflow-x-auto max-w-full w-full sm:w-auto rounded-xl p-1 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs gap-0.5"
                >
                  {(
                    [
                      { id: 'composed', label: 'Multi' },
                      { id: 'line', label: 'Line' },
                      { id: 'area', label: 'Area' },
                      { id: 'bar', label: 'Bar' },
                      { id: 'stacked-area', label: 'Stacked' },
                      { id: 'scatter', label: 'Scatter (X/Y)' },
                    ] as Array<{ id: CustomChartType; label: string }>
                  ).map((ct) => (
                    <button
                      key={ct.id}
                      type="button"
                      role="radio"
                      aria-checked={chartType === ct.id}
                      onClick={() => {
                        setChartType(ct.id);
                        setCanvasViewMode('chart');
                      }}
                      className={`shrink-0 min-h-[34px] px-2.5 py-1 rounded-lg font-mono-tabular text-[11px] font-bold transition-all cursor-pointer ${
                        chartType === ct.id && canvasViewMode === 'chart'
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>

                {/* Accessible Data Table Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setCanvasViewMode((v) => (v === 'chart' ? 'table' : 'chart'))
                  }
                  className={`tactile-button min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    canvasViewMode === 'table'
                      ? 'bg-amber-500 text-slate-950 border-amber-700'
                      : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/[0.1]'
                  }`}
                >
                  <TableIcon className="h-3.5 w-3.5" />
                  <span>{canvasViewMode === 'table' ? 'Show Chart' : 'Data Table'}</span>
                </button>

                {/* Pin to My Graph Board */}
                <button
                  type="button"
                  onClick={handlePinCurrentGraph}
                  className="tactile-button min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-700 text-xs font-bold cursor-pointer"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  <span>{justPinnedBanner ? 'Pinned (+15 XP)!' : 'Pin to My Board'}</span>
                </button>

                <ShareDeepLinkMenu
                  simulator="studio"
                  state={deepLinkState}
                  label="Share Graph"
                />

                <DataExportMenu
                  filename={`custom-graph-${graphTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')}`}
                  title={graphTitle}
                  data={alignedDataset.rows as Record<string, any>[]}
                  columns={exportColumns}
                  metadata={{
                    question: curiosityQuestion,
                    chartType,
                    transformMode,
                    formulaMode,
                    currencyPerspective,
                  }}
                />
              </div>
            </div>

            {/* Direct Canvas Quick-Controls Bar: Scale, Derived Formula & Time Horizon Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.07] text-xs">
              {/* Scale / Transformation Quick Switcher */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Scale:
                </span>
                {(
                  [
                    { id: 'raw', label: 'Raw Units' },
                    { id: 'indexed100', label: 'Base 100' },
                    { id: 'pctChange', label: '% Change' },
                    { id: 'zScore', label: 'Z-Score' },
                  ] as Array<{ id: DataTransformMode; label: string }>
                ).map((tm) => (
                  <button
                    key={tm.id}
                    type="button"
                    onClick={() => setTransformMode(tm.id)}
                    className={`min-h-[28px] px-2.5 py-0.5 rounded-lg font-mono-tabular text-[11px] font-bold transition-all cursor-pointer ${
                      transformMode === tm.id
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-white dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-sky-400/50'
                    }`}
                  >
                    {tm.label}
                  </button>
                ))}
              </div>

              {/* Derived Formula Quick Switcher */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Formula:
                </span>
                {(
                  [
                    { id: 'none', label: 'None' },
                    { id: 'ratio', label: 'Ratio (A÷B)' },
                    { id: 'spread', label: 'Spread (A−B)' },
                    { id: 'sum', label: 'Sum (A+B)' },
                  ] as Array<{ id: CustomFormulaMode; label: string }>
                ).map((fm) => (
                  <button
                    key={fm.id}
                    type="button"
                    onClick={() => setFormulaMode(fm.id)}
                    className={`min-h-[28px] px-2.5 py-0.5 rounded-lg font-mono-tabular text-[11px] font-bold transition-all cursor-pointer ${
                      formulaMode === fm.id
                        ? 'bg-purple-500 text-white shadow-xs'
                        : 'bg-white dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-purple-400/50'
                    }`}
                  >
                    {fm.label}
                  </button>
                ))}
              </div>

              {/* Time Horizon Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Window:
                </span>
                {[
                  { label: 'Max (1980+)', start: 1980, end: 2026 },
                  { label: '2000–2026', start: 2000, end: 2026 },
                  { label: 'GFC (2008+)', start: 2008, end: 2026 },
                  { label: 'COVID (2020+)', start: 2020, end: 2026 },
                ].map((preset) => {
                  const isActivePreset =
                    startYear === preset.start && endYear === preset.end;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setStartYear(preset.start);
                        setEndYear(preset.end);
                      }}
                      className={`min-h-[28px] px-2.5 py-0.5 rounded-lg font-mono-tabular text-[11px] font-bold transition-all cursor-pointer ${
                        isActivePreset
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-white dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-amber-400/50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chart or Semantic Table View */}
            {canvasViewMode === 'chart' ? (
              <div className="h-72 sm:h-96 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'scatter' && series.length >= 2 ? (
                    <ScatterChart margin={{ top: 12, right: 12, left: -6, bottom: 12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name={alignedDataset.seriesMeta[0]?.shortLabel}
                        stroke={axisColor}
                        tick={{ fontSize: 11 }}
                        domain={['auto', 'auto']}
                        label={{
                          value: `${alignedDataset.seriesMeta[0]?.displayName} (${alignedDataset.seriesMeta[0]?.unit})`,
                          position: 'insideBottom',
                          offset: -6,
                          fontSize: 11,
                          fill: axisColor,
                        }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        width={46}
                        name={alignedDataset.seriesMeta[1]?.shortLabel}
                        stroke={axisColor}
                        tick={{ fontSize: 11 }}
                        domain={['auto', 'auto']}
                        label={{
                          value: `${alignedDataset.seriesMeta[1]?.shortLabel} (${alignedDataset.seriesMeta[1]?.unit})`,
                          angle: -90,
                          position: 'insideLeft',
                          fontSize: 11,
                          fill: axisColor,
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const pt = payload[0].payload;
                          return (
                            <div className="rounded-xl bg-slate-950/95 p-3 text-xs text-white shadow-xl border border-white/10 space-y-1 font-mono-tabular">
                              <div className="font-bold text-amber-300 border-b border-white/10 pb-1">
                                Year: {pt.year}
                              </div>
                              <div>
                                {alignedDataset.seriesMeta[0]?.shortLabel}:{' '}
                                <span className="font-bold text-sky-400">
                                  {pt.x} {alignedDataset.seriesMeta[0]?.unit}
                                </span>
                              </div>
                              <div>
                                {alignedDataset.seriesMeta[1]?.shortLabel}:{' '}
                                <span className="font-bold text-emerald-400">
                                  {pt.y} {alignedDataset.seriesMeta[1]?.unit}
                                </span>
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Scatter
                        name={`${alignedDataset.seriesMeta[0]?.shortLabel} vs ${alignedDataset.seriesMeta[1]?.shortLabel}`}
                        data={scatterPairs}
                        fill={series[0].color}
                      >
                        {scatterPairs.map((entry, idx) => (
                          <Cell
                            key={`cell-${entry.year}-${idx}`}
                            fill={
                              entry.year >= 2020
                                ? '#f59e0b'
                                : series[0]?.color || '#38bdf8'
                            }
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  ) : chartType === 'line' ? (
                    <LineChart
                      data={alignedDataset.rows}
                      margin={{ top: 8, right: hasRightAxisSeries ? 4 : 12, left: -8, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} minTickGap={24} />
                      <YAxis
                        yAxisId="left"
                        width={44}
                        stroke={axisColor}
                        tick={{ fontSize: 10 }}
                        domain={['auto', 'auto']}
                      />
                      {hasRightAxisSeries && (
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          width={44}
                          stroke={axisColor}
                          tick={{ fontSize: 10 }}
                          domain={['auto', 'auto']}
                        />
                      )}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#090d16' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#cbd5e1',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      {transformMode === 'indexed100' && (
                        <ReferenceLine
                          yAxisId="left"
                          y={100}
                          stroke="#94a3b8"
                          strokeDasharray="4 4"
                        />
                      )}
                      {alignedDataset.seriesMeta.map((m) => (
                        <Line
                          key={m.key}
                          yAxisId={hasRightAxisSeries ? m.yAxisId : 'left'}
                          type="monotone"
                          dataKey={m.key}
                          name={`${m.shortLabel} (${m.unit})`}
                          stroke={m.color}
                          strokeWidth={2.5}
                          dot={{ r: 3 }}
                          connectNulls
                        />
                      ))}
                      {formulaMode !== 'none' && alignedDataset.formulaLabel && (
                        <Line
                          yAxisId={hasRightAxisSeries ? 'right' : 'left'}
                          type="monotone"
                          dataKey="formulaValue"
                          name={alignedDataset.formulaLabel}
                          stroke="#c084fc"
                          strokeDasharray="5 3"
                          strokeWidth={2.5}
                          dot={{ r: 2.5 }}
                          connectNulls
                        />
                      )}
                    </LineChart>
                  ) : chartType === 'area' || chartType === 'stacked-area' ? (
                    <AreaChart
                      data={alignedDataset.rows}
                      margin={{ top: 8, right: hasRightAxisSeries ? 4 : 12, left: -8, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} minTickGap={24} />
                      <YAxis
                        yAxisId="left"
                        width={44}
                        stroke={axisColor}
                        tick={{ fontSize: 10 }}
                        domain={['auto', 'auto']}
                      />
                      {hasRightAxisSeries && chartType !== 'stacked-area' && (
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          width={44}
                          stroke={axisColor}
                          tick={{ fontSize: 10 }}
                          domain={['auto', 'auto']}
                        />
                      )}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#090d16' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#cbd5e1',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      {alignedDataset.seriesMeta.map((m) => (
                        <Area
                          key={m.key}
                          yAxisId={
                            hasRightAxisSeries && chartType !== 'stacked-area'
                              ? m.yAxisId
                              : 'left'
                          }
                          stackId={chartType === 'stacked-area' ? 'stack-1' : undefined}
                          type="monotone"
                          dataKey={m.key}
                          name={`${m.shortLabel} (${m.unit})`}
                          stroke={m.color}
                          fill={m.color}
                          fillOpacity={chartType === 'stacked-area' ? 0.55 : 0.2}
                          strokeWidth={2}
                          connectNulls
                        />
                      ))}
                    </AreaChart>
                  ) : chartType === 'bar' ? (
                    <BarChart
                      data={alignedDataset.rows}
                      margin={{ top: 8, right: hasRightAxisSeries ? 4 : 12, left: -8, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} minTickGap={24} />
                      <YAxis
                        yAxisId="left"
                        width={44}
                        stroke={axisColor}
                        tick={{ fontSize: 10 }}
                        domain={['auto', 'auto']}
                      />
                      {hasRightAxisSeries && (
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          width={44}
                          stroke={axisColor}
                          tick={{ fontSize: 10 }}
                          domain={['auto', 'auto']}
                        />
                      )}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#090d16' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#cbd5e1',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      {alignedDataset.seriesMeta.map((m) => (
                        <Bar
                          key={m.key}
                          yAxisId={hasRightAxisSeries ? m.yAxisId : 'left'}
                          dataKey={m.key}
                          name={`${m.shortLabel} (${m.unit})`}
                          fill={m.color}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  ) : (
                    <ComposedChart
                      data={alignedDataset.rows}
                      margin={{ top: 8, right: hasRightAxisSeries ? 4 : 12, left: -8, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} minTickGap={24} />
                      <YAxis
                        yAxisId="left"
                        width={44}
                        stroke={axisColor}
                        tick={{ fontSize: 10 }}
                        domain={['auto', 'auto']}
                      />
                      {hasRightAxisSeries && (
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          width={44}
                          stroke={axisColor}
                          tick={{ fontSize: 10 }}
                          domain={['auto', 'auto']}
                        />
                      )}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#090d16' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#cbd5e1',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      {transformMode === 'indexed100' && (
                        <ReferenceLine
                          yAxisId="left"
                          y={100}
                          stroke="#94a3b8"
                          strokeDasharray="4 4"
                        />
                      )}
                      {alignedDataset.seriesMeta.map((m) => {
                        const axis = hasRightAxisSeries ? m.yAxisId : 'left';
                        if (m.chartStyle === 'bar') {
                          return (
                            <Bar
                              key={m.key}
                              yAxisId={axis}
                              dataKey={m.key}
                              name={`${m.shortLabel} (${m.unit})`}
                              fill={m.color}
                              fillOpacity={0.75}
                              radius={[4, 4, 0, 0]}
                            />
                          );
                        }
                        if (m.chartStyle === 'area') {
                          return (
                            <Area
                              key={m.key}
                              yAxisId={axis}
                              type="monotone"
                              dataKey={m.key}
                              name={`${m.shortLabel} (${m.unit})`}
                              stroke={m.color}
                              fill={m.color}
                              fillOpacity={0.2}
                              strokeWidth={2.2}
                              connectNulls
                            />
                          );
                        }
                        return (
                          <Line
                            key={m.key}
                            yAxisId={axis}
                            type="monotone"
                            dataKey={m.key}
                            name={`${m.shortLabel} (${m.unit})`}
                            stroke={m.color}
                            strokeWidth={2.5}
                            dot={{ r: 3 }}
                            connectNulls
                          />
                        );
                      })}
                      {formulaMode !== 'none' && alignedDataset.formulaLabel && (
                        <Line
                          yAxisId={hasRightAxisSeries ? 'right' : 'left'}
                          type="monotone"
                          dataKey="formulaValue"
                          name={alignedDataset.formulaLabel}
                          stroke="#c084fc"
                          strokeDasharray="5 3"
                          strokeWidth={2.5}
                          dot={{ r: 2.5 }}
                          connectNulls
                        />
                      )}
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              /* Accessible Semantic HTML Data Table with Sticky First Column for Horizontal Mobile Scroll */
              <div className="overflow-x-auto max-h-96 rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <table className="w-full text-left border-collapse text-xs font-mono-tabular">
                  <caption className="sr-only">
                    {graphTitle}: Historical data table from {startYear} to {endYear}
                  </caption>
                  <thead className="bg-slate-100 dark:bg-[#111622] text-slate-700 dark:text-slate-200 sticky top-0 z-20">
                    <tr>
                      <th scope="col" className="sticky left-0 z-20 bg-slate-100 dark:bg-[#111622] p-3 font-bold border-b border-r border-slate-200 dark:border-white/10">
                        Year
                      </th>
                      {alignedDataset.seriesMeta.map((m) => (
                        <th
                          key={m.key}
                          scope="col"
                          className="p-3 font-bold border-b border-slate-200 dark:border-white/10 whitespace-nowrap"
                        >
                          {m.displayName} ({m.unit})
                        </th>
                      ))}
                      {formulaMode !== 'none' && alignedDataset.formulaLabel && (
                        <th
                          scope="col"
                          className="p-3 font-bold border-b border-slate-200 dark:border-white/10 text-purple-600 dark:text-purple-300 whitespace-nowrap"
                        >
                          {alignedDataset.formulaLabel}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-white/[0.05]">
                    {alignedDataset.rows.map((row) => (
                      <tr
                        key={row.year}
                        className="hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      >
                        <th scope="row" className="sticky left-0 z-10 bg-white dark:bg-[#0b0f17] p-3 font-bold text-slate-900 dark:text-white border-r border-slate-200/70 dark:border-white/[0.06]">
                          {row.year}
                        </th>
                        {alignedDataset.seriesMeta.map((m) => (
                          <td key={m.key} className="p-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {row[m.key] !== null && row[m.key] !== undefined
                              ? `${row[m.key]} ${m.unit}`
                              : '—'}
                          </td>
                        ))}
                        {formulaMode !== 'none' && alignedDataset.formulaLabel && (
                          <td className="p-3 font-bold text-purple-600 dark:text-purple-300 whitespace-nowrap">
                            {row.formulaValue ?? '—'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Numbered Field-Guide Summary Cards with Contextual Benchmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {alignedDataset.seriesMeta.map((m, idx) => (
                <div
                  key={m.key}
                  className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                    <span className="font-bold uppercase text-slate-500 dark:text-slate-400">
                      0{idx + 1} / {m.shortLabel}
                    </span>
                    <span
                      className={`font-bold ${
                        m.periodChangePct >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {m.periodChangePct >= 0 ? '+' : ''}
                      {m.periodChangePct}% ({m.earliestYear}–{m.latestYear})
                    </span>
                  </div>
                  <div className="font-mono-tabular text-2xl font-extrabold text-slate-900 dark:text-white">
                    {m.latestValue.toLocaleString('en-US')}{' '}
                    <span className="text-xs font-normal text-slate-500">{m.unit}</span>
                  </div>
                  <div className="font-mono-tabular text-[11px] text-slate-500 dark:text-slate-400">
                    Range: {m.minValue.toLocaleString('en-US')} –{' '}
                    {m.maxValue.toLocaleString('en-US')} (Mean: {m.meanValue})
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-white/[0.06]">
                    {m.benchmarkNote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Learning Loop: Predict-First Correlation & Lead-Lag Transmission Sandbox */}
          {series.length >= 2 && alignedDataset.correlation && (
            <div className="order-3 apple-card p-5 sm:p-6 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                      05 / CAUSE-AND-EFFECT INTUITION LAB
                    </span>
                    {isIntuitionMastered && (
                      <span className="inline-flex items-center gap-1 font-mono-tabular text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        +15 XP Earned
                      </span>
                    )}
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    Do {alignedDataset.seriesMeta[0]?.shortLabel} and{' '}
                    {alignedDataset.seriesMeta[1]?.shortLabel} Move Together or Opposite?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                    In macroeconomics, some forces move in lockstep (+1.0), some act like a seesaw (-1.0), and others only show their true link when you shift one series forward by 1–2 years.
                  </p>
                </div>

                {leadLagYears !== 0 && (
                  <button
                    type="button"
                    onClick={() => setLeadLagYears(0)}
                    className="tactile-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer self-start md:self-auto"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
                    <span>Reset Lead/Lag (0Y)</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Step 1: Predict-First Correlation Slider */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.025] border border-slate-200 dark:border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                      Step 1: Predict Pearson Correlation (r)
                    </span>
                    <span className="font-mono-tabular text-sm font-extrabold text-slate-900 dark:text-white">
                      Your Guess: {predictedR > 0 ? `+${predictedR.toFixed(2)}` : predictedR.toFixed(2)}
                    </span>
                  </div>

                  <input
                    type="range"
                    aria-label="Predict Pearson correlation coefficient between -1 and +1"
                    min={-1}
                    max={1}
                    step={0.05}
                    value={predictedR}
                    onChange={(e) => setPredictedR(Number(e.target.value))}
                    className="w-full h-6 accent-amber-500 cursor-pointer"
                  />

                  <div className="flex justify-between font-mono-tabular text-[10px] text-slate-400">
                    <span>-1.00 (Inverse Seesaw)</span>
                    <span>0.00 (No Link)</span>
                    <span>+1.00 (Lockstep Tandem)</span>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleRevealCorrelationCheck}
                      className="tactile-button min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-700 text-xs font-bold cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>
                        {hasRevealedCorrelation
                          ? 'Intuition Checked (+15 XP)'
                          : 'Lock In Prediction & Reveal r (+15 XP)'}
                      </span>
                    </button>

                    {hasRevealedCorrelation && (
                      <span className="font-mono-tabular text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Actual r ={' '}
                        {alignedDataset.correlation.pearsonR > 0
                          ? `+${alignedDataset.correlation.pearsonR.toFixed(2)}`
                          : alignedDataset.correlation.pearsonR.toFixed(2)}{' '}
                        (Δ{' '}
                        {Math.abs(
                          predictedR - alignedDataset.correlation.pearsonR
                        ).toFixed(2)}
                        )
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 2: Lead/Lag Time-Shift Lever */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.025] border border-slate-200 dark:border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs font-bold uppercase text-sky-600 dark:text-sky-400">
                      Step 2: Test Lead / Lag Time Transmission
                    </span>
                    <span className="font-mono-tabular text-sm font-extrabold text-slate-900 dark:text-white">
                      Shift Series B: {leadLagYears > 0 ? `+${leadLagYears}Y` : `${leadLagYears}Y`}
                    </span>
                  </div>

                  <input
                    type="range"
                    aria-label="Shift Series B lead or lag in years"
                    min={-5}
                    max={5}
                    step={1}
                    value={leadLagYears}
                    onChange={(e) => setLeadLagYears(Number(e.target.value))}
                    className="w-full h-6 accent-sky-500 cursor-pointer"
                  />

                  <div className="flex justify-between font-mono-tabular text-[10px] text-slate-400">
                    <span>-5Y (Series B Leads)</span>
                    <span>0Y (Same Year)</span>
                    <span>+5Y (Series A Leads)</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {alignedDataset.correlation.interpretation} (R² ={' '}
                    <strong className="font-mono-tabular">
                      {(alignedDataset.correlation.rSquared * 100).toFixed(0)}%
                    </strong>{' '}
                    across {alignedDataset.correlation.sampleSize} aligned observations).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Cross-Country Arena Builder Mode (All 26 Sovereigns) */
        <div className="apple-card p-5 sm:p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
            <div>
              <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-emerald-500 block mb-1">
                02 / 26-COUNTRY CROSS-SECTIONAL GRAPH BUILDER ({selectedYear})
              </span>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Compare Any Sovereign Metric Across All 26 Economies
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Select any X-axis metric (for bar rankings) and Y-axis metric (for X-vs-Y scatter correlation) across all 26 countries in {selectedYear}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCrossCountryChartMode('scatter')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg font-mono-tabular text-xs font-bold cursor-pointer ${
                    crossCountryChartMode === 'scatter'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  X vs. Y Scatter
                </button>
                <button
                  type="button"
                  onClick={() => setCrossCountryChartMode('bar')}
                  className={`min-h-[34px] px-3 py-1 rounded-lg font-mono-tabular text-xs font-bold cursor-pointer ${
                    crossCountryChartMode === 'bar'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  26-Country Ranking Bar
                </button>
              </div>

              <DataExportMenu
                filename={`country-arena-${selectedYear}`}
                title={`26-Country Custom Graph (${selectedYear})`}
                data={crossCountryDataset.points as unknown as Record<string, any>[]}
                columns={exportColumns}
              />
            </div>
          </div>

          {/* X and Y Metric Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
              <label
                htmlFor="cc-metric-x"
                className="font-mono-tabular text-[11px] font-bold uppercase text-sky-600 dark:text-sky-400 block mb-1.5"
              >
                01 / Primary Metric (X-Axis / Ranking):
              </label>
              <select
                id="cc-metric-x"
                value={countryMetricX}
                onChange={(e) => setCountryMetricX(e.target.value)}
                className="w-full min-h-[38px] rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-3 py-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                {countryScopedMetrics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.unit})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {crossCountryDataset.defX.benchmarkNote}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
              <label
                htmlFor="cc-metric-y"
                className="font-mono-tabular text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1.5"
              >
                02 / Comparison Metric (Y-Axis Scatter):
              </label>
              <select
                id="cc-metric-y"
                value={countryMetricY}
                onChange={(e) => setCountryMetricY(e.target.value)}
                className="w-full min-h-[38px] rounded-xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0c1017] px-3 py-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                {countryScopedMetrics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.unit})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {crossCountryDataset.defY.benchmarkNote}
              </p>
            </div>
          </div>

          {/* Cross-Country Chart */}
          <div className="h-72 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {crossCountryChartMode === 'scatter' ? (
                <ScatterChart margin={{ top: 10, right: 12, left: -8, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis
                    type="number"
                    dataKey="valueX"
                    name={crossCountryDataset.defX.shortName}
                    stroke={axisColor}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="valueY"
                    width={44}
                    name={crossCountryDataset.defY.shortName}
                    stroke={axisColor}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt: any = payload[0].payload;
                      return (
                        <div className="rounded-xl bg-slate-950/95 p-3 text-xs text-white shadow-xl border border-white/10 space-y-1 font-mono-tabular">
                          <div className="font-bold text-amber-300 border-b border-white/10 pb-1">
                            {pt.flag} {pt.name} ({pt.code})
                          </div>
                          <div>
                            {crossCountryDataset.defX.shortName}:{' '}
                            <span className="font-bold text-sky-400">
                              {pt.valueX.toLocaleString('en-US')}{' '}
                              {crossCountryDataset.defX.unit}
                            </span>
                          </div>
                          <div>
                            {crossCountryDataset.defY.shortName}:{' '}
                            <span className="font-bold text-emerald-400">
                              {pt.valueY.toLocaleString('en-US')}{' '}
                              {crossCountryDataset.defY.unit}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter
                    name="Sovereign Nations"
                    data={crossCountryDataset.points}
                    fill="#34d399"
                  />
                </ScatterChart>
              ) : (
                <BarChart
                  data={crossCountryDataset.points}
                  margin={{ top: 8, right: 10, left: -8, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis
                    dataKey="code"
                    stroke={axisColor}
                    tick={{ fontSize: 9 }}
                    minTickGap={4}
                    angle={-35}
                    textAnchor="end"
                  />
                  <YAxis width={44} stroke={axisColor} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#090d16' : '#ffffff',
                      borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#cbd5e1',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="valueX"
                    name={`${crossCountryDataset.defX.shortName} (${crossCountryDataset.defX.unit})`}
                    fill="#38bdf8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {crossCountryDataset.correlation && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-slate-800 dark:text-slate-200 font-mono-tabular">
              <strong>Cross-Country Correlation ({selectedYear}):</strong>{' '}
              {crossCountryDataset.correlation.interpretation}
            </div>
          )}
        </div>
      )}

      {/* User's Pinned Custom Graph Board */}
      <div className="apple-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/[0.08] pb-3.5">
          <div>
            <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-amber-500 block">
              06 / MY SAVED GRAPH BOARD ({savedGraphs.length} PINNED)
            </span>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Your Custom Economic Field Notebook
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Saved locally in your browser • Click any card to reload into the studio canvas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedGraphs.map((g, idx) => (
            <div
              key={g.id}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.025] border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono-tabular text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    GRAPH 0{idx + 1} • {g.chartType.toUpperCase()}
                  </span>
                  <span>
                    {g.startYear}–{g.endYear}
                  </span>
                </div>
                <h4 className="font-editorial text-base font-bold text-slate-900 dark:text-white">
                  {g.curiosityQuestion}
                </h4>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                  {g.title}
                </p>

                <div className="flex flex-wrap gap-1 mt-2.5">
                  {g.series.map((s) => {
                    const { shortLabel } = getSeriesDisplayName(s);
                    return (
                      <span
                        key={s.key}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/[0.07] font-mono-tabular text-[10px] text-slate-700 dark:text-slate-200"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        {shortLabel}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleApplyRecipe(g)}
                  className="tactile-button min-h-[36px] px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white border-sky-700 text-xs font-bold cursor-pointer"
                >
                  Load into Studio
                </button>
                {savedGraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSavedGraph(g.id)}
                    aria-label={`Remove saved graph ${g.title}`}
                    className="min-w-[34px] min-h-[34px] inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plain-English Mental Model Card with Intuition Quiz (+15 XP) */}
      <PlainEnglishCard
        id="studio-spurious-vs-structural"
        title="How do macroeconomists separate real cause-and-effect from nominal price illusions?"
        summary="If you plot two things priced in nominal dollars over 45 years—like movie ticket prices and US GDP—almost everything goes up and to the right because of inflation. Switching to 'Indexed (Base 100)', 'Real USD', or 'Ratio (A ÷ B)' strips away the inflation mirage."
        detail="Professional macro strategists use three tests when building custom charts: (1) Deflate nominal dollar series by M2 money supply or CPI, (2) Check Z-scores to compare metrics with different units (like basis-point credit spreads vs. percentage unemployment), and (3) Shift leading indicators forward by 1–2 years using a Lead/Lag slider to verify whether cause truly precedes effect."
        takeaway="When comparing metrics with wildly different units, switch Data Transformation to 'Indexed (Base 100)' or 'Z-Score', or assign Series B to the Right Y-Axis."
        defaultExpanded={false}
        quiz={{
          question:
            'Why does plotting the S&P 500 divided by US M2 Money Supply (Ratio A ÷ B) tell a different story than plotting the raw S&P 500 index alone?',
          options: [
            'It measures whether stocks are gaining real value faster than central banks are expanding the supply of dollars',
            'It converts stock prices into Japanese Yen',
            'It removes corporate dividends from GDP',
            'It forces the correlation coefficient to equal zero',
          ],
          correctIndex: 0,
          feedback:
            'Dividing an asset price by M2 money supply reveals whether the asset is outperforming fiat liquidity expansion or merely riding the wave of a larger money supply!',
        }}
      />
    </div>
  );
}
