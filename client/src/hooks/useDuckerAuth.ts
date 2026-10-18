import { useSyncExternalStore } from 'react'
import { DUCKER_CONFIG } from '@/auth/config'
import { getServerSnapshot, getSnapshot, signIn, signOut, subscribe } from '@/auth/session'
import type { AuthSnapshot } from '@/auth/types'

export interface DuckerAuth extends AuthSnapshot {
  enabled: boolean
  profileUrl: string | null
  signIn: () => void
  signOut: () => void
}

/** The Ducker ID session as React state. `enabled` is false when the flag or any value is missing. */
export function useDuckerAuth(): DuckerAuth {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return {
    ...snapshot,
    enabled: DUCKER_CONFIG !== null,
    profileUrl: DUCKER_CONFIG ? DUCKER_CONFIG.profileUrl : null,
    signIn,
    signOut,
  }
}
