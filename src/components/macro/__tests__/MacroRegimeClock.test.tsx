import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MacroRegimeClock } from '../MacroRegimeClock';

describe('MacroRegimeClock Component', () => {
  it('renders header, 4 quadrants, and matrix axis guides', () => {
    render(<MacroRegimeClock />);

    expect(screen.getByText('Macro Regime Matrix & Business Cycle Clock')).toBeDefined();
    expect(screen.getByText(/Quadrant 1: Goldilocks/i)).toBeDefined();
    expect(screen.getByText(/Quadrant 2: Reflation/i)).toBeDefined();
    expect(screen.getByText(/Quadrant 3: Stagflation/i)).toBeDefined();
    expect(screen.getByText(/Quadrant 4: Deflation/i)).toBeDefined();
    expect(screen.getAllByText(/Inflation Accelerating/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Growth Expanding/i).length).toBeGreaterThan(0);
  });

  it('renders country pills for USA, EUR, CHN, JPN, IND', () => {
    render(<MacroRegimeClock />);

    expect(screen.getAllByText('USA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('EUR').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CHN').length).toBeGreaterThan(0);
    expect(screen.getAllByText('JPN').length).toBeGreaterThan(0);
    expect(screen.getAllByText('IND').length).toBeGreaterThan(0);
  });

  it('updates selected country detail when clicking an economy pill', () => {
    render(<MacroRegimeClock />);

    const jpnPill = screen.getAllByRole('button', { name: /JPN/i })[0];
    fireEvent.click(jpnPill);

    expect(screen.getByText('Japan Macro Posture')).toBeDefined();
    expect(screen.getByText(/Virtuous Wage-Price Cycle/i)).toBeDefined();
  });

  it('toggles historical trail visualization', () => {
    render(<MacroRegimeClock />);

    const trailBtn = screen.getByRole('button', { name: /Trail On/i });
    expect(trailBtn).toBeDefined();

    fireEvent.click(trailBtn);
    expect(screen.getByRole('button', { name: /Trail Off/i })).toBeDefined();
  });

  it('updates asset class playbook when clicking a quadrant panel', () => {
    render(<MacroRegimeClock />);

    // Click Stagflation panel
    const stagflationPanel = screen.getByText(/Quadrant 3: Stagflation/i);
    fireEvent.click(stagflationPanel);

    expect(screen.getByText(/Stagflation \/ Supply Crunch Playbook/i)).toBeDefined();
    expect(screen.getByText(/Physical Gold & Bullion/i)).toBeDefined();
  });
});
