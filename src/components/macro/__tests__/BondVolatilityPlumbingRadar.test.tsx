import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BondVolatilityPlumbingRadar } from '../BondVolatilityPlumbingRadar';

/*
 * Verification tests for the Bond Market Volatility & Collateral Plumbing component,
 * validating overview ticker metrics, view tab transitions, interactive simulation sliders,
 * regional collateral profiles, historical crisis case study renders, and export menus.
 */

describe('BondVolatilityPlumbingRadar Component', () => {
  it('renders header, title, and initial overview KPI ticker metrics', () => {
    render(<BondVolatilityPlumbingRadar />);

    expect(screen.getByText('Bond Market Volatility & Collateral Plumbing')).toBeDefined();
    expect(screen.getByText('ICE BofA MOVE')).toBeDefined();
    expect(screen.getByText('Cboe VIX')).toBeDefined();
    expect(screen.getByText('VIX / MOVE Ratio')).toBeDefined();
    expect(screen.getByText('Collateral Health')).toBeDefined();
  });

  it('renders all 4 primary sub-view navigation buttons', () => {
    render(<BondVolatilityPlumbingRadar />);

    expect(screen.getByRole('button', { name: /MOVE & Treasury Vol/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /VIX \/ MOVE & Term Structure/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Collateral Plumbing & Repo/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Historical Crises/i })).toBeDefined();
  });

  it('renders all 5 regional jurisdiction selectors', () => {
    render(<BondVolatilityPlumbingRadar />);

    expect(screen.getByRole('button', { name: 'GLOBAL' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'USA' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'EUR' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'GBR' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'JPN' })).toBeDefined();
  });

  it('renders the MOVE stress spectrum and interactive sandbox slider by default', () => {
    render(<BondVolatilityPlumbingRadar />);

    expect(screen.getByText(/ICE BofA MOVE Index Operational Stress Gauge/i)).toBeDefined();
    expect(screen.getByText(/Sovereign Volatility Simulation Sandbox/i)).toBeDefined();
    expect(screen.getByText(/Implied Dealer Repo Haircut/i)).toBeDefined();
    expect(screen.getByText(/Primary Dealer Balance Sheet Capacity/i)).toBeDefined();
    expect(screen.getByText(/Systemic Collateral Fragility Index/i)).toBeDefined();
  });

  it('switches to VIX / MOVE & Term Structure view and renders complacency gauge', () => {
    render(<BondVolatilityPlumbingRadar />);

    const vixTab = screen.getByRole('button', { name: /VIX \/ MOVE & Term Structure/i });
    fireEvent.click(vixTab);

    expect(screen.getByText(/The VIX \/ MOVE Cross-Asset Complacency Radar/i)).toBeDefined();
    expect(screen.getByText(/The Mathematical Ratio/i)).toBeDefined();
    expect(screen.getByText(/Historical Complacency Regimes/i)).toBeDefined();
    expect(screen.getAllByText(/Equity Volatility Term Structure/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/VIX9D/i)).toBeDefined();
    expect(screen.getByText(/VIX3M/i)).toBeDefined();
  });

  it('switches to Collateral Plumbing & Repo view and renders regional mechanics', () => {
    render(<BondVolatilityPlumbingRadar />);

    const plumbingTab = screen.getByRole('button', { name: /Collateral Plumbing & Repo/i });
    fireEvent.click(plumbingTab);

    expect(screen.getByText(/Sovereign Collateral Mechanics/i)).toBeDefined();
    expect(screen.getAllByText(/Repo Spread/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dealer Haircut/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Collateral Velocity/i)).toBeDefined();
    expect(screen.getByText(/How Sovereign Collateral Flows Through Financial Plumbing/i)).toBeDefined();
    expect(screen.getByText(/1. Sovereign Issuance/i)).toBeDefined();
    expect(screen.getByText(/3. Leverage Overlay/i)).toBeDefined();
  });

  it('switches to Historical Crises view and renders major collateral failure cases', () => {
    render(<BondVolatilityPlumbingRadar />);

    const crisesTab = screen.getByRole('button', { name: /Historical Crises/i });
    fireEvent.click(crisesTab);

    expect(screen.getByText(/Sovereign Collateral Crises Case Studies/i)).toBeDefined();
    expect(screen.getByText(/March 2020 US Treasury Basis Dislocation/i)).toBeDefined();
    expect(screen.getByText(/September-October 2022 UK Gilt & LDI Crisis/i)).toBeDefined();
    expect(screen.getByText(/March 2023 US Regional Bank Run & Collateral Parity/i)).toBeDefined();
    expect(screen.getByText(/August 2024 Yen Carry Trade & Cross-Asset Vol Shock/i)).toBeDefined();
  });

  it('updates dynamic calculations when adjusting MOVE simulation slider', () => {
    render(<BondVolatilityPlumbingRadar />);

    const moveSlider = screen.getByLabelText(/Simulate ICE BofA MOVE Index/i);
    expect(moveSlider).toBeDefined();

    // Fire simulated shock: MOVE jumps to 165 (crisis territory)
    fireEvent.change(moveSlider, { target: { value: '165' } });

    // Haircut should adjust higher than normal 2.0%
    expect(screen.getByText(/Systemic Crisis \(>140\)/i)).toBeDefined();

    // Reset button should restore baseline
    const resetBtn = screen.getByRole('button', { name: /Reset Defaults/i });
    fireEvent.click(resetBtn);

    expect(screen.getAllByText(/Elevated Stress/i).length).toBeGreaterThan(0);
  });

  it('switches jurisdiction to Eurozone and displays Bund collateral metrics', () => {
    render(<BondVolatilityPlumbingRadar />);

    const eurBtn = screen.getByRole('button', { name: 'EUR' });
    fireEvent.click(eurBtn);

    const plumbingTab = screen.getByRole('button', { name: /Collateral Plumbing & Repo/i });
    fireEvent.click(plumbingTab);

    expect(screen.getByText(/Eurozone \(German Bunds & OATs\) Sovereign Collateral Mechanics/i)).toBeDefined();
    expect(screen.getByText(/Severe collateral scarcity/i)).toBeDefined();
  });

  it('provides share deep link and data export menus in header', () => {
    render(<BondVolatilityPlumbingRadar />);

    expect(screen.getByRole('button', { name: /Share/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Export/i })).toBeDefined();
  });
});
