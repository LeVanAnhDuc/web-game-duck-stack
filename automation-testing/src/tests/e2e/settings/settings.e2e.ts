import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { STORAGE } from "@/data/test-data";

// FR-23…FR-30, FR-42…FR-44 · US-02 · ADR-0013: the settings screen — difficulty and custom speed, DAS/ARR, rebinding
// with the hint bar following it, display and sound toggles, reset, and settings that survive a reload.

test("Cài đặt mở với giá trị mặc định: Normal, DAS 8, ARR 2, bóng đáp bật, chữ cái tắt, âm thanh bật", { tag: ["@TC-SETTINGS-001"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;
  await expect(s.dialog()).toBeVisible();

  await expect(s.option(copy.settings.normal)).toHaveAttribute("aria-pressed", "true");
  for (const other of [copy.settings.easy, copy.settings.hard, copy.settings.custom]) {
    await expect(s.option(other)).toHaveAttribute("aria-pressed", "false");
  }
  await expect(s.slider(copy.settings.fallSpeed)).toHaveCount(0);
  await expect(s.rowHint("DAS")).toHaveText(copy.settings.dasHint(8, 133));
  await expect(s.rowHint("ARR")).toHaveText(copy.settings.arrHint(2, 33));
  await expect(s.toggle(copy.settings.ghost)).toHaveAttribute("aria-checked", "true");
  await expect(s.toggle(copy.settings.colorBlind)).toHaveAttribute("aria-checked", "false");
  await expect(s.toggle(copy.settings.smoothHorizontal)).toHaveAttribute("aria-checked", "true");
  await expect(s.toggle(copy.settings.sound)).toHaveAttribute("aria-checked", "true");
  await expect(s.slider(copy.settings.volume)).toBeEnabled();
});

test("chọn Custom hiện thanh tốc độ rơi 0,25…20 ô/giây, gợi ý đổi theo giá trị", { tag: ["@TC-SETTINGS-002"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;
  await gamePage.click(s.option(copy.settings.custom));
  await expect(s.option(copy.settings.custom)).toHaveAttribute("aria-pressed", "true");

  const speed = s.slider(copy.settings.fallSpeed);
  await expect(speed).toHaveAttribute("min", "0.25");
  await expect(speed).toHaveAttribute("max", "20");
  await expect(s.rowHint(copy.settings.fallSpeed)).toHaveText(copy.settings.fallSpeedHint("1"));

  await speed.focus();
  await gamePage.page.keyboard.press("End");
  await expect(s.rowHint(copy.settings.fallSpeed)).toHaveText(copy.settings.fallSpeedHint("20"));
  await gamePage.page.keyboard.press("Home");
  await expect(s.rowHint(copy.settings.fallSpeed)).toHaveText(copy.settings.fallSpeedHint("0.25"));
  await gamePage.page.keyboard.press("ArrowRight");
  await expect(s.rowHint(copy.settings.fallSpeed)).toHaveText(copy.settings.fallSpeedHint("0.5"));

  // back to a preset hides the custom speed again
  await gamePage.click(s.option(copy.settings.hard));
  await expect(speed).toHaveCount(0);
});

test("DAS 0…20 và ARR 0…10 tick, gợi ý đổi cả tick lẫn mili-giây", { tag: ["@TC-SETTINGS-003"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;

  await s.slider("DAS").focus();
  await gamePage.page.keyboard.press("Home");
  await expect(s.rowHint("DAS")).toHaveText(copy.settings.dasHint(0, 0));
  await gamePage.page.keyboard.press("End");
  await expect(s.rowHint("DAS")).toHaveText(copy.settings.dasHint(20, 333));

  await s.slider("ARR").focus();
  await gamePage.page.keyboard.press("Home");
  await expect(s.rowHint("ARR")).toHaveText(copy.settings.arrHint(0, 0));
  await gamePage.page.keyboard.press("End");
  await expect(s.rowHint("ARR")).toHaveText(copy.settings.arrHint(10, 167));
});

test("đổi phím Hard drop sang F: nút hiện F, thanh gợi ý hiện F, Space thôi thả còn F thì thả", { tag: ["@TC-SETTINGS-004", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await expect(gamePage.hintKey(copy.hint.hardDrop)).toHaveText("Space");
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;

  const rebind = s.rebindButton(copy.action.hardDrop);
  await expect(rebind).toHaveText("Space");
  await gamePage.click(rebind);
  await expect(rebind).toHaveText(copy.settings.pressKey);
  await gamePage.page.keyboard.press("KeyF");
  await expect(rebind).toHaveText("F");
  await gamePage.click(s.doneButton());
  await gamePage.settle();

  await expect(gamePage.hintKey(copy.hint.hardDrop)).toHaveText("F");
  // Closing hands focus back to the Settings button, where an unbound Space would press it: play from the page.
  await gamePage.blur();
  await gamePage.key("Space");
  await gamePage.settle();
  expect(await gamePage.score()).toBe(0);
  await gamePage.key("KeyF");
  await gamePage.settle();
  expect(await gamePage.score()).toBeGreaterThan(0);
});

test("gán một phím đang thuộc hành động khác thì báo trùng và giữ nguyên phím cũ", { tag: ["@TC-SETTINGS-005"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;

  const rebind = s.rebindButton(copy.action.hardDrop);
  await gamePage.click(rebind);
  await gamePage.page.keyboard.press("KeyZ");
  await expect(s.status()).toHaveText(copy.settings.alreadyBound(`Z → ${copy.action.rotCCW}`));
  await expect(s.rebindButton(copy.action.rotCCW)).toHaveText("Z");

  // still capturing: Esc cancels and leaves Space in place, and the dialog stays open
  await gamePage.page.keyboard.press("Escape");
  await expect(rebind).toHaveText("Space");
  await expect(s.dialog()).toBeVisible();
});

test("tắt Sound effects thì thanh Volume bị khoá; bật lại thì mở", { tag: ["@TC-SETTINGS-006"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;
  await gamePage.click(s.toggle(copy.settings.sound));
  await expect(s.toggle(copy.settings.sound)).toHaveAttribute("aria-checked", "false");
  await expect(s.slider(copy.settings.volume)).toBeDisabled();
  await gamePage.click(s.toggle(copy.settings.sound));
  await expect(s.slider(copy.settings.volume)).toBeEnabled();
});

test("thiết lập còn nguyên sau khi tải lại trang", { tag: ["@TC-SETTINGS-007", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;
  await gamePage.click(s.option(copy.settings.hard));
  await gamePage.click(s.toggle(copy.settings.ghost));
  await gamePage.click(s.toggle(copy.settings.colorBlind));
  await s.slider("ARR").focus();
  await gamePage.page.keyboard.press("Home");
  await gamePage.click(s.doneButton());

  await gamePage.reload();
  await gamePage.click(gamePage.settingsButton());
  await expect(s.option(copy.settings.hard)).toHaveAttribute("aria-pressed", "true");
  await expect(s.toggle(copy.settings.ghost)).toHaveAttribute("aria-checked", "false");
  await expect(s.toggle(copy.settings.colorBlind)).toHaveAttribute("aria-checked", "true");
  await expect(s.rowHint("ARR")).toHaveText(copy.settings.arrHint(0, 0));

  const saved = await gamePage.storedJson("settings");
  expect(saved).toMatchObject({ schemaVersion: 1, difficulty: "hard", ghost: false, colorBlindMode: true, arr: 0 });
});

test("Reset to defaults trả mọi thứ về mặc định, kể cả phím đã đổi, và lưu lại", { tag: ["@TC-SETTINGS-008"] }, async ({ gamePage }) => {
  await gamePage.goto({
    settings: {
      schemaVersion: 1,
      locale: "en",
      difficulty: "custom",
      customCellsPerSecond: 5,
      das: 3,
      ghost: false,
      sound: false,
      bindings: { KeyF: "hardDrop", ArrowLeft: "left", ArrowRight: "right" },
    },
  });
  await expect(gamePage.hintKey(copy.hint.hardDrop)).toHaveText("F");
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;
  await gamePage.click(s.resetButton());

  await expect(s.option(copy.settings.normal)).toHaveAttribute("aria-pressed", "true");
  await expect(s.rowHint("DAS")).toHaveText(copy.settings.dasHint(8, 133));
  await expect(s.toggle(copy.settings.ghost)).toHaveAttribute("aria-checked", "true");
  await expect(s.toggle(copy.settings.sound)).toHaveAttribute("aria-checked", "true");
  await expect(s.rebindButton(copy.action.hardDrop)).toHaveText("Space");
  await gamePage.click(s.doneButton());
  await expect(gamePage.hintKey(copy.hint.hardDrop)).toHaveText("Space");

  const saved = await gamePage.storedJson<{ difficulty: string; bindings: Record<string, string> }>("settings");
  expect(saved?.difficulty).toBe("normal");
  expect(saved?.bindings.Space).toBe("hardDrop");
  expect(STORAGE.settings).toBe("tetris.settings.v1");
});

test("Done, nút đóng và Esc đều đóng Cài đặt", { tag: ["@TC-SETTINGS-009"] }, async ({ gamePage }) => {
  await gamePage.goto();
  const s = gamePage.settings;
  // settle() after each open: the pause that opening sends is applied on the game's next frame (decisions Q4)
  await gamePage.click(gamePage.settingsButton());
  await gamePage.settle();
  await gamePage.click(s.doneButton());
  await expect(s.dialog()).toBeHidden();

  await gamePage.click(gamePage.settingsButton());
  await gamePage.settle();
  await gamePage.click(s.closeButton());
  await expect(s.dialog()).toBeHidden();

  await gamePage.click(gamePage.settingsButton());
  await gamePage.settle();
  await gamePage.page.keyboard.press("Escape");
  await expect(s.dialog()).toBeHidden();
  // Escape closed the dialog only: it did not leak through to the game as "pause"
  await gamePage.settle();
  await expect(gamePage.paused.dialog()).toBeHidden();
});
