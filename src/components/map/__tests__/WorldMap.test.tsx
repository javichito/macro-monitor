import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorldMap } from '../WorldMap';
import { AppProvider } from '../../../context/AppContext';

/*
 * Unit tests validating Equal Earth geographic presets, projection math,
 * and regional navigation to ensure clicking continent presets like Europe
 * centers the map viewport precisely on target continental landmasses.
 */

describe('WorldMap Component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const renderWorldMap = () => {
    return render(
      <AppProvider>
        <WorldMap
          selectedYear={2026}
          currencyPerspective="nominal"
          granularity="country"
          onGranularityChange={() => {}}
        />
      </AppProvider>
    );
  };

  it('renders Global Equal Earth Cartography title and regional quick jump buttons', () => {
    renderWorldMap();

    expect(screen.getByText(/Global Equal Earth Cartography \(2026\)/)).toBeDefined();
    expect(screen.getByRole('button', { name: 'World' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Europe' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Americas' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Asia-Pacific' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Africa' })).toBeDefined();
  });

  it('zooms and centers directly on Europe when Europe preset button is clicked', () => {
    const { container } = renderWorldMap();

    const europeButton = screen.getByRole('button', { name: 'Europe' });
    fireEvent.click(europeButton);

    const mapGroup = container.querySelector('svg g[transform]');
    expect(mapGroup).toBeDefined();
    const transform = mapGroup?.getAttribute('transform');

    // Pan -885 and scale 2.7 centers the Europe centroid (505, 85) at viewport center (480, 250)
    expect(transform).toBe('translate(-885, 20) scale(2.7)');
  });

  it('resets view to global world coverage when reset button is clicked', () => {
    const { container } = renderWorldMap();

    const europeButton = screen.getByRole('button', { name: 'Europe' });
    fireEvent.click(europeButton);

    const resetButton = screen.getByTitle('Reset View');
    fireEvent.click(resetButton);

    const mapGroup = container.querySelector('svg g[transform]');
    expect(mapGroup?.getAttribute('transform')).toBe('translate(0, 0) scale(1)');
  });
});
