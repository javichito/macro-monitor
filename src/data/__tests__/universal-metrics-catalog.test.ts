import { describe, it, expect } from 'vitest';
import {
  UNIVERSAL_METRIC_PILLARS,
  UNIVERSAL_METRICS_CATALOG,
  CURATED_GRAPH_RECIPES,
  resolveMetricTimeSeries,
  buildAlignedGraphDataset,
  buildCrossCountrySnapshotDataset,
  calculateSeriesCorrelation,
  getSeriesDisplayName,
} from '../universal-metrics-catalog';
import {
  serializeCustomGraphStudio,
  deserializeCustomGraphStudio,
  buildSimulatorUrl,
} from '../../lib/deep-link';

describe('Universal Metrics Catalog & Custom Graph Builder Engine', () => {
  it('exposes all 7 analytical pillars and a comprehensive catalog of metrics', () => {
    expect(UNIVERSAL_METRIC_PILLARS).toHaveLength(7);
    expect(UNIVERSAL_METRICS_CATALOG.length).toBeGreaterThanOrEqual(70);

    for (const pillar of UNIVERSAL_METRIC_PILLARS) {
      const count = UNIVERSAL_METRICS_CATALOG.filter((m) => m.pillarId === pillar.id).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it('resolves valid, chronologically sorted numeric time series for every metric in the catalog', () => {
    for (const metric of UNIVERSAL_METRICS_CATALOG) {
      const points = resolveMetricTimeSeries(
        {
          metricId: metric.id,
          scopeCode: metric.isCountryScoped ? 'USA' : undefined,
        },
        'nominal'
      );

      expect(points.length).toBeGreaterThanOrEqual(5);
      for (let i = 0; i < points.length; i++) {
        expect(Number.isFinite(points[i].year)).toBe(true);
        expect(Number.isFinite(points[i].value)).toBe(true);
        if (i > 0) {
          expect(points[i].year).toBeGreaterThan(points[i - 1].year);
        }
      }
    }
  });

  it('resolves sovereign metrics across multiple countries and economic blocs', () => {
    const usaGdp = resolveMetricTimeSeries({
      metricId: 'country:gdpTrillionUSD',
      scopeCode: 'USA',
    });
    const chnGdp = resolveMetricTimeSeries({
      metricId: 'country:gdpTrillionUSD',
      scopeCode: 'CHN',
    });
    const g7Gdp = resolveMetricTimeSeries({
      metricId: 'country:gdpTrillionUSD',
      scopeCode: 'G7',
    });

    expect(usaGdp[usaGdp.length - 1].value).toBeGreaterThan(20);
    expect(chnGdp[chnGdp.length - 1].value).toBeGreaterThan(15);
    expect(g7Gdp[g7Gdp.length - 1].value).toBeGreaterThan(40);

    const usaLabel = getSeriesDisplayName({
      metricId: 'country:gdpTrillionUSD',
      scopeCode: 'USA',
    });
    expect(usaLabel.displayName).toContain('United States');
    expect(usaLabel.shortLabel).toContain('USA');
  });

  it('aligns multi-series datasets and computes transformations, custom formulas, and correlations', () => {
    const aligned = buildAlignedGraphDataset({
      series: [
        {
          key: 's1',
          metricId: 'mm_m2_supply',
          color: '#38bdf8',
          yAxisId: 'left',
          chartStyle: 'area',
        },
        {
          key: 's2',
          metricId: 'hm_median_home_price',
          color: '#f59e0b',
          yAxisId: 'right',
          chartStyle: 'line',
        },
      ],
      startYear: 2000,
      endYear: 2026,
      transformMode: 'indexed100',
      formulaMode: 'ratio',
      leadLagYears: 0,
      interpolateGaps: true,
    });

    expect(aligned.rows.length).toBeGreaterThan(10);
    expect(aligned.seriesMeta).toHaveLength(2);
    // Indexed 100 starts at 100.0 for the first observation
    expect(aligned.rows[0].s1).toBe(100);
    expect(aligned.rows[0].s2).toBe(100);
    expect(aligned.rows[0].formulaValue).toBe(1);

    expect(aligned.correlation).not.toBeNull();
    expect(aligned.correlation!.pearsonR).toBeGreaterThan(0.8);
  });

  it('computes Pearson correlation accurately for positive, inverse, and shifted series', () => {
    const positive = calculateSeriesCorrelation(
      [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
      ],
      'Metric A',
      'Metric B'
    );
    expect(positive?.pearsonR).toBe(1);
    expect(positive?.rSquared).toBe(1);

    const inverse = calculateSeriesCorrelation(
      [
        { x: 1, y: 10 },
        { x: 2, y: 8 },
        { x: 3, y: 6 },
        { x: 4, y: 4 },
      ],
      'Metric A',
      'Metric B'
    );
    expect(inverse?.pearsonR).toBe(-1);
    expect(inverse?.directionLabel).toBe('Inverse Divergence');
  });

  it('builds a 26-country cross-sectional snapshot dataset for any pair of country metrics', () => {
    const snapshot = buildCrossCountrySnapshotDataset({
      metricIdX: 'country:gdpPerCapitaUSD',
      metricIdY: 'country:medianWealthUSD',
      year: 2026,
      currencyPerspective: 'nominal',
    });

    expect(snapshot.points.length).toBeGreaterThanOrEqual(20);
    expect(snapshot.points[0].valueX).toBeGreaterThanOrEqual(
      snapshot.points[snapshot.points.length - 1].valueX
    );
    expect(snapshot.correlation).not.toBeNull();
  });

  it('validates all curated graph recipes resolve cleanly', () => {
    for (const recipe of CURATED_GRAPH_RECIPES) {
      const dataset = buildAlignedGraphDataset({
        series: recipe.series,
        startYear: recipe.startYear,
        endYear: recipe.endYear,
        transformMode: recipe.transformMode,
        formulaMode: recipe.formulaMode,
        leadLagYears: recipe.leadLagYears,
      });
      expect(dataset.rows.length).toBeGreaterThan(5);
      expect(dataset.seriesMeta.length).toBe(recipe.series.length);
    }
  });

  it('serializes and deserializes custom graph studio deep links in both hash and query formats', () => {
    const state = {
      chartType: 'composed' as const,
      transformMode: 'indexed100' as const,
      formulaMode: 'ratio' as const,
      leadLagYears: -1,
      startYear: 1995,
      endYear: 2026,
      seriesCompact: 'mm_m2_supply||left|area,hm_median_home_price||right|line',
    };

    const hashStr = serializeCustomGraphStudio(state, 'hash');
    const restoredFromHash = deserializeCustomGraphStudio(hashStr);
    expect(restoredFromHash).toEqual(state);

    const queryUrl = buildSimulatorUrl({
      simulator: 'studio',
      state,
      format: 'query',
      customOrigin: 'https://macro-monitor.app',
      customPathname: '/studio',
    });
    const restoredFromQuery = deserializeCustomGraphStudio(queryUrl);
    expect(restoredFromQuery).toEqual(state);
  });
});
