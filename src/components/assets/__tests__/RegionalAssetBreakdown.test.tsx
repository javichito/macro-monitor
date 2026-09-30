import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegionalAssetBreakdown } from '../RegionalAssetBreakdown';

describe('RegionalAssetBreakdown Component', () => {
  it('renders the header, stat pills, and default toggles', () => {
    render(
      <RegionalAssetBreakdown currencyPerspective="nominal" selectedYear={2026} />
    );

    expect(
      screen.getByText('Asset Allocation & Balance Sheets by Region (2026)')
    ).toBeDefined();
    expect(screen.getByText(/APAC Gross Assets/i)).toBeDefined();
    expect(screen.getByText(/N. America Equities/i)).toBeDefined();

    expect(screen.getByRole('button', { name: 'By Region Portfolio' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'By Asset Class Distribution' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Total Value ($T)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Share of Total (%)' })).toBeDefined();
  });

  it('renders regional snapshot cards for all 5 major world regions', () => {
    render(
      <RegionalAssetBreakdown currencyPerspective="nominal" selectedYear={2026} />
    );

    expect(screen.getAllByText('North America').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Asia-Pacific').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Europe').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Latin America').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Middle East & Africa').length).toBeGreaterThan(0);
  });

  it('allows toggling between By Region and By Asset Class modes', () => {
    render(
      <RegionalAssetBreakdown currencyPerspective="nominal" selectedYear={2026} />
    );

    const byAssetBtn = screen.getByRole('button', {
      name: 'By Asset Class Distribution',
    });
    fireEvent.click(byAssetBtn);

    // Asset class buttons should now appear
    expect(screen.getByRole('button', { name: /Public & Private Equities/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Real Estate & Land/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Bonds & Fixed Income/i })).toBeDefined();
  });

  it('allows toggling unit types between Total Value ($T) and Share of Total (%)', () => {
    render(
      <RegionalAssetBreakdown currencyPerspective="nominal" selectedYear={2026} />
    );

    const shareBtn = screen.getByRole('button', { name: 'Share of Total (%)' });
    fireEvent.click(shareBtn);
    expect(shareBtn.className).toContain('bg-white');

    const valueBtn = screen.getByRole('button', { name: 'Total Value ($T)' });
    fireEvent.click(valueBtn);
    expect(valueBtn.className).toContain('bg-white');
  });

  it('renders the structural macroeconomic dynamic cards', () => {
    render(
      <RegionalAssetBreakdown currencyPerspective="nominal" selectedYear={2026} />
    );

    expect(screen.getByText('The Transpacific Wealth Shift')).toBeDefined();
    expect(screen.getByText("Wall Street's Equity Primacy")).toBeDefined();
    expect(screen.getByText('Tangible Real Asset Moats')).toBeDefined();
  });
});
