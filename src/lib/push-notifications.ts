/*
 * PWA Push Notification & Liquidity Trigger Management Library
 *
 * Interfaces with the Service Worker registration and W3C Push/Notification APIs
 * to register user triggers, evaluate threshold conditions, and dispatch system alerts.
 */

export interface AlertPreferences {
  pushEnabled: boolean;
  netLiquidityInflection: boolean;
  netLiquidityTargetTrillion: number; // e.g. 5.75
  rrpDrainAlert: boolean;
  rrpDrainFloorBillion: number; // e.g. 150
  weeklyImpulseAlert: boolean;
  weeklyImpulseThresholdBillion: number; // e.g. 50
  thursdayReleaseAlert: boolean;
  lastAlertFired?: {
    id: string;
    timestamp: string;
    title: string;
    body: string;
    type: 'impulse' | 'drain' | 'inflection' | 'schedule';
  };
}

export const DEFAULT_ALERT_PREFERENCES: AlertPreferences = {
  pushEnabled: false,
  netLiquidityInflection: true,
  netLiquidityTargetTrillion: 5.75,
  rrpDrainAlert: true,
  rrpDrainFloorBillion: 150,
  weeklyImpulseAlert: true,
  weeklyImpulseThresholdBillion: 50,
  thursdayReleaseAlert: true,
};

export interface LiquidityScenario {
  id: string;
  name: string;
  tag: string;
  category: 'Bullish Impulse' | 'Reserve Warning' | 'Liquidity Vacuum' | 'Scheduled Data';
  headline: string;
  body: string;
  macroContext: string;
  riskAssetImpact: 'Bullish' | 'Bearish' | 'Neutral';
}

export const SIMULATED_SCENARIOS: LiquidityScenario[] = [
  {
    id: 'rrp-drain',
    name: 'Reverse Repo Cushion Depletion',
    tag: 'rrp-drain-alert',
    category: 'Reserve Warning',
    headline: '⚠️ Reverse Repo Drained Below $150B Buffer',
    body: 'Overnight Reverse Repo drained to $94B. The Treasury issuance liquidity buffer is now depleted; future auctions will pull directly from commercial bank reserves.',
    macroContext: 'When ON RRP hits near-zero, subsequent Treasury General Account (TGA) rebuilds withdraw active dollar liquidity directly from the private banking system, tightening financial conditions.',
    riskAssetImpact: 'Bearish',
  },
  {
    id: 'liquidity-surge',
    name: 'Net Liquidity Expansion Impulse',
    tag: 'net-liquidity-expansion',
    category: 'Bullish Impulse',
    headline: '🚀 Fed Net Liquidity Surge: +$84.5B in 7 Days',
    body: 'Fed Net Liquidity expanded to $5.80 Trillion (+1.48% weekly impulse). TGA drawdown and currency expansion are injecting high-powered reserves.',
    macroContext: 'Historically, positive weekly impulses exceeding +$50B in Fed Net Liquidity correlate with a 4-to-8 week upward trajectory in high-beta assets including Bitcoin and the Nasdaq 100.',
    riskAssetImpact: 'Bullish',
  },
  {
    id: 'tga-rebuild',
    name: 'Treasury Tax Collection Vacuum',
    tag: 'tga-vacuum-alert',
    category: 'Liquidity Vacuum',
    headline: '📉 TGA Replenishment: -$72B Reserve Withdrawal',
    body: 'The U.S. Treasury absorbed $72B in corporate quarterly tax payments into the TGA, contracting Net Liquidity to $5.65 Trillion in a single session.',
    macroContext: 'Sudden cash accumulations in the Treasury General Account temporarily remove circulating cash from the interbank market, causing repo rate volatility and short-term liquidity contraction.',
    riskAssetImpact: 'Bearish',
  },
  {
    id: 'thursday-h41',
    name: 'Weekly Fed H.4.1 Balance Sheet Release',
    tag: 'fed-h41-release',
    category: 'Scheduled Data',
    headline: '🏛️ Fed H.4.1 Published: Total Assets at $7.04T',
    body: 'The Federal Reserve balance sheet contracted by -$18B this week under ongoing Quantitative Tightening. System bank reserves stand at $3.24T.',
    macroContext: 'Weekly H.4.1 releases provide the single most authoritative breakdown of Fed loans, discount window usage, and balance sheet run-off pace.',
    riskAssetImpact: 'Neutral',
  },
];

const STORAGE_KEY = 'macro_liquidity_alert_preferences';

/*
 * Retrieve persisted trigger preferences from localStorage,
 * falling back cleanly to institutional defaults on first access.
 */
export function getStoredAlertPreferences(): AlertPreferences {
  if (typeof window === 'undefined') return DEFAULT_ALERT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ALERT_PREFERENCES;
    return { ...DEFAULT_ALERT_PREFERENCES, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_ALERT_PREFERENCES;
  }
}

/*
 * Synchronize updated threshold configurations to persistent browser storage.
 */
export function saveStoredAlertPreferences(prefs: AlertPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save alert preferences:', e);
  }
}

/*
 * Detect whether the user environment supports modern W3C Push & Notification specifications.
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/*
 * Inspect current notification permission status.
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/*
 * Prompt user for native browser / iOS PWA notification permissions.
 */
export async function requestPushPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isPushNotificationSupported()) return 'unsupported';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return Notification.permission;
  }
}

/*
 * Register the Service Worker in the current browsing context.
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    /*
     * We specify the GitHub Pages repository subpath as scope to guarantee
     * that all route navigations within /macro-monitor are controlled by this worker.
     */
    const registration = await navigator.serviceWorker.register('/macro-monitor/sw.js', {
      scope: '/macro-monitor/',
    });
    return registration;
  } catch (err) {
    console.warn('Service Worker registration skipped or failed:', err);
    return null;
  }
}

/*
 * Dispatch an immediate native system notification to test sound, banner rendering,
 * and vibration on the user's phone or desktop device.
 */
export async function triggerNativeAlert(
  title: string,
  body: string,
  tag = 'liquidity-test',
  url = '/macro-monitor/macro#central-bank-liquidity-radar'
): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;

  if (Notification.permission !== 'granted') {
    const perm = await requestPushPermission();
    if (perm !== 'granted') return false;
  }

  /*
   * Prioritize dispatching through ServiceWorkerRegistration, as iOS 16.4+ standalone PWAs
   * require notification presentation to be routed via the active Service Worker.
   */
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, {
          body,
          icon: '/macro-monitor/icon.svg',
          badge: '/macro-monitor/icon.svg',
          tag,
          renotify: true,
          vibrate: [200, 100, 200],
          data: { url },
          actions: [
            { action: 'open_radar', title: 'Open Radar' },
            { action: 'dismiss', title: 'Dismiss' },
          ],
        } as any);
        return true;
      }
    }

    // Direct fallback for standard desktop browser environments
    new Notification(title, {
      body,
      icon: '/macro-monitor/icon.svg',
      tag,
    });
    return true;
  } catch (err) {
    console.error('Failed to trigger native notification:', err);
    return false;
  }
}
