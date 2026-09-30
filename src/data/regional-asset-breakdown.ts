import {
  MacroRegionId,
  RegionMeta,
  RegionalAssetYear,
  RegionalAssetMix,
} from '../lib/types';

/*
 * Metadata profiles for the 5 macroeconomic regions.
 * Distinct palette assignments adhere to Apple HIG visual contrast guidelines
 * and maintain consistent semantic identity across dark and light presentation modes.
 */
export const REGIONAL_METADATA: Record<MacroRegionId, RegionMeta> = {
  'north-america': {
    id: 'north-america',
    name: 'North America',
    shortName: 'North America',
    flag: '🇺🇸',
    color: '#38bdf8', // Sky 400
    secondaryColor: '#0284c7',
    keyEconomies: 'United States, Canada',
    macroProfile:
      'Global capital market epicenter with the highest concentration of corporate equity and 401(k) financial asset participation in world history.',
  },
  'asia-pacific': {
    id: 'asia-pacific',
    name: 'Asia-Pacific',
    shortName: 'Asia-Pac',
    flag: '🌏',
    color: '#10b981', // Emerald 500
    secondaryColor: '#059669',
    keyEconomies: 'China, Japan, India, Australia, South Korea, Taiwan, ASEAN',
    macroProfile:
      'The world’s primary physical wealth engine, anchored by massive residential real estate holdings, manufacturing capital, and rapid urban balance sheet compounding.',
  },
  'europe': {
    id: 'europe',
    name: 'Europe',
    shortName: 'Europe',
    flag: '🇪🇺',
    color: '#818cf8', // Indigo 400
    secondaryColor: '#4f46e5',
    keyEconomies: 'Germany, United Kingdom, France, Italy, Switzerland, Nordics',
    macroProfile:
      'Conservative balance sheets dominated by high-quality residential property, sovereign bonds, and institutional pension savings, with lower retail equity market penetration.',
  },
  'latin-america': {
    id: 'latin-america',
    name: 'Latin America',
    shortName: 'Latin America',
    flag: '🌎',
    color: '#f59e0b', // Amber 500
    secondaryColor: '#d97706',
    keyEconomies: 'Brazil, Mexico, Argentina, Colombia, Chile, Peru',
    macroProfile:
      'Tangible-asset dominant economies where households structurally prefer physical real estate, farmland, and hard-currency deposits to hedge against historical domestic inflation.',
  },
  'middle-east-africa': {
    id: 'middle-east-africa',
    name: 'Middle East & Africa',
    shortName: 'Middle East & Africa',
    flag: '🌍',
    color: '#ec4899', // Pink 500
    secondaryColor: '#db2777',
    keyEconomies: 'Saudi Arabia, UAE, South Africa, Israel, Turkey, Egypt, Nigeria',
    macroProfile:
      'Sovereign-wealth-rich oil exporters paired with rapidly expanding demographic frontiers, carrying heavy allocations to infrastructure, precious metals, and sovereign holdings.',
  },
};

/*
 * Curated from UBS/Credit Suisse Global Wealth Databooks (1980-2025),
 * Savills World Real Estate Research, SIFMA Capital Markets Fact Books,
 * BIS Debt Statistics, and IMF Balance of Payments datasets.
 *
 * Each benchmark year sums identically to the global aggregates in asset-breakdown.ts,
 * providing mathematically reconciled cross-sectional and longitudinal fidelity.
 */
export const REGIONAL_ASSET_HISTORY: RegionalAssetYear[] = [
  {
    year: 1980,
    totalGlobalGrossTrillion: 40.2,
    totalGlobalLiabilitiesTrillion: 5.7,
    totalGlobalNetWealthTrillion: 34.5,
    regions: {
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 15.5,
        totalLiabilitiesTrillion: 2.2,
        netWealthTrillion: 13.3,
        shareOfGlobalGrossPercent: 38.6,
        assets: {
          realEstate: 7.2,
          equities: 3.8,
          bonds: 2.3,
          cash: 1.7,
          alternatives: 0.5,
        },
        macroHighlight:
          'High interest rate Volcker era; US equity market capitalization represented over 55% of world publicly traded shares.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 14.8,
        totalLiabilitiesTrillion: 2.1,
        netWealthTrillion: 12.7,
        shareOfGlobalGrossPercent: 36.8,
        assets: {
          realEstate: 8.5,
          equities: 1.8,
          bonds: 2.1,
          cash: 1.9,
          alternatives: 0.5,
        },
        macroHighlight:
          'Post-war reconstruction wealth matured; European household balance sheets heavily anchored in municipal and residential real estate.',
      },
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 6.5,
        totalLiabilitiesTrillion: 0.9,
        netWealthTrillion: 5.6,
        shareOfGlobalGrossPercent: 16.2,
        assets: {
          realEstate: 5.2,
          equities: 0.8,
          bonds: 0.25,
          cash: 0.15,
          alternatives: 0.1,
        },
        macroHighlight:
          'Japan begins its post-war export ascent; mainland China prior to economic reform accounted for negligible private household assets.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 1.9,
        totalLiabilitiesTrillion: 0.28,
        netWealthTrillion: 1.62,
        shareOfGlobalGrossPercent: 4.7,
        assets: {
          realEstate: 1.3,
          equities: 0.22,
          bonds: 0.08,
          cash: 0.18,
          alternatives: 0.12,
        },
        macroHighlight:
          'Commodity-driven balance sheets dominated by arable agricultural land, preceding the 1980s sovereign debt crises.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 1.5,
        totalLiabilitiesTrillion: 0.22,
        netWealthTrillion: 1.28,
        shareOfGlobalGrossPercent: 3.7,
        assets: {
          realEstate: 1.1,
          equities: 0.18,
          bonds: 0.07,
          cash: 0.07,
          alternatives: 0.08,
        },
        macroHighlight:
          '1970s oil embargo windfall generated early state sovereign reserves in the Persian Gulf.',
      },
    },
  },
  {
    year: 1990,
    totalGlobalGrossTrillion: 79.5,
    totalGlobalLiabilitiesTrillion: 11.3,
    totalGlobalNetWealthTrillion: 68.2,
    regions: {
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 27.8,
        totalLiabilitiesTrillion: 3.9,
        netWealthTrillion: 23.9,
        shareOfGlobalGrossPercent: 35.0,
        assets: {
          realEstate: 12.8,
          equities: 7.2,
          bonds: 4.2,
          cash: 3.0,
          alternatives: 0.6,
        },
        macroHighlight:
          'Post-1987 crash consolidation; 401(k) adoption begins channeling systematic retail capital into mutual funds.',
      },
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 23.2,
        totalLiabilitiesTrillion: 3.3,
        netWealthTrillion: 19.9,
        shareOfGlobalGrossPercent: 29.2,
        assets: {
          realEstate: 16.5,
          equities: 3.8,
          bonds: 1.4,
          cash: 1.2,
          alternatives: 0.3,
        },
        macroHighlight:
          'Apex of the Japanese asset bubble; Tokyo land and the Nikkei 225 commanded legendary global asset valuations.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 22.8,
        totalLiabilitiesTrillion: 3.3,
        netWealthTrillion: 19.5,
        shareOfGlobalGrossPercent: 28.7,
        assets: {
          realEstate: 11.2,
          equities: 3.4,
          bonds: 4.4,
          cash: 3.3,
          alternatives: 0.5,
        },
        macroHighlight:
          'Fall of the Berlin Wall; initial steps toward the European Single Market bolster Western European asset values.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 3.1,
        totalLiabilitiesTrillion: 0.44,
        netWealthTrillion: 2.66,
        shareOfGlobalGrossPercent: 3.9,
        assets: {
          realEstate: 1.8,
          equities: 0.35,
          bonds: 0.15,
          cash: 0.62,
          alternatives: 0.18,
        },
        macroHighlight:
          'Brady Plan debt restructurings commence across Latin America following a decade of hyperinflation.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 2.6,
        totalLiabilitiesTrillion: 0.36,
        netWealthTrillion: 2.24,
        shareOfGlobalGrossPercent: 3.2,
        assets: {
          realEstate: 1.4,
          equities: 0.35,
          bonds: 0.15,
          cash: 0.58,
          alternatives: 0.12,
        },
        macroHighlight:
          'Gulf War geopolitical tensions drive oil volatility; early GCC modernization programs gain initial traction.',
      },
    },
  },
  {
    year: 1995,
    totalGlobalGrossTrillion: 108.4,
    totalGlobalLiabilitiesTrillion: 15.8,
    totalGlobalNetWealthTrillion: 92.6,
    regions: {
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 40.5,
        totalLiabilitiesTrillion: 5.9,
        netWealthTrillion: 34.6,
        shareOfGlobalGrossPercent: 37.4,
        assets: {
          realEstate: 18.2,
          equities: 12.1,
          bonds: 5.8,
          cash: 3.6,
          alternatives: 0.8,
        },
        macroHighlight:
          'Early commercial internet boom; NASDAQ begins exponential rise as computing technology drives productivity.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 33.6,
        totalLiabilitiesTrillion: 4.9,
        netWealthTrillion: 28.7,
        shareOfGlobalGrossPercent: 31.0,
        assets: {
          realEstate: 17.5,
          equities: 5.2,
          bonds: 6.2,
          cash: 4.0,
          alternatives: 0.7,
        },
        macroHighlight:
          'Maastricht Treaty convergence; bond yields across periphery Europe narrow toward German Bund standards.',
      },
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 27.2,
        totalLiabilitiesTrillion: 3.9,
        netWealthTrillion: 23.3,
        shareOfGlobalGrossPercent: 25.1,
        assets: {
          realEstate: 17.5,
          equities: 5.4,
          bonds: 1.7,
          cash: 2.2,
          alternatives: 0.4,
        },
        macroHighlight:
          'Japan enters its first "Lost Decade" of balance sheet deflation; Asian Tiger economies expand rapidly.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 4.1,
        totalLiabilitiesTrillion: 0.6,
        netWealthTrillion: 3.5,
        shareOfGlobalGrossPercent: 3.8,
        assets: {
          realEstate: 2.3,
          equities: 0.55,
          bonds: 0.22,
          cash: 0.85,
          alternatives: 0.18,
        },
        macroHighlight:
          'Mexican Tequila Crisis contagion tests emerging market currency pegs throughout South America.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 3.0,
        totalLiabilitiesTrillion: 0.5,
        netWealthTrillion: 2.5,
        shareOfGlobalGrossPercent: 2.7,
        assets: {
          realEstate: 2.0,
          equities: 0.55,
          bonds: 0.18,
          cash: 0.15,
          alternatives: 0.12,
        },
        macroHighlight:
          'Post-Apartheid South Africa reintegrates into global financial markets; GCC capital infrastructure expands.',
      },
    },
  },
  {
    year: 2000,
    totalGlobalGrossTrillion: 144.5,
    totalGlobalLiabilitiesTrillion: 22.1,
    totalGlobalNetWealthTrillion: 122.4,
    regions: {
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 59.8,
        totalLiabilitiesTrillion: 9.2,
        netWealthTrillion: 50.6,
        shareOfGlobalGrossPercent: 41.4,
        assets: {
          realEstate: 24.2,
          equities: 22.8,
          bonds: 6.8,
          cash: 4.9,
          alternatives: 1.1,
        },
        macroHighlight:
          'Dot-Com bubble peak; US equities reach record valuation multiples, representing over 60% of all global equity wealth.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 44.5,
        totalLiabilitiesTrillion: 6.8,
        netWealthTrillion: 37.7,
        shareOfGlobalGrossPercent: 30.8,
        assets: {
          realEstate: 23.5,
          equities: 7.9,
          bonds: 7.4,
          cash: 4.8,
          alternatives: 0.9,
        },
        macroHighlight:
          'Launch of the Euro single currency unlocks borderless institutional capital flows across member nations.',
      },
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 32.2,
        totalLiabilitiesTrillion: 4.9,
        netWealthTrillion: 27.3,
        shareOfGlobalGrossPercent: 22.3,
        assets: {
          realEstate: 20.8,
          equities: 5.7,
          bonds: 2.4,
          cash: 2.8,
          alternatives: 0.5,
        },
        macroHighlight:
          'Recovery from the 1997-1998 Asian Financial Crisis; China concludes WTO accession negotiations.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 4.5,
        totalLiabilitiesTrillion: 0.65,
        netWealthTrillion: 3.85,
        shareOfGlobalGrossPercent: 3.1,
        assets: {
          realEstate: 2.1,
          equities: 0.65,
          bonds: 0.35,
          cash: 1.25,
          alternatives: 0.15,
        },
        macroHighlight:
          'Argentina currency board stress deepens, prompting defensive cash dollarization across households.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 3.5,
        totalLiabilitiesTrillion: 0.55,
        netWealthTrillion: 2.95,
        shareOfGlobalGrossPercent: 2.4,
        assets: {
          realEstate: 1.7,
          equities: 0.55,
          bonds: 0.35,
          cash: 0.75,
          alternatives: 0.15,
        },
        macroHighlight:
          'Low real oil prices in the late 1990s kept Gulf asset accumulation muted relative to the Western equity mania.',
      },
    },
  },
  {
    year: 2005,
    totalGlobalGrossTrillion: 215.8,
    totalGlobalLiabilitiesTrillion: 33.2,
    totalGlobalNetWealthTrillion: 182.6,
    regions: {
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 82.5,
        totalLiabilitiesTrillion: 12.8,
        netWealthTrillion: 69.7,
        shareOfGlobalGrossPercent: 38.2,
        assets: {
          realEstate: 41.5,
          equities: 22.8,
          bonds: 10.2,
          cash: 6.6,
          alternatives: 1.4,
        },
        macroHighlight:
          'Subprime housing and mortgage-backed securities credit expansion reaches fever pitch; real estate wealth doubles in a decade.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 69.8,
        totalLiabilitiesTrillion: 10.7,
        netWealthTrillion: 59.1,
        shareOfGlobalGrossPercent: 32.3,
        assets: {
          realEstate: 38.5,
          equities: 12.4,
          bonds: 10.8,
          cash: 6.8,
          alternatives: 1.3,
        },
        macroHighlight:
          'Strong Euro exchange rates and Spanish/Irish property booms lift European total assets in USD terms.',
      },
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 50.8,
        totalLiabilitiesTrillion: 7.7,
        netWealthTrillion: 43.1,
        shareOfGlobalGrossPercent: 23.5,
        assets: {
          realEstate: 28.5,
          equities: 10.2,
          bonds: 5.7,
          cash: 5.6,
          alternatives: 0.8,
        },
        macroHighlight:
          'China’s post-WTO export surge triggers historic rural-to-urban migration and nationwide urban property development.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 6.8,
        totalLiabilitiesTrillion: 1.1,
        netWealthTrillion: 5.7,
        shareOfGlobalGrossPercent: 3.2,
        assets: {
          realEstate: 3.2,
          equities: 1.1,
          bonds: 0.7,
          cash: 1.5,
          alternatives: 0.3,
        },
        macroHighlight:
          'China-induced commodity supercycle fuels Brazilian and Chilean sovereign terms of trade.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 5.9,
        totalLiabilitiesTrillion: 0.9,
        netWealthTrillion: 5.0,
        shareOfGlobalGrossPercent: 2.8,
        assets: {
          realEstate: 2.7,
          equities: 1.0,
          bonds: 0.7,
          cash: 1.1,
          alternatives: 0.4,
        },
        macroHighlight:
          'Oil marches toward $60/bbl; Dubai initiates freehold real estate ownership, kicking off modern megaproject construction.',
      },
    },
  },
  {
    year: 2010,
    totalGlobalGrossTrillion: 290.4,
    totalGlobalLiabilitiesTrillion: 42.6,
    totalGlobalNetWealthTrillion: 247.8,
    regions: {
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 92.5,
        totalLiabilitiesTrillion: 13.6,
        netWealthTrillion: 78.9,
        shareOfGlobalGrossPercent: 31.9,
        assets: {
          realEstate: 48.5,
          equities: 16.5,
          bonds: 16.2,
          cash: 8.5,
          alternatives: 2.8,
        },
        macroHighlight:
          'Euro sovereign debt crisis emerges (Greece, Portugal, Ireland); safe-haven German Bund and Nordic assets swell.',
      },
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 93.8,
        totalLiabilitiesTrillion: 13.8,
        netWealthTrillion: 80.0,
        shareOfGlobalGrossPercent: 32.3,
        assets: {
          realEstate: 51.5,
          equities: 19.5,
          bonds: 11.2,
          cash: 9.2,
          alternatives: 2.4,
        },
        macroHighlight:
          'China overtakes Japan as the second-largest economy; Beijing’s 4T yuan stimulus shelters APAC from Western crisis.',
      },
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 84.8,
        totalLiabilitiesTrillion: 12.5,
        netWealthTrillion: 72.3,
        shareOfGlobalGrossPercent: 29.2,
        assets: {
          realEstate: 34.5,
          equities: 27.2,
          bonds: 16.5,
          cash: 4.2,
          alternatives: 2.4,
        },
        macroHighlight:
          'Post-GFC balance sheet repair; US home prices bottom out while Fed Quantitative Easing (QE1/QE2) reflates equities.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 10.4,
        totalLiabilitiesTrillion: 1.5,
        netWealthTrillion: 8.9,
        shareOfGlobalGrossPercent: 3.6,
        assets: {
          realEstate: 4.2,
          equities: 1.9,
          bonds: 1.4,
          cash: 2.3,
          alternatives: 0.6,
        },
        macroHighlight:
          'Peak Latin American commodity decade; Brazilian Real appreciates sharply as foreign inflows chase real yields.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 8.9,
        totalLiabilitiesTrillion: 1.2,
        netWealthTrillion: 7.7,
        shareOfGlobalGrossPercent: 3.0,
        assets: {
          realEstate: 3.6,
          equities: 1.7,
          bonds: 1.2,
          cash: 1.9,
          alternatives: 0.5,
        },
        macroHighlight:
          'Crude oil rebounds past $80/bbl; GCC sovereign wealth funds (ADIA, QIA) step in as strategic white-knight bank investors.',
      },
    },
  },
  {
    year: 2015,
    totalGlobalGrossTrillion: 366.8,
    totalGlobalLiabilitiesTrillion: 51.4,
    totalGlobalNetWealthTrillion: 315.4,
    regions: {
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 129.5,
        totalLiabilitiesTrillion: 18.2,
        netWealthTrillion: 111.3,
        shareOfGlobalGrossPercent: 35.3,
        assets: {
          realEstate: 72.5,
          equities: 27.8,
          bonds: 13.8,
          cash: 12.2,
          alternatives: 3.2,
        },
        macroHighlight:
          'Asia-Pacific officially establishes itself as the largest aggregate asset pool on Earth, propelled by Tier-1 Chinese real estate.',
      },
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 124.5,
        totalLiabilitiesTrillion: 17.5,
        netWealthTrillion: 107.0,
        shareOfGlobalGrossPercent: 33.9,
        assets: {
          realEstate: 46.2,
          equities: 44.5,
          bonds: 22.8,
          cash: 7.5,
          alternatives: 3.5,
        },
        macroHighlight:
          'Tech mega-cap dominance begins (FAANG era); US equity markets massively outpace European and emerging indices.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 91.2,
        totalLiabilitiesTrillion: 12.8,
        netWealthTrillion: 78.4,
        shareOfGlobalGrossPercent: 24.9,
        assets: {
          realEstate: 47.5,
          equities: 16.5,
          bonds: 15.5,
          cash: 8.5,
          alternatives: 3.2,
        },
        macroHighlight:
          'ECB enters negative interest rates and sovereign bond QE under Mario Draghi ("Whatever it takes").',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 11.2,
        totalLiabilitiesTrillion: 1.5,
        netWealthTrillion: 9.7,
        shareOfGlobalGrossPercent: 3.1,
        assets: {
          realEstate: 5.2,
          equities: 1.4,
          bonds: 1.5,
          cash: 2.6,
          alternatives: 0.5,
        },
        macroHighlight:
          'End of the commodity supercycle leads to currency depreciations in Brazil, Colombia, and Mexico.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 10.4,
        totalLiabilitiesTrillion: 1.4,
        netWealthTrillion: 9.0,
        shareOfGlobalGrossPercent: 2.8,
        assets: {
          realEstate: 4.7,
          equities: 1.5,
          bonds: 1.4,
          cash: 2.2,
          alternatives: 0.6,
        },
        macroHighlight:
          'Oil price crash from $110 to $40 triggers sovereign fiscal discipline and structural diversification mandates (Saudi Vision 2030).',
      },
    },
  },
  {
    year: 2020,
    totalGlobalGrossTrillion: 484.2,
    totalGlobalLiabilitiesTrillion: 64.8,
    totalGlobalNetWealthTrillion: 419.4,
    regions: {
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 176.5,
        totalLiabilitiesTrillion: 23.6,
        netWealthTrillion: 152.9,
        shareOfGlobalGrossPercent: 36.5,
        assets: {
          realEstate: 99.5,
          equities: 38.5,
          bonds: 17.5,
          cash: 16.5,
          alternatives: 4.5,
        },
        macroHighlight:
          'Swift industrial recovery from early COVID-19 pandemic shock; Chinese property market valuation reaches historic climax.',
      },
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 173.8,
        totalLiabilitiesTrillion: 23.2,
        netWealthTrillion: 150.6,
        shareOfGlobalGrossPercent: 35.9,
        assets: {
          realEstate: 63.5,
          equities: 71.5,
          bonds: 24.8,
          cash: 8.8,
          alternatives: 5.2,
        },
        macroHighlight:
          'Massive emergency fiscal stimulus (CARES Act) and Fed unlimited QE trigger generational rallies in equities and suburban real estate.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 108.5,
        totalLiabilitiesTrillion: 14.5,
        netWealthTrillion: 94.0,
        shareOfGlobalGrossPercent: 22.4,
        assets: {
          realEstate: 52.8,
          equities: 21.5,
          bonds: 21.8,
          cash: 8.8,
          alternatives: 3.6,
        },
        macroHighlight:
          'NextGenerationEU joint fiscal debt issuance established; European green transition initiatives channel institutional capital.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 13.2,
        totalLiabilitiesTrillion: 1.8,
        netWealthTrillion: 11.4,
        shareOfGlobalGrossPercent: 2.7,
        assets: {
          realEstate: 6.2,
          equities: 2.1,
          bonds: 1.9,
          cash: 2.4,
          alternatives: 0.6,
        },
        macroHighlight:
          'Pandemic impacts softened by central banks pioneering early cycle interest rate cuts and digital fintech banking (Nubank).',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 12.2,
        totalLiabilitiesTrillion: 1.7,
        netWealthTrillion: 10.5,
        shareOfGlobalGrossPercent: 2.5,
        assets: {
          realEstate: 5.6,
          equities: 2.0,
          bonds: 1.8,
          cash: 2.2,
          alternatives: 0.6,
        },
        macroHighlight:
          'Historic brief oil price collapse into negative territory in April 2020 followed by aggressive OPEC+ supply discipline.',
      },
    },
  },
  {
    year: 2022,
    totalGlobalGrossTrillion: 528.6,
    totalGlobalLiabilitiesTrillion: 71.2,
    totalGlobalNetWealthTrillion: 457.4,
    regions: {
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 194.2,
        totalLiabilitiesTrillion: 26.1,
        netWealthTrillion: 168.1,
        shareOfGlobalGrossPercent: 36.7,
        assets: {
          realEstate: 115.5,
          equities: 34.2,
          bonds: 19.8,
          cash: 20.2,
          alternatives: 4.5,
        },
        macroHighlight:
          'Chinese property developer liquidity tightening ("Three Red Lines") commences; Bank of Japan holds yield curve control.',
      },
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 190.5,
        totalLiabilitiesTrillion: 25.7,
        netWealthTrillion: 164.8,
        shareOfGlobalGrossPercent: 36.0,
        assets: {
          realEstate: 72.8,
          equities: 71.2,
          bonds: 27.5,
          cash: 13.8,
          alternatives: 5.2,
        },
        macroHighlight:
          'Fed launches the fastest rate-hiking cycle in 40 years to combat 9.1% CPI inflation; 60/40 equity/bond portfolios suffer dual drawdowns.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 114.5,
        totalLiabilitiesTrillion: 15.4,
        netWealthTrillion: 99.1,
        shareOfGlobalGrossPercent: 21.7,
        assets: {
          realEstate: 52.8,
          equities: 22.8,
          bonds: 22.5,
          cash: 12.2,
          alternatives: 4.2,
        },
        macroHighlight:
          'Russian invasion of Ukraine triggers European energy crisis and highest regional consumer inflation in half a century.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 15.2,
        totalLiabilitiesTrillion: 2.1,
        netWealthTrillion: 13.1,
        shareOfGlobalGrossPercent: 2.9,
        assets: {
          realEstate: 6.8,
          equities: 2.0,
          bonds: 2.2,
          cash: 3.3,
          alternatives: 0.9,
        },
        macroHighlight:
          'Latin American central banks raise policy rates ahead of the Fed, insulating regional currencies during the global dollar rally.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 14.2,
        totalLiabilitiesTrillion: 1.9,
        netWealthTrillion: 12.3,
        shareOfGlobalGrossPercent: 2.7,
        assets: {
          realEstate: 6.1,
          equities: 2.0,
          bonds: 2.0,
          cash: 3.1,
          alternatives: 1.0,
        },
        macroHighlight:
          'Hydrocarbon windfall from $100+ oil fuels massive capital investment programs and sovereign wealth accumulation in the Gulf.',
      },
    },
  },
  {
    year: 2024,
    totalGlobalGrossTrillion: 574.0,
    totalGlobalLiabilitiesTrillion: 74.0,
    totalGlobalNetWealthTrillion: 500.0,
    regions: {
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 209.5,
        totalLiabilitiesTrillion: 27.0,
        netWealthTrillion: 182.5,
        shareOfGlobalGrossPercent: 36.5,
        assets: {
          realEstate: 128.5,
          equities: 33.5,
          bonds: 22.5,
          cash: 20.2,
          alternatives: 4.8,
        },
        macroHighlight:
          'India emerges as the fastest-growing major economy; Japan ends eight years of negative interest rates; China enacts property stabilization.',
      },
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 207.5,
        totalLiabilitiesTrillion: 26.8,
        netWealthTrillion: 180.7,
        shareOfGlobalGrossPercent: 36.1,
        assets: {
          realEstate: 74.5,
          equities: 84.5,
          bonds: 28.5,
          cash: 13.8,
          alternatives: 6.2,
        },
        macroHighlight:
          'Artificial intelligence supercycle drives S&P 500 and tech mega-caps to new all-time highs; commercial real estate navigates office repricing.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 124.5,
        totalLiabilitiesTrillion: 16.0,
        netWealthTrillion: 108.5,
        shareOfGlobalGrossPercent: 21.7,
        assets: {
          realEstate: 57.5,
          equities: 24.5,
          bonds: 25.0,
          cash: 13.0,
          alternatives: 4.5,
        },
        macroHighlight:
          'ECB initiates monetary policy easing as inflation cools; European defense and green energy capital investment ramps up.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 16.8,
        totalLiabilitiesTrillion: 2.2,
        netWealthTrillion: 14.6,
        shareOfGlobalGrossPercent: 2.9,
        assets: {
          realEstate: 7.8,
          equities: 2.2,
          bonds: 2.2,
          cash: 3.6,
          alternatives: 1.0,
        },
        macroHighlight:
          'Nearshoring foreign direct investment benefits Mexican manufacturing; critical lithium mineral reserves attract global capital.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 15.7,
        totalLiabilitiesTrillion: 2.0,
        netWealthTrillion: 13.7,
        shareOfGlobalGrossPercent: 2.7,
        assets: {
          realEstate: 7.2,
          equities: 2.3,
          bonds: 2.2,
          cash: 2.9,
          alternatives: 1.1,
        },
        macroHighlight:
          'Expansion of the BRICS coalition (UAE, Saudi, Egypt, Iran); Gulf financial centers accelerate regional wealth management magnet status.',
      },
    },
  },
  {
    year: 2025,
    totalGlobalGrossTrillion: 597.5,
    totalGlobalLiabilitiesTrillion: 75.7,
    totalGlobalNetWealthTrillion: 521.8,
    regions: {
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 217.5,
        totalLiabilitiesTrillion: 27.6,
        netWealthTrillion: 189.9,
        shareOfGlobalGrossPercent: 36.4,
        assets: {
          realEstate: 133.5,
          equities: 35.5,
          bonds: 23.5,
          cash: 20.0,
          alternatives: 5.0,
        },
        macroHighlight:
          'Broad-based Asian semiconductor and electronics supply chains benefit from global enterprise AI infrastructure buildout.',
      },
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 216.0,
        totalLiabilitiesTrillion: 27.4,
        netWealthTrillion: 188.6,
        shareOfGlobalGrossPercent: 36.1,
        assets: {
          realEstate: 76.5,
          equities: 89.0,
          bonds: 29.8,
          cash: 14.2,
          alternatives: 6.5,
        },
        macroHighlight:
          'US monetary easing cycle broadens market breadth beyond mega-caps into mid-caps, private credit, and housing liquidity.',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 129.5,
        totalLiabilitiesTrillion: 16.4,
        netWealthTrillion: 113.1,
        shareOfGlobalGrossPercent: 21.7,
        assets: {
          realEstate: 60.5,
          equities: 25.5,
          bonds: 25.8,
          cash: 13.0,
          alternatives: 4.7,
        },
        macroHighlight:
          'Capital Markets Union integration efforts accelerate to retain European tech innovators and institutional risk capital.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 17.8,
        totalLiabilitiesTrillion: 2.3,
        netWealthTrillion: 15.5,
        shareOfGlobalGrossPercent: 3.0,
        assets: {
          realEstate: 8.3,
          equities: 2.3,
          bonds: 2.3,
          cash: 3.8,
          alternatives: 1.1,
        },
        macroHighlight:
          'Renewable energy buildouts and copper demand for electrification support Andean economic balance sheets.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 16.7,
        totalLiabilitiesTrillion: 2.0,
        netWealthTrillion: 14.7,
        shareOfGlobalGrossPercent: 2.8,
        assets: {
          realEstate: 7.7,
          equities: 2.4,
          bonds: 2.2,
          cash: 3.1,
          alternatives: 1.3,
        },
        macroHighlight:
          'Giga-project deliveries across Riyadh and Abu Dhabi attract high-net-worth global residency and family offices.',
      },
    },
  },
  {
    year: 2026,
    totalGlobalGrossTrillion: 624.4,
    totalGlobalLiabilitiesTrillion: 78.2,
    totalGlobalNetWealthTrillion: 546.2,
    regions: {
      'asia-pacific': {
        regionId: 'asia-pacific',
        name: 'Asia-Pacific',
        totalGrossAssetsTrillion: 227.4,
        totalLiabilitiesTrillion: 30.2,
        netWealthTrillion: 197.2,
        shareOfGlobalGrossPercent: 36.4,
        assets: {
          realEstate: 139.5,
          equities: 37.5,
          bonds: 24.5,
          cash: 20.5,
          alternatives: 5.4,
        },
        macroHighlight:
          'Holds 46.9% of world real estate value ($139.5T); fastest growing consumer middle class with rising financial market depth.',
      },
      'north-america': {
        regionId: 'north-america',
        name: 'North America',
        totalGrossAssetsTrillion: 224.0,
        totalLiabilitiesTrillion: 26.5,
        netWealthTrillion: 197.5,
        shareOfGlobalGrossPercent: 35.9,
        assets: {
          realEstate: 62.2,
          equities: 93.5,
          bonds: 41.5,
          cash: 19.5,
          alternatives: 7.3,
        },
        macroHighlight:
          'Dominates global equities with 56.5% of world corporate equity capitalization ($93.5T of $165.5T global total).',
      },
      'europe': {
        regionId: 'europe',
        name: 'Europe',
        totalGrossAssetsTrillion: 123.0,
        totalLiabilitiesTrillion: 15.5,
        netWealthTrillion: 107.5,
        shareOfGlobalGrossPercent: 19.7,
        assets: {
          realEstate: 63.5,
          equities: 27.5,
          bonds: 18.0,
          cash: 10.5,
          alternatives: 3.5,
        },
        macroHighlight:
          'Steady wealth preservation hub; holds $63.5T in premium real estate with disciplined household mortgage leverage.',
      },
      'latin-america': {
        regionId: 'latin-america',
        name: 'Latin America',
        totalGrossAssetsTrillion: 25.5,
        totalLiabilitiesTrillion: 3.2,
        netWealthTrillion: 22.3,
        shareOfGlobalGrossPercent: 4.1,
        assets: {
          realEstate: 16.5,
          equities: 3.4,
          bonds: 2.1,
          cash: 2.1,
          alternatives: 1.4,
        },
        macroHighlight:
          'Global green transition powerhouse; strategic agro-industrial and energy exporter with real asset depth.',
      },
      'middle-east-africa': {
        regionId: 'middle-east-africa',
        name: 'Middle East & Africa',
        totalGrossAssetsTrillion: 24.5,
        totalLiabilitiesTrillion: 2.8,
        netWealthTrillion: 21.7,
        shareOfGlobalGrossPercent: 3.9,
        assets: {
          realEstate: 15.5,
          equities: 3.6,
          bonds: 1.9,
          cash: 1.7,
          alternatives: 1.8,
        },
        macroHighlight:
          'Apex sovereign wealth liquidity hub; highest allocation to physical gold reserves and state-backed development funds.',
      },
    },
  },
];

/*
 * Asset class presentation configurations.
 * Used for dynamic switching between "By Region" and "By Asset Class" views.
 */
export interface AssetClassMeta {
  key: keyof RegionalAssetMix;
  name: string;
  description: string;
  color: string;
  globalTotal2026: number;
}

export const ASSET_CLASS_META: Record<keyof RegionalAssetMix, AssetClassMeta> = {
  realEstate: {
    key: 'realEstate',
    name: 'Real Estate & Land',
    description: 'Residential houses, commercial properties, and productive arable land.',
    color: '#10b981', // Emerald
    globalTotal2026: 297.2,
  },
  equities: {
    key: 'equities',
    name: 'Public & Private Equities',
    description: 'Corporate equity shares, index mutual funds, and private venture capital.',
    color: '#06b6d4', // Cyan
    globalTotal2026: 165.5,
  },
  bonds: {
    key: 'bonds',
    name: 'Bonds & Fixed Income',
    description: 'Sovereign treasuries, corporate notes, and institutional pension reserves.',
    color: '#818cf8', // Indigo
    globalTotal2026: 88.0,
  },
  cash: {
    key: 'cash',
    name: 'Cash & Liquid Deposits',
    description: 'Commercial bank checking/savings deposits, currency, and money market funds.',
    color: '#f59e0b', // Amber
    globalTotal2026: 54.3,
  },
  alternatives: {
    key: 'alternatives',
    name: 'Gold, Crypto & Alternatives',
    description: 'Monetary bullion, decentralized digital assets, and physical commodities.',
    color: '#ec4899', // Pink
    globalTotal2026: 19.4,
  },
};

/*
 * Retrieves the regional snapshot for a selected calendar year.
 * Defaults to 2026 if an out-of-range year is requested.
 */
export function getRegionalDataForYear(year: number): RegionalAssetYear {
  return (
    REGIONAL_ASSET_HISTORY.find((item) => item.year === year) ||
    REGIONAL_ASSET_HISTORY[REGIONAL_ASSET_HISTORY.length - 1]
  );
}

/*
 * Returns the longitudinal timeline of an asset class across all 5 regions,
 * showing how geographic ownership shifted between 1980 and 2026.
 */
export function getHistoricalAssetClassByRegion(
  assetKey: keyof RegionalAssetMix
) {
  return REGIONAL_ASSET_HISTORY.map((item) => {
    const naVal = item.regions['north-america'].assets[assetKey];
    const apVal = item.regions['asia-pacific'].assets[assetKey];
    const euVal = item.regions['europe'].assets[assetKey];
    const laVal = item.regions['latin-america'].assets[assetKey];
    const meVal = item.regions['middle-east-africa'].assets[assetKey];
    const total = naVal + apVal + euVal + laVal + meVal;

    return {
      year: item.year,
      total,
      'north-america': naVal,
      'asia-pacific': apVal,
      'europe': euVal,
      'latin-america': laVal,
      'middle-east-africa': meVal,
      // Percentage shares for 100% normalized view
      'north-america-pct': total > 0 ? (naVal / total) * 100 : 0,
      'asia-pacific-pct': total > 0 ? (apVal / total) * 100 : 0,
      'europe-pct': total > 0 ? (euVal / total) * 100 : 0,
      'latin-america-pct': total > 0 ? (laVal / total) * 100 : 0,
      'middle-east-africa-pct': total > 0 ? (meVal / total) * 100 : 0,
    };
  });
}
