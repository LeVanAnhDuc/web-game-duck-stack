import { describe, expect, it } from 'vitest'
import { MAX_NICKNAME, emptyBoard, insertScore, type ScoreEntry } from '../scores/types'
import type { StorageLike } from './local'
import {
  IDENTITY_KEY,
  SCORES_KEY,
  createIdentityRepository,
  createScoreRepository,
} from './scores'

function memory(seed?: Record<string, string>): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>(Object.entries(seed ?? {}))
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v)
    },
    removeItem: (k) => {
      data.delete(k)
    },
  }
}

const blocked = (): StorageLike => ({
  getItem() {
    throw new DOMException('denied')
  },
  setItem() {
    throw new DOMException('quota')
  },
  removeItem() {
    throw new DOMException('denied')
  },
})

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

describe('score repository', () => {
  it('reports ok with an empty table on a first run', async () => {
    const { board, status } = await createScoreRepository(memory()).load()
    expect(status).toBe('ok')
    expect(board.boards.normal).toHaveLength(0)
  })

  it('round-trips a saved table', async () => {
    const storage = memory()
    const repo = createScoreRepository(storage)
    const written = insertScore(emptyBoard(), 'hard', entry())
    expect(await repo.save(written)).toBe('ok')

    const { board, status } = await repo.load()
    expect(status).toBe('ok')
    expect(board.boards.hard[0]).toEqual(entry())
  })

  it('survives unparsable text and says it recovered', async () => {
    const repo = createScoreRepository(memory({ [SCORES_KEY]: 'not json {{{' }))
    const { board, status } = await repo.load()
    expect(status).toBe('recovered')
    expect(board.boards.normal).toHaveLength(0)
  })

  it('reports recovered when a row had to be dropped', async () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      boards: { normal: [entry(), { nothing: true }] },
    })
    const { board, status } = await createScoreRepository(memory({ [SCORES_KEY]: raw })).load()
    expect(status).toBe('recovered')
    expect(board.boards.normal).toHaveLength(1)
  })

  it('reports recovered when the stored version is not this one', async () => {
    const raw = JSON.stringify({ schemaVersion: 99, boards: { normal: [entry()] } })
    const { status } = await createScoreRepository(memory({ [SCORES_KEY]: raw })).load()
    expect(status).toBe('recovered')
  })

  it('reports unavailable rather than throwing when storage is blocked', async () => {
    const repo = createScoreRepository(blocked())
    const { board, status } = await repo.load()
    expect(status).toBe('unavailable')
    expect(board.boards.normal).toHaveLength(0)
    expect(await repo.save(emptyBoard())).toBe('unavailable')
  })

  it('reports unavailable when there is no storage at all', async () => {
    const repo = createScoreRepository(null)
    expect((await repo.load()).status).toBe('unavailable')
    expect(await repo.save(emptyBoard())).toBe('unavailable')
  })

  it('reports unavailable when the quota is exceeded on save', async () => {
    const storage = memory()
    storage.setItem = () => {
      throw new DOMException('QuotaExceededError')
    }
    expect(await createScoreRepository(storage).save(emptyBoard())).toBe('unavailable')
  })
})

describe('identity repository', () => {
  it('starts with no nickname, and that is not an error', async () => {
    const { nickname, status } = await createIdentityRepository(memory()).load()
    expect(nickname).toBe('')
    expect(status).toBe('ok')
  })

  it('round-trips a nickname', async () => {
    const storage = memory()
    const repo = createIdentityRepository(storage)
    expect(await repo.save('Duck')).toBe('ok')
    expect((await repo.load()).nickname).toBe('Duck')
  })

  it('cleans on the way in, so a stored value is always renderable', async () => {
    const storage = memory()
    const repo = createIdentityRepository(storage)
    await repo.save('  Duck   Lord  ')
    expect(storage.data.get(IDENTITY_KEY)).toBe('Duck Lord')
    await repo.save('D'.repeat(100))
    expect(storage.data.get(IDENTITY_KEY)).toHaveLength(MAX_NICKNAME)
  })

  it('removes the key when the nickname is cleared, rather than storing an empty one', async () => {
    const storage = memory({ [IDENTITY_KEY]: 'Duck' })
    const repo = createIdentityRepository(storage)
    expect(await repo.save('   ')).toBe('ok')
    expect(storage.data.has(IDENTITY_KEY)).toBe(false)
    expect((await repo.load()).nickname).toBe('')
  })

  it('reports recovered when what was stored had to be cleaned to be usable', async () => {
    const storage = memory({ [IDENTITY_KEY]: '  Duck  ' })
    const { nickname, status } = await createIdentityRepository(storage).load()
    expect(nickname).toBe('Duck')
    expect(status).toBe('recovered')
  })

  it('reports unavailable rather than throwing when storage is blocked', async () => {
    const repo = createIdentityRepository(blocked())
    const { nickname, status } = await repo.load()
    expect(nickname).toBe('')
    expect(status).toBe('unavailable')
    expect(await repo.save('Duck')).toBe('unavailable')
  })
})
