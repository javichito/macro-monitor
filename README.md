# MacroMonitor

**MacroMonitor** is a state-of-the-art web application built with Next.js 16.3.4, React 19, TypeScript, and Tailwind CSS. It is engineered to track global macroeconomic indicators, wealth distribution, asset class breakdowns, and geopolitical shifts over time (1980–2026) in a minimalist, intuitive format accessible to everyday people.

---

## Key Features

1. **Executive Overview ("The Pulse of the Planet")**
   - Live KPI counters: Total Global Wealth ($546.2T), World Annual GDP ($122.4T), Global Median Adult Wealth ($9,750), and Sovereign Debt-to-GDP (273%).
   - Interactive Timeline Engine with automatic cycle playback (1980 to 2026).
   - Global Perspective Switcher: Seamlessly toggle between **Nominal USD**, **Inflation-Adjusted (Real) USD**, and **Purchasing Power Parity (PPP)**.

2. **Wealth & Inequality Deep Dive**
   - **Interactive Wealth Pyramid**: Compare the percentage of the world's adult population vs. the proportion of wealth held across brackets (<$10k, $10k–$100k, $100k–$1M, >$1M).
   - **Inequality Trends**: Historical trajectory of Top 1%, Top 10%, and Bottom 50% shares alongside the global Gini coefficient from 1980 to 2026.
   - **"Where Do You Stand?" Calculator**: Personal wealth positioner that calculates exact national and global percentiles with comparisons against local and global medians.

3. **Global Asset Allocation**
   - Stacked composition and share charts covering **Real Estate & Land**, **Public Equities**, **Bonds & Pensions**, **Cash & Bank Deposits**, **Physical Gold**, and **Digital Assets**.
   - Highlights the dominance of tangible assets vs. paper financial claims through multi-decade inflation and rate cycles.

4. **Geographic & Coalition Intelligence**
   - Interactive SVG World Map with territory beacons and coordinate mapping.
   - Dual-granularity inspection: Toggle between **Individual Nations** and **Economic Blocs** (G7, BRICS+, Eurozone).
   - Dynamic metric switches: Total Wealth, Mean Wealth, Median Wealth, GDP, Inflation, Debt-to-GDP, and Gini coefficient.

5. **Macroeconomic Engine & Debt Supercycle**
   - Multi-decade tracking of the Debt Supercycle ($12.5T in 1980, $84T in 2000, to $334T in 2026).
   - Central Bank benchmark rates comparison (US Federal Reserve, ECB, Bank of Japan, PBOC, Bank of England) including the Volcker rate shock era (1980–1982).
   - Foreign exchange reserve diversification (USD, EUR, CNY, JPY, GBP, and Gold).
   - Critical macroeconomic milestones from the Volcker anti-inflation shock and 1987 Black Monday to the 2024–2026 post-inflation rate normalization.

6. **"In Plain English" Educational System**
   - Contextual collapsible guides breaking down complex economic concepts (e.g., Median vs. Mean, Gini coefficient, Debt-to-GDP ratio) into plain, intuitive analogies.

---

## Technical Architecture

- **Framework**: Next.js 16.3.4 with Turbopack (App Router, Server Components & Client Hydration)
- **UI & Runtime**: React 19, TypeScript 5.7+
- **Styling**: Tailwind CSS v4 with custom obsidian dark-mode tokens
- **Visualizations**: Recharts SVG responsive containers & custom projected SVG choropleth world map
- **Data Engine**: Benchmark historical datasets curated from UBS/Credit Suisse Global Wealth Reports, World Bank Open Data, and IMF World Economic Outlook

---

## Getting Started

Ensure Node.js (v22+ or v26+) is available in your PATH:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build optimized production bundle
npm run build

# Start production server
npm start
```
