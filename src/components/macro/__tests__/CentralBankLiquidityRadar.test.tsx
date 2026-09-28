import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CentralBankLiquidityRadar } from '../CentralBankLiquidityRadar';
import {
  getCentralBankLiquiditySummary,
  CENTRAL_BANK_PROFILES,
  GLOBAL_LIQUIDITY_HISTORY,
  CURRENT_US_NET_LIQUIDITY,
} from '../../../data/central-bank-liquidity-data';

/*
 * Unit tests for The Global Central Bank Liquidity Radar
 * Validates aggregate balance sheet math, tab toggling, lead-lag overlay selection,
 * transmission mechanics, and US Net Liquidity calculations.
 */

describe('CentralBankLiquidityRadar Component', () => {
  it('renders radar header, regime badge, and total Big 4 aggregate assets', () => {
    render(<CentralBankLiquidityRadar />);

    expect(screen.getByText('The Global Central Bank Liquidity Radar')).toBeDefined();
    expect(screen.getByText('Global Monetary Base & Shadow Liquidity')).toBeDefined();
    expect(screen.getByText(/Big 4 Aggregate Assets:/i)).toBeDefined();
    expect(screen.getByText(/US Net Liquidity:/i)).toBeDefined();
  });

  it('renders cards for all 7 major central banks (Fed, ECB, PBOC, BOJ, BOE, SNB, BOC)', () => {
    render(<CentralBankLiquidityRadar />);

    expect(screen.getByText('Federal Reserve')).toBeDefined();
    expect(screen.getByText('European Central Bank')).toBeDefined();
    expect(screen.getByText('People’s Bank of China')).toBeDefined();
    expect(screen.getByText('Bank of Japan')).toBeDefined();
    expect(screen.getByText('Bank of England')).toBeDefined();
    expect(screen.getByText('Swiss National Bank')).toBeDefined();
    expect(screen.getByText('Bank of Canada')).toBeDefined();
  });

  it('toggles transmission spotlight when clicking a central bank card', () => {
    render(<CentralBankLiquidityRadar />);

    const fedCard = screen.getByText('Federal Reserve').closest('button');
    expect(fedCard).toBeDefined();

    // Click Fed card to open spotlight
    fireEvent.click(fedCard!);
    expect(screen.getByText(/Federal Reserve Transmission Spotlight/i)).toBeDefined();

    // Click clear selection button
    const clearButton = screen.getByText('Clear Selection');
    fireEvent.click(clearButton);
    expect(screen.queryByText(/Federal Reserve Transmission Spotlight/i)).toBeNull();
  });

  it('allows toggling between Big 4 Stack, Lead-Lag vs Assets, and US Net Liquidity views', () => {
    render(<CentralBankLiquidityRadar />);

    const stackTab = screen.getByRole('button', { name: /Big 4 Stack/i });
    const leadLagTab = screen.getByRole('button', { name: /Lead-Lag vs Assets/i });
    const usNetTab = screen.getByRole('button', { name: /US Net Liquidity/i });

    // Initial state is stack
    expect(stackTab.className).toContain('bg-sky-500');

    // Switch to Lead-Lag view
    fireEvent.click(leadLagTab);
    expect(leadLagTab.className).toContain('bg-sky-500');
    expect(screen.getByText('Compare Overlay:')).toBeDefined();

    // Switch to US Net Liquidity view
    fireEvent.click(usNetTab);
    expect(usNetTab.className).toContain('bg-sky-500');
    expect(screen.getByText(/Fed balance sheet adjusted for Treasury cash/i)).toBeDefined();
  });

  it('toggles asset overlays in Lead-Lag view', () => {
    render(<CentralBankLiquidityRadar />);

    // Navigate to Lead-Lag view
    const leadLagTab = screen.getByRole('button', { name: /Lead-Lag vs Assets/i });
    fireEvent.click(leadLagTab);

    const btcButton = screen.getByRole('button', { name: 'Bitcoin (BTC)' });
    const sp500Button = screen.getByRole('button', { name: 'S&P 500 Equities' });
    const goldButton = screen.getByRole('button', { name: 'Gold (XAU)' });

    // Toggle to S&P 500
    fireEvent.click(sp500Button);
    expect(sp500Button.className).toContain('bg-sky-500/20');

    // Toggle to Gold
    fireEvent.click(goldButton);
    expect(goldButton.className).toContain('bg-yellow-500/20');

    // Toggle back to BTC
    fireEvent.click(btcButton);
    expect(btcButton.className).toContain('bg-amber-500/20');
  });

  it('renders empirical lead-lag correlation matrix cards for all three asset classes', () => {
    render(<CentralBankLiquidityRadar />);

    expect(screen.getByText('Empirical Lead-Lag Correlation Matrix (Liquidity vs Risk Assets)')).toBeDefined();
    expect(screen.getByText('Bitcoin (BTC)')).toBeDefined();
    expect(screen.getByText('S&P 500 Equities')).toBeDefined();
    expect(screen.getByText('Gold (XAU)')).toBeDefined();
    expect(screen.getByText('r = 0.88')).toBeDefined();
    expect(screen.getByText('r = 0.82')).toBeDefined();
    expect(screen.getByText('r = 0.76')).toBeDefined();
  });
});

describe('Central Bank Liquidity Analytics Engine', () => {
  it('correctly aggregates Big 4 balance sheets and computes momentum summary', () => {
    const summary = getCentralBankLiquiditySummary();

    expect(summary.totalLiquidityUsd).toBeGreaterThan(24.0);
    expect(summary.usNetLiquidity).toBe(5.72);
    expect(summary.regimeLabel).toContain('Liquidity Expansion');
  });

  it('verifies US Net Liquidity equals Fed Assets minus TGA minus Reverse Repo', () => {
    const { fedTotalAssetsTrillion, tgaBalanceTrillion, reverseRepoTrillion, usNetLiquidityTrillion } =
      CURRENT_US_NET_LIQUIDITY;

    const calculatedNetLiquidity = Number(
      (fedTotalAssetsTrillion - tgaBalanceTrillion - reverseRepoTrillion).toFixed(2)
    );

    expect(calculatedNetLiquidity).toBe(usNetLiquidityTrillion);
  });
});
