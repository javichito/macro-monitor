import { describe, it, expect } from 'vitest';
import {
  SOVEREIGN_SURFACES,
  STANDARD_SURFACE_TENORS,
  STANDARD_SURFACE_TENOR_MONTHS,
  getSurfaceColor,
} from '../yield-curve-3d-data';

describe('Yield Curve 3D Surface Datasets', () => {
  const sovereigns: Array<'USA' | 'DEU' | 'JPN' | 'GBR'> = ['USA', 'DEU', 'JPN', 'GBR'];

  it('provides complete datasets for all 4 major sovereign benchmark issuers', () => {
    sovereigns.forEach((code) => {
      const entry = SOVEREIGN_SURFACES[code];
      expect(entry).toBeDefined();
      expect(entry.longterm).toBeDefined();
      expect(entry.longterm.sovereignCode).toBe(code);
      expect(entry.longterm.slices.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('guarantees tenors align with standard market maturities from 1M to 30Y', () => {
    expect(STANDARD_SURFACE_TENORS).toEqual([
      '1M',
      '3M',
      '6M',
      '1Y',
      '2Y',
      '3Y',
      '5Y',
      '7Y',
      '10Y',
      '20Y',
      '30Y',
    ]);
    expect(STANDARD_SURFACE_TENOR_MONTHS.length).toBe(STANDARD_SURFACE_TENORS.length);

    sovereigns.forEach((code) => {
      const ds = SOVEREIGN_SURFACES[code].longterm;
      ds.slices.forEach((slice) => {
        expect(slice.curve.length).toBe(STANDARD_SURFACE_TENORS.length);
        slice.curve.forEach((pt, idx) => {
          expect(pt.tenor).toBe(STANDARD_SURFACE_TENORS[idx]);
          expect(pt.tenorMonths).toBe(STANDARD_SURFACE_TENOR_MONTHS[idx]);
          expect(Number.isFinite(pt.yieldPercent)).toBe(true);
        });
      });
    });
  });

  it('verifies that 10Y-2Y and 10Y-3M spreads are mathematically consistent with curve endpoints', () => {
    sovereigns.forEach((code) => {
      const ds = SOVEREIGN_SURFACES[code].longterm;
      ds.slices.forEach((slice) => {
        const y10 = slice.curve.find((p) => p.tenor === '10Y')!.yieldPercent;
        const y2 = slice.curve.find((p) => p.tenor === '2Y')!.yieldPercent;
        const y3m = slice.curve.find((p) => p.tenor === '3M')!.yieldPercent;

        const expected10Y2Y = Number((y10 - y2).toFixed(2));
        const expected10Y3M = Number((y10 - y3m).toFixed(2));

        expect(slice.spread10Y2Y).toBeCloseTo(expected10Y2Y, 2);
        expect(slice.spread10Y3M).toBeCloseTo(expected10Y3M, 2);

        // An inverted curve must flag as true whenever either 10Y-2Y or 10Y-3M spread is negative
        const expectedInversion = expected10Y2Y < 0 || expected10Y3M < 0;
        expect(slice.isInverted).toBe(expectedInversion);
      });
    });
  });

  it('confirms historic US yield curve inversions in 2000, 2006, and 2022-2023', () => {
    const usaSlices = SOVEREIGN_SURFACES.USA.longterm.slices;

    const slice2000 = usaSlices.find((s) => s.year === 2000);
    const slice2006 = usaSlices.find((s) => s.year === 2006);
    const slice2022 = usaSlices.find((s) => s.year === 2022);
    const slice2023 = usaSlices.find((s) => s.year === 2023);

    expect(slice2000?.isInverted).toBe(true);
    expect(slice2006?.isInverted).toBe(true);
    expect(slice2022?.isInverted).toBe(true);
    expect(slice2023?.isInverted).toBe(true);
  });

  it('provides a high-resolution quarterly modern dataset for USA (2020-2026)', () => {
    const modern = SOVEREIGN_SURFACES.USA.modern;
    expect(modern).toBeDefined();
    expect(modern!.slices.length).toBeGreaterThanOrEqual(12);

    // Verify presence of COVID emergency slice and un-inversion slice
    const covidSlice = modern!.slices.find((s) => s.dateLabel.includes('2020 Q1'));
    const unInvertSlice = modern!.slices.find((s) => s.dateLabel.includes('2024 Q3'));

    expect(covidSlice).toBeDefined();
    expect(unInvertSlice).toBeDefined();
    expect(unInvertSlice!.spread10Y2Y).toBeGreaterThanOrEqual(0);
  });

  it('maps normalized elevation into valid RGB coordinates across all color palettes', () => {
    const palettes = ['thermal', 'viridis', 'spectral', 'cyberpunk'] as const;

    palettes.forEach((pal) => {
      [0.0, 0.25, 0.5, 0.75, 1.0].forEach((v) => {
        const rgb = getSurfaceColor(v, pal);
        expect(rgb.length).toBe(3);
        rgb.forEach((channel) => {
          expect(channel).toBeGreaterThanOrEqual(0);
          expect(channel).toBeLessThanOrEqual(255);
        });
      });
    });
  });
});
