import { describe, it, expect } from 'vitest';
import {
  CREDIT_MARKET_OVERVIEW,
  CREDIT_RATING_SPREADS,
  HISTORICAL_CREDIT_SERIES,
  SLOOS_SECTOR_BREAKDOWNS,
  getCreditStressLabel,
  getNfciRegimeLabel,
} from '../credit-market-data';

describe('Credit Market Data Integrity & Models', () => {
  it('provides comprehensive credit overview metrics', () => {
    expect(CREDIT_MARKET_OVERVIEW.highYieldOas.currentBps).toBeGreaterThan(0);
    expect(CREDIT_MARKET_OVERVIEW.highYieldOas.effectiveYieldPct).toBeGreaterThan(0);
    expect(CREDIT_MARKET_OVERVIEW.investmentGradeOas.currentBps).toBeGreaterThan(0);
    expect(CREDIT_MARKET_OVERVIEW.investmentGradeOas.bbbFallenAngelSpreadBps).toBeGreaterThan(
      CREDIT_MARKET_OVERVIEW.investmentGradeOas.currentBps
    );
    expect(CREDIT_MARKET_OVERVIEW.financialConditions.currentNfci).toBeDefined();
    expect(CREDIT_MARKET_OVERVIEW.bankLending.currentNetTighteningPct).toBeDefined();
  });

  it('correctly classifies credit stress tiers', () => {
    expect(getCreditStressLabel(280).level).toBe('compressed');
    expect(getCreditStressLabel(400).level).toBe('normal');
    expect(getCreditStressLabel(520).level).toBe('elevated');
    expect(getCreditStressLabel(750).level).toBe('distress');
    expect(getCreditStressLabel(1200).level).toBe('crisis');
  });

  it('correctly classifies Chicago Fed NFCI financial conditions regimes', () => {
    expect(getNfciRegimeLabel(-0.75).regime).toBe('extremely_loose');
    expect(getNfciRegimeLabel(-0.25).regime).toBe('loose');
    expect(getNfciRegimeLabel(0.10).regime).toBe('neutral');
    expect(getNfciRegimeLabel(0.50).regime).toBe('tight');
    expect(getNfciRegimeLabel(1.80).regime).toBe('restrictive');
  });

  it('ensures rating spreads monotonically increase with credit risk', () => {
    for (let i = 1; i < CREDIT_RATING_SPREADS.length; i++) {
      const prev = CREDIT_RATING_SPREADS[i - 1];
      const curr = CREDIT_RATING_SPREADS[i];
      expect(curr.oasBps).toBeGreaterThan(prev.oasBps);
      expect(curr.effectiveYieldPercent).toBeGreaterThan(prev.effectiveYieldPercent);
      expect(curr.defaultRate12mPct).toBeGreaterThanOrEqual(prev.defaultRate12mPct);
    }
  });

  it('contains historical credit milestones including GFC, COVID, and rate hiking cycles', () => {
    expect(HISTORICAL_CREDIT_SERIES.length).toBeGreaterThanOrEqual(15);
    
    // GFC Lehman peak
    const gfc = HISTORICAL_CREDIT_SERIES.find((h) => h.year === 2008);
    expect(gfc).toBeDefined();
    expect(gfc!.usHighYieldOasBps).toBeGreaterThan(2000);
    expect(gfc!.isRecession).toBe(true);

    // COVID liquidation peak
    const covid = HISTORICAL_CREDIT_SERIES.find((h) => h.year === 2020);
    expect(covid).toBeDefined();
    expect(covid!.usHighYieldOasBps).toBeGreaterThan(1000);
    expect(covid!.isRecession).toBe(true);

    // 2026 current regime
    const current = HISTORICAL_CREDIT_SERIES.find((h) => h.year === 2026);
    expect(current).toBeDefined();
    expect(current!.usHighYieldOasBps).toBeLessThan(400);
  });

  it('contains valid SLOOS bank lending sector breakdowns', () => {
    expect(SLOOS_SECTOR_BREAKDOWNS.length).toBeGreaterThanOrEqual(4);
    const creOffice = SLOOS_SECTOR_BREAKDOWNS.find((s) => s.sectorId === 'cre_office');
    expect(creOffice).toBeDefined();
    expect(creOffice!.netTighteningPct).toBeGreaterThan(20);
  });
});
