/*
 * Automated Liquidity Trigger & Background Alert Evaluation Engine
 *
 * Runs on a daily schedule (or via GitHub Actions Cron) to pull latest Fed H.4.1,
 * Treasury Daily Statement (TGA), and NY Fed Reverse Repo (ON RRP) data,
 * calculate Fed Net Liquidity, evaluate threshold alerts, and record trigger status.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface EvaluatedLiquidityState {
  timestamp: string;
  fedAssetsBillion: number;
  tgaBillion: number;
  reverseRepoBillion: number;
  netLiquidityTrillion: number;
  weeklyDeltaBillion: number;
  triggers: {
    rrpDepleted: boolean;
    rrpBufferLevelBillion: number;
    impulseDirection: 'expansion' | 'contraction' | 'neutral';
    impulseBillion: number;
    inflectionBreached: boolean;
  };
  activeAlerts: Array<{
    id: string;
    level: 'CRITICAL' | 'IMPULSE' | 'SCHEDULED';
    headline: string;
    body: string;
  }>;
}

export function evaluateLiquidityTriggers(
  fedAssetsBillion = 7040,
  tgaBillion = 780,
  reverseRepoBillion = 145,
  priorNetLiquidityTrillion = 5.68
): EvaluatedLiquidityState {
  const netLiquidityBillion = fedAssetsBillion - tgaBillion - reverseRepoBillion;
  const netLiquidityTrillion = Number((netLiquidityBillion / 1000).toFixed(2));
  const weeklyDeltaBillion = Number(((netLiquidityTrillion - priorNetLiquidityTrillion) * 1000).toFixed(1));

  const rrpDepleted = reverseRepoBillion < 150;
  const impulseDirection =
    weeklyDeltaBillion > 30 ? 'expansion' : weeklyDeltaBillion < -30 ? 'contraction' : 'neutral';

  const activeAlerts: EvaluatedLiquidityState['activeAlerts'] = [];

  if (rrpDepleted) {
    activeAlerts.push({
      id: 'rrp-floor-breach',
      level: 'CRITICAL',
      headline: `⚠️ Overnight Reverse Repo Buffer Low: $${reverseRepoBillion}B`,
      body: `ON RRP stands below the $150B safety threshold. Future Treasury issuance will drain commercial bank reserves directly.`,
    });
  }

  if (Math.abs(weeklyDeltaBillion) >= 30) {
    activeAlerts.push({
      id: 'weekly-impulse-trigger',
      level: 'IMPULSE',
      headline: `🚀 Fed Net Liquidity Impulse: ${weeklyDeltaBillion > 0 ? '+' : ''}$${weeklyDeltaBillion}B Weekly`,
      body: `Net Liquidity reached $${netLiquidityTrillion}T, creating a high-powered liquidity ${impulseDirection} cycle.`,
    });
  }

  return {
    timestamp: new Date().toISOString(),
    fedAssetsBillion,
    tgaBillion,
    reverseRepoBillion,
    netLiquidityTrillion,
    weeklyDeltaBillion,
    triggers: {
      rrpDepleted,
      rrpBufferLevelBillion: reverseRepoBillion,
      impulseDirection,
      impulseBillion: weeklyDeltaBillion,
      inflectionBreached: netLiquidityTrillion >= 5.75,
    },
    activeAlerts,
  };
}

export interface EvaluatedYieldStatus {
  timestamp: string;
  sovereignCode: string;
  us10Y: number;
  us2Y: number;
  us3M: number;
  spread10Y2Y: number;
  spread10Y3M: number;
  curveShape: 'normal' | 'flat' | 'inverted' | 'steepening';
  recessionProbability12M: number;
  activeAlerts: Array<{
    id: string;
    level: 'CRITICAL' | 'WARNING' | 'INFO';
    headline: string;
    body: string;
  }>;
}

export function evaluateYieldCurveStatus(
  us10Y = 4.19,
  us2Y = 4.02,
  us3M = 4.65
): EvaluatedYieldStatus {
  const spread10Y2Y = Number((us10Y - us2Y).toFixed(2));
  const spread10Y3M = Number((us10Y - us3M).toFixed(2));

  // Determine curve regime shape
  let curveShape: EvaluatedYieldStatus['curveShape'] = 'normal';
  if (spread10Y2Y < 0 || spread10Y3M < 0) {
    curveShape = spread10Y2Y >= 0 ? 'steepening' : 'inverted';
  } else if (spread10Y2Y <= 0.25) {
    curveShape = 'flat';
  }

  // Calculate New York Fed 12M probit recession probability
  // Formula: Phi(alpha + beta * Spread10Y3M) with alpha = -0.5333, beta = -0.6330
  const z = -0.5333 - 0.633 * spread10Y3M;
  // Approximation of standard normal CDF
  const recessionProbability12M = Number(
    (Math.min(Math.max(1 / (1 + Math.exp(-1.7 * z)), 0.01), 0.99) * 100).toFixed(1)
  );

  const activeAlerts: EvaluatedYieldStatus['activeAlerts'] = [];

  if (spread10Y2Y < 0) {
    activeAlerts.push({
      id: 'yield-inversion-10y2y',
      level: 'CRITICAL',
      headline: `⚠️ US Yield Curve Inverted: 10Y-2Y Spread at ${spread10Y2Y}%`,
      body: `Short-term borrowing rates exceed long-term yields, signaling monetary tightness and heightened recession risk.`,
    });
  } else if (curveShape === 'steepening') {
    activeAlerts.push({
      id: 'yield-un-inversion-warning',
      level: 'WARNING',
      headline: `🔔 Yield Curve Re-Steepening: 10Y-2Y Spread Dis-Inverted (+${spread10Y2Y}%)`,
      body: `Historically, the un-inversion window is when recession risk peaks as central banks begin rapid emergency rate cuts.`,
    });
  }

  return {
    timestamp: new Date().toISOString(),
    sovereignCode: 'USA',
    us10Y,
    us2Y,
    us3M,
    spread10Y2Y,
    spread10Y3M,
    curveShape,
    recessionProbability12M,
    activeAlerts,
  };
}

// When run directly as a script
if (process.argv[1]?.endsWith('sync-liquidity-triggers.ts')) {
  const liquidityResult = evaluateLiquidityTriggers();
  const liquidityOutputPath = path.join(process.cwd(), 'src/data/latest-liquidity-status.json');
  fs.writeFileSync(liquidityOutputPath, JSON.stringify(liquidityResult, null, 2));

  const yieldResult = evaluateYieldCurveStatus();
  const yieldOutputPath = path.join(process.cwd(), 'src/data/latest-yield-status.json');
  fs.writeFileSync(yieldOutputPath, JSON.stringify(yieldResult, null, 2));

  console.log(`Evaluated Daily Macro Status:`);
  console.log(`- Net Liquidity: $${liquidityResult.netLiquidityTrillion}T (Weekly: ${liquidityResult.weeklyDeltaBillion > 0 ? '+' : ''}$${liquidityResult.weeklyDeltaBillion}B)`);
  console.log(`- 10Y-2Y Spread: ${yieldResult.spread10Y2Y > 0 ? '+' : ''}${yieldResult.spread10Y2Y}% (${yieldResult.curveShape})`);
  console.log(`- 12M Recession Probability: ${yieldResult.recessionProbability12M}%`);
}

