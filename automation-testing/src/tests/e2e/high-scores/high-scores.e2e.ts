import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { scoreBoard, scoreRow } from "@/data/test-data";

// FR-32, FR-33, FR-34 · US-03 · ADR-0014 · NFR-SEC-03: one local board per difficulty, ranked and capped, a display
// name that is not an account, the custom-speed caveat, a two-step clear, dates in the chosen language.
test.use({ timezoneId: "UTC" });

test("bảng trống báo chưa có ván nào, nói rõ điểm chỉ lưu trên máy này, nút Clear bị khoá", { tag: ["@TC-HIGHSCORES-001"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.highScoresButton());
  const scores = gamePage.scores;
  await expect(scores.dialog()).toBeVisible();
  await expect(scores.dialog()).toContainText(copy.scores.localOnly);
  await expect(scores.board(copy.settings.normal)).toHaveAttribute("aria-pressed", "true");
  await expect(scores.empty()).toBeVisible();
  await expect(scores.clearButton()).toBeDisabled();
});

test("mở ra ở bảng của độ khó đang chọn, và mỗi độ khó một bảng riêng", { tag: ["@TC-HIGHSCORES-002", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto({
    settings: { schemaVersion: 1, locale: "en", difficulty: "hard" },
    scores: scoreBoard({ easy: [scoreRow({ score: 500 })], hard: [scoreRow({ score: 900 })] }),
  });
  await gamePage.click(gamePage.highScoresButton());
  const scores = gamePage.scores;
  await expect(scores.board(copy.settings.hard)).toHaveAttribute("aria-pressed", "true");
  await expect(scores.list()).toHaveAccessibleName(copy.scores.listLabel(copy.settings.hard));
  await expect(scores.rows()).toHaveCount(1);
  await expect(scores.rows().first()).toContainText("900");

  await gamePage.click(scores.board(copy.settings.easy));
  await expect(scores.rows()).toHaveCount(1);
  await expect(scores.rows().first()).toContainText("500");
  await gamePage.click(scores.board(copy.settings.normal));
  await expect(scores.empty()).toBeVisible();
});

test("xếp hạng theo điểm giảm dần và chỉ giữ 10 dòng", { tag: ["@TC-HIGHSCORES-003"] }, async ({ gamePage }) => {
  const values = [700, 1200, 100, 900, 300, 1100, 200, 1000, 400, 800, 600, 500];
  await gamePage.goto({
    settings: { schemaVersion: 1, locale: "en" },
    scores: scoreBoard({ normal: values.map((score) => scoreRow({ score })) }),
  });
  await gamePage.click(gamePage.highScoresButton());
  const rows = gamePage.scores.rows();
  await expect(rows).toHaveCount(10);
  await expect(rows.first()).toContainText("Rank 1");
  await expect(rows.first()).toContainText("1,200");
  await expect(rows.nth(9)).toContainText("300");
  await expect(gamePage.scores.list()).not.toContainText(/\b(100|200)\b/);
});

test("tên hiển thị được lưu, còn sau khi tải lại, và gắn vào ván kết thúc sau đó; để trống thì hiện Player", { tag: ["@TC-HIGHSCORES-004", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" }, scores: scoreBoard({ normal: [scoreRow({ score: 50 })] }) });
  await gamePage.click(gamePage.highScoresButton());
  const scores = gamePage.scores;
  await expect(scores.rows().first()).toContainText(copy.scores.anon);
  await expect(scores.nickname()).toHaveAttribute("maxlength", "16");

  await scores.nickname().fill("Lan");
  await gamePage.advance(1000); // the field is written after it sits still (debounced)
  expect(await gamePage.stored("identity")).toBe("Lan");
  await gamePage.click(scores.closeButton());

  await gamePage.reload();
  await gamePage.click(gamePage.highScoresButton());
  await expect(scores.nickname()).toHaveValue("Lan");
  await gamePage.click(scores.closeButton());

  await gamePage.topOut();
  await gamePage.settle();
  await gamePage.click(gamePage.gameOver.button(copy.action.highScores));
  await expect(scores.list().locator('[aria-current="true"]')).toContainText("Lan");
});

test("bảng Custom ghi chú không so được với nhau và hiện tốc độ từng dòng; bảng thường thì không", { tag: ["@TC-HIGHSCORES-005"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({
    settings: { schemaVersion: 1, locale: "en", difficulty: "custom", customCellsPerSecond: 2.5 },
    scores: scoreBoard({ custom: [scoreRow({ score: 700, cellsPerSecond: 2.5 })], normal: [scoreRow({ score: 600 })] }),
  });
  await gamePage.click(gamePage.highScoresButton());
  const scores = gamePage.scores;
  await expect(scores.board(copy.settings.custom)).toHaveAttribute("aria-pressed", "true");
  await expect(scores.dialog()).toContainText(copy.scores.customCaveat);
  await expect(scores.rows().first()).toContainText(copy.scores.speedN("2.5"));

  await gamePage.click(scores.board(copy.settings.normal));
  await expect(scores.dialog()).not.toContainText(copy.scores.customCaveat);
  await expect(scores.rows().first()).not.toContainText("cells/s");
});

test("xoá bảng cần bấm hai lần, chỉ xoá bảng đang xem", { tag: ["@TC-HIGHSCORES-006"] }, async ({ gamePage }) => {
  await gamePage.goto({
    settings: { schemaVersion: 1, locale: "en" },
    scores: scoreBoard({ normal: [scoreRow({ score: 600 })], easy: [scoreRow({ score: 400 })] }),
  });
  await gamePage.click(gamePage.highScoresButton());
  const scores = gamePage.scores;

  await gamePage.click(scores.clearButton());
  await expect(scores.alert()).toHaveText(copy.scores.clearWarning);
  await expect(scores.rows()).toHaveCount(1);
  await gamePage.click(scores.confirmClearButton());
  await expect(scores.empty()).toBeVisible();

  await gamePage.click(scores.board(copy.settings.easy));
  await expect(scores.rows()).toHaveCount(1);
  const board = await gamePage.storedJson<{ boards: Record<string, unknown[]> }>("scores");
  expect(board?.boards.normal).toHaveLength(0);
  expect(board?.boards.easy).toHaveLength(1);
});

test("đổi độ khó giữa ván thì ván đó vẫn vào bảng của độ khó lúc bắt đầu; ván sau mới theo độ khó mới", { tag: ["@TC-HIGHSCORES-007"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" } });
  await gamePage.click(gamePage.settingsButton());
  await gamePage.click(gamePage.settings.option(copy.settings.hard));
  await gamePage.click(gamePage.settings.doneButton());
  await gamePage.settle();

  await gamePage.topOut();
  await gamePage.settle();
  let board = await gamePage.storedJson<{ boards: Record<string, unknown[]> }>("scores");
  expect(board?.boards.normal).toHaveLength(1);
  expect(board?.boards.hard).toHaveLength(0);

  await gamePage.click(gamePage.gameOver.button(copy.action.playAgain));
  await gamePage.blur();
  await gamePage.topOut();
  await gamePage.settle();
  board = await gamePage.storedJson<{ boards: Record<string, unknown[]> }>("scores");
  expect(board?.boards.hard).toHaveLength(1);
});

test("thời điểm đạt điểm hiện theo ngôn ngữ đang chọn", { tag: ["@TC-HIGHSCORES-008"] }, async ({ gamePage }) => {
  const at = Date.UTC(2026, 6, 9, 14, 30);
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" }, scores: scoreBoard({ normal: [scoreRow({ score: 12345, at })] }) });
  await gamePage.click(gamePage.highScoresButton());
  const time = gamePage.scores.rows().first().locator("time");
  await expect(time).toHaveText("7/9/26, 2:30 PM");
  await expect(time).toHaveAttribute("datetime", new Date(at).toISOString());
  await gamePage.click(gamePage.scores.closeButton());

  await gamePage.click(gamePage.languageButton());
  await gamePage.click(gamePage.settings.option("VI"));
  await gamePage.page.keyboard.press("Escape");
  await gamePage.click(gamePage.highScoresButton(copy.vi.highScores));
  await expect(time).toHaveText("14:30 9/7/26");
});

test("tên hiển thị chứa thẻ HTML được hiện nguyên chữ, không thành phần tử", { tag: ["@TC-HIGHSCORES-009"] }, async ({ gamePage }) => {
  const markup = '<img src=x onerror="window.__pwned=1">';
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" }, scores: scoreBoard({ normal: [scoreRow({ score: 50, nickname: markup.slice(0, 16) })] }) });
  await gamePage.click(gamePage.highScoresButton());
  const row = gamePage.scores.rows().first();
  await expect(row).toContainText(markup.slice(0, 16));
  await expect(row.locator("img")).toHaveCount(0);
  expect(await gamePage.page.evaluate(() => (window as unknown as { __pwned?: number }).__pwned)).toBeUndefined();
});
