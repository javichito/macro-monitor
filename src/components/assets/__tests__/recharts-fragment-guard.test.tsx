import React from 'react';
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Area } from 'recharts';
// @ts-expect-error Recharts internal ReactUtils lacks official TypeScript declaration file
import { findAllByType } from 'recharts/lib/util/ReactUtils.js';

/*
 * In React 19, react-is bundled by Recharts evaluates isFragment() as false on JSX fragments (<>...</>).
 * As a result, Recharts' internal toArray() fails to unwrap fragments, causing findAllByType to return 0 graphical items.
 * These tests safeguard against this failure mode and ensure all series are discovered.
 */

describe('Recharts Children Discovery & Fragment Guard', () => {
  it('discovers all 6 macro Area components when mapped directly as an array', () => {
    const macroKeys = ['realEstate', 'equities', 'bonds', 'cash', 'gold', 'crypto'];

    const children = macroKeys.map((key) =>
      React.createElement(Area as any, {
        key,
        dataKey: key,
        type: 'monotone',
        stackId: '1',
        isAnimationActive: false,
      })
    );

    const discovered = findAllByType(children, Area);
    expect(discovered.length).toBe(6);
  });

  it('discovers all 18 sub-sector Area components when mapped directly as an array', () => {
    const subKeys = [
      'reResidential', 'reCommercial', 'reAgricultural',
      'eqDeveloped', 'eqEmerging', 'eqPrivate',
      'bondSovereign', 'bondCorporate', 'bondPension',
      'cashBank', 'cashMmf', 'cashPhysical',
      'goldJewelry', 'goldInvestment', 'goldReserves',
      'cryptoBtc', 'cryptoSmart', 'cryptoStable',
    ];

    const children = subKeys.map((key) =>
      React.createElement(Area as any, {
        key,
        dataKey: key,
        type: 'monotone',
        stackId: '1',
        isAnimationActive: false,
      })
    );

    const discovered = findAllByType(children, Area);
    expect(discovered.length).toBe(18);
  });

  it('confirms fragment wrapping prevents Recharts child discovery under React 19', () => {
    const fragmentWrapped = React.createElement(
      React.Fragment,
      null,
      React.createElement(Area as any, { dataKey: 'series1' }),
      React.createElement(Area as any, { dataKey: 'series2' })
    );

    const discovered = findAllByType([fragmentWrapped], Area);
    expect(discovered.length).toBe(0);
  });

  it('verifies through static analysis that no Recharts charts contain fragment wrappers in JSX', () => {
    const componentsDir = path.join(process.cwd(), 'src', 'components');

    function getTsxFiles(dir: string): string[] {
      let files: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files = files.concat(getTsxFiles(fullPath));
        } else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) {
          files.push(fullPath);
        }
      }
      return files;
    }

    const tsxFiles = getTsxFiles(componentsDir);
    const fragmentInsideRegex = /<AreaChart[\s\S]*?>[\s\S]*?(?:<>|<React\.Fragment>)[\s\S]*?<\/(?:AreaChart)>/;

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes("from 'recharts'")) {
        const hasFragment = fragmentInsideRegex.test(content);
        expect(hasFragment).toBe(false);
      }
    }
  });
});
