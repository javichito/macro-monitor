import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonetaryMechanicsRadar } from '../MonetaryMechanicsRadar';

describe('MonetaryMechanicsRadar Component', () => {
  it('renders header, title, and key vital KPI ribbon cards', () => {
    render(<MonetaryMechanicsRadar />);

    expect(screen.getByText('Monetary Velocity & Debt Issuance Mechanics')).toBeDefined();
    expect(screen.getByText(/Equation of Exchange & Sovereign Issuance Plumbing/i)).toBeDefined();
    expect(screen.getByText(/M2 Velocity \(V = GDP \/ M2\):/i)).toBeDefined();
    expect(screen.getByText(/T-Bill Share of Marketable Debt:/i)).toBeDefined();
    expect(screen.getByText(/Estimated Term Premium Suppression:/i)).toBeDefined();
    expect(screen.getByText(/Fed ON RRP Cash Cushion:/i)).toBeDefined();
  });

  it('renders all 4 primary navigation tabs', () => {
    render(<MonetaryMechanicsRadar />);

    expect(screen.getByRole('button', { name: /M2 Velocity & Inflation \(V = GDP \/ M2\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Treasury Maturity Tilt \(Shadow QE\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Interactive Simulator/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Global Sovereign Matrix/i })).toBeDefined();
  });

  it('renders velocity disinflation narrative breakdown cards on the velocity tab', () => {
    render(<MonetaryMechanicsRadar />);

    expect(screen.getByText(/The Velocity Disinflation Paradox & Fiscal Awakening/i)).toBeDefined();
    expect(screen.getByText(/2008–2019: The QE Disinflation Trap/i)).toBeDefined();
    expect(screen.getByText(/2021–2023: The Fiscal Monetization Spike/i)).toBeDefined();
    expect(screen.getByText(/2024–2026: Normalization & Floor/i)).toBeDefined();
  });

  it('switches to Treasury Maturity Tilt tab and renders TBAC & ON RRP explainers', () => {
    render(<MonetaryMechanicsRadar />);

    const issuanceTab = screen.getByRole('button', { name: /Treasury Maturity Tilt \(Shadow QE\)/i });
    fireEvent.click(issuanceTab);

    expect(screen.getByText(/Treasury Debt Maturity Profile: T-Bills vs. Coupons/i)).toBeDefined();
    expect(screen.getByText(/The TBAC Guideline & 'Shadow QE' Mechanism/i)).toBeDefined();
    expect(screen.getByText(/The ON RRP Exhaustion Threshold/i)).toBeDefined();
  });

  it('switches to Interactive Simulator tab and handles preset buttons and sliders', () => {
    render(<MonetaryMechanicsRadar />);

    const simTab = screen.getByRole('button', { name: /Interactive Simulator/i });
    fireEvent.click(simTab);

    expect(screen.getByText(/Interactive Monetary Mechanics & Issuance Sandbox/i)).toBeDefined();
    expect(screen.getByText(/Term Premium Effect/i)).toBeDefined();
    expect(screen.getByText(/Implied Nominal GDP Growth/i)).toBeDefined();
    expect(screen.getByText(/Implied CPI Inflation/i)).toBeDefined();
    expect(screen.getByText(/Bank Reserve Drain Risk/i)).toBeDefined();

    // Verify sliders exist
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(3);

    // Test clicking a scenario preset
    const qeTrapButton = screen.getByRole('button', { name: /2010s QE Disinflation Trap/i });
    fireEvent.click(qeTrapButton);

    // Test reset button
    const resetButton = screen.getByRole('button', { name: /Reset to Baseline/i });
    fireEvent.click(resetButton);
  });

  it('switches to Global Sovereign Matrix tab and renders comparison profiles', () => {
    render(<MonetaryMechanicsRadar />);

    const regimesTab = screen.getByRole('button', { name: /Global Sovereign Matrix/i });
    fireEvent.click(regimesTab);

    expect(screen.getByText(/Cross-Sovereign Monetary Velocity & Debt Issuance Profiles/i)).toBeDefined();
    expect(screen.getByText('United States')).toBeDefined();
    expect(screen.getByText('Eurozone')).toBeDefined();
    expect(screen.getByText('United Kingdom')).toBeDefined();
    expect(screen.getByText('Japan')).toBeDefined();
    expect(screen.getByText('China')).toBeDefined();
    expect(screen.getByText('Global Aggregate (G10 + China)')).toBeDefined();
  });

  it('renders Share Simulation and Export Dataset menus', () => {
    render(<MonetaryMechanicsRadar />);

    expect(screen.getByRole('button', { name: /Share Simulation/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Export/i })).toBeDefined();
  });
});
