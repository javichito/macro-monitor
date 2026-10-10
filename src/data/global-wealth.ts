import { GlobalWealthYear } from '../lib/types';

/*
 * Curated from benchmark datasets of UBS/Credit Suisse Global Wealth Reports
 * and World Inequality Database (WID.world) 1980-2026.
 * Features 6-tier distribution including $1M-$10M HNW, $10M-$100M VHNW,
 * and the > $100M Centi-Millionaires and Billionaires apex group.
 */
export const GLOBAL_WEALTH_HISTORY: GlobalWealthYear[] = [
  {
    "year": 1980,
    "totalWealthTrillion": 34.5,
    "adultPopulationBillions": 2.8,
    "meanWealthPerAdult": 12320,
    "medianWealthPerAdult": 750,
    "giniCoefficient": 0.912,
    "shares": {
      "top1Percent": 51.5,
      "top10Percent": 87.2,
      "middle40Percent": 11.9,
      "bottom50Percent": 0.9
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2464,
        "adultsShare": 88,
        "wealthTrillion": 1.4,
        "wealthShare": 4.1
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 275,
        "adultsShare": 9.8,
        "wealthTrillion": 5.2,
        "wealthShare": 15.1
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 56,
        "adultsShare": 2,
        "wealthTrillion": 14.5,
        "wealthShare": 42
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 4.597,
        "adultsShare": 0.16,
        "wealthTrillion": 8.6,
        "wealthShare": 24.9
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 0.4,
        "adultsShare": 0.01,
        "wealthTrillion": 3,
        "wealthShare": 8.7
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.003,
        "adultsShare": 0.0001,
        "wealthTrillion": 1.8,
        "wealthShare": 5.2
      }
    ]
  },
  {
    "year": 1990,
    "totalWealthTrillion": 68.2,
    "adultPopulationBillions": 3.15,
    "meanWealthPerAdult": 21650,
    "medianWealthPerAdult": 1350,
    "giniCoefficient": 0.908,
    "shares": {
      "top1Percent": 50.2,
      "top10Percent": 86.8,
      "middle40Percent": 12.2,
      "bottom50Percent": 1
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2646,
        "adultsShare": 84,
        "wealthTrillion": 2.5,
        "wealthShare": 3.7
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 378,
        "adultsShare": 12,
        "wealthTrillion": 9.8,
        "wealthShare": 14.4
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 116,
        "adultsShare": 3.7,
        "wealthTrillion": 28.5,
        "wealthShare": 41.8
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 9.194,
        "adultsShare": 0.29,
        "wealthTrillion": 17.4,
        "wealthShare": 25.5
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 0.8,
        "adultsShare": 0.03,
        "wealthTrillion": 6.1,
        "wealthShare": 8.9
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.006,
        "adultsShare": 0.0002,
        "wealthTrillion": 3.9,
        "wealthShare": 5.7
      }
    ]
  },
  {
    "year": 1995,
    "totalWealthTrillion": 89.4,
    "adultPopulationBillions": 3.38,
    "meanWealthPerAdult": 26450,
    "medianWealthPerAdult": 1720,
    "giniCoefficient": 0.906,
    "shares": {
      "top1Percent": 49.8,
      "top10Percent": 86.4,
      "middle40Percent": 12.5,
      "bottom50Percent": 1.1
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2771,
        "adultsShare": 82,
        "wealthTrillion": 3,
        "wealthShare": 3.4
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 440,
        "adultsShare": 13,
        "wealthTrillion": 12,
        "wealthShare": 13.4
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 155,
        "adultsShare": 4.6,
        "wealthTrillion": 37.5,
        "wealthShare": 41.9
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 12.873,
        "adultsShare": 0.38,
        "wealthTrillion": 23.3,
        "wealthShare": 26.1
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 1.119,
        "adultsShare": 0.03,
        "wealthTrillion": 8.2,
        "wealthShare": 9.2
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.008,
        "adultsShare": 0.0002,
        "wealthTrillion": 5.4,
        "wealthShare": 6
      }
    ]
  },
  {
    "year": 2000,
    "totalWealthTrillion": 117.9,
    "adultPopulationBillions": 3.61,
    "meanWealthPerAdult": 32660,
    "medianWealthPerAdult": 2150,
    "giniCoefficient": 0.905,
    "shares": {
      "top1Percent": 49.3,
      "top10Percent": 86.1,
      "middle40Percent": 12.8,
      "bottom50Percent": 1.1
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2890,
        "adultsShare": 80.1,
        "wealthTrillion": 3.7,
        "wealthShare": 3.1
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 512,
        "adultsShare": 14.2,
        "wealthTrillion": 15.3,
        "wealthShare": 13
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 194,
        "adultsShare": 5.3,
        "wealthTrillion": 49.5,
        "wealthShare": 42
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 12.731,
        "adultsShare": 0.35,
        "wealthTrillion": 31,
        "wealthShare": 26.3
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 1.259,
        "adultsShare": 0.03,
        "wealthTrillion": 10.6,
        "wealthShare": 9
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.01,
        "adultsShare": 0.0003,
        "wealthTrillion": 7.8,
        "wealthShare": 6.6
      }
    ]
  },
  {
    "year": 2005,
    "totalWealthTrillion": 168.4,
    "adultPopulationBillions": 3.99,
    "meanWealthPerAdult": 42200,
    "medianWealthPerAdult": 3200,
    "giniCoefficient": 0.898,
    "shares": {
      "top1Percent": 47.9,
      "top10Percent": 85,
      "middle40Percent": 13.8,
      "bottom50Percent": 1.2
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2950,
        "adultsShare": 73.9,
        "wealthTrillion": 5.5,
        "wealthShare": 3.3
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 742,
        "adultsShare": 18.6,
        "wealthTrillion": 23.4,
        "wealthShare": 13.9
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 275,
        "adultsShare": 6.9,
        "wealthTrillion": 68.7,
        "wealthShare": 40.8
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 20.918,
        "adultsShare": 0.52,
        "wealthTrillion": 44.2,
        "wealthShare": 26.2
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 2.069,
        "adultsShare": 0.05,
        "wealthTrillion": 15.1,
        "wealthShare": 9
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.013,
        "adultsShare": 0.0003,
        "wealthTrillion": 11.5,
        "wealthShare": 6.8
      }
    ]
  },
  {
    "year": 2010,
    "totalWealthTrillion": 217.2,
    "adultPopulationBillions": 4.41,
    "meanWealthPerAdult": 49250,
    "medianWealthPerAdult": 4150,
    "giniCoefficient": 0.887,
    "shares": {
      "top1Percent": 45.8,
      "top10Percent": 84.1,
      "middle40Percent": 14.5,
      "bottom50Percent": 1.4
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 3043,
        "adultsShare": 69,
        "wealthTrillion": 7.6,
        "wealthShare": 3.5
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 979,
        "adultsShare": 22.2,
        "wealthTrillion": 30.8,
        "wealthShare": 14.2
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 362,
        "adultsShare": 8.2,
        "wealthTrillion": 91.2,
        "wealthShare": 42
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 23.646,
        "adultsShare": 0.54,
        "wealthTrillion": 54.2,
        "wealthShare": 25
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 2.339,
        "adultsShare": 0.05,
        "wealthTrillion": 18.6,
        "wealthShare": 8.5
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.015,
        "adultsShare": 0.0003,
        "wealthTrillion": 14.8,
        "wealthShare": 6.8
      }
    ]
  },
  {
    "year": 2015,
    "totalWealthTrillion": 260.1,
    "adultPopulationBillions": 4.8,
    "meanWealthPerAdult": 54190,
    "medianWealthPerAdult": 5200,
    "giniCoefficient": 0.889,
    "shares": {
      "top1Percent": 47.1,
      "top10Percent": 84.6,
      "middle40Percent": 14,
      "bottom50Percent": 1.4
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 3120,
        "adultsShare": 65,
        "wealthTrillion": 8.8,
        "wealthShare": 3.4
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 1248,
        "adultsShare": 26,
        "wealthTrillion": 38.5,
        "wealthShare": 14.8
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 398,
        "adultsShare": 8.3,
        "wealthTrillion": 105.3,
        "wealthShare": 40.5
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 30.923,
        "adultsShare": 0.64,
        "wealthTrillion": 66.3,
        "wealthShare": 25.5
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 3.058,
        "adultsShare": 0.06,
        "wealthTrillion": 22.7,
        "wealthShare": 8.7
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.019,
        "adultsShare": 0.0004,
        "wealthTrillion": 18.5,
        "wealthShare": 7.1
      }
    ]
  },
  {
    "year": 2020,
    "totalWealthTrillion": 418.3,
    "adultPopulationBillions": 5.21,
    "meanWealthPerAdult": 80290,
    "medianWealthPerAdult": 7520,
    "giniCoefficient": 0.884,
    "shares": {
      "top1Percent": 45.8,
      "top10Percent": 84,
      "middle40Percent": 14.7,
      "bottom50Percent": 1.3
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2886,
        "adultsShare": 55.4,
        "wealthTrillion": 5.5,
        "wealthShare": 1.3
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 1714,
        "adultsShare": 32.9,
        "wealthTrillion": 57.3,
        "wealthShare": 13.7
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 552,
        "adultsShare": 10.6,
        "wealthTrillion": 163.9,
        "wealthShare": 39.2
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 52.758,
        "adultsShare": 1.01,
        "wealthTrillion": 118.5,
        "wealthShare": 28.3
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 5.218,
        "adultsShare": 0.1,
        "wealthTrillion": 40.6,
        "wealthShare": 9.7
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.024,
        "adultsShare": 0.0005,
        "wealthTrillion": 32.5,
        "wealthShare": 7.8
      }
    ]
  },
  {
    "year": 2021,
    "totalWealthTrillion": 463.6,
    "adultPopulationBillions": 5.3,
    "meanWealthPerAdult": 87470,
    "medianWealthPerAdult": 8350,
    "giniCoefficient": 0.881,
    "shares": {
      "top1Percent": 45.6,
      "top10Percent": 83.8,
      "middle40Percent": 14.9,
      "bottom50Percent": 1.3
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2809,
        "adultsShare": 53,
        "wealthTrillion": 5.8,
        "wealthShare": 1.2
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 1791,
        "adultsShare": 33.8,
        "wealthTrillion": 62.1,
        "wealthShare": 13.4
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 637,
        "adultsShare": 12,
        "wealthTrillion": 173.4,
        "wealthShare": 37.4
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 57.306,
        "adultsShare": 1.08,
        "wealthTrillion": 137.3,
        "wealthShare": 29.7
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 5.668,
        "adultsShare": 0.11,
        "wealthTrillion": 47,
        "wealthShare": 10.1
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.026,
        "adultsShare": 0.0005,
        "wealthTrillion": 38,
        "wealthShare": 8.2
      }
    ]
  },
  {
    "year": 2022,
    "totalWealthTrillion": 454.4,
    "adultPopulationBillions": 5.35,
    "meanWealthPerAdult": 84930,
    "medianWealthPerAdult": 8650,
    "giniCoefficient": 0.875,
    "shares": {
      "top1Percent": 44.5,
      "top10Percent": 83.1,
      "middle40Percent": 15.5,
      "bottom50Percent": 1.4
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2808,
        "adultsShare": 52.5,
        "wealthTrillion": 5.9,
        "wealthShare": 1.3
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 1840,
        "adultsShare": 34.4,
        "wealthTrillion": 63.6,
        "wealthShare": 14
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 642,
        "adultsShare": 12,
        "wealthTrillion": 177.2,
        "wealthShare": 39
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 54.577,
        "adultsShare": 1.02,
        "wealthTrillion": 128.7,
        "wealthShare": 28.3
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 5.398,
        "adultsShare": 0.1,
        "wealthTrillion": 44,
        "wealthShare": 9.7
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.025,
        "adultsShare": 0.0005,
        "wealthTrillion": 35,
        "wealthShare": 7.7
      }
    ]
  },
  {
    "year": 2023,
    "totalWealthTrillion": 477,
    "adultPopulationBillions": 5.41,
    "meanWealthPerAdult": 88170,
    "medianWealthPerAdult": 8980,
    "giniCoefficient": 0.876,
    "shares": {
      "top1Percent": 45,
      "top10Percent": 83.4,
      "middle40Percent": 15.2,
      "bottom50Percent": 1.4
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2786,
        "adultsShare": 51.5,
        "wealthTrillion": 6.2,
        "wealthShare": 1.3
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 1883,
        "adultsShare": 34.8,
        "wealthTrillion": 66.8,
        "wealthShare": 14
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 676,
        "adultsShare": 12.5,
        "wealthTrillion": 186,
        "wealthShare": 39
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 59.125,
        "adultsShare": 1.09,
        "wealthTrillion": 134.8,
        "wealthShare": 28.2
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 5.848,
        "adultsShare": 0.11,
        "wealthTrillion": 46.2,
        "wealthShare": 9.7
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.027,
        "adultsShare": 0.0005,
        "wealthTrillion": 37,
        "wealthShare": 7.8
      }
    ]
  },
  {
    "year": 2024,
    "totalWealthTrillion": 498.2,
    "adultPopulationBillions": 5.46,
    "meanWealthPerAdult": 91240,
    "medianWealthPerAdult": 9210,
    "giniCoefficient": 0.877,
    "shares": {
      "top1Percent": 45.2,
      "top10Percent": 83.6,
      "middle40Percent": 15,
      "bottom50Percent": 1.4
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2757,
        "adultsShare": 50.5,
        "wealthTrillion": 6.5,
        "wealthShare": 1.3
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 1933,
        "adultsShare": 35.4,
        "wealthTrillion": 71.7,
        "wealthShare": 14.4
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 704,
        "adultsShare": 12.9,
        "wealthTrillion": 191.8,
        "wealthShare": 38.5
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 60.035,
        "adultsShare": 1.1,
        "wealthTrillion": 141.1,
        "wealthShare": 28.3
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 5.937,
        "adultsShare": 0.11,
        "wealthTrillion": 48.3,
        "wealthShare": 9.7
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.028,
        "adultsShare": 0.0005,
        "wealthTrillion": 38.8,
        "wealthShare": 7.8
      }
    ]
  },
  {
    "year": 2025,
    "totalWealthTrillion": 521.8,
    "adultPopulationBillions": 5.51,
    "meanWealthPerAdult": 94700,
    "medianWealthPerAdult": 9450,
    "giniCoefficient": 0.878,
    "shares": {
      "top1Percent": 45.4,
      "top10Percent": 83.7,
      "middle40Percent": 14.8,
      "bottom50Percent": 1.5
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2727,
        "adultsShare": 49.5,
        "wealthTrillion": 6.8,
        "wealthShare": 1.3
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 1989,
        "adultsShare": 36.1,
        "wealthTrillion": 76.2,
        "wealthShare": 14.6
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 727,
        "adultsShare": 13.2,
        "wealthTrillion": 201.4,
        "wealthShare": 38.6
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 60.944,
        "adultsShare": 1.11,
        "wealthTrillion": 146.3,
        "wealthShare": 28
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 6.027,
        "adultsShare": 0.11,
        "wealthTrillion": 50.1,
        "wealthShare": 9.6
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.029,
        "adultsShare": 0.0005,
        "wealthTrillion": 41,
        "wealthShare": 7.9
      }
    ]
  },
  {
    "year": 2026,
    "totalWealthTrillion": 546.2,
    "adultPopulationBillions": 5.56,
    "meanWealthPerAdult": 98240,
    "medianWealthPerAdult": 9750,
    "giniCoefficient": 0.877,
    "shares": {
      "top1Percent": 45.3,
      "top10Percent": 83.5,
      "middle40Percent": 15,
      "bottom50Percent": 1.5
    },
    "tiers": [
      {
        "bracket": "< $10k",
        "minWealth": 0,
        "maxWealth": 10000,
        "adultsMillion": 2702,
        "adultsShare": 48.6,
        "wealthTrillion": 7.1,
        "wealthShare": 1.3
      },
      {
        "bracket": "$10k - $100k",
        "minWealth": 10000,
        "maxWealth": 100000,
        "adultsMillion": 2046,
        "adultsShare": 36.8,
        "wealthTrillion": 80.8,
        "wealthShare": 14.8
      },
      {
        "bracket": "$100k - $1M",
        "minWealth": 100000,
        "maxWealth": 1000000,
        "adultsMillion": 745,
        "adultsShare": 13.4,
        "wealthTrillion": 210.3,
        "wealthShare": 38.5
      },
      {
        "bracket": "$1M - $10M",
        "minWealth": 1000000,
        "maxWealth": 10000000,
        "adultsMillion": 62.763,
        "adultsShare": 1.13,
        "wealthTrillion": 152.4,
        "wealthShare": 27.9
      },
      {
        "bracket": "$10M - $100M",
        "minWealth": 10000000,
        "maxWealth": 100000000,
        "adultsMillion": 6.207,
        "adultsShare": 0.11,
        "wealthTrillion": 52.1,
        "wealthShare": 9.5
      },
      {
        "bracket": "> $100M",
        "minWealth": 100000000,
        "maxWealth": null,
        "adultsMillion": 0.031,
        "adultsShare": 0.0006,
        "wealthTrillion": 43.5,
        "wealthShare": 8
      }
    ]
  }
];
