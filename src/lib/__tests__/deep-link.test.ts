import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  serializeFiscalDominance,
  deserializeFiscalDominance,
  serializeWealthCalculator,
  deserializeWealthCalculator,
  serializePppConverter,
  deserializePppConverter,
  serializeCrossAssetRatio,
  deserializeCrossAssetRatio,
  serializeBondVolatility,
  deserializeBondVolatility,
  serializeHousingMacro,
  deserializeHousingMacro,
  buildSimulatorUrl,
  copySimulatorLinkToClipboard,
  extractParamsFromUrl,
  updateBrowserUrl,
  useDeepLinkSync,
  FiscalDominanceState,
  WealthCalculatorState,
  PppConverterState,
  CrossAssetRatioState,
  BondVolatilityState,
  HousingMacroState,
} from '../deep-link';

describe('Deep-Link State Serialization Engine', () => {
  describe('Fiscal Dominance Simulator', () => {
    const sampleState: FiscalDominanceState = {
      country: 'USA',
      scenario: 'custom',
      bondYield: 5.25,
      primaryDeficit: 6.8,
      realGrowth: 1.75,
      inflation: 3.4,
      metricTab: 'debt',
    };

    it('serializes fiscal dominance state to URL hash format with concise parameters', () => {
      const hash = serializeFiscalDominance(sampleState, 'hash');
      expect(hash).toContain('#fiscal-simulator?');
      expect(hash).toContain('c=USA');
      expect(hash).toContain('s=custom');
      expect(hash).toContain('y=5.25');
      expect(hash).toContain('d=6.80');
      expect(hash).toContain('g=1.75');
      expect(hash).toContain('i=3.40');
      expect(hash).toContain('m=debt');
    });

    it('serializes fiscal dominance state to query string format with prefixed parameters', () => {
      const query = serializeFiscalDominance(sampleState, 'query');
      expect(query).not.toContain('#');
      expect(query).toContain('fds_c=USA');
      expect(query).toContain('fds_s=custom');
      expect(query).toContain('fds_y=5.25');
      expect(query).toContain('fds_d=6.80');
      expect(query).toContain('fds_g=1.75');
      expect(query).toContain('fds_i=3.40');
      expect(query).toContain('fds_m=debt');
    });

    it('deserializes fiscal dominance state accurately from hash format', () => {
      const hashUrl = 'https://macro-monitor.app/macro?tab=liquidity#fiscal-simulator?c=ITA&s=rate_shock&y=6.10&d=4.50&g=0.80&i=2.50&m=interest';
      const parsed = deserializeFiscalDominance(hashUrl);

      expect(parsed).not.toBeNull();
      expect(parsed?.country).toBe('ITA');
      expect(parsed?.scenario).toBe('rate_shock');
      expect(parsed?.bondYield).toBe(6.1);
      expect(parsed?.primaryDeficit).toBe(4.5);
      expect(parsed?.realGrowth).toBe(0.8);
      expect(parsed?.inflation).toBe(2.5);
      expect(parsed?.metricTab).toBe('interest');
    });

    it('deserializes fiscal dominance state accurately from query string format', () => {
      const queryUrl = 'https://macro-monitor.app/macro?tab=liquidity&fds_c=FRA&fds_s=stagflation&fds_y=5.50&fds_d=5.00&fds_g=-0.50&fds_i=4.00&fds_m=debt#fiscal-simulator';
      const parsed = deserializeFiscalDominance(queryUrl);

      expect(parsed).not.toBeNull();
      expect(parsed?.country).toBe('FRA');
      expect(parsed?.scenario).toBe('stagflation');
      expect(parsed?.bondYield).toBe(5.5);
      expect(parsed?.primaryDeficit).toBe(5.0);
      expect(parsed?.realGrowth).toBe(-0.5);
      expect(parsed?.inflation).toBe(4.0);
      expect(parsed?.metricTab).toBe('debt');
    });

    it('deserializes verbose parameter names as fallbacks', () => {
      const verboseUrl = 'https://macro-monitor.app/macro?country=JPN&yield=3.2&primaryDeficit=7.1&realGrowth=0.5&inflation=2.8';
      const parsed = deserializeFiscalDominance(verboseUrl);

      expect(parsed).not.toBeNull();
      expect(parsed?.country).toBe('JPN');
      expect(parsed?.bondYield).toBe(3.2);
      expect(parsed?.primaryDeficit).toBe(7.1);
      expect(parsed?.realGrowth).toBe(0.5);
      expect(parsed?.inflation).toBe(2.8);
    });

    it('clamps outlier or malformed numeric parameters to prevent simulator crashes', () => {
      const malformedUrl = 'https://macro-monitor.app/macro#fiscal-simulator?c=USA&y=9999&d=-500&g=not-a-number';
      const parsed = deserializeFiscalDominance(malformedUrl);

      expect(parsed).not.toBeNull();
      expect(parsed?.bondYield).toBe(50.0); // Clamped to max 50%
      expect(parsed?.primaryDeficit).toBe(-20.0); // Clamped to min -20%
      // Not a number should fall back to sovereign default (2.1 for USA)
      expect(parsed?.realGrowth).toBe(2.1);
    });

    it('returns null when URL does not contain fiscal dominance parameters', () => {
      const irrelevantUrl = 'https://macro-monitor.app/macro?tab=yields#unrelated';
      expect(deserializeFiscalDominance(irrelevantUrl)).toBeNull();
    });
  });

  describe('Wealth Calculator', () => {
    const sampleWealth: WealthCalculatorState = {
      country: 'CHE',
      netWorth: 350000,
    };

    it('serializes wealth calculator state to hash and query string', () => {
      const hash = serializeWealthCalculator(sampleWealth, 'hash');
      expect(hash).toContain('#wealth-calculator?');
      expect(hash).toContain('c=CHE');
      expect(hash).toContain('nw=350000');

      const query = serializeWealthCalculator(sampleWealth, 'query');
      expect(query).toContain('wc_c=CHE');
      expect(query).toContain('wc_nw=350000');
    });

    it('deserializes wealth calculator state from hash format', () => {
      const url = 'https://macro-monitor.app/wealth?calc=percentile#wealth-calculator?c=AUS&nw=1250000';
      const parsed = deserializeWealthCalculator(url);

      expect(parsed).not.toBeNull();
      expect(parsed?.country).toBe('AUS');
      expect(parsed?.netWorth).toBe(1250000);
    });

    it('deserializes wealth calculator state from query parameters', () => {
      const url = 'https://macro-monitor.app/wealth?wc_country=DEU&wc_networth=75000';
      const parsed = deserializeWealthCalculator(url);

      expect(parsed).not.toBeNull();
      expect(parsed?.country).toBe('DEU');
      expect(parsed?.netWorth).toBe(75000);
    });

    it('returns null if no wealth parameters are present', () => {
      expect(deserializeWealthCalculator('https://macro-monitor.app/wealth')).toBeNull();
    });
  });

  describe('PPP Converter', () => {
    const samplePpp: PppConverterState = {
      fromCountry: 'USA',
      toCountry: 'ESP',
      netWorth: 180000,
    };

    it('serializes and deserializes PPP state', () => {
      const hash = serializePppConverter(samplePpp, 'hash');
      expect(hash).toContain('#ppp-converter?');
      expect(hash).toContain('f=USA');
      expect(hash).toContain('t=ESP');
      expect(hash).toContain('a=180000');

      const url = `https://macro-monitor.app/wealth${hash}`;
      const parsed = deserializePppConverter(url);

      expect(parsed).not.toBeNull();
      expect(parsed?.fromCountry).toBe('USA');
      expect(parsed?.toCountry).toBe('ESP');
      expect(parsed?.netWorth).toBe(180000);
    });
  });

  describe('Cross-Asset Ratio Studio', () => {
    const sampleRatios: CrossAssetRatioState = {
      ratio: 'copper-gold',
      numerator: 5.1,
      denominator: 2800,
      viewMode: 'normalized',
      timeWindow: '5y',
    };

    it('serializes and deserializes Cross-Asset Ratio Studio state', () => {
      const hash = serializeCrossAssetRatio(sampleRatios, 'hash');
      expect(hash).toContain('#ratio-studio?');
      expect(hash).toContain('r=copper-gold');
      expect(hash).toContain('n=5.10');
      expect(hash).toContain('d=2800.00');
      expect(hash).toContain('v=normalized');
      expect(hash).toContain('w=5y');

      const url = `https://macro-monitor.app/macro${hash}`;
      const parsed = deserializeCrossAssetRatio(url);

      expect(parsed).not.toBeNull();
      expect(parsed?.ratio).toBe('copper-gold');
      expect(parsed?.numerator).toBe(5.1);
      expect(parsed?.denominator).toBe(2800);
      expect(parsed?.viewMode).toBe('normalized');
      expect(parsed?.timeWindow).toBe('5y');
    });
  });

  describe('Bond Volatility & Collateral Plumbing Radar', () => {
    const sampleVolatility: BondVolatilityState = {
      view: 'vix_move',
      region: 'USA',
      timeWindow: '3y',
      simMove: 125.0,
      simVix: 18.5,
    };

    it('serializes and deserializes Bond Volatility Radar state in hash format', () => {
      const hash = serializeBondVolatility(sampleVolatility, 'hash');
      expect(hash).toContain('#bond-volatility?');
      expect(hash).toContain('v=vix_move');
      expect(hash).toContain('reg=USA');
      expect(hash).toContain('w=3y');
      expect(hash).toContain('m=125.0');
      expect(hash).toContain('vx=18.5');

      const url = `https://macro-monitor.app/macro${hash}`;
      const parsed = deserializeBondVolatility(url);

      expect(parsed).not.toBeNull();
      expect(parsed?.view).toBe('vix_move');
      expect(parsed?.region).toBe('USA');
      expect(parsed?.timeWindow).toBe('3y');
      expect(parsed?.simMove).toBe(125.0);
      expect(parsed?.simVix).toBe(18.5);
    });

    it('serializes and deserializes in query string format', () => {
      const query = serializeBondVolatility(sampleVolatility, 'query');
      expect(query).toContain('bvp_view=vix_move');
      expect(query).toContain('bvp_region=USA');
      expect(query).toContain('bvp_w=3y');
      expect(query).toContain('bvp_move=125.0');
      expect(query).toContain('bvp_vix=18.5');

      const url = `https://macro-monitor.app/macro?tab=volatility&${query}`;
      const parsed = deserializeBondVolatility(url);

      expect(parsed).not.toBeNull();
      expect(parsed?.view).toBe('vix_move');
      expect(parsed?.region).toBe('USA');
      expect(parsed?.simMove).toBe(125.0);
      expect(parsed?.simVix).toBe(18.5);
    });

    it('builds a canonical shareable URL with tab=volatility and hash', () => {
      const url = buildSimulatorUrl({
        simulator: 'volatility',
        state: sampleVolatility,
        format: 'hash',
        customOrigin: 'https://macro-monitor.com',
        customPathname: '/macro',
      });

      expect(url).toContain('https://macro-monitor.com/macro?tab=volatility#bond-volatility?');
      expect(url).toContain('v=vix_move');
      expect(url).toContain('reg=USA');
    });
  });

  describe('Housing Macro & Affordability Dynamics', () => {
    const sampleHousing: HousingMacroState = {
      view: 'affordability',
      region: 'USA',
      timeWindow: '10y',
      simRate: 6.75,
      simPrice: 425000,
      simIncome: 95000,
    };

    it('serializes housing state to URL hash format with concise parameters', () => {
      const hash = serializeHousingMacro(sampleHousing, 'hash');
      expect(hash).toContain('#housing-radar?');
      expect(hash).toContain('v=affordability');
      expect(hash).toContain('reg=USA');
      expect(hash).toContain('w=10y');
      expect(hash).toContain('r=6.75');
      expect(hash).toContain('p=425000');
      expect(hash).toContain('inc=95000');
    });

    it('serializes housing state to query string format with prefixed parameters', () => {
      const query = serializeHousingMacro(sampleHousing, 'query');
      expect(query).not.toContain('#');
      expect(query).toContain('housing_view=affordability');
      expect(query).toContain('housing_region=USA');
      expect(query).toContain('housing_w=10y');
      expect(query).toContain('housing_r=6.75');
      expect(query).toContain('housing_p=425000');
      expect(query).toContain('housing_inc=95000');
    });

    it('deserializes housing parameters from hash fragment', () => {
      const url = 'https://macro-monitor.app/macro#housing-radar?v=rates&reg=GBR&w=5y&r=5.25';
      const parsed = deserializeHousingMacro(url);

      expect(parsed).not.toBeNull();
      expect(parsed?.view).toBe('rates');
      expect(parsed?.region).toBe('GBR');
      expect(parsed?.timeWindow).toBe('5y');
      expect(parsed?.simRate).toBe(5.25);
    });

    it('deserializes housing parameters from query string', () => {
      const url =
        'https://macro-monitor.app/macro?tab=housing&housing_view=real_prices&housing_region=CAN&housing_r=5.15&housing_p=650000&housing_inc=85000';
      const parsed = deserializeHousingMacro(url);

      expect(parsed).not.toBeNull();
      expect(parsed?.view).toBe('real_prices');
      expect(parsed?.region).toBe('CAN');
      expect(parsed?.simRate).toBe(5.15);
      expect(parsed?.simPrice).toBe(650000);
      expect(parsed?.simIncome).toBe(85000);
    });

    it('builds canonical shareable URL with tab=housing and hash', () => {
      const url = buildSimulatorUrl({
        simulator: 'housing',
        state: sampleHousing,
        format: 'hash',
        customOrigin: 'https://macro-monitor.com',
        customPathname: '/macro',
      });

      expect(url).toContain('https://macro-monitor.com/macro?tab=housing#housing-radar?');
      expect(url).toContain('v=affordability');
      expect(url).toContain('r=6.75');
    });
  });

  describe('buildSimulatorUrl', () => {
    it('constructs a shareable URL with correct page tabs and hash serialization', () => {
      const fiscalUrl = buildSimulatorUrl({
        simulator: 'fiscal',
        state: {
          country: 'USA',
          scenario: 'custom',
          bondYield: 4.8,
          primaryDeficit: 6.2,
          realGrowth: 2.0,
          inflation: 3.1,
        },
        format: 'hash',
        customOrigin: 'https://macro-monitor.com',
        customPathname: '/macro',
      });

      expect(fiscalUrl).toContain('https://macro-monitor.com/macro?tab=liquidity#fiscal-simulator?');
      expect(fiscalUrl).toContain('c=USA');
      expect(fiscalUrl).toContain('y=4.80');
    });

    it('constructs a shareable URL with query parameters when query format is requested', () => {
      const wealthUrl = buildSimulatorUrl({
        simulator: 'wealth',
        state: {
          country: 'JPN',
          netWorth: 95000,
        },
        format: 'query',
        customOrigin: 'https://macro-monitor.com',
        customPathname: '/wealth',
      });

      expect(wealthUrl).toContain('https://macro-monitor.com/wealth?calc=percentile&wc_c=JPN&wc_nw=95000#wealth-calculator');
    });
  });

  describe('copySimulatorLinkToClipboard', () => {
    it('invokes navigator.clipboard.writeText when available', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const success = await copySimulatorLinkToClipboard('https://macro-monitor.app/test');
      expect(success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('https://macro-monitor.app/test');
    });
  });

  describe('updateBrowserUrl and useDeepLinkSync', () => {
    it('updates window.history.replaceState with the serialized URL', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      updateBrowserUrl('wealth', { country: 'FRA', netWorth: 220000 });

      expect(replaceStateSpy).toHaveBeenCalled();
      const lastCall = replaceStateSpy.mock.calls[replaceStateSpy.mock.calls.length - 1];
      expect(lastCall[2]).toContain('#wealth-calculator?');
      expect(lastCall[2]).toContain('c=FRA');
      expect(lastCall[2]).toContain('nw=220000');

      replaceStateSpy.mockRestore();
    });

    it('debounces live address bar updates in useDeepLinkSync hook', async () => {
      vi.useFakeTimers();
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      const { rerender } = renderHook(
        ({ state }) => useDeepLinkSync('fiscal', state, true, { debounceMs: 100 }),
        {
          initialProps: {
            state: {
              country: 'USA',
              scenario: 'custom',
              bondYield: 4.5,
              primaryDeficit: 5.0,
              realGrowth: 2.0,
              inflation: 2.5,
            },
          },
        }
      );

      // Fast slider movement: change yield twice in quick succession
      rerender({
        state: {
          country: 'USA',
          scenario: 'custom',
          bondYield: 4.8,
          primaryDeficit: 5.0,
          realGrowth: 2.0,
          inflation: 2.5,
        },
      });

      rerender({
        state: {
          country: 'USA',
          scenario: 'custom',
          bondYield: 5.2,
          primaryDeficit: 5.0,
          realGrowth: 2.0,
          inflation: 2.5,
        },
      });

      // Before timer ticks, history has not been flooded
      expect(replaceStateSpy).not.toHaveBeenCalled();

      // Fast-forward debounce interval
      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(replaceStateSpy).toHaveBeenCalledTimes(1);
      const targetUrl = replaceStateSpy.mock.calls[0][2] as string;
      expect(targetUrl).toContain('y=5.20');

      replaceStateSpy.mockRestore();
      vi.useRealTimers();
    });
  });
});
