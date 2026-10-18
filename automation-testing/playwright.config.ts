import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";
import { resolveEnv } from "@/config/env";
import { buildGrepInvert } from "@/config/env-guard";
import { findUrls } from "@/config/urls";

const env = resolveEnv(process.env.ENV);
const includeFull = process.env.FULL === "1";
const isDev = env === "dev";
const grepInvert = buildGrepInvert(env, includeFull);
// Page objects navigate with "./": GitHub Pages serves the game under /web-game-duck-stack/, so the baseURL keeps
// its path and ends with "/" (a leading "/" would drop the path). undefined on an env without a host.
const webUrl = findUrls(env)?.webUrl;
const baseURL = webUrl ? `${webUrl}/` : undefined;

// Dev runs against a PRODUCTION build of ../client under the same base path deploy.yml uses, not `vite dev`: that is
// what GitHub Pages serves. A second build with Ducker ID sign-in switched ON against a fake issuer (ADR-0018) is
// served on its own port for the ducker-id sign-in spec only. Both come from ../client/scripts/build-e2e.mjs.
const PORT = 4173;
const AUTH_PORT = 4391;
const AUTH_URL = `http://127.0.0.1:${AUTH_PORT}/`;
const prebuilt = process.env.CLIENT_PREBUILT === "1";
const build = prebuilt ? "" : "pnpm build:e2e && ";

const TOUCH = /e2e\/touch\/.*\.e2e\.ts$/;
const SIGN_IN = /e2e\/ducker-id\/sign-in\.e2e\.ts$/;

export default defineConfig({
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  fullyParallel: true,
  // Planned rounds play up to 30 pieces on the fake clock; that is real work for the browser, so a CI runner gets room.
  timeout: 90_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  // "app" first: the playwright-test MCP server (agents) treats the first project as primary.
  // Variants are extra projects named "app-<variant>"; package.json runs --project="app*".
  projects: [
    {
      name: "app",
      testDir: "./src/tests",
      testMatch: [/e2e\/.*\.e2e\.ts$/, /api\/.*\.api\.ts$/, /seed\.spec\.ts$/],
      testIgnore: [TOUCH, SIGN_IN],
      grepInvert,
      use: { ...devices["Desktop Chrome"], baseURL },
    },
    // A real touch screen: the touch band is what a phone shows instead of the key hints (FR-16).
    {
      name: "app-touch",
      testDir: "./src/tests",
      testMatch: TOUCH,
      grepInvert,
      use: { ...devices["Pixel 5"], baseURL },
    },
    // Ducker ID sign-in against the flag-on build. Only dev has one: the deployed build ships with the flag off.
    ...(isDev
      ? [
          {
            name: "app-auth",
            testDir: "./src/tests",
            testMatch: SIGN_IN,
            grepInvert,
            use: { ...devices["Desktop Chrome"], baseURL: AUTH_URL },
          },
        ]
      : []),
    // One-off data setup (pnpm provision), never part of a normal run.
    {
      name: "provision",
      testDir: "./src/tests/setup",
      testMatch: /.*\.setup\.ts$/,
      workers: 1,
      use: { baseURL },
    },
    { name: "unit", testDir: "./src", testMatch: /.*\.test\.ts$/ },
  ],
  // Boots the game itself on dev (builds both first unless CLIENT_PREBUILT=1). The auth server answers 404 until the
  // chained build has written ../client/.e2e/auth, and Playwright keeps waiting on a 404.
  webServer:
    isDev && !process.argv.includes("--project=unit")
      ? [
          {
            command: `cd ../client && ${build}node scripts/serve.mjs ${PORT} .e2e/pages`,
            url: `http://127.0.0.1:${PORT}/web-game-duck-stack/`,
            reuseExistingServer: !process.env.CI,
            timeout: 300_000,
          },
          {
            command: `node ../client/scripts/serve.mjs ${AUTH_PORT} ../client/.e2e/auth`,
            url: AUTH_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 300_000,
          },
        ]
      : undefined,
});
