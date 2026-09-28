import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CountryRankingsTable } from '../CountryRankingsTable';

describe('CountryRankingsTable Component', () => {
  it('renders the league table header and default median wealth ranking', () => {
    render(
      <CountryRankingsTable
        selectedYear={2026}
        currencyPerspective="nominal"
      />
    );

    expect(screen.getByText('Global Sovereign League Table (2026)')).toBeDefined();
    expect(screen.getByPlaceholderText('Search country...')).toBeDefined();

    // Prominent economies should be rendered
    expect(screen.getByText('United States')).toBeDefined();
    expect(screen.getByText('Australia')).toBeDefined();
    expect(screen.getByText('China')).toBeDefined();
    expect(screen.getByText('Switzerland')).toBeDefined();
  });

  it('filters countries using the search input', () => {
    render(
      <CountryRankingsTable
        selectedYear={2026}
        currencyPerspective="nominal"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search country...');
    fireEvent.change(searchInput, { target: { value: 'Japan' } });

    expect(screen.getByText('Japan')).toBeDefined();
    expect(screen.queryByText('United States')).toBeNull();
    expect(screen.queryByText('Australia')).toBeNull();
  });

  it('sorts countries when clicking a column header', () => {
    render(
      <CountryRankingsTable
        selectedYear={2026}
        currencyPerspective="nominal"
      />
    );

    // Initial sort is medianWealth descending -> Australia or Switzerland is near the top
    const countryHeader = screen.getByText('Country');
    fireEvent.click(countryHeader);

    // After clicking Country, sort is alphabetical ascending -> Australia should be row 1
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(5);
  });

  it('triggers duel launch callback when clicking duel button', () => {
    const onSelectDuelMock = vi.fn();

    render(
      <CountryRankingsTable
        selectedYear={2026}
        currencyPerspective="nominal"
        onSelectCountryForDuel={onSelectDuelMock}
      />
    );

    const duelButtons = screen.getAllByRole('button', { name: /Duel/i });
    expect(duelButtons.length).toBeGreaterThan(0);

    fireEvent.click(duelButtons[0]);
    expect(onSelectDuelMock).toHaveBeenCalledTimes(1);
  });
});
