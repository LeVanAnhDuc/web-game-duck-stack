import { describe, expect, it } from 'vitest'
import { MAX_CELLS_PER_SECOND, MIN_CELLS_PER_SECOND } from '../settings/types'
import {
  BUCKETS,
  MAX_NICKNAME,
  MAX_PER_BOARD,
  MAX_TIMESTAMP,
  SCORES_SCHEMA_VERSION,
  cleanNickname,
  clearBucket,
  emptyBoard,
  insertScore,
  isWorthSaving,
  migrateScores,
  rankOf,
  type ScoreEntry,
} from './types'

function entry(over: Partial<ScoreEntry> = {}): ScoreEntry {
  return {
    id: 'e1',
    nickname: 'Duck',
    score: 1000,
    lines: 10,
    level: 2,
    seconds: 60,
    pps: 1.5,
    cellsPerSecond: null,
    at: 1_757_000_000_000,
    ...over,
  }
}

describe('insertScore', () => {
  it('sorts by score descending', () => {
    let b = emptyBoard()
    b = insertScore(b, 'normal', entry({ id: 'low', score: 100 }))
    b = insertScore(b, 'normal', entry({ id: 'high', score: 9000 }))
    b = insertScore(b, 'normal', entry({ id: 'mid', score: 500 }))
    expect(b.boards.normal.map((e) => e.id)).toEqual(['high', 'mid', 'low'])
  })

  it('keeps only the top ten, dropping the worst', () => {
    let b = emptyBoard()
    for (let i = 0; i < MAX_PER_BOARD + 5; i++) {
      b = insertScore(b, 'normal', entry({ id: `e${i}`, score: i * 10 }))
    }
    expect(b.boards.normal).toHaveLength(MAX_PER_BOARD)
    expect(b.boards.normal[0]?.score).toBe(140)
    // The five lowest are gone, not the five newest.
    expect(b.boards.normal.some((e) => e.score === 0)).toBe(false)
  })

  it('breaks a tie in favour of the older run', () => {
    let b = emptyBoard()
    b = insertScore(b, 'normal', entry({ id: 'first', score: 500, at: 1000 }))
    b = insertScore(b, 'normal', entry({ id: 'later', score: 500, at: 2000 }))
    // Equalling a record does not take its rank -- you have to beat it.
    expect(b.boards.normal.map((e) => e.id)).toEqual(['first', 'later'])
  })

  it('writes into one board and leaves the other three alone', () => {
    const b = insertScore(emptyBoard(), 'hard', entry())
    expect(b.boards.hard).toHaveLength(1)
    expect(b.boards.easy).toHaveLength(0)
    expect(b.boards.normal).toHaveLength(0)
    expect(b.boards.custom).toHaveLength(0)
  })

  it('does not mutate the board it was given', () => {
    const before = emptyBoard()
    insertScore(before, 'normal', entry())
    expect(before.boards.normal).toHaveLength(0)
  })
})

describe('clearBucket', () => {
  it('empties one board and keeps the rest', () => {
    let b = emptyBoard()
    b = insertScore(b, 'easy', entry({ id: 'a' }))
    b = insertScore(b, 'hard', entry({ id: 'b' }))
    const cleared = clearBucket(b, 'easy')
    expect(cleared.boards.easy).toHaveLength(0)
    expect(cleared.boards.hard).toHaveLength(1)
  })
})

describe('rankOf', () => {
  it('reports a one-based rank, or null when the run missed the board', () => {
    let b = emptyBoard()
    b = insertScore(b, 'normal', entry({ id: 'top', score: 900 }))
    b = insertScore(b, 'normal', entry({ id: 'second', score: 100 }))
    expect(rankOf(b, 'normal', 'top')).toBe(1)
    expect(rankOf(b, 'normal', 'second')).toBe(2)
    expect(rankOf(b, 'normal', 'nope')).toBeNull()
    // A rank is per board: the same id in another board is not found.
    expect(rankOf(b, 'hard', 'top')).toBeNull()
  })
})

describe('isWorthSaving', () => {
  it('rejects a round with nothing in it', () => {
    expect(isWorthSaving({ score: 0, lines: 0 })).toBe(false)
  })

  it('accepts a round that scored or cleared anything', () => {
    expect(isWorthSaving({ score: 40, lines: 0 })).toBe(true)
    expect(isWorthSaving({ score: 0, lines: 1 })).toBe(true)
  })
})

describe('cleanNickname', () => {
  it('trims and collapses whitespace', () => {
    expect(cleanNickname('  Duck   Lord  ')).toBe('Duck Lord')
  })

  it('turns control characters into spaces instead of gluing words together', () => {
    expect(cleanNickname('Duck\nLord')).toBe('Duck Lord')
    expect(cleanNickname('Duck\u0007Lord')).toBe('Duck Lord')
  })

  it('caps the length', () => {
    expect(cleanNickname('D'.repeat(200))).toHaveLength(MAX_NICKNAME)
  })

  it('returns empty for anything that is not a string', () => {
    expect(cleanNickname(null)).toBe('')
    expect(cleanNickname(42)).toBe('')
    expect(cleanNickname(undefined)).toBe('')
  })
})

describe('migrateScores', () => {
  it('returns an empty board for junk, without throwing', () => {
    for (const junk of [null, undefined, 0, 'nope', [], { boards: 'no' }]) {
      const { board, dropped } = migrateScores(junk)
      expect(BUCKETS.every((k) => board.boards[k].length === 0)).toBe(true)
      expect(dropped).toBe(0)
    }
  })

  it('round-trips a board it wrote itself', () => {
    const written = insertScore(emptyBoard(), 'hard', entry())
    const { board, dropped } = migrateScores(JSON.parse(JSON.stringify(written)))
    expect(dropped).toBe(0)
    expect(board.boards.hard[0]).toEqual(entry())
    expect(board.schemaVersion).toBe(SCORES_SCHEMA_VERSION)
  })

  it('drops only the broken row and keeps the intact ones', () => {
    const raw = {
      schemaVersion: 1,
      boards: {
        normal: [
          entry({ id: 'good', score: 500 }),
          { id: 'bad', nickname: 'x' }, // no score, no lines, no timestamp
          null,
          entry({ id: 'good2', score: 700 }),
        ],
      },
    }
    const { board, dropped } = migrateScores(raw)
    expect(dropped).toBe(2)
    expect(board.boards.normal.map((e) => e.id)).toEqual(['good2', 'good'])
  })

  it('re-sorts and re-caps a board that was stored out of order or too long', () => {
    const rows = Array.from({ length: MAX_PER_BOARD + 4 }, (_, i) =>
      entry({ id: `e${i}`, score: i * 10 }),
    )
    const { board } = migrateScores({ boards: { easy: rows } })
    expect(board.boards.easy).toHaveLength(MAX_PER_BOARD)
    expect(board.boards.easy[0]?.score).toBe(130)
  })

  it('clamps a hostile number instead of rendering it', () => {
    const { board } = migrateScores({
      boards: { normal: [{ score: 10, lines: 1, at: 1, level: -99, pps: 1e9 }] },
    })
    const row = board.boards.normal[0]
    expect(row?.level).toBe(1)
    expect(row?.pps).toBe(1000)
  })

  it('gives a row with no id a derived one, so React keys stay unique', () => {
    const { board } = migrateScores({
      boards: { normal: [{ score: 10, lines: 1, at: 111 }, { score: 20, lines: 2, at: 222 }] },
    })
    const ids = board.boards.normal.map((e) => e.id)
    expect(new Set(ids).size).toBe(2)
    expect(ids.every((id) => id.length > 0)).toBe(true)
  })

  it('ignores a bucket name it does not know', () => {
    const { board } = migrateScores({ boards: { hacker: [entry()], normal: [entry()] } })
    expect(board.boards.normal).toHaveLength(1)
    expect(Object.keys(board.boards).sort()).toEqual(['custom', 'easy', 'hard', 'normal'])
  })
})

describe('migrateScores · the Number() traps', () => {
  it('keeps an absent field absent instead of turning it into a zero', () => {
    // `Number(null)` and `Number('')` are both 0, so a naive finite-check would
    // report a fall speed of 0 cells/second for a round that never had one.
    const { board } = migrateScores({
      boards: { normal: [{ score: 10, lines: 1, at: 1, cellsPerSecond: null }] },
    })
    expect(board.boards.normal[0]?.cellsPerSecond).toBeNull()
  })

  it('drops a row whose score is null rather than scoring it zero', () => {
    const { board, dropped } = migrateScores({
      boards: { normal: [{ score: null, lines: 1, at: 1 }] },
    })
    expect(dropped).toBe(1)
    expect(board.boards.normal).toHaveLength(0)
  })

  it('does not read a number out of an array or an object', () => {
    const { board, dropped } = migrateScores({
      boards: { normal: [{ score: [], lines: 1, at: 1 }, { score: {}, lines: 1, at: 2 }] },
    })
    expect(dropped).toBe(2)
    expect(board.boards.normal).toHaveLength(0)
  })
})

describe('migrateScores · a row must be safe to RENDER, not merely present', () => {
  // The UI calls both `new Date(at).toISOString()` and `Intl.DateTimeFormat.format(at)`.
  // Both throw RangeError beyond ±8.64e15, and with no error boundary in the app a
  // single corrupt row white-screened the whole game.
  const renderIt = (at: number) => {
    new Date(at).toISOString()
    new Intl.DateTimeFormat('en').format(at)
  }

  it('drops or clamps a timestamp no Date can hold', () => {
    for (const at of [1e16, 8.65e15, Number.MAX_SAFE_INTEGER, '1e30']) {
      const { board } = migrateScores({ boards: { normal: [{ score: 10, lines: 1, at }] } })
      const row = board.boards.normal[0]
      if (row) expect(() => renderIt(row.at)).not.toThrow()
    }
  })

  it('keeps the largest timestamp that IS renderable', () => {
    const { board } = migrateScores({
      boards: { normal: [{ score: 10, lines: 1, at: MAX_TIMESTAMP }] },
    })
    expect(board.boards.normal[0]?.at).toBe(MAX_TIMESTAMP)
    expect(() => renderIt(MAX_TIMESTAMP)).not.toThrow()
  })

  it('gives two id-less rows with the same score and time DIFFERENT ids', () => {
    // Same `at` and same `score`: the old fallback id was built from those two alone,
    // so both rows got the same string -- duplicate React keys, and `rankOf` always
    // resolving to the first.
    const { board } = migrateScores({
      boards: { normal: [{ score: 10, lines: 1, at: 500 }, { score: 10, lines: 1, at: 500 }] },
    })
    const ids = board.boards.normal.map((e) => e.id)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })

  it('rejects a fall speed outside what the settings screen can produce', () => {
    const { board } = migrateScores({
      boards: {
        custom: [
          { id: 'zero', score: 10, lines: 1, at: 1, cellsPerSecond: 0 },
          { id: 'huge', score: 20, lines: 1, at: 2, cellsPerSecond: 999 },
          { id: 'tiny', score: 30, lines: 1, at: 3, cellsPerSecond: 0.0001 },
        ],
      },
    })
    const by = (id: string) => board.boards.custom.find((e) => e.id === id)
    // A speed of zero is not a speed a round can have run at, so it reads as absent.
    expect(by('zero')?.cellsPerSecond).toBeNull()
    expect(by('huge')?.cellsPerSecond).toBe(MAX_CELLS_PER_SECOND)
    expect(by('tiny')?.cellsPerSecond).toBe(MIN_CELLS_PER_SECOND)
  })
})
