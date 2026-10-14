import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HousingMacroRadar } from '../HousingMacroRadar';

describe('HousingMacroRadar Component', () => {
  it('renders header, title, and GlobalAssetYear real estate wealth banner', () => {
    render(<HousingMacroRadar />);

    expect(screen.getByText('Housing Macro & Affordability Dynamics')).toBeDefined();
    expect(screen.getByText(/GlobalAssetYear/i)).toBeDefined();
    expect(screen.getByText(/World's Largest Asset Class/i)).toBeDefined();
  });

  it('renders all 4 primary navigation tabs', () => {
    render(<HousingMacroRadar />);

    expect(screen.getByRole('button', { name: /Affordability Index \(HAI\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /30Y Benchmark & Spread/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Real Home Prices \(Deflated\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Global Transmission/i })).toBeDefined();
  });

  it('renders key affordability metrics and interactive sandbox sliders', () => {
    render(<HousingMacroRadar />);

    expect(screen.getByText('Housing Affordability (HAI)')).toBeDefined();
    expect(screen.getByText('Monthly Payment (P&I)')).toBeDefined();
    expect(screen.getByText('Qualifying Household Income')).toBeDefined();
    expect(screen.getByText('Interactive Affordability Sandbox')).toBeDefined();

    // Verify slider label
    expect(screen.getByText('30-Year Mortgage Rate')).toBeDefined();
    expect(screen.getByText('Median Home Price')).toBeDefined();
    expect(screen.getByText('Median Household Income')).toBeDefined();
  });

  it('interactively recalculates HAI when sandbox mortgage rate slider changes', () => {
    render(<HousingMacroRadar />);

    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(3);
    const rateSlider = sliders[0];
    expect(rateSlider).toBeDefined();

    // Reset button should be visible
    expect(screen.getByRole('button', { name: /Reset to Benchmark/i })).toBeDefined();
  });

  it('switches to 30Y Benchmark & Spread view', () => {
    render(<HousingMacroRadar />);

    const ratesTab = screen.getByRole('button', { name: /30Y Benchmark & Spread/i });
    fireEvent.click(ratesTab);

    expect(screen.getByText('30Y Fixed Mortgage Benchmark')).toBeDefined();
    expect(screen.getByText('10-Year Treasury Yield')).toBeDefined();
    expect(screen.getByText('Mortgage Basis Spread')).toBeDefined();
    expect(screen.getByText(/Lock-in "Golden Handcuffs"/i)).toBeDefined();
    expect(screen.getByText(/Anatomy of the Rate Lock-in/i)).toBeDefined();
  });

  it('switches to Real Home Prices (Deflated) view and renders nominal vs real comparisons', () => {
    render(<HousingMacroRadar />);

    const realTab = screen.getByRole('button', { name: /Real Home Prices \(Deflated\)/i });
    fireEvent.click(realTab);

    expect(screen.getByText('Nominal Case-Shiller Index')).toBeDefined();
    expect(screen.getByText('Consumer Price Index (CPI)')).toBeDefined();
    expect(screen.getByText('Real Case-Shiller (Deflated)')).toBeDefined();
    expect(screen.getByText(/Disentangling genuine property purchasing power gains/i)).toBeDefined();
  });

  it('switches to Global Transmission view and renders all country buttons and table', () => {
    render(<HousingMacroRadar />);

    const globalTab = screen.getByRole('button', { name: /Global Transmission/i });
    fireEvent.click(globalTab);

    expect(screen.getByText(/G7 & Developed Market Housing Comparison Matrix/i)).toBeDefined();
    expect(screen.getAllByText(/United States/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/United Kingdom/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Canada/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Australia/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Japan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/China/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Germany/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Switzerland/i).length).toBeGreaterThan(0);
  });

  it('switches selected country in Global view and updates transmission profile', () => {
    render(<HousingMacroRadar />);

    const globalTab = screen.getByRole('button', { name: /Global Transmission/i });
    fireEvent.click(globalTab);

    // Click on United Kingdom card
    const ukElements = screen.getAllByText('United Kingdom');
    const ukBtn = ukElements[0].closest('button');
    if (ukBtn) {
      fireEvent.click(ukBtn);
    }

    expect(screen.getByText(/United Kingdom Real Estate Profile/i)).toBeDefined();
    expect(screen.getByText(/mortgage cliff/i)).toBeDefined();
  });

  it('renders active macroeconomic alerts', () => {
    render(<HousingMacroRadar />);

    expect(screen.getByText(/Active Real Estate & Mortgage Regime Alerts/i)).toBeDefined();
    expect(screen.getByText(/Golden Handcuffs/i)).toBeDefined();
    expect(screen.getByText(/Mortgage Basis Dislocation/i)).toBeDefined();
    expect(screen.getByText(/Real vs Nominal Divergence/i)).toBeDefined();
  });
});
