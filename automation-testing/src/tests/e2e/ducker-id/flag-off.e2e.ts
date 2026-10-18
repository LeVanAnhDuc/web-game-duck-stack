import { test, expect } from "@/fixtures";

// FR-45 · ADR-0018: sign-in ships dark. The deployed build (and the dev build that mirrors it) has no sign-in button,
// no account menu, and never talks to Ducker ID.

test("bản deploy tắt cờ: không có nút đăng nhập hay menu tài khoản, không gọi Ducker ID", { tag: ["@TC-DUCKERID-001", "@smoke"] }, async ({
  gamePage,
  page,
}) => {
  const hosts = new Set<string>();
  page.on("request", (r) => hosts.add(new URL(r.url()).host));
  await gamePage.goto();
  await gamePage.advance(2000);

  await expect(gamePage.signInButton()).toHaveCount(0);
  await expect(gamePage.accountButton()).toHaveCount(0);
  expect([...hosts].filter((h) => h.includes("ducker"))).toEqual([]);
});
