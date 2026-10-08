import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WealthPyramid } from '../WealthPyramid';
import { GLOBAL_WEALTH_HISTORY } from '../../../data/global-wealth';

/*
 * Component testing for WealthPyramid verifying tier presentation,
 * apex > $100M tier presence across years, population/wealth bar scaling, and interactive details.
 */

describe('WealthPyramid Component', () => {
  const wealth2026 = GLOBAL_WEALTH_HISTORY.find((w) => w.year === 2026)!;
  const wealth2000 = GLOBAL_WEALTH_HISTORY.find((w) => w.year === 2000)!;

  it('renders all 5 tiers for 2026 including the > $100M apex tier', () => {
    render(<WealthPyramid data={wealth2026} currencyPerspective="nominal" />);

    expect(screen.getByText('Global Wealth Pyramid (2026)')).toBeDefined();
    expect(screen.getByText('> $100M')).toBeDefined();
    expect(screen.getByText('Apex')).toBeDefined();
    expect(screen.getByText('$1M - $100M')).toBeDefined();
    expect(screen.getByText('$100k - $1M')).toBeDefined();
    expect(screen.getByText('$10k - $100k')).toBeDefined();
    expect(screen.getByText('< $10k')).toBeDefined();
  });

  it('works smoothly when year is changed to 2000, displaying the > $100M apex tier for historical data', () => {
    render(<WealthPyramid data={wealth2000} currencyPerspective="nominal" />);

    expect(screen.getByText('Global Wealth Pyramid (2000)')).toBeDefined();
    expect(screen.getByText('> $100M')).toBeDefined();
    expect(screen.getByText('Apex')).toBeDefined();
    expect(screen.getByText('(10,000 adults)')).toBeDefined();
    expect(screen.getByText('$1M - $100M')).toBeDefined();
  });

  it('formats centi-millionaire population count and share with readable precision', () => {
    render(<WealthPyramid data={wealth2026} currencyPerspective="nominal" />);

    // Centi-millionaires should format as 31,000 adults rather than 0M
    expect(screen.getByText('(31,000 adults)')).toBeDefined();

    // Population share should display as < 0.01%
    expect(screen.getByText('< 0.01%')).toBeDefined();
  });

  it('displays detailed explanatory notes when the > $100M tier is selected', () => {
    render(<WealthPyramid data={wealth2026} currencyPerspective="nominal" />);

    const apexTierLabel = screen.getByText('> $100M');
    const tierCard = apexTierLabel.closest('button, div[class*="cursor-pointer"]');
    expect(tierCard).toBeDefined();

    if (tierCard) {
      fireEvent.mouseEnter(tierCard);
    }

    expect(
      screen.getByText(/Ultra-High-Net-Worth \(Centi-Millionaires & Billionaires\)/)
    ).toBeDefined();
    expect(screen.getByText(/controlling 8.0% of all private net wealth on Earth/)).toBeDefined();
  });
});
