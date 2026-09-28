import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MarketPulseTicker } from '../MarketPulseTicker';
import { MARKET_BENCHMARKS } from '../../../data/market-pulse';

/*
 * Verification tests for the Live Market Pulse Ticker component,
 * checking data integrity of financial benchmarks, responsive collapsing,
 * modal triggering, and keyboard navigation.
 */

describe('MarketPulseTicker Component', () => {
  it('renders all 7 macro benchmarks in the ticker strip', () => {
    render(<MarketPulseTicker />);

    expect(screen.getByText('Live Pulse')).toBeDefined();

    for (const b of MARKET_BENCHMARKS) {
      expect(screen.getByText(b.symbol)).toBeDefined();
    }
  });

  it('formats benchmark prices and units accurately', () => {
    render(<MarketPulseTicker />);

    // Spot Gold format test
    expect(screen.getByText('$2,742.80/oz')).toBeDefined();

    // US 10Y Yield format test
    expect(screen.getByText('4.19%')).toBeDefined();

    // Bitcoin format test
    expect(screen.getByText('$68,450')).toBeDefined();
  });

  it('opens detailed macro intelligence modal when a benchmark is clicked', () => {
    render(<MarketPulseTicker />);

    const goldBtn = screen.getByText('XAU/USD').closest('button');
    expect(goldBtn).toBeDefined();

    if (goldBtn) {
      fireEvent.click(goldBtn);
    }

    // Modal should appear
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Spot Gold')).toBeDefined();
    expect(screen.getByText(/counterparty-free reserve asset/)).toBeDefined();
    expect(screen.getByText(/52W Low:/)).toBeDefined();
    expect(screen.getByText(/52W High:/)).toBeDefined();
  });

  it('closes the modal when clicking the close button', () => {
    render(<MarketPulseTicker />);

    const btcBtn = screen.getByText('BTC/USD').closest('button');
    if (btcBtn) {
      fireEvent.click(btcBtn);
    }

    expect(screen.getByRole('dialog')).toBeDefined();

    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the modal when pressing the Escape key', () => {
    render(<MarketPulseTicker />);

    const dxyBtn = screen.getByText('DXY').closest('button');
    if (dxyBtn) {
      fireEvent.click(dxyBtn);
    }

    expect(screen.getByRole('dialog')).toBeDefined();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('collapses and re-expands ticker when toggle button is clicked', () => {
    render(<MarketPulseTicker />);

    // Ticker is initially expanded
    expect(screen.getByText('XAU/USD')).toBeDefined();

    // Click collapse button
    const collapseBtn = screen.getByLabelText('Collapse market ticker');
    fireEvent.click(collapseBtn);

    // Benchmarks should be hidden
    expect(screen.queryByText('XAU/USD')).toBeNull();

    // Click expand button
    const expandBtn = screen.getByLabelText('Expand market ticker');
    fireEvent.click(expandBtn);

    // Benchmarks should be visible again
    expect(screen.getByText('XAU/USD')).toBeDefined();
  });
});
