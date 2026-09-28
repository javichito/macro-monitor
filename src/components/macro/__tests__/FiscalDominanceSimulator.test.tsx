import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FiscalDominanceSimulator } from '../FiscalDominanceSimulator';
import {
  SOVEREIGN_FISCAL_PROFILES,
  simulateFiscalTrajectory,
  calculateFinancialRepressionMetrics,
} from '../../../data/fiscal-dominance-data';

/*
 * Unit tests for Sovereign Fiscal Dominance & Debt Spiral Simulator
 * Validates mathematical trajectory accuracy, UI parameter controls,
 * scenario transitions, and sovereign profile loading.
 */

describe('FiscalDominanceSimulator Component', () => {
  it('renders simulator header, badges, and default USA profile', () => {
    render(<FiscalDominanceSimulator />);

    expect(screen.getByText('Fiscal Dominance & Debt Spiral Simulator')).toBeDefined();
    expect(screen.getByText('Sovereign Solvency & Debt Dynamics')).toBeDefined();
    expect(screen.getByText('United States 10-Year Solvency Trajectory (2026–2036)')).toBeDefined();
  });

  it('renders all 14 sovereign selection options', () => {
    render(<FiscalDominanceSimulator />);

    expect(screen.getByRole('button', { name: /United States/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Japan/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /United Kingdom/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /France/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Italy/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Germany/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /China/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Spain/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Canada/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Australia/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /India/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Brazil/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Switzerland/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Mexico/i })).toBeDefined();
  });

  it('switches sovereign profile to Switzerland when clicked and updates trajectory heading', () => {
    render(<FiscalDominanceSimulator />);

    const cheButton = screen.getByRole('button', { name: /Switzerland/i });
    fireEvent.click(cheButton);

    expect(screen.getByText('Switzerland 10-Year Solvency Trajectory (2026–2036)')).toBeDefined();
  });

  it('renders all 5 macroeconomic scenario preset buttons', () => {
    render(<FiscalDominanceSimulator />);

    expect(screen.getByRole('button', { name: /CBO \/ IMF Baseline/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Bond Vigilante Shock/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /1970s Great Stagflation/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Financial Repression Playbook/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Austerity & Reform/i })).toBeDefined();
  });

  it('activates Bond Vigilante scenario and updates yield parameter', () => {
    render(<FiscalDominanceSimulator />);

    const vigilanteButton = screen.getByRole('button', { name: /Bond Vigilante Shock/i });
    fireEvent.click(vigilanteButton);

    // USA baseline yield is 4.25% + 2.0% shock = 6.25%
    expect(screen.getByText('6.25%')).toBeDefined();
  });

  it('allows adjusting primary deficit slider and triggers custom mode', () => {
    render(<FiscalDominanceSimulator />);

    const deficitSlider = screen.getByLabelText('Primary Deficit (% of GDP)');
    fireEvent.change(deficitSlider, { target: { value: '5.5' } });

    expect(screen.getByText('+5.50%')).toBeDefined();
    expect(screen.getByText('(Custom Slider Adjustments Active)')).toBeDefined();
  });

  it('resets parameters to baseline when clicking Reset Baseline button', () => {
    render(<FiscalDominanceSimulator />);

    // Apply vigilante scenario
    const vigilanteButton = screen.getByRole('button', { name: /Bond Vigilante Shock/i });
    fireEvent.click(vigilanteButton);
    expect(screen.getByText('6.25%')).toBeDefined();

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /Reset Baseline/i });
    fireEvent.click(resetButton);

    // USA original baseline is 4.25%
    expect(screen.getByText('4.25%')).toBeDefined();
  });

  it('toggles metric view between Debt-to-GDP and Annual Interest Outlays', () => {
    render(<FiscalDominanceSimulator />);

    const interestTab = screen.getByRole('button', { name: /Annual Interest Outlays/i });
    const debtTab = screen.getByRole('button', { name: /Debt-to-GDP/i });

    fireEvent.click(interestTab);
    expect(interestTab.className).toContain('bg-sky-500');

    fireEvent.click(debtTab);
    expect(debtTab.className).toContain('bg-sky-500');
  });
});

describe('Fiscal Dominance Mathematical Engine', () => {
  const usaProfile = SOVEREIGN_FISCAL_PROFILES.find((p) => p.code === 'USA')!;

  it('correctly simulates fiscal trajectory over a 10-year horizon', () => {
    const trajectory = simulateFiscalTrajectory(
      usaProfile,
      {
        bondYield: 4.25,
        primaryDeficit: 3.8,
        realGrowth: 2.1,
        inflation: 2.5,
      },
      10
    );

    expect(trajectory.length).toBe(11); // Year 0 (2026) to Year 10 (2036)
    expect(trajectory[0].year).toBe(2026);
    expect(trajectory[10].year).toBe(2036);
    expect(trajectory[0].debtToGdp).toBe(124.2);
    // Under positive primary deficit and r - g dynamics, debt grows over the decade
    expect(trajectory[10].debtToGdp).toBeGreaterThan(trajectory[0].debtToGdp);
  });

  it('computes financial repression tax and required stabilizing yield', () => {
    const repression = calculateFinancialRepressionMetrics(usaProfile, {
      bondYield: 4.25,
      primaryDeficit: 3.8,
      realGrowth: 2.1,
      inflation: 2.5,
    });

    expect(repression.isRepressionRequired).toBe(true);
    expect(repression.requiredRMinusG).toBeLessThan(0);
    expect(repression.annualWealthTransferTrillion).toBeGreaterThan(0);
  });
});
