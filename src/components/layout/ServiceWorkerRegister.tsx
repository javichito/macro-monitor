'use client';

import { useEffect } from 'react';
import {
  registerServiceWorker,
  checkAndDispatchScheduledAlerts,
} from '../../lib/push-notifications';

/*
 * Transparent client component mounted at RootLayout level to ensure
 * the Service Worker lifecycle is initialized immediately upon app boot
 * and that zero-backend daily Fed liquidity triggers are evaluated whenever
 * the user launches, resumes, or reconnects the installed PWA.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    void registerServiceWorker().then(() => {
      void checkAndDispatchScheduledAlerts();
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkAndDispatchScheduledAlerts();
      }
    };

    const handleOnline = () => {
      void checkAndDispatchScheduledAlerts();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
}

