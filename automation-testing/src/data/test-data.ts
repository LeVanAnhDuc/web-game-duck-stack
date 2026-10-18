// Constants for test input. No .env, no network: values only.

/**
 * The fake clock's starting point. The game seeds each round with `Date.now()` (client/src/hooks/useGameSession.ts),
 * so `GamePage.goto()` installs `page.clock` here and pauses it one second later: the round's seed is then always
 * `START + 1000` and the piece sequence is always the same.
 */
export const START = Date.UTC(2026, 0, 1);

/**
 * What a round seeded at START deals, read off the running game (colour-blind letters in Next / Hold): the first
 * active piece and the five-deep queue behind it.
 */
export const OPENING = { active: "I", next: ["O", "T", "S", "J", "Z"] } as const;

/**
 * Key plans for a round seeded at START, one string per piece: C = rotate right, A = rotate left, L / R = one cell
 * sideways, D = hard drop. Worked out once offline against the same seed (a greedy stacker), recorded here as data;
 * the specs prove the outcome on screen, they never re-derive it. Each plan runs at the slowest custom speed
 * (CUSTOM_SLOWEST) so gravity cannot move a piece while its keys are being pressed.
 *
 * `cells` is how many rows each piece's hard drop travels — geometry, needed to know the drop points (2 per cell,
 * FR-07) that sit on top of the line-clear points in the score.
 */
export const PLAN_LINES = {
  keys: [
    "LLLD", "LLLLD", "RD", "D", "RRRRD", "CLLD", "ARRD", "RRRRD", "CD", "LLLD",
    "RRRRD", "RRRD", "LD", "CRRRRD", "CLLLLD", "CCLD", "CLLLLLD", "ARRRD", "RD", "LLD",
    "CRD", "AD", "CRD", "CRRRRD", "RRRRD", "CLLD", "ARRRD", "CLLLLD", "ALLLD", "RRRRD",
  ],
  cells: [20, 18, 19, 18, 19, 18, 18, 18, 17, 18, 19, 19, 19, 18, 18, 18, 16, 18, 19, 18, 17, 16, 15, 18, 16, 15, 15, 18, 17, 18],
  /** Piece index (0-based) whose drop clears rows, and how many. Pieces 27 and 28 clear back to back (a combo). */
  clears: { 4: 1, 7: 1, 10: 2, 14: 1, 17: 1, 27: 3, 28: 1 } as Record<number, number>,
} as const;

/** Same seed, stacked with column 10 kept open: piece 13 (an I) clears four rows, piece 27 (an I) four more. */
export const PLAN_TETRIS = {
  keys: [
    "LLLD", "LLLLD", "RD", "D", "ARRRRD", "CLLD", "CRRD", "LLLD", "CRRRD", "LLD",
    "D", "CLLLLD", "RRRD", "CRRRRD", "D", "CCRRRD", "CLLLLLD", "LLD", "LLD", "LLLD",
    "CLD", "CRD", "CLLLLD", "CCRD", "RRRD", "LD", "CRRRD", "CRRRRD",
  ],
  cells: [20, 18, 19, 18, 18, 17, 17, 16, 16, 15, 16, 13, 15, 18, 18, 17, 14, 17, 16, 14, 15, 16, 11, 14, 16, 13, 13, 18],
} as const;

/** The slowest custom fall speed the settings allow (client/src/settings/types.ts MIN_CELLS_PER_SECOND). */
export const CUSTOM_SLOWEST = 0.25;

/** Settings that make a planned round reproducible: slowest custom speed, letters on the pieces, English. */
export const PLANNED_SETTINGS = {
  schemaVersion: 1,
  difficulty: "custom",
  customCellsPerSecond: CUSTOM_SLOWEST,
  colorBlindMode: true,
  locale: "en",
} as const;

/** localStorage keys the game writes (client/src/storage/local.ts, client/src/storage/scores.ts). */
export const STORAGE = {
  settings: "tetris.settings.v1",
  scores: "tetris.scores.v1",
  identity: "tetris.identity.v1",
} as const;

/** One stored high-score row, in the shape client/src/scores/types.ts keeps. */
export function scoreRow(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: `row-${Math.random().toString(36).slice(2, 8)}`,
    nickname: "",
    score: 1000,
    lines: 4,
    level: 1,
    seconds: 65,
    pps: 1.25,
    cellsPerSecond: null,
    at: Date.UTC(2026, 6, 9, 14, 30),
    ...over,
  };
}

/** A stored score board with the given rows per difficulty (empty boards otherwise). */
export function scoreBoard(boards: Partial<Record<"easy" | "normal" | "hard" | "custom", unknown[]>>) {
  return { schemaVersion: 1, boards: { easy: [], normal: [], hard: [], custom: [], ...boards } };
}

/** The fake Ducker ID the flag-on build signs in against (client/scripts/build-e2e.mjs). Never resolved. */
export const DUCKER = {
  issuer: "http://ducker.test",
  clientId: "e2e-client",
  user: { sub: "u-1", name: "Lan Nguyen", email: "lan@example.com", picture: null },
} as const;
