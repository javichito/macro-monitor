import { describe, it, expect } from 'vitest';
import {
  classifyRegime,
  REGIME_PLAYBOOKS,
  ECONOMY_REGIME_POINTS,
  MACRO_REGIME_MILESTONES,
} from '../macro-regimes-data';

describe('Macro Regimes & 4-Quadrant Framework Dataset', () => {
  it('correctly classifies momentum into the four Dalio/Bridgewater quadrants', () => {
    // Quadrant 1: Goldilocks (Growth +, Inflation -)
    expect(classifyRegime(20, -10)).toBe('goldilocks');

    // Quadrant 2: Reflation (Growth +, Inflation +)
    expect(classifyRegime(15, 25)).toBe('reflation');

    // Quadrant 3: Stagflation (Growth -, Inflation +)
    expect(classifyRegime(-25, 40)).toBe('stagflation');

    // Quadrant 4: Deflation (Growth -, Inflation -)
    expect(classifyRegime(-30, -20)).toBe('deflation');
  });

  it('contains comprehensive playbook assets for all 4 quadrants', () => {
    const quadrants = ['goldilocks', 'reflation', 'stagflation', 'deflation'] as const;
    for (const q of quadrants) {
      const playbook = REGIME_PLAYBOOKS[q];
      expect(playbook.label).toBeTruthy();
      expect(playbook.favorableAssetClasses.length).toBeGreaterThanOrEqual(3);
      expect(playbook.headwindAssetClasses.length).toBeGreaterThanOrEqual(3);
      expect(playbook.color).toBeTruthy();
    }
  });

  it('ensures all economy coordinates lie within the normalized [-100, 100] bounds', () => {
    for (const economy of ECONOMY_REGIME_POINTS) {
      expect(economy.currentCoordinates.growthMomentum).toBeGreaterThanOrEqual(-100);
      expect(economy.currentCoordinates.growthMomentum).toBeLessThanOrEqual(100);
      expect(economy.currentCoordinates.inflationMomentum).toBeGreaterThanOrEqual(-100);
      expect(economy.currentCoordinates.inflationMomentum).toBeLessThanOrEqual(100);

      // Verify coordinate quadrant matches classification function
      const expectedQuad = classifyRegime(
        economy.currentCoordinates.growthMomentum,
        economy.currentCoordinates.inflationMomentum
      );
      expect(economy.currentCoordinates.quadrant).toBe(expectedQuad);

      // Verify historical trail bounds
      for (const trail of economy.historicalTrail) {
        expect(trail.coordinates.growthMomentum).toBeGreaterThanOrEqual(-100);
        expect(trail.coordinates.growthMomentum).toBeLessThanOrEqual(100);
      }
    }
  });

  it('contains historical milestones spanning key inflection points', () => {
    expect(MACRO_REGIME_MILESTONES.length).toBeGreaterThanOrEqual(5);
    const years = MACRO_REGIME_MILESTONES.map((m) => m.year);
    expect(years).toContain(1980); // Volcker stagflation break
    expect(years).toContain(2008); // GFC deflation shock
    expect(years).toContain(2021); // Reflation wave
    expect(years).toContain(2026); // AI productivity normalization
  });
});
