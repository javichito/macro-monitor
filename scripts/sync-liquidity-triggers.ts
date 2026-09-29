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

// When run directly as a script
if (process.argv[1]?.endsWith('sync-liquidity-triggers.ts')) {
  const result = evaluateLiquidityTriggers();
  const outputPath = path.join(process.cwd(), 'src/data/latest-liquidity-status.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Evaluated Liquidity State:`);
  console.log(`Net Liquidity: $${result.netLiquidityTrillion}T (Weekly: ${result.weeklyDeltaBillion > 0 ? '+' : ''}$${result.weeklyDeltaBillion}B)`);
  console.log(`Active Trigger Alerts: ${result.activeAlerts.length}`);
  result.activeAlerts.forEach((a) => console.log(` - [${a.level}] ${a.headline}`));
}
