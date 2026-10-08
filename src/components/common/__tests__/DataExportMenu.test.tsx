import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataExportMenu } from '../DataExportMenu';

describe('DataExportMenu', () => {
  const dummyData = [
    { year: 2026, wealthTrillion: 512, gini: 0.88 },
    { year: 2025, wealthTrillion: 498, gini: 0.882 },
  ];

  it('renders trigger button with accessible label', () => {
    render(
      <DataExportMenu
        title="Wealth Inequality"
        filename="wealth-inequality"
        data={dummyData}
      />
    );

    const button = screen.getByRole('button', { name: /^export dataset$/i });
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles dropdown menu on click', () => {
    render(
      <DataExportMenu
        title="Wealth Inequality"
        filename="wealth-inequality"
        data={dummyData}
      />
    );

    const button = screen.getByRole('button', { name: /^export dataset$/i });
    fireEvent.click(button);

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Download CSV (.csv)')).toBeDefined();
    expect(screen.getByText('Download JSON (.json)')).toBeDefined();
    expect(screen.getByText('Copy JSON to Clipboard')).toBeDefined();
  });

  it('supports lazy evaluation via data function', () => {
    const dataGetter = vi.fn(() => dummyData);

    render(
      <DataExportMenu
        title="Lazy Dataset"
        filename="lazy-dataset"
        data={dataGetter}
      />
    );

    // Initial render should not evaluate the lazy data
    expect(dataGetter).not.toHaveBeenCalled();

    const button = screen.getByRole('button', { name: /^export dataset$/i });
    fireEvent.click(button);

    // Clicking CSV option invokes dataGetter
    const csvButton = screen.getByRole('menuitem', { name: /download csv/i });
    fireEvent.click(csvButton);

    expect(dataGetter).toHaveBeenCalled();
  });
});
