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

/*
 * Fetches the two most recent numeric observations for a FRED series so we can compute
 * both current levels and weekly deltas without requiring external infrastructure.
 * Uses the authenticated JSON endpoint when FRED_API_KEY is present, and falls back to
 * the unauthenticated public FRED graph CSV endpoint before gracefully degrading to baseline.
 */
async function fetchFredRecentObservations(
  seriesId: string,
  apiKey?: string
): Promise<{ latest: number; prior: number } | null> {
  if (apiKey) {
    const jsonUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=5`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(jsonUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        const numericValues = (data?.observations ?? [])
          .map((obs: { value: string }) => parseFloat(obs.value))
          .filter((v: number) => Number.isFinite(v));
        if (numericValues.length >= 2) {
          return { latest: numericValues[0], prior: numericValues[1] };
        }
        if (numericValues.length === 1) {
          return { latest: numericValues[0], prior: numericValues[0] };
        }
      }
    } catch (err: any) {
      console.warn(`[Liquidity Sync] FRED JSON request skipped for ${seriesId} (${err.message}).`);
    }
  }

  const csvUrl = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(csvUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const text = await res.text();
    const lines = text.trim().split('\n').slice(1);
    const numericValues: number[] = [];
    for (let i = Math.max(0, lines.length - 15); i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 2) {
        const val = parseFloat(parts[1]);
        if (Number.isFinite(val)) {
          numericValues.push(val);
        }
      }
    }
    if (numericValues.length >= 2) {
      return {
        latest: numericValues[numericValues.length - 1],
        prior: numericValues[numericValues.length - 2],
      };
    }
    if (numericValues.length === 1) {
      return { latest: numericValues[0], prior: numericValues[0] };
    }
  } catch (err: any) {
    console.warn(`[Liquidity Sync] Public CSV fallback skipped for ${seriesId} (${err.message}). Using canonical baseline.`);
  }

  return null;
}

export async function runLiquidityTriggersSync(): Promise<{
  liquidityResult: EvaluatedLiquidityState;
  yieldResult: EvaluatedYieldStatus;
}> {
  const apiKey = process.env.FRED_API_KEY;

  const [walcl, wtregen, rrpontsyd, dgs10, dgs2, dgs3mo] = await Promise.all([
    fetchFredRecentObservations('WALCL', apiKey),
    fetchFredRecentObservations('WTREGEN', apiKey),
    fetchFredRecentObservations('RRPONTSYD', apiKey),
    fetchFredRecentObservations('DGS10', apiKey),
    fetchFredRecentObservations('DGS2', apiKey),
    fetchFredRecentObservations('DGS3MO', apiKey),
  ]);

  /*
   * WALCL and WTREGEN are published by FRED in millions of dollars, whereas
   * RRPONTSYD is published in billions of dollars. Normalize all inputs to billions.
   */
  const fedAssetsBillion = walcl ? Math.round(walcl.latest / 1000) : 7040;
  const tgaBillion = wtregen ? Math.round(wtregen.latest / 1000) : 780;
  const reverseRepoBillion = rrpontsyd ? Math.round(rrpontsyd.latest) : 145;

  const priorFedAssetsBillion = walcl ? walcl.prior / 1000 : 6605;
  const priorTgaBillion = wtregen ? wtregen.prior / 1000 : 780;
  const priorRrpBillion = rrpontsyd ? rrpontsyd.prior : 145;
  const priorNetLiquidityTrillion =
    walcl || wtregen || rrpontsyd
      ? Number(((priorFedAssetsBillion - priorTgaBillion - priorRrpBillion) / 1000).toFixed(2))
      : 5.68;

  const liquidityResult = evaluateLiquidityTriggers(
    fedAssetsBillion,
    tgaBillion,
    reverseRepoBillion,
    priorNetLiquidityTrillion
  );

  const us10Y = dgs10 ? Number(dgs10.latest.toFixed(2)) : 4.19;
  const us2Y = dgs2 ? Number(dgs2.latest.toFixed(2)) : 4.02;
  const us3M = dgs3mo ? Number(dgs3mo.latest.toFixed(2)) : 4.65;
  const yieldResult = evaluateYieldCurveStatus(us10Y, us2Y, us3M);

  const liquidityJson = JSON.stringify(liquidityResult, null, 2);
  const yieldJson = JSON.stringify(yieldResult, null, 2);

  /*
   * Write to both src/data/ (for build-time bundling and invariant validation)
   * and public/ (so installed PWAs can poll fresh daily status over static HTTP without a backend).
   */
  fs.writeFileSync(path.join(process.cwd(), 'src/data/latest-liquidity-status.json'), liquidityJson);
  fs.writeFileSync(path.join(process.cwd(), 'public/latest-liquidity-status.json'), liquidityJson);

  fs.writeFileSync(path.join(process.cwd(), 'src/data/latest-yield-status.json'), yieldJson);
  fs.writeFileSync(path.join(process.cwd(), 'public/latest-yield-status.json'), yieldJson);

  console.log(`Evaluated Daily Macro Status:`);
  console.log(
    `- Net Liquidity: $${liquidityResult.netLiquidityTrillion}T (Weekly: ${liquidityResult.weeklyDeltaBillion > 0 ? '+' : ''}$${liquidityResult.weeklyDeltaBillion}B)`
  );
  console.log(
    `- 10Y-2Y Spread: ${yieldResult.spread10Y2Y > 0 ? '+' : ''}${yieldResult.spread10Y2Y}% (${yieldResult.curveShape})`
  );
  console.log(`- 12M Recession Probability: ${yieldResult.recessionProbability12M}%`);

  return { liquidityResult, yieldResult };
}

if (process.argv[1]?.endsWith('sync-liquidity-triggers.ts')) {
  runLiquidityTriggersSync().catch((err) => {
    console.error('Failed to evaluate liquidity triggers:', err);
    process.exit(1);
  });
}


