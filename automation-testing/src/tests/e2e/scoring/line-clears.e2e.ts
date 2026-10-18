import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { PLAN_LINES, PLAN_TETRIS, PLANNED_SETTINGS } from "@/data/test-data";

// FR-10, FR-11, FR-20, FR-21, FR-31, FR-41 · US-01: Guideline points for line clears, a level every ten lines, combo
// and back-to-back, and the time / PPS counters. The planned rounds come from data/test-data.ts; the expected points
// come from the Guideline table in the requirements, never from the game.

/** Guideline base points for a clear of n rows (REQ-SCORING-01). */
const BASE: Record<number, number> = { 1: 100, 2: 300, 3: 500, 4: 800 };

/** Hard-drop points for pieces [0, to): 2 per cell travelled (FR-07). */
function dropPoints(cells: readonly number[], to: number): number {
  return cells.slice(0, to).reduce((sum, c) => sum + 2 * c, 0);
}

test("xoá 1 hàng ở cấp 1 được 100 điểm và bộ đếm Lines tăng 1", { tag: ["@TC-SCORING-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.play(PLAN_LINES.keys, 0, 4);
  expect(await gamePage.lines()).toBe(0);
  expect(await gamePage.score()).toBe(dropPoints(PLAN_LINES.cells, 4));

  await gamePage.play(PLAN_LINES.keys, 4, 5); // piece 4 completes the bottom row
  expect(await gamePage.lines()).toBe(1);
  expect(await gamePage.score()).toBe(dropPoints(PLAN_LINES.cells, 5) + BASE[1]!);
});

test("xoá 2 và 3 hàng cùng lúc được 300 và 500 điểm", { tag: ["@TC-SCORING-002"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.play(PLAN_LINES.keys, 0, 11); // singles at pieces 4 and 7, a double at piece 10
  expect(await gamePage.lines()).toBe(4);
  expect(await gamePage.score()).toBe(dropPoints(PLAN_LINES.cells, 11) + 2 * BASE[1]! + BASE[2]!);

  await gamePage.play(PLAN_LINES.keys, 11, 28); // singles at 14 and 17, a triple at 27
  expect(await gamePage.lines()).toBe(9);
  expect(await gamePage.score()).toBe(dropPoints(PLAN_LINES.cells, 28) + 4 * BASE[1]! + BASE[2]! + BASE[3]!);
});

test("đủ 10 hàng thì lên cấp 2, và điểm xoá hàng nhân theo cấp", { tag: ["@TC-SCORING-003", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.play(PLAN_LINES.keys, 0, 28);
  expect(await gamePage.level()).toBe(1);

  await gamePage.play(PLAN_LINES.keys, 28, 29); // the tenth line
  expect(await gamePage.lines()).toBe(10);
  await expect(gamePage.topValue(copy.hud.level)).toHaveText("2");
});

test("xoá hàng liên tiếp hiện Combo ×1 và cộng 50 × combo × cấp; khối không xoá thì combo tắt", { tag: ["@TC-SCORING-004"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.play(PLAN_LINES.keys, 0, 28);
  const before = await gamePage.score();
  await expect(gamePage.stat(copy.hud.combo)).toBeHidden();

  await gamePage.play(PLAN_LINES.keys, 28, 29); // second clear in a row
  await expect(gamePage.stat(copy.hud.combo)).toHaveText("×1");
  // a single at level 1 (the level the clear happened on) + combo 1 × 50 × level 1 + the drop
  expect(await gamePage.score()).toBe(before + BASE[1]! + 50 + 2 * PLAN_LINES.cells[28]!);

  await gamePage.play(PLAN_LINES.keys, 29, 30); // no clear
  await expect(gamePage.stat(copy.hud.combo)).toBeHidden();
});

test("tetris được 800 điểm và bật Back-to-back; tetris kế tiếp được nhân 1,5", { tag: ["@TC-SCORING-005"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.play(PLAN_TETRIS.keys, 0, 13);
  await expect(gamePage.stat(copy.hud.b2b)).toBeHidden();

  await gamePage.play(PLAN_TETRIS.keys, 13, 14); // the I into the open column
  expect(await gamePage.lines()).toBe(4);
  expect(await gamePage.score()).toBe(dropPoints(PLAN_TETRIS.cells, 14) + BASE[4]!);
  await expect(gamePage.stat(copy.hud.b2b)).toBeVisible();

  await gamePage.play(PLAN_TETRIS.keys, 14, 28); // the second tetris, back to back
  expect(await gamePage.lines()).toBe(8);
  expect(await gamePage.score()).toBe(dropPoints(PLAN_TETRIS.cells, 28) + BASE[4]! + BASE[4]! * 1.5);
});

test("Time đếm thời gian chơi và PPS là số khối mỗi giây, hai chữ số thập phân", { tag: ["@TC-SCORING-006"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.advance(9800);
  await expect(gamePage.stat(copy.hud.pps)).toHaveText("0.00");
  await gamePage.key("Space");
  await gamePage.settle();
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:10");
  // one piece in ~10.5 s of play
  await expect(gamePage.stat(copy.hud.pps)).toHaveText(/^0\.(09|10)$/);

  await gamePage.advance(20_000);
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:30");
});
