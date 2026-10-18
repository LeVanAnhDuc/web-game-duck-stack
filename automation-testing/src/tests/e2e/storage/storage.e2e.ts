import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { STORAGE, scoreRow } from "@/data/test-data";

// FR-30 · NFR-REL-02, NFR-REL-03, NFR-REL-05 · ADR-0004: whatever localStorage holds — rubbish, half-valid data, or
// nothing because the browser refuses — the game starts, plays, and says what happened to the saved data.

test("thiết lập lưu bị hỏng: game vẫn chạy với mặc định và Cài đặt báo đã khôi phục", { tag: ["@TC-STORAGE-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto({ raw: { [STORAGE.settings]: "{not json" } });
  await gamePage.key("Space");
  await gamePage.settle();
  expect(await gamePage.score()).toBeGreaterThan(0);

  await gamePage.click(gamePage.settingsButton());
  await expect(gamePage.settings.alert()).toHaveText(copy.settings.storageRecovered);
  await expect(gamePage.settings.option(copy.settings.normal)).toHaveAttribute("aria-pressed", "true");
});

test("trình duyệt chặn localStorage: vẫn chơi trọn ván, Cài đặt và Điểm cao nói rõ không lưu được", { tag: ["@TC-STORAGE-002", "@smoke"] }, async ({
  gamePage,
}) => {
  const errors: string[] = [];
  gamePage.page.on("pageerror", (e) => errors.push(e.message));
  await gamePage.goto({ blockStorage: true });

  await gamePage.click(gamePage.settingsButton());
  await expect(gamePage.settings.alert()).toHaveText(copy.settings.storageUnavailable);
  // a change still applies for this session
  await gamePage.click(gamePage.settings.toggle(copy.settings.ghost));
  await expect(gamePage.settings.toggle(copy.settings.ghost)).toHaveAttribute("aria-checked", "false");
  await gamePage.click(gamePage.settings.doneButton());
  await gamePage.blur();

  await gamePage.topOut();
  await gamePage.settle();
  await expect(gamePage.gameOver.dialog()).toBeVisible();
  await gamePage.click(gamePage.gameOver.button(copy.action.highScores));
  await expect(gamePage.scores.alert()).toHaveText(copy.scores.storageUnavailable);
  // the finished round still shows for this session, it just cannot outlive the tab
  await expect(gamePage.scores.rows()).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("bảng điểm lưu có dòng hỏng: dòng hỏng bị bỏ, dòng lành vẫn hiện, Điểm cao báo đã sửa", { tag: ["@TC-STORAGE-003"] }, async ({
  gamePage,
}) => {
  const board = { schemaVersion: 1, boards: { easy: [], hard: [], custom: [], normal: [scoreRow({ score: 800 }), { nickname: "no score" }] } };
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en" }, scores: board });
  await gamePage.click(gamePage.highScoresButton());
  await expect(gamePage.scores.alert()).toHaveText(copy.scores.storageRecovered);
  await expect(gamePage.scores.rows()).toHaveCount(1);
  await expect(gamePage.scores.rows().first()).toContainText("800");
});

test("giá trị lưu ngoài miền được đưa về mặc định hoặc kẹp vào biên", { tag: ["@TC-STORAGE-004"] }, async ({ gamePage }) => {
  await gamePage.goto({
    settings: { schemaVersion: 1, locale: "en", difficulty: "insane", volume: 5, das: "abc", arr: -4, ghost: "yes" },
  });
  await gamePage.click(gamePage.settingsButton());
  const s = gamePage.settings;
  await expect(s.option(copy.settings.normal)).toHaveAttribute("aria-pressed", "true");
  await expect(s.rowHint(copy.settings.volume)).toHaveText("100%");
  await expect(s.rowHint("DAS")).toHaveText(copy.settings.dasHint(8, 133));
  await expect(s.rowHint("ARR")).toHaveText(copy.settings.arrHint(0, 0));
  await expect(s.toggle(copy.settings.ghost)).toHaveAttribute("aria-checked", "true");
});
