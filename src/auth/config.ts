import type { DuckerConfig, DuckerEnv } from './types'

export const DUCKER_PKCE_KEY = 'ducker.pkce'

/**
 * Ducker ID sign-in is on only when the flag is exactly "true" AND all four values
 * are set. There is no default for any of them: missing means off, never a guess.
 */
export function readDuckerConfig(raw: DuckerEnv): DuckerConfig | null {
  if (raw.enabled !== 'true') return null
  const { issuer, clientId, scope, profilePath } = raw
  if (!issuer || !clientId || !scope || !profilePath) return null
  // "localhost:3000" parses as a URL with scheme "localhost:" -- reject it up front.
  if (!/^https?:\/\//.test(issuer)) return null
  try {
    return {
      issuer: new URL(issuer).origin,
      clientId,
      scope,
      profileUrl: new URL(profilePath, issuer).toString(),
    }
  } catch {
    // A malformed issuer means "not configured": the game must still load.
    return null
  }
}

// Read by literal name so Vite can inline them at build time.
export const DUCKER_CONFIG = readDuckerConfig({
  enabled: import.meta.env.VITE_FEATURE_DUCKER_SIGN_IN,
  issuer: import.meta.env.VITE_DUCKER_ISSUER,
  clientId: import.meta.env.VITE_DUCKER_CLIENT_ID,
  scope: import.meta.env.VITE_DUCKER_SCOPE,
  profilePath: import.meta.env.VITE_DUCKER_PROFILE_PATH,
})

/** App root -- the redirect_uri must match the one registered at Ducker ID exactly. */
export function appRootPath(): string {
  return import.meta.env.BASE_URL
}
