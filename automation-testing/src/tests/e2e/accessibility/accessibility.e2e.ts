import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { PLAN_LINES, PLANNED_SETTINGS } from "@/data/test-data";

// FR-26 · NFR-A11Y-02, NFR-A11Y-04, NFR-A11Y-05, NFR-A11Y-06 · ADR-0017: keyboard-operable dialogs, a game that gives
// the keyboard up while a dialog is open, pieces told apart without colour, reduced motion, named controls.

test("hộp Cài đặt: focus vào nút đóng, Tab quay vòng trong hộp, Esc đóng và trả focus về nút Settings", { tag: ["@TC-ACCESSIBILITY-001", "@smoke"] }, async ({
  gamePage,
  page,
}) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.settingsButton().focus();
  await page.keyboard.press("Enter");
  await gamePage.settle();
  const s = gamePage.settings;
  await expect(s.closeButton()).toBeFocused();

  // Shift+Tab off the first control wraps to the last one, Tab off the last wraps back
  await page.keyboard.press("Shift+Tab");
  await expect(s.resetButton()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(s.closeButton()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(s.dialog()).toBeHidden();
  await expect(gamePage.settingsButton()).toBeFocused();
});

test("khi hộp thoại đang mở, phím gõ vào ô tên không điều khiển game", { tag: ["@TC-ACCESSIBILITY-002"] }, async ({ gamePage, page }) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.highScoresButton());
  await expect(gamePage.scores.closeButton()).toBeFocused();
  const field = gamePage.scores.nickname();
  await field.focus();
  await page.keyboard.type("Ann Le");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.type("x");
  await expect(field).toHaveValue("Ann xLe");

  await gamePage.click(gamePage.scores.closeButton());
  await gamePage.settle();
  expect(await gamePage.score()).toBe(0);
  expect(await gamePage.holdFilledCells()).toBe(0);
});

test("chế độ không dựa vào màu in chữ cái của khối ở Hold và Next; tắt thì không có chữ", { tag: ["@TC-ACCESSIBILITY-003", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS, colorBlindMode: false } });
  await gamePage.key("ShiftLeft");
  await gamePage.settle();
  expect(await gamePage.nextLetters()).toEqual(["", "", "", "", ""]);
  expect(await gamePage.holdLetter()).toBe("");
  expect(await gamePage.holdFilledCells()).toBe(4);

  await gamePage.click(gamePage.settingsButton());
  await gamePage.click(gamePage.settings.toggle(copy.settings.colorBlind));
  await gamePage.click(gamePage.settings.doneButton());
  await gamePage.settle();
  expect((await gamePage.nextLetters()).every((l) => /^[IJLOSTZ]$/.test(l))).toBe(true);
  expect(await gamePage.holdLetter()).toBe("I");
});

test("prefers-reduced-motion: điểm nhảy thẳng tới giá trị mới, không đếm dần", { tag: ["@TC-ACCESSIBILITY-004"] }, async ({ gamePage, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.key("Space");
  // one HUD publish (~100ms) later the value is final; a count-up would still be on its way (it runs ~260ms)
  await gamePage.advance(120);
  await expect(gamePage.topValue(copy.hud.score)).toHaveText(String(2 * PLAN_LINES.cells[0]!));
});

test("mọi nút ở thanh trên và bàn chơi đều có tên đọc được", { tag: ["@TC-ACCESSIBILITY-005"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await expect(gamePage.board()).toBeVisible();
  for (const button of [gamePage.pauseButton(), gamePage.highScoresButton(), gamePage.settingsButton(), gamePage.languageButton()]) {
    await expect(button).toBeVisible();
  }
  await gamePage.click(gamePage.settingsButton());
  for (const action of [copy.action.left, copy.action.right, copy.action.softDrop, copy.action.hardDrop, copy.action.rotCCW, copy.action.rotCW, copy.action.hold, copy.action.pause]) {
    await expect(gamePage.settings.rebindButton(action)).toBeVisible();
  }
  for (const name of ["DAS", "ARR", copy.settings.volume]) await expect(gamePage.settings.slider(name)).toBeVisible();
});
