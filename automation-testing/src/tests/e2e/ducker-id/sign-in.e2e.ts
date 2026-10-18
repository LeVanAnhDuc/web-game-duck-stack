import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { DUCKER } from "@/data/test-data";

// FR-45 · US-04 · ADR-0018: optional Ducker ID sign-in (OIDC Authorization Code + PKCE, public client), identity only.
// Runs in the app-auth project against the flag-on build, with a fake issuer (fixtures/issuer.fixture.ts). Real time:
// the requests use AbortSignal.timeout, which the fake clock does not drive.

test("bật cờ và chưa đăng nhập: thanh trên có nút Sign in bấm được", { tag: ["@TC-DUCKERID-002"] }, async ({ gamePage }) => {
  await gamePage.goto({ time: null, settings: { schemaVersion: 1, locale: "en" } });
  await expect(gamePage.signInButton()).toBeEnabled();
  await expect(gamePage.accountButton()).toHaveCount(0);
});

test("Sign in đi qua Ducker ID bằng PKCE S256 rồi quay về game đã đăng nhập, hiện tên, email và link hồ sơ", { tag: ["@TC-DUCKERID-003", "@smoke"] }, async ({
  gamePage,
  fakeIssuer,
  page,
}) => {
  const issuer = await fakeIssuer("ok");
  await gamePage.goto({ time: null, settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.signInButton().click();
  await expect(gamePage.accountButton()).toBeVisible();

  const authorize = issuer.authorize()!;
  const origin = new URL(page.url()).origin;
  expect(authorize.searchParams.get("response_type")).toBe("code");
  expect(authorize.searchParams.get("client_id")).toBe(DUCKER.clientId);
  expect(authorize.searchParams.get("redirect_uri")).toBe(`${origin}/`);
  expect(authorize.searchParams.get("code_challenge_method")).toBe("S256");
  expect(authorize.searchParams.get("code_challenge")).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(authorize.searchParams.get("state")).toBeTruthy();

  const [token] = issuer.tokenCalls();
  expect(token?.get("grant_type")).toBe("authorization_code");
  expect(token?.get("code")).toBe("code-1");
  expect(token?.get("code_verifier")).toMatch(/^[A-Za-z0-9_-]{43,128}$/);
  expect(token?.has("client_secret")).toBe(false);
  // the callback parameters are gone from the address bar
  expect(new URL(page.url()).search).toBe("");

  await gamePage.accountButton().click();
  const account = gamePage.account;
  await expect(account.dialog()).toContainText(DUCKER.user.name);
  await expect(account.dialog()).toContainText(DUCKER.user.email);
  await expect(account.profileLink()).toHaveAttribute("href", `${DUCKER.issuer}/profile`);
  await expect(account.profileLink()).toHaveAttribute("target", "_blank");
});

test("Sign out đưa về trạng thái chưa đăng nhập mà không tải lại ván", { tag: ["@TC-DUCKERID-004"] }, async ({ gamePage, fakeIssuer }) => {
  await fakeIssuer("ok");
  await gamePage.goto({ time: null, settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.signInButton().click();
  await gamePage.accountButton().click();
  await gamePage.account.signOut().click();

  await expect(gamePage.account.dialog()).toBeHidden();
  await expect(gamePage.signInButton()).toBeEnabled();
  await expect(gamePage.signInButton()).toBeFocused();
});

test("người dùng từ chối ở Ducker ID thì quay về game vẫn chưa đăng nhập, không gọi token", { tag: ["@TC-DUCKERID-005"] }, async ({
  gamePage,
  fakeIssuer,
  page,
}) => {
  const issuer = await fakeIssuer("deny");
  await gamePage.goto({ time: null, settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.signInButton().click();
  await page.waitForURL((url) => url.search === "");
  await expect(gamePage.signInButton()).toBeEnabled();
  expect(issuer.tokenCalls()).toHaveLength(0);
});

test("state trả về bị sửa thì không đổi code lấy token và vẫn chưa đăng nhập", { tag: ["@TC-DUCKERID-006"] }, async ({
  gamePage,
  fakeIssuer,
  page,
}) => {
  const issuer = await fakeIssuer("tamper");
  await gamePage.goto({ time: null, settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.signInButton().click();
  await page.waitForURL((url) => url.search === "");
  await expect(gamePage.signInButton()).toBeEnabled();
  expect(issuer.tokenCalls()).toHaveLength(0);
});

test("menu tài khoản: focus vào nút đóng, Esc đóng menu, trả focus về avatar và không lọt thành phím tạm dừng", { tag: ["@TC-DUCKERID-007"] }, async ({
  gamePage,
  fakeIssuer,
  page,
}) => {
  await fakeIssuer("ok");
  await gamePage.goto({ time: null, settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.signInButton().click();
  await gamePage.accountButton().click();
  await expect(gamePage.account.dialog()).toBeVisible();
  await expect(gamePage.account.close()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(gamePage.account.dialog()).toBeHidden();
  await expect(gamePage.accountButton()).toBeFocused();
  // Escape did not leak through as "pause"
  await expect(gamePage.paused.dialog()).toBeHidden();
  await expect(gamePage.topValue(copy.hud.score)).toBeVisible();
});
