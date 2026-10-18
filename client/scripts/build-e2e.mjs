import { rmSync } from 'node:fs'
import { build } from 'vite'

/**
 * The two production builds the regression suite in ../automation-testing serves
 * (its playwright.config.ts webServer runs this, then scripts/serve.mjs).
 *
 *   .e2e/pages/web-game-duck-stack/  what deploy.yml ships: base path
 *                                    /web-game-duck-stack/, Ducker ID sign-in OFF.
 *                                    Served from .e2e/pages, so the URL keeps the
 *                                    same path GitHub Pages gives it.
 *   .e2e/auth/                       sign-in ON against a fake issuer that is never
 *                                    resolved: the suite routes every request to it
 *                                    (ADR-0018). Only the ducker-id module uses it.
 *
 * Process env beats .env files in Vite, so a local client/.env that switches the
 * flag on cannot leak into the flag-off build. Typechecking is `pnpm typecheck`'s
 * job, not this script's.
 */
const BUILDS = [
  {
    outDir: '.e2e/pages/web-game-duck-stack',
    env: {
      VITE_BASE_PATH: '/web-game-duck-stack/',
      VITE_FEATURE_DUCKER_SIGN_IN: 'false',
    },
  },
  {
    outDir: '.e2e/auth',
    env: {
      VITE_BASE_PATH: '/',
      VITE_FEATURE_DUCKER_SIGN_IN: 'true',
      VITE_DUCKER_ISSUER: 'http://ducker.test',
      VITE_DUCKER_CLIENT_ID: 'e2e-client',
      VITE_DUCKER_SCOPE: 'openid profile email',
      VITE_DUCKER_PROFILE_PATH: '/profile',
    },
  },
]

rmSync('.e2e', { recursive: true, force: true })
for (const { outDir, env } of BUILDS) {
  Object.assign(process.env, env)
  await build({ logLevel: 'warn', build: { outDir, emptyOutDir: true } })
  for (const key of Object.keys(env)) delete process.env[key]
}
