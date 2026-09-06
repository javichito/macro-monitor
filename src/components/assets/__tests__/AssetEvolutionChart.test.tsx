import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssetEvolutionChart } from '../AssetEvolutionChart';

/*
 * Component testing following the official Next.js Vitest + Testing Library guide:
 * Tests component rendering, user interactions, button toggles, and modal dialogs in jsdom.
 */

describe('AssetEvolutionChart Component', () => {
  it('renders the header and both interactive toggle controls', () => {
    render(<AssetEvolutionChart currencyPerspective="nominal" selectedYear={2026} />);

    expect(screen.getByText('Global Asset Allocation Stack (1980–2026)')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Macro Classes (6)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Sub-Sectors (18)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Valuation ($T)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Share (%)' })).toBeDefined();
  });

  it('allows toggling between Macro Classes (6) and Sub-Sectors (18) views', () => {
    render(<AssetEvolutionChart currencyPerspective="nominal" selectedYear={2026} />);

    const macroButton = screen.getByRole('button', { name: 'Macro Classes (6)' });
    const subButton = screen.getByRole('button', { name: 'Sub-Sectors (18)' });

    // Initial state is 'macro'
    expect(macroButton.className).toContain('bg-emerald-500');
    expect(subButton.className).not.toContain('bg-emerald-500');

    // Toggle to 'sub'
    fireEvent.click(subButton);
    expect(subButton.className).toContain('bg-emerald-500');
    expect(macroButton.className).not.toContain('bg-emerald-500');

    // Toggle back to 'macro'
    fireEvent.click(macroButton);
    expect(macroButton.className).toContain('bg-emerald-500');
  });

  it('allows toggling between Valuation ($T) and Share (%) units', () => {
    render(<AssetEvolutionChart currencyPerspective="nominal" selectedYear={2026} />);

    const valuationButton = screen.getByRole('button', { name: 'Valuation ($T)' });
    const shareButton = screen.getByRole('button', { name: 'Share (%)' });

    // Initial state is 'trillion'
    expect(valuationButton.className).toContain('bg-emerald-500');
    expect(shareButton.className).not.toContain('bg-emerald-500');

    // Toggle to 'share'
    fireEvent.click(shareButton);
    expect(shareButton.className).toContain('bg-emerald-500');
    expect(valuationButton.className).not.toContain('bg-emerald-500');
  });

  it('renders all 6 primary asset category cards with sub-sector preview bars', () => {
    render(<AssetEvolutionChart currencyPerspective="nominal" selectedYear={2026} />);

    expect(screen.getByText('Real Estate & Land')).toBeDefined();
    expect(screen.getByText('Public & Private Equities')).toBeDefined();
    expect(screen.getByText('Bonds & Pension Reserves')).toBeDefined();
    expect(screen.getByText('Cash & Bank Deposits')).toBeDefined();
    expect(screen.getByText('Gold & Precious Metals')).toBeDefined();
    expect(screen.getByText('Digital Assets & Crypto')).toBeDefined();
  });

  it('renders global household liabilities balance sheet section', () => {
    render(<AssetEvolutionChart currencyPerspective="nominal" selectedYear={2026} />);

    expect(screen.getByText(/Global Liabilities & Encumbrances/)).toBeDefined();
    expect(screen.getByText('Residential Mortgages')).toBeDefined();
    expect(screen.getByText('Consumer & Revolving Credit')).toBeDefined();
    expect(screen.getByText('Student & Education Debt')).toBeDefined();
  });

  it('opens and closes the SubAssetDetailModal when an asset class card is clicked', () => {
    render(<AssetEvolutionChart currencyPerspective="nominal" selectedYear={2026} />);

    // Click the Real Estate & Land card
    const cardTitle = screen.getByText('Real Estate & Land');
    const card = cardTitle.closest('div[class*="cursor-pointer"]');
    expect(card).toBeDefined();

    if (card) {
      fireEvent.click(card);
    }

    // Modal is now open: verify modal sub-sector items are rendered
    expect(screen.getByText('Residential Real Estate')).toBeDefined();
    expect(screen.getByText('Commercial Real Estate')).toBeDefined();
    expect(screen.getByText('Agricultural & Farmland')).toBeDefined();

    // Click Done or Close button to dismiss
    const doneButton = screen.getByRole('button', { name: 'Done' });
    fireEvent.click(doneButton);

    // Modal sub-sector details should now be dismissed
    expect(screen.queryByText('Residential Real Estate')).toBeNull();
  });
});
