import { describe, it, expect } from 'vitest';
import {
  getMoveStressLabel,
  getVixMoveRegimeLabel,
  calculateCollateralHealthScore,
  simulateCollateralPlumbing,
  REGIONAL_COLLATERAL_PROFILES,
  EQUITY_VOL_TERM_STRUCTURE,
  HISTORICAL_CRISIS_CASES,
  HISTORICAL_BOND_VOLATILITY_SERIES,
  BOND_VOLATILITY_OVERVIEW,
  getLatestBondVolatilityState,
  getBondVolatilityExportData,
} from '../bond-volatility-data';
import {
  validateCollateralBounds,
  buildEvaluatedBondVolatilityState,
  RawCollateralIngestionPayload,
} from '../../../scripts/sync-collateral-data';

/*
 * Unit tests verifying econometric accuracy of bond volatility stress tiers,
 * VIX/MOVE complacency ratios, repo collateral plumbing mechanics, and ingestion bounds.
 */

describe('Bond Market Volatility & Collateral Plumbing Econometric Engine', () => {
  describe('getMoveStressLabel', () => {
    it('categorizes ultra-low volatility (<80) as compressed', () => {
      const res = getMoveStressLabel(65);
      expect(res.level).toBe('compressed');
      expect(res.label).toContain('Ultra Low');
      expect(res.color).toBe('#10b981');
    });

    it('categorizes tranquil rangebound volatility (80-105) as normal', () => {
      const res = getMoveStressLabel(95);
      expect(res.level).toBe('normal');
      expect(res.label).toContain('Normal');
      expect(res.color).toBe('#0ea5e9');
    });

    it('categorizes elevated volatility (105-120) as elevated stress', () => {
      const res = getMoveStressLabel(112);
      expect(res.level).toBe('elevated');
      expect(res.label).toContain('Elevated Stress');
      expect(res.color).toBe('#f59e0b');
    });

    it('categorizes severe illiquidity (120-140) as severe stress', () => {
      const res = getMoveStressLabel(130);
      expect(res.level).toBe('severe');
      expect(res.label).toContain('Severe Illiquidity');
      expect(res.color).toBe('#f97316');
    });

    it('categorizes extreme systemic crisis (>140) as crisis tier', () => {
      const res = getMoveStressLabel(165);
      expect(res.level).toBe('crisis');
      expect(res.label).toContain('Systemic Crisis');
      expect(res.color).toBe('#ef4444');
    });
  });

  describe('getVixMoveRegimeLabel', () => {
    it('detects extreme equity complacency when scaled ratio < 1.20', () => {
      // VIX = 13.5, MOVE = 125 -> (13.5 / 125) * 10 = 1.08
      const res = getVixMoveRegimeLabel(13.5, 125);
      expect(res.regime).toBe('extreme_complacency');
      expect(res.label).toContain('Dangerous Equity Complacency');
      expect(res.complacencyRisk).toBe('EXTREME');
      expect(res.scaledRatio).toBe(1.08);
    });

    it('identifies moderate complacency when scaled ratio is between 1.20 and 1.55', () => {
      // VIX = 15.8, MOVE = 108.5 -> (15.8 / 108.5) * 10 = 1.46
      const res = getVixMoveRegimeLabel(15.8, 108.5);
      expect(res.regime).toBe('moderate_complacency');
      expect(res.label).toContain('Moderate Complacency');
      expect(res.complacencyRisk).toBe('HIGH');
      expect(res.scaledRatio).toBe(1.46);
    });

    it('recognizes balanced cross-asset risk pricing between 1.55 and 2.20', () => {
      // VIX = 19.0, MOVE = 100 -> (19.0 / 100) * 10 = 1.90
      const res = getVixMoveRegimeLabel(19.0, 100);
      expect(res.regime).toBe('balanced');
      expect(res.label).toContain('Balanced Cross-Asset');
      expect(res.complacencyRisk).toBe('BALANCED');
    });

    it('identifies equity panic with bond sanctuary when scaled ratio > 2.20', () => {
      // VIX = 35.0, MOVE = 110 -> (35.0 / 110) * 10 = 3.18
      const res = getVixMoveRegimeLabel(35.0, 110);
      expect(res.regime).toBe('systemic_panic');
      expect(res.label).toContain('Equity Fear');
      expect(res.complacencyRisk).toBe('EQUITY_PANIC');
    });
  });

  describe('calculateCollateralHealthScore', () => {
    it('scores tranquil market conditions near 100', () => {
      const score = calculateCollateralHealthScore(70, 5, 1.5);
      expect(score).toBeGreaterThanOrEqual(95);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('penalizes elevated MOVE, widening repo spreads, and increased haircuts', () => {
      const calmScore = calculateCollateralHealthScore(75, 5, 1.5);
      const stressScore = calculateCollateralHealthScore(150, 45, 5.0);
      expect(stressScore).toBeLessThan(calmScore);
      expect(stressScore).toBeLessThan(50);
    });

    it('clamps scores within [10, 100] bounds', () => {
      const extremeCrisis = calculateCollateralHealthScore(300, 200, 20.0);
      expect(extremeCrisis).toBeGreaterThanOrEqual(10);
    });
  });

  describe('simulateCollateralPlumbing', () => {
    it('models exponential repo haircut increases as MOVE crosses 120', () => {
      const calm = simulateCollateralPlumbing(75, 15, 'USA');
      const strain = simulateCollateralPlumbing(125, 15, 'USA');
      const crisis = simulateCollateralPlumbing(165, 15, 'USA');

      expect(calm.impliedRepoHaircutPct).toBeCloseTo(1.5, 1);
      expect(strain.impliedRepoHaircutPct).toBeGreaterThan(calm.impliedRepoHaircutPct);
      expect(crisis.impliedRepoHaircutPct).toBeGreaterThan(strain.impliedRepoHaircutPct);
    });

    it('reduces dealer balance sheet capacity as sovereign volatility surges', () => {
      const calm = simulateCollateralPlumbing(70, 15, 'USA');
      const crisis = simulateCollateralPlumbing(160, 15, 'USA');

      expect(calm.dealerBalanceSheetCapacityPct).toBe(100);
      expect(crisis.dealerBalanceSheetCapacityPct).toBeLessThan(50);
    });

    it('calculates basis trade margin strain multipliers above 1.0 during volatility spikes', () => {
      const strain = simulateCollateralPlumbing(145, 15, 'USA');
      expect(strain.basisTradeMarginStrainMultiplier).toBeGreaterThan(2.0);
    });
  });

  describe('Regional Profiles & Historical Cases Integrity', () => {
    it('contains profiles for all 5 major global sovereign jurisdictions', () => {
      const expectedRegions = ['GLOBAL', 'USA', 'EUR', 'GBR', 'JPN'] as const;
      for (const reg of expectedRegions) {
        const profile = REGIONAL_COLLATERAL_PROFILES[reg];
        expect(profile).toBeDefined();
        expect(profile.sovereignVolIndex).toBeGreaterThan(0);
        expect(profile.primaryDealerHaircutPct).toBeGreaterThan(0);
        expect(profile.healthScore).toBeGreaterThan(0);
      }
    });

    it('contains all 4 key historical collateral crises with verified peak MOVE readings', () => {
      expect(HISTORICAL_CRISIS_CASES).toHaveLength(4);
      const march2020 = HISTORICAL_CRISIS_CASES.find((c) => c.id === 'march-2020-basis');
      const gilt2022 = HISTORICAL_CRISIS_CASES.find((c) => c.id === 'sept-2022-gilt-crisis');
      const svb2023 = HISTORICAL_CRISIS_CASES.find((c) => c.id === 'march-2023-svb-bank-run');
      const carry2024 = HISTORICAL_CRISIS_CASES.find((c) => c.id === 'august-2024-carry-unwind');

      expect(march2020?.peakMove).toBe(163.7);
      expect(gilt2022?.peakMove).toBe(158.5);
      expect(svb2023?.peakMove).toBe(198.7);
      expect(carry2024?.peakMove).toBe(138.2);
    });

    it('structures equity volatility term structure in upward-sloping contango by default', () => {
      expect(EQUITY_VOL_TERM_STRUCTURE.length).toBe(5);
      const vix9d = EQUITY_VOL_TERM_STRUCTURE[0].value;
      const vix30d = EQUITY_VOL_TERM_STRUCTURE[1].value;
      const vix3m = EQUITY_VOL_TERM_STRUCTURE[2].value;

      expect(vix9d).toBeLessThan(vix30d);
      expect(vix30d).toBeLessThan(vix3m);
    });

    it('exports complete historical series for CSV/JSON download formats', () => {
      const data = getBondVolatilityExportData();
      expect(data.length).toBeGreaterThan(10);
      expect(data[0].moveIndex).toBeDefined();
      expect(data[0].vixIndex).toBeDefined();
      expect(data[0].vixMoveRatio).toBeDefined();
    });
  });

  describe('Ingestion Bounds Validation & Sync Invariants', () => {
    const validPayload: RawCollateralIngestionPayload = {
      moveIndex: 108.5,
      vixIndex: 15.8,
      vix9dIndex: 13.9,
      vix3mIndex: 17.2,
      vix6mIndex: 18.5,
      vix1yIndex: 19.8,
      usSofrFedFundsSpreadBps: 8,
      usPrimaryDealerHaircutPct: 2.0,
      euroSovereignVol: 84.2,
      euroBundRepoSpecialnessBps: -18,
      giltSovereignVol: 114.5,
      giltRepoSpreadBps: 14,
      jgbSovereignVol: 78.6,
      jgbRepoSpreadBps: 6,
    };

    it('accepts valid baseline ingestion payload', () => {
      expect(validateCollateralBounds(validPayload)).toBe(true);
    });

    it('rejects out-of-bounds MOVE index', () => {
      expect(() =>
        validateCollateralBounds({ ...validPayload, moveIndex: 20 })
      ).toThrowError(/ICE BofA MOVE Index out of bounds/);
      expect(() =>
        validateCollateralBounds({ ...validPayload, moveIndex: 400 })
      ).toThrowError(/ICE BofA MOVE Index out of bounds/);
    });

    it('rejects out-of-bounds VIX index', () => {
      expect(() =>
        validateCollateralBounds({ ...validPayload, vixIndex: 2 })
      ).toThrowError(/Cboe VIX Index out of bounds/);
    });

    it('builds canonical evaluated state with alerts and regional metrics', () => {
      const state = buildEvaluatedBondVolatilityState(validPayload);
      expect(state.moveIndex).toBe(108.5);
      expect(state.vixIndex).toBe(15.8);
      expect(state.vixMoveRatio).toBe(1.46);
      expect(state.moveStressLevel).toBe('elevated');
      expect(state.regions.USA.sovereignVolIndex).toBe(108.5);
      expect(state.regions.EUR.sovereignVolIndex).toBe(84.2);
      expect(state.activeAlerts.length).toBeGreaterThan(0);
    });
  });
});
