'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '../../lib/push-notifications';

/*
 * Transparent client component mounted at RootLayout level to ensure
 * the Service Worker lifecycle is initialized immediately upon app boot,
 * preparing the PWA to receive push events and handle offline caching.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
