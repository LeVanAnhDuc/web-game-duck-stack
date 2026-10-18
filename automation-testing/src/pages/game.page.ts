import type { Locator, Page } from "@playwright/test";
import { copy } from "@/data/copy";
import { START, STORAGE } from "@/data/test-data";
import { BasePage } from "./base.page";

/** What to put in localStorage before the game first loads. Written once per test, not again on reload. */
export interface GameSetup {
  /** Raw object stored under tetris.settings.v1 (partial is fine: the game migrates it). */
  settings?: Record<string, unknown>;
  /** Raw object stored under tetris.scores.v1. */
  scores?: unknown;
  /** Raw string stored under tetris.identity.v1. */
  nickname?: string;
  /** Raw text stored instead of JSON, to simulate corrupt storage: key -> text. */
  raw?: Record<string, string>;
  /** Make every localStorage access throw (privacy mode / quota), from the first script on. */
  blockStorage?: boolean;
  /**
   * Fake clock start (default START). The clock is installed and paused one second later, so the round seed is fixed
   * and the game only moves when the test calls advance(). `null` = real time (needed where the app relies on
   * AbortSignal.timeout or real network).
   */
  time?: number | null;
}

/** Key codes the game binds by default (client/src/settings/types.ts DEFAULT_BINDINGS). */
const PLAN_KEY: Record<string, string> = { C: "KeyX", A: "KeyZ", L: "ArrowLeft", R: "ArrowRight", D: "Space" };

/** One frame of the fake clock, rounded up: long enough for the loop to run the tick a key press queued. */
const FRAME_MS = 34;

/**
 * The game is one screen: a canvas board, a HUD around it and dialogs over it. The board itself is pixels, so this
 * page object exposes what the game renders to the DOM from the same state: HUD values, the Hold slot, the Next
 * queue, the dialogs, and the localStorage the game writes.
 */
export class GamePage extends BasePage {
  readonly settings: SettingsDialog;
  readonly scores: ScoresDialog;
  readonly paused: PausedDialog;
  readonly gameOver: GameOverDialog;
  readonly account: AccountDialog;
  private clockInstalled = false;

  constructor(page: Page) {
    super(page);
    this.settings = new SettingsDialog(page);
    this.scores = new ScoresDialog(page);
    this.paused = new PausedDialog(page);
    this.gameOver = new GameOverDialog(page);
    this.account = new AccountDialog(page);
  }

  async goto(setup: GameSetup = {}): Promise<void> {
    await this.page.addInitScript(
      ({ setup, keys }) => {
        // Once per tab: a reload must find what the game saved, not the seed data again.
        if (sessionStorage.getItem("__e2e_seeded") === null) {
          sessionStorage.setItem("__e2e_seeded", "1");
          if (setup.settings) localStorage.setItem(keys.settings, JSON.stringify(setup.settings));
          if (setup.scores !== undefined) localStorage.setItem(keys.scores, JSON.stringify(setup.scores));
          if (setup.nickname !== undefined) localStorage.setItem(keys.identity, setup.nickname);
          for (const [k, v] of Object.entries(setup.raw ?? {})) localStorage.setItem(k, v);
        }
        if (setup.blockStorage) {
          const deny = () => {
            throw new DOMException("blocked", "SecurityError");
          };
          Object.defineProperty(window, "localStorage", { configurable: true, get: deny });
        }
      },
      { setup: { ...setup, time: undefined }, keys: STORAGE },
    );
    const time = setup.time === undefined ? START : setup.time;
    if (time !== null) {
      await this.page.clock.install({ time });
      await this.page.clock.pauseAt(time + 1000);
      this.clockInstalled = true;
    }
    await this.page.goto("./");
    await this.board().waitFor();
    await this.advance(200);
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.board().waitFor();
    await this.advance(200);
  }

  /** Moves the fake clock (and so the game loop, which runs on requestAnimationFrame) forward. */
  async advance(ms: number): Promise<void> {
    if (this.clockInstalled) await this.page.clock.runFor(ms);
  }

  /**
   * Clicks an element of the game while keeping the fake clock moving. Playwright waits for an element to be stable
   * across animation frames before it clicks, and with the clock paused no frame ever comes.
   */
  async click(target: Locator): Promise<void> {
    await this.pumping(target.click());
  }

  /** A finger tap (touch screen projects), with the clock kept moving for the same reason as click(). */
  async tap(target: Locator): Promise<void> {
    await this.pumping(target.tap());
    await this.advance(FRAME_MS);
  }

  private async pumping(action: Promise<void>): Promise<void> {
    let done = false;
    const run = action.finally(() => {
      done = true;
    });
    while (!done && this.clockInstalled) await this.page.clock.runFor(16);
    await run;
  }

  /** Presses a key the way a player does (down + up), then lets the loop run the tick it queued. */
  async key(code: string): Promise<void> {
    await this.page.keyboard.press(code);
    await this.advance(FRAME_MS);
  }

  /** Holds a key down for `ms` of game time, then releases it. */
  async holdKey(code: string, ms: number): Promise<void> {
    await this.page.keyboard.down(code);
    await this.advance(ms);
    await this.page.keyboard.up(code);
    await this.advance(FRAME_MS);
  }

  /** Plays pieces from a plan (see PLAN_LINES in data/test-data.ts). Waits out each drop and any line clear. */
  async play(plan: readonly string[], from = 0, to = plan.length): Promise<void> {
    for (const piece of plan.slice(from, to)) {
      for (const ch of piece) {
        await this.key(PLAN_KEY[ch] as string);
      }
      await this.advance(400);
    }
    await this.settle();
  }

  /** Lets the HUD catch up: it republishes ~10 times a second and the score counts up over ~260ms. */
  async settle(): Promise<void> {
    await this.advance(600);
  }

  /** Hard-drops until the round ends (block out). */
  async topOut(): Promise<void> {
    for (let i = 0; i < 60; i++) {
      await this.key("Space");
      await this.advance(100);
      if (await this.gameOver.dialog().isVisible()) return;
    }
  }

  // ── the board and the top bar ──────────────────────────────────────────

  /** The canvas board, named "Playfield, 10 columns by 20 rows" (or its translation). */
  board(): Locator {
    return this.page.getByRole("img", { name: /10.+20/ });
  }

  pauseButton(name: string = copy.action.pause): Locator {
    return this.page.locator(".topbar").getByRole("button", { name, exact: true });
  }

  highScoresButton(name: string = copy.action.highScores): Locator {
    return this.page.locator(".topbar").getByRole("button", { name, exact: true });
  }

  settingsButton(name: string = copy.action.settings): Locator {
    return this.page.locator(".topbar").getByRole("button", { name, exact: true });
  }

  languageButton(): Locator {
    return this.page.locator(".topbar").getByRole("button", { name: /^(Language|Ngôn ngữ)$/ });
  }

  signInButton(): Locator {
    return this.page.locator(".topbar").getByRole("button", { name: copy.account.signIn });
  }

  accountButton(): Locator {
    return this.page.locator(".topbar").getByRole("button", { name: copy.account.menu });
  }

  /** The value under a top-bar label ("Score", "Lines", "Level" or their translation). */
  topValue(label: string): Locator {
    return this.page.locator(".topbar__stack").filter({ hasText: label }).locator(".value");
  }

  async score(): Promise<number> {
    return this.number(this.topValue(copy.hud.score));
  }

  async lines(): Promise<number> {
    return this.number(this.topValue(copy.hud.lines));
  }

  async level(): Promise<number> {
    return this.number(this.topValue(copy.hud.level));
  }

  /** A statistic in the left rail (Time, PPS, Back-to-back, Combo). */
  stat(label: string): Locator {
    return this.page.locator(".rail--left .statrow").filter({ hasText: label }).locator(".value");
  }

  // ── Hold and Next ──────────────────────────────────────────────────────

  /** The Next queue on the right rail (desktop) or the strip above the board (mobile). */
  nextQueue(): Locator {
    return this.page.locator(".rail--right .queue, .strip .queue").filter({ visible: true }).first();
  }

  holdSlot(): Locator {
    return this.page.locator(".rail--left .slot, .strip .slot").filter({ visible: true }).first();
  }

  /** The letter of each queued piece. Needs "Distinguish without colour" on, which stamps the letter in each cell. */
  async nextLetters(): Promise<string[]> {
    return this.nextQueue()
      .locator(":scope > div")
      .evaluateAll((previews) => previews.map((p) => (p.textContent ?? "").slice(0, 1)));
  }

  async holdLetter(): Promise<string> {
    return ((await this.holdSlot().textContent()) ?? "").slice(0, 1);
  }

  /** How many cells of the held piece are painted (colour on, letters off works too). */
  async holdFilledCells(): Promise<number> {
    return this.holdSlot()
      .locator(":scope > div > div")
      .evaluateAll((cells) => cells.filter((c) => (c as HTMLElement).style.background !== "").length);
  }

  /** Background colours of the painted cells of the first Next preview, to compare colour vs letter mode. */
  async firstNextCellColour(): Promise<string> {
    return this.nextQueue()
      .locator(":scope > div")
      .first()
      .locator(":scope > div")
      .evaluateAll((cells) => cells.map((c) => (c as HTMLElement).style.background).find((b) => b !== "") ?? "");
  }

  // ── footer hints and the touch band ────────────────────────────────────

  hints(): Locator {
    return this.page.locator("footer.hints");
  }

  /** The key chip next to a hint label ("Hard drop" → "Space"). */
  hintKey(what: string): Locator {
    return this.hints().locator(".hint").filter({ has: this.page.getByText(what, { exact: true }) }).locator(".hint__key");
  }

  touchButton(name: string): Locator {
    return this.page.locator(".touchband").getByRole("button", { name, exact: true });
  }

  touchBand(): Locator {
    return this.page.locator(".touchband");
  }

  rail(side: "left" | "right"): Locator {
    return this.page.locator(`.rail--${side}`);
  }

  strip(): Locator {
    return this.page.locator(".strip");
  }

  // ── storage the game writes ────────────────────────────────────────────

  async stored(key: keyof typeof STORAGE): Promise<string | null> {
    return this.page.evaluate((k) => localStorage.getItem(k), STORAGE[key]);
  }

  async storedJson<T = Record<string, unknown>>(key: keyof typeof STORAGE): Promise<T | null> {
    const text = await this.stored(key);
    return text === null ? null : (JSON.parse(text) as T);
  }

  /** Play time in whole seconds, read from the Time statistic of the left rail (tablet and wider). */
  async seconds(): Promise<number> {
    const [m, sec] = ((await this.stat(copy.hud.time).textContent()) ?? "00:00").split(":").map(Number);
    return (m ?? 0) * 60 + (sec ?? 0);
  }

  /** Drops keyboard focus to the page itself, so keys reach the game rather than a focused button. */
  async blur(): Promise<void> {
    await this.page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  }

  /** Hides the tab (visibilitychange) the way switching to another tab does. */
  async hideTab(): Promise<void> {
    await this.page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
  }

  async showTab(): Promise<void> {
    await this.page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
  }

  private async number(locator: Locator): Promise<number> {
    const text = (await locator.textContent()) ?? "";
    return Number(text.replace(/[^\d]/g, ""));
  }
}

/** The settings dialog (FR-23…FR-30, FR-42…FR-44). */
export class SettingsDialog {
  constructor(readonly page: Page) {}

  /** English or Vietnamese by default: switching the language inside it keeps it the same dialog. */
  dialog(name: string | RegExp = new RegExp(`^(${copy.action.settings}|${copy.vi.settings})$`)): Locator {
    return this.page.getByRole("dialog", { name });
  }

  closeButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.settings.close });
  }

  doneButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.settings.done });
  }

  resetButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.settings.reset });
  }

  /** A segmented option: difficulty (Easy/Normal/Hard/Custom) or language (EN/VI). */
  option(name: string): Locator {
    return this.dialog().getByRole("button", { name, exact: true });
  }

  toggle(name: string): Locator {
    return this.dialog().getByRole("switch", { name });
  }

  slider(name: string): Locator {
    return this.dialog().getByRole("slider", { name });
  }

  /** The hint line of a settings row, found by the row's label. */
  rowHint(label: string): Locator {
    return this.dialog().locator(".setrow").filter({ has: this.page.locator(".setrow__label", { hasText: label }) }).locator(".setrow__hint");
  }

  /** Every button and switch in the dialog (the tap targets). */
  controls(): Locator {
    return this.dialog().locator('button, [role="switch"]');
  }

  rebindButton(action: string): Locator {
    return this.dialog().getByRole("button", { name: copy.settings.rebind(action) });
  }

  status(): Locator {
    return this.dialog().getByRole("status");
  }

  alert(): Locator {
    return this.dialog().getByRole("alert");
  }

  /** Sets a range input to a value the way a keyboard user would land on it. */
  async setSlider(name: string, value: number): Promise<void> {
    await this.slider(name).fill(String(value));
  }
}

/** The high-score table (FR-32…FR-34). */
export class ScoresDialog {
  constructor(readonly page: Page) {}

  /** English or Vietnamese: the table stays the same dialog when the language changes. */
  dialog(): Locator {
    return this.page.getByRole("dialog", { name: new RegExp(`^(${copy.action.highScores}|${copy.vi.highScores})$`) });
  }

  closeButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.scores.close });
  }

  board(name: string): Locator {
    return this.dialog().getByRole("group", { name: copy.scores.board }).getByRole("button", { name, exact: true });
  }

  list(): Locator {
    return this.dialog().getByRole("list");
  }

  rows(): Locator {
    return this.list().getByRole("listitem");
  }

  empty(): Locator {
    return this.dialog().getByText(copy.scores.empty);
  }

  nickname(): Locator {
    return this.dialog().getByRole("textbox", { name: copy.scores.nickname });
  }

  clearButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.scores.clear });
  }

  confirmClearButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.scores.clearConfirm });
  }

  closeAction(): Locator {
    return this.dialog().getByRole("button", { name: copy.action.close, exact: true });
  }

  playAgain(): Locator {
    return this.dialog().getByRole("button", { name: copy.action.playAgain });
  }

  alert(): Locator {
    return this.dialog().getByRole("alert");
  }
}

export class PausedDialog {
  constructor(readonly page: Page) {}

  dialog(name: string = copy.modal.paused): Locator {
    return this.page.getByRole("dialog", { name });
  }

  button(name: string): Locator {
    return this.dialog().getByRole("button", { name, exact: true });
  }
}

export class GameOverDialog {
  constructor(readonly page: Page) {}

  dialog(): Locator {
    return this.page.getByRole("dialog", { name: copy.modal.gameOver });
  }

  button(name: string): Locator {
    return this.dialog().getByRole("button", { name, exact: true });
  }

  /** A statistic row of the final-stats list (Score, Lines, Level, Time, PPS). */
  stat(label: string): Locator {
    return this.dialog().locator(".statrow").filter({ hasText: label }).locator(".value");
  }
}

/** The Ducker ID account dialog (FR-45), only in the flag-on build. */
export class AccountDialog {
  constructor(readonly page: Page) {}

  dialog(): Locator {
    return this.page.getByRole("dialog", { name: copy.account.menu });
  }

  profileLink(): Locator {
    return this.dialog().getByRole("link", { name: copy.account.openProfile });
  }

  signOut(): Locator {
    return this.dialog().getByRole("button", { name: copy.account.signOut });
  }

  close(): Locator {
    return this.dialog().getByRole("button", { name: copy.action.close });
  }
}
