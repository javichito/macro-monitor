import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LiquidityAlertsCenter } from '../LiquidityAlertsCenter';

vi.mock('../../../lib/push-notifications', async () => {
  const actual = await vi.importActual<any>('../../../lib/push-notifications');
  return {
    ...actual,
    triggerNativeAlert: vi.fn().mockResolvedValue(true),
    requestPushPermission: vi.fn().mockResolvedValue('granted'),
    getNotificationPermissionStatus: vi.fn().mockReturnValue('granted'),
  };
});

/*
 * Unit tests for the LiquidityAlertsCenter component,
 * verifying that the PWA push status, threshold sliders,
 * simulated scenarios, and test alerts function reliably.
 */
describe('LiquidityAlertsCenter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the alert center header, push status, and institutional trigger cards', () => {
    render(<LiquidityAlertsCenter />);

    expect(screen.getByText(/Live Liquidity Alert Center/i)).toBeDefined();
    expect(screen.getByText(/PWA Push Status/i)).toBeDefined();
    expect(screen.getByText('Net Liquidity Inflection Milestone')).toBeDefined();
    expect(screen.getByText('Reverse Repo Exhaustion Floor')).toBeDefined();
    expect(screen.getByText('Weekly Impulse Momentum Alert')).toBeDefined();
    expect(screen.getByText('Thursday H.4.1 Fed Release Bell')).toBeDefined();
  });

  it('renders all 4 real-world macro trigger simulation scenarios', () => {
    render(<LiquidityAlertsCenter />);

    expect(screen.getByText('Reverse Repo Cushion Depletion')).toBeDefined();
    expect(screen.getByText('Net Liquidity Expansion Impulse')).toBeDefined();
    expect(screen.getByText('Treasury Tax Collection Vacuum')).toBeDefined();
    expect(screen.getByText('Weekly Fed H.4.1 Balance Sheet Release')).toBeDefined();
  });

  it('updates threshold sliders when adjusted by the user', () => {
    render(<LiquidityAlertsCenter />);

    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThanOrEqual(3);

    // Change the Net Liquidity milestone slider
    const netLiqSlider = sliders[0];
    fireEvent.change(netLiqSlider, { target: { value: '5.90' } });
    expect(screen.getByText('$5.90 Trillion')).toBeDefined();
  });

  it('dispatches simulated scenario and records it in recent activity feed', async () => {
    render(<LiquidityAlertsCenter />);

    const surgeBtn = screen.getByText('Net Liquidity Expansion Impulse').closest('button');
    expect(surgeBtn).toBeDefined();

    if (surgeBtn) {
      fireEvent.click(surgeBtn);
    }

    await waitFor(() => {
      expect(screen.getByText(/Dispatched: Net Liquidity Expansion Impulse/i)).toBeDefined();
    });
  });
});
