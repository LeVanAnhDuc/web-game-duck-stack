import type { RefObject } from 'react'
import { useDuckerAuth } from '@/hooks/useDuckerAuth'
import { useI18n } from '@/i18n'
import { Avatar } from '../Avatar'
import { Icon } from '../Icon'

/**
 * The top-bar entry point for optional Ducker ID sign-in. Renders nothing at all
 * while the feature is off, so the bar is exactly what it was before it existed.
 * Signed in, it is the avatar and opens the account dialog; the dialog itself lives
 * in `Play` so opening it can pause the round like the other dialogs do.
 */
export function AccountButton({
  onOpen,
  buttonRef,
}: {
  onOpen: () => void
  buttonRef: RefObject<HTMLButtonElement | null>
}) {
  const auth = useDuckerAuth()
  const { t } = useI18n()
  if (!auth.enabled) return null

  if (auth.status === 'signed-in' && auth.profile) {
    return (
      <button
        ref={buttonRef}
        type="button"
        className="icon-btn icon-btn--account"
        aria-label={t('account.menu')}
        aria-haspopup="dialog"
        onClick={onOpen}
      >
        <Avatar profile={auth.profile} />
      </button>
    )
  }

  const loading = auth.status === 'loading'
  return (
    <button
      type="button"
      className="icon-btn icon-btn--account"
      aria-label={loading ? t('account.signingIn') : t('account.signIn')}
      aria-busy={loading}
      disabled={loading}
      onClick={auth.signIn}
    >
      <Icon name="user" />
    </button>
  )
}
