import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { StorageStatus } from '../storage/local'
import {
  createIdentityRepository,
  createScoreRepository,
  type IdentityRepository,
  type ScoreRepository,
} from '../storage/scores'
import {
  cleanNickname,
  clearBucket,
  emptyBoard,
  insertScore,
  isWorthSaving,
  rankOf,
  type Bucket,
  type ScoreBoard,
  type ScoreEntry,
} from './types'

/**
 * The high-score table and the local nickname, loaded once and kept in React state.
 *
 * Writes are computed OUTSIDE the state updater. React may invoke an updater more
 * than once and StrictMode always does, so a `localStorage.setItem` living inside one
 * fires twice for every change -- a bug this project already shipped once in
 * `settings/`.
 */

/** How long the nickname field sits still before it is written (FR-34). */
const NICKNAME_SAVE_DELAY_MS = 400

export interface ScoresApi {
  board: ScoreBoard
  nickname: string
  /** `ok` · `unavailable` (storage blocked or full) · `recovered` (data was repaired). */
  status: StorageStatus
  loading: boolean
  /**
   * Record a finished round. Returns the rank it took, or `null` when the round was
   * not worth saving or did not make the top ten -- the caller uses that to decide
   * whether to say anything.
   */
  submit(bucket: Bucket, stats: Omit<ScoreEntry, 'id' | 'nickname' | 'at'>): number | null
  setNickname(next: string): void
  clear(bucket: Bucket): void
  /** Id of the entry written by the last `submit`, so the UI can point at it. */
  lastEntryId: string | null
}

const ScoresContext = createContext<ScoresApi | null>(null)

export function ScoresProvider({
  children,
  scoreRepository,
  identityRepository,
}: {
  children: React.ReactNode
  scoreRepository?: ScoreRepository
  identityRepository?: IdentityRepository
}) {
  const [board, setBoard] = useState<ScoreBoard>(emptyBoard)
  const [nickname, setNicknameState] = useState('')
  /**
   * One status per store, not one shared slot.
   *
   * Sharing one made a blocked *identity* write claim the *score table* was
   * unavailable, and made a successful write erase a `recovered` warning that was
   * still true -- the table really was permanently short.
   */
  const [scoresStatus, setScoresStatus] = useState<StorageStatus>('ok')
  const [identityStatus, setIdentityStatus] = useState<StorageStatus>('ok')
  const [loading, setLoading] = useState(true)
  const [lastEntryId, setLastEntryId] = useState<string | null>(null)

  // Built lazily: passing the call as the default argument runs it on every render
  // and throws the result away, and building one probes storage.
  const scoresRef = useRef<ScoreRepository | null>(scoreRepository ?? null)
  if (scoresRef.current === null) scoresRef.current = createScoreRepository()
  const identityRef = useRef<IdentityRepository | null>(identityRepository ?? null)
  if (identityRef.current === null) identityRef.current = createIdentityRepository()

  // Mirrors of the state, for callbacks that must not close over a stale render.
  const boardRef = useRef(board)
  boardRef.current = board
  const nicknameRef = useRef(nickname)
  nicknameRef.current = nickname

  /**
   * Whether the player has already changed something before the initial load
   * resolved. Without this the load overwrites their work -- a round that finished
   * first was dropped from state AND from the ref, so the next write put the
   * pre-round board back on disk. Unreachable with the bundled `localStorage`
   * repository, which settles on a microtask, but the injected-repository path
   * (`scoreRepository`, and the remote one ADR-0004 anticipates) makes it real.
   */
  const touchedRef = useRef({ board: false, nickname: false })

  /**
   * Write generation per store. An older write resolving after a newer one must not
   * publish its status, or a stale `ok` overwrites a fresh `unavailable`.
   */
  const genRef = useRef({ scores: 0, identity: 0 })

  const publishScores = useCallback((gen: number, next: StorageStatus) => {
    if (gen !== genRef.current.scores) return
    setScoresStatus((prev) => merge(prev, next))
  }, [])

  const publishIdentity = useCallback((gen: number, next: StorageStatus) => {
    if (gen !== genRef.current.identity) return
    setIdentityStatus((prev) => merge(prev, next))
  }, [])

  const saveBoard = useCallback(
    (next: ScoreBoard) => {
      const gen = ++genRef.current.scores
      // Fire and forget: a failed write must not block the UI, and `status` is how
      // the player finds out (NFR-REL-05).
      void scoresRef.current?.save(next).then((s) => publishScores(gen, s))
    },
    [publishScores],
  )

  useEffect(() => {
    let alive = true
    void Promise.all([scoresRef.current?.load(), identityRef.current?.load()]).then(
      ([scores, identity]) => {
        if (!alive) return
        if (scores && !touchedRef.current.board) {
          boardRef.current = scores.board
          setBoard(scores.board)
        }
        if (identity && !touchedRef.current.nickname) {
          nicknameRef.current = identity.nickname
          setNicknameState(identity.nickname)
        }
        setScoresStatus((prev) => merge(prev, scores?.status ?? 'ok'))
        setIdentityStatus((prev) => merge(prev, identity?.status ?? 'ok'))
        setLoading(false)
      },
    )
    return () => {
      alive = false
    }
  }, [])

  const submit = useCallback<ScoresApi['submit']>(
    (bucket, stats) => {
      if (!isWorthSaving(stats)) return null
      touchedRef.current.board = true

      const entry: ScoreEntry = {
        ...stats,
        // `Date.now` is fine here: this is the UI layer, not the engine, and the value
        // is a timestamp to display -- never anything the game reads back (invariant #1).
        id: newId(),
        // Cleaned here, not taken raw: the input field deliberately holds unclean text
        // so a space can be typed, and a row must never store that padding.
        nickname: cleanNickname(nicknameRef.current),
        at: Date.now(),
      }
      const next = insertScore(boardRef.current, bucket, entry)
      boardRef.current = next
      setBoard(next)
      const rank = rankOf(next, bucket, entry.id)
      // Only mark it when it is actually in the table. A round that missed the top ten
      // was evicted by `insertScore`, and pointing at an id no row holds would clear
      // the previous round's marker and highlight nothing.
      if (rank !== null) setLastEntryId(entry.id)
      saveBoard(next)
      return rank
    },
    [saveBoard],
  )

  /** Pending debounced nickname write, so it can be flushed on unmount. */
  const nickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flushNickname = useCallback(() => {
    if (nickTimerRef.current === null) return
    clearTimeout(nickTimerRef.current)
    nickTimerRef.current = null
    const gen = ++genRef.current.identity
    void identityRef.current?.save(nicknameRef.current).then((s) => publishIdentity(gen, s))
  }, [publishIdentity])

  const setNickname = useCallback(
    (raw: string) => {
      touchedRef.current.nickname = true
      // Stored raw and cleaned by the repository, so the field stays typeable: cleaning
      // on every keystroke would eat the space the moment the player types one.
      nicknameRef.current = raw
      setNicknameState(raw)
      // Debounced: saving per keystroke meant sixteen synchronous `localStorage`
      // writes to type a sixteen-character name, each one re-rendering every consumer
      // of this context -- including the play screen.
      if (nickTimerRef.current !== null) clearTimeout(nickTimerRef.current)
      nickTimerRef.current = setTimeout(flushNickname, NICKNAME_SAVE_DELAY_MS)
    },
    [flushNickname],
  )

  // A name typed and then immediately navigated away from is still the player's name.
  useEffect(() => flushNickname, [flushNickname])

  const clear = useCallback(
    (bucket: Bucket) => {
      touchedRef.current.board = true
      const next = clearBucket(boardRef.current, bucket)
      boardRef.current = next
      setBoard(next)
      setLastEntryId(null)
      saveBoard(next)
    },
    [saveBoard],
  )

  // Memoised: a fresh object literal here re-renders every consumer on any render of
  // this provider, and one of those consumers owns the play screen.
  const value = useMemo<ScoresApi>(
    () => ({
      board,
      nickname,
      status: worse(scoresStatus, identityStatus),
      loading,
      submit,
      setNickname,
      clear,
      lastEntryId,
    }),
    [board, nickname, scoresStatus, identityStatus, loading, submit, setNickname, clear, lastEntryId],
  )

  return <ScoresContext.Provider value={value}>{children}</ScoresContext.Provider>
}

export function useScores(): ScoresApi {
  const ctx = useContext(ScoresContext)
  if (ctx === null) throw new Error('useScores must be used inside <ScoresProvider>')
  return ctx
}

const ORDER: Record<StorageStatus, number> = { ok: 0, recovered: 1, unavailable: 2 }

function worse(a: StorageStatus, b: StorageStatus): StorageStatus {
  return ORDER[a] >= ORDER[b] ? a : b
}

/**
 * Fold a new status into what a store already reported.
 *
 * `recovered` survives a later `ok`: it says a record was already lost, and a
 * successful write does not bring it back. `unavailable` does NOT survive, because
 * storage coming back is real news worth reflecting.
 */
function merge(prev: StorageStatus, next: StorageStatus): StorageStatus {
  if (prev === 'recovered' && next === 'ok') return 'recovered'
  return next
}

/**
 * Unique enough for a React key and a "this row is yours" marker.
 *
 * `crypto.randomUUID` is not assumed: it is absent over plain HTTP, which is exactly
 * how someone runs the dev server on another machine on their network.
 */
function newId(): string {
  const c: Crypto | undefined = globalThis.crypto
  if (typeof c?.randomUUID === 'function') return c.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
