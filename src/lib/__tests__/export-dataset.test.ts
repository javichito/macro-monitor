import { describe, it, expect } from 'vitest';
import {
  sanitizeFilename,
  generateCsv,
  generateJson,
} from '../export-dataset';

describe('export-dataset utility', () => {
  it('sanitizes titles into filesystem-safe filenames', () => {
    expect(sanitizeFilename('Global Wealth Pyramid (2026)')).toBe('global-wealth-pyramid-2026');
    expect(sanitizeFilename('Yield Curve & 10Y-2Y Spread')).toBe('yield-curve-10y-2y-spread');
    expect(sanitizeFilename('   ')).toBe('dataset');
  });

  it('generates RFC 4180 compliant CSV with UTF-8 BOM and correct quoting', () => {
    const testData = [
      { id: 1, name: 'Alice, Smith', note: 'Line 1\nLine 2', quote: 'Says "Hello"' },
      { id: 2, name: 'Bob', note: 'Single line', quote: 'Normal' },
    ];

    const csv = generateCsv(testData);

    // Verifies UTF-8 BOM is present at byte 0
    expect(csv.startsWith('\uFEFF')).toBe(true);

    const stripped = csv.slice(1);
    const lines = stripped.split('\r\n');
    expect(lines[0]).toBe('id,name,note,quote');
    expect(lines[1]).toContain('"Alice, Smith"');
    expect(lines[1]).toContain('"Says ""Hello"""');
    expect(lines[1]).toContain('"Line 1\nLine 2"');
  });

  it('supports custom column keys, labels, and formatting functions', () => {
    const data = [
      { country: 'USA', gdpTrillion: 28.7, rate: 0.0525 },
      { country: 'CHN', gdpTrillion: 18.5, rate: 0.0345 },
    ];

    const columns = [
      { key: 'country', label: 'Country Code' },
      {
        key: 'gdpTrillion',
        label: 'GDP ($ Trillion)',
        format: (val: number) => `$${val.toFixed(2)}T`,
      },
      {
        key: 'rate',
        label: 'Policy Rate',
        format: (val: number) => `${(val * 100).toFixed(2)}%`,
      },
    ];

    const csv = generateCsv(data, columns);
    const stripped = csv.slice(1);
    const rows = stripped.split('\r\n');

    expect(rows[0]).toBe('Country Code,GDP ($ Trillion),Policy Rate');
    expect(rows[1]).toBe('USA,$28.70T,5.25%');
    expect(rows[2]).toBe('CHN,$18.50T,3.45%');
  });

  it('generates structured JSON containing rich research metadata and clean records', () => {
    const data = [
      { year: 2026, gini: 0.88 },
      { year: 2025, gini: 0.882 },
    ];

    const metadata = {
      title: 'Global Inequality Trends',
      source: 'Credit Suisse / UBS Global Wealth Databook',
      unit: 'Gini coefficient (0-1)',
      year: 2026,
    };

    const jsonString = generateJson(data, metadata);
    const parsed = JSON.parse(jsonString);

    expect(parsed.metadata.title).toBe('Global Inequality Trends');
    expect(parsed.metadata.source).toBe('Credit Suisse / UBS Global Wealth Databook');
    expect(parsed.metadata.unit).toBe('Gini coefficient (0-1)');
    expect(parsed.metadata.recordCount).toBe(2);
    expect(parsed.data).toEqual(data);
  });
});
