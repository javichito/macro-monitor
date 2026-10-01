import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CountryComparison } from '../CountryComparison';

/*
 * Component testing for CountryComparison ensuring reliable multi-country comparison,
 * metric battle cards calculation, preset switching, swap mechanics, and narrative synthesis.
 */

describe('CountryComparison Component', () => {
  it('renders default head-to-head duel between United States and China', () => {
    render(
      <CountryComparison
        selectedYear={2026}
        currencyPerspective="nominal"
        initialCountryCodeA="USA"
        initialCountryCodeB="CHN"
      />
    );

    expect(screen.getByText('Head-to-Head Macro Comparison')).toBeDefined();
    expect(screen.getByText(/Sovereign Balance Sheet Duel \(2026\)/)).toBeDefined();
    expect(screen.getAllByText(/United States/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/China/).length).toBeGreaterThanOrEqual(1);

    // Check Tale of the Tape metric titles
    expect(screen.getByText('Wealth per Adult (Mean)')).toBeDefined();
    expect(screen.getByText('Median Wealth per Adult')).toBeDefined();
    expect(screen.getByText('Inequality Skew (Mean/Median)')).toBeDefined();
    expect(screen.getByText('Total National Wealth')).toBeDefined();
    expect(screen.getByText('GDP per Capita')).toBeDefined();
    expect(screen.getByText('Debt-to-GDP Ratio')).toBeDefined();
    expect(screen.getByText('Wealth Gini Index')).toBeDefined();
    expect(screen.getByText('Annual Inflation Rate')).toBeDefined();

    // Check Asset Mix duel headers
    expect(screen.getByText('Household Balance Sheet & Asset Allocation Duel')).toBeDefined();

    // Check Comparative Synthesis card
    expect(screen.getByText(/Comparative Economic Synthesis/)).toBeDefined();
  });

  it('swaps countries when the swap button is clicked', () => {
    render(
      <CountryComparison
        selectedYear={2026}
        currencyPerspective="nominal"
        initialCountryCodeA="USA"
        initialCountryCodeB="CHN"
      />
    );

    const swapButton = screen.getByRole('button', { name: /Swap countries/i });
    expect(swapButton).toBeDefined();

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects[0].value).toBe('USA');
    expect(selects[1].value).toBe('CHN');

    fireEvent.click(swapButton);

    expect(selects[0].value).toBe('CHN');
    expect(selects[1].value).toBe('USA');
  });

  it('updates duel when a quick preset is clicked', () => {
    render(
      <CountryComparison
        selectedYear={2026}
        currencyPerspective="nominal"
        initialCountryCodeA="USA"
        initialCountryCodeB="CHN"
      />
    );

    const ausVsUsPreset = screen.getByRole('button', { name: /Australia vs\. US/i });
    fireEvent.click(ausVsUsPreset);

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects[0].value).toBe('AUS');
    expect(selects[1].value).toBe('USA');

    expect(screen.getAllByText(/Australia/).length).toBeGreaterThanOrEqual(1);
  });

  it('updates duel when country dropdowns are changed manually', () => {
    render(
      <CountryComparison
        selectedYear={2026}
        currencyPerspective="nominal"
        initialCountryCodeA="USA"
        initialCountryCodeB="CHN"
      />
    );

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    fireEvent.change(selects[0], { target: { value: 'DEU' } });

    expect(selects[0].value).toBe('DEU');
    expect(screen.getAllByText(/Germany/).length).toBeGreaterThanOrEqual(1);
  });

  it('computes and highlights wealth skew narrative between Australia and the US', () => {
    render(
      <CountryComparison
        selectedYear={2026}
        currencyPerspective="nominal"
        initialCountryCodeA="AUS"
        initialCountryCodeB="USA"
      />
    );

    expect(screen.getByText(/Comparative Economic Synthesis/)).toBeDefined();
    expect(screen.getByText(/Household Balance Sheet & Asset Allocation Duel/)).toBeDefined();
    expect(screen.getByText(/Middle-Class Living Standards/)).toBeDefined();
  });

  it('gracefully adapts to gold perspective and historic years', () => {
    render(
      <CountryComparison
        selectedYear={2000}
        currencyPerspective="real"
        initialCountryCodeA="USA"
        initialCountryCodeB="JPN"
      />
    );

    expect(screen.getByText(/Sovereign Balance Sheet Duel \(2000\)/)).toBeDefined();
    expect(screen.getAllByText(/Japan/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders Labor Market Health & Claudia Sahm Recession Duel with key metrics and narrative', () => {
    render(
      <CountryComparison
        selectedYear={2026}
        currencyPerspective="nominal"
        initialCountryCodeA="USA"
        initialCountryCodeB="DEU"
      />
    );

    expect(screen.getByText(/Labor Market Health & Claudia Sahm Recession Duel/)).toBeDefined();
    expect(screen.getByText('Unemployment Rate (U-3)')).toBeDefined();
    expect(screen.getByText('Labor Force Participation (LFPR)')).toBeDefined();
    expect(screen.getByText('Claudia Sahm Recession Delta')).toBeDefined();
    expect(screen.getByText('Labor Tightness (V/U Ratio)')).toBeDefined();
    expect(screen.getByText('Annual Wage Growth (YoY)')).toBeDefined();
    expect(screen.getByText('Labor Productivity Growth (YoY)')).toBeDefined();
    expect(screen.getByText(/Labor Market & Sahm Signal/)).toBeDefined();
  });
});

