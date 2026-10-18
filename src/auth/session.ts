import { DUCKER_CONFIG } from './config'
import { capturedCallback, startLogin } from './flow'
import { exchangeCode, fetchProfile } from './requests'
import type { AuthSnapshot, CallbackResult, DuckerConfig } from './types'

/**
 * The session lives in memory only (a reload is signed out), in a small external
 * store so React reads it with useSyncExternalStore.
 */

const IDLE: AuthSnapshot = { status: 'idle', profile: null }
const SIGNED_OUT: AuthSnapshot = { status: 'signed-out', profile: null }

let snapshot: AuthSnapshot = IDLE
let started = false
const listeners = new Set<() => void>()

function set(next: AuthSnapshot): void {
  snapshot = next
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot(): AuthSnapshot {
  return snapshot
}

export function getServerSnapshot(): AuthSnapshot {
  return IDLE
}

/**
 * Exchanges code -> profile exactly ONCE per page load (StrictMode and remounts are
 * safe). Any failure falls back to signed-out: signing in is an extra, not a gate.
 * The parameters are injection points for tests, not config defaults.
 */
export function startSession(
  config: DuckerConfig | null = DUCKER_CONFIG,
  callback: CallbackResult | null = capturedCallback(),
): void {
  if (started || !config) return
  started = true
  if (!callback || callback.error || !callback.code || !callback.verifier) {
    set(SIGNED_OUT)
    return
  }
  set({ status: 'loading', profile: null })
  exchangeCode(config, callback.code, callback.verifier)
    .then((tokens) => fetchProfile(config, tokens.accessToken))
    .then(
      (profile) => set({ status: 'signed-in', profile }),
      () => set(SIGNED_OUT),
    )
}

export function signIn(): void {
  if (DUCKER_CONFIG) {
    void startLogin(DUCKER_CONFIG).catch(() => {
      // silent: sign-in is optional
    })
  }
}

/** Forget the profile in memory. The Ducker ID session stays -- that is SSO. */
export function signOut(): void {
  set(SIGNED_OUT)
}

/** Test-only. */
export function resetSessionForTests(): void {
  snapshot = IDLE
  started = false
  listeners.clear()
}

if (typeof window !== 'undefined') startSession()
