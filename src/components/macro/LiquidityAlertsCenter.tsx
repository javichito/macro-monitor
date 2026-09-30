'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Zap,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Smartphone,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';
import { CURRENT_US_NET_LIQUIDITY } from '../../data/central-bank-liquidity-data';
import {
  AlertPreferences,
  DEFAULT_ALERT_PREFERENCES,
  getStoredAlertPreferences,
  saveStoredAlertPreferences,
  getNotificationPermissionStatus,
  requestPushPermission,
  triggerNativeAlert,
  SIMULATED_SCENARIOS,
  LiquidityScenario,
} from '../../lib/push-notifications';

interface AlertLogEntry {
  id: string;
  timestamp: string;
  scenario: LiquidityScenario;
}

export function LiquidityAlertsCenter() {
  const [preferences, setPreferences] = useState<AlertPreferences>(DEFAULT_ALERT_PREFERENCES);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<LiquidityScenario>(SIMULATED_SCENARIOS[0]);
  const [alertLogs, setAlertLogs] = useState<AlertLogEntry[]>([
    {
      id: 'init-1',
      timestamp: 'Today, 16:30 ET',
      scenario: SIMULATED_SCENARIOS[1], // Surge
    },
    {
      id: 'init-2',
      timestamp: 'Yesterday, 13:15 ET',
      scenario: SIMULATED_SCENARIOS[0], // RRP Drain
    },
  ]);

  useEffect(() => {
    setPreferences(getStoredAlertPreferences());
    setPermission(getNotificationPermissionStatus());
  }, []);

  const handleTogglePush = async () => {
    if (permission !== 'granted') {
      const result = await requestPushPermission();
      setPermission(result);
      if (result === 'granted') {
        const updated = { ...preferences, pushEnabled: true };
        setPreferences(updated);
        saveStoredAlertPreferences(updated);
        triggerNativeAlert(
          '🔔 MacroMonitor Alerts Active',
          'Alerts are configured! You will receive notifications when major liquidity thresholds are breached.',
          'welcome-alert'
        );
      }
    } else {
      const updated = { ...preferences, pushEnabled: !preferences.pushEnabled };
      setPreferences(updated);
      saveStoredAlertPreferences(updated);
    }
  };

  const updatePreference = <K extends keyof AlertPreferences>(key: K, value: AlertPreferences[K]) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    saveStoredAlertPreferences(updated);
  };

  const handleTestAlert = async () => {
    const rrpBillion = Math.round(CURRENT_US_NET_LIQUIDITY.reverseRepoTrillion * 1000);
    const success = await triggerNativeAlert(
      '⚡ MacroMonitor Test Alert',
      `Fed Net Liquidity is currently $${CURRENT_US_NET_LIQUIDITY.usNetLiquidityTrillion}T with $${rrpBillion}B in Reverse Repo buffer.`,
      'test-alert'
    );

    if (success) {
      setTestStatus('Notification dispatched to your device!');
      setTimeout(() => setTestStatus(null), 4000);
    } else {
      setTestStatus('Notification permission required or blocked.');
      setTimeout(() => setTestStatus(null), 4000);
    }
  };

  const handleSimulateScenario = async (scenario: LiquidityScenario) => {
    setSelectedScenario(scenario);

    // Fire native alert
    await triggerNativeAlert(
      scenario.headline,
      scenario.body,
      scenario.tag
    );

    // Append to live feed
    const newEntry: AlertLogEntry = {
      id: `sim-${Date.now()}`,
      timestamp: 'Just now',
      scenario,
    };
    setAlertLogs((prev) => [newEntry, ...prev.slice(0, 4)]);

    setTestStatus(`Dispatched: ${scenario.name}`);
    setTimeout(() => setTestStatus(null), 4000);
  };

  const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');

  return (
    <section
      id="liquidity-alerts-center"
      className="apple-card p-4 sm:p-6 transition-all duration-200 border-slate-200 dark:border-white/[0.08] shadow-xl"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-400 mb-2">
            <BellRing className="h-3.5 w-3.5 animate-pulse" />
            <span>Real-Time Alerts</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Live Liquidity Alert Center &amp; Fed Triggers
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Receive instant notifications on your phone or computer whenever Federal Reserve Net Liquidity, Reverse Repo cash buffers, or Treasury withdrawals cross key inflection points.
          </p>
        </div>

        {/* Global Push Master Toggle */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] p-2.5 rounded-2xl shrink-0">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Alert Status
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {permission === 'granted' && preferences.pushEnabled
                ? 'Active on this device'
                : permission === 'granted'
                ? 'Paused'
                : permission === 'denied'
                ? 'Blocked in Safari/OS'
                : 'Not Yet Enabled'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleTogglePush}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
              permission === 'granted' && preferences.pushEnabled
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                : 'bg-sky-500 hover:bg-sky-400 text-black'
            }`}
          >
            {permission === 'granted' && preferences.pushEnabled ? (
              <>
                <Bell className="h-3.5 w-3.5" />
                Enabled
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                Enable Alerts
              </>
            )}
          </button>
        </div>
      </div>

      {/* iOS Safari Guidance Note */}
      {permission !== 'granted' && (
        <div className="mt-4 p-3 rounded-xl bg-sky-500/10 border border-sky-400/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <Smartphone className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Lock-Screen Alerts on iPhone &amp; iPad:</strong> To receive notifications on iOS, add MacroMonitor to your Home Screen: tap <em>Share → Add to Home Screen</em>, then open the app.
          </div>
        </div>
      )}

      {/* Trigger Threshold Matrix (4 Institutional Rules) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trigger 1: Fed Net Liquidity Milestone */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-sky-400" />
              Net Liquidity Inflection Milestone
            </span>
            <input
              type="checkbox"
              checked={preferences.netLiquidityInflection}
              onChange={(e) => updatePreference('netLiquidityInflection', e.target.checked)}
              className="accent-sky-500 h-4 w-4 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Alerts when aggregate Fed Net Liquidity crosses your selected macro milestone.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Target Trigger:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              ${preferences.netLiquidityTargetTrillion.toFixed(2)} Trillion
            </span>
          </div>
          <input
            type="range"
            min="5.00"
            max="6.50"
            step="0.05"
            value={preferences.netLiquidityTargetTrillion}
            onChange={(e) => updatePreference('netLiquidityTargetTrillion', parseFloat(e.target.value))}
            className="w-full mt-2 accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-500 font-mono mt-0.5">
            <span>$5.00T</span>
            <span>Current: ${CURRENT_US_NET_LIQUIDITY.usNetLiquidityTrillion}T</span>
            <span>$6.50T</span>
          </div>
        </div>

        {/* Trigger 2: Overnight Reverse Repo (ON RRP) Cushion Floor */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              Reverse Repo Exhaustion Floor
            </span>
            <input
              type="checkbox"
              checked={preferences.rrpDrainAlert}
              onChange={(e) => updatePreference('rrpDrainAlert', e.target.checked)}
              className="accent-sky-500 h-4 w-4 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Warns when the RRP cash cushion drains below threshold, shifting issuance drain to bank reserves.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Floor Trigger:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              ${preferences.rrpDrainFloorBillion} Billion
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={preferences.rrpDrainFloorBillion}
            onChange={(e) => updatePreference('rrpDrainFloorBillion', parseInt(e.target.value, 10))}
            className="w-full mt-2 accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-500 font-mono mt-0.5">
            <span>$50B</span>
            <span>Current: ${Math.round(CURRENT_US_NET_LIQUIDITY.reverseRepoTrillion * 1000)}B</span>
            <span>$300B</span>
          </div>
        </div>

        {/* Trigger 3: 7-Day Net Liquidity Impulse Trigger */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
              Weekly Impulse Momentum Alert
            </span>
            <input
              type="checkbox"
              checked={preferences.weeklyImpulseAlert}
              onChange={(e) => updatePreference('weeklyImpulseAlert', e.target.checked)}
              className="accent-sky-500 h-4 w-4 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Triggers when 7-day net liquidity change expands or contracts faster than normal baseline.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Impulse Sensitivity:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              &gt; ${preferences.weeklyImpulseThresholdBillion}B / week
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={preferences.weeklyImpulseThresholdBillion}
            onChange={(e) => updatePreference('weeklyImpulseThresholdBillion', parseInt(e.target.value, 10))}
            className="w-full mt-2 accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-500 font-mono mt-0.5">
            <span>$20B</span>
            <span>Recommended: $50B</span>
            <span>$100B</span>
          </div>
        </div>

        {/* Trigger 4: Thursday Fed H.4.1 Release Bell */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-purple-400" />
              Thursday H.4.1 Fed Release Bell
            </span>
            <input
              type="checkbox"
              checked={preferences.thursdayReleaseAlert}
              onChange={(e) => updatePreference('thursdayReleaseAlert', e.target.checked)}
              className="accent-purple-500 h-4 w-4 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Sends an alert at 4:30 PM ET every Thursday the moment the Federal Reserve publishes its weekly balance sheet.
          </p>
          <div className="mt-4 p-2 rounded-lg bg-purple-500/10 border border-purple-400/20 text-[11px] text-purple-700 dark:text-purple-300 font-medium">
            Release cadence: Every Thursday ~16:30 ET · Series WALCL
          </div>
        </div>
      </div>

      {/* Interactive Simulation & Test Section */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400" />
              Live Alert Simulator &amp; Device Test
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Test push delivery on this device or trigger real-world macro liquidity scenarios.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleTestAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 dark:bg-white/[0.08] hover:bg-slate-300 dark:hover:bg-white/[0.14] text-slate-800 dark:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Bell className="h-3.5 w-3.5 text-sky-400" />
              Send Instant Test Alert
            </button>
          </div>
        </div>

        {testStatus && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{testStatus}</span>
          </div>
        )}

        {/* Scenario Selection Pills */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SIMULATED_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSimulateScenario(sc)}
              className="p-3 text-left rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] hover:border-sky-400/40 hover:bg-sky-500/[0.04] transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                  {sc.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    sc.riskAssetImpact === 'Bullish'
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : sc.riskAssetImpact === 'Bearish'
                      ? 'text-rose-500 bg-rose-500/10'
                      : 'text-slate-400 bg-slate-500/10'
                  }`}
                >
                  {sc.riskAssetImpact}
                </span>
              </div>
              <h5 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                {sc.name}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-snug">
                {sc.headline}
              </p>
              <div className="mt-2 text-[10px] font-semibold text-sky-500 dark:text-sky-400 flex items-center gap-1">
                <Play className="h-2.5 w-2.5 fill-current" />
                Simulate Notification
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Dispatched Alert History Log */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.08]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5" />
          Recent Liquidity Trigger Activity Log
        </h4>

        <div className="space-y-2">
          {alertLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.015] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                    log.scenario.riskAssetImpact === 'Bullish'
                      ? 'bg-emerald-400 animate-pulse'
                      : log.scenario.riskAssetImpact === 'Bearish'
                      ? 'bg-rose-400'
                      : 'bg-purple-400'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {log.scenario.headline}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {log.scenario.body}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
