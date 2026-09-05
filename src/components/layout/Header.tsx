'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe2, TrendingUp, Layers, MapPin, BarChart3, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CurrencyPerspective } from '../../lib/types';

export function Header() {
  const pathname = usePathname();
  const { currencyPerspective, setCurrencyPerspective } = useApp();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Globe2 },
    { href: '/wealth', label: 'Wealth & Inequality', icon: TrendingUp },
    { href: '/assets', label: 'Asset Classes', icon: Layers },
    { href: '/geography', label: 'Geographies', icon: MapPin },
    { href: '/macro', label: 'Macro Trends', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#242b3d] bg-[#090a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:border-emerald-500/60 transition-colors">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                MacroMonitor
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Global Wealth & Macroeconomic Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Primary navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Currency Perspective Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#242b3d] bg-[#12151e] p-0.5 text-xs">
            {(['nominal', 'real', 'ppp'] as CurrencyPerspective[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setCurrencyPerspective(mode)}
                title={
                  mode === 'nominal'
                    ? 'Nominal USD: Current unadjusted market values'
                    : mode === 'real'
                    ? 'Real USD: Inflation-adjusted to constant 2025 purchasing power'
                    : 'PPP: Purchasing Power Parity adjusted for local basket costs'
                }
                className={`rounded px-2.5 py-1 font-medium transition-all capitalize ${
                  currencyPerspective === mode
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden overflow-x-auto border-t border-[#1e2433] px-4 py-2 gap-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
