import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MacroCalendarRadar } from '../MacroCalendarRadar';

describe('MacroCalendarRadar Component', () => {
  it('renders header, live telemetry badge, and top KPI cards', () => {
    render(<MacroCalendarRadar />);

    expect(screen.getByText('Macroeconomic Calendar & Surprise Index')).toBeDefined();
    expect(screen.getByText(/Live Telemetry: Q4 2026 Cycle/i)).toBeDefined();
    expect(screen.getByText(/Next Tier-1 Release/i)).toBeDefined();
    expect(screen.getByText(/US Surprise \(CESI\)/i)).toBeDefined();
    expect(screen.getByText(/Eurozone Surprise \(CESI\)/i)).toBeDefined();
    expect(screen.getByText(/Central Bank Window/i)).toBeDefined();
  });

  it('renders default release calendar view with filters and event rows', () => {
    render(<MacroCalendarRadar />);

    // Check tabs
    expect(screen.getByRole('button', { name: /Interactive Release Calendar/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Citi Economic Surprise Index \(CESI\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Consensus vs. Actual Deltas/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Central Bank Blackout & Policy Path/i })).toBeDefined();

    // Check mandatory events in the default calendar list
    expect(screen.getAllByText('US Non-Farm Payrolls').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('US Consumer Price Index (CPI YoY)')).toBeDefined();
    expect(screen.getByText('US Advance GDP (Q3 2026 Annualized)')).toBeDefined();
  });

  it('filters calendar events by country and category', () => {
    render(<MacroCalendarRadar />);

    // Filter by Eurozone
    const emuBtn = screen.getByRole('button', { name: /🇪🇺 Eurozone/i });
    fireEvent.click(emuBtn);

    expect(screen.getByText('Eurozone Harmonised CPI (HICP YoY)')).toBeDefined();
    expect(screen.getByText('ECB Monetary Policy Decision')).toBeDefined();

    // Filter by Central Banks category
    const cbCatBtn = screen.getByRole('button', { name: /Central Banks/i });
    fireEvent.click(cbCatBtn);

    expect(screen.getByText('ECB Monetary Policy Decision')).toBeDefined();
  });

  it('filters by search input query', () => {
    render(<MacroCalendarRadar />);

    const searchInput = screen.getByPlaceholderText('Search releases...');
    fireEvent.change(searchInput, { target: { value: 'Retail Sales' } });

    expect(screen.getByText('US Retail Sales MoM')).toBeDefined();
  });

  it('switches to Citi Economic Surprise Index (CESI) view and toggles regional profiles', () => {
    render(<MacroCalendarRadar />);

    const cesiTab = screen.getByRole('button', { name: /Citi Economic Surprise Index \(CESI\)/i });
    fireEvent.click(cesiTab);

    expect(screen.getByText(/US Economic Surprise Gauge/i)).toBeDefined();
    expect(screen.getByText(/Economic Surprise Mechanics & Asset Implications/i)).toBeDefined();
    expect(screen.getByText(/Top Upside Surprise Catalysts/i)).toBeDefined();

    // Switch to Eurozone CESI
    const ezCesiBtn = screen.getByRole('button', { name: /🇪🇺 Eurozone CESI/i });
    fireEvent.click(ezCesiBtn);

    expect(screen.getByText(/Eurozone Economic Surprise Gauge/i)).toBeDefined();
    expect(screen.getAllByText(/-14.2/i).length).toBeGreaterThanOrEqual(1);
  });

  it('switches to Consensus vs. Actual Deltas view', () => {
    render(<MacroCalendarRadar />);

    const deltasTab = screen.getByRole('button', { name: /Consensus vs. Actual Deltas/i });
    fireEvent.click(deltasTab);

    expect(screen.getByText(/The Asymmetric Market Reaction Function/i)).toBeDefined();
    expect(screen.getByText(/Asset Repricing Takeaway/i)).toBeDefined();
  });

  it('switches to Central Bank Blackout & Policy Path view', () => {
    render(<MacroCalendarRadar />);

    const cbTab = screen.getByRole('button', { name: /Central Bank Blackout & Policy Path/i });
    fireEvent.click(cbTab);

    expect(screen.getByText(/Federal Reserve & ECB Blackout Rules/i)).toBeDefined();
    expect(screen.getAllByText(/FOMC \(Federal Reserve\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/ECB \(European Central Bank\)/i).length).toBeGreaterThanOrEqual(1);
  });
});
