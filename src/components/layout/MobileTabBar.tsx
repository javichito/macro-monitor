'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe2, TrendingUp, Layers, MapPin, BarChart3 } from 'lucide-react';

/*
 * Apple Human Interface Guidelines specify bottom tab bars for primary mobile navigation,
 * placing high-frequency destination switching within comfortable one-handed thumb reach.
 * We render this component exclusively on viewports below standard desktop breakpoint (< md).
 */
export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Overview', icon: Globe2 },
    { href: '/wealth', label: 'Wealth', icon: TrendingUp },
    { href: '/assets', label: 'Assets', icon: Layers },
    { href: '/geography', label: 'Geography', icon: MapPin },
    { href: '/macro', label: 'Macro', icon: BarChart3 },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#06080e]/85 backdrop-blur-2xl transition-colors duration-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 active:scale-90 min-w-[56px] ${
                isActive
                  ? 'text-sky-500 dark:text-sky-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`relative flex items-center justify-center p-1 rounded-full transition-colors ${
                  isActive ? 'bg-sky-500/10 dark:bg-sky-400/15' : ''
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
