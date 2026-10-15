import { describe, it, expect } from 'vitest';
import {
  HISTORICAL_PHYSICAL_ECONOMY_SERIES,
  REGIONAL_PHYSICAL_ECONOMY_PROFILES,
  ENERGY_REGIME_CONFIG,
  DEGLOBALIZATION_PHASE_CONFIG,
  DEMOGRAPHIC_PHASE_CONFIG,
  getEnergyBurdenRegime,
  calculateSimulatedEnergyExpenditure,
  calculateSimulatedDeglobalization,
  calculateSimulatedDemographicRelief,
  getPhysicalEconomyOverview,
  getLatestPhysicalEconomyState,
  getCombinedPhysicalEconomyExportData,
} from '../physical-economy-data';
import {
  validatePhysicalEconomyBounds,
  evaluatePhysicalEconomyStatus,
} from '../../../scripts/sync-physical-economy';

describe('Physical Economy, Energy & Deglobalization Data Suite', () => {
  describe('Historical Series & Econometric Benchmarks', () => {
    it('contains chronological data points from 1970 through 2026 plus UN 2050 forecasts', () => {
      expect(HISTORICAL_PHYSICAL_ECONOMY_SERIES.length).toBeGreaterThanOrEqual(15);
      const startYear = HISTORICAL_PHYSICAL_ECONOMY_SERIES[0].year;
      const endYear = HISTORICAL_PHYSICAL_ECONOMY_SERIES[HISTORICAL_PHYSICAL_ECONOMY_SERIES.length - 1].year;
      expect(startYear).toBe(1970);
      expect(endYear).toBe(2050);
    });

    it('identifies 2008 as the all-time peak in Global Trade-to-GDP at ~61%', () => {
      const point2008 = HISTORICAL_PHYSICAL_ECONOMY_SERIES.find((p) => p.year === 2008);
      expect(point2008).toBeDefined();
      expect(point2008?.worldTradeToGdpPct).toBe(61.0);
      expect(point2008?.deglobalizationPhase).toBe('hyperglobalization');
    });

    it('verifies that 1974 and 1980 energy burdens exceed the 10% crisis recession threshold', () => {
      const point1974 = HISTORICAL_PHYSICAL_ECONOMY_SERIES.find((p) => p.year === 1974);
      const point1980 = HISTORICAL_PHYSICAL_ECONOMY_SERIES.find((p) => p.year === 1980);
      expect(point1974?.globalEnergyExpenditurePctGdp).toBeGreaterThanOrEqual(10.0);
      expect(point1974?.energyRegime).toBe('recessionary_crisis');
      expect(point1980?.globalEnergyExpenditurePctGdp).toBeGreaterThanOrEqual(10.0);
      expect(point1980?.energyRegime).toBe('recessionary_crisis');
    });

    it('verifies that 2008 pre-GFC energy burden crossed the 8% warning threshold', () => {
      const point2008 = HISTORICAL_PHYSICAL_ECONOMY_SERIES.find((p) => p.year === 2008);
      expect(point2008?.globalEnergyExpenditurePctGdp).toBeGreaterThanOrEqual(8.0);
      expect(point2008?.energyRegime).toBe('elevated_warning');
    });

    it('demonstrates structural decoupling in energy intensity per unit of real GDP', () => {
      const point1980 = HISTORICAL_PHYSICAL_ECONOMY_SERIES.find((p) => p.year === 1980);
      const point2026 = HISTORICAL_PHYSICAL_ECONOMY_SERIES.find((p) => p.year === 2026);
      expect(point1980?.energyIntensityIndex).toBe(100.0);
      expect(point2026?.energyIntensityIndex).toBeLessThan(55.0);
    });
  });

  describe('Regional Profiles', () => {
    it('covers all 9 sovereign regions and regional blocs', () => {
      const requiredRegions = ['GLOBAL', 'USA', 'EUR', 'CHN', 'JPN', 'DEU', 'GBR', 'IND', 'KOR'];
      requiredRegions.forEach((id) => {
        const profile = (REGIONAL_PHYSICAL_ECONOMY_PROFILES as any)[id];
        expect(profile).toBeDefined();
        expect(profile.name).toBeTruthy();
        expect(profile.flag).toBeTruthy();
        expect(profile.energy.energyExpenditurePercentGdp).toBeGreaterThan(0);
        expect(profile.trade.tradeToGdpPct).toBeGreaterThan(0);
        expect(profile.demographics.oldAgeDependencyRatio).toBeGreaterThan(0);
      });
    });

    it('captures the secular working-age contraction in China, Japan, Germany, and South Korea', () => {
      expect(REGIONAL_PHYSICAL_ECONOMY_PROFILES.CHN.demographics.workingAgeGrowthPct).toBeLessThan(0);
      expect(REGIONAL_PHYSICAL_ECONOMY_PROFILES.JPN.demographics.workingAgeGrowthPct).toBeLessThan(0);
      expect(REGIONAL_PHYSICAL_ECONOMY_PROFILES.DEU.demographics.workingAgeGrowthPct).toBeLessThan(0);
      expect(REGIONAL_PHYSICAL_ECONOMY_PROFILES.KOR.demographics.workingAgeGrowthPct).toBeLessThan(0);
    });

    it('captures positive demographic dividend in India', () => {
      expect(REGIONAL_PHYSICAL_ECONOMY_PROFILES.IND.demographics.workingAgeGrowthPct).toBeGreaterThan(1.0);
      expect(REGIONAL_PHYSICAL_ECONOMY_PROFILES.IND.demographics.demographicPhase).toBe('demographic_dividend');
    });

    it('identifies Japan as hyper-aged with dependency ratio > 50', () => {
      expect(REGIONAL_PHYSICAL_ECONOMY_PROFILES.JPN.demographics.oldAgeDependencyRatio).toBeGreaterThan(50);
      expect(REGIONAL_PHYSICAL_ECONOMY_PROFILES.JPN.demographics.demographicPhase).toBe('demographic_cliff');
    });
  });

  describe('Econometric Formulas & Interactive Simulators', () => {
    it('evaluates energy burden regimes correctly based on thresholds', () => {
      expect(getEnergyBurdenRegime(4.5)).toBe('benign');
      expect(getEnergyBurdenRegime(7.2)).toBe('moderate');
      expect(getEnergyBurdenRegime(8.5)).toBe('elevated_warning');
      expect(getEnergyBurdenRegime(11.2)).toBe('recessionary_crisis');
    });

    it('calculates simulated energy expenditure dynamically from crude price', () => {
      const baseline = calculateSimulatedEnergyExpenditure(75.0);
      expect(baseline.simulatedTotalEnergyPctGdp).toBeGreaterThan(5.0);
      expect(baseline.simulatedTotalEnergyPctGdp).toBeLessThan(8.0);
      expect(baseline.regime).toBe('moderate');

      const crisis = calculateSimulatedEnergyExpenditure(150.0);
      expect(crisis.simulatedTotalEnergyPctGdp).toBeGreaterThan(8.0);
      expect(crisis.recessionProbabilityScore).toBeGreaterThan(50);
      expect(crisis.consumptionTaxDragTrillionUsd).toBeGreaterThan(0);
    });

    it('calculates simulated deglobalization contraction from tariff rate', () => {
      const lowTariff = calculateSimulatedDeglobalization(0.0);
      const highTariff = calculateSimulatedDeglobalization(20.0);
      expect(highTariff.simulatedTradeToGdpPct).toBeLessThan(lowTariff.simulatedTradeToGdpPct);
      expect(highTariff.projectedAnnualGlobalTradeLossBillionUsd).toBeGreaterThan(0);
      expect(highTariff.effectiveFrictionScore).toBeGreaterThan(lowTariff.effectiveFrictionScore);
    });

    it('calculates demographic relief from raising statutory retirement age', () => {
      const statusQuo = calculateSimulatedDemographicRelief(65, 30.0);
      const raised = calculateSimulatedDemographicRelief(68, 30.0);
      expect(raised.adjustedDependencyRatio).toBeLessThan(statusQuo.adjustedDependencyRatio);
      expect(raised.estimatedFiscalSavingsGdpPct).toBeGreaterThan(0);
    });
  });

  describe('Overview & Telemetry Export Suite', () => {
    it('returns comprehensive physical economy overview', () => {
      const overview = getPhysicalEconomyOverview();
      expect(overview.currentDate).toBe('2026');
      expect(overview.recessionDangerThresholdPct).toBe(8.0);
      expect(overview.recessionCrisisThresholdPct).toBe(10.0);
      expect(overview.peakTradeToGdpPct).toBe(61.0);
      expect(overview.tradeDeltaFromPeakPct).toBeLessThan(0);
    });

    it('evaluates active alerts for energy and demographics', () => {
      const state = getLatestPhysicalEconomyState();
      expect(state.activeAlerts.length).toBeGreaterThanOrEqual(3);
      const alertIds = state.activeAlerts.map((a) => a.id);
      expect(alertIds).toContain('energy-benign-status');
      expect(alertIds).toContain('deglobalization-fragmentation');
      expect(alertIds).toContain('demographic-cliff-strain');
    });

    it('generates export dataset with all required analytical columns', () => {
      const exportRows = getCombinedPhysicalEconomyExportData();
      expect(exportRows.length).toBe(HISTORICAL_PHYSICAL_ECONOMY_SERIES.length);
      const firstRow = exportRows[0];
      expect(firstRow['World GDP ($T)']).toBeDefined();
      expect(firstRow['Energy Burden (% of World GDP)']).toBeDefined();
      expect(firstRow['World Trade-to-GDP Ratio (%)']).toBeDefined();
      expect(firstRow['Global Old-Age Dependency Ratio']).toBeDefined();
    });
  });

  describe('Pipeline Validation & Ingestion Bounds', () => {
    it('validates realistic econometric bounds in pipeline script', () => {
      expect(
        validatePhysicalEconomyBounds({
          brentCrudeUsd: 75.0,
          worldGdpTrillionUsd: 115.0,
          worldTradeToGdpPct: 58.0,
          globalDependencyRatio: 16.0,
          globalWorkingAgeGrowthPct: 0.8,
        })
      ).toBe(true);
    });

    it('rejects out-of-bounds oil prices or dependency ratios', () => {
      expect(() =>
        validatePhysicalEconomyBounds({
          brentCrudeUsd: 500.0,
          worldGdpTrillionUsd: 115.0,
          worldTradeToGdpPct: 58.0,
          globalDependencyRatio: 16.0,
          globalWorkingAgeGrowthPct: 0.8,
        })
      ).toThrow();

      expect(() =>
        validatePhysicalEconomyBounds({
          brentCrudeUsd: 75.0,
          worldGdpTrillionUsd: 115.0,
          worldTradeToGdpPct: 110.0,
          globalDependencyRatio: 16.0,
          globalWorkingAgeGrowthPct: 0.8,
        })
      ).toThrow();
    });

    it('evaluates physical economy pipeline status accurately', () => {
      const status = evaluatePhysicalEconomyStatus({
        brentCrudeUsd: 80.0,
        worldGdpTrillionUsd: 116.2,
        worldTradeToGdpPct: 57.5,
        globalDependencyRatio: 16.2,
        globalWorkingAgeGrowthPct: 0.78,
      });
      expect(status.energyMetrics.latestEnergyBurdenPctGdp).toBeGreaterThan(6.0);
      expect(status.tradeMetrics.worldTradeToGdpPct).toBe(57.5);
      expect(status.tradeMetrics.tradeDeltaFromPeakPct).toBe(-3.5);
      expect(status.demographicMetrics.criticalContractions.length).toBe(4);
    });
  });
});
