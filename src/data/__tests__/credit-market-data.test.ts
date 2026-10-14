import { describe, it, expect } from 'vitest';
import {
  CREDIT_MARKET_OVERVIEW,
  CREDIT_RATING_SPREADS,
  EURO_CREDIT_RATING_SPREADS,
  EM_CREDIT_RATING_SPREADS,
  REGIONAL_CREDIT_PROFILES,
  HISTORICAL_CREDIT_SERIES,
  SLOOS_SECTOR_BREAKDOWNS,
  ECB_BLS_SECTOR_BREAKDOWNS,
  getCreditStressLabel,
  getNfciRegimeLabel,
  getLatestCreditState,
} from '../credit-market-data';
import { validateCreditBounds } from '../../../scripts/sync-credit-data';

describe('Credit Market Data Integrity & Models', () => {
  it('provides comprehensive credit overview metrics with global aggregate', () => {
    expect(CREDIT_MARKET_OVERVIEW.highYieldOas.currentBps).toBeGreaterThan(0);
    expect(CREDIT_MARKET_OVERVIEW.highYieldOas.effectiveYieldPct).toBeGreaterThan(0);
    expect(CREDIT_MARKET_OVERVIEW.investmentGradeOas.currentBps).toBeGreaterThan(0);
    expect(CREDIT_MARKET_OVERVIEW.investmentGradeOas.bbbFallenAngelSpreadBps).toBeGreaterThan(
      CREDIT_MARKET_OVERVIEW.investmentGradeOas.currentBps
    );
    expect(CREDIT_MARKET_OVERVIEW.financialConditions.currentNfci).toBeDefined();
    expect(CREDIT_MARKET_OVERVIEW.bankLending.currentNetTighteningPct).toBeDefined();
    expect(CREDIT_MARKET_OVERVIEW.globalAggregate.globalCorporateOasBps).toBeGreaterThan(0);
  });

  it('provides full regional credit profiles across GLOBAL, USA, EUR, and EM', () => {
    const regions = ['GLOBAL', 'USA', 'EUR', 'EM'] as const;
    for (const reg of regions) {
      const profile = REGIONAL_CREDIT_PROFILES[reg];
      expect(profile).toBeDefined();
      expect(profile.name).toBeDefined();
      expect(profile.flag).toBeDefined();
      expect(profile.highYieldOasBps).toBeGreaterThan(100);
      expect(profile.investmentGradeOasBps).toBeGreaterThan(20);
      expect(profile.highYieldOasBps).toBeGreaterThan(profile.investmentGradeOasBps);
      expect(profile.ratingTiers.length).toBeGreaterThanOrEqual(4);
      expect(profile.lendingSectors.length).toBeGreaterThanOrEqual(3);
    }
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

  it('ensures rating spreads monotonically increase with credit risk across regions', () => {
    const suites = [
      CREDIT_RATING_SPREADS,
      EURO_CREDIT_RATING_SPREADS,
      EM_CREDIT_RATING_SPREADS,
    ];

    for (const suite of suites) {
      for (let i = 1; i < suite.length; i++) {
        const prev = suite[i - 1];
        const curr = suite[i];
        expect(curr.oasBps).toBeGreaterThan(prev.oasBps);
        expect(curr.effectiveYieldPercent).toBeGreaterThan(prev.effectiveYieldPercent);
        expect(curr.defaultRate12mPct).toBeGreaterThanOrEqual(prev.defaultRate12mPct);
      }
    }
  });

  it('contains cross-border historical credit series with US, Euro, EM, and Global metrics', () => {
    expect(HISTORICAL_CREDIT_SERIES.length).toBeGreaterThanOrEqual(15);

    // GFC Lehman peak (2008)
    const gfc = HISTORICAL_CREDIT_SERIES.find((h) => h.year === 2008);
    expect(gfc).toBeDefined();
    expect(gfc!.usHighYieldOasBps).toBeGreaterThan(2000);
    expect(gfc!.euroHighYieldOasBps).toBeGreaterThan(2000);
    expect(gfc!.emCorporateOasBps).toBeGreaterThan(1000);
    expect(gfc!.globalCorporateOasBps).toBeGreaterThan(1500);
    expect(gfc!.isRecession).toBe(true);

    // 2011 Euro debt crisis: Euro HY widened beyond US HY
    const euroCrisis = HISTORICAL_CREDIT_SERIES.find((h) => h.year === 2011);
    expect(euroCrisis).toBeDefined();
    expect(euroCrisis!.euroHighYieldOasBps).toBeGreaterThan(euroCrisis!.usHighYieldOasBps);

    // 2026 current regime
    const current = HISTORICAL_CREDIT_SERIES.find((h) => h.year === 2026);
    expect(current).toBeDefined();
    expect(current!.usHighYieldOasBps).toBeLessThan(400);
    expect(current!.globalCorporateOasBps).toBeLessThan(400);
  });

  it('contains valid US SLOOS and Eurozone ECB BLS bank lending sector breakdowns', () => {
    expect(SLOOS_SECTOR_BREAKDOWNS.length).toBeGreaterThanOrEqual(4);
    const creOffice = SLOOS_SECTOR_BREAKDOWNS.find((s) => s.sectorId === 'cre_office');
    expect(creOffice).toBeDefined();
    expect(creOffice!.netTighteningPct).toBeGreaterThan(20);

    expect(ECB_BLS_SECTOR_BREAKDOWNS.length).toBeGreaterThanOrEqual(3);
    const ecbEnterprises = ECB_BLS_SECTOR_BREAKDOWNS.find((s) => s.sectorId === 'ecb_enterprises');
    expect(ecbEnterprises).toBeDefined();
  });

  it('returns valid latest evaluated credit state and active alerts', () => {
    const latest = getLatestCreditState();
    expect(latest.timestamp).toBeDefined();
    expect(latest.globalSummary.globalCorporateOasBps).toBeGreaterThan(0);
    expect(latest.regions.USA).toBeDefined();
    expect(latest.regions.EUR).toBeDefined();
    expect(latest.regions.EM).toBeDefined();
    expect(latest.regions.GLOBAL).toBeDefined();
    expect(latest.activeAlerts.length).toBeGreaterThan(0);
  });

  it('validates econometric bounds in ingestion pipeline', () => {
    const validPayload = {
      usHighYieldOasBps: 318,
      usInvestmentGradeOasBps: 92,
      euroHighYieldOasBps: 358,
      euroInvestmentGradeOasBps: 118,
      emCorporateOasBps: 442,
      globalCorporateOasBps: 345,
      chicagoFedNfci: -0.52,
      euroCiss: 0.12,
      globalFci: -0.35,
      sloosNetTighteningPct: 2.1,
      ecbBlsNetTighteningPct: 3.4,
    };

    expect(validateCreditBounds(validPayload)).toBe(true);

    // Should reject inversion (HY <= IG)
    expect(() =>
      validateCreditBounds({
        ...validPayload,
        usHighYieldOasBps: 120,
        usInvestmentGradeOasBps: 150,
      })
    ).toThrow(/Inversion invariant violated/);

    // Should reject unphysical spread
    expect(() =>
      validateCreditBounds({
        ...validPayload,
        usHighYieldOasBps: 5000,
      })
    ).toThrow(/out of bounds/);
  });
});
