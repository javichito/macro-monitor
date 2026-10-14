import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreditMarketRadar } from '../CreditMarketRadar';

describe('CreditMarketRadar Component', () => {
  it('renders header, title, and initial KPI indicators', () => {
    render(<CreditMarketRadar />);

    expect(screen.getByText('Corporate Credit Spreads & Financial Conditions')).toBeDefined();
    expect(screen.getByText('US High Yield OAS')).toBeDefined();
    expect(screen.getByText('Investment Grade OAS')).toBeDefined();
    expect(screen.getByText('Chicago Fed NFCI')).toBeDefined();
    expect(screen.getByText('Fed SLOOS Net Tightening')).toBeDefined();
  });

  it('renders all 4 primary navigation tabs', () => {
    render(<CreditMarketRadar />);

    expect(screen.getByRole('button', { name: /Credit Spreads \(OAS\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Financial Conditions \(NFCI\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Bank Lending \(SLOOS\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Rating Tier Matrix/i })).toBeDefined();
  });

  it('switches to Financial Conditions (NFCI) view on tab click', () => {
    render(<CreditMarketRadar />);

    const nfciTab = screen.getByRole('button', { name: /Financial Conditions \(NFCI\)/i });
    fireEvent.click(nfciTab);

    expect(screen.getByText(/Synthesizes 105 indicators of financial activity/i)).toBeDefined();
    expect(screen.getAllByText('Risk Sub-Index').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Credit Sub-Index').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Leverage Sub-Index').length).toBeGreaterThan(0);
  });

  it('switches to Bank Lending (SLOOS) view and renders sector breakdown', () => {
    render(<CreditMarketRadar />);

    const sloosTab = screen.getByRole('button', { name: /Bank Lending \(SLOOS\)/i });
    fireEvent.click(sloosTab);

    expect(screen.getByText(/Federal Reserve SLOOS: Bank Underwriting & Credit Demand/i)).toBeDefined();
    expect(screen.getByText(/Current Lending Conditions by Asset Class/i)).toBeDefined();
    expect(screen.getByText(/Commercial Real Estate: Office & Retail/i)).toBeDefined();
  });

  it('switches to Rating Tier Matrix view and renders rating spreads and fallen angel alert', () => {
    render(<CreditMarketRadar />);

    const matrixTab = screen.getByRole('button', { name: /Rating Tier Matrix/i });
    fireEvent.click(matrixTab);

    expect(screen.getByText(/Corporate Credit Rating Spread & Default Matrix/i)).toBeDefined();
    expect(screen.getByText(/The "Fallen Angel" Mechanism Explained/i)).toBeDefined();
    expect(screen.getByText(/BBB \(Fallen Angel Frontier\)/i)).toBeDefined();
    expect(screen.getByText(/CCC & Lower \(Distress\)/i)).toBeDefined();
  });
});
