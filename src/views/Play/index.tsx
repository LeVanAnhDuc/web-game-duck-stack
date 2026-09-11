import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { COLS, VISIBLE_ROWS, type Action, type Kind } from '@/engine'
import { touchHandlers } from '@/input/touch'
import { useI18n, type MessageKey } from '@/i18n'
import { Icon, type IconName } from './components/Icon'
import { PiecePreview } from './components/PiecePreview'
import { AnimatedNumber } from './components/AnimatedNumber'
import { useBumpKey } from '@/hooks/useBumpKey'
import { useScores } from '@/scores'
import { useSettings } from '@/settings'
import { HighScoresScreen } from './mains/HighScoresScreen'
import { SettingsScreen } from './mains/SettingsScreen'
import { useGameSession, type HudSnapshot } from '@/hooks/useGameSession'

/**
 * The play screen (US-01). Layout follows the approved mockup: mobile 375 first,
 * then rails at 768, then keyboard hints and no touch band at 1024+.
 *
 * Every control in the top bar is live: settings (FR-23..FR-30), language (FR-28)
 * and the high-score table (FR-32..FR-34). Holding their space from the first build
 * meant the layout did not move when those features landed.
 */

/** Prettier than `event.code`, and short enough for a hint chip. */
function shortKey(code: string): string {
  if (code.startsWith('Key')) return code.slice(3)
  if (code.startsWith('Digit')) return code.slice(5)
  if (code === 'Space') return 'Space'
  if (code.startsWith('Shift')) return 'Shift'
  if (code.startsWith('Arrow')) return code.slice(5)
  if (code === 'Escape') return 'Esc'
  return code
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function clock(seconds: number): string {
  const total = Math.floor(seconds)
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

function Stat({ labelKey, value }: { labelKey: MessageKey; value: string }) {
  const { t } = useI18n()
  return (
    <div className="statrow">
      <span className="label">{t(labelKey)}</span>
      <span className="value value--sm">{value}</span>
    </div>
  )
}

function PadButton({
  action,
  icon,
  text,
  wide,
  send,
}: {
  action: Action
  icon?: IconName
  text?: string
  wide?: boolean
  send: (cmd: { k: 'press' | 'release'; a: Action }) => void
}) {
  const { t } = useI18n()
  // `useRef(touchHandlers(...))` evaluates its argument on every render and throws
  // the result away; lazily initialising keeps it to one per button.
  const ref = useRef<ReturnType<typeof touchHandlers> | null>(null)
  if (ref.current === null) ref.current = touchHandlers(send, action)
  const handlers = ref.current
  const label = t(`action.${action}` as MessageKey)
  return (
    <button
      type="button"
      className={wide ? 'padbtn padbtn--wide' : 'padbtn'}
      aria-label={label}
      onPointerDown={handlers.onPointerDown}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerCancel}
      onPointerLeave={handlers.onPointerLeave}
      onContextMenu={(e) => e.preventDefault()}
    >
      {icon ? <Icon name={icon} size={22} /> : text}
    </button>
  )
}

function Hint({ keys, icons, whatKey }: { keys?: string; icons?: IconName[]; whatKey: MessageKey }) {
  const { t } = useI18n()
  return (
    <div className="hint">
      <span className="hint__key">
        {icons ? icons.map((n) => <Icon key={n} name={n} size={14} />) : keys}
      </span>
      <span className="hint__what">{t(whatKey)}</span>
    </div>
  )
}

function Queue({ next, cell }: { next: readonly Kind[]; cell: number }) {
  return (
    <div className="queue">
      {next.map((kind, i) => (
        <PiecePreview key={`${kind}-${i}`} kind={kind} cell={cell} />
      ))}
    </div>
  )
}

function PausedModal({
  onResume,
  onSettings,
  onScores,
  onRestart,
}: {
  onResume: () => void
  onSettings: () => void
  onScores: () => void
  onRestart: () => void
}) {
  const { t } = useI18n()
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={t('modal.paused')}>
      <div className="modal">
        <h2 className="modal__title">{t('modal.paused')}</h2>
        <div className="modal__actions">
          <button type="button" className="btn btn--primary" onClick={onResume} autoFocus>
            <Icon name="play" size={18} />
            {t('action.resume')}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onSettings}>
            {t('action.settings')}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onScores}>
            {t('action.highScores')}
          </button>
          <button type="button" className="btn btn--danger" onClick={onRestart}>
            {t('action.restart')}
          </button>
        </div>
      </div>
    </div>
  )
}

function GameOverModal({
  hud,
  onRestart,
  onScores,
}: {
  hud: HudSnapshot
  onRestart: () => void
  onScores: () => void
}) {
  const { t, locale } = useI18n()
  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale])
  // Two decimals, but through `Intl`: `toFixed` hardcodes a `.`, so the same round
  // read 1.24 here and 1,24 in the high-score row behind it for a Vietnamese player
  // (NFR-I18N-03).
  const ppsFmt = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    [locale],
  )
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={t('modal.gameOver')}>
      <div className="modal">
        <h2 className="modal__title">{t('modal.gameOver')}</h2>
        <p className="modal__body">
          {hud.topOutReason === 'lockOut' ? t('modal.lockOut') : t('modal.blockOut')}
        </p>
        <div className="statlist">
          <Stat labelKey="hud.score" value={nf.format(hud.score)} />
          <Stat labelKey="hud.lines" value={nf.format(hud.lines)} />
          <Stat labelKey="hud.level" value={nf.format(hud.level)} />
          <Stat labelKey="hud.time" value={clock(hud.seconds)} />
          <Stat labelKey="hud.pps" value={ppsFmt.format(hud.pps)} />
        </div>
        <div className="modal__actions">
          <button type="button" className="btn btn--primary" onClick={onRestart} autoFocus>
            <Icon name="restart" size={18} />
            {t('action.playAgain')}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onScores}>
            {t('action.highScores')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Play() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scoresOpen, setScoresOpen] = useState(false)
  const anyDialogOpen = settingsOpen || scoresOpen
  // The game gives the keyboard up while a dialog is open, so its sliders, buttons
  // and the nickname field work (NFR-A11Y-02).
  const { hud, send, press, restart, livePhase } = useGameSession(canvasRef, !anyDialogOpen)
  const { t, locale } = useI18n()
  // Memoised: building an Intl formatter is not free, and this component now
  // re-renders on every HUD publish.
  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale])
  // Two decimals, but through `Intl`: `toFixed` hardcodes a `.`, so the same round
  // read 1.24 here and 1,24 in the high-score row behind it for a Vietnamese player
  // (NFR-I18N-03).
  const ppsFmt = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    [locale],
  )
  const fmt = useCallback((n: number) => nf.format(n), [nf])

  const { settings } = useSettings()
  const { submit } = useScores()

  /**
   * Record the round EXACTLY once (FR-32).
   *
   * Keyed on `hud.runId`, not on the phase: the HUD is republished about ten times a
   * second and StrictMode invokes this effect twice, so a phase-only condition writes
   * the same round to the table repeatedly. The ref survives both invocations because
   * it belongs to the component instance, not to the effect.
   */
  /**
   * The two top-bar buttons, as the place focus lands when a dialog closes and the
   * control that opened it is gone -- which is every time one is opened from the
   * paused or game-over modal, because those unmount as the dialog mounts.
   */
  const trophyRef = useRef<HTMLButtonElement | null>(null)
  const settingsBtnRef = useRef<HTMLButtonElement | null>(null)
  const focusTrophy = useCallback(() => trophyRef.current?.focus(), [])
  const focusSettings = useCallback(() => settingsBtnRef.current?.focus(), [])

  const savedRunRef = useRef(0)
  useEffect(() => {
    if (hud.phase !== 'gameOver' || hud.runId === savedRunRef.current) return
    savedRunRef.current = hud.runId
    // Board and speed come from the SNAPSHOT, not from live settings: the round's
    // gravity was frozen when it started, so changing difficulty mid-round must not
    // change which board the finished round lands in.
    submit(hud.bucket, {
      score: hud.score,
      lines: hud.lines,
      level: hud.level,
      seconds: hud.seconds,
      pps: hud.pps,
      cellsPerSecond: hud.cellsPerSecond,
    })
  }, [hud, submit])

  /** First key bound to an action, for the hint bar. */
  const keyFor = useCallback(
    (action: Action): string => {
      const code = Object.entries(settings.bindings).find(([, a]) => a === action)?.[0]
      return code ? shortKey(code) : '—'
    },
    [settings.bindings],
  )

  const paused = hud.phase === 'paused'
  const over = hud.phase === 'gameOver'

  /**
   * Opening settings pauses first: reading sliders while pieces fall is a trap.
   *
   * The decision reads the LIVE phase, not the HUD snapshot, which only refreshes
   * about ten times a second -- pausing by hand and then opening settings inside that
   * window sent a second pause and un-paused the game under the dialog.
   */
  const openSettings = useCallback(() => {
    const phase = livePhase()
    if (phase !== 'paused' && phase !== 'gameOver') press('pause')
    setSettingsOpen(true)
  }, [livePhase, press])

  /** Same rule as settings: reading a table while pieces fall is a trap. */
  const openScores = useCallback(() => {
    const phase = livePhase()
    if (phase !== 'paused' && phase !== 'gameOver') press('pause')
    setScoresOpen(true)
  }, [livePhase, press])

  // The level flashes once when it changes. The score counts up inside
  // AnimatedNumber, which writes its own text node rather than re-rendering this
  // tree at frame rate (invariant #3).
  const levelBump = useBumpKey(hud.level)

  return (
    <div className="app">
      <header className="topbar">
        <button
          type="button"
          className="icon-btn"
          aria-label={t('action.pause')}
          onClick={() => press('pause')}
        >
          <Icon name="pause" />
        </button>

        <span className="wordmark" aria-hidden="true">
          {t('app.title')}
        </span>

        <div className="topbar__stack topbar__grow">
          <span className="label">{t('hud.score')}</span>
          <AnimatedNumber className="value" value={hud.score} format={fmt} />
        </div>
        <div className="topbar__stack topbar__stack--wide">
          <span className="label">{t('hud.lines')}</span>
          <span className="value">{nf.format(hud.lines)}</span>
        </div>
        <div className="topbar__stack">
          <span className="label">{t('hud.level')}</span>
          <span key={levelBump} className="value value--bump">
            {nf.format(hud.level)}
          </span>
        </div>

        <button
          ref={trophyRef}
          type="button"
          className="icon-btn"
          aria-label={t('action.highScores')}
          onClick={openScores}
        >
          <Icon name="trophy" />
        </button>
        <button
          ref={settingsBtnRef}
          type="button"
          className="icon-btn"
          aria-label={t('action.settings')}
          onClick={openSettings}
        >
          <Icon name="sliders" />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={t('action.language')}
          onClick={openSettings}
          style={{ width: 'auto', minWidth: 44, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}
        >
          {locale.toUpperCase()}
        </button>
      </header>

      {/* Mobile only: hold and next sit above the board, because there are no rails. */}
      <div className="strip">
        <div className="strip__col">
          <span className="label">{t('hud.hold')}</span>
          <div className="slot">
            <PiecePreview kind={hud.hold} cell={12} />
          </div>
        </div>
        <div className="strip__col" style={{ flex: 1 }}>
          <span className="label">{t('hud.next')}</span>
          <Queue next={hud.next} cell={9} />
        </div>
      </div>

      <div className="main">
        <aside className="rail rail--left">
          <div className="strip__col">
            <span className="label">{t('hud.hold')}</span>
            <div className="slot">
              <PiecePreview kind={hud.hold} cell={16} />
            </div>
          </div>
          <div className="statlist">
            <Stat labelKey="hud.time" value={clock(hud.seconds)} />
            <Stat labelKey="hud.pps" value={ppsFmt.format(hud.pps)} />
            {hud.b2b ? <Stat labelKey="hud.b2b" value="×" /> : null}
            {hud.combo > 0 ? <Stat labelKey="hud.combo" value={`×${hud.combo}`} /> : null}
          </div>
        </aside>

        <div className="board-area">
          <div className="well">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={t('board.label', { cols: COLS, rows: VISIBLE_ROWS })}
            />
          </div>
        </div>

        <aside className="rail rail--right">
          <span className="label">{t('hud.next')}</span>
          <Queue next={hud.next} cell={14} />
        </aside>
      </div>

      <div className="touchband">
        <div className="touchband__cluster">
          <PadButton action="left" icon="left" send={send} />
          <PadButton action="right" icon="right" send={send} />
          <PadButton action="softDrop" icon="down" send={send} />
          <PadButton action="hold" icon="hold" send={send} />
        </div>
        <div className="touchband__cluster">
          <PadButton action="rotCCW" icon="rotateCCW" send={send} />
          <PadButton action="rotCW" icon="rotateCW" send={send} />
          <PadButton action="hardDrop" icon="hardDrop" wide send={send} />
        </div>
      </div>

      {/* Read from the actual bindings: hardcoded hints start lying the moment a
          player rebinds anything. */}
      <footer className="hints">
        <Hint icons={['left', 'right']} whatKey="hint.move" />
        <Hint icons={['down']} whatKey="hint.softDrop" />
        <Hint keys={keyFor('hardDrop')} whatKey="hint.hardDrop" />
        <Hint keys={`${keyFor('rotCCW')} / ${keyFor('rotCW')}`} whatKey="hint.rotate" />
        <Hint keys={keyFor('hold')} whatKey="hint.hold" />
        <Hint keys={keyFor('pause')} whatKey="hint.pause" />
      </footer>

      {settingsOpen ? (
        <SettingsScreen onClose={() => setSettingsOpen(false)} onFocusFallback={focusSettings} />
      ) : null}
      {scoresOpen ? (
        <HighScoresScreen
          onClose={() => setScoresOpen(false)}
          onFocusFallback={focusTrophy}
          // Only offered from a finished round: "play again" mid-pause would throw
          // away a game the player was still in.
          onRestart={
            over
              ? () => {
                  setScoresOpen(false)
                  restart()
                }
              : undefined
          }
        />
      ) : null}
      {paused && !anyDialogOpen ? (
        <PausedModal
          onResume={() => press('pause')}
          onSettings={openSettings}
          onScores={openScores}
          onRestart={restart}
        />
      ) : null}
      {over && !anyDialogOpen ? (
        <GameOverModal hud={hud} onRestart={restart} onScores={openScores} />
      ) : null}
    </div>
  )
}
