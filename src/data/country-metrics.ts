import { CountryProfile, EconomicBloc } from '../lib/types';

/*
 * Country profiles cover 31 major global economies across all inhabited continents.
 * Historical data spanning 1980 through 2026 captures multi-decade structural transitions:
 * Japan's 1980s bubble, China's ascent, European integration, the 2008 GFC,
 * the 2020 pandemic fiscal expansions, and current 2024-2026 rate normalizations.
 * Curated from UBS/Credit Suisse Global Wealth Reports, WID.world, World Bank, and IMF WEO.
 */
export const COUNTRIES_DATA: CountryProfile[] = [
  {
    "code": "USA",
    "name": "United States",
    "region": "North America",
    "blocs": [
      "g7",
      "usmca"
    ],
    "flag": "🇺🇸",
    "coordinates": [
      -95.71,
      37.09
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 10.5,
        "wealthPerAdultUSD": 67500,
        "medianWealthUSD": 22400,
        "gdpTrillionUSD": 2.86,
        "gdpPerCapitaUSD": 12570,
        "inflationRate": 13.5,
        "debtToGdp": 32,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 61.5,
          "nonFinancialShare": 52,
          "debtShareOfGross": 13.5
        }
      },
      "1990": {
        "totalWealthTrillion": 21.2,
        "wealthPerAdultUSD": 114000,
        "medianWealthUSD": 33500,
        "gdpTrillionUSD": 5.96,
        "gdpPerCapitaUSD": 23890,
        "inflationRate": 5.4,
        "debtToGdp": 56,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 64.8,
          "nonFinancialShare": 49.2,
          "debtShareOfGross": 14
        }
      },
      "1995": {
        "totalWealthTrillion": 28.4,
        "wealthPerAdultUSD": 145000,
        "medianWealthUSD": 38200,
        "gdpTrillionUSD": 7.64,
        "gdpPerCapitaUSD": 28690,
        "inflationRate": 2.8,
        "debtToGdp": 65,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 66.2,
          "nonFinancialShare": 47.8,
          "debtShareOfGross": 14
        }
      },
      "2000": {
        "totalWealthTrillion": 42.8,
        "wealthPerAdultUSD": 204500,
        "medianWealthUSD": 44200,
        "gdpTrillionUSD": 10.25,
        "gdpPerCapitaUSD": 36330,
        "inflationRate": 3.4,
        "debtToGdp": 55,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 68.2,
          "nonFinancialShare": 46.1,
          "debtShareOfGross": 14.3
        }
      },
      "2010": {
        "totalWealthTrillion": 60.2,
        "wealthPerAdultUSD": 262300,
        "medianWealthUSD": 52100,
        "gdpTrillionUSD": 15.05,
        "gdpPerCapitaUSD": 48460,
        "inflationRate": 1.6,
        "debtToGdp": 86,
        "gini": 0.85,
        "assetMix": {
          "financialShare": 70.4,
          "nonFinancialShare": 44.8,
          "debtShareOfGross": 15.2
        }
      },
      "2020": {
        "totalWealthTrillion": 126.3,
        "wealthPerAdultUSD": 494500,
        "medianWealthUSD": 79200,
        "gdpTrillionUSD": 21.06,
        "gdpPerCapitaUSD": 63590,
        "inflationRate": 1.2,
        "debtToGdp": 128,
        "gini": 0.85,
        "assetMix": {
          "financialShare": 72.8,
          "nonFinancialShare": 39.5,
          "debtShareOfGross": 12.3
        }
      },
      "2022": {
        "totalWealthTrillion": 139.8,
        "wealthPerAdultUSD": 531800,
        "medianWealthUSD": 107700,
        "gdpTrillionUSD": 25.44,
        "gdpPerCapitaUSD": 76330,
        "inflationRate": 8,
        "debtToGdp": 121,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 71.5,
          "nonFinancialShare": 40.8,
          "debtShareOfGross": 12.3
        }
      },
      "2025": {
        "totalWealthTrillion": 158.4,
        "wealthPerAdultUSD": 595000,
        "medianWealthUSD": 118400,
        "gdpTrillionUSD": 29.15,
        "gdpPerCapitaUSD": 85200,
        "inflationRate": 2.8,
        "debtToGdp": 123.5,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 72.1,
          "nonFinancialShare": 40.1,
          "debtShareOfGross": 12.2
        }
      },
      "2026": {
        "totalWealthTrillion": 164.8,
        "wealthPerAdultUSD": 618000,
        "medianWealthUSD": 122500,
        "gdpTrillionUSD": 30.45,
        "gdpPerCapitaUSD": 88700,
        "inflationRate": 2.5,
        "debtToGdp": 124,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 72.4,
          "nonFinancialShare": 39.8,
          "debtShareOfGross": 12.2
        }
      }
    }
  },
  {
    "code": "CHN",
    "name": "China",
    "region": "East Asia",
    "blocs": [
      "brics"
    ],
    "flag": "🇨🇳",
    "coordinates": [
      104.19,
      35.86
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.52,
        "wealthPerAdultUSD": 890,
        "medianWealthUSD": 420,
        "gdpTrillionUSD": 0.19,
        "gdpPerCapitaUSD": 195,
        "inflationRate": 6,
        "debtToGdp": 15,
        "gini": 0.48,
        "assetMix": {
          "financialShare": 24,
          "nonFinancialShare": 80,
          "debtShareOfGross": 4
        }
      },
      "1990": {
        "totalWealthTrillion": 1.45,
        "wealthPerAdultUSD": 1850,
        "medianWealthUSD": 950,
        "gdpTrillionUSD": 0.36,
        "gdpPerCapitaUSD": 318,
        "inflationRate": 2.1,
        "debtToGdp": 19,
        "gini": 0.52,
        "assetMix": {
          "financialShare": 30,
          "nonFinancialShare": 74,
          "debtShareOfGross": 4
        }
      },
      "1995": {
        "totalWealthTrillion": 2.6,
        "wealthPerAdultUSD": 3120,
        "medianWealthUSD": 1540,
        "gdpTrillionUSD": 0.73,
        "gdpPerCapitaUSD": 610,
        "inflationRate": 17.1,
        "debtToGdp": 21,
        "gini": 0.55,
        "assetMix": {
          "financialShare": 34,
          "nonFinancialShare": 70,
          "debtShareOfGross": 4
        }
      },
      "2000": {
        "totalWealthTrillion": 4.6,
        "wealthPerAdultUSD": 5120,
        "medianWealthUSD": 2310,
        "gdpTrillionUSD": 1.21,
        "gdpPerCapitaUSD": 959,
        "inflationRate": 0.4,
        "debtToGdp": 23,
        "gini": 0.59,
        "assetMix": {
          "financialShare": 38,
          "nonFinancialShare": 67,
          "debtShareOfGross": 5
        }
      },
      "2010": {
        "totalWealthTrillion": 24.3,
        "wealthPerAdultUSD": 23900,
        "medianWealthUSD": 11200,
        "gdpTrillionUSD": 6.09,
        "gdpPerCapitaUSD": 4550,
        "inflationRate": 3.3,
        "debtToGdp": 34,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 45,
          "nonFinancialShare": 61,
          "debtShareOfGross": 6
        }
      },
      "2020": {
        "totalWealthTrillion": 74.8,
        "wealthPerAdultUSD": 67400,
        "medianWealthUSD": 26750,
        "gdpTrillionUSD": 14.69,
        "gdpPerCapitaUSD": 10400,
        "inflationRate": 2.4,
        "debtToGdp": 68,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 46.5,
          "nonFinancialShare": 59.5,
          "debtShareOfGross": 6
        }
      },
      "2022": {
        "totalWealthTrillion": 84.5,
        "wealthPerAdultUSD": 75130,
        "medianWealthUSD": 27270,
        "gdpTrillionUSD": 17.96,
        "gdpPerCapitaUSD": 12720,
        "inflationRate": 2,
        "debtToGdp": 77,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 45.8,
          "nonFinancialShare": 60.5,
          "debtShareOfGross": 6.3
        }
      },
      "2025": {
        "totalWealthTrillion": 92.1,
        "wealthPerAdultUSD": 81500,
        "medianWealthUSD": 30400,
        "gdpTrillionUSD": 19.85,
        "gdpPerCapitaUSD": 14100,
        "inflationRate": 1.1,
        "debtToGdp": 83.2,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 46.2,
          "nonFinancialShare": 59.8,
          "debtShareOfGross": 6
        }
      },
      "2026": {
        "totalWealthTrillion": 95.8,
        "wealthPerAdultUSD": 84900,
        "medianWealthUSD": 31800,
        "gdpTrillionUSD": 20.85,
        "gdpPerCapitaUSD": 14850,
        "inflationRate": 1.2,
        "debtToGdp": 85,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 46.5,
          "nonFinancialShare": 59.5,
          "debtShareOfGross": 6
        }
      }
    }
  },
  {
    "code": "DEU",
    "name": "Germany",
    "region": "Europe",
    "blocs": [
      "g7",
      "eurozone"
    ],
    "flag": "🇩🇪",
    "coordinates": [
      10.45,
      51.16
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 2.8,
        "wealthPerAdultUSD": 46500,
        "medianWealthUSD": 16800,
        "gdpTrillionUSD": 0.85,
        "gdpPerCapitaUSD": 10900,
        "inflationRate": 5.4,
        "debtToGdp": 30,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 44,
          "nonFinancialShare": 67,
          "debtShareOfGross": 11
        }
      },
      "1990": {
        "totalWealthTrillion": 4.8,
        "wealthPerAdultUSD": 74200,
        "medianWealthUSD": 24800,
        "gdpTrillionUSD": 1.59,
        "gdpPerCapitaUSD": 20100,
        "inflationRate": 2.7,
        "debtToGdp": 41,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 47,
          "nonFinancialShare": 65,
          "debtShareOfGross": 12
        }
      },
      "1995": {
        "totalWealthTrillion": 5.9,
        "wealthPerAdultUSD": 89100,
        "medianWealthUSD": 29500,
        "gdpTrillionUSD": 2.59,
        "gdpPerCapitaUSD": 31700,
        "inflationRate": 1.8,
        "debtToGdp": 55,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 48,
          "nonFinancialShare": 64.5,
          "debtShareOfGross": 12.5
        }
      },
      "2000": {
        "totalWealthTrillion": 7.2,
        "wealthPerAdultUSD": 106200,
        "medianWealthUSD": 34100,
        "gdpTrillionUSD": 1.95,
        "gdpPerCapitaUSD": 23720,
        "inflationRate": 1.4,
        "debtToGdp": 59,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 49,
          "nonFinancialShare": 64,
          "debtShareOfGross": 13
        }
      },
      "2010": {
        "totalWealthTrillion": 11.5,
        "wealthPerAdultUSD": 169000,
        "medianWealthUSD": 48900,
        "gdpTrillionUSD": 3.42,
        "gdpPerCapitaUSD": 41780,
        "inflationRate": 1.1,
        "debtToGdp": 82,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 50.5,
          "nonFinancialShare": 62.5,
          "debtShareOfGross": 13
        }
      },
      "2020": {
        "totalWealthTrillion": 16.4,
        "wealthPerAdultUSD": 236800,
        "medianWealthUSD": 65400,
        "gdpTrillionUSD": 3.89,
        "gdpPerCapitaUSD": 46780,
        "inflationRate": 0.5,
        "debtToGdp": 68.7,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 51.2,
          "nonFinancialShare": 61.2,
          "debtShareOfGross": 12.4
        }
      },
      "2022": {
        "totalWealthTrillion": 17.4,
        "wealthPerAdultUSD": 256180,
        "medianWealthUSD": 66730,
        "gdpTrillionUSD": 4.08,
        "gdpPerCapitaUSD": 48720,
        "inflationRate": 8.7,
        "debtToGdp": 66.1,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 50.8,
          "nonFinancialShare": 61.8,
          "debtShareOfGross": 12.6
        }
      },
      "2025": {
        "totalWealthTrillion": 19.3,
        "wealthPerAdultUSD": 279500,
        "medianWealthUSD": 74200,
        "gdpTrillionUSD": 4.62,
        "gdpPerCapitaUSD": 54800,
        "inflationRate": 2.3,
        "debtToGdp": 63.8,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 51.5,
          "nonFinancialShare": 61,
          "debtShareOfGross": 12.5
        }
      },
      "2026": {
        "totalWealthTrillion": 20.1,
        "wealthPerAdultUSD": 289000,
        "medianWealthUSD": 77100,
        "gdpTrillionUSD": 4.78,
        "gdpPerCapitaUSD": 56600,
        "inflationRate": 2.1,
        "debtToGdp": 63.2,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 51.8,
          "nonFinancialShare": 60.7,
          "debtShareOfGross": 12.5
        }
      }
    }
  },
  {
    "code": "JPN",
    "name": "Japan",
    "region": "East Asia",
    "blocs": [
      "g7"
    ],
    "flag": "🇯🇵",
    "coordinates": [
      138.25,
      36.2
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 5.4,
        "wealthPerAdultUSD": 61200,
        "medianWealthUSD": 38500,
        "gdpTrillionUSD": 1.11,
        "gdpPerCapitaUSD": 9480,
        "inflationRate": 7.8,
        "debtToGdp": 52,
        "gini": 0.58,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 54,
          "debtShareOfGross": 9
        }
      },
      "1990": {
        "totalWealthTrillion": 14.8,
        "wealthPerAdultUSD": 152000,
        "medianWealthUSD": 89000,
        "gdpTrillionUSD": 3.19,
        "gdpPerCapitaUSD": 25800,
        "inflationRate": 3.1,
        "debtToGdp": 67,
        "gini": 0.6,
        "assetMix": {
          "financialShare": 58,
          "nonFinancialShare": 53,
          "debtShareOfGross": 11
        }
      },
      "1995": {
        "totalWealthTrillion": 18.2,
        "wealthPerAdultUSD": 179000,
        "medianWealthUSD": 101000,
        "gdpTrillionUSD": 5.55,
        "gdpPerCapitaUSD": 44200,
        "inflationRate": -0.1,
        "debtToGdp": 95,
        "gini": 0.61,
        "assetMix": {
          "financialShare": 60,
          "nonFinancialShare": 51,
          "debtShareOfGross": 11
        }
      },
      "2000": {
        "totalWealthTrillion": 19.2,
        "wealthPerAdultUSD": 186400,
        "medianWealthUSD": 104200,
        "gdpTrillionUSD": 4.89,
        "gdpPerCapitaUSD": 38530,
        "inflationRate": -0.7,
        "debtToGdp": 136,
        "gini": 0.62,
        "assetMix": {
          "financialShare": 61,
          "nonFinancialShare": 51,
          "debtShareOfGross": 12
        }
      },
      "2010": {
        "totalWealthTrillion": 24.5,
        "wealthPerAdultUSD": 232000,
        "medianWealthUSD": 123500,
        "gdpTrillionUSD": 5.7,
        "gdpPerCapitaUSD": 44510,
        "inflationRate": -0.7,
        "debtToGdp": 207,
        "gini": 0.63,
        "assetMix": {
          "financialShare": 62.5,
          "nonFinancialShare": 49.5,
          "debtShareOfGross": 12
        }
      },
      "2020": {
        "totalWealthTrillion": 26.9,
        "wealthPerAdultUSD": 256600,
        "medianWealthUSD": 119800,
        "gdpTrillionUSD": 5.04,
        "gdpPerCapitaUSD": 39920,
        "inflationRate": 0,
        "debtToGdp": 259,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 64,
          "nonFinancialShare": 47,
          "debtShareOfGross": 11
        }
      },
      "2022": {
        "totalWealthTrillion": 22.6,
        "wealthPerAdultUSD": 216080,
        "medianWealthUSD": 103680,
        "gdpTrillionUSD": 4.23,
        "gdpPerCapitaUSD": 33820,
        "inflationRate": 2.5,
        "debtToGdp": 261,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 63.8,
          "nonFinancialShare": 47.4,
          "debtShareOfGross": 11.2
        }
      },
      "2025": {
        "totalWealthTrillion": 24.8,
        "wealthPerAdultUSD": 238000,
        "medianWealthUSD": 114500,
        "gdpTrillionUSD": 4.41,
        "gdpPerCapitaUSD": 35700,
        "inflationRate": 2.2,
        "debtToGdp": 255,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 64.2,
          "nonFinancialShare": 47,
          "debtShareOfGross": 11.2
        }
      },
      "2026": {
        "totalWealthTrillion": 25.5,
        "wealthPerAdultUSD": 245000,
        "medianWealthUSD": 117500,
        "gdpTrillionUSD": 4.52,
        "gdpPerCapitaUSD": 36800,
        "inflationRate": 2,
        "debtToGdp": 252,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 64.5,
          "nonFinancialShare": 46.7,
          "debtShareOfGross": 11.2
        }
      }
    }
  },
  {
    "code": "GBR",
    "name": "United Kingdom",
    "region": "Europe",
    "blocs": [
      "g7"
    ],
    "flag": "🇬🇧",
    "coordinates": [
      -3.43,
      55.37
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 1.9,
        "wealthPerAdultUSD": 43200,
        "medianWealthUSD": 19800,
        "gdpTrillionUSD": 0.61,
        "gdpPerCapitaUSD": 10800,
        "inflationRate": 18,
        "debtToGdp": 45,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 50,
          "nonFinancialShare": 60,
          "debtShareOfGross": 10
        }
      },
      "1990": {
        "totalWealthTrillion": 4.2,
        "wealthPerAdultUSD": 94500,
        "medianWealthUSD": 43200,
        "gdpTrillionUSD": 1.09,
        "gdpPerCapitaUSD": 19100,
        "inflationRate": 8,
        "debtToGdp": 31,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 52,
          "nonFinancialShare": 60,
          "debtShareOfGross": 12
        }
      },
      "1995": {
        "totalWealthTrillion": 5.3,
        "wealthPerAdultUSD": 118000,
        "medianWealthUSD": 54000,
        "gdpTrillionUSD": 1.35,
        "gdpPerCapitaUSD": 23200,
        "inflationRate": 2.6,
        "debtToGdp": 39,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 53,
          "nonFinancialShare": 59.5,
          "debtShareOfGross": 12.5
        }
      },
      "2000": {
        "totalWealthTrillion": 6.8,
        "wealthPerAdultUSD": 148900,
        "medianWealthUSD": 68400,
        "gdpTrillionUSD": 1.66,
        "gdpPerCapitaUSD": 28200,
        "inflationRate": 1.2,
        "debtToGdp": 37,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 59,
          "debtShareOfGross": 13
        }
      },
      "2010": {
        "totalWealthTrillion": 11.2,
        "wealthPerAdultUSD": 228000,
        "medianWealthUSD": 107000,
        "gdpTrillionUSD": 2.48,
        "gdpPerCapitaUSD": 39400,
        "inflationRate": 2.5,
        "debtToGdp": 76,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 53,
          "nonFinancialShare": 61,
          "debtShareOfGross": 14
        }
      },
      "2020": {
        "totalWealthTrillion": 15.3,
        "wealthPerAdultUSD": 290700,
        "medianWealthUSD": 131500,
        "gdpTrillionUSD": 2.71,
        "gdpPerCapitaUSD": 40300,
        "inflationRate": 0.9,
        "debtToGdp": 104,
        "gini": 0.71,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 58,
          "debtShareOfGross": 13
        }
      },
      "2022": {
        "totalWealthTrillion": 16,
        "wealthPerAdultUSD": 302780,
        "medianWealthUSD": 151820,
        "gdpTrillionUSD": 3.08,
        "gdpPerCapitaUSD": 45750,
        "inflationRate": 9.1,
        "debtToGdp": 101,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 54.5,
          "nonFinancialShare": 58.5,
          "debtShareOfGross": 13
        }
      },
      "2025": {
        "totalWealthTrillion": 17.6,
        "wealthPerAdultUSD": 328000,
        "medianWealthUSD": 164000,
        "gdpTrillionUSD": 3.49,
        "gdpPerCapitaUSD": 51200,
        "inflationRate": 2.5,
        "debtToGdp": 99.4,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 55.1,
          "nonFinancialShare": 58,
          "debtShareOfGross": 13.1
        }
      },
      "2026": {
        "totalWealthTrillion": 18.3,
        "wealthPerAdultUSD": 339000,
        "medianWealthUSD": 169500,
        "gdpTrillionUSD": 3.62,
        "gdpPerCapitaUSD": 52900,
        "inflationRate": 2.2,
        "debtToGdp": 98.6,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 55.3,
          "nonFinancialShare": 57.8,
          "debtShareOfGross": 13.1
        }
      }
    }
  },
  {
    "code": "IND",
    "name": "India",
    "region": "South Asia",
    "blocs": [
      "brics"
    ],
    "flag": "🇮🇳",
    "coordinates": [
      78.96,
      20.59
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.28,
        "wealthPerAdultUSD": 720,
        "medianWealthUSD": 310,
        "gdpTrillionUSD": 0.19,
        "gdpPerCapitaUSD": 266,
        "inflationRate": 11.3,
        "debtToGdp": 48,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 11,
          "nonFinancialShare": 91,
          "debtShareOfGross": 2
        }
      },
      "1990": {
        "totalWealthTrillion": 0.62,
        "wealthPerAdultUSD": 1240,
        "medianWealthUSD": 530,
        "gdpTrillionUSD": 0.32,
        "gdpPerCapitaUSD": 368,
        "inflationRate": 9,
        "debtToGdp": 68,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 12.5,
          "nonFinancialShare": 90,
          "debtShareOfGross": 2.5
        }
      },
      "1995": {
        "totalWealthTrillion": 0.85,
        "wealthPerAdultUSD": 1540,
        "medianWealthUSD": 660,
        "gdpTrillionUSD": 0.36,
        "gdpPerCapitaUSD": 374,
        "inflationRate": 10.2,
        "debtToGdp": 69,
        "gini": 0.73,
        "assetMix": {
          "financialShare": 13,
          "nonFinancialShare": 89.5,
          "debtShareOfGross": 2.5
        }
      },
      "2000": {
        "totalWealthTrillion": 1.2,
        "wealthPerAdultUSD": 1980,
        "medianWealthUSD": 850,
        "gdpTrillionUSD": 0.47,
        "gdpPerCapitaUSD": 443,
        "inflationRate": 4,
        "debtToGdp": 73,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 14,
          "nonFinancialShare": 89,
          "debtShareOfGross": 3
        }
      },
      "2010": {
        "totalWealthTrillion": 4.1,
        "wealthPerAdultUSD": 5400,
        "medianWealthUSD": 2150,
        "gdpTrillionUSD": 1.68,
        "gdpPerCapitaUSD": 1357,
        "inflationRate": 12,
        "debtToGdp": 66,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 16,
          "nonFinancialShare": 87,
          "debtShareOfGross": 3
        }
      },
      "2020": {
        "totalWealthTrillion": 12.8,
        "wealthPerAdultUSD": 14250,
        "medianWealthUSD": 3450,
        "gdpTrillionUSD": 2.67,
        "gdpPerCapitaUSD": 1930,
        "inflationRate": 6.2,
        "debtToGdp": 88.5,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 18,
          "nonFinancialShare": 85,
          "debtShareOfGross": 3
        }
      },
      "2022": {
        "totalWealthTrillion": 15.4,
        "wealthPerAdultUSD": 16500,
        "medianWealthUSD": 3750,
        "gdpTrillionUSD": 3.39,
        "gdpPerCapitaUSD": 2410,
        "inflationRate": 6.7,
        "debtToGdp": 83.1,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 19.5,
          "nonFinancialShare": 83.5,
          "debtShareOfGross": 3
        }
      },
      "2025": {
        "totalWealthTrillion": 19.8,
        "wealthPerAdultUSD": 20400,
        "medianWealthUSD": 4620,
        "gdpTrillionUSD": 4.28,
        "gdpPerCapitaUSD": 2980,
        "inflationRate": 4.5,
        "debtToGdp": 81,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 21,
          "nonFinancialShare": 82,
          "debtShareOfGross": 3
        }
      },
      "2026": {
        "totalWealthTrillion": 21.5,
        "wealthPerAdultUSD": 21900,
        "medianWealthUSD": 4980,
        "gdpTrillionUSD": 4.65,
        "gdpPerCapitaUSD": 3210,
        "inflationRate": 4.2,
        "debtToGdp": 80.2,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 21.5,
          "nonFinancialShare": 81.5,
          "debtShareOfGross": 3
        }
      }
    }
  },
  {
    "code": "FRA",
    "name": "France",
    "region": "Europe",
    "blocs": [
      "g7",
      "eurozone"
    ],
    "flag": "🇫🇷",
    "coordinates": [
      2.21,
      46.22
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 1.8,
        "wealthPerAdultUSD": 45200,
        "medianWealthUSD": 21500,
        "gdpTrillionUSD": 0.7,
        "gdpPerCapitaUSD": 12900,
        "inflationRate": 13.6,
        "debtToGdp": 21,
        "gini": 0.67,
        "assetMix": {
          "financialShare": 40,
          "nonFinancialShare": 68,
          "debtShareOfGross": 8
        }
      },
      "1990": {
        "totalWealthTrillion": 3.4,
        "wealthPerAdultUSD": 78500,
        "medianWealthUSD": 37200,
        "gdpTrillionUSD": 1.27,
        "gdpPerCapitaUSD": 21700,
        "inflationRate": 3.4,
        "debtToGdp": 35,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 41.5,
          "nonFinancialShare": 67.5,
          "debtShareOfGross": 9
        }
      },
      "1995": {
        "totalWealthTrillion": 4.1,
        "wealthPerAdultUSD": 91800,
        "medianWealthUSD": 43500,
        "gdpTrillionUSD": 1.6,
        "gdpPerCapitaUSD": 27000,
        "inflationRate": 1.8,
        "debtToGdp": 56,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 67.5,
          "debtShareOfGross": 9.5
        }
      },
      "2000": {
        "totalWealthTrillion": 4.7,
        "wealthPerAdultUSD": 104500,
        "medianWealthUSD": 49800,
        "gdpTrillionUSD": 1.37,
        "gdpPerCapitaUSD": 22530,
        "inflationRate": 1.7,
        "debtToGdp": 59,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 43,
          "nonFinancialShare": 67,
          "debtShareOfGross": 10
        }
      },
      "2010": {
        "totalWealthTrillion": 12.1,
        "wealthPerAdultUSD": 251000,
        "medianWealthUSD": 128500,
        "gdpTrillionUSD": 2.64,
        "gdpPerCapitaUSD": 40700,
        "inflationRate": 1.5,
        "debtToGdp": 85,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 69,
          "debtShareOfGross": 11
        }
      },
      "2020": {
        "totalWealthTrillion": 15,
        "wealthPerAdultUSD": 299000,
        "medianWealthUSD": 139800,
        "gdpTrillionUSD": 2.63,
        "gdpPerCapitaUSD": 39000,
        "inflationRate": 0.5,
        "debtToGdp": 115,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 44,
          "nonFinancialShare": 68,
          "debtShareOfGross": 12
        }
      },
      "2022": {
        "totalWealthTrillion": 15.7,
        "wealthPerAdultUSD": 312230,
        "medianWealthUSD": 133140,
        "gdpTrillionUSD": 2.78,
        "gdpPerCapitaUSD": 40880,
        "inflationRate": 5.2,
        "debtToGdp": 111.8,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 43.5,
          "nonFinancialShare": 68.5,
          "debtShareOfGross": 12
        }
      },
      "2025": {
        "totalWealthTrillion": 17.2,
        "wealthPerAdultUSD": 338000,
        "medianWealthUSD": 147500,
        "gdpTrillionUSD": 3.12,
        "gdpPerCapitaUSD": 45700,
        "inflationRate": 2.2,
        "debtToGdp": 112.5,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 44.2,
          "nonFinancialShare": 67.8,
          "debtShareOfGross": 12
        }
      },
      "2026": {
        "totalWealthTrillion": 17.8,
        "wealthPerAdultUSD": 348000,
        "medianWealthUSD": 152000,
        "gdpTrillionUSD": 3.24,
        "gdpPerCapitaUSD": 47200,
        "inflationRate": 2,
        "debtToGdp": 112,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 44.5,
          "nonFinancialShare": 67.5,
          "debtShareOfGross": 12
        }
      }
    }
  },
  {
    "code": "BRA",
    "name": "Brazil",
    "region": "South America",
    "blocs": [
      "brics",
      "latam"
    ],
    "flag": "🇧🇷",
    "coordinates": [
      -51.92,
      -14.23
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.35,
        "wealthPerAdultUSD": 4800,
        "medianWealthUSD": 1200,
        "gdpTrillionUSD": 0.24,
        "gdpPerCapitaUSD": 1940,
        "inflationRate": 86.3,
        "debtToGdp": 40,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 30,
          "nonFinancialShare": 75,
          "debtShareOfGross": 5
        }
      },
      "1990": {
        "totalWealthTrillion": 0.65,
        "wealthPerAdultUSD": 6800,
        "medianWealthUSD": 1700,
        "gdpTrillionUSD": 0.46,
        "gdpPerCapitaUSD": 3080,
        "inflationRate": 2947,
        "debtToGdp": 50,
        "gini": 0.8,
        "assetMix": {
          "financialShare": 32,
          "nonFinancialShare": 74,
          "debtShareOfGross": 6
        }
      },
      "1995": {
        "totalWealthTrillion": 0.92,
        "wealthPerAdultUSD": 8700,
        "medianWealthUSD": 2150,
        "gdpTrillionUSD": 0.77,
        "gdpPerCapitaUSD": 4780,
        "inflationRate": 66,
        "debtToGdp": 58,
        "gini": 0.8,
        "assetMix": {
          "financialShare": 34,
          "nonFinancialShare": 73,
          "debtShareOfGross": 7
        }
      },
      "2000": {
        "totalWealthTrillion": 1.1,
        "wealthPerAdultUSD": 10400,
        "medianWealthUSD": 2600,
        "gdpTrillionUSD": 0.65,
        "gdpPerCapitaUSD": 3740,
        "inflationRate": 7,
        "debtToGdp": 65,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 35,
          "nonFinancialShare": 72,
          "debtShareOfGross": 7
        }
      },
      "2010": {
        "totalWealthTrillion": 3.4,
        "wealthPerAdultUSD": 24700,
        "medianWealthUSD": 5200,
        "gdpTrillionUSD": 2.21,
        "gdpPerCapitaUSD": 11280,
        "inflationRate": 5,
        "debtToGdp": 61,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 39,
          "nonFinancialShare": 69,
          "debtShareOfGross": 8
        }
      },
      "2020": {
        "totalWealthTrillion": 3.3,
        "wealthPerAdultUSD": 21400,
        "medianWealthUSD": 4100,
        "gdpTrillionUSD": 1.45,
        "gdpPerCapitaUSD": 6810,
        "inflationRate": 3.2,
        "debtToGdp": 88.6,
        "gini": 0.89,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 67,
          "debtShareOfGross": 9
        }
      },
      "2022": {
        "totalWealthTrillion": 4.6,
        "wealthPerAdultUSD": 29450,
        "medianWealthUSD": 5700,
        "gdpTrillionUSD": 1.92,
        "gdpPerCapitaUSD": 8920,
        "inflationRate": 9.3,
        "debtToGdp": 85.3,
        "gini": 0.88,
        "assetMix": {
          "financialShare": 41.5,
          "nonFinancialShare": 67.5,
          "debtShareOfGross": 9
        }
      },
      "2025": {
        "totalWealthTrillion": 5.5,
        "wealthPerAdultUSD": 34500,
        "medianWealthUSD": 6900,
        "gdpTrillionUSD": 2.31,
        "gdpPerCapitaUSD": 10600,
        "inflationRate": 4.1,
        "debtToGdp": 86.8,
        "gini": 0.87,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 67,
          "debtShareOfGross": 9
        }
      },
      "2026": {
        "totalWealthTrillion": 5.9,
        "wealthPerAdultUSD": 36700,
        "medianWealthUSD": 7350,
        "gdpTrillionUSD": 2.45,
        "gdpPerCapitaUSD": 11200,
        "inflationRate": 3.8,
        "debtToGdp": 87.2,
        "gini": 0.87,
        "assetMix": {
          "financialShare": 42.2,
          "nonFinancialShare": 66.8,
          "debtShareOfGross": 9
        }
      }
    }
  },
  {
    "code": "CAN",
    "name": "Canada",
    "region": "North America",
    "blocs": [
      "g7",
      "usmca"
    ],
    "flag": "🇨🇦",
    "coordinates": [
      -106.34,
      56.13
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.75,
        "wealthPerAdultUSD": 44200,
        "medianWealthUSD": 18900,
        "gdpTrillionUSD": 0.27,
        "gdpPerCapitaUSD": 11100,
        "inflationRate": 10.2,
        "debtToGdp": 45,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 52,
          "nonFinancialShare": 62,
          "debtShareOfGross": 14
        }
      },
      "1990": {
        "totalWealthTrillion": 1.55,
        "wealthPerAdultUSD": 75600,
        "medianWealthUSD": 32400,
        "gdpTrillionUSD": 0.59,
        "gdpPerCapitaUSD": 21500,
        "inflationRate": 4.8,
        "debtToGdp": 72,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 62,
          "debtShareOfGross": 16
        }
      },
      "1995": {
        "totalWealthTrillion": 2.05,
        "wealthPerAdultUSD": 92800,
        "medianWealthUSD": 39500,
        "gdpTrillionUSD": 0.6,
        "gdpPerCapitaUSD": 20600,
        "inflationRate": 2.1,
        "debtToGdp": 100,
        "gini": 0.71,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 61.5,
          "debtShareOfGross": 16.5
        }
      },
      "2000": {
        "totalWealthTrillion": 2.6,
        "wealthPerAdultUSD": 110200,
        "medianWealthUSD": 47200,
        "gdpTrillionUSD": 0.74,
        "gdpPerCapitaUSD": 24270,
        "inflationRate": 2.7,
        "debtToGdp": 82,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 56,
          "nonFinancialShare": 61,
          "debtShareOfGross": 17
        }
      },
      "2010": {
        "totalWealthTrillion": 6.7,
        "wealthPerAdultUSD": 251000,
        "medianWealthUSD": 98500,
        "gdpTrillionUSD": 1.61,
        "gdpPerCapitaUSD": 47440,
        "inflationRate": 1.8,
        "debtToGdp": 81,
        "gini": 0.73,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 65,
          "debtShareOfGross": 20
        }
      },
      "2020": {
        "totalWealthTrillion": 9.9,
        "wealthPerAdultUSD": 332300,
        "medianWealthUSD": 125600,
        "gdpTrillionUSD": 1.64,
        "gdpPerCapitaUSD": 43260,
        "inflationRate": 0.7,
        "debtToGdp": 117.8,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 57,
          "nonFinancialShare": 65,
          "debtShareOfGross": 22
        }
      },
      "2022": {
        "totalWealthTrillion": 11.3,
        "wealthPerAdultUSD": 369580,
        "medianWealthUSD": 137630,
        "gdpTrillionUSD": 2.14,
        "gdpPerCapitaUSD": 54970,
        "inflationRate": 6.8,
        "debtToGdp": 106.6,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 56,
          "nonFinancialShare": 66,
          "debtShareOfGross": 22
        }
      },
      "2025": {
        "totalWealthTrillion": 12.8,
        "wealthPerAdultUSD": 405000,
        "medianWealthUSD": 152000,
        "gdpTrillionUSD": 2.45,
        "gdpPerCapitaUSD": 60500,
        "inflationRate": 2.6,
        "debtToGdp": 104.2,
        "gini": 0.71,
        "assetMix": {
          "financialShare": 56.5,
          "nonFinancialShare": 65.5,
          "debtShareOfGross": 22
        }
      },
      "2026": {
        "totalWealthTrillion": 13.4,
        "wealthPerAdultUSD": 419000,
        "medianWealthUSD": 158000,
        "gdpTrillionUSD": 2.56,
        "gdpPerCapitaUSD": 62400,
        "inflationRate": 2.4,
        "debtToGdp": 103.5,
        "gini": 0.71,
        "assetMix": {
          "financialShare": 56.8,
          "nonFinancialShare": 65.2,
          "debtShareOfGross": 22
        }
      }
    }
  },
  {
    "code": "AUS",
    "name": "Australia",
    "region": "Oceania",
    "blocs": [],
    "flag": "🇦🇺",
    "coordinates": [
      133.77,
      -25.27
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.42,
        "wealthPerAdultUSD": 41500,
        "medianWealthUSD": 20200,
        "gdpTrillionUSD": 0.16,
        "gdpPerCapitaUSD": 11000,
        "inflationRate": 10.1,
        "debtToGdp": 24,
        "gini": 0.62,
        "assetMix": {
          "financialShare": 40,
          "nonFinancialShare": 72,
          "debtShareOfGross": 12
        }
      },
      "1990": {
        "totalWealthTrillion": 0.95,
        "wealthPerAdultUSD": 74200,
        "medianWealthUSD": 36800,
        "gdpTrillionUSD": 0.31,
        "gdpPerCapitaUSD": 18200,
        "inflationRate": 7.3,
        "debtToGdp": 16,
        "gini": 0.63,
        "assetMix": {
          "financialShare": 41,
          "nonFinancialShare": 73,
          "debtShareOfGross": 14
        }
      },
      "1995": {
        "totalWealthTrillion": 1.15,
        "wealthPerAdultUSD": 85900,
        "medianWealthUSD": 42100,
        "gdpTrillionUSD": 0.37,
        "gdpPerCapitaUSD": 20400,
        "inflationRate": 4.6,
        "debtToGdp": 29,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 73,
          "debtShareOfGross": 15
        }
      },
      "2000": {
        "totalWealthTrillion": 1.5,
        "wealthPerAdultUSD": 107000,
        "medianWealthUSD": 52000,
        "gdpTrillionUSD": 0.41,
        "gdpPerCapitaUSD": 21680,
        "inflationRate": 4.5,
        "debtToGdp": 19,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 43,
          "nonFinancialShare": 72,
          "debtShareOfGross": 15
        }
      },
      "2010": {
        "totalWealthTrillion": 5.7,
        "wealthPerAdultUSD": 337000,
        "medianWealthUSD": 186000,
        "gdpTrillionUSD": 1.14,
        "gdpPerCapitaUSD": 52020,
        "inflationRate": 2.9,
        "debtToGdp": 20,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 75,
          "debtShareOfGross": 17
        }
      },
      "2020": {
        "totalWealthTrillion": 8.8,
        "wealthPerAdultUSD": 442000,
        "medianWealthUSD": 238000,
        "gdpTrillionUSD": 1.33,
        "gdpPerCapitaUSD": 51810,
        "inflationRate": 0.8,
        "debtToGdp": 57,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 77,
          "debtShareOfGross": 19
        }
      },
      "2022": {
        "totalWealthTrillion": 9.7,
        "wealthPerAdultUSD": 496820,
        "medianWealthUSD": 247450,
        "gdpTrillionUSD": 1.68,
        "gdpPerCapitaUSD": 64490,
        "inflationRate": 6.6,
        "debtToGdp": 55.7,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 41.5,
          "nonFinancialShare": 77.5,
          "debtShareOfGross": 19
        }
      },
      "2025": {
        "totalWealthTrillion": 11.2,
        "wealthPerAdultUSD": 545000,
        "medianWealthUSD": 275000,
        "gdpTrillionUSD": 1.95,
        "gdpPerCapitaUSD": 72100,
        "inflationRate": 2.7,
        "debtToGdp": 53.5,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 77,
          "debtShareOfGross": 19
        }
      },
      "2026": {
        "totalWealthTrillion": 11.8,
        "wealthPerAdultUSD": 565000,
        "medianWealthUSD": 285000,
        "gdpTrillionUSD": 2.05,
        "gdpPerCapitaUSD": 74800,
        "inflationRate": 2.5,
        "debtToGdp": 52.8,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 42.2,
          "nonFinancialShare": 76.8,
          "debtShareOfGross": 19
        }
      }
    }
  },
  {
    "code": "ZAF",
    "name": "South Africa",
    "region": "Africa",
    "blocs": [
      "brics"
    ],
    "flag": "🇿🇦",
    "coordinates": [
      22.93,
      -30.55
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.11,
        "wealthPerAdultUSD": 6400,
        "medianWealthUSD": 950,
        "gdpTrillionUSD": 0.08,
        "gdpPerCapitaUSD": 2820,
        "inflationRate": 13.8,
        "debtToGdp": 35,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 52,
          "nonFinancialShare": 58,
          "debtShareOfGross": 10
        }
      },
      "1990": {
        "totalWealthTrillion": 0.22,
        "wealthPerAdultUSD": 9800,
        "medianWealthUSD": 1450,
        "gdpTrillionUSD": 0.11,
        "gdpPerCapitaUSD": 3140,
        "inflationRate": 14.4,
        "debtToGdp": 39,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 56,
          "debtShareOfGross": 11
        }
      },
      "1995": {
        "totalWealthTrillion": 0.29,
        "wealthPerAdultUSD": 11800,
        "medianWealthUSD": 1800,
        "gdpTrillionUSD": 0.15,
        "gdpPerCapitaUSD": 3750,
        "inflationRate": 8.7,
        "debtToGdp": 47,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 56,
          "nonFinancialShare": 55,
          "debtShareOfGross": 11
        }
      },
      "2000": {
        "totalWealthTrillion": 0.35,
        "wealthPerAdultUSD": 13200,
        "medianWealthUSD": 2100,
        "gdpTrillionUSD": 0.15,
        "gdpPerCapitaUSD": 3240,
        "inflationRate": 5.4,
        "debtToGdp": 42,
        "gini": 0.84,
        "assetMix": {
          "financialShare": 58,
          "nonFinancialShare": 54,
          "debtShareOfGross": 12
        }
      },
      "2010": {
        "totalWealthTrillion": 0.72,
        "wealthPerAdultUSD": 21800,
        "medianWealthUSD": 3900,
        "gdpTrillionUSD": 0.42,
        "gdpPerCapitaUSD": 8060,
        "inflationRate": 4.3,
        "debtToGdp": 35,
        "gini": 0.86,
        "assetMix": {
          "financialShare": 64,
          "nonFinancialShare": 49,
          "debtShareOfGross": 13
        }
      },
      "2020": {
        "totalWealthTrillion": 0.76,
        "wealthPerAdultUSD": 20400,
        "medianWealthUSD": 4900,
        "gdpTrillionUSD": 0.34,
        "gdpPerCapitaUSD": 5660,
        "inflationRate": 3.3,
        "debtToGdp": 69,
        "gini": 0.88,
        "assetMix": {
          "financialShare": 66,
          "nonFinancialShare": 47,
          "debtShareOfGross": 13
        }
      },
      "2022": {
        "totalWealthTrillion": 0.83,
        "wealthPerAdultUSD": 21380,
        "medianWealthUSD": 5250,
        "gdpTrillionUSD": 0.41,
        "gdpPerCapitaUSD": 6770,
        "inflationRate": 6.9,
        "debtToGdp": 71,
        "gini": 0.88,
        "assetMix": {
          "financialShare": 65.5,
          "nonFinancialShare": 47.5,
          "debtShareOfGross": 13
        }
      },
      "2025": {
        "totalWealthTrillion": 0.96,
        "wealthPerAdultUSD": 23900,
        "medianWealthUSD": 6100,
        "gdpTrillionUSD": 0.46,
        "gdpPerCapitaUSD": 7420,
        "inflationRate": 4.4,
        "debtToGdp": 74.2,
        "gini": 0.87,
        "assetMix": {
          "financialShare": 66,
          "nonFinancialShare": 47,
          "debtShareOfGross": 13
        }
      },
      "2026": {
        "totalWealthTrillion": 1.02,
        "wealthPerAdultUSD": 25100,
        "medianWealthUSD": 6450,
        "gdpTrillionUSD": 0.48,
        "gdpPerCapitaUSD": 7680,
        "inflationRate": 4.1,
        "debtToGdp": 74.5,
        "gini": 0.87,
        "assetMix": {
          "financialShare": 66.2,
          "nonFinancialShare": 46.8,
          "debtShareOfGross": 13
        }
      }
    }
  },
  {
    "code": "ITA",
    "name": "Italy",
    "region": "Europe",
    "blocs": [
      "g7",
      "eurozone"
    ],
    "flag": "🇮🇹",
    "coordinates": [
      12.56,
      41.87
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 1.85,
        "wealthPerAdultUSD": 44200,
        "medianWealthUSD": 23500,
        "gdpTrillionUSD": 0.48,
        "gdpPerCapitaUSD": 8520,
        "inflationRate": 21.2,
        "debtToGdp": 58,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 66,
          "debtShareOfGross": 8
        }
      },
      "1990": {
        "totalWealthTrillion": 4.4,
        "wealthPerAdultUSD": 94500,
        "medianWealthUSD": 51200,
        "gdpTrillionUSD": 1.18,
        "gdpPerCapitaUSD": 20750,
        "inflationRate": 6.5,
        "debtToGdp": 94,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 44.5,
          "nonFinancialShare": 64,
          "debtShareOfGross": 8.5
        }
      },
      "1995": {
        "totalWealthTrillion": 5.6,
        "wealthPerAdultUSD": 118000,
        "medianWealthUSD": 64000,
        "gdpTrillionUSD": 1.19,
        "gdpPerCapitaUSD": 20900,
        "inflationRate": 5.4,
        "debtToGdp": 116,
        "gini": 0.67,
        "assetMix": {
          "financialShare": 46,
          "nonFinancialShare": 63,
          "debtShareOfGross": 9
        }
      },
      "2000": {
        "totalWealthTrillion": 6.85,
        "wealthPerAdultUSD": 142000,
        "medianWealthUSD": 78500,
        "gdpTrillionUSD": 1.14,
        "gdpPerCapitaUSD": 20050,
        "inflationRate": 2.6,
        "debtToGdp": 105,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 48,
          "nonFinancialShare": 61,
          "debtShareOfGross": 9
        }
      },
      "2010": {
        "totalWealthTrillion": 10.5,
        "wealthPerAdultUSD": 214000,
        "medianWealthUSD": 112000,
        "gdpTrillionUSD": 2.13,
        "gdpPerCapitaUSD": 35840,
        "inflationRate": 1.6,
        "debtToGdp": 119,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 46.5,
          "nonFinancialShare": 63,
          "debtShareOfGross": 9.5
        }
      },
      "2020": {
        "totalWealthTrillion": 11.2,
        "wealthPerAdultUSD": 228000,
        "medianWealthUSD": 118000,
        "gdpTrillionUSD": 1.89,
        "gdpPerCapitaUSD": 31710,
        "inflationRate": -0.1,
        "debtToGdp": 155,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 48.5,
          "nonFinancialShare": 61,
          "debtShareOfGross": 9.5
        }
      },
      "2022": {
        "totalWealthTrillion": 11.65,
        "wealthPerAdultUSD": 237000,
        "medianWealthUSD": 120500,
        "gdpTrillionUSD": 2.07,
        "gdpPerCapitaUSD": 35000,
        "inflationRate": 8.7,
        "debtToGdp": 144,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 47,
          "nonFinancialShare": 62.5,
          "debtShareOfGross": 9.5
        }
      },
      "2024": {
        "totalWealthTrillion": 12.35,
        "wealthPerAdultUSD": 251000,
        "medianWealthUSD": 124000,
        "gdpTrillionUSD": 2.25,
        "gdpPerCapitaUSD": 38200,
        "inflationRate": 1.3,
        "debtToGdp": 139,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 48,
          "nonFinancialShare": 61.5,
          "debtShareOfGross": 9.5
        }
      },
      "2025": {
        "totalWealthTrillion": 12.6,
        "wealthPerAdultUSD": 255000,
        "medianWealthUSD": 125000,
        "gdpTrillionUSD": 2.29,
        "gdpPerCapitaUSD": 39000,
        "inflationRate": 1.6,
        "debtToGdp": 138.5,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 48.5,
          "nonFinancialShare": 61,
          "debtShareOfGross": 9.5
        }
      },
      "2026": {
        "totalWealthTrillion": 12.85,
        "wealthPerAdultUSD": 258500,
        "medianWealthUSD": 126200,
        "gdpTrillionUSD": 2.34,
        "gdpPerCapitaUSD": 39950,
        "inflationRate": 1.8,
        "debtToGdp": 137.8,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 49,
          "nonFinancialShare": 60.5,
          "debtShareOfGross": 9.5
        }
      }
    }
  },
  {
    "code": "ESP",
    "name": "Spain",
    "region": "Europe",
    "blocs": [
      "eurozone"
    ],
    "flag": "🇪🇸",
    "coordinates": [
      -3.7,
      40.41
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.75,
        "wealthPerAdultUSD": 27800,
        "medianWealthUSD": 15400,
        "gdpTrillionUSD": 0.23,
        "gdpPerCapitaUSD": 6150,
        "inflationRate": 15.6,
        "debtToGdp": 16.8,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 32,
          "nonFinancialShare": 74,
          "debtShareOfGross": 6
        }
      },
      "1990": {
        "totalWealthTrillion": 1.85,
        "wealthPerAdultUSD": 61200,
        "medianWealthUSD": 34500,
        "gdpTrillionUSD": 0.53,
        "gdpPerCapitaUSD": 13700,
        "inflationRate": 6.7,
        "debtToGdp": 43,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 35,
          "nonFinancialShare": 72,
          "debtShareOfGross": 7
        }
      },
      "1995": {
        "totalWealthTrillion": 2.35,
        "wealthPerAdultUSD": 74500,
        "medianWealthUSD": 42800,
        "gdpTrillionUSD": 0.61,
        "gdpPerCapitaUSD": 15400,
        "inflationRate": 4.7,
        "debtToGdp": 63,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 38,
          "nonFinancialShare": 70,
          "debtShareOfGross": 8
        }
      },
      "2000": {
        "totalWealthTrillion": 3.25,
        "wealthPerAdultUSD": 98400,
        "medianWealthUSD": 58200,
        "gdpTrillionUSD": 0.59,
        "gdpPerCapitaUSD": 14700,
        "inflationRate": 3.5,
        "debtToGdp": 58,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 41,
          "nonFinancialShare": 68,
          "debtShareOfGross": 9
        }
      },
      "2010": {
        "totalWealthTrillion": 6.45,
        "wealthPerAdultUSD": 172000,
        "medianWealthUSD": 94000,
        "gdpTrillionUSD": 1.43,
        "gdpPerCapitaUSD": 30730,
        "inflationRate": 1.8,
        "debtToGdp": 60.5,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 34,
          "nonFinancialShare": 76,
          "debtShareOfGross": 10
        }
      },
      "2020": {
        "totalWealthTrillion": 7.85,
        "wealthPerAdultUSD": 202000,
        "medianWealthUSD": 104500,
        "gdpTrillionUSD": 1.28,
        "gdpPerCapitaUSD": 27060,
        "inflationRate": -0.3,
        "debtToGdp": 120,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 38,
          "nonFinancialShare": 71,
          "debtShareOfGross": 9
        }
      },
      "2022": {
        "totalWealthTrillion": 8.25,
        "wealthPerAdultUSD": 211000,
        "medianWealthUSD": 108000,
        "gdpTrillionUSD": 1.42,
        "gdpPerCapitaUSD": 29800,
        "inflationRate": 8.3,
        "debtToGdp": 111.6,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 37.5,
          "nonFinancialShare": 71.5,
          "debtShareOfGross": 9
        }
      },
      "2024": {
        "totalWealthTrillion": 8.85,
        "wealthPerAdultUSD": 224000,
        "medianWealthUSD": 112500,
        "gdpTrillionUSD": 1.65,
        "gdpPerCapitaUSD": 34200,
        "inflationRate": 2.8,
        "debtToGdp": 106,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 39,
          "nonFinancialShare": 70,
          "debtShareOfGross": 9
        }
      },
      "2025": {
        "totalWealthTrillion": 9.1,
        "wealthPerAdultUSD": 229000,
        "medianWealthUSD": 114000,
        "gdpTrillionUSD": 1.7,
        "gdpPerCapitaUSD": 35100,
        "inflationRate": 2.4,
        "debtToGdp": 104.2,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 39.5,
          "nonFinancialShare": 69.5,
          "debtShareOfGross": 9
        }
      },
      "2026": {
        "totalWealthTrillion": 9.35,
        "wealthPerAdultUSD": 233500,
        "medianWealthUSD": 115800,
        "gdpTrillionUSD": 1.75,
        "gdpPerCapitaUSD": 36000,
        "inflationRate": 2.1,
        "debtToGdp": 102.8,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 40,
          "nonFinancialShare": 69,
          "debtShareOfGross": 9
        }
      }
    }
  },
  {
    "code": "NLD",
    "name": "Netherlands",
    "region": "Europe",
    "blocs": [
      "eurozone"
    ],
    "flag": "🇳🇱",
    "coordinates": [
      5.29,
      52.13
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.65,
        "wealthPerAdultUSD": 62500,
        "medianWealthUSD": 25400,
        "gdpTrillionUSD": 0.19,
        "gdpPerCapitaUSD": 13450,
        "inflationRate": 6.5,
        "debtToGdp": 44,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 58,
          "nonFinancialShare": 56,
          "debtShareOfGross": 14
        }
      },
      "1990": {
        "totalWealthTrillion": 1.35,
        "wealthPerAdultUSD": 116000,
        "medianWealthUSD": 46200,
        "gdpTrillionUSD": 0.32,
        "gdpPerCapitaUSD": 21400,
        "inflationRate": 2.5,
        "debtToGdp": 75,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 60,
          "nonFinancialShare": 55,
          "debtShareOfGross": 15
        }
      },
      "1995": {
        "totalWealthTrillion": 1.72,
        "wealthPerAdultUSD": 142000,
        "medianWealthUSD": 56800,
        "gdpTrillionUSD": 0.45,
        "gdpPerCapitaUSD": 28900,
        "inflationRate": 2,
        "debtToGdp": 73,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 62,
          "nonFinancialShare": 54,
          "debtShareOfGross": 16
        }
      },
      "2000": {
        "totalWealthTrillion": 2.25,
        "wealthPerAdultUSD": 176000,
        "medianWealthUSD": 68500,
        "gdpTrillionUSD": 0.42,
        "gdpPerCapitaUSD": 26300,
        "inflationRate": 2.3,
        "debtToGdp": 51.5,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 64,
          "nonFinancialShare": 53,
          "debtShareOfGross": 17
        }
      },
      "2010": {
        "totalWealthTrillion": 3.55,
        "wealthPerAdultUSD": 265000,
        "medianWealthUSD": 92000,
        "gdpTrillionUSD": 0.85,
        "gdpPerCapitaUSD": 50900,
        "inflationRate": 1.3,
        "debtToGdp": 59,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 63,
          "nonFinancialShare": 55,
          "debtShareOfGross": 18
        }
      },
      "2020": {
        "totalWealthTrillion": 4.65,
        "wealthPerAdultUSD": 338000,
        "medianWealthUSD": 121000,
        "gdpTrillionUSD": 0.91,
        "gdpPerCapitaUSD": 52400,
        "inflationRate": 1.1,
        "debtToGdp": 54.6,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 65,
          "nonFinancialShare": 53,
          "debtShareOfGross": 18
        }
      },
      "2022": {
        "totalWealthTrillion": 4.95,
        "wealthPerAdultUSD": 356000,
        "medianWealthUSD": 128000,
        "gdpTrillionUSD": 1.01,
        "gdpPerCapitaUSD": 57200,
        "inflationRate": 11.6,
        "debtToGdp": 50.1,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 64,
          "nonFinancialShare": 54,
          "debtShareOfGross": 18
        }
      },
      "2024": {
        "totalWealthTrillion": 5.35,
        "wealthPerAdultUSD": 378000,
        "medianWealthUSD": 135000,
        "gdpTrillionUSD": 1.14,
        "gdpPerCapitaUSD": 63800,
        "inflationRate": 3.1,
        "debtToGdp": 47.2,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 65,
          "nonFinancialShare": 53,
          "debtShareOfGross": 18
        }
      },
      "2025": {
        "totalWealthTrillion": 5.5,
        "wealthPerAdultUSD": 386000,
        "medianWealthUSD": 138000,
        "gdpTrillionUSD": 1.18,
        "gdpPerCapitaUSD": 65600,
        "inflationRate": 2.6,
        "debtToGdp": 46.4,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 65.5,
          "nonFinancialShare": 52.5,
          "debtShareOfGross": 18
        }
      },
      "2026": {
        "totalWealthTrillion": 5.68,
        "wealthPerAdultUSD": 395000,
        "medianWealthUSD": 141200,
        "gdpTrillionUSD": 1.22,
        "gdpPerCapitaUSD": 67500,
        "inflationRate": 2.3,
        "debtToGdp": 45.8,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 66,
          "nonFinancialShare": 52,
          "debtShareOfGross": 18
        }
      }
    }
  },
  {
    "code": "CHE",
    "name": "Switzerland",
    "region": "Europe",
    "blocs": [],
    "flag": "🇨🇭",
    "coordinates": [
      8.22,
      46.81
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.62,
        "wealthPerAdultUSD": 124000,
        "medianWealthUSD": 65000,
        "gdpTrillionUSD": 0.12,
        "gdpPerCapitaUSD": 19100,
        "inflationRate": 4,
        "debtToGdp": 32,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 62,
          "nonFinancialShare": 52,
          "debtShareOfGross": 14
        }
      },
      "1990": {
        "totalWealthTrillion": 1.28,
        "wealthPerAdultUSD": 236000,
        "medianWealthUSD": 104000,
        "gdpTrillionUSD": 0.26,
        "gdpPerCapitaUSD": 38800,
        "inflationRate": 5.4,
        "debtToGdp": 31,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 64,
          "nonFinancialShare": 51,
          "debtShareOfGross": 15
        }
      },
      "1995": {
        "totalWealthTrillion": 1.65,
        "wealthPerAdultUSD": 295000,
        "medianWealthUSD": 126000,
        "gdpTrillionUSD": 0.34,
        "gdpPerCapitaUSD": 48900,
        "inflationRate": 1.8,
        "debtToGdp": 48,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 65,
          "nonFinancialShare": 50,
          "debtShareOfGross": 15
        }
      },
      "2000": {
        "totalWealthTrillion": 2.15,
        "wealthPerAdultUSD": 368000,
        "medianWealthUSD": 148000,
        "gdpTrillionUSD": 0.27,
        "gdpPerCapitaUSD": 37900,
        "inflationRate": 1.6,
        "debtToGdp": 53,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 68,
          "nonFinancialShare": 47,
          "debtShareOfGross": 15
        }
      },
      "2010": {
        "totalWealthTrillion": 3.42,
        "wealthPerAdultUSD": 525000,
        "medianWealthUSD": 154000,
        "gdpTrillionUSD": 0.6,
        "gdpPerCapitaUSD": 76500,
        "inflationRate": 0.7,
        "debtToGdp": 42,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 65,
          "nonFinancialShare": 51,
          "debtShareOfGross": 16
        }
      },
      "2020": {
        "totalWealthTrillion": 4.6,
        "wealthPerAdultUSD": 662000,
        "medianWealthUSD": 168000,
        "gdpTrillionUSD": 0.75,
        "gdpPerCapitaUSD": 87100,
        "inflationRate": -0.7,
        "debtToGdp": 43,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 67,
          "nonFinancialShare": 49,
          "debtShareOfGross": 16
        }
      },
      "2022": {
        "totalWealthTrillion": 4.85,
        "wealthPerAdultUSD": 685000,
        "medianWealthUSD": 174000,
        "gdpTrillionUSD": 0.82,
        "gdpPerCapitaUSD": 93400,
        "inflationRate": 2.8,
        "debtToGdp": 39.2,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 66,
          "nonFinancialShare": 50,
          "debtShareOfGross": 16
        }
      },
      "2024": {
        "totalWealthTrillion": 5.15,
        "wealthPerAdultUSD": 712000,
        "medianWealthUSD": 182000,
        "gdpTrillionUSD": 0.91,
        "gdpPerCapitaUSD": 102400,
        "inflationRate": 1.4,
        "debtToGdp": 37.8,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 67.5,
          "nonFinancialShare": 48.5,
          "debtShareOfGross": 16
        }
      },
      "2025": {
        "totalWealthTrillion": 5.3,
        "wealthPerAdultUSD": 728000,
        "medianWealthUSD": 186000,
        "gdpTrillionUSD": 0.94,
        "gdpPerCapitaUSD": 104800,
        "inflationRate": 1.2,
        "debtToGdp": 37,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 68,
          "nonFinancialShare": 48,
          "debtShareOfGross": 16
        }
      },
      "2026": {
        "totalWealthTrillion": 5.48,
        "wealthPerAdultUSD": 745000,
        "medianWealthUSD": 190500,
        "gdpTrillionUSD": 0.98,
        "gdpPerCapitaUSD": 108200,
        "inflationRate": 1.1,
        "debtToGdp": 36.4,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 68.5,
          "nonFinancialShare": 47.5,
          "debtShareOfGross": 16
        }
      }
    }
  },
  {
    "code": "SWE",
    "name": "Sweden",
    "region": "Europe",
    "blocs": [],
    "flag": "🇸🇪",
    "coordinates": [
      18.06,
      59.32
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.45,
        "wealthPerAdultUSD": 72000,
        "medianWealthUSD": 32000,
        "gdpTrillionUSD": 0.14,
        "gdpPerCapitaUSD": 16900,
        "inflationRate": 13.7,
        "debtToGdp": 40,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 60,
          "debtShareOfGross": 14
        }
      },
      "1990": {
        "totalWealthTrillion": 0.85,
        "wealthPerAdultUSD": 128000,
        "medianWealthUSD": 52000,
        "gdpTrillionUSD": 0.26,
        "gdpPerCapitaUSD": 30400,
        "inflationRate": 10.5,
        "debtToGdp": 44,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 56,
          "nonFinancialShare": 59,
          "debtShareOfGross": 15
        }
      },
      "1995": {
        "totalWealthTrillion": 0.98,
        "wealthPerAdultUSD": 142000,
        "medianWealthUSD": 58000,
        "gdpTrillionUSD": 0.27,
        "gdpPerCapitaUSD": 30200,
        "inflationRate": 2.5,
        "debtToGdp": 73,
        "gini": 0.8,
        "assetMix": {
          "financialShare": 58,
          "nonFinancialShare": 58,
          "debtShareOfGross": 16
        }
      },
      "2000": {
        "totalWealthTrillion": 1.25,
        "wealthPerAdultUSD": 178000,
        "medianWealthUSD": 66000,
        "gdpTrillionUSD": 0.26,
        "gdpPerCapitaUSD": 29400,
        "inflationRate": 1,
        "debtToGdp": 53,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 62,
          "nonFinancialShare": 55,
          "debtShareOfGross": 17
        }
      },
      "2010": {
        "totalWealthTrillion": 1.85,
        "wealthPerAdultUSD": 245000,
        "medianWealthUSD": 76000,
        "gdpTrillionUSD": 0.5,
        "gdpPerCapitaUSD": 53200,
        "inflationRate": 1.9,
        "debtToGdp": 38,
        "gini": 0.84,
        "assetMix": {
          "financialShare": 64,
          "nonFinancialShare": 54,
          "debtShareOfGross": 18
        }
      },
      "2020": {
        "totalWealthTrillion": 2.45,
        "wealthPerAdultUSD": 310000,
        "medianWealthUSD": 85000,
        "gdpTrillionUSD": 0.54,
        "gdpPerCapitaUSD": 52300,
        "inflationRate": 0.7,
        "debtToGdp": 39.8,
        "gini": 0.86,
        "assetMix": {
          "financialShare": 68,
          "nonFinancialShare": 50,
          "debtShareOfGross": 18
        }
      },
      "2022": {
        "totalWealthTrillion": 2.55,
        "wealthPerAdultUSD": 318000,
        "medianWealthUSD": 87000,
        "gdpTrillionUSD": 0.59,
        "gdpPerCapitaUSD": 56200,
        "inflationRate": 8.4,
        "debtToGdp": 33.2,
        "gini": 0.86,
        "assetMix": {
          "financialShare": 66,
          "nonFinancialShare": 52,
          "debtShareOfGross": 18
        }
      },
      "2024": {
        "totalWealthTrillion": 2.78,
        "wealthPerAdultUSD": 338000,
        "medianWealthUSD": 91500,
        "gdpTrillionUSD": 0.63,
        "gdpPerCapitaUSD": 59800,
        "inflationRate": 2.8,
        "debtToGdp": 31.5,
        "gini": 0.86,
        "assetMix": {
          "financialShare": 68,
          "nonFinancialShare": 50,
          "debtShareOfGross": 18
        }
      },
      "2025": {
        "totalWealthTrillion": 2.86,
        "wealthPerAdultUSD": 345000,
        "medianWealthUSD": 93000,
        "gdpTrillionUSD": 0.65,
        "gdpPerCapitaUSD": 61200,
        "inflationRate": 2.1,
        "debtToGdp": 30.8,
        "gini": 0.86,
        "assetMix": {
          "financialShare": 68.5,
          "nonFinancialShare": 49.5,
          "debtShareOfGross": 18
        }
      },
      "2026": {
        "totalWealthTrillion": 2.96,
        "wealthPerAdultUSD": 354000,
        "medianWealthUSD": 95200,
        "gdpTrillionUSD": 0.68,
        "gdpPerCapitaUSD": 63400,
        "inflationRate": 1.8,
        "debtToGdp": 30.2,
        "gini": 0.86,
        "assetMix": {
          "financialShare": 69,
          "nonFinancialShare": 49,
          "debtShareOfGross": 18
        }
      }
    }
  },
  {
    "code": "POL",
    "name": "Poland",
    "region": "Europe",
    "blocs": [],
    "flag": "🇵🇱",
    "coordinates": [
      21.01,
      52.23
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.15,
        "wealthPerAdultUSD": 6200,
        "medianWealthUSD": 3200,
        "gdpTrillionUSD": 0.06,
        "gdpPerCapitaUSD": 1680,
        "inflationRate": 9.4,
        "debtToGdp": 45,
        "gini": 0.62,
        "assetMix": {
          "financialShare": 24,
          "nonFinancialShare": 80,
          "debtShareOfGross": 4
        }
      },
      "1990": {
        "totalWealthTrillion": 0.22,
        "wealthPerAdultUSD": 8400,
        "medianWealthUSD": 4100,
        "gdpTrillionUSD": 0.07,
        "gdpPerCapitaUSD": 1730,
        "inflationRate": 585.8,
        "debtToGdp": 86,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 26,
          "nonFinancialShare": 78,
          "debtShareOfGross": 4
        }
      },
      "1995": {
        "totalWealthTrillion": 0.38,
        "wealthPerAdultUSD": 13500,
        "medianWealthUSD": 6800,
        "gdpTrillionUSD": 0.14,
        "gdpPerCapitaUSD": 3680,
        "inflationRate": 27.8,
        "debtToGdp": 49,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 28,
          "nonFinancialShare": 77,
          "debtShareOfGross": 5
        }
      },
      "2000": {
        "totalWealthTrillion": 0.58,
        "wealthPerAdultUSD": 19800,
        "medianWealthUSD": 9800,
        "gdpTrillionUSD": 0.17,
        "gdpPerCapitaUSD": 4500,
        "inflationRate": 10.1,
        "debtToGdp": 36.8,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 31,
          "nonFinancialShare": 74,
          "debtShareOfGross": 5
        }
      },
      "2010": {
        "totalWealthTrillion": 1.25,
        "wealthPerAdultUSD": 40500,
        "medianWealthUSD": 19500,
        "gdpTrillionUSD": 0.48,
        "gdpPerCapitaUSD": 12600,
        "inflationRate": 2.6,
        "debtToGdp": 53,
        "gini": 0.67,
        "assetMix": {
          "financialShare": 33,
          "nonFinancialShare": 73,
          "debtShareOfGross": 6
        }
      },
      "2020": {
        "totalWealthTrillion": 1.85,
        "wealthPerAdultUSD": 60500,
        "medianWealthUSD": 28500,
        "gdpTrillionUSD": 0.6,
        "gdpPerCapitaUSD": 15700,
        "inflationRate": 3.4,
        "debtToGdp": 57.1,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 34,
          "nonFinancialShare": 73,
          "debtShareOfGross": 7
        }
      },
      "2022": {
        "totalWealthTrillion": 1.95,
        "wealthPerAdultUSD": 64200,
        "medianWealthUSD": 30400,
        "gdpTrillionUSD": 0.69,
        "gdpPerCapitaUSD": 18300,
        "inflationRate": 14.4,
        "debtToGdp": 49.1,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 33,
          "nonFinancialShare": 74,
          "debtShareOfGross": 7
        }
      },
      "2024": {
        "totalWealthTrillion": 2.22,
        "wealthPerAdultUSD": 72800,
        "medianWealthUSD": 34000,
        "gdpTrillionUSD": 0.85,
        "gdpPerCapitaUSD": 22600,
        "inflationRate": 4.2,
        "debtToGdp": 51.5,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 35,
          "nonFinancialShare": 72,
          "debtShareOfGross": 7
        }
      },
      "2025": {
        "totalWealthTrillion": 2.34,
        "wealthPerAdultUSD": 76500,
        "medianWealthUSD": 35600,
        "gdpTrillionUSD": 0.9,
        "gdpPerCapitaUSD": 24100,
        "inflationRate": 3.6,
        "debtToGdp": 52.8,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 35.5,
          "nonFinancialShare": 71.5,
          "debtShareOfGross": 7
        }
      },
      "2026": {
        "totalWealthTrillion": 2.48,
        "wealthPerAdultUSD": 80800,
        "medianWealthUSD": 37400,
        "gdpTrillionUSD": 0.96,
        "gdpPerCapitaUSD": 25800,
        "inflationRate": 3.2,
        "debtToGdp": 53.6,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 36,
          "nonFinancialShare": 71,
          "debtShareOfGross": 7
        }
      }
    }
  },
  {
    "code": "RUS",
    "name": "Russia",
    "region": "Eurasia",
    "blocs": [
      "brics"
    ],
    "flag": "🇷🇺",
    "coordinates": [
      37.61,
      55.75
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.85,
        "wealthPerAdultUSD": 8200,
        "medianWealthUSD": 4100,
        "gdpTrillionUSD": 0.48,
        "gdpPerCapitaUSD": 3460,
        "inflationRate": 2.5,
        "debtToGdp": 18,
        "gini": 0.58,
        "assetMix": {
          "financialShare": 20,
          "nonFinancialShare": 83,
          "debtShareOfGross": 3
        }
      },
      "1990": {
        "totalWealthTrillion": 0.92,
        "wealthPerAdultUSD": 8500,
        "medianWealthUSD": 3800,
        "gdpTrillionUSD": 0.52,
        "gdpPerCapitaUSD": 3490,
        "inflationRate": 5.6,
        "debtToGdp": 25,
        "gini": 0.62,
        "assetMix": {
          "financialShare": 22,
          "nonFinancialShare": 81,
          "debtShareOfGross": 3
        }
      },
      "1995": {
        "totalWealthTrillion": 0.65,
        "wealthPerAdultUSD": 5800,
        "medianWealthUSD": 2100,
        "gdpTrillionUSD": 0.4,
        "gdpPerCapitaUSD": 2670,
        "inflationRate": 197.5,
        "debtToGdp": 42,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 24,
          "nonFinancialShare": 79,
          "debtShareOfGross": 3
        }
      },
      "2000": {
        "totalWealthTrillion": 0.95,
        "wealthPerAdultUSD": 8400,
        "medianWealthUSD": 2800,
        "gdpTrillionUSD": 0.26,
        "gdpPerCapitaUSD": 1770,
        "inflationRate": 20.8,
        "debtToGdp": 55,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 28,
          "nonFinancialShare": 75,
          "debtShareOfGross": 3
        }
      },
      "2010": {
        "totalWealthTrillion": 2.85,
        "wealthPerAdultUSD": 25200,
        "medianWealthUSD": 6200,
        "gdpTrillionUSD": 1.52,
        "gdpPerCapitaUSD": 10630,
        "inflationRate": 6.9,
        "debtToGdp": 10.6,
        "gini": 0.84,
        "assetMix": {
          "financialShare": 32,
          "nonFinancialShare": 71,
          "debtShareOfGross": 3
        }
      },
      "2020": {
        "totalWealthTrillion": 3.85,
        "wealthPerAdultUSD": 34200,
        "medianWealthUSD": 7800,
        "gdpTrillionUSD": 1.49,
        "gdpPerCapitaUSD": 10160,
        "inflationRate": 3.4,
        "debtToGdp": 19.3,
        "gini": 0.88,
        "assetMix": {
          "financialShare": 35,
          "nonFinancialShare": 69,
          "debtShareOfGross": 4
        }
      },
      "2022": {
        "totalWealthTrillion": 4.25,
        "wealthPerAdultUSD": 37800,
        "medianWealthUSD": 8400,
        "gdpTrillionUSD": 2.24,
        "gdpPerCapitaUSD": 15400,
        "inflationRate": 13.8,
        "debtToGdp": 17.8,
        "gini": 0.88,
        "assetMix": {
          "financialShare": 34,
          "nonFinancialShare": 70,
          "debtShareOfGross": 4
        }
      },
      "2024": {
        "totalWealthTrillion": 4.65,
        "wealthPerAdultUSD": 41200,
        "medianWealthUSD": 9050,
        "gdpTrillionUSD": 2.05,
        "gdpPerCapitaUSD": 14200,
        "inflationRate": 8.6,
        "debtToGdp": 18.5,
        "gini": 0.88,
        "assetMix": {
          "financialShare": 35,
          "nonFinancialShare": 69,
          "debtShareOfGross": 4
        }
      },
      "2025": {
        "totalWealthTrillion": 4.82,
        "wealthPerAdultUSD": 42500,
        "medianWealthUSD": 9300,
        "gdpTrillionUSD": 2.12,
        "gdpPerCapitaUSD": 14750,
        "inflationRate": 7.4,
        "debtToGdp": 18.9,
        "gini": 0.88,
        "assetMix": {
          "financialShare": 35.5,
          "nonFinancialShare": 68.5,
          "debtShareOfGross": 4
        }
      },
      "2026": {
        "totalWealthTrillion": 5.02,
        "wealthPerAdultUSD": 44100,
        "medianWealthUSD": 9600,
        "gdpTrillionUSD": 2.18,
        "gdpPerCapitaUSD": 15200,
        "inflationRate": 6.8,
        "debtToGdp": 19.2,
        "gini": 0.88,
        "assetMix": {
          "financialShare": 36,
          "nonFinancialShare": 68,
          "debtShareOfGross": 4
        }
      }
    }
  },
  {
    "code": "KOR",
    "name": "South Korea",
    "region": "East Asia",
    "blocs": [],
    "flag": "🇰🇷",
    "coordinates": [
      126.97,
      37.56
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.28,
        "wealthPerAdultUSD": 12200,
        "medianWealthUSD": 5400,
        "gdpTrillionUSD": 0.07,
        "gdpPerCapitaUSD": 1710,
        "inflationRate": 28.7,
        "debtToGdp": 17,
        "gini": 0.62,
        "assetMix": {
          "financialShare": 34,
          "nonFinancialShare": 72,
          "debtShareOfGross": 6
        }
      },
      "1990": {
        "totalWealthTrillion": 1.15,
        "wealthPerAdultUSD": 39500,
        "medianWealthUSD": 18200,
        "gdpTrillionUSD": 0.28,
        "gdpPerCapitaUSD": 6610,
        "inflationRate": 8.6,
        "debtToGdp": 13,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 38,
          "nonFinancialShare": 68,
          "debtShareOfGross": 6
        }
      },
      "1995": {
        "totalWealthTrillion": 1.95,
        "wealthPerAdultUSD": 62000,
        "medianWealthUSD": 28500,
        "gdpTrillionUSD": 0.56,
        "gdpPerCapitaUSD": 12300,
        "inflationRate": 4.5,
        "debtToGdp": 8.8,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 40,
          "nonFinancialShare": 67,
          "debtShareOfGross": 7
        }
      },
      "2000": {
        "totalWealthTrillion": 2.85,
        "wealthPerAdultUSD": 78500,
        "medianWealthUSD": 36400,
        "gdpTrillionUSD": 0.58,
        "gdpPerCapitaUSD": 12260,
        "inflationRate": 2.3,
        "debtToGdp": 17.1,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 66,
          "debtShareOfGross": 8
        }
      },
      "2010": {
        "totalWealthTrillion": 5.6,
        "wealthPerAdultUSD": 142000,
        "medianWealthUSD": 62000,
        "gdpTrillionUSD": 1.14,
        "gdpPerCapitaUSD": 23090,
        "inflationRate": 2.9,
        "debtToGdp": 29.5,
        "gini": 0.67,
        "assetMix": {
          "financialShare": 43,
          "nonFinancialShare": 66,
          "debtShareOfGross": 9
        }
      },
      "2020": {
        "totalWealthTrillion": 9.85,
        "wealthPerAdultUSD": 232000,
        "medianWealthUSD": 94000,
        "gdpTrillionUSD": 1.64,
        "gdpPerCapitaUSD": 31720,
        "inflationRate": 0.5,
        "debtToGdp": 46.9,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 45,
          "nonFinancialShare": 65,
          "debtShareOfGross": 10
        }
      },
      "2022": {
        "totalWealthTrillion": 10.25,
        "wealthPerAdultUSD": 241000,
        "medianWealthUSD": 98000,
        "gdpTrillionUSD": 1.67,
        "gdpPerCapitaUSD": 32400,
        "inflationRate": 5.1,
        "debtToGdp": 49.6,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 44.5,
          "nonFinancialShare": 65.5,
          "debtShareOfGross": 10
        }
      },
      "2024": {
        "totalWealthTrillion": 10.95,
        "wealthPerAdultUSD": 256000,
        "medianWealthUSD": 103500,
        "gdpTrillionUSD": 1.81,
        "gdpPerCapitaUSD": 35100,
        "inflationRate": 2.5,
        "debtToGdp": 51.8,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 45.5,
          "nonFinancialShare": 64.5,
          "debtShareOfGross": 10
        }
      },
      "2025": {
        "totalWealthTrillion": 11.25,
        "wealthPerAdultUSD": 262000,
        "medianWealthUSD": 105800,
        "gdpTrillionUSD": 1.86,
        "gdpPerCapitaUSD": 36200,
        "inflationRate": 2.3,
        "debtToGdp": 52.4,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 46,
          "nonFinancialShare": 64,
          "debtShareOfGross": 10
        }
      },
      "2026": {
        "totalWealthTrillion": 11.58,
        "wealthPerAdultUSD": 269000,
        "medianWealthUSD": 108400,
        "gdpTrillionUSD": 1.92,
        "gdpPerCapitaUSD": 37400,
        "inflationRate": 2,
        "debtToGdp": 53,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 46.5,
          "nonFinancialShare": 63.5,
          "debtShareOfGross": 10
        }
      }
    }
  },
  {
    "code": "TWN",
    "name": "Taiwan",
    "region": "East Asia",
    "blocs": [],
    "flag": "🇹🇼",
    "coordinates": [
      120.96,
      23.69
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.18,
        "wealthPerAdultUSD": 16500,
        "medianWealthUSD": 7800,
        "gdpTrillionUSD": 0.04,
        "gdpPerCapitaUSD": 2360,
        "inflationRate": 19,
        "debtToGdp": 12,
        "gini": 0.63,
        "assetMix": {
          "financialShare": 46,
          "nonFinancialShare": 60,
          "debtShareOfGross": 6
        }
      },
      "1990": {
        "totalWealthTrillion": 0.85,
        "wealthPerAdultUSD": 59000,
        "medianWealthUSD": 26500,
        "gdpTrillionUSD": 0.17,
        "gdpPerCapitaUSD": 8350,
        "inflationRate": 4.1,
        "debtToGdp": 8,
        "gini": 0.65,
        "assetMix": {
          "financialShare": 52,
          "nonFinancialShare": 54,
          "debtShareOfGross": 6
        }
      },
      "1995": {
        "totalWealthTrillion": 1.35,
        "wealthPerAdultUSD": 86000,
        "medianWealthUSD": 38200,
        "gdpTrillionUSD": 0.28,
        "gdpPerCapitaUSD": 13100,
        "inflationRate": 3.7,
        "debtToGdp": 18,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 53,
          "debtShareOfGross": 7
        }
      },
      "2000": {
        "totalWealthTrillion": 1.95,
        "wealthPerAdultUSD": 118000,
        "medianWealthUSD": 51200,
        "gdpTrillionUSD": 0.33,
        "gdpPerCapitaUSD": 14900,
        "inflationRate": 1.3,
        "debtToGdp": 25,
        "gini": 0.67,
        "assetMix": {
          "financialShare": 56,
          "nonFinancialShare": 51,
          "debtShareOfGross": 7
        }
      },
      "2010": {
        "totalWealthTrillion": 3.25,
        "wealthPerAdultUSD": 178000,
        "medianWealthUSD": 74000,
        "gdpTrillionUSD": 0.45,
        "gdpPerCapitaUSD": 19300,
        "inflationRate": 1,
        "debtToGdp": 35,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 58,
          "nonFinancialShare": 49,
          "debtShareOfGross": 7
        }
      },
      "2020": {
        "totalWealthTrillion": 5.15,
        "wealthPerAdultUSD": 268000,
        "medianWealthUSD": 104000,
        "gdpTrillionUSD": 0.67,
        "gdpPerCapitaUSD": 28400,
        "inflationRate": -0.2,
        "debtToGdp": 30.5,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 62,
          "nonFinancialShare": 45,
          "debtShareOfGross": 7
        }
      },
      "2022": {
        "totalWealthTrillion": 5.65,
        "wealthPerAdultUSD": 292000,
        "medianWealthUSD": 111000,
        "gdpTrillionUSD": 0.76,
        "gdpPerCapitaUSD": 32600,
        "inflationRate": 2.9,
        "debtToGdp": 27.2,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 63,
          "nonFinancialShare": 44,
          "debtShareOfGross": 7
        }
      },
      "2024": {
        "totalWealthTrillion": 6.15,
        "wealthPerAdultUSD": 316000,
        "medianWealthUSD": 118000,
        "gdpTrillionUSD": 0.81,
        "gdpPerCapitaUSD": 34700,
        "inflationRate": 2.1,
        "debtToGdp": 25.8,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 64,
          "nonFinancialShare": 43,
          "debtShareOfGross": 7
        }
      },
      "2025": {
        "totalWealthTrillion": 6.35,
        "wealthPerAdultUSD": 324000,
        "medianWealthUSD": 121000,
        "gdpTrillionUSD": 0.85,
        "gdpPerCapitaUSD": 36200,
        "inflationRate": 1.9,
        "debtToGdp": 25.4,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 64.5,
          "nonFinancialShare": 42.5,
          "debtShareOfGross": 7
        }
      },
      "2026": {
        "totalWealthTrillion": 6.58,
        "wealthPerAdultUSD": 334000,
        "medianWealthUSD": 124500,
        "gdpTrillionUSD": 0.89,
        "gdpPerCapitaUSD": 37800,
        "inflationRate": 1.8,
        "debtToGdp": 25,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 65,
          "nonFinancialShare": 42,
          "debtShareOfGross": 7
        }
      }
    }
  },
  {
    "code": "IDN",
    "name": "Indonesia",
    "region": "Southeast Asia",
    "blocs": [],
    "flag": "🇮🇩",
    "coordinates": [
      106.84,
      -6.2
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.14,
        "wealthPerAdultUSD": 1850,
        "medianWealthUSD": 650,
        "gdpTrillionUSD": 0.08,
        "gdpPerCapitaUSD": 530,
        "inflationRate": 18,
        "debtToGdp": 22,
        "gini": 0.64,
        "assetMix": {
          "financialShare": 18,
          "nonFinancialShare": 85,
          "debtShareOfGross": 3
        }
      },
      "1990": {
        "totalWealthTrillion": 0.38,
        "wealthPerAdultUSD": 3600,
        "medianWealthUSD": 1280,
        "gdpTrillionUSD": 0.11,
        "gdpPerCapitaUSD": 620,
        "inflationRate": 7.8,
        "debtToGdp": 41,
        "gini": 0.67,
        "assetMix": {
          "financialShare": 20,
          "nonFinancialShare": 83,
          "debtShareOfGross": 3
        }
      },
      "1995": {
        "totalWealthTrillion": 0.62,
        "wealthPerAdultUSD": 5100,
        "medianWealthUSD": 1750,
        "gdpTrillionUSD": 0.2,
        "gdpPerCapitaUSD": 1040,
        "inflationRate": 9.4,
        "debtToGdp": 53,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 22,
          "nonFinancialShare": 81,
          "debtShareOfGross": 3
        }
      },
      "2000": {
        "totalWealthTrillion": 0.52,
        "wealthPerAdultUSD": 3900,
        "medianWealthUSD": 1320,
        "gdpTrillionUSD": 0.17,
        "gdpPerCapitaUSD": 780,
        "inflationRate": 3.7,
        "debtToGdp": 87,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 22,
          "nonFinancialShare": 81,
          "debtShareOfGross": 3
        }
      },
      "2010": {
        "totalWealthTrillion": 1.65,
        "wealthPerAdultUSD": 10500,
        "medianWealthUSD": 3200,
        "gdpTrillionUSD": 0.76,
        "gdpPerCapitaUSD": 3120,
        "inflationRate": 5.1,
        "debtToGdp": 24.5,
        "gini": 0.73,
        "assetMix": {
          "financialShare": 25,
          "nonFinancialShare": 78,
          "debtShareOfGross": 3
        }
      },
      "2020": {
        "totalWealthTrillion": 2.85,
        "wealthPerAdultUSD": 15400,
        "medianWealthUSD": 4650,
        "gdpTrillionUSD": 1.06,
        "gdpPerCapitaUSD": 3870,
        "inflationRate": 2,
        "debtToGdp": 39.7,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 26,
          "nonFinancialShare": 77,
          "debtShareOfGross": 3
        }
      },
      "2022": {
        "totalWealthTrillion": 3.25,
        "wealthPerAdultUSD": 17200,
        "medianWealthUSD": 5100,
        "gdpTrillionUSD": 1.32,
        "gdpPerCapitaUSD": 4790,
        "inflationRate": 4.2,
        "debtToGdp": 40.1,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 27,
          "nonFinancialShare": 76,
          "debtShareOfGross": 3
        }
      },
      "2024": {
        "totalWealthTrillion": 3.55,
        "wealthPerAdultUSD": 18400,
        "medianWealthUSD": 5450,
        "gdpTrillionUSD": 1.44,
        "gdpPerCapitaUSD": 5160,
        "inflationRate": 2.8,
        "debtToGdp": 39.2,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 27.5,
          "nonFinancialShare": 75.5,
          "debtShareOfGross": 3
        }
      },
      "2025": {
        "totalWealthTrillion": 3.7,
        "wealthPerAdultUSD": 18900,
        "medianWealthUSD": 5600,
        "gdpTrillionUSD": 1.5,
        "gdpPerCapitaUSD": 5350,
        "inflationRate": 2.7,
        "debtToGdp": 39,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 28,
          "nonFinancialShare": 75,
          "debtShareOfGross": 3
        }
      },
      "2026": {
        "totalWealthTrillion": 3.88,
        "wealthPerAdultUSD": 19600,
        "medianWealthUSD": 5800,
        "gdpTrillionUSD": 1.58,
        "gdpPerCapitaUSD": 5580,
        "inflationRate": 2.6,
        "debtToGdp": 38.6,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 28.5,
          "nonFinancialShare": 74.5,
          "debtShareOfGross": 3
        }
      }
    }
  },
  {
    "code": "SGP",
    "name": "Singapore",
    "region": "Southeast Asia",
    "blocs": [],
    "flag": "🇸🇬",
    "coordinates": [
      103.81,
      1.35
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.06,
        "wealthPerAdultUSD": 36000,
        "medianWealthUSD": 14500,
        "gdpTrillionUSD": 0.012,
        "gdpPerCapitaUSD": 4930,
        "inflationRate": 8.5,
        "debtToGdp": 70,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 58,
          "debtShareOfGross": 12
        }
      },
      "1990": {
        "totalWealthTrillion": 0.22,
        "wealthPerAdultUSD": 98000,
        "medianWealthUSD": 38000,
        "gdpTrillionUSD": 0.039,
        "gdpPerCapitaUSD": 12760,
        "inflationRate": 3.5,
        "debtToGdp": 71,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 56,
          "nonFinancialShare": 56,
          "debtShareOfGross": 12
        }
      },
      "1995": {
        "totalWealthTrillion": 0.42,
        "wealthPerAdultUSD": 165000,
        "medianWealthUSD": 62000,
        "gdpTrillionUSD": 0.088,
        "gdpPerCapitaUSD": 24900,
        "inflationRate": 1.7,
        "debtToGdp": 68,
        "gini": 0.71,
        "assetMix": {
          "financialShare": 58,
          "nonFinancialShare": 55,
          "debtShareOfGross": 13
        }
      },
      "2000": {
        "totalWealthTrillion": 0.58,
        "wealthPerAdultUSD": 202000,
        "medianWealthUSD": 74000,
        "gdpTrillionUSD": 0.096,
        "gdpPerCapitaUSD": 23800,
        "inflationRate": 1.4,
        "debtToGdp": 81,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 60,
          "nonFinancialShare": 54,
          "debtShareOfGross": 14
        }
      },
      "2010": {
        "totalWealthTrillion": 1.15,
        "wealthPerAdultUSD": 285000,
        "medianWealthUSD": 96000,
        "gdpTrillionUSD": 0.24,
        "gdpPerCapitaUSD": 47200,
        "inflationRate": 2.8,
        "debtToGdp": 98,
        "gini": 0.73,
        "assetMix": {
          "financialShare": 62,
          "nonFinancialShare": 53,
          "debtShareOfGross": 15
        }
      },
      "2020": {
        "totalWealthTrillion": 1.75,
        "wealthPerAdultUSD": 368000,
        "medianWealthUSD": 114000,
        "gdpTrillionUSD": 0.35,
        "gdpPerCapitaUSD": 60700,
        "inflationRate": -0.2,
        "debtToGdp": 151,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 65,
          "nonFinancialShare": 50,
          "debtShareOfGross": 15
        }
      },
      "2022": {
        "totalWealthTrillion": 1.95,
        "wealthPerAdultUSD": 395000,
        "medianWealthUSD": 120000,
        "gdpTrillionUSD": 0.47,
        "gdpPerCapitaUSD": 82800,
        "inflationRate": 6.1,
        "debtToGdp": 167,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 65.5,
          "nonFinancialShare": 49.5,
          "debtShareOfGross": 15
        }
      },
      "2024": {
        "totalWealthTrillion": 2.15,
        "wealthPerAdultUSD": 425000,
        "medianWealthUSD": 126000,
        "gdpTrillionUSD": 0.52,
        "gdpPerCapitaUSD": 88500,
        "inflationRate": 2.4,
        "debtToGdp": 166,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 66,
          "nonFinancialShare": 49,
          "debtShareOfGross": 15
        }
      },
      "2025": {
        "totalWealthTrillion": 2.22,
        "wealthPerAdultUSD": 435000,
        "medianWealthUSD": 128500,
        "gdpTrillionUSD": 0.54,
        "gdpPerCapitaUSD": 91200,
        "inflationRate": 2.2,
        "debtToGdp": 165,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 66.5,
          "nonFinancialShare": 48.5,
          "debtShareOfGross": 15
        }
      },
      "2026": {
        "totalWealthTrillion": 2.32,
        "wealthPerAdultUSD": 448000,
        "medianWealthUSD": 131500,
        "gdpTrillionUSD": 0.57,
        "gdpPerCapitaUSD": 94500,
        "inflationRate": 2,
        "debtToGdp": 164,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 67,
          "nonFinancialShare": 48,
          "debtShareOfGross": 15
        }
      }
    }
  },
  {
    "code": "SAU",
    "name": "Saudi Arabia",
    "region": "Middle East",
    "blocs": [
      "brics"
    ],
    "flag": "🇸🇦",
    "coordinates": [
      46.72,
      24.68
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.35,
        "wealthPerAdultUSD": 68000,
        "medianWealthUSD": 22000,
        "gdpTrillionUSD": 0.16,
        "gdpPerCapitaUSD": 16800,
        "inflationRate": 4.4,
        "debtToGdp": 8,
        "gini": 0.71,
        "assetMix": {
          "financialShare": 52,
          "nonFinancialShare": 54,
          "debtShareOfGross": 6
        }
      },
      "1990": {
        "totalWealthTrillion": 0.55,
        "wealthPerAdultUSD": 54000,
        "medianWealthUSD": 16500,
        "gdpTrillionUSD": 0.12,
        "gdpPerCapitaUSD": 7280,
        "inflationRate": 2.1,
        "debtToGdp": 54,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 48,
          "nonFinancialShare": 58,
          "debtShareOfGross": 6
        }
      },
      "1995": {
        "totalWealthTrillion": 0.68,
        "wealthPerAdultUSD": 52000,
        "medianWealthUSD": 15800,
        "gdpTrillionUSD": 0.14,
        "gdpPerCapitaUSD": 7460,
        "inflationRate": 5,
        "debtToGdp": 76,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 46,
          "nonFinancialShare": 60,
          "debtShareOfGross": 6
        }
      },
      "2000": {
        "totalWealthTrillion": 0.88,
        "wealthPerAdultUSD": 58000,
        "medianWealthUSD": 17200,
        "gdpTrillionUSD": 0.19,
        "gdpPerCapitaUSD": 9130,
        "inflationRate": -1.1,
        "debtToGdp": 86,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 48,
          "nonFinancialShare": 58,
          "debtShareOfGross": 6
        }
      },
      "2010": {
        "totalWealthTrillion": 1.55,
        "wealthPerAdultUSD": 78000,
        "medianWealthUSD": 22500,
        "gdpTrillionUSD": 0.53,
        "gdpPerCapitaUSD": 19260,
        "inflationRate": 5.3,
        "debtToGdp": 8.4,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 50,
          "nonFinancialShare": 56,
          "debtShareOfGross": 6
        }
      },
      "2020": {
        "totalWealthTrillion": 2.25,
        "wealthPerAdultUSD": 94000,
        "medianWealthUSD": 26000,
        "gdpTrillionUSD": 0.7,
        "gdpPerCapitaUSD": 20110,
        "inflationRate": 3.4,
        "debtToGdp": 32.5,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 52,
          "nonFinancialShare": 54,
          "debtShareOfGross": 6
        }
      },
      "2022": {
        "totalWealthTrillion": 2.65,
        "wealthPerAdultUSD": 104000,
        "medianWealthUSD": 27800,
        "gdpTrillionUSD": 1.11,
        "gdpPerCapitaUSD": 30400,
        "inflationRate": 2.5,
        "debtToGdp": 23.8,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 53,
          "nonFinancialShare": 53,
          "debtShareOfGross": 6
        }
      },
      "2024": {
        "totalWealthTrillion": 2.85,
        "wealthPerAdultUSD": 108000,
        "medianWealthUSD": 28800,
        "gdpTrillionUSD": 1.11,
        "gdpPerCapitaUSD": 29800,
        "inflationRate": 1.7,
        "debtToGdp": 26.2,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 53.5,
          "nonFinancialShare": 52.5,
          "debtShareOfGross": 6
        }
      },
      "2025": {
        "totalWealthTrillion": 2.95,
        "wealthPerAdultUSD": 110500,
        "medianWealthUSD": 29400,
        "gdpTrillionUSD": 1.16,
        "gdpPerCapitaUSD": 30800,
        "inflationRate": 1.8,
        "debtToGdp": 27.1,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 52,
          "debtShareOfGross": 6
        }
      },
      "2026": {
        "totalWealthTrillion": 3.08,
        "wealthPerAdultUSD": 113800,
        "medianWealthUSD": 30200,
        "gdpTrillionUSD": 1.21,
        "gdpPerCapitaUSD": 31800,
        "inflationRate": 1.7,
        "debtToGdp": 27.5,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 54.5,
          "nonFinancialShare": 51.5,
          "debtShareOfGross": 6
        }
      }
    }
  },
  {
    "code": "ARE",
    "name": "United Arab Emirates",
    "region": "Middle East",
    "blocs": [
      "brics"
    ],
    "flag": "🇦🇪",
    "coordinates": [
      54.37,
      24.45
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.14,
        "wealthPerAdultUSD": 180000,
        "medianWealthUSD": 52000,
        "gdpTrillionUSD": 0.04,
        "gdpPerCapitaUSD": 40000,
        "inflationRate": 10.2,
        "debtToGdp": 6,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 51,
          "debtShareOfGross": 6
        }
      },
      "1990": {
        "totalWealthTrillion": 0.28,
        "wealthPerAdultUSD": 165000,
        "medianWealthUSD": 45000,
        "gdpTrillionUSD": 0.05,
        "gdpPerCapitaUSD": 27500,
        "inflationRate": 0.6,
        "debtToGdp": 8,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 52,
          "debtShareOfGross": 6
        }
      },
      "1995": {
        "totalWealthTrillion": 0.42,
        "wealthPerAdultUSD": 172000,
        "medianWealthUSD": 46000,
        "gdpTrillionUSD": 0.065,
        "gdpPerCapitaUSD": 27100,
        "inflationRate": 4.4,
        "debtToGdp": 9,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 51,
          "debtShareOfGross": 6
        }
      },
      "2000": {
        "totalWealthTrillion": 0.58,
        "wealthPerAdultUSD": 182000,
        "medianWealthUSD": 47500,
        "gdpTrillionUSD": 0.1,
        "gdpPerCapitaUSD": 33300,
        "inflationRate": -1,
        "debtToGdp": 11,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 56,
          "nonFinancialShare": 50,
          "debtShareOfGross": 6
        }
      },
      "2010": {
        "totalWealthTrillion": 0.95,
        "wealthPerAdultUSD": 142000,
        "medianWealthUSD": 34000,
        "gdpTrillionUSD": 0.29,
        "gdpPerCapitaUSD": 35000,
        "inflationRate": 0.9,
        "debtToGdp": 21,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 52,
          "debtShareOfGross": 7
        }
      },
      "2020": {
        "totalWealthTrillion": 1.35,
        "wealthPerAdultUSD": 162000,
        "medianWealthUSD": 36500,
        "gdpTrillionUSD": 0.35,
        "gdpPerCapitaUSD": 36700,
        "inflationRate": -2.1,
        "debtToGdp": 39.4,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 56,
          "nonFinancialShare": 51,
          "debtShareOfGross": 7
        }
      },
      "2022": {
        "totalWealthTrillion": 1.55,
        "wealthPerAdultUSD": 176000,
        "medianWealthUSD": 38200,
        "gdpTrillionUSD": 0.51,
        "gdpPerCapitaUSD": 53700,
        "inflationRate": 4.8,
        "debtToGdp": 30,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 57,
          "nonFinancialShare": 50,
          "debtShareOfGross": 7
        }
      },
      "2024": {
        "totalWealthTrillion": 1.72,
        "wealthPerAdultUSD": 188000,
        "medianWealthUSD": 40500,
        "gdpTrillionUSD": 0.54,
        "gdpPerCapitaUSD": 55400,
        "inflationRate": 2.3,
        "debtToGdp": 28.5,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 57.5,
          "nonFinancialShare": 49.5,
          "debtShareOfGross": 7
        }
      },
      "2025": {
        "totalWealthTrillion": 1.8,
        "wealthPerAdultUSD": 194000,
        "medianWealthUSD": 41600,
        "gdpTrillionUSD": 0.57,
        "gdpPerCapitaUSD": 57200,
        "inflationRate": 2.1,
        "debtToGdp": 28,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 58,
          "nonFinancialShare": 49,
          "debtShareOfGross": 7
        }
      },
      "2026": {
        "totalWealthTrillion": 1.89,
        "wealthPerAdultUSD": 201000,
        "medianWealthUSD": 42800,
        "gdpTrillionUSD": 0.6,
        "gdpPerCapitaUSD": 59200,
        "inflationRate": 2,
        "debtToGdp": 27.5,
        "gini": 0.83,
        "assetMix": {
          "financialShare": 58.5,
          "nonFinancialShare": 48.5,
          "debtShareOfGross": 7
        }
      }
    }
  },
  {
    "code": "TUR",
    "name": "Turkey",
    "region": "Middle East",
    "blocs": [],
    "flag": "🇹🇷",
    "coordinates": [
      32.85,
      39.93
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.19,
        "wealthPerAdultUSD": 8200,
        "medianWealthUSD": 3200,
        "gdpTrillionUSD": 0.07,
        "gdpPerCapitaUSD": 1560,
        "inflationRate": 110,
        "debtToGdp": 28,
        "gini": 0.69,
        "assetMix": {
          "financialShare": 20,
          "nonFinancialShare": 84,
          "debtShareOfGross": 4
        }
      },
      "1990": {
        "totalWealthTrillion": 0.45,
        "wealthPerAdultUSD": 13500,
        "medianWealthUSD": 4800,
        "gdpTrillionUSD": 0.15,
        "gdpPerCapitaUSD": 2790,
        "inflationRate": 60.3,
        "debtToGdp": 35,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 22,
          "nonFinancialShare": 82,
          "debtShareOfGross": 4
        }
      },
      "1995": {
        "totalWealthTrillion": 0.62,
        "wealthPerAdultUSD": 15800,
        "medianWealthUSD": 5200,
        "gdpTrillionUSD": 0.17,
        "gdpPerCapitaUSD": 2880,
        "inflationRate": 88,
        "debtToGdp": 41,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 24,
          "nonFinancialShare": 80,
          "debtShareOfGross": 4
        }
      },
      "2000": {
        "totalWealthTrillion": 0.78,
        "wealthPerAdultUSD": 17400,
        "medianWealthUSD": 5500,
        "gdpTrillionUSD": 0.27,
        "gdpPerCapitaUSD": 4320,
        "inflationRate": 54.9,
        "debtToGdp": 51.6,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 25,
          "nonFinancialShare": 79,
          "debtShareOfGross": 4
        }
      },
      "2010": {
        "totalWealthTrillion": 1.45,
        "wealthPerAdultUSD": 28500,
        "medianWealthUSD": 8200,
        "gdpTrillionUSD": 0.77,
        "gdpPerCapitaUSD": 10670,
        "inflationRate": 8.6,
        "debtToGdp": 40,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 28,
          "nonFinancialShare": 76,
          "debtShareOfGross": 4
        }
      },
      "2020": {
        "totalWealthTrillion": 1.65,
        "wealthPerAdultUSD": 27800,
        "medianWealthUSD": 6900,
        "gdpTrillionUSD": 0.72,
        "gdpPerCapitaUSD": 8530,
        "inflationRate": 12.3,
        "debtToGdp": 39.8,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 29,
          "nonFinancialShare": 75,
          "debtShareOfGross": 4
        }
      },
      "2022": {
        "totalWealthTrillion": 1.85,
        "wealthPerAdultUSD": 30400,
        "medianWealthUSD": 7200,
        "gdpTrillionUSD": 0.9,
        "gdpPerCapitaUSD": 10600,
        "inflationRate": 72.3,
        "debtToGdp": 31.7,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 28.5,
          "nonFinancialShare": 75.5,
          "debtShareOfGross": 4
        }
      },
      "2024": {
        "totalWealthTrillion": 2.15,
        "wealthPerAdultUSD": 34200,
        "medianWealthUSD": 7900,
        "gdpTrillionUSD": 1.12,
        "gdpPerCapitaUSD": 12800,
        "inflationRate": 53.8,
        "debtToGdp": 29.5,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 29,
          "nonFinancialShare": 75,
          "debtShareOfGross": 4
        }
      },
      "2025": {
        "totalWealthTrillion": 2.28,
        "wealthPerAdultUSD": 35800,
        "medianWealthUSD": 8200,
        "gdpTrillionUSD": 1.18,
        "gdpPerCapitaUSD": 13400,
        "inflationRate": 38.5,
        "debtToGdp": 28.8,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 29.5,
          "nonFinancialShare": 74.5,
          "debtShareOfGross": 4
        }
      },
      "2026": {
        "totalWealthTrillion": 2.42,
        "wealthPerAdultUSD": 37500,
        "medianWealthUSD": 8550,
        "gdpTrillionUSD": 1.25,
        "gdpPerCapitaUSD": 14100,
        "inflationRate": 29.5,
        "debtToGdp": 28.2,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 30,
          "nonFinancialShare": 74,
          "debtShareOfGross": 4
        }
      }
    }
  },
  {
    "code": "MEX",
    "name": "Mexico",
    "region": "Latin America",
    "blocs": [
      "usmca"
    ],
    "flag": "🇲🇽",
    "coordinates": [
      -99.13,
      19.43
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.48,
        "wealthPerAdultUSD": 14200,
        "medianWealthUSD": 4800,
        "gdpTrillionUSD": 0.21,
        "gdpPerCapitaUSD": 3040,
        "inflationRate": 26.4,
        "debtToGdp": 31,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 28,
          "nonFinancialShare": 76,
          "debtShareOfGross": 4
        }
      },
      "1990": {
        "totalWealthTrillion": 0.95,
        "wealthPerAdultUSD": 20500,
        "medianWealthUSD": 6400,
        "gdpTrillionUSD": 0.26,
        "gdpPerCapitaUSD": 3140,
        "inflationRate": 26.7,
        "debtToGdp": 54,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 30,
          "nonFinancialShare": 74,
          "debtShareOfGross": 4
        }
      },
      "1995": {
        "totalWealthTrillion": 0.92,
        "wealthPerAdultUSD": 17200,
        "medianWealthUSD": 5200,
        "gdpTrillionUSD": 0.36,
        "gdpPerCapitaUSD": 3840,
        "inflationRate": 35,
        "debtToGdp": 68,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 31,
          "nonFinancialShare": 73,
          "debtShareOfGross": 4
        }
      },
      "2000": {
        "totalWealthTrillion": 1.75,
        "wealthPerAdultUSD": 28500,
        "medianWealthUSD": 8800,
        "gdpTrillionUSD": 0.71,
        "gdpPerCapitaUSD": 7080,
        "inflationRate": 9.5,
        "debtToGdp": 40.5,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 34,
          "nonFinancialShare": 70,
          "debtShareOfGross": 4
        }
      },
      "2010": {
        "totalWealthTrillion": 2.65,
        "wealthPerAdultUSD": 35200,
        "medianWealthUSD": 11200,
        "gdpTrillionUSD": 1.05,
        "gdpPerCapitaUSD": 9270,
        "inflationRate": 4.2,
        "debtToGdp": 42,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 36,
          "nonFinancialShare": 68,
          "debtShareOfGross": 4
        }
      },
      "2020": {
        "totalWealthTrillion": 3.25,
        "wealthPerAdultUSD": 37800,
        "medianWealthUSD": 12400,
        "gdpTrillionUSD": 1.09,
        "gdpPerCapitaUSD": 8650,
        "inflationRate": 3.4,
        "debtToGdp": 51.5,
        "gini": 0.8,
        "assetMix": {
          "financialShare": 38,
          "nonFinancialShare": 66,
          "debtShareOfGross": 4
        }
      },
      "2022": {
        "totalWealthTrillion": 3.85,
        "wealthPerAdultUSD": 43200,
        "medianWealthUSD": 14500,
        "gdpTrillionUSD": 1.47,
        "gdpPerCapitaUSD": 11400,
        "inflationRate": 7.9,
        "debtToGdp": 49.6,
        "gini": 0.8,
        "assetMix": {
          "financialShare": 38.5,
          "nonFinancialShare": 65.5,
          "debtShareOfGross": 4
        }
      },
      "2024": {
        "totalWealthTrillion": 4.25,
        "wealthPerAdultUSD": 46800,
        "medianWealthUSD": 15800,
        "gdpTrillionUSD": 1.78,
        "gdpPerCapitaUSD": 13600,
        "inflationRate": 4.7,
        "debtToGdp": 50.8,
        "gini": 0.8,
        "assetMix": {
          "financialShare": 39,
          "nonFinancialShare": 65,
          "debtShareOfGross": 4
        }
      },
      "2025": {
        "totalWealthTrillion": 4.4,
        "wealthPerAdultUSD": 48000,
        "medianWealthUSD": 16200,
        "gdpTrillionUSD": 1.84,
        "gdpPerCapitaUSD": 14000,
        "inflationRate": 4.2,
        "debtToGdp": 51.4,
        "gini": 0.8,
        "assetMix": {
          "financialShare": 39.5,
          "nonFinancialShare": 64.5,
          "debtShareOfGross": 4
        }
      },
      "2026": {
        "totalWealthTrillion": 4.58,
        "wealthPerAdultUSD": 49500,
        "medianWealthUSD": 16700,
        "gdpTrillionUSD": 1.91,
        "gdpPerCapitaUSD": 14450,
        "inflationRate": 3.8,
        "debtToGdp": 51.8,
        "gini": 0.8,
        "assetMix": {
          "financialShare": 40,
          "nonFinancialShare": 64,
          "debtShareOfGross": 4
        }
      }
    }
  },
  {
    "code": "ARG",
    "name": "Argentina",
    "region": "Latin America",
    "blocs": [],
    "flag": "🇦🇷",
    "coordinates": [
      -58.38,
      -34.6
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.28,
        "wealthPerAdultUSD": 16200,
        "medianWealthUSD": 5500,
        "gdpTrillionUSD": 0.08,
        "gdpPerCapitaUSD": 2780,
        "inflationRate": 100.8,
        "debtToGdp": 32,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 30,
          "nonFinancialShare": 74,
          "debtShareOfGross": 4
        }
      },
      "1990": {
        "totalWealthTrillion": 0.42,
        "wealthPerAdultUSD": 19500,
        "medianWealthUSD": 6200,
        "gdpTrillionUSD": 0.14,
        "gdpPerCapitaUSD": 4330,
        "inflationRate": 2314,
        "debtToGdp": 39,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 32,
          "nonFinancialShare": 72,
          "debtShareOfGross": 4
        }
      },
      "1995": {
        "totalWealthTrillion": 0.75,
        "wealthPerAdultUSD": 31000,
        "medianWealthUSD": 9800,
        "gdpTrillionUSD": 0.26,
        "gdpPerCapitaUSD": 7400,
        "inflationRate": 3.4,
        "debtToGdp": 36,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 35,
          "nonFinancialShare": 69,
          "debtShareOfGross": 4
        }
      },
      "2000": {
        "totalWealthTrillion": 0.92,
        "wealthPerAdultUSD": 35000,
        "medianWealthUSD": 10800,
        "gdpTrillionUSD": 0.28,
        "gdpPerCapitaUSD": 7700,
        "inflationRate": -0.9,
        "debtToGdp": 53.7,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 36,
          "nonFinancialShare": 68,
          "debtShareOfGross": 4
        }
      },
      "2010": {
        "totalWealthTrillion": 1.15,
        "wealthPerAdultUSD": 38500,
        "medianWealthUSD": 11200,
        "gdpTrillionUSD": 0.42,
        "gdpPerCapitaUSD": 10390,
        "inflationRate": 10.5,
        "debtToGdp": 43.5,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 35,
          "nonFinancialShare": 69,
          "debtShareOfGross": 4
        }
      },
      "2020": {
        "totalWealthTrillion": 1.25,
        "wealthPerAdultUSD": 38800,
        "medianWealthUSD": 10500,
        "gdpTrillionUSD": 0.39,
        "gdpPerCapitaUSD": 8580,
        "inflationRate": 42,
        "debtToGdp": 104,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 36,
          "nonFinancialShare": 68,
          "debtShareOfGross": 4
        }
      },
      "2022": {
        "totalWealthTrillion": 1.45,
        "wealthPerAdultUSD": 44200,
        "medianWealthUSD": 11800,
        "gdpTrillionUSD": 0.63,
        "gdpPerCapitaUSD": 13700,
        "inflationRate": 72.4,
        "debtToGdp": 85,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 37,
          "nonFinancialShare": 67,
          "debtShareOfGross": 4
        }
      },
      "2024": {
        "totalWealthTrillion": 1.58,
        "wealthPerAdultUSD": 47200,
        "medianWealthUSD": 12500,
        "gdpTrillionUSD": 0.62,
        "gdpPerCapitaUSD": 13200,
        "inflationRate": 140,
        "debtToGdp": 88,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 38,
          "nonFinancialShare": 66,
          "debtShareOfGross": 4
        }
      },
      "2025": {
        "totalWealthTrillion": 1.68,
        "wealthPerAdultUSD": 49800,
        "medianWealthUSD": 13100,
        "gdpTrillionUSD": 0.66,
        "gdpPerCapitaUSD": 14000,
        "inflationRate": 65,
        "debtToGdp": 84,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 38.5,
          "nonFinancialShare": 65.5,
          "debtShareOfGross": 4
        }
      },
      "2026": {
        "totalWealthTrillion": 1.8,
        "wealthPerAdultUSD": 52800,
        "medianWealthUSD": 13800,
        "gdpTrillionUSD": 0.71,
        "gdpPerCapitaUSD": 14900,
        "inflationRate": 42,
        "debtToGdp": 79.5,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 39,
          "nonFinancialShare": 65,
          "debtShareOfGross": 4
        }
      }
    }
  },
  {
    "code": "CHL",
    "name": "Chile",
    "region": "Latin America",
    "blocs": [],
    "flag": "🇨🇱",
    "coordinates": [
      -70.66,
      -33.44
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.08,
        "wealthPerAdultUSD": 11200,
        "medianWealthUSD": 3800,
        "gdpTrillionUSD": 0.03,
        "gdpPerCapitaUSD": 2560,
        "inflationRate": 35.1,
        "debtToGdp": 38,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 36,
          "nonFinancialShare": 68,
          "debtShareOfGross": 4
        }
      },
      "1990": {
        "totalWealthTrillion": 0.18,
        "wealthPerAdultUSD": 21500,
        "medianWealthUSD": 7200,
        "gdpTrillionUSD": 0.033,
        "gdpPerCapitaUSD": 2510,
        "inflationRate": 26,
        "debtToGdp": 44,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 42,
          "nonFinancialShare": 63,
          "debtShareOfGross": 5
        }
      },
      "1995": {
        "totalWealthTrillion": 0.32,
        "wealthPerAdultUSD": 33800,
        "medianWealthUSD": 11200,
        "gdpTrillionUSD": 0.073,
        "gdpPerCapitaUSD": 5120,
        "inflationRate": 8.2,
        "debtToGdp": 18,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 46,
          "nonFinancialShare": 59,
          "debtShareOfGross": 5
        }
      },
      "2000": {
        "totalWealthTrillion": 0.45,
        "wealthPerAdultUSD": 42000,
        "medianWealthUSD": 13800,
        "gdpTrillionUSD": 0.08,
        "gdpPerCapitaUSD": 5150,
        "inflationRate": 3.8,
        "debtToGdp": 13.5,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 49,
          "nonFinancialShare": 56,
          "debtShareOfGross": 5
        }
      },
      "2010": {
        "totalWealthTrillion": 0.78,
        "wealthPerAdultUSD": 62500,
        "medianWealthUSD": 19500,
        "gdpTrillionUSD": 0.22,
        "gdpPerCapitaUSD": 12800,
        "inflationRate": 1.4,
        "debtToGdp": 8.6,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 52,
          "nonFinancialShare": 53,
          "debtShareOfGross": 5
        }
      },
      "2020": {
        "totalWealthTrillion": 0.98,
        "wealthPerAdultUSD": 68000,
        "medianWealthUSD": 21200,
        "gdpTrillionUSD": 0.25,
        "gdpPerCapitaUSD": 13200,
        "inflationRate": 3,
        "debtToGdp": 32.5,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 51,
          "debtShareOfGross": 5
        }
      },
      "2022": {
        "totalWealthTrillion": 1.05,
        "wealthPerAdultUSD": 71500,
        "medianWealthUSD": 22100,
        "gdpTrillionUSD": 0.3,
        "gdpPerCapitaUSD": 15300,
        "inflationRate": 11.6,
        "debtToGdp": 38,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 53.5,
          "nonFinancialShare": 51.5,
          "debtShareOfGross": 5
        }
      },
      "2024": {
        "totalWealthTrillion": 1.15,
        "wealthPerAdultUSD": 76800,
        "medianWealthUSD": 23600,
        "gdpTrillionUSD": 0.34,
        "gdpPerCapitaUSD": 16900,
        "inflationRate": 4.5,
        "debtToGdp": 40.5,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 54,
          "nonFinancialShare": 51,
          "debtShareOfGross": 5
        }
      },
      "2025": {
        "totalWealthTrillion": 1.2,
        "wealthPerAdultUSD": 79500,
        "medianWealthUSD": 24400,
        "gdpTrillionUSD": 0.36,
        "gdpPerCapitaUSD": 17700,
        "inflationRate": 3.6,
        "debtToGdp": 41.2,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 54.5,
          "nonFinancialShare": 50.5,
          "debtShareOfGross": 5
        }
      },
      "2026": {
        "totalWealthTrillion": 1.26,
        "wealthPerAdultUSD": 82800,
        "medianWealthUSD": 25300,
        "gdpTrillionUSD": 0.38,
        "gdpPerCapitaUSD": 18500,
        "inflationRate": 3.2,
        "debtToGdp": 41.6,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 55,
          "nonFinancialShare": 50,
          "debtShareOfGross": 5
        }
      }
    }
  },
  {
    "code": "COL",
    "name": "Colombia",
    "region": "Latin America",
    "blocs": [],
    "flag": "🇨🇴",
    "coordinates": [
      -74.07,
      4.71
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.08,
        "wealthPerAdultUSD": 5800,
        "medianWealthUSD": 2100,
        "gdpTrillionUSD": 0.03,
        "gdpPerCapitaUSD": 1240,
        "inflationRate": 26.5,
        "debtToGdp": 20,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 25,
          "nonFinancialShare": 79,
          "debtShareOfGross": 4
        }
      },
      "1990": {
        "totalWealthTrillion": 0.18,
        "wealthPerAdultUSD": 9400,
        "medianWealthUSD": 3200,
        "gdpTrillionUSD": 0.05,
        "gdpPerCapitaUSD": 1470,
        "inflationRate": 29.1,
        "debtToGdp": 41,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 26,
          "nonFinancialShare": 78,
          "debtShareOfGross": 4
        }
      },
      "1995": {
        "totalWealthTrillion": 0.29,
        "wealthPerAdultUSD": 13200,
        "medianWealthUSD": 4300,
        "gdpTrillionUSD": 0.09,
        "gdpPerCapitaUSD": 2470,
        "inflationRate": 20.9,
        "debtToGdp": 28,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 28,
          "nonFinancialShare": 76,
          "debtShareOfGross": 4
        }
      },
      "2000": {
        "totalWealthTrillion": 0.36,
        "wealthPerAdultUSD": 14600,
        "medianWealthUSD": 4600,
        "gdpTrillionUSD": 0.1,
        "gdpPerCapitaUSD": 2500,
        "inflationRate": 9.2,
        "debtToGdp": 42.8,
        "gini": 0.79,
        "assetMix": {
          "financialShare": 29,
          "nonFinancialShare": 75,
          "debtShareOfGross": 4
        }
      },
      "2010": {
        "totalWealthTrillion": 0.65,
        "wealthPerAdultUSD": 21500,
        "medianWealthUSD": 6200,
        "gdpTrillionUSD": 0.29,
        "gdpPerCapitaUSD": 6300,
        "inflationRate": 2.3,
        "debtToGdp": 36.5,
        "gini": 0.81,
        "assetMix": {
          "financialShare": 31,
          "nonFinancialShare": 73,
          "debtShareOfGross": 4
        }
      },
      "2020": {
        "totalWealthTrillion": 0.82,
        "wealthPerAdultUSD": 23200,
        "medianWealthUSD": 6500,
        "gdpTrillionUSD": 0.27,
        "gdpPerCapitaUSD": 5350,
        "inflationRate": 2.5,
        "debtToGdp": 65.4,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 32,
          "nonFinancialShare": 72,
          "debtShareOfGross": 4
        }
      },
      "2022": {
        "totalWealthTrillion": 0.92,
        "wealthPerAdultUSD": 25400,
        "medianWealthUSD": 7100,
        "gdpTrillionUSD": 0.34,
        "gdpPerCapitaUSD": 6630,
        "inflationRate": 10.2,
        "debtToGdp": 60.8,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 32.5,
          "nonFinancialShare": 71.5,
          "debtShareOfGross": 4
        }
      },
      "2024": {
        "totalWealthTrillion": 1.02,
        "wealthPerAdultUSD": 27500,
        "medianWealthUSD": 7600,
        "gdpTrillionUSD": 0.39,
        "gdpPerCapitaUSD": 7420,
        "inflationRate": 6.8,
        "debtToGdp": 57.5,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 33,
          "nonFinancialShare": 71,
          "debtShareOfGross": 4
        }
      },
      "2025": {
        "totalWealthTrillion": 1.06,
        "wealthPerAdultUSD": 28400,
        "medianWealthUSD": 7850,
        "gdpTrillionUSD": 0.41,
        "gdpPerCapitaUSD": 7750,
        "inflationRate": 5.4,
        "debtToGdp": 56.8,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 33.5,
          "nonFinancialShare": 70.5,
          "debtShareOfGross": 4
        }
      },
      "2026": {
        "totalWealthTrillion": 1.12,
        "wealthPerAdultUSD": 29600,
        "medianWealthUSD": 8150,
        "gdpTrillionUSD": 0.43,
        "gdpPerCapitaUSD": 8100,
        "inflationRate": 4.6,
        "debtToGdp": 56,
        "gini": 0.82,
        "assetMix": {
          "financialShare": 34,
          "nonFinancialShare": 70,
          "debtShareOfGross": 4
        }
      }
    }
  },
  {
    "code": "EGY",
    "name": "Egypt",
    "region": "Africa",
    "blocs": [
      "brics"
    ],
    "flag": "🇪🇬",
    "coordinates": [
      31.23,
      30.04
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.06,
        "wealthPerAdultUSD": 2800,
        "medianWealthUSD": 1100,
        "gdpTrillionUSD": 0.02,
        "gdpPerCapitaUSD": 510,
        "inflationRate": 20.5,
        "debtToGdp": 85,
        "gini": 0.66,
        "assetMix": {
          "financialShare": 22,
          "nonFinancialShare": 81,
          "debtShareOfGross": 3
        }
      },
      "1990": {
        "totalWealthTrillion": 0.16,
        "wealthPerAdultUSD": 5200,
        "medianWealthUSD": 1850,
        "gdpTrillionUSD": 0.043,
        "gdpPerCapitaUSD": 770,
        "inflationRate": 16.8,
        "debtToGdp": 125,
        "gini": 0.7,
        "assetMix": {
          "financialShare": 24,
          "nonFinancialShare": 79,
          "debtShareOfGross": 3
        }
      },
      "1995": {
        "totalWealthTrillion": 0.28,
        "wealthPerAdultUSD": 7400,
        "medianWealthUSD": 2400,
        "gdpTrillionUSD": 0.06,
        "gdpPerCapitaUSD": 970,
        "inflationRate": 15.7,
        "debtToGdp": 82,
        "gini": 0.72,
        "assetMix": {
          "financialShare": 25,
          "nonFinancialShare": 78,
          "debtShareOfGross": 3
        }
      },
      "2000": {
        "totalWealthTrillion": 0.42,
        "wealthPerAdultUSD": 9600,
        "medianWealthUSD": 3100,
        "gdpTrillionUSD": 0.1,
        "gdpPerCapitaUSD": 1450,
        "inflationRate": 2.7,
        "debtToGdp": 78,
        "gini": 0.74,
        "assetMix": {
          "financialShare": 27,
          "nonFinancialShare": 76,
          "debtShareOfGross": 3
        }
      },
      "2010": {
        "totalWealthTrillion": 0.85,
        "wealthPerAdultUSD": 15800,
        "medianWealthUSD": 4600,
        "gdpTrillionUSD": 0.22,
        "gdpPerCapitaUSD": 2600,
        "inflationRate": 11.3,
        "debtToGdp": 73,
        "gini": 0.76,
        "assetMix": {
          "financialShare": 29,
          "nonFinancialShare": 74,
          "debtShareOfGross": 3
        }
      },
      "2020": {
        "totalWealthTrillion": 1.15,
        "wealthPerAdultUSD": 17500,
        "medianWealthUSD": 5100,
        "gdpTrillionUSD": 0.36,
        "gdpPerCapitaUSD": 3500,
        "inflationRate": 5.7,
        "debtToGdp": 86.2,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 30,
          "nonFinancialShare": 73,
          "debtShareOfGross": 3
        }
      },
      "2022": {
        "totalWealthTrillion": 1.25,
        "wealthPerAdultUSD": 18400,
        "medianWealthUSD": 5300,
        "gdpTrillionUSD": 0.48,
        "gdpPerCapitaUSD": 4300,
        "inflationRate": 13.9,
        "debtToGdp": 88.5,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 30.5,
          "nonFinancialShare": 72.5,
          "debtShareOfGross": 3
        }
      },
      "2024": {
        "totalWealthTrillion": 1.38,
        "wealthPerAdultUSD": 19600,
        "medianWealthUSD": 5650,
        "gdpTrillionUSD": 0.41,
        "gdpPerCapitaUSD": 3600,
        "inflationRate": 33.5,
        "debtToGdp": 92.4,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 31,
          "nonFinancialShare": 72,
          "debtShareOfGross": 3
        }
      },
      "2025": {
        "totalWealthTrillion": 1.45,
        "wealthPerAdultUSD": 20400,
        "medianWealthUSD": 5850,
        "gdpTrillionUSD": 0.44,
        "gdpPerCapitaUSD": 3820,
        "inflationRate": 24,
        "debtToGdp": 90.5,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 31.5,
          "nonFinancialShare": 71.5,
          "debtShareOfGross": 3
        }
      },
      "2026": {
        "totalWealthTrillion": 1.54,
        "wealthPerAdultUSD": 21400,
        "medianWealthUSD": 6100,
        "gdpTrillionUSD": 0.47,
        "gdpPerCapitaUSD": 4050,
        "inflationRate": 17.5,
        "debtToGdp": 88,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 32,
          "nonFinancialShare": 71,
          "debtShareOfGross": 3
        }
      }
    }
  },
  {
    "code": "NGA",
    "name": "Nigeria",
    "region": "Africa",
    "blocs": [],
    "flag": "🇳🇬",
    "coordinates": [
      7.49,
      9.07
    ],
    "history": {
      "1980": {
        "totalWealthTrillion": 0.11,
        "wealthPerAdultUSD": 2800,
        "medianWealthUSD": 950,
        "gdpTrillionUSD": 0.06,
        "gdpPerCapitaUSD": 870,
        "inflationRate": 11.4,
        "debtToGdp": 14,
        "gini": 0.68,
        "assetMix": {
          "financialShare": 16,
          "nonFinancialShare": 86,
          "debtShareOfGross": 2
        }
      },
      "1990": {
        "totalWealthTrillion": 0.18,
        "wealthPerAdultUSD": 3400,
        "medianWealthUSD": 1100,
        "gdpTrillionUSD": 0.03,
        "gdpPerCapitaUSD": 310,
        "inflationRate": 7.4,
        "debtToGdp": 72,
        "gini": 0.71,
        "assetMix": {
          "financialShare": 18,
          "nonFinancialShare": 84,
          "debtShareOfGross": 2
        }
      },
      "1995": {
        "totalWealthTrillion": 0.26,
        "wealthPerAdultUSD": 4200,
        "medianWealthUSD": 1300,
        "gdpTrillionUSD": 0.035,
        "gdpPerCapitaUSD": 320,
        "inflationRate": 72.8,
        "debtToGdp": 75,
        "gini": 0.73,
        "assetMix": {
          "financialShare": 19,
          "nonFinancialShare": 83,
          "debtShareOfGross": 2
        }
      },
      "2000": {
        "totalWealthTrillion": 0.38,
        "wealthPerAdultUSD": 5400,
        "medianWealthUSD": 1550,
        "gdpTrillionUSD": 0.07,
        "gdpPerCapitaUSD": 570,
        "inflationRate": 6.9,
        "debtToGdp": 59.8,
        "gini": 0.75,
        "assetMix": {
          "financialShare": 20,
          "nonFinancialShare": 82,
          "debtShareOfGross": 2
        }
      },
      "2010": {
        "totalWealthTrillion": 0.75,
        "wealthPerAdultUSD": 8500,
        "medianWealthUSD": 2200,
        "gdpTrillionUSD": 0.36,
        "gdpPerCapitaUSD": 2280,
        "inflationRate": 13.7,
        "debtToGdp": 9.6,
        "gini": 0.77,
        "assetMix": {
          "financialShare": 23,
          "nonFinancialShare": 79,
          "debtShareOfGross": 2
        }
      },
      "2020": {
        "totalWealthTrillion": 1.05,
        "wealthPerAdultUSD": 9800,
        "medianWealthUSD": 2450,
        "gdpTrillionUSD": 0.43,
        "gdpPerCapitaUSD": 2090,
        "inflationRate": 13.2,
        "debtToGdp": 34.5,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 24,
          "nonFinancialShare": 78,
          "debtShareOfGross": 2
        }
      },
      "2022": {
        "totalWealthTrillion": 1.15,
        "wealthPerAdultUSD": 10200,
        "medianWealthUSD": 2550,
        "gdpTrillionUSD": 0.48,
        "gdpPerCapitaUSD": 2180,
        "inflationRate": 18.8,
        "debtToGdp": 39.8,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 24.5,
          "nonFinancialShare": 77.5,
          "debtShareOfGross": 2
        }
      },
      "2024": {
        "totalWealthTrillion": 1.18,
        "wealthPerAdultUSD": 10100,
        "medianWealthUSD": 2500,
        "gdpTrillionUSD": 0.36,
        "gdpPerCapitaUSD": 1590,
        "inflationRate": 31.7,
        "debtToGdp": 43.5,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 25,
          "nonFinancialShare": 77,
          "debtShareOfGross": 2
        }
      },
      "2025": {
        "totalWealthTrillion": 1.24,
        "wealthPerAdultUSD": 10400,
        "medianWealthUSD": 2580,
        "gdpTrillionUSD": 0.39,
        "gdpPerCapitaUSD": 1680,
        "inflationRate": 24.5,
        "debtToGdp": 42.8,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 25.5,
          "nonFinancialShare": 76.5,
          "debtShareOfGross": 2
        }
      },
      "2026": {
        "totalWealthTrillion": 1.32,
        "wealthPerAdultUSD": 10850,
        "medianWealthUSD": 2680,
        "gdpTrillionUSD": 0.42,
        "gdpPerCapitaUSD": 1780,
        "inflationRate": 18.2,
        "debtToGdp": 41.5,
        "gini": 0.78,
        "assetMix": {
          "financialShare": 26,
          "nonFinancialShare": 76,
          "debtShareOfGross": 2
        }
      }
    }
  }
,
  {
  "code": "NOR",
  "name": "Norway",
  "region": "Europe",
  "blocs": [
    "nordic",
    "efta"
  ],
  "flag": "🇳🇴",
  "coordinates": [
    8.46,
    60.47
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.12,
      "wealthPerAdultUSD": 41200,
      "medianWealthUSD": 18400,
      "gdpTrillionUSD": 0.064,
      "gdpPerCapitaUSD": 15700,
      "inflationRate": 10.9,
      "debtToGdp": 47,
      "gini": 0.62,
      "assetMix": {
        "financialShare": 45,
        "nonFinancialShare": 65,
        "debtShareOfGross": 10
      }
    },
    "1990": {
      "totalWealthTrillion": 0.28,
      "wealthPerAdultUSD": 85400,
      "medianWealthUSD": 36200,
      "gdpTrillionUSD": 0.12,
      "gdpPerCapitaUSD": 28100,
      "inflationRate": 4.1,
      "debtToGdp": 28,
      "gini": 0.63,
      "assetMix": {
        "financialShare": 48,
        "nonFinancialShare": 62,
        "debtShareOfGross": 10
      }
    },
    "1995": {
      "totalWealthTrillion": 0.42,
      "wealthPerAdultUSD": 122000,
      "medianWealthUSD": 49500,
      "gdpTrillionUSD": 0.15,
      "gdpPerCapitaUSD": 34800,
      "inflationRate": 2.5,
      "debtToGdp": 32,
      "gini": 0.64,
      "assetMix": {
        "financialShare": 50,
        "nonFinancialShare": 60,
        "debtShareOfGross": 10
      }
    },
    "2000": {
      "totalWealthTrillion": 0.62,
      "wealthPerAdultUSD": 174000,
      "medianWealthUSD": 68500,
      "gdpTrillionUSD": 0.17,
      "gdpPerCapitaUSD": 37800,
      "inflationRate": 3.1,
      "debtToGdp": 29,
      "gini": 0.65,
      "assetMix": {
        "financialShare": 52,
        "nonFinancialShare": 58,
        "debtShareOfGross": 10
      }
    },
    "2010": {
      "totalWealthTrillion": 1.15,
      "wealthPerAdultUSD": 298000,
      "medianWealthUSD": 114000,
      "gdpTrillionUSD": 0.43,
      "gdpPerCapitaUSD": 87600,
      "inflationRate": 2.4,
      "debtToGdp": 42,
      "gini": 0.67,
      "assetMix": {
        "financialShare": 56,
        "nonFinancialShare": 54,
        "debtShareOfGross": 10
      }
    },
    "2020": {
      "totalWealthTrillion": 1.48,
      "wealthPerAdultUSD": 362000,
      "medianWealthUSD": 139000,
      "gdpTrillionUSD": 0.37,
      "gdpPerCapitaUSD": 68900,
      "inflationRate": 1.3,
      "debtToGdp": 46.5,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 61,
        "nonFinancialShare": 50,
        "debtShareOfGross": 11
      }
    },
    "2022": {
      "totalWealthTrillion": 1.58,
      "wealthPerAdultUSD": 382000,
      "medianWealthUSD": 147000,
      "gdpTrillionUSD": 0.59,
      "gdpPerCapitaUSD": 108900,
      "inflationRate": 5.8,
      "debtToGdp": 37,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 62,
        "nonFinancialShare": 49,
        "debtShareOfGross": 11
      }
    },
    "2024": {
      "totalWealthTrillion": 1.69,
      "wealthPerAdultUSD": 402000,
      "medianWealthUSD": 154000,
      "gdpTrillionUSD": 0.54,
      "gdpPerCapitaUSD": 98500,
      "inflationRate": 3.2,
      "debtToGdp": 38,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 63.5,
        "nonFinancialShare": 48.5,
        "debtShareOfGross": 12
      }
    },
    "2025": {
      "totalWealthTrillion": 1.73,
      "wealthPerAdultUSD": 408000,
      "medianWealthUSD": 156000,
      "gdpTrillionUSD": 0.55,
      "gdpPerCapitaUSD": 100200,
      "inflationRate": 2.9,
      "debtToGdp": 38.2,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 63.8,
        "nonFinancialShare": 48.2,
        "debtShareOfGross": 12
      }
    },
    "2026": {
      "totalWealthTrillion": 1.78,
      "wealthPerAdultUSD": 415000,
      "medianWealthUSD": 158000,
      "gdpTrillionUSD": 0.56,
      "gdpPerCapitaUSD": 102000,
      "inflationRate": 2.8,
      "debtToGdp": 38.5,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 64,
        "nonFinancialShare": 48,
        "debtShareOfGross": 12
      }
    }
  }
},
  {
  "code": "IRL",
  "name": "Ireland",
  "region": "Europe",
  "blocs": [
    "eurozone",
    "eu"
  ],
  "flag": "🇮🇪",
  "coordinates": [
    -8.24,
    53.41
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.08,
      "wealthPerAdultUSD": 36500,
      "medianWealthUSD": 19200,
      "gdpTrillionUSD": 0.021,
      "gdpPerCapitaUSD": 6200,
      "inflationRate": 18.2,
      "debtToGdp": 73,
      "gini": 0.64,
      "assetMix": {
        "financialShare": 35,
        "nonFinancialShare": 72,
        "debtShareOfGross": 7
      }
    },
    "1990": {
      "totalWealthTrillion": 0.18,
      "wealthPerAdultUSD": 74200,
      "medianWealthUSD": 38500,
      "gdpTrillionUSD": 0.048,
      "gdpPerCapitaUSD": 13700,
      "inflationRate": 3.4,
      "debtToGdp": 96,
      "gini": 0.66,
      "assetMix": {
        "financialShare": 38,
        "nonFinancialShare": 70,
        "debtShareOfGross": 8
      }
    },
    "1995": {
      "totalWealthTrillion": 0.28,
      "wealthPerAdultUSD": 106000,
      "medianWealthUSD": 54000,
      "gdpTrillionUSD": 0.069,
      "gdpPerCapitaUSD": 19100,
      "inflationRate": 2.5,
      "debtToGdp": 81,
      "gini": 0.67,
      "assetMix": {
        "financialShare": 42,
        "nonFinancialShare": 66,
        "debtShareOfGross": 8
      }
    },
    "2000": {
      "totalWealthTrillion": 0.52,
      "wealthPerAdultUSD": 182000,
      "medianWealthUSD": 92000,
      "gdpTrillionUSD": 0.1,
      "gdpPerCapitaUSD": 26300,
      "inflationRate": 5.6,
      "debtToGdp": 37,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 45,
        "nonFinancialShare": 64,
        "debtShareOfGross": 9
      }
    },
    "2010": {
      "totalWealthTrillion": 0.68,
      "wealthPerAdultUSD": 204000,
      "medianWealthUSD": 98000,
      "gdpTrillionUSD": 0.22,
      "gdpPerCapitaUSD": 48600,
      "inflationRate": -1,
      "debtToGdp": 86,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 46,
        "nonFinancialShare": 64,
        "debtShareOfGross": 10
      }
    },
    "2020": {
      "totalWealthTrillion": 1.05,
      "wealthPerAdultUSD": 295000,
      "medianWealthUSD": 152000,
      "gdpTrillionUSD": 0.42,
      "gdpPerCapitaUSD": 84700,
      "inflationRate": -0.3,
      "debtToGdp": 58.5,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 49,
        "nonFinancialShare": 61,
        "debtShareOfGross": 10
      }
    },
    "2022": {
      "totalWealthTrillion": 1.18,
      "wealthPerAdultUSD": 325000,
      "medianWealthUSD": 165000,
      "gdpTrillionUSD": 0.53,
      "gdpPerCapitaUSD": 104500,
      "inflationRate": 7.8,
      "debtToGdp": 44.5,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 50,
        "nonFinancialShare": 60,
        "debtShareOfGross": 10
      }
    },
    "2024": {
      "totalWealthTrillion": 1.3,
      "wealthPerAdultUSD": 352000,
      "medianWealthUSD": 176000,
      "gdpTrillionUSD": 0.55,
      "gdpPerCapitaUSD": 108500,
      "inflationRate": 2.4,
      "debtToGdp": 41,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 51.5,
        "nonFinancialShare": 58.5,
        "debtShareOfGross": 10
      }
    },
    "2025": {
      "totalWealthTrillion": 1.34,
      "wealthPerAdultUSD": 358000,
      "medianWealthUSD": 179000,
      "gdpTrillionUSD": 0.57,
      "gdpPerCapitaUSD": 110500,
      "inflationRate": 2.2,
      "debtToGdp": 40.2,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 51.8,
        "nonFinancialShare": 58.2,
        "debtShareOfGross": 10
      }
    },
    "2026": {
      "totalWealthTrillion": 1.38,
      "wealthPerAdultUSD": 365000,
      "medianWealthUSD": 182000,
      "gdpTrillionUSD": 0.58,
      "gdpPerCapitaUSD": 112000,
      "inflationRate": 2.1,
      "debtToGdp": 39.5,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 52,
        "nonFinancialShare": 58,
        "debtShareOfGross": 10
      }
    }
  }
},
  {
  "code": "BEL",
  "name": "Belgium",
  "region": "Europe",
  "blocs": [
    "eurozone",
    "eu"
  ],
  "flag": "🇧🇪",
  "coordinates": [
    4.46,
    50.5
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.42,
      "wealthPerAdultUSD": 56400,
      "medianWealthUSD": 34500,
      "gdpTrillionUSD": 0.12,
      "gdpPerCapitaUSD": 12400,
      "inflationRate": 6.6,
      "debtToGdp": 78,
      "gini": 0.56,
      "assetMix": {
        "financialShare": 52,
        "nonFinancialShare": 56,
        "debtShareOfGross": 8
      }
    },
    "1990": {
      "totalWealthTrillion": 0.98,
      "wealthPerAdultUSD": 122000,
      "medianWealthUSD": 74200,
      "gdpTrillionUSD": 0.2,
      "gdpPerCapitaUSD": 19800,
      "inflationRate": 3.4,
      "debtToGdp": 129,
      "gini": 0.58,
      "assetMix": {
        "financialShare": 54,
        "nonFinancialShare": 54,
        "debtShareOfGross": 8
      }
    },
    "1995": {
      "totalWealthTrillion": 1.35,
      "wealthPerAdultUSD": 165000,
      "medianWealthUSD": 102000,
      "gdpTrillionUSD": 0.29,
      "gdpPerCapitaUSD": 28400,
      "inflationRate": 1.5,
      "debtToGdp": 131,
      "gini": 0.58,
      "assetMix": {
        "financialShare": 55,
        "nonFinancialShare": 53,
        "debtShareOfGross": 8
      }
    },
    "2000": {
      "totalWealthTrillion": 1.82,
      "wealthPerAdultUSD": 218000,
      "medianWealthUSD": 134000,
      "gdpTrillionUSD": 0.24,
      "gdpPerCapitaUSD": 23100,
      "inflationRate": 2.5,
      "debtToGdp": 109,
      "gini": 0.59,
      "assetMix": {
        "financialShare": 56,
        "nonFinancialShare": 52,
        "debtShareOfGross": 8
      }
    },
    "2010": {
      "totalWealthTrillion": 2.75,
      "wealthPerAdultUSD": 312000,
      "medianWealthUSD": 192000,
      "gdpTrillionUSD": 0.48,
      "gdpPerCapitaUSD": 44200,
      "inflationRate": 2.2,
      "debtToGdp": 100,
      "gini": 0.6,
      "assetMix": {
        "financialShare": 56.5,
        "nonFinancialShare": 52.5,
        "debtShareOfGross": 9
      }
    },
    "2020": {
      "totalWealthTrillion": 3.32,
      "wealthPerAdultUSD": 374000,
      "medianWealthUSD": 232000,
      "gdpTrillionUSD": 0.52,
      "gdpPerCapitaUSD": 45200,
      "inflationRate": 0.7,
      "debtToGdp": 112.5,
      "gini": 0.6,
      "assetMix": {
        "financialShare": 57.5,
        "nonFinancialShare": 52,
        "debtShareOfGross": 9.5
      }
    },
    "2022": {
      "totalWealthTrillion": 3.52,
      "wealthPerAdultUSD": 395000,
      "medianWealthUSD": 242000,
      "gdpTrillionUSD": 0.58,
      "gdpPerCapitaUSD": 49800,
      "inflationRate": 9.6,
      "debtToGdp": 104.5,
      "gini": 0.6,
      "assetMix": {
        "financialShare": 57,
        "nonFinancialShare": 52.5,
        "debtShareOfGross": 9.5
      }
    },
    "2024": {
      "totalWealthTrillion": 3.72,
      "wealthPerAdultUSD": 416000,
      "medianWealthUSD": 251000,
      "gdpTrillionUSD": 0.63,
      "gdpPerCapitaUSD": 54100,
      "inflationRate": 2.8,
      "debtToGdp": 105,
      "gini": 0.6,
      "assetMix": {
        "financialShare": 57.8,
        "nonFinancialShare": 52,
        "debtShareOfGross": 9.8
      }
    },
    "2025": {
      "totalWealthTrillion": 3.78,
      "wealthPerAdultUSD": 422000,
      "medianWealthUSD": 253500,
      "gdpTrillionUSD": 0.65,
      "gdpPerCapitaUSD": 55300,
      "inflationRate": 2.5,
      "debtToGdp": 105.5,
      "gini": 0.6,
      "assetMix": {
        "financialShare": 57.9,
        "nonFinancialShare": 52,
        "debtShareOfGross": 9.9
      }
    },
    "2026": {
      "totalWealthTrillion": 3.85,
      "wealthPerAdultUSD": 428000,
      "medianWealthUSD": 256000,
      "gdpTrillionUSD": 0.66,
      "gdpPerCapitaUSD": 56500,
      "inflationRate": 2.4,
      "debtToGdp": 106,
      "gini": 0.6,
      "assetMix": {
        "financialShare": 58,
        "nonFinancialShare": 52,
        "debtShareOfGross": 10
      }
    }
  }
},
  {
  "code": "AUT",
  "name": "Austria",
  "region": "Europe",
  "blocs": [
    "eurozone",
    "eu"
  ],
  "flag": "🇦🇹",
  "coordinates": [
    14.55,
    47.51
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.25,
      "wealthPerAdultUSD": 42500,
      "medianWealthUSD": 14800,
      "gdpTrillionUSD": 0.08,
      "gdpPerCapitaUSD": 10700,
      "inflationRate": 6.4,
      "debtToGdp": 36.5,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 40,
        "nonFinancialShare": 66,
        "debtShareOfGross": 6
      }
    },
    "1990": {
      "totalWealthTrillion": 0.62,
      "wealthPerAdultUSD": 98500,
      "medianWealthUSD": 33400,
      "gdpTrillionUSD": 0.17,
      "gdpPerCapitaUSD": 21700,
      "inflationRate": 3.3,
      "debtToGdp": 57,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 42,
        "nonFinancialShare": 64,
        "debtShareOfGross": 6
      }
    },
    "1995": {
      "totalWealthTrillion": 0.88,
      "wealthPerAdultUSD": 136000,
      "medianWealthUSD": 46200,
      "gdpTrillionUSD": 0.24,
      "gdpPerCapitaUSD": 30400,
      "inflationRate": 2.2,
      "debtToGdp": 68,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 43,
        "nonFinancialShare": 63,
        "debtShareOfGross": 6
      }
    },
    "2000": {
      "totalWealthTrillion": 1.15,
      "wealthPerAdultUSD": 172000,
      "medianWealthUSD": 58500,
      "gdpTrillionUSD": 0.19,
      "gdpPerCapitaUSD": 24200,
      "inflationRate": 2.3,
      "debtToGdp": 66,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 44,
        "nonFinancialShare": 63,
        "debtShareOfGross": 7
      }
    },
    "2010": {
      "totalWealthTrillion": 1.75,
      "wealthPerAdultUSD": 252000,
      "medianWealthUSD": 82000,
      "gdpTrillionUSD": 0.39,
      "gdpPerCapitaUSD": 46900,
      "inflationRate": 1.8,
      "debtToGdp": 82.5,
      "gini": 0.73,
      "assetMix": {
        "financialShare": 45,
        "nonFinancialShare": 63,
        "debtShareOfGross": 8
      }
    },
    "2020": {
      "totalWealthTrillion": 2.12,
      "wealthPerAdultUSD": 298000,
      "medianWealthUSD": 98500,
      "gdpTrillionUSD": 0.43,
      "gdpPerCapitaUSD": 48600,
      "inflationRate": 1.4,
      "debtToGdp": 83,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 45.5,
        "nonFinancialShare": 62.5,
        "debtShareOfGross": 8
      }
    },
    "2022": {
      "totalWealthTrillion": 2.24,
      "wealthPerAdultUSD": 312000,
      "medianWealthUSD": 102000,
      "gdpTrillionUSD": 0.47,
      "gdpPerCapitaUSD": 52400,
      "inflationRate": 8.6,
      "debtToGdp": 78,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 45.8,
        "nonFinancialShare": 62.2,
        "debtShareOfGross": 8
      }
    },
    "2024": {
      "totalWealthTrillion": 2.37,
      "wealthPerAdultUSD": 329000,
      "medianWealthUSD": 106000,
      "gdpTrillionUSD": 0.52,
      "gdpPerCapitaUSD": 57400,
      "inflationRate": 2.9,
      "debtToGdp": 79,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 46,
        "nonFinancialShare": 62,
        "debtShareOfGross": 8
      }
    },
    "2025": {
      "totalWealthTrillion": 2.41,
      "wealthPerAdultUSD": 333000,
      "medianWealthUSD": 107000,
      "gdpTrillionUSD": 0.53,
      "gdpPerCapitaUSD": 58600,
      "inflationRate": 2.7,
      "debtToGdp": 79.2,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 46,
        "nonFinancialShare": 62,
        "debtShareOfGross": 8
      }
    },
    "2026": {
      "totalWealthTrillion": 2.45,
      "wealthPerAdultUSD": 338000,
      "medianWealthUSD": 108000,
      "gdpTrillionUSD": 0.54,
      "gdpPerCapitaUSD": 59800,
      "inflationRate": 2.6,
      "debtToGdp": 79.5,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 46,
        "nonFinancialShare": 62,
        "debtShareOfGross": 8
      }
    }
  }
},
  {
  "code": "DNK",
  "name": "Denmark",
  "region": "Europe",
  "blocs": [
    "nordic",
    "eu"
  ],
  "flag": "🇩🇰",
  "coordinates": [
    9.5,
    56.26
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.18,
      "wealthPerAdultUSD": 45200,
      "medianWealthUSD": 18500,
      "gdpTrillionUSD": 0.07,
      "gdpPerCapitaUSD": 13700,
      "inflationRate": 12.3,
      "debtToGdp": 38,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 55,
        "nonFinancialShare": 55,
        "debtShareOfGross": 10
      }
    },
    "1990": {
      "totalWealthTrillion": 0.42,
      "wealthPerAdultUSD": 101000,
      "medianWealthUSD": 42500,
      "gdpTrillionUSD": 0.14,
      "gdpPerCapitaUSD": 27100,
      "inflationRate": 2.6,
      "debtToGdp": 68,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 58,
        "nonFinancialShare": 52,
        "debtShareOfGross": 10
      }
    },
    "1995": {
      "totalWealthTrillion": 0.62,
      "wealthPerAdultUSD": 146000,
      "medianWealthUSD": 62000,
      "gdpTrillionUSD": 0.19,
      "gdpPerCapitaUSD": 35700,
      "inflationRate": 2.1,
      "debtToGdp": 73,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 60,
        "nonFinancialShare": 51,
        "debtShareOfGross": 11
      }
    },
    "2000": {
      "totalWealthTrillion": 0.85,
      "wealthPerAdultUSD": 198000,
      "medianWealthUSD": 85000,
      "gdpTrillionUSD": 0.16,
      "gdpPerCapitaUSD": 30800,
      "inflationRate": 2.9,
      "debtToGdp": 52,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 62,
        "nonFinancialShare": 49,
        "debtShareOfGross": 11
      }
    },
    "2010": {
      "totalWealthTrillion": 1.35,
      "wealthPerAdultUSD": 308000,
      "medianWealthUSD": 135000,
      "gdpTrillionUSD": 0.32,
      "gdpPerCapitaUSD": 58100,
      "inflationRate": 2.3,
      "debtToGdp": 42.5,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 64,
        "nonFinancialShare": 48,
        "debtShareOfGross": 12
      }
    },
    "2020": {
      "totalWealthTrillion": 1.78,
      "wealthPerAdultUSD": 395000,
      "medianWealthUSD": 175000,
      "gdpTrillionUSD": 0.35,
      "gdpPerCapitaUSD": 61100,
      "inflationRate": 0.4,
      "debtToGdp": 42,
      "gini": 0.73,
      "assetMix": {
        "financialShare": 65,
        "nonFinancialShare": 47,
        "debtShareOfGross": 12
      }
    },
    "2022": {
      "totalWealthTrillion": 1.89,
      "wealthPerAdultUSD": 418000,
      "medianWealthUSD": 185000,
      "gdpTrillionUSD": 0.39,
      "gdpPerCapitaUSD": 67200,
      "inflationRate": 7.7,
      "debtToGdp": 30,
      "gini": 0.73,
      "assetMix": {
        "financialShare": 65.5,
        "nonFinancialShare": 46.5,
        "debtShareOfGross": 12
      }
    },
    "2024": {
      "totalWealthTrillion": 2.02,
      "wealthPerAdultUSD": 439000,
      "medianWealthUSD": 193000,
      "gdpTrillionUSD": 0.41,
      "gdpPerCapitaUSD": 69800,
      "inflationRate": 2.1,
      "debtToGdp": 29.8,
      "gini": 0.73,
      "assetMix": {
        "financialShare": 65.8,
        "nonFinancialShare": 46.2,
        "debtShareOfGross": 12
      }
    },
    "2025": {
      "totalWealthTrillion": 2.07,
      "wealthPerAdultUSD": 446000,
      "medianWealthUSD": 195500,
      "gdpTrillionUSD": 0.415,
      "gdpPerCapitaUSD": 70500,
      "inflationRate": 2,
      "debtToGdp": 29.6,
      "gini": 0.73,
      "assetMix": {
        "financialShare": 65.9,
        "nonFinancialShare": 46.1,
        "debtShareOfGross": 12
      }
    },
    "2026": {
      "totalWealthTrillion": 2.12,
      "wealthPerAdultUSD": 452000,
      "medianWealthUSD": 198000,
      "gdpTrillionUSD": 0.42,
      "gdpPerCapitaUSD": 71200,
      "inflationRate": 1.9,
      "debtToGdp": 29.5,
      "gini": 0.73,
      "assetMix": {
        "financialShare": 66,
        "nonFinancialShare": 46,
        "debtShareOfGross": 12
      }
    }
  }
},
  {
  "code": "ISR",
  "name": "Israel",
  "region": "Middle East",
  "blocs": [
    "oecd"
  ],
  "flag": "🇮🇱",
  "coordinates": [
    34.85,
    31.04
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.05,
      "wealthPerAdultUSD": 24500,
      "medianWealthUSD": 7800,
      "gdpTrillionUSD": 0.024,
      "gdpPerCapitaUSD": 6200,
      "inflationRate": 133,
      "debtToGdp": 145,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 42,
        "nonFinancialShare": 64,
        "debtShareOfGross": 6
      }
    },
    "1990": {
      "totalWealthTrillion": 0.14,
      "wealthPerAdultUSD": 48200,
      "medianWealthUSD": 15400,
      "gdpTrillionUSD": 0.059,
      "gdpPerCapitaUSD": 12800,
      "inflationRate": 17.2,
      "debtToGdp": 110,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 46,
        "nonFinancialShare": 60,
        "debtShareOfGross": 6
      }
    },
    "1995": {
      "totalWealthTrillion": 0.24,
      "wealthPerAdultUSD": 72000,
      "medianWealthUSD": 23500,
      "gdpTrillionUSD": 0.1,
      "gdpPerCapitaUSD": 18100,
      "inflationRate": 10,
      "debtToGdp": 98,
      "gini": 0.73,
      "assetMix": {
        "financialShare": 48,
        "nonFinancialShare": 58,
        "debtShareOfGross": 6
      }
    },
    "2000": {
      "totalWealthTrillion": 0.42,
      "wealthPerAdultUSD": 114000,
      "medianWealthUSD": 38000,
      "gdpTrillionUSD": 0.13,
      "gdpPerCapitaUSD": 21100,
      "inflationRate": 1.1,
      "debtToGdp": 83,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 50,
        "nonFinancialShare": 57,
        "debtShareOfGross": 7
      }
    },
    "2010": {
      "totalWealthTrillion": 0.78,
      "wealthPerAdultUSD": 165000,
      "medianWealthUSD": 54000,
      "gdpTrillionUSD": 0.23,
      "gdpPerCapitaUSD": 30800,
      "inflationRate": 2.7,
      "debtToGdp": 70,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 51,
        "nonFinancialShare": 56.5,
        "debtShareOfGross": 7.5
      }
    },
    "2020": {
      "totalWealthTrillion": 1.25,
      "wealthPerAdultUSD": 228000,
      "medianWealthUSD": 76000,
      "gdpTrillionUSD": 0.41,
      "gdpPerCapitaUSD": 44200,
      "inflationRate": -0.6,
      "debtToGdp": 71,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 53,
        "nonFinancialShare": 55.5,
        "debtShareOfGross": 8.5
      }
    },
    "2022": {
      "totalWealthTrillion": 1.42,
      "wealthPerAdultUSD": 252000,
      "medianWealthUSD": 84000,
      "gdpTrillionUSD": 0.52,
      "gdpPerCapitaUSD": 54600,
      "inflationRate": 4.4,
      "debtToGdp": 61,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 53.5,
        "nonFinancialShare": 55,
        "debtShareOfGross": 8.5
      }
    },
    "2024": {
      "totalWealthTrillion": 1.55,
      "wealthPerAdultUSD": 266000,
      "medianWealthUSD": 89000,
      "gdpTrillionUSD": 0.51,
      "gdpPerCapitaUSD": 53200,
      "inflationRate": 3.3,
      "debtToGdp": 67,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 53.8,
        "nonFinancialShare": 55.1,
        "debtShareOfGross": 8.9
      }
    },
    "2025": {
      "totalWealthTrillion": 1.6,
      "wealthPerAdultUSD": 271000,
      "medianWealthUSD": 90500,
      "gdpTrillionUSD": 0.52,
      "gdpPerCapitaUSD": 53900,
      "inflationRate": 3.2,
      "debtToGdp": 67.8,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 53.9,
        "nonFinancialShare": 55,
        "debtShareOfGross": 8.9
      }
    },
    "2026": {
      "totalWealthTrillion": 1.65,
      "wealthPerAdultUSD": 275000,
      "medianWealthUSD": 92000,
      "gdpTrillionUSD": 0.53,
      "gdpPerCapitaUSD": 54600,
      "inflationRate": 3.1,
      "debtToGdp": 68.5,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 54,
        "nonFinancialShare": 55,
        "debtShareOfGross": 9
      }
    }
  }
},
  {
  "code": "VNM",
  "name": "Vietnam",
  "region": "Asia",
  "blocs": [
    "asean"
  ],
  "flag": "🇻🇳",
  "coordinates": [
    108.27,
    14.05
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.015,
      "wealthPerAdultUSD": 520,
      "medianWealthUSD": 160,
      "gdpTrillionUSD": 0.027,
      "gdpPerCapitaUSD": 490,
      "inflationRate": 25,
      "debtToGdp": 80,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 12,
        "nonFinancialShare": 90,
        "debtShareOfGross": 2
      }
    },
    "1990": {
      "totalWealthTrillion": 0.035,
      "wealthPerAdultUSD": 1050,
      "medianWealthUSD": 340,
      "gdpTrillionUSD": 0.008,
      "gdpPerCapitaUSD": 120,
      "inflationRate": 67.4,
      "debtToGdp": 90,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 14,
        "nonFinancialShare": 88,
        "debtShareOfGross": 2
      }
    },
    "1995": {
      "totalWealthTrillion": 0.075,
      "wealthPerAdultUSD": 1950,
      "medianWealthUSD": 620,
      "gdpTrillionUSD": 0.021,
      "gdpPerCapitaUSD": 280,
      "inflationRate": 12.7,
      "debtToGdp": 72,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 16,
        "nonFinancialShare": 86,
        "debtShareOfGross": 2
      }
    },
    "2000": {
      "totalWealthTrillion": 0.15,
      "wealthPerAdultUSD": 3450,
      "medianWealthUSD": 1150,
      "gdpTrillionUSD": 0.031,
      "gdpPerCapitaUSD": 390,
      "inflationRate": -1.7,
      "debtToGdp": 41.5,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 18,
        "nonFinancialShare": 84,
        "debtShareOfGross": 2.5
      }
    },
    "2010": {
      "totalWealthTrillion": 0.42,
      "wealthPerAdultUSD": 7600,
      "medianWealthUSD": 2520,
      "gdpTrillionUSD": 0.15,
      "gdpPerCapitaUSD": 1680,
      "inflationRate": 9.2,
      "debtToGdp": 45,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 20,
        "nonFinancialShare": 82.5,
        "debtShareOfGross": 3
      }
    },
    "2020": {
      "totalWealthTrillion": 0.95,
      "wealthPerAdultUSD": 14800,
      "medianWealthUSD": 4950,
      "gdpTrillionUSD": 0.35,
      "gdpPerCapitaUSD": 3550,
      "inflationRate": 3.2,
      "debtToGdp": 41.5,
      "gini": 0.76,
      "assetMix": {
        "financialShare": 22.5,
        "nonFinancialShare": 81,
        "debtShareOfGross": 3.5
      }
    },
    "2022": {
      "totalWealthTrillion": 1.15,
      "wealthPerAdultUSD": 17200,
      "medianWealthUSD": 5750,
      "gdpTrillionUSD": 0.41,
      "gdpPerCapitaUSD": 4160,
      "inflationRate": 3.2,
      "debtToGdp": 38,
      "gini": 0.76,
      "assetMix": {
        "financialShare": 23,
        "nonFinancialShare": 80.5,
        "debtShareOfGross": 3.5
      }
    },
    "2024": {
      "totalWealthTrillion": 1.32,
      "wealthPerAdultUSD": 19400,
      "medianWealthUSD": 6450,
      "gdpTrillionUSD": 0.46,
      "gdpPerCapitaUSD": 4620,
      "inflationRate": 3.7,
      "debtToGdp": 37.2,
      "gini": 0.77,
      "assetMix": {
        "financialShare": 23.8,
        "nonFinancialShare": 80.2,
        "debtShareOfGross": 4
      }
    },
    "2025": {
      "totalWealthTrillion": 1.37,
      "wealthPerAdultUSD": 20000,
      "medianWealthUSD": 6620,
      "gdpTrillionUSD": 0.475,
      "gdpPerCapitaUSD": 4740,
      "inflationRate": 3.8,
      "debtToGdp": 37.1,
      "gini": 0.77,
      "assetMix": {
        "financialShare": 23.9,
        "nonFinancialShare": 80.1,
        "debtShareOfGross": 4
      }
    },
    "2026": {
      "totalWealthTrillion": 1.42,
      "wealthPerAdultUSD": 20500,
      "medianWealthUSD": 6800,
      "gdpTrillionUSD": 0.49,
      "gdpPerCapitaUSD": 4850,
      "inflationRate": 3.8,
      "debtToGdp": 37,
      "gini": 0.77,
      "assetMix": {
        "financialShare": 24,
        "nonFinancialShare": 80,
        "debtShareOfGross": 4
      }
    }
  }
},
  {
  "code": "MYS",
  "name": "Malaysia",
  "region": "Asia",
  "blocs": [
    "asean"
  ],
  "flag": "🇲🇾",
  "coordinates": [
    101.97,
    4.21
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.04,
      "wealthPerAdultUSD": 5400,
      "medianWealthUSD": 1650,
      "gdpTrillionUSD": 0.025,
      "gdpPerCapitaUSD": 1800,
      "inflationRate": 6.7,
      "debtToGdp": 44,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 30,
        "nonFinancialShare": 74,
        "debtShareOfGross": 4
      }
    },
    "1990": {
      "totalWealthTrillion": 0.11,
      "wealthPerAdultUSD": 11200,
      "medianWealthUSD": 3450,
      "gdpTrillionUSD": 0.044,
      "gdpPerCapitaUSD": 2450,
      "inflationRate": 2.6,
      "debtToGdp": 75,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 34,
        "nonFinancialShare": 71,
        "debtShareOfGross": 5
      }
    },
    "1995": {
      "totalWealthTrillion": 0.22,
      "wealthPerAdultUSD": 19800,
      "medianWealthUSD": 6100,
      "gdpTrillionUSD": 0.089,
      "gdpPerCapitaUSD": 4350,
      "inflationRate": 3.4,
      "debtToGdp": 41,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 37,
        "nonFinancialShare": 68,
        "debtShareOfGross": 5
      }
    },
    "2000": {
      "totalWealthTrillion": 0.26,
      "wealthPerAdultUSD": 20500,
      "medianWealthUSD": 6400,
      "gdpTrillionUSD": 0.094,
      "gdpPerCapitaUSD": 4050,
      "inflationRate": 1.5,
      "debtToGdp": 33,
      "gini": 0.76,
      "assetMix": {
        "financialShare": 38,
        "nonFinancialShare": 67,
        "debtShareOfGross": 5
      }
    },
    "2010": {
      "totalWealthTrillion": 0.52,
      "wealthPerAdultUSD": 30800,
      "medianWealthUSD": 9400,
      "gdpTrillionUSD": 0.26,
      "gdpPerCapitaUSD": 9050,
      "inflationRate": 1.6,
      "debtToGdp": 51.5,
      "gini": 0.78,
      "assetMix": {
        "financialShare": 40,
        "nonFinancialShare": 66,
        "debtShareOfGross": 6
      }
    },
    "2020": {
      "totalWealthTrillion": 0.76,
      "wealthPerAdultUSD": 35800,
      "medianWealthUSD": 10800,
      "gdpTrillionUSD": 0.34,
      "gdpPerCapitaUSD": 10450,
      "inflationRate": -1.1,
      "debtToGdp": 67.8,
      "gini": 0.79,
      "assetMix": {
        "financialShare": 41,
        "nonFinancialShare": 65.5,
        "debtShareOfGross": 6.5
      }
    },
    "2022": {
      "totalWealthTrillion": 0.84,
      "wealthPerAdultUSD": 38200,
      "medianWealthUSD": 11400,
      "gdpTrillionUSD": 0.41,
      "gdpPerCapitaUSD": 12300,
      "inflationRate": 3.4,
      "debtToGdp": 66,
      "gini": 0.79,
      "assetMix": {
        "financialShare": 41.5,
        "nonFinancialShare": 65.2,
        "debtShareOfGross": 6.8
      }
    },
    "2024": {
      "totalWealthTrillion": 0.92,
      "wealthPerAdultUSD": 40400,
      "medianWealthUSD": 12000,
      "gdpTrillionUSD": 0.44,
      "gdpPerCapitaUSD": 13100,
      "inflationRate": 2.1,
      "debtToGdp": 64.8,
      "gini": 0.79,
      "assetMix": {
        "financialShare": 41.8,
        "nonFinancialShare": 65.1,
        "debtShareOfGross": 6.9
      }
    },
    "2025": {
      "totalWealthTrillion": 0.95,
      "wealthPerAdultUSD": 41100,
      "medianWealthUSD": 12200,
      "gdpTrillionUSD": 0.45,
      "gdpPerCapitaUSD": 13350,
      "inflationRate": 2.2,
      "debtToGdp": 64.6,
      "gini": 0.79,
      "assetMix": {
        "financialShare": 41.9,
        "nonFinancialShare": 65,
        "debtShareOfGross": 7
      }
    },
    "2026": {
      "totalWealthTrillion": 0.98,
      "wealthPerAdultUSD": 41800,
      "medianWealthUSD": 12400,
      "gdpTrillionUSD": 0.46,
      "gdpPerCapitaUSD": 13600,
      "inflationRate": 2.2,
      "debtToGdp": 64.5,
      "gini": 0.79,
      "assetMix": {
        "financialShare": 42,
        "nonFinancialShare": 65,
        "debtShareOfGross": 7
      }
    }
  }
},
  {
  "code": "PHL",
  "name": "Philippines",
  "region": "Asia",
  "blocs": [
    "asean"
  ],
  "flag": "🇵🇭",
  "coordinates": [
    121.77,
    12.87
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.05,
      "wealthPerAdultUSD": 2150,
      "medianWealthUSD": 620,
      "gdpTrillionUSD": 0.036,
      "gdpPerCapitaUSD": 740,
      "inflationRate": 18.2,
      "debtToGdp": 49,
      "gini": 0.78,
      "assetMix": {
        "financialShare": 20,
        "nonFinancialShare": 83,
        "debtShareOfGross": 3
      }
    },
    "1990": {
      "totalWealthTrillion": 0.12,
      "wealthPerAdultUSD": 3850,
      "medianWealthUSD": 1100,
      "gdpTrillionUSD": 0.044,
      "gdpPerCapitaUSD": 720,
      "inflationRate": 14.1,
      "debtToGdp": 68,
      "gini": 0.8,
      "assetMix": {
        "financialShare": 22,
        "nonFinancialShare": 81,
        "debtShareOfGross": 3
      }
    },
    "1995": {
      "totalWealthTrillion": 0.22,
      "wealthPerAdultUSD": 5950,
      "medianWealthUSD": 1680,
      "gdpTrillionUSD": 0.074,
      "gdpPerCapitaUSD": 1060,
      "inflationRate": 8.1,
      "debtToGdp": 59,
      "gini": 0.81,
      "assetMix": {
        "financialShare": 23,
        "nonFinancialShare": 80,
        "debtShareOfGross": 3
      }
    },
    "2000": {
      "totalWealthTrillion": 0.28,
      "wealthPerAdultUSD": 6850,
      "medianWealthUSD": 1950,
      "gdpTrillionUSD": 0.081,
      "gdpPerCapitaUSD": 1040,
      "inflationRate": 4.4,
      "debtToGdp": 64.5,
      "gini": 0.81,
      "assetMix": {
        "financialShare": 24,
        "nonFinancialShare": 79.5,
        "debtShareOfGross": 3.5
      }
    },
    "2010": {
      "totalWealthTrillion": 0.52,
      "wealthPerAdultUSD": 9800,
      "medianWealthUSD": 2750,
      "gdpTrillionUSD": 0.2,
      "gdpPerCapitaUSD": 2130,
      "inflationRate": 3.8,
      "debtToGdp": 47,
      "gini": 0.82,
      "assetMix": {
        "financialShare": 25,
        "nonFinancialShare": 78.5,
        "debtShareOfGross": 3.5
      }
    },
    "2020": {
      "totalWealthTrillion": 0.85,
      "wealthPerAdultUSD": 13200,
      "medianWealthUSD": 3650,
      "gdpTrillionUSD": 0.36,
      "gdpPerCapitaUSD": 3300,
      "inflationRate": 2.6,
      "debtToGdp": 54.6,
      "gini": 0.83,
      "assetMix": {
        "financialShare": 25.5,
        "nonFinancialShare": 78.2,
        "debtShareOfGross": 3.8
      }
    },
    "2022": {
      "totalWealthTrillion": 0.98,
      "wealthPerAdultUSD": 14600,
      "medianWealthUSD": 3950,
      "gdpTrillionUSD": 0.4,
      "gdpPerCapitaUSD": 3620,
      "inflationRate": 5.8,
      "debtToGdp": 60.9,
      "gini": 0.83,
      "assetMix": {
        "financialShare": 25.8,
        "nonFinancialShare": 78.1,
        "debtShareOfGross": 3.9
      }
    },
    "2024": {
      "totalWealthTrillion": 1.08,
      "wealthPerAdultUSD": 15600,
      "medianWealthUSD": 4100,
      "gdpTrillionUSD": 0.45,
      "gdpPerCapitaUSD": 3950,
      "inflationRate": 3.5,
      "debtToGdp": 60.6,
      "gini": 0.83,
      "assetMix": {
        "financialShare": 25.9,
        "nonFinancialShare": 78.1,
        "debtShareOfGross": 4
      }
    },
    "2025": {
      "totalWealthTrillion": 1.11,
      "wealthPerAdultUSD": 15900,
      "medianWealthUSD": 4150,
      "gdpTrillionUSD": 0.465,
      "gdpPerCapitaUSD": 4040,
      "inflationRate": 3.6,
      "debtToGdp": 60.5,
      "gini": 0.83,
      "assetMix": {
        "financialShare": 26,
        "nonFinancialShare": 78,
        "debtShareOfGross": 4
      }
    },
    "2026": {
      "totalWealthTrillion": 1.15,
      "wealthPerAdultUSD": 16200,
      "medianWealthUSD": 4200,
      "gdpTrillionUSD": 0.48,
      "gdpPerCapitaUSD": 4120,
      "inflationRate": 3.6,
      "debtToGdp": 60.5,
      "gini": 0.83,
      "assetMix": {
        "financialShare": 26,
        "nonFinancialShare": 78,
        "debtShareOfGross": 4
      }
    }
  }
},
  {
  "code": "NZL",
  "name": "New Zealand",
  "region": "Oceania",
  "blocs": [
    "oceania"
  ],
  "flag": "🇳🇿",
  "coordinates": [
    174.88,
    -40.9
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.1,
      "wealthPerAdultUSD": 48500,
      "medianWealthUSD": 24200,
      "gdpTrillionUSD": 0.022,
      "gdpPerCapitaUSD": 7200,
      "inflationRate": 17.1,
      "debtToGdp": 42,
      "gini": 0.65,
      "assetMix": {
        "financialShare": 38,
        "nonFinancialShare": 70,
        "debtShareOfGross": 8
      }
    },
    "1990": {
      "totalWealthTrillion": 0.24,
      "wealthPerAdultUSD": 104000,
      "medianWealthUSD": 48500,
      "gdpTrillionUSD": 0.046,
      "gdpPerCapitaUSD": 13500,
      "inflationRate": 6.1,
      "debtToGdp": 54,
      "gini": 0.67,
      "assetMix": {
        "financialShare": 40,
        "nonFinancialShare": 68,
        "debtShareOfGross": 8
      }
    },
    "1995": {
      "totalWealthTrillion": 0.38,
      "wealthPerAdultUSD": 154000,
      "medianWealthUSD": 72000,
      "gdpTrillionUSD": 0.062,
      "gdpPerCapitaUSD": 17100,
      "inflationRate": 3.8,
      "debtToGdp": 45,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 42,
        "nonFinancialShare": 67,
        "debtShareOfGross": 9
      }
    },
    "2000": {
      "totalWealthTrillion": 0.52,
      "wealthPerAdultUSD": 198000,
      "medianWealthUSD": 94000,
      "gdpTrillionUSD": 0.054,
      "gdpPerCapitaUSD": 14100,
      "inflationRate": 2.6,
      "debtToGdp": 32,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 43,
        "nonFinancialShare": 66,
        "debtShareOfGross": 9
      }
    },
    "2010": {
      "totalWealthTrillion": 0.98,
      "wealthPerAdultUSD": 312000,
      "medianWealthUSD": 148000,
      "gdpTrillionUSD": 0.14,
      "gdpPerCapitaUSD": 33400,
      "inflationRate": 2.3,
      "debtToGdp": 30.5,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 44,
        "nonFinancialShare": 65.5,
        "debtShareOfGross": 9.5
      }
    },
    "2020": {
      "totalWealthTrillion": 1.48,
      "wealthPerAdultUSD": 425000,
      "medianWealthUSD": 198000,
      "gdpTrillionUSD": 0.21,
      "gdpPerCapitaUSD": 42100,
      "inflationRate": 1.7,
      "debtToGdp": 43,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 44.5,
        "nonFinancialShare": 65.2,
        "debtShareOfGross": 9.8
      }
    },
    "2022": {
      "totalWealthTrillion": 1.65,
      "wealthPerAdultUSD": 445000,
      "medianWealthUSD": 204000,
      "gdpTrillionUSD": 0.24,
      "gdpPerCapitaUSD": 47200,
      "inflationRate": 7.2,
      "debtToGdp": 48,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 44.8,
        "nonFinancialShare": 65.1,
        "debtShareOfGross": 9.9
      }
    },
    "2024": {
      "totalWealthTrillion": 1.75,
      "wealthPerAdultUSD": 458000,
      "medianWealthUSD": 209000,
      "gdpTrillionUSD": 0.25,
      "gdpPerCapitaUSD": 49400,
      "inflationRate": 2.8,
      "debtToGdp": 47.5,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 45,
        "nonFinancialShare": 65,
        "debtShareOfGross": 10
      }
    },
    "2025": {
      "totalWealthTrillion": 1.78,
      "wealthPerAdultUSD": 463000,
      "medianWealthUSD": 210500,
      "gdpTrillionUSD": 0.255,
      "gdpPerCapitaUSD": 49900,
      "inflationRate": 2.6,
      "debtToGdp": 47.2,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 45,
        "nonFinancialShare": 65,
        "debtShareOfGross": 10
      }
    },
    "2026": {
      "totalWealthTrillion": 1.82,
      "wealthPerAdultUSD": 468000,
      "medianWealthUSD": 212000,
      "gdpTrillionUSD": 0.26,
      "gdpPerCapitaUSD": 50400,
      "inflationRate": 2.5,
      "debtToGdp": 47,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 45,
        "nonFinancialShare": 65,
        "debtShareOfGross": 10
      }
    }
  }
},
  {
  "code": "PRT",
  "name": "Portugal",
  "region": "Europe",
  "blocs": [
    "eurozone",
    "eu"
  ],
  "flag": "🇵🇹",
  "coordinates": [
    -8.22,
    39.39
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.12,
      "wealthPerAdultUSD": 16500,
      "medianWealthUSD": 8200,
      "gdpTrillionUSD": 0.033,
      "gdpPerCapitaUSD": 3350,
      "inflationRate": 16.6,
      "debtToGdp": 32,
      "gini": 0.65,
      "assetMix": {
        "financialShare": 32,
        "nonFinancialShare": 74,
        "debtShareOfGross": 6
      }
    },
    "1990": {
      "totalWealthTrillion": 0.35,
      "wealthPerAdultUSD": 44200,
      "medianWealthUSD": 22400,
      "gdpTrillionUSD": 0.079,
      "gdpPerCapitaUSD": 7950,
      "inflationRate": 13.4,
      "debtToGdp": 58,
      "gini": 0.67,
      "assetMix": {
        "financialShare": 34,
        "nonFinancialShare": 72,
        "debtShareOfGross": 6
      }
    },
    "1995": {
      "totalWealthTrillion": 0.55,
      "wealthPerAdultUSD": 68000,
      "medianWealthUSD": 34500,
      "gdpTrillionUSD": 0.12,
      "gdpPerCapitaUSD": 11800,
      "inflationRate": 4.2,
      "debtToGdp": 60,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 35,
        "nonFinancialShare": 71,
        "debtShareOfGross": 6
      }
    },
    "2000": {
      "totalWealthTrillion": 0.78,
      "wealthPerAdultUSD": 94000,
      "medianWealthUSD": 46200,
      "gdpTrillionUSD": 0.11,
      "gdpPerCapitaUSD": 11200,
      "inflationRate": 2.8,
      "debtToGdp": 50,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 36,
        "nonFinancialShare": 71,
        "debtShareOfGross": 7
      }
    },
    "2010": {
      "totalWealthTrillion": 1.15,
      "wealthPerAdultUSD": 136000,
      "medianWealthUSD": 64000,
      "gdpTrillionUSD": 0.24,
      "gdpPerCapitaUSD": 22500,
      "inflationRate": 1.4,
      "debtToGdp": 100,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 36.5,
        "nonFinancialShare": 71,
        "debtShareOfGross": 7.5
      }
    },
    "2020": {
      "totalWealthTrillion": 1.35,
      "wealthPerAdultUSD": 168000,
      "medianWealthUSD": 78000,
      "gdpTrillionUSD": 0.23,
      "gdpPerCapitaUSD": 22400,
      "inflationRate": -0.1,
      "debtToGdp": 135,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 37.5,
        "nonFinancialShare": 70.2,
        "debtShareOfGross": 7.8
      }
    },
    "2022": {
      "totalWealthTrillion": 1.45,
      "wealthPerAdultUSD": 178000,
      "medianWealthUSD": 82000,
      "gdpTrillionUSD": 0.25,
      "gdpPerCapitaUSD": 24500,
      "inflationRate": 8.1,
      "debtToGdp": 112.5,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 37.8,
        "nonFinancialShare": 70.1,
        "debtShareOfGross": 7.9
      }
    },
    "2024": {
      "totalWealthTrillion": 1.55,
      "wealthPerAdultUSD": 189000,
      "medianWealthUSD": 86000,
      "gdpTrillionUSD": 0.28,
      "gdpPerCapitaUSD": 27100,
      "inflationRate": 2.6,
      "debtToGdp": 98,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 38,
        "nonFinancialShare": 70,
        "debtShareOfGross": 8
      }
    },
    "2025": {
      "totalWealthTrillion": 1.58,
      "wealthPerAdultUSD": 192000,
      "medianWealthUSD": 87000,
      "gdpTrillionUSD": 0.285,
      "gdpPerCapitaUSD": 27600,
      "inflationRate": 2.4,
      "debtToGdp": 96.5,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 38,
        "nonFinancialShare": 70,
        "debtShareOfGross": 8
      }
    },
    "2026": {
      "totalWealthTrillion": 1.62,
      "wealthPerAdultUSD": 195000,
      "medianWealthUSD": 88000,
      "gdpTrillionUSD": 0.29,
      "gdpPerCapitaUSD": 28200,
      "inflationRate": 2.3,
      "debtToGdp": 95,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 38,
        "nonFinancialShare": 70,
        "debtShareOfGross": 8
      }
    }
  }
},
  {
  "code": "GRC",
  "name": "Greece",
  "region": "Europe",
  "blocs": [
    "eurozone",
    "eu"
  ],
  "flag": "🇬🇷",
  "coordinates": [
    21.82,
    39.07
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.15,
      "wealthPerAdultUSD": 21500,
      "medianWealthUSD": 11400,
      "gdpTrillionUSD": 0.056,
      "gdpPerCapitaUSD": 5900,
      "inflationRate": 24.9,
      "debtToGdp": 28,
      "gini": 0.64,
      "assetMix": {
        "financialShare": 24,
        "nonFinancialShare": 82,
        "debtShareOfGross": 6
      }
    },
    "1990": {
      "totalWealthTrillion": 0.38,
      "wealthPerAdultUSD": 48500,
      "medianWealthUSD": 25200,
      "gdpTrillionUSD": 0.098,
      "gdpPerCapitaUSD": 9600,
      "inflationRate": 20.4,
      "debtToGdp": 73,
      "gini": 0.66,
      "assetMix": {
        "financialShare": 26,
        "nonFinancialShare": 80,
        "debtShareOfGross": 6
      }
    },
    "1995": {
      "totalWealthTrillion": 0.58,
      "wealthPerAdultUSD": 72000,
      "medianWealthUSD": 36800,
      "gdpTrillionUSD": 0.14,
      "gdpPerCapitaUSD": 13100,
      "inflationRate": 8.9,
      "debtToGdp": 98,
      "gini": 0.67,
      "assetMix": {
        "financialShare": 27,
        "nonFinancialShare": 79,
        "debtShareOfGross": 6
      }
    },
    "2000": {
      "totalWealthTrillion": 0.85,
      "wealthPerAdultUSD": 102000,
      "medianWealthUSD": 52000,
      "gdpTrillionUSD": 0.13,
      "gdpPerCapitaUSD": 12000,
      "inflationRate": 3.2,
      "debtToGdp": 104,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 28,
        "nonFinancialShare": 79,
        "debtShareOfGross": 7
      }
    },
    "2010": {
      "totalWealthTrillion": 1.25,
      "wealthPerAdultUSD": 145000,
      "medianWealthUSD": 74000,
      "gdpTrillionUSD": 0.3,
      "gdpPerCapitaUSD": 26900,
      "inflationRate": 4.7,
      "debtToGdp": 146,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 29,
        "nonFinancialShare": 78.5,
        "debtShareOfGross": 7.5
      }
    },
    "2020": {
      "totalWealthTrillion": 0.98,
      "wealthPerAdultUSD": 118000,
      "medianWealthUSD": 58000,
      "gdpTrillionUSD": 0.19,
      "gdpPerCapitaUSD": 17600,
      "inflationRate": -1.3,
      "debtToGdp": 206,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 29.5,
        "nonFinancialShare": 78.2,
        "debtShareOfGross": 7.8
      }
    },
    "2022": {
      "totalWealthTrillion": 1.05,
      "wealthPerAdultUSD": 128000,
      "medianWealthUSD": 62000,
      "gdpTrillionUSD": 0.22,
      "gdpPerCapitaUSD": 20700,
      "inflationRate": 9.3,
      "debtToGdp": 172,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 29.8,
        "nonFinancialShare": 78.1,
        "debtShareOfGross": 7.9
      }
    },
    "2024": {
      "totalWealthTrillion": 1.13,
      "wealthPerAdultUSD": 137000,
      "medianWealthUSD": 66000,
      "gdpTrillionUSD": 0.24,
      "gdpPerCapitaUSD": 23100,
      "inflationRate": 2.8,
      "debtToGdp": 156,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 30,
        "nonFinancialShare": 78,
        "debtShareOfGross": 8
      }
    },
    "2025": {
      "totalWealthTrillion": 1.15,
      "wealthPerAdultUSD": 140000,
      "medianWealthUSD": 67000,
      "gdpTrillionUSD": 0.245,
      "gdpPerCapitaUSD": 23600,
      "inflationRate": 2.6,
      "debtToGdp": 153.5,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 30,
        "nonFinancialShare": 78,
        "debtShareOfGross": 8
      }
    },
    "2026": {
      "totalWealthTrillion": 1.18,
      "wealthPerAdultUSD": 142000,
      "medianWealthUSD": 68000,
      "gdpTrillionUSD": 0.25,
      "gdpPerCapitaUSD": 24100,
      "inflationRate": 2.5,
      "debtToGdp": 151,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 30,
        "nonFinancialShare": 78,
        "debtShareOfGross": 8
      }
    }
  }
},
  {
  "code": "PER",
  "name": "Peru",
  "region": "Latin America",
  "blocs": [
    "pacific-alliance"
  ],
  "flag": "🇵🇪",
  "coordinates": [
    -75.01,
    -9.19
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.03,
      "wealthPerAdultUSD": 3400,
      "medianWealthUSD": 980,
      "gdpTrillionUSD": 0.021,
      "gdpPerCapitaUSD": 1200,
      "inflationRate": 59.2,
      "debtToGdp": 45,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 22,
        "nonFinancialShare": 81,
        "debtShareOfGross": 3
      }
    },
    "1990": {
      "totalWealthTrillion": 0.06,
      "wealthPerAdultUSD": 5200,
      "medianWealthUSD": 1450,
      "gdpTrillionUSD": 0.026,
      "gdpPerCapitaUSD": 1200,
      "inflationRate": 7481,
      "debtToGdp": 85,
      "gini": 0.76,
      "assetMix": {
        "financialShare": 24,
        "nonFinancialShare": 79,
        "debtShareOfGross": 3
      }
    },
    "1995": {
      "totalWealthTrillion": 0.12,
      "wealthPerAdultUSD": 9200,
      "medianWealthUSD": 2650,
      "gdpTrillionUSD": 0.053,
      "gdpPerCapitaUSD": 2200,
      "inflationRate": 11.1,
      "debtToGdp": 68,
      "gini": 0.76,
      "assetMix": {
        "financialShare": 25,
        "nonFinancialShare": 78,
        "debtShareOfGross": 3
      }
    },
    "2000": {
      "totalWealthTrillion": 0.16,
      "wealthPerAdultUSD": 10800,
      "medianWealthUSD": 3100,
      "gdpTrillionUSD": 0.051,
      "gdpPerCapitaUSD": 1950,
      "inflationRate": 3.8,
      "debtToGdp": 46,
      "gini": 0.77,
      "assetMix": {
        "financialShare": 26,
        "nonFinancialShare": 77.5,
        "debtShareOfGross": 3.5
      }
    },
    "2010": {
      "totalWealthTrillion": 0.32,
      "wealthPerAdultUSD": 17400,
      "medianWealthUSD": 5200,
      "gdpTrillionUSD": 0.14,
      "gdpPerCapitaUSD": 4950,
      "inflationRate": 1.5,
      "debtToGdp": 24,
      "gini": 0.77,
      "assetMix": {
        "financialShare": 27,
        "nonFinancialShare": 76.5,
        "debtShareOfGross": 3.5
      }
    },
    "2020": {
      "totalWealthTrillion": 0.48,
      "wealthPerAdultUSD": 22500,
      "medianWealthUSD": 6900,
      "gdpTrillionUSD": 0.21,
      "gdpPerCapitaUSD": 6350,
      "inflationRate": 1.8,
      "debtToGdp": 34.8,
      "gini": 0.78,
      "assetMix": {
        "financialShare": 27.5,
        "nonFinancialShare": 76.2,
        "debtShareOfGross": 3.8
      }
    },
    "2022": {
      "totalWealthTrillion": 0.54,
      "wealthPerAdultUSD": 24800,
      "medianWealthUSD": 7600,
      "gdpTrillionUSD": 0.24,
      "gdpPerCapitaUSD": 7200,
      "inflationRate": 8.5,
      "debtToGdp": 33.8,
      "gini": 0.78,
      "assetMix": {
        "financialShare": 27.8,
        "nonFinancialShare": 76.1,
        "debtShareOfGross": 3.9
      }
    },
    "2024": {
      "totalWealthTrillion": 0.59,
      "wealthPerAdultUSD": 26500,
      "medianWealthUSD": 8100,
      "gdpTrillionUSD": 0.27,
      "gdpPerCapitaUSD": 7900,
      "inflationRate": 2.6,
      "debtToGdp": 33.6,
      "gini": 0.78,
      "assetMix": {
        "financialShare": 27.9,
        "nonFinancialShare": 76,
        "debtShareOfGross": 4
      }
    },
    "2025": {
      "totalWealthTrillion": 0.6,
      "wealthPerAdultUSD": 27000,
      "medianWealthUSD": 8250,
      "gdpTrillionUSD": 0.275,
      "gdpPerCapitaUSD": 8050,
      "inflationRate": 2.5,
      "debtToGdp": 33.5,
      "gini": 0.78,
      "assetMix": {
        "financialShare": 28,
        "nonFinancialShare": 76,
        "debtShareOfGross": 4
      }
    },
    "2026": {
      "totalWealthTrillion": 0.62,
      "wealthPerAdultUSD": 27500,
      "medianWealthUSD": 8400,
      "gdpTrillionUSD": 0.28,
      "gdpPerCapitaUSD": 8200,
      "inflationRate": 2.4,
      "debtToGdp": 33.5,
      "gini": 0.78,
      "assetMix": {
        "financialShare": 28,
        "nonFinancialShare": 76,
        "debtShareOfGross": 4
      }
    }
  }
},
  {
  "code": "CZE",
  "name": "Czech Republic",
  "region": "Europe",
  "blocs": [
    "eu"
  ],
  "flag": "🇨🇿",
  "coordinates": [
    15.47,
    49.81
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.12,
      "wealthPerAdultUSD": 16200,
      "medianWealthUSD": 6400,
      "gdpTrillionUSD": 0.045,
      "gdpPerCapitaUSD": 4400,
      "inflationRate": 8.5,
      "debtToGdp": 20,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 36,
        "nonFinancialShare": 70,
        "debtShareOfGross": 6
      }
    },
    "1990": {
      "totalWealthTrillion": 0.24,
      "wealthPerAdultUSD": 30500,
      "medianWealthUSD": 12200,
      "gdpTrillionUSD": 0.049,
      "gdpPerCapitaUSD": 4750,
      "inflationRate": 9.7,
      "debtToGdp": 15,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 38,
        "nonFinancialShare": 68,
        "debtShareOfGross": 6
      }
    },
    "1995": {
      "totalWealthTrillion": 0.38,
      "wealthPerAdultUSD": 46200,
      "medianWealthUSD": 18500,
      "gdpTrillionUSD": 0.06,
      "gdpPerCapitaUSD": 5800,
      "inflationRate": 9.1,
      "debtToGdp": 14,
      "gini": 0.72,
      "assetMix": {
        "financialShare": 40,
        "nonFinancialShare": 66,
        "debtShareOfGross": 6
      }
    },
    "2000": {
      "totalWealthTrillion": 0.48,
      "wealthPerAdultUSD": 58400,
      "medianWealthUSD": 23200,
      "gdpTrillionUSD": 0.062,
      "gdpPerCapitaUSD": 6050,
      "inflationRate": 3.9,
      "debtToGdp": 17.5,
      "gini": 0.73,
      "assetMix": {
        "financialShare": 41,
        "nonFinancialShare": 66,
        "debtShareOfGross": 7
      }
    },
    "2010": {
      "totalWealthTrillion": 0.82,
      "wealthPerAdultUSD": 96000,
      "medianWealthUSD": 38500,
      "gdpTrillionUSD": 0.21,
      "gdpPerCapitaUSD": 19800,
      "inflationRate": 1.5,
      "debtToGdp": 37.5,
      "gini": 0.74,
      "assetMix": {
        "financialShare": 42,
        "nonFinancialShare": 65,
        "debtShareOfGross": 7.5
      }
    },
    "2020": {
      "totalWealthTrillion": 1.05,
      "wealthPerAdultUSD": 124000,
      "medianWealthUSD": 49500,
      "gdpTrillionUSD": 0.25,
      "gdpPerCapitaUSD": 23100,
      "inflationRate": 3.2,
      "debtToGdp": 37.8,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 43,
        "nonFinancialShare": 64.5,
        "debtShareOfGross": 7.8
      }
    },
    "2022": {
      "totalWealthTrillion": 1.12,
      "wealthPerAdultUSD": 132000,
      "medianWealthUSD": 53000,
      "gdpTrillionUSD": 0.29,
      "gdpPerCapitaUSD": 27500,
      "inflationRate": 15.1,
      "debtToGdp": 44.2,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 43.5,
        "nonFinancialShare": 64.2,
        "debtShareOfGross": 7.9
      }
    },
    "2024": {
      "totalWealthTrillion": 1.2,
      "wealthPerAdultUSD": 141000,
      "medianWealthUSD": 56500,
      "gdpTrillionUSD": 0.33,
      "gdpPerCapitaUSD": 30800,
      "inflationRate": 2.7,
      "debtToGdp": 44.6,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 43.8,
        "nonFinancialShare": 64.1,
        "debtShareOfGross": 8
      }
    },
    "2025": {
      "totalWealthTrillion": 1.22,
      "wealthPerAdultUSD": 143000,
      "medianWealthUSD": 57200,
      "gdpTrillionUSD": 0.335,
      "gdpPerCapitaUSD": 31300,
      "inflationRate": 2.6,
      "debtToGdp": 44.5,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 43.9,
        "nonFinancialShare": 64,
        "debtShareOfGross": 8
      }
    },
    "2026": {
      "totalWealthTrillion": 1.24,
      "wealthPerAdultUSD": 145000,
      "medianWealthUSD": 58000,
      "gdpTrillionUSD": 0.34,
      "gdpPerCapitaUSD": 31800,
      "inflationRate": 2.6,
      "debtToGdp": 44.5,
      "gini": 0.75,
      "assetMix": {
        "financialShare": 44,
        "nonFinancialShare": 64,
        "debtShareOfGross": 8
      }
    }
  }
},
  {
  "code": "FIN",
  "name": "Finland",
  "region": "Europe",
  "blocs": [
    "eurozone",
    "nordic",
    "eu"
  ],
  "flag": "🇫🇮",
  "coordinates": [
    25.74,
    61.92
  ],
  "history": {
    "1980": {
      "totalWealthTrillion": 0.11,
      "wealthPerAdultUSD": 28500,
      "medianWealthUSD": 12400,
      "gdpTrillionUSD": 0.054,
      "gdpPerCapitaUSD": 11200,
      "inflationRate": 11.6,
      "debtToGdp": 11.5,
      "gini": 0.65,
      "assetMix": {
        "financialShare": 42,
        "nonFinancialShare": 66,
        "debtShareOfGross": 8
      }
    },
    "1990": {
      "totalWealthTrillion": 0.28,
      "wealthPerAdultUSD": 72000,
      "medianWealthUSD": 31500,
      "gdpTrillionUSD": 0.14,
      "gdpPerCapitaUSD": 28200,
      "inflationRate": 6.1,
      "debtToGdp": 14.5,
      "gini": 0.67,
      "assetMix": {
        "financialShare": 45,
        "nonFinancialShare": 63,
        "debtShareOfGross": 8
      }
    },
    "1995": {
      "totalWealthTrillion": 0.35,
      "wealthPerAdultUSD": 88500,
      "medianWealthUSD": 38200,
      "gdpTrillionUSD": 0.13,
      "gdpPerCapitaUSD": 25400,
      "inflationRate": 1,
      "debtToGdp": 56,
      "gini": 0.68,
      "assetMix": {
        "financialShare": 47,
        "nonFinancialShare": 61,
        "debtShareOfGross": 9
      }
    },
    "2000": {
      "totalWealthTrillion": 0.52,
      "wealthPerAdultUSD": 128000,
      "medianWealthUSD": 54500,
      "gdpTrillionUSD": 0.13,
      "gdpPerCapitaUSD": 24100,
      "inflationRate": 3.4,
      "debtToGdp": 42.5,
      "gini": 0.69,
      "assetMix": {
        "financialShare": 49,
        "nonFinancialShare": 59,
        "debtShareOfGross": 9
      }
    },
    "2010": {
      "totalWealthTrillion": 0.78,
      "wealthPerAdultUSD": 182000,
      "medianWealthUSD": 78000,
      "gdpTrillionUSD": 0.25,
      "gdpPerCapitaUSD": 46200,
      "inflationRate": 1.2,
      "debtToGdp": 48,
      "gini": 0.7,
      "assetMix": {
        "financialShare": 50,
        "nonFinancialShare": 59,
        "debtShareOfGross": 9.5
      }
    },
    "2020": {
      "totalWealthTrillion": 0.96,
      "wealthPerAdultUSD": 221000,
      "medianWealthUSD": 94000,
      "gdpTrillionUSD": 0.27,
      "gdpPerCapitaUSD": 49200,
      "inflationRate": 0.3,
      "debtToGdp": 74.5,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 51,
        "nonFinancialShare": 58.5,
        "debtShareOfGross": 9.8
      }
    },
    "2022": {
      "totalWealthTrillion": 1.02,
      "wealthPerAdultUSD": 232000,
      "medianWealthUSD": 99000,
      "gdpTrillionUSD": 0.28,
      "gdpPerCapitaUSD": 51200,
      "inflationRate": 7.1,
      "debtToGdp": 73.5,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 51.5,
        "nonFinancialShare": 58.2,
        "debtShareOfGross": 9.9
      }
    },
    "2024": {
      "totalWealthTrillion": 1.06,
      "wealthPerAdultUSD": 241000,
      "medianWealthUSD": 102500,
      "gdpTrillionUSD": 0.3,
      "gdpPerCapitaUSD": 54200,
      "inflationRate": 2,
      "debtToGdp": 77.5,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 51.8,
        "nonFinancialShare": 58.1,
        "debtShareOfGross": 10
      }
    },
    "2025": {
      "totalWealthTrillion": 1.07,
      "wealthPerAdultUSD": 243000,
      "medianWealthUSD": 103200,
      "gdpTrillionUSD": 0.305,
      "gdpPerCapitaUSD": 54800,
      "inflationRate": 1.9,
      "debtToGdp": 78,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 51.9,
        "nonFinancialShare": 58,
        "debtShareOfGross": 10
      }
    },
    "2026": {
      "totalWealthTrillion": 1.08,
      "wealthPerAdultUSD": 245000,
      "medianWealthUSD": 104000,
      "gdpTrillionUSD": 0.31,
      "gdpPerCapitaUSD": 55400,
      "inflationRate": 1.8,
      "debtToGdp": 78.5,
      "gini": 0.71,
      "assetMix": {
        "financialShare": 52,
        "nonFinancialShare": 58,
        "debtShareOfGross": 10
      }
    }
  }
}
];

/*
 * Economic blocs aggregate member states to highlight macroscopic
 * power shifts between traditional coalitions (e.g. G7) and emerging blocs (e.g. BRICS+).
 */
export const ECONOMIC_BLOCS: EconomicBloc[] = [
  {
    "id": "g7",
    "name": "G7 (Group of Seven)",
    "description": "Advanced democratic industrial economies: USA, Germany, Japan, UK, France, Italy, Canada.",
    "memberCodes": [
      "USA",
      "DEU",
      "JPN",
      "GBR",
      "FRA",
      "ITA",
      "CAN"
    ],
    "color": "#06b6d4",
    "history": {
      "1980": {
        "totalWealthTrillion": 26.6,
        "wealthPerAdultUSD": 54000,
        "medianWealthUSD": 22200,
        "gdpTrillionUSD": 7.28,
        "gdpPerCapitaUSD": 11100,
        "populationMillion": 666,
        "globalWealthShare": 77.2,
        "globalGdpShare": 65
      },
      "1990": {
        "totalWealthTrillion": 56.8,
        "wealthPerAdultUSD": 103000,
        "medianWealthUSD": 41800,
        "gdpTrillionUSD": 15.98,
        "gdpPerCapitaUSD": 22600,
        "populationMillion": 722,
        "globalWealthShare": 83.2,
        "globalGdpShare": 68.2
      },
      "1995": {
        "totalWealthTrillion": 73.8,
        "wealthPerAdultUSD": 130000,
        "medianWealthUSD": 50100,
        "gdpTrillionUSD": 20.99,
        "gdpPerCapitaUSD": 28000,
        "populationMillion": 757,
        "globalWealthShare": 82.5,
        "globalGdpShare": 67.7
      },
      "2000": {
        "totalWealthTrillion": 92.1,
        "wealthPerAdultUSD": 169000,
        "medianWealthUSD": 55800,
        "gdpTrillionUSD": 22.94,
        "gdpPerCapitaUSD": 30400,
        "populationMillion": 787,
        "globalWealthShare": 78.1,
        "globalGdpShare": 68.3
      },
      "2010": {
        "totalWealthTrillion": 141.7,
        "wealthPerAdultUSD": 234000,
        "medianWealthUSD": 74800,
        "gdpTrillionUSD": 34.63,
        "gdpPerCapitaUSD": 41300,
        "populationMillion": 814,
        "globalWealthShare": 65.2,
        "globalGdpShare": 52.5
      },
      "2020": {
        "totalWealthTrillion": 237.9,
        "wealthPerAdultUSD": 366000,
        "medianWealthUSD": 95400,
        "gdpTrillionUSD": 40.49,
        "gdpPerCapitaUSD": 47900,
        "populationMillion": 834,
        "globalWealthShare": 56.9,
        "globalGdpShare": 47.6
      },
      "2022": {
        "totalWealthTrillion": 250,
        "wealthPerAdultUSD": 381000,
        "medianWealthUSD": 105100,
        "gdpTrillionUSD": 45.87,
        "gdpPerCapitaUSD": 54100,
        "populationMillion": 839,
        "globalWealthShare": 55,
        "globalGdpShare": 45.6
      },
      "2024": {
        "totalWealthTrillion": 270.8,
        "wealthPerAdultUSD": 410000,
        "medianWealthUSD": 114000,
        "gdpTrillionUSD": 49.5,
        "gdpPerCapitaUSD": 58200,
        "populationMillion": 843,
        "globalWealthShare": 54.1,
        "globalGdpShare": 44.4
      },
      "2025": {
        "totalWealthTrillion": 281.1,
        "wealthPerAdultUSD": 423000,
        "medianWealthUSD": 116800,
        "gdpTrillionUSD": 51.49,
        "gdpPerCapitaUSD": 60400,
        "populationMillion": 844,
        "globalWealthShare": 53.9,
        "globalGdpShare": 44
      },
      "2026": {
        "totalWealthTrillion": 292,
        "wealthPerAdultUSD": 437000,
        "medianWealthUSD": 120900,
        "gdpTrillionUSD": 53.74,
        "gdpPerCapitaUSD": 62900,
        "populationMillion": 847,
        "globalWealthShare": 53.5,
        "globalGdpShare": 43.9
      }
    }
  },
  {
    "id": "brics",
    "name": "BRICS+ Coalition",
    "description": "Major emerging economies: China, India, Brazil, Russia, South Africa, Saudi Arabia, UAE, Egypt.",
    "memberCodes": [
      "BRA",
      "RUS",
      "IND",
      "CHN",
      "ZAF",
      "SAU",
      "ARE",
      "EGY"
    ],
    "color": "#f59e0b",
    "history": {
      "1980": {
        "totalWealthTrillion": 3.2,
        "wealthPerAdultUSD": 1750,
        "medianWealthUSD": 680,
        "gdpTrillionUSD": 1.55,
        "gdpPerCapitaUSD": 680,
        "populationMillion": 2280,
        "globalWealthShare": 9.3,
        "globalGdpShare": 13.8
      },
      "1990": {
        "totalWealthTrillion": 6.8,
        "wealthPerAdultUSD": 2950,
        "medianWealthUSD": 1120,
        "gdpTrillionUSD": 2.38,
        "gdpPerCapitaUSD": 910,
        "populationMillion": 2620,
        "globalWealthShare": 10,
        "globalGdpShare": 10.2
      },
      "1995": {
        "totalWealthTrillion": 10.1,
        "wealthPerAdultUSD": 4050,
        "medianWealthUSD": 1480,
        "gdpTrillionUSD": 3.25,
        "gdpPerCapitaUSD": 1170,
        "populationMillion": 2780,
        "globalWealthShare": 11.3,
        "globalGdpShare": 10.5
      },
      "2000": {
        "totalWealthTrillion": 16.5,
        "wealthPerAdultUSD": 6150,
        "medianWealthUSD": 2150,
        "gdpTrillionUSD": 3.95,
        "gdpPerCapitaUSD": 1340,
        "populationMillion": 2940,
        "globalWealthShare": 14,
        "globalGdpShare": 11.8
      },
      "2010": {
        "totalWealthTrillion": 52.8,
        "wealthPerAdultUSD": 17200,
        "medianWealthUSD": 5800,
        "gdpTrillionUSD": 13.2,
        "gdpPerCapitaUSD": 4080,
        "populationMillion": 3230,
        "globalWealthShare": 24.3,
        "globalGdpShare": 20
      },
      "2020": {
        "totalWealthTrillion": 112.5,
        "wealthPerAdultUSD": 32400,
        "medianWealthUSD": 11800,
        "gdpTrillionUSD": 21.8,
        "gdpPerCapitaUSD": 6280,
        "populationMillion": 3470,
        "globalWealthShare": 26.9,
        "globalGdpShare": 25.6
      },
      "2022": {
        "totalWealthTrillion": 124.8,
        "wealthPerAdultUSD": 35100,
        "medianWealthUSD": 13200,
        "gdpTrillionUSD": 27.2,
        "gdpPerCapitaUSD": 7720,
        "populationMillion": 3520,
        "globalWealthShare": 27.5,
        "globalGdpShare": 27
      },
      "2024": {
        "totalWealthTrillion": 136.2,
        "wealthPerAdultUSD": 37800,
        "medianWealthUSD": 14400,
        "gdpTrillionUSD": 29.5,
        "gdpPerCapitaUSD": 8300,
        "populationMillion": 3550,
        "globalWealthShare": 27.2,
        "globalGdpShare": 26.4
      },
      "2025": {
        "totalWealthTrillion": 142.5,
        "wealthPerAdultUSD": 39200,
        "medianWealthUSD": 15100,
        "gdpTrillionUSD": 31,
        "gdpPerCapitaUSD": 8680,
        "populationMillion": 3570,
        "globalWealthShare": 27.3,
        "globalGdpShare": 26.5
      },
      "2026": {
        "totalWealthTrillion": 149.8,
        "wealthPerAdultUSD": 40900,
        "medianWealthUSD": 15900,
        "gdpTrillionUSD": 32.7,
        "gdpPerCapitaUSD": 9100,
        "populationMillion": 3590,
        "globalWealthShare": 27.4,
        "globalGdpShare": 26.7
      }
    }
  },
  {
    "id": "eurozone",
    "name": "Eurozone (19+ Nations)",
    "description": "European Monetary Union members sharing the single currency (EUR): Germany, France, Italy, Spain, Netherlands, and partners.",
    "memberCodes": [
      "DEU",
      "FRA",
      "ITA",
      "ESP",
      "NLD"
    ],
    "color": "#6366f1",
    "history": {
      "1980": {
        "totalWealthTrillion": 8.85,
        "wealthPerAdultUSD": 34200,
        "medianWealthUSD": 16500,
        "gdpTrillionUSD": 3,
        "gdpPerCapitaUSD": 8750,
        "populationMillion": 343,
        "globalWealthShare": 25.7,
        "globalGdpShare": 26.8
      },
      "1990": {
        "totalWealthTrillion": 18.4,
        "wealthPerAdultUSD": 63500,
        "medianWealthUSD": 31200,
        "gdpTrillionUSD": 6.83,
        "gdpPerCapitaUSD": 18800,
        "populationMillion": 363,
        "globalWealthShare": 26.9,
        "globalGdpShare": 29.2
      },
      "1995": {
        "totalWealthTrillion": 23.6,
        "wealthPerAdultUSD": 79200,
        "medianWealthUSD": 39500,
        "gdpTrillionUSD": 8.45,
        "gdpPerCapitaUSD": 22800,
        "populationMillion": 371,
        "globalWealthShare": 26.3,
        "globalGdpShare": 27.3
      },
      "2000": {
        "totalWealthTrillion": 30.1,
        "wealthPerAdultUSD": 98500,
        "medianWealthUSD": 48600,
        "gdpTrillionUSD": 8.65,
        "gdpPerCapitaUSD": 23100,
        "populationMillion": 375,
        "globalWealthShare": 25.5,
        "globalGdpShare": 25.7
      },
      "2010": {
        "totalWealthTrillion": 55.7,
        "wealthPerAdultUSD": 168000,
        "medianWealthUSD": 82500,
        "gdpTrillionUSD": 16.98,
        "gdpPerCapitaUSD": 43200,
        "populationMillion": 393,
        "globalWealthShare": 25.6,
        "globalGdpShare": 25.7
      },
      "2020": {
        "totalWealthTrillion": 71.6,
        "wealthPerAdultUSD": 208000,
        "medianWealthUSD": 96500,
        "gdpTrillionUSD": 17.08,
        "gdpPerCapitaUSD": 42100,
        "populationMillion": 405,
        "globalWealthShare": 17.1,
        "globalGdpShare": 20.1
      },
      "2022": {
        "totalWealthTrillion": 76,
        "wealthPerAdultUSD": 219000,
        "medianWealthUSD": 101400,
        "gdpTrillionUSD": 18.6,
        "gdpPerCapitaUSD": 45600,
        "populationMillion": 408,
        "globalWealthShare": 16.7,
        "globalGdpShare": 18.5
      },
      "2024": {
        "totalWealthTrillion": 81.6,
        "wealthPerAdultUSD": 232000,
        "medianWealthUSD": 107200,
        "gdpTrillionUSD": 20.35,
        "gdpPerCapitaUSD": 49600,
        "populationMillion": 410,
        "globalWealthShare": 16.3,
        "globalGdpShare": 18.2
      },
      "2025": {
        "totalWealthTrillion": 84.2,
        "wealthPerAdultUSD": 238000,
        "medianWealthUSD": 109800,
        "gdpTrillionUSD": 20.88,
        "gdpPerCapitaUSD": 50800,
        "populationMillion": 411,
        "globalWealthShare": 16.1,
        "globalGdpShare": 17.8
      },
      "2026": {
        "totalWealthTrillion": 87.1,
        "wealthPerAdultUSD": 245500,
        "medianWealthUSD": 113200,
        "gdpTrillionUSD": 21.61,
        "gdpPerCapitaUSD": 52400,
        "populationMillion": 412,
        "globalWealthShare": 16,
        "globalGdpShare": 17.6
      }
    }
  }
];
