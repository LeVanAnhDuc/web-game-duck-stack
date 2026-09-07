import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n, type MessageKey } from '../i18n'
import { useScores } from '../scores'
import { BUCKETS, MAX_NICKNAME, type Bucket, type ScoreEntry } from '../scores/types'
import { useSettings } from '../settings'
import { Icon } from './Icon'

/**
 * The high-score table (FR-32 -- FR-34).
 *
 * One board per difficulty, chosen with the segmented control, and the four are never
 * merged: ADR-0013 §4 -- `easy` multiplies gravity by 0.6 and `hard` by 1.8, so a
 * combined table would rank whoever picked Easy, not whoever played best.
 *
 * The dialog shell is deliberately the same one `SettingsScreen` uses -- Escape,
 * focus trap, focus return -- because the game's keyboard listener calls
 * `preventDefault` on arrows and Space, and an unguarded dialog therefore has an
 * un-typeable text field (NFR-A11Y-02).
 */

export function HighScoresScreen({
  onClose,
  onRestart,
  onFocusFallback,
}: {
  onClose: () => void
  /**
   * Offered only from a finished round. `| undefined` is spelled out because
   * `exactOptionalPropertyTypes` is on: an optional prop and a prop that may be
   * `undefined` are different types here, and the caller passes the latter.
   */
  onRestart?: (() => void) | undefined
  /**
   * Where to put focus when the element that opened this dialog is gone.
   *
   * The paused and game-over modals are hidden in the same commit that mounts this
   * one, so by the time the mount effect runs, `document.activeElement` is already
   * `<body>` -- capturing it would "restore" focus to the top of the document and
   * drop a keyboard player back at the start of the tab order.
   */
  onFocusFallback?: (() => void) | undefined
}) {
  const { t, locale } = useI18n()
  const { settings } = useSettings()
  const { board, nickname, setNickname, clear, status, lastEntryId } = useScores()

  // Opens on the board the player is actually playing -- that is the one they want
  // to see after a round.
  const [bucket, setBucket] = useState<Bucket>(settings.difficulty)
  const [confirmClear, setConfirmClear] = useState(false)

  const closeRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => {
      // `isConnected` catches the trigger being unmounted while the dialog was open;
      // the `body` check catches it having already gone before this effect ran.
      if (previous && previous !== document.body && previous.isConnected) previous.focus()
      else onFocusFallback?.()
    }
  }, [onFocusFallback])

  /** Escape closes; Tab wraps at both ends. Same reasoning as `SettingsScreen`. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const panel = panelRef.current
      if (!panel) return
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0] as HTMLElement
      const last = focusable[focusable.length - 1] as HTMLElement
      // Focus can be outside the set even while the dialog is open: clearing a board
      // disables the very button that was focused, and the browser then moves focus
      // to `<body>`. Neither end matched, so Tab walked out of the dialog into the
      // game behind it.
      if (!panel.contains(document.activeElement)) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
        return
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  // Changing board drops a pending "are you sure": the confirmation named a board,
  // and answering it after switching would clear a different one.
  useEffect(() => {
    setConfirmClear(false)
  }, [bucket])

  const rows = board.boards[bucket]

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={t('action.highScores')}>
      <div className="modal modal--wide" ref={panelRef}>
        <div className="modal__head">
          <h2 className="modal__title">{t('action.highScores')}</h2>
          <button
            ref={closeRef}
            type="button"
            className="icon-btn"
            aria-label={t('scores.close')}
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Non-Goal: no server leaderboard. The UI must not imply one exists. */}
        <p className="modal__body scores__caveat">{t('scores.localOnly')}</p>

        {/* `role="alert"`, not `status`: a live region rendered together with its own
            text is not a mutation, so a polite region never announces it. */}
        {status === 'unavailable' ? (
          <p className="modal__body" role="alert">
            {t('scores.storageUnavailable')}
          </p>
        ) : null}
        {status === 'recovered' ? (
          <p className="modal__body" role="alert">
            {t('scores.storageRecovered')}
          </p>
        ) : null}

        {/* Labelled "Board", not "Difficulty": the identical control in the settings
            screen CHANGES the game, and hearing the same name here reads as having
            just switched difficulty. */}
        <div className="segmented segmented--fill" role="group" aria-label={t('scores.board')}>
          {BUCKETS.map((b) => (
            <button
              key={b}
              type="button"
              className="segmented__btn"
              aria-pressed={bucket === b}
              onClick={() => setBucket(b)}
            >
              {t(`settings.difficulty.${b}` as MessageKey)}
            </button>
          ))}
        </div>

        {/* The list and the nickname field share the scrolling region, and only they
            scroll. Keeping the nickname row in the fixed chrome cost the list about
            90px, which at 375 left it 128px tall holding 513px of rows -- the one
            thing the screen exists to show was the smallest part of it. */}
        <div className="modal__scroll modal__scroll--scores">
          {bucket === 'custom' && rows.length > 0 ? (
            <p className="scores__caveat">{t('scores.customCaveat')}</p>
          ) : null}
          {rows.length === 0 ? (
            <p className="scores__empty">{t('scores.empty')}</p>
          ) : (
            <ol
              className="scores"
              aria-label={t('scores.listLabel', {
                n: t(`settings.difficulty.${bucket}` as MessageKey),
              })}
            >
              {rows.map((entry, i) => (
                <Row
                  key={entry.id}
                  entry={entry}
                  rank={i + 1}
                  fresh={entry.id === lastEntryId}
                  showSpeed={bucket === 'custom'}
                  locale={locale}
                />
              ))}
            </ol>
          )}

          <div className="setrow">
            <div className="setrow__text">
              <span className="setrow__label">{t('scores.nickname')}</span>
              <span className="setrow__hint" id="nickname-hint">
                {t('scores.nicknameHint')}
              </span>
            </div>
            <div className="setrow__control">
              <input
                className="textfield"
                type="text"
                value={nickname}
                maxLength={MAX_NICKNAME}
                placeholder={t('scores.anon')}
                aria-label={t('scores.nickname')}
                aria-describedby="nickname-hint"
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>
        </div>

        {confirmClear ? (
          <p className="modal__body scores__warning" role="alert">
            {t('scores.clearWarning')}
          </p>
        ) : null}

        <div className="modal__actions">
          {onRestart ? (
            <button type="button" className="btn btn--primary" onClick={onRestart}>
              <Icon name="restart" size={18} />
              {t('action.playAgain')}
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={onClose}>
              {t('action.close')}
            </button>
          )}
          {/* Two-step, because there is no undo and no copy anywhere else. React
              reconciles both branches into the SAME button, so the accessible name
              changes under the user's focus -- silently, unless something announces
              it. The `role="alert"` above does that. */}
          {confirmClear ? (
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                clear(bucket)
                setConfirmClear(false)
                // This button becomes disabled the moment the board is empty, and a
                // browser blurs a disabled element to `<body>`.
                closeRef.current?.focus()
              }}
            >
              {t('scores.clearConfirm')}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--danger"
              disabled={rows.length === 0}
              onClick={() => setConfirmClear(true)}
            >
              {t('scores.clear')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({
  entry,
  rank,
  fresh,
  showSpeed,
  locale,
}: {
  entry: ScoreEntry
  rank: number
  fresh: boolean
  showSpeed: boolean
  locale: string
}) {
  const { t } = useI18n()
  // FR-33 and NFR-I18N-03: `at` is stored as epoch ms and formatted HERE, so changing
  // language re-formats every existing row instead of leaving old ones in the old
  // language.
  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale])
  const speed = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
    [locale],
  )
  const df = useMemo(
    // `short`, not `medium`: at 375 the meta line has about 240px and "6 thg 9, 2026
    // 22:40" pushed it to a third line, costing a whole visible row. Still fully
    // locale-formatted, which is what FR-33 asks for.
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }),
    [locale],
  )

  return (
    <li className="scorerow" data-fresh={fresh} aria-current={fresh ? 'true' : undefined}>
      {/* The digit is decorative to a screen reader -- an `<ol>` with
          `list-style: none` loses its list semantics in Safari, so the ordinal has to
          be spoken explicitly. */}
      <span className="scorerow__rank">
        <span className="sr-only">{t('scores.rankN', { n: rank })}</span>
        <span aria-hidden="true">{rank}</span>
      </span>
      <div className="scorerow__body">
        <div className="scorerow__top">
          <span className="scorerow__score">{nf.format(entry.score)}</span>
          {fresh ? <span className="sr-only">{t('scores.freshRow')}</span> : null}
          {/* `title` because the name ellipsizes: 16 characters beside a seven-digit
              score do not fit, and a truncated name with no way to read it back is
              worse than a tooltip. */}
          <span className="scorerow__name" title={entry.nickname || t('scores.anon')}>
            {entry.nickname || t('scores.anon')}
          </span>
        </div>
        <div className="scorerow__meta">
          <span>{t('scores.linesN', { n: nf.format(entry.lines) })}</span>
          <span>{t('scores.levelN', { n: nf.format(entry.level) })}</span>
          <span>
            <span className="sr-only">{t('scores.time')} </span>
            {clock(entry.seconds)}
          </span>
          <span>{t('scores.ppsN', { n: speed.format(entry.pps) })}</span>
          {showSpeed && entry.cellsPerSecond !== null ? (
            <span>{t('scores.speedN', { n: speed.format(entry.cellsPerSecond) })}</span>
          ) : null}
          <time dateTime={new Date(entry.at).toISOString()}>{df.format(entry.at)}</time>
        </div>
      </div>
    </li>
  )
}

function clock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
