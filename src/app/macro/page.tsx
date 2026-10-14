'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TimelineControls } from '../../components/layout/TimelineControls';
import { MacroTrendChart } from '../../components/macro/MacroTrendChart';
import { CentralBankLiquidityRadar } from '../../components/macro/CentralBankLiquidityRadar';
import { LiquidityAlertsCenter } from '../../components/macro/LiquidityAlertsCenter';
import { FiscalDominanceSimulator } from '../../components/macro/FiscalDominanceSimulator';
import { YieldCurveMonitor } from '../../components/macro/YieldCurveMonitor';
import { MacroRegimeClock } from '../../components/macro/MacroRegimeClock';
import { SahmRuleLaborRadar } from '../../components/macro/SahmRuleLaborRadar';
import { InflationAnatomyRadar } from '../../components/macro/InflationAnatomyRadar';
import { LeadingIndicatorsRadar } from '../../components/macro/LeadingIndicatorsRadar';
import { ExternalSectorRadar } from '../../components/macro/ExternalSectorRadar';
import { MacroCalendarRadar } from '../../components/macro/MacroCalendarRadar';
import { CrossAssetRatioStudio } from '../../components/macro/CrossAssetRatioStudio';
import { CreditMarketRadar } from '../../components/macro/CreditMarketRadar';
import { PlainEnglishCard } from '../../components/explainers/PlainEnglishCard';
import {
  BarChart3,
  Compass,
  Activity,
  Users,
  TrendingUp,
  Landmark,
  Layers,
  Zap,
  Globe2,
  Calendar,
  Scale,
  ShieldAlert,
} from 'lucide-react';

type MacroSectionTab =
  | 'all'
  | 'regimes'
  | 'ratios'
  | 'yields'
  | 'credit'
  | 'leading'
  | 'labor'
  | 'inflation'
  | 'external'
  | 'calendar'
  | 'liquidity';

export default function MacroPage() {
  const [activeTab, setActiveTab] = useState<MacroSectionTab>('all');

  // Deep-link hydration from query parameters and hash anchors for external bookmarking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as MacroSectionTab;
    const hash = window.location.hash;

    if (
      tabParam &&
      [
        'all',
        'regimes',
        'ratios',
        'yields',
        'credit',
        'leading',
        'labor',
        'inflation',
        'external',
        'calendar',
        'liquidity',
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    } else if (hash.includes('credit') || params.has('credit_view') || params.has('cmr_view')) {
      setActiveTab('credit');
    } else if (hash.includes('fiscal') || params.has('fds_c') || params.has('fds_country')) {
      setActiveTab('liquidity');
    } else if (hash.includes('ratio') || params.has('car_r') || params.has('car_ratio')) {
      setActiveTab('ratios');
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.08] pb-6 space-y-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.12] bg-slate-100 dark:bg-white/[0.05] px-3.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 mb-3 shadow-inner">
            <BarChart3 className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            <span>State-of-the-Art Macro Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            The Global Economic Engine
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
            Monitor sovereign yield curve inversions and 3D term structure evolution surfaces, high-frequency GDP nowcasting and PMI diffusion, real-time macro regimes (Dalio growth-inflation clock), Claudia Sahm labor triggers, external sector balances, and central bank liquidity mechanics.
          </p>
        </div>

        {/* Section Navigation Tabs: stacked horizontally beneath title to allow full width for both elements */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-1">
          <div className="inline-flex items-center gap-1.5 rounded-2xl p-1.5 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] shadow-inner text-xs whitespace-nowrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <span>All Intelligence</span>
            </button>
            <button
              onClick={() => setActiveTab('regimes')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'regimes'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Regimes</span>
            </button>
            <button
              onClick={() => setActiveTab('ratios')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'ratios'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Scale className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>Cross-Asset Ratios</span>
            </button>
            <button
              onClick={() => setActiveTab('yields')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'yields'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Activity className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>Yield Curves</span>
            </button>
            <button
              onClick={() => setActiveTab('credit')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'credit'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              <span>Credit &amp; Spreads</span>
            </button>
            <button
              onClick={() => setActiveTab('leading')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'leading'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
              <span>Leading &amp; Nowcast</span>
            </button>
            <button
              onClick={() => setActiveTab('labor')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'labor'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Users className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Sahm &amp; Labor</span>
            </button>
            <button
              onClick={() => setActiveTab('inflation')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'inflation'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              <span>Inflation Anatomy</span>
            </button>
            <button
              onClick={() => setActiveTab('external')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'external'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>External &amp; FX</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Calendar &amp; Surprise</span>
            </button>
            <button
              onClick={() => setActiveTab('liquidity')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer ${
                activeTab === 'liquidity'
                  ? 'bg-white text-slate-900 shadow-md dark:bg-white dark:text-black font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Landmark className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Liquidity &amp; Fiscal</span>
            </button>
          </div>
        </div>
      </div>

      <TimelineControls />

      {/* 4-Quadrant Macro Regime Matrix & Business Cycle Clock */}
      {(activeTab === 'all' || activeTab === 'regimes') && <MacroRegimeClock />}

      {/* Analytical Cross-Asset Ratio Studio & Macro Sandbox */}
      {(activeTab === 'all' || activeTab === 'ratios') && <CrossAssetRatioStudio />}

      {/* Sovereign Yield Curve Monitor & Inversion Tracker */}
      {(activeTab === 'all' || activeTab === 'yields') && <YieldCurveMonitor />}

      {/* Corporate Credit Spreads, Financial Conditions & Bank Lending */}
      {(activeTab === 'all' || activeTab === 'credit') && <CreditMarketRadar />}

      {/* Leading Indicators & High-Frequency Nowcasting Radar */}
      {(activeTab === 'all' || activeTab === 'leading') && <LeadingIndicatorsRadar />}

      {/* Labor Market Dynamics & Claudia Sahm Recession Radar */}
      {(activeTab === 'all' || activeTab === 'labor') && <SahmRuleLaborRadar />}

      {/* Inflation Anatomy: Beyond Headline CPI */}
      {(activeTab === 'all' || activeTab === 'inflation') && <InflationAnatomyRadar />}

      {/* External Sector, Balance of Payments & FX Strength */}
      {(activeTab === 'all' || activeTab === 'external') && <ExternalSectorRadar />}

      {/* Macroeconomic Calendar & Citi Economic Surprise Index (CESI) */}
      {(activeTab === 'all' || activeTab === 'calendar') && <MacroCalendarRadar />}

      {/* Central Bank Liquidity Radar */}
      {(activeTab === 'all' || activeTab === 'liquidity') && (
        <>
          <CentralBankLiquidityRadar />
          <LiquidityAlertsCenter />
          <FiscalDominanceSimulator />
        </>
      )}

      {/* Historical Macro Trend Visualizer */}
      {(activeTab === 'all' || activeTab === 'liquidity') && <MacroTrendChart />}

      {/* Plain English Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PlainEnglishCard
          title="Why do Cross-Asset Ratios reveal macroeconomic truths that nominal asset prices conceal?"
          summary="Nominal prices reflect both real economic value and fiat currency dilution; structural ratios eliminate monetary noise to expose pure cyclical shifts."
          detail="If the S&P 500 triples over a decade but broad M2 money supply also triples, an investor's equity portfolio has not expanded real productive purchasing power—it has simply preserved value against fiat dilution. Similarly, Doctor Copper measures physical manufacturing and energy transition demand, while Spot Gold hedges sovereign debt debasement. Dividing Copper by Gold strips away monetary debasement and reveals whether real industrial growth is accelerating or decelerating."
          takeaway="Never evaluate asset prices in isolation; analyze cross-asset relative prices (Copper/Gold, S&P/M2, Gold/Oil) to distinguish real growth from currency debasement."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="Why do financial markets reprice on the Surprise Delta rather than absolute levels?"
          summary="Asset prices already discount median consensus forecasts; only the unexpected divergence between actual results and consensus forces instantaneous curve repositioning."
          detail="In efficient financial markets, all publicly available information and surveyed economist forecasts are already embedded into bond yields, swap curves, and equity valuation multiples before a data release. If US GDP prints at a solid 2.5%, but the consensus expectation was 3.0%, the release is fundamentally a growth contraction shock (-0.5% negative surprise delta). Investors must immediately reprice terminal interest rate expectations lower, causing Treasury yields to drop and cyclical equities to sell off—even though absolute growth remains positive."
          takeaway="Never trade the headline absolute number alone; trade the direction and magnitude of the expectation delta relative to consensus."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="What is the Citi Economic Surprise Index (CESI) and why is it a powerful contrarian signal?"
          summary="CESI measures whether incoming macroeconomic reports are systematically beating or trailing economist projections, oscillating in predictable mean-reverting waves."
          detail="Created by Citigroup, the Economic Surprise Index weights standard deviation deltas across dozens of high-frequency releases over a rolling 90-day exponential decay window. When CESI spikes to extreme positive peaks (> +50), economists become excessively euphoric and raise bar estimates to unrealistic levels, setting the stage for future downside disappointments and bond market rallies. Conversely, when CESI plunges below -50, consensus expectations become overly pessimistic, creating prime conditions for positive upside surprises that spark equity and risk-asset rebounds."
          takeaway="Extreme CESI readings (> +50 or < -50) are high-probability contrarian inflection points for interest rate and equity sector rotations."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="How do Central Bank Blackout Periods affect market volatility ahead of policy decisions?"
          summary="Statutory silence windows eliminate forward guidance commentary, leaving markets hypersensitive to incoming economic data surprises."
          detail="The Federal Reserve enforces a strict communication blackout beginning the second Saturday before an FOMC meeting and lasting until the Thursday after the decision. During this fortnight, Fed Governors and regional Fed Presidents cannot give speeches, interview with financial media, or drop policy hints. Because market participants cannot rely on official guidance to interpret late-breaking data, high-impact releases that fall during blackout windows (like Non-Farm Payrolls or CPI) trigger heightened intraday volatility across FX and Treasury markets."
          takeaway="Data surprises that hit during central bank blackout periods generate amplified price reactions because policymakers cannot steer expectations."
          defaultExpanded={false}
        />

        <PlainEnglishCard
          title="Why does a persistent Current Account deficit threaten sovereign debt sustainability?"
          summary="An economy consuming more than it produces must borrow the difference from abroad, accumulating foreign liabilities that require continuous refinancing."
          detail="The Current Account equals national savings minus domestic investment (S - I). When an economy runs persistent deficits (like the US at -3.4% of GDP or UK at -3.2%), it must attract hundreds of billions in foreign capital annually. If paired with an elevated fiscal deficit (the 'Twin Deficit' phenomenon), the sovereign becomes dependent on foreign central bank and institutional purchases of its government debt. If foreign appetite wanes or geopolitical fragmentation accelerates de-dollarization, the country faces upward yield spikes, currency depreciation, or sudden-stop capital outflows."
          takeaway="Track the Twin Deficit gap: when combined deficits exceed -8% of GDP, sovereign debt rollover requires growing real interest rate concessions."
          defaultExpanded={false}
        />

        <PlainEnglishCard
          title="What is Real Effective Exchange Rate (REER) and how does it spot currency overvaluation?"
          summary="REER measures a currency's purchasing power against a trade-weighted basket of foreign currencies, adjusted for inflation differentials."
          detail="Nominal exchange rates (like USD/JPY or EUR/USD) only compare two currencies at market prices without accounting for domestic inflation. The Bank for International Settlements (BIS) REER calculates trade-weighted multi-lateral competitiveness. When a country's REER drifts +10% to +15% above its 10-year mean (e.g. the US Dollar), its exports become artificially expensive and domestic imports cheapen, worsening the trade deficit. Conversely, when REER drops -20% below equilibrium (e.g. the Japanese Yen), severe currency undervaluation stimulates export profits but imports massive inflation on food and energy."
          takeaway="REER mean-reversion is a powerful multi-year gravitational force: extreme overvaluations historically precede major cyclical dollar contractions."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="How does the NY Fed GSCPI quantify supply-driven inflation bottlenecks?"
          summary="The Global Supply Chain Pressure Index strips out consumer demand to isolate pure logistical gridlock across global ocean, air, and factory channels."
          detail="Constructed by the Federal Reserve Bank of New York, GSCPI synthesizes 27 cross-border indicators—including Baltic Dry raw bulk rates, Harpex container costs, air cargo yields, and PMI supplier delivery times across seven major economies. Because shipping delays and freight spikes lead finished goods prices, GSCPI serves as a 3-to-6 month leading indicator for producer price inflation (PPI). During the 2021 supply chain crisis, GSCPI spiked to a record +4.32σ, directly igniting the 2022 global inflation wave."
          takeaway="When GSCPI trades within ±0.5σ, supply chains are neutral. Spikes above +1.0σ signal imminent goods inflation regardless of central bank policy rates."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="What is US TIC data and why does foreign central bank de-dollarization matter?"
          summary="Treasury International Capital (TIC) data tracks every dollar of US sovereign debt owned by foreign central banks, sovereign wealth funds, and private investors."
          detail="Historically, foreign central banks (especially China and Japan) recycled their massive merchandise trade surpluses directly back into US Treasuries. However, since the 2010s and particularly after the 2022 freezing of Russian foreign reserves, sovereign central banks have reduced their share of US debt from >75% of foreign holdings down to 44.5%. China's Treasury portfolio has shrunk from $1.3T down to ~$768B, with capital reallocated into physical gold and bilateral non-dollar trade settlement. This forces the US Treasury to rely on domestic banks, money market funds, and private hedge funds to absorb record sovereign issuance."
          takeaway="Foreign share of US debt has dropped from 43% to ~23%, reducing foreign subsidies of US deficit financing and increasing sensitivity to domestic yield spikes."
          defaultExpanded={false}
        />
        <PlainEnglishCard
          title="Why does high-frequency GDP Nowcasting beat official releases?"
          summary="Official GDP releases are lagging statistics published up to 90 days after quarter-end, whereas nowcasting updates daily from incoming reports."
          detail="The Bureau of Economic Analysis (BEA) publishes Advance GDP ~30 days after a quarter finishes, followed by Second and Final revisions that frequently alter the headline growth by full percentage points. Atlanta Fed GDPNow is a pure mathematical model with zero subjective forecasting—it tracks hard incoming prints like retail sales, durable goods shipments, and net trade to gauge actual real-time quarterly momentum as it unfolds."
          takeaway="Nowcasting eliminates the lag blind spot, allowing investors to trade real-time growth reality rather than looking in the rear-view mirror."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="How does the PMI 50-threshold signal business cycle inflections?"
          summary="Purchasing Managers' Indices (PMIs) are diffusion metrics where 50.0 is the mathematical line between economic expansion and contraction."
          detail="Derived from monthly surveys sent to corporate purchasing executives, PMIs capture whether business activity, new order backlogs, and employment are expanding (>50) or contracting (<50). Because executives order raw materials months before finished products are shipped, manufacturing PMIs regularly lead official industrial production by 3 to 6 months."
          takeaway="Pay special attention to the New Orders-to-Inventories ratio: when it exceeds 1.0, manufacturing acceleration is imminent."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="What is the Conference Board LEI 10-component 3D recession rule?"
          summary="The Conference Board tracks 10 forward-looking financial and operational components to anticipate cyclical economic peaks and troughs."
          detail="The LEI aggregates manufacturing hours, jobless claims, new orders, building permits, credit conditions, stock prices, consumer expectations, and the yield curve spread. The 3D rule tests for Duration (months of consecutive contraction), Depth (6-month annualized growth dropping below -4.0%), and Diffusion (majority of components falling). When all three criteria are met, an economic recession has followed with remarkable historical consistency."
          takeaway="Even if trailing GDP appears positive, a sustained drop in the 10 LEI components indicates structural friction accumulating beneath the surface."
          defaultExpanded={false}
        />

        <PlainEnglishCard
          title="Why does an Inverted Yield Curve predict recessions?"
          summary="Normally, investors demand higher interest to lock up money for 10 years than for 3 months. When this flips, the curve 'inverts'."
          detail="Yield curve inversions happen when central banks tighten short-term interest rates aggressively to break inflation, while bond investors foresee growth stalling and buy long bonds to lock in safe yields. Every US recession since 1955 was preceded by an inversion."
          takeaway="Pay closest attention when the curve 'un-inverts' (re-steepens), as that transition historically marks the onset of recessions as rate cuts begin."
          defaultExpanded={false}
        />

        <PlainEnglishCard
          title="How does the 4-Quadrant Regime dictate asset returns?"
          summary="Asset prices are discounted claims on future cash flows. Their performance depends on whether Growth and Inflation are accelerating or decelerating."
          detail="In Goldilocks (Growth Up, Inflation Down), equities and tech surge. In Reflation (Growth Up, Inflation Up), commodities and real estate lead. In Stagflation (Growth Down, Inflation Up), physical gold and cash outperform. In Deflation (Growth Down, Inflation Down), long Treasuries protect capital."
          takeaway="Identifying an economy's active quadrant provides immediate clarity on why specific asset classes are winning or losing."
          defaultExpanded={false}
        />

        <PlainEnglishCard
          title="What is the Claudia Sahm Rule, and why is 0.50% the golden threshold?"
          summary="Invented by Federal Reserve economist Claudia Sahm, this rule identifies the precise moment a cooling labor market turns into a recessionary cascade."
          detail="When the 3-month average unemployment rate rises +0.50% above its minimum over the prior 12 months, a recession has begun. It works because job cuts cause workers to cut spending, reducing revenues for businesses who then lay off more workers in a self-reinforcing cycle."
          takeaway="Unlike GDP which is reported months late with major revisions, the Sahm Rule relies on immediate monthly payroll data with zero historical false alarms."
          defaultExpanded={false}
        />

        <PlainEnglishCard
          title="Why do Option-Adjusted Credit Spreads (OAS) lead equity bear markets?"
          summary="Bond investors sit higher in the capital stack than equity holders and scrutinize balance sheet solvency first; widening credit spreads signal default distress before earnings drop."
          detail="When a corporation runs into refinancing trouble, its bondholders face loss of principal while equity holders face total wipeout. High-Yield Option-Adjusted Spreads (OAS) strip out embedded prepayment or call options to measure the exact risk premium demanded over US Treasuries. In 2000, 2007, and late 2019, credit spreads blew out months before equities peaked, because institutional credit traders were already cutting off debt rollover lines."
          takeaway="When High Yield OAS widens past 500 bps, trim cyclical equity risk regardless of trailing earnings growth."
          defaultExpanded={true}
        />

        <PlainEnglishCard
          title="How can Financial Conditions be 'Loose' when Central Bank Policy Rates are high?"
          summary="The Chicago Fed NFCI proves that central bank base rates are only one fraction of real economic funding; soaring equity prices and tight corporate bond spreads can completely negate rate hikes."
          detail="The Federal Reserve directly controls only the overnight Fed Funds rate. However, real financial conditions depend on 105 separate indicators—including credit spreads, mortgage borrowing, corporate equity valuations, and exchange rates. If the Fed keeps base rates at 5.0% but corporate spreads compress to record lows (318 bps) and stock markets reach record valuations, companies can easily raise equity capital and refinance debt, meaning broader financial conditions remain highly stimulative."
          takeaway="Never assume a high policy rate automatically restrains the economy; track the NFCI to see whether capital markets are stimulating or restricting real activity."
          defaultExpanded={false}
        />

        <PlainEnglishCard
          title="What is the Fed SLOOS and why does commercial bank tightening predict corporate layoffs?"
          summary="The Senior Loan Officer Opinion Survey measures whether banks are closing their credit windows to businesses, directly starving payroll funding 2 to 4 quarters ahead."
          detail="Conducted quarterly by the Federal Reserve Board, the SLOOS surveys senior executives at ~80 large domestic banks. Because small and medium businesses rely on bank credit lines to finance inventory, payroll, and capital equipment, a net tightening percentage above +30% to +40% invariably forces companies to freeze hiring and initiate layoffs within 6 to 12 months."
          takeaway="Watch net tightening standards for C&I loans: when SLOOS spikes above +40%, an economic downturn is mathematically locked in."
          defaultExpanded={false}
        />
      </div>
    </div>
  );
}
