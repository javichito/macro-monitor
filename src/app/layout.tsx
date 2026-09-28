import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { InstallPrompt } from '../components/layout/InstallPrompt';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#05070c' },
  ],
};

export const metadata: Metadata = {
  title: 'MacroMonitor — Global Wealth & Macroeconomic Intelligence',
  description:
    'State-of-the-art web application tracking global wealth distribution, asset classes, geographies, and macroeconomic trends over time.',
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
         * Inline script executes synchronously before browser paints to prevent
         * light/dark flash of unstyled content (FOUC) on cold starts.
         */}
        <script
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
      <body className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-sky-500/30 selection:text-sky-200 antialiased relative safe-top safe-bottom transition-colors duration-200">
        {/* Apple subtle ambient top glow */}
        <div className="ambient-glow fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-300">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-[120px] rounded-full" />
        </div>

        <AppProvider>
          <Header />
          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-8">
            {children}
          </main>
          <InstallPrompt />
          <footer className="relative z-10 border-t border-white/[0.08] bg-black/40 backdrop-blur-xl py-8 text-xs text-slate-400 pb-12 sm:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-semibold text-white tracking-tight">MacroMonitor</span> — Modern Financial Transparency
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Synthesizing authoritative data from UBS Global Wealth Reports, World Bank Open Data, and IMF WEO.
                </p>
              </div>
              <div className="flex items-center gap-6 text-slate-400">
                <span>Updated for 2026</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Institutional Grade
                </span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
