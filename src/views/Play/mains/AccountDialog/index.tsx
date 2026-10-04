import { useEffect, useRef } from 'react'
import { useDuckerAuth } from '@/hooks/useDuckerAuth'
import { useI18n } from '@/i18n'
import { Avatar } from '../../components/Avatar'
import { Icon } from '../../components/Icon'

const GAME_KEYS: ReadonlySet<string> = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'Home', 'End',
])

/**
 * The Ducker ID account dialog: who is signed in, a link to their Ducker ID profile
 * and sign out. A dialog over the game, like `SettingsScreen`, rather than a popover:
 * the top bar is too tight at 375px for one, and the game gives up the keyboard
 * while any dialog is open.
 */
export function AccountDialog({
  onClose,
  onFocusFallback,
}: {
  onClose: () => void
  /** Where focus goes when the control that opened this dialog no longer exists (after sign-out). */
  onFocusFallback?: (() => void) | undefined
}) {
  const auth = useDuckerAuth()
  const { t } = useI18n()
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const open = auth.status === 'signed-in' && auth.profile !== null

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => {
      if (previous && previous !== document.body && previous.isConnected) previous.focus()
      else onFocusFallback?.()
    }
  }, [open, onFocusFallback])

  // Capture phase on window, as SettingsScreen does: Escape must not reach the game's
  // own listener, which maps it to pause.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      const panel = panelRef.current
      if (!panel) return
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
        return
      }
      // Keys the game listens to must not reach it from behind the dialog. Only
      // propagation is stopped: Space/Enter still activate the focused button.
      if (GAME_KEYS.has(e.key)) {
        e.stopPropagation()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = panel.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
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
  }, [open, onClose])

  if (!open || !auth.profile) return null
  const { profile } = auth

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('account.menu')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" ref={panelRef}>
        <div className="modal__head">
          <h2 className="modal__title">{t('account.menu')}</h2>
          <button ref={closeRef} type="button" className="icon-btn" aria-label={t('action.close')} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="account">
          <Avatar profile={profile} large />
          <div className="account__who">
            {/* No name: the email becomes the main line. No email: no email line. */}
            {profile.name || profile.email ? (
              <p className="account__name">{profile.name || profile.email}</p>
            ) : null}
            {profile.name && profile.email ? <p className="account__email">{profile.email}</p> : null}
          </div>
        </div>

        <div className="modal__actions">
          {auth.profileUrl ? (
            <a
              className="btn btn--secondary"
              href={auth.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              {t('account.openProfile')}
            </a>
          ) : null}
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              auth.signOut()
              onClose()
            }}
          >
            {t('account.signOut')}
          </button>
        </div>
      </div>
    </div>
  )
}
