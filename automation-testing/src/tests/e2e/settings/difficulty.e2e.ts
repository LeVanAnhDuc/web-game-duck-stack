import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// FR-08, FR-42, FR-43 · ADR-0013: the difficulty changes how fast pieces fall, and a change made mid-round applies
// from the next round. Observed without touching a key: a piece that reaches the floor locks on its own and the Next
// queue moves up. At level 1 Normal falls 1 row/s (the opening I needs ~20 s), Hard 1.8 rows/s (~11 s).

test("độ khó quyết định tốc độ rơi, và đổi giữa ván thì áp dụng từ ván sau", { tag: ["@TC-SETTINGS-010"] }, async ({ gamePage }) => {
  await gamePage.goto({ settings: { schemaVersion: 1, locale: "en", colorBlindMode: true, difficulty: "hard" } });
  let opening = await gamePage.nextLetters();
  await gamePage.advance(15_000);
  // Hard: the first piece has landed and locked by itself within 15 s
  expect(await gamePage.nextLetters()).not.toEqual(opening);

  // switch to Normal mid-round: this round keeps its speed, the next one uses Normal
  await gamePage.click(gamePage.pauseButton());
  await gamePage.click(gamePage.paused.button(copy.action.settings));
  await gamePage.click(gamePage.settings.option(copy.settings.normal));
  await gamePage.click(gamePage.settings.closeButton());
  await gamePage.click(gamePage.paused.button(copy.action.restart));
  await gamePage.settle();
  opening = await gamePage.nextLetters();
  await gamePage.advance(15_000);
  // Normal: after the same 15 s the first piece is still falling
  expect(await gamePage.nextLetters()).toEqual(opening);

  // Custom at 20 cells/s: the first piece is down and locked within about 1.5 s
  await gamePage.click(gamePage.pauseButton());
  await gamePage.click(gamePage.paused.button(copy.action.settings));
  await gamePage.click(gamePage.settings.option(copy.settings.custom));
  await gamePage.settings.slider(copy.settings.fallSpeed).focus();
  await gamePage.page.keyboard.press("End");
  await gamePage.click(gamePage.settings.closeButton());
  await gamePage.click(gamePage.paused.button(copy.action.restart));
  await gamePage.settle();
  opening = await gamePage.nextLetters();
  await gamePage.advance(2500);
  expect(await gamePage.nextLetters()).not.toEqual(opening);
});
