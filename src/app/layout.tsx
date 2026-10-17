import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { MobileTabBar } from '../components/layout/MobileTabBar';
import { InstallPrompt } from '../components/layout/InstallPrompt';
import { ServiceWorkerRegister } from '../components/layout/ServiceWorkerRegister';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
};

export const metadata: Metadata = {
  title: 'MacroMonitor — Interactive Field Guide to the World Economy',
  description:
    'An interactive economic laboratory for curious minds: test your intuition on global wealth, asset cycles, and central bank plumbing.',
  manifest: '/macro-monitor/manifest.json',
  icons: {
    icon: '/macro-monitor/icon.svg',
    apple: '/macro-monitor/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MacroMonitor',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/*
         * Next.js beforeInteractive strategy executes synchronously prior to first-party scripts
         * to eliminate dark/light theme flash of unstyled content while complying with React 19 script hoisting.
         */}
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('macro_theme');
                  var isDark = stored === 'dark' || (!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = isDark ? 'dark' : 'light';
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-amber-500/30 selection:text-amber-200 antialiased relative safe-top safe-bottom transition-colors duration-200">
        <AppProvider>
          <ServiceWorkerRegister />
          <Header />
          <main className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-9 pb-24 md:pb-12">
            {children}
          </main>
          <InstallPrompt />
          <MobileTabBar />
          <footer className="relative border-t border-white/[0.09] bg-[#090d16]/70 backdrop-blur-xl py-8 text-xs text-slate-400 mb-16 md:mb-0 pb-12 sm:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-editorial text-base font-bold text-white tracking-tight">MacroMonitor</span>{' '}
                <span className="text-slate-400">— Interactive Economic Field Guide</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Built on open empirical series from the UBS Global Wealth Report, Federal Reserve (FRED), World Bank, and BIS.
                </p>
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-mono-tabular text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                  Edition: 1980–2026
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 font-semibold">
                  Learn by Experimenting
                </span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
