import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { scoreBoard, scoreRow } from "@/data/test-data";

// FR-28 · NFR-I18N-03 · ADR-0006: English and Vietnamese, detected from the browser, switchable in settings, stored,
// and numbers formatted in the chosen language rather than the machine's.

test.describe("trình duyệt tiếng Việt", () => {
  test.use({ locale: "vi-VN" });

  test("trình duyệt tiếng Việt thì giao diện mở bằng tiếng Việt", { tag: ["@TC-LANGUAGE-001", "@smoke"] }, async ({ gamePage, page }) => {
    await gamePage.goto();
    await expect(gamePage.topValue(copy.vi.hudScore)).toHaveText("0");
    await expect(gamePage.pauseButton(copy.vi.pause)).toBeVisible();
    await expect(gamePage.languageButton()).toHaveText("VI");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("ngôn ngữ đã lưu thắng ngôn ngữ của trình duyệt", { tag: ["@TC-LANGUAGE-004"] }, async ({ gamePage, page }) => {
    await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
    await expect(gamePage.topValue(copy.hud.score)).toHaveText("0");
    await expect(gamePage.languageButton()).toHaveText("EN");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("trình duyệt tiếng Pháp", () => {
  test.use({ locale: "fr-FR" });

  test("ngôn ngữ trình duyệt không hỗ trợ thì dùng tiếng Anh", { tag: ["@TC-LANGUAGE-002"] }, async ({ gamePage, page }) => {
    await gamePage.goto();
    await expect(gamePage.topValue(copy.hud.score)).toHaveText("0");
    await expect(gamePage.languageButton()).toHaveText("EN");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("trình duyệt tiếng Anh", () => {
  test.use({ locale: "en-US" });

  test("nút ngôn ngữ mở Cài đặt; chọn VI đổi giao diện ngay và còn nguyên sau khi tải lại", { tag: ["@TC-LANGUAGE-003", "@smoke"] }, async ({
    gamePage,
    page,
  }) => {
    await gamePage.goto();
    await gamePage.click(gamePage.languageButton());
    await expect(gamePage.settings.dialog()).toBeVisible();
    await gamePage.click(gamePage.settings.option("VI"));
    await expect(gamePage.settings.dialog(copy.vi.settings)).toBeVisible();
    await expect(gamePage.settings.option("VI")).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");

    await expect(gamePage.topValue(copy.vi.hudScore)).toBeVisible();
    await expect(gamePage.topValue(copy.vi.hudLines)).toBeVisible();
    await expect(gamePage.languageButton()).toHaveText("VI");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");

    await gamePage.reload();
    await expect(gamePage.topValue(copy.vi.hudScore)).toBeVisible();
    expect(await gamePage.storedJson("settings")).toMatchObject({ locale: "vi" });
  });

  test("số được định dạng theo ngôn ngữ đang chọn, không theo máy", { tag: ["@TC-LANGUAGE-005"] }, async ({ gamePage, page }) => {
    await gamePage.goto({ settings: { schemaVersion: 1, locale: "vi" }, scores: scoreBoard({ normal: [scoreRow({ score: 12345, pps: 1.25 })] }) });
    await gamePage.click(gamePage.highScoresButton(copy.vi.highScores));
    const row = gamePage.scores.rows().first();
    await expect(row).toContainText("12.345");
    await expect(row).toContainText("1,25");
    await page.keyboard.press("Escape");

    await gamePage.click(gamePage.languageButton());
    await gamePage.click(gamePage.settings.option("EN"));
    await page.keyboard.press("Escape");
    await gamePage.click(gamePage.highScoresButton());
    await expect(row).toContainText("12,345");
    await expect(row).toContainText("1.25");
  });
});
