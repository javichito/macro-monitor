import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/layout/Header';

export const metadata: Metadata = {
  title: 'MacroMonitor — Global Wealth & Macroeconomic Intelligence',
  description:
    'State-of-the-art web application tracking global wealth distribution, asset classes, geographies, and macroeconomic trends over time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200 antialiased relative">
        {/* Apple subtle ambient top glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-[120px] rounded-full" />
        </div>

        <AppProvider>
          <Header />
          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <footer className="relative z-10 border-t border-white/[0.08] bg-black/40 backdrop-blur-xl py-8 text-xs text-slate-400">
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
