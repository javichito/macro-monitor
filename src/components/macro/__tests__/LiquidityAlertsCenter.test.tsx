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
    checkAndDispatchScheduledAlerts: vi.fn().mockResolvedValue({
      status: {
        timestamp: '2026-10-16T23:17:24.597Z',
        fedAssetsBillion: 7040,
        tgaBillion: 780,
        reverseRepoBillion: 145,
        netLiquidityTrillion: 6.12,
        weeklyDeltaBillion: 440,
        triggers: {
          rrpDepleted: true,
          rrpBufferLevelBillion: 145,
          impulseDirection: 'expansion',
          impulseBillion: 440,
          inflectionBreached: true,
        },
        activeAlerts: [],
      },
      triggered: [],
      newlyDispatched: [],
    }),
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
    expect(screen.getByText(/Alert Status/i)).toBeDefined();
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

  it('evaluates live Fed liquidity triggers against user threshold sliders', async () => {
    const {
      evaluateUserThresholdsAgainstStatus,
      DEFAULT_ALERT_PREFERENCES,
    } = await import('../../../lib/push-notifications');

    const triggered = evaluateUserThresholdsAgainstStatus(
      {
        timestamp: '2026-10-15T21:00:00.000Z', // Thursday
        fedAssetsBillion: 7040,
        tgaBillion: 780,
        reverseRepoBillion: 140,
        netLiquidityTrillion: 6.12,
        weeklyDeltaBillion: 85,
        triggers: {
          rrpDepleted: true,
          rrpBufferLevelBillion: 140,
          impulseDirection: 'expansion',
          impulseBillion: 85,
          inflectionBreached: true,
        },
        activeAlerts: [],
      },
      {
        ...DEFAULT_ALERT_PREFERENCES,
        pushEnabled: true,
        netLiquidityTargetTrillion: 5.75,
        rrpDrainFloorBillion: 150,
        weeklyImpulseThresholdBillion: 50,
        thursdayReleaseAlert: true,
      }
    );

    expect(triggered.map((t) => t.id)).toEqual([
      'rrp-floor-breach',
      'weekly-impulse-trigger',
      'net-liquidity-inflection',
      'thursday-h41-release',
    ]);
  });
});

