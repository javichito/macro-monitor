'use client';

import React, { useState } from 'react';
import { PlainEnglishCard } from '../../explainers/PlainEnglishCard';
import { MacroSectionTab, MacroPillarId, getPillarForSubTab } from '../navigation/macro-taxonomy';
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ExplainerItem {
  id: string;
  tabs: (MacroSectionTab | MacroPillarId)[];
  pillar: MacroPillarId;
  title: string;
  summary: string;
  detail: string;
  takeaway: string;
}

const ALL_EXPLAINERS: ExplainerItem[] = [
  // Regimes & Business Cycle
  {
    id: 'regimes-4q',
    tabs: ['regimes', 'briefing'],
    pillar: 'regimes',
    title: 'How does the 4-Quadrant Regime dictate asset returns?',
    summary: 'Asset prices are discounted claims on future cash flows. Their performance depends on whether Growth and Inflation are accelerating or decelerating.',
    detail: 'In Goldilocks (Growth Up, Inflation Down), equities and tech surge. In Reflation (Growth Up, Inflation Up), commodities and real estate lead. In Stagflation (Growth Down, Inflation Up), physical gold and cash outperform. In Deflation (Growth Down, Inflation Down), long Treasuries protect capital.',
    takeaway: 'Identifying an economy\'s active quadrant provides immediate clarity on why specific asset classes are winning or losing.',
  },
  {
    id: 'sahm-rule',
    tabs: ['labor', 'regimes', 'briefing'],
    pillar: 'regimes',
    title: 'What is the Claudia Sahm Rule, and why is 0.50% the golden threshold?',
    summary: 'Invented by Federal Reserve economist Claudia Sahm, this rule identifies the precise moment a cooling labor market turns into a recessionary cascade.',
    detail: 'When the 3-month average unemployment rate rises +0.50% above its minimum over the prior 12 months, a recession has begun. It works because job cuts cause workers to cut spending, reducing revenues for businesses who then lay off more workers in a self-reinforcing cycle.',
    takeaway: 'Unlike GDP which is reported months late with major revisions, the Sahm Rule relies on immediate monthly payroll data with zero historical false alarms.',
  },
  {
    id: 'nowcasting',
    tabs: ['leading', 'regimes'],
    pillar: 'regimes',
    title: 'Why does high-frequency GDP Nowcasting beat official releases?',
    summary: 'Official GDP releases are lagging statistics published up to 90 days after quarter-end, whereas nowcasting updates daily from incoming reports.',
    detail: 'The Bureau of Economic Analysis (BEA) publishes Advance GDP ~30 days after a quarter finishes, followed by Second and Final revisions that frequently alter the headline growth by full percentage points. Atlanta Fed GDPNow is a pure mathematical model with zero subjective forecasting—it tracks hard incoming prints like retail sales, durable goods shipments, and net trade to gauge actual real-time quarterly momentum as it unfolds.',
    takeaway: 'Nowcasting eliminates the lag blind spot, allowing investors to trade real-time growth reality rather than looking in the rear-view mirror.',
  },
  {
    id: 'pmi-threshold',
    tabs: ['leading', 'regimes'],
    pillar: 'regimes',
    title: 'How does the PMI 50-threshold signal business cycle inflections?',
    summary: 'Purchasing Managers\' Indices (PMIs) are diffusion metrics where 50.0 is the mathematical line between economic expansion and contraction.',
    detail: 'Derived from monthly surveys sent to corporate purchasing executives, PMIs capture whether business activity, new order backlogs, and employment are expanding (>50) or contracting (<50). Because executives order raw materials months before finished products are shipped, manufacturing PMIs regularly lead official industrial production by 3 to 6 months.',
    takeaway: 'Pay special attention to the New Orders-to-Inventories ratio: when it exceeds 1.0, manufacturing acceleration is imminent.',
  },
  {
    id: 'lei-3d-rule',
    tabs: ['leading', 'regimes'],
    pillar: 'regimes',
    title: 'What is the Conference Board LEI 10-component 3D recession rule?',
    summary: 'The Conference Board tracks 10 forward-looking financial and operational components to anticipate cyclical economic peaks and troughs.',
    detail: 'The LEI aggregates manufacturing hours, jobless claims, new orders, building permits, credit conditions, stock prices, consumer expectations, and the yield curve spread. The 3D rule tests for Duration (months of consecutive contraction), Depth (6-month annualized growth dropping below -4.0%), and Diffusion (majority of components falling). When all three criteria are met, an economic recession has followed with remarkable historical consistency.',
    takeaway: 'Even if trailing GDP appears positive, a sustained drop in the 10 LEI components indicates structural friction accumulating beneath the surface.',
  },

  // Rates, Liquidity & Debt
  {
    id: 'yield-inversion',
    tabs: ['yields', 'rates-liquidity', 'briefing'],
    pillar: 'rates-liquidity',
    title: 'Why does an Inverted Yield Curve predict recessions?',
    summary: 'Normally, investors demand higher interest to lock up money for 10 years than for 3 months. When this flips, the curve \'inverts\'.',
    detail: 'Yield curve inversions happen when central banks tighten short-term interest rates aggressively to break inflation, while bond investors foresee growth stalling and buy long bonds to lock in safe yields. Every US recession since 1955 was preceded by an inversion.',
    takeaway: 'Pay closest attention when the curve \'un-inverts\' (re-steepens), as that transition historically marks the onset of recessions as rate cuts begin.',
  },
  {
    id: 'move-index',
    tabs: ['volatility', 'rates-liquidity', 'briefing'],
    pillar: 'rates-liquidity',
    title: 'Why is the ICE BofA MOVE Index the ultimate canary in the financial coal mine?',
    summary: 'Often called the \'VIX of the bond market\', MOVE measures implied volatility in sovereign US Treasuries, which underpin global repo markets, mortgage pricing, and derivatives collateral.',
    detail: 'While equity markets can hallucinate calm during late-cycle runs, bond markets trade on mathematical balance sheet capacity and cash settlement certainty. Because US Treasuries serve as foundational pristine collateral across the entire banking system, spikes in MOVE above 120-140 force primary dealers to contract balance sheet capacity, hike repo haircuts, and call in margins. The March 2020 Treasury basis dislocation and the 2022 UK Gilt crisis both proved that when sovereign bond volatility explodes, foundational debt plumbing freezes and requires emergency central bank liquidity backstops.',
    takeaway: 'When MOVE crosses 120, treat financial conditions as fragile; above 140, emergency central bank intervention is imminent.',
  },
  {
    id: 'vix-move',
    tabs: ['volatility', 'rates-liquidity'],
    pillar: 'rates-liquidity',
    title: 'What is the VIX/MOVE Ratio and how does it detect dangerous equity complacency?',
    summary: 'The VIX/MOVE ratio compares stock market fear to bond market turbulence; depressed readings reveal that equity investors are dangerously oblivious to collateral strain.',
    detail: 'Stock and bond options do not always trade in sync. When bond yields are roiled by massive sovereign deficit issuance or rate path uncertainty (elevated MOVE) but equity option implied volatility remains pinned at historic lows (suppressed VIX < 16), the VIX/MOVE ratio plunges below 1.20-1.50. This cross-market divergence historically acts as a reliable precursor to violent equity corrections, because Treasury collateral margin calls and elevated discount rates inevitably cascade into equity valuation multiples.',
    takeaway: 'A depressed VIX/MOVE ratio (< 1.20) signals extreme equity vulnerability to bond market volatility spillover.',
  },
  {
    id: 'repo-haircuts',
    tabs: ['volatility', 'rates-liquidity'],
    pillar: 'rates-liquidity',
    title: 'How do Repo Haircuts and the Treasury Basis Trade trigger collateral liquidation spirals?',
    summary: 'Hedge funds use 30x to 50x repo leverage in cash-futures basis trades; when bond volatility spikes, clearinghouses raise haircuts, forcing immediate collateral dumping.',
    detail: 'Relative-value macro hedge funds exploit minute price gaps between cash Treasury bonds and Treasury futures. To make this profitable, funds borrow in the overnight repo market with 30x-50x leverage. When Treasury volatility surges, primary dealers and clearinghouses raise repo haircuts from 1.5% to 3-5%+ and demand immediate variation margin. Funds that cannot post cash must fire-sell cash Treasuries into a market with retreating dealer bids, sparking a recursive liquidation spiral that freezes sovereign debt markets.',
    takeaway: 'High leverage in repo markets turns modest rate volatility into existential collateral plumbing panics.',
  },
  {
    id: 'velocity-collapse',
    tabs: ['mechanics', 'liquidity', 'rates-liquidity'],
    pillar: 'rates-liquidity',
    title: 'Why did trillions in 2010s QE fail to spark consumer inflation? (The Velocity Collapse)',
    summary: 'QE swapped bonds for commercial bank reserves rather than giving cash to consumers; collapsing money velocity completely neutralized monetary base expansion.',
    detail: 'According to the classical Equation of Exchange (M * V = P * Y), nominal economic transactions equal the money supply multiplied by the speed at which it circulates. In the post-2008 QE era, the Federal Reserve paid Interest on Reserve Balances (IORB), incentivizing commercial banks to park excess liquidity safely at the central bank rather than lending it into the physical economy. Because private credit growth stalled and money velocity plummeted from 1.95 to 1.43, trillions of printed base dollars inflated asset prices on Wall Street while consumer price inflation (CPI) languished below the 2% target for an entire decade.',
    takeaway: 'Balance sheet expansion without money velocity creates asset price bubbles, not consumer price inflation.',
  },
  {
    id: 'tbill-issuance',
    tabs: ['mechanics', 'rates-liquidity'],
    pillar: 'rates-liquidity',
    title: 'How does tilting Treasury issuance toward T-Bills act as \'Shadow QE\' on 10-year bond yields?',
    summary: 'By flooding the market with short-term bills instead of 10Y/30Y coupons, the Treasury removes duration risk and pulls idle cash from the Fed Overnight Reverse Repo (ON RRP) facility.',
    detail: 'When government deficits reach trillions of dollars, funding them through conventional 10-year and 30-year bond auctions absorbs massive dealer balance sheet capacity, causing term premiums and long-term interest rates to spike. In late 2023, the US Treasury addressed this by shifting gross issuance heavily into short-term Treasury Bills (>65% of net auctions, pushing bills to 21.6% of marketable debt). Money Market Funds funded these purchases by withdrawing cash from the Fed\'s ON RRP facility, providing an estimated 30 to 50 bps of term premium relief on 10-year Treasuries without draining bank reserves.',
    takeaway: 'Issuing T-Bills instead of long bonds suppresses 10-year yields like central bank bond-buying, but only as long as reverse repo cash buffers exist.',
  },
  {
    id: 'onrrp-zero',
    tabs: ['mechanics', 'liquidity', 'rates-liquidity'],
    pillar: 'rates-liquidity',
    title: 'What happens to bank reserves and financial conditions when the ON RRP facility hits zero?',
    summary: 'When reverse repo cash is exhausted, new Treasury bill auctions must pull liquidity directly from commercial bank deposits, tightening systemic financial conditions.',
    detail: 'Between 2022 and 2026, the Federal Reserve\'s Overnight Reverse Repo (ON RRP) facility acted as a multi-trillion dollar shock absorber, dropping from $2.55T to under $150B as Money Market Funds bought Treasury Bills. However, once ON RRP is depleted to its structural floor, Treasury bill issuance can no longer be absorbed by idle cash. Money funds must either offer higher yields to pull deposits out of commercial banks or primary dealers must finance bills using bank credit lines. This directly shrinks bank reserves, increases repo volatility, and turns debt issuance into a contractionary liquidity drain.',
    takeaway: 'Track the $150B ON RRP floor: once depleted, sovereign debt issuance directly drains commercial bank liquidity.',
  },

  // Credit & Market Structure
  {
    id: 'credit-oas',
    tabs: ['credit', 'credit-markets'],
    pillar: 'credit-markets',
    title: 'Why do Option-Adjusted Credit Spreads (OAS) lead equity bear markets?',
    summary: 'Bond investors sit higher in the capital stack than equity holders and scrutinize balance sheet solvency first; widening credit spreads signal default distress before earnings drop.',
    detail: 'When a corporation runs into refinancing trouble, its bondholders face loss of principal while equity holders face total wipeout. High-Yield Option-Adjusted Spreads (OAS) strip out embedded prepayment or call options to measure the exact risk premium demanded over US Treasuries. In 2000, 2007, and late 2019, credit spreads blew out months before equities peaked, because institutional credit traders were already cutting off debt rollover lines.',
    takeaway: 'When High Yield OAS widens past 500 bps, trim cyclical equity risk regardless of trailing earnings growth.',
  },
  {
    id: 'nfci-conditions',
    tabs: ['credit', 'credit-markets'],
    pillar: 'credit-markets',
    title: 'How can Financial Conditions be \'Loose\' when Central Bank Policy Rates are high?',
    summary: 'The Chicago Fed NFCI proves that central bank base rates are only one fraction of real economic funding; soaring equity prices and tight corporate bond spreads can completely negate rate hikes.',
    detail: 'The Federal Reserve directly controls only the overnight Fed Funds rate. However, real financial conditions depend on 105 separate indicators—including credit spreads, mortgage borrowing, corporate equity valuations, and exchange rates. If the Fed keeps base rates at 5.0% but corporate spreads compress to record lows (318 bps) and stock markets reach record valuations, companies can easily raise equity capital and refinance debt, meaning broader financial conditions remain highly stimulative.',
    takeaway: 'Never assume a high policy rate automatically restrains the economy; track the NFCI to see whether capital markets are stimulating or restricting real activity.',
  },
  {
    id: 'sloos-lending',
    tabs: ['credit', 'credit-markets'],
    pillar: 'credit-markets',
    title: 'What is the Fed SLOOS and why does commercial bank tightening predict corporate layoffs?',
    summary: 'The Senior Loan Officer Opinion Survey measures whether banks are closing their credit windows to businesses, directly starving payroll funding 2 to 4 quarters ahead.',
    detail: 'Conducted quarterly by the Federal Reserve Board, the SLOOS surveys senior executives at ~80 large domestic banks. Because small and medium businesses rely on bank credit lines to finance inventory, payroll, and capital equipment, a net tightening percentage above +30% to +40% invariably forces companies to freeze hiring and initiate layoffs within 6 to 12 months.',
    takeaway: 'Watch net tightening standards for C&I loans: when SLOOS spikes above +40%, an economic downturn is mathematically locked in.',
  },
  {
    id: 'cross-asset-ratios',
    tabs: ['ratios', 'credit-markets'],
    pillar: 'credit-markets',
    title: 'Why do Cross-Asset Ratios reveal macroeconomic truths that nominal asset prices conceal?',
    summary: 'Nominal prices reflect both real economic value and fiat currency dilution; structural ratios eliminate monetary noise to expose pure cyclical shifts.',
    detail: 'If the S&P 500 triples over a decade but broad M2 money supply also triples, an investor\'s equity portfolio has not expanded real productive purchasing power—it has simply preserved value against fiat dilution. Similarly, Doctor Copper measures physical manufacturing and energy transition demand, while Spot Gold hedges sovereign debt debasement. Dividing Copper by Gold strips away monetary debasement and reveals whether real industrial growth is accelerating or decelerating.',
    takeaway: 'Never evaluate asset prices in isolation; analyze cross-asset relative prices (Copper/Gold, S&P/M2, Gold/Oil) to distinguish real growth from currency debasement.',
  },

  // Physical Economy & Inflation
  {
    id: 'energy-burden',
    tabs: ['physical', 'real-economy'],
    pillar: 'real-economy',
    title: 'Why does Global Energy Expenditure exceeding 8%–10% of World GDP trigger global recessions?',
    summary: 'Energy is the non-negotiable master resource of the physical economy; when its expenditure crosses 8% to 10% of global GDP, it acts as a regressive global consumption tax that historically precedes almost every modern recession.',
    detail: 'Unlike discretionary consumer goods, primary energy (crude oil, natural gas, coal, power) cannot be substituted in the short run. When oil prices spike and primary energy absorbs >8% of world GDP, trillions of dollars in purchasing power are forcibly transferred from consumers and manufacturing corporations to commodity petrostates with low marginal propensity to spend. In 1974 (10.4%), 1980 (11.8%), 2008 (8.8%), and 2022 (8.4%), this energy tax drained household discretionary cash flow, compressed corporate operating margins, and forced central banks to tighten into supply shocks, triggering widespread global contractions.',
    takeaway: 'Track the 8.0% warning and 10.0% crisis lines: crossing 8% indicates late-cycle vulnerability; crossing 10% signals imminent global economic contraction.',
  },
  {
    id: 'trade-peak',
    tabs: ['physical', 'real-economy'],
    pillar: 'real-economy',
    title: 'How did the 2008 peak in Global Trade-to-GDP (~61%) mark the transition to geoeconomic fragmentation and friendshoring?',
    summary: 'World merchandise and services trade peaked at 61% of GDP in 2008, bringing the Hyperglobalization era to an end in favor of supply chain resilience, tariff walls, and friendshoring.',
    detail: 'Between 1990 and 2008, cross-border trade expanded at more than twice the pace of global GDP, powered by the fall of the Soviet bloc, the founding of the WTO, and China\'s 2001 accession. Following the 2008 Global Financial Crisis, multinational corporations reached the limits of just-in-time offshoring. Geopolitical tensions, US-China tariff barriers (Section 301), semiconductor export bans, and European energy security shocks accelerated friendshoring and nearshoring (e.g. Mexico, Vietnam, India), stabilizing global trade-to-GDP around 57%–58%.',
    takeaway: 'The peak in trade openness proves globalization has shifted from lowest-cost arbitrage to security-first resilience, raising structural baseline inflation.',
  },
  {
    id: 'demographic-cliff',
    tabs: ['physical', 'real-economy'],
    pillar: 'real-economy',
    title: 'Why does the Secular Demographic Cliff in China, Japan, and Europe cement permanent fiscal dominance?',
    summary: 'The irreversible contraction of working-age populations (ages 15-64) caps potential real GDP growth and drives structural fiscal dominance as sovereign pension and healthcare liabilities balloon.',
    detail: 'In demographic frontier societies like Japan (53.8 dependents per 100 workers), South Korea (fertility 0.72), and China (workforce shrinking by 4-5 million annually since 2015), the ratio of tax-paying workers to benefit-drawing retirees has collapsed. Because age-related entitlement liabilities (pensions and healthcare) exceed 200%–350% of GDP across the OECD, governments cannot balance budgets through taxation alone. This demographic imbalance creates permanent structural deficits, forcing central banks into ongoing debt monetization and financial repression to prevent sovereign insolvency.',
    takeaway: 'Contracting workforces structurally suppress real potential GDP growth while mathematically enforcing sovereign fiscal dominance and debt monetization.',
  },
  {
    id: 'housing-hai',
    tabs: ['housing', 'real-economy'],
    pillar: 'real-economy',
    title: 'Why does the Housing Affordability Index (HAI) dictate cyclical macroeconomic inflection points?',
    summary: 'An HAI below 100 locks median-income families out of conventional home purchases, freezing entry-level transaction volumes and triggering consumer demand drag.',
    detail: 'Created by the National Association of Realtors (NAR), the Housing Affordability Index measures whether a median-income family earns enough to qualify for a conventional 30-year mortgage on a median-priced home at prevailing interest rates (assuming 20% down and a 25% debt-to-income underwriting standard). When mortgage rates spiked from 3% to 7.8% while home prices remained sticky, HAI plunged from 175 down into the 80-95 deficit range. Because residential housing is the largest asset on household balance sheets, affordability deficits directly crowd out disposable discretionary consumption.',
    takeaway: 'Track the 100 parity line: an HAI below 100 signals systemic consumer shelter strain; readings above 130 represent generational real estate entry points.',
  },
  {
    id: 'housing-lockin',
    tabs: ['housing', 'real-economy'],
    pillar: 'real-economy',
    title: 'How do 30-Year Fixed Mortgages create the \'Lock-in Effect\' (Golden Handcuffs) on housing supply?',
    summary: 'When market rates double above locked-in debt on existing homes, owners refuse to list, creating an artificial inventory shortage that defies rate hikes.',
    detail: 'In economies dominated by 30-year fixed mortgages (like the United States), over 82% of outstanding mortgages are locked in below 5%, and tens of millions are locked sub-3.5% from the 2020–2021 refinancing wave. If an existing owner sells their home to buy another at identical value, their borrowing rate jumps from ~3.9% to ~6.5%, increasing their monthly payment by >60%. This rate disparity forms \'golden handcuffs\', paralyzing existing home sales and causing nominal prices to stay elevated even amidst severe affordability deficits.',
    takeaway: 'Rate hikes fail to bring down nominal home prices when fixed debt freezes secondary listing supply.',
  },
  {
    id: 'housing-real-prices',
    tabs: ['housing', 'real-economy'],
    pillar: 'real-economy',
    title: 'Why must Real Home Prices be evaluated after deflating by CPI?',
    summary: 'Nominal home price records frequently disguise stagnant purchasing power when cumulative fiat inflation outpaces property appreciation.',
    detail: 'The S&P CoreLogic Case-Shiller index tracks repeat home sales in nominal dollars. While nominal indices have marched to all-time highs above 330, cumulative Consumer Price Index (CPI) inflation has expanded over +90% since 2000. Deflating nominal prices by CPI reveals that real housing purchasing power peaked in 2024 and has since plateaued. Nominal appreciation during high-inflation regimes represents monetary currency debasement rather than genuine wealth expansion.',
    takeaway: 'Always evaluate real (CPI-deflated) property prices to separate genuine productive real estate gains from monetary currency debasement.',
  },
  {
    id: 'gscpi-supply',
    tabs: ['inflation', 'real-economy'],
    pillar: 'real-economy',
    title: 'How does the NY Fed GSCPI quantify supply-driven inflation bottlenecks?',
    summary: 'The Global Supply Chain Pressure Index strips out consumer demand to isolate pure logistical gridlock across global ocean, air, and factory channels.',
    detail: 'Constructed by the Federal Reserve Bank of New York, GSCPI synthesizes 27 cross-border indicators—including Baltic Dry raw bulk rates, Harpex container costs, air cargo yields, and PMI supplier delivery times across seven major economies. Because shipping delays and freight spikes lead finished goods prices, GSCPI serves as a 3-to-6 month leading indicator for producer price inflation (PPI). During the 2021 supply chain crisis, GSCPI spiked to a record +4.32σ, directly igniting the 2022 global inflation wave.',
    takeaway: 'When GSCPI trades within ±0.5σ, supply chains are neutral. Spikes above +1.0σ signal imminent goods inflation regardless of central bank policy rates.',
  },

  // External Sector & Calendar
  {
    id: 'current-account',
    tabs: ['external', 'events-external'],
    pillar: 'events-external',
    title: 'Why does a persistent Current Account deficit threaten sovereign debt sustainability?',
    summary: 'An economy consuming more than it produces must borrow the difference from abroad, accumulating foreign liabilities that require continuous refinancing.',
    detail: 'The Current Account equals national savings minus domestic investment (S - I). When an economy runs persistent deficits (like the US at -3.4% of GDP or UK at -3.2%), it must attract hundreds of billions in foreign capital annually. If paired with an elevated fiscal deficit (the \'Twin Deficit\' phenomenon), the sovereign becomes dependent on foreign central bank and institutional purchases of its government debt. If foreign appetite wanes or geopolitical fragmentation accelerates de-dollarization, the country faces upward yield spikes, currency depreciation, or sudden-stop capital outflows.',
    takeaway: 'Track the Twin Deficit gap: when combined deficits exceed -8% of GDP, sovereign debt rollover requires growing real interest rate concessions.',
  },
  {
    id: 'reer-fx',
    tabs: ['external', 'events-external'],
    pillar: 'events-external',
    title: 'What is Real Effective Exchange Rate (REER) and how does it spot currency overvaluation?',
    summary: 'REER measures a currency\'s purchasing power against a trade-weighted basket of foreign currencies, adjusted for inflation differentials.',
    detail: 'Nominal exchange rates (like USD/JPY or EUR/USD) only compare two currencies at market prices without accounting for domestic inflation. The Bank for International Settlements (BIS) REER calculates trade-weighted multi-lateral competitiveness. When a country\'s REER drifts +10% to +15% above its 10-year mean (e.g. the US Dollar), its exports become artificially expensive and domestic imports cheapen, worsening the trade deficit. Conversely, when REER drops -20% below equilibrium (e.g. the Japanese Yen), severe currency undervaluation stimulates export profits but imports massive inflation on food and energy.',
    takeaway: 'REER mean-reversion is a powerful multi-year gravitational force: extreme overvaluations historically precede major cyclical dollar contractions.',
  },
  {
    id: 'tic-dedollarization',
    tabs: ['external', 'events-external'],
    pillar: 'events-external',
    title: 'What is US TIC data and why does foreign central bank de-dollarization matter?',
    summary: 'Treasury International Capital (TIC) data tracks every dollar of US sovereign debt owned by foreign central banks, sovereign wealth funds, and private investors.',
    detail: 'Historically, foreign central banks (especially China and Japan) recycled their massive merchandise trade surpluses directly back into US Treasuries. However, since the 2010s and particularly after the 2022 freezing of Russian foreign reserves, sovereign central banks have reduced their share of US debt from >75% of foreign holdings down to 44.5%. China\'s Treasury portfolio has shrunk from $1.3T down to ~$768B, with capital reallocated into physical gold and bilateral non-dollar trade settlement. This forces the US Treasury to rely on domestic banks, money market funds, and private hedge funds to absorb record sovereign issuance.',
    takeaway: 'Foreign share of US debt has dropped from 43% to ~23%, reducing foreign subsidies of US deficit financing and increasing sensitivity to domestic yield spikes.',
  },
  {
    id: 'surprise-delta',
    tabs: ['calendar', 'events-external'],
    pillar: 'events-external',
    title: 'Why do financial markets reprice on the Surprise Delta rather than absolute levels?',
    summary: 'Asset prices already discount median consensus forecasts; only the unexpected divergence between actual results and consensus forces instantaneous curve repositioning.',
    detail: 'In efficient financial markets, all publicly available information and surveyed economist forecasts are already embedded into bond yields, swap curves, and equity valuation multiples before a data release. If US GDP prints at a solid 2.5%, but the consensus expectation was 3.0%, the release is fundamentally a growth contraction shock (-0.5% negative surprise delta). Investors must immediately reprice terminal interest rate expectations lower, causing Treasury yields to drop and cyclical equities to sell off—even though absolute growth remains positive.',
    takeaway: 'Never trade the headline absolute number alone; trade the direction and magnitude of the expectation delta relative to consensus.',
  },
  {
    id: 'cesi-contrarian',
    tabs: ['calendar', 'events-external'],
    pillar: 'events-external',
    title: 'What is the Citi Economic Surprise Index (CESI) and why is it a powerful contrarian signal?',
    summary: 'CESI measures whether incoming macroeconomic reports are systematically beating or trailing economist projections, oscillating in predictable mean-reverting waves.',
    detail: 'Created by Citigroup, the Economic Surprise Index weights standard deviation deltas across dozens of high-frequency releases over a rolling 90-day exponential decay window. When CESI spikes to extreme positive peaks (> +50), economists become excessively euphoric and raise bar estimates to unrealistic levels, setting the stage for future downside disappointments and bond market rallies. Conversely, when CESI plunges below -50, consensus expectations become overly pessimistic, creating prime conditions for positive upside surprises that spark equity and risk-asset rebounds.',
    takeaway: 'Extreme CESI readings (> +50 or < -50) are high-probability contrarian inflection points for interest rate and equity sector rotations.',
  },
  {
    id: 'blackout-vol',
    tabs: ['calendar', 'events-external'],
    pillar: 'events-external',
    title: 'How do Central Bank Blackout Periods affect market volatility ahead of policy decisions?',
    summary: 'Statutory silence windows eliminate forward guidance commentary, leaving markets hypersensitive to incoming economic data surprises.',
    detail: 'The Federal Reserve enforces a strict communication blackout beginning the second Saturday before an FOMC meeting and lasting until the Thursday after the decision. During this fortnight, Fed Governors and regional Fed Presidents cannot give speeches, interview with financial media, or drop policy hints. Because market participants cannot rely on official guidance to interpret late-breaking data, high-impact releases that fall during blackout windows (like Non-Farm Payrolls or CPI) trigger heightened intraday volatility across FX and Treasury markets.',
    takeaway: 'Data surprises that hit during central bank blackout periods generate amplified price reactions because policymakers cannot steer expectations.',
  },
];

interface MacroContextualExplainersProps {
  activeTab: MacroSectionTab;
}

/*
 * Contextually surfaces relevant educational cards based on the active analytical pillar or sub-tab.
 * This restores the contextual learning loop and prevents the 21-card bottom dump anti-pattern.
 */
export function MacroContextualExplainers({ activeTab }: MacroContextualExplainersProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const activePillar = getPillarForSubTab(activeTab);

  // Filter explainers matching either the active sub-tab or the parent pillar
  const relevantExplainers = ALL_EXPLAINERS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.tabs.includes(activeTab) || item.pillar === activePillar;
  });

  if (relevantExplainers.length === 0) return null;

  return (
    <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-left group cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 group-hover:bg-sky-500/20 transition-colors">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Domain Mechanics &amp; Institutional Knowledge</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400">
                {relevantExplainers.length} {relevantExplainers.length === 1 ? 'guide' : 'guides'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Plain-English institutional concepts contextualized for this section
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label={isExpanded ? 'Collapse guides' : 'Expand guides'}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {relevantExplainers.map((item, idx) => (
            <PlainEnglishCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              detail={item.detail}
              takeaway={item.takeaway}
              defaultExpanded={idx === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
