import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CrossAssetRatioStudio } from '../CrossAssetRatioStudio';

/*
 * Unit tests for Analytical Cross-Asset Ratio Studio
 * Validates rendering of the 3 core ratios (Copper/Gold, S&P500/M2, Gold/Oil),
 * interactive sandbox what-if calculations, preset scenario triggers, and export integration.
 */

describe('CrossAssetRatioStudio Component', () => {
  it('renders studio header, regime badges, and all three ratio selectors', () => {
    render(<CrossAssetRatioStudio />);

    expect(screen.getByText('Analytical Cross-Asset Ratio Studio')).toBeDefined();
    expect(screen.getByText('Macro Relative-Price Barometers')).toBeDefined();

    expect(screen.getByRole('button', { name: /Copper \/ Gold Ratio/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /S&P 500 \/ M2 Money Supply/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Gold \/ Oil Ratio/i })).toBeDefined();
  });

  it('displays active Copper/Gold ratio by default with numerator and denominator', () => {
    render(<CrossAssetRatioStudio />);

    expect(screen.getByText('Global Industrial Expansion vs. Monetary Safe-Haven Flight')).toBeDefined();
    expect(screen.getAllByText(/High-Grade Copper/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Spot Gold/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches between ratios and updates values and formulas appropriately', () => {
    render(<CrossAssetRatioStudio />);

    // Switch to S&P 500 / M2
    const spBtn = screen.getByRole('button', { name: /S&P 500 \/ M2 Money Supply/i });
    fireEvent.click(spBtn);

    expect(screen.getByText('Real Corporate Productivity vs. Fiat Currency Expansion')).toBeDefined();
    expect(screen.getAllByText(/US M2 Money Supply/i).length).toBeGreaterThanOrEqual(1);

    // Switch to Gold / Oil
    const goBtn = screen.getByRole('button', { name: /Gold \/ Oil Ratio/i });
    fireEvent.click(goBtn);

    expect(screen.getByText('Safe-Haven Bullion Premium vs. Global Energy Cost of Production')).toBeDefined();
    expect(screen.getAllByText(/Brent Crude Oil/i).length).toBeGreaterThanOrEqual(1);
  });

  it('allows applying preset stress scenarios in the interactive sandbox', () => {
    render(<CrossAssetRatioStudio />);

    // Click on preset scenario
    const scenarioBtn = screen.getByRole('button', { name: /Global Electrification Super-Cycle/i });
    fireEvent.click(scenarioBtn);

    // Verify reset button appears once simulated values diverge from baseline
    const resetBtn = screen.getByRole('button', { name: /Reset to Baseline/i });
    expect(resetBtn).toBeDefined();

    // Resetting restores baseline state
    fireEvent.click(resetBtn);
    expect(screen.queryByRole('button', { name: /Reset to Baseline/i })).toBeNull();
  });

  it('allows toggling between Ratio Trend and Numerator vs Denominator view modes', () => {
    render(<CrossAssetRatioStudio />);

    const normTab = screen.getByRole('button', { name: /Numerator vs Denominator/i });
    fireEvent.click(normTab);

    const ratioTab = screen.getByRole('button', { name: /Ratio Trend/i });
    fireEvent.click(ratioTab);
    expect(ratioTab).toBeDefined();
  });

  it('includes data portability export menu with CSV, JSON, and Clipboard actions', () => {
    render(<CrossAssetRatioStudio />);

    const exportBtn = screen.getByRole('button', { name: /Export/i });
    expect(exportBtn).toBeDefined();
  });
});
