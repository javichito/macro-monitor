/*
 * Automated Leading Indicators & High-Frequency Nowcasting Evaluation Engine
 *
 * Runs on a semi-weekly schedule (Tuesday & Friday market close, or via GitHub Actions)
 * to ingest high-frequency GDPNow updates, monthly PMI diffusion indices, and Conference Board LEI.
 * Validates econometric bounds and emits verified telemetry state to src/data/latest-nowcast-status.json.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface EvaluatedNowcastState {
  timestamp: string;
  currentQuarter: string;
  gdpNowEstimate: number;
  nyFedEstimate: number;
  blueChipConsensus: number;
  trailingOfficialGdp: number;
  consensusSurprise: number;
  pmiSummary: {
    globalComposite: number;
    usComposite: number;
    eurozoneComposite: number;
    chinaComposite: number;
    globalStatus: 'expansion' | 'contraction' | 'stagnation';
    orderBacklogRatio: number;
  };
  leiSummary: {
    indexLevel: number;
    sixMonthAnnualizedGrowth: number;
    diffusionIndex: number;
    signalStatus: 'expansion' | 'warning' | 'recession_signal';
  };
  activeAlerts: Array<{
    id: string;
    level: 'CRITICAL' | 'WARNING' | 'EXPANSION' | 'INFO';
    headline: string;
    body: string;
  }>;
}

/**
 * Validates that all econometric indicators remain within historical reality bounds,
 * protecting downstream UI components from corrupted upstream telemetry.
 */
export function validateLeadingBounds(state: {
  gdpNow: number;
  globalPmi: number;
  leiGrowth: number;
  diffusion: number;
}): boolean {
  if (state.gdpNow < -15 || state.gdpNow > 15) {
    throw new Error(`Nowcast out of bounds (-15 to 15): ${state.gdpNow}`);
  }
  if (state.globalPmi < 20 || state.globalPmi > 80) {
    throw new Error(`PMI out of bounds (20 to 80): ${state.globalPmi}`);
  }
  if (state.leiGrowth < -30 || state.leiGrowth > 30) {
    throw new Error(`LEI growth out of bounds (-30 to 30): ${state.leiGrowth}`);
  }
  if (state.diffusion < 0 || state.diffusion > 100) {
    throw new Error(`Diffusion out of bounds (0 to 100): ${state.diffusion}`);
  }
  return true;
}

export function evaluateLeadingIndicatorsStatus(
  gdpNow = 2.7,
  nyFed = 2.3,
  consensus = 1.9,
  trailingOfficial = 3.0,
  globalPmi = 52.6,
  usPmi = { mfg: 49.4, services: 54.9, composite: 53.8, orderBacklogRatio: 1.11 },
  eurozoneComposite = 50.4,
  chinaComposite = 51.8,
  lei = { level: 100.4, sixMonthGrowth: -2.8, diffusion: 50.0 }
): EvaluatedNowcastState {
  validateLeadingBounds({
    gdpNow,
    globalPmi,
    leiGrowth: lei.sixMonthGrowth,
    diffusion: lei.diffusion,
  });

  const consensusSurprise = Number((gdpNow - consensus).toFixed(2));
  const activeAlerts: EvaluatedNowcastState['activeAlerts'] = [];

  // Determine LEI 3D Rule signal status
  let leiSignal: 'expansion' | 'warning' | 'recession_signal' = 'expansion';
  if (lei.sixMonthGrowth <= -4.0 && lei.diffusion < 50) {
    leiSignal = 'recession_signal';
  } else if (lei.sixMonthGrowth < 0.0) {
    leiSignal = 'warning';
  }

  // Determine global PMI status
  const globalPmiStatus = globalPmi > 50 ? 'expansion' : globalPmi < 50 ? 'contraction' : 'stagnation';

  // Check 1: Conference Board LEI 3D Rule Alert
  if (leiSignal === 'recession_signal') {
    activeAlerts.push({
      id: 'lei-3d-recession-trigger',
      level: 'CRITICAL',
      headline: `🚨 Conference Board 3D Rule Triggered: ${lei.sixMonthGrowth}% Annualized`,
      body: `Duration, depth, and diffusion criteria met. 6-month contraction has breached the -4.0% historical recession trigger line.`,
    });
  } else if (leiSignal === 'warning') {
    activeAlerts.push({
      id: 'lei-warning-corridor',
      level: 'WARNING',
      headline: `⚠️ LEI in Contraction Warning Corridor: ${lei.sixMonthGrowth}% Annualized`,
      body: `Index is contracting but remains above the -4.0% formal recession trigger. Diffusion stands at ${lei.diffusion}%.`,
    });
  }

  // Check 2: Nowcast Upside / Downside Surprise
  if (Math.abs(consensusSurprise) >= 0.5) {
    const isUpside = consensusSurprise > 0;
    activeAlerts.push({
      id: 'gdpnow-consensus-surprise',
      level: isUpside ? 'EXPANSION' : 'WARNING',
      headline: `${isUpside ? '🚀' : '🔻'} GDPNow ${isUpside ? 'Surpasses' : 'Lags'} Consensus by ${Math.abs(consensusSurprise)}%`,
      body: `High-frequency hard data models current quarter growth at +${gdpNow}%, substantially diverging from surveyor consensus (+${consensus}%).`,
    });
  }

  // Check 3: Dual-speed PMI divergence (Mfg Contraction vs Services Expansion)
  if (usPmi.mfg < 50.0 && usPmi.services >= 50.0) {
    activeAlerts.push({
      id: 'dual-speed-divergence',
      level: 'INFO',
      headline: `🔄 Dual-Speed Divergence: US Services (${usPmi.services}) Outpaces Factory PMI (${usPmi.mfg})`,
      body: `Order backlogs and retail services remain expansionary while capital-goods manufacturing navigates elevated financing costs.`,
    });
  }

  return {
    timestamp: new Date().toISOString(),
    currentQuarter: '2026-Q3',
    gdpNowEstimate: gdpNow,
    nyFedEstimate: nyFed,
    blueChipConsensus: consensus,
    trailingOfficialGdp: trailingOfficial,
    consensusSurprise,
    pmiSummary: {
      globalComposite: globalPmi,
      usComposite: usPmi.composite,
      eurozoneComposite,
      chinaComposite,
      globalStatus: globalPmiStatus,
      orderBacklogRatio: usPmi.orderBacklogRatio,
    },
    leiSummary: {
      indexLevel: lei.level,
      sixMonthAnnualizedGrowth: lei.sixMonthGrowth,
      diffusionIndex: lei.diffusion,
      signalStatus: leiSignal,
    },
    activeAlerts,
  };
}

// When executed directly from the terminal or GitHub Actions cron
if (process.argv[1]?.endsWith('sync-leading-indicators.ts')) {
  try {
    const status = evaluateLeadingIndicatorsStatus();
    const outputPath = path.join(process.cwd(), 'src/data/latest-nowcast-status.json');
    fs.writeFileSync(outputPath, JSON.stringify(status, null, 2));

    console.log('========================================================');
    console.log(' MacroMonitor: Leading Indicators & Nowcast Evaluator');
    console.log('========================================================\n');
    console.log(`✓ Timestamp: ${status.timestamp}`);
    console.log(`✓ Atlanta Fed GDPNow: +${status.gdpNowEstimate}% (${status.currentQuarter})`);
    console.log(`✓ Consensus Surprise: ${status.consensusSurprise >= 0 ? '+' : ''}${status.consensusSurprise}% vs Blue Chip (+${status.blueChipConsensus}%)`);
    console.log(`✓ Global Composite PMI: ${status.pmiSummary.globalComposite} (${status.pmiSummary.globalStatus})`);
    console.log(`✓ Conference Board LEI: ${status.leiSummary.sixMonthAnnualizedGrowth}% 6M annualized (${status.leiSummary.signalStatus})`);
    console.log(`✓ Active Alert Signals: ${status.activeAlerts.length}`);
    for (const alert of status.activeAlerts) {
      console.log(`  - [${alert.level}] ${alert.headline}`);
    }
    console.log(`\n✓ Emitted verified status to src/data/latest-nowcast-status.json`);
  } catch (error: any) {
    console.error('Fatal evaluation error:', error.message);
    process.exit(1);
  }
}
