import {
  SCORES_SCHEMA_VERSION,
  cleanNickname,
  emptyBoard,
  migrateScores,
  type ScoreBoard,
} from '../scores/types'
import { browserStorage, type StorageLike, type StorageStatus } from './local'

/**
 * The two repositories ADR-0004 promised and this feature finally needs:
 * `ScoreRepository` for the high-score table (FR-32) and `IdentityRepository` for the
 * local nickname (FR-34).
 *
 * They are separate on purpose, and the nickname is NOT part of `Settings`. When
 * Ducker ID grows real OAuth endpoints, what gets swapped is the identity
 * implementation -- that must not mean rewriting how a player's key bindings are
 * stored. Both are async for the reason ADR-0004 gives: turning a sync call async
 * later means touching every call site.
 *
 * A nickname here is a display label, not an account: no password, no uniqueness, no
 * verification, and nothing leaves the machine. The Non-Goal "no account system of
 * the game's own" stays intact.
 */

export const SCORES_KEY = 'tetris.scores.v1'
export const IDENTITY_KEY = 'tetris.identity.v1'

export interface ScoreRepository {
  load(): Promise<{ board: ScoreBoard; status: StorageStatus }>
  save(board: ScoreBoard): Promise<StorageStatus>
}

export interface IdentityRepository {
  load(): Promise<{ nickname: string; status: StorageStatus }>
  save(nickname: string): Promise<StorageStatus>
}

export function createScoreRepository(
  storage: StorageLike | null = browserStorage(),
): ScoreRepository {
  return {
    async load() {
      if (!storage) return { board: emptyBoard(), status: 'unavailable' }

      let text: string | null = null
      try {
        text = storage.getItem(SCORES_KEY)
      } catch {
        return { board: emptyBoard(), status: 'unavailable' }
      }
      // Nothing stored is the normal first run, not a failure.
      if (text === null) return { board: emptyBoard(), status: 'ok' }

      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch {
        return { board: emptyBoard(), status: 'recovered' }
      }

      const { board, dropped } = migrateScores(parsed)
      // `recovered` is reported rather than swallowed: the player's table is not what
      // it was, and the UI says so instead of quietly showing a shorter list
      // (NFR-REL-02).
      const versionMatched =
        typeof parsed === 'object' &&
        parsed !== null &&
        (parsed as { schemaVersion?: unknown }).schemaVersion === SCORES_SCHEMA_VERSION
      return { board, status: dropped > 0 || !versionMatched ? 'recovered' : 'ok' }
    },

    async save(board) {
      if (!storage) return 'unavailable'
      try {
        storage.setItem(SCORES_KEY, JSON.stringify(board))
        return 'ok'
      } catch {
        // Quota exceeded, or storage revoked between load and save. The round still
        // happened and the player still gets to play (NFR-REL-03).
        return 'unavailable'
      }
    },
  }
}

export function createIdentityRepository(
  storage: StorageLike | null = browserStorage(),
): IdentityRepository {
  return {
    async load() {
      if (!storage) return { nickname: '', status: 'unavailable' }
      try {
        const raw = storage.getItem(IDENTITY_KEY)
        if (raw === null) return { nickname: '', status: 'ok' }
        // Stored as a bare string, not JSON: it is one short line of text, and a
        // JSON wrapper would only add a parse step that can fail.
        const nickname = cleanNickname(raw)
        return { nickname, status: nickname === raw ? 'ok' : 'recovered' }
      } catch {
        return { nickname: '', status: 'unavailable' }
      }
    },

    async save(nickname) {
      if (!storage) return 'unavailable'
      const clean = cleanNickname(nickname)
      try {
        // An empty nickname REMOVES the key rather than storing "": there is no
        // difference between "never set one" and "cleared it", and leaving an empty
        // string behind makes the next load look like a stored value.
        if (clean === '') storage.removeItem(IDENTITY_KEY)
        else storage.setItem(IDENTITY_KEY, clean)
        return 'ok'
      } catch {
        return 'unavailable'
      }
    },
  }
}
