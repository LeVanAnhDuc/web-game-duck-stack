import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { OPENING, PLAN_LINES, PLANNED_SETTINGS } from "@/data/test-data";

// FR-16 · NFR-A11Y-03: on a phone the touch band replaces the key hints, its buttons drive the game, and each is a
// target of at least 44×44px. Runs in the app-touch project (Pixel 5: real touch, 393px wide).

const PAD = [
  copy.action.left,
  copy.action.right,
  copy.action.softDrop,
  copy.action.hold,
  copy.action.rotCCW,
  copy.action.rotCW,
  copy.action.hardDrop,
] as const;

test("trên điện thoại có dải nút cảm ứng đủ 7 hành động, không có thanh gợi ý phím", { tag: ["@TC-TOUCH-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await expect(gamePage.touchBand()).toBeVisible();
  for (const name of PAD) await expect(gamePage.touchButton(name)).toBeVisible();
  await expect(gamePage.hints()).toBeHidden();
});

test("chạm Hard drop thả khối và cộng điểm; chạm Hold đưa khối vào ô Hold", { tag: ["@TC-TOUCH-002", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.tap(gamePage.touchButton(copy.action.hold));
  await gamePage.settle();
  expect(await gamePage.holdLetter()).toBe(OPENING.active);

  await gamePage.tap(gamePage.touchButton(copy.action.hardDrop));
  await gamePage.settle();
  expect(await gamePage.score()).toBeGreaterThan(0);
});

test("các nút di chuyển và xoay cảm ứng đặt khối giống hệt bàn phím", { tag: ["@TC-TOUCH-003"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  // The first five planned pieces, played by taps instead of keys, complete the bottom row the same way.
  const BUTTON: Record<string, string> = {
    L: copy.action.left,
    R: copy.action.right,
    C: copy.action.rotCW,
    A: copy.action.rotCCW,
    D: copy.action.hardDrop,
  };
  for (const piece of PLAN_LINES.keys.slice(0, 5)) {
    for (const ch of piece) await gamePage.tap(gamePage.touchButton(BUTTON[ch]!));
    await gamePage.advance(400);
  }
  await gamePage.settle();
  expect(await gamePage.lines()).toBe(1);
});

test("mỗi nút cảm ứng và nút ở thanh trên rộng và cao ít nhất 44px", { tag: ["@TC-TOUCH-004"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  const targets = [...PAD.map((n) => gamePage.touchButton(n)), gamePage.pauseButton(), gamePage.highScoresButton(), gamePage.settingsButton(), gamePage.languageButton()];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test("trên điện thoại, mọi nút và công tắc trong Cài đặt rộng và cao ít nhất 44px", { tag: ["@TC-TOUCH-005"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.tap(gamePage.settingsButton());
  const controls = gamePage.settings.controls();
  const count = await controls.count();
  expect(count).toBeGreaterThan(20);
  for (let i = 0; i < count; i++) {
    const box = await controls.nth(i).boundingBox();
    expect.soft(box?.width, `control ${i}`).toBeGreaterThanOrEqual(44);
    expect.soft(box?.height, `control ${i}`).toBeGreaterThanOrEqual(44);
  }
});
