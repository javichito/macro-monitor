/*
 * PWA Push Notification & Liquidity Trigger Management Library
 *
 * Interfaces with the Service Worker registration and W3C Push/Notification APIs
 * to register user triggers, evaluate threshold conditions, and dispatch system alerts.
 */

import latestLiquidityBaseline from '../data/latest-liquidity-status.json';

export interface AlertPreferences {
  pushEnabled: boolean;
  netLiquidityInflection: boolean;
  netLiquidityTargetTrillion: number; // e.g. 5.75
  rrpDrainAlert: boolean;
  rrpDrainFloorBillion: number; // e.g. 150
  weeklyImpulseAlert: boolean;
  weeklyImpulseThresholdBillion: number; // e.g. 50
  thursdayReleaseAlert: boolean;
  dispatchedAlertKeys?: string[];
  lastCheckedTimestamp?: string;
  lastAlertFired?: {
    id: string;
    timestamp: string;
    title: string;
    body: string;
    type: 'impulse' | 'drain' | 'inflection' | 'schedule';
  };
}

export interface EvaluatedLiquiditySnapshot {
  timestamp: string;
  fedAssetsBillion: number;
  tgaBillion: number;
  reverseRepoBillion: number;
  netLiquidityTrillion: number;
  weeklyDeltaBillion: number;
  triggers: {
    rrpDepleted: boolean;
    rrpBufferLevelBillion: number;
    impulseDirection: 'expansion' | 'contraction' | 'neutral';
    impulseBillion: number;
    inflectionBreached: boolean;
  };
  activeAlerts: Array<{
    id: string;
    level: 'CRITICAL' | 'IMPULSE' | 'SCHEDULED';
    headline: string;
    body: string;
  }>;
}

export interface EvaluatedTriggeredAlert {
  id: string;
  dedupeKey: string;
  timestamp: string;
  title: string;
  body: string;
  type: 'impulse' | 'drain' | 'inflection' | 'schedule';
  riskAssetImpact: 'Bullish' | 'Bearish' | 'Neutral';
  category: 'Bullish Impulse' | 'Reserve Warning' | 'Liquidity Vacuum' | 'Scheduled Data';
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
  dispatchedAlertKeys: [],
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
 * Resolve whether the app is mounted under the GitHub Pages repository subpath (/macro-monitor)
 * or root (/) during local development so static fetches and Service Worker scope always match.
 */
export function resolvePwaBasePath(): string {
  if (typeof window === 'undefined') return '/macro-monitor';
  return window.location.pathname.startsWith('/macro-monitor') ? '/macro-monitor' : '';
}

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
 * Mirror user preferences into the Service Worker via postMessage so background
 * periodicSync wakeups can evaluate user-specific slider thresholds without DOM access.
 */
export async function syncPreferencesWithServiceWorker(prefs: AlertPreferences): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_ALERT_PREFERENCES',
        payload: prefs,
      });
      return;
    }
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg?.active) {
      reg.active.postMessage({
        type: 'SYNC_ALERT_PREFERENCES',
        payload: prefs,
      });
    }
  } catch {
    // Non-fatal if Service Worker is not yet active
  }
}

/*
 * Synchronize updated threshold configurations to persistent browser storage
 * and mirror them to the active Service Worker cache.
 */
export function saveStoredAlertPreferences(prefs: AlertPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    void syncPreferencesWithServiceWorker(prefs);
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
 * Register the Service Worker in the current browsing context and enroll in
 * Web Periodic Background Sync where supported (e.g., installed Android/Desktop PWAs).
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const basePath = resolvePwaBasePath();
    const swUrl = `${basePath}/sw.js`;
    const scope = `${basePath}/`;

    const registration = await navigator.serviceWorker.register(swUrl, {
      scope,
    });

    const anyReg = registration as ServiceWorkerRegistration & {
      periodicSync?: {
        register: (tag: string, options: { minInterval: number }) => Promise<void>;
      };
    };

    if (anyReg.periodicSync) {
      try {
        await anyReg.periodicSync.register('liquidity-alert-sync', {
          minInterval: 6 * 60 * 60 * 1000,
        });
      } catch {
        // Periodic background sync requires user engagement heuristic approval on Chromium
      }
    }

    await syncPreferencesWithServiceWorker(getStoredAlertPreferences());
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
  url?: string
): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;

  if (Notification.permission !== 'granted') {
    const perm = await requestPushPermission();
    if (perm !== 'granted') return false;
  }

  const basePath = resolvePwaBasePath();
  const resolvedUrl = url || `${basePath}/macro#central-bank-liquidity-radar`;
  const iconUrl = `${basePath}/icon.svg`;

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
          icon: iconUrl,
          badge: iconUrl,
          tag,
          renotify: true,
          vibrate: [200, 100, 200],
          data: { url: resolvedUrl },
          actions: [
            { action: 'open_radar', title: 'Open Radar' },
            { action: 'dismiss', title: 'Dismiss' },
          ],
        } as any);
        return true;
      }
    }

    new Notification(title, {
      body,
      icon: iconUrl,
      tag,
    });
    return true;
  } catch (err) {
    console.error('Failed to trigger native notification:', err);
    return false;
  }
}

/*
 * Pure evaluation engine comparing a daily Fed liquidity snapshot against the user's
 * personal slider thresholds so each device only fires alerts relevant to its rules.
 */
export function evaluateUserThresholdsAgainstStatus(
  status: EvaluatedLiquiditySnapshot,
  prefs: AlertPreferences
): EvaluatedTriggeredAlert[] {
  const dateKey = (status.timestamp || new Date().toISOString()).slice(0, 10);
  const triggered: EvaluatedTriggeredAlert[] = [];

  if (prefs.rrpDrainAlert && status.reverseRepoBillion <= prefs.rrpDrainFloorBillion) {
    triggered.push({
      id: 'rrp-floor-breach',
      dedupeKey: `${dateKey}:rrp-floor:${prefs.rrpDrainFloorBillion}`,
      timestamp: status.timestamp,
      title: `⚠️ Reverse Repo Below $${prefs.rrpDrainFloorBillion}B Floor ($${status.reverseRepoBillion}B)`,
      body: `ON RRP stands at $${status.reverseRepoBillion}B (below your $${prefs.rrpDrainFloorBillion}B safety floor). Future Treasury issuance pulls directly from bank reserves.`,
      type: 'drain',
      riskAssetImpact: 'Bearish',
      category: 'Reserve Warning',
    });
  }

  if (
    prefs.weeklyImpulseAlert &&
    Math.abs(status.weeklyDeltaBillion) >= prefs.weeklyImpulseThresholdBillion
  ) {
    const isExpansion = status.weeklyDeltaBillion >= 0;
    const sign = isExpansion ? '+' : '';
    triggered.push({
      id: 'weekly-impulse-trigger',
      dedupeKey: `${dateKey}:weekly-impulse:${prefs.weeklyImpulseThresholdBillion}`,
      timestamp: status.timestamp,
      title: `${isExpansion ? '🚀' : '📉'} Fed Net Liquidity Impulse: ${sign}$${status.weeklyDeltaBillion}B Weekly`,
      body: `Net Liquidity shifted by ${sign}$${status.weeklyDeltaBillion}B over 7 days to $${status.netLiquidityTrillion.toFixed(2)}T, breaching your $${prefs.weeklyImpulseThresholdBillion}B/wk momentum threshold.`,
      type: 'impulse',
      riskAssetImpact: isExpansion ? 'Bullish' : 'Bearish',
      category: isExpansion ? 'Bullish Impulse' : 'Liquidity Vacuum',
    });
  }

  if (
    prefs.netLiquidityInflection &&
    status.netLiquidityTrillion >= prefs.netLiquidityTargetTrillion
  ) {
    triggered.push({
      id: 'net-liquidity-inflection',
      dedupeKey: `${dateKey}:net-liquidity-target:${prefs.netLiquidityTargetTrillion.toFixed(2)}`,
      timestamp: status.timestamp,
      title: `⚡ Net Liquidity Crossed $${prefs.netLiquidityTargetTrillion.toFixed(2)}T Milestone`,
      body: `Aggregate Fed Net Liquidity reached $${status.netLiquidityTrillion.toFixed(2)}T (Fed Assets $${(status.fedAssetsBillion / 1000).toFixed(2)}T − TGA $${status.tgaBillion}B − ON RRP $${status.reverseRepoBillion}B).`,
      type: 'inflection',
      riskAssetImpact: 'Bullish',
      category: 'Bullish Impulse',
    });
  }

  const parsedDate = new Date(status.timestamp);
  const isThursday = !Number.isNaN(parsedDate.getTime()) && parsedDate.getUTCDay() === 4;
  if (prefs.thursdayReleaseAlert && isThursday) {
    triggered.push({
      id: 'thursday-h41-release',
      dedupeKey: `${dateKey}:thursday-h41`,
      timestamp: status.timestamp,
      title: `🏛️ Fed H.4.1 Weekly Release: Assets at $${(status.fedAssetsBillion / 1000).toFixed(2)}T`,
      body: `Weekly Federal Reserve balance sheet published. Net Liquidity stands at $${status.netLiquidityTrillion.toFixed(2)}T with $${status.reverseRepoBillion}B in ON RRP.`,
      type: 'schedule',
      riskAssetImpact: 'Neutral',
      category: 'Scheduled Data',
    });
  }

  return triggered;
}

/*
 * Fetch the newest daily liquidity status JSON published by GitHub Actions to GitHub Pages,
 * falling back to the build-time snapshot when offline or inside test environments.
 */
export async function fetchLatestLiquidityStatus(): Promise<EvaluatedLiquiditySnapshot> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return latestLiquidityBaseline as EvaluatedLiquiditySnapshot;
  }

  try {
    const basePath = resolvePwaBasePath();
    const res = await fetch(`${basePath}/latest-liquidity-status.json`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = (await res.json()) as EvaluatedLiquiditySnapshot;
      if (json && typeof json.netLiquidityTrillion === 'number') {
        return json;
      }
    }
  } catch {
    // Offline or local test environment: degrade gracefully to bundled baseline
  }

  return latestLiquidityBaseline as EvaluatedLiquiditySnapshot;
}

/*
 * End-to-end zero-backend evaluator: fetches the latest static liquidity status,
 * compares against the user's saved thresholds in localStorage, deduplicates by date+rule,
 * and fires native OS notifications on PWA launch, resume, or threshold adjustment.
 */
export async function checkAndDispatchScheduledAlerts(options?: {
  force?: boolean;
}): Promise<{
  status: EvaluatedLiquiditySnapshot;
  triggered: EvaluatedTriggeredAlert[];
  newlyDispatched: EvaluatedTriggeredAlert[];
}> {
  const prefs = getStoredAlertPreferences();
  const status = await fetchLatestLiquidityStatus();
  const triggered = evaluateUserThresholdsAgainstStatus(status, prefs);

  const alreadyDispatched = new Set(prefs.dispatchedAlertKeys ?? []);
  const newlyDispatched: EvaluatedTriggeredAlert[] = [];

  if (prefs.pushEnabled && getNotificationPermissionStatus() === 'granted') {
    const candidates = options?.force
      ? triggered
      : triggered.filter((item) => !alreadyDispatched.has(item.dedupeKey));

    if (candidates.length > 0) {
      const primary = candidates[0];
      const extraCount = candidates.length - 1;
      const title =
        extraCount > 0 ? `${primary.title} (+${extraCount} more)` : primary.title;
      const body =
        extraCount > 0
          ? `${primary.body} (${candidates.length} liquidity triggers active today)`
          : primary.body;

      const sent = await triggerNativeAlert(title, body, primary.id);
      if (sent) {
        for (const item of candidates) {
          alreadyDispatched.add(item.dedupeKey);
          newlyDispatched.push(item);
        }
      }
    }
  }

  const updatedPrefs: AlertPreferences = {
    ...prefs,
    lastCheckedTimestamp: new Date().toISOString(),
    dispatchedAlertKeys: Array.from(alreadyDispatched).slice(-50),
    lastAlertFired:
      newlyDispatched.length > 0
        ? {
            id: newlyDispatched[0].id,
            timestamp: newlyDispatched[0].timestamp,
            title: newlyDispatched[0].title,
            body: newlyDispatched[0].body,
            type: newlyDispatched[0].type,
          }
        : prefs.lastAlertFired,
  };

  saveStoredAlertPreferences(updatedPrefs);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('macro-liquidity-alerts-updated', {
        detail: { status, triggered, newlyDispatched },
      })
    );
  }

  return { status, triggered, newlyDispatched };
}

