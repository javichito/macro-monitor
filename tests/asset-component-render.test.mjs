import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AreaChart, Area } from 'recharts';
import { createJiti } from 'jiti';

const jiti = createJiti(process.cwd(), { jsx: true });
const { AssetEvolutionChart } = jiti('./src/components/assets/AssetEvolutionChart.tsx');
const { GLOBAL_ASSET_HISTORY } = jiti('./src/data/asset-breakdown.ts');

/*
 * Component integration tests ensuring AssetEvolutionChart renders without errors
 * across all valid props, and that all expected UI elements, controls, and SVG paths exist.
 */

test('Component render - Renders successfully for all currency perspectives without crashing', () => {
  const perspectives = ['nominal', 'real', 'ppp'];

  for (const perspective of perspectives) {
    const element = React.createElement(AssetEvolutionChart, {
      currencyPerspective: perspective,
      selectedYear: 2026,
    });

    const markup = ReactDOMServer.renderToStaticMarkup(element);
    assert.ok(markup.length > 5000, `Rendered markup for perspective "${perspective}" must be populated`);
    assert.ok(markup.includes('Global Asset Allocation Stack'), 'Must render chart title');
    assert.ok(markup.includes('recharts-responsive-container'), 'Must render Recharts ResponsiveContainer');
    assert.ok(markup.includes('min-height:320px'), 'Must enforce minimum height to prevent layout collapse');
    assert.ok(markup.includes('Macro Classes (6)'), 'Must render macro granularity toggle button');
    assert.ok(markup.includes('Sub-Sectors (18)'), 'Must render sub-sector granularity toggle button');
    assert.ok(markup.includes('Valuation ($T)'), 'Must render valuation unit toggle button');
    assert.ok(markup.includes('Share (%)'), 'Must render share unit toggle button');
  }
});

test('Component render - Renders across key historical timeline boundary years', () => {
  const boundaryYears = [1980, 2000, 2015, 2026];

  for (const year of boundaryYears) {
    const element = React.createElement(AssetEvolutionChart, {
      currencyPerspective: 'nominal',
      selectedYear: year,
    });

    const markup = ReactDOMServer.renderToStaticMarkup(element);
    assert.ok(markup.includes(`Asset Class Breakdown (${year})`), `Must render breakdown section for year ${year}`);
  }
});

test('Chart SVG Area rendering - Direct mapping produces filled SVG paths for all 6 macro classes', () => {
  /*
   * Recharts AreaChart renders <path class="recharts-curve recharts-area-area" ... />
   * only when its Area children are discovered without Fragment obstruction.
   */
  const macroData = GLOBAL_ASSET_HISTORY.map((entry) => ({
    year: entry.year,
    realEstate: entry.categories.find((c) => c.id === 'real-estate')?.valueTrillion || 0,
    equities: entry.categories.find((c) => c.id === 'equities')?.valueTrillion || 0,
    bonds: entry.categories.find((c) => c.id === 'bonds-pensions')?.valueTrillion || 0,
    cash: entry.categories.find((c) => c.id === 'cash-deposits')?.valueTrillion || 0,
    gold: entry.categories.find((c) => c.id === 'gold-commodities')?.valueTrillion || 0,
    crypto: entry.categories.find((c) => c.id === 'crypto-digital')?.valueTrillion || 0,
  }));

  const macroKeys = ['realEstate', 'equities', 'bonds', 'cash', 'gold', 'crypto'];
  const chartElement = React.createElement(
    AreaChart,
    { width: 800, height: 400, data: macroData },
    macroKeys.map((key) =>
      React.createElement(Area, {
        key,
        dataKey: key,
        stackId: '1',
        isAnimationActive: false,
      })
    )
  );

  const markup = ReactDOMServer.renderToStaticMarkup(chartElement);
  const areaMatches = markup.match(/class="[^"]*recharts-area-area[^"]*"/g) || [];
  assert.strictEqual(
    areaMatches.length,
    6,
    `Must render exactly 6 filled SVG area paths for macro classes, got ${areaMatches.length}`
  );
  assert.ok(markup.includes('d="M'), 'Rendered SVG must have non-empty path coordinates');
});

test('Chart SVG Area rendering - Direct mapping produces filled SVG paths for all 18 sub-sectors', () => {
  const subKeys = [
    'reResidential', 'reCommercial', 'reAgricultural',
    'eqDeveloped', 'eqEmerging', 'eqPrivate',
    'bondSovereign', 'bondCorporate', 'bondPension',
    'cashBank', 'cashMmf', 'cashPhysical',
    'goldJewelry', 'goldInvestment', 'goldReserves',
    'cryptoBtc', 'cryptoSmart', 'cryptoStable',
  ];

  const subData = GLOBAL_ASSET_HISTORY.map((entry) => {
    const out = { year: entry.year };
    for (const k of subKeys) {
      out[k] = 10;
    }
    return out;
  });

  const chartElement = React.createElement(
    AreaChart,
    { width: 800, height: 400, data: subData },
    subKeys.map((key) =>
      React.createElement(Area, {
        key,
        dataKey: key,
        stackId: '1',
        isAnimationActive: false,
      })
    )
  );

  const markup = ReactDOMServer.renderToStaticMarkup(chartElement);
  const areaMatches = markup.match(/class="[^"]*recharts-area-area[^"]*"/g) || [];
  assert.strictEqual(
    areaMatches.length,
    18,
    `Must render exactly 18 filled SVG area paths for sub-sectors, got ${areaMatches.length}`
  );
  assert.ok(markup.includes('d="M'), 'Rendered SVG must have non-empty path coordinates');
});

test('Component render - Renders all asset cards and sub-sector preview bars', () => {
  const element = React.createElement(AssetEvolutionChart, {
    currencyPerspective: 'nominal',
    selectedYear: 2026,
  });

  const markup = ReactDOMServer.renderToStaticMarkup(element);
  const expectedClasses = [
    'Real Estate &amp; Land',
    'Public &amp; Private Equities',
    'Bonds &amp; Pension Reserves',
    'Cash &amp; Bank Deposits',
    'Gold &amp; Precious Metals',
    'Digital Assets &amp; Crypto',
  ];

  for (const cls of expectedClasses) {
    assert.ok(markup.includes(cls), `Must render card for asset class "${cls}"`);
  }

  // Liabilities section
  assert.ok(markup.includes('Global Liabilities &amp; Encumbrances'), 'Must render liabilities balance sheet');
  assert.ok(markup.includes('Residential Mortgages'), 'Must render mortgages liability item');
  assert.ok(markup.includes('Consumer &amp; Revolving Credit'), 'Must render consumer credit liability item');
  assert.ok(markup.includes('Student &amp; Education Debt'), 'Must render student debt liability item');
});
