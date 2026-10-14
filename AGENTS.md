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
