import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeadingIndicatorsRadar } from '../LeadingIndicatorsRadar';

describe('LeadingIndicatorsRadar Component', () => {
  it('renders header, live telemetry badge, and view switchers', () => {
    render(<LeadingIndicatorsRadar />);

    expect(screen.getByText('Leading Indicators & High-Frequency Nowcasting')).toBeDefined();
    expect(screen.getByText(/Live Telemetry/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /PMI Radar/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Conference Board LEI/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Atlanta Fed GDPNow/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Summary Synthesis/i })).toBeDefined();
  });

  it('renders default PMI view with 50-threshold gauges, sub-indices, and economy pills', () => {
    render(<LeadingIndicatorsRadar />);

    expect(screen.getAllByText('Manufacturing PMI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Services PMI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Composite & Forward Orders')).toBeDefined();
    expect(screen.getByText(/Orders \/ Inventories Ratio/i)).toBeDefined();

    // Check economy pills
    expect(screen.getByRole('button', { name: /Global Aggregate/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /United States/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Eurozone/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /China/i })).toBeDefined();
  });

  it('allows switching economies in PMI view and updates metrics accordingly', () => {
    render(<LeadingIndicatorsRadar />);

    // Switch to Eurozone
    const eaBtn = screen.getByRole('button', { name: /Eurozone/i });
    fireEvent.click(eaBtn);

    expect(screen.getByText('46.2')).toBeDefined();
    expect(screen.getByText('51.8')).toBeDefined();
    expect(screen.getByText('0.95x')).toBeDefined();

    // Switch to China
    const chnBtn = screen.getByRole('button', { name: /China/i });
    fireEvent.click(chnBtn);

    expect(screen.getByText('51.2')).toBeDefined();
    expect(screen.getByText('52.0')).toBeDefined();
  });

  it('allows switching to Conference Board LEI view and filtering the 10 components', () => {
    render(<LeadingIndicatorsRadar />);

    const leiTab = screen.getByRole('button', { name: /Conference Board LEI/i });
    fireEvent.click(leiTab);

    expect(screen.getByText(/Conference Board LEI 6-Month Annualized Growth/i)).toBeDefined();
    expect(screen.getByText('-4.0% Annualized')).toBeDefined();
    expect(screen.getByText(/The 10 Forward-Looking Components Breakdown/i)).toBeDefined();

    // Verify key 10 components exist
    expect(screen.getByText('Avg Weekly Hours, Manufacturing')).toBeDefined();
    expect(screen.getByText('Building Permits for New Private Housing')).toBeDefined();
    expect(screen.getByText('Leading Credit Index (LCI)')).toBeDefined();
    expect(screen.getByText('S&P 500 Stock Price Index')).toBeDefined();

    // Filter by Financial components
    const financialFilter = screen.getByRole('button', { name: /Financial \(3\)/i });
    fireEvent.click(financialFilter);

    expect(screen.getByText('Leading Credit Index (LCI)')).toBeDefined();
    expect(screen.getByText('S&P 500 Stock Price Index')).toBeDefined();
    expect(screen.queryByText('Building Permits for New Private Housing')).toBeNull();
  });

  it('allows switching to Atlanta Fed GDPNow view and renders nowcast details', () => {
    render(<LeadingIndicatorsRadar />);

    const nowcastTab = screen.getByRole('button', { name: /Atlanta Fed GDPNow/i });
    fireEvent.click(nowcastTab);

    expect(screen.getByText(/Current Quarter Output Tracker/i)).toBeDefined();
    expect(screen.getByText('+2.7%')).toBeDefined();
    expect(screen.getByText(/vs\. Blue Chip Survey/i)).toBeDefined();
    expect(screen.getByText(/The Statistical Lag Reality/i)).toBeDefined();
    expect(screen.getByText(/Q3 GDP Contribution Breakdown/i)).toBeDefined();
    expect(screen.getByText(/How Incoming Macro Data Revised the Estimate/i)).toBeDefined();
  });

  it('allows switching to Summary Synthesis view and renders all 3 pillar summaries', () => {
    render(<LeadingIndicatorsRadar />);

    const summaryTab = screen.getByRole('button', { name: /Summary Synthesis/i });
    fireEvent.click(summaryTab);

    expect(screen.getByText('1. Global PMI Matrix')).toBeDefined();
    expect(screen.getByText('2. Conference Board LEI')).toBeDefined();
    expect(screen.getByText('3. Real-Time GDPNow')).toBeDefined();
  });
});
