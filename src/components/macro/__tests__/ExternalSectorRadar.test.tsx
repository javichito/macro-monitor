import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExternalSectorRadar } from '../ExternalSectorRadar';

describe('ExternalSectorRadar Component', () => {
  it('renders header, title, and initial KPI indicators', () => {
    render(<ExternalSectorRadar />);

    expect(screen.getByText('Global External Solvency & Currency Matrix')).toBeDefined();
    expect(screen.getByText('US Dollar Index (DXY)')).toBeDefined();
    expect(screen.getByText('NY Fed GSCPI (Supply Stress)')).toBeDefined();
    expect(screen.getByText('US Twin Deficit Gap')).toBeDefined();
    expect(screen.getByText('China Trade Surplus')).toBeDefined();
    expect(screen.getByText('Foreign Share of US Debt')).toBeDefined();
  });

  it('renders navigation tabs for Overview, Current Account & BoP, DXY & REER, GSCPI, and TIC Capital Flows', () => {
    render(<ExternalSectorRadar />);

    expect(screen.getByRole('button', { name: /Overview/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Current Account & BoP/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /DXY & REER FX/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /GSCPI Supply Chain/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /TIC Capital Flows/i })).toBeDefined();
  });

  it('allows switching to Current Account & BoP tab and viewing ledger', () => {
    render(<ExternalSectorRadar />);

    const bopTab = screen.getByRole('button', { name: /Current Account & BoP/i });
    fireEvent.click(bopTab);

    expect(screen.getByText(/Balance of Payments & External Solvency Ledger/i)).toBeDefined();
    expect(screen.getAllByText('United States').length).toBeGreaterThan(0);
    expect(screen.getAllByText('China').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Germany').length).toBeGreaterThan(0);
  });

  it('allows filtering by coalition in Current Account ledger', () => {
    render(<ExternalSectorRadar />);

    const bopTab = screen.getByRole('button', { name: /Current Account & BoP/i });
    fireEvent.click(bopTab);

    const bricsFilter = screen.getByRole('button', { name: /BRICS\+ Coalition/i });
    fireEvent.click(bricsFilter);

    // China and India should still be visible, Germany (G7) should not be in the filtered list
    expect(screen.getAllByText('China').length).toBeGreaterThan(0);
    expect(screen.queryByText('Germany')).toBeNull();
  });

  it('allows switching to DXY & REER FX tab and inspecting DXY components', () => {
    render(<ExternalSectorRadar />);

    const fxTab = screen.getByRole('button', { name: /DXY & REER FX/i });
    fireEvent.click(fxTab);

    expect(screen.getByText(/US Dollar Index \(DXY\) Basket Composition/i)).toBeDefined();
    expect(screen.getAllByText('EUR').length).toBeGreaterThan(0);
    expect(screen.getAllByText('JPY').length).toBeGreaterThan(0);
    expect(screen.getAllByText('GBP').length).toBeGreaterThan(0);
    expect(screen.getByText(/Multi-Lateral Real Effective Exchange Rate/i)).toBeDefined();
  });

  it('allows switching to GSCPI Supply Chain tab and viewing indicators', () => {
    render(<ExternalSectorRadar />);

    const gscpiTab = screen.getByRole('button', { name: /GSCPI Supply Chain/i });
    fireEvent.click(gscpiTab);

    expect(screen.getByText(/Federal Reserve Bank of New York: GSCPI Supply Pressure/i)).toBeDefined();
    expect(screen.getByText(/Ocean Container Rates/i)).toBeDefined();
    expect(screen.getByText(/Baltic Dry Bulk Index/i)).toBeDefined();
    expect(screen.getByText(/Inflation Transmission Horizon/i)).toBeDefined();
  });

  it('allows switching to TIC Capital Flows tab and viewing sovereign debt holders', () => {
    render(<ExternalSectorRadar />);

    const ticTab = screen.getByRole('button', { name: /TIC Capital Flows/i });
    fireEvent.click(ticTab);

    expect(screen.getByText(/Top Foreign Sovereign Holders/i)).toBeDefined();
    expect(screen.getAllByText('Japan').length).toBeGreaterThan(0);
    expect(screen.getAllByText('China').length).toBeGreaterThan(0);
    expect(screen.getByText(/Foreign Share of US Marketable Public Debt/i)).toBeDefined();
    expect(screen.getByText(/Central Bank FX Reserve Diversification/i)).toBeDefined();
  });
});
