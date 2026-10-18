import type { Page, Request } from "@playwright/test";
import { DUCKER } from "@/data/test-data";
import { test as core } from "./core.fixture";

export type IssuerMode = "ok" | "deny" | "tamper";

export interface FakeIssuer {
  /** The authorize request the game navigated to (null until it happens). */
  authorize(): URL | null;
  /** Bodies of the calls to the token endpoint, parsed as form data. */
  tokenCalls(): URLSearchParams[];
}

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
};

/**
 * Plays Ducker ID for the flag-on build (issuer http://ducker.test, never resolved): /oauth/authorize redirects
 * straight back with a code, an error, or a tampered state; /oauth/token and /oauth/userinfo answer.
 */
async function install(page: Page, mode: IssuerMode): Promise<FakeIssuer> {
  let authorize: URL | null = null;
  const tokenCalls: URLSearchParams[] = [];
  await page.route(`${DUCKER.issuer}/oauth/authorize**`, async (route) => {
    const url = new URL(route.request().url());
    authorize = url;
    const back = new URL(url.searchParams.get("redirect_uri")!);
    if (mode === "deny") back.searchParams.set("error", "access_denied");
    else back.searchParams.set("code", "code-1");
    back.searchParams.set("state", mode === "tamper" ? "tampered" : url.searchParams.get("state")!);
    await route.fulfill({ status: 302, headers: { location: back.toString() } });
  });
  await page.route(`${DUCKER.issuer}/oauth/token`, async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { ...CORS, "access-control-allow-methods": "POST" } });
      return;
    }
    tokenCalls.push(new URLSearchParams(postData(route.request())));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: CORS,
      body: JSON.stringify({ access_token: "at-1", token_type: "Bearer", expires_in: 900 }),
    });
  });
  await page.route(`${DUCKER.issuer}/oauth/userinfo`, (route) =>
    route.request().method() === "OPTIONS"
      ? route.fulfill({ status: 204, headers: { ...CORS, "access-control-allow-methods": "GET" } })
      : route.fulfill({ status: 200, contentType: "application/json", headers: CORS, body: JSON.stringify(DUCKER.user) }),
  );
  return { authorize: () => authorize, tokenCalls: () => tokenCalls };
}

function postData(request: Request): string {
  return request.postData() ?? "";
}

export const test = core.extend<{ fakeIssuer: (mode?: IssuerMode) => Promise<FakeIssuer> }>({
  fakeIssuer: async ({ page }, use) => use((mode = "ok") => install(page, mode)),
});
