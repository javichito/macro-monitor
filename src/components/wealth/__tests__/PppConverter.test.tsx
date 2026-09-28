import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PppConverter } from '../PppConverter';
import {
  calculatePppConversion,
  COUNTRY_PPP_METRICS,
} from '../../../lib/calculations';

/*
 * Verification tests for the Purchasing Power Parity (PPP) Cost-of-Living Converter,
 * checking mathematical parity relationships, sectoral basket calculations,
 * and user interactions (origin/destination selection, country swap, search filtering).
 */

describe('PPP Calculation Logic', () => {
  it('returns exact baseline 1.00x values when origin and destination match', () => {
    const result = calculatePppConversion(100000, 'USA', 'USA');
    expect(result.equivalentAmount).toBe(100000);
    expect(result.purchasingMultiplier).toBe(1.0);
    expect(result.costDifferencePercent).toBe(0);
    expect(result.baskets.housingMultiplier).toBe(1.0);
    expect(result.baskets.goodsMultiplier).toBe(1.0);
    expect(result.baskets.servicesMultiplier).toBe(1.0);
    expect(result.summary).toContain('Baseline domestic purchasing parity');
  });

  it('calculates purchasing power boost for lower price level destinations like Spain', () => {
    // USA PLR = 1.00, Spain PLR = 0.70 => Multiplier ~ 1.43x
    const result = calculatePppConversion(100000, 'USA', 'ESP');
    expect(result.purchasingMultiplier).toBeCloseTo(1.43, 1);
    expect(result.equivalentAmount).toBeGreaterThan(140000);
    expect(result.costDifferencePercent).toBeLessThan(0);
    expect(result.baskets.housingMultiplier).toBeGreaterThan(1.5);
  });

  it('calculates purchasing power compression for higher price level destinations like Switzerland', () => {
    // USA PLR = 1.00, Switzerland PLR = 1.36 => Multiplier ~ 0.74x
    const result = calculatePppConversion(100000, 'USA', 'CHE');
    expect(result.purchasingMultiplier).toBeLessThan(1.0);
    expect(result.equivalentAmount).toBeLessThan(100000);
    expect(result.costDifferencePercent).toBeGreaterThan(0);
    expect(result.baskets.housingMultiplier).toBeLessThan(1.0);
  });

  it('maps all 31 sovereign nations with valid non-zero PPP metrics', () => {
    const keys = Object.keys(COUNTRY_PPP_METRICS);
    expect(keys.length).toBe(31);

    for (const key of keys) {
      const metric = COUNTRY_PPP_METRICS[key];
      expect(metric.priceLevelRatio).toBeGreaterThan(0);
      expect(metric.housingFactor).toBeGreaterThan(0);
      expect(metric.goodsFactor).toBeGreaterThan(0);
      expect(metric.servicesFactor).toBeGreaterThan(0);
      expect(metric.currencyCode).toBeTruthy();
    }
  });
});

describe('PppConverter Component', () => {
  it('renders initial state with default USA to Spain comparison', () => {
    render(<PppConverter />);

    expect(
      screen.getByText(/Purchasing Power Parity \(PPP\) & Cost-of-Living Converter/)
    ).toBeDefined();
    expect(screen.getByText(/World Bank ICP 2026 Model/)).toBeDefined();
    expect(screen.getByText(/Housing & Rent/)).toBeDefined();
    expect(screen.getByText(/Food & Groceries/)).toBeDefined();
    expect(screen.getByText(/Healthcare & Labor/)).toBeDefined();
    expect(screen.getByText('Global Purchasing Power Leaderboard')).toBeDefined();
  });

  it('updates capital when clicking quick presets', () => {
    render(<PppConverter />);

    const presetMillion = screen.getByRole('button', { name: '$1.0M' });
    fireEvent.click(presetMillion);

    const input = screen.getByLabelText(/Capital or Net Worth in USD/) as HTMLInputElement;
    expect(input.value).toBe('1000000');
  });

  it('swaps origin and destination countries when swap button is clicked', () => {
    render(<PppConverter />);

    const originSelect = screen.getByLabelText('Origin Country') as HTMLSelectElement;
    const destSelect = screen.getByLabelText('Destination Country') as HTMLSelectElement;

    expect(originSelect.value).toBe('USA');
    expect(destSelect.value).toBe('ESP');

    const swapButton = screen.getByLabelText('Swap origin and target countries');
    fireEvent.click(swapButton);

    expect(originSelect.value).toBe('ESP');
    expect(destSelect.value).toBe('USA');
  });

  it('filters leaderboard countries when typing in search input', () => {
    render(<PppConverter />);

    const searchInput = screen.getByPlaceholderText('Search country...');
    fireEvent.change(searchInput, { target: { value: 'Japan' } });

    expect(screen.getByText('Japan')).toBeDefined();
    expect(screen.queryByText('Switzerland')).toBeNull();
  });

  it('updates destination country when clicking Compare button in leaderboard', () => {
    render(<PppConverter />);

    // Search for India to find its Compare button
    const searchInput = screen.getByPlaceholderText('Search country...');
    fireEvent.change(searchInput, { target: { value: 'India' } });

    const compareBtn = screen.getByRole('button', { name: 'Compare' });
    fireEvent.click(compareBtn);

    const destSelect = screen.getByLabelText('Destination Country') as HTMLSelectElement;
    expect(destSelect.value).toBe('IND');
  });
});
