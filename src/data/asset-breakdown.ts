import { GlobalAssetYear } from '../lib/types';

/*
 * Compiled from global central bank balance sheets, Savills World Real Estate Research,
 * SIFMA Capital Markets Fact Book, BIS debt statistics, and World Gold Council reserves.
 * Features institutional sub-asset class breakdowns across 1980-2026.
 */
export const GLOBAL_ASSET_HISTORY: GlobalAssetYear[] = [
  {
    "year": 1980,
    "totalGrossAssetsTrillion": 40.2,
    "totalLiabilitiesTrillion": 5.7,
    "netWealthTrillion": 34.5,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 58,
        "valueTrillion": 23.3,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 76,
            "valueTrillion": 17.7,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 14,
            "valueTrillion": 3.3,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 10,
            "valueTrillion": 2.3,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 17,
        "valueTrillion": 6.8,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 55,
            "valueTrillion": 3.7,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 25,
            "valueTrillion": 1.7,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 20,
            "valueTrillion": 1.4,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 12,
        "valueTrillion": 4.8,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 45,
            "valueTrillion": 2.2,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 32,
            "valueTrillion": 1.5,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 23,
            "valueTrillion": 1.1,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 10,
        "valueTrillion": 4,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 82,
            "valueTrillion": 3.3,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 8,
            "valueTrillion": 0.3,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 10,
            "valueTrillion": 0.4,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 3,
        "valueTrillion": 1.3,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 50,
            "valueTrillion": 0.7,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 28,
            "valueTrillion": 0.4,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 22,
            "valueTrillion": 0.3,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 68,
        "valueTrillion": 3.9,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 25,
        "valueTrillion": 1.4,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 7,
        "valueTrillion": 0.4,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 1990,
    "totalGrossAssetsTrillion": 79.5,
    "totalLiabilitiesTrillion": 11.3,
    "netWealthTrillion": 68.2,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 55,
        "valueTrillion": 43.7,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 77,
            "valueTrillion": 33.6,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 14,
            "valueTrillion": 6.1,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 3.9,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 19,
        "valueTrillion": 15.1,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 58,
            "valueTrillion": 8.8,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 24,
            "valueTrillion": 3.6,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 18,
            "valueTrillion": 2.7,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 13,
        "valueTrillion": 10.3,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 46,
            "valueTrillion": 4.7,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 30,
            "valueTrillion": 3.1,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 2.5,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 11,
        "valueTrillion": 8.7,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 80,
            "valueTrillion": 7,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 11,
            "valueTrillion": 1,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 9,
            "valueTrillion": 0.8,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2,
        "valueTrillion": 1.7,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 49,
            "valueTrillion": 0.8,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 29,
            "valueTrillion": 0.5,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 22,
            "valueTrillion": 0.4,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 70,
        "valueTrillion": 7.9,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 23,
        "valueTrillion": 2.6,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 7,
        "valueTrillion": 0.8,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 1995,
    "totalGrossAssetsTrillion": 108.4,
    "totalLiabilitiesTrillion": 15.8,
    "netWealthTrillion": 92.6,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 53,
        "valueTrillion": 57.5,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 77,
            "valueTrillion": 44.3,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 14,
            "valueTrillion": 8.1,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 5.2,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 22,
        "valueTrillion": 23.8,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 60,
            "valueTrillion": 14.3,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 23,
            "valueTrillion": 5.5,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 4,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 13,
        "valueTrillion": 14.1,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 47,
            "valueTrillion": 6.6,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 29,
            "valueTrillion": 4.1,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 3.4,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 10,
        "valueTrillion": 10.8,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 78,
            "valueTrillion": 8.4,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 14,
            "valueTrillion": 1.5,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 8,
            "valueTrillion": 0.9,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2,
        "valueTrillion": 2.2,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 48,
            "valueTrillion": 1.1,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 30,
            "valueTrillion": 0.7,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 22,
            "valueTrillion": 0.5,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 71,
        "valueTrillion": 11.2,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 21,
        "valueTrillion": 3.3,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 8,
        "valueTrillion": 1.3,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2000,
    "totalGrossAssetsTrillion": 144.5,
    "totalLiabilitiesTrillion": 22.1,
    "netWealthTrillion": 122.4,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 50,
        "valueTrillion": 72.3,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 78,
            "valueTrillion": 56.4,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 9.4,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 6.5,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 26,
        "valueTrillion": 37.6,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 63,
            "valueTrillion": 23.7,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 20,
            "valueTrillion": 7.5,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 6.4,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 12,
        "valueTrillion": 17.3,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 46,
            "valueTrillion": 8,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 30,
            "valueTrillion": 5.2,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 4.2,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 10,
        "valueTrillion": 14.5,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 76,
            "valueTrillion": 11,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 16,
            "valueTrillion": 2.3,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 8,
            "valueTrillion": 1.2,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2,
        "valueTrillion": 2.8,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 48,
            "valueTrillion": 1.3,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 31,
            "valueTrillion": 0.9,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 0.6,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 72,
        "valueTrillion": 15.9,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 20,
        "valueTrillion": 4.4,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 8,
        "valueTrillion": 1.8,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2005,
    "totalGrossAssetsTrillion": 215.8,
    "totalLiabilitiesTrillion": 33.2,
    "netWealthTrillion": 182.6,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 53,
        "valueTrillion": 114.4,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 79,
            "valueTrillion": 90.4,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 14.9,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 8,
            "valueTrillion": 9.2,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 22,
        "valueTrillion": 47.5,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 61,
            "valueTrillion": 29,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 22,
            "valueTrillion": 10.5,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 8.1,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 13,
        "valueTrillion": 28.1,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 46,
            "valueTrillion": 12.9,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 29,
            "valueTrillion": 8.1,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 25,
            "valueTrillion": 7,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 10,
        "valueTrillion": 21.6,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 76,
            "valueTrillion": 16.4,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 17,
            "valueTrillion": 3.7,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 7,
            "valueTrillion": 1.5,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2,
        "valueTrillion": 4.2,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 48,
            "valueTrillion": 2,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 31,
            "valueTrillion": 1.3,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 0.9,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 74,
        "valueTrillion": 24.6,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 18,
        "valueTrillion": 6,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 8,
        "valueTrillion": 2.7,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2010,
    "totalGrossAssetsTrillion": 290.4,
    "totalLiabilitiesTrillion": 42.6,
    "netWealthTrillion": 247.8,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 49,
        "valueTrillion": 142.3,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 78,
            "valueTrillion": 111,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 18.5,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 12.8,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 23,
        "valueTrillion": 66.8,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 60,
            "valueTrillion": 40.1,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 23,
            "valueTrillion": 15.4,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 11.4,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 16,
        "valueTrillion": 46.5,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 49,
            "valueTrillion": 22.8,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 27,
            "valueTrillion": 12.6,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 11.2,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 9,
        "valueTrillion": 26.1,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 77,
            "valueTrillion": 20.1,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 16,
            "valueTrillion": 4.2,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 7,
            "valueTrillion": 1.8,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 3,
        "valueTrillion": 8.7,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 47,
            "valueTrillion": 4.1,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 32,
            "valueTrillion": 2.8,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 1.8,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 73,
        "valueTrillion": 31.1,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 18,
        "valueTrillion": 7.7,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 9,
        "valueTrillion": 3.8,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2015,
    "totalGrossAssetsTrillion": 366.8,
    "totalLiabilitiesTrillion": 51.4,
    "netWealthTrillion": 315.4,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 48,
        "valueTrillion": 176.1,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 78,
            "valueTrillion": 137.4,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 22.9,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 15.8,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 25,
        "valueTrillion": 91.7,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 61,
            "valueTrillion": 55.9,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 22,
            "valueTrillion": 20.2,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 15.6,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 15,
        "valueTrillion": 55,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 48,
            "valueTrillion": 26.4,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 28,
            "valueTrillion": 15.4,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 13.2,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 9,
        "valueTrillion": 33,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 78,
            "valueTrillion": 25.7,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 15,
            "valueTrillion": 5,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 7,
            "valueTrillion": 2.3,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2.9,
        "valueTrillion": 10.9,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 47,
            "valueTrillion": 5.1,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 32,
            "valueTrillion": 3.5,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 2.3,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      },
      {
        "id": "crypto-digital",
        "name": "Digital Assets & Crypto",
        "sharePercent": 0.1,
        "valueTrillion": 0.1,
        "description": "Decentralized cryptocurrencies, smart contract platforms, and digital bearer instruments.",
        "color": "#a855f7",
        "isTangible": false,
        "subCategories": [
          {
            "id": "crypto-btc",
            "name": "Store of Value (Bitcoin)",
            "shareOfParentPercent": 85,
            "valueTrillion": 0.1,
            "description": "Algorithmic digital monetary network with a strictly enforced 21 million coin supply.",
            "color": "#a855f7"
          },
          {
            "id": "crypto-smart",
            "name": "Smart Contract Platforms (ETH, SOL)",
            "shareOfParentPercent": 10,
            "valueTrillion": 0,
            "description": "Decentralized computation and settlement networks hosting automated financial contracts.",
            "color": "#c084fc"
          },
          {
            "id": "crypto-stable",
            "name": "Stablecoins & Tokenized RWAs",
            "shareOfParentPercent": 5,
            "valueTrillion": 0,
            "description": "Dollar-pegged cryptographic tokens and tokenized treasury bills facilitating 24/7 liquidity.",
            "color": "#e9d5ff"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 73,
        "valueTrillion": 37.5,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 18,
        "valueTrillion": 9.3,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 9,
        "valueTrillion": 4.6,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2020,
    "totalGrossAssetsTrillion": 484.2,
    "totalLiabilitiesTrillion": 64.8,
    "netWealthTrillion": 419.4,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 47,
        "valueTrillion": 227.6,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 78,
            "valueTrillion": 177.5,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 29.6,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 20.5,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 28,
        "valueTrillion": 135.6,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 63,
            "valueTrillion": 85.4,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 20,
            "valueTrillion": 27.1,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 23.1,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 14,
        "valueTrillion": 67.8,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 48,
            "valueTrillion": 32.5,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 28,
            "valueTrillion": 19,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 16.3,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 8,
        "valueTrillion": 38.7,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 79,
            "valueTrillion": 30.6,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 15,
            "valueTrillion": 5.8,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 6,
            "valueTrillion": 2.3,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2.8,
        "valueTrillion": 13.6,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 47,
            "valueTrillion": 6.4,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 32,
            "valueTrillion": 4.4,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 2.9,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      },
      {
        "id": "crypto-digital",
        "name": "Digital Assets & Crypto",
        "sharePercent": 0.2,
        "valueTrillion": 0.9,
        "description": "Decentralized cryptocurrencies, smart contract platforms, and digital bearer instruments.",
        "color": "#a855f7",
        "isTangible": false,
        "subCategories": [
          {
            "id": "crypto-btc",
            "name": "Store of Value (Bitcoin)",
            "shareOfParentPercent": 68,
            "valueTrillion": 0.6,
            "description": "Algorithmic digital monetary network with a strictly enforced 21 million coin supply.",
            "color": "#a855f7"
          },
          {
            "id": "crypto-smart",
            "name": "Smart Contract Platforms (ETH, SOL)",
            "shareOfParentPercent": 24,
            "valueTrillion": 0.2,
            "description": "Decentralized computation and settlement networks hosting automated financial contracts.",
            "color": "#c084fc"
          },
          {
            "id": "crypto-stable",
            "name": "Stablecoins & Tokenized RWAs",
            "shareOfParentPercent": 8,
            "valueTrillion": 0.1,
            "description": "Dollar-pegged cryptographic tokens and tokenized treasury bills facilitating 24/7 liquidity.",
            "color": "#e9d5ff"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 72,
        "valueTrillion": 46.7,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 18,
        "valueTrillion": 11.7,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 10,
        "valueTrillion": 6.5,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2022,
    "totalGrossAssetsTrillion": 528.6,
    "totalLiabilitiesTrillion": 71.2,
    "netWealthTrillion": 457.4,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 48,
        "valueTrillion": 253.7,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 78,
            "valueTrillion": 197.9,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 33,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 22.8,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 25,
        "valueTrillion": 132.2,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 62,
            "valueTrillion": 82,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 21,
            "valueTrillion": 27.8,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 22.5,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 14,
        "valueTrillion": 74,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 48,
            "valueTrillion": 35.5,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 28,
            "valueTrillion": 20.7,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 17.8,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 10,
        "valueTrillion": 52.9,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 75,
            "valueTrillion": 39.7,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 19,
            "valueTrillion": 10.1,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 6,
            "valueTrillion": 3.2,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2.7,
        "valueTrillion": 14.2,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 47,
            "valueTrillion": 6.7,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 32,
            "valueTrillion": 4.5,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 3,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      },
      {
        "id": "crypto-digital",
        "name": "Digital Assets & Crypto",
        "sharePercent": 0.3,
        "valueTrillion": 1.6,
        "description": "Decentralized cryptocurrencies, smart contract platforms, and digital bearer instruments.",
        "color": "#a855f7",
        "isTangible": false,
        "subCategories": [
          {
            "id": "crypto-btc",
            "name": "Store of Value (Bitcoin)",
            "shareOfParentPercent": 55,
            "valueTrillion": 0.9,
            "description": "Algorithmic digital monetary network with a strictly enforced 21 million coin supply.",
            "color": "#a855f7"
          },
          {
            "id": "crypto-smart",
            "name": "Smart Contract Platforms (ETH, SOL)",
            "shareOfParentPercent": 31,
            "valueTrillion": 0.5,
            "description": "Decentralized computation and settlement networks hosting automated financial contracts.",
            "color": "#c084fc"
          },
          {
            "id": "crypto-stable",
            "name": "Stablecoins & Tokenized RWAs",
            "shareOfParentPercent": 14,
            "valueTrillion": 0.2,
            "description": "Dollar-pegged cryptographic tokens and tokenized treasury bills facilitating 24/7 liquidity.",
            "color": "#e9d5ff"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 72,
        "valueTrillion": 51.3,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 18,
        "valueTrillion": 12.8,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 10,
        "valueTrillion": 7.1,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2024,
    "totalGrossAssetsTrillion": 574,
    "totalLiabilitiesTrillion": 74,
    "netWealthTrillion": 500,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 48,
        "valueTrillion": 275.5,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 78,
            "valueTrillion": 214.9,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 35.8,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 24.8,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 26,
        "valueTrillion": 149.2,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 63,
            "valueTrillion": 94,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 20,
            "valueTrillion": 29.8,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 25.4,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 14,
        "valueTrillion": 80.4,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 48,
            "valueTrillion": 38.6,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 28,
            "valueTrillion": 22.5,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 19.3,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 9,
        "valueTrillion": 51.7,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 74,
            "valueTrillion": 38.3,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 20,
            "valueTrillion": 10.3,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 6,
            "valueTrillion": 3.1,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2.6,
        "valueTrillion": 14.7,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 47,
            "valueTrillion": 6.9,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 32,
            "valueTrillion": 4.7,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 3.1,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      },
      {
        "id": "crypto-digital",
        "name": "Digital Assets & Crypto",
        "sharePercent": 0.4,
        "valueTrillion": 2.5,
        "description": "Decentralized cryptocurrencies, smart contract platforms, and digital bearer instruments.",
        "color": "#a855f7",
        "isTangible": false,
        "subCategories": [
          {
            "id": "crypto-btc",
            "name": "Store of Value (Bitcoin)",
            "shareOfParentPercent": 57,
            "valueTrillion": 1.4,
            "description": "Algorithmic digital monetary network with a strictly enforced 21 million coin supply.",
            "color": "#a855f7"
          },
          {
            "id": "crypto-smart",
            "name": "Smart Contract Platforms (ETH, SOL)",
            "shareOfParentPercent": 29,
            "valueTrillion": 0.7,
            "description": "Decentralized computation and settlement networks hosting automated financial contracts.",
            "color": "#c084fc"
          },
          {
            "id": "crypto-stable",
            "name": "Stablecoins & Tokenized RWAs",
            "shareOfParentPercent": 14,
            "valueTrillion": 0.4,
            "description": "Dollar-pegged cryptographic tokens and tokenized treasury bills facilitating 24/7 liquidity.",
            "color": "#e9d5ff"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 72,
        "valueTrillion": 53.3,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 18,
        "valueTrillion": 13.3,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 10,
        "valueTrillion": 7.4,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2025,
    "totalGrossAssetsTrillion": 597.5,
    "totalLiabilitiesTrillion": 75.7,
    "netWealthTrillion": 521.8,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 48,
        "valueTrillion": 286.8,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 78,
            "valueTrillion": 223.7,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 37.3,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 25.8,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 26,
        "valueTrillion": 155.4,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 63,
            "valueTrillion": 97.9,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 20,
            "valueTrillion": 31.1,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 26.4,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 14,
        "valueTrillion": 83.6,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 48,
            "valueTrillion": 40.1,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 28,
            "valueTrillion": 23.4,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 20.1,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 9,
        "valueTrillion": 53.8,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 74,
            "valueTrillion": 39.8,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 20,
            "valueTrillion": 10.8,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 6,
            "valueTrillion": 3.2,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2.5,
        "valueTrillion": 15,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 47,
            "valueTrillion": 7.1,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 32,
            "valueTrillion": 4.8,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 3.2,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      },
      {
        "id": "crypto-digital",
        "name": "Digital Assets & Crypto",
        "sharePercent": 0.5,
        "valueTrillion": 2.9,
        "description": "Decentralized cryptocurrencies, smart contract platforms, and digital bearer instruments.",
        "color": "#a855f7",
        "isTangible": false,
        "subCategories": [
          {
            "id": "crypto-btc",
            "name": "Store of Value (Bitcoin)",
            "shareOfParentPercent": 57,
            "valueTrillion": 1.7,
            "description": "Algorithmic digital monetary network with a strictly enforced 21 million coin supply.",
            "color": "#a855f7"
          },
          {
            "id": "crypto-smart",
            "name": "Smart Contract Platforms (ETH, SOL)",
            "shareOfParentPercent": 29,
            "valueTrillion": 0.8,
            "description": "Decentralized computation and settlement networks hosting automated financial contracts.",
            "color": "#c084fc"
          },
          {
            "id": "crypto-stable",
            "name": "Stablecoins & Tokenized RWAs",
            "shareOfParentPercent": 14,
            "valueTrillion": 0.4,
            "description": "Dollar-pegged cryptographic tokens and tokenized treasury bills facilitating 24/7 liquidity.",
            "color": "#e9d5ff"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 72,
        "valueTrillion": 54.5,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 18,
        "valueTrillion": 13.6,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 10,
        "valueTrillion": 7.6,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  },
  {
    "year": 2026,
    "totalGrossAssetsTrillion": 624.4,
    "totalLiabilitiesTrillion": 78.2,
    "netWealthTrillion": 546.2,
    "categories": [
      {
        "id": "real-estate",
        "name": "Real Estate & Land",
        "sharePercent": 47.6,
        "valueTrillion": 297.2,
        "description": "Residential homes, agricultural property, and commercial buildings.",
        "color": "#10b981",
        "isTangible": true,
        "subCategories": [
          {
            "id": "re-residential",
            "name": "Residential Real Estate",
            "shareOfParentPercent": 78,
            "valueTrillion": 231.8,
            "description": "Single-family houses, apartments, and primary residences representing shelter wealth.",
            "color": "#10b981"
          },
          {
            "id": "re-commercial",
            "name": "Commercial Real Estate",
            "shareOfParentPercent": 13,
            "valueTrillion": 38.6,
            "description": "Office towers, logistics fulfillment centers, retail plazas, and hotels.",
            "color": "#34d399"
          },
          {
            "id": "re-agricultural",
            "name": "Agricultural & Farmland",
            "shareOfParentPercent": 9,
            "valueTrillion": 26.7,
            "description": "Arable cropland, timberland, and productive rural acreage.",
            "color": "#6ee7b7"
          }
        ]
      },
      {
        "id": "equities",
        "name": "Public & Private Equities",
        "sharePercent": 26.5,
        "valueTrillion": 165.5,
        "description": "Shares in publicly listed corporations, index funds, and private equity.",
        "color": "#06b6d4",
        "isTangible": false,
        "subCategories": [
          {
            "id": "eq-developed",
            "name": "Developed Large-Cap & Tech",
            "shareOfParentPercent": 63,
            "valueTrillion": 104.3,
            "description": "Global flagship blue-chips (S&P 500, Nasdaq, Euro Stoxx, Nikkei) and technology titans.",
            "color": "#06b6d4"
          },
          {
            "id": "eq-emerging",
            "name": "Emerging Markets & Small-Cap",
            "shareOfParentPercent": 20,
            "valueTrillion": 33.1,
            "description": "Growth companies in emerging Asian and Latin American markets and domestic mid/small-caps.",
            "color": "#38bdf8"
          },
          {
            "id": "eq-private",
            "name": "Private Equity & Unlisted",
            "shareOfParentPercent": 17,
            "valueTrillion": 28.1,
            "description": "Venture capital funds, buyout investments, and privately held family businesses.",
            "color": "#7dd3fc"
          }
        ]
      },
      {
        "id": "bonds-pensions",
        "name": "Bonds & Pension Reserves",
        "sharePercent": 14.1,
        "valueTrillion": 88,
        "description": "Sovereign and corporate bonds, annuities, and retirement entitlements.",
        "color": "#6366f1",
        "isTangible": false,
        "subCategories": [
          {
            "id": "bond-sovereign",
            "name": "Sovereign & Government Debt",
            "shareOfParentPercent": 48,
            "valueTrillion": 42.2,
            "description": "Government treasury bonds (US Treasuries, Bunds, JGBs, Gilts) acting as foundational monetary collateral.",
            "color": "#6366f1"
          },
          {
            "id": "bond-corporate",
            "name": "Corporate Debt (IG & High Yield)",
            "shareOfParentPercent": 28,
            "valueTrillion": 24.6,
            "description": "Corporate bonds issued by private industry to finance expansion and operations.",
            "color": "#818cf8"
          },
          {
            "id": "bond-pension",
            "name": "Pension & Retirement Reserves",
            "shareOfParentPercent": 24,
            "valueTrillion": 21.1,
            "description": "Public and private retirement plan entitlements, life insurance assets, and annuity reserves.",
            "color": "#a5b4fc"
          }
        ]
      },
      {
        "id": "cash-deposits",
        "name": "Cash & Bank Deposits",
        "sharePercent": 8.7,
        "valueTrillion": 54.3,
        "description": "Physical currency, checking accounts, money market funds, and bank deposits.",
        "color": "#f59e0b",
        "isTangible": false,
        "subCategories": [
          {
            "id": "cash-bank",
            "name": "Commercial Bank Deposits",
            "shareOfParentPercent": 74,
            "valueTrillion": 40.2,
            "description": "Insured checking, savings accounts, and term certificates in retail and commercial banks.",
            "color": "#f59e0b"
          },
          {
            "id": "cash-mmf",
            "name": "Money Market Funds & T-Bills",
            "shareOfParentPercent": 20,
            "valueTrillion": 10.9,
            "description": "Yield-bearing short-term institutional cash pools and treasury bill equivalents.",
            "color": "#fbbf24"
          },
          {
            "id": "cash-physical",
            "name": "Circulating Currency",
            "shareOfParentPercent": 6,
            "valueTrillion": 3.3,
            "description": "Physical paper banknotes and coins circulating through international commerce.",
            "color": "#fde68a"
          }
        ]
      },
      {
        "id": "gold-commodities",
        "name": "Gold & Precious Metals",
        "sharePercent": 2.6,
        "valueTrillion": 16,
        "description": "Privately held physical bullion, coins, central bank reserves, and jewelry.",
        "color": "#eab308",
        "isTangible": true,
        "subCategories": [
          {
            "id": "gold-jewelry",
            "name": "Jewelry & Private Holdings",
            "shareOfParentPercent": 47,
            "valueTrillion": 7.5,
            "description": "Consumer-held physical gold jewelry and private heirloom wealth.",
            "color": "#eab308"
          },
          {
            "id": "gold-investment",
            "name": "Bullion Bars, Coins & ETFs",
            "shareOfParentPercent": 32,
            "valueTrillion": 5.1,
            "description": "Investment bullion bars, sovereign minted coins, and physically backed exchange-traded funds.",
            "color": "#facc15"
          },
          {
            "id": "gold-reserves",
            "name": "Central Bank Vault Reserves",
            "shareOfParentPercent": 21,
            "valueTrillion": 3.4,
            "description": "Monetary gold stored in sovereign central bank vaults outside counterparty debt risk.",
            "color": "#fef08a"
          }
        ]
      },
      {
        "id": "crypto-digital",
        "name": "Digital Assets & Crypto",
        "sharePercent": 0.5,
        "valueTrillion": 3.4,
        "description": "Decentralized cryptocurrencies, smart contract platforms, and digital bearer instruments.",
        "color": "#a855f7",
        "isTangible": false,
        "subCategories": [
          {
            "id": "crypto-btc",
            "name": "Store of Value (Bitcoin)",
            "shareOfParentPercent": 58,
            "valueTrillion": 2,
            "description": "Algorithmic digital monetary network with a strictly enforced 21 million coin supply.",
            "color": "#a855f7"
          },
          {
            "id": "crypto-smart",
            "name": "Smart Contract Platforms (ETH, SOL)",
            "shareOfParentPercent": 28,
            "valueTrillion": 1,
            "description": "Decentralized computation and settlement networks hosting automated financial contracts.",
            "color": "#c084fc"
          },
          {
            "id": "crypto-stable",
            "name": "Stablecoins & Tokenized RWAs",
            "shareOfParentPercent": 14,
            "valueTrillion": 0.5,
            "description": "Dollar-pegged cryptographic tokens and tokenized treasury bills facilitating 24/7 liquidity.",
            "color": "#e9d5ff"
          }
        ]
      }
    ],
    "liabilityBreakdown": [
      {
        "id": "liab-mortgages",
        "name": "Residential Mortgages",
        "shareOfParentPercent": 72,
        "valueTrillion": 56.3,
        "description": "Long-term collateralized loans encumbering residential homes and apartments.",
        "color": "#f43f5e"
      },
      {
        "id": "liab-consumer",
        "name": "Consumer & Revolving Credit",
        "shareOfParentPercent": 18,
        "valueTrillion": 14.1,
        "description": "Credit card obligations, auto financing, and personal unsecured credit.",
        "color": "#fb7185"
      },
      {
        "id": "liab-student",
        "name": "Student & Education Debt",
        "shareOfParentPercent": 10,
        "valueTrillion": 7.8,
        "description": "Educational loans and human capital development obligations.",
        "color": "#fda4af"
      }
    ]
  }
];
