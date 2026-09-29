/*
 * MacroMonitor PWA Service Worker
 *
 * Implements W3C Push and Notification APIs for background delivery of
 * Federal Reserve Net Liquidity triggers, Reverse Repo drain alerts,
 * and weekly H.4.1 balance sheet updates directly to iOS Safari (PWA) and desktop browsers.
 */

self.addEventListener('install', (event) => {
  /*
   * Activate immediately without waiting for existing tabs to close,
   * ensuring users receive push notification capability on first visit.
   */
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  /*
   * Take immediate control of all open client pages within scope.
   */
  event.waitUntil(self.clients.claim());
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
 * Handle direct postMessage calls from client scripts, enabling instant
 * native test notifications and simulated scenario dispatches directly from the PWA UI.
 */
self.addEventListener('message', (event) => {
  if (!event.data) return;

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
