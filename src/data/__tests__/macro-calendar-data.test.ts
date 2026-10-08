import { describe, it, expect } from 'vitest';
import {
  ECONOMIC_CALENDAR_EVENTS,
  CENTRAL_BANK_MEETINGS_2026,
  US_SURPRISE_PROFILE,
  EUROZONE_SURPRISE_PROFILE,
  GLOBAL_SURPRISE_PROFILE,
  calculateSurpriseDelta,
  classifySurpriseDirection,
  calculateNormalizedSurpriseZScore,
  getDaysUntilEvent,
  formatEventCountdown,
  calculateCesiDecayWeight,
  filterCalendarEvents,
  validateCalendarBounds,
  isCentralBankBlackoutActive,
  evaluateCalendarState,
} from '../macro-calendar-data';
import type { EconomicReleaseEvent } from '../../lib/types';

describe('Macroeconomic Calendar & Surprise Index (CESI) Data Engine', () => {
  describe('Mathematical Surprise Calculations & Classifications', () => {
    it('correctly calculates consensus surprise delta with two-decimal precision', () => {
      // 142k actual vs 160k consensus = -18k miss
      expect(calculateSurpriseDelta(142, 160)).toBe(-18);
      // 54.9 actual vs 51.7 consensus = +3.2 beat
      expect(calculateSurpriseDelta(54.9, 51.7)).toBe(3.2);
      // 3.25 actual vs 3.25 consensus = 0.0 in-line
      expect(calculateSurpriseDelta(3.25, 3.25)).toBe(0.0);
    });

    it('classifies release direction into beat, miss, or in_line within tolerance', () => {
      expect(classifySurpriseDirection(54.9, 51.7)).toBe('beat');
      expect(classifySurpriseDirection(47.2, 47.6)).toBe('miss');
      expect(classifySurpriseDirection(4.20, 4.20)).toBe('in_line');
      expect(classifySurpriseDirection(4.205, 4.200, 0.01)).toBe('in_line');
    });

    it('calculates normalized Z-score surprise deltas', () => {
      const zScore = calculateNormalizedSurpriseZScore(54.9, 51.7, 1.7);
      expect(zScore).toBe(1.88);

      const zeroStdDev = calculateNormalizedSurpriseZScore(54.9, 51.7, 0);
      expect(zeroStdDev).toBe(0);
    });

    it('calculates days until event and formats human-readable countdowns', () => {
      const refDate = '2026-10-08T22:00:00Z';
      const tomorrowEvent = '2026-10-09T22:00:00Z';
      const nextWeekEvent = '2026-10-15T22:00:00Z';
      const pastEvent = '2026-10-05T22:00:00Z';

      expect(getDaysUntilEvent(tomorrowEvent, refDate)).toBe(1);
      expect(getDaysUntilEvent(nextWeekEvent, refDate)).toBe(7);
      expect(getDaysUntilEvent(pastEvent, refDate)).toBe(-3);

      expect(formatEventCountdown(tomorrowEvent, refDate)).toBe('Tomorrow');
      expect(formatEventCountdown(nextWeekEvent, refDate)).toBe('In 7 days');
      expect(formatEventCountdown(pastEvent, refDate)).toBe('Released 3d ago');
    });

    it('evaluates exponential half-life decay weights for historical surprises', () => {
      expect(calculateCesiDecayWeight(0, 30)).toBe(1.0);
      const halfLifeWeight = calculateCesiDecayWeight(30, 30);
      expect(halfLifeWeight).toBeCloseTo(0.5, 4);

      const quarterWeight = calculateCesiDecayWeight(60, 30);
      expect(quarterWeight).toBeCloseTo(0.25, 4);
    });
  });

  describe('Calendar Filtering & Bounds Invariants', () => {
    it('filters events by country code, category, importance tier, and search query', () => {
      const usaOnly = filterCalendarEvents(ECONOMIC_CALENDAR_EVENTS, { countryCode: 'USA' });
      expect(usaOnly.every((e) => e.countryCode === 'USA')).toBe(true);

      const centralBankOnly = filterCalendarEvents(ECONOMIC_CALENDAR_EVENTS, { category: 'central_bank' });
      expect(centralBankOnly.every((e) => e.category === 'central_bank')).toBe(true);

      const tier1Only = filterCalendarEvents(ECONOMIC_CALENDAR_EVENTS, { importance: 'tier1' });
      expect(tier1Only.every((e) => e.importance === 'tier1')).toBe(true);

      const nfpSearch = filterCalendarEvents(ECONOMIC_CALENDAR_EVENTS, { searchQuery: 'Payrolls' });
      expect(nfpSearch.length).toBeGreaterThan(0);
      expect(nfpSearch.every((e) => e.title.includes('Payrolls') || e.description.includes('Payrolls'))).toBe(true);
    });

    it('enforces econometric bounds and rejects corrupt releases', () => {
      expect(validateCalendarBounds(ECONOMIC_CALENDAR_EVENTS)).toBe(true);

      expect(() => validateCalendarBounds([])).toThrow('Calendar dataset cannot be empty.');

      const corruptDeltaEvent: EconomicReleaseEvent = {
        ...ECONOMIC_CALENDAR_EVENTS[0],
        id: 'test-corrupt-delta',
        status: 'released',
        actual: 200,
        consensus: 150,
        surpriseDelta: 10, // Actual is 200 - 150 = 50, but delta is wrongly 10
      };

      expect(() => validateCalendarBounds([corruptDeltaEvent])).toThrow(/Surprise delta mismatch/);
    });
  });

  describe('Central Bank Meetings & Blackout Rules', () => {
    it('verifies blackout activity during prescribed dates', () => {
      const testMeeting = CENTRAL_BANK_MEETINGS_2026[0]; // Nov 04 FOMC, blackout Oct 24 - Nov 05
      expect(isCentralBankBlackoutActive(testMeeting, '2026-10-15T00:00:00Z')).toBe(false);
      expect(isCentralBankBlackoutActive(testMeeting, '2026-10-25T00:00:00Z')).toBe(true);
      expect(isCentralBankBlackoutActive(testMeeting, '2026-11-06T00:00:00Z')).toBe(false);
    });
  });

  describe('Canonical Event Completeness & CESI Profiles', () => {
    it('contains all required mandatory events: FOMC, ECB, CPI, Non-Farm Payrolls, and GDP', () => {
      const titles = ECONOMIC_CALENDAR_EVENTS.map((e) => e.title);
      expect(titles.some((t) => t.includes('FOMC'))).toBe(true);
      expect(titles.some((t) => t.includes('ECB'))).toBe(true);
      expect(titles.some((t) => t.includes('CPI'))).toBe(true);
      expect(titles.some((t) => t.includes('Non-Farm Payrolls'))).toBe(true);
      expect(titles.some((t) => t.includes('GDP'))).toBe(true);
    });

    it('evaluates CESI surprise indices within reasonable bounds (-100 to +100)', () => {
      expect(US_SURPRISE_PROFILE.currentIndex).toBeGreaterThan(-100);
      expect(US_SURPRISE_PROFILE.currentIndex).toBeLessThan(100);
      expect(EUROZONE_SURPRISE_PROFILE.currentIndex).toBeGreaterThan(-100);
      expect(EUROZONE_SURPRISE_PROFILE.currentIndex).toBeLessThan(100);
      expect(GLOBAL_SURPRISE_PROFILE.currentIndex).toBeGreaterThan(-100);
      expect(GLOBAL_SURPRISE_PROFILE.currentIndex).toBeLessThan(100);

      expect(US_SURPRISE_PROFILE.beatRatioPct).toBeGreaterThan(0);
      expect(US_SURPRISE_PROFILE.beatRatioPct).toBeLessThan(100);
    });

    it('generates consistent aggregate state telemetry via evaluateCalendarState', () => {
      const state = evaluateCalendarState(
        ECONOMIC_CALENDAR_EVENTS,
        CENTRAL_BANK_MEETINGS_2026,
        '2026-10-08T22:00:00Z'
      );

      expect(state.totalEventsTracked).toBe(ECONOMIC_CALENDAR_EVENTS.length);
      expect(state.upcomingEventsCount + state.releasedEventsCount).toBe(state.totalEventsTracked);
      expect(state.beatCount + state.missCount + state.inLineCount).toBe(state.releasedEventsCount);
      expect(state.nextHighImpactRelease).not.toBeNull();
      expect(state.cesiSummary.usIndex).toBe(US_SURPRISE_PROFILE.currentIndex);
    });
  });
});
