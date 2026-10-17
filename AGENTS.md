<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Node.js Environment & Tool Execution

This project is configured to use **Node.js v26** (see `.nvmrc`, `.node-version`, and `package.json`).

### Locating Node & Running Commands in Subshells (macOS)
On macOS, non-interactive subshell executions (e.g. agent tool calls or CI steps) do not source `~/.zshrc`, where NVM typically loads. If `node` or `npm` appears missing or `command not found: node` is encountered:

1. Prepend the installed Node v26 binary directory to `PATH`:
   ```bash
   export PATH="$HOME/.nvm/versions/node/v26.8.1/bin:$PATH"
   ```
2. Or source NVM directly:
   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   nvm use 26
   ```

### Core Project Commands
- **Run Tests**: `export PATH="$HOME/.nvm/versions/node/v26.8.1/bin:$PATH" && npm test`
- **Typecheck**: `export PATH="$HOME/.nvm/versions/node/v26.8.1/bin:$PATH" && npm run typecheck`
- **Production Build**: `export PATH="$HOME/.nvm/versions/node/v26.8.1/bin:$PATH" && npm run build`
- **Dev Server**: `export PATH="$HOME/.nvm/versions/node/v26.8.1/bin:$PATH" && npm run dev`

---

# UX & Interactive Learning Design System Guardrails

MacroMonitor is designed as an **Interactive Economic Field Guide & Learning Lab** (inspired by *Brilliant.org*, *The Pudding*, and *NYT Upshot*), **not** a generic AI-generated SaaS dashboard. Every new feature, page, or macro radar MUST adhere to these 5 rules:

1. **Question First, Metric Second (No Jargon Walls)**
   - Never open a page or radar with a generic glowing pill badge (`<Sparkles /> Institutional Telemetry`) or a dense list of financial acronyms.
   - Always lead with a human curiosity question in `.font-editorial` (e.g., *"Why are existing homeowners refusing to sell?"*) and ground abstract metrics in a physical-world metaphor (*bathtub vs. faucet*, *golden handcuffs*, *canary in the coal mine*) before showing raw basis points.

2. **Predict or Manipulate Before Reading (Active Learning Loop)**
   - Never ship a static chart followed by a passive wall of text.
   - Every new analytical module must include an interactive learning hook: a **Predict-First slider** (like `WealthIntuitionLab.tsx`), a **What-If cause-and-effect lever** (like `MacroExecutiveBriefing.tsx`), or a `PlainEnglishCard` equipped with a `quiz` prop and `id` wired to `markChallengeCompleted` in `AppContext.tsx` so learners earn `+15 XP` toward their Explorer Rank.

3. **No "Icon-in-a-Translucent-Squircle" Bento Clichés**
   - Do not place `<div className="h-8 w-8 rounded-xl bg-sky-500/15"><Icon /></div>` badges in the corner of every card in a grid.
   - Use numbered field-guide indices (`01 / NET WORTH`, `Mission 01`, `Chapter 01`) in `.font-mono-tabular` for hierarchy, use `.tactile-button` (with 3D bottom lip `border-b-2`/`3px` and springy press states) for interactive controls, and break up 4-column KPI grids with interactive sandbox labs.

4. **Strict Three-Tier Typographic Contrast (`src/app/globals.css`)**
   - **`.font-editorial`** (`--font-display` serif): Required for hero headlines, chapter titles, and curiosity questions.
   - **Default `--font-sans`**: Used for explanatory prose, field notes, and UI labels.
   - **`.font-mono-tabular`** (`--font-mono` with `tabular-nums`): Required for all numbers, dollar figures, percentages, years, XP counters, and basis-point spreads.

5. **Contextualize Every Number & Respect Modern CSS Motion**
   - Never display a raw number (`$478T` or `MOVE: 108.5`) without a human relational benchmark on the same card (e.g., *"4.2x annual world output"* or *"Danger zone: >120"*).
   - For hover/active motion, use individual CSS transform properties (`translate`, `scale`) with explicit base identity values (`translate: 0px 0px; scale: 1;`) and respect `@property --animation-reduced` rather than global `0.01ms` overrides.

