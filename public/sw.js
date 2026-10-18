/*
 * MacroMonitor PWA Service Worker
 *
 * Implements W3C Push and Notification APIs for background delivery of
 * Federal Reserve Net Liquidity triggers, Reverse Repo drain alerts,
 * and weekly H.4.1 balance sheet updates directly to iOS Safari (PWA) and desktop browsers.
 */

const CACHE_NAME = 'macro-monitor-v1';
const CORE_ASSETS = [
  '/macro-monitor/',
  '/macro-monitor/manifest.json',
  '/macro-monitor/icon.svg',
];

self.addEventListener('install', (event) => {
  /*
   * Activate immediately without waiting for existing tabs to close,
   * pre-caching core shell assets for offline standalone launch.
   */
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('Pre-cache skipped during install:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  /*
   * Take immediate control of all open client pages and prune legacy caches.
   */
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

const PREFS_CACHE_URL = '/__sw_alert_preferences__';

/*
 * Network-first for daily telemetry status JSON files so the PWA never evaluates
 * stale cached thresholds when online, and stale-while-revalidate for static assets.
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/macro-monitor') && url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('-status.json')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (!url.pathname.startsWith('/macro-monitor')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || 'MacroMonitor: Liquidity Alert';
  const options = {
    body: data.body || 'Federal Reserve Net Liquidity experienced a significant inflection.',
    icon: data.icon || '/macro-monitor/icon.svg',
    badge: data.badge || '/macro-monitor/icon.svg',
    tag: data.tag || 'liquidity-trigger',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: data.url || '/macro-monitor/macro#central-bank-liquidity-radar',
      timestamp: Date.now(),
      ...data,
    },
    actions: [
      {
        action: 'open_radar',
        title: 'Open Radar',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl =
    (event.notification.data && event.notification.data.url) ||
    '/macro-monitor/macro#central-bank-liquidity-radar';

  /*
   * Focus an existing open window containing the application, or open
   * a fresh window if none are currently active in the client environment.
   */
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/macro-monitor') && 'focus' in client) {
            if ('navigate' in client && targetUrl) {
              client.navigate(targetUrl);
            }
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

/*
 * Evaluate user threshold preferences inside the Service Worker context during
 * background periodicSync wakeups without requiring an active DOM window.
 */
async function evaluateBackgroundLiquidityAlerts() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const prefsRes = await cache.match(PREFS_CACHE_URL);
    if (!prefsRes) return;

    const prefs = await prefsRes.json();
    if (!prefs || !prefs.pushEnabled) return;

    const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, '');
    const statusUrl = `${scopePath}/latest-liquidity-status.json`;
    const statusRes = await fetch(statusUrl, { cache: 'no-store' });
    if (!statusRes.ok) return;

    const status = await statusRes.json();
    if (!status || typeof status.netLiquidityTrillion !== 'number') return;

    const dateKey = (status.timestamp || new Date().toISOString()).slice(0, 10);
    const dispatchedSet = new Set(Array.isArray(prefs.dispatchedAlertKeys) ? prefs.dispatchedAlertKeys : []);
    const triggered = [];

    if (prefs.rrpDrainAlert && status.reverseRepoBillion <= prefs.rrpDrainFloorBillion) {
      triggered.push({
        id: 'rrp-floor-breach',
        dedupeKey: `${dateKey}:rrp-floor:${prefs.rrpDrainFloorBillion}`,
        title: `⚠️ Reverse Repo Below $${prefs.rrpDrainFloorBillion}B Floor ($${status.reverseRepoBillion}B)`,
        body: `ON RRP stands at $${status.reverseRepoBillion}B (below your $${prefs.rrpDrainFloorBillion}B safety floor). Future Treasury issuance pulls directly from bank reserves.`,
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
        title: `${isExpansion ? '🚀' : '📉'} Fed Net Liquidity Impulse: ${sign}$${status.weeklyDeltaBillion}B Weekly`,
        body: `Net Liquidity shifted by ${sign}$${status.weeklyDeltaBillion}B over 7 days to $${status.netLiquidityTrillion.toFixed(2)}T, breaching your $${prefs.weeklyImpulseThresholdBillion}B/wk momentum threshold.`,
      });
    }

    if (
      prefs.netLiquidityInflection &&
      status.netLiquidityTrillion >= prefs.netLiquidityTargetTrillion
    ) {
      triggered.push({
        id: 'net-liquidity-inflection',
        dedupeKey: `${dateKey}:net-liquidity-target:${Number(prefs.netLiquidityTargetTrillion).toFixed(2)}`,
        title: `⚡ Net Liquidity Crossed $${Number(prefs.netLiquidityTargetTrillion).toFixed(2)}T Milestone`,
        body: `Aggregate Fed Net Liquidity reached $${status.netLiquidityTrillion.toFixed(2)}T (Fed Assets $${(status.fedAssetsBillion / 1000).toFixed(2)}T − TGA $${status.tgaBillion}B − ON RRP $${status.reverseRepoBillion}B).`,
      });
    }

    const candidates = triggered.filter((item) => !dispatchedSet.has(item.dedupeKey));
    if (candidates.length === 0) return;

    const primary = candidates[0];
    for (const item of candidates) {
      dispatchedSet.add(item.dedupeKey);
    }

    const updatedPrefs = {
      ...prefs,
      lastCheckedTimestamp: new Date().toISOString(),
      dispatchedAlertKeys: Array.from(dispatchedSet).slice(-50),
    };
    await cache.put(
      PREFS_CACHE_URL,
      new Response(JSON.stringify(updatedPrefs), {
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const iconUrl = `${scopePath}/icon.svg`;
    const targetUrl = `${scopePath}/macro#central-bank-liquidity-radar`;

    await self.registration.showNotification(primary.title, {
      body: primary.body,
      icon: iconUrl,
      badge: iconUrl,
      tag: primary.id,
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: targetUrl },
      actions: [
        { action: 'open_radar', title: 'Open Radar' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    });
  } catch (err) {
    console.warn('Background liquidity alert evaluation skipped:', err);
  }
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'liquidity-alert-sync') {
    event.waitUntil(evaluateBackgroundLiquidityAlerts());
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'liquidity-alert-sync') {
    event.waitUntil(evaluateBackgroundLiquidityAlerts());
  }
});

/*
 * Handle direct postMessage calls from client scripts, enabling preference cache mirroring,
 * instant native test notifications, and simulated scenario dispatches directly from the PWA UI.
 */
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SYNC_ALERT_PREFERENCES') {
    const prefs = event.data.payload || {};
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) =>
        cache.put(
          PREFS_CACHE_URL,
          new Response(JSON.stringify(prefs), {
            headers: { 'Content-Type': 'application/json' },
          })
        )
      )
    );
    return;
  }

  if (event.data.type === 'TRIGGER_LOCAL_NOTIFICATION') {
    const payload = event.data.payload || {};
    const title = payload.title || 'MacroMonitor Alert';
    const options = {
      body: payload.body || 'Net Liquidity alert fired.',
      icon: payload.icon || '/macro-monitor/icon.svg',
      badge: payload.badge || '/macro-monitor/icon.svg',
      tag: payload.tag || 'liquidity-local-test',
      renotify: true,
      vibrate: [200, 100, 200],
      data: {
        url: payload.url || '/macro-monitor/macro#central-bank-liquidity-radar',
        ...payload,
      },
      actions: [
        { action: 'open_radar', title: 'Open Radar' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };

    self.registration.showNotification(title, options);
  }
});

