import React from 'react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { YieldCurve3DSurface } from '../YieldCurve3DSurface';

// Mock Canvas 2D context in JSDOM for testing canvas component lifecycle and interactions
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    setLineDash: vi.fn(),
    fillText: vi.fn(),
  });
});

describe('YieldCurve3DSurface Component', () => {
  it('renders canvas, 3D camera presets, palette, and mesh style controls', () => {
    render(<YieldCurve3DSurface selectedSovereign="USA" />);

    // Sovereign HUD badge in canvas viewport
    expect(screen.getByText(/United States Treasury/i)).toBeDefined();

    // Camera preset buttons
    expect(screen.getByRole('button', { name: /3D Iso/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Tenors/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Timeline/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Contour/i })).toBeDefined();

    // Palette & Render style dropdowns
    expect(screen.getByLabelText(/Color Palette/i)).toBeDefined();
    expect(screen.getByLabelText(/Surface Render Style/i)).toBeDefined();
  });

  it('renders timeline playback controls and updates play state', () => {
    render(<YieldCurve3DSurface />);

    const playBtn = screen.getByTitle(/Play Historical Curve Sweep/i);
    expect(playBtn).toBeDefined();

    // Click play to initiate timeline sweep
    fireEvent.click(playBtn);
    expect(screen.getByTitle(/Pause Timeline Sweep/i)).toBeDefined();

    // Click pause to stop
    fireEvent.click(screen.getByTitle(/Pause Timeline Sweep/i));
    expect(screen.getByTitle(/Play Historical Curve Sweep/i)).toBeDefined();
  });

  it('renders sovereign contextual HUD badge based on selectedSovereign prop', () => {
    const { rerender } = render(<YieldCurve3DSurface selectedSovereign="USA" />);
    expect(screen.getByText(/United States Treasury/i)).toBeDefined();

    rerender(<YieldCurve3DSurface selectedSovereign="JPN" />);
    expect(screen.getByText(/Japanese Government Bond/i)).toBeDefined();
  });

  it('toggles time resolution between 1990-2026 and 2020-2026 for USA', () => {
    render(<YieldCurve3DSurface selectedSovereign="USA" />);

    const modernBtn = screen.getByRole('button', { name: /2020–2026 Modern/i });
    fireEvent.click(modernBtn);

    // Active slice label should reflect quarterly format (e.g., 2020 Q1)
    expect(screen.getAllByText(/2020 Q1/i).length).toBeGreaterThan(0);

    const longtermBtn = screen.getByRole('button', { name: /1990–2026 Cycle/i });
    fireEvent.click(longtermBtn);

    expect(screen.getAllByText(/1990/i).length).toBeGreaterThan(0);
  });

  it('allows scrubbing the timeline slider to change active slice', () => {
    render(<YieldCurve3DSurface />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '5' } });

    // Slider value changed
    expect((slider as HTMLInputElement).value).toBe('5');
  });

  it('toggles 3D auto-rotation mode', () => {
    render(<YieldCurve3DSurface />);

    const rotateBtn = screen.getByTitle(/Enable 3D Auto-Rotation/i);
    fireEvent.click(rotateBtn);

    expect(screen.getByTitle(/Pause Auto-Rotation/i)).toBeDefined();
  });
});
