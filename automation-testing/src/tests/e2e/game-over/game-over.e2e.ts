import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// FR-12, FR-31, FR-32 · US-03: the round ends when the stack reaches the top, the end-of-round stats, play again, and
// the round being recorded exactly once.

test("chồng khối chạm đỉnh thì hết ván: hộp Game over báo lý do và chỉ số cuối ván khớp HUD", { tag: ["@TC-GAMEOVER-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await gamePage.topOut();
  await gamePage.settle();

  const over = gamePage.gameOver;
  await expect(over.dialog()).toBeVisible();
  await expect(over.dialog()).toContainText(copy.modal.blockOut);
  await expect(over.stat(copy.hud.score)).toHaveText(await gamePage.topValue(copy.hud.score).innerText());
  await expect(over.stat(copy.hud.lines)).toHaveText("0");
  await expect(over.stat(copy.hud.level)).toHaveText("1");
  await expect(over.stat(copy.hud.time)).toHaveText(/^\d\d:\d\d$/);
  await expect(over.stat(copy.hud.pps)).toHaveText(/^\d+\.\d\d$/);
  await expect(over.button(copy.action.playAgain)).toBeFocused();
});

test("Play again bắt đầu ván mới từ 0 và phím lại điều khiển được khối", { tag: ["@TC-GAMEOVER-002", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.topOut();
  await gamePage.settle();
  await gamePage.click(gamePage.gameOver.button(copy.action.playAgain));
  await gamePage.settle();

  await expect(gamePage.gameOver.dialog()).toBeHidden();
  await expect(gamePage.topValue(copy.hud.score)).toHaveText("0");
  await expect(gamePage.topValue(copy.hud.lines)).toHaveText("0");
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:00");

  await gamePage.key("Space");
  await gamePage.settle();
  expect(await gamePage.score()).toBeGreaterThan(0);
});

test("ván vừa hết được lưu đúng một lần vào bảng của độ khó đang chơi", { tag: ["@TC-GAMEOVER-003", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.topOut();
  // the HUD keeps republishing; the round must still be written once
  await gamePage.advance(3000);

  const board = await gamePage.storedJson<{ boards: Record<string, { score: number }[]> }>("scores");
  expect(board?.boards.normal).toHaveLength(1);
  expect(board?.boards.normal?.[0]?.score).toBe(await gamePage.score());
  for (const other of ["easy", "hard", "custom"]) expect(board?.boards[other]).toHaveLength(0);
});

test("High scores từ hộp Game over đánh dấu ván vừa chơi và có Play again", { tag: ["@TC-GAMEOVER-004"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.topOut();
  await gamePage.settle();
  const score = await gamePage.topValue(copy.hud.score).innerText();

  await gamePage.click(gamePage.gameOver.button(copy.action.highScores));
  await gamePage.settle();
  const scores = gamePage.scores;
  await expect(scores.dialog()).toBeVisible();
  await expect(scores.rows()).toHaveCount(1);
  await expect(scores.rows().first()).toHaveAttribute("aria-current", "true");
  await expect(scores.rows().first()).toContainText(score);

  await gamePage.click(scores.playAgain());
  await gamePage.settle();
  await expect(scores.dialog()).toBeHidden();
  await expect(gamePage.topValue(copy.hud.score)).toHaveText("0");
  await expect(gamePage.gameOver.dialog()).toBeHidden();
});

test("sau khi hết ván, phím chơi không đổi điểm hay khối", { tag: ["@TC-GAMEOVER-005"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.topOut();
  await gamePage.settle();
  const score = await gamePage.score();

  // focus away from Play again, so the keys reach the game and not the focused button
  await gamePage.blur();
  for (const key of ["Space", "ArrowDown", "ShiftLeft"]) await gamePage.key(key);
  await gamePage.settle();
  expect(await gamePage.score()).toBe(score);
  await expect(gamePage.gameOver.dialog()).toBeVisible();
});
