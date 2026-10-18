import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// ADR-0011, ADR-0018 · overview.md Non-Goals (no backend, no server leaderboard) · NFR-REL-05: the production build
// under the GitHub Pages base path loads every asset, sends nothing anywhere while a round is played, and plays a
// round to its end without a single error.

test("bản build dưới /web-game-duck-stack/ tải đủ tài nguyên, tiêu đề là Duck Stack", { tag: ["@TC-DEPLOY-001", "@smoke"] }, async ({
  gamePage,
  page,
}) => {
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await gamePage.goto();
  await expect(page).toHaveTitle(copy.app.title);
  await expect(gamePage.board()).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/web-game-duck-stack/");
  expect(failed).toEqual([]);
});

test("chơi trọn một ván không gửi dữ liệu đi đâu: ngoài font Google không gọi host nào khác, không có request ghi", { tag: ["@TC-DEPLOY-002", "@smoke"] }, async ({ gamePage, page }) => {
  const requests: { url: string; method: string }[] = [];
  page.on("request", (r) => requests.push({ url: r.url(), method: r.method() }));
  await gamePage.goto();
  const origin = new URL(page.url()).origin;
  await gamePage.topOut();
  await gamePage.settle();
  await gamePage.click(gamePage.gameOver.button(copy.action.highScores));
  await expect(gamePage.scores.rows()).toHaveCount(1);
  // The typefaces come from Google Fonts by design (docs/design-system/tetris/MASTER.md); nothing else may leave.
  const FONTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
  const outside = requests.filter(
    (r) => r.url.startsWith("http") && new URL(r.url).origin !== origin && !FONTS.includes(new URL(r.url).host),
  );
  expect(outside).toEqual([]);
  expect(requests.filter((r) => r.method !== "GET")).toEqual([]);
});

test("không có lỗi JavaScript hay lỗi console từ lúc mở trang tới hết ván", { tag: ["@TC-DEPLOY-003"] }, async ({ gamePage, page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await gamePage.goto();
  await gamePage.click(gamePage.settingsButton());
  await gamePage.click(gamePage.settings.doneButton());
  await gamePage.blur();
  await gamePage.topOut();
  await gamePage.settle();
  await gamePage.click(gamePage.gameOver.button(copy.action.playAgain));
  expect(errors).toEqual([]);
});
