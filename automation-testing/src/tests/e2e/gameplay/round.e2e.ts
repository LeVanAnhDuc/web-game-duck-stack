import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { OPENING, PLAN_LINES, PLANNED_SETTINGS } from "@/data/test-data";

// FR-01…FR-07, FR-15 · US-01: a round starts on load; pieces come from a 7-bag through a five-deep queue; hold, soft
// and hard drop, and the default keys. Every round here is seeded by the fake clock (data/test-data.ts START).

test("mở trang là vào ván ngay: bàn 10×20, HUD về 0 và đồng hồ chạy", { tag: ["@TC-GAMEPLAY-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto();
  await expect(gamePage.board()).toBeVisible();
  await expect(gamePage.topValue(copy.hud.score)).toHaveText("0");
  await expect(gamePage.topValue(copy.hud.lines)).toHaveText("0");
  await expect(gamePage.topValue(copy.hud.level)).toHaveText("1");
  await expect(gamePage.paused.dialog()).toBeHidden();

  await gamePage.advance(3000);
  await expect(gamePage.stat(copy.hud.time)).toHaveText("00:03");
});

test("hàng Next hiện đúng 5 khối và dịch lên một ô sau mỗi khối đã đặt", { tag: ["@TC-GAMEPLAY-002", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  expect(await gamePage.nextLetters()).toEqual([...OPENING.next]);

  await gamePage.key("Space");
  await gamePage.settle();
  const after = await gamePage.nextLetters();
  expect(after).toHaveLength(5);
  expect(after.slice(0, 4)).toEqual(OPENING.next.slice(1));
});

test("bảy khối đầu tiên là đủ bảy loại, mỗi loại một lần (7-bag)", { tag: ["@TC-GAMEPLAY-003"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  // Hold reveals the active piece; the swap pulls the next one, so Next then shows pieces 3…7.
  await gamePage.key("ShiftLeft");
  await gamePage.settle();
  const first = await gamePage.holdLetter();
  const queue = await gamePage.nextLetters();
  const seven = [first, OPENING.next[0], ...queue];
  expect(seven).toHaveLength(7);
  expect(new Set(seven)).toEqual(new Set(["I", "J", "L", "O", "S", "T", "Z"]));
});

test("Hold giữ khối đang rơi, chỉ một lần cho mỗi khối, và đổi lại được ở khối sau", { tag: ["@TC-GAMEPLAY-004", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  expect(await gamePage.holdFilledCells()).toBe(0);

  await gamePage.key("ShiftLeft");
  await gamePage.settle();
  expect(await gamePage.holdLetter()).toBe(OPENING.active);
  const queueAfterHold = await gamePage.nextLetters();

  // a second hold on the same piece does nothing
  await gamePage.key("ShiftLeft");
  await gamePage.settle();
  expect(await gamePage.holdLetter()).toBe(OPENING.active);
  expect(await gamePage.nextLetters()).toEqual(queueAfterHold);

  // after the piece is placed, hold swaps again: the new active goes in, the held one comes out (queue untouched)
  await gamePage.key("Space");
  await gamePage.settle();
  const queueBeforeSwap = await gamePage.nextLetters();
  await gamePage.key("ShiftLeft");
  await gamePage.settle();
  expect(await gamePage.holdLetter()).toBe(queueAfterHold[0]);
  expect(await gamePage.nextLetters()).toEqual(queueBeforeSwap);
});

test("thả tức thì chốt khối ngay và cộng 2 điểm mỗi ô đã rơi", { tag: ["@TC-GAMEPLAY-005", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  await gamePage.key("Space");
  await gamePage.settle();
  // The opening I falls the full 20 rows (PLAN_LINES.cells[0]).
  expect(await gamePage.score()).toBe(2 * PLAN_LINES.cells[0]);
  expect(await gamePage.nextLetters()).not.toEqual([...OPENING.next]);
});

test("thả chậm cộng 1 điểm mỗi ô và khối vẫn đáp xuống đáy", { tag: ["@TC-GAMEPLAY-006"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  // Soft drop runs at 20 cells/s here (its floor): hold ↓ long enough for the opening I to travel all 20 rows but
  // not into the next piece, then let lock delay (500ms) lock it.
  await gamePage.holdKey("ArrowDown", 1200);
  await gamePage.advance(1000);
  await gamePage.settle();
  expect(await gamePage.score()).toBe(PLAN_LINES.cells[0]);
  expect(await gamePage.nextLetters()).toEqual([...OPENING.next.slice(1), expect.any(String)]);
});

test("↑ xoay phải giống X, C giữ khối giống Shift, P tạm dừng giống Esc", { tag: ["@TC-GAMEPLAY-007"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  // The first eight planned pieces with every "rotate right" sent as ↑ instead of X: same stack, same two lines.
  const viaUp = PLAN_LINES.keys.slice(0, 8).map((p) => p.replaceAll("C", "U"));
  for (const piece of viaUp) {
    for (const ch of piece) await gamePage.key({ U: "ArrowUp", A: "KeyZ", L: "ArrowLeft", R: "ArrowRight", D: "Space" }[ch]!);
    await gamePage.advance(400);
  }
  await gamePage.settle();
  expect(await gamePage.lines()).toBe(2);

  await gamePage.key("KeyC");
  await gamePage.settle();
  expect(await gamePage.holdFilledCells()).toBe(4);

  await gamePage.key("KeyP");
  await gamePage.settle();
  await expect(gamePage.paused.dialog()).toBeVisible();
});

test("giữ ← thì khối tự lặp sang tận tường (DAS/ARR)", { tag: ["@TC-GAMEPLAY-008"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { ...PLANNED_SETTINGS } });
  // The plan sends the first two pieces to the left wall with three and four taps. Holding ← instead must reach the
  // same wall, so the next three planned pieces still complete the bottom row.
  for (let i = 0; i < 2; i++) {
    await gamePage.holdKey("ArrowLeft", 600);
    await gamePage.key("Space");
    await gamePage.advance(400);
  }
  await gamePage.play(PLAN_LINES.keys, 2, 5);
  expect(await gamePage.lines()).toBe(1);
});
