import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { PLANNED_SETTINGS } from "@/data/test-data";

// FR-13, FR-14 · NFR-REL-01 · ADR-0017: pausing by hand, the automatic pause when the tab goes away, and the rule that
// a dialog opened mid-round pauses it and closing that dialog gives the round back.

test("nút Pause mở hộp Paused với Resume/Settings/High scores/Restart và đồng hồ đứng yên", { tag: ["@TC-PAUSE-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await gamePage.advance(2000);
  await gamePage.click(gamePage.pauseButton());
  await gamePage.settle();

  const paused = gamePage.paused;
  await expect(paused.dialog()).toBeVisible();
  for (const name of [copy.action.resume, copy.action.settings, copy.action.highScores, copy.action.restart]) {
    await expect(paused.button(name)).toBeVisible();
  }
  await expect(paused.button(copy.action.resume)).toBeFocused();

  const time = await gamePage.stat(copy.hud.time).textContent();
  await gamePage.advance(5000);
  await expect(gamePage.stat(copy.hud.time)).toHaveText(time!);
});

test("Esc tạm dừng, Resume (hoặc Enter trên Resume) chơi tiếp và đồng hồ chạy lại", { tag: ["@TC-PAUSE-002", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await gamePage.advance(2000);
  await gamePage.key("Escape");
  await gamePage.settle();
  await expect(gamePage.paused.dialog()).toBeVisible();

  // focus sits on Resume, so Enter resumes from the keyboard
  await gamePage.page.keyboard.press("Enter");
  await gamePage.settle();
  await expect(gamePage.paused.dialog()).toBeHidden();
  await gamePage.advance(3000);
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:05");

  await gamePage.click(gamePage.pauseButton());
  await gamePage.settle();
  await gamePage.click(gamePage.paused.button(copy.action.resume));
  await gamePage.settle();
  await expect(gamePage.paused.dialog()).toBeHidden();
});

test("phím chơi không có tác dụng khi đang tạm dừng", { tag: ["@TC-PAUSE-003"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.click(gamePage.pauseButton());
  await gamePage.settle();
  const queue = await gamePage.nextLetters();

  // focus away from Resume, so the keys reach the game and not the focused button
  await gamePage.blur();
  for (const key of ["Space", "ShiftLeft", "ArrowLeft"]) await gamePage.key(key);
  await gamePage.settle();
  expect(await gamePage.score()).toBe(0);
  expect(await gamePage.holdFilledCells()).toBe(0);
  expect(await gamePage.nextLetters()).toEqual(queue);
});

test("tab bị ẩn thì ván tự tạm dừng và vẫn dừng khi quay lại cho tới khi bấm Resume", { tag: ["@TC-PAUSE-004", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await gamePage.advance(2000);
  await gamePage.hideTab();
  await gamePage.advance(3000);
  await gamePage.showTab();
  await gamePage.settle();

  await expect(gamePage.paused.dialog()).toBeVisible();
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:02");
  await gamePage.advance(3000);
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:02");

  await gamePage.click(gamePage.paused.button(copy.action.resume));
  await gamePage.advance(2000);
  await expect(gamePage.stat(copy.hud.time)).not.toHaveText("00:02");
});

test("mở Cài đặt hay Điểm cao giữa ván thì ván dừng; đóng lại thì ván chạy tiếp, không hiện hộp Paused", { tag: ["@TC-PAUSE-005"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await gamePage.advance(2000);

  // Ten seconds pass under each dialog; the round's clock may only move by the second it ran before and after.
  let before = await gamePage.seconds();
  await gamePage.click(gamePage.settingsButton());
  await gamePage.settle();
  await expect(gamePage.settings.dialog()).toBeVisible();
  await expect(gamePage.paused.dialog()).toBeHidden();
  await gamePage.advance(10_000);
  await gamePage.click(gamePage.settings.doneButton());
  await gamePage.settle();
  await expect(gamePage.paused.dialog()).toBeHidden();
  expect((await gamePage.seconds()) - before).toBeLessThanOrEqual(2);
  before = await gamePage.seconds();
  await gamePage.advance(3000);
  expect((await gamePage.seconds()) - before).toBeGreaterThanOrEqual(2);

  before = await gamePage.seconds();
  await gamePage.click(gamePage.highScoresButton());
  await gamePage.settle();
  await expect(gamePage.scores.dialog()).toBeVisible();
  await gamePage.advance(10_000);
  await gamePage.click(gamePage.scores.closeButton());
  await gamePage.settle();
  await expect(gamePage.paused.dialog()).toBeHidden();
  expect((await gamePage.seconds()) - before).toBeLessThanOrEqual(2);
  before = await gamePage.seconds();
  await gamePage.advance(3000);
  expect((await gamePage.seconds()) - before).toBeGreaterThanOrEqual(2);
});

test("mở Cài đặt từ hộp Paused rồi đóng thì quay về hộp Paused, ván vẫn dừng", { tag: ["@TC-PAUSE-006"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.advance(2000);
  await gamePage.click(gamePage.pauseButton());
  await gamePage.settle();
  await gamePage.click(gamePage.paused.button(copy.action.settings));
  await gamePage.settle();
  await expect(gamePage.settings.dialog()).toBeVisible();
  await expect(gamePage.paused.dialog()).toBeHidden();

  await gamePage.click(gamePage.settings.closeButton());
  await gamePage.settle();
  await expect(gamePage.paused.dialog()).toBeVisible();
  await gamePage.advance(3000);
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:02");
});

test("Restart trong hộp Paused bỏ ván đang chơi, bắt đầu ván mới và không lưu ván cũ vào điểm cao", { tag: ["@TC-PAUSE-007"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await gamePage.key("Space");
  await gamePage.advance(3000);
  expect(await gamePage.score()).toBeGreaterThan(0);

  await gamePage.click(gamePage.pauseButton());
  await gamePage.settle();
  await gamePage.click(gamePage.paused.button(copy.action.restart));
  await gamePage.settle();

  await expect(gamePage.paused.dialog()).toBeHidden();
  await expect(gamePage.topValue(copy.hud.score)).toHaveText("0");
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:00");
  expect(await gamePage.stored("scores")).toBeNull();
});
