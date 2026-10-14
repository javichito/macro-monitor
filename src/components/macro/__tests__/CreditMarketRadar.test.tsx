import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreditMarketRadar } from '../CreditMarketRadar';

describe('CreditMarketRadar Component', () => {
  it('renders header, title, and initial Global KPI indicators', () => {
    render(<CreditMarketRadar />);

    expect(screen.getByText('Corporate Credit Spreads & Financial Conditions')).toBeDefined();
    expect(screen.getAllByText(/High Yield OAS/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Investment Grade OAS')).toBeDefined();
    expect(screen.getAllByText(/Bank Tightening/i).length).toBeGreaterThan(0);
  });

  it('renders all 4 region selection buttons (Global, United States, Eurozone, Emerging Markets)', () => {
    render(<CreditMarketRadar />);

    expect(screen.getByRole('button', { name: /Global Agg/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /United States/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Eurozone/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Emerging Markets/i })).toBeDefined();
  });

  it('switches active region and updates contextual indicators and notes', () => {
    render(<CreditMarketRadar />);

    const eurBtn = screen.getByRole('button', { name: /Eurozone/i });
    fireEvent.click(eurBtn);

    expect(screen.getByText(/Eurozone High Yield OAS/i)).toBeDefined();
    expect(screen.getByText(/ECB CISS Index/i)).toBeDefined();
    expect(screen.getByText(/ECB Bank Lending Survey/i)).toBeDefined();
    expect(screen.getByText(/German 10-Year Bund Benchmark/i)).toBeDefined();
  });

  it('renders all 4 primary navigation tabs', () => {
    render(<CreditMarketRadar />);

    expect(screen.getByRole('button', { name: /Credit Spreads \(OAS\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Financial Conditions \(FCI\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Bank Lending Standards/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Rating Tier Matrix/i })).toBeDefined();
  });

  it('switches to Financial Conditions view and renders cross-border comparison', () => {
    render(<CreditMarketRadar />);

    const fciTab = screen.getByRole('button', { name: /Financial Conditions \(FCI\)/i });
    fireEvent.click(fciTab);

    expect(screen.getByText(/Global Financial Conditions & Systemic Stress Indices/i)).toBeDefined();
    expect(screen.getAllByText(/Chicago Fed NFCI/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Eurozone ECB CISS/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Global Aggregate FCI/i).length).toBeGreaterThan(0);
  });

  it('switches to Bank Lending view and renders international comparison and sector list', () => {
    render(<CreditMarketRadar />);

    const lendingTab = screen.getByRole('button', { name: /Bank Lending Standards/i });
    fireEvent.click(lendingTab);

    expect(screen.getByText(/International Bank Lending Surveys: US SLOOS vs. Eurozone BLS/i)).toBeDefined();
    expect(screen.getByText(/Lending Standards by Sector/i)).toBeDefined();
    expect(screen.getByText(/C&I Loans: Large & Mid Firms/i)).toBeDefined();
  });

  it('switches to Rating Tier Matrix view and renders regional ratings and fallen angel note', () => {
    render(<CreditMarketRadar />);

    const matrixTab = screen.getByRole('button', { name: /Rating Tier Matrix/i });
    fireEvent.click(matrixTab);

    expect(screen.getByText(/Corporate Credit Rating Spread & Default Matrix/i)).toBeDefined();
    expect(screen.getByText(/The "Fallen Angel" Mechanism Explained/i)).toBeDefined();
    expect(screen.getByText(/BBB \(Fallen Angel Frontier\)/i)).toBeDefined();
    expect(screen.getByText(/CCC & Lower \(Distress\)/i)).toBeDefined();
  });

  it('allows toggling between multi-region comparison and single-region focus in OAS view', () => {
    render(<CreditMarketRadar />);

    const toggleBtn = screen.getByRole('button', { name: /Comparing All Regions/i });
    expect(toggleBtn).toBeDefined();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /Focus Active Region/i })).toBeDefined();
  });
});
