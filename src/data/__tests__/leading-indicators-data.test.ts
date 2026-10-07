import { describe, it, expect } from 'vitest';
import {
  SOVEREIGN_PMI_PROFILES,
  CONFERENCE_BOARD_LEI_DATA,
  LEI_TEN_COMPONENTS,
  GDP_NOWCAST_DATA,
  classifyPmiStatus,
  classifyLeiSignal,
  calculateLeiDiffusionIndex,
  calculateNowcastSurprise,
} from '../leading-indicators-data';

describe('Leading Indicators & High-Frequency Nowcasting Dataset', () => {
  describe('Purchasing Managers Index (PMI) Data & Rules', () => {
    it('correctly classifies expansion and contraction around the 50.0 threshold', () => {
      expect(classifyPmiStatus(52.4)).toBe('expansion');
      expect(classifyPmiStatus(48.6)).toBe('contraction');
      expect(classifyPmiStatus(50.0)).toBe('stagnation');
    });

    it('contains profiles for all critical economies: Global, US, Eurozone, China, UK, Japan', () => {
      const codes = SOVEREIGN_PMI_PROFILES.map((p) => p.economyCode);
      expect(codes).toContain('GLOBAL');
      expect(codes).toContain('USA');
      expect(codes).toContain('EA');
      expect(codes).toContain('CHN');
      expect(codes).toContain('GBR');
      expect(codes).toContain('JPN');
    });

    it('validates PMI values are within legitimate survey bounds (30 to 70)', () => {
      for (const profile of SOVEREIGN_PMI_PROFILES) {
        expect(profile.currentManufacturing).toBeGreaterThanOrEqual(30);
        expect(profile.currentManufacturing).toBeLessThanOrEqual(70);
        expect(profile.currentServices).toBeGreaterThanOrEqual(30);
        expect(profile.currentServices).toBeLessThanOrEqual(70);
        expect(profile.currentComposite).toBeGreaterThanOrEqual(30);
        expect(profile.currentComposite).toBeLessThanOrEqual(70);

        // New orders to inventory ratio must be positive
        expect(profile.newOrdersToInventoryRatio).toBeGreaterThan(0.5);
        expect(profile.newOrdersToInventoryRatio).toBeLessThan(2.0);

        // Historical series validation
        expect(profile.historicalSeries.length).toBeGreaterThanOrEqual(5);
        for (const pt of profile.historicalSeries) {
          expect(pt.manufacturing).toBeGreaterThan(30);
          expect(pt.services).toBeGreaterThan(30);
          expect(pt.composite).toBeGreaterThan(30);
        }
      }
    });

    it('checks Eurozone manufacturing is below 50 while services is above 50 (dual-speed divergence)', () => {
      const ea = SOVEREIGN_PMI_PROFILES.find((p) => p.economyCode === 'EA');
      expect(ea).toBeDefined();
      expect(ea!.currentManufacturing).toBeLessThan(50);
      expect(ea!.currentServices).toBeGreaterThan(50);
      expect(ea!.manufacturingStatus).toBe('contraction');
      expect(ea!.servicesStatus).toBe('expansion');
    });
  });

  describe('Conference Board Leading Economic Index (LEI)', () => {
    it('tracks all 10 required forward-looking components', () => {
      expect(LEI_TEN_COMPONENTS.length).toBe(10);
      const expectedIds = [
        'mfg_hours',
        'initial_claims',
        'consumer_orders',
        'ism_new_orders',
        'capex_orders',
        'building_permits',
        'sp500',
        'credit_index',
        'yield_spread',
        'consumer_expectations',
      ];
      const actualIds = LEI_TEN_COMPONENTS.map((c) => c.id);
      for (const id of expectedIds) {
        expect(actualIds).toContain(id);
      }
    });

    it('verifies that component weights sum close to 100%', () => {
      const totalWeight = LEI_TEN_COMPONENTS.reduce((acc, c) => acc + c.weightPct, 0);
      expect(Math.round(totalWeight)).toBe(100);
    });

    it('accurately computes diffusion index across components', () => {
      const testComponents: Array<{ netContribution: 'positive' | 'negative' | 'neutral' }> = [
        { netContribution: 'positive' },
        { netContribution: 'positive' },
        { netContribution: 'negative' },
        { netContribution: 'negative' },
      ];
      expect(calculateLeiDiffusionIndex(testComponents)).toBe(50.0);

      const allPos: Array<{ netContribution: 'positive' | 'negative' | 'neutral' }> = [
        { netContribution: 'positive' },
        { netContribution: 'positive' },
      ];
      expect(calculateLeiDiffusionIndex(allPos)).toBe(100.0);
    });

    it('evaluates Conference Board 3D rule recession signal trigger', () => {
      // 6M annualized <= -4.0% with diffusion < 50 triggers recession_signal
      expect(classifyLeiSignal(-5.2, 30)).toBe('recession_signal');
      expect(classifyLeiSignal(-4.0, 45)).toBe('recession_signal');

      // Negative growth but above -4.0% is warning
      expect(classifyLeiSignal(-2.8, 50)).toBe('warning');
      expect(classifyLeiSignal(-1.5, 60)).toBe('warning');

      // Positive growth is expansion
      expect(classifyLeiSignal(1.2, 70)).toBe('expansion');
    });

    it('contains multi-cycle historical LEI series with past recession warnings', () => {
      expect(CONFERENCE_BOARD_LEI_DATA.historicalSeries.length).toBeGreaterThanOrEqual(10);
      const gfc = CONFERENCE_BOARD_LEI_DATA.historicalSeries.find((p) => p.date === '2008-12');
      expect(gfc).toBeDefined();
      expect(gfc!.isRecessionSignal).toBe(true);
      expect(gfc!.sixMonthAnnualizedGrowth).toBeLessThan(-10.0);
    });
  });

  describe('GDP Nowcasting (Atlanta Fed GDPNow & High-Frequency Tracking)', () => {
    it('contains current quarter nowcast estimates and sector contributions', () => {
      expect(GDP_NOWCAST_DATA.currentQuarter).toBe('2026-Q3');
      expect(GDP_NOWCAST_DATA.gdpNowEstimate).toBeGreaterThan(0);
      expect(GDP_NOWCAST_DATA.nyFedEstimate).toBeGreaterThan(0);
      expect(GDP_NOWCAST_DATA.blueChipConsensus).toBeGreaterThan(0);
      expect(GDP_NOWCAST_DATA.trailingOfficialGdp).toBeGreaterThan(0);

      // Verify sector decomposition sums close to total nowcast
      const sectorSum =
        GDP_NOWCAST_DATA.sectorContributions.personalConsumption +
        GDP_NOWCAST_DATA.sectorContributions.privateInvestment +
        GDP_NOWCAST_DATA.sectorContributions.governmentSpending +
        GDP_NOWCAST_DATA.sectorContributions.netExports;
      expect(Math.abs(sectorSum - GDP_NOWCAST_DATA.gdpNowEstimate)).toBeLessThan(0.01);
    });

    it('tracks step-by-step revision evolution across incoming data releases', () => {
      expect(GDP_NOWCAST_DATA.revisionEvolution.length).toBeGreaterThanOrEqual(5);
      const first = GDP_NOWCAST_DATA.revisionEvolution[0];
      const last = GDP_NOWCAST_DATA.revisionEvolution[GDP_NOWCAST_DATA.revisionEvolution.length - 1];
      expect(first.date).toBe('07/15');
      expect(last.estimate).toBe(GDP_NOWCAST_DATA.gdpNowEstimate);
    });

    it('compares nowcast estimates against official trailing BEA GDP prints', () => {
      expect(GDP_NOWCAST_DATA.quarterlyComparison.length).toBeGreaterThanOrEqual(8);
      const closedQuarters = GDP_NOWCAST_DATA.quarterlyComparison.filter((q) => q.isQuarterClosed);
      for (const q of closedQuarters) {
        expect(q.officialBeaGdp).not.toBeNull();
        expect(q.atlantaFedGdpNow).toBeGreaterThan(0);
        expect(q.nyFedNowcast).toBeGreaterThan(0);
      }
    });

    it('calculates algorithmic surprise over consensus surveys', () => {
      const surprise = calculateNowcastSurprise(
        GDP_NOWCAST_DATA.gdpNowEstimate,
        GDP_NOWCAST_DATA.blueChipConsensus
      );
      expect(surprise).toBe(0.8);
    });
  });

  describe('Nowcast Ingestion Engine & Bound Invariants', () => {
    it('verifies that latest-nowcast-status.json exists and satisfies schema constraints', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const filePath = path.join(process.cwd(), 'src/data/latest-nowcast-status.json');

      expect(fs.existsSync(filePath)).toBe(true);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      expect(content.gdpNowEstimate).toBe(2.7);
      expect(content.currentQuarter).toBe('2026-Q3');
      expect(content.pmiSummary.globalStatus).toBe('expansion');
      expect(content.leiSummary.signalStatus).toBe('warning');
      expect(content.activeAlerts.length).toBeGreaterThanOrEqual(1);
    });
  });
});
