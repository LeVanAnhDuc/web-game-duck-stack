import {
  MAX_CELLS_PER_SECOND,
  MIN_CELLS_PER_SECOND,
  type Difficulty,
  type Settings,
} from '../settings/types'

/**
 * The high-score table (FR-32 -- FR-34).
 *
 * One board per difficulty, and they are never merged. ADR-0013 §4: `easy` scales
 * gravity by 0.6 and `hard` by 1.8, so the same player scores far higher on `easy`
 * simply by having more time per piece. A single combined table would not measure
 * skill, it would measure who picked Easy.
 */

export const SCORES_SCHEMA_VERSION = 1

/** Same values as `Difficulty`, named for what it does here: pick a board. */
export type Bucket = Difficulty

export const BUCKETS: readonly Bucket[] = ['easy', 'normal', 'hard', 'custom']

/** Ten per board. See design.md §3 -- quota, and a long list is not "high" scores. */
export const MAX_PER_BOARD = 10

/** Longest nickname kept. Long enough for a name, short enough not to wrap a row. */
export const MAX_NICKNAME = 16

/**
 * The largest timestamp a `Date` can hold (ECMA-262: ±8.64e15 ms from the epoch).
 *
 * Clamping `at` to `Number.MAX_SAFE_INTEGER` instead let a corrupt row through with
 * an out-of-range value, and `new Date(that).toISOString()` throws `RangeError`. With
 * no error boundary in the app, one bad row white-screened the whole game rather than
 * losing a single record -- the opposite of what this module promises.
 */
export const MAX_TIMESTAMP = 8.64e15

export interface ScoreEntry {
  id: string
  /** Empty means the player never set one; the UI shows a default label. */
  nickname: string
  score: number
  lines: number
  level: number
  seconds: number
  pps: number
  /**
   * Only meaningful in the `custom` board. That board is a continuum, not a level:
   * 0.25 cells/s and 20 cells/s are both `custom` and comparing them is meaningless,
   * so every row carries its own speed and says so.
   */
  cellsPerSecond: number | null
  /**
   * Epoch ms, NOT a formatted string. FR-33 formats at render time, because the
   * player can change language after a score is saved -- a stored "07/09/2026" would
   * keep speaking Vietnamese in an English UI.
   */
  at: number
}

export interface ScoreBoard {
  schemaVersion: number
  boards: Record<Bucket, ScoreEntry[]>
}

export function emptyBoard(): ScoreBoard {
  return {
    schemaVersion: SCORES_SCHEMA_VERSION,
    boards: { easy: [], normal: [], hard: [], custom: [] },
  }
}

/** Which board a round played under these settings belongs in. */
export function bucketOf(settings: Pick<Settings, 'difficulty'>): Bucket {
  return settings.difficulty
}

/** Trimmed, collapsed to single spaces, length-capped. */
export function cleanNickname(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  // Control characters are REPLACED with a space rather than stripped: a pasted
  // newline would otherwise glue two words together. The cap is applied last so a
  // 500-character paste cannot stretch a row.
  // eslint-disable-next-line no-control-regex
  return raw.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_NICKNAME)
}

/** A round worth remembering. Opening the tab and dying is not a record. */
export function isWorthSaving(e: Pick<ScoreEntry, 'score' | 'lines'>): boolean {
  return e.score > 0 || e.lines > 0
}

/**
 * Insert, sort by score descending, keep the top {@link MAX_PER_BOARD}.
 *
 * Returns a NEW board -- this is called once per round, not in the hot path, so the
 * copy is free and it keeps the React state update honest.
 */
export function insertScore(board: ScoreBoard, bucket: Bucket, entry: ScoreEntry): ScoreBoard {
  const next = [...board.boards[bucket], entry].sort(compareEntries).slice(0, MAX_PER_BOARD)
  return { schemaVersion: SCORES_SCHEMA_VERSION, boards: { ...board.boards, [bucket]: next } }
}

/**
 * Score first. Ties broken by the older run, so beating a record needs MORE than
 * equalling it -- otherwise a repeat of the same score silently steals the rank.
 */
function compareEntries(a: ScoreEntry, b: ScoreEntry): number {
  if (b.score !== a.score) return b.score - a.score
  if (b.lines !== a.lines) return b.lines - a.lines
  return a.at - b.at
}

export function clearBucket(board: ScoreBoard, bucket: Bucket): ScoreBoard {
  return { schemaVersion: SCORES_SCHEMA_VERSION, boards: { ...board.boards, [bucket]: [] } }
}

/** True when `entry` made it into its board -- used to decide whether to say so. */
export function rankOf(board: ScoreBoard, bucket: Bucket, id: string): number | null {
  const i = board.boards[bucket].findIndex((e) => e.id === id)
  return i === -1 ? null : i + 1
}

/**
 * A number, or `null` for anything that is not one.
 *
 * The type check comes BEFORE `Number()` on purpose. `Number(null)`, `Number('')` and
 * `Number([])` are all `0` -- a finite number -- so a bare `Number.isFinite` check
 * turns "this field is absent" into a real-looking zero. That is how a row in the
 * `normal` board ended up claiming a fall speed of 0 cells/second.
 */
function num(v: unknown, min: number, max: number): number | null {
  if (typeof v !== 'number' && typeof v !== 'string') return null
  if (typeof v === 'string' && v.trim() === '') return null
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  return Math.min(max, Math.max(min, n))
}

/**
 * Parse whatever came out of storage into something safe to render.
 *
 * Never throws and never returns a partial entry: a row that fails validation is
 * dropped and the intact rows are kept (NFR-REL-02). Losing one record is a smaller
 * loss than losing the table, and both are smaller than a white screen.
 */
export function migrateScores(raw: unknown): { board: ScoreBoard; dropped: number } {
  const board = emptyBoard()
  if (typeof raw !== 'object' || raw === null) return { board, dropped: 0 }
  const r = raw as { boards?: unknown }
  if (typeof r.boards !== 'object' || r.boards === null) return { board, dropped: 0 }
  const boards = r.boards as Record<string, unknown>

  let dropped = 0
  for (const bucket of BUCKETS) {
    const rows = boards[bucket]
    if (!Array.isArray(rows)) continue
    const kept: ScoreEntry[] = []
    for (const row of rows) {
      const entry = migrateEntry(row, kept.length)
      if (entry === null) dropped++
      else kept.push(entry)
    }
    board.boards[bucket] = kept.sort(compareEntries).slice(0, MAX_PER_BOARD)
  }
  return { board, dropped }
}

/**
 * A fall speed inside the range the settings screen can produce, or `null`.
 *
 * Parsed BEFORE clamping. Clamping first turns a stored `0` into the minimum speed,
 * which reads as "this round ran at 0.25 cells/second" -- a claim about a round that
 * never happened. Absent and slowest are different answers.
 */
function positiveSpeed(v: unknown): number | null {
  const raw = num(v, -Number.MAX_VALUE, Number.MAX_VALUE)
  if (raw === null || raw <= 0) return null
  return Math.min(MAX_CELLS_PER_SECOND, Math.max(MIN_CELLS_PER_SECOND, raw))
}

function migrateEntry(raw: unknown, index: number): ScoreEntry | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>

  const score = num(r.score, 0, Number.MAX_SAFE_INTEGER)
  const lines = num(r.lines, 0, Number.MAX_SAFE_INTEGER)
  const at = num(r.at, 0, MAX_TIMESTAMP)
  // These three are what a row IS. Without them there is nothing to show, so the row
  // is dropped rather than displayed as a zero that looks like a real result.
  if (score === null || lines === null || at === null) return null

  return {
    // `index` is part of the fallback id: two id-less rows sharing a timestamp and a
    // score would otherwise get the SAME id, which duplicates React keys and makes
    // `rankOf` resolve to whichever came first.
    id: typeof r.id === 'string' && r.id !== '' ? r.id : `legacy-${index}-${at}-${score}`,
    nickname: cleanNickname(r.nickname),
    score,
    lines,
    level: num(r.level, 1, 9999) ?? 1,
    seconds: num(r.seconds, 0, Number.MAX_SAFE_INTEGER) ?? 0,
    pps: num(r.pps, 0, 1000) ?? 0,
    // Clamped to the range settings can actually produce, and a `0` is treated as
    // absent rather than kept: "0 cells/second" is not a speed a round can have run
    // at, and rendering it is the same real-looking-zero problem as above.
    cellsPerSecond: positiveSpeed(r.cellsPerSecond),
    at,
  }
}
