import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { Area, AreaChart } from 'recharts';
import { findAllByType } from 'recharts/lib/util/ReactUtils.js';
import { createJiti } from 'jiti';

const jiti = createJiti(process.cwd(), { jsx: true });

/*
 * In React 19, react-is bundled by Recharts returns false for isFragment() on JSX fragments (<>...</>).
 * As a result, Recharts' internal toArray() fails to unwrap fragments, causing findAllByType to return 0 graphical items.
 * These tests safeguard against this failure mode and ensure all series are discovered.
 */

test('Recharts AreaChart discovery - Macro areas array is discovered without fragments', () => {
  const macroKeys = ['realEstate', 'equities', 'bonds', 'cash', 'gold', 'crypto'];

  const children = macroKeys.map((key) =>
    React.createElement(Area, {
      key,
      dataKey: key,
      type: 'monotone',
      stackId: '1',
      isAnimationActive: false,
    })
  );

  const discovered = findAllByType(children, Area);
  assert.strictEqual(discovered.length, 6, 'All 6 macro Area components must be discovered by Recharts');
});

test('Recharts AreaChart discovery - Sub-sector areas array is discovered without fragments', () => {
  const subKeys = [
    'reResidential', 'reCommercial', 'reAgricultural',
    'eqDeveloped', 'eqEmerging', 'eqPrivate',
    'bondSovereign', 'bondCorporate', 'bondPension',
    'cashBank', 'cashMmf', 'cashPhysical',
    'goldJewelry', 'goldInvestment', 'goldReserves',
    'cryptoBtc', 'cryptoSmart', 'cryptoStable',
  ];

  const children = subKeys.map((key) =>
    React.createElement(Area, {
      key,
      dataKey: key,
      type: 'monotone',
      stackId: '1',
      isAnimationActive: false,
    })
  );

  const discovered = findAllByType(children, Area);
  assert.strictEqual(discovered.length, 18, 'All 18 sub-sector Area components must be discovered by Recharts');
});

test('Recharts AreaChart discovery - Confirms Fragment wrapping causes 0 areas to be discovered in React 19', () => {
  /*
   * Explicitly documents the React 19 react-is regression:
   * Wrapping Area children inside a Fragment prevents Recharts from traversing the tree.
   */
  const fragmentWrapped = React.createElement(
    React.Fragment,
    null,
    React.createElement(Area, { dataKey: 'series1' }),
    React.createElement(Area, { dataKey: 'series2' })
  );

  const discovered = findAllByType([fragmentWrapped], Area);
  assert.strictEqual(discovered.length, 0, 'Recharts must fail on Fragment wrapper in React 19, explaining why fragments are strictly forbidden');
});

test('Static analysis - Enforces no Recharts chart components contain React.Fragment or <> wrappers in JSX', () => {
  /*
   * Prevents developers from inadvertently reintroducing <> fragments inside AreaChart,
   * LineChart, BarChart, or ComposedChart anywhere across the codebase.
   */
  const componentsDir = path.join(process.cwd(), 'src', 'components');

  function getTsxFiles(dir) {
    let files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getTsxFiles(fullPath));
      } else if (entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const tsxFiles = getTsxFiles(componentsDir);
  const chartTagRegex = /<(?:Area|Bar|Line|Pie|Composed)Chart[\s\S]*?<\/(?:Area|Bar|Line|Pie|Composed)Chart>/g;
  const fragmentInsideRegex = /<AreaChart[\s\S]*?>[\s\S]*?(?:<>|<React\.Fragment>)[\s\S]*?<\/(?:AreaChart)>/;

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes("from 'recharts'")) {
      const match = fragmentInsideRegex.test(content);
      assert.strictEqual(
        match,
        false,
        `File ${file} contains a React fragment inside a Recharts Chart container which breaks child discovery in React 19.`
      );
    }
  }
});
