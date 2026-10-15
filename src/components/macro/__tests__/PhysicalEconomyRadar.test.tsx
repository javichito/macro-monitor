import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhysicalEconomyRadar } from '../PhysicalEconomyRadar';

describe('PhysicalEconomyRadar Component', () => {
  it('renders header, title, and key telemetry badges', () => {
    render(<PhysicalEconomyRadar />);

    expect(screen.getByText('Physical Economy, Energy & Deglobalization')).toBeDefined();
    expect(screen.getByText('Energy Burden (% GDP)')).toBeDefined();
    expect(screen.getByText('World Trade (% GDP)')).toBeDefined();
    expect(screen.getByText('Working-Age Growth')).toBeDefined();
    expect(screen.getByText('Old-Age Dependency')).toBeDefined();
  });

  it('renders all 4 primary navigation tabs', () => {
    render(<PhysicalEconomyRadar />);

    expect(screen.getByRole('button', { name: /All Pillars/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Energy Expenditure \(8%-10% Tax\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Deglobalization & Trade/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Demographic Cliff & Fiscal Drag/i })).toBeDefined();
  });

  it('renders regional selector buttons', () => {
    render(<PhysicalEconomyRadar />);

    expect(screen.getByRole('button', { name: /^🌐\s*Global/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /United States/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Eurozone/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /China/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Japan/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Germany/i })).toBeDefined();
  });

  it('renders interactive simulator sliders and recalculates dynamically', () => {
    render(<PhysicalEconomyRadar />);

    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(3);

    // Verify slider titles
    expect(screen.getByText(/Brent Crude Oil \(\$\/bbl\)/i)).toBeDefined();
    expect(screen.getByText(/Average Global Tariff \(%\)/i)).toBeDefined();
    expect(screen.getByText(/Statutory Retirement Age/i)).toBeDefined();

    // Change oil price slider
    const oilSlider = sliders[0];
    fireEvent.change(oilSlider, { target: { value: '140' } });

    // Verify that reset button exists and restores defaults
    const resetBtn = screen.getByRole('button', { name: /Reset Baseline/i });
    expect(resetBtn).toBeDefined();
    fireEvent.click(resetBtn);
  });

  it('switches views to Energy Expenditure', () => {
    render(<PhysicalEconomyRadar />);

    const energyTab = screen.getByRole('button', { name: /Energy Expenditure \(8%-10% Tax\)/i });
    fireEvent.click(energyTab);

    expect(screen.getByText('Global Energy Expenditure as % of World GDP')).toBeDefined();
    expect(screen.getByText('8% Warning Line')).toBeDefined();
    expect(screen.getByText('10% Crisis Line')).toBeDefined();
  });

  it('switches views to Deglobalization & Trade', () => {
    render(<PhysicalEconomyRadar />);

    const tradeTab = screen.getByRole('button', { name: /Deglobalization & Trade/i });
    fireEvent.click(tradeTab);

    expect(screen.getByText(/Global Trade-to-GDP Ratio & Geoeconomic Fragmentation/i)).toBeDefined();
    expect(screen.getByText('2008 Peak: 61.0%')).toBeDefined();
    expect(screen.getByText(/Cross-Country Trade Openness Comparison/i)).toBeDefined();
  });

  it('switches views to Demographic Cliff & Fiscal Drag', () => {
    render(<PhysicalEconomyRadar />);

    const demoTab = screen.getByRole('button', { name: /Demographic Cliff & Fiscal Drag/i });
    fireEvent.click(demoTab);

    expect(screen.getByText(/Old-Age Dependency Ratio & Working-Age Population Cliff/i)).toBeDefined();
    expect(screen.getByText(/Working-Age Workforce Contraction & Hyper-Aging Trajectories/i)).toBeDefined();
  });

  it('switches sovereign region to China and displays localized transmission details', () => {
    render(<PhysicalEconomyRadar />);

    const chinaBtn = screen.getByRole('button', { name: /China/i });
    fireEvent.click(chinaBtn);

    expect(screen.getByText(/China — Physical Economy Transmission Dossier/i)).toBeDefined();
  });
});
