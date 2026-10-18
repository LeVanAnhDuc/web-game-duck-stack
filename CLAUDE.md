# CLAUDE.md

**Duck Stack** — Tetris on the modern Guideline (SRS, 7-bag, hold, lock delay,
T-spin), a Vite + React static app served from GitHub Pages
(https://levananhduc.github.io/web-game-duck-stack/). No server, no database, no API:
everything runs in the browser. The methodology layer (docs contract, feature flow,
hooks) is `.claude/CLAUDE.md`; read it before working.

## Layout

| Folder | Holds |
| --- | --- |
| `client/` | the game app: `package.json`, `pnpm-lock.yaml`, `.env.example`, `index.html`, `public/`, `src/`, unit + component tests (vitest, next to the code) |
| `automation-testing/` | the end-to-end regression suite (Playwright): requirements, test cases, defects, page objects, specs — its own `package.json`, rules in `automation-testing/CLAUDE.md` |
| `docs/` | product docs, requirements, ADRs, feature specs — map in `docs/README.md` |
| `.claude/`, `.githooks/`, `.github/`, `cliff.toml` | Claude config, git hooks, CI, release notes config — all at the root |

`.env.example` lives at `client/.env.example` (`.claude/CLAUDE.md` still draws it at the
root — same file, it moved with the app).

## Commands

```bash
cd client
pnpm install --frozen-lockfile
pnpm dev              # http://localhost:5173
pnpm test             # vitest: unit + component
pnpm typecheck
pnpm build            # typecheck + production build into client/dist/
pnpm preview
pnpm release:next     # next version, from the commits (git-cliff, whole repo)
```

```bash
cd automation-testing   # after the client install: the suite builds ../client itself
pnpm install && pnpm exec playwright install chromium
pnpm test             # builds ../client twice (pnpm build:e2e), serves it, runs every module
pnpm typecheck
pnpm coverage:check   # REQ <-> TC <-> spec <-> bug; --write regenerates the traceability matrix
```

Regression tests: automation-testing/ (/write-tests)

Git hooks: `git config core.hooksPath .githooks` (commit-msg + pre-commit `tsc` on
the package whose `.ts`/`.tsx` files are staged).
