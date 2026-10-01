import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InflationAnatomyRadar } from '../InflationAnatomyRadar';

describe('InflationAnatomyRadar Component', () => {
  it('renders header, active regime badge, and key inflation KPI indicators', () => {
    render(<InflationAnatomyRadar />);

    expect(screen.getByText('Inflation Anatomy: Beyond Headline CPI')).toBeDefined();
    expect(screen.getByText(/Target Equilibrium/i)).toBeDefined();

    // KPI cards
    expect(screen.getAllByText('Headline CPI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Core CPI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Supercore').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Shelter / OER').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Core Goods').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PPI Final Demand').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the latest basket contribution breakdown', () => {
    render(<InflationAnatomyRadar />);

    expect(screen.getByText(/Latest Basket Contribution Breakdown/i)).toBeDefined();
    expect(screen.getAllByText(/Shelter \/ OER/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Supercore \(Services ex-Shelter\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Core Goods/i).length).toBeGreaterThanOrEqual(1);
  });

  it('allows switching sovereign profiles across global economies', () => {
    render(<InflationAnatomyRadar />);

    const deuBtn = screen.getByRole('button', { name: /DEU/i });
    fireEvent.click(deuBtn);
    expect(screen.getByText(/Goods-Led Disinflation/i)).toBeDefined();

    const gbrBtn = screen.getByRole('button', { name: /GBR/i });
    fireEvent.click(gbrBtn);
    expect(screen.getByText(/Sticky Supercore/i)).toBeDefined();

    const chnBtn = screen.getByRole('button', { name: /CHN/i });
    fireEvent.click(chnBtn);
    expect(screen.getByText(/Deflationary Contraction/i)).toBeDefined();

    const canBtn = screen.getByRole('button', { name: /CAN/i });
    fireEvent.click(canBtn);
    expect(screen.getAllByText('5.1%').length).toBeGreaterThanOrEqual(1);
  });

  it('allows toggling between Decomposition Stack, Supercore & Services, and Upstream PPI tabs', () => {
    render(<InflationAnatomyRadar />);

    // Switch to Supercore & Services
    const supercoreTab = screen.getByRole('button', { name: /Supercore & Services/i });
    fireEvent.click(supercoreTab);
    expect(screen.getByText(/The Powell Doctrine: Why Core Services ex-Shelter Determines Interest Rates/i)).toBeDefined();

    // Switch to PPI vs CPI Pipeline
    const ppiTab = screen.getByRole('button', { name: /Upstream PPI vs\. CPI/i });
    fireEvent.click(ppiTab);
    expect(screen.getByText(/Active Pipeline Spread/i)).toBeDefined();

    // Switch back to Decomposition
    const decompTab = screen.getByRole('button', { name: /Decomposition Stack/i });
    fireEvent.click(decompTab);
    expect(screen.getByText(/Toggle Series:/i)).toBeDefined();
  });

  it('allows toggling visibility filters for inflation components', () => {
    render(<InflationAnatomyRadar />);

    const coreToggle = screen.getByRole('button', { name: /Core \(ex-Food\/Energy\)/i });
    fireEvent.click(coreToggle);
    // Clicking again should toggle back
    fireEvent.click(coreToggle);
  });
});
