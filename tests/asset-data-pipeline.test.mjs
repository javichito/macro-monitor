import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(process.cwd());
const { GLOBAL_ASSET_HISTORY } = jiti('./src/data/asset-breakdown.ts');
const { adjustValue } = jiti('./src/lib/formatters.ts');

/*
 * Validates the underlying mathematical integrity of the asset stack.
 * If data contains NaN, undefined, zero-division, or inconsistent totals,
 * Recharts renders an empty or broken coordinate plane.
 */

test('Data integrity - All 12 longitudinal intervals are defined and sorted chronologically', () => {
  assert.strictEqual(GLOBAL_ASSET_HISTORY.length, 12);
  const expectedYears = [1980, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2022, 2024, 2025, 2026];
  const actualYears = GLOBAL_ASSET_HISTORY.map((entry) => entry.year);
  assert.deepStrictEqual(actualYears, expectedYears);
});

test('Data integrity - Pre-crypto years have 5 categories; modern years (>=2015) have 6 categories', () => {
  for (const yearData of GLOBAL_ASSET_HISTORY) {
    const expectedCount = yearData.year >= 2015 ? 6 : 5;
    assert.strictEqual(
      yearData.categories.length,
      expectedCount,
      `Year ${yearData.year} must have exactly ${expectedCount} macro asset categories`
    );

    let calculatedGross = 0;
    for (const cat of yearData.categories) {
      assert.ok(Number.isFinite(cat.valueTrillion), `Category ${cat.id} has invalid value in ${yearData.year}`);
      assert.ok(cat.valueTrillion >= 0, `Category ${cat.id} has negative value in ${yearData.year}`);
      calculatedGross += cat.valueTrillion;
    }

    /*
     * Floating point tolerance for gross summation check across categories.
     */
    assert.ok(
      Math.abs(calculatedGross - yearData.totalGrossAssetsTrillion) < 0.2,
      `Year ${yearData.year}: Sum of categories (${calculatedGross}) must equal totalGrossAssetsTrillion (${yearData.totalGrossAssetsTrillion})`
    );
  }
});

test('Data integrity - Sub-categories are consistently structured and reconcile to parent categories', () => {
  for (const yearData of GLOBAL_ASSET_HISTORY) {
    for (const cat of yearData.categories) {
      assert.ok(
        Array.isArray(cat.subCategories) && cat.subCategories.length === 3,
        `Year ${yearData.year} category ${cat.id} must have exactly 3 sub-categories`
      );

      let subSum = 0;
      let percentSum = 0;
      for (const sub of cat.subCategories) {
        assert.ok(sub.id && typeof sub.id === 'string', 'Subcategory must have an id');
        assert.ok(sub.name && typeof sub.name === 'string', 'Subcategory must have a name');
        assert.ok(Number.isFinite(sub.valueTrillion), `Subcategory ${sub.id} must have finite value in ${yearData.year}`);
        assert.ok(sub.valueTrillion >= 0, `Subcategory ${sub.id} must be non-negative in ${yearData.year}`);
        assert.ok(Number.isFinite(sub.shareOfParentPercent), `Subcategory ${sub.id} must have finite share in ${yearData.year}`);

        subSum += sub.valueTrillion;
        percentSum += sub.shareOfParentPercent;
      }

      /*
       * Sum of subcategory values must equal category value within 0.1 Trillion precision.
       */
      assert.ok(
        Math.abs(subSum - cat.valueTrillion) < 0.15,
        `Year ${yearData.year} category ${cat.id}: subcategory sum (${subSum}) must match parent (${cat.valueTrillion})`
      );

      /*
       * If parent category is > 0, subcategory percentages must sum to 100%.
       */
      if (cat.valueTrillion > 0) {
        assert.ok(
          Math.abs(percentSum - 100) < 0.5,
          `Year ${yearData.year} category ${cat.id}: subcategory percentages sum to ${percentSum}%, expected 100%`
        );
      }
    }
  }
});

test('Data integrity - Liability breakdowns match total liabilities for every year', () => {
  for (const yearData of GLOBAL_ASSET_HISTORY) {
    assert.ok(
      Array.isArray(yearData.liabilityBreakdown) && yearData.liabilityBreakdown.length === 3,
      `Year ${yearData.year} must have exactly 3 liability sub-categories`
    );

    let liabilitySum = 0;
    for (const liab of yearData.liabilityBreakdown) {
      assert.ok(Number.isFinite(liab.valueTrillion));
      assert.ok(liab.valueTrillion >= 0);
      liabilitySum += liab.valueTrillion;
    }

    assert.ok(
      Math.abs(liabilitySum - yearData.totalLiabilitiesTrillion) < 0.2,
      `Year ${yearData.year}: liability sum (${liabilitySum}) must match totalLiabilitiesTrillion (${yearData.totalLiabilitiesTrillion})`
    );
  }
});

test('Chart data normalization - Share (%) mode always totals 100% with no NaN or undefined', () => {
  for (const yearData of GLOBAL_ASSET_HISTORY) {
    const gross = yearData.totalGrossAssetsTrillion;
    assert.ok(gross > 0, 'Gross assets must be greater than zero');

    // Test Macro share calculation
    const macroShares = yearData.categories.map((c) =>
      Number(((c.valueTrillion / gross) * 100).toFixed(1))
    );

    for (const val of macroShares) {
      assert.ok(!Number.isNaN(val), 'Macro share value must not be NaN');
      assert.ok(val >= 0 && val <= 100, `Macro share value ${val} must be between 0 and 100`);
    }

    const macroTotal = macroShares.reduce((a, b) => a + b, 0);
    assert.ok(
      Math.abs(macroTotal - 100) < 0.5,
      `Year ${yearData.year}: macro shares sum to ${macroTotal}%, expected ~100%`
    );

    // Test Sub-sector share calculation
    const allSubs = yearData.categories.flatMap((c) => c.subCategories || []);
    const subShares = allSubs.map((s) =>
      Number(((s.valueTrillion / gross) * 100).toFixed(1))
    );

    for (const val of subShares) {
      assert.ok(!Number.isNaN(val), 'Sub-sector share value must not be NaN');
      assert.ok(val >= 0 && val <= 100, `Sub-sector share value ${val} must be between 0 and 100`);
    }

    const subTotal = subShares.reduce((a, b) => a + b, 0);
    assert.ok(
      Math.abs(subTotal - 100) < 0.8,
      `Year ${yearData.year}: sub-sector shares sum to ${subTotal}%, expected ~100%`
    );
  }
});

test('Currency perspectives - Adjustments yield finite, positive numbers across all perspectives', () => {
  const perspectives = ['nominal', 'real', 'ppp'];

  for (const p of perspectives) {
    for (const item of GLOBAL_ASSET_HISTORY) {
      for (const cat of item.categories) {
        const adjusted = adjustValue(cat.valueTrillion, item.year, p);
        assert.ok(Number.isFinite(adjusted), `Adjusted value for ${cat.id} in ${item.year} (${p}) must be finite`);
        assert.ok(adjusted >= 0, `Adjusted value for ${cat.id} in ${item.year} (${p}) must be non-negative`);
      }
    }
  }
});
