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
      <body className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
        <AppProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-[#1e2433] bg-[#0c0e14] py-8 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-300">MacroMonitor</span> — Modern Financial Transparency
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Synthesizing authoritative data from UBS Global Wealth Reports, World Bank Open Data, and IMF WEO.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span>Updated for 2026</span>
                <span>Minimalist Institutional Grade</span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
