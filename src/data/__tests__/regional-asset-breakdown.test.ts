import { describe, it, expect } from 'vitest';
import {
  REGIONAL_ASSET_HISTORY,
  REGIONAL_METADATA,
  ASSET_CLASS_META,
  getRegionalDataForYear,
  getHistoricalAssetClassByRegion,
} from '../regional-asset-breakdown';
import { MacroRegionId } from '../../lib/types';

describe('Regional Asset Breakdown Dataset', () => {
  const REGION_KEYS: MacroRegionId[] = [
    'north-america',
    'europe',
    'asia-pacific',
    'latin-america',
    'middle-east-africa',
  ];

  it('contains complete metadata for all 5 macroeconomic regions', () => {
    REGION_KEYS.forEach((regionId) => {
      const meta = REGIONAL_METADATA[regionId];
      expect(meta).toBeDefined();
      expect(meta.name).toBeTruthy();
      expect(meta.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(meta.flag).toBeTruthy();
      expect(meta.keyEconomies).toBeTruthy();
      expect(meta.macroProfile).toBeTruthy();
    });
  });

  it('contains valid asset class metadata', () => {
    const keys: (keyof typeof ASSET_CLASS_META)[] = [
      'realEstate',
      'equities',
      'bonds',
      'cash',
      'alternatives',
    ];
    keys.forEach((key) => {
      const meta = ASSET_CLASS_META[key];
      expect(meta).toBeDefined();
      expect(meta.name).toBeTruthy();
      expect(meta.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(meta.globalTotal2026).toBeGreaterThan(0);
    });
  });

  it('contains all milestone benchmark years from 1980 through 2026', () => {
    const years = REGIONAL_ASSET_HISTORY.map((item) => item.year);
    expect(years).toEqual([
      1980, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2022, 2024, 2025, 2026,
    ]);
  });

  it('ensures each year regional gross assets sum to totalGlobalGrossTrillion within floating-point tolerance', () => {
    REGIONAL_ASSET_HISTORY.forEach((entry) => {
      let regionalSum = 0;
      let regionalLiabilitiesSum = 0;
      let regionalNetWealthSum = 0;

      REGION_KEYS.forEach((regionId) => {
        const reg = entry.regions[regionId];
        expect(reg).toBeDefined();
        regionalSum += reg.totalGrossAssetsTrillion;
        regionalLiabilitiesSum += reg.totalLiabilitiesTrillion;
        regionalNetWealthSum += reg.netWealthTrillion;

        // Assets must be positive
        expect(reg.assets.realEstate).toBeGreaterThan(0);
        expect(reg.assets.equities).toBeGreaterThan(0);
        expect(reg.assets.bonds).toBeGreaterThan(0);
        expect(reg.assets.cash).toBeGreaterThan(0);
        expect(reg.assets.alternatives).toBeGreaterThan(0);

        // Net wealth = Gross - Liabilities
        const calculatedNet = reg.totalGrossAssetsTrillion - reg.totalLiabilitiesTrillion;
        expect(reg.netWealthTrillion).toBeCloseTo(calculatedNet, 1);
      });

      expect(regionalSum).toBeCloseTo(entry.totalGlobalGrossTrillion, 1);
      expect(regionalLiabilitiesSum).toBeCloseTo(entry.totalGlobalLiabilitiesTrillion, 1);
      expect(regionalNetWealthSum).toBeCloseTo(entry.totalGlobalNetWealthTrillion, 1);
    });
  });

  it('validates key macroeconomic historical facts', () => {
    const data1980 = getRegionalDataForYear(1980);
    const data2026 = getRegionalDataForYear(2026);

    // In 1980, North America and Europe held > 70% of global assets
    const westernShare1980 =
      data1980.regions['north-america'].shareOfGlobalGrossPercent +
      data1980.regions['europe'].shareOfGlobalGrossPercent;
    expect(westernShare1980).toBeGreaterThan(70);

    // In 2026, North America holds > 50% of the world's equities
    const naEquities2026 = data2026.regions['north-america'].assets.equities;
    const globalEquities2026 =
      data2026.regions['north-america'].assets.equities +
      data2026.regions['asia-pacific'].assets.equities +
      data2026.regions['europe'].assets.equities +
      data2026.regions['latin-america'].assets.equities +
      data2026.regions['middle-east-africa'].assets.equities;
    const naEquityShare = (naEquities2026 / globalEquities2026) * 100;
    expect(naEquityShare).toBeGreaterThan(50);

    // In 2026, Asia-Pacific holds the highest real estate value globally
    const apRealEstate2026 = data2026.regions['asia-pacific'].assets.realEstate;
    const naRealEstate2026 = data2026.regions['north-america'].assets.realEstate;
    expect(apRealEstate2026).toBeGreaterThan(naRealEstate2026);
  });

  it('handles getRegionalDataForYear fallback gracefully', () => {
    const fallbackData = getRegionalDataForYear(2099);
    expect(fallbackData.year).toBe(2026);
  });

  it('correctly maps getHistoricalAssetClassByRegion series', () => {
    const equitySeries = getHistoricalAssetClassByRegion('equities');
    expect(equitySeries.length).toBe(REGIONAL_ASSET_HISTORY.length);
    const latest = equitySeries[equitySeries.length - 1];
    expect(latest.year).toBe(2026);
    expect(latest['north-america']).toBeGreaterThan(80);
    expect(latest['north-america-pct']).toBeGreaterThan(50);
  });
});
