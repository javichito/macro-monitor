'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  ECONOMIC_CALENDAR_EVENTS,
  CENTRAL_BANK_MEETINGS_2026,
  US_SURPRISE_PROFILE,
  EUROZONE_SURPRISE_PROFILE,
  GLOBAL_SURPRISE_PROFILE,
  filterCalendarEvents,
  formatEventCountdown,
  getDaysUntilEvent,
  isCentralBankBlackoutActive,
} from '../../data/macro-calendar-data';
import latestCalendarStatus from '../../data/latest-calendar-status.json';
import { useThemeMode } from '../../context/AppContext';
import type {
  EconomicReleaseEvent,
  EconomicReleaseCategory,
  ReleaseImportance,
  EconomicEventStatus,
} from '../../lib/types';
import {
  Calendar,
  Gauge,
  Activity,
  Landmark,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Lock,
  Percent,
  Layers,
  Globe2,
} from 'lucide-react';

type CalendarTab = 'calendar' | 'cesi' | 'deltas' | 'central_banks';

export function MacroCalendarRadar() {
  const theme = useThemeMode();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<CalendarTab>('calendar');
  const [selectedCountry, setSelectedCountry] = useState<'ALL' | 'USA' | 'EMU' | 'GBR' | 'JPN' | 'CHN'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | EconomicReleaseCategory>('ALL');
  const [selectedImportance, setSelectedImportance] = useState<'ALL' | ReleaseImportance>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | EconomicEventStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>('usa-nfp-sep-2026');
  const [selectedCesiRegion, setSelectedCesiRegion] = useState<'US' | 'Eurozone' | 'Global'>('US');

  // Filter events according to active criteria
  const filteredEvents = useMemo(() => {
    return filterCalendarEvents(ECONOMIC_CALENDAR_EVENTS, {
      countryCode: selectedCountry,
      category: selectedCategory,
      importance: selectedImportance,
      status: selectedStatus,
      searchQuery,
    });
  }, [selectedCountry, selectedCategory, selectedImportance, selectedStatus, searchQuery]);

  // Selected Citi Economic Surprise Index profile
  const activeCesiProfile = useMemo(() => {
    switch (selectedCesiRegion) {
      case 'Eurozone':
        return EUROZONE_SURPRISE_PROFILE;
      case 'Global':
        return GLOBAL_SURPRISE_PROFILE;
      case 'US':
      default:
        return US_SURPRISE_PROFILE;
    }
  }, [selectedCesiRegion]);

  // Helper for category badge styling
  const getCategoryBadgeClass = (category: EconomicReleaseCategory) => {
    switch (category) {
      case 'central_bank':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300 border-purple-300 dark:border-purple-500/30';
      case 'inflation':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300 border-rose-300 dark:border-rose-500/30';
      case 'labor':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border-amber-300 dark:border-amber-500/30';
      case 'growth':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300 border-sky-300 dark:border-sky-500/30';
      case 'activity':
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30';
    }
  };

  const getCategoryLabel = (category: EconomicReleaseCategory) => {
    switch (category) {
      case 'central_bank':
        return 'Central Bank';
      case 'inflation':
        return 'Inflation';
      case 'labor':
        return 'Labor Market';
      case 'growth':
        return 'Growth & GDP';
      case 'activity':
        return 'PMI & Surveys';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-7 shadow-sm transition-all space-y-6">
      {/* Header and Telemetry Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30">
              <Calendar className="h-3 w-3" />
              <span>Release Calendar &amp; Surprise Radar</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
              <Sparkles className="h-3 w-3" />
              <span>Live Telemetry: Q4 2026 Cycle</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Macroeconomic Calendar &amp; Surprise Index
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Financial asset prices reprice on the <strong className="text-slate-900 dark:text-white">delta between actual release and consensus expectations</strong>, not absolute growth numbers. Track high-frequency FOMC/ECB decisions, CPI, Non-Farm Payrolls, and the Citi Economic Surprise Index (CESI).
          </p>
        </div>

        {/* Global Summary Metric Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] p-3 text-right">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Surprise Beat Ratio
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{latestCalendarStatus.beatRatioPct}% Beats</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {latestCalendarStatus.beatCount} Beats / {latestCalendarStatus.missCount} Misses
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Next Tier-1 Release Card */}
        <div className="rounded-xl border border-sky-200 dark:border-sky-500/30 bg-gradient-to-br from-sky-500/[0.08] to-transparent p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-sky-700 dark:text-sky-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Next Tier-1 Release
            </span>
            <span className="font-semibold px-2 py-0.5 rounded-full bg-sky-200/60 dark:bg-sky-500/20 text-[10px]">
              {latestCalendarStatus.nextHighImpactRelease?.scheduledDate
                ? formatEventCountdown(latestCalendarStatus.nextHighImpactRelease.scheduledDate)
                : 'Upcoming'}
            </span>
          </div>
          <div className="my-2">
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{latestCalendarStatus.nextHighImpactRelease?.flag}</span>
              <span className="truncate">{latestCalendarStatus.nextHighImpactRelease?.title}</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Consensus: 150k | Previous: 142k
            </div>
          </div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium flex items-center gap-1">
            <Activity className="h-3 w-3" /> Dictates Nov FOMC rate-cut pricing
          </div>
        </div>

        {/* US CESI Surprise Gauge */}
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-emerald-500" /> US Surprise (CESI)
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+7.4 1M</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>+{latestCalendarStatus.cesiSummary.usIndex}</span>
              <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                Net Beats
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Services &amp; Retail sales beating estimates
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Complacency danger threshold: &gt; +50
          </div>
        </div>

        {/* Eurozone CESI Surprise Gauge */}
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-rose-500" /> Eurozone Surprise (CESI)
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+8.6 1M</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{latestCalendarStatus.cesiSummary.eurozoneIndex}</span>
              <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300">
                Net Misses
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Industrial order drags; disinflation solid
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Bottoming rebound threshold: &lt; -30
          </div>
        </div>

        {/* Central Bank Policy & Blackout Monitor Card */}
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Landmark className="h-3.5 w-3.5 text-purple-500" /> Central Bank Window
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Next: ECB (Oct 22)</span>
          </div>
          <div className="my-2">
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🇪🇺 ECB Deposit: 3.25%</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              Market Pricing: 92% odds of 25 bps cut
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Lock className="h-3 w-3 text-amber-500" /> Next Fed Blackout: Oct 24 - Nov 05
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-white/[0.08] pb-3">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-sky-600 text-white shadow-sm dark:bg-sky-500'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Interactive Release Calendar ({ECONOMIC_CALENDAR_EVENTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cesi')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'cesi'
              ? 'bg-sky-600 text-white shadow-sm dark:bg-sky-500'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
          }`}
        >
          <Gauge className="h-3.5 w-3.5" />
          <span>Citi Economic Surprise Index (CESI)</span>
        </button>

        <button
          onClick={() => setActiveTab('deltas')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'deltas'
              ? 'bg-sky-600 text-white shadow-sm dark:bg-sky-500'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Consensus vs. Actual Deltas</span>
        </button>

        <button
          onClick={() => setActiveTab('central_banks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'central_banks'
              ? 'bg-sky-600 text-white shadow-sm dark:bg-sky-500'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
          }`}
        >
          <Landmark className="h-3.5 w-3.5" />
          <span>Central Bank Blackout &amp; Policy Path</span>
        </button>
      </div>

      {/* =========================================================================
       * TAB 1: INTERACTIVE ECONOMIC RELEASE CALENDAR
       * ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02]">
            {/* Country Selector */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Globe2 className="h-3 w-3" /> Region:
              </span>
              {(['ALL', 'USA', 'EMU', 'GBR', 'JPN', 'CHN'] as const).map((cc) => (
                <button
                  key={cc}
                  onClick={() => setSelectedCountry(cc)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    selectedCountry === cc
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300'
                  }`}
                >
                  {cc === 'ALL' && 'All Regions'}
                  {cc === 'USA' && '🇺🇸 US'}
                  {cc === 'EMU' && '🇪🇺 Eurozone'}
                  {cc === 'GBR' && '🇬🇧 UK'}
                  {cc === 'JPN' && '🇯🇵 Japan'}
                  {cc === 'CHN' && '🇨🇳 China'}
                </button>
              ))}
            </div>

            {/* Category Selector */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Category:
              </span>
              {(['ALL', 'central_bank', 'inflation', 'labor', 'growth', 'activity'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]'
                  }`}
                >
                  {cat === 'ALL' && 'All Categories'}
                  {cat === 'central_bank' && 'Central Banks'}
                  {cat === 'inflation' && 'Inflation'}
                  {cat === 'labor' && 'Labor'}
                  {cat === 'growth' && 'GDP / Growth'}
                  {cat === 'activity' && 'PMIs / Surveys'}
                </button>
              ))}
            </div>

            {/* Free Search Input */}
            <div className="relative shrink-0 w-full md:w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Quick Status Sub-Filter Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span>Showing {filteredEvents.length} economic events</span>
              <div className="flex items-center gap-1 ml-3">
                <button
                  onClick={() => setSelectedStatus('ALL')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    selectedStatus === 'ALL' ? 'bg-slate-200 dark:bg-white/[0.1] font-semibold text-slate-900 dark:text-white' : ''
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedStatus('scheduled')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    selectedStatus === 'scheduled' ? 'bg-slate-200 dark:bg-white/[0.1] font-semibold text-slate-900 dark:text-white' : ''
                  }`}
                >
                  Upcoming Scheduled
                </button>
                <button
                  onClick={() => setSelectedStatus('released')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    selectedStatus === 'released' ? 'bg-slate-200 dark:bg-white/[0.1] font-semibold text-slate-900 dark:text-white' : ''
                  }`}
                >
                  Recent Released (with Actuals)
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedImportance(selectedImportance === 'tier1' ? 'ALL' : 'tier1')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-all ${
                selectedImportance === 'tier1'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 font-semibold'
                  : 'border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.05]'
              }`}
            >
              <span>⭐ Tier-1 High Impact Only</span>
            </button>
          </div>

          {/* Releases List Table */}
          <div className="space-y-2.5">
            {filteredEvents.map((event) => {
              const isExpanded = expandedEventId === event.id;
              const isReleased = event.status === 'released';
              const countdown = formatEventCountdown(event.scheduledDate);

              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.015] hover:border-slate-300 dark:hover:border-white/[0.15] transition-all overflow-hidden"
                >
                  {/* Event Summary Row */}
                  <div
                    onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                    className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    {/* Left: Timing, Flag, Title, Category */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="text-xl shrink-0">{event.flag}</div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                            {event.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(
                              event.category
                            )}`}
                          >
                            {getCategoryLabel(event.category)}
                          </span>
                          {event.importance === 'tier1' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                              Tier 1
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            ({event.period})
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3" />
                            {new Date(event.scheduledDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            at{' '}
                            {new Date(event.scheduledDate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZone: 'UTC',
                            })}{' '}
                            UTC
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span>{event.source}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Numbers (Consensus, Actual, Delta) & Countdown */}
                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/[0.04]">
                      {/* Metric Numbers */}
                      <div className="flex items-center gap-3 text-xs">
                        <div className="text-center">
                          <div className="text-[10px] text-slate-600 dark:text-slate-300 uppercase">Prior</div>
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {event.previous !== null ? `${event.previous}${event.unit}` : '—'}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-[10px] text-slate-600 dark:text-slate-300 uppercase">Consensus</div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {event.consensus !== null ? `${event.consensus}${event.unit}` : '—'}
                          </div>
                        </div>

                        <div className="text-center min-w-[50px]">
                          <div className="text-[10px] text-slate-600 dark:text-slate-300 uppercase">Actual</div>
                          <div
                            className={`font-bold ${
                              isReleased
                                ? event.direction === 'beat'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : event.direction === 'miss'
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-slate-700 dark:text-slate-300'
                                : 'text-slate-400 italic'
                            }`}
                          >
                            {isReleased ? `${event.actual}${event.unit}` : 'Pending'}
                          </div>
                        </div>

                        {/* Surprise Delta Badge */}
                        <div className="min-w-[70px] text-right">
                          {isReleased && event.surpriseDelta !== null ? (
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                                event.direction === 'beat'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                                  : event.direction === 'miss'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                                  : 'bg-slate-100 text-slate-800 dark:bg-white/[0.08] dark:text-slate-300'
                              }`}
                            >
                              {event.direction === 'beat' ? (
                                <ArrowUpRight className="h-3 w-3" />
                              ) : event.direction === 'miss' ? (
                                <ArrowDownRight className="h-3 w-3" />
                              ) : null}
                              {event.surpriseDelta > 0 ? `+${event.surpriseDelta}` : event.surpriseDelta}
                              {event.unit}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300">
                              {countdown}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand Chevron */}
                      <span aria-hidden="true" className="text-slate-400">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/[0.08] text-xs space-y-4">
                      {/* Description & Market Impact takeaway */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Info className="h-3.5 w-3.5 text-sky-500" /> Economic Indicator Definition
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {event.description}
                          </p>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                            Published by: <span className="font-medium text-slate-700 dark:text-slate-300">{event.source}</span> ({event.frequency})
                          </div>
                        </div>

                        <div className="space-y-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-3">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-amber-500" /> Market Sensitivity &amp; Repricing Dynamics
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {event.marketImpactSummary}
                          </p>
                          {event.surpriseNormalized !== null && (
                            <div className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold pt-1">
                              Standardized Surprise: {event.surpriseNormalized > 0 ? `+${event.surpriseNormalized}` : event.surpriseNormalized}σ from historical mean
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Historical Track Record (Past prints of this release) */}
                      {event.historicalTrackRecord && event.historicalTrackRecord.length > 0 && (
                        <div className="pt-2">
                          <div className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-purple-500" /> Historical Track Record (Past Releases Consensus vs Actual)
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {event.historicalTrackRecord.map((tr, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-black/20"
                              >
                                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                  {tr.period}
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                                  Actual: {tr.actual}{event.unit}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  Consensus: {tr.consensus}{event.unit}
                                </div>
                                <div
                                  className={`text-[11px] font-bold mt-1 inline-flex items-center gap-0.5 ${
                                    tr.direction === 'beat'
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : tr.direction === 'miss'
                                      ? 'text-rose-600 dark:text-rose-400'
                                      : 'text-slate-500'
                                  }`}
                                >
                                  Delta: {tr.surpriseDelta > 0 ? `+${tr.surpriseDelta}` : tr.surpriseDelta}{event.unit} ({tr.direction})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 2: CITI ECONOMIC SURPRISE INDEX (CESI) GAUGE & CYCLES
       * ========================================================================= */}
      {activeTab === 'cesi' && (
        <div className="space-y-6">
          {/* Regional Selector Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Select Region:</span>
              {(['US', 'Eurozone', 'Global'] as const).map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedCesiRegion(reg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCesiRegion === reg
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow'
                      : 'border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {reg === 'US' && '🇺🇸 United States CESI'}
                  {reg === 'Eurozone' && '🇪🇺 Eurozone CESI'}
                  {reg === 'Global' && '🌐 Global Aggregate CESI'}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              CESI Range: <strong className="text-slate-700 dark:text-slate-300">-100 (Severe Misses) to +100 (Extreme Beats)</strong>
            </div>
          </div>

          {/* Dial Gauge & Interpretation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Speedometer Dial Card */}
            <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {activeCesiProfile.region} Economic Surprise Gauge
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
                  <span>
                    {activeCesiProfile.currentIndex > 0 ? `+${activeCesiProfile.currentIndex}` : activeCesiProfile.currentIndex}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">/ 100</span>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-xs font-bold ${
                    activeCesiProfile.currentIndex > 15
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                      : activeCesiProfile.currentIndex < -15
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                  }`}
                >
                  {activeCesiProfile.statusLabel}
                </div>
              </div>

              {/* Visual Horizontal Dial Bar */}
              <div className="my-6 space-y-1.5">
                <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-white/[0.1] relative overflow-hidden flex">
                  {/* Severe Drag Zone: -100 to -30 */}
                  <div className="h-full bg-rose-500/50 w-[35%]" />
                  {/* Neutral Corridor: -30 to +30 */}
                  <div className="h-full bg-amber-500/50 w-[30%]" />
                  {/* Bullish Beats Zone: +30 to +100 */}
                  <div className="h-full bg-emerald-500/50 w-[35%]" />
                </div>

                {/* Needle Indicator */}
                <div
                  className="relative w-full h-4"
                  style={{
                    // Map index from [-100, 100] to [0%, 100%]
                    // percentage = ((index + 100) / 200) * 100
                  }}
                >
                  <div
                    className="absolute top-0 -ml-1 text-slate-900 dark:text-white text-xs font-bold"
                    style={{
                      left: `${Math.min(96, Math.max(4, ((activeCesiProfile.currentIndex + 100) / 200) * 100))}%`,
                    }}
                  >
                    ▲
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-100 (Capitulation)</span>
                  <span>0 (Neutral)</span>
                  <span>+100 (Peak Euphoria)</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
                <strong>Beat Ratio:</strong> {activeCesiProfile.beatRatioPct}% of releases exceeding consensus
              </div>
            </div>

            {/* Explanatory Narrative & Drivers */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-sky-500" /> Economic Surprise Mechanics &amp; Asset Implications
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5 font-normal">
                  {activeCesiProfile.interpretation}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Positive Drivers */}
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.04] p-3">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> Top Upside Surprise Catalysts
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1.5 list-disc list-inside">
                    {activeCesiProfile.topPositiveDrivers.map((driver, i) => (
                      <li key={i}>{driver}</li>
                    ))}
                  </ul>
                </div>

                {/* Negative Drags */}
                <div className="rounded-lg border border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/[0.04] p-3">
                  <div className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                    <TrendingDown className="h-3.5 w-3.5" /> Top Downside Disappointments
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1.5 list-disc list-inside">
                    {activeCesiProfile.topNegativeDrags.map((drag, i) => (
                      <li key={i}>{drag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Multi-Quarter CESI Time Series Chart */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Multi-Cycle Economic Surprise Evolution (2024 - 2026)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Observe how extreme readings mean-revert as economists adjust forecast models.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" /> US CESI
                </span>
                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Eurozone CESI
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Global Aggregate
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeCesiProfile.history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[-50, 60]}
                    stroke={isDark ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                    ticks={[-40, -20, 0, 20, 40]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#cbd5e1',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                    }}
                  />
                  <ReferenceLine y={0} stroke={isDark ? '#64748b' : '#94a3b8'} strokeDasharray="3 3" />
                  <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" label={{ value: 'Bullish Threshold', fill: '#10b981', fontSize: 10 }} />
                  <ReferenceLine y={-30} stroke="#f43f5e" strokeDasharray="2 2" label={{ value: 'Capitulation Reversal', fill: '#f43f5e', fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="usSurprise"
                    name="US CESI"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="eurozoneSurprise"
                    name="Eurozone CESI"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="globalSurprise"
                    name="Global Aggregate"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Bar Chart */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Surprise Contribution Breakdown by Economic Segment ({activeCesiProfile.region})
            </h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeCesiProfile.categoryBreakdown}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.5} />
                  <XAxis dataKey="categoryLabel" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} domain={[-35, 45]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#cbd5e1',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                    }}
                  />
                  <ReferenceLine y={0} stroke={isDark ? '#64748b' : '#94a3b8'} />
                  <Bar dataKey="netScore" name="Net Surprise Delta Score" radius={[4, 4, 0, 0]}>
                    {activeCesiProfile.categoryBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.netScore >= 0 ? '#10b981' : '#f43f5e'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 3: CONSENSUS VS ACTUAL REPRICING DELTAS
       * ========================================================================= */}
      {activeTab === 'deltas' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-500/20 bg-sky-50/50 dark:bg-sky-500/[0.03] text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="h-4 w-4 text-sky-500" /> The Asymmetric Market Reaction Function
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              When a consensus expectation is already established, market prices (such as 2Y yield swaps, Fed fund futures, and currency pairs) reflect that expectation with high precision. If a CPI print matches consensus exactly at 2.5%, rates barely move because 2.5% is 100% priced in. However, if CPI prints at 2.8% (+0.3% surprise delta), bond traders are caught off guard, triggering sudden yield spikes and equity multiple compression.
            </p>
          </div>

          {/* Divergence Table */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-white/[0.04] border-b border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="p-3">Economic Event</th>
                    <th className="p-3">Period</th>
                    <th className="p-3 text-right">Prior</th>
                    <th className="p-3 text-right">Consensus</th>
                    <th className="p-3 text-right">Actual</th>
                    <th className="p-3 text-right">Surprise Delta</th>
                    <th className="p-3">Direction</th>
                    <th className="p-3">Asset Repricing Takeaway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
                  {ECONOMIC_CALENDAR_EVENTS.filter((e) => e.status === 'released').map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{e.flag}</span>
                        <span>{e.title}</span>
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">{e.period}</td>
                      <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                        {e.previous}{e.unit}
                      </td>
                      <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300">
                        {e.consensus}{e.unit}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        {e.actual}{e.unit}
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-bold px-2 py-0.5 rounded ${
                            e.direction === 'beat'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                              : e.direction === 'miss'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-white/[0.08] dark:text-slate-300'
                          }`}
                        >
                          {e.surpriseDelta && e.surpriseDelta > 0 ? `+${e.surpriseDelta}` : e.surpriseDelta}
                          {e.unit}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`capitalize font-semibold ${
                            e.direction === 'beat'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : e.direction === 'miss'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {e.direction === 'beat' ? 'Upside Beat' : e.direction === 'miss' ? 'Downside Miss' : 'In-Line'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {e.marketImpactSummary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 4: CENTRAL BANK BLACKOUT PERIODS & POLICY PATH
       * ========================================================================= */}
      {activeTab === 'central_banks' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50/50 dark:bg-purple-500/[0.03] text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-purple-500" /> Federal Reserve &amp; ECB Blackout Rules
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Federal Reserve statutory blackout periods begin at midnight on the second Saturday prior to each FOMC meeting and run through the Thursday following the policy announcement. During blackout periods, central bankers cannot provide speeches, interviews, or off-the-record leaks. Market volatility tends to compress ahead of blackouts and re-accelerate immediately following the release.
            </p>
          </div>

          {/* Central Bank Meetings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CENTRAL_BANK_MEETINGS_2026.map((m) => {
              const isBlackout = isCentralBankBlackoutActive(m);

              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{m.flag}</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {m.code} ({m.institution})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Decision Date: {m.date}
                      </div>
                    </div>

                    {isBlackout ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300">
                        <Lock className="h-2.5 w-2.5" /> Blackout Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                        Open Window
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-black/20 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Current Benchmark:</span>
                      <strong className="text-slate-900 dark:text-white">{m.policyRateCurrent.toFixed(2)}%</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Expected Action:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {m.expectedAction === 'cut_25' && 'Cut -25 bps'}
                        {m.expectedAction === 'cut_50' && 'Jumbo Cut -50 bps'}
                        {m.expectedAction === 'hold' && 'Hold Steady'}
                        {m.expectedAction === 'hike_25' && 'Hike +25 bps'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Market Priced Probabilities:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {m.marketPricedProbabilities.cut}% Cut / {m.marketPricedProbabilities.hold}% Hold
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    {m.significance}
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                    <span>Blackout: {m.blackoutStart} to {m.blackoutEnd}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
