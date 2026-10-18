import type { Locator, Page } from "@playwright/test";
import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { scoreBoard, scoreRow } from "@/data/test-data";

// US-01 · NFR-A11Y-03 · docs/design-system/tetris/MASTER.md: mobile 375 first (Hold/Next strip above the board, touch
// band), rails from 768, key hints and no touch band from 1024. At every width the board fits and nothing scrolls
// sideways.

const WIDTHS = [
  { tc: "@TC-RESPONSIVE-001", width: 375, height: 667, strip: true, rails: false, touch: true, hints: false },
  { tc: "@TC-RESPONSIVE-002", width: 768, height: 1024, strip: false, rails: true, touch: true, hints: false },
  { tc: "@TC-RESPONSIVE-003", width: 1024, height: 768, strip: false, rails: true, touch: false, hints: true },
  { tc: "@TC-RESPONSIVE-004", width: 1440, height: 900, strip: false, rails: true, touch: false, hints: true },
] as const;

/**
 * Whole box inside the viewport, measured from layout. Not toBeInViewport(): that runs on IntersectionObserver, whose
 * callbacks wait for animation frames the paused fake clock never delivers.
 */
async function fullyVisible(target: Locator, page: Page): Promise<boolean> {
  const box = await target.boundingBox();
  const vp = page.viewportSize();
  if (!box || !vp) return false;
  return box.x >= 0 && box.y >= 0 && box.x + box.width <= vp.width && box.y + box.height <= vp.height;
}

for (const w of WIDTHS) {
  test(`bố cục ở ${w.width}px: đúng các vùng, bàn chơi nằm gọn, không cuộn ngang`, { tag: [w.tc] }, async ({
    gamePage,
    page,
  }) => {
    await page.setViewportSize({ width: w.width, height: w.height });
    await gamePage.goto();

    await expect(gamePage.strip()).toBeVisible({ visible: w.strip });
    await expect(gamePage.rail("left")).toBeVisible({ visible: w.rails });
    await expect(gamePage.rail("right")).toBeVisible({ visible: w.rails });
    await expect(gamePage.touchBand()).toBeVisible({ visible: w.touch });
    await expect(gamePage.hints()).toBeVisible({ visible: w.hints });

    const board = await gamePage.board().boundingBox();
    expect(board).not.toBeNull();
    expect(board!.x).toBeGreaterThanOrEqual(0);
    expect(board!.x + board!.width).toBeLessThanOrEqual(w.width);
    expect(board!.y + board!.height).toBeLessThanOrEqual(w.height);
    expect(board!.height).toBeGreaterThan(board!.width); // 10 × 20 cells: taller than wide

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBe(0);
  });
}

test("điện thoại xoay ngang 667×375: nút hành động của hộp Cài đặt và Điểm cao vẫn tới được và bấm được", { tag: ["@TC-RESPONSIVE-005"] }, async ({
  gamePage,
  page,
}) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });

  await gamePage.click(gamePage.settingsButton());
  const done = gamePage.settings.doneButton();
  // the dialog is taller than the screen, so the overlay scrolls (MASTER.md §7): each action can be scrolled to
  const reset = gamePage.settings.resetButton();
  await reset.scrollIntoViewIfNeeded();
  expect(await fullyVisible(reset, page)).toBe(true);
  await done.scrollIntoViewIfNeeded();
  expect(await fullyVisible(done, page)).toBe(true);
  await gamePage.click(done);
  await expect(gamePage.settings.dialog()).toBeHidden();

  await gamePage.click(gamePage.highScoresButton());
  const close = gamePage.scores.closeAction();
  await close.scrollIntoViewIfNeeded();
  expect(await fullyVisible(close, page)).toBe(true);
  await gamePage.click(close);
  await expect(gamePage.scores.dialog()).toBeHidden();
});

test("hộp Điểm cao ở màn thấp 1396×581 với 10 dòng: nút chọn bảng giữ đủ 44px, danh sách không bị ép, nút đóng cuộn tới được", { tag: ["@TC-RESPONSIVE-006"] }, async ({
  gamePage,
  page,
}) => {
  await page.setViewportSize({ width: 1396, height: 581 });
  await gamePage.goto({
    settings: { schemaVersion: 1, locale: "en" },
    scores: scoreBoard({ normal: Array.from({ length: 10 }, (_, i) => scoreRow({ score: 1000 - i })) }),
  });
  await gamePage.click(gamePage.highScoresButton());
  for (const name of [copy.settings.easy, copy.settings.normal, copy.settings.hard, copy.settings.custom]) {
    const box = await gamePage.scores.board(name).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  const list = await gamePage.scores.list().boundingBox();
  expect(list?.height).toBeGreaterThanOrEqual(128);
  const close = gamePage.scores.closeAction();
  await close.scrollIntoViewIfNeeded();
  expect(await fullyVisible(close, page)).toBe(true);
});
