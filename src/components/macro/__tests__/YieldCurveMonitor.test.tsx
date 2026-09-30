import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { YieldCurveMonitor } from '../YieldCurveMonitor';

describe('YieldCurveMonitor Component', () => {
  it('renders header, title, and initial KPI indicators', () => {
    render(<YieldCurveMonitor />);

    expect(screen.getByText('Sovereign Yield Curve & Inversion Monitor')).toBeDefined();
    expect(screen.getByText('10Y – 2Y Spread')).toBeDefined();
    expect(screen.getByText('10Y – 3M Spread')).toBeDefined();
    expect(screen.getByText('12M Recession Odds (NY Fed)')).toBeDefined();
    expect(screen.getByText('10Y Real vs Breakeven')).toBeDefined();
  });

  it('renders sovereign selection buttons for USA, DEU, JPN, GBR', () => {
    render(<YieldCurveMonitor />);

    expect(screen.getByRole('button', { name: /USA/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /DEU/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /JPN/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /GBR/i })).toBeDefined();
  });

  it('updates summary context when switching sovereign issuer', () => {
    render(<YieldCurveMonitor />);

    // Click JPN button
    const jpnBtn = screen.getByRole('button', { name: /JPN/i });
    fireEvent.click(jpnBtn);

    expect(screen.getByText(/Japanese Government Bond/i)).toBeDefined();
    expect(screen.getByText(/Yield Curve Control/i)).toBeDefined();
  });

  it('allows toggling between Term Structure and Historical Spreads views', () => {
    render(<YieldCurveMonitor />);

    const historicalTab = screen.getByRole('button', { name: /1980–2026 Spreads/i });
    fireEvent.click(historicalTab);

    // Should still display spread references
    expect(screen.getAllByText('10Y – 2Y Spread').length).toBeGreaterThan(0);

    const termTab = screen.getByRole('button', { name: /Term Structure/i });
    fireEvent.click(termTab);
    expect(screen.getAllByText('10Y – 2Y Spread').length).toBeGreaterThan(0);
  });
});
