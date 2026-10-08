import type {
  EconomicReleaseEvent,
  SurpriseIndexProfile,
  CentralBankMeeting,
  CalendarFilterOptions,
  SurpriseDirection,
  EvaluatedCalendarState,
} from '../lib/types';

/**
 * Quantifies the delta between published economic prints and median analyst projections.
 * In financial market microstructure, absolute values are already priced into interest rate
 * and equity curves; only the surprise divergence sparks asset repricing.
 */
export function calculateSurpriseDelta(actual: number, consensus: number): number {
  return Number((actual - consensus).toFixed(2));
}

/**
 * Categorizes an economic release based on its divergence relative to analyst consensus.
 * A fractional deadband (0.01% or equivalent unit) prevents treating rounding noise
 * as meaningful structural macroeconomic beats or misses.
 */
export function classifySurpriseDirection(
  actual: number,
  consensus: number,
  deadbandTolerance = 0.01
): SurpriseDirection {
  const diff = actual - consensus;
  if (Math.abs(diff) <= deadbandTolerance) {
    return 'in_line';
  }
  return diff > 0 ? 'beat' : 'miss';
}

/**
 * Calculates a normalized Z-score surprise based on historical release standard deviation.
 * Standardizing allows diverse metrics (such as payroll headcounts in thousands vs. inflation rates in percent)
 * to be compared on an identical statistical scale, matching the Citi Economic Surprise Index methodology.
 */
export function calculateNormalizedSurpriseZScore(
  actual: number,
  consensus: number,
  historicalStdDev: number
): number {
  if (historicalStdDev <= 0) return 0;
  return Number(((actual - consensus) / historicalStdDev).toFixed(2));
}

/**
 * Calculates time remaining until an economic release occurs.
 * Negative day values denote events that have already been published.
 */
export function getDaysUntilEvent(eventDate: string, referenceDate = '2026-10-08T22:00:00Z'): number {
  const target = new Date(eventDate).getTime();
  const current = new Date(referenceDate).getTime();
  const diffDays = (target - current) / (1000 * 60 * 60 * 24);
  return Number(diffDays.toFixed(1));
}

/**
 * Formats a human-readable countdown string for event scheduling cards.
 */
export function formatEventCountdown(eventDate: string, referenceDate = '2026-10-08T22:00:00Z'): string {
  const days = getDaysUntilEvent(eventDate, referenceDate);
  if (days < 0) {
    const elapsedDays = Math.abs(Math.floor(days));
    return elapsedDays === 0 ? 'Released today' : `Released ${elapsedDays}d ago`;
  }
  if (days < 1) {
    const hours = Math.max(1, Math.round(days * 24));
    return `In ${hours}h`;
  }
  const roundedDays = Math.ceil(days);
  return roundedDays === 1 ? 'Tomorrow' : `In ${roundedDays} days`;
}

/**
 * Weights older economic releases with an exponential decay function.
 * Economic surprises lose their market predictive potency as subsequent prints supersede them,
 * following the standard 90-day Citi Economic Surprise Index rolling decay window.
 */
export function calculateCesiDecayWeight(ageInDays: number, halfLifeDays = 30): number {
  if (ageInDays <= 0) return 1.0;
  return Math.exp((-Math.LN2 * ageInDays) / halfLifeDays);
}

/**
 * Validates that all calendar releases comply with structural economic bounds
 * before entering downstream charts and dashboards, preventing invalid data ingestion.
 */
export function validateCalendarBounds(events: EconomicReleaseEvent[]): boolean {
  if (!events || events.length === 0) {
    throw new Error('Calendar dataset cannot be empty.');
  }

  for (const event of events) {
    if (!event.id || !event.title || !event.scheduledDate) {
      throw new Error(`Invalid event metadata encountered: ${JSON.stringify(event)}`);
    }

    if (event.status === 'released') {
      if (event.actual === null || event.actual === undefined) {
        throw new Error(`Released event "${event.title}" (${event.id}) must provide an actual value.`);
      }
      if (event.consensus !== null && typeof event.actual === 'number' && typeof event.consensus === 'number') {
        const expectedDelta = calculateSurpriseDelta(event.actual, event.consensus);
        if (event.surpriseDelta !== null && Math.abs(event.surpriseDelta - expectedDelta) > 0.05) {
          throw new Error(
            `Surprise delta mismatch for ${event.id}: expected ${expectedDelta}, got ${event.surpriseDelta}`
          );
        }
      }
    }
  }

  return true;
}

/**
 * Filters economic calendar releases by jurisdiction, release category, importance tier, and search query.
 */
export function filterCalendarEvents(
  events: EconomicReleaseEvent[],
  options: CalendarFilterOptions
): EconomicReleaseEvent[] {
  return events.filter((ev) => {
    if (options.countryCode && options.countryCode !== 'ALL' && ev.countryCode !== options.countryCode) {
      return false;
    }
    if (options.category && options.category !== 'ALL' && ev.category !== options.category) {
      return false;
    }
    if (options.importance && options.importance !== 'ALL' && ev.importance !== options.importance) {
      return false;
    }
    if (options.status && options.status !== 'ALL' && ev.status !== options.status) {
      return false;
    }
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase();
      const match =
        ev.title.toLowerCase().includes(q) ||
        ev.countryName.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.source.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

/* =========================================================================
 * 1. Comprehensive Canonical Economic Calendar Events
 * Scheduled dates for FOMC/ECB meetings, CPI releases, Non-Farm Payrolls, and GDP reports
 * ========================================================================= */

export const ECONOMIC_CALENDAR_EVENTS: EconomicReleaseEvent[] = [
  // --- UPCOMING SCHEDULED RELEASES (Q4 2026) ---
  {
    id: 'usa-nfp-sep-2026',
    title: 'US Non-Farm Payrolls',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'labor',
    importance: 'tier1',
    scheduledDate: '2026-10-09T12:30:00Z',
    period: 'Sep 2026',
    status: 'scheduled',
    previous: 142,
    consensus: 150,
    actual: null,
    unit: 'k',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Primary high-frequency catalyst for Fed rate-cut trajectory and 2Y Treasury yields.',
    description: 'Measures net private and government employment added during the month excluding farm workers.',
    frequency: 'Monthly',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
    historicalTrackRecord: [
      { date: '2026-09-04', period: 'Aug 2026', consensus: 160, actual: 142, surpriseDelta: -18, direction: 'miss' },
      { date: '2026-08-01', period: 'Jul 2026', consensus: 175, actual: 114, surpriseDelta: -61, direction: 'miss' },
      { date: '2026-07-05', period: 'Jun 2026', consensus: 190, actual: 206, surpriseDelta: 16, direction: 'beat' },
      { date: '2026-06-07', period: 'May 2026', consensus: 185, actual: 218, surpriseDelta: 33, direction: 'beat' },
    ],
  },
  {
    id: 'usa-unemployment-sep-2026',
    title: 'US Unemployment Rate',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'labor',
    importance: 'tier1',
    scheduledDate: '2026-10-09T12:30:00Z',
    period: 'Sep 2026',
    status: 'scheduled',
    previous: 4.2,
    consensus: 4.2,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Direct input into Claudia Sahm recession indicator calculation (0.50% trigger threshold).',
    description: 'Percentage of the total labor force that is unemployed but actively seeking employment.',
    frequency: 'Monthly',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
    historicalTrackRecord: [
      { date: '2026-09-04', period: 'Aug 2026', consensus: 4.2, actual: 4.2, surpriseDelta: 0.0, direction: 'in_line' },
      { date: '2026-08-01', period: 'Jul 2026', consensus: 4.1, actual: 4.3, surpriseDelta: 0.2, direction: 'miss' },
      { date: '2026-07-05', period: 'Jun 2026', consensus: 4.0, actual: 4.1, surpriseDelta: 0.1, direction: 'miss' },
      { date: '2026-06-07', period: 'May 2026', consensus: 3.9, actual: 4.0, surpriseDelta: 0.1, direction: 'miss' },
    ],
  },
  {
    id: 'usa-cpi-yoy-sep-2026',
    title: 'US Consumer Price Index (CPI YoY)',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'inflation',
    importance: 'tier1',
    scheduledDate: '2026-10-14T12:30:00Z',
    period: 'Sep 2026',
    status: 'scheduled',
    previous: 2.5,
    consensus: 2.3,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Headline inflation print dictating real yield compensation across the sovereign curve.',
    description: 'Tracks the 12-month change in prices paid by urban consumers for a market basket of consumer goods and services.',
    frequency: 'Monthly',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
    historicalTrackRecord: [
      { date: '2026-09-11', period: 'Aug 2026', consensus: 2.6, actual: 2.5, surpriseDelta: -0.1, direction: 'beat' },
      { date: '2026-08-14', period: 'Jul 2026', consensus: 3.0, actual: 2.9, surpriseDelta: -0.1, direction: 'beat' },
      { date: '2026-07-11', period: 'Jun 2026', consensus: 3.1, actual: 3.0, surpriseDelta: -0.1, direction: 'beat' },
      { date: '2026-06-12', period: 'May 2026', consensus: 3.4, actual: 3.3, surpriseDelta: -0.1, direction: 'beat' },
    ],
  },
  {
    id: 'usa-core-cpi-sep-2026',
    title: 'US Core CPI YoY',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'inflation',
    importance: 'tier1',
    scheduledDate: '2026-10-14T12:30:00Z',
    period: 'Sep 2026',
    status: 'scheduled',
    previous: 3.2,
    consensus: 3.1,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Strips volatile food and energy; key gauge of sticky shelter and supercore service momentum.',
    description: 'Consumer Price Index excluding food and energy components, reflecting underlying structural price pressures.',
    frequency: 'Monthly',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
    historicalTrackRecord: [
      { date: '2026-09-11', period: 'Aug 2026', consensus: 3.2, actual: 3.2, surpriseDelta: 0.0, direction: 'in_line' },
      { date: '2026-08-14', period: 'Jul 2026', consensus: 3.2, actual: 3.2, surpriseDelta: 0.0, direction: 'in_line' },
      { date: '2026-07-11', period: 'Jun 2026', consensus: 3.4, actual: 3.3, surpriseDelta: -0.1, direction: 'beat' },
      { date: '2026-06-12', period: 'May 2026', consensus: 3.5, actual: 3.4, surpriseDelta: -0.1, direction: 'beat' },
    ],
  },
  {
    id: 'emu-hicp-final-sep-2026',
    title: 'Eurozone Harmonised CPI (HICP YoY)',
    countryCode: 'EMU',
    countryName: 'Eurozone',
    flag: '🇪🇺',
    category: 'inflation',
    importance: 'tier1',
    scheduledDate: '2026-10-16T09:00:00Z',
    period: 'Sep 2026',
    status: 'scheduled',
    previous: 2.2,
    consensus: 1.8,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Drives ECB governing council rate cut pacing; dip below 2.0% emboldens doves.',
    description: 'Harmonised Index of Consumer Prices across the 20 euro-area member states.',
    frequency: 'Monthly',
    source: 'Eurostat',
    historicalTrackRecord: [
      { date: '2026-09-18', period: 'Aug 2026', consensus: 2.2, actual: 2.2, surpriseDelta: 0.0, direction: 'in_line' },
      { date: '2026-08-20', period: 'Jul 2026', consensus: 2.5, actual: 2.6, surpriseDelta: 0.1, direction: 'miss' },
      { date: '2026-07-17', period: 'Jun 2026', consensus: 2.5, actual: 2.5, surpriseDelta: 0.0, direction: 'in_line' },
    ],
  },
  {
    id: 'ecb-rate-decision-oct-2026',
    title: 'ECB Monetary Policy Decision',
    countryCode: 'EMU',
    countryName: 'Eurozone',
    flag: '🇪🇺',
    category: 'central_bank',
    importance: 'tier1',
    scheduledDate: '2026-10-22T12:15:00Z',
    period: 'Oct 2026',
    status: 'scheduled',
    previous: 3.25,
    consensus: 3.00,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Benchmark deposit facility rate setting bank refinancing costs across Germany, France, and Italy.',
    description: 'European Central Bank Governing Council decision on policy interest rates and APP/PEPP portfolio unwinds.',
    frequency: '6-8 Weeks',
    source: 'European Central Bank (ECB)',
    historicalTrackRecord: [
      { date: '2026-09-12', period: 'Sep 2026', consensus: 3.25, actual: 3.25, surpriseDelta: 0.0, direction: 'in_line' },
      { date: '2026-07-18', period: 'Jul 2026', consensus: 3.50, actual: 3.50, surpriseDelta: 0.0, direction: 'in_line' },
      { date: '2026-06-06', period: 'Jun 2026', consensus: 3.75, actual: 3.75, surpriseDelta: 0.0, direction: 'in_line' },
    ],
  },
  {
    id: 'usa-advance-gdp-q3-2026',
    title: 'US Advance GDP (Q3 2026 Annualized)',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'growth',
    importance: 'tier1',
    scheduledDate: '2026-10-29T12:30:00Z',
    period: 'Q3 2026',
    status: 'scheduled',
    previous: 3.0,
    consensus: 2.8,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'First official print for quarterly economic output; reconciles Atlanta Fed GDPNow vs surveyor consensus.',
    description: 'Annualized quarterly percentage change in real gross domestic product adjusted for inflation.',
    frequency: 'Quarterly',
    source: 'U.S. Bureau of Economic Analysis (BEA)',
    historicalTrackRecord: [
      { date: '2026-07-25', period: 'Q2 2026', consensus: 2.0, actual: 2.8, surpriseDelta: 0.8, direction: 'beat' },
      { date: '2026-04-25', period: 'Q1 2026', consensus: 2.4, actual: 1.6, surpriseDelta: -0.8, direction: 'miss' },
      { date: '2026-01-25', period: 'Q4 2025', consensus: 2.0, actual: 3.3, surpriseDelta: 1.3, direction: 'beat' },
    ],
  },
  {
    id: 'usa-fomc-decision-nov-2026',
    title: 'FOMC Interest Rate Decision & Press Conference',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'central_bank',
    importance: 'tier1',
    scheduledDate: '2026-11-04T18:00:00Z',
    period: 'Nov 2026',
    status: 'scheduled',
    previous: 4.75,
    consensus: 4.50,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Target range for the federal funds rate and forward guidance from Fed Chair Jerome Powell.',
    description: 'Federal Open Market Committee policy announcement determining overnight funding rates.',
    frequency: '8x/Year',
    source: 'Federal Reserve Board of Governors',
    historicalTrackRecord: [
      { date: '2026-09-18', period: 'Sep 2026', consensus: 4.75, actual: 4.75, surpriseDelta: 0.0, direction: 'in_line' },
      { date: '2026-07-31', period: 'Jul 2026', consensus: 5.25, actual: 5.25, surpriseDelta: 0.0, direction: 'in_line' },
      { date: '2026-06-12', period: 'Jun 2026', consensus: 5.25, actual: 5.25, surpriseDelta: 0.0, direction: 'in_line' },
    ],
  },
  {
    id: 'usa-nfp-oct-2026',
    title: 'US Non-Farm Payrolls',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'labor',
    importance: 'tier1',
    scheduledDate: '2026-11-06T13:30:00Z',
    period: 'Oct 2026',
    status: 'scheduled',
    previous: 150,
    consensus: 155,
    actual: null,
    unit: 'k',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'High-frequency labor thermometer right after the November FOMC rate decision.',
    description: 'Net monthly change in U.S. non-farm payroll employment.',
    frequency: 'Monthly',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
  },
  {
    id: 'usa-fomc-decision-dec-2026',
    title: 'FOMC Meeting & Summary of Economic Projections (Dot Plot)',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'central_bank',
    importance: 'tier1',
    scheduledDate: '2026-12-09T19:00:00Z',
    period: 'Dec 2026',
    status: 'scheduled',
    previous: 4.50,
    consensus: 4.25,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Includes quarterly Dot Plot revealing committee members projections for 2027 and neutral rate (R*).',
    description: 'Year-end policy meeting delivering revised economic growth, inflation, and rate forecasts.',
    frequency: 'Quarterly with SEP',
    source: 'Federal Reserve Board of Governors',
  },
  {
    id: 'ecb-rate-decision-dec-2026',
    title: 'ECB Monetary Policy Meeting & Macro Projections',
    countryCode: 'EMU',
    countryName: 'Eurozone',
    flag: '🇪🇺',
    category: 'central_bank',
    importance: 'tier1',
    scheduledDate: '2026-12-17T13:15:00Z',
    period: 'Dec 2026',
    status: 'scheduled',
    previous: 3.00,
    consensus: 2.75,
    actual: null,
    unit: '%',
    surpriseDelta: null,
    surpriseNormalized: null,
    direction: null,
    marketImpactSummary: 'Eurosystem staff macroeconomic projections updating Eurozone growth and core inflation paths.',
    description: 'Year-end ECB monetary policy decisions covering deposit facility and main refinancing rates.',
    frequency: 'Quarterly with Staff Projections',
    source: 'European Central Bank (ECB)',
  },

  // --- RECENT COMPLETED RELEASES (Q3 2026) WITH ACTUAL VS. CONSENSUS SURPRISE DELTAS ---
  {
    id: 'usa-ism-services-sep-2026',
    title: 'US ISM Services PMI',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'activity',
    importance: 'tier1',
    scheduledDate: '2026-10-03T14:00:00Z',
    period: 'Sep 2026',
    status: 'released',
    previous: 51.5,
    consensus: 51.7,
    actual: 54.9,
    unit: 'Index',
    surpriseDelta: 3.2,
    surpriseNormalized: 1.88,
    direction: 'beat',
    marketImpactSummary: 'Strong upside surprise triggered 10Y yield spike (+8 bps) and dollar rally as recession bets unwound.',
    description: 'Purchasing managers index covering non-manufacturing activities representing >75% of the US economy.',
    frequency: 'Monthly',
    source: 'Institute for Supply Management (ISM)',
  },
  {
    id: 'usa-ism-manufacturing-sep-2026',
    title: 'US ISM Manufacturing PMI',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'activity',
    importance: 'tier1',
    scheduledDate: '2026-10-01T14:00:00Z',
    period: 'Sep 2026',
    status: 'released',
    previous: 47.2,
    consensus: 47.6,
    actual: 47.2,
    unit: 'Index',
    surpriseDelta: -0.4,
    surpriseNormalized: -0.29,
    direction: 'miss',
    marketImpactSummary: 'Confirmed ongoing factory contraction (<50.0); cyclicals lagged while defensive healthcare gained.',
    description: 'Nationwide manufacturing executive survey tracking new orders, production, employment, and supplier deliveries.',
    frequency: 'Monthly',
    source: 'Institute for Supply Management (ISM)',
  },
  {
    id: 'usa-fomc-decision-sep-2026',
    title: 'FOMC Policy Rate Decision (Jumbo 50bps vs 25bps Cut)',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'central_bank',
    importance: 'tier1',
    scheduledDate: '2026-09-18T18:00:00Z',
    period: 'Sep 2026',
    status: 'released',
    previous: 5.25,
    consensus: 5.00,
    actual: 4.75,
    unit: '%',
    surpriseDelta: -0.25,
    surpriseNormalized: -1.0,
    direction: 'beat', // Dovish beat for risk assets
    marketImpactSummary: 'Aggressive 50 bps opening cut fueled global equity all-time highs; 2Y Treasury yields dropped 14 bps.',
    description: 'Inaugural rate reduction in the Fed monetary easing campaign aimed at sustaining maximum employment.',
    frequency: '8x/Year',
    source: 'Federal Reserve Board of Governors',
  },
  {
    id: 'usa-retail-sales-aug-2026',
    title: 'US Retail Sales MoM',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'growth',
    importance: 'tier1',
    scheduledDate: '2026-09-17T12:30:00Z',
    period: 'Aug 2026',
    status: 'released',
    previous: 1.1,
    consensus: -0.2,
    actual: 0.1,
    unit: '%',
    surpriseDelta: 0.3,
    surpriseNormalized: 0.75,
    direction: 'beat',
    marketImpactSummary: 'Exceeded negative expectations, reinforcing consumer resilience and lifting Q3 GDP estimates.',
    description: 'Tracks total receipts at retail stores and food services, providing primary pulse on consumer demand.',
    frequency: 'Monthly',
    source: 'U.S. Census Bureau',
  },
  {
    id: 'ecb-rate-decision-sep-2026',
    title: 'ECB Policy Rate Cut (-25 bps)',
    countryCode: 'EMU',
    countryName: 'Eurozone',
    flag: '🇪🇺',
    category: 'central_bank',
    importance: 'tier1',
    scheduledDate: '2026-09-12T12:15:00Z',
    period: 'Sep 2026',
    status: 'released',
    previous: 3.50,
    consensus: 3.25,
    actual: 3.25,
    unit: '%',
    surpriseDelta: 0.0,
    surpriseNormalized: 0.0,
    direction: 'in_line',
    marketImpactSummary: 'Met exact market expectations; German 10Y Bunds held flat, EUR/USD stabilized near 1.1080.',
    description: 'Second 25 bps rate cut of 2026 lowering the deposit facility rate to 3.25% as disinflation solidified.',
    frequency: '6-8 Weeks',
    source: 'European Central Bank (ECB)',
  },
  {
    id: 'usa-cpi-yoy-aug-2026',
    title: 'US CPI Inflation YoY',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'inflation',
    importance: 'tier1',
    scheduledDate: '2026-09-11T12:30:00Z',
    period: 'Aug 2026',
    status: 'released',
    previous: 2.9,
    consensus: 2.6,
    actual: 2.5,
    unit: '%',
    surpriseDelta: -0.1,
    surpriseNormalized: -0.67,
    direction: 'beat', // Downside inflation is favorable beat for policy easing
    marketImpactSummary: 'Headline inflation cooled to lowest level since Feb 2021; paved way for 50 bps FOMC rate cut.',
    description: 'Annual rate of inflation across goods and services.',
    frequency: 'Monthly',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
  },
  {
    id: 'usa-nfp-aug-2026',
    title: 'US Non-Farm Payrolls',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'labor',
    importance: 'tier1',
    scheduledDate: '2026-09-04T12:30:00Z',
    period: 'Aug 2026',
    status: 'released',
    previous: 114,
    consensus: 160,
    actual: 142,
    unit: 'k',
    surpriseDelta: -18,
    surpriseNormalized: -0.45,
    direction: 'miss',
    marketImpactSummary: 'Downward revision to prior month and modest miss cemented market conviction in a September rate cut.',
    description: 'Net change in non-farm employment for August.',
    frequency: 'Monthly',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
  },
  {
    id: 'gbr-gdp-mom-jul-2026',
    title: 'UK Monthly GDP MoM',
    countryCode: 'GBR',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    category: 'growth',
    importance: 'tier2',
    scheduledDate: '2026-09-11T06:00:00Z',
    period: 'Jul 2026',
    status: 'released',
    previous: 0.0,
    consensus: 0.2,
    actual: 0.0,
    unit: '%',
    surpriseDelta: -0.2,
    surpriseNormalized: -0.67,
    direction: 'miss',
    marketImpactSummary: 'Flat growth print weighed on Sterling; prompted BoE to signal accelerated rate cutting cycle.',
    description: 'Monthly estimate of gross domestic product growth produced by the Office for National Statistics.',
    frequency: 'Monthly',
    source: 'Office for National Statistics (ONS)',
  },
  {
    id: 'jpn-boj-decision-sep-2026',
    title: 'Bank of Japan Policy Rate Decision',
    countryCode: 'JPN',
    countryName: 'Japan',
    flag: '🇯🇵',
    category: 'central_bank',
    importance: 'tier1',
    scheduledDate: '2026-09-20T03:00:00Z',
    period: 'Sep 2026',
    status: 'released',
    previous: 0.25,
    consensus: 0.25,
    actual: 0.25,
    unit: '%',
    surpriseDelta: 0.0,
    surpriseNormalized: 0.0,
    direction: 'in_line',
    marketImpactSummary: 'Unanimous hold following August market volatility; Governor Ueda signaled gradual tightening path.',
    description: 'Bank of Japan Policy Board rate setting uncollateralized overnight call rate target.',
    frequency: '8x/Year',
    source: 'Bank of Japan (BOJ)',
  },
  {
    id: 'chn-caixin-mfg-pmi-sep-2026',
    title: 'China Caixin Manufacturing PMI',
    countryCode: 'CHN',
    countryName: 'China',
    flag: '🇨🇳',
    category: 'activity',
    importance: 'tier2',
    scheduledDate: '2026-09-30T01:45:00Z',
    period: 'Sep 2026',
    status: 'released',
    previous: 50.4,
    consensus: 50.5,
    actual: 49.3,
    unit: 'Index',
    surpriseDelta: -1.2,
    surpriseNormalized: -1.33,
    direction: 'miss',
    marketImpactSummary: 'Contractionary print accelerated PBOC stimulus packages and sovereign fiscal bond pledges.',
    description: 'Private manufacturing gauge surveying small and medium export-oriented Chinese enterprises.',
    frequency: 'Monthly',
    source: 'S&P Global / Caixin',
  },
  {
    id: 'usa-advance-gdp-q2-2026',
    title: 'US GDP Q2 2026 (Second Estimate)',
    countryCode: 'USA',
    countryName: 'United States',
    flag: '🇺🇸',
    category: 'growth',
    importance: 'tier1',
    scheduledDate: '2026-08-29T12:30:00Z',
    period: 'Q2 2026',
    status: 'released',
    previous: 1.4,
    consensus: 2.8,
    actual: 3.0,
    unit: '%',
    surpriseDelta: 0.2,
    surpriseNormalized: 0.5,
    direction: 'beat',
    marketImpactSummary: 'Upward revision to consumer spending dispelled hard-landing fears and reinforced soft landing narrative.',
    description: 'Second estimate of real annualized quarterly gross domestic product.',
    frequency: 'Quarterly',
    source: 'U.S. Bureau of Economic Analysis (BEA)',
  },
];

/* =========================================================================
 * 2. Citi Economic Surprise Index (CESI) Profiles & Historical Series
 * ========================================================================= */

export const CESI_HISTORICAL_SERIES = [
  { date: '2024-Q1', usSurprise: 38.2, eurozoneSurprise: -22.4, globalSurprise: 14.1 },
  { date: '2024-Q2', usSurprise: -12.4, eurozoneSurprise: -18.7, globalSurprise: -14.2 },
  { date: '2024-Q3', usSurprise: -34.8, eurozoneSurprise: -26.5, globalSurprise: -28.9 },
  { date: '2024-Q4', usSurprise: 18.5, eurozoneSurprise: -10.2, globalSurprise: 8.4 },
  { date: '2025-Q1', usSurprise: 44.1, eurozoneSurprise: 12.3, globalSurprise: 31.0 },
  { date: '2025-Q2', usSurprise: 8.9, eurozoneSurprise: -8.4, globalSurprise: 4.2 },
  { date: '2025-Q3', usSurprise: -21.6, eurozoneSurprise: -31.2, globalSurprise: -24.5 },
  { date: '2025-Q4', usSurprise: 15.2, eurozoneSurprise: -5.4, globalSurprise: 9.8 },
  { date: '2026-Q1', usSurprise: 32.6, eurozoneSurprise: 6.8, globalSurprise: 22.4 },
  { date: '2026-Q2', usSurprise: -6.4, eurozoneSurprise: -24.0, globalSurprise: -12.1 },
  { date: '2026-Q3', usSurprise: 24.2, eurozoneSurprise: -18.5, globalSurprise: 8.7 },
  { date: '2026-Oct (Current)', usSurprise: 28.4, eurozoneSurprise: -14.2, globalSurprise: 11.8 },
];

export const US_SURPRISE_PROFILE: SurpriseIndexProfile = {
  region: 'US',
  currentIndex: 28.4,
  previousIndex: 21.0,
  oneMonthChange: 7.4,
  status: 'moderate_positive',
  statusLabel: 'Strong Upside Beats (Accelerating)',
  interpretation:
    'Economic data releases are broadly beating analyst consensus expectations. Resilient consumer demand and services ISM are lifting cyclical growth estimates above forecasters gloomy projections.',
  beatRatioPct: 62.5,
  topPositiveDrivers: [
    'ISM Services PMI (+3.2 beat: 54.9 vs 51.7)',
    'Retail Sales MoM (+0.3% beat)',
    'Q2 GDP Revisions (+0.2% beat: 3.0% vs 2.8%)',
  ],
  topNegativeDrags: [
    'ISM Manufacturing PMI (-0.4 miss: 47.2 vs 47.6)',
    'August Non-Farm Payrolls (-18k miss: 142k vs 160k)',
  ],
  categoryBreakdown: [
    { category: 'growth', categoryLabel: 'Growth & GDP', netScore: 36.5, beatCount: 4, missCount: 1, inLineCount: 1 },
    { category: 'activity', categoryLabel: 'Business PMIs & Surveys', netScore: 24.0, beatCount: 3, missCount: 2, inLineCount: 0 },
    { category: 'inflation', categoryLabel: 'Inflation & Price Pressures', netScore: 18.2, beatCount: 4, missCount: 0, inLineCount: 2 },
    { category: 'labor', categoryLabel: 'Labor & Employment', netScore: -12.8, beatCount: 1, missCount: 3, inLineCount: 1 },
  ],
  history: CESI_HISTORICAL_SERIES,
};

export const EUROZONE_SURPRISE_PROFILE: SurpriseIndexProfile = {
  region: 'Eurozone',
  currentIndex: -14.2,
  previousIndex: -22.8,
  oneMonthChange: 8.6,
  status: 'moderate_negative',
  statusLabel: 'Persistent Downside Misses (Stabilizing)',
  interpretation:
    'European economic prints continue to miss median estimates, dragged by German industrial weakness and subdued consumer sentiment. However, downside momentum has arrested as lower energy costs provide a cushion.',
  beatRatioPct: 41.2,
  topPositiveDrivers: [
    'Eurozone Inflation HICP (Faster cooling to 2.2%)',
    'Southern Europe (Spain/Italy) Services Growth',
  ],
  topNegativeDrags: [
    'German Manufacturing Factory Orders (-5.8% miss)',
    'Eurozone Consumer Confidence (-13.5 vs -12.1)',
  ],
  categoryBreakdown: [
    { category: 'growth', categoryLabel: 'Growth & GDP', netScore: -18.4, beatCount: 1, missCount: 3, inLineCount: 1 },
    { category: 'activity', categoryLabel: 'Business PMIs & Surveys', netScore: -28.0, beatCount: 1, missCount: 4, inLineCount: 0 },
    { category: 'inflation', categoryLabel: 'Inflation & Price Pressures', netScore: 14.5, beatCount: 3, missCount: 1, inLineCount: 1 },
    { category: 'labor', categoryLabel: 'Labor & Employment', netScore: 4.2, beatCount: 2, missCount: 1, inLineCount: 2 },
  ],
  history: CESI_HISTORICAL_SERIES,
};

export const GLOBAL_SURPRISE_PROFILE: SurpriseIndexProfile = {
  region: 'Global',
  currentIndex: 11.8,
  previousIndex: 4.2,
  oneMonthChange: 7.6,
  status: 'moderate_positive',
  statusLabel: 'Mild Expansionary Bias',
  interpretation:
    'Worldwide economic momentum sits in positive territory. Strong US growth surprises and resilient emerging market domestic demand offset persistent manufacturing drag across China and Northern Europe.',
  beatRatioPct: 53.8,
  topPositiveDrivers: [
    'US Resilience & Tech Capital Expenditure',
    'Global Central Bank Easing Cycle Acceleration',
    'Softening Worldwide Input Cost Pressures',
  ],
  topNegativeDrags: [
    'Chinese Domestic Real Estate & Retail Consumption Drag',
    'European Industrial Competitiveness Headwinds',
  ],
  categoryBreakdown: [
    { category: 'growth', categoryLabel: 'Growth & GDP', netScore: 18.6, beatCount: 5, missCount: 3, inLineCount: 2 },
    { category: 'activity', categoryLabel: 'Business PMIs & Surveys', netScore: 2.1, beatCount: 4, missCount: 4, inLineCount: 1 },
    { category: 'inflation', categoryLabel: 'Inflation & Price Pressures', netScore: 16.4, beatCount: 6, missCount: 1, inLineCount: 2 },
    { category: 'labor', categoryLabel: 'Labor & Employment', netScore: -3.5, beatCount: 3, missCount: 4, inLineCount: 2 },
  ],
  history: CESI_HISTORICAL_SERIES,
};

/* =========================================================================
 * 3. Central Bank Policy Meetings & Blackout Calendar (2026/2027)
 * ========================================================================= */

export const CENTRAL_BANK_MEETINGS_2026: CentralBankMeeting[] = [
  {
    id: 'fomc-2026-11',
    institution: 'Federal Reserve',
    code: 'FOMC',
    flag: '🇺🇸',
    date: '2026-11-04',
    policyRateCurrent: 4.75,
    expectedAction: 'cut_25',
    marketPricedProbabilities: {
      cut: 86.4,
      hold: 13.6,
      hike: 0.0,
    },
    isBlackoutActive: false,
    blackoutStart: '2026-10-24',
    blackoutEnd: '2026-11-05',
    significance: 'Critical post-election monetary policy adjustment following the September 50 bps opening reduction.',
  },
  {
    id: 'ecb-2026-10',
    institution: 'European Central Bank',
    code: 'ECB',
    flag: '🇪🇺',
    date: '2026-10-22',
    policyRateCurrent: 3.25,
    expectedAction: 'cut_25',
    marketPricedProbabilities: {
      cut: 92.1,
      hold: 7.9,
      hike: 0.0,
    },
    isBlackoutActive: false,
    blackoutStart: '2026-10-15',
    blackoutEnd: '2026-10-22',
    significance: 'Consecutive rate cut widely anticipated as Eurozone headline inflation drops below the 2.0% target.',
  },
  {
    id: 'boe-2026-11',
    institution: 'Bank of England',
    code: 'BOE',
    flag: '🇬🇧',
    date: '2026-11-05',
    policyRateCurrent: 5.00,
    expectedAction: 'cut_25',
    marketPricedProbabilities: {
      cut: 74.5,
      hold: 25.5,
      hike: 0.0,
    },
    isBlackoutActive: false,
    blackoutStart: '2026-10-29',
    blackoutEnd: '2026-11-05',
    significance: 'Monetary Policy Committee releases updated quarterly Monetary Policy Report and GDP forecasts.',
  },
  {
    id: 'boj-2026-10',
    institution: 'Bank of Japan',
    code: 'BOJ',
    flag: '🇯🇵',
    date: '2026-10-31',
    policyRateCurrent: 0.25,
    expectedAction: 'hold',
    marketPricedProbabilities: {
      cut: 0.0,
      hold: 88.0,
      hike: 12.0,
    },
    isBlackoutActive: false,
    blackoutStart: '2026-10-25',
    blackoutEnd: '2026-10-31',
    significance: 'Assesses yen carry trade unwinding fallout and wage growth transmission to service sector prices.',
  },
  {
    id: 'fomc-2026-12',
    institution: 'Federal Reserve',
    code: 'FOMC',
    flag: '🇺🇸',
    date: '2026-12-09',
    policyRateCurrent: 4.50,
    expectedAction: 'cut_25',
    marketPricedProbabilities: {
      cut: 72.8,
      hold: 27.2,
      hike: 0.0,
    },
    isBlackoutActive: false,
    blackoutStart: '2026-11-28',
    blackoutEnd: '2026-12-10',
    significance: 'Quarterly Summary of Economic Projections (Dot Plot) detailing target policy terminal rate for 2027.',
  },
  {
    id: 'ecb-2026-12',
    institution: 'European Central Bank',
    code: 'ECB',
    flag: '🇪🇺',
    date: '2026-12-17',
    policyRateCurrent: 3.00,
    expectedAction: 'cut_25',
    marketPricedProbabilities: {
      cut: 81.3,
      hold: 18.7,
      hike: 0.0,
    },
    isBlackoutActive: false,
    blackoutStart: '2026-12-10',
    blackoutEnd: '2026-12-17',
    significance: 'Final policy meeting of 2026 accompanied by Eurosystem comprehensive 3-year staff macroeconomic forecasts.',
  },
];

/**
 * Checks whether a given central bank is currently in its statutory communication blackout window.
 * Federal Reserve blackout rules prohibit public commentary starting the second Saturday prior to the meeting
 * through the Thursday following the policy release.
 */
export function isCentralBankBlackoutActive(
  meeting: CentralBankMeeting,
  currentDate = '2026-10-08T22:00:00Z'
): boolean {
  const current = new Date(currentDate).getTime();
  const start = new Date(meeting.blackoutStart).getTime();
  const end = new Date(meeting.blackoutEnd).getTime();
  return current >= start && current <= end;
}

/**
 * Calculates current aggregate calendar state metrics for dashboards and automated CI workflows.
 */
export function evaluateCalendarState(
  events: EconomicReleaseEvent[] = ECONOMIC_CALENDAR_EVENTS,
  meetings: CentralBankMeeting[] = CENTRAL_BANK_MEETINGS_2026,
  referenceDate = '2026-10-08T22:00:00Z'
): EvaluatedCalendarState {
  validateCalendarBounds(events);

  const releasedEvents = events.filter((e) => e.status === 'released');
  const upcomingEvents = events.filter((e) => e.status === 'scheduled');

  const beatCount = releasedEvents.filter((e) => e.direction === 'beat').length;
  const missCount = releasedEvents.filter((e) => e.direction === 'miss').length;
  const inLineCount = releasedEvents.filter((e) => e.direction === 'in_line').length;

  const totalDecided = beatCount + missCount;
  const beatRatioPct = totalDecided > 0 ? Number(((beatCount / totalDecided) * 100).toFixed(1)) : 50;

  // Identify next upcoming high impact event
  const sortedUpcoming = [...upcomingEvents].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  const nextHighImpact = sortedUpcoming.find((e) => e.importance === 'tier1') || null;

  // Check blackout status for each central bank
  const activeBlackouts: EvaluatedCalendarState['activeBlackoutAlerts'] = [];
  for (const m of meetings) {
    if (isCentralBankBlackoutActive(m, referenceDate)) {
      activeBlackouts.push({
        institution: m.institution,
        headline: `🔒 ${m.code} In Active Blackout Window Ahead of ${m.date} Decision`,
        body: `Federal Reserve/ECB officials are legally prohibited from public speeches or media leaks until the policy statement is published.`,
        endDate: m.blackoutEnd,
      });
    }
  }

  return {
    timestamp: new Date().toISOString(),
    totalEventsTracked: events.length,
    upcomingEventsCount: upcomingEvents.length,
    releasedEventsCount: releasedEvents.length,
    beatCount,
    missCount,
    inLineCount,
    beatRatioPct,
    cesiSummary: {
      usIndex: US_SURPRISE_PROFILE.currentIndex,
      eurozoneIndex: EUROZONE_SURPRISE_PROFILE.currentIndex,
      globalIndex: GLOBAL_SURPRISE_PROFILE.currentIndex,
    },
    nextHighImpactRelease: nextHighImpact
      ? {
          id: nextHighImpact.id,
          title: nextHighImpact.title,
          flag: nextHighImpact.flag,
          scheduledDate: nextHighImpact.scheduledDate,
          category: nextHighImpact.category,
        }
      : null,
    activeBlackoutAlerts: activeBlackouts,
  };
}
