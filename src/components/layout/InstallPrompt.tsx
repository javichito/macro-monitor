'use client';

import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Smartphone } from 'lucide-react';

/*
 * PWA Install Banner Component
 *
 * iOS Safari does not support automated JavaScript triggers (like window.prompt())
 * for "Add to Home Screen". Apple requires users to initiate the action via the
 * native Safari Share sheet.
 *
 * This component detects if the user is on an iOS device (iPhone/iPad) in browser mode
 * (not standalone), and presents a native-styled Apple bottom prompt with step-by-step guidance.
 * On Chromium/Android browsers, it intercepts the `beforeinstallprompt` event and triggers
 * the native prompt on tap.
 */

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if the user already dismissed the prompt in this session or previously
    const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (hasDismissed) return;

    // Detect if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Detect iOS devices (iPhone, iPod, iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(userAgent);

    if (isAppleMobile) {
      setIsIOS(true);
      // Small timeout so the page loads smoothly before showing the prompt
      const timer = setTimeout(() => setShowPrompt(true), 1200);
      return () => clearTimeout(timer);
    }

    // Android / Chrome beforeinstallprompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm mx-auto sm:mx-0 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="apple-card p-4.5 bg-[#0e121b]/95 border-white/[0.16] shadow-2xl backdrop-blur-2xl rounded-2xl relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors"
          aria-label="Dismiss installation prompt"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-sky-400/20 to-sky-600/10 border border-sky-400/30 text-sky-400 shadow-sm mt-0.5">
            <Smartphone className="h-5 w-5" />
          </div>

          <div className="pr-4">
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Install MacroMonitor
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Install as an iPhone app for a fullscreen, offline-ready experience.
            </p>

            {isIOS ? (
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-300 bg-white/[0.04] border border-white/[0.08] p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">
                    1
                  </span>
                  <span>
                    Tap the <strong className="text-white">Share</strong> icon{' '}
                    <Share className="inline h-3.5 w-3.5 text-sky-400 -mt-0.5" /> in Safari
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">
                    2
                  </span>
                  <span>
                    Select <strong className="text-white">Add to Home Screen</strong>{' '}
                    <PlusSquare className="inline h-3.5 w-3.5 text-sky-400 -mt-0.5" />
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="mt-3 w-full py-1.5 px-3 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Install App
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
